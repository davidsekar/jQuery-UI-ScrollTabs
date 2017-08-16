/**
 * <a href="/jQuery-UI-ScrollTabs">< Back to project homepage</a><br><br>
 * Extended JQuery object with different plugins used in the project
 */
interface JQuery<TElement extends Node = HTMLElement> {
  /**
   * Initialize the scrollable tabs, passing scroll tabs options
   * @param options - options of type ScrollTabOptions
   * @returns Jquery&lt;HTMLElement>
   */
  scrollTabs: (options?: any) => JQuery<HTMLElement>;
  mousewheel: JQuery<HTMLElement>;
}

/**
 * <a href="/jQuery-UI-ScrollTabs">< Back to project homepage</a><br><br>
 * Declared to allow adding the definition for scrolltabs in JqueryUI namespace
 */
declare namespace JQueryUI {
  /**
   * UI interface that contains the scrolltabs ui widget
   */
  interface UI {
    /**
     * Initialize the scrollable tabs as a Jquery UI widget, passing scroll tabs options
     * @param options - options of type ScrollTabOptions
     * @returns Jquery&lt;HTMLElement>
     */
    scrollTabs: (options?: any) => JQuery<HTMLElement>;
  }
}

/**
 * <a href="/jQuery-UI-ScrollTabs">< Back to project homepage</a><br><br>
 * Interface to define debounce, throttle functions as part of jQuery Static object
 */
interface JQueryStatic<TElement extends Node = HTMLElement> {
  debounce: (delay: number, at_begin: any, callback?: any) => any;
  throttle: (delay: number, at_begin: any, callback?: any) => any;
}

/**
 * <a href="/jQuery-UI-ScrollTabs">< Back to project homepage</a><br><br>
 * This interface defines the list of options that could be passed
 * through <strong><em>scrollOptions</em></strong> object to customize the widget
 * according to your requirement.<br><br>
 * <pre><code>{
 *    // Normal tabs options
 *    active: 1,
 *    collapsible: true,
 *    // Extended Scrolltabs options
 *    scrollOptions: {
 *    }
 * } </code></pre>
 */
interface ScrollTabOptions {
  /**
   * Adds close button to each tab.<br><br>
   * <em>Default:</em> true
   */
  closable?: boolean;
  /**
   * Customize the HTML for default <em>'Go to first'</em> button.<br><br>
   * If provided, it will be used instead of default HTML<br><br>
   * <em>Default:</em> <code>&lt;button class="stNavFirstArrow ui-state-active" title="First">
   * &lt;span class="ui-icon ui-icon-seek-first">First tab&lt;/span>&lt;/button></code>
   */
  customGotoFirstHTML?: string;
  /**
   * Customize the HTML for default <em>'Go to last'</em> button.<br><br>
   * If provided, it will be used instead of default HTML<br><br>
   * <em>Default:</em> <code>&lt;button class="stNavLastArrow ui-state-active" title="Last">
   * &lt;span class="ui-icon ui-icon-seek-end">Last tab&lt;/span>&lt;/button></code>
   */
  customGoToLastHTML?: string;
  /**
   * Customize the HTML for default <em>'Move Next'</em> button.<br><br>
   * If provided, it will be used instead of default HTML<br><br>
   * <em>Default:</em> <code>&lt;button class="stNavNextArrow ui-state-active" title="Next">
   * &lt;span class="ui-icon ui-icon-seek-next">Next tab&lt;/span>&lt;/button></code>
   */
  customMoveNextHTML?: string;
  /**
   * Customize the HTML for default <em>'Move previous'</em> button.<br><br>
   * If provided, it will be used instead of default HTML<br><br>
   * <em>Default:</em> <code>&lt;button class="stNavPrevArrow ui-state-active" title="Previous">
   * &lt;span class="ui-icon ui-icon-seek-prev">Previous tab&lt;/span>&lt;/button></code>
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
   * Customize the tab header HTML<br><br>
   * <em>Default:</em> <code>&lt;div class="ui-widget-header ui-corner-all"/></code>
   */
  headerHTML?: string;
  /**
   * Customize the scrollable div part in the header, which hosts your tab headers.<br><br>
   * <em>Default:</em> <code>&lt;div class="ui-scroll-tabs-view"/></code>
   */
  headerScrollHTML?: string;
  /**
   * Hide previous and next arrows<br><br>
   * <em>Default:</em> false
   */
  hideDefaultArrows?: boolean;
  /**
   * Customize the wrapper HTML around 'Go to First' and 'Move to previous'. <br><br>
   * <em>Default:</em> <code>&lt;div class="stNavMain stNavMainLeft"/></code>
   */
  leftArrowWrapperHTML?: string;
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
   * Customize the wrapper HTML around 'Move to Next' and 'Go to Last'. <br><br>
   * <em>Default:</em> <code>&lt;div class="stNavMain stNavMainRight"/></code>
   */
  rightArrowWrapperHTML?: string;
  /**
  * Control speed of the animations<br><br>
  * <em>Default:</em> 500ms
  */
  scrollSpeed?: number;
  /**
   * Using navigation controls like previous or next button, to change the selected tab<br><br>
   * <em>Default:</em> true
   */
  selectTabAfterScroll?: boolean;
  /**
   * Enable auto select of new tab, when it is added<br><br>
   * <em>Default:</em> true
   */
  selectTabOnAdd?: boolean;
  /**
   * Enable <em>'Go to first'</em> or <em>'Go to last'</em> arrows<br><br>
   * <em>Default:</em> true
   */
  showFirstLastArrows?: boolean;
  /**
   * If enabled, it shows the navigation arrows like previous, next
   * only when tab headers doesn't fit within the view.<br><br>
   * If false: It always show navigation controls.<br><br>
   * <em>Default:</em> true
   */
  showNavWhenNeeded?: boolean;
  /**
   * Custom css classname to be added to the tab. So you can customize it.<br><br>
   * <em>Default:</em> ''
   */
  wrapperCssClass?: string;
  /**
   * Allow you to access and assign values for properties using indexer or key
   */
  [propName: string]: any;
}
