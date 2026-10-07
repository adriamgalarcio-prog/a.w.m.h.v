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

---

## Segunda entrega: cambios de diseño

**1. Menú fijo arriba (sticky).** En `Style.css`, `style2.css` y `marcas.css` el `header` tiene
`position: sticky; top: 0;`. El menú se queda arriba mientras bajan por la página.
- En `Inicio.html` no funcionaba porque `style2.css` le ponía `height: 100vh` al `body`: un
  elemento sticky solo se queda fijo **dentro de su contenedor**, y el body medía una sola
  pantalla. El fondo ahora está en `body::before`, así que se ve igual pero el menú sí se queda.
- `scroll-margin-top` evita que, al saltar a `#guayos` o `#Masculino`, el título quede escondido detrás del menú.

**2. Títulos de sección que se leen.** "Ropa Para hombre" era negro sobre el fondo oscuro.
Ahora los títulos de `Inicio.html` son blancos sobre una franja morada: se leen igual sobre el
fondo oscuro que sobre el blanco.

**3. Portada nueva (hero) en `Index.html`.** Estilos en el archivo nuevo `hero.css`, comentado
bloque por bloque. Usa su propia camiseta morada (`Img/AWMHV2.png`, que no estaban usando), recortada
sin el fondo blanco en `Img/hero-camiseta.png`. Fíjense en:
- `:root` con variables de color (`--oro`, `--violeta`…): un color se cambia en un solo lugar.
- `display: grid` con dos columnas, que en el celular pasa a una sola.
- `clamp()` en el tamaño del título: crece con la pantalla sin pasarse.
- La fuente *Big Shoulders Display* (Google Fonts), con letras altas y estrechas como las de una camiseta.

**4. Cinta de marcas infinita.** Debajo de la portada. Los logos están **dos veces** dentro de
`.marcas-pista`; la animación la corre hacia la izquierda la mitad de su ancho y vuelve a
empezar sin que se note. Con `animation-play-state: paused` en `:hover`, la cinta se detiene
cuando el cursor pasa por encima. Si el computador tiene activado "reducir movimiento", la cinta queda quieta.

Se quitó el banner viejo (`.Contenedor` / `.Principal`) y sus estilos. `Img/fondo-de-calidad.png` ya no se usa.

---

## Tercera entrega: se une su trabajo "Personaliza"

Su commit **Personaliza** (formulario en `Deportivo.html` a `Deportivo4.html`) se unió a la rama `profe`.

**Lo que se respetó de su trabajo:**
- `login.html` borrado: en el proyecto acordamos no pedir registro.
- Los botones de las tarjetas del inicio llevan a sus páginas de personalización. El texto pasó de
  "Ver más" a **"Personalizar"**, porque un botón debe decir lo que hace.
- El segundo botón de la portada ahora es **"Personaliza tu camiseta"**.

**Lo que se corrigió en las páginas `Deportivo*.html`:**
- En `Deportivo2`, `3` y `4` el `<select>` no tenía `<label>`: un lector de pantalla no sabe qué se escoge.
- El formulario **ahora envía el pedido por WhatsApp** con el archivo nuevo `personalizacion.js`
  (el mismo truco de `contacto.js`). El mensaje incluye la página desde donde se escribe, el nombre,
  el correo, el producto y las características.
- **Un enlace de WhatsApp solo lleva texto, no archivos.** Por eso la imagen ya no es obligatoria,
  el mensaje dice el nombre de la imagen y debajo del campo aparece:
  *"Cuando se abra WhatsApp, adjunta esta misma imagen en el chat."*
- `Personalizacion.css`: la caja medía `900px` × `1100px` fijos y en el celular se salía. Ahora usa
  `width: 90%` con `max-width`.
- Se repitieron errores que ya se habían corregido en las otras páginas: `lang="en"`, `Img/logo.png`
  y la flecha sin `alt`. **Revisen esto cada vez que copien una página vieja para hacer una nueva.**

**Pendiente para ustedes:**
- [ ] `register.html` quedó sola: ninguna página lleva a ella y su enlace "Iniciar sesión" apunta a
      `login.html`, que ya no existe. Como no habrá registro, bórrenla.
- [ ] Las 4 páginas `Deportivo*.html` son casi iguales (solo cambia el título). En Flask serán una sola
      plantilla que recibe el tipo de producto.

---

## Cuarta entrega: el personalizador de camisetas (`Deportivo.html`)

`Deportivo.html` dejó de ser un formulario y ahora es un **personalizador**: el cliente ve su
camiseta de frente y de espalda, y cada cambio aparece al instante.

| Archivo | Qué tiene |
|---|---|
| `Deportivo.html` | La página. Las camisetas son un dibujo **SVG** dentro del HTML |
| `personalizador.css` | Los estilos (mismos colores de la portada) |
| `personalizador.js` | Todo lo que se mueve. Está dividido en 6 partes comentadas |

**Lo que puede hacer el cliente:**
- Escoger el color de la camiseta y el de los detalles (cuello, mangas, nombre y número), o un color propio con "Otro".
- Subir una imagen PNG, JPG o WEBP de máximo 5 MB, ponerla en el frente o en la espalda, y cambiarle el tamaño y la posición.
- Marcar "Mi imagen tiene fondo blanco" para que el blanco desaparezca. Se ve mejor en camisetas claras.
- Escribir nombre y número para la espalda. El nombre solo acepta letras (con tildes y Ñ), se pasa a mayúsculas y la letra se encoge si es largo.
- Describir lo que quiere, escoger corte y talla, y **enviar el pedido por WhatsApp** con todos los datos.
- **Descargar la vista previa** como imagen PNG para adjuntarla en el chat.

**Ideas clave para estudiar y explicar en la sustentación:**
1. **Por qué SVG y no una foto:** el SVG está hecho de etiquetas (`<path>`, `<text>`, `<image>`), así
   que JavaScript les cambia el `fill` (color), el texto y la imagen. A una foto no se le puede cambiar el color.
2. **`<clipPath>`:** recorta la imagen del cliente con la forma de la camiseta, para que nunca se salga.
3. **`FileReader`:** lee la imagen **en el navegador**, sin subirla a ningún servidor.
4. **El objeto `diseno`:** guarda todo lo que escogió el cliente, y la función `dibujar()` lo pinta.
   Cada control solo cambia `diseno` y llama a `dibujar()`.
5. **`mix-blend-mode: multiply`:** mezcla la imagen con la tela. El blanco multiplicado por cualquier color da ese color, por eso el fondo blanco "desaparece".
6. **Descargar:** el SVG se convierte en texto, se carga como imagen, se pinta en un `<canvas>`
   y el canvas se guarda como PNG.
7. **Validar dos veces:** el tipo y el peso de la imagen, y la limpieza del nombre, se revisan en
   JavaScript. Cuando lo pasen a Flask hay que **repetir** esas reglas en el servidor.

**Límites que deben conocer:**
- WhatsApp no recibe archivos desde un enlace: el cliente adjunta la imagen y la vista previa a mano.
- Una foto con fondo de colores se verá como un rectángulo. No quitamos fondos automáticamente.
- La vista previa es aproximada, y la página lo dice.

`Deportivo2.html`, `3` y `4` (pantaloneta, guayos y guantes) siguen con el formulario anterior.
