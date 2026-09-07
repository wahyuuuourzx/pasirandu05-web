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
// DATA
// ========================================

let galleryData = [];

let editingId = null;

let oldFotoUrl = null;


// ========================================
// ELEMENT
// ========================================

const galleryGrid =
    document.getElementById("galleryGrid");

const totalGallery =
    document.getElementById("totalGallery");

const searchInput =
    document.getElementById("searchInput");

const addGalleryBtn =
    document.getElementById("addGalleryBtn");

const galleryModal =
    document.getElementById("galleryModal");

const galleryForm =
    document.getElementById("galleryForm");

const closeModal =
    document.getElementById("closeModal");

const cancelBtn =
    document.getElementById("cancelBtn");

const fotoInput =
    document.getElementById("foto");

const judulInput =
    document.getElementById("judul");

const tanggalInput =
    document.getElementById("tanggal");

const deskripsiInput =
    document.getElementById("deskripsi");

const modalTitle =
    document.getElementById("modalTitle");

const logoutBtn =
    document.getElementById("logoutBtn");


// ========================================
// ESCAPE HTML
// ========================================

function escapeHTML(text) {

    if (!text) return "";

    const div =
        document.createElement("div");

    div.textContent = text;

    return div.innerHTML;
}


// ========================================
// FORMAT TANGGAL
// ========================================

function formatDate(date) {

    if (!date) return "-";

    const result =
        new Date(date + "T00:00:00");

    return result.toLocaleDateString(
        "id-ID",
        {
            day: "2-digit",
            month: "long",
            year: "numeric"
        }
    );
}


// ========================================
// LOAD DATA DARI SUPABASE
// ========================================

async function loadGallery() {

    galleryGrid.innerHTML = `
        <div class="empty-state">
            <div class="empty-icon">⏳</div>
            <h3>Memuat galeri...</h3>
            <p>Mohon tunggu sebentar.</p>
        </div>
    `;

    const {
        data,
        error
    } = await supabaseClient
        .from("galeri")
        .select("*")
        .order(
            "created_at",
            {
                ascending: false
            }
        );


    if (error) {

        console.error(
            "Gagal mengambil galeri:",
            error
        );

        galleryGrid.innerHTML = `
            <div class="empty-state">
                <div class="empty-icon">⚠️</div>
                <h3>Gagal memuat galeri</h3>
                <p>Silakan refresh halaman.</p>
            </div>
        `;

        return;
    }


    galleryData = data || [];

    renderGallery();

}


// ========================================
// RENDER GALERI
// ========================================

function renderGallery(
    keyword = ""
) {

    galleryGrid.innerHTML = "";

    const search =
        keyword
            .toLowerCase()
            .trim();


    const filteredData =
        galleryData.filter(
            item => {

                return (

                    (item.judul || "")
                        .toLowerCase()
                        .includes(search)

                    ||

                    (item.deskripsi || "")
                        .toLowerCase()
                        .includes(search)

                );

            }
        );


    totalGallery.textContent =
        galleryData.length;


    // ========================================
    // KOSONG
    // ========================================

    if (
        filteredData.length === 0
    ) {

        galleryGrid.innerHTML = `
            <div class="empty-state">

                <div class="empty-icon">
                    📷
                </div>

                <h3>
                    Belum ada foto
                </h3>

                <p>
                    Tambahkan dokumentasi kegiatan Pasirandu 05.
                </p>

            </div>
        `;

        return;
    }


    // ========================================
    // DATA
    // ========================================

    filteredData.forEach(
        item => {

            const card =
                document.createElement("div");

            card.className =
                "gallery-item";


            card.innerHTML = `

                <div class="gallery-image">

                    <img
                        src="${escapeHTML(item.foto)}"
                        alt="${escapeHTML(item.judul)}"
                        loading="lazy"
                    >

                </div>


                <div class="gallery-info">

                    <h3>
                        ${escapeHTML(item.judul)}
                    </h3>

                    <div class="gallery-date">
                        📅 ${formatDate(item.tanggal)}
                    </div>

                    <div class="gallery-description">
                        ${escapeHTML(
                            item.deskripsi ||
                            "Tidak ada deskripsi."
                        )}
                    </div>


                    <div class="gallery-actions">

                        <button
                            class="edit-btn"
                            onclick="editGallery('${item.id}')"
                        >
                            Edit
                        </button>

                        <button
                            class="delete-btn"
                            onclick="deleteGallery('${item.id}')"
                        >
                            Hapus
                        </button>

                    </div>

                </div>

            `;


            galleryGrid.appendChild(card);

        }
    );

}


// ========================================
// UPLOAD FOTO
// ========================================

async function uploadFoto(file) {

    if (!file) {
        return null;
    }


    // Maksimal 5 MB
    if (
        file.size >
        5 * 1024 * 1024
    ) {

        alert(
            "Ukuran foto maksimal 5 MB."
        );

        return null;
    }


    // Format yang diperbolehkan
    const allowedTypes = [
        "image/jpeg",
        "image/png",
        "image/webp"
    ];


    if (
        !allowedTypes.includes(
            file.type
        )
    ) {

        alert(
            "Format foto harus JPG, PNG, atau WEBP."
        );

        return null;
    }


    const extension =
        file.name
            .split(".")
            .pop()
            .toLowerCase();


    const fileName =
        `${Date.now()}-${Math.random()
            .toString(36)
            .substring(2, 10)}.${extension}`;


    const filePath =
        `galeri/${fileName}`;


    const {
        error
    } =
        await supabaseClient
            .storage
            .from("galeri")
            .upload(
                filePath,
                file,
                {
                    cacheControl: "3600",
                    upsert: false
                }
            );


    if (error) {

        console.error(
            "Upload foto gagal:",
            error
        );

        alert(
            "Foto gagal diupload."
        );

        return null;
    }


    const {
        data
    } =
        supabaseClient
            .storage
            .from("galeri")
            .getPublicUrl(
                filePath
            );


    return {
        url: data.publicUrl,
        path: filePath
    };

}


// ========================================
// HAPUS FOTO DARI STORAGE
// ========================================

async function deleteFotoFromStorage(
    fotoUrl
) {

    if (!fotoUrl) {
        return;
    }


    try {

        const marker =
            "/storage/v1/object/public/galeri/";

        const index =
            fotoUrl.indexOf(marker);


        if (index === -1) {
            return;
        }


        const filePath =
            fotoUrl.substring(
                index + marker.length
            );


        await supabaseClient
            .storage
            .from("galeri")
            .remove([
                filePath
            ]);

    }
    catch (error) {

        console.error(
            "Gagal menghapus foto:",
            error
        );

    }

}


// ========================================
// BUKA MODAL TAMBAH
// ========================================

addGalleryBtn.addEventListener(
    "click",
    function () {

        editingId = null;

        oldFotoUrl = null;

        galleryForm.reset();

        modalTitle.textContent =
            "Tambah Foto";

        galleryModal.classList.add(
            "show"
        );

    }
);


// ========================================
// TUTUP MODAL
// ========================================

function closeGalleryModal() {

    galleryModal.classList.remove(
        "show"
    );

    galleryForm.reset();

    editingId = null;

    oldFotoUrl = null;

}


closeModal.addEventListener(
    "click",
    closeGalleryModal
);


cancelBtn.addEventListener(
    "click",
    closeGalleryModal
);


// ========================================
// KLIK LUAR MODAL
// ========================================

galleryModal.addEventListener(
    "click",
    function (event) {

        if (
            event.target === galleryModal
        ) {

            closeGalleryModal();

        }

    }
);


// ========================================
// TAMBAH / EDIT
// ========================================

galleryForm.addEventListener(
    "submit",
    async function (event) {

        event.preventDefault();


        const file =
            fotoInput.files[0];


        const title =
            judulInput.value.trim();


        const date =
            tanggalInput.value;


        const description =
            deskripsiInput.value.trim();


        if (!title) {

            alert(
                "Judul foto wajib diisi."
            );

            return;
        }


        if (!date) {

            alert(
                "Tanggal wajib diisi."
            );

            return;
        }


        // ========================================
        // TOMBOL
        // ========================================

        const submitButton =
            galleryForm.querySelector(
                'button[type="submit"]'
            );


        const originalText =
            submitButton
                ? submitButton.innerHTML
                : "";


        if (submitButton) {

            submitButton.disabled =
                true;

            submitButton.innerHTML =
                "Menyimpan...";
        }


        try {

            // ========================================
            // EDIT
            // ========================================

            if (editingId !== null) {

                const oldData =
                    galleryData.find(
                        item =>
                            String(item.id) ===
                            String(editingId)
                    );


                if (!oldData) {

                    alert(
                        "Data galeri tidak ditemukan."
                    );

                    return;
                }


                let fotoUrl =
                    oldData.foto;


                // Jika memilih foto baru
                if (file) {

                    const uploaded =
                        await uploadFoto(
                            file
                        );


                    if (!uploaded) {
                        return;
                    }


                    fotoUrl =
                        uploaded.url;

                }


                const updateData = {

                    judul: title,

                    tanggal: date,

                    deskripsi: description,

                    foto: fotoUrl

                };


                const {
                    error
                } =
                    await supabaseClient
                        .from("galeri")
                        .update(
                            updateData
                        )
                        .eq(
                            "id",
                            editingId
                        );


                if (error) {

                    console.error(
                        "Gagal update galeri:",
                        error
                    );

                    alert(
                        "Gagal mengubah foto."
                    );

                    return;
                }


                // Hapus foto lama
                // jika berhasil diganti
                if (
                    file &&
                    oldData.foto !== fotoUrl
                ) {

                    await deleteFotoFromStorage(
                        oldData.foto
                    );

                }


                alert(
                    "Foto berhasil diubah."
                );

            }


            // ========================================
            // TAMBAH
            // ========================================

            else {

                if (!file) {

                    alert(
                        "Silakan pilih foto terlebih dahulu."
                    );

                    return;
                }


                const uploaded =
                    await uploadFoto(
                        file
                    );


                if (!uploaded) {
                    return;
                }


                const insertData = {

                    judul: title,

                    tanggal: date,

                    deskripsi: description,

                    foto: uploaded.url

                };


                const {
                    error
                } =
                    await supabaseClient
                        .from("galeri")
                        .insert([
                            insertData
                        ]);


                if (error) {

                    console.error(
                        "Gagal menambahkan galeri:",
                        error
                    );


                    // Jika database gagal,
                    // hapus foto yang sudah
                    // terlanjur diupload
                    await supabaseClient
                        .storage
                        .from("galeri")
                        .remove([
                            uploaded.path
                        ]);


                    alert(
                        "Gagal menambahkan foto."
                    );

                    return;
                }


                alert(
                    "Foto berhasil ditambahkan."
                );

            }


            closeGalleryModal();

            await loadGallery();

        }
        catch (error) {

            console.error(
                "Error galeri:",
                error
            );

            alert(
                "Terjadi kesalahan. Silakan coba lagi."
            );

        }
        finally {

            if (submitButton) {

                submitButton.disabled =
                    false;

                submitButton.innerHTML =
                    originalText;

            }

        }

    }
);


// ========================================
// EDIT GALERI
// ========================================

async function editGallery(id) {

    const item =
        galleryData.find(
            gallery =>
                String(gallery.id) ===
                String(id)
        );


    if (!item) {

        alert(
            "Data galeri tidak ditemukan."
        );

        return;
    }


    editingId =
        item.id;


    oldFotoUrl =
        item.foto;


    judulInput.value =
        item.judul || "";


    tanggalInput.value =
        item.tanggal || "";


    deskripsiInput.value =
        item.deskripsi || "";


    // Input file dikosongkan
    fotoInput.value = "";


    modalTitle.textContent =
        "Edit Foto";


    galleryModal.classList.add(
        "show"
    );

}


// ========================================
// HAPUS GALERI
// ========================================

async function deleteGallery(id) {

    const item =
        galleryData.find(
            gallery =>
                String(gallery.id) ===
                String(id)
        );


    if (!item) {
        return;
    }


    const confirmDelete =
        confirm(
            `Hapus foto "${item.judul}"?`
        );


    if (!confirmDelete) {
        return;
    }


    const {
        error
    } =
        await supabaseClient
            .from("galeri")
            .delete()
            .eq(
                "id",
                id
            );


    if (error) {

        console.error(
            "Gagal menghapus data galeri:",
            error
        );

        alert(
            "Gagal menghapus foto."
        );

        return;
    }


    // Hapus file dari Storage
    await deleteFotoFromStorage(
        item.foto
    );


    alert(
        "Foto berhasil dihapus."
    );


    await loadGallery();

}


// ========================================
// SEARCH
// ========================================

searchInput.addEventListener(
    "input",
    function () {

        renderGallery(
            searchInput.value
        );

    }
);


// ========================================
// LOGOUT
// ========================================

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


// ========================================
// LOAD AWAL
// ========================================

loadGallery();
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