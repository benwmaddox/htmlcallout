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
        this.boundModel = boundModel;
        this.rootElement = htmlElement;
        this.actions = actions;
        this.boundSelf = this;
        this.applyBindings();
    }
    Callout.prototype.runUpdatesOnInterval = function (intervalInMs) {
        setInterval(this.runUpdates, intervalInMs);
    };
    Callout.prototype.applyBindings = function () {
        var modelNodes = this.rootElement.querySelectorAll('[data-bind]');
        for (var i = 0; i < modelNodes.length; i++) {
            var item = modelNodes.item(i);
            var id = item.getAttribute("data-bound-id");
            if (id === null) {
                item.setAttribute("data-bound-id", (this.dataBoundId++).toString());
            }
            else {
                continue;
            }
            var modelValue = item.getAttribute("data-bind");
            if (modelValue !== null) {
                this.applyBoundActions(item, modelValue);
            }
            item.removeAttribute("data-bind");
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
    return Callout;
}());
