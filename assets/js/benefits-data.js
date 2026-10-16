// 支援チェッカーのデータ（lifetime.html の一番上で使う）
// 載せるのは、公式ページで「いま申し込める・使える」と確認できた個人向けの制度だけ（スプレッドシート「支援制度リサーチ」の掲載済みの行と、lifetime.html の国の制度）。
// area: "all"＝県内どこでも／["那覇市", ...]＝その市町村だけ／{ except: ["那覇市"] }＝その市町村以外
// tags: どれか1つでも当てはまれば表示する条件（benefits.js の TAGS を参照）
// expires: 受付の最後の日（日本時間）。過ぎたら自動で表示しない。start: 受付が始まる日（前日までは「○/○から」と表示）
// 毎月の支援記事を更新したら、ここも同じ内容に更新する。
window.BENEFITS_CHECKED = "2026年10月12〜13日";
window.MUNICIPALITIES = {
  "那覇": ["那覇市"],
  "北部": ["名護市", "国頭村", "大宜味村", "東村", "今帰仁村", "本部町", "恩納村", "宜野座村", "金武町", "伊江村", "伊平屋村", "伊是名村"],
  "中部": ["宜野湾市", "沖縄市", "うるま市", "浦添市", "読谷村", "嘉手納町", "北谷町", "北中城村", "中城村", "西原町"],
  "南部": ["糸満市", "豊見城市", "南城市", "与那原町", "南風原町", "八重瀬町", "渡嘉敷村", "座間味村", "粟国村", "渡名喜村", "南大東村", "北大東村", "久米島町"],
  "宮古": ["宮古島市", "多良間村"],
  "八重山": ["石垣市", "竹富町", "与那国町"]
};
window.BENEFITS = [
  // ---------- 国の制度（県内どこでも） ----------
  { level: "国", name: "妊婦のための支援給付", amount: "妊娠届のあと5万円＋出産後に子ども1人につき5万円", who: "妊婦の方（所得制限なし）", apply: "市町村の窓口（妊娠届のときの面談のあと）", area: "all", tags: ["pregnant", "kid0"] },
  { level: "国", name: "出産育児一時金", amount: "原則50万円（子ども1人につき）", who: "健康保険に入っている方の出産", apply: "加入している健康保険（国民健康保険は市町村の国保窓口）", area: "all", tags: ["pregnant"], url: "https://www.mhlw.go.jp/stf/seisakunitsuite/bunya/kenkou_iryou/iryouhoken/shussan/index.html" },
  { level: "国", name: "出産手当金・育児休業給付金", amount: "産休・育休中の収入を支える給付", who: "働いている方の出産・育児", apply: "勤め先（出産手当金は健康保険、育児休業給付金はハローワーク）", area: "all", tags: ["pregnant", "kid0"] },
  { level: "国", name: "母子健康手帳・妊婦健診の公費負担", amount: "妊婦健診の費用を助成する受診票", who: "妊婦の方", apply: "市町村の窓口（こども家庭センターなど）", area: "all", tags: ["pregnant"] },
  { level: "国", name: "児童手当（0〜2歳）", amount: "月15,000円（第3子以降は30,000円）", who: "0〜2歳の子どもを育てている方", apply: "市町村（公務員は勤め先）", area: "all", tags: ["kid0"], url: "https://www.cfa.go.jp/policies/kokoseido/jidouteate/annai" },
  { level: "国", name: "児童手当（3歳〜高校生年代）", amount: "月10,000円（第3子以降は30,000円）", who: "3歳〜高校生年代の子どもを育てている方", apply: "市町村（公務員は勤め先）", area: "all", tags: ["kid3", "elem", "junior", "high"], url: "https://www.cfa.go.jp/policies/kokoseido/jidouteate/annai" },
  { level: "国", name: "こども医療費助成", amount: "病院にかかったときの自己負担を助成", who: "子ども（対象年齢は市町村によって違う）", apply: "市町村", area: "all", tags: ["kid0", "kid3", "elem", "junior", "high"] },
  { level: "国", name: "保育料の無償化（0〜2歳）", amount: "保育料が無償", who: "住民税非課税世帯の0〜2歳", apply: "市町村の保育の窓口", area: "all", tags: ["kid0"] },
  { level: "国", name: "幼児教育・保育の無償化（3〜5歳）", amount: "幼稚園・保育所・認定こども園の利用料が無償（認可外は上限あり）", who: "3〜5歳の子ども", apply: "市町村の保育の窓口", area: "all", tags: ["kid3"] },
  { level: "国", name: "就学援助", amount: "学用品費・給食費・修学旅行費などを援助", who: "小中学生の保護者（所得の基準あり）", apply: "市町村の教育委員会、または学校", area: "all", tags: ["elem", "junior"] },
  { level: "国", name: "高等学校等就学支援金", amount: "授業料を支援（公立全日制は年118,800円、私立全日制は上限年457,200円）。2026年度から所得制限なし", who: "高校生", apply: "通っている高校", area: "all", tags: ["high"], url: "https://www.gov-online.go.jp/tokusyu/mushouka_r8/index_html.html" },
  { level: "国", name: "高等教育の修学支援新制度", amount: "返済のいらない奨学金と授業料の減免（子ども3人以上の世帯は所得制限なしで減免）", who: "大学・専門学校に通う（進学する）方", apply: "高校（進学前の予約）、または進学先の奨学金窓口", area: "all", tags: ["univ"], url: "https://www.jasso.go.jp/shogakukin/kyufu/" },
  { level: "国", name: "国民年金保険料の学生納付特例", amount: "学生のあいだ、保険料を後払いにできる", who: "20歳以上の学生", apply: "市町村の国民年金窓口、または年金事務所", area: "all", tags: ["univ"] },
  { level: "国", name: "雇用保険の基本手当（失業給付）", amount: "次の仕事を探す間の生活を支える給付", who: "仕事をやめた方（雇用保険に入っていた方）", apply: "ハローワーク", area: "all", tags: ["job"] },
  { level: "国", name: "求職者支援訓練", amount: "無料の職業訓練。条件を満たすと月10万円の給付金も", who: "雇用保険を受けられない求職者など", apply: "ハローワーク（次の募集はハローワークで確認）", area: "all", tags: ["job"], url: "https://jsite.mhlw.go.jp/okinawa-roudoukyoku/riyousha_mokuteki_menu/kyushokuchu/oshirase/_120021_00004.html" },
  { level: "国", name: "高額療養費", amount: "1か月の医療費の自己負担が上限を超えたら、超えた分が戻る", who: "健康保険に入っている方", apply: "加入している健康保険（国保は市町村）", area: "all", tags: ["illness"] },
  { level: "国", name: "傷病手当金", amount: "給料の約3分の2", who: "会社員が病気やけがで働けないとき", apply: "勤め先の健康保険", area: "all", tags: ["illness"] },
  { level: "国", name: "児童扶養手当・ひとり親家庭等医療費助成", amount: "ひとり親家庭への手当と医療費の助成", who: "ひとり親家庭", apply: "市町村", area: "all", tags: ["single"] },
  { level: "国", name: "障害者手帳・自立支援医療・障害年金", amount: "手帳、医療費の助成、年金", who: "障がいのある方", apply: "市町村の障がい福祉の窓口（障害年金は年金事務所）", area: "all", tags: ["disability"] },
  { level: "国", name: "住居確保給付金", amount: "家賃相当額を一定期間支給", who: "仕事を失うなどで家賃が払えない方", apply: "市町村の生活の相談窓口（自立相談支援機関）", area: "all", tags: ["hardship"] },
  { level: "国", name: "特定健診・がん検診", amount: "少ない自己負担で健診が受けられる", who: "40歳以上（がん検診は市町村ごとの対象年齢）", apply: "加入している健康保険（国保は市町村）、がん検診は市町村", area: "all", tags: ["age40"] },
  { level: "国", name: "老齢年金", amount: "原則65歳から受け取れる（手続きが必要）", who: "65歳以上", apply: "年金事務所（街角の年金相談センターでも可）", area: "all", tags: ["senior"] },
  { level: "国", name: "介護保険のサービス", amount: "要介護認定を受けてサービスを利用", who: "介護が必要になった方", apply: "市町村の介護保険の窓口、地域包括支援センター", area: "all", tags: ["senior"] },

  // ---------- 沖縄県の制度 ----------
  { level: "県", name: "先進医療の不妊治療費助成", amount: "支払額の7割（1回上限7万円）", who: "県内（那覇市を除く）に住民登録のある夫婦", period: "2027/3/19まで（3月に終わる治療は4月末まで）", apply: "管轄の保健所（県 子育て支援課 098-866-2457）", area: { except: ["那覇市"] }, tags: ["fertility"], expires: "2027-04-30", url: "https://www.pref.okinawa.jp/iryokenko/kenko/1006303/1006171.html" },
  { level: "県", name: "不育症検査費用の助成", amount: "検査費用の7割（上限6万円）", who: "流産・死産が2回以上の方（那覇市を除く）", period: "2027/3/31まで", apply: "管轄の保健所（県 子育て支援課 098-866-2457）", area: { except: ["那覇市"] }, tags: ["fertility"], expires: "2027-03-31", url: "https://www.pref.okinawa.lg.jp/iryokenko/kenko/1006303/1006306.html" },
  { level: "県", name: "私立高校等の奨学のための給付金", amount: "授業料以外の教育費を給付（返済不要）", who: "私立高校等に通う生徒の保護者（所得要件あり）", period: "2026/10/30まで", apply: "原則電子申請（総務私学課 098-866-2074）", area: "all", tags: ["high"], expires: "2026-10-30", url: "https://www.pref.okinawa.lg.jp/kyoiku/gakko/1023180/1018620/1040680.html" },
  { level: "県", name: "遠距離等通学費補助金", amount: "通学費の一部を補助", who: "私立高校・私立中学などの生徒で、通学費が月1.5万円を超える方（所得要件あり）", period: "交付申請 2026/12/31まで", apply: "電子申請（総務私学課 098-866-2074）", area: "all", tags: ["high", "junior"], expires: "2026-12-31", url: "https://www.pref.okinawa.jp/kyoiku/gakko/1023180/1029927.html" },
  { level: "県", name: "移住支援金（東京圏からの移住）", amount: "2人以上の世帯100万円、単身60万円。18歳未満の子ども1人につき最大100万円加算", who: "東京23区に通算5年以上住んでいた方など（就業などの要件あり、転入後1年以内）。実施している市町村だけ", period: "予算の範囲内", apply: "移住先の市町村の窓口", area: ["本部町", "国頭村", "東村", "伊江村", "石垣市"], tags: ["move"], url: "https://www.pref.okinawa.jp/kurashikankyo/iju/1023708.html" },
  { level: "県", name: "UIJターン就職・転職活動の交通費支援（ちゅらっとターン）", amount: "交通費・宿泊費・移転費の50%（上限5万円、最大3回）", who: "県外に住んでいて、沖縄で就職活動をする方", apply: "県 雇用政策課 098-866-2324", area: "all", tags: ["move", "job"], url: "https://www.pref.okinawa.lg.jp/shigoto/koyorodo/1012003/1012013/1012016.html" },

  // ---------- 市町村の制度 ----------
  // 那覇
  { level: "那覇市", name: "先進医療の不妊治療費助成", amount: "7割助成", who: "夫婦のどちらかが那覇市民、妻43歳未満", period: "2027/3/31まで（3月に終わる治療は4/30まで）", apply: "那覇市保健所 地域保健課 098-853-7962", area: ["那覇市"], tags: ["fertility"], expires: "2027-04-30", url: "https://www.city.naha.okinawa.jp/nahahokenjyo/bosihoken/1006451/1006453.html" },
  { level: "那覇市", name: "不育症検査費用の助成", amount: "検査費用の7割（上限6万円）", who: "那覇市在住、流産・死産が2回以上", period: "2027/3/31まで", apply: "那覇市保健所 地域保健課 098-853-7962", area: ["那覇市"], tags: ["fertility"], expires: "2027-03-31", url: "https://www.city.naha.okinawa.jp/nahahokenjyo/bosihoken/1006451/1006457.html" },
  { level: "那覇市", name: "就学援助", amount: "学用品費（小11,630円・中22,730円）、給食費、修学旅行費など", who: "国公立小中学校に通う子の保護者（生活保護・非課税・準じる世帯）", period: "毎月末締切、最終2026/12/28", apply: "オンライン・学校・学務課", area: ["那覇市"], tags: ["elem", "junior"], expires: "2026-12-28", url: "https://www.city.naha.okinawa.jp/child/school/1006074/1010879.html" },
  { level: "那覇市", name: "高齢者インフルエンザ予防接種", amount: "自己負担1,000円（生活保護受給者等は無料）", who: "65歳以上、または60〜64歳で重い障がいがある方", period: "2027/3/31まで", apply: "届いた予診票と本人確認書類を持って医療機関へ", area: ["那覇市"], tags: ["senior"], expires: "2027-03-31", url: "https://www.city.naha.okinawa.jp/nahahokenjyo/yobosyurui/koureisyainnhuruennz.html" },
  { level: "那覇市", name: "高齢者の帯状疱疹・肺炎球菌ワクチン", amount: "帯状疱疹 組換え9,000円・生5,000円、肺炎球菌4,000円（自己負担）", who: "年度内に65歳になる方など", period: "令和8年度", apply: "届いた予診票を持って医療機関へ", area: ["那覇市"], tags: ["senior"], expires: "2027-03-31", url: "https://www.city.naha.okinawa.jp/nahahokenjyo/yobou/1007420/1006413.html" },
  { level: "那覇市", name: "高度IT資格取得等支援補助金", amount: "資格取得の経費の一部", who: "市民・市内中小企業の従事者", period: "2026/12/28まで", apply: "商工農水課 098-951-3212", area: ["那覇市"], tags: ["job"], expires: "2026-12-28", url: "https://www.city.naha.okinawa.jp/_res/projects/default_project/_page_/001/007/179/r8_koudoit_bosyuyoukou.pdf" },
  { level: "那覇市", name: "県外保育士移住費等支援", amount: "単身20万円、2人以上の世帯40万円", who: "県外から移住し、那覇市内の保育所等に就職する保育士", period: "2027/3/22まで", apply: "こども政策課 098-861-2110", area: ["那覇市"], tags: ["move", "job"], expires: "2027-03-22", url: "https://okihoiku.com/information/15169/" },
  // 北部
  { level: "名護市", name: "先進医療の不妊治療費助成（県への上乗せ）", amount: "1回上限7万円", who: "県の承認を受けた名護市民の夫婦", period: "2027/3/31まで", apply: "健康増進課 0980-53-1212（内線349）", area: ["名護市"], tags: ["fertility"], expires: "2027-03-31", url: "https://www.city.nago.okinawa.jp/kurashi/2026042100025/" },
  { level: "名護市", name: "住宅用太陽光発電システム設置補助", amount: "受給最大電力×1万円", who: "市内の自宅に設置した個人（10kW未満）", period: "2027/3/19 17時まで", apply: "環境対策課 0980-43-0101", area: ["名護市"], tags: ["solar"], expires: "2027-03-19", url: "https://www.city.nago.okinawa.jp/kurashi/2018072000178/" },
  { level: "名護市", name: "高齢者の帯状疱疹・肺炎球菌ワクチン", amount: "帯状疱疹 生2,000円・組換え1回5,000円、肺炎球菌は自己負担なし", who: "年度内に65歳になる方など", period: "令和8年度", apply: "届いた予診票を持って医療機関へ", area: ["名護市"], tags: ["senior"], expires: "2027-03-31", url: "https://www.city.nago.okinawa.jp/kurashi/2022061500037/file_contents/R8zissikeikaku.pdf" },
  { level: "名護市", name: "高齢者インフルエンザ・新型コロナ予防接種", amount: "自己負担額は市に確認（インフルエンザは1,000円の予定）", who: "65歳以上など", period: "2027/2/28まで（予定）", apply: "医療機関で接種", area: ["名護市"], tags: ["senior"], expires: "2027-02-28", url: "https://www.city.nago.okinawa.jp/kurashi/2022061500037/file_contents/R8zissikeikaku.pdf" },
  { level: "恩納村", name: "一般不妊治療費助成", amount: "保険診療の自己負担を年度13万円まで", who: "夫婦とも村に1年以上住所がある方", period: "3月〜翌2月分を3月までに申請", apply: "村の窓口", area: ["恩納村"], tags: ["fertility"], url: "https://www.vill.onna.okinawa.jp/sp/living/birth/1484705419/1563410554/" },
  { level: "伊是名村", name: "出産祝い金", amount: "子ども1人につき20万円", who: "子どもが生まれた世帯", period: "常時", apply: "企画政策課へ持参", area: ["伊是名村"], tags: ["pregnant", "kid0"], url: "https://vill.izena.okinawa.jp/lifeevent/ninshin/1612779115/" },
  // 中部
  { level: "沖縄市", name: "不妊治療費助成", amount: "生殖補助医療 1年度5万円／先進医療 1回上限5万円", who: "沖縄市に住民登録のある夫婦", period: "申請は原則3/31まで", apply: "こども家庭センター 098-939-1212", area: ["沖縄市"], tags: ["fertility"], expires: "2027-03-31", url: "https://www.city.okinawa.okinawa.jp/k029/contents/p00037.html" },
  { level: "沖縄市", name: "保育無償化の給付上限額の引き上げ", amount: "認可外など 0〜2歳 月45,700円・3〜5歳 月40,300円まで、預かり保育など1日490円まで", who: "保育の必要性の認定を受けて認可外保育施設などを使う世帯（0〜2歳は市民税非課税世帯）", period: "2026/10/1から", apply: "保育・幼稚園課 098-939-1212", area: ["沖縄市"], tags: ["kid0", "kid3"], url: "https://www.city.okinawa.okinawa.jp/k027/contents/p00047.html" },
  { level: "沖縄市", name: "住宅リフォーム支援事業補助金", amount: "対象経費の25%、上限25万円", who: "市内の住宅（建築後1年以上）を市内業者でリフォーム、総工事費20万円以上", period: "2026/12/28まで、先着約120件", apply: "交付決定後に着工。住まい建築課 098-894-6139", area: ["沖縄市"], tags: ["reform"], expires: "2026-12-28", url: "https://www.city.okinawa.okinawa.jp/k042/contents/p00027.html" },
  { level: "沖縄市", name: "空家等除却費補助金", amount: "解体費の4/5、上限70万円（4件程度）", who: "特定空家等・不良住宅の所有者・相続人など", period: "交付申請2027/1/8まで（事前調査は12/21まで）", apply: "住まい建築課 098-939-1212", area: ["沖縄市"], tags: ["build"], expires: "2027-01-08", url: "https://www.city.okinawa.okinawa.jp/k042/contents/p00029.html" },
  { level: "沖縄市", name: "住宅用太陽光発電システム設置補助金", amount: "1件5万円", who: "市内の自宅に設置した個人（2025/9/1〜2026/8/31に受給開始）", period: "2026/11/13まで（多いときは抽選）", apply: "環境課 098-939-1212（内線2227）", area: ["沖縄市"], tags: ["solar"], expires: "2026-11-13", url: "https://www.city.okinawa.okinawa.jp/k017-002/chiikikankyou/kankyou/energy/p00001.html" },
  { level: "沖縄市", name: "65歳以上のインフルエンザ予防接種", amount: "期間内の1回目は無料", who: "65歳以上など", period: "2027/2/28まで", apply: "医療機関で接種", area: ["沖縄市"], tags: ["senior"], expires: "2027-02-28", url: "https://www.city.okinawa.okinawa.jp/k029/contents/p00002.html" },
  { level: "宜野湾市", name: "就学援助（追加申請）", amount: "学用品費、給食費、修学旅行費、オンライン学習通信費など", who: "市内に住所がある、または市立小中学校に通う小1〜中3（所得の基準あり）", period: "毎月20日締切、最終2026/12/21", apply: "教育委員会 学務課", area: ["宜野湾市"], tags: ["elem", "junior"], expires: "2026-12-21", url: "https://www.city.ginowan.lg.jp/kosodate_kyoiku/kyoiku/4/3684.html" },
  { level: "宜野湾市", name: "住宅リフォーム支援事業（追加募集）", amount: "工事費の一部（金額は市に確認）", who: "市民", period: "2026/11/30まで、8件程度・先着順", apply: "建築指導課 098-893-4420", area: ["宜野湾市"], tags: ["reform"], expires: "2026-11-30", url: "https://www.city.ginowan.lg.jp/soshiki/kensetsu/kenchikushido/1/1/2/20263.html" },
  { level: "うるま市", name: "先進医療の不妊治療費助成（県への上乗せ）", amount: "年度7万円まで", who: "夫婦とも市民で、県の承認を受けた方", period: "2027/3/31まで", apply: "市の窓口", area: ["うるま市"], tags: ["fertility"], expires: "2027-03-31", url: "https://www.city.uruma.lg.jp/1005006000/contents/p000012.html" },
  { level: "うるま市", name: "高齢者等のインフルエンザ予防接種助成", amount: "自己負担1,000円（生活保護受給者は免除）", who: "65歳以上、または60〜64歳で重い障がいがある方", period: "2027/2/28まで", apply: "医療機関で接種", area: ["うるま市"], tags: ["senior"], expires: "2027-02-28", url: "https://www.city.uruma.lg.jp/1006002000/contents/30368.html" },
  { level: "うるま市", name: "若者就業支援プログラム", amount: "沖縄産業開発青年協会の受講料を全額支援（12種類の資格）", who: "15〜39歳の市民（非課税世帯・生活保護世帯など）", apply: "産業政策課 098-923-7611", area: ["うるま市"], tags: ["young"], url: "https://www.city.uruma.lg.jp/1007001000/contents/p000037.html" },
  { level: "うるま市", name: "合併処理浄化槽設置事業補助金", amount: "上限50万円（49基程度）", who: "下水道の計画区域外などで住宅に浄化槽を設置する方", period: "工事は2月末までに完了", apply: "交付決定前に着工しない。下水道課 098-973-7977", area: ["うるま市"], tags: ["build", "reform"], expires: "2027-02-28", url: "https://www.city.uruma.lg.jp/6001004000/contents/25290.html" },
  { level: "浦添市", name: "高齢者インフルエンザ予防接種", amount: "自己負担1,000円（生活保護受給者等は無料）", who: "令和8年度中に65歳以上になる方、または60〜64歳で重い障がいがある方", period: "2027/3/31まで", apply: "医療機関で接種", area: ["浦添市"], tags: ["senior"], expires: "2027-03-31", url: "https://www.city.urasoe.lg.jp/doc/62f3370ecfb333550bfecc11/" },
  { level: "浦添市", name: "加齢性難聴者の補聴器助成", amount: "上限25,000円（1人1回）、先着10名", who: "65歳以上で住民税非課税世帯、耳鼻科医が必要と認めた方", period: "2026/11/2から申込", apply: "いきいき高齢支援課で事前確認 098-876-1292", area: ["浦添市"], tags: ["senior"], start: "2026-11-02", url: "https://www.city.urasoe.lg.jp/doc/2026080400088" },
  { level: "嘉手納町", name: "定住促進事業（新築住宅等取得補助金）", amount: "新築1戸100万円／古い建物の解体費の1/2（上限50万円）", who: "新築住宅を取得し、2027/3/31までに住む方", period: "事前協議が必要", apply: "企画財政課 定住対策係 098-956-1111（内線244）", area: ["嘉手納町"], tags: ["build"], expires: "2027-03-31", url: "https://www.town.kadena.okinawa.jp/life/kur7775.html" },
  { level: "嘉手納町", name: "住宅リフォーム支援事業補助金", amount: "工事費の50%（上限 多世帯50万円・空き家30万円・その他20万円）、子育て世帯は最大30万円加算", who: "町内業者が施工、工事10万円以上、築10年超", period: "2026/12/18まで、先着順", apply: "工事前に申請。企画財政課 定住対策係 098-956-1111（内線244）", area: ["嘉手納町"], tags: ["reform"], expires: "2026-12-18", url: "https://www.town.kadena.okinawa.jp/life/kur7885.html" },
  { level: "北谷町", name: "高齢者インフルエンザ予防接種", amount: "1,000円で1回", who: "65歳以上", period: "2027/2/28まで", apply: "医療機関で接種", area: ["北谷町"], tags: ["senior"], expires: "2027-02-28", url: "https://www.chatan.jp/kenko_fukushi/kenko/yobosesshu/influenza.html" },
  { level: "西原町", name: "高齢者インフルエンザ・新型コロナ予防接種", amount: "自己負担 インフルエンザ1,000円・新型コロナ5,000円", who: "65歳以上、または60〜64歳で重い障がいがある方", period: "2027/2/28まで", apply: "医療機関で接種", area: ["西原町"], tags: ["senior"], expires: "2027-02-28", url: "https://www.town.nishihara.okinawa.jp/soshiki/9/1404.html" },
  // 南部
  { level: "豊見城市", name: "先進医療の不妊治療費助成（県への上乗せ）", amount: "1回7万円まで", who: "夫婦のどちらかが市民", period: "治療終了から1年以内", apply: "市の窓口", area: ["豊見城市"], tags: ["fertility"], url: "https://www.city.tomigusuku.lg.jp/soshiki/4/1020/gyomuannai/7/8351.html" },
  { level: "南城市", name: "高齢者インフルエンザ・新型コロナ予防接種", amount: "自己負担 インフルエンザ1,000円・新型コロナ5,000円（生活保護受給者等は無料）", who: "65歳以上、または60〜64歳で重い障がいがある方", period: "2027/2/28まで", apply: "医療機関で接種", area: ["南城市"], tags: ["senior"], expires: "2027-02-28", url: "https://www.city.nanjo.okinawa.jp/kosodate/kosodate/1579081720/1790294746/" },
  { level: "南風原町", name: "住宅リフォーム支援事業", amount: "工事費の20%、上限20万円", who: "町民で住宅の所有者、町内業者が施工、総工事費20万円以上", period: "2026/10/30まで、先着順", apply: "役場4階 まちづくり振興課 098-889-4412（交付決定前に着工しない）", area: ["南風原町"], tags: ["reform"], expires: "2026-10-30", url: "https://www.town.haebaru.lg.jp/soshiki/14/17050.html" },
  { level: "八重瀬町", name: "住宅リフォーム支援事業", amount: "工事費の20%、上限20万円", who: "町内の施工業者で自宅をリフォームする町民", period: "2027/1/31まで（予算がなくなれば終了の場合あり）", apply: "町の窓口（工事前の申請が必要）", area: ["八重瀬町"], tags: ["reform"], expires: "2027-01-31" },
  // 宮古
  { level: "宮古島市", name: "結婚新生活支援事業（ミャーク新婚ライフサポート）", amount: "上限80万円・50万円・20万円（年齢と所得で変わる）", who: "夫婦とも39歳以下の新婚世帯（講座の受講が必要）", period: "2027/3/4まで", apply: "市民協働課 0980-73-4905", area: ["宮古島市"], tags: ["newlywed"], expires: "2027-03-04", url: "https://www.city.miyakojima.lg.jp/soshiki/shityo/seikatukankyou/matitukuri/oshirase/2023-0629-1757-261.html" },
  { level: "宮古島市", name: "子ども・高齢者のインフルエンザ予防接種", amount: "子ども（1歳〜高校3年生）は全額公費、高齢者は上限3,500円を助成", who: "1歳〜高校3年生、65歳以上など", period: "2027/2/28まで", apply: "医療機関で接種（個別通知なし）", area: ["宮古島市"], tags: ["kid0", "kid3", "elem", "junior", "high", "senior"], expires: "2027-02-28", url: "https://www.city.miyakojima.lg.jp/soshiki/shityo/seikatukankyou/kenkou/oshirase/2020-1024-1705-78.html" },
  { level: "宮古島市", name: "難病・がん患者等の渡航費の一部助成", amount: "渡航費の一部（年度8回まで）", who: "島外で治療するがん・難病などの患者、未熟児養育医療の方", apply: "健康増進課 0980-73-1978", area: ["宮古島市"], tags: ["illness"], url: "https://www.city.miyakojima.lg.jp/soshiki/shityo/seikatukankyou/kenkou/oshirase/2026-0716-1458-78.html" },
  // 八重山
  { level: "石垣市", name: "すくすく応援クーポン券", amount: "1人24,000円分（おむつ・ミルク・ベビー服などに使える）", who: "生まれた翌月から1歳の誕生月までの子ども", period: "1歳の誕生日の前日まで申請", apply: "出産後面談のときに申請（母子健康手帳を持参）", area: ["石垣市"], tags: ["kid0"], url: "https://www.city.ishigaki.okinawa.jp/kurashi_gyosei/kosodate_kyoiku/kosodate/12519.html" },
  { level: "石垣市", name: "中学生の眼鏡購入補助金", amount: "眼鏡本体の上限7,000円（年度1回）", who: "市内の中学生で、眼科で眼鏡が必要とされた生徒", period: "2027/2/28の購入分まで", apply: "眼科の処方箋を持って指定販売店で申請", area: ["石垣市"], tags: ["junior"], expires: "2027-02-28", url: "https://www.city.ishigaki.okinawa.jp/kurashi_gyosei/kosodate_kyoiku/kosodate/9162.html" },
  { level: "石垣市", name: "住宅用太陽光発電システム設置補助金", amount: "1件3万円（多いときは抽選）", who: "市民、10kW未満（2025/10/1〜2026/9/30に受給契約）", period: "2026/10/31まで", apply: "環境課 0980-82-1285", area: ["石垣市"], tags: ["solar"], expires: "2026-10-31", url: "https://www.city.ishigaki.okinawa.jp/soshiki/kankyo/4/7683.html" },
  { level: "石垣市", name: "建築・土木関連資格取得推進補助金", amount: "資格取得費用の一部", who: "市内の建築・土木関連企業に勤める方", period: "2027/3/19まで（予算上限で終了）", apply: "市の窓口", area: ["石垣市"], tags: ["job"], expires: "2027-03-19", url: "https://www.city.ishigaki.okinawa.jp/soshiki/toshi_kensetsu/keikaku/11765.html" }
];
