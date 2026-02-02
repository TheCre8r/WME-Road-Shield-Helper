export const STORE_NAME = "WMERSH_Settings";
export const SCRIPT_ID = "wme-road-shield-helper";
export const SCRIPT_NAME = GM_info?.script?.name ?? "WME Road Shield Helper";
export const SCRIPT_VERSION = (GM_info?.script?.version ?? "0.0.0").toString();
// {"version": "2023.01.01.01","changes": ""},
export const SCRIPT_HISTORY = `{"versions": [{"version": "2026.01.15.01","changes": "Fix VI preview"},{"version": "2025.06.23.01","changes": "Added checks to avoid errors caused by empty TTS textbox"}, {"version": "2025.05.29.01","changes": "Fixed VI autofill"}, {"version": "2025.03.13.01","changes": "Fixed insert from button panel"}, {"version": "2025.01.06.01","changes": "Updated Match and Exclude List"},{"version": "2024.12.31.01","changes": "Shield Updates for IA/KS/MN/TN"},{"version": "2024.11.01.01","changes": "Fixed styling and TTS Override"},{"version": "2024.10.18.00","changes": "The turn instruction preview was playing hide-and-seek. Found it!"},{"version": "2023.08.27.01","changes": "Fix to turn instruction preview for turns to unnamed segments."},{"version": "2023.08.23.01","changes": "Compatibility update with WME V2.180."},{"version": "2023.02.11.01","changes": "Compatibility update. Added Minnesota CH shield logic."},{"version": "2021.12.30.001","changes": "jm6087 additions"},{"version": "2022.11.29.01","changes": "Code Cleanup"},{"version": "2022.08.30.01","changes": "Added button panel to segment name edit panel."},{"version": "2022.03.05.01","changes": "Fixed region-specific button logic"},{"version": "2022.01.22.01","changes": "More added support for additional new shields"},{"version": "2022.01.21.01","changes": "Added support for new shields"},{"version": "2021.08.09.01","changes": "Added the preview on the turn instruction dialog box"},{"version": "2021.07.07.03","changes": "Fixed another small ꜱ in West and East."},{"version": "2021.07.07.02","changes": "Fixed small ꜱ in West and East."},{"version": "2021.07.07.01","changes": "Added Buttons to Turn Instructions and all states should be compatible. Please be sure to report an issue on GitHub if you find one that is not working."},{"version": "2021.06.12.01","changes": "Support for Illinois CH Road Shields, a few more SH- States, a few more SR- States, and Arkansas's Shield Name Suffixes"},{"version": "2021.06.05.01","changes": "Support for Missouri Supplemental Road Shields"},{"version": "2021.06.03.02","changes": "Support for Kansas K-xxx format"},{"version": "2021.06.03.01","changes": "Added CR support for states using hexagon type shields"},{"version": "2021.06.02.01","changes": "Added SR Shield for New Hampshire"},{"version": "2021.06.01.02","changes": "Added County Shields for Wisconsin<br>Updated Changelog Format"},{"version": "2021.06.01.01","changes": "Fixed GitHub URL"},{"version": "2021.05.31.01","changes": "Added Wisconsin and other miscellaneous fixes"},{"version": "2021.05.23.01","changes": "Initial Version"}]}`;
export const GH = {
  link: "https://github.com/TheCre8r/WME-Road-Shield-Helper/",
  issue: "https://github.com/TheCre8r/WME-Road-Shield-Helper/issues/new",
  wiki: "https://github.com/TheCre8r/WME-Road-Shield-Helper/wiki",
};
export const UPDATE_ALERT = false;
export const DOWNLOAD_URL =
  "https://raw.githubusercontent.com/TheCre8r/WME-Road-Shield-Helper/master/WME-Road-Shields-Helper.user.js";

export const TESTERS = [
  "The_Cre8r",
  "jm6087",
  "s18slider",
  "locojd1",
  "SethSpeedy28",
  "nzahn1",
  "Harmonious4",
  "turnertr",
  "sketch",
  "phuz",
];

export const SVG_LOGO = `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" id="Layer_1" width="13" height="13" viewBox="0 0 384 384" overflow="visible" enable-background="new 0 0 13384" xml:space="preserve" style="vertical-align: middle;"><path xmlns="http://www.w3.org/2000/svg" fill-rule="evenodd" clip-rule="evenodd" d="M303.8720703,28.0273438l50.3662109,52.1557617    C339.7480469,97.5253906,331,119.8857422,331,144.2758789c0,20.8432617,6.4052734,40.2626953,17.3476563,56.3041992    C357.5654297,214.0683594,363,230.4316406,363,248c0,46.2294922-37.3447266,83.7363281-83.5097656,83.9990234    C247.1210938,332.0214844,217.1582031,341.6162109,192,358.0605469c-25.1884766-16.4648438-55.1953125-26.0625-87.609375-26.0625    C58.2797852,331.6728516,21,294.1904297,21,248c0-17.5673828,5.4345703-33.9316406,14.6523438-47.4199219    C46.5942383,184.5385742,53,165.1191406,53,144.2758789c0-24.390625-8.7480469-46.7504883-23.2382813-64.0927734    l50.3662109-52.1557617C96.0566406,37.9365234,114.8740234,43.6699219,135,43.6699219c21.0283203,0,40.6298828-6.2587891,57-17    c16.3701172,10.7412109,35.9716797,17,57,17C269.1259766,43.6699219,287.9433594,37.9365234,303.8720703,28.0273438z     M249,31.6699219c21.2548828,0,40.8378906-7.2177734,56.4121094-19.3222656l65.4033203,67.7265625    C353.7060547,96.1201172,343,118.9477539,343,144.2758789c0,18.3544922,5.6318359,35.425293,15.2578125,49.5375977    C368.7890625,209.2226563,375,227.9277344,375,248c0,52.8339844-42.6796875,95.6992188-95.4414063,95.9980469    c-32.8427734,0.0117188-62.9824219,10.65625-87.5585938,28.6523438    c-24.5898438-18.0048828-54.7475586-28.6523438-87.609375-28.6523438C51.6513672,343.671875,9,300.8164063,9,248    c0-20.0722656,6.2109375-38.7773438,16.7421875-54.1865234C35.3681641,179.7011719,41,162.6303711,41,144.2758789    c0-25.328125-10.706543-48.1557617-27.8154297-64.2016602l65.4033203-67.7265625    C94.1621094,24.4521484,113.7451172,31.6699219,135,31.6699219c21.5219727,0,41.3310547-7.3989258,57-19.7802734    C207.6689453,24.2709961,227.4775391,31.6699219,249,31.6699219z"></path></svg>`;
