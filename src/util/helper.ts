export const getMaskedId = (id: string): string => {
  if (!id) return "";
  if (id.length <= 2) return id;
  return `${id[0]}******${id[id.length - 1]}`;
};

export const getDaysGap = (d1: string, d2: string): number => {
  try {
    const date1 = new Date(d1),
      date2 = new Date(d2);

    const timeDiff = Math.abs(date2.getTime() - date1.getTime());

    return Math.floor(timeDiff / (1000 * 60 * 60 * 24)) + 1;
  } catch (error) {
    return 0;
  }
};
