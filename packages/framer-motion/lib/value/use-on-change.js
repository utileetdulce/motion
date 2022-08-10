import { useIsomorphicLayoutEffect } from "../three-entry";
import { isMotionValue } from "./utils/is-motion-value";
export function useOnChange(value, callback) {
    useIsomorphicLayoutEffect(function () {
        if (isMotionValue(value))
            return value.onChange(callback);
    }, [callback]);
}
export function useMultiOnChange(values, handler) {
    useIsomorphicLayoutEffect(function () {
        var subscriptions = values.map(function (value) { return value.onChange(handler); });
        return function () { return subscriptions.forEach(function (unsubscribe) { return unsubscribe(); }); };
    });
}
//# sourceMappingURL=use-on-change.js.map