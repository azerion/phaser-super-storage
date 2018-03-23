import * as StorageAdapters from './StorageAdapters';
import {StorageUtils} from './Utils/Storage';

export {default as CookieStorage} from './StorageAdapters/CookieStorage';
export {default as CordovaStorage} from './StorageAdapters/CordovaStorage';
export {default as LocalStorage} from './StorageAdapters/LocalStorage';
export {default as IframeStorage} from './StorageAdapters/IframeStorage';
export {default as IStorage} from './StorageAdapters/IStorage';

export default class PhaserSuperStorage {
    private storage: StorageAdapters.IStorage;

    private scene: Phaser.Scene;

    private static nameSpace: string = '';

    constructor(scene?: Phaser.Scene) {
        //  The Scene that owns this plugin
        this.scene = scene;

        if (!this.scene.sys.settings.isBooted) {
            this.scene.sys.events.once('boot', () => this.boot);
        }
    }

    public static register(manager: any): void {
        manager.register('PhaserSuperStorage', PhaserSuperStorage, 'storage');
    }

    private boot(): void {
        if (StorageUtils.isLocalStorageSupport()) {
            this.setAdapter(new StorageAdapters.LocalStorage());
        } else {
            this.setAdapter(new StorageAdapters.CookieStorage());
        }

        if (PhaserSuperStorage.nameSpace.length > 0) {
            this.storage.setNamespace(PhaserSuperStorage.nameSpace);
        }
    }

    public setAdapter(storageAdapter: StorageAdapters.IStorage): void {
        this.storage = storageAdapter;

        if (PhaserSuperStorage.nameSpace.length > 0) {
            this.storage.setNamespace(PhaserSuperStorage.nameSpace);
        }
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
        PhaserSuperStorage.nameSpace = namedSpace;

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
