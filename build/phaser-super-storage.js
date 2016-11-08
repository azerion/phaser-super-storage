/*!
 * phaser-super-storage - version 0.1.0 
 * A cross platform storage plugin for Phaser
 *
 * OrangeGames
 * Build at 08-11-2016
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
                this.namespace = '';
                this.forcePromises = false;
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
                var result = this.getCookiesForNameSpace()[key] || null;
                if (this.forcePromises) {
                    return this.promisefy(result);
                }
                return result;
            };
            CookieStorage.prototype.getItem = function (key) {
                var result = this.getCookiesForNameSpace()[key] || null;
                if (this.forcePromises) {
                    return this.promisefy(result);
                }
                return result;
            };
            CookieStorage.prototype.setItem = function (key, value) {
                document.cookie = encodeURIComponent(this.namespace + key) + '=' + encodeURIComponent(value) + '; expires=Tue, 19 Jan 2038 03:14:07 GMT; path=/';
                if (this.forcePromises) {
                    return this.promisefy(null);
                }
            };
            CookieStorage.prototype.removeItem = function (key) {
                document.cookie = encodeURIComponent(this.namespace + key) + '=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/';
                if (this.forcePromises) {
                    return this.promisefy(null);
                }
            };
            CookieStorage.prototype.clear = function () {
                var cookies = this.getCookiesForNameSpace();
                for (var key in cookies) {
                    if (cookies.hasOwnProperty(key)) {
                        this.removeItem(key);
                    }
                }
                if (this.forcePromises) {
                    return this.promisefy(null);
                }
            };
            CookieStorage.prototype.setNamespace = function (namespace) {
                if (namespace) {
                    this.namespace = namespace + ':';
                    this.reg = new RegExp('^' + this.namespace + '[a-zA-Z0-9]*', 'g');
                }
                if (this.forcePromises) {
                    return this.promisefy(namespace);
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
            CookieStorage.prototype.promisefy = function (value) {
                return new Promise(function (resolve, reject) {
                    resolve(value);
                });
            };
            return CookieStorage;
        }());
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
            function IframeStorage(spacedName, expectedOrigin) {
                if (spacedName === void 0) { spacedName = ''; }
                if (expectedOrigin === void 0) { expectedOrigin = '*'; }
                this.namespace = '';
                this.expectedOrigin = '';
                this.storageLength = 0;
                this.enabled = false;
                if (spacedName !== '') {
                    this.setNamespace(spacedName);
                }
                this.expectedOrigin = expectedOrigin;
            }
            Object.defineProperty(IframeStorage.prototype, "forcePromises", {
                get: function () {
                    return true;
                },
                set: function (v) {
                    //Do nothing
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(IframeStorage.prototype, "length", {
                get: function () {
                    return this.storageLength;
                },
                enumerable: true,
                configurable: true
            });
            IframeStorage.prototype.init = function () {
                var _this = this;
                return this.sendMessage({
                    command: Fabrique.StorageCommand.init
                }).then(function () {
                    _this.enabled = true;
                });
            };
            IframeStorage.prototype.key = function (n) {
                return this.sendMessage({
                    command: Fabrique.StorageCommand.key,
                    value: n
                });
            };
            IframeStorage.prototype.getItem = function (key) {
                return this.sendMessage({
                    command: Fabrique.StorageCommand.getItem,
                    key: key
                });
            };
            IframeStorage.prototype.setItem = function (key, value) {
                return this.sendMessage({
                    command: Fabrique.StorageCommand.setItem,
                    key: key,
                    value: value
                });
            };
            IframeStorage.prototype.removeItem = function (key) {
                return this.sendMessage({
                    command: Fabrique.StorageCommand.removeItem,
                    key: key
                });
            };
            IframeStorage.prototype.clear = function () {
                return this.sendMessage({
                    command: Fabrique.StorageCommand.clear
                });
            };
            IframeStorage.prototype.setNamespace = function (spacedName) {
                return this.sendMessage({
                    command: Fabrique.StorageCommand.setNamespace,
                    value: spacedName
                });
            };
            IframeStorage.prototype.sendMessage = function (message) {
                var _this = this;
                var returnedResult;
                if (message.command === Fabrique.StorageCommand.init) {
                    returnedResult = false;
                }
                var messageChannel = new MessageChannel();
                return new Promise(function (resolve, reject) {
                    if (!_this.enabled && message.command !== Fabrique.StorageCommand.init) {
                        reject('Messaging not enabled!');
                    }
                    if (message.command === Fabrique.StorageCommand.init) {
                        //small timeout to see if stuff is enabled
                        setTimeout(function () {
                            if (!returnedResult) {
                                reject('Unable to get a response in time');
                            }
                        }, 1000);
                    }
                    messageChannel.port1.onmessage = function (event) {
                        console.log('Frame received message', event);
                        var receivedMessage = Fabrique.StorageUtils.validateMessage(event.data);
                        if (receivedMessage.command === Fabrique.StorageCommand.init) {
                            returnedResult = true;
                        }
                        if (receivedMessage.status === undefined || receivedMessage.status !== 'ok') {
                            reject(receivedMessage.value);
                        }
                        if (receivedMessage.length !== undefined) {
                            _this.storageLength = receivedMessage.length;
                        }
                        switch (receivedMessage.command) {
                            case Fabrique.StorageCommand.setNamespace:
                                _this.namespace = receivedMessage.value + ':';
                            case Fabrique.StorageCommand.getItem:
                            case Fabrique.StorageCommand.length:
                            case Fabrique.StorageCommand.key:
                                resolve(receivedMessage.value);
                                break;
                            case Fabrique.StorageCommand.setItem:
                            case Fabrique.StorageCommand.removeItem:
                            case Fabrique.StorageCommand.clear:
                            case Fabrique.StorageCommand.init:
                                resolve(receivedMessage.status);
                                break;
                            default:
                                reject(receivedMessage.value);
                                break;
                        }
                    };
                    if (_this.enabled || message.command === Fabrique.StorageCommand.init) {
                        console.log('Sending message to parent: ', message);
                        window.parent.postMessage(message, _this.expectedOrigin, [messageChannel.port2]);
                    }
                });
            };
            return IframeStorage;
        }());
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
var Fabrique;
(function (Fabrique) {
    var Plugins;
    (function (Plugins) {
        var SuperStorage = (function () {
            function SuperStorage(game) {
                if (undefined !== game) {
                    Object.defineProperty(game, 'storage', {
                        value: this
                    });
                }
                else {
                    if (SuperStorage.instance === null) {
                        SuperStorage.instance = this;
                    }
                    else {
                        return SuperStorage.instance;
                    }
                }
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
            Object.defineProperty(SuperStorage.prototype, "forcePromises", {
                get: function () {
                    return this.storage.forcePromises;
                },
                set: function (forceIt) {
                    this.storage.forcePromises = forceIt;
                },
                enumerable: true,
                configurable: true
            });
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
                    return this.storage.setNamespace(namedSpace);
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
                    return this.storage.setItem(key, value);
                }
            };
            SuperStorage.prototype.removeItem = function (key) {
                if (this.storage !== null) {
                    return this.storage.removeItem(key);
                }
            };
            SuperStorage.prototype.clear = function () {
                if (this.storage !== null) {
                    return this.storage.clear();
                }
            };
            SuperStorage.instance = null;
            return SuperStorage;
        }());
        Plugins.SuperStorage = SuperStorage;
    })(Plugins = Fabrique.Plugins || (Fabrique.Plugins = {}));
})(Fabrique || (Fabrique = {}));
if (window.Phaser !== undefined) {
    Phaser.Utils.mixinPrototype(Fabrique.Plugins.SuperStorage, Phaser.Plugin);
}
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
//# sourceMappingURL=phaser-super-storage.js.map