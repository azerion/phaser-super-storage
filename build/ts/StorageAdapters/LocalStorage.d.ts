import IStorage from './IStorage';
/**
 * Storage driver for browser's localStorage
 */
export default class LocalStorage implements IStorage {
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
