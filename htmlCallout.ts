interface BoundType {
    [key:string]: any;
}
class Callout<T extends BoundType>{
    /**
     *
     */
    public boundModel : T;    
    public boundSelf : Callout<T>;
    public actions : {[key : string]: (boundModel : T, ...parameters : string[]) => void;}
    public dataBoundId : number = 1;
    constructor(boundModel : T, actions:{[key : string]: (boundModel : T, ...parameters : string[]) => void;}) {
        this.boundModel = boundModel;                
        this.actions = actions;
        this.boundSelf = this;
        this.initNodes();
    }
    public initNodes(){
        var modelNodes = document.querySelectorAll('[data-model]');
        for(var i = 0; i < modelNodes.length; i++){
            var item = modelNodes.item(i);
            var id = item.getAttribute("data-bound-id");
            if (id === null) {
                item.setAttribute("data-bound-id", (this.dataBoundId++).toString());                
            }
            else{ // Already bound
                continue;
            }
            var modelValue = item.getAttribute("data-model");            
            if (modelValue !== null){
                this.applyBoundActions(item, <string>modelValue);                
            }
        }

    }
    public applyBoundActions(element : Element, attribute : string){
        // Different actions split by ;. Action type then : then comma split values.  
        // ex/
        // innerHTML: title; click: someAction()
        var actions = attribute.split(';');
        actions.forEach(action  => {
            var actionName = action.split(":")[0];
            var parameters = action.split(":")[1].split(',');
            this.actions[actionName].call(element, this.boundModel, parameters);
        });
        // var attributeValue = this.boundModel[modelValue];
        // if (attributeValue === undefined){
        //     throw modelValue + ' does not exist on object';
        // }
        // item.innerHTML = attributeValue;
    }
    public model(event : Event, name: string) {
        if (typeof(event.target) == typeof(HTMLElement)){
            (<HTMLElement>event.target).innerText = this.boundModel[name.trim()];
        }
        // this.target.addEventListener("change", function(){
        //     this.boundSelf
        // })
    }    
}