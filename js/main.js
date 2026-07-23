/**
 * main.js
 * ---------------------------------------------------
 * Lógica del carrusel 3D.
 *
 * Idea general:
 * 1. Tomamos todas las tarjetas (.carousel-card).
 * 2. Guardamos cuál es la tarjeta "activa" (la del centro).
 * 3. Por cada tarjeta calculamos qué tan lejos está de la
 *    activa (su "diff"): 0 = está en el centro,
 *    1 = un lugar a la derecha, -1 = un lugar a la
 *    izquierda, etc. Como el carrusel es circular,
 *    si la diferencia es muy grande la "recortamos"
 *    para que dé la vuelta (por ejemplo, de la última
 *    tarjeta a la primera).
 * 4. Según ese "diff", movemos la tarjeta con CSS
 *    (transform) y ajustamos su tamaño/opacidad.
 * ---------------------------------------------------
 */

// Esperamos a que todo el HTML esté cargado antes de tocarlo
document.addEventListener("DOMContentLoaded", () => {

    const cards = Array.from(document.querySelectorAll(".carousel-card"));
    const total = cards.length;

    // Si esta página no tiene carrusel (ej. la página de detalle),
    // no hacemos nada más.
    if (total === 0) return;

    let activeIndex = 0; // empezamos con la primera tarjeta al centro

    /**
     * Calcula la posición visual (transform) de cada tarjeta
     * según qué tan lejos esté de la tarjeta activa.
     */
    function actualizarCarrusel() {
        cards.forEach((card) => {
            const index = parseInt(card.dataset.index, 10);

            // Diferencia "cruda" entre esta tarjeta y la activa
            let diff = index - activeIndex;

            // Ajuste circular: si la diferencia es mayor a la mitad
            // del total, es más corto "dar la vuelta" por el otro lado
            if (diff > total / 2) diff -= total;
            if (diff < -total / 2) diff += total;

            const distanciaAbs = Math.abs(diff);

            // Espaciado horizontal entre tarjetas (en píxeles).
            // IMPORTANTE: usamos getComputedStyle en vez de
            // getBoundingClientRect. ¿Por qué? getBoundingClientRect
            // devuelve el tamaño YA con el "scale" aplicado (las
            // tarjetas de los costados están encogidas visualmente),
            // así que si cards[0] resultaba ser una tarjeta chica,
            // el espacio salía distinto cada vez que rotábamos el
            // carrusel (por eso se veían "juntándose y separando").
            // getComputedStyle, en cambio, siempre da el tamaño base
            // definido en el CSS, sin importar el scale aplicado.
            const anchoTarjeta = parseFloat(getComputedStyle(cards[0]).width);
            const espacio = anchoTarjeta + (window.innerWidth <= 600 ? 25 : 45);
            const x = diff * espacio;

            // Escala y opacidad según qué tan lejos esté del centro
            let escala = 1, opacidad = 1, zIndex = 10;

            if (distanciaAbs === 0) {
                escala = 1; opacidad = 1; zIndex = 10;
            } else if (distanciaAbs === 1) {
                escala = 0.85; opacidad = 0.8; zIndex = 8;
            } else if (distanciaAbs === 2) {
                escala = 0.7; opacidad = 0.45; zIndex = 6;
            } else {
                // tarjetas muy lejanas: las ocultamos
                escala = 0.6; opacidad = 0; zIndex = 1;
            }

            card.style.transform =
                `translate(-50%, -50%) translateX(${x}px) scale(${escala})`;
            card.style.opacity = opacidad;
            card.style.zIndex = zIndex;

            // Evita que se puedan "clicar" tarjetas invisibles
            card.style.pointerEvents = opacidad === 0 ? "none" : "auto";
        });
    }

    /**
     * Qué pasa al hacer clic en una tarjeta:
     * - Si es la tarjeta activa (la del centro) -> abre su ventana modal.
     * - Si es otra tarjeta -> la convierte en la nueva tarjeta activa.
     */
    cards.forEach((card) => {
        card.addEventListener("click", () => {
            const index = parseInt(card.dataset.index, 10);

            if (index === activeIndex) {
                abrirModal(card.dataset.slug);
            } else {
                activeIndex = index;
                actualizarCarrusel();
            }
        });
    });

    // Flechas de navegación (con módulo % para que el índice
    // nunca se salga del rango 0 a total-1)
    document.getElementById("btnNext").addEventListener("click", () => {
        activeIndex = (activeIndex + 1) % total;
        actualizarCarrusel();
    });

    document.getElementById("btnPrev").addEventListener("click", () => {
        activeIndex = (activeIndex - 1 + total) % total;
        actualizarCarrusel();
    });

    // Si la ventana cambia de tamaño (ej. giras el celular),
    // recalculamos el espaciado entre tarjetas.
    window.addEventListener("resize", actualizarCarrusel);

    // Primer renderizado al cargar la página
    actualizarCarrusel();


    /* =====================================================
       VENTANA MODAL (info + video)
       -----------------------------------------------------
       Estas funciones controlan la ventana que aparece al
       hacer clic en la tarjeta central del carrusel.
       ===================================================== */

    const modalOverlay = document.getElementById("modalOverlay");
    const modalCerrar  = document.getElementById("modalCerrar");
    const paneles = Array.from(document.querySelectorAll(".modal-panel"));

    /**
     * Muestra la ventana modal con la información del recurso
     * indicado (según su "slug", ej. "canva", "prezi", etc.)
     */
    function abrirModal(slug) {
        // 1. Ocultamos todos los paneles y mostramos solo el que coincide
        paneles.forEach((panel) => {
            panel.classList.toggle("visible", panel.dataset.slug === slug);
        });

        // 2. Mostramos el overlay oscuro + la ventana
        modalOverlay.classList.add("abierto");

        // 3. Evitamos que la página de atrás haga scroll mientras
        //    la ventana está abierta
        document.body.style.overflow = "hidden";
    }

    /**
     * Cierra la ventana modal y PAUSA cualquier video que
     * estuviera reproduciéndose (para que no siga sonando
     * de fondo una vez cerrada la ventana).
     */
    function cerrarModal() {
        modalOverlay.classList.remove("abierto");
        document.body.style.overflow = "";

        // Si había un video en pantalla completa, salimos de ese modo
        if (document.fullscreenElement) {
            document.exitFullscreen();
        }

        // Quitamos el respaldo CSS de maximizado, si estaba activo
        document.querySelectorAll(".video-wrapper.maximizado")
            .forEach((v) => v.classList.remove("maximizado"));

        // Pausamos TODOS los videos (no solo el visible, por seguridad)
        document.querySelectorAll(".video-wrapper video")
            .forEach((video) => video.pause());
    }

    // Botón "X" de la ventana
    modalCerrar.addEventListener("click", cerrarModal);

    // Clic en el fondo oscuro (fuera de la caja blanca) también cierra
    modalOverlay.addEventListener("click", (evento) => {
        if (evento.target === modalOverlay) cerrarModal();
    });

    // Tecla ESC: si el modal está abierto, lo cierra
    // (para salir de pantalla completa el navegador ya usa ESC solo)
    document.addEventListener("keydown", (evento) => {
        if (evento.key !== "Escape") return;
        if (modalOverlay.classList.contains("abierto")) cerrarModal();
    });

    /**
     * Botón "⛶" de cada video: pide pantalla completa NATIVA
     * al navegador (la misma que usan YouTube, Netflix, etc.)
     * usando la Fullscreen API. Si el navegador no la soporta
     * (muy raro hoy en día), usamos un respaldo con CSS que
     * agranda el video ocupando toda la pantalla igual.
     */
    document.querySelectorAll(".video-maximizar").forEach((boton) => {
        boton.addEventListener("click", () => {
            const wrapper = boton.closest(".video-wrapper");
            const video = wrapper.querySelector("video");

            // Detectamos el método correcto según el navegador
            const pedirFullscreen =
                video.requestFullscreen ||
                video.webkitRequestFullscreen || // Safari
                video.msRequestFullscreen;       // navegadores viejos de Windows

            if (pedirFullscreen) {
                pedirFullscreen.call(video);
            } else {
                // Respaldo: si el navegador no soporta la Fullscreen API,
                // agrandamos el contenedor con CSS
                wrapper.classList.toggle("maximizado");
            }
        });
    });
});
