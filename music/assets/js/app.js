function FastClick(layer, options) {
    "use strict";
    function bind(method, context) {
        return function () {
            return method.apply(context, arguments)
        }
    }
    var oldOnClick;
    if (options = options || {}, this.trackingClick = !1, this.trackingClickStart = 0, this.targetElement = null, this.touchStartX = 0, this.touchStartY = 0, this.lastTouchIdentifier = 0, this.touchBoundary = options.touchBoundary || 10, this.layer = layer, this.tapDelay = options.tapDelay || 200, !FastClick.notNeeded(layer)) {
        for (var methods = ["onMouse", "onClick", "onTouchStart", "onTouchMove", "onTouchEnd", "onTouchCancel"], context = this, i = 0, l = methods.length; l > i; i++)
            context[methods[i]] = bind(context[methods[i]], context);
        deviceIsAndroid && (layer.addEventListener("mouseover", this.onMouse, !0), layer.addEventListener("mousedown", this.onMouse, !0), layer.addEventListener("mouseup", this.onMouse, !0)), layer.addEventListener("click", this.onClick, !0), layer.addEventListener("touchstart", this.onTouchStart, !1), layer.addEventListener("touchmove", this.onTouchMove, !1), layer.addEventListener("touchend", this.onTouchEnd, !1), layer.addEventListener("touchcancel", this.onTouchCancel, !1), Event.prototype.stopImmediatePropagation || (layer.removeEventListener = function (type, callback, capture) {
            var rmv = Node.prototype.removeEventListener;
            "click" === type ? rmv.call(layer, type, callback.hijacked || callback, capture) : rmv.call(layer, type, callback, capture)
        }, layer.addEventListener = function (type, callback, capture) {
            var adv = Node.prototype.addEventListener;
            "click" === type ? adv.call(layer, type, callback.hijacked || (callback.hijacked = function (event) {
                event.propagationStopped || callback(event)
            }), capture) : adv.call(layer, type, callback, capture)
        }), "function" == typeof layer.onclick && (oldOnClick = layer.onclick, layer.addEventListener("click", function (event) {
            oldOnClick(event)
        }, !1), layer.onclick = null)
    }
}
var deviceIsAndroid = navigator.userAgent.indexOf("Android") > 0, deviceIsIOS = /iP(ad|hone|od)/.test(navigator.userAgent), deviceIsIOS4 = deviceIsIOS && /OS 4_\d(_\d)?/.test(navigator.userAgent), deviceIsIOSWithBadTarget = deviceIsIOS && /OS ([6-9]|\d{2})_\d/.test(navigator.userAgent), deviceIsBlackBerry10 = navigator.userAgent.indexOf("BB10") > 0;
FastClick.prototype.needsClick = function (target) {
    "use strict";
    switch (target.nodeName.toLowerCase()) {
        case"button":
        case"select":
        case"textarea":
            if (target.disabled)
                return!0;
            break;
        case"input":
            if (deviceIsIOS && "file" === target.type || target.disabled)
                return!0;
            break;
        case"label":
        case"video":
            return!0
    }
    return/\bneedsclick\b/.test(target.className)
}, FastClick.prototype.needsFocus = function (target) {
    "use strict";
    switch (target.nodeName.toLowerCase()) {
        case"textarea":
            return!0;
        case"select":
            return!deviceIsAndroid;
        case"input":
            switch (target.type) {
                case"button":
                case"checkbox":
                case"file":
                case"image":
                case"radio":
                case"submit":
                    return!1
            }
            return!target.disabled && !target.readOnly;
        default:
            return/\bneedsfocus\b/.test(target.className)
        }
}, FastClick.prototype.sendClick = function (targetElement, event) {
    "use strict";
    var clickEvent, touch;
    document.activeElement && document.activeElement !== targetElement && document.activeElement.blur(), touch = event.changedTouches[0], clickEvent = document.createEvent("MouseEvents"), clickEvent.initMouseEvent(this.determineEventType(targetElement), !0, !0, window, 1, touch.screenX, touch.screenY, touch.clientX, touch.clientY, !1, !1, !1, !1, 0, null), clickEvent.forwardedTouchEvent = !0, targetElement.dispatchEvent(clickEvent)
}, FastClick.prototype.determineEventType = function (targetElement) {
    "use strict";
    return deviceIsAndroid && "select" === targetElement.tagName.toLowerCase() ? "mousedown" : "click"
}, FastClick.prototype.focus = function (targetElement) {
    "use strict";
    var length;
    deviceIsIOS && targetElement.setSelectionRange && 0 !== targetElement.type.indexOf("date") && "time" !== targetElement.type ? (length = targetElement.value.length, targetElement.setSelectionRange(length, length)) : targetElement.focus()
}, FastClick.prototype.updateScrollParent = function (targetElement) {
    "use strict";
    var scrollParent, parentElement;
    if (scrollParent = targetElement.fastClickScrollParent, !scrollParent || !scrollParent.contains(targetElement)) {
        parentElement = targetElement;
        do {
            if (parentElement.scrollHeight > parentElement.offsetHeight) {
                scrollParent = parentElement, targetElement.fastClickScrollParent = parentElement;
                break
            }
            parentElement = parentElement.parentElement
        } while (parentElement)
    }
    scrollParent && (scrollParent.fastClickLastScrollTop = scrollParent.scrollTop)
}, FastClick.prototype.getTargetElementFromEventTarget = function (eventTarget) {
    "use strict";
    return eventTarget.nodeType === Node.TEXT_NODE ? eventTarget.parentNode : eventTarget
}, FastClick.prototype.onTouchStart = function (event) {
    "use strict";
    var targetElement, touch, selection;
    if (event.targetTouches.length > 1)
        return!0;
    if (targetElement = this.getTargetElementFromEventTarget(event.target), touch = event.targetTouches[0], deviceIsIOS) {
        if (selection = window.getSelection(), selection.rangeCount && !selection.isCollapsed)
            return!0;
        if (!deviceIsIOS4) {
            if (touch.identifier && touch.identifier === this.lastTouchIdentifier)
                return event.preventDefault(), !1;
            this.lastTouchIdentifier = touch.identifier, this.updateScrollParent(targetElement)
        }
    }
    return this.trackingClick = !0, this.trackingClickStart = event.timeStamp, this.targetElement = targetElement, this.touchStartX = touch.pageX, this.touchStartY = touch.pageY, event.timeStamp - this.lastClickTime < this.tapDelay && event.preventDefault(), !0
}, FastClick.prototype.touchHasMoved = function (event) {
    "use strict";
    var touch = event.changedTouches[0], boundary = this.touchBoundary;
    return Math.abs(touch.pageX - this.touchStartX) > boundary || Math.abs(touch.pageY - this.touchStartY) > boundary ? !0 : !1
}, FastClick.prototype.onTouchMove = function (event) {
    "use strict";
    return this.trackingClick ? ((this.targetElement !== this.getTargetElementFromEventTarget(event.target) || this.touchHasMoved(event)) && (this.trackingClick = !1, this.targetElement = null), !0) : !0
}, FastClick.prototype.findControl = function (labelElement) {
    "use strict";
    return void 0 !== labelElement.control ? labelElement.control : labelElement.htmlFor ? document.getElementById(labelElement.htmlFor) : labelElement.querySelector("button, input:not([type=hidden]), keygen, meter, output, progress, select, textarea")
}, FastClick.prototype.onTouchEnd = function (event) {
    "use strict";
    var forElement, trackingClickStart, targetTagName, scrollParent, touch, targetElement = this.targetElement;
    if (!this.trackingClick)
        return!0;
    if (event.timeStamp - this.lastClickTime < this.tapDelay)
        return this.cancelNextClick = !0, !0;
    if (this.cancelNextClick = !1, this.lastClickTime = event.timeStamp, trackingClickStart = this.trackingClickStart, this.trackingClick = !1, this.trackingClickStart = 0, deviceIsIOSWithBadTarget && (touch = event.changedTouches[0], targetElement = document.elementFromPoint(touch.pageX - window.pageXOffset, touch.pageY - window.pageYOffset) || targetElement, targetElement.fastClickScrollParent = this.targetElement.fastClickScrollParent), targetTagName = targetElement.tagName.toLowerCase(), "label" === targetTagName) {
        if (forElement = this.findControl(targetElement)) {
            if (this.focus(targetElement), deviceIsAndroid)
                return!1;
            targetElement = forElement
        }
    } else if (this.needsFocus(targetElement))
        return event.timeStamp - trackingClickStart > 100 || deviceIsIOS && window.top !== window && "input" === targetTagName ? (this.targetElement = null, !1) : (this.focus(targetElement), this.sendClick(targetElement, event), deviceIsIOS && "select" === targetTagName || (this.targetElement = null, event.preventDefault()), !1);
    return deviceIsIOS && !deviceIsIOS4 && (scrollParent = targetElement.fastClickScrollParent, scrollParent && scrollParent.fastClickLastScrollTop !== scrollParent.scrollTop) ? !0 : (this.needsClick(targetElement) || (event.preventDefault(), this.sendClick(targetElement, event)), !1)
}, FastClick.prototype.onTouchCancel = function () {
    "use strict";
    this.trackingClick = !1, this.targetElement = null
}, FastClick.prototype.onMouse = function (event) {
    "use strict";
    return this.targetElement ? event.forwardedTouchEvent ? !0 : event.cancelable && (!this.needsClick(this.targetElement) || this.cancelNextClick) ? (event.stopImmediatePropagation ? event.stopImmediatePropagation() : event.propagationStopped = !0, event.stopPropagation(), event.preventDefault(), !1) : !0 : !0
}, FastClick.prototype.onClick = function (event) {
    "use strict";
    var permitted;
    return this.trackingClick ? (this.targetElement = null, this.trackingClick = !1, !0) : "submit" === event.target.type && 0 === event.detail ? !0 : (permitted = this.onMouse(event), permitted || (this.targetElement = null), permitted)
}, FastClick.prototype.destroy = function () {
    "use strict";
    var layer = this.layer;
    deviceIsAndroid && (layer.removeEventListener("mouseover", this.onMouse, !0), layer.removeEventListener("mousedown", this.onMouse, !0), layer.removeEventListener("mouseup", this.onMouse, !0)), layer.removeEventListener("click", this.onClick, !0), layer.removeEventListener("touchstart", this.onTouchStart, !1), layer.removeEventListener("touchmove", this.onTouchMove, !1), layer.removeEventListener("touchend", this.onTouchEnd, !1), layer.removeEventListener("touchcancel", this.onTouchCancel, !1)
}, FastClick.notNeeded = function (layer) {
    "use strict";
    var metaViewport, chromeVersion, blackberryVersion;
    if ("undefined" == typeof window.ontouchstart)
        return!0;
    if (chromeVersion = +(/Chrome\/([0-9]+)/.exec(navigator.userAgent) || [, 0])[1]) {
        if (!deviceIsAndroid)
            return!0;
        if (metaViewport = document.querySelector("meta[name=viewport]")) {
            if (-1 !== metaViewport.content.indexOf("user-scalable=no"))
                return!0;
            if (chromeVersion > 31 && document.documentElement.scrollWidth <= window.outerWidth)
                return!0
        }
    }
    if (deviceIsBlackBerry10 && (blackberryVersion = navigator.userAgent.match(/Version\/([0-9]*)\.([0-9]*)/), blackberryVersion[1] >= 10 && blackberryVersion[2] >= 3 && (metaViewport = document.querySelector("meta[name=viewport]")))) {
        if (-1 !== metaViewport.content.indexOf("user-scalable=no"))
            return!0;
        if (document.documentElement.scrollWidth <= window.outerWidth)
            return!0
    }
    return"none" === layer.style.msTouchAction ? !0 : !1
}, FastClick.attach = function (layer, options) {
    "use strict";
    return new FastClick(layer, options)
}, "function" == typeof define && "object" == typeof define.amd && define.amd ? define(function () {
    "use strict";
    return FastClick
}) : "undefined" != typeof module && module.exports ? (module.exports = FastClick.attach, module.exports.FastClick = FastClick) : window.FastClick = FastClick;
!function (root, factory) {
    "use strict";
    "function" == typeof define && define.amd ? define([], factory) : "object" == typeof exports ? module.exports = factory() : root.viewportUnitsBuggyfill = factory()
}(this, function () {
    "use strict";
    function debounce(func, wait) {
        var timeout;
        return function () {
            var context = this, args = arguments, callback = function () {
                func.apply(context, args)
            };
            clearTimeout(timeout), timeout = setTimeout(callback, wait)
        }
    }
    function inIframe() {
        try {
            return window.self !== window.top
        } catch (e) {
            return!0
        }
    }
    function initialize(initOptions) {
        initialized || (initOptions === !0 && (initOptions = {force: !0}), options = initOptions || {}, options.isMobileSafari = isMobileSafari, (options.force || isMobileSafari || isOldInternetExplorer || options.hacks && options.hacks.required(options)) && (options.hacks && options.hacks.initialize(options), initialized = !0, styleNode = document.createElement("style"), styleNode.id = "patched-viewport", document.head.appendChild(styleNode), importCrossOriginLinks(function () {
            var _refresh = debounce(refresh, options.refreshDebounceWait || 100);
            window.addEventListener("orientationchange", _refresh, !0), window.addEventListener("pageshow", _refresh, !0), (options.force || isOldInternetExplorer || inIframe()) && (window.addEventListener("resize", _refresh, !0), options._listeningToResize = !0), options.hacks && options.hacks.initializeEvents(options, refresh, _refresh), refresh()
        })))
    }
    function updateStyles() {
        styleNode.textContent = getReplacedViewportUnits()
    }
    function refresh() {
        initialized && (findProperties(), setTimeout(function () {
            updateStyles()
        }, 1))
    }
    function findProperties() {
        return declarations = [], forEach.call(document.styleSheets, function (sheet) {
            "patched-viewport" !== sheet.ownerNode.id && sheet.cssRules && (sheet.media && sheet.media.mediaText && window.matchMedia && !window.matchMedia(sheet.media.mediaText).matches || forEach.call(sheet.cssRules, findDeclarations))
        }), declarations
    }
    function findDeclarations(rule) {
        if (7 === rule.type) {
            var value = rule.cssText;
            return viewportUnitExpression.lastIndex = 0, void(viewportUnitExpression.test(value) && (declarations.push([rule, null, value]), options.hacks && options.hacks.findDeclarations(declarations, rule, null, value)))
        }
        if (!rule.style) {
            if (!rule.cssRules)
                return;
            return void forEach.call(rule.cssRules, function (_rule) {
                findDeclarations(_rule)
            })
        }
        forEach.call(rule.style, function (name) {
            var value = rule.style.getPropertyValue(name);
            viewportUnitExpression.lastIndex = 0, viewportUnitExpression.test(value) && (declarations.push([rule, name, value]), options.hacks && options.hacks.findDeclarations(declarations, rule, name, value))
        })
    }
    function getReplacedViewportUnits() {
        dimensions = getViewport();
        var open, close, css = [], buffer = [];
        return declarations.forEach(function (item) {
            var _item = overwriteDeclaration.apply(null, item), _open = _item.selector.length ? _item.selector.join(" {\n") + " {\n" : "", _close = new Array(_item.selector.length + 1).join("\n}");
            return _open && _open === open ? (_open && !open && (open = _open, close = _close), void buffer.push(_item.content)) : (buffer.length && (css.push(open + buffer.join("\n") + close), buffer.length = 0), void(_open ? (open = _open, close = _close, buffer.push(_item.content)) : (css.push(_item.content), open = null, close = null)))
        }), buffer.length && css.push(open + buffer.join("\n") + close), css.join("\n\n")
    }
    function overwriteDeclaration(rule, name, value) {
        var _value = value.replace(viewportUnitExpression, replaceValues), _selectors = [];
        options.hacks && (_value = options.hacks.overwriteDeclaration(rule, name, _value)), name && (_selectors.push(rule.selectorText), _value = name + ": " + _value + ";");
        for (var _rule = rule.parentRule; _rule; )
            _selectors.unshift("@media " + _rule.media.mediaText), _rule = _rule.parentRule;
        return{selector: _selectors, content: _value}
    }
    function replaceValues(match, number, unit) {
        var _base = dimensions[unit], _number = parseFloat(number) / 100;
        return _number * _base + "px"
    }
    function getViewport() {
        var vh = window.innerHeight, vw = window.innerWidth;
        return{vh: vh, vw: vw, vmax: Math.max(vw, vh), vmin: Math.min(vw, vh)}
    }
    function importCrossOriginLinks(next) {
        var _waiting = 0, decrease = function () {
            _waiting--, _waiting || next()
        };
        forEach.call(document.styleSheets, function (sheet) {
            sheet.href && origin(sheet.href) !== origin(location.href) && (_waiting++, convertLinkToStyle(sheet.ownerNode, decrease))
        }), _waiting || next()
    }
    function origin(url) {
        return url.slice(0, url.indexOf("/", url.indexOf("://") + 3))
    }
    function convertLinkToStyle(link, next) {
        getCors(link.href, function () {
            var style = document.createElement("style");
            style.media = link.media, style.setAttribute("data-href", link.href), style.textContent = this.responseText, link.parentNode.replaceChild(style, link), next()
        }, next)
    }
    function getCors(url, success, error) {
        var xhr = new XMLHttpRequest;
        if ("withCredentials"in xhr)
            xhr.open("GET", url, !0);
        else {
            if ("undefined" == typeof XDomainRequest)
                throw new Error("cross-domain XHR not supported");
            xhr = new XDomainRequest, xhr.open("GET", url)
        }
        return xhr.onload = success, xhr.onerror = error, xhr.send(), xhr
    }
    var options, dimensions, declarations, styleNode, initialized = !1, isMobileSafari = /(iPhone|iPod|iPad).+AppleWebKit/i.test(window.navigator.userAgent), viewportUnitExpression = /([+-]?[0-9.]+)(vh|vw|vmin|vmax)/g, forEach = [].forEach, isOldInternetExplorer = !1;
    return{version: "0.4.1", findProperties: findProperties, getCss: getReplacedViewportUnits, init: initialize, refresh: refresh}
});
!function (root, factory) {
    "function" == typeof define && define.amd ? define(factory) : "object" == typeof exports ? module.exports = factory(require, exports, module) : root.Tether = factory()
}(this, function () {
    return function () {
        var Evented, addClass, defer, deferred, extend, flush, getBounds, getOffsetParent, getOrigin, getScrollBarSize, getScrollParent, hasClass, node, removeClass, uniqueId, updateClasses, zeroPosCache, __hasProp = {}.hasOwnProperty, __indexOf = [].indexOf || function (item) {
            for (var i = 0, l = this.length; l > i; i++)
                if (i in this && this[i] === item)
                    return i;
            return-1
        }, __slice = [].slice;
        null == this.Tether && (this.Tether = {modules: []}), getScrollParent = function (el) {
            var parent, position, scrollParent, style, _ref;
            if (position = getComputedStyle(el).position, "fixed" === position)
                return el;
            for (scrollParent = void 0, parent = el; parent = parent.parentNode; ) {
                try {
                    style = getComputedStyle(parent)
                } catch (_error) {
                }
                if (null == style)
                    return parent;
                if (/(auto|scroll)/.test(style.overflow + style["overflow-y"] + style["overflow-x"]) && ("absolute" !== position || "relative" === (_ref = style.position) || "absolute" === _ref || "fixed" === _ref))
                    return parent
            }
            return document.body
        }, uniqueId = function () {
            var id;
            return id = 0, function () {
                return id++
            }
        }(), zeroPosCache = {}, getOrigin = function (doc) {
            var id, k, node, v, _ref;
            if (node = doc._tetherZeroElement, null == node && (node = doc.createElement("div"), node.setAttribute("data-tether-id", uniqueId()), extend(node.style, {top: 0, left: 0, position: "absolute"}), doc.body.appendChild(node), doc._tetherZeroElement = node), id = node.getAttribute("data-tether-id"), null == zeroPosCache[id]) {
                zeroPosCache[id] = {}, _ref = node.getBoundingClientRect();
                for (k in _ref)
                    v = _ref[k], zeroPosCache[id][k] = v;
                defer(function () {
                    return zeroPosCache[id] = void 0
                })
            }
            return zeroPosCache[id]
        }, node = null, getBounds = function (el) {
            var box, doc, docEl, k, origin, v, _ref;
            el === document ? (doc = document, el = document.documentElement) : doc = el.ownerDocument, docEl = doc.documentElement, box = {}, _ref = el.getBoundingClientRect();
            for (k in _ref)
                v = _ref[k], box[k] = v;
            return origin = getOrigin(doc), box.top -= origin.top, box.left -= origin.left, null == box.width && (box.width = document.body.scrollWidth - box.left - box.right), null == box.height && (box.height = document.body.scrollHeight - box.top - box.bottom), box.top = box.top - docEl.clientTop, box.left = box.left - docEl.clientLeft, box.right = doc.body.clientWidth - box.width - box.left, box.bottom = doc.body.clientHeight - box.height - box.top, box
        }, getOffsetParent = function (el) {
            return el.offsetParent || document.documentElement
        }, getScrollBarSize = function () {
            var inner, outer, width, widthContained, widthScroll;
            return inner = document.createElement("div"), inner.style.width = "100%", inner.style.height = "200px", outer = document.createElement("div"), extend(outer.style, {position: "absolute", top: 0, left: 0, pointerEvents: "none", visibility: "hidden", width: "200px", height: "150px", overflow: "hidden"}), outer.appendChild(inner), document.body.appendChild(outer), widthContained = inner.offsetWidth, outer.style.overflow = "scroll", widthScroll = inner.offsetWidth, widthContained === widthScroll && (widthScroll = outer.clientWidth), document.body.removeChild(outer), width = widthContained - widthScroll, {width: width, height: width}
        }, extend = function (out) {
            var args, key, obj, val, _i, _len, _ref;
            for (null == out && (out = {}), args = [], Array.prototype.push.apply(args, arguments), _ref = args.slice(1), _i = 0, _len = _ref.length; _len > _i; _i++)
                if (obj = _ref[_i])
                    for (key in obj)
                        __hasProp.call(obj, key) && (val = obj[key], out[key] = val);
            return out
        }, removeClass = function (el, name) {
            var cls, _i, _len, _ref, _results;
            if (null != el.classList) {
                for (_ref = name.split(" "), _results = [], _i = 0, _len = _ref.length; _len > _i; _i++)
                    cls = _ref[_i], cls.trim() && _results.push(el.classList.remove(cls));
                return _results
            }
            return el.className = el.className.replace(new RegExp("(^| )" + name.split(" ").join("|") + "( |$)", "gi"), " ")
        }, addClass = function (el, name) {
            var cls, _i, _len, _ref, _results;
            if (null != el.classList) {
                for (_ref = name.split(" "), _results = [], _i = 0, _len = _ref.length; _len > _i; _i++)
                    cls = _ref[_i], cls.trim() && _results.push(el.classList.add(cls));
                return _results
            }
            return removeClass(el, name), el.className += " " + name
        }, hasClass = function (el, name) {
            return null != el.classList ? el.classList.contains(name) : new RegExp("(^| )" + name + "( |$)", "gi").test(el.className)
        }, updateClasses = function (el, add, all) {
            var cls, _i, _j, _len, _len1, _results;
            for (_i = 0, _len = all.length; _len > _i; _i++)
                cls = all[_i], __indexOf.call(add, cls) < 0 && hasClass(el, cls) && removeClass(el, cls);
            for (_results = [], _j = 0, _len1 = add.length; _len1 > _j; _j++)
                cls = add[_j], _results.push(hasClass(el, cls) ? void 0 : addClass(el, cls));
            return _results
        }, deferred = [], defer = function (fn) {
            return deferred.push(fn)
        }, flush = function () {
            var fn, _results;
            for (_results = []; fn = deferred.pop(); )
                _results.push(fn());
            return _results
        }, Evented = function () {
            function Evented() {
            }
            return Evented.prototype.on = function (event, handler, ctx, once) {
                var _base;
                return null == once && (once = !1), null == this.bindings && (this.bindings = {}), null == (_base = this.bindings)[event] && (_base[event] = []), this.bindings[event].push({handler: handler, ctx: ctx, once: once})
            }, Evented.prototype.once = function (event, handler, ctx) {
                return this.on(event, handler, ctx, !0)
            }, Evented.prototype.off = function (event, handler) {
                var i, _ref, _results;
                if (null != (null != (_ref = this.bindings) ? _ref[event] : void 0)) {
                    if (null == handler)
                        return delete this.bindings[event];
                    for (i = 0, _results = []; i < this.bindings[event].length; )
                        _results.push(this.bindings[event][i].handler === handler ? this.bindings[event].splice(i, 1) : i++);
                    return _results
                }
            }, Evented.prototype.trigger = function () {
                var args, ctx, event, handler, i, once, _ref, _ref1, _results;
                if (event = arguments[0], args = 2 <= arguments.length ? __slice.call(arguments, 1) : [], null != (_ref = this.bindings) ? _ref[event] : void 0) {
                    for (i = 0, _results = []; i < this.bindings[event].length; )
                        _ref1 = this.bindings[event][i], handler = _ref1.handler, ctx = _ref1.ctx, once = _ref1.once, handler.apply(null != ctx ? ctx : this, args), _results.push(once ? this.bindings[event].splice(i, 1) : i++);
                    return _results
                }
            }, Evented
        }(), this.Tether.Utils = {getScrollParent: getScrollParent, getBounds: getBounds, getOffsetParent: getOffsetParent, extend: extend, addClass: addClass, removeClass: removeClass, hasClass: hasClass, updateClasses: updateClasses, defer: defer, flush: flush, uniqueId: uniqueId, Evented: Evented, getScrollBarSize: getScrollBarSize}
    }.call(this), function () {
        var MIRROR_LR, MIRROR_TB, OFFSET_MAP, Tether, addClass, addOffset, attachmentToOffset, autoToFixedAttachment, defer, extend, flush, getBounds, getOffsetParent, getOuterSize, getScrollBarSize, getScrollParent, getSize, now, offsetToPx, parseAttachment, parseOffset, position, removeClass, tethers, transformKey, updateClasses, within, _Tether, _ref, __slice = [].slice, __bind = function (fn, me) {
            return function () {
                return fn.apply(me, arguments)
            }
        };
        if (null == this.Tether)
            throw new Error("You must include the utils.js file before tether.js");
        Tether = this.Tether, _ref = Tether.Utils, getScrollParent = _ref.getScrollParent, getSize = _ref.getSize, getOuterSize = _ref.getOuterSize, getBounds = _ref.getBounds, getOffsetParent = _ref.getOffsetParent, extend = _ref.extend, addClass = _ref.addClass, removeClass = _ref.removeClass, updateClasses = _ref.updateClasses, defer = _ref.defer, flush = _ref.flush, getScrollBarSize = _ref.getScrollBarSize, within = function (a, b, diff) {
            return null == diff && (diff = 1), a + diff >= b && b >= a - diff
        }, transformKey = function () {
            var el, key, _i, _len, _ref1;
            for (el = document.createElement("div"), _ref1 = ["transform", "webkitTransform", "OTransform", "MozTransform", "msTransform"], _i = 0, _len = _ref1.length; _len > _i; _i++)
                if (key = _ref1[_i], void 0 !== el.style[key])
                    return key
        }(), tethers = [], position = function () {
            var tether, _i, _len;
            for (_i = 0, _len = tethers.length; _len > _i; _i++)
                tether = tethers[_i], tether.position(!1);
            return flush()
        }, now = function () {
            var _ref1;
            return null != (_ref1 = "undefined" != typeof performance && null !== performance && "function" == typeof performance.now ? performance.now() : void 0) ? _ref1 : +new Date
        }, function () {
            var event, lastCall, lastDuration, pendingTimeout, tick, _i, _len, _ref1, _results;
            for (lastCall = null, lastDuration = null, pendingTimeout = null, tick = function () {
                if (null != lastDuration && lastDuration > 16)
                    return lastDuration = Math.min(lastDuration - 16, 250), void(pendingTimeout = setTimeout(tick, 250));
                if (!(null != lastCall && now() - lastCall < 10))
                    return null != pendingTimeout && (clearTimeout(pendingTimeout), pendingTimeout = null), lastCall = now(), position(), lastDuration = now() - lastCall
            }, _ref1 = ["resize", "scroll", "touchmove"], _results = [], _i = 0, _len = _ref1.length; _len > _i; _i++)
                event = _ref1[_i], _results.push(window.addEventListener(event, tick));
            return _results
        }(), MIRROR_LR = {center: "center", left: "right", right: "left"}, MIRROR_TB = {middle: "middle", top: "bottom", bottom: "top"}, OFFSET_MAP = {top: 0, left: 0, middle: "50%", center: "50%", bottom: "100%", right: "100%"}, autoToFixedAttachment = function (attachment, relativeToAttachment) {
            var left, top;
            return left = attachment.left, top = attachment.top, "auto" === left && (left = MIRROR_LR[relativeToAttachment.left]), "auto" === top && (top = MIRROR_TB[relativeToAttachment.top]), {left: left, top: top}
        }, attachmentToOffset = function (attachment) {
            var _ref1, _ref2;
            return{left: null != (_ref1 = OFFSET_MAP[attachment.left]) ? _ref1 : attachment.left, top: null != (_ref2 = OFFSET_MAP[attachment.top]) ? _ref2 : attachment.top}
        }, addOffset = function () {
            var left, offsets, out, top, _i, _len, _ref1;
            for (offsets = 1 <= arguments.length?__slice.call(arguments, 0):[], out = {top:0, left:0}, _i = 0, _len = offsets.length; _len > _i; _i++)
                _ref1 = offsets[_i], top = _ref1.top, left = _ref1.left, "string" == typeof top && (top = parseFloat(top, 10)), "string" == typeof left && (left = parseFloat(left, 10)), out.top += top, out.left += left;
            return out
        }, offsetToPx = function (offset, size) {
            return"string" == typeof offset.left && -1 !== offset.left.indexOf("%") && (offset.left = parseFloat(offset.left, 10) / 100 * size.width), "string" == typeof offset.top && -1 !== offset.top.indexOf("%") && (offset.top = parseFloat(offset.top, 10) / 100 * size.height), offset
        }, parseAttachment = parseOffset = function (value) {
            var left, top, _ref1;
            return _ref1 = value.split(" "), top = _ref1[0], left = _ref1[1], {top: top, left: left}
        }, _Tether = function () {
            function _Tether(options) {
                this.position = __bind(this.position, this);
                var module, _i, _len, _ref1, _ref2;
                for (tethers.push(this), this.history = [], this.setOptions(options, !1), _ref1 = Tether.modules, _i = 0, _len = _ref1.length; _len > _i; _i++)
                    module = _ref1[_i], null != (_ref2 = module.initialize) && _ref2.call(this);
                this.position()
            }
            return _Tether.modules = [], _Tether.prototype.getClass = function (key) {
                var _ref1, _ref2;
                return(null != (_ref1 = this.options.classes) ? _ref1[key] : void 0) ? this.options.classes[key] : (null != (_ref2 = this.options.classes) ? _ref2[key] : void 0) !== !1 ? this.options.classPrefix ? "" + this.options.classPrefix + "-" + key : key : ""
            }, _Tether.prototype.setOptions = function (options, position) {
                var defaults, key, _i, _len, _ref1, _ref2;
                for (this.options = options, null == position && (position = !0), defaults = {offset: "0 0", targetOffset: "0 0", targetAttachment: "auto auto", classPrefix: "tether"}, this.options = extend(defaults, this.options), _ref1 = this.options, this.element = _ref1.element, this.target = _ref1.target, this.targetModifier = _ref1.targetModifier, "viewport" === this.target ? (this.target = document.body, this.targetModifier = "visible") : "scroll-handle" === this.target && (this.target = document.body, this.targetModifier = "scroll-handle"), _ref2 = ["element", "target"], _i = 0, _len = _ref2.length; _len > _i; _i++) {
                    if (key = _ref2[_i], null == this[key])
                        throw new Error("Tether Error: Both element and target must be defined");
                    null != this[key].jquery ? this[key] = this[key][0] : "string" == typeof this[key] && (this[key] = document.querySelector(this[key]))
                }
                if (addClass(this.element, this.getClass("element")), addClass(this.target, this.getClass("target")), !this.options.attachment)
                    throw new Error("Tether Error: You must provide an attachment");
                return this.targetAttachment = parseAttachment(this.options.targetAttachment), this.attachment = parseAttachment(this.options.attachment), this.offset = parseOffset(this.options.offset), this.targetOffset = parseOffset(this.options.targetOffset), null != this.scrollParent && this.disable(), this.scrollParent = "scroll-handle" === this.targetModifier ? this.target : getScrollParent(this.target), this.options.enabled !== !1 ? this.enable(position) : void 0
            }, _Tether.prototype.getTargetBounds = function () {
                var bounds, fitAdj, hasBottomScroll, height, out, scrollBottom, scrollPercentage, style, target;
                if (null == this.targetModifier)
                    return getBounds(this.target);
                switch (this.targetModifier) {
                    case"visible":
                        return this.target === document.body ? {top: pageYOffset, left: pageXOffset, height: innerHeight, width: innerWidth} : (bounds = getBounds(this.target), out = {height: bounds.height, width: bounds.width, top: bounds.top, left: bounds.left}, out.height = Math.min(out.height, bounds.height - (pageYOffset - bounds.top)), out.height = Math.min(out.height, bounds.height - (bounds.top + bounds.height - (pageYOffset + innerHeight))), out.height = Math.min(innerHeight, out.height), out.height -= 2, out.width = Math.min(out.width, bounds.width - (pageXOffset - bounds.left)), out.width = Math.min(out.width, bounds.width - (bounds.left + bounds.width - (pageXOffset + innerWidth))), out.width = Math.min(innerWidth, out.width), out.width -= 2, out.top < pageYOffset && (out.top = pageYOffset), out.left < pageXOffset && (out.left = pageXOffset), out);
                    case"scroll-handle":
                        return target = this.target, target === document.body ? (target = document.documentElement, bounds = {left: pageXOffset, top: pageYOffset, height: innerHeight, width: innerWidth}) : bounds = getBounds(target), style = getComputedStyle(target), hasBottomScroll = target.scrollWidth > target.clientWidth || "scroll" === [style.overflow, style.overflowX] || this.target !== document.body, scrollBottom = 0, hasBottomScroll && (scrollBottom = 15), height = bounds.height - parseFloat(style.borderTopWidth) - parseFloat(style.borderBottomWidth) - scrollBottom, out = {width: 15, height: .975 * height * (height / target.scrollHeight), left: bounds.left + bounds.width - parseFloat(style.borderLeftWidth) - 15}, fitAdj = 0, 408 > height && this.target === document.body && (fitAdj = -11e-5 * Math.pow(height, 2) - .00727 * height + 22.58), this.target !== document.body && (out.height = Math.max(out.height, 24)), scrollPercentage = this.target.scrollTop / (target.scrollHeight - height), out.top = scrollPercentage * (height - out.height - fitAdj) + bounds.top + parseFloat(style.borderTopWidth), this.target === document.body && (out.height = Math.max(out.height, 24)), out
                    }
            }, _Tether.prototype.clearCache = function () {
                return this._cache = {}
            }, _Tether.prototype.cache = function (k, getter) {
                return null == this._cache && (this._cache = {}), null == this._cache[k] && (this._cache[k] = getter.call(this)), this._cache[k]
            }, _Tether.prototype.enable = function (position) {
                return null == position && (position = !0), addClass(this.target, this.getClass("enabled")), addClass(this.element, this.getClass("enabled")), this.enabled = !0, this.scrollParent !== document && this.scrollParent.addEventListener("scroll", this.position), position ? this.position() : void 0
            }, _Tether.prototype.disable = function () {
                return removeClass(this.target, this.getClass("enabled")), removeClass(this.element, this.getClass("enabled")), this.enabled = !1, null != this.scrollParent ? this.scrollParent.removeEventListener("scroll", this.position) : void 0
            }, _Tether.prototype.destroy = function () {
                var i, tether, _i, _len, _results;
                for (this.disable(), _results = [], i = _i = 0, _len = tethers.length; _len > _i; i = ++_i) {
                    if (tether = tethers[i], tether === this) {
                        tethers.splice(i, 1);
                        break
                    }
                    _results.push(void 0)
                }
                return _results
            }, _Tether.prototype.updateAttachClasses = function (elementAttach, targetAttach) {
                var add, all, side, sides, _i, _j, _len, _len1, _ref1, _this = this;
                for (null == elementAttach && (elementAttach = this.attachment), null == targetAttach && (targetAttach = this.targetAttachment), sides = ["left", "top", "bottom", "right", "middle", "center"], (null != (_ref1 = this._addAttachClasses)?_ref1.length:void 0) && this._addAttachClasses.splice(0, this._addAttachClasses.length), add = null != this._addAttachClasses?this._addAttachClasses:this._addAttachClasses = [], elementAttach.top && add.push("" + this.getClass("element-attached") + "-" + elementAttach.top), elementAttach.left && add.push("" + this.getClass("element-attached") + "-" + elementAttach.left), targetAttach.top && add.push("" + this.getClass("target-attached") + "-" + targetAttach.top), targetAttach.left && add.push("" + this.getClass("target-attached") + "-" + targetAttach.left), all = [], _i = 0, _len = sides.length; _len > _i; _i++)
                    side = sides[_i], all.push("" + this.getClass("element-attached") + "-" + side);
                for (_j = 0, _len1 = sides.length; _len1 > _j; _j++)
                    side = sides[_j], all.push("" + this.getClass("target-attached") + "-" + side);
                return defer(function () {
                    return null != _this._addAttachClasses ? (updateClasses(_this.element, _this._addAttachClasses, all), updateClasses(_this.target, _this._addAttachClasses, all), _this._addAttachClasses = void 0) : void 0
                })
            }, _Tether.prototype.position = function (flushChanges) {
                var elementPos, elementStyle, height, left, manualOffset, manualTargetOffset, module, next, offset, offsetBorder, offsetParent, offsetParentSize, offsetParentStyle, offsetPosition, ret, scrollLeft, scrollTop, scrollbarSize, side, targetAttachment, targetOffset, targetPos, targetSize, top, width, _i, _j, _len, _len1, _ref1, _ref2, _ref3, _ref4, _ref5, _ref6, _this = this;
                if (null == flushChanges && (flushChanges = !0), this.enabled) {
                    for (this.clearCache(), targetAttachment = autoToFixedAttachment(this.targetAttachment, this.attachment), this.updateAttachClasses(this.attachment, targetAttachment), elementPos = this.cache("element-bounds", function () {
                        return getBounds(_this.element)
                    }), width = elementPos.width, height = elementPos.height, 0 === width && 0 === height && null != this.lastSize?(_ref1 = this.lastSize, width = _ref1.width, height = _ref1.height):this.lastSize = {width:width, height:height}, targetSize = targetPos = this.cache("target-bounds", function () {
                        return _this.getTargetBounds()
                    }), offset = offsetToPx(attachmentToOffset(this.attachment), {width:width, height:height}), targetOffset = offsetToPx(attachmentToOffset(targetAttachment), targetSize), manualOffset = offsetToPx(this.offset, {width:width, height:height}), manualTargetOffset = offsetToPx(this.targetOffset, targetSize), offset = addOffset(offset, manualOffset), targetOffset = addOffset(targetOffset, manualTargetOffset), left = targetPos.left + targetOffset.left - offset.left, top = targetPos.top + targetOffset.top - offset.top, _ref2 = Tether.modules, _i = 0, _len = _ref2.length; _len > _i; _i++)
                        if (module = _ref2[_i], ret = module.position.call(this, {left: left, top: top, targetAttachment: targetAttachment, targetPos: targetPos, attachment: this.attachment, elementPos: elementPos, offset: offset, targetOffset: targetOffset, manualOffset: manualOffset, manualTargetOffset: manualTargetOffset, scrollbarSize: scrollbarSize}), null != ret && "object" == typeof ret) {
                            if (ret === !1)
                                return!1;
                            top = ret.top, left = ret.left
                        }
                    if (next = {page: {top: top, left: left}, viewport: {top: top - pageYOffset, bottom: pageYOffset - top - height + innerHeight, left: left - pageXOffset, right: pageXOffset - left - width + innerWidth}}, document.body.scrollWidth > window.innerWidth && (scrollbarSize = this.cache("scrollbar-size", getScrollBarSize), next.viewport.bottom -= scrollbarSize.height), document.body.scrollHeight > window.innerHeight && (scrollbarSize = this.cache("scrollbar-size", getScrollBarSize), next.viewport.right -= scrollbarSize.width), ("" !== (_ref3 = document.body.style.position) && "static" !== _ref3 || "" !== (_ref4 = document.body.parentElement.style.position) && "static" !== _ref4) && (next.page.bottom = document.body.scrollHeight - top - height, next.page.right = document.body.scrollWidth - left - width), (null != (_ref5 = this.options.optimizations) ? _ref5.moveElement : void 0) !== !1 && null == this.targetModifier) {
                        for (offsetParent = this.cache("target-offsetparent", function () {
                            return getOffsetParent(_this.target)
                        }), offsetPosition = this.cache("target-offsetparent-bounds", function () {
                            return getBounds(offsetParent)
                        }), offsetParentStyle = getComputedStyle(offsetParent), elementStyle = getComputedStyle(this.element), offsetParentSize = offsetPosition, offsetBorder = {}, _ref6 = ["Top", "Left", "Bottom", "Right"], _j = 0, _len1 = _ref6.length; _len1 > _j; _j++)
                            side = _ref6[_j], offsetBorder[side.toLowerCase()] = parseFloat(offsetParentStyle["border" + side + "Width"]);
                        offsetPosition.right = document.body.scrollWidth - offsetPosition.left - offsetParentSize.width + offsetBorder.right, offsetPosition.bottom = document.body.scrollHeight - offsetPosition.top - offsetParentSize.height + offsetBorder.bottom, next.page.top >= offsetPosition.top + offsetBorder.top && next.page.bottom >= offsetPosition.bottom && next.page.left >= offsetPosition.left + offsetBorder.left && next.page.right >= offsetPosition.right && (scrollTop = offsetParent.scrollTop, scrollLeft = offsetParent.scrollLeft, next.offset = {top: next.page.top - offsetPosition.top + scrollTop - offsetBorder.top, left: next.page.left - offsetPosition.left + scrollLeft - offsetBorder.left})
                    }
                    return this.move(next), this.history.unshift(next), this.history.length > 3 && this.history.pop(), flushChanges && flush(), !0
                }
            }, _Tether.prototype.move = function (position) {
                var css, elVal, found, key, moved, offsetParent, point, same, transcribe, type, val, write, writeCSS, _i, _len, _ref1, _ref2, _this = this;
                if (null != this.element.parentNode) {
                    same = {};
                    for (type in position) {
                        same[type] = {};
                        for (key in position[type]) {
                            for (found = !1, _ref1 = this.history, _i = 0, _len = _ref1.length; _len > _i; _i++)
                                if (point = _ref1[_i], !within(null != (_ref2 = point[type]) ? _ref2[key] : void 0, position[type][key])) {
                                    found = !0;
                                    break
                                }
                            found || (same[type][key] = !0)
                        }
                    }
                    css = {top: "", left: "", right: "", bottom: ""}, transcribe = function (same, pos) {
                        var xPos, yPos, _ref3;
                        return(null != (_ref3 = _this.options.optimizations) ? _ref3.gpu : void 0) === !1 ? (same.top ? css.top = "" + pos.top + "px" : css.bottom = "" + pos.bottom + "px", same.left ? css.left = "" + pos.left + "px" : css.right = "" + pos.right + "px") : (same.top ? (css.top = 0, yPos = pos.top) : (css.bottom = 0, yPos = -pos.bottom), same.left ? (css.left = 0, xPos = pos.left) : (css.right = 0, xPos = -pos.right), css[transformKey] = "translateX(" + Math.round(xPos) + "px) translateY(" + Math.round(yPos) + "px)", "msTransform" !== transformKey ? css[transformKey] += " translateZ(0)" : void 0)
                    }, moved = !1, (same.page.top || same.page.bottom) && (same.page.left || same.page.right) ? (css.position = "absolute", transcribe(same.page, position.page)) : (same.viewport.top || same.viewport.bottom) && (same.viewport.left || same.viewport.right) ? (css.position = "fixed", transcribe(same.viewport, position.viewport)) : null != same.offset && same.offset.top && same.offset.left ? (css.position = "absolute", offsetParent = this.cache("target-offsetparent", function () {
                        return getOffsetParent(_this.target)
                    }), getOffsetParent(this.element) !== offsetParent && defer(function () {
                        return _this.element.parentNode.removeChild(_this.element), offsetParent.appendChild(_this.element)
                    }), transcribe(same.offset, position.offset), moved = !0) : (css.position = "absolute", transcribe({top: !0, left: !0}, position.page)), moved || "BODY" === this.element.parentNode.tagName || (this.element.parentNode.removeChild(this.element), document.body.appendChild(this.element)), writeCSS = {}, write = !1;
                    for (key in css)
                        val = css[key], elVal = this.element.style[key], "" === elVal || "" === val || "top" !== key && "left" !== key && "bottom" !== key && "right" !== key || (elVal = parseFloat(elVal), val = parseFloat(val)), elVal !== val && (write = !0, writeCSS[key] = css[key]);
                    return write ? defer(function () {
                        return extend(_this.element.style, writeCSS)
                    }) : void 0
                }
            }, _Tether
        }(), Tether.position = position, this.Tether = extend(_Tether, Tether)
    }.call(this), function () {
        var BOUNDS_FORMAT, MIRROR_ATTACH, defer, extend, getBoundingRect, getBounds, getOuterSize, getSize, updateClasses, _ref, __indexOf = [].indexOf || function (item) {
            for (var i = 0, l = this.length; l > i; i++)
                if (i in this && this[i] === item)
                    return i;
            return-1
        };
        _ref = this.Tether.Utils, getOuterSize = _ref.getOuterSize, getBounds = _ref.getBounds, getSize = _ref.getSize, extend = _ref.extend, updateClasses = _ref.updateClasses, defer = _ref.defer, MIRROR_ATTACH = {left: "right", right: "left", top: "bottom", bottom: "top", middle: "middle"}, BOUNDS_FORMAT = ["left", "top", "right", "bottom"], getBoundingRect = function (tether, to) {
            var i, pos, side, size, style, _i, _len;
            if ("scrollParent" === to ? to = tether.scrollParent : "window" === to && (to = [pageXOffset, pageYOffset, innerWidth + pageXOffset, innerHeight + pageYOffset]), to === document && (to = to.documentElement), null != to.nodeType)
                for (pos = size = getBounds(to), style = getComputedStyle(to), to = [pos.left, pos.top, size.width + pos.left, size.height + pos.top], i = _i = 0, _len = BOUNDS_FORMAT.length; _len > _i; i = ++_i)
                    side = BOUNDS_FORMAT[i], side = side[0].toUpperCase() + side.substr(1), "Top" === side || "Left" === side ? to[i] += parseFloat(style["border" + side + "Width"]) : to[i] -= parseFloat(style["border" + side + "Width"]);
            return to
        }, this.Tether.modules.push({position: function (_arg) {
                var addClasses, allClasses, attachment, bounds, changeAttachX, changeAttachY, cls, constraint, eAttachment, height, left, oob, oobClass, p, pin, pinned, pinnedClass, removeClass, side, tAttachment, targetAttachment, targetHeight, targetSize, targetWidth, to, top, width, _i, _j, _k, _l, _len, _len1, _len2, _len3, _len4, _len5, _m, _n, _ref1, _ref2, _ref3, _ref4, _ref5, _ref6, _ref7, _ref8, _this = this;
                if (top = _arg.top, left = _arg.left, targetAttachment = _arg.targetAttachment, !this.options.constraints)
                    return!0;
                for (removeClass = function (prefix) {
                    var side, _i, _len, _results;
                    for (_this.removeClass(prefix), _results = [], _i = 0, _len = BOUNDS_FORMAT.length; _len > _i; _i++)
                        side = BOUNDS_FORMAT[_i], _results.push(_this.removeClass("" + prefix + "-" + side));
                    return _results
                }, _ref1 = this.cache("element-bounds", function () {
                    return getBounds(_this.element)
                }), height = _ref1.height, width = _ref1.width, 0 === width && 0 === height && null != this.lastSize && (_ref2 = this.lastSize, width = _ref2.width, height = _ref2.height), targetSize = this.cache("target-bounds", function () {
                    return _this.getTargetBounds()
                }), targetHeight = targetSize.height, targetWidth = targetSize.width, tAttachment = {}, eAttachment = {}, allClasses = [this.getClass("pinned"), this.getClass("out-of-bounds")], _ref3 = this.options.constraints, _i = 0, _len = _ref3.length; _len > _i; _i++)
                    constraint = _ref3[_i], constraint.outOfBoundsClass && allClasses.push(constraint.outOfBoundsClass), constraint.pinnedClass && allClasses.push(constraint.pinnedClass);
                for (_j = 0, _len1 = allClasses.length; _len1 > _j; _j++)
                    for (cls = allClasses[_j], _ref4 = ["left", "top", "right", "bottom"], _k = 0, _len2 = _ref4.length; _len2 > _k; _k++)
                        side = _ref4[_k], allClasses.push("" + cls + "-" + side);
                for (addClasses = [], tAttachment = extend({}, targetAttachment), eAttachment = extend({}, this.attachment), _ref5 = this.options.constraints, _l = 0, _len3 = _ref5.length; _len3 > _l; _l++) {
                    if (constraint = _ref5[_l], to = constraint.to, attachment = constraint.attachment, pin = constraint.pin, null == attachment && (attachment = ""), __indexOf.call(attachment, " ") >= 0 ? (_ref6 = attachment.split(" "), changeAttachY = _ref6[0], changeAttachX = _ref6[1]) : changeAttachX = changeAttachY = attachment, bounds = getBoundingRect(this, to), ("target" === changeAttachY || "both" === changeAttachY) && (top < bounds[1] && "top" === tAttachment.top && (top += targetHeight, tAttachment.top = "bottom"), top + height > bounds[3] && "bottom" === tAttachment.top && (top -= targetHeight, tAttachment.top = "top")), "together" === changeAttachY && (top < bounds[1] && "top" === tAttachment.top && ("bottom" === eAttachment.top ? (top += targetHeight, tAttachment.top = "bottom", top += height, eAttachment.top = "top") : "top" === eAttachment.top && (top += targetHeight, tAttachment.top = "bottom", top -= height, eAttachment.top = "bottom")), top + height > bounds[3] && "bottom" === tAttachment.top && ("top" === eAttachment.top ? (top -= targetHeight, tAttachment.top = "top", top -= height, eAttachment.top = "bottom") : "bottom" === eAttachment.top && (top -= targetHeight, tAttachment.top = "top", top += height, eAttachment.top = "top")), "middle" === tAttachment.top && (top + height > bounds[3] && "top" === eAttachment.top ? (top -= height, eAttachment.top = "bottom") : top < bounds[1] && "bottom" === eAttachment.top && (top += height, eAttachment.top = "top"))), ("target" === changeAttachX || "both" === changeAttachX) && (left < bounds[0] && "left" === tAttachment.left && (left += targetWidth, tAttachment.left = "right"), left + width > bounds[2] && "right" === tAttachment.left && (left -= targetWidth, tAttachment.left = "left")), "together" === changeAttachX && (left < bounds[0] && "left" === tAttachment.left ? "right" === eAttachment.left ? (left += targetWidth, tAttachment.left = "right", left += width, eAttachment.left = "left") : "left" === eAttachment.left && (left += targetWidth, tAttachment.left = "right", left -= width, eAttachment.left = "right") : left + width > bounds[2] && "right" === tAttachment.left ? "left" === eAttachment.left ? (left -= targetWidth, tAttachment.left = "left", left -= width, eAttachment.left = "right") : "right" === eAttachment.left && (left -= targetWidth, tAttachment.left = "left", left += width, eAttachment.left = "left") : "center" === tAttachment.left && (left + width > bounds[2] && "left" === eAttachment.left ? (left -= width, eAttachment.left = "right") : left < bounds[0] && "right" === eAttachment.left && (left += width, eAttachment.left = "left"))), ("element" === changeAttachY || "both" === changeAttachY) && (top < bounds[1] && "bottom" === eAttachment.top && (top += height, eAttachment.top = "top"), top + height > bounds[3] && "top" === eAttachment.top && (top -= height, eAttachment.top = "bottom")), ("element" === changeAttachX || "both" === changeAttachX) && (left < bounds[0] && "right" === eAttachment.left && (left += width, eAttachment.left = "left"), left + width > bounds[2] && "left" === eAttachment.left && (left -= width, eAttachment.left = "right")), "string" == typeof pin ? pin = function () {
                        var _len4, _m, _ref7, _results;
                        for (_ref7 = pin.split(","), _results = [], _m = 0, _len4 = _ref7.length; _len4 > _m; _m++)
                            p = _ref7[_m], _results.push(p.trim());
                        return _results
                    }() : pin === !0 && (pin = ["top", "left", "right", "bottom"]), pin || (pin = []), pinned = [], oob = [], top < bounds[1] && (__indexOf.call(pin, "top") >= 0 ? (top = bounds[1], pinned.push("top")) : oob.push("top")), top + height > bounds[3] && (__indexOf.call(pin, "bottom") >= 0 ? (top = bounds[3] - height, pinned.push("bottom")) : oob.push("bottom")), left < bounds[0] && (__indexOf.call(pin, "left") >= 0 ? (left = bounds[0], pinned.push("left")) : oob.push("left")), left + width > bounds[2] && (__indexOf.call(pin, "right") >= 0 ? (left = bounds[2] - width, pinned.push("right")) : oob.push("right")), pinned.length)
                        for (pinnedClass = null != (_ref7 = this.options.pinnedClass)?_ref7:this.getClass("pinned"), addClasses.push(pinnedClass), _m = 0, _len4 = pinned.length; _len4 > _m; _m++)
                            side = pinned[_m], addClasses.push("" + pinnedClass + "-" + side);
                    if (oob.length)
                        for (oobClass = null != (_ref8 = this.options.outOfBoundsClass)?_ref8:this.getClass("out-of-bounds"), addClasses.push(oobClass), _n = 0, _len5 = oob.length; _len5 > _n; _n++)
                            side = oob[_n], addClasses.push("" + oobClass + "-" + side);
                    (__indexOf.call(pinned, "left") >= 0 || __indexOf.call(pinned, "right") >= 0) && (eAttachment.left = tAttachment.left = !1), (__indexOf.call(pinned, "top") >= 0 || __indexOf.call(pinned, "bottom") >= 0) && (eAttachment.top = tAttachment.top = !1), (tAttachment.top !== targetAttachment.top || tAttachment.left !== targetAttachment.left || eAttachment.top !== this.attachment.top || eAttachment.left !== this.attachment.left) && this.updateAttachClasses(eAttachment, tAttachment)
                }
                return defer(function () {
                    return updateClasses(_this.target, addClasses, allClasses), updateClasses(_this.element, addClasses, allClasses)
                }), {top: top, left: left}
            }})
    }.call(this), function () {
        var defer, getBounds, updateClasses, _ref;
        _ref = this.Tether.Utils, getBounds = _ref.getBounds, updateClasses = _ref.updateClasses, defer = _ref.defer, this.Tether.modules.push({position: function (_arg) {
                var abutted, addClasses, allClasses, bottom, height, left, right, side, sides, targetPos, top, width, _i, _j, _k, _l, _len, _len1, _len2, _len3, _ref1, _ref2, _ref3, _ref4, _ref5, _this = this;
                if (top = _arg.top, left = _arg.left, _ref1 = this.cache("element-bounds", function () {
                    return getBounds(_this.element)
                }), height = _ref1.height, width = _ref1.width, targetPos = this.getTargetBounds(), bottom = top + height, right = left + width, abutted = [], top <= targetPos.bottom && bottom >= targetPos.top)
                    for (_ref2 = ["left", "right"], _i = 0, _len = _ref2.length; _len > _i; _i++)
                        side = _ref2[_i], ((_ref3 = targetPos[side]) === left || _ref3 === right) && abutted.push(side);
                if (left <= targetPos.right && right >= targetPos.left)
                    for (_ref4 = ["top", "bottom"], _j = 0, _len1 = _ref4.length; _len1 > _j; _j++)
                        side = _ref4[_j], ((_ref5 = targetPos[side]) === top || _ref5 === bottom) && abutted.push(side);
                for (allClasses = [], addClasses = [], sides = ["left", "top", "right", "bottom"], allClasses.push(this.getClass("abutted")), _k = 0, _len2 = sides.length; _len2 > _k; _k++)
                    side = sides[_k], allClasses.push("" + this.getClass("abutted") + "-" + side);
                for (abutted.length && addClasses.push(this.getClass("abutted")), _l = 0, _len3 = abutted.length; _len3 > _l; _l++)
                    side = abutted[_l], addClasses.push("" + this.getClass("abutted") + "-" + side);
                return defer(function () {
                    return updateClasses(_this.target, addClasses, allClasses), updateClasses(_this.element, addClasses, allClasses)
                }), !0
            }})
    }.call(this), function () {
        this.Tether.modules.push({position: function (_arg) {
                var left, result, shift, shiftLeft, shiftTop, top, _ref;
                return top = _arg.top, left = _arg.left, this.options.shift ? (result = function (val) {
                    return"function" == typeof val ? val.call(this, {top: top, left: left}) : val
                }, shift = result(this.options.shift), "string" == typeof shift ? (shift = shift.split(" "), shift[1] || (shift[1] = shift[0]), shiftTop = shift[0], shiftLeft = shift[1], shiftTop = parseFloat(shiftTop, 10), shiftLeft = parseFloat(shiftLeft, 10)) : (_ref = [shift.top, shift.left], shiftTop = _ref[0], shiftLeft = _ref[1]), top += shiftTop, left += shiftLeft, {top: top, left: left}) : void 0
            }})
    }.call(this), this.Tether
});
