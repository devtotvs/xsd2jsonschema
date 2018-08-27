const PRODUCT = "product";
const CONTACT = "contact";
const DESCRIPTION = "description";
const ADAPTER = "adapter";



class xTotvsProductInformation {

    constructor() {
        this.xProduct = "";
        this.xContact = "";
        this.xDescription = "";
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

    get xDescription() {
        return this[DESCRIPTION];
    }
    set xDescription(description) {
        this[DESCRIPTION] = description;
    }

    get xAdapter() {
        return this[ADAPTER];
    }
    set xAdapter(adapter) {
        this[ADAPTER] = adapter;
    }


}

module.exports = xTotvsProductInformation;