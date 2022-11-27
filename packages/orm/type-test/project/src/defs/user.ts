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
                const instance = this.model().create({});
                // expectType<ORM.FxOrmModel.GetInstanceTypeFrom<typeof User>>(instance);

                return instance.name
            }
        }
    });
    
    const Role = orm.define('role', {
        name: String,
        permissions: [
            'admin' as const,
            'visitor' as const
        ],
    }, {
        methods: {
            getPermission() {
                return this.permissions;
            }
        }
    });

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
}