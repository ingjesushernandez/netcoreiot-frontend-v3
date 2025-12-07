export const notificationsAxios = () => {
  const { $api } = useNuxtApp();
  return {
    getUnread: () => $api.get<IUnreadResponse>("/notifications/unread"),
    read: (id: string) => $api.patch(`/notifications/read/${id}`),
  };
};
