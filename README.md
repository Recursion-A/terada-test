# Movie API

## 🌱 概要
Recursion のチーム開発で制作した映画に関するアプリケーションです。

TMDB API を利用して独自の Web API を開発しました。

## 🏠 URL
[https://recursion-a.teradad41.com](https://recursion-a.teradad41.com)

## 📝 説明
この API はフロントエンドアプリケーションとデータベースをサポートし、映画に関連する情報と機能を提供します。

## 📘機能一覧
- 映画の検索と表示
- 映画の詳細情報の表示
- お気に入り映画の登録・削除
- レビューの表示と投稿
- サインアップ・ログイン・ログアウト

## 📍エンドポイント

### 公開エンドポイント
- `POST /api/signup`: ユーザー登録を行います。
- `POST /api/login`: ユーザーログインを行い、JWTトークンを取得します。
- `GET /api/movies/upcoming`: まもなく公開される映画の一覧を取得します。
- `GET /api/movies/now_playing`: 現在上映中の映画の一覧を取得します。
- `GET /api/movies/top_rated`: 高評価の映画の一覧を取得します。
- `GET /api/movies/details`: 映画の詳細情報を取得します。
- `GET /api/movies/search`: 映画を検索します。
- `GET /api/favorites`: ユーザーのお気に入り映画一覧を取得します。
- `GET /api/reviews/movie`: 特定の映画に対するレビューを取得します。

### 認証が必要なエンドポイント
これらのエンドポイントにはJWTトークンによる認証（サインアップ・ログイン）が必要です。

- `POST /api/favorites/add`: お気に入り映画を追加します。
- `POST /api/favorites/remove`: お気に入り映画を削除します。
- `POST /api/reviews/add`: 映画に対するレビューを追加します。
- `GET /api/reviews`: ユーザー自身によるレビューを取得します。

## 💾 使用技術
- フロントエンド：React, Vite
- バックエンド：Go（FW : Echo）
- データベース：MySQL
- インフラ：AWS EC2, Docker
- その他：Ubuntu, Nginx, JWT

## 📜 作成の経緯
- チーム開発（バックエンド）の経験を得る
- Go 言語を活用して、独自の WebAPIを開発する
- フロントエンド、バックエンド、データベースの機能を揃えたフルスタックのアプリを開発する
- AWS を活用してデプロイまで行う

## ⭐️ こだわった点
- **Docker による開発・本番環境の構築**: 一貫した開発環境を確保し、デプロイメントプロセスを容易にしました。
- **EC2 インスタンス上へのデプロイ**: AWSのEC2インスタンスと Nginx を利用して、安定したデプロイ環境を構築しました。
- **JWTを使ったユーザー認証**: セキュリティを重視した認証システムを実装しました。
- **React コンポーネントによるモダンなUI**: 効率的かつインタラクティブなユーザー体験を提供します。

## 📑 参考
- [TMDB](https://www.themoviedb.org/?language=ja)

## 👷 メンバー
<a href="https://github.com/Recursion-A/webAPI/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=recursion-a/webapi"
alt="contributors images" />
</a>
