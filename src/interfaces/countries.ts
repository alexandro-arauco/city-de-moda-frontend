export interface Country {
  name: string;
  states: { name: string }[];
}

export interface States {
  name: string;
  latitude: string;
  longitude: string;
}
