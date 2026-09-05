const SUPABASE_URL = "https://agydrlnteennnhwdjati.supabase.co";

const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFneWRybG50ZWVubm5od2RqYXRpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODg1MTcxNjQsImV4cCI6MjEwNDA5MzE2NH0.U89OxY4rzAqHYyfrnd_-KonAiLfEDTk3Ih8hvwUGC-M";

const supabaseClient = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_KEY
);

const loginForm = document.getElementById("loginForm");
const errorMessage = document.getElementById("errorMessage");

loginForm.addEventListener("submit", async function (event) {
    event.preventDefault();

    const email = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value.trim();

    errorMessage.textContent = "";

    const submitButton = loginForm.querySelector("button[type='submit']");

    submitButton.disabled = true;
    submitButton.textContent = "Memproses...";

    const { data, error } = await supabaseClient.auth.signInWithPassword({
        email: email,
        password: password
    });

    if (error) {
        console.error(error);

        errorMessage.textContent =
            "Email atau password salah.";

        submitButton.disabled = false;
        submitButton.textContent = "Login";

        return;
    }

    localStorage.setItem("adminLogin", "true");

    window.location.href = "./dashboard.html";
});