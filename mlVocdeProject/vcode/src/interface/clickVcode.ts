export interface ClickVcodeTplStore {
  clickVcodeBox: string;
  resetBtn: string;
  canvasArea: string;
  tipPointer: string;
  statusBar: string;
}

export interface ClickVcodeStore {
  imgList: string[];
  fontList: string;
  fontNum: number;
  verifyFontNum: number;
  showFontList: showFontListItem[];
  verifyFontList: showFontListItem[];
  pointerList: pointerListItem[];
  accuracy: number;
  verifyStatus: 'wait' | 'success' | 'fail' | 'action';
  [key: string]: any;
}

export interface showFontListItem {
  font: string;
  x: number;
  y: number;
  fontSize: number;
  fontWeight: string;
  fontStyle: string;
  fontFamily: string;
}

export interface ClickVcodeFunctionStore {
  resetBtn_click_fn: () => void;
  clickVcode_canvas_click_fn: (e: MouseEvent | TouchEvent) => any;
}

type pointerListItem = {
  x: number;
  y: number;
  event: MouseEvent | TouchEvent;
  id: string;
};
