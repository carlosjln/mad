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
}), function(e, t) {
    function n() {}
    function o(e, t, n) {
        var o = c[e], r = t, u = n;
        return "function" !== i(t) && (r = null, u = t), o && r ? r.call(o, u) : void s(e, r, u);
    }
    var r, i = (Array.prototype.splice, t.get_type), c = {}, u = function() {
        function t(e) {
            var o = this;
            if (o instanceof t == !1) return new t(e);
            var c, u, a = o.transport = r();
            for (var l in e) c = i(o[l]), u = e[l], !e.hasOwnProperty(l) || "undefined" !== c && c !== i(u) || (o[l] = u);
            var s = o.context || o, d = (o.method || "get").toUpperCase(), f = o.url, p = o.data;
            a.onreadystatechange = function() {
                n.call(o);
            }, a.open(d, f, !0), "POST" === d ? a.setRequestHeader("Content-type", "application/x-www-form-urlencoded") : p && (f = f + (f.indexOf("?") > -1 ? "&" : "?") + p, 
            p = null), o.before.call(s, o, e), a.send(p);
        }
        function n(e) {
            var t, n, o = this.transport, r = o.readyState, i = this.context || this;
            if (4 !== r) return null;
            try {
                t = o.status;
            } catch (e) {
                return null;
            }
            if (200 !== t) return null;
            var c, u = o.responseText;
            try {
                n = new Function("return (" + u + ")")(), this.succeeded.call(i, n);
            } catch (e) {
                c = e, this.failed.call(i, e);
            }
            this.completed.call(i, c, n);
        }
        function o() {}
        var r = e.XMLHttpRequest ? function() {
            return new XMLHttpRequest();
        } : function() {
            return new ActiveXObject("Microsoft.XMLHTTP");
        };
        return t.prototype = {
            constructor: t,
            url: "",
            method: "GET",
            before: o,
            completed: o,
            succeeded: o,
            failed: o
        }, t;
    }(), a = function() {
        function e(e) {
            var t = this;
            t.module_id = e, t.templates = {}, t.styles = {}, t.components = {};
        }
        function t(e, t) {
            var n, o = document.head || document.getElementsByTagName("head")[0];
            for (var r in t) n = (t[r] || "").trim(), n && t.hasOwnProperty(r) && (style = document.createElement("style"), 
            style.setAttribute("type", "text/css"), style.styleSheet ? style.styleSheet.cssText = n : style.insertBefore(document.createTextNode(n), null), 
            o.insertBefore(style, null), e[r] = style);
        }
        function o(e, t) {
            var n, o;
            for (o in t) if (n = t[o], n && "string" == typeof n && t.hasOwnProperty(o)) try {
                e[o] = new Function("return (" + n + ");")();
            } catch (e) {
                throw console.log("Exception: unable to process component [" + o + "]"), e;
            }
        }
        return e.prototype = {
            constructor: e,
            update: function(e) {
                if ("object" === i(e)) {
                    var r = this, c = n.tools.copy;
                    c(e.templates, r.templates, !0), t(r.styles, e.styles), o(r.components, e.components);
                }
            },
            get: function(e, t) {
                var o = this, r = "";
                for (var i in e) e.hasOwnProperty(i) && (r += (r ? "&" : "") + encodeURIComponent(i) + "=" + encodeURIComponent(e[i].join("|")));
                n.request({
                    url: "mad/module/" + o.module_id + "/resources",
                    data: r,
                    on_success: function(n) {
                        if (o.update(n.resources), "function" == typeof t) try {
                            t.call(e);
                        } catch (e) {
                            throw e;
                        }
                    }
                });
            }
        }, e;
    }(), l = function() {
        function e(e) {
            if ("string" != typeof e) throw "The module [id] must be a string.";
            var t = this;
            t.id = e, t.resources = new a(e);
        }
        return e.prototype = {
            constructor: e,
            initialize: function() {}
        }, e.initialize = function(e) {
            var t = e.id, n = e.source, o = e.resources;
            if (!t || !n) return void console.log("Exception: module not found [" + t + "]");
            var i = new l(t);
            try {
                new Function("return (" + n + ");")().call(i, r), i.resources.update(o), console.log("Initializing module: ", i), 
                i.initialize();
            } catch (e) {
                console.log("Exception: ", e);
            }
            return i;
        }, e;
    }(), s = function() {
        function e(e, r, i) {
            var c = {
                module_id: e,
                callback: r,
                data: i
            };
            return new u({
                url: "mad/module/" + e,
                context: c,
                before: t,
                succeeded: n,
                failed: o
            });
        }
        function t() {
            console.log("Requesting module: ", this.module_id);
        }
        function n(e) {
            if (!e) return console.log("Exception: Module could not be loaded.");
            if (e.exception) return console.log("Exception: " + (e.exception || "Module could not be loaded."));
            var t = this, n = t.module_id, o = l.initialize(e);
            if (o) {
                c[n] = o;
                var i = t.data, u = i instanceof Array ? i : [ i ];
                void 0 == i && (u = void 0), (this.callback || r).apply(o, u);
            }
        }
        function o(e) {
            throw e;
        }
        function r() {}
        return e;
    }();
    r = l.initialize({
        id: "shared",
        source: "function shared() {return false;}"
    }), n.get_module = o, n.version = "0.0.1", e.MAD = n;
}(window, function(e, t) {
    function n(e, t, o) {
        var r, i, c = u(e);
        if (o = o === !0, "date" === c) return t = new Date(), t.setTime(e.getTime()), t;
        if ("array" === c && o === !1) {
            var a = e.length;
            for (t = void 0 === t ? [] : t; a--; ) t[a] = n(e[a], t[a], o);
            return t;
        }
        if ("object" === c) {
            t = void 0 === t ? {} : t;
            for (var l in e) e.hasOwnProperty(l) && (r = e[l], i = t[l], t[l] = n(r, i, o));
            return t;
        }
        return o && void 0 !== t ? t : e;
    }
    function o() {
        for (var e = arguments, t = e.length, o = {}, r = 0; r < t; r++) n(e[r], o);
        return o;
    }
    function r(e, t) {
        for (var n, o = e.length, r = 0, i = []; r < o; r++) n = e[r], t(n) && (i[i.length] = n);
        return i;
    }
    function i(e) {
        for (var t, n, o, r, i, u, l, s = a, d = c(e), f = d.length, p = 0, h = ""; p < f; ) t = d.charCodeAt(p++), 
        n = d.charCodeAt(p++), o = d.charCodeAt(p++), r = t >> 2, i = (3 & t) << 4 | n >> 4, 
        u = (15 & n) << 2 | o >> 6, l = 63 & o, isNaN(n) ? u = l = 64 : isNaN(o) && (l = 64), 
        h = h + s.charAt(r) + s.charAt(i) + s.charAt(u) + s.charAt(l);
        return h;
    }
    function c(e) {
        for (var t, n = e.replace(/\r\n/g, "\n"), o = n.length, r = 0, i = ""; o--; ) t = n.charCodeAt(r++), 
        t < 128 ? i += String.fromCharCode(t) : t > 127 && t < 2048 ? (i += String.fromCharCode(t >> 6 | 192), 
        i += String.fromCharCode(63 & t | 128)) : (i += String.fromCharCode(t >> 12 | 224), 
        i += String.fromCharCode(t >> 6 & 63 | 128), i += String.fromCharCode(63 & t | 128));
        return i;
    }
    var u = function() {
        function e(e) {
            var o = typeof e;
            return null === e ? "null" : "object" === o || "function" === o ? n[t.call(e)] || "object" : o;
        }
        var t = Object.prototype.toString, n = {
            "[object Boolean]": "boolean",
            "[object Number]": "number",
            "[object String]": "string",
            "[object Function]": "function",
            "[object Array]": "array",
            "[object Date]": "date",
            "[object RegExp]": "regexp",
            "[object Object]": "object",
            "[object Error]": "error"
        };
        return e;
    }(), a = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
    return {
        get_type: u,
        copy: n,
        merge: o,
        filter: r,
        encode_base64: i,
        encode_utf8: c
    };
}(window, document));