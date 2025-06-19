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
- 方法：`POST`
- Content-Type：`application/json`

#### POST 請求範例

**範例 1：首次對話**


```bash
curl -X POST http://localhost:8787/api/v1/dialog \
  -H "Content-Type: application/json" \
  -d '{
    "topic": "到Subway點餐",
    "history": [],
    "prompt": "請問12吋蛋沙拉堡的英文怎麼說？"
  }'
```

**範例 2：包含歷史對話**

```bash
curl -X POST http://localhost:8787/api/v1/dialog \
  -H "Content-Type: application/json" \
  -d '{
    "topic": "到Subway點餐",
    "history": ["請問12吋蛋沙拉堡的英文怎麼說？"],
    "prompt": "我要如何跟店員說我在練英文？"
  }'
```

**預期回應格式**：

```json
{
  "topic": "到Subway點餐",
  "response": "12吋蛋沙拉堡的英文是 12-inch egg mayo sub..."
}
```

#### 測試其他情境

**在咖啡廳點餐**：

```bash
curl -X POST http://localhost:8787/api/v1/dialog \
  -H "Content-Type: application/json" \
  -d '{
    "topic": "在咖啡廳點餐",
    "history": [],
    "prompt": "我想要一杯拿鐵和一個可頌麵包，英文怎麼說？"
  }'
```

#### 錯誤處理測試

**缺少必要欄位**：

```bash
curl -X POST http://localhost:8787/api/v1/dialog \
  -H "Content-Type: application/json" \
  -d '{
    "topic": "到Subway點餐"
  }'
```

會回傳錯誤：`{"error": "topic 和 prompt 是必要欄位"}`

### CORS 支援

- 允許來源：
  - http://localhost:9000
  - https://esl.alearn.org.tw

## 其他

- 請參考 `src/index.ts` 以了解 API 路由與 CORS 設定。
- 如需自訂 AI 模型或訊息，請修改 `src/index.ts` 內的相關程式碼。
