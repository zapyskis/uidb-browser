const SETTINGS_PREFIX = 'app_setting_';

export const getSetting = (key: string): string | null => {
  try {
    return localStorage.getItem(`${SETTINGS_PREFIX}${key}`);
  } catch {
    return null;
  }
};

export const setSetting = (key: string, value: string): void => {
  try {
    localStorage.setItem(`${SETTINGS_PREFIX}${key}`, value);
  } catch {
    // no-op
  }
};
