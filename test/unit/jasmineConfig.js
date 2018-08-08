
// function teste(){
    var Jasmine = require('jasmine');
    var jasmine = new Jasmine();
    
    const Reporter = require('jasmine-terminal-reporter');
    const reporter = new Reporter();
    jasmine.addReporter(reporter);
    
    
    
    //jasmine.loadConfigFile('jasmine.json');
    jasmine.loadConfig({
        spec_dir: 'test/unit',
        spec_files: [
            "**/*[sS]pec.js"
          ],
          helpers: [
            "helpers/**/*.js"
          ],
          stopSpecOnExpectationFailure: false,
  random: false
    });
    
    jasmine.execute();
// }


// module.exports = teste;