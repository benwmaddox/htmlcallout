/// <reference path="htmlCallout.ts" />

class Model  {[key:string]: any;
    public header : string;
    public alertButtonText : string;
    public showAlert : (ev: Event, text: string) => void;
}
var model : Model = {
    header: "Sample",
    alertButtonText: "Click to alert",
    showAlert: function(ev: Event, text: string) {
        alert('It works! ' + text)
    } 
};
var actions = {
    innerHTML : function(this : HTMLElement, boundModel : Model, ...params : string[]){        
        // Set inner text at start. Not waiting.
        var fieldName = params[0];
        this.innerHTML = boundModel[fieldName];
    },
    click : function(this : HTMLElement, boundModel : Model, ...params : string[]){
        var fieldName = params[0];
        this.addEventListener('click', function(ev : MouseEvent){
            boundModel[fieldName](ev, ...params.slice(1));
        });
    }
}
var callout = new Callout<Model>(model, actions);
