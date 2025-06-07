export interface ListenEventArr {
    click: string,
    mouseover: string,
    mouseenter: string,
    mouseleave: string,
    keyup: string,
    keydown: string,
    mousedown: string,
    mousemove: string,
    mouseup: string,
    mousewheel: string,
    scroll: string,
    // 移动端触屏设备
    touch: string,
    touchstart: string,
    touchmove: string,
    touchcancel: string,
    touchend: string,
}

export interface CollectionDataStore {
    collectionCount: number;
    shouldPostNum: number;
    verifyData: VerifyData;
    postUrl: string | undefined;
    postInitUrl: string;
    postInitDataOk: boolean;
    [key: string]: any;
}

export interface GatherEventStore {
    eventClickFn: (e: MouseEvent | TouchEvent) => void;
    eventMoveFn: (e: MouseEvent | TouchEvent) => void;
    keyupFn: (e: KeyboardEvent) => void;
    keydownFn: (e: KeyboardEvent) => void;
    scrollFn: (e: MouseEvent | TouchEvent) => void;
}

export interface CollectionDataOptions {
    open: boolean;
    initpostUrl: string;
    postUrl: string;
    postUrlFn: Function;
    postInitUrlFn: Function;
    verifypostUrl: string;
    verifypostUrlFn: Function;
    apiDataPreFn: Function;
    cuid?: string;
    [key: string]: any;
}

export interface PostData {
    data: {
        code: number;
        msg: string;
        data: {
            tk: string;
            [key: string]: any;
        }
    };
    status: number;
    [key: string]: any;
}

type VerifyData = {
    rzData: {
        cl: any[],
        mv: any[],
        sc: any[],
        kb: any[],
        sb: any[],
        sd: any[],
        sm: any[],
        cr: {
            screenTop: number,
            screenLeft: number,
            clientWidth: number,
            clientHeight: number,
            screenWidth: number,
            screenHeight: number,
            availWidth: number,
            availHeight: number,
            outerWidth: number,
            outerHeight: number,
            scrollWidth: number,
            scrollHeight: number
        },
        simu: number,
        ac_c: number,
        ua: string,
        tk: string,
    }
}