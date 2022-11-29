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
            beforeSet({ $ref }) {
                expectType<ORM.FxOrmInstance.Instance>($ref.instance);
                expectType<ORM.FxOrmInstance.Instance>($ref.association);
            },
            afterSet({ $ref }) {
                expectType<ORM.FxOrmInstance.Instance>($ref.instance);
                expectType<ORM.FxOrmInstance.Instance>($ref.association);
            },
            beforeRemove({ $ref }) {
                expectType<Record<string, any>>($ref.removeConditions);
            },
            afterRemove({ $ref }) {
                expectType<Record<string, any>>($ref.removeConditions);
            },
        }
    });

    User.extendsTo('last_article', Article, {
        hooks: {
            beforeRemove({ $ref }) {
                expectType<any[]>($ref.association_ids);
            },
        }
    });

    User.hasMany('articles', Article, {}, {
        hooks: {
            beforeAdd({ $ref }) {
                expectType<ORM.FxOrmInstance.Instance>($ref.instance);
                expectType<ORM.FxOrmInstance.Instance>($ref.association);
            },
            afterAdd({ $ref }) {
                expectType<ORM.FxOrmInstance.Instance>($ref.instance);
                expectType<ORM.FxOrmInstance.Instance>($ref.association);
            },
            beforeRemove({ $ref }) {
                expectType<any[]>($ref.association_ids);
                expectType<ORM.FxOrmInstance.Instance[]>($ref.associations);
                expectType<Record<string, any>>($ref.removeConditions);
            },
            afterRemove({ $ref }) {
                expectType<any[]>($ref.association_ids);
                expectType<ORM.FxOrmInstance.Instance[]>($ref.associations);
                expectType<Record<string, any>>($ref.removeConditions);
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