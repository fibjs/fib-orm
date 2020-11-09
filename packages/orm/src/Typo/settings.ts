export namespace FxOrmSettings {
    export interface SettingInstance {
        set(key: string, value: any): SettingInstance
        get(key: string, def?: Function): any
        unset(): SettingInstance
    }

    declare class Settings {
        constructor(settings: any);
        
        static Container: any;

        static defaults(): {
            properties: {
                primary_key: string;
                association_key: string;
                required: boolean;
            };

            instance: {
                identityCache: boolean;
                identityCacheSaveCheck: boolean;
                autoSave: boolean;
                autoFetch: boolean;
                autoFetchLimit: number;
                cascadeRemove: boolean;
                returnAllErrors: boolean;
            };

            connection: {
                reconnect: boolean;
                poll: boolean;
                debug: boolean;
            };
        };
    }

    export type ISettings = Settings;

    export var settings: SettingInstance;

}