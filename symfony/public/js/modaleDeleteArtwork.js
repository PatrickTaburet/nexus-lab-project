let modalButtons = document.querySelectorAll('.buttonModale');
modalButtons.forEach(button => {
  button.addEventListener('click', openModal);
});

let modale = document.querySelector(".superModale");
let closeButton = document.querySelector(".closeButton");
let body =  document.querySelector(".superBody");
let modaleBackground = document.querySelector(".modaleBackground");


function openModal(event){
  const deleteUrl = event.target.getAttribute('data-delete-url');
  document.body.style.overflow = "hidden"; // Desable scrolling
  modale.classList.remove("hidden");
  modale.classList.add("translate");
  modaleBackground.classList.remove("hidden");

  const modalContent = document.querySelector('.modaleContent');
  modalContent.innerHTML =  `
  <p>Do you want to delete this artwork from the gallery and the database ?</p> 
  <a href="${deleteUrl}" class="customButton generateButton">Delete</a>
  `;
}
function closeModal(){
  document.body.style.overflow = "auto"; // Enable scrolling
  modale.classList.add("hidden");
  modale.classList.remove("translate");
  modaleBackground.classList.add("hidden");
}
closeButton.addEventListener("click",closeModal);
modaleBackground.addEventListener("click", function(event) {
  if (event.target === modaleBackground) {
    closeModal();
  }
});