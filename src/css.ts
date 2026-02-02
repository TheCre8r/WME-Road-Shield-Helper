import { log } from "./logger";

export function injectCss(): void {
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
    ".fa, .fas{font-family:\"FontAwesome\"}",
    ".fab{font-family:\"Font Awesome 5 Brands\"}",
    '@font-face{font-family:"Font Awesome 5 Free";font-style:normal;font-weight:400;src:url(https://use.fontawesome.com/releases/v5.6.1/webfonts/fa-regular-400.eot);src:url(https://use.fontawesome.com/releases/v5.6.1/webfonts/fa-regular-400.eot?#iefix) format("embedded-opentype"),url(https://use.fontawesome.com/releases/v5.6.1/webfonts/fa-regular-400.woff2) format("woff2"),url(https://use.fontawesome.com/releases/v5.6.1/webfonts/fa-regular-400.woff) format("woff"),url(https://use.fontawesome.com/releases/v5.6.1/webfonts/fa-regular-400.ttf) format("truetype"),url(https://use.fontawesome.com/releases/v5.6.1/webfonts/fa-regular-400.svg#fontawesome) format("svg")}',
    ".far{font-weight:400}",
    '@font-face{font-family:"Font Awesome 5 Free";font-style:normal;font-weight:900;src:url(https://use.fontawesome.com/releases/v5.6.1/webfonts/fa-solid-900.eot);src:url(https://use.fontawesome.com/releases/v5.6.1/webfonts/fa-solid-900.eot?#iefix) format("embedded-opentype"),url(https://use.fontawesome.com/releases/v5.6.1/webfonts/fa-solid-900.woff2) format("woff2"),url(https://use.fontawesome.com/releases/v5.6.1/webfonts/fa-solid-900.woff) format("woff"),url(https://use.fontawesome.com/releases/v5.6.1/webfonts/fa-solid-900.ttf) format("truetype"),url(https://use.fontawesome.com/releases/v5.6.1/webfonts/fa-solid-900.svg#fontawesome) format("svg")}',
    ".far,.fas{font-family:\"Font Awesome 5 Free\"}",
    ".fas{font-weight:900}",
    ".rsh-button::shadow button::shadow  {font-family: sans-serif;}",
  ].join(" ");

  const style = document.createElement("style");
  style.type = "text/css";
  style.id = "wmersh-style";
  style.appendChild(document.createTextNode(css));
  document.head.appendChild(style);

  const links = [
    {
      href: "https://use.fontawesome.com/releases/v5.15.1/css/regular.css",
      integrity: "sha384-APzfePYec2VC7jyJSpgbPrqGZ365g49SgeW+7abV1GaUnDwW7dQIYFc+EuAuIx0c",
    },
    {
      href: "https://use.fontawesome.com/releases/v5.15.1/css/brands.css",
      integrity: "sha384-/feuykTegPRR7MxelAQ+2VUMibQwKyO6okSsWiblZAJhUSTF9QAVR0QLk6YwNURa",
    },
    {
      href: "https://use.fontawesome.com/releases/v5.15.1/css/fontawesome.css",
      integrity: "sha384-ijEtygNrZDKunAWYDdV3wAZWvTHSrGhdUfImfngIba35nhQ03lSNgfTJAKaGFjk2",
    },
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
