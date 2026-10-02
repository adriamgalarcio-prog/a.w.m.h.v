# Correcciones del docente — A.W.M.H.V Sport

**Fecha:** 2 de octubre de 2026
**Sobre la versión:** commit `a3e0bcb` ("Ropa2")

Su diseño **no se cambió**: los colores, las imágenes, los textos y la organización son los mismos.
Solo se corrigieron errores. Cada uno viene explicado para que entiendan **por qué** estaba mal
y no lo vuelvan a cometer.

> Para ver exactamente qué cambió en cada archivo: `git show` en la rama `profe` (o `git diff main profe`).

---

## 1. Un `id` no se puede repetir

**Dónde:** `Inicio.html` — las 44 tarjetas tenían `id="shop"`.

**Por qué está mal:** un `id` es como el número de cédula: identifica a **un solo** elemento.
Si hay 44 elementos con el mismo `id`, el navegador y JavaScript solo encuentran el primero.
Para darle el mismo estilo a muchos elementos se usa `class`, y las tarjetas ya tenían `class="card"`.

```html
<!-- Antes -->
<a href="clothes.html"class="card" id="shop">
<!-- Ahora -->
<a href="clothes.html" class="card">
```

También faltaba un **espacio** entre `href="..."` y `class`. Entre dos atributos siempre va un espacio.

## 2. Mayúsculas en los nombres de archivo

**Dónde:** todas las páginas pedían el ícono `Img/logo.png`, pero el archivo se llama `Img/Logo.png`.

**Por qué está mal:** el Mac no distingue mayúsculas de minúsculas, así que en su computador sí carga.
Los servidores de internet usan Linux, que **sí** las distingue: allá el ícono no aparece.
Regla: escriban el nombre **exactamente** como está el archivo.

## 3. Los botones "Ver más" del inicio llevaban al login

**Dónde:** `Index.html`.

Ahora cada botón lleva a su grupo en el catálogo. En `Inicio.html` se agregó un `id` a cada grupo:

| Botón | Va a |
|---|---|
| Camisa deportiva | `Inicio.html#camisetas` |
| Pantalonetas deportivas | `Inicio.html#pantalonetas` |
| Guayos | `Inicio.html#guayos` |
| Guantes deportivos | `Inicio.html#guantes` |

El `#` en un enlace lleva a la parte de la página que tiene ese `id`. (Por eso el `id` no se puede repetir: punto 1.)

## 4. Error de ortografía en un `id`

`id="Maculino"` pasó a `id="Masculino"` en `Inicio.html` y en las 16 páginas `clothes*.html`
que regresan a esa sección. Si cambian un `id`, hay que cambiar **todos** los enlaces que lo usan.

## 5. Enlace "Shop" roto en Marcas

`Marcas.html` enlazaba a `Index.html#shop`, pero el catálogo está en `Inicio.html`. Ahora va a `Inicio.html`.

## 6. El login no tenía estilos

`login.html` no cargaba ninguna hoja de estilos y se veía como texto plano. Se le agregó
`style3.css`, la misma que usa `register.html`. También se le agregó la flecha para volver al
inicio y el enlace "¿No tienes una cuenta? Regístrate".

> **Ojo:** el login y el registro **no pueden funcionar** en una página HTML sola, porque verificar
> una contraseña necesita un servidor y una base de datos. Esto se hace en Flask. Además, en el
> proyecto acordamos **no** pedir registro a los clientes.

## 7. El formulario de contacto ahora envía el mensaje por WhatsApp

**Antes:** al presionar "Enviar", la página solo se recargaba y el mensaje se perdía.

**Ahora:** el archivo nuevo `contacto.js` toma el nombre, el correo y el mensaje, y abre WhatsApp
al +57 350 518 6236 con el texto ya escrito. Léanlo: está comentado línea por línea.

Las dos ideas clave:
- `evento.preventDefault()` evita que el formulario recargue la página.
- `encodeURIComponent()` convierte los espacios, tildes y la ñ a un formato que se puede poner en un enlace.

Este mismo truco es el que usarán para enviar el **pedido** por WhatsApp.

## 8. Los `<` y `>` del carrusel

**Dónde:** `Index.html`, botones del carrusel.

`<` y `>` son los caracteres con los que se escriben las etiquetas HTML. Para mostrarlos como
texto se escriben `&lt;` (*less than*) y `&gt;` (*greater than*). También se les agregó
`aria-label` para que un lector de pantalla diga "Anterior" y "Siguiente".

## 9. Texto alternativo de las imágenes

Todas las imágenes de productos tenían `alt="Card 1"`. Ahora el `alt` dice el nombre del
producto (`alt="AC Milan"`). El `alt` lo leen las personas ciegas y Google, y se muestra si la imagen no carga.

## 10. Idioma de la página

`<html lang="en">` pasó a `<html lang="es">` en todas las páginas. Con esto el navegador sabe que
el texto está en español y no ofrece traducirlo.

## 11. CSS con valores inválidos

En `Style.css`, `style2.css` y `marcas.css`:

| Antes | Ahora | Por qué |
|---|---|---|
| `padding: 0 15;` | `padding: 0 15px;` | Sin unidad (`px`), el navegador ignora la línea |
| `transition: all, 50ms ease;` | `transition: all 50ms ease;` | La coma sobraba |
| `cursor: none;` | `cursor: default;` | `none` **esconde** el mouse al pasar por el pie de página |

## 12. La página en el celular

Antes, en un celular la página se salía por la derecha: el menú quedaba cortado ("Contacto" no
se veía), el banner desaparecía y las tarjetas medían 750–850 px fijos.

Al final de `Style.css`, `style2.css`, `marcas.css`, `Cards.css` y `carussel.css` hay un bloque
`@media (max-width: 768px)`. Esas reglas **solo** se aplican en pantallas pequeñas:
- el menú baja a otra línea si no cabe (`flex-wrap: wrap`);
- las tarjetas usan el ancho de la pantalla;
- el banner y el carrusel se hacen más bajos.

En el computador la página se ve igual que antes.

## 13. Imagen demasiado pesada

`Img/flechita.png` medía 1254 × 1254 píxeles (**907 KB**) y se muestra a 50 píxeles.
Se redujo a 128 × 128 (**9 KB**): pesa 100 veces menos y se ve igual.
Regla: la imagen no debe ser mucho más grande que el tamaño al que se muestra.

---

## Lo que queda para ustedes

No se corrigió porque son decisiones suyas o porque falta contenido:

- [ ] **Imágenes que no se usan** en ninguna página (unos 3,5 MB): `Img/AWMHV.png`, `Img/AWMHV2.png`,
      `Img/Barcelona.png`, `Img/Fondo-inicio-2.png`, `Img/Fondo.png`, `Img/Promo1.png` a `Img/Promo4.png`,
      `Img/logo2.png`, `Img/sport.png`. Bórrenlas o úsenlas.
- [ ] **`Ayudas/Whatsapp`** es un pedazo de CSS sin extensión que ninguna página usa, y tiene un
      error: `.contaainer-modal`. Bórrenlo o conviértanlo en `whatsapp.css`.
- [ ] **Enlaces vacíos** (`href="#"`): "Nosotros" en el menú, y en el pie de página "Nuestros servicios",
      "Mapa del sitio", "Compras y devoluciones", "Medios de pago" y los de "Legal". Hagan la página
      o quiten el enlace: un enlace que no lleva a nada se ve como un error.
- [ ] **44 páginas casi iguales** (`clothes1-16`, `Woman1-12`, `Extras1-16`). Funcionan, pero si
      mañana cambia un precio hay que abrir el archivo a mano. En Flask se vuelven **una sola**
      plantilla `producto.html` que lee los datos de la tabla `camisetas`. Este es el siguiente paso del proyecto.
- [ ] **El personalizador de nombre y número**, el carrito y el pedido por WhatsApp (la función
      estrella del proyecto) todavía no existen. `app.py` está vacío.
