/// <reference path="utils.ts" />

(() => {
  Skirky.settings = {
    getValue(key) {
      const value = window.localStorage ?
        localStorage.getItem(key)
        : (() => {
          const cookies = document.cookie.split("; ");
          for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i];
            if (cookie.startsWith(`${key}=`)) {
              return cookie.substring(key.length + 1);
            }
          }
        })();
      if (typeof value !== "undefined" && value !== null) {
        return JSON.parse(value);
      }
    },
    setValue(key, value) {
      if (typeof value !== "undefined" && value !== null) {
        const json = JSON.stringify(value);
        if (window.localStorage) {
          localStorage.setItem(key, json);
        }
        else {
          document.cookie = `${key}=${json}; path=/; samesite=strict`;
        }
      }
    },
    clear() {
      if (window.localStorage) {
        localStorage.clear();
      }
      else {
        const cookies = document.cookie.split("; ");
        for (let i = 0; i < cookies.length; i++) {
          const cookie = cookies[i];
          const eqPos = cookie.indexOf("=");
          const name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
          document.cookie = `${name}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; samesite=strict`;
        }
      }
    },
    get theme() {
      return this.getValue("theme") || "system";
    },
    set theme(value) {
      this.setValue("theme", value);
    }
  }
  if (Skirky.settings.theme !== "system") {
    document.documentElement.style.colorScheme = Skirky.settings.theme;
  }
})();