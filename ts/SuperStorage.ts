declare module 'phaser-super-storage' {
    export = PhaserSuperStorage;
}

module PhaserSuperStorage {
    export interface ISuperStorageGame extends Phaser.Game {
        storage: PhaserSuperStorage.StoragePlugin;
    }

    export class StoragePlugin {
        private storage: StorageAdapters.IStorage;

        private static instance: StoragePlugin = null;

        constructor(game?: Phaser.Game) {
            if (undefined !== game) {
                Object.defineProperty(game, 'storage', {
                    value: this
                });
            } else {
                if (StoragePlugin.instance === null) {
                    StoragePlugin.instance = this;
                } else {
                    return StoragePlugin.instance;
                }
            }

            if (StorageUtils.isLocalStorageSupport()) {
                this.setAdapter(new StorageAdapters.LocalStorage());
            } else {
                this.setAdapter(new StorageAdapters.CookieStorage());
            }
        }

        public setAdapter(storageAdapter: StorageAdapters.IStorage): void {
            this.storage = storageAdapter;
        }

        get forcePromises(): boolean {
            return this.storage.forcePromises;
        }

        set forcePromises(forceIt: boolean) {
            this.storage.forcePromises = forceIt;
        }

        get length(): number {
            if (this.storage === null) {
                return 0;
            }

            return this.storage.length;
        }

        public setNamespace(namedSpace: string): void | Promise<void> {
            if (this.storage !== null) {
                return this.storage.setNamespace(namedSpace);
            }
        }

        public key(n: number): string | Promise<string> {
            if (this.storage === null) {
                return '';
            }

            return this.storage.key(n);
        }

        public getItem(key: string): any | Promise<any> {
            if (this.storage === null) {
                return null;
            }

            return this.storage.getItem(key);
        }

        public setItem(key: string, value: string): void | Promise<void> {
            if (this.storage !== null) {
                return this.storage.setItem(key, value);
            }
        }

        public removeItem(key: string): void | Promise<void> {
            if (this.storage !== null) {
                return this.storage.removeItem(key);
            }
        }

        public clear(): void | Promise<void> {
            if (this.storage !== null) {
                return this.storage.clear();
            }
        }
    }
}

if ((<any>window).Phaser !== undefined) {
    Phaser.Utils.mixinPrototype(PhaserSuperStorage.StoragePlugin, Phaser.Plugin);
}
