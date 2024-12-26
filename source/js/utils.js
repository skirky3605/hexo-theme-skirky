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
    var hasList = typeof document.body.classList !== "undefined";
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
