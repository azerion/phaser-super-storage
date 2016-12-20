module PhaserSuperStorage {
    export interface IStorageMessage {
        command: StorageCommand;
        status?: string;
        key?: string;
        value?: any;
        length?: number;
    }

    export enum StorageCommand {
        init,
        setItem,
        getItem,
        removeItem,
        clear,
        setNamespace,
        length,
        key,
        error
    }

    export class StorageUtils {
        public static isLocalStorageSupport(): boolean {
            try {
                if (typeof localStorage === 'object') {
                    localStorage.setItem('testingLocalStorage', 'foo');
                    localStorage.removeItem('testingLocalStorage');
                    return true;
                }
            } catch (e) {
                return false;
            }

            return false;
        }

        public static validateMessage(data: IStorageMessage): IStorageMessage {
            if (data.hasOwnProperty('command')) {
                return data;
            }

            return null;
        }

        public static nameSpaceKeyFilter(keys: string[], namespace: string): string[] {
            return keys.filter((keyName: string) => {
                return (keyName.substring(0, namespace.length) === namespace);
            });
        }
    }
}
