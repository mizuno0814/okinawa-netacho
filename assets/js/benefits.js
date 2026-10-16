// 支援チェッカー：年齢・家族・住んでいる市町村から、いま使える支援制度を表示する
// 入力した内容はこのブラウザの中だけで使い、どこにも送らず保存もしない。データは benefits-data.js
(function () {
  var form = document.getElementById("checker-form");
  if (!form || !window.BENEFITS) return;
  var out = document.getElementById("checker-result");
  var citySel = document.getElementById("checker-city");

  // 市町村の選択肢（先頭に「全地域」。地域ごとにまとめる）
  var allOpt = document.createElement("option");
  allOpt.value = "ALL"; allOpt.textContent = "全地域（住んでいる地域に関係なく使える制度）";
  citySel.appendChild(allOpt);
  Object.keys(window.MUNICIPALITIES).forEach(function (region) {
    var g = document.createElement("optgroup");
    g.label = region;
    window.MUNICIPALITIES[region].forEach(function (c) {
      var o = document.createElement("option");
      o.value = c; o.textContent = c; g.appendChild(o);
    });
    citySel.appendChild(g);
  });

  var jst = new Date(Date.now() + 9 * 60 * 60 * 1000);
  var today = jst.toISOString().slice(0, 10);

  function regionOf(city) {
    for (var r in window.MUNICIPALITIES) if (window.MUNICIPALITIES[r].indexOf(city) >= 0) return r;
    return "";
  }
  var ARTICLE = { "那覇": "naha", "北部": "north", "中部": "central", "南部": "south", "宮古": "islands", "八重山": "islands" };

  function inArea(b, city) {
    if (b.area === "all") return true;
    if (city === "ALL") return false; // 全地域：県内どこでも使える制度だけ
    if (Array.isArray(b.area)) return b.area.indexOf(city) >= 0;
    if (b.area && b.area.except) return b.area.except.indexOf(city) < 0;
    return false;
  }
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }
  function md(iso) { var p = iso.split("-"); return Number(p[1]) + "/" + Number(p[2]); }

  function activeTags() {
    var tags = {};
    form.querySelectorAll("input[type=checkbox]:checked").forEach(function (c) { tags[c.value] = true; });
    var age = parseInt(form.elements.age.value, 10);
    if (!isNaN(age)) {
      if (age >= 65) tags.senior = true;
      if (age >= 40) tags.age40 = true;
      if (age >= 15 && age <= 39) tags.young = true;
    }
    return tags;
  }

  function card(b, city) {
    var soon = b.expires && (new Date(b.expires) - new Date(today)) / 86400000 <= 14;
    var html = '<li class="checker-item">';
    html += '<p class="checker-level">' + esc(b.level === "国" ? "国の制度" : b.level === "県" ? "沖縄県" : b.level) +
      (b.start && b.start > today ? '<span class="checker-tag checker-tag--start">' + md(b.start) + "から受付</span>" : "") +
      (soon ? '<span class="checker-tag checker-tag--soon">締切 ' + md(b.expires) + "</span>" : "") + "</p>";
    html += "<h3>" + esc(b.name) + "</h3>";
    html += '<p class="checker-amount">' + esc(b.amount) + "</p>";
    html += '<dl class="checker-dl"><dt>対象</dt><dd>' + esc(b.who) + "</dd>";
    if (b.period) html += "<dt>期間</dt><dd>" + esc(b.period) + "</dd>";
    html += "<dt>申し込み</dt><dd>" + esc(b.apply) + "</dd></dl>";
    var links = [];
    if (b.url) links.push('<a href="' + esc(b.url) + '" target="_blank" rel="noopener">公式ページ</a>');
    if (b.level !== "国") {
      var a = b.level === "県" ? "pref" : ARTICLE[regionOf(city)];
      if (a) links.push('<a href="articles/support-' + a + '-2026-10.html">記事で詳しく</a>');
    }
    if (links.length) html += '<p class="checker-links">' + links.join("") + "</p>";
    return html + "</li>";
  }

  function render() {
    var city = citySel.value;
    var tags = activeTags();
    if (!city) { out.innerHTML = '<p class="checker-msg">住んでいる市町村を選んでください。</p>'; return; }
    if (!Object.keys(tags).length) { out.innerHTML = '<p class="checker-msg">年齢を入れるか、当てはまるものにチェックを入れてください。</p>'; return; }
    var hits = window.BENEFITS.filter(function (b) {
      if (b.expires && b.expires < today) return false;
      if (!inArea(b, city)) return false;
      return b.tags.some(function (t) { return tags[t]; });
    });
    var groups = [
      { title: (city === "ALL" ? "市町村" : city) + "の制度", items: hits.filter(function (b) { return b.level !== "国" && b.level !== "県"; }) },
      { title: "沖縄県の制度", items: hits.filter(function (b) { return b.level === "県"; }) },
      { title: "国の制度（どの市町村でも）", items: hits.filter(function (b) { return b.level === "国"; }) }
    ];
    var html = '<p class="checker-count"><strong>' + hits.length + "件</strong>の制度が見つかりました</p>";
    if (!hits.length) html += '<p class="checker-msg">条件に合う制度は見つかりませんでした。市町村の窓口に相談すると、ほかの制度が見つかることがあります。</p>';
    groups.forEach(function (g) {
      if (!g.items.length) return;
      html += '<h3 class="checker-group">' + esc(g.title) + "（" + g.items.length + "件）</h3><ul class=\"checker-list\">";
      g.items.forEach(function (b) { html += card(b, city); });
      html += "</ul>";
    });
    html += '<p class="checker-note">' + esc(window.BENEFITS_CHECKED) + "に各公式ページで確認した内容です。所得などの条件があるものも含みます。受けられるかどうかは、申し込む前に窓口や公式ページで確認してください。</p>";
    out.innerHTML = html;
  }

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    render();
    out.scrollIntoView({ behavior: "smooth", block: "start" });
  });
  form.addEventListener("reset", function () { setTimeout(function () { out.innerHTML = ""; }, 0); });
})();
