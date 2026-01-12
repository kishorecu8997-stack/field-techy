import { useQuery } from "@tanstack/react-query";
import { ClientUserAdapter } from "./clientUserAdapter";
import { queryKeys } from "./queryKeys";

export async function getClientDetails(id: string) {
  const response = await ClientUserAdapter.getClientUserById(id);
  return response;
}

export function useClientGetDetails(id: string) {
  return useQuery({
    queryKey: [queryKeys.CLIENT_USER_BY_ID(id)],
    queryFn: () => getClientDetails(id),
    enabled: !!id,
  });
}
