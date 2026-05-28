let img_container = document.querySelectorAll(".post_imagenes")
for (const i of img_container) {

    let images = i.querySelectorAll(".imagenes")[0]
    images = images.querySelectorAll(".img_elem")

    if (images.length > 4) {
        for (let a = 0; a < images.length; a++) {

            if (a === 3) {
                images[3].classList.toggle("relative")

                const dark_bg = document.createElement("div")
                dark_bg.classList.toggle("absolute")
                dark_bg.classList.toggle("inset-0")
                dark_bg.classList.toggle("bg-black/75")

                const text_img = document.createElement("p")
                text_img.classList.toggle("absolute")
                text_img.classList.toggle("inset-0")
                text_img.classList.toggle("items-center")
                text_img.classList.toggle("flex")
                text_img.classList.toggle("justify-center")
                text_img.classList.toggle("text-white")
                text_img.classList.toggle("text-4xl")
                text_img.textContent = "Ver más"

                images[3].appendChild(dark_bg)
                images[3].appendChild(text_img)

            } else if (a > 3) {
                images[a].classList.toggle("hidden")
            }
        }
    }
}

//link(rel="stylesheet", href="./style/output.css")