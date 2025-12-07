import type { IPaged, IParams } from "./api.interfaces";

interface IEnableRule {
  emqxRuleId: string;
  enable: boolean;
}

export interface ICredentials {
  username: string;
  password: string;
}

export const mqttAxios = () => {
  const { $api } = useNuxtApp();

  return {
    saveRuleEnable: (payload: IEnableRule) => $api.patch<IPaged<null>>("/mqtt/save-rule/enable", payload),

    findAllAlarms: (params?: IParams) => $api.get<IPaged<IAlarmRule[]>>("/mqtt/alarm-rule/find-all", { params }),

    alarmRuleDelete: (id: string) => $api.delete<IPaged<null>>(`/mqtt/alarm-rule/delete/${id}`),

    alarmRuleEnable: (payload: IEnableRule) => $api.patch<IPaged<null>>("/mqtt/alarm-rule/enable", payload),

    alarmRuleCreate: (payload: ICreateAlarm) => $api.post<IPaged<null>>("/mqtt/alarm-rule/create", payload),

    // A U T H
    getWebCredentials: () => $api.get<ICredentials>("/mqtt/auth/get-web-credentials"),
  };
};
