const img_options = document.getElementById("img_options")
//El input de tipo "file" dentro del formulario
const img_file = document.getElementById("img_file");

//La leyenda "Vista previa:" que se mostrara al cargar imagenes
const preview_text = document.getElementById("preview_text")

//Contenedor donde muestra un adelanto de la o las imagenes antes de ser publicadas
const img_preview = document.getElementById("preview")

let cont_imgs = 0
//

//Cuando el input de tipo "file" cambie, comienza a renderizar las imagenes
img_file.addEventListener("change", (event) =>{
    const files = event.target.files
    if(files.length){
        manejarImagenes(files, event)
    }
})

//Funcion que crea una etiqueta "img" por cada imagen que seleccione el usuario,
//En cada etiqueta 
function manejarImagenes(files, event){
    for(const file of files){
        console.log(file)
        cont_imgs++
        const div_img = document.createElement("div")
        const img = document.createElement("img")
        const btn_eliminar = document.createElement("button")

        div_img.id = `div_img${cont_imgs}`
        div_img.classList.toggle("flex")
        div_img.classList.toggle("flex-col")

        
        img.file = file
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

        div_img.appendChild(btn_eliminar)
        img_preview.appendChild(div_img)
        renderizarImagenes(img, file)
    }
    preview_text.classList.replace("hidden", "block")
    preview_text.textContent = "Vista previa:"    
    
    /*
    img_loaded.forEach(i => {
        
    })
        */
}

//Se guarda en el "src" de cada etiqueta "img", la informacion codificada en base64 de cada imagen seleccionada
function renderizarImagenes(img, file){
    const reader = new FileReader()

    reader.onload = (e) => {
        img.src = e.target.result
    }
  
    reader.readAsDataURL(file)
}

function quitarImagen(aa){
        console.log(cont_imgs)
    const asd = document.getElementById(aa)
    img_preview.removeChild(document.getElementById(aa))
    if(!img_preview.hasChildNodes()){
        preview_text.innerHTML = ""
        img_preview.classList.remove("static")
        img_preview.classList.toggle("hidden")

        preview_text.classList.remove("block")
        preview_text.classList.toggle("hidden")
    }
}
 //button(type="button" class="text-[30px] font-bold bg-red-400 px-7 cursor-pointer") Quitar Imagen