interface ITemplateSub {
  _id: string;
  name: string;
  description: string;
  widgets: IWidgetSub[];
}

interface ISaveRuleSub {
  _id: string;
  status: boolean;
  emqxRuleId: string;
  emqxSinkId: string;
}

interface IAlarmRuleSub {
  _id: string;
  deviceName: string;
  widgetTitle: string;
  setPoint: number;
  condition: string;
  status: boolean;
  emqxRuleId: string;
  emqxSinkId: string;
}

export interface IDevice {
  _id: string;
  user: string;
  template: ITemplateSub;
  alarmRules: IAlarmRuleSub[];
  serial: string;
  name: string;
  password: string;
  description: string;
  selected: boolean;
  mqttStatus: boolean;
  saveRule: ISaveRuleSub;
  createdAt?: string;
  updatedAt?: string;
}

export interface ICreateDevice {
  user: string;
  template: string;
  serial: string;
  name: string;
  description: string;
}

export interface IDeviceSelected {
  _id: string;
  name: string;
  template: ITemplateSub;
  serial: string;
  selected: boolean;
}

export interface IDeviceOption {
  _id: string;
  name: string;
  widgets: IWidgetSub[];
}
