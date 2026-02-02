import { GH, SCRIPT_VERSION, SVG_LOGO, TESTERS } from "../constants";
import { getSdk } from "../sdk";
import { log } from "../logger";

export async function initTab(): Promise<void> {
  const sdk = getSdk();
  const { tabLabel, tabPane } = await sdk.Sidebar.registerScriptTab();
  const userName = sdk.State.getUserInfo()?.userName ?? "";
  const showDebug = TESTERS.includes(userName);

  tabLabel.innerHTML = `<span>${SVG_LOGO}</span>`;
  tabLabel.title = "WME RSH";

  tabPane.id = "sidepanel-wmersh";
  tabPane.innerHTML = [
    "<div>",
    '<div id="WMERSH-header">',
    `<span id="WMERSH-title">${I18n.t("wmersh.tab_title")}</span>`,
    `<span id="WMERSH-version">${SCRIPT_VERSION}</span>`,
    "</div>",
    '<form class="attributes-form side-panel-section">',
    '<div class="form-group">',
    '<div class="controls-container">',
    `<input type="checkbox" id="WMERSH-FilterByState" value="on"><label for="WMERSH-FilterByState">${I18n.t(
      "wmersh.filter_by_state"
    )}</label>`,
    "</div>",
    '<div class="controls-container">',
    `<input type="checkbox" id="WMERSH-TurnInstructionPreview" value="on"><label for="WMERSH-TurnInstructionPreview">${I18n.t(
      "wmersh.turn_instruction_preview"
    )}</label>`,
    "</div>",
    showDebug
      ? `<div class="controls-container"><input type="checkbox" id="WMERSH-Debug" value="on"><label for="WMERSH-Debug">${I18n.t(
          "wmersh.settings_1"
        )}</label></div>`
      : "",
    "</div>",
    '<div class="form-group">',
    '<div class="WMERSH-report">',
    '<i class="fa fa-github" style="font-size: 13px; padding-right:5px"></i>',
    '<div style="display: inline-block;">',
    `<a target="_blank" href="${GH.issue}" id="WMERSH-report-an-issue">${I18n.t("wmersh.report_an_issue")}</a>`,
    "</div>",
    "</div>",
    '<div class="WMERSH-help" style="text-align: center;padding-top: 5px;">',
    '<i class="fa fa-question-circle-o" style="font-size: 13px; padding-right:5px"></i>',
    '<div style="display: inline-block;">',
    `<a target="_blank" href="${GH.wiki}" id="WMERSH-help-link">${I18n.t("wmersh.help")}</a>`,
    "</div>",
    "</div>",
    "</div>",
    "</form>",
    "</div>",
  ].join(" ");

  log("Tab Initialized", 1);
}
