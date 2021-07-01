
export class Queryset {
    static query: string = '';

    public static getSelectQuery(tablename: string, column: any, ispagination: boolean, whereObject: any = {},
        israwquery: boolean = false, rawquery: string = '', aliasforwhere: string = ''): string {
        this.query = ``;
        if (israwquery === false) {
            if (tablename && tablename.trim() !== '') {
                if (column && column == "*") {
                    this.query += `select * from ${tablename} `
                } else if (column && column !== '*') {
                    this.query += `select ${column} from ${tablename} `
                } else {
                    this.query += `select * from ${tablename} `
                }
                let i = 0;
                if (whereObject && Object.keys(whereObject).length > 0) {
                    this.query += `where `;

                    Object.keys(whereObject).forEach((whrKey: any) => {
                        if (whrKey && whereObject[whrKey] !== null) {
                            if (whrKey.trim() === 'page' || whrKey.trim() === 'pagesize') {
                                return;
                            } else {
                                let value = whereObject[whrKey];
                                if (aliasforwhere && aliasforwhere !== '') {
                                    i = ++i;
                                    if (typeof value === "boolean") {
                                        value = whereObject[whrKey] ? 1 : 0;
                                        this.query += `${aliasforwhere}.${whrKey}=${value} and `
                                    } else if (typeof value === 'string') {
                                        this.query += `${aliasforwhere}.${whrKey}='${value}' and `
                                    } else {
                                        this.query += `${aliasforwhere}.${whrKey}=${value} and `
                                    }
                                } else {
                                    i = ++i;
                                    if (typeof value === "boolean") {
                                        value = whereObject[whrKey] ? 1 : 0;
                                        this.query += `${whrKey}=${value} and `
                                    } else if (typeof value === 'string') {
                                        this.query += `${whrKey}='${value}' and `
                                    } else {
                                        this.query += `${whrKey}=${value} and `
                                    }
                                }
                            }
                        }
                    })
                }

                if (i > 0) {
                    if (ispagination) {
                        let preparedQuery = this.query.trim().substring(0, this.query.length - 4);
                        let offset = (whereObject.page - 1) * whereObject.pagesize;
                        preparedQuery += ` limit ${offset},${whereObject.pagesize ? whereObject.pagesize : 100}`
                        return preparedQuery;
                    } else {
                        return this.query.trim().substring(0, this.query.length - 4);
                    }
                } else {
                    if (ispagination) {
                        let preparedQuery = this.query.trim().substring(0, this.query.length - 6);
                        let offset = (whereObject.page - 1) * whereObject.pagesize;
                        preparedQuery += `limit ${offset},${whereObject.pagesize ? whereObject.pagesize : 100}`
                        return preparedQuery;
                    } else {
                        return this.query.trim().substring(0, this.query.length - 6);
                    }
                }
            } else {
                return 'provide tablename';
            }
        } else {
            if (ispagination === true) {
                let offset = (whereObject.page - 1) * whereObject.pagesize;
                rawquery += `where `;
                let i = 0;
                Object.keys(whereObject).forEach((whrKey: any) => {
                    if (whrKey && whereObject[whrKey] !== null) {
                        let value = whereObject[whrKey];
                        if (whrKey.trim() === 'page' || whrKey.trim() === 'pagesize') {
                            return;
                        } else {
                            if (aliasforwhere && aliasforwhere !== '') {
                                i = ++i;
                                if (typeof value === "boolean") {
                                    value = whereObject[whrKey] ? 1 : 0;
                                    rawquery += `${aliasforwhere}.${whrKey}=${value} and `
                                } else if (typeof value === 'string') {
                                    rawquery += `${aliasforwhere}.${whrKey}='${value}' and `
                                } else {
                                    rawquery += `${aliasforwhere}.${whrKey}=${value} and `
                                }
                            } else {
                                i = ++i;
                                if (typeof value === "boolean") {
                                    value = whereObject[whrKey] ? 1 : 0
                                    rawquery += `${whrKey}=${value} and `
                                } else if (typeof value === 'string') {
                                    rawquery += `${whrKey}='${value}' and `
                                } else {
                                    rawquery += `${whrKey}=${value} and `
                                }
                            }
                        }
                    }
                })
                if (i > 0) {
                    let preparedQuery = rawquery.trim().substring(0, rawquery.length - 4);
                    preparedQuery += `limit ${offset},${whereObject.pagesize ? whereObject.pagesize : 100}`
                    return preparedQuery;
                } else {
                    let preparedQuery = rawquery.trim().substring(0, rawquery.length - 6);
                    preparedQuery += `limit ${offset},${whereObject.pagesize ? whereObject.pagesize : 100}`
                    return preparedQuery;
                }
            } else {
                let i = 0;
                rawquery += `where `;
                Object.keys(whereObject).forEach((whrKey: any) => {
                    if (whrKey && whereObject[whrKey] !== null) {
                        if (whrKey.trim() === 'page' || whrKey.trim() === 'pagesize') {
                            return;
                        } else {
                            let value = whereObject[whrKey];                            
                            if (aliasforwhere && aliasforwhere !== '') {
                                i = ++i;
                                if (typeof value === "boolean") {
                                    value = whereObject[whrKey] ? 1 : 0;
                                    rawquery += `${aliasforwhere}.${whrKey}=${value} and `
                                } else if (typeof value === 'string') {
                                    rawquery += `${aliasforwhere}.${whrKey}='${value}' and `
                                } else {
                                    rawquery += `${aliasforwhere}.${whrKey}=${value} and `
                                }
                            } else {
                                i = ++i;
                                if (typeof value === "boolean") {
                                    value = whereObject[whrKey] ? 1 : 0
                                    rawquery += `${whrKey}=${value} and `
                                } else if (typeof value === 'string') {
                                    rawquery += `${whrKey}='${value}' and `
                                } else {
                                    rawquery += `${whrKey}=${value} and `
                                }
                            }
                        }
                    }
                })
                return i > 0 ? rawquery.trim().substring(0, rawquery.length - 4) : rawquery.trim().substring(0, rawquery.length - 6);
            }
        }
    }

    public static getUpdateQuery(fieldsOf: { name: string, rName: string }[], body: any, tableName: string) {
        let query = `UPDATE ${tableName} SET `
        let data = []
        for (let i of fieldsOf) {
            let field = i
            let bodyParam = body[`${field.rName}`]
            if (bodyParam || bodyParam === false && `${bodyParam}`.trim().length > 0) {
                query += ` ${field.name} = ?,`;
                if (field.rName === 'isactive') {
                    bodyParam = body[`${field.rName}`] ? 1 : 0;
                    data.push(bodyParam);
                } else if (typeof bodyParam === "number") {
                    data.push(bodyParam)
                } else {
                    data.push(bodyParam.toLowerCase().trim())
                }
            }
        }
        if (data.length > 0) {
            const preparedQuery = query.substring(0, query.length - 1);
            return { query: preparedQuery, data: data }
        }
    }

    public static getWhereQuery(fieldsOf: { name: string, rName: string, aliasName: string }[], body: any) {
        let query = `where `
        let data = []
        for (let i of fieldsOf) {
            let field = i
            let bodyParam = body[`${field.rName}`]
            if (bodyParam || bodyParam === false && `${bodyParam}`.trim().length > 0) {
                
                if (field.rName === 'isactive') {                    
                    bodyParam = body[`${field.rName}`] ? 1 : 0;
                    query += ` ${field.aliasName}.${field.name} = ${bodyParam} and`;
                    data.push(bodyParam);
                } else if (typeof bodyParam === "number") {
                    query += ` ${field.aliasName}.${field.name} = ${bodyParam}  and`;
                    data.push(bodyParam)
                } else {
                    query += ` ${field.aliasName}.${field.name} = '${bodyParam}'  and`;
                    data.push(bodyParam.toLowerCase().trim())
                }
            }
        }
        if (data.length > 0) {
            const preparedQuery = query.substring(0, query.length - 4);
            return { query: preparedQuery, data: data }
        }
    }

    public static getPaginatedQuery(query: string, page: any, pagesize: any) {
        let offset = (page - 1) * pagesize;
        query += `limit ${offset},${pagesize ? pagesize : 100}`
        return query;
    }

    public static getInsertQuery(dataObject: any, tablename: string) {
        let columns = Object.keys(dataObject).map(function (k) { return k }).join(",");
        let _char = "?,";
        _char = _char.repeat(Object.keys(dataObject).length);
        _char = _char.substring(0, _char.length - 1);
        return {
            query: `INSERT INTO ${tablename}(${columns})values(${_char})`,
            data: Object.values(dataObject)
        }
    }

    public static getTotalCount(dataObject: any, tablename: string, aliasforwhere: any) {
        let query = `SELECT COUNT(*) as totalcount from ${tablename} where `;
        let i = 0;
        Object.keys(dataObject).forEach((whrKey: any) => {
            if (whrKey && dataObject[whrKey] !== null) {
                let value = dataObject[whrKey];
                if (whrKey.trim() === 'page' || whrKey.trim() === 'pagesize') {
                    return;
                } else {
                    if (aliasforwhere && aliasforwhere !== null) {                        
                        i = ++i;
                        if (typeof value === "boolean") {
                            value = dataObject[whrKey] ? 1 : 0;
                            query += `${whrKey}=${value} and `
                        } else if (typeof value === 'string') {
                            query += `${aliasforwhere}.${whrKey}='${value}' and `
                        } else {
                            query += `${aliasforwhere}.${whrKey}=${value} and `
                        }
                    } else {
                        i = ++i;
                        if (typeof value === "boolean") {
                            value = dataObject[whrKey] ? 1 : 0
                            query += `${whrKey}=${value} and `
                        } else if (typeof value === 'string') {
                            query += `${whrKey}='${value}' and `
                        } else {
                            query += `${whrKey}=${value} and `
                        }
                    }
                }
            }
        })
        if (i > 0) {
            return query.trim().substring(0, query.length - 4);
        } else {
            return query.trim().substring(0, query.length - 6);
        }
    }

    public static getTotalCountForMultipletable(fieldsOf: { name: string, rName: string, aliasName: string }[], body: any, query:any) {
        let data = []
        for (let i of fieldsOf) {
            let field = i
            let bodyParam = body[`${field.rName}`]
            if (bodyParam || bodyParam === false && `${bodyParam}`.trim().length > 0) {
                
                if (field.rName === 'isactive') {                    
                    bodyParam = body[`${field.rName}`] ? 1 : 0;
                    query += ` ${field.aliasName}.${field.name} = ${bodyParam} and`;
                    data.push(bodyParam);
                } else if (typeof bodyParam === "number") {
                    query += ` ${field.aliasName}.${field.name} = ${bodyParam}  and`;
                    data.push(bodyParam)
                } else {
                    query += ` ${field.aliasName}.${field.name} = '${bodyParam}'  and`;
                    data.push(bodyParam.toLowerCase().trim())
                }
            }
        }
        if (data.length > 0) {
            const preparedQuery = query.substring(0, query.length - 4);
            return { query: preparedQuery, data: data }
        } else {
            const preparedQuery = query.substring(0, query.length - 6);
            return { query: preparedQuery, data: data }
        }
    }
}