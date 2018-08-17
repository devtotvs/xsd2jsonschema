"use strict";

const XsdFile = require("xsd2jsonschema").XsdFile;
const BaseConverter = require("xsd2jsonschema").BaseConverter;
const JsonSchemaFile = require("xsd2jsonschema").JsonSchemaFile;
const jsonSchemaTypes = require("xsd2jsonschema").JsonSchemaTypes;

describe("BaseConverter <Element>", function () {
    var bc;
    var xsd;
    var jsonSchema;

    var customType;
    var propertyName;
    var minOccursAttr;
    var maxOccursAttr;

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
                <xs:element name="Element1" type="xs:string">
                </xs:element>
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
                <xs:element name="ListOfBankingInformation" minOccurs="0" maxOccurs="1">
                    <xs:complexType>
                        <xs:sequence>
                            <xs:element name="BankingInformation" maxOccurs="unbounded" minOccurs="0">
                                <xs:complexType>
                                    <xs:sequence>
                                        <xs:element name="BankCode" type="xs:int" minOccurs="0">
                                            <xs:annotation>
                                                <xs:documentation>Código do banco</xs:documentation>											
                                            </xs:annotation>
                                        </xs:element>
                                        <xs:element name="BankInternalId" type="xs:string" minOccurs="0" maxOccurs="1">
                                            <xs:annotation>
                                                <xs:documentation>InternalId do BankCode</xs:documentation>
                                            </xs:annotation>
                                        </xs:element>
                                        </xs:sequence>
                                </xs:complexType>
                            </xs:element>
                        </xs:sequence>
                    </xs:complexType>
                </xs:element>
                <xs:element name="GovernmentalInformation" type="GovernmentalInformationType" minOccurs="0" maxOccurs="1">
                    <xs:annotation>
                        <xs:documentation>CNPJ, Inscrição Estadual, Inscrição Municipal</xs:documentation>
                    </xs:annotation>
                </xs:element>
                <xs:element name="ListOfGovernmentalInformation" type="GovernmentalInformationType" minOccurs="0" maxOccurs="1">
                    <xs:annotation>
                        <xs:documentation>CNPJ, Inscrição Estadual, Inscrição Municipal</xs:documentation>
                    </xs:annotation>
                </xs:element>
                <xs:element name="BillingInformation" minOccurs="0">
				    <xs:complexType>
					    <xs:sequence>
                            <xs:element name="BillingCustomerCode" type="xs:int" minOccurs="0"> </xs:element>
                            <xs:element name="BillingCustomerCode1" type="xs:int" minOccurs="0" maxOccurs="4"> </xs:element>
                        </xs:sequence>
                    </xs:complexType>
                </xs:element>
            </xs:sequence>            
        </xs:complexType>
        <xs:element name="BusinessContent" type="BusinessContentType" substitutionGroup="AbstractBusinessContent"/>

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


    function readElement(index = 1) {
        node = xsd.select1("//xs:schema/xs:complexType/xs:sequence/xs:element[" + index + "]");
        tagName = enterState(node);
    }

    function readLisOf(index) {
        node = xsd.select1("//xs:schema/xs:complexType/xs:sequence/xs:element[" + index + "]/xs:complexType");
        tagName = enterState(node);
        bc[tagName](node, jsonSchema, xsd);

        node = xsd.select1("//xs:schema/xs:complexType/xs:sequence/xs:element[" + index + "]/xs:complexType/xs:sequence");
        tagName = enterState(node);
        bc[tagName](node, jsonSchema, xsd);

        node = xsd.select1("//xs:schema/xs:complexType/xs:sequence/xs:element[" + index + "]/xs:complexType/xs:sequence/xs:element");
        tagName = enterState(node);
        bc[tagName](node, jsonSchema, xsd);

    }

    function readListOfAnonymous() {
        node = xsd.select1("//xs:schema/xs:complexType/xs:sequence/xs:element[6]/xs:complexType");
        tagName = enterState(node);
        bc[tagName](node, jsonSchema, xsd);

        node = xsd.select1("//xs:schema/xs:complexType/xs:sequence/xs:element[6]/xs:complexType/xs:sequence");
        tagName = enterState(node);
        bc[tagName](node, jsonSchema, xsd);

        node = xsd.select1("//xs:schema/xs:complexType/xs:sequence/xs:element[6]/xs:complexType/xs:sequence/xs:element");
        tagName = enterState(node);
        bc[tagName](node, jsonSchema, xsd);

        node = xsd.select1("//xs:schema/xs:complexType/xs:sequence/xs:element[6]/xs:complexType/xs:sequence/xs:element/xs:complexType");
        tagName = enterState(node);
        bc[tagName](node, jsonSchema, xsd);

        node = xsd.select1("//xs:schema/xs:complexType/xs:sequence/xs:element[6]/xs:complexType/xs:sequence/xs:element/xs:complexType/xs:sequence");
        tagName = enterState(node);
        bc[tagName](node, jsonSchema, xsd);
    }

    function upStates(level) {
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

        it('tracks the spy for handleElementLocalinSequence method', function () {
            readElement();

            spyOn(bc, 'handleElementLocalinSequence');

            bc.handleElementLocal(node, jsonSchema, xsd)

            expect(bc.handleElementLocalinSequence).toHaveBeenCalled();
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

            customType = bc.namespaceManager.getType("xs:string", jsonSchema, xsd).get$RefToSchema();
            propertyName = "Element1";
            bc.handleElementLocalinSequence(propertyName, customType, undefined, undefined, false);
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

        it("should pass because the type is equal to the second mock element", function () {
            readElement(7);
            bc.handleElementLocal(node, jsonSchema, xsd);


            let property = getLastProperty(bc.workingJsonSchema);
            expect(property.type == jsonSchemaTypes.OBJECT).toBeTruthy();
        });

        it("should pass because 1 element has been added as required", function () {
            readElement(2);

            customType = jsonSchemaTypes.OBJECT;
            propertyName = "Element2";
            minOccursAttr = 1;

            bc.handleElementLocalinSequence(propertyName, customType, minOccursAttr, undefined, false);
            expect(bc.workingJsonSchema.required.length).toBeTruthy();
        });


    });

    describe("is array", function () {
        it("should pass because the element is array", function () {
            readElement(3);

            bc.handleElementLocal(node, jsonSchema, xsd);
            let property = getLastProperty(bc.workingJsonSchema);
            expect(property.type == jsonSchemaTypes.ARRAY).toBeTruthy();
        });

        it('tracks the spy for addPropertyAsArray method', function () {
            spyOn(bc, 'addPropertyAsArray');

            readElement(3);

            bc.handleElementLocal(node, jsonSchema, xsd);

            expect(bc.addPropertyAsArray).toHaveBeenCalled();
        });

        it("should pass because the element have maxItems = 3", function () {
            readElement(3);

            // bc.handleElementLocal(node, jsonSchema, xsd);

            customType = bc.namespaceManager.getType("xs:string", jsonSchema, xsd).get$RefToSchema();
            propertyName = "Element3";
            minOccursAttr = 0;
            maxOccursAttr = 3;
            bc.handleElementLocalinSequence(propertyName, customType, minOccursAttr, maxOccursAttr, true);

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

    describe("is ListOf", function () {
        it("should pass because the type is array ", function () {
            readElement(5);

            bc.handleElementLocal(node, jsonSchema, xsd);

            let property = getLastProperty(bc.workingJsonSchema);
            expect(property.type == jsonSchemaTypes.ARRAY).toBeTruthy();
        });

        it("must pass because the type of items is the same as the child element ", function () {
            readElement(5);
            bc[tagName](node, jsonSchema, xsd);

            node = xsd.select1("//xs:schema/xs:complexType/xs:sequence/xs:element[5]/xs:complexType");
            tagName = enterState(node);
            bc[tagName](node, jsonSchema, xsd);

            node = xsd.select1("//xs:schema/xs:complexType/xs:sequence/xs:element[5]/xs:complexType/xs:sequence");
            tagName = enterState(node);
            bc[tagName](node, jsonSchema, xsd);

            customType = bc.namespaceManager.getType("CommunicationInformationType", jsonSchema, xsd).get$RefToSchema();
            propertyName = "CommunicationInformation";
            minOccursAttr = 0;
            maxOccursAttr = "unbounded";
            bc.handleElementLocalinSequence(propertyName, customType, minOccursAttr, maxOccursAttr, true);


            readElement(5);
            let property = getLastProperty(bc.workingJsonSchema);

            expect(property.items.$ref == customType.$ref).toBeTruthy();
        });


        it("must pass because add 2 lisOf ", function () {
            readElement(5);
            bc[tagName](node, jsonSchema, xsd);

            readLisOf(5);
            upStates(4);
            readElement(6);
            bc.handleElementLocal(node, jsonSchema, xsd);

            let propNames = Object.keys(bc.workingJsonSchema.properties);
            let property = propNames[propNames.length - 1];
            expect(property == "ListOfBankingInformation").toBeTruthy();
        });

        // totdo Element sem type = object - no caso do LisOf, o items deve receber o type do element filho
        it("must pass because type is object ", function () {
            readElement(6);
            bc[tagName](node, jsonSchema, xsd);

            readLisOf(6);

            customType = bc.namespaceManager.getType(jsonSchemaTypes.OBJECT, jsonSchema, xsd).get$RefToSchema();
            customType.type = jsonSchemaTypes.OBJECT;
            propertyName = "BankingInformation";
            minOccursAttr = 0;
            maxOccursAttr = "unbounded";
            bc.handleElementLocalinSequence(propertyName, customType, minOccursAttr, maxOccursAttr, true);

            let property = getLastProperty(bc.workingJsonSchema);
            expect(property.items.type == jsonSchemaTypes.OBJECT).toBeTruthy();
        });

        it("must pass the name of propertie not change when read the child ", function () {
            readElement(6);
            bc[tagName](node, jsonSchema, xsd);

            readLisOf(6);
            bc[tagName](node, jsonSchema, xsd);

            readListOfAnonymous();

            customType = bc.namespaceManager.getType(jsonSchemaTypes.INTEGER, jsonSchema, xsd).get$RefToSchema();
            propertyName = "BankCode";
            minOccursAttr = 0;
            bc.handleElementLocalinSequence(propertyName, customType, minOccursAttr, undefined, false);

            let property = getLastProperty(bc.workingJsonSchema);
            let childPropName = Object.keys(property.items.properties)[0];
            expect(childPropName == propertyName).toBeTruthy();
        });

        it("must pass because the property is correct ", function () {
            readElement(6);
            bc[tagName](node, jsonSchema, xsd);

            readLisOf(6);
            bc[tagName](node, jsonSchema, xsd);

            readListOfAnonymous();

            node = xsd.select1("//xs:schema/xs:complexType/xs:sequence/xs:element[6]/xs:complexType/xs:sequence/xs:element/xs:complexType/xs:sequence/xs:element");
            tagName = enterState(node);
            bc[tagName](node, jsonSchema, xsd);

            upStates(10);

            node = xsd.select1("//xs:schema/xs:complexType/xs:sequence/xs:element[7]");
            tagName = enterState(node);
            bc[tagName](node, jsonSchema, xsd);


            let properties = Object.keys(bc.workingJsonSchema.properties);
            let property = properties[properties.length - 1];
            expect(property == "GovernmentalInformation").toBeTruthy();
        });

        it("must pass because the property is correct ", function () {
            readElement(6);
            bc[tagName](node, jsonSchema, xsd);

            readLisOf(6);
            bc[tagName](node, jsonSchema, xsd);

            readListOfAnonymous();

            node = xsd.select1("//xs:schema/xs:complexType/xs:sequence/xs:element[6]/xs:complexType/xs:sequence/xs:element/xs:complexType/xs:sequence/xs:element");
            tagName = enterState(node);
            bc[tagName](node, jsonSchema, xsd);

            upStates(10);

            node = xsd.select1("//xs:schema/xs:complexType/xs:sequence/xs:element[8]");
            tagName = enterState(node);
            bc[tagName](node, jsonSchema, xsd);


            let properties = Object.keys(bc.workingJsonSchema.properties);
            let property = properties[properties.length - 1];
            expect(property == "ListOfGovernmentalInformation").toBeTruthy();
        });

        it("must pass because the property is correct ", function () {
            readElement(6);
            bc[tagName](node, jsonSchema, xsd);

            readLisOf(6);
            bc[tagName](node, jsonSchema, xsd);

            readListOfAnonymous();

            node = xsd.select1("//xs:schema/xs:complexType/xs:sequence/xs:element[6]/xs:complexType/xs:sequence/xs:element/xs:complexType/xs:sequence/xs:element");
            tagName = enterState(node);
            bc[tagName](node, jsonSchema, xsd);

            upStates(10);

            readElement(9);
            bc[tagName](node, jsonSchema, xsd);

            node = xsd.select1("//xs:schema/xs:complexType/xs:sequence/xs:element[9]/xs:complexType/xs:sequence/xs:element");
            tagName = enterState(node);
            bc.handleElementLocal(node, jsonSchema, xsd);

            let mainProperty = getLastProperty(bc.workingJsonSchema);

            let property = Object.keys(mainProperty.properties)[0];;
            expect(property == "BillingCustomerCode").toBeTruthy();
        });

        it("must pass because the property is correct ", function () {
            readElement(6);
            bc[tagName](node, jsonSchema, xsd);

            readLisOf(6);
            bc[tagName](node, jsonSchema, xsd);

            readListOfAnonymous();

            node = xsd.select1("//xs:schema/xs:complexType/xs:sequence/xs:element[6]/xs:complexType/xs:sequence/xs:element/xs:complexType/xs:sequence/xs:element");
            tagName = enterState(node);
            bc[tagName](node, jsonSchema, xsd);

            upStates(10);

            readElement(9);
            bc[tagName](node, jsonSchema, xsd);

            node = xsd.select1("//xs:schema/xs:complexType/xs:sequence/xs:element[9]/xs:complexType/xs:sequence/xs:element[2]");
            tagName = enterState(node);
            bc.handleElementLocal(node, jsonSchema, xsd);

            let mainProperty = getLastProperty(bc.workingJsonSchema);

            let property = Object.keys(mainProperty.properties)[0];;
            expect(property == "BillingCustomerCode1").toBeTruthy();
        });

    });

    describe("is Global Element", function () {
        it("should pass because a subschema was added", function () {
             readElement();
             bc[tagName](node, jsonSchema, xsd);
            upStates(4);
            node = xsd.select1("//xs:schema");
            tagName = enterState(node);
            bc[tagName](node, jsonSchema, xsd);
            node = xsd.select1("//xs:schema/xs:element");
            tagName = enterState(node);
            bc[tagName](node, jsonSchema, xsd);

          
            expect(readSubSchema(jsonSchema.subSchemas)).toEqual("BusinessContent");
        });
    });

    function readSubSchema(subSchemas){
        let schemaNames = Object.keys(subSchemas);
        schemaNames = schemaNames[schemaNames.length - 1] || schemaNames[0];
        let next = subSchemas[schemaNames].subSchemas
        if(Object.keys(next).length > 0){
            return  readSubSchema(next);
        }
        else{
            return schemaNames;
        }
    }
});