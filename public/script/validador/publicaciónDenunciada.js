const divPostDenunciado = document.querySelector(".divPostDenunciado")
const div_acciones_validador = document.querySelector(".acciones_validador")
const forms = div_acciones_validador.querySelectorAll("form")
const div_displayBotones = div_acciones_validador.querySelectorAll(".displayBotones")

for (const f of forms) {
    const div_displayBotones = f.querySelector(".displayBotones")
    const btn_darDeBaja = f.querySelector("#darDeBaja")
    const btn_desestimar = f.querySelector("#desestimar")

    const div_botones = f.querySelector(".div_botones")
    const btn_confirmar = div_botones.querySelector("#confirmar")
    const btn_cancelar = div_botones.querySelector("#cancelar")
    const div_msjConfirmación = f.querySelector(".div_msjConfirmacion")

    if (btn_darDeBaja) {
        btn_darDeBaja.addEventListener("click", (e) => {

            div_msjConfirmación.classList.remove("hidden")
            div_msjConfirmación.classList.toggle("block")

        })
    }

    if (btn_desestimar) {
        btn_desestimar.addEventListener("click", (e) => {

            div_msjConfirmación.classList.remove("hidden")
            div_msjConfirmación.classList.toggle("block")

        })
    }

    btn_confirmar.addEventListener("submit", (e) => {
        e.preventDefault()

        darDeBajaPublicación(f, divPostDenunciado)
    })
    btn_cancelar.addEventListener("click", (e) => {

        div_msjConfirmación.classList.remove("block")
        div_msjConfirmación.classList.toggle("hidden")

    })
}

/*async function darDeBajaPublicación(form, divPostDenunciado) {

    const res = await fetch(form.action, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        }
    })

    const { msj } = await res.json()

    mostrarMsj(divPostDenunciado, msj)
}

function mostrarMsj(divPostDenunciado, msj) {
    divPostDenunciado.innerHTML = ""
    divPostDenunciado.className = "flex items-center justify-center h-150 relative"

    const div = document.createElement("div")
    const p = document.createElement("p")
    p.className = "text-4xl"
    p.textContent = msj

    const div2 = document.createElement("div")
    div2.className = "flex justify-center items-center mt-5"

    const a = document.createElement("a")
    a.href = "/validador"

    const label = document.createElement("label")
    label.for = "volverAlListado"

    const button = document.createElement("button")
    button.type = "button"
    button.className = "bg-white border hover:font-bold py-2 px-4 cursor-pointer"
    button.textContent = "Volver al listado de trabajo"

    div.innerHTML = `
        <p class="text-4xl "> Se ha dado de baja la publicación exitosamente</p>
        <div class="flex justify-center items-center mt-5">
            <a href="/validador">
                <label for="volverAlListado"></label>
                <button type="button" class="bg-white border hover:font-bold py-2 px-4 cursor-pointer"> Volver al listado de trabajo </button>
            </a>
        </div>
    `

    divPostDenunciado.appendChild(div)
    div.appendChild(p)
    div.appendChild(div2)
    div2.appendChild(a)
    a.appendChild(label)
    label.appendChild(button)
}*/