"use strict";
/// <reference path="htmlCallout.ts" />
var Model = (function () {
    function Model() {
    }
    return Model;
}());
var model = {
    header: "Sample"
};
var actions = {
    innerHTML: function (boundModel) {
        var params = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            params[_i - 1] = arguments[_i];
        }
        // Set inner text at start. Not waiting.
        var fieldName = params[0];
        this.innerText = boundModel[fieldName];
    }
};
var callout = new Callout(model, actions);
