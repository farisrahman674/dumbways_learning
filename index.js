import express, { json, urlencoded } from "express";
import { engine } from "express-handlebars";
import { Pool } from "pg";
import multer from "multer";
import path from "path";

// import { fileURLToPath } from "url";

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = dirname(__filename);
const db = new Pool({
  user: "postgres",
  password: "postgres",
  host: "localhost",
  port: 5432,
  database: "dumbwaysTaskDB",
  max: 20,
});

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "src/assets/uploads"); // folder untuk simpan gambar
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    // nama file original + timestamp supaya unik
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage });

const app = express();

const port = 3000;

app.engine("handlebars", engine());
app.set("view engine", "handlebars");
app.set("views", "src/views");

app.use("/assets/images", express.static("src/assets/images"));
app.use("/assets/uploads", express.static("src/assets/uploads"));
app.use("/assets", express.static("src/assets"));
app.use(express.urlencoded({ extended: false }));

app.get("/", home);
app.get("/myProject", myProject);
app.post("/myProject", upload.single("image"), inputDatasProject);
app.get("/detail/:id_Project", detailMyProject);
app.get("/updateMyProject/:id_Project", updateMyProject);
app.post("/update/:id_Project", upload.single("image"), updatedData);
app.get("/deleted/:id_Project", deletedData);
app.get("/contactMe", contactMe);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

function home(req, res) {
  res.render("index", { isHome: true, isMyProject: false });
}

async function detailMyProject(req, res) {
  try {
    const id = req.params.id_Project;
    const query = `SELECT * FROM "myProject" WHERE "id_Project" = $1`;
    const result = await db.query(query, [id]);
    const project = result.rows[0];

    const allSelectedIcon = {
      Node_Js: `/assets/images/nodejs.png`,
      Next_js: `/assets/images/next-js.png`,
      React_Js: `/assets/images/react.png`,
      TypeScript: `/assets/images/typescript.png`,
    };

    const startDate = formatDate(project.start_date);
    const endDate = formatDate(project.end_date);

    const techWithIcons = project.technology
      .map((tech) => {
        return { name: tech.replace(/_/g, " "), icon: allSelectedIcon[tech] };
      })
      .filter(Boolean);

    const leftIcons = techWithIcons.slice(
      0,
      Math.ceil(techWithIcons.length / 2)
    );
    const rightIcons = techWithIcons.slice(Math.ceil(techWithIcons.length / 2));

    console.log({ leftIcons, rightIcons });

    const projectData = {
      duration: calculateDurationDetailMyProject(
        project.start_date,
        project.end_date
      ),
      startDate,
      endDate,
    };

    console.log(project);
    console.log(projectData);

    res.render("detailMyProject", {
      isHome: false,
      isMyProject: false,
      projectData,
      project,
      leftIcons,
      rightIcons,
    });
  } catch (err) {
    console.error("Error inserting project:", err.message);
    res.status(500).send("Internal Server Error");
  }
}

async function myProject(req, res) {
  try {
    const allSelectedIcon = {
      Node_Js: `/assets/images/nodejs.png`,
      Next_js: `/assets/images/next-js.png`,
      React_Js: `/assets/images/react.png`,
      TypeScript: `/assets/images/typescript.png`,
    };

    const query = `SELECT * FROM "myProject" ORDER BY "id_Project"`;
    const result = await db.query(query);
    console.log(result.rows);

    const projects = result.rows.map((project) => {
      const techList = project.technology;
      const icons = techList
        .map((tech) => allSelectedIcon[tech])
        .filter(Boolean);

      return {
        project,
        duration: calculateDuration(project.start_date, project.end_date),
        icons,
      };
    });

    res.render("myProject", {
      isHome: false,
      isMyProject: true,
      result: projects,
    });
  } catch (err) {
    console.error("Error inserting project:", err.message);
    res.status(500).send("Internal Server Error");
  }
}
async function inputDatasProject(req, res) {
  try {
    let { project_name, description, technology, start, end } = req.body;
    console.log(project_name, description, technology, start, end);

    console.log(req.body);

    const defaultProjectName = "Dumbways Mobile App - 2021";
    project_name =
      project_name && project_name.trim() !== ""
        ? project_name
        : defaultProjectName;

    const defaultDescription =
      "App that used for dumbways student, it was deployed and can downloaded on playstore.";
    description =
      description && description.trim() !== ""
        ? description
        : defaultDescription;

    const defaultStart = "2025-01-01";
    const defaultEnd = "2025-03-01";
    start = start && start.trim() !== "" ? start : defaultStart;
    end = end && end.trim() !== "" ? end : defaultEnd;

    const technologies = Array.isArray(technology)
      ? technology
      : technology
      ? [technology]
      : ["Node_Js", "Next_js", "React_Js"];

    const image = req.file
      ? `/assets/uploads/${req.file.filename}`
      : `/assets/uploads/brandred.jpg`;

    const query = `INSERT INTO "myProject" (project_name, description, technology, start_date, end_date, image) VALUES ($1, $2, $3, $4, $5, $6)`;
    const values = [project_name, description, technologies, start, end, image];
    const result = await db.query(query, values);

    console.log("Insert successful", result.rowCount);
    res.redirect("/myProject");
  } catch (err) {
    console.error("Error inserting project:", err.message);
    res.status(500).send("Internal Server Error");
  }
}

function contactMe(req, res) {
  res.render("contactMe", { isHome: false, isMyProject: false });
}

async function updateMyProject(req, res) {
  const id = req.params.id_Project;
  const query = `SELECT * FROM "myProject" WHERE "id_Project" = $1`;

  try {
    const result = await db.query(query, [id]);
    const project = result.rows[0];

    project.start_date = formatDate(project.start_date);
    project.end_date = formatDate(project.end_date);

    const selectedTech = project.technology;
    const checkboxStates = {
      Node_Js: selectedTech.includes("Node_Js"),
      React_Js: selectedTech.includes("React_Js"),
      Next_js: selectedTech.includes("Next_js"),
      TypeScript: selectedTech.includes("TypeScript"),
    };

    console.log(project);
    res.render("updateMyProject", {
      isHome: false,
      isMyProject: false,
      project,
      checkboxStates,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Terjadi kesalahan saat mengambil data project");
  }
}

async function updatedData(req, res) {
  try {
    const id = req.params.id_Project;
    const image = req.file
      ? `/assets/uploads/${req.file.filename}`
      : req.body.oldimg;
    const query = `
  UPDATE "myProject"
  SET 
    "project_name" = $1,
    "description" = $2,
    "technology" = $3,
    "start_date" = $4,
    "end_date" = $5,
    "image" = $6
  WHERE "id_Project" = $7
`;
    const values = [
      req.body.project_name,
      req.body.description,
      req.body.technology,
      req.body.start,
      req.body.end,
      image,
      id,
    ];
    console.log(values);

    const result = await db.query(query, values);

    console.log("Update successful", result);
    res.redirect("/");
  } catch (err) {
    console.error(err);
    res.status(500).send("Terjadi kesalahan saat mengambil data project");
  }
}

async function deletedData(req, res) {
  const id = req.params.id_Project;
  const query = `DELETE FROM "myProject" WHERE "id_Project" = $1`;

  try {
    await db.query(query, [id]);
    console.log("Project berhasil dihapus:", id);
    res.redirect("/");
  } catch (err) {
    console.error("Error saat delete project:", err);
    res.status(500).send("Terjadi kesalahan saat menghapus project");
  }
}

function calculateDuration(startDate, endDate) {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const timeDifference = Math.floor((end - start) / (1000 * 3600 * 24));

  let result = "";

  // Cek apakah durasi kurang dari 31 hari
  if (timeDifference < 31) {
    result = `durasi: ${timeDifference} Hari`; // Durasi dalam hari
  }
  // Cek apakah durasi lebih dari 31 hari, jadi bisa dihitung bulan
  else if (timeDifference >= 31 && timeDifference <= 365) {
    const totalMonths = Math.floor(timeDifference / 30); // Menghitung bulan
    let remainingDays = timeDifference % 30;
    result = `durasi: ${totalMonths} Bulan, ${remainingDays} Hari`; // Durasi dalam bulan
  }
  // Cek jika durasi lebih dari 365 hari, berarti lebih dari 1 tahun
  else if (timeDifference > 365) {
    const totalYears = Math.floor(timeDifference / 365); // Menghitung tahun
    let remainingDays = timeDifference % 365; // Sisa hari setelah tahun

    let remainingMonths = Math.floor(remainingDays / 30); // Menghitung bulan dari sisa hari
    remainingDays = remainingDays % 30; // Sisa hari setelah bulan

    // Menampilkan dalam format tahun, bulan, hari
    result = `durasi: ${totalYears} Tahun, ${remainingMonths} Bulan, ${remainingDays} Hari`;
  } else {
    result = `durasi: 3 bulan`;
  }

  return result;
}

function calculateDurationDetailMyProject(startDate, endDate) {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const timeDifference = Math.floor((end - start) / (1000 * 3600 * 24));

  let result = "";

  // Cek apakah durasi kurang dari 31 hari
  if (timeDifference < 31) {
    result = `${timeDifference} Hari`; // Durasi dalam hari
  }
  // Cek apakah durasi lebih dari 31 hari, jadi bisa dihitung bulan
  else if (timeDifference >= 31 && timeDifference <= 365) {
    const totalMonths = Math.floor(timeDifference / 30); // Menghitung bulan
    let remainingDays = timeDifference % 30;
    result = `${totalMonths} Bulan, ${remainingDays} Hari`; // Durasi dalam bulan
  }
  // Cek jika durasi lebih dari 365 hari, berarti lebih dari 1 tahun
  else if (timeDifference > 365) {
    const totalYears = Math.floor(timeDifference / 365); // Menghitung tahun
    let remainingDays = timeDifference % 365; // Sisa hari setelah tahun

    let remainingMonths = Math.floor(remainingDays / 30); // Menghitung bulan dari sisa hari
    remainingDays = remainingDays % 30; // Sisa hari setelah bulan

    // Menampilkan dalam format tahun, bulan, hari
    result = `${totalYears} Tahun, ${remainingMonths} Bulan, ${remainingDays} Hari`;
  } else {
    result = `3 bulan`;
  }

  return result;
}

function formatDate(date) {
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}
