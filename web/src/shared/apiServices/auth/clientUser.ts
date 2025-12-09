import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "./querykeys";
import { ClientUserAdapter } from "./clientUserAdapter";


export async function getClientDetails(id: string) {
	const response = await ClientUserAdapter.getClientUserById(id);
	return response;
}


export function useClientGetDetails(filter:) {
	return useQuery({
		queryKey: [queryKeys.CLIENT_USER_BY_ID(id)],
		queryFn: () => getClientDetails(id),
		enabled: !!id,
	})
}
