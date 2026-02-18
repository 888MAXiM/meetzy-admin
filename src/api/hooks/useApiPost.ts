import {
  type InvalidateQueryFilters,
  type QueryKey,
  useMutation,
  type UseMutationOptions,
  useQueryClient,
} from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { HTTP_STATUS, ROUTES } from "../../constants";
import { useAppDispatch } from "../../redux/hooks";
import { logout } from "../../redux/reducers/authSlice";
import type { CombinedErrorResponse } from "../../types/api";

function useApiPost<TInput, TResponse>(
  mutationKey: QueryKey,
  callback: (input: TInput) => Promise<TResponse>,
  options?: UseMutationOptions<TResponse, CombinedErrorResponse, TInput>
) {
  const q = useQueryClient();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  return useMutation<TResponse, CombinedErrorResponse, TInput>({
    mutationKey,
    mutationFn: callback,
    ...options,
    // eslint-disable-next-line no-shadow-restricted-names
    onSuccess: (data, variables, undefined, context) => {
      for (let i = 1; i < mutationKey.length; i++) {
        q.invalidateQueries({ queryKey: [mutationKey[i]] } as InvalidateQueryFilters);
      }
      options?.onSuccess?.(data, variables,undefined, context);
    },
    onError: (error: CombinedErrorResponse) => {
      switch (error.status) {
        case HTTP_STATUS.UNAUTHORIZED:
          dispatch(logout());
          navigate(ROUTES.LOGIN + `?returnUrl=${window.location.pathname}`, {
            replace: true,
          });
          break;
        default:
          break;
      }
    },
  });
}

export default useApiPost;
