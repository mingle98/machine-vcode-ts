import { PuzzleShapeEnum } from "../../enum/enum";
import { showFontListItem } from "../../interface/clickVcode";
import CommonAbstract from "./commonAbstarct";
import globalConfig from "../../config/config";

export default abstract class VcodeAbstract extends CommonAbstract {
    abstract name: string;
    abstract parentComparent: any;
    abstract canvasCtx: CanvasRenderingContext2D | CanvasRenderingContext2D[];
    abstract canvasAttrbutes: DOMRect | DOMRect[];
    abstract childComponents: any;
    constructor() {
        super();
    };
    abstract resetVcodeFn(): void;
    abstract getFunctionStore(type: any): any;
    getRandomNum(startNum: number, endNum: number): number {
        if (endNum <= startNum) return startNum;
        return Math.floor(Math.random() * (endNum - startNum) + startNum);
    }; 
    getRandomCharacter(fontList: string | string[], showFontList: showFontListItem[]): any {
        let character = fontList[this.getRandomNum(0, fontList.length - 1)];
        let hadFont = showFontList.some(item => item.font === character);
        if (hadFont) {
            return this.getRandomCharacter(fontList, showFontList);
        };
        return character;
    };
    randomColor (min: number, max: number) {
        let r = this.getRandomNum(min, max)
        let g = this.getRandomNum(min, max)
        let b = this.getRandomNum(min, max)
        return 'rgb(' + r + ',' + g + ',' + b + ')'
    };
    // 将当前验证码方式的canvas信息存储到当前验证码实例中
    getCanvasInfoToVCode(canvsEle: HTMLCanvasElement, vcodeInstance: any) {
        if (!Array.isArray(vcodeInstance.canvasCtx) && !Array.isArray(vcodeInstance.canvasAttrbutes)) {
            vcodeInstance.canvasCtx = canvsEle.getContext('2d')!;
            vcodeInstance.canvasAttrbutes = canvsEle?.getBoundingClientRect();
            canvsEle.width = vcodeInstance.canvasAttrbutes.width;
            canvsEle.height = vcodeInstance.canvasAttrbutes.height;
            // console.log('getCanvasInfoToVCode-one:', vcodeInstance.canvasAttrbutes, vcodeInstance.canvasCtx);
        } else if (Array.isArray(vcodeInstance.canvasCtx) && Array.isArray(vcodeInstance.canvasAttrbutes)) {
            vcodeInstance.canvasCtx.push(canvsEle.getContext('2d')!);
            vcodeInstance.canvasAttrbutes.push(canvsEle?.getBoundingClientRect());
            canvsEle.width = vcodeInstance.canvasAttrbutes[vcodeInstance.canvasAttrbutes.length - 1].width;
            canvsEle.height = vcodeInstance.canvasAttrbutes[vcodeInstance.canvasAttrbutes.length - 1].height;
            // console.log('getCanvasInfoToVCode-array:', vcodeInstance.canvasAttrbutes, vcodeInstance.canvasCtx);
        }
    };
    initImg(successFn: Function, failFn: Function, imgList: string[]) {
        this.parentComparent.setloading(true, 'loading');
        let getIndex = this.getRandomNum(0, imgList.length);
        let img = document.createElement('img');
        img.crossOrigin = 'Anonymous';
        img.src = imgList[getIndex];
        // console.log('getImg:', getIndex, this.clickVcodeStore.imgList[getIndex]);
        img.onload = () => {
            this.parentComparent.setloading(false, 'loading');
            successFn && successFn(img);
        };
        img.onerror = () => {
            // this.parentComparent.setloading(false, 'loading');
            failFn && failFn();
        };
    };
    drawPath(ctx: CanvasRenderingContext2D, x: number, y: number, operation: 'fill' | 'clip', type: keyof typeof PuzzleShapeEnum, randomIndx = 0) {
        let PI = Math.PI;// 180deg
        function drawPuzPathFn() {
            const l = globalConfig.puzzleVcodeConfig.puZl; // 滑块边长
            const r = globalConfig.puzzleVcodeConfig.puZr; // 滑块半径
            const py = globalConfig.puzzleVcodeConfig.puZpy;// 偏移值
            ctx.beginPath();
            globalConfig.randomShaps[randomIndx].fn(ctx, x, y, l);
            // ctx.lineWidth = 2;
            ctx.fillStyle = 'rgba(255, 255, 255, 1)';
            ctx.strokeStyle = 'rgba(255, 255, 255, 1)';
            ctx.stroke();
            ctx.globalCompositeOperation = 'destination-over';
            // ctx.globalCompositeOperation = "xor"
            operation === 'fill'? ctx.fill() : ctx.clip();
        }
        switch(type) {
            case 'puzzle':
                drawPuzPathFn();
                break;
            default:
                break;
        }
    };
    // 抖动校验方法
    shakeVerifyFn(datalist: any[], shapeEle?: HTMLCanvasElement, targetX?: number, accuracy: number = 10) {
        // console.log('shakeVerifyFn:', datalist, shapeEle, targetX);
        function sum (x: number, y: number) {
            return x + y
        };
        function square (x: number) {
            return x * x
          }
        // 拖动时y轴的移动距离
        const average = datalist.reduce(sum) / datalist.length;
        const deviations = datalist.map(x => x - average);
        const stddev = Math.sqrt(deviations.map(square).reduce(sum) / datalist.length);
        if (shapeEle && targetX) {
            const left = parseInt(shapeEle.style.left);
            return {
                spliced: Math.abs(left - targetX) < accuracy,
                verified: stddev !== 0, // 简单验证拖动轨迹，为零时表示Y轴上下没有波动，可能非人为操作
            };
        } else {
            return {
                verified: stddev !== 0, // 简单验证拖动轨迹，为零时表示Y轴上下没有波动，可能非人为操作
            };
        }
    }
}