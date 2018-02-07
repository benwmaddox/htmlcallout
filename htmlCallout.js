"use strict";
var Callout = (function () {
    function Callout(boundModel, htmlElement, actions) {
        var _this = this;
        this.dataBoundId = 1;
        this.updateCallbacks = [];
        this.runUpdates = function () {
            var callbacks = _this.updateCallbacks;
            for (var i = 0; i < callbacks.length; i++) {
                callbacks[i]();
            }
        };
        Callout.calloutId++;
        this.boundModel = boundModel;
        this.rootElement = htmlElement;
        this.actions = actions;
        this.boundSelf = this;
        this.applyBindings();
    }
    Callout.prototype.runUpdatesOnInterval = function (intervalInMs) {
        setInterval(this.runUpdates, intervalInMs);
        this.runUpdates();
    };
    Callout.prototype.applyBindings = function () {
        var modelNodes = this.rootElement.querySelectorAll('[data-bind]');
        for (var i = 0; i < modelNodes.length; i++) {
            var item = modelNodes.item(i);
            var id = item.getAttribute("data-bound-id");
            if (id !== null) {
                // Already bound
                continue;
            }
            item.setAttribute("data-bound-id", (Callout.calloutId).toString() + "_" + (this.dataBoundId++).toString());
            var modelValue = item.getAttribute("data-bind");
            if (modelValue !== null) {
                this.applyBoundActions(item, modelValue);
            }
            // item.removeAttribute("data-bind")
        }
    };
    Callout.prototype.applyBoundActions = function (element, attribute) {
        var _this = this;
        // Different actions split by ;. Action type then : then comma split values.  
        // ex/
        // innerHTML: title; click: someAction()
        var actions = attribute.split(';');
        actions.forEach(function (action) {
            var actionName = action.split(":")[0].trim();
            var parameters = action.split(":")[1].split(',');
            for (var i = 0; i < parameters.length; i++) {
                parameters[i] = parameters[i].trim();
            }
            var actionFunction = _this.actions[actionName];
            if (actionFunction === undefined) {
                throw "Action " + actionName + " wasn't provided.  Please make sure that is a valid action name and that it was provided.";
            }
            var updateCallback = actionFunction.call.apply(actionFunction, [element, _this.boundModel].concat(parameters));
            if (updateCallback != null) {
                _this.updateCallbacks.push(updateCallback);
            }
        });
    };
    Callout.calloutId = 0;
    return Callout;
}());
// TODO: build out a getter method that can expand fieldnames that traverse multiple layers of objects.
// TODO: build out a setter method that can expand fieldnames that traverse multiple layers of objects.
var StandardActionLibrary = {
    innerHTML: function (boundModel) {
        var params = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            params[_i - 1] = arguments[_i];
        }
        // Set inner text at start. Not waiting.
        var fieldName = params[0];
        var htmlElement = this;
        if (boundModel[fieldName] === undefined) {
            throw "innerHTML: FieldName " + fieldName + " wasn't valid.";
        }
        var value = boundModel[fieldName];
        this.innerHTML = value || "";
        var update = function () {
            var newValue = boundModel[fieldName];
            if (newValue !== value) {
                value = newValue;
                htmlElement.innerHTML = newValue;
            }
        };
        return update;
    },
    innerText: function (boundModel) {
        var params = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            params[_i - 1] = arguments[_i];
        }
        // Set inner text at start. Not waiting.
        var fieldName = params[0];
        var htmlElement = this;
        if (boundModel[fieldName] === undefined) {
            throw "innerText: FieldName " + fieldName + " wasn't valid.";
        }
        var value = boundModel[fieldName];
        this.innerHTML = value || "";
        var update = function () {
            var newValue = boundModel[fieldName];
            if (newValue !== value) {
                value = newValue;
                htmlElement.innerText = newValue;
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
        //TODO: Should this be two way binding or not?
        return null;
    },
    textInput: function (boundModel) {
        var params = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            params[_i - 1] = arguments[_i];
        }
        var fieldName = params[0];
        if (boundModel[fieldName] === undefined) {
            throw "textInput: FieldName " + fieldName + " wasn't valid.";
        }
        if (!(this instanceof HTMLInputElement)) {
            throw "textInput: FieldName " + fieldName + " wasn't an HTML Input Element. Please only use on HTML Input Elements";
        }
        this.addEventListener('keyup', function (ev) {
            boundModel[fieldName] = ev.target.value;
        });
        //TODO: Should this be two way binding or not?
        return null;
    }
};
