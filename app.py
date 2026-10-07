# =====================================================================
# app.py — Servidor de A.W.M.H.V Sport (Flask + MySQL)
#
# Qué hace este archivo:
#   1. Muestra las páginas del sitio (Index.html, Inicio.html...)
#   2. Recibe los pedidos del personalizador y los guarda en MySQL
#   3. Muestra el panel de pedidos (/pedidos), protegido con usuario y clave
#
# Cómo encenderlo:  python3 app.py   y abrir  http://127.0.0.1:5000
# =====================================================================

import hmac
import os
import re
import uuid
from functools import wraps

import pymysql
from flask import (Flask, Response, abort, jsonify, redirect,
                   render_template, request, send_from_directory, url_for)

import config

CARPETA = os.path.dirname(os.path.abspath(__file__))     # la carpeta del proyecto
SUBIDAS = os.path.join(CARPETA, 'subidas')               # aquí se guardan las imágenes de los pedidos
PESO_MAXIMO = 5 * 1024 * 1024                            # 5 MB, igual que en personalizador.js
os.makedirs(SUBIDAS, exist_ok=True)                      # crea subidas/ si no existe

app = Flask(__name__, static_folder=None)                # static_folder=None: las páginas las servimos nosotros (parte 1)
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024      # ningún envío puede pesar más de 16 MB


def conectar():
    """Abre una conexión con MySQL. Cada consulta abre y cierra la suya."""
    return pymysql.connect(
        host=config.BD_SERVIDOR, port=config.BD_PUERTO,
        user=config.BD_USUARIO, password=config.BD_CLAVE,
        database=config.BD_NOMBRE, charset='utf8mb4',
        cursorclass=pymysql.cursors.DictCursor,           # cada fila llega como diccionario: fila['cliente']
    )


# ---------------------------------------------------------------------
# 1. LAS PÁGINAS DEL SITIO
# Solo se entregan archivos de página (html, css, js, imágenes).
# Así nadie puede descargar app.py, config.py (¡tiene las claves!) ni la carpeta subidas/.
# ---------------------------------------------------------------------
EXTENSIONES_PUBLICAS = {'.html', '.css', '.js', '.png', '.jpg', '.jpeg', '.webp', '.gif', '.svg', '.ico'}
CARPETAS_PRIVADAS = {'subidas', 'templates', 'venv', '__pycache__'}


@app.route('/')
def inicio():
    return redirect('/Index.html')


@app.route('/<path:archivo>')
def pagina(archivo):
    partes = archivo.split('/')
    extension = os.path.splitext(archivo)[1].lower()
    if (partes[0] in CARPETAS_PRIVADAS
            or any(p.startswith('.') for p in partes)        # .git, .gitignore...
            or extension not in EXTENSIONES_PUBLICAS):
        abort(404)
    return send_from_directory(CARPETA, archivo)


# ---------------------------------------------------------------------
# 2. RECIBIR UN PEDIDO
# El navegador ya revisó todo, pero el servidor REVISA OTRA VEZ:
# cualquiera puede apagar el JavaScript o enviar datos falsos.
# ---------------------------------------------------------------------
FIRMAS = {                       # los primeros bytes de cada tipo de imagen ("bytes mágicos")
    b'\x89PNG': 'png',
    b'\xff\xd8\xff': 'jpg',
}


def tipo_de_imagen(datos):
    """Mira los primeros bytes del archivo. No confiamos en el nombre: 'virus.exe' se puede llamar 'foto.png'."""
    for firma, extension in FIRMAS.items():
        if datos.startswith(firma):
            return extension
    if datos[:4] == b'RIFF' and datos[8:12] == b'WEBP':
        return 'webp'
    return None


def guardar_imagen(archivo, solo_png=False):
    """Revisa y guarda una imagen en subidas/. Devuelve (nombre_guardado, error)."""
    datos = archivo.read()
    if len(datos) > PESO_MAXIMO:
        return None, 'La imagen pesa más de 5 MB.'
    tipo = tipo_de_imagen(datos)
    if tipo is None or (solo_png and tipo != 'png'):
        return None, 'El archivo no es una imagen válida.'
    nombre = f'{uuid.uuid4().hex}.{tipo}'      # nombre al azar: nunca se repite ni se adivina
    with open(os.path.join(SUBIDAS, nombre), 'wb') as f:
        f.write(datos)
    return nombre, None


def texto(campo, maximo):
    """Lee un campo del formulario, sin espacios a los lados y sin pasarse del máximo."""
    return request.form.get(campo, '').strip()[:maximo]


@app.route('/pedido', methods=['POST'])
def recibir_pedido():
    errores = []

    cliente = texto('cliente', 80)
    celular = re.sub(r'[\s-]', '', request.form.get('celular', ''))      # quitar espacios y guiones
    corte = request.form.get('corte', '')
    talla = request.form.get('talla', '')
    tela_hex = request.form.get('tela_hex', '')
    tela_nombre = texto('tela_nombre', 25)
    detalle_hex = request.form.get('detalle_hex', '')
    detalle_nombre = texto('detalle_nombre', 25)
    nombre_dorsal = texto('nombre_dorsal', 20).upper()
    numero_dorsal = texto('numero_dorsal', 5)
    lugar = request.form.get('lugar_imagen', '')
    descripcion = texto('descripcion', 1000)

    if not cliente:
        errores.append('Falta el nombre del cliente.')
    if not re.fullmatch(r'\+?\d{7,15}', celular):
        errores.append('El celular debe tener solo números (entre 7 y 15).')
    if corte not in ('Hombre', 'Mujer'):
        errores.append('El corte no es válido.')
    if talla not in ('S', 'M', 'L', 'XL'):
        errores.append('La talla no es válida.')
    if not re.fullmatch(r'#[0-9a-fA-F]{6}', tela_hex) or not re.fullmatch(r'#[0-9a-fA-F]{6}', detalle_hex):
        errores.append('Los colores no son válidos.')
    # Las mismas reglas del navegador: solo letras (con tildes y Ñ), máximo 12
    if nombre_dorsal and not re.fullmatch(r'[A-ZÁÉÍÓÚÜÑ ]{1,12}', nombre_dorsal):
        errores.append('El nombre de la espalda solo puede tener letras (máximo 12).')
    if numero_dorsal and not re.fullmatch(r'\d{1,2}', numero_dorsal):
        errores.append('El número debe tener 1 o 2 cifras.')
    if not descripcion:
        errores.append('Falta la descripción.')

    imagen = request.files.get('imagen')
    vista = request.files.get('vista_previa')
    if imagen and lugar not in ('frente', 'espalda'):
        errores.append('Falta decir si la imagen va en el frente o en la espalda.')
    if not vista:
        errores.append('Falta la vista previa de la camiseta.')

    if errores:
        return jsonify(ok=False, errores=errores), 400

    # Guardar los archivos (solo si todo lo demás está bien)
    nombre_imagen = None
    if imagen:
        nombre_imagen, error = guardar_imagen(imagen)
        if error:
            return jsonify(ok=False, errores=[error]), 400
    nombre_vista, error = guardar_imagen(vista, solo_png=True)
    if error:
        borrar_archivos(nombre_imagen)
        return jsonify(ok=False, errores=['La vista previa no es válida.']), 400

    # Guardar el pedido. Los %s los llena PyMySQL: así nadie puede meter
    # código SQL escribiendo cosas raras en el formulario (inyección SQL).
    sql = '''INSERT INTO pedidos
             (cliente, celular, corte, talla, color_tela, color_detalle,
              nombre_dorsal, numero_dorsal, descripcion, imagen, lugar_imagen, vista_previa)
             VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)'''
    valores = (cliente, celular, corte, talla,
               f'{tela_nombre} ({tela_hex})', f'{detalle_nombre} ({detalle_hex})',
               nombre_dorsal or None, numero_dorsal or None, descripcion,
               nombre_imagen, lugar if nombre_imagen else None, nombre_vista)
    try:
        conexion = conectar()
        with conexion.cursor() as cursor:
            cursor.execute(sql, valores)
            numero = cursor.lastrowid          # el id que MySQL le dio al pedido
        conexion.commit()
        conexion.close()
    except pymysql.MySQLError as error:
        print('Error de MySQL:', error)        # el detalle sale en la terminal, no al cliente
        borrar_archivos(nombre_imagen, nombre_vista)
        return jsonify(ok=False, errores=['No se pudo guardar el pedido. Intenta de nuevo en un momento.']), 500

    return jsonify(ok=True, numero=numero)


def borrar_archivos(*nombres):
    """Si el pedido no se pudo guardar, borramos las imágenes que ya se habían guardado."""
    for nombre in nombres:
        if nombre:
            ruta = os.path.join(SUBIDAS, nombre)
            if os.path.exists(ruta):
                os.remove(ruta)


@app.errorhandler(413)
def demasiado_grande(_):
    return jsonify(ok=False, errores=['Los archivos pesan demasiado.']), 413


@app.errorhandler(pymysql.MySQLError)
def sin_base_de_datos(error):
    # El error más común: MySQL está apagado en XAMPP o no se creó la base de datos
    print('Error de MySQL:', error)
    return ('<h1>No hay conexión con la base de datos</h1>'
            '<p>Revisen que MySQL esté encendido en el panel de XAMPP y que hayan '
            'ejecutado <code>basedatos.sql</code> en phpMyAdmin. Luego recarguen la página.</p>'), 500


# ---------------------------------------------------------------------
# 3. EL PANEL DE PEDIDOS (solo para la tienda)
# El navegador pide usuario y contraseña (los de config.py).
# ---------------------------------------------------------------------
def requiere_clave(funcion):
    @wraps(funcion)
    def protegida(*args, **kwargs):
        datos = request.authorization
        if (datos is None
                or not hmac.compare_digest(datos.username or '', config.PANEL_USUARIO)
                or not hmac.compare_digest(datos.password or '', config.PANEL_CLAVE)):
            return Response('Se necesita usuario y contraseña.', 401,
                            {'WWW-Authenticate': 'Basic realm="Pedidos AWMHV"'})
        return funcion(*args, **kwargs)
    return protegida


ESTADOS = ['nuevo', 'estampando', 'listo', 'entregado', 'cancelado']


@app.route('/pedidos')
@requiere_clave
def ver_pedidos():
    conexion = conectar()
    with conexion.cursor() as cursor:
        cursor.execute('SELECT * FROM pedidos ORDER BY id DESC')
        pedidos = cursor.fetchall()
    conexion.close()
    return render_template('pedidos.html', pedidos=pedidos, estados=ESTADOS)


@app.route('/pedidos/<int:numero>/estado', methods=['POST'])
@requiere_clave
def cambiar_estado(numero):
    estado = request.form.get('estado')
    if estado not in ESTADOS:
        abort(400)
    conexion = conectar()
    with conexion.cursor() as cursor:
        cursor.execute('UPDATE pedidos SET estado = %s WHERE id = %s', (estado, numero))
    conexion.commit()
    conexion.close()
    return redirect(url_for('ver_pedidos') + f'#pedido-{numero}')


@app.route('/pedidos/archivo/<nombre>')
@requiere_clave
def archivo_pedido(nombre):
    # Las imágenes de los clientes solo se ven desde el panel, con clave
    return send_from_directory(SUBIDAS, nombre)


if __name__ == '__main__':
    # debug=True: se reinicia solo cuando cambian el código. Solo para practicar en su computador.
    app.run(debug=True)
