module Fabrique {
    export module StorageAdapters {
        /**
         * Storage driver for browser's localStorage
         */
        export class CordovaStorage implements IStorage {
            public namespace: string = '';
            private keys: string[];

            public get forcePromises(): boolean {
                return true;
            }

            public set forcePromises(v: boolean) {
                //Do nothing
            }

            // Due to async /w promise it is not possible to pass namespace in constructor
            constructor() {
                this.keys = [];
            }

            public get length(): number {
                return this.keys.length;
            }

            public key(n: number): Promise<any> {
                return this.promisefy(this.keys[n]);
            }

            public getItem(key: string): Promise<any> {
                return new Promise((resolve: (value?: any | Thenable<any>) => void, reject: (error?: any) => void) => {
                    NativeStorage.getItem(this.namespace + key, (value: string) => {
                        resolve(value);
                    }, (error: any) => {
                        reject(error);
                    });
                });
            }

            public setItem(key: string, value: any): Promise<void> {
                if (key.length < 1) {
                    console.error('CordovaStorage: Key cannot be an empty string!');
                    return;
                }
                return new Promise((resolve: (value?: any | Thenable<any>) => void, reject: (error?: any) => void) => {
                    NativeStorage.setItem(this.namespace + key, value, (value: string) => {
                        if (this.keys.indexOf(key) < 0) {
                            this.keys.push(key);
                            this.save();
                        }
                        resolve(null);
                    }, (error: any) => {
                        reject(error);
                    });
                });
            }

            public removeItem(key: string): Promise<void> {
                return new Promise((resolve: (value?: any | Thenable<any>) => void, reject: (error?: any) => void) => {
                    NativeStorage.remove(this.namespace + ':' + key, () => {
                        let id: number = this.keys.indexOf(key);
                        if (id >= 0) {
                            this.keys.splice(id, 1);
                            this.save();
                        }
                        resolve();
                    }, (error: any) => {
                        reject(error);
                    });
                });
            }

            public clear(): Promise<void> {
                return new Promise((resolve: (value?: any | Thenable<any>) => void, reject: (error?: any) => void) => {
                    let counter: number = 0;
                    for (let i: number = 0; i < this.keys.length; i++) {
                        NativeStorage.remove(this.namespace + ':' + this.keys[i], () => {
                            if (++counter >= this.keys.length) {
                                resolve();
                                this.keys = [];
                                this.save();
                            }
                        }, (error: any) => {
                            reject(error);
                        });
                    }
                });
            }

            public setNamespace(spacedName: string = ''): Promise<void> {
                this.namespace = spacedName + ':';
                this.keys = [];
                return new Promise((resolve: (value?: any | Thenable<any>) => void, reject: (error?: any) => void) => {
                    this.load().then(resolve).catch(resolve);
                });
            }

            private promisefy(value: any): Promise<any> {
                return new Promise((resolve: (value?: any | Thenable<any>) => void, reject: (error?: any) => void) => {
                    resolve(value);
                });
            }

            private load(): Promise<void> {
                return new Promise((resolve: (value?: any | Thenable<any>) => void, reject: (error?: any) => void) => {
                    NativeStorage.getItem(this.namespace, (value: string) => {
                        this.keys = JSON.parse(value);
                        resolve(null);
                    }, (error: any) => {
                        reject(error);
                    });
                });
            }

            private save(): void {
                NativeStorage.setItem(this.namespace, JSON.stringify(this.keys), () => {
                    return;
                }, (error: any) => {
                    console.warn('CordovaStorage: Failed to save keys of namespace.');
                });
            }
        }
    }
}
