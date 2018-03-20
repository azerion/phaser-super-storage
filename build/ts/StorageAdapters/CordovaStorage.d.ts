import IStorage from './IStorage';
/**
 * Storage driver for browser's localStorage
 */
export default class CordovaStorage implements IStorage {
    namespace: string;
    private keys;
    readonly forcePromises: boolean;
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
