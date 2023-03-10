import * as spitRoast from "../../lib/spitroast/dist/esm";

const importRegex = /@import url\(([^)]+)\);?/g;
const urlRegex = /url\(([^)]+)\)?/g;
const propRegex = /var\(--acord--([^)]+)\)/g;
function propReplacer(css, props = {}) {
  css = css.replace(propRegex, (match, group1) => {
    let splitted = group1.split(",");
    let keySplitted = splitted.shift().trim().split("--");
    let key = keySplitted[0];

    let returnValue = "";
    let defaultValue = splitted.join(",").trim();
    let propVal = props[_.camelCase(key)];
    if (keySplitted.length > 1) {
      returnValue = propVal ? keySplitted[1] : keySplitted[2];
    } else {
      returnValue = propVal ?? (defaultValue || match);
    }

    return returnValue;
  });
  css = css.replace(importRegex, (match, group1) => {
    let splitted = group1.replaceAll('"', "").split("#");
    if (splitted.length === 1) return match;
    let key = splitted.pop();
    return props[_.camelCase(key)] ? match : "";
  });
  css = css.replace(urlRegex, (match, group1) => {
    let splitted = group1.replaceAll('"', "").split("#");
    if (splitted.length === 1 && !group1.startsWith("#")) return match;
    let key = splitted.pop();
    let val = props[_.camelCase(key)];
    return val ? `url("${val}")` : match;
  });
  return css;
}

export default {
  __cache__: {
    patched: spitRoast.patched,
  },
  before: spitRoast.before,
  after: spitRoast.after,
  instead: spitRoast.instead,
  unPatchAll: spitRoast.unPatchAll,
  injectCSS(css, customProps = {}) {
    const style = document.createElement("style");
    style.className = `acord--injected-css`;
    style.textContent = propReplacer(css, customProps);
    document.head.appendChild(style);

    return (...args) => {
      if (typeof args[0] === "string") {
        style.textContent = propReplacer(args[0], args[1]);
        css = args[0];
      } else if (typeof args[0] === "object") {
        style.textContent = propReplacer(css, args[0]);
      } else {
        style?.remove();
        css = null;
      }
    };
  },
  unPatchAllCSS() {
    document.querySelectorAll(".acord--injected-css").forEach(element => {
      element.remove();
    })
  }
}