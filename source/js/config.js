if (!window.Skirky) window.Skirky = {};

(() => {
  const className = "html-config";

  /**
   * @param {string} name
   */
  function getConfig(name) {
    /** @type {HTMLScriptElement?} */
    const target = document.querySelector(`script.${className}[data-name="${name}"]`);
    if (!target) { return {}; }
    return JSON.parse(target.text || "{}");
  }

  const staticConfig = getConfig("main");

  if (typeof Proxy === "undefined") {
    window.CONFIG = {
      ...staticConfig,
      page: getConfig("page"),
    };
    document.addEventListener("pjax:success", () => window.CONFIG.page = getConfig("page"));
  }
  else {
    /** @type {Object<string, any>} */
    let variableConfig = {};

    /**
     * @param {string} name
     */
    function updateConfig(name) {
      variableConfig[name] = getConfig(name);
    }

    window.CONFIG = new Proxy({ ...staticConfig }, {
      get(overrideConfig, name) {
        let existing;
        if (name in staticConfig) {
          existing = staticConfig[name];
        }
        else {
          if (!(name in variableConfig)) { updateConfig(name); }
          existing = variableConfig[name];
        }

        // For unset override and mixable existing
        if (!(name in overrideConfig) && typeof existing === "object") {
          // Get ready to mix.
          overrideConfig[name] = {};
        }

        if (name in overrideConfig) {
          const override = overrideConfig[name];
          // When mixable
          if (typeof override === "object" && typeof existing === "object") {
            // Mix, proxy changes to the override.
            return new Proxy({ ...existing, ...override }, {
              set(target, prop, value) {
                target[prop] = value;
                override[prop] = value;
                return true;
              }
            });
          }
          return override;
        }

        // Only when not mixable and override hasn't been set.
        return existing;
      }
    });

    document.addEventListener("pjax:success", () => variableConfig = {});
  }
})();
