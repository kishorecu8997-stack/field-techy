export type Option = {
  value: string;
  label: string;
};

export type StatesAndCities = {
  states: Record<string, Option[]>;
  cities: Record<string, Option[]>;
};