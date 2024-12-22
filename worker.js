export default {
  async fetch(request, env) {
    if (request.method === "POST") {
      const url = new URL(request.url);
      if (url.pathname === "/webhook") {
        try {
          const update = await request.json();
          const botToken = env.BOT_TOKEN;

          // Handle /start command
          if (
            update.message &&
            update.message.text === "/start" &&
            update.message.chat
          ) {
            const chatId = update.message.chat.id;
            const response = {
              chat_id: chatId,
              text:
                "Welcome! Send me a video link, and I'll show it to you using the Terabox video downloader.",
            };
            await fetch(
              `https://api.telegram.org/bot${botToken}/sendMessage`,
              {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(response),
              }
            );
          }

          // Handle URL messages
          if (
            update.message &&
            update.message.text &&
            update.message.text.startsWith("http") &&
            update.message.chat
          ) {
            const chatId = update.message.chat.id;
            const userUrl = update.message.text;
            const videoUrl = `https://teraboxvideodownloader.nepcoderdevs.workers.dev/?url=${userUrl}`;

            const response = {
              chat_id: chatId,
              text: `Here is your video link:\n${videoUrl}`,
            };
            await fetch(
              `https://api.telegram.org/bot${botToken}/sendMessage`,
              {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(response),
              }
            );
          }

          return new Response("OK", { status: 200 });
        } catch (err) {
          console.error("Error handling request:", err);
          return new Response("Internal Server Error", { status: 500 });
        }
      }
    }

    return new Response("Not Found", { status: 404 });
  },
};
