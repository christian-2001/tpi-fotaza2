let img_container = document.querySelectorAll(".post_imagenes")
let posts = document.querySelectorAll(".post")
let post_menu_all = document.querySelectorAll(".opciones")

//Iterar sobre todas las publicaciones
for (const p of posts) {

    //Lista de opciones disponibles en todas las publicaciones
    let post_menu = p.querySelector(".opciones")

    //Boton "..." visible en la esquina superior derecha, en todas las publicaciones, que muestra/oculta las opciones
    let button_post = p.querySelector(".boton_opciones")

    //Obtiene el formulario que permite guardar la publicación en "Favoritos"
    let form_guardarFavoritos = p.querySelector("#guardarFavoritos")

    //Obtiene el formulario que permite quitar la publicación de "Favoritos"
    let form_quitarFavoritos = p.querySelector("#quitarFavoritos")
    
    if (form_quitarFavoritos) { // --> Quitar publicación de la seccion "Favoritos" del usuario mediante Fetch

        let btn = form_quitarFavoritos.querySelector("#btn_quitarFavoritos")

        form_quitarFavoritos.addEventListener("submit", (e) => {
            e.preventDefault()

            quitarPublicación_favoritos(post_menu, p, form_quitarFavoritos)
        })

    } else if (form_guardarFavoritos) { // --> Guardar publicación en la seccion "Favoritos" del usuario mediante Fetch
        let btn = form_guardarFavoritos.querySelector("#btn_favoritos")

        form_guardarFavoritos.addEventListener("submit", async (event) => {
            event.preventDefault()

            guardarPublicación_favoritos(post_menu, p, form_guardarFavoritos)
        })
    }

    //Los usuarios anonimos no tendran el boton para acceder a las opciones en cada publicación
    //Los usuarios autenticados tendran disponibles dichas opciones
    if (button_post !== null) {

        //Mostrar y ocultar menu al clickear los puntos suspensivos (...)
        //dentro de la publciación
        button_post.addEventListener("click", () => {

            if (post_menu.classList == "hidden") {
                mostrarOpciones(post_menu)
            } else {
                ocultarOpciones(post_menu_all, post_menu)
            }
        })
    }
}

function mostrarOpciones(post_menu) {

    post_menu.classList.remove("hidden")
    post_menu.classList.toggle("block")

}

function ocultarOpciones(post_menu_all, post_menu) {

    for (const menu of post_menu_all) {
        if (!menu.classList.contains("hidden") && menu.id !== post_menu.id) {
            menu.classList.toggle("hidden")
        }
    }
    post_menu.classList.remove("block")
    post_menu.classList.toggle("hidden")

}

async function guardarPublicación_favoritos(post_menu, post, form_guardarFavoritos) {
    //Enviar datos con Fetch usando POST
    try {
        const res = await fetch(form_guardarFavoritos.action, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            }
        })

        //Creación del mensaje avisandole al usuario del guardado de la publicación
        let div_msj = document.createElement("div")
        let p_msj = document.createElement("p")
        let posición_msj = document.body.querySelector(".msj")

        div_msj.className = "mb-3 bg-green-600 px-5 py-2 font-bold"
        p_msj.textContent = "Publicación guardada en Favoritos"

        div_msj.appendChild(p_msj)

        posición_msj.appendChild(div_msj)

        //Dispara el mensaje creado y desaparece luego de 4 segundos
        let cont = 4

        const msj_temporizador = setInterval(() => {

            if (cont > 0) {
                cont--;
            } else {
                clearInterval(msj_temporizador);

                posición_msj.removeChild(div_msj)
            }

        }, 1000);

        //Al guardar la publicación como favorito, el boton cambia de estado teniendo como texto "Eliminar de Favoritos"
        //Ademas cambia de formulario al de quitar la publicación como favorito

        //Recrear nodo padre y el resto de nodos hijo para la funcion de quitar publicación como favorito
        let li_guardarPost = post.querySelector("#agregar-a-favoritos")

        let li_eliminarPost = document.createElement("li")
        li_eliminarPost.id = "quitar-de-favoritos"

        let form_quitarFavoritos = document.createElement("form")
        let id_post = form_guardarFavoritos.action.substring(form_guardarFavoritos.action.length - 1)
        
        form_quitarFavoritos.action = `/quitar-de-favoritos/${id_post}`
        form_quitarFavoritos.method = "post"
        form_quitarFavoritos.name = "quitarFavoritos"
        form_guardarFavoritos.id = "quitarFavoritos"

        let label = document.createElement("label")
        label.for = "btn_quitarFavoritos"

        let button = document.createElement("button")
        button.className = "px-5 py-[3px] border-b-1 border-black hover:bg-orange-400 cursor-pointer"
        button.id = "btn_quitarFavoritos"
        button.textContent = "Eliminar de Favoritos"

        li_eliminarPost.appendChild(form_quitarFavoritos)
        form_quitarFavoritos.appendChild(label)
        label.appendChild(button)

        post_menu.replaceChild(li_eliminarPost, li_guardarPost)

        form_quitarFavoritos.addEventListener("submit", (e) => {
            e.preventDefault()

            console.log("ELIMINANDO POST.....")
            quitarPublicación_favoritos(post_menu, post, form_quitarFavoritos)
        })

    } catch (error) {
        console.error(`ERROR AL GUARDAR PUBLICACIÓN --> ${error}`)
    }
}

async function quitarPublicación_favoritos(post_menu, post, form_quitarFavoritos) {
    //Enviar datos con Fetch usando POST
    try {
        const res = await fetch(form_quitarFavoritos.action, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
        })

        //Creación del mensaje al momento de quitar una publicación como favorito
        let div_msj = document.createElement("div")
        let p_msj = document.createElement("p")
        let posición_msj = document.body.querySelector(".msj")

        console.log(posición_msj)

        div_msj.className = "mb-3 bg-red-600 px-5 py-2 font-bold"
        p_msj.textContent = "Publicación removida de Favoritos"

        div_msj.appendChild(p_msj)

        posición_msj.appendChild(div_msj)

        //Dispara el mensaje creado y desaparece luego de 4 segundos
        let cont = 4

        const msj_temporizador = setInterval(() => {

            if (cont > 0) {
                cont--;
            } else {
                clearInterval(msj_temporizador);

                posición_msj.removeChild(div_msj)
            }

        }, 1000);

        //Al quitar la publicación como favorito, el boton vuelve a cambiar de estado teniendo como texto "Guardar en Favoritos"
        //Ademas cambia de formulario al de guardar la publicación como favorito

        //Recrear nodo padre y el resto de nodos hijo para la funcion de guardar publicación como favorito
        let li_eliminarPost = post.querySelector("#quitar-de-favoritos")

        let li_guardarPost = document.createElement("li")
        li_guardarPost.id = "agregar-a-favoritos"

        let form_guardarFavoritos = document.createElement("form")
        let id_post = form_quitarFavoritos.action.substring(form_quitarFavoritos.action.length - 1)
        
        form_guardarFavoritos.action = `/favoritos/${id_post}`
        form_guardarFavoritos.method = "post"
        form_guardarFavoritos.name = "guardarFavoritos"
        form_guardarFavoritos.id = "guardarFavoritos"

        let label = document.createElement("label")
        label.for = "btn_favoritos"

        let button = document.createElement("button")
        button.className = "px-5 py-[3px] border-b-1 border-black hover:bg-orange-400 cursor-pointer"
        button.id = "btn_favoritos"
        button.textContent = "Guardar en Favoritos"

        li_guardarPost.appendChild(form_guardarFavoritos)
        form_guardarFavoritos.appendChild(label)
        label.appendChild(button)

        post_menu.replaceChild(li_guardarPost, li_eliminarPost)

        form_guardarFavoritos.addEventListener("submit", async (event) => {
            event.preventDefault()

            guardarPublicación_favoritos(post_menu, post, form_guardarFavoritos)
        })
    } catch (error) {
        console.error(`ERROR AL QUITAR LA PUBLICACIÓN --> ${error}`)
    }
}

//Renderizar imagenes dentro de la publicación
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
                dark_bg.classList.toggle("bg-black/50")




                images[3].appendChild(dark_bg)

            } else if (a > 3) {
                images[a].classList.toggle("hidden")

            }
        }
        const text_img = document.createElement("p")
        text_img.classList.toggle("absolute")
        text_img.classList.toggle("inset-0")
        text_img.classList.toggle("items-center")
        text_img.classList.toggle("flex")
        text_img.classList.toggle("justify-center")
        text_img.classList.toggle("text-white")
        text_img.classList.toggle("text-4xl")
        text_img.textContent = `+${images.length - 4}`

        images[3].appendChild(text_img)
    }
}

//link(rel="stylesheet", href="./style/output.css")