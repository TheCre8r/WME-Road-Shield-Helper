import { log } from "../logger";
import { setNativeValue } from "../utils/dom";
import { getSelectedSegmentAddress } from "../utils/wme";

export function addText(character: string, element: HTMLInputElement | HTMLTextAreaElement | null | undefined): void {
  log(`${element}`);
  let v: string;
  let textBefore: string;
  let textAfter: string;
  if (!element) {
    return;
  }
  if ((element as unknown as { shadowRoot?: ShadowRoot }).shadowRoot) {
    const shadow = (element as unknown as { shadowRoot: ShadowRoot }).shadowRoot;
    const textInput = shadow.querySelector("#text-input") as HTMLElement | null;
    if (textInput) {
      element = textInput as HTMLInputElement;
    }
    element = shadow.querySelector("input") as HTMLInputElement;
  }
  const cursorStart = (element as HTMLInputElement).selectionStart ?? 0;
  const cursorEnd = (element as HTMLInputElement).selectionEnd ?? 0;
  v = (element as HTMLInputElement).value;
  textBefore = v.substring(0, cursorStart);
  textAfter = v.substring(cursorEnd, v.length);
  setNativeValue(element as HTMLInputElement, textBefore + character + textAfter);
  (element as HTMLInputElement).focus();
  (element as HTMLInputElement).setSelectionRange(cursorStart + character.length, cursorStart + character.length);
}

export function buttonFunctions(displayFor: "segmentNameButtons" | "TIOButtons"): void {
  log("GetLastElement Ran");
  const rootContainer = displayFor === "segmentNameButtons" ? ".address-edit" : displayFor === "TIOButtons" ? ".panel-content" : "";
  if (!rootContainer) {
    return;
  }
  let lastInputElement: HTMLInputElement | HTMLTextAreaElement | null = null;
  const root = document.querySelector(rootContainer);
  if (!root) {
    return;
  }
  root.addEventListener("focusin", () => {
    const active = document.activeElement as HTMLElement | null;
    if (!active) {
      return;
    }
    if (active.tagName === "INPUT" || active.tagName === "TEXTAREA" || active.tagName === "WZ-AUTOCOMPLETE") {
      lastInputElement = active as HTMLInputElement | HTMLTextAreaElement;
    } else if (active.tagName === "WZ-TEXTAREA") {
      lastInputElement = document.querySelector("#tts")?.shadowRoot?.querySelector("textarea") as HTMLTextAreaElement | null;
      console.log(lastInputElement);
    }
  });

  $(`.WMERSH-button.insertChar[displayFor="${displayFor}"`).click(function () {
    addText((this as HTMLButtonElement).value, lastInputElement);
  });
}

export function buttonPanel(displayFor: "segmentNameButtons" | "TIOButtons"): string {
  const address = getSelectedSegmentAddress();
  const countryName = address?.country?.name ?? "";
  const stateName = address?.state?.name ?? "";
  let buttonHTML = "";

  function addButton(id: string, value: string): void {
    buttonHTML += `<button displayFor="${displayFor}" class="WMERSH-button insertChar" type="button" id="rsh-txt-${id}" value="${value}"><span>${value}</span></button>`;
  }

  if (countryName === "United States" || countryName === "Canada") {
    addButton("concurrent", "•");
    addButton("towards", "»");
  }
  if (countryName === "United States") {
    addButton("north", "Nᴏʀᴛʜ");
    addButton("south", "Sᴏᴜᴛʜ");
    addButton("east", "Eᴀꜱᴛ");
    addButton("west", "Wᴇꜱᴛ");
    if (stateName === "North Carolina") {
      addButton("inner", "Iɴɴᴇʀ");
      addButton("outer", "Oᴜᴛᴇʀ");
    }
    addButton("to", "ᴛᴏ");
    addButton("via", "ᴠɪᴀ");
    addButton("jct", "ᴊᴄᴛ");
    addButton("parking", "🅿");
    addButton("airport", "✈︎");
  } else if (countryName === "Canada") {
    if (stateName === "Quebec") {
      addButton("nord", "ɴᴏʀᴅ");
      addButton("sud", "ꜱᴜᴅ");
      addButton("est", "ᴇꜱᴛ");
      addButton("ouest", "ᴏᴜᴇꜱᴛ");
    } else {
      addButton("north", "ɴᴏʀᴛʜ");
      addButton("south", "ꜱᴏᴜᴛʜ");
      addButton("east", "ᴇᴀꜱᴛ");
      addButton("west", "ᴡᴇꜱᴛ");
      addButton("to", "ᴛᴏ");
      addButton("via", "ᴠɪᴀ");
      addButton("jct", "ᴊᴄᴛ");
    }
  }

  return `<div id="WMERSH-panel" displayFor="${displayFor}" class="wmersh-panel">
                                <div id="WMERSH-panel-header" class="panel-header">
                                    <span style="-webkit-box-flex: 1;-ms-flex-positive: 1;flex-grow: 1;">Buttons</span>
                                </div>
                                <div>
                                    <div id="WMERSH-panel-buttons">
                                        ${buttonHTML}
                                    </div>
                                </div>
                            </div>`;
}
