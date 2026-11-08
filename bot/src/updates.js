export async function processUpdate(update, call, handler) {
  const query = update.callback_query;
  if (query) {
    if (query.message?.chat?.type !== 'private' || query.from.id !== query.message.chat.id) {
      await call('answerCallbackQuery', { callback_query_id: query.id });
      return;
    }
    const action = handler.handleCallback(query.message.chat.id, query.data);
    await call('answerCallbackQuery', { callback_query_id: query.id, text: action.notice, show_alert: action.alert ?? false });
    if (action.clearKeyboard) {
      try {
        await call('editMessageReplyMarkup', { chat_id: query.message.chat.id, message_id: query.message.message_id, reply_markup: { inline_keyboard: [] } });
      } catch (error) {
        if (!error.message.includes('message is not modified')) throw error;
      }
    }
    if (action.edit) {
      try {
        await call('editMessageText', { chat_id: query.message.chat.id, message_id: query.message.message_id, ...action.edit });
      } catch (error) {
        if (!error.message.includes('message is not modified')) throw error;
      }
    }
    if (action.send) await call('sendMessage', { chat_id: query.message.chat.id, ...action.send });
    return;
  }
  const message = update.message;
  if (message?.chat?.type !== 'private') return;
  const replies = handler.handleText(message.chat.id, message.text, message.from?.first_name);
  for (const reply of replies) await call('sendMessage', {
    chat_id: message.chat.id, ...reply,
    reply_parameters: { message_id: message.message_id, allow_sending_without_reply: true }
  });
}
