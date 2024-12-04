const promptInput = document.getElementById("prompt");
const translateBtn = document.getElementById("translate-btn");
const errorMessage = document.getElementById("translate-error-message");
const translatedPrompt = document.getElementById("translated-prompt");
const historyList = document.getElementById("history-list");

// 翻訳履歴の追加
function addToHistory(inputText, translatedText) {
  const historyItem = document.createElement("div");
  historyItem.classList.add("history-item");

  const inputPara = document.createElement("p");
  inputPara.innerHTML = inputText;
  historyItem.appendChild(inputPara);

  const translatedPara = document.createElement("p");
  translatedPara.innerHTML = translatedText;
  historyItem.appendChild(translatedPara);

  historyList.style.display = "block";
  historyList.appendChild(historyItem);

  // 履歴リストをスクロールダウン
  historyList.scrollTop = historyList.scrollHeight;
}

// 翻訳処理
async function translateText() {
  translateBtn.disabled = true;
  errorMessage.style.display = "none";

  try {
    const formData = new FormData();
    formData.set("prompt", promptInput.value);
    const response = await fetch(`/api/translate`, {
      method: "POST",
      body: formData,
    });

    verifyResponse(response);
    const translatedText = await response.text();
    addToHistory(promptInput.value, translatedText);
    promptInput.value = "";
  } catch (error) {
    console.error("エラー: ", error);
    errorMessage.textContent = "翻訳に失敗しました。もう一度試してください。";
    errorMessage.style.display = "block";
  } finally {
    translateBtn.disabled = false;
  }
}

// イベントリスナーの登録
translateBtn.addEventListener("click", translateText);
promptInput.addEventListener("keydown", (event) => {
  if (!event.isComposing && event.key === "Enter") {
    event.preventDefault();
    translateBtn.click();
  }
});
promptInput.focus();
