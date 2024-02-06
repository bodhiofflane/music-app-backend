export const conversionToNumberService = (value: string | null): number | null => {
  if (!value || !Number.isFinite(Number.parseInt(value))) {
    return null;
  }
  return Number.parseInt(value);
}