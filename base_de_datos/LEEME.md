# Base de datos — A.W.M.H.V Sport

`awmhv_sport.sql` crea la base de datos **awmhv_sport** con la tabla **pedidos**.

## Importarla (una sola vez por computador)

1. En el panel de XAMPP, enciendan **MySQL**.
2. Abran **http://localhost/phpmyadmin**.
3. Arriba, pestaña **Importar**.
4. **Seleccionar archivo** → escojan `awmhv_sport.sql` (está en esta carpeta).
5. Bajen y presionen **Importar**.
6. A la izquierda debe aparecer **awmhv_sport** y, adentro, **pedidos**.

Importarla otra vez no borra nada: el archivo usa `IF NOT EXISTS`.

## Ver los pedidos

- En phpMyAdmin: **awmhv_sport** → **pedidos** → pestaña **Examinar**.
- O en el panel de la tienda: **http://127.0.0.1:5000/pedidos** (con `python3 app.py` encendido).

## Dónde queda cada cosa

| Qué | Dónde |
|---|---|
| Los datos de los pedidos | Dentro de MySQL de XAMPP (no en esta carpeta) |
| Las imágenes de los pedidos | En la carpeta `subidas/` del proyecto |
| Este archivo `.sql` | Solo trae las instrucciones para **crear** la base, no los pedidos |

## Si en otro computador ya existe una base con pedidos y quieren llevarla

En phpMyAdmin: **awmhv_sport** → pestaña **Exportar** → **Continuar**. Se descarga un `.sql`
**con** los pedidos, que se importa igual en el otro computador. Copien también la carpeta `subidas/`,
porque ahí están las imágenes.
