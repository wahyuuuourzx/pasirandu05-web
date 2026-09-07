(() => {
    const AUTH_SUPABASE_URL =
        "https://agydrlnteennnhwdjati.supabase.co";

    const AUTH_SUPABASE_KEY =
        "sb_publishable_iHJcEwwMdpL9gIG57pDHoQ_1x-v1GjM";

    const authSupabase =
        window.supabase.createClient(
            AUTH_SUPABASE_URL,
            AUTH_SUPABASE_KEY
        );

    async function requireAuth() {
        const {
            data: { session },
            error
        } = await authSupabase.auth.getSession();

        if (error) {
            console.error("Auth Error:", error);
            window.location.href = "./login.html";
            return;
        }

        if (!session) {
            window.location.href = "./login.html";
            return;
        }

        console.log("Admin terverifikasi:", session.user.email);
    }

    requireAuth();
})();
document.addEventListener("DOMContentLoaded", () => {

    const menu = document.querySelector(".menu");
    const activeMenu = document.querySelector(".menu a.active");

    if (!menu || !activeMenu) return;

    if (window.innerWidth <= 600) {

        const left =
            activeMenu.offsetLeft -
            (menu.clientWidth - activeMenu.offsetWidth) / 2;

        menu.scrollTo({
            left: Math.max(0, left),
            behavior: "instant"
        });

    }

});