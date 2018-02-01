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
    }
    Model.prototype.showAlert = function (ev, text) {
        alert('It works! ' + text);
    };
    ;
    return Model;
}());
// var model : Model = {
//     header: "Sample",
//     alertButtonText: "Click to alert",
//     showAlert: function(ev: Event, text: string) {
//         alert('It works! ' + text)
//     },
//     increase: function() 
// };
var actions = {
    innerHTML: function (boundModel) {
        var params = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            params[_i - 1] = arguments[_i];
        }
        // Set inner text at start. Not waiting.
        var fieldName = params[0].trim();
        this.innerHTML = boundModel[fieldName];
    },
    click: function (boundModel) {
        var params = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            params[_i - 1] = arguments[_i];
        }
        var fieldName = params[0];
        if (boundModel[fieldName] === undefined) {
            throw "Click: FieldName " + fieldName + " wasn't valid.";
        }
        this.addEventListener('click', function (ev) {
            boundModel[fieldName].apply(boundModel, [ev].concat(params.slice(1)));
        });
    }
};
var model = new Model();
var callout = new Callout(model, document.body, actions);
