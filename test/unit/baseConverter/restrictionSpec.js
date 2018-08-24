"use strict";

const XsdFile = require("xsd2jsonschema").XsdFile;
const BaseConverter = require("xsd2jsonschema").BaseConverter;
const JsonSchemaFile = require("xsd2jsonschema").JsonSchemaFile;
const jsonSchemaTypes = require("xsd2jsonschema").JsonSchemaTypes;

describe("BaseConverter <Restriction>", function () {
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
        <xs:complexType name="elements">
            <xs:sequence>
                <xs:element name="Element1" type="xs:string">
                    <xs:restriction base="xs:decimal">
                        <xs:totalDigits value="10"/>
                        <xs:fractionDigits value="2"/>
                    </xs:restriction>
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

    function getFirstChildNode(node, name) {
        return getChildNodes(node, name)[0];
    }

    function getChildNodes(node, name) {
        let childs = [];
        for (var n = node.firstChild; n != null; n = n.nextSibling) {
            if (n.nodeName == name) {
                childs.push(n);
            }
        }

        return childs;
    }

    function getLastProperty(schema) {
        if (schema.properties) {
            let prop = Object.keys(schema.properties);
            prop = prop[prop.length - 1];
            return schema.properties[prop];
        }
    }

    beforeEach(function () {
        bc = new BaseConverter();
        xsd = new XsdFile({
            uri: 'Restriction-unit-test',
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

        node = xsd.select1("//xs:schema/xs:complexType/xs:sequence/xs:element");
        tagName = enterState(node);
        bc[tagName](node, jsonSchema, xsd);


    });

    afterEach(function () {});

    describe("in Restriction state", function () {

        it("should pass because this state is implemented", function () {
            node = xsd.select1("//xs:schema/xs:complexType/xs:sequence/xs:element/xs:restriction");
            tagName = enterState(node);


            expect(bc[tagName](node, jsonSchema, xsd)).toBeTruthy();
        });

        it("should pass because type is equals mock", function () {
            node = xsd.select1("//xs:schema/xs:complexType/xs:sequence/xs:element/xs:restriction");
            tagName = enterState(node);
            bc[tagName](node, jsonSchema, xsd)

            let property = getLastProperty(bc.workingJsonSchema);

            expect(property.type).toEqual(jsonSchemaTypes.NUMBER);
        });       

    });

    describe("in totalDigits state", function () {
        it("should pass because this state is implemented", function () {
            node = xsd.select1("//xs:schema/xs:complexType/xs:sequence/xs:element/xs:restriction");
            tagName = enterState(node);

            node = xsd.select1("//xs:schema/xs:complexType/xs:sequence/xs:element/xs:restriction/xs:totalDigits");
            tagName = enterState(node);
            bc[tagName](node, jsonSchema, xsd);
           
            let property = getLastProperty(bc.workingJsonSchema);
           
            expect(property.maximum).toBeTruthy();
            expect(property.maximum).toEqual(9999999999);
            expect(property.minimum).toBeTruthy();
            expect(property.minimum).toEqual(-9999999999);
        });

    });

    describe("in fractionDigits state", function () {
        it("should pass because this state is implemented", function () {
            node = xsd.select1("//xs:schema/xs:complexType/xs:sequence/xs:element/xs:restriction");
            tagName = enterState(node);

            node = xsd.select1("//xs:schema/xs:complexType/xs:sequence/xs:element/xs:restriction/xs:totalDigits");
            tagName = enterState(node);
            bc[tagName](node, jsonSchema, xsd);

            bc.parsingState.exitState();

            node = xsd.select1("//xs:schema/xs:complexType/xs:sequence/xs:element/xs:restriction/xs:fractionDigits");
            tagName = enterState(node);
            bc[tagName](node, jsonSchema, xsd);
           
            let property = getLastProperty(bc.workingJsonSchema);
           
            expect(property.maximum).toEqual(99999999.99);    
            expect(property.minimum).toEqual(-99999999.99);  
            expect(property.multipleOf).toEqual(0.01);   
        });

        it("should pass because this state is implemented", function () {
            node = xsd.select1("//xs:schema/xs:complexType/xs:sequence/xs:element/xs:restriction");
            tagName = enterState(node);

            node = xsd.select1("//xs:schema/xs:complexType/xs:sequence/xs:element/xs:restriction/xs:fractionDigits");
            tagName = enterState(node);
            bc[tagName](node, jsonSchema, xsd);
           
            let property = getLastProperty(bc.workingJsonSchema);
           
            expect(property.multipleOf).toBeTruthy();           
            expect(property.multipleOf).toEqual(0.01);   
        });

    });

});