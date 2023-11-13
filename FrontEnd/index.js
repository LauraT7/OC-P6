
const filtersContainer = document.querySelector(".filter");
const galleryContainer = document.querySelector(".gallery");
let currentCategory = null;
export let categories = [];
export let galleryWorks = [];
export let selectedId = null; //variable pour stocker l'ID sélectionné

async function createFilters() {
  // API fetch
  const response = await fetch("http://localhost:5678/api/categories");
  const categories = await response.json();

  // Création des boutons
  const generateFilter = (elements) => {
    // Création du bouton "Tous"
    const buttonAll = document.createElement("button");
    buttonAll.innerHTML = "Tous";
    filtersContainer.appendChild(buttonAll);

    // Création des autres boutons à partir des noms des éléments
    for (let i in elements) {
      const button = document.createElement("button");
      button.innerHTML = elements[i].name;
      filtersContainer.appendChild(button);

      button.addEventListener("click", () => {
        filterGallery(elements[i].id); // Utilisat° de l'ID de la cat
      });
    }

    // EL au clic sur le btn tous
    buttonAll.addEventListener("click", () => {
      filterGallery(null); // Utilisat° de null pour afficher tous les éléments
    });
  };

  generateFilter(categories);
}

function filterGallery(categoryId) {
  currentCategory = categoryId;
  createGalleryHTML();
}

export async function createGalleryHTML() {
  // API Fetch
  const response = await fetch("http://localhost:5678/api/works");
  const galleryWorks = await response.json();

  // Supp des éléments dans la galerie
  galleryContainer.innerHTML = "";

  // Créa des éléments -> des données récup avec l'API fetch
  for (let i = 0; i < galleryWorks.length; i++) {
    if (currentCategory === null || galleryWorks[i].categoryId === currentCategory) {
      const project = document.createElement("figure");
      const projectImage = document.createElement("img");
      projectImage.src = galleryWorks[i].imageUrl;

      const projectTagline = document.createElement("figcaption");
      projectTagline.innerText = galleryWorks[i].title;

      //stock l'ID dans l'élément du projet
      project.dataset.id = galleryWorks[i].id;

      //EL clic pour chaque projet afin de stocker l'ID lorsqu'il est select
      project.addEventListener('click', () => {
        selectedId = project.dataset.id;
        console.log('Selected ID:', selectedId);
        
      });

      galleryContainer.appendChild(project);
      project.appendChild(projectImage);
      project.appendChild(projectTagline);
    }
  }
}

createFilters();
createGalleryHTML();
