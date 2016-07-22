declare module Fabrique {
    module StorageAdapters {
        /**
         * Storage driver for cookies
         */
        class CookieStorage implements IStorage {
            private keys;
            private reg;
            namespace: string;
            constructor(ns: string);
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
        class LocalStorage implements IStorage {
            namespace: string;
            constructor(spacedName: string);
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
            static nameSpaceKeyFilter(keys: string[], namespace: string): string[];
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
