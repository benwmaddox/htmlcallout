interface BoundType {
    [key:string]: any;
}
class Callout<T extends BoundType>{
    private boundModel : T;    
    private boundSelf : Callout<T>;
    private actions : {[key : string]: (boundModel : T, ...parameters : string[]) => void;}
    private dataBoundId : number = 1;
    private rootElement : HTMLElement;
    constructor(boundModel : T, htmlElement : HTMLElement, actions:{[key : string]: (boundModel : T, ...parameters : string[]) => void;}) {
        this.boundModel = boundModel;   
        this.rootElement = htmlElement;             
        this.actions = actions;
        this.boundSelf = this;
        this.applyBindings();
    }
    public applyBindings(){
        var modelNodes = this.rootElement.querySelectorAll('[data-bind]');
        for(var i = 0; i < modelNodes.length; i++){
            var item = modelNodes.item(i);
            var id = item.getAttribute("data-bound-id");
            if (id === null) {
                item.setAttribute("data-bound-id", (this.dataBoundId++).toString());                
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
            actionFunction.call(element, this.boundModel, ...parameters);
        });
    }
}