/*!
 * phaser-super-storage - version 0.0.1 
 * A cross platform storage plugin for Phaser
 *
 * OrangeGames
 * Build at 22-07-2016
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
            function CookieStorage(ns) {
                this.keys = [];
                this.namespace = '';
                this.setNamespace(ns);
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
            CookieStorage.prototype.deleteItem = function (key) {
                document.cookie = encodeURIComponent(this.namespace + key) + "=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/";
            };
            CookieStorage.prototype.empty = function () {
                var cookies = this.getCookiesForNameSpace();
                for (var key in cookies) {
                    this.deleteItem(key);
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
        var SuperStorage = Fabrique.Plugins.SuperStorage;
        /**
         * Storage driver for browser's localStorage
         */
        var LocalStorage = (function () {
            function LocalStorage(spacedName) {
                this.namespace = '';
                this.setNamespace(spacedName);
            }
            Object.defineProperty(LocalStorage.prototype, "length", {
                get: function () {
                    var keys = Object.keys(localStorage);
                    return SuperStorage.nameSpaceKeyFilter(keys, this.namespace).length;
                },
                enumerable: true,
                configurable: true
            });
            LocalStorage.prototype.key = function (n) {
                var keys = Object.keys(localStorage);
                var spacedKeys = SuperStorage.nameSpaceKeyFilter(keys, this.namespace);
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
                var spacedKeys = SuperStorage.nameSpaceKeyFilter(keys, this.namespace);
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
                try {
                    if (typeof localStorage === 'object') {
                        localStorage.setItem('testingLocalStorage', 'foo');
                        localStorage.removeItem('testingLocalStorage');
                        this.storage = new Fabrique.StorageAdapters.LocalStorage('Quartz');
                    }
                    else {
                        this.storage = new Fabrique.StorageAdapters.CookieStorage('Quartz');
                    }
                }
                catch (e) {
                    this.storage = new Fabrique.StorageAdapters.CookieStorage('Quartz');
                }
            }
            SuperStorage.nameSpaceKeyFilter = function (keys, namespace) {
                return keys.filter(function (keyName) {
                    return (keyName.substring(0, namespace.length) === namespace);
                });
            };
            SuperStorage.prototype.setAdapter = function (storageAdapter) {
                this.storage = storageAdapter;
            };
            Object.defineProperty(SuperStorage.prototype, "length", {
                get: function () {
                    return 0;
                },
                enumerable: true,
                configurable: true
            });
            SuperStorage.prototype.setNamespace = function (namespace) {
            };
            SuperStorage.prototype.key = function (n) {
                return '';
            };
            SuperStorage.prototype.getItem = function () {
            };
            SuperStorage.prototype.setItem = function () {
            };
            SuperStorage.prototype.removeItem = function () {
            };
            SuperStorage.prototype.clear = function () {
            };
            return SuperStorage;
        })(Phaser.Plugin);
        Plugins.SuperStorage = SuperStorage;
    })(Plugins = Fabrique.Plugins || (Fabrique.Plugins = {}));
})(Fabrique || (Fabrique = {}));
//# sourceMappingURL=phaser-super-storage.js.map