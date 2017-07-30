interface JQuery<TElement extends Node = HTMLElement> {
  scrollTabs: (options?: any) => JQuery<HTMLElement>;
  swipe: JQuerySwipe<HTMLElement>;
  mousewheel: JQuery<HTMLElement>;
}

declare namespace JQueryUI {
  interface UI {
    scrollTabs: (options?: any) => JQuery<HTMLElement>;
  }
}

interface SwipePhases {
  PHASE_START: string,
  PHASE_MOVE: string,
  PHASE_END: string,
  PHASE_CANCEL: string
}

interface SwipeDirections {
  LEFT: string,
  RIGHT: string,
  UP: string,
  DOWN: string,
  IN: string,
  OUT: string
}

interface JQuerySwipe<TElement extends Node = HTMLElement> {
  (options: any): JQuery<HTMLElement>;
  directions: SwipeDirections;
  phases: SwipePhases;
  [n: number]: TElement;
}

interface JQueryStatic<TElement extends Node = HTMLElement> {
  debounce: (delay: number, at_begin: any, callback?: any) => any;
  throttle: (delay: number, at_begin: any, callback?: any) => any;
}
interface ScrollTabOptions {
  /**
   * Adds close button to each tab.<br><br>
   * <em>Default:</em> true
   */
  closable?: boolean;
  /**
   * Customize the HTML for default <em>'Go to first'</em> button.<br><br>
   * If provided, it will be used instead of default HTML
   */
  customGotoFirstHTML?: string;
  /**
   * Customize the HTML for default <em>'Go to last'</em> button.<br><br>
   * If provided, it will be used instead of default HTML
   */
  customGoToLastHTML?: string;
  /**
   * Customize the HTML for default <em>'Move Next'</em> button.<br><br>
   * If provided, it will be used instead of default HTML
   */
  customMoveNextHTML?: string;
  /**
   * Customize the HTML for default <em>'Move previous'</em> button.<br><br>
   * If provided, it will be used instead of default HTML
   */
  customMovePreviousHTML?: string;
  /**
   * Animation timing fn to be used while tabs transition.<br>
   * Css animations like linear, swing, ease-in-out etc., can be used<br><br>
   * <em>Default:</em> swing
   */
  easing?: string;
  /**
   * Enables debug information to be logged to console.<br><br>
   * <em>Default:</em> false
   */
  enableDebug: boolean;
  /**
   * Hide previous and next arrows<br><br>
   * <em>Default:</em> false
   */
  hideDefaultArrows?: boolean;
  /**
   * Last tab is selected as default active on initial load<br><br>
   * <em>Default:</em> false
   */
  loadLastTab?: boolean;
  /**
   * Add custom callback fn to be triggered after tab scroll animation
   * completion<br><br>
   * <em>Default:</em> empty callback function
   */
  onTabScroll?: () => void;
  /**
  * Control speed of the animations<br><br>
  * <em>Default:</em> 500ms
  */
  scrollSpeed?: number;
  /**
   * Using navigation controls like previous or next button, selects the targeted tab<br><br>
   * <em>Default:</em> true
   */
  selectTabAfterScroll?: boolean;
  /**
   * Enable auto select of new tab, when it is added
   * Default: true
   */
  selectTabOnAdd?: boolean;
  /**
   * true: shows the navigation arrows like previous, next
   *       only when all tabs doesn't fit within the view.
   * false: always show controls.
   * Default: true
   */
  showNavWhenNeeded?: boolean;
  /**
   * Enable goto first or last arrows
   * Default: true
   */
  showFirstLastArrows?: boolean;
  /**
   * Css class name to be added to the tab outer div
   * Default: '' or empty
   */
  wrapperCssClass?: string;
  [propName: string]: any;
}
