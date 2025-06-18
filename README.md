# esl-backend

本專案為 Cloudflare Workers 後端服務，提供 AI 對話 API。

## 安裝依賴

```bash
yarn install
```

## 本地開發

啟動本地開發伺服器（需安裝 wrangler）：

```bash
yarn dev --remote
```

- 啟動後，預設會在 `http://localhost:8787` 提供服務。

## 部署到 Cloudflare Workers

```bash
yarn deploy
```

## API 測試

### 測試對話 API

啟動本地伺服器後，可用以下方式測試 API：

- 路徑：`/api/v1/dialog`
- 方法：`GET` 或 `POST`
- 範例：

```bash
curl http://localhost:8787/api/v1/dialog
```

會回傳 AI 對話的 JSON 結果。

### CORS 支援

- 允許來源：
  - http://localhost:9000
  - https://esl.alearn.org.tw

## 其他

- 請參考 `src/index.ts` 以了解 API 路由與 CORS 設定。
- 如需自訂 AI 模型或訊息，請修改 `src/index.ts` 內的相關程式碼。
