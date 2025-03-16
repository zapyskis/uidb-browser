export interface Device {
  id: string;
  line: {
    id: string;
    name: string;
  };
  shortnames: string[];
  abbrev: string;
  product: {
    abbrev: string;
    name: string;
  };
  images?: {
    default?: string;
    [key: string]: string | undefined;
  };
}

export interface UIDBResponse {
  devices: Device[];
  version: string;
}
