interface IStorage {
    forcePromises: boolean;
    length: number;
    namespace: string;
    getItem(key: string): any | Promise<any>;
    removeItem(key: string): any | Promise<any>;
    setItem(key: string, value: any): void | Promise<void>;
    key(n: number): any | Promise<any>;
    clear(): void | Promise<void>;
    setNamespace(namespace: string): void | Promise<void>;
}
export default IStorage;
