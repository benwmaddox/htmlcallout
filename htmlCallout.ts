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
        this.runUpdates();
    }
    runUpdates = () => {
        this.applyBindings();
        var callbacks = this.updateCallbacks;
        for(var i=0;i < callbacks.length;i++){
            callbacks[i]();
        }
    }
    public applyBindings(){
        var item = this.rootElement.querySelector('[data-bind]:not([data-bound-id])');
        while (item != null){
            item.setAttribute("data-bound-id", (Callout.calloutId).toString()+"_"+(this.dataBoundId++).toString());                
            var modelValue = item.getAttribute("data-bind");
            if (modelValue !== null){
                this.applyBoundActions(item, <string>modelValue);                
            }
            item = this.rootElement.querySelector('[data-bind]:not([data-bound-id])');
        }

        // for(var i = 0; i < modelNodes.length; i++){
        //     var item = modelNodes.item(i);
        // }
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

var getFieldValue = function<T extends BoundType>(boundModel : T, path : string, index : number = 0) : any {    
    // Split on .
    // Split on []
    // replace anything in {{}} with result of it (run another getFieldValue first)
    // replace $index with the actual index, if applicable
    var remainingPath = path;
    var pathParts : any[] = [];    
    while (remainingPath.length > 0){
        var remainingPathRestart : boolean = false;
        for (var i = 0; i < remainingPath.length && !remainingPathRestart; i++){         
            if (remainingPath[i] == "."){
                if (i > 0){
                    var part = remainingPath.substr(0, i);
                    pathParts.push(part);
                }                
                remainingPath = remainingPath.substr(i+1);
                remainingPathRestart = true;
            }   
            else if (remainingPath[i] == "["){                
                if (i > 0){
                    pathParts.push(remainingPath.substr(0, i));
                }
                remainingPath = remainingPath.substr(i+1);                
                remainingPathRestart = true;
            }
            else if (remainingPath[i] == "]"){
                var part = remainingPath.substr(0, i);                
                if (i > 0){
                    pathParts.push(Number(part)); // Always check for number?
                }
                remainingPath = remainingPath.substr(i+1);                
                remainingPathRestart = true;
            }
            else if (remainingPath.length > 2 && remainingPath.substr(i, 2) == "{{" ){                                               
                if (i > 0){
                    var part = remainingPath.substr(0, i)
                    pathParts.push(part);
                }          
                remainingPath = remainingPath.substr(i+2);
                remainingPathRestart = true;
            }
            else if (remainingPath.length > 2 && remainingPath.substr(i, 2) == "}}" ){
                var subPart = getFieldValue(boundModel, remainingPath.substr(0, i));
                pathParts.push(subPart);
                remainingPath = remainingPath.substr(i+2);
                remainingPathRestart = true;
            }
            else if (remainingPath.length > 6 && remainingPath.substr(i, 6) == "$index"){
                pathParts.push(index);
                remainingPath = remainingPath.substr(i+6);
                remainingPathRestart = true;
            }
            else if (remainingPath.length == i+1){
                pathParts.push(remainingPath);
                remainingPath = "";
            }
        }
    }
    var property = boundModel;
    for (var i =0; i < pathParts.length;i++){
        property = property[pathParts[i]];
    }
    return property;

}

var setFieldValue = function<T extends BoundType>(boundModel : T, path : string, value : any, index : number = 0){
    // Split on .
    // Split on []
    // replace anything in {{}} with result of it (run another getFieldValue first)
    // replace $index with the actual index, if applicable
}


// TODO: build out a setter method that can expand fieldnames that traverse multiple layers of objects.
let StandardActionLibrary = {
    innerHTML: function<T extends BoundType>(this : HTMLElement, boundModel : T, ...params : string[]){        
        // Set inner text at start. Not waiting.
        
        let fieldPath = params[0];
        let htmlElement = this;
        // if (boundModel[fieldPath] === undefined){            
        //     throw `innerHTML: FieldName ${fieldPath} wasn't valid.`;
        // }
        let value : string | null = getFieldValue(boundModel, fieldPath);
        this.innerHTML = value || "";
        let update = function(){
            var newValue = getFieldValue(boundModel, fieldPath);
            if (newValue !== value){
                value = newValue;
                htmlElement.innerHTML = newValue;
            }
        }
        return update;
    },
    innerText: function<T extends BoundType>(this : HTMLElement, boundModel : T, ...params : string[]) : Function{        
        // Set inner text at start. Not waiting.
        let fieldPath = params[0];
        let htmlElement = this;
        // if (boundModel[fieldName] === undefined){            
        //     throw `innerText: FieldName ${fieldName} wasn't valid.`;
        // }
        let value : string | null = getFieldValue(boundModel, fieldPath);        
        this.innerHTML = value || "";
        let update = function(){
            var newValue = getFieldValue(boundModel, fieldPath);
            if (newValue !== value){
                value = newValue;
                htmlElement.innerText = newValue;
            }
        }
        return update;
    },
    click: function<T extends BoundType>(this : HTMLElement, boundModel : T, ...params : string[]) : null {        
        let fieldName = params[0];
        if (boundModel[fieldName] === undefined){            
            throw `click: FieldName ${fieldName} wasn't valid.`;
        }
        this.addEventListener('click', function(ev : MouseEvent){
            boundModel[fieldName](ev, ...params.slice(1));
        });
        return null;
    },
    numberInput: function<T extends BoundType>(this : HTMLElement, boundModel : T, ...params : string[]) : null {         
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
    },
    textInput: function<T extends BoundType>(this : HTMLElement, boundModel : T, ...params : string[]) : null{         
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
    },
    repeat:  function<T extends BoundType>(this : HTMLElement, boundModel : T, ...params : string[]) : Function | null {        
        var repeatTemplate = this.innerHTML;
        // Template acquired, empty the repeat item
        let htmlElement = this;
        this.innerHTML = "";
        let fieldPath = params[0];
        var arrayLength :  number  =  0;            
        let update = function(){
            var newValue = getFieldValue(boundModel, fieldPath);
            if (!Array.isArray(newValue)){                
                throw 'Data source is not an array';
            }
            if (newValue.length > arrayLength && htmlElement.insertAdjacentElement){             
                var templateList : string[]= [];
                for (var i = arrayLength; i < newValue.length; i++){
                    var itemTemplate = repeatTemplate;
                    while (itemTemplate.indexOf('$index') !== -1){
                        itemTemplate = itemTemplate.replace("$index", i.toString());                        
                    }
                    
                    templateList.push(itemTemplate);
                }
                htmlElement.insertAdjacentHTML("beforeend",  templateList.join(""));      
                
                // TODO: have to figure out how to force binding application here
            }
            else  if (newValue.length < arrayLength || !htmlElement.insertAdjacentElement){          
                var templateList : string[]= [];
                for (var i = 0; i < newValue.length; i++){
                    var itemTemplate = repeatTemplate;
                    while (itemTemplate.indexOf('$index') !== -1){
                        itemTemplate = itemTemplate.replace("$index", i.toString());                        
                    }
                    
                    templateList.push(itemTemplate);
                }
                htmlElement.innerHTML = templateList.join("");      

            }
            
            arrayLength = newValue.length;   
        }       
        // TODO: don't call update right away
        // update(); 
        return update;
    }

}