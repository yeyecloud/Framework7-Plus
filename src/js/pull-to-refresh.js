/*======================================================
************   Pull To Refresh   ************
======================================================*/
var refreshTime = 0;
app.initPullToRefresh = function (pageContainer) {
    var eventsTarget = $(pageContainer);
    if (!eventsTarget.hasClass('pull-to-refresh-content')) {
        eventsTarget = eventsTarget.find('.pull-to-refresh-content');
    }
    if (eventsTarget.length === 0) return;

    var page = eventsTarget.hasClass('page') ? eventsTarget : eventsTarget.parents('.page');
    var scroller = page[0].scroller;
    var hasNavbar = false;
    if (page.find('.navbar').length > 0 || page.parents('.navbar-fixed, .navbar-through').length > 0 || page.hasClass('navbar-fixed') || page.hasClass('navbar-through')) hasNavbar = true;
    if (page.hasClass('no-navbar')) hasNavbar = false;
    if (!hasNavbar) eventsTarget.addClass('pull-to-refresh-no-navbar');

    var container = eventsTarget;

    function handleScroll() {
        if(container.hasClass('refreshing')) return;
        if(app.scrollTop(page) * -1 >= 44) {
            container.removeClass('pull-down').addClass('pull-up');
        } else {
            container.removeClass('pull-up').addClass('pull-down');
        }
    }
    function handleRefresh() {
        if(container.hasClass('refreshing')) return;
        container.removeClass('pull-down pull-up');
        container.addClass('refreshing');
        container.trigger('refresh', {
            done: function () {
              app.pullToRefreshDone(container);
            }
        });
        refreshTime = + new Date();
    }
    scroller.on('scroll', handleScroll);
    scroller.on('ptr', handleRefresh);

    // Detach Events on page remove
    if (page.length === 0) return;
    function detachEvents() {
        scroller.off('scroll', handleScroll);
        scroller.off('ptr', handleRefresh);
        page.off('pageBeforeRemove', detachEvents);
    }
    page.on('pageBeforeRemove', detachEvents);

};

app.pullToRefreshDone = function (container) {
    container = $(container);
    if (container.length === 0) container = $('.pull-to-refresh-content.refreshing');
    if (container.length === 0) return;
    var interval = (+ new Date()) - refreshTime;
    var timeOut = interval > 1000 ? 0 : 1000 - interval;  //long than bounce time
    var scroller = container.parent()[0].scroller;
    setTimeout(function() {
      scroller.refresh();
      container.removeClass('refreshing');
    }, timeOut);
};
app.pullToRefreshTrigger = function (container) {
    container = $(container);
    if (container.length === 0) container = $('.pull-to-refresh-content');
    if (container.hasClass('refreshing')) return;
    container.addClass('refreshing');
    container.parent()[0].scroller.scrollTo(0, 44, 200);
    container.trigger('refresh', {
        done: function () {
            app.pullToRefreshDone(container);
        }
    });
};
