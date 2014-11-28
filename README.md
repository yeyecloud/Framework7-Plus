#Framework7-Plus

## Framework7-Plus 是什么
[Framework7](http://framework7.taobao.org/) 是一个开源免费的框架可以用来开发混合移动应用（原生和HTML混合）或者开发iOS7风格的WEB APP。也可以用来作为原型开发工具，可以迅速创建一个应用的原型。Framework7 的特点是对iOS提供最好的体验，像素级模仿iOS的设计，不过它并不能保证对安卓设备的兼容性。
Framework7-Plus的目标是修复F7在安卓4.0+上的兼容性问题，并且尽可能不改变现有的API，这样可以方便已经使用F7开发的项目迁移到F7-Plus。
如果你打算开发一个兼容安卓和iOS设备的Web App，或者你已经基于F7开发完成但是在安卓设备下碰到了很多问题，那么F7-Plus将是你很好的选择。关于如何将 F7项目迁移到F7-Plus，请参见[F7迁移到F7-Plus](#transfer)。如果你对兼容性问题感兴趣，可以参见[Framework7 在安卓上的主要兼容性问题](#compitable)

## Framework7-Plus的改动和文档
F7-Plus影响最大的改动是用[iScroll](https://github.com/cubiq/iscroll)替换了原生的滚动条，但是除了增加了和滚动条相关的API和滚动容器的改变之外，并没有影响其他组件，包括下拉刷新和无限滚动等组件都保持和F7一样的API。滚动条相关的详细改动请参见 [iscroll滚动条](#iscroll)。
一些基于flexbox布局的组件被修改成了兼容性更好的float布局，svg图标被替换成了iconfont，参见 [其他组件的修改](#other-components)。

## <a id='iscroll'></a> iscroll滚动条
为了解决安卓上的F7-Plus 用 iScroll 替换了原生的滚动条，并且在pageInit阶段自动初始化了这个滚动条，这是一个影响最大的修改。
一方面，他影响了滚动方式，F7中是 `.page-content` 内部滚动，修改之后，`.page-content`作为一个类似绝对定位的容器（`translate3D`)，内部不会滚动，而是作为一个整体在 `.page`容器中滚动条。可以理解为从 `.page-content` 内部的滚动变成了 `.page` 内部的滚动。
另一方面，无法再使用原生的滚动条，取而代之的是一个iscroll的实例，这个实例存储在 `.page` 上的 `.scroller`属性中，你可以通过 类似这样的代码 `$$(".page")[0].scroller` 来获取滚动条实例，最好的方式是通过下面将要介绍的新API来操作。

### iscroll 新增的API
F7-Plus 在 `pageinit` 的时候会自动初始化一个滚动条，并且把它存储到对应的 `.page` DOM元素上。不过不建议直接从DOM元素上获取，而是通过下面的API来使用。
新增了这几个API：

**app.getScroller(container)**

获取滚动条示例，这个container应该是一个 `.page` 节点。如果你没有传入container，则自动获取当前显示的页面的滚动条。返回值是一个 iScroll 实例，它的API请参见 [iScroll](https://github.com/cubiq/iscroll)。

**app.refreshScroller(container)**

刷新滚动条。任何导致 `.page-content` 容器产生高度变化的操作之后，都需要刷新JS滚动条。不过F7的原生组件，包括下拉刷新，手风琴，标签页等已经自动做了刷新操作，不需要再次刷新。
`container` 是一个 `.page` 节点，如果没有传入 `container` 参数，则直接刷新当前显示的页面。
**注意，如果滚动条正在执行滚动动画，那么这时候刷新滚动条会导致页面闪一下，请避免在滚动的时候刷新滚动条。下拉刷新之后不要刷新滚动条，因为下拉刷新组件自己做了刷新操作。**

滚动条相关改动的需要注意以下三点：
1. 滚动条容器从 `.page-content` 变成了 `.page`
2. 原生的滚动事件不可用，应该用 iScroll 的事件
3. 任何导致 `.page-content` 高度变化的操作都要刷新滚动条。

## <a id='other-components'></a> 其他组件的修改

因为一些兼容性的问题，部分组件的CSS做了修改。如果你是从F7迁移的项目，并且定制过下面这些组件的样式，那么需要额外注意。

**图标**

SVG改成了iconfont，能更好兼容安卓手机。svg是通过 `background` 实现的，而iconfont一般是通过 `:before` 或者 `:after` 伪元素实现的。这个修改涉及到所有使用SVG图标的组件：
- navbar
- list view
- media list
- sortable list
- checkbox, radio, smart select
- accordion
- pull to refresh
- message
- preloader
- searchbar
- photo browser
- notification

**grid**

栅格从 `flexbox` 布局改成了 `float` 布局，这个改动同时会导致样式的变化。flexbox布局的间距是固定的15px，而float布局的间距是一个百分比，也就意味着不同屏幕宽度下，间距大小是不同的。

**message**

message 组件使用了 `flexbox` 布局，这里把 `.message` 改成了 float 布局，因为 `flexbox` 容器无法完美自适应屏幕宽度。

**searchbar**

搜索栏的 form是使用 `flexbox` 布局，改成了 `position: absolute` 的布局。


## <a id='transfer'></a> F7迁移到F7-Plus

F7-Plus 尽可能保证了原来的API不变，减少迁移难度。不过迁移的时候，除了替换掉F7的库之外，还是有一些需要修改的代码和需要注意的地方。
- 首先需要修改的是所有和滚动条相关的逻辑，原生的滚动条被替换成了iScroll滚动条，并且滚动容器从 `.page-content` 变成了 `.page`，导致页面高度变化的操作之后需要刷新滚动条，具体参见 [iscroll滚动条](#iscroll)。
- 如果你用到了 [其他组件的修改](#other-components) 中提到的组件，并且修改了他们的样式，那么你可能需要重新检查一下你的CSS，因为他们的布局已经发生了变化。

上面就是你所有需要注意的地方，很多时候，你唯一需要做的就是刷新一下滚动条而已，是不是很简单。

如果你对 Framework7 的兼容性有兴趣，可以继续阅读下一章。

## <a id='compitable'></a> Framework7 在安卓上的主要兼容性问题
目前主要测试了如下几种设备：
1. 三星 S4 (4.4.2)
2. 三星 s3 (4.3)
3. 三星 note2 (4.3)
4. LG nexus 5 (4.4.4)
5. nexus 4(?)
6. 小米 M3 (4.4.2)
7. 小米 M2 (4.1.1)
8. 红米 Note 增强版 (4.2.2)
9. 魅族 MX2 (4.2.1)

主要兼容性问题是以下这些：

**原生滚动条滚动时的闪烁问题**

在低版本的安卓比如魅族MX2上，绝对定位 `position: absolute;` 或者使用了 `transform: translate3D;`的容器，在原生滚动条滚动的时候会有滚动延迟，视觉上就是这些容器在滚动时会闪烁。主要在swipeout,sortable list, accordion, photo browser这几个组件上有问题。
现在已经解决，解决方法是把原生的滚动条替换成了JS滚动条，JS滚动条使用的是大名鼎鼎的 [iScroll](https://github.com/cubiq/iscroll)，基本可以达到和原生滚动条相同的性能。替换完成之后，因为JS滚动条在页面高度变化的时候需要手动更新，所以会增加一个新的 `app.refreshScroller` 接口。已有的所有组件都完成了改造，所以使用他们的时候是不需要手动调用 `refreshScroller`的。

**内置的fast click库的bug**

Framework7 内置了一个fast click库，它在处理label的prevent default逻辑上有问题（对所有低于 4.4的机型都不做 prevent default处理），这样会导致部分低于4.4的机型上label无法正确触发其中的radio或者checkbox的选择，影响到 form中使用label作为容器的 radio，checkbox，switch和smart select。现在修改了 prevent default的版本判断逻辑，在上述测试机上测试没有问题，不排除还会有其他机型上会出现无法选择的问题。

**CSS calc 不支持**

部分低于4.4的机型不支持 `calc` 函数，一些使用 `calc` 计算宽度的组件会出现宽度问题，主要包括：grid, search bar, messages等组件。现在已经把他们替换成了 `float` 或者 `absolute` 布局。

**display: flex;不支持**

部分低于 4.4 的机型不支持新的 `display: flex;` ，不过并不是所有的，小米M2是4.1.1却支持。不支持 `display: flex;` 的机型会自动降级到 `display: box;`，这是旧的flexbox规范，它的宽度适应没有新规范那么灵活，所以grid组件在这些机型上在同一个 row 中放入的列超出宽度之后，无法自动换到下一行。
关于flexbox的新规范和旧规范，可以参考stackoverflow上的一个问题 [CSS3 Flexbox: display: box vs. flexbox vs. flex](http://stackoverflow.com/questions/16280040/css3-flexbox-display-box-vs-flexbox-vs-flex)
现在的做法是把基于flexbox布局的grid，改成了基于 `float` 的布局。有一点和以前不一样，以前的布局是固定的15px 间距，现在变成一个百分比。
另外一个是message组件，他用的也是 flexbox 布局，而flexbox容器的宽度无法完美自适应，已经把flex替换成了float布局。

**background svg 支持不完全**

测试下来，发现在三星 S3上部分背景图标无法显示，原因还不特别清楚，应该是他不支持在input这种特殊的元素上写background svg。现在已经将大部分 svg 图标替换成iconfont，测试没有问题。

上面列出的是测试出的主要问题，很多组件的bug都是由上面这几个问题引发的。还有一些组件内部的零零碎碎的bug，而且肯定还有一些未发现的bug。不过解决完上述主要问题之后，基本可以在4.0以上版本的安卓设备上使用。
