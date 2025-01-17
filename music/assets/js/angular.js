!function (window, document, undefined) {
    "use strict";
    function minErr(module, ErrorConstructor) {
        return ErrorConstructor = ErrorConstructor || Error, function () {
            var message, i, code = arguments[0], prefix = "[" + (module ? module + ":" : "") + code + "] ", template = arguments[1], templateArgs = arguments;
            for (message = prefix + template.replace(/\{\d+\}/g, function (match) {
                var index = +match.slice(1, -1);
                return index + 2 < templateArgs.length ? toDebugString(templateArgs[index + 2]) : match
            }), message = message + "\nhttp://errors.angularjs.org/1.3.5/" + (module?module + "/":"") + code, i = 2; i < arguments.length; i++)
                message = message + (2 == i ? "?" : "&") + "p" + (i - 2) + "=" + encodeURIComponent(toDebugString(arguments[i]));
            return new ErrorConstructor(message)
        }
    }
    function isArrayLike(obj) {
        if (null == obj || isWindow(obj))
            return!1;
        var length = obj.length;
        return obj.nodeType === NODE_TYPE_ELEMENT && length ? !0 : isString(obj) || isArray(obj) || 0 === length || "number" == typeof length && length > 0 && length - 1 in obj
    }
    function forEach(obj, iterator, context) {
        var key, length;
        if (obj)
            if (isFunction(obj))
                for (key in obj)
                    "prototype" == key || "length" == key || "name" == key || obj.hasOwnProperty && !obj.hasOwnProperty(key) || iterator.call(context, obj[key], key, obj);
            else if (isArray(obj) || isArrayLike(obj)) {
                var isPrimitive = "object" != typeof obj;
                for (key = 0, length = obj.length; length > key; key++)
                    (isPrimitive || key in obj) && iterator.call(context, obj[key], key, obj)
            } else if (obj.forEach && obj.forEach !== forEach)
                obj.forEach(iterator, context, obj);
            else
                for (key in obj)
                    obj.hasOwnProperty(key) && iterator.call(context, obj[key], key, obj);
        return obj
    }
    function sortedKeys(obj) {
        return Object.keys(obj).sort()
    }
    function forEachSorted(obj, iterator, context) {
        for (var keys = sortedKeys(obj), i = 0; i < keys.length; i++)
            iterator.call(context, obj[keys[i]], keys[i]);
        return keys
    }
    function reverseParams(iteratorFn) {
        return function (value, key) {
            iteratorFn(key, value)
        }
    }
    function nextUid() {
        return++uid
    }
    function setHashKey(obj, h) {
        h ? obj.$$hashKey = h : delete obj.$$hashKey
    }
    function extend(dst) {
        for (var h = dst.$$hashKey, i = 1, ii = arguments.length; ii > i; i++) {
            var obj = arguments[i];
            if (obj)
                for (var keys = Object.keys(obj), j = 0, jj = keys.length; jj > j; j++) {
                    var key = keys[j];
                    dst[key] = obj[key]
                }
        }
        return setHashKey(dst, h), dst
    }
    function int(str) {
        return parseInt(str, 10)
    }
    function inherit(parent, extra) {
        return extend(Object.create(parent), extra)
    }
    function noop() {
    }
    function identity($) {
        return $
    }
    function valueFn(value) {
        return function () {
            return value
        }
    }
    function isUndefined(value) {
        return"undefined" == typeof value
    }
    function isDefined(value) {
        return"undefined" != typeof value
    }
    function isObject(value) {
        return null !== value && "object" == typeof value
    }
    function isString(value) {
        return"string" == typeof value
    }
    function isNumber(value) {
        return"number" == typeof value
    }
    function isDate(value) {
        return"[object Date]" === toString.call(value)
    }
    function isFunction(value) {
        return"function" == typeof value
    }
    function isRegExp(value) {
        return"[object RegExp]" === toString.call(value)
    }
    function isWindow(obj) {
        return obj && obj.window === obj
    }
    function isScope(obj) {
        return obj && obj.$evalAsync && obj.$watch
    }
    function isFile(obj) {
        return"[object File]" === toString.call(obj)
    }
    function isBlob(obj) {
        return"[object Blob]" === toString.call(obj)
    }
    function isBoolean(value) {
        return"boolean" == typeof value
    }
    function isPromiseLike(obj) {
        return obj && isFunction(obj.then)
    }
    function isElement(node) {
        return!(!node || !(node.nodeName || node.prop && node.attr && node.find))
    }
    function makeMap(str) {
        var i, obj = {}, items = str.split(",");
        for (i = 0; i < items.length; i++)
            obj[items[i]] = !0;
        return obj
    }
    function nodeName_(element) {
        return lowercase(element.nodeName || element[0] && element[0].nodeName)
    }
    function arrayRemove(array, value) {
        var index = array.indexOf(value);
        return index >= 0 && array.splice(index, 1), value
    }
    function copy(source, destination, stackSource, stackDest) {
        if (isWindow(source) || isScope(source))
            throw ngMinErr("cpws", "Can't copy! Making copies of Window or Scope instances is not supported.");
        if (destination) {
            if (source === destination)
                throw ngMinErr("cpi", "Can't copy! Source and destination are identical.");
            if (stackSource = stackSource || [], stackDest = stackDest || [], isObject(source)) {
                var index = stackSource.indexOf(source);
                if (-1 !== index)
                    return stackDest[index];
                stackSource.push(source), stackDest.push(destination)
            }
            var result;
            if (isArray(source)) {
                destination.length = 0;
                for (var i = 0; i < source.length; i++)
                    result = copy(source[i], null, stackSource, stackDest), isObject(source[i]) && (stackSource.push(source[i]), stackDest.push(result)), destination.push(result)
            } else {
                var h = destination.$$hashKey;
                isArray(destination) ? destination.length = 0 : forEach(destination, function (value, key) {
                    delete destination[key]
                });
                for (var key in source)
                    source.hasOwnProperty(key) && (result = copy(source[key], null, stackSource, stackDest), isObject(source[key]) && (stackSource.push(source[key]), stackDest.push(result)), destination[key] = result);
                setHashKey(destination, h)
            }
        } else if (destination = source, source)
            if (isArray(source))
                destination = copy(source, [], stackSource, stackDest);
            else if (isDate(source))
                destination = new Date(source.getTime());
            else if (isRegExp(source))
                destination = new RegExp(source.source, source.toString().match(/[^\/]*$/)[0]), destination.lastIndex = source.lastIndex;
            else if (isObject(source)) {
                var emptyObject = Object.create(Object.getPrototypeOf(source));
                destination = copy(source, emptyObject, stackSource, stackDest)
            }
        return destination
    }
    function shallowCopy(src, dst) {
        if (isArray(src)) {
            dst = dst || [];
            for (var i = 0, ii = src.length; ii > i; i++)
                dst[i] = src[i]
        } else if (isObject(src)) {
            dst = dst || {};
            for (var key in src)
                ("$" !== key.charAt(0) || "$" !== key.charAt(1)) && (dst[key] = src[key])
        }
        return dst || src
    }
    function equals(o1, o2) {
        if (o1 === o2)
            return!0;
        if (null === o1 || null === o2)
            return!1;
        if (o1 !== o1 && o2 !== o2)
            return!0;
        var length, key, keySet, t1 = typeof o1, t2 = typeof o2;
        if (t1 == t2 && "object" == t1) {
            if (!isArray(o1)) {
                if (isDate(o1))
                    return isDate(o2) ? equals(o1.getTime(), o2.getTime()) : !1;
                if (isRegExp(o1) && isRegExp(o2))
                    return o1.toString() == o2.toString();
                if (isScope(o1) || isScope(o2) || isWindow(o1) || isWindow(o2) || isArray(o2))
                    return!1;
                keySet = {};
                for (key in o1)
                    if ("$" !== key.charAt(0) && !isFunction(o1[key])) {
                        if (!equals(o1[key], o2[key]))
                            return!1;
                        keySet[key] = !0
                    }
                for (key in o2)
                    if (!keySet.hasOwnProperty(key) && "$" !== key.charAt(0) && o2[key] !== undefined && !isFunction(o2[key]))
                        return!1;
                return!0
            }
            if (!isArray(o2))
                return!1;
            if ((length = o1.length) == o2.length) {
                for (key = 0; length > key; key++)
                    if (!equals(o1[key], o2[key]))
                        return!1;
                return!0
            }
        }
        return!1
    }
    function concat(array1, array2, index) {
        return array1.concat(slice.call(array2, index))
    }
    function sliceArgs(args, startIndex) {
        return slice.call(args, startIndex || 0)
    }
    function bind(self, fn) {
        var curryArgs = arguments.length > 2 ? sliceArgs(arguments, 2) : [];
        return!isFunction(fn) || fn instanceof RegExp ? fn : curryArgs.length ? function () {
            return arguments.length ? fn.apply(self, concat(curryArgs, arguments, 0)) : fn.apply(self, curryArgs)
        } : function () {
            return arguments.length ? fn.apply(self, arguments) : fn.call(self)
        }
    }
    function toJsonReplacer(key, value) {
        var val = value;
        return"string" == typeof key && "$" === key.charAt(0) && "$" === key.charAt(1) ? val = undefined : isWindow(value) ? val = "$WINDOW" : value && document === value ? val = "$DOCUMENT" : isScope(value) && (val = "$SCOPE"), val
    }
    function toJson(obj, pretty) {
        return"undefined" == typeof obj ? undefined : JSON.stringify(obj, toJsonReplacer, pretty ? "  " : null)
    }
    function fromJson(json) {
        return isString(json) ? JSON.parse(json) : json
    }
    function startingTag(element) {
        element = jqLite(element).clone();
        try {
            element.empty()
        } catch (e) {
        }
        var elemHtml = jqLite("<div>").append(element).html();
        try {
            return element[0].nodeType === NODE_TYPE_TEXT ? lowercase(elemHtml) : elemHtml.match(/^(<[^>]+>)/)[1].replace(/^<([\w\-]+)/, function (match, nodeName) {
                return"<" + lowercase(nodeName)
            })
        } catch (e) {
            return lowercase(elemHtml)
        }
    }
    function tryDecodeURIComponent(value) {
        try {
            return decodeURIComponent(value)
        } catch (e) {
        }
    }
    function parseKeyValue(keyValue) {
        var key_value, key, obj = {};
        return forEach((keyValue || "").split("&"), function (keyValue) {
            if (keyValue && (key_value = keyValue.replace(/\+/g, "%20").split("="), key = tryDecodeURIComponent(key_value[0]), isDefined(key))) {
                var val = isDefined(key_value[1]) ? tryDecodeURIComponent(key_value[1]) : !0;
                hasOwnProperty.call(obj, key) ? isArray(obj[key]) ? obj[key].push(val) : obj[key] = [obj[key], val] : obj[key] = val
            }
        }), obj
    }
    function toKeyValue(obj) {
        var parts = [];
        return forEach(obj, function (value, key) {
            isArray(value) ? forEach(value, function (arrayValue) {
                parts.push(encodeUriQuery(key, !0) + (arrayValue === !0 ? "" : "=" + encodeUriQuery(arrayValue, !0)))
            }) : parts.push(encodeUriQuery(key, !0) + (value === !0 ? "" : "=" + encodeUriQuery(value, !0)))
        }), parts.length ? parts.join("&") : ""
    }
    function encodeUriSegment(val) {
        return encodeUriQuery(val, !0).replace(/%26/gi, "&").replace(/%3D/gi, "=").replace(/%2B/gi, "+")
    }
    function encodeUriQuery(val, pctEncodeSpaces) {
        return encodeURIComponent(val).replace(/%40/gi, "@").replace(/%3A/gi, ":").replace(/%24/g, "$").replace(/%2C/gi, ",").replace(/%3B/gi, ";").replace(/%20/g, pctEncodeSpaces ? "%20" : "+")
    }
    function getNgAttribute(element, ngAttr) {
        var attr, i, ii = ngAttrPrefixes.length;
        for (element = jqLite(element), i = 0; ii > i; ++i)
            if (attr = ngAttrPrefixes[i] + ngAttr, isString(attr = element.attr(attr)))
                return attr;
        return null
    }
    function angularInit(element, bootstrap) {
        var appElement, module, config = {};
        forEach(ngAttrPrefixes, function (prefix) {
            var name = prefix + "app";
            !appElement && element.hasAttribute && element.hasAttribute(name) && (appElement = element, module = element.getAttribute(name))
        }), forEach(ngAttrPrefixes, function (prefix) {
            var candidate, name = prefix + "app";
            !appElement && (candidate = element.querySelector("[" + name.replace(":", "\\:") + "]")) && (appElement = candidate, module = candidate.getAttribute(name))
        }), appElement && (config.strictDi = null !== getNgAttribute(appElement, "strict-di"), bootstrap(appElement, module ? [module] : [], config))
    }
    function bootstrap(element, modules, config) {
        isObject(config) || (config = {});
        var defaultConfig = {strictDi: !1};
        config = extend(defaultConfig, config);
        var doBootstrap = function () {
            if (element = jqLite(element), element.injector()) {
                var tag = element[0] === document ? "document" : startingTag(element);
                throw ngMinErr("btstrpd", "App Already Bootstrapped with this Element '{0}'", tag.replace(/</, "&lt;").replace(/>/, "&gt;"))
            }
            modules = modules || [], modules.unshift(["$provide", function ($provide) {
                    $provide.value("$rootElement", element)
                }]), config.debugInfoEnabled && modules.push(["$compileProvider", function ($compileProvider) {
                    $compileProvider.debugInfoEnabled(!0)
                }]), modules.unshift("ng");
            var injector = createInjector(modules, config.strictDi);
            return injector.invoke(["$rootScope", "$rootElement", "$compile", "$injector", function (scope, element, compile, injector) {
                    scope.$apply(function () {
                        element.data("$injector", injector), compile(element)(scope)
                    })
                }]), injector
        }, NG_ENABLE_DEBUG_INFO = /^NG_ENABLE_DEBUG_INFO!/, NG_DEFER_BOOTSTRAP = /^NG_DEFER_BOOTSTRAP!/;
        return window && NG_ENABLE_DEBUG_INFO.test(window.name) && (config.debugInfoEnabled = !0, window.name = window.name.replace(NG_ENABLE_DEBUG_INFO, "")), window && !NG_DEFER_BOOTSTRAP.test(window.name) ? doBootstrap() : (window.name = window.name.replace(NG_DEFER_BOOTSTRAP, ""), void(angular.resumeBootstrap = function (extraModules) {
            forEach(extraModules, function (module) {
                modules.push(module)
            }), doBootstrap()
        }))
    }
    function reloadWithDebugInfo() {
        window.name = "NG_ENABLE_DEBUG_INFO!" + window.name, window.location.reload()
    }
    function getTestability(rootElement) {
        return angular.element(rootElement).injector().get("$$testability")
    }
    function snake_case(name, separator) {
        return separator = separator || "_", name.replace(SNAKE_CASE_REGEXP, function (letter, pos) {
            return(pos ? separator : "") + letter.toLowerCase()
        })
    }
    function bindJQuery() {
        var originalCleanData;
        bindJQueryFired || (jQuery = window.jQuery, jQuery && jQuery.fn.on ? (jqLite = jQuery, extend(jQuery.fn, {scope: JQLitePrototype.scope, isolateScope: JQLitePrototype.isolateScope, controller: JQLitePrototype.controller, injector: JQLitePrototype.injector, inheritedData: JQLitePrototype.inheritedData}), originalCleanData = jQuery.cleanData, jQuery.cleanData = function (elems) {
            var events;
            if (skipDestroyOnNextJQueryCleanData)
                skipDestroyOnNextJQueryCleanData = !1;
            else
                for (var elem, i = 0; null != (elem = elems[i]); i++)
                    events = jQuery._data(elem, "events"), events && events.$destroy && jQuery(elem).triggerHandler("$destroy");
            originalCleanData(elems)
        }) : jqLite = JQLite, angular.element = jqLite, bindJQueryFired = !0)
    }
    function assertArg(arg, name, reason) {
        if (!arg)
            throw ngMinErr("areq", "Argument '{0}' is {1}", name || "?", reason || "required");
        return arg
    }
    function assertArgFn(arg, name, acceptArrayAnnotation) {
        return acceptArrayAnnotation && isArray(arg) && (arg = arg[arg.length - 1]), assertArg(isFunction(arg), name, "not a function, got " + (arg && "object" == typeof arg ? arg.constructor.name || "Object" : typeof arg)), arg
    }
    function assertNotHasOwnProperty(name, context) {
        if ("hasOwnProperty" === name)
            throw ngMinErr("badname", "hasOwnProperty is not a valid {0} name", context)
    }
    function getter(obj, path, bindFnToScope) {
        if (!path)
            return obj;
        for (var key, keys = path.split("."), lastInstance = obj, len = keys.length, i = 0; len > i; i++)
            key = keys[i], obj && (obj = (lastInstance = obj)[key]);
        return!bindFnToScope && isFunction(obj) ? bind(lastInstance, obj) : obj
    }
    function getBlockNodes(nodes) {
        var node = nodes[0], endNode = nodes[nodes.length - 1], blockNodes = [node];
        do {
            if (node = node.nextSibling, !node)
                break;
            blockNodes.push(node)
        } while (node !== endNode);
        return jqLite(blockNodes)
    }
    function createMap() {
        return Object.create(null)
    }
    function setupModuleLoader(window) {
        function ensure(obj, name, factory) {
            return obj[name] || (obj[name] = factory())
        }
        var $injectorMinErr = minErr("$injector"), ngMinErr = minErr("ng"), angular = ensure(window, "angular", Object);
        return angular.$$minErr = angular.$$minErr || minErr, ensure(angular, "module", function () {
            var modules = {};
            return function (name, requires, configFn) {
                var assertNotHasOwnProperty = function (name, context) {
                    if ("hasOwnProperty" === name)
                        throw ngMinErr("badname", "hasOwnProperty is not a valid {0} name", context)
                };
                return assertNotHasOwnProperty(name, "module"), requires && modules.hasOwnProperty(name) && (modules[name] = null), ensure(modules, name, function () {
                    function invokeLater(provider, method, insertMethod, queue) {
                        return queue || (queue = invokeQueue), function () {
                            return queue[insertMethod || "push"]([provider, method, arguments]), moduleInstance
                        }
                    }
                    if (!requires)
                        throw $injectorMinErr("nomod", "Module '{0}' is not available! You either misspelled the module name or forgot to load it. If registering a module ensure that you specify the dependencies as the second argument.", name);
                    var invokeQueue = [], configBlocks = [], runBlocks = [], config = invokeLater("$injector", "invoke", "push", configBlocks), moduleInstance = {_invokeQueue: invokeQueue, _configBlocks: configBlocks, _runBlocks: runBlocks, requires: requires, name: name, provider: invokeLater("$provide", "provider"), factory: invokeLater("$provide", "factory"), service: invokeLater("$provide", "service"), value: invokeLater("$provide", "value"), constant: invokeLater("$provide", "constant", "unshift"), animation: invokeLater("$animateProvider", "register"), filter: invokeLater("$filterProvider", "register"), controller: invokeLater("$controllerProvider", "register"), directive: invokeLater("$compileProvider", "directive"), config: config, run: function (block) {
                            return runBlocks.push(block), this
                        }};
                    return configFn && config(configFn), moduleInstance
                })
            }
        })
    }
    function serializeObject(obj) {
        var seen = [];
        return JSON.stringify(obj, function (key, val) {
            if (val = toJsonReplacer(key, val), isObject(val)) {
                if (seen.indexOf(val) >= 0)
                    return"<<already seen>>";
                seen.push(val)
            }
            return val
        })
    }
    function toDebugString(obj) {
        return"function" == typeof obj ? obj.toString().replace(/ \{[\s\S]*$/, "") : "undefined" == typeof obj ? "undefined" : "string" != typeof obj ? serializeObject(obj) : obj
    }
    function publishExternalAPI(angular) {
        extend(angular, {bootstrap: bootstrap, copy: copy, extend: extend, equals: equals, element: jqLite, forEach: forEach, injector: createInjector, noop: noop, bind: bind, toJson: toJson, fromJson: fromJson, identity: identity, isUndefined: isUndefined, isDefined: isDefined, isString: isString, isFunction: isFunction, isObject: isObject, isNumber: isNumber, isElement: isElement, isArray: isArray, version: version, isDate: isDate, lowercase: lowercase, uppercase: uppercase, callbacks: {counter: 0}, getTestability: getTestability, $$minErr: minErr, $$csp: csp, reloadWithDebugInfo: reloadWithDebugInfo}), angularModule = setupModuleLoader(window);
        try {
            angularModule("ngLocale")
        } catch (e) {
            angularModule("ngLocale", []).provider("$locale", $LocaleProvider)
        }
        angularModule("ng", ["ngLocale"], ["$provide", function ($provide) {
                $provide.provider({$$sanitizeUri: $$SanitizeUriProvider}), $provide.provider("$compile", $CompileProvider).directive({a: htmlAnchorDirective, input: inputDirective, textarea: inputDirective, form: formDirective, script: scriptDirective, select: selectDirective, style: styleDirective, option: optionDirective, ngBind: ngBindDirective, ngBindHtml: ngBindHtmlDirective, ngBindTemplate: ngBindTemplateDirective, ngClass: ngClassDirective, ngClassEven: ngClassEvenDirective, ngClassOdd: ngClassOddDirective, ngCloak: ngCloakDirective, ngController: ngControllerDirective, ngForm: ngFormDirective, ngHide: ngHideDirective, ngIf: ngIfDirective, ngInclude: ngIncludeDirective, ngInit: ngInitDirective, ngNonBindable: ngNonBindableDirective, ngPluralize: ngPluralizeDirective, ngRepeat: ngRepeatDirective, ngShow: ngShowDirective, ngStyle: ngStyleDirective, ngSwitch: ngSwitchDirective, ngSwitchWhen: ngSwitchWhenDirective, ngSwitchDefault: ngSwitchDefaultDirective, ngOptions: ngOptionsDirective, ngTransclude: ngTranscludeDirective, ngModel: ngModelDirective, ngList: ngListDirective, ngChange: ngChangeDirective, pattern: patternDirective, ngPattern: patternDirective, required: requiredDirective, ngRequired: requiredDirective, minlength: minlengthDirective, ngMinlength: minlengthDirective, maxlength: maxlengthDirective, ngMaxlength: maxlengthDirective, ngValue: ngValueDirective, ngModelOptions: ngModelOptionsDirective}).directive({ngInclude: ngIncludeFillContentDirective}).directive(ngAttributeAliasDirectives).directive(ngEventDirectives), $provide.provider({$anchorScroll: $AnchorScrollProvider, $animate: $AnimateProvider, $browser: $BrowserProvider, $cacheFactory: $CacheFactoryProvider, $controller: $ControllerProvider, $document: $DocumentProvider, $exceptionHandler: $ExceptionHandlerProvider, $filter: $FilterProvider, $interpolate: $InterpolateProvider, $interval: $IntervalProvider, $http: $HttpProvider, $httpBackend: $HttpBackendProvider, $location: $LocationProvider, $log: $LogProvider, $parse: $ParseProvider, $rootScope: $RootScopeProvider, $q: $QProvider, $$q: $$QProvider, $sce: $SceProvider, $sceDelegate: $SceDelegateProvider, $sniffer: $SnifferProvider, $templateCache: $TemplateCacheProvider, $templateRequest: $TemplateRequestProvider, $$testability: $$TestabilityProvider, $timeout: $TimeoutProvider, $window: $WindowProvider, $$rAF: $$RAFProvider, $$asyncCallback: $$AsyncCallbackProvider})
            }])
    }
    function jqNextId() {
        return++jqId
    }
    function camelCase(name) {
        return name.replace(SPECIAL_CHARS_REGEXP, function (_, separator, letter, offset) {
            return offset ? letter.toUpperCase() : letter
        }).replace(MOZ_HACK_REGEXP, "Moz$1")
    }
    function jqLiteIsTextNode(html) {
        return!HTML_REGEXP.test(html)
    }
    function jqLiteAcceptsData(node) {
        var nodeType = node.nodeType;
        return nodeType === NODE_TYPE_ELEMENT || !nodeType || nodeType === NODE_TYPE_DOCUMENT
    }
    function jqLiteBuildFragment(html, context) {
        var tmp, tag, wrap, i, fragment = context.createDocumentFragment(), nodes = [];
        if (jqLiteIsTextNode(html))
            nodes.push(context.createTextNode(html));
        else {
            for (tmp = tmp || fragment.appendChild(context.createElement("div")), tag = (TAG_NAME_REGEXP.exec(html) || ["", ""])[1].toLowerCase(), wrap = wrapMap[tag] || wrapMap._default, tmp.innerHTML = wrap[1] + html.replace(XHTML_TAG_REGEXP, "<$1></$2>") + wrap[2], i = wrap[0]; i--; )
                tmp = tmp.lastChild;
            nodes = concat(nodes, tmp.childNodes), tmp = fragment.firstChild, tmp.textContent = ""
        }
        return fragment.textContent = "", fragment.innerHTML = "", forEach(nodes, function (node) {
            fragment.appendChild(node)
        }), fragment
    }
    function jqLiteParseHTML(html, context) {
        context = context || document;
        var parsed;
        return(parsed = SINGLE_TAG_REGEXP.exec(html)) ? [context.createElement(parsed[1])] : (parsed = jqLiteBuildFragment(html, context)) ? parsed.childNodes : []
    }
    function JQLite(element) {
        if (element instanceof JQLite)
            return element;
        var argIsString;
        if (isString(element) && (element = trim(element), argIsString = !0), !(this instanceof JQLite)) {
            if (argIsString && "<" != element.charAt(0))
                throw jqLiteMinErr("nosel", "Looking up elements via selectors is not supported by jqLite! See: http://docs.angularjs.org/api/angular.element");
            return new JQLite(element)
        }
        argIsString ? jqLiteAddNodes(this, jqLiteParseHTML(element)) : jqLiteAddNodes(this, element)
    }
    function jqLiteClone(element) {
        return element.cloneNode(!0)
    }
    function jqLiteDealoc(element, onlyDescendants) {
        if (onlyDescendants || jqLiteRemoveData(element), element.querySelectorAll)
            for (var descendants = element.querySelectorAll("*"), i = 0, l = descendants.length; l > i; i++)
                jqLiteRemoveData(descendants[i])
    }
    function jqLiteOff(element, type, fn, unsupported) {
        if (isDefined(unsupported))
            throw jqLiteMinErr("offargs", "jqLite#off() does not support the `selector` argument");
        var expandoStore = jqLiteExpandoStore(element), events = expandoStore && expandoStore.events, handle = expandoStore && expandoStore.handle;
        if (handle)
            if (type)
                forEach(type.split(" "), function (type) {
                    if (isDefined(fn)) {
                        var listenerFns = events[type];
                        if (arrayRemove(listenerFns || [], fn), listenerFns && listenerFns.length > 0)
                            return
                    }
                    removeEventListenerFn(element, type, handle), delete events[type]
                });
            else
                for (type in events)
                    "$destroy" !== type && removeEventListenerFn(element, type, handle), delete events[type]
    }
    function jqLiteRemoveData(element, name) {
        var expandoId = element.ng339, expandoStore = expandoId && jqCache[expandoId];
        if (expandoStore) {
            if (name)
                return void delete expandoStore.data[name];
            expandoStore.handle && (expandoStore.events.$destroy && expandoStore.handle({}, "$destroy"), jqLiteOff(element)), delete jqCache[expandoId], element.ng339 = undefined
        }
    }
    function jqLiteExpandoStore(element, createIfNecessary) {
        var expandoId = element.ng339, expandoStore = expandoId && jqCache[expandoId];
        return createIfNecessary && !expandoStore && (element.ng339 = expandoId = jqNextId(), expandoStore = jqCache[expandoId] = {events: {}, data: {}, handle: undefined}), expandoStore
    }
    function jqLiteData(element, key, value) {
        if (jqLiteAcceptsData(element)) {
            var isSimpleSetter = isDefined(value), isSimpleGetter = !isSimpleSetter && key && !isObject(key), massGetter = !key, expandoStore = jqLiteExpandoStore(element, !isSimpleGetter), data = expandoStore && expandoStore.data;
            if (isSimpleSetter)
                data[key] = value;
            else {
                if (massGetter)
                    return data;
                if (isSimpleGetter)
                    return data && data[key];
                extend(data, key)
            }
        }
    }
    function jqLiteHasClass(element, selector) {
        return element.getAttribute ? (" " + (element.getAttribute("class") || "") + " ").replace(/[\n\t]/g, " ").indexOf(" " + selector + " ") > -1 : !1
    }
    function jqLiteRemoveClass(element, cssClasses) {
        cssClasses && element.setAttribute && forEach(cssClasses.split(" "), function (cssClass) {
            element.setAttribute("class", trim((" " + (element.getAttribute("class") || "") + " ").replace(/[\n\t]/g, " ").replace(" " + trim(cssClass) + " ", " ")))
        })
    }
    function jqLiteAddClass(element, cssClasses) {
        if (cssClasses && element.setAttribute) {
            var existingClasses = (" " + (element.getAttribute("class") || "") + " ").replace(/[\n\t]/g, " ");
            forEach(cssClasses.split(" "), function (cssClass) {
                cssClass = trim(cssClass), -1 === existingClasses.indexOf(" " + cssClass + " ") && (existingClasses += cssClass + " ")
            }), element.setAttribute("class", trim(existingClasses))
        }
    }
    function jqLiteAddNodes(root, elements) {
        if (elements)
            if (elements.nodeType)
                root[root.length++] = elements;
            else {
                var length = elements.length;
                if ("number" == typeof length && elements.window !== elements) {
                    if (length)
                        for (var i = 0; length > i; i++)
                            root[root.length++] = elements[i]
                } else
                    root[root.length++] = elements
            }
    }
    function jqLiteController(element, name) {
        return jqLiteInheritedData(element, "$" + (name || "ngController") + "Controller")
    }
    function jqLiteInheritedData(element, name, value) {
        element.nodeType == NODE_TYPE_DOCUMENT && (element = element.documentElement);
        for (var names = isArray(name) ? name : [name]; element; ) {
            for (var i = 0, ii = names.length; ii > i; i++)
                if ((value = jqLite.data(element, names[i])) !== undefined)
                    return value;
            element = element.parentNode || element.nodeType === NODE_TYPE_DOCUMENT_FRAGMENT && element.host
        }
    }
    function jqLiteEmpty(element) {
        for (jqLiteDealoc(element, !0); element.firstChild; )
            element.removeChild(element.firstChild)
    }
    function jqLiteRemove(element, keepData) {
        keepData || jqLiteDealoc(element);
        var parent = element.parentNode;
        parent && parent.removeChild(element)
    }
    function jqLiteDocumentLoaded(action, win) {
        win = win || window, "complete" === win.document.readyState ? win.setTimeout(action) : jqLite(win).on("load", action)
    }
    function getBooleanAttrName(element, name) {
        var booleanAttr = BOOLEAN_ATTR[name.toLowerCase()];
        return booleanAttr && BOOLEAN_ELEMENTS[nodeName_(element)] && booleanAttr
    }
    function getAliasedAttrName(element, name) {
        var nodeName = element.nodeName;
        return("INPUT" === nodeName || "TEXTAREA" === nodeName) && ALIASED_ATTR[name]
    }
    function createEventHandler(element, events) {
        var eventHandler = function (event, type) {
            event.isDefaultPrevented = function () {
                return event.defaultPrevented
            };
            var eventFns = events[type || event.type], eventFnsLength = eventFns ? eventFns.length : 0;
            if (eventFnsLength) {
                if (isUndefined(event.immediatePropagationStopped)) {
                    var originalStopImmediatePropagation = event.stopImmediatePropagation;
                    event.stopImmediatePropagation = function () {
                        event.immediatePropagationStopped = !0, event.stopPropagation && event.stopPropagation(), originalStopImmediatePropagation && originalStopImmediatePropagation.call(event)
                    }
                }
                event.isImmediatePropagationStopped = function () {
                    return event.immediatePropagationStopped === !0
                }, eventFnsLength > 1 && (eventFns = shallowCopy(eventFns));
                for (var i = 0; eventFnsLength > i; i++)
                    event.isImmediatePropagationStopped() || eventFns[i].call(element, event)
            }
        };
        return eventHandler.elem = element, eventHandler
    }
    function hashKey(obj, nextUidFn) {
        var key = obj && obj.$$hashKey;
        if (key)
            return"function" == typeof key && (key = obj.$$hashKey()), key;
        var objType = typeof obj;
        return key = "function" == objType || "object" == objType && null !== obj ? obj.$$hashKey = objType + ":" + (nextUidFn || nextUid)() : objType + ":" + obj
    }
    function HashMap(array, isolatedUid) {
        if (isolatedUid) {
            var uid = 0;
            this.nextUid = function () {
                return++uid
            }
        }
        forEach(array, this.put, this)
    }
    function anonFn(fn) {
        var fnText = fn.toString().replace(STRIP_COMMENTS, ""), args = fnText.match(FN_ARGS);
        return args ? "function(" + (args[1] || "").replace(/[\s\r\n]+/, " ") + ")" : "fn"
    }
    function annotate(fn, strictDi, name) {
        var $inject, fnText, argDecl, last;
        if ("function" == typeof fn) {
            if (!($inject = fn.$inject)) {
                if ($inject = [], fn.length) {
                    if (strictDi)
                        throw isString(name) && name || (name = fn.name || anonFn(fn)), $injectorMinErr("strictdi", "{0} is not using explicit annotation and cannot be invoked in strict mode", name);
                    fnText = fn.toString().replace(STRIP_COMMENTS, ""), argDecl = fnText.match(FN_ARGS), forEach(argDecl[1].split(FN_ARG_SPLIT), function (arg) {
                        arg.replace(FN_ARG, function (all, underscore, name) {
                            $inject.push(name)
                        })
                    })
                }
                fn.$inject = $inject
            }
        } else
            isArray(fn) ? (last = fn.length - 1, assertArgFn(fn[last], "fn"), $inject = fn.slice(0, last)) : assertArgFn(fn, "fn", !0);
        return $inject
    }
    function createInjector(modulesToLoad, strictDi) {
        function supportObject(delegate) {
            return function (key, value) {
                return isObject(key) ? void forEach(key, reverseParams(delegate)) : delegate(key, value)
            }
        }
        function provider(name, provider_) {
            if (assertNotHasOwnProperty(name, "service"), (isFunction(provider_) || isArray(provider_)) && (provider_ = providerInjector.instantiate(provider_)), !provider_.$get)
                throw $injectorMinErr("pget", "Provider '{0}' must define $get factory method.", name);
            return providerCache[name + providerSuffix] = provider_
        }
        function enforceReturnValue(name, factory) {
            return function () {
                var result = instanceInjector.invoke(factory, this, undefined, name);
                if (isUndefined(result))
                    throw $injectorMinErr("undef", "Provider '{0}' must return a value from $get factory method.", name);
                return result
            }
        }
        function factory(name, factoryFn, enforce) {
            return provider(name, {$get: enforce !== !1 ? enforceReturnValue(name, factoryFn) : factoryFn})
        }
        function service(name, constructor) {
            return factory(name, ["$injector", function ($injector) {
                    return $injector.instantiate(constructor)
                }])
        }
        function value(name, val) {
            return factory(name, valueFn(val), !1)
        }
        function constant(name, value) {
            assertNotHasOwnProperty(name, "constant"), providerCache[name] = value, instanceCache[name] = value
        }
        function decorator(serviceName, decorFn) {
            var origProvider = providerInjector.get(serviceName + providerSuffix), orig$get = origProvider.$get;
            origProvider.$get = function () {
                var origInstance = instanceInjector.invoke(orig$get, origProvider);
                return instanceInjector.invoke(decorFn, null, {$delegate: origInstance})
            }
        }
        function loadModules(modulesToLoad) {
            var moduleFn, runBlocks = [];
            return forEach(modulesToLoad, function (module) {
                function runInvokeQueue(queue) {
                    var i, ii;
                    for (i = 0, ii = queue.length; ii > i; i++) {
                        var invokeArgs = queue[i], provider = providerInjector.get(invokeArgs[0]);
                        provider[invokeArgs[1]].apply(provider, invokeArgs[2])
                    }
                }
                if (!loadedModules.get(module)) {
                    loadedModules.put(module, !0);
                    try {
                        isString(module) ? (moduleFn = angularModule(module), runBlocks = runBlocks.concat(loadModules(moduleFn.requires)).concat(moduleFn._runBlocks), runInvokeQueue(moduleFn._invokeQueue), runInvokeQueue(moduleFn._configBlocks)) : isFunction(module) ? runBlocks.push(providerInjector.invoke(module)) : isArray(module) ? runBlocks.push(providerInjector.invoke(module)) : assertArgFn(module, "module")
                    } catch (e) {
                        throw isArray(module) && (module = module[module.length - 1]), e.message && e.stack && -1 == e.stack.indexOf(e.message) && (e = e.message + "\n" + e.stack), $injectorMinErr("modulerr", "Failed to instantiate module {0} due to:\n{1}", module, e.stack || e.message || e)
                    }
                }
            }), runBlocks
        }
        function createInternalInjector(cache, factory) {
            function getService(serviceName) {
                if (cache.hasOwnProperty(serviceName)) {
                    if (cache[serviceName] === INSTANTIATING)
                        throw $injectorMinErr("cdep", "Circular dependency found: {0}", serviceName + " <- " + path.join(" <- "));
                    return cache[serviceName]
                }
                try {
                    return path.unshift(serviceName), cache[serviceName] = INSTANTIATING, cache[serviceName] = factory(serviceName)
                } catch (err) {
                    throw cache[serviceName] === INSTANTIATING && delete cache[serviceName], err
                } finally {
                    path.shift()
                }
            }
            function invoke(fn, self, locals, serviceName) {
                "string" == typeof locals && (serviceName = locals, locals = null);
                var length, i, key, args = [], $inject = annotate(fn, strictDi, serviceName);
                for (i = 0, length = $inject.length; length > i; i++) {
                    if (key = $inject[i], "string" != typeof key)
                        throw $injectorMinErr("itkn", "Incorrect injection token! Expected service name as string, got {0}", key);
                    args.push(locals && locals.hasOwnProperty(key) ? locals[key] : getService(key))
                }
                return isArray(fn) && (fn = fn[length]), fn.apply(self, args)
            }
            function instantiate(Type, locals, serviceName) {
                var instance = Object.create((isArray(Type) ? Type[Type.length - 1] : Type).prototype), returnedValue = invoke(Type, instance, locals, serviceName);
                return isObject(returnedValue) || isFunction(returnedValue) ? returnedValue : instance
            }
            return{invoke: invoke, instantiate: instantiate, get: getService, annotate: annotate, has: function (name) {
                    return providerCache.hasOwnProperty(name + providerSuffix) || cache.hasOwnProperty(name)
                }}
        }
        strictDi = strictDi === !0;
        var INSTANTIATING = {}, providerSuffix = "Provider", path = [], loadedModules = new HashMap([], !0), providerCache = {$provide: {provider: supportObject(provider), factory: supportObject(factory), service: supportObject(service), value: supportObject(value), constant: supportObject(constant), decorator: decorator}}, providerInjector = providerCache.$injector = createInternalInjector(providerCache, function () {
            throw $injectorMinErr("unpr", "Unknown provider: {0}", path.join(" <- "))
        }), instanceCache = {}, instanceInjector = instanceCache.$injector = createInternalInjector(instanceCache, function (servicename) {
            var provider = providerInjector.get(servicename + providerSuffix);
            return instanceInjector.invoke(provider.$get, provider, undefined, servicename)
        });
        return forEach(loadModules(modulesToLoad), function (fn) {
            instanceInjector.invoke(fn || noop)
        }), instanceInjector
    }
    function $AnchorScrollProvider() {
        var autoScrollingEnabled = !0;
        this.disableAutoScrolling = function () {
            autoScrollingEnabled = !1
        }, this.$get = ["$window", "$location", "$rootScope", function ($window, $location, $rootScope) {
                function getFirstAnchor(list) {
                    var result = null;
                    return Array.prototype.some.call(list, function (element) {
                        return"a" === nodeName_(element) ? (result = element, !0) : void 0
                    }), result
                }
                function getYOffset() {
                    var offset = scroll.yOffset;
                    if (isFunction(offset))
                        offset = offset();
                    else if (isElement(offset)) {
                        var elem = offset[0], style = $window.getComputedStyle(elem);
                        offset = "fixed" !== style.position ? 0 : elem.getBoundingClientRect().bottom
                    } else
                        isNumber(offset) || (offset = 0);
                    return offset
                }
                function scrollTo(elem) {
                    if (elem) {
                        elem.scrollIntoView();
                        var offset = getYOffset();
                        if (offset) {
                            var elemTop = elem.getBoundingClientRect().top;
                            $window.scrollBy(0, elemTop - offset)
                        }
                    } else
                        $window.scrollTo(0, 0)
                }
                function scroll() {
                    var elm, hash = $location.hash();
                    hash ? (elm = document.getElementById(hash)) ? scrollTo(elm) : (elm = getFirstAnchor(document.getElementsByName(hash))) ? scrollTo(elm) : "top" === hash && scrollTo(null) : scrollTo(null)
                }
                var document = $window.document;
                return autoScrollingEnabled && $rootScope.$watch(function () {
                    return $location.hash()
                }, function (newVal, oldVal) {
                    (newVal !== oldVal || "" !== newVal) && jqLiteDocumentLoaded(function () {
                        $rootScope.$evalAsync(scroll)
                    })
                }), scroll
            }]
    }
    function $$AsyncCallbackProvider() {
        this.$get = ["$$rAF", "$timeout", function ($$rAF, $timeout) {
                return $$rAF.supported ? function (fn) {
                    return $$rAF(fn)
                } : function (fn) {
                    return $timeout(fn, 0, !1)
                }
            }]
    }
    function Browser(window, document, $log, $sniffer) {
        function completeOutstandingRequest(fn) {
            try {
                fn.apply(null, sliceArgs(arguments, 1))
            } finally {
                if (outstandingRequestCount--, 0 === outstandingRequestCount)
                    for (; outstandingRequestCallbacks.length; )
                        try {
                            outstandingRequestCallbacks.pop()()
                        } catch (e) {
                            $log.error(e)
                        }
            }
        }
        function startPoller(interval, setTimeout) {
            !function check() {
                forEach(pollFns, function (pollFn) {
                    pollFn()
                }), pollTimeout = setTimeout(check, interval)
            }()
        }
        function cacheStateAndFireUrlChange() {
            cacheState(), fireUrlChange()
        }
        function cacheState() {
            cachedState = window.history.state, cachedState = isUndefined(cachedState) ? null : cachedState, equals(cachedState, lastCachedState) && (cachedState = lastCachedState), lastCachedState = cachedState
        }
        function fireUrlChange() {
            (lastBrowserUrl !== self.url() || lastHistoryState !== cachedState) && (lastBrowserUrl = self.url(), lastHistoryState = cachedState, forEach(urlChangeListeners, function (listener) {
                listener(self.url(), cachedState)
            }))
        }
        function safeDecodeURIComponent(str) {
            try {
                return decodeURIComponent(str)
            } catch (e) {
                return str
            }
        }
        var self = this, rawDocument = document[0], location = window.location, history = window.history, setTimeout = window.setTimeout, clearTimeout = window.clearTimeout, pendingDeferIds = {};
        self.isMock = !1;
        var outstandingRequestCount = 0, outstandingRequestCallbacks = [];
        self.$$completeOutstandingRequest = completeOutstandingRequest, self.$$incOutstandingRequestCount = function () {
            outstandingRequestCount++
        }, self.notifyWhenNoOutstandingRequests = function (callback) {
            forEach(pollFns, function (pollFn) {
                pollFn()
            }), 0 === outstandingRequestCount ? callback() : outstandingRequestCallbacks.push(callback)
        };
        var pollTimeout, pollFns = [];
        self.addPollFn = function (fn) {
            return isUndefined(pollTimeout) && startPoller(100, setTimeout), pollFns.push(fn), fn
        };
        var cachedState, lastHistoryState, lastBrowserUrl = location.href, baseElement = document.find("base"), reloadLocation = null;
        cacheState(), lastHistoryState = cachedState, self.url = function (url, replace, state) {
            if (isUndefined(state) && (state = null), location !== window.location && (location = window.location), history !== window.history && (history = window.history), url) {
                var sameState = lastHistoryState === state;
                if (lastBrowserUrl === url && (!$sniffer.history || sameState))
                    return self;
                var sameBase = lastBrowserUrl && stripHash(lastBrowserUrl) === stripHash(url);
                return lastBrowserUrl = url, lastHistoryState = state, !$sniffer.history || sameBase && sameState ? (sameBase || (reloadLocation = url), replace ? location.replace(url) : location.href = url) : (history[replace ? "replaceState" : "pushState"](state, "", url), cacheState(), lastHistoryState = cachedState), self
            }
            return reloadLocation || location.href.replace(/%27/g, "'")
        }, self.state = function () {
            return cachedState
        };
        var urlChangeListeners = [], urlChangeInit = !1, lastCachedState = null;
        self.onUrlChange = function (callback) {
            return urlChangeInit || ($sniffer.history && jqLite(window).on("popstate", cacheStateAndFireUrlChange), jqLite(window).on("hashchange", cacheStateAndFireUrlChange), urlChangeInit = !0), urlChangeListeners.push(callback), callback
        }, self.$$checkUrlChange = fireUrlChange, self.baseHref = function () {
            var href = baseElement.attr("href");
            return href ? href.replace(/^(https?\:)?\/\/[^\/]*/, "") : ""
        };
        var lastCookies = {}, lastCookieString = "", cookiePath = self.baseHref();
        self.cookies = function (name, value) {
            var cookieLength, cookieArray, cookie, i, index;
            if (!name) {
                if (rawDocument.cookie !== lastCookieString)
                    for (lastCookieString = rawDocument.cookie, cookieArray = lastCookieString.split("; "), lastCookies = {}, i = 0; i < cookieArray.length; i++)
                        cookie = cookieArray[i], index = cookie.indexOf("="), index > 0 && (name = safeDecodeURIComponent(cookie.substring(0, index)), lastCookies[name] === undefined && (lastCookies[name] = safeDecodeURIComponent(cookie.substring(index + 1))));
                return lastCookies
            }
            value === undefined ? rawDocument.cookie = encodeURIComponent(name) + "=;path=" + cookiePath + ";expires=Thu, 01 Jan 1970 00:00:00 GMT" : isString(value) && (cookieLength = (rawDocument.cookie = encodeURIComponent(name) + "=" + encodeURIComponent(value) + ";path=" + cookiePath).length + 1, cookieLength > 4096 && $log.warn("Cookie '" + name + "' possibly not set or overflowed because it was too large (" + cookieLength + " > 4096 bytes)!"))
        }, self.defer = function (fn, delay) {
            var timeoutId;
            return outstandingRequestCount++, timeoutId = setTimeout(function () {
                delete pendingDeferIds[timeoutId], completeOutstandingRequest(fn)
            }, delay || 0), pendingDeferIds[timeoutId] = !0, timeoutId
        }, self.defer.cancel = function (deferId) {
            return pendingDeferIds[deferId] ? (delete pendingDeferIds[deferId], clearTimeout(deferId), completeOutstandingRequest(noop), !0) : !1
        }
    }
    function $BrowserProvider() {
        this.$get = ["$window", "$log", "$sniffer", "$document", function ($window, $log, $sniffer, $document) {
                return new Browser($window, $document, $log, $sniffer)
            }]
    }
    function $CacheFactoryProvider() {
        this.$get = function () {
            function cacheFactory(cacheId, options) {
                function refresh(entry) {
                    entry != freshEnd && (staleEnd ? staleEnd == entry && (staleEnd = entry.n) : staleEnd = entry, link(entry.n, entry.p), link(entry, freshEnd), freshEnd = entry, freshEnd.n = null)
                }
                function link(nextEntry, prevEntry) {
                    nextEntry != prevEntry && (nextEntry && (nextEntry.p = prevEntry), prevEntry && (prevEntry.n = nextEntry))
                }
                if (cacheId in caches)
                    throw minErr("$cacheFactory")("iid", "CacheId '{0}' is already taken!", cacheId);
                var size = 0, stats = extend({}, options, {id: cacheId}), data = {}, capacity = options && options.capacity || Number.MAX_VALUE, lruHash = {}, freshEnd = null, staleEnd = null;
                return caches[cacheId] = {put: function (key, value) {
                        if (capacity < Number.MAX_VALUE) {
                            var lruEntry = lruHash[key] || (lruHash[key] = {key: key});
                            refresh(lruEntry)
                        }
                        if (!isUndefined(value))
                            return key in data || size++, data[key] = value, size > capacity && this.remove(staleEnd.key), value
                    }, get: function (key) {
                        if (capacity < Number.MAX_VALUE) {
                            var lruEntry = lruHash[key];
                            if (!lruEntry)
                                return;
                            refresh(lruEntry)
                        }
                        return data[key]
                    }, remove: function (key) {
                        if (capacity < Number.MAX_VALUE) {
                            var lruEntry = lruHash[key];
                            if (!lruEntry)
                                return;
                            lruEntry == freshEnd && (freshEnd = lruEntry.p), lruEntry == staleEnd && (staleEnd = lruEntry.n), link(lruEntry.n, lruEntry.p), delete lruHash[key]
                        }
                        delete data[key], size--
                    }, removeAll: function () {
                        data = {}, size = 0, lruHash = {}, freshEnd = staleEnd = null
                    }, destroy: function () {
                        data = null, stats = null, lruHash = null, delete caches[cacheId]
                    }, info: function () {
                        return extend({}, stats, {size: size})
                    }}
            }
            var caches = {};
            return cacheFactory.info = function () {
                var info = {};
                return forEach(caches, function (cache, cacheId) {
                    info[cacheId] = cache.info()
                }), info
            }, cacheFactory.get = function (cacheId) {
                return caches[cacheId]
            }, cacheFactory
        }
    }
    function $TemplateCacheProvider() {
        this.$get = ["$cacheFactory", function ($cacheFactory) {
                return $cacheFactory("templates")
            }]
    }
    function $CompileProvider($provide, $$sanitizeUriProvider) {
        function parseIsolateBindings(scope, directiveName) {
            var LOCAL_REGEXP = /^\s*([@&]|=(\*?))(\??)\s*(\w*)\s*$/, bindings = {};
            return forEach(scope, function (definition, scopeName) {
                var match = definition.match(LOCAL_REGEXP);
                if (!match)
                    throw $compileMinErr("iscp", "Invalid isolate scope definition for directive '{0}'. Definition: {... {1}: '{2}' ...}", directiveName, scopeName, definition);
                bindings[scopeName] = {mode: match[1][0], collection: "*" === match[2], optional: "?" === match[3], attrName: match[4] || scopeName}
            }), bindings
        }
        var hasDirectives = {}, Suffix = "Directive", COMMENT_DIRECTIVE_REGEXP = /^\s*directive\:\s*([\w\-]+)\s+(.*)$/, CLASS_DIRECTIVE_REGEXP = /(([\w\-]+)(?:\:([^;]+))?;?)/, ALL_OR_NOTHING_ATTRS = makeMap("ngSrc,ngSrcset,src,srcset"), REQUIRE_PREFIX_REGEXP = /^(?:(\^\^?)?(\?)?(\^\^?)?)?/, EVENT_HANDLER_ATTR_REGEXP = /^(on[a-z]+|formaction)$/;
        this.directive = function registerDirective(name, directiveFactory) {
            return assertNotHasOwnProperty(name, "directive"), isString(name) ? (assertArg(directiveFactory, "directiveFactory"), hasDirectives.hasOwnProperty(name) || (hasDirectives[name] = [], $provide.factory(name + Suffix, ["$injector", "$exceptionHandler", function ($injector, $exceptionHandler) {
                    var directives = [];
                    return forEach(hasDirectives[name], function (directiveFactory, index) {
                        try {
                            var directive = $injector.invoke(directiveFactory);
                            isFunction(directive) ? directive = {compile: valueFn(directive)} : !directive.compile && directive.link && (directive.compile = valueFn(directive.link)), directive.priority = directive.priority || 0, directive.index = index, directive.name = directive.name || name, directive.require = directive.require || directive.controller && directive.name, directive.restrict = directive.restrict || "EA", isObject(directive.scope) && (directive.$$isolateBindings = parseIsolateBindings(directive.scope, directive.name)), directives.push(directive)
                        } catch (e) {
                            $exceptionHandler(e)
                        }
                    }), directives
                }])), hasDirectives[name].push(directiveFactory)) : forEach(name, reverseParams(registerDirective)), this
        }, this.aHrefSanitizationWhitelist = function (regexp) {
            return isDefined(regexp) ? ($$sanitizeUriProvider.aHrefSanitizationWhitelist(regexp), this) : $$sanitizeUriProvider.aHrefSanitizationWhitelist()
        }, this.imgSrcSanitizationWhitelist = function (regexp) {
            return isDefined(regexp) ? ($$sanitizeUriProvider.imgSrcSanitizationWhitelist(regexp), this) : $$sanitizeUriProvider.imgSrcSanitizationWhitelist()
        };
        var debugInfoEnabled = !0;
        this.debugInfoEnabled = function (enabled) {
            return isDefined(enabled) ? (debugInfoEnabled = enabled, this) : debugInfoEnabled
        }, this.$get = ["$injector", "$interpolate", "$exceptionHandler", "$templateRequest", "$parse", "$controller", "$rootScope", "$document", "$sce", "$animate", "$$sanitizeUri", function ($injector, $interpolate, $exceptionHandler, $templateRequest, $parse, $controller, $rootScope, $document, $sce, $animate, $$sanitizeUri) {
                function safeAddClass($element, className) {
                    try {
                        $element.addClass(className)
                    } catch (e) {
                    }
                }
                function compile($compileNodes, transcludeFn, maxPriority, ignoreDirective, previousCompileContext) {
                    $compileNodes instanceof jqLite || ($compileNodes = jqLite($compileNodes)), forEach($compileNodes, function (node, index) {
                        node.nodeType == NODE_TYPE_TEXT && node.nodeValue.match(/\S+/) && ($compileNodes[index] = jqLite(node).wrap("<span></span>").parent()[0])
                    });
                    var compositeLinkFn = compileNodes($compileNodes, transcludeFn, $compileNodes, maxPriority, ignoreDirective, previousCompileContext);
                    compile.$$addScopeClass($compileNodes);
                    var namespace = null;
                    return function (scope, cloneConnectFn, options) {
                        assertArg(scope, "scope"), options = options || {};
                        var parentBoundTranscludeFn = options.parentBoundTranscludeFn, transcludeControllers = options.transcludeControllers, futureParentElement = options.futureParentElement;
                        parentBoundTranscludeFn && parentBoundTranscludeFn.$$boundTransclude && (parentBoundTranscludeFn = parentBoundTranscludeFn.$$boundTransclude), namespace || (namespace = detectNamespaceForChildElements(futureParentElement));
                        var $linkNode;
                        if ($linkNode = "html" !== namespace ? jqLite(wrapTemplate(namespace, jqLite("<div>").append($compileNodes).html())) : cloneConnectFn ? JQLitePrototype.clone.call($compileNodes) : $compileNodes, transcludeControllers)
                            for (var controllerName in transcludeControllers)
                                $linkNode.data("$" + controllerName + "Controller", transcludeControllers[controllerName].instance);
                        return compile.$$addScopeInfo($linkNode, scope), cloneConnectFn && cloneConnectFn($linkNode, scope), compositeLinkFn && compositeLinkFn(scope, $linkNode, $linkNode, parentBoundTranscludeFn), $linkNode
                    }
                }
                function detectNamespaceForChildElements(parentElement) {
                    var node = parentElement && parentElement[0];
                    return node && "foreignobject" !== nodeName_(node) && node.toString().match(/SVG/) ? "svg" : "html"
                }
                function compileNodes(nodeList, transcludeFn, $rootElement, maxPriority, ignoreDirective, previousCompileContext) {
                    function compositeLinkFn(scope, nodeList, $rootElement, parentBoundTranscludeFn) {
                        var nodeLinkFn, childLinkFn, node, childScope, i, ii, idx, childBoundTranscludeFn, stableNodeList;
                        if (nodeLinkFnFound) {
                            var nodeListLength = nodeList.length;
                            for (stableNodeList = new Array(nodeListLength), i = 0; i < linkFns.length; i += 3)
                                idx = linkFns[i], stableNodeList[idx] = nodeList[idx]
                        } else
                            stableNodeList = nodeList;
                        for (i = 0, ii = linkFns.length; ii > i; )
                            node = stableNodeList[linkFns[i++]], nodeLinkFn = linkFns[i++], childLinkFn = linkFns[i++], nodeLinkFn ? (nodeLinkFn.scope ? (childScope = scope.$new(), compile.$$addScopeInfo(jqLite(node), childScope)) : childScope = scope, childBoundTranscludeFn = nodeLinkFn.transcludeOnThisElement ? createBoundTranscludeFn(scope, nodeLinkFn.transclude, parentBoundTranscludeFn, nodeLinkFn.elementTranscludeOnThisElement) : !nodeLinkFn.templateOnThisElement && parentBoundTranscludeFn ? parentBoundTranscludeFn : !parentBoundTranscludeFn && transcludeFn ? createBoundTranscludeFn(scope, transcludeFn) : null, nodeLinkFn(childLinkFn, childScope, node, $rootElement, childBoundTranscludeFn)) : childLinkFn && childLinkFn(scope, node.childNodes, undefined, parentBoundTranscludeFn)
                    }
                    for (var attrs, directives, nodeLinkFn, childNodes, childLinkFn, linkFnFound, nodeLinkFnFound, linkFns = [], i = 0; i < nodeList.length; i++)
                        attrs = new Attributes, directives = collectDirectives(nodeList[i], [], attrs, 0 === i ? maxPriority : undefined, ignoreDirective), nodeLinkFn = directives.length ? applyDirectivesToNode(directives, nodeList[i], attrs, transcludeFn, $rootElement, null, [], [], previousCompileContext) : null, nodeLinkFn && nodeLinkFn.scope && compile.$$addScopeClass(attrs.$$element), childLinkFn = nodeLinkFn && nodeLinkFn.terminal || !(childNodes = nodeList[i].childNodes) || !childNodes.length ? null : compileNodes(childNodes, nodeLinkFn ? (nodeLinkFn.transcludeOnThisElement || !nodeLinkFn.templateOnThisElement) && nodeLinkFn.transclude : transcludeFn), (nodeLinkFn || childLinkFn) && (linkFns.push(i, nodeLinkFn, childLinkFn), linkFnFound = !0, nodeLinkFnFound = nodeLinkFnFound || nodeLinkFn), previousCompileContext = null;
                    return linkFnFound ? compositeLinkFn : null
                }
                function createBoundTranscludeFn(scope, transcludeFn, previousBoundTranscludeFn) {
                    var boundTranscludeFn = function (transcludedScope, cloneFn, controllers, futureParentElement, containingScope) {
                        return transcludedScope || (transcludedScope = scope.$new(!1, containingScope), transcludedScope.$$transcluded = !0), transcludeFn(transcludedScope, cloneFn, {parentBoundTranscludeFn: previousBoundTranscludeFn, transcludeControllers: controllers, futureParentElement: futureParentElement})
                    };
                    return boundTranscludeFn
                }
                function collectDirectives(node, directives, attrs, maxPriority, ignoreDirective) {
                    var match, className, nodeType = node.nodeType, attrsMap = attrs.$attr;
                    switch (nodeType) {
                        case NODE_TYPE_ELEMENT:
                            addDirective(directives, directiveNormalize(nodeName_(node)), "E", maxPriority, ignoreDirective);
                            for (var attr, name, nName, ngAttrName, value, isNgAttr, nAttrs = node.attributes, j = 0, jj = nAttrs && nAttrs.length; jj > j; j++) {
                                var attrStartName = !1, attrEndName = !1;
                                attr = nAttrs[j], name = attr.name, value = trim(attr.value), ngAttrName = directiveNormalize(name), (isNgAttr = NG_ATTR_BINDING.test(ngAttrName)) && (name = snake_case(ngAttrName.substr(6), "-"));
                                var directiveNName = ngAttrName.replace(/(Start|End)$/, "");
                                directiveIsMultiElement(directiveNName) && ngAttrName === directiveNName + "Start" && (attrStartName = name, attrEndName = name.substr(0, name.length - 5) + "end", name = name.substr(0, name.length - 6)), nName = directiveNormalize(name.toLowerCase()), attrsMap[nName] = name, (isNgAttr || !attrs.hasOwnProperty(nName)) && (attrs[nName] = value, getBooleanAttrName(node, nName) && (attrs[nName] = !0)), addAttrInterpolateDirective(node, directives, value, nName, isNgAttr), addDirective(directives, nName, "A", maxPriority, ignoreDirective, attrStartName, attrEndName)
                            }
                            if (className = node.className, isString(className) && "" !== className)
                                for (; match = CLASS_DIRECTIVE_REGEXP.exec(className); )
                                    nName = directiveNormalize(match[2]), addDirective(directives, nName, "C", maxPriority, ignoreDirective) && (attrs[nName] = trim(match[3])), className = className.substr(match.index + match[0].length);
                            break;
                        case NODE_TYPE_TEXT:
                            addTextInterpolateDirective(directives, node.nodeValue);
                            break;
                        case NODE_TYPE_COMMENT:
                            try {
                                match = COMMENT_DIRECTIVE_REGEXP.exec(node.nodeValue), match && (nName = directiveNormalize(match[1]), addDirective(directives, nName, "M", maxPriority, ignoreDirective) && (attrs[nName] = trim(match[2])))
                            } catch (e) {
                            }
                    }
                    return directives.sort(byPriority), directives
                }
                function groupScan(node, attrStart, attrEnd) {
                    var nodes = [], depth = 0;
                    if (attrStart && node.hasAttribute && node.hasAttribute(attrStart)) {
                        do {
                            if (!node)
                                throw $compileMinErr("uterdir", "Unterminated attribute, found '{0}' but no matching '{1}' found.", attrStart, attrEnd);
                            node.nodeType == NODE_TYPE_ELEMENT && (node.hasAttribute(attrStart) && depth++, node.hasAttribute(attrEnd) && depth--), nodes.push(node), node = node.nextSibling
                        } while (depth > 0)
                    } else
                        nodes.push(node);
                    return jqLite(nodes)
                }
                function groupElementsLinkFnWrapper(linkFn, attrStart, attrEnd) {
                    return function (scope, element, attrs, controllers, transcludeFn) {
                        return element = groupScan(element[0], attrStart, attrEnd), linkFn(scope, element, attrs, controllers, transcludeFn)
                    }
                }
                function applyDirectivesToNode(directives, compileNode, templateAttrs, transcludeFn, jqCollection, originalReplaceDirective, preLinkFns, postLinkFns, previousCompileContext) {
                    function addLinkFns(pre, post, attrStart, attrEnd) {
                        pre && (attrStart && (pre = groupElementsLinkFnWrapper(pre, attrStart, attrEnd)), pre.require = directive.require, pre.directiveName = directiveName, (newIsolateScopeDirective === directive || directive.$$isolateScope) && (pre = cloneAndAnnotateFn(pre, {isolateScope: !0})), preLinkFns.push(pre)), post && (attrStart && (post = groupElementsLinkFnWrapper(post, attrStart, attrEnd)), post.require = directive.require, post.directiveName = directiveName, (newIsolateScopeDirective === directive || directive.$$isolateScope) && (post = cloneAndAnnotateFn(post, {isolateScope: !0})), postLinkFns.push(post))
                    }
                    function getControllers(directiveName, require, $element, elementControllers) {
                        var value, match, retrievalMethod = "data", optional = !1, $searchElement = $element;
                        if (isString(require)) {
                            if (match = require.match(REQUIRE_PREFIX_REGEXP), require = require.substring(match[0].length), match[3] && (match[1] ? match[3] = null : match[1] = match[3]), "^" === match[1] ? retrievalMethod = "inheritedData" : "^^" === match[1] && (retrievalMethod = "inheritedData", $searchElement = $element.parent()), "?" === match[2] && (optional = !0), value = null, elementControllers && "data" === retrievalMethod && (value = elementControllers[require]) && (value = value.instance), value = value || $searchElement[retrievalMethod]("$" + require + "Controller"), !value && !optional)
                                throw $compileMinErr("ctreq", "Controller '{0}', required by directive '{1}', can't be found!", require, directiveName);
                            return value || null
                        }
                        return isArray(require) && (value = [], forEach(require, function (require) {
                            value.push(getControllers(directiveName, require, $element, elementControllers))
                        })), value
                    }
                    function nodeLinkFn(childLinkFn, scope, linkNode, $rootElement, boundTranscludeFn) {
                        function controllersBoundTransclude(scope, cloneAttachFn, futureParentElement) {
                            var transcludeControllers;
                            return isScope(scope) || (futureParentElement = cloneAttachFn, cloneAttachFn = scope, scope = undefined), hasElementTranscludeDirective && (transcludeControllers = elementControllers), futureParentElement || (futureParentElement = hasElementTranscludeDirective ? $element.parent() : $element), boundTranscludeFn(scope, cloneAttachFn, transcludeControllers, futureParentElement, scopeToChild)
                        }
                        var i, ii, linkFn, controller, isolateScope, elementControllers, transcludeFn, $element, attrs;
                        if (compileNode === linkNode ? (attrs = templateAttrs, $element = templateAttrs.$$element) : ($element = jqLite(linkNode), attrs = new Attributes($element, templateAttrs)), newIsolateScopeDirective && (isolateScope = scope.$new(!0)), boundTranscludeFn && (transcludeFn = controllersBoundTransclude, transcludeFn.$$boundTransclude = boundTranscludeFn), controllerDirectives && (controllers = {}, elementControllers = {}, forEach(controllerDirectives, function (directive) {
                            var controllerInstance, locals = {$scope: directive === newIsolateScopeDirective || directive.$$isolateScope ? isolateScope : scope, $element: $element, $attrs: attrs, $transclude: transcludeFn};
                            controller = directive.controller, "@" == controller && (controller = attrs[directive.name]), controllerInstance = $controller(controller, locals, !0, directive.controllerAs), elementControllers[directive.name] = controllerInstance, hasElementTranscludeDirective || $element.data("$" + directive.name + "Controller", controllerInstance.instance), controllers[directive.name] = controllerInstance
                        })), newIsolateScopeDirective) {
                            compile.$$addScopeInfo($element, isolateScope, !0, !(templateDirective && (templateDirective === newIsolateScopeDirective || templateDirective === newIsolateScopeDirective.$$originalDirective))), compile.$$addScopeClass($element, !0);
                            var isolateScopeController = controllers && controllers[newIsolateScopeDirective.name], isolateBindingContext = isolateScope;
                            isolateScopeController && isolateScopeController.identifier && newIsolateScopeDirective.bindToController === !0 && (isolateBindingContext = isolateScopeController.instance), forEach(isolateScope.$$isolateBindings = newIsolateScopeDirective.$$isolateBindings, function (definition, scopeName) {
                                var lastValue, parentGet, parentSet, compare, attrName = definition.attrName, optional = definition.optional, mode = definition.mode;
                                switch (mode) {
                                    case"@":
                                        attrs.$observe(attrName, function (value) {
                                            isolateBindingContext[scopeName] = value
                                        }), attrs.$$observers[attrName].$$scope = scope, attrs[attrName] && (isolateBindingContext[scopeName] = $interpolate(attrs[attrName])(scope));
                                        break;
                                    case"=":
                                        if (optional && !attrs[attrName])
                                            return;
                                        parentGet = $parse(attrs[attrName]), compare = parentGet.literal ? equals : function (a, b) {
                                            return a === b || a !== a && b !== b
                                        }, parentSet = parentGet.assign || function () {
                                            throw lastValue = isolateBindingContext[scopeName] = parentGet(scope), $compileMinErr("nonassign", "Expression '{0}' used with directive '{1}' is non-assignable!", attrs[attrName], newIsolateScopeDirective.name)
                                        }, lastValue = isolateBindingContext[scopeName] = parentGet(scope);
                                        var parentValueWatch = function (parentValue) {
                                            return compare(parentValue, isolateBindingContext[scopeName]) || (compare(parentValue, lastValue) ? parentSet(scope, parentValue = isolateBindingContext[scopeName]) : isolateBindingContext[scopeName] = parentValue), lastValue = parentValue
                                        };
                                        parentValueWatch.$stateful = !0;
                                        var unwatch;
                                        unwatch = definition.collection ? scope.$watchCollection(attrs[attrName], parentValueWatch) : scope.$watch($parse(attrs[attrName], parentValueWatch), null, parentGet.literal), isolateScope.$on("$destroy", unwatch);
                                        break;
                                    case"&":
                                        parentGet = $parse(attrs[attrName]), isolateBindingContext[scopeName] = function (locals) {
                                            return parentGet(scope, locals)
                                        }
                                    }
                            })
                        }
                        for (controllers && (forEach(controllers, function (controller) {
                            controller()
                        }), controllers = null), i = 0, ii = preLinkFns.length; ii > i; i++)
                            linkFn = preLinkFns[i], invokeLinkFn(linkFn, linkFn.isolateScope ? isolateScope : scope, $element, attrs, linkFn.require && getControllers(linkFn.directiveName, linkFn.require, $element, elementControllers), transcludeFn);
                        var scopeToChild = scope;
                        for (newIsolateScopeDirective && (newIsolateScopeDirective.template || null === newIsolateScopeDirective.templateUrl) && (scopeToChild = isolateScope), childLinkFn && childLinkFn(scopeToChild, linkNode.childNodes, undefined, boundTranscludeFn), i = postLinkFns.length - 1; i >= 0; i--)
                            linkFn = postLinkFns[i], invokeLinkFn(linkFn, linkFn.isolateScope ? isolateScope : scope, $element, attrs, linkFn.require && getControllers(linkFn.directiveName, linkFn.require, $element, elementControllers), transcludeFn)
                    }
                    previousCompileContext = previousCompileContext || {};
                    for (var newScopeDirective, controllers, directive, directiveName, $template, linkFn, directiveValue, terminalPriority = -Number.MAX_VALUE, controllerDirectives = previousCompileContext.controllerDirectives, newIsolateScopeDirective = previousCompileContext.newIsolateScopeDirective, templateDirective = previousCompileContext.templateDirective, nonTlbTranscludeDirective = previousCompileContext.nonTlbTranscludeDirective, hasTranscludeDirective = !1, hasTemplate = !1, hasElementTranscludeDirective = previousCompileContext.hasElementTranscludeDirective, $compileNode = templateAttrs.$$element = jqLite(compileNode), replaceDirective = originalReplaceDirective, childTranscludeFn = transcludeFn, i = 0, ii = directives.length; ii > i; i++) {
                        directive = directives[i];
                        var attrStart = directive.$$start, attrEnd = directive.$$end;
                        if (attrStart && ($compileNode = groupScan(compileNode, attrStart, attrEnd)), $template = undefined, terminalPriority > directive.priority)
                            break;
                        if ((directiveValue = directive.scope) && (directive.templateUrl || (isObject(directiveValue) ? (assertNoDuplicate("new/isolated scope", newIsolateScopeDirective || newScopeDirective, directive, $compileNode), newIsolateScopeDirective = directive) : assertNoDuplicate("new/isolated scope", newIsolateScopeDirective, directive, $compileNode)), newScopeDirective = newScopeDirective || directive), directiveName = directive.name, !directive.templateUrl && directive.controller && (directiveValue = directive.controller, controllerDirectives = controllerDirectives || {}, assertNoDuplicate("'" + directiveName + "' controller", controllerDirectives[directiveName], directive, $compileNode), controllerDirectives[directiveName] = directive), (directiveValue = directive.transclude) && (hasTranscludeDirective = !0, directive.$$tlb || (assertNoDuplicate("transclusion", nonTlbTranscludeDirective, directive, $compileNode), nonTlbTranscludeDirective = directive), "element" == directiveValue ? (hasElementTranscludeDirective = !0, terminalPriority = directive.priority, $template = $compileNode, $compileNode = templateAttrs.$$element = jqLite(document.createComment(" " + directiveName + ": " + templateAttrs[directiveName] + " ")), compileNode = $compileNode[0], replaceWith(jqCollection, sliceArgs($template), compileNode), childTranscludeFn = compile($template, transcludeFn, terminalPriority, replaceDirective && replaceDirective.name, {nonTlbTranscludeDirective: nonTlbTranscludeDirective})) : ($template = jqLite(jqLiteClone(compileNode)).contents(), $compileNode.empty(), childTranscludeFn = compile($template, transcludeFn))), directive.template)
                            if (hasTemplate = !0, assertNoDuplicate("template", templateDirective, directive, $compileNode), templateDirective = directive, directiveValue = isFunction(directive.template) ? directive.template($compileNode, templateAttrs) : directive.template, directiveValue = denormalizeTemplate(directiveValue), directive.replace) {
                                if (replaceDirective = directive, $template = jqLiteIsTextNode(directiveValue) ? [] : removeComments(wrapTemplate(directive.templateNamespace, trim(directiveValue))), compileNode = $template[0], 1 != $template.length || compileNode.nodeType !== NODE_TYPE_ELEMENT)
                                    throw $compileMinErr("tplrt", "Template for directive '{0}' must have exactly one root element. {1}", directiveName, "");
                                replaceWith(jqCollection, $compileNode, compileNode);
                                var newTemplateAttrs = {$attr: {}}, templateDirectives = collectDirectives(compileNode, [], newTemplateAttrs), unprocessedDirectives = directives.splice(i + 1, directives.length - (i + 1));
                                newIsolateScopeDirective && markDirectivesAsIsolate(templateDirectives), directives = directives.concat(templateDirectives).concat(unprocessedDirectives), mergeTemplateAttributes(templateAttrs, newTemplateAttrs), ii = directives.length
                            } else
                                $compileNode.html(directiveValue);
                        if (directive.templateUrl)
                            hasTemplate = !0, assertNoDuplicate("template", templateDirective, directive, $compileNode), templateDirective = directive, directive.replace && (replaceDirective = directive), nodeLinkFn = compileTemplateUrl(directives.splice(i, directives.length - i), $compileNode, templateAttrs, jqCollection, hasTranscludeDirective && childTranscludeFn, preLinkFns, postLinkFns, {controllerDirectives: controllerDirectives, newIsolateScopeDirective: newIsolateScopeDirective, templateDirective: templateDirective, nonTlbTranscludeDirective: nonTlbTranscludeDirective}), ii = directives.length;
                        else if (directive.compile)
                            try {
                                linkFn = directive.compile($compileNode, templateAttrs, childTranscludeFn), isFunction(linkFn) ? addLinkFns(null, linkFn, attrStart, attrEnd) : linkFn && addLinkFns(linkFn.pre, linkFn.post, attrStart, attrEnd)
                            } catch (e) {
                                $exceptionHandler(e, startingTag($compileNode))
                            }
                        directive.terminal && (nodeLinkFn.terminal = !0, terminalPriority = Math.max(terminalPriority, directive.priority))
                    }
                    return nodeLinkFn.scope = newScopeDirective && newScopeDirective.scope === !0, nodeLinkFn.transcludeOnThisElement = hasTranscludeDirective, nodeLinkFn.elementTranscludeOnThisElement = hasElementTranscludeDirective, nodeLinkFn.templateOnThisElement = hasTemplate, nodeLinkFn.transclude = childTranscludeFn, previousCompileContext.hasElementTranscludeDirective = hasElementTranscludeDirective, nodeLinkFn
                }
                function markDirectivesAsIsolate(directives) {
                    for (var j = 0, jj = directives.length; jj > j; j++)
                        directives[j] = inherit(directives[j], {$$isolateScope: !0})
                }
                function addDirective(tDirectives, name, location, maxPriority, ignoreDirective, startAttrName, endAttrName) {
                    if (name === ignoreDirective)
                        return null;
                    var match = null;
                    if (hasDirectives.hasOwnProperty(name))
                        for (var directive, directives = $injector.get(name + Suffix), i = 0, ii = directives.length; ii > i; i++)
                            try {
                                directive = directives[i], (maxPriority === undefined || maxPriority > directive.priority) && -1 != directive.restrict.indexOf(location) && (startAttrName && (directive = inherit(directive, {$$start: startAttrName, $$end: endAttrName})), tDirectives.push(directive), match = directive)
                            } catch (e) {
                                $exceptionHandler(e)
                            }
                    return match
                }
                function directiveIsMultiElement(name) {
                    if (hasDirectives.hasOwnProperty(name))
                        for (var directive, directives = $injector.get(name + Suffix), i = 0, ii = directives.length; ii > i; i++)
                            if (directive = directives[i], directive.multiElement)
                                return!0;
                    return!1
                }
                function mergeTemplateAttributes(dst, src) {
                    var srcAttr = src.$attr, dstAttr = dst.$attr, $element = dst.$$element;
                    forEach(dst, function (value, key) {
                        "$" != key.charAt(0) && (src[key] && src[key] !== value && (value += ("style" === key ? ";" : " ") + src[key]), dst.$set(key, value, !0, srcAttr[key]))
                    }), forEach(src, function (value, key) {
                        "class" == key ? (safeAddClass($element, value), dst["class"] = (dst["class"] ? dst["class"] + " " : "") + value) : "style" == key ? ($element.attr("style", $element.attr("style") + ";" + value), dst.style = (dst.style ? dst.style + ";" : "") + value) : "$" == key.charAt(0) || dst.hasOwnProperty(key) || (dst[key] = value, dstAttr[key] = srcAttr[key])
                    })
                }
                function compileTemplateUrl(directives, $compileNode, tAttrs, $rootElement, childTranscludeFn, preLinkFns, postLinkFns, previousCompileContext) {
                    var afterTemplateNodeLinkFn, afterTemplateChildLinkFn, linkQueue = [], beforeTemplateCompileNode = $compileNode[0], origAsyncDirective = directives.shift(), derivedSyncDirective = extend({}, origAsyncDirective, {templateUrl: null, transclude: null, replace: null, $$originalDirective: origAsyncDirective}), templateUrl = isFunction(origAsyncDirective.templateUrl) ? origAsyncDirective.templateUrl($compileNode, tAttrs) : origAsyncDirective.templateUrl, templateNamespace = origAsyncDirective.templateNamespace;
                    return $compileNode.empty(), $templateRequest($sce.getTrustedResourceUrl(templateUrl)).then(function (content) {
                        var compileNode, tempTemplateAttrs, $template, childBoundTranscludeFn;
                        if (content = denormalizeTemplate(content), origAsyncDirective.replace) {
                            if ($template = jqLiteIsTextNode(content) ? [] : removeComments(wrapTemplate(templateNamespace, trim(content))), compileNode = $template[0], 1 != $template.length || compileNode.nodeType !== NODE_TYPE_ELEMENT)
                                throw $compileMinErr("tplrt", "Template for directive '{0}' must have exactly one root element. {1}", origAsyncDirective.name, templateUrl);
                            tempTemplateAttrs = {$attr: {}}, replaceWith($rootElement, $compileNode, compileNode);
                            var templateDirectives = collectDirectives(compileNode, [], tempTemplateAttrs);
                            isObject(origAsyncDirective.scope) && markDirectivesAsIsolate(templateDirectives), directives = templateDirectives.concat(directives), mergeTemplateAttributes(tAttrs, tempTemplateAttrs)
                        } else
                            compileNode = beforeTemplateCompileNode, $compileNode.html(content);
                        for (directives.unshift(derivedSyncDirective), afterTemplateNodeLinkFn = applyDirectivesToNode(directives, compileNode, tAttrs, childTranscludeFn, $compileNode, origAsyncDirective, preLinkFns, postLinkFns, previousCompileContext), forEach($rootElement, function (node, i) {
                            node == compileNode && ($rootElement[i] = $compileNode[0])
                        }), afterTemplateChildLinkFn = compileNodes($compileNode[0].childNodes, childTranscludeFn); linkQueue.length; ) {
                            var scope = linkQueue.shift(), beforeTemplateLinkNode = linkQueue.shift(), linkRootElement = linkQueue.shift(), boundTranscludeFn = linkQueue.shift(), linkNode = $compileNode[0];
                            if (!scope.$$destroyed) {
                                if (beforeTemplateLinkNode !== beforeTemplateCompileNode) {
                                    var oldClasses = beforeTemplateLinkNode.className;
                                    previousCompileContext.hasElementTranscludeDirective && origAsyncDirective.replace || (linkNode = jqLiteClone(compileNode)), replaceWith(linkRootElement, jqLite(beforeTemplateLinkNode), linkNode), safeAddClass(jqLite(linkNode), oldClasses)
                                }
                                childBoundTranscludeFn = afterTemplateNodeLinkFn.transcludeOnThisElement ? createBoundTranscludeFn(scope, afterTemplateNodeLinkFn.transclude, boundTranscludeFn) : boundTranscludeFn, afterTemplateNodeLinkFn(afterTemplateChildLinkFn, scope, linkNode, $rootElement, childBoundTranscludeFn)
                            }
                        }
                        linkQueue = null
                    }), function (ignoreChildLinkFn, scope, node, rootElement, boundTranscludeFn) {
                        var childBoundTranscludeFn = boundTranscludeFn;
                        scope.$$destroyed || (linkQueue ? linkQueue.push(scope, node, rootElement, childBoundTranscludeFn) : (afterTemplateNodeLinkFn.transcludeOnThisElement && (childBoundTranscludeFn = createBoundTranscludeFn(scope, afterTemplateNodeLinkFn.transclude, boundTranscludeFn)), afterTemplateNodeLinkFn(afterTemplateChildLinkFn, scope, node, rootElement, childBoundTranscludeFn)))
                    }
                }
                function byPriority(a, b) {
                    var diff = b.priority - a.priority;
                    return 0 !== diff ? diff : a.name !== b.name ? a.name < b.name ? -1 : 1 : a.index - b.index
                }
                function assertNoDuplicate(what, previousDirective, directive, element) {
                    if (previousDirective)
                        throw $compileMinErr("multidir", "Multiple directives [{0}, {1}] asking for {2} on: {3}", previousDirective.name, directive.name, what, startingTag(element))
                }
                function addTextInterpolateDirective(directives, text) {
                    var interpolateFn = $interpolate(text, !0);
                    interpolateFn && directives.push({priority: 0, compile: function (templateNode) {
                            var templateNodeParent = templateNode.parent(), hasCompileParent = !!templateNodeParent.length;
                            return hasCompileParent && compile.$$addBindingClass(templateNodeParent), function (scope, node) {
                                var parent = node.parent();
                                hasCompileParent || compile.$$addBindingClass(parent), compile.$$addBindingInfo(parent, interpolateFn.expressions), scope.$watch(interpolateFn, function (value) {
                                    node[0].nodeValue = value
                                })
                            }
                        }})
                }
                function wrapTemplate(type, template) {
                    switch (type = lowercase(type || "html")) {
                        case"svg":
                        case"math":
                            var wrapper = document.createElement("div");
                            return wrapper.innerHTML = "<" + type + ">" + template + "</" + type + ">", wrapper.childNodes[0].childNodes;
                        default:
                            return template
                        }
                }
                function getTrustedContext(node, attrNormalizedName) {
                    if ("srcdoc" == attrNormalizedName)
                        return $sce.HTML;
                    var tag = nodeName_(node);
                    return"xlinkHref" == attrNormalizedName || "form" == tag && "action" == attrNormalizedName || "img" != tag && ("src" == attrNormalizedName || "ngSrc" == attrNormalizedName) ? $sce.RESOURCE_URL : void 0
                }
                function addAttrInterpolateDirective(node, directives, value, name, allOrNothing) {
                    var interpolateFn = $interpolate(value, !0);
                    if (interpolateFn) {
                        if ("multiple" === name && "select" === nodeName_(node))
                            throw $compileMinErr("selmulti", "Binding to the 'multiple' attribute is not supported. Element: {0}", startingTag(node));
                        directives.push({priority: 100, compile: function () {
                                return{pre: function (scope, element, attr) {
                                        var $$observers = attr.$$observers || (attr.$$observers = {});
                                        if (EVENT_HANDLER_ATTR_REGEXP.test(name))
                                            throw $compileMinErr("nodomevents", "Interpolations for HTML DOM event attributes are disallowed.  Please use the ng- versions (such as ng-click instead of onclick) instead.");
                                        attr[name] && (interpolateFn = $interpolate(attr[name], !0, getTrustedContext(node, name), ALL_OR_NOTHING_ATTRS[name] || allOrNothing), interpolateFn && (attr[name] = interpolateFn(scope), ($$observers[name] || ($$observers[name] = [])).$$inter = !0, (attr.$$observers && attr.$$observers[name].$$scope || scope).$watch(interpolateFn, function (newValue, oldValue) {
                                            "class" === name && newValue != oldValue ? attr.$updateClass(newValue, oldValue) : attr.$set(name, newValue)
                                        })))
                                    }}
                            }})
                    }
                }
                function replaceWith($rootElement, elementsToRemove, newNode) {
                    var i, ii, firstElementToRemove = elementsToRemove[0], removeCount = elementsToRemove.length, parent = firstElementToRemove.parentNode;
                    if ($rootElement)
                        for (i = 0, ii = $rootElement.length; ii > i; i++)
                            if ($rootElement[i] == firstElementToRemove) {
                                $rootElement[i++] = newNode;
                                for (var j = i, j2 = j + removeCount - 1, jj = $rootElement.length; jj > j; j++, j2++)
                                    jj > j2 ? $rootElement[j] = $rootElement[j2] : delete $rootElement[j];
                                $rootElement.length -= removeCount - 1, $rootElement.context === firstElementToRemove && ($rootElement.context = newNode);
                                break
                            }
                    parent && parent.replaceChild(newNode, firstElementToRemove);
                    var fragment = document.createDocumentFragment();
                    fragment.appendChild(firstElementToRemove), jqLite(newNode).data(jqLite(firstElementToRemove).data()), jQuery ? (skipDestroyOnNextJQueryCleanData = !0, jQuery.cleanData([firstElementToRemove])) : delete jqLite.cache[firstElementToRemove[jqLite.expando]];
                    for (var k = 1, kk = elementsToRemove.length; kk > k; k++) {
                        var element = elementsToRemove[k];
                        jqLite(element).remove(), fragment.appendChild(element), delete elementsToRemove[k]
                    }
                    elementsToRemove[0] = newNode, elementsToRemove.length = 1
                }
                function cloneAndAnnotateFn(fn, annotation) {
                    return extend(function () {
                        return fn.apply(null, arguments)
                    }, fn, annotation)
                }
                function invokeLinkFn(linkFn, scope, $element, attrs, controllers, transcludeFn) {
                    try {
                        linkFn(scope, $element, attrs, controllers, transcludeFn)
                    } catch (e) {
                        $exceptionHandler(e, startingTag($element))
                    }
                }
                var Attributes = function (element, attributesToCopy) {
                    if (attributesToCopy) {
                        var i, l, key, keys = Object.keys(attributesToCopy);
                        for (i = 0, l = keys.length; l > i; i++)
                            key = keys[i], this[key] = attributesToCopy[key]
                    } else
                        this.$attr = {};
                    this.$$element = element
                };
                Attributes.prototype = {$normalize: directiveNormalize, $addClass: function (classVal) {
                        classVal && classVal.length > 0 && $animate.addClass(this.$$element, classVal)
                    }, $removeClass: function (classVal) {
                        classVal && classVal.length > 0 && $animate.removeClass(this.$$element, classVal)
                    }, $updateClass: function (newClasses, oldClasses) {
                        var toAdd = tokenDifference(newClasses, oldClasses);
                        toAdd && toAdd.length && $animate.addClass(this.$$element, toAdd);
                        var toRemove = tokenDifference(oldClasses, newClasses);
                        toRemove && toRemove.length && $animate.removeClass(this.$$element, toRemove)
                    }, $set: function (key, value, writeAttr, attrName) {
                        var nodeName, node = this.$$element[0], booleanKey = getBooleanAttrName(node, key), aliasedKey = getAliasedAttrName(node, key), observer = key;
                        if (booleanKey ? (this.$$element.prop(key, value), attrName = booleanKey) : aliasedKey && (this[aliasedKey] = value, observer = aliasedKey), this[key] = value, attrName ? this.$attr[key] = attrName : (attrName = this.$attr[key], attrName || (this.$attr[key] = attrName = snake_case(key, "-"))), nodeName = nodeName_(this.$$element), "a" === nodeName && "href" === key || "img" === nodeName && "src" === key)
                            this[key] = value = $$sanitizeUri(value, "src" === key);
                        else if ("img" === nodeName && "srcset" === key) {
                            for (var result = "", trimmedSrcset = trim(value), srcPattern = /(\s+\d+x\s*,|\s+\d+w\s*,|\s+,|,\s+)/, pattern = /\s/.test(trimmedSrcset) ? srcPattern : /(,)/, rawUris = trimmedSrcset.split(pattern), nbrUrisWith2parts = Math.floor(rawUris.length / 2), i = 0; nbrUrisWith2parts > i; i++) {
                                var innerIdx = 2 * i;
                                result += $$sanitizeUri(trim(rawUris[innerIdx]), !0), result += " " + trim(rawUris[innerIdx + 1])
                            }
                            var lastTuple = trim(rawUris[2 * i]).split(/\s/);
                            result += $$sanitizeUri(trim(lastTuple[0]), !0), 2 === lastTuple.length && (result += " " + trim(lastTuple[1])), this[key] = value = result
                        }
                        writeAttr !== !1 && (null === value || value === undefined ? this.$$element.removeAttr(attrName) : this.$$element.attr(attrName, value));
                        var $$observers = this.$$observers;
                        $$observers && forEach($$observers[observer], function (fn) {
                            try {
                                fn(value)
                            } catch (e) {
                                $exceptionHandler(e)
                            }
                        })
                    }, $observe: function (key, fn) {
                        var attrs = this, $$observers = attrs.$$observers || (attrs.$$observers = createMap()), listeners = $$observers[key] || ($$observers[key] = []);
                        return listeners.push(fn), $rootScope.$evalAsync(function () {
                            !listeners.$$inter && attrs.hasOwnProperty(key) && fn(attrs[key])
                        }), function () {
                            arrayRemove(listeners, fn)
                        }
                    }};
                var startSymbol = $interpolate.startSymbol(), endSymbol = $interpolate.endSymbol(), denormalizeTemplate = "{{" == startSymbol || "}}" == endSymbol ? identity : function (template) {
                    return template.replace(/\{\{/g, startSymbol).replace(/}}/g, endSymbol)
                }, NG_ATTR_BINDING = /^ngAttr[A-Z]/;
                return compile.$$addBindingInfo = debugInfoEnabled ? function ($element, binding) {
                    var bindings = $element.data("$binding") || [];
                    isArray(binding) ? bindings = bindings.concat(binding) : bindings.push(binding), $element.data("$binding", bindings)
                } : noop, compile.$$addBindingClass = debugInfoEnabled ? function ($element) {
                    safeAddClass($element, "ng-binding")
                } : noop, compile.$$addScopeInfo = debugInfoEnabled ? function ($element, scope, isolated, noTemplate) {
                    var dataName = isolated ? noTemplate ? "$isolateScopeNoTemplate" : "$isolateScope" : "$scope";
                    $element.data(dataName, scope)
                } : noop, compile.$$addScopeClass = debugInfoEnabled ? function ($element, isolated) {
                    safeAddClass($element, isolated ? "ng-isolate-scope" : "ng-scope")
                } : noop, compile
            }]
    }
    function directiveNormalize(name) {
        return camelCase(name.replace(PREFIX_REGEXP, ""))
    }
    function tokenDifference(str1, str2) {
        var values = "", tokens1 = str1.split(/\s+/), tokens2 = str2.split(/\s+/);
        outer:for (var i = 0; i < tokens1.length; i++) {
            for (var token = tokens1[i], j = 0; j < tokens2.length; j++)
                if (token == tokens2[j])
                    continue outer;
            values += (values.length > 0 ? " " : "") + token
        }
        return values
    }
    function removeComments(jqNodes) {
        jqNodes = jqLite(jqNodes);
        var i = jqNodes.length;
        if (1 >= i)
            return jqNodes;
        for (; i--; ) {
            var node = jqNodes[i];
            node.nodeType === NODE_TYPE_COMMENT && splice.call(jqNodes, i, 1)
        }
        return jqNodes
    }
    function $ControllerProvider() {
        var controllers = {}, globals = !1, CNTRL_REG = /^(\S+)(\s+as\s+(\w+))?$/;
        this.register = function (name, constructor) {
            assertNotHasOwnProperty(name, "controller"), isObject(name) ? extend(controllers, name) : controllers[name] = constructor
        }, this.allowGlobals = function () {
            globals = !0
        }, this.$get = ["$injector", "$window", function ($injector, $window) {
                function addIdentifier(locals, identifier, instance, name) {
                    if (!locals || !isObject(locals.$scope))
                        throw minErr("$controller")("noscp", "Cannot export controller '{0}' as '{1}'! No $scope object provided via `locals`.", name, identifier);
                    locals.$scope[identifier] = instance
                }
                return function (expression, locals, later, ident) {
                    var instance, match, constructor, identifier;
                    if (later = later === !0, ident && isString(ident) && (identifier = ident), isString(expression) && (match = expression.match(CNTRL_REG), constructor = match[1], identifier = identifier || match[3], expression = controllers.hasOwnProperty(constructor) ? controllers[constructor] : getter(locals.$scope, constructor, !0) || (globals ? getter($window, constructor, !0) : undefined), assertArgFn(expression, constructor, !0)), later) {
                        var controllerPrototype = (isArray(expression) ? expression[expression.length - 1] : expression).prototype;
                        return instance = Object.create(controllerPrototype), identifier && addIdentifier(locals, identifier, instance, constructor || expression.name), extend(function () {
                            return $injector.invoke(expression, instance, locals, constructor), instance
                        }, {instance: instance, identifier: identifier})
                    }
                    return instance = $injector.instantiate(expression, locals, constructor), identifier && addIdentifier(locals, identifier, instance, constructor || expression.name), instance
                }
            }]
    }
    function $DocumentProvider() {
        this.$get = ["$window", function (window) {
                return jqLite(window.document)
            }]
    }
    function $ExceptionHandlerProvider() {
        this.$get = ["$log", function ($log) {
                return function () {
                    $log.error.apply($log, arguments)
                }
            }]
    }
    function defaultHttpResponseTransform(data, headers) {
        if (isString(data)) {
            data = data.replace(JSON_PROTECTION_PREFIX, "");
            var contentType = headers("Content-Type");
            (contentType && 0 === contentType.indexOf(APPLICATION_JSON) && data.trim() || JSON_START.test(data) && JSON_END.test(data)) && (data = fromJson(data))
        }
        return data
    }
    function parseHeaders(headers) {
        var key, val, i, parsed = createMap();
        return headers ? (forEach(headers.split("\n"), function (line) {
            i = line.indexOf(":"), key = lowercase(trim(line.substr(0, i))), val = trim(line.substr(i + 1)), key && (parsed[key] = parsed[key] ? parsed[key] + ", " + val : val)
        }), parsed) : parsed
    }
    function headersGetter(headers) {
        var headersObj = isObject(headers) ? headers : undefined;
        return function (name) {
            if (headersObj || (headersObj = parseHeaders(headers)), name) {
                var value = headersObj[lowercase(name)];
                return void 0 === value && (value = null), value
            }
            return headersObj
        }
    }
    function transformData(data, headers, fns) {
        return isFunction(fns) ? fns(data, headers) : (forEach(fns, function (fn) {
            data = fn(data, headers)
        }), data)
    }
    function isSuccess(status) {
        return status >= 200 && 300 > status
    }
    function $HttpProvider() {
        var defaults = this.defaults = {transformResponse: [defaultHttpResponseTransform], transformRequest: [function (d) {
                    return!isObject(d) || isFile(d) || isBlob(d) ? d : toJson(d)
                }], headers: {common: {Accept: "application/json, text/plain, */*"}, post: shallowCopy(CONTENT_TYPE_APPLICATION_JSON), put: shallowCopy(CONTENT_TYPE_APPLICATION_JSON), patch: shallowCopy(CONTENT_TYPE_APPLICATION_JSON)}, xsrfCookieName: "XSRF-TOKEN", xsrfHeaderName: "X-XSRF-TOKEN"}, useApplyAsync = !1;
        this.useApplyAsync = function (value) {
            return isDefined(value) ? (useApplyAsync = !!value, this) : useApplyAsync
        };
        var interceptorFactories = this.interceptors = [];
        this.$get = ["$httpBackend", "$browser", "$cacheFactory", "$rootScope", "$q", "$injector", function ($httpBackend, $browser, $cacheFactory, $rootScope, $q, $injector) {
                function $http(requestConfig) {
                    function transformResponse(response) {
                        var resp = extend({}, response);
                        return resp.data = response.data ? transformData(response.data, response.headers, config.transformResponse) : response.data, isSuccess(response.status) ? resp : $q.reject(resp)
                    }
                    function mergeHeaders(config) {
                        function execHeaders(headers) {
                            var headerContent;
                            forEach(headers, function (headerFn, header) {
                                isFunction(headerFn) && (headerContent = headerFn(), null != headerContent ? headers[header] = headerContent : delete headers[header])
                            })
                        }
                        var defHeaderName, lowercaseDefHeaderName, reqHeaderName, defHeaders = defaults.headers, reqHeaders = extend({}, config.headers);
                        defHeaders = extend({}, defHeaders.common, defHeaders[lowercase(config.method)]);
                        defaultHeadersIteration:for (defHeaderName in defHeaders) {
                            lowercaseDefHeaderName = lowercase(defHeaderName);
                            for (reqHeaderName in reqHeaders)
                                if (lowercase(reqHeaderName) === lowercaseDefHeaderName)
                                    continue defaultHeadersIteration;
                            reqHeaders[defHeaderName] = defHeaders[defHeaderName]
                        }
                        return execHeaders(reqHeaders), reqHeaders
                    }
                    var config = {method: "get", transformRequest: defaults.transformRequest, transformResponse: defaults.transformResponse}, headers = mergeHeaders(requestConfig);
                    if (!angular.isObject(requestConfig))
                        throw minErr("$http")("badreq", "Http request configuration must be an object.  Received: {0}", requestConfig);
                    extend(config, requestConfig), config.headers = headers, config.method = uppercase(config.method);
                    var serverRequest = function (config) {
                        headers = config.headers;
                        var reqData = transformData(config.data, headersGetter(headers), config.transformRequest);
                        return isUndefined(reqData) && forEach(headers, function (value, header) {
                            "content-type" === lowercase(header) && delete headers[header]
                        }), isUndefined(config.withCredentials) && !isUndefined(defaults.withCredentials) && (config.withCredentials = defaults.withCredentials), sendReq(config, reqData, headers).then(transformResponse, transformResponse)
                    }, chain = [serverRequest, undefined], promise = $q.when(config);
                    for (forEach(reversedInterceptors, function (interceptor) {
                        (interceptor.request || interceptor.requestError) && chain.unshift(interceptor.request, interceptor.requestError), (interceptor.response || interceptor.responseError) && chain.push(interceptor.response, interceptor.responseError)
                    }); chain.length; ) {
                        var thenFn = chain.shift(), rejectFn = chain.shift();
                        promise = promise.then(thenFn, rejectFn)
                    }
                    return promise.success = function (fn) {
                        return promise.then(function (response) {
                            fn(response.data, response.status, response.headers, config)
                        }), promise
                    }, promise.error = function (fn) {
                        return promise.then(null, function (response) {
                            fn(response.data, response.status, response.headers, config)
                        }), promise
                    }, promise
                }
                function createShortMethods() {
                    forEach(arguments, function (name) {
                        $http[name] = function (url, config) {
                            return $http(extend(config || {}, {method: name, url: url}))
                        }
                    })
                }
                function createShortMethodsWithData() {
                    forEach(arguments, function (name) {
                        $http[name] = function (url, data, config) {
                            return $http(extend(config || {}, {method: name, url: url, data: data}))
                        }
                    })
                }
                function sendReq(config, reqData, reqHeaders) {
                    function done(status, response, headersString, statusText) {
                        function resolveHttpPromise() {
                            resolvePromise(response, status, headersString, statusText)
                        }
                        cache && (isSuccess(status) ? cache.put(url, [status, response, parseHeaders(headersString), statusText]) : cache.remove(url)), useApplyAsync ? $rootScope.$applyAsync(resolveHttpPromise) : (resolveHttpPromise(), $rootScope.$$phase || $rootScope.$apply())
                    }
                    function resolvePromise(response, status, headers, statusText) {
                        status = Math.max(status, 0), (isSuccess(status) ? deferred.resolve : deferred.reject)({data: response, status: status, headers: headersGetter(headers), config: config, statusText: statusText})
                    }
                    function removePendingReq() {
                        var idx = $http.pendingRequests.indexOf(config);
                        -1 !== idx && $http.pendingRequests.splice(idx, 1)
                    }
                    var cache, cachedResp, deferred = $q.defer(), promise = deferred.promise, url = buildUrl(config.url, config.params);
                    if ($http.pendingRequests.push(config), promise.then(removePendingReq, removePendingReq), !config.cache && !defaults.cache || config.cache === !1 || "GET" !== config.method && "JSONP" !== config.method || (cache = isObject(config.cache) ? config.cache : isObject(defaults.cache) ? defaults.cache : defaultCache), cache)
                        if (cachedResp = cache.get(url), isDefined(cachedResp)) {
                            if (isPromiseLike(cachedResp))
                                return cachedResp.then(removePendingReq, removePendingReq), cachedResp;
                            isArray(cachedResp) ? resolvePromise(cachedResp[1], cachedResp[0], shallowCopy(cachedResp[2]), cachedResp[3]) : resolvePromise(cachedResp, 200, {}, "OK")
                        } else
                            cache.put(url, promise);
                    if (isUndefined(cachedResp)) {
                        var xsrfValue = urlIsSameOrigin(config.url) ? $browser.cookies()[config.xsrfCookieName || defaults.xsrfCookieName] : undefined;
                        xsrfValue && (reqHeaders[config.xsrfHeaderName || defaults.xsrfHeaderName] = xsrfValue), $httpBackend(config.method, url, reqData, done, reqHeaders, config.timeout, config.withCredentials, config.responseType)
                    }
                    return promise
                }
                function buildUrl(url, params) {
                    if (!params)
                        return url;
                    var parts = [];
                    return forEachSorted(params, function (value, key) {
                        null === value || isUndefined(value) || (isArray(value) || (value = [value]), forEach(value, function (v) {
                            isObject(v) && (v = isDate(v) ? v.toISOString() : toJson(v)), parts.push(encodeUriQuery(key) + "=" + encodeUriQuery(v))
                        }))
                    }), parts.length > 0 && (url += (-1 == url.indexOf("?") ? "?" : "&") + parts.join("&")), url
                }
                var defaultCache = $cacheFactory("$http"), reversedInterceptors = [];
                return forEach(interceptorFactories, function (interceptorFactory) {
                    reversedInterceptors.unshift(isString(interceptorFactory) ? $injector.get(interceptorFactory) : $injector.invoke(interceptorFactory))
                }), $http.pendingRequests = [], createShortMethods("get", "delete", "head", "jsonp"), createShortMethodsWithData("post", "put", "patch"), $http.defaults = defaults, $http
            }]
    }
    function createXhr() {
        return new window.XMLHttpRequest
    }
    function $HttpBackendProvider() {
        this.$get = ["$browser", "$window", "$document", function ($browser, $window, $document) {
                return createHttpBackend($browser, createXhr, $browser.defer, $window.angular.callbacks, $document[0])
            }]
    }
    function createHttpBackend($browser, createXhr, $browserDefer, callbacks, rawDocument) {
        function jsonpReq(url, callbackId, done) {
            var script = rawDocument.createElement("script"), callback = null;
            return script.type = "text/javascript", script.src = url, script.async = !0, callback = function (event) {
                removeEventListenerFn(script, "load", callback), removeEventListenerFn(script, "error", callback), rawDocument.body.removeChild(script), script = null;
                var status = -1, text = "unknown";
                event && ("load" !== event.type || callbacks[callbackId].called || (event = {type: "error"}), text = event.type, status = "error" === event.type ? 404 : 200), done && done(status, text)
            }, addEventListenerFn(script, "load", callback), addEventListenerFn(script, "error", callback), rawDocument.body.appendChild(script), callback
        }
        return function (method, url, post, callback, headers, timeout, withCredentials, responseType) {
            function timeoutRequest() {
                jsonpDone && jsonpDone(), xhr && xhr.abort()
            }
            function completeRequest(callback, status, response, headersString, statusText) {
                timeoutId !== undefined && $browserDefer.cancel(timeoutId), jsonpDone = xhr = null, callback(status, response, headersString, statusText), $browser.$$completeOutstandingRequest(noop)
            }
            if ($browser.$$incOutstandingRequestCount(), url = url || $browser.url(), "jsonp" == lowercase(method)) {
                var callbackId = "_" + (callbacks.counter++).toString(36);
                callbacks[callbackId] = function (data) {
                    callbacks[callbackId].data = data, callbacks[callbackId].called = !0
                };
                var jsonpDone = jsonpReq(url.replace("JSON_CALLBACK", "angular.callbacks." + callbackId), callbackId, function (status, text) {
                    completeRequest(callback, status, callbacks[callbackId].data, "", text), callbacks[callbackId] = noop
                })
            } else {
                var xhr = createXhr();
                xhr.open(method, url, !0), forEach(headers, function (value, key) {
                    isDefined(value) && xhr.setRequestHeader(key, value)
                }), xhr.onload = function () {
                    var statusText = xhr.statusText || "", response = "response"in xhr ? xhr.response : xhr.responseText, status = 1223 === xhr.status ? 204 : xhr.status;
                    0 === status && (status = response ? 200 : "file" == urlResolve(url).protocol ? 404 : 0), completeRequest(callback, status, response, xhr.getAllResponseHeaders(), statusText)
                };
                var requestError = function () {
                    completeRequest(callback, -1, null, null, "")
                };
                if (xhr.onerror = requestError, xhr.onabort = requestError, withCredentials && (xhr.withCredentials = !0), responseType)
                    try {
                        xhr.responseType = responseType
                    } catch (e) {
                        if ("json" !== responseType)
                            throw e
                    }
                xhr.send(post || null)
            }
            if (timeout > 0)
                var timeoutId = $browserDefer(timeoutRequest, timeout);
            else
                isPromiseLike(timeout) && timeout.then(timeoutRequest)
        }
    }
    function $InterpolateProvider() {
        var startSymbol = "{{", endSymbol = "}}";
        this.startSymbol = function (value) {
            return value ? (startSymbol = value, this) : startSymbol
        }, this.endSymbol = function (value) {
            return value ? (endSymbol = value, this) : endSymbol
        }, this.$get = ["$parse", "$exceptionHandler", "$sce", function ($parse, $exceptionHandler, $sce) {
                function escape(ch) {
                    return"\\\\\\" + ch
                }
                function $interpolate(text, mustHaveExpression, trustedContext, allOrNothing) {
                    function unescapeText(text) {
                        return text.replace(escapedStartRegexp, startSymbol).replace(escapedEndRegexp, endSymbol)
                    }
                    function parseStringifyInterceptor(value) {
                        try {
                            return value = getValue(value), allOrNothing && !isDefined(value) ? value : stringify(value)
                        } catch (err) {
                            var newErr = $interpolateMinErr("interr", "Can't interpolate: {0}\n{1}", text, err.toString());
                            $exceptionHandler(newErr)
                        }
                    }
                    allOrNothing = !!allOrNothing;
                    for (var startIndex, endIndex, exp, index = 0, expressions = [], parseFns = [], textLength = text.length, concat = [], expressionPositions = []; textLength > index; ) {
                        if (-1 == (startIndex = text.indexOf(startSymbol, index)) || -1 == (endIndex = text.indexOf(endSymbol, startIndex + startSymbolLength))) {
                            index !== textLength && concat.push(unescapeText(text.substring(index)));
                            break
                        }
                        index !== startIndex && concat.push(unescapeText(text.substring(index, startIndex))), exp = text.substring(startIndex + startSymbolLength, endIndex), expressions.push(exp), parseFns.push($parse(exp, parseStringifyInterceptor)), index = endIndex + endSymbolLength, expressionPositions.push(concat.length), concat.push("")
                    }
                    if (trustedContext && concat.length > 1)
                        throw $interpolateMinErr("noconcat", "Error while interpolating: {0}\nStrict Contextual Escaping disallows interpolations that concatenate multiple expressions when a trusted value is required.  See http://docs.angularjs.org/api/ng.$sce", text);
                    if (!mustHaveExpression || expressions.length) {
                        var compute = function (values) {
                            for (var i = 0, ii = expressions.length; ii > i; i++) {
                                if (allOrNothing && isUndefined(values[i]))
                                    return;
                                concat[expressionPositions[i]] = values[i]
                            }
                            return concat.join("")
                        }, getValue = function (value) {
                            return trustedContext ? $sce.getTrusted(trustedContext, value) : $sce.valueOf(value)
                        }, stringify = function (value) {
                            if (null == value)
                                return"";
                            switch (typeof value) {
                                case"string":
                                    break;
                                case"number":
                                    value = "" + value;
                                    break;
                                default:
                                    value = toJson(value)
                            }
                            return value
                        };
                        return extend(function (context) {
                            var i = 0, ii = expressions.length, values = new Array(ii);
                            try {
                                for (; ii > i; i++)
                                    values[i] = parseFns[i](context);
                                return compute(values)
                            } catch (err) {
                                var newErr = $interpolateMinErr("interr", "Can't interpolate: {0}\n{1}", text, err.toString());
                                $exceptionHandler(newErr)
                            }
                        }, {exp: text, expressions: expressions, $$watchDelegate: function (scope, listener, objectEquality) {
                                var lastValue;
                                return scope.$watchGroup(parseFns, function (values, oldValues) {
                                    var currValue = compute(values);
                                    isFunction(listener) && listener.call(this, currValue, values !== oldValues ? lastValue : currValue, scope), lastValue = currValue
                                }, objectEquality)
                            }})
                    }
                }
                var startSymbolLength = startSymbol.length, endSymbolLength = endSymbol.length, escapedStartRegexp = new RegExp(startSymbol.replace(/./g, escape), "g"), escapedEndRegexp = new RegExp(endSymbol.replace(/./g, escape), "g");
                return $interpolate.startSymbol = function () {
                    return startSymbol
                }, $interpolate.endSymbol = function () {
                    return endSymbol
                }, $interpolate
            }]
    }
    function $IntervalProvider() {
        this.$get = ["$rootScope", "$window", "$q", "$$q", function ($rootScope, $window, $q, $$q) {
                function interval(fn, delay, count, invokeApply) {
                    var setInterval = $window.setInterval, clearInterval = $window.clearInterval, iteration = 0, skipApply = isDefined(invokeApply) && !invokeApply, deferred = (skipApply ? $$q : $q).defer(), promise = deferred.promise;
                    return count = isDefined(count) ? count : 0, promise.then(null, null, fn), promise.$$intervalId = setInterval(function () {
                        deferred.notify(iteration++), count > 0 && iteration >= count && (deferred.resolve(iteration), clearInterval(promise.$$intervalId), delete intervals[promise.$$intervalId]), skipApply || $rootScope.$apply()
                    }, delay), intervals[promise.$$intervalId] = deferred, promise
                }
                var intervals = {};
                return interval.cancel = function (promise) {
                    return promise && promise.$$intervalId in intervals ? (intervals[promise.$$intervalId].reject("canceled"), $window.clearInterval(promise.$$intervalId), delete intervals[promise.$$intervalId], !0) : !1
                }, interval
            }]
    }
    function $LocaleProvider() {
        this.$get = function () {
            return{id: "en-us", NUMBER_FORMATS: {DECIMAL_SEP: ".", GROUP_SEP: ",", PATTERNS: [{minInt: 1, minFrac: 0, maxFrac: 3, posPre: "", posSuf: "", negPre: "-", negSuf: "", gSize: 3, lgSize: 3}, {minInt: 1, minFrac: 2, maxFrac: 2, posPre: "¤", posSuf: "", negPre: "(¤", negSuf: ")", gSize: 3, lgSize: 3}], CURRENCY_SYM: "$"}, DATETIME_FORMATS: {MONTH: "January,February,March,April,May,June,July,August,September,October,November,December".split(","), SHORTMONTH: "Jan,Feb,Mar,Apr,May,Jun,Jul,Aug,Sep,Oct,Nov,Dec".split(","), DAY: "Sunday,Monday,Tuesday,Wednesday,Thursday,Friday,Saturday".split(","), SHORTDAY: "Sun,Mon,Tue,Wed,Thu,Fri,Sat".split(","), AMPMS: ["AM", "PM"], medium: "MMM d, y h:mm:ss a", "short": "M/d/yy h:mm a", fullDate: "EEEE, MMMM d, y", longDate: "MMMM d, y", mediumDate: "MMM d, y", shortDate: "M/d/yy", mediumTime: "h:mm:ss a", shortTime: "h:mm a"}, pluralCat: function (num) {
                    return 1 === num ? "one" : "other"
                }}
        }
    }
    function encodePath(path) {
        for (var segments = path.split("/"), i = segments.length; i--; )
            segments[i] = encodeUriSegment(segments[i]);
        return segments.join("/")
    }
    function parseAbsoluteUrl(absoluteUrl, locationObj) {
        var parsedUrl = urlResolve(absoluteUrl);
        locationObj.$$protocol = parsedUrl.protocol, locationObj.$$host = parsedUrl.hostname, locationObj.$$port = int(parsedUrl.port) || DEFAULT_PORTS[parsedUrl.protocol] || null
    }
    function parseAppUrl(relativeUrl, locationObj) {
        var prefixed = "/" !== relativeUrl.charAt(0);
        prefixed && (relativeUrl = "/" + relativeUrl);
        var match = urlResolve(relativeUrl);
        locationObj.$$path = decodeURIComponent(prefixed && "/" === match.pathname.charAt(0) ? match.pathname.substring(1) : match.pathname), locationObj.$$search = parseKeyValue(match.search), locationObj.$$hash = decodeURIComponent(match.hash), locationObj.$$path && "/" != locationObj.$$path.charAt(0) && (locationObj.$$path = "/" + locationObj.$$path)
    }
    function beginsWith(begin, whole) {
        return 0 === whole.indexOf(begin) ? whole.substr(begin.length) : void 0
    }
    function stripHash(url) {
        var index = url.indexOf("#");
        return-1 == index ? url : url.substr(0, index)
    }
    function stripFile(url) {
        return url.substr(0, stripHash(url).lastIndexOf("/") + 1)
    }
    function serverBase(url) {
        return url.substring(0, url.indexOf("/", url.indexOf("//") + 2))
    }
    function LocationHtml5Url(appBase, basePrefix) {
        this.$$html5 = !0, basePrefix = basePrefix || "";
        var appBaseNoFile = stripFile(appBase);
        parseAbsoluteUrl(appBase, this), this.$$parse = function (url) {
            var pathUrl = beginsWith(appBaseNoFile, url);
            if (!isString(pathUrl))
                throw $locationMinErr("ipthprfx", 'Invalid url "{0}", missing path prefix "{1}".', url, appBaseNoFile);
            parseAppUrl(pathUrl, this), this.$$path || (this.$$path = "/"), this.$$compose()
        }, this.$$compose = function () {
            var search = toKeyValue(this.$$search), hash = this.$$hash ? "#" + encodeUriSegment(this.$$hash) : "";
            this.$$url = encodePath(this.$$path) + (search ? "?" + search : "") + hash, this.$$absUrl = appBaseNoFile + this.$$url.substr(1)
        }, this.$$parseLinkUrl = function (url, relHref) {
            if (relHref && "#" === relHref[0])
                return this.hash(relHref.slice(1)), !0;
            var appUrl, prevAppUrl, rewrittenUrl;
            return(appUrl = beginsWith(appBase, url)) !== undefined ? (prevAppUrl = appUrl, rewrittenUrl = (appUrl = beginsWith(basePrefix, appUrl)) !== undefined ? appBaseNoFile + (beginsWith("/", appUrl) || appUrl) : appBase + prevAppUrl) : (appUrl = beginsWith(appBaseNoFile, url)) !== undefined ? rewrittenUrl = appBaseNoFile + appUrl : appBaseNoFile == url + "/" && (rewrittenUrl = appBaseNoFile), rewrittenUrl && this.$$parse(rewrittenUrl), !!rewrittenUrl
        }
    }
    function LocationHashbangUrl(appBase, hashPrefix) {
        var appBaseNoFile = stripFile(appBase);
        parseAbsoluteUrl(appBase, this), this.$$parse = function (url) {
            function removeWindowsDriveName(path, url, base) {
                var firstPathSegmentMatch, windowsFilePathExp = /^\/[A-Z]:(\/.*)/;
                return 0 === url.indexOf(base) && (url = url.replace(base, "")), windowsFilePathExp.exec(url) ? path : (firstPathSegmentMatch = windowsFilePathExp.exec(path), firstPathSegmentMatch ? firstPathSegmentMatch[1] : path)
            }
            var withoutBaseUrl = beginsWith(appBase, url) || beginsWith(appBaseNoFile, url), withoutHashUrl = "#" == withoutBaseUrl.charAt(0) ? beginsWith(hashPrefix, withoutBaseUrl) : this.$$html5 ? withoutBaseUrl : "";
            if (!isString(withoutHashUrl))
                throw $locationMinErr("ihshprfx", 'Invalid url "{0}", missing hash prefix "{1}".', url, hashPrefix);
            parseAppUrl(withoutHashUrl, this), this.$$path = removeWindowsDriveName(this.$$path, withoutHashUrl, appBase), this.$$compose()
        }, this.$$compose = function () {
            var search = toKeyValue(this.$$search), hash = this.$$hash ? "#" + encodeUriSegment(this.$$hash) : "";
            this.$$url = encodePath(this.$$path) + (search ? "?" + search : "") + hash, this.$$absUrl = appBase + (this.$$url ? hashPrefix + this.$$url : "")
        }, this.$$parseLinkUrl = function (url) {
            return stripHash(appBase) == stripHash(url) ? (this.$$parse(url), !0) : !1
        }
    }
    function LocationHashbangInHtml5Url(appBase, hashPrefix) {
        this.$$html5 = !0, LocationHashbangUrl.apply(this, arguments);
        var appBaseNoFile = stripFile(appBase);
        this.$$parseLinkUrl = function (url, relHref) {
            if (relHref && "#" === relHref[0])
                return this.hash(relHref.slice(1)), !0;
            var rewrittenUrl, appUrl;
            return appBase == stripHash(url) ? rewrittenUrl = url : (appUrl = beginsWith(appBaseNoFile, url)) ? rewrittenUrl = appBase + hashPrefix + appUrl : appBaseNoFile === url + "/" && (rewrittenUrl = appBaseNoFile), rewrittenUrl && this.$$parse(rewrittenUrl), !!rewrittenUrl
        }, this.$$compose = function () {
            var search = toKeyValue(this.$$search), hash = this.$$hash ? "#" + encodeUriSegment(this.$$hash) : "";
            this.$$url = encodePath(this.$$path) + (search ? "?" + search : "") + hash, this.$$absUrl = appBase + hashPrefix + this.$$url
        }
    }
    function locationGetter(property) {
        return function () {
            return this[property]
        }
    }
    function locationGetterSetter(property, preprocess) {
        return function (value) {
            return isUndefined(value) ? this[property] : (this[property] = preprocess(value), this.$$compose(), this)
        }
    }
    function $LocationProvider() {
        var hashPrefix = "", html5Mode = {enabled: !1, requireBase: !0, rewriteLinks: !0};
        this.hashPrefix = function (prefix) {
            return isDefined(prefix) ? (hashPrefix = prefix, this) : hashPrefix
        }, this.html5Mode = function (mode) {
            return isBoolean(mode) ? (html5Mode.enabled = mode, this) : isObject(mode) ? (isBoolean(mode.enabled) && (html5Mode.enabled = mode.enabled), isBoolean(mode.requireBase) && (html5Mode.requireBase = mode.requireBase), isBoolean(mode.rewriteLinks) && (html5Mode.rewriteLinks = mode.rewriteLinks), this) : html5Mode
        }, this.$get = ["$rootScope", "$browser", "$sniffer", "$rootElement", function ($rootScope, $browser, $sniffer, $rootElement) {
                function setBrowserUrlWithFallback(url, replace, state) {
                    var oldUrl = $location.url(), oldState = $location.$$state;
                    try {
                        $browser.url(url, replace, state), $location.$$state = $browser.state()
                    } catch (e) {
                        throw $location.url(oldUrl), $location.$$state = oldState, e
                    }
                }
                function afterLocationChange(oldUrl, oldState) {
                    $rootScope.$broadcast("$locationChangeSuccess", $location.absUrl(), oldUrl, $location.$$state, oldState)
                }
                var $location, LocationMode, appBase, baseHref = $browser.baseHref(), initialUrl = $browser.url();
                if (html5Mode.enabled) {
                    if (!baseHref && html5Mode.requireBase)
                        throw $locationMinErr("nobase", "$location in HTML5 mode requires a <base> tag to be present!");
                    appBase = serverBase(initialUrl) + (baseHref || "/"), LocationMode = $sniffer.history ? LocationHtml5Url : LocationHashbangInHtml5Url
                } else
                    appBase = stripHash(initialUrl), LocationMode = LocationHashbangUrl;
                $location = new LocationMode(appBase, "#" + hashPrefix), $location.$$parseLinkUrl(initialUrl, initialUrl), $location.$$state = $browser.state();
                var IGNORE_URI_REGEXP = /^\s*(javascript|mailto):/i;
                $rootElement.on("click", function (event) {
                    if (html5Mode.rewriteLinks && !event.ctrlKey && !event.metaKey && 2 != event.which) {
                        for (var elm = jqLite(event.target); "a" !== nodeName_(elm[0]); )
                            if (elm[0] === $rootElement[0] || !(elm = elm.parent())[0])
                                return;
                        var absHref = elm.prop("href"), relHref = elm.attr("href") || elm.attr("xlink:href");
                        isObject(absHref) && "[object SVGAnimatedString]" === absHref.toString() && (absHref = urlResolve(absHref.animVal).href), IGNORE_URI_REGEXP.test(absHref) || !absHref || elm.attr("target") || event.isDefaultPrevented() || $location.$$parseLinkUrl(absHref, relHref) && (event.preventDefault(), $location.absUrl() != $browser.url() && ($rootScope.$apply(), window.angular["ff-684208-preventDefault"] = !0))
                    }
                }), $location.absUrl() != initialUrl && $browser.url($location.absUrl(), !0);
                var initializing = !0;
                return $browser.onUrlChange(function (newUrl, newState) {
                    $rootScope.$evalAsync(function () {
                        var defaultPrevented, oldUrl = $location.absUrl(), oldState = $location.$$state;
                        $location.$$parse(newUrl), $location.$$state = newState, defaultPrevented = $rootScope.$broadcast("$locationChangeStart", newUrl, oldUrl, newState, oldState).defaultPrevented, $location.absUrl() === newUrl && (defaultPrevented ? ($location.$$parse(oldUrl), $location.$$state = oldState, setBrowserUrlWithFallback(oldUrl, !1, oldState)) : (initializing = !1, afterLocationChange(oldUrl, oldState)))
                    }), $rootScope.$$phase || $rootScope.$digest()
                }), $rootScope.$watch(function () {
                    var oldUrl = $browser.url(), oldState = $browser.state(), currentReplace = $location.$$replace, urlOrStateChanged = oldUrl !== $location.absUrl() || $location.$$html5 && $sniffer.history && oldState !== $location.$$state;
                    (initializing || urlOrStateChanged) && (initializing = !1, $rootScope.$evalAsync(function () {
                        var newUrl = $location.absUrl(), defaultPrevented = $rootScope.$broadcast("$locationChangeStart", newUrl, oldUrl, $location.$$state, oldState).defaultPrevented;
                        $location.absUrl() === newUrl && (defaultPrevented ? ($location.$$parse(oldUrl), $location.$$state = oldState) : (urlOrStateChanged && setBrowserUrlWithFallback(newUrl, currentReplace, oldState === $location.$$state ? null : $location.$$state), afterLocationChange(oldUrl, oldState)))
                    })), $location.$$replace = !1
                }), $location
            }]
    }
    function $LogProvider() {
        var debug = !0, self = this;
        this.debugEnabled = function (flag) {
            return isDefined(flag) ? (debug = flag, this) : debug
        }, this.$get = ["$window", function ($window) {
                function formatError(arg) {
                    return arg instanceof Error && (arg.stack ? arg = arg.message && -1 === arg.stack.indexOf(arg.message) ? "Error: " + arg.message + "\n" + arg.stack : arg.stack : arg.sourceURL && (arg = arg.message + "\n" + arg.sourceURL + ":" + arg.line)), arg
                }
                function consoleLog(type) {
                    var console = $window.console || {}, logFn = console[type] || console.log || noop, hasApply = !1;
                    try {
                        hasApply = !!logFn.apply
                    } catch (e) {
                    }
                    return hasApply ? function () {
                        var args = [];
                        return forEach(arguments, function (arg) {
                            args.push(formatError(arg))
                        }), logFn.apply(console, args)
                    } : function (arg1, arg2) {
                        logFn(arg1, null == arg2 ? "" : arg2)
                    }
                }
                return{log: consoleLog("log"), info: consoleLog("info"), warn: consoleLog("warn"), error: consoleLog("error"), debug: function () {
                        var fn = consoleLog("debug");
                        return function () {
                            debug && fn.apply(self, arguments)
                        }
                    }()}
            }]
    }
    function ensureSafeMemberName(name, fullExpression) {
        if ("__defineGetter__" === name || "__defineSetter__" === name || "__lookupGetter__" === name || "__lookupSetter__" === name || "__proto__" === name)
            throw $parseMinErr("isecfld", "Attempting to access a disallowed field in Angular expressions! Expression: {0}", fullExpression);
        return name
    }
    function ensureSafeObject(obj, fullExpression) {
        if (obj) {
            if (obj.constructor === obj)
                throw $parseMinErr("isecfn", "Referencing Function in Angular expressions is disallowed! Expression: {0}", fullExpression);
            if (obj.window === obj)
                throw $parseMinErr("isecwindow", "Referencing the Window in Angular expressions is disallowed! Expression: {0}", fullExpression);
            if (obj.children && (obj.nodeName || obj.prop && obj.attr && obj.find))
                throw $parseMinErr("isecdom", "Referencing DOM nodes in Angular expressions is disallowed! Expression: {0}", fullExpression);
            if (obj === Object)
                throw $parseMinErr("isecobj", "Referencing Object in Angular expressions is disallowed! Expression: {0}", fullExpression)
        }
        return obj
    }
    function ensureSafeFunction(obj, fullExpression) {
        if (obj) {
            if (obj.constructor === obj)
                throw $parseMinErr("isecfn", "Referencing Function in Angular expressions is disallowed! Expression: {0}", fullExpression);
            if (obj === CALL || obj === APPLY || obj === BIND)
                throw $parseMinErr("isecff", "Referencing call, apply or bind in Angular expressions is disallowed! Expression: {0}", fullExpression)
        }
    }
    function isConstant(exp) {
        return exp.constant
    }
    function setter(obj, path, setValue, fullExp) {
        ensureSafeObject(obj, fullExp);
        for (var key, element = path.split("."), i = 0; element.length > 1; i++) {
            key = ensureSafeMemberName(element.shift(), fullExp);
            var propertyObj = ensureSafeObject(obj[key], fullExp);
            propertyObj || (propertyObj = {}, obj[key] = propertyObj), obj = propertyObj
        }
        return key = ensureSafeMemberName(element.shift(), fullExp), ensureSafeObject(obj[key], fullExp), obj[key] = setValue, setValue
    }
    function isPossiblyDangerousMemberName(name) {
        return"constructor" == name
    }
    function cspSafeGetterFn(key0, key1, key2, key3, key4, fullExp, expensiveChecks) {
        ensureSafeMemberName(key0, fullExp), ensureSafeMemberName(key1, fullExp), ensureSafeMemberName(key2, fullExp), ensureSafeMemberName(key3, fullExp), ensureSafeMemberName(key4, fullExp);
        var eso = function (o) {
            return ensureSafeObject(o, fullExp)
        }, eso0 = expensiveChecks || isPossiblyDangerousMemberName(key0) ? eso : identity, eso1 = expensiveChecks || isPossiblyDangerousMemberName(key1) ? eso : identity, eso2 = expensiveChecks || isPossiblyDangerousMemberName(key2) ? eso : identity, eso3 = expensiveChecks || isPossiblyDangerousMemberName(key3) ? eso : identity, eso4 = expensiveChecks || isPossiblyDangerousMemberName(key4) ? eso : identity;
        return function (scope, locals) {
            var pathVal = locals && locals.hasOwnProperty(key0) ? locals : scope;
            return null == pathVal ? pathVal : (pathVal = eso0(pathVal[key0]), key1 ? null == pathVal ? undefined : (pathVal = eso1(pathVal[key1]), key2 ? null == pathVal ? undefined : (pathVal = eso2(pathVal[key2]), key3 ? null == pathVal ? undefined : (pathVal = eso3(pathVal[key3]), key4 ? null == pathVal ? undefined : pathVal = eso4(pathVal[key4]) : pathVal) : pathVal) : pathVal) : pathVal)
        }
    }
    function getterFnWithEnsureSafeObject(fn, fullExpression) {
        return function (s, l) {
            return fn(s, l, ensureSafeObject, fullExpression)
        }
    }
    function getterFn(path, options, fullExp) {
        var expensiveChecks = options.expensiveChecks, getterFnCache = expensiveChecks ? getterFnCacheExpensive : getterFnCacheDefault, fn = getterFnCache[path];
        if (fn)
            return fn;
        var pathKeys = path.split("."), pathKeysLength = pathKeys.length;
        if (options.csp)
            fn = 6 > pathKeysLength ? cspSafeGetterFn(pathKeys[0], pathKeys[1], pathKeys[2], pathKeys[3], pathKeys[4], fullExp, expensiveChecks) : function (scope, locals) {
                var val, i = 0;
                do
                    val = cspSafeGetterFn(pathKeys[i++], pathKeys[i++], pathKeys[i++], pathKeys[i++], pathKeys[i++], fullExp, expensiveChecks)(scope, locals), locals = undefined, scope = val;
                while (pathKeysLength > i);
                return val
            };
        else {
            var code = "";
            expensiveChecks && (code += "s = eso(s, fe);\nl = eso(l, fe);\n");
            var needsEnsureSafeObject = expensiveChecks;
            forEach(pathKeys, function (key, index) {
                ensureSafeMemberName(key, fullExp);
                var lookupJs = (index ? "s" : '((l&&l.hasOwnProperty("' + key + '"))?l:s)') + "." + key;
                (expensiveChecks || isPossiblyDangerousMemberName(key)) && (lookupJs = "eso(" + lookupJs + ", fe)", needsEnsureSafeObject = !0), code += "if(s == null) return undefined;\ns=" + lookupJs + ";\n"
            }), code += "return s;";
            var evaledFnGetter = new Function("s", "l", "eso", "fe", code);
            evaledFnGetter.toString = valueFn(code), needsEnsureSafeObject && (evaledFnGetter = getterFnWithEnsureSafeObject(evaledFnGetter, fullExp)), fn = evaledFnGetter
        }
        return fn.sharedGetter = !0, fn.assign = function (self, value) {
            return setter(self, path, value, path)
        }, getterFnCache[path] = fn, fn
    }
    function getValueOf(value) {
        return isFunction(value.valueOf) ? value.valueOf() : objectValueOf.call(value)
    }
    function $ParseProvider() {
        var cacheDefault = createMap(), cacheExpensive = createMap();
        this.$get = ["$filter", "$sniffer", function ($filter, $sniffer) {
                function wrapSharedExpression(exp) {
                    var wrapped = exp;
                    return exp.sharedGetter && (wrapped = function (self, locals) {
                        return exp(self, locals)
                    }, wrapped.literal = exp.literal, wrapped.constant = exp.constant, wrapped.assign = exp.assign), wrapped
                }
                function collectExpressionInputs(inputs, list) {
                    for (var i = 0, ii = inputs.length; ii > i; i++) {
                        var input = inputs[i];
                        input.constant || (input.inputs ? collectExpressionInputs(input.inputs, list) : -1 === list.indexOf(input) && list.push(input))
                    }
                    return list
                }
                function expressionInputDirtyCheck(newValue, oldValueOfValue) {
                    return null == newValue || null == oldValueOfValue ? newValue === oldValueOfValue : "object" == typeof newValue && (newValue = getValueOf(newValue), "object" == typeof newValue) ? !1 : newValue === oldValueOfValue || newValue !== newValue && oldValueOfValue !== oldValueOfValue
                }
                function inputsWatchDelegate(scope, listener, objectEquality, parsedExpression) {
                    var lastResult, inputExpressions = parsedExpression.$$inputs || (parsedExpression.$$inputs = collectExpressionInputs(parsedExpression.inputs, []));
                    if (1 === inputExpressions.length) {
                        var oldInputValue = expressionInputDirtyCheck;
                        return inputExpressions = inputExpressions[0], scope.$watch(function (scope) {
                            var newInputValue = inputExpressions(scope);
                            return expressionInputDirtyCheck(newInputValue, oldInputValue) || (lastResult = parsedExpression(scope), oldInputValue = newInputValue && getValueOf(newInputValue)), lastResult
                        }, listener, objectEquality)
                    }
                    for (var oldInputValueOfValues = [], i = 0, ii = inputExpressions.length; ii > i; i++)
                        oldInputValueOfValues[i] = expressionInputDirtyCheck;
                    return scope.$watch(function (scope) {
                        for (var changed = !1, i = 0, ii = inputExpressions.length; ii > i; i++) {
                            var newInputValue = inputExpressions[i](scope);
                            (changed || (changed = !expressionInputDirtyCheck(newInputValue, oldInputValueOfValues[i]))) && (oldInputValueOfValues[i] = newInputValue && getValueOf(newInputValue))
                        }
                        return changed && (lastResult = parsedExpression(scope)), lastResult
                    }, listener, objectEquality)
                }
                function oneTimeWatchDelegate(scope, listener, objectEquality, parsedExpression) {
                    var unwatch, lastValue;
                    return unwatch = scope.$watch(function (scope) {
                        return parsedExpression(scope)
                    }, function (value, old, scope) {
                        lastValue = value, isFunction(listener) && listener.apply(this, arguments), isDefined(value) && scope.$$postDigest(function () {
                            isDefined(lastValue) && unwatch()
                        })
                    }, objectEquality)
                }
                function oneTimeLiteralWatchDelegate(scope, listener, objectEquality, parsedExpression) {
                    function isAllDefined(value) {
                        var allDefined = !0;
                        return forEach(value, function (val) {
                            isDefined(val) || (allDefined = !1)
                        }), allDefined
                    }
                    var unwatch, lastValue;
                    return unwatch = scope.$watch(function (scope) {
                        return parsedExpression(scope)
                    }, function (value, old, scope) {
                        lastValue = value, isFunction(listener) && listener.call(this, value, old, scope), isAllDefined(value) && scope.$$postDigest(function () {
                            isAllDefined(lastValue) && unwatch()
                        })
                    }, objectEquality)
                }
                function constantWatchDelegate(scope, listener, objectEquality, parsedExpression) {
                    var unwatch;
                    return unwatch = scope.$watch(function (scope) {
                        return parsedExpression(scope)
                    }, function () {
                        isFunction(listener) && listener.apply(this, arguments), unwatch()
                    }, objectEquality)
                }
                function addInterceptor(parsedExpression, interceptorFn) {
                    if (!interceptorFn)
                        return parsedExpression;
                    var watchDelegate = parsedExpression.$$watchDelegate, regularWatch = watchDelegate !== oneTimeLiteralWatchDelegate && watchDelegate !== oneTimeWatchDelegate, fn = regularWatch ? function (scope, locals) {
                        var value = parsedExpression(scope, locals);
                        return interceptorFn(value, scope, locals)
                    } : function (scope, locals) {
                        var value = parsedExpression(scope, locals), result = interceptorFn(value, scope, locals);
                        return isDefined(value) ? result : value
                    };
                    return parsedExpression.$$watchDelegate && parsedExpression.$$watchDelegate !== inputsWatchDelegate ? fn.$$watchDelegate = parsedExpression.$$watchDelegate : interceptorFn.$stateful || (fn.$$watchDelegate = inputsWatchDelegate, fn.inputs = [parsedExpression]), fn
                }
                var $parseOptions = {csp: $sniffer.csp, expensiveChecks: !1}, $parseOptionsExpensive = {csp: $sniffer.csp, expensiveChecks: !0};
                return function (exp, interceptorFn, expensiveChecks) {
                    var parsedExpression, oneTime, cacheKey;
                    switch (typeof exp) {
                        case"string":
                            cacheKey = exp = exp.trim();
                            var cache = expensiveChecks ? cacheExpensive : cacheDefault;
                            if (parsedExpression = cache[cacheKey], !parsedExpression) {
                                ":" === exp.charAt(0) && ":" === exp.charAt(1) && (oneTime = !0, exp = exp.substring(2));
                                var parseOptions = expensiveChecks ? $parseOptionsExpensive : $parseOptions, lexer = new Lexer(parseOptions), parser = new Parser(lexer, $filter, parseOptions);
                                parsedExpression = parser.parse(exp), parsedExpression.constant ? parsedExpression.$$watchDelegate = constantWatchDelegate : oneTime ? (parsedExpression = wrapSharedExpression(parsedExpression), parsedExpression.$$watchDelegate = parsedExpression.literal ? oneTimeLiteralWatchDelegate : oneTimeWatchDelegate) : parsedExpression.inputs && (parsedExpression.$$watchDelegate = inputsWatchDelegate), cache[cacheKey] = parsedExpression
                            }
                            return addInterceptor(parsedExpression, interceptorFn);
                        case"function":
                            return addInterceptor(exp, interceptorFn);
                        default:
                            return addInterceptor(noop, interceptorFn)
                        }
                }
            }]
    }
    function $QProvider() {
        this.$get = ["$rootScope", "$exceptionHandler", function ($rootScope, $exceptionHandler) {
                return qFactory(function (callback) {
                    $rootScope.$evalAsync(callback)
                }, $exceptionHandler)
            }]
    }
    function $$QProvider() {
        this.$get = ["$browser", "$exceptionHandler", function ($browser, $exceptionHandler) {
                return qFactory(function (callback) {
                    $browser.defer(callback)
                }, $exceptionHandler)
            }]
    }
    function qFactory(nextTick, exceptionHandler) {
        function callOnce(self, resolveFn, rejectFn) {
            function wrap(fn) {
                return function (value) {
                    called || (called = !0, fn.call(self, value))
                }
            }
            var called = !1;
            return[wrap(resolveFn), wrap(rejectFn)]
        }
        function Promise() {
            this.$$state = {status: 0}
        }
        function simpleBind(context, fn) {
            return function (value) {
                fn.call(context, value)
            }
        }
        function processQueue(state) {
            var fn, promise, pending;
            pending = state.pending, state.processScheduled = !1, state.pending = undefined;
            for (var i = 0, ii = pending.length; ii > i; ++i) {
                promise = pending[i][0], fn = pending[i][state.status];
                try {
                    isFunction(fn) ? promise.resolve(fn(state.value)) : 1 === state.status ? promise.resolve(state.value) : promise.reject(state.value)
                } catch (e) {
                    promise.reject(e), exceptionHandler(e)
                }
            }
        }
        function scheduleProcessQueue(state) {
            !state.processScheduled && state.pending && (state.processScheduled = !0, nextTick(function () {
                processQueue(state)
            }))
        }
        function Deferred() {
            this.promise = new Promise, this.resolve = simpleBind(this, this.resolve), this.reject = simpleBind(this, this.reject), this.notify = simpleBind(this, this.notify)
        }
        function all(promises) {
            var deferred = new Deferred, counter = 0, results = isArray(promises) ? [] : {};
            return forEach(promises, function (promise, key) {
                counter++, when(promise).then(function (value) {
                    results.hasOwnProperty(key) || (results[key] = value, --counter || deferred.resolve(results))
                }, function (reason) {
                    results.hasOwnProperty(key) || deferred.reject(reason)
                })
            }), 0 === counter && deferred.resolve(results), deferred.promise
        }
        var $qMinErr = minErr("$q", TypeError), defer = function () {
            return new Deferred
        };
        Promise.prototype = {then: function (onFulfilled, onRejected, progressBack) {
                var result = new Deferred;
                return this.$$state.pending = this.$$state.pending || [], this.$$state.pending.push([result, onFulfilled, onRejected, progressBack]), this.$$state.status > 0 && scheduleProcessQueue(this.$$state), result.promise
            }, "catch": function (callback) {
                return this.then(null, callback)
            }, "finally": function (callback, progressBack) {
                return this.then(function (value) {
                    return handleCallback(value, !0, callback)
                }, function (error) {
                    return handleCallback(error, !1, callback)
                }, progressBack)
            }}, Deferred.prototype = {resolve: function (val) {
                this.promise.$$state.status || (val === this.promise ? this.$$reject($qMinErr("qcycle", "Expected promise to be resolved with value other than itself '{0}'", val)) : this.$$resolve(val))
            }, $$resolve: function (val) {
                var then, fns;
                fns = callOnce(this, this.$$resolve, this.$$reject);
                try {
                    (isObject(val) || isFunction(val)) && (then = val && val.then), isFunction(then) ? (this.promise.$$state.status = -1, then.call(val, fns[0], fns[1], this.notify)) : (this.promise.$$state.value = val, this.promise.$$state.status = 1, scheduleProcessQueue(this.promise.$$state))
                } catch (e) {
                    fns[1](e), exceptionHandler(e)
                }
            }, reject: function (reason) {
                this.promise.$$state.status || this.$$reject(reason)
            }, $$reject: function (reason) {
                this.promise.$$state.value = reason, this.promise.$$state.status = 2, scheduleProcessQueue(this.promise.$$state)
            }, notify: function (progress) {
                var callbacks = this.promise.$$state.pending;
                this.promise.$$state.status <= 0 && callbacks && callbacks.length && nextTick(function () {
                    for (var callback, result, i = 0, ii = callbacks.length; ii > i; i++) {
                        result = callbacks[i][0], callback = callbacks[i][3];
                        try {
                            result.notify(isFunction(callback) ? callback(progress) : progress)
                        } catch (e) {
                            exceptionHandler(e)
                        }
                    }
                })
            }};
        var reject = function (reason) {
            var result = new Deferred;
            return result.reject(reason), result.promise
        }, makePromise = function (value, resolved) {
            var result = new Deferred;
            return resolved ? result.resolve(value) : result.reject(value), result.promise
        }, handleCallback = function (value, isResolved, callback) {
            var callbackOutput = null;
            try {
                isFunction(callback) && (callbackOutput = callback())
            } catch (e) {
                return makePromise(e, !1)
            }
            return isPromiseLike(callbackOutput) ? callbackOutput.then(function () {
                return makePromise(value, isResolved)
            }, function (error) {
                return makePromise(error, !1)
            }) : makePromise(value, isResolved)
        }, when = function (value, callback, errback, progressBack) {
            var result = new Deferred;
            return result.resolve(value), result.promise.then(callback, errback, progressBack)
        }, $Q = function Q(resolver) {
            function resolveFn(value) {
                deferred.resolve(value)
            }
            function rejectFn(reason) {
                deferred.reject(reason)
            }
            if (!isFunction(resolver))
                throw $qMinErr("norslvr", "Expected resolverFn, got '{0}'", resolver);
            if (!(this instanceof Q))
                return new Q(resolver);
            var deferred = new Deferred;
            return resolver(resolveFn, rejectFn), deferred.promise
        };
        return $Q.defer = defer, $Q.reject = reject, $Q.when = when, $Q.all = all, $Q
    }
    function $$RAFProvider() {
        this.$get = ["$window", "$timeout", function ($window, $timeout) {
                var requestAnimationFrame = $window.requestAnimationFrame || $window.webkitRequestAnimationFrame || $window.mozRequestAnimationFrame, cancelAnimationFrame = $window.cancelAnimationFrame || $window.webkitCancelAnimationFrame || $window.mozCancelAnimationFrame || $window.webkitCancelRequestAnimationFrame, rafSupported = !!requestAnimationFrame, raf = rafSupported ? function (fn) {
                    var id = requestAnimationFrame(fn);
                    return function () {
                        cancelAnimationFrame(id)
                    }
                } : function (fn) {
                    var timer = $timeout(fn, 16.66, !1);
                    return function () {
                        $timeout.cancel(timer)
                    }
                };
                return raf.supported = rafSupported, raf
            }]
    }
    function $RootScopeProvider() {
        var TTL = 10, $rootScopeMinErr = minErr("$rootScope"), lastDirtyWatch = null, applyAsyncId = null;
        this.digestTtl = function (value) {
            return arguments.length && (TTL = value), TTL
        }, this.$get = ["$injector", "$exceptionHandler", "$parse", "$browser", function ($injector, $exceptionHandler, $parse, $browser) {
                function Scope() {
                    this.$id = nextUid(), this.$$phase = this.$parent = this.$$watchers = this.$$nextSibling = this.$$prevSibling = this.$$childHead = this.$$childTail = null, this.$root = this, this.$$destroyed = !1, this.$$listeners = {}, this.$$listenerCount = {}, this.$$isolateBindings = null
                }
                function beginPhase(phase) {
                    if ($rootScope.$$phase)
                        throw $rootScopeMinErr("inprog", "{0} already in progress", $rootScope.$$phase);
                    $rootScope.$$phase = phase
                }
                function clearPhase() {
                    $rootScope.$$phase = null
                }
                function decrementListenerCount(current, count, name) {
                    do
                        current.$$listenerCount[name] -= count, 0 === current.$$listenerCount[name] && delete current.$$listenerCount[name];
                    while (current = current.$parent)
                }
                function initWatchVal() {
                }
                function flushApplyAsync() {
                    for (; applyAsyncQueue.length; )
                        try {
                            applyAsyncQueue.shift()()
                        } catch (e) {
                            $exceptionHandler(e)
                        }
                    applyAsyncId = null
                }
                function scheduleApplyAsync() {
                    null === applyAsyncId && (applyAsyncId = $browser.defer(function () {
                        $rootScope.$apply(flushApplyAsync)
                    }))
                }
                Scope.prototype = {constructor: Scope, $new: function (isolate, parent) {
                        function destroyChild() {
                            child.$$destroyed = !0
                        }
                        var child;
                        return parent = parent || this, isolate ? (child = new Scope, child.$root = this.$root) : (this.$$ChildScope || (this.$$ChildScope = function () {
                            this.$$watchers = this.$$nextSibling = this.$$childHead = this.$$childTail = null, this.$$listeners = {}, this.$$listenerCount = {}, this.$id = nextUid(), this.$$ChildScope = null
                        }, this.$$ChildScope.prototype = this), child = new this.$$ChildScope), child.$parent = parent, child.$$prevSibling = parent.$$childTail, parent.$$childHead ? (parent.$$childTail.$$nextSibling = child, parent.$$childTail = child) : parent.$$childHead = parent.$$childTail = child, (isolate || parent != this) && child.$on("$destroy", destroyChild), child
                    }, $watch: function (watchExp, listener, objectEquality) {
                        var get = $parse(watchExp);
                        if (get.$$watchDelegate)
                            return get.$$watchDelegate(this, listener, objectEquality, get);
                        var scope = this, array = scope.$$watchers, watcher = {fn: listener, last: initWatchVal, get: get, exp: watchExp, eq: !!objectEquality};
                        return lastDirtyWatch = null, isFunction(listener) || (watcher.fn = noop), array || (array = scope.$$watchers = []), array.unshift(watcher), function () {
                            arrayRemove(array, watcher), lastDirtyWatch = null
                        }
                    }, $watchGroup: function (watchExpressions, listener) {
                        function watchGroupAction() {
                            changeReactionScheduled = !1, firstRun ? (firstRun = !1, listener(newValues, newValues, self)) : listener(newValues, oldValues, self)
                        }
                        var oldValues = new Array(watchExpressions.length), newValues = new Array(watchExpressions.length), deregisterFns = [], self = this, changeReactionScheduled = !1, firstRun = !0;
                        if (!watchExpressions.length) {
                            var shouldCall = !0;
                            return self.$evalAsync(function () {
                                shouldCall && listener(newValues, newValues, self)
                            }), function () {
                                shouldCall = !1
                            }
                        }
                        return 1 === watchExpressions.length ? this.$watch(watchExpressions[0], function (value, oldValue, scope) {
                            newValues[0] = value, oldValues[0] = oldValue, listener(newValues, value === oldValue ? newValues : oldValues, scope)
                        }) : (forEach(watchExpressions, function (expr, i) {
                            var unwatchFn = self.$watch(expr, function (value, oldValue) {
                                newValues[i] = value, oldValues[i] = oldValue, changeReactionScheduled || (changeReactionScheduled = !0, self.$evalAsync(watchGroupAction))
                            });
                            deregisterFns.push(unwatchFn)
                        }), function () {
                            for (; deregisterFns.length; )
                                deregisterFns.shift()()
                        })
                    }, $watchCollection: function (obj, listener) {
                        function $watchCollectionInterceptor(_value) {
                            newValue = _value;
                            var newLength, key, bothNaN, newItem, oldItem;
                            if (!isUndefined(newValue)) {
                                if (isObject(newValue))
                                    if (isArrayLike(newValue)) {
                                        oldValue !== internalArray && (oldValue = internalArray, oldLength = oldValue.length = 0, changeDetected++), newLength = newValue.length, oldLength !== newLength && (changeDetected++, oldValue.length = oldLength = newLength);
                                        for (var i = 0; newLength > i; i++)
                                            oldItem = oldValue[i], newItem = newValue[i], bothNaN = oldItem !== oldItem && newItem !== newItem, bothNaN || oldItem === newItem || (changeDetected++, oldValue[i] = newItem)
                                    } else {
                                        oldValue !== internalObject && (oldValue = internalObject = {}, oldLength = 0, changeDetected++), newLength = 0;
                                        for (key in newValue)
                                            newValue.hasOwnProperty(key) && (newLength++, newItem = newValue[key], oldItem = oldValue[key], key in oldValue ? (bothNaN = oldItem !== oldItem && newItem !== newItem, bothNaN || oldItem === newItem || (changeDetected++, oldValue[key] = newItem)) : (oldLength++, oldValue[key] = newItem, changeDetected++));
                                        if (oldLength > newLength) {
                                            changeDetected++;
                                            for (key in oldValue)
                                                newValue.hasOwnProperty(key) || (oldLength--, delete oldValue[key])
                                        }
                                    }
                                else
                                    oldValue !== newValue && (oldValue = newValue, changeDetected++);
                                return changeDetected
                            }
                        }
                        function $watchCollectionAction() {
                            if (initRun ? (initRun = !1, listener(newValue, newValue, self)) : listener(newValue, veryOldValue, self), trackVeryOldValue)
                                if (isObject(newValue))
                                    if (isArrayLike(newValue)) {
                                        veryOldValue = new Array(newValue.length);
                                        for (var i = 0; i < newValue.length; i++)
                                            veryOldValue[i] = newValue[i]
                                    } else {
                                        veryOldValue = {};
                                        for (var key in newValue)
                                            hasOwnProperty.call(newValue, key) && (veryOldValue[key] = newValue[key])
                                    }
                                else
                                    veryOldValue = newValue
                        }
                        $watchCollectionInterceptor.$stateful = !0;
                        var newValue, oldValue, veryOldValue, self = this, trackVeryOldValue = listener.length > 1, changeDetected = 0, changeDetector = $parse(obj, $watchCollectionInterceptor), internalArray = [], internalObject = {}, initRun = !0, oldLength = 0;
                        return this.$watch(changeDetector, $watchCollectionAction)
                    }, $digest: function () {
                        var watch, value, last, watchers, length, dirty, next, current, logIdx, asyncTask, ttl = TTL, target = this, watchLog = [];
                        beginPhase("$digest"), $browser.$$checkUrlChange(), this === $rootScope && null !== applyAsyncId && ($browser.defer.cancel(applyAsyncId), flushApplyAsync()), lastDirtyWatch = null;
                        do {
                            for (dirty = !1, current = target; asyncQueue.length; ) {
                                try {
                                    asyncTask = asyncQueue.shift(), asyncTask.scope.$eval(asyncTask.expression)
                                } catch (e) {
                                    $exceptionHandler(e)
                                }
                                lastDirtyWatch = null
                            }
                            traverseScopesLoop:do {
                                if (watchers = current.$$watchers)
                                    for (length = watchers.length; length--; )
                                        try {
                                            if (watch = watchers[length])
                                                if ((value = watch.get(current)) === (last = watch.last) || (watch.eq ? equals(value, last) : "number" == typeof value && "number" == typeof last && isNaN(value) && isNaN(last))) {
                                                    if (watch === lastDirtyWatch) {
                                                        dirty = !1;
                                                        break traverseScopesLoop
                                                    }
                                                } else
                                                    dirty = !0, lastDirtyWatch = watch, watch.last = watch.eq ? copy(value, null) : value, watch.fn(value, last === initWatchVal ? value : last, current), 5 > ttl && (logIdx = 4 - ttl, watchLog[logIdx] || (watchLog[logIdx] = []), watchLog[logIdx].push({msg: isFunction(watch.exp) ? "fn: " + (watch.exp.name || watch.exp.toString()) : watch.exp, newVal: value, oldVal: last}))
                                        } catch (e) {
                                            $exceptionHandler(e)
                                        }
                                if (!(next = current.$$childHead || current !== target && current.$$nextSibling))
                                    for (; current !== target && !(next = current.$$nextSibling); )
                                        current = current.$parent
                            } while (current = next);
                            if ((dirty || asyncQueue.length) && !ttl--)
                                throw clearPhase(), $rootScopeMinErr("infdig", "{0} $digest() iterations reached. Aborting!\nWatchers fired in the last 5 iterations: {1}", TTL, watchLog)
                        } while (dirty || asyncQueue.length);
                        for (clearPhase(); postDigestQueue.length; )
                            try {
                                postDigestQueue.shift()()
                            } catch (e) {
                                $exceptionHandler(e)
                            }
                    }, $destroy: function () {
                        if (!this.$$destroyed) {
                            var parent = this.$parent;
                            if (this.$broadcast("$destroy"), this.$$destroyed = !0, this !== $rootScope) {
                                for (var eventName in this.$$listenerCount)
                                    decrementListenerCount(this, this.$$listenerCount[eventName], eventName);
                                parent.$$childHead == this && (parent.$$childHead = this.$$nextSibling), parent.$$childTail == this && (parent.$$childTail = this.$$prevSibling), this.$$prevSibling && (this.$$prevSibling.$$nextSibling = this.$$nextSibling), this.$$nextSibling && (this.$$nextSibling.$$prevSibling = this.$$prevSibling), this.$destroy = this.$digest = this.$apply = this.$evalAsync = this.$applyAsync = noop, this.$on = this.$watch = this.$watchGroup = function () {
                                    return noop
                                }, this.$$listeners = {}, this.$parent = this.$$nextSibling = this.$$prevSibling = this.$$childHead = this.$$childTail = this.$root = this.$$watchers = null
                            }
                        }
                    }, $eval: function (expr, locals) {
                        return $parse(expr)(this, locals)
                    }, $evalAsync: function (expr) {
                        $rootScope.$$phase || asyncQueue.length || $browser.defer(function () {
                            asyncQueue.length && $rootScope.$digest()
                        }), asyncQueue.push({scope: this, expression: expr})
                    }, $$postDigest: function (fn) {
                        postDigestQueue.push(fn)
                    }, $apply: function (expr) {
                        try {
                            return beginPhase("$apply"), this.$eval(expr)
                        } catch (e) {
                            $exceptionHandler(e)
                        } finally {
                            clearPhase();
                            try {
                                $rootScope.$digest()
                            } catch (e) {
                                throw $exceptionHandler(e), e
                            }
                        }
                    }, $applyAsync: function (expr) {
                        function $applyAsyncExpression() {
                            scope.$eval(expr)
                        }
                        var scope = this;
                        expr && applyAsyncQueue.push($applyAsyncExpression), scheduleApplyAsync()
                    }, $on: function (name, listener) {
                        var namedListeners = this.$$listeners[name];
                        namedListeners || (this.$$listeners[name] = namedListeners = []), namedListeners.push(listener);
                        var current = this;
                        do
                            current.$$listenerCount[name] || (current.$$listenerCount[name] = 0), current.$$listenerCount[name]++;
                        while (current = current.$parent);
                        var self = this;
                        return function () {
                            var indexOfListener = namedListeners.indexOf(listener);
                            -1 !== indexOfListener && (namedListeners[indexOfListener] = null, decrementListenerCount(self, 1, name))
                        }
                    }, $emit: function (name) {
                        var namedListeners, i, length, empty = [], scope = this, stopPropagation = !1, event = {name: name, targetScope: scope, stopPropagation: function () {
                                stopPropagation = !0
                            }, preventDefault: function () {
                                event.defaultPrevented = !0
                            }, defaultPrevented: !1}, listenerArgs = concat([event], arguments, 1);
                        do {
                            for (namedListeners = scope.$$listeners[name] || empty, event.currentScope = scope, i = 0, length = namedListeners.length; length > i; i++)
                                if (namedListeners[i])
                                    try {
                                        namedListeners[i].apply(null, listenerArgs)
                                    } catch (e) {
                                        $exceptionHandler(e)
                                    }
                                else
                                    namedListeners.splice(i, 1), i--, length--;
                            if (stopPropagation)
                                return event.currentScope = null, event;
                            scope = scope.$parent
                        } while (scope);
                        return event.currentScope = null, event
                    }, $broadcast: function (name) {
                        var target = this, current = target, next = target, event = {name: name, targetScope: target, preventDefault: function () {
                                event.defaultPrevented = !0
                            }, defaultPrevented: !1};
                        if (!target.$$listenerCount[name])
                            return event;
                        for (var listeners, i, length, listenerArgs = concat([event], arguments, 1); current = next; ) {
                            for (event.currentScope = current, listeners = current.$$listeners[name] || [], i = 0, length = listeners.length; length > i; i++)
                                if (listeners[i])
                                    try {
                                        listeners[i].apply(null, listenerArgs)
                                    } catch (e) {
                                        $exceptionHandler(e)
                                    }
                                else
                                    listeners.splice(i, 1), i--, length--;
                            if (!(next = current.$$listenerCount[name] && current.$$childHead || current !== target && current.$$nextSibling))
                                for (; current !== target && !(next = current.$$nextSibling); )
                                    current = current.$parent
                        }
                        return event.currentScope = null, event
                    }};
                var $rootScope = new Scope, asyncQueue = $rootScope.$$asyncQueue = [], postDigestQueue = $rootScope.$$postDigestQueue = [], applyAsyncQueue = $rootScope.$$applyAsyncQueue = [];
                return $rootScope
            }]
    }
    function $$SanitizeUriProvider() {
        var aHrefSanitizationWhitelist = /^\s*(https?|ftp|mailto|tel|file):/, imgSrcSanitizationWhitelist = /^\s*((https?|ftp|file|blob):|data:image\/)/;
        this.aHrefSanitizationWhitelist = function (regexp) {
            return isDefined(regexp) ? (aHrefSanitizationWhitelist = regexp, this) : aHrefSanitizationWhitelist
        }, this.imgSrcSanitizationWhitelist = function (regexp) {
            return isDefined(regexp) ? (imgSrcSanitizationWhitelist = regexp, this) : imgSrcSanitizationWhitelist
        }, this.$get = function () {
            return function (uri, isImage) {
                var normalizedVal, regex = isImage ? imgSrcSanitizationWhitelist : aHrefSanitizationWhitelist;
                return normalizedVal = urlResolve(uri).href, "" === normalizedVal || normalizedVal.match(regex) ? uri : "unsafe:" + normalizedVal
            }
        }
    }
    function adjustMatcher(matcher) {
        if ("self" === matcher)
            return matcher;
        if (isString(matcher)) {
            if (matcher.indexOf("***") > -1)
                throw $sceMinErr("iwcard", "Illegal sequence *** in string matcher.  String: {0}", matcher);
            return matcher = escapeForRegexp(matcher).replace("\\*\\*", ".*").replace("\\*", "[^:/.?&;]*"), new RegExp("^" + matcher + "$")
        }
        if (isRegExp(matcher))
            return new RegExp("^" + matcher.source + "$");
        throw $sceMinErr("imatcher", 'Matchers may only be "self", string patterns or RegExp objects')
    }
    function adjustMatchers(matchers) {
        var adjustedMatchers = [];
        return isDefined(matchers) && forEach(matchers, function (matcher) {
            adjustedMatchers.push(adjustMatcher(matcher))
        }), adjustedMatchers
    }
    function $SceDelegateProvider() {
        this.SCE_CONTEXTS = SCE_CONTEXTS;
        var resourceUrlWhitelist = ["self"], resourceUrlBlacklist = [];
        this.resourceUrlWhitelist = function (value) {
            return arguments.length && (resourceUrlWhitelist = adjustMatchers(value)), resourceUrlWhitelist
        }, this.resourceUrlBlacklist = function (value) {
            return arguments.length && (resourceUrlBlacklist = adjustMatchers(value)), resourceUrlBlacklist
        }, this.$get = ["$injector", function ($injector) {
                function matchUrl(matcher, parsedUrl) {
                    return"self" === matcher ? urlIsSameOrigin(parsedUrl) : !!matcher.exec(parsedUrl.href)
                }
                function isResourceUrlAllowedByPolicy(url) {
                    var i, n, parsedUrl = urlResolve(url.toString()), allowed = !1;
                    for (i = 0, n = resourceUrlWhitelist.length; n > i; i++)
                        if (matchUrl(resourceUrlWhitelist[i], parsedUrl)) {
                            allowed = !0;
                            break
                        }
                    if (allowed)
                        for (i = 0, n = resourceUrlBlacklist.length; n > i; i++)
                            if (matchUrl(resourceUrlBlacklist[i], parsedUrl)) {
                                allowed = !1;
                                break
                            }
                    return allowed
                }
                function generateHolderType(Base) {
                    var holderType = function (trustedValue) {
                        this.$$unwrapTrustedValue = function () {
                            return trustedValue
                        }
                    };
                    return Base && (holderType.prototype = new Base), holderType.prototype.valueOf = function () {
                        return this.$$unwrapTrustedValue()
                    }, holderType.prototype.toString = function () {
                        return this.$$unwrapTrustedValue().toString()
                    }, holderType
                }
                function trustAs(type, trustedValue) {
                    var Constructor = byType.hasOwnProperty(type) ? byType[type] : null;
                    if (!Constructor)
                        throw $sceMinErr("icontext", "Attempted to trust a value in invalid context. Context: {0}; Value: {1}", type, trustedValue);
                    if (null === trustedValue || trustedValue === undefined || "" === trustedValue)
                        return trustedValue;
                    if ("string" != typeof trustedValue)
                        throw $sceMinErr("itype", "Attempted to trust a non-string value in a content requiring a string: Context: {0}", type);
                    return new Constructor(trustedValue)
                }
                function valueOf(maybeTrusted) {
                    return maybeTrusted instanceof trustedValueHolderBase ? maybeTrusted.$$unwrapTrustedValue() : maybeTrusted
                }
                function getTrusted(type, maybeTrusted) {
                    if (null === maybeTrusted || maybeTrusted === undefined || "" === maybeTrusted)
                        return maybeTrusted;
                    var constructor = byType.hasOwnProperty(type) ? byType[type] : null;
                    if (constructor && maybeTrusted instanceof constructor)
                        return maybeTrusted.$$unwrapTrustedValue();
                    if (type === SCE_CONTEXTS.RESOURCE_URL) {
                        if (isResourceUrlAllowedByPolicy(maybeTrusted))
                            return maybeTrusted;
                        throw $sceMinErr("insecurl", "Blocked loading resource from url not allowed by $sceDelegate policy.  URL: {0}", maybeTrusted.toString())
                    }
                    if (type === SCE_CONTEXTS.HTML)
                        return htmlSanitizer(maybeTrusted);
                    throw $sceMinErr("unsafe", "Attempting to use an unsafe value in a safe context.")
                }
                var htmlSanitizer = function () {
                    throw $sceMinErr("unsafe", "Attempting to use an unsafe value in a safe context.")
                };
                $injector.has("$sanitize") && (htmlSanitizer = $injector.get("$sanitize"));
                var trustedValueHolderBase = generateHolderType(), byType = {};
                return byType[SCE_CONTEXTS.HTML] = generateHolderType(trustedValueHolderBase), byType[SCE_CONTEXTS.CSS] = generateHolderType(trustedValueHolderBase), byType[SCE_CONTEXTS.URL] = generateHolderType(trustedValueHolderBase), byType[SCE_CONTEXTS.JS] = generateHolderType(trustedValueHolderBase), byType[SCE_CONTEXTS.RESOURCE_URL] = generateHolderType(byType[SCE_CONTEXTS.URL]), {trustAs: trustAs, getTrusted: getTrusted, valueOf: valueOf}
            }]
    }
    function $SceProvider() {
        var enabled = !0;
        this.enabled = function (value) {
            return arguments.length && (enabled = !!value), enabled
        }, this.$get = ["$parse", "$sceDelegate", function ($parse, $sceDelegate) {
                if (enabled && 8 > msie)
                    throw $sceMinErr("iequirks", "Strict Contextual Escaping does not support Internet Explorer version < 11 in quirks mode.  You can fix this by adding the text <!doctype html> to the top of your HTML document.  See http://docs.angularjs.org/api/ng.$sce for more information.");
                var sce = shallowCopy(SCE_CONTEXTS);
                sce.isEnabled = function () {
                    return enabled
                }, sce.trustAs = $sceDelegate.trustAs, sce.getTrusted = $sceDelegate.getTrusted, sce.valueOf = $sceDelegate.valueOf, enabled || (sce.trustAs = sce.getTrusted = function (type, value) {
                    return value
                }, sce.valueOf = identity), sce.parseAs = function (type, expr) {
                    var parsed = $parse(expr);
                    return parsed.literal && parsed.constant ? parsed : $parse(expr, function (value) {
                        return sce.getTrusted(type, value)
                    })
                };
                var parse = sce.parseAs, getTrusted = sce.getTrusted, trustAs = sce.trustAs;
                return forEach(SCE_CONTEXTS, function (enumValue, name) {
                    var lName = lowercase(name);
                    sce[camelCase("parse_as_" + lName)] = function (expr) {
                        return parse(enumValue, expr)
                    }, sce[camelCase("get_trusted_" + lName)] = function (value) {
                        return getTrusted(enumValue, value)
                    }, sce[camelCase("trust_as_" + lName)] = function (value) {
                        return trustAs(enumValue, value)
                    }
                }), sce
            }]
    }
    function $SnifferProvider() {
        this.$get = ["$window", "$document", function ($window, $document) {
                var vendorPrefix, match, eventSupport = {}, android = int((/android (\d+)/.exec(lowercase(($window.navigator || {}).userAgent)) || [])[1]), boxee = /Boxee/i.test(($window.navigator || {}).userAgent), document = $document[0] || {}, vendorRegex = /^(Moz|webkit|ms)(?=[A-Z])/, bodyStyle = document.body && document.body.style, transitions = !1, animations = !1;
                if (bodyStyle) {
                    for (var prop in bodyStyle)
                        if (match = vendorRegex.exec(prop)) {
                            vendorPrefix = match[0], vendorPrefix = vendorPrefix.substr(0, 1).toUpperCase() + vendorPrefix.substr(1);
                            break
                        }
                    vendorPrefix || (vendorPrefix = "WebkitOpacity"in bodyStyle && "webkit"), transitions = !!("transition"in bodyStyle || vendorPrefix + "Transition"in bodyStyle), animations = !!("animation"in bodyStyle || vendorPrefix + "Animation"in bodyStyle), !android || transitions && animations || (transitions = isString(document.body.style.webkitTransition), animations = isString(document.body.style.webkitAnimation))
                }
                return{history: !(!$window.history || !$window.history.pushState || 4 > android || boxee), hasEvent: function (event) {
                        if ("input" == event && 9 == msie)
                            return!1;
                        if (isUndefined(eventSupport[event])) {
                            var divElm = document.createElement("div");
                            eventSupport[event] = "on" + event in divElm
                        }
                        return eventSupport[event]
                    }, csp: csp(), vendorPrefix: vendorPrefix, transitions: transitions, animations: animations, android: android}
            }]
    }
    function $TemplateRequestProvider() {
        this.$get = ["$templateCache", "$http", "$q", function ($templateCache, $http, $q) {
                function handleRequestFn(tpl, ignoreRequestError) {
                    function handleError(resp) {
                        if (self.totalPendingRequests--, !ignoreRequestError)
                            throw $compileMinErr("tpload", "Failed to load template: {0}", tpl);
                        return $q.reject(resp)
                    }
                    var self = handleRequestFn;
                    self.totalPendingRequests++;
                    var transformResponse = $http.defaults && $http.defaults.transformResponse;
                    isArray(transformResponse) ? transformResponse = transformResponse.filter(function (transformer) {
                        return transformer !== defaultHttpResponseTransform
                    }) : transformResponse === defaultHttpResponseTransform && (transformResponse = null);
                    var httpOptions = {cache: $templateCache, transformResponse: transformResponse};
                    return $http.get(tpl, httpOptions).then(function (response) {
                        var html = response.data;
                        return self.totalPendingRequests--, $templateCache.put(tpl, html), html
                    }, handleError)
                }
                return handleRequestFn.totalPendingRequests = 0, handleRequestFn
            }]
    }
    function $$TestabilityProvider() {
        this.$get = ["$rootScope", "$browser", "$location", function ($rootScope, $browser, $location) {
                var testability = {};
                return testability.findBindings = function (element, expression, opt_exactMatch) {
                    var bindings = element.getElementsByClassName("ng-binding"), matches = [];
                    return forEach(bindings, function (binding) {
                        var dataBinding = angular.element(binding).data("$binding");
                        dataBinding && forEach(dataBinding, function (bindingName) {
                            if (opt_exactMatch) {
                                var matcher = new RegExp("(^|\\s)" + escapeForRegexp(expression) + "(\\s|\\||$)");
                                matcher.test(bindingName) && matches.push(binding)
                            } else
                                -1 != bindingName.indexOf(expression) && matches.push(binding)
                        })
                    }), matches
                }, testability.findModels = function (element, expression, opt_exactMatch) {
                    for (var prefixes = ["ng-", "data-ng-", "ng\\:"], p = 0; p < prefixes.length; ++p) {
                        var attributeEquals = opt_exactMatch ? "=" : "*=", selector = "[" + prefixes[p] + "model" + attributeEquals + '"' + expression + '"]', elements = element.querySelectorAll(selector);
                        if (elements.length)
                            return elements
                    }
                }, testability.getLocation = function () {
                    return $location.url()
                }, testability.setLocation = function (url) {
                    url !== $location.url() && ($location.url(url), $rootScope.$digest())
                }, testability.whenStable = function (callback) {
                    $browser.notifyWhenNoOutstandingRequests(callback)
                }, testability
            }]
    }
    function $TimeoutProvider() {
        this.$get = ["$rootScope", "$browser", "$q", "$$q", "$exceptionHandler", function ($rootScope, $browser, $q, $$q, $exceptionHandler) {
                function timeout(fn, delay, invokeApply) {
                    var timeoutId, skipApply = isDefined(invokeApply) && !invokeApply, deferred = (skipApply ? $$q : $q).defer(), promise = deferred.promise;
                    return timeoutId = $browser.defer(function () {
                        try {
                            deferred.resolve(fn())
                        } catch (e) {
                            deferred.reject(e), $exceptionHandler(e)
                        } finally {
                            delete deferreds[promise.$$timeoutId]
                        }
                        skipApply || $rootScope.$apply()
                    }, delay), promise.$$timeoutId = timeoutId, deferreds[timeoutId] = deferred, promise
                }
                var deferreds = {};
                return timeout.cancel = function (promise) {
                    return promise && promise.$$timeoutId in deferreds ? (deferreds[promise.$$timeoutId].reject("canceled"), delete deferreds[promise.$$timeoutId], $browser.defer.cancel(promise.$$timeoutId)) : !1
                }, timeout
            }]
    }
    function urlResolve(url) {
        var href = url;
        return msie && (urlParsingNode.setAttribute("href", href), href = urlParsingNode.href), urlParsingNode.setAttribute("href", href), {href: urlParsingNode.href, protocol: urlParsingNode.protocol ? urlParsingNode.protocol.replace(/:$/, "") : "", host: urlParsingNode.host, search: urlParsingNode.search ? urlParsingNode.search.replace(/^\?/, "") : "", hash: urlParsingNode.hash ? urlParsingNode.hash.replace(/^#/, "") : "", hostname: urlParsingNode.hostname, port: urlParsingNode.port, pathname: "/" === urlParsingNode.pathname.charAt(0) ? urlParsingNode.pathname : "/" + urlParsingNode.pathname}
    }
    function urlIsSameOrigin(requestUrl) {
        var parsed = isString(requestUrl) ? urlResolve(requestUrl) : requestUrl;
        return parsed.protocol === originUrl.protocol && parsed.host === originUrl.host
    }
    function $WindowProvider() {
        this.$get = valueFn(window)
    }
    function $FilterProvider($provide) {
        function register(name, factory) {
            if (isObject(name)) {
                var filters = {};
                return forEach(name, function (filter, key) {
                    filters[key] = register(key, filter)
                }), filters
            }
            return $provide.factory(name + suffix, factory)
        }
        var suffix = "Filter";
        this.register = register, this.$get = ["$injector", function ($injector) {
                return function (name) {
                    return $injector.get(name + suffix)
                }
            }], register("currency", currencyFilter), register("date", dateFilter), register("filter", filterFilter), register("json", jsonFilter), register("limitTo", limitToFilter), register("lowercase", lowercaseFilter), register("number", numberFilter), register("orderBy", orderByFilter), register("uppercase", uppercaseFilter)
    }
    function filterFilter() {
        return function (array, expression, comparator) {
            if (!isArray(array))
                return array;
            var comparatorType = typeof comparator, predicates = [];
            predicates.check = function (value, index) {
                for (var j = 0; j < predicates.length; j++)
                    if (!predicates[j](value, index))
                        return!1;
                return!0
            }, "function" !== comparatorType && (comparator = "boolean" === comparatorType && comparator ? function (obj, text) {
                return angular.equals(obj, text)
            } : function (obj, text) {
                if (obj && text && "object" == typeof obj && "object" == typeof text) {
                    for (var objKey in obj)
                        if ("$" !== objKey.charAt(0) && hasOwnProperty.call(obj, objKey) && comparator(obj[objKey], text[objKey]))
                            return!0;
                    return!1
                }
                return text = ("" + text).toLowerCase(), ("" + obj).toLowerCase().indexOf(text) > -1
            });
            var search = function (obj, text) {
                if ("string" == typeof text && "!" === text.charAt(0))
                    return!search(obj, text.substr(1));
                switch (typeof obj) {
                    case"boolean":
                    case"number":
                    case"string":
                        return comparator(obj, text);
                    case"object":
                        switch (typeof text) {
                            case"object":
                                return comparator(obj, text);
                            default:
                            for (var objKey in obj)
                                if ("$" !== objKey.charAt(0) && search(obj[objKey], text))
                                    return!0
                        }
                        return!1;
                    case"array":
                        for (var i = 0; i < obj.length; i++)
                            if (search(obj[i], text))
                                return!0;
                        return!1;
                    default:
                        return!1
                    }
            };
            switch (typeof expression) {
                case"boolean":
                case"number":
                case"string":
                    expression = {$: expression};
                case"object":
                    for (var key in expression)
                        !function (path) {
                            "undefined" != typeof expression[path] && predicates.push(function (value) {
                                return search("$" == path ? value : value && value[path], expression[path])
                            })
                        }(key);
                    break;
                case"function":
                    predicates.push(expression);
                    break;
                default:
                    return array
            }
            for (var filtered = [], j = 0; j < array.length; j++) {
                var value = array[j];
                predicates.check(value, j) && filtered.push(value)
            }
            return filtered
        }
    }
    function currencyFilter($locale) {
        var formats = $locale.NUMBER_FORMATS;
        return function (amount, currencySymbol, fractionSize) {
            return isUndefined(currencySymbol) && (currencySymbol = formats.CURRENCY_SYM), isUndefined(fractionSize) && (fractionSize = formats.PATTERNS[1].maxFrac), null == amount ? amount : formatNumber(amount, formats.PATTERNS[1], formats.GROUP_SEP, formats.DECIMAL_SEP, fractionSize).replace(/\u00A4/g, currencySymbol)
        }
    }
    function numberFilter($locale) {
        var formats = $locale.NUMBER_FORMATS;
        return function (number, fractionSize) {
            return null == number ? number : formatNumber(number, formats.PATTERNS[0], formats.GROUP_SEP, formats.DECIMAL_SEP, fractionSize)
        }
    }
    function formatNumber(number, pattern, groupSep, decimalSep, fractionSize) {
        if (!isFinite(number) || isObject(number))
            return"";
        var isNegative = 0 > number;
        number = Math.abs(number);
        var numStr = number + "", formatedText = "", parts = [], hasExponent = !1;
        if (-1 !== numStr.indexOf("e")) {
            var match = numStr.match(/([\d\.]+)e(-?)(\d+)/);
            match && "-" == match[2] && match[3] > fractionSize + 1 ? (numStr = "0", number = 0) : (formatedText = numStr, hasExponent = !0)
        }
        if (hasExponent)
            fractionSize > 0 && number > -1 && 1 > number && (formatedText = number.toFixed(fractionSize));
        else {
            var fractionLen = (numStr.split(DECIMAL_SEP)[1] || "").length;
            isUndefined(fractionSize) && (fractionSize = Math.min(Math.max(pattern.minFrac, fractionLen), pattern.maxFrac)), number = +(Math.round(+(number.toString() + "e" + fractionSize)).toString() + "e" + -fractionSize), 0 === number && (isNegative = !1);
            var fraction = ("" + number).split(DECIMAL_SEP), whole = fraction[0];
            fraction = fraction[1] || "";
            var i, pos = 0, lgroup = pattern.lgSize, group = pattern.gSize;
            if (whole.length >= lgroup + group)
                for (pos = whole.length - lgroup, i = 0; pos > i; i++)
                    (pos - i) % group === 0 && 0 !== i && (formatedText += groupSep), formatedText += whole.charAt(i);
            for (i = pos; i < whole.length; i++)
                (whole.length - i) % lgroup === 0 && 0 !== i && (formatedText += groupSep), formatedText += whole.charAt(i);
            for (; fraction.length < fractionSize; )
                fraction += "0";
            fractionSize && "0" !== fractionSize && (formatedText += decimalSep + fraction.substr(0, fractionSize))
        }
        return parts.push(isNegative ? pattern.negPre : pattern.posPre, formatedText, isNegative ? pattern.negSuf : pattern.posSuf), parts.join("")
    }
    function padNumber(num, digits, trim) {
        var neg = "";
        for (0 > num && (neg = "-", num = - num), num = "" + num; num.length < digits; )
            num = "0" + num;
        return trim && (num = num.substr(num.length - digits)), neg + num
    }
    function dateGetter(name, size, offset, trim) {
        return offset = offset || 0, function (date) {
            var value = date["get" + name]();
            return(offset > 0 || value > -offset) && (value += offset), 0 === value && -12 == offset && (value = 12), padNumber(value, size, trim)
        }
    }
    function dateStrGetter(name, shortForm) {
        return function (date, formats) {
            var value = date["get" + name](), get = uppercase(shortForm ? "SHORT" + name : name);
            return formats[get][value]
        }
    }
    function timeZoneGetter(date) {
        var zone = -1 * date.getTimezoneOffset(), paddedZone = zone >= 0 ? "+" : "";
        return paddedZone += padNumber(Math[zone > 0 ? "floor" : "ceil"](zone / 60), 2) + padNumber(Math.abs(zone % 60), 2)
    }
    function getFirstThursdayOfYear(year) {
        var dayOfWeekOnFirst = new Date(year, 0, 1).getDay();
        return new Date(year, 0, (4 >= dayOfWeekOnFirst ? 5 : 12) - dayOfWeekOnFirst)
    }
    function getThursdayThisWeek(datetime) {
        return new Date(datetime.getFullYear(), datetime.getMonth(), datetime.getDate() + (4 - datetime.getDay()))
    }
    function weekGetter(size) {
        return function (date) {
            var firstThurs = getFirstThursdayOfYear(date.getFullYear()), thisThurs = getThursdayThisWeek(date), diff = +thisThurs - +firstThurs, result = 1 + Math.round(diff / 6048e5);
            return padNumber(result, size)
        }
    }
    function ampmGetter(date, formats) {
        return date.getHours() < 12 ? formats.AMPMS[0] : formats.AMPMS[1]
    }
    function dateFilter($locale) {
        function jsonStringToDate(string) {
            var match;
            if (match = string.match(R_ISO8601_STR)) {
                var date = new Date(0), tzHour = 0, tzMin = 0, dateSetter = match[8] ? date.setUTCFullYear : date.setFullYear, timeSetter = match[8] ? date.setUTCHours : date.setHours;
                match[9] && (tzHour = int(match[9] + match[10]), tzMin = int(match[9] + match[11])), dateSetter.call(date, int(match[1]), int(match[2]) - 1, int(match[3]));
                var h = int(match[4] || 0) - tzHour, m = int(match[5] || 0) - tzMin, s = int(match[6] || 0), ms = Math.round(1e3 * parseFloat("0." + (match[7] || 0)));
                return timeSetter.call(date, h, m, s, ms), date
            }
            return string
        }
        var R_ISO8601_STR = /^(\d{4})-?(\d\d)-?(\d\d)(?:T(\d\d)(?::?(\d\d)(?::?(\d\d)(?:\.(\d+))?)?)?(Z|([+-])(\d\d):?(\d\d))?)?$/;
        return function (date, format, timezone) {
            var fn, match, text = "", parts = [];
            if (format = format || "mediumDate", format = $locale.DATETIME_FORMATS[format] || format, isString(date) && (date = NUMBER_STRING.test(date) ? int(date) : jsonStringToDate(date)), isNumber(date) && (date = new Date(date)), !isDate(date))
                return date;
            for (; format; )
                match = DATE_FORMATS_SPLIT.exec(format), match ? (parts = concat(parts, match, 1), format = parts.pop()) : (parts.push(format), format = null);
            return timezone && "UTC" === timezone && (date = new Date(date.getTime()), date.setMinutes(date.getMinutes() + date.getTimezoneOffset())), forEach(parts, function (value) {
                fn = DATE_FORMATS[value], text += fn ? fn(date, $locale.DATETIME_FORMATS) : value.replace(/(^'|'$)/g, "").replace(/''/g, "'")
            }), text
        }
    }
    function jsonFilter() {
        return function (object) {
            return toJson(object, !0)
        }
    }
    function limitToFilter() {
        return function (input, limit) {
            if (isNumber(input) && (input = input.toString()), !isArray(input) && !isString(input))
                return input;
            if (limit = 1 / 0 === Math.abs(Number(limit)) ? Number(limit) : int(limit), isString(input))
                return limit ? limit >= 0 ? input.slice(0, limit) : input.slice(limit, input.length) : "";
            var i, n, out = [];
            for (limit > input.length?limit = input.length:limit < - input.length && (limit = - input.length), limit > 0?(i = 0, n = limit):(i = input.length + limit, n = input.length); n > i; i++)
                out.push(input[i]);
            return out
        }
    }
    function orderByFilter($parse) {
        return function (array, sortPredicate, reverseOrder) {
            function comparator(o1, o2) {
                for (var i = 0; i < sortPredicate.length; i++) {
                    var comp = sortPredicate[i](o1, o2);
                    if (0 !== comp)
                        return comp
                }
                return 0
            }
            function reverseComparator(comp, descending) {
                return descending ? function (a, b) {
                    return comp(b, a)
                } : comp
            }
            function compare(v1, v2) {
                var t1 = typeof v1, t2 = typeof v2;
                return t1 == t2 ? (isDate(v1) && isDate(v2) && (v1 = v1.valueOf(), v2 = v2.valueOf()), "string" == t1 && (v1 = v1.toLowerCase(), v2 = v2.toLowerCase()), v1 === v2 ? 0 : v2 > v1 ? -1 : 1) : t2 > t1 ? -1 : 1
            }
            return isArrayLike(array) ? (sortPredicate = isArray(sortPredicate) ? sortPredicate : [sortPredicate], 0 === sortPredicate.length && (sortPredicate = ["+"]), sortPredicate = sortPredicate.map(function (predicate) {
                var descending = !1, get = predicate || identity;
                if (isString(predicate)) {
                    if (("+" == predicate.charAt(0) || "-" == predicate.charAt(0)) && (descending = "-" == predicate.charAt(0), predicate = predicate.substring(1)), "" === predicate)
                        return reverseComparator(function (a, b) {
                            return compare(a, b)
                        }, descending);
                    if (get = $parse(predicate), get.constant) {
                        var key = get();
                        return reverseComparator(function (a, b) {
                            return compare(a[key], b[key])
                        }, descending)
                    }
                }
                return reverseComparator(function (a, b) {
                    return compare(get(a), get(b))
                }, descending)
            }), slice.call(array).sort(reverseComparator(comparator, reverseOrder))) : array
        }
    }
    function ngDirective(directive) {
        return isFunction(directive) && (directive = {link: directive}), directive.restrict = directive.restrict || "AC", valueFn(directive)
    }
    function nullFormRenameControl(control, name) {
        control.$name = name
    }
    function FormController(element, attrs, $scope, $animate, $interpolate) {
        var form = this, controls = [], parentForm = form.$$parentForm = element.parent().controller("form") || nullFormCtrl;
        form.$error = {}, form.$$success = {}, form.$pending = undefined, form.$name = $interpolate(attrs.name || attrs.ngForm || "")($scope), form.$dirty = !1, form.$pristine = !0, form.$valid = !0, form.$invalid = !1, form.$submitted = !1, parentForm.$addControl(form), form.$rollbackViewValue = function () {
            forEach(controls, function (control) {
                control.$rollbackViewValue()
            })
        }, form.$commitViewValue = function () {
            forEach(controls, function (control) {
                control.$commitViewValue()
            })
        }, form.$addControl = function (control) {
            assertNotHasOwnProperty(control.$name, "input"), controls.push(control), control.$name && (form[control.$name] = control)
        }, form.$$renameControl = function (control, newName) {
            var oldName = control.$name;
            form[oldName] === control && delete form[oldName], form[newName] = control, control.$name = newName
        }, form.$removeControl = function (control) {
            control.$name && form[control.$name] === control && delete form[control.$name], forEach(form.$pending, function (value, name) {
                form.$setValidity(name, null, control)
            }), forEach(form.$error, function (value, name) {
                form.$setValidity(name, null, control)
            }), arrayRemove(controls, control)
        }, addSetValidityMethod({ctrl: this, $element: element, set: function (object, property, control) {
                var list = object[property];
                if (list) {
                    var index = list.indexOf(control);
                    -1 === index && list.push(control)
                } else
                    object[property] = [control]
            }, unset: function (object, property, control) {
                var list = object[property];
                list && (arrayRemove(list, control), 0 === list.length && delete object[property])
            }, parentForm: parentForm, $animate: $animate}), form.$setDirty = function () {
            $animate.removeClass(element, PRISTINE_CLASS), $animate.addClass(element, DIRTY_CLASS), form.$dirty = !0, form.$pristine = !1, parentForm.$setDirty()
        }, form.$setPristine = function () {
            $animate.setClass(element, PRISTINE_CLASS, DIRTY_CLASS + " " + SUBMITTED_CLASS), form.$dirty = !1, form.$pristine = !0, form.$submitted = !1, forEach(controls, function (control) {
                control.$setPristine()
            })
        }, form.$setUntouched = function () {
            forEach(controls, function (control) {
                control.$setUntouched()
            })
        }, form.$setSubmitted = function () {
            $animate.addClass(element, SUBMITTED_CLASS), form.$submitted = !0, parentForm.$setSubmitted()
        }
    }
    function stringBasedInputType(ctrl) {
        ctrl.$formatters.push(function (value) {
            return ctrl.$isEmpty(value) ? value : value.toString()
        })
    }
    function textInputType(scope, element, attr, ctrl, $sniffer, $browser) {
        baseInputType(scope, element, attr, ctrl, $sniffer, $browser), stringBasedInputType(ctrl)
    }
    function baseInputType(scope, element, attr, ctrl, $sniffer, $browser) {
        var placeholder = element[0].placeholder, noevent = {}, type = lowercase(element[0].type);
        if (!$sniffer.android) {
            var composing = !1;
            element.on("compositionstart", function () {
                composing = !0
            }), element.on("compositionend", function () {
                composing = !1, listener()
            })
        }
        var listener = function (ev) {
            if (!composing) {
                var value = element.val(), event = ev && ev.type;
                if (msie && "input" === (ev || noevent).type && element[0].placeholder !== placeholder)
                    return void(placeholder = element[0].placeholder);
                "password" === type || attr.ngTrim && "false" === attr.ngTrim || (value = trim(value)), (ctrl.$viewValue !== value || "" === value && ctrl.$$hasNativeValidators) && ctrl.$setViewValue(value, event)
            }
        };
        if ($sniffer.hasEvent("input"))
            element.on("input", listener);
        else {
            var timeout, deferListener = function (ev) {
                timeout || (timeout = $browser.defer(function () {
                    listener(ev), timeout = null
                }))
            };
            element.on("keydown", function (event) {
                var key = event.keyCode;
                91 === key || key > 15 && 19 > key || key >= 37 && 40 >= key || deferListener(event)
            }), $sniffer.hasEvent("paste") && element.on("paste cut", deferListener)
        }
        element.on("change", listener), ctrl.$render = function () {
            element.val(ctrl.$isEmpty(ctrl.$viewValue) ? "" : ctrl.$viewValue)
        }
    }
    function weekParser(isoWeek, existingDate) {
        if (isDate(isoWeek))
            return isoWeek;
        if (isString(isoWeek)) {
            WEEK_REGEXP.lastIndex = 0;
            var parts = WEEK_REGEXP.exec(isoWeek);
            if (parts) {
                var year = +parts[1], week = +parts[2], hours = 0, minutes = 0, seconds = 0, milliseconds = 0, firstThurs = getFirstThursdayOfYear(year), addDays = 7 * (week - 1);
                return existingDate && (hours = existingDate.getHours(), minutes = existingDate.getMinutes(), seconds = existingDate.getSeconds(), milliseconds = existingDate.getMilliseconds()), new Date(year, 0, firstThurs.getDate() + addDays, hours, minutes, seconds, milliseconds)
            }
        }
        return 0 / 0
    }
    function createDateParser(regexp, mapping) {
        return function (iso, date) {
            var parts, map;
            if (isDate(iso))
                return iso;
            if (isString(iso)) {
                if ('"' == iso.charAt(0) && '"' == iso.charAt(iso.length - 1) && (iso = iso.substring(1, iso.length - 1)), ISO_DATE_REGEXP.test(iso))
                    return new Date(iso);
                if (regexp.lastIndex = 0, parts = regexp.exec(iso))
                    return parts.shift(), map = date ? {yyyy: date.getFullYear(), MM: date.getMonth() + 1, dd: date.getDate(), HH: date.getHours(), mm: date.getMinutes(), ss: date.getSeconds(), sss: date.getMilliseconds() / 1e3} : {yyyy: 1970, MM: 1, dd: 1, HH: 0, mm: 0, ss: 0, sss: 0}, forEach(parts, function (part, index) {
                        index < mapping.length && (map[mapping[index]] = +part)
                    }), new Date(map.yyyy, map.MM - 1, map.dd, map.HH, map.mm, map.ss || 0, 1e3 * map.sss || 0)
            }
            return 0 / 0
        }
    }
    function createDateInputType(type, regexp, parseDate, format) {
        return function (scope, element, attr, ctrl, $sniffer, $browser, $filter) {
            function isValidDate(value) {
                return value && !(value.getTime && value.getTime() !== value.getTime())
            }
            function parseObservedDateValue(val) {
                return isDefined(val) ? isDate(val) ? val : parseDate(val) : undefined
            }
            badInputChecker(scope, element, attr, ctrl), baseInputType(scope, element, attr, ctrl, $sniffer, $browser);
            var previousDate, timezone = ctrl && ctrl.$options && ctrl.$options.timezone;
            if (ctrl.$$parserName = type, ctrl.$parsers.push(function (value) {
                if (ctrl.$isEmpty(value))
                    return null;
                if (regexp.test(value)) {
                    var parsedDate = parseDate(value, previousDate);
                    return"UTC" === timezone && parsedDate.setMinutes(parsedDate.getMinutes() - parsedDate.getTimezoneOffset()), parsedDate
                }
                return undefined
            }), ctrl.$formatters.push(function (value) {
                if (value && !isDate(value))
                    throw $ngModelMinErr("datefmt", "Expected `{0}` to be a date", value);
                if (isValidDate(value)) {
                    if (previousDate = value, previousDate && "UTC" === timezone) {
                        var timezoneOffset = 6e4 * previousDate.getTimezoneOffset();
                        previousDate = new Date(previousDate.getTime() + timezoneOffset)
                    }
                    return $filter("date")(value, format, timezone)
                }
                return previousDate = null, ""
            }), isDefined(attr.min) || attr.ngMin) {
                var minVal;
                ctrl.$validators.min = function (value) {
                    return!isValidDate(value) || isUndefined(minVal) || parseDate(value) >= minVal
                }, attr.$observe("min", function (val) {
                    minVal = parseObservedDateValue(val), ctrl.$validate()
                })
            }
            if (isDefined(attr.max) || attr.ngMax) {
                var maxVal;
                ctrl.$validators.max = function (value) {
                    return!isValidDate(value) || isUndefined(maxVal) || parseDate(value) <= maxVal
                }, attr.$observe("max", function (val) {
                    maxVal = parseObservedDateValue(val), ctrl.$validate()
                })
            }
        }
    }
    function badInputChecker(scope, element, attr, ctrl) {
        var node = element[0], nativeValidation = ctrl.$$hasNativeValidators = isObject(node.validity);
        nativeValidation && ctrl.$parsers.push(function (value) {
            var validity = element.prop(VALIDITY_STATE_PROPERTY) || {};
            return validity.badInput && !validity.typeMismatch ? undefined : value
        })
    }
    function numberInputType(scope, element, attr, ctrl, $sniffer, $browser) {
        if (badInputChecker(scope, element, attr, ctrl), baseInputType(scope, element, attr, ctrl, $sniffer, $browser), ctrl.$$parserName = "number", ctrl.$parsers.push(function (value) {
            return ctrl.$isEmpty(value) ? null : NUMBER_REGEXP.test(value) ? parseFloat(value) : undefined
        }), ctrl.$formatters.push(function (value) {
            if (!ctrl.$isEmpty(value)) {
                if (!isNumber(value))
                    throw $ngModelMinErr("numfmt", "Expected `{0}` to be a number", value);
                value = value.toString()
            }
            return value
        }), attr.min || attr.ngMin) {
            var minVal;
            ctrl.$validators.min = function (value) {
                return ctrl.$isEmpty(value) || isUndefined(minVal) || value >= minVal
            }, attr.$observe("min", function (val) {
                isDefined(val) && !isNumber(val) && (val = parseFloat(val, 10)), minVal = isNumber(val) && !isNaN(val) ? val : undefined, ctrl.$validate()
            })
        }
        if (attr.max || attr.ngMax) {
            var maxVal;
            ctrl.$validators.max = function (value) {
                return ctrl.$isEmpty(value) || isUndefined(maxVal) || maxVal >= value
            }, attr.$observe("max", function (val) {
                isDefined(val) && !isNumber(val) && (val = parseFloat(val, 10)), maxVal = isNumber(val) && !isNaN(val) ? val : undefined, ctrl.$validate()
            })
        }
    }
    function urlInputType(scope, element, attr, ctrl, $sniffer, $browser) {
        baseInputType(scope, element, attr, ctrl, $sniffer, $browser), stringBasedInputType(ctrl), ctrl.$$parserName = "url", ctrl.$validators.url = function (modelValue, viewValue) {
            var value = modelValue || viewValue;
            return ctrl.$isEmpty(value) || URL_REGEXP.test(value)
        }
    }
    function emailInputType(scope, element, attr, ctrl, $sniffer, $browser) {
        baseInputType(scope, element, attr, ctrl, $sniffer, $browser), stringBasedInputType(ctrl), ctrl.$$parserName = "email", ctrl.$validators.email = function (modelValue, viewValue) {
            var value = modelValue || viewValue;
            return ctrl.$isEmpty(value) || EMAIL_REGEXP.test(value)
        }
    }
    function radioInputType(scope, element, attr, ctrl) {
        isUndefined(attr.name) && element.attr("name", nextUid());
        var listener = function (ev) {
            element[0].checked && ctrl.$setViewValue(attr.value, ev && ev.type)
        };
        element.on("click", listener), ctrl.$render = function () {
            var value = attr.value;
            element[0].checked = value == ctrl.$viewValue
        }, attr.$observe("value", ctrl.$render)
    }
    function parseConstantExpr($parse, context, name, expression, fallback) {
        var parseFn;
        if (isDefined(expression)) {
            if (parseFn = $parse(expression), !parseFn.constant)
                throw minErr("ngModel")("constexpr", "Expected constant expression for `{0}`, but saw `{1}`.", name, expression);
            return parseFn(context)
        }
        return fallback
    }
    function checkboxInputType(scope, element, attr, ctrl, $sniffer, $browser, $filter, $parse) {
        var trueValue = parseConstantExpr($parse, scope, "ngTrueValue", attr.ngTrueValue, !0), falseValue = parseConstantExpr($parse, scope, "ngFalseValue", attr.ngFalseValue, !1), listener = function (ev) {
            ctrl.$setViewValue(element[0].checked, ev && ev.type)
        };
        element.on("click", listener), ctrl.$render = function () {
            element[0].checked = ctrl.$viewValue
        }, ctrl.$isEmpty = function (value) {
            return value === !1
        }, ctrl.$formatters.push(function (value) {
            return equals(value, trueValue)
        }), ctrl.$parsers.push(function (value) {
            return value ? trueValue : falseValue
        })
    }
    function addSetValidityMethod(context) {
        function setValidity(validationErrorKey, state, options) {
            state === undefined ? createAndSet("$pending", validationErrorKey, options) : unsetAndCleanup("$pending", validationErrorKey, options), isBoolean(state) ? state ? (unset(ctrl.$error, validationErrorKey, options), set(ctrl.$$success, validationErrorKey, options)) : (set(ctrl.$error, validationErrorKey, options), unset(ctrl.$$success, validationErrorKey, options)) : (unset(ctrl.$error, validationErrorKey, options), unset(ctrl.$$success, validationErrorKey, options)), ctrl.$pending ? (cachedToggleClass(PENDING_CLASS, !0), ctrl.$valid = ctrl.$invalid = undefined, toggleValidationCss("", null)) : (cachedToggleClass(PENDING_CLASS, !1), ctrl.$valid = isObjectEmpty(ctrl.$error), ctrl.$invalid = !ctrl.$valid, toggleValidationCss("", ctrl.$valid));
            var combinedState;
            combinedState = ctrl.$pending && ctrl.$pending[validationErrorKey] ? undefined : ctrl.$error[validationErrorKey] ? !1 : ctrl.$$success[validationErrorKey] ? !0 : null, toggleValidationCss(validationErrorKey, combinedState), parentForm.$setValidity(validationErrorKey, combinedState, ctrl)
        }
        function createAndSet(name, value, options) {
            ctrl[name] || (ctrl[name] = {}), set(ctrl[name], value, options)
        }
        function unsetAndCleanup(name, value, options) {
            ctrl[name] && unset(ctrl[name], value, options), isObjectEmpty(ctrl[name]) && (ctrl[name] = undefined)
        }
        function cachedToggleClass(className, switchValue) {
            switchValue && !classCache[className] ? ($animate.addClass($element, className), classCache[className] = !0) : !switchValue && classCache[className] && ($animate.removeClass($element, className), classCache[className] = !1)
        }
        function toggleValidationCss(validationErrorKey, isValid) {
            validationErrorKey = validationErrorKey ? "-" + snake_case(validationErrorKey, "-") : "", cachedToggleClass(VALID_CLASS + validationErrorKey, isValid === !0), cachedToggleClass(INVALID_CLASS + validationErrorKey, isValid === !1)
        }
        var ctrl = context.ctrl, $element = context.$element, classCache = {}, set = context.set, unset = context.unset, parentForm = context.parentForm, $animate = context.$animate;
        classCache[INVALID_CLASS] = !(classCache[VALID_CLASS] = $element.hasClass(VALID_CLASS)), ctrl.$setValidity = setValidity
    }
    function isObjectEmpty(obj) {
        if (obj)
            for (var prop in obj)
                return!1;
        return!0
    }
    function classDirective(name, selector) {
        return name = "ngClass" + name, ["$animate", function ($animate) {
                function arrayDifference(tokens1, tokens2) {
                    var values = [];
                    outer:for (var i = 0; i < tokens1.length; i++) {
                        for (var token = tokens1[i], j = 0; j < tokens2.length; j++)
                            if (token == tokens2[j])
                                continue outer;
                        values.push(token)
                    }
                    return values
                }
                function arrayClasses(classVal) {
                    if (isArray(classVal))
                        return classVal;
                    if (isString(classVal))
                        return classVal.split(" ");
                    if (isObject(classVal)) {
                        var classes = [];
                        return forEach(classVal, function (v, k) {
                            v && (classes = classes.concat(k.split(" ")))
                        }), classes
                    }
                    return classVal
                }
                return{restrict: "AC", link: function (scope, element, attr) {
                        function addClasses(classes) {
                            var newClasses = digestClassCounts(classes, 1);
                            attr.$addClass(newClasses)
                        }
                        function removeClasses(classes) {
                            var newClasses = digestClassCounts(classes, -1);
                            attr.$removeClass(newClasses)
                        }
                        function digestClassCounts(classes, count) {
                            var classCounts = element.data("$classCounts") || {}, classesToUpdate = [];
                            return forEach(classes, function (className) {
                                (count > 0 || classCounts[className]) && (classCounts[className] = (classCounts[className] || 0) + count, classCounts[className] === +(count > 0) && classesToUpdate.push(className))
                            }), element.data("$classCounts", classCounts), classesToUpdate.join(" ")
                        }
                        function updateClasses(oldClasses, newClasses) {
                            var toAdd = arrayDifference(newClasses, oldClasses), toRemove = arrayDifference(oldClasses, newClasses);
                            toAdd = digestClassCounts(toAdd, 1), toRemove = digestClassCounts(toRemove, -1), toAdd && toAdd.length && $animate.addClass(element, toAdd), toRemove && toRemove.length && $animate.removeClass(element, toRemove)
                        }
                        function ngClassWatchAction(newVal) {
                            if (selector === !0 || scope.$index % 2 === selector) {
                                var newClasses = arrayClasses(newVal || []);
                                if (oldVal) {
                                    if (!equals(newVal, oldVal)) {
                                        var oldClasses = arrayClasses(oldVal);
                                        updateClasses(oldClasses, newClasses)
                                    }
                                } else
                                    addClasses(newClasses)
                            }
                            oldVal = shallowCopy(newVal)
                        }
                        var oldVal;
                        scope.$watch(attr[name], ngClassWatchAction, !0), attr.$observe("class", function () {
                            ngClassWatchAction(scope.$eval(attr[name]))
                        }), "ngClass" !== name && scope.$watch("$index", function ($index, old$index) {
                            var mod = 1 & $index;
                            if (mod !== (1 & old$index)) {
                                var classes = arrayClasses(scope.$eval(attr[name]));
                                mod === selector ? addClasses(classes) : removeClasses(classes)
                            }
                        })
                    }}
            }]
    }
    var REGEX_STRING_REGEXP = /^\/(.+)\/([a-z]*)$/, VALIDITY_STATE_PROPERTY = "validity", lowercase = function (string) {
        return isString(string) ? string.toLowerCase() : string
    }, hasOwnProperty = Object.prototype.hasOwnProperty, uppercase = function (string) {
        return isString(string) ? string.toUpperCase() : string
    }, manualLowercase = function (s) {
        return isString(s) ? s.replace(/[A-Z]/g, function (ch) {
            return String.fromCharCode(32 | ch.charCodeAt(0))
        }) : s
    }, manualUppercase = function (s) {
        return isString(s) ? s.replace(/[a-z]/g, function (ch) {
            return String.fromCharCode(-33 & ch.charCodeAt(0))
        }) : s
    };
    "i" !== "I".toLowerCase() && (lowercase = manualLowercase, uppercase = manualUppercase);
    var msie, jqLite, jQuery, angularModule, slice = [].slice, splice = [].splice, push = [].push, toString = Object.prototype.toString, ngMinErr = minErr("ng"), angular = window.angular || (window.angular = {}), uid = 0;
    msie = document.documentMode, noop.$inject = [], identity.$inject = [];
    var skipDestroyOnNextJQueryCleanData, isArray = Array.isArray, trim = function (value) {
        return isString(value) ? value.trim() : value
    }, escapeForRegexp = function (s) {
        return s.replace(/([-()\[\]{}+?*.$\^|,:#<!\\])/g, "\\$1").replace(/\x08/g, "\\x08")
    }, csp = function () {
        if (isDefined(csp.isActive_))
            return csp.isActive_;
        var active = !(!document.querySelector("[ng-csp]") && !document.querySelector("[data-ng-csp]"));
        if (!active)
            try {
                new Function("")
            } catch (e) {
                active = !0
            }
        return csp.isActive_ = active
    }, ngAttrPrefixes = ["ng-", "data-ng-", "ng:", "x-ng-"], SNAKE_CASE_REGEXP = /[A-Z]/g, bindJQueryFired = !1, NODE_TYPE_ELEMENT = 1, NODE_TYPE_TEXT = 3, NODE_TYPE_COMMENT = 8, NODE_TYPE_DOCUMENT = 9, NODE_TYPE_DOCUMENT_FRAGMENT = 11, version = {full: "1.3.5", major: 1, minor: 3, dot: 5, codeName: "cybernetic-mercantilism"};
    JQLite.expando = "ng339";
    var jqCache = JQLite.cache = {}, jqId = 1, addEventListenerFn = function (element, type, fn) {
        element.addEventListener(type, fn, !1)
    }, removeEventListenerFn = function (element, type, fn) {
        element.removeEventListener(type, fn, !1)
    };
    JQLite._data = function (node) {
        return this.cache[node[this.expando]] || {}
    };
    var SPECIAL_CHARS_REGEXP = /([\:\-\_]+(.))/g, MOZ_HACK_REGEXP = /^moz([A-Z])/, MOUSE_EVENT_MAP = {mouseleave: "mouseout", mouseenter: "mouseover"}, jqLiteMinErr = minErr("jqLite"), SINGLE_TAG_REGEXP = /^<(\w+)\s*\/?>(?:<\/\1>|)$/, HTML_REGEXP = /<|&#?\w+;/, TAG_NAME_REGEXP = /<([\w:]+)/, XHTML_TAG_REGEXP = /<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:]+)[^>]*)\/>/gi, wrapMap = {option: [1, '<select multiple="multiple">', "</select>"], thead: [1, "<table>", "</table>"], col: [2, "<table><colgroup>", "</colgroup></table>"], tr: [2, "<table><tbody>", "</tbody></table>"], td: [3, "<table><tbody><tr>", "</tr></tbody></table>"], _default: [0, "", ""]};
    wrapMap.optgroup = wrapMap.option, wrapMap.tbody = wrapMap.tfoot = wrapMap.colgroup = wrapMap.caption = wrapMap.thead, wrapMap.th = wrapMap.td;
    var JQLitePrototype = JQLite.prototype = {ready: function (fn) {
            function trigger() {
                fired || (fired = !0, fn())
            }
            var fired = !1;
            "complete" === document.readyState ? setTimeout(trigger) : (this.on("DOMContentLoaded", trigger), JQLite(window).on("load", trigger))
        }, toString: function () {
            var value = [];
            return forEach(this, function (e) {
                value.push("" + e)
            }), "[" + value.join(", ") + "]"
        }, eq: function (index) {
            return jqLite(index >= 0 ? this[index] : this[this.length + index])
        }, length: 0, push: push, sort: [].sort, splice: [].splice}, BOOLEAN_ATTR = {};
    forEach("multiple,selected,checked,disabled,readOnly,required,open".split(","), function (value) {
        BOOLEAN_ATTR[lowercase(value)] = value
    });
    var BOOLEAN_ELEMENTS = {};
    forEach("input,select,option,textarea,button,form,details".split(","), function (value) {
        BOOLEAN_ELEMENTS[value] = !0
    });
    var ALIASED_ATTR = {ngMinlength: "minlength", ngMaxlength: "maxlength", ngMin: "min", ngMax: "max", ngPattern: "pattern"};
    forEach({data: jqLiteData, removeData: jqLiteRemoveData}, function (fn, name) {
        JQLite[name] = fn
    }), forEach({data: jqLiteData, inheritedData: jqLiteInheritedData, scope: function (element) {
            return jqLite.data(element, "$scope") || jqLiteInheritedData(element.parentNode || element, ["$isolateScope", "$scope"])
        }, isolateScope: function (element) {
            return jqLite.data(element, "$isolateScope") || jqLite.data(element, "$isolateScopeNoTemplate")
        }, controller: jqLiteController, injector: function (element) {
            return jqLiteInheritedData(element, "$injector")
        }, removeAttr: function (element, name) {
            element.removeAttribute(name)
        }, hasClass: jqLiteHasClass, css: function (element, name, value) {
            return name = camelCase(name), isDefined(value) ? void(element.style[name] = value) : element.style[name]
        }, attr: function (element, name, value) {
            var lowercasedName = lowercase(name);
            if (BOOLEAN_ATTR[lowercasedName]) {
                if (!isDefined(value))
                    return element[name] || (element.attributes.getNamedItem(name) || noop).specified ? lowercasedName : undefined;
                value ? (element[name] = !0, element.setAttribute(name, lowercasedName)) : (element[name] = !1, element.removeAttribute(lowercasedName))
            } else if (isDefined(value))
                element.setAttribute(name, value);
            else if (element.getAttribute) {
                var ret = element.getAttribute(name, 2);
                return null === ret ? undefined : ret
            }
        }, prop: function (element, name, value) {
            return isDefined(value) ? void(element[name] = value) : element[name]
        }, text: function () {
            function getText(element, value) {
                if (isUndefined(value)) {
                    var nodeType = element.nodeType;
                    return nodeType === NODE_TYPE_ELEMENT || nodeType === NODE_TYPE_TEXT ? element.textContent : ""
                }
                element.textContent = value
            }
            return getText.$dv = "", getText
        }(), val: function (element, value) {
            if (isUndefined(value)) {
                if (element.multiple && "select" === nodeName_(element)) {
                    var result = [];
                    return forEach(element.options, function (option) {
                        option.selected && result.push(option.value || option.text)
                    }), 0 === result.length ? null : result
                }
                return element.value
            }
            element.value = value
        }, html: function (element, value) {
            return isUndefined(value) ? element.innerHTML : (jqLiteDealoc(element, !0), void(element.innerHTML = value))
        }, empty: jqLiteEmpty}, function (fn, name) {
        JQLite.prototype[name] = function (arg1, arg2) {
            var i, key, nodeCount = this.length;
            if (fn !== jqLiteEmpty && (2 == fn.length && fn !== jqLiteHasClass && fn !== jqLiteController ? arg1 : arg2) === undefined) {
                if (isObject(arg1)) {
                    for (i = 0; nodeCount > i; i++)
                        if (fn === jqLiteData)
                            fn(this[i], arg1);
                        else
                            for (key in arg1)
                                fn(this[i], key, arg1[key]);
                    return this
                }
                for (var value = fn.$dv, jj = value === undefined ? Math.min(nodeCount, 1) : nodeCount, j = 0; jj > j; j++) {
                    var nodeValue = fn(this[j], arg1, arg2);
                    value = value ? value + nodeValue : nodeValue
                }
                return value
            }
            for (i = 0; nodeCount > i; i++)
                fn(this[i], arg1, arg2);
            return this
        }
    }), forEach({removeData: jqLiteRemoveData, on: function jqLiteOn(element, type, fn, unsupported) {
            if (isDefined(unsupported))
                throw jqLiteMinErr("onargs", "jqLite#on() does not support the `selector` or `eventData` parameters");
            if (jqLiteAcceptsData(element)) {
                var expandoStore = jqLiteExpandoStore(element, !0), events = expandoStore.events, handle = expandoStore.handle;
                handle || (handle = expandoStore.handle = createEventHandler(element, events));
                for (var types = type.indexOf(" ") >= 0 ? type.split(" ") : [type], i = types.length; i--; ) {
                    type = types[i];
                    var eventFns = events[type];
                    eventFns || (events[type] = [], "mouseenter" === type || "mouseleave" === type ? jqLiteOn(element, MOUSE_EVENT_MAP[type], function (event) {
                        var target = this, related = event.relatedTarget;
                        (!related || related !== target && !target.contains(related)) && handle(event, type)
                    }) : "$destroy" !== type && addEventListenerFn(element, type, handle), eventFns = events[type]), eventFns.push(fn)
                }
            }
        }, off: jqLiteOff, one: function (element, type, fn) {
            element = jqLite(element), element.on(type, function onFn() {
                element.off(type, fn), element.off(type, onFn)
            }), element.on(type, fn)
        }, replaceWith: function (element, replaceNode) {
            var index, parent = element.parentNode;
            jqLiteDealoc(element), forEach(new JQLite(replaceNode), function (node) {
                index ? parent.insertBefore(node, index.nextSibling) : parent.replaceChild(node, element), index = node
            })
        }, children: function (element) {
            var children = [];
            return forEach(element.childNodes, function (element) {
                element.nodeType === NODE_TYPE_ELEMENT && children.push(element)
            }), children
        }, contents: function (element) {
            return element.contentDocument || element.childNodes || []
        }, append: function (element, node) {
            var nodeType = element.nodeType;
            if (nodeType === NODE_TYPE_ELEMENT || nodeType === NODE_TYPE_DOCUMENT_FRAGMENT) {
                node = new JQLite(node);
                for (var i = 0, ii = node.length; ii > i; i++) {
                    var child = node[i];
                    element.appendChild(child)
                }
            }
        }, prepend: function (element, node) {
            if (element.nodeType === NODE_TYPE_ELEMENT) {
                var index = element.firstChild;
                forEach(new JQLite(node), function (child) {
                    element.insertBefore(child, index)
                })
            }
        }, wrap: function (element, wrapNode) {
            wrapNode = jqLite(wrapNode).eq(0).clone()[0];
            var parent = element.parentNode;
            parent && parent.replaceChild(wrapNode, element), wrapNode.appendChild(element)
        }, remove: jqLiteRemove, detach: function (element) {
            jqLiteRemove(element, !0)
        }, after: function (element, newElement) {
            var index = element, parent = element.parentNode;
            newElement = new JQLite(newElement);
            for (var i = 0, ii = newElement.length; ii > i; i++) {
                var node = newElement[i];
                parent.insertBefore(node, index.nextSibling), index = node
            }
        }, addClass: jqLiteAddClass, removeClass: jqLiteRemoveClass, toggleClass: function (element, selector, condition) {
            selector && forEach(selector.split(" "), function (className) {
                var classCondition = condition;
                isUndefined(classCondition) && (classCondition = !jqLiteHasClass(element, className)), (classCondition ? jqLiteAddClass : jqLiteRemoveClass)(element, className)
            })
        }, parent: function (element) {
            var parent = element.parentNode;
            return parent && parent.nodeType !== NODE_TYPE_DOCUMENT_FRAGMENT ? parent : null
        }, next: function (element) {
            return element.nextElementSibling
        }, find: function (element, selector) {
            return element.getElementsByTagName ? element.getElementsByTagName(selector) : []
        }, clone: jqLiteClone, triggerHandler: function (element, event, extraParameters) {
            var dummyEvent, eventFnsCopy, handlerArgs, eventName = event.type || event, expandoStore = jqLiteExpandoStore(element), events = expandoStore && expandoStore.events, eventFns = events && events[eventName];
            eventFns && (dummyEvent = {preventDefault: function () {
                    this.defaultPrevented = !0
                }, isDefaultPrevented: function () {
                    return this.defaultPrevented === !0
                }, stopImmediatePropagation: function () {
                    this.immediatePropagationStopped = !0
                }, isImmediatePropagationStopped: function () {
                    return this.immediatePropagationStopped === !0
                }, stopPropagation: noop, type: eventName, target: element}, event.type && (dummyEvent = extend(dummyEvent, event)), eventFnsCopy = shallowCopy(eventFns), handlerArgs = extraParameters ? [dummyEvent].concat(extraParameters) : [dummyEvent], forEach(eventFnsCopy, function (fn) {
                dummyEvent.isImmediatePropagationStopped() || fn.apply(element, handlerArgs)
            }))
        }}, function (fn, name) {
        JQLite.prototype[name] = function (arg1, arg2, arg3) {
            for (var value, i = 0, ii = this.length; ii > i; i++)
                isUndefined(value) ? (value = fn(this[i], arg1, arg2, arg3), isDefined(value) && (value = jqLite(value))) : jqLiteAddNodes(value, fn(this[i], arg1, arg2, arg3));
            return isDefined(value) ? value : this
        }, JQLite.prototype.bind = JQLite.prototype.on, JQLite.prototype.unbind = JQLite.prototype.off
    }), HashMap.prototype = {put: function (key, value) {
            this[hashKey(key, this.nextUid)] = value
        }, get: function (key) {
            return this[hashKey(key, this.nextUid)]
        }, remove: function (key) {
            var value = this[key = hashKey(key, this.nextUid)];
            return delete this[key], value
        }};
    var FN_ARGS = /^function\s*[^\(]*\(\s*([^\)]*)\)/m, FN_ARG_SPLIT = /,/, FN_ARG = /^\s*(_?)(\S+?)\1\s*$/, STRIP_COMMENTS = /((\/\/.*$)|(\/\*[\s\S]*?\*\/))/gm, $injectorMinErr = minErr("$injector");
    createInjector.$$annotate = annotate;
    var $animateMinErr = minErr("$animate"), $AnimateProvider = ["$provide", function ($provide) {
            this.$$selectors = {}, this.register = function (name, factory) {
                var key = name + "-animation";
                if (name && "." != name.charAt(0))
                    throw $animateMinErr("notcsel", "Expecting class selector starting with '.' got '{0}'.", name);
                this.$$selectors[name.substr(1)] = key, $provide.factory(key, factory)
            }, this.classNameFilter = function (expression) {
                return 1 === arguments.length && (this.$$classNameFilter = expression instanceof RegExp ? expression : null), this.$$classNameFilter
            }, this.$get = ["$$q", "$$asyncCallback", "$rootScope", function ($$q, $$asyncCallback, $rootScope) {
                    function runAnimationPostDigest(fn) {
                        var cancelFn, defer = $$q.defer();
                        return defer.promise.$$cancelFn = function () {
                            cancelFn && cancelFn()
                        }, $rootScope.$$postDigest(function () {
                            cancelFn = fn(function () {
                                defer.resolve()
                            })
                        }), defer.promise
                    }
                    function resolveElementClasses(element, classes) {
                        var toAdd = [], toRemove = [], hasClasses = createMap();
                        return forEach((element.attr("class") || "").split(/\s+/), function (className) {
                            hasClasses[className] = !0
                        }), forEach(classes, function (status, className) {
                            var hasClass = hasClasses[className];
                            status === !1 && hasClass ? toRemove.push(className) : status !== !0 || hasClass || toAdd.push(className)
                        }), toAdd.length + toRemove.length > 0 && [toAdd.length ? toAdd : null, toRemove.length ? toRemove : null]
                    }
                    function cachedClassManipulation(cache, classes, op) {
                        for (var i = 0, ii = classes.length; ii > i; ++i) {
                            var className = classes[i];
                            cache[className] = op
                        }
                    }
                    function asyncPromise() {
                        return currentDefer || (currentDefer = $$q.defer(), $$asyncCallback(function () {
                            currentDefer.resolve(), currentDefer = null
                        })), currentDefer.promise
                    }
                    function applyStyles(element, options) {
                        if (angular.isObject(options)) {
                            var styles = extend(options.from || {}, options.to || {});
                            element.css(styles)
                        }
                    }
                    var currentDefer;
                    return{animate: function (element, from, to) {
                            return applyStyles(element, {from: from, to: to}), asyncPromise()
                        }, enter: function (element, parent, after, options) {
                            return applyStyles(element, options), after ? after.after(element) : parent.prepend(element), asyncPromise()
                        }, leave: function (element) {
                            return element.remove(), asyncPromise()
                        }, move: function (element, parent, after, options) {
                            return this.enter(element, parent, after, options)
                        }, addClass: function (element, className, options) {
                            return this.setClass(element, className, [], options)
                        }, $$addClassImmediately: function (element, className, options) {
                            return element = jqLite(element), className = isString(className) ? className : isArray(className) ? className.join(" ") : "", forEach(element, function (element) {
                                jqLiteAddClass(element, className)
                            }), applyStyles(element, options), asyncPromise()
                        }, removeClass: function (element, className, options) {
                            return this.setClass(element, [], className, options)
                        }, $$removeClassImmediately: function (element, className, options) {
                            return element = jqLite(element), className = isString(className) ? className : isArray(className) ? className.join(" ") : "", forEach(element, function (element) {
                                jqLiteRemoveClass(element, className)
                            }), applyStyles(element, options), asyncPromise()
                        }, setClass: function (element, add, remove, options) {
                            var self = this, STORAGE_KEY = "$$animateClasses", createdCache = !1;
                            element = jqLite(element);
                            var cache = element.data(STORAGE_KEY);
                            cache ? options && cache.options && (cache.options = angular.extend(cache.options || {}, options)) : (cache = {classes: {}, options: options}, createdCache = !0);
                            var classes = cache.classes;
                            return add = isArray(add) ? add : add.split(" "), remove = isArray(remove) ? remove : remove.split(" "), cachedClassManipulation(classes, add, !0), cachedClassManipulation(classes, remove, !1), createdCache && (cache.promise = runAnimationPostDigest(function (done) {
                                var cache = element.data(STORAGE_KEY);
                                if (element.removeData(STORAGE_KEY), cache) {
                                    var classes = resolveElementClasses(element, cache.classes);
                                    classes && self.$$setClassImmediately(element, classes[0], classes[1], cache.options)
                                }
                                done()
                            }), element.data(STORAGE_KEY, cache)), cache.promise
                        }, $$setClassImmediately: function (element, add, remove, options) {
                            return add && this.$$addClassImmediately(element, add), remove && this.$$removeClassImmediately(element, remove), applyStyles(element, options), asyncPromise()
                        }, enabled: noop, cancel: noop}
                }]
        }], $compileMinErr = minErr("$compile");
    $CompileProvider.$inject = ["$provide", "$$sanitizeUriProvider"];
    var PREFIX_REGEXP = /^((?:x|data)[\:\-_])/i, APPLICATION_JSON = "application/json", CONTENT_TYPE_APPLICATION_JSON = {"Content-Type": APPLICATION_JSON + ";charset=utf-8"}, JSON_START = /^\s*(\[|\{[^\{])/, JSON_END = /[\}\]]\s*$/, JSON_PROTECTION_PREFIX = /^\)\]\}',?\n/, $interpolateMinErr = minErr("$interpolate"), PATH_MATCH = /^([^\?#]*)(\?([^#]*))?(#(.*))?$/, DEFAULT_PORTS = {http: 80, https: 443, ftp: 21}, $locationMinErr = minErr("$location"), locationPrototype = {$$html5: !1, $$replace: !1, absUrl: locationGetter("$$absUrl"), url: function (url) {
            if (isUndefined(url))
                return this.$$url;
            var match = PATH_MATCH.exec(url);
            return(match[1] || "" === url) && this.path(decodeURIComponent(match[1])), (match[2] || match[1] || "" === url) && this.search(match[3] || ""), this.hash(match[5] || ""), this
        }, protocol: locationGetter("$$protocol"), host: locationGetter("$$host"), port: locationGetter("$$port"), path: locationGetterSetter("$$path", function (path) {
            return path = null !== path ? path.toString() : "", "/" == path.charAt(0) ? path : "/" + path
        }), search: function (search, paramValue) {
            switch (arguments.length) {
                case 0:
                    return this.$$search;
                case 1:
                    if (isString(search) || isNumber(search))
                        search = search.toString(), this.$$search = parseKeyValue(search);
                    else {
                        if (!isObject(search))
                            throw $locationMinErr("isrcharg", "The first argument of the `$location#search()` call must be a string or an object.");
                        search = copy(search, {}), forEach(search, function (value, key) {
                            null == value && delete search[key]
                        }), this.$$search = search
                    }
                    break;
                default:
                    isUndefined(paramValue) || null === paramValue ? delete this.$$search[search] : this.$$search[search] = paramValue
            }
            return this.$$compose(), this
        }, hash: locationGetterSetter("$$hash", function (hash) {
            return null !== hash ? hash.toString() : ""
        }), replace: function () {
            return this.$$replace = !0, this
        }};
    forEach([LocationHashbangInHtml5Url, LocationHashbangUrl, LocationHtml5Url], function (Location) {
        Location.prototype = Object.create(locationPrototype), Location.prototype.state = function (state) {
            if (!arguments.length)
                return this.$$state;
            if (Location !== LocationHtml5Url || !this.$$html5)
                throw $locationMinErr("nostate", "History API state support is available only in HTML5 mode and only in browsers supporting HTML5 History API");
            return this.$$state = isUndefined(state) ? null : state, this
        }
    });
    var $parseMinErr = minErr("$parse"), CALL = Function.prototype.call, APPLY = Function.prototype.apply, BIND = Function.prototype.bind, CONSTANTS = createMap();
    forEach({"null": function () {
            return null
        }, "true": function () {
            return!0
        }, "false": function () {
            return!1
        }, undefined: function () {
        }}, function (constantGetter, name) {
        constantGetter.constant = constantGetter.literal = constantGetter.sharedGetter = !0, CONSTANTS[name] = constantGetter
    }), CONSTANTS["this"] = function (self) {
        return self
    }, CONSTANTS["this"].sharedGetter = !0;
    var OPERATORS = extend(createMap(), {"+": function (self, locals, a, b) {
            return a = a(self, locals), b = b(self, locals), isDefined(a) ? isDefined(b) ? a + b : a : isDefined(b) ? b : undefined
        }, "-": function (self, locals, a, b) {
            return a = a(self, locals), b = b(self, locals), (isDefined(a) ? a : 0) - (isDefined(b) ? b : 0)
        }, "*": function (self, locals, a, b) {
            return a(self, locals) * b(self, locals)
        }, "/": function (self, locals, a, b) {
            return a(self, locals) / b(self, locals)
        }, "%": function (self, locals, a, b) {
            return a(self, locals) % b(self, locals)
        }, "===": function (self, locals, a, b) {
            return a(self, locals) === b(self, locals)
        }, "!==": function (self, locals, a, b) {
            return a(self, locals) !== b(self, locals)
        }, "==": function (self, locals, a, b) {
            return a(self, locals) == b(self, locals)
        }, "!=": function (self, locals, a, b) {
            return a(self, locals) != b(self, locals)
        }, "<": function (self, locals, a, b) {
            return a(self, locals) < b(self, locals)
        }, ">": function (self, locals, a, b) {
            return a(self, locals) > b(self, locals)
        }, "<=": function (self, locals, a, b) {
            return a(self, locals) <= b(self, locals)
        }, ">=": function (self, locals, a, b) {
            return a(self, locals) >= b(self, locals)
        }, "&&": function (self, locals, a, b) {
            return a(self, locals) && b(self, locals)
        }, "||": function (self, locals, a, b) {
            return a(self, locals) || b(self, locals)
        }, "!": function (self, locals, a) {
            return!a(self, locals)
        }, "=": !0, "|": !0}), ESCAPE = {n: "\n", f: "\f", r: "\r", t: "	", v: "", "'": "'", '"': '"'}, Lexer = function (options) {
        this.options = options
    };
    Lexer.prototype = {constructor: Lexer, lex: function (text) {
            for (this.text = text, this.index = 0, this.tokens = []; this.index < this.text.length; ) {
                var ch = this.text.charAt(this.index);
                if ('"' === ch || "'" === ch)
                    this.readString(ch);
                else if (this.isNumber(ch) || "." === ch && this.isNumber(this.peek()))
                    this.readNumber();
                else if (this.isIdent(ch))
                    this.readIdent();
                else if (this.is(ch, "(){}[].,;:?"))
                    this.tokens.push({index: this.index, text: ch}), this.index++;
                else if (this.isWhitespace(ch))
                    this.index++;
                else {
                    var ch2 = ch + this.peek(), ch3 = ch2 + this.peek(2), op1 = OPERATORS[ch], op2 = OPERATORS[ch2], op3 = OPERATORS[ch3];
                    if (op1 || op2 || op3) {
                        var token = op3 ? ch3 : op2 ? ch2 : ch;
                        this.tokens.push({index: this.index, text: token, operator: !0}), this.index += token.length
                    } else
                        this.throwError("Unexpected next character ", this.index, this.index + 1)
                }
            }
            return this.tokens
        }, is: function (ch, chars) {
            return-1 !== chars.indexOf(ch)
        }, peek: function (i) {
            var num = i || 1;
            return this.index + num < this.text.length ? this.text.charAt(this.index + num) : !1
        }, isNumber: function (ch) {
            return ch >= "0" && "9" >= ch && "string" == typeof ch
        }, isWhitespace: function (ch) {
            return" " === ch || "\r" === ch || "	" === ch || "\n" === ch || "" === ch || " " === ch
        }, isIdent: function (ch) {
            return ch >= "a" && "z" >= ch || ch >= "A" && "Z" >= ch || "_" === ch || "$" === ch
        }, isExpOperator: function (ch) {
            return"-" === ch || "+" === ch || this.isNumber(ch)
        }, throwError: function (error, start, end) {
            end = end || this.index;
            var colStr = isDefined(start) ? "s " + start + "-" + this.index + " [" + this.text.substring(start, end) + "]" : " " + end;
            throw $parseMinErr("lexerr", "Lexer Error: {0} at column{1} in expression [{2}].", error, colStr, this.text)
        }, readNumber: function () {
            for (var number = "", start = this.index; this.index < this.text.length; ) {
                var ch = lowercase(this.text.charAt(this.index));
                if ("." == ch || this.isNumber(ch))
                    number += ch;
                else {
                    var peekCh = this.peek();
                    if ("e" == ch && this.isExpOperator(peekCh))
                        number += ch;
                    else if (this.isExpOperator(ch) && peekCh && this.isNumber(peekCh) && "e" == number.charAt(number.length - 1))
                        number += ch;
                    else {
                        if (!this.isExpOperator(ch) || peekCh && this.isNumber(peekCh) || "e" != number.charAt(number.length - 1))
                            break;
                        this.throwError("Invalid exponent")
                    }
                }
                this.index++
            }
            this.tokens.push({index: start, text: number, constant: !0, value: Number(number)})
        }, readIdent: function () {
            for (var start = this.index; this.index < this.text.length; ) {
                var ch = this.text.charAt(this.index);
                if (!this.isIdent(ch) && !this.isNumber(ch))
                    break;
                this.index++
            }
            this.tokens.push({index: start, text: this.text.slice(start, this.index), identifier: !0})
        }, readString: function (quote) {
            var start = this.index;
            this.index++;
            for (var string = "", rawString = quote, escape = !1; this.index < this.text.length; ) {
                var ch = this.text.charAt(this.index);
                if (rawString += ch, escape) {
                    if ("u" === ch) {
                        var hex = this.text.substring(this.index + 1, this.index + 5);
                        hex.match(/[\da-f]{4}/i) || this.throwError("Invalid unicode escape [\\u" + hex + "]"), this.index += 4, string += String.fromCharCode(parseInt(hex, 16))
                    } else {
                        var rep = ESCAPE[ch];
                        string += rep || ch
                    }
                    escape = !1
                } else if ("\\" === ch)
                    escape = !0;
                else {
                    if (ch === quote)
                        return this.index++, void this.tokens.push({index: start, text: rawString, constant: !0, value: string});
                    string += ch
                }
                this.index++
            }
            this.throwError("Unterminated quote", start)
        }};
    var Parser = function (lexer, $filter, options) {
        this.lexer = lexer, this.$filter = $filter, this.options = options
    };
    Parser.ZERO = extend(function () {
        return 0
    }, {sharedGetter: !0, constant: !0}), Parser.prototype = {constructor: Parser, parse: function (text) {
            this.text = text, this.tokens = this.lexer.lex(text);
            var value = this.statements();
            return 0 !== this.tokens.length && this.throwError("is an unexpected token", this.tokens[0]), value.literal = !!value.literal, value.constant = !!value.constant, value
        }, primary: function () {
            var primary;
            this.expect("(") ? (primary = this.filterChain(), this.consume(")")) : this.expect("[") ? primary = this.arrayDeclaration() : this.expect("{") ? primary = this.object() : this.peek().identifier ? primary = this.identifier() : this.peek().constant ? primary = this.constant() : this.throwError("not a primary expression", this.peek());
            for (var next, context; next = this.expect("(", "[", "."); )
                "(" === next.text ? (primary = this.functionCall(primary, context), context = null) : "[" === next.text ? (context = primary, primary = this.objectIndex(primary)) : "." === next.text ? (context = primary, primary = this.fieldAccess(primary)) : this.throwError("IMPOSSIBLE");
            return primary
        }, throwError: function (msg, token) {
            throw $parseMinErr("syntax", "Syntax Error: Token '{0}' {1} at column {2} of the expression [{3}] starting at [{4}].", token.text, msg, token.index + 1, this.text, this.text.substring(token.index))
        }, peekToken: function () {
            if (0 === this.tokens.length)
                throw $parseMinErr("ueoe", "Unexpected end of expression: {0}", this.text);
            return this.tokens[0]
        }, peek: function (e1, e2, e3, e4) {
            return this.peekAhead(0, e1, e2, e3, e4)
        }, peekAhead: function (i, e1, e2, e3, e4) {
            if (this.tokens.length > i) {
                var token = this.tokens[i], t = token.text;
                if (t === e1 || t === e2 || t === e3 || t === e4 || !e1 && !e2 && !e3 && !e4)
                    return token
            }
            return!1
        }, expect: function (e1, e2, e3, e4) {
            var token = this.peek(e1, e2, e3, e4);
            return token ? (this.tokens.shift(), token) : !1
        }, consume: function (e1) {
            if (0 === this.tokens.length)
                throw $parseMinErr("ueoe", "Unexpected end of expression: {0}", this.text);
            var token = this.expect(e1);
            return token || this.throwError("is unexpected, expecting [" + e1 + "]", this.peek()), token
        }, unaryFn: function (op, right) {
            var fn = OPERATORS[op];
            return extend(function (self, locals) {
                return fn(self, locals, right)
            }, {constant: right.constant, inputs: [right]})
        }, binaryFn: function (left, op, right, isBranching) {
            var fn = OPERATORS[op];
            return extend(function (self, locals) {
                return fn(self, locals, left, right)
            }, {constant: left.constant && right.constant, inputs: !isBranching && [left, right]})
        }, identifier: function () {
            for (var id = this.consume().text; this.peek(".") && this.peekAhead(1).identifier && !this.peekAhead(2, "("); )
                id += this.consume().text + this.consume().text;
            return CONSTANTS[id] || getterFn(id, this.options, this.text)
        }, constant: function () {
            var value = this.consume().value;
            return extend(function () {
                return value
            }, {constant: !0, literal: !0})
        }, statements: function () {
            for (var statements = []; ; )
                if (this.tokens.length > 0 && !this.peek("}", ")", ";", "]") && statements.push(this.filterChain()), !this.expect(";"))
                    return 1 === statements.length ? statements[0] : function (self, locals) {
                        for (var value, i = 0, ii = statements.length; ii > i; i++)
                            value = statements[i](self, locals);
                        return value
                    }
        }, filterChain: function () {
            for (var token, left = this.expression(); token = this.expect("|"); )
                left = this.filter(left);
            return left
        }, filter: function (inputFn) {
            var argsFn, args, fn = this.$filter(this.consume().text);
            if (this.peek(":"))
                for (argsFn = [], args = []; this.expect(":"); )
                    argsFn.push(this.expression());
            var inputs = [inputFn].concat(argsFn || []);
            return extend(function (self, locals) {
                var input = inputFn(self, locals);
                if (args) {
                    args[0] = input;
                    for (var i = argsFn.length; i--; )
                        args[i + 1] = argsFn[i](self, locals);
                    return fn.apply(undefined, args)
                }
                return fn(input)
            }, {constant: !fn.$stateful && inputs.every(isConstant), inputs: !fn.$stateful && inputs})
        }, expression: function () {
            return this.assignment()
        }, assignment: function () {
            var right, token, left = this.ternary();
            return(token = this.expect("=")) ? (left.assign || this.throwError("implies assignment but [" + this.text.substring(0, token.index) + "] can not be assigned to", token), right = this.ternary(), extend(function (scope, locals) {
                return left.assign(scope, right(scope, locals), locals)
            }, {inputs: [left, right]})) : left
        }, ternary: function () {
            var middle, token, left = this.logicalOR();
            if ((token = this.expect("?")) && (middle = this.assignment(), this.consume(":"))) {
                var right = this.assignment();
                return extend(function (self, locals) {
                    return left(self, locals) ? middle(self, locals) : right(self, locals)
                }, {constant: left.constant && middle.constant && right.constant})
            }
            return left
        }, logicalOR: function () {
            for (var token, left = this.logicalAND(); token = this.expect("||"); )
                left = this.binaryFn(left, token.text, this.logicalAND(), !0);
            return left
        }, logicalAND: function () {
            var token, left = this.equality();
            return(token = this.expect("&&")) && (left = this.binaryFn(left, token.text, this.logicalAND(), !0)), left
        }, equality: function () {
            var token, left = this.relational();
            return(token = this.expect("==", "!=", "===", "!==")) && (left = this.binaryFn(left, token.text, this.equality())), left
        }, relational: function () {
            var token, left = this.additive();
            return(token = this.expect("<", ">", "<=", ">=")) && (left = this.binaryFn(left, token.text, this.relational())), left
        }, additive: function () {
            for (var token, left = this.multiplicative(); token = this.expect("+", "-"); )
                left = this.binaryFn(left, token.text, this.multiplicative());
            return left
        }, multiplicative: function () {
            for (var token, left = this.unary(); token = this.expect("*", "/", "%"); )
                left = this.binaryFn(left, token.text, this.unary());
            return left
        }, unary: function () {
            var token;
            return this.expect("+") ? this.primary() : (token = this.expect("-")) ? this.binaryFn(Parser.ZERO, token.text, this.unary()) : (token = this.expect("!")) ? this.unaryFn(token.text, this.unary()) : this.primary()
        }, fieldAccess: function (object) {
            var expression = this.text, field = this.consume().text, getter = getterFn(field, this.options, expression);
            return extend(function (scope, locals, self) {
                return getter(self || object(scope, locals))
            }, {assign: function (scope, value, locals) {
                    var o = object(scope, locals);
                    return o || object.assign(scope, o = {}), setter(o, field, value, expression)
                }})
        }, objectIndex: function (obj) {
            var expression = this.text, indexFn = this.expression();
            return this.consume("]"), extend(function (self, locals) {
                var v, o = obj(self, locals), i = indexFn(self, locals);
                return ensureSafeMemberName(i, expression), o ? v = ensureSafeObject(o[i], expression) : undefined
            }, {assign: function (self, value, locals) {
                    var key = ensureSafeMemberName(indexFn(self, locals), expression), o = ensureSafeObject(obj(self, locals), expression);
                    return o || obj.assign(self, o = {}), o[key] = value
                }})
        }, functionCall: function (fnGetter, contextGetter) {
            var argsFn = [];
            if (")" !== this.peekToken().text)
                do
                    argsFn.push(this.expression());
                while (this.expect(","));
            this.consume(")");
            var expressionText = this.text, args = argsFn.length ? [] : null;
            return function (scope, locals) {
                var context = contextGetter ? contextGetter(scope, locals) : scope, fn = fnGetter(scope, locals, context) || noop;
                if (args)
                    for (var i = argsFn.length; i--; )
                        args[i] = ensureSafeObject(argsFn[i](scope, locals), expressionText);
                ensureSafeObject(context, expressionText), ensureSafeFunction(fn, expressionText);
                var v = fn.apply ? fn.apply(context, args) : fn(args[0], args[1], args[2], args[3], args[4]);
                return ensureSafeObject(v, expressionText)
            }
        }, arrayDeclaration: function () {
            var elementFns = [];
            if ("]" !== this.peekToken().text)
                do {
                    if (this.peek("]"))
                        break;
                    elementFns.push(this.expression())
                } while (this.expect(","));
            return this.consume("]"), extend(function (self, locals) {
                for (var array = [], i = 0, ii = elementFns.length; ii > i; i++)
                    array.push(elementFns[i](self, locals));
                return array
            }, {literal: !0, constant: elementFns.every(isConstant), inputs: elementFns})
        }, object: function () {
            var keys = [], valueFns = [];
            if ("}" !== this.peekToken().text)
                do {
                    if (this.peek("}"))
                        break;
                    var token = this.consume();
                    token.constant ? keys.push(token.value) : token.identifier ? keys.push(token.text) : this.throwError("invalid key", token), this.consume(":"), valueFns.push(this.expression())
                } while (this.expect(","));
            return this.consume("}"), extend(function (self, locals) {
                for (var object = {}, i = 0, ii = valueFns.length; ii > i; i++)
                    object[keys[i]] = valueFns[i](self, locals);
                return object
            }, {literal: !0, constant: valueFns.every(isConstant), inputs: valueFns})
        }};
    var getterFnCacheDefault = createMap(), getterFnCacheExpensive = createMap(), objectValueOf = Object.prototype.valueOf, $sceMinErr = minErr("$sce"), SCE_CONTEXTS = {HTML: "html", CSS: "css", URL: "url", RESOURCE_URL: "resourceUrl", JS: "js"}, $compileMinErr = minErr("$compile"), urlParsingNode = document.createElement("a"), originUrl = urlResolve(window.location.href);
    $FilterProvider.$inject = ["$provide"], currencyFilter.$inject = ["$locale"], numberFilter.$inject = ["$locale"];
    var DECIMAL_SEP = ".", DATE_FORMATS = {yyyy: dateGetter("FullYear", 4), yy: dateGetter("FullYear", 2, 0, !0), y: dateGetter("FullYear", 1), MMMM: dateStrGetter("Month"), MMM: dateStrGetter("Month", !0), MM: dateGetter("Month", 2, 1), M: dateGetter("Month", 1, 1), dd: dateGetter("Date", 2), d: dateGetter("Date", 1), HH: dateGetter("Hours", 2), H: dateGetter("Hours", 1), hh: dateGetter("Hours", 2, -12), h: dateGetter("Hours", 1, -12), mm: dateGetter("Minutes", 2), m: dateGetter("Minutes", 1), ss: dateGetter("Seconds", 2), s: dateGetter("Seconds", 1), sss: dateGetter("Milliseconds", 3), EEEE: dateStrGetter("Day"), EEE: dateStrGetter("Day", !0), a: ampmGetter, Z: timeZoneGetter, ww: weekGetter(2), w: weekGetter(1)}, DATE_FORMATS_SPLIT = /((?:[^yMdHhmsaZEw']+)|(?:'(?:[^']|'')*')|(?:E+|y+|M+|d+|H+|h+|m+|s+|a|Z|w+))(.*)/, NUMBER_STRING = /^\-?\d+$/;
    dateFilter.$inject = ["$locale"];
    var lowercaseFilter = valueFn(lowercase), uppercaseFilter = valueFn(uppercase);
    orderByFilter.$inject = ["$parse"];
    var htmlAnchorDirective = valueFn({restrict: "E", compile: function (element, attr) {
            return attr.href || attr.xlinkHref || attr.name ? void 0 : function (scope, element) {
                var href = "[object SVGAnimatedString]" === toString.call(element.prop("href")) ? "xlink:href" : "href";
                element.on("click", function (event) {
                    element.attr(href) || event.preventDefault()
                })
            }
        }}), ngAttributeAliasDirectives = {};
    forEach(BOOLEAN_ATTR, function (propName, attrName) {
        if ("multiple" != propName) {
            var normalized = directiveNormalize("ng-" + attrName);
            ngAttributeAliasDirectives[normalized] = function () {
                return{restrict: "A", priority: 100, link: function (scope, element, attr) {
                        scope.$watch(attr[normalized], function (value) {
                            attr.$set(attrName, !!value)
                        })
                    }}
            }
        }
    }), forEach(ALIASED_ATTR, function (htmlAttr, ngAttr) {
        ngAttributeAliasDirectives[ngAttr] = function () {
            return{priority: 100, link: function (scope, element, attr) {
                    if ("ngPattern" === ngAttr && "/" == attr.ngPattern.charAt(0)) {
                        var match = attr.ngPattern.match(REGEX_STRING_REGEXP);
                        if (match)
                            return void attr.$set("ngPattern", new RegExp(match[1], match[2]))
                    }
                    scope.$watch(attr[ngAttr], function (value) {
                        attr.$set(ngAttr, value)
                    })
                }}
        }
    }), forEach(["src", "srcset", "href"], function (attrName) {
        var normalized = directiveNormalize("ng-" + attrName);
        ngAttributeAliasDirectives[normalized] = function () {
            return{priority: 99, link: function (scope, element, attr) {
                    var propName = attrName, name = attrName;
                    "href" === attrName && "[object SVGAnimatedString]" === toString.call(element.prop("href")) && (name = "xlinkHref", attr.$attr[name] = "xlink:href", propName = null), attr.$observe(normalized, function (value) {
                        return value ? (attr.$set(name, value), void(msie && propName && element.prop(propName, attr[name]))) : void("href" === attrName && attr.$set(name, null))
                    })
                }}
        }
    });
    var nullFormCtrl = {$addControl: noop, $$renameControl: nullFormRenameControl, $removeControl: noop, $setValidity: noop, $setDirty: noop, $setPristine: noop, $setSubmitted: noop}, SUBMITTED_CLASS = "ng-submitted";
    FormController.$inject = ["$element", "$attrs", "$scope", "$animate", "$interpolate"];
    var formDirectiveFactory = function (isNgForm) {
        return["$timeout", function ($timeout) {
                var formDirective = {name: "form", restrict: isNgForm ? "EAC" : "E", controller: FormController, compile: function (formElement) {
                        return formElement.addClass(PRISTINE_CLASS).addClass(VALID_CLASS), {pre: function (scope, formElement, attr, controller) {
                                if (!("action"in attr)) {
                                    var handleFormSubmission = function (event) {
                                        scope.$apply(function () {
                                            controller.$commitViewValue(), controller.$setSubmitted()
                                        }), event.preventDefault()
                                    };
                                    addEventListenerFn(formElement[0], "submit", handleFormSubmission), formElement.on("$destroy", function () {
                                        $timeout(function () {
                                            removeEventListenerFn(formElement[0], "submit", handleFormSubmission)
                                        }, 0, !1)
                                    })
                                }
                                var parentFormCtrl = controller.$$parentForm, alias = controller.$name;
                                alias && (setter(scope, alias, controller, alias), attr.$observe(attr.name ? "name" : "ngForm", function (newValue) {
                                    alias !== newValue && (setter(scope, alias, undefined, alias), alias = newValue, setter(scope, alias, controller, alias), parentFormCtrl.$$renameControl(controller, alias))
                                })), formElement.on("$destroy", function () {
                                    parentFormCtrl.$removeControl(controller), alias && setter(scope, alias, undefined, alias), extend(controller, nullFormCtrl)
                                })
                            }}
                    }};
                return formDirective
            }]
    }, formDirective = formDirectiveFactory(), ngFormDirective = formDirectiveFactory(!0), ISO_DATE_REGEXP = /\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d\.\d+([+-][0-2]\d:[0-5]\d|Z)/, URL_REGEXP = /^(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?$/, EMAIL_REGEXP = /^[a-z0-9!#$%&'*+\/=?^_`{|}~.-]+@[a-z0-9]([a-z0-9-]*[a-z0-9])?(\.[a-z0-9]([a-z0-9-]*[a-z0-9])?)*$/i, NUMBER_REGEXP = /^\s*(\-|\+)?(\d+|(\d*(\.\d*)))\s*$/, DATE_REGEXP = /^(\d{4})-(\d{2})-(\d{2})$/, DATETIMELOCAL_REGEXP = /^(\d{4})-(\d\d)-(\d\d)T(\d\d):(\d\d)(?::(\d\d)(\.\d{1,3})?)?$/, WEEK_REGEXP = /^(\d{4})-W(\d\d)$/, MONTH_REGEXP = /^(\d{4})-(\d\d)$/, TIME_REGEXP = /^(\d\d):(\d\d)(?::(\d\d)(\.\d{1,3})?)?$/, DEFAULT_REGEXP = /(\s+|^)default(\s+|$)/, $ngModelMinErr = new minErr("ngModel"), inputType = {text: textInputType, date: createDateInputType("date", DATE_REGEXP, createDateParser(DATE_REGEXP, ["yyyy", "MM", "dd"]), "yyyy-MM-dd"), "datetime-local": createDateInputType("datetimelocal", DATETIMELOCAL_REGEXP, createDateParser(DATETIMELOCAL_REGEXP, ["yyyy", "MM", "dd", "HH", "mm", "ss", "sss"]), "yyyy-MM-ddTHH:mm:ss.sss"), time: createDateInputType("time", TIME_REGEXP, createDateParser(TIME_REGEXP, ["HH", "mm", "ss", "sss"]), "HH:mm:ss.sss"), week: createDateInputType("week", WEEK_REGEXP, weekParser, "yyyy-Www"), month: createDateInputType("month", MONTH_REGEXP, createDateParser(MONTH_REGEXP, ["yyyy", "MM"]), "yyyy-MM"), number: numberInputType, url: urlInputType, email: emailInputType, radio: radioInputType, checkbox: checkboxInputType, hidden: noop, button: noop, submit: noop, reset: noop, file: noop}, inputDirective = ["$browser", "$sniffer", "$filter", "$parse", function ($browser, $sniffer, $filter, $parse) {
            return{restrict: "E", require: ["?ngModel"], link: {pre: function (scope, element, attr, ctrls) {
                        ctrls[0] && (inputType[lowercase(attr.type)] || inputType.text)(scope, element, attr, ctrls[0], $sniffer, $browser, $filter, $parse)
                    }}}
        }], VALID_CLASS = "ng-valid", INVALID_CLASS = "ng-invalid", PRISTINE_CLASS = "ng-pristine", DIRTY_CLASS = "ng-dirty", UNTOUCHED_CLASS = "ng-untouched", TOUCHED_CLASS = "ng-touched", PENDING_CLASS = "ng-pending", NgModelController = ["$scope", "$exceptionHandler", "$attrs", "$element", "$parse", "$animate", "$timeout", "$rootScope", "$q", "$interpolate", function ($scope, $exceptionHandler, $attr, $element, $parse, $animate, $timeout, $rootScope, $q, $interpolate) {
            this.$viewValue = Number.NaN, this.$modelValue = Number.NaN, this.$$rawModelValue = undefined, this.$validators = {}, this.$asyncValidators = {}, this.$parsers = [], this.$formatters = [], this.$viewChangeListeners = [], this.$untouched = !0, this.$touched = !1, this.$pristine = !0, this.$dirty = !1, this.$valid = !0, this.$invalid = !1, this.$error = {}, this.$$success = {}, this.$pending = undefined, this.$name = $interpolate($attr.name || "", !1)($scope);
            var parsedNgModel = $parse($attr.ngModel), parsedNgModelAssign = parsedNgModel.assign, ngModelGet = parsedNgModel, ngModelSet = parsedNgModelAssign, pendingDebounce = null, ctrl = this;
            this.$$setOptions = function (options) {
                if (ctrl.$options = options, options && options.getterSetter) {
                    var invokeModelGetter = $parse($attr.ngModel + "()"), invokeModelSetter = $parse($attr.ngModel + "($$$p)");
                    ngModelGet = function ($scope) {
                        var modelValue = parsedNgModel($scope);
                        return isFunction(modelValue) && (modelValue = invokeModelGetter($scope)), modelValue
                    }, ngModelSet = function ($scope) {
                        isFunction(parsedNgModel($scope)) ? invokeModelSetter($scope, {$$$p: ctrl.$modelValue}) : parsedNgModelAssign($scope, ctrl.$modelValue)
                    }
                } else if (!parsedNgModel.assign)
                    throw $ngModelMinErr("nonassign", "Expression '{0}' is non-assignable. Element: {1}", $attr.ngModel, startingTag($element))
            }, this.$render = noop, this.$isEmpty = function (value) {
                return isUndefined(value) || "" === value || null === value || value !== value
            };
            var parentForm = $element.inheritedData("$formController") || nullFormCtrl, currentValidationRunId = 0;
            addSetValidityMethod({ctrl: this, $element: $element, set: function (object, property) {
                    object[property] = !0
                }, unset: function (object, property) {
                    delete object[property]
                }, parentForm: parentForm, $animate: $animate}), this.$setPristine = function () {
                ctrl.$dirty = !1, ctrl.$pristine = !0, $animate.removeClass($element, DIRTY_CLASS), $animate.addClass($element, PRISTINE_CLASS)
            }, this.$setDirty = function () {
                ctrl.$dirty = !0, ctrl.$pristine = !1, $animate.removeClass($element, PRISTINE_CLASS), $animate.addClass($element, DIRTY_CLASS), parentForm.$setDirty()
            }, this.$setUntouched = function () {
                ctrl.$touched = !1, ctrl.$untouched = !0, $animate.setClass($element, UNTOUCHED_CLASS, TOUCHED_CLASS)
            }, this.$setTouched = function () {
                ctrl.$touched = !0, ctrl.$untouched = !1, $animate.setClass($element, TOUCHED_CLASS, UNTOUCHED_CLASS)
            }, this.$rollbackViewValue = function () {
                $timeout.cancel(pendingDebounce), ctrl.$viewValue = ctrl.$$lastCommittedViewValue, ctrl.$render()
            }, this.$validate = function () {
                if (!isNumber(ctrl.$modelValue) || !isNaN(ctrl.$modelValue)) {
                    var viewValue = ctrl.$$lastCommittedViewValue, modelValue = ctrl.$$rawModelValue, parserName = ctrl.$$parserName || "parse", parserValid = ctrl.$error[parserName] ? !1 : undefined, prevValid = ctrl.$valid, prevModelValue = ctrl.$modelValue, allowInvalid = ctrl.$options && ctrl.$options.allowInvalid;
                    ctrl.$$runValidators(parserValid, modelValue, viewValue, function (allValid) {
                        allowInvalid || prevValid === allValid || (ctrl.$modelValue = allValid ? modelValue : undefined, ctrl.$modelValue !== prevModelValue && ctrl.$$writeModelToScope())
                    })
                }
            }, this.$$runValidators = function (parseValid, modelValue, viewValue, doneCallback) {
                function processParseErrors(parseValid) {
                    var errorKey = ctrl.$$parserName || "parse";
                    if (parseValid === undefined)
                        setValidity(errorKey, null);
                    else if (setValidity(errorKey, parseValid), !parseValid)
                        return forEach(ctrl.$validators, function (v, name) {
                            setValidity(name, null)
                        }), forEach(ctrl.$asyncValidators, function (v, name) {
                            setValidity(name, null)
                        }), !1;
                    return!0
                }
                function processSyncValidators() {
                    var syncValidatorsValid = !0;
                    return forEach(ctrl.$validators, function (validator, name) {
                        var result = validator(modelValue, viewValue);
                        syncValidatorsValid = syncValidatorsValid && result, setValidity(name, result)
                    }), syncValidatorsValid ? !0 : (forEach(ctrl.$asyncValidators, function (v, name) {
                        setValidity(name, null)
                    }), !1)
                }
                function processAsyncValidators() {
                    var validatorPromises = [], allValid = !0;
                    forEach(ctrl.$asyncValidators, function (validator, name) {
                        var promise = validator(modelValue, viewValue);
                        if (!isPromiseLike(promise))
                            throw $ngModelMinErr("$asyncValidators", "Expected asynchronous validator to return a promise but got '{0}' instead.", promise);
                        setValidity(name, undefined), validatorPromises.push(promise.then(function () {
                            setValidity(name, !0)
                        }, function () {
                            allValid = !1, setValidity(name, !1)
                        }))
                    }), validatorPromises.length ? $q.all(validatorPromises).then(function () {
                        validationDone(allValid)
                    }, noop) : validationDone(!0)
                }
                function setValidity(name, isValid) {
                    localValidationRunId === currentValidationRunId && ctrl.$setValidity(name, isValid)
                }
                function validationDone(allValid) {
                    localValidationRunId === currentValidationRunId && doneCallback(allValid)
                }
                currentValidationRunId++;
                var localValidationRunId = currentValidationRunId;
                return processParseErrors(parseValid) && processSyncValidators() ? void processAsyncValidators() : void validationDone(!1)
            }, this.$commitViewValue = function () {
                var viewValue = ctrl.$viewValue;
                $timeout.cancel(pendingDebounce), (ctrl.$$lastCommittedViewValue !== viewValue || "" === viewValue && ctrl.$$hasNativeValidators) && (ctrl.$$lastCommittedViewValue = viewValue, ctrl.$pristine && this.$setDirty(), this.$$parseAndValidate())
            }, this.$$parseAndValidate = function () {
                function writeToModelIfNeeded() {
                    ctrl.$modelValue !== prevModelValue && ctrl.$$writeModelToScope()
                }
                var viewValue = ctrl.$$lastCommittedViewValue, modelValue = viewValue, parserValid = isUndefined(modelValue) ? undefined : !0;
                if (parserValid)
                    for (var i = 0; i < ctrl.$parsers.length; i++)
                        if (modelValue = ctrl.$parsers[i](modelValue), isUndefined(modelValue)) {
                            parserValid = !1;
                            break
                        }
                isNumber(ctrl.$modelValue) && isNaN(ctrl.$modelValue) && (ctrl.$modelValue = ngModelGet($scope));
                var prevModelValue = ctrl.$modelValue, allowInvalid = ctrl.$options && ctrl.$options.allowInvalid;
                ctrl.$$rawModelValue = modelValue, allowInvalid && (ctrl.$modelValue = modelValue, writeToModelIfNeeded()), ctrl.$$runValidators(parserValid, modelValue, viewValue, function (allValid) {
                    allowInvalid || (ctrl.$modelValue = allValid ? modelValue : undefined, writeToModelIfNeeded())
                })
            }, this.$$writeModelToScope = function () {
                ngModelSet($scope, ctrl.$modelValue), forEach(ctrl.$viewChangeListeners, function (listener) {
                    try {
                        listener()
                    } catch (e) {
                        $exceptionHandler(e)
                    }
                })
            }, this.$setViewValue = function (value, trigger) {
                ctrl.$viewValue = value, (!ctrl.$options || ctrl.$options.updateOnDefault) && ctrl.$$debounceViewValueCommit(trigger)
            }, this.$$debounceViewValueCommit = function (trigger) {
                var debounce, debounceDelay = 0, options = ctrl.$options;
                options && isDefined(options.debounce) && (debounce = options.debounce, isNumber(debounce) ? debounceDelay = debounce : isNumber(debounce[trigger]) ? debounceDelay = debounce[trigger] : isNumber(debounce["default"]) && (debounceDelay = debounce["default"])), $timeout.cancel(pendingDebounce), debounceDelay ? pendingDebounce = $timeout(function () {
                    ctrl.$commitViewValue()
                }, debounceDelay) : $rootScope.$$phase ? ctrl.$commitViewValue() : $scope.$apply(function () {
                    ctrl.$commitViewValue()
                })
            }, $scope.$watch(function () {
                var modelValue = ngModelGet($scope);
                if (modelValue !== ctrl.$modelValue) {
                    ctrl.$modelValue = ctrl.$$rawModelValue = modelValue;
                    for (var formatters = ctrl.$formatters, idx = formatters.length, viewValue = modelValue; idx--; )
                        viewValue = formatters[idx](viewValue);
                    ctrl.$viewValue !== viewValue && (ctrl.$viewValue = ctrl.$$lastCommittedViewValue = viewValue, ctrl.$render(), ctrl.$$runValidators(undefined, modelValue, viewValue, noop))
                }
                return modelValue
            })
        }], ngModelDirective = ["$rootScope", function ($rootScope) {
            return{restrict: "A", require: ["ngModel", "^?form", "^?ngModelOptions"], controller: NgModelController, priority: 1, compile: function (element) {
                    return element.addClass(PRISTINE_CLASS).addClass(UNTOUCHED_CLASS).addClass(VALID_CLASS), {pre: function (scope, element, attr, ctrls) {
                            var modelCtrl = ctrls[0], formCtrl = ctrls[1] || nullFormCtrl;
                            modelCtrl.$$setOptions(ctrls[2] && ctrls[2].$options), formCtrl.$addControl(modelCtrl), attr.$observe("name", function (newValue) {
                                modelCtrl.$name !== newValue && formCtrl.$$renameControl(modelCtrl, newValue)
                            }), scope.$on("$destroy", function () {
                                formCtrl.$removeControl(modelCtrl)
                            })
                        }, post: function (scope, element, attr, ctrls) {
                            var modelCtrl = ctrls[0];
                            modelCtrl.$options && modelCtrl.$options.updateOn && element.on(modelCtrl.$options.updateOn, function (ev) {
                                modelCtrl.$$debounceViewValueCommit(ev && ev.type)
                            }), element.on("blur", function () {
                                modelCtrl.$touched || ($rootScope.$$phase ? scope.$evalAsync(modelCtrl.$setTouched) : scope.$apply(modelCtrl.$setTouched))
                            })
                        }}
                }}
        }], ngChangeDirective = valueFn({restrict: "A", require: "ngModel", link: function (scope, element, attr, ctrl) {
            ctrl.$viewChangeListeners.push(function () {
                scope.$eval(attr.ngChange)
            })
        }}), requiredDirective = function () {
        return{restrict: "A", require: "?ngModel", link: function (scope, elm, attr, ctrl) {
                ctrl && (attr.required = !0, ctrl.$validators.required = function (modelValue, viewValue) {
                    return!attr.required || !ctrl.$isEmpty(viewValue)
                }, attr.$observe("required", function () {
                    ctrl.$validate()
                }))
            }}
    }, patternDirective = function () {
        return{restrict: "A", require: "?ngModel", link: function (scope, elm, attr, ctrl) {
                if (ctrl) {
                    var regexp, patternExp = attr.ngPattern || attr.pattern;
                    attr.$observe("pattern", function (regex) {
                        if (isString(regex) && regex.length > 0 && (regex = new RegExp("^" + regex + "$")), regex && !regex.test)
                            throw minErr("ngPattern")("noregexp", "Expected {0} to be a RegExp but was {1}. Element: {2}", patternExp, regex, startingTag(elm));
                        regexp = regex || undefined, ctrl.$validate()
                    }), ctrl.$validators.pattern = function (value) {
                        return ctrl.$isEmpty(value) || isUndefined(regexp) || regexp.test(value)
                    }
                }
            }}
    }, maxlengthDirective = function () {
        return{restrict: "A", require: "?ngModel", link: function (scope, elm, attr, ctrl) {
                if (ctrl) {
                    var maxlength = -1;
                    attr.$observe("maxlength", function (value) {
                        var intVal = int(value);
                        maxlength = isNaN(intVal) ? -1 : intVal, ctrl.$validate()
                    }), ctrl.$validators.maxlength = function (modelValue, viewValue) {
                        return 0 > maxlength || ctrl.$isEmpty(modelValue) || viewValue.length <= maxlength
                    }
                }
            }}
    }, minlengthDirective = function () {
        return{restrict: "A", require: "?ngModel", link: function (scope, elm, attr, ctrl) {
                if (ctrl) {
                    var minlength = 0;
                    attr.$observe("minlength", function (value) {
                        minlength = int(value) || 0, ctrl.$validate()
                    }), ctrl.$validators.minlength = function (modelValue, viewValue) {
                        return ctrl.$isEmpty(viewValue) || viewValue.length >= minlength
                    }
                }
            }}
    }, ngListDirective = function () {
        return{restrict: "A", priority: 100, require: "ngModel", link: function (scope, element, attr, ctrl) {
                var ngList = element.attr(attr.$attr.ngList) || ", ", trimValues = "false" !== attr.ngTrim, separator = trimValues ? trim(ngList) : ngList, parse = function (viewValue) {
                    if (!isUndefined(viewValue)) {
                        var list = [];
                        return viewValue && forEach(viewValue.split(separator), function (value) {
                            value && list.push(trimValues ? trim(value) : value)
                        }), list
                    }
                };
                ctrl.$parsers.push(parse), ctrl.$formatters.push(function (value) {
                    return isArray(value) ? value.join(ngList) : undefined
                }), ctrl.$isEmpty = function (value) {
                    return!value || !value.length
                }
            }}
    }, CONSTANT_VALUE_REGEXP = /^(true|false|\d+)$/, ngValueDirective = function () {
        return{restrict: "A", priority: 100, compile: function (tpl, tplAttr) {
                return CONSTANT_VALUE_REGEXP.test(tplAttr.ngValue) ? function (scope, elm, attr) {
                    attr.$set("value", scope.$eval(attr.ngValue))
                } : function (scope, elm, attr) {
                    scope.$watch(attr.ngValue, function (value) {
                        attr.$set("value", value)
                    })
                }
            }}
    }, ngModelOptionsDirective = function () {
        return{restrict: "A", controller: ["$scope", "$attrs", function ($scope, $attrs) {
                    var that = this;
                    this.$options = $scope.$eval($attrs.ngModelOptions), this.$options.updateOn !== undefined ? (this.$options.updateOnDefault = !1, this.$options.updateOn = trim(this.$options.updateOn.replace(DEFAULT_REGEXP, function () {
                        return that.$options.updateOnDefault = !0, " "
                    }))) : this.$options.updateOnDefault = !0
                }]}
    }, ngBindDirective = ["$compile", function ($compile) {
            return{restrict: "AC", compile: function (templateElement) {
                    return $compile.$$addBindingClass(templateElement), function (scope, element, attr) {
                        $compile.$$addBindingInfo(element, attr.ngBind), element = element[0], scope.$watch(attr.ngBind, function (value) {
                            element.textContent = value === undefined ? "" : value
                        })
                    }
                }}
        }], ngBindTemplateDirective = ["$interpolate", "$compile", function ($interpolate, $compile) {
            return{compile: function (templateElement) {
                    return $compile.$$addBindingClass(templateElement), function (scope, element, attr) {
                        var interpolateFn = $interpolate(element.attr(attr.$attr.ngBindTemplate));
                        $compile.$$addBindingInfo(element, interpolateFn.expressions), element = element[0], attr.$observe("ngBindTemplate", function (value) {
                            element.textContent = value === undefined ? "" : value
                        })
                    }
                }}
        }], ngBindHtmlDirective = ["$sce", "$parse", "$compile", function ($sce, $parse, $compile) {
            return{restrict: "A", compile: function (tElement, tAttrs) {
                    var ngBindHtmlGetter = $parse(tAttrs.ngBindHtml), ngBindHtmlWatch = $parse(tAttrs.ngBindHtml, function (value) {
                        return(value || "").toString()
                    });
                    return $compile.$$addBindingClass(tElement), function (scope, element, attr) {
                        $compile.$$addBindingInfo(element, attr.ngBindHtml), scope.$watch(ngBindHtmlWatch, function () {
                            element.html($sce.getTrustedHtml(ngBindHtmlGetter(scope)) || "")
                        })
                    }
                }}
        }], ngClassDirective = classDirective("", !0), ngClassOddDirective = classDirective("Odd", 0), ngClassEvenDirective = classDirective("Even", 1), ngCloakDirective = ngDirective({compile: function (element, attr) {
            attr.$set("ngCloak", undefined), element.removeClass("ng-cloak")
        }}), ngControllerDirective = [function () {
            return{restrict: "A", scope: !0, controller: "@", priority: 500}
        }], ngEventDirectives = {}, forceAsyncEvents = {blur: !0, focus: !0};
    forEach("click dblclick mousedown mouseup mouseover mouseout mousemove mouseenter mouseleave keydown keyup keypress submit focus blur copy cut paste".split(" "), function (eventName) {
        var directiveName = directiveNormalize("ng-" + eventName);
        ngEventDirectives[directiveName] = ["$parse", "$rootScope", function ($parse, $rootScope) {
                return{restrict: "A", compile: function ($element, attr) {
                        var fn = $parse(attr[directiveName], null, !0);
                        return function (scope, element) {
                            element.on(eventName, function (event) {
                                var callback = function () {
                                    fn(scope, {$event: event})
                                };
                                forceAsyncEvents[eventName] && $rootScope.$$phase ? scope.$evalAsync(callback) : scope.$apply(callback)
                            })
                        }
                    }}
            }]
    });
    var ngIfDirective = ["$animate", function ($animate) {
            return{multiElement: !0, transclude: "element", priority: 600, terminal: !0, restrict: "A", $$tlb: !0, link: function ($scope, $element, $attr, ctrl, $transclude) {
                    var block, childScope, previousElements;
                    $scope.$watch($attr.ngIf, function (value) {
                        value ? childScope || $transclude(function (clone, newScope) {
                            childScope = newScope, clone[clone.length++] = document.createComment(" end ngIf: " + $attr.ngIf + " "), block = {clone: clone}, $animate.enter(clone, $element.parent(), $element)
                        }) : (previousElements && (previousElements.remove(), previousElements = null), childScope && (childScope.$destroy(), childScope = null), block && (previousElements = getBlockNodes(block.clone), $animate.leave(previousElements).then(function () {
                            previousElements = null
                        }), block = null))
                    })
                }}
        }], ngIncludeDirective = ["$templateRequest", "$anchorScroll", "$animate", "$sce", function ($templateRequest, $anchorScroll, $animate, $sce) {
            return{restrict: "ECA", priority: 400, terminal: !0, transclude: "element", controller: angular.noop, compile: function (element, attr) {
                    var srcExp = attr.ngInclude || attr.src, onloadExp = attr.onload || "", autoScrollExp = attr.autoscroll;
                    return function (scope, $element, $attr, ctrl, $transclude) {
                        var currentScope, previousElement, currentElement, changeCounter = 0, cleanupLastIncludeContent = function () {
                            previousElement && (previousElement.remove(), previousElement = null), currentScope && (currentScope.$destroy(), currentScope = null), currentElement && ($animate.leave(currentElement).then(function () {
                                previousElement = null
                            }), previousElement = currentElement, currentElement = null)
                        };
                        scope.$watch($sce.parseAsResourceUrl(srcExp), function (src) {
                            var afterAnimation = function () {
                                !isDefined(autoScrollExp) || autoScrollExp && !scope.$eval(autoScrollExp) || $anchorScroll()
                            }, thisChangeId = ++changeCounter;
                            src ? ($templateRequest(src, !0).then(function (response) {
                                if (thisChangeId === changeCounter) {
                                    var newScope = scope.$new();
                                    ctrl.template = response;
                                    var clone = $transclude(newScope, function (clone) {
                                        cleanupLastIncludeContent(), $animate.enter(clone, null, $element).then(afterAnimation)
                                    });
                                    currentScope = newScope, currentElement = clone, currentScope.$emit("$includeContentLoaded", src), scope.$eval(onloadExp)
                                }
                            }, function () {
                                thisChangeId === changeCounter && (cleanupLastIncludeContent(), scope.$emit("$includeContentError", src))
                            }), scope.$emit("$includeContentRequested", src)) : (cleanupLastIncludeContent(), ctrl.template = null)
                        })
                    }
                }}
        }], ngIncludeFillContentDirective = ["$compile", function ($compile) {
            return{restrict: "ECA", priority: -400, require: "ngInclude", link: function (scope, $element, $attr, ctrl) {
                    return/SVG/.test($element[0].toString()) ? ($element.empty(), void $compile(jqLiteBuildFragment(ctrl.template, document).childNodes)(scope, function (clone) {
                        $element.append(clone)
                    }, {futureParentElement: $element})) : ($element.html(ctrl.template), void $compile($element.contents())(scope))
                }}
        }], ngInitDirective = ngDirective({priority: 450, compile: function () {
            return{pre: function (scope, element, attrs) {
                    scope.$eval(attrs.ngInit)
                }}
        }}), ngNonBindableDirective = ngDirective({terminal: !0, priority: 1e3}), ngPluralizeDirective = ["$locale", "$interpolate", function ($locale, $interpolate) {
            var BRACE = /{}/g, IS_WHEN = /^when(Minus)?(.+)$/;
            return{restrict: "EA", link: function (scope, element, attr) {
                    function updateElementText(newText) {
                        element.text(newText || "")
                    }
                    var lastCount, numberExp = attr.count, whenExp = attr.$attr.when && element.attr(attr.$attr.when), offset = attr.offset || 0, whens = scope.$eval(whenExp) || {}, whensExpFns = {}, startSymbol = $interpolate.startSymbol(), endSymbol = $interpolate.endSymbol(), braceReplacement = startSymbol + numberExp + "-" + offset + endSymbol, watchRemover = angular.noop;
                    forEach(attr, function (expression, attributeName) {
                        var tmpMatch = IS_WHEN.exec(attributeName);
                        if (tmpMatch) {
                            var whenKey = (tmpMatch[1] ? "-" : "") + lowercase(tmpMatch[2]);
                            whens[whenKey] = element.attr(attr.$attr[attributeName])
                        }
                    }), forEach(whens, function (expression, key) {
                        whensExpFns[key] = $interpolate(expression.replace(BRACE, braceReplacement))
                    }), scope.$watch(numberExp, function (newVal) {
                        var count = parseFloat(newVal), countIsNaN = isNaN(count);
                        countIsNaN || count in whens || (count = $locale.pluralCat(count - offset)), count === lastCount || countIsNaN && isNaN(lastCount) || (watchRemover(), watchRemover = scope.$watch(whensExpFns[count], updateElementText), lastCount = count)
                    })
                }}
        }], ngRepeatDirective = ["$parse", "$animate", function ($parse, $animate) {
            var NG_REMOVED = "$$NG_REMOVED", ngRepeatMinErr = minErr("ngRepeat"), updateScope = function (scope, index, valueIdentifier, value, keyIdentifier, key, arrayLength) {
                scope[valueIdentifier] = value, keyIdentifier && (scope[keyIdentifier] = key), scope.$index = index, scope.$first = 0 === index, scope.$last = index === arrayLength - 1, scope.$middle = !(scope.$first || scope.$last), scope.$odd = !(scope.$even = 0 === (1 & index))
            }, getBlockStart = function (block) {
                return block.clone[0]
            }, getBlockEnd = function (block) {
                return block.clone[block.clone.length - 1]
            };
            return{restrict: "A", multiElement: !0, transclude: "element", priority: 1e3, terminal: !0, $$tlb: !0, compile: function ($element, $attr) {
                    var expression = $attr.ngRepeat, ngRepeatEndComment = document.createComment(" end ngRepeat: " + expression + " "), match = expression.match(/^\s*([\s\S]+?)\s+in\s+([\s\S]+?)(?:\s+as\s+([\s\S]+?))?(?:\s+track\s+by\s+([\s\S]+?))?\s*$/);
                    if (!match)
                        throw ngRepeatMinErr("iexp", "Expected expression in form of '_item_ in _collection_[ track by _id_]' but got '{0}'.", expression);
                    var lhs = match[1], rhs = match[2], aliasAs = match[3], trackByExp = match[4];
                    if (match = lhs.match(/^(?:([\$\w]+)|\(([\$\w]+)\s*,\s*([\$\w]+)\))$/), !match)
                        throw ngRepeatMinErr("iidexp", "'_item_' in '_item_ in _collection_' should be an identifier or '(_key_, _value_)' expression, but got '{0}'.", lhs);
                    var valueIdentifier = match[3] || match[1], keyIdentifier = match[2];
                    if (aliasAs && (!/^[$a-zA-Z_][$a-zA-Z0-9_]*$/.test(aliasAs) || /^(null|undefined|this|\$index|\$first|\$middle|\$last|\$even|\$odd|\$parent)$/.test(aliasAs)))
                        throw ngRepeatMinErr("badident", "alias '{0}' is invalid --- must be a valid JS identifier which is not a reserved name.", aliasAs);
                    var trackByExpGetter, trackByIdExpFn, trackByIdArrayFn, trackByIdObjFn, hashFnLocals = {$id: hashKey};
                    return trackByExp ? trackByExpGetter = $parse(trackByExp) : (trackByIdArrayFn = function (key, value) {
                        return hashKey(value)
                    }, trackByIdObjFn = function (key) {
                        return key
                    }), function ($scope, $element, $attr, ctrl, $transclude) {
                        trackByExpGetter && (trackByIdExpFn = function (key, value, index) {
                            return keyIdentifier && (hashFnLocals[keyIdentifier] = key), hashFnLocals[valueIdentifier] = value, hashFnLocals.$index = index, trackByExpGetter($scope, hashFnLocals)
                        });
                        var lastBlockMap = createMap();
                        $scope.$watchCollection(rhs, function (collection) {
                            var index, length, nextNode, collectionLength, key, value, trackById, trackByIdFn, collectionKeys, block, nextBlockOrder, elementsToRemove, previousNode = $element[0], nextBlockMap = createMap();
                            if (aliasAs && ($scope[aliasAs] = collection), isArrayLike(collection))
                                collectionKeys = collection, trackByIdFn = trackByIdExpFn || trackByIdArrayFn;
                            else {
                                trackByIdFn = trackByIdExpFn || trackByIdObjFn, collectionKeys = [];
                                for (var itemKey in collection)
                                    collection.hasOwnProperty(itemKey) && "$" != itemKey.charAt(0) && collectionKeys.push(itemKey);
                                collectionKeys.sort()
                            }
                            for (collectionLength = collectionKeys.length, nextBlockOrder = new Array(collectionLength), index = 0; collectionLength > index; index++)
                                if (key = collection === collectionKeys ? index : collectionKeys[index], value = collection[key], trackById = trackByIdFn(key, value, index), lastBlockMap[trackById])
                                    block = lastBlockMap[trackById], delete lastBlockMap[trackById], nextBlockMap[trackById] = block, nextBlockOrder[index] = block;
                                else {
                                    if (nextBlockMap[trackById])
                                        throw forEach(nextBlockOrder, function (block) {
                                            block && block.scope && (lastBlockMap[block.id] = block)
                                        }), ngRepeatMinErr("dupes", "Duplicates in a repeater are not allowed. Use 'track by' expression to specify unique keys. Repeater: {0}, Duplicate key: {1}, Duplicate value: {2}", expression, trackById, value);
                                    nextBlockOrder[index] = {id: trackById, scope: undefined, clone: undefined}, nextBlockMap[trackById] = !0
                                }
                            for (var blockKey in lastBlockMap) {
                                if (block = lastBlockMap[blockKey], elementsToRemove = getBlockNodes(block.clone), $animate.leave(elementsToRemove), elementsToRemove[0].parentNode)
                                    for (index = 0, length = elementsToRemove.length; length > index; index++)
                                        elementsToRemove[index][NG_REMOVED] = !0;
                                block.scope.$destroy()
                            }
                            for (index = 0; collectionLength > index; index++)
                                if (key = collection === collectionKeys ? index : collectionKeys[index], value = collection[key], block = nextBlockOrder[index], block.scope) {
                                    nextNode = previousNode;
                                    do
                                        nextNode = nextNode.nextSibling;
                                    while (nextNode && nextNode[NG_REMOVED]);
                                    getBlockStart(block) != nextNode && $animate.move(getBlockNodes(block.clone), null, jqLite(previousNode)), previousNode = getBlockEnd(block), updateScope(block.scope, index, valueIdentifier, value, keyIdentifier, key, collectionLength)
                                } else
                                    $transclude(function (clone, scope) {
                                        block.scope = scope;
                                        var endNode = ngRepeatEndComment.cloneNode(!1);
                                        clone[clone.length++] = endNode, $animate.enter(clone, null, jqLite(previousNode)), previousNode = endNode, block.clone = clone, nextBlockMap[block.id] = block, updateScope(block.scope, index, valueIdentifier, value, keyIdentifier, key, collectionLength)
                                    });
                            lastBlockMap = nextBlockMap
                        })
                    }
                }}
        }], NG_HIDE_CLASS = "ng-hide", NG_HIDE_IN_PROGRESS_CLASS = "ng-hide-animate", ngShowDirective = ["$animate", function ($animate) {
            return{restrict: "A", multiElement: !0, link: function (scope, element, attr) {
                    scope.$watch(attr.ngShow, function (value) {
                        $animate[value ? "removeClass" : "addClass"](element, NG_HIDE_CLASS, {tempClasses: NG_HIDE_IN_PROGRESS_CLASS})
                    })
                }}
        }], ngHideDirective = ["$animate", function ($animate) {
            return{restrict: "A", multiElement: !0, link: function (scope, element, attr) {
                    scope.$watch(attr.ngHide, function (value) {
                        $animate[value ? "addClass" : "removeClass"](element, NG_HIDE_CLASS, {tempClasses: NG_HIDE_IN_PROGRESS_CLASS})
                    })
                }}
        }], ngStyleDirective = ngDirective(function (scope, element, attr) {
        scope.$watch(attr.ngStyle, function (newStyles, oldStyles) {
            oldStyles && newStyles !== oldStyles && forEach(oldStyles, function (val, style) {
                element.css(style, "")
            }), newStyles && element.css(newStyles)
        }, !0)
    }), ngSwitchDirective = ["$animate", function ($animate) {
            return{restrict: "EA", require: "ngSwitch", controller: ["$scope", function () {
                        this.cases = {}
                    }], link: function (scope, element, attr, ngSwitchController) {
                    var watchExpr = attr.ngSwitch || attr.on, selectedTranscludes = [], selectedElements = [], previousLeaveAnimations = [], selectedScopes = [], spliceFactory = function (array, index) {
                        return function () {
                            array.splice(index, 1)
                        }
                    };
                    scope.$watch(watchExpr, function (value) {
                        var i, ii;
                        for (i = 0, ii = previousLeaveAnimations.length; ii > i; ++i)
                            $animate.cancel(previousLeaveAnimations[i]);
                        for (previousLeaveAnimations.length = 0, i = 0, ii = selectedScopes.length; ii > i; ++i) {
                            var selected = getBlockNodes(selectedElements[i].clone);
                            selectedScopes[i].$destroy();
                            var promise = previousLeaveAnimations[i] = $animate.leave(selected);
                            promise.then(spliceFactory(previousLeaveAnimations, i))
                        }
                        selectedElements.length = 0, selectedScopes.length = 0, (selectedTranscludes = ngSwitchController.cases["!" + value] || ngSwitchController.cases["?"]) && forEach(selectedTranscludes, function (selectedTransclude) {
                            selectedTransclude.transclude(function (caseElement, selectedScope) {
                                selectedScopes.push(selectedScope);
                                var anchor = selectedTransclude.element;
                                caseElement[caseElement.length++] = document.createComment(" end ngSwitchWhen: ");
                                var block = {clone: caseElement};
                                selectedElements.push(block), $animate.enter(caseElement, anchor.parent(), anchor)
                            })
                        })
                    })
                }}
        }], ngSwitchWhenDirective = ngDirective({transclude: "element", priority: 1200, require: "^ngSwitch", multiElement: !0, link: function (scope, element, attrs, ctrl, $transclude) {
            ctrl.cases["!" + attrs.ngSwitchWhen] = ctrl.cases["!" + attrs.ngSwitchWhen] || [], ctrl.cases["!" + attrs.ngSwitchWhen].push({transclude: $transclude, element: element})
        }}), ngSwitchDefaultDirective = ngDirective({transclude: "element", priority: 1200, require: "^ngSwitch", multiElement: !0, link: function (scope, element, attr, ctrl, $transclude) {
            ctrl.cases["?"] = ctrl.cases["?"] || [], ctrl.cases["?"].push({transclude: $transclude, element: element})
        }}), ngTranscludeDirective = ngDirective({restrict: "EAC", link: function ($scope, $element, $attrs, controller, $transclude) {
            if (!$transclude)
                throw minErr("ngTransclude")("orphan", "Illegal use of ngTransclude directive in the template! No parent directive that requires a transclusion found. Element: {0}", startingTag($element));
            $transclude(function (clone) {
                $element.empty(), $element.append(clone)
            })
        }}), scriptDirective = ["$templateCache", function ($templateCache) {
            return{restrict: "E", terminal: !0, compile: function (element, attr) {
                    if ("text/ng-template" == attr.type) {
                        var templateUrl = attr.id, text = element[0].text;
                        $templateCache.put(templateUrl, text)
                    }
                }}
        }], ngOptionsMinErr = minErr("ngOptions"), ngOptionsDirective = valueFn({restrict: "A", terminal: !0}), selectDirective = ["$compile", "$parse", function ($compile, $parse) {
            var NG_OPTIONS_REGEXP = /^\s*([\s\S]+?)(?:\s+as\s+([\s\S]+?))?(?:\s+group\s+by\s+([\s\S]+?))?\s+for\s+(?:([\$\w][\$\w]*)|(?:\(\s*([\$\w][\$\w]*)\s*,\s*([\$\w][\$\w]*)\s*\)))\s+in\s+([\s\S]+?)(?:\s+track\s+by\s+([\s\S]+?))?$/, nullModelCtrl = {$setViewValue: noop};
            return{restrict: "E", require: ["select", "?ngModel"], controller: ["$element", "$scope", "$attrs", function ($element, $scope, $attrs) {
                        var nullOption, unknownOption, self = this, optionsMap = {}, ngModelCtrl = nullModelCtrl;
                        self.databound = $attrs.ngModel, self.init = function (ngModelCtrl_, nullOption_, unknownOption_) {
                            ngModelCtrl = ngModelCtrl_, nullOption = nullOption_, unknownOption = unknownOption_
                        }, self.addOption = function (value, element) {
                            assertNotHasOwnProperty(value, '"option value"'), optionsMap[value] = !0, ngModelCtrl.$viewValue == value && ($element.val(value), unknownOption.parent() && unknownOption.remove()), element && element[0].hasAttribute("selected") && (element[0].selected = !0)
                        }, self.removeOption = function (value) {
                            this.hasOption(value) && (delete optionsMap[value], ngModelCtrl.$viewValue === value && this.renderUnknownOption(value))
                        }, self.renderUnknownOption = function (val) {
                            var unknownVal = "? " + hashKey(val) + " ?";
                            unknownOption.val(unknownVal), $element.prepend(unknownOption), $element.val(unknownVal), unknownOption.prop("selected", !0)
                        }, self.hasOption = function (value) {
                            return optionsMap.hasOwnProperty(value)
                        }, $scope.$on("$destroy", function () {
                            self.renderUnknownOption = noop
                        })
                    }], link: function (scope, element, attr, ctrls) {
                    function setupAsSingle(scope, selectElement, ngModelCtrl, selectCtrl) {
                        ngModelCtrl.$render = function () {
                            var viewValue = ngModelCtrl.$viewValue;
                            selectCtrl.hasOption(viewValue) ? (unknownOption.parent() && unknownOption.remove(), selectElement.val(viewValue), "" === viewValue && emptyOption.prop("selected", !0)) : isUndefined(viewValue) && emptyOption ? selectElement.val("") : selectCtrl.renderUnknownOption(viewValue)
                        }, selectElement.on("change", function () {
                            scope.$apply(function () {
                                unknownOption.parent() && unknownOption.remove(), ngModelCtrl.$setViewValue(selectElement.val())
                            })
                        })
                    }
                    function setupAsMultiple(scope, selectElement, ctrl) {
                        var lastView;
                        ctrl.$render = function () {
                            var items = new HashMap(ctrl.$viewValue);
                            forEach(selectElement.find("option"), function (option) {
                                option.selected = isDefined(items.get(option.value))
                            })
                        }, scope.$watch(function () {
                            equals(lastView, ctrl.$viewValue) || (lastView = shallowCopy(ctrl.$viewValue), ctrl.$render())
                        }), selectElement.on("change", function () {
                            scope.$apply(function () {
                                var array = [];
                                forEach(selectElement.find("option"), function (option) {
                                    option.selected && array.push(option.value)
                                }), ctrl.$setViewValue(array)
                            })
                        })
                    }
                    function setupAsOptions(scope, selectElement, ctrl) {
                        function callExpression(exprFn, key, value) {
                            return locals[valueName] = value, keyName && (locals[keyName] = key), exprFn(scope, locals)
                        }
                        function selectionChanged() {
                            scope.$apply(function () {
                                var viewValue, collection = valuesFn(scope) || [];
                                if (multiple)
                                    viewValue = [], forEach(selectElement.val(), function (selectedKey) {
                                        selectedKey = trackFn ? trackKeysCache[selectedKey] : selectedKey, viewValue.push(getViewValue(selectedKey, collection[selectedKey]))
                                    });
                                else {
                                    var selectedKey = trackFn ? trackKeysCache[selectElement.val()] : selectElement.val();
                                    viewValue = getViewValue(selectedKey, collection[selectedKey])
                                }
                                ctrl.$setViewValue(viewValue), render()
                            })
                        }
                        function getViewValue(key, value) {
                            if ("?" === key)
                                return undefined;
                            if ("" === key)
                                return null;
                            var viewValueFn = selectAsFn ? selectAsFn : valueFn;
                            return callExpression(viewValueFn, key, value)
                        }
                        function getLabels() {
                            var toDisplay, values = valuesFn(scope);
                            if (values && isArray(values)) {
                                toDisplay = new Array(values.length);
                                for (var i = 0, ii = values.length; ii > i; i++)
                                    toDisplay[i] = callExpression(displayFn, i, values[i]);
                                return toDisplay
                            }
                            if (values) {
                                toDisplay = {};
                                for (var prop in values)
                                    values.hasOwnProperty(prop) && (toDisplay[prop] = callExpression(displayFn, prop, values[prop]))
                            }
                            return toDisplay
                        }
                        function createIsSelectedFn(viewValue) {
                            var selectedSet;
                            if (multiple)
                                if (trackFn && isArray(viewValue)) {
                                    selectedSet = new HashMap([]);
                                    for (var trackIndex = 0; trackIndex < viewValue.length; trackIndex++)
                                        selectedSet.put(callExpression(trackFn, null, viewValue[trackIndex]), !0)
                                } else
                                    selectedSet = new HashMap(viewValue);
                            else
                                trackFn && (viewValue = callExpression(trackFn, null, viewValue));
                            return function (key, value) {
                                var compareValueFn;
                                return compareValueFn = trackFn ? trackFn : selectAsFn ? selectAsFn : valueFn, multiple ? isDefined(selectedSet.remove(callExpression(compareValueFn, key, value))) : viewValue === callExpression(compareValueFn, key, value)
                            }
                        }
                        function scheduleRendering() {
                            renderScheduled || (scope.$$postDigest(render), renderScheduled = !0)
                        }
                        function updateLabelMap(labelMap, label, added) {
                            labelMap[label] = labelMap[label] || 0, labelMap[label] += added ? 1 : -1
                        }
                        function render() {
                            renderScheduled = !1;
                            var optionGroupName, optionGroup, option, existingParent, existingOptions, existingOption, key, value, groupLength, length, groupIndex, index, selected, lastElement, element, label, optionId, optionGroups = {"": []}, optionGroupNames = [""], viewValue = ctrl.$viewValue, values = valuesFn(scope) || [], keys = keyName ? sortedKeys(values) : values, labelMap = {}, isSelected = createIsSelectedFn(viewValue), anySelected = !1;
                            for (trackKeysCache = {}, index = 0; length = keys.length, length > index; index++)
                                key = index, keyName && (key = keys[index], "$" === key.charAt(0)) || (value = values[key], optionGroupName = callExpression(groupByFn, key, value) || "", (optionGroup = optionGroups[optionGroupName]) || (optionGroup = optionGroups[optionGroupName] = [], optionGroupNames.push(optionGroupName)), selected = isSelected(key, value), anySelected = anySelected || selected, label = callExpression(displayFn, key, value), label = isDefined(label) ? label : "", optionId = trackFn ? trackFn(scope, locals) : keyName ? keys[index] : index, trackFn && (trackKeysCache[optionId] = key), optionGroup.push({id: optionId, label: label, selected: selected}));
                            for (multiple || (nullOption || null === viewValue ? optionGroups[""].unshift({id: "", label: "", selected: !anySelected}) : anySelected || optionGroups[""].unshift({id: "?", label: "", selected: !0})), groupIndex = 0, groupLength = optionGroupNames.length; groupLength > groupIndex; groupIndex++) {
                                for (optionGroupName = optionGroupNames[groupIndex], optionGroup = optionGroups[optionGroupName], optionGroupsCache.length <= groupIndex?(existingParent = {element:optGroupTemplate.clone().attr("label", optionGroupName), label:optionGroup.label}, existingOptions = [existingParent], optionGroupsCache.push(existingOptions), selectElement.append(existingParent.element)):(existingOptions = optionGroupsCache[groupIndex], existingParent = existingOptions[0], existingParent.label != optionGroupName && existingParent.element.attr("label", existingParent.label = optionGroupName)), lastElement = null, index = 0, length = optionGroup.length; length > index; index++)
                                    option = optionGroup[index], (existingOption = existingOptions[index + 1]) ? (lastElement = existingOption.element, existingOption.label !== option.label && (updateLabelMap(labelMap, existingOption.label, !1), updateLabelMap(labelMap, option.label, !0), lastElement.text(existingOption.label = option.label), lastElement.prop("label", existingOption.label)), existingOption.id !== option.id && lastElement.val(existingOption.id = option.id), lastElement[0].selected !== option.selected && (lastElement.prop("selected", existingOption.selected = option.selected), msie && lastElement.prop("selected", existingOption.selected))) : ("" === option.id && nullOption ? element = nullOption : (element = optionTemplate.clone()).val(option.id).prop("selected", option.selected).attr("selected", option.selected).prop("label", option.label).text(option.label), existingOptions.push(existingOption = {element: element, label: option.label, id: option.id, selected: option.selected}), updateLabelMap(labelMap, option.label, !0), lastElement ? lastElement.after(element) : existingParent.element.append(element), lastElement = element);
                                for (index++; existingOptions.length > index; )
                                    option = existingOptions.pop(), updateLabelMap(labelMap, option.label, !1), option.element.remove()
                            }
                            for (; optionGroupsCache.length > groupIndex; ) {
                                for (optionGroup = optionGroupsCache.pop(), index = 1; index < optionGroup.length; ++index)
                                    updateLabelMap(labelMap, optionGroup[index].label, !1);
                                optionGroup[0].element.remove()
                            }
                            forEach(labelMap, function (count, label) {
                                count > 0 ? selectCtrl.addOption(label) : 0 > count && selectCtrl.removeOption(label)
                            })
                        }
                        var match;
                        if (!(match = optionsExp.match(NG_OPTIONS_REGEXP)))
                            throw ngOptionsMinErr("iexp", "Expected expression in form of '_select_ (as _label_)? for (_key_,)?_value_ in _collection_' but got '{0}'. Element: {1}", optionsExp, startingTag(selectElement));
                        var displayFn = $parse(match[2] || match[1]), valueName = match[4] || match[6], selectAs = / as /.test(match[0]) && match[1], selectAsFn = selectAs ? $parse(selectAs) : null, keyName = match[5], groupByFn = $parse(match[3] || ""), valueFn = $parse(match[2] ? match[1] : valueName), valuesFn = $parse(match[7]), track = match[8], trackFn = track ? $parse(match[8]) : null, trackKeysCache = {}, optionGroupsCache = [[{element: selectElement, label: ""}]], locals = {};
                        nullOption && ($compile(nullOption)(scope), nullOption.removeClass("ng-scope"), nullOption.remove()), selectElement.empty(), selectElement.on("change", selectionChanged), ctrl.$render = render, scope.$watchCollection(valuesFn, scheduleRendering), scope.$watchCollection(getLabels, scheduleRendering), multiple && scope.$watchCollection(function () {
                            return ctrl.$modelValue
                        }, scheduleRendering)
                    }
                    if (ctrls[1]) {
                        for (var emptyOption, selectCtrl = ctrls[0], ngModelCtrl = ctrls[1], multiple = attr.multiple, optionsExp = attr.ngOptions, nullOption = !1, renderScheduled = !1, optionTemplate = jqLite(document.createElement("option")), optGroupTemplate = jqLite(document.createElement("optgroup")), unknownOption = optionTemplate.clone(), i = 0, children = element.children(), ii = children.length; ii > i; i++)
                            if ("" === children[i].value) {
                                emptyOption = nullOption = children.eq(i);
                                break
                            }
                        selectCtrl.init(ngModelCtrl, nullOption, unknownOption), multiple && (ngModelCtrl.$isEmpty = function (value) {
                            return!value || 0 === value.length
                        }), optionsExp ? setupAsOptions(scope, element, ngModelCtrl) : multiple ? setupAsMultiple(scope, element, ngModelCtrl) : setupAsSingle(scope, element, ngModelCtrl, selectCtrl)
                    }
                }}
        }], optionDirective = ["$interpolate", function ($interpolate) {
            var nullSelectCtrl = {addOption: noop, removeOption: noop};
            return{restrict: "E", priority: 100, compile: function (element, attr) {
                    if (isUndefined(attr.value)) {
                        var interpolateFn = $interpolate(element.text(), !0);
                        interpolateFn || attr.$set("value", element.text())
                    }
                    return function (scope, element, attr) {
                        var selectCtrlName = "$selectController", parent = element.parent(), selectCtrl = parent.data(selectCtrlName) || parent.parent().data(selectCtrlName);
                        selectCtrl && selectCtrl.databound || (selectCtrl = nullSelectCtrl), interpolateFn ? scope.$watch(interpolateFn, function (newVal, oldVal) {
                            attr.$set("value", newVal), oldVal !== newVal && selectCtrl.removeOption(oldVal), selectCtrl.addOption(newVal, element)
                        }) : selectCtrl.addOption(attr.value, element), element.on("$destroy", function () {
                            selectCtrl.removeOption(attr.value)
                        })
                    }
                }}
        }], styleDirective = valueFn({restrict: "E", terminal: !1});
    return window.angular.bootstrap ? void console.log("WARNING: Tried to load angular more than once.") : (bindJQuery(), publishExternalAPI(angular), void jqLite(document).ready(function () {
        angularInit(document, bootstrap)
    }))
}(window, document), !window.angular.$$csp() && window.angular.element(document).find("head").prepend('<style type="text/css">@charset "UTF-8";[ng\\:cloak],[ng-cloak],[data-ng-cloak],[x-ng-cloak],.ng-cloak,.x-ng-cloak,.ng-hide:not(.ng-hide-animate){display:none !important;}ng\\:form{display:block;}</style>');
!function (window, angular, undefined) {
    "use strict";
    angular.module("ngAnimate", ["ng"]).directive("ngAnimateChildren", function () {
        var NG_ANIMATE_CHILDREN = "$$ngAnimateChildren";
        return function (scope, element, attrs) {
            var val = attrs.ngAnimateChildren;
            angular.isString(val) && 0 === val.length ? element.data(NG_ANIMATE_CHILDREN, !0) : scope.$watch(val, function (value) {
                element.data(NG_ANIMATE_CHILDREN, !!value)
            })
        }
    }).factory("$$animateReflow", ["$$rAF", "$document", function ($$rAF, $document) {
            var bod = $document[0].body;
            return function (fn) {
                return $$rAF(function () {
                    bod.offsetWidth + 1;
                    fn()
                })
            }
        }]).config(["$provide", "$animateProvider", function ($provide, $animateProvider) {
            function extractElementNode(element) {
                for (var i = 0; i < element.length; i++) {
                    var elm = element[i];
                    if (elm.nodeType == ELEMENT_NODE)
                        return elm
                }
            }
            function prepareElement(element) {
                return element && angular.element(element)
            }
            function stripCommentsFromElement(element) {
                return angular.element(extractElementNode(element))
            }
            function isMatchingElement(elm1, elm2) {
                return extractElementNode(elm1) == extractElementNode(elm2)
            }
            var noop = angular.noop, forEach = angular.forEach, selectors = $animateProvider.$$selectors, isArray = angular.isArray, isString = angular.isString, isObject = angular.isObject, ELEMENT_NODE = 1, NG_ANIMATE_STATE = "$$ngAnimateState", NG_ANIMATE_CHILDREN = "$$ngAnimateChildren", NG_ANIMATE_CLASS_NAME = "ng-animate", rootAnimateState = {running: !0};
            $provide.decorator("$animate", ["$delegate", "$$q", "$injector", "$sniffer", "$rootElement", "$$asyncCallback", "$rootScope", "$document", "$templateRequest", function ($delegate, $$q, $injector, $sniffer, $rootElement, $$asyncCallback, $rootScope, $document, $templateRequest) {
                    function classBasedAnimationsBlocked(element, setter) {
                        var data = element.data(NG_ANIMATE_STATE) || {};
                        return setter && (data.running = !0, data.structural = !0, element.data(NG_ANIMATE_STATE, data)), data.disabled || data.running && data.structural
                    }
                    function runAnimationPostDigest(fn) {
                        var cancelFn, defer = $$q.defer();
                        return defer.promise.$$cancelFn = function () {
                            cancelFn && cancelFn()
                        }, $rootScope.$$postDigest(function () {
                            cancelFn = fn(function () {
                                defer.resolve()
                            })
                        }), defer.promise
                    }
                    function parseAnimateOptions(options) {
                        return isObject(options) ? (options.tempClasses && isString(options.tempClasses) && (options.tempClasses = options.tempClasses.split(/\s+/)), options) : void 0
                    }
                    function resolveElementClasses(element, cache, runningAnimations) {
                        runningAnimations = runningAnimations || {};
                        var lookup = {};
                        forEach(runningAnimations, function (data, selector) {
                            forEach(selector.split(" "), function (s) {
                                lookup[s] = data
                            })
                        });
                        var hasClasses = Object.create(null);
                        forEach((element.attr("class") || "").split(/\s+/), function (className) {
                            hasClasses[className] = !0
                        });
                        var toAdd = [], toRemove = [];
                        return forEach(cache && cache.classes || [], function (status, className) {
                            var hasClass = hasClasses[className], matchingAnimation = lookup[className] || {};
                            status === !1 ? (hasClass || "addClass" == matchingAnimation.event) && toRemove.push(className) : status === !0 && (hasClass && "removeClass" != matchingAnimation.event || toAdd.push(className))
                        }), toAdd.length + toRemove.length > 0 && [toAdd.join(" "), toRemove.join(" ")]
                    }
                    function lookup(name) {
                        if (name) {
                            var matches = [], flagMap = {}, classes = name.substr(1).split(".");
                            ($sniffer.transitions || $sniffer.animations) && matches.push($injector.get(selectors[""]));
                            for (var i = 0; i < classes.length; i++) {
                                var klass = classes[i], selectorFactoryName = selectors[klass];
                                selectorFactoryName && !flagMap[klass] && (matches.push($injector.get(selectorFactoryName)), flagMap[klass] = !0)
                            }
                            return matches
                        }
                    }
                    function animationRunner(element, animationEvent, className, options) {
                        function registerAnimation(animationFactory, event) {
                            var afterFn = animationFactory[event], beforeFn = animationFactory["before" + event.charAt(0).toUpperCase() + event.substr(1)];
                            return afterFn || beforeFn ? ("leave" == event && (beforeFn = afterFn, afterFn = null), after.push({event: event, fn: afterFn}), before.push({event: event, fn: beforeFn}), !0) : void 0
                        }
                        function run(fns, cancellations, allCompleteFn) {
                            function afterAnimationComplete(index) {
                                if (cancellations) {
                                    if ((cancellations[index] || noop)(), ++count < animations.length)
                                        return;
                                    cancellations = null
                                }
                                allCompleteFn()
                            }
                            var animations = [];
                            forEach(fns, function (animation) {
                                animation.fn && animations.push(animation)
                            });
                            var count = 0;
                            forEach(animations, function (animation, index) {
                                var progress = function () {
                                    afterAnimationComplete(index)
                                };
                                switch (animation.event) {
                                    case"setClass":
                                        cancellations.push(animation.fn(element, classNameAdd, classNameRemove, progress, options));
                                        break;
                                    case"animate":
                                        cancellations.push(animation.fn(element, className, options.from, options.to, progress));
                                        break;
                                    case"addClass":
                                        cancellations.push(animation.fn(element, classNameAdd || className, progress, options));
                                        break;
                                    case"removeClass":
                                        cancellations.push(animation.fn(element, classNameRemove || className, progress, options));
                                        break;
                                    default:
                                        cancellations.push(animation.fn(element, progress, options))
                                    }
                            }), cancellations && 0 === cancellations.length && allCompleteFn()
                        }
                        var node = element[0];
                        if (node) {
                            options && (options.to = options.to || {}, options.from = options.from || {});
                            var classNameAdd, classNameRemove;
                            isArray(className) && (classNameAdd = className[0], classNameRemove = className[1], classNameAdd ? classNameRemove ? className = classNameAdd + " " + classNameRemove : (className = classNameAdd, animationEvent = "addClass") : (className = classNameRemove, animationEvent = "removeClass"));
                            var isSetClassOperation = "setClass" == animationEvent, isClassBased = isSetClassOperation || "addClass" == animationEvent || "removeClass" == animationEvent || "animate" == animationEvent, currentClassName = element.attr("class"), classes = currentClassName + " " + className;
                            if (isAnimatableClassName(classes)) {
                                var beforeComplete = noop, beforeCancel = [], before = [], afterComplete = noop, afterCancel = [], after = [], animationLookup = (" " + classes).replace(/\s+/g, ".");
                                return forEach(lookup(animationLookup), function (animationFactory) {
                                    var created = registerAnimation(animationFactory, animationEvent);
                                    !created && isSetClassOperation && (registerAnimation(animationFactory, "addClass"), registerAnimation(animationFactory, "removeClass"))
                                }), {node: node, event: animationEvent, className: className, isClassBased: isClassBased, isSetClassOperation: isSetClassOperation, applyStyles: function () {
                                        options && element.css(angular.extend(options.from || {}, options.to || {}))
                                    }, before: function (allCompleteFn) {
                                        beforeComplete = allCompleteFn, run(before, beforeCancel, function () {
                                            beforeComplete = noop, allCompleteFn()
                                        })
                                    }, after: function (allCompleteFn) {
                                        afterComplete = allCompleteFn, run(after, afterCancel, function () {
                                            afterComplete = noop, allCompleteFn()
                                        })
                                    }, cancel: function () {
                                        beforeCancel && (forEach(beforeCancel, function (cancelFn) {
                                            (cancelFn || noop)(!0)
                                        }), beforeComplete(!0)), afterCancel && (forEach(afterCancel, function (cancelFn) {
                                            (cancelFn || noop)(!0)
                                        }), afterComplete(!0))
                                    }}
                            }
                        }
                    }
                    function performAnimation(animationEvent, className, element, parentElement, afterElement, domOperation, options, doneCallback) {
                        function fireDOMCallback(animationPhase) {
                            var eventName = "$animate:" + animationPhase;
                            elementEvents && elementEvents[eventName] && elementEvents[eventName].length > 0 && $$asyncCallback(function () {
                                element.triggerHandler(eventName, {event: animationEvent, className: className})
                            })
                        }
                        function fireBeforeCallbackAsync() {
                            fireDOMCallback("before")
                        }
                        function fireAfterCallbackAsync() {
                            fireDOMCallback("after")
                        }
                        function fireDoneCallbackAsync() {
                            fireDOMCallback("close"), doneCallback()
                        }
                        function fireDOMOperation() {
                            fireDOMOperation.hasBeenRun || (fireDOMOperation.hasBeenRun = !0, domOperation())
                        }
                        function closeAnimation() {
                            if (!closeAnimation.hasBeenRun) {
                                runner && runner.applyStyles(), closeAnimation.hasBeenRun = !0, options && options.tempClasses && forEach(options.tempClasses, function (className) {
                                    element.removeClass(className)
                                });
                                var data = element.data(NG_ANIMATE_STATE);
                                data && (runner && runner.isClassBased ? cleanup(element, className) : ($$asyncCallback(function () {
                                    var data = element.data(NG_ANIMATE_STATE) || {};
                                    localAnimationCount == data.index && cleanup(element, className, animationEvent)
                                }), element.data(NG_ANIMATE_STATE, data))), fireDoneCallbackAsync()
                            }
                        }
                        var noopCancel = noop, runner = animationRunner(element, animationEvent, className, options);
                        if (!runner)
                            return fireDOMOperation(), fireBeforeCallbackAsync(), fireAfterCallbackAsync(), closeAnimation(), noopCancel;
                        animationEvent = runner.event, className = runner.className;
                        var elementEvents = angular.element._data(runner.node);
                        if (elementEvents = elementEvents && elementEvents.events, parentElement || (parentElement = afterElement ? afterElement.parent() : element.parent()), animationsDisabled(element, parentElement))
                            return fireDOMOperation(), fireBeforeCallbackAsync(), fireAfterCallbackAsync(), closeAnimation(), noopCancel;
                        var ngAnimateState = element.data(NG_ANIMATE_STATE) || {}, runningAnimations = ngAnimateState.active || {}, totalActiveAnimations = ngAnimateState.totalActive || 0, lastAnimation = ngAnimateState.last, skipAnimation = !1;
                        if (totalActiveAnimations > 0) {
                            var animationsToCancel = [];
                            if (runner.isClassBased) {
                                if ("setClass" == lastAnimation.event)
                                    animationsToCancel.push(lastAnimation), cleanup(element, className);
                                else if (runningAnimations[className]) {
                                    var current = runningAnimations[className];
                                    current.event == animationEvent ? skipAnimation = !0 : (animationsToCancel.push(current), cleanup(element, className))
                                }
                            } else if ("leave" == animationEvent && runningAnimations["ng-leave"])
                                skipAnimation = !0;
                            else {
                                for (var klass in runningAnimations)
                                    animationsToCancel.push(runningAnimations[klass]);
                                ngAnimateState = {}, cleanup(element, !0)
                            }
                            animationsToCancel.length > 0 && forEach(animationsToCancel, function (operation) {
                                operation.cancel()
                            })
                        }
                        if (!runner.isClassBased || runner.isSetClassOperation || "animate" == animationEvent || skipAnimation || (skipAnimation = "addClass" == animationEvent == element.hasClass(className)), skipAnimation)
                            return fireDOMOperation(), fireBeforeCallbackAsync(), fireAfterCallbackAsync(), fireDoneCallbackAsync(), noopCancel;
                        runningAnimations = ngAnimateState.active || {}, totalActiveAnimations = ngAnimateState.totalActive || 0, "leave" == animationEvent && element.one("$destroy", function () {
                            var element = angular.element(this), state = element.data(NG_ANIMATE_STATE);
                            if (state) {
                                var activeLeaveAnimation = state.active["ng-leave"];
                                activeLeaveAnimation && (activeLeaveAnimation.cancel(), cleanup(element, "ng-leave"))
                            }
                        }), element.addClass(NG_ANIMATE_CLASS_NAME), options && options.tempClasses && forEach(options.tempClasses, function (className) {
                            element.addClass(className)
                        });
                        var localAnimationCount = globalAnimationCounter++;
                        return totalActiveAnimations++, runningAnimations[className] = runner, element.data(NG_ANIMATE_STATE, {last: runner, active: runningAnimations, index: localAnimationCount, totalActive: totalActiveAnimations}), fireBeforeCallbackAsync(), runner.before(function (cancelled) {
                            var data = element.data(NG_ANIMATE_STATE);
                            cancelled = cancelled || !data || !data.active[className] || runner.isClassBased && data.active[className].event != animationEvent, fireDOMOperation(), cancelled === !0 ? closeAnimation() : (fireAfterCallbackAsync(), runner.after(closeAnimation))
                        }), runner.cancel
                    }
                    function cancelChildAnimations(element) {
                        var node = extractElementNode(element);
                        if (node) {
                            var nodes = angular.isFunction(node.getElementsByClassName) ? node.getElementsByClassName(NG_ANIMATE_CLASS_NAME) : node.querySelectorAll("." + NG_ANIMATE_CLASS_NAME);
                            forEach(nodes, function (element) {
                                element = angular.element(element);
                                var data = element.data(NG_ANIMATE_STATE);
                                data && data.active && forEach(data.active, function (runner) {
                                    runner.cancel()
                                })
                            })
                        }
                    }
                    function cleanup(element, className) {
                        if (isMatchingElement(element, $rootElement))
                            rootAnimateState.disabled || (rootAnimateState.running = !1, rootAnimateState.structural = !1);
                        else if (className) {
                            var data = element.data(NG_ANIMATE_STATE) || {}, removeAnimations = className === !0;
                            !removeAnimations && data.active && data.active[className] && (data.totalActive--, delete data.active[className]), (removeAnimations || !data.totalActive) && (element.removeClass(NG_ANIMATE_CLASS_NAME), element.removeData(NG_ANIMATE_STATE))
                        }
                    }
                    function animationsDisabled(element, parentElement) {
                        if (rootAnimateState.disabled)
                            return!0;
                        if (isMatchingElement(element, $rootElement))
                            return rootAnimateState.running;
                        var allowChildAnimations, parentRunningAnimation, hasParent;
                        do {
                            if (0 === parentElement.length)
                                break;
                            var isRoot = isMatchingElement(parentElement, $rootElement), state = isRoot ? rootAnimateState : parentElement.data(NG_ANIMATE_STATE) || {};
                            if (state.disabled)
                                return!0;
                            if (isRoot && (hasParent = !0), allowChildAnimations !== !1) {
                                var animateChildrenFlag = parentElement.data(NG_ANIMATE_CHILDREN);
                                angular.isDefined(animateChildrenFlag) && (allowChildAnimations = animateChildrenFlag)
                            }
                            parentRunningAnimation = parentRunningAnimation || state.running || state.last && !state.last.isClassBased
                        } while (parentElement = parentElement.parent());
                        return!hasParent || !allowChildAnimations && parentRunningAnimation
                    }
                    $rootElement.data(NG_ANIMATE_STATE, rootAnimateState);
                    var deregisterWatch = $rootScope.$watch(function () {
                        return $templateRequest.totalPendingRequests
                    }, function (val) {
                        0 === val && (deregisterWatch(), $rootScope.$$postDigest(function () {
                            $rootScope.$$postDigest(function () {
                                rootAnimateState.running = !1
                            })
                        }))
                    }), globalAnimationCounter = 0, classNameFilter = $animateProvider.classNameFilter(), isAnimatableClassName = classNameFilter ? function (className) {
                        return classNameFilter.test(className)
                    } : function () {
                        return!0
                    };
                    return{animate: function (element, from, to, className, options) {
                            return className = className || "ng-inline-animate", options = parseAnimateOptions(options) || {}, options.from = to ? from : null, options.to = to ? to : from, runAnimationPostDigest(function (done) {
                                return performAnimation("animate", className, stripCommentsFromElement(element), null, null, noop, options, done)
                            })
                        }, enter: function (element, parentElement, afterElement, options) {
                            return options = parseAnimateOptions(options), element = angular.element(element), parentElement = prepareElement(parentElement), afterElement = prepareElement(afterElement), classBasedAnimationsBlocked(element, !0), $delegate.enter(element, parentElement, afterElement), runAnimationPostDigest(function (done) {
                                return performAnimation("enter", "ng-enter", stripCommentsFromElement(element), parentElement, afterElement, noop, options, done)
                            })
                        }, leave: function (element, options) {
                            return options = parseAnimateOptions(options), element = angular.element(element), cancelChildAnimations(element), classBasedAnimationsBlocked(element, !0), runAnimationPostDigest(function (done) {
                                return performAnimation("leave", "ng-leave", stripCommentsFromElement(element), null, null, function () {
                                    $delegate.leave(element)
                                }, options, done)
                            })
                        }, move: function (element, parentElement, afterElement, options) {
                            return options = parseAnimateOptions(options), element = angular.element(element), parentElement = prepareElement(parentElement), afterElement = prepareElement(afterElement), cancelChildAnimations(element), classBasedAnimationsBlocked(element, !0), $delegate.move(element, parentElement, afterElement), runAnimationPostDigest(function (done) {
                                return performAnimation("move", "ng-move", stripCommentsFromElement(element), parentElement, afterElement, noop, options, done)
                            })
                        }, addClass: function (element, className, options) {
                            return this.setClass(element, className, [], options)
                        }, removeClass: function (element, className, options) {
                            return this.setClass(element, [], className, options)
                        }, setClass: function (element, add, remove, options) {
                            options = parseAnimateOptions(options);
                            var STORAGE_KEY = "$$animateClasses";
                            if (element = angular.element(element), element = stripCommentsFromElement(element), classBasedAnimationsBlocked(element))
                                return $delegate.$$setClassImmediately(element, add, remove, options);
                            var classes, cache = element.data(STORAGE_KEY), hasCache = !!cache;
                            return cache || (cache = {}, cache.classes = {}), classes = cache.classes, add = isArray(add) ? add : add.split(" "), forEach(add, function (c) {
                                c && c.length && (classes[c] = !0)
                            }), remove = isArray(remove) ? remove : remove.split(" "), forEach(remove, function (c) {
                                c && c.length && (classes[c] = !1)
                            }), hasCache ? (options && cache.options && (cache.options = angular.extend(cache.options || {}, options)), cache.promise) : (element.data(STORAGE_KEY, cache = {classes: classes, options: options}), cache.promise = runAnimationPostDigest(function (done) {
                                var parentElement = element.parent(), elementNode = extractElementNode(element), parentNode = elementNode.parentNode;
                                if (!parentNode || parentNode.$$NG_REMOVED || elementNode.$$NG_REMOVED)
                                    return void done();
                                var cache = element.data(STORAGE_KEY);
                                element.removeData(STORAGE_KEY);
                                var state = element.data(NG_ANIMATE_STATE) || {}, classes = resolveElementClasses(element, cache, state.active);
                                return classes ? performAnimation("setClass", classes, element, parentElement, null, function () {
                                    classes[0] && $delegate.$$addClassImmediately(element, classes[0]), classes[1] && $delegate.$$removeClassImmediately(element, classes[1])
                                }, cache.options, done) : done()
                            }))
                        }, cancel: function (promise) {
                            promise.$$cancelFn()
                        }, enabled: function (value, element) {
                            switch (arguments.length) {
                                case 2:
                                    if (value)
                                        cleanup(element);
                                    else {
                                        var data = element.data(NG_ANIMATE_STATE) || {};
                                        data.disabled = !0, element.data(NG_ANIMATE_STATE, data)
                                    }
                                    break;
                                case 1:
                                    rootAnimateState.disabled = !value;
                                    break;
                                default:
                                    value = !rootAnimateState.disabled
                            }
                            return!!value
                        }}
                }]), $animateProvider.register("", ["$window", "$sniffer", "$timeout", "$$animateReflow", function ($window, $sniffer, $timeout, $$animateReflow) {
                    function clearCacheAfterReflow() {
                        cancelAnimationReflow || (cancelAnimationReflow = $$animateReflow(function () {
                            animationReflowQueue = [], cancelAnimationReflow = null, lookupCache = {}
                        }))
                    }
                    function afterReflow(element, callback) {
                        cancelAnimationReflow && cancelAnimationReflow(), animationReflowQueue.push(callback), cancelAnimationReflow = $$animateReflow(function () {
                            forEach(animationReflowQueue, function (fn) {
                                fn()
                            }), animationReflowQueue = [], cancelAnimationReflow = null, lookupCache = {}
                        })
                    }
                    function animationCloseHandler(element, totalTime) {
                        var node = extractElementNode(element);
                        element = angular.element(node), animationElementQueue.push(element);
                        var futureTimestamp = Date.now() + totalTime;
                        closingTimestamp >= futureTimestamp || ($timeout.cancel(closingTimer), closingTimestamp = futureTimestamp, closingTimer = $timeout(function () {
                            closeAllAnimations(animationElementQueue), animationElementQueue = []
                        }, totalTime, !1))
                    }
                    function closeAllAnimations(elements) {
                        forEach(elements, function (element) {
                            var elementData = element.data(NG_ANIMATE_CSS_DATA_KEY);
                            elementData && forEach(elementData.closeAnimationFns, function (fn) {
                                fn()
                            })
                        })
                    }
                    function getElementAnimationDetails(element, cacheKey) {
                        var data = cacheKey ? lookupCache[cacheKey] : null;
                        if (!data) {
                            var transitionDuration = 0, transitionDelay = 0, animationDuration = 0, animationDelay = 0;
                            forEach(element, function (element) {
                                if (element.nodeType == ELEMENT_NODE) {
                                    var elementStyles = $window.getComputedStyle(element) || {}, transitionDurationStyle = elementStyles[TRANSITION_PROP + DURATION_KEY];
                                    transitionDuration = Math.max(parseMaxTime(transitionDurationStyle), transitionDuration);
                                    var transitionDelayStyle = elementStyles[TRANSITION_PROP + DELAY_KEY];
                                    transitionDelay = Math.max(parseMaxTime(transitionDelayStyle), transitionDelay);
                                    {
                                        elementStyles[ANIMATION_PROP + DELAY_KEY]
                                    }
                                    animationDelay = Math.max(parseMaxTime(elementStyles[ANIMATION_PROP + DELAY_KEY]), animationDelay);
                                    var aDuration = parseMaxTime(elementStyles[ANIMATION_PROP + DURATION_KEY]);
                                    aDuration > 0 && (aDuration *= parseInt(elementStyles[ANIMATION_PROP + ANIMATION_ITERATION_COUNT_KEY], 10) || 1), animationDuration = Math.max(aDuration, animationDuration)
                                }
                            }), data = {total: 0, transitionDelay: transitionDelay, transitionDuration: transitionDuration, animationDelay: animationDelay, animationDuration: animationDuration}, cacheKey && (lookupCache[cacheKey] = data)
                        }
                        return data
                    }
                    function parseMaxTime(str) {
                        var maxValue = 0, values = isString(str) ? str.split(/\s*,\s*/) : [];
                        return forEach(values, function (value) {
                            maxValue = Math.max(parseFloat(value) || 0, maxValue)
                        }), maxValue
                    }
                    function getCacheKey(element) {
                        var parentElement = element.parent(), parentID = parentElement.data(NG_ANIMATE_PARENT_KEY);
                        return parentID || (parentElement.data(NG_ANIMATE_PARENT_KEY, ++parentCounter), parentID = parentCounter), parentID + "-" + extractElementNode(element).getAttribute("class")
                    }
                    function animateSetup(animationEvent, element, className, styles) {
                        var structural = ["ng-enter", "ng-leave", "ng-move"].indexOf(className) >= 0, cacheKey = getCacheKey(element), eventCacheKey = cacheKey + " " + className, itemIndex = lookupCache[eventCacheKey] ? ++lookupCache[eventCacheKey].total : 0, stagger = {};
                        if (itemIndex > 0) {
                            var staggerClassName = className + "-stagger", staggerCacheKey = cacheKey + " " + staggerClassName, applyClasses = !lookupCache[staggerCacheKey];
                            applyClasses && element.addClass(staggerClassName), stagger = getElementAnimationDetails(element, staggerCacheKey), applyClasses && element.removeClass(staggerClassName)
                        }
                        element.addClass(className);
                        var formerData = element.data(NG_ANIMATE_CSS_DATA_KEY) || {}, timings = getElementAnimationDetails(element, eventCacheKey), transitionDuration = timings.transitionDuration, animationDuration = timings.animationDuration;
                        if (structural && 0 === transitionDuration && 0 === animationDuration)
                            return element.removeClass(className), !1;
                        var blockTransition = styles || structural && transitionDuration > 0, blockAnimation = animationDuration > 0 && stagger.animationDelay > 0 && 0 === stagger.animationDuration, closeAnimationFns = formerData.closeAnimationFns || [];
                        element.data(NG_ANIMATE_CSS_DATA_KEY, {stagger: stagger, cacheKey: eventCacheKey, running: formerData.running || 0, itemIndex: itemIndex, blockTransition: blockTransition, closeAnimationFns: closeAnimationFns});
                        var node = extractElementNode(element);
                        return blockTransition && (blockTransitions(node, !0), styles && element.css(styles)), blockAnimation && blockAnimations(node, !0), !0
                    }
                    function animateRun(animationEvent, element, className, activeAnimationComplete, styles) {
                        function onEnd() {
                            element.off(css3AnimationEvents, onAnimationProgress), element.removeClass(activeClassName), element.removeClass(pendingClassName), staggerTimeout && $timeout.cancel(staggerTimeout), animateClose(element, className);
                            var node = extractElementNode(element);
                            for (var i in appliedStyles)
                                node.style.removeProperty(appliedStyles[i])
                        }
                        function onAnimationProgress(event) {
                            event.stopPropagation();
                            var ev = event.originalEvent || event, timeStamp = ev.$manualTimeStamp || ev.timeStamp || Date.now(), elapsedTime = parseFloat(ev.elapsedTime.toFixed(ELAPSED_TIME_MAX_DECIMAL_PLACES));
                            Math.max(timeStamp - startTime, 0) >= maxDelayTime && elapsedTime >= maxDuration && activeAnimationComplete()
                        }
                        var node = extractElementNode(element), elementData = element.data(NG_ANIMATE_CSS_DATA_KEY);
                        if (-1 == node.getAttribute("class").indexOf(className) || !elementData)
                            return void activeAnimationComplete();
                        var activeClassName = "", pendingClassName = "";
                        forEach(className.split(" "), function (klass, i) {
                            var prefix = (i > 0 ? " " : "") + klass;
                            activeClassName += prefix + "-active", pendingClassName += prefix + "-pending"
                        });
                        var style = "", appliedStyles = [], itemIndex = elementData.itemIndex, stagger = elementData.stagger, staggerTime = 0;
                        if (itemIndex > 0) {
                            var transitionStaggerDelay = 0;
                            stagger.transitionDelay > 0 && 0 === stagger.transitionDuration && (transitionStaggerDelay = stagger.transitionDelay * itemIndex);
                            var animationStaggerDelay = 0;
                            stagger.animationDelay > 0 && 0 === stagger.animationDuration && (animationStaggerDelay = stagger.animationDelay * itemIndex, appliedStyles.push(CSS_PREFIX + "animation-play-state")), staggerTime = Math.round(100 * Math.max(transitionStaggerDelay, animationStaggerDelay)) / 100
                        }
                        staggerTime || (element.addClass(activeClassName), elementData.blockTransition && blockTransitions(node, !1));
                        var eventCacheKey = elementData.cacheKey + " " + activeClassName, timings = getElementAnimationDetails(element, eventCacheKey), maxDuration = Math.max(timings.transitionDuration, timings.animationDuration);
                        if (0 === maxDuration)
                            return element.removeClass(activeClassName), animateClose(element, className), void activeAnimationComplete();
                        !staggerTime && styles && (timings.transitionDuration || (element.css("transition", timings.animationDuration + "s linear all"), appliedStyles.push("transition")), element.css(styles));
                        var maxDelay = Math.max(timings.transitionDelay, timings.animationDelay), maxDelayTime = maxDelay * ONE_SECOND;
                        if (appliedStyles.length > 0) {
                            var oldStyle = node.getAttribute("style") || "";
                            ";" !== oldStyle.charAt(oldStyle.length - 1) && (oldStyle += ";"), node.setAttribute("style", oldStyle + " " + style)
                        }
                        var staggerTimeout, startTime = Date.now(), css3AnimationEvents = ANIMATIONEND_EVENT + " " + TRANSITIONEND_EVENT, animationTime = (maxDelay + maxDuration) * CLOSING_TIME_BUFFER, totalTime = (staggerTime + animationTime) * ONE_SECOND;
                        return staggerTime > 0 && (element.addClass(pendingClassName), staggerTimeout = $timeout(function () {
                            staggerTimeout = null, timings.transitionDuration > 0 && blockTransitions(node, !1), timings.animationDuration > 0 && blockAnimations(node, !1), element.addClass(activeClassName), element.removeClass(pendingClassName), styles && (0 === timings.transitionDuration && element.css("transition", timings.animationDuration + "s linear all"), element.css(styles), appliedStyles.push("transition"))
                        }, staggerTime * ONE_SECOND, !1)), element.on(css3AnimationEvents, onAnimationProgress), elementData.closeAnimationFns.push(function () {
                            onEnd(), activeAnimationComplete()
                        }), elementData.running++, animationCloseHandler(element, totalTime), onEnd
                    }
                    function blockTransitions(node, bool) {
                        node.style[TRANSITION_PROP + PROPERTY_KEY] = bool ? "none" : ""
                    }
                    function blockAnimations(node, bool) {
                        node.style[ANIMATION_PROP + ANIMATION_PLAYSTATE_KEY] = bool ? "paused" : ""
                    }
                    function animateBefore(animationEvent, element, className, styles) {
                        return animateSetup(animationEvent, element, className, styles) ? function (cancelled) {
                            cancelled && animateClose(element, className)
                        } : void 0
                    }
                    function animateAfter(animationEvent, element, className, afterAnimationComplete, styles) {
                        return element.data(NG_ANIMATE_CSS_DATA_KEY) ? animateRun(animationEvent, element, className, afterAnimationComplete, styles) : (animateClose(element, className), void afterAnimationComplete())
                    }
                    function animate(animationEvent, element, className, animationComplete, options) {
                        var preReflowCancellation = animateBefore(animationEvent, element, className, options.from);
                        if (!preReflowCancellation)
                            return clearCacheAfterReflow(), void animationComplete();
                        var cancel = preReflowCancellation;
                        return afterReflow(element, function () {
                            cancel = animateAfter(animationEvent, element, className, animationComplete, options.to)
                        }), function (cancelled) {
                            (cancel || noop)(cancelled)
                        }
                    }
                    function animateClose(element, className) {
                        element.removeClass(className);
                        var data = element.data(NG_ANIMATE_CSS_DATA_KEY);
                        data && (data.running && data.running--, data.running && 0 !== data.running || element.removeData(NG_ANIMATE_CSS_DATA_KEY))
                    }
                    function suffixClasses(classes, suffix) {
                        var className = "";
                        return classes = isArray(classes) ? classes : classes.split(/\s+/), forEach(classes, function (klass, i) {
                            klass && klass.length > 0 && (className += (i > 0 ? " " : "") + klass + suffix)
                        }), className
                    }
                    var TRANSITION_PROP, TRANSITIONEND_EVENT, ANIMATION_PROP, ANIMATIONEND_EVENT, CSS_PREFIX = "";
                    window.ontransitionend === undefined && window.onwebkittransitionend !== undefined ? (CSS_PREFIX = "-webkit-", TRANSITION_PROP = "WebkitTransition", TRANSITIONEND_EVENT = "webkitTransitionEnd transitionend") : (TRANSITION_PROP = "transition", TRANSITIONEND_EVENT = "transitionend"), window.onanimationend === undefined && window.onwebkitanimationend !== undefined ? (CSS_PREFIX = "-webkit-", ANIMATION_PROP = "WebkitAnimation", ANIMATIONEND_EVENT = "webkitAnimationEnd animationend") : (ANIMATION_PROP = "animation", ANIMATIONEND_EVENT = "animationend");
                    var cancelAnimationReflow, DURATION_KEY = "Duration", PROPERTY_KEY = "Property", DELAY_KEY = "Delay", ANIMATION_ITERATION_COUNT_KEY = "IterationCount", ANIMATION_PLAYSTATE_KEY = "PlayState", NG_ANIMATE_PARENT_KEY = "$$ngAnimateKey", NG_ANIMATE_CSS_DATA_KEY = "$$ngAnimateCSS3Data", ELAPSED_TIME_MAX_DECIMAL_PLACES = 3, CLOSING_TIME_BUFFER = 1.5, ONE_SECOND = 1e3, lookupCache = {}, parentCounter = 0, animationReflowQueue = [], closingTimer = null, closingTimestamp = 0, animationElementQueue = [];
                    return{animate: function (element, className, from, to, animationCompleted, options) {
                            return options = options || {}, options.from = from, options.to = to, animate("animate", element, className, animationCompleted, options)
                        }, enter: function (element, animationCompleted, options) {
                            return options = options || {}, animate("enter", element, "ng-enter", animationCompleted, options)
                        }, leave: function (element, animationCompleted, options) {
                            return options = options || {}, animate("leave", element, "ng-leave", animationCompleted, options)
                        }, move: function (element, animationCompleted, options) {
                            return options = options || {}, animate("move", element, "ng-move", animationCompleted, options)
                        }, beforeSetClass: function (element, add, remove, animationCompleted, options) {
                            options = options || {};
                            var className = suffixClasses(remove, "-remove") + " " + suffixClasses(add, "-add"), cancellationMethod = animateBefore("setClass", element, className, options.from);
                            return cancellationMethod ? (afterReflow(element, animationCompleted), cancellationMethod) : (clearCacheAfterReflow(), void animationCompleted())
                        }, beforeAddClass: function (element, className, animationCompleted, options) {
                            options = options || {};
                            var cancellationMethod = animateBefore("addClass", element, suffixClasses(className, "-add"), options.from);
                            return cancellationMethod ? (afterReflow(element, animationCompleted), cancellationMethod) : (clearCacheAfterReflow(), void animationCompleted())
                        }, beforeRemoveClass: function (element, className, animationCompleted, options) {
                            options = options || {};
                            var cancellationMethod = animateBefore("removeClass", element, suffixClasses(className, "-remove"), options.from);
                            return cancellationMethod ? (afterReflow(element, animationCompleted), cancellationMethod) : (clearCacheAfterReflow(), void animationCompleted())
                        }, setClass: function (element, add, remove, animationCompleted, options) {
                            options = options || {}, remove = suffixClasses(remove, "-remove"), add = suffixClasses(add, "-add");
                            var className = remove + " " + add;
                            return animateAfter("setClass", element, className, animationCompleted, options.to)
                        }, addClass: function (element, className, animationCompleted, options) {
                            return options = options || {}, animateAfter("addClass", element, suffixClasses(className, "-add"), animationCompleted, options.to)
                        }, removeClass: function (element, className, animationCompleted, options) {
                            return options = options || {}, animateAfter("removeClass", element, suffixClasses(className, "-remove"), animationCompleted, options.to)
                        }}
                }])
        }])
}(window, window.angular);
"undefined" != typeof module && "undefined" != typeof exports && module.exports === exports && (module.exports = "ui.router"), function (window, angular, undefined) {
    "use strict";
    function inherit(parent, extra) {
        return extend(new (extend(function () {
        }, {prototype: parent})), extra)
    }
    function merge(dst) {
        return forEach(arguments, function (obj) {
            obj !== dst && forEach(obj, function (value, key) {
                dst.hasOwnProperty(key) || (dst[key] = value)
            })
        }), dst
    }
    function ancestors(first, second) {
        var path = [];
        for (var n in first.path) {
            if (first.path[n] !== second.path[n])
                break;
            path.push(first.path[n])
        }
        return path
    }
    function objectKeys(object) {
        if (Object.keys)
            return Object.keys(object);
        var result = [];
        return angular.forEach(object, function (val, key) {
            result.push(key)
        }), result
    }
    function indexOf(array, value) {
        if (Array.prototype.indexOf)
            return array.indexOf(value, Number(arguments[2]) || 0);
        var len = array.length >>> 0, from = Number(arguments[2]) || 0;
        for (from = 0 > from?Math.ceil(from):Math.floor(from), 0 > from && (from += len); len > from; from++)
            if (from in array && array[from] === value)
                return from;
        return-1
    }
    function inheritParams(currentParams, newParams, $current, $to) {
        var parentParams, parents = ancestors($current, $to), inherited = {}, inheritList = [];
        for (var i in parents)
            if (parents[i].params && (parentParams = objectKeys(parents[i].params), parentParams.length))
                for (var j in parentParams)
                    indexOf(inheritList, parentParams[j]) >= 0 || (inheritList.push(parentParams[j]), inherited[parentParams[j]] = currentParams[parentParams[j]]);
        return extend({}, inherited, newParams)
    }
    function equalForKeys(a, b, keys) {
        if (!keys) {
            keys = [];
            for (var n in a)
                keys.push(n)
        }
        for (var i = 0; i < keys.length; i++) {
            var k = keys[i];
            if (a[k] != b[k])
                return!1
        }
        return!0
    }
    function filterByKeys(keys, values) {
        var filtered = {};
        return forEach(keys, function (name) {
            filtered[name] = values[name]
        }), filtered
    }
    function omit(obj) {
        var copy = {}, keys = Array.prototype.concat.apply(Array.prototype, Array.prototype.slice.call(arguments, 1));
        for (var key in obj)
            -1 == indexOf(keys, key) && (copy[key] = obj[key]);
        return copy
    }
    function filter(collection, callback) {
        var array = isArray(collection), result = array ? [] : {};
        return forEach(collection, function (val, i) {
            callback(val, i) && (result[array ? result.length : i] = val)
        }), result
    }
    function map(collection, callback) {
        var result = isArray(collection) ? [] : {};
        return forEach(collection, function (val, i) {
            result[i] = callback(val, i)
        }), result
    }
    function $Resolve($q, $injector) {
        var VISIT_IN_PROGRESS = 1, VISIT_DONE = 2, NOTHING = {}, NO_DEPENDENCIES = [], NO_LOCALS = NOTHING, NO_PARENT = extend($q.when(NOTHING), {$$promises: NOTHING, $$values: NOTHING});
        this.study = function (invocables) {
            function visit(value, key) {
                if (visited[key] !== VISIT_DONE) {
                    if (cycle.push(key), visited[key] === VISIT_IN_PROGRESS)
                        throw cycle.splice(0, indexOf(cycle, key)), new Error("Cyclic dependency: " + cycle.join(" -> "));
                    if (visited[key] = VISIT_IN_PROGRESS, isString(value))
                        plan.push(key, [function () {
                                return $injector.get(value)
                            }], NO_DEPENDENCIES);
                    else {
                        var params = $injector.annotate(value);
                        forEach(params, function (param) {
                            param !== key && invocables.hasOwnProperty(param) && visit(invocables[param], param)
                        }), plan.push(key, value, params)
                    }
                    cycle.pop(), visited[key] = VISIT_DONE
                }
            }
            function isResolve(value) {
                return isObject(value) && value.then && value.$$promises
            }
            if (!isObject(invocables))
                throw new Error("'invocables' must be an object");
            var invocableKeys = objectKeys(invocables || {}), plan = [], cycle = [], visited = {};
            return forEach(invocables, visit), invocables = cycle = visited = null, function (locals, parent, self) {
                function done() {
                    --wait || (merged || merge(values, parent.$$values), result.$$values = values, result.$$promises = result.$$promises || !0, delete result.$$inheritedValues, resolution.resolve(values))
                }
                function fail(reason) {
                    result.$$failure = reason, resolution.reject(reason)
                }
                function invoke(key, invocable, params) {
                    function onfailure(reason) {
                        invocation.reject(reason), fail(reason)
                    }
                    function proceed() {
                        if (!isDefined(result.$$failure))
                            try {
                                invocation.resolve($injector.invoke(invocable, self, values)), invocation.promise.then(function (result) {
                                    values[key] = result, done()
                                }, onfailure)
                            } catch (e) {
                                onfailure(e)
                            }
                    }
                    var invocation = $q.defer(), waitParams = 0;
                    forEach(params, function (dep) {
                        promises.hasOwnProperty(dep) && !locals.hasOwnProperty(dep) && (waitParams++, promises[dep].then(function (result) {
                            values[dep] = result, --waitParams || proceed()
                        }, onfailure))
                    }), waitParams || proceed(), promises[key] = invocation.promise
                }
                if (isResolve(locals) && self === undefined && (self = parent, parent = locals, locals = null), locals) {
                    if (!isObject(locals))
                        throw new Error("'locals' must be an object")
                } else
                    locals = NO_LOCALS;
                if (parent) {
                    if (!isResolve(parent))
                        throw new Error("'parent' must be a promise returned by $resolve.resolve()")
                } else
                    parent = NO_PARENT;
                var resolution = $q.defer(), result = resolution.promise, promises = result.$$promises = {}, values = extend({}, locals), wait = 1 + plan.length / 3, merged = !1;
                if (isDefined(parent.$$failure))
                    return fail(parent.$$failure), result;
                parent.$$inheritedValues && merge(values, omit(parent.$$inheritedValues, invocableKeys)), extend(promises, parent.$$promises), parent.$$values ? (merged = merge(values, omit(parent.$$values, invocableKeys)), result.$$inheritedValues = omit(parent.$$values, invocableKeys), done()) : (parent.$$inheritedValues && (result.$$inheritedValues = omit(parent.$$inheritedValues, invocableKeys)), parent.then(done, fail));
                for (var i = 0, ii = plan.length; ii > i; i += 3)
                    locals.hasOwnProperty(plan[i]) ? done() : invoke(plan[i], plan[i + 1], plan[i + 2]);
                return result
            }
        }, this.resolve = function (invocables, locals, parent, self) {
            return this.study(invocables)(locals, parent, self)
        }
    }
    function $TemplateFactory($http, $templateCache, $injector) {
        this.fromConfig = function (config, params, locals) {
            return isDefined(config.template) ? this.fromString(config.template, params) : isDefined(config.templateUrl) ? this.fromUrl(config.templateUrl, params) : isDefined(config.templateProvider) ? this.fromProvider(config.templateProvider, params, locals) : null
        }, this.fromString = function (template, params) {
            return isFunction(template) ? template(params) : template
        }, this.fromUrl = function (url, params) {
            return isFunction(url) && (url = url(params)), null == url ? null : $http.get(url, {cache: $templateCache, headers: {Accept: "text/html"}}).then(function (response) {
                return response.data
            })
        }, this.fromProvider = function (provider, params, locals) {
            return $injector.invoke(provider, null, locals || {params: params})
        }
    }
    function UrlMatcher(pattern, config, parentMatcher) {
        function addParameter(id, type, config, location) {
            if (paramNames.push(id), parentParams[id])
                return parentParams[id];
            if (!/^\w+(-+\w+)*(?:\[\])?$/.test(id))
                throw new Error("Invalid parameter name '" + id + "' in pattern '" + pattern + "'");
            if (params[id])
                throw new Error("Duplicate parameter name '" + id + "' in pattern '" + pattern + "'");
            return params[id] = new $$UMFP.Param(id, type, config, location), params[id]
        }
        function quoteRegExp(string, pattern, squash) {
            var surroundPattern = ["", ""], result = string.replace(/[\\\[\]\^$*+?.()|{}]/g, "\\$&");
            if (!pattern)
                return result;
            switch (squash) {
                case!1:
                    surroundPattern = ["(", ")"];
                    break;
                case!0:
                    surroundPattern = ["?(", ")?"];
                    break;
                default:
                    surroundPattern = ["(" + squash + "|", ")?"]
            }
            return result + surroundPattern[0] + pattern + surroundPattern[1]
        }
        function matchDetails(m, isSearch) {
            var id, regexp, segment, type, cfg;
            return id = m[2] || m[3], cfg = config.params[id], segment = pattern.substring(last, m.index), regexp = isSearch ? m[4] : m[4] || ("*" == m[1] ? ".*" : null), type = $$UMFP.type(regexp || "string") || inherit($$UMFP.type("string"), {pattern: new RegExp(regexp)}), {id: id, regexp: regexp, segment: segment, type: type, cfg: cfg}
        }
        config = extend({params: {}}, isObject(config) ? config : {});
        var m, placeholder = /([:*])([\w\[\]]+)|\{([\w\[\]]+)(?:\:((?:[^{}\\]+|\\.|\{(?:[^{}\\]+|\\.)*\})+))?\}/g, searchPlaceholder = /([:]?)([\w\[\]-]+)|\{([\w\[\]-]+)(?:\:((?:[^{}\\]+|\\.|\{(?:[^{}\\]+|\\.)*\})+))?\}/g, compiled = "^", last = 0, segments = this.segments = [], parentParams = parentMatcher ? parentMatcher.params : {}, params = this.params = parentMatcher ? parentMatcher.params.$$new() : new $$UMFP.ParamSet, paramNames = [];
        this.source = pattern;
        for (var p, param, segment; (m = placeholder.exec(pattern)) && (p = matchDetails(m, !1), !(p.segment.indexOf("?") >= 0)); )
            param = addParameter(p.id, p.type, p.cfg, "path"), compiled += quoteRegExp(p.segment, param.type.pattern.source, param.squash), segments.push(p.segment), last = placeholder.lastIndex;
        segment = pattern.substring(last);
        var i = segment.indexOf("?");
        if (i >= 0) {
            var search = this.sourceSearch = segment.substring(i);
            if (segment = segment.substring(0, i), this.sourcePath = pattern.substring(0, last + i), search.length > 0)
                for (last = 0; m = searchPlaceholder.exec(search); )
                    p = matchDetails(m, !0), param = addParameter(p.id, p.type, p.cfg, "search"), last = placeholder.lastIndex
        } else
            this.sourcePath = pattern, this.sourceSearch = "";
        compiled += quoteRegExp(segment) + (config.strict === !1 ? "/?" : "") + "$", segments.push(segment), this.regexp = new RegExp(compiled, config.caseInsensitive ? "i" : undefined), this.prefix = segments[0], this.$$paramNames = paramNames
    }
    function Type(config) {
        extend(this, config)
    }
    function $UrlMatcherFactory() {
        function valToString(val) {
            return null != val ? val.toString().replace(/\//g, "%2F") : val
        }
        function valFromString(val) {
            return null != val ? val.toString().replace(/%2F/g, "/") : val
        }
        function regexpMatches(val) {
            return this.pattern.test(val)
        }
        function getDefaultConfig() {
            return{strict: isStrictMode, caseInsensitive: isCaseInsensitive}
        }
        function isInjectable(value) {
            return isFunction(value) || isArray(value) && isFunction(value[value.length - 1])
        }
        function flushTypeQueue() {
            for (; typeQueue.length; ) {
                var type = typeQueue.shift();
                if (type.pattern)
                    throw new Error("You cannot override a type's .pattern at runtime.");
                angular.extend($types[type.name], injector.invoke(type.def))
            }
        }
        function ParamSet(params) {
            extend(this, params || {})
        }
        $$UMFP = this;
        var injector, isCaseInsensitive = !1, isStrictMode = !0, defaultSquashPolicy = !1, $types = {}, enqueue = !0, typeQueue = [], defaultTypes = {string: {encode: valToString, decode: valFromString, is: regexpMatches, pattern: /[^/]*/}, "int": {encode: valToString, decode: function (val) {
                    return parseInt(val, 10)
                }, is: function (val) {
                    return isDefined(val) && this.decode(val.toString()) === val
                }, pattern: /\d+/}, bool: {encode: function (val) {
                    return val ? 1 : 0
                }, decode: function (val) {
                    return 0 !== parseInt(val, 10)
                }, is: function (val) {
                    return val === !0 || val === !1
                }, pattern: /0|1/}, date: {encode: function (val) {
                    return this.is(val) ? [val.getFullYear(), ("0" + (val.getMonth() + 1)).slice(-2), ("0" + val.getDate()).slice(-2)].join("-") : undefined
                }, decode: function (val) {
                    if (this.is(val))
                        return val;
                    var match = this.capture.exec(val);
                    return match ? new Date(match[1], match[2] - 1, match[3]) : undefined
                }, is: function (val) {
                    return val instanceof Date && !isNaN(val.valueOf())
                }, equals: function (a, b) {
                    return this.is(a) && this.is(b) && a.toISOString() === b.toISOString()
                }, pattern: /[0-9]{4}-(?:0[1-9]|1[0-2])-(?:0[1-9]|[1-2][0-9]|3[0-1])/, capture: /([0-9]{4})-(0[1-9]|1[0-2])-(0[1-9]|[1-2][0-9]|3[0-1])/}, json: {encode: angular.toJson, decode: angular.fromJson, is: angular.isObject, equals: angular.equals, pattern: /[^/]*/}, any: {encode: angular.identity, decode: angular.identity, is: angular.identity, equals: angular.equals, pattern: /.*/}};
        $UrlMatcherFactory.$$getDefaultValue = function (config) {
            if (!isInjectable(config.value))
                return config.value;
            if (!injector)
                throw new Error("Injectable functions cannot be called at configuration time");
            return injector.invoke(config.value)
        }, this.caseInsensitive = function (value) {
            return isDefined(value) && (isCaseInsensitive = value), isCaseInsensitive
        }, this.strictMode = function (value) {
            return isDefined(value) && (isStrictMode = value), isStrictMode
        }, this.defaultSquashPolicy = function (value) {
            if (!isDefined(value))
                return defaultSquashPolicy;
            if (value !== !0 && value !== !1 && !isString(value))
                throw new Error("Invalid squash policy: " + value + ". Valid policies: false, true, arbitrary-string");
            return defaultSquashPolicy = value, value
        }, this.compile = function (pattern, config) {
            return new UrlMatcher(pattern, extend(getDefaultConfig(), config))
        }, this.isMatcher = function (o) {
            if (!isObject(o))
                return!1;
            var result = !0;
            return forEach(UrlMatcher.prototype, function (val, name) {
                isFunction(val) && (result = result && isDefined(o[name]) && isFunction(o[name]))
            }), result
        }, this.type = function (name, definition, definitionFn) {
            if (!isDefined(definition))
                return $types[name];
            if ($types.hasOwnProperty(name))
                throw new Error("A type named '" + name + "' has already been defined.");
            return $types[name] = new Type(extend({name: name}, definition)), definitionFn && (typeQueue.push({name: name, def: definitionFn}), enqueue || flushTypeQueue()), this
        }, forEach(defaultTypes, function (type, name) {
            $types[name] = new Type(extend({name: name}, type))
        }), $types = inherit($types, {}), this.$get = ["$injector", function ($injector) {
                return injector = $injector, enqueue = !1, flushTypeQueue(), forEach(defaultTypes, function (type, name) {
                    $types[name] || ($types[name] = new Type(type))
                }), this
            }], this.Param = function (id, type, config, location) {
            function unwrapShorthand(config) {
                var keys = isObject(config) ? objectKeys(config) : [], isShorthand = -1 === indexOf(keys, "value") && -1 === indexOf(keys, "type") && -1 === indexOf(keys, "squash") && -1 === indexOf(keys, "array");
                return isShorthand && (config = {value: config}), config.$$fn = isInjectable(config.value) ? config.value : function () {
                    return config.value
                }, config
            }
            function getType(config, urlType, location) {
                if (config.type && urlType)
                    throw new Error("Param '" + id + "' has two type configurations.");
                return urlType ? urlType : config.type ? config.type instanceof Type ? config.type : new Type(config.type) : "config" === location ? $types.any : $types.string
            }
            function getArrayMode() {
                var arrayDefaults = {array: "search" === location ? "auto" : !1}, arrayParamNomenclature = id.match(/\[\]$/) ? {array: !0} : {};
                return extend(arrayDefaults, arrayParamNomenclature, config).array
            }
            function getSquashPolicy(config, isOptional) {
                var squash = config.squash;
                if (!isOptional || squash === !1)
                    return!1;
                if (!isDefined(squash) || null == squash)
                    return defaultSquashPolicy;
                if (squash === !0 || isString(squash))
                    return squash;
                throw new Error("Invalid squash policy: '" + squash + "'. Valid policies: false, true, or arbitrary string")
            }
            function getReplace(config, arrayMode, isOptional, squash) {
                var replace, configuredKeys, defaultPolicy = [{from: "", to: isOptional || arrayMode ? undefined : ""}, {from: null, to: isOptional || arrayMode ? undefined : ""}];
                return replace = isArray(config.replace) ? config.replace : [], isString(squash) && replace.push({from: squash, to: undefined}), configuredKeys = map(replace, function (item) {
                    return item.from
                }), filter(defaultPolicy, function (item) {
                    return-1 === indexOf(configuredKeys, item.from)
                }).concat(replace)
            }
            function $$getDefaultValue() {
                if (!injector)
                    throw new Error("Injectable functions cannot be called at configuration time");
                return injector.invoke(config.$$fn)
            }
            function $value(value) {
                function hasReplaceVal(val) {
                    return function (obj) {
                        return obj.from === val
                    }
                }
                function $replace(value) {
                    var replacement = map(filter(self.replace, hasReplaceVal(value)), function (obj) {
                        return obj.to
                    });
                    return replacement.length ? replacement[0] : value
                }
                return value = $replace(value), isDefined(value) ? self.type.decode(value) : $$getDefaultValue()
            }
            function toString() {
                return"{Param:" + id + " " + type + " squash: '" + squash + "' optional: " + isOptional + "}"
            }
            var self = this;
            config = unwrapShorthand(config), type = getType(config, type, location);
            var arrayMode = getArrayMode();
            type = arrayMode ? type.$asArray(arrayMode, "search" === location) : type, "string" !== type.name || arrayMode || "path" !== location || config.value !== undefined || (config.value = "");
            var isOptional = config.value !== undefined, squash = getSquashPolicy(config, isOptional), replace = getReplace(config, arrayMode, isOptional, squash);
            extend(this, {id: id, type: type, location: location, array: arrayMode, squash: squash, replace: replace, isOptional: isOptional, value: $value, dynamic: undefined, config: config, toString: toString})
        }, ParamSet.prototype = {$$new: function () {
                return inherit(this, extend(new ParamSet, {$$parent: this}))
            }, $$keys: function () {
                for (var keys = [], chain = [], parent = this, ignore = objectKeys(ParamSet.prototype); parent; )
                    chain.push(parent), parent = parent.$$parent;
                return chain.reverse(), forEach(chain, function (paramset) {
                    forEach(objectKeys(paramset), function (key) {
                        -1 === indexOf(keys, key) && -1 === indexOf(ignore, key) && keys.push(key)
                    })
                }), keys
            }, $$values: function (paramValues) {
                var values = {}, self = this;
                return forEach(self.$$keys(), function (key) {
                    values[key] = self[key].value(paramValues && paramValues[key])
                }), values
            }, $$equals: function (paramValues1, paramValues2) {
                var equal = !0, self = this;
                return forEach(self.$$keys(), function (key) {
                    var left = paramValues1 && paramValues1[key], right = paramValues2 && paramValues2[key];
                    self[key].type.equals(left, right) || (equal = !1)
                }), equal
            }, $$validates: function (paramValues) {
                var isOptional, val, param, result = !0, self = this;
                return forEach(this.$$keys(), function (key) {
                    param = self[key], val = paramValues[key], isOptional = !val && param.isOptional, result = result && (isOptional || !!param.type.is(val))
                }), result
            }, $$parent: undefined}, this.ParamSet = ParamSet
    }
    function $UrlRouterProvider($locationProvider, $urlMatcherFactory) {
        function regExpPrefix(re) {
            var prefix = /^\^((?:\\[^a-zA-Z0-9]|[^\\\[\]\^$*+?.()|{}]+)*)/.exec(re.source);
            return null != prefix ? prefix[1].replace(/\\(.)/g, "$1") : ""
        }
        function interpolate(pattern, match) {
            return pattern.replace(/\$(\$|\d{1,2})/, function (m, what) {
                return match["$" === what ? 0 : Number(what)]
            })
        }
        function handleIfMatch($injector, handler, match) {
            if (!match)
                return!1;
            var result = $injector.invoke(handler, handler, {$match: match});
            return isDefined(result) ? result : !0
        }
        function $get($location, $rootScope, $injector, $browser) {
            function appendBasePath(url, isHtml5, absolute) {
                return"/" === baseHref ? url : isHtml5 ? baseHref.slice(0, -1) + url : absolute ? baseHref.slice(1) + url : url
            }
            function update(evt) {
                function check(rule) {
                    var handled = rule($injector, $location);
                    return handled ? (isString(handled) && $location.replace().url(handled), !0) : !1
                }
                if (!evt || !evt.defaultPrevented) {
                    var ignoreUpdate = lastPushedUrl && $location.url() === lastPushedUrl;
                    if (lastPushedUrl = undefined, ignoreUpdate)
                        return!0;
                    var i, n = rules.length;
                    for (i = 0; n > i; i++)
                        if (check(rules[i]))
                            return;
                    otherwise && check(otherwise)
                }
            }
            function listen() {
                return listener = listener || $rootScope.$on("$locationChangeSuccess", update)
            }
            var lastPushedUrl, baseHref = $browser.baseHref(), location = $location.url();
            return interceptDeferred || listen(), {sync: function () {
                    update()
                }, listen: function () {
                    return listen()
                }, update: function (read) {
                    return read ? void(location = $location.url()) : void($location.url() !== location && ($location.url(location), $location.replace()))
                }, push: function (urlMatcher, params, options) {
                    $location.url(urlMatcher.format(params || {})), lastPushedUrl = options && options.$$avoidResync ? $location.url() : undefined, options && options.replace && $location.replace()
                }, href: function (urlMatcher, params, options) {
                    if (!urlMatcher.validates(params))
                        return null;
                    var isHtml5 = $locationProvider.html5Mode();
                    angular.isObject(isHtml5) && (isHtml5 = isHtml5.enabled);
                    var url = urlMatcher.format(params);
                    if (options = options || {}, isHtml5 || null === url || (url = "#" + $locationProvider.hashPrefix() + url), url = appendBasePath(url, isHtml5, options.absolute), !options.absolute || !url)
                        return url;
                    var slash = !isHtml5 && url ? "/" : "", port = $location.port();
                    return port = 80 === port || 443 === port ? "" : ":" + port, [$location.protocol(), "://", $location.host(), port, slash, url].join("")
                }}
        }
        var listener, rules = [], otherwise = null, interceptDeferred = !1;
        this.rule = function (rule) {
            if (!isFunction(rule))
                throw new Error("'rule' must be a function");
            return rules.push(rule), this
        }, this.otherwise = function (rule) {
            if (isString(rule)) {
                var redirect = rule;
                rule = function () {
                    return redirect
                }
            } else if (!isFunction(rule))
                throw new Error("'rule' must be a function");
            return otherwise = rule, this
        }, this.when = function (what, handler) {
            var redirect, handlerIsString = isString(handler);
            if (isString(what) && (what = $urlMatcherFactory.compile(what)), !handlerIsString && !isFunction(handler) && !isArray(handler))
                throw new Error("invalid 'handler' in when()");
            var strategies = {matcher: function (what, handler) {
                    return handlerIsString && (redirect = $urlMatcherFactory.compile(handler), handler = ["$match", function ($match) {
                            return redirect.format($match)
                        }]), extend(function ($injector, $location) {
                        return handleIfMatch($injector, handler, what.exec($location.path(), $location.search()))
                    }, {prefix: isString(what.prefix) ? what.prefix : ""})
                }, regex: function (what, handler) {
                    if (what.global || what.sticky)
                        throw new Error("when() RegExp must not be global or sticky");
                    return handlerIsString && (redirect = handler, handler = ["$match", function ($match) {
                            return interpolate(redirect, $match)
                        }]), extend(function ($injector, $location) {
                        return handleIfMatch($injector, handler, what.exec($location.path()))
                    }, {prefix: regExpPrefix(what)})
                }}, check = {matcher: $urlMatcherFactory.isMatcher(what), regex: what instanceof RegExp};
            for (var n in check)
                if (check[n])
                    return this.rule(strategies[n](what, handler));
            throw new Error("invalid 'what' in when()")
        }, this.deferIntercept = function (defer) {
            defer === undefined && (defer = !0), interceptDeferred = defer
        }, this.$get = $get, $get.$inject = ["$location", "$rootScope", "$injector", "$browser"]
    }
    function $StateProvider($urlRouterProvider, $urlMatcherFactory) {
        function isRelative(stateName) {
            return 0 === stateName.indexOf(".") || 0 === stateName.indexOf("^")
        }
        function findState(stateOrName, base) {
            if (!stateOrName)
                return undefined;
            var isStr = isString(stateOrName), name = isStr ? stateOrName : stateOrName.name, path = isRelative(name);
            if (path) {
                if (!base)
                    throw new Error("No reference point given for path '" + name + "'");
                base = findState(base);
                for (var rel = name.split("."), i = 0, pathLength = rel.length, current = base; pathLength > i; i++)
                    if ("" !== rel[i] || 0 !== i) {
                        if ("^" !== rel[i])
                            break;
                        if (!current.parent)
                            throw new Error("Path '" + name + "' not valid for state '" + base.name + "'");
                        current = current.parent
                    } else
                        current = base;
                rel = rel.slice(i).join("."), name = current.name + (current.name && rel ? "." : "") + rel
            }
            var state = states[name];
            return!state || !isStr && (isStr || state !== stateOrName && state.self !== stateOrName) ? undefined : state
        }
        function queueState(parentName, state) {
            queue[parentName] || (queue[parentName] = []), queue[parentName].push(state)
        }
        function flushQueuedChildren(parentName) {
            for (var queued = queue[parentName] || []; queued.length; )
                registerState(queued.shift())
        }
        function registerState(state) {
            state = inherit(state, {self: state, resolve: state.resolve || {}, toString: function () {
                    return this.name
                }});
            var name = state.name;
            if (!isString(name) || name.indexOf("@") >= 0)
                throw new Error("State must have a valid name");
            if (states.hasOwnProperty(name))
                throw new Error("State '" + name + "'' is already defined");
            var parentName = -1 !== name.indexOf(".") ? name.substring(0, name.lastIndexOf(".")) : isString(state.parent) ? state.parent : isObject(state.parent) && isString(state.parent.name) ? state.parent.name : "";
            if (parentName && !states[parentName])
                return queueState(parentName, state.self);
            for (var key in stateBuilder)
                isFunction(stateBuilder[key]) && (state[key] = stateBuilder[key](state, stateBuilder.$delegates[key]));
            return states[name] = state, !state[abstractKey] && state.url && $urlRouterProvider.when(state.url, ["$match", "$stateParams", function ($match, $stateParams) {
                    $state.$current.navigable == state && equalForKeys($match, $stateParams) || $state.transitionTo(state, $match, {inherit: !0, location: !1})
                }]), flushQueuedChildren(name), state
        }
        function isGlob(text) {
            return text.indexOf("*") > -1
        }
        function doesStateMatchGlob(glob) {
            var globSegments = glob.split("."), segments = $state.$current.name.split(".");
            if ("**" === globSegments[0] && (segments = segments.slice(indexOf(segments, globSegments[1])), segments.unshift("**")), "**" === globSegments[globSegments.length - 1] && (segments.splice(indexOf(segments, globSegments[globSegments.length - 2]) + 1, Number.MAX_VALUE), segments.push("**")), globSegments.length != segments.length)
                return!1;
            for (var i = 0, l = globSegments.length; l > i; i++)
                "*" === globSegments[i] && (segments[i] = "*");
            return segments.join("") === globSegments.join("")
        }
        function decorator(name, func) {
            return isString(name) && !isDefined(func) ? stateBuilder[name] : isFunction(func) && isString(name) ? (stateBuilder[name] && !stateBuilder.$delegates[name] && (stateBuilder.$delegates[name] = stateBuilder[name]), stateBuilder[name] = func, this) : this
        }
        function state(name, definition) {
            return isObject(name) ? definition = name : definition.name = name, registerState(definition), this
        }
        function $get($rootScope, $q, $view, $injector, $resolve, $stateParams, $urlRouter) {
            function handleRedirect(redirect, state, params, options) {
                var evt = $rootScope.$broadcast("$stateNotFound", redirect, state, params);
                if (evt.defaultPrevented)
                    return $urlRouter.update(), TransitionAborted;
                if (!evt.retry)
                    return null;
                if (options.$retry)
                    return $urlRouter.update(), TransitionFailed;
                var retryTransition = $state.transition = $q.when(evt.retry);
                return retryTransition.then(function () {
                    return retryTransition !== $state.transition ? TransitionSuperseded : (redirect.options.$retry = !0, $state.transitionTo(redirect.to, redirect.toParams, redirect.options))
                }, function () {
                    return TransitionAborted
                }), $urlRouter.update(), retryTransition
            }
            function resolveState(state, params, paramsAreFiltered, inherited, dst, options) {
                var $stateParams = paramsAreFiltered ? params : filterByKeys(state.params.$$keys(), params), locals = {$stateParams: $stateParams};
                dst.resolve = $resolve.resolve(state.resolve, locals, dst.resolve, state);
                var promises = [dst.resolve.then(function (globals) {
                        dst.globals = globals
                    })];
                return inherited && promises.push(inherited), forEach(state.views, function (view, name) {
                    var injectables = view.resolve && view.resolve !== state.resolve ? view.resolve : {};
                    injectables.$template = [function () {
                            return $view.load(name, {view: view, locals: locals, params: $stateParams, notify: options.notify}) || ""
                        }], promises.push($resolve.resolve(injectables, locals, dst.resolve, state).then(function (result) {
                        if (isFunction(view.controllerProvider) || isArray(view.controllerProvider)) {
                            var injectLocals = angular.extend({}, injectables, locals);
                            result.$$controller = $injector.invoke(view.controllerProvider, null, injectLocals)
                        } else
                            result.$$controller = view.controller;
                        result.$$state = state, result.$$controllerAs = view.controllerAs, dst[name] = result
                    }))
                }), $q.all(promises).then(function () {
                    return dst
                })
            }
            var TransitionSuperseded = $q.reject(new Error("transition superseded")), TransitionPrevented = $q.reject(new Error("transition prevented")), TransitionAborted = $q.reject(new Error("transition aborted")), TransitionFailed = $q.reject(new Error("transition failed"));
            return root.locals = {resolve: null, globals: {$stateParams: {}}}, $state = {params: {}, current: root.self, $current: root, transition: null}, $state.reload = function () {
                return $state.transitionTo($state.current, $stateParams, {reload: !0, inherit: !1, notify: !0})
            }, $state.go = function (to, params, options) {
                return $state.transitionTo(to, params, extend({inherit: !0, relative: $state.$current}, options))
            }, $state.transitionTo = function (to, toParams, options) {
                toParams = toParams || {}, options = extend({location: !0, inherit: !1, relative: null, notify: !0, reload: !1, $retry: !1}, options || {});
                var evt, from = $state.$current, fromParams = $state.params, fromPath = from.path, toState = findState(to, options.relative);
                if (!isDefined(toState)) {
                    var redirect = {to: to, toParams: toParams, options: options}, redirectResult = handleRedirect(redirect, from.self, fromParams, options);
                    if (redirectResult)
                        return redirectResult;
                    if (to = redirect.to, toParams = redirect.toParams, options = redirect.options, toState = findState(to, options.relative), !isDefined(toState)) {
                        if (!options.relative)
                            throw new Error("No such state '" + to + "'");
                        throw new Error("Could not resolve '" + to + "' from state '" + options.relative + "'")
                    }
                }
                if (toState[abstractKey])
                    throw new Error("Cannot transition to abstract state '" + to + "'");
                if (options.inherit && (toParams = inheritParams($stateParams, toParams || {}, $state.$current, toState)), !toState.params.$$validates(toParams))
                    return TransitionFailed;
                toParams = toState.params.$$values(toParams), to = toState;
                var toPath = to.path, keep = 0, state = toPath[keep], locals = root.locals, toLocals = [];
                if (!options.reload)
                    for (; state && state === fromPath[keep] && state.ownParams.$$equals(toParams, fromParams); )
                        locals = toLocals[keep] = state.locals, keep++, state = toPath[keep];
                if (shouldTriggerReload(to, from, locals, options))
                    return to.self.reloadOnSearch !== !1 && $urlRouter.update(), $state.transition = null, $q.when($state.current);
                if (toParams = filterByKeys(to.params.$$keys(), toParams || {}), options.notify && $rootScope.$broadcast("$stateChangeStart", to.self, toParams, from.self, fromParams).defaultPrevented)
                    return $urlRouter.update(), TransitionPrevented;
                for (var resolved = $q.when(locals), l = keep; l < toPath.length; l++, state = toPath[l])
                    locals = toLocals[l] = inherit(locals), resolved = resolveState(state, toParams, state === to, resolved, locals, options);
                var transition = $state.transition = resolved.then(function () {
                    var l, entering, exiting;
                    if ($state.transition !== transition)
                        return TransitionSuperseded;
                    for (l = fromPath.length - 1; l >= keep; l--)
                        exiting = fromPath[l], exiting.self.onExit && $injector.invoke(exiting.self.onExit, exiting.self, exiting.locals.globals), exiting.locals = null;
                    for (l = keep; l < toPath.length; l++)
                        entering = toPath[l], entering.locals = toLocals[l], entering.self.onEnter && $injector.invoke(entering.self.onEnter, entering.self, entering.locals.globals);
                    return $state.transition !== transition ? TransitionSuperseded : ($state.$current = to, $state.current = to.self, $state.params = toParams, copy($state.params, $stateParams), $state.transition = null, options.location && to.navigable && $urlRouter.push(to.navigable.url, to.navigable.locals.globals.$stateParams, {$$avoidResync: !0, replace: "replace" === options.location}), options.notify && $rootScope.$broadcast("$stateChangeSuccess", to.self, toParams, from.self, fromParams), $urlRouter.update(!0), $state.current)
                }, function (error) {
                    return $state.transition !== transition ? TransitionSuperseded : ($state.transition = null, evt = $rootScope.$broadcast("$stateChangeError", to.self, toParams, from.self, fromParams, error), evt.defaultPrevented || $urlRouter.update(), $q.reject(error))
                });
                return transition
            }, $state.is = function (stateOrName, params, options) {
                options = extend({relative: $state.$current}, options || {});
                var state = findState(stateOrName, options.relative);
                return isDefined(state) ? $state.$current !== state ? !1 : params ? equalForKeys(state.params.$$values(params), $stateParams) : !0 : undefined
            }, $state.includes = function (stateOrName, params, options) {
                if (options = extend({relative: $state.$current}, options || {}), isString(stateOrName) && isGlob(stateOrName)) {
                    if (!doesStateMatchGlob(stateOrName))
                        return!1;
                    stateOrName = $state.$current.name
                }
                var state = findState(stateOrName, options.relative);
                return isDefined(state) ? isDefined($state.$current.includes[state.name]) ? params ? equalForKeys(state.params.$$values(params), $stateParams, objectKeys(params)) : !0 : !1 : undefined
            }, $state.href = function (stateOrName, params, options) {
                options = extend({lossy: !0, inherit: !0, absolute: !1, relative: $state.$current}, options || {});
                var state = findState(stateOrName, options.relative);
                if (!isDefined(state))
                    return null;
                options.inherit && (params = inheritParams($stateParams, params || {}, $state.$current, state));
                var nav = state && options.lossy ? state.navigable : state;
                return nav && nav.url !== undefined && null !== nav.url ? $urlRouter.href(nav.url, filterByKeys(state.params.$$keys(), params || {}), {absolute: options.absolute}) : null
            }, $state.get = function (stateOrName, context) {
                if (0 === arguments.length)
                    return map(objectKeys(states), function (name) {
                        return states[name].self
                    });
                var state = findState(stateOrName, context || $state.$current);
                return state && state.self ? state.self : null
            }, $state
        }
        function shouldTriggerReload(to, from, locals, options) {
            return to !== from || (locals !== from.locals || options.reload) && to.self.reloadOnSearch !== !1 ? void 0 : !0
        }
        var root, $state, states = {}, queue = {}, abstractKey = "abstract", stateBuilder = {parent: function (state) {
                if (isDefined(state.parent) && state.parent)
                    return findState(state.parent);
                var compositeName = /^(.+)\.[^.]+$/.exec(state.name);
                return compositeName ? findState(compositeName[1]) : root
            }, data: function (state) {
                return state.parent && state.parent.data && (state.data = state.self.data = extend({}, state.parent.data, state.data)), state.data
            }, url: function (state) {
                var url = state.url, config = {params: state.params || {}};
                if (isString(url))
                    return"^" == url.charAt(0) ? $urlMatcherFactory.compile(url.substring(1), config) : (state.parent.navigable || root).url.concat(url, config);
                if (!url || $urlMatcherFactory.isMatcher(url))
                    return url;
                throw new Error("Invalid url '" + url + "' in state '" + state + "'")
            }, navigable: function (state) {
                return state.url ? state : state.parent ? state.parent.navigable : null
            }, ownParams: function (state) {
                var params = state.url && state.url.params || new $$UMFP.ParamSet;
                return forEach(state.params || {}, function (config, id) {
                    params[id] || (params[id] = new $$UMFP.Param(id, null, config, "config"))
                }), params
            }, params: function (state) {
                return state.parent && state.parent.params ? extend(state.parent.params.$$new(), state.ownParams) : new $$UMFP.ParamSet
            }, views: function (state) {
                var views = {};
                return forEach(isDefined(state.views) ? state.views : {"": state}, function (view, name) {
                    name.indexOf("@") < 0 && (name += "@" + state.parent.name), views[name] = view
                }), views
            }, path: function (state) {
                return state.parent ? state.parent.path.concat(state) : []
            }, includes: function (state) {
                var includes = state.parent ? extend({}, state.parent.includes) : {};
                return includes[state.name] = !0, includes
            }, $delegates: {}};
        root = registerState({name: "", url: "^", views: null, "abstract": !0}), root.navigable = null, this.decorator = decorator, this.state = state, this.$get = $get, $get.$inject = ["$rootScope", "$q", "$view", "$injector", "$resolve", "$stateParams", "$urlRouter", "$location", "$urlMatcherFactory"]
    }
    function $ViewProvider() {
        function $get($rootScope, $templateFactory) {
            return{load: function (name, options) {
                    var result, defaults = {template: null, controller: null, view: null, locals: null, notify: !0, async: !0, params: {}};
                    return options = extend(defaults, options), options.view && (result = $templateFactory.fromConfig(options.view, options.params, options.locals)), result && options.notify && $rootScope.$broadcast("$viewContentLoading", options), result
                }}
        }
        this.$get = $get, $get.$inject = ["$rootScope", "$templateFactory"]
    }
    function $ViewScrollProvider() {
        var useAnchorScroll = !1;
        this.useAnchorScroll = function () {
            useAnchorScroll = !0
        }, this.$get = ["$anchorScroll", "$timeout", function ($anchorScroll, $timeout) {
                return useAnchorScroll ? $anchorScroll : function ($element) {
                    $timeout(function () {
                        $element[0].scrollIntoView()
                    }, 0, !1)
                }
            }]
    }
    function $ViewDirective($state, $injector, $uiViewScroll, $interpolate) {
        function getService() {
            return $injector.has ? function (service) {
                return $injector.has(service) ? $injector.get(service) : null
            } : function (service) {
                try {
                    return $injector.get(service)
                } catch (e) {
                    return null
                }
            }
        }
        function getRenderer(attrs, scope) {
            var statics = function () {
                return{enter: function (element, target, cb) {
                        target.after(element), cb()
                    }, leave: function (element, cb) {
                        element.remove(), cb()
                    }}
            };
            if ($animate)
                return{enter: function (element, target, cb) {
                        var promise = $animate.enter(element, null, target, cb);
                        promise && promise.then && promise.then(cb)
                    }, leave: function (element, cb) {
                        var promise = $animate.leave(element, cb);
                        promise && promise.then && promise.then(cb)
                    }};
            if ($animator) {
                var animate = $animator && $animator(scope, attrs);
                return{enter: function (element, target, cb) {
                        animate.enter(element, null, target), cb()
                    }, leave: function (element, cb) {
                        animate.leave(element), cb()
                    }}
            }
            return statics()
        }
        var service = getService(), $animator = service("$animator"), $animate = service("$animate"), directive = {restrict: "ECA", terminal: !0, priority: 400, transclude: "element", compile: function (tElement, tAttrs, $transclude) {
                return function (scope, $element, attrs) {
                    function cleanupLastView() {
                        previousEl && (previousEl.remove(), previousEl = null), currentScope && (currentScope.$destroy(), currentScope = null), currentEl && (renderer.leave(currentEl, function () {
                            previousEl = null
                        }), previousEl = currentEl, currentEl = null)
                    }
                    function updateView(firstTime) {
                        var newScope, name = getUiViewName(scope, attrs, $element, $interpolate), previousLocals = name && $state.$current && $state.$current.locals[name];
                        if (firstTime || previousLocals !== latestLocals) {
                            newScope = scope.$new(), latestLocals = $state.$current.locals[name];
                            var clone = $transclude(newScope, function (clone) {
                                renderer.enter(clone, $element, function () {
                                    currentScope && currentScope.$emit("$viewContentAnimationEnded"), (angular.isDefined(autoScrollExp) && !autoScrollExp || scope.$eval(autoScrollExp)) && $uiViewScroll(clone)
                                }), cleanupLastView()
                            });
                            currentEl = clone, currentScope = newScope, currentScope.$emit("$viewContentLoaded"), currentScope.$eval(onloadExp)
                        }
                    }
                    var previousEl, currentEl, currentScope, latestLocals, onloadExp = attrs.onload || "", autoScrollExp = attrs.autoscroll, renderer = getRenderer(attrs, scope);
                    scope.$on("$stateChangeSuccess", function () {
                        updateView(!1)
                    }), scope.$on("$viewContentLoading", function () {
                        updateView(!1)
                    }), updateView(!0)
                }
            }};
        return directive
    }
    function $ViewDirectiveFill($compile, $controller, $state, $interpolate) {
        return{restrict: "ECA", priority: -400, compile: function (tElement) {
                var initial = tElement.html();
                return function (scope, $element, attrs) {
                    var current = $state.$current, name = getUiViewName(scope, attrs, $element, $interpolate), locals = current && current.locals[name];
                    if (locals) {
                        $element.data("$uiView", {name: name, state: locals.$$state}), $element.html(locals.$template ? locals.$template : initial);
                        var link = $compile($element.contents());
                        if (locals.$$controller) {
                            locals.$scope = scope;
                            var controller = $controller(locals.$$controller, locals);
                            locals.$$controllerAs && (scope[locals.$$controllerAs] = controller), $element.data("$ngControllerController", controller), $element.children().data("$ngControllerController", controller)
                        }
                        link(scope)
                    }
                }
            }}
    }
    function getUiViewName(scope, attrs, element, $interpolate) {
        var name = $interpolate(attrs.uiView || attrs.name || "")(scope), inherited = element.inheritedData("$uiView");
        return name.indexOf("@") >= 0 ? name : name + "@" + (inherited ? inherited.state.name : "")
    }
    function parseStateRef(ref, current) {
        var parsed, preparsed = ref.match(/^\s*({[^}]*})\s*$/);
        if (preparsed && (ref = current + "(" + preparsed[1] + ")"), parsed = ref.replace(/\n/g, " ").match(/^([^(]+?)\s*(\((.*)\))?$/), !parsed || 4 !== parsed.length)
            throw new Error("Invalid state ref '" + ref + "'");
        return{state: parsed[1], paramExpr: parsed[3] || null}
    }
    function stateContext(el) {
        var stateData = el.parent().inheritedData("$uiView");
        return stateData && stateData.state && stateData.state.name ? stateData.state : void 0
    }
    function $StateRefDirective($state, $timeout) {
        var allowedOptions = ["location", "inherit", "reload"];
        return{restrict: "A", require: ["?^uiSrefActive", "?^uiSrefActiveEq"], link: function (scope, element, attrs, uiSrefActive) {
                var ref = parseStateRef(attrs.uiSref, $state.current.name), params = null, base = stateContext(element) || $state.$current, newHref = null, isAnchor = "A" === element.prop("tagName"), isForm = "FORM" === element[0].nodeName, attr = isForm ? "action" : "href", nav = !0, options = {relative: base, inherit: !0}, optionsOverride = scope.$eval(attrs.uiSrefOpts) || {};
                angular.forEach(allowedOptions, function (option) {
                    option in optionsOverride && (options[option] = optionsOverride[option])
                });
                var update = function (newVal) {
                    if (newVal && (params = angular.copy(newVal)), nav) {
                        newHref = $state.href(ref.state, params, options);
                        var activeDirective = uiSrefActive[1] || uiSrefActive[0];
                        return activeDirective && activeDirective.$$setStateInfo(ref.state, params), null === newHref ? (nav = !1, !1) : void attrs.$set(attr, newHref)
                    }
                };
                ref.paramExpr && (scope.$watch(ref.paramExpr, function (newVal) {
                    newVal !== params && update(newVal)
                }, !0), params = angular.copy(scope.$eval(ref.paramExpr))), update(), isForm || element.bind("click", function (e) {
                    var button = e.which || e.button;
                    if (!(button > 1 || e.ctrlKey || e.metaKey || e.shiftKey || element.attr("target"))) {
                        var transition = $timeout(function () {
                            $state.go(ref.state, params, options)
                        });
                        e.preventDefault();
                        var ignorePreventDefaultCount = isAnchor && !newHref ? 1 : 0;
                        e.preventDefault = function () {
                            ignorePreventDefaultCount-- <= 0 && $timeout.cancel(transition)
                        }
                    }
                })
            }}
    }
    function $StateRefActiveDirective($state, $stateParams, $interpolate) {
        return{restrict: "A", controller: ["$scope", "$element", "$attrs", function ($scope, $element, $attrs) {
                    function update() {
                        isMatch() ? $element.addClass(activeClass) : $element.removeClass(activeClass)
                    }
                    function isMatch() {
                        return"undefined" != typeof $attrs.uiSrefActiveEq ? state && $state.is(state.name, params) : state && $state.includes(state.name, params)
                    }
                    var state, params, activeClass;
                    activeClass = $interpolate($attrs.uiSrefActiveEq || $attrs.uiSrefActive || "", !1)($scope), this.$$setStateInfo = function (newState, newParams) {
                        state = $state.get(newState, stateContext($element)), params = newParams, update()
                    }, $scope.$on("$stateChangeSuccess", update)
                }]}
    }
    function $IsStateFilter($state) {
        var isFilter = function (state) {
            return $state.is(state)
        };
        return isFilter.$stateful = !0, isFilter
    }
    function $IncludedByStateFilter($state) {
        var includesFilter = function (state) {
            return $state.includes(state)
        };
        return includesFilter.$stateful = !0, includesFilter
    }
    var isDefined = angular.isDefined, isFunction = angular.isFunction, isString = angular.isString, isObject = angular.isObject, isArray = angular.isArray, forEach = angular.forEach, extend = angular.extend, copy = angular.copy;
    angular.module("ui.router.util", ["ng"]), angular.module("ui.router.router", ["ui.router.util"]), angular.module("ui.router.state", ["ui.router.router", "ui.router.util"]), angular.module("ui.router", ["ui.router.state"]), angular.module("ui.router.compat", ["ui.router"]), $Resolve.$inject = ["$q", "$injector"], angular.module("ui.router.util").service("$resolve", $Resolve), $TemplateFactory.$inject = ["$http", "$templateCache", "$injector"], angular.module("ui.router.util").service("$templateFactory", $TemplateFactory);
    var $$UMFP;
    UrlMatcher.prototype.concat = function (pattern, config) {
        var defaultConfig = {caseInsensitive: $$UMFP.caseInsensitive(), strict: $$UMFP.strictMode(), squash: $$UMFP.defaultSquashPolicy()};
        return new UrlMatcher(this.sourcePath + pattern + this.sourceSearch, extend(defaultConfig, config), this)
    }, UrlMatcher.prototype.toString = function () {
        return this.source
    }, UrlMatcher.prototype.exec = function (path, searchParams) {
        function decodePathArray(string) {
            function reverseString(str) {
                return str.split("").reverse().join("")
            }
            function unquoteDashes(str) {
                return str.replace(/\\-/, "-")
            }
            var split = reverseString(string).split(/-(?!\\)/), allReversed = map(split, reverseString);
            return map(allReversed, unquoteDashes).reverse()
        }
        var m = this.regexp.exec(path);
        if (!m)
            return null;
        searchParams = searchParams || {};
        var i, j, paramName, paramNames = this.parameters(), nTotal = paramNames.length, nPath = this.segments.length - 1, values = {};
        if (nPath !== m.length - 1)
            throw new Error("Unbalanced capture group in route '" + this.source + "'");
        for (i = 0; nPath > i; i++) {
            paramName = paramNames[i];
            var param = this.params[paramName], paramVal = m[i + 1];
            for (j = 0; j < param.replace; j++)
                param.replace[j].from === paramVal && (paramVal = param.replace[j].to);
            paramVal && param.array === !0 && (paramVal = decodePathArray(paramVal)), values[paramName] = param.value(paramVal)
        }
        for (; nTotal > i; i++)
            paramName = paramNames[i], values[paramName] = this.params[paramName].value(searchParams[paramName]);
        return values
    }, UrlMatcher.prototype.parameters = function (param) {
        return isDefined(param) ? this.params[param] || null : this.$$paramNames
    }, UrlMatcher.prototype.validates = function (params) {
        return this.params.$$validates(params)
    }, UrlMatcher.prototype.format = function (values) {
        function encodeDashes(str) {
            return encodeURIComponent(str).replace(/-/g, function (c) {
                return"%5C%" + c.charCodeAt(0).toString(16).toUpperCase()
            })
        }
        values = values || {};
        var segments = this.segments, params = this.parameters(), paramset = this.params;
        if (!this.validates(values))
            return null;
        var i, search = !1, nPath = segments.length - 1, nTotal = params.length, result = segments[0];
        for (i = 0; nTotal > i; i++) {
            var isPathParam = nPath > i, name = params[i], param = paramset[name], value = param.value(values[name]), isDefaultValue = param.isOptional && param.type.equals(param.value(), value), squash = isDefaultValue ? param.squash : !1, encoded = param.type.encode(value);
            if (isPathParam) {
                var nextSegment = segments[i + 1];
                if (squash === !1)
                    null != encoded && (result += isArray(encoded) ? map(encoded, encodeDashes).join("-") : encodeURIComponent(encoded)), result += nextSegment;
                else if (squash === !0) {
                    var capture = result.match(/\/$/) ? /\/?(.*)/ : /(.*)/;
                    result += nextSegment.match(capture)[1]
                } else
                    isString(squash) && (result += squash + nextSegment)
            } else {
                if (null == encoded || isDefaultValue && squash !== !1)
                    continue;
                isArray(encoded) || (encoded = [encoded]), encoded = map(encoded, encodeURIComponent).join("&" + name + "="), result += (search ? "&" : "?") + (name + "=" + encoded), search = !0
            }
        }
        return result
    }, Type.prototype.is = function () {
        return!0
    }, Type.prototype.encode = function (val) {
        return val
    }, Type.prototype.decode = function (val) {
        return val
    }, Type.prototype.equals = function (a, b) {
        return a == b
    }, Type.prototype.$subPattern = function () {
        var sub = this.pattern.toString();
        return sub.substr(1, sub.length - 2)
    }, Type.prototype.pattern = /.*/, Type.prototype.toString = function () {
        return"{Type:" + this.name + "}"
    }, Type.prototype.$asArray = function (mode, isSearch) {
        function ArrayType(type, mode) {
            function bindTo(type, callbackName) {
                return function () {
                    return type[callbackName].apply(type, arguments)
                }
            }
            function arrayWrap(val) {
                return isArray(val) ? val : isDefined(val) ? [val] : []
            }
            function arrayUnwrap(val) {
                switch (val.length) {
                    case 0:
                        return undefined;
                    case 1:
                        return"auto" === mode ? val[0] : val;
                    default:
                        return val
                    }
            }
            function falsey(val) {
                return!val
            }
            function arrayHandler(callback, allTruthyMode) {
                return function (val) {
                    val = arrayWrap(val);
                    var result = map(val, callback);
                    return allTruthyMode === !0 ? 0 === filter(result, falsey).length : arrayUnwrap(result)
                }
            }
            function arrayEqualsHandler(callback) {
                return function (val1, val2) {
                    var left = arrayWrap(val1), right = arrayWrap(val2);
                    if (left.length !== right.length)
                        return!1;
                    for (var i = 0; i < left.length; i++)
                        if (!callback(left[i], right[i]))
                            return!1;
                    return!0
                }
            }
            this.encode = arrayHandler(bindTo(type, "encode")), this.decode = arrayHandler(bindTo(type, "decode")), this.is = arrayHandler(bindTo(type, "is"), !0), this.equals = arrayEqualsHandler(bindTo(type, "equals")), this.pattern = type.pattern, this.$arrayMode = mode
        }
        if (!mode)
            return this;
        if ("auto" === mode && !isSearch)
            throw new Error("'auto' array mode is for query parameters only");
        return new ArrayType(this, mode)
    }, angular.module("ui.router.util").provider("$urlMatcherFactory", $UrlMatcherFactory), angular.module("ui.router.util").run(["$urlMatcherFactory", function () {
        }]), $UrlRouterProvider.$inject = ["$locationProvider", "$urlMatcherFactoryProvider"], angular.module("ui.router.router").provider("$urlRouter", $UrlRouterProvider), $StateProvider.$inject = ["$urlRouterProvider", "$urlMatcherFactoryProvider"], angular.module("ui.router.state").value("$stateParams", {}).provider("$state", $StateProvider), $ViewProvider.$inject = [], angular.module("ui.router.state").provider("$view", $ViewProvider), angular.module("ui.router.state").provider("$uiViewScroll", $ViewScrollProvider), $ViewDirective.$inject = ["$state", "$injector", "$uiViewScroll", "$interpolate"], $ViewDirectiveFill.$inject = ["$compile", "$controller", "$state", "$interpolate"], angular.module("ui.router.state").directive("uiView", $ViewDirective), angular.module("ui.router.state").directive("uiView", $ViewDirectiveFill), $StateRefDirective.$inject = ["$state", "$timeout"], $StateRefActiveDirective.$inject = ["$state", "$stateParams", "$interpolate"], angular.module("ui.router.state").directive("uiSref", $StateRefDirective).directive("uiSrefActive", $StateRefActiveDirective).directive("uiSrefActiveEq", $StateRefActiveDirective), $IsStateFilter.$inject = ["$state"], $IncludedByStateFilter.$inject = ["$state"], angular.module("ui.router.state").filter("isState", $IsStateFilter).filter("includedByState", $IncludedByStateFilter)
}(window, window.angular);
var app = angular.module("application", ["ui.router", "ngAnimate", "markdown", "foundation.init", "foundation.init.state", "foundation.common.services", "foundation.common.directives", "foundation.common.animations", "foundation.accordion", "foundation.actionsheet", "foundation.interchange", "foundation.modal", "foundation.notification", "foundation.offcanvas", "foundation.panel", "foundation.popup", "foundation.tabs", "foundation.iconic"]).config(["$FoundationStateProvider", "$urlRouterProvider", "$locationProvider", function (FoundationStateProvider, $urlProvider, $locationProvider) {
        $urlProvider.otherwise("/"), FoundationStateProvider.registerDynamicRoutes(), $locationProvider.html5Mode({enabled: !1, requireBase: !1}), $locationProvider.hashPrefix("!")
    }]).run(["FoundationInit", "$rootScope", "$state", "$stateParams", function (foundationInit, $rootScope, $state, $stateParams) {
        foundationInit.init(), $rootScope.$state = $state, $rootScope.$stateParams = $stateParams
    }]);
angular.module("application").controller("DefaultController", ["$scope", "$stateParams", "$state", function ($scope, $stateParams, $state) {
        var params = [];
        angular.forEach($stateParams, function (value, key) {
            params[key] = value
        }), $scope.params = params, $scope.current = $state.current.name, $state.current.views ? ($scope.vars = $state.current.data.vars, $scope.composed = $state.current.data.vars.children) : $scope.vars = $state.current.data.vars
    }]), angular.module("application").controller("MainController", ["$scope", "$state", function ($scope, $state) {
        $scope.current = $state.current.name
    }]), angular.module("application").controller("MotionUIController", ["$scope", "$state", "FoundationApi", "$animate", function ($scope, $state, FoundationApi, $animate) {
        $scope.current = $state.current.name, $scope.element = {}, $scope.transitions = [{direction: "enter", type: "Slide", classes: ["slideInFromTop", "slideInFromBottom", "slideInFromRight", "slideInFromLeft"]}, {direction: "leave", type: "Slide", classes: ["slideOutFromTop", "slideOutFromBottom", "slideOutFromRight", "slideOutFromLeft"]}, {direction: "enter", type: "Fade", classes: ["fadeIn"]}, {direction: "leave", type: "Fade", classes: ["fadeOut"]}, {direction: "enter", type: "Hinge", classes: ["hingeInFromTop", "hingeInFromBottom", "hingeInFromRight", "hingeInFromLeft", "hingeInFromMiddleX", "hingeInFromMiddleY"]}, {direction: "leave", type: "Hinge", classes: ["hingeOutFromTop", "hingeOutFromBottom", "hingeOutFromRight", "hingeOutFromLeft", "hingeOutFromMiddleX", "hingeOutFromMiddleY"]}, {direction: "enter", type: "Scale", classes: ["zoomIn"]}, {direction: "leave", type: "Scale", classes: ["zoomOut"]}, {direction: "enter", type: "Spin", classes: ["spinIn", "spinInCCW"]}, {direction: "leave", type: "Spin", classes: ["spinOut", "spinOutCCW"]}], $scope.update = function () {
            var kitty = angular.element('<img id="#demo-card" src="http://placekitten.com/g/600/300" />'), demoElementParent = angular.element(document.querySelector("#demo-card-parent")), animationClasses = "";
            for (prop in $scope.element)
                "default" !== $scope.element[prop] && "undefined" !== $scope.element[prop] && (animationClasses += $scope.element[prop] + " ");
            kitty.addClass(animationClasses), "enter" === $scope.animationFilter ? $scope.animateEnter(kitty, demoElementParent, animationClasses) : ($animate.enter(kitty, demoElementParent), $animate.leave(kitty))
        }, $scope.animateEnter = function (element, parentElement, classes) {
            $animate.enter(element, parentElement).then(function () {
                element.removeClass(classes), $animate.leave(element)
            })
        }
    }]);
angular.module("foundation.common.animations", ["ngAnimate"]), angular.module("foundation.common.animations").animation(".ui-animation", ["$state", "$rootScope", function ($state, $rootScope) {
        var events = ["webkitAnimationEnd", "mozAnimationEnd", "MSAnimationEnd", "oanimationend", "animationend", "webkitTransitionEnd", "otransitionend", "transitionend"], parentStyle = "position-absolute";
        return{enter: function (element, done) {
                var scope = element.scope();
                if (scope.vars && scope.vars.animationIn) {
                    var animationIn = scope.vars.animationIn, animationOut = scope.vars.animationOut || "", initial = "ng-enter", activate = "ng-enter-active";
                    element.parent().addClass(parentStyle), element.removeClass(activate + " " + initial + " " + animationIn + " " + animationOut), element[0].style.transitionDuration = 0, element.addClass(animationIn), element.addClass(initial), $rootScope.$digest(), element[0].style.transitionDuration = "", element.addClass(activate), element.one(events.join(" "), function () {
                        element.parent().removeClass(parentStyle), element.removeClass(activate + " " + initial + " " + animationIn + " " + animationOut), done()
                    })
                } else
                    done();
                return function () {
                }
            }, leave: function (element, done) {
                var scope = element.scope();
                if (scope.vars && scope.vars.animationOut) {
                    var animationIn = scope.vars.animationIn || "", animationOut = scope.vars.animationOut, initial = "ng-leave", activate = "ng-leave-active";
                    element.removeClass(activate + " " + initial + " " + animationIn + " " + animationOut), element[0].style.transitionDuration = 0, element.addClass(animationOut), element.addClass(initial), $rootScope.$digest(), element[0].style.transitionDuration = "", element.addClass(activate), element.one(events.join(" "), function () {
                        element.removeClass(activate + " " + initial + " " + animationIn + " " + animationOut), element.parent().removeClass(parentStyle), done()
                    })
                } else
                    done();
                return function () {
                }
            }}
    }]);
angular.module("foundation.common.directives", []), angular.module("foundation.common.directives").directive("zfClose", ["FoundationApi", function (foundationApi) {
        return{restrict: "A", link: function (scope, element) {
                for (var parentElement = !1, tempElement = element.parent(); parentElement === !1; )
                    "BODY" == tempElement[0].nodeName && (parentElement = ""), "undefined" != typeof tempElement.attr("zf-closable") && tempElement.attr("zf-closable") !== !1 && (parentElement = tempElement), tempElement = tempElement.parent();
                element.on("click", function (e) {
                    foundationApi.publish(parentElement.attr("id"), "close"), e.preventDefault()
                })
            }}
    }]), angular.module("foundation.common.directives").directive("zfOpen", ["FoundationApi", function (foundationApi) {
        return{restrict: "A", link: function (scope, element, attrs) {
                element.on("click", function (e) {
                    foundationApi.publish(attrs.zfOpen, "open"), e.preventDefault()
                })
            }}
    }]), angular.module("foundation.common.directives").directive("zfToggle", ["FoundationApi", function (foundationApi) {
        return{restrict: "A", link: function (scope, element, attrs) {
                element.on("click", function (e) {
                    foundationApi.publish(attrs.zfToggle, "toggle"), e.preventDefault()
                })
            }}
    }]), angular.module("foundation.common.directives").directive("zfAnimate", ["FoundationApi", function (foundationApi) {
        return{restrict: "A", priority: 100, link: function (scope, element, attrs) {
                var isActive = !1, animationIn = attrs.animationIn, animationOut = attrs.animationOut, activeClass = "is-active", reflow = function () {
                    return element[0].offsetWidth
                }, reset = function () {
                    element[0].style.transitionDuration = 0, element.removeClass(activeClass + " " + animationIn + " " + animationOut)
                }, animate = function (animationClass, activation) {
                    reset(), element.addClass(animationClass), reflow(), element[0].style.transitionDuration = "", element.addClass(activeClass), isActive = activation
                };
                foundationApi.subscribe(attrs.id, function (msg) {
                    if ("show" === msg || "open" === msg)
                        animate(animationIn, !0);
                    else if ("hide" === msg || "close" === msg)
                        animate(animationOut, !1);
                    else if ("toggle" === msg) {
                        var newState = !isActive, newAnimation = newState ? animationIn : animationOut;
                        setTimeout(function () {
                            animate(newAnimation, newState)
                        }, 1)
                    }
                })
            }}
    }]);
angular.module("foundation.common.services", []), angular.module("foundation.common.services").service("FoundationApi", function () {
    var listeners = [], settings = {}, uniqueIds = [];
    return{subscribe: function (name, callback) {
            return listeners[name] || (listeners[name] = []), listeners[name].push(callback), !0
        }, publish: function (name, msg) {
            listeners[name] || (listeners[name] = []), listeners[name].forEach(function (cb) {
                cb(msg)
            })
        }, getSettings: function () {
            return settings
        }, modifySettings: function (tree) {
            return settings = angular.extend(settings, tree)
        }, generateUuid: function () {
            var uuid = "";
            do {
                uuid += "zf-uuid-";
                for (var i = 0; 15 > i; i++)
                    uuid += Math.floor(16 * Math.random()).toString(16)
            } while (!uniqueIds.indexOf(uuid));
            return uniqueIds.push(uuid), uuid
        }, toggleAnimation: function (element, futureState) {
            var activeClass = "is-active";
            futureState ? element.addClass(activeClass) : element.removeClass(activeClass)
        }, animate: function (element, futureState, animationIn, animationOut) {
            var initClasses = ["ng-enter", "ng-leave"], activeClasses = ["ng-enter-active", "ng-leave-active"], activeGenericClass = "is-active", events = ["webkitAnimationEnd", "mozAnimationEnd", "MSAnimationEnd", "oanimationend", "animationend", "webkitTransitionEnd", "otransitionend", "transitionend"], reflow = function () {
                return element[0].offsetWidth
            }, reset = function () {
                element[0].style.transitionDuration = 0, element.removeClass(initClasses.join(" ") + " " + activeClasses.join(" ") + " " + animationIn + " " + animationOut)
            }, animate = function (animationClass, activation) {
                var initClass = activation ? initClasses[0] : initClasses[1], activeClass = activation ? activeClasses[0] : activeClasses[1];
                reset(), element.addClass(animationClass), element.addClass(initClass), element.addClass(activeGenericClass), reflow(), element[0].style.transitionDuration = "", element.addClass(activeClass), element.one(events.join(" "), function () {
                    reset(), element.removeClass(activation ? "" : activeGenericClass), reflow()
                })
            };
            animate(futureState ? animationIn : animationOut, futureState)
        }}
}), angular.module("foundation.common.services").filter("prepareRoute", function () {
    return function (input) {
        return"route-" + input.replace(/\./, "-").toLowerCase()
    }
}), angular.module("foundation.common.services").factory("Utils", function () {
    return{prepareRoute: function (input) {
            return"route-" + input.replace(/\./, "-").toLowerCase()
        }, throttle: function (func, delay) {
            var timer = null;
            return function () {
                var context = this, args = arguments;
                null === timer && (timer = setTimeout(function () {
                    func.apply(context, args), timer = null
                }, delay))
            }
        }}
});
angular.module("foundation.init", ["foundation.common.services"]), angular.module("foundation.init").factory("FoundationInit", ["helpers", "FoundationApi", "Utils", function (helpers, foundationApi, u) {
        return{init: function () {
                var mediaQueries, extractedMedia;
                helpers.headerHelper(["foundation-mq"]), extractedMedia = helpers.getStyle(".foundation-mq", "font-family"), mediaQueries = helpers.processStyleToJSON(extractedMedia);
                for (var key in mediaQueries)
                    mediaQueries[key] = "only screen and (min-width: " + mediaQueries[key].replace("rem", "em") + ")";
                foundationApi.modifySettings({media_queries: mediaQueries}), window.addEventListener("resize", u.throttle(function () {
                    foundationApi.publish("resize", "window resized")
                }, 50))
            }}
    }]), angular.module("foundation.init").factory("helpers", function () {
    return{headerHelper: function (classArray) {
            for (var i = classArray.length, head = angular.element(document.querySelectorAll("head")); i--; )
                head.append('<meta class="' + classArray[i] + '" />')
        }, getStyle: function (selector) {
            var elem = document.querySelectorAll(selector)[0], style = window.getComputedStyle(elem, null);
            return style.getPropertyValue("font-family")
        }, processStyleToJSON: function (str) {
            var clean = str.replace(/\'/g, "");
            return JSON.parse('"' === clean[0] && '"' === clean[clean.length - 1] ? clean.slice(1, -1) : clean)
        }}
}), angular.module("foundation.init.state", ["ui.router"]).provider("$FoundationState", ["$stateProvider", function ($stateProvider) {
        var complexViews = {};
        this.registerDynamicRoutes = function (routes) {
            var dynamicRoutes = routes || foundationRoutes;
            angular.forEach(dynamicRoutes, function (page) {
                if (page.hasComposed === !0)
                    angular.isDefined(complexViews[page.parent]) || (complexViews[page.parent] = {children: {}}), complexViews[page.parent].children[page.name] = page;
                else if (page.composed === !0)
                    angular.isDefined(complexViews[page.name]) || (complexViews[page.name] = {children: {}}), angular.extend(complexViews[page.name], page);
                else {
                    var state = {url: page.url, templateUrl: page.path, parent: page.parent || "", controller: page.controller || "DefaultController", data: {vars: page}};
                    $stateProvider.state(page.name, state)
                }
            }), angular.forEach(complexViews, function (page) {
                var state = {url: page.url, parent: page.parent || "", data: {vars: page}, views: {"": {templateUrl: page.path, controller: page.controller || "DefaultController"}}};
                angular.forEach(page.children, function (sub) {
                    state.views[sub.name + "@" + page.name] = {templateUrl: sub.path, controller: page.controller || "DefaultController"}
                }), $stateProvider.state(page.name, state)
            })
        }, this.$get = function () {
            return{}
        }
    }]);
angular.module("foundation.accordion", []), angular.module("foundation.accordion").controller("ZfAccordionController", ["$scope", function ($scope) {
        {
            var controller = this, sections = controller.sections = $scope.sections = [];
            controller.multiOpen = !1
        }
        controller.select = function (selectSection) {
            sections.forEach(function (section) {
                controller.multiOpen ? section.scope === selectSection && (section.scope.active = !section.scope.active) : (section.scope.active = !1, section.scope === selectSection && (section.scope.active = !0))
            })
        }, controller.addSection = function (sectionScope) {
            sections.push({scope: sectionScope}), 1 === sections.length && (sections[0].active = !0)
        }, controller.closeAll = function () {
            sections.forEach(function (section) {
                section.scope.active = !1
            })
        }
    }]), angular.module("foundation.accordion").directive("zfAccordion", function () {
    return{restrict: "EA", transclude: "true", replace: !0, templateUrl: "partials/accordion.html", controller: "ZfAccordionController", scope: {multiOpen: "@"}, link: function (scope, element, attrs, controller) {
            controller.multiOpen = scope.multiOpen
        }}
}), angular.module("foundation.accordion").directive("zfAccordionItem", function () {
    return{restrict: "EA", templateUrl: "partials/accordion-item.html", transclude: !0, scope: {title: "@"}, require: "^zfAccordion", replace: !0, controller: function () {
        }, link: function (scope, element, attrs, controller) {
            scope.active = !1, controller.addSection(scope), scope.activate = function () {
                controller.select(scope)
            }
        }}
});
angular.module("foundation.actionsheet", ["foundation.common.services"]), angular.module("foundation.actionsheet").controller("ZfActionSheetController", ["$scope", "FoundationApi", function ($scope) {
        var controller = this, content = controller.content = $scope.content;
        controller.registerContent = function (scope) {
            content = scope, content.active = !1
        }, controller.toggle = function () {
            content.toggle(), content.$apply()
        }, controller.hide = function () {
            content.hide(), content.$apply()
        }
    }]), angular.module("foundation.actionsheet").directive("zfActionSheet", ["FoundationApi", function (foundationApi) {
        return{restrict: "A", transclude: !0, replace: !0, templateUrl: "partials/actionsheet.html", controller: "ZfActionSheetController", compile: function () {
                return{pre: function (scope, iElement, iAttrs) {
                        iAttrs.$set("zf-closable", "actionsheet")
                    }, post: function (scope, element, attrs, controller) {
                        foundationApi.subscribe(attrs.id, function (msg) {
                            "toggle" == msg && controller.toggle(), ("hide" === msg || "close" === msg) && controller.hide()
                        })
                    }}
            }}
    }]), angular.module("foundation.actionsheet").directive("zfAsContent", ["FoundationApi", function () {
        return{restrict: "EA", transclude: !0, replace: !0, templateUrl: "partials/actionsheet-content.html", require: "^zfActionSheet", scope: {position: "@?"}, link: function (scope, element, attrs, controller) {
                scope.active = !1, scope.position = scope.position || "bottom", controller.registerContent(scope), scope.toggle = function () {
                    scope.active = !scope.active
                }, scope.hide = function () {
                    scope.active = !1
                }
            }}
    }]), angular.module("foundation.actionsheet").directive("zfAsButton", ["FoundationApi", function () {
        return{restrict: "EA", transclude: !0, replace: !0, templateUrl: "partials/actionsheet-button.html", require: "^zfActionSheet", scope: {title: "@?"}, link: function (scope, element, attrs, controller) {
                element.on("click", function (e) {
                    controller.toggle(), e.preventDefault()
                })
            }}
    }]);
angular.module("foundation.iconic", []), angular.module("foundation.iconic").service("Iconic", function () {
    var iconic = IconicJS();
    return{getAccess: function () {
            return iconic
        }}
}), angular.module("foundation.iconic").directive("zfIconic", ["Iconic", function (iconic) {
        return{restrict: "A", link: function (scope, element) {
                var ico = iconic.getAccess();
                ico.inject(element[0])
            }}
    }]);
angular.module("foundation.interchange", ["foundation.common.services"]), angular.module("foundation.interchange").directive("zfInterchange", ["FoundationApi", "$compile", "$http", "$templateCache", "$animate", function (foundationApi, $compile, $http, $templateCache) {
        var templateLoader = function (templateUrl) {
            return $http.get(templateUrl, {cache: $templateCache})
        };
        return{restrict: "EA", transclude: "element", scope: {position: "@"}, replace: !0, template: "<div></div>", link: function (scope, element, attrs, ctrl, transclude) {
                var childScope, current, scenarios, innerTemplates, named_queries = {"default": "only screen", landscape: "only screen and (orientation: landscape)", portrait: "only screen and (orientation: portrait)", retina: "only screen and (-webkit-min-device-pixel-ratio: 2),only screen and (min--moz-device-pixel-ratio: 2),only screen and (-o-min-device-pixel-ratio: 2/1),only screen and (min-device-pixel-ratio: 2),only screen and (min-resolution: 192dpi),only screen and (min-resolution: 2dppx)"}, globalQueries = foundationApi.getSettings().media_queries;
                named_queries = angular.extend(named_queries, globalQueries);
                var matched = function () {
                    var count = scenarios.length, matches = [];
                    if (count > 0)
                        for (; count--; ) {
                            var mq, rule = scenarios[count].media;
                            mq = matchMedia(named_queries[rule] ? named_queries[rule] : rule), mq.matches && matches.push({ind: count})
                        }
                    return matches
                }, collectInformation = function (parentElement) {
                    scenarios = [], innerTemplates = [];
                    var elements = parentElement.children(), i = 0;
                    angular.forEach(elements, function (el) {
                        var elem = angular.element(el);
                        elem.attr("src") ? scenarios[i] = {media: elem.attr("media"), src: elem.attr("src")} : (innerTemplates[i] = elem, scenarios[i] = {media: elem.attr("media"), templ: i}), i++
                    })
                }, checkScenario = function (scenario) {
                    return!current || scenario.src !== current.src || scenario.templ && scenario.templ !== current.templ
                };
                foundationApi.subscribe("resize", function () {
                    transclude(function (clone, newScope) {
                        scope.scenarios && scope.innerTemplates || collectInformation(clone);
                        var ruleMatches = matched(), scenario = 0 === ruleMatches.length ? null : scenarios[ruleMatches[0].ind];
                        if (scenario && checkScenario(scenario)) {
                            if (childScope && (childScope.$destroy(), childScope = null), null !== scenario.templ)
                                childScope = newScope, element.html(innerTemplates[scenario.templ].html()), $compile(element.contents())(childScope), current = scenario;
                            else {
                                var loader = templateLoader(scenario.src);
                                loader.success(function (html) {
                                    childScope = newScope, element.html(html)
                                }).then(function () {
                                    $compile(element.contents())(childScope), current = scenario
                                })
                            }
                        }
                    })
                }), foundationApi.publish("resize", "initial resize")
            }}
    }]);
angular.module("foundation.modal", ["foundation.common.services"]), angular.module("foundation.modal").directive("zfModal", ["FoundationApi", function (foundationApi) {
        return{restrict: "EA", templateUrl: "partials/modal.html", transclude: !0, scope: {overlay: "@", overlayClose: "@"}, replace: !0, compile: function () {
                var type = "modal";
                return{pre: function (scope, iElement, iAttrs) {
                        iAttrs.$set("zf-closable", type)
                    }, post: function (scope, element, attrs) {
                        var dialog = angular.element(element.children()[0]);
                        scope.active = !1, scope.overlay = scope.overlay || scope.overlayClose || !1, scope.overlayClose = scope.overlayClose || !1;
                        var animationIn = attrs.animationIn || "fadeIn", animationOut = attrs.animationOut || "fadeOut", overlayIn = "fadeIn", overlayOut = "fadeOut";
                        foundationApi.subscribe(attrs.id, function (msg) {
                            "show" == msg || "open" == msg ? scope.show() : "close" == msg || "hide" == msg ? scope.hide() : "toggle" == msg && scope.toggle(), scope.$apply()
                        });
                        var animate = function () {
                            scope.overlay ? (foundationApi.animate(element, scope.active, overlayIn, overlayOut), foundationApi.animate(dialog, scope.active, animationIn, animationOut)) : foundationApi.animate(element, scope.active, overlayIn, overlayOut)
                        };
                        scope.hide = function () {
                            scope.active = !1, animate()
                        }, scope.show = function () {
                            scope.active = !0, animate()
                        }, scope.toggle = function () {
                            scope.active = !scope.active, animate()
                        }
                    }}
            }}
    }]);
angular.module("foundation.notification", ["foundation.common.services"]), angular.module("foundation.notification").controller("ZfNotificationController", ["$scope", "FoundationApi", function ($scope, foundationApi) {
        var controller = this, notifications = controller.notifications = $scope.notifications = [];
        controller.addNotification = function (info) {
            var id = foundationApi.generateUuid();
            info.id = id, notifications.push(info)
        }, controller.removeNotification = function (id) {
            notifications.forEach(function (notification) {
                if (notification.id === id) {
                    var ind = notifications.indexOf(notification);
                    notifications.splice(ind, 1)
                }
            })
        }, controller.clearAll = function () {
            notifications = []
        }
    }]), angular.module("foundation.notification").directive("zfNotificationSet", ["FoundationApi", function (foundationApi) {
        return{restrict: "EA", templateUrl: "partials/notification-set.html", controller: "ZfNotificationController", scope: !0, link: function (scope, element, attrs, controller) {
                foundationApi.subscribe(attrs.id, function (msg) {
                    "clearall" === msg ? controller.clearAll() : controller.addNotification(msg), scope.$apply()
                })
            }}
    }]), angular.module("foundation.notification").directive("zfNotification", ["FoundationApi", function (foundationApi) {
        return{restrict: "EA", templateUrl: "partials/notification.html", replace: !0, transclude: !0, require: "^zfNotificationSet", controller: function () {
            }, scope: {title: "=?", content: "=?", image: "=?", notifId: "=", position: "=?", color: "=?"}, compile: function () {
                return{pre: function (scope, iElement, iAttrs) {
                        iAttrs.$set("zf-closable", "notification")
                    }, post: function (scope, element, attrs, controller) {
                        scope.active = !1, scope.position = scope.position ? scope.position.split(" ").join("-") : "top-right";
                        var animationIn = attrs.animationIn || "fadeIn", animationOut = attrs.animationOut || "fadeOut";
                        setTimeout(function () {
                            scope.active = !0, foundationApi.animate(element, scope.active, animationIn, animationOut)
                        }, 50), scope.remove = function () {
                            scope.active = !1, foundationApi.animate(element, scope.active, animationIn, animationOut), setTimeout(function () {
                                controller.removeNotification(scope.notifId)
                            }, 50)
                        }
                    }}
            }}
    }]), angular.module("foundation.notification").directive("zfNotificationStatic", ["FoundationApi", function (foundationApi) {
        return{restrict: "EA", templateUrl: "partials/notification.html", replace: !0, transclude: !0, scope: {title: "@?", content: "@?", image: "@?", position: "@?", color: "@?"}, compile: function () {
                var type = "notification";
                return{pre: function (scope, iElement, iAttrs) {
                        iAttrs.$set("zf-closable", type)
                    }, post: function (scope, element, attrs) {
                        scope.position = scope.position ? scope.position.split(" ").join("-") : "top-right";
                        var animationIn = attrs.animationIn || "fadeIn", animationOut = attrs.animationOut || "fadeOut";
                        foundationApi.subscribe(attrs.id, function (msg) {
                            "show" == msg || "open" == msg ? scope.show() : "close" == msg || "hide" == msg ? scope.hide() : "toggle" == msg && scope.toggle(), scope.$apply()
                        }), scope.hide = function () {
                            scope.active = !1, foundationApi.animate(element, scope.active, animationIn, animationOut)
                        }, scope.remove = function () {
                            scope.hide(), foundationApi.animate(element, scope.active, animationIn, animationOut)
                        }, scope.show = function () {
                            scope.active = !0, foundationApi.animate(element, scope.active, animationIn, animationOut)
                        }, scope.toggle = function () {
                            scope.active = !scope.active, foundationApi.animate(element, scope.active, animationIn, animationOut)
                        }
                    }}
            }}
    }]), angular.module("foundation.notification").directive("zfNotify", ["FoundationApi", function (foundationApi) {
        return{restrict: "A", scope: {title: "@?", content: "@?", position: "@?", color: "@?", image: "@?"}, link: function (scope, element, attrs) {
                element.on("click", function (e) {
                    e.preventDefault(), foundationApi.publish(attrs.zfNotify, {title: scope.title, content: scope.content, position: scope.position, color: scope.color, image: scope.image})
                })
            }}
    }]);
angular.module("foundation.offcanvas", ["foundation.common.services"]), angular.module("foundation.offcanvas").directive("zfOffcanvas", ["FoundationApi", function (foundationApi) {
        return{restrict: "EA", templateUrl: "partials/offcanvas.html", transclude: !0, scope: {position: "@"}, replace: !0, compile: function () {
                var type = "offcanvas";
                return{pre: function (scope, iElement, iAttrs) {
                        iAttrs.$set("zf-closable", type), document.body.classList.add("has-off-canvas")
                    }, post: function (scope, element, attrs) {
                        scope.position = scope.position || "left", scope.active = !1, foundationApi.subscribe(attrs.id, function (msg) {
                            "show" == msg || "open" == msg ? scope.show() : "close" == msg || "hide" == msg ? scope.hide() : "toggle" == msg && scope.toggle(), scope.$apply()
                        }), scope.hide = function () {
                            scope.active = !1
                        }, scope.show = function () {
                            scope.active = !0
                        }, scope.toggle = function () {
                            scope.active = !scope.active
                        }
                    }}
            }}
    }]);
angular.module("foundation.panel", ["foundation.common.services"]), angular.module("foundation.panel").directive("zfPanel", ["FoundationApi", function (foundationApi) {
        return{restrict: "EA", templateUrl: "partials/panel.html", transclude: !0, scope: {position: "@?"}, replace: !0, compile: function () {
                var type = "panel";
                return{pre: function (scope, iElement, iAttrs) {
                        iAttrs.$set("zf-closable", type)
                    }, post: function (scope, element, attrs) {
                        scope.position = scope.position || "left", scope.active = !1;
                        var animationIn = attrs.animationIn || ("left" === scope.position ? "slideInFromLeft" : "slideInFromRight"), animationOut = attrs.animationOut || ("left" === scope.position ? "slideOutFromLeft" : "slideOutFromLeft");
                        foundationApi.subscribe(attrs.id, function (msg) {
                            "show" == msg || "open" == msg ? scope.show() : "close" == msg || "hide" == msg ? scope.hide() : "toggle" == msg && scope.toggle(), foundationApi.animate(element, scope.active, animationIn, animationOut), scope.$apply()
                        }), scope.hide = function () {
                            scope.active = !1
                        }, scope.show = function () {
                            scope.active = !0
                        }, scope.toggle = function () {
                            scope.active = !scope.active
                        }
                    }}
            }}
    }]);
angular.module("foundation.popup", ["foundation.common.services"]), angular.module("foundation.popup").directive("zfPopup", ["FoundationApi", function (foundationApi) {
        return{restrict: "EA", transclude: !0, replace: !0, templateUrl: "partials/popup.html", scope: {pinTo: "@?", pinAt: "@?"}, link: function (scope, element, attrs) {
                scope.active = !1, scope.target = scope.target || !1, attrs.$set("zf-closeable", "popup");
                var attachment = scope.pinTo || "top center", tetherInit = !1, tether = {}, tetherElement = function (target) {
                    tetherInit || (scope.target = document.getElementById(scope.target ? scope.target : target), tether = new Tether({element: element[0], target: scope.target, attachment: attachment, enable: !1}), tetherInit = !0)
                };
                foundationApi.subscribe(attrs.id, function (msg) {
                    "show" === msg[0] || "open" === msg[0] ? scope.show(msg[1]) : "close" === msg[0] || "hide" === msg[0] ? scope.hide() : "toggle" === msg[0] && scope.toggle(msg[1]), scope.$apply()
                }), scope.hide = function () {
                    scope.active = !1, tetherElement(newTarget), tether.disable()
                }, scope.show = function (newTarget) {
                    scope.active = !0, tetherElement(newTarget), tether.enable()
                }, scope.toggle = function (newTarget) {
                    scope.active = !scope.active, tetherElement(newTarget), scope.active ? tether.enable() : tether.disable()
                }
            }}
    }]), angular.module("foundation.popup").directive("zfPopupToggle", ["FoundationApi", function (foundationApi) {
        return{restrict: "A", link: function (scope, element, attrs) {
                var target = attrs.zfPopupToggle, id = attrs.id || foundationApi.generateUuid();
                attrs.$set("id", id), element.on("click", function (e) {
                    foundationApi.publish(target, ["toggle", id]), e.preventDefault()
                })
            }}
    }]);
angular.module("foundation.tabs", ["foundation.common.services"]), angular.module("foundation.tabs").controller("ZfTabsController", ["$scope", "FoundationApi", function ($scope, foundationApi) {
        var controller = this, tabs = controller.tabs = $scope.tabs = [], id = "";
        controller.select = function (selectTab) {
            tabs.forEach(function (tab) {
                tab.active = !1, tab.scope.active = !1, tab.scope == selectTab && (foundationApi.publish(id, ["activate", tab]), tab.active = !0, tab.scope.active = !0)
            })
        }, controller.addTab = function (tabScope) {
            tabs.push({scope: tabScope, active: !1, parentContent: controller.id}), 1 === tabs.length && (tabs[0].active = !0, tabScope.active = !0)
        }, controller.getId = function () {
            return id
        }, controller.setId = function (newId) {
            id = newId
        }
    }]), angular.module("foundation.tabs").directive("zfTabs", ["FoundationApi", function (foundationApi) {
        return{restrict: "EA", transclude: "true", replace: !0, templateUrl: "partials/tabs.html", controller: "ZfTabsController", scope: {displaced: "@?"}, link: function (scope, element, attrs, controller) {
                scope.id = attrs.id || foundationApi.generateUuid(), scope.showTabContent = "true" !== scope.displaced, attrs.$set("id", scope.id), controller.setId(scope.id);
                var updateTabs = function () {
                    foundationApi.publish(scope.id + "-tabs", scope.tabs)
                };
                foundationApi.subscribe(scope.id + "-get-tabs", function () {
                    updateTabs()
                })
            }}
    }]), angular.module("foundation.tabs").directive("zfTabContent", ["FoundationApi", function (foundationApi) {
        return{restrict: "A", transclude: "true", replace: !0, scope: {tabs: "=?", target: "@"}, templateUrl: "partials/tab-content.html", link: function (scope) {
                scope.tabs = scope.tabs || [];
                var id = scope.target;
                foundationApi.subscribe(id, function (msg) {
                    if ("activate" == msg[0]) {
                        {
                            msg[1]
                        }
                        scope.tabs.forEach(function (tab) {
                            tab.scope.active = !1, tab.active = !1, tab.scope.id === id && (tab.scope.active = !0, tab.active = !0)
                        })
                    }
                }), 0 === scope.tabs.length && (foundationApi.subscribe(id + "-tabs", function (tabs) {
                    scope.tabs = tabs
                }), foundationApi.publish(id + "-get-tabs", ""))
            }}
    }]), angular.module("foundation.tabs").directive("zfTab", ["FoundationApi", function (foundationApi) {
        return{restrict: "EA", templateUrl: "partials/tab.html", transclude: !0, scope: {title: "@"}, require: "^zfTabs", replace: !0, link: function (scope, element, attrs, controller, transclude) {
                scope.id = attrs.id || foundationApi.generateUuid(), scope.active = !1, scope.transcludeFn = transclude, controller.addTab(scope), foundationApi.subscribe(scope.id, function (msg) {
                    ("show" === msg || "open" === msg || "activate" === msg) && scope.makeActive()
                }), scope.makeActive = function () {
                    controller.select(scope)
                }
            }}
    }]), angular.module("foundation.tabs").directive("zfTabIndividual", ["FoundationApi", function (foundationApi) {
        return{restrict: "EA", transclude: "true", link: function (scope, element, attrs) {
                {
                    var tab = scope.$eval(attrs.tab);
                    tab.scope.id
                }
                tab.scope.transcludeFn(tab.scope, function (tabContent) {
                    element.append(tabContent)
                }), foundationApi.subscribe(tab.scope.id, function () {
                    foundationApi.publish(tab.parentContent, ["activate", tab.scope.id]), scope.$apply()
                })
            }}
    }]), angular.module("foundation.tabs").directive("zfTabHref", ["FoundationApi", function (foundationApi) {
        return{restrict: "A", replace: !1, link: function (scope, element, attrs) {
                var target = attrs.zfTabHref, makeActive = function () {
                    element.parent().children().removeClass("is-active"), element.addClass("is-active")
                };
                foundationApi.subscribe(target, function (msg) {
                    ("activate" === msg || "show" === msg || "open" === msg) && makeActive()
                }), element.on("click", function (e) {
                    foundationApi.publish(target, "activate"), makeActive(), e.preventDefault()
                })
            }}
    }]), angular.module("foundation.tabs").directive("zfTabCustom", ["FoundationApi", function () {
        return{restrict: "A", replace: !1, link: function (scope, element) {
                var children = element.children();
                angular.element(children[0]).addClass("is-active")
            }}
    }]), angular.module("foundation.tabs").directive("zfTabContentCustom", ["FoundationApi", function (foundationApi) {
        return{restrict: "A", link: function (scope, element) {
                var tabs = [], children = element.children(), activateTabs = function (tabId) {
                    var tabNodes = element.children();
                    angular.forEach(tabNodes, function (node) {
                        var el = angular.element(node);
                        el.removeClass("is-active"), el.attr("id") === tabId && el.addClass("is-active")
                    })
                };
                angular.forEach(children, function (node) {
                    if (node.id) {
                        var tabId = node.id;
                        if (tabs.push(tabId), foundationApi.subscribe(tabId, function (msg) {
                            ("activate" === msg || "show" === msg || "open" === msg) && activateTabs(tabId)
                        }), 1 === tabs.length) {
                            var el = angular.element(node);
                            el.addClass("is-active")
                        }
                    }
                })
            }}
    }]);
angular.module("markdown", []).directive("markdown", function () {
    return{restrict: "A", link: function (scope, element) {
            element.html(marked(element.html()))
        }}
});