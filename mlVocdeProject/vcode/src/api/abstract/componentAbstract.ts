import { PuzzleShapeEnum } from "../../enum/enum";
import { showFontListItem } from "../../interface/clickVcode";
import CommonAbstract from "./commonAbstarct";
import globalConfig from "../../config/config";

export default abstract class ComponentAbstract extends  CommonAbstract{
    abstract name: string;
    abstract parentComparent: any;
    abstract childComponents: any;
    constructor() {
        super();
    };
    abstract getFunctionStore(type: any): any;
}