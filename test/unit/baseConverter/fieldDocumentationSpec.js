"use strict";

const XsdFile = require("xsd2jsonschema").XsdFile;
const BaseConverter = require("xsd2jsonschema").BaseConverter;
const JsonSchemaFile = require("xsd2jsonschema").JsonSchemaFile;
//const utils = require("../../../src/utils");


describe("BaseConverter <FieldDocumentation>", function () {
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
        <xs:complexType name="FieldDocumentation">
            <xs:sequence>
                <xs:element name="Element1" type="xs:string">
                    <xs:annotation>
                        <xs:documentation>Teste</xs:documentation>
                        <xs:appinfo>
                            <FieldDocumentation product="PRODUTO1">
                                <Field>FIELD1</Field>
                                <Required>Não</Required>
                                <Type>Char</Type>
                                <Length>7</Length>
                                <Description>tESTE1</Description>
                            </FieldDocumentation>
                            <FieldDocumentation product="PRODUTO2">
                                <Field>FIELD1</Field>
                                <Required>Não</Required>
                                <Type>Char</Type>
                                <Length>7</Length>
                                <Description>tESTE1</Description>
                            </FieldDocumentation>
                        </xs:appinfo>
                    </xs:annotation>
                </xs:element>
                <xs:element name="Element2" type="xs:string">
                    <xs:annotation>
                        <xs:documentation>Teste</xs:documentation>
                        <xs:appinfo>
                            <FieldDocumentation product="PRODUTO1">
                                <Field>FIELD1</Field>
                                <Required>Não</Required>
                                <Type>Char</Type>
                                <Length>7</Length>
                                <Description>tESTE1</Description>
                            </FieldDocumentation>
                            <FieldDocumentation product="PRODUTO2">
                                <Field>FIELD1</Field>
                                <Required>Não</Required>
                                <Type>Char</Type>
                                <Length>7</Length>
                                <Description>tESTE1</Description>
                            </FieldDocumentation>
                        </xs:appinfo>
                    </xs:annotation>
                </xs:element>
                <xs:element name="ListOfBankingInformation" minOccurs="0" maxOccurs="1">
                    <xs:complexType>
                        <xs:sequence>
                            <xs:element name="BankingInformation" maxOccurs="unbounded" minOccurs="0">
                                <xs:complexType>
                                    <xs:sequence>
                                        <xs:element name="BankCode" type="xs:int" minOccurs="0">
                                            <xs:annotation>
                                                <xs:documentation>Código do banco</xs:documentation>
                                                <xs:appinfo>
                                                    <FieldDocumentation product="DATASUL">
                                                        <Field>emitente.cod-banco</Field>
                                                        <Required>sim</Required>
                                                        <Type>integer</Type>
                                                        <Length>999</Length>
                                                        <Description>
                                                            Código do banco junto a FEBRABAN
                                                        </Description>
                                                    </FieldDocumentation>
                                                    <FieldDocumentation product="LOGIX">
                                                    </FieldDocumentation>
                                                    <FieldDocumentation product="PROTHEUS">
                                                    </FieldDocumentation>
                                                    <FieldDocumentation product="RM">
                                                    </FieldDocumentation>
                                                </xs:appinfo>
                                            </xs:annotation>
                                        </xs:element>
                                    </xs:sequence>
                                </xs:complexType>
                            </xs:element>    
                        </xs:sequence>
                    </xs:complexType>
                </xs:element>    
                <xs:element name="ECFTaxing" minOccurs="0">
                    <xs:complexType>
                        <xs:sequence>
                            <xs:element name="Code" minOccurs="0">
                                <xs:annotation>
                                    <xs:appinfo>
                                        <FieldDocumentation product="RM">
                                            <Field>test</Field>
                                            <Required>Nao</Required>
                                            <Type>char</Type>
                                            <Length>10</Length>
                                            <Description>Código da Tributação ECF</Description>
                                        </FieldDocumentation>
                                    </xs:appinfo>
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

    function readElement() {
        node = xsd.select1("//xs:schema/xs:complexType/xs:sequence/xs:element");
        tagName = enterState(node);
        bc[tagName](node, jsonSchema, xsd);
        
        node = xsd.select1("//xs:schema/xs:complexType/xs:sequence/xs:element/xs:annotation");
        tagName = enterState(node);
        bc[tagName](node, jsonSchema, xsd);

        node = xsd.select1("//xs:schema/xs:complexType/xs:sequence/xs:element/xs:annotation/xs:appinfo");
        tagName = enterState(node);
        bc[tagName](node, jsonSchema, xsd);
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

     

       
    });

    afterEach(function () {});

    describe("in FieldDocumentation state", function () {

        it("should pass because this state is implemented", function () {
            readElement();
            expect(bc[tagName](node, jsonSchema, xsd)).toBeTruthy();
        });

        it("should pass because workingJsonSchema have value", function () {
            readElement();
            node = getFirstChildNode(node, "FieldDocumentation");
            tagName = enterState(node);

            bc[tagName](node, jsonSchema, xsd);
            expect(bc.workingJsonSchema != undefined).toBeTruthy();
        });

        it("should pass because xTotvs was add", function () {
            readElement();
            node = getFirstChildNode(node, "FieldDocumentation");
            tagName = enterState(node);

            bc[tagName](node, jsonSchema, xsd);
            let property = getLastProperty(bc.workingJsonSchema);
            expect(property.xtotvs.length > 0).toBeTruthy();
        });

        it("should pass because more than 1 obj was add  in xTotvs attribute", function () {
            readElement();
            let nodes = getChildNodes(node, "FieldDocumentation");

            nodes.map(x => {
                tagName = enterState(x);
                bc[tagName](x, jsonSchema, xsd)
            });

            let property = getLastProperty(bc.workingJsonSchema);
            expect(property.xtotvs.length > 1).toBeTruthy();
        });


        it("should pass because more than 1 obj was add  in xTotvs attribute", function () {          

            readElement();
            let nodes = getChildNodes(node, "FieldDocumentation");

            nodes.map(x => {
                 tagName = enterState(x);
                 bc[tagName](x, jsonSchema, xsd)
            });

             let property = getLastProperty(bc.workingJsonSchema);
             expect(property.xtotvs.length > 1).toBeTruthy();
         });

         it("should pass because more than 1 obj was add  in xTotvs attribute", function () {          

            node = xsd.select1("//xs:schema/xs:complexType/xs:sequence/xs:element[4]");
            tagName =  enterState(node);
            bc[tagName](node, jsonSchema, xsd);

            node = xsd.select1("//xs:schema/xs:complexType/xs:sequence/xs:element[4]/xs:complexType");
            tagName =  enterState(node);

            node = xsd.select1("//xs:schema/xs:complexType/xs:sequence/xs:element[4]/xs:complexType/xs:sequence");
            tagName =  enterState(node);
           
            node = xsd.select1("//xs:schema/xs:complexType/xs:sequence/xs:element[4]/xs:complexType/xs:sequence/xs:element");
            tagName =  enterState(node);
            bc[tagName](node, jsonSchema, xsd);

            node = xsd.select1("//xs:schema/xs:complexType/xs:sequence/xs:element[4]/xs:complexType/xs:sequence/xs:element/xs:annotation/xs:appinfo");
            tagName =  enterState(node);
            
            node = getFirstChildNode(node, "FieldDocumentation");
            tagName = enterState(node);
            bc[tagName](node, jsonSchema, xsd);          
            

             let property = getLastProperty(bc.workingJsonSchema);
             property = getLastProperty(property);
             expect(property.xtotvs.length > 0).toBeTruthy();
         });

    });

    describe("in Note state", function () {
        it("should pass because xTotvs.Note is equals mock", function () {
            readElement();
            node = getFirstChildNode(node, "FieldDocumentation");
            tagName = enterState(node);
            bc[tagName](node, jsonSchema, xsd);

            node = getFirstChildNode(node, "Description");
            tagName = enterState(node);
            bc[tagName](node, jsonSchema, xsd);

            let property = getLastProperty(bc.workingJsonSchema);
          
          expect(property.xtotvs[0].product).toEqual("PRODUTO1");
            var xtotvs = property.xtotvs[0];

            expect(xtotvs.note).toEqual("tESTE1");
        });

    });

    describe("in Field state", function () {
        it("should pass because xTotvs was filled", function () {
            readElement();
            node = getFirstChildNode(node, "FieldDocumentation");
            tagName = enterState(node);
            bc[tagName](node, jsonSchema, xsd);

            node = getFirstChildNode(node, "Field");
            tagName = enterState(node);
            bc.handleXTotvs(node, "Field");

            let property = getLastProperty(bc.workingJsonSchema);
          //  var xtotvs = property.xtotvs[0]["PRODUTO1"];
          expect(property.xtotvs[0].Product).toEqual("PRODUTO1");
            var xtotvs = property.xtotvs[0];

            expect(xtotvs.field).toBeTruthy();
        });

    });

    describe("in ListOf", function () {
        it("should pass because xTotvs was filled", function () {
            
            node = xsd.select1("//xs:schema/xs:complexType/xs:sequence/xs:element[3]");
            tagName = enterState(node);
            bc[tagName](node, jsonSchema, xsd);

            node = xsd.select1("//xs:schema/xs:complexType/xs:sequence/xs:element[3]/xs:complexType/xs:sequence/xs:element");
            tagName = enterState(node);
            bc[tagName](node, jsonSchema, xsd);

            node = xsd.select1("//xs:schema/xs:complexType/xs:sequence/xs:element[3]/xs:complexType/xs:sequence/xs:element/xs:complexType/xs:sequence/xs:element");
            tagName = enterState(node);
            bc[tagName](node, jsonSchema, xsd);
            

            node = xsd.select1("//xs:schema/xs:complexType/xs:sequence/xs:element[3]/xs:complexType/xs:sequence/xs:element/xs:complexType/xs:sequence/xs:element/xs:annotation/xs:appinfo");
            tagName = enterState(node);
            bc[tagName](node, jsonSchema, xsd);

            node = getFirstChildNode(node, "FieldDocumentation");
            tagName = enterState(node);
            bc[tagName](node, jsonSchema, xsd);

            let property = getLastProperty(bc.workingJsonSchema);
            property = getLastProperty(property.items);
            expect(property.xtotvs.length > 0).toBeTruthy();

            node = getFirstChildNode(node, "Field");
            tagName = enterState(node);
            bc.handleXTotvs(node, "field");
            
           // var xtotvs = property.xtotvs[0]["DATASUL"];
           expect(property.xtotvs[0].product).toEqual("DATASUL");
            var xtotvs = property.xtotvs[0];
            expect(xtotvs.field).toBeTruthy();
        });
    });

});