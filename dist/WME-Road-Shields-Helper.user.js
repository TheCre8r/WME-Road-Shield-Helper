// ==UserScript==
// @name         WME Road Shield Helper
// @namespace    https://github.com/thecre8r/
// @version      2026.02.01.00
// @description  Road Shield Helper
// @match        https://www.waze.com/editor*
// @match        https://www.waze.com/*/editor*
// @match        https://beta.waze.com/editor*
// @match        https://beta.waze.com/*/editor*
// @exclude      https://www.waze.com/user/*
// @exclude      https://www.waze.com/dashboard/*
// @grant        GM_xmlhttpRequest
// @connect      raw.githubusercontent.com
// @author       The_Cre8r
// @require      https://greasyfork.org/scripts/24851-wazewrap/code/WazeWrap.js
// ==/UserScript==

/* global $ */
/* global W */
/* global WazeWrap */
/* global I18n */


(() => {
  // src/constants.ts
  var STORE_NAME = "WMERSH_Settings";
  var SCRIPT_ID = "wme-road-shield-helper";
  var SCRIPT_NAME = GM_info?.script?.name ?? "WME Road Shield Helper";
  var SCRIPT_VERSION = (GM_info?.script?.version ?? "0.0.0").toString();
  var SCRIPT_HISTORY = `{"versions": [{"version": "2026.01.15.01","changes": "Fix VI preview"},{"version": "2025.06.23.01","changes": "Added checks to avoid errors caused by empty TTS textbox"}, {"version": "2025.05.29.01","changes": "Fixed VI autofill"}, {"version": "2025.03.13.01","changes": "Fixed insert from button panel"}, {"version": "2025.01.06.01","changes": "Updated Match and Exclude List"},{"version": "2024.12.31.01","changes": "Shield Updates for IA/KS/MN/TN"},{"version": "2024.11.01.01","changes": "Fixed styling and TTS Override"},{"version": "2024.10.18.00","changes": "The turn instruction preview was playing hide-and-seek. Found it!"},{"version": "2023.08.27.01","changes": "Fix to turn instruction preview for turns to unnamed segments."},{"version": "2023.08.23.01","changes": "Compatibility update with WME V2.180."},{"version": "2023.02.11.01","changes": "Compatibility update. Added Minnesota CH shield logic."},{"version": "2021.12.30.001","changes": "jm6087 additions"},{"version": "2022.11.29.01","changes": "Code Cleanup"},{"version": "2022.08.30.01","changes": "Added button panel to segment name edit panel."},{"version": "2022.03.05.01","changes": "Fixed region-specific button logic"},{"version": "2022.01.22.01","changes": "More added support for additional new shields"},{"version": "2022.01.21.01","changes": "Added support for new shields"},{"version": "2021.08.09.01","changes": "Added the preview on the turn instruction dialog box"},{"version": "2021.07.07.03","changes": "Fixed another small \uA731 in West and East."},{"version": "2021.07.07.02","changes": "Fixed small \uA731 in West and East."},{"version": "2021.07.07.01","changes": "Added Buttons to Turn Instructions and all states should be compatible. Please be sure to report an issue on GitHub if you find one that is not working."},{"version": "2021.06.12.01","changes": "Support for Illinois CH Road Shields, a few more SH- States, a few more SR- States, and Arkansas's Shield Name Suffixes"},{"version": "2021.06.05.01","changes": "Support for Missouri Supplemental Road Shields"},{"version": "2021.06.03.02","changes": "Support for Kansas K-xxx format"},{"version": "2021.06.03.01","changes": "Added CR support for states using hexagon type shields"},{"version": "2021.06.02.01","changes": "Added SR Shield for New Hampshire"},{"version": "2021.06.01.02","changes": "Added County Shields for Wisconsin<br>Updated Changelog Format"},{"version": "2021.06.01.01","changes": "Fixed GitHub URL"},{"version": "2021.05.31.01","changes": "Added Wisconsin and other miscellaneous fixes"},{"version": "2021.05.23.01","changes": "Initial Version"}]}`;
  var GH = {
    link: "https://github.com/TheCre8r/WME-Road-Shield-Helper/",
    issue: "https://github.com/TheCre8r/WME-Road-Shield-Helper/issues/new",
    wiki: "https://github.com/TheCre8r/WME-Road-Shield-Helper/wiki"
  };
  var UPDATE_ALERT = false;
  var DOWNLOAD_URL = "https://raw.githubusercontent.com/TheCre8r/WME-Road-Shield-Helper/master/WME-Road-Shields-Helper.user.js";
  var TESTERS = [
    "The_Cre8r",
    "jm6087",
    "s18slider",
    "locojd1",
    "SethSpeedy28",
    "nzahn1",
    "Harmonious4",
    "turnertr",
    "sketch",
    "phuz"
  ];
  var SVG_LOGO = `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" id="Layer_1" width="13" height="13" viewBox="0 0 384 384" overflow="visible" enable-background="new 0 0 13384" xml:space="preserve" style="vertical-align: middle;"><path xmlns="http://www.w3.org/2000/svg" fill-rule="evenodd" clip-rule="evenodd" d="M303.8720703,28.0273438l50.3662109,52.1557617    C339.7480469,97.5253906,331,119.8857422,331,144.2758789c0,20.8432617,6.4052734,40.2626953,17.3476563,56.3041992    C357.5654297,214.0683594,363,230.4316406,363,248c0,46.2294922-37.3447266,83.7363281-83.5097656,83.9990234    C247.1210938,332.0214844,217.1582031,341.6162109,192,358.0605469c-25.1884766-16.4648438-55.1953125-26.0625-87.609375-26.0625    C58.2797852,331.6728516,21,294.1904297,21,248c0-17.5673828,5.4345703-33.9316406,14.6523438-47.4199219    C46.5942383,184.5385742,53,165.1191406,53,144.2758789c0-24.390625-8.7480469-46.7504883-23.2382813-64.0927734    l50.3662109-52.1557617C96.0566406,37.9365234,114.8740234,43.6699219,135,43.6699219c21.0283203,0,40.6298828-6.2587891,57-17    c16.3701172,10.7412109,35.9716797,17,57,17C269.1259766,43.6699219,287.9433594,37.9365234,303.8720703,28.0273438z     M249,31.6699219c21.2548828,0,40.8378906-7.2177734,56.4121094-19.3222656l65.4033203,67.7265625    C353.7060547,96.1201172,343,118.9477539,343,144.2758789c0,18.3544922,5.6318359,35.425293,15.2578125,49.5375977    C368.7890625,209.2226563,375,227.9277344,375,248c0,52.8339844-42.6796875,95.6992188-95.4414063,95.9980469    c-32.8427734,0.0117188-62.9824219,10.65625-87.5585938,28.6523438    c-24.5898438-18.0048828-54.7475586-28.6523438-87.609375-28.6523438C51.6513672,343.671875,9,300.8164063,9,248    c0-20.0722656,6.2109375-38.7773438,16.7421875-54.1865234C35.3681641,179.7011719,41,162.6303711,41,144.2758789    c0-25.328125-10.706543-48.1557617-27.8154297-64.2016602l65.4033203-67.7265625    C94.1621094,24.4521484,113.7451172,31.6699219,135,31.6699219c21.5219727,0,41.3310547-7.3989258,57-19.7802734    C207.6689453,24.2709961,227.4775391,31.6699219,249,31.6699219z"></path></svg>`;

  // src/logger.ts
  function log(msg, level = 2) {
    let css = "font-size: 12px; display: block;";
    if (level === 0) {
      css += " color: red;";
    } else if (level === 1) {
      css += " color: green;";
    } else {
      css += " color: orange;";
    }
    console.log(`%c${SCRIPT_NAME}: %s`, css, msg);
  }
  function dlog(message, data = "") {
    console.debug(`RSH: ${message}`, data);
  }

  // src/css.ts
  function injectCss() {
    const css = [
      "#sidepanel-wmersh > div > form > div > div > label {white-space:normal}",
      "#WMERSH-header {margin-bottom:10px;}",
      "#WMERSH-title {font-size:15px;font-weight:600;}",
      "#WMERSH-version {font-size:11px;margin-left:10px;color:#aaa;}",
      ".WMERSH-report {text-align:center;padding-top:20px;}",
      ".WMERSH-button{background-color: var(--wz-button-background-color, #09f);color: rgb(255, 255, 255);border-radius: 100px;font-size: 15px;height: 25px;align-items: center;border: 1px solid transparent;cursor: pointer;display: inline-flex;font-family: Boing, Rubik, sans-serif;font-weight: 500;justify-content: center;letter-spacing: 0.3px;width: 58px;outline: none;text-align: center;text-decoration: unset;user-select: none;white-space: nowrap;}",
      ".WMERSH-button.sm {border-radius: 100px;font-size: 13px;height: 32px;padding: 0px 12px;}",
      ".WMERSH-button.xs {border-radius: 43px;font-family: Rubik, sans-serif;font-size: 10px;height: 18px;padding: 0px 8px;}",
      ".WMERSH-button.red {background-color: red}",
      ".WMERSH-button.insertChar {margin:1px}",
      ".WMERSH-button > span {position: relative;bottom: -1px;}",
      "#WMERSH-Autofill {position:absolute;top: 14px;right: 14px;font-size:20px;}",
      "#WMERSH-panel-buttons {background: black;position: absolute;z-index: 10;border: 10px;border-color: black;border-style: solid;border-bottom-right-radius: 5px;border-bottom-left-radius: 5px;}",
      "#WMERSH-Message {position:absolute;top: 323px;left: 24px;font-size: 14px;}",
      "#WMERSH-Message.Error {color:red}",
      "#WMERSH-Message.Alert {color:orange}",
      ".rsh-button {padding: 2px; height: 10px; width: 10px;}",
      "#WMERSH-panel {width: 80px;background: white; border-top-left-radius: 5px;border-top-right-radius: 5px; position: absolute;z-index: 4;left: 340px;margin-top: 155px;-webkit-box-shadow: 0 2px 3px 0 rgb(60 64 67 / 30%), 0 6px 10px 4px rgb(60 64 67 / 15%);box-shadow: 0 2px 3px 0 rgb(60 64 67 / 30%), 0 6px 10px 4px rgb(60 64 67 / 15%);}",
      '#WMERSH-panel-header {font-family: "Boing-medium", sans-serif;font-size: 16px;line-height: 24px;font-weight: 400;height: 31px;display: -webkit-box;display: -ms-flexbox;display: flex;border-bottom: 1px solid #e8eaed;padding: 6px;text-align: center;}',
      "#WMERSH-TIO-Autofill {position:absolute;top: 6px;right: 30px;font-size:20px;transform: scale(0.65);}",
      '.fa, .fas{font-family:"FontAwesome"}',
      '.fab{font-family:"Font Awesome 5 Brands"}',
      '@font-face{font-family:"Font Awesome 5 Free";font-style:normal;font-weight:400;src:url(https://use.fontawesome.com/releases/v5.6.1/webfonts/fa-regular-400.eot);src:url(https://use.fontawesome.com/releases/v5.6.1/webfonts/fa-regular-400.eot?#iefix) format("embedded-opentype"),url(https://use.fontawesome.com/releases/v5.6.1/webfonts/fa-regular-400.woff2) format("woff2"),url(https://use.fontawesome.com/releases/v5.6.1/webfonts/fa-regular-400.woff) format("woff"),url(https://use.fontawesome.com/releases/v5.6.1/webfonts/fa-regular-400.ttf) format("truetype"),url(https://use.fontawesome.com/releases/v5.6.1/webfonts/fa-regular-400.svg#fontawesome) format("svg")}',
      ".far{font-weight:400}",
      '@font-face{font-family:"Font Awesome 5 Free";font-style:normal;font-weight:900;src:url(https://use.fontawesome.com/releases/v5.6.1/webfonts/fa-solid-900.eot);src:url(https://use.fontawesome.com/releases/v5.6.1/webfonts/fa-solid-900.eot?#iefix) format("embedded-opentype"),url(https://use.fontawesome.com/releases/v5.6.1/webfonts/fa-solid-900.woff2) format("woff2"),url(https://use.fontawesome.com/releases/v5.6.1/webfonts/fa-solid-900.woff) format("woff"),url(https://use.fontawesome.com/releases/v5.6.1/webfonts/fa-solid-900.ttf) format("truetype"),url(https://use.fontawesome.com/releases/v5.6.1/webfonts/fa-solid-900.svg#fontawesome) format("svg")}',
      '.far,.fas{font-family:"Font Awesome 5 Free"}',
      ".fas{font-weight:900}",
      ".rsh-button::shadow button::shadow  {font-family: sans-serif;}"
    ].join(" ");
    const style = document.createElement("style");
    style.type = "text/css";
    style.id = "wmersh-style";
    style.appendChild(document.createTextNode(css));
    document.head.appendChild(style);
    const links = [
      {
        href: "https://use.fontawesome.com/releases/v5.15.1/css/regular.css",
        integrity: "sha384-APzfePYec2VC7jyJSpgbPrqGZ365g49SgeW+7abV1GaUnDwW7dQIYFc+EuAuIx0c"
      },
      {
        href: "https://use.fontawesome.com/releases/v5.15.1/css/brands.css",
        integrity: "sha384-/feuykTegPRR7MxelAQ+2VUMibQwKyO6okSsWiblZAJhUSTF9QAVR0QLk6YwNURa"
      },
      {
        href: "https://use.fontawesome.com/releases/v5.15.1/css/fontawesome.css",
        integrity: "sha384-ijEtygNrZDKunAWYDdV3wAZWvTHSrGhdUfImfngIba35nhQ03lSNgfTJAKaGFjk2"
      }
    ];
    links.forEach((linkInfo) => {
      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = linkInfo.href;
      link.integrity = linkInfo.integrity;
      link.crossOrigin = "anonymous";
      document.head.appendChild(link);
    });
    log("CSS Injected", 1);
  }

  // src/i18n.ts
  function initializeI18n() {
    log(`i18n Initialized - ${I18n.currentLocale()}`, 1);
    const translations = {
      en: {
        tab_title: `${SCRIPT_NAME}`,
        report_an_issue: "Report an Issue on GitHub",
        help: "Help",
        filter_by_state: "Filter Shields By State",
        turn_instruction_preview: "Turn Instruction Preview",
        settings_1: "Enable Debug Mode"
      },
      es: {
        tab_title: `${SCRIPT_NAME}`,
        report_an_issue: "Reportar Un Problema En GitHub",
        help: "Ayuda",
        filter_by_state: "Filtros de Escudos Por Estado",
        settings_1: "Habilitar el modo de Limpiar"
      },
      fr: {
        tab_title: `${SCRIPT_NAME}`,
        report_an_issue: "Signaler un probl\xE8me sur GitHub",
        help: "Aide",
        filter_by_state: "Filtrer les cartouches de localisation par r\xE9gion",
        turn_instruction_preview: "Aper\xE7u des instructions de guidage",
        settings_1: "Activer le mode de d\xE9bogage"
      }
    };
    translations["en-GB"] = translations["en-US"] = translations["en-AU"] = translations.en;
    translations["es-419"] = translations.es;
    I18n.translations[I18n.currentLocale()].wmersh = translations.en;
    Object.keys(translations).forEach((locale) => {
      if (I18n.currentLocale() === locale) {
        addFallbacks(translations[locale], translations.en);
        I18n.translations[locale].wmersh = translations[locale];
      }
    });
    function addFallbacks(localeStrings, fallbackStrings) {
      Object.keys(fallbackStrings).forEach((key) => {
        if (!localeStrings[key]) {
          localeStrings[key] = fallbackStrings[key];
        }
      });
    }
  }

  // src/sdk.ts
  var sdk = null;
  function getHostWindow() {
    return typeof unsafeWindow !== "undefined" ? unsafeWindow : window;
  }
  async function waitForSdkInitialized(win) {
    if (win.SDK_INITIALIZED) {
      await win.SDK_INITIALIZED;
      return;
    }
    await new Promise((resolve) => {
      const interval = setInterval(() => {
        if (win.SDK_INITIALIZED) {
          clearInterval(interval);
          resolve();
        }
      }, 50);
    });
    await win.SDK_INITIALIZED;
  }
  async function initSdk() {
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
      version: SCRIPT_VERSION
    });
    log("SDK initialized", 1);
    return sdk;
  }
  function getSdk() {
    if (!sdk) {
      throw new Error("SDK not initialized");
    }
    return sdk;
  }

  // src/updateMonitor.ts
  function startScriptUpdateMonitor() {
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
      console.error("WME Road Shield Helper:", ex);
    }
  }

  // src/settings.ts
  var settings = {
    FilterByState: true,
    TurnInstructionPreview: true,
    Debug: false,
    lastVersion: 0
  };
  function getSettings() {
    return settings;
  }
  function setChecked(checkboxId, checked) {
    $(`#WMERSH-${checkboxId}`).prop("checked", checked);
  }
  function loadSettings() {
    const loadedSettings = $.parseJSON(localStorage.getItem(STORE_NAME));
    const defaultSettings = {
      FilterByState: true,
      TurnInstructionPreview: true,
      Debug: false,
      lastVersion: 0
    };
    settings = { ...defaultSettings, ...loadedSettings ?? {} };
    log("Settings Loaded", 1);
  }
  function saveSettings() {
    if (localStorage) {
      settings.lastVersion = SCRIPT_VERSION;
      localStorage.setItem(STORE_NAME, JSON.stringify(settings));
      log("Settings Saved", 1);
    }
  }
  function initializeSettings() {
    startScriptUpdateMonitor();
    loadSettings();
    let scriptChanges = "";
    const history = $.parseJSON(SCRIPT_HISTORY);
    if (history.versions[0].version.substring(0, 13) !== SCRIPT_VERSION.substring(0, 13)) {
      scriptChanges += "No Changelog Reported<br><br>";
    }
    history.versions.forEach((item) => {
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
    $("#WMERSH-Debug").change(function() {
      settings.Debug = this.checked;
      saveSettings();
    });
    $("#WMERSH-FilterByState").change(function() {
      settings.FilterByState = this.checked;
      saveSettings();
    });
    $("#WMERSH-TurnInstructionPreview").change(function() {
      settings.TurnInstructionPreview = this.checked;
      saveSettings();
    });
    log("Settings Initialized", 1);
  }

  // src/utils/states.ts
  function abbrState(input, to) {
    const states = [
      ["Arizona", "AZ"],
      ["Alabama", "AL"],
      ["Alaska", "AK"],
      ["Arkansas", "AR"],
      ["California", "CA"],
      ["Colorado", "CO"],
      ["Connecticut", "CT"],
      ["Delaware", "DE"],
      ["District of Columbia", "DC"],
      ["Florida", "FL"],
      ["Georgia", "GA"],
      ["Hawaii", "HI"],
      ["Idaho", "ID"],
      ["Illinois", "IL"],
      ["Indiana", "IN"],
      ["Iowa", "IA"],
      ["Kansas", "KS"],
      ["Kentucky", "KY"],
      ["Louisiana", "LA"],
      ["Maine", "ME"],
      ["Maryland", "MD"],
      ["Massachusetts", "MA"],
      ["Michigan", "MI"],
      ["Minnesota", "MN"],
      ["Mississippi", "MS"],
      ["Missouri", "MO"],
      ["Montana", "MT"],
      ["Nebraska", "NE"],
      ["Nevada", "NV"],
      ["New Hampshire", "NH"],
      ["New Jersey", "NJ"],
      ["New Mexico", "NM"],
      ["New York", "NY"],
      ["North Carolina", "NC"],
      ["North Dakota", "ND"],
      ["Ohio", "OH"],
      ["Oklahoma", "OK"],
      ["Oregon", "OR"],
      ["Pennsylvania", "PA"],
      ["Rhode Island", "RI"],
      ["South Carolina", "SC"],
      ["South Dakota", "SD"],
      ["Tennessee", "TN"],
      ["Texas", "TX"],
      ["Utah", "UT"],
      ["Vermont", "VT"],
      ["Virginia", "VA"],
      ["Washington", "WA"],
      ["West Virginia", "WV"],
      ["Wisconsin", "WI"],
      ["Wyoming", "WY"]
    ];
    if (to === "abbr") {
      const normalized = input.replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase());
      for (let i = 0; i < states.length; i += 1) {
        if (states[i][0] === normalized) {
          return states[i][1];
        }
      }
    } else if (to === "name") {
      const normalized = input.toUpperCase();
      for (let i = 0; i < states.length; i += 1) {
        if (states[i][1] === normalized) {
          return states[i][0];
        }
      }
    }
    return void 0;
  }

  // src/utils/wme.ts
  function getSelectedSegmentId() {
    const selection = getSdk().Editing.getSelection();
    if (!selection || selection.objectType !== "segment" || selection.ids.length === 0) {
      return null;
    }
    return selection.ids[0];
  }
  function getSelectedSegmentAddress() {
    const segmentId = getSelectedSegmentId();
    if (!segmentId) {
      return null;
    }
    return getSdk().DataModel.Segments.getAddress({ segmentId });
  }
  function getStateNameForSelection() {
    return getSelectedSegmentAddress()?.state?.name ?? null;
  }
  function getTopCountryName() {
    return getSdk().DataModel.Countries.getTopCountry()?.name ?? null;
  }
  function getTopStateName() {
    return getSdk().DataModel.States.getTopState()?.name ?? null;
  }
  function getMapCenter4326() {
    const center = getSdk().Map.getMapCenter();
    return {
      lat: Math.round(center.lat * 1e6) / 1e6,
      lon: Math.round(center.lon * 1e6) / 1e6
    };
  }

  // src/features/roadShields.ts
  function createMessage(text, level) {
    const existing = document.querySelector("#WMERSH-Message");
    if (existing) {
      existing.remove();
    }
    const htmlString = `<div id="WMERSH-Message" class="${level}"><span>${text}</span></div>`;
    document.querySelector("#WMERSH-Autofill")?.insertAdjacentHTML("afterend", htmlString);
  }
  function clickEl(selector) {
    document.querySelector(selector)?.click();
  }
  function makeShield(match, stateOverride, shieldOverride, suffixOverride) {
    let state;
    let shield;
    let suffix;
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
    } else if (state === "Texas" && (match[3] === "BUS" || match[3] === "LOOP" || match[3] === "NASA" || match[3] === "SPUR" || match[3] === "Park")) {
      suffix = `square ${match[3]}`;
    } else if (state === "Florida" && match[3] === "TOLL") {
      suffix = "Toll";
    } else if (state === "Alaska" && match[3] === "BUS") {
      suffix = `Main ${match[3]}`;
    } else if (match[3] !== void 0) {
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
    } else if (document.querySelector(
      `#wz-dialog-container > div > wz-dialog > wz-dialog-content > div:nth-child(1) > wz-menu > [title="${state} - ${shield} ${suffix}"]`
    )) {
      clickEl(
        `#wz-dialog-container > div > wz-dialog > wz-dialog-content > div:nth-child(1) > wz-menu > [title="${state} - ${shield} ${suffix}"]`
      );
    } else if (!document.querySelector(
      `#wz-dialog-container > div > wz-dialog > wz-dialog-content > div:nth-child(1) > wz-menu > [title="${state} - ${shield} ${suffix}"]`
    ) && match[3] !== void 0) {
      createMessage(`Error: ${state} - ${shield} ${suffix} Road Shield is not available.`, "Error");
      return;
    } else {
      createMessage(`Error: ${match[1]} Road Shield is not available.`, "Error");
      return;
    }
  }
  function autoFillShields() {
    const streetName = document.querySelector("#wz-dialog-container > div > wz-dialog > wz-dialog-header > div.street-name")?.textContent ?? "";
    const regex = /(?:((?:(?:[A-Z]+)(?=\-))|(?:Beltway)|(?:Loop)|(?:TOLL)|(?:Parish Rd)|(?:Park Rd)|(?:Recreational Rd)|(?:Spur))(?:-|\ )((?:[A-Z]+)|(?:\d+(?:[A-Z])?(?:-\d+)?)))?(?: (ALT-TRUCK|BUS|ALT|BYP|CONN|SPUR|TRUCK|TOLL|Toll|LOOP|NASA|Park|LINK))?(?: (N|E|S|W))?(?: • (.*))?/;
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
      "Washington"
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
          makeShield(match, state, void 0, `square ${match[1].toUpperCase()}`);
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
          makeShield(match, state, void 0, "(FM) BUS");
        } else if (state === "Texas") {
          makeShield(match, state, void 0, match[1]);
        }
        break;
      case "Recreational Rd":
        if (state === "Texas") {
          makeShield(match, state, void 0, "Recreational");
        }
        break;
      case "RM":
        if (state === "Texas" && match[3] === "BUS") {
          makeShield(match, state, void 0, "(RM) BUS");
        } else if (state === "Texas") {
          makeShield(match, state, void 0, "Ranch to Market");
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
          makeShield(match, state, void 0, "square Park");
        } else {
          createMessage(`Error: ${match[1]} Road Shield is not available for ${state}`, "Error");
        }
        break;
      case "SH":
        if (shStates.indexOf(state ?? "") >= 0) {
          makeShield(match, state ?? void 0);
        } else if (state === "Missouri") {
          makeShield(match, state, void 0, "Supplemental");
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
          makeShield(match, state ?? void 0);
        } else if (state === "North Carolina") {
          createMessage(`Error: ${state} does not use road shields for Secondary Routes`, "Error");
        } else if (state === "Tennessee") {
          makeShield(match, state, void 0, "Secondary");
        } else if (state === "Virginia") {
          if (Number(match[2]) < 600 || match[2] === "785" || match[2] === "895") {
            makeShield(match, state);
          } else {
            createMessage(
              "Warning: Please verify that this road uses <b>SR Generic Main</b> and not <b>VA - State Main.</b>",
              "Alert"
            );
          }
        } else if (match[3] === void 0) {
          clickEl(
            '#wz-dialog-container > div > wz-dialog > wz-dialog-content > div:nth-child(1) > wz-menu > [title="SR generic Main"]'
          );
        } else if (match[3] !== void 0) {
          createMessage(`Error: SR ${match[3]} Road Shield is not available`, "Error");
          return;
        } else {
          createMessage(`Error: SR ${match[3]} Road Shield is not available`, "Error");
          return;
        }
        break;
      case "TOLL":
        if (state === "Texas") {
          makeShield(match, state, void 0, "Main Toll");
        }
        break;
      case "US":
        if (match[3] === void 0) {
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
        } else if (document.querySelector(
          `#wz-dialog-container > div > wz-dialog > wz-dialog-content > div:nth-child(1) > wz-menu > [title="US-# ${match[3]}"]`
        )) {
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
      );
      const shieldDirectionInput = document.querySelector(
        "#wz-dialog-container > div > wz-dialog > wz-dialog-content > div:nth-child(3) > wz-text-input"
      );
      const applyButton = document.querySelector(
        "#wz-dialog-container > div > wz-dialog > wz-dialog-controls > wz-button.apply-button.hydrated"
      );
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
            shieldDirectionInput.value = "N\u1D0F\u0280\u1D1B\u029C";
            break;
          case "E":
            shieldDirectionInput.value = "E\u1D00\uA731\u1D1B";
            break;
          case "S":
            shieldDirectionInput.value = "S\u1D0F\u1D1C\u1D1B\u029C";
            break;
          case "W":
            shieldDirectionInput.value = "W\u1D07\uA731\u1D1B";
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
  function addAutofillButton() {
    const htmlString = '<div id="WMERSH-Autofill"><wz-button class="hydrated">Autofill</wz-button></div>';
    document.querySelector("#wz-dialog-container > div > wz-dialog > wz-dialog-content")?.insertAdjacentHTML("afterend", htmlString);
    const autofill = document.querySelector("#WMERSH-Autofill");
    if (autofill) {
      autofill.onclick = () => autoFillShields();
    }
  }
  function filterShields(state) {
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
        );
        if (!lineItem) {
          continue;
        }
        const text = lineItem.innerText;
        const searchStrings = ["Interstate Main", "US Hwy", "SR generic", "CR generic", "I-", "US-", "BIA", "FSR", "National", state];
        let length = searchStrings.length;
        lineItem.hidden = true;
        while (length--) {
          if (text.indexOf(searchStrings[length]) !== -1) {
            if (state === "Virginia" && text.includes("West Virginia") || state !== "Florida" && text.includes("FloridaI")) {
            } else {
              lineItem.hidden = false;
            }
          }
        }
      }
    }
  }
  function roadShieldObserver() {
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        for (let i = 0; i < mutation.addedNodes.length; i += 1) {
          if (document.querySelector("#wz-dialog-container > div > wz-dialog") && document.querySelector("#wz-dialog-container > div > wz-dialog > wz-dialog-content > div:nth-child(1) > wz-menu")) {
            log("Filter Ran");
            addAutofillButton();
            const settings2 = getSettings();
            if (settings2.FilterByState) {
              filterShields(getStateNameForSelection());
            }
            if (settings2.Debug) {
              document.querySelector("#wz-dialog-container > div > wz-dialog > wz-dialog-content > div:nth-child(1) > wz-label")?.insertAdjacentHTML("beforeend", ' <i id="RSH_Flask" class="fas fa-flask"></i>');
              const flask = document.querySelector("#RSH_Flask");
              if (flask) {
                flask.onclick = () => {
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

  // src/utils/dom.ts
  function setNativeValue(element, value) {
    const lastValue = element.value;
    element.value = value;
    const event = new Event("input", { bubbles: true });
    event.simulated = true;
    const tracker = element._valueTracker;
    if (tracker) {
      tracker.setValue(lastValue);
    }
    element.dispatchEvent(event);
  }
  function waitForElement(selector) {
    let count = 1;
    return new Promise((resolve) => {
      const interval = setInterval(() => {
        const element = document.querySelector(selector);
        count += 1;
        if (element instanceof Element) {
          clearInterval(interval);
          resolve(element);
        } else if (count > 30) {
          clearInterval(interval);
          console.warn(`RSH - timeout waiting for: ${selector}`);
          resolve(null);
        }
      }, 100);
    });
  }
  async function setTextForSelector(selector, val) {
    await waitForElement(selector);
    const item = document.querySelector(selector);
    if (!item) {
      console.error(`RSH: setText selector failed: ${selector}`);
    } else {
      setNativeValue(item, val);
    }
  }

  // src/ui/buttons.ts
  function addText(character, element) {
    log(`${element}`);
    let v;
    let textBefore;
    let textAfter;
    if (!element) {
      return;
    }
    if (element.shadowRoot) {
      const shadow = element.shadowRoot;
      const textInput = shadow.querySelector("#text-input");
      if (textInput) {
        element = textInput;
      }
      element = shadow.querySelector("input");
    }
    const cursorStart = element.selectionStart ?? 0;
    const cursorEnd = element.selectionEnd ?? 0;
    v = element.value;
    textBefore = v.substring(0, cursorStart);
    textAfter = v.substring(cursorEnd, v.length);
    setNativeValue(element, textBefore + character + textAfter);
    element.focus();
    element.setSelectionRange(cursorStart + character.length, cursorStart + character.length);
  }
  function buttonFunctions(displayFor) {
    log("GetLastElement Ran");
    const rootContainer = displayFor === "segmentNameButtons" ? ".address-edit" : displayFor === "TIOButtons" ? ".panel-content" : "";
    if (!rootContainer) {
      return;
    }
    let lastInputElement = null;
    const root = document.querySelector(rootContainer);
    if (!root) {
      return;
    }
    root.addEventListener("focusin", () => {
      const active = document.activeElement;
      if (!active) {
        return;
      }
      if (active.tagName === "INPUT" || active.tagName === "TEXTAREA" || active.tagName === "WZ-AUTOCOMPLETE") {
        lastInputElement = active;
      } else if (active.tagName === "WZ-TEXTAREA") {
        lastInputElement = document.querySelector("#tts")?.shadowRoot?.querySelector("textarea");
        console.log(lastInputElement);
      }
    });
    $(`.WMERSH-button.insertChar[displayFor="${displayFor}"`).click(function() {
      addText(this.value, lastInputElement);
    });
  }
  function buttonPanel(displayFor) {
    const address = getSelectedSegmentAddress();
    const countryName = address?.country?.name ?? "";
    const stateName = address?.state?.name ?? "";
    let buttonHTML = "";
    function addButton(id, value) {
      buttonHTML += `<button displayFor="${displayFor}" class="WMERSH-button insertChar" type="button" id="rsh-txt-${id}" value="${value}"><span>${value}</span></button>`;
    }
    if (countryName === "United States" || countryName === "Canada") {
      addButton("concurrent", "\u2022");
      addButton("towards", "\xBB");
    }
    if (countryName === "United States") {
      addButton("north", "N\u1D0F\u0280\u1D1B\u029C");
      addButton("south", "S\u1D0F\u1D1C\u1D1B\u029C");
      addButton("east", "E\u1D00\uA731\u1D1B");
      addButton("west", "W\u1D07\uA731\u1D1B");
      if (stateName === "North Carolina") {
        addButton("inner", "I\u0274\u0274\u1D07\u0280");
        addButton("outer", "O\u1D1C\u1D1B\u1D07\u0280");
      }
      addButton("to", "\u1D1B\u1D0F");
      addButton("via", "\u1D20\u026A\u1D00");
      addButton("jct", "\u1D0A\u1D04\u1D1B");
      addButton("parking", "\u{1F17F}");
      addButton("airport", "\u2708\uFE0E");
    } else if (countryName === "Canada") {
      if (stateName === "Quebec") {
        addButton("nord", "\u0274\u1D0F\u0280\u1D05");
        addButton("sud", "\uA731\u1D1C\u1D05");
        addButton("est", "\u1D07\uA731\u1D1B");
        addButton("ouest", "\u1D0F\u1D1C\u1D07\uA731\u1D1B");
      } else {
        addButton("north", "\u0274\u1D0F\u0280\u1D1B\u029C");
        addButton("south", "\uA731\u1D0F\u1D1C\u1D1B\u029C");
        addButton("east", "\u1D07\u1D00\uA731\u1D1B");
        addButton("west", "\u1D21\u1D07\uA731\u1D1B");
        addButton("to", "\u1D1B\u1D0F");
        addButton("via", "\u1D20\u026A\u1D00");
        addButton("jct", "\u1D0A\u1D04\u1D1B");
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

  // src/features/turnInstructions.ts
  async function doTioAutofill() {
    const state = getTopStateName() ?? "";
    const exittext = document.querySelector("#tts")?.shadowRoot?.querySelector("[id*='wz-textarea']")?.placeholder ?? "";
    const regex = /((Exits?) (\d+(?:.*)?): (.*)|(to) (.*))/;
    const regex2 = /(?:((?:(?:[A-Z]+)(?=\-))|(?:Beltway)|(?:Loop)|(?:TOLL)|(?:Parish Rd)|(?:Park Rd)|(?:Recreational Rd)|(?:Spur))(?:-|\ )((?:[A-Z]+)|(?:\d+(?:[A-Z])?(?:-\d+)?)))?(?: (ALT-TRUCK|BUS|ALT|BYP|CONN|SPUR|TRUCK|TOLL|Toll|LOOP|NASA|Park|LINK))?(?: (N|E|S|W))?(?: • (.*))?/;
    const match = exittext.match(regex);
    let m4 = 4;
    let m5 = 5;
    if (match === null) {
      return;
    }
    if (match[2]) {
      if (match[2].includes("Exit")) {
        if ($(".exit-sign-item").length === 0) {
          document.querySelector(".exit-signs > wz-button")?.click();
          dlog("click exit signs");
        }
        await waitForElement(".exit-signs-menu");
        const items = document.querySelector(".exit-signs-menu")?.querySelectorAll("wz-menu-item");
        if (document.querySelector("#turn-override-select")?.shadowRoot?.querySelector("#select-wrapper > div > div > span")?.innerText === "Exit left") {
          if (items) {
            items[1]?.click();
            dlog("click left arrow exit");
          }
        } else {
          if (items) {
            items[0]?.click();
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
    document.querySelector(".turn-instruction-item > .w-icon-x")?.click();
    dlog("remove default text item");
    document.querySelector(".panel-content > div > div > wz-menu > wz-menu-item")?.click();
    dlog("add roadshield item");
    let shck = 0;
    await waitForElement(".road-shields-menu wz-menu-item .street-name");
    const shieldcheck = document.querySelector(".road-shields-menu wz-menu-item .street-name")?.textContent ?? "";
    if (shieldcheck !== "No shields found on nearby streets - try zooming out") shck = 1;
    document.querySelector(".turn-instruction-item > .w-icon-x")?.click();
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
        document.querySelector(".panel-content > div > div > wz-menu > wz-menu-item")?.click();
        dlog("add roadshield item");
        if (strings.length > 1) {
          document.querySelector(".panel-content > div:nth-child(2) > div > wz-menu > wz-menu-item:nth-child(1)")?.click();
          dlog("add towards roadshield item");
        }
        if (shck === 1) {
          await waitForElement(`.panel-content > div > div > div > .turn-instruction-item:nth-child(${index + 1}) > wz-menu`);
          const shieldCount = document.querySelector(`.panel-content > div > div > div > .turn-instruction-item:nth-child(${index + 1}) > wz-menu`)?.childElementCount ?? 0;
          for (let sc = 0; sc < shieldCount; sc += 1) {
            const dir1 = document.querySelector(
              `.panel-content > div > div > div > .turn-instruction-item:nth-child(${index + 1}) > wz-menu  > wz-menu-item:nth-child(${sc + 1}) > span.street-name`
            )?.textContent ?? "";
            if (dir1 === match2[0]) {
              x = 1;
              await waitForElement(`.panel-content > div > div > div > .turn-instruction-item:nth-child(${index + 1})`);
              const tiItem = document.querySelector(
                `.panel-content > div > div > div > .turn-instruction-item:nth-child(${index + 1}) > wz-menu > wz-menu-item:nth-child(${sc + 1})`
              );
              tiItem?.click();
              dlog(`click TI item ${index + 1} menu item ${sc + 1}`);
              if (strings.length > 1) {
                await waitForElement(`.panel-content > div:nth-child(2) > div > div > .turn-instruction-item:nth-child(${index + 1})`);
                const towardItem = document.querySelector(
                  `.panel-content > div:nth-child(2) > div > div > .turn-instruction-item:nth-child(${index + 1}) > wz-menu > wz-menu-item:nth-child(${sc + 1})`
                );
                towardItem?.click();
                dlog(`click Toward item ${index + 1} menu item ${sc + 1}`);
              }
            }
          }
        }
        if (x === 0) {
          const removeTi = document.querySelector(
            `.panel-content > div > div > div > .turn-instruction-item:nth-child(${index + 1}) > i`
          );
          removeTi?.click();
          dlog(`remove TI item ${index + 1}`);
          if (strings.length > 1) {
            const removeToward = document.querySelector(
              `.panel-content > div:nth-child(2) > div > div > .turn-instruction-item:nth-child(${index + 1}) > i`
            );
            removeToward?.click();
            dlog(`remove Toward item ${index + 1}`);
          }
          document.querySelector(".panel-content > div > div > wz-menu > wz-menu-item:nth-child(2)")?.click();
          dlog("click to add TI text");
          setTextForSelector(`.panel-content > div > div > div > .turn-instruction-item:nth-child(${index + 1}) > input[type=text]`, itemText);
          dlog(`set TI text # ${index + 1} to ${itemText}`);
          if (strings.length > 1) {
            document.querySelector(".panel-content > div:nth-child(2) > div > wz-menu > wz-menu-item:nth-child(2)")?.click();
            dlog("click to add Towards text");
            setTextForSelector(`.panel-content > div:nth-child(2) > div > div > .turn-instruction-item:nth-child(${index + 1}) > input[type=text]`, itemText);
            dlog(`set Toward text # ${index + 1} to ${itemText}`);
          }
        }
        $("input#direction").trigger("input");
      } else {
        document.querySelectorAll(".panel-content > div > div > wz-menu > wz-menu-item")[1]?.click();
        dlog("no match2 - click to add TI text");
        setTextForSelector(`.panel-content > div > div > div > span:nth-child(${index + 1}) > input[type=text]`, trimmed);
        dlog(`set TI text # ${index + 1} to ${trimmed}`);
        if (strings.length > 1) {
          document.querySelector(".panel-content > div:nth-child(2) > div > wz-menu > wz-menu-item:nth-child(2)")?.click();
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
  function addTioAutofillButton() {
    const htmlString = '<div id="WMERSH-TIO-Autofill"><wz-button class="hydrated">Autofill</wz-button></div>';
    document.querySelector(".turn-instructions-panel > div > div.panel-header")?.insertAdjacentHTML("afterbegin", htmlString);
    document.querySelector("#WMERSH-TIO-Autofill")?.addEventListener("click", () => {
      doTioAutofill();
    });
  }
  function tioButtons() {
    $(".turn-instructions-panel").before(buttonPanel("TIOButtons"));
    buttonFunctions("TIOButtons");
  }
  function panelObserver() {
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

  // src/ui/turnSvgs.ts
  var ContinueSVG = `<svg width="210px" height="210px" viewBox="0 0 210 210" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd" stroke-linecap="round" stroke-linejoin="round"><g id="Artboard-6" transform="translate(-324.000000, -120.000000)" stroke="white"><g id="big_direction_forward" transform="translate(324.000000, 120.000000)"><line x1="105" y1="171" x2="105" y2="54" id="Stroke-2" stroke-width="18"></line><polygon id="Stroke-3" stroke-width="12" fill="white" points="105.124426 33 81 60 129 59.7628647"></polygon></g></g></g></svg>`;
  var ExitLeftSVG = `<svg width="210px" height="210px" viewBox="0 0 210 210" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><defs><linearGradient x1="50%" y1="-13.7465911%" x2="50%" y2="54.2487695%" id="linearGradient-1"><stop stop-color="#929292" stop-opacity="0" offset="0%"></stop><stop stop-color="#535353" offset="100%"></stop></linearGradient></defs><g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd" stroke-linecap="round" stroke-linejoin="round"><g id="Artboard-6" transform="translate(-89.000000, -363.000000)"><g id="big_direction_exit_left" transform="translate(89.000000, 363.000000)"><line x1="133" y1="166" x2="133" y2="31" id="Line-Copy" stroke="url(#linearGradient-1)" stroke-width="18"></line><path d="M133.5,60 L98.1375,94.9496104 C92.0048462,101.01039 86.9870769,112.982338 86.9870769,121.553766 L86.9870769,166.259221" id="Imported-Layers" stroke="white" stroke-width="18" transform="translate(110.243538, 113.129610) scale(-1, 1) translate(-110.243538, -113.129610) "></path><polygon id="Stroke-3-Copy-3" stroke="white" stroke-width="12" fill="white" transform="translate(74.250000, 48.750000) rotate(-45.000000) translate(-74.250000, -48.750000) " points="75.3106602 36.0220779 49.854816 61.4779221 98.645184 59.3566017"></polygon></g></g></g></svg>`;
  var ExitRightSVG = `<svg width="210px" height="210px" viewBox="0 0 210 210" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><defs><linearGradient x1="50%" y1="-13.7465911%" x2="50%" y2="54.2487695%" id="linearGradient-1"><stop stop-color="#929292" stop-opacity="0" offset="0%"></stop><stop stop-color="#535353" offset="100%"></stop></linearGradient></defs><g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd" stroke-linecap="round" stroke-linejoin="round"><g id="Artboard-6" transform="translate(-320.000000, -363.000000)"><g id="big_direction_exit_right" transform="translate(425.000000, 468.000000) scale(-1, 1) translate(-425.000000, -468.000000) translate(320.000000, 363.000000)"><line x1="132" y1="165" x2="132" y2="30" id="Line-Copy" stroke="url(#linearGradient-1)" stroke-width="18"></line><path d="M132,60 L96.6375,94.9496104 C90.5048462,101.01039 85.4870769,112.982338 85.4870769,121.553766 L85.4870769,166.259221" id="Imported-Layers-Copy" stroke="white" stroke-width="18" transform="translate(108.743538, 113.129610) scale(-1, 1) translate(-108.743538, -113.129610) "></path><polygon id="Stroke-3-Copy-4" stroke="white" stroke-width="12" fill="white" transform="translate(71.250000, 48.750000) rotate(-45.000000) translate(-71.250000, -48.750000) " points="72.3106602 36.0220779 46.854816 61.4779221 95.645184 59.3566017"></polygon></g></g></g></svg>`;
  var KeepLeftSVG = ExitLeftSVG;
  var KeepRightSVG = ExitRightSVG;
  var NoneSVG = "";
  var TurnLeftSVG = `<svg width="210px" height="210px" viewBox="0 0 210 210" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd" stroke-linecap="round" stroke-linejoin="round"><g id="Artboard-6" transform="translate(-544.000000, -120.000000)" stroke="white"><g id="big_direction_left-copy" transform="translate(544.000000, 120.000000)"><path d="M54,60 L86.621739,60 M154.290566,171 L154.290566,125.092254 M86.3366151,60.0721694 C123.663966,59.8744286 154.08866,88.9838184 154.290566,125.092254" id="Stroke-2" stroke-width="18"></path><polygon id="Stroke-3-Copy" stroke-width="12" fill="white" transform="translate(52.500000, 60.000000) rotate(-90.000000) translate(-52.500000, -60.000000) " points="52.624426 46.5 28.5 73.5 76.5 73.2628647"></polygon></g></g></g></svg>`;
  var TurnRightSVG = `<svg width="210px" height="210px" viewBox="0 0 210 210" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd" stroke-linecap="round" stroke-linejoin="round"><g id="Artboard-6" transform="translate(-764.000000, -120.000000)" stroke="white"><g id="big_direction_right-copy-2" transform="translate(764.000000, 120.000000)"><path d="M54,60 L86.621739,60 M154.290566,171 L154.290566,125.092254 M86.3366151,60.0721694 C123.663966,59.8744286 154.08866,88.9838184 154.290566,125.092254" id="Stroke-2-Copy" stroke-width="18" transform="translate(105.000000, 115.500000) scale(-1, 1) translate(-105.000000, -115.500000) "></path><polygon id="Stroke-3-Copy-2" stroke-width="12" fill="white" transform="translate(154.500000, 60.000000) scale(-1, 1) rotate(-90.000000) translate(-154.500000, -60.000000) " points="154.624426 46.5 130.5 73.5 178.5 73.2628647"></polygon></g></g></g></svg>`;
  var UTurnSVG = `<svg width="210px" height="210px" viewBox="0 0 210 210" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd" stroke-linecap="round" stroke-linejoin="round"><g id="Artboard-6" transform="translate(-550.000000, -363.000000)" stroke="white"><g id="big_direction_u_turn" transform="translate(550.000000, 363.000000)"><path d="M63.1093667,161.533902 L63.1093667,76.082849 M144,159 L144,78 M63.0006146,78 C62.8786912,54.9287685 80.9135963,36.1263855 103.27922,36.0006339 C125.646468,35.8748823 143.878077,54.474386 144,77.5439408" id="Imported-Layers" stroke-width="18"></path><polygon id="Stroke-3-Copy-5" stroke-width="12" fill="white" transform="translate(63.000000, 154.500000) rotate(-180.000000) translate(-63.000000, -154.500000) " points="63.124426 141 39 168 87 167.762865"></polygon></g></g></g></svg>`;

  // src/features/turnPreview.ts
  async function buildTurnPreview() {
    let node;
    let turnData;
    let segmentArray;
    const sdk2 = getSdk();
    const arrow = document.querySelector("div.arrow.turn-arrow-state-open.hover");
    if (arrow == null) {
      return;
    }
    segmentArray = arrow.dataset?.id?.split(/(f|r)/g) ?? [];
    segmentArray = segmentArray.filter((element) => element != null && element !== "");
    const segmentDetails = JSON.parse(
      `{"fromSegment": {"id":${segmentArray[0]},"direction":"${segmentArray[1]}"},"toSegment": {"id":${segmentArray[2]},"direction":"${segmentArray[3]}"}}`
    );
    const fromSeg = W.model.segments.getObjectById(segmentDetails.fromSegment.id);
    const toSeg = W.model.segments.getObjectById(segmentDetails.toSegment.id);
    function getNodeForSegmentDirection(segmentId, direction) {
      const seg = sdk2.DataModel.Segments.getById({ segmentId });
      if (!seg) {
        return null;
      }
      const nodeId = direction === "f" ? seg.toNodeId : seg.fromNodeId;
      if (!nodeId) {
        return null;
      }
      return W.model.nodes.getObjectById(nodeId);
    }
    if (segmentDetails.fromSegment.direction === "f") {
      node = getNodeForSegmentDirection(segmentDetails.fromSegment.id, "f");
    } else if (segmentDetails.fromSegment.direction === "r") {
      node = getNodeForSegmentDirection(segmentDetails.fromSegment.id, "r");
    } else {
      alert("Let The_Cre8r know about this PL. [Error 1]");
    }
    turnData = W.model.turnGraph.getTurnThroughNode(node, fromSeg, toSeg).turnData;
    if (turnData && turnData.turnGuidance) {
      console.log(turnData);
    }
    if (node.isConnectedToBigJunction() && !(turnData && turnData.turnGuidance)) {
      log("Node is Connected to Junction Box");
      let JBpaths;
      if (segmentDetails.fromSegment.direction === "f") {
        JBpaths = W.model.bigJunctions.getObjectById(W.selectionManager._getSelectedSegments()[0].attributes.toCrossroads[0]).getAllPossibleTurns();
      } else if (segmentDetails.fromSegment.direction === "r") {
        JBpaths = W.model.bigJunctions.getObjectById(W.selectionManager._getSelectedSegments()[0].attributes.fromCrossroads[0]).getAllPossibleTurns();
      } else {
        alert("Let The_Cre8r know about this PL. [Error 2]");
      }
      if (JBpaths) {
        for (let path = 0; path < JBpaths.length; path += 1) {
          if (JBpaths[path].fromVertex.segmentID === segmentDetails.fromSegment.id && JBpaths[path].toVertex.segmentID === segmentDetails.toSegment.id) {
            turnData = JBpaths[path].turnData;
          }
        }
      } else {
        if (segmentDetails.toSegment.direction === "f") {
          node = getNodeForSegmentDirection(segmentDetails.toSegment.id, "r");
        } else if (segmentDetails.toSegment.direction === "r") {
          node = getNodeForSegmentDirection(segmentDetails.toSegment.id, "f");
        } else {
          alert("Let The_Cre8r know about this PL. [Error 3]");
        }
        turnData = W.model.turnGraph.getTurnThroughNode(node, fromSeg, toSeg).turnData;
      }
    }
    let signPreviewHTML = "";
    if (turnData && turnData.turnGuidance) {
      const DefaultTurnHTML = `<div class="default-waze-selected"><div class="default-waze-selected-inner">Waze selected</div></div>`;
      let turnHTML;
      switch (turnData.instructionOpcode) {
        case null:
          turnHTML = DefaultTurnHTML;
          break;
        case "CONTINUE":
          turnHTML = ContinueSVG;
          break;
        case "EXIT_LEFT":
          turnHTML = ExitLeftSVG;
          break;
        case "EXIT_RIGHT":
          turnHTML = ExitRightSVG;
          break;
        case "KEEP_LEFT":
          turnHTML = KeepLeftSVG;
          break;
        case "KEEP_RIGHT":
          turnHTML = KeepRightSVG;
          break;
        case "NONE":
          turnHTML = NoneSVG;
          break;
        case "TURN_LEFT":
          turnHTML = TurnLeftSVG;
          break;
        case "TURN_RIGHT":
          turnHTML = TurnRightSVG;
          break;
        case "UTURN":
          turnHTML = UTurnSVG;
          break;
        default:
          turnHTML = '<div class="default-waze-selected-inner" style="color: red;">More Stuff<br> to Fix</div>';
          break;
      }
      const exitSigns = turnData.turnGuidance.exitSigns;
      if (exitSigns.length > 0) {
        for (let i = 0; i < exitSigns.length; i += 1) {
          signPreviewHTML += `<img class="inline-exit-sign" src="https://renderer-am.waze.com/renderer/v1/signs/${exitSigns[i].type}?text=${exitSigns[i].text}">`;
        }
      }
      const turnGuidance = turnData.turnGuidance;
      const viArray = turnGuidance.visualInstruction.split(" ");
      let visualInstructionHTML = "";
      for (let j = 0; j < viArray.length; j += 1) {
        if (viArray[j].includes("$RS-")) {
          const shield = turnGuidance.roadShields[viArray[j].replace("$", "")];
          visualInstructionHTML += `<span class="inline-road-shield"><img class="sign-image" src="https://renderer-am.waze.com/renderer/v1/signs/${shield.type}?text=${shield.text}">&nbsp;<span>${shield.direction ? shield.direction : ""}</span></span>`;
        } else {
          visualInstructionHTML += `<span class="inline-free-text">${viArray[j]}</span>`;
        }
      }
      let towardsHTML = "";
      if (turnGuidance.towards) {
        const towardsArray = turnGuidance.towards.split(" ");
        towardsHTML = '<div class="secondary-markup">';
        for (let j = 0; j < towardsArray.length; j += 1) {
          if (towardsArray[j].includes("$RS-")) {
            const shield = turnGuidance.roadShields[towardsArray[j].replace("$", "")];
            towardsHTML += `<span class="inline-road-shield"><img class="sign-image" src="https://renderer-am.waze.com/renderer/v1/signs/${shield.type}?text=${shield.text}">&nbsp;<span>${shield.direction ? shield.direction : ""}</span></span>`;
          } else {
            towardsHTML += `<span class="inline-free-text">${towardsArray[j]}</span>`;
          }
        }
        towardsHTML += "</div>";
      } else {
        towardsHTML = '<div class="secondary-markup markup-placeholder">Optional guidance</div>';
      }
      const htmlString = `<div class="turn-instructions-panel">
                                <div class="turn-preview-wrapper" style="margin: 6px 6px 0px 6px;">
                                  <div class="turn-preview" style="border-radius: 4px;">
                                    <div>
                                      <div class="turn-preview-inner">
                                        <span class="turn-preview-arrow-wrapper">
                                          ${turnHTML}
                                        </span>
                                        <span class="turn-preview-content">
                                          <div>XXX feet</div>
                                          <span class="exit-signs-preview">
                                            ${signPreviewHTML}
                                          </span>
                                          <div class="primary-markup">
                                             ${visualInstructionHTML}
                                          </div>
                                          ${towardsHTML}
                                        </span>
                                      </div>
                                    </div>
                                  </div>
                                </div>`;
      const adDiv = '<div id="wmersh-pc" style="margin: -8px 0px 0px 0px;background:lightgray;" data-original-title="...and users like you." ><span style="font-size:10px; margin:auto; text-align: center;display: block;">Preview Courtesy of Road Shield Helper</span></div>';
      const emptyDiv = '<div style="background:red"></div>';
      await new Promise((r) => setTimeout(r, 20));
      const ovlRoots = document.querySelectorAll('.overlay-container > [class^="root-"]');
      let toolTipDiv = null;
      let adjacentDiv = null;
      for (let i = 0; i < ovlRoots.length; i += 1) {
        if (!ovlRoots[i].querySelector("wz-card")) {
          toolTipDiv = ovlRoots[i];
          adjacentDiv = ovlRoots[i];
        }
      }
      if (toolTipDiv == null) {
        return;
      }
      if (turnGuidance.tts) {
        const turnDiv = toolTipDiv.querySelector('[class^="bordered-"]')?.parentElement;
        turnDiv?.insertAdjacentHTML("afterbegin", `<div id="wmersh-tts-link"style="text-align:center">TTS Override: ${turnGuidance.tts}</div>`);
        document.getElementById("wmersh-tts-link")?.addEventListener("click", () => {
          const center = getMapCenter4326();
          const audio = new Audio(
            `https://ttsgw.world.waze.com/TTSGateway/Text2SpeechServlet?content_type=audio%2Fmpeg&lat=${center.lat}&lon=${center.lon}&protocol=2&sessionid=12345654321&skipCache=true&type=street&validate_data=positive&version=6&lang=en-US&text=%20${turnGuidance.tts}%20`
          );
          audio.play();
        });
      }
      adjacentDiv?.insertAdjacentHTML("afterbegin", adDiv);
      adjacentDiv?.insertAdjacentHTML("afterbegin", htmlString);
      adjacentDiv?.insertAdjacentHTML("afterbegin", emptyDiv);
      $("#wmersh-pc").tooltip({ placement: "bottom", container: "body" });
      let ttsHtml;
      if (turnGuidance.tts) {
        ttsHtml = `<div id="wmersh-tts" data-original-title="TTS Override Active" style="display: inline-block; float:left;">
                               <i class="fa fa-volume-up" aria-hidden="true" style="color: orange;font-size: 18px;margin-left: 7px;vertical-align: middle;"></i>
                           </div>`;
        document.querySelector("#wmersh-tts-link")?.insertAdjacentHTML("beforebegin", ttsHtml);
        $("#wmersh-tts").tooltip();
      } else {
        ttsHtml = `<div id="wmersh-tts" data-original-title="Default TTS" style="display: inline-block; float:left;">
                               <i class="fa fa-volume-up" aria-hidden="true" style="color: #72767d;font-size: 18px;margin-left: 7px;vertical-align: middle;"></i>
                           </div>`;
      }
    }
  }
  function turnPreviewObserver() {
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        for (let i = 0; i < mutation.addedNodes.length; i += 1) {
          const node = mutation.addedNodes[i];
          if (node?.querySelector?.("wz-subhead4")) {
            buildTurnPreview();
          }
        }
      });
    });
    const overlay = document.querySelector(".overlay-container");
    if (overlay) {
      observer.observe(overlay, { childList: true });
    }
  }

  // src/features/segmentNames.ts
  function segmentNameButtons(destroy = false) {
    if (!destroy && $('#WMERSH-panel[displayFor="segmentNameButtons"]').length === 0) {
      const buttonsHTML = buttonPanel("segmentNameButtons");
      $("#segment-edit-general").prepend(buttonsHTML);
      $("#WMERSH-panel").css({ "margin-top": "0px", left: $("#sidebar").width() + 10 });
      buttonFunctions("segmentNameButtons");
    } else if (destroy && $("wz-autocomplete.street-name, wz-autocomplete.alt-street-name").length === 0) {
      $('#WMERSH-panel[displayFor="segmentNameButtons"]').remove();
    }
  }
  function editPanelObserver() {
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        for (let i = 0; i < mutation.addedNodes.length; i += 1) {
          const addedNode = mutation.addedNodes[i];
          if (addedNode?.nodeType === Node.ELEMENT_NODE) {
            if (addedNode.querySelector("wz-autocomplete.street-name, wz-autocomplete.alt-street-name")) {
              segmentNameButtons();
            }
          }
        }
        for (let i = 0; i < mutation.removedNodes.length; i += 1) {
          const removedNode = mutation.removedNodes[i];
          if (removedNode?.nodeType === Node.ELEMENT_NODE) {
            if (removedNode.querySelector("wz-autocomplete.street-name, wz-autocomplete.alt-street-name")) {
              segmentNameButtons(true);
            }
          }
        }
      });
    });
    const editPanel = document.querySelector("#edit-panel div.contents");
    if (editPanel) {
      observer.observe(editPanel, {
        childList: true,
        attributes: false,
        attributeOldValue: false,
        characterData: false,
        characterDataOldValue: false,
        subtree: true
      });
    }
  }

  // src/ui/tab.ts
  async function initTab() {
    const sdk2 = getSdk();
    const { tabLabel, tabPane } = await sdk2.Sidebar.registerScriptTab();
    const userName = sdk2.State.getUserInfo()?.userName ?? "";
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
      showDebug ? `<div class="controls-container"><input type="checkbox" id="WMERSH-Debug" value="on"><label for="WMERSH-Debug">${I18n.t(
        "wmersh.settings_1"
      )}</label></div>` : "",
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
      "</div>"
    ].join(" ");
    log("Tab Initialized", 1);
  }

  // src/index.ts
  function waitForDomReady() {
    if (document.readyState === "complete" || document.readyState === "interactive") {
      return Promise.resolve();
    }
    return new Promise((resolve) => {
      document.addEventListener("DOMContentLoaded", () => resolve(), { once: true });
    });
  }
  async function bootstrap() {
    await waitForDomReady();
    injectCss();
    try {
      const sdk2 = await initSdk();
      await sdk2.Events.once({ eventName: "wme-ready" });
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
})();
