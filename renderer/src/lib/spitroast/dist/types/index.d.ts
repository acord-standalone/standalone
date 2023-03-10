import { unPatchAll } from "./un-patch";
import { patchedObjects as patched } from "./shared";
type BeforeCallback = (args: any[]) => void | undefined | any[];
type InsteadCallback = (args: any[], origFunc: Function) => any;
type AfterCallback = (args: any[], ret: any) => void | undefined | any;
declare const before: (funcName: string, funcParent: any, callback: BeforeCallback, oneTime?: boolean) => () => boolean;
declare const instead: (funcName: string, funcParent: any, callback: InsteadCallback, oneTime?: boolean) => () => boolean;
declare const after: (funcName: string, funcParent: any, callback: AfterCallback, oneTime?: boolean) => () => boolean;
export { instead, before, after, unPatchAll, patched };
