/*!
 * phaser-super-storage - version 1.0.3 
 * A cross platform storage plugin for Phaser
 *
 * OrangeGames
 * Build at 20-07-2017
 * Released under MIT License 
 */

var PhaserSuperStorage;
(function (PhaserSuperStorage) {
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
    })(StorageAdapters = PhaserSuperStorage.StorageAdapters || (PhaserSuperStorage.StorageAdapters = {}));
})(PhaserSuperStorage || (PhaserSuperStorage = {}));
var PhaserSuperStorage;
(function (PhaserSuperStorage) {
    var StorageAdapters;
    (function (StorageAdapters) {
        /**
         * Storage driver for browser's localStorage
         */
        var CordovaStorage = (function () {
            // Due to async /w promise it is not possible to pass namespace in constructor
            function CordovaStorage() {
                this.namespace = '';
                this.keys = [];
            }
            Object.defineProperty(CordovaStorage.prototype, "forcePromises", {
                get: function () {
                    return true;
                },
                set: function (v) {
                    //Do nothing
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(CordovaStorage.prototype, "length", {
                get: function () {
                    return this.keys.length;
                },
                enumerable: true,
                configurable: true
            });
            CordovaStorage.prototype.key = function (n) {
                return this.promisefy(this.keys[n]);
            };
            CordovaStorage.prototype.getItem = function (key) {
                var _this = this;
                return new Promise(function (resolve, reject) {
                    NativeStorage.getItem(_this.namespace + key, function (value) {
                        resolve(value);
                    }, function (error) {
                        if (error.code === 2) {
                            resolve(null);
                        }
                        else {
                            reject(error);
                        }
                    });
                });
            };
            CordovaStorage.prototype.setItem = function (key, value) {
                var _this = this;
                if (key.length < 1) {
                    console.error('CordovaStorage: Key cannot be an empty string!');
                    return;
                }
                return new Promise(function (resolve, reject) {
                    NativeStorage.setItem(_this.namespace + key, value, function () {
                        if (_this.keys.indexOf(key) < 0) {
                            _this.keys.push(key);
                            _this.save();
                        }
                        resolve(null);
                    }, function (error) {
                        reject(error);
                    });
                });
            };
            CordovaStorage.prototype.removeItem = function (key) {
                var _this = this;
                return new Promise(function (resolve, reject) {
                    NativeStorage.remove(_this.namespace + ':' + key, function () {
                        var id = _this.keys.indexOf(key);
                        if (id >= 0) {
                            _this.keys.splice(id, 1);
                            _this.save();
                        }
                        resolve(null);
                    }, function (error) {
                        reject(error);
                    });
                });
            };
            CordovaStorage.prototype.clear = function () {
                var _this = this;
                return new Promise(function (resolve, reject) {
                    var counter = 0;
                    for (var i = 0; i < _this.keys.length; i++) {
                        NativeStorage.remove(_this.namespace + ':' + _this.keys[i], function () {
                            if (++counter >= _this.keys.length) {
                                _this.keys = [];
                                _this.save();
                                resolve(null);
                            }
                        }, function (error) {
                            reject(error);
                        });
                    }
                });
            };
            CordovaStorage.prototype.setNamespace = function (spacedName) {
                var _this = this;
                if (spacedName === void 0) { spacedName = ''; }
                this.namespace = spacedName + ':';
                this.keys = [];
                return new Promise(function (resolve, reject) {
                    _this.load().then(resolve).catch(resolve);
                });
            };
            CordovaStorage.prototype.promisefy = function (value) {
                return new Promise(function (resolve, reject) {
                    resolve(value);
                });
            };
            CordovaStorage.prototype.load = function () {
                var _this = this;
                return new Promise(function (resolve, reject) {
                    NativeStorage.getItem(_this.namespace, function (value) {
                        _this.keys = JSON.parse(value);
                        resolve(null);
                    }, function (error) {
                        reject(error);
                    });
                });
            };
            CordovaStorage.prototype.save = function () {
                NativeStorage.setItem(this.namespace, JSON.stringify(this.keys), function () {
                    return;
                }, function (error) {
                    console.warn('CordovaStorage: Failed to save keys of namespace.');
                });
            };
            return CordovaStorage;
        }());
        StorageAdapters.CordovaStorage = CordovaStorage;
    })(StorageAdapters = PhaserSuperStorage.StorageAdapters || (PhaserSuperStorage.StorageAdapters = {}));
})(PhaserSuperStorage || (PhaserSuperStorage = {}));
var PhaserSuperStorage;
(function (PhaserSuperStorage) {
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
                    command: PhaserSuperStorage.StorageCommand.init
                }).then(function () {
                    _this.enabled = true;
                });
            };
            IframeStorage.prototype.key = function (n) {
                return this.sendMessage({
                    command: PhaserSuperStorage.StorageCommand.key,
                    value: n
                });
            };
            IframeStorage.prototype.getItem = function (key) {
                return this.sendMessage({
                    command: PhaserSuperStorage.StorageCommand.getItem,
                    key: key
                });
            };
            IframeStorage.prototype.setItem = function (key, value) {
                return this.sendMessage({
                    command: PhaserSuperStorage.StorageCommand.setItem,
                    key: key,
                    value: value
                });
            };
            IframeStorage.prototype.removeItem = function (key) {
                return this.sendMessage({
                    command: PhaserSuperStorage.StorageCommand.removeItem,
                    key: key
                });
            };
            IframeStorage.prototype.clear = function () {
                return this.sendMessage({
                    command: PhaserSuperStorage.StorageCommand.clear
                });
            };
            IframeStorage.prototype.setNamespace = function (spacedName) {
                return this.sendMessage({
                    command: PhaserSuperStorage.StorageCommand.setNamespace,
                    value: spacedName
                });
            };
            IframeStorage.prototype.sendMessage = function (message) {
                var _this = this;
                var returnedResult;
                if (message.command === PhaserSuperStorage.StorageCommand.init) {
                    returnedResult = false;
                }
                var messageChannel = new MessageChannel();
                return new Promise(function (resolve, reject) {
                    if (!_this.enabled && message.command !== PhaserSuperStorage.StorageCommand.init) {
                        reject('Messaging not enabled!');
                    }
                    if (message.command === PhaserSuperStorage.StorageCommand.init) {
                        //small timeout to see if stuff is enabled
                        setTimeout(function () {
                            if (!returnedResult) {
                                reject('Unable to get a response in time');
                            }
                        }, 1000);
                    }
                    messageChannel.port1.onmessage = function (event) {
                        console.log('Frame received message', event);
                        var receivedMessage = PhaserSuperStorage.StorageUtils.validateMessage(event.data);
                        if (receivedMessage.command === PhaserSuperStorage.StorageCommand.init) {
                            returnedResult = true;
                        }
                        if (receivedMessage.status === undefined || receivedMessage.status !== 'ok') {
                            reject(receivedMessage.value);
                        }
                        if (receivedMessage.length !== undefined) {
                            _this.storageLength = receivedMessage.length;
                        }
                        switch (receivedMessage.command) {
                            case PhaserSuperStorage.StorageCommand.setNamespace:
                                _this.namespace = receivedMessage.value + ':';
                            case PhaserSuperStorage.StorageCommand.getItem:
                            case PhaserSuperStorage.StorageCommand.length:
                            case PhaserSuperStorage.StorageCommand.key:
                                resolve(receivedMessage.value);
                                break;
                            case PhaserSuperStorage.StorageCommand.setItem:
                            case PhaserSuperStorage.StorageCommand.removeItem:
                            case PhaserSuperStorage.StorageCommand.clear:
                            case PhaserSuperStorage.StorageCommand.init:
                                resolve(receivedMessage.status);
                                break;
                            default:
                                reject(receivedMessage.value);
                                break;
                        }
                    };
                    if (_this.enabled || message.command === PhaserSuperStorage.StorageCommand.init) {
                        console.log('Sending message to parent: ', message);
                        window.parent.postMessage(message, _this.expectedOrigin, [messageChannel.port2]);
                    }
                });
            };
            return IframeStorage;
        }());
        StorageAdapters.IframeStorage = IframeStorage;
    })(StorageAdapters = PhaserSuperStorage.StorageAdapters || (PhaserSuperStorage.StorageAdapters = {}));
})(PhaserSuperStorage || (PhaserSuperStorage = {}));
var PhaserSuperStorage;
(function (PhaserSuperStorage) {
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
                    return PhaserSuperStorage.StorageUtils.nameSpaceKeyFilter(keys, this.namespace).length;
                },
                enumerable: true,
                configurable: true
            });
            LocalStorage.prototype.key = function (n) {
                return this.forcePromises ?
                    this.promisefy(this._key, arguments) :
                    this._key(n);
            };
            LocalStorage.prototype._key = function (n) {
                var keys = Object.keys(localStorage);
                var spacedKeys = PhaserSuperStorage.StorageUtils.nameSpaceKeyFilter(keys, this.namespace);
                var item = localStorage.getItem(spacedKeys[n]);
                return item;
            };
            LocalStorage.prototype.getItem = function (key) {
                return this.forcePromises ?
                    this.promisefy(this._getItem, arguments) :
                    this._getItem(key);
            };
            LocalStorage.prototype._getItem = function (key) {
                return localStorage.getItem(this.namespace + key);
            };
            LocalStorage.prototype.setItem = function (key, value) {
                return this.forcePromises ?
                    this.promisefy(this._setItem, arguments) :
                    this._setItem(key, value);
            };
            LocalStorage.prototype._setItem = function (key, value) {
                return localStorage.setItem(this.namespace + key, value);
            };
            LocalStorage.prototype.removeItem = function (key) {
                return this.forcePromises ?
                    this.promisefy(this._removeItem, arguments) :
                    this._removeItem(key);
            };
            LocalStorage.prototype._removeItem = function (key) {
                return localStorage.removeItem(this.namespace + key);
            };
            LocalStorage.prototype.clear = function () {
                return this.forcePromises ?
                    this.promisefy(this._clear, arguments) :
                    this._clear();
            };
            LocalStorage.prototype._clear = function () {
                var keys = Object.keys(localStorage);
                var spacedKeys = PhaserSuperStorage.StorageUtils.nameSpaceKeyFilter(keys, this.namespace);
                for (var i = 0; i < spacedKeys.length; i++) {
                    localStorage.removeItem(spacedKeys[i]);
                }
                return;
            };
            LocalStorage.prototype.setNamespace = function (spacedName) {
                return this.forcePromises ?
                    this.promisefy(this._setNameSpace, arguments) :
                    this._setNameSpace(spacedName);
            };
            LocalStorage.prototype._setNameSpace = function (spacedName) {
                if (spacedName) {
                    this.namespace = spacedName + ':';
                }
            };
            LocalStorage.prototype.promisefy = function (value, args) {
                var _this = this;
                return new Promise(function (resolve, reject) {
                    resolve(value.apply(_this, args));
                });
            };
            return LocalStorage;
        }());
        StorageAdapters.LocalStorage = LocalStorage;
    })(StorageAdapters = PhaserSuperStorage.StorageAdapters || (PhaserSuperStorage.StorageAdapters = {}));
})(PhaserSuperStorage || (PhaserSuperStorage = {}));
var PhaserSuperStorage;
(function (PhaserSuperStorage) {
    var StoragePlugin = (function () {
        function StoragePlugin(game) {
            if (undefined !== game) {
                Object.defineProperty(game, 'storage', {
                    value: this
                });
            }
            else {
                if (StoragePlugin.instance === null) {
                    StoragePlugin.instance = this;
                }
                else {
                    return StoragePlugin.instance;
                }
            }
            if (PhaserSuperStorage.StorageUtils.isLocalStorageSupport()) {
                this.setAdapter(new PhaserSuperStorage.StorageAdapters.LocalStorage());
            }
            else {
                this.setAdapter(new PhaserSuperStorage.StorageAdapters.CookieStorage());
            }
        }
        StoragePlugin.prototype.setAdapter = function (storageAdapter) {
            this.storage = storageAdapter;
        };
        Object.defineProperty(StoragePlugin.prototype, "forcePromises", {
            get: function () {
                return this.storage.forcePromises;
            },
            set: function (forceIt) {
                this.storage.forcePromises = forceIt;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(StoragePlugin.prototype, "length", {
            get: function () {
                if (this.storage === null) {
                    return 0;
                }
                return this.storage.length;
            },
            enumerable: true,
            configurable: true
        });
        StoragePlugin.prototype.setNamespace = function (namedSpace) {
            if (this.storage !== null) {
                return this.storage.setNamespace(namedSpace);
            }
        };
        StoragePlugin.prototype.key = function (n) {
            if (this.storage === null) {
                return '';
            }
            return this.storage.key(n);
        };
        StoragePlugin.prototype.getItem = function (key) {
            if (this.storage === null) {
                return null;
            }
            return this.storage.getItem(key);
        };
        StoragePlugin.prototype.setItem = function (key, value) {
            if (this.storage !== null) {
                return this.storage.setItem(key, value);
            }
        };
        StoragePlugin.prototype.removeItem = function (key) {
            if (this.storage !== null) {
                return this.storage.removeItem(key);
            }
        };
        StoragePlugin.prototype.clear = function () {
            if (this.storage !== null) {
                return this.storage.clear();
            }
        };
        StoragePlugin.instance = null;
        return StoragePlugin;
    }());
    PhaserSuperStorage.StoragePlugin = StoragePlugin;
})(PhaserSuperStorage || (PhaserSuperStorage = {}));
if (window.Phaser !== undefined) {
    Phaser.Utils.mixinPrototype(PhaserSuperStorage.StoragePlugin, Phaser.Plugin);
}
var PhaserSuperStorage;
(function (PhaserSuperStorage) {
    (function (StorageCommand) {
        StorageCommand[StorageCommand["init"] = 0] = "init";
        StorageCommand[StorageCommand["setItem"] = 1] = "setItem";
        StorageCommand[StorageCommand["getItem"] = 2] = "getItem";
        StorageCommand[StorageCommand["removeItem"] = 3] = "removeItem";
        StorageCommand[StorageCommand["clear"] = 4] = "clear";
        StorageCommand[StorageCommand["setNamespace"] = 5] = "setNamespace";
        StorageCommand[StorageCommand["length"] = 6] = "length";
        StorageCommand[StorageCommand["key"] = 7] = "key";
        StorageCommand[StorageCommand["error"] = 8] = "error";
    })(PhaserSuperStorage.StorageCommand || (PhaserSuperStorage.StorageCommand = {}));
    var StorageCommand = PhaserSuperStorage.StorageCommand;
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
    PhaserSuperStorage.StorageUtils = StorageUtils;
})(PhaserSuperStorage || (PhaserSuperStorage = {}));
//# sourceMappingURL=phaser-super-storage.js.map