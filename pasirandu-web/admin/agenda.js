// ===============================
// SUPABASE
// ===============================

const SUPABASE_URL =
    "https://agydrlnteennnhwdjati.supabase.co";

const SUPABASE_KEY =
    "sb_publishable_iHJcEwwMdpL9gIG57pDHoQ_1x-v1GjM";

const supabaseClient =
    window.supabase.createClient(
        SUPABASE_URL,
        SUPABASE_KEY
    );


// ===============================
// ELEMENT
// ===============================

const agendaList =
    document.getElementById("agendaList");

const totalAgenda =
    document.getElementById("totalAgenda");

const searchInput =
    document.getElementById("searchInput");

const addAgendaBtn =
    document.getElementById("addAgendaBtn");

const agendaModal =
    document.getElementById("agendaModal");

const agendaForm =
    document.getElementById("agendaForm");

const closeModal =
    document.getElementById("closeModal");

const cancelBtn =
    document.getElementById("cancelBtn");

const agendaIndex =
    document.getElementById("agendaIndex");

const judulInput =
    document.getElementById("judul");

const tanggalInput =
    document.getElementById("tanggal");

const waktuInput =
    document.getElementById("waktu");

const lokasiInput =
    document.getElementById("lokasi");

const deskripsiInput =
    document.getElementById("deskripsi");

const modalTitle =
    document.getElementById("modalTitle");

const logoutBtn =
    document.getElementById("logoutBtn");


// ===============================
// DATA
// ===============================

let agendaData = [];


// ===============================
// ESCAPE HTML
// ===============================

function escapeHTML(text) {

    if (!text) return "";

    return String(text)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");

}


// ===============================
// FORMAT TANGGAL
// ===============================

function getDateParts(dateString) {

    if (!dateString) {

        return {
            day: "-",
            month: "-"
        };

    }

    const date =
        new Date(dateString + "T00:00:00");

    return {

        day: date.toLocaleDateString(
            "id-ID",
            {
                day: "2-digit"
            }
        ),

        month: date.toLocaleDateString(
            "id-ID",
            {
                month: "short"
            }
        )

    };

}


// ===============================
// FORMAT TANGGAL LENGKAP
// ===============================

function formatDate(dateString) {

    if (!dateString) return "-";

    const date =
        new Date(dateString + "T00:00:00");

    return date.toLocaleDateString(
        "id-ID",
        {
            day: "2-digit",
            month: "long",
            year: "numeric"
        }
    );

}


// ===============================
// LOAD DATA SUPABASE
// ===============================

async function loadAgenda() {

    const {
        data,
        error
    } = await supabaseClient
        .from("agenda")
        .select("*")
        .order(
            "created_at",
            {
                ascending: false
            }
        );

    if (error) {

        console.error(
            "Gagal mengambil agenda:",
            error
        );

        alert(
            "Gagal mengambil data agenda dari Supabase."
        );

        return;

    }

    agendaData = data || [];

    renderAgenda();

}


// ===============================
// RENDER
// ===============================

function renderAgenda(keyword = "") {

    agendaList.innerHTML = "";

    const search =
        keyword.toLowerCase().trim();

    const filteredData =
        agendaData.filter(item => {

            return (

                (item.judul || "")
                    .toLowerCase()
                    .includes(search)

                ||

                (item.lokasi || "")
                    .toLowerCase()
                    .includes(search)

                ||

                (item.deskripsi || "")
                    .toLowerCase()
                    .includes(search)

            );

        });


    totalAgenda.textContent =
        agendaData.length;


    if (filteredData.length === 0) {

        agendaList.innerHTML = `

            <div class="empty-state">

                <div class="empty-icon">
                    📋
                </div>

                <h3>
                    Belum ada agenda
                </h3>

                <p>
                    Tambahkan agenda Pasirandu 05.
                </p>

            </div>

        `;

        return;

    }


    filteredData.forEach(item => {

        const dateParts =
            getDateParts(item.tanggal);


        const agendaItem =
            document.createElement("div");


        agendaItem.className =
            "agenda-item";


        agendaItem.innerHTML = `

            <div class="agenda-date">

                <div class="day">
                    ${dateParts.day}
                </div>

                <div class="month">
                    ${dateParts.month}
                </div>

            </div>


            <div class="agenda-info">

                <h3>
                    ${escapeHTML(item.judul)}
                </h3>


                <div class="agenda-description">

                    ${escapeHTML(
                        item.deskripsi ||
                        "Tidak ada deskripsi."
                    )}

                </div>


                <div class="agenda-meta">

                    <span>
                        📅 ${formatDate(item.tanggal)}
                    </span>

                    <span>
                        ⏰ ${escapeHTML(
                            item.waktu || "-"
                        )}
                    </span>

                    <span>
                        📍 ${escapeHTML(
                            item.lokasi || "-"
                        )}
                    </span>

                </div>

            </div>


            <div class="agenda-actions">

                <button
                    class="edit-btn"
                    onclick="editAgenda('${item.id}')"
                >
                    Edit
                </button>


                <button
                    class="delete-btn"
                    onclick="deleteAgenda('${item.id}')"
                >
                    Hapus
                </button>

            </div>

        `;


        agendaList.appendChild(
            agendaItem
        );

    });

}


// ===============================
// BUKA MODAL TAMBAH
// ===============================

addAgendaBtn.addEventListener(
    "click",
    function () {

        agendaForm.reset();

        agendaIndex.value = "";

        modalTitle.textContent =
            "Tambah Agenda";

        agendaModal.classList.add(
            "show"
        );

    }
);


// ===============================
// TUTUP MODAL
// ===============================

function closeAgendaModal() {

    agendaModal.classList.remove(
        "show"
    );

    agendaForm.reset();

    agendaIndex.value = "";

}


closeModal.addEventListener(
    "click",
    closeAgendaModal
);


cancelBtn.addEventListener(
    "click",
    closeAgendaModal
);


agendaModal.addEventListener(
    "click",
    function (event) {

        if (
            event.target === agendaModal
        ) {

            closeAgendaModal();

        }

    }
);


// ===============================
// SUBMIT FORM
// ===============================

agendaForm.addEventListener(
    "submit",
    async function (event) {

        event.preventDefault();


        const judul =
            judulInput.value.trim();

        const tanggal =
            tanggalInput.value;

        const waktu =
            waktuInput.value;

        const lokasi =
            lokasiInput.value.trim();

        const deskripsi =
            deskripsiInput.value.trim();


        // ===========================
        // VALIDASI
        // ===========================

        if (!judul) {

            alert(
                "Judul agenda wajib diisi."
            );

            judulInput.focus();

            return;

        }


        // ===========================
        // DATA
        // ===========================

        const data = {

            judul: judul,

            tanggal:
                tanggal || null,

            waktu:
                waktu || null,

            lokasi:
                lokasi || null,

            deskripsi:
                deskripsi || null

        };


        const id =
            agendaIndex.value;


        // ===========================
        // EDIT
        // ===========================

        if (id) {

            const {
                error
            } = await supabaseClient
                .from("agenda")
                .update(data)
                .eq("id", id);


            if (error) {

                console.error(
                    "Gagal edit agenda:",
                    error
                );

                alert(
                    "Gagal mengubah agenda."
                );

                return;

            }


            alert(
                "Agenda berhasil diubah."
            );

        }


        // ===========================
        // TAMBAH
        // ===========================

        else {

            const {
                error
            } = await supabaseClient
                .from("agenda")
                .insert([data]);


            if (error) {

                console.error(
                    "Gagal tambah agenda:",
                    error
                );

                alert(
                    "Gagal menambahkan agenda."
                );

                return;

            }


            alert(
                "Agenda berhasil ditambahkan."
            );

        }


        closeAgendaModal();

        await loadAgenda();

    }
);


// ===============================
// EDIT
// ===============================

window.editAgenda =
    function (id) {

        const item =
            agendaData.find(
                agenda =>
                    String(agenda.id) ===
                    String(id)
            );


        if (!item) {

            alert(
                "Data agenda tidak ditemukan."
            );

            return;

        }


        agendaIndex.value =
            item.id;


        judulInput.value =
            item.judul || "";


        tanggalInput.value =
            item.tanggal || "";


        waktuInput.value =
            item.waktu || "";


        lokasiInput.value =
            item.lokasi || "";


        deskripsiInput.value =
            item.deskripsi || "";


        modalTitle.textContent =
            "Edit Agenda";


        agendaModal.classList.add(
            "show"
        );

    };


// ===============================
// HAPUS
// ===============================

window.deleteAgenda =
    async function (id) {

        const item =
            agendaData.find(
                agenda =>
                    String(agenda.id) ===
                    String(id)
            );


        if (!item) {

            alert(
                "Data agenda tidak ditemukan."
            );

            return;

        }


        const confirmDelete =
            confirm(
                `Hapus agenda "${item.judul}"?`
            );


        if (!confirmDelete) {
            return;
        }


        const {
            error
        } = await supabaseClient
            .from("agenda")
            .delete()
            .eq("id", id);


        if (error) {

            console.error(
                "Gagal menghapus agenda:",
                error
            );

            alert(
                "Gagal menghapus agenda."
            );

            return;

        }


        alert(
            "Agenda berhasil dihapus."
        );


        await loadAgenda();

    };


// ===============================
// SEARCH
// ===============================

searchInput.addEventListener(
    "input",
    function () {

        renderAgenda(
            searchInput.value
        );

    }
);


// ===============================
// LOGOUT
// ===============================

if (logoutBtn) {

    logoutBtn.addEventListener(
        "click",
        async function () {

            await supabaseClient
                .auth
                .signOut();

            localStorage.removeItem(
                "adminLogin"
            );

            window.location.href =
                "./login.html";

        }
    );

}


// ===============================
// LOAD AWAL
// ===============================

loadAgenda();