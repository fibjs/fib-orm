import * as ORM from '@src';
import { expectType } from 'ts-expect';

const UserDef = ORM.defineModel((orm) => {
    const User = orm.models.users;
    const Article = orm.define('article', {
        name: String,
        content: { type: 'text' }
    }, {
        methods: {
            getName() {
                return this.name;
            },
            getContent() {
                return this.content;
            }
        },
        hooks: {
        }
    });

    User.hasOne('article', Article, {
        hooks: {
            beforeSet({ $refs }) {
                expectType<ORM.FxOrmInstance.Instance>($refs.instance);
                expectType<ORM.FxOrmInstance.Instance>($refs.association);
            },
            afterSet({ $refs }) {
                expectType<ORM.FxOrmInstance.Instance>($refs.instance);
                expectType<ORM.FxOrmInstance.Instance>($refs.association);
            },
            beforeRemove({ $refs }) {
                expectType<Record<string, any>>($refs.removeConditions);
            },
            afterRemove({ $refs }) {
                expectType<Record<string, any>>($refs.removeConditions);
            },
        }
    });

    User.extendsTo('last_article', Article, {
        hooks: {
            beforeRemove({ $refs }) {
                expectType<any[]>($refs.association_ids);
            },
        }
    });

    User.hasMany('articles', Article, {}, {
        hooks: {
            beforeAdd({ $refs }) {
                expectType<ORM.FxOrmInstance.Instance>($refs.instance);
                expectType<ORM.FxOrmInstance.Instance>($refs.association);
            },
            afterAdd({ $refs }) {
                expectType<ORM.FxOrmInstance.Instance>($refs.instance);
                expectType<ORM.FxOrmInstance.Instance>($refs.association);
            },
            beforeRemove({ $refs }) {
                expectType<any[]>($refs.association_ids);
                expectType<ORM.FxOrmInstance.Instance[]>($refs.associations);
                expectType<Record<string, any>>($refs.removeConditions);
            },
            afterRemove({ $refs }) {
                expectType<any[]>($refs.association_ids);
                expectType<ORM.FxOrmInstance.Instance[]>($refs.associations);
                expectType<Record<string, any>>($refs.removeConditions);
            },
        }
    });

    return { Article };
});

export default UserDef;

type Defs = ReturnType<typeof UserDef>;

declare module '@fxjs/orm' {
    export namespace FxOrmNS {
        export interface GlobalModels {
            article: Defs['Article'];
        }
    }
}