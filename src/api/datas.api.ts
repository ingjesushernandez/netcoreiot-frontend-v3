import type { IPaged } from "./api.interfaces";

interface IParamsData {
  device: string;
  widgetId: string;
  chartTimeAgo: number;
}

export const datasAxios = () => {
  const { $api } = useNuxtApp();

  return {
    getChartData: (params: IParamsData) => $api.get("/datas/chart", { params }),

    getReport: (params: Record<string, any>) => $api.get<IPaged<IReportResponse>>("/datas/report", { params }),
  };
};
