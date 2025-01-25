const baidu = () => {
  if (!window._hmt) { window._hmt = []; }

  document.addEventListener("pjax:success", () => {
    _hmt.push(["_trackPageview", location.pathname]);
  });
};

const google = {
  only_pageview: () => {
    if (CONFIG.hostname === location.hostname) {
      window.dataLayer = window.dataLayer || [];
      window.gtag = function () {
        dataLayer.push(arguments);
      };
      gtag("js", new Date());
      gtag("config", "${tracking_id}");

      document.addEventListener("pjax:success", () => {
        gtag("event", "page_view", {
          page_location: location.href,
          page_path: location.pathname,
          page_title: document.title
        });
      });
    }
  },
  default: () => {
    function sendPageView() {
      if (CONFIG.hostname !== location.hostname) { return; }
      const uid = localStorage.getItem("uid") || `${Math.random()}.${Math.random()}`;
      localStorage.setItem("uid", uid);
      fetch(
        "https://www.google-analytics.com/mp/collect?api_secret=${measure_protocol_api_secret}&measurement_id=${tracking_id}",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            client_id: uid,
            events: [
              {
                name: "page_view",
                params: {
                  page_location: location.href,
                  page_title: document.title
                }
              }
            ]
          }),
          mode: "no-cors"
        }
      );
    };
    document.addEventListener("pjax:complete", sendPageView);
    sendPageView();
  },
};

const growingio = () => {
  if (!window.gio) {
    window.gio = function () {
      if (!window.gio.q) {
        window.gio.q = [];
      }
      window.gio.q.push(arguments);
    };
  }

  gio("init", "${growingio_analytics}", {});
  gio("send");
};

const matomo = () => {
  if (!window._paq) {
    window._paq = [];
  }
  const _paq = window._paq;

  /* tracker methods like "setCustomDimension" should be called before "trackPageView" */
  _paq.push(["trackPageView"]);
  _paq.push(["enableLinkTracking"]);
  const url = "${server_url}";
  _paq.push(["setTrackerUrl", `${url}matomo.php`]);
  _paq.push(["setSiteId", "${site_id}"]);
  const script = (document.scripts || document.getElementsByTagName("script"))[0];
  const target = document.createElement("script");
  target.src = `${url}matomo.js`;
  target.async = true;
  script.parentNode.insertBefore(target, script);
};

const clarity = () => {
  if (!window.clarity) {
    window.clarity = function () {
      if (!window.clarity.q) {
        window.clarity.q = [];
      }
      window.clarity.q.push(arguments);
    };
  }
  const script = (document.scripts || document.getElementsByTagName("script"))[0];
  const target = document.createElement("script");
  target.src = "https://www.clarity.ms/tag/${clarity_analytics}";
  target.async = true;
  script.parentNode.insertBefore(target, script);
};

module.exports =
  /** @param {import("@types/hexo")} hexo */ async hexo => {
    const theme = hexo.theme.config;
    const results = [];
    if (theme.baidu_analytics) {
      results.push({
        path: `${theme.js}/third-party/analytics/baidu-analytics.js`,
        data: () => hexo.render.render({ text: `(${baidu})();`, engine: "js" })
      });
    }
    if (theme.google_analytics.tracking_id) {
      results.push({
        path: `${theme.js}/third-party/analytics/google-analytics.js`,
        data: () => hexo.render.render({ text: `(${theme.google_analytics.only_pageview ? google.only_pageview.toString().replace("${tracking_id}", theme.google_analytics.tracking_id) : google.default.toString().replace("${measure_protocol_api_secret}", theme.google_analytics.measure_protocol_api_secret).replace("${tracking_id}", theme.google_analytics.tracking_id)})();`, engine: "js" })
      });
    }
    if (theme.growingio_analytics) {
      results.push({
        path: `${theme.js}/third-party/analytics/growingio.js`,
        data: () => hexo.render.render({ text: `(${growingio.toString().replace("${growingio_analytics}", theme.growingio_analytics)})();`, engine: "js" })
      });
    }
    if (theme.matomo.enable) {
      results.push({
        path: `${theme.js}/third-party/analytics/matomo.js`,
        data: () => hexo.render.render({ text: `(${matomo.toString().replace("${server_url}", theme.matomo.server_url).replace("${site_id}", theme.matomo.site_id)})();`, engine: "js" })
      });
    }
    if (theme.clarity_analytics) {
      results.push({
        path: `${theme.js}/third-party/analytics/clarity.js`,
        data: () => hexo.render.render({ text: `(${clarity.toString().replace("${clarity_analytics}", theme.clarity_analytics)})();`, engine: "js" })
      });
    }
    return results;
  }