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
        const div_img_container = document.createElement("div")
        const div_img = document.createElement("div")
        const img = document.createElement("img")
        const btn_eliminar = document.createElement("button")
        const img_etiquetas = document.createElement("input")

        div_img_container.id = file.name.split(".")[0]
        div_img_container.className = "div_img_container flex flex-col"
        div_img.className = "imagen relative"

        //img.file = file
        //------------------------ Aplicamos estilos al contenedor de imagenes ------------------------
        img_preview.classList.toggle("p-2")
        img_preview.classList.replace("hidden", "static")
        //------------------------ Aplicamos estilos al contenedor de imagenes ------------------------

        img.className = "w-full"
        img.id = "img_loaded"
        div_img_container.appendChild(div_img)
        div_img.appendChild(img)

        //Se adjuntan las imagenes al contenedor

        btn_eliminar.type = "button"
        btn_eliminar.id = `img${cont_imgs}`
        btn_eliminar.className = "mt-2 bg-white hover:bg-red-500 hover:text-white hover:font-bold cursor-pointer"
        btn_eliminar.onclick = () => quitarImagen(div_img_container.id)
        btn_eliminar.textContent = "Quitar Imagen"

        img_etiquetas.type = "text"
        img_etiquetas.id = `img${cont_imgs}_etiquetas`
        img_etiquetas.className = "bg-white w-full text-[15px] mt-2 p-1"
        img_etiquetas.placeholder = "Agregar etiquetas (entre 1 y 7, y un maximo de 25 caracteres cada una)"
        //class="bg-white w-full text-[15px] mt-2 p-1"

        //============================================= LICENCIA Y TEXTO PERSONALIZADO ===========================================================================
        const div_licencia = document.createElement("div") // Contenedor con inputs (checkbox y text) para la Licencia y Texto personalizado respectivamente
        const div_checkboxs = document.createElement("div") //Contenedor con checkboxs y label respectivos para "Licencia" y "Texto personalizado"

        const div_checkLabel_licencia = document.createElement("div") //Contenedor con checkbox y label para "Licencia"
        const check_licencia = document.createElement("input") // Input checkbox para Licencia
        const label_licencia = document.createElement("label") // Label alineado horizontalmente con el checkbox

        const div_checkLabel_texto_personalizado = document.createElement("div") //Contenedor con checkbox y uno de los labels para "Texto Personalizado"
        const check_texto_personalizado = document.createElement("input") // Checkbox para el label correspondiente a "Texto Personalizado"
        const labelCheck_texto_personalizado = document.createElement("label") // Label anexado con el input checkbox para "Texto personalizado"
        const label_inputText_texto_personalizado = document.createElement("label") // Label anexado con el input text para "Texto personalizado"
        const inputText_texto_personalizado = document.createElement("input") // Input text para Texto personalizado


        div_licencia.className = "div_licencia bg-white p-4 items-center mt-2 text-wrap"
        div_checkboxs.className = "licencia flex flex-col gap-2 w-100"

        div_checkLabel_licencia.className = "item flex gap-2"
        check_licencia.type = "checkbox"
        check_licencia.id = "checkbox_licencia"
        check_licencia.name = "checkbox_licencia"
        check_licencia.value = "checkbox_licencia"

        label_licencia.className = "font-bold"
        label_licencia.for = "checkbox_licencia"
        label_licencia.textContent = "Licencia(Copyright)"

        div_checkLabel_texto_personalizado.className = "item flex gap-2"
        check_texto_personalizado.type = "checkbox"
        check_texto_personalizado.disabled = "true"
        check_texto_personalizado.id = "check_texto_personalizado"
        check_texto_personalizado.name = "check_texto_personalizado"
        check_texto_personalizado.value = "check_texto_personalizado"

        labelCheck_texto_personalizado.for = "check_texto_personalizado"
        labelCheck_texto_personalizado.className = "font-bold text-gray-400"
        labelCheck_texto_personalizado.textContent = 'Texto Personalizado (hasta 15 caracteres) (Si usted lo deja vacío, se generará la marca de agua con el texto "fotaza2" por defecto)'

        label_inputText_texto_personalizado.for = "inputText_texto_personalizado"

        inputText_texto_personalizado.type = "text"
        inputText_texto_personalizado.disabled = "true"
        inputText_texto_personalizado.id = "inputText_texto_personalizado"
        inputText_texto_personalizado.name = "inputText_texto_personalizado"
        inputText_texto_personalizado.className = "border px-1 mt-3 disabled:opacity-40 disabled:bg-gray-400 disabled:cursor-not-allowed disabled:border-none w-full"
        inputText_texto_personalizado.placeholder = "Ingrese un texto para la marca de agua"

        //============================================= LICENCIA Y TEXTO PERSONALIZADO ===========================================================================
        /*
            REFERENCIA PARA MÁS ADELANTE
            h1(class="text-gray-300 text-[80px] absolute inset-0 flex justify-center items-center") marca_de_agua
        */
        
        div_img_container.appendChild(btn_eliminar)
        div_img_container.appendChild(img_etiquetas)
        img_preview.appendChild(div_img_container)

        div_img_container.appendChild(div_licencia)
        div_licencia.appendChild(div_checkboxs)

        div_checkboxs.appendChild(div_checkLabel_licencia)
        div_checkLabel_licencia.appendChild(check_licencia)
        div_checkLabel_licencia.appendChild(label_licencia)

        div_checkboxs.appendChild(div_checkLabel_texto_personalizado)
        div_checkLabel_texto_personalizado.appendChild(check_texto_personalizado)
        div_checkLabel_texto_personalizado.appendChild(labelCheck_texto_personalizado)

        div_licencia.appendChild(label_inputText_texto_personalizado)
        div_licencia.appendChild(inputText_texto_personalizado)

        check_licencia.addEventListener("change", (e) => {
            if (check_licencia.checked) {
                check_texto_personalizado.removeAttribute("disabled")
                labelCheck_texto_personalizado.classList.remove("text-gray-400")
            } else {
                if (check_texto_personalizado.checked) {
                    check_texto_personalizado.checked = false
                    inputText_texto_personalizado.disabled = "true"
                    inputText_texto_personalizado.className = "border px-1 mt-3 disabled:opacity-40 disabled:bg-gray-400 disabled:cursor-not-allowed disabled:border-none w-full"
                }
                check_texto_personalizado.disabled = "true"
                labelCheck_texto_personalizado.className = "font-bold text-gray-400"
            }
        })

        check_texto_personalizado.addEventListener("change", (e) => {
            if (check_texto_personalizado.checked) {
                inputText_texto_personalizado.removeAttribute("disabled")
                inputText_texto_personalizado.classList.remove("disabled:opacity-40", "disabled:bg-gray-400", "disabled:cursor-not-allowed", "disabled:border-none")
            } else {
                inputText_texto_personalizado.disabled = "true"
                inputText_texto_personalizado.className = "border px-1 mt-3 disabled:opacity-40 disabled:bg-gray-400 disabled:cursor-not-allowed disabled:border-none w-full"
            }
        })

        inputText_texto_personalizado.addEventListener("keyup", (e) => {
      
            if(!div_img_container.querySelector("h1")){
                //h1(class="text-gray-300 text-[80px] absolute inset-0 flex justify-center items-center") marca_de_agua
                const h1 = document.createElement("h1")
                h1.className = "text-gray-300 text-[30px] absolute inset-0 z-1 flex justify-center items-center"
                div_img.appendChild(h1)
                h1.textContent = inputText_texto_personalizado.value
            } else{
                div_img.querySelector("h1").innerHTML = ""
                div_img.querySelector("h1").textContent = inputText_texto_personalizado.value
            }
        })

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
    const div_img_container = document.getElementById(div)
    img_preview.removeChild(div_img_container)
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
        const bodyData = {
            formTitle: titulo,
            formDescription: descripcion,
            formImages: imagenes,
            formPostTags: postEtiquetas
        }

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