

const NAME = "name";
const NOTE = "note";
const SEGMENT = "segment";



class XTotvsMessage {

    constructor() {

        this.xName = "";
        this.xNote = "";
        this.xSegment = "";
    }

   
    get xName() {
        return this[NAME];
    }
    set xName(name) {
        this[NAME] = name;
    }

    get xNote() {
        return this[NOTE];
    }
    set xNote(note) {
        this[NOTE] = note;
    }

    get xSegment() {
        return this[SEGMENT];
    }
    set xSegment(val) {
        this[SEGMENT] = val;
    }   
}

module.exports = XTotvsMessage;