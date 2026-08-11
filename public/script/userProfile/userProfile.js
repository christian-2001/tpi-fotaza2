let posts = document.querySelectorAll(".post") //--> Todas las publicaciónes guardadas como favorito
let post_menu_all = document.querySelectorAll(".opciones") //--> Obtiene todos los nodos que contienen el boton "..." en todas las publicaciones

//Iterar sobre todas las publicaciones

for (const p of posts) {

    //Lista de opciones disponibles en todas las publicaciones
    let post_menu = p.querySelector(".opciones")

    //Boton "..." visible en la esquina superior derecha, en todas las publicaciones, que muestra/oculta las opciones
    let button_post = p.querySelector(".boton_opciones")

    //Obtiene el formulario que permite quitar la publicación de "Favoritos"
    let form_quitarFavoritos = p.querySelector("#quitarFavoritos")

    if (form_quitarFavoritos) {

        form_quitarFavoritos.addEventListener("submit", (e) => {
            e.preventDefault()

            quitarPublicación_favoritos(post_menu, p, form_quitarFavoritos)
        })
    }

    //Mostrar y ocultar menu al clickear los puntos suspensivos (...)
    //dentro de la publciación
    if (button_post) {
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

//Quita la publicación guardada como favorito
async function quitarPublicación_favoritos(post_menu, post, form_quitarFavoritos) {

    let user_content = document.querySelector(".user_content")
    let div_favoritos = user_content.querySelector("p")
    let posts = user_content.querySelector(".user_posts")
    let sección_favoritos = document.querySelector(".favoritos")
    let cant_favoritos = parseInt(sección_favoritos.textContent.match(/\d+/))

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

        //Quita la publicación en tiempo real (evita refrescar la pagina)
        post.remove()
        let cant_actualizado = 0

        //Actualiza el contenido y contador de publicaciones cada vez que se quita una publicación
        if (!posts.hasChildNodes()) {
            cant_actualizado = cant_favoritos - 1
            sección_favoritos.textContent = `Favoritos (${cant_actualizado})`
            div_favoritos.textContent = "Nada de momento, explora publicaciones y guárdalos en tu perfil"
        } else {
            cant_actualizado = cant_favoritos - 1
            sección_favoritos.textContent = `Favoritos (${cant_actualizado})`
        }

    } catch (error) {
        console.error(`ERROR AL QUITAR LA PUBLICACIÓN --> ${error}`)
    }
}