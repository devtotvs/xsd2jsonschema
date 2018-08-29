"use strict";

const XsdFile = require("xsd2jsonschema").XsdFile;
const BaseConverter = require("xsd2jsonschema").BaseConverter;
const JsonSchemaFile = require("xsd2jsonschema").JsonSchemaFile;
const jsonSchemaTypes = require("xsd2jsonschema").JsonSchemaTypes;

describe("BaseConverter <element>", function () {
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
                <xs:element name="ListOfUndboundMaxOccurs" minOccurs="0">
                    <xs:complexType>
                        <xs:sequence>
                            <xs:element name="ListItem" type="ListItemType" maxOccurs="unbounded" minOccurs="0">
                            </xs:element>
                        </xs:sequence>
                    </xs:complexType>
                </xs:element>  
                <xs:element name="ListOfLimitedMaxOccurs" minOccurs="0">
                    <xs:complexType>
                        <xs:sequence>
                            <xs:element name="ListItem" type="ListItemType" maxOccurs="50" minOccurs="0">
                            </xs:element>
                        </xs:sequence>
                    </xs:complexType>
                </xs:element>   
                <xs:element name="ListOfUndboundMaxOccurs" minOccurs="0" maxOccurs="25">
                    <xs:complexType>
                        <xs:sequence>
                            <xs:element name="ListItem" type="ListItemType" maxOccurs="unbounded" minOccurs="0">
                            </xs:element>
                        </xs:sequence>
                    </xs:complexType>
                </xs:element>  
                <xs:element name="LUndboundMaxOccurs" minOccurs="0">
                    <xs:complexType>
                        <xs:sequence>
                            <xs:element name="ListItem" type="ListItemType" maxOccurs="unbounded" minOccurs="0">
                            </xs:element>
                        </xs:sequence>
                    </xs:complexType>
                </xs:element>  
                <xs:element name="LLimitedMaxOccurs" minOccurs="0">
                    <xs:complexType>
                        <xs:sequence>
                            <xs:element name="ListItem" type="ListItemType" maxOccurs="30" minOccurs="0">
                            </xs:element>
                        </xs:sequence>
                    </xs:complexType>
                </xs:element>           
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
            uri: 'MessageDocumentation-unit-test',
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
    });

    function getLastProperty(schema) {
        if (schema.properties) {
            let prop = Object.keys(schema.properties);
            prop = prop[prop.length - 1];
            return schema.properties[prop];
        }
    }

    function readElement(index) {
        node = xsd.select1("//xs:schema/xs:complexType/xs:sequence/xs:element[" + index + "]");
        tagName = enterState(node);
    }     

    function checkIfObjectOfTypeArrayWasCreated() {
        bc.handleElementLocal(node, jsonSchema, xsd);
        let property = getLastProperty(bc.workingJsonSchema);
        return (property.type == jsonSchemaTypes.ARRAY);
    }

    function checkIfObjectOfTypeObjectWasCreated() {
        bc.handleElementLocal(node, jsonSchema, xsd);
        let property = getLastProperty(bc.workingJsonSchema);
        return (property.type == jsonSchemaTypes.OBJECT);
    }

    function convertAndAccessChildItemList(index) {
        //ListOf element
        bc.handleElementLocal(node, jsonSchema, xsd);           
        //Child item element
        node = xsd.select1("//xs:schema/xs:complexType/xs:sequence/xs:element[" + index + "]/xs:complexType/xs:sequence/xs:element");
        tagName = enterState(node);                      
        bc.handleElementLocal(node, jsonSchema, xsd);   
    }

    describe("is an element starting with the name 'listOf' and has a child node with unbound maxOccurs", function () {
        let index = 1;
        beforeEach(function () {
            readElement(index);
        });
        
        it("should pass because an object of type array was created", function () {
            expect(checkIfObjectOfTypeArrayWasCreated()).toBeTruthy();          
        });        

        it("should pass because maxItems wasn't created", function () {
            bc.handleElementLocal(node, jsonSchema, xsd);
            let property = getLastProperty(bc.workingJsonSchema);
            expect(property.maxItems).toBeFalsy();
        });        
    });

    describe("is an element starting with the name 'listOf' and has a child node with limited maxOccurs", function () {
        let index = 2;
        beforeEach(function () {
            readElement(index);
        });

        it("should pass because an object of type array was created", function () {
            expect(checkIfObjectOfTypeArrayWasCreated()).toBeTruthy();
        });        

        it("should pass because maxItems was successfuly created", function () {
            convertAndAccessChildItemList(index);         
            //Expects
            let property = getLastProperty(bc.workingJsonSchema); //ListOf          
            expect(property.maxItems).toBeTruthy();
            expect(property.maxItems).toEqual(50);
        });        
    });

    describe("is an element starting with the name 'listOf' and has some value in it's maxOccurs", function () {
        let index = 3;
        
        beforeEach(function () {
            readElement(index);
        });
        
        it("should pass because an object of type array was created", function () {
            expect(checkIfObjectOfTypeArrayWasCreated()).toBeTruthy();
        });        

        it("should pass because maxItems was totally ignored", function () {
            bc.handleElementLocal(node, jsonSchema, xsd);
            let property = getLastProperty(bc.workingJsonSchema);
            expect(property.maxItems).toBeFalsy();
        });        
    });

    describe("is an element that doesn't start with the name 'listOf' with unbound maxOccurs", function () {
        let index = 4;
        beforeEach(function () {
            readElement(index);
        });
        
        it("should pass because an object of type object was created", function () {
            expect(checkIfObjectOfTypeObjectWasCreated()).toBeTruthy();
        });     
        
        it("should pass because it's child node became an object of type array", function () {
            convertAndAccessChildItemList(index);    
            //Expects
            let property = getLastProperty(bc.workingJsonSchema); //ListOf    
            property = getLastProperty(property); //ChildNode / ListItem
            return (property.type == jsonSchemaTypes.ARRAY);
        });   
        
        it("should pass because maxItems wasn't created", function () {
            convertAndAccessChildItemList(index);           
             //Expects
             let property = getLastProperty(bc.workingJsonSchema); //ListOf          
             expect(property.maxItems).toBeFalsy();
        });   
    });

    describe("is an element that doesn't start with the name 'listOf' with limited maxOccurs", function () {
        let index = 5;
        beforeEach(function () {
            readElement(index);
        });
        
        it("should pass because an object of type object was created", function () {
            expect(checkIfObjectOfTypeObjectWasCreated()).toBeTruthy();
        });     
        
        it("should pass because it's child node became an object of type array", function () {
            convertAndAccessChildItemList(index);           
            //Expects
            let property = getLastProperty(bc.workingJsonSchema); //ListOf    
            property = getLastProperty(property); //ChildNode / ListItem
            return (property.type == jsonSchemaTypes.ARRAY);
        });   
        
        it("should pass because maxItems was successfuly created in it's child node", function () {
            convertAndAccessChildItemList(index);          
            //Expects
            let property = getLastProperty(bc.workingJsonSchema); //ListOf    
            property = getLastProperty(property); //ChildNode / ListItem      
            expect(property.maxItems).toBeTruthy();
            expect(property.maxItems).toEqual(30);
        });        
    });
});