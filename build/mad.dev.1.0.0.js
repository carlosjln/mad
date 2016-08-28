/*
 * MAD
 * Modular Application Development
 *
 * https://github.com/carlosjln/mad
 * https://github.com/carlosjln/mad-nodejs
 * https://github.com/carlosjln/mad-examples
 *
 * Author: Carlos J. Lopez
 * https://github.com/carlosjln
 */
String.prototype.trim || (String.prototype.trim = function() {
    return this.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, "");
}), function(t) {
    function e() {}
    function n() {
        return r;
    }
    var o, r = (Array.prototype.splice, {}), c = Object.prototype.toString, i = function() {
        function t(t) {
            var e = this;
            e.module_id = t.id, e.templates = {}, e.styles = {}, e.components = {};
        }
        function n(t, e) {
            var n, o = document.head || document.getElementsByTagName("head")[0];
            for (var r in e) n = (e[r] || "").trim(), n && e.hasOwnProperty(r) && (style = document.createElement("style"), 
            style.setAttribute("type", "text/css"), style.styleSheet ? style.styleSheet.cssText = n : style.insertBefore(document.createTextNode(n), null), 
            o.insertBefore(style, null), t[r] = style);
        }
        function o(t, e) {
            var n, o;
            for (o in e) if (n = e[o], n && "string" == typeof n && e.hasOwnProperty(o)) try {
                t[o] = new Function("return (" + n + ");")();
            } catch (t) {
                throw console.log("Exception: unable to process component [" + o + "]"), t;
            }
        }
        return t.prototype = {
            constructor: t,
            update: function(t) {
                if ("[object Object]" === c.call(t)) {
                    var r = this, i = e.tools.copy;
                    i(t.templates, r.templates, !0), n(r.styles, t.styles), o(r.components, t.components);
                }
            },
            get: function(t, n) {
                var o = this, r = "";
                for (var c in t) t.hasOwnProperty(c) && (r += (r ? "&" : "") + encodeURIComponent(c) + "=" + encodeURIComponent(t[c].join("|")));
                e.request({
                    url: "mad/module/" + o.module_id + "/resources",
                    data: r,
                    on_success: function(e) {
                        if (o.update(e.resources), "function" == typeof n) try {
                            n.call(t);
                        } catch (t) {
                            throw t;
                        }
                    }
                });
            }
        }, t;
    }(), u = function() {
        function t(t) {
            if ("string" != typeof t) throw "The module [id] must be a string.";
            var e = this;
            e.id = t, e.resources = new i(e);
        }
        return t.prototype = {
            constructor: t,
            initialize: function() {}
        }, t.initialize = function(t) {
            var e = t.id, n = t.source, r = t.resources;
            if (!e || !n) return void console.log("Exception: module not found [" + e + "]");
            var c = new u(e);
            try {
                new Function("return (" + n + ");")().call(c, o), c.resources.update(r), console.log("Initializing module: ", c), 
                c.initialize();
            } catch (t) {
                console.log("Exception: ", t);
            }
            return c;
        }, t;
    }(), a = function() {
        function t(t, r, i) {
            var u = {
                module_id: t,
                callback: r,
                data: i
            };
            e.request({
                url: "mad/module/" + t,
                context: u,
                before_request: n,
                on_success: o,
                on_error: c
            });
        }
        function n() {
            console.log("Requesting module: ", this.module_id);
        }
        function o(t) {
            if (!t) return console.log("Exception: Module could not be loaded.");
            if (t.exception) return console.log("Exception: " + (t.exception || "Module could not be loaded."));
            var e = this, n = e.module_id, o = u.initialize(t);
            if (o) {
                r[n] = o;
                var c = e.data, a = c instanceof Array ? c : [ c ];
                void 0 == c && (a = void 0), (this.callback || i).apply(o, a);
            }
        }
        function c(t) {
            throw t;
        }
        function i() {}
        return t;
    }();
    n.get = function(t, e, n) {
        var o = r[t], i = e, u = n;
        return "[object Function]" !== c.call(e) && (i = null, u = e), o && i ? i.call(o, u) : void a(t, i, u);
    }, o = u.initialize({
        id: "shared",
        source: "function shared() {return false;}"
    }), e.modules = n, e.version = "0.0.1", t.MAD = e;
}(window), function(t, e, n) {
    function o(t) {
        if (this instanceof o == !1) return new o(t);
        var e, n, i = this, u = i.transport = c();
        for (var a in t) e = r(i[a]), n = t[a], !t.hasOwnProperty(a) || "undefined" !== e && e !== r(n) || (i[a] = n);
        var s = i.context || i, l = (i.method || "get").toUpperCase(), f = i.url, d = i.data;
        u.onreadystatechange = function() {
            i.on_ready_state_change.call(i);
        }, u.open(l, f, !0), "POST" === l ? u.setRequestHeader("Content-type", "application/x-www-form-urlencoded") : d && (f = f + (f.indexOf("?") > -1 ? "&" : "?") + d, 
        d = null), i.before_request.call(s, i, t), u.send(d);
    }
    var r = t.tools.get_type, c = e.XMLHttpRequest ? function() {
        return new XMLHttpRequest();
    } : function() {
        return new ActiveXObject("Microsoft.XMLHTTP");
    };
    o.prototype = {
        constructor: o,
        url: "",
        method: "GET",
        before_request: function(t, e) {},
        on_complete: function(t) {},
        on_success: function(t) {},
        on_error: function(t) {},
        on_ready_state_change: function(t) {
            var e, n, o = this, r = o.transport, c = r.readyState, i = o.context || o;
            if (4 !== c) return null;
            try {
                e = r.status;
            } catch (t) {
                return null;
            }
            if (200 !== e) return null;
            var u, a = r.responseText;
            try {
                n = new Function("return (" + a + ")")(), o.on_success.call(i, n);
            } catch (t) {
                u = t, o.on_error.call(i, t);
            }
            o.on_complete.call(i, u, n);
        }
    }, t.request = o;
}(MAD, window, document), function(t) {
    function e(t, n, o) {
        var r, c, u = i(t);
        if (o = o === !0, "date" === u) return n = new Date(), n.setTime(t.getTime()), n;
        if ("array" === u && o === !1) {
            var a = t.length;
            for (n = void 0 === n ? [] : n; a--; ) n[a] = e(t[a], n[a], o);
            return n;
        }
        if ("object" === u) {
            n = void 0 === n ? {} : n;
            for (var s in t) t.hasOwnProperty(s) && (r = t[s], c = n[s], n[s] = e(r, c, o));
            return n;
        }
        return o && void 0 !== n ? n : t;
    }
    function n() {
        for (var t = arguments, n = t.length, o = {}, r = 0; r < n; r++) e(t[r], o);
        return o;
    }
    function o(t, e) {
        for (var n, o = t.length, r = 0, c = []; r < o; r++) n = t[r], e(n) && (c[c.length] = n);
        return c;
    }
    function r(t) {
        for (var e, n, o, r, i, a, s, l = u, f = c(t), d = f.length, p = 0, h = ""; p < d; ) e = f.charCodeAt(p++), 
        n = f.charCodeAt(p++), o = f.charCodeAt(p++), r = e >> 2, i = (3 & e) << 4 | n >> 4, 
        a = (15 & n) << 2 | o >> 6, s = 63 & o, isNaN(n) ? a = s = 64 : isNaN(o) && (s = 64), 
        h = h + l.charAt(r) + l.charAt(i) + l.charAt(a) + l.charAt(s);
        return h;
    }
    function c(t) {
        for (var e, n = t.replace(/\r\n/g, "\n"), o = n.length, r = 0, c = ""; o--; ) e = n.charCodeAt(r++), 
        e < 128 ? c += String.fromCharCode(e) : e > 127 && e < 2048 ? (c += String.fromCharCode(e >> 6 | 192), 
        c += String.fromCharCode(63 & e | 128)) : (c += String.fromCharCode(e >> 12 | 224), 
        c += String.fromCharCode(e >> 6 & 63 | 128), c += String.fromCharCode(63 & e | 128));
        return c;
    }
    var i = function() {
        function t(t) {
            var o = typeof t;
            return null === t ? "null" : "object" === o || "function" === o ? e[n.call(t)] || "object" : o;
        }
        var e = {
            "[object Boolean]": "boolean",
            "[object Number]": "number",
            "[object String]": "string",
            "[object Function]": "function",
            "[object Array]": "array",
            "[object Date]": "date",
            "[object RegExp]": "regexp",
            "[object Object]": "object",
            "[object Error]": "error"
        }, n = e.toString;
        return t;
    }(), u = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
    t.tools = {
        get_type: i,
        copy: e,
        merge: n,
        filter: o,
        encode_base64: r,
        encode_utf8: c
    };
}(MAD);