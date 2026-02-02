import { DOWNLOAD_URL, SCRIPT_NAME, SCRIPT_VERSION } from "./constants";

export function startScriptUpdateMonitor(): void {
  try {
    const updateMonitor = new WazeWrap.Alerts.ScriptUpdateMonitor(
      SCRIPT_NAME,
      SCRIPT_VERSION,
      DOWNLOAD_URL,
      GM_xmlhttpRequest,
      DOWNLOAD_URL
    );
    updateMonitor.start();
  } catch (ex) {
    // Report, but don't stop if ScriptUpdateMonitor fails.
    console.error("WME Road Shield Helper:", ex);
  }
}
