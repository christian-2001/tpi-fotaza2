const div_followers = document.querySelector(".seguidor")
const div_followed = document.querySelector(".seguidos")

document.addEventListener("DOMContentLoaded", () => {
    if (div_followers) {

        if (!div_followers.hasChildNodes()) {

            const div = document.createElement("div")
            div.classList.toggle("flex")
            div.classList.toggle("justify-center")
            div.classList.toggle("items-center")
            div.classList.toggle("py-2")
            div.classList.toggle("px-6")

            const p = document.createElement("p")
            p.classList.toggle("font-medium")
            p.classList.toggle("text-center")
            p.classList.toggle("text-3xl")
            p.textContent = "No tienes seguidores"

            div.appendChild(p)
            div_followers.appendChild(div)
        }

    }
    if (div_followed) {

        if (!div_followed.hasChildNodes()) {

            const div = document.createElement("div")
            div.classList.toggle("flex")
            div.classList.toggle("justify-center")
            div.classList.toggle("items-center")
            div.classList.toggle("py-2")
            div.classList.toggle("px-6")

            const p = document.createElement("p")
            p.classList.toggle("font-medium")
            p.classList.toggle("text-center")
            p.classList.toggle("text-3xl")
            p.textContent = "No seguís a ningun usuario"

            div.appendChild(p)
            div_followed.appendChild(div)

        }

    }
})