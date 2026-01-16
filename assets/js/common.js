$(document).ready(function () {

    //cerrar sesión

    $(document).on("click", "#cerrarSesion", function () {
        const wrapper = $("#cerrarSesionWrapper");
        if (wrapper.data("confirmando")) return;

        wrapper.data("confirmando", true);
        wrapper.data("original", wrapper.html());

        const confirmacion = $(`
            <div class="confirmacion-salida text-center">
                <p class="mb-2">¿Cerrar sesión?</p>
                <button class="btn btn-success btn-sm confirmar-salida">Confirmar</button>
                <button class="btn btn-danger btn-sm ms-2 cancelar-salida">Cancelar</button>
            </div>
        `).hide();

        wrapper.html(confirmacion);
        confirmacion.fadeIn(300);
    });

    $(document).on("click", ".confirmar-salida", function () {
        window.location.href = "login.html";
    });

    $(document).on("click", ".cancelar-salida", function () {
        const wrapper = $("#cerrarSesionWrapper");
        wrapper.fadeOut(150, function () {
            wrapper.html(wrapper.data("original"));
            wrapper.data("confirmando", false);
            wrapper.fadeIn(150);
        });
    });
});