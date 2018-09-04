"use strict";

const XsdFile = require("xsd2jsonschema").XsdFile;
const BaseConverter = require("xsd2jsonschema").BaseConverter;
const JsonSchemaFile = require("xsd2jsonschema").JsonSchemaFile;
const jsonSchemaTypes = require("xsd2jsonschema").JsonSchemaTypes;
const jsonSchemaFormats = require("xsd2jsonschema").JsonSchemaFormats;

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
                <xs:element name="ECFTaxing" minOccurs="0">
                    <xs:complexType>
                        <xs:sequence>
                            <xs:element name="Aliquot" minOccurs="0">				
                                <xs:simpleType>
                                    <xs:restriction base="xs:decimal">
                                        <xs:totalDigits value="15"/>
                                        <xs:fractionDigits value="2"/>
                                    </xs:restriction>
                                </xs:simpleType>
                            </xs:element>
                        </xs:sequence>
                    </xs:complexType>
                </xs:element>
               
            </xs:sequence>
        </xs:complexType>
        <xs:simpleType name="tsData">		
            <xs:restriction base="xs:date"/>
        </xs:simpleType>
        <xs:simpleType name="tspricetablenumber">
            <xs:restriction base="xs:string">
                <xs:maxLength value="15"/>			
            </xs:restriction>
        </xs:simpleType>
        <xs:simpleType name="tsfuncmsgorder">
            <xs:restriction base="xs:string">
                <xs:enumeration value="43"/>
                <xs:enumeration value="2">
					<xs:annotation>
						<xs:documentation>Importa</xs:documentation>
					</xs:annotation>
                </xs:enumeration>
                <xs:enumeration value="3">
					<xs:annotation>
						<xs:documentation>Ordem</xs:documentation>
					</xs:annotation>
				</xs:enumeration>
            </xs:restriction>
        </xs:simpleType>
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

        it("should pass because this state is implemented", function () {
            bc.parsingState.exitState();

            node = xsd.select1("//xs:schema/xs:complexType/xs:sequence/xs:element[2]");
            tagName = enterState(node);
            bc[tagName](node, jsonSchema, xsd);

            node = xsd.select1("//xs:schema/xs:complexType/xs:sequence/xs:element[2]/xs:complexType");
            tagName = enterState(node);

            node = xsd.select1("//xs:schema/xs:complexType/xs:sequence/xs:element[2]/xs:complexType/xs:sequence");
            tagName = enterState(node);

            node = xsd.select1("//xs:schema/xs:complexType/xs:sequence/xs:element[2]/xs:complexType/xs:sequence/xs:element");
            tagName = enterState(node);
            bc[tagName](node, jsonSchema, xsd);

            node = xsd.select1("//xs:schema/xs:complexType/xs:sequence/xs:element[2]/xs:complexType/xs:sequence/xs:element/xs:simpleType/xs:restriction");
            tagName = enterState(node);
            bc[tagName](node, jsonSchema, xsd);

            node = xsd.select1("//xs:schema/xs:complexType/xs:sequence/xs:element[2]/xs:complexType/xs:sequence/xs:element/xs:simpleType/xs:restriction/xs:totalDigits");
            tagName = enterState(node);
            bc[tagName](node, jsonSchema, xsd);

            let property = getLastProperty(bc.workingJsonSchema);
            property = getLastProperty(property);
            expect(property.maximum).toBeTruthy();
            expect(property.maximum).toEqual(999999999999999);
            expect(property.minimum).toBeTruthy();
            expect(property.minimum).toEqual(-999999999999999);
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

        it("should pass because this state is implemented", function () {
            bc.parsingState.exitState();

            node = xsd.select1("//xs:schema/xs:complexType/xs:sequence/xs:element[2]");
            tagName = enterState(node);
            bc[tagName](node, jsonSchema, xsd);

            node = xsd.select1("//xs:schema/xs:complexType/xs:sequence/xs:element[2]/xs:complexType");
            tagName = enterState(node);

            node = xsd.select1("//xs:schema/xs:complexType/xs:sequence/xs:element[2]/xs:complexType/xs:sequence");
            tagName = enterState(node);

            node = xsd.select1("//xs:schema/xs:complexType/xs:sequence/xs:element[2]/xs:complexType/xs:sequence/xs:element");
            tagName = enterState(node);
            bc[tagName](node, jsonSchema, xsd);

            node = xsd.select1("//xs:schema/xs:complexType/xs:sequence/xs:element[2]/xs:complexType/xs:sequence/xs:element/xs:simpleType/xs:restriction");
            tagName = enterState(node);
            bc[tagName](node, jsonSchema, xsd);

            node = xsd.select1("//xs:schema/xs:complexType/xs:sequence/xs:element[2]/xs:complexType/xs:sequence/xs:element/xs:simpleType/xs:restriction/xs:fractionDigits");
            tagName = enterState(node);
            bc[tagName](node, jsonSchema, xsd);

            let property = getLastProperty(bc.workingJsonSchema);
            property = getLastProperty(property);
            expect(property.multipleOf).toBeTruthy();
            expect(property.multipleOf).toEqual(0.01);
        });

        it("should pass because descripiton is equal as the mock", function () {
            bc.parsingState.exitState();
            bc.parsingState.exitState();
            bc.parsingState.exitState();

            node = xsd.select1("//xs:schema/xs:simpleType");
            tagName = enterState(node);
            bc[tagName](node, jsonSchema, xsd);

                      
            node = xsd.select1("//xs:schema/xs:simpleType/xs:restriction");
            tagName = enterState(node);
            bc[tagName](node, jsonSchema, xsd);
          
           
            expect(bc.workingJsonSchema.type).toEqual(jsonSchemaTypes.STRING);
            expect(bc.workingJsonSchema.format).toEqual(jsonSchemaFormats.DATE);
        });

        it("should pass because descripiton is equal as the mock", function () {
            bc.parsingState.exitState();
            bc.parsingState.exitState();
            bc.parsingState.exitState();

            node = xsd.select1("//xs:schema/xs:simpleType[2]");
            tagName = enterState(node);
            bc[tagName](node, jsonSchema, xsd);

                      
            node = xsd.select1("//xs:schema/xs:simpleType[2]/xs:restriction/xs:maxLength");
            tagName = enterState(node);
            bc[tagName](node, jsonSchema, xsd);
          
           
            expect(bc.workingJsonSchema.maxLength).toEqual(15);
            
        });

    });


    describe("in enumaration state", function () {
        it("should pass because description is valid", function () {
            bc.parsingState.exitState();
            bc.parsingState.exitState();

            node = xsd.select1("//xs:schema/xs:simpleType");
            tagName = enterState(node);

            node = xsd.select1("//xs:schema/xs:simpleType/xs:restriction");
            tagName = enterState(node);
            bc[tagName](node, jsonSchema, xsd)

            node = xsd.select1("//xs:schema/xs:simpleType/xs:restriction/xs:enumeration");
            tagName = enterState(node);
            bc[tagName](node, jsonSchema, xsd)

            let property = getLastProperty(bc.workingJsonSchema);

            expect(property.description).toBeFalsy();
        });

        it("should pass because description is valid", function () {
            bc.parsingState.exitState();
            bc.parsingState.exitState();

            node = xsd.select1("//xs:schema/xs:simpleType[3]");
            tagName = enterState(node);

            node = xsd.select1("//xs:schema/xs:simpleType[3]/xs:restriction");
            tagName = enterState(node);
            bc[tagName](node, jsonSchema, xsd)

            node = xsd.select1("//xs:schema/xs:simpleType[3]/xs:restriction/xs:enumeration");
            tagName = enterState(node);
            bc[tagName](node, jsonSchema, xsd)

            bc.parsingState.exitState();

            node = xsd.select1("//xs:schema/xs:simpleType[3]/xs:restriction/xs:enumeration[2]");
            tagName = enterState(node);
            bc[tagName](node, jsonSchema, xsd)
            
            let property = getLastProperty(bc.workingJsonSchema);

            expect(property.description).toEqual("2 - Importa");
        });

        it("should pass because description is valid", function () {
            bc.parsingState.exitState();
            bc.parsingState.exitState();

            node = xsd.select1("//xs:schema/xs:simpleType[3]");
            tagName = enterState(node);

            node = xsd.select1("//xs:schema/xs:simpleType[3]/xs:restriction");
            tagName = enterState(node);
            bc[tagName](node, jsonSchema, xsd)

            node = xsd.select1("//xs:schema/xs:simpleType[3]/xs:restriction/xs:enumeration");
            tagName = enterState(node);
            bc[tagName](node, jsonSchema, xsd)
            
            bc.parsingState.exitState();

            node = xsd.select1("//xs:schema/xs:simpleType[3]/xs:restriction/xs:enumeration[2]");
            tagName = enterState(node);
            bc[tagName](node, jsonSchema, xsd)

            bc.parsingState.exitState();

            node = xsd.select1("//xs:schema/xs:simpleType[3]/xs:restriction/xs:enumeration[3]");
            tagName = enterState(node);
            bc[tagName](node, jsonSchema, xsd)
            let property = getLastProperty(bc.workingJsonSchema);

            expect(property.description).toEqual("2 - Importa / 3 - Ordem");
        });


    });

});