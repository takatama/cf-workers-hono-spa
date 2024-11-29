const translateBtn = document.getElementById("translate-btn");
translateBtn.addEventListener("click", translateText);

async function handleEventStream(response, textarea) {
  const reader = response.body.getReader();
  const decoder = new TextDecoder("utf-8");
  let text = "";

  while (true) {
    const { value, done } = await reader.read();
    if (done) break;

    const chunk = decoder.decode(value, { stream: true });
    chunk.split("\n").forEach((line) => {
      if (line.startsWith("data: ")) {
        const data = line.replace("data: ", "");
        if (data === "[DONE]") return;
        try {
          const jsonData = JSON.parse(data);
          text += jsonData.response;
          textarea.value = text;
        } catch (error) {
          // JSONデータが壊れている場合は無視する
        }
      }
    });
  }
}

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

    if (!response.ok) {
      throw new Error(`エラー ${response.status} ${response.statusText}`);
    }
    // verifyResponse(response);


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
