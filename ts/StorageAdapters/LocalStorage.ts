module Fabrique {
    export module StorageAdapters {
        /**
         * Storage driver for browser's localStorage
         */
        export class LocalStorage implements IStorage {
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
                let keys: string[] = Object.keys(localStorage);
                let spacedKeys: string[] = StorageUtils.nameSpaceKeyFilter(keys, this.namespace);

                let item: any = localStorage.getItem(spacedKeys[n]);

                if (this.forcePromises) {
                    return this.promisefy(item);
                }

                return item;
            }

            public getItem(key: string): any | Promise<any> {
                let item: any = localStorage.getItem(this.namespace + key);

                if (this.forcePromises) {
                    return this.promisefy(item);
                }

                return item;
            }

            public setItem(key: string, value: any): void | Promise<void> {
                localStorage.setItem(this.namespace + key, value);

                if (this.forcePromises) {
                    return this.promisefy(null);
                }
            }

            public removeItem(key: string): void | Promise<void> {
                localStorage.removeItem(this.namespace + key);

                if (this.forcePromises) {
                    return this.promisefy(null);
                }
            }

            public clear(): void | Promise<void> {
                let keys: string[] = Object.keys(localStorage);
                let spacedKeys: string[] = StorageUtils.nameSpaceKeyFilter(keys, this.namespace);

                for (let i: number = 0; i < spacedKeys.length; i++) {
                    localStorage.removeItem(spacedKeys[i]);
                }

                if (this.forcePromises) {
                    return this.promisefy(null);
                }
            }

            public setNamespace(spacedName: string): void | Promise<void> {
                if (spacedName) {
                    this.namespace = spacedName + ':';
                }

                if (this.forcePromises) {
                    return this.promisefy(spacedName);
                }
            }

            private promisefy(value: any): Promise<any> {
                return new Promise((resolve: (value?: any | Thenable<any>) => void, reject: (error?: any) => void) => {
                    resolve(value);
                });
            }
        }
    }
}
