// tampil data
// $(document).ready(function () {
//   fetch(
//     "https://script.google.com/macros/s/AKfycbxsue6pFrEQW_CoBIJUZ2bIfS03OGJzn-GJof5vMg91wmh_PCdsEg408uEzLPp4_yFmVw/exec"
//   ) // Ganti dengan URL endpoint doGet
//     .then((response) => response.json())
//     .then((data) => {
//       if (data.length === 0) return;

//       const tableHeader = $("#table-header");
//       const tableBody = $("#table-body");

//       // Membuat header tabel
//       const headers = Object.keys(data[0]);
//       let headerRow = "";
//       headers.forEach((header) => {
//         headerRow += `<th>${header}</th>`;
//       });
//       tableHeader.append(headerRow);

//       // Membuat isi tabel
//       data.forEach((row) => {
//         let rowData = "<tr>";
//         headers.forEach((header) => {
//           rowData += `<td>${row[header]}</td>`;
//         });
//         rowData += "</tr>";
//         tableBody.append(rowData);
//       });

//       // Inisialisasi DataTable dengan tema Bulma
//       $("#data-table").DataTable();
//     })
//     .catch((error) => console.error("Error fetching data:", error));
// });
$(document).ready(function () {
  function fetchData() {
    fetch(
      "https://script.google.com/macros/s/AKfycbxsue6pFrEQW_CoBIJUZ2bIfS03OGJzn-GJof5vMg91wmh_PCdsEg408uEzLPp4_yFmVw/exec"
    ) // Ganti dengan URL endpoint doGet
      .then((response) => response.json())
      .then((data) => {
        if (!Array.isArray(data) || data.length === 0) {
          console.error("Data format tidak valid atau kosong");
          return;
        }

        const tableHeader = $("#table-header");
        const tableBody = $("#table-body");

        tableHeader.empty();
        tableBody.empty();

        // Membuat header tabel
        const headers = Object.keys(data[0]);
        let headerRow = "<tr>";
        headers.forEach((header) => {
          headerRow += `<th>${header}</th>`;
        });
        headerRow += "</tr>";
        tableHeader.append(headerRow);

        // Membuat isi tabel
        data.forEach((row) => {
          let rowData = "<tr>";
          headers.forEach((header) => {
            rowData += `<td>${row[header] || ""}</td>`; // Pastikan nilai tidak undefined
          });
          rowData += "</tr>";
          tableBody.append(rowData);
        });

        // Inisialisasi ulang DataTable dengan opsi `columns`
        if ($.fn.DataTable.isDataTable("#data-table")) {
          $("#data-table").DataTable().destroy();
        }
        $("#data-table").DataTable({
          destroy: true, // Pastikan tabel dapat di-reset
          retrieve: true, // Hindari error jika tabel sudah ada
          columns: headers.map((header) => ({ data: header, title: header })),
        });
      })
      .catch((error) => console.error("Error fetching data:", error));
  }

  fetchData();
  setInterval(fetchData, 5000); // Refresh otomatis setiap 5 detik
});

// paging
function fadeInContent() {
  changeContent("home", document.querySelector(".sidebar a.active"));
}

function changeContent(page, element) {
  let pages = document.querySelectorAll(".page");
  pages.forEach((p) => {
    p.classList.remove("active");
    p.style.opacity = 0;
  });
  let newPage = document.getElementById(page);
  newPage.classList.add("active");
  setTimeout(() => {
    newPage.style.opacity = 1;
  }, 50);

  let menuItems = document.querySelectorAll(".sidebar a");
  menuItems.forEach((item) => item.classList.remove("active"));
  element.classList.add("active");
}
