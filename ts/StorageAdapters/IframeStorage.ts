module Fabrique {
    export module StorageAdapters {
        /**
         * Storage driver for browser's localStorage
         */
        export class IframeStorage implements IStorage {
            public namespace: string = '';

            public expectedOrigin: string = '';
            
            private storageLength: number = 0;

            private enabled: boolean = false;

            get forcePromises(): boolean {
                return true;
            }

            set forcePromises(v: boolean) {}

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
                return this.sendMessage(<StorageMessage>{
                    command: StorageCommand.init
                }).then(() => {
                    this.enabled = true;
                });
            }

            public key(n: number): Promise<any> {
                return this.sendMessage(<StorageMessage>{
                    command: StorageCommand.key,
                    value: n
                });
            }

            public getItem(key: string): Promise<any> {
                return this.sendMessage(<StorageMessage>{
                    command: StorageCommand.getItem,
                    key: key
                });
            }

            public setItem(key: string, value: any): Promise<void> {
                return this.sendMessage(<StorageMessage>{
                    command: StorageCommand.setItem,
                    key: key,
                    value: value
                });
            }

            public removeItem(key: string): Promise<void> {
                return this.sendMessage(<StorageMessage>{
                    command: StorageCommand.removeItem,
                    key: key
                });
            }

            public clear(): Promise<void> {
                return this.sendMessage(<StorageMessage>{
                    command: StorageCommand.clear
                });
            }

            public setNamespace(spacedName: string): Promise<void> {
                return this.sendMessage({
                    command: StorageCommand.setNamespace,
                    value: spacedName
                });
            }

            private sendMessage(message: StorageMessage): Promise<any> {
                if (message.command === StorageCommand.init) {
                    var returnedResult: boolean = false;
                }

                var messageChannel:MessageChannel = new MessageChannel();

                return new Promise((resolve : (value?: any | Thenable<any>) => void, reject: (error?: any) => void) => {
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

                        let message: Fabrique.StorageMessage = StorageUtils.validateMessage(event.data);

                        if (message.command === StorageCommand.init) {
                            returnedResult = true;
                        }

                        if (message.status === undefined || message.status !== 'ok') {
                            reject(message.value);
                        }

                        if (message.length !== undefined) {
                            this.storageLength = message.length;
                        }

                        switch (message.command) {
                            case StorageCommand.setNamespace:
                                this.namespace = message.value + ':';
                            case StorageCommand.getItem:
                            case StorageCommand.length:
                            case StorageCommand.key:
                                resolve(message.value);
                                break;
                            case StorageCommand.setItem:
                            case StorageCommand.removeItem:
                            case StorageCommand.clear:
                            case StorageCommand.init:
                                resolve(message.status);
                                break;
                            default:
                                reject(message.value);
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
    }
}