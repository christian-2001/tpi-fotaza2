let posts = document.querySelectorAll(".post") //--> Todas las publicaciónes guardadas como favorito
let post_menu_all = document.querySelectorAll(".opciones") //--> Obtiene todos los nodos que contienen el boton "..." en todas las publicaciones

//Iterar sobre todas las publicaciones

for (const p of posts) {

    //Lista de opciones disponibles en todas las publicaciones
    let post_menu = p.querySelector(".opciones")

    //Boton "..." visible en la esquina superior derecha, en todas las publicaciones, que muestra/oculta las opciones
    let button_post = p.querySelector(".boton_opciones")

    //Boton que permite guardar una publicación en una colección
    let btn_colección = p.querySelector("#btn_colección")

    //Obtiene el formulario que permite guardar la publicación en "Favoritos"
    let form_guardarFavoritos = p.querySelector("#guardarFavoritos")

    //Obtiene el formulario que permite quitar la publicación de "Favoritos"
    let form_quitarFavoritos_duenio = p.querySelector("#quitarFavoritos_duenio")

    //Obtiene el formulario que permite quitar la publicación de "Favoritos"
    let form_quitarFavoritos_noduenio = p.querySelector("#quitarFavoritos_noduenio")


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
            console.log("Aasd")

            div_colecciones(btn_colección, post_menu, button_post, p)
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

    /*let user_content = document.querySelector(".user_content")
    let div_favoritos = user_content.querySelector("p")
    let posts = user_content.querySelector(".user_posts")
    let sección_favoritos = document.querySelector(".favoritos")
    let cant_favoritos = parseInt(sección_favoritos.textContent.match(/\d+/))*/

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


    try {
        /*
        const res = await fetch(form_quitarFavoritos_duenio.action, {
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
        */
    } catch (error) {
        console.error(`ERROR AL QUITAR LA PUBLICACIÓN --> ${error}`)
    }
}

//Función que culta los botones "Guardar en Favoritos" y "Guardar en Colección" renderizando el boton para crear colección y el listado de colecciones creados por el usuario
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

//Renderizar div que contiene la Función para crear una colección
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
    flecha.innerHTML =
        `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M19 12H5" />
        <path d="M12 19l-7-7 7-7" />
    </svg>`

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
async function nuevaColección(form_crearColección, post_menu, post, div_crearColección, div_content) {

    //Dato a enviar en la peticion POST
    const data = form_crearColección.querySelector("#nombreColeccion").value

    //Fetch con POST
    try {
        const res = await fetch(form_crearColección.action, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({ data })
        })

        const result = await res.json()

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

        //Renderiza listado de colecciones en el menu de opciones de la publicación al tocar el boton para salir del div que crea una colección
        document.querySelector("#btn_salir").addEventListener("click", () => {

            let li_colección = document.createElement("li")
            li_colección.className = "coleccion border-b-1 border-black"
            let div_colección = document.createElement("div")
            div_colección.className = "flex justify-between items-center p-2"

            let nombre_colección = document.createElement("p")
            nombre_colección.className = "mr-10"
            nombre_colección.textContent = result.nueva_colección.nombre_colección

            li_colección.appendChild(div_colección)
            div_colección.appendChild(nombre_colección)
            post_menu.appendChild(li_colección)

            //Renderiza las colecciones del usuario junto con un bookmark hueco que permite guardar una publicación en una colección especifica
            form_guardarPublicación_colección_render(post, result.nueva_colección.nombre_colección, div_colección)

            div_crearColección.remove()
        })

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