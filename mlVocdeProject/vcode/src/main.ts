import { ClickVcodeConfig, Options, PuzzleVcodeConfig, RoateVcodeConfig } from './interface/vcodeWrapper';
import VcodeWrapper from './api/wrapper';
window.mlVcodeObject = {
    boostrapFn: () => {},
    apiDataPreFn: () => { },
    serverVerify: false,
    collectionDataOptios: {}
};

window.boostrapFn = window.mlVcodeObject.boostrapFn = (function() {
    let mlVcodeInstance: VcodeWrapper;
    // 将二级验证码配置同步成一级配置的方法
    let vcodeCfg2wraperCfg = function (options: Options, vcodeCfg: ClickVcodeConfig | PuzzleVcodeConfig | RoateVcodeConfig) {
        if (Object.prototype.toString.call(vcodeCfg) === '[object Object]') {
            options = Object.assign(options, {...vcodeCfg});
        };
        return options;
    };
    return function(options: Options) {
        options.clickVcodeConfig && vcodeCfg2wraperCfg(options, options.clickVcodeConfig);
        options.puzzleVcodeConfig && vcodeCfg2wraperCfg(options, options.puzzleVcodeConfig);
        options.roateVcodeConfig && vcodeCfg2wraperCfg(options, options.roateVcodeConfig);
        if (!mlVcodeInstance) {
            mlVcodeInstance = new VcodeWrapper(options);
        };
        return mlVcodeInstance;
    };
})();