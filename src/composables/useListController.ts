import { watchDebounced } from "@vueuse/core";
import type { IParams, ServerOptions, UseListDeps } from "~/api/api.interfaces";

export default function <T>(deps: UseListDeps<T>) {
  const { fetcher, setList, loadingRef } = deps;

  const search = ref<string>("");
  const selectFields = ref<string | undefined>(undefined);
  const startDate = ref<string | undefined>(undefined);
  const endDate = ref<string | undefined>(undefined);
  const rowLoading = ref<Record<string, boolean>>({});

  const serverOptions = ref<ServerOptions>({
    page: 1,
    rowsPerPage: 10,
    sortBy: "createdAt",
    sortType: "desc",
  });

  let aborter: AbortController | null = null;
  const fetchList = async () => {
    try {
      if (aborter) aborter.abort();
      aborter = new AbortController();

      loadingRef.value = true;

      const { page, rowsPerPage, sortBy, sortType } = serverOptions.value;
      const query: IParams = {
        select: selectFields.value,
        limit: rowsPerPage,
        offset: (page - 1) * rowsPerPage,
        search: search.value || undefined,
        sortBy,
        sortOrder: sortType,
        startDate: startDate.value,
        endDate: endDate.value,
      };

      const { items, total } = await fetcher(query, aborter.signal);
      setList(items, total);
    } finally {
      loadingRef.value = false;
      aborter = null;
    }
  };

  const onUpdateServerOptions = (opts: Partial<ServerOptions>) => {
    serverOptions.value = { ...serverOptions.value, ...opts };
    fetchList();
  };

  const setSelectFields = (fields?: string | string[]) => {
    selectFields.value = !fields ? undefined : Array.isArray(fields) ? fields.join(",") : fields;
    serverOptions.value.page = 1;
    fetchList();
  };

  const setDateRange = (start?: string, end?: string) => {
    startDate.value = start;
    endDate.value = end;
    serverOptions.value.page = 1;
    fetchList();
  };

  watchDebounced(
    search,
    () => {
      serverOptions.value.page = 1;
      fetchList();
    },
    { debounce: 350, maxWait: 800 }
  );

  return {
    search,
    serverOptions,
    rowLoading,
    setSelectFields,
    setDateRange,
    onUpdateServerOptions,
    fetchList,
  };
}
