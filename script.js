// Selectionner les éléments
const form = document.querySelector('#formulaire-employee');
const inputNomEl = document.querySelector('#nom');
const inputPrenomEl = document.querySelector('#prenom');
const inputEmailEl = document.querySelector('#email');
const inputPosteEl = document.querySelector('#poste');
const listeEmployes = document.querySelector('#listes');

// Liste des employes en memoire(Localstorage)
let employes = [];

// chargement des donnees du localstorage au demarrage
window.addEventListener('DOMContentLoaded', () => { 
    const employesLocalStorage = JSON.parse(localStorage.getItem('employes'));
    if(employesLocalStorage){
        employes = employesLocalStorage;
        afficherListeEmployes(); // Afficher la liste des employes deja enregistrer
    }
});

// Gestion de la soumission du formulaire avec la validation des champs

form.addEventListener('submit', (e) => {
    e.preventDefault();

    // Récupérer les valeurs au moment de la soumission
    const nomValue = inputNomEl.value.trim();
    const prenomValue = inputPrenomEl.value.trim();
    const emailValue = inputEmailEl.value.trim();
    const posteValue = inputPosteEl.value.trim();

    if(!validateForm()){
        return;
    }

    // creation d'un nouvel objet employes
    const employe = {
        id: Date.now(), //identifiant unique
        nom: nomValue,
        prenom: prenomValue,
        email: emailValue,
        poste: posteValue,
    };

    employes.push(employe); // Ajouter l'employé à la liste
    sauvegarderEmployesLocalStorage(); // Utiliser la fonction pour sauvegarder
    afficherListeEmployes();
    form.reset();

    // Réinitialiser les styles après ajout
    ['nom', 'prenom', 'email', 'poste'].forEach(id => {
        document.getElementById(id).style.borderColor = '';
        document.getElementById(`erreur-${id}`).textContent = '';
    });
});

// Ajout des écouteurs d'événements 'input' pour la validation en temps réel
function verifierNom(){
    const nomValue = inputNomEl.value.trim();
    if(!nomValue){
        setError('nom', 'Veuillez entrer votre nom');
        return false;
    }else{
        setError('nom', '');
        return true;
    }
}
function verifierPrenom(){
    const prenomValue = inputPrenomEl.value.trim();
    if(!prenomValue){
        setError('prenom', 'Veuillez entrer votre prenom');
        return false;
    }else{
        setError('prenom', '');
        return true;
    }
}
function verifierEmail(){
    const emailValue = inputEmailEl.value.trim();
    if(!emailValue || !validateEmail(emailValue)){
        setError('email', 'Veuillez entrer un email valide');
        return false;
    }else{
        setError('email', '');
        return true;
    }
}
function verifierPoste(){
    const posteValue = inputPosteEl.value.trim();
    if(!posteValue){
        setError('poste', 'Veuillez entrer votre poste');
        return false;
    }else{
        setError('poste', '');
        return true;
    }
}

function validateForm(){
    const isNomValid = verifierNom();
    const isPrenomValid = verifierPrenom();
    const isEmailValid = verifierEmail();
    const isPosteValid = verifierPoste();
    return isNomValid && isPrenomValid && isEmailValid && isPosteValid;
}

// Fonction pour la validation de l'email
function validateEmail(email){
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Affiche ou enlève une erreur sur un champ
function setError(inputId, message) {
    const input = document.getElementById(inputId);
    const error = document.getElementById(`erreur-${inputId}`);
    error.classList.add('error');
    error.textContent = message;
    input.style.borderColor = message ? "red" : "#ccc";
    input.style.outlineColor = message ? "red" : "#0072ce";
}

// Fonction pour sauvegarder les employés dans le localStorage
function sauvegarderEmployesLocalStorage() {
    localStorage.setItem('employes', JSON.stringify(employes)); 
}
  
function afficherListeEmployes() {
    listeEmployes.innerHTML = '';
    if (employes.length === 0) {
        listeEmployes.innerHTML = '<p>Aucun employé enregistré.</p>';
        return;
    }

    employes.forEach(emp => {
        const li = document.createElement('li');
        li.innerHTML = `
        <strong>Nom : </strong>${emp.nom} ${emp.prenom}</strong><br/>
        <strong>Email : </strong>${emp.email}<br/>
        <strong>Poste : </strong>${emp.poste} <br/>
        <button class="delete-btn" onclick="deleteEmployee(${emp.id})">Supprimer</button>
        `;
        listeEmployes.appendChild(li);
    });
}

function deleteEmployee(id) {
    employes = employes.filter(emp => emp.id !== Number(id)); // Assurer que l'ID est un nombre si nécessaire, Date.now() renvoie un nombre
    sauvegarderEmployesLocalStorage(); // Utiliser le nom de fonction corrigé
    afficherListeEmployes(); // Utiliser le nom de fonction correct
}