/// <reference path="htmlCallout.ts" />
class SubModel {
    public subHeader : string = "Sub Value"
}
class Model  {
    [key:string]: any;
    public header : string = "Sample";
    public alertButtonText : string = "Click to alert";
    public showAlert(ev: Event, text: string) {
        alert('It works! ' + text)
    };
    public sub : SubModel = new SubModel();
    public subList : SubModel[]  = [new SubModel(), new SubModel()]

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
    ...StandardActionLibrary
    // Could append custom ones here...
}
var model = new Model();
var callout = new Callout<Model>(model, <HTMLDivElement>document.getElementById('main'), actions);
callout.runUpdatesOnInterval(16);



//////////////////////////////////////
class OtherModel {
    [key:string]: any;
    public header : string = "Second Sample";
    public boundText : string = "Second text"
}
var secondModel = new OtherModel();
var secondaryActions = {    
    innerText : StandardActionLibrary.innerText
}
var secondaryCallout = new Callout<OtherModel>(secondModel, <HTMLDivElement>document.getElementById('secondary'), secondaryActions);
secondaryCallout.runUpdatesOnInterval(1000);

//////////////////////////////////////
class RepeaterModel {
    [key:string]: any;
    public header : string = "Second Sample";
    public subObjects : SubModel[] = [ new SubModel(), new SubModel(), new SubModel()];
}
var repeatModel = new RepeaterModel();
repeatModel.subObjects[0].subHeader = "Header 0";
repeatModel.subObjects[1].subHeader = "Header 1";
repeatModel.subObjects[2].subHeader = "Header 2";
var repeatActions = {        
    ...StandardActionLibrary
}
var repeatCallout = new Callout<RepeaterModel>(repeatModel, <HTMLDivElement>document.getElementById('repeaterTest'), repeatActions);
repeatCallout.runUpdatesOnInterval(1000);

//////////////////////////////////////