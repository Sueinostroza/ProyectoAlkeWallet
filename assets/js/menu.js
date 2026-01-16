$(document).ready(function () {
    /* saldo */
    function obtenerSaldo() {
        return Number(localStorage.getItem("saldo")) || 0;
    }

    function renderizarSaldo() {
        const saldoEl = $("#saldoDisponible");
        if (!saldoEl.length) return;
        saldoEl.text(`$${obtenerSaldo().toLocaleString("es-CL")}`);
    }

    //mostrar saldo al cargar/
    renderizarSaldo();

    //Detectar cambio de saldo en otras pestañas
    window.addEventListener("storage", function (event) {
        if (event.key === "saldo") {
            renderizarSaldo();
        }
    });

    // ocultar y mostar saldo 
    $(document).on("click", "#ocultarSaldo", function () {
        const saldoEl = $("#saldoDisponible");
        if (!saldoEl.length) return;
        const visible = saldoEl.text() !== "••••••";
        if (visible) {
            saldoEl.text("••••••");
            $(this).html('<i class="bi bi-eye"></i>');
        } else {
            renderizarSaldo();
            $(this).html('<i class="bi bi-file-lock-fill"></i>');
        }
    });
});