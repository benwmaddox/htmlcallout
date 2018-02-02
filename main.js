"use strict";
/// <reference path="htmlCallout.ts" />
var Model = (function () {
    function Model() {
        var _this = this;
        this.header = "Sample";
        this.alertButtonText = "Click to alert";
        this.incrementCounter = 0;
        this.increase = function (ev, text) {
            _this.incrementCounter++;
        };
        this.decrease = function (ev, text) {
            _this.incrementCounter--;
        };
        this.boundNumber = 5;
        this.boundText = "";
    }
    Model.prototype.showAlert = function (ev, text) {
        alert('It works! ' + text);
    };
    ;
    return Model;
}());
var actions = {
    innerHTML: innerHTML,
    innerText: innerText,
    click: click,
    numberInput: numberInput,
    textInput: textInput
};
var model = new Model();
var callout = new Callout(model, document.body, actions);
callout.runUpdatesOnInterval(16);
