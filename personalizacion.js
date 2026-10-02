// Formulario de personalización -> WhatsApp
// Mismo truco que contacto.js: una página HTML sola no puede guardar ni enviar
// el pedido (eso lo hará Flask), así que armamos el mensaje y abrimos WhatsApp.
//
// Ojo: un enlace de WhatsApp solo puede llevar TEXTO, no archivos.
// Por eso le decimos al cliente que adjunte la imagen en el chat.

const formulario = document.getElementById('form-personalizacion')
const TELEFONO = '573505186236' // código de país (57) + celular, sin espacios ni '+'

formulario.addEventListener('submit', (evento) => {
    evento.preventDefault() // evita que la página se recargue

    // El título de la página dice qué se personaliza: camisa, pantaloneta, guayos...
    const producto = document.querySelector('.form h3').textContent
    const nombre = document.getElementById('name').value.trim()
    const correo = document.getElementById('correo').value.trim()
    const opcion = document.getElementById('opciones').value
    const detalles = document.getElementById('message').value.trim()

    // Si escogió una imagen, ponemos su nombre en el mensaje para que no se le olvide enviarla
    const archivo = document.getElementById('url').files[0]
    const imagen = archivo ? `Imagen: ${archivo.name} (la adjunto en este chat)` : 'Sin imagen'

    const texto = `Hola A.W.M.H.V Sport, te escribo desde la página "${producto}".\n\n` +
                  `Nombre: ${nombre}\n` +
                  `Correo: ${correo}\n` +
                  `Producto: ${opcion}\n` +
                  `Características: ${detalles}\n` +
                  `${imagen}`

    const url = `https://wa.me/${TELEFONO}?text=${encodeURIComponent(texto)}`
    window.open(url, '_blank')
})
