# 待辦清單 Web App 作品集

![工作坊完成徽章](https://img.shields.io/badge/GitHub_Copilot_實戰工作坊-已完成-1F883D?style=for-the-badge&logo=githubcopilot&logoColor=white)

這是一個在 GitHub Copilot 實戰工作坊中完成的待辦清單 Web App，目標是練習如何在實際專案中使用 Agent Mode、MCP 工具與 agentic workflow 來完成前端功能開發與問題修正。

## 線上展示

GitHub Pages：
https://finn79426.github.io/GitHub-Bootcamp-2026-Taipei/

> 我會在之後自行替換為實際的 GitHub Pages 網址。

## 功能

- 新增待辦事項
- 刪除單一待辦事項
- 勾選完成 / 取消完成狀態
- 依狀態篩選清單：全部、未完成、已完成
- 顯示未完成項目數量
- 深色 / 淺色模式切換
- 從 localStorage 讀取與保存待辦資料
- 在篩選結果為空時顯示清楚的提示訊息
- 提供清除所有已完成項目的批次操作（若此功能已實作於目前版本）

## 技術

這個專案使用純 HTML、CSS 與原生 JavaScript 開發，不使用任何前端框架或第三方套件。

- HTML：負責頁面結構與內容
- CSS：負責版型、主題與互動樣式
- JavaScript：負責待辦邏輯、篩選、狀態更新與資料存取
- 資料持久化：使用 browser localStorage 儲存待辦清單與偏好設定
- 架構：保持簡單的單頁應用形式，便於理解與維護

## 開發方式

這個專案的開發流程，是依照 GitHub Copilot 實戰工作坊中所使用的方式來進行：

- 使用 GitHub Copilot Agent Mode 協助撰寫與修改前端程式碼
- 使用 MCP（Model Context Protocol）相關工具讀取 issue、檢視 repo 內容與進行更精準的專案協作
- 依照 `.github/prompts` 中定義的 agentic workflow，按步驟處理 issue、修正問題、驗證結果與整理提交內容
- 透過實際的 GitHub issue 流程，從問題定義、修改、驗證到 PR 建立，完成整個工作流

這種方式讓開發流程更接近真實專案的協作模式，也使我能更清楚地體驗 AI 輔助開發的實際使用情境。

## 我學到什麼

- 使用 AI 協助開發時，先釐清需求與目標，再進行最小範圍修改，能更有效率地完成任務
- GitHub Copilot 不只是程式產生器，也能協助理解既有程式碼、修正問題與驗證行為
- MCP 工具能讓 AI 更貼近專案上下文，提升作業時的準確度與效率
- 單頁前端專案中，資料持久化與使用者體驗細節會直接影響實用性
- 在真實工作流程中，issue 討論、修正、驗證與 PR 管理，都是開發過程中不可忽略的重要部分

---

這份作品集內容是基於目前完成的實作整理，重點放在清楚說明作品的功能、技術與開發過程，避免過度宣稱未實際驗證的內容。
