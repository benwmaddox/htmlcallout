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
        var item = this.rootElement.querySelector('[data-bind]:not([data-bound-id])');
        while (item != null) {
            item.setAttribute("data-bound-id", (Callout.calloutId).toString() + "_" + (this.dataBoundId++).toString());
            var modelValue = item.getAttribute("data-bind");
            if (modelValue !== null) {
                this.applyBoundActions(item, modelValue);
            }
            item = this.rootElement.querySelector('[data-bind]:not([data-bound-id])');
        }
        // for(var i = 0; i < modelNodes.length; i++){
        //     var item = modelNodes.item(i);
        // }
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
var getFieldValue = function (boundModel, path, index) {
    if (index === void 0) { index = 0; }
    var remainingPath = path;
    var pathParts = [];
    while (remainingPath.length > 0) {
        var remainingPathRestart = false;
        for (var i = 0; i < remainingPath.length && !remainingPathRestart; i++) {
            if (remainingPath[i] == ".") {
                if (i > 0) {
                    var part = remainingPath.substr(0, i);
                    pathParts.push(part);
                }
                remainingPath = remainingPath.substr(i + 1);
                remainingPathRestart = true;
            }
            else if (remainingPath[i] == "[") {
                if (i > 0) {
                    pathParts.push(remainingPath.substr(0, i));
                }
                remainingPath = remainingPath.substr(i + 1);
                remainingPathRestart = true;
            }
            else if (remainingPath[i] == "]") {
                var part = remainingPath.substr(0, i);
                if (i > 0) {
                    pathParts.push(Number(part)); // Always check for number?
                }
                remainingPath = remainingPath.substr(i + 1);
                remainingPathRestart = true;
            }
            else if (remainingPath.length > 2 && remainingPath.substr(i, 2) == "{{") {
                if (i > 0) {
                    var part = remainingPath.substr(0, i);
                    pathParts.push(part);
                }
                remainingPath = remainingPath.substr(i + 2);
                remainingPathRestart = true;
            }
            else if (remainingPath.length > 2 && remainingPath.substr(i, 2) == "}}") {
                var subPart = getFieldValue(boundModel, remainingPath.substr(0, i));
                pathParts.push(subPart);
                remainingPath = remainingPath.substr(i + 2);
                remainingPathRestart = true;
            }
            else if (remainingPath.length > 6 && remainingPath.substr(i, 6) == "$index") {
                pathParts.push(index);
                remainingPath = remainingPath.substr(i + 6);
                remainingPathRestart = true;
            }
            else if (remainingPath.length == i + 1) {
                pathParts.push(remainingPath);
                remainingPath = "";
            }
        }
    }
    // while(remainingPath.indexOf(".") !== -1 || remainingPath.indexOf("{{") !== -1 || remainingPath.indexOf("[") !== -1 || remainingPath.indexOf("$index") !== -1){
    // }
    var property = boundModel;
    for (var i = 0; i < pathParts.length; i++) {
        property = property[pathParts[i]];
    }
    return property;
    // while (remainingPath.indexOf("$index") !== -1){
    //     remainingPath = remainingPath.replace("$index", index.toString());
    // }
    // Split on .
    // Split on []
    // replace anything in {{}} with result of it (run another getFieldValue first)
    // replace $index with the actual index, if applicable
};
var setFieldValue = function (boundModel, path, value, index) {
    if (index === void 0) { index = 0; }
    // Split on .
    // Split on []
    // replace anything in {{}} with result of it (run another getFieldValue first)
    // replace $index with the actual index, if applicable
};
// TODO: build out a getter method that can expand fieldnames that traverse multiple layers of objects.
// TODO: build out a setter method that can expand fieldnames that traverse multiple layers of objects.
var StandardActionLibrary = {
    innerHTML: function (boundModel) {
        // Set inner text at start. Not waiting.
        var params = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            params[_i - 1] = arguments[_i];
        }
        var fieldPath = params[0];
        var htmlElement = this;
        // if (boundModel[fieldPath] === undefined){            
        //     throw `innerHTML: FieldName ${fieldPath} wasn't valid.`;
        // }
        var value = getFieldValue(boundModel, fieldPath);
        this.innerHTML = value || "";
        var update = function () {
            var newValue = getFieldValue(boundModel, fieldPath);
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
        var fieldPath = params[0];
        var htmlElement = this;
        // if (boundModel[fieldName] === undefined){            
        //     throw `innerText: FieldName ${fieldName} wasn't valid.`;
        // }
        var value = getFieldValue(boundModel, fieldPath);
        this.innerHTML = value || "";
        var update = function () {
            var newValue = getFieldValue(boundModel, fieldPath);
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
    },
    repeat: function (boundModel) {
        var params = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            params[_i - 1] = arguments[_i];
        }
        var repeatTemplate = this.innerHTML;
        var htmlElement = this;
        // Templaet acquired, empty the repeat item
        this.innerHTML = "";
        var fieldPath = params[0];
        var value = null;
        var update = function () {
            var newValue = getFieldValue(boundModel, fieldPath);
            // TODO: check more than just reference values?            
            if (newValue !== value) {
                value = newValue;
                if (Array.isArray(value)) {
                    var templateList = [];
                    for (var i = 0; i < value.length; i++) {
                        var itemTemplate = repeatTemplate.replace("$index", i.toString());
                        templateList.push(itemTemplate);
                    }
                    htmlElement.innerHTML = templateList.join("");
                }
                else {
                    htmlElement.innerText = "Not an array";
                }
            }
        };
        update();
        return update;
    }
};
