export function buildMergeToQuery (
	this: FxOrmDMLDriver.DMLDriver,
	q: FxSqlQuery.ChainBuilder__Select,
	merge: FxOrmDMLDriver.DMLDriver_FindOptions['merge'],
	conditions: FxSqlQuerySubQuery.SubQueryConditions
) {
	if (merge) {
		q
			.from(merge.from.table, merge.from.field, merge.to.table, merge.to.field)
			.select(merge.select);
		
		if (merge.where && Object.keys(merge.where[1]).length) {
			q = q.where(merge.where[0], merge.where[1], merge.table || null, conditions);
		} else {
			q = q.where(merge.table || null, conditions);
		}
	} else {
		q = q.where(conditions);
	}

	return q;
}

export function buildExistsToQuery (
	this: FxOrmDMLDriver.DMLDriver,
	q: FxSqlQuery.ChainBuilder__Select,
	table: string,
	exists: FxOrmDMLDriver.DMLDriver_FindOptions['exists'],
) {
	if (exists) {
		for (let k in exists) {
			const exist_item = exists[k];
			q.whereExists(exist_item.table, table, exist_item.link, exist_item.conditions);
		}
	}
}

export function buildOrderToQuery (
	this: FxOrmDMLDriver.DMLDriver,
	q: FxSqlQuery.ChainBuilder__Select,
	order: FxOrmDMLDriver.DMLDriver_FindOptions['order'],
) {
	if (order) {
		for (let i = 0; i < order.length; i++) {
			q.order(order[i][0], order[i][1]);
		}
	}
}