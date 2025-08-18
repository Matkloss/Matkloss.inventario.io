# 📦 Inventario Móvil

Una herramienta web ligera y responsive diseñada para realizar conteos de inventario de manera eficiente. Permite a los usuarios importar una plantilla CSV, realizar conteos físicos de productos, y luego exportar los datos actualizados con las diferencias y ubicaciones.

## 🚀 Características

* **Importar Inventario**: Carga una lista de productos a través de un archivo CSV para comenzar el conteo.
* **Búsqueda Rápida**: Un campo de búsqueda con `datalist` facilita la selección de productos por código o descripción.
* **Conteo Físico**: Campo dedicado para ingresar el conteo actual del producto.
* **Registro de Datos**: Guarda el conteo de cada producto con su fecha.
* **Visualización en Tiempo Real**: Muestra los artículos que ya han sido contados en una tabla.
* **Exportar a CSV**: Genera un archivo CSV con los datos del conteo del día.
* **Plantilla de Inventario**: Descarga una plantilla básica para asegurar el formato correcto del CSV de entrada.
* **Diseño Institucional**: Se adapta a los colores y logo de la marca Medlog.

## 🛠️ Tecnologías Utilizadas

* **HTML5**: Estructura de la aplicación.
* **CSS3**: Estilos, incluyendo un diseño `responsive` para dispositivos móviles y una paleta de colores basada en la marca Medlog.
* **JavaScript (ES6+)**: Lógica principal para la importación, manipulación y exportación de datos.
* **Font Awesome**: Iconos para mejorar la interfaz de usuario.

## 📄 Formato del Archivo CSV

La aplicación funciona mejor con un archivo CSV que tenga los siguientes encabezados (respetando la ortografía, mayúsculas y acentos):

`Código;Descripción;Cantidad;Ubicación`

El resto de las columnas serán generadas automáticamente por la aplicación al guardar el conteo.

## 🖥️ Cómo usarlo

1.  **Clonar el repositorio** o descargar los archivos `index.html`, `style.css`, y `app.js` en una carpeta.
2.  Asegúrate de tener tu archivo CSV de inventario listo, o **descarga la plantilla** directamente desde la aplicación.
3.  Abre el archivo `index.html` en tu navegador web.
4.  **Haz clic en "Importar Inventario"** y selecciona tu archivo CSV.
5.  **Busca el producto** que deseas contar y llena los campos de "Conteo Físico" y "Ubicación".
6.  **Haz clic en "Guardar Conteo"** para registrar los datos. Los artículos contados aparecerán en la tabla de la derecha.
7.  Una vez finalizado, **haz clic en "Exportar Conteo del Día"** para descargar tu informe actualizado.
