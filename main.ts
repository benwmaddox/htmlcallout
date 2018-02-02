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
    public boundText : string = "";
}

var actions = {
    innerHTML : innerHTML,    
    innerText : innerText,
    click : click,
    numberInput : numberInput,
    textInput : textInput
}
var model = new Model();
var callout = new Callout<Model>(model, document.body, actions);
callout.runUpdatesOnInterval(16);