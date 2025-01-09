Skirky.boot = {};

Skirky.boot.registerEvents = () => {
  if (CONFIG.serverworker) {
    navigator.serviceWorker?.register("/service-worker.js");
  }

  Skirky.utils.registerScrollPercent();
  Skirky.utils.registerSidebarPanel();

  // 当窗口大小改变时重新生成并应用随机渐变颜色（可选）
  addEventListener("resize", Skirky.utils.applyRandomGradient);

  Pace.options.restartOnPushState = false;
  document.addEventListener("pjax:send", Pace.restart);

  const sidebar = document.querySelectorAll('.sidebar-nav li');
  for (let i = 0; i < sidebar.length; i++) {
    sidebar[i].addEventListener("click", () => Skirky.utils.activateSidebarPanel(i));
  }
}

Skirky.boot.refresh = () => {
  Skirky.utils.registerActiveMenuItem();
  Skirky.utils.registerSidebarTOC();
  Skirky.utils.applyRandomGradient();
};

document.addEventListener("DOMContentLoaded", () => {
  Skirky.boot.registerEvents();
  Skirky.boot.refresh();
});