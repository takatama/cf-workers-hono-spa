const translateBtn = document.getElementById("translate-btn");
translateBtn.addEventListener("click", translateText);

async function translateText() {
  const errorMessage = document.getElementById("translate-error-message");
  const promptInput = document.getElementById("prompt");

  translateBtn.disabled = true;
  errorMessage.style.display = "none";
  const formData = new FormData();
  formData.set("prompt", promptInput.value);

  try {
    const response = await fetch(`/translate`, {
      method: "POST",
      body: formData,
    });

    // if (!response.ok) {
    //   throw new Error(`エラー ${response.status} ${response.statusText}`);
    // }
    verifyResponse(response);


    const translatedPrompt = document.getElementById("translated-prompt");
    await handleEventStream(response, translatedPrompt);
  } catch (error) {
    console.error("エラー: ", error);
    errorMessage.textContent = "翻訳に失敗しました。もう一度試してください。";
    errorMessage.style.display = "block";
  } finally {
    translateBtn.disabled = false;
  }
}
