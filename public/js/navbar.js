/* Test TODO */
window.onload = () => {
    var scrollpos = window.scrollY;
    const navBar = document.getElementById("nav")
    const changeColor = document.getElementsByClassName("chage-color")
    document.addEventListener("scroll", () => {
        var scrollpos = window.scrollY;

        if (scrollpos > 10) {
            navBar.classList.add("bg-white")
            navBar.classList.add("shadow-2xl")

            for (let element of changeColor) {
                element.classList.add("text-[#2b6777]")
                element.classList.remove("text-white")

            }
        } else {
            navBar.classList.remove("bg-white")
            navBar.classList.remove("shadow-2xl")

            for (let element of changeColor) {
                element.classList.add("text-white")
                element.classList.remove("text-[#2b6777]")

            }
        }
    })
}
