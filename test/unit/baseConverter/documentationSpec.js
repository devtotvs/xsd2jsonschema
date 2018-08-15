"use strict";

const XsdFile = require("xsd2jsonschema").XsdFile;
const BaseConverter = require("xsd2jsonschema").BaseConverter;
const JsonSchemaFile = require("xsd2jsonschema").JsonSchemaFile;

describe("BaseConverter <Documentation>", function () {
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
        <xs:complexType name="Documentation">
            <xs:sequence>
                <xs:element name="Element1" type="xs:string">
                    <xs:annotation>
                        <xs:documentation>Teste</xs:documentation>                     
                    </xs:annotation>
                </xs:element>
                <xs:element name="Element2" type="xs:string" minOccurs="0" maxOccurs="1">
                    <xs:annotation>
                        <xs:documentation>Test2e</xs:documentation>                   
                    </xs:annotation>
                    <xs:simpleType>
                        <xs:restriction base="xs:string">
                            <xs:enumeration value="Customer"><xs:annotation><xs:documentation>Cliente</xs:documentation></xs:annotation></xs:enumeration>
                            <xs:enumeration value="Vendor"><xs:annotation><xs:documentation>Fornecedor</xs:documentation></xs:annotation></xs:enumeration>
                            <xs:enumeration value="Both"><xs:annotation><xs:documentation>Ambos</xs:documentation></xs:annotation></xs:enumeration>
                        </xs:restriction>
				    </xs:simpleType>
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

        node = xsd.select1("//xs:schema/xs:complexType/xs:sequence/xs:element");
        tagName = enterState(node);
        bc[tagName](node, jsonSchema, xsd);

        node = xsd.select1("//xs:schema/xs:complexType/xs:sequence/xs:element/xs:annotation");
        tagName = enterState(node);
        bc[tagName](node, jsonSchema, xsd);

        
    });

    afterEach(function () {});

    describe("in FieldDocumentation state", function () {

        it("should pass because this state is implemented", function () {        
            node = xsd.select1("//xs:schema/xs:complexType/xs:sequence/xs:element/xs:annotation/xs:documentation");
            tagName = enterState(node);  
            expect(!bc[tagName](node, jsonSchema, xsd)).toBeTruthy();
        });

        it('tracks the spy for handleElementDocumentation method', function () {
            
            
            spyOn(bc, 'handleElementDocumentation');
            node = xsd.select1("//xs:schema/xs:complexType/xs:sequence/xs:element/xs:annotation/xs:documentation");
            tagName = enterState(node);  
            bc[tagName](node, jsonSchema, xsd)

            expect(bc.handleElementDocumentation).toHaveBeenCalled();
        });

        it("should pass because descripiton is equal as the mock", function () {
            node = xsd.select1("//xs:schema/xs:complexType/xs:sequence/xs:element/xs:annotation/xs:documentation");
            tagName = enterState(node);  

            bc[tagName](node, jsonSchema, xsd);
            let property = getLastProperty(bc.workingJsonSchema);
            expect(property.description  == "Teste").toBeTruthy();
        });

        
        it("should pass because descripiton is equal as the mock", function () {
            node = xsd.select1("//xs:schema/xs:complexType/xs:sequence/xs:element[2]/xs:annotation/xs:documentation");
            tagName = enterState(node);  
            bc[tagName](node, jsonSchema, xsd);
            let property = getLastProperty(bc.workingJsonSchema);
            expect(property.description  == "Test2e").toBeTruthy();
        });

        it("must be false because the description in the enumeration is filled by another method", function () {
            node = xsd.select1("//xs:schema/xs:complexType/xs:sequence/xs:element[2]/xs:simpleType/xs:restriction/xs:enumeration/xs:annotation/xs:documentation");
            tagName = enterState(node);  
            bc[tagName](node, jsonSchema, xsd);

            expect(bc[tagName](node, jsonSchema, xsd)).toBeFalsy();
        });
       
    });

   

});