const track = document.querySelector(".projects-track");

if (track) {
    let dragging = false;
    let startX = 0;
    let startScroll = 0;

    track.addEventListener("pointerdown", (event) => {
        // Dokunmatik kaydırmayı tarayıcı yönetsin.
        if (event.pointerType !== "mouse" || event.button !== 0) return;

        // Butonlar ve bağlantılar normal çalışsın.
        if (event.target.closest("a, button, input, textarea, select")) return;

        event.preventDefault();

        dragging = true;
        startX = event.clientX;
        startScroll = track.scrollLeft;

        track.classList.add("is-dragging");
        track.focus({ preventScroll: true });
        track.setPointerCapture(event.pointerId);
    });

    track.addEventListener("pointermove", (event) => {
        if (!dragging) return;

        const distance = event.clientX - startX;
        track.scrollLeft = startScroll - distance;
    });

    function stopDragging() {
        dragging = false;
        track.classList.remove("is-dragging");
    }

    track.addEventListener("pointerup", stopDragging);
    track.addEventListener("pointercancel", stopDragging);
    track.addEventListener("lostpointercapture", stopDragging);

    // Görsellerin ayrı bir dosya gibi sürüklenmesini engelle.
    track.addEventListener("dragstart", (event) => {
        event.preventDefault();
    });
}