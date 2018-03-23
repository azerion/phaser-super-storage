import IStorage from './IStorage';
import { Promise } from 'es6-promise';
/**
 * Storage driver for cookies
 */
export default class CookieStorage implements IStorage {
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
