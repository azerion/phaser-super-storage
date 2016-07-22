import StorageCommand = Fabrique.StorageCommand;
import StorageUtils = Fabrique.StorageUtils;
import LocalStorage = Fabrique.StorageAdapters.LocalStorage;

(() => {
    let gameOrigin: string = (<any>window).gameOrigin || '*';
    window.addEventListener('message', (mesage: MessageEvent) => {
        if (gameOrigin !== '*' && mesage.origin !== gameOrigin) {
            return;
        }
        
        let localStorageSupported: boolean = StorageUtils.isLocalStorageSupport();
        let data: Fabrique.StorageMessage = StorageUtils.validateMessage(mesage.data);
        
        if (data) {
            switch (data.command) {
                case StorageCommand.init:
                    break;
            }
        }
    });
})();