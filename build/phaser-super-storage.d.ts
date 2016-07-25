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
            removeItem(key: string): void;
            clear(): void;
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
            getItem(key: string): any | Promise<any>;
            removeItem(key: string): any | Promise<any>;
            setItem(key: string, value: any): void | Promise<void>;
            key(n: number): any | Promise<any>;
            clear(): void | Promise<void>;
            setNamespace(namespace: string): void | Promise<void>;
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
            expectedOrigin: string;
            private storageLength;
            constructor(spacedName?: string, expectedOrigin?: string);
            length: number;
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
    module Plugins {
        interface SuperStorageGame extends Phaser.Game {
            storage: Fabrique.Plugins.SuperStorage;
        }
        class SuperStorage extends Phaser.Plugin {
            private storage;
            constructor(game: SuperStorageGame, pluginManager: Phaser.PluginManager);
            setAdapter(storageAdapter: StorageAdapters.IStorage): void;
            length: number;
            setNamespace(namedSpace: string): void;
            key(n: number): string;
            getItem(key: string): any;
            setItem(key: string, value: string): void;
            removeItem(key: string): void;
            clear(): void;
        }
    }
}
declare module Fabrique {
    interface StorageMessage {
        command: StorageCommand;
        status?: string;
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
