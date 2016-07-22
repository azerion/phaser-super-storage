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

            //Set an item in the storage
            setItem(key: string, value:any): void;

            //Remove an item from the storage
            deleteItem(key: string): void;

            //empty the (namespaced) storage
            empty(): void;

            setNamespace(namespace: string): void;
        }
    }
}
