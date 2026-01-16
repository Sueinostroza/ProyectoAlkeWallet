$(document).ready(function () {
    let contactos = [];
    // Cargar contactos iniciales si no existen
    if (!localStorage.getItem("contactos")) {
        const contactosIniciales = [
            { nombre: "Javier Fernandez", cuenta: "22222222", banco: "Banco Chile" },
            { nombre: "Sofia Alaman", cuenta: "55555555", banco: "Banco Estado" },
            { nombre: "Pedro Ferrer", cuenta: "88888888", banco: "Banco Itau" },
            { nombre: "Roberto Gutierrez", cuenta: "56345234", banco: "Banco Chile" },
            { nombre: "Camila López", cuenta: "78342167", banco: "Banco Estado" },
            { nombre: "Jonah Gutz", cuenta: "98056785", banco: "Banco Itau" }
        ];
        localStorage.setItem("contactos", JSON.stringify(contactosIniciales));
    }

    contactos = JSON.parse(localStorage.getItem("contactos")) || [];
    renderizarTablaContactos();

    // Guardar nuevo contacto
    $("#guardarContacto").on("click", function () {
        const nombre = $("#nombreContacto").val().trim();
        const cuenta = $("#cuentaContacto").val().trim();
        const banco = $("#bancoContacto").val().trim();
        if (!nombre || !cuenta || !banco) {
            alert("Completa todos los campos");
            return;
        }
        contactos.push({ nombre, cuenta, banco });
        localStorage.setItem("contactos", JSON.stringify(contactos));
        renderizarTablaContactos();
        $("#nombreContacto, #cuentaContacto, #bancoContacto").val("");
    });

    // Eliminar contacto 
    $(document).on("click", ".eliminar-contacto", function () {
        const boton = $(this);
        const index = boton.data("index");
        const fila = boton.closest("tr");

        // Evitar duplicar confirmación
        if (boton.data("confirmando")) return;
        boton.data("confirmando", true);

        // Guardar contenido original
        const originalHtml = boton.html();
        boton.data("original", originalHtml);
        // Cambiar a modo confirmación
        boton
            .removeClass("btn-outline-danger")
            .addClass("btn-danger")
            .html(`
            ¿Eliminar?
            <button class="btn btn-light btn-sm ms-2 confirmar-eliminar">✔</button>
            <button class="btn btn-light btn-sm cancelar-eliminar">✖</button>
        `);
    });

    // Confirmar eliminación
    $(document).on("click", ".confirmar-eliminar", function (e) {
        e.stopPropagation();

        const boton = $(this).closest(".eliminar-contacto");
        const index = boton.data("index");
        const fila = boton.closest("tr");

        fila.fadeOut(300, function () {
            contactos.splice(index, 1);
            localStorage.setItem("contactos", JSON.stringify(contactos));
            renderizarTablaContactos();
        });
    });

    // Cancelar eliminación
    $(document).on("click", ".cancelar-eliminar", function (e) {
        e.stopPropagation();

        const boton = $(this).closest(".eliminar-contacto");

        boton
            .removeClass("btn-danger")
            .addClass("btn-outline-danger")
            .html(boton.data("original"))
            .removeData("confirmando");
    });
    // autocompletado
    $("#inputContacto").on("input", function () {
        const texto = $(this).val().toLowerCase();
        $("#autocompletar").empty().show();
        $("#cuentaDestino").val("");
        if (texto === "") {
            $("#autocompletar").hide();
            return;
        }
        contactos
            .filter(c => c.nombre.toLowerCase().includes(texto))
            .forEach(c => {
                const item = $("<li>")
                    .addClass("list-group-item list-group-item-action")
                    .html(`<strong>${c.nombre}</strong><br>
                        <small>Cuenta: ${c.cuenta}</small><br>
                        <small>Banco: ${c.banco}</small>`);
                item.on("click", function () {
                    $("#inputContacto").val(c.nombre);
                    $("#cuentaDestino").val(c.cuenta);
                    $("#autocompletar").fadeOut(100).empty();
                });
                $("#autocompletar").append(item);
            });
    });

    // renderizar tabla
    function renderizarTablaContactos() {
        const tbody = $("#tablaContactos");
        tbody.empty();
        contactos.forEach((c, index) => {
            tbody.append(`
                <tr class="fila-contacto"
                data-nombre="${c.nombre}"
                data-cuenta="${c.cuenta}">
                    <td>${c.nombre}</td>
                    <td>${c.cuenta}</td>
                    <td>${c.banco}</td>
                    <td class="text-center">
                        <button type="button" class="btn btn-danger btn-sm eliminar-contacto" data-index="${index}">
                            <i class="fa-solid fa-user-xmark"></i>
                        </button>
                    </td>
                </tr>
            `);
        });
    }
$(document).on("click", ".fila-contacto", function (e) {
    // Evita que al hacer click en eliminar también seleccione
    if ($(e.target).closest(".eliminar-contacto").length) return;

    const nombre = $(this).data("nombre");
    const cuenta = $(this).data("cuenta");

    $("#inputContacto").val(nombre);
    $("#cuentaDestino").val(cuenta);

    // feedback visual
    $(".fila-contacto").removeClass("table-primary");
    $(this).addClass("table-primary");
});
    // transferencias
    const form = $("#formTransferencia");
    const mensaje = $("#mensajeTransferencias");
    let datosPendientes = null;

    function mostrarToastError(texto) {
        $("#toastErrorTexto").text(texto);
        new bootstrap.Toast(
            document.getElementById("toastError")
        ).show();
    }
    function mostrarToastExito(texto) {
        $("#toastExitoTexto").html(texto);
        new bootstrap.Toast(
            document.getElementById("toastExito"),
            { delay: 3000 }
        ).show();
    }
    form.on("submit", function (event) {
        event.preventDefault();

        const destinatario = $("#inputContacto").val();
        const cuentaDestino = $("#cuentaDestino").val();
        const monto = Number($("#montoDeposito").val());

        if (!cuentaDestino) {
            mostrarToastError("Debes seleccionar un contacto de la lista");
            return;
        }
        
        let saldoActual = Number(localStorage.getItem("saldo")) || 0;

        if (monto <= 0) {
            mostrarToastError("Ingrese un monto válido");
            return;
        }

        if (monto > saldoActual) {
            mostrarToastError("Saldo insuficiente");
            return;
        }
        datosPendientes = { destinatario, monto, saldoActual };

        $("#toastTexto").html(
            `¿Confirmas transferir <strong>$${monto.toLocaleString("es-CL")}</strong> a <strong>${destinatario}</strong>?`
        );
        
        new bootstrap.Toast(
            document.getElementById("toastConfirmar")
        ).show();
    });

    $(document).on("click", "#toastConfirmarBtn", function () {
        if (!datosPendientes) return;

        let { destinatario, monto, saldoActual } = datosPendientes;

        saldoActual -= monto;
        localStorage.setItem("saldo", saldoActual);


        let movimientos = JSON.parse(localStorage.getItem("movimientos")) || [];
        movimientos.push({
            tipo: "Egreso",
            monto,
            descripcion: `Transferencia a ${destinatario}`,
            fecha: new Date().toLocaleDateString()
        });
        localStorage.setItem("movimientos", JSON.stringify(movimientos));

        mostrarToastExito(`
    <i class="bi bi-check-circle-fill me-1"></i>
    Transferencia realizada con éxito<br>
    Saldo disponible:
    <strong>$${saldoActual.toLocaleString("es-CL")}</strong>
`);

        datosPendientes = null;
        $("#formTransferencia")[0].reset();
        $("#cuentaDestino").val("");

        const toastEl = document.getElementById("toastConfirmar");
        bootstrap.Toast.getInstance(toastEl).hide();
    });
});