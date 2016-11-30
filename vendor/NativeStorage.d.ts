interface INativeStorage {
    getItem(key: string, onSucceed: (value: string) => void, onError: (error: any) => void): void;
    setItem(key: string, value: string, onSucceed: (value: string) => void, onError: (error: any) => void): void;
    remove(key: string, onSucceed: (value: string) => void, onError: (error: any) => void): void;
}

declare enum NativeStorageErrorCode {
    NATIVE_WRITE_FAILED = 1,
    ITEM_NOT_FOUND = 2,
    NULL_REFERENCE = 3,
    UNDEFINED_TYPE = 4,
    JSON_ERROR = 5,
    WRONG_PARAMETER = 6,

}

interface INativeStorageError {
    code: NativeStorageErrorCode;
    source: string;
    exception: any;
}

declare var NativeStorage: INativeStorage;
