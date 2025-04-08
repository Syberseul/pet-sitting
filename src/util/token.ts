const LOCAL_STORAGE_KEY = "userInfo";

export const setToken = (key: string): void => {
  const storageInfo = localStorage.getItem(LOCAL_STORAGE_KEY);

  if (!storageInfo) return;

  const userInfo = JSON.parse(storageInfo);
  userInfo.token = key;

  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(userInfo));
};

export const getToken = (): string | undefined => {
  const storageInfo = localStorage.getItem(LOCAL_STORAGE_KEY);

  if (!storageInfo) return undefined;

  return JSON.parse(storageInfo)?.token || undefined;
};
