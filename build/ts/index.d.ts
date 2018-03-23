import * as StorageAdapters from './StorageAdapters';
export { default as CookieStorage } from './StorageAdapters/CookieStorage';
export { default as CordovaStorage } from './StorageAdapters/CordovaStorage';
export { default as LocalStorage } from './StorageAdapters/LocalStorage';
export { default as IframeStorage } from './StorageAdapters/IframeStorage';
export { default as IStorage } from './StorageAdapters/IStorage';
export default class PhaserSuperStorage {
    private storage;
    private scene;
    private static nameSpace;
    constructor(scene?: Phaser.Scene);
    static register(manager: any): void;
    private boot();
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
