"use strict";
var Callout = (function () {
    function Callout(boundModel, actions) {
        this.dataBoundId = 1;
        this.boundModel = boundModel;
        this.actions = actions;
        this.boundSelf = this;
        this.initNodes();
    }
    Callout.prototype.initNodes = function () {
        var modelNodes = document.querySelectorAll('[data-bind]');
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
        }
    };
    Callout.prototype.applyBoundActions = function (element, attribute) {
        var _this = this;
        // Different actions split by ;. Action type then : then comma split values.  
        // ex/
        // innerHTML: title; click: someAction()
        var actions = attribute.split(';');
        actions.forEach(function (action) {
            var actionName = action.split(":")[0];
            var parameters = action.split(":")[1].split(',');
            (_a = _this.actions[actionName]).call.apply(_a, [element, _this.boundModel].concat(parameters));
            var _a;
        });
        // var attributeValue = this.boundModel[modelValue];
        // if (attributeValue === undefined){
        //     throw modelValue + ' does not exist on object';
        // }
        // item.innerHTML = attributeValue;
    };
    Callout.prototype.model = function (event, name) {
        if (typeof (event.target) == typeof (HTMLElement)) {
            event.target.innerText = this.boundModel[name.trim()];
        }
        // this.target.addEventListener("change", function(){
        //     this.boundSelf
        // })
    };
    return Callout;
}());
