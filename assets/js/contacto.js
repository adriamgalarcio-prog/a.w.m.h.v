// Formulario de contacto -> WhatsApp
// Una página HTML sola no puede enviar correos (eso necesita un servidor).
// Por eso armamos el mensaje y abrimos WhatsApp con el texto listo.
const formulario = document.getElementById('form-contacto')
const TELEFONO = '573505186236' // código de país (57) + celular, sin espacios ni '+'

formulario.addEventListener('submit', (evento) => {
    evento.preventDefault() // evita que la página se recargue

    const nombre = document.getElementById('name').value.trim()
    const correo = document.getElementById('correo').value.trim()
    const mensaje = document.getElementById('message').value.trim()

    const texto = `Hola A.W.M.H.V Sport, soy ${nombre} (${correo}).\n\n${mensaje}`
    const url = `https://wa.me/${TELEFONO}?text=${encodeURIComponent(texto)}`

    window.open(url, '_blank')
    formulario.reset()
})
