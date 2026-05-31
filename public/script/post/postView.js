const comment_content = document.querySelectorAll(".comentario_usuario")
const comments = document.querySelectorAll(".comment_options")
const post_content = document.querySelector(".post_content")
const btn_valorizar = document.querySelector(".btn_valorizar")
const notas = document.querySelector(".notas")
const stars = document.querySelectorAll(".stars")

let selected = 0;

stars.forEach((star, index) => {
    const svgHueca   = star.querySelectorAll("svg")[0];
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
    console.log("estoy dentro")
    stars.forEach((star, i) => {
        const svgHueca   = star.querySelectorAll("svg")[0];
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


btn_valorizar.addEventListener("mouseover", () => {
    notas.classList.replace("hidden", "block")
})

btn_valorizar.addEventListener("mouseout", () => {
    notas.classList.replace("block", "hidden")
})

for (const com of comments) {
    com.addEventListener("click", () => {

        const div_options = document.createElement("div")
        div_options.classList.toggle("absolute")
        div_options.classList.toggle("top-0")
        div_options.classList.toggle("right-6")

        div_options.classList.toggle("bg-white")

        const denunciar = document.createElement("div")
        denunciar.classList.toggle("border-b-2")
        denunciar.classList.toggle("p-2")
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

