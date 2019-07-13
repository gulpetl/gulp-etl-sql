export declare type TransformCallback = (lineObj: object) => object | Array<object> | null;
export declare type FinishCallback = () => void;
export declare type StartCallback = () => void;
export declare type allCallbacks = {
    transformCallback?: TransformCallback;
    finishCallback?: FinishCallback;
    startCallback?: StartCallback;
};
export declare function handlelines(configObj: any, newHandlers?: allCallbacks): any;
