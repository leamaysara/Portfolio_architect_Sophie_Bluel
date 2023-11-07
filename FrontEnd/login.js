const loginForm = document.querySelector('.login-form')

loginForm.addEventListener('submit', function (e) {
    e.preventDefault();

    const email = document.querySelector('#email').value;
    const password = document.querySelector('#password').value;
    const data = {email: email, password: password};
    
    fetch('http://localhost:5678/api/users/login',{
        method: 'POST',
        headers: {
             'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    
    .then(response => response.json())
    .then(responseData => {

        if (responseData && responseData.token) {
            console.log(window.location.origin);
            localStorage.setItem('token', responseData.token);  
            window.location.href = "index.html";
         
        } else {
            alert("Adresse mail ou mot de passe incorrect.")
        }
    })

    .catch((error) => {
        console.error("Erreur: Aucune réponse de l'API (POST api/users/login)", error)
    })
})
