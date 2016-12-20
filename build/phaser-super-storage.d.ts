/// <reference types="es6-promise" />
declare module PhaserSuperStorage {
    module StorageAdapters {
        /**
         * Storage driver for cookies
         */
        class CookieStorage implements IStorage {
            private reg;
            namespace: string;
            forcePromises: boolean;
            constructor(spacedName?: string);
            readonly length: number;
            key(n: number): any | Promise<any>;
            getItem(key: string): string | Promise<string>;
            setItem(key: string, value: any): void | Promise<void>;
            removeItem(key: string): void | Promise<void>;
            clear(): void | Promise<void>;
            setNamespace(namespace: string): void | Promise<void>;
            private getNameSpaceMatches();
            private getCookiesForNameSpace();
            private promisefy(value);
        }
    }
}
declare module PhaserSuperStorage {
    module StorageAdapters {
        /**
         * Storage driver for browser's localStorage
         */
        class CordovaStorage implements IStorage {
            namespace: string;
            private keys;
            forcePromises: boolean;
            constructor();
            readonly length: number;
            key(n: number): Promise<any>;
            getItem(key: string): Promise<string>;
            setItem(key: string, value: any): Promise<void>;
            removeItem(key: string): Promise<void>;
            clear(): Promise<void>;
            setNamespace(spacedName?: string): Promise<void>;
            private promisefy(value);
            private load();
            private save();
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
declare module PhaserSuperStorage {
    module StorageAdapters {
        /**
         * Storage driver for browser's localStorage
         */
        class IframeStorage implements IStorage {
            namespace: string;
            expectedOrigin: string;
            private storageLength;
            private enabled;
            forcePromises: boolean;
            constructor(spacedName?: string, expectedOrigin?: string);
            readonly length: number;
            init(): Promise<any>;
            key(n: number): Promise<any>;
            getItem(key: string): Promise<any>;
            setItem(key: string, value: any): Promise<void>;
            removeItem(key: string): Promise<void>;
            clear(): Promise<void>;
            setNamespace(spacedName: string): Promise<void>;
            private sendMessage(message);
        }
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
            getItem(key: string): any | Promise<any>;
            setItem(key: string, value: any): void | Promise<void>;
            removeItem(key: string): void | Promise<void>;
            clear(): void | Promise<void>;
            setNamespace(spacedName: string): void | Promise<void>;
            private promisefy(value);
        }
    }
}
declare module 'phaser-super-storage' {
    export = PhaserSuperStorage;
}
declare module PhaserSuperStorage {
    interface ISuperStorageGame extends Phaser.Game {
        storage: PhaserSuperStorage.StoragePlugin;
    }
    class StoragePlugin {
        private storage;
        private static instance;
        constructor(game?: Phaser.Game);
        setAdapter(storageAdapter: StorageAdapters.IStorage): void;
        forcePromises: boolean;
        readonly length: number;
        setNamespace(namedSpace: string): void | Promise<void>;
        key(n: number): string | Promise<string>;
        getItem(key: string): any | Promise<any>;
        setItem(key: string, value: string): void | Promise<void>;
        removeItem(key: string): void | Promise<void>;
        clear(): void | Promise<void>;
    }
}
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
