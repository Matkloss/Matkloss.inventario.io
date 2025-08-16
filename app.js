let items = [];
let countedItems = [];
const requiredHeaders = ["Código", "Descripción", "Cantidad", "conteoFisico", "fechaConteo"];

document.getElementById("fileInput").addEventListener("change", handleFile);
document.getElementById("saveBtn").addEventListener("click", saveCount);
document.getElementById("exportBtn").addEventListener("click", exportToCSV);
document.getElementById("downloadTemplateBtn").addEventListener("click", downloadTemplateCSV);

const productoInput = document.getElementById("productoInput");
const productosList = document.getElementById("productosList");
const codigoSpan = document.getElementById("codigo");
const descripcionSpan = document.getElementById("descripcion");
const cantidadSpan = document.getElementById("cantidad");
const conteoFisicoInput = document.getElementById("conteoFisico");
const fechaConteoInput = document.getElementById("fechaConteo");
const statusDiv = document.getElementById("status");

// Evento para detectar la selección del datalist
productoInput.addEventListener("input", e => {
  const selectedOption = document.querySelector(`option[value='${e.target.value}']`);
  if (selectedOption) {
    showDetails(selectedOption.getAttribute('data-index'));
  }
});

function handleFile(event) {
  const file = event.target.files[0];
  const reader = new FileReader();
  reader.onload = e => parseCSV(e.target.result);
  reader.readAsText(file);
}

function parseCSV(data) {
  const lines = data.split("\n").map(l => l.trim()).filter(l => l.length > 0);
  const headers = lines[0].split(';').map(h => h.trim().replace(/^"|"$/g, '').trim());

  items = lines.slice(1).map(line => {
    // Expresión regular para dividir la línea, ignorando los ';' dentro de comillas
    const values = line.match(/(?:"[^"]*"|[^;])+/g);
    let obj = {};

    if (values) {
      headers.forEach((h, i) => {
        let value = values[i] || "";
        // Eliminar comillas dobles al inicio y final del valor
        obj[h] = value.replace(/^"|"$/g, '').trim();
      });
    }
    return obj;
  });

  loadDatalist();
  statusDiv.textContent = `✅ ${items.length} productos importados.`;
}

function loadDatalist() {
  productosList.innerHTML = "";
  items.forEach((item, index) => {
    const option = document.createElement("option");
    option.value = item["Código"] || "";
    option.setAttribute('data-index', index);
    productosList.appendChild(option);
  });
}

function showDetails(index) {
  if (index === "") {
    codigoSpan.textContent = "";
    descripcionSpan.textContent = "";
    cantidadSpan.textContent = "";
    conteoFisicoInput.value = "";
    fechaConteoInput.value = "";
    return;
  }
  const item = items[index];
  codigoSpan.textContent = item["Código"] || "";
  descripcionSpan.textContent = item["Descripción"] || "";
  // Se obtiene el valor de la columna Cantidad sin importar su posición
  cantidadSpan.textContent = item["Cantidad"] || ""; 
  conteoFisicoInput.value = item["conteoFisico"] || "";
  fechaConteoInput.value = item["fechaConteo"] || "";
}

function saveCount() {
  const selectedCode = productoInput.value;
  if (!selectedCode) {
    alert("Por favor, selecciona un producto primero.");
    return;
  }
  
  const item = items.find(i => i["Código"] === selectedCode);
  if (!item) {
    alert("Producto no válido. Por favor, selecciona uno de la lista.");
    return;
  }
  
  const countedItem = {
    "Código": item["Código"],
    "Descripción": item["Descripción"],
    "Cantidad": item["Cantidad"],
    "conteoFisico": conteoFisicoInput.value,
    "fechaConteo": fechaConteoInput.value,
  };
  
  const existingIndex = countedItems.findIndex(i => i["Código"] === countedItem["Código"]);
  if (existingIndex !== -1) {
    countedItems[existingIndex] = countedItem;
  } else {
    countedItems.push(countedItem);
  }

  alert(`✅ Conteo guardado para el producto: ${item["Descripción"]}`);
  
  productoInput.value = "";
  showDetails("");

  renderCountedItems();
}

function renderCountedItems() {
    const tableBody = document.querySelector("#countedItemsTable tbody");
    tableBody.innerHTML = ""; 

    countedItems.forEach(item => {
        const row = document.createElement("tr");
        const cantidadOriginal = parseInt(item["Cantidad"]) || 0;
        const conteoFisico = parseInt(item["conteoFisico"]) || 0;
        const diferencia = conteoFisico - cantidadOriginal;

        row.innerHTML = `
            <td>${item["Código"]}</td>
            <td>${conteoFisico}</td>
            <td>${cantidadOriginal}</td>
            <td style="color: ${diferencia !== 0 ? 'red' : 'green'};">${diferencia}</td>
        `;
        tableBody.appendChild(row);
    });
}

function exportToCSV() {
  if (countedItems.length === 0) {
    alert("No hay conteos para exportar.");
    return;
  }

  const csvRows = [];
  csvRows.push(requiredHeaders.join(";"));
  countedItems.forEach(item => {
    csvRows.push(requiredHeaders.map(h => {
        const value = item[h] || "";
        return value.toString().includes(';') ? `"${value}"` : value;
    }).join(";"));
  });
  const csvContent = csvRows.join("\n");

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.setAttribute("href", url);
  a.setAttribute("download", "conteo_del_dia.csv");
  a.click();
}

function downloadTemplateCSV() {
    const headers = ["Código", "Descripción", "Cantidad"];
    const csvContent = headers.join(";") + "\n";
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.setAttribute("href", url);
    a.setAttribute("download", "plantilla_inventario.csv");
    a.click();
}