<script setup lang="ts">
const props = defineProps<{
  viz: IReportViz;
  title?: string;
}>();

const mapEl = ref<HTMLElement | null>(null);
let map: any = null;
let poly: any = null;

const init = async () => {
  if (!process.client || !mapEl.value) return;
  const L = await import("leaflet");

  const id = "leaflet-css";
  if (!document.getElementById(id)) {
    const link = document.createElement("link");
    link.id = id;
    link.rel = "stylesheet";
    link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
    document.head.appendChild(link);
  }

  // Crea mapa
  map = L.map(mapEl.value, { zoomControl: true });
  const tiles = L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
  });
  tiles.addTo(map);

  drawPath(L);
};

const drawPath = (L: any) => {
  if (!map || props.viz?.kind !== "gps") return;

  const path = (props.viz as any)?.path ?? [];
  if (!path.length) return;

  const latlngs = path.map((p: any) => [p.lat, p.lng]);

  if (poly) {
    map.removeLayer(poly);
    poly = null;
  }

  poly = L.polyline(latlngs, { weight: 4 }).addTo(map);

  const bounds = L.latLngBounds(latlngs);
  map.fitBounds(bounds, { padding: [20, 20] });
};

watch(
  () => props.viz,
  async () => {
    if (!process.client) return;
    const L = (await import("leaflet")).default || (await import("leaflet"));
    drawPath(L);
  },
  { immediate: true }
);

onMounted(init);

onBeforeUnmount(() => {
  if (map) {
    map.remove();
    map = null;
  }
});
</script>

<template>
  <div class="w-100" style="min-height: 360px">
    <div ref="mapEl" class="w-100 h-100" style="min-height: 360px"></div>
  </div>
</template>
