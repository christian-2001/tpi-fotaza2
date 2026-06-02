const comment_content = document.querySelectorAll(".comentario_usuario")
let comments = document.querySelectorAll(".comment_options")
const post_content = document.querySelector(".post_content")
const btn_valorizar = document.querySelector(".btn_valorizar")
const notas = document.querySelector(".notas")
const stars = document.querySelectorAll(".stars")
const comment_input = document.querySelector("#comment_input")

//Variables globales que activan/desactivan clases para el textarea que contiene el comentario
//y para activar/desactivar el mensaje cuando el comentario alcanza el limite de caracteres respectivamente
let limit_msg
let textarea_styles

document.addEventListener("DOMContentLoaded", commentOptions)


//Cada vez que se escriba en el textarea "comment_input", se ejecuta la funcion que valida el comentario
comment_input.addEventListener("input", validarComentario_caracteres1)
const comment_form = document.forms[0]

comment_form.addEventListener("submit", async (e) => {
    e.preventDefault()
    console.log(comment_input.value)
    //Usamos otra funcion que valida si el comentario enviado es o no vacio
    const approved = validarComentario_caracteres2()
    if(!approved){
        return
    }
    //Guardamos el commentario quitando espacios sobrantes
    const text = e.target[0].value.trim()
    console.log(text)
    console.log(comment_form.action)
    const response = await fetch(comment_form.action, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ comment_text: text })
    })

    const newComment = await response.json();
    console.log(newComment)

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
    h1_nombre_usuario.textContent = "tito2001"

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
    comments = document.querySelectorAll(".comment_options")
    commentOptions()


    if (div_comments_content.childNodes.length >= 6) {
        img_comments.querySelector(".div_comment_submit").classList.replace("top-200", "bottom-0")
    }

    document.querySelector(".comment_text #comment_input").value = ""
})

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
function validarComentario_caracteres2(){
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

/*
    validarComentario_caracteres
*/
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
        stars.forEach(s => s.classList.toggle("pointer-events-none"))
        btn_valorizar.querySelector("p").textContent = "Imagen Valorizada"
        btn_valorizar.classList.remove("hover:font-bold")
        notas.classList.toggle("block")
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

/*
console.log(stars)

stars.forEach((star, index) => {

    let star_elem = star.querySelectorAll("svg")
    console.log(star_elem)
    console.log(index)
    star_elem[0].addEventListener("mouseover", () => {
        //star_elem[0].classList.toggle("hidden")
        pintarEstrella(stars, index)
    })
    
    star_elem[1].addEventListener("mouseout", () =>{
        //quitarRellenoEstrella(stars, index)
    })

})*/
/*
function pintarEstrella(stars, index){
    
    for(let i = 0; i < index; i++){
        stars[i].querySelectorAll("svg")[0].classList.toggle("hidden")
        stars[i].querySelectorAll("svg")[1].classList.replace("hidden", "block")
        stars[i].querySelectorAll("svg")[1].classList.toggle("cursor-pointer")
    }
    }*/
/*
    star_elem[1].classList.replace("hidden", "block")
    star_elem[1].classList.toggle("cursor-pointer")
    console.log(stars[index].querySelectorAll("svg")[0])*/
/*
function quitarRellenoEstrella(stars, index){
       for(let i = index; i > 0; i--){
           stars[i].querySelectorAll("svg")[1].classList.replace("block", "hidden")
           stars[i].querySelectorAll("svg")[0].classList.replace("hidden", "block")
           stars[i].querySelectorAll("svg")[0].classList.toggle("cursor-pointer")
       }
}*/
/*
  star_elem[0].addEventListener("mouseover", () => {
      star_elem[0].classList.toggle("hidden")
      star_elem[1].classList.replace("hidden", "block")
      star_elem[1].classList.toggle("cursor-pointer")
      console.log(index)
  })

  star_elem[1].addEventListener("mouseout", () =>{
      star_elem[1].classList.replace("block", "hidden")
      star_elem[0].classList.replace("hidden", "block")
      star_elem[0].classList.toggle("cursor-pointer")
      console.log(index)
  })
      */

//Renderizar las 5 estrellas para calificar una imagen al posicionarse sobre el texto "Valorizar"
btn_valorizar.addEventListener("mouseover", () => {
    notas.classList.replace("hidden", "block")
})

//Al dejar de posicionarse en ese texto, desaparecen las estrellas
btn_valorizar.addEventListener("mouseout", () => {
    notas.classList.replace("block", "hidden")
})

//Funcion que despliega opciones disponibles para todos los comentarios
function commentOptions() {
    for (const com of comments) {
        if (!com.querySelector(".comment_options")) {
            com.addEventListener("click", () => {

                const div_options = document.createElement("div")
                div_options.classList.toggle("options")
                div_options.classList.toggle("absolute")
                div_options.classList.toggle("top-5")
                div_options.classList.toggle("-right-4")

                div_options.classList.toggle("bg-white")

                const denunciar = document.createElement("div")
                denunciar.classList.toggle("border-b-2")
                denunciar.classList.toggle("p-[3px]")
                denunciar.classList.toggle("border-gray-400")

                const btn_denuncia = document.createElement("button")
                btn_denuncia.type = "button"
                btn_denuncia.classList.toggle("hover:cursor-pointer")
                btn_denuncia.classList.toggle("hover:font-bold")
                btn_denuncia.classList.toggle("hover:text-1xl")
                btn_denuncia.textContent = "Denunciar comentario"

                denunciar.appendChild(btn_denuncia)
                div_options.appendChild(denunciar)
                com.appendChild(div_options)
            })
        }
    }
}
