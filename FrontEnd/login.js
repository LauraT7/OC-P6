
const tokenWrapper = async (user) => {
    try {
        const response = await fetch("http://localhost:5678/api/users/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(user),
        });

        return response;
    } catch (error) {
        console.error(error);
    }
};

document.addEventListener("DOMContentLoaded", () => {
    const email = document.getElementById("email");
    const password = document.getElementById("password");
    const submitBtn = document.querySelector(".login-boutton");
    const loginError = document.querySelector(".login-error");

    email.addEventListener("input", (e) => {
        const emailInput = e.target.value;
    });

    password.addEventListener("input", (e) => {
        const passwordInput = e.target.value;
    });

    submitBtn.addEventListener("click", async (e) => {
        e.preventDefault();

        const emailInput = email.value;
        const passwordInput = password.value;

        const responseForLogin = await tokenWrapper({ "email": emailInput, "password": passwordInput });

        if (!responseForLogin.ok || !emailInput || !passwordInput) {
            loginError.innerHTML = `Erreur dans l’identifiant ou le mot de passe`;
        } else {
            const userOnline = await responseForLogin.json();

            sessionStorage.setItem("userOnline", JSON.stringify(userOnline));
            sessionStorage.setItem("accessToken", userOnline.token);
            sessionStorage.setItem("isLoggedIn", "true");

            document.dispatchEvent(new CustomEvent('loginSuccess', { detail: { accessToken: userOnline.token } }));
            
            window.location.href = "/index.html";
        }
    });
});
