import { camelToDash } from "../../dom/utils/camel-to-dash";
import { renderHTML } from "../../html/utils/render";
import { camelCaseAttributes } from "./camel-case-attrs";
export function renderSVG(element, renderState, _styleProp, projection) {
    renderHTML(element, renderState, undefined, projection);
    for (var key in renderState.attrs) {
        element.setAttribute(!camelCaseAttributes.has(key) ? camelToDash(key) : key, renderState.attrs[key]);
    }
}
//# sourceMappingURL=render.js.map