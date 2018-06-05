export declare class StorageUtils {
    static isLocalStorageSupport(): boolean;
    static validateMessage(data: IStorageMessage): IStorageMessage;
    static nameSpaceKeyFilter(keys: string[], namespace: string): string[];
}
export interface IStorageMessage {
    command: StorageCommand;
    status?: string;
    key?: string;
    value?: any;
    length?: number;
}
export declare enum StorageCommand {
    init = 0,
    setItem = 1,
    getItem = 2,
    removeItem = 3,
    clear = 4,
    setNamespace = 5,
    length = 6,
    key = 7,
    error = 8
}
