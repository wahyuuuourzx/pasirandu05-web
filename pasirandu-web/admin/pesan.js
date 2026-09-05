const SUPABASE_URL = "https://agydrlnteennnhwdjati.supabase.co";

const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFneWRybG50ZWVubm5od2RqYXRpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODg1MTcxNjQsImV4cCI6MjEwNDA5MzE2NH0.U89OxY4rzAqHYyfrnd_-KonAiLfEDTk3Ih8hvwUGC-M";

const supabaseClient = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_KEY
);

const messageList = document.getElementById("messageList");
const searchInput = document.getElementById("searchInput");

const totalMessages = document.getElementById("totalMessages");
const unreadMessages = document.getElementById("unreadMessages");
const readMessages = document.getElementById("readMessages");

let messages = [];


/* =========================
   CEK LOGIN
========================= */

async function checkLogin() {

    const {
        data: { session },
        error
    } = await supabaseClient.auth.getSession();

    console.log("SESSION:", session);
    console.log("AUTH ERROR:", error);

    if (!session) {
        console.log("BELUM LOGIN SUPABASE");
        window.location.href = "./login.html";
        return false;
    }

    console.log("SUDAH LOGIN:", session.user.email);

    return true;
}

/* =========================
   LOAD PESAN
========================= */

async function loadMessages() {

    const loggedIn = await checkLogin();

    if (!loggedIn) return;

    const { data, error } = await supabaseClient
        .from("pesan")
        .select("*")
        .order("tanggal", {
            ascending: false
        });

    if (error) {

        console.error("Supabase Error:", error);

        alert("Gagal mengambil data pesan.");

        return;
    }

    messages = data || [];

    renderMessages();
    updateStats();
}


/* =========================
   RENDER PESAN
========================= */

function renderMessages() {

    if (!messageList) return;

    const keyword = searchInput
        ? searchInput.value.toLowerCase().trim()
        : "";

    const filteredMessages = messages.filter(message => {

        return (
            message.nama?.toLowerCase().includes(keyword) ||
            message.email?.toLowerCase().includes(keyword) ||
            message.pesan?.toLowerCase().includes(keyword)
        );

    });


    if (filteredMessages.length === 0) {

        messageList.innerHTML = `
            <div class="empty-state">
                <div class="empty-icon">📭</div>
                <h3>Belum ada pesan</h3>
                <p>Belum ada pesan yang masuk dari pengunjung.</p>
            </div>
        `;

        return;
    }


    messageList.innerHTML = filteredMessages.map(message => {

        const tanggal = message.tanggal
            ? new Date(message.tanggal).toLocaleString("id-ID", {
                day: "2-digit",
                month: "long",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit"
            })
            : "-";


        return `
            <div class="message-item ${message.dibaca ? "read" : "unread"}">

                <div class="message-top">

                    <div class="message-user">

                        <div class="message-avatar">
                            ${escapeHTML(message.nama?.charAt(0).toUpperCase() || "?")}
                        </div>

                        <div>
                            <h3>${escapeHTML(message.nama)}</h3>
                            <span>${escapeHTML(message.email)}</span>
                        </div>

                    </div>


                    <div class="message-status">

                        ${
                            message.dibaca
                                ? `<span class="status-badge read">✓ Sudah Dibaca</span>`
                                : `<span class="status-badge unread">● Belum Dibaca</span>`
                        }

                    </div>

                </div>


                <div class="message-content">

                    <p>
                        ${escapeHTML(message.pesan)}
                    </p>

                </div>


                <div class="message-bottom">

                    <span class="message-date">
                        🕒 ${tanggal}
                    </span>


                    <div class="message-actions">

                        <button
                            class="action-btn"
                            onclick="toggleRead(${message.id}, ${message.dibaca})"
                        >
                            ${
                                message.dibaca
                                    ? "Tandai Belum Dibaca"
                                    : "Tandai Dibaca"
                            }
                        </button>


                        <button
                            class="action-btn delete"
                            onclick="deleteMessage(${message.id})"
                        >
                            Hapus
                        </button>

                    </div>

                </div>

            </div>
        `;

    }).join("");
}


/* =========================
   UPDATE STATISTIK
========================= */

function updateStats() {

    const total = messages.length;

    const unread = messages.filter(
        message => !message.dibaca
    ).length;

    const read = messages.filter(
        message => message.dibaca
    ).length;


    if (totalMessages) {
        totalMessages.textContent = total;
    }

    if (unreadMessages) {
        unreadMessages.textContent = unread;
    }

    if (readMessages) {
        readMessages.textContent = read;
    }
}


/* =========================
   TANDAI DIBACA
========================= */

async function toggleRead(id, currentStatus) {

    const { error } = await supabaseClient
        .from("pesan")
        .update({
            dibaca: !currentStatus
        })
        .eq("id", id);


    if (error) {

        console.error(error);

        alert("Gagal mengubah status pesan.");

        return;
    }

    await loadMessages();
}


/* =========================
   HAPUS PESAN
========================= */

async function deleteMessage(id) {

    const yakin = confirm(
        "Yakin ingin menghapus pesan ini?"
    );

    if (!yakin) return;


    const { error } = await supabaseClient
        .from("pesan")
        .delete()
        .eq("id", id);


    if (error) {

        console.error(error);

        alert("Gagal menghapus pesan.");

        return;
    }

    await loadMessages();
}


/* =========================
   SEARCH
========================= */

if (searchInput) {

    searchInput.addEventListener(
        "input",
        renderMessages
    );

}


/* =========================
   LOGOUT
========================= */

const logoutBtn = document.getElementById("logoutBtn");

if (logoutBtn) {

    logoutBtn.addEventListener("click", async function () {

        await supabaseClient.auth.signOut();

        localStorage.removeItem("adminLogin");

        window.location.href = "./login.html";

    });

}


/* =========================
   SECURITY
========================= */

function escapeHTML(value) {

    const div = document.createElement("div");

    div.textContent = value ?? "";

    return div.innerHTML;
}


/* =========================
   START
========================= */

loadMessages();