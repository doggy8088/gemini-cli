# 自動化與分流流程

本文檔詳細介紹了我們用於管理與分流 Issue 和 Pull Request（PR）的自動化流程。我們的目標是提供即時的回饋，並確保貢獻能夠高效地被審查與整合。了解這些自動化流程，將有助於你作為貢獻者時，知道可以期待什麼，以及如何最佳地與我們的倉庫機器人互動。

## 指導原則：Issue 與 Pull Request

首先，幾乎每一個 Pull Request（PR）都應該關聯到一個對應的 Issue。Issue 描述「做什麼」與「為什麼」（即 bug 或功能需求），而 PR 則是「怎麼做」（即實作方式）。這樣的區隔有助於我們追蹤工作、優先排序功能，並維護清晰的歷史脈絡。我們的自動化流程即是圍繞這個原則設計。

---

## 詳細自動化工作流程

以下是我們倉庫中運行的具體自動化工作流程分解。

### 1. 當你建立 Issue 時：`Automated Issue Triage`

這是你建立 Issue 時會首先接觸到的機器人。它的工作是進行初步分析並套用正確的標籤。

- **工作流程檔案**：`.github/workflows/gemini-automated-issue-triage.yml`
- **觸發時機**：Issue 被建立或重新開啟後立即執行。
- **執行內容**：
  - 利用 Gemini 模型，根據一套詳細指引分析 Issue 的標題與內容。
  - **套用一個 `area/*` 標籤**：將 Issue 分類到專案的某個功能領域（例如：`area/ux`、`area/models`、`area/platform`）。
  - **套用一個 `kind/*` 標籤**：標示 Issue 的類型（例如：`kind/bug`、`kind/enhancement`、`kind/question`）。
  - **套用一個 `priority/*` 標籤**：根據描述的影響程度，指派優先級（從 P0（最高）到 P3（最低））。
  - **可能套用 `status/need-information`**：若 Issue 缺少關鍵細節（如日誌或重現步驟），會標記以提示補充資訊。
  - **可能套用 `status/need-retesting`**：若 Issue 提及的 CLI 版本超過六個版本以前，會標記以提示需在最新版本重測。
- **你應該做的事**：
  - 請盡量完整填寫 Issue 範本。你提供的細節越多，分流就越準確。
  - 若被加上 `status/need-information` 標籤，請在留言中補充所需細節。

### 2. 當你建立 Pull Request 時：`Continuous Integration (CI)`

此工作流程確保所有變更在合併前都符合我們的品質標準。

- **工作流程檔案**：`.github/workflows/ci.yml`
- **觸發時機**：每次對 Pull Request 推送時執行。
- **執行內容**：
  - **Lint**：檢查你的程式碼是否符合專案的格式與風格規範。
  - **Test**：在 macOS、Windows、Linux 及多個 Node.js 版本上，執行我們完整的自動化測試套件。這是 CI 流程中最耗時的部分。
  - **發佈測試覆蓋率留言**：所有測試通過後，機器人會在你的 PR 上留言，摘要說明你的變更被測試覆蓋的情況。
- **你應該做的事**：
  - 確保所有 CI 檢查通過。當一切順利時，你的 commit 旁會出現綠色勾勾 ✅。
  - 若檢查失敗（紅色「X」❌），請點擊失敗檢查旁的「Details」連結，查看日誌、找出問題並推送修正。

### 3. Pull Request 持續分流：`PR Auditing and Label Sync`

此工作流程會定期運行，確保所有開啟中的 PR 都正確關聯到 Issue 並擁有一致的標籤。

- **工作流程檔案**：`.github/workflows/gemini-scheduled-pr-triage.yml`
- **觸發時機**：每 15 分鐘針對所有開啟中的 Pull Request 執行。
- **執行內容**：
  - **檢查是否關聯 Issue**：機器人會掃描你的 PR 描述，尋找關聯 Issue 的關鍵字（例如：`Fixes #123`、`Closes #456`）。
  - **加上 `status/need-issue`**：若找不到關聯的 Issue，機器人會在你的 PR 上加上 `status/need-issue` 標籤。這明確表示需要建立並關聯一個 Issue。
  - **同步標籤**：若已關聯 Issue，機器人會確保 PR 的標籤與 Issue 完全一致。會自動補上缺少的標籤、移除不屬於的標籤，並在有 `status/need-issue` 標籤時將其移除。
- **你應該做的事**：
  - **務必將你的 PR 關聯到一個 Issue。** 這是最重要的一步。請在 PR 描述中加入類似 `Resolves #<issue-number>` 的行。
  - 這樣可以確保你的 PR 被正確分類，並順利進入審查流程。

### 4. Issue 持續分流：`Scheduled Issue Triage`

這是一個備援工作流程，確保沒有任何 Issue 被分流流程遺漏。

- **工作流程檔案**：`.github/workflows/gemini-scheduled-issue-triage.yml`
- **觸發時機**：每小時針對所有開啟中的 Issue 執行。
- **執行內容**：
  - 主動尋找尚未有任何標籤，或仍有 `status/need-triage` 標籤的 Issue。
  - 隨後啟動與初始分流機器人相同的 Gemini 分析，套用正確標籤。
- **你應該做的事**：
  - 通常你不需要做任何事。這個流程是安全網，確保每個 Issue 最終都會被分類，即使初始分流失敗也沒關係。

### 5. 發佈自動化

此工作流程負責 Gemini CLI 新版本的打包與發佈。

- **工作流程檔案**：`.github/workflows/release-manual.yml`
- **觸發時機**：每日定時進行「nightly」發佈，正式 patch/minor 發佈則需手動觸發。
- **執行內容**：
  - 自動建置專案、提升版本號，並將套件發佈到 npm。
  - 在 GitHub 上建立對應的發佈版本，並產生發佈說明。
- **你應該做的事**：
  - 作為貢獻者，你無需為此流程做任何事。你可以放心，只要你的 PR 被合併到 `main` 分支，你的變更就會包含在下一次 nightly 發佈中。

我們希望這份詳細的說明對你有所幫助。如果你對我們的自動化或流程有任何疑問，歡迎隨時提出！
