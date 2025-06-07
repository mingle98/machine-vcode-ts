export interface AxiosOptions {
    baseURL: string;
    timeout: number,
    [key: string]: any;
}

export interface AxiosRequest {
    [key: string]: any;
}