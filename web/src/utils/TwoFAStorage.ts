const TWO_FA_KEY = "two_fa";

type TwoFaStorage = {
  email: string | null;
  secretBase32: string | null;
  otpauthUrl: string | null;
  enrolled: boolean;
  enabled: boolean;
  backupCodes: string[];
};

export const getTwoFaStorage = (): TwoFaStorage => {
  const raw = localStorage.getItem(TWO_FA_KEY);
  return raw
    ? JSON.parse(raw)
    : {
        email: null,
        secretBase32: null,
        otpauthUrl: null,
        enrolled: false,
        enabled: false,
        backupCodes: [],
      };
};

export const setTwoFaStorage = (data: Partial<TwoFaStorage>) => {
  const current = getTwoFaStorage();
  localStorage.setItem(TWO_FA_KEY, JSON.stringify({ ...current, ...data }));
};

export const removeTwoFaStorage = () => {
  localStorage.removeItem(TWO_FA_KEY);
};
