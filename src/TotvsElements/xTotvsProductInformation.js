const PRODUCT = "product";
const CONTACT = "contact";
const NOTE = "note";
const ADAPTER = "adapter";

class xTotvsProductInformation {

    constructor() {
        this.xProduct = "";
        this.xContact = "";
        this.xNote = "";
        this.xAdapter = "";
    }

    get xProduct() {
        return this[PRODUCT];
    }
    set xProduct(name) {
        this[PRODUCT] = name;
    }
    get xContact() {
        return this[CONTACT];
    }
    set xContact(contact) {
        this[CONTACT] = contact;
    }

    get xNote() {
        return this[NOTE];
    }
    set xNote(note) {
        this[NOTE] = note;
    }

    get xAdapter() {
        return this[ADAPTER];
    }
    set xAdapter(adapter) {
        this[ADAPTER] = adapter;
    }
}

module.exports = xTotvsProductInformation;