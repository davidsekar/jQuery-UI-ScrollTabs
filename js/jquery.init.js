/*! jquery-ui-scrolltab |  * v1.0.0 |  * https://davidsekar.github.io/jQuery-UI-ScrollTab/ |  * @license MIT */
/// <reference path="../../node_modules/@types/jquery/index.d.ts" />
/// <reference path="../../node_modules/@types/jqueryui/index.d.ts" />
/// <reference path="../ts/jquery.ui.scrolltabs.d.ts" />
var $tabs;
var scrollEnabled;
$(function () {
    // To get the random tabs label with variable length for testing the calculations
    var keywords = ['Just a tab label', 'Long string', 'Short',
        'Very very long string', 'tab', 'New tab', 'This is a new tab'];
    $('#example_0').scrollTabs({
        scrollOptions: {
            enableDebug: true,
            selectTabAfterScroll: false
        }
    });
    if (scrollEnabled) {
        $tabs = $('#example_1')
            .scrollTabs({
            scrollOptions: {
                customNavNext: '#n',
                customNavPrev: '#p',
                customNavFirst: '#f',
                customNavLast: '#l',
                easing: 'swing',
                enableDebug: false,
                closable: true,
                showFirstLastArrows: false,
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
    }
    else {
        // example
        $tabs = $('#example_1')
            .tabs();
    }
    $('#example_2').tabs();
    // Add new tab
    $('#addTab_1').click(function () {
        var label = keywords[Math.floor(Math.random() * keywords.length)];
        var content = 'This is the content for the ' + label + '<br>Lorem ipsum dolor sit amet,' +
            ' consectetur adipiscing elit. Quisque hendrerit vulputate porttitor. Fusce purus leo,' +
            ' faucibus a sagittis congue, molestie tempus felis. Donec convallis semper enim,' +
            ' varius sagittis eros imperdiet in. Vivamus semper sem at metus mattis a' +
            ' aliquam neque ornare. Proin sed semper lacus.';
        $tabs.trigger('addTab', [label, content]);
        return false;
    });
});

//# sourceMappingURL=jquery.init.js.map
