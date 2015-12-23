'use strict';

var selectDropdownbyNum = function (optionNum) {
  if (optionNum){
    var options = element.all(by.options('qos for qos in qosOptions'))
      .then(function(options){
        options[optionNum].click();
      });
  }
};

var selectQos = function(index) {
  it('should have the name of selecte qos', function() {
    selectDropdownbyNum(index);
    // refer to https://technpol.wordpress.com/2013/12/01/protractor-and-dropdowns-validation/
    var el = element(by.model('qosSelected')).$('option:checked');
    element(by.css('div.ace_content')).getText().then(function(text) {
      el.getText().then(function(selectedText){
        expect(text.split("=")[1]).toBe(selectedText);
      });

    });
  });
};

describe("SBATCH builder", function (){
  browser.get('/#/slurm');
  // testing if the change in selected qos propagates to ace-editor (SBATCH Directives)
  selectQos(0);
  selectQos(1);
  selectQos(2);
  selectQos(3);
  selectQos(4);

  it('should have a value on the ace-editor',function (){
    browser.get('/#/slurm');
    var el = element(by.model("model['nodes']"));
    browser.sleep(1500);
    // type "1" in a form field "nodes".
    var numberOfNodes = '1';
    el.sendKeys(numberOfNodes);
    element(by.css('div.ace_content')).getText().then(function(text) {
      var nodes = text.split("\n")[1];
      expect(nodes.split("=")[1]).toBe(numberOfNodes);
    });
    // cheking the submit button
    browser.sleep(1500);
  });

  it('should NOT have a value on the ace-editor since the value is invalid',function (){
    browser.get('/#/slurm');
    var el = element(by.model("model['nodes']"));
    browser.sleep(1500);
    // type "-1" in a form field "nodes".
    var numberOfNodes = '-1';
    el.sendKeys(numberOfNodes);
    element(by.css('div.ace_content')).getText().then(function(text) {
      var shouldBeUndefined = text.split("\n")[1];
      expect(shouldBeUndefined).toBe(undefined);
    });
    // cheking the submit button
    browser.sleep(1500);
  });

  it('should add a new form field and delete it', function(){
    browser.get('/#/slurm');
    var input = element(by.model('selected'));

    // after entering "array", one needs two ENTERs pressed.
    input.sendKeys('array', protractor.Key.ENTER, protractor.Key.ENTER);
    var el_array = element(by.model("model['array']"));
    expect(el_array.isPresent()).toBe(true);
    browser.sleep(1500);

    // get the parent element
    var parent = el_array.element(by.xpath('..'));
    // get a delete button from the parent
    var delete_button = parent.$$('.btn').get(1);
    delete_button.click();
    browser.sleep(1500);

    // get the array field again (this time it should not exist).
    var el_array = element(by.model("model['array']"));
    expect(el_array.isPresent()).toBe(false);
    browser.sleep(1500);

  });

});
