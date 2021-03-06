/*=============================================================
************   Hide/show Toolbar/Navbar on scroll   ************
=============================================================*/
app.initScrollToolbars = function (pageContainer) {
    pageContainer = $(pageContainer);
    var scrollContent = pageContainer.find('.page-content');
    if (scrollContent.length === 0) return;
    var hideNavbar = app.params.hideNavbarOnPageScroll || scrollContent.hasClass('hide-navbar-on-scroll') || scrollContent.hasClass('hide-bars-on-scroll');
    var hideToolbar = app.params.hideToolbarOnPageScroll || scrollContent.hasClass('hide-toolbar-on-scroll') || scrollContent.hasClass('hide-bars-on-scroll');
    var hideTabbar = app.params.hideTabbarOnPageScroll || scrollContent.hasClass('hide-tabbar-on-scroll');

    if (!(hideNavbar || hideToolbar || hideTabbar)) return;
    
    var viewContainer = scrollContent.parents('.' + app.params.viewClass);
    if (viewContainer.length === 0) return;

    var navbar = viewContainer.find('.navbar'), 
        toolbar = viewContainer.find('.toolbar'), 
        tabbar;
    if (hideTabbar) {
        tabbar = viewContainer.find('.tabbar');
        if (tabbar.length === 0) tabbar = viewContainer.parents('.' + app.params.viewsClass).find('.tabbar');
    }

    var hasNavbar = navbar.length > 0,
        hasToolbar = toolbar.length > 0,
        hasTabbar = tabbar && tabbar.length > 0;

    var previousScroll, currentScroll;
        previousScroll = currentScroll = app.scrollTop(pageContainer);

    var scrollHeight, offsetHeight, reachEnd, action, navbarHidden, toolbarHidden, tabbarHidden;

    var toolbarHeight = (hasToolbar && hideToolbar) ? toolbar[0].offsetHeight : 0;
    var tabbarHeight = (hasTabbar && hideTabbar) ? tabbar[0].offsetHeight : 0;
    var bottomBarHeight = tabbarHeight || toolbarHeight;

    function handleScroll(e) {
        if (pageContainer.hasClass('page-on-left')) return;
        currentScroll = app.scrollTop(pageContainer);
        scrollHeight = app.getScrollHeight(pageContainer);
        offsetHeight = pageContainer[0].offsetHeight;
        reachEnd = app.params.showBarsOnPageScrollEnd && (currentScroll + offsetHeight >= scrollHeight - bottomBarHeight);
        navbarHidden = navbar.hasClass('navbar-hidden');
        toolbarHidden = toolbar.hasClass('toolbar-hidden');
        tabbarHidden = tabbar && tabbar.hasClass('toolbar-hidden');


        if (previousScroll === currentScroll && !reachEnd) {  //some time, iscroll fire scroll event, but the scrolltop is the same
          return;
        }
        if (previousScroll > currentScroll || reachEnd) {
            action = 'show';
        }
        else {
            if (currentScroll > 44) {
                action = 'hide';
            }
            else {
                action = 'show';
            }
        }

        if (action === 'show') {
            if (hasNavbar && hideNavbar && navbarHidden) {
                app.showNavbar(navbar);
                pageContainer.removeClass('no-navbar-by-scroll'); 
                navbarHidden = false;
            }
            if (hasToolbar && hideToolbar && toolbarHidden) {
                app.showToolbar(toolbar);
                pageContainer.removeClass('no-toolbar-by-scroll'); 
                toolbarHidden = false;
            }
            if (hasTabbar && hideTabbar && tabbarHidden) {
                app.showToolbar(tabbar);
                pageContainer.removeClass('no-tabbar-by-scroll'); 
                tabbarHidden = false;
            }
        }
        else {
            if (hasNavbar && hideNavbar && !navbarHidden) {
                app.hideNavbar(navbar);
                pageContainer.addClass('no-navbar-by-scroll'); 
                navbarHidden = true;
            }
            if (hasToolbar && hideToolbar && !toolbarHidden) {
                app.hideToolbar(toolbar);
                pageContainer.addClass('no-toolbar-by-scroll'); 
                toolbarHidden = true;
            }
            if (hasTabbar && hideTabbar && !tabbarHidden) {
                app.hideToolbar(tabbar);
                pageContainer.addClass('no-tabbar-by-scroll'); 
                tabbarHidden = true;
            }
        }
            
        previousScroll = currentScroll;
    }
    app.getScroller(pageContainer).on('scroll', handleScroll);
    app.getScroller(pageContainer).on('scrollEnd', handleScroll);
    scrollContent[0].f7ScrollToolbarsHandler = handleScroll;
};
app.destroyScrollToolbars = function (pageContainer) {
    pageContainer = $(pageContainer);
    var scrollContent = pageContainer.find('.page-content');
    if (scrollContent.length === 0) return;
    var handler = scrollContent[0].f7ScrollToolbarsHandler;
    if (!handler) return;
    app.getScroller(pageContainer[0]).off('scroll', scrollContent[0].f7ScrollToolbarsHandler);
    app.getScroller(pageContainer[0]).off('scrollEnd', scrollContent[0].f7ScrollToolbarsHandler);
};
