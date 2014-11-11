# What is Framework7-Plus

[Framework7](https://github.com/nolimits4web/Framework7) is a Full Featured HTML Framework For Building iOS7 Apps. It works perfect on iOS, but has some bug on most android devices.
Framework7-Plus is forked from Framework7, and it's aim is to make it worked on most android 4.0+ devices, but without change any F7's api(maybe will add some new api).

here is a todo list:

common:

- replace native scroller with js scroller, because components that use `position: absolte` and `translate3D` has flicker bug when scroll with native scroller.
- replace background svg with icon font, because background svg is not supported on some android devices like sumsung note 5
- fix CSS `calc`  and `display: flex;` bug


I will update this todo list whenever I find a new bug.
