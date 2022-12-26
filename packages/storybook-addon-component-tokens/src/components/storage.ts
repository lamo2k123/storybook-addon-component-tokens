import { ADDON_ID } from "../constants";

const getSessionStorage = (key: string): Record<string, string | never> => {
  if (window.sessionStorage) {
    try {
      const sessionStorage = window.sessionStorage.getItem(key);
      if (sessionStorage) {
        const parsedStorage = JSON.parse(sessionStorage);
        return parsedStorage;
      }
    } catch (e) {
      console.warn(
        "[storybook-addon-component-tokens]",
        "Couldn't read sessionStorage",
        e
      );
      return {};
    }
  }
  return {};
};

const setSessionStorage = (
  key: string,
  data: Record<string, unknown>
): void => {
  if (window.sessionStorage) {
    if (data) {
      try {
        window.sessionStorage.setItem(key, JSON.stringify(data));
      } catch (e) {
        console.warn(
          "[storybook-addon-component-tokens]",
          "Couldn't write to sessionStorage"
        );
      }
    }
  }
};

export const updateStorage = (cssProps: Record<string, string>) => {
  const propertiesFromStorage = getSessionStorage(ADDON_ID);
  const newProperties = {} as Record<string, string>;
  Object.keys(cssProps).forEach((key) => {
    newProperties[key] = cssProps[key];
  });
  const newStorage = { ...propertiesFromStorage, ...newProperties };
  setSessionStorage(ADDON_ID, newStorage);
  return newStorage;
};

export const resetStorage = (cssPropNames?: string[]) => {
  const storedProperties = getSessionStorage(ADDON_ID);
  if (cssPropNames) {
    cssPropNames.forEach((cssPropName) => {
      if (cssPropName in storedProperties) {
        delete storedProperties[cssPropName];
      }
    });
  }
  setSessionStorage(ADDON_ID, storedProperties);
  return storedProperties;
};

export const mergeCustomPropertiesWithStorage = (
  fromParams: Record<string, string> = {},
  fromStorage = getSessionStorage(ADDON_ID)
) => ({ ...fromParams, ...fromStorage });
