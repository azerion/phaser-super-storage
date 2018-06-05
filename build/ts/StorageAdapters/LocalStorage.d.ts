import IStorage from './IStorage';
import { Promise } from 'es6-promise';
/**
 * Storage driver for browser's localStorage
 */
export default class LocalStorage implements IStorage {
    namespace: string;
    forcePromises: boolean;
    constructor(spacedName?: string);
    readonly length: number;
    key(n: number): any | Promise<any>;
    private _key;
    getItem(key: string): any | Promise<any>;
    private _getItem;
    setItem(key: string, value: any): void | Promise<void>;
    private _setItem;
    removeItem(key: string): void | Promise<void>;
    private _removeItem;
    clear(): void | Promise<void>;
    private _clear;
    setNamespace(spacedName: string): void | Promise<void>;
    private _setNameSpace;
    private promisefy;
}
