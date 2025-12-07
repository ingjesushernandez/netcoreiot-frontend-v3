// reports.interfaces.ts
export type DataKind = "num" | "gps";

export type BucketKey = "none" | "1m" | "5m" | "15m" | "1h" | "6h" | "1d";

export interface IReportQueryDto {
  device: string;
  widgetId: string;
  startDate?: string;
  endDate?: string;
  limit?: number;
  offset?: number;
  bucket?: BucketKey;
}

export interface IReportMeta {
  kind: DataKind;
  widgetTitle?: string; // opcional: por si el backend lo manda
  unit?: string; // opcional: por si el backend lo manda
}

export interface IReportItemNum {
  time: number;
  valueNum: number;
}

export interface IReportItemGps {
  time: number;
  lat: number;
  lng: number;
}

export interface IReportVizNumBucket {
  kind: "num";
  bucket: Exclude<BucketKey, "none">;
  points: Array<{ t: number; avg: number; min: number; max: number }>;
}

export interface IReportVizNumRaw {
  kind: "num";
  bucket: "none";
  points: Array<{ time: number; value: number }>;
}

export interface IReportVizGps {
  kind: "gps";
  path: Array<{ time: number; lat: number; lng: number }>;
}

export type IReportViz = IReportVizNumBucket | IReportVizNumRaw | IReportVizGps;

export interface IReportResponse {
  meta: IReportMeta;
  total: number;
  limit: number;
  offset: number;
  items: Array<IReportItemNum | IReportItemGps>;
  viz: IReportViz | null;
}

/** Dispositivo mínimo para selector con widgets */
export interface ISelectDevice {
  _id: string;
  name: string;
  serial?: string;
  selected?: boolean;
  template?: {
    widgets?: Array<{
      widgetId: string;
      title: string;
      type: string;
      unit?: string;
      class?: string;
      direction?: "input" | "output" | "inout";
    }>;
  };
}

export interface IReportOption {
  value: string;
  label: string;
}
