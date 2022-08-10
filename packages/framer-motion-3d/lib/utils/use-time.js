import { useFrame } from "@react-three/fiber";
import { MotionConfigContext, useMotionValue } from "framer-motion";
import { useContext } from "react";
export function useTime() {
    var time = useMotionValue(0);
    var isStatic = useContext(MotionConfigContext).isStatic;
    !isStatic && useFrame(function (state) { return time.set(state.clock.getElapsedTime()); });
    return time;
}
//# sourceMappingURL=use-time.js.map