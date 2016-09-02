/**
 * MAD
 * Modular Application Development
 *
 * https://github.com/carlosjln/mad
 * https://github.com/carlosjln/mad-nodejs
 * https://github.com/carlosjln/mad-examples
 *
 * Author: Carlos J. Lopez
 * https://github.com/carlosjln
 * 
 * @license MIT
 */
window.MAD = window.MAD || {
    version: "0.0.1"
}, String.prototype.trim || (String.prototype.trim = function() {
    return this.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, "");
}), function(e) {
    function t(e, n, o) {
        var r, i, a = c(e);
        if (o = o === !0, "date" === a) return n = new Date(), n.setTime(e.getTime()), n;
        if ("array" === a && o === !1) {
            var u = e.length;
            for (n = void 0 === n ? [] : n; u--; ) n[u] = t(e[u], n[u], o);
            return n;
        }
        if ("object" === a) {
            n = void 0 === n ? {} : n;
            for (var l in e) e.hasOwnProperty(l) && (r = e[l], i = n[l], n[l] = t(r, i, o));
            return n;
        }
        return o && void 0 !== n ? n : e;
    }
    function n() {
        for (var e = arguments, n = e.length, o = {}, r = 0; r < n; r++) t(e[r], o);
        return o;
    }
    function o(e, t) {
        for (var n, o = e.length, r = 0, i = []; r < o; r++) n = e[r], t(n) && (i[i.length] = n);
        return i;
    }
    function r(e) {
        for (var t, n, o, r, c, u, l, s = a, d = i(e), f = d.length, p = 0, h = ""; p < f; ) t = d.charCodeAt(p++), 
        n = d.charCodeAt(p++), o = d.charCodeAt(p++), r = t >> 2, c = (3 & t) << 4 | n >> 4, 
        u = (15 & n) << 2 | o >> 6, l = 63 & o, isNaN(n) ? u = l = 64 : isNaN(o) && (l = 64), 
        h = h + s.charAt(r) + s.charAt(c) + s.charAt(u) + s.charAt(l);
        return h;
    }
    function i(e) {
        for (var t, n = e.replace(/\r\n/g, "\n"), o = n.length, r = 0, i = ""; o--; ) t = n.charCodeAt(r++), 
        t < 128 ? i += String.fromCharCode(t) : t > 127 && t < 2048 ? (i += String.fromCharCode(t >> 6 | 192), 
        i += String.fromCharCode(63 & t | 128)) : (i += String.fromCharCode(t >> 12 | 224), 
        i += String.fromCharCode(t >> 6 & 63 | 128), i += String.fromCharCode(63 & t | 128));
        return i;
    }
    var c = function() {
        function e(e) {
            var o = typeof e;
            return null === e ? "null" : "object" === o || "function" === o ? t[n.call(e)] || "object" : o;
        }
        var t = {
            "[object Boolean]": "boolean",
            "[object Number]": "number",
            "[object String]": "string",
            "[object Function]": "function",
            "[object Array]": "array",
            "[object Date]": "date",
            "[object RegExp]": "regexp",
            "[object Object]": "object",
            "[object Error]": "error"
        }, n = t.toString;
        return e;
    }(), a = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
    e.utilities = {
        get_type: c,
        copy: t,
        merge: n,
        filter: o,
        encode_base64: r,
        encode_utf8: i
    };
}(MAD), function(e, t) {
    function n(e) {
        if (!e) return null;
        var n = t.createElement("style"), r = n.styleSheet;
        return n.setAttribute("type", "text/css"), r ? r.cssText = e : n.insertBefore(t.createTextNode(e), null), 
        o.insertBefore(n, null), n;
    }
    var o = t.head || t.getElementsByTagName("head")[0];
    e.html = {
        create_style: n
    };
}(MAD, document), function(e) {
    function t(e) {
        var o = this;
        if (o instanceof t == !1) return new t(e);
        var c, a, u = o.transport = i();
        for (var l in e) c = r(o[l]), a = e[l], !e.hasOwnProperty(l) || "undefined" !== c && c !== r(a) || (o[l] = a);
        var s = o.context || o, d = (o.method || "get").toUpperCase(), f = o.url, p = o.data;
        u.onreadystatechange = function() {
            n.call(o);
        }, u.open(d, f, !0), "POST" === d ? u.setRequestHeader("Content-type", "application/x-www-form-urlencoded") : p && (f = f + (f.indexOf("?") > -1 ? "&" : "?") + p, 
        p = null), o.before.call(s, o, e), u.send(p);
    }
    function n(e) {
        var t, n, o = this.transport, r = this.context || this, i = o.readyState;
        if (4 !== i) return null;
        try {
            t = o.status;
        } catch (e) {
            return null;
        }
        if (200 !== t) return null;
        var c, a = o.responseText;
        try {
            n = new Function("return (" + a + ")")(), this.succeeded.call(r, n);
        } catch (e) {
            c = e, this.failed.call(r, e);
        }
        this.completed.call(r, c, n), o.onreadystatechange = void 0;
    }
    function o() {}
    var r = e.utilities.get_type, i = window.XMLHttpRequest ? function() {
        return new XMLHttpRequest();
    } : function() {
        return new ActiveXObject("Microsoft.XMLHTTP");
    };
    t.prototype = {
        constructor: t,
        url: "",
        method: "GET",
        before: o,
        succeeded: o,
        failed: o,
        completed: o
    }, e.XHR = t;
}(MAD), function(e) {
    function t(e) {
        var t = this;
        t.module_id = e, t.templates = {}, t.styles = {}, t.components = {};
    }
    function n(e) {
        this.update(e.resources);
        try {
            this.callback.call(this);
        } catch (e) {
            throw e;
        }
    }
    function o(e, t) {
        var n, o;
        for (var r in t) n = (t[r] || "").trim(), t.hasOwnProperty(r) && (o = s(n)) && (e[r] = o);
    }
    function r(e, t) {
        var n, o;
        for (o in t) if (n = t[o], n && "string" == typeof n && t.hasOwnProperty(o)) try {
            e[o] = new Function("return (" + n + ");")();
        } catch (e) {
            throw console.log("Exception: unable to process component [" + o + "]"), e;
        }
    }
    function i() {}
    var c = e.utilities, a = c.copy, u = c.get_type, l = e.XHR, s = e.html.create_style;
    t.prototype = {
        constructor: t,
        update: function(e) {
            if ("object" === u(e)) {
                var t = this;
                a(e.templates, t.templates, !0), o(t.styles, e.styles), r(t.components, e.components);
            }
        },
        get: function(e, t) {
            var o = "";
            for (var r in e) e.hasOwnProperty(r) && (o += (o ? "&" : "") + encodeURIComponent(r) + "=" + encodeURIComponent(e[r].join("|")));
            new l({
                url: "mad/module/" + this.module_id + "/resources",
                data: o,
                context: {
                    collection: this,
                    callback: t || i
                },
                succeeded: n
            });
        }
    }, e.ResourceCollection = t;
}(MAD), function(e) {
    function t(e) {
        if ("string" != typeof e) throw "The module [id] must be a string.";
        this.id = e, this.resources = new n(e);
    }
    var n = e.ResourceCollection;
    t.prototype = {
        constructor: t,
        initialize: function() {}
    }, t.initialize = function(n, o) {
        var r = n.id, i = n.source, c = n.resources;
        if (!r || !i) return void console.log("Exception: module not found [" + r + "]");
        var a = new t(r);
        try {
            new Function("return (" + i + ");")().call(a, e), a.resources.update(c), console.log("Initializing module: ", a), 
            a.initialize.apply(a, o);
        } catch (e) {
            return console.log("Exception: ", e), null;
        }
        return a;
    }, e.Module = t;
}(MAD), function(e, t) {
    function n(e, t, n) {
        var u = d(t);
        "function" !== u && (n = t, t = a), n = void 0 === n ? [] : n, n = "array" === d(n) ? n : [ n ];
        var s = f[e];
        if (s) return s.initialize.apply(s, n), t.apply(s, n), s;
        var p = {
            module_id: e,
            callback: t,
            params: n
        };
        return new l({
            url: "mad/module/" + e,
            context: p,
            before: o,
            succeeded: r,
            failed: i,
            completed: c
        });
    }
    function o() {
        console.log("Requesting module: ", this.module_id);
    }
    function r(e) {
        if (!e) return console.log("Exception: Module could not be loaded.");
        if (e.exception) return console.log("Exception: " + (e.exception || "Module could not be loaded."));
        var t = this, n = t.module_id, o = t.params, r = u.initialize(e, o);
        r && (f[n] = r, t.callback.apply(r, o));
    }
    function i(e) {
        throw e;
    }
    function c() {
        console.log("Completed requesting module: ", this.module_id);
    }
    function a() {}
    var u = e.Module, l = e.XHR, s = e.utilities, d = s.get_type, f = {};
    e.get_module = n;
}(MAD, window, document);