import { isMotionValue } from "../utils/is-motion-value"
import { WillChange } from "./types"

export function isWillChangeMotionValue(value: any): value is WillChange {
    return Boolean(isMotionValue(value) && (value as WillChange).add)
}
