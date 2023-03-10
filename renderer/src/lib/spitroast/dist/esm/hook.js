// calls relevant patches and returns the final result
import { patchedObjects } from "./shared.js";
export default function (funcName, funcParent, funcArgs, 
// the value of `this` to apply
ctxt, 
// if true, the function is actually constructor
isConstruct) {
    const patch = patchedObjects.get(funcParent)?.[funcName];
    // This is in the event that this function is being called after all patches are removed.
    if (!patch)
        return isConstruct
            ? Reflect.construct(funcParent[funcName], funcArgs, ctxt)
            : funcParent[funcName].apply(ctxt, funcArgs);
    // Before patches
    for (const hook of patch.b.values()) {
        const maybefuncArgs = hook.call(ctxt, funcArgs);
        if (Array.isArray(maybefuncArgs))
            funcArgs = maybefuncArgs;
    }
    // Instead patches
    let insteadPatchedFunc = (...args) => isConstruct
        ? Reflect.construct(patch.o, args, ctxt)
        : patch.o.apply(ctxt, args);
    for (const callback of patch.i.values()) {
        const oldPatchFunc = insteadPatchedFunc;
        insteadPatchedFunc = (...args) => callback.call(ctxt, args, oldPatchFunc);
    }
    let workingRetVal = insteadPatchedFunc(...funcArgs);
    // After patches
    for (const hook of patch.a.values())
        workingRetVal = hook.call(ctxt, funcArgs, workingRetVal) ?? workingRetVal;
    return workingRetVal;
}
