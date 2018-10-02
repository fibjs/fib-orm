export function defineDefaultExtendsToTableName (modelTableName: string, assocName: string) {
	return `${modelTableName}_${assocName}`
}

export function defineAssociationAccessorMethodName (prefixer: 'get' | 'set' | 'has' | 'remove', assocName: string) {
	return `${prefixer}${assocName}`
}
