module PhaserSuperStorage {
    export module StorageAdapters {
        export interface IStorage {
            forcePromises: boolean;

            //The amount of items in the storage
            length: number;

            //The namespace for the current storge
            namespace: string;

            //Get an item from the storage
            getItem(key: string): any | Promise<any>;

            //remove an item from the localStorage
            removeItem(key: string): any | Promise<any>;

            //Set an item in the storage
            setItem(key: string, value: any): void | Promise<void>;

            key(n: number): any | Promise<any>;

            //empty the (namespaced) storage
            clear(): void | Promise<void>;

            setNamespace(namespace: string): void | Promise<void>;
        }
    }
}
