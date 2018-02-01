/// <reference path="htmlCallout.ts" />

class Model  {
    [key:string]: any;
    public header : string = "Sample";
    public alertButtonText : string = "Click to alert";
    public showAlert(ev: Event, text: string) {
        alert('It works! ' + text)
    };

    public incrementCounter : number = 0;
    public increase = (ev:Event, text:string) => {
        this.incrementCounter++;
    };
    public decrease = (ev:Event, text:string) => {
        this.incrementCounter--;
    };
}
// var model : Model = {
//     header: "Sample",
//     alertButtonText: "Click to alert",
//     showAlert: function(ev: Event, text: string) {
//         alert('It works! ' + text)
//     },
//     increase: function() 
// };
var actions = {
    innerHTML : function(this : HTMLElement, boundModel : Model, ...params : string[]){        
        // Set inner text at start. Not waiting.
        var fieldName = params[0].trim();
        this.innerHTML = boundModel[fieldName];
    },
    click : function(this : HTMLElement, boundModel : Model, ...params : string[]){
        
        var fieldName = params[0];
        if (boundModel[fieldName] === undefined){            
            throw `Click: FieldName ${fieldName} wasn't valid.`
        }
        this.addEventListener('click', function(ev : MouseEvent){
            boundModel[fieldName](ev, ...params.slice(1));
        });
    }
}
var model = new Model();
var callout = new Callout<Model>(model, document.body, actions);
