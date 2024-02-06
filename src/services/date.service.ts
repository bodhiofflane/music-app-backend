export const dateTransformService = (date: string) => {
  const transformDate = new Date(date);
  return `${transformDate.getFullYear()}-${transformDate.getMonth() + 1}-${transformDate.getDay()}`;
}