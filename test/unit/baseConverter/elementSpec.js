"use strict";

const XsdFile = require("xsd2jsonschema").XsdFile;
const BaseConverter = require("xsd2jsonschema").BaseConverter;
const JsonSchemaFile = require("xsd2jsonschema").JsonSchemaFile;
const jsonSchemaTypes = require("xsd2jsonschema").JsonSchemaTypes;

describe("BaseConverter <Element>", function () {
    var bc;
    var xsd;
    var jsonSchema;
    const xml = `
    <?xml version="1.0" encoding="UTF-8"?>
    <xs:schema attributeFormDefault="unqualified" 
        elementFormDefault="qualified" 
        version="1.1.0" 
        targetNamespace="http://www.xsd2jsonschema.org/example" 
        xmlns="http://www.xsd2jsonschema.org/example" 
        xmlns:xs="http://www.w3.org/2001/XMLSchema">
        <xs:complexType name="Elements">
            <xs:sequence>
                <xs:element name="Element1" type="xs:string"></xs:element>
                <xs:element name="Element2" minOccurs="1"></xs:element>
                <xs:element name="Element3" type="xs:string" maxOccurs="3"></xs:element>
                <xs:element name="Element4" maxOccurs="unbounded"></xs:element>
                <xs:element name="ListOfElement5" minOccurs="0">
                    <xs:complexType>
                        <xs:sequence>
                            <xs:element name="CommunicationInformation" type="CommunicationInformationType" maxOccurs="unbounded" minOccurs="0">
                                <xs:annotation>
                                    <xs:documentation>Datasul: PhoneNumber= emitente.telefone ou .pessoa_jurid.cod_telefone ou pessoa_fisic.cod_telefone (15) PhoneExtension = emitente.ramal ou pessoa_jurid.cod_ramal ou pessoa_fisic.cod_ramal (5), FaxNumber = cont-emit.telefax ou contato.cod_fax_contat (15), FaxNumberExtension = cont-emit.ramal-fax ou contato.cod_ramal_fax_contat char (5), HomePage = emitente.home-page ou pessoa_jurid.nom_home_page ou pessoa_fisic.nom_home_page char (40), Email = emitente.e-mail ou pessoa_jurid.cod_e_mail ou pessoa_fisic.cod_e_mail char (40).</xs:documentation>
                                </xs:annotation>
                            </xs:element>
                        </xs:sequence>
                    </xs:complexType>
                </xs:element>
            </xs:sequence>
        </xs:complexType>
    </xs:schema>
    `;

    var node;
    var tagName;

    function enterState(node) {
        const name = XsdFile.getNodeName(node);
        bc.parsingState.enterState({
            name: name,
            workingJsonSchema: undefined
        });
        return name;
    }

    // function getFirstChildNode(node, name) {
    //     return getChildNodes(node, name)[0];
    // }

    // function getChildNodes(node, name) {
    //     let childs = [];
    //     for (var n = node.firstChild; n != null; n = n.nextSibling) {
    //         if (n.nodeName == name) {
    //             childs.push(n);
    //         }
    //     }

    //     return childs;
    // }

    function getLastProperty(schema) {
        if (schema.properties) {
            let prop = Object.keys(schema.properties);
            prop = prop[prop.length - 1];
            return schema.properties[prop];
        }
    }


    function readElement(index = 1){
        node = xsd.select1("//xs:schema/xs:complexType/xs:sequence/xs:element[" + index + "]");
            tagName = enterState(node);
    }

    function upStates(level){
        for (var i = 0; i < level; i++) {
            bc.parsingState.exitState();
        }
    }

    beforeEach(function () {
        bc = new BaseConverter();
        xsd = new XsdFile({
            uri: 'field-documentation-unit-test',
            xml: xml
        });
        jsonSchema = new JsonSchemaFile({
            baseFilename: xsd.baseFilename,
            baseId: "http://www.xsd2jsonschema.org/unittests/",
            targetNamespace: xsd.targetNamespace
        });

        node = xsd.select1("//xs:schema");
        tagName = enterState(node);
        bc[tagName](node, jsonSchema, xsd);

        node = xsd.select1("//xs:schema/xs:complexType");
        tagName = enterState(node);
        bc[tagName](node, jsonSchema, xsd);

        node = xsd.select1("//xs:schema/xs:complexType/xs:sequence");
        tagName = enterState(node);
        bc[tagName](node, jsonSchema, xsd);

        
        // bc[tagName](node, jsonSchema, xsd);

    });

    afterEach(function () {});

    describe("in Element state", function () {

        it("should pass because this state is implemented", function () {
            readElement();

            expect(bc[tagName](node, jsonSchema, xsd)).toBeTruthy();
        });

        it('tracks the spy for handleElementLocal method', function () {
            readElement();

            spyOn(bc, 'handleElementLocal');

            bc[tagName](node, jsonSchema, xsd)

            expect(bc.handleElementLocal).toHaveBeenCalled();
        });

        it('tracks the spy for addPropertyAsArray method', function () {
            readElement();

            spyOn(bc, 'addProperty');

            bc.handleElementLocal(node, jsonSchema, xsd)

            expect(bc.addProperty).toHaveBeenCalled();
        });
       
    });

    describe("is property", function () {
        it("should pass because name is the same to first element in mock", function () {
            readElement();

            bc[tagName](node, jsonSchema, xsd);
            expect(Object.keys(bc.workingJsonSchema.properties)[0] == "Element1").toBeTruthy();
        });

        //must be true because could have child elements
        it("should pass because method return true", function () {
            readElement();
            expect(bc.handleElementLocal(node, jsonSchema, xsd)).toBeTruthy();
        });

        it("should pass because was added a property", function () {
            readElement();
            bc.handleElementLocal(node, jsonSchema, xsd);

            expect(bc.workingJsonSchema.properties).toBeTruthy();
        });

        it("should pass because the type is equal the mock element", function () {
            readElement();

            bc.handleElementLocal(node, jsonSchema, xsd);

            let property = getLastProperty(bc.workingJsonSchema);
            expect(property.type == jsonSchemaTypes.STRING).toBeTruthy();
        });

        it("should pass because the type is equal to the second mock element ", function () {
            readElement(2);

            bc.handleElementLocal(node, jsonSchema, xsd);

            let property = getLastProperty(bc.workingJsonSchema);
            expect(property.type == jsonSchemaTypes.OBJECT).toBeTruthy();
        });

        it("should pass because 1 element has been added as required", function () {
            readElement(2);

            bc.handleElementLocal(node, jsonSchema, xsd);

            expect(bc.workingJsonSchema.required.length).toBeTruthy();
        });
    });

    describe("is array", function (){
        it("should pass because the element is array", function () {
            readElement(3);

            bc.handleElementLocal(node, jsonSchema, xsd);
            let property = getLastProperty(bc.workingJsonSchema);
            expect(property.type == "array").toBeTruthy();
        });

        it('tracks the spy for addPropertyAsArray method', function () {
            spyOn(bc, 'addPropertyAsArray');

            readElement(3);

            bc.handleElementLocal(node, jsonSchema, xsd);

            expect(bc.addPropertyAsArray).toHaveBeenCalled();
        });

        it("should pass because the element have maxItems = 3", function () {
            readElement(3);

            bc.handleElementLocal(node, jsonSchema, xsd);
            let property = getLastProperty(bc.workingJsonSchema);
            expect(property.maxItems == 3).toBeTruthy();
        });

        it("should pass because the items type is string", function () {
            readElement(3);

            bc.handleElementLocal(node, jsonSchema, xsd);
            let property = getLastProperty(bc.workingJsonSchema);
            expect(property.items.type == jsonSchemaTypes.STRING).toBeTruthy();
        });

        it("should pass because the items type is object", function () {
            readElement(4);

            bc.handleElementLocal(node, jsonSchema, xsd);
            let property = getLastProperty(bc.workingJsonSchema);
            expect(property.items.type == jsonSchemaTypes.OBJECT).toBeTruthy();
        });
    });

    describe("is ListOf", function (){
        it("should pass because the type is array ", function () {
            readElement(5);

            bc.handleElementLocal(node, jsonSchema, xsd);

            let property = getLastProperty(bc.workingJsonSchema);
            expect(property.type == jsonSchemaTypes.ARRAY).toBeTruthy();
        });

        it("must pass because the type of items is the same as the child element ", function () {
            readElement(5);
          
            node = xsd.select1("//xs:schema/xs:complexType/xs:sequence/xs:element[5]/xs:complexType");
            tagName = enterState(node);         
            bc[tagName](node, jsonSchema, xsd);

            node = xsd.select1("//xs:schema/xs:complexType/xs:sequence/xs:element[5]/xs:complexType/xs:sequence");
            tagName = enterState(node);         
            bc[tagName](node, jsonSchema, xsd);

            

            node = xsd.select1("//xs:schema/xs:complexType/xs:sequence/xs:element[5]/xs:complexType/xs:sequence/xs:element");
            tagName = enterState(node);         
            bc[tagName](node, jsonSchema, xsd);        

            bc.handleElementLocal(node, jsonSchema, xsd);
            let customType = bc.namespaceManager.getType("CommunicationInformationType", jsonSchema, xsd).get$RefToSchema();
            //upStates(3);
            readElement(5);
            let property = getLastProperty(bc.workingJsonSchema);
            expect(property.items.type == customType).toBeTruthy();
        });
    });
});