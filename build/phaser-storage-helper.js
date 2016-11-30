/*!
 * phaser-super-storage - version 0.2.1 
 * A cross platform storage plugin for Phaser
 *
 * OrangeGames
 * Build at 30-11-2016
 * Released under MIT License 
 */

var StorageCommand = Fabrique.StorageCommand;
var StorageUtils = Fabrique.StorageUtils;
var LocalStorage = Fabrique.StorageAdapters.LocalStorage;
(function () {
    var gameOrigin = window.gameOrigin || '*';
    var localStorageSupported = StorageUtils.isLocalStorageSupport();
    var storage = localStorageSupported ? new LocalStorage() : null;
    window.addEventListener('message', function (event) {
        if (gameOrigin !== '*' && event.origin !== gameOrigin) {
            return;
        }
        var message = StorageUtils.validateMessage(event.data);
        var source = event.ports[0];
        var sendError = function (command, errorMessage) {
            source.postMessage({
                status: 'error',
                command: command,
                value: errorMessage
            });
        };
        if (null !== message) {
            if (!localStorageSupported) {
                sendError(message.command, 'localStorage not supported');
            }
            switch (message.command) {
                case StorageCommand.init:
                    source.postMessage({
                        status: 'ok',
                        command: message.command,
                        length: storage.length
                    });
                    break;
                case StorageCommand.getItem:
                    try {
                        var item = storage.getItem(message.key);
                        source.postMessage({
                            status: 'ok',
                            command: message.command,
                            value: item,
                            length: storage.length
                        });
                    }
                    catch (e) {
                        sendError(message.command, e.message);
                    }
                    break;
                case StorageCommand.setItem:
                    try {
                        storage.setItem(message.key, message.value);
                        source.postMessage({
                            status: 'ok',
                            command: message.command,
                            length: storage.length
                        });
                    }
                    catch (e) {
                        sendError(message.command, e.message);
                    }
                    break;
                case StorageCommand.removeItem:
                    try {
                        storage.removeItem(message.key);
                        source.postMessage({
                            status: 'ok',
                            command: message.command,
                            length: storage.length
                        });
                    }
                    catch (e) {
                        sendError(message.command, e.message);
                    }
                    break;
                case StorageCommand.setNamespace:
                    try {
                        storage.setNamespace(message.value);
                        source.postMessage({
                            status: 'ok',
                            command: message.command,
                            value: message.value,
                            length: storage.length
                        });
                    }
                    catch (e) {
                        sendError(message.command, e.message);
                    }
                    break;
                case StorageCommand.clear:
                    try {
                        storage.clear();
                        source.postMessage({
                            status: 'ok',
                            command: message.command,
                            length: storage.length
                        });
                    }
                    catch (e) {
                        sendError(message.command, e.message);
                    }
                    break;
                case StorageCommand.length:
                    try {
                        source.postMessage({
                            status: 'ok',
                            command: message.command,
                            value: storage.length,
                            length: storage.length
                        });
                    }
                    catch (e) {
                        sendError(message.command, e.message);
                    }
                    break;
                case StorageCommand.key:
                    try {
                        var nkey = storage.key(message.value);
                        source.postMessage({
                            status: 'ok',
                            command: message.command,
                            value: nkey,
                            length: storage.length
                        });
                    }
                    catch (e) {
                        sendError(message.command, e.message);
                    }
                    break;
                default:
                    sendError(message.command, 'Command not found');
                    break;
            }
        }
        else {
            sendError(message.command, 'Empty message!');
        }
    });
})();
var Fabrique;
(function (Fabrique) {
    (function (StorageCommand) {
        StorageCommand[StorageCommand["init"] = 0] = "init";
        StorageCommand[StorageCommand["setItem"] = 1] = "setItem";
        StorageCommand[StorageCommand["getItem"] = 2] = "getItem";
        StorageCommand[StorageCommand["removeItem"] = 3] = "removeItem";
        StorageCommand[StorageCommand["clear"] = 4] = "clear";
        StorageCommand[StorageCommand["setNamespace"] = 5] = "setNamespace";
        StorageCommand[StorageCommand["length"] = 6] = "length";
        StorageCommand[StorageCommand["key"] = 7] = "key";
    })(Fabrique.StorageCommand || (Fabrique.StorageCommand = {}));
    var StorageCommand = Fabrique.StorageCommand;
    var StorageUtils = (function () {
        function StorageUtils() {
        }
        StorageUtils.isLocalStorageSupport = function () {
            try {
                if (typeof localStorage === 'object') {
                    localStorage.setItem('testingLocalStorage', 'foo');
                    localStorage.removeItem('testingLocalStorage');
                    return true;
                }
            }
            catch (e) {
                return false;
            }
            return false;
        };
        StorageUtils.validateMessage = function (data) {
            if (data.hasOwnProperty('command')) {
                return data;
            }
            return null;
        };
        StorageUtils.nameSpaceKeyFilter = function (keys, namespace) {
            return keys.filter(function (keyName) {
                return (keyName.substring(0, namespace.length) === namespace);
            });
        };
        return StorageUtils;
    }());
    Fabrique.StorageUtils = StorageUtils;
})(Fabrique || (Fabrique = {}));
var Fabrique;
(function (Fabrique) {
    var StorageAdapters;
    (function (StorageAdapters) {
        /**
         * Storage driver for browser's localStorage
         */
        var LocalStorage = (function () {
            function LocalStorage(spacedName) {
                if (spacedName === void 0) { spacedName = ''; }
                this.namespace = '';
                this.forcePromises = false;
                this.setNamespace(spacedName);
            }
            Object.defineProperty(LocalStorage.prototype, "length", {
                get: function () {
                    var keys = Object.keys(localStorage);
                    return Fabrique.StorageUtils.nameSpaceKeyFilter(keys, this.namespace).length;
                },
                enumerable: true,
                configurable: true
            });
            LocalStorage.prototype.key = function (n) {
                var keys = Object.keys(localStorage);
                var spacedKeys = Fabrique.StorageUtils.nameSpaceKeyFilter(keys, this.namespace);
                var item = localStorage.getItem(spacedKeys[n]);
                if (this.forcePromises) {
                    return this.promisefy(item);
                }
                return item;
            };
            LocalStorage.prototype.getItem = function (key) {
                var item = localStorage.getItem(this.namespace + key);
                if (this.forcePromises) {
                    return this.promisefy(item);
                }
                return item;
            };
            LocalStorage.prototype.setItem = function (key, value) {
                localStorage.setItem(this.namespace + key, value);
                if (this.forcePromises) {
                    return this.promisefy(null);
                }
            };
            LocalStorage.prototype.removeItem = function (key) {
                localStorage.removeItem(this.namespace + key);
                if (this.forcePromises) {
                    return this.promisefy(null);
                }
            };
            LocalStorage.prototype.clear = function () {
                var keys = Object.keys(localStorage);
                var spacedKeys = Fabrique.StorageUtils.nameSpaceKeyFilter(keys, this.namespace);
                for (var i = 0; i < spacedKeys.length; i++) {
                    localStorage.removeItem(spacedKeys[i]);
                }
                if (this.forcePromises) {
                    return this.promisefy(null);
                }
            };
            LocalStorage.prototype.setNamespace = function (spacedName) {
                if (spacedName) {
                    this.namespace = spacedName + ':';
                }
                if (this.forcePromises) {
                    return this.promisefy(spacedName);
                }
            };
            LocalStorage.prototype.promisefy = function (value) {
                return new Promise(function (resolve, reject) {
                    resolve(value);
                });
            };
            return LocalStorage;
        }());
        StorageAdapters.LocalStorage = LocalStorage;
    })(StorageAdapters = Fabrique.StorageAdapters || (Fabrique.StorageAdapters = {}));
})(Fabrique || (Fabrique = {}));
//# sourceMappingURL=phaser-storage-helper.js.map