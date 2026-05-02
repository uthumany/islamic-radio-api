# 🎙️ Islamic Radio API — Real-Time Arabic Audio-to-Text

A real-time Arabic audio transcription and subtitle system integrated directly into the Islamic Radio API client. As live radio audio streams play, spoken Arabic audio is captured, transcribed in real-time, and displayed as animated, synchronized subtitles with word-by-word highlighting.

## 🌟 Live Demo Application

### 🚀 Try It Live
**[🔗 Visit the Live Demo](https://arabic-transcription.netlify.app/)** - No setup required! Access the application instantly from your browser.

### 💻 View Source Code
**[GitHub Repository](https://github.com/uthumany/arabic-transcription-demo)** - Full source code and documentation available on GitHub.

A fully-featured React application showcasing the Islamic Radio API with real-time transcription capabilities:

### Demo Features:
- ✅ Real-time Arabic speech-to-text using OpenAI Whisper
- ✅ Word-by-word synchronization with audio playback  
- ✅ Full RTL typography support with Quranic diacritics
- ✅ Live subtitle display with customizable font sizes
- ✅ Station health monitoring with latency indicators
- ✅ Multi-language interface (English, Arabic, French, Urdu, Malay)
- ✅ Transcript export (copy/download)
- ✅ Fallback demo mode when API unavailable

### Local Development Setup:

```bash
# Clone the demo repository
git clone https://github.com/uthumany/arabic-transcription-demo.git
cd arabic-transcription-demo

# Install dependencies
pnpm install

# Start development server
pnpm run dev
```

Visit `http://localhost:3000` to see the demo in action.

### Connect to Your API Server:

1. Start the Islamic Radio API:
   ```bash
   npm run dev  # Runs on http://localhost:3001
   ```

2. Configure the demo app (`.env.local`):
   ```env
   VITE_API_URL=http://localhost:3001/api/v2
   VITE_WS_URL=ws://localhost:3001
   ```

3. The demo will automatically connect and display live stations with real-time transcription

**Full Documentation**: See the [Demo README](https://github.com/uthumany/arabic-transcription-demo/blob/main/README.md) for complete setup and integration instructions.

---

## 🚀 Live Transcription Endpoint

**Unified Real-Time Transcription Endpoint:**
```
ws://islamic-radio-api.uthumany.com/ws/transcribe
```
> This single URL handles the WebSocket connection for raw PCM audio streaming and returns word-timestamped Arabic transcription in real-time.

---

## 🛠️ Technical Details: Web Audio API Integration

The system leverages the **Web Audio API** to provide a high-performance pipeline for capturing live radio streams and preparing them for real-time transcription.

### 1. Audio Graph Architecture
The system utilizes a non-blocking audio graph that taps into the existing `<audio>` element without interfering with the user's listening experience.

| Component | Role |
| :--- | :--- |
| **MediaElementAudioSourceNode** | Captures the raw audio output from the HTML5 audio element. |
| **AudioWorkletNode** | Executes a custom `AudioProcessor` in a separate background thread (audio render thread) to prevent UI lag. |
| **AudioContext** | Orchestrates the graph and enforces a strict **16kHz sample rate**, optimal for the OpenAI Whisper model. |

### 2. Real-Time PCM Processing
To ensure compatibility with the ASR (Automatic Speech Recognition) backend, the raw audio is processed through several stages:

*   **Thread Isolation**: Unlike the deprecated `ScriptProcessorNode`, the `AudioWorklet` runs outside the main JavaScript thread, ensuring glitch-free audio capture even during heavy UI rendering.
*   **Format Conversion**: Browser-native `Float32Array` samples are converted into **16-bit Signed Integer PCM** (`Int16Array`) to reduce bandwidth and match the backend's expected format.
*   **Zero-Copy Transfer**: Audio chunks are sent from the worklet to the main thread using `postMessage` with **Transferable Objects**, minimizing CPU overhead by transferring memory ownership rather than cloning data.

### 3. Synchronization and Buffering
The integration manages the balance between live streaming and transcription latency:

*   **Delay Compensation**: A manual offset (in milliseconds) is integrated into the client-side state, allowing users to perfectly sync highlights if the stream buffer lags.
*   **Dual-Buffering Strategy**: Small 250ms chunks are captured by the worklet for steady streaming, while the server-side relay aggregates these into larger windows for the Whisper model to maintain context and accuracy.
*   **Time-Update Loop**: The system listens to the `timeupdate` event of the audio element to drive the highlight engine, calculating `active`, `spoken`, or `pending` states for every word.

---

## 📱 API Endpoints

### Primary JSON API Endpoint
**Get All Radio Stations:**
```
https://raw.githubusercontent.com/uthumany/radio-api/main/client/public/api/stations.json
```

---

## 📋 Available Radio Stations

| # | Station Name | Country | Stream Format | Genre |
|---|---|---|---|---|
| 1 | Holy Quran Radio Cairo | Egypt | MP3 | Quran, Islamic |
| 2 | Quran Radio Tafsir | Multiple | Unknown | Quran, Tafsir, Religious |
| 3 | Islam2Day Radio Channel 1 | Egypt | Unknown | Quran, Islamic |
| 4 | VosCast Station | Multiple | Unknown | Islamic Audio |

---

## 📚 Documentation

### API Documentation
Full API documentation including field descriptions, response formats, and integration examples is available at `/api/README.md`.

### Demo Application Documentation
Comprehensive setup and integration guide: [Demo README](https://github.com/uthumany/arabic-transcription-demo/blob/main/README.md)

### API Integration Guide
Detailed technical documentation for connecting to the transcription API: [API_INTEGRATION.md](https://github.com/uthumany/arabic-transcription-demo/blob/main/API_INTEGRATION.md)

---

## ⚠️ License
This API is provided under the **Creative Commons Zero (CC0-1.0)** license. Free to use for any purpose, no attribution required.
