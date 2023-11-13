import { createGalleryHTML } from './index.js';

const bannere = document.querySelector(".edit-banner");
const modalMain = document.querySelector(".modal-main");
const closeBtn = document.querySelector(".close-btn");
const galleryContainer = document.querySelector(".miniatures-gallery");
let currentCategory = null;

document.addEventListener("DOMContentLoaded", function () {
    const banniereToShow = document.querySelectorAll(".appear");
    const filterElement = document.querySelector('.filter');
    const isLoggedIn = sessionStorage.getItem("isLoggedIn");
    const loginLink = document.getElementById("loginLink");

    if (isLoggedIn === "true") {
        console.log("connecté");

        banniereToShow.forEach(element => {
            element.style.display = 'flex';
            filterElement.style.display = 'none';
        });

        const modifierText = document.querySelector(".projets-modif p");
        modifierText.style.display = 'block';

        if (loginLink) {
            const logoutLink = document.createElement("a");
            logoutLink.href = "#";
            logoutLink.textContent = "logout";
            logoutLink.addEventListener("click", logout);
            loginLink.innerHTML = "";
            loginLink.appendChild(logoutLink);
        }
    }
});

const modifierText = document.querySelector(".projets-modif p");
showModal(modifierText);

const penIcon = document.querySelector(".projets-modif i");
showModal(penIcon);

function showModal(element) {
    element.addEventListener('click', function () {
        if (element === closeBtn) {
            modalMain.style.display = 'none';
        } else {
            modalMain.style.display = 'flex';
            createGalleryMini();
        }
    });
}

showModal(bannere);
showModal(closeBtn);

async function createGalleryMini() {
    const response = await fetch("http://localhost:5678/api/works");
    const galleryWorks = await response.json();

    galleryContainer.innerHTML = "";

    for (let i = 0; i < galleryWorks.length; i++) {
        if (currentCategory === null || galleryWorks[i].categoryId === currentCategory) {
            const project = document.createElement("figure");
            const projectImage = document.createElement("img");
            const iconTrashCan = document.createElement("i");

            projectImage.src = galleryWorks[i].imageUrl;
            iconTrashCan.classList.add("fas", "fa-solid", "fa-trash-can");

            iconTrashCan.addEventListener('click', function () {
                const confirmation = confirm("Voulez-vous vraiment supprimer cette image ?");

                if (confirmation) {
                    const projectId = galleryWorks[i].id;
                    const accessToken = sessionStorage.getItem('accessToken');

                    if (!accessToken) {
                        console.error("Jet d'accès manquant. L'utilisateur doit être authentifié.");
                        return;
                    }

                    fetch(`http://localhost:5678/api/works/${projectId}`, {
                        method: "DELETE",
                        headers: {
                            "Authorization": `Bearer ${accessToken}`,
                        },
                    })
                        .then(response => {
                            if (response.ok) {
                                project.remove();
                                createGalleryHTML();
                            } else {
                                console.error("Erreur lors de la suppression de l'image.");
                            }
                        })
                        .catch(error => {
                            console.error("Erreur lors de la requête fetch DELETE :", error);
                        });
                }
            });

            galleryContainer.appendChild(project);
            project.appendChild(projectImage);
            project.appendChild(iconTrashCan);
        }
    }
}

const modalAdd = document.querySelector(".modal-add");
const addPhotoBtn = document.getElementById("add-photo-btn");

addPhotoBtn.addEventListener('click', function () {
    modalAdd.classList.add("show-modal");
});

const arrowLeftBtn = document.querySelector(".fa-arrow-left");
arrowLeftBtn.addEventListener('click', function () {
    modalAdd.classList.remove("show-modal");
});

const closeBtns = document.querySelectorAll(".fa-xmark");
closeBtns.forEach((closeBtn) => {
    closeBtn.addEventListener('click', function () {
        modalAdd.classList.remove("show-modal");
        modalMain.style.display = 'none';
    });
});

const fileInput = document.getElementById("add-file");
const addFileZone = document.querySelector(".add-file-zone");
let imageFile = null;

fileInput.addEventListener('change', function () {
    while (addFileZone.firstChild) {
        addFileZone.removeChild(addFileZone.firstChild);
    }

    if (fileInput.files.length > 0) {
        const selectedFile = fileInput.files[0];
        imageFile = selectedFile;

        const reader = new FileReader();
        reader.onload = function (e) {
            const thumbnail = document.createElement("img");
            thumbnail.classList.add("thumbnail");
            thumbnail.src = e.target.result;
            addFileZone.appendChild(thumbnail);
            addFileZone.classList.add("image-present");
        };
        reader.readAsDataURL(selectedFile);
    } else {
        addFileZone.classList.remove("image-present");
    }
});

document.addEventListener("DOMContentLoaded", function () {
    fetch("http://localhost:5678/api/categories")
        .then(response => response.json())
        .then(categories => {
            var categoriesSelect = document.getElementById("file-categories");

            categories.forEach(function (category) {
                var option = document.createElement("option");
                option.value = category.id;
                option.textContent = category.name;
                categoriesSelect.appendChild(option);
            });
        })
        .catch(error => {
            console.error("Erreur lors de la récupération des catégories :", error);
        });
});

const addForm = document.querySelector(".add-form");

addForm.addEventListener('submit', function (event) {
    event.preventDefault();

    const title = document.getElementById("file-title").value;
    const category = document.getElementById("file-categories").value;

    if (!title || !category || !imageFile) {
        const errorChamp = document.querySelector(".errorChamp");
        errorChamp.textContent = "Veuillez sélectionner un titre, une catégorie et une image.";
    } else {
        const errorChamp = document.querySelector(".errorChamp");
        errorChamp.textContent = "";

        const formData = new FormData();
        formData.append("image", imageFile);
        formData.append("title", title);
        formData.append("category", category);

        const accessToken = sessionStorage.getItem('accessToken');

        fetch("http://localhost:5678/api/works", {
            method: "POST",
            body: formData,
            headers: {
                "Authorization": `Bearer ${accessToken}`,
            },
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Erreur : ${response.status} - ${response.statusText}`);
                }
                return response.json();
            })
            .then(data => {
                console.log("Réponse de l'API :", data);
                createGalleryHTML();
                modalAdd.classList.remove("show-modal");
            })
            .catch(error => {
                console.error("Erreur lors de la requête fetch :", error);
            });
    }
});

window.addEventListener('click', function (event) {
    if (event.target === modalMain) {
        modalMain.style.display = 'none';
    }
});

function logout() {
    sessionStorage.removeItem("isLoggedIn");
    sessionStorage.removeItem("accessToken");

    window.location.reload();
}
