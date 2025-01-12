# WEB 软件开发规格说明书

## 目录

1. [项目概述](#项目概述)
2. [功能需求](#功能需求)
3. [技术栈](#技术栈)
4. [系统架构](#系统架构)
5. [前端开发规范](#前端开发规范)
6. [后端开发规范](#后端开发规范)
7. [数据库设计](#数据库设计)
8. [业务逻辑与流程](#业务逻辑与流程)
9. [附录](#附录)

---

## 项目概述

本项目旨在开发一个线上“一番赏”抽奖的网页应用。用户可以在网站上参与抽奖，赢取不同的奖品。系统需要支持多种抽奖套组，每个套组包含多个奖品，并需要管理奖品的数量、抽奖次数限制等功能。此外，需要实现一个抽奖锁定机制，确保在用户进行抽奖时，其他用户无法同时抽取同一套组的奖品。

---

## 功能需求

### 1. 用户管理

- 用户注册与登录
- 用户信息管理（昵称、头像等）

### 2. 奖品管理

- 添加、编辑、删除奖品
- 奖品信息包括：名称、图片等

### 3. 抽奖套组管理

- 创建、编辑、删除抽奖套组
- 定义套组的基本信息：名称、是否启用、最大抽奖次数等
- 为套组添加奖品，并设置每个奖品的数量

### 4. 抽奖功能

- 用户可以查看可用的抽奖套组
- 用户在套组启用的情况下，可以参与抽奖
- 实现抽奖逻辑，包括奖品的随机分配、数量控制等
- 每个套组有最大抽奖次数限制

### 5. 抽奖锁定机制

- 当用户开始抽取某个抽奖套组时，锁定该套组
- 记录锁定的用户、开始时间和持续时间
- 在锁定期间，其他用户无法抽取该套组
- 锁定机制有超时处理，锁定到期后自动释放

### 6. 抽奖记录

- 记录用户的每次抽奖结果
- 展示抽奖历史，包括抽中的奖品、时间等

### 7. 前端展示

- 友好的用户界面，展示奖品和抽奖套组的信息
- 实时更新奖品剩余数量和抽奖情况

---

## 技术栈

### 前端

- **Nuxt 3**：基于 Vue 3 的服务端渲染框架
- **TypeScript**：强类型的 JavaScript 超集
- **shadcn-vue**：组件库，提供可重用的 UI 组件
- **UnoCSS**：即时的原子化 CSS 引擎，提供高性能的样式管理
- **JWToken**：用户认证和权限管理

### 后端

- **Hono**：後端框架
- **TypeScript**：强类型的 JavaScript 超集
- **Prisma**：下一代的 ORM，简化数据库的操作
- **PostgreSQL**：关系型数据库，用于存储系统数据
- **JWToken**：用户认证和权限管理
- **Swagger**：API 文档生成工具

---

## 系统架构

系统采用前后端分离的架构：

- **前端**：使用 Nuxt 3 构建，负责页面渲染和用户交互。
- **后端**：提供 RESTful API，处理业务逻辑和数据管理。
- **数据库**：使用 PostgreSQL，通过 Prisma 进行数据访问。

---

## 前端开发规范

### 使用技术

- **框架**：Nuxt 3
- **语言**：TypeScript
- **组件库**：shadcn-vue
- **CSS**：UnoCSS

### 代码规范

- 遵循 TypeScript 的最佳实践
- 组件化开发，提升代码复用性，組件使用原子最小化的開發模式
- 使用 shadcn-vue 提供的组件，确保 UI 一致性
- 样式使用 UnoCSS，采用原子化 CSS 的方式
- 所有 Vue 檔案的檔案都使用`<script setup lang="ts">`

### 功能实现

- 实现页面路由，展示不同的功能页面
- 与后端 API 交互，获取和提交数据
- 实时更新页面数据，如奖品剩余数量等
- 错误处理和用户提示
- 需要製作管理者使用的後台頁面，需要有驗證使用者功能，並且有權限管理
- 需要製作使用者使用的前台頁面，需要有使用者登入功能，並且有使用者資料管理
- 需製作後台編輯頁面，讓管理者能夠管理獎品與套組，需要有編輯功能，並且有資料驗證功能

---

## 后端开发规范

### 使用技术

- **框架**：根据需求，優先使用 Hono.js 可选用 Express.js、NestJS 等 Node.js 框架
- **ORM**：Prisma
- **数据库**：PostgreSQL

### 代码规范

- 使用 TypeScript 开发
- 遵循 SOLID 原则，编写可维护的代码
- 使用 Prisma 简化数据库操作
- 进行充分的错误处理和日志记录
- 采用模块化的代码结构，方便扩展和维护
- 使用 JWT Token 进行用户认证和权限管理
- 使用 ESLint 进行代码格式化
- 使用 Jest 进行单元测试
- 使用 Swagger 生成 API 文档

### API 设计

- 采用 RESTful API 设计原则
- 定义清晰的路由和请求方法
- 返回统一的响应格式，包括成功和错误情况

---

## 数据库设计

### 数据库概览

数据库使用 PostgreSQL，利用 Prisma 进行 ORM 映射。主要包含以下表：

1. `User`：用户表
2. `Prize`：奖品表
3. `DrawSet`：抽奖套组表
4. `DrawSet_Prize`：抽奖套组与奖品关联表
5. `DrawRecord`：抽奖记录表
6. `DrawSet_Lock`：抽奖套组锁定表

### 表结构详解

#### 1. User 表

**描述**：存储用户信息。

```prisma
model User {
  id       Int     @id @default(uuid())
  name     String
  email    String  @unique
  password String
  picture  String @default("")
  createdAt DateTime @default(now())
  role     String  @default("user")
  credits  Int     @default(0)
  DrawRecords DrawRecord[]
}
```

#### 2. Prize 表

**描述**：存储奖品信息。

```prisma
model Prize {
  id       Int     @id @default(uuid())
  name     String
  image    String?
  DrawSetPrizes DrawSet_Prize[]
  DrawRecords   DrawRecord[]
}
```

#### 3. DrawSet 表

**描述**：存储抽奖套组信息。

```prisma
model DrawSet {
  id         Int     @id @default(uuid())
  name       String
  enabled    Boolean @default(false)
  maxDraws   Int
  DrawSetPrizes DrawSet_Prize[]
  DrawRecords   DrawRecord[]
  DrawSetLock   DrawSet_Lock?
}
```

#### 4. DrawSet_Prize 表

**描述**：关联抽奖套组和奖品，记录奖品数量。

```prisma
model DrawSet_Prize {
  id                Int     @id @default(uuid())
  drawSet   DrawSet @relation(fields: [drawSetId], references: [id])
  drawSetId Int
  prize     Prize   @relation(fields: [prizeId], references: [id])
  prizeId   Int
  quantity          Int
  quantityAvailable Int
}
```

#### 5. DrawRecord 表

**描述**：记录用户的抽奖结果。

```prisma
model DrawRecord {
  id         Int       @id @default(uuid())
  user       User      @relation(fields: [userId], references: [id])
  userId     Int
  drawSet    DrawSet   @relation(fields: [drawSetId], references: [id])
  drawSetId  Int
  prize      Prize     @relation(fields: [prizeId], references: [id])
  prizeId    Int
  drawTime   DateTime  @default(now())
}
```

#### 6. DrawSet_Lock 表

**描述**：管理抽奖套组的锁定信息。

```prisma
model DrawSet_Lock {
  id           Int       @id @default(uuid())
  drawSet      DrawSet   @relation(fields: [drawSetId], references: [id])
  drawSetId    Int       @unique
  user         User      @relation(fields: [userId], references: [id])
  userId       Int
  lockStartTime DateTime @default(now())
  lockDuration  Int      // 单位：秒
}
```

### 关系说明

- **User** 和 **DrawRecord**：一对多关系，一个用户可以有多条抽奖记录。
- **Prize** 和 **DrawSet**：多对多关系，通过 **DrawSet_Prize** 表关联。
- **DrawSet** 和 **DrawSet_Prize**：一对多关系，一个抽奖套组可以有多个奖品。
- **DrawSet** 和 **DrawRecord**：一对多关系，一个抽奖套组可以有多条抽奖记录。
- **DrawSet_Lock**：与 **DrawSet** 一对一关联，管理套组的锁定状态。

---

## 业务逻辑与流程

### 1. 抽奖过程

#### 步骤概览

1. **检查套组是否启用**：`DrawSet.enabled` 必须为 `true`。
2. **获取锁定**：
   - 检查 `DrawSet_Lock` 表，查看套组是否被锁定。
   - 如果未被锁定，创建锁定记录，锁定该套组。
   - 如果被锁定，且锁定未过期，检查锁定用户是否为当前用户。
     - 是当前用户：允许继续抽奖。
     - 不是当前用户：拒绝抽奖请求，提示套组正被占用。
3. **验证抽奖次数限制**：统计 `DrawRecord` 中该套组的抽奖次数，不能超过 `DrawSet.maxDraws`。
4. **奖品抽取**：
   - 从 `DrawSet_Prize` 中获取 `quantityAvailable > 0` 的奖品列表。
   - 随机选择一个奖品。
   - 更新选中奖品的 `quantityAvailable`，减 1。
5. **记录抽奖结果**：在 `DrawRecord` 表中插入一条记录。
6. **释放锁定**：
   - 在锁定持续时间结束后，自动或手动删除 `DrawSet_Lock` 记录。

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

### 3. 并发控制

- **数据库事务**：在更新奖品数量和创建抽奖记录时，使用事务确保数据一致性。
- **唯一约束**：`DrawSet_Lock.drawSetId` 设置为唯一，防止多个用户同时锁定同一套组。
- **乐观锁/悲观锁**：根据实际需求，在数据库操作中应用。

### 4. 错误处理

- **锁定失败**：提示用户套组正在被占用，建议稍后重试。
- **奖品不足**：当 `quantityAvailable` 为 0 时，提示用户奖品已被抽完。
- **抽奖次数超限**：提示用户已达到最大抽奖次数。

---

## 附录

### 1. 示例 API 接口

#### 获取可用抽奖套组

```
GET /api/draw-sets

响应：
[
  {
    "id": 1,
    "name": "幸运大转盘",
    "enabled": true,
    "maxDraws": 100,
    "prizes": [
      {
        "id": 1,
        "name": "一等奖",
        "image": "path/to/image",
        "quantityAvailable": 10
      },
      // 更多奖品
    ]
  },
  // 更多套组
]
```

#### 开始抽奖

```
POST /api/draw-sets/:drawSetId/draw

请求体：
{
  "userId": 123
}

响应：
{
  "success": true,
  "prize": {
    "id": 5,
    "name": "三等奖",
    "image": "path/to/image"
  }
}
```

#### 错误响应

```
{
  "success": false,
  "message": "当前套组正在被其他用户抽取，请稍后重试。"
}
```

### 2. 前端页面示意

- **抽奖套组列表页**：展示所有可用的抽奖套组，用户可选择进入详情。
- **抽奖套组详情页**：展示套组内的奖品信息，显示剩余奖品数量。
- **抽奖页面**：用户点击“开始抽奖”按钮，触发抽奖逻辑，显示抽奖结果。
- **抽奖结果页**：展示用户抽中的奖品信息。

---

## 总结

本规格说明书详细描述了项目的功能需求、技术栈选择、系统架构、数据库设计以及具体的业务逻辑流程。通过前后端各自的开发规范和详细的数据库设计，确保系统功能的完整性和数据的一致性。希望此文档能为开发团队提供清晰的指导，顺利完成项目的开发与部署。

如有任何问题或需要进一步讨论的细节，请及时联系。
