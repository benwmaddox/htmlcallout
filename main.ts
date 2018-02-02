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
    public boundNumber : number = 5;
}

var actions = {
    innerHTML : function(this : HTMLElement, boundModel : Model, ...params : string[]){        
        // Set inner text at start. Not waiting.
        var fieldName = params[0];
        var htmlElement = this;
        var value : string | null = null;
        var update = function(){
            var newValue = boundModel[fieldName];
            if (value === null || (newValue !== null && newValue !== value)){
                value = newValue;
                htmlElement.innerHTML = newValue;
            }
        }
        return update;
    },
    click : function(this : HTMLElement, boundModel : Model, ...params : string[]) {        
        var fieldName = params[0];
        if (boundModel[fieldName] === undefined){            
            throw `click: FieldName ${fieldName} wasn't valid.`;
        }
        this.addEventListener('click', function(ev : MouseEvent){
            boundModel[fieldName](ev, ...params.slice(1));
        });
        return null;
    },
    numberInput : function(this : HTMLElement, boundModel : Model, ...params : string[]){         
        var fieldName = params[0];
        if (boundModel[fieldName] === undefined){            
            throw `numberInput: FieldName ${fieldName} wasn't valid.`;
        }
        if (!(this instanceof HTMLInputElement)){
            throw `numberInput: FieldName ${fieldName} wasn't an HTML Input Element. Please only use on HTML Input Elements`;
        }
        this.addEventListener('keyup', function(ev : Event){
            boundModel[fieldName] = Number((<HTMLInputElement>ev.target).value);
        })
        return null;
    }
}
var model = new Model();
var callout = new Callout<Model>(model, document.body, actions);
callout.runUpdatesOnInterval(16);