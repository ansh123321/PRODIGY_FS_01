const profileSection = document.querySelector(".profile-section");
const profileResult = document.getElementById("profileResult");
const authCards = document.querySelectorAll(".auth-card");

function showMessage(element, message, type) {
    element.textContent = message;
    element.className = `message ${type}`;
}

function showAuthenticatedUI() {
    authCards.forEach((card) => {
        card.style.display = "none";
    });

    profileSection.style.display = "block";
}

function showLoggedOutUI() {
    authCards.forEach((card) => {
        card.style.display = "";
    });

    profileSection.style.display = "none";
}


profileSection.style.display = "none";

const registrationForm = document.getElementById("registrationForm")

registrationForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const submitButton = registrationForm.querySelector("button[type='submit']");

    submitButton.disabled = true;
    submitButton.textContent = "Creating account....";

    const name = document.getElementById("registrationName").value;
    const email = document.getElementById("registrationEmail").value;
    const password = document.getElementById("registrationPassword").value;
    const confirmPassword = document.getElementById("registrationConfirmPassword").value;

    if (password !== confirmPassword) {
        showMessage(
            document.getElementById("registrationMessage"),
            "Passwords do not match",
            "error"
        );

        submitButton.disabled = false;
        submitButton.textContent = "Create account";

        return;
    }
    
    try {
        const response = await fetch(
            "http://localhost:5000/api/auth/register",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    name,
                    email,
                    password,
                    confirmPassword
                })
            }
        );

        const data = await response.json();

        const registrationMessage =
            document.getElementById("registrationMessage");

        showMessage(
            registrationMessage,
            data.message,
            response.ok ? "success" : "error"
        );

        if (response.ok) {
            registrationForm.reset();
        }

    } catch (error) {

        console.error("Registration request failed:", error);

        showMessage(
            document.getElementById("registrationMessage"),
            "Unable to connect to server",
            "error"
        );

    } finally {

        submitButton.disabled = false;
        submitButton.textContent = "Create account";
    }
});

const loginForm = document.getElementById("loginForm");

loginForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const submitButton = loginForm.querySelector("button[type='submit']");

    submitButton.disabled = true;
    submitButton.textContent = "Signing in...";

    const email = document.getElementById("loginEmail").value;
    const password = document.getElementById("loginPassword").value;

    try {
        const response = await fetch(
            "http://localhost:5000/api/auth/login",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    email,
                    password
                })
            }
        );

        const data = await response.json();

        const loginMessage =
            document.getElementById("loginMessage");

        showMessage(
            loginMessage,
            data.message,
            response.ok ? "success" : "error"
        );

        if (response.ok) {
            localStorage.setItem("token", data.token);

            loginForm.reset();

            showAuthenticatedUI();
        }

    } catch (error) {

        console.error("Login request failed:", error);

        showMessage(
            document.getElementById("loginMessage"),
            "Unable to connect to server",
            "error"
        );

    } finally {

        submitButton.disabled = false;
        submitButton.textContent = "Sign in";
    }
});

const profileButton = document.getElementById("profileButton");

profileButton.addEventListener("click", async () => {

    const storedToken = localStorage.getItem("token");

    if (!storedToken) {
        profileResult.textContent = "Please login first";
        return;
    }

    const token = storedToken.replace(/^Bearer\s+/i, "");

    profileButton.disabled = true;
    profileButton.textContent = "Refreshing...";

    try {
        const response = await fetch(
            "http://localhost:5000/api/auth/profile",
            {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            }
        );

        const data = await response.json();

        if (!response.ok) {

            if (response.status === 401) {
                localStorage.removeItem("token");
                showLoggedOutUI();

                showMessage(
                    document.getElementById("loginMessage"),
                    "Session expired. Please login again.",
                    "error"
                );

                return;
            }

            profileResult.textContent = data.message;
            return;
        }

        document.getElementById("profileName").textContent =
            data.user.name;

        document.getElementById("profileEmail").textContent =
            data.user.email;

        document.getElementById("profileAvatar").textContent =
            data.user.name.charAt(0).toUpperCase();

        profileResult.textContent = "";

    } catch (error) {

        console.error("Profile request failed:", error);

        profileResult.textContent =
            "Unable to connect to server";

    } finally {

        profileButton.disabled = false;
        profileButton.textContent = "Refresh Profile";
    }
});

const logoutButton = document.getElementById("logoutButton");

logoutButton.addEventListener("click", () => {
    localStorage.removeItem("token");

    showLoggedOutUI();

    profileResult.textContent = "";
});



const passwordToggles = document.querySelectorAll(".password-toggle");

passwordToggles.forEach((button) => {
    button.addEventListener("click", function (event) {
        event.preventDefault();

        const inputId = this.dataset.target;
        const passwordInput = document.getElementById(inputId);
        const eyeIcon = this.querySelector(".eye-icon");

        if (passwordInput.type === "password") {
            passwordInput.type = "text";
            eyeIcon.classList.add("visible");

            this.setAttribute("aria-label", "Hide password");
        } else {
            passwordInput.type = "password";
            eyeIcon.classList.remove("visible");

            this.setAttribute("aria-label", "Show password");
        }
    });
});


const existingToken = localStorage.getItem("token");

if(existingToken) {
    showAuthenticatedUI();

    profileButton.click();
}else {
    showLoggedOutUI();
}