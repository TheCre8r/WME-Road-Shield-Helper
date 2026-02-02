import { GH } from "../constants";
import { log } from "../logger";
import { getSettings } from "../settings";
import { abbrState } from "../utils/states";
import { getStateNameForSelection, getTopCountryName } from "../utils/wme";

function createMessage(text: string, level: "Error" | "Alert"): void {
  const existing = document.querySelector("#WMERSH-Message");
  if (existing) {
    existing.remove();
  }
  const htmlString = `<div id="WMERSH-Message" class="${level}"><span>${text}</span></div>`;
  document.querySelector("#WMERSH-Autofill")?.insertAdjacentHTML("afterend", htmlString);
}

function clickEl(selector: string): void {
  (document.querySelector(selector) as HTMLElement | null)?.click();
}

function makeShield(match: RegExpMatchArray, stateOverride?: string, shieldOverride?: string, suffixOverride?: string): void {
  let state: string | undefined;
  let shield: string;
  let suffix: string;

  if (shieldOverride) {
    shield = shieldOverride;
  } else {
    shield = "State";
  }
  if (stateOverride) {
    state = stateOverride;
  } else {
    state = abbrState(match[1], "name");
  }
  if (suffixOverride) {
    suffix = suffixOverride;
  } else if (state === "Texas" && match[3] === "TOLL") {
    suffix = "Main Toll";
  } else if (
    state === "Texas" &&
    (match[3] === "BUS" || match[3] === "LOOP" || match[3] === "NASA" || match[3] === "SPUR" || match[3] === "Park")
  ) {
    suffix = `square ${match[3]}`;
  } else if (state === "Florida" && match[3] === "TOLL") {
    suffix = "Toll";
  } else if (state === "Alaska" && match[3] === "BUS") {
    suffix = `Main ${match[3]}`;
  } else if (match[3] !== undefined) {
    suffix = match[3];
  } else {
    suffix = "Main";
  }

  if (!state) {
    createMessage(`Error: ${match[1]} Road Shield is not available.`, "Error");
    return;
  }
  log(`Make State Shield for ${state}`);
  if ((suffix === "ALT" || suffix === "BUS" || suffix === "SPUR" || suffix === "TRUCK") && state === "Arkansas") {
    clickEl(
      `#wz-dialog-container > div > wz-dialog > wz-dialog-content > div:nth-child(1) > wz-menu > [title="${state} - ${shield} Main"]`
    );
  } else if (suffix === "Ranch to Market" && state === "Texas") {
    clickEl(`#wz-dialog-container > div > wz-dialog > wz-dialog-content > div:nth-child(1) > wz-menu > [title="${state}-${suffix}"]`);
  } else if (
    document.querySelector(
      `#wz-dialog-container > div > wz-dialog > wz-dialog-content > div:nth-child(1) > wz-menu > [title="${state} - ${shield} ${suffix}"]`
    )
  ) {
    clickEl(
      `#wz-dialog-container > div > wz-dialog > wz-dialog-content > div:nth-child(1) > wz-menu > [title="${state} - ${shield} ${suffix}"]`
    );
  } else if (
    !document.querySelector(
      `#wz-dialog-container > div > wz-dialog > wz-dialog-content > div:nth-child(1) > wz-menu > [title="${state} - ${shield} ${suffix}"]`
    ) &&
    match[3] !== undefined
  ) {
    createMessage(`Error: ${state} - ${shield} ${suffix} Road Shield is not available.`, "Error");
    return;
  } else {
    createMessage(`Error: ${match[1]} Road Shield is not available.`, "Error");
    return;
  }
}

export function autoFillShields(): void {
  const streetName =
    document.querySelector("#wz-dialog-container > div > wz-dialog > wz-dialog-header > div.street-name")?.textContent ??
    "";
  const regex =
    /(?:((?:(?:[A-Z]+)(?=\-))|(?:Beltway)|(?:Loop)|(?:TOLL)|(?:Parish Rd)|(?:Park Rd)|(?:Recreational Rd)|(?:Spur))(?:-|\ )((?:[A-Z]+)|(?:\d+(?:[A-Z])?(?:-\d+)?)))?(?: (ALT-TRUCK|BUS|ALT|BYP|CONN|SPUR|TRUCK|TOLL|Toll|LOOP|NASA|Park|LINK))?(?: (N|E|S|W))?(?: • (.*))?/;
  const shStates = ["Colorado", "Minnesota", "Oklahoma", "Texas"];
  const srStates = [
    "Alabama",
    "Arizona",
    "California",
    "Connecticut",
    "Florida",
    "Georgia",
    "Illinois",
    "Massachusetts",
    "Maine",
    "New Hampshire",
    "New Mexico",
    "Ohio",
    "Pennsylvania",
    "Utah",
    "Washington",
  ];
  const crStates = ["Alabama", "Arkansas", "Florida", "Louisiana", "Iowa", "Kansas", "New Jersey", "New York", "North Dakota", "South Dakota", "Tennessee"];
  const doneStates = ["Delaware", "North Carolina", "New Jersey", "Tennessee", "Virginia"].concat(srStates);
  const match = streetName.match(regex);

  const existingMessage = document.querySelector("#WMERSH-Message");
  if (existingMessage) {
    existingMessage.remove();
  }

  if (!match) {
    clickEl("#wz-dialog-container > div > wz-dialog > wz-dialog-controls > wz-button.remove-road-shield.hydrated");
    createMessage("Error: Road does not need a shield.", "Error");
    return;
  } else if (streetName !== match[0]) {
    createMessage("Potential Error: Please Review", "Error");
  }

  const state = getStateNameForSelection();
  switch (match[1]) {
    case "Beltway":
    case "Loop":
    case "NASA":
    case "Spur":
      if (state === "Texas") {
        makeShield(match, state, undefined, `square ${match[1].toUpperCase()}`);
      } else {
        createMessage(`Error: ${match[1]} Road Shield is not available for ${state}`, "Error");
      }
      break;
    case "CH":
      if (state === "Wisconsin") {
        makeShield(match, state, "County");
      } else if (state === "Illinois" || state === "Minnesota") {
        clickEl(
          '#wz-dialog-container > div > wz-dialog > wz-dialog-content > div:nth-child(1) > wz-menu > [title="CR generic Main"]'
        );
      } else {
        createMessage(`Error: ${match[1]} Road Shield is not available for ${state}`, "Error");
      }
      break;
    case "CR":
      if (crStates.indexOf(state ?? "") >= 0) {
        clickEl(
          '#wz-dialog-container > div > wz-dialog > wz-dialog-content > div:nth-child(1) > wz-menu > [title="CR generic Main"]'
        );
      } else if (state === "Illinois") {
        createMessage("Warning: Illinois does not use CR shields for CRs.", "Error");
      } else if (state === "Minnesota") {
        clickEl(
          '#wz-dialog-container > div > wz-dialog > wz-dialog-content > div:nth-child(1) > wz-menu > [title="Minnesota -County Road"]'
        );
      } else if (state === "West Virginia" && !streetName.includes("/")) {
        makeShield(match, state, "County", "Main");
      } else {
        createMessage(
          `Warning: CR design for this state has not been defined. <br>Consult local guidance and <a target="_blank" href="${GH.issue}" id="WMERSH-report-an-issue">${I18n.t(
            "wmersh.report_an_issue"
          )}</a>`,
          "Error"
        );
      }
      break;
    case "FM":
      if (state === "Texas" && match[3] === "BUS") {
        makeShield(match, state, undefined, "(FM) BUS");
      } else if (state === "Texas") {
        makeShield(match, state, undefined, match[1]);
      }
      break;
    case "Recreational Rd":
      if (state === "Texas") {
        makeShield(match, state, undefined, "Recreational");
      }
      break;
    case "RM":
      if (state === "Texas" && match[3] === "BUS") {
        makeShield(match, state, undefined, "(RM) BUS");
      } else if (state === "Texas") {
        makeShield(match, state, undefined, "Ranch to Market");
      } else {
        createMessage(`Error: ${match[1]} Road Shield is not available for ${state}`, "Error");
      }
      break;
    case "H":
    case "I":
      switch (match[3]) {
        case "BUS":
          clickEl(
            '#wz-dialog-container > div > wz-dialog > wz-dialog-content > div:nth-child(1) > wz-menu > [title="I-# BUS"]'
          );
          break;
        case "TOLL":
          if (state === "Texas") {
            clickEl(
              '#wz-dialog-container > div > wz-dialog > wz-dialog-content > div:nth-child(1) > wz-menu > [title="Texas - State Main Toll"]'
            );
          } else {
            createMessage(`Error: ${match[1]}-xx ${match[3]} Road Shield is not available for ${state}`, "Error");
          }
          break;
        default:
          clickEl(
            '#wz-dialog-container > div > wz-dialog > wz-dialog-content > div:nth-child(1) > wz-menu > [title="Interstate Main"]'
          );
          break;
      }
      break;
    case "IA":
      if (state === "Iowa") {
        clickEl(
          '#wz-dialog-container > div > wz-dialog > wz-dialog-content > div:nth-child(1) > wz-menu > [title="SR generic Main"]'
        );
      } else {
        createMessage(`Error: ${match[1]} Road Shield is not available for ${state}`, "Error");
      }
      break;
    case "K":
      if (state === "Kansas") {
        makeShield(match, state);
      } else {
        createMessage(`Error: ${match[1]} Road Shield is not available for ${state}`, "Error");
      }
      break;
    case "KY":
      if (state === "Kentucky") {
        clickEl(
          '#wz-dialog-container > div > wz-dialog > wz-dialog-content > div:nth-child(1) > wz-menu > [title="SR generic Main"]'
        );
      } else {
        createMessage(`Error: ${match[1]} Road Shield is not available for ${state}`, "Error");
      }
      break;
    case "M":
      if (state === "Michigan") {
        makeShield(match, state);
      } else {
        createMessage(`Error: ${match[1]} Road Shield is not available for ${state}`, "Error");
      }
      break;
    case "MS":
      if (state === "Mississippi") {
        clickEl(
          '#wz-dialog-container > div > wz-dialog > wz-dialog-content > div:nth-child(1) > wz-menu > [title="SR generic Main"]'
        );
      } else {
        createMessage(`Error: ${match[1]} Road Shield is not available for ${state}`, "Error");
      }
      break;
    case "N":
      if (state === "Nebraska") {
        makeShield(match, state);
      } else {
        createMessage(`Error: ${match[1]} Road Shield is not available for ${state}`, "Error");
      }
      break;
    case "Park Rd":
      if (state === "Texas") {
        makeShield(match, state, undefined, "square Park");
      } else {
        createMessage(`Error: ${match[1]} Road Shield is not available for ${state}`, "Error");
      }
      break;
    case "SH":
      if (shStates.indexOf(state ?? "") >= 0) {
        makeShield(match, state ?? undefined);
      } else if (state === "Missouri") {
        makeShield(match, state, undefined, "Supplemental");
      } else {
        createMessage(`Error: ${match[1]} Road Shield is not available for ${state}`, "Error");
      }
      break;
    case "SR":
      if (doneStates.indexOf(state ?? "") === -1) {
        createMessage(
          `Warning: State Shield Not Verified.<br>Consult local guidance and <a target="_blank" href="${GH.issue}" id="WMERSH-report-an-issue">${I18n.t(
            "wmersh.report_an_issue"
          )}</a>`,
          "Alert"
        );
      }
      if (srStates.indexOf(state ?? "") >= 0) {
        makeShield(match, state ?? undefined);
      } else if (state === "North Carolina") {
        createMessage(`Error: ${state} does not use road shields for Secondary Routes`, "Error");
      } else if (state === "Tennessee") {
        makeShield(match, state, undefined, "Secondary");
      } else if (state === "Virginia") {
        if (Number(match[2]) < 600 || match[2] === "785" || match[2] === "895") {
          makeShield(match, state);
        } else {
          createMessage(
            "Warning: Please verify that this road uses <b>SR Generic Main</b> and not <b>VA - State Main.</b>",
            "Alert"
          );
        }
      } else if (match[3] === undefined) {
        clickEl(
          '#wz-dialog-container > div > wz-dialog > wz-dialog-content > div:nth-child(1) > wz-menu > [title="SR generic Main"]'
        );
      } else if (match[3] !== undefined) {
        createMessage(`Error: SR ${match[3]} Road Shield is not available`, "Error");
        return;
      } else {
        createMessage(`Error: SR ${match[3]} Road Shield is not available`, "Error");
        return;
      }
      break;
    case "TOLL":
      if (state === "Texas") {
        makeShield(match, state, undefined, "Main Toll");
      }
      break;
    case "US":
      if (match[3] === undefined) {
        clickEl(
          '#wz-dialog-container > div > wz-dialog > wz-dialog-content > div:nth-child(1) > wz-menu > [title="US Hwy Main"]'
        );
      } else if ((match[3] === "ALT" || match[3] === "BUS" || match[3] === "SPUR" || match[3] === "TRUCK") && state === "Arkansas") {
        clickEl(
          '#wz-dialog-container > div > wz-dialog > wz-dialog-content > div:nth-child(1) > wz-menu > [title="US Hwy Main"]'
        );
      } else if (match[3] === "TOLL" && state === "Texas") {
        clickEl(
          '#wz-dialog-container > div > wz-dialog > wz-dialog-content > div:nth-child(1) > wz-menu > [title="Texas - State Main Toll"]'
        );
      } else if (
        document.querySelector(
          `#wz-dialog-container > div > wz-dialog > wz-dialog-content > div:nth-child(1) > wz-menu > [title="US-# ${match[3]}"]`
        )
      ) {
        clickEl(
          `#wz-dialog-container > div > wz-dialog > wz-dialog-content > div:nth-child(1) > wz-menu > [title="US-# ${match[3]}"]`
        );
      } else {
        createMessage(`Error: US-# ${match[3]} Road Shield is not available or does not parse`, "Error");
        return;
      }
      break;
    case "WIS":
      if (state === "Wisconsin") {
        makeShield(match, state);
      } else {
        createMessage(`Error: ${match[1]} Road Shield is not available for ${state}`, "Error");
      }
      break;
    case "Parish Rd":
      if (state === "Louisiana") {
        clickEl(
          '#wz-dialog-container > div > wz-dialog > wz-dialog-content > div:nth-child(1) > wz-menu > [title="CR generic Main"]'
        );
      } else {
        createMessage(`Error: ${match[1]} Road Shield is not available for ${state}`, "Error");
      }
      break;
    case "VA":
      if (state === "Virginia") {
        if (Number(match[2]) >= 600) {
          clickEl(
            '#wz-dialog-container > div > wz-dialog > wz-dialog-content > div:nth-child(1) > wz-menu > [title="SR generic Main"]'
          );
        } else {
          createMessage(
            "Warning: Please verify that this road uses <b>VA - State Main.</b> and not <b>SR Generic Main</b>",
            "Alert"
          );
        }
      } else {
        createMessage(`Error: ${match[1]} Road Shield is not available for ${state}`, "Error");
      }
      break;
    default:
      makeShield(match);
      break;
  }

  if (!document.querySelector("#WMERSH-Message") || !document.querySelector("#WMERSH-Message")?.classList.contains("Warning")) {
    const shieldTextInput = document.querySelector(
      "#wz-dialog-container > div > wz-dialog > wz-dialog-content > div:nth-child(2) > wz-text-input"
    ) as HTMLInputElement | null;
    const shieldDirectionInput = document.querySelector(
      "#wz-dialog-container > div > wz-dialog > wz-dialog-content > div:nth-child(3) > wz-text-input"
    ) as HTMLInputElement | null;
    const applyButton = document.querySelector(
      "#wz-dialog-container > div > wz-dialog > wz-dialog-controls > wz-button.apply-button.hydrated"
    ) as HTMLButtonElement | null;

    if (match[2] && shieldTextInput) {
      if (match[1] === "H") {
        shieldTextInput.value = `${match[1]}-${match[2]}`;
      } else if ((match[3] === "ALT" || match[3] === "BUS" || match[3] === "SPUR" || match[3] === "TRUCK") && state === "Arkansas") {
        switch (match[3]) {
          case "ALT":
            shieldTextInput.value = `${match[2]}A`;
            break;
          case "BUS":
            shieldTextInput.value = `${match[2]}B`;
            break;
          case "SPUR":
            shieldTextInput.value = `${match[2]}S`;
            break;
          case "TRUCK":
            shieldTextInput.value = `${match[2]}T`;
            break;
          default:
            break;
        }
      } else {
        shieldTextInput.value = match[2];
      }
    }
    if (shieldDirectionInput) {
      switch (match[4]) {
        case "N":
          shieldDirectionInput.value = "Nᴏʀᴛʜ";
          break;
        case "E":
          shieldDirectionInput.value = "Eᴀꜱᴛ";
          break;
        case "S":
          shieldDirectionInput.value = "Sᴏᴜᴛʜ";
          break;
        case "W":
          shieldDirectionInput.value = "Wᴇꜱᴛ";
          break;
        default:
          shieldDirectionInput.value = "";
          break;
      }
    }
    if (applyButton) {
      applyButton.disabled = false;
    }
  }
}

function addAutofillButton(): void {
  const htmlString = '<div id="WMERSH-Autofill"><wz-button class="hydrated">Autofill</wz-button></div>';
  document.querySelector("#wz-dialog-container > div > wz-dialog > wz-dialog-content")?.insertAdjacentHTML("afterend", htmlString);
  const autofill = document.querySelector("#WMERSH-Autofill");
  if (autofill) {
    (autofill as HTMLElement).onclick = () => autoFillShields();
  }
}

export function filterShields(state: string | null): void {
  const country = getTopCountryName();
  if ((country === "Canada" || country === "United States") && state) {
    log(`Filtered ${state}`);
    const menu = document.querySelector("#wz-dialog-container > div > wz-dialog > wz-dialog-content > div:nth-child(1) > wz-menu");
    if (!menu) {
      return;
    }
    for (let j = 1; j <= menu.childElementCount; j += 1) {
      const lineItem = document.querySelector(
        `#wz-dialog-container > div > wz-dialog > wz-dialog-content > div:nth-child(1) > wz-menu > wz-menu-item:nth-child(${j})`
      ) as HTMLElement | null;
      if (!lineItem) {
        continue;
      }
      const text = lineItem.innerText;
      const searchStrings = ["Interstate Main", "US Hwy", "SR generic", "CR generic", "I-", "US-", "BIA", "FSR", "National", state];
      let length = searchStrings.length;
      lineItem.hidden = true;
      while (length--) {
        if (text.indexOf(searchStrings[length]) !== -1) {
          if ((state === "Virginia" && text.includes("West Virginia")) || (state !== "Florida" && text.includes("FloridaI"))) {
            // Virginia has to be weird
          } else {
            lineItem.hidden = false;
          }
        }
      }
    }
  }
}

export function roadShieldObserver(): void {
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      for (let i = 0; i < mutation.addedNodes.length; i += 1) {
        if (
          document.querySelector("#wz-dialog-container > div > wz-dialog") &&
          document.querySelector("#wz-dialog-container > div > wz-dialog > wz-dialog-content > div:nth-child(1) > wz-menu")
        ) {
          log("Filter Ran");
          addAutofillButton();
          const settings = getSettings();
          if (settings.FilterByState) {
            filterShields(getStateNameForSelection());
          }
          if (settings.Debug) {
            document
              .querySelector("#wz-dialog-container > div > wz-dialog > wz-dialog-content > div:nth-child(1) > wz-label")
              ?.insertAdjacentHTML("beforeend", ' <i id="RSH_Flask" class="fas fa-flask"></i>');
            const flask = document.querySelector("#RSH_Flask");
            if (flask) {
              (flask as HTMLElement).onclick = () => {
                const state = prompt("Please enter state name", "");
                log(state ?? "");
                if (state !== null) {
                  filterShields(state);
                }
              };
            }
          }
        }
      }
    });
  });
  const dialogContainer = document.getElementById("wz-dialog-container");
  if (dialogContainer) {
    observer.observe(dialogContainer, { childList: true });
  }
}
