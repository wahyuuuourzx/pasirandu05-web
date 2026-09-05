const menuToggle = document.querySelector('.menu-toggle');
const nav = document.querySelector('#nav');
menuToggle?.addEventListener('click', () => nav.classList.toggle('open'));
document.querySelectorAll('.nav a').forEach(a => a.addEventListener('click', () => nav.classList.remove('open')));
const modal = document.querySelector('#qrisModal');
const trigger = document.querySelector('#qrisTrigger');
function closeModal() { modal.classList.remove('open'); modal.setAttribute('aria-hidden', 'true'); document.body.style.overflow = ''; }
trigger?.addEventListener('click', () => { modal.classList.add('open'); modal.setAttribute('aria-hidden', 'false'); document.body.style.overflow = 'hidden'; });
modal?.querySelectorAll('[data-close]').forEach(el => el.addEventListener('click', closeModal));
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal() });
/* =========================
   SUPABASE
========================= */

const SUPABASE_URL =
  "https://agydrlnteennnhwdjati.supabase.co";

const SUPABASE_KEY =
  "sb_publishable_iHJcEwwMdpL9gIG57pDHoQ_1x-v1GjM";

const supabaseClient =
  window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_KEY
  );


/* =========================
   CONTACT FORM
========================= */

const contactForm =
  document.getElementById("contactForm");


if (contactForm) {

  contactForm.addEventListener(
    "submit",
    async function (event) {

      event.preventDefault();


      const nama =
        document
          .getElementById("contactNama")
          .value
          .trim();


      const email =
        document
          .getElementById("contactEmail")
          .value
          .trim();


      const pesan =
        document
          .getElementById("contactPesan")
          .value
          .trim();


      if (!nama || !email || !pesan) {

        alert(
          "Silakan lengkapi semua data."
        );

        return;

      }


      const submitButton =
        contactForm.querySelector(
          "button[type='submit']"
        );


      submitButton.disabled = true;

      submitButton.innerHTML =
        "Mengirim...";


      try {

        const { error } =
          await supabaseClient
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

          console.error(
            "Supabase Error:",
            error
          );

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

        console.error(error);

        alert(
          "Terjadi kesalahan saat mengirim pesan."
        );


      } finally {

        submitButton.disabled = false;

        submitButton.innerHTML =
          "Kirim Pesan <span>→</span>";

      }

    }
  );

}