// Type definitions for es6-promise
// Project: https://github.com/jakearchibald/ES6-Promise
// Definitions by: François de Campredon <https://github.com/fdecampredon/>, vvakame <https://github.com/vvakame>
// Definitions: https://github.com/DefinitelyTyped/DefinitelyTyped

interface Thenable<T> {
    then<U>(onFulfilled?: (value: T) => U | Thenable<U>, onRejected?: (error: any) => U | Thenable<U>): Thenable<U>;
    then<U>(onFulfilled?: (value: T) => U | Thenable<U>, onRejected?: (error: any) => void): Thenable<U>;
}

declare class Promise<T> implements Thenable<T> {
	/**
	 * If you call resolve in the body of the callback passed to the constructor,
	 * your promise is fulfilled with result object passed to resolve.
	 * If you call reject your promise is rejected with the object passed to reject.
	 * For consistency and debugging (eg stack traces), obj should be an instanceof Error.
	 * Any errors thrown in the constructor callback will be implicitly passed to reject().
	 */
	constructor(callback: (resolve : (value?: T | Thenable<T>) => void, reject: (error?: any) => void) => void);

	/**
	 * onFulfilled is called when/if "promise" resolves. onRejected is called when/if "promise" rejects.
	 * Both are optional, if either/both are omitted the next onFulfilled/onRejected in the chain is called.
	 * Both callbacks have a single parameter , the fulfillment value or rejection reason.
	 * "then" returns a new promise equivalent to the value you return from onFulfilled/onRejected after being passed through Promise.resolve.
	 * If an error is thrown in the callback, the returned promise rejects with that error.
	 *
	 * @param onFulfilled called when/if "promise" resolves
	 * @param onRejected called when/if "promise" rejects
	 */
    then<U>(onFulfilled?: (value: T) => U | Thenable<U>, onRejected?: (error: any) => U | Thenable<U>): Promise<U>;
    then<U>(onFulfilled?: (value: T) => U | Thenable<U>, onRejected?: (error: any) => void): Promise<U>;

	/**
	 * Sugar for promise.then(undefined, onRejected)
	 *
	 * @param onRejected called when/if "promise" rejects
	 */
	catch<U>(onRejected?: (error: any) => U | Thenable<U>): Promise<U>;
}

declare namespace Promise {
	/**
	 * Make a new promise from the thenable.
	 * A thenable is promise-like in as far as it has a "then" method.
	 */
	function resolve<T>(value?: T | Thenable<T>): Promise<T>;

	/**
	 * Make a promise that rejects to obj. For consistency and debugging (eg stack traces), obj should be an instanceof Error
	 */
	function reject(error: any): Promise<any>;
	function reject<T>(error: T): Promise<T>;

	/**
	 * Make a promise that fulfills when every item in the array fulfills, and rejects if (and when) any item rejects.
	 * the array passed to all can be a mixture of promise-like objects and other objects.
	 * The fulfillment value is an array (in order) of fulfillment values. The rejection value is the first rejection value.
	 */
	function all<T1, T2, T3, T4, T5, T6, T7, T8, T9, T10>(values: [T1 | Thenable<T1>, T2 | Thenable<T2>, T3 | Thenable<T3>, T4 | Thenable <T4>, T5 | Thenable<T5>, T6 | Thenable<T6>, T7 | Thenable<T7>, T8 | Thenable<T8>, T9 | Thenable<T9>, T10 | Thenable<T10>]): Promise<[T1, T2, T3, T4, T5, T6, T7, T8, T9, T10]>;
    function all<T1, T2, T3, T4, T5, T6, T7, T8, T9>(values: [T1 | Thenable<T1>, T2 | Thenable<T2>, T3 | Thenable<T3>, T4 | Thenable <T4>, T5 | Thenable<T5>, T6 | Thenable<T6>, T7 | Thenable<T7>, T8 | Thenable<T8>, T9 | Thenable<T9>]): Promise<[T1, T2, T3, T4, T5, T6, T7, T8, T9]>;
    function all<T1, T2, T3, T4, T5, T6, T7, T8>(values: [T1 | Thenable<T1>, T2 | Thenable<T2>, T3 | Thenable<T3>, T4 | Thenable <T4>, T5 | Thenable<T5>, T6 | Thenable<T6>, T7 | Thenable<T7>, T8 | Thenable<T8>]): Promise<[T1, T2, T3, T4, T5, T6, T7, T8]>;
    function all<T1, T2, T3, T4, T5, T6, T7>(values: [T1 | Thenable<T1>, T2 | Thenable<T2>, T3 | Thenable<T3>, T4 | Thenable <T4>, T5 | Thenable<T5>, T6 | Thenable<T6>, T7 | Thenable<T7>]): Promise<[T1, T2, T3, T4, T5, T6, T7]>;
    function all<T1, T2, T3, T4, T5, T6>(values: [T1 | Thenable<T1>, T2 | Thenable<T2>, T3 | Thenable<T3>, T4 | Thenable <T4>, T5 | Thenable<T5>, T6 | Thenable<T6>]): Promise<[T1, T2, T3, T4, T5, T6]>;
    function all<T1, T2, T3, T4, T5>(values: [T1 | Thenable<T1>, T2 | Thenable<T2>, T3 | Thenable<T3>, T4 | Thenable <T4>, T5 | Thenable<T5>]): Promise<[T1, T2, T3, T4, T5]>;
    function all<T1, T2, T3, T4>(values: [T1 | Thenable<T1>, T2 | Thenable<T2>, T3 | Thenable<T3>, T4 | Thenable <T4>]): Promise<[T1, T2, T3, T4]>;
    function all<T1, T2, T3>(values: [T1 | Thenable<T1>, T2 | Thenable<T2>, T3 | Thenable<T3>]): Promise<[T1, T2, T3]>;
    function all<T1, T2>(values: [T1 | Thenable<T1>, T2 | Thenable<T2>]): Promise<[T1, T2]>;
    function all<T>(values: (T | Thenable<T>)[]): Promise<T[]>;

	/**
	 * Make a Promise that fulfills when any item fulfills, and rejects if any item rejects.
	 */
	function race<T>(promises: (T | Thenable<T>)[]): Promise<T>;
}

declare module 'es6-promise' {
	var foo: typeof Promise; // Temp variable to reference Promise in local context
	namespace rsvp {
		export var Promise: typeof foo;
		export function polyfill(): void;
	}
	export = rsvp;
}

declare module Fabrique {
    module StorageAdapters {
        /**
         * Storage driver for cookies
         */
        class CookieStorage implements IStorage {
            private keys;
            private reg;
            namespace: string;
            forcePromises: boolean;
            constructor(spacedName?: string);
            length: number;
            key(n: number): any | Promise<any>;
            getItem(key: string): string | Promise<string>;
            setItem(key: string, value: any): void | Promise<void>;
            removeItem(key: string): void | Promise<void>;
            clear(): void | Promise<void>;
            setNamespace(namespace: string): void | Promise<void>;
            private getNameSpaceMatches();
            private getCookiesForNameSpace();
            private promisefy(value);
        }
    }
}
declare module Fabrique {
    module StorageAdapters {
        interface IStorage {
            forcePromises: boolean;
            length: number;
            namespace: string;
            getItem(key: string): any | Promise<any>;
            removeItem(key: string): any | Promise<any>;
            setItem(key: string, value: any): void | Promise<void>;
            key(n: number): any | Promise<any>;
            clear(): void | Promise<void>;
            setNamespace(namespace: string): void | Promise<void>;
        }
    }
}
declare module Fabrique {
    module StorageAdapters {
        /**
         * Storage driver for browser's localStorage
         */
        class IframeStorage implements IStorage {
            namespace: string;
            expectedOrigin: string;
            private storageLength;
            private enabled;
            forcePromises: boolean;
            constructor(spacedName?: string, expectedOrigin?: string);
            length: number;
            init(): Promise<any>;
            key(n: number): Promise<any>;
            getItem(key: string): Promise<any>;
            setItem(key: string, value: any): Promise<void>;
            removeItem(key: string): Promise<void>;
            clear(): Promise<void>;
            setNamespace(spacedName: string): Promise<void>;
            private sendMessage(message);
        }
    }
}
declare module Fabrique {
    module StorageAdapters {
        /**
         * Storage driver for browser's localStorage
         */
        class LocalStorage implements IStorage {
            namespace: string;
            forcePromises: boolean;
            constructor(spacedName?: string);
            length: number;
            key(n: number): any | Promise<any>;
            getItem(key: string): any | Promise<any>;
            setItem(key: string, value: any): void | Promise<void>;
            removeItem(key: string): void | Promise<void>;
            clear(): void | Promise<void>;
            setNamespace(spacedName: string): void | Promise<void>;
            private promisefy(value);
        }
    }
}
declare module Fabrique {
    module Plugins {
        interface SuperStorageGame extends Phaser.Game {
            storage: Fabrique.Plugins.SuperStorage;
        }
        class SuperStorage extends Phaser.Plugin {
            private storage;
            constructor(game: SuperStorageGame, pluginManager: Phaser.PluginManager);
            setAdapter(storageAdapter: StorageAdapters.IStorage): void;
            forcePromises: boolean;
            length: number;
            setNamespace(namedSpace: string): void | Promise<void>;
            key(n: number): string | Promise<string>;
            getItem(key: string): any | Promise<any>;
            setItem(key: string, value: string): void | Promise<void>;
            removeItem(key: string): void | Promise<void>;
            clear(): void | Promise<void>;
        }
    }
}
declare module Fabrique {
    interface StorageMessage {
        command: StorageCommand;
        status?: string;
        key?: string;
        value?: any;
        length?: number;
    }
    enum StorageCommand {
        init = 0,
        setItem = 1,
        getItem = 2,
        removeItem = 3,
        clear = 4,
        setNamespace = 5,
        length = 6,
        key = 7,
    }
    class StorageUtils {
        static isLocalStorageSupport(): boolean;
        static validateMessage(data: StorageMessage): StorageMessage;
        static nameSpaceKeyFilter(keys: string[], namespace: string): string[];
    }
}
