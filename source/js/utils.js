HTMLElement.prototype.wrap = function (wrapper) {
  this.parentNode.insertBefore(wrapper, this);
  this.parentNode.removeChild(this);
  wrapper.appendChild(this);
};

(function () {
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
  /**
   * @param {Element} element
   */
  registerCodeblock(element) {
    const inited = !!element;
    let figure;
    if (CONFIG.hljswrap) {
      figure = (inited ? element : document).querySelectorAll("figure.highlight");
    } else {
      figure = document.querySelectorAll("pre");
    }
    const hasList = typeof document.body.classList !== "undefined";
    for (let i = 0; i < figure.length; i++) {
      const element = figure[i];
      // Skip pre > .mermaid for folding and copy button
      if (element.querySelector(".mermaid")) return;
      if (!inited) {
        let span = element.querySelectorAll(".code .line span");
        if (span.length === 0) {
          // Hljs without line_number and wrap
          span = element.querySelectorAll("code.highlight span");
        }
        for (let j = 0; j < span.length; j++) {
          if (hasList) {
            const list = span[j].classList;
            for (let k = 0; k < list.length; k++) {
              const name = list[k];
              list.add("hljs-".concat(name));
              list.remove(name);
            }
          }
          else {
            var name = '';
            var list = span[j].className.split(" ");
            for (var k = 0; k < list.length; k++) {
              name += "hljs-".concat(list[k]);
            }
            span[j].className = name;
          }
        }
      }
    }
  },
  registerScrollPercent() {
    const backToTop = document.querySelector(".back-to-top");
    if (backToTop) {
      // For init back to top in sidebar if page was scrolled after page refresh.
      window.addEventListener("scroll", () => {
        const contentHeight = document.body.scrollHeight - window.innerHeight;
        const scrollPercent = contentHeight > 0 ? Math.min(100 * (window.scrollY ?? window.pageYOffset) / contentHeight, 100) : 0;
        const isShow = Math.round(scrollPercent) >= 5;
        if (typeof backToTop.classList === "undefined") {
          backToTop.className = "back-to-top accent" + (isShow ? " back-to-top-on" : '');
        }
        else {
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
        backToTop.querySelector("span").innerText = Math.round(scrollPercent) + '%';
      }, { passive: true });
    }
  },
  registerActiveMenuItem() {
    const items = document.querySelectorAll(".menu-item a[href]");
    const hasList = typeof document.body.classList !== "undefined";
    for (let i = 0; i < items.length; i++) {
      const target = items[i];
      const baseUrl = '/';
      const pathname = target.pathname[0] === baseUrl ? target.pathname : `/${target.pathname}`;
      const isSamePath = pathname === location.pathname || pathname === location.pathname.replace("index.html", '');
      const isSubPath = !target.pathname === baseUrl && location.pathname.startsWith(target.pathname);
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
