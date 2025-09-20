# 自動化與分流流程

本文件詳細說明我們用於管理與分流 Issues 及 Pull Requests（PR）的自動化流程。我們的目標是提供即時回饋，並確保貢獻能高效地被審查與整合。了解這些自動化流程，將有助於你作為貢獻者，了解預期流程，以及如何與我們的儲存庫機器人互動。

## 指導原則：Issues 與 Pull Requests

首先，幾乎每個 Pull Request（PR）都應該關聯到一個對應的 Issue。Issue 描述「做什麼」與「為什麼」（即 bug 或新功能），而 PR 則是「怎麼做」（即實作方式）。這樣的分離有助於我們追蹤工作、釐清功能優先順序，並維持清楚的歷史脈絡。我們的自動化流程正是圍繞這個原則設計。

---

## 詳細自動化工作流程

以下是我們儲存庫中執行的各項自動化工作流程說明。

### 1. 當你建立 Issue 時：`Automated Issue Triage`

這是你建立 Issue 時會首先接觸到的機器人。它的工作是進行初步分析並套用正確的標籤。

- **工作流程檔案**：`.github/workflows/gemini-automated-issue-triage.yml`
- **執行時機**：Issue 創建或重新開啟後立即執行。
- **執行內容**：
  - 使用 Gemini 模型，根據詳細指引分析 Issue 標題與內容。
  - **套用一個 `area/*` 標籤**：將 Issue 分類到專案的功能區域（如 `area/ux`、`area/models`、`area/platform`）。
  - **套用一個 `kind/*` 標籤**：標示 Issue 類型（如 `kind/bug`、`kind/enhancement`、`kind/question`）。
  - **套用一個 `priority/*` 標籤**：根據描述的影響程度，指派優先級（從 P0（最高）到 P3（最低））。
  - **可能套用 `status/need-information`**：若 Issue 缺少關鍵細節（如日誌或重現步驟），會標記為需補充資訊。
  - **可能套用 `status/need-retesting`**：若 Issue 提及的 CLI 版本已超過六個版本，會標記為需在最新版重測。
- **你應該做的事**：
  - 請盡可能完整填寫 Issue 樣板。你提供的細節越多，分流就越準確。
  - 若被加上 `status/need-information` 標籤，請在留言中補充所需細節。

### 2. 當你建立 Pull Request 時：`Continuous Integration (CI)`

此工作流程確保所有變更在合併前都符合我們的品質標準。

- **工作流程檔案**：`.github/workflows/ci.yml`
- **執行時機**：每次對 Pull Request 推送時執行。
- **執行內容**：
  - **Lint**：檢查你的程式碼是否符合專案的格式與風格規範。
  - **Test**：在 macOS、Windows、Linux 及多個 Node.js 版本上執行完整自動化測試套件。這是持續整合（CI）流程中最耗時的部分。
  - **發佈測試覆蓋率留言**：所有測試通過後，機器人會在你的 PR 留言，摘要說明變更的測試覆蓋情況。
- **你應該做的事**：
  - 確認所有 CI 檢查通過。當一切順利時，你的 commit 旁會出現綠色勾勾 ✅。
  - 若有檢查失敗（紅色「X」❌），請點擊失敗檢查旁的「Details」連結，查看日誌、找出問題並推送修正。

### 3. Pull Request 持續分流：`PR Auditing and Label Sync`

此工作流程定期執行，確保所有開啟中的 PR 都已正確關聯至 Issue，且標籤一致。

- **工作流程檔案**：`.github/workflows/gemini-scheduled-pr-triage.yml`
- **執行時機**：每 15 分鐘在所有開啟中的 Pull Request 上執行。
- **執行內容**：
  - **檢查是否有關聯 Issue**：機器人會掃描你的 PR 描述，尋找關聯 Issue 的關鍵字（如 `Fixes #123`、`Closes #456`）。
  - **加上 `status/need-issue`**：若未找到關聯 Issue，機器人會為你的 PR 加上 `status/need-issue` 標籤，明確提示需建立並關聯 Issue。
  - **同步標籤**：若已關聯 Issue，機器人會確保 PR 的標籤與 Issue 完全一致，補上缺少的標籤、移除不相關標籤，並移除 `status/need-issue` 標籤（若存在）。
- **你應該做的事**：
  - **務必將你的 PR 關聯到一個 Issue。** 這是最重要的步驟。請在 PR 描述中加入類似 `Resolves #<issue-number>` 的行。
  - 這將確保你的 PR 被正確分類，並順利進入審查流程。

### 4. Issue 持續分流：`Scheduled Issue Triage`

這是備援工作流程，確保沒有任何 Issue 被分流流程遺漏。

- **工作流程檔案**：`.github/workflows/gemini-scheduled-issue-triage.yml`
- **執行時機**：每小時在所有開啟中的 Issue 上執行。
- **執行內容**：
  - 主動尋找尚未有任何標籤，或仍有 `status/need-triage` 標籤的 Issue。
  - 會再次啟動與初始分流機器人相同的 Gemini 分析，套用正確標籤。
- **你應該做的事**：
  - 通常你不需要做任何事。這個流程是安全網，確保每個 Issue 最終都會被分類，即使初次分流失敗。

### 5. 發佈自動化

此工作流程負責 Gemini CLI 新版本的打包與發佈。

- **工作流程檔案**：`.github/workflows/release-manual.yml`
- **執行時機**：每日定時執行「nightly」發佈，官方 patch/minor 發佈則需手動觸發。
- **執行內容**：
  - 自動建置專案、提升版本號，並將套件發佈到 npm。
  - 在 GitHub 上建立對應的發佈，並產生發佈說明。
- **你應該做的事**：
  - 作為貢獻者，你不需為此流程做任何事。只要你的 PR 已合併進 `main` 分支，你的變更就會包含在下一個 nightly 發佈中。

我們希望這份詳細說明對你有所幫助。如果你對自動化或流程有任何疑問，歡迎隨時提出！
