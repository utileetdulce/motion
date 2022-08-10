import { createContext } from "react";
/**
 * @public
 */
export var MotionConfigContext = createContext({
    transformPagePoint: function (p) { return p; },
    isStatic: false,
    reducedMotion: "never",
});
//# sourceMappingURL=MotionConfigContext.js.map