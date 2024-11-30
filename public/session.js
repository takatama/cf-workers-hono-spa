function verifyResponse(response) {
  if (response.ok) return;
  if (response.status === 401) {
    onTurnstileExpired();
    throw new Error('セッションが無効です。再度認証してください。');
  }
  throw new Error(`エラー ${response.status} ${response.statusText}`);
}
