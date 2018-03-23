import IStorage from './IStorage';
import {StorageUtils} from '../Utils/Storage';
import {Promise} from 'es6-promise';

/**
 * Storage driver for browser's localStorage
 */
export default class LocalStorage implements IStorage {
    public namespace: string = '';

    public forcePromises: boolean = false;

    constructor(spacedName: string = '') {
        this.setNamespace(spacedName);
    }

    get length(): number {
        let keys: string [] = Object.keys(localStorage);

        return StorageUtils.nameSpaceKeyFilter(keys, this.namespace).length;
    }

    public key(n: number): any | Promise<any> {
        return this.forcePromises ?
            this.promisefy(this._key, <any>arguments) :
            this._key(n);
    }

    private _key(n: number): any {
        let keys: string[] = Object.keys(localStorage);
        let spacedKeys: string[] = StorageUtils.nameSpaceKeyFilter(keys, this.namespace);

        let item: any = localStorage.getItem(spacedKeys[n]);

        return item;
    }

    public getItem(key: string): any | Promise<any> {
        return this.forcePromises ?
            this.promisefy(this._getItem, <any>arguments) :
            this._getItem(key);
    }

    private _getItem(key: string): string {
        return localStorage.getItem(this.namespace + key);
    }

    public setItem(key: string, value: any): void | Promise<void> {
        return this.forcePromises ?
            this.promisefy(this._setItem, <any>arguments) :
            this._setItem(key, value);
    }

    private _setItem(key: string, value: any): void {
        return localStorage.setItem(this.namespace + key, value);
    }

    public removeItem(key: string): void | Promise<void> {
        return this.forcePromises ?
            this.promisefy(this._removeItem, <any>arguments) :
            this._removeItem(key);
    }

    private _removeItem(key: string): void {
        return localStorage.removeItem(this.namespace + key);
    }

    public clear(): void | Promise<void> {
        return this.forcePromises ?
            this.promisefy(this._clear, <any>arguments) :
            this._clear();
    }

    private _clear(): void {
        let keys: string[] = Object.keys(localStorage);
        let spacedKeys: string[] = StorageUtils.nameSpaceKeyFilter(keys, this.namespace);

        for (let i: number = 0; i < spacedKeys.length; i++) {
            localStorage.removeItem(spacedKeys[i]);
        }

        return;
    }

    public setNamespace(spacedName: string): void | Promise<void> {
        return this.forcePromises ?
            this.promisefy(this._setNameSpace, <any>arguments) :
            this._setNameSpace(spacedName);
    }

    private _setNameSpace(spacedName: string): void {
        if (spacedName) {
            this.namespace = spacedName + ':';
        }
    }

    private promisefy(value: any, args: any): Promise<any> {
        return new Promise((resolve: (value?: any | Promise<any>) => void) => {
            resolve(value.apply(this, args));
        });
    }
}
