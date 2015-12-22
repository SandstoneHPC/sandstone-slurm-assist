'use strict';

var selectDropdownbyNum = function (optionNum) {
  if (optionNum){
    var options = element.all(by.options('qos for qos in qosOptions'))
      .then(function(options){
        options[optionNum].click();
      });
  }
};


describe('Slurm config change', function(){
  browser.get('/#/slurm');

  it('should have the name of selecte qos', function() {
    selectDropdownbyNum(1);
    var el = element(by.model('qosSelected')).$('option:checked');
    element(by.css('div.ace_content')).getText().then(function(text) {
      el.getText().then(function(selectedText){
        expect(text.split("=")[1]).toBe(selectedText);
      });

    });
  });

});
