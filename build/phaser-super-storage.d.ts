declare module Fabrique {
    module StorageAdapters {
        /**
         * Storage driver for cookies
         */
        class CookieStorage implements IStorage {
            private keys;
            private reg;
            namespace: string;
            constructor(spacedName?: string);
            length: number;
            key(n: number): any;
            getItem(key: string): string;
            setItem(key: string, value: any): void;
            deleteItem(key: string): void;
            empty(): void;
            setNamespace(namespace: string): void;
            private getNameSpaceMatches();
            private getCookiesForNameSpace();
        }
    }
}
declare module Fabrique {
    module StorageAdapters {
        interface IStorage {
            length: number;
            namespace: string;
            getItem(key: string): any;
            setItem(key: string, value: any): void;
            deleteItem(key: string): void;
            empty(): void;
            setNamespace(namespace: string): void;
        }
    }
}
declare module Fabrique {
    module StorageAdapters {
        /**
         * Storage driver for browser's localStorage
         */
        class IframeStorage implements IStorage {
            namespace: string;
            constructor(spacedName?: string);
            length: number;
            key(n: number): any;
            getItem(key: string): any;
            setItem(key: string, value: any): void;
            deleteItem(key: string): void;
            empty(): void;
            setNamespace(spacedName: string): void;
        }
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
            deleteItem(key: string): void;
            empty(): void;
            setNamespace(spacedName: string): void;
        }
    }
}
declare module Fabrique {
    module Plugins {
        interface SuperStorageGame extends Phaser.Game {
            storage: Fabrique.Plugins.SuperStorage;
        }
        class SuperStorage extends Phaser.Plugin {
            private storage;
            constructor(game: SuperStorageGame, pluginManager: Phaser.PluginManager);
            setAdapter(storageAdapter: StorageAdapters.IStorage): void;
            length: number;
            setNamespace(namespace: string): void;
            key(n: number): string;
            getItem(): any;
            setItem(): void;
            removeItem(): void;
            clear(): void;
        }
    }
}
declare module Fabrique {
    interface StorageMessage {
        command: StorageCommand;
        status: string;
        key?: string;
        value?: string;
        number?: number;
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
