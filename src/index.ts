import { injectCss } from "./css";
import { initializeI18n } from "./i18n";
import { log } from "./logger";
import { initSdk } from "./sdk";
import { initializeSettings } from "./settings";
import { roadShieldObserver } from "./features/roadShields";
import { panelObserver } from "./features/turnInstructions";
import { turnPreviewObserver } from "./features/turnPreview";
import { editPanelObserver } from "./features/segmentNames";
import { initTab } from "./ui/tab";

function waitForDomReady(): Promise<void> {
  if (document.readyState === "complete" || document.readyState === "interactive") {
    return Promise.resolve();
  }
  return new Promise((resolve) => {
    document.addEventListener("DOMContentLoaded", () => resolve(), { once: true });
  });
}

async function bootstrap(): Promise<void> {
  await waitForDomReady();
  injectCss();

  try {
    const sdk = await initSdk();
    await sdk.Events.once({ eventName: "wme-ready" });
  } catch (error) {
    console.error("RSH SDK bootstrap failed:", error);
    return;
  }

  initializeI18n();
  await initTab();
  initializeSettings();
  editPanelObserver();
  roadShieldObserver();
  panelObserver();
  turnPreviewObserver();
  log("Bootstrap complete", 1);
}

void bootstrap();
