import vcodeAbstract from "../api/abstract/vcodeAbstract";
import { VcodeTypeEnum } from "../enum/enum";
import { CollectionDataOptions } from "./collectionData";

export interface Options {
    vcodeType: keyof typeof VcodeTypeEnum | (keyof typeof VcodeTypeEnum)[];
    colaKey: string;
    isHttps?: boolean;
    mode?: modeType;
    container?: string;
    // 验证码容器自定义配置
    customTxt?: Partial<CustomConfig>;
    // 点选文字验证码自定义配置
    clickVcodeConfig?: Partial<ClickVcodeConfig>;
    imgList?: string[];
    fontList?: string[] | string;
    // 拼图验证码自定义配置
    puzzleVcodeConfig?: Partial<PuzzleVcodeConfig>;
    puZoperateTip?: string;
    puZshape?: 'puzzle' | 'rect' | 'round' | 'triangle';
    puZimgList?: string[];
    // 转图验证码自定义配置
    roateVcodeConfig?: Partial<RoateVcodeConfig>;
    roateOperateTip?: string;
    roateimgList?: string[];
    // 数据上报地址
    collectionDataOptios?: CollectionDataOptions;
    serverVerify?: boolean;
    successFn?: (res: any) => any;
    failFn?: (res: any) => any;
    renderSucFn?: (res: any) => any;
    cuid?: string;
    [key: string]: any;
}

export interface VcodeWrapperStore {
    vcodeType: (keyof typeof VcodeTypeEnum)[] | keyof typeof VcodeTypeEnum;
    mode: modeType;
    colaKey: string;
    isHttps?: boolean;
    customTxt: CustomConfig;
    collectionDataOptios: CollectionDataOptions;
    childVcode: { name: string, instance: vcodeAbstract }[];
    serverVerify: boolean;
    [key: string]: any;
}

export interface VcodeWraptplStore {
    embedBox: string;
    vcodeWrap: string;
    headerWrap: string;
    footerWrap: string;
    dialogBox: string;
    contentWrap: string;
}

type modeType = 'dialog' | 'embed';

interface CustomConfig {
    headerConfig: {
        text: string;
        url: string;
    }
    footerConfig: {
        text: string;
        url: string;
    }
}

export interface ClickVcodeConfig {
    imgList?: string[];
    fontList?: string[] | string;
}

export interface PuzzleVcodeConfig {
    // 拼图形状 圆形 三角形
    puZshape?: 'puzzle' | 'rect' | 'round' | 'triangle',
    // 提示文案
    puZoperateTip?: string,
    puZimgList?: string[]
}

export interface RoateVcodeConfig {
    roateOperateTip?: string;
    roateimgList?: string[];
}