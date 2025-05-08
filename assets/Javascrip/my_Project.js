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
  let imgDefault = "assets/images/brandred.png";

  if (file) {
    console.log("Nama file:", file.name);

    const reader = new FileReader();

    // Menunggu sampai file terbaca
    reader.onload = function (event) {
      const imageUrl = event.target.result; // Hasil pembacaan file

      imgDefault = imageUrl;

      let datasProject = {
        nameProject: document.getElementById("project_name").value.trim(),
        startDateProject: document.getElementById("start").value.trim(),
        endDateProject: document.getElementById("end").value.trim(),
        descriptionProject: document.getElementById("description").value.trim(),
        selectedProject: dataSelect,
        imageProject: imgDefault,
      };

      projectData.push(datasProject);
      // console.log(projectData);
      cardInput();
    };

    // Membaca file sebagai URL data
    reader.readAsDataURL(file);
  } else {
    console.log("Belum ada gambar yang dipilih.");

    let datasProject = {
      nameProject: document.getElementById("project_name").value.trim(),
      startDateProject: document.getElementById("start").value.trim(),
      endDateProject: document.getElementById("end").value.trim(),
      descriptionProject: document.getElementById("description").value.trim(),
      selectedProject: dataSelect,
      imageProject: imgDefault,
    };
    projectData.push(datasProject);
    // console.log(projectData);
    cardInput();
  }
}

function cardInput() {
  const myProjectCardJs = document.getElementById("cardJs");
  myProjectCardJs.classList.add("containerMyProject");
  myProjectCardJs.innerHTML = `<h1>MY PROJECT</h1>
  <div id="cardContent"></div>`;

  const cardContentMain = document.getElementById("cardContent");

  const iconNotfound = {
    Node_Js: "assets/images/playstore.png",
    Next_js: "assets/images/android.png",
    React_Js: "assets/images/java.png",
  };
  const allSelectedIcon = {
    Node_Js: "assets/images/nodejs.png",
    Next_js: "assets/images/next-js.png",
    React_Js: "assets/images/react.png",
    TypeScript: "assets/images/typescript.png",
  };

  projectData.forEach((project) => {
    const iconsToShow =
      project.selectedProject.length === 0
        ? Object.keys(iconNotfound)
        : project.selectedProject;

    let liIcons = iconsToShow
      .map((tech) => {
        let iconSrc = "";

        if (project.selectedProject.length === 0) {
          // Ambil dari iconNotfound
          iconSrc = iconNotfound[tech];
        } else {
          // Ambil dari allSelectedIcon
          iconSrc = allSelectedIcon[tech];
        }

        if (!iconSrc) return "";
        return `<li>
      <a href="">
        <img class="cardMyProjectIcon" src="${iconSrc}" alt="${tech}" />
      </a>
    </li>`;
      })
      .join("");

    cardContentMain.innerHTML += `
    <div class="containerCardProject">
      <div class="card" style="width: 18rem">
        <img
          src="${project.imageProject || "assets/images/brandred.png"} "
          class="card-img-top mx-auto"
          alt="..."
        />
        <div class="card-body">
          <h5 class="card-title">${
            project.nameProject
              ? project.nameProject
              : "Dumbways Mobile App - 2021"
          }</h5>
          <p class="card-text">durasi: 3 bulan</p>

          <span class="card-text">
          ${
            project.descriptionProject
              ? project.descriptionProject
              : "App that used for dumbways student, it was deployed and can downloaded on playstore. "
          }
            <br />Happy download
          </span>

          <div class="cardMyProject">
            <ul class="list-group list-group-horizontal gap-4">
              ${liIcons}
            </ul>
          </div>
          <div class="container-Button">
            <a href="#" class="btn btn-primary btn-dark btn-cardMyProjectEdit"
              >edit</a
            >
            <a
              href="#"
              class="btn btn-primary btn-dark btn-cardMyProjectDelete"
              >delete</a
            >
          </div>
        </div>
      </div>
    </div>`;
  });
}
