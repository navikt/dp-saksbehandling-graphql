declare global {
  interface Window {
    env: IEnv;
  }
}

interface IEnv {
  DP_VEDTAK_URL: string;
  IS_LOCALHOST: string;
}

export function getEnv(value: keyof IEnv) {
  const env = typeof window !== "undefined" ? window.env : process.env;

  return env[value] || "";
}
