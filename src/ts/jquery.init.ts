/// <reference path="../../node_modules/@types/jquery/index.d.ts" />
/// <reference path="../../node_modules/@types/jqueryui/index.d.ts" />
/// <reference path="../ts/jquery.ui.scrolltabs.d.ts" />

$(() => {
  // To get the random tabs label with variable length for testing the calculations
  const keywords = ['Just a tab label', 'Long string', 'Short',
    'Very very long string', 'tab', 'New tab', 'This is a new tab'];

  // Original tabs
  $('#example_0_1').tabs();

  $('#example_0_2').scrollTabs({
    scrollOptions: {
      enableDebug: true,
      selectTabAfterScroll: false,
      closable: false
    }
  });

  $('#example_0').scrollTabs({
    scrollOptions: {
      enableDebug: true,
      selectTabAfterScroll: false
    }
  });

  $('#addRandomTab').on('click', (e) => {
    $('#example_0').data('uiScrollTabs')
      .addTab(keywords[Math.floor(Math.random() * keywords.length) + 1], );
  });

  $('#example_1')
    .scrollTabs({
      scrollOptions: {
        customNavNext: '#n',
        customNavPrev: '#p',
        customNavFirst: '#f',
        customNavLast: '#l',
        easing: 'swing',
        enableDebug: false,
        closable: true,
        showFirstLastArrows: true,
        selectTabAfterScroll: true
      }
    });
  $('#example_3').scrollTabs({
    scrollOptions: {
      easing: 'swing',
      enableDebug: false,
      closable: true,
      showFirstLastArrows: false,
      selectTabAfterScroll: true
    }
  });
  $('#example_2').scrollTabs({
    scrollOptions: {
      easing: 'swing',
      enableDebug: false,
      closable: true,
      showFirstLastArrows: true,
      selectTabAfterScroll: true,
      headerHTML: '<div class="ui-widget-header ui-corner-all"/>',
      headerScrollHTML: '<div style="background-color:#ccc;" class="ui-scroll-tabs-view"/>',
      leftArrowWrapperHTML: '<div class="stNavMain stNavMainLeft"/>',
      prevArrowButtonHTML: '<a href="javascript:void(0)"' +
      ' class="stNavPrevArrow ui-state-active navbutton"' +
      ' title="Previous">Previous tab</a>',
      firstArrowButtonHTML: '<a href="javascript:void(0)"' +
      ' class="stNavFirstArrow ui-state-active navbutton" title="First">' +
      'First tab</a>',
      rightArrowWrapperHTML: '<div class="stNavMain stNavMainRight"/>',
      nextArrowButtonHTML: '<a href="javascript:void(0)"' +
      ' class="stNavNextArrow ui-state-active navbutton" title="Next">' +
      'Next tab</a>',
      lastArrowButtonHTML: '<a href="javascript:void(0)"' +
      ' class="stNavLastArrow ui-state-active navbutton" title="Last">' +
      'Last Tab</a>',
    }
  });
  $('#back-to-top').on('click', (e) => {
    const body = $('html, body');
    body.stop().animate({ scrollTop: 0 }, 500, 'swing');
  });
});
