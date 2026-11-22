/** Minimal STOMP-over-WebSocket client (no external deps). */

export type StompFrame = {
  command: string;
  headers: Record<string, string>;
  body: string;
};

export class StompClient {
  private ws: WebSocket | null = null;
  private url: string;
  private connected = false;
  private onConnect: (() => void) | null = null;
  private onMessage: ((frame: StompFrame) => void) | null = null;
  private subscriptions: Map<string, (frame: StompFrame) => void> = new Map();
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelayMs = 2000;

  constructor(url: string) {
    this.url = url;
  }

  connect() {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) return;
    try {
      this.ws = new WebSocket(this.url);
      this.ws.binaryType = "arraybuffer";
      this.ws.onopen = () => {
        this.connected = true;
        this.reconnectAttempts = 0;
        this.sendFrame("CONNECT", { "accept-version": "1.1,1.0", "heart-beat": "10000,10000" }, "");
        this.onConnect?.();
      };
      this.ws.onmessage = (event) => {
        const data = event.data instanceof ArrayBuffer ? new TextDecoder().decode(event.data) : event.data;
        const frame = this.parseFrame(data);
        if (!frame) return;
        if (frame.command === "CONNECTED") {
          this.onConnect?.();
        } else if (frame.command === "MESSAGE") {
          const dest = frame.headers["destination"];
          const cb = this.subscriptions.get(dest);
          if (cb) cb(frame);
        }
      };
      this.ws.onclose = () => {
        this.connected = false;
        this.ws = null;
        this.reconnect();
      };
      this.ws.onerror = () => {
        this.ws?.close();
      };
    } catch (e) {
      console.error("WebSocket error", e);
    }
  }

  private reconnect() {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) return;
    this.reconnectAttempts++;
    setTimeout(() => {
      this.connect();
    }, this.reconnectDelayMs * this.reconnectAttempts);
  }

  disconnect() {
    this.connected = false;
    if (this.ws) {
      this.sendFrame("DISCONNECT", {}, "");
      this.ws.close();
      this.ws = null;
    }
  }

  private sendFrame(command: string, headers: Record<string, string>, body: string) {
    if (!this.ws || this.ws.readyState !== WebSocket.OPEN) return;
    let frame = `${command}\n`;
    for (const [k, v] of Object.entries(headers)) {
      frame += `${k}:${v}\n`;
    }
    frame += "\n" + body + "\x00";
    this.ws.send(frame);
  }

  private parseFrame(data: string): StompFrame | null {
    const nullIdx = data.indexOf("\x00");
    const head = nullIdx === -1 ? data : data.slice(0, nullIdx);
    const body = nullIdx === -1 ? "" : data.slice(nullIdx + 1);
    const lines = head.split("\n");
    if (lines.length === 0) return null;
    const command = lines[0].trim();
    const headers: Record<string, string> = {};
    for (let i = 1; i < lines.length; i++) {
      const colon = lines[i].indexOf(":");
      if (colon === -1) continue;
      headers[lines[i].slice(0, colon).trim()] = lines[i].slice(colon + 1).trim();
    }
    return { command, headers, body };
  }

  subscribe(destination: string, callback: (frame: StompFrame) => void) {
    this.subscriptions.set(destination, callback);
    if (this.connected) {
      this.sendFrame("SUBSCRIBE", { destination, id: String(this.subscriptions.size), ack: "auto" }, "");
    }
  }

  unsubscribe(destination: string) {
    this.subscriptions.delete(destination);
    if (this.connected) {
      this.sendFrame("UNSUBSCRIBE", { destination }, "");
    }
  }

  send(destination: string, body: string) {
    this.sendFrame("SEND", { destination }, body);
  }

  isConnected() {
    return this.connected;
  }
}

/** Global singleton instance (one per browser tab). */
let stompClient: StompClient | null = null;

export function getStompClient(url = "ws://localhost:8080/ws"): StompClient {
  if (!stompClient) stompClient = new StompClient(url);
  return stompClient;
}
