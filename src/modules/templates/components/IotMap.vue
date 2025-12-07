<script setup lang="ts">
import L from "leaflet";

import iconUrl from "@/assets/img/logo/logo-icon.png";

const props = defineProps<{ config: IWidgetSub }>();

const lastTs = ref(Date.now());
const now = ref(Date.now());
let timer: any = null;
const timeAgo = (ms: number) => {
  let s = Math.max(0, Math.floor(ms / 1000));
  if (s < 60) return `${s} s`;
  const m = Math.floor(s / 60);
  if (m < 60) return `${m} min`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h} h`;
  const d = Math.floor(h / 24);
  return `${d} d`;
};

const configIcon = ref({
  iconUrl: iconUrl,
  iconSize: L.point(32, 32),
  iconAnchor: L.point(16, 32),
});

const getBrowserGeo = (): Promise<{ lat: number; lng: number }> =>
  new Promise((resolve, reject) => {
    if (!navigator.geolocation) return reject(new Error("Geoloc no soportada"));
    navigator.geolocation.getCurrentPosition(
      (p) => resolve({ lat: p.coords.latitude, lng: p.coords.longitude }),
      (err) => reject(err),
      { enableHighAccuracy: true, timeout: 8000, maximumAge: 0 }
    );
  });

const getIpFallback = async (): Promise<{ lat: number; lng: number }> => {
  try {
    const r = await fetch("https://ipapi.co/json/");
    const j = await r.json();
    if (j && j.latitude && j.longitude) {
      return { lat: j.latitude, lng: j.longitude };
    }
    return { lat: 41.94828534181167, lng: 12.52417281658689 };
  } catch {
    return { lat: 41.94828534181167, lng: 12.52417281658689 };
  }
};

const setDemoPosition = async () => {
  try {
    const g = await getBrowserGeo();
    pos.value = g;
  } catch {
    const ip = await getIpFallback();
    pos.value = ip;
  }
  lastTs.value = Date.now();
  maybeRecenter(pos.value);
};

// M Q T T
type LatLng = { lat: number; lng: number };
const { $listenOn, $listenOff } = useNuxtApp();
const pos = ref<LatLng>({ lat: 0, lng: 0 });

// Topics
const deviceId = computed(() => props.config.selectedDevice?.id || "");
const baseTopic = computed(() => {
  const user = (props.config as any).user || "";
  const widgetId = (props.config as any).widgetId || "";
  return user && deviceId.value && widgetId ? `${user}/${deviceId.value}/${widgetId}` : "";
});
const topicIn = computed(() => (baseTopic.value ? `${baseTopic.value}/sdata` : ""));

// ---- Leaflet
const mapRef = ref<any>(null);
const firstFix = ref(true);

const RECENTER_THRESHOLD_METERS = 250;
const toRad = (v: number) => (v * Math.PI) / 180;
const haversine = (a: LatLng, b: LatLng) => {
  const R = 6371000;
  const dLat = toRad(b.lat - a.lat);
  const dLon = toRad(b.lng - a.lng);
  const lat1 = toRad(a.lat);
  const lat2 = toRad(b.lat);
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
};

const maybeRecenter = (target: LatLng) => {
  const mapObj = mapRef.value?.leafletObject;
  if (!mapObj) return;

  if (firstFix.value) {
    mapObj.setView([target.lat, target.lng], props.config.zoomMap ?? 13);
    firstFix.value = false;
    return;
  }

  const currentCenter = mapObj.getCenter();
  const dist = haversine({ lat: currentCenter.lat, lng: currentCenter.lng }, target);
  if (dist > RECENTER_THRESHOLD_METERS) {
    mapObj.panTo([target.lat, target.lng], { animate: true });
  }
};

const onIncoming = (data: any) => {
  try {
    const lat = Number(data?.lat ?? 0);
    const lng = Number(data?.lng ?? 0);

    if (props.config.demo && (!lat || !lng)) {
      setDemoPosition();
    } else {
      pos.value = { lat, lng };
    }

    lastTs.value = Date.now();
    if (lat && lng) maybeRecenter(pos.value);
  } catch {}
};

const sub = (t: string) => t && $listenOn(t, onIncoming);
const unsub = (t: string) => t && $listenOff(t, onIncoming);

watch(
  topicIn,
  (t, old) => {
    if (old) unsub(old);
    pos.value = { lat: 0, lng: 0 };
    firstFix.value = true;

    if (props.config.demo) {
      setDemoPosition();
    }

    if (t) sub(t);
  },
  { immediate: true }
);

onMounted(() => {
  timer = setInterval(() => (now.value = Date.now()), 1000);
});

onUnmounted(() => {
  clearInterval(timer);
  if (topicIn.value) unsub(topicIn.value);
});
</script>

<template>
  <div class="card widget-card-h">
    <div class="card-header card-no-border pb-0">
      <div class="header-top">
        <div class="d-flex align-items-center gap-2">
          <h4 class="m-0">
            {{ config.title }}
          </h4>
        </div>
        <div class="card-header-right-icon">
          <span class="d-inline-block fw-normal text-muted">
            <Icon name="ph:clock-counter-clockwise-fill" />
            {{ timeAgo(now - lastTs) }} ago
          </span>
        </div>
      </div>
      <div class="mt-2">
        <Icon class="h5 me-2" :class="`widget-${config.class}`" :name="config.icon" />
        <span class="fw-normal"> lat: {{ pos.lat }}, lng: {{ pos.lng }} </span>
      </div>
    </div>

    <div class="card-body">
      <div id="widget-maps" style="width: auto; height: 380px">
        <LMap
          ref="mapRef"
          :zoom="config.zoomMap ?? 13"
          :center="[pos.lat || 0, pos.lng || 0]"
          :use-global-leaflet="false"
          :options="{ attributionControl: false }"
          style="height: 100%; width: 100%"
        >
          <LTileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" layer-type="base" name="OpenStreetMap" />
          <LLayerGroup>
            <LMarker :lat-lng="[pos.lat || 0, pos.lng || 0]">
              <LIcon :icon-size="configIcon.iconSize" :icon-anchor="configIcon.iconAnchor" class-name="marker-icon">
                <div class="custom-marker">
                  <img class="img-marker" :src="configIcon.iconUrl" alt="marker" />
                </div>
              </LIcon>
              <LPopup>{{ pos.lat }}, {{ pos.lng }}</LPopup>
            </LMarker>
          </LLayerGroup>
        </LMap>
      </div>
    </div>
  </div>
</template>
