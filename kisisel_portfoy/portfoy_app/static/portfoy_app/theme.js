(() => {
    const key = "portfolio-theme";
    const root = document.documentElement;
    const themeColor = document.querySelector('meta[name="theme-color"]');

    function applyTheme(value) {
        const theme = value === "light" ? "light" : "dark";
        root.setAttribute("data-bs-theme", theme);
        if (themeColor) themeColor.content = theme === "light" ? "#f7f9fc" : "#14171c";

        const button = document.getElementById("theme-toggle");
        const label = document.getElementById("theme-toggle-label");
        const next = theme === "dark" ? "Açık" : "Koyu";
        if (button) {
            button.setAttribute("aria-label", `${next} temaya geç`);
            button.title = `${next} temaya geç`;
        }
        if (label) label.textContent = `${next} tema`;
    }

    // Apply the stored choice before the page paints to avoid a theme flash.
    let saved = "dark";
    try { saved = localStorage.getItem(key); } catch { /* Storage can be blocked. */ }
    applyTheme(saved);

    document.addEventListener("DOMContentLoaded", () => {
        const button = document.getElementById("theme-toggle");
        if (!button) return;
        applyTheme(root.getAttribute("data-bs-theme"));
        button.hidden = false;
        button.addEventListener("click", () => {
            const next = root.getAttribute("data-bs-theme") === "dark" ? "light" : "dark";
            applyTheme(next);
            try { localStorage.setItem(key, next); } catch { /* Still allow switching for this visit. */ }
        });
    });

    window.addEventListener("storage", (event) => {
        if (event.key === key || event.key === null) applyTheme(event.newValue);
    });
})();
