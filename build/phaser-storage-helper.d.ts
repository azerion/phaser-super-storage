/// <reference types="es6-promise" />
import StorageCommand = Fabrique.StorageCommand;
import StorageUtils = Fabrique.StorageUtils;
import LocalStorage = Fabrique.StorageAdapters.LocalStorage;
declare module Fabrique {
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
    }
    class StorageUtils {
        static isLocalStorageSupport(): boolean;
        static validateMessage(data: IStorageMessage): IStorageMessage;
        static nameSpaceKeyFilter(keys: string[], namespace: string): string[];
    }
}
declare module Fabrique {
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
            getItem(key: string): any | Promise<any>;
            setItem(key: string, value: any): void | Promise<void>;
            removeItem(key: string): void | Promise<void>;
            clear(): void | Promise<void>;
            setNamespace(spacedName: string): void | Promise<void>;
            private promisefy(value);
        }
    }
}
declare module Fabrique {
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
