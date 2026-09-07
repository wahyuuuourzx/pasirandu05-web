/* ========================================
   MOBILE MENU
======================================== */

const menuToggle = document.querySelector(".menu-toggle");
const nav = document.querySelector("#nav");

if (menuToggle && nav) {
    menuToggle.addEventListener("click", () => {
        nav.classList.toggle("open");
    });
}

document.querySelectorAll(".nav a").forEach((link) => {
    link.addEventListener("click", () => {
        nav?.classList.remove("open");
    });
});


/* ========================================
   QRIS MODAL
======================================== */

const modal = document.querySelector("#qrisModal");
const trigger = document.querySelector("#qrisTrigger");

function closeModal() {
    if (!modal) return;

    modal.classList.remove("open");
    modal.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
}

if (trigger && modal) {
    trigger.addEventListener("click", () => {
        modal.classList.add("open");
        modal.setAttribute("aria-hidden", "false");
        document.body.style.overflow = "hidden";
    });
}

if (modal) {
    modal.querySelectorAll("[data-close]").forEach((element) => {
        element.addEventListener("click", closeModal);
    });
}

document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
        closeModal();
    }
});


/* ========================================
   SUPABASE
======================================== */

const SUPABASE_URL =
    "https://agydrlnteennnhwdjati.supabase.co";

const SUPABASE_KEY =
    "sb_publishable_iHJcEwwMdpL9gIG57pDHoQ_1x-v1GjM";

const supabaseClient = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_KEY
);


/* ========================================
   CONTACT FORM
======================================== */

const contactForm = document.getElementById("contactForm");

if (contactForm) {
    contactForm.addEventListener("submit", async (event) => {
        event.preventDefault();

        const namaInput = document.getElementById("contactNama");
        const emailInput = document.getElementById("contactEmail");
        const pesanInput = document.getElementById("contactPesan");

        const nama = namaInput?.value.trim() || "";
        const email = emailInput?.value.trim() || "";
        const pesan = pesanInput?.value.trim() || "";

        /* Validasi */
        if (!nama || !email || !pesan) {
            alert("Silakan lengkapi semua data.");
            return;
        }

        /* Tombol submit */
        const submitButton = contactForm.querySelector(
            "button[type='submit']"
        );

        if (submitButton) {
            submitButton.disabled = true;
            submitButton.innerHTML = "Mengirim...";
        }

        try {
            const { error } = await supabaseClient
                .from("pesan")
                .insert([
                    {
                        nama: nama,
                        email: email,
                        pesan: pesan,
                        dibaca: false
                    }
                ]);

            if (error) {
                console.error("Supabase Error:", error);

                alert(
                    "Pesan gagal dikirim. Silakan coba lagi."
                );

                return;
            }

            alert(
                "Pesan berhasil dikirim. Terima kasih!"
            );

            contactForm.reset();

        } catch (error) {
            console.error("Error:", error);

            alert(
                "Terjadi kesalahan saat mengirim pesan."
            );

        } finally {
            if (submitButton) {
                submitButton.disabled = false;

                submitButton.innerHTML =
                    'Kirim Pesan <span>→</span>';
            }
        }
    });
}