import {extendObservable} from 'mobx';

class UserStore {
    constructor() {
        extendObservable(this, {
            loading: true,
            isLoggedIn: false,
            username: '',
            privileges: 0,
        })
    }
}

export default new UserStore();