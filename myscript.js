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
            let allData = []; // Menyimpan data asli

            function fetchData() {
                fetch("https://script.google.com/macros/s/AKfycbxsue6pFrEQW_CoBIJUZ2bIfS03OGJzn-GJof5vMg91wmh_PCdsEg408uEzLPp4_yFmVw/exec")
                    .then(response => response.json())
                    .then(data => {
                        if (!Array.isArray(data) || data.length === 0) {
                            console.error("Data tidak valid atau kosong");
                            return;
                        }

                        allData = data; // Simpan data asli

                        // Ambil daftar tahun unik dari data
                        let tahunSet = new Set(data.map(item => item.Tahun));
                        let tahunDropdown = $("#filter-tahun");
                        tahunDropdown.empty().append('<option value="">Pilih Tahun</option>');
                        tahunSet.forEach(tahun => {
                            tahunDropdown.append(`<option value="${tahun}">${tahun}</option>`);
                        });

                        // Sembunyikan tabel saat awal
                        $("#table-container").hide();
                    })
                    .catch(error => console.error("Gagal mengambil data:", error));
            }

            function updateTable(filteredData) {
                const tableHeader = $("#table-header");
                const tableBody = $("#table-body");

                tableHeader.empty();
                tableBody.empty();

                if (filteredData.length === 0) {
                    Swal.fire({
                        icon: 'warning',
                        title: 'Data Tidak Ditemukan',
                        text: 'Silakan coba filter lain!',
                        confirmButtonColor: '#007bff'
                    });
                    $("#table-container").hide(); // Sembunyikan tabel jika tidak ada data
                    return;
                }

                // Buat header tabel
                const headers = Object.keys(filteredData[0]);
                headers.forEach(header => {
                    tableHeader.append(`<th>${header}</th>`);
                });

                // Isi tabel dengan data
                filteredData.forEach(row => {
                    let rowData = "<tr>";
                    headers.forEach(header => {
                        rowData += `<td>${row[header] || "-"}</td>`;
                    });
                    rowData += "</tr>";
                    tableBody.append(rowData);
                });

                // Inisialisasi DataTable
                if ($.fn.DataTable.isDataTable("#data-table")) {
                    $("#data-table").DataTable().destroy();
                }
                $("#data-table").DataTable({
                    responsive: true,
                    autoWidth: false,
                    lengthMenu: [5, 10, 25, 50],
                    pageLength: 10
                });

                // Tampilkan tabel jika ada data
                $("#table-container").show();
            }

            $("#btn-cari").click(function () {
                let selectedTahun = $("#filter-tahun").val();
                let selectedBulan = $("#filter-bulan").val();

                let filteredData = allData.filter(item =>
                    (selectedTahun === "" || item.Tahun == selectedTahun) &&
                    (selectedBulan === "" || item.Bulan == selectedBulan)
                );

                updateTable(filteredData);
            });

            fetchData();
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
