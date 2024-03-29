(function () {
    var y = (function () {
        var G = {};
        var H = [];
        G.inc = function (J, I) {
            return true
        };
        G.register = function (K, I) {
            var M = K.split(".");
            var L = G;
            var J = null;
            while (J = M.shift()) {
                if (M.length) {
                    if (L[J] === undefined) {
                        L[J] = {}
                    }
                    L = L[J]
                } else {
                    if (L[J] === undefined) {
                        try {
                            L[J] = I(G)
                        } catch (N) {}
                    }
                }
            }
        };
        G.regShort = function (I, J) {
            if (G[I] !== undefined) {
                throw "[" + I + "] : short : has been register"
            }
            G[I] = J
        };
        G.IE = /msie/i.test(navigator.userAgent);
        G.E = function (I) {
            if (typeof I === "string") {
                return document.getElementById(I)
            } else {
                return I
            }
        };
        G.C = function (I) {
            var J;
            I = I.toUpperCase();
            if (I == "TEXT") {
                J = document.createTextNode("")
            } else {
                if (I == "BUFFER") {
                    J = document.createDocumentFragment()
                } else {
                    J = document.createElement(I)
                }
            }
            return J
        };
        G.log = function (I) {
            H.push("[" + ((new Date()).getTime() % 100000) + "]: " + I)
        };
        G.getErrorLogInformationList = function (I) {
            return H.splice(0, I || H.length)
        };
        return G
    })();
    $Import = y.inc;
    y.register("core.str.trim", function (G) {
        return function (K) {
            if (typeof K !== "string") {
                throw "trim need a string as parameter"
            }
            var H = K.length;
            var J = 0;
            var I = /(\u3000|\s|\t|\u00A0)/;
            while (J < H) {
                if (!I.test(K.charAt(J))) {
                    break
                }
                J += 1
            }
            while (H > J) {
                if (!I.test(K.charAt(H - 1))) {
                    break
                }
                H -= 1
            }
            return K.slice(J, H)
        }
    });
    y.register("core.evt.addEvent", function (G) {
        return function (H, K, J) {
            var I = G.E(H);
            if (I == null) {
                return false
            }
            K = K || "click";
            if ((typeof J).toLowerCase() != "function") {
                return
            }
            if (I.attachEvent) {
                I.attachEvent("on" + K, J)
            } else {
                if (I.addEventListener) {
                    I.addEventListener(K, J, false)
                } else {
                    I["on" + K] = J
                }
            }
            return true
        }
    });
    y.register("core.obj.parseParam", function (G) {
        return function (J, I, H) {
            var K, L = {};
            I = I || {};
            for (K in J) {
                L[K] = J[K];
                if (I[K] != null) {
                    if (H) {
                        if (J.hasOwnProperty[K]) {
                            L[K] = I[K]
                        }
                    } else {
                        L[K] = I[K]
                    }
                }
            }
            return L
        }
    });
    y.register("core.arr.isArray", function (G) {
        return function (H) {
            return Object.prototype.toString.call(H) === "[object Array]"
        }
    });
    y.register("core.json.queryToJson", function (G) {
        return function (J, N) {
            var P = G.core.str.trim(J).split("&");
            var O = {};
            var I = function (R) {
                    if (N) {
                        return decodeURIComponent(R)
                    } else {
                        return R
                    }
                };
            for (var L = 0, M = P.length; L < M; L++) {
                if (P[L]) {
                    var K = P[L].split("=");
                    var H = K[0];
                    var Q = K[1];
                    if (K.length < 2) {
                        Q = H;
                        H = "$nullName"
                    }
                    if (!O[H]) {
                        O[H] = I(Q)
                    } else {
                        if (G.core.arr.isArray(O[H]) != true) {
                            O[H] = [O[H]]
                        }
                        O[H].push(I(Q))
                    }
                }
            }
            return O
        }
    });
    y.register("core.util.cookie", function (H) {
        var G = {
            set: function (L, O, N) {
                var I = [];
                var M, K;
                var J = H.core.obj.parseParam({
                    expire: null,
                    path: "/",
                    domain: null,
                    secure: null,
                    encode: true
                }, N);
                if (J.encode == true) {
                    O = escape(O)
                }
                I.push(L + "=" + O);
                if (J.path != null) {
                    I.push("path=" + J.path)
                }
                if (J.domain != null) {
                    I.push("domain=" + J.domain)
                }
                if (J.secure != null) {
                    I.push(J.secure)
                }
                if (J.expire != null) {
                    M = new Date();
                    K = M.getTime() + J.expire * 3600000;
                    M.setTime(K);
                    I.push("expires=" + M.toGMTString())
                }
                document.cookie = I.join(";")
            },
            get: function (K) {
                K = K.replace(/([\.\[\]\$])/g, "\\$1");
                var J = new RegExp(K + "=([^;]*)?;", "i");
                var L = document.cookie + ";";
                var I = L.match(J);
                if (I) {
                    return I[1] || ""
                } else {
                    return ""
                }
            },
            remove: function (I, J) {
                J = J || {};
                J.expire = -10;
                G.set(I, "", J)
            }
        };
        return G
    });
    y.register("core.util.browser", function (M) {
        var G = navigator.userAgent.toLowerCase();
        var P = window.external || "";
        var I, J, K, Q, L;
        var H = function (R) {
                var S = 0;
                return parseFloat(R.replace(/\./g, function () {
                    return (S++ == 1) ? "" : "."
                }))
            };
        try {
            if ((/windows|win32/i).test(G)) {
                L = "windows"
            } else {
                if ((/macintosh/i).test(G)) {
                    L = "macintosh"
                } else {
                    if ((/rhino/i).test(G)) {
                        L = "rhino"
                    }
                }
            }
            if ((J = G.match(/applewebkit\/([^\s]*)/)) && J[1]) {
                I = "webkit";
                Q = H(J[1])
            } else {
                if ((J = G.match(/presto\/([\d.]*)/)) && J[1]) {
                    I = "presto";
                    Q = H(J[1])
                } else {
                    if (J = G.match(/msie\s([^;]*)/)) {
                        I = "trident";
                        Q = 1;
                        if ((J = G.match(/trident\/([\d.]*)/)) && J[1]) {
                            Q = H(J[1])
                        }
                    } else {
                        if (/gecko/.test(G)) {
                            I = "gecko";
                            Q = 1;
                            if ((J = G.match(/rv:([\d.]*)/)) && J[1]) {
                                Q = H(J[1])
                            }
                        }
                    }
                }
            }
            if (/world/.test(G)) {
                K = "world"
            } else {
                if (/360se/.test(G)) {
                    K = "360"
                } else {
                    if ((/maxthon/.test(G)) || typeof P.max_version == "number") {
                        K = "maxthon"
                    } else {
                        if (/tencenttraveler\s([\d.]*)/.test(G)) {
                            K = "tt"
                        } else {
                            if (/se\s([\d.]*)/.test(G)) {
                                K = "sogou"
                            }
                        }
                    }
                }
            }
        } catch (O) {}
        var N = {
            OS: L,
            CORE: I,
            Version: Q,
            EXTRA: (K ? K : false),
            IE: /msie/.test(G),
            OPERA: /opera/.test(G),
            MOZ: /gecko/.test(G) && !/(compatible|webkit)/.test(G),
            IE5: /msie 5 /.test(G),
            IE55: /msie 5.5/.test(G),
            IE6: /msie 6/.test(G),
            IE7: /msie 7/.test(G),
            IE8: /msie 8/.test(G),
            IE9: /msie 9/.test(G),
            SAFARI: !/chrome\/([\d.]*)/.test(G) && /\/([\d.]*) safari/.test(G),
            CHROME: /chrome\/([\d.]*)/.test(G),
            IPAD: /\(ipad/i.test(G),
            IPHONE: /\(iphone/i.test(G),
            ITOUCH: /\(itouch/i.test(G),
            MOBILE: /mobile/i.test(G)
        };
        return N
    });
    y.register("core.dom.isNode", function (G) {
        return function (H) {
            return (H != undefined) && Boolean(H.nodeName) && Boolean(H.nodeType)
        }
    });
    y.register("core.util.hideContainer", function (I) {
        var J;
        var G = function () {
                if (J) {
                    return
                }
                J = I.C("div");
                J.style.cssText = "position:absolute;top:-9999px;left:-9999px;";
                document.getElementsByTagName("head")[0].appendChild(J)
            };
        var H = {
            appendChild: function (K) {
                if (I.core.dom.isNode(K)) {
                    G();
                    J.appendChild(K)
                }
            },
            removeChild: function (K) {
                if (I.core.dom.isNode(K)) {
                    J && J.removeChild(K)
                }
            }
        };
        return H
    });
    window.WB2 = window.WB2 || {};
    WB2.Module = {
        loginButton: {
            versions: {
                "1.0": {
                    js: "loginButton{ver}.js?version=20120327",
                    css: "/t3/style/css/common/card.css?version=20120327"
                },
                latest: {
                    js: "loginButton.js?version=20120327",
                    css: "/t4/appstyle/widget/css/loginButton/loginButton.css"
                }
            }
        },
        followButton: {
            versions: {
                "1.0": {
                    js: "followButton{ver}.js",
                    css: "/t3/style/css/common/card.css?version=20120327"
                },
                latest: {
                    js: "followButton.js?version=20120330",
                    css: "/t4/appstyle/widget/css/followButton/followButtonSdk.css"
                }
            }
        },
        publish: {
            versions: {
                "1.0": {
                    js: "publish{ver}.js?version=20120327",
                    css: "/t3/style/css/thirdpart/rlsbox.css?version=20120327"
                },
                "1.1": {
                    js: "publish{ver}.js?version=20120327",
                    css: "/t35/appstyle/opent/css/widgets/js_weibo_send/js_weibo_send.css"
                },
                latest: {
                    js: "publish.js?version=20120327",
                    css: "/t4/appstyle/widget/css/weiboPublish/weiboPublish.css"
                }
            }
        },
        hoverCard: {
            versions: {
                "1.0": {
                    js: "hoverCard{ver}.js?version=20120327",
                    css: "/t3/style/css/common/card.css?version=20120327"
                },
                latest: {
                    js: "hoverCard.js?version=20120329",
                    css: "/t4/appstyle/widget/css/weiboCard/weiboCard.css"
                }
            }
        },
        recommend: {
            versions: {
                "1.0": {
                    js: "recommend{ver}.js"
                },
                latest: {
                    js: "recommend.js",
                    css: "/t3/style/css/thirdpart/interested.css"
                }
            }
        },
        selector: {
            versions: {
                "1.0": {
                    js: "selector{ver}.js?version=20120327",
                    css: "/t3/style/css/thirdpart/csuser.css"
                },
                latest: {
                    js: "selector.js?version=20120424",
                    css: "/t4/appstyle/widget/css/selector/selector.css"
                }
            }
        },
        iframeWidget: {
            versions: {
                "1.0": {
                    js: "iframeWidget{ver}.js"
                },
                latest: {
                    js: "iframeWidget.js?version=20120605"
                }
            }
        }
    };
    var C = [{
        tagName: "login-button",
        widgetName: "connectButton"
    }, {
        tagName: "publish",
        widgetName: "publish"
    }, {
        tagName: "follow-button",
        widgetName: "iframeWidget"
    }, {
        tagName: "share-button",
        widgetName: "iframeWidget"
    }, {
        tagName: "list",
        widgetName: "iframeWidget"
    }, {
        tagName: "show",
        widgetName: "iframeWidget"
    }, {
        tagName: "comments",
        widgetName: "iframeWidget"
    }, {
        tagName: "livestream",
        widgetName: "iframeWidget"
    }, {
        tagName: "bulkfollow",
        widgetName: "iframeWidget"
    }];
    var k = function (G, L) {
            L = L || "wb";
            var H = navigator.userAgent.toLowerCase();
            var J = L + ":" + G;
            if (z.IE) {
                try {
                    var K = document.namespaces;
                    if (K && K[L]) {
                        return document.getElementsByTagName(G).length == 0 ? document.getElementsByTagName(J) : document.getElementsByTagName(G)
                    }
                } catch (I) {}
                return document.getElementsByTagName(J)
            } else {
                if (z.MOZ) {
                    return document.getElementsByTagNameNS(document.body.namespaceURI, J)
                } else {
                    return document.getElementsByTagName(J)
                }
            }
        };
    var s = function (K, J) {
            var I = K.attributes;
            var G = {};
            for (var H = I.length - 1; H >= 0; H--) {
                var L = I[H];
                if (L.specified) {
                    G[I[H].name] = I[H].value
                }
            }
            G.dom = K;
            G.tagName = J;
            return G
        };
    var q = function () {
            var O = [];
            for (var J = 0, N = C.length; J < N; J++) {
                var G = C[J];
                var H = G.tagName;
                var K = G.widgetName;
                var M = k(H);
                for (var I = 0, L = M.length; I < L; I++) {
                    O.push({
                        tag: H,
                        widget: K,
                        params: s(M[I], H)
                    })
                }
            }
            var N = O.length;
            if (N > 0) {
                WB2.anyWhere(function (Q) {
                    for (var S = 0, P = O.length; S < P; S++) {
                        var R = O[S];
                        Q.widget[R.widget](R.params)
                    }
                })
            }
        };
    (function () {
        try {
            if (document.namespaces && !document.namespaces.item.wb) {
                document.namespaces.add("wb")
            }
        } catch (G) {}
    }());
    y.core.evt.addEvent(window, "load", function () {
        q()
    });
    var d;
    var x = [];
    var n = 2;
    var a = "https://api.weibo.com/" + n + "/oauth2/query";
    var h = {};
    var j = y.core.obj.parseParam,
        t = y.core.evt.addEvent,
        u = y.core.str.trim,
        z = y.core.util.browser,
        f = y.core.util.cookie,
        B = y.core.json.queryToJson;
    var F = function (K) {
            var I = {
                url: "",
                charset: "UTF-8",
                timeout: 30 * 1000,
                args: {},
                onComplete: null,
                onTimeout: null,
                responseName: null,
                varkey: "callback"
            };
            var L = -1;
            I = j(I, K);
            var J = I.responseName || ("STK_" + Math.floor(Math.random() * 1000) + new Date().getTime().toString());
            I.args[I.varkey] = J;
            var G = I.onComplete;
            var H = I.onTimeout;
            window[J] = function (M) {
                if (L != 2 && G != null) {
                    L = 1;
                    G(M)
                }
            };
            I.onComplete = null;
            I.onTimeout = function () {
                if (L != 1 && H != null) {
                    L = 2;
                    H()
                }
            };
            return e(I)
        };
    var e = function (L) {
            var K, G;
            var H = {
                url: "",
                charset: "UTF-8",
                timeout: 30 * 1000,
                args: {},
                onComplete: null,
                onTimeout: null,
                uniqueID: null
            };
            H = j(H, L);
            if (H.url == "") {
                throw "url is null"
            }
            K = document.createElement("script");
            K.charset = "UTF-8";
            var M = /msie/i.test(navigator.userAgent);
            if (H.onComplete != null) {
                if (M) {
                    K.onreadystatechange = function () {
                        if (K.readyState.toLowerCase() == "complete" || K.readyState.toLowerCase() == "loaded") {
                            clearTimeout(G);
                            H.onComplete();
                            K.onreadystatechange = null
                        }
                    }
                } else {
                    K.onload = function () {
                        clearTimeout(G);
                        H.onComplete();
                        K.onload = null
                    }
                }
            }
            var J = function (O) {
                    if (O) {
                        var N = [];
                        for (var P in O) {
                            N.push(P + "=" + encodeURIComponent(u(O[P])))
                        }
                        if (N.length) {
                            return N.join("&")
                        } else {
                            return ""
                        }
                    }
                };
            var I = J(H.args);
            if (H.url.indexOf("?") == -1) {
                if (I != "") {
                    I = "?" + I
                }
            } else {
                if (I != "") {
                    I = "&" + I
                }
            }
            K.src = H.url + I;
            document.getElementsByTagName("head")[0].appendChild(K);
            if (H.timeout > 0 && H.onTimeout != null) {
                G = setTimeout(function () {
                    H.onTimeout()
                }, H.timeout)
            }
            return K
        };
    var A = function () {
            this.started = 1;
            this.taskList = [];
            this.setStatue = function (G) {
                this.started = G
            };
            this.start = function () {
                this.setStatue(0);
                var I, K, H, J;
                var G = this.taskList.shift();
                var K = G[0],
                    H = G[1],
                    J = G[2];
                K.apply(J, H)
            };
            this.next = function () {
                this.setStatue(1);
                if (this.taskList.length > 0) {
                    this.start()
                }
            };
            this.add = function (I, H) {
                var G = {
                    args: [],
                    pointer: window,
                    top: false
                };
                G = j(G, H);
                if (G.top) {
                    this.taskList.unshift([I, G.args, G.pointer])
                } else {
                    this.taskList.push([I, G.args, G.pointer])
                }
                if (this.started) {
                    this.start()
                }
            }
        };
    var r = new A();

    function w(H) {
        var G = WB2._config.version,
            J = WB2.anyWhere._instances,
            I = J[G];
        if (I) {
            if (I.contentWindow._ready) {
                I.contentWindow.request(H)
            } else {
                WB2.addToCallbacks(I.contentWindow, H)
            }
        } else {
            WB2.delayCall(H)
        }
    }
    function l(H) {
        var G = {
            requestType: "anywhere",
            callback: H
        };
        b(G)
    }
    function b(G) {
        var I = G || {};
        var H = function () {
                w(I);
                r.next()
            };
        var J = function (K) {
                if (h.bundle) {
                    K && K()
                } else {
                    e({
                        url: WB2._config.host + "/open/api/js/api/bundle.js?version=20120518",
                        onComplete: function () {
                            h.bundle = 1;
                            K && K()
                        }
                    })
                }
            };
        r.add(J, {
            args: [H]
        })
    }
    function o() {
        var J = document.getElementsByTagName("script");
        var L = J.length,
            K = 0,
            H, G, O, I, M;
        if (L > 0) {
            H = J[K++];
            while (H) {
                if (H.src.indexOf("api/js/wb.js") != -1) {
                    G = H.src.split("?").pop();
                    break
                }
                H = J[K++]
            }
        }
        G = G.toLowerCase();
        var N = B(G);
        O = N.appkey || "";
        I = N.secret || "";
        M = N.version || 1;
        return {
            appkey: O,
            secret: I,
            version: M
        }
    }
    function m(J, I) {
        var H, G;
        if (J != null) {
            if (I == true) {
                x.unshift(J)
            } else {
                x.push(J)
            }
        }
        if (WB2.checkLogin()) {
            for (H = 0, G = x.length; H < G; H++) {
                x[H].call()
            }
            x = []
        }
    }
    function p(I) {
        m(I, true);
        if (!WB2.checkLogin()) {
            var H = function (J) {
                    c(J.status);
                    if (J.success == 1) {
                        i.save(J);
                        m()
                    } else {
                        x.pop()
                    }
                };
            var G = {
                appkey: WB2._config.appkey,
                requestType: "login",
                callback: H
            };
            b(G)
        }
    }
    function v(H) {
        if (WB2._config.appkey != null) {
            i.del();
            c(-1);
            try {
                WB2.parseCMD("/account/end_session.json", function (J, I) {
                    H && H()
                }, {
                    source: WB2._config.appkey
                }, {
                    method: "get"
                })
            } catch (G) {
                throw "JavaScript SDK: logout error"
            }
        }
    }
    function c(G) {
        if (G == null) {
            return
        }
        d = G
    }
    function E() {
        return d == 1
    }
    var i = {
        load: function () {
            var H = f.get("weibojs_" + WB2._config.appkey);
            H = unescape(H);
            var G = B(H);
            return G
        },
        save: function (G) {
            var H = "access_token=" + (G.access_token || "") + "&refresh_token=" + (G.refresh_token || "") + "&expires_in=" + (G.expires_in || 0) + "&uid=" + (G.uid || "") + "&status=" + (G.status || d || -1);
            f.set("weibojs_" + WB2._config.appkey, H, {
                path: "/",
                domain: document.domain
            })
        },
        del: function () {
            f.remove("weibojs_" + WB2._config.appkey, {
                path: "/",
                domain: document.domain
            })
        }
    };

    function g(H) {
        var I = H || i.load();
        var J = I.access_token || "";
        var G = I.expires_in || "";
        if (J != "") {
            d = 1
        }
        F({
            url: a,
            onComplete: function (K) {
                K = K || {};
                if (K.status == 1 && K.access_token) {
                    i.save(K)
                }
                d = K.status;
                m()
            },
            args: {
                source: WB2._config.appkey
            }
        })
    }
    window.WB2 = window.WB2 || {};
    WB2.widget = {};
    var D = o();
    WB2._config = {};
    WB2._config.version = D.version;
    WB2._config.appkey = D.appkey;
    WB2._config.secret = D.secret;
    WB2._config.host = "http://js.t.sinajs.cn";
    WB2._config.cssHost = "http://timg.sjs.sinajs.cn";
    WB2.login = p;
    WB2.logout = v;
    WB2.checkLogin = E;
    WB2.anyWhere = l;
    WB2.anyWhere._instances = {};
    WB2.Cookie = i;
    WB2.regIframeRequest = b;
    WB2._config.appkey && g()
})();