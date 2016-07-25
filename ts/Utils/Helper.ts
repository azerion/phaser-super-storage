import StorageCommand = Fabrique.StorageCommand;
import StorageUtils = Fabrique.StorageUtils;
import LocalStorage = Fabrique.StorageAdapters.LocalStorage;

(() => {
    let gameOrigin: string = (<any>window).gameOrigin || '*';
    let localStorageSupported: boolean = StorageUtils.isLocalStorageSupport();
    let storage = localStorageSupported ? new LocalStorage() : null;



    window.addEventListener('message', (event: MessageEvent) => {
        if (gameOrigin !== '*' && event.origin !== gameOrigin) {
            return;
        }

        let message: Fabrique.StorageMessage = StorageUtils.validateMessage(event.data);
        let source: Window = event.source;

        let sendError = (command: StorageCommand, message: string): void => {
            source.postMessage(<Fabrique.StorageMessage>{
                status: 'error',
                command: command,
                result: message
            }, gameOrigin);
        };

        if (message) { 
            if (!localStorageSupported) {
                sendError(message.command, 'localStorage not supported');
            }

            switch (message.command) {
                case StorageCommand.init:
                    source.postMessage(<Fabrique.StorageMessage>{
                        status: 'ok',
                        command: message.command
                    }, gameOrigin);
                    break;
                case StorageCommand.getItem:
                    try {
                        let item = storage.getItem(message.key);

                        source.postMessage(<Fabrique.StorageMessage>{
                            status: 'ok',
                            command: message.command,
                            value: item
                        }, gameOrigin);
                    } catch (e) {
                        sendError(message.command, e.message);
                    }
                    break;
                case StorageCommand.setItem:
                    try {
                        storage.setItem(message.key, message.value);

                        source.postMessage(<Fabrique.StorageMessage>{
                            status: 'ok',
                            command: message.command
                        }, gameOrigin);
                    } catch (e) {
                        sendError(message.command, e.message);
                    }
                    break;
                case StorageCommand.removeItem:
                    try {
                        storage.removeItem(message.key);

                        source.postMessage(<Fabrique.StorageMessage>{
                            status: 'ok',
                            command: message.command
                        }, gameOrigin);
                    } catch (e) {
                        sendError(message.command, e.message);
                    }
                    break;
                case StorageCommand.setNamespace:
                    try {
                        storage.setNamespace(message.value);

                        source.postMessage(<Fabrique.StorageMessage>{
                            status: 'ok',
                            command: message.command
                        }, gameOrigin);
                    } catch (e) {
                        sendError(message.command, e.message);
                    }
                    break;
                case StorageCommand.clear:
                    try {
                        storage.clear();

                        source.postMessage(<Fabrique.StorageMessage>{
                            status: 'ok',
                            command: message.command
                        }, gameOrigin);
                    } catch (e) {
                        sendError(message.command, e.message);
                    }
                    break;
                case StorageCommand.length:
                    try {
                        let length: number = storage.length;

                        source.postMessage(<Fabrique.StorageMessage>{
                            status: 'ok',
                            command: message.command,
                            value: length
                        }, gameOrigin);
                    } catch (e) {
                        sendError(message.command, e.message);
                    }
                    break;
                case StorageCommand.key:
                    try {
                        let nkey: number = storage.key(message.value);

                        source.postMessage(<Fabrique.StorageMessage>{
                            status: 'ok',
                            command: message.command,
                            value: nkey
                        }, gameOrigin);
                    } catch (e) {
                        sendError(message.command, e.message);
                    }
                    break;
                default:
                    sendError(message.command, 'Command not found');
                    break;
            }
        } else {
            sendError(message.command, 'Empty message!');
        }
    });
})();