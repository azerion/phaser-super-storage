import IStorage from './IStorage';
import {IStorageMessage, StorageCommand, StorageUtils} from '../Utils/Storage';

/**
 * Storage driver for browser's localStorage
 */
export default class IframeStorage implements IStorage {
    public namespace: string = '';

    public expectedOrigin: string = '';

    private storageLength: number = 0;

    private enabled: boolean = false;

    get forcePromises(): boolean {
        return true;
    }

    constructor(spacedName: string = '', expectedOrigin: string = '*') {
        if (spacedName !== '') {
            this.setNamespace(spacedName);
        }

        this.expectedOrigin = expectedOrigin;
    }

    get length(): number {
        return this.storageLength;
    }

    public init(): Promise<any> {
        return this.sendMessage(<IStorageMessage>{
            command: StorageCommand.init
        }).then(() => {
            this.enabled = true;
        });
    }

    public key(n: number): Promise<any> {
        return this.sendMessage(<IStorageMessage>{
            command: StorageCommand.key,
            value: n
        });
    }

    public getItem(key: string): Promise<any> {
        return this.sendMessage(<IStorageMessage>{
            command: StorageCommand.getItem,
            key: key
        });
    }

    public setItem(key: string, value: any): Promise<void> {
        return this.sendMessage(<IStorageMessage>{
            command: StorageCommand.setItem,
            key: key,
            value: value
        });
    }

    public removeItem(key: string): Promise<void> {
        return this.sendMessage(<IStorageMessage>{
            command: StorageCommand.removeItem,
            key: key
        });
    }

    public clear(): Promise<void> {
        return this.sendMessage(<IStorageMessage>{
            command: StorageCommand.clear
        });
    }

    public setNamespace(spacedName: string): Promise<void> {
        return this.sendMessage({
            command: StorageCommand.setNamespace,
            value: spacedName
        });
    }

    private sendMessage(message: IStorageMessage): Promise<any> {
        let returnedResult: boolean;
        if (message.command === StorageCommand.init) {
            returnedResult = false;
        }

        let messageChannel: MessageChannel = new MessageChannel();

        return new Promise((resolve: (value?: any | Promise<any>) => void, reject: (error?: any) => void) => {
            if (!this.enabled && message.command !== StorageCommand.init) {
                reject('Messaging not enabled!');
            }

            if (message.command === StorageCommand.init) {
                //small timeout to see if stuff is enabled
                setTimeout(() => {
                    if (!returnedResult) {
                        reject('Unable to get a response in time');
                    }
                }, 1000);
            }

            messageChannel.port1.onmessage = (event: MessageEvent) => {
                console.log('Frame received message', event);

                let receivedMessage: IStorageMessage = StorageUtils.validateMessage(event.data);

                if (receivedMessage.command === StorageCommand.init) {
                    returnedResult = true;
                }

                if (receivedMessage.status === undefined || receivedMessage.status !== 'ok') {
                    reject(receivedMessage.value);
                }

                if (receivedMessage.length !== undefined) {
                    this.storageLength = receivedMessage.length;
                }

                switch (receivedMessage.command) {
                    case StorageCommand.setNamespace:
                        this.namespace = receivedMessage.value + ':';
                        resolve(receivedMessage.value);
                        break;
                    case StorageCommand.getItem:
                    case StorageCommand.length:
                    case StorageCommand.key:
                        resolve(receivedMessage.value);
                        break;
                    case StorageCommand.setItem:
                    case StorageCommand.removeItem:
                    case StorageCommand.clear:
                    case StorageCommand.init:
                        resolve(receivedMessage.status);
                        break;
                    default:
                        reject(receivedMessage.value);
                        break;
                }
            };

            if (this.enabled || message.command === StorageCommand.init) {
                console.log('Sending message to parent: ', message);
                window.parent.postMessage(message, this.expectedOrigin, [messageChannel.port2]);
            }
        });
    }
}
