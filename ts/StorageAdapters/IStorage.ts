module Fabrique {
    export module StorageAdapters {
        export interface IStorage
        {
            //The amount of items in the storage
            length: number;

            //The namespace for the current storge
            namespace:string;

            //Get an item from the storage
            getItem(key: string): any;

            //remove an item from the localStorage
            removeItem(key: string): any;

            //Set an item in the storage
            setItem(key: string, value:any): void;

            key(n: number): any;

            //empty the (namespaced) storage
            clear(): void;

            setNamespace(namespace: string): void;
        }
    }
}
