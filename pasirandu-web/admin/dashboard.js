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
// CEK LOGIN
// ===============================

async function checkLogin() {

    const {
        data: { session }
    } = await supabaseClient.auth.getSession();

    if (!session) {
        localStorage.removeItem("adminLogin");
        window.location.href = "./login.html";
        return false;
    }

    return true;
}


// ===============================
// LOGOUT
// ===============================

const logoutBtn =
    document.getElementById("logoutBtn");

if (logoutBtn) {

    logoutBtn.addEventListener("click", async function () {

        await supabaseClient.auth.signOut();

        localStorage.removeItem("adminLogin");

        window.location.href = "./login.html";

    });

}


// ===============================
// HITUNG DATA DASHBOARD
// ===============================

async function updateDashboardStats() {

    try {

        // ===========================
        // ANGGOTA
        // ===========================

        const {
            count: totalAnggota,
            error: anggotaError
        } = await supabaseClient
            .from("anggota")
            .select("*", {
                count: "exact",
                head: true
            });


        if (anggotaError) {
            console.error(
                "Error anggota:",
                anggotaError
            );
        }


        // ===========================
        // KEGIATAN
        // ===========================

        const {
            count: totalKegiatan,
            error: kegiatanError
        } = await supabaseClient
            .from("kegiatan")
            .select("*", {
                count: "exact",
                head: true
            });


        if (kegiatanError) {
            console.error(
                "Error kegiatan:",
                kegiatanError
            );
        }


        // ===========================
        // AGENDA
        // ===========================

        const {
            count: totalAgenda,
            error: agendaError
        } = await supabaseClient
            .from("agenda")
            .select("*", {
                count: "exact",
                head: true
            });


        if (agendaError) {
            console.error(
                "Error agenda:",
                agendaError
            );
        }


        // ===========================
        // GALERI
        // ===========================

        const {
            count: totalGaleri,
            error: galeriError
        } = await supabaseClient
            .from("galeri")
            .select("*", {
                count: "exact",
                head: true
            });


        if (galeriError) {
            console.error(
                "Error galeri:",
                galeriError
            );
        }


        // ===========================
        // UPDATE DASHBOARD
        // ===========================

        const totalMembers =
            document.getElementById(
                "dashboardTotalMembers"
            );

        const totalActivities =
            document.getElementById(
                "dashboardTotalActivities"
            );

        const totalAgendaElement =
            document.getElementById(
                "dashboardTotalAgenda"
            );

        const totalGallery =
            document.getElementById(
                "dashboardTotalGallery"
            );


        if (totalMembers) {
            totalMembers.textContent =
                totalAnggota ?? 0;
        }


        if (totalActivities) {
            totalActivities.textContent =
                totalKegiatan ?? 0;
        }


        if (totalAgendaElement) {
            totalAgendaElement.textContent =
                totalAgenda ?? 0;
        }


        if (totalGallery) {
            totalGallery.textContent =
                totalGaleri ?? 0;
        }


    } catch (error) {

        console.error(
            "Dashboard Error:",
            error
        );

    }

}


// ===============================
// JALANKAN DASHBOARD
// ===============================

async function initDashboard() {

    const loggedIn =
        await checkLogin();

    if (!loggedIn) return;

    await updateDashboardStats();

}


// ===============================
// START
// ===============================

initDashboard();