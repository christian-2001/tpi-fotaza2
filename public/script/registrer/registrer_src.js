//El select que contiene opciones para elegir el genero/sexo
const genero_select = document.getElementById("genero")

//El select que contiene los distintos tipos de DNI
const tipoDNI_select = document.getElementById("tipodni")

//Cuando elijo el genero(o la opcion "Prefiero no responder") el color del texto cambia a negro
genero_select.addEventListener("change", cambiar_color_select1)

//Cuando elijo un tipo de DNI el color del texto cambia a negro
tipoDNI_select.addEventListener("change", cambiar_color_select2)

document.getElementById("form_registrer").addEventListener("submit", () => e.preventDefault())

function cambiar_color_select1() {
    //Cambia el color del select al elegir una de varias opciones    
    genero_select.classList.replace("text-gray-500", "text-black")
}

function cambiar_color_select2() {
    //Cambia el color del select al elegir una de varias opciones
    tipoDNI_select.classList.replace("text-gray-500", "text-black")
}