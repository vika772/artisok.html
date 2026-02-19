import { initializeApp } from "firebase-admin/app";
import { logger } from "firebase-functions";
import { onDocumentCreated } from "firebase-functions/v2/firestore";
import { defineSecret } from "firebase-functions/params";

initializeApp();

const telegramBotToken = defineSecret("TELEGRAM_BOT_TOKEN");
const telegramChatId = defineSecret("TELEGRAM_CHAT_ID");

const fallback = "-";

function asText(value) {
  if (value === null || value === undefined || value === "") return fallback;
  return String(value);
}

export const notifyTelegramOnReservationCreated = onDocumentCreated(
  {
    document: "rezervari/{docId}",
    region: "us-central1",
    secrets: [telegramBotToken, telegramChatId],
  },
  async (event) => {
    const data = event.data?.data();

    if (!data) {
      logger.warn("Reservation create trigger fired without document data", {
        params: event.params,
      });
      return;
    }

    const token = telegramBotToken.value();
    const chatId = telegramChatId.value();

    if (!token || !chatId) {
      logger.error("Telegram credentials are missing. Set TELEGRAM_BOT_TOKEN and TELEGRAM_CHAT_ID secrets.");
      return;
    }

    const docId = event.params?.docId || "unknown";
    const message = [
      `Noua rezervare #${docId}`,
      `Nume: ${asText(data.name)}`,
      `Telefon: ${asText(data.phone)}`,
      `Data: ${asText(data.date)}`,
      `Ora: ${asText(data.time)}`,
      `Persoane: ${asText(data.guests)}`,
      `Zona: ${asText(data.zone)}`,
      `Mesaj: ${asText(data.message)}`,
      `Sursa: ${asText(data.source)}`,
    ].join("\n");

    const response = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        chat_id: chatId,
        text: message,
        disable_web_page_preview: true,
      }),
    });

    if (!response.ok) {
      const body = await response.text();
      logger.error("Telegram sendMessage failed", {
        status: response.status,
        body,
        docId,
      });
      return;
    }

    logger.info("Telegram notification sent", { docId });
  }
);
