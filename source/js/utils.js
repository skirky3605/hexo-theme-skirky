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
  }
};
