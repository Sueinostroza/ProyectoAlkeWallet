$(document).ready(function () {
    const tbody = document.getElementById("tablaMovimientos");
    let movimientos = JSON.parse(localStorage.getItem("movimientos")) || [];
    //Limpiar contenido de html
    tbody.innerHTML = "";
    if (movimientos.length === 0) {
        const tr = document.createElement("tr");
        tr.innerHTML = `<td colspan="4" class="text-center">No hay transacciones registradas</td>`;
        tbody.appendChild(tr);
        $(tr).hide().fadeIn(300);
    } else {
        movimientos.slice().reverse().forEach(mov => {
            const tr = document.createElement("tr");
            let signo = mov.tipo === "Egreso" ? "-" : "+";
            let claseMonto = mov.tipo === "Egreso" ? "text-danger" : "text-success";
            let montoFormateado = `$${mov.monto.toLocaleString("es-CL")}`;
            tr.innerHTML = `
        <td>${mov.tipo}</td>
        <td class=${claseMonto}>${signo}${montoFormateado}</td>
        <td>${mov.descripcion}</td>
        <td>${mov.fecha}</td>`;
            tbody.appendChild(tr);
        });

    }
});
