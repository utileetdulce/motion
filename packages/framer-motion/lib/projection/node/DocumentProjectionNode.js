import { createProjectionNode } from "./create-projection-node";
import { addDomEvent } from "../../events/use-dom-event";
export var DocumentProjectionNode = createProjectionNode({
    attachResizeListener: function (ref, notify) { return addDomEvent(ref, "resize", notify); },
    measureScroll: function () { return ({
        x: document.documentElement.scrollLeft || document.body.scrollLeft,
        y: document.documentElement.scrollTop || document.body.scrollTop,
    }); },
    checkIsScrollRoot: function () { return true; },
});
//# sourceMappingURL=DocumentProjectionNode.js.map