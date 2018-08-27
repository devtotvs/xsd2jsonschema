const xFIELD = "field";
const xREQUIRED = "required";
const xTYPE = "type";
const xLENGHT = "length";
const xNOTE = "note";
const xPRODUCT = "product";
const xAVAILABLE = "available";
const xCANUPDATE = "canUpdate";

class XTotvs {

    constructor() {
        this.Product = "";
        this.Field = "";
        this.Required = false;
        this.Type = "";
        this.Length = "";
        this.Note = "";
        this.Available = true;
        this.CanUpdate = false;
    }

    get Available() {
        return this[xAVAILABLE];
    }
    set Available(available) {
        this[xAVAILABLE] = available;
    }

    get Product() {
        return this[xPRODUCT];
    }
    set Product(name) {
        this[xPRODUCT] = name;
    }

    get Field() {
        return this[xFIELD];
    }
    set Field(name) {
        this[xFIELD] = name;
    }

    get Required() {
        return this[xREQUIRED];
    }
    set Required(val) {
        this[xREQUIRED] = this.handleRequired(val);
    }

    get Type() {
        return this[xTYPE];
    }
    set Type(type) {
        this[xTYPE] = type;
    }

    get Length() {
        return this[xLENGHT];
    }
    set Length(len) {
        this[xLENGHT] = len;
    }

    get Note() {
        return this[xNOTE];
    }
    set Note(note) {
        this[xNOTE] = note;
    }

    get CanUpdate() {
        return this[xCANUPDATE];
    }
    set CanUpdate(canUpdate) {
        this[xCANUPDATE] = canUpdate;
    }

    handleRequired(val) {
        if (typeof val === 'boolean') {
            return val;
        } else {
            val = String(val).toLowerCase();

            if (val == 'sim') {
                return true;
            } else {
                return false
            }
        }
    }

}

module.exports = XTotvs;