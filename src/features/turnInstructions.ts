import { dlog, log } from "../logger";
import { setTextForSelector, waitForElement } from "../utils/dom";
import { getTopCountryName, getTopStateName } from "../utils/wme";
import { buttonFunctions, buttonPanel } from "../ui/buttons";

async function doTioAutofill(): Promise<void> {
  const state = getTopStateName() ?? "";
  const exittext =
    (document.querySelector("#tts")?.shadowRoot?.querySelector("[id*='wz-textarea']") as HTMLTextAreaElement | null)?.placeholder ??
    "";
  const regex = /((Exits?) (\d+(?:.*)?): (.*)|(to) (.*))/;
  const regex2 =
    /(?:((?:(?:[A-Z]+)(?=\-))|(?:Beltway)|(?:Loop)|(?:TOLL)|(?:Parish Rd)|(?:Park Rd)|(?:Recreational Rd)|(?:Spur))(?:-|\ )((?:[A-Z]+)|(?:\d+(?:[A-Z])?(?:-\d+)?)))?(?: (ALT-TRUCK|BUS|ALT|BYP|CONN|SPUR|TRUCK|TOLL|Toll|LOOP|NASA|Park|LINK))?(?: (N|E|S|W))?(?: • (.*))?/;
  const match = exittext.match(regex);
  let m4 = 4;
  let m5 = 5;

  if (match === null) {
    return;
  }

  if (match[2]) {
    if (match[2].includes("Exit")) {
      if ($(".exit-sign-item").length === 0) {
        (document.querySelector(".exit-signs > wz-button") as HTMLElement | null)?.click();
        dlog("click exit signs");
      }
      await waitForElement(".exit-signs-menu");
      const items = document.querySelector(".exit-signs-menu")?.querySelectorAll("wz-menu-item");
      if (
        (document.querySelector("#turn-override-select")?.shadowRoot?.querySelector("#select-wrapper > div > div > span") as HTMLElement | null)
          ?.innerText ===
        "Exit left"
      ) {
        if (items) {
          (items[1] as HTMLElement | undefined)?.click();
          dlog("click left arrow exit");
        }
      } else {
        if (items) {
          (items[0] as HTMLElement | undefined)?.click();
          dlog("click right arrow exit");
        }
      }
    }
  }

  if (match[m5]) {
    m4 += 2;
    m5 += 2;
  }

  if (match[3]) {
    setTextForSelector(".turnInstructionExitSigns > span > #text", match[3]);
    dlog(`set exit text: ${match[3]}`);
  }
  const strings = match[m4].split(/[\/»•]/);
  if (match[m4]) {
    const match2 = match[m4].match(regex2);
    console.log(match2);
  }

  await waitForElement(".turn-instruction-item");
  (document.querySelector(".turn-instruction-item > .w-icon-x") as HTMLElement | null)?.click();
  dlog("remove default text item");
  (document.querySelector(".panel-content > div > div > wz-menu > wz-menu-item") as HTMLElement | null)?.click();
  dlog("add roadshield item");
  let shck = 0;
  await waitForElement(".road-shields-menu wz-menu-item .street-name");
  const shieldcheck = document.querySelector(".road-shields-menu wz-menu-item .street-name")?.textContent ?? "";
  if (shieldcheck !== "No shields found on nearby streets - try zooming out") shck = 1;
  (document.querySelector(".turn-instruction-item > .w-icon-x") as HTMLElement | null)?.click();
  dlog("del roadshield item");

  strings.forEach(async (item, index) => {
    const trimmed = item.trim();
    const match2 = trimmed.match(regex2);
    if (match2?.[1] && match2?.[2]) {
      let itemText = trimmed;
      if (match2[1] === "CR" && state === "Texas") {
        itemText = `Co Rd ${match2[2]}`;
      }
      let x = 0;
      console.log(match2);
      (document.querySelector(".panel-content > div > div > wz-menu > wz-menu-item") as HTMLElement | null)?.click();
      dlog("add roadshield item");
      if (strings.length > 1) {
        (document.querySelector(".panel-content > div:nth-child(2) > div > wz-menu > wz-menu-item:nth-child(1)") as HTMLElement | null)?.click();
        dlog("add towards roadshield item");
      }
      if (shck === 1) {
        await waitForElement(`.panel-content > div > div > div > .turn-instruction-item:nth-child(${index + 1}) > wz-menu`);
        const shieldCount =
          document.querySelector(`.panel-content > div > div > div > .turn-instruction-item:nth-child(${index + 1}) > wz-menu`)
            ?.childElementCount ?? 0;

        for (let sc = 0; sc < shieldCount; sc += 1) {
          const dir1 =
            document.querySelector(
              `.panel-content > div > div > div > .turn-instruction-item:nth-child(${index + 1}) > wz-menu  > wz-menu-item:nth-child(${
                sc + 1
              }) > span.street-name`
            )?.textContent ?? "";
          if (dir1 === match2[0]) {
            x = 1;
            await waitForElement(`.panel-content > div > div > div > .turn-instruction-item:nth-child(${index + 1})`);
            const tiItem = document.querySelector(
              `.panel-content > div > div > div > .turn-instruction-item:nth-child(${index + 1}) > wz-menu > wz-menu-item:nth-child(${sc + 1})`
            ) as HTMLElement | null;
            tiItem?.click();
            dlog(`click TI item ${index + 1} menu item ${sc + 1}`);
            if (strings.length > 1) {
              await waitForElement(`.panel-content > div:nth-child(2) > div > div > .turn-instruction-item:nth-child(${index + 1})`);
              const towardItem = document.querySelector(
                `.panel-content > div:nth-child(2) > div > div > .turn-instruction-item:nth-child(${index + 1}) > wz-menu > wz-menu-item:nth-child(${sc + 1})`
              ) as HTMLElement | null;
              towardItem?.click();
              dlog(`click Toward item ${index + 1} menu item ${sc + 1}`);
            }
          }
        }
      }
      if (x === 0) {
        const removeTi = document.querySelector(
          `.panel-content > div > div > div > .turn-instruction-item:nth-child(${index + 1}) > i`
        ) as HTMLElement | null;
        removeTi?.click();
        dlog(`remove TI item ${index + 1}`);
        if (strings.length > 1) {
          const removeToward = document.querySelector(
            `.panel-content > div:nth-child(2) > div > div > .turn-instruction-item:nth-child(${index + 1}) > i`
          ) as HTMLElement | null;
          removeToward?.click();
          dlog(`remove Toward item ${index + 1}`);
        }
        (document.querySelector(".panel-content > div > div > wz-menu > wz-menu-item:nth-child(2)") as HTMLElement | null)?.click();
        dlog("click to add TI text");
        setTextForSelector(`.panel-content > div > div > div > .turn-instruction-item:nth-child(${index + 1}) > input[type=text]`, itemText);
        dlog(`set TI text # ${index + 1} to ${itemText}`);
        if (strings.length > 1) {
          (document.querySelector(".panel-content > div:nth-child(2) > div > wz-menu > wz-menu-item:nth-child(2)") as HTMLElement | null)?.click();
          dlog("click to add Towards text");
          setTextForSelector(`.panel-content > div:nth-child(2) > div > div > .turn-instruction-item:nth-child(${index + 1}) > input[type=text]`, itemText);
          dlog(`set Toward text # ${index + 1} to ${itemText}`);
        }
      }
      $("input#direction").trigger("input");
    } else {
      (document.querySelectorAll(".panel-content > div > div > wz-menu > wz-menu-item")[1] as HTMLElement | undefined)?.click();
      dlog("no match2 - click to add TI text");
      setTextForSelector(`.panel-content > div > div > div > span:nth-child(${index + 1}) > input[type=text]`, trimmed);
      dlog(`set TI text # ${index + 1} to ${trimmed}`);

      if (strings.length > 1) {
        (document.querySelector(".panel-content > div:nth-child(2) > div > wz-menu > wz-menu-item:nth-child(2)") as HTMLElement | null)?.click();
        dlog("click to add Towards text");
        setTextForSelector(`.panel-content > div:nth-child(2) > div > div > .turn-instruction-item:nth-child(${index + 1}) > input[type=text]`, trimmed);
        dlog(`set Toward text # ${index + 1} to ${trimmed}`);
      }
    }
    console.log(index);
    console.log(item);
  });
  $("input#text").trigger("input");
}

function addTioAutofillButton(): void {
  const htmlString = '<div id="WMERSH-TIO-Autofill"><wz-button class="hydrated">Autofill</wz-button></div>';
  document.querySelector(".turn-instructions-panel > div > div.panel-header")?.insertAdjacentHTML("afterbegin", htmlString);
  document.querySelector("#WMERSH-TIO-Autofill")?.addEventListener("click", () => {
    doTioAutofill();
  });
}

function tioButtons(): void {
  $(".turn-instructions-panel").before(buttonPanel("TIOButtons"));
  buttonFunctions("TIOButtons");
}

export function panelObserver(): void {
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      for (let i = 0; i < mutation.addedNodes.length; i += 1) {
        if (document.querySelector("#panel-container > div > wz-card")?.classList.contains("turn-instructions-panel")) {
          log("TIO Panel Detected");
          const topCountry = getTopCountryName();
          if (topCountry === "United States" || topCountry === "Canada") {
            tioButtons();
          }
          addTioAutofillButton();
        }
      }
    });
  });
  const panelContainer = document.querySelector("#panel-container");
  if (panelContainer) {
    observer.observe(panelContainer, { childList: true });
  }
}

export function addTioPanelButtons(): void {
  tioButtons();
  addTioAutofillButton();
}
