Skirky.boot = {};

Skirky.boot.refresh = function () {
  Skirky.utils.registerCodeblock();
};

document.addEventListener("DOMContentLoaded", () => {
  Skirky.boot.refresh();
});