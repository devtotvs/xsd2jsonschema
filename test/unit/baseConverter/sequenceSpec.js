"use strict";

const XsdFile = require("xsd2jsonschema").XsdFile;
const BaseConverter = require("xsd2jsonschema").BaseConverter;
const JsonSchemaFile = require("xsd2jsonschema").JsonSchemaFile;
const jsonSchemaTypes = require("xsd2jsonschema").JsonSchemaTypes;

describe("BaseConverter <Sequence>", function () {
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
       
        <xs:complexType name="tcaddfields">
            <xs:sequence minOccurs="0" maxOccurs="20">
                <xs:element name="ADDFIELD" type="tcAddField" minOccurs="0"/>
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


    beforeEach(function () {
        bc = new BaseConverter();
        xsd = new XsdFile({
            uri: 'Sequence-unit-test',
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

    });

    afterEach(function () {});

    describe("in Sequence state", function () {
        it("should pass because type is array", function () {

            node = xsd.select1("//xs:schema/xs:complexType/xs:sequence");
            tagName = enterState(node);
            bc[tagName](node, jsonSchema, xsd);


            expect(bc.workingJsonSchema.type).toEqual(jsonSchemaTypes.ARRAY);
        });

        it("should pass because type maxItems equals mock", function () {

            node = xsd.select1("//xs:schema/xs:complexType/xs:sequence");
            tagName = enterState(node);
            bc[tagName](node, jsonSchema, xsd);


            expect(bc.workingJsonSchema.maxItems).toEqual(20);
        });

       

    });



});