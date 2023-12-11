// VARIABLES
let works = [];
let currentCategory = "Tous";

// CONSTS
const connected = localStorage.getItem("token") ? true : false;
const allButton = document.getElementById("all");
const objetsButton = document.querySelector(".btn.objet");
const appartementsButton = document.getElementById("Appartements");
const hrButton = document.getElementById("H&r");
const gallery = document.querySelector(".gallery");
const form = document.querySelector(".form-login");
const modifierMod = document.querySelector(".modification");
const backMod = document.querySelector(".modal-back");
const xMark = document.querySelectorAll(".fa-xmark");
const imageModal = document.getElementById("file");
const titreModal = document.getElementById("title-modal");
const categorieModal = document.getElementById("categorie-modal");
const displayModal = document.querySelector(".display-works-modal");
const modalAdding = document.querySelector(".modal-adding");
const modalDelete = document.querySelector(".modal-delete");
const addImages = document.querySelector(".add-images");
const arrowLeft = document.querySelector(".back-modal");
const selectedImage = document.getElementById("selected-image");
const imgChoose = document.querySelector(".before-selected");
const SelecImage = document.querySelector(".after-selected");
const myForm = document.getElementById("submit-modal");
const errorModalForm = document.querySelector(".error-form-modal");
const successModalForm = document.querySelector(".success-form-modal");
const modifieBtn = document.querySelector(".modification");
const tri = document.querySelector(".tri");
const editVersion = document.querySelector(".edit-mod");
const login = document.getElementById("login");
const logout = document.getElementById("logout");

// INITIALIZATION
window.addEventListener("load", fetcher());

if (connected) {
  logout.style.display = "inline";
  login.style.display = "none";
  modifieBtn.style.display = "flex";
  tri.style.display = "none";
  editVersion.style.display = "flex";
}

// EVENT LISTENERS
logout.addEventListener("click", async (event) => {
  logout.style.display = "none";
  login.style.display = "inline";
  modifieBtn.style.display = "none";
  tri.style.display = "flex";
  editVersion.style.display = "none";
  localStorage.removeItem("token");
})

allButton.addEventListener("click", () => {
  filterWorksByCategory("Tous");
});

objetsButton.addEventListener("click", () => {
  filterWorksByCategory("Objets");
});

appartementsButton.addEventListener("click", () => {
  filterWorksByCategory("Appartements");
});

hrButton.addEventListener("click", () => {
  filterWorksByCategory("Hotels & restaurants");
});

// Administrator interface creation
modifierMod.addEventListener("click", () => {
  document.getElementById("modal").style.display = "block";
});

backMod.addEventListener("click", () => {
  document.getElementById("modal").style.display = "none";
});

xMark.forEach((mark) =>
  mark.addEventListener("click", () => {
    document.getElementById("modal").style.display = "none";
    errorModalForm.style.display = "none";
    successModalForm.style.display = "none";
  })
);

// Event listener to display the 'modalAdding' and hide the 'modalDelete' on clicking 'addImages'
addImages.addEventListener("click", () => {
  modalAdding.style.display = "block";
  modalDelete.style.display = "none";
});

// Event listener to hide the 'modalAdding' and display the 'modalDelete' on clicking 'arrowLeft'
arrowLeft.addEventListener("click", () => {
  modalAdding.style.display = "none";
  modalDelete.style.display = "block";
  errorModalForm.style.display = "none";
  successModalForm.style.display = "none";
});

// Creation of the modal to add images//
imageModal.addEventListener("change", function (event) {
  const file = event.target.files[0];
  if (file) {
    selectedImage.src = URL.createObjectURL(file);
    imgChoose.style.display = "none";
    selectedImage.style.display = "block";
  } else {
    selectedImage.src = "";
  }
});

myForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const file = imageModal.files[0];
  if (file && titreModal.value && categorieModal.value) {
    const formData = new FormData();
    formData.append("image", file);
    formData.append("title", `${titreModal.value}`);
    formData.append("category", `${categorieModal.value}`);
    
    const requestOptions = {
      method: "POST",
      body: formData,
      headers: {
        accept: "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    };

    fetch("http://localhost:5678/api/works", requestOptions)
    .then(response => {
      switch (response.status) {
        case 201:
          console.log('The project has been successfully added to the gallery.');
          successModalForm.style.display = "block";
          return response.json();
        case 400:
          console.error('A field is missing');
          throw new Error('A field is missing');
        default:
          console.error('Unhandled status code:', response.status);
          throw new Error('Unhandled status code: ' + response.status);
      }
    })
    .then(data => {
      updateGallery(data);
      errorModalForm.style.display = "none";
    })
    .catch(error => {
      console.error("Error sending the request:", error);
      errorModalForm.style.display = "block";
    });

    imageModal.value = null;
    selectedImage.src = "";
    imgChoose.style.display = "flex";
    selectedImage.style.display = "none";
    titreModal.value = "";

  } else {
    console.error("No file selected.");
    errorModalForm.style.display = "block";
    successModalForm.style.display = "none";
  }
});

// FUNCTIONS
async function fetcher() {
  await fetch(`http://localhost:5678/api/works`)
    .then((res) => res.json())
    .then((data) => (works = data));

  filterWorksByCategory(currentCategory);
  galeriesDisplayModal(works);
}

// Function to display works in the gallery
function galeriesDisplay(filteredWorks) {
  gallery.innerHTML = filteredWorks
    .map(
      (work) =>
        `
        <figure id=${work.id}>
          <img src=${work.imageUrl}>
          <figcaption>${work.title}</figcaption>
        </figure>
      `
    )
    .join("");
}

// Create filters by category//
function filterWorksByCategory(category) {
  const filteredWorks =
    category === "Tous"
      ? works
      : works.filter((work) => work.category.name === category);
  
  galeriesDisplay(filteredWorks);
  currentCategory = category;
}


function updateGallery(workToAdd) {
  if (workToAdd) {
    works.push(workToAdd);
    galeriesDisplayModal(works);
    galeriesDisplay(works);
  }
}

// Creating the modal for deleting images//
function galeriesDisplayModal(worksModal) {
  displayModal.innerHTML = worksModal
    .map(
      (work) =>
        `
        <figure class="works">
          <i id=${work.id} class="fa-solid fa-trash-can"></i>
          <img src=${work.imageUrl} class="imgtest">
        </figure>
        `
    )
    .join("");

  document.querySelectorAll(".fa-trash-can").forEach(function (trash) {
    trash.addEventListener("click", async function (event) {
      event.preventDefault();
      const elementId = event.currentTarget.id;

      const requestOptionsDelete = {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      };

      await fetch(
        `http://localhost:5678/api/works/${elementId}`,
        requestOptionsDelete
      );

      fetcher();
      // sinon: then
      // récupérer le work qui vient d'être supprimé
      // l'enlever du tableau works
      // update la gallerie et la modal
    });
  });
}
