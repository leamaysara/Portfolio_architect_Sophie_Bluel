//Step 1 - Fetch data from works//
let works = [];
let currentCategory = "Tous";

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

//Async function to fetch data from an API endpoint
async function fetcher() {
  await fetch(`http://localhost:5678/api/works`)
    .then((res) => res.json())
    .then((data) => (works = data));

  filterWorksByCategory(currentCategory);
  galeriesDisplayModal(works);
}

//Function to display works in the gallery
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

//Step 2 - Create filters by category//
function filterWorksByCategory(category) {
  const filteredWorks =
    category === "Tous"
      ? works
      : works.filter((work) => work.category.name === category);
  //console.log(filteredWorks);
  galeriesDisplay(filteredWorks);
  //Update current category
  currentCategory = category;
}

//Event listeners for different category filter buttons
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

// Step 3 - Modal : Administrator interface creation//

// Event listener for displaying the modal on clicking 'modifierMod'
modifierMod.addEventListener("click", () => {
  // Show the modal by setting its display property to 'block'
  document.getElementById("modal").style.display = "block";
});

// Event listener for hiding the modal on clicking 'backMod'
backMod.addEventListener("click", () => {
  // Hide the modal by setting its display property to 'none'
  document.getElementById("modal").style.display = "none";
});

// Loop through each 'xMark' element and add an event listener to hide the modal on click
xMark.forEach((mark) =>
  mark.addEventListener("click", () => {
    // Hide the modal by setting its display property to 'none'
    document.getElementById("modal").style.display = "none";
    errorModalForm.style.display = "none";
    successModalForm.style.display = "none";
  })
);

// Select various elements related to different modals
const modalAdding = document.querySelector(".modal-adding");
const modalDelete = document.querySelector(".modal-delete");
const addImages = document.querySelector(".add-images");
const arrowLeft = document.querySelector(".back-modal");

// Event listener to display the 'modalAdding' and hide the 'modalDelete' on clicking 'addImages'
addImages.addEventListener("click", () => {
  // Show the 'modalAdding'
  modalAdding.style.display = "block";
  // Hide the 'modalDelete'
  modalDelete.style.display = "none";
});

// Event listener to hide the 'modalAdding' and display the 'modalDelete' on clicking 'arrowLeft'
arrowLeft.addEventListener("click", () => {
  modalAdding.style.display = "none";
  modalDelete.style.display = "block";
  errorModalForm.style.display = "none";
  successModalForm.style.display = "none";
});

// Step 4 - Creation of the modal to add images//

// DOM elements selection related to the modal for adding images
const selectedImage = document.getElementById("selected-image");
const imgChoose = document.querySelector(".before-selected");
const SelecImage = document.querySelector(".after-selected");
const myForm = document.getElementById("submit-modal");
const errorModalForm = document.querySelector(".error-form-modal");
const successModalForm = document.querySelector(".success-form-modal");

function updateGallery(workToAdd) {
  if (workToAdd) {
    works.push(workToAdd); // Add a new work to all works
  }
}

// Event listener triggered when the 'imageModal' input changes
imageModal.addEventListener("change", function (event) {

  const file = event.target.files[0];

  if (file) {
    //Display the selected image
    selectedImage.src = URL.createObjectURL(file);
    imgChoose.style.display = "none";
    selectedImage.style.display = "block";

  } else {
    //Reset the selected image
    selectedImage.src = "";
  }
});

// Event listener triggered when the 'myForm' is submitted
myForm.addEventListener("submit", async (event) => {

  // Prevent the default form submission behavior
  event.preventDefault();

  // Retrieve the selected file from 'imageModal'
  const file = imageModal.files[0];

  if (file && titreModal.value && categorieModal.value) {
    //If a file is selected, create form data with necessary details
    const formData = new FormData();

    formData.append("image", file);
    formData.append("title", `${titreModal.value}`);
    formData.append("category", `${categorieModal.value}`);

    //Prepare options for the POST request
    const requestOptions = {
      method: "POST",
      body: formData,
      headers: {
        accept: "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    };

    //Send a POST request to upload the image
    fetch("http://localhost:5678/api/works", requestOptions)
    .then(response => {
      switch (response.status) {
        case 201:
          // Successful creation
          console.log('The project has been successfully added to the gallery.');
          successModalForm.style.display = "block";
          return response.json();
        case 400:
          // Bad request
          console.error('A field is missing');
          throw new Error('A field is missing');
        default:
          // Handle other status codes if necessary
          console.error('Unhandled status code:', response.status);
          throw new Error('Unhandled status code: ' + response.status);
      }
    })
    .then(data => {
      console.log(data);
      updateGallery(data); // Add the newly created work
      errorModalForm.style.display = "none"; // Hide any error message
    })
    .catch(error => {
      console.error("Error sending the request:", error); // Log any errors during the request
      errorModalForm.style.display = "block";
    });
  

    // Reset the file input field after form submission
    imageModal.value = null;

    fetcher(); // Fetch new data after adding the image
    selectedImage.src = ""; // Reset the selected image
    imgChoose.style.display = "flex"; // Show the 'imgChoose' element
    selectedImage.style.display = "none"; // Hide the selected image element
    titreModal.value = ""; // Reset the title input field

  } else {
    console.error("No file selected."); // Log an error if no file is selected
    errorModalForm.style.display = "block";
    successModalForm.style.display = "none";
  }
});

//Step 5 - Creating the modal for deleting images//
function galeriesDisplayModal(worksModal) {
  //Display works in the gallery by creating HTML elements dynamically
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
    .join(""); //Convert the mapped elements to a single string of HTML content

  const trashCan = document.querySelectorAll(".fa-trash-can");

  trashCan.forEach(function (trash) {
    //Add a click event listener to each trash can icon
    trash.addEventListener("click", async function (event) {
      event.preventDefault();
      const elementId = event.currentTarget.id;

      //Set up DELETE request options with authorization header
      const requestOptionsDelete = {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      };

      //Send a DELETE request to remove the selected work by its ID
      await fetch(
        `http://localhost:5678/api/works/${elementId}`,
        requestOptionsDelete
      );

      //Refresh the works after deletion
      fetcher();
    });
  });
}

//Login-side management of the site
const modifieBtn = document.querySelector(".modification");
const tri = document.querySelector(".tri");
const editVersion = document.querySelector(".edit-mod");
const login = document.getElementById("login");
const logout = document.getElementById("logout");

const connected = localStorage.getItem("token") ? true : false;

//Update the UI based on the user's login status
if (connected) {
  logout.style.display = "inline";
  login.style.display = "none";

  modifieBtn.style.display = "flex";
  tri.style.display = "none";
  editVersion.style.display = "flex";
}

//Trigger the fetcher function when the window is loaded
window.addEventListener("load", fetcher);

logout.addEventListener("click", async (event) => {
  logout.style.display = "none";
  login.style.display = "inline";

  modifieBtn.style.display = "none";
  tri.style.display = "flex";
  editVersion.style.display = "none";

  localStorage.removeItem("token");
})
