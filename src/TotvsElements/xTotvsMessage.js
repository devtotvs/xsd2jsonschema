

const NAME = "name";
const DESCRIPTION = "description";
const SEGMENT = "segment";



class XTotvsMessage {

    constructor() {

        this.xName = "";
        this.xDescription = "";
        this.xSegment = "";
    }

   
    get xName() {
        return this[NAME];
    }
    set xName(name) {
        this[NAME] = name;
    }

    get xDescription() {
        return this[DESCRIPTION];
    }
    set xDescription(desc) {
        this[DESCRIPTION] = desc;
    }

    get xSegment() {
        return this[SEGMENT];
    }
    set xSegment(val) {
        this[SEGMENT] = val;
    }

   
}

module.exports = XTotvsMessage;