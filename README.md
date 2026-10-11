# うちなーくらし便り（サイトのファイル）

沖縄に住む人のための暮らし情報サイトです。HTMLとCSSだけの静的サイトなので、GitHub Pagesでそのまま公開できます。

## GitHubで公開する手順

1. GitHubで新しいリポジトリを作る（公開設定は Public）。
2. この `site` フォルダの中身（`index.html` や `assets` フォルダなど）を、リポジトリの一番上にアップロードする。`.nojekyll` も一緒にアップロードする。
3. リポジトリの「Settings」→「Pages」を開き、「Branch」で `main` と `/ (root)` を選んで保存する。
4. 数分後に表示される公開URL（例：`https://ユーザー名.github.io/リポジトリ名`）を開いて、表示を確認する。

## 公開URL

https://ravinala-oka.github.io/uchina-kurashi/

`index.html`、記事ページ、`robots.txt`、`sitemap.xml` には、この公開URLを設定済みです。

## 公開前にオーナーが決めること

- `about.html` の「お問い合わせ」：連絡先（お問い合わせフォームのURLかメールアドレス）

## ファイルの構成

| ファイル | 内容 |
|---|---|
| `index.html` | TOPページ |
| `about.html` | 運営者情報・お問い合わせ・免責事項 |
| `privacy.html` | プライバシーポリシー |
| `404.html` | ページが見つからないときの表示 |
| `assets/css/style.css` | デザイン |
| `assets/js/main.js` | スマホ用メニュー、カテゴリの絞り込み、Xでシェア |
| `assets/img/` | SNS用画像（ogp.png）、アイコン |
| `robots.txt` / `sitemap.xml` | 検索エンジン向けのファイル |
