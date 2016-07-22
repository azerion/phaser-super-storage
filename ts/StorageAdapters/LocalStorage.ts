module Fabrique {
    export module StorageAdapters {
        import SuperStorage = Fabrique.Plugins.SuperStorage;
        /**
         * Storage driver for browser's localStorage
         */
        export class LocalStorage implements IStorage {
            public namespace: string = '';

            constructor(spacedName: string) {
                this.setNamespace(spacedName);
            }

            get length(): number {
                let keys: string [] = Object.keys(localStorage);

                return SuperStorage.nameSpaceKeyFilter(keys, this.namespace).length;
            }

            public key(n: number): any {
                let keys: string[] = Object.keys(localStorage);
                let spacedKeys: string[] =  SuperStorage.nameSpaceKeyFilter(keys, this.namespace);

                return localStorage.getItem(spacedKeys[n]);
            }

            public getItem(key: string): any {
                return localStorage.getItem(this.namespace + key);
            }

            public setItem(key: string, value: any): void {
                localStorage.setItem(this.namespace + key, value);
            }

            public deleteItem(key: string): void {
                localStorage.removeItem(this.namespace + key);
            }

            public empty(): void {
                let keys: string[] = Object.keys(localStorage);
                let spacedKeys: string[] = SuperStorage.nameSpaceKeyFilter(keys, this.namespace);

                for (let i: number = 0; i < spacedKeys.length; i++) {
                    localStorage.removeItem(spacedKeys[i]);
                }
            }

            public setNamespace(spacedName: string): void {
                if (spacedName) {
                    this.namespace = spacedName + ':'
                }
            }
        }
    }
}