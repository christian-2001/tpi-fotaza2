const cuenta_atras = document.querySelector(".cuenta_atras")

window.addEventListener("pageshow", (event) => {
    if (event.persisted) {
        window.location.reload();
    }
})

document.addEventListener("DOMContentLoaded", () => {

    let num = 3;

    cuenta_atras.textContent = num;

    const intervalo = setInterval(() => {

        if (num > 0) {
            num--;
            cuenta_atras.textContent = num;
        } else {
            clearInterval(intervalo);

            cuenta_atras.textContent = "Otro mensaje"

            window.location.href = "/registrarse/crearUsuario";
        }

    }, 1000);

});