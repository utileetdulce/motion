import { warnOnce } from "../../utils/warn-once";
import { useScroll } from "../use-scroll";
/**
 * @deprecated useElementScroll is deprecated. Convert to useScroll({ container: ref })
 */
export function useElementScroll(ref) {
    warnOnce(false, "useElementScroll is deprecated. Convert to useScroll({ container: ref }).");
    return useScroll({ container: ref });
}
//# sourceMappingURL=use-element-scroll.js.map