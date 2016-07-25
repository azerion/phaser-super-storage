module Fabrique {
    export module StorageAdapters {
        interface CookieStore {
            [name: string]: string;
        }

        /**
         * Storage driver for cookies
         */
        export class CookieStorage implements IStorage {
            private keys: string[] = [];

            private reg: RegExp;

            public namespace: string = '';
            
            public forcePromises: boolean = false;

            constructor(spacedName: string = '') {
                this.setNamespace(spacedName);
            }

            get length(): number {
                return (this.getNameSpaceMatches() !== null) ? this.getNameSpaceMatches().length : 0
            }

            public key(n: number): any | Promise<any> {
                let key: string = this.getNameSpaceMatches()[n];
                let result: any = this.getCookiesForNameSpace()[key] || null;

                if (this.forcePromises) {
                    return this.promisefy(result);
                }

                return result;
            }

            public getItem(key: string): string | Promise<string> {
                let result: any = this.getCookiesForNameSpace()[key] || null;
                if (this.forcePromises) {
                    return this.promisefy(result);
                }

                return result;
            }

            public setItem(key: string, value: any): void | Promise<void> {
                document.cookie = encodeURIComponent(this.namespace + key) + "=" + encodeURIComponent(value) + "; expires=Tue, 19 Jan 2038 03:14:07 GMT; path=/";

                if (this.forcePromises) {
                    return this.promisefy(null);
                }
            }

            public removeItem(key: string): void | Promise<void> {
                document.cookie = encodeURIComponent(this.namespace + key) + "=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/";

                if (this.forcePromises) {
                    return this.promisefy(null);
                }
            }

            public clear(): void | Promise<void> {
                let cookies: CookieStore = this.getCookiesForNameSpace();
                for (var key in cookies) {
                    this.removeItem(key);
                }

                if (this.forcePromises) {
                    return this.promisefy(null);
                }
            }

            public setNamespace(namespace: string): void | Promise<void> {
                if (namespace) {
                    this.namespace = namespace + ':';
                    this.reg = new RegExp('^' + this.namespace + '[a-zA-Z0-9]*', 'g');
                }

                if (this.forcePromises) {
                    return this.promisefy(namespace);
                }
            }

            private getNameSpaceMatches(): string[] {
                var cookies = decodeURIComponent(document.cookie).split('; ');

                return cookies.filter((val: string) => {
                    return (val.match(this.reg) !== null) ? val.match(this.reg).length > 0 : false;
                });
            }

            private getCookiesForNameSpace(): CookieStore {
                var cookies: CookieStore = {};
                this.getNameSpaceMatches().forEach((cookie: string) => {
                    var temp = cookie.replace(this.namespace, '').split('=');
                    cookies[temp[0]] = temp[1];
                });
                return cookies;
            }

            private promisefy(value: any): Promise<any> {
                return new Promise((resolve : (value?: any | Thenable<any>) => void, reject: (error?: any) => void) => {
                    resolve(value);
                });
            }
        }
    }
}