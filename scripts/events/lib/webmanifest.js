module.exports =
    /** @param {import("@types/hexo")} hexo */ hexo => {
    const theme = hexo.theme.config;
    const { enable, ...webmanifest } = theme.webmanifest;
    if (enable) {
      return {
        path: "manifest.webmanifest",
        data: JSON.stringify(webmanifest)
      }
    }
  }