const token = localStorage.getItem("token") 
if(token) {
   console.log("connexion ok") 
   const header = document.querySelector("header"); 
   const modeEdition = document.createElement("section"); 
   const icon = document.createElement("i"); 
   
   icon.classList.add("fa-solid", "fa-pen-to-square"); 
   modeEdition.classList.add("modeEdition"); 
   const textModeEdition = document.createElement("span"); 
   textModeEdition.textContent = "Mode édition"; 

  modeEdition.appendChild(icon);
  modeEdition.appendChild(textModeEdition);
  header.appendChild(modeEdition);


}
let allWorks = [];

fetch("http://localhost:5678/api/works")
  .then(response => response.json())
  .then(data => {
    allWorks = data;
    displayWorks(allWorks);
  });
  
function displayWorks(works) {
  const gallery = document.querySelector(".gallery");
  gallery.innerHTML = "";

  works.forEach(work => {
    const figure = document.createElement("figure");

    const img = document.createElement("img");
    img.src = work.imageUrl;
    img.alt = work.title;

    const figcaption = document.createElement("figcaption");
    figcaption.textContent = work.title;

    figure.appendChild(img);
    figure.appendChild(figcaption);

    gallery.appendChild(figure);
  });
}
  fetch("http://localhost:5678/api/categories")
  .then(reponse => reponse.json())
  .then( categories => {
    const filter = document.querySelector(".filter");

    //Bouton Tous
    const allButtons = document.createElement("button")
    allButtons.textContent=("Tous")
    filter.appendChild(allButtons);
    allButtons.addEventListener("click", () => {
      displayWorks(allWorks);
    });

    //Boutons Catégories
    categories.forEach(category => {
      const button = document.createElement("button");
      button.textContent = category.name;
      filter.appendChild(button);

      button.addEventListener("click" , () => {
        const filterWorks = allWorks.filter(work =>
          work.categoryId === category.id
        );
        displayWorks(filterWorks);
      });
    });
  });
  
