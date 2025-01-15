/// <reference path="fallback.ts" />

interface StaticConfig {
  hostname: string;
  root: string;
  hljswrap: boolean;
  path: string;
  localsearch: {
    top_n_per_article: number;
    unescape: boolean;
  },
  serverworker: boolean
}

interface PageConfig {
  isHome: boolean;
  isPost: boolean;
  lang: string;
  permalink: string;
}

interface GlobalConfig extends StaticConfig {
  page: PageConfig;
}

declare const CONFIG: GlobalConfig;

(() => {
  if (!("Skirky" in window)) { (window as any).Skirky = {}; }

  const className = "html-config";

  interface ConfigMap {
    main: StaticConfig;
    page: PageConfig;
  }
  
  function getConfig<T extends keyof ConfigMap>(name: T) {
    const target = document.querySelector(`script.${className}[data-name="${name}"]`) as HTMLScriptElement;
    if (!target) { return {} as ConfigMap[T]; }
    return JSON.parse(target.text || "{}") as ConfigMap[T];
  }

  const staticConfig = getConfig("main");

  let CONFIG: GlobalConfig;
  if (typeof Proxy === "undefined") {
    CONFIG = {
      ...staticConfig,
      page: getConfig("page"),
    };
    document.addEventListener("pjax:success", () => CONFIG.page = getConfig("page"));
  }
  else {
    let variableConfig: ConfigMap = {} as ConfigMap;

    function updateConfig<T extends keyof ConfigMap>(name: T) {
      variableConfig[name] = getConfig(name);
    }

    CONFIG = new Proxy<StaticConfig>({ ...staticConfig }, {
      get<T extends keyof StaticConfig>(overrideConfig: StaticConfig, name: T) {
        let existing: StaticConfig[T];
        if (name in staticConfig) {
          existing = staticConfig[name];
        }
        else {
          if (!(name in variableConfig)) { updateConfig(name as keyof ConfigMap); }
          existing = variableConfig[name as keyof ConfigMap] as unknown as StaticConfig[T];
        }

        // For unset override and mixable existing
        if (!(name in overrideConfig) && typeof existing === "object") {
          // Get ready to mix.
          overrideConfig[name] = {} as StaticConfig[T];
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
    }) as GlobalConfig;

    document.addEventListener("pjax:success", () => variableConfig = {} as ConfigMap);
  }

  (window as any).CONFIG = CONFIG;
})();
