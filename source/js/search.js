(() => {
  if (typeof LocalSearch !== "undefined") {
    document.addEventListener("DOMContentLoaded", () => {
      if (!CONFIG.path) {
        // Search DB path
        console.warn("`hexo-generator-searchdb` plugin is not installed!");
        return;
      }

      const localSearch = new LocalSearch({
        path: CONFIG.path,
        top_n_per_article: CONFIG.localsearch.top_n_per_article,
        unescape: CONFIG.localsearch.unescape
      });

      /** @type {HTMLInputElement} */
      const input = document.querySelector("input.search-input");
      const container = document.querySelector(".search-result-container");

      function inputEventFunction() {
        if (!localSearch.isfetched) { return; }
        const searchText = input.value.trim().toLowerCase();
        const keywords = searchText.split(/[-\s]+/);
        let resultItems = [];
        if (searchText.length > 0) {
          // Perform local searching
          resultItems = localSearch.getResultItems(keywords);
        }
        if (keywords.length === 1 && keywords[0] === '') {
          container.innerHTML = '';
        }
        else if (!resultItems.length) {
          container.innerHTML = '<div class="search-stats">未找到搜索结果</div>';
        }
        else {
          resultItems.sort((left, right) =>
            left.includedCount !== right.includedCount
              ? right.includedCount - left.includedCount
              : left.hitCount !== right.hitCount
                ? right.hitCount - left.hitCount
                : right.id - left.id);

          container.innerHTML = `<div class="search-stats">找到 ${resultItems.length} 个搜索结果</div>
          <ul class="search-result-list">${resultItems.map(result => result.item).join('')}</ul>`;
          if (typeof pjax === "object") { pjax.refresh(container); }
        }
      };

      try { localSearch.highlightSearchWords(document.querySelector(".post-body")); } catch (error) { console.error(error); }

      input.addEventListener("input", inputEventFunction);
      window.addEventListener("search:loaded", inputEventFunction);

      // Handle and trigger popup window
      const elements = document.querySelectorAll(".popup-trigger");
      for (let i = 0; i < elements.length; i++) {
        const element = elements[i];
        if (element instanceof HTMLAnchorElement) {
          element.href = "javascript:void(0)";
        }
        element.addEventListener("click", () => {
          document.body.classList.add("search-active");
          // Wait for search-popup animation to complete
          setTimeout(input.focus, 500);
          if (!localSearch.isfetched) { localSearch.fetchData(); }
        });
      }

      // Monitor main search box
      function onPopupClose() {
        document.body.classList.remove("search-active");
      }

      document.querySelector(".search-pop-overlay").addEventListener("click", event => {
        if (event.target === document.querySelector(".search-pop-overlay")) {
          onPopupClose();
        }
      });
      document.querySelector(".popup-btn-close").addEventListener("click", onPopupClose);
      document.addEventListener('pjax:success', () => {
        try { localSearch.highlightSearchWords(document.querySelector('.post-body')); } catch (error) { console.error(error); }
        onPopupClose();
      });
      window.addEventListener('keydown', event => {
        if ((event.ctrlKey || event.metaKey) && event.key === 'k') {
          event.preventDefault();
          document.body.classList.add('search-active');
          setTimeout(input.focus, 500);
          if (!localSearch.isfetched) localSearch.fetchData();
        }
      });
      window.addEventListener('keyup', event => {
        if (event.key === 'Escape') {
          onPopupClose();
        }
      });

      window.localSearch = localSearch;
    });
  }
})();
