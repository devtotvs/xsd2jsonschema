"use strict";

const XsdFile = require("xsd2jsonschema").XsdFile;
const BaseConverter = require("xsd2jsonschema").BaseConverter;
const JsonSchemaFile = require("xsd2jsonschema").JsonSchemaFile;

describe("BaseConverter <MessageDocumentation>", function () {
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
       
        <xs:annotation>
		<xs:appinfo>
			<MessageDocumentation>
				<Name>Financing</Name>
				<Description>Geração dos lançamentos</Description>
				<Segment>Incorporação</Segment>
				<ProductInformation product="RM">
					<Contact>Guilherme</Contact>
					<Description>GDP Inovação</Description>
                    <Adapter>Financing</Adapter>
                    <Send>
						<Request>não</Request>
						<Insert>sim</Insert>
						<Update>sim</Update>
						<Delete>sim</Delete>
					</Send>
					<Receive>
						<Insert>não</Insert>
						<Update>não</Update>
						<Delete>não</Delete>
					</Receive>				
				</ProductInformation>
				<ProductInformation product="PROTHEUS">
					<Contact></Contact>
					<Description></Description>
					<Adapter></Adapter>					
				</ProductInformation>
            </MessageDocumentation>
            <MessageDocumentation></MessageDocumentation>
		</xs:appinfo>
	</xs:annotation>
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

        node = xsd.select1("//xs:schema/xs:annotation");
        tagName = enterState(node);
        bc[tagName](node, jsonSchema, xsd);

        node = xsd.select1("//xs:schema/xs:annotation/xs:appinfo");
        tagName = enterState(node);
        bc[tagName](node, jsonSchema, xsd);   
        
        node = getFirstChildNode(node, "MessageDocumentation");
        tagName = enterState(node);
        bc[tagName](node, jsonSchema, xsd);    
    });
   
    describe("in appInfo state with duplicated MessageDocumentation tag", function() {
        it("should create property '_warningConversorAuto' inside 'info'", function() {            
            var conversionWarningAuto = jsonSchema.info._warningConversorAuto;
            expect(conversionWarningAuto).toBeTruthy();
        });
    });

    describe("in MessageDocumentation state", function () {      
        it("should pass because this state is implemented", function () {
            expect(Object.keys(jsonSchema.info).length > 0).toBeTruthy();
        });

        it("should pass because title is equals mock", function () {
            let info = bc.handleMessageName("Financing_1_000");
            expect(info.title).toEqual("Financing");
        });

        it("should pass because version is equals mock", function () {
            let info = bc.handleMessageName("Financing_1_000");
            expect(info.version).toEqual("1.000");
        });

        it('tracks the spy for handleXMessageTotvs method', function () {

            spyOn(bc, 'handleXMessageTotvs');
            node = getFirstChildNode(node, "Name");
            tagName = enterState(node);
            bc[tagName](node, jsonSchema, xsd);

            expect(bc.handleXMessageTotvs).toHaveBeenCalled();
        });

        it('tracks the spy for handleXMessageTotvs method', function () {

            spyOn(bc, 'handleXMessageTotvs');
            node = getFirstChildNode(node, "Segment");
            tagName = enterState(node);
            bc[tagName](node, jsonSchema, xsd);

            expect(bc.handleXMessageTotvs).toHaveBeenCalled();
        });

        it("should pass because Name is equals mock", function () {
            node = getFirstChildNode(node, "Name");
            bc.handleXMessageTotvs(node, jsonSchema, "xName");

            expect(jsonSchema.info.xTotvs.messageDocumentation.name).toEqual("Financing");
        });

        it("should pass because Segment is equals mock", function () {
            let node1 = getFirstChildNode(node, "Name");
            bc.handleXMessageTotvs(node1, jsonSchema, "xName");



            node = getFirstChildNode(node, "Segment");
            bc.handleXMessageTotvs(node, jsonSchema, "xSegment");

            expect(jsonSchema.info.xTotvs.messageDocumentation.segment).toEqual("Incorporação");
        });

        it('tracks the spy for handleXMessageTotvs method', function () {

            spyOn(bc, 'handleXMessageTotvs');
            node = getFirstChildNode(node, "Description");
            tagName = enterState(node);
            bc[tagName](node, jsonSchema, xsd);

            expect(bc.handleXMessageTotvs).toHaveBeenCalled();
        });

        it("should pass because Description is equals mock", function () {
            node = getFirstChildNode(node, "Description");
            bc.handleXMessageTotvs(node, jsonSchema, "xDescription");

            expect(jsonSchema.info.xTotvs.messageDocumentation.description).toEqual("Geração dos lançamentos");
        });

        it("should pass because ProductInformation was created ", function () {
            node = getFirstChildNode(node, "ProductInformation");
            tagName = enterState(node);
            bc[tagName](node, jsonSchema, xsd);


            expect(jsonSchema.info.xTotvs.productInformation).toBeTruthy();
        });

        it("should pass because ProductInformation was filled", function () {
            node = getFirstChildNode(node, "ProductInformation");
            tagName = enterState(node);
            bc[tagName](node, jsonSchema, xsd);


            expect(jsonSchema.info.xTotvs.productInformation.length).toEqual(1);
        });

        it("should pass because ProductInformation was filled", function () {
            let node1 = getFirstChildNode(node, "ProductInformation");
            tagName = enterState(node1);
            bc[tagName](node, jsonSchema, xsd);

            bc.parsingState.exitState();

            node = getFirstChildNode(node, "ProductInformation");
            tagName = enterState(node);
            bc[tagName](node, jsonSchema, xsd);

            expect(jsonSchema.info.xTotvs.productInformation.length).toEqual(2);
        });

        it("should pass because ProductInformation was filled", function () {
            node = getFirstChildNode(node, "ProductInformation");
            tagName = enterState(node);
            bc[tagName](node, jsonSchema, xsd);


            expect(jsonSchema.info.xTotvs.productInformation[0].product).toEqual("RM");
        });

        it('tracks the spy for handleXMessageTotvs method', function () {
            node = getFirstChildNode(node, "ProductInformation");
            tagName = enterState(node);
            bc[tagName](node, jsonSchema, xsd);

            spyOn(bc, 'handleProductInformationItems');

            node = getFirstChildNode(node, "Contact");
            tagName = enterState(node);
            bc[tagName](node, jsonSchema, xsd);

            expect(bc.handleProductInformationItems).toHaveBeenCalled();
        });

        it("should pass because ProductInformation.contact is equals mock", function () {
            node = getFirstChildNode(node, "ProductInformation");
            tagName = enterState(node);
            bc[tagName](node, jsonSchema, xsd);

            node = getFirstChildNode(node, "Contact");
            bc.handleProductInformationItems(node, jsonSchema, "xContact");

            expect(jsonSchema.info.xTotvs.productInformation[0].contact).toEqual("Guilherme");
        });

        it('tracks the spy for handleXMessageTotvs method', function () {
            node = getFirstChildNode(node, "ProductInformation");
            tagName = enterState(node);
            bc[tagName](node, jsonSchema, xsd);

            spyOn(bc, 'handleProductInformationItems');

            node = getFirstChildNode(node, "Adapter");
            tagName = enterState(node);
            bc[tagName](node, jsonSchema, xsd);

            expect(bc.handleProductInformationItems).toHaveBeenCalled();
        });

        it("should pass because ProductInformation.contact is equals mock", function () {
            node = getFirstChildNode(node, "ProductInformation");
            tagName = enterState(node);
            bc[tagName](node, jsonSchema, xsd);

            node = getFirstChildNode(node, "Adapter");
            bc.handleProductInformationItems(node, jsonSchema, "xAdapter");

            expect(jsonSchema.info.xTotvs.productInformation[0].adapter).toEqual("Financing");
        });


        it('tracks the spy for handleProductInformationItems method', function () {
            node = getFirstChildNode(node, "ProductInformation");
            tagName = enterState(node);
            bc[tagName](node, jsonSchema, xsd);

            spyOn(bc, 'handleProductInformationItems');
            node = getFirstChildNode(node, "Description");
            tagName = enterState(node);
            bc[tagName](node, jsonSchema, xsd);

            expect(bc.handleProductInformationItems).toHaveBeenCalled();
        });

        it("should pass because ProductInformation.Description is equals mock", function () {
            node = getFirstChildNode(node, "ProductInformation");
            tagName = enterState(node);
            bc[tagName](node, jsonSchema, xsd);

            node = getFirstChildNode(node, "Description");
            bc.handleProductInformationItems(node, jsonSchema, "xNote");

            expect(jsonSchema.info.xTotvs.productInformation[0].note).toEqual("GDP Inovação");
        });

        it("should pass because ProductInformation.Send is false", function () {
            node = getFirstChildNode(node, "ProductInformation");
            tagName = enterState(node);
            bc[tagName](node, jsonSchema, xsd);

            node = getFirstChildNode(node, "Send");
            tagName = enterState(node);

            expect(bc[tagName](node, jsonSchema, xsd)).toBeFalsy();
        });

        it("should pass because ProductInformation.Receive is false", function () {
            node = getFirstChildNode(node, "ProductInformation");
            tagName = enterState(node);
            bc[tagName](node, jsonSchema, xsd);

            node = getFirstChildNode(node, "Receive");
            tagName = enterState(node);

            expect(bc[tagName](node, jsonSchema, xsd)).toBeFalsy();
        });
    });



});