// ========================================
// SUPABASE
// ========================================

const SUPABASE_URL =
    "https://agydrlnteennnhwdjati.supabase.co";

const SUPABASE_KEY =
    "sb_publishable_iHJcEwwMdpL9gIG57pDHoQ_1x-v1GjM";

const supabaseClient =
    window.supabase.createClient(
        SUPABASE_URL,
        SUPABASE_KEY
    );


// ========================================
// ELEMENT HTML
// ========================================

const activityModal =
    document.getElementById("activityModal");

const addActivityBtn =
    document.getElementById("addActivityBtn");

const closeModal =
    document.getElementById("closeModal");

const cancelBtn =
    document.getElementById("cancelBtn");

const activityForm =
    document.getElementById("activityForm");

const activityList =
    document.getElementById("activityList");

const searchInput =
    document.getElementById("searchInput");

const totalActivities =
    document.getElementById("totalActivities");

const modalTitle =
    document.getElementById("modalTitle");


// ========================================
// DATA
// ========================================

let activities = [];

let editingId = null;


// ========================================
// LOAD DATA DARI SUPABASE
// ========================================

async function loadActivities() {

    activityList.innerHTML = `
        <div class="empty-data">
            <div class="empty-icon">⏳</div>
            <strong>Memuat kegiatan...</strong>
        </div>
    `;

    const { data, error } =
        await supabaseClient
            .from("kegiatan")
            .select("*")
            .order("created_at", {
                ascending: false
            });

    if (error) {

        console.error(
            "Gagal mengambil kegiatan:",
            error
        );

        activityList.innerHTML = `
            <div class="empty-data">
                <div class="empty-icon">⚠️</div>
                <strong>Gagal memuat kegiatan</strong>
                <p>Silakan refresh halaman.</p>
            </div>
        `;

        return;
    }

    activities = data || [];

    renderActivities();
}


// ========================================
// TAMPILKAN KEGIATAN
// ========================================

function renderActivities(
    data = activities
) {

    activityList.innerHTML = "";

    totalActivities.textContent =
        activities.length;


    // Belum ada data
    if (data.length === 0) {

        activityList.innerHTML = `
            <div class="empty-data">

                <div class="empty-icon">
                    📰
                </div>

                <strong>
                    Belum ada kegiatan
                </strong>

                <p>
                    Silakan tambahkan kegiatan baru.
                </p>

            </div>
        `;

        return;
    }


    data.forEach((activity) => {

        const item =
            document.createElement("div");

        item.className =
            "activity-item";


        item.innerHTML = `

            <div class="activity-info">

                <div class="activity-title">
                    ${escapeHTML(activity.judul)}
                </div>

                <div class="activity-description">
                    ${escapeHTML(activity.deskripsi)}
                </div>

                <div class="activity-meta">

                    <span class="meta-item">
                        📅 ${formatDate(activity.tanggal)}
                    </span>

                    <span class="meta-item">
                        🕐 ${escapeHTML(activity.waktu)}
                    </span>

                    <span class="meta-item">
                        📍 ${escapeHTML(activity.lokasi)}
                    </span>

                </div>

            </div>


            <div class="activity-actions">

                <button
                    class="edit-btn"
                    onclick="editActivity('${activity.id}')"
                >
                    ✏️
                </button>

                <button
                    class="delete-btn"
                    onclick="deleteActivity('${activity.id}')"
                >
                    🗑️
                </button>

            </div>

        `;

        activityList.appendChild(item);

    });

}


// ========================================
// FORMAT TANGGAL
// ========================================

function formatDate(dateString) {

    if (!dateString) {
        return "-";
    }

    const date =
        new Date(
            dateString + "T00:00:00"
        );

    return date.toLocaleDateString(
        "id-ID",
        {
            day: "2-digit",
            month: "short",
            year: "numeric"
        }
    );

}


// ========================================
// AMANKAN TEXT HTML
// ========================================

function escapeHTML(text) {

    const div =
        document.createElement("div");

    div.textContent =
        text || "";

    return div.innerHTML;

}


// ========================================
// BUKA MODAL TAMBAH
// ========================================

addActivityBtn.addEventListener(
    "click",
    function () {

        editingId = null;

        activityForm.reset();

        modalTitle.textContent =
            "Tambah Kegiatan";

        activityModal.classList.add(
            "show"
        );

    }
);


// ========================================
// TUTUP MODAL
// ========================================

function closeActivityModal() {

    activityModal.classList.remove(
        "show"
    );

    activityForm.reset();

    editingId = null;

}


closeModal.addEventListener(
    "click",
    closeActivityModal
);


cancelBtn.addEventListener(
    "click",
    closeActivityModal
);


// ========================================
// KLIK LUAR MODAL
// ========================================

activityModal.addEventListener(
    "click",
    function (event) {

        if (
            event.target === activityModal
        ) {

            closeActivityModal();

        }

    }
);


// ========================================
// SIMPAN KEGIATAN
// ========================================

activityForm.addEventListener(
    "submit",
    async function (event) {

        event.preventDefault();


        const judul =
            document.getElementById(
                "judul"
            ).value.trim();


        const tanggal =
            document.getElementById(
                "tanggal"
            ).value;


        const waktu =
            document.getElementById(
                "waktu"
            ).value;


        const lokasi =
            document.getElementById(
                "lokasi"
            ).value.trim();


        const deskripsi =
            document.getElementById(
                "deskripsi"
            ).value.trim();


        if (
            !judul ||
            !tanggal ||
            !waktu ||
            !lokasi ||
            !deskripsi
        ) {

            alert(
                "Mohon lengkapi semua data."
            );

            return;

        }


        const activityData = {

            judul: judul,

            tanggal: tanggal,

            waktu: waktu,

            lokasi: lokasi,

            deskripsi: deskripsi

        };


        // ========================================
        // EDIT
        // ========================================

        if (editingId !== null) {

            const {
                error
            } =
                await supabaseClient
                    .from("kegiatan")
                    .update(activityData)
                    .eq(
                        "id",
                        editingId
                    );


            if (error) {

                console.error(
                    "Gagal update kegiatan:",
                    error
                );

                alert(
                    "Gagal mengubah kegiatan."
                );

                return;

            }


            alert(
                "Kegiatan berhasil diubah."
            );

        }


        // ========================================
        // TAMBAH
        // ========================================

        else {

            const {
                error
            } =
                await supabaseClient
                    .from("kegiatan")
                    .insert([
                        activityData
                    ]);


            if (error) {

                console.error("Gagal menambahkan kegiatan:", error);
                console.error("Code:", error.code);
                console.error("Message:", error.message);
                console.error("Details:", error.details);
                console.error("Hint:", error.hint);
                alert(
                    "Gagal menambahkan kegiatan."
                );

                return;

            }


            alert(
                "Kegiatan berhasil ditambahkan."
            );

        }


        closeActivityModal();

        await loadActivities();

    }
);


// ========================================
// EDIT KEGIATAN
// ========================================

async function editActivity(id) {

    const activity =
        activities.find(
            item =>
                String(item.id) ===
                String(id)
        );


    if (!activity) {

        alert(
            "Data kegiatan tidak ditemukan."
        );

        return;

    }


    editingId = activity.id;


    document.getElementById(
        "judul"
    ).value =
        activity.judul || "";


    document.getElementById(
        "tanggal"
    ).value =
        activity.tanggal || "";


    document.getElementById(
        "waktu"
    ).value =
        activity.waktu || "";


    document.getElementById(
        "lokasi"
    ).value =
        activity.lokasi || "";


    document.getElementById(
        "deskripsi"
    ).value =
        activity.deskripsi || "";


    modalTitle.textContent =
        "Edit Kegiatan";


    activityModal.classList.add(
        "show"
    );

}


// ========================================
// HAPUS KEGIATAN
// ========================================

async function deleteActivity(id) {

    const activity =
        activities.find(
            item =>
                String(item.id) ===
                String(id)
        );


    if (!activity) {
        return;
    }


    const confirmation =
        confirm(
            `Hapus kegiatan "${activity.judul}"?`
        );


    if (!confirmation) {
        return;
    }


    const {
        error
    } =
        await supabaseClient
            .from("kegiatan")
            .delete()
            .eq(
                "id",
                id
            );


    if (error) {

        console.error(
            "Gagal menghapus kegiatan:",
            error
        );

        alert(
            "Gagal menghapus kegiatan."
        );

        return;

    }


    alert(
        "Kegiatan berhasil dihapus."
    );


    await loadActivities();

}


// ========================================
// SEARCH
// ========================================

searchInput.addEventListener(
    "input",
    function () {

        const keyword =
            searchInput.value
                .toLowerCase()
                .trim();


        const filteredActivities =
            activities.filter(
                function (activity) {

                    return (

                        (activity.judul || "")
                            .toLowerCase()
                            .includes(keyword)

                        ||

                        (activity.lokasi || "")
                            .toLowerCase()
                            .includes(keyword)

                        ||

                        (activity.deskripsi || "")
                            .toLowerCase()
                            .includes(keyword)

                        ||

                        (activity.waktu || "")
                            .toLowerCase()
                            .includes(keyword)

                    );

                }
            );


        renderActivities(
            filteredActivities
        );

    }
);


// ========================================
// LOGOUT
// ========================================

const logoutBtn =
    document.getElementById(
        "logoutBtn"
    );


if (logoutBtn) {

    logoutBtn.addEventListener(
        "click",
        async function () {

            await supabaseClient.auth.signOut();

            localStorage.removeItem(
                "adminLogin"
            );

            window.location.href =
                "./login.html";

        }
    );

}


// ========================================
// JALANKAN SAAT HALAMAN DIBUKA
// ========================================

loadActivities();
document.addEventListener("DOMContentLoaded", () => {
    const activeMenu = document.querySelector(".menu a.active");

    if (activeMenu) {
        activeMenu.scrollIntoView({
            behavior: "instant",
            block: "nearest",
            inline: "center"
        });
    }
});