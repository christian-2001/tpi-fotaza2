const comment_content = document.querySelectorAll(".comentario_usuario")
let comments = document.querySelectorAll(".comment_options")
const post_content = document.querySelector(".post_content")
const btn_valorizar = document.querySelector(".btn_valorizar")
const notas = document.querySelector(".notas")
const stars = document.querySelectorAll(".stars")
const comment_input = document.querySelector("#comment_input")
const cant_valorizaciones = document.querySelector(".cant_valorizaciones")
const prom_valorizacion = document.querySelector(".prom_valorizacion")

//Variables globales que activan/desactivan clases para el textarea que contiene el comentario
//y para activar/desactivar el mensaje cuando el comentario alcanza el limite de caracteres respectivamente
let limit_msg
let textarea_styles

//document.addEventListener("DOMContentLoaded", commentOptions)


//Cada vez que se escriba en el textarea "comment_input", se ejecuta la funcion que valida el comentario
if (comment_input) {
    comment_input.addEventListener("input", validarComentario_caracteres1)
}

let comment_form = document.forms.namedItem("comment_form")

if (comment_form != undefined) {
    subirComentario()
}

async function subirComentario() {
    comment_form.addEventListener("submit", async (e) => {
        e.preventDefault()

        //Usamos otra funcion que valida si el comentario enviado es o no vacio
        const approved = validarComentario_caracteres2()
        if (!approved) {
            return
        }
        //Guardamos el commentario quitando espacios sobrantes
        const text = e.target[0].value.trim()


        //Peticion para envio del comentario al servidor
        const response = await fetch(comment_form.action, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },

            body: JSON.stringify({
                comentario: {
                    id_img: id_img,
                    texto: text
                }
            })
        })

        //Una vez recibido los datos desde el servidor via res.json, formatea y renderiza el nuevo comentario en la imagen de la publicacion
        const newComment = await response.json();
        //Contenedor con texto predeterminado cuando una imagen no tiene comentarios
        const no_msg_text = document.querySelector(".no_msg_text")

        //En caso que el nuevo comentario sea el primero de la imagen de la publicacion, se elimina el texto predeterminado del contenedor
        if(no_msg_text){
            no_msg_text.textContent = ""
        }

        const div_comments_content = document.querySelector(".contenido")
        const img_comments = document.querySelector(".comentarios")

        const div_comentario_usuario = document.createElement("div")
        div_comentario_usuario.className = "comentario_usuario bg-blue-200 rounded-[1vw] mb-5 pl-3 pr-4 pt-2 pb-4 w-fit"

        const div_comment_options = document.createElement("div")
        div_comment_options.className = "comment_options relative"

        const svg_tag = document.createElementNS("http://www.w3.org/2000/svg", "svg")
        svg_tag.classList.toggle("w-5")
        svg_tag.classList.toggle("absolute")
        svg_tag.classList.toggle("-right-4")
        svg_tag.classList.toggle("hover:cursor-pointer")
        svg_tag.classList.toggle("hover:w-6")
        svg_tag.setAttribute("viewBox", "0 0 16 16")

        const path_tag = document.createElementNS("http://www.w3.org/2000/svg", "path")
        path_tag.setAttribute("fill", "#4f46e5")
        path_tag.setAttribute("d", "M9.5 13a1.5 1.5 0 1 1-3 0a1.5 1.5 0 0 1 3 0m0-5a1.5 1.5 0 1 1-3 0a1.5 1.5 0 0 1 3 0m0-5a1.5 1.5 0 1 1-3 0a1.5 1.5 0 0 1 3 0")

        const h1_nombre_usuario = document.createElement("h1")
        h1_nombre_usuario.className = "nombre_usuario font-bold"
        h1_nombre_usuario.textContent = newComment.nombre_usuario

        const h1_texto = document.createElement("h1")
        h1_texto.className = "texto"
        h1_texto.textContent = newComment.comment_text

        svg_tag.appendChild(path_tag)
        div_comment_options.appendChild(svg_tag)
        div_comentario_usuario.appendChild(div_comment_options)
        div_comentario_usuario.appendChild(h1_nombre_usuario)
        div_comentario_usuario.appendChild(h1_texto)
        div_comments_content.appendChild(div_comentario_usuario)

        //Actualizamos las opciones disponibles en todos los comentarios incluyendo el nuevo
        //comments = document.querySelectorAll(".comment_options")
        //commentOptions()


        if (div_comments_content.childNodes.length >= 6) {
            img_comments.querySelector(".div_comment_submit").classList.replace("top-200", "bottom-0")
        }

        document.querySelector(".comment_text #comment_input").value = ""
    })
}

if (document.querySelector(".contenido").childNodes.length >= 6) {
    document.querySelector(".comentarios").querySelector(".div_comment_submit").classList.replace("top-200", "bottom-0")
}

//Funcion para validar un comentario
function validarComentario_caracteres1() {
    //Si la cantidad de caracteres es igual al maximo permitido(1000)
    //se agregan estilos al textarea
    //aparece un mensaje debajo indicando al usuario que llegó al limite de caracteres permitido
    if (comment_input.value.length == 1000) {
        if (!textarea_styles) {
            textarea_styles = ["border-2", "border-red-600"]
            textarea_styles.forEach(style => {
                comment_input.classList.toggle(style)
            })
            limit_msg = document.createElement("p")
            limit_msg.classList.toggle("text-red-600")
            limit_msg.classList.toggle("font-bold")
            limit_msg.textContent = "Limite de caracteres alcanzado"
            document.querySelector(".comment_text").appendChild(limit_msg)
        }
    } else {
        //Quitamos las clases y el mensaje si la cantidad de caracteres en un comentario es menor al limite
        if (textarea_styles) {
            textarea_styles.forEach(style => {
                comment_input.classList.remove(`${style}`)
            })
            textarea_styles = undefined
            document.querySelector(".comment_text").removeChild(limit_msg)
            limit_msg = undefined
        }
    }
}

//Funcion para validar si un comentario es o no vacio
function validarComentario_caracteres2() {
    //Comprueba si el comentario es totalmente vacio, si contiene unicamente saltos de linea, o caracteres en blanco por ejemplo -> "  "
    if (comment_input.value.length == 0 || (/^\n+$/).test(comment_input.value) || (/^\s*$/).test(comment_input.value)) {
        //Si el comentario es vacio, aplicamos las mismas clases pero con otro mensaje
        if (!textarea_styles) {
            textarea_styles = ["border-2", "border-red-600"]
            textarea_styles.forEach(style => {
                comment_input.classList.toggle(style)
            })
            limit_msg = document.createElement("p")
            limit_msg.classList.toggle("text-red-600")
            limit_msg.classList.toggle("font-bold")
            limit_msg.textContent = "No se puede enviar un mensaje vacio!!!"
            document.querySelector(".comment_text").appendChild(limit_msg)
            return false
        }
    } else {
        //Quitamos las clases y el mensaje si el comentario no es vacio
        if (textarea_styles) {
            textarea_styles.forEach(style => {
                comment_input.classList.remove(`${style}`)
            })
            textarea_styles = undefined
            document.querySelector(".comment_text").removeChild(limit_msg)
            limit_msg = undefined
        }
        return true
    }
}

let selected = 0;

stars.forEach((star, index) => {
    const svgHueca = star.querySelectorAll("svg")[0];
    const svgRellena = star.querySelectorAll("svg")[1];

    svgHueca.addEventListener("mouseover", () => {
        pintarEstrellas(index + 1);
    });

    star.addEventListener("mouseout", (e) => {
        if (!star.contains(e.relatedTarget)) {
            pintarEstrellas(selected);
        }
    });

    star.addEventListener("click", () => {
        selected = index + 1;
        pintarEstrellas(selected);
        enviarValorizacion(selected)
    });
});

function pintarEstrellas(n) {
    stars.forEach((star, i) => {
        const svgHueca = star.querySelectorAll("svg")[0];
        const svgRellena = star.querySelectorAll("svg")[1];

        if (i < n) {
            svgHueca.classList.add("hidden");
            svgRellena.classList.remove("hidden");
        } else {
            svgHueca.classList.remove("hidden");
            svgRellena.classList.add("hidden");
        }
    });
}

function enviarValorizacion(stars) {

    fetch(window.location.href, {
        method: "post",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            valorizacion: {
                id_img: id_img,
                puntaje: stars
            }
        })
    })
        .then(res => res.json())
        .then(data => {
            if (data.cantValorizaciones) {
                cant_valorizaciones.textContent = data.cantValorizaciones
            }

            prom_valorizacion.innerHTML = ""

            for (let i = 0; i < Math.round(data.prom_valorizacion); i++) {
                prom_valorizacion.textContent += "⭐"
            }

        })

}

//Renderizar las 5 estrellas para calificar una imagen al posicionarse sobre el texto "Valorizar"
if (btn_valorizar) {
    btn_valorizar.addEventListener("mouseover", () => {
        notas.classList.replace("hidden", "block")
    })

    //Al dejar de posicionarse en ese texto, desaparecen las estrellas
    btn_valorizar.addEventListener("mouseout", () => {
        notas.classList.replace("block", "hidden")
    })
}
//Funcion que despliega opciones disponibles para todos los comentarios(de momento denuncia) NO SE TENDRÁ EN CUENTA PARA LA ENTREGA PARCIAL 
/*
function commentOptions() {
    //if (!com.querySelector(".options")) {}
    for (const com of comment_content) {

        const id_comentario = com.id
        const comment_options = com.querySelector(".comment_options")

        comment_options.addEventListener("click", () => {
            if (!comment_options.querySelector(".options")) {
                const div_options = document.createElement("div")
                div_options.classList.add("options")
                div_options.classList.add("absolute")
                div_options.classList.add("top-5")
                div_options.classList.add("-right-4")

                div_options.classList.add("bg-white")

                const ul_options = document.createElement("ul")
                const li = document.createElement("li")
                ul_options.appendChild(li)

                li.classList.add("border-b-2")
                li.classList.add("p-[3px]")
                li.classList.add("border-gray-400")

                const anchor = document.createElement("a")
                anchor.href = `/denuncia?idComentario=${id_comentario}`

                const btn_denuncia = document.createElement("button")
                btn_denuncia.type = "button"
                btn_denuncia.classList.add("hover:cursor-pointer")
                btn_denuncia.classList.add("hover:font-bold")
                btn_denuncia.classList.add("hover:text-1xl")
                btn_denuncia.textContent = "Denunciar comentario"


                anchor.appendChild(btn_denuncia)
                li.appendChild(anchor)

                div_options.appendChild(ul_options)
                comment_options.appendChild(div_options)

            } else if (comment_options.querySelector(".options")) {
                comment_options.querySelector(".options").remove()
            }
        })

    }
}*/
