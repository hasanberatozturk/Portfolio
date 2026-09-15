(() => {
    const sections = new Map(
        Array.from(document.querySelectorAll("main section[id]"), (section) => [
            `#${section.id}`, section,
        ])
    );

    function clearHash() {
        if (window.location.hash) {
            history.replaceState(history.state, "", window.location.pathname + window.location.search);
        }
    }

    function navigate(section) {
        // Keep keyboard navigation at the destination without adding it to the tab order.
        if (!section.hasAttribute("tabindex")) section.setAttribute("tabindex", "-1");
        section.focus({ preventScroll: true });
        section.scrollIntoView({ behavior: "instant", block: "start" });
        clearHash();
    }

    document.addEventListener("click", (event) => {
        if (event.defaultPrevented || event.button !== 0 || event.ctrlKey ||
            event.metaKey || event.shiftKey || event.altKey) return;

        const link = event.target.closest("a[href]");
        if (!link || link.hasAttribute("download") ||
            (link.target && link.target !== "_self")) return;

        const section = sections.get(link.getAttribute("href"));
        if (!section) return;

        event.preventDefault();
        navigate(section);
    });

    function followSharedSection() {
        const section = sections.get(window.location.hash);
        if (section) navigate(section);
    }

    // Wait for images before positioning an existing shared section link.
    if (document.readyState === "complete") followSharedSection();
    else window.addEventListener("load", followSharedSection, { once: true });
    window.addEventListener("hashchange", followSharedSection);
})();
