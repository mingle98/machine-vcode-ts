declare interface Window {
    boostrapFn: any;
    isHttps: boolean;
    mlVcodeObject: {
        boostrapFn: Function;
        apiDataPreFn: Function;
        serverVerify: boolean;
        collectionDataOptios: any;
        [key: string]: any
    }
}