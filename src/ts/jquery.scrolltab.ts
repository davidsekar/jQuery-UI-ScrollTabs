/// <reference path="../../node_modules/@types/jquery/index.d.ts" />
/// <reference path="../../node_modules/@types/jqueryui/index.d.ts" />
/// <reference path="../ts/jquery.scrolltab.d.ts" />
(($) => {
  /**
   * Default options to be used for initialization
   * User provided values will override these values
   */
  const settings: ScrollTabOptions = {
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
    enableDebug: false
  };

  $.fn.scrollabletabs = function (options) {
    return this.each(function () {
      let opts: ScrollTabOptions;
      let $tabs: JQuery<HTMLElement>;
      let $scrollDiv: JQuery<HTMLElement>;
      let $ul: JQuery<HTMLElement>;
      let $lis: JQuery<HTMLElement>;
      let $curSelectedTab: JQuery<HTMLElement>;
      let $leftArrowWrapper: JQuery<HTMLElement>;
      let $rightArrowWrapper: JQuery<HTMLElement>;
      let $navPrev: JQuery<HTMLElement>;
      let $navNext: JQuery<HTMLElement>;
      let $navFirst: JQuery<HTMLElement>;
      let $navLast: JQuery<HTMLElement>;
      const eventDelay: number = 100;

      opts = $.extend({}, settings, typeof options === 'object' ? options : {});

      const isDebouncePluginFound = $.debounce ? true : false;
      log('Debounce plugin found - ' + isDebouncePluginFound);

      $tabs = $(this).addClass(opts.wrapperCssClass + ' stMainWrapper');
      $ul = $tabs.find('ul.ui-tabs-nav:first');
      $lis = $ul.find('li');

      // We will use our own css class to detect a selected tab
      // because we might want to scroll without tab being selected
      $curSelectedTab = $ul.find('.ui-tabs-selected')
        .addClass('stCurrentTab');

      /**
       * If debounce/throttle plugin is found, it debounces the event handler function
       * @param dbFunc the event handler function
       */
      function debounceEvent(dbFunc: (e: JQuery.Event) => void):
        JQuery.EventHandler<HTMLElement> {
        return isDebouncePluginFound ? $.debounce(eventDelay, dbFunc) : dbFunc;
      }

      /**
       * If debounce/throttle plugin is found, it uses it in the event handler function
       * @param dbFunc the event handler function
       */
      function throttleEvent(dbFunc: (e: JQuery.Event) => void):
        JQuery.EventHandler<HTMLElement> {
        return isDebouncePluginFound ? $.throttle(eventDelay, dbFunc) : dbFunc;
      }

      /**
       * Centrally control all message to be logged to the console
       * @param message -message to be displayed
       */
      function log(message: any, isError?: boolean) {
        if (opts.enableDebug) {
          if (isError === true) {
            console.error(message);
          } else {
            console.log(message);
          }
        }
      }

      function getTabList() {
        return $ul.find('li');
      }

      /**
       * Returns number of tabs in $tabs widget
       */
      function getTabCount(): number {
        return $ul.children('li').length;
      }

      /**
       * calculates the navigation controls width and offsets the inner tab header accordingly
       */
      function _offsetTabsBasedOnNavControls() {
        let leftMargin: number = 0;
        let rightMargin: number = 0;

        if ($leftArrowWrapper.is(':visible')) {
          leftMargin = $leftArrowWrapper.outerWidth();
          rightMargin = $rightArrowWrapper.outerWidth();
        }
        $scrollDiv.css({
          'margin-left': leftMargin,
          'margin-right': rightMargin
        });
      }
      function scrollTabHeader(distance: number, duration: number) {
        if (distance < 0) {
          distance = 0;
        }

        $scrollDiv.animate({ scrollLeft: distance }, duration, 'linear');
      }

      function _bindTouchEvents() {
        if (!$.fn.swipe) {
          return;
        }
        $scrollDiv.swipe({
          threshold: 75,
          triggerOnTouchEnd: true,
          allowPageScroll: 'vertical',
          swipeStatus: (event: any, phase: any, direction: any, distance: any) => {
            // If we are moving before swipe, and we are going
            // L or R in X mode, or U or D in Y mode then drag.
            if (phase === 'move' && (direction === 'left' || direction === 'right')) {
              const currentScrollLeft = $scrollDiv.scrollLeft();
              const duration = 0;
              const distanceWithResistance = distance / 15;
              if (direction === 'left') {
                scrollTabHeader(currentScrollLeft + distanceWithResistance, duration);
              } else if (direction === 'right') {
                scrollTabHeader(currentScrollLeft - distanceWithResistance, duration);
              }
            } else if (phase === 'cancel') {
              const currentScrollLeft = $scrollDiv.scrollLeft();
              scrollTabHeader(currentScrollLeft, opts.scrollSpeed);
            } else if (phase === 'end') {
              // to be added
            }
          }
        });
      }

      /**
       * Initializes the navigation controls based on user settings
       */
      function _setupNavControls() {
        $scrollDiv = $ul.parent();

        // Set the height of the UL
        $scrollDiv.height($lis.first().outerHeight());

        $leftArrowWrapper = $('<div class="stNavMain stNavMainLeft"/>');
        $rightArrowWrapper = $('<div class="stNavMain stNavMainRight"/>');

        if (!opts.hideDefaultArrows) {
          $navPrev = $('<button class="stNavPrevArrow ui-state-active" title="Previous">' +
            '<span class="ui-icon ui-icon-seek-prev">Previous tab</span></button>');
          $leftArrowWrapper.append($navPrev);

          $navNext = $('<button class="stNavNextArrow ui-state-active" title="Next">' +
            '<span class="ui-icon ui-icon-seek-next">Next tab</span></button>');
          $rightArrowWrapper.append($navNext);

          if (opts.showFirstLastArrows === true) {
            $navFirst = $('<button class="stNavFirstArrow ui-state-active" title="First">' +
              '<span class="ui-icon ui-icon-seek-first">First tab</span></button>');
            $leftArrowWrapper.prepend($navFirst);

            $navLast = $('<button class="stNavLastArrow ui-state-active" title="Last">' +
              '<span class="ui-icon ui-icon-seek-end">Last tab</span></button>');
            $rightArrowWrapper.append($navLast);
          } else {
            $navFirst = $navLast = $();
          }
        }
        $scrollDiv.before($leftArrowWrapper);
        $scrollDiv.after($rightArrowWrapper);

        // Add close buttons if required
        _addclosebutton();

        _bindTouchEvents();
      }

      /**
       * Initializes all the controls and events required for scroll tabs
       */
      function _init() {
        _updateCurrentTab($tabs.find('li').eq(0));
        // Add nav controls
        _setupNavControls();
        // See if nav is needed
        _showNavsIfNeeded();
        // Add events to the navigation buttons
        _addNavEvents();

        // If tab is selected manually by user than also change the css class
        $tabs.on('tabsactivate', (event, ui) => {
          _updateCurrentTab($(ui.newTab));
          _showNavsIfNeeded();
          _animateTabTo(ui.newTab, null, event);
        });

        $tabs.on('tabsadd', (event, ui): any => {
          const $thisLi = $(ui.tab).parents('li');
          // Update li list
          $lis = $ul.find('li');
          // Adjust the position of last tab
          // Welcome the new tab by adding a close button
          _addclosebutton($thisLi);
          // Next move tab to the end
          // See if nav needed
          _showNavsIfNeeded();
          // Adjust the left position of all tabs
          _adjustLeftPosition($thisLi);
          // Check if select on add
          if (opts.selectTabOnAdd) {
            log($lis.index($thisLi));
            $(this).tabs('option', 'active', $lis.index($thisLi));
          }
        }).on('tabsremove', (event, ui): any => {
          // var $thisLi = $(ui.tab).parents('li');
          // Update li list
          $lis = $ul.find('li');
          // If one tab remaining than hide the close button
          if (getTabCount() === 1) {
            $ul.find('.ui-icon-circle-close').addClass('stFirstTab').hide();
          } else {
            // Because if user add new tab, close button for all tabs must be shown
            $ul.find('.ui-icon-circle-close').show();
            // Assign 'stFirstTab' to first tab
            _updateCurrentTab($lis.first()); // In case the first tab was removed
          }
          // To make sure to hide navigations if not needed
          _showNavsIfNeeded();
          // Adjust the position of tabs, i.e move the Next tabs to the left
          _adjustLeftPosition();

          // Check if the tab closed was the last tab than navigate the second last tab
          // to the position of the last tab
          /* if(isLastTab)
          {
            return;
            // Adjust the position of last tab
            var m = parseFloat($lis.first().css('margin-left')) + thisTabWidth;
            $lis.css('margin-left',m)
          } */
        });

        $(window).on('resize', debounceEvent(_showNavsIfNeeded));
      }

      /**
       * Check if navigation need then show; otherwise hide it
       */
      function _showNavsIfNeeded() {
        if (opts.showNavWhenNeeded === false) {
          return; // do nothing
        }
        log(_liWidth() + ', ' + $scrollDiv.width());

        // Get the width of all tabs and compare it with the width of $ul (container)
        if ((_liWidth() + ($leftArrowWrapper.width() * 2)) >= $scrollDiv.width()) {
          $leftArrowWrapper.css('visibility', 'visible').show();
          $rightArrowWrapper.css('visibility', 'visible').show();
        } else {
          $leftArrowWrapper.css('visibility', 'hidden').hide();
          $rightArrowWrapper.css('visibility', 'hidden').hide();
        }

        const currentTabIndex = $lis.index($curSelectedTab);

        if (currentTabIndex === 0) {
          $leftArrowWrapper.css('visibility', 'hidden').hide();
        } else if (currentTabIndex + 1 === getTabCount()) {
          $rightArrowWrapper.css('visibility', 'hidden').hide();
        }

        _offsetTabsBasedOnNavControls();
      }

      function _callBackFnc(
        fName: (e: JQuery.Event, arg: any) => any,
        event: JQuery.Event,
        arg1: any) {

        if ($.isFunction(fName)) {
          fName(event, arg1);
        }
      }

      /**
       * returns the delta that should be added to current scroll to bring it into view
       * @param $tab tab that should be tested
       */
      function _getScrollDeltaValue($tab?: JQuery<HTMLElement>): number {
        // If no tab is provided than take the current
        $tab = $tab || $curSelectedTab;

        const leftPosition = $tab.position();
        const width = $tab.outerWidth();

        const currentScroll = $scrollDiv.scrollLeft();
        const currentVisibleWidth = $scrollDiv.width();

        let hiddenDirection = 0;

        // Check if the new tab is in view
        if (leftPosition.left < currentScroll) {
          hiddenDirection = leftPosition.left - currentScroll;
        } else if (leftPosition.left + width > currentScroll + currentVisibleWidth) {
          hiddenDirection = (leftPosition.left + width) - (currentScroll + currentVisibleWidth);
        }

        return hiddenDirection;
      }

      function _animateTabTo($tab: JQuery<HTMLElement>, tabIndex: number, e?: JQuery.Event) {
        $tab = $tab || $curSelectedTab;
        const calculatedDelta: number = _getScrollDeltaValue($tab);

        $scrollDiv.stop().animate({
          scrollLeft: $scrollDiv.scrollLeft() + calculatedDelta
        }, opts.scrollSpeed, opts.easing);

        if (opts.selectTabAfterScroll && tabIndex !== null) {
          $tabs.tabs('option', 'active', tabIndex);
        } else {
          // Update current tab
          // Means this method is called from showTab event so tab css is already updated
          if (tabIndex > -1) {
            // d($tab);
            _updateCurrentTab($tab);
            // d($curSelectedTab);
          }
        }

        // Callback
        e = (typeof e === 'undefined') ? null : e;
        _callBackFnc(opts.onTabScroll, e, $tab);

        // Finally stop the event
        if (e) {
          e.preventDefault();
        }
      }

      /**
       * Return a new jQuery object for user provided selectors or else use the default ones
       * @param col if selector is provided by user, then override the existing controls
       * @param nav Nav control selector option prop name suffix
       */
      function _getCustomNavSelector(col: JQuery<HTMLElement>, nav: string) {
        const sel = opts['customNav' + nav] || '';
        // Check for custom selector
        if (typeof sel === 'string' && $.trim(sel) !== '') {
          col = col.add(sel);
        }
        return col;
      }

      /**
       * This function add the navigation control and binds the required events
       */
      function _addNavEvents() {
        // Handle next tab
        $navNext = $navNext || $();
        $navNext = _getCustomNavSelector($navNext, 'Next');
        $navNext.on('click', debounceEvent(_moveToNextTab));

        // Handle previous tab
        $navPrev = $navPrev || $();
        $navPrev = _getCustomNavSelector($navPrev, 'Prev');
        $navPrev.on('click', debounceEvent(_moveToPrevTab));

        // Handle First tab
        $navFirst = $navFirst || $();
        $navFirst = _getCustomNavSelector($navFirst, 'First');
        $navFirst.on('click', debounceEvent(_moveToFirstTab));

        // Handle last tab
        $navLast = $navLast || $();
        $navLast = _getCustomNavSelector($navLast, 'Last');
        $navLast.on('click', debounceEvent(_moveToLastTab));
      }

      function _moveToNextTab(e: JQuery.Event) {
        e.preventDefault();

        let $nxtLi = $();
        // First check if user do not want to select tab on Next
        // than we have to find the next hidden (out of viewport) tab so we can scroll to it
        if (!opts.selectTabAfterScroll) {
          $curSelectedTab.nextAll('li').each(function () {
            if (_getScrollDeltaValue($(this))) {
              $nxtLi = $(this);
              return;
            }
          });
        } else {
          $nxtLi = $curSelectedTab.next('li');
        }

        // check if there is no next tab
        if ($nxtLi.length === 0) {
          log('You are on last tab, no next tab found.');
        } else {
          // get index of next element
          const indexNextTab = $lis.index($nxtLi);
          // check if li next to selected is in view or not
          if (_getScrollDeltaValue($nxtLi)) {
            _animateTabTo($nxtLi, indexNextTab, e);
          } else {
            $tabs.tabs('option', 'active', indexNextTab);
          }
        }

      }

      function _moveToPrevTab(e: JQuery.Event) {
        e.preventDefault();

        let $prvLi = $();
        // First check if user do not want to select tab on Prev
        // than we have to find the prev hidden (out of viewport) tab so we can scroll to it
        if (!opts.selectTabAfterScroll) {
          // Reverse the order of tabs list
          $($lis.get().reverse()).each(function () {
            if (_getScrollDeltaValue($(this))) {
              $prvLi = $(this);
              return;
            }
          });
        } else {
          $prvLi = $curSelectedTab.prev('li');
        }

        if ($prvLi.length === 0) {
          log('There is no previous tab. NO PREV TAB');
        } else {
          // Get index of prev element
          const indexPrevTab = $lis.index($prvLi);
          // check if li previous to selected is in view or not
          if (_getScrollDeltaValue($prvLi)) {
            _animateTabTo($prvLi, indexPrevTab, e);
          } else {
            $tabs.tabs('option', 'active', indexPrevTab);
          }
        }

      }

      function _moveToFirstTab(e?: JQuery.Event) {
        if (e) {
          e.preventDefault();
        }
        if ($lis.index($curSelectedTab) === 0) {
          log('You are on first tab already');
        } else {
          _animateTabTo($lis.first(), 0, e);
        }
      }

      function _moveToLastTab(e: JQuery.Event) {
        e.preventDefault();
        const $lstLi = $curSelectedTab.next('li');
        if ($lstLi.length === 0) {
          log('You are already on the last tab. there is no more last tab.');
          return;
        } else {
          const indexLastTab = getTabCount() - 1;
          _animateTabTo($lis.last(), indexLastTab, e);
        }
      }

      function _updateCurrentTab($li: JQuery<HTMLElement>) {
        // Remove current class from other tabs
        $ul.find('.stCurrentTab').removeClass('stCurrentTab');
        // Add class to the current tab to which it is scrolled and updated the variable
        $curSelectedTab = $li.addClass('stCurrentTab');
      }

      function _liWidth($tab?: any) {
        let w: number;
        w = 0;
        $lis.each(function () {
          w += $(this).outerWidth();
        });
        // 20px buffer is for vertical scrollbars if any
        return w;
      }

      function _addclosebutton($li?: JQuery<HTMLElement>) {
        if (opts.closable === false) {
          return;
        }
        // If li is provide than just add to that, otherwise add to all
        const lis = $li || $lis;
        lis.each(function () {
          const $thisLi: JQuery<HTMLElement> = $(this).addClass('stHasCloseBtn');

          $thisLi.append($('<span class="ui-state-default ui-corner-all stCloseBtn">' +
            '<span class="ui-icon ui-icon-circle-close" title="Close this tab">Close</span>' +
            '</span>'));

          $thisLi.find('.stCloseBtn').hover(function () {
            $(this).toggleClass('ui-state-hover');
          }).on('click', (e) => {
            const active = $lis.index($curSelectedTab);
            const removeIdx = $lis.index($thisLi);
            let selectTabIdx: number;
            selectTabIdx = -1;

            if (active === removeIdx) {
              const tabcount = getTabCount();
              const mid = Math.ceil(tabcount / 2);
              if (removeIdx > mid) {
                selectTabIdx = removeIdx - 1;
              } else {
                selectTabIdx = removeIdx;
              }
            }

            removeTab($thisLi.find('a.ui-tabs-anchor'));

            if (selectTabIdx > -1 && selectTabIdx !== removeIdx) {
              $tabs.tabs('option', 'active', selectTabIdx);
            }
            $lis = getTabList();
          });
        });
      }

      function removeTab(anc: JQuery<HTMLElement>) {
        const tabId = anc.attr('href');
        // Remove the panel
        $(tabId).remove();
        // Remove the tab
        anc.closest('li').remove();
        // Refresh the tabs widget
        $tabs.tabs('refresh');
      }

      function _getNavPairWidth(single?: number): number {
        // // Check if its visible
        // if ($arrowsNav.css('visibility') === 'hidden') {
        //   return 0;
        // }
        // // If no nav than width is zero - take any of the nav say prev and
        // // multiply it with 2 IF we first/last nav are shown else with just 1 (its own width)
        // const w = opts.hideDefaultArrows ? 0 :
        //   $navPrev.outerWidth() * (opts.showFirstLastArrows ? 2 : 1);
        // return single ? w / 2 : w;
        return 0;
      }

      function _adjustLeftPosition($li?: JQuery<HTMLElement>) {
        // If li is provided, find the left and width of second last (last is the new tab) tab
        // and assign it to the new tab
        if ($li) {
          if ($lis.length === 1) {
            return;
          }
          let $thisPrev: JQuery<HTMLElement>;
          let newLeft: number;
          $thisPrev = $li.prev('li') || $lis.first();
          newLeft = parseFloat($thisPrev.css('left'));
          // d(newLeft);
          newLeft = isNaN(newLeft) ? 0 : newLeft;
          newLeft = newLeft + $thisPrev.outerWidth(true) + 4;
          // Assign
          $li.css({
            'left': newLeft,
            'margin-left': $thisPrev.css('margin-left')
          });
          return;
        }

        // Add css class n take its left value to start the total width of tabs
        let pairWidth: number;
        let leftPush: number;
        pairWidth = _getNavPairWidth();
        leftPush = pairWidth === 0 ? 3 : pairWidth + 2;
        $lis.first().addClass('stFirstTab').css({
          'left': leftPush,
          'margin-left': 0
        });

        let tw = leftPush;

        // Take left margin if any
        const leftMargin = parseFloat($lis.last().prev('li').css('margin-left'));

        $ul.find('li:not(:first)').each(function () {
          const currentLi: JQuery<HTMLElement> = $(this);
          currentLi.css('margin-left', 0);
          tw += $(this).prev('li').outerWidth(true);

          // Apply the css
          if (opts.animateTabs) {
            currentLi.animate({ left: tw });
          } else {
            currentLi.css({ left: tw });
          }
          // log($(this));
        });

        $lis.css('margin-left', leftMargin);
      }

      _init();
    });
  };
})(jQuery);
