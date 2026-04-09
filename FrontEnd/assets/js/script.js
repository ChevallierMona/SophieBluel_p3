// Tableau global contenant tous les projets récupérés depuis l'API
let allWorks = [];
modeAdministrateur();

/**------------------------------------------------------------------------------------------
--------------------------------AFFICHAGE DES PROJETS--------------------------------------*/
// Récupération des projets depuis l'API et affichage dans la galerie
fetch("http://localhost:5678/api/works")
  .then(response => response.json())
  .then(data => {
    allWorks = data;
    displayWorks(allWorks);
  });
// Affiche dynamiquement les projets dans la galerie
function displayWorks(works) {
  const gallery = document.querySelector(".gallery");
  gallery.innerHTML = "";

  works.forEach(work => {
    const figure = document.createElement("figure");
    figure.dataset.id = work.id;

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

/**------------------------------------------------------------------------------------------
--------------------------------AFFICHAGE DES FILTRES--------------------------------------*/
// Récupération des catégories pour créer les filtres
fetch("http://localhost:5678/api/categories")
  .then(response => response.json())
  .then(categories => {
    const filter = document.querySelector(".filter");

    const allBtn = document.createElement("button");
    allBtn.textContent = "Tous";
    filter.appendChild(allBtn);

    allBtn.addEventListener("click", () => {
      displayWorks(allWorks);
    });

    categories.forEach(category => {
      const button = document.createElement("button");
      button.textContent = category.name;
      filter.appendChild(button);

      button.addEventListener("click", () => {
        const filtered = allWorks.filter(work => work.categoryId === category.id);
        displayWorks(filtered);
      });
    });
  });

/**------------------------------------------------------------------------------------------
--------------------------------MODE ADMINISTRATEUR---------------------------------------*/
// Active le mode administrateur si un token est présent
function modeAdministrateur() {
  const token = localStorage.getItem("token");

  if (token) {
    console.log("connexion ok");

    const body = document.querySelector("body");

    const modeEdition = document.createElement("section");
    modeEdition.classList.add("modeEdition");

    const icon = document.createElement("i");
    icon.classList.add("fa-solid", "fa-pen-to-square");

    const text = document.createElement("span");
    text.textContent = "Mode édition";

    modeEdition.appendChild(icon);
    modeEdition.appendChild(text);
    body.prepend(modeEdition);

    const loginLogout = document.querySelector("nav ul li a");
    if (loginLogout) {
      loginLogout.textContent = "logout";

      loginLogout.addEventListener("click", (e) => {
        e.preventDefault();
        // Suppression du token pour déconnecter l'utilisateur
        localStorage.removeItem("token");
        window.location.reload();
      });
    }

    const filters = document.querySelector(".filter");
if (filters) filters.style.display = "none";

const portfolioTitle = document.querySelector("#portfolio h2");

if (portfolioTitle) {

  const modifierIcon = document.createElement("div");
  modifierIcon.classList.add("modifierIcon");

  const iconModifier = document.createElement("i");
  iconModifier.classList.add("fa-solid", "fa-pen-to-square");

  const btn = document.createElement("button");
  btn.textContent = "modifier";
  btn.classList.add("portfolioBtn");

  // on met bouton + icône dans le même bloc
  modifierIcon.appendChild(iconModifier);
  modifierIcon.appendChild(btn);

  portfolioTitle.parentElement.appendChild(modifierIcon);

  btn.addEventListener("click", openModale);
}}}
/**------------------------------------------------------------------------------------------
--------------------------------MODALE--------------------------------------*/
// Ouvre la modale et affiche la galerie des projets
function openModale() {
  const modal = document.querySelector(".modal");
  modal.classList.remove("hidden");
  displayModalGallery(allWorks);
}

function closeModale() {
  document.querySelector(".modal").classList.add("hidden");
}

const closeBtn = document.querySelector(".xmark");
if (closeBtn) closeBtn.addEventListener("click", closeModale);

const modal = document.querySelector(".modal");
if (modal) {
  modal.addEventListener("click", (e) => {
    if (e.target === modal) closeModale();
  });
}

/**------------------------------------------------------------------------------------------
--------------------------------GALERIE MODALE + SUPPRESSION--------------------------------------*/
// Affiche les projets dans la modale avec option de suppression
function displayModalGallery(works) {
  const gallery = document.querySelector(".modal-gallery-container");
  gallery.innerHTML = "";

  works.forEach(work => {
    const figure = document.createElement("figure");
    figure.dataset.id = work.id;

    const img = document.createElement("img");
    img.src = work.imageUrl;

    const trash = document.createElement("i");
    trash.classList.add("fa-solid", "fa-trash-can");

    trash.addEventListener("click", async () => {
      const token = localStorage.getItem("token");
      const workId = work.id;

      if (!token) return alert("Non autorisé");
      // Envoi d'une requête DELETE pour supprimer un projet
      const response = await fetch(`http://localhost:5678/api/works/${workId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.ok) {
        allWorks = allWorks.filter(w => w.id !== workId);
        displayWorks(allWorks);
        displayModalGallery(allWorks);
      }
    });

    figure.appendChild(img);
    figure.appendChild(trash);
    gallery.appendChild(figure);
  });
}

/**------------------------------------------------------------------------------------------
--------------------------------FORMULAIRE--------------------------------------*/
// Affiche le formulaire d'ajout de projet
function displayForm() {
  document.querySelector(".modal-form").classList.remove("hidden");
  document.querySelector(".modal-gallery").classList.add("hidden");
  document.querySelector(".arrow-left").classList.remove("hidden");

  loadCategories();
}

function displayGallery() {
  document.querySelector(".modal-form").classList.add("hidden");
  document.querySelector(".modal-gallery").classList.remove("hidden");
  document.querySelector(".arrow-left").classList.add("hidden");
}

const addPhotoBtn = document.querySelector(".addPhoto");
if (addPhotoBtn) addPhotoBtn.addEventListener("click", displayForm);

const arrowLeftBtn = document.querySelector(".arrow-left");
if (arrowLeftBtn) arrowLeftBtn.addEventListener("click", displayGallery);

/**------------------------------------------------------------------------------------------
--------------------------------CATEGORIES--------------------------------------*/
// Charge les catégories dans le menu déroulant du formulaire
function loadCategories() {
  fetch("http://localhost:5678/api/categories")
    .then(res => res.json())
    .then(categories => {
      const select = document.querySelector("#category");
      select.innerHTML = "";

      categories.forEach(cat => {
        const option = document.createElement("option");
        option.value = cat.id;
        option.textContent = cat.name;
        select.appendChild(option);
      });
    });
}

/**------------------------------------------------------------------------------------------
--------------------------------PREVIEW IMAGE--------------------------------------*/
// Affiche un aperçu de l'image sélectionnée dans le formulaire
const imageInput = document.querySelector("#imageInput");
const preview = document.querySelector("#preview");

if (imageInput && preview) {
  imageInput.addEventListener("change", (e) => {
    const file = e.target.files[0];

    if (file) {
      preview.src = URL.createObjectURL(file);
      preview.classList.remove("hidden");

      const icon = document.querySelector(".upload-container i");
      const btn = document.querySelector(".upload-btn");
      const text = document.querySelector(".upload-container p");

      if (icon) icon.style.display = "none";
      if (btn) btn.style.display = "none";
      if (text) text.style.display = "none";
    }
  });
}
/**------------------------------------------------------------------------------------------
--------------------------------SUBMIT FORMULAIRE--------------------------------------*/
const form = document.querySelector("#add-project-form");

if (form) {
  // Envoi du nouveau projet à l'API lors de la soumission du formulaire
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");

    //Vérification si utilisateur connecté
    if (!token) {
      alert("Tu dois te connecter avant d'ajouter un projet !");
      return;
    }

    const imageInput = document.querySelector("#imageInput");
    const titleInput = document.querySelector("#title");
    const categorySelect = document.querySelector("#category");

    const image = imageInput?.files[0];
    const title = titleInput?.value;
    const category = categorySelect?.value;

    //Vérification des champs
    if (!image || !title || !category) {
      alert("Tous les champs sont obligatoires !");
      return;
    }

    const formData = new FormData();
    formData.append("image", image);
    formData.append("title", title);
    formData.append("category", Number(category));

    try {
      const response = await fetch("http://localhost:5678/api/works", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token.trim()}`
        },
        body: formData
      });

      if (!response.ok) {
        if (response.status === 401) {
          alert("Token invalide ou expiré. Connecte-toi à nouveau !");
          return;
        }
        const errorText = await response.text();
        console.error("Erreur API :", errorText);
        alert("Erreur lors de l'ajout du projet !");
        return;
      }

      const newWork = await response.json();
      allWorks.push(newWork);
      displayWorks(allWorks);
      displayModalGallery(allWorks);

      form.reset();
      document.querySelector("#preview")?.classList.add("hidden");
      displayGallery();

      alert("Projet ajouté avec succès !");

    } catch (error) {
      console.error("Erreur réseau :", error);
      alert("Erreur réseau !");
    }
  });
}
// Vérifie que tous les champs sont remplis pour activer le bouton de validation du formulaire
function checkFormValidity() {
  const image = document.querySelector("#imageInput")?.files[0];
  const title = document.querySelector("#title")?.value.trim();
  const category = document.querySelector("#category")?.value;

  const button = document.querySelector(".addPhoto-container-valider button");

  if (!button) return;

  if (image && title && category) {
    // bouton actif
    button.style.backgroundColor = "#1D6154";
    button.disabled = false;
  } else {
    // bouton désactivé
    button.style.backgroundColor = "#CBD6DC";
    button.disabled = true;
  }
}

imageInput?.addEventListener("change", checkFormValidity);
document.querySelector("#title")?.addEventListener("input", checkFormValidity);
document.querySelector("#category")?.addEventListener("change", checkFormValidity);