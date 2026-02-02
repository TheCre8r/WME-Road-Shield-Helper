import { SCRIPT_NAME } from "./constants";

export function log(msg: string, level: 0 | 1 | 2 = 2): void {
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

export function dlog(message: string, data: unknown = ""): void {
  console.debug(`RSH: ${message}`, data);
}
