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
