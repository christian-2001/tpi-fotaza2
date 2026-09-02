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

    //Boton que permite guardar una publicación en una colección
    let btn_colección = p.querySelector("#btn_coleccion")

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

    if (btn_colección) {

        btn_colección.addEventListener("click", (e) => {
            div_colecciones(btn_colección, post_menu, button_post, p)
        })

    }

    //Los usuarios anonimos no tendran el botón para acceder a las opciones en cada publicación
    //Los usuarios autenticados tendran disponibles dichas opciones
    if (button_post !== null) {

        //Mostrar y ocultar menu al clickear los puntos suspensivos (...)
        //dentro de la publciación
        postOpciones(button_post, post_menu_all, post_menu)
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

        //Al guardar la publicación como favorito, el botón cambia de estado teniendo como texto "Eliminar de Favoritos"
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
        button.className = "w-45 text-center py-[3px] border-b-1 border-black hover:bg-orange-400 cursor-pointer"
        button.id = "btn_quitarFavoritos"
        button.textContent = "Eliminar de Favoritos"

        li_eliminarPost.appendChild(form_quitarFavoritos)
        form_quitarFavoritos.appendChild(label)
        label.appendChild(button)

        post_menu.replaceChild(li_eliminarPost, li_guardarPost)

        form_quitarFavoritos.addEventListener("submit", (e) => {
            e.preventDefault()

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
        button.className = "w-45 text-center py-[3px] border-b-1 border-black hover:bg-orange-400 cursor-pointer"
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

async function div_colecciones(btn_colección, post_menu, button_post, post) {

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

}

function postOpciones(button_post, post_menu_all, post_menu) {

    button_post.addEventListener("click", () => {

        if (post_menu.classList == "hidden") {
            mostrarOpciones(post_menu)
        } else {
            ocultarOpciones(post_menu_all, post_menu)
        }
    })
}

//Renderizar div que contiene la funcion para crear una colección
async function vista_crearColeccion(post_menu, post) {
    let pag_body = document.querySelector("body")

    let div_crearColección = document.createElement("div")
    div_crearColección.className = "div_crearColeccion fixed bg-black/50 flex items-center justify-center z-30 inset-0"

    let div_content = document.createElement("div")
    div_content.className = "div_content border bg-white p-6"

    let div_btnVolver = document.createElement("div")
    div_btnVolver.className = "flex justify-center mb-3"
    let btn_volver = document.createElement("button")
    btn_volver.type = "button"
    btn_volver.title = "Volver"
    let flecha = document.createElement("p")
    flecha.className = "hover:bg-orange-400 hover:rounded-full w-fit p-1 font-bold cursor-pointer"
    flecha.textContent = "<--"

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

    div_crearColección.appendChild(div_content)
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
        pag_body.removeChild(div_crearColección)
    })

    pag_body.appendChild(div_crearColección)

    form_crearColección.addEventListener("submit", async (e) => {
        e.preventDefault()

        nuevaColección(form_crearColección, post_menu, post, div_crearColección, div_content)
    })
}

async function botonesColección(post_menu, post) {
    if (colecciones.length > 0) {
        for (const i of colecciones) {

            let li_colección = document.createElement("li")
            li_colección.className = "border-b-1 border-black"
            let div_colección = document.createElement("div")
            div_colección.className = "flex justify-between items-center p-2"

            let nombre_colección = document.createElement("p")
            nombre_colección.className = "mr-10"
            nombre_colección.textContent = i.nombre_colección

            let form_colección = document.createElement("form")
            form_colección.className = "ml-10"
            form_colección.action = `/guardar-en-coleccion`
            form_colección.method = "post"
            form_colección.name = i.nombre_colección
            form_colección.id = i.nombre_colección

            let label_colección = document.createElement("label")
            label_colección.for = "btn_guardarPublicación"

            let btn_colección = document.createElement("button")
            btn_colección.className = " cursor-pointer px-2 py-1"
            btn_colección.type = "submit"
            btn_colección.id = "btn_colección"
            btn_colección.innerHTML = `
                <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="24" height="24" viewBox="0 0 24 24">
                    <path d="M 5.5 2 A 0.50005 0.50005 0 0 0 5 2.5 L 5 21.5 A 0.50005 0.50005 0 0 0 5.7089844 21.953125 L 12 19.050781 L 18.291016 21.953125 A 0.50005 0.50005 0 0 0 19 21.5 L 19 2.5 A 0.50005 0.50005 0 0 0 18.5 2 L 5.5 2 z M 6 3 L 18 3 L 18 20.71875 L 12.208984 18.046875 A 0.50005 0.50005 0 0 0 11.791016 18.046875 L 6 20.71875 L 6 3 z"></path>
                </svg>
            `

            btn_colección.addEventListener('mouseenter', () => {
                btn_colección.innerHTML = `
                <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="24" height="24" viewBox="0 0 24 24">
                    <path d="M18.5,2h-13C5.224,2,5,2.224,5,2.5v19c0,0.171,0.087,0.329,0.23,0.421c0.143,0.093,0.324,0.104,0.479,0.033L12,19.051	l6.291,2.903C18.357,21.984,18.429,22,18.5,22c0.094,0,0.188-0.026,0.27-0.079C18.913,21.829,19,21.671,19,21.5v-19	C19,2.224,18.776,2,18.5,2z"></path>
                </svg>`
            });

            btn_colección.addEventListener('mouseleave', () => {
                btn_colección.innerHTML = `
               <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="24" height="24" viewBox="0 0 24 24">
                    <path d="M 5.5 2 A 0.50005 0.50005 0 0 0 5 2.5 L 5 21.5 A 0.50005 0.50005 0 0 0 5.7089844 21.953125 L 12 19.050781 L 18.291016 21.953125 A 0.50005 0.50005 0 0 0 19 21.5 L 19 2.5 A 0.50005 0.50005 0 0 0 18.5 2 L 5.5 2 z M 6 3 L 18 3 L 18 20.71875 L 12.208984 18.046875 A 0.50005 0.50005 0 0 0 11.791016 18.046875 L 6 20.71875 L 6 3 z"></path>
                </svg>`
            });

            li_colección.appendChild(div_colección)
            div_colección.appendChild(nombre_colección)
            div_colección.appendChild(form_colección)
            form_colección.appendChild(label_colección)
            label_colección.appendChild(btn_colección)

            post_menu.appendChild(li_colección)

            form_colección.addEventListener("submit", (e) => {
                e.preventDefault()

                guardarPublicación_colección(form_colección, post)
            })
        }
    }
}

async function nuevaColección(form_crearColección, post_menu, post, div_crearColección, div_content) {

    const data = form_crearColección.querySelector("#nombreColeccion").value

    try {
        const res = await fetch(form_crearColección.action, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({ data })
        })

        const result = await res.json()
        div_content.innerHTML = ""
        div_content.innerHTML = `
        <p class="p-3 text-3xl"> Se ha creado la colección exitosamente </p>
        <div class="flex justify-center items-center text-2xl pt-2"> 
            <label for="btn_salir"> 
                <button type="button" class="cursor-pointer hover:font-bold" id="btn_salir"> Salir </button>
            </label>
        </div>
        `
        colecciones = result.user_colecciones

        document.querySelector("#btn_salir").addEventListener("click", () => {

            let li_colección = document.createElement("li")
            li_colección.className = "border-b-1 border-black"
            let div_colección = document.createElement("div")
            div_colección.className = "flex justify-between items-center p-2"

            let nombre_colección = document.createElement("p")
            nombre_colección.className = "mr-10"
            nombre_colección.textContent = result.nueva_colección.nombre_colección

            let form_colección = document.createElement("form")
            form_colección.className = "ml-10"
            form_colección.action = `/guardar-en-coleccion`
            form_colección.method = "post"
            form_colección.name = result.nueva_colección.nombre_colección
            form_colección.id = result.nueva_colección.nombre_colección

            let label_colección = document.createElement("label")
            label_colección.for = "btn_colección"

            let btn_colección = document.createElement("button")
            btn_colección.className = " cursor-pointer px-2 py-1"
            btn_colección.type = "submit"
            btn_colección.id = "btn_colección"
            btn_colección.innerHTML = `
                <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="24" height="24" viewBox="0 0 24 24">
                    <path d="M 5.5 2 A 0.50005 0.50005 0 0 0 5 2.5 L 5 21.5 A 0.50005 0.50005 0 0 0 5.7089844 21.953125 L 12 19.050781 L 18.291016 21.953125 A 0.50005 0.50005 0 0 0 19 21.5 L 19 2.5 A 0.50005 0.50005 0 0 0 18.5 2 L 5.5 2 z M 6 3 L 18 3 L 18 20.71875 L 12.208984 18.046875 A 0.50005 0.50005 0 0 0 11.791016 18.046875 L 6 20.71875 L 6 3 z"></path>
                </svg>
            `

            btn_colección.addEventListener('mouseenter', () => {
                btn_colección.innerHTML = `
                <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="24" height="24" viewBox="0 0 24 24">
                    <path d="M18.5,2h-13C5.224,2,5,2.224,5,2.5v19c0,0.171,0.087,0.329,0.23,0.421c0.143,0.093,0.324,0.104,0.479,0.033L12,19.051	l6.291,2.903C18.357,21.984,18.429,22,18.5,22c0.094,0,0.188-0.026,0.27-0.079C18.913,21.829,19,21.671,19,21.5v-19	C19,2.224,18.776,2,18.5,2z"></path>
                </svg>`
            });

            btn_colección.addEventListener('mouseleave', () => {
                btn_colección.innerHTML = `
               <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="24" height="24" viewBox="0 0 24 24">
                    <path d="M 5.5 2 A 0.50005 0.50005 0 0 0 5 2.5 L 5 21.5 A 0.50005 0.50005 0 0 0 5.7089844 21.953125 L 12 19.050781 L 18.291016 21.953125 A 0.50005 0.50005 0 0 0 19 21.5 L 19 2.5 A 0.50005 0.50005 0 0 0 18.5 2 L 5.5 2 z M 6 3 L 18 3 L 18 20.71875 L 12.208984 18.046875 A 0.50005 0.50005 0 0 0 11.791016 18.046875 L 6 20.71875 L 6 3 z"></path>
                </svg>`
            });

            li_colección.appendChild(div_colección)
            div_colección.appendChild(nombre_colección)
            div_colección.appendChild(form_colección)
            form_colección.appendChild(label_colección)
            label_colección.appendChild(btn_colección)

            post_menu.appendChild(li_colección)

            form_colección.addEventListener("submit", (e) => {
                e.preventDefault()

                guardarPublicación_colección(form_colección, post)
            })

            div_crearColección.remove()
        })

    } catch (error) {
        console.error(`Ocurrió un error inesperado ${error}`)
    }

}

async function guardarPublicación_colección(form_colección, post) {

    const data_guardar = {
        postTitulo: post.querySelector(".post_titulo").textContent.trim(),
        nombreColección: form_colección.name
    }

    try {

        let res = await fetch(form_colección.action, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data_guardar)
        })

        let div_msj_coleccion = document.createElement("div")
        const posición_msj_coleccion = document.querySelector(".msj")

        div_msj_coleccion.className = "mb-3 bg-blue-600 px-5 py-2 font-bold"
        div_msj_coleccion.textContent = `Publicación guardada en "${data_guardar.nombreColección}"`

        posición_msj_coleccion.appendChild(div_msj_coleccion)

        let cont = 4

        const msj_temporizador_coleccion = setInterval(() => {

            if (cont > 0) {
                cont--;
            } else {
                clearInterval(msj_temporizador_coleccion);

                posición_msj_coleccion.removeChild(div_msj_coleccion)
            }

        }, 1000);

        let form_quitarPublicacion = document.createElement("form")
        form_quitarPublicacion.className = "ml-10"
        form_quitarPublicacion.action = "/quitar-de-coleccion"
        form_quitarPublicacion.method = "post"
        form_quitarPublicacion.name = form_colección.name
        form_quitarPublicacion.id = form_colección.id

        form_quitarPublicacion.innerHTML = `
            <label for="btn_colección_guardado">
                <button class=" cursor-pointer px-2 py-1" type="submit" id="btn_colección_guardado">
                    <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="24" height="24" viewBox="0 0 24 24">
                        <path d="M18.5,2h-13C5.224,2,5,2.224,5,2.5v19c0,0.171,0.087,0.329,0.23,0.421c0.143,0.093,0.324,0.104,0.479,0.033L12,19.051	l6.291,2.903C18.357,21.984,18.429,22,18.5,22c0.094,0,0.188-0.026,0.27-0.079C18.913,21.829,19,21.671,19,21.5v-19	C19,2.224,18.776,2,18.5,2z"></path>
                    </svg>
                </button>
            </label>
        `
        form_colección.replaceWith(form_quitarPublicacion)

        form_quitarPublicacion.addEventListener("submit", (e) => {
            e.preventDefault()

            quitarPublicación_colección(form_quitarPublicacion, post)
        })

    } catch (error) {
        console.error(`Ocurrió un error inesperado ${error}`)
    }
}

async function quitarPublicación_colección(form_quitarPublicacion, post) {

    const data_quitar = {
        postTitulo: post.querySelector(".post_titulo").textContent.trim(),
        nombreColección: form_quitarPublicacion.name
    }

    try {
        let res = await fetch(form_quitarPublicacion.action, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data_quitar)
        })

        let div_msj_coleccion = document.createElement("div")
        const posición_msj_coleccion = document.querySelector(".msj")

        div_msj_coleccion.className = "mb-3 bg-red-600 px-5 py-2 font-bold"
        div_msj_coleccion.textContent = `Publicación removida"`

        posición_msj_coleccion.appendChild(div_msj_coleccion)

        let cont = 4

        const msj_temporizador_coleccion = setInterval(() => {

            if (cont > 0) {
                cont--;
            } else {
                clearInterval(msj_temporizador_coleccion);

                posición_msj_coleccion.removeChild(div_msj_coleccion)
            }

        }, 1000);

        let form_guardarPublicacion = document.createElement("form")
        form_guardarPublicacion.className = "ml-10"
        form_guardarPublicacion.action = "/guardar-en-coleccion"
        form_guardarPublicacion.method = "post"
        form_guardarPublicacion.name = form_quitarPublicacion.name
        form_guardarPublicacion.id = form_quitarPublicacion.id

        form_guardarPublicacion.innerHTML = `
            <label for="btn_colección">
                <button class=" cursor-pointer px-2 py-1" type="submit" id="btn_colección">
                    <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="24" height="24" viewBox="0 0 24 24">
                        <path d="M 5.5 2 A 0.50005 0.50005 0 0 0 5 2.5 L 5 21.5 A 0.50005 0.50005 0 0 0 5.7089844 21.953125 L 12 19.050781 L 18.291016 21.953125 A 0.50005 0.50005 0 0 0 19 21.5 L 19 2.5 A 0.50005 0.50005 0 0 0 18.5 2 L 5.5 2 z M 6 3 L 18 3 L 18 20.71875 L 12.208984 18.046875 A 0.50005 0.50005 0 0 0 11.791016 18.046875 L 6 20.71875 L 6 3 z"></path>
                    </svg>
                </button>
            </label>
            
        `
        form_quitarPublicacion.replaceWith(form_guardarPublicacion)

        form_guardarPublicacion.addEventListener("submit", (e) => {
            e.preventDefault()

            guardarPublicación_colección(form_guardarPublicacion, post)
        })
    } catch (error) {
        console.error(`Ocurrió un error inesperado ${error}`)
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