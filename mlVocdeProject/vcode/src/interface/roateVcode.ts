export interface RoateVcodeStore {
    roateOperateTip: string;
    roateimgList: string[];
    roateCurrImg: string;
    randomDeg: number[];
    roateVerifyData: {
        targetDeg: number;
        originDeg: number;
        accuracy: number;
        operateDeg: number;
    };
    [key: string]: any;
}

export interface RoateTplStore {
    roateVcodeBox: string;
    roateVcodeImgArea: string;
    roateOperateBox: string;
    roateOperateTips: string;
}

export interface RoateVcodeFunctionStore {
    movestartfn:  (originX: number, originY: number) => any;
    moveduringfn: (moveX: number) => any;
    moveendfn: (tail: any[], slideMoveData: any[]) => any;
    resetBtn_click_fn: () => void;
}