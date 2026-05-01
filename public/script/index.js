document.getElementById("filtros").addEventListener("click", mostrarFiltros)

function mostrarFiltros() {
    const form = document.querySelector("#form_buscar")
    if(form.lastElementChild.id == "lista_filtros"){
        form.lastElementChild.remove()
    } else {
        crearListado(form)
    }
}

function crearListado(form) {
    let listado = document.createElement("div")
    listado.id = "lista_filtros"

    listadoClases(listado)

    for (let i = 0; i < 10; i++) {

        const div_filtro = document.createElement("div")
        const input_filtro = document.createElement("input")
        const label_filtro = document.createElement("label")

        div_filtro.classList.toggle("bg-red-500")

        input_filtro.type = "checkbox"
        input_filtro.name = `filtro${i + 1}`
        input_filtro.id = `filtro${i + 1}`
        input_filtro.value = `f${i + 1}`
        input_filtro.classList.toggle("size-5")
        input_filtro.classList.toggle("mr-3")

        label_filtro.setAttribute("for", `filtro${i + 1}`)
        label_filtro.innerText = `filtro${i + 1}`

        div_filtro.appendChild(input_filtro)
        div_filtro.appendChild(label_filtro)
        listado.appendChild(div_filtro)
    }
    form.appendChild(listado)
}

function listadoClases(listado){
    listado.classList.toggle("bg-white")
    listado.classList.toggle("mt-5")
    listado.classList.toggle("text-3xl")
    listado.classList.toggle("grid")
    listado.classList.toggle("grid-cols-5")
    listado.classList.toggle("mx-140")
    listado.classList.toggle("gap-x-2")
    listado.classList.toggle("gap-y-6")
    listado.classList.toggle("text-center")
    listado.classList.toggle("p-2")
}

    /*
        div(class="bg-red-500")
                input(type="checkbox", name="filtro1" id="filtro1" value="f1" class="size-5 mr-3")
                label(for="filtro1") filtro1 
        */