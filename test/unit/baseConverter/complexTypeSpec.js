"use strict";

const XsdFile = require("xsd2jsonschema").XsdFile;
const BaseConverter = require("xsd2jsonschema").BaseConverter;
const JsonSchemaFile = require("xsd2jsonschema").JsonSchemaFile;
const jsonSchemaTypes = require("xsd2jsonschema").JsonSchemaTypes;

describe("BaseConverter <ComplexType>", function () {
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
       
        <xs:complexType name="BusinessContentType">
            <xs:sequence>
                <xs:element name="ContractParcel" type="ContractParcelType" maxOccurs="unbounded" minOccurs="0"/>
            </xs:sequence>
        </xs:complexType>
        <xs:complexType name="ListOfContractParcelType">
            <xs:sequence>
                <xs:element name="ContractParcel" type="ContractParcelType" maxOccurs="unbounded" minOccurs="0"/>
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
            uri: 'complextype-unit-test',
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



    });

    afterEach(function () {});

    describe("in MessageDocumentation state", function () {

        it('tracks the spy for handleNamedComplexType method', function () {
           

            spyOn(bc, 'handleNamedComplexType');
            node = xsd.select1("//xs:schema/xs:complexType");
            tagName = enterState(node);
            bc[tagName](node, jsonSchema, xsd)

            expect(bc.handleNamedComplexType).toHaveBeenCalled();
        });

        it("should pass because a subschema was added wich object", function () {
            
            node = xsd.select1("//xs:schema/xs:complexType");
            tagName = enterState(node);
            bc.handleNamedComplexType(node, jsonSchema, xsd);


            expect(bc.workingJsonSchema.type).toEqual(jsonSchemaTypes.OBJECT);
        });

        it("should pass because a subschema was added wich array", function () {
            
            node = xsd.select1("//xs:schema/xs:complexType[2]");
            tagName = enterState(node);
            bc.handleNamedComplexType(node, jsonSchema, xsd);


            expect(bc.workingJsonSchema.type).toEqual(jsonSchemaTypes.ARRAY);
        });

    });



});