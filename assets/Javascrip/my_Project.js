let projectData = [];

function myProject(event) {
  event.preventDefault();

  //   ambil data checkbox
  let selectValue = document.getElementsByName("technology");
  // masukan ke variabel kosong
  let dataSelect = [];
  //   ubah menjadi array karena masih nodelist
  Array.from(selectValue).forEach(function (checkbox) {
    if (checkbox.checked) {
      dataSelect.push(checkbox.value);
    }
  });

  // ambil data gambar
  const dataImage = document.getElementById("image");
  const file = dataImage.files[0];

  if (file) {
    console.log("Nama file:", file.name);
    console.log("Tipe file:", file.type);
    console.log("Ukuran file (bytes):", file.size);
  } else {
    console.log("Belum ada gambar yang dipilih.");
  }

  let datasProject = {
    nameProject: document.getElementById("project_name").value.trim(),
    startDateProject: document.getElementById("start").value.trim(),
    endDateProject: document.getElementById("end").value.trim(),
    descriptionProject: document.getElementById("description").value.trim(),
    selectedProject: dataSelect,
    imageProject: file ? file.name : null,
  };

  projectData.push(datasProject);
  console.log(projectData);
}
