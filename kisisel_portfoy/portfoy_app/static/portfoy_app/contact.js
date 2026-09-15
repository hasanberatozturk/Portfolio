(() => {
    const link = document.getElementById("email-contact");
    const feedback = document.getElementById("email-feedback");
    const fallback = document.getElementById("email-copy-fallback");
    if (!link || !feedback || !fallback) return;

    // Include iPads that report a desktop Safari user agent.
    const mobile = navigator.userAgentData?.mobile ||
        /Android|iPhone|iPad|iPod/i.test(navigator.userAgent) ||
        (/Macintosh/i.test(navigator.userAgent) && navigator.maxTouchPoints > 1);
    if (mobile) return;

    link.title = "E-posta adresini kopyala";
    const email = link.dataset.email;
    let resetTimer;
    let copying = false;

    function resetLabel() {
        link.textContent = email;
        link.style.minWidth = "";
    }

    link.addEventListener("click", async (event) => {
        if (event.button !== 0 || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
        event.preventDefault();
        if (copying) return;
        copying = true;
        clearTimeout(resetTimer);
        resetLabel();
        feedback.classList.add("visually-hidden");
        feedback.textContent = "";

        try {
            await navigator.clipboard.writeText(email);
            fallback.hidden = true;
            // Keep adjacent social links still while showing the confirmation.
            link.style.minWidth = `${link.getBoundingClientRect().width}px`;
            link.textContent = "Kopyalandı ✓";
            feedback.textContent = "E-posta adresi kopyalandı.";
            resetTimer = setTimeout(() => {
                resetLabel();
                feedback.textContent = "";
            }, 2000);
        } catch {
            feedback.classList.remove("visually-hidden");
            feedback.textContent = "Kopyalanamadı. Adresi aşağıdan kopyalayabilirsin.";
            fallback.hidden = false;
            fallback.focus();
            fallback.select();
        } finally {
            copying = false;
        }
    });
})();
