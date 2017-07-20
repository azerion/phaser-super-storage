/// <reference types="es6-promise" />
declare module PhaserSuperStorage {
    interface IStorageMessage {
        command: StorageCommand;
        status?: string;
        key?: string;
        value?: any;
        length?: number;
    }
    enum StorageCommand {
        init = 0,
        setItem = 1,
        getItem = 2,
        removeItem = 3,
        clear = 4,
        setNamespace = 5,
        length = 6,
        key = 7,
        error = 8,
    }
    class StorageUtils {
        static isLocalStorageSupport(): boolean;
        static validateMessage(data: IStorageMessage): IStorageMessage;
        static nameSpaceKeyFilter(keys: string[], namespace: string): string[];
    }
}
declare module PhaserSuperStorage {
    module StorageAdapters {
        /**
         * Storage driver for browser's localStorage
         */
        class LocalStorage implements IStorage {
            namespace: string;
            forcePromises: boolean;
            constructor(spacedName?: string);
            readonly length: number;
            key(n: number): any | Promise<any>;
            private _key(n);
            getItem(key: string): any | Promise<any>;
            private _getItem(key);
            setItem(key: string, value: any): void | Promise<void>;
            private _setItem(key, value);
            removeItem(key: string): void | Promise<void>;
            private _removeItem(key);
            clear(): void | Promise<void>;
            private _clear();
            setNamespace(spacedName: string): void | Promise<void>;
            private _setNameSpace(spacedName);
            private promisefy(value, args);
        }
    }
}
declare module PhaserSuperStorage {
    module StorageAdapters {
        interface IStorage {
            forcePromises: boolean;
            length: number;
            namespace: string;
            getItem(key: string): any | Promise<any>;
            removeItem(key: string): any | Promise<any>;
            setItem(key: string, value: any): void | Promise<void>;
            key(n: number): any | Promise<any>;
            clear(): void | Promise<void>;
            setNamespace(namespace: string): void | Promise<void>;
        }
    }
}
import StorageCommand = PhaserSuperStorage.StorageCommand;
import StorageUtils = PhaserSuperStorage.StorageUtils;
import LocalStorage = PhaserSuperStorage.StorageAdapters.LocalStorage;
