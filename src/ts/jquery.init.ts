/// <reference path="../../node_modules/@types/jquery/index.d.ts" />
/// <reference path="../../node_modules/@types/jqueryui/index.d.ts" />
/// <reference path="../ts/jquery.scrolltab.d.ts" />
let $tabs: JQuery<HTMLElement>;
let scrollEnabled: any;

$(() => {
  // To get the random tabs label with variable length for testing the calculations
  const keywords = ['Just a tab label', 'Long string', 'Short',
    'Very very long string', 'tab', 'New tab', 'This is a new tab'];

  if (scrollEnabled) {
    $tabs = $('#example_1')
      .tabs()
      .scrollabletabs({
        customNavNext: '#n',
        customNavPrev: '#p',
        customNavFirst: '#f',
        customNavLast: '#l',
        easing: 'swing',
        enableDebug: true,
        closable: true,
        showFirstLastArrows: true
      });
  } else {
    // example
    $tabs = $('#example_1')
      .tabs();
  }

  $tabs = $('#example_2')
    .tabs();

  // Add new tab
  $('#addTab_1').click(() => {
    const label = keywords[Math.floor(Math.random() * keywords.length)];
    const content = 'This is the content for the ' + label + '<br>Lorem ipsum dolor sit amet,' +
      ' consectetur adipiscing elit. Quisque hendrerit vulputate porttitor. Fusce purus leo,' +
      ' faucibus a sagittis congue, molestie tempus felis. Donec convallis semper enim,' +
      ' varius sagittis eros imperdiet in. Vivamus semper sem at metus mattis a' +
      ' aliquam neque ornare. Proin sed semper lacus.';
    $tabs.trigger('addTab', [label, content]);
    return false;
  });
});
