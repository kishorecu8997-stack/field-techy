// Location Options
export const LOCATION_OPTIONS = [
  { value: 'all', label: 'All' },
  { value: 'new', label: 'New First' },
  { value: 'old', label: 'Old First' },
  { value: 'top', label: 'Top Rated' },
  { value: 'popular', label: 'Popular First' },
] as const;

// Budget Options
export const BUDGET_OPTIONS = [
  { value: 'hourly', label: 'Hourly Price' },
  { value: 'fixed', label: 'Fixed Price' },
] as const;

// Rating Options
export const RATING_OPTIONS = [
  { value: '1', label: '1 Star' },
  { value: '2', label: '2 Star' },
  { value: '3', label: '3 Star' },
  { value: '4', label: '4 Star' },
  { value: '5', label: '5 Star' },
] as const;

// Derive types
export type LocationValue = (typeof LOCATION_OPTIONS)[number]['value'];
export type BudgetValue = (typeof BUDGET_OPTIONS)[number]['value'];
export type RatingValue = (typeof RATING_OPTIONS)[number]['value'];