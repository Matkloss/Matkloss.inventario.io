let items = [];
let countedItems = [];
const requiredHeaders = ["Código", "Descripción", "Cantidad", "conteoFisico", "fechaConteo", "Ubicación"];

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
const statusDiv = document.getElementById("status");
const ubicacionInput = document.getElementById("ubicacionInput"); // Asegúrate de que este elemento exista en tu HTML

// Evento para detectar la selección del datalist
productoInput.addEventListener("input", e => {
  const selectedValue = e.target.value;
  const itemIndex = items.findIndex(item => `${item["Código"]} - ${item["Descripción"]}` === selectedValue);
  
  if (itemIndex !== -1) {
    showDetails(itemIndex);
  } else {
    showDetails("");
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
    const values = line.match(/(?:"[^"]*"|[^;])+/g);
    let obj = {};

    if (values) {
      headers.forEach((h, i) => {
        let value = values[i] || "";
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
    option.value = `${item["Código"]} - ${item["Descripción"]}`;
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
    if (ubicacionInput) ubicacionInput.value = "";
    return;
  }
  const item = items[index];
  codigoSpan.textContent = item["Código"] || "";
  descripcionSpan.textContent = item["Descripción"] || "";
  cantidadSpan.textContent = item["Cantidad"] || "";
  conteoFisicoInput.value = item["conteoFisico"] || "";
  if (ubicacionInput) ubicacionInput.value = item["Ubicación"] || "";
}

function saveCount() {
  const selectedValue = productoInput.value;
  if (!selectedValue) {
    alert("Por favor, selecciona un producto primero.");
    return;
  }
  
  const item = items.find(i => `${i["Código"]} - ${i["Descripción"]}` === selectedValue);
  if (!item) {
    alert("Producto no válido. Por favor, selecciona uno de la lista.");
    return;
  }

  // Se asegura de que la fecha se genere siempre de forma automática
  const today = new Date();
  const yyyy = today.getFullYear();
  const mm = String(today.getMonth() + 1).padStart(2, '0');
  const dd = String(today.getDate()).padStart(2, '0');
  const fechaActual = `${yyyy}-${mm}-${dd}`;
  
  const countedItem = {
    "Código": item["Código"],
    "Ubicación": ubicacionInput ? ubicacionInput.value : "", // Maneja el campo de Ubicación
    "Conteo Físico": conteoFisicoInput.value,
    "Cantidad Original": item["Cantidad"],
    "Diferencia": parseInt(conteoFisicoInput.value) - parseInt(item["Cantidad"]),
    "Descripción": item["Descripción"],
    "conteoFisico": conteoFisicoInput.value,
    "fechaConteo": fechaActual,
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
        const diferencia = parseInt(item["Diferencia"]) || 0;

        row.innerHTML = `
            <td>${item["Código"]}</td>
            <td>${item["Ubicación"]}</td>
            <td>${item["Conteo Físico"]}</td>
            <td>${item["Cantidad Original"]}</td>
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

  const exportHeaders = ["Código", "Descripción", "Ubicación", "conteoFisico", "fechaConteo"];
  const csvRows = [];
  csvRows.push(exportHeaders.join(";"));
  countedItems.forEach(item => {
    csvRows.push(exportHeaders.map(h => {
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
    const headers = ["Código", "Descripción", "Cantidad", "Ubicación"];
    const csvContent = headers.join(";") + "\n";
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.setAttribute("href", url);
    a.setAttribute("download", "plantilla_inventario.csv");
    a.click();
}