Phaser Super Storage
====================
A cross platform pluggable storage plugin for Phaser.

Key features:
 - Cross browser support
 - Cookie Fallback
 - Support for iframes with helper script
 - Support for custom storage adapters

Getting Started
===============
First you want to get a fresh copy of the plugin. You can get it from this repo or from npm, ain't that handy.
```
npm install phaser-super-storage --save-dev
```

Next up you'd want to add it to your list of js sources you load into your game
```html
<script src="path/to/phaser-super-storage.min.js"></script>
```

After adding the script to the page you can activate it by enabling the plugin:
```javascript
game.add.plugin(Fabrique.Plugins.SuperStorage);
```

Usage
=====
When you load the plugin, it automatically checks for availability of localStorage and fallbacks to cookies if it's not available.
Both of these are StorageAdapters and will be overwritten if you register a custom StorageAdaper, but more on this later.

The plugin will append the Phaser game object with a storage object, you can reference this object with exactly the same API as localStorage, and should therefor be fairly easy for you to implement.

```javascript
//Store Tetris at FavoriteGame
game.storage.setItem('FavoriteGame', 'Tetris');

//Get FavoriteGame
var favoriteGame = game.storage.getItem('FavoriteGame');  // Tetris

//Remove FavoriteGame
game.storage.removeItem('FavoriteGame');

//get the length of all items in storage
var l = game.storage.length;    // 1

//Get the name of the key at the n'th position
var keyName = game.storage.key(0); // FavoriteGame

//Clear all keys
game.storage.clear();
```

Namespaces
----------
If you are like us, and put multiple games on the same domain, you might want to add namespaces to your localStorage. Namespaces get prepended to any key value pair you set, and all API calls to the storage object are segeregated by namespaces.
This allows you to set a 'score' key for multiple games on the same domain, and they'll always get their own stored value

```javascript
game.storage.setNamespace('tetris');
game.storage.setItem('score', 250);

game.storage.setNamespace('pong');

//Length also takes namespaces into account
var l = game.storage.length;    // 0

//this won't do because the score was registered under a different namespace
var value = game.storage.get('score'); // null

```

Promises
--------
Both Cookies and localStorage work synchronous, meaning you immediatly get a return value after calling a funtion, e.g; getItem('key');
But when you are using a HTTP service (Amazon Cognito Sync, or custom REST server) or when you are using the iFrameStorage supported by this library, the results are comming back in an asynchronous manner.
In order for you to parse your result nicely phaser-super-storage uses Promises to get you the result.

It is also possible to enable promises on the Cookie and localStorage adapters by setting forcePromises to true.
```javascript
//classical way of getting your item
var item = game.storage.getItem('key');

//Now we are gonna force promises
game.storage.forcePromises = true;
game.storage.getItem('key').then(function (item) {
    //do something with the item here
});
```

Adapters
========
The actual Storage of content happens within these so-called StorageAdapters. Basicly a StorageAdapter can store data somewhere, as long as it implements the following interface:
```typescript
 interface IStorage {
    //Promises or no Promises
    forcePromises: boolean;

    //The amount of items in the storage
    length: number;

    //The namespace for the current storge
    namespace:string;

    //Get an item from the storage
    getItem(key: string): any | Promise<any>;

    //remove an item from the localStorage
    removeItem(key: string): any | Promise<any>;

    //Set an item in the storage
    setItem(key: string, value:any): void | Promise<void>;

    //Get the n'th key
    key(n: number): any | Promise<any>;

    //empty the (namespaced) storage
    clear(): void | Promise<void>;

    setNamespace(namespace: string): void | Promise<void>;
}
```

Local & Cookie Storage
----------------------
The default usage of phaser-super-storage require the LocalStorage and CookieStorage adapter. It will always try to use the LocalStorage Adapater, but when all fails it falls back to Cookie sotrage, no configuration needed!

Iframe
------
We publish our games on HTML5 game portals trough the usage of iFrames, a downside of this is that for iOS both localStorage and Cookies aren't persisted for iframes. In order to counter this we included an IframeStorage adapter that should be set in the game, than the helper script included in the build folder should be loaded in the parent frame.
This way we'll utilize the storage capacity of the parent frame to store our data

```html
<!--So in the parent frame we include the following: -->
<script src="http://cdn.fbrq.io/phaser-super-storage/phaser-storage-helper.min.js" type="text/javascript"></script>
```

```javascript
//Then in our game we add the iframe adapter
var iframeAdapter = new IframeStorage(
    '',                     //The namespace to store the data under
    document.referrer       //Then url of the parent domain, you need this for security reasons
);

//We call init first to see if the helper script is available, result as a Promise due to asynchronous communication
iframeAdapter.init().then(function() {
    //It succeeded! Now set the iframe adapter as the main storage adapter
    game.storage.setAdapter(iframeAdapter);
}).catch(function (e) {
    //failed to start communication with parent, so lets enable promises on the original storage adapter to keep the API the same
    game.storage.forcePromises = true;
});
```

Caveats
=======
Altho we try our best to store data, in some cases you can consider data lost when a user closes his browser or ends his session. I'm talking offcourse about private browsing. Both LocalStorage and Cookies will be cleared, so if you want to keep userdata alive their I suggest you try to get people to login and use a custom StorageAdapter to save the data server sided.

Disclaimer
==========
We at OrangeGames just love playing and creating awesome games. We aren't affiliated with Phaser.io. We just needed to storage some awesome data in our awesome HTML5 games. Feel free to use it for enhancing your own awesome games!

Phaser Super Storage is distributed under the MIT license. All 3rd party libraries and components are distributed under their
respective license terms.