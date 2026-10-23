(function () {
  // 「地域から探す」の地図（OpenStreetMap＋Leaflet）
  // 記事を公開したら、ここに場所を1件ずつ足す。cat は下の CATS のどれか。
  // 期間のある記事は expires（その日まで表示）をつける。過ぎたピンは表示せず、毎日の自動削除で消える。
  var CATS = {
    gourmet: { label: "グルメ", color: "#e0703a" },
    event: { label: "イベント", color: "#c2417a" },
    history: { label: "観光・歴史", color: "#7a5bc2" },
    scenery: { label: "絶景・夕日", color: "#1f8fb3" }
  };

  var PINS = [
    { name: "首里城", cat: "history", lat: 26.2170, lng: 127.7194, title: "首里城正殿 11/23公開 県民のための完全ガイド", url: "articles/naha-shurijo-guide.html" },
    { name: "那覇中央郵便局（沖縄そばの日フェスタ会場）", cat: "event", lat: 26.2051, lng: 127.6794, title: "10/17は沖縄そばの日。フェスタとスタンプラリー", url: "articles/okinawa-soba-day-2026.html", expires: "2026-11-30" },
    { name: "国際通り", cat: "event", lat: 26.2172, lng: 127.6910, title: "初音ミクが首里へ！「CHURA MIKU STREET 2026」", url: "articles/naha-chura-miku-street.html", expires: "2026-12-13" },
    { name: "瀬長島", cat: "scenery", lat: 26.1755, lng: 127.6427, title: "冬の沖縄の夕日は東京より約70分遅い", url: "articles/okinawa-sunset-calendar-2026.html", expires: "2026-12-31" },
    { name: "北谷公園サンセットビーチ", cat: "scenery", lat: 26.3132, lng: 127.7551, title: "冬の沖縄の夕日は東京より約70分遅い", url: "articles/okinawa-sunset-calendar-2026.html", expires: "2026-12-31" },
    { name: "残波岬", cat: "scenery", lat: 26.4405, lng: 127.7119, title: "冬の沖縄の夕日は東京より約70分遅い", url: "articles/okinawa-sunset-calendar-2026.html", expires: "2026-12-31" },
    { name: "首里金城町石畳道（那覇まちま～い）", cat: "history", lat: 26.2153, lng: 127.7148, title: "ガイドと歩く「那覇まちま～い」16コース", url: "articles/naha-machimai-2026.html", expires: "2027-03-31" },
    { name: "識名園（那覇まちま～い）", cat: "history", lat: 26.2041, lng: 127.7157, title: "ガイドと歩く「那覇まちま～い」16コース", url: "articles/naha-machimai-2026.html", expires: "2027-03-31" },
    { name: "第一牧志公設市場（那覇まちま～い）", cat: "history", lat: 26.2145, lng: 127.6883, title: "ガイドと歩く「那覇まちま～い」16コース", url: "articles/naha-machimai-2026.html", expires: "2027-03-31" },
    { name: "伊良部島（サシバの飛来数調査）", cat: "scenery", lat: 24.8344, lng: 125.1867, title: "沖縄の秋の合図は「ミーニシ」とサシバ", url: "articles/okinawa-mi-nishi-sashiba.html" },
    { name: "沖縄県立博物館・美術館", cat: "history", lat: 26.2272, lng: 127.6937, title: "県内の小中学生と70歳以上は常設展が無料。おきみゅーは金・土なら夜8時まで", url: "articles/naha-okimu-free-night.html" },
    { name: "名護博物館（重要無形文化財の秀作展）", cat: "history", lat: 26.5979, lng: 127.9879, title: "入場無料。名護博物館で全国の重要無形文化財の秀作展", url: "articles/nago-shusakuten-2026.html", expires: "2026-11-12" }
  ];

  var todayIso = new Date(Date.now() + 9 * 60 * 60 * 1000).toISOString().slice(0, 10);
  PINS = PINS.filter(function (p) { return !p.expires || p.expires >= todayIso; });

  var el = document.getElementById("area-map");
  if (!el || typeof L === "undefined") return;

  var narrow = window.matchMedia("(max-width: 767px)").matches;
  var map = L.map(el, {
    center: narrow ? [26.47, 127.85] : [26.42, 127.82],
    zoom: narrow ? 9 : 10,
    scrollWheelZoom: false,
    dragging: !L.Browser.mobile
  });
  map.attributionControl.setPrefix('<a href="https://leafletjs.com/" target="_blank" rel="noopener">Leaflet</a>');
  L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 18,
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener">OpenStreetMap</a>'
  }).addTo(map);

  function esc(s) {
    return String(s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; });
  }

  var markers = PINS.map(function (p) {
    var cat = CATS[p.cat];
    var icon = L.divIcon({
      className: "map-pin",
      html: '<span style="background:' + cat.color + '"></span>',
      iconSize: [26, 26],
      iconAnchor: [13, 26],
      popupAnchor: [0, -24]
    });
    var m = L.marker([p.lat, p.lng], { icon: icon, title: p.name });
    m.bindPopup(
      '<p class="map-pop-cat" style="color:' + cat.color + '">' + esc(cat.label) + "</p>" +
      '<p class="map-pop-name">' + esc(p.name) + "</p>" +
      '<a class="map-pop-link" href="' + esc(p.url) + '">' + esc(p.title) + "</a>"
    );
    m.cat = p.cat;
    m.addTo(map);
    return m;
  });

  // カテゴリーのボタン
  var bar = document.getElementById("map-filter");
  if (!bar) return;
  var counts = {};
  PINS.forEach(function (p) { counts[p.cat] = (counts[p.cat] || 0) + 1; });
  function addChip(key, label) {
    var b = document.createElement("button");
    b.type = "button";
    b.className = "chip" + (key === "all" ? " is-active" : "");
    b.setAttribute("data-cat", key);
    b.setAttribute("aria-pressed", key === "all" ? "true" : "false");
    if (key !== "all") b.style.setProperty("--dot", CATS[key].color);
    b.innerHTML = (key === "all" ? "" : '<i class="map-chip-dot"></i>') + esc(label);
    bar.appendChild(b);
  }
  addChip("all", "すべて");
  Object.keys(CATS).forEach(function (k) { if (counts[k]) addChip(k, CATS[k].label); });

  bar.addEventListener("click", function (e) {
    var b = e.target.closest("button[data-cat]");
    if (!b) return;
    var key = b.getAttribute("data-cat");
    bar.querySelectorAll("button").forEach(function (x) {
      var on = x === b;
      x.classList.toggle("is-active", on);
      x.setAttribute("aria-pressed", String(on));
    });
    map.closePopup();
    markers.forEach(function (m) {
      var show = key === "all" || m.cat === key;
      if (show && !map.hasLayer(m)) m.addTo(map);
      if (!show && map.hasLayer(m)) map.removeLayer(m);
    });
  });
})();
