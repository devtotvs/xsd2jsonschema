"use strict";

const debug = require("debug")("xsd2jsonschema:Xsd2JsonSchema");

// var XsdFile = require('./xmlschema/xsdFile');
const XsdFile = require("./xmlschema/xsdFileXmlDom");
const JsonSchemaFile = require("./jsonschema/jsonSchemaFile");
const DepthFirstTraversal = require("./depthFirstTraversal");
const DefaultConversionVisitor = require("./visitors/defaultConversionVisitor");
const BaseConversionVisitor = require("./visitors/baseConversionVisitor");
const path = require("path");
const fs = require("fs-extra");
const utils = require('./utils');



const xsdBaseDir_NAME = Symbol();
const outputDir_NAME = Symbol();
const baseId_NAME = Symbol();
const mask_NAME = Symbol();
const visitor_NAME = Symbol();
const xmlSchemas_NAME = Symbol();
const jsonSchema_NAME = Symbol();

const defaultXsd2JsonSchemaOptions = {
    xsdBaseDir: '.',
    outputDir: '.',
    baseId: 'http://www.xsd2jsonschema.org/defaultBaseId',
    mask: undefined,
    visitor: new DefaultConversionVisitor()
}

/**
 * Class prepresenting an instance of the Xsd2JsonSchema library.  This needs to be refactored to
 * remove the filesystem focus and work off URI's or possibly just strings/buffers representing the contents
 * of the XML Schema files that are being converted to JSON Schema.
 *
 * I would like the library to be encapsulated from IO if possible.
 *
 * The current implementation is really only usable as a cli.
 *
 * TODO: Set defaults for all options and make the 'options' parameter optional.
 *
 */

class Xsd2JsonSchema {
    /**
     *
     * @param {Object} options - An object used to override default options.
     * @param {string} options.xsdBaseDir - The directory from which xml schema's should be loaded.  The default value is the current directory.
     * @param {string} options.outputDir - The destination directory for generated JSON Schema files.  The default value is the current directory.
     * @param {string} options.baseId - The base value for the 'id' in any generated JSON Schema files.  The default value is 'http://www.xsd2jsonschema.org/defaultBaseId.
     * @param {string} options.mask - A regular expression used to reduce generated JSON Schema filenames as needed.  The default value is 'undefined'.
     * @param {string} options.converter - A subclass of {@link BaseConverter|BaseConverter}.  This is convenience parameter and equal to poviding the visitor parameter where options.visiter = new {@link BaseConversionVisitor|BaseConversionVisitor}(options.converter).
     * @param {string} options.visitor - A subclass of {@link BaseConversionVisitor|BaseConversionVisitor}.
     */
    constructor(options) {
        if (options != undefined) {
            this.xsdBaseDir = options.xsdBaseDir != undefined ? options.xsdBaseDir : defaultXsd2JsonSchemaOptions.xsdBaseDir;
            this.outputDir = options.outputDir != undefined ? options.outputDir : defaultXsd2JsonSchemaOptions.outputDir;
            this.baseId = options.baseId != undefined ? options.baseId : defaultXsd2JsonSchemaOptions.baseId;
            this.mask = options.mask != undefined ? options.mask : defaultXsd2JsonSchemaOptions.mask;
            if (options.converter != undefined) {
                this.visitor = new BaseConversionVisitor(options.converter);
            } else {
                this.visitor = options.visitor != undefined ? options.visitor : defaultXsd2JsonSchemaOptions.visitor;
            }
        } else {
            this.xsdBaseDir = defaultXsd2JsonSchemaOptions.xsdBaseDir;
            this.outputDir = defaultXsd2JsonSchemaOptions.outputDir;
            this.baseId = defaultXsd2JsonSchemaOptions.baseId;
            this.mask = defaultXsd2JsonSchemaOptions.mask;
            this.visitor = new DefaultConversionVisitor();
        }
        this.xmlSchemas = {};
        this.jsonSchema = {};
    }

    // Getters/Setters
    get xsdBaseDir() {
        return this[xsdBaseDir_NAME];
    }
    set xsdBaseDir(newXsdBaseDirectory) {
        this[xsdBaseDir_NAME] = newXsdBaseDirectory;
    }

    get baseId() {
        return this[baseId_NAME];
    }
    set baseId(newBaseId) {
        this[baseId_NAME] = newBaseId;
    }

    get jsonSchema() {
        return this[jsonSchema_NAME];
    }
    set jsonSchema(newJsonSchema) {
        this[jsonSchema_NAME] = newJsonSchema;
    }

    get mask() {
        return this[mask_NAME];
    }
    set mask(newMask) {
        this[mask_NAME] = newMask;
    }

    get outputDir() {
        return this[outputDir_NAME];
    }
    set outputDir(newOutputDir) {
        this[outputDir_NAME] = newOutputDir;
    }

    get visitor() {
        return this[visitor_NAME];
    }
    set visitor(newVisitor) {
        this[visitor_NAME] = newVisitor;
    }

    get xmlSchemas() {
        return this[xmlSchemas_NAME];
    }
    set xmlSchemas(newXmlSchemas) {
        this[xmlSchemas_NAME] = newXmlSchemas;
    }

    loadSchema(uri, withIncludes) {
        if (this.xmlSchemas[uri] !== undefined) {
            return;
        }
        var xsd = new XsdFile({
            uri: uri
        });
        this.xmlSchemas[xsd.baseFilename] = xsd;
        if (xsd.hasIncludes() && withIncludes) {
            this.loadAllSchemas(xsd.includeUris);
        }
    }

    loadAllSchemas(uris, withIncludes) {
        uris.forEach(function (uri, index, array) {
            this.loadSchema(path.join(this.xsdBaseDir, uri), withIncludes);
        }, this);
        return this.xmlSchemas;
    }

    processSchema(uri, withIncludes) {
        if(uri.indexOf("\\") > -1){
            var xsd = this.xmlSchemas[uri];
            if (withIncludes && xsd.hasIncludes()) {
                this.processSchemas(xsd.includeUris, false);
            }
            if (this.jsonSchemas[uri] === undefined) {
                var traversal = new DepthFirstTraversal();
                this.jsonSchemas[uri] = new JsonSchemaFile({
                    baseFilename: xsd.baseFilename,
                    targetNamespace: xsd.targetNamespace,
                    baseId: this.baseId
                });
                traversal.traverse(this.visitor, this.jsonSchemas[uri], xsd);
            }
        }
        
    }

    processSchemas(uris, withIncludes) {
        uris.forEach(function (uri, index, array) {
            if(uri.indexOf("totvsmsg.xsd") == -1){
                if (uri.indexOf("./") == -1) {
                    this.processSchema(uri, withIncludes);
                } else {
                    this.processSchema(path.join(this.xsdBaseDir, uri), withIncludes);
                }
            }
        }, this);        
    }

    processAllSchemas(parms, withIncludes = true) {
        if (parms.xsdBaseDir != undefined) {
            this.xsdBaseDir = parms.xsdBaseDir;
        }
        if (parms.visitor != undefined) {
            this.visitor = parms.visitor;
        }
        this.jsonSchemas = {};
        parms.xsdFilenames.forEach(function (xsdFileName, index, array) {
            this.loadAllSchemas([xsdFileName], withIncludes);
            this.processSchemas([path.join(this.xsdBaseDir, xsdFileName)], withIncludes);
            
            //Limpa cache
            this.visitor = new DefaultConversionVisitor();
        }, this);        
        return this.jsonSchemas;
    }

    /**
     * Writes out a JsonSchemaFile to the given directory with the provided formatting option.
     *
     * @param {JsonSchemaFile} jsonSchema - The jsonSchema to be writen out to a file.
     * @param {String} directory - Target directory to write this JsonSchemaFile to. The default valuye is the current directory.
     * @param {String} spacing - Adds indentation, white space, and line break characters to the JSON file written to disk.  The
     * default value is '\t'.  This is used as the last parameter to JSON.stringify().
     * @returns {void}
     */
    writeFile(jsonSchema, directory, spacing) {
        var dir = directory;
        var space = spacing
        if (jsonSchema == undefined) {
            throw new Error('The parameter jsonSchema is required');
        }
        if (directory == undefined) {
            dir = '.';
        }
        if (spacing == undefined) {
            space = '\t';
        };

      
       // const data = JSON.stringify(  jsonSchema.getJsonSchema(), null, space);
        const data = JSON.stringify(this.formatSchema(jsonSchema), null, space);
        const maskedFilename = (this.mask === undefined) ? jsonSchema.filename : jsonSchema.filename.replace(this.mask, '');
        fs.writeFileSync(path.join(dir, maskedFilename), data);
    }

    formatSchema(jsonSchema) {
        let originSchema = jsonSchema.getJsonSchema();
        let propertiesTypes = Object.keys(originSchema.properties);
        let destinationSchema = {
            openapi: "3.0.1",
            servers: [],
            info: {},
            paths: {},
            components: {
                schemas: {}
            }
        };
        destinationSchema.info = originSchema.info || {};
        let properties = {};

        let businessContentName = destinationSchema.info.title || jsonSchema.filename.slice(0, jsonSchema.filename.indexOf("_"));
        businessContentName = (businessContentName);

        properties[businessContentName + "s"] = {
            type: "object",
            properties: {
                items: {
                    type: "array",
                    items: {

                    }
                },
                hasNext: {
                    type: "boolean"           
                }       
            }
        }

        propertiesTypes.map((x) => {            
            if (originSchema.definitions[x]) {
                                
                var propertyType = originSchema.definitions[x];
                this.handleLisOf(propertyType);

                switch (x.toLowerCase()) {
                    case "businesscontenttype":
                        properties[businessContentName + "Info"] = propertyType;
                        break;
                    case "businesscontent":
                        propertyType.$ref = propertyType.$ref.replace("BusinessContentType", businessContentName + "Info");
                        properties[businessContentName + "s"].properties.items.items = propertyType;
                        break;
                    default:
                        properties[x] = propertyType;
                }
                
            }
        });

        destinationSchema.components.schemas = properties;

        return destinationSchema;
    }

    handleLisOf(obj){
        if(obj.properties){
            let listOfs = Object.keys(obj.properties).filter(x =>  x.startsWith("ListOf"));
                
            listOfs.map(x =>{
                if(obj.properties[x].properties){
                    let prop =  Object.keys(obj.properties[x].properties);
               
                    obj.properties[x] = Object.assign( obj.properties[x], prop.map(y => obj.properties[x].properties[y] )[0]); 
                     delete obj.properties[x].properties;
                }
                else{
                    console.log(x);
                }
              
            })
        }
        else{
            console.log(obj);
        }
       
        
    }
    writeFiles() {
        try {
            fs.ensureDirSync(this.outputDir);
        } catch (err) {
            debug(err);
        }
        Object.keys(this.jsonSchemas).forEach(function (uri, index, array) {
            this.writeFile(this.jsonSchemas[uri], this.outputDir, '  ');
        }, this);
    }



    dump() {
        debug("\n*** XML Schemas ***");
        Object.keys(this.xmlSchemas).forEach(function (uri, index, array) {
            debug(index + ") " + uri);
            debug(this.xmlSchemas[uri].includeUris);
        }, this);

        debug("\n*** Namespaces and Types ***");
        debug(this.getNamespaceManager().namespaces);
    }

    dumpSchemas() {
        debug("\n*** JSON Schemas ***");
        Object.keys(this.jsonSchemas).forEach(function (uri, index, array) {
            debug(index + ") " + uri);
            var log = JSON.stringify(this.jsonSchemas[uri].getJsonSchema(), null, 2);
            debug(log);
        }, this);
    }

    getNamespaceManager() {
        return this.visitor.processor.namespaceManager;
    }
}

module.exports = Xsd2JsonSchema;