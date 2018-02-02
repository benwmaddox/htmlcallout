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
    }
    Model.prototype.showAlert = function (ev, text) {
        alert('It works! ' + text);
    };
    ;
    return Model;
}());
var actions = {
    innerHTML: function (boundModel) {
        var params = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            params[_i - 1] = arguments[_i];
        }
        // Set inner text at start. Not waiting.
        var fieldName = params[0];
        var htmlElement = this;
        var value = null;
        var update = function () {
            var newValue = boundModel[fieldName];
            if (value === null || (newValue !== null && newValue !== value)) {
                value = newValue;
                htmlElement.innerHTML = newValue;
            }
        };
        return update;
    },
    click: function (boundModel) {
        var params = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            params[_i - 1] = arguments[_i];
        }
        var fieldName = params[0];
        if (boundModel[fieldName] === undefined) {
            throw "click: FieldName " + fieldName + " wasn't valid.";
        }
        this.addEventListener('click', function (ev) {
            boundModel[fieldName].apply(boundModel, [ev].concat(params.slice(1)));
        });
        return null;
    },
    numberInput: function (boundModel) {
        var params = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            params[_i - 1] = arguments[_i];
        }
        var fieldName = params[0];
        if (boundModel[fieldName] === undefined) {
            throw "numberInput: FieldName " + fieldName + " wasn't valid.";
        }
        if (!(this instanceof HTMLInputElement)) {
            throw "numberInput: FieldName " + fieldName + " wasn't an HTML Input Element. Please only use on HTML Input Elements";
        }
        this.addEventListener('keyup', function (ev) {
            boundModel[fieldName] = Number(ev.target.value);
        });
        return null;
    }
};
var model = new Model();
var callout = new Callout(model, document.body, actions);
callout.runUpdatesOnInterval(16);
