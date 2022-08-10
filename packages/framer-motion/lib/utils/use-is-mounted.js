import { useRef } from "react";
import { useIsomorphicLayoutEffect } from "./use-isomorphic-effect";
export function useIsMounted() {
    var isMounted = useRef(false);
    useIsomorphicLayoutEffect(function () {
        isMounted.current = true;
        return function () {
            isMounted.current = false;
        };
    }, []);
    return isMounted;
}
//# sourceMappingURL=use-is-mounted.js.map