export const getEnv = (key: any, defaultValue: any) => {
  const value = process.env[key];
  if (value === undefined) {
    return defaultValue;
  }
  return value;
};
