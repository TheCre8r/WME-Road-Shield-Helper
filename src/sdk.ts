import type { WmeSDK } from "wme-sdk-typings";
import { SCRIPT_ID, SCRIPT_NAME, SCRIPT_VERSION } from "./constants";
import { log } from "./logger";

let sdk: WmeSDK | null = null;

function getHostWindow(): Window {
  return (typeof unsafeWindow !== "undefined" ? unsafeWindow : window) as Window;
}

async function waitForSdkInitialized(win: Window): Promise<void> {
  if (win.SDK_INITIALIZED) {
    await win.SDK_INITIALIZED;
    return;
  }

  await new Promise<void>((resolve) => {
    const interval = setInterval(() => {
      if (win.SDK_INITIALIZED) {
        clearInterval(interval);
        resolve();
      }
    }, 50);
  });

  await win.SDK_INITIALIZED;
}

export async function initSdk(): Promise<WmeSDK> {
  if (sdk) {
    return sdk;
  }

  const win = getHostWindow();
  await waitForSdkInitialized(win);

  if (!win.getWmeSdk) {
    throw new Error("WME SDK not available on window.getWmeSdk");
  }

  sdk = win.getWmeSdk({
    scriptId: SCRIPT_ID,
    scriptName: SCRIPT_NAME,
    version: SCRIPT_VERSION,
  });
  log("SDK initialized", 1);
  return sdk;
}

export function getSdk(): WmeSDK {
  if (!sdk) {
    throw new Error("SDK not initialized");
  }
  return sdk;
}
