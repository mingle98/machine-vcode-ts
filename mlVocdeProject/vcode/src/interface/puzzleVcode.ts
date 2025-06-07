export interface PuzzleVcodeStore {
    // 拼图形状 圆形 三角形
    puZshape: 'puzzle' | 'rect' | 'round' | 'triangle';
    // 提示文案
    puZoperateTip: string;
    puZimgList: string[];
    puZshapeConfig: PuZshapeConfig;
    [key: string]: any;
}

export interface PuzzleTplStore {
    puzzleVcodeBox: string;
    puzzleVcodeCanvasArea: string;
    puzzleVcodeOperateBox: string;
    puzzleVcodeTips: string;
}

type PuZshapeConfig = {
    // 滑块边长
    puZl: number,
    // 滑块半径
    puZr: number,
    // 半圆的偏移量
    puZpy: number,
    puZLen: number,
    x: number;
    y: number;
};

export interface PuzzleVcodeFunctionStore {
    movestartfn:  (originX: number, originY: number) => any;
    moveduringfn: (moveX: number) => any;
    moveendfn: (tail: any[], slideMoveData: any[]) => any;
    resetBtn_click_fn: () => void;
}