"use strict";
/// <reference path="htmlCallout.ts" />
var Model = (function () {
    function Model() {
    }
    return Model;
}());
var model = {
    header: "Sample",
    alertButtonText: "Click to alert",
    showAlert: function (ev, text) {
        alert('It works! ' + text);
    }
};
var actions = {
    innerHTML: function (boundModel) {
        var params = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            params[_i - 1] = arguments[_i];
        }
        // Set inner text at start. Not waiting.
        var fieldName = params[0];
        this.innerHTML = boundModel[fieldName];
    },
    click: function (boundModel) {
        var params = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            params[_i - 1] = arguments[_i];
        }
        var fieldName = params[0];
        this.addEventListener('click', function (ev) {
            boundModel[fieldName].apply(boundModel, [ev].concat(params.slice(1)));
        });
    }
};
var callout = new Callout(model, actions);
