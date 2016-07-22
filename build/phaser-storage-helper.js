/*!
 * phaser-super-storage - version 0.0.1 
 * A cross platform storage plugin for Phaser
 *
 * OrangeGames
 * Build at 22-07-2016
 * Released under MIT License 
 */

var StorageCommand = Fabrique.StorageCommand;
var StorageUtils = Fabrique.StorageUtils;
var LocalStorage = Fabrique.StorageAdapters.LocalStorage;
(function () {
    var gameOrigin = window.gameOrigin || '*';
    window.addEventListener('message', function (mesage) {
        if (gameOrigin !== '*' && mesage.origin !== gameOrigin) {
            return;
        }
        var localStorageSupported = StorageUtils.isLocalStorageSupport();
        var data = StorageUtils.validateMessage(mesage.data);
        if (data) {
            switch (data.command) {
                case StorageCommand.init:
                    break;
            }
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
            catch (e) { }
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
    })();
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
                return localStorage.getItem(spacedKeys[n]);
            };
            LocalStorage.prototype.getItem = function (key) {
                return localStorage.getItem(this.namespace + key);
            };
            LocalStorage.prototype.setItem = function (key, value) {
                localStorage.setItem(this.namespace + key, value);
            };
            LocalStorage.prototype.deleteItem = function (key) {
                localStorage.removeItem(this.namespace + key);
            };
            LocalStorage.prototype.empty = function () {
                var keys = Object.keys(localStorage);
                var spacedKeys = Fabrique.StorageUtils.nameSpaceKeyFilter(keys, this.namespace);
                for (var i = 0; i < spacedKeys.length; i++) {
                    localStorage.removeItem(spacedKeys[i]);
                }
            };
            LocalStorage.prototype.setNamespace = function (spacedName) {
                if (spacedName) {
                    this.namespace = spacedName + ':';
                }
            };
            return LocalStorage;
        })();
        StorageAdapters.LocalStorage = LocalStorage;
    })(StorageAdapters = Fabrique.StorageAdapters || (Fabrique.StorageAdapters = {}));
})(Fabrique || (Fabrique = {}));
//# sourceMappingURL=phaser-storage-helper.js.map