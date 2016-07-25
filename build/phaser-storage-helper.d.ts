import StorageCommand = Fabrique.StorageCommand;
import StorageUtils = Fabrique.StorageUtils;
import LocalStorage = Fabrique.StorageAdapters.LocalStorage;
declare module Fabrique {
    interface StorageMessage {
        command: StorageCommand;
        status: string;
        key?: string;
        value?: any;
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
        static validateMessage(data: StorageMessage): StorageMessage;
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
            constructor(spacedName?: string);
            length: number;
            key(n: number): any;
            getItem(key: string): any;
            setItem(key: string, value: any): void;
            removeItem(key: string): void;
            clear(): void;
            setNamespace(spacedName: string): void;
        }
    }
}
declare module Fabrique {
    module StorageAdapters {
        interface IStorage {
            length: number;
            namespace: string;
            getItem(key: string): any;
            removeItem(key: string): any;
            setItem(key: string, value: any): void;
            key(n: number): any;
            clear(): void;
            setNamespace(namespace: string): void;
        }
    }
}
