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
                try {
                    if (typeof localStorage === 'object') {
                        localStorage.setItem('testingLocalStorage', 'foo');
                        localStorage.removeItem('testingLocalStorage');
                        this.storage = new StorageAdapters.LocalStorage('Quartz');
                    } else {
                        this.storage = new StorageAdapters.CookieStorage('Quartz');
                    }
                } catch (e) {
                    this.storage = new StorageAdapters.CookieStorage('Quartz');
                }
                
            }

            public static nameSpaceKeyFilter(keys: string[], namespace: string): string[]
            {
                return keys.filter((keyName: string) => {
                    return (keyName.substring(0, namespace.length) === namespace);
                });
            }

            public setAdapter(storageAdapter: StorageAdapters.IStorage): void {
                this.storage = storageAdapter;
            }

            get length(): number {
                return 0;
            }
            
            public setNamespace(namespace: string): void {
                
            }

            public key(n: number): string {
                return '';
            }
            public getItem(): any {

            }

            public setItem(): void {

            }

            public removeItem(): void {

            }

            public clear(): void {

            }
        }
    }
}
