import IStorage from './IStorage';
/**
 * Storage driver for browser's localStorage
 */
export default class IframeStorage implements IStorage {
    namespace: string;
    expectedOrigin: string;
    private storageLength;
    private enabled;
    readonly forcePromises: boolean;
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
