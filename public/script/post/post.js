const img_options = document.getElementById("img_options")
//El input de tipo "file" dentro del formulario
const img_file = document.getElementById("img_file");

//La leyenda "Vista previa:" que se mostrara al cargar imagenes
const preview_text = document.getElementById("preview_text")

//Contenedor donde muestra un adelanto de la o las imagenes antes de ser publicadas
const img_preview = document.getElementById("preview")

const form = document.forms[0]

form.addEventListener("submit", enviarFormulario)

let cont_imgs = 0
//

//Cuando el input de tipo "file" cambie, comienza a renderizar las imagenes
img_file.addEventListener("change", (event) => {
    const files = event.target.files
    if (files.length) {
        manejarImagenes(files, event)
    }
})

//Funcion que crea una etiqueta "img" por cada imagen que seleccione el usuario,
//En cada etiqueta 
function manejarImagenes(files, event) {
    for (const file of files) {
        cont_imgs++
        const div_img = document.createElement("div")
        const img = document.createElement("img")
        const btn_eliminar = document.createElement("button")
        const img_etiquetas = document.createElement("input")
     

        div_img.id = file.name.split(".")[0]
        div_img.classList.toggle("flex")
        div_img.classList.toggle("flex-col")


        //img.file = file
        //------------------------ Aplicamos estilos al contenedor de imagenes ------------------------
        img_preview.classList.toggle("p-2")
        img_preview.classList.replace("hidden", "static")
        //------------------------ Aplicamos estilos al contenedor de imagenes ------------------------

        img.style.width = "100"
        img.id = "img_loaded"
        div_img.appendChild(img)

        //Se adjuntan las imagenes al contenedor

        btn_eliminar.type = "button"
        btn_eliminar.id = `img${cont_imgs}`
        btn_eliminar.classList.toggle("mt-2")
        btn_eliminar.classList.toggle("bg-white")
        btn_eliminar.onclick = () => quitarImagen(div_img.id)
        btn_eliminar.textContent = "Quitar Imagen"

        img_etiquetas.type = "text"
        img_etiquetas.id = `img${cont_imgs}_etiquetas`
        img_etiquetas.classList.toggle("bg-white")
        img_etiquetas.classList.toggle("w-full")
        img_etiquetas.classList.toggle("text-[15px]")
        img_etiquetas.classList.toggle("mt-2")
        img_etiquetas.classList.toggle("p-1")
        img_etiquetas.placeholder = "Agregar etiquetas (entre 1 y 7, y un maximo de 25 caracteres cada una)"
//class="bg-white w-full text-[15px] mt-2 p-1"
        div_img.appendChild(btn_eliminar)
        div_img.appendChild(img_etiquetas)
        img_preview.appendChild(div_img)
        renderizarImagenes(img, file)
    }
    preview_text.classList.replace("hidden", "block")
    preview_text.textContent = "Vista previa:"


}

//Se guarda en el "src" de cada etiqueta "img", la informacion codificada en base64 de cada imagen seleccionada
function renderizarImagenes(img, file) {
    const reader = new FileReader()

    reader.onload = (e) => {
        img.src = e.target.result
    }

    reader.readAsDataURL(file)
}

function quitarImagen(div) {
    const div_img = document.getElementById(div)
    img_preview.removeChild(div_img)
    if (!img_preview.hasChildNodes()) {
        preview_text.innerHTML = ""
        img_preview.classList.remove("static")
        img_preview.classList.toggle("hidden")

        preview_text.classList.remove("block")
        preview_text.classList.toggle("hidden")
    }
}

function enviarFormulario(event) {
    event.preventDefault()

    const titulo = document.getElementById("titulo").value
    const descripcion = document.getElementById("descripcion").value
    const imagenes = []
    let postEtiquetas = document.getElementById("etiquetas").value.trim()
    postEtiquetas = postEtiquetas.split(" ")

    console.log(titulo)

    if (img_preview.hasChildNodes()) {
        for (let a of img_preview.children) {
            const name = a.id
            const src = a.childNodes[0].src
            let arrImgTags = a.childNodes[2].value.trim()
            arrImgTags = arrImgTags.split(" ")

            imagenes.push({
                img_name: name,
                img_src: src,
                img_tags: arrImgTags
            })
        }
        console.log(imagenes)
        const bodyData = {
            formTitle: titulo,
            formDescription: descripcion,
            formImages: imagenes,
            formPostTags: postEtiquetas
        }
            console.log(imagenes)

        fetch(form.action, {
            method: "post",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(bodyData)
        })
        .then(() => {
            window.location.assign("/")
        }).catch((err) => {
            console.error(err)
        })
        /*
        .then(() => {
            window.location.assign("/")
        }).catch((err) => {
            console.error(err)
        })
        */
    }
}


//button(type="button" class="text-[30px] font-bold bg-red-400 px-7 cursor-pointer") Quitar Imagen