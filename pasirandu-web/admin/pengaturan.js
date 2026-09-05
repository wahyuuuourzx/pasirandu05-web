// =========================
// SUPABASE
// =========================

const SUPABASE_URL =
    "https://agydrlnteennnhwdjati.supabase.co";

const SUPABASE_KEY =
    "sb_publishable_iHJcEwwMdpL9gIG57pDHoQ_1x-v1GjM";

const supabaseClient =
    window.supabase.createClient(
        SUPABASE_URL,
        SUPABASE_KEY
    );


// =========================
// TAMPILKAN EMAIL ADMIN
// =========================

async function loadAccount() {

    const {
        data: { session },
        error
    } = await supabaseClient.auth.getSession();

    if (error) {

        console.error(
            "Session Error:",
            error
        );

        return;
    }

    if (!session) {

        window.location.href =
            "./login.html";

        return;
    }

    const emailElement =
        document.getElementById("adminEmail");

    if (emailElement) {

        emailElement.textContent =
            session.user.email || "-";
    }
}


// =========================
// GANTI PASSWORD
// =========================

const passwordForm =
    document.getElementById("passwordForm");


passwordForm?.addEventListener(
    "submit",
    async function (event) {

        event.preventDefault();


        const newPassword =
            document.getElementById(
                "newPassword"
            )?.value || "";


        const confirmPassword =
            document.getElementById(
                "confirmPassword"
            )?.value || "";


        const button =
            document.getElementById(
                "passwordBtn"
            );


        // Validasi password

        if (newPassword.length < 6) {

            alert(
                "Password minimal 6 karakter."
            );

            return;
        }


        if (
            newPassword !==
            confirmPassword
        ) {

            alert(
                "Konfirmasi password tidak sama."
            );

            return;
        }


        if (button) {

            button.disabled = true;

            button.textContent =
                "Menyimpan...";
        }


        try {

            const { error } =
                await supabaseClient.auth.updateUser({
                    password: newPassword
                });


            if (error) {

                console.error(
                    "Password Error:",
                    error
                );

                alert(
                    "Password gagal diubah: " +
                    error.message
                );

                return;
            }


            alert(
                "Password berhasil diubah."
            );


            passwordForm.reset();


        } catch (error) {

            console.error(
                "Password Error:",
                error
            );

            alert(
                "Terjadi kesalahan saat mengubah password."
            );


        } finally {

            if (button) {

                button.disabled = false;

                button.textContent =
                    "Simpan Password";
            }
        }
    }
);


// =========================
// LOGOUT
// =========================

async function logout() {

    const confirmed =
        confirm(
            "Yakin ingin logout?"
        );


    if (!confirmed) return;


    const { error } =
        await supabaseClient.auth.signOut();


    if (error) {

        console.error(
            "Logout Error:",
            error
        );
    }


    localStorage.removeItem(
        "adminLogin"
    );


    window.location.href =
        "./login.html";
}


// Tombol logout 1

document
    .getElementById("logoutBtn")
    ?.addEventListener(
        "click",
        logout
    );


// Tombol logout 2

document
    .getElementById("logoutBtn2")
    ?.addEventListener(
        "click",
        logout
    );


// =========================
// START
// =========================

loadAccount();