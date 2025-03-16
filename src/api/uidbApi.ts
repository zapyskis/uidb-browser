import { UIDBResponse } from '../types/device';
import fallbackUIDB from '../devices.json';

const UIDB_URL = 'https://static.ui.com/fingerprint/ui/public.json';

export const fetchUidbData = async (): Promise<{
  data: UIDBResponse;
  usingFallback: boolean;
}> => {
  try {
    const response = await fetch(UIDB_URL);
    if (!response.ok) {
      throw new Error(`Fetch error! status: ${response.status}`);
    }
    const data = await response.json();
    return { data, usingFallback: false };
  } catch (error) {
    console.error('Failed to fetch UIDB data, fallback to local:', error);

    return { data: fallbackUIDB as unknown as UIDBResponse, usingFallback: true };
  }
};
