/// <reference path="../node_modules/@types/jquery/index.d.ts" />
/// <reference path="../node_modules/@types/jqueryui/index.d.ts" />
/// <reference path="../ts/jquery.scrolltab.d.ts" />
(($) => {
  const settings = {
    animateTabs: false,
    showNavWhenNeeded: true, // false: always show no matter if there are few tabs.
    customNavNext: '',
    customNavPrev: '',
    customNavFirst: '',
    customNavLast: '',
    closable: true, // Make tabs closable
    easing: 'swing', // The easing equation
    loadLastTab: false, // When tabs loaded, scroll to the last tab - default is the first tab
    onTabScroll() {
      // empty
    },
    resizable: false, // Allow resizing the tabs container
    resizeHandles: 'e,s,se', // Resizable in North, East and NorthEast directions
    scrollSpeed: 500, // The speed in which the tabs will animate/scroll
    selectTabOnAdd: true,
    selectTabAfterScroll: true,
    showFirstLastArrows: true,
    hideDefaultArrows: false,
    nextPrevOutward: false,
    wrapperCssClass: ''
  };

  $.fn.scrollabletabs = function (options: any): JQuery<HTMLElement> {
    return this.each(function () {
      let opts: any;
      let $tabs: JQuery<HTMLElement>;
      let $ul: JQuery<HTMLElement>;
      let $lis: JQuery<HTMLElement>;
      let $arrowsNav: JQuery<HTMLElement>;
      let $curSelectedTab: JQuery<HTMLElement>;
      let $navLis: JQuery<HTMLElement>;
      let $navPrev: JQuery<HTMLElement>;
      let $navNext: JQuery<HTMLElement>;
      let $navFirst: JQuery<HTMLElement>;
      let $navLast: JQuery<HTMLElement>;
      const eventDelay: number = 100;

      opts = $.extend({}, settings, typeof opts === 'object' ? opts : {});
      $tabs = $(this).addClass(opts.wrapperCssClass + ' stMainWrapper');
      $ul = $tabs.find('ul.ui-tabs-nav:first');
      $lis = $ul.find('li');
      $arrowsNav = $('<ol class="stNavMain" />');
      // We will use our own css class to detect a selected tab
      // because we might want to scroll without tab being selected
      $curSelectedTab = $ul.find('.ui-tabs-selected')
        .addClass('stCurrentTab');

      // Navigation
      if (!opts.hideDefaultArrows) {
        $navPrev = $('<li class="stNavPrevArrow ui-state-active" title="Previous">' +
          '<span class="ui-icon ui-icon-seek-prev">Previous tab</span></li>');

        $navNext = $('<li class="stNavNextArrow ui-state-active" title="Next">' +
          '<span class="ui-icon ui-icon-seek-next">Next tab</span></li>');

        $navFirst = opts.showFirstLastArrows ?
          $('<li class="stNavFirstArrow ui-state-active" title="First">' +
            '<span class="ui-icon ui-icon-seek-first">First tab</span></li>') : $();

        $navLast = opts.showFirstLastArrows ?
          $('<li class="stNavLastArrow ui-state-active" title="Last">' +
            '<span class="ui-icon ui-icon-seek-end">Last tab</span></li>') : $();

        // Append elements to the container
        $arrowsNav.append($navPrev, $navFirst, $navLast, $navNext);
        $navLis = $arrowsNav.find('li').hover(function () {
          $(this).toggleClass('ui-state-active').toggleClass('ui-state-hover');
        });
      }

      function log(message: any) {
        console.log(message);
      }

      /**
       * Returns number of tabs in $tabs as 'any' to avoid TS error
       */
      function getTabCount(): number {
        return $tabs.children('ul > li').length;
      }

      function _init() {
        // Set the height of the UL and make the LIs as absolute
        $ul.height($lis.first().outerHeight());

        // Add navigation buttons
        $ul.after($arrowsNav.css('visibility', opts.showNavWhenNeeded ? 'hidden' : 'visible'));

        // Adjust arrow position
        if ($navLis) {
          $navLis.css({
            top: '-' + $ul.innerHeight() + 'px',
            height: $ul.innerHeight()
          });

          // Decide which navs in each pair will have to moved inside next to each other
          if (opts.nextPrevOutward) {
            $navPrev.addClass('ui-corner-left');
            $navNext.addClass('ui-corner-right');
            $navFirst.css('margin-left', $arrowsNav.find('li:first').outerWidth());
            $navLast.css('margin-right', $arrowsNav.find('li:first').outerWidth());
          } else {
            $navFirst.addClass('ui-corner-left');
            $navLast.addClass('ui-corner-right');
            // If we have first and last arrows to show than move the arrows inward
            // otherwise add the css classes to make their corners round.
            opts.showFirstLastArrows ?
              $navPrev.css('margin-left', $arrowsNav.find('li:first').outerWidth()) :
              $navPrev.addClass('ui-corner-left');
            opts.showFirstLastArrows ?
              $navNext.css('margin-right', $arrowsNav.find('li:first').outerWidth()) :
              $navNext.addClass('ui-corner-right');
          }
        }
        // Add close buttons if required
        _addclosebutton();
        // See if nav needed
        _showNavsIfNeeded();
        // Adjust the left position of all tabs
        _adjustLeftPosition();
        // Add events to the navigation buttons
        _addNavEvents();
        // If tab is selected manually by user than also change the css class
        $tabs.on('tabsactivate', (event, ui) => {
          _updateCurrentTab($(ui.newTab));

          // if (_isHiddenOn('s')) {
          //   _animateTabTo('s', null, null, event);
          // }
          // else do nothing, tab is visible so no need to scroll tab
        }).on('tabsadd', (event, ui): any => {
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
        _updateCurrentTab($tabs.find('li').eq(0));

        $(window).on('resize', $.throttle(eventDelay, () => {
          // To make sure to hide navigations if not needed
          _showNavsIfNeeded();
        }));
      }

      // Check if navigation need then show; otherwise hide it
      function _showNavsIfNeeded() {
        if (!opts.showNavWhenNeeded) {
          return; // do nothing
        }
        // Get the width of all tabs and compare it with the width of $ul (container)
        if (_liWidth() > $ul.width()) {
          $arrowsNav.css('visibility', 'visible').show();
        } else {
          $arrowsNav.css('visibility', 'hidden').hide();
        }
      }

      function _callBackFnc(fName: string, event: JQuery.Event, arg1: any) {
        if ($.isFunction(fName)) {
          fName(event, arg1);
        }
      }

      function _isHiddenOn(side: string, $tab?: JQuery<HTMLElement>): boolean {
        // If no tab is provided than take the current
        $tab = $tab || $curSelectedTab;

        const rightPos = $tab.position().left + $tab.outerWidth(true) + 5;
        const leftPos = ($tab.position().left - $ul.outerWidth() - _getNavPairWidth());

        let bHidden = false;

        if (side === 'n') {
          bHidden = (rightPos > ($ul.outerWidth() - _getNavPairWidth()));
        }
        if (side === 'p') {
          bHidden = bHidden || (leftPos < 0);
        }
        return bHidden;
      }

      function _pullMargin($tab: JQuery<HTMLElement>): number {
        return -1 * (_liWidth($tab) - $ul.width() + _getNavPairWidth());
      }

      function _pushMargin($tab: JQuery<HTMLElement>): number {
        const leftPos = ($tab[0].offsetLeft - _getNavPairWidth());
        return (parseFloat($tab.css('margin-left')) - leftPos);
      }

      function _animateTabTo(
        side: string, $tab: JQuery<HTMLElement>, tabIndex: number, e?: JQuery.Event) {
        $tab = $tab || $curSelectedTab;
        let margin = 0;
        switch (side) {
          case 'n': // Next
            margin = _pullMargin($tab);
            break;
          case 'p': // Previous
            margin = _pushMargin($tab);
            break;
          case 'f': // First
            margin = 0;
            tabIndex = 0;
            break;
          case 'l': // Last
            margin = _pullMargin($tab);
            break;
        }
        // log($tab);

        $lis
          // .stop(false, true)
          // .stop( [ clearQueue ], [ jumpToEnd ] ) - this line is not working properly
          .animate({
            'margin-left': margin + 'px'
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

      function _addCustomerSelToCollection(col: JQuery<HTMLElement>, nav: string) {
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
        $navNext = _addCustomerSelToCollection($navNext, 'Next');
        $navNext.on('click', $.debounce(eventDelay, _moveToNextTab));

        // Handle previous tab
        $navPrev = $navPrev || $();
        $navPrev = _addCustomerSelToCollection($navPrev, 'Prev');
        $navPrev.on('click', $.debounce(eventDelay, _moveToPrevTab));

        // Handle First tab
        $navFirst = $navFirst || $();
        $navFirst = _addCustomerSelToCollection($navFirst, 'First');
        $navFirst.on('click', $.debounce(eventDelay, _moveToFirstTab));

        // Handle last tab
        $navLast = $navLast || $();
        $navLast = _addCustomerSelToCollection($navLast, 'Last');
        $navLast.on('click', $.debounce(eventDelay, _moveToLastTab));
      }

      function _moveToNextTab(e: JQuery.Event) {
        e.preventDefault();

        let $nxtLi = $();
        // First check if user do not want to select tab on Next
        // than we have to find the next hidden (out of viewport) tab so we can scroll to it
        if (!opts.selectTabAfterScroll) {
          $curSelectedTab.nextAll('li').each(function () {
            if (_isHiddenOn('n', $(this))) {
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
          if (_isHiddenOn('n', $nxtLi)) {
            _animateTabTo('n', $nxtLi, indexNextTab, e);
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
            if (_isHiddenOn('p', $(this))) {
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
          if (_isHiddenOn('p', $prvLi)) {
            _animateTabTo('p', $prvLi, indexPrevTab, e);
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
          _animateTabTo('f', $lis.first(), 0, e);
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
          _animateTabTo('l', $lis.last(), indexLastTab, e);
        }
      }

      function _updateCurrentTab($li: JQuery<HTMLElement>) {
        // Remove current class from other tabs
        $ul.find('.stCurrentTab').removeClass('stCurrentTab');
        // Add class to the current tab to which it is scrolled and updated the variable
        $curSelectedTab = $li.addClass('stCurrentTab');
      }

      function _addclosebutton($li?: JQuery<HTMLElement>) {
        if (!opts.closable) {
          return;
        }
        // If li is provide than just add to that, otherwise add to all
        const lis = $li || $lis;
        lis.each(function () {
          const $thisLi: JQuery<HTMLElement> = $(this).addClass('stHasCloseBtn');
          $(this)
            .append(
            $('<span/>')
              .addClass('ui-state-default ui-corner-all stCloseBtn')
              .hover(function () {
                $(this).toggleClass('ui-state-hover');
              })
              .append(
              $('<span/>')
                .addClass('ui-icon ui-icon-circle-close')
                .html('Close')
                .attr('title', 'Close this tab')
                .click((e) => {
                  const removeIndex: number = $thisLi.prevAll('li').length;
                  // Remove tab using UI method
                  $tabs.tabs('remove', removeIndex);
                  // Here $thisLi.index( $lis.index($thisLi) ) will not work as
                  // when we remove a tab, the index will change / Better way?
                  // If you want to add more stuff here, better add to the tabsremove
                  // event binded in _init() method above
                })
              )

            )
            // If width not assigned, the hidden tabs width cannot be calculated properly
            // in _adjustLeftPosition
            .width($thisLi.outerWidth());
        });
      }

      function _getNavPairWidth(single?: number): number {
        // Check if its visible
        if ($arrowsNav.css('visibility') === 'hidden') {
          return 0;
        }
        // If no nav than width is zero - take any of the nav say prev and
        // multiply it with 2 IF we first/last nav are shown else with just 1 (its own width)
        const w = opts.hideDefaultArrows ? 0 :
          $navPrev.outerWidth() * (opts.showFirstLastArrows ? 2 : 1);
        return single ? w / 2 : w;
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

      function _liWidth($tab?: any) {
        let w: number;
        let list: JQuery<HTMLElement>;
        w = 0;
        list = $tab ? $tab.prevAll('li').andSelf() : $lis;
        list.each(function () {
          w += $(this).outerWidth() +
            parseInt($(this).css('margin-right'), 10);
          // not outerWidth(true) because margin-left is changed in previous call
          // so better take right margin which doesn't change in this plugin
        });

        const navWidth = $arrowsNav.css('visibility') === 'visible' ? _getNavPairWidth() : 0;
        // d(navWidth);
        return w + navWidth;
      }

      _init();
    });
  };
})(jQuery);
