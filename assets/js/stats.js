(function () {
  // 訪問者数と記事の閲覧数（Supabase）。個人を特定する情報は送らない。
  // 同じブラウザでは、サイトの訪問は1日1回、記事は記事ごとに1日1回だけ数える。
  var URL = "https://hivuozshsnnenzjadtvn.supabase.co/rest/v1/rpc/";
  var KEY = "sb_publishable_mcH2XV2p1Pcxm-y5ICG2MQ_WTwTlQIs";

  function rpc(name, body) {
    return fetch(URL + name, {
      method: "POST",
      headers: { apikey: KEY, Authorization: "Bearer " + KEY, "Content-Type": "application/json" },
      body: JSON.stringify(body || {})
    }).then(function (r) { return r.ok ? r.text().then(function (t) { return t ? JSON.parse(t) : null; }) : Promise.reject(r.status); });
  }

  var jst = new Date(Date.now() + 9 * 60 * 60 * 1000);
  var day = jst.toISOString().slice(0, 10);
  var testing = /^(localhost|127\.0\.0\.1)$/.test(location.hostname); // 手元の確認では数えない
  function firstToday(key) {
    if (testing) return false;
    try {
      var k = "nt:" + key;
      if (localStorage.getItem(k) === day) return false;
      localStorage.setItem(k, day);
    } catch (e) { /* 保存できない環境でも数える */ }
    return true;
  }

  // 記事ページなら、その記事の閲覧を数える
  var m = location.pathname.match(/\/articles\/([a-z0-9-]+)\.html$/);
  if (m && firstToday("view:" + m[1])) rpc("track_view", { p_slug: m[1] }).catch(function () {});

  // サイトの訪問を数えて、一番上に小さく表示する
  var bar = document.createElement("p");
  bar.className = "visit-count";
  bar.setAttribute("aria-label", "このサイトの訪問者数");
  document.body.insertBefore(bar, document.body.firstChild);
  var visit = firstToday("visit") ? rpc("track_visit") : Promise.resolve();
  visit.catch(function () {}).then(function () { return rpc("get_site_visits"); }).then(function (rows) {
    var r = rows && rows[0];
    if (!r) return;
    bar.textContent = "訪問者数　累計 " + Number(r.total).toLocaleString("ja-JP") + "人／今日 " + Number(r.today).toLocaleString("ja-JP") + "人";
  }).catch(function () { bar.remove(); });

  // TOPのランキング（直近30日の閲覧数）
  var list = document.getElementById("ranking-list");
  if (!list) return;
  var note = document.getElementById("ranking-note");
  rpc("get_ranking", { p_days: 30, p_limit: 5 }).then(function (rows) {
    if (!rows || rows.length < 3) return; // データが少ないうちは編集部のおすすめのまま
    var cards = {};
    document.querySelectorAll("#new .post a.post-link").forEach(function (a) {
      var s = (a.getAttribute("href").match(/articles\/([a-z0-9-]+)\.html/) || [])[1];
      if (s && !cards[s]) cards[s] = a;
    });
    var html = "";
    rows.forEach(function (row) {
      var a = cards[row.slug];
      if (!a) return;
      var img = a.querySelector("img");
      var pin = a.querySelector(".pin");
      html += '<li><a href="' + a.getAttribute("href") + '">' +
        (img ? '<img src="' + img.getAttribute("src") + '" alt="" loading="lazy" width="960" height="640">' : "") +
        '<span class="ranking-title">' + a.querySelector("h3").textContent + "</span>" +
        '<span class="meta">' + (pin ? '<span class="pin">' + pin.textContent + "</span>" : "") + "</span></a></li>";
    });
    if (!html) return;
    list.innerHTML = html;
    list.classList.add("is-ranked");
    if (note) note.textContent = "直近30日に読まれた数の多い順です（毎回、開いた時点の数で並びます）。";
  }).catch(function () {});
})();
