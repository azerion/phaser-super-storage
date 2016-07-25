/*!
 * phaser-super-storage - version 0.0.1 
 * A cross platform storage plugin for Phaser
 *
 * OrangeGames
 * Build at 25-07-2016
 * Released under MIT License 
 */

var Fabrique;
(function (Fabrique) {
    var StorageAdapters;
    (function (StorageAdapters) {
        /**
         * Storage driver for cookies
         */
        var CookieStorage = (function () {
            function CookieStorage(spacedName) {
                if (spacedName === void 0) { spacedName = ''; }
                this.keys = [];
                this.namespace = '';
                this.setNamespace(spacedName);
            }
            Object.defineProperty(CookieStorage.prototype, "length", {
                get: function () {
                    return (this.getNameSpaceMatches() !== null) ? this.getNameSpaceMatches().length : 0;
                },
                enumerable: true,
                configurable: true
            });
            CookieStorage.prototype.key = function (n) {
                var key = this.getNameSpaceMatches()[n];
                return this.getCookiesForNameSpace()[key] || null;
            };
            CookieStorage.prototype.getItem = function (key) {
                return this.getCookiesForNameSpace()[key] || null;
            };
            CookieStorage.prototype.setItem = function (key, value) {
                document.cookie = encodeURIComponent(this.namespace + key) + "=" + encodeURIComponent(value) + "; expires=Tue, 19 Jan 2038 03:14:07 GMT; path=/";
            };
            CookieStorage.prototype.removeItem = function (key) {
                document.cookie = encodeURIComponent(this.namespace + key) + "=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/";
            };
            CookieStorage.prototype.clear = function () {
                var cookies = this.getCookiesForNameSpace();
                for (var key in cookies) {
                    this.removeItem(key);
                }
            };
            CookieStorage.prototype.setNamespace = function (namespace) {
                if (namespace) {
                    this.namespace = namespace + ':';
                    this.reg = new RegExp('^' + this.namespace + '[a-zA-Z0-9]*', 'g');
                }
            };
            CookieStorage.prototype.getNameSpaceMatches = function () {
                var _this = this;
                var cookies = decodeURIComponent(document.cookie).split('; ');
                return cookies.filter(function (val) {
                    return (val.match(_this.reg) !== null) ? val.match(_this.reg).length > 0 : false;
                });
            };
            CookieStorage.prototype.getCookiesForNameSpace = function () {
                var _this = this;
                var cookies = {};
                this.getNameSpaceMatches().forEach(function (cookie) {
                    var temp = cookie.replace(_this.namespace, '').split('=');
                    cookies[temp[0]] = temp[1];
                });
                return cookies;
            };
            return CookieStorage;
        })();
        StorageAdapters.CookieStorage = CookieStorage;
    })(StorageAdapters = Fabrique.StorageAdapters || (Fabrique.StorageAdapters = {}));
})(Fabrique || (Fabrique = {}));
var Fabrique;
(function (Fabrique) {
    var StorageAdapters;
    (function (StorageAdapters) {
        /**
         * Storage driver for browser's localStorage
         */
        var IframeStorage = (function () {
            function IframeStorage(spacedName) {
                if (spacedName === void 0) { spacedName = ''; }
                this.namespace = '';
                this.setNamespace(spacedName);
            }
            Object.defineProperty(IframeStorage.prototype, "length", {
                get: function () {
                    var keys = Object.keys(localStorage);
                    return Fabrique.StorageUtils.nameSpaceKeyFilter(keys, this.namespace).length;
                },
                enumerable: true,
                configurable: true
            });
            IframeStorage.prototype.key = function (n) {
                var keys = Object.keys(localStorage);
                var spacedKeys = Fabrique.StorageUtils.nameSpaceKeyFilter(keys, this.namespace);
                return localStorage.getItem(spacedKeys[n]);
            };
            IframeStorage.prototype.getItem = function (key) {
                return localStorage.getItem(this.namespace + key);
            };
            IframeStorage.prototype.setItem = function (key, value) {
                localStorage.setItem(this.namespace + key, value);
            };
            IframeStorage.prototype.removeItem = function (key) {
                localStorage.removeItem(this.namespace + key);
            };
            IframeStorage.prototype.clear = function () {
                var keys = Object.keys(localStorage);
                var spacedKeys = Fabrique.StorageUtils.nameSpaceKeyFilter(keys, this.namespace);
                for (var i = 0; i < spacedKeys.length; i++) {
                    localStorage.removeItem(spacedKeys[i]);
                }
            };
            IframeStorage.prototype.setNamespace = function (spacedName) {
                if (spacedName) {
                    this.namespace = spacedName + ':';
                }
            };
            return IframeStorage;
        })();
        StorageAdapters.IframeStorage = IframeStorage;
    })(StorageAdapters = Fabrique.StorageAdapters || (Fabrique.StorageAdapters = {}));
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
            LocalStorage.prototype.removeItem = function (key) {
                localStorage.removeItem(this.namespace + key);
            };
            LocalStorage.prototype.clear = function () {
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
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Fabrique;
(function (Fabrique) {
    var Plugins;
    (function (Plugins) {
        var SuperStorage = (function (_super) {
            __extends(SuperStorage, _super);
            function SuperStorage(game, pluginManager) {
                _super.call(this, game, pluginManager);
                Object.defineProperty(game, 'storage', {
                    value: this
                });
                if (Fabrique.StorageUtils.isLocalStorageSupport()) {
                    this.setAdapter(new Fabrique.StorageAdapters.LocalStorage());
                }
                else {
                    this.setAdapter(new Fabrique.StorageAdapters.CookieStorage());
                }
            }
            SuperStorage.prototype.setAdapter = function (storageAdapter) {
                this.storage = storageAdapter;
            };
            Object.defineProperty(SuperStorage.prototype, "length", {
                get: function () {
                    if (this.storage === null) {
                        return 0;
                    }
                    return this.storage.length;
                },
                enumerable: true,
                configurable: true
            });
            SuperStorage.prototype.setNamespace = function (namedSpace) {
                if (this.storage !== null) {
                    this.storage.setNamespace(namedSpace);
                }
            };
            SuperStorage.prototype.key = function (n) {
                if (this.storage === null) {
                    return '';
                }
                return this.storage.key(n);
            };
            SuperStorage.prototype.getItem = function (key) {
                if (this.storage === null) {
                    return null;
                }
                return this.storage.getItem(key);
            };
            SuperStorage.prototype.setItem = function (key, value) {
                if (this.storage !== null) {
                    this.storage.setItem(key, value);
                }
            };
            SuperStorage.prototype.removeItem = function (key) {
                if (this.storage !== null) {
                    this.storage.removeItem(key);
                }
            };
            SuperStorage.prototype.clear = function () {
                if (this.storage !== null) {
                    this.storage.clear();
                }
            };
            return SuperStorage;
        })(Phaser.Plugin);
        Plugins.SuperStorage = SuperStorage;
    })(Plugins = Fabrique.Plugins || (Fabrique.Plugins = {}));
})(Fabrique || (Fabrique = {}));
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
//# sourceMappingURL=phaser-super-storage.js.map