//Step 1 - Fetch data from works//
const gallery = document.querySelector(".gallery")

function createGallery(allWorks){
    allWorks.forEach(work => {

        const imageBox = document.createElement('figure');
        const image = document.createElement('img');
        const descriptionImg = document.createElement('figcaption');

        image.src = work.imageUrl;
        image.alt = work.title;
        descriptionImg.textContent = work.title;
        imageBox.append(image, descriptionImg); 
        gallery.appendChild(imageBox);
    })
}

fetch("http://localhost:5678/api/works")
    .then(reponse => reponse.json()) 
    .then(allWorks => {
        createGallery(allWorks);
        createGalleryModale(allWorks);
    })

    .catch(error => console.error("Erreur: Aucune réponse de l'API (GET api/works)", error));


//Step 2 - Create filters by category//
const filterGallery = document.querySelector(".filter-gallery")

function createFilterBtn(allCategories){
    allCategories.forEach(category => {

        const filterBtn = document.createElement('button');

        filterBtn.innerText= category.name;
        filterGallery.appendChild(filterBtn);
        //Upon clicking buttons, it calls the function//
        filterBtn.addEventListener("click", () => {
            createFilterImg(category.name)
        })
    })  
}

function createFilterImg(categoryName) {

    fetch("http://localhost:5678/api/works")
        .then(reponse => reponse.json()) 
        .then(allWorks => { 

            const onlyFilterImg = allWorks.filter(work => work.category.name === categoryName);

            gallery.innerHTML = "";
            createGallery(onlyFilterImg);

            //We create a function for our 'TOUS' button that will display the entire gallery.//
            const btnForAllwork = document.querySelector(".tous-btn")
            btnForAllwork.addEventListener("click", () => {
                gallery.innerHTML = "";
                createGallery(allWorks) 
            })

        .catch(error => console.error("Erreur: Aucune réponse de l'API (GET api/works) lors de la création de la galerie filtré par categorie", error));       
    })           
}  
  
fetch("http://localhost:5678/api/categories")

    .then(reponse => reponse.json()) 
    .then(allCategories => { 
        createFilterBtn(allCategories)
    }) 

    .catch(error => console.error("Erreur: Aucune réponse de l'API (GET api/categories)", error));


//Step 3 - Administrator interface creation//
const userToken =localStorage.getItem("token")
const editModeBanner = document.querySelector(".admin-banner")
const editModeBtn = document.querySelector(".admin-btn-modifier")
const userLogin = document.querySelector(".admin-login")
const userLogout = document.querySelector(".admin-logout")

if(userToken !== null){
    editModeBanner.style.display = "block";
    editModeBtn .style.display = "inline-block";
    userLogin.style.display = "none";
    userLogout.style.display = "block";
}

//Close admin mode//
userLogout.addEventListener("click", () => {
    localStorage.clear(); 
})

editModeBtn.addEventListener("click", () => {
    createGalleryModale();
})

//Step 4 - Creating the modal for deleting images//

//Importing images and icons into the modal//
const modaleImg = document.querySelector(".modale-img")

function createGalleryModale(allWorks){
    allWorks.forEach(work => {

        const imageBox = document.createElement('figure');
        const image = document.createElement('img');
        const descriptionImg = document.createElement('figcaption');
        const iconeTrash = document.createElement('i');

        image.src = work.imageUrl;
        iconeTrash.classList.add("fa-solid","fa-trash-can");
        iconeTrash.dataset.workId = work.id;
        imageBox.append(image, descriptionImg); 
        modaleImg.appendChild(imageBox);
        descriptionImg.appendChild(iconeTrash);
        //Delete images in the gallery on button click//
        iconeTrash.addEventListener("click",()=>{
            imageBox.remove;
            deleteImg(work.id);
            alert("Vous avez bien supprimer votre fichier !")
            window.location.href = 'index.html'; 
        })
    })   
}

//Delete images//
function deleteImg(workId){

    fetch(`http://localhost:5678/api/works/${workId}`, {
        method: 'DELETE',
        headers: {
            'Accept': 'application/json',
            'Authorization': `Bearer ${userToken}` 
        },
    })

    .then(response => response.ok)

    .catch(error => console.error("Erreur: Aucune réponse de l'API (POST api/works/ID) lors de la supression de nos images", error));  
}

//Step 5 - Creation of the modal to add images//

//Form creation//
const selectForm = document.getElementById("categorie-form")
function createFormGategorie(allCategories){
    allCategories.forEach(category => {

        const optionGategorie = document.createElement('option');
        optionGategorie.innerText= category.name;
        optionGategorie.value = category.id;
        selectForm.appendChild(optionGategorie);    
    });  
}

fetch("http://localhost:5678/api/categories")

    .then(reponse => reponse.json()) 
    .then(Allcategory => { 
        createFormGategorie(Allcategory);
    }) 

    .catch(error => console.error("Erreur: Aucune réponse de l'API (GET api/categories)", error));

//Get the user's image to display//
const imageUpload = document.getElementById('imageUpload');
const imageUploadBox = document.querySelector('.image-added');
const imageIcon = document.querySelector('.icone-img')
const btnForAddImage = document.querySelector(".image-btn")
const modalePara = document.querySelector(".para-modale")

imageUpload.addEventListener('change', function () {
    if (this.files.length > 0) {

        const selectedFile = this.files[0];
        const imageUrL = URL.createObjectURL(selectedFile);
        const imageAdded = document.createElement('img');

        imageAdded.src = imageUrL;
        imageUploadBox.innerHTML = '';
        imageUploadBox.appendChild(imageAdded);
        imageIcon.style.display="none";
        btnForAddImage.style.display= "none";
        modalePara.style.display= "none";
    }
})

//Modify the submit button of the form//
const submitBtn = document.querySelector('.modale-add-submit');
const inputFile = document.querySelector("#imageUpload")
const inputTitle = document.querySelector('#modale-add-title')

function SubmitBtnColor() {
    if (inputFile.files[0] && inputTitle.value !== "") {
        submitBtn.style.background="#1D6154"
    }else{
        submitBtn.style.background=""
    }
}

inputFile.addEventListener("input",SubmitBtnColor);
inputTitle.addEventListener("input",SubmitBtnColor);
//Send the data from our form//
const modaleAddForm = document.querySelector('.modale-add-form');
modaleAddForm.addEventListener('submit', async (e)=>{
    e.preventDefault();

    const title = document.querySelector('#modale-add-title').value;
    const category =  document.getElementById('categorie-form').value;      
    const imageFile = document.getElementById('imageUpload').files[0];
    //Convert our data into object//
    const AddNewProject = new FormData();
    
    AddNewProject.append("title", title);
    AddNewProject.append("category", category);
    AddNewProject.append("image", imageFile);
    //Check if the fields are empty//
    if (!title || !category || !imageFile){
        alert("L'envoie de votre projet à échoué. Vérifiez votre titre et votre fichier")
      } else{
        alert("Votre projet a bien été ajouté")
      }
    //Send to the API//
    fetch('http://localhost:5678/api/works', {
        method:"POST",    
        headers:{ 
            'Authorization':`Bearer ${userToken}` 
        },
        body:AddNewProject ,
    })
    .then((response) => {
        window.location.href = 'index.html';
        return response.json();
    })
    .catch(error => console.error("Erreur: Aucune réponse de l'API (POST api/work)", error));
})

//Handling modal opening/closing/return.//
const closeModaleBtn = document.querySelector(".modale-close-btn")
const ModaleForDelete =document.querySelector(".modale-delete")
const BtnCloseModaleAdd = document.querySelector(".modaleAdd-close-btn") 
const ModaleForAdd = document.querySelector(".modale-add") 
const background = document.querySelector(".background")
const BtnReturn = document.querySelector(".modaleAdd-return-btn") 
const BtnOpenModaleAdd = document.querySelector(".modale-add-btn") 


function clearImageBox() {
    imageUpload.value = ''; 
    imageUploadBox.innerHTML = ''; 
    imageIcon.style.display = "block"; 
    btnForAddImage.style.display = "block";
    modalePara.style.display = "block"; 
}

function ClosingModale(){
    ModaleForDelete.style.display= "none";
    ModaleForAdd.style.display = "none";
    background.style.display = "none";
    clearImageBox();
}

function OpenModale(){
    ModaleForDelete.style.display= "block";
    background.style.display = "block";
}

closeModaleBtn.addEventListener('click', ClosingModale)
BtnCloseModaleAdd.addEventListener('click',ClosingModale) 
background.addEventListener('click',ClosingModale)
editModeBtn.addEventListener('click', OpenModale)

BtnOpenModaleAdd.addEventListener('click',() => {
    ClosingModale()
    ModaleForAdd.style.display = "block";
    background.style.display = "block";
}) 

BtnReturn.addEventListener('click',() => {
    ClosingModale()
    OpenModale() 
})
