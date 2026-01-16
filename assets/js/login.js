$(document).ready(function () {
    const form = document.getElementById("formLogin");
    function login(event) {
        event.preventDefault();
        const usuario = document.getElementById("correoLogin").value;
        const password = document.getElementById("passwordLogin").value;
        const mensaje = document.getElementById("mensajeLogin");
        if (usuario === "admin@gmail.com" && password === "1234") {
            mensaje.innerHTML = `<div class="alert alert-success d-flex align-items-center" role="alert">
<i class="bi bi-check-circle-fill me-2"></i>
<div>Acceso correcto</div>
</div>`;
            setTimeout(() => {
                window.location.href = "menu.html";
            }, 1200);
        } else {
            mensaje.innerHTML = `<div class="alert alert-danger d-flex align-items-center" role="alert">
<i class="bi bi-x-circle-fill me-2"></i>
<div>Usuario o contraseña incorrecta</div>
</div>`;
        }
    }
    form.addEventListener("submit", login);
});






