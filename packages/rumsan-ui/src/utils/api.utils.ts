import { RumsanClient } from '@rumsan/sdk/clients';
import { useRumsan } from '../providers/rumsan.provider';
import { useRumsanAppStore } from '../stores/app.store';

export function useRemoteClient(apiUrl: string) {
  const { accessToken, appId, clientId } = useRumsanAppStore();
  const { queryClient } = useRumsan();
  return {
    apiClient: new RumsanClient({
      baseURL: apiUrl,
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'rs-app-id': appId,
        'rs-client-id': clientId,
      },
    }),
    queryClient,
  };
}
