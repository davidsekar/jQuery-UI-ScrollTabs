/// <reference path="../../node_modules/@types/jquery/index.d.ts" />
/// <reference path="../../node_modules/@types/jqueryui/index.d.ts" />
/// <reference path="../ts/jquery.ui.scrolltabs.d.ts" />
(($) => {
  $.widget('ui.scrollTabs', $.ui.tabs, {
    $ul: null,
    $leftArrowWrapper: null,
    $rightArrowWrapper: null,
    $scrollDiv: null,
    $navPrev: null,
    $navNext: null,
    $navFirst: null,
    $navLast: null,
    debounceEnabled: false,
    eventDelay: 350,
    options: {
      scrollOptions: {
        animateTabs: false,
        showNavWhenNeeded: true,
        customNavNext: null,
        customNavPrev: null,
        customNavFirst: null,
        customNavLast: null,
        closable: true,
        easing: 'swing',
        loadLastTab: false,
        onTabScroll() {
          // empty
        },
        scrollSpeed: 500,
        selectTabOnAdd: true,
        selectTabAfterScroll: true,
        showFirstLastArrows: true,
        hideDefaultArrows: false,
        nextPrevOutward: false,
        wrapperCssClass: '',
        enableDebug: false,
        headerHTML: '<div class="ui-widget-header ui-corner-all"/>',
        headerScrollHTML: '<div class="ui-scroll-tabs-view"/>',
        leftArrowWrapperHTML: '<div class="stNavMain stNavMainLeft"/>',
        prevArrowButtonHTML: '<button class="stNavPrevArrow ui-state-active" title="Previous">' +
        '<span class="ui-icon ui-icon-seek-prev">Previous tab</span></button>',
        firstArrowButtonHTML: '<button class="stNavFirstArrow ui-state-active" title="First">' +
        '<span class="ui-icon ui-icon-seek-first">First tab</span></button>',
        rightArrowWrapperHTML: '<div class="stNavMain stNavMainRight"/>',
        nextArrowButtonHTML: '<button class="stNavNextArrow ui-state-active" title="Next">' +
        '<span class="ui-icon ui-icon-seek-next">Next tab</span></button>',
        lastArrowButtonHTML: '<button class="stNavLastArrow ui-state-active" title="Last">' +
        '<span class="ui-icon ui-icon-seek-end">Last tab</span></button>',
      }
    },
    navigateOptions: {
      previous: 1,
      next: 2,
      first: 3,
      last: 4
    },
    _create() {
      const options = this.options;

      const $elem: JQuery<HTMLElement> = this.element;
      this.$ul = $elem.find('ol,ul').eq(0).detach();

      /* Add custom markup */
      const $headerWrapper = $(this.options.scrollOptions.headerHTML);
      $headerWrapper.addClass('ui-scroll-tabs-header');
      $elem.prepend($headerWrapper);

      const $innerWrapper = $(this.options.scrollOptions.headerScrollHTML);
      $innerWrapper.addClass('ui-scroll-tabs-view');
      $headerWrapper.append($innerWrapper);

      $innerWrapper.append(this.$ul);
      /* End */

      this._setOption('activate', (event: JQuery.Event, ui: JQueryUI.TabsActivationUIParams) => {
        this._animateToActiveTab(event);
      });

      // Call the base
      this._super();

      this._setupUserOptions();
    },
    _setOption(key: string, value: any) {
      this._super(key, value);
    },
    _setOptions(options: JQueryUI.TabsOptions) {
      this._super(options);
    },
    _activate(index: number) {
      this._super(index);
    },
    _setupUserOptions() {
      const options = this.options.scrollOptions;
      this.debounceEnabled = $.debounce ? true : false;
      this.debug('isDebounceEnabled : ' + this.debounceEnabled);

      const $elem: JQuery<HTMLElement> = this.element;
      $elem.addClass(options.wrapperCssClass + ' ui-scroll-tabs');
    },
    /**
     * Centrally control all message to be logged to the console
     * @param message -message to be displayed
     */
    debug(message: any, isError?: boolean) {
      if (this.options.scrollOptions.enableDebug) {
        if (isError === true) {
          console.error(message);
        } else {
          console.log(message);
        }
      }
    },
    /**
     * If debounce/throttle plugin is found, it debounces the event handler function
     * @param dbFunc the event handler function
     */
    debounceEvent(dbFunc: (e: JQuery.Event) => void):
      JQuery.EventHandler<HTMLElement> {
      return this.debounceEnabled ? $.debounce(this.eventDelay, dbFunc) : dbFunc;
    },
    /**
     * If debounce/throttle plugin is found, it uses it in the event handler function
     * @param dbFunc the event handler function
     */
    throttleEvent(dbFunc: (e: JQuery.Event) => void):
      JQuery.EventHandler<HTMLElement> {
      return this.debounceEnabled ? $.throttle(this.eventDelay, dbFunc) : dbFunc;
    },
    scrollTabHeader(distance: number, duration: number) {
      if (distance < 0) {
        distance = 0;
      }
      this.$scrollDiv.animate({ scrollLeft: distance },
        duration, this.options.scrollOptions.easing);
    },
    _bindTouchEvents() {
      if (!$.fn.swipe) {
        return;
      }
      this.$scrollDiv.swipe({
        threshold: 75,
        triggerOnTouchEnd: true,
        allowPageScroll: 'vertical',
        swipeStatus: (event: any, phase: any, direction: any, distance: any) => {
          // If we are moving before swipe, and we are going
          // L or R in X mode, or U or D in Y mode then drag.
          if (phase === $.fn.swipe.phases.PHASE_MOVE
            && (direction === $.fn.swipe.directions.LEFT
              || direction === $.fn.swipe.directions.RIGHT)) {

            const currentScrollLeft = this.$scrollDiv.scrollLeft();
            const duration = 0;
            const distanceWithResistance = distance / 15;
            if (direction === $.fn.swipe.directions.LEFT) {
              this.scrollTabHeader(currentScrollLeft + distanceWithResistance, duration);
            } else if (direction === $.fn.swipe.directions.RIGHT) {
              this.scrollTabHeader(currentScrollLeft - distanceWithResistance, duration);
            }
          } else if (phase === $.fn.swipe.phases.PHASE_CANCEL) {
            // Don't animate for current swipe, as it is canceled
            // this._showNavsIfNeeded();
          } else if (phase === $.fn.swipe.phases.PHASE_END) {
            // to be added
            this._showNavsIfNeeded();
          }
        }
      });
    },
    /**
     * Initializes the navigation controls based on user settings
     */
    _setupNavControls() {
      this.$scrollDiv = this.$ul.parent();

      // Set the height of the UL
      this.$scrollDiv.height(this.tabs.first().outerHeight());

      this.$leftArrowWrapper = $(this.options.scrollOptions.leftArrowWrapperHTML);
      this.$rightArrowWrapper = $(this.options.scrollOptions.rightArrowWrapperHTML);

      if (!this.options.scrollOptions.hideDefaultArrows) {
        this.$navPrev = $(this.options.scrollOptions.prevArrowButtonHTML);
        this.$leftArrowWrapper.append(this.$navPrev);

        this.$navNext = $(this.options.scrollOptions.nextArrowButtonHTML);
        this.$rightArrowWrapper.append(this.$navNext);

        if (this.options.scrollOptions.showFirstLastArrows === true) {
          this.$navFirst = $(this.options.scrollOptions.firstArrowButtonHTML);
          this.$leftArrowWrapper.prepend(this.$navFirst);

          this.$navLast = $(this.options.scrollOptions.lastArrowButtonHTML);
          this.$rightArrowWrapper.append(this.$navLast);
        } else {
          this.$navFirst = this.$navLast = $();
        }
      }
      this.$scrollDiv.before(this.$leftArrowWrapper);
      this.$scrollDiv.after(this.$rightArrowWrapper);

      this._addclosebutton();
      this._bindTouchEvents();
    },
    /**
     * Initializes all the controls and events required for scroll tabs
     */
    _init() {
      this._setupNavControls();
      this._showNavsIfNeeded();
      this._addNavEvents();
      $(window).on('resize', this.debounceEvent(() => { this._showNavsIfNeeded(); }));
    },
    /**
     * Check if navigation need then show; otherwise hide it
     */
    _showNavsIfNeeded() {
      if (this.options.scrollOptions.showNavWhenNeeded === false) {
        return; // do nothing
      }

      let showLeft = !(this.$scrollDiv.scrollLeft() <= 0);
      let showRight = !(Math.abs(this.$scrollDiv[0].scrollWidth - this.$scrollDiv.scrollLeft()
        - this.$scrollDiv.outerWidth()) < 1);

      if (this.options.scrollOptions.selectTabAfterScroll) {
        showLeft = !(this.options.active === 0);
        showRight = (this.options.active + 1 === this.tabs.length) ? false : true;
      }

      showLeft ? this.$leftArrowWrapper.addClass('stNavVisible')
        : this.$leftArrowWrapper.removeClass('stNavVisible');

      showRight ? this.$rightArrowWrapper.addClass('stNavVisible')
        : this.$rightArrowWrapper.removeClass('stNavVisible');
    },
    _callBackFnc(
      fName: (e: JQuery.Event, arg: any) => any,
      event: JQuery.Event,
      arg1: any) {

      if ($.isFunction(fName)) {
        fName(event, arg1);
      }
    },
    /**
     * returns the delta that should be added to current scroll to bring it into view
     * @param $tab tab that should be tested
     */
    _getScrollDeltaValue($tab: JQuery<HTMLElement>): number {
      const leftPosition = $tab.position();
      const width = $tab.outerWidth();

      const currentScroll = this.$scrollDiv.scrollLeft();
      const currentVisibleWidth = this.$scrollDiv.width();

      let hiddenDirection = 0;
      const arrowsWidth = this.$leftArrowWrapper.width();

      // Check if the new tab is in view
      if (leftPosition.left < currentScroll) {
        hiddenDirection = leftPosition.left - currentScroll - arrowsWidth;
      } else if (leftPosition.left + width + arrowsWidth > currentScroll + currentVisibleWidth) {
        hiddenDirection = (leftPosition.left + width + arrowsWidth)
          - (currentScroll + currentVisibleWidth);
      }

      return hiddenDirection;
    },
    _scrollWithoutSelection(navOpt: number) {
      let scrollLeft = this.$scrollDiv.scrollLeft();

      switch (navOpt) {
        case this.navigateOptions.first:
          scrollLeft = 0;
          break;
        case this.navigateOptions.last:
          scrollLeft = this.$scrollDiv[0].scrollWidth;
          break;
        case this.navigateOptions.previous:
          scrollLeft -= this.$scrollDiv.outerWidth() / 2;
          break;
        case this.navigateOptions.next:
          scrollLeft += this.$scrollDiv.outerWidth() / 2;
          break;
      }

      if (scrollLeft < 0) {
        scrollLeft = 0;
      }
      this.$scrollDiv.stop().animate(
        { scrollLeft },
        this.options.scrollOptions.scrollSpeed / 2,
        this.options.scrollOptions.easing,
        () => { this._showNavsIfNeeded(); });
    },
    _animateToActiveTab(e?: JQuery.Event) {
      const calculatedDelta: number = this._getScrollDeltaValue(this.active);

      this.$scrollDiv.stop().animate(
        { scrollLeft: this.$scrollDiv.scrollLeft() + calculatedDelta },
        this.options.scrollOptions.scrollSpeed,
        this.options.scrollOptions.easing);
      this._showNavsIfNeeded();

      // trigger callback if defined
      e = (typeof e === 'undefined') ? null : e;
      this._callBackFnc(this.options.scrollOptions.onTabScroll, e, this.active);
    },
    /**
     * Return a new jQuery object for user provided selectors or else use the default ones
     * @param col if selector is provided by user, then override the existing controls
     * @param nav Nav control selector option prop name suffix
     */
    _getCustomNavSelector(col: JQuery<HTMLElement>, nav: string) {
      const sel = this.options.scrollOptions['customNav' + nav] || '';
      // Check for custom selector
      if (typeof sel === 'string' && $.trim(sel) !== '') {
        col = col.add(sel);
      }
      return col;
    },
    /**
     * This function add the navigation control and binds the required events
     */
    _addNavEvents() {
      // Handle next tab
      this.$navNext = this.$navNext || $();
      this.$navNext = this._getCustomNavSelector(this.$navNext, 'Next');
      this.$navNext.on('click',
        this.debounceEvent((e: JQuery.Event) => { this._moveToNextTab(e); }));

      // Handle previous tab
      this.$navPrev = this.$navPrev || $();
      this.$navPrev = this._getCustomNavSelector(this.$navPrev, 'Prev');
      this.$navPrev.on('click',
        this.debounceEvent((e: JQuery.Event) => { this._moveToPrevTab(e); }));

      // Handle First tab
      this.$navFirst = this.$navFirst || $();
      this.$navFirst = this._getCustomNavSelector(this.$navFirst, 'First');
      this.$navFirst.on('click',
        this.debounceEvent((e: JQuery.Event) => { this._moveToFirstTab(e); }));

      // Handle last tab
      this.$navLast = this.$navLast || $();
      this.$navLast = this._getCustomNavSelector(this.$navLast, 'Last');
      this.$navLast.on('click',
        this.debounceEvent((e: JQuery.Event) => { this._moveToLastTab(e); }));
    },
    /**
     * Handles move to next tab link click
     * @param e pass the link click event
     */
    _moveToNextTab(e: JQuery.Event) {
      e.preventDefault();

      if (!this.options.scrollOptions.selectTabAfterScroll) {
        this._scrollWithoutSelection(this.navigateOptions.next);
        return;
      }
      this._activate(this._findNextTab(Math.max(0, this.options.active + 1), true));
    },
    /**
     * Handles move to previous tab link click
     * @param e pass the link click event
     */
    _moveToPrevTab(e: JQuery.Event) {
      e.preventDefault();

      if (!this.options.scrollOptions.selectTabAfterScroll) {
        this._scrollWithoutSelection(this.navigateOptions.previous);
        return;
      }
      this._activate(this._findNextTab(Math.max(0, this.options.active - 1), false));
    },
    /**
     * Handles move to first tab link click
     * @param e pass the link click event
     */
    _moveToFirstTab(e?: JQuery.Event) {
      e.preventDefault();

      if (!this.options.scrollOptions.selectTabAfterScroll) {
        this._scrollWithoutSelection(this.navigateOptions.first);
        return;
      }

      this._activate(this._findNextTab(0, false));
    },
    /**
     * Handles move to last tab link click
     * @param e pass the link click event
     */
    _moveToLastTab(e: JQuery.Event) {
      e.preventDefault();

      if (!this.options.scrollOptions.selectTabAfterScroll) {
        this._scrollWithoutSelection(this.navigateOptions.last);
        return;
      }

      this._activate(this._findNextTab(this.tabs.length - 1, true));
    },

    _addclosebutton($li?: JQuery<HTMLElement>) {
      if (this.options.scrollOptions.closable === false) {
        return;
      }
      // If li is provide than just add to that, otherwise add to all
      const lis = $li || this.tabs;
      const self = this;
      lis.each((idx: number, obj: HTMLElement) => {
        const $thisLi: JQuery<HTMLElement> = $(obj).addClass('stHasCloseBtn');
        $thisLi.append($('<span class="ui-state-default ui-corner-all stCloseBtn">' +
          '<span class="ui-icon ui-icon-circle-close" title="Close this tab">Close</span>' +
          '</span>'));

        $thisLi.find('.stCloseBtn').hover(function () {
          $(this).toggleClass('ui-state-hover');
        }).on('click', (e) => {
          const removeIdx = self.tabs.index($thisLi);
          let selectTabIdx: number;
          selectTabIdx = -1;

          if (self.options.active === removeIdx) {
            const tabcount = self.tabs.length;
            const mid = Math.ceil(tabcount / 2);
            if (removeIdx > mid) {
              selectTabIdx = removeIdx - 1;
            } else {
              selectTabIdx = removeIdx;
            }
          }

          self.removeTab($thisLi.find('a.ui-tabs-anchor'));

          if (selectTabIdx > -1 && selectTabIdx !== removeIdx) {
            self._activate(selectTabIdx);
          }
        });
      });
    },
    addTab(header: string, panelContent: string) {
      const newId: string = $({}).uniqueId()[0].id;
      const tab = $('<li><a href="#' + newId + '" role="tab">' + header + '</a></li>');
      const panel = this._createPanel(newId);
      panel.html(panelContent);

      this.$ul.append(tab);
      panel.attr('aria-live', 'polite');

      if (panel.length) {
        $(this.panels[this.panels.length - 1]).after(panel);
      }

      panel.attr('role', 'tabpanel');
      this._addclosebutton(tab);

      this.refresh();
    },
    removeTab(anc: JQuery<HTMLElement>) {
      const tabId = anc.attr('href');
      // Remove the panel
      $(tabId).remove();
      // Remove the tab
      anc.closest('li').remove();
      // Refresh the tabs widget
      this.refresh();
    },
    _destroy() {
      this._super();

      /* Remove navigation controls */
      this.$leftArrowWrapper.remove();
      this.$rightArrowWrapper.remove();

      /* undo the close button */
      this.tabs.each((idx: number, element: JQuery<HTMLElement>) => {
        const self = $(element);
        self.removeClass('stHasCloseBtn');
        self.find('.stCloseBtn').remove();
      });

      /* Undo enhanced tab headers */
      const $headerWrapper = this.$ul.closest('.ui-scroll-tabs-header');

      this.$ul = this.$ul.detach();
      $headerWrapper.remove();
      this.element.prepend(this.$ul);

      /* Remove class from the base wrapper */
      this.element.removeClass(this.options.wrapperCssClass)
        .removeClass('ui-scroll-tabs');

      /* unsubscribe from the global resize event */
      $(window).off('resize', this.debounceEvent(() => { this._showNavsIfNeeded(); }));
    }
  });
  return $.ui.scrollTabs;
})(jQuery);
