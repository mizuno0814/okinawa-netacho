(function () {
  // 記事カードの地域絞り込み
  var chips = document.querySelectorAll(".chip");
  var posts = document.querySelectorAll(".post");
  var empty = document.querySelector(".filter-empty");

  function applyArea(area) {
    var shown = 0;
    chips.forEach(function (c) {
      var active = c.getAttribute("data-area") === area;
      c.classList.toggle("is-active", active);
      c.setAttribute("aria-pressed", String(active));
    });
    posts.forEach(function (post) {
      var areas = (post.getAttribute("data-areas") || "").split(" ");
      var match = area === "all" || areas.indexOf(area) !== -1;
      post.hidden = !match;
      if (match) shown++;
    });
    if (empty) empty.hidden = shown > 0;
  }

  chips.forEach(function (chip) {
    chip.addEventListener("click", function () { applyArea(chip.getAttribute("data-area")); });
  });
  // ジャンル（カフェなど）の絞り込み
  function applyGenre(genre) {
    var shown = 0;
    chips.forEach(function (c) { c.classList.remove("is-active"); c.setAttribute("aria-pressed", "false"); });
    posts.forEach(function (post) {
      var genres = (post.getAttribute("data-genres") || "").split(" ");
      var match = genres.indexOf(genre) !== -1;
      post.hidden = !match;
      if (match) shown++;
    });
    if (empty) empty.hidden = shown > 0;
  }
  document.querySelectorAll("a[data-genre]").forEach(function (link) {
    link.addEventListener("click", function () { applyGenre(link.getAttribute("data-genre")); });
  });
  var params0 = new URLSearchParams(location.search);
  if (params0.get("genre")) applyGenre(params0.get("genre"));
  if (params0.get("area")) applyArea(params0.get("area"));

  // タブや地域カードのリンクから、絞り込み付きで新着へ移動
  document.querySelectorAll("a[data-area]").forEach(function (link) {
    link.addEventListener("click", function () { applyArea(link.getAttribute("data-area")); });
  });

  // 探す・メニューのパネル
  var openers = document.querySelectorAll("[data-open]");
  var lastOpener = null;
  function closePanels() {
    document.querySelectorAll(".panel").forEach(function (p) { p.hidden = true; });
    openers.forEach(function (b) { b.setAttribute("aria-expanded", "false"); });
    document.body.classList.remove("no-scroll");
    if (lastOpener) lastOpener.focus();
  }
  openers.forEach(function (btn) {
    btn.addEventListener("click", function () {
      var panel = document.getElementById(btn.getAttribute("data-open"));
      var wasOpen = !panel.hidden;
      closePanels();
      if (wasOpen) return;
      panel.hidden = false;
      btn.setAttribute("aria-expanded", "true");
      document.body.classList.add("no-scroll");
      lastOpener = btn;
      var first = panel.querySelector("input, a, button");
      if (first) first.focus();
    });
  });
  document.querySelectorAll(".panel").forEach(function (panel) {
    panel.addEventListener("click", function (e) {
      if (e.target === panel || e.target.hasAttribute("data-close") || e.target.tagName === "A") closePanels();
    });
  });
  document.addEventListener("keydown", function (e) { if (e.key === "Escape") closePanels(); });

  // キーワード検索（TOPページの記事カードを絞り込む）
  function applySearch(q) {
    q = (q || "").trim();
    if (!q || !posts.length) return;
    var shown = 0;
    chips.forEach(function (c) { c.classList.remove("is-active"); c.setAttribute("aria-pressed", "false"); });
    posts.forEach(function (post) {
      var match = post.textContent.indexOf(q) !== -1;
      post.hidden = !match;
      if (match) shown++;
    });
    if (empty) empty.hidden = shown > 0;
    var result = document.querySelector(".search-result");
    if (!result) {
      result = document.createElement("p");
      result.className = "search-result";
      var list = document.querySelector(".posts");
      list.parentNode.insertBefore(result, list);
    }
    result.textContent = "「" + q + "」の記事：" + shown + "件";
    var newSection = document.getElementById("new");
    if (newSection) newSection.scrollIntoView();
  }
  var searchForm = document.querySelector(".search-form");
  if (searchForm && posts.length) {
    searchForm.addEventListener("submit", function (e) {
      e.preventDefault();
      var q = searchForm.querySelector("input").value;
      closePanels();
      applySearch(q);
    });
  }
  var initialQ = new URLSearchParams(location.search).get("q");
  if (initialQ) applySearch(initialQ);
  // 地域を選び直したら検索結果の表示を消す
  document.querySelectorAll("[data-area]").forEach(function (el) {
    el.addEventListener("click", function () {
      var r = document.querySelector(".search-result");
      if (r) r.remove();
    });
  });

  // 注目記事のスライドと点の連動
  var track = document.querySelector(".pickup-track");
  var slides = document.querySelectorAll(".slide");
  var dots = document.querySelectorAll(".dot");
  if (track && slides.length && "IntersectionObserver" in window) {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var index = Array.prototype.indexOf.call(slides, entry.target);
        dots.forEach(function (d, i) {
          d.classList.toggle("is-active", i === index);
          d.setAttribute("aria-selected", String(i === index));
        });
      });
    }, { root: track, threshold: 0.6 });
    slides.forEach(function (s) { observer.observe(s); });
    dots.forEach(function (dot, i) {
      dot.addEventListener("click", function () {
        slides[i].scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
      });
    });
  }

  // Xでシェアするリンク（公開URLを自動で入れる）
  var shareX = document.getElementById("share-x");
  if (shareX) {
    var params = new URLSearchParams({
      text: "沖縄の暮らしを、ちょっとお得に、もっと楽しく。うちなーくらし便り",
      url: location.origin + location.pathname
    });
    shareX.href = "https://twitter.com/intent/tweet?" + params.toString();
  }

  // フッターの年
  var year = document.getElementById("year");
  if (year) year.textContent = new Date().getFullYear();
})();
