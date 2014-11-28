/* ===============================================================================
************   Infinite Scroll   ************
=============================================================================== */
function handleInfiniteScroll(pageContainer) {
    /*jshint validthis:true */
    var inf = $(pageContainer).find('.page-content');
    var scroller = app.getScroller(pageContainer);
    var scrollTop = app.scrollTop(pageContainer);
    var scrollHeight = app.getScrollHeight(pageContainer);
    var height = pageContainer.offsetHeight;
    var distance = inf[0].getAttribute('data-distance');
    var virtualListContainer = inf.find('.virtual-list');
    var virtualList;
    if (!distance) distance = 50;
    if (typeof distance === 'string' && distance.indexOf('%') >= 0) {
        distance = parseInt(distance, 10) / 100 * height;
    }
    if (distance > height) distance = height;
    if (scrollTop + height >= scrollHeight - distance) {
        if (virtualListContainer.length > 0) {
            virtualList = virtualListContainer[0].f7VirtualList;
            if (virtualList && !virtualList.reachEnd) return;
        }
        inf.trigger('infinite');
    }
}
app.attachInfiniteScroll = function (infiniteContent) {
    var pageContainer = $(infiniteContent).parent()[0];
    pageContainer.scroller.on('scroll', function() {
        handleInfiniteScroll(pageContainer);
    });
    pageContainer.scroller.on('scrollEnd', function() { //scroll won't trigger sometime
        handleInfiniteScroll(pageContainer);
    });
};
app.detachInfiniteScroll = function (infiniteContent) {
    app.getScroller($(infiniteContent).parent()).off('scroll', handleInfiniteScroll);
};

app.initInfiniteScroll = function (pageContainer) {
    pageContainer = $(pageContainer);
    var infiniteContent = pageContainer.find('.infinite-scroll');
    if (infiniteContent.length === 0) return;
    app.attachInfiniteScroll(infiniteContent);
    function detachEvents() {
        app.detachInfiniteScroll(infiniteContent);
        pageContainer.off('pageBeforeRemove', detachEvents);
    }
    pageContainer.on('pageBeforeRemove', detachEvents);
};
