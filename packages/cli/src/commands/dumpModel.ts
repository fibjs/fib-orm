import fs = require('fs');
import path = require('path');
import { wrapSubcommand } from '@fibcli/make-cli';

import ORM = require('@fxjs/orm');
import { Sync } from '@fxjs/sql-ddl-sync';
import Diff = require('diff');

import { getTableDDLs, IModelProperties, IRawColumns } from '../helpers/ddl';

type IModelFunc = (ORM: typeof import('@fxjs/orm')) => {
    orm: import('@fxjs/orm/typings/ORM').ORMInstance
};

function alphaBetKeySort<T extends object>(obj: T) {
    if (!obj) return obj;
    return Object.keys(obj).sort().reduce((acc, key) => {
        // @ts-ignore
        acc[key] = obj[key];
        return acc;
    }, {} as T);
}

export default wrapSubcommand({
    name: 'dumpModel',

    inputs: {
        required: '<modelFile>',
        optional: [
            '[modelFile]'
        ]
    },

    examples: [],

    options: {
        '-O, --out [outPath]': 'path to output json file',
        '--sync': 'sync user definition to database',
        '--no-alphabet': 'sort properties alphabetically on patch',
    },

    description: `read columns information from database, and generate ddl file`,

    onAction: ([modelFile], options) => {
        modelFile = path.resolve(process.cwd(), modelFile);
        const jsonDiffName = path.basename(modelFile, '.js') + '-dump.json';
        const diffOutDir = path.dirname(modelFile);
        const diffOutput = path.resolve(diffOutDir, jsonDiffName);
        
        if (!fs.exists(modelFile)) {
            throw new Error(`[dumpModel] model file not found: ${modelFile}`);
        }

        let modelFunc = require(modelFile);
        if (typeof modelFunc !== 'function') {
            if (typeof modelFunc.default === 'function')
                modelFunc = modelFunc.default;
        }
        if (typeof modelFunc !== 'function') {
            throw new Error(`[dumpModel] model function not found, it's typeof ${typeof modelFunc}`);
        }

        const { orm } = (modelFunc as IModelFunc)(ORM);

        if (options.sync) {
            orm.syncSync();
        }
        console.notice('[feat] options', options);

        const sync = new Sync({ dbdriver: orm.driver.sqlDriver });
        const modelReports: Record<string, {
            userDefinedProperties: IModelProperties,
            dataStoreProperties: IModelProperties
            dataStoreRaw: IRawColumns
            propritiesDiff: {
                name: string,
                mapsTo: string,
                changes: any[] | null,
                patch: string
            }[]
        }> = {}
        const modelByTable: typeof orm.models = {}
        for (let k in orm.models) {
            const model = orm.models[k];
            modelByTable[model.table] = model;
        }

        getTableDDLs(sync, {
            afterGetTableDDL: (ddl) => {
                const userDefinedProperties = modelByTable[ddl.collection]?.allProperties || {};
                const dataStoreProperties = ddl.properties;

                const tPatchBaseName = `properties-for-t-[${ddl.collection}]`;
                const tablePatchFile = path.resolve(diffOutDir, `./${tPatchBaseName}.patch`);

                const propritiesDiff = Object.entries(dataStoreProperties).reduce((accu, [mapsTo, prop]) => {
                    let udP = userDefinedProperties[mapsTo] || null;
                    if (options.alphabet) {
                        udP = alphaBetKeySort(udP);
                        userDefinedProperties[mapsTo] = udP;

                        prop = alphaBetKeySort(prop);
                        dataStoreProperties[mapsTo] = prop;
                    }
                    
                    const changes = Diff.diffJson(udP, prop);
                    const patchBaseName = `${tPatchBaseName}-p-${mapsTo}`;
                    const patch = Diff.createTwoFilesPatch(
                        `${patchBaseName}-from-database.json`,
                        `${patchBaseName}-user-defined.json`,
                        JSON.stringify(prop, null, 2),
                        JSON.stringify(udP, null, 2),
                    );

                    accu.push({
                        name: mapsTo,
                        mapsTo,
                        changes,
                        patch
                    });

                    return accu
                }, [])

                const patch = Diff.createTwoFilesPatch(
                    `${tPatchBaseName}-from-database.json`,
                    `${tPatchBaseName}-user-defined.json`,
                    JSON.stringify(dataStoreProperties, null, 2),
                    JSON.stringify(userDefinedProperties, null, 2),
                );
                fs.writeFile(tablePatchFile, patch as any);

                modelReports[ddl.collection] = {
                    propritiesDiff,
                    userDefinedProperties,
                    dataStoreProperties,
                    dataStoreRaw: ddl.rawColumns,
                }
            }
        });

        const dumpObj = {
            connection: sync.dbdriver.uri,
            driverType: sync.dbdriver.type,
            modelReports,
        }

        console.notice(`[dumpModel] try to write to ${diffOutput}...`);
        fs.mkdir(path.dirname(diffOutput), { recursive: true });
        fs.writeFile(diffOutput, JSON.stringify(dumpObj, null, 2) as any);
        console.notice(`[dumpModel] write json to ${diffOutput} success!`);
    }
});