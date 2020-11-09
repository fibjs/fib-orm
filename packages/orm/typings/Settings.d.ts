import { FxOrmSettings } from './Typo/settings';
export declare const defaults: () => {
    model: {
        namePrefix: string;
        repair_column: boolean;
        /**
         * @dangerous
         */
        allow_drop_column: boolean;
    };
    properties: {
        primary_key: string;
        association_key: string;
        required: boolean;
    };
    instance: {
        defaultFindLimit: number;
        defaultCacheSize: number;
        identityCache: boolean;
        identityCacheSaveCheck: boolean;
        autoSave: boolean;
        autoFetch: boolean;
        autoFetchLimit: number;
        cascadeRemove: boolean;
        returnAllErrors: boolean;
        saveAssociationsByDefault: boolean;
    };
    hasOne: {};
    hasMany: {
        key: boolean;
    };
    extendsTo: {
        throwWhenNotFound: boolean;
    };
    connection: {
        reconnect: boolean;
        pool: boolean;
        debug: boolean;
    };
};
export declare function Container(settings: object): FxOrmSettings.SettingInstance;
