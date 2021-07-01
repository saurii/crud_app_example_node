export class Statuscodes {

    public static readonly _statuscodeprefix = 's';
    
    public statuscodesface: any = {
        '001': { code: '001', message: 'status code not defined', ispopup: true },
        '400': { code: '400', message: 'you are unauthorized to access this api', ispopup: true },
        '401': { code: '401', message: 'unauthozied', ispopup: true },
        '402': { code: '402', message: '#key1# created successfully', ispopup: true },
        '403': { code: '403', message: '#key1# already exist', ispopup: true },
        '404': { code: '404', message: 'data fetched successfully', ispopup: false },
        '405': { code: '405', message: 'records not found', ispopup: false },
        '406': { code: '406', message: '#key1# updated successfully', ispopup: true },
        '407': { code: '407', message: 'pass data to update details', ispopup: true },
        '408': { code: '408', message: 'logged in successfully', ispopup: true },
        '409': { code: '409', message: 'username/password is incorrect, please try again', ispopup: true },
        '410': { code: '410', message: 'you have no longer access to this api', ispopup: true },
        '411': { code: '411', message: '#key1# delete successfully', ispopup: true },
        '1015': { code: '1015', message: 'an error occured, please contact to system administrator', ispopup: true }
    }

    public getStatusDetails(key:any): Object {
        return this.statuscodesface[key];
    }
}