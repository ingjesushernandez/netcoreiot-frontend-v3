export const widgetSelect = [
  { value: "number_chart", label: "Gráfica numérica" },
  { value: "number_indicator", label: "Indicador numérico" },
  { value: "status_indicator", label: "Indicador estado" },
  { value: "map", label: "Mapa" },
  { value: "button", label: "Pulsador - Button" },
  { value: "switch", label: "Interruptor - Switch" },
  { value: "dimmer", label: "Regulador - Dimmer" },
];

export const decimalSelect = [0, 1, 2, 3].map((n) => ({ value: n, label: String(n) }));

export const columnSelect = [
  { value: "col-md-3", label: "Mínimo" },
  { value: "col-md-4", label: "Pequeño" },
  { value: "col-md-6", label: "Mediano" },
  { value: "col-md-12", label: "Completo" },
];

// Config Widgets
export const clone = <T>(x: T): T => JSON.parse(JSON.stringify(x));

const numberChartBlueprint = (overrides?: Partial<IWidgetSub>): IWidgetSub =>
  ({
    selectedDevice: {
      id: "deviceId",
      name: "Home",
      serial: "8888",
    },
    widgetId: "",
    type: "number_chart",
    title: "Temperatura",
    direction: "input",
    class: "primary",
    column: "col-md-6",
    icon: "fa6-solid:temperature-high",
    unit: "ºC",
    decimals: 1,
    chartTimeAgo: 60,
    sendFreq: "10",
    demo: true,
    ...(overrides ?? {}),
  } satisfies IWidgetSub);

const numberIndicatorBlueprint = (overrides?: Partial<IWidgetSub>): IWidgetSub =>
  ({
    selectedDevice: {
      id: "deviceId",
      name: "Home",
      serial: "8888",
    },
    widgetId: "",
    type: "number_indicator",
    title: "Temperatura",
    direction: "input",
    class: "primary",
    column: "col-md-4",
    icon: "fa6-solid:temperature-high",
    unit: "ºC",
    decimals: 1,
    sendFreq: "10",
    ...(overrides ?? {}),
  } satisfies IWidgetSub);

const statusIndicatorBlueprint = (overrides?: Partial<IWidgetSub>): IWidgetSub =>
  ({
    selectedDevice: {
      id: "deviceId",
      name: "Home",
      serial: "8888",
    },
    widgetId: "",
    type: "status_indicator",
    title: "Motor",
    direction: "input",
    class: "primary",
    column: "col-md-4",
    icon: "fa6-solid:gear",
    textOn: "Encendido",
    textOff: "Apagado",
    sendFreq: "10",
    ...(overrides ?? {}),
  } satisfies IWidgetSub);

const mapBlueprint = (overrides?: Partial<IWidgetSub>): IWidgetSub =>
  ({
    selectedDevice: {
      id: "deviceId",
      name: "Home",
      serial: "8888",
    },
    widgetId: "",
    type: "map",
    title: "ThermoKing",
    direction: "input",
    class: "primary",
    column: "col-md-6",
    icon: "fa6-solid:truck-moving",
    zoomMap: 13,
    sendFreq: "10",
    demo: true,
    ...(overrides ?? {}),
  } satisfies IWidgetSub);

const buttonBlueprint = (overrides?: Partial<IWidgetSub>): IWidgetSub =>
  ({
    selectedDevice: {
      id: "deviceId",
      name: "Home",
      serial: "8888",
    },
    widgetId: "",
    type: "button",
    title: "Luz",
    direction: "output",
    class: "primary",
    column: "col-md-4",
    icon: "fa6-solid:lightbulb",
    message: "true",
    textButton: "ON",
    ...(overrides ?? {}),
  } satisfies IWidgetSub);

const switchBlueprint = (overrides?: Partial<IWidgetSub>): IWidgetSub =>
  ({
    selectedDevice: {
      id: "deviceId",
      name: "Home",
      serial: "8888",
    },
    widgetId: "",
    type: "switch",
    title: "Motor",
    direction: "inout",
    class: "primary",
    column: "col-md-4",
    icon: "fa6-solid:gear",
    sendFreq: "10",
    ...(overrides ?? {}),
  } satisfies IWidgetSub);

const dimmerBlueprint = (overrides?: Partial<IWidgetSub>): IWidgetSub =>
  ({
    selectedDevice: {
      id: "deviceId",
      name: "Home",
      serial: "8888",
    },
    widgetId: "",
    type: "dimmer",
    title: "Luz",
    direction: "inout",
    class: "primary",
    column: "col-md-4",
    icon: "fa6-solid:lightbulb",
    sendFreq: "10",
    ...(overrides ?? {}),
  } satisfies IWidgetSub);

// Mapa de planos
const BLUEPRINTS: Record<WidgetType, (o?: Partial<IWidgetSub>) => IWidgetSub> = {
  number_chart: numberChartBlueprint,
  number_indicator: numberIndicatorBlueprint,
  status_indicator: statusIndicatorBlueprint,
  map: mapBlueprint,
  button: buttonBlueprint,
  switch: switchBlueprint,
  dimmer: dimmerBlueprint,
} as const;

export const makeWidget = (kind: WidgetType, overrides?: Partial<IWidgetSub>): IWidgetSub =>
  BLUEPRINTS[kind](overrides);
