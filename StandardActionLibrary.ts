// /// <reference path="htmlCallout.ts" />

// let innerHTML = function<T extends BoundType>(this : HTMLElement, boundModel : T, ...params : string[]){        
//     // Set inner text at start. Not waiting.
//     let fieldName = params[0];
//     let htmlElement = this;
//     if (boundModel[fieldName] === undefined){            
//         throw `innerHTML: FieldName ${fieldName} wasn't valid.`;
//     }
//     let value : string | null = boundModel[fieldName];        
//     this.innerHTML = value || "";
//     let update = function(){
//         var newValue = boundModel[fieldName];
//         if (newValue !== value){
//             value = newValue;
//             htmlElement.innerHTML = newValue;
//         }
//     }
//     return update;
// };
// let innerText = function<T extends BoundType>(this : HTMLElement, boundModel : T, ...params : string[]){        
//     // Set inner text at start. Not waiting.
//     let fieldName = params[0];
//     let htmlElement = this;
//     if (boundModel[fieldName] === undefined){            
//         throw `innerText: FieldName ${fieldName} wasn't valid.`;
//     }
//     let value : string | null = boundModel[fieldName];        
//     this.innerHTML = value || "";
//     let update = function(){
//         var newValue = boundModel[fieldName];
//         if (newValue !== value){
//             value = newValue;
//             htmlElement.innerText = newValue;
//         }
//     }
//     return update;
// };
// let click = function<T extends BoundType>(this : HTMLElement, boundModel : Model, ...params : string[]) {        
//     let fieldName = params[0];
//     if (boundModel[fieldName] === undefined){            
//         throw `click: FieldName ${fieldName} wasn't valid.`;
//     }
//     this.addEventListener('click', function(ev : MouseEvent){
//         boundModel[fieldName](ev, ...params.slice(1));
//     });
//     return null;
// };
// let numberInput  = function<T extends BoundType>(this : HTMLElement, boundModel : Model, ...params : string[]){         
//     let fieldName = params[0];
//     if (boundModel[fieldName] === undefined){            
//         throw `numberInput: FieldName ${fieldName} wasn't valid.`;
//     }
//     if (!(this instanceof HTMLInputElement)){
//         throw `numberInput: FieldName ${fieldName} wasn't an HTML Input Element. Please only use on HTML Input Elements`;
//     }
//     this.addEventListener('keyup', function(ev : Event){
//         boundModel[fieldName] = Number((<HTMLInputElement>ev.target).value);
//     })
//     return null;
// };