const carousel = document.getElementById('carussel')
const prevBtn = document.getElementById('prevBtn')
const nextBtn = document.getElementById('nextBtn')
const indicators = document.getElementById('indicators')

let currentIndex = 0
const items = document.querySelectorAll('.carussel-item')
const totalItems = items.length

for (let i = 0; i < totalItems; i++) {
    const dot = document.createElement('div')
    dot.classList.add('indicator')

    if (i === 0) dot.classList.add('active')

    dot.addEventListener('click', () => goToSlide(i))
    indicators.appendChild(dot)
}

function updateIndicators() {
    document.querySelectorAll('.indicator').forEach((indicator, index) => {
        indicator.classList.toggle('active', index === currentIndex)
    })
}

function goToSlide(index) {
    currentIndex = index
    carousel.style.transform = `translateX(-${currentIndex * 100}%)`
    updateIndicators()
}

function nextSlide(){
    currentIndex = (currentIndex + 1) % totalItems
    goToSlide(currentIndex)
}
function prevSlide(){
    currentIndex = (currentIndex - 1 + totalItems) % totalItems
    goToSlide(currentIndex)
}

nextBtn.addEventListener('click', nextSlide)
prevBtn.addEventListener('click', prevSlide)