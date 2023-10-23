const gallery = document.getElementById('gallery');

//Fetch to retrieve data//
fetch('http://localhost:5678/api/works')
  .then(response => response.json())
  .then(data => {
    console.log(gallery)
    //Process the data here//
  })
  .catch(error => console.error('Erreur :', error));

  const galerie = document.getElementById('galerie');

//Add works to the gallery//
data.travaux.forEach(travail => {
  const li = document.createElement('li');
  li.textContent = travail.nom;
  galerie.appendChild(li);
});