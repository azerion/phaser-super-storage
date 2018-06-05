Phaser Super Storage
====================
A cross platform pluggable storage plugin for Phaser.

Key features:
 - Cross browser support
 - Cookie Fallback
 - Support for iframes with helper script
 - Support for custom storage adapters
 
Requirements
 - If you use TypeScript, also include the types for es6-promise in your project

Getting Started
===============
First you want to get a fresh copy of the plugin. You can get it from this repo or from npm, ain't that handy.
```
npm install @orange-games/phaser-super-storage@2.0.0-beta.1 --save-dev
```

After adding the script to the page you can activate it by preloading the plugin and installing it as a global plugin:
```javascript
import PhaserSuperStorage from '@orange-games/phaser-super-storage';

class MyScene extends Phaser.Scene {
    preload: () => {
        //either install or preload
        this.plugins.install(
            'PhaserSuperStorage',   //Plugin unique key
            PhaserSuperStorage,     //The plugin
            true,                   //Auto start
            'storage'               //The scene mapping
        );
    }
    
    create: () => {
        this.storage.setNamespace('my-namespace');
    }
}

```

It's imperitive to install this plugin as global plugin due to how the namespacing of storage key's is handled!

Usage
=====
When you load the plugin, it automatically checks for availability of localStorage and fallbacks to cookies if it's not available.
Both of these are StorageAdapters and will be overwritten if you register a custom StorageAdaper, but more on this later.

When you installed the plugin in your scene you can access it trough this.sys.storage. (Or this.storage if you have added it to your InjectionMap)

```javascript
//Store Tetris at FavoriteGame
this.storage.setItem('FavoriteGame', 'Tetris');

//Get FavoriteGame
let favoriteGame = this.sys.storage.getItem('FavoriteGame');  // Tetris

//Remove FavoriteGame
this.storage.removeItem('FavoriteGame');

//get the length of all items in storage
let l = this.sys.storage.length;    // 1

//Get the name of the key at the n'th position
let keyName = this.storage.key(0); // FavoriteGame

//Clear all keys
this.storage.clear();
```

Namespaces
----------
If you are like us, and put multiple games on the same domain, you might want to add namespaces to your localStorage. Namespaces get prepended to any key value pair you set, and all API calls to the storage object are segeregated by namespaces.
This allows you to set a 'score' key for multiple games on the same domain, and they'll always get their own stored value

```javascript
this.storage.setNamespace('tetris');
this.storage.setItem('score', 250);

this.storage.setNamespace('pong');

//Length also takes namespaces into account
let l = this.storage.length;    // 0

//this won't do because the score was registered under a different namespace
let value = this.storage.get('score'); // null

```

Promises
--------
Both Cookies and localStorage work synchronous, meaning you immediatly get a return value after calling a funtion, e.g; getItem('key');
But when you are using a HTTP service (Amazon Cognito Sync, or custom REST server) or when you are using the iFrameStorage supported by this library, the results are comming back in an asynchronous manner.
In order for you to parse your result nicely phaser-super-storage uses Promises to get you the result.

It is also possible to enable promises on the Cookie and localStorage adapters by setting forcePromises to true.
```javascript
//classical way of getting your item
let item = this.storage.getItem('key');

//Now we are gonna force promises
this.storage.forcePromises = true;
this.storage.getItem('key').then(function (item) {
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

Cordova
-------
You can now also use the CordovaStorage adapter, which uses the NativeStorage plugin of cordova. This prevents the auto-deletion of data on IOS when not having enough memory. If you are using the adapter, please note that passing the namespace in the constructor is not allowed and that it is only testable in a cordova application. It can be enabled by the following command:
```javascript
this.storage.setAdapter(new PhaserSuperStorage.StorageAdapters.CordovaStorage());
```


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
let iframeAdapter = new IframeStorage(
    '',                     //The namespace to store the data under
    document.referrer       //Then url of the parent domain, you need this for security reasons
);

//We call init first to see if the helper script is available, result as a Promise due to asynchronous communication
iframeAdapter.init().then(() => {
    //It succeeded! Now set the iframe adapter as the main storage adapter
    this.storage.setAdapter(iframeAdapter);
}).catch((e) => {
    //failed to start communication with parent, so lets enable promises on the original storage adapter to keep the API the same
    this.storage.forcePromises = true;
});
```

Caveats
=======
Altho we try our best to store data, in some cases you can consider data lost when a user closes his browser or ends his session. I'm talking offcourse about private browsing. Both LocalStorage and Cookies will be cleared, so if you want to keep userdata alive their I suggest you try to get people to login and use a custom StorageAdapter to save the data server sided. Please note that we use the colon as namespace appendix, so we advice you not to use it yourself.   

Disclaimer
==========
We at OrangeGames just love playing and creating awesome games. We aren't affiliated with Phaser.io. We just needed to storage some awesome data in our awesome HTML5 games. Feel free to use it for enhancing your own awesome games!

Phaser Super Storage is distributed under the MIT license. All 3rd party libraries and components are distributed under their
respective license terms.