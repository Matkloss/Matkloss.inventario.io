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
const ubicacionInput = document.getElementById("ubicacionInput");

// Evento para detectar la selección del datalist o escritura
productoInput.addEventListener("input", e => {
  const selectedValue = e.target.value;
  // Encuentra el ítem basándose en el valor completo del datalist
  const item = items.find(i => `${i["Código"]} - ${i["Descripción"]}` === selectedValue);

  if (item) {
    showDetails(item);
  } else {
    showDetails(null); // Limpia los campos si no hay un producto válido
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
  items.forEach(item => {
    const option = document.createElement("option");
    option.value = `${item["Código"]} - ${item["Descripción"]}`;
    productosList.appendChild(option);
  });
}

// **Función showDetails() actualizada para recibir un objeto de ítem**
function showDetails(item) {
  if (!item) {
    codigoSpan.textContent = "";
    descripcionSpan.textContent = "";
    cantidadSpan.textContent = "";
    conteoFisicoInput.value = "";
    ubicacionInput.value = "";
    return;
  }
  codigoSpan.textContent = item["Código"] || "";
  descripcionSpan.textContent = item["Descripción"] || "";
  cantidadSpan.textContent = item["Cantidad"] || "";
  conteoFisicoInput.value = item["conteoFisico"] || "";
  ubicacionInput.value = item["Ubicación"] || ""; // ¡Línea clave! Rellena el input de Ubicación.
}

function saveCount() {
  const selectedValue = productoInput.value;
  // Se busca el item en base al valor exacto del datalist
  const item = items.find(i => `${i["Código"]} - ${i["Descripción"]}` === selectedValue);

  if (!item) {
    alert("Por favor, selecciona un producto de la lista.");
    return;
  }

  const conteoFisicoValue = conteoFisicoInput.value;
  const ubicacionValue = ubicacionInput.value;

  if (!conteoFisicoValue || !ubicacionValue) {
    alert("Por favor, completa los campos de Conteo Físico y Ubicación.");
    return;
  }

  const today = new Date();
  const yyyy = today.getFullYear();
  const mm = String(today.getMonth() + 1).padStart(2, '0');
  const dd = String(today.getDate()).padStart(2, '0');
  const fechaActual = `${yyyy}-${mm}-${dd}`;
  
  const countedItem = {
    "Código": item["Código"],
    "Ubicación": ubicacionValue,
    "Conteo Físico": conteoFisicoValue,
    "Cantidad Original": item["Cantidad"],
    "Diferencia": parseInt(conteoFisicoValue) - parseInt(item["Cantidad"]),
    "Descripción": item["Descripción"],
    "conteoFisico": conteoFisicoValue,
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
  showDetails(null);

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
