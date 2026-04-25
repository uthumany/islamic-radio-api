import { WebSocketServer, WebSocket } from "ws";
import { Server } from "http";
import { transcribeAudio } from "../services/whisperClient.js";

export function setupTranscriptionWebSocket(server: Server) {
  const wss = new WebSocketServer({ noServer: true });

  server.on("upgrade", (request, socket, head) => {
    const pathname = new URL(request.url || "", `http://${request.headers.host}`).pathname;

    if (pathname === "/ws/transcribe") {
      wss.handleUpgrade(request, socket, head, (ws) => {
        wss.emit("connection", ws, request);
      });
    }
  });

  wss.on("connection", (ws: WebSocket) => {
    console.log("Transcription WebSocket connected");

    let audioBuffer = Buffer.alloc(0);

    ws.on("message", async (data: Buffer) => {
      // Buffer the incoming PCM chunks
      audioBuffer = Buffer.concat([audioBuffer, data]);

      // If we have enough audio (e.g., 5 seconds at 16kHz mono 16-bit = 160,000 bytes)
      // For this implementation, we'll assume the client sends chunks and we transcribe every ~3 seconds
            // 5 seconds of 16kHz mono 16-bit PCM is 160000 bytes
      if (audioBuffer.length >= 160000) {
        const currentBuffer = audioBuffer;
        audioBuffer = Buffer.alloc(0); // Reset buffer

        try {
          const result = await transcribeAudio(currentBuffer);
          ws.send(JSON.stringify(result));
        } catch (error) {
          ws.send(JSON.stringify({ error: "Transcription failed" }));
        }
      }
    });

    ws.on("close", () => {
      console.log("Transcription WebSocket closed");
    });
  });

  return wss;
}
