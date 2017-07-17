interface JQuery<TElement extends Node = HTMLElement> {
  scrollabletabs: (options: any) => void;
}
interface JQueryStatic<TElement extends Node = HTMLElement> {
  debounce: (delay:number, at_begin: any, callback?:any) => any;
  throttle: (delay:number, at_begin: any, callback?:any) => any;
}
