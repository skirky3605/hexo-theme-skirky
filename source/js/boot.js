Skirky.boot = {};

Skirky.boot.registerEvents = () => {
  if (CONFIG.serverworker) {
    navigator.serviceWorker?.register("/service-worker.js");
  }

  Skirky.utils.registerScrollPercent();
  // 当窗口大小改变时重新生成并应用随机渐变颜色（可选）
  window.addEventListener("resize", Skirky.utils.applyRandomGradient);

  Pace.options.restartOnPushState = false;
  document.addEventListener("pjax:send", Pace.restart);
}

Skirky.boot.refresh = () => {
  Skirky.utils.registerActiveMenuItem();
  Skirky.utils.applyRandomGradient();
};

document.addEventListener("DOMContentLoaded", () => {
  Skirky.boot.registerEvents();
  Skirky.boot.refresh();
});