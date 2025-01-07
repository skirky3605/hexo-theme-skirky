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
  registerScrollPercent() {
    const backToTop = document.querySelector(".back-to-top");
    if (backToTop) {
      // For init back to top in sidebar if page was scrolled after page refresh.
      window.addEventListener("scroll", () => {
        const contentHeight = document.body.scrollHeight - window.innerHeight;
        const scrollPercent = contentHeight > 0 ? Math.min(100 * (window.scrollY ?? window.pageYOffset) / contentHeight, 100) : 0;
        const isShow = Math.round(scrollPercent) >= 5;
        if (backToTop.classList) {
          if (isShow) {
            if (!backToTop.classList.contains("back-to-top-on")) {
              backToTop.classList.add("back-to-top-on");
            }
          }
          else {
            if (backToTop.classList.contains("back-to-top-on")) {
              backToTop.classList.remove("back-to-top-on");
            }
          }
        }
        else {
          backToTop.className = "back-to-top accent" + (isShow ? " back-to-top-on" : '');
        }
        backToTop.querySelector("span").innerText = Math.round(scrollPercent) + '%';
      }, { passive: true });
    }
  },
  registerActiveMenuItem() {
    const items = document.querySelectorAll(".menu-item a[href]");
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
          if (target.classList.contains("menu-item-active")) {
            target.classList.remove("menu-item-active");
          }
        }
      }
      else {
        target.className = isSelect ? "menu-item-active" : '';
      }
    }
  },
  /**
   * @param {0 | 1} index
   */
  activateSidebarPanel(index) {
    const sidebar = document.querySelector(".sidebar-inner");
    const activeClassNames = ["sidebar-toc-active", "sidebar-overview-active"];
    if (sidebar.classList.contains(activeClassNames[index])) {
      return;
    }
    else if (sidebar.classList.contains(activeClassNames[1 - index])) {
      sidebar.classList.remove(activeClassNames[1 - index]);
    }
    sidebar.classList.add(activeClassNames[index]);
  },
  applyRandomGradient() {
    // 生成随机颜色，确保两种颜色的差异明显
    function getRandomColor() {
      const letters = "0123456789ABCDEF";
      let color1, color2;
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
    const links = document.querySelectorAll("a.random-link");
    for (let i = 0; i < links.length; i++) {
      const link = links[i];
      const { color1: randomColor1, color2: randomColor2 } = getRandomColor();
      const gradient = `linear-gradient(135deg, ${randomColor1}, ${randomColor2})`;
      link.style.background = gradient;
    }
  }
};
