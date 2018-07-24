
const Field = "field";
//const outputDir_NAME = Symbol();
//const baseId_NAME = Symbol();

class XTotvs  {

    constructor() {
      
        this.xFields = "";
    }
    
    get xFields() {
        return this[Field];
    }
    set xFields(name) {
        this[Field] = name;
    }

}

module.exports = XTotvs;