import IStorage from './IStorage';

interface ICookieStore {
    [name: string]: string;
}

/**
 * Storage driver for cookies
 */
export default class CookieStorage implements IStorage {
    private reg: RegExp;

    public namespace: string = '';

    public forcePromises: boolean = false;

    constructor(spacedName: string = '') {
        this.setNamespace(spacedName);
    }

    get length(): number {
        return (this.getNameSpaceMatches() !== null) ? this.getNameSpaceMatches().length : 0;
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
        document.cookie = encodeURIComponent(this.namespace + key) + '=' + encodeURIComponent(value) + '; expires=Tue, 19 Jan 2038 03:14:07 GMT; path=/';

        if (this.forcePromises) {
            return this.promisefy(null);
        }
    }

    public removeItem(key: string): void | Promise<void> {
        document.cookie = encodeURIComponent(this.namespace + key) + '=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/';

        if (this.forcePromises) {
            return this.promisefy(null);
        }
    }

    public clear(): void | Promise<void> {
        let cookies: ICookieStore = this.getCookiesForNameSpace();
        for (let key in cookies) {
            if (cookies.hasOwnProperty(key)) {
                this.removeItem(key);
            }
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
        let cookies: string[] = decodeURIComponent(document.cookie).split('; ');

        return cookies.filter((val: string) => {
            return (val.match(this.reg) !== null) ? val.match(this.reg).length > 0 : false;
        });
    }

    private getCookiesForNameSpace(): ICookieStore {
        let cookies: ICookieStore = {};
        this.getNameSpaceMatches().forEach((cookie: string) => {
            let temp: string[] = cookie.replace(this.namespace, '').split('=');
            cookies[temp[0]] = temp[1];
        });
        return cookies;
    }

    private promisefy(value: any): Promise<any> {
        return new Promise((resolve: (value?: any | Promise<any>) => void) => {
            resolve(value);
        });
    }
}
