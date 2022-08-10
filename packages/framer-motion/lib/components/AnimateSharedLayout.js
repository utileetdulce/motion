import { warning } from "hey-listen";
import * as React from "react";
import { useConstant } from "../utils/use-constant";
import { LayoutGroup } from "./LayoutGroup";
var id = 0;
export var AnimateSharedLayout = function (_a) {
    var children = _a.children;
    React.useEffect(function () {
        warning(false, "AnimateSharedLayout is deprecated: https://www.framer.com/docs/guide-upgrade/##shared-layout-animations");
    }, []);
    return (React.createElement(LayoutGroup, { id: useConstant(function () { return "asl-".concat(id++); }) }, children));
};
//# sourceMappingURL=AnimateSharedLayout.js.map