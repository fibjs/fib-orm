import {
	FxSqlQuerySubQuery,
} from '../../sql-query/Query';

const model_conjunctions_keys: (keyof FxSqlQuerySubQuery.ConjunctionInput__Sample)[] = [ 'or', 'and', 'not_or', 'not_and', 'not' ];
export function isModelConjunctionsKey (k: string) {
    return model_conjunctions_keys.includes(k as any)
}