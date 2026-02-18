import { useQuery, type UseQueryOptions } from "@tanstack/react-query";
import type { CombinedErrorResponse } from "../../types/api";

function useApiGet<T, P = void>(
  queryKey: unknown[],
  callback: (param?: P) => Promise<T>,
  options?: Omit<UseQueryOptions<T, CombinedErrorResponse, T, unknown[]>, "queryKey" | "queryFn">
) {
  return useQuery<T, CombinedErrorResponse, T, unknown[]>({
    queryKey,
    queryFn: async () => await callback(),
    refetchOnWindowFocus: false,
    ...options,
  });
}

export default useApiGet;
