// tampil data
$(document).ready(function () {
  fetch(
    "https://script.google.com/macros/s/AKfycbxsue6pFrEQW_CoBIJUZ2bIfS03OGJzn-GJof5vMg91wmh_PCdsEg408uEzLPp4_yFmVw/exec"
  ) // Ganti dengan URL endpoint doGet
    .then((response) => response.json())
    .then((data) => {
      if (data.length === 0) return;

      const tableHeader = $("#table-header");
      const tableBody = $("#table-body");

      // Membuat header tabel
      const headers = Object.keys(data[0]);
      let headerRow = "";
      headers.forEach((header) => {
        headerRow += `<th>${header}</th>`;
      });
      tableHeader.append(headerRow);

      // Membuat isi tabel
      data.forEach((row) => {
        let rowData = "<tr>";
        headers.forEach((header) => {
          rowData += `<td>${row[header]}</td>`;
        });
        rowData += "</tr>";
        tableBody.append(rowData);
      });

      // Inisialisasi DataTable dengan tema Bulma
      $("#data-table").DataTable();
    })
    .catch((error) => console.error("Error fetching data:", error));
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
