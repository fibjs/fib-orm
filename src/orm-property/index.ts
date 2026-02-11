import * as Transformers from './transformers';

export { Transformers };

export type { IProperty } from './Property';

export function transformer(type: 'mysql'): typeof Transformers['mysql']
export function transformer(type: 'psql'): typeof Transformers['postgresql']
export function transformer(type: 'postgresql'): typeof Transformers['postgresql']
export function transformer(type: 'sqlite'): typeof Transformers['sqlite']
export function transformer(type: 'dm'): typeof Transformers['dm']
export function transformer(type: string) {
    switch (type) {
        case 'psql':
        case 'postgres':
            return Transformers['postgresql'];
        case 'dm':
            return Transformers['dm'];
        case 'postgresql':
        case 'mysql':
        case 'sqlite':
            return Transformers[type];
        default:
            throw new Error('Unknown database type');
    }
}

export { defineCustomType } from './customTypes';

// TODO: add type test for it
export { ExtractColumnInfo } from './Property';
