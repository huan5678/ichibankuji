# WEB 軟體開發規數明書

## 目錄

1. [專案概述](#專案概述)
2. [功能需求](#功能需求)
3. [技術架構](#技術架構)
4. [系統架構](#系統架構)
5. [前端開發規範](#前端開發規範)
6. [後端開發規範](#後端開發規範)
7. [資料庫設計](#資料庫設計)
8. [業務邏輯與流程](#業務邏輯與流程)
9. [附錄](#附錄)

---

## 專案概述

本專案目標是開發一個線上「一番賞」抽獎的網頁應用程式。使用者可以在網站上參與抽獎活動，贏取各式各樣的獎品。系統需要支援多種抽獎套組，每個套組包含多項獎品，並且要能管理獎品數量、抽獎次數限制等功能。此外，系統需要實作一個抽獎鎖定機制，確保使用者進行抽獎時，其他使用者無法同時抽取同一套組的獎品。

---

## 功能需求

### 1. 使用者管理

- 使用者註冊與登入功能
- 使用者資料管理（暱稱、頭像等）

### 2. 獎品管理

- 新增、編輯、刪除獎品
- 獎品資訊包含：名稱、圖片等

### 3. 抽獎套組管理

- 建立、編輯、刪除抽獎套組
- 設定套組的基本資訊：名稱、是否啟用、最大抽獎次數等
- 為套組新增獎品，並設定每個獎品的數量

### 4. 抽獎功能

- 使用者可以瀏覽可用的抽獎套組
- 使用者在套組啟用的情況下，可以參與抽獎
- 實作抽獎邏輯，包含獎品的隨機分配、數量控制等
- 每個套組有最大抽獎次數限制

### 5. 抽獎鎖定機制

- 當使用者開始抽取某個抽獎套組時，鎖定該套組
- 記錄鎖定的使用者、開始時間和持續時間
- 在鎖定期間，其他使用者無法抽取該套組
- 鎖定機制有逾時處理，鎖定到期後自動解除

### 6. 抽獎紀錄

- 記錄使用者的每次抽獎結果
- 顯示抽獎歷史，包含抽中的獎品、時間等

### 7. 前端介面

- 友善的使用者介面，展示獎品和抽獎套組的資訊
- 即時更新獎品剩餘數量和抽獎狀況

---

## 技術架構

### 前端

- **Nuxt 3**：基於 Vue 3 的伺服器端渲染框架
- **TypeScript**：具有強型別的 JavaScript 超集
- **shadcn-vue**：元件庫，提供可重複使用的 UI 元件
- **UnoCSS**：即時的原子化 CSS 引擎，提供高效能的樣式管理
- **JWToken**：使用者認證和權限管理

### 後端

- **Hono**：後端框架
- **TypeScript**：具有強型別的 JavaScript 超集
- **Prisma**：新一代的 ORM，簡化資料庫操作
- **PostgreSQL**：關聯式資料庫，用於儲存系統資料
- **JWToken**：使用者認證和權限管理
- **Swagger**：API 文件產生工具

---

好的，我們繼續改寫規格說明書的後半部分：

## 系統架構

系統採用前後端分離的架構：

- **前端**：使用 Nuxt 3 建置，負責頁面渲染和使用者互動。
- **後端**：提供 RESTful API，處理業務邏輯和資料管理。
- **資料庫**：使用 PostgreSQL，透過 Prisma 進行資料存取。

---

## 前端開發規範

### 使用技術

- **框架**：Nuxt 3
- **程式語言**：TypeScript
- **元件庫**：shadcn-vue
- **CSS**：UnoCSS

### 程式碼規範

- 遵循 TypeScript 的最佳實踐
- 元件化開發，提升程式碼重複使用性，元件使用原子最小化的開發模式
- 使用 shadcn-vue 提供的元件，確保 UI 一致性
- 樣式使用 UnoCSS，採用原子化 CSS 的方式
- 所有 Vue 檔案都必須使用 `<script setup lang="ts">`

### 功能實作

- 實作頁面路由，展示不同的功能頁面
- 與後端 API 互動，取得和提交資料
- 即時更新頁面資料，如獎品剩餘數量等
- 錯誤處理和使用者提示
- 需要製作管理者使用的後台頁面，需要有驗證使用者功能，並且有權限管理
- 需要製作使用者使用的前台頁面，需要有使用者登入功能，並且有使用者資料管理
- 需製作後台編輯頁面，讓管理者能夠管理獎品與套組，需要有編輯功能，並且有資料驗證功能

---

## 後端開發規範

### 使用技術

- **框架**：依據需求，優先使用 Hono.js，可選用 Express.js、NestJS 等 Node.js 框架
- **ORM**：Prisma
- **資料庫**：PostgreSQL

### 程式碼規範

- 使用 TypeScript 開發
- 遵循 SOLID 原則，撰寫可維護的程式碼
- 使用 Prisma 簡化資料庫操作
- 進行完整的錯誤處理和日誌記錄
- 採用模組化的程式碼結構，方便擴充和維護
- 使用 JWT Token 進行使用者認證和權限管理
- 使用 ESLint 進行程式碼格式化
- 使用 Jest 進行單元測試
- 使用 Swagger 產生 API 文件

### API 設計

- 採用 RESTful API 設計原則
- 定義清楚的路由和請求方法
- 回傳統一的回應格式，包含成功和錯誤情況

---

## 資料庫設計

### 資料庫概觀

資料庫使用 PostgreSQL，利用 Prisma 進行 ORM 對應。主要包含以下資料表：

1. `User`：使用者資料表
2. `Prize`：獎品資料表
3. `DrawSet`：抽獎套組資料表
4. `DrawSet_Prize`：抽獎套組與獎品關聯資料表
5. `DrawRecord`：抽獎紀錄資料表
6. `DrawSet_Lock`：抽獎套組鎖定資料表
7. `Transaction`：交易紀錄資料表

好的，我來提供完整的資料表結構詳解：

### 資料表結構詳解

#### 1. User 資料表

**說明**：儲存使用者基本資訊，包含認證和權限相關資料。

```prisma
model User {
  id          String       @id @default(uuid())
  name        String       // 使用者名稱
  email       String       @unique  // 電子郵件，用於登入
  password    String       // 加密後的密碼
  picture     String?      // 頭像圖片網址
  role        String       @default("user")  // 使用者角色：admin/user
  credits     Int          @default(0)  // 使用者點數
  isActive    Boolean      @default(true)  // 帳號狀態
  lastLoginAt DateTime?    // 最後登入時間
  createdAt   DateTime     @default(now())  // 建立時間
  updatedAt   DateTime     @updatedAt  // 更新時間
  DrawRecords DrawRecord[] // 關聯到抽獎紀錄
}
```

#### 2. Prize 資料表

**說明**：儲存獎品基本資訊。

```prisma
model Prize {
  id            String           @id @default(uuid())
  name          String          // 獎品名稱
  description   String?         // 獎品描述
  image         String?         // 獎品圖片網址
  type          String          // 獎品類型
  isActive      Boolean         @default(true)  // 獎品狀態
  createdAt     DateTime        @default(now())
  updatedAt     DateTime        @updatedAt
  DrawSetPrizes DrawSet_Prize[] // 關聯到抽獎套組獎品
  DrawRecords   DrawRecord[]    // 關聯到抽獎紀錄
}
```

#### 3. DrawSet 資料表

**說明**：儲存抽獎套組的基本資訊。

```prisma
model DrawSet {
  id            String           @id @default(uuid())
  name          String           // 套組名稱
  description   String?          // 套組描述
  image         String?          // 套組圖片網址
  startTime     DateTime         // 開始時間
  endTime       DateTime         // 結束時間
  enabled       Boolean          @default(true)  // 套組狀態
  maxDraws      Int              // 最大抽獎次數
  price         Int              // 抽獎價格（點數）
  createdAt     DateTime         @default(now())
  updatedAt     DateTime         @updatedAt
  DrawSetPrizes DrawSet_Prize[]  // 關聯到套組獎品
  DrawRecords   DrawRecord[]     // 關聯到抽獎紀錄
  DrawSetLocks  DrawSet_Lock[]   // 關聯到套組鎖定
}
```

#### 4. DrawSet_Prize 資料表

**說明**：抽獎套組與獎品的關聯表，記錄每個套組中各獎品的數量和兌換價值。

```prisma
model DrawSet_Prize {
  id                String    @id @default(uuid())
  drawSetId         String    // 關聯的套組 ID
  prizeId           String    // 關聯的獎品 ID
  drawNumber        Int       // 抽獎序號
  quantity          Int       // 初始數量
  quantityAvailable Int       // 剩餘數量
  exchangeValue     Int       // 獎品在此套組中的兌換價值（點數）
  createdAt         DateTime  @default(now())
  updatedAt         DateTime  @updatedAt
  DrawSet           DrawSet   @relation(fields: [drawSetId], references: [id])
  Prize             Prize     @relation(fields: [prizeId], references: [id])

  @@unique([drawSetId, drawNumber])  // 確保套組和抽獎序號的組合是唯一的
}
```

#### 5. DrawRecord 資料表

**說明**：記錄每次抽獎的結果。

```prisma
model DrawRecord {
  id        String    @id @default(uuid())
  userId    String    // 抽獎使用者 ID
  drawSetId String    // 抽獎套組 ID
  prizeId   String    // 獲得的獎品 ID
  drawNumber Int      // 抽獎序號
  status    String    // 抽獎狀態：pending/success/failed
  createdAt DateTime  @default(now())
  updatedAt DateTime  @updatedAt
  User      User      @relation(fields: [userId], references: [id])
  DrawSet   DrawSet   @relation(fields: [drawSetId], references: [id])
  Prize     Prize     @relation(fields: [prizeId], references: [id])
}
```

#### 6. DrawSet_Lock 資料表

**說明**：用於處理抽獎套組的並發控制，防止同時抽獎。

```prisma
model DrawSet_Lock {
  id        String    @id @default(uuid())
  drawSetId String    // 被鎖定的套組 ID
  userId    String    // 鎖定者的使用者 ID
  lockedAt  DateTime  @default(now())  // 鎖定時間
  expiresAt DateTime  // 鎖定過期時間
  DrawSet   DrawSet   @relation(fields: [drawSetId], references: [id])

  @@index([drawSetId])  // 加速鎖定狀態查詢
}
```

#### 7. Transaction 資料表

**說明**：記錄點數交易歷史。

```prisma
model Transaction {
  id          String    @id @default(uuid())
  userId      String    // 使用者 ID
  type        String    // 交易類型：deposit/withdraw/draw
  amount      Int      // 交易金額
  balance     Int      // 交易後餘額
  description String?   // 交易描述
  status      String    // 交易狀態：pending/success/failed
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt
  User        User      @relation(fields: [userId], references: [id])
}
```

### 資料表關聯說明

1. **一對多關聯**：

   - User -> DrawRecord：一個使用者可以有多筆抽獎紀錄
   - DrawSet -> DrawRecord：一個套組可以有多筆抽獎紀錄
   - Prize -> DrawRecord：一個獎品可以對應多筆抽獎紀錄
   - User -> Transaction：一個使用者可以有多筆交易紀錄

2. **多對多關聯**：

   - DrawSet <-> Prize：透過 DrawSet_Prize 表建立多對數關聯

3. **索引設計**：

   - 主鍵索引：所有表格都使用 UUID 作為主鍵
   - 外鍵索引：所有關聯欄位都建立索引
   - 複合索引：在 DrawSet_Prize 表格中的 drawSetId 和 drawNumber 建立複合唯一索引

4. **資料完整性**：
   - 使用外鍵約束確保資料關聯的完整性
   - 使用 Prisma 的型別系統確保資料型別正確性
   - 適當的預設值設定，確保資料一致性

---

## 業務邏輯與流程

### 1. 抽獎流程

#### 步驟概要

1. **檢查套組是否啟用**：`DrawSet.enabled` 必須為 `true`。
2. **取得鎖定**：
   - 檢查 `DrawSet_Lock` 資料表，查看套組是否被鎖定。
   - 如果未被鎖定，建立鎖定紀錄，鎖定該套組。
   - 如果已被鎖定，且鎖定未過期，檢查鎖定使用者是否為當前使用者。
     - 是當前使用者：允許繼續抽獎。
     - 不是當前使用者：拒絕抽獎請求，提示套組正被佔用。
3. **驗證抽獎次數限制**：統計 `DrawRecord` 中該套組的抽獎次數，不能超過 `DrawSet.maxDraws`。
4. **獎品抽取**：
   - 根據當前抽獎次數，從 `DrawSet_Prize` 中取得對應的獎品。

- 更新選中獎品的 `quantityAvailable`，減 1。
- 更新 `DrawSet_Prize` 中的 `drawNumber`，將已抽取的序號從可用序號中移除。
- 如果是最後一抽，獲得尾賞獎品。

5. **記錄抽獎結果**：
   - 建立 `DrawRecord` 紀錄，記錄抽獎結果。
1. **釋放鎖定**：
   - 在鎖定持續時間結束後，自動或手動刪除 `DrawSet_Lock` 紀錄。

### 2. 锁定机制

#### 获取锁定

- **检查现有锁定**：
  - 查询 `DrawSet_Lock` 中是否存在当前 `drawSetId` 的锁定记录。
  - 判断锁定是否过期：`lockStartTime + lockDuration > 当前时间`。
- **处理情况**：
  - **无有效锁定**：创建新的锁定记录。
  - **有有效锁定**：
    - **锁定用户是当前用户**：允许操作。
    - **锁定用户不是当前用户**：拒绝操作。

#### 释放锁定

- 锁定到期后，删除对应的 `DrawSet_Lock` 记录。
- 系统可定期清理过期的锁定记录。

### 3. 包套機制

#### 步驟概要

1. **檢查套組是否啟用**：`DrawSet.enabled` 必須為 `true`。
2. **取得鎖定**：
   - 檢查 `DrawSet_Lock` 資料表，查看套組是否被鎖定。
   - 如果未被鎖定，建立鎖定紀錄，鎖定該套組。
   - 如果已被鎖定，且鎖定未過期，檢查鎖定使用者是否為當前使用者。
     - 是當前使用者：允許繼續抽獎。
     - 不是當前使用者：拒絕抽獎請求，提示套組正被佔用。
3. **驗證抽獎次數限制**：統計 `DrawRecord` 中該套組的抽獎次數，不能超過 `DrawSet.maxDraws`。
4. **包套抽取**：
   - 根據當前抽獎次數，從 `DrawSet_Prize` 中取得對應的獎品。
   - 更新選中獎品的 `quantityAvailable`，減去相應數量。
   - 更新 `DrawSet_Prize` 中的 `drawNumber`，將已抽取的序號從可用序號中移除。
   - 包含最後一抽，獲得尾賞獎品。
5. **記錄抽獎結果**： 建立 `DrawRecord` 多筆紀錄，記錄抽獎結果。
6. **釋放鎖定**：
   - 在鎖定持續時間結束後，自動或手動刪除 `DrawSet_Lock` 紀錄。

### 4. 数据一致性

- **数据库事务**：在更新奖品数量和创建抽奖记录时，使用事务确保数据一致性。
- **唯一约束**：`DrawSet_Lock.drawSetId` 设置为唯一，防止多个用户同时锁定同一套组。
- **乐观锁/悲观锁**：根据实际需求，在数据库操作中应用。

好的，我們繼續完成規格說明書的最後部分：

### 5. 錯誤處理機制

#### 前端錯誤處理

1. **網路請求錯誤**

   - 使用 try-catch 包裝所有 API 請求
   - 統一的錯誤處理元件，顯示友善的錯誤訊息
   - 網路連線中斷時的重試機制
   - Loading 狀態的顯示處理

2. **表單驗證錯誤**

   - 即時驗證使用者輸入
   - 清楚的錯誤提示訊息
   - 防止重複提交
   - 必填欄位檢查

3. **使用者操作錯誤**
   - 操作確認提示
   - 防呆機制
   - 資料未儲存提醒

#### 後端錯誤處理

1. **API 錯誤回應格式**

```typescript
interface ErrorResponse {
  status: number // HTTP 狀態碼
  code: string // 錯誤代碼
  message: string // 錯誤訊息
  details?: any // 詳細錯誤資訊（選擇性）
  timestamp: string // 錯誤發生時間
}
```

2. **常見錯誤代碼**

   - `AUTH_001`：未登入或 Token 無效
   - `AUTH_002`：權限不足
   - `DRAW_001`：抽獎套組已被鎖定
   - `DRAW_002`：超過抽獎次數限制
   - `DRAW_003`：獎品數量不足
   - `DB_001`：資料庫操作錯誤
   - `VAL_001`：資料驗證錯誤

3. **日誌記錄**
   - 記錄所有 API 請求和回應
   - 記錄系統錯誤和異常
   - 記錄重要操作日誌
   - 定期清理過期日誌

---

## 系統安全性

### 1. 使用者認證

- 使用 JWT Token 進行身分驗證
- Token 有效期限設定
- 密碼加密存儲（使用 bcrypt）
- 登入失敗次數限制

### 2. 資料安全

- 使用 HTTPS 進行加密傳輸
- 敏感資料加密存儲
- SQL 注入防護
- XSS 防護
- CSRF 防護

### 3. 權限控制

- 角色基礎存取控制（RBAC）
- API 權限驗證
- 資源存取控制
- 操作日誌記錄

---

## 效能優化

### 1. 前端優化

- 程式碼分割（Code Splitting）
- 圖片懶加載
- 靜態資源快取
- 元件按需載入
- 虛擬列表優化長清單

### 2. 後端優化

- API 回應快取
- 資料庫索引優化
- 資料庫連線池
- 非同步處理大量請求
- 定期清理過期資料

### 3. 資料庫優化

- 適當的索引設計
- 定期維護和優化
- 查詢效能監控
- 資料分頁處理

---

## 附錄

### A. API 文件

使用 Swagger 自動產生 API 文件，包含：

- 各 API 端點說明
- 請求和回應格式
- 錯誤代碼說明
- 認證方式說明

### B. 開發環境設定

1. **前端環境**

```bash
# Node.js 版本要求
node >= 16.0.0

# 安裝相依套件
npm install

# 開發環境啟動
npm run dev

# 建置正式環境
npm run build
```

2. **後端環境**

```bash
# 安裝相依套件
npm install

# 設定環境變數
cp .env.example .env

# 資料庫遷移
npx prisma migrate dev

# 開發環境啟動
npm run dev

# 建置正式環境
npm run build
```

### C. 部署說明

1. **環境需求**

   - Node.js >= 16.0.0
   - PostgreSQL >= 14
   - Redis（選用，用於快取）
   - Nginx（建議用於反向代理）

2. **部署步驟**

   - 前端建置
   - 後端建置
   - 資料庫遷移
   - 環境變數設定
   - 服務啟動

3. **監控與維護**
   - 系統監控
   - 錯誤追蹤
   - 效能監控
   - 備份策略
