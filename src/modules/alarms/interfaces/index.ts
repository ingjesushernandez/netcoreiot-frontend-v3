export interface IAlarmRule {
  _id: string;
  user: string;
  device: string;
  deviceName: string;
  widgetId: string;
  widgetTitle: string;
  unit: string;
  setPoint: number;
  condition: string;
  triggerTime: number;
  counter: number;
  status: boolean;
  emqxRuleId: string;
  emqxSinkId: string;
  createdAt: string;
  updatedAt: string;
}

export interface ICreateAlarm {
  user: string;
  device: string;
  deviceName: string;
  widgetId: string;
  widgetTitle: string;
  unit: string;
  condition: string;
  setPoint: number | null;
  triggerTime: number | null;
  email: string;
}
