let posts = document.querySelectorAll(".post") //--> Todas las publicaciónes guardadas como favorito
let post_menu_all = document.querySelectorAll(".opciones") //--> Obtiene todos los nodos que contienen el boton "..." en todas las publicaciones
let post_menu_all2 = document.querySelectorAll(".opciones2") //--> Obtiene todos los nodos que contienen el boton "..." en todas las publicaciones
let nombreColección

if (document.querySelector(".nombreColeccion")) {
    nombreColección = document.querySelector(".nombreColeccion").textContent
}

let btn_modificarColección = document.querySelector("#btn_modificarColección")

if (btn_modificarColección) {
    btn_modificarColección.addEventListener("click", (e) => {
        vista_crear_modificar_coleccion("modificar", "userColeccion")
    })
}

let btn_crearColección_userAuth = document.querySelector("#crearColeccion")

if (btn_crearColección_userAuth) {
    btn_crearColección_userAuth.addEventListener("click", (e) => {
        vista_crear_modificar_coleccion("crear", "colecciones")
    })
}

let btn_borrarColección = document.querySelector("#borrarColeccion")
if (btn_borrarColección) {
    btn_borrarColección.addEventListener("click", (e) => {
        vista_borrar_coleccion()
    })
}

//Iterar sobre todas las publicaciones

for (const p of posts) {

    //Lista de opciones disponibles en todas las publicaciones
    let post_menu = p.querySelector(".opciones")

    let post_menu2 = p.querySelector(".opciones2")

    let post_menu2_lis = p.querySelector(".opciones2").querySelectorAll(".coleccion")

    //Boton "..." visible en la esquina superior derecha, en todas las publicaciones, que muestra/oculta las opciones
    let button_post = p.querySelector(".boton_opciones")

    //Boton que permite guardar una publicación en una colección
    let btn_colección = p.querySelector("#btn_colección")

    let list_btn_colección_guardar = post_menu2.querySelectorAll("#btn_colección")


    //Obtiene el formulario que permite guardar la publicación en "Favoritos"
    let form_guardarFavoritos = p.querySelector("#guardarFavoritos")

    //Obtiene el formulario que permite quitar la publicación de "Favoritos"
    let form_quitarFavoritos_duenio = p.querySelector("#quitarFavoritos_duenio")

    //Obtiene el formulario que permite quitar la publicación de "Favoritos"
    let form_quitarFavoritos_noduenio = p.querySelector("#quitarFavoritos_noduenio")

    let btn_crearColección = p.querySelector("#crearColeccion_opciones2")
    if (form_quitarFavoritos_duenio) {

        form_quitarFavoritos_duenio.addEventListener("submit", (e) => {
            e.preventDefault()

            quitarPublicación_favoritos(post_menu, p, form_quitarFavoritos_duenio)
        })
    } else if (form_quitarFavoritos_noduenio) {

        form_quitarFavoritos_noduenio.addEventListener("submit", (e) => {
            e.preventDefault()

            quitarPublicación_favoritos(post_menu, p, form_quitarFavoritos_noduenio)
        })

    } else if (form_guardarFavoritos) {
        let btn = form_guardarFavoritos.querySelector("#btn_favoritos")

        //Ejecuta la Función que guarda publicación como favorito al enviar formulario
        form_guardarFavoritos.addEventListener("submit", async (event) => {
            event.preventDefault()

            guardarPublicación_favoritos(post_menu, p, form_guardarFavoritos)
        })
    }

    //Oculta los botones "Guardar en Favoritos" y "Guardar en Colección" renderizando el boton para crear colección y el listado de colecciones creados por el usuario
    if (btn_colección) {

        btn_colección.addEventListener("click", (e) => {

            //div_colecciones(btn_colección, post_menu, button_post, p)
            div_colecciones(post_menu, post_menu2)
        })

    }

    btn_crearColección.addEventListener("click", (e) => {
        vista_crear_modificar_coleccion("crear", "userColeccion", post_menu, p, post_menu2)
    })

    for (const btn_guardar of list_btn_colección_guardar) {

        btn_guardar.addEventListener('mouseenter', () => {
            btn_guardar.innerHTML =
                `<svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="24" height="24" viewBox="0 0 24 24">
            <path d="M18.5,2h-13C5.224,2,5,2.224,5,2.5v19c0,0.171,0.087,0.329,0.23,0.421c0.143,0.093,0.324,0.104,0.479,0.033L12,19.051	l6.291,2.903C18.357,21.984,18.429,22,18.5,22c0.094,0,0.188-0.026,0.27-0.079C18.913,21.829,19,21.671,19,21.5v-19	C19,2.224,18.776,2,18.5,2z"></path>
        </svg>`
        });

        btn_guardar.addEventListener('mouseleave', () => {
            btn_guardar.innerHTML =
                `<svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="24" height="24" viewBox="0 0 24 24">
            <path d="M 5.5 2 A 0.50005 0.50005 0 0 0 5 2.5 L 5 21.5 A 0.50005 0.50005 0 0 0 5.7089844 21.953125 L 12 19.050781 L 18.291016 21.953125 A 0.50005 0.50005 0 0 0 19 21.5 L 19 2.5 A 0.50005 0.50005 0 0 0 18.5 2 L 5.5 2 z M 6 3 L 18 3 L 18 20.71875 L 12.208984 18.046875 A 0.50005 0.50005 0 0 0 11.791016 18.046875 L 6 20.71875 L 6 3 z"></path>
        </svg>`
        });


    }

    for (const li of post_menu2_lis) {

        const form = li.querySelector("form")
        form.addEventListener("submit", (e) => {
            e.preventDefault()

            if (form.action.includes("/quitar-de-coleccion")) {
                quitarPublicación_colección(form, p)
            } else if (form.action.includes("/guardar-en-coleccion")) {
                guardarPublicación_colección(form, p)
            }
        })
    }

    //Mostrar y ocultar menu al clickear los puntos suspensivos (...)
    //dentro de la publciación
    if (button_post) {
        button_post.addEventListener("click", () => {

            if (post_menu.classList.contains("hidden") && post_menu2.classList.contains("hidden")) {
                mostrarOpciones(post_menu_all, post_menu, post_menu_all2, post_menu2)
            } else {
                ocultarOpciones(post_menu_all, post_menu_all2, post_menu, post_menu2)
            }

        })
    }
}

function mostrarOpciones(post_menu_all, post_menu, post_menu_all2, post_menu2) {

    post_menu.classList.remove("hidden")
    post_menu.classList.toggle("block")



    for (const menu of post_menu_all) {
        if (!menu.classList.contains("hidden") && menu.id !== post_menu.id) {
            menu.classList.remove("block")
            menu.classList.toggle("hidden")
        }
    }

    for (const menu2 of post_menu_all2) {
        if (!menu2.classList.contains("hidden") && menu2.id !== post_menu2.id) {
            menu2.classList.remove("block")
            menu2.classList.toggle("hidden")
        }
    }

}

function ocultarOpciones(post_menu_all, post_menu_all2, post_menu, post_menu2) {
    if (post_menu.classList.contains("block")) {
        post_menu.classList.remove("block")
        post_menu.classList.toggle("hidden")
    }
    if (post_menu2.classList.contains("block")) {
        post_menu2.classList.remove("block")
        post_menu2.classList.toggle("hidden")
    }
}

async function div_colecciones(post_menu, post_menu2) {
    post_menu.classList.remove("block")
    post_menu.classList.toggle("hidden")

    post_menu2.classList.remove("hidden")
    post_menu2.classList.toggle("block")
}

//Función que guarda publicación como favorito
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
        const tipo_msj = "guardar_publicación_favoritos"
        display_msj(tipo_msj)

        //Al guardar la publicación como favorito, el botón cambia de estado teniendo como texto "Eliminar de Favoritos"
        //Ademas cambia de formulario al de quitar la publicación como favorito

        //Recrear nodo padre y el resto de nodos hijo para la Función de quitar publicación como favorito
        let li_guardarPost = post.querySelector("#agregar-a-favoritos")

        let li_eliminarPost = document.createElement("li")
        li_eliminarPost.id = "quitar-de-favoritos"

        let form_quitarFavoritos_noduenio = document.createElement("form")

        let id_post = parseInt(post.querySelector("ul").id.match(/\d+/))

        form_quitarFavoritos_noduenio.action = `/quitar-de-favoritos/${id_post}`
        form_quitarFavoritos_noduenio.method = "post"
        form_quitarFavoritos_noduenio.name = "quitarFavoritos_noduenio"
        form_quitarFavoritos_noduenio.id = "quitarFavoritos_noduenio"
        form_guardarFavoritos.id = "quitarFavoritos_noduenio"

        let label = document.createElement("label")
        label.for = "btn_quitarFavoritos"

        let button = document.createElement("button")
        button.className = "w-45 text-center py-[3px] border-b-1 border-black hover:bg-orange-400 cursor-pointer"
        button.id = "btn_quitarFavoritos"
        button.textContent = "Eliminar de Favoritos"

        li_eliminarPost.appendChild(form_quitarFavoritos_noduenio)
        form_quitarFavoritos_noduenio.appendChild(label)
        label.appendChild(button)

        post_menu.replaceChild(li_eliminarPost, li_guardarPost)

        form_quitarFavoritos_noduenio.addEventListener("submit", (e) => {
            e.preventDefault()

            quitarPublicación_favoritos(post_menu, post, form_quitarFavoritos_noduenio)
        })

    } catch (error) {
        console.error(`ERROR AL GUARDAR PUBLICACIÓN --> ${error}`)
    }
}

//Quita la publicación guardada como favorito
async function quitarPublicación_favoritos(post_menu, post, form_quitarFavoritos) {

    //Enviar datos con Fetch usando POST
    try {
        if (form_quitarFavoritos.name === "quitarFavoritos_duenio") {

            let user_content = document.querySelector(".user_content")
            let div_favoritos = user_content.querySelector("p")
            let posts = user_content.querySelector(".user_posts")
            let sección_favoritos = document.querySelector(".favoritos")
            let cant_favoritos = parseInt(sección_favoritos.textContent.match(/\d+/))

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
        } else if (form_quitarFavoritos.name === "quitarFavoritos_noduenio") {

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

            //Al quitar la publicación como favorito, el botón vuelve a cambiar de estado teniendo como texto "Guardar en Favoritos"
            //Ademas cambia de formulario al de guardar la publicación como favorito

            //Recrear nodo padre y el resto de nodos hijo para la Función de guardar publicación como favorito
            let li_eliminarPost = post.querySelector("#quitar-de-favoritos")

            let li_guardarPost = document.createElement("li")
            li_guardarPost.id = "agregar-a-favoritos"

            let form_guardarFavoritos = document.createElement("form")
            let id_post = parseInt(post.querySelector("ul").id.match(/\d+/))

            form_guardarFavoritos.action = `/favoritos/${id_post}`
            form_guardarFavoritos.method = "post"
            form_guardarFavoritos.name = "guardarFavoritos"
            form_guardarFavoritos.id = "guardarFavoritos"

            let label = document.createElement("label")
            label.for = "btn_favoritos"

            let button = document.createElement("button")
            button.className = "w-45 text-center py-[3px] border-b-1 border-black hover:bg-orange-400 cursor-pointer"
            button.id = "btn_favoritos"
            button.textContent = "Guardar en Favoritos"

            li_guardarPost.appendChild(form_guardarFavoritos)
            form_guardarFavoritos.appendChild(label)
            label.appendChild(button)

            post_menu.replaceChild(li_guardarPost, li_eliminarPost)

            form_guardarFavoritos.addEventListener("submit", async (event) => {
                event.preventDefault()

                //Ejecuta la Función que guarda publicación como favorito al enviar formulario
                guardarPublicación_favoritos(post_menu, post, form_guardarFavoritos)
            })
        }
    } catch (error) {
        console.error(`ERROR AL QUITAR LA PUBLICACIÓN --> ${error}`)
    }
}

//Función que culta los botones "Guardar en Favoritos" y "Guardar en Colección" renderizando el boton para crear colección y el listado de colecciones creados por el usuario
/*async function div_colecciones(btn_colección, post_menu, button_post, post) {

    //Renderizar boton que permite crear una nueva colección
    let opciones = post_menu.querySelectorAll("li")

    for (const i of opciones) {
        i.remove()
    }

    let idPost = parseInt(post.querySelector("ul").id.match(/\d+/))

    let li = document.createElement("li")
    li.className = "border-black border-b-2"

    let div_crearColeccion = document.createElement("div")
    div_crearColeccion.className = "flex justify-center items-center py-1"

    let label = document.createElement("label")
    label.for = "crearColeccion"

    let button = document.createElement("button")
    button.className = "w-45 text-center text-blue-700 hover:font-bold cursor-pointer"
    button.id = "crearColeccion"
    button.textContent = "+ Crear colección"

    li.appendChild(div_crearColeccion)
    div_crearColeccion.appendChild(label)
    label.appendChild(button)
    post_menu.appendChild(li)

    //Al clickear en el boton, renderiza en la home de la pagina el contenido que incluye la función para crear una colección
    button.addEventListener("click", (e) => {
        vista_crearColeccion(post_menu, post)
    })

    //Al clickear en el icono "...", vuelvo a renderizar los botones "Guardar/Quitar de Favoritos" y "Guardar en Colección"
    button_post.addEventListener("click", () => {

        post_menu.innerHTML = ""
        for (const i of opciones) {
            post_menu.appendChild(i)
        }

    })

    //Si hay una o más colecciones creadas, se renderizan junto con un texto/icono a la derecha permitiendo al usuario
    //Guardar la publicación en una o más de una colección
    botonesColección(post_menu, post)

}*/

//Renderizar div que contiene la Función para crear una colección
async function vista_crear_modificar_coleccion(acción = undefined, sección = undefined, post_menu = undefined, post = undefined, post_menu2 = undefined) {
    let pag_body = document.querySelector("body")

    let div = document.createElement("div")
    div.className = "divColeccion fixed bg-black/50 flex items-center justify-center z-30 inset-0"

    let div_content = document.createElement("div")
    div_content.className = "div_content border bg-white p-6"

    let div_btnVolver = document.createElement("div")
    div_btnVolver.className = "flex justify-center mb-3"
    let btn_volver = document.createElement("button")
    btn_volver.type = "button"
    btn_volver.title = "Volver"
    let flecha = document.createElement("p")
    flecha.className = "hover:bg-orange-400 hover:rounded-full w-fit p-1 font-bold cursor-pointer"
    flecha.innerHTML =
        `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M19 12H5" />
        <path d="M12 19l-7-7 7-7" />
    </svg>`

    if (acción === "crear") {
        let form_crearColección = document.createElement("form")
        form_crearColección.action = "/crearColeccion"
        form_crearColección.method = "post"
        form_crearColección.name = "form_crearColeccion"
        form_crearColección.id = "form_crearColeccion"

        let label_Input = document.createElement("label")
        label_Input.for = "nombreColeccion"
        label_Input.className = "text-lg mb-[5px]"
        label_Input.textContent = "Ingrese el nombre para su nueva colección"

        let input_colección = document.createElement("input")
        input_colección.name = "nombreColeccion"
        input_colección.id = "nombreColeccion"
        input_colección.size = 50
        input_colección.maxLength = 50
        input_colección.type = "text"
        input_colección.className = "block w-fit p-1 border focus:ring-3 focus:ring-orange-500 focus:outline-none focus:border-none"

        let div_btnConfirmar = document.createElement("div")
        div_btnConfirmar.className = "confirmar flex justify-center mt-6"
        let label_btnConfirmar = document.createElement("label")
        label_btnConfirmar.for = "btn_confirmar"
        let btnConfirmar = document.createElement("button")
        btnConfirmar.type = "submit"
        btnConfirmar.className = "px-5 py-1 hover:bg-blue-500 hover:text-white hover:font-bold cursor-pointer border"
        btnConfirmar.id = "btn_confirmar"
        btnConfirmar.textContent = "Confirmar"

        div.appendChild(div_content)
        div_content.appendChild(div_btnVolver)
        div_btnVolver.appendChild(btn_volver)
        btn_volver.appendChild(flecha)
        div_content.appendChild(form_crearColección)
        form_crearColección.appendChild(label_Input)
        label_Input.appendChild(input_colección)

        form_crearColección.appendChild(div_btnConfirmar)
        div_btnConfirmar.appendChild(label_btnConfirmar)
        label_btnConfirmar.appendChild(btnConfirmar)

        flecha.addEventListener("click", () => {
            pag_body.removeChild(div)
        })

        pag_body.appendChild(div)

        form_crearColección.addEventListener("submit", async (e) => {
            e.preventDefault()

            httpPostColeccion(acción, sección, form_crearColección, post_menu, post, div, div_content, post_menu2)
        })
    } else if (acción === "modificar") {

        let form_modificarColección = document.createElement("form")
        form_modificarColección.action = window.location.href
        form_modificarColección.method = "post"
        form_modificarColección.name = "form_modificarColeccion"
        form_modificarColección.id = "form_modificarColeccion"

        let label_Input = document.createElement("label")
        label_Input.for = "nuevo_nombreColeccion"
        label_Input.className = "text-lg mb-[5px]"
        label_Input.textContent = "Ingrese el nuevo nombre para su colección"

        let input_colección = document.createElement("input")
        input_colección.name = "nuevo_nombreColeccion"
        input_colección.id = "nuevo_nombreColeccion"
        input_colección.size = 50
        input_colección.maxLength = 50
        input_colección.type = "text"
        input_colección.className = "block w-fit p-1 border focus:ring-3 focus:ring-orange-500 focus:outline-none focus:border-none"

        let div_btnConfirmar = document.createElement("div")
        div_btnConfirmar.className = "confirmar flex justify-center mt-6"
        let label_btnConfirmar = document.createElement("label")
        label_btnConfirmar.for = "btn_confirmar"
        let btnConfirmar = document.createElement("button")
        btnConfirmar.type = "submit"
        btnConfirmar.className = "px-5 py-1 hover:bg-blue-500 hover:text-white hover:font-bold cursor-pointer border"
        btnConfirmar.id = "btn_confirmar"
        btnConfirmar.textContent = "Confirmar"

        div.appendChild(div_content)
        div_content.appendChild(div_btnVolver)
        div_btnVolver.appendChild(btn_volver)
        btn_volver.appendChild(flecha)
        div_content.appendChild(form_modificarColección)
        form_modificarColección.appendChild(label_Input)
        label_Input.appendChild(input_colección)

        form_modificarColección.appendChild(div_btnConfirmar)
        div_btnConfirmar.appendChild(label_btnConfirmar)
        label_btnConfirmar.appendChild(btnConfirmar)

        flecha.addEventListener("click", () => {
            pag_body.removeChild(div)
        })

        pag_body.appendChild(div)

        form_modificarColección.addEventListener("submit", async (e) => {
            e.preventDefault()

            httpPostColeccion(acción, sección, form_modificarColección, post_menu, post, div, div_content, post_menu2)
        })
    }


}

async function vista_borrar_coleccion() {
    let pag_body = document.querySelector("body")

    let div = document.createElement("div")
    div.className = "divColeccion fixed bg-black/50 flex flex-col items-center justify-center z-30 inset-0"

    let div_content = document.createElement("div")
    div_content.className = "div_content border bg-white p-6"

    let div_btnVolver = document.createElement("div")
    div_btnVolver.className = "flex justify-center mb-3"
    let btn_volver = document.createElement("button")
    btn_volver.type = "button"
    btn_volver.title = "Volver"

    let flecha = document.createElement("p")
    flecha.className = "volver hover:bg-orange-400 hover:rounded-full w-fit p-1 font-bold cursor-pointer"
    flecha.innerHTML =
        `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M19 12H5" />
        <path d="M12 19l-7-7 7-7" />
    </svg>`

    let form_borrarColección = document.createElement("form")
    form_borrarColección.action = window.location.href
    form_borrarColección.method = "post"
    form_borrarColección.name = "form_borrarColección"
    form_borrarColección.id = "form_borrarColección"

    let p = document.createElement("label")
    p.className = "text-lg mb-[5px]"
    p.textContent = "Seleccione la o las colecciones que desea eliminar"

    let div_checkboxs = document.createElement("div")
    div_checkboxs.className = "list_colecciones flex flex-col items-center gap-2 my-6"

    form_borrarColección.appendChild(p)
    form_borrarColección.appendChild(div_checkboxs)

    let div_item
    let input
    let label

    for (const c of colecciones) {
        div_item = document.createElement("div")
        div_item.className = "item flex gap-2"

        input = document.createElement("input")
        input.type = "checkbox"
        input.id = c.nombre_colección
        input.name = c.nombre_colección
        input.value = c.nombre_colección

        label = document.createElement("label")
        label.for = c.nombre_colección
        label.textContent = c.nombre_colección
        label.className = "font-bold"

        div_checkboxs.appendChild(div_item)
        div_item.appendChild(input)
        div_item.appendChild(label)

    }

    let inputList = document.querySelectorAll("input")
    let itemsColecciones = form_borrarColección.querySelector(".list_colecciones").querySelectorAll(".item")

    /* inputList.addEventListener("change", () => {
         div_checkboxs.hasChildNodes()
         if (input.checked) {
             label.className = "bg-blue-500 px-4 py-2"
             btnConfirmar.className = "px-5 py-1 border cursor-pointer hover:bg-blue-500 hover:text-white hover:font-bold"
         } else if (!input.checked || !div_checkboxs.hasChildNodes()) {
             let labelClases = label.classList
             label.classList.remove("bg-blue-500", "px-4", "py-2")
             btnConfirmar.className = "px-5 py-1 border cursor-pointer hover:bg-blue-500 hover:text-white hover:font-bold disabled:pointer-events-none disabled:opacity-40 disabled:bg-gray-200 disabled:text-gray-400 disabled:border-gray-300 disabled:cursor-not-allowed"
         }
     })*/

    let divBotones = document.createElement("div")
    divBotones.className = "divBotones flex justify-center gap-2 items-center mt-6"

    let div_btnEliminar = document.createElement("div")
    div_btnEliminar.className = "eliminar"
    let label_btnEliminar = document.createElement("label")
    label_btnEliminar.for = "btn_eliminar"
    let btnEliminar = document.createElement("button")
    btnEliminar.type = "submit"
    btnEliminar.className = "px-5 py-1 border cursor-pointer hover:bg-red-500 hover:text-white hover:font-bold disabled:pointer-events-none disabled:opacity-40 disabled:bg-gray-200 disabled:text-gray-400 disabled:border-gray-300 disabled:cursor-not-allowed"
    btnEliminar.id = "btn_eliminar"
    btnEliminar.textContent = "Eliminar"
    btnEliminar.disabled = true;

    let div_btnSalir = document.createElement("div")
    div_btnSalir.className = "salir hidden"
    let label_btnSalir = document.createElement("label")
    label_btnSalir.for = "btn_salir"
    let btnSalir = document.createElement("button")
    btnSalir.type = "submit"
    btnSalir.className = "px-5 py-1 hover:bg-orange-500 hover:text-white hover:font-bold cursor-pointer border"
    btnSalir.id = "btn_salir"
    btnSalir.textContent = "Salir"

    for (const item of itemsColecciones) {
        let input = item.querySelector("input")
        let label = item.querySelector("label")
        input.addEventListener("change", () => {
            if (input.checked) {
                label.className = "bg-blue-500 px-4 py-1 text-white font-bold"
                btnEliminar.className = "px-5 py-1 border cursor-pointer hover:bg-red-500 hover:text-white hover:font-bold"
                btnEliminar.disabled = false
            } else if (!input.checked) {
                let labelClases = label.classList
                label.classList.remove("bg-blue-500", "px-4", "py-1", "text-white")

                let listChecked = [...form_borrarColección.querySelectorAll('input[type="checkbox"]')]
                const checked = listChecked.some(
                    lc => lc.checked
                );

                if (checked === false) {
                    btnEliminar.className = "px-5 py-1 border cursor-pointer hover:bg-red-500 hover:text-white hover:font-bold disabled:pointer-events-none disabled:opacity-40 disabled:bg-gray-200 disabled:text-gray-400 disabled:border-gray-300 disabled:cursor-not-allowed"
                    btnEliminar.disabled = true
                }
            }
        })
    }

    form_borrarColección.appendChild(divBotones)
    divBotones.appendChild(div_btnEliminar)
    div_btnEliminar.appendChild(label_btnEliminar)
    label_btnEliminar.appendChild(btnEliminar)
    divBotones.appendChild(div_btnSalir)
    div_btnSalir.appendChild(label_btnSalir)
    label_btnSalir.appendChild(btnSalir)

    div.appendChild(div_content)
    div_content.appendChild(div_btnVolver)
    div_btnVolver.appendChild(btn_volver)
    btn_volver.appendChild(flecha)
    div_content.appendChild(form_borrarColección)

    flecha.addEventListener("click", () => {
        pag_body.removeChild(div)
    })

    pag_body.appendChild(div)

    form_borrarColección.addEventListener("submit", (e) => {
        e.preventDefault()

        httpBorrarColeccion(form_borrarColección, div_content)
    })

}

//Renderiza listado de colecciones con bookmark funcional asociado que guarda/quita una publicación de esa colección
async function botonesColección(post_menu, post) {

    //Verifica si existen colecciones creadas por el usuario autenticado
    if (colecciones) {

        for (const c of colecciones) {

            let li_colección = document.createElement("li")
            li_colección.className = "coleccion border-b-1 border-black"

            let div_colección = document.createElement("div")
            div_colección.className = "flex justify-between items-center p-2"

            let nombre_colección = document.createElement("p")
            nombre_colección.className = "mr-10"
            nombre_colección.textContent = c.nombre_colección

            li_colección.appendChild(div_colección)
            div_colección.appendChild(nombre_colección)
            post_menu.appendChild(li_colección)

            if (postsColecciones.length > 0) {
                const post_href = post.querySelector(".url_post").href
                let match = post_href.match(/\/post\/(\d+)\/\d+/);
                const idPublicación = parseInt(match[1])

                const guardada = postsColecciones.some(
                    pc => pc.id_colección === c.id_colección && pc.id_post === idPublicación
                );

                if (guardada) {
                    //Renderiza las colecciones del usuario junto con un bookmark lleno indicando la publicación guardada en la colección que a su vez tiene la funcion de quitar esa publicación de la colección
                    form_quitarPublicación_colección_render(post, c.nombre_colección, div_colección)
                } else {
                    //Renderiza las colecciones del usuario junto con un bookmark hueco que permite guardar una publicación en una colección especifica
                    form_guardarPublicación_colección_render(post, c.nombre_colección, div_colección)
                }
            } else {
                form_guardarPublicación_colección_render(post, c.nombre_colección, div_colección)
            }
        }
    }
}

//Función que crea una nueva colección con un bookmark funcional asociado
async function httpPostColeccion(acción = undefined, sección = undefined, formColección = undefined, post_menu = undefined, post = undefined, div = undefined, div_content = undefined, post_menu2 = undefined) {
    let _nombreNuevo = (formColección.name === "form_modificarColeccion") ? formColección.querySelector("#nuevo_nombreColeccion").value : undefined
    let data
    let result
    
    try {
        if (acción === "crear") {
            //Dato a enviar en la peticion POST
            data = formColección.querySelector("#nombreColeccion").value

            //Fetch con POST

            const res = await fetch(formColección.action, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({ data })
            })

             result = await res.json()

            //Mensaje confirmando creación de la colección
            div_content.innerHTML = ""
            div_content.innerHTML =
                `<p class="p-3 text-3xl"> Se ha creado la colección exitosamente </p>
            <div class="flex justify-center items-center text-2xl pt-2"> 
                <label for="btn_salir"> 
                    <button type="button" class="cursor-pointer hover:font-bold" id="btn_salir"> Salir </button>
                </label>
            </div>`

            //Actualizamos el listado de colecciones del usuario autenticado
            colecciones = result.userColecciones

        } else if (acción === "modificar") {

            div_content.innerHTML = ""
            div_content.innerHTML =
                `<p class="p-3 text-3xl"> Se cambió de nombre exitosamente </p>
            <div class="flex justify-center items-center text-2xl pt-2"> 
                <label for="btn_salir"> 
                    <button type="button" class="cursor-pointer hover:font-bold" id="btn_salir"> Salir </button>
                </label>
            </div>`

        }

        //Renderiza listado de colecciones en el menu de opciones de la publicación al tocar el boton para salir del div que crea una colección
        document.querySelector("#btn_salir").addEventListener("click", async () => {
            if (acción === "modificar" && sección === "userColeccion") {

                //Dato a enviar en la peticion POST
                const data = {
                    nombreViejo: nombreColección,
                    nombreNuevo: _nombreNuevo,
                }

                //Fetch con POST
                const res = await fetch(formColección.action, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify({ data })
                })

                const { newURL } = await res.json()
                window.location.href = newURL

            } else if (acción === "crear" && sección === "colecciones") {

                const coleccion = colecciones.find(col => col.nombre_colección === data)

                let a = document.createElement("a")
                let div = document.createElement("div")
                let label = document.createElement("label")
                let button = document.createElement("button")
                let p = document.createElement("p")

                a.href = `/usuarioPerfil/${coleccion.id_usuario}/colecciones/${coleccion.nombre_colección}`
                div.className = "coleccion relative bg-white border-1 border-gray-400 rounded-[10px] px-20 py-2 hover:outline-orange-400 hover:bg-orange-400 hover:opacity-80 h-fit text-center"
                label.for = "btn_userColeccion"
                button.className = "text-center hover:font-bold cursor-pointer"
                button.id = "crearColeccion"
                button.textContent = coleccion.nombre_colección
                p.textContent = "(0 publicaciones)"

                a.appendChild(div)
                div.appendChild(label)
                label.appendChild(button)
                div.appendChild(p)

                window.location.href = window.location.href
                div.remove()

            } else if (acción === "crear" && sección === "userColeccion") {

                let li_colección = document.createElement("li")
                li_colección.className = "coleccion border-b-1 border-black"
                let div_colección = document.createElement("div")
                div_colección.className = "flex justify-between items-center p-2"

                let nombre_colección = document.createElement("p")
                nombre_colección.className = "mr-10"
                nombre_colección.textContent = result.nueva_colección.nombre_colección

                li_colección.appendChild(div_colección)
                div_colección.appendChild(nombre_colección)
                post_menu2.appendChild(li_colección)

                //Renderiza las colecciones del usuario junto con un bookmark hueco que permite guardar una publicación en una colección especifica
                form_guardarPublicación_colección_render(post, result.nueva_colección.nombre_colección, div_colección)

                div.remove()
            }
        })

    } catch (error) {
        console.error(`Ocurrió un error inesperado ${error}`)
    }

}
async function httpBorrarColeccion(form_borrarColección, div_content) {
    try {
        //Obtener los nombres de las colecciones con checked
        const data = []

        //iterar sobre todos los div que contiene "checkbox" y "label"
        let list = document.querySelector(".list_colecciones")
        list.querySelectorAll(".item").forEach(i => {
            if (i.querySelector('[type="checkbox"]').checked) {
                //Guardar nombre de la colección con "checked" en el array
                const nombreColeccion = i.querySelector("label").textContent
                data.push(nombreColeccion)
                //Quitar colección del listado
                i.remove()
            }
        })

        let msj = document.createElement("p")
        msj.className = "msj_borrado text-center text-red-500 font-bold mt-5"
        msj.textContent = "Borrado exitoso!!!"

        let childNode = document.querySelector(".msj_borrado")

        if (div_content.contains(childNode)) {
            childNode.replaceWith(msj)
        } else {
            div_content.appendChild(msj)
        }

        //Fetch con POST
        const res = await fetch(form_borrarColección.action, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({ data })
        })

        if (!document.querySelector(".list_colecciones").hasChildNodes()) {

            let flecha = document.querySelector(".div_content").querySelector(".volver")
            flecha.remove()

            let label = form_borrarColección.querySelector("label")
            label.textContent = "Se borraron todas las colecciones"
            label.className = "text-red-500 font-bold"

            let divBotones = form_borrarColección.querySelector(".divBotones")
            divBotones.querySelector(".eliminar").remove()

            let btnSalir = form_borrarColección.querySelector(".salir")
            btnSalir.classList.remove("hidden")
            btnSalir.classList.toggle("block")

            btnSalir.addEventListener("click", (e) => {
                location.reload()
            })

            list.classList.remove("my-6")
        } else {

            let btnSalir = form_borrarColección.querySelector(".salir")
            btnSalir.classList.remove("hidden")
            btnSalir.classList.toggle("block")

            btnSalir.addEventListener("click", (e) => {
                location.reload(form_borrarColección.querySelector(".salir"))
            })

            let btnEliminar = form_borrarColección.querySelector("#btn_eliminar")

            //btnEliminar.className = "px-5 py-1 border cursor-pointer hover:bg-red-500 hover:text-white hover:font-bold"
            btnEliminar.className = "px-5 py-1 border cursor-pointer hover:bg-red-500 hover:text-white hover:font-bold disabled:pointer-events-none disabled:opacity-40 disabled:bg-gray-200 disabled:text-gray-400 disabled:border-gray-300 disabled:cursor-not-allowed"
            //btnEliminar.classList.toggle("disabled:pointer-events-none", "disabled:opacity-40", "disabled:bg-gray-200", "disabled:text-gray-400", "disabled:border-gray-300", "disabled:cursor-not-allowed")
            
            btnEliminar.disabled = true
        }
    } catch (error) {
        console.error(`Ocurrió un error inesperado ${error}`)
    }

}

//Función para guardar publicación de una colección
async function guardarPublicación_colección(form_colección, post) {

    //Datos a enviar en la peticion POST
    const data = {
        postTitulo: post.querySelector(".post_titulo").textContent.trim(),
        nombreColección: form_colección.name
    }

    //Fetch con POST
    try {

        let res = await fetch(form_colección.action, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        })

        const result = await res.json()
        postsColecciones = result.postsColecciones

        //Creación del mensaje al guardar publicación en una colección
        const tipo_msj = "guardar_publicación_colección"
        display_msj(tipo_msj, data)

        //Al guardar la publicación, reemplaza el bookmark hueco por uno lleno en la colección asociada
        form_guardarPublicación_colección_replace(post, form_colección, form_colección.name)

    } catch (error) {
        console.error(`Ocurrió un error inesperado ${error}`)
    }
}

//Función para quitar publicación de una colección
async function quitarPublicación_colección(form_quitarPublicacion, post) {

    //Datos a enviar en la peticion POST
    const data = {
        postTitulo: post.querySelector(".post_titulo").textContent.trim(),
        nombreColección: form_quitarPublicacion.name
    }

    //Fetch con POST
    try {
        let res = await fetch(form_quitarPublicacion.action, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        })

        const result = await res.json()
        postsColecciones = result.postsColecciones

        //Creación del mensaje al quitar publicación en una colección
        const tipo_msj = "quitar_publicación_colección"
        display_msj(tipo_msj, data)

        //Al quitar la publicación, reemplaza el bookmark lleno por uno hueco en la colección asociada
        form_quitarPublicación_colección_replace(post, form_quitarPublicacion, form_quitarPublicacion.name)

    } catch (error) {
        console.error(`Ocurrió un error inesperado ${error}`)
    }
}

//Función que dispara un mensaje temporal personalizado, al guardar/quitar publicación como favorito/en una colección
function display_msj(tipo_msj, data = undefined) {
    let div_msj = document.createElement("div")

    if (tipo_msj === "guardar_publicación_favoritos") {

        div_msj.className = "mb-3 bg-green-600 px-5 py-2 font-bold"
        div_msj.textContent = "Publicación guardada en Favoritos"

    } else if (tipo_msj === "quitar_publicación_favoritos") {

        div_msj.className = "mb-3 bg-red-600 px-5 py-2 font-bold"
        div_msj.textContent = "Publicación removida de Favoritos"

    } else if (tipo_msj === "guardar_publicación_colección") {

        div_msj.className = "mb-3 bg-blue-600 px-5 py-2 font-bold"
        div_msj.textContent = `Publicación guardada en ${data.nombreColección}`

    } else if (tipo_msj === "quitar_publicación_colección") {

        div_msj.className = "mb-3 bg-red-600 px-5 py-2 font-bold"
        div_msj.textContent = `Publicación removida de ${data.nombreColección}`

    }

    let posición_msj = document.body.querySelector(".msj")

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
}

//Funcion que renderiza las colecciones del usuario junto con un bookmark hueco que permite guardar una publicación en una colección especifica
function form_guardarPublicación_colección_render(post, nombre_colección, div_colección) {

    let form_guardarPublicacion = document.createElement("form")
    form_guardarPublicacion.className = "ml-10"
    form_guardarPublicacion.action = "/guardar-en-coleccion"
    form_guardarPublicacion.method = "post"
    form_guardarPublicacion.name = nombre_colección
    form_guardarPublicacion.id = nombre_colección

    form_guardarPublicacion.innerHTML =
        `<label for="btn_colección">
            <button class=" cursor-pointer px-2 py-1" type="submit" id="btn_colección">
                <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="24" height="24" viewBox="0 0 24 24">
                    <path d="M 5.5 2 A 0.50005 0.50005 0 0 0 5 2.5 L 5 21.5 A 0.50005 0.50005 0 0 0 5.7089844 21.953125 L 12 19.050781 L 18.291016 21.953125 A 0.50005 0.50005 0 0 0 19 21.5 L 19 2.5 A 0.50005 0.50005 0 0 0 18.5 2 L 5.5 2 z M 6 3 L 18 3 L 18 20.71875 L 12.208984 18.046875 A 0.50005 0.50005 0 0 0 11.791016 18.046875 L 6 20.71875 L 6 3 z"></path>
                </svg>
            </button>
        </label>`

    let btn = form_guardarPublicacion.querySelector("button")

    btn.addEventListener('mouseenter', () => {
        btn.innerHTML =
            `<svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="24" height="24" viewBox="0 0 24 24">
            <path d="M18.5,2h-13C5.224,2,5,2.224,5,2.5v19c0,0.171,0.087,0.329,0.23,0.421c0.143,0.093,0.324,0.104,0.479,0.033L12,19.051	l6.291,2.903C18.357,21.984,18.429,22,18.5,22c0.094,0,0.188-0.026,0.27-0.079C18.913,21.829,19,21.671,19,21.5v-19	C19,2.224,18.776,2,18.5,2z"></path>
        </svg>`
    });

    btn.addEventListener('mouseleave', () => {
        btn.innerHTML =
            `<svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="24" height="24" viewBox="0 0 24 24">
            <path d="M 5.5 2 A 0.50005 0.50005 0 0 0 5 2.5 L 5 21.5 A 0.50005 0.50005 0 0 0 5.7089844 21.953125 L 12 19.050781 L 18.291016 21.953125 A 0.50005 0.50005 0 0 0 19 21.5 L 19 2.5 A 0.50005 0.50005 0 0 0 18.5 2 L 5.5 2 z M 6 3 L 18 3 L 18 20.71875 L 12.208984 18.046875 A 0.50005 0.50005 0 0 0 11.791016 18.046875 L 6 20.71875 L 6 3 z"></path>
        </svg>`
    });

    div_colección.appendChild(form_guardarPublicacion)

    //Ejecuta la Función que guarda publicación en una colección al enviar formulario
    form_guardarPublicacion.addEventListener("submit", (e) => {
        e.preventDefault()

        guardarPublicación_colección(form_guardarPublicacion, post)
    })

}

//Funcion que renderiza las colecciones del usuario junto con un bookmark lleno indicando la publicación guardada en la colección que a su vez tiene la funcion de quitar esa publicación de la colección
function form_quitarPublicación_colección_render(post, nombre_colección, div_colección) {

    let form_quitarPublicacion = document.createElement("form")
    form_quitarPublicacion.className = "ml-10"
    form_quitarPublicacion.action = "/quitar-de-coleccion"
    form_quitarPublicacion.method = "post"
    form_quitarPublicacion.name = nombre_colección
    form_quitarPublicacion.id = nombre_colección

    form_quitarPublicacion.innerHTML =
        `<label for="btn_colección_guardado">
        <button class=" cursor-pointer px-2 py-1" type="submit" id="btn_colección_guardado">
            <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="24" height="24" viewBox="0 0 24 24">
                <path d="M18.5,2h-13C5.224,2,5,2.224,5,2.5v19c0,0.171,0.087,0.329,0.23,0.421c0.143,0.093,0.324,0.104,0.479,0.033L12,19.051	l6.291,2.903C18.357,21.984,18.429,22,18.5,22c0.094,0,0.188-0.026,0.27-0.079C18.913,21.829,19,21.671,19,21.5v-19	C19,2.224,18.776,2,18.5,2z"></path>
            </svg>
        </button>
    </label>`

    div_colección.appendChild(form_quitarPublicacion)

    //Ejecuta la Función para quitar publicación de una colección al enviar formulario
    form_quitarPublicacion.addEventListener("submit", (e) => {
        e.preventDefault()

        quitarPublicación_colección(form_quitarPublicacion, post)
    })
}

//Funcion que reemplaza el bookmark hueco por uno lleno luego de guardar una publicación en una colección asociada al bookmark
function form_guardarPublicación_colección_replace(post, form_guardarPublicacion, nombre_colección) {

    let form_quitarPublicacion = document.createElement("form")
    form_quitarPublicacion.className = "ml-10"
    form_quitarPublicacion.action = "/quitar-de-coleccion"
    form_quitarPublicacion.method = "post"
    form_quitarPublicacion.name = nombre_colección
    form_quitarPublicacion.id = nombre_colección

    form_quitarPublicacion.innerHTML =
        `<label for="btn_colección_guardado">
        <button class=" cursor-pointer px-2 py-1" type="submit" id="btn_colección_guardado">
            <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="24" height="24" viewBox="0 0 24 24">
                <path d="M18.5,2h-13C5.224,2,5,2.224,5,2.5v19c0,0.171,0.087,0.329,0.23,0.421c0.143,0.093,0.324,0.104,0.479,0.033L12,19.051	l6.291,2.903C18.357,21.984,18.429,22,18.5,22c0.094,0,0.188-0.026,0.27-0.079C18.913,21.829,19,21.671,19,21.5v-19	C19,2.224,18.776,2,18.5,2z"></path>
            </svg>
        </button>
    </label>`

    form_guardarPublicacion.replaceWith(form_quitarPublicacion)

    //Ejecuta la Función para quitar publicación de una colección al enviar formulario
    form_quitarPublicacion.addEventListener("submit", (e) => {
        e.preventDefault()

        quitarPublicación_colección(form_quitarPublicacion, post)
    })


}

//Funcion que reemplaza el bookmark lleno por uno hueco luego de quitar una publicación de una colección asociada al bookmark
function form_quitarPublicación_colección_replace(post, form_quitarPublicacion, nombre_colección) {

    let form_guardarPublicacion = document.createElement("form")
    form_guardarPublicacion.className = "ml-10"
    form_guardarPublicacion.action = "/guardar-en-coleccion"
    form_guardarPublicacion.method = "post"
    form_guardarPublicacion.name = form_quitarPublicacion.name
    form_guardarPublicacion.id = form_quitarPublicacion.id

    form_guardarPublicacion.innerHTML =
        `<label for="btn_colección">
        <button class=" cursor-pointer px-2 py-1" type="submit" id="btn_colección">
            <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="24" height="24" viewBox="0 0 24 24">
                <path d="M 5.5 2 A 0.50005 0.50005 0 0 0 5 2.5 L 5 21.5 A 0.50005 0.50005 0 0 0 5.7089844 21.953125 L 12 19.050781 L 18.291016 21.953125 A 0.50005 0.50005 0 0 0 19 21.5 L 19 2.5 A 0.50005 0.50005 0 0 0 18.5 2 L 5.5 2 z M 6 3 L 18 3 L 18 20.71875 L 12.208984 18.046875 A 0.50005 0.50005 0 0 0 11.791016 18.046875 L 6 20.71875 L 6 3 z"></path>
            </svg>
        </button>
    </label>`

    let btn = form_guardarPublicacion.querySelector("button")

    btn.addEventListener('mouseenter', () => {
        btn.innerHTML =
            `<svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="24" height="24" viewBox="0 0 24 24">
            <path d="M18.5,2h-13C5.224,2,5,2.224,5,2.5v19c0,0.171,0.087,0.329,0.23,0.421c0.143,0.093,0.324,0.104,0.479,0.033L12,19.051	l6.291,2.903C18.357,21.984,18.429,22,18.5,22c0.094,0,0.188-0.026,0.27-0.079C18.913,21.829,19,21.671,19,21.5v-19	C19,2.224,18.776,2,18.5,2z"></path>
        </svg>`
    });

    btn.addEventListener('mouseleave', () => {
        btn.innerHTML =
            `<svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="24" height="24" viewBox="0 0 24 24">
            <path d="M 5.5 2 A 0.50005 0.50005 0 0 0 5 2.5 L 5 21.5 A 0.50005 0.50005 0 0 0 5.7089844 21.953125 L 12 19.050781 L 18.291016 21.953125 A 0.50005 0.50005 0 0 0 19 21.5 L 19 2.5 A 0.50005 0.50005 0 0 0 18.5 2 L 5.5 2 z M 6 3 L 18 3 L 18 20.71875 L 12.208984 18.046875 A 0.50005 0.50005 0 0 0 11.791016 18.046875 L 6 20.71875 L 6 3 z"></path>
        </svg>`
    });

    form_quitarPublicacion.replaceWith(form_guardarPublicacion)

    //Ejecuta la Función que guarda publicación en una colección al enviar formulario
    form_guardarPublicacion.addEventListener("submit", (e) => {
        e.preventDefault()

        guardarPublicación_colección(form_guardarPublicacion, post)
    })
}