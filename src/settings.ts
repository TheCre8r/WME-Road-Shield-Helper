import { SCRIPT_HISTORY, SCRIPT_NAME, SCRIPT_VERSION, STORE_NAME, UPDATE_ALERT, GH } from "./constants";
import { log } from "./logger";
import { startScriptUpdateMonitor } from "./updateMonitor";

export type Settings = {
  FilterByState: boolean;
  TurnInstructionPreview: boolean;
  Debug: boolean;
  lastVersion: string | number;
};

let settings: Settings = {
  FilterByState: true,
  TurnInstructionPreview: true,
  Debug: false,
  lastVersion: 0,
};

export function getSettings(): Settings {
  return settings;
}

function setChecked(checkboxId: string, checked: boolean): void {
  $(`#WMERSH-${checkboxId}`).prop("checked", checked);
}

export function loadSettings(): void {
  const loadedSettings = JSON.parse(localStorage.getItem(STORE_NAME));
  const defaultSettings: Settings = {
    FilterByState: true,
    TurnInstructionPreview: true,
    Debug: false,
    lastVersion: 0,
  };
  settings = { ...defaultSettings, ...(loadedSettings ?? {}) };
  log("Settings Loaded", 1);
}

export function saveSettings(): void {
  if (localStorage) {
    settings.lastVersion = SCRIPT_VERSION;
    localStorage.setItem(STORE_NAME, JSON.stringify(settings));
    log("Settings Saved", 1);
  }
}

export function initializeSettings(): void {
  startScriptUpdateMonitor();
  loadSettings();
  let scriptChanges = "";
  const history = $.parseJSON(SCRIPT_HISTORY);
  if (history.versions[0].version.substring(0, 13) !== SCRIPT_VERSION.substring(0, 13)) {
    scriptChanges += "No Changelog Reported<br><br>";
  }
  history.versions.forEach((item: { version: string; changes: string }) => {
    if (item.version.substring(0, 13) === SCRIPT_VERSION.substring(0, 13)) {
      scriptChanges += `${item.changes}<br><br>`;
    } else {
      scriptChanges += `<h6 style="line-height: 0px;">${item.version}</h6>${item.changes}<br><br>`;
    }
  });
  if (UPDATE_ALERT) {
    WazeWrap.Interface.ShowScriptUpdate(
      SCRIPT_NAME,
      SCRIPT_VERSION,
      scriptChanges,
      `"</a><a target="_blank" href='${GH.link}'>GitHub</a><a style="display:none;" href="`,
      "#"
    );
  }
  setChecked("Debug", settings.Debug);
  setChecked("FilterByState", settings.FilterByState);
  setChecked("TurnInstructionPreview", settings.TurnInstructionPreview);

  $("#WMERSH-Debug").change(function () {
    settings.Debug = (this as HTMLInputElement).checked;
    saveSettings();
  });
  $("#WMERSH-FilterByState").change(function () {
    settings.FilterByState = (this as HTMLInputElement).checked;
    saveSettings();
  });
  $("#WMERSH-TurnInstructionPreview").change(function () {
    settings.TurnInstructionPreview = (this as HTMLInputElement).checked;
    saveSettings();
  });
  log("Settings Initialized", 1);
}
