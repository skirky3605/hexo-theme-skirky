/// <reference path="settings.ts" />

declare const Pace: {
  options: {
    restartOnPushState: boolean;
  };
  restart: () => void;
}

Skirky.boot = {
  registerEvents() {
    if (CONFIG.serverworker) {
      navigator.serviceWorker?.register("/service-worker.js");
    }

    Skirky.utils.registerScrollPercent();
    Skirky.utils.registerSidebarPanel();

    // 当窗口大小改变时重新生成并应用随机渐变颜色（可选）
    addEventListener("resize", Skirky.utils.applyRandomGradient);

    Pace.options.restartOnPushState = false;
    document.addEventListener("pjax:send", Pace.restart);

    const sidebar = document.querySelectorAll(".sidebar-nav li");
    for (let i = 0; i < sidebar.length; i++) {
      sidebar[i].addEventListener("click", () => Skirky.utils.activateSidebarPanel(i as 0 | 1));
    }

    if (!("scrollPadding" in document.documentElement.style)) {
      addEventListener("hashchange", () => {
        const tHash = location.hash ?? '';
        if (tHash !== '' && !tHash.match(/%\S{2}/)) {
          const target = document.getElementById(tHash.slice(1));
          if (target instanceof HTMLElement) {
            const offset = target.getBoundingClientRect().top + (window.scrollY ?? pageYOffset) - 48;
            scrollTo({
              top: offset,
              behavior: "smooth"
            });
          }
        }
      });
    }

    const themeToggle = document.querySelector(".menu-item-theme a");
    if (themeToggle instanceof HTMLAnchorElement) {
      themeToggle.addEventListener("click", () => Skirky.settings.theme = document.documentElement.style.colorScheme as Theme || "system");
      if (Skirky.settings.theme !== "system") {
        document.documentElement.style.colorScheme = Skirky.settings.theme;
        themeToggle.className = `toggle-${Skirky.settings.theme}`;
        themeToggle.title = Skirky.settings.theme === "dark" ? "深色" : "浅色";
      }
    }
  },
  refresh() {
    Skirky.utils.registerActiveMenuItem();
    Skirky.utils.registerSidebarTOC();
    Skirky.utils.applyRandomGradient();
  }
};

document.addEventListener("DOMContentLoaded", () => {
  Skirky.boot.registerEvents();
  Skirky.boot.refresh();
});