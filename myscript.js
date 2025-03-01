function loadContent(page, element) {
  fetch(page)
    .then((response) => {
      if (!response.ok) throw new Error("Halaman tidak ditemukan");
      return response.text();
    })
    .then((html) => {
      document.getElementById("content").innerHTML = html;

      // Mengatur ulang kelas 'active' pada menu sidebar
      let menuItems = document.querySelectorAll(".sidebar a, .navbar-nav a");
      menuItems.forEach((item) => item.classList.remove("active"));
      if (element) element.classList.add("active");
    })
    .catch((error) => console.error("Error loading page:", error));
}
$(document).ready(function () {
  $(".select2").select2({
    theme: "bootstrap4",
    width: "100%",
    allowClear: true,
  });
});
// tampildata
$(document).ready(function () {
  let allData = []; // Menyimpan data asli

  function fetchData() {
    fetch(
      "https://script.google.com/macros/s/AKfycbxsue6pFrEQW_CoBIJUZ2bIfS03OGJzn-GJof5vMg91wmh_PCdsEg408uEzLPp4_yFmVw/exec"
    )
      .then((response) => response.json())
      .then((data) => {
        if (!Array.isArray(data) || data.length === 0) {
          console.error("Data tidak valid atau kosong");
          return;
        }

        allData = data; // Simpan data asli

        // Ambil daftar tahun unik dari data
        // let tahunSet = new Set(data.map((item) => item.Tahun));
        // let tahunDropdown = $("#filter-tahun");
        // tahunDropdown.empty().append('<option value="">Pilih Tahun</option>');
        // tahunSet.forEach((tahun) => {
        //   tahunDropdown.append(`<option value="${tahun}">${tahun}</option>`);
        // });

        // Sembunyikan tabel saat awal
        $("#table-container").hide();
      })
      .catch((error) => console.error("Gagal mengambil data:", error));
  }

  function updateTable(filteredData) {
    const tableHeader = $("#table-header");
    const tableBody = $("#table-body");

    tableHeader.empty();
    tableBody.empty();

    if (filteredData.length === 0) {
      Swal.fire({
        icon: "warning",
        title: "Data Tidak Ditemukan",
        text: "Silakan coba filter lain!",
        confirmButtonColor: "#007bff",
      });
      $("#table-container").hide(); // Sembunyikan tabel jika tidak ada data
      return;
    }

    // Buat header tabel
    const headers = Object.keys(filteredData[0]);
    headers.forEach((header) => {
      tableHeader.append(`<th>${header}</th>`);
    });

    // Isi tabel dengan data
    filteredData.forEach((row) => {
      let rowData = "<tr>";
      headers.forEach((header) => {
        let cellData = row[header] || "-"; // Jika kosong, tampilkan "-"

        // Pastikan File_ekin yang berisi link diubah menjadi tombol
        if (header === "File_ekin" && cellData.startsWith("https://")) {
          cellData = `<a href="${cellData}" target="_blank" class="btn btn-sm btn-primary">Lihat File</a>`;
        }
        rowData += `<td>${cellData}</td>`;
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
      pageLength: 10,
    });

    // Tampilkan tabel jika ada data
    $("#table-container").show();
  }

  $("#btn-cari").click(function () {
    let selectedTahun = $("#filter-tahun").val();
    let selectedBulan = $("#filter-bulan").val();

    let filteredData = allData.filter(
      (item) =>
        (selectedTahun === "" || item.Tahun == selectedTahun) &&
        (selectedBulan === "" || item.Bulan == selectedBulan)
    );

    updateTable(filteredData);
  });

  // Panggil fetchData pertama kali
  fetchData();

  // // Auto-refresh setiap 30 detik
  // setInterval(fetchData, 3000);
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
// ambilnama
$(document).ready(function () {
  $(".select2").select2({
    theme: "bootstrap4",
    width: "100%",
    allowClear: true,
  });

  const namaSelect = $("#nama");
  const nipInput = $("#nip");
  const tahunSelect = $("#tahun");

  // Mengisi dropdown tahun
  const currentYear = new Date().getFullYear();
  for (let year = 2024; year <= currentYear; year++) {
    tahunSelect.append(new Option(year, year));
  }
  tahunSelect.val(currentYear).trigger("change");

  // Ambil data dari API
  fetch(
    "https://script.google.com/macros/s/AKfycbwUCcZNS9AaFEhzLNvF7Hb1dcoPXPguYMaUnQmvzjhnUWvgSP5CiFh67BswzdULqmZt/exec"
  )
    .then((response) => response.json())
    .then((data) => {
      console.log("Data dari API:", data);
      if (Array.isArray(data) && data.length > 0) {
        namaSelect.empty().append('<option value="">-- Pilih Nama --</option>');
        data.forEach((item) => {
          let nama = item.NAMA || item.nama;
          let nip = item.NIP || item.nip;
          if (nama && nip) {
            let option = new Option(nama, nama, false, false); // Nama sebagai value
            option.dataset.nip = nip; // Simpan NIP dalam dataset
            namaSelect.append(option);
          }
        });
        namaSelect.trigger("change");
      } else {
        console.error("Format data tidak sesuai atau kosong:", data);
      }
    })
    .catch((error) => console.error("Gagal mengambil data:", error));

  // Event listener untuk mengisi NIP otomatis ketika Nama dipilih
  namaSelect.on("change", function () {
    let selectedOption = $(this).find(":selected");
    nipInput.val(selectedOption.data("nip") || ""); // Ambil NIP dari dataset
    console.log("NIP yang dipilih:", nipInput.val());
  });
});
// input data
document
  .getElementById("dataForm")
  .addEventListener("submit", function (event) {
    event.preventDefault(); // Mencegah reload halaman

    let submitBtn = document.getElementById("submitBtn");
    let submitText = document.getElementById("submitText");
    let loadingSpinner = document.getElementById("loadingSpinner");

    // Ubah tombol menjadi "Loading..."
    submitText.innerText = "Loading...";
    loadingSpinner.classList.remove("d-none");
    submitBtn.disabled = true;

    let nama = document.getElementById("nama").value;
    let nip = document.getElementById("nip").value;
    let bulan = document.getElementById("bulan").value;
    let tahun = document.getElementById("tahun").value;
    let fileInput = document.getElementById("file_ekin").files[0];

    if (!fileInput) {
      Swal.fire("Gagal!", "Harap unggah file PDF!", "error");
      resetButton();
      return;
    }

    let reader = new FileReader();
    reader.onloadend = function () {
      let base64File = reader.result.split(",")[1]; // Ambil Base64 data saja

      let formData = new FormData();
      formData.append("nama", nama);
      formData.append("nip", nip);
      formData.append("bulan", bulan);
      formData.append("tahun", tahun);
      formData.append("file", base64File); // Kirim file dalam body
      formData.append("fileName", fileInput.name);

      fetch(
        "https://script.google.com/macros/s/AKfycbxsue6pFrEQW_CoBIJUZ2bIfS03OGJzn-GJof5vMg91wmh_PCdsEg408uEzLPp4_yFmVw/exec",
        {
          method: "POST",
          body: formData,
        }
      )
        .then((response) => response.json())
        .then((data) => {
          if (data.status === "success") {
            Swal.fire(
              "Berhasil!",
              "File berhasil diunggah dan disimpan!",
              "success"
            );
            document.getElementById("dataForm").reset(); // Reset form setelah sukses
          } else {
            Swal.fire("Gagal!", data.message, "error");
          }
          resetButton();
        })
        .catch((error) => {
          console.error("Error:", error);
          Swal.fire("Gagal!", "Terjadi kesalahan, coba lagi!", "error");
          resetButton();
        });
    };

    reader.readAsDataURL(fileInput);
  });

// Fungsi untuk mereset tombol setelah request selesai
function resetButton() {
  let submitBtn = document.getElementById("submitBtn");
  let submitText = document.getElementById("submitText");
  let loadingSpinner = document.getElementById("loadingSpinner");

  submitText.innerText = "Kirim";
  loadingSpinner.classList.add("d-none");
  submitBtn.disabled = false;
}
function refreshPage() {
  location.reload();
}
