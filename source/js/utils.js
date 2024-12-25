HTMLElement.prototype.wrap = function (wrapper) {
  this.parentNode.insertBefore(wrapper, this);
  this.parentNode.removeChild(this);
  wrapper.appendChild(this);
};

(function () {
  const onPageLoaded = () => document.dispatchEvent(
    new Event("page:loaded", {
      bubbles: true
    })
  );

  if (document.readyState === "loading") {
    document.addEventListener("readystatechange", onPageLoaded, { once: true });
  } else {
    onPageLoaded();
  }
  document.addEventListener("pjax:success", onPageLoaded);
})();

Skirky.utils = {
  registerCodeblock(element) {
    const inited = !!element;
    let figure;
    if (CONFIG.hljswrap) {
      figure = (inited ? element : document).querySelectorAll("figure.highlight");
    } else {
      figure = document.querySelectorAll("pre");
    }
    figure.forEach(element => {
      // Skip pre > .mermaid for folding and copy button
      if (element.querySelector(".mermaid")) return;
      if (!inited) {
        let span = element.querySelectorAll(".code .line span");
        if (span.length === 0) {
          // Hljs without line_number and wrap
          span = element.querySelectorAll("code.highlight span");
        }
        span.forEach(s => {
          s.classList.forEach(name => {
            s.classList.replace(name, `hljs-${name}`);
          });
        });
      }
    });
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
    links.forEach(link => {
      const { color1: randomColor1, color2: randomColor2 } = getRandomColor();
      const gradient = `linear-gradient(135deg, ${randomColor1}, ${randomColor2})`;
      link.style.background = gradient;
    });
  }
};
