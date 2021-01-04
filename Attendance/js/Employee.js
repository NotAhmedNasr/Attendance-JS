export class NewEmployee {
    constructor(_fname, _lname, _address, _email, _age) {
        this.fname = _fname;
        this.lname = _lname;
        this.address = _address;
        this.email = _email;
        this.age = _age;
    }
}
export class Employee extends NewEmployee {
    constructor(_fname, _lname, _address, _email, _age, _username, _password) {
        super(_fname, _lname, _address, _email, _age);
        this.username = _username;
        this.password = _password;
        this.subAdmin = false;
    }
}
