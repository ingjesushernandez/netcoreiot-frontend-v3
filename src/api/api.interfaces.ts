export type SortType = "asc" | "desc";

export interface IParams {
  select?: string;
  limit?: number;
  offset?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: SortType;
  startDate?: string;
  endDate?: string;
}

export interface IPaged<T> {
  success: boolean;
  message: string;
  data: T;
  total?: number;
}

export interface ServerOptions {
  page: number;
  rowsPerPage: number;
  sortBy?: string;
  sortType?: SortType;
}

export interface UseListDeps<T> {
  fetcher: (q: IParams, signal?: AbortSignal) => Promise<{ items: T[]; total: number }>;
  setList: (items: T[], total: number) => void;
  loadingRef: Ref<boolean>;
}
