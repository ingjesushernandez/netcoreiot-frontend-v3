import { notificationsAxios } from "~/api/notifications.api";

export default function () {
  const store = useNotificationsStore();
  const api = notificationsAxios();

  const fetchUnread = async () => {
    try {
      store.loading = true;
      const { data } = await api.getUnread();
      store.setList(data.data ?? [], data.total ?? 0);
    } catch (err: any) {
      notifyApiError(err, "No fue posible cargar las notificaciones");
    } finally {
      store.loading = false;
    }
  };

  const markRead = async (id: string) => {
    try {
      await api.read(id);
      store.removeOne(id);
    } catch (err: any) {
      notifyApiError(err, "No fue posible marcar como leída");
    }
  };

  const prependFromMqtt = (msg: {
    notificationId?: string;
    deviceName: string;
    widgetTitle: string;
    measure: number;
    condition: string;
    setPoint: number;
    unit: string;
    time: number;
  }) => {
    const n: INotification = {
      _id: msg.notificationId || crypto.randomUUID(),
      deviceName: msg.deviceName,
      widgetTitle: msg.widgetTitle,
      measure: msg.measure,
      condition: msg.condition,
      setPoint: msg.setPoint,
      unit: msg.unit,
      readed: false,
      time: msg.time,
    };
    store.prepend(n);
    fetchUnread().catch(() => {});
  };

  return { fetchUnread, markRead, prependFromMqtt };
}
