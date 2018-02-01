/// <reference path="htmlCallout.ts" />

class Model  {
    
    [key:string]: any;
    public header : string;
}
var model : Model = {
    header: "Sample"
};
var actions = {
    innerHTML : function(this : HTMLElement, boundModel : Model, ...params : string[]){        
        // Set inner text at start. Not waiting.
        var fieldName = params[0];
        this.innerText = boundModel[fieldName];
    }
}
var callout = new Callout<Model>(model, actions);
