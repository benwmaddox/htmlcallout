interface BoundType {
    [key:string]: any;
}
class Callout<T extends BoundType>{
    private boundModel : T;    
    private boundSelf : Callout<T>;
    private actions : {[key : string]: (boundModel : T, ...parameters : string[]) => (Function | null);}
    private static calloutId : number = 0;
    private dataBoundId : number = 1;
    private rootElement : HTMLElement;
    private updateCallbacks : Function[] = [];
    constructor(boundModel : T, htmlElement : HTMLElement, actions:{[key : string]: (boundModel : T, ...parameters : string[]) => (Function | null);}) {
        Callout.calloutId++;
        this.boundModel = boundModel;   
        this.rootElement = htmlElement;             
        this.actions = actions;
        this.boundSelf = this;
        this.applyBindings();
    }
    public runUpdatesOnInterval(intervalInMs : number){        
        setInterval(this.runUpdates, intervalInMs)
    }
    runUpdates = () => {
        var callbacks = this.updateCallbacks;
        for(var i=0;i < callbacks.length;i++){
            callbacks[i]();
        }
    }
    public applyBindings(){
        var modelNodes = this.rootElement.querySelectorAll('[data-bind]');
        for(var i = 0; i < modelNodes.length; i++){
            var item = modelNodes.item(i);
            var id = item.getAttribute("data-bound-id");
            if (id === null) {
                item.setAttribute("data-bound-id", (Callout.calloutId).toString()+"_"+(this.dataBoundId++).toString());                
            }
            else{ // Already bound
                continue;
            }
            var modelValue = item.getAttribute("data-bind");
            if (modelValue !== null){
                this.applyBoundActions(item, <string>modelValue);                
            }
            item.removeAttribute("data-bind")
        }
    }
    private applyBoundActions(element : Element, attribute : string){
        // Different actions split by ;. Action type then : then comma split values.  
        // ex/
        // innerHTML: title; click: someAction()
        var actions = attribute.split(';');
        actions.forEach(action  => {
            var actionName = action.split(":")[0].trim();
            var parameters = action.split(":")[1].split(',');
            for (var i = 0; i < parameters.length; i++){
                parameters[i] = parameters[i].trim();
            }
            var actionFunction = this.actions[actionName];
            if (actionFunction === undefined){
                throw `Action ${actionName} wasn't provided.  Please make sure that is a valid action name and that it was provided.`
            }
            var updateCallback = actionFunction.call(element, this.boundModel, ...parameters);
            if (updateCallback != null){
                this.updateCallbacks.push(updateCallback);
            }
        });
    }
}


// TODO: build out a getter method that can expand fieldnames that traverse multiple layers of objects.
// TODO: build out a setter method that can expand fieldnames that traverse multiple layers of objects.

let innerHTML = function<T extends BoundType>(this : HTMLElement, boundModel : T, ...params : string[]){        
    // Set inner text at start. Not waiting.
    let fieldName = params[0];
    let htmlElement = this;
    if (boundModel[fieldName] === undefined){            
        throw `innerHTML: FieldName ${fieldName} wasn't valid.`;
    }
    let value : string | null = boundModel[fieldName];        
    this.innerHTML = value || "";
    let update = function(){
        var newValue = boundModel[fieldName];
        if (newValue !== value){
            value = newValue;
            htmlElement.innerHTML = newValue;
        }
    }
    return update;
};
let innerText = function<T extends BoundType>(this : HTMLElement, boundModel : T, ...params : string[]) : Function{        
    // Set inner text at start. Not waiting.
    let fieldName = params[0];
    let htmlElement = this;
    if (boundModel[fieldName] === undefined){            
        throw `innerText: FieldName ${fieldName} wasn't valid.`;
    }
    let value : string | null = boundModel[fieldName];        
    this.innerHTML = value || "";
    let update = function(){
        var newValue = boundModel[fieldName];
        if (newValue !== value){
            value = newValue;
            htmlElement.innerText = newValue;
        }
    }
    return update;
};
let click = function<T extends BoundType>(this : HTMLElement, boundModel : Model, ...params : string[]) : null {        
    let fieldName = params[0];
    if (boundModel[fieldName] === undefined){            
        throw `click: FieldName ${fieldName} wasn't valid.`;
    }
    this.addEventListener('click', function(ev : MouseEvent){
        boundModel[fieldName](ev, ...params.slice(1));
    });
    return null;
};
let numberInput  = function<T extends BoundType>(this : HTMLElement, boundModel : Model, ...params : string[]) : null {         
    let fieldName = params[0];
    if (boundModel[fieldName] === undefined){            
        throw `numberInput: FieldName ${fieldName} wasn't valid.`;
    }
    if (!(this instanceof HTMLInputElement)){
        throw `numberInput: FieldName ${fieldName} wasn't an HTML Input Element. Please only use on HTML Input Elements`;
    }
    this.addEventListener('keyup', function(ev : Event){
        boundModel[fieldName] = Number((<HTMLInputElement>ev.target).value);
    })
    //TODO: Should this be two way binding or not?
    return null;
};
let textInput  = function<T extends BoundType>(this : HTMLElement, boundModel : Model, ...params : string[]) : null{         
    let fieldName = params[0];
    if (boundModel[fieldName] === undefined){            
        throw `textInput: FieldName ${fieldName} wasn't valid.`;
    }
    if (!(this instanceof HTMLInputElement)){
        throw `textInput: FieldName ${fieldName} wasn't an HTML Input Element. Please only use on HTML Input Elements`;
    }
    this.addEventListener('keyup', function(ev : Event){
        boundModel[fieldName] = (<HTMLInputElement>ev.target).value;
    })
    //TODO: Should this be two way binding or not?
    return null;
};