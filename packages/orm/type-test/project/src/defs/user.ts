import * as ORM from '@src';
import { expectType } from 'ts-expect';

const UserDef = ORM.defineModel((orm) => {
    const User = orm.define('users', {
        name: String,
        age: Number,
    }, {
        methods: {
            getAge() {
                return this.age;
            },
            getName() {
                return this.name;
            },
            accessModel1() {
                const UserModel = this.model();

                return UserModel.find().firstSync().name;
            },
            markSelfInference() {
                const instance = User.find().firstSync() as typeof this

                return instance;
            },
            create() {
                let inst = User.find({ name: '' }).firstSync();
                if (!inst) {
                    inst = User.createSync({
                        name: '',
                        description: '',
                    });
                } else {
                    inst.saveSync({
                        description: '',
                    });
                }
            }
        },
        hooks: {
            beforeSave() {
                expectType<string>(this.name);
                expectType<number>(this.age);
            },
            afterSave() {
                // expectType<boolean>(success);
                
                expectType<string>(this.name);
                expectType<number>(this.age);
            }
        }
    });
    
    const Role = orm.define('role', {
        name: { type: 'text' },
        description: 'text',
        permissions: [
            'admin' as const,
            'visitor' as const
        ],
        customType: {
            type: 'customJson',
        }
    }, {
        methods: {
            getName() {
                expectType<string>(this.name);
                return this.name;
            },
            getDescription () {
                expectType<string>(this.description);
                return this.description;
            },
            getPermission() {
                expectType<'admin' | 'visitor'>(this.permissions);
                return this.permissions;
            },
            getCustomeType() {
                expectType<ORM.FxOrmProperty.GlobalCustomModelType['customJson']>(this.customType);
                return this.customType;
            }
        }
    });

    User().getAge();

    Role().getPermission();

    return { User, Role };
});

export default UserDef;

type Defs = ReturnType<typeof UserDef>;

declare module '@fxjs/orm' {
    export namespace FxOrmNS {
        export interface GlobalModels {
            users: Defs['User'];
            role: Defs['Role'];
        }
    }
    
    export namespace FxOrmProperty {
        interface GlobalCustomModelType {
            customJson: { foo1: 'bar1' }
        }
    }
}