///  <reference path="../node_modules/phaser/typescript/pixi.d.ts" />
///  <reference path="../node_modules/phaser/typescript/phaser.d.ts" />

interface NativeStorage {
    getItem(key: string, onSucceed: (value: string) => void, onError: (error: any) => void): void;
    setItem(key: string, value: string, onSucceed: (value: string) => void, onError: (error: any) => void): void;
    remove(key: string, onSucceed: (value: string) => void, onError: (error: any) => void): void;
}

declare var NativeStorage: NativeStorage;
