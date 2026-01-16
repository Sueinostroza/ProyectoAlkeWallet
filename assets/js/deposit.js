$(document).ready(function () {
    let montoTemporal = 0;
    const modal = new bootstrap.Modal(document.getElementById("modalDeposito"));
    const formDeposito = $("#formDeposito");
    const btnDepositar = formDeposito.find("button[type='submit']");

    // notificacion toast
    function mostrarToast(mensaje, tipo = "exito") {
        const bgColor = tipo === "exito" ? "#28a745" : "#dc3545";
        const icono = tipo === "exito" ? "✔️" : "❌";

        // Eliminar toast anterior
        $("#toastDeposito").remove();

        //Crear toast 
        const toast = $(`
            <div id="toastDeposito" style="
                position: relative;
                margin-top: 10px;
                padding: 12px 18px;
                border-radius: 12px;
                background: ${bgColor};
                color: white;
                font-weight: 500;
                font-size: 0.95rem;
                display: flex;
                align-items: center;
                gap: 10px;
                box-shadow: 0 6px 20px rgba(0,0,0,0.25);
                opacity: 0;
                transform: translateY(30px);
                transition: all 0.4s ease;
            ">
                <span style="font-size:1.1rem;">${icono}</span>
                <span>${mensaje}</span>
            </div>
        `);

        // Insertar después del botón
        btnDepositar.after(toast);

        // Animación de entrada
        setTimeout(() => {
            toast.css({ opacity: 1, transform: "translateY(0)" });
        }, 10);

        // Animación de salida después de 3 segundos
        setTimeout(() => {
            toast.css({ opacity: 0, transform: "translateY(30px)" });
            setTimeout(() => toast.remove(), 400);
        }, 3000);
    }

    // envío del form depósito
    formDeposito.on("submit", function (e) {
        e.preventDefault();

        let monto = Number($("#montoDeposito").val());

        if (monto <= 0 || isNaN(monto)) {
            mostrarToast("Ingrese un monto válido", "error");
            return;
        }

        montoTemporal = monto;

        $("#textoConfirmacion").text(
            `¿Desea confirmar el depósito de $${monto.toLocaleString("es-CL")}?`
        );

        modal.show();
    });

    // Confirmar depósito
    $("#confirmarDeposito").on("click", function () {
        let saldoActual = Number(localStorage.getItem("saldo")) || 0;
        const saldoFinal = saldoActual + montoTemporal;

        // Guardar saldo y movimientos
        localStorage.setItem("saldo", saldoFinal);
        let movimientos = JSON.parse(localStorage.getItem("movimientos")) || [];
        movimientos.push({
            tipo: "Ingreso",
            monto: montoTemporal,
            descripcion: "Depósito",
            fecha: new Date().toLocaleDateString()
        });
        localStorage.setItem("movimientos", JSON.stringify(movimientos));

        // Actualizar saldo en pantalla
        if (typeof renderizarSaldo === "function") renderizarSaldo();

        // notificaciones toast
        mostrarToast(
            `Depósito de $${montoTemporal.toLocaleString("es-CL")} realizado. Saldo total: $${saldoFinal.toLocaleString("es-CL")}`,
            "exito"
        );

        // Limpiar input y cerrar modal
        $("#montoDeposito").val("");
        montoTemporal = 0;
        modal.hide();
    });
}); 