const SUPABASE_URL =
    "https://agydrlnteennnhwdjati.supabase.co";

const SUPABASE_KEY =
    "sb_publishable_iHJcEwwMdpL9gIG57pDHoQ_1x-v1GjM";

const supabaseClient =
    window.supabase.createClient(
        SUPABASE_URL,
        SUPABASE_KEY
    );


let anggotaData = [];
let editingId = null;


// ======================================
// ELEMENT
// ======================================

const memberTableBody =
    document.getElementById("memberTableBody");

const totalMembers =
    document.getElementById("totalMembers");

const searchInput =
    document.getElementById("searchInput");

const memberModal =
    document.getElementById("memberModal");

const memberForm =
    document.getElementById("memberForm");

const addMemberBtn =
    document.getElementById("addMemberBtn");

const closeModal =
    document.getElementById("closeModal");

const cancelBtn =
    document.getElementById("cancelBtn");

const modalTitle =
    document.getElementById("modalTitle");

const logoutBtn =
    document.getElementById("logoutBtn");


// ======================================
// LOAD DATA
// ======================================

async function loadAnggota() {

    const {
        data,
        error
    } = await supabaseClient
        .from("anggota")
        .select("*")
        .order("created_at", {
            ascending: false
        });


    if (error) {

        console.error(
            "Gagal mengambil data anggota:",
            error
        );

        alert(
            "Gagal mengambil data anggota dari database."
        );

        return;
    }


    anggotaData = data || [];

    renderAnggota(anggotaData);
}


// ======================================
// RENDER TABLE
// ======================================

function renderAnggota(data) {

    memberTableBody.innerHTML = "";

    totalMembers.textContent = data.length;


    if (data.length === 0) {

        memberTableBody.innerHTML = `
            <tr>
                <td colspan="6" style="text-align:center; padding:30px;">
                    Belum ada data anggota.
                </td>
            </tr>
        `;

        return;
    }


    data.forEach((anggota, index) => {

        const row =
            document.createElement("tr");


        row.innerHTML = `

            <td>
                ${index + 1}
            </td>

            <td>
                <strong>
                    ${escapeHTML(anggota.nama)}
                </strong>
            </td>

            <td>
                ${escapeHTML(
                    anggota.jenis_kelamin || "-"
                )}
            </td>

            <td>
                ${escapeHTML(
                    anggota.jabatan || "-"
                )}
            </td>

            <td>
                ${escapeHTML(
                    anggota.no_hp || "-"
                )}
            </td>

            <td>

                <div class="action-buttons">

                    <button
                        type="button"
                        class="edit-btn"
                        onclick="editAnggota(${anggota.id})"
                        title="Edit anggota">
                        ✏️
                    </button>

                    <button
                        type="button"
                        class="delete-btn"
                        onclick="deleteAnggota(${anggota.id})"
                        title="Hapus anggota">
                        🗑️
                    </button>

                </div>

            </td>
        `;


        memberTableBody.appendChild(row);

    });
}


// ======================================
// TAMBAH ANGGOTA
// ======================================

addMemberBtn.addEventListener(
    "click",
    function () {

        editingId = null;

        memberForm.reset();

        modalTitle.textContent =
            "Tambah Anggota";

        memberModal.classList.add("show");

    }
);


// ======================================
// TUTUP MODAL
// ======================================

function closeMemberModal() {

    memberModal.classList.remove("show");

    memberForm.reset();

    editingId = null;
}


closeModal.addEventListener(
    "click",
    closeMemberModal
);


cancelBtn.addEventListener(
    "click",
    closeMemberModal
);


// ======================================
// SIMPAN / UPDATE
// ======================================

memberForm.addEventListener(
    "submit",
    async function (event) {

        event.preventDefault();


        const nama =
            document.getElementById("nama")
                .value.trim();


        const jenisKelamin =
            document.getElementById("jenisKelamin")
                .value;


        const jabatan =
            document.getElementById("jabatan")
                .value.trim();


        const noHp =
            document.getElementById("noHp")
                .value.trim();


        if (
            !nama ||
            !jenisKelamin ||
            !jabatan ||
            !noHp
        ) {

            alert(
                "Mohon lengkapi semua data."
            );

            return;
        }


        const dataAnggota = {

            nama: nama,

            jenis_kelamin:
                jenisKelamin,

            jabatan: jabatan,

            no_hp: noHp

        };


        // ==================================
        // UPDATE
        // ==================================

        if (editingId !== null) {

            const {
                error
            } = await supabaseClient
                .from("anggota")
                .update(dataAnggota)
                .eq("id", editingId);


            if (error) {

                console.error(
                    "Gagal update:",
                    error
                );

                alert(
                    "Gagal mengubah data anggota."
                );

                return;
            }


            alert(
                "Data anggota berhasil diubah."
            );

        }


        // ==================================
        // INSERT
        // ==================================

        else {

            const {
                error
            } = await supabaseClient
                .from("anggota")
                .insert([
                    dataAnggota
                ]);


            if (error) {

                console.error(
                    "Gagal insert:",
                    error
                );

                alert(
                    "Gagal menambahkan anggota."
                );

                return;
            }


            alert(
                "Anggota berhasil ditambahkan."
            );

        }


        closeMemberModal();

        await loadAnggota();

    }
);


// ======================================
// EDIT ANGGOTA
// ======================================

window.editAnggota = function (id) {

    const anggota =
        anggotaData.find(
            item => Number(item.id) === Number(id)
        );


    if (!anggota) {

        alert(
            "Data anggota tidak ditemukan."
        );

        return;
    }


    editingId = anggota.id;


    document.getElementById("nama").value =
        anggota.nama || "";


    document.getElementById("jenisKelamin").value =
        anggota.jenis_kelamin || "";


    document.getElementById("jabatan").value =
        anggota.jabatan || "";


    document.getElementById("noHp").value =
        anggota.no_hp || "";


    modalTitle.textContent =
        "Edit Anggota";


    memberModal.classList.add("show");

};


// ======================================
// HAPUS ANGGOTA
// ======================================

window.deleteAnggota = async function (id) {

    const anggota =
        anggotaData.find(
            item => Number(item.id) === Number(id)
        );


    if (!anggota) {

        alert(
            "Data anggota tidak ditemukan."
        );

        return;
    }


    const yakin = confirm(
        'Yakin ingin menghapus "' +
        anggota.nama +
        '"?'
    );


    if (!yakin) return;


    const {
        error
    } = await supabaseClient
        .from("anggota")
        .delete()
        .eq("id", id);


    if (error) {

        console.error(
            "Gagal menghapus:",
            error
        );

        alert(
            "Gagal menghapus anggota."
        );

        return;
    }


    alert(
        "Anggota berhasil dihapus."
    );


    await loadAnggota();

};


// ======================================
// SEARCH
// ======================================

searchInput.addEventListener(
    "input",
    function () {

        const keyword =
            this.value
                .toLowerCase()
                .trim();


        const filtered =
            anggotaData.filter(
                anggota => {

                    return (

                        (anggota.nama || "")
                            .toLowerCase()
                            .includes(keyword)

                        ||

                        (anggota.jabatan || "")
                            .toLowerCase()
                            .includes(keyword)

                        ||

                        (anggota.no_hp || "")
                            .toLowerCase()
                            .includes(keyword)

                        ||

                        (anggota.jenis_kelamin || "")
                            .toLowerCase()
                            .includes(keyword)

                    );

                }
            );


        renderAnggota(filtered);

    }
);


// ======================================
// ESCAPE HTML
// ======================================

function escapeHTML(text) {

    const div =
        document.createElement("div");

    div.textContent =
        text ?? "";

    return div.innerHTML;
}


// ======================================
// LOGOUT
// ======================================

if (logoutBtn) {

    logoutBtn.addEventListener(
        "click",
        async function () {

            const yakin =
                confirm(
                    "Yakin ingin logout?"
                );


            if (!yakin) return;


            const {
                error
            } =
                await supabaseClient
                    .auth
                    .signOut();


            if (error) {

                console.error(error);

                alert(
                    "Gagal logout."
                );

                return;
            }


            localStorage.removeItem(
                "adminLogin"
            );


            window.location.href =
                "login.html";

        }
    );

}


// ======================================
// LOAD AWAL
// ======================================

loadAnggota();