module Fabrique {
    export module StorageAdapters {
        /**
         * Storage driver for browser's localStorage
         */
        export class IframeStorage implements IStorage {
            public namespace: string = '';

            public expectedOrigin: string = '';
            
            private storageLength: number = 0;

            constructor(spacedName: string = '', expectedOrigin: string = '*') {
                if (spacedName !== '') {
                    this.setNamespace(spacedName);
                }

                this.expectedOrigin = expectedOrigin;

                this.sendMessage(<StorageMessage>{
                    command: StorageCommand.length
                });
            }

            get length(): number {
                return this.storageLength;
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
                return new Promise((resolve : (value?: any | Thenable<any>) => void, reject: (error?: any) => void) => {
                    var messageChannel:MessageChannel = new MessageChannel();

                    messageChannel.port1.onmessage = (event: MessageEvent) => {
                        let message: Fabrique.StorageMessage = StorageUtils.validateMessage(event.data);

                        if (message.status === undefined || message.status !== 'ok') {
                            reject(message.value);
                        }

                        if (message.length !== undefined) {
                            this.storageLength = message.value;
                        }

                        switch (message.command) {
                            case StorageCommand.setNamespace:
                                this.namespace = message.value + ':';
                                resolve();
                                break;
                            case StorageCommand.getItem:
                                resolve(message.value);
                                break;
                            case StorageCommand.length:
                                resolve(message.value);
                        }
                    };

                    window.parent.postMessage(message, this.expectedOrigin, [messageChannel.port2]);
                });
            }
        }
    }
}