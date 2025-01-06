const { createHash } = require("crypto");

const serviceWorker = () => {
  /* Manifest version: ${version} */

  self.importScripts("./service-worker-assets.js");
  self.addEventListener("install", event => event.waitUntil(onInstall(event)));
  self.addEventListener("activate", event => event.waitUntil(onActivate(event)));
  self.addEventListener("fetch", event => event.respondWith(onFetch(event)));

  const cacheNamePrefix = "offline-cache-";
  const cacheName = `${cacheNamePrefix}${self.assetsManifest.version}`;
  const offlineAssetsInclude = [/\.wasm$/, /\.js$/, /\.css$/, /search\.xml$/, /^index\.html$/];

  // Replace with your base path if you are hosting on a subfolder. Ensure there is a trailing "/".
  const base = "${root}";
  const baseUrl = new URL(base, self.origin);
  /** @type {{ version: string, assets: { hash: string, url: string }[] }} */
  const assetsManifest = self.assetsManifest;
  const assetsList = assetsManifest.assets.map(asset => { return { hash: asset.hash, relative: asset.url, absolute: new URL(asset.url, baseUrl) }; });

  async function onInstall(_) {
    console.info("Service worker: Install");

    // Fetch and cache all matching items from the assets manifest
    const assetsRequests = assetsList
      .filter(asset => offlineAssetsInclude.some(pattern => pattern.test(asset.relative)))
      .map(asset => new Request(asset.relative, { integrity: asset.hash, cache: "no-cache" }));
    await caches.open(cacheName).then(cache => cache.addAll(assetsRequests));
  }

  async function onActivate(_) {
    console.info("Service worker: Activate");

    // Delete unused caches
    const cacheKeys = await caches.keys();
    await Promise.all(cacheKeys
      .filter(key => key.startsWith(cacheNamePrefix) && key !== cacheName)
      .map(key => caches.delete(key)));
  }

  /**
   * @param {{ request: Request }} event
   */
  async function onFetch(event) {
    if (event.request.method === "GET") {
      const shouldServeIndexHtml = event.request.url.endsWith("/");
      const request = shouldServeIndexHtml ? new Request(new URL("index.html", event.request.url)) : event.request;
      const cache = await caches.open(cacheName);
      const cachedResponse = await cache.match(request);
      if (cachedResponse) {
        return cachedResponse;
      }
      else {
        const asset = assetsList.find(asset => asset.absolute.href === request.url);
        if (asset) {
          await cache.add(new Request(asset.relative, { integrity: asset.hash, cache: "no-cache" }));
          const response = await cache.match(request);
          if (response) {
            console.info(`Service worker: Fetched and cached ${request.url}`);
            return response;
          }
        }
      }
    }
    return fetch(event.request);
  }
}

const version = (() => {
  const data = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
  let date = Date.now();
  let version = '';
  while (date) {
    version = data[date % data.length] + version;
    date = Math.floor(date / data.length);
  }
  return version;
})();

module.exports =
  /** @param {import("@types/hexo")} hexo */ async hexo => {
    if (!hexo.theme.config.service_worker.enable) {
      return;
    }

    const route = hexo.route;
    const routeList = route.list();

    const assets = await Promise.all(routeList.map(path => {
      return new Promise((/** @type {(value: { hash: string, url: string }) => void} */ resolve, rejects) => {
        const assetPath = route.get(path);
        /** @type {Buffer[]} */
        const buffers = [];
        assetPath.on("data", chunk => buffers.push(chunk));
        assetPath.on("end", () => {
          try {
            const hash = createHash("sha256");
            hash.update(Buffer.concat(buffers));
            const integrity = `sha256-${hash.digest("base64")}`;
            resolve({ hash: integrity, url: path });
          }
          catch (ex) {
            rejects(ex);
          }
        });
      });
    }));

    const worker = `(${serviceWorker.toString().replace("${version}", version).replace("${root}", hexo.config.root)})();`;

    route.set("service-worker.js", await hexo.render.render({ text: worker, engine: "js" }));
    route.set("service-worker-assets.js", await hexo.render.render({ text: `self.assetsManifest = ${JSON.stringify({ version, assets })};`, engine: "js" }));
  }