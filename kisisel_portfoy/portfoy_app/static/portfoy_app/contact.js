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
    feedback.textContent = "Bilgisayarda tıklayınca e-posta adresi kopyalanır.";

    link.addEventListener("click", async (event) => {
        if (event.button !== 0 || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
        event.preventDefault();

        try {
            await navigator.clipboard.writeText(link.dataset.email);
            fallback.hidden = true;
            feedback.textContent = "E-posta adresi kopyalandı. E-posta hizmetinde alıcı alanına yapıştırabilirsin.";
        } catch {
            feedback.textContent = "Otomatik kopyalama yapılamadı. Aşağıdaki seçili adresi kopyalayabilirsin.";
            fallback.hidden = false;
            fallback.focus();
            fallback.select();
        }
    });
})();
