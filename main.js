"use strict";
/// <reference path="htmlCallout.ts" />
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
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
var actions = __assign({}, StandardActionLibrary
// Could append custom ones here...
);
var model = new Model();
var callout = new Callout(model, document.getElementById('main'), actions);
callout.runUpdatesOnInterval(16);
//////////////////////////////////////
var OtherModel = (function () {
    function OtherModel() {
        this.header = "Second Sample";
        this.boundText = "Second text";
    }
    return OtherModel;
}());
var secondModel = new OtherModel();
var secondaryActions = {
    innerText: StandardActionLibrary.innerText
};
var secondaryCallout = new Callout(secondModel, document.getElementById('secondary'), secondaryActions);
secondaryCallout.runUpdatesOnInterval(1000);
////////////////////////////////////// 
