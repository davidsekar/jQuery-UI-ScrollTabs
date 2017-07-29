## jQuery UI Scroll tabs

![Travis](https://travis-ci.org/davidsekar/jQuery-UI-ScrollTabs.svg?branch=master)

This is a pure jQuery UI widget that extends the default jQuery UI tabs. It handles all the markup enhancements within the widget create event and it works on the default widget HTML structure.

This plugin is __'as customizable as'__ default widget with additional scrollable tab feature, keeps all your tabs on single line. You can have multiple instances of the widget, as well as nest them. It automatically handles showing the navigation controls like next, previous, first & last etc., on user options and works based on current device screen view-port which makes it ideal for responsive/fluid pages. It also has support for swipe events in touch enabled screens enabled _through optional dependency_.

This plugin has few optional dependencies, when found in the $.fn scope will be used to enhance the plugin features.

Following libraries are

**_Required:_**
- jQuery
- jQuery UI tabs

_Optional Dependency:_
- [jQuery debounce plugin](https://github.com/cowboy/jquery-throttle-debounce)
- [jQuery TouchSwipe](https://github.com/mattbryson/TouchSwipe-Jquery-Plugin)

### Basic Usage

Add the CSS and JS files

```
<!-- jQuery UI base css. Here I've included complete CSS or brevity in process -->
<link type="text/css" href="css/ui-lightness/jquery.ui.all.css" rel="stylesheet" />

<script type="text/javascript" src="js/jquery-1.11.3.min.js"></script>

<!-- Optionals starts -->
<script type="text/javascript" src="js/jquery.ba-throttle-debounce.min.js"></script>

<script type="text/javascript" src="js/jquery.touchSwipe.min.js"></script>

<!-- Optional Ends -->

<script type="text/javascript" src="js/jquery-ui-1.11.4.min.js"></script>

<script type="text/javascript" src="js/jquery.ui.scrolltabs.js"></script>
```

Initialization script

```
$("#my-tabs").scrollTabs({
  // Normal tabs options
  active: 1,
  collapsible: true,

  // Extended Scrolltabs options
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
        ....
  }
});
```

You can see the entire project documentation on available options and methods on [project github pages](https://davidsekar.github.io/jQuery-UI-ScrollTabs/).

### Plugin Development & Contributions
Pull request for new features and bug fixes with a detailed information on changes are welcome.

This project uses Gulp based build system.

So for local setup, download the master branch

1. Execute ```npm install```
2. Use vscode Shift + Ctrl + B, to build the project or execute ```npm run build```
3. Start development using live server(Browser Sync) using ```npm start```
