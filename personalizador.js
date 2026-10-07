// =====================================================================
// personalizador.js — La camiseta cambia en vivo con lo que escoge el cliente
// Agregado por el docente. Léanlo de arriba hacia abajo:
//   1. buscamos los elementos   2. guardamos el diseño en un objeto
//   3. una función dibuja todo  4. cada control llama a esa función
//   5. fabricar y descargar la vista previa
//   6. enviar el pedido al servidor (app.py), que lo guarda en MySQL
// =====================================================================

const TELEFONO = '573505186236'            // 57 (Colombia) + celular, sin espacios ni '+'
const PESO_MAXIMO = 5 * 1024 * 1024        // 5 MB en bytes

// ---------- 1. Los elementos de la página ----------
const svg = document.getElementById('camisetas')
const telas = svg.querySelectorAll('.tela')
const detalles = svg.querySelectorAll('.detalle')
const dorsales = svg.querySelectorAll('.dorsal')
const imagenFrente = document.getElementById('imagen-frente')
const imagenEspalda = document.getElementById('imagen-espalda')
const textoNombre = document.getElementById('svg-nombre')
const textoNumero = document.getElementById('svg-numero')

const formulario = document.getElementById('form-personalizador')
const archivo = document.getElementById('archivo')
const ajustes = document.getElementById('ajustes-imagen')
const tamano = document.getElementById('tamano')
const vertical = document.getElementById('vertical')
const horizontal = document.getElementById('horizontal')
const mezclar = document.getElementById('mezclar')
const campoNombre = document.getElementById('dorsal-nombre')
const campoNumero = document.getElementById('dorsal-numero')

// ---------- 2. El diseño del cliente, todo en un solo objeto ----------
const diseno = {
    tela:    { color: '#5b1a9e', nombre: 'Morado A.W.M.H.V' },
    detalle: { color: '#f6c312', nombre: 'Dorado' },
    imagen:  null,          // la imagen como texto (data URL), para mostrarla en el SVG
    archivo: null,          // el archivo original, para enviarlo al servidor
    archivoNombre: '',
    lugar: 'frente',        // 'frente' o 'espalda'
    nombre: '',
    numero: ''
}

// ---------- 3. Dibujar: pone el diseño en el SVG ----------
function dibujar() {
    telas.forEach(t => t.setAttribute('fill', diseno.tela.color))
    detalles.forEach(d => d.setAttribute('stroke', diseno.detalle.color))
    dorsales.forEach(d => d.setAttribute('fill', diseno.detalle.color))

    // Nombre: si es largo, la letra se hace más pequeña para que quepa
    textoNombre.textContent = diseno.nombre
    const tamanoLetra = diseno.nombre.length > 7 ? Math.max(30, 52 * 7 / diseno.nombre.length) : 52
    textoNombre.setAttribute('font-size', tamanoLetra)
    textoNumero.textContent = diseno.numero

    dibujarImagen()
}

function dibujarImagen() {
    // Primero escondemos la imagen en los dos lados...
    for (const img of [imagenFrente, imagenEspalda]) {
        img.setAttribute('href', '')
        img.setAttribute('width', 0)
        img.setAttribute('height', 0)
    }
    if (!diseno.imagen) return

    // ...y la ponemos solo en el lado escogido.
    // La camiseta mide 400 px de ancho: el centro del pecho está en x = 200.
    const img = diseno.lugar === 'frente' ? imagenFrente : imagenEspalda
    const ancho = 200 * tamano.value / 100              // el tamaño es un porcentaje de 200 px
    const x = 200 + Number(horizontal.value) - ancho / 2
    const y = 95 + Number(vertical.value)

    img.setAttribute('href', diseno.imagen)
    img.setAttribute('x', x)
    img.setAttribute('y', y)
    img.setAttribute('width', ancho)
    img.setAttribute('height', ancho)
    // 'multiply' mezcla la imagen con la tela: el blanco desaparece
    img.style.mixBlendMode = mezclar.checked ? 'multiply' : 'normal'
}

// ---------- 4. Los controles ----------

// Colores con muestras (radio buttons) y un selector "Otro"
function conectarColores(nombreGrupo, idOtro, parte) {
    const otro = document.getElementById(idOtro)
    document.querySelectorAll(`input[name="${nombreGrupo}"]`).forEach(radio => {
        radio.addEventListener('change', () => {
            diseno[parte] = { color: radio.value, nombre: radio.dataset.nombre }
            otro.parentElement.classList.remove('activo')
            dibujar()
        })
    })
    otro.addEventListener('input', () => {
        document.querySelectorAll(`input[name="${nombreGrupo}"]`).forEach(r => r.checked = false)
        otro.parentElement.classList.add('activo')
        diseno[parte] = { color: otro.value, nombre: 'Personalizado ' + otro.value }
        dibujar()
    })
}
conectarColores('tela', 'tela-otro', 'tela')
conectarColores('detalle', 'detalle-otro', 'detalle')

// La imagen: se revisa y se lee en el navegador, no se sube a ningún servidor
archivo.addEventListener('change', () => {
    const errorImagen = document.getElementById('error-imagen')
    errorImagen.textContent = ''
    const elegido = archivo.files[0]
    if (!elegido) return

    if (!['image/png', 'image/jpeg', 'image/webp'].includes(elegido.type)) {
        errorImagen.textContent = 'Ese archivo no es una imagen PNG, JPG o WEBP. Escoge otro.'
        archivo.value = ''
        return
    }
    if (elegido.size > PESO_MAXIMO) {
        errorImagen.textContent = 'La imagen pesa más de 5 MB. Escoge una más liviana.'
        archivo.value = ''
        return
    }

    // FileReader convierte la imagen en un texto largo (data URL) que el SVG puede mostrar
    const lector = new FileReader()
    lector.onload = () => {
        diseno.imagen = lector.result
        diseno.archivo = elegido
        diseno.archivoNombre = elegido.name
        ajustes.hidden = false
        dibujar()
    }
    lector.readAsDataURL(elegido)
})

document.querySelectorAll('input[name="lugar"]').forEach(radio => {
    radio.addEventListener('change', () => {
        diseno.lugar = radio.value
        vertical.value = 0
        horizontal.value = 0
        dibujar()
    })
})

for (const control of [tamano, vertical, horizontal, mezclar]) {
    control.addEventListener('input', dibujarImagen)
}

document.getElementById('quitar-imagen').addEventListener('click', () => {
    diseno.imagen = null
    diseno.archivo = null
    diseno.archivoNombre = ''
    archivo.value = ''
    ajustes.hidden = true
    dibujar()
})

// Nombre: solo letras (con tildes y Ñ), en mayúscula y sin espacios dobles.
// Cuando lo pasen a Flask, esta misma limpieza se repite en el servidor,
// porque cualquiera puede apagar el JavaScript del navegador.
campoNombre.addEventListener('input', () => {
    const limpio = campoNombre.value
        .toUpperCase()
        .replace(/[^A-ZÁÉÍÓÚÜÑ ]/g, '')
        .replace(/ {2,}/g, ' ')
        .slice(0, 12)
    campoNombre.value = limpio
    diseno.nombre = limpio.trim()
    dibujar()
})

// Número: solo dígitos, máximo dos
campoNumero.addEventListener('input', () => {
    campoNumero.value = campoNumero.value.replace(/\D/g, '').slice(0, 2)
    diseno.numero = campoNumero.value
    dibujar()
})

// ---------- 5. La vista previa como imagen PNG ----------
// Truco: el SVG se convierte en texto, ese texto se carga como imagen
// y la imagen se pinta en un <canvas>, que sí se puede guardar como PNG.
// La función devuelve una Promesa: el PNG no está listo de inmediato.
function crearVistaPrevia() {
    return new Promise((listo, fallo) => {
        const copia = svg.cloneNode(true)
        copia.setAttribute('xmlns', 'http://www.w3.org/2000/svg')
        copia.setAttribute('width', 1680)
        copia.setAttribute('height', 940)
        const texto = new XMLSerializer().serializeToString(copia)

        const dibujo = new Image()
        dibujo.onload = () => {
            const lienzo = document.createElement('canvas')
            lienzo.width = 1680
            lienzo.height = 940
            const pincel = lienzo.getContext('2d')
            pincel.fillStyle = '#160428'                 // el mismo fondo oscuro de la página
            pincel.fillRect(0, 0, lienzo.width, lienzo.height)
            pincel.drawImage(dibujo, 0, 0)
            lienzo.toBlob(listo, 'image/png')            // Blob = el archivo PNG en memoria
        }
        dibujo.onerror = fallo
        dibujo.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(texto)
    })
}

document.getElementById('descargar').addEventListener('click', async () => {
    const png = await crearVistaPrevia()
    const enlace = document.createElement('a')
    enlace.download = 'mi-camiseta-awmhv.png'
    enlace.href = URL.createObjectURL(png)
    enlace.click()
})

// ---------- 6. Enviar el pedido al servidor ----------
const resultado = document.getElementById('resultado')
const botonEnviar = document.getElementById('enviar')

function mostrarResultado(tipo, html) {
    resultado.className = 'resultado ' + tipo     // 'exito' o 'fallo' (colores en el CSS)
    resultado.innerHTML = html
    resultado.hidden = false
    resultado.scrollIntoView({ behavior: 'smooth', block: 'center' })
}

// Para mostrar texto del usuario dentro de HTML sin que se convierta en etiquetas
function seguro(texto) {
    const div = document.createElement('div')
    div.textContent = texto
    return div.innerHTML
}

// Revisa los campos obligatorios. Devuelve true si todo está bien.
function revisarCampos() {
    const reglas = [
        ['descripcion', 'error-descripcion', v => v !== '', 'Cuéntanos cómo quieres tu camiseta.'],
        ['cliente', 'error-cliente', v => v !== '', 'Escribe tu nombre para saber a quién responder.'],
        ['celular', 'error-celular', v => /^\+?\d{7,15}$/.test(v.replace(/[\s-]/g, '')),
            'Escribe tu celular solo con números, por ejemplo 300 123 4567.']
    ]
    let primeroMalo = null
    for (const [id, idError, esValido, mensaje] of reglas) {
        const valor = document.getElementById(id).value.trim()
        const bien = esValido(valor)
        document.getElementById(idError).textContent = bien ? '' : mensaje
        if (!bien && !primeroMalo) primeroMalo = document.getElementById(id)
    }
    if (primeroMalo) primeroMalo.focus()
    return primeroMalo === null
}

formulario.addEventListener('submit', async (evento) => {
    evento.preventDefault()   // evita que la página se recargue
    if (!revisarCampos()) return

    botonEnviar.disabled = true
    botonEnviar.textContent = 'Enviando…'

    // FormData es como un formulario invisible: lleva textos y archivos juntos
    const datos = new FormData()
    datos.append('cliente', document.getElementById('cliente').value.trim())
    datos.append('celular', document.getElementById('celular').value.trim())
    datos.append('corte', document.getElementById('corte').value)
    datos.append('talla', document.getElementById('talla').value)
    datos.append('tela_hex', diseno.tela.color)
    datos.append('tela_nombre', diseno.tela.nombre)
    datos.append('detalle_hex', diseno.detalle.color)
    datos.append('detalle_nombre', diseno.detalle.nombre)
    datos.append('nombre_dorsal', diseno.nombre)
    datos.append('numero_dorsal', diseno.numero)
    datos.append('descripcion', document.getElementById('descripcion').value.trim())
    if (diseno.imagen) {
        datos.append('imagen', diseno.archivo)
        datos.append('lugar_imagen', diseno.lugar)
    }

    try {
        datos.append('vista_previa', await crearVistaPrevia(), 'vista-previa.png')

        // fetch envía los datos a app.py (ruta /pedido) sin salir de la página
        const respuesta = await fetch('/pedido', { method: 'POST', body: datos })
        const tipo = respuesta.headers.get('Content-Type') || ''
        if (!tipo.includes('application/json')) throw new Error('El servidor no es Flask')
        const json = await respuesta.json()

        if (json.ok) {
            const aviso = `Hola A.W.M.H.V Sport, acabo de hacer el pedido #${json.numero}.`
            mostrarResultado('exito', `
                <h2>¡Pedido #${json.numero} recibido!</h2>
                <p>Lo guardamos con tu imagen y la vista previa. Te escribiremos al
                   ${seguro(document.getElementById('celular').value)} para confirmar el precio y la entrega.</p>
                <p><a href="https://wa.me/${TELEFONO}?text=${encodeURIComponent(aviso)}" target="_blank">
                   Si tienes afán, escríbenos por WhatsApp</a></p>`)
            botonEnviar.textContent = 'Pedido enviado'
            return
        }
        // El servidor revisó y algo no está bien: mostramos sus mensajes
        mostrarResultado('fallo', `<h2>Revisa tu pedido</h2>
            <ul>${json.errores.map(e => `<li>${seguro(e)}</li>`).join('')}</ul>`)
    } catch (error) {
        console.warn('No se pudo hablar con app.py:', error)
        mostrarResultado('fallo', `<h2>No pudimos enviar tu pedido</h2>
            <p>Revisa tu conexión e intenta de nuevo.</p>
            <p class="ayuda">Si estás probando en tu computador: esta página debe abrirse desde Flask
               (<strong>http://127.0.0.1:5000/Deportivo.html</strong>), no desde XAMPP.</p>`)
    }
    botonEnviar.disabled = false
    botonEnviar.textContent = 'Enviar pedido'
})

// Primer dibujo al abrir la página
dibujar()
