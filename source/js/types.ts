// config.ts
declare global {
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
  const CONFIG: GlobalConfig;
  interface Window {
    CONFIG: typeof CONFIG;
  }
}

// utils.ts
declare global {
  type Theme = "dark" | "light" | "system";
  const Skirky: {
    boot: {
      registerEvents: () => void;
      refresh: () => void;
    };
    utils: {
      sections: HTMLElement[];
      updateActiveNav(): void;
      registerScrollPercent(): void;
      registerActiveMenuItem(): void;
      registerSidebarTOC(): void;
      activateNavByIndex(index: number): void;
      activateSidebarPanel(index: 0 | 1): void;
      registerSidebarPanel(): void;
      applyRandomGradient(): void;
    };
    settings: {
      getValue(key: string): any;
      setValue(key: string, value: any): void;
      clear(): void;
      get theme(): Theme;
      set theme(value: Theme);
    };
  }
  interface Window {
    Skirky: Partial<typeof Skirky>;
  }
}

// boot.ts
declare global {
  const Pace: {
    options: {
      restartOnPushState: boolean;
    };
    restart: () => void;
  }
  interface Window {
    Pace: typeof Pace;
  }
}

// pjax.ts
import _Pjax from "@next-theme/pjax";
declare global {
  class Pjax extends _Pjax {
    executeScripts(elements: NodeListOf<HTMLScriptElement>): void;
  }
  const pjax: Pjax;
  interface Window {
    Pjax: typeof Pjax;
    pjax: Pjax;
  }
}

// search.ts
declare global {
  interface ReasultItem {
    item: string;
    id: number;
    hitCount: number;
    includedCount: number;
  }
  class LocalSearch {
    isfetched: boolean;
    constructor(config?: {
      path: string;
      unescape: boolean;
      top_n_per_article: number;
    });
    getResultItems(keywords: string[]): ReasultItem[];
    fetchData(): void;
    highlightSearchWords(body: Element): void;
  }
  const localSearch: LocalSearch;
  interface Window {
    localSearch: typeof localSearch;
  }
}

// fallback.ts
declare global {
  interface Document {
    documentMode: number;
  }
  interface HTMLStyleElement {
    styleSheet: {
      cssText: string;
    };
  }
}
