const DESCRIPTION = "description";
const VERSION = "version";
const TITLE = "title";
const CONTACT = "contact";
const XTOTVS = "x-totvs";


class InfoTotvs {

    constructor() {

        this.xDescription = "";
        this.xVersion = "";
        this.xTitle = "";
        this.xContact = {};
        this.xTotvs = {};
       
    }
    
    get xDescription() {
        return this[DESCRIPTION];
    }
    set xDescription(desc) {
        this[DESCRIPTION] = desc;
    }

    get xVersion() {
        return this[VERSION];
    }
    set xVersion(version) {
        this[VERSION] = version;
    }

    get xTitle() {
        return this[TITLE];
    }
    set xTitle(title) {
        this[TITLE] = title;
    }

    get xContact() {
        return this[CONTACT];
    }
    set xContact(contact) {
        this[CONTACT] = contact;
    }

    get xTotvs() {
        return this[XTOTVS];
    }
    set xTotvs(xtotvs) {
        this[XTOTVS] = xtotvs;
    }

   

    

}

module.exports = InfoTotvs;