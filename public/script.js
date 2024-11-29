const promptInput = document.getElementById("prompt");
const translateBtn = document.getElementById("translate-btn");
const errorMessage = document.getElementById("translate-error-message");
const translatedPrompt = document.getElementById("translated-prompt");

// 翻訳処理
async function translateText() {
  translateBtn.disabled = true;
  errorMessage.style.display = "none";

  try {
    const formData = new FormData();
    formData.set("prompt", promptInput.value);
    const response = await fetch(`/translate`, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) throw new Error(`エラー ${response.status} ${response.statusText}`);
    translatedPrompt.value = await response.text();
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
