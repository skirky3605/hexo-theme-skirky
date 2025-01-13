declare const CONFIG: {
  root: string;
};

declare const Skirky: {
  utils: {
    sections: HTMLElement[];
    updateActiveNav(): void;
    registerScrollPercent(): void;
    registerActiveMenuItem(): void;
    registerSidebarTOC(): void;
    activateNavByIndex(index: number): void;
    activateSidebarPanel(index: 0 | 1): void;
    registerSidebarPanel(): void;
    applyRandomGradient(): void;
  };
}

(() => {
  const onPageLoaded = () => {
    try {
      document.dispatchEvent(new Event("page:loaded", { bubbles: true }));
    }
    catch {
      const event = document.createEvent("HTMLEvents");
      event.initEvent("page:loaded", true, true);
      document.dispatchEvent(event);
    }
  };

  if (document.readyState === "loading") {
    document.addEventListener("readystatechange", onPageLoaded, { once: true });
  } else {
    onPageLoaded();
  }
  document.addEventListener("pjax:success", onPageLoaded);
})();

Skirky.utils = {
  sections: [],
  updateActiveNav() {
    if (!this.sections.length) { return; }
    const index = (() => {
      for (let i = 0; i < this.sections.length; i++) {
        if (this.sections[i]?.getBoundingClientRect().top > 58) {
          return i > 0 ? --i : i;
        }
      }
      return this.sections.length - 1;
    })();
    this.activateNavByIndex(index);
  },
  registerScrollPercent() {
    const backToTop = document.querySelector(".back-to-top");
    if (backToTop) {
      // For init back to top in sidebar if page was scrolled after page refresh.
      addEventListener("scroll", () => {
        const contentHeight = document.body.scrollHeight - innerHeight;
        const scrollPercent = contentHeight > 0 ? Math.min(100 * (window.scrollY ?? pageYOffset) / contentHeight, 100) : 0;
        const isShow = Math.round(scrollPercent) >= 5;
        if (backToTop.classList) {
          if (isShow) {
            if (!backToTop.classList.contains("back-to-top-on")) {
              backToTop.classList.add("back-to-top-on");
            }
          }
          else {
            backToTop.classList.remove("back-to-top-on");
          }
        }
        else {
          if (isShow) {
            if (!/(\s|^)back-to-top-on(\s|$)/.test(backToTop.className)) {
              backToTop.className += " back-to-top-on";
            }
            else {
              backToTop.className = backToTop.className.replace(/(\s|^)back-to-top-on(\s|$)/, '');
            }
          }
        }
        backToTop.querySelector("span")!.innerText = Math.round(scrollPercent) + '%';
        this.updateActiveNav();
      }, { passive: true });
    }
  },
  registerActiveMenuItem() {
    const items = document.querySelectorAll<HTMLAnchorElement>(".menu-item a[href]");
    const hasList = !!document.body.classList;
    for (let i = 0; i < items.length; i++) {
      const target = items[i];
      const pathname = target.pathname[0] === '/' ? target.pathname : `/${target.pathname}`;
      const isSamePath = pathname === location.pathname || pathname === location.pathname.replace("index.html", '');
      const isSubPath = !CONFIG.root.startsWith(target.pathname) && location.pathname.startsWith(target.pathname);
      const isSelect = target.hostname === location.hostname && (isSamePath || isSubPath);
      if (hasList) {
        if (isSelect) {
          if (!target.classList.contains("menu-item-active")) {
            target.classList.add("menu-item-active");
          }
        }
        else {
          target.classList.remove("menu-item-active");
        }
      }
      else {
        if (isSelect) {
          if (!/(^|\s)menu-item-active(\s|$)/.test(target.className)) {
            target.className += " menu-item-active";
          }
        }
        else {
          target.className = target.className.replace(/(^|\s)menu-item-active(\s|$)/g, '');
        }
      }
    }
  },
  registerSidebarTOC() {
    this.sections = [];
    const elements = document.querySelectorAll<HTMLAnchorElement>(".post-toc:not(.placeholder-toc) li a.nav-link");
    for (let i = 0; i < elements.length; i++) {
      const element = elements[i];
      const target = document.getElementById(decodeURI(element.getAttribute("href")!).replace('#', ''));
      if (!("scrollPadding" in document.documentElement.style)) {
        element.addEventListener("click", event => {
          event.preventDefault();
          const offset = target!.getBoundingClientRect().top + (window.scrollY ?? pageYOffset) - 48;
          if (history.pushState) {
            history.pushState(null, document.title, element.href);
          }
          else {
            location.hash = element.getAttribute("href")!;
          }
          scrollTo({
            top: offset,
            behavior: "smooth"
          });
        });
      }
      this.sections.push(target);
    }
    this.updateActiveNav();
  },
  activateNavByIndex(index) {
    const nav = document.querySelector(".post-toc:not(.placeholder-toc) .nav");
    if (!nav) { return; }

    const navItemList = nav.querySelectorAll(".nav-item");
    const target = navItemList[index];
    const hasList = !!target.classList;

    if (!target || (hasList ? target.classList.contains("active-current") : /(^|\s)active-current(\s|$)/.test(target.className))) { return; }

    const actives = nav.querySelectorAll(".active");
    for (let i = 0; i < actives.length; i++) {
      const navItem = actives[i];
      if (hasList) {
        navItem.classList.remove("active", "active-current");
      }
      else {
        navItem.className = navItem.className.replace(/(^|\s)active(\s|$)/g, '');
      }
    }
    if (hasList) {
      target.classList.add("active", "active-current");
    }
    else {
      target.className += " active active-current";
    }

    let activateEle = target.querySelector(".nav-child") || target.parentElement!;

    while (nav.contains(activateEle)) {
      if (hasList) {
        if (activateEle.classList.contains("nav-item")) {
          activateEle.classList.add("active");
        }
      }
      else {
        if (!/(^|\s)active(\s|$)/.test(activateEle.className)) {
          activateEle.className += " active";
        }
      }
      activateEle = activateEle.parentElement!;
    }
  },
  activateSidebarPanel(index) {
    const sidebar = document.querySelector(".sidebar-inner")!;
    const activeClassNames = ["sidebar-toc-active", "sidebar-overview-active"];
    if (sidebar.classList) {
      if (sidebar.classList.contains(activeClassNames[index])) {
        return;
      }
      sidebar.classList.remove(activeClassNames[1 - index]);
      sidebar.classList.add(activeClassNames[index]);
    }
    else {
      if (new RegExp(`(^|\\s)${activeClassNames[index]}(\\s|$)`).test(sidebar.className)) {
        return;
      }
      sidebar.className = sidebar.className.replace(new RegExp(`(^|\\s)${activeClassNames[1 - index]}(\\s|$)`, 'g'), '');
      sidebar.className += ` ${activeClassNames[index]}`;
    }
  },
  registerSidebarPanel() {
    if (!window.CSS || (!CSS?.supports("position", "sticky") && !CSS?.supports("position", "-webkit-sticky"))) {
      const column = document.querySelector(".column")!;
      const sidebar = document.querySelector(".sidebar-container") as HTMLElement;
      function onchange() {
        if (innerWidth > 767 && column.getBoundingClientRect().top < 40) {
          sidebar.style.position = "fixed";
          sidebar.style.width = "240px";
          return;
        }
        sidebar.style.position = '';
        sidebar.style.width = '';
      }
      addEventListener("scroll", onchange);
      addEventListener("resize", onchange);
    }
  },
  applyRandomGradient() {
    // 生成随机颜色，确保两种颜色的差异明显
    function getRandomColor() {
      const letters = "0123456789ABCDEF";
      let color1: string, color2: string;
      do {
        color1 = '#';
        color2 = '#';
        for (let i = 0; i < 6; i++) {
          color1 += letters[Math.floor(Math.random() * 16)];
          color2 += letters[Math.floor(Math.random() * 16)];
        }
      } while (Math.abs(parseInt(color1, 16) - parseInt(color2, 16)) < 0x333333); // 确保两种颜色的差异明显
      return { color1, color2 };
    }
    const links = document.querySelectorAll<HTMLAnchorElement>("a.random-link");
    for (let i = 0; i < links.length; i++) {
      const link = links[i];
      const { color1: randomColor1, color2: randomColor2 } = getRandomColor();
      const gradient = `linear-gradient(135deg, ${randomColor1}, ${randomColor2})`;
      link.style.background = gradient;
    }
  }
};
