import useVuelidate from "@vuelidate/core";
import { required } from "@vuelidate/validators";

import { datasAxios } from "~/api/datas.api";
import { devicesAxios } from "~/api/devices.api";
import type { IParams } from "~/api/api.interfaces";

export const BUCKETS: Array<{ value: BucketKey; label: string }> = [
  { value: "none", label: "Sin agrupación" },
  { value: "1m", label: "1 min" },
  { value: "5m", label: "5 min" },
  { value: "15m", label: "15 min" },
  { value: "1h", label: "1 hora" },
  { value: "6h", label: "6 horas" },
  { value: "1d", label: "1 día" },
];

type SortType = "asc" | "desc";
type ServerOptions = {
  page: number;
  rowsPerPage: number;
  sortBy?: string;
  sortType?: SortType;
};

const emptyForm = () =>
  ({
    device: "",
    widgetId: "",
    startDate: "",
    endDate: "",
    bucket: "none",
  } as {
    device: string;
    widgetId: string;
    startDate?: string;
    endDate?: string;
    bucket: BucketKey;
  });

export default function () {
  const auth = useAuthStore();
  const apiDatas = datasAxios();
  const apiDevices = devicesAxios();

  // -------- Filtros / Estado formulario
  const form = ref(emptyForm());
  const rules = computed(() => ({
    device: { required },
    widgetId: { required },
  }));
  const v$ = useVuelidate(rules, form);

  // -------- Paginación estilo EasyDataTable
  const serverOptions = ref<ServerOptions>({
    page: 1,
    rowsPerPage: 10,
    sortBy: undefined,
    sortType: "asc",
  });

  // -------- Estado de carga / error
  const loading = ref(false);
  const lastError = ref<any>(null);

  // -------- Dispositivos y widgets
  const loadingDevices = ref(false);
  const devices = ref<IDevice[]>([]);

  const deviceOptions = computed<IReportOption[]>(() => devices.value.map((d) => ({ value: d._id, label: d.name })));

  const currentDevice = computed<IDevice | undefined>(() => devices.value.find((d) => d._id === form.value.device));

  const widgetOptions = computed<IReportOption[]>(
    () =>
      currentDevice.value?.template?.widgets?.map((w: any) => ({
        value: w.widgetId,
        label: w.title,
      })) ?? []
  );

  // -------- Respuesta backend
  const meta = ref<IReportResponse["meta"] | null>(null);
  const totalItems = ref(0);
  const items = ref<any[]>([]);
  const viz = ref<IReportResponse["viz"]>(null);

  const kind = computed<DataKind>(() => meta.value?.kind ?? "num");
  const isGps = computed(() => kind.value === "gps");
  const isNum = computed(() => kind.value === "num");
  const hasData = computed(() => (totalItems.value ?? 0) > 0);

  // -------- Tabla
  const tableHeaders = computed(() => {
    if (isGps.value) {
      return [
        { text: "Fecha/Hora", value: "timeFmt" },
        { text: "Lat", value: "lat" },
        { text: "Lng", value: "lng" },
        { text: "Variable", value: "widgetTitle" },
      ];
    }
    return [
      { text: "Fecha/Hora", value: "timeFmt" },
      { text: "Valor", value: "valueNum" },
      { text: "Variable", value: "widgetTitle" },
      { text: "Unidad", value: "unit" },
    ];
  });

  // El nombre y unidad
  const widgetMeta = computed(() => {
    const metaFromDevice = pickWidgetMeta(currentDevice.value, form.value.widgetId);
    return {
      title: metaFromDevice.title || meta.value?.widgetTitle || "",
      unit: metaFromDevice.unit || meta.value?.unit || "",
    };
  });

  const itemsTable = computed(() => {
    const fmt = (t: number) => ((window as any)?.fmtDate ? (window as any).fmtDate(t) : new Date(t).toLocaleString());
    return (items.value ?? []).map((r: any) => ({
      ...r,
      widgetTitle: widgetMeta.value.title,
      unit: widgetMeta.value.unit,
      timeFmt: fmt(r.time),
    }));
  });

  // -------- Acciones
  const loadDevices = async () => {
    try {
      devices.value = [];
      const uid = auth.loggedUserId ?? auth.loggedUser?._id;
      if (!uid) return;

      loadingDevices.value = true;
      const q: IParams & { user?: string } = {
        user: uid,
        limit: 0,
        select: "name template serial selected",
      };
      const { data } = await apiDevices.findAll(q);
      if (data.message === "DEVICES_FOUND") {
        devices.value = data.data ?? [];
        // Autoseleccionar el device con selected=true
        const sel = devices.value.find((d) => (d as any).selected === true);
        if (sel) form.value.device = sel._id;
      }
    } catch (err: any) {
      notifyApiError(err, "No fue posible cargar los dispositivos");
    } finally {
      loadingDevices.value = false;
    }
  };

  const resetResults = () => {
    meta.value = null;
    items.value = [];
    viz.value = null;
    totalItems.value = 0;
    serverOptions.value.page = 1;
  };

  watch(
    () => form.value.device,
    () => {
      form.value.widgetId = "";
      resetResults();
    }
  );

  const fetchReport = async () => {
    await v$.value.$validate();
    if (v$.value.$invalid) return;

    try {
      loading.value = true;
      lastError.value = null;

      const limit = serverOptions.value.rowsPerPage;
      const offset = (serverOptions.value.page - 1) * serverOptions.value.rowsPerPage;

      const params: IReportQueryDto = {
        device: form.value.device,
        widgetId: form.value.widgetId,
        startDate: form.value.startDate || undefined,
        endDate: form.value.endDate || undefined,
        limit,
        offset,
        bucket: form.value.bucket,
      };

      const { data } = await apiDatas.getReport(params);
      const r = data.data as IReportResponse;

      meta.value = r.meta ?? null;
      totalItems.value = r.total ?? 0;
      items.value = r.items ?? [];
      viz.value = r.viz ?? null;
    } catch (err: any) {
      lastError.value = err;
      notifyApiError(err, "No fue posible cargar el reporte");
      resetResults();
    } finally {
      loading.value = false;
    }
  };

  const onUpdateServerOptions = async (next: Partial<ServerOptions>) => {
    serverOptions.value = { ...serverOptions.value, ...next };
    await fetchReport();
  };

  const exportCsv = () => {
    if (!itemsTable.value.length) return notifyApiError("No hay datos para exportar");

    const headers = isGps.value
      ? ["time", "lat", "lng", "widgetTitle", "unit"]
      : ["time", "valueNum", "widgetTitle", "unit"];

    const rows = itemsTable.value.map((r: any) =>
      isGps.value
        ? [r.time, r.lat, r.lng, r.widgetTitle ?? "", r.unit ?? ""]
        : [r.time, r.valueNum ?? 0, r.widgetTitle ?? "", r.unit ?? ""]
    );

    const csv = headers.join(",") + "\n" + rows.map((row) => row.map((c) => String(c)).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");

    const ttl = widgetMeta.value.title ? widgetMeta.value.title.replace(/\s+/g, "_") : "variable";
    const unitStr = widgetMeta.value.unit ? `_${widgetMeta.value.unit}` : "";

    a.href = url;
    a.download = `reporte_${ttl}${unitStr}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const titleMeta = computed(() => {
    const t = widgetMeta.value.title || "";
    const u = widgetMeta.value.unit ? ` (${widgetMeta.value.unit})` : "";
    return `${t}${u}`;
  });

  // ------- Helper
  const pickWidgetMeta = (device?: IDevice, widgetId?: string): { title: string; unit: string } => {
    const w = device?.template?.widgets?.find((w) => (w as any).widgetId === widgetId);
    return {
      title: w?.title ?? "",
      unit: (w as any)?.unit ?? "",
    };
  };

  return {
    // filtros
    form,
    v$,
    BUCKETS,

    // selects
    loadDevices,
    devices,
    deviceOptions,
    widgetOptions,
    loadingDevices,

    // resultados / tabla
    loading,
    lastError,
    meta,
    titleMeta,
    kind,
    isGps,
    isNum,
    viz,
    items,
    itemsTable,
    totalItems,

    serverOptions,
    onUpdateServerOptions,
    tableHeaders,

    // acciones
    fetchReport,
    resetResults,
    exportCsv,
  };
}
