module Fabrique {
    export module Plugins {
        export interface SuperStorageGame extends Phaser.Game {
            storage: Fabrique.Plugins.SuperStorage;
        }

        export class SuperStorage extends Phaser.Plugin {
            private storage: StorageAdapters.IStorage;

            constructor(game: SuperStorageGame, pluginManager: Phaser.PluginManager) {
                super(game, pluginManager);

                Object.defineProperty(game, 'storage', {
                    value: this
                });

                if (StorageUtils.isLocalStorageSupport()) {
                    this.setAdapter(new StorageAdapters.LocalStorage());
                } else {
                    this.setAdapter(new StorageAdapters.CookieStorage());
                }
            }

            public setAdapter(storageAdapter: StorageAdapters.IStorage): void {
                this.storage = storageAdapter;
            }

            get length(): number {
                if (this.storage === null) {
                    return 0;
                }
                
                return this.storage.length;
            }
            
            public setNamespace(namedSpace: string): void {
                if (this.storage !== null) {
                    this.storage.setNamespace(namedSpace);
                }
            }

            public key(n: number): string {
                if (this.storage === null) {
                    return '';
                }
                
                return this.storage.key(n);
            }
            public getItem(key: string): any {
                if (this.storage === null) {
                    return null;
                }

                return this.storage.getItem(key)
            }

            public setItem(key: string, value: string): void {
                if (this.storage !== null) {
                    this.storage.setItem(key, value);
                }
            }

            public removeItem(key: string): void {
                if (this.storage !== null) {
                    this.storage.removeItem(key);
                }
            }

            public clear(): void {
                if (this.storage !== null) {
                    this.storage.clear();
                }
            }
        }
    }
}
