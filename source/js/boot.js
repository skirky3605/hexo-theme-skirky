Skirky.boot = {};

Skirky.boot.registerEvents = function () {
  // 当窗口大小改变时重新生成并应用随机渐变颜色（可选）
  window.addEventListener("resize", Skirky.utils.applyRandomGradient);

  Pace.options.restartOnPushState = false;
  document.addEventListener('pjax:send', () => {
    Pace.restart();
  });
}

Skirky.boot.refresh = function () {
  Skirky.utils.registerCodeblock();
  Skirky.utils.registerActiveMenuItem();
  Skirky.utils.applyRandomGradient();
};

document.addEventListener("DOMContentLoaded", () => {
  Skirky.boot.registerEvents();
  Skirky.boot.refresh();
});