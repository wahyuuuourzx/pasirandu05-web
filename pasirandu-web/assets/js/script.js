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

}/* ========================================
   KINETIC INTERACTIVE BACKGROUND
======================================== */

const kineticCanvas = document.getElementById("kineticCanvas");

if (kineticCanvas) {

    const ctx = kineticCanvas.getContext("2d");

    const CELL_SIZE = 55;
    const INFLUENCE_RADIUS = 260;
    const MAX_WARP = 24;
    const DOT_SPACING = 28;
    const LERP_SPEED = 0.08;

    const LINE_BASE = {
        r: 255,
        g: 255,
        b: 255,
        a: 0.13
    };

    const NODE_BASE_RADIUS = 1.8;
    const NODE_ACTIVE_RADIUS = 3.2;

    let width = 0;
    let height = 0;

    let mouse = {
        x: -9999,
        y: -9999
    };

    let targetMouse = {
        x: -9999,
        y: -9999
    };

    const ripples = [];


    /* ========================================
       RESIZE
    ======================================== */

    function resizeCanvas() {

        width = window.innerWidth;
        height = window.innerHeight;

        const dpr = Math.min(window.devicePixelRatio || 1, 2);

        kineticCanvas.width = width * dpr;
        kineticCanvas.height = height * dpr;

        kineticCanvas.style.width = width + "px";
        kineticCanvas.style.height = height + "px";

        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }


    resizeCanvas();

    window.addEventListener("resize", resizeCanvas);


    /* ========================================
       MOUSE
    ======================================== */

    window.addEventListener("mousemove", function (event) {

        targetMouse.x = event.clientX;
        targetMouse.y = event.clientY;

    });


    /* ========================================
       CLICK RIPPLE
    ======================================== */

    window.addEventListener("click", function (event) {

        ripples.push({
            x: event.clientX,
            y: event.clientY,
            radius: 0,
            opacity: 1,
            born: performance.now()
        });

    });


    /* ========================================
       LERP
    ======================================== */

    function lerp(a, b, t) {

        return a + (b - a) * t;

    }


    /* ========================================
       COLOR
    ======================================== */

    function lerpColor(base, active, t) {

        const r = Math.round(
            lerp(base.r, active.r, t)
        );

        const g = Math.round(
            lerp(base.g, active.g, t)
        );

        const b = Math.round(
            lerp(base.b, active.b, t)
        );

        const a = lerp(base.a, active.a, t);

        return `rgba(${r}, ${g}, ${b}, ${a})`;
    }


    /* ========================================
       WARP GRID POINT
    ======================================== */

    function getWarpedPoint(
        gx,
        gy,
        col,
        row,
        mouse,
        cols,
        rows
    ) {

        const edgeMargin = 1.5;

        const colPin = Math.min(
            col / edgeMargin,
            (cols - 1 - col) / edgeMargin,
            1
        );

        const rowPin = Math.min(
            row / edgeMargin,
            (rows - 1 - row) / edgeMargin,
            1
        );

        const pinFactor =
            colPin *
            colPin *
            rowPin *
            rowPin;


        const dx = gx - mouse.x;
        const dy = gy - mouse.y;

        const dist = Math.sqrt(
            dx * dx + dy * dy
        );


        const proximity =
            Math.max(
                0,
                1 - dist / INFLUENCE_RADIUS
            ) * pinFactor;


        /* Ripple */

        let rx = 0;
        let ry = 0;


        for (const ripple of ripples) {

            const rdx = gx - ripple.x;
            const rdy = gy - ripple.y;

            const rdist = Math.sqrt(
                rdx * rdx +
                rdy * rdy
            );

            const waveWidth = 55;

            const diff =
                rdist - ripple.radius;


            if (Math.abs(diff) < waveWidth) {

                const strength =
                    (1 -
                        Math.abs(diff) /
                        waveWidth
                    ) *
                    ripple.opacity *
                    18 *
                    pinFactor;


                const angle =
                    Math.atan2(rdy, rdx);


                const sign =
                    diff < 0 ? -1 : 1;


                rx +=
                    Math.cos(angle) *
                    strength *
                    sign *
                    -1;


                ry +=
                    Math.sin(angle) *
                    strength *
                    sign *
                    -1;
            }
        }


        /* Mouse warp */

        if (
            dist < INFLUENCE_RADIUS &&
            dist > 0 &&
            pinFactor > 0
        ) {

            const t =
                dist /
                INFLUENCE_RADIUS;


            const eased =
                t < 0.01
                    ? 0
                    : (1 - t) *
                      (1 - t) *
                      Math.min(
                          1,
                          dist / 60
                      );


            const warpAmount =
                eased *
                MAX_WARP *
                pinFactor;


            const angle =
                Math.atan2(dy, dx);


            return {

                x:
                    gx -
                    Math.cos(angle) *
                    warpAmount +
                    rx,

                y:
                    gy -
                    Math.sin(angle) *
                    warpAmount +
                    ry,

                proximity
            };

        }


        return {

            x: gx + rx,

            y: gy + ry,

            proximity
        };
    }


    /* ========================================
       DRAW
    ======================================== */

    function draw(now) {

        ctx.clearRect(
            0,
            0,
            width,
            height
        );


        /* Background */

        ctx.fillStyle = "#161618";

        ctx.fillRect(
            0,
            0,
            width,
            height
        );


        /* Background dots */

        ctx.fillStyle =
            "rgba(255,255,255,0.045)";


        for (
            let x = DOT_SPACING / 2;
            x < width;
            x += DOT_SPACING
        ) {

            for (
                let y = DOT_SPACING / 2;
                y < height;
                y += DOT_SPACING
            ) {

                ctx.beginPath();

                ctx.arc(
                    x,
                    y,
                    0.7,
                    0,
                    Math.PI * 2
                );

                ctx.fill();
            }
        }


        /* Update ripple */

        for (
            let i = ripples.length - 1;
            i >= 0;
            i--
        ) {

            const ripple = ripples[i];

            const age =
                (now - ripple.born) /
                1000;


            ripple.radius =
                Math.max(
                    0,
                    age * 400
                );


            ripple.opacity =
                Math.max(
                    0,
                    1 - age * 1.2
                );


            if (ripple.opacity <= 0) {

                ripples.splice(i, 1);

            }
        }


        /* Grid */

        const cols =
            Math.max(
                2,
                Math.ceil(
                    width /
                    CELL_SIZE
                )
            ) + 1;


        const rows =
            Math.max(
                2,
                Math.ceil(
                    height /
                    CELL_SIZE
                )
            ) + 1;


        const cellW =
            width /
            (cols - 1);


        const cellH =
            height /
            (rows - 1);


        const points = [];
        const proximity = [];


        for (
            let row = 0;
            row < rows;
            row++
        ) {

            points[row] = [];
            proximity[row] = [];


            for (
                let col = 0;
                col < cols;
                col++
            ) {

                const point =
                    getWarpedPoint(
                        col * cellW,
                        row * cellH,
                        col,
                        row,
                        mouse,
                        cols,
                        rows
                    );


                points[row][col] = point;

                proximity[row][col] =
                    point.proximity;
            }
        }


        /* Grid lines */

        const activeColor = {
            r: 74,
            g: 158,
            b: 255,
            a: 0.9
        };


        function drawLine(
            p1,
            p2,
            pr1,
            pr2
        ) {

            const avg =
                (pr1 + pr2) / 2;


            const t =
                avg *
                avg *
                (3 - 2 * avg);


            ctx.beginPath();

            ctx.moveTo(
                p1.x,
                p1.y
            );

            ctx.lineTo(
                p2.x,
                p2.y
            );


            ctx.strokeStyle =
                lerpColor(
                    LINE_BASE,
                    activeColor,
                    t
                );


            ctx.lineWidth =
                lerp(
                    0.8,
                    1.5,
                    t
                );


            ctx.stroke();
        }


        ctx.lineCap = "butt";


        /* Horizontal */

        for (
            let row = 0;
            row < rows;
            row++
        ) {

            for (
                let col = 0;
                col < cols - 1;
                col++
            ) {

                drawLine(
                    points[row][col],
                    points[row][col + 1],
                    proximity[row][col],
                    proximity[row][col + 1]
                );
            }
        }


        /* Vertical */

        for (
            let col = 0;
            col < cols;
            col++
        ) {

            for (
                let row = 0;
                row < rows - 1;
                row++
            ) {

                drawLine(
                    points[row][col],
                    points[row + 1][col],
                    proximity[row][col],
                    proximity[row + 1][col]
                );
            }
        }


        /* Nodes */

        for (
            let row = 0;
            row < rows;
            row++
        ) {

            for (
                let col = 0;
                col < cols;
                col++
            ) {

                const point =
                    points[row][col];


                const pr =
                    proximity[row][col];


                const t =
                    pr *
                    pr *
                    (3 - 2 * pr);


                const radius =
                    lerp(
                        NODE_BASE_RADIUS,
                        NODE_ACTIVE_RADIUS,
                        t
                    );


                /* Glow */

                if (t > 0.3) {

                    const glowRadius =
                        radius +
                        lerp(
                            0,
                            6,
                            (t - 0.3) / 0.7
                        );


                    const gradient =
                        ctx.createRadialGradient(
                            point.x,
                            point.y,
                            radius * 0.5,
                            point.x,
                            point.y,
                            glowRadius
                        );


                    gradient.addColorStop(
                        0,
                        `rgba(74,158,255,${(
                            t * 0.3
                        ).toFixed(3)})`
                    );


                    gradient.addColorStop(
                        1,
                        "rgba(74,158,255,0)"
                    );


                    ctx.beginPath();

                    ctx.arc(
                        point.x,
                        point.y,
                        glowRadius,
                        0,
                        Math.PI * 2
                    );


                    ctx.fillStyle =
                        gradient;

                    ctx.fill();
                }


                /* Node */

                ctx.beginPath();

                ctx.arc(
                    point.x,
                    point.y,
                    radius,
                    0,
                    Math.PI * 2
                );


                ctx.fillStyle =
                    lerpColor(
                        {
                            r: 255,
                            g: 255,
                            b: 255,
                            a: 0.2
                        },
                        {
                            r: 74,
                            g: 158,
                            b: 255,
                            a: 1
                        },
                        t
                    );


                ctx.fill();
            }
        }


        /* Ripple rings */

        for (const ripple of ripples) {

            ctx.beginPath();

            ctx.arc(
                ripple.x,
                ripple.y,
                Math.max(
                    0,
                    ripple.radius
                ),
                0,
                Math.PI * 2
            );


            ctx.strokeStyle =
                `rgba(100,180,255,${(
                    ripple.opacity *
                    0.28
                ).toFixed(3)})`;


            ctx.lineWidth = 1.5;

            ctx.stroke();
        }
    }


    /* ========================================
       ANIMATION
    ======================================== */

    function animate(now) {

        mouse.x =
            lerp(
                mouse.x,
                targetMouse.x,
                LERP_SPEED
            );


        mouse.y =
            lerp(
                mouse.y,
                targetMouse.y,
                LERP_SPEED
            );


        draw(now);

        requestAnimationFrame(
            animate
        );
    }


    requestAnimationFrame(
        animate
    );
}