export type OptionsType = {
  label: string;
  value: string;
};

export function getOrdinal(num: number): string {
  const suffixes: Record<number, string> = {
    1: "st",
    2: "nd",
    3: "rd",
  };

  const lastDigit = num % 10;
  const lastTwoDigits = num % 100;

  // Correct special cases: 11, 12, 13
  if (lastTwoDigits >= 11 && lastTwoDigits <= 13) {
    return `${num}th`;
  }

  return `${num}${suffixes[lastDigit] || "th"}`;
}

export function getOrdinalList(): OptionsType[] {
  const list: OptionsType[] = [];

  for (let i = 1; i <= 31; i++) {
    const ordinal = getOrdinal(i);
    list.push({
      label: ordinal,
      value: ordinal,
    });
  }

  return list;
}

export function getMonthList(): OptionsType[] {
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  return months.map((month) => ({
    label: month,
    value: month,
  }));
}
