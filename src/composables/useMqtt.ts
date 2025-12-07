import mqtt, { MqttClient, type IClientOptions, type IClientPublishOptions } from "mqtt";

import { mqttAxios, type ICredentials } from "~/api/mqtt.api";
import sound from "~/assets/media/alerta2.mp3";

const player = ref(new Audio(sound));
const soundAlert = () => {
  player.value.play();
};

const client = ref<MqttClient | null>(null);
const connected = ref(false);
const connecting = ref(false);

export default function () {
  const { $emit, $listenOn, $listenOff } = useNuxtApp();
  const cfg = useRuntimeConfig().public;
  const auth = useAuthStore();
  const api = mqttAxios();

  const lastError = ref<any>(null);

  const rotating = ref(false);
  const reconnectAttempts = ref(0);
  const MAX_RECONNECT_BEFORE_ROTATE = 2;

  const baseTopics = computed(() => {
    const uid = auth.loggedUserId ?? auth.loggedUser?._id;
    if (!uid) return [];
    return [`${uid}/+/+/info`, `${uid}/+/+/status`, `${uid}/+/+/sdata`, `${uid}/+/+/refresh`, `${uid}/+/+/alarm`];
  });

  const makeConnectUrl = () => `${cfg.mqttProtocol}://${cfg.mqttHost}:${cfg.mqttPort}/mqtt`;

  const buildOptions = (creds: ICredentials): IClientOptions => {
    const uid = auth.loggedUserId ?? auth.loggedUser?._id;
    return {
      clientId: `web_${uid}_${Math.random().toString(16).slice(2, 10)}`,
      username: creds.username,
      password: creds.password,
      protocol: cfg.mqttProtocol as any,
      keepalive: Number(cfg.mqttKeepalive || 60),
      connectTimeout: Number(cfg.mqttConnectTimeout || 5000),
      reconnectPeriod: Number(cfg.mqttReconnectMs || 2000),
      clean: true,
      protocolVersion: 4,
      encoding: "utf8",
    };
  };

  const getCredentialsMqtt = async (): Promise<ICredentials> => {
    const { data } = await api.getWebCredentials();
    if (!data) throw new Error("No credentials received");
    return data;
  };

  const registerSenderBus = () => {
    $listenOn("mqtt-sender", (toSend: { topic: string; msg: unknown; opts?: Partial<IClientPublishOptions> }) => {
      if (!client.value) return;
      const payload = typeof toSend.msg === "string" ? toSend.msg : JSON.stringify(toSend.msg);
      client.value.publish(toSend.topic, payload, { qos: 0, retain: false, ...(toSend.opts || {}) }, (err) => {
        if (err) console.log("[MQTT] Publish error ❌", err);
      });
    });
  };

  const handleMessage = (topic: string, payload: Buffer) => {
    try {
      const parts = topic.split("/");
      const msgType = parts[3];
      const str = payload.toString();

      if (msgType === "alarm") {
        let obj: any;
        try {
          obj = typeof str === "string" ? JSON.parse(str) : str;
        } catch {
          obj = { message: String(str) };
        }

        const message = `¡ALARMA! ${obj?.deviceName}, ${obj?.widgetTitle} es ${obj?.condition} a ${obj?.setPoint} ${obj?.unit}`;
        soundAlert();
        notifyApiError(message, "", { timeout: 8000 });

        const { prependFromMqtt } = useNotifications();
        prependFromMqtt({
          notificationId: obj?.notificationId,
          deviceName: obj?.deviceName ?? "Dispositivo",
          widgetTitle: obj?.widgetTitle ?? "Variable",
          measure: Number(obj?.setPoint ?? 0),
          condition: obj?.condition ?? ">",
          setPoint: Number(obj?.setPoint ?? 0),
          unit: obj?.unit,
          time: Number(obj?.time ?? Date.now()),
        });
        return;
      }
      if (msgType === "refresh") {
        $emit("devices/refresh");
        return;
      }
      // Para data-like: intentamos JSON, si falla pasa string
      let data: any;
      try {
        data = JSON.parse(str);
      } catch {
        data = str;
      }
      $emit(topic, data);
    } catch (e) {
      console.log("[MQTT] onMessage error ❌", e);
    }
  };

  const subscribeBase = () => {
    if (!client.value || !client.value.subscribe) return;
    const topics = baseTopics.value;
    if (!topics.length) return;

    client.value.subscribe(topics, { qos: 0 }, (err: any) => {
      if (err) {
        console.log("[MQTT] Failed to subscribe ❌", err);
        return;
      }
      console.log("[MQTT] Subscription Successful ✅");
    });
  };

  const rotateAndReconnect = async () => {
    if (rotating.value) return;
    rotating.value = true;

    try {
      console.log("[MQTT] Rotating credentials & reconnecting…");

      if (client.value) {
        try {
          client.value.end(true);
        } catch {}
        client.value = null;
      }
      connected.value = false;
      connecting.value = true;

      const creds = await getCredentialsMqtt();
      const url = makeConnectUrl();
      const opts = buildOptions(creds);

      client.value = mqtt.connect(url, opts);
      bindClientEvents();
      registerSenderBus();

      reconnectAttempts.value = 0;
    } catch (err) {
      lastError.value = err;
      console.log("[MQTT] rotateAndReconnect error ❌", err);
      setTimeout(() => rotateAndReconnect(), 2000);
    } finally {
      rotating.value = false;
    }
  };

  const bindClientEvents = () => {
    if (!client.value) return;
    const c = client.value;

    c.on("connect", () => {
      connected.value = true;
      connecting.value = false;
      lastError.value = null;
      reconnectAttempts.value = 0;
      console.log("[MQTT] Connected ✅");
      subscribeBase();
    });

    c.on("reconnect", () => {
      connecting.value = true;
      connected.value = false;
      reconnectAttempts.value += 1;
      console.log("[MQTT] Reconnecting… attempt: ", reconnectAttempts.value);

      if (reconnectAttempts.value >= MAX_RECONNECT_BEFORE_ROTATE) {
        rotateAndReconnect();
      }
    });

    c.on("close", () => {
      connected.value = false;
      console.log("[MQTT] Connection closed ❌");
    });

    c.on("error", (err: any) => {
      lastError.value = err;
      console.log("[MQTT] Error ❌", err?.message || err);

      const msg = String(err?.message || "").toLowerCase();
      if (
        msg.includes("not authorized") ||
        msg.includes("bad username") ||
        msg.includes("bad user name") ||
        msg.includes("connack")
      ) {
        rotateAndReconnect();
      }
    });

    c.on("message", handleMessage);
  };

  const startMqttClient = async () => {
    if (import.meta.server) return;
    if (client.value?.connected) return;

    try {
      connecting.value = true;

      const creds = await getCredentialsMqtt();
      const url = makeConnectUrl();
      const opts = buildOptions(creds);

      client.value = mqtt.connect(url, opts);
      bindClientEvents();
      registerSenderBus();
    } catch (e) {
      connecting.value = false;
      connected.value = false;
      lastError.value = e;
      console.log("[MQTT] start error ❌", e);
    }
  };

  const stopMqttClient = () => {
    try {
      client.value?.end(true);
    } catch {}
    client.value = null;
    connected.value = false;
    connecting.value = false;
    reconnectAttempts.value = 0;
    $listenOff("mqtt-sender", () => {});
  };

  return {
    connected,
    connecting,
    lastError,
    startMqttClient,
    stopMqttClient,
  };
}
