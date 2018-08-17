const FIELD = "field";
const REQUIRED = "required";
const TYPE = "type";
const LENGHT = "length";
const DESCRIPTION = "description";

class XTotvs {

    constructor() {

        this.xField = "";
        this.xRequired = false;
        this.xType = "";
        this.xLength = 0;
        this.xDescription = "";
    }

    add(attr, val) {
        this[attr] = val;
    }

    get xField() {
        return this[FIELD];
    }
    set xField(name) {
        this[FIELD] = name;
    }

    get xRequired() {
        return this[REQUIRED];
    }
    set xRequired(val) {
        this[REQUIRED] = this.handleRequired(val);
    }

    get xType() {
        return this[TYPE];
    }
    set xType(type) {
        this[TYPE] = type;
    }

    get xLength() {
        return this[LENGHT];
    }
    set xLength(len) {
        this[LENGHT] = parseInt(len);
    }

    get xDescription() {
        return this[DESCRIPTION];
    }
    set xDescription(desc) {
        this[DESCRIPTION] = desc;
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