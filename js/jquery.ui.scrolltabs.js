/*! jquery-ui-scrolltab |  * v1.0.0 |  * https://davidsekar.github.io/jQuery-UI-ScrollTab/ |  * @license MIT */
/// <reference path="../../node_modules/@types/jquery/index.d.ts" />
/// <reference path="../../node_modules/@types/jqueryui/index.d.ts" />
/// <reference path="../ts/jquery.ui.scrolltabs.d.ts" />
(function ($) {
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
                onTabScroll: function () {
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
                headerHTML: '<div class="ui-scroll-tabs-header ui-widget-header ui-corner-all"/>',
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
        _create: function () {
            var _this = this;
            var options = this.options;
            var $elem = this.element;
            this.$ul = $elem.find('ol,ul').eq(0).detach();
            var $headerWrapper = $(this.options.scrollOptions.headerHTML);
            $elem.prepend($headerWrapper);
            var $innerWrapper = $(this.options.scrollOptions.headerScrollHTML);
            $headerWrapper.append($innerWrapper);
            $innerWrapper.append(this.$ul);
            this._setOption('activate', function (event, ui) {
                _this._animateToActiveTab(event);
            });
            // Call the base
            this._super();
            this._setupUserOptions();
        },
        _setOption: function (key, value) {
            this._super(key, value);
        },
        _setOptions: function (options) {
            this._super(options);
        },
        _activate: function (index) {
            this._super(index);
        },
        _setupUserOptions: function () {
            var options = this.options;
            this.debounceEnabled = $.debounce ? true : false;
            this.debug('isDebounceEnabled : ' + this.debounceEnabled);
            var $elem = this.element;
            $elem.addClass(options.wrapperCssClass + ' ui-scroll-tabs');
        },
        /**
         * Centrally control all message to be logged to the console
         * @param message -message to be displayed
         */
        debug: function (message, isError) {
            if (this.options.scrollOptions.enableDebug) {
                if (isError === true) {
                    console.error(message);
                }
                else {
                    console.log(message);
                }
            }
        },
        /**
         * If debounce/throttle plugin is found, it debounces the event handler function
         * @param dbFunc the event handler function
         */
        debounceEvent: function (dbFunc) {
            return this.debounceEnabled ? $.debounce(this.eventDelay, dbFunc) : dbFunc;
        },
        /**
         * If debounce/throttle plugin is found, it uses it in the event handler function
         * @param dbFunc the event handler function
         */
        throttleEvent: function (dbFunc) {
            return this.debounceEnabled ? $.throttle(this.eventDelay, dbFunc) : dbFunc;
        },
        scrollTabHeader: function (distance, duration) {
            if (distance < 0) {
                distance = 0;
            }
            this.$scrollDiv.animate({ scrollLeft: distance }, duration, this.options.scrollOptions.easing);
        },
        _bindTouchEvents: function () {
            var _this = this;
            if (!$.fn.swipe) {
                return;
            }
            this.$scrollDiv.swipe({
                threshold: 75,
                triggerOnTouchEnd: true,
                allowPageScroll: 'vertical',
                swipeStatus: function (event, phase, direction, distance) {
                    // If we are moving before swipe, and we are going
                    // L or R in X mode, or U or D in Y mode then drag.
                    if (phase === $.fn.swipe.phases.PHASE_MOVE
                        && (direction === $.fn.swipe.directions.LEFT
                            || direction === $.fn.swipe.directions.RIGHT)) {
                        var currentScrollLeft = _this.$scrollDiv.scrollLeft();
                        var duration = 0;
                        var distanceWithResistance = distance / 15;
                        if (direction === $.fn.swipe.directions.LEFT) {
                            _this.scrollTabHeader(currentScrollLeft + distanceWithResistance, duration);
                        }
                        else if (direction === $.fn.swipe.directions.RIGHT) {
                            _this.scrollTabHeader(currentScrollLeft - distanceWithResistance, duration);
                        }
                    }
                    else if (phase === $.fn.swipe.phases.PHASE_CANCEL) {
                        // Don't animate for current swipe, as it is canceled
                        // this._showNavsIfNeeded();
                    }
                    else if (phase === $.fn.swipe.phases.PHASE_END) {
                        // to be added
                        _this._showNavsIfNeeded();
                    }
                }
            });
        },
        /**
         * Initializes the navigation controls based on user settings
         */
        _setupNavControls: function () {
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
                }
                else {
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
        _init: function () {
            var _this = this;
            this._setupNavControls();
            this._showNavsIfNeeded();
            this._addNavEvents();
            $(window).on('resize', this.debounceEvent(function () { _this._showNavsIfNeeded(); }));
        },
        /**
         * Check if navigation need then show; otherwise hide it
         */
        _showNavsIfNeeded: function () {
            if (this.options.scrollOptions.showNavWhenNeeded === false) {
                return; // do nothing
            }
            var showLeft = !(this.$scrollDiv.scrollLeft() <= 0);
            var showRight = !(Math.abs(this.$scrollDiv[0].scrollWidth - this.$scrollDiv.scrollLeft()
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
        _callBackFnc: function (fName, event, arg1) {
            if ($.isFunction(fName)) {
                fName(event, arg1);
            }
        },
        /**
         * returns the delta that should be added to current scroll to bring it into view
         * @param $tab tab that should be tested
         */
        _getScrollDeltaValue: function ($tab) {
            var leftPosition = $tab.position();
            var width = $tab.outerWidth();
            var currentScroll = this.$scrollDiv.scrollLeft();
            var currentVisibleWidth = this.$scrollDiv.width();
            var hiddenDirection = 0;
            var arrowsWidth = this.$leftArrowWrapper.width();
            // Check if the new tab is in view
            if (leftPosition.left < currentScroll) {
                hiddenDirection = leftPosition.left - currentScroll - arrowsWidth;
            }
            else if (leftPosition.left + width + arrowsWidth > currentScroll + currentVisibleWidth) {
                hiddenDirection = (leftPosition.left + width + arrowsWidth)
                    - (currentScroll + currentVisibleWidth);
            }
            return hiddenDirection;
        },
        _scrollWithoutSelection: function (navOpt) {
            var _this = this;
            var scrollLeft = this.$scrollDiv.scrollLeft();
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
            this.$scrollDiv.stop().animate({ scrollLeft: scrollLeft }, this.options.scrollOptions.scrollSpeed / 2, this.options.scrollOptions.easing, function () { _this._showNavsIfNeeded(); });
        },
        _animateToActiveTab: function (e) {
            var calculatedDelta = this._getScrollDeltaValue(this.active);
            this.$scrollDiv.stop().animate({ scrollLeft: this.$scrollDiv.scrollLeft() + calculatedDelta }, this.options.scrollOptions.scrollSpeed, this.options.scrollOptions.easing);
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
        _getCustomNavSelector: function (col, nav) {
            var sel = this.options.scrollOptions['customNav' + nav] || '';
            // Check for custom selector
            if (typeof sel === 'string' && $.trim(sel) !== '') {
                col = col.add(sel);
            }
            return col;
        },
        /**
         * This function add the navigation control and binds the required events
         */
        _addNavEvents: function () {
            var _this = this;
            // Handle next tab
            this.$navNext = this.$navNext || $();
            this.$navNext = this._getCustomNavSelector(this.$navNext, 'Next');
            this.$navNext.on('click', this.debounceEvent(function (e) { _this._moveToNextTab(e); }));
            // Handle previous tab
            this.$navPrev = this.$navPrev || $();
            this.$navPrev = this._getCustomNavSelector(this.$navPrev, 'Prev');
            this.$navPrev.on('click', this.debounceEvent(function (e) { _this._moveToPrevTab(e); }));
            // Handle First tab
            this.$navFirst = this.$navFirst || $();
            this.$navFirst = this._getCustomNavSelector(this.$navFirst, 'First');
            this.$navFirst.on('click', this.debounceEvent(function (e) { _this._moveToFirstTab(e); }));
            // Handle last tab
            this.$navLast = this.$navLast || $();
            this.$navLast = this._getCustomNavSelector(this.$navLast, 'Last');
            this.$navLast.on('click', this.debounceEvent(function (e) { _this._moveToLastTab(e); }));
        },
        /**
         * Handles move to next tab link click
         * @param e pass the link click event
         */
        _moveToNextTab: function (e) {
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
        _moveToPrevTab: function (e) {
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
        _moveToFirstTab: function (e) {
            e.preventDefault();
            if (!this.options.scrollOptions.selectTabAfterScroll) {
                this._scrollWithoutSelection(this.navigateOptions.first);
                return;
            }
            this._activate(0);
        },
        /**
         * Handles move to last tab link click
         * @param e pass the link click event
         */
        _moveToLastTab: function (e) {
            e.preventDefault();
            if (!this.options.scrollOptions.selectTabAfterScroll) {
                this._scrollWithoutSelection(this.navigateOptions.last);
                return;
            }
            this._activate(this.tabs.length - 1);
        },
        _liWidth: function ($tab) {
            var w;
            w = 0;
            this.tabs.each(function () {
                w += $(this).outerWidth();
            });
            // 20px buffer is for vertical scrollbars if any
            return w;
        },
        _addclosebutton: function ($li) {
            if (this.options.scrollOptions.closable === false) {
                return;
            }
            // If li is provide than just add to that, otherwise add to all
            var lis = $li || this.tabs;
            var self = this;
            lis.each(function (idx, obj) {
                var $thisLi = $(obj).addClass('stHasCloseBtn');
                $thisLi.append($('<span class="ui-state-default ui-corner-all stCloseBtn">' +
                    '<span class="ui-icon ui-icon-circle-close" title="Close this tab">Close</span>' +
                    '</span>'));
                $thisLi.find('.stCloseBtn').hover(function () {
                    $(this).toggleClass('ui-state-hover');
                }).on('click', function (e) {
                    var removeIdx = self.tabs.index($thisLi);
                    var selectTabIdx;
                    selectTabIdx = -1;
                    if (self.options.active === removeIdx) {
                        var tabcount = self.tabs.length;
                        var mid = Math.ceil(tabcount / 2);
                        if (removeIdx > mid) {
                            selectTabIdx = removeIdx - 1;
                        }
                        else {
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
        removeTab: function (anc) {
            var tabId = anc.attr('href');
            // Remove the panel
            $(tabId).remove();
            // Remove the tab
            anc.closest('li').remove();
            // Refresh the tabs widget
            this.refresh();
        }
    });
})(jQuery);

//# sourceMappingURL=jquery.ui.scrolltabs.js.map
