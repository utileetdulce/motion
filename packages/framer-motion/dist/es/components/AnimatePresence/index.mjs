import { __read } from 'tslib';
import * as React from 'react';
import { useContext, useRef, cloneElement, Children, isValidElement } from 'react';
import { env } from '../../utils/process.mjs';
import { useForceUpdate } from '../../utils/use-force-update.mjs';
import { useIsMounted } from '../../utils/use-is-mounted.mjs';
import { PresenceChild } from './PresenceChild.mjs';
import { LayoutGroupContext } from '../../context/LayoutGroupContext.mjs';
import { useIsomorphicLayoutEffect } from '../../utils/use-isomorphic-effect.mjs';
import { useUnmountEffect } from '../../utils/use-unmount-effect.mjs';

var getChildKey = function (child) { return child.key || ""; };
function updateChildLookup(children, allChildren) {
    children.forEach(function (child) {
        var key = getChildKey(child);
        allChildren.set(key, child);
    });
}
function onlyElements(children) {
    var filtered = [];
    // We use forEach here instead of map as map mutates the component key by preprending `.$`
    Children.forEach(children, function (child) {
        if (isValidElement(child))
            filtered.push(child);
    });
    return filtered;
}
function splitChildrenByKeys(keys, children, mapFunction) {
    var chunks = [];
    var insertionStartIndex = 0;
    keys.forEach(function (key) {
        var insertionEndIndex = children.findIndex(function (child) { return getChildKey(child) === key; });
        var chunk = children.slice(insertionStartIndex, insertionEndIndex);
        if (mapFunction)
            chunk = chunk.map(mapFunction);
        chunks.push(chunk);
        insertionStartIndex = insertionEndIndex + 1;
    });
    var chunk = children.slice(insertionStartIndex, children.length);
    if (mapFunction)
        chunk = chunk.map(mapFunction);
    chunks.push(chunk);
    return chunks;
}
/**
 * `AnimatePresence` enables the animation of components that have been removed from the tree.
 *
 * When adding/removing more than a single child, every child **must** be given a unique `key` prop.
 *
 * Any `motion` components that have an `exit` property defined will animate out when removed from
 * the tree.
 *
 * ```jsx
 * import { motion, AnimatePresence } from 'framer-motion'
 *
 * export const Items = ({ items }) => (
 *   <AnimatePresence>
 *     {items.map(item => (
 *       <motion.div
 *         key={item.id}
 *         initial={{ opacity: 0 }}
 *         animate={{ opacity: 1 }}
 *         exit={{ opacity: 0 }}
 *       />
 *     ))}
 *   </AnimatePresence>
 * )
 * ```
 *
 * You can sequence exit animations throughout a tree using variants.
 *
 * If a child contains multiple `motion` components with `exit` props, it will only unmount the child
 * once all `motion` components have finished animating out. Likewise, any components using
 * `usePresence` all need to call `safeToRemove`.
 *
 * @public
 */
var AnimatePresence = function (_a) {
    var children = _a.children, custom = _a.custom, _b = _a.initial, initial = _b === void 0 ? true : _b, onExitComplete = _a.onExitComplete, exitBeforeEnter = _a.exitBeforeEnter, _c = _a.presenceAffectsLayout, presenceAffectsLayout = _c === void 0 ? true : _c;
    // We want to force a re-render once all exiting animations have finished. We
    // either use a local forceRender function, or one from a parent context if it exists.
    var _d = __read(useForceUpdate(), 1), forceRender = _d[0];
    var forceRenderLayoutGroup = useContext(LayoutGroupContext).forceRender;
    if (forceRenderLayoutGroup)
        forceRender = forceRenderLayoutGroup;
    var isMounted = useIsMounted();
    // Filter out any children that aren't ReactElements. We can only track ReactElements with a props.key
    var filteredChildren = onlyElements(children);
    var childrenToRender = filteredChildren;
    var exitingChildren = useRef(new Map()).current;
    // Keep a living record of the children we're actually rendering so we
    // can diff to figure out which are entering and exiting
    var presentChildren = useRef(childrenToRender);
    // A lookup table to quickly reference components by key
    var allChildren = useRef(new Map()).current;
    // If this is the initial component render, just deal with logic surrounding whether
    // we play onMount animations or not.
    var isInitialRender = useRef(true);
    useIsomorphicLayoutEffect(function () {
        isInitialRender.current = false;
        updateChildLookup(filteredChildren, allChildren);
        presentChildren.current = childrenToRender;
    });
    useUnmountEffect(function () {
        isInitialRender.current = true;
        allChildren.clear();
        exitingChildren.clear();
    });
    if (isInitialRender.current) {
        return (React.createElement(React.Fragment, null, childrenToRender.map(function (child) { return (React.createElement(PresenceChild, { key: getChildKey(child), isPresent: true, initial: initial ? undefined : false, presenceAffectsLayout: presenceAffectsLayout }, child)); })));
    }
    // If this is a subsequent render, deal with entering and exiting children
    // Diff the keys of the currently-present and target children to update our
    // preserving list.
    var presentKeys = presentChildren.current.map(getChildKey);
    var targetKeys = filteredChildren.map(getChildKey);
    var preservingKeys = [];
    // Diff the present children with our target children and mark those that are preserving
    var numPresent = presentKeys.length;
    for (var i = 0; i < numPresent; i++) {
        var key = presentKeys[i];
        if (targetKeys.indexOf(key) === -1) {
            exitingChildren.set(key, undefined);
        }
        else {
            preservingKeys.push(key);
            exitingChildren.delete(key);
        }
    }
    // split the presentChildren based on the key of the component you are preserving
    var presentChunks = splitChildrenByKeys(preservingKeys, presentChildren.current, function (_child) {
        var key = getChildKey(_child);
        var child = allChildren.get(key);
        // If the component was exiting, reuse the previous component to preserve state
        var extingChild = exitingChildren.get(key);
        if (extingChild)
            return extingChild;
        var onExit = function () {
            allChildren.delete(key);
            exitingChildren.delete(key);
            // Remove this child from the present children
            var removeIndex = presentChildren.current.findIndex(function (presentChild) { return presentChild.key === key; });
            presentChildren.current.splice(removeIndex, 1);
            // Defer re-rendering until all exiting children have indeed left
            if (!exitingChildren.size) {
                presentChildren.current = filteredChildren;
                if (isMounted.current === false)
                    return;
                forceRender();
                onExitComplete && onExitComplete();
            }
        };
        extingChild = (React.createElement(PresenceChild, { key: key, isPresent: false, onExitComplete: onExit, custom: custom, presenceAffectsLayout: presenceAffectsLayout }, child));
        exitingChildren.set(key, extingChild);
        return extingChild;
    });
    var targetChunks = splitChildrenByKeys(preservingKeys, filteredChildren, function (child) { return (
    // Add `MotionContext` even to children that don't need it to ensure we're rendering
    // the same tree between renders
    React.createElement(PresenceChild, { key: getChildKey(child), isPresent: true, presenceAffectsLayout: presenceAffectsLayout }, child)); });
    // Combine the chunk separated by the preservingKeys.
    //
    // If a change occurs in the rendering array,
    // insert the chunk where the change occurred in the previous location.
    //
    // presentChildren  ->  children
    //     [A]                 [1]
    //     [D]                 [A]
    //     [E]                 [2]
    //     [F]                 [B]
    //     [B]                 [3]
    //     [C]                 [C]
    //
    //  init ->  animate -> Exit Complete
    //
    //             [1]        [1]     <--- targetChunk - 1
    //   [A]       [A]        [A]     <--- preservingKey
    //   [D]       [D]
    //   [E]       [E]                <--- presentChunk - 1
    //   [F]       [F]
    //             [2]        [2]     <--- targetChunk - 2
    //   [B]       [B]        [B]     <--- preservingKey
    //             [3]        [3]     <--- targetChunk - 3
    //   [C]       [C]        [C]     <--- preservingKey
    childrenToRender = [];
    Array.from({ length: preservingKeys.length + 1 }).forEach(function (_, i) {
        var key = preservingKeys[i];
        var child = allChildren.get(key);
        childrenToRender = childrenToRender.concat(presentChunks[i]);
        // If we currently have exiting children, and we're deferring rendering incoming children
        // until after all current children have exiting, empty the childrenToRender array
        if (!(exitBeforeEnter && exitingChildren.size)) {
            childrenToRender = childrenToRender.concat(targetChunks[i]);
        }
        if (child) {
            childrenToRender.push(React.createElement(PresenceChild, { key: key, isPresent: true, presenceAffectsLayout: presenceAffectsLayout }, child));
        }
    });
    if (env !== "production" &&
        exitBeforeEnter &&
        childrenToRender.length > 1) {
        console.warn("You're attempting to animate multiple children within AnimatePresence, but its exitBeforeEnter prop is set to true. This will lead to odd visual behaviour.");
    }
    return (React.createElement(React.Fragment, null, exitingChildren.size
        ? childrenToRender
        : childrenToRender.map(function (child) { return cloneElement(child); })));
};

export { AnimatePresence };
