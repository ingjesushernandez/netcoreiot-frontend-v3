export interface INotification {
  _id: string;
  deviceName: string;
  widgetTitle: string;
  measure: number;
  condition: string;
  setPoint: number;
  unit: string;
  time: number;
  readed: boolean;
  createdAt?: string;
}

export interface IUnreadResponse {
  message: string;
  data: INotification[];
  total: number;
}
