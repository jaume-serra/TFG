const image = document.getElementById("image")
const arrows = document.getElementsByClassName("arrow")

image.addEventListener('mouseenter', () => {
    for (let arrow of arrows) {
        arrow.classList.remove('hidden')
        arrow.classList.remove('hidden')
    }
})
image.addEventListener('mouseleave', () => {
    for (let arrow of arrows) {
        arrow.classList.add('hidden')
        arrow.classList.add('hidden')
    }
})

