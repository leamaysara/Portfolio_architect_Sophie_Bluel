

//Fetch to retrieve data//
fetch('http://localhost:5678/api/works')
  .then(response => response.json())
  .then(data => {
    const gallery = document.getElementById('gallery');
    console.log(data)

    data.forEach ((element) => {
      console.log(element)
      const figure = document.createElement('figure');
      const image = document.createElement('img');
      const figcaption = document.createElement('figcaption');

      image.src = element.imageUrl; 
      image.alt = element.title;

      figcaption.textContent = element.title;
      
      figure.appendChild(image);
      figure.appendChild(figcaption);

      gallery.appendChild(figure);
    })
  })
  .catch(error => console.error('Erreur :', error));

