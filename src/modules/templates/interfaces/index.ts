export type WidgetType =
  | "number_chart"
  | "number_indicator"
  | "status_indicator"
  | "map"
  | "button"
  | "switch"
  | "dimmer";

export type ClassType = "primary" | "secondary" | "success" | "warning" | "info";
type ColumnType = "col-md-3" | "col-md-4" | "col-md-6" | "col-md-12";
type DirectionType = "input" | "output" | "inout";

export interface ISelectedDeviceSub {
  id: string;
  name: string;
  serial: string;
}

export interface IWidgetSub {
  selectedDevice: ISelectedDeviceSub;
  widgetId: string;
  type: WidgetType;
  title: string;
  direction: DirectionType;
  class: ClassType;
  column: ColumnType;
  icon: string;
  // opcionales
  sendFreq?: string | null;
  unit?: string | null;
  decimals?: number | null;
  chartTimeAgo?: number | null;
  zoomMap?: number | null;
  textOn?: string | null;
  textOff?: string | null;
  message?: string | null;
  textButton?: string | null;
  demo?: boolean | null;
}

export interface ITemplate {
  _id: string;
  user: string;
  name: string;
  description: string;
  widgets: IWidgetSub[];
  createdAt?: string;
  updatedAt?: string;
}

export interface ICreateTemplate {
  user: string;
  name: string;
  description: string;
  widgets: IWidgetSub[];
}

export interface ITemplateOption {
  _id: string;
  name: string;
}
