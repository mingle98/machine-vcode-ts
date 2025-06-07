export interface SlidebarTplStore {
  puzzleVcodeBar: string;
}

export interface SlidebarParams {
  parentEle: string;
  callbacks: Callbacks;
  afterBegin: boolean;
}

export interface SlidebarStore {
  callbacks: Callbacks;
  parentEle: string;
  params: SlidebarParams | null;
  movePoData: {
    originX: number;
    originY: number;
    eventX: number;
    eventY: number;
    moveX: number;
    moveY: number;
    tail: any[];
    slideMoveData: any[];
  };
  barAttrbutes: DOMRect | null;
  [key: string]: any;
}

export interface slideFunctionStore {
  move_start_fn: (e: MouseEvent | TouchEvent) => any;
  move_during_fn: (e: MouseEvent | TouchEvent) => any;
  move_end_fn: (e: MouseEvent | TouchEvent) => any;
}

type Callbacks = {
  slideStartFn: (originX: number, originY: number) => void;
  slidemoveFn: (moveX: number) => void;
  slideEndFn: (tail: any[], moveXYData: any[]) => void;
  [key: string]: any;
};
