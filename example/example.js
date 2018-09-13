/**
 *  Basic Xsd2JsonSchema usage sample.
 */

"use strict";

const fs = require('fs');

const Xsd2JsonSchema = require('xsd2jsonschema').Xsd2JsonSchema;
const XmlUsageVisitor = require('xsd2jsonschema').XmlUsageVisitor;
const XmlUsageVisitorSum = require('xsd2jsonschema').XmlUsageVisitorSum;
const Ajv = require('ajv');

const ajv = new Ajv({
	allErrors: true,
	verbose: false
});

const action = process.argv[2];

// Options for example
var options = {
	mask: /_\d{4}-\d{2}-\d{2}/,
	outputDir: "example/generated_jsonschema",
	baseId: "https://raw.githubusercontent.com/totvs/ttalk-standard-message/master/jsonschema/schemas/",
	xsdBaseDir: "example/schema/requests/",
};

var xsdFilenames = [
		//"ExampleTypes_2016-01-01.xsd"
		//"commons_1_000.xsd"
		//"CustomerVendor_2_004.xsd"
		
		//"Bank_1_000.xsd",
		//"AccountantAccount_2_002.xsd",
		//"AccountantAccount_2_003.xsd",
		//"/Event/Order_3_006.xsd"
		//"SalesCharge_1_000.xsd"

		"FinancingTrading_1_000.xsd"
		//"RuralMovement_1_000.xsd"
	];

const converter = new Xsd2JsonSchema(options);
if (action === "convertFolder") {
	options.xsdBaseDir = process.argv[3];
	converter.xsdBaseDir = options.xsdBaseDir;
	xsdFilenames = readFiles(options.xsdBaseDir);

	converter.processAllSchemas( {
		xsdFilenames: xsdFilenames
	}, true);
	converter.writeFiles(process.argv[4]);
	converter.dump();
} if (action === "convert") {
	converter.processAllSchemas( {
		xsdFilenames: xsdFilenames
	}, false);
	converter.writeFiles("event");
	converter.dump();
} else if (action === "xml-usage") {
	const visitor = new XmlUsageVisitor();
	converter.processAllSchemas({
		xsdFilenames: xsdFilenames,
		visitor: visitor
	});
	visitor.dump();
} else if (action === "xml-usage-sum") {
	const visitor = new XmlUsageVisitorSum();
	converter.processAllSchemas({
		xsdFilenames: xsdFilenames,
		visitor: visitor
	});
	visitor.dump();
} else if (action === "test-custom-type") {
	converter.processAllSchemas({
		xsdFilenames: xsdFilenames
	});
	var jsonSchemas = converter.getJsonSchemas();
	var apt = jsonSchemas["ExampleTypes.xsd"].getSubSchemas()["www.xsd2jsonschema.org"].getSubSchemas()["example"].getSubSchemas()["PersonInfoType"];
	var log = JSON.stringify(apt.getJsonSchema(), null, 2);
	console.log(log);

	var namespaceManager = converter.getNamespaceManager();
	var apt2 = namespaceManager.getNamespace("/www.xsd2jsonschema.org/example").types["PersonInfoType"];
	var log2 = JSON.stringify(apt2.getJsonSchema(), null, 2);
	console.log(log2);
} else if (action === "dump-schemas") {
	converter.processAllSchemas({
		xsdFilenames: xsdFilenames
	});
	converter.dumpSchemas();
} else if (action === "validate") {
	const exampleTypesSchema = loadFile("example/generated_jsonschema/ExampleTypes.json");
	const baseTypesSchema = loadFile("example/generated_jsonschema/BaseTypes.json");
	ajv.addSchema([
		baseTypesSchema,
		exampleTypesSchema
	]);
	const exampleDataFilenames = [
		"example/data/ExampleDataPersonInfo.json",
		"example/data/ExampleDataPersonName.json"
	];
	const validate = ajv.getSchema("http://www.xsd2jsonschema.org/schema/ExampleTypes.json");
	exampleDataFilenames.forEach(function (filename, index, array) {
		var exampleData = loadFile(filename);
		const valid = validate(exampleData);
		if (valid) {
			console.log(filename + " = VALID!");
		} else {
			console.log(filename + " = INVALID\n" + JSON.stringify(validate.errors, null, "\t") + "\n");
		}
	})
}

function loadFile(path) {
	const buf = fs.readFileSync(path);
	const json = JSON.parse(buf);
	return json;
}

function readFiles(dirname) {
	try{
		return fs.readdirSync(dirname);
	}catch(error) {
		console.log("Erro ao ler pasta de schemas: " + dirname);
		console.error(error);	
	}
  }