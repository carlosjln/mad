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
}), Array.prototype.add = function(t) {
    var e = this.length;
    return this[e] = t, e;
}, Array.prototype.remove = function(t) {
    var e = this, n = e.indexOf(t);
    return n > -1 ? e.splice(n, 1)[0] : null;
}, Array.prototype.clear = function() {
    return this.splice(0, this.length);
}, Array.prototype.get_last = function() {
    var t = this, e = t.length;
    return e ? t[e - 1] : null;
}, function(t) {
    function e(t, n, r) {
        var o, i, c = l(t);
        if (r = r === !0, "date" === c) return n = new Date(), n.setTime(t.getTime()), n;
        if ("array" === c && r === !1) {
            var u = t.length;
            for (n = void 0 === n ? [] : n; u--; ) n[u] = e(t[u], n[u], r);
            return n;
        }
        if ("object" === c) {
            n = void 0 === n ? {} : n;
            for (var a in t) t.hasOwnProperty(a) && (o = t[a], i = n[a], n[a] = e(o, i, r));
            return n;
        }
        return r && void 0 !== n ? n : t;
    }
    function n() {
        for (var t = arguments, n = t.length, r = {}, o = 0; o < n; o++) e(t[o], r);
        return r;
    }
    function r(t, e) {
        for (var n, r = t.length, o = 0, i = []; o < r; o++) n = t[o], e(n) && (i[i.length] = n);
        return i;
    }
    function o(t) {
        for (var e, n, r, o, c, u, a, l = s, f = i(t), d = f.length, p = 0, h = ""; p < d; ) e = f.charCodeAt(p++), 
        n = f.charCodeAt(p++), r = f.charCodeAt(p++), o = e >> 2, c = (3 & e) << 4 | n >> 4, 
        u = (15 & n) << 2 | r >> 6, a = 63 & r, isNaN(n) ? u = a = 64 : isNaN(r) && (a = 64), 
        h = h + l.charAt(o) + l.charAt(c) + l.charAt(u) + l.charAt(a);
        return h;
    }
    function i(t) {
        for (var e, n = t.replace(/\r\n/g, "\n"), r = n.length, o = 0, i = ""; r--; ) e = n.charCodeAt(o++), 
        e < 128 ? i += String.fromCharCode(e) : e > 127 && e < 2048 ? (i += String.fromCharCode(e >> 6 | 192), 
        i += String.fromCharCode(63 & e | 128)) : (i += String.fromCharCode(e >> 12 | 224), 
        i += String.fromCharCode(e >> 6 & 63 | 128), i += String.fromCharCode(63 & e | 128));
        return i;
    }
    function c(t, e) {
        var n, r, o = [];
        for (var i in t) t.hasOwnProperty(i) && (n = e ? e + "[" + i + "]" : i, r = t[i], 
        o.add("object" == typeof r ? c(r, n) : encodeURIComponent(n) + "=" + encodeURIComponent(r)));
        return o.join("&");
    }
    function u(t) {
        return f("OID-");
    }
    function a(t) {
        return t ? t.oid = f("OID-") : null;
    }
    var l = function() {
        function t(t) {
            var r = typeof t;
            return null === t ? "null" : "object" === r || "function" === r ? e[n.call(t)] || "object" : r;
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
    }(), s = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=", f = function() {
        function t(t) {
            return (t || "") + ++e;
        }
        var e = new Date().getTime();
        return t;
    }();
    t.utilities = {
        get_type: l,
        copy: e,
        merge: n,
        filter: r,
        encode_base64: o,
        encode_utf8: i,
        serialize: c,
        UID: f,
        ObjectID: u,
        set_oid: a
    };
}(MAD), function(t, e) {
    function n(t) {
        if (!t) return null;
        var n = e.createElement("style"), r = n.styleSheet;
        return n.setAttribute("type", "text/css"), r ? r.cssText = t : n.insertBefore(e.createTextNode(t), null), 
        o.insertBefore(n, null), n;
    }
    function r(t) {
        e.registerElement(t);
    }
    var o = e.head || e.getElementsByTagName("head")[0];
    t.html = {
        create_style: n,
        register_tags: r
    };
}(MAD, document), function(t) {
    function e(t) {
        if (this instanceof e == !1) return new e(t);
        var r = this.options = i(t, {}), o = this.transport = u(), a = (r.method || "get").toUpperCase(), l = r.query, s = r.url, f = this;
        o.onreadystatechange = function() {
            n.call(f, r);
        }, "object" == typeof l && (l = c(l)), "POST" === a ? o.setRequestHeader("Content-type", "application/x-www-form-urlencoded") : l && (s = s + (s.indexOf("?") > -1 ? "&" : "?") + l, 
        l = null), o.open(a, s, !0), (r.before || this.before).call(this, r), o.send(l);
    }
    function n(t) {
        n.onreadystatechange = void 0;
        var e, n = this.transport, r = n.readyState;
        if (4 !== r) return null;
        try {
            e = n.status;
        } catch (t) {
            return null;
        }
        if (200 !== e) return null;
        var o, i = t.succeeded || this.succeeded, c = t.completed || this.completed, u = n.responseText;
        try {
            i.call(this, u);
        } catch (t) {
            o = t, failed.call(context, t);
        }
        c.call(context, u, o);
    }
    function r() {}
    var o = t.utilities, i = (o.get_type, o.copy), c = o.serialize, u = window.XMLHttpRequest ? function() {
        return new XMLHttpRequest();
    } : function() {
        return new ActiveXObject("Microsoft.XMLHTTP");
    };
    e.prototype = {
        constructor: e,
        url: "",
        method: "GET",
        before: r,
        succeeded: r,
        failed: r,
        completed: r
    }, t.XHR = e;
}(MAD), function(t) {
    function e(t) {
        var e = u(this);
        this.templates = {}, this.styles = {}, this.components = {}, l[e] = {
            module_id: t
        };
    }
    function n(t, e) {
        var n, r;
        for (var o in e) n = (e[o] || "").trim(), e.hasOwnProperty(o) && (r = a(n)) && (t[o] = r);
    }
    function r(t, e) {
        var n, r;
        for (r in e) if (n = e[r], n && "string" == typeof n && e.hasOwnProperty(r)) try {
            t[r] = new Function("return (" + n + ");")();
        } catch (t) {
            throw console.log("Exception: unable to process component [" + r + "]"), t;
        }
    }
    var o = t.utilities, i = o.copy, c = o.get_type, u = o.set_oid, a = (t.XHR, t.html.create_style), l = {};
    e.prototype = {
        constructor: e,
        update: function(t) {
            "object" === c(t) && (i(t.templates, this.templates, !0), n(this.styles, t.styles), 
            r(this.components, t.components));
        },
        get: function(e, n, r) {
            var o = l[this.oid].module_id;
            return t.get_resources(o, e, n, r);
        }
    }, t.ResourceCollection = e;
}(MAD), function(t) {
    function e(t) {
        if ("string" != typeof t) throw "The module [id] must be a string.";
        this.id = t, this.resources = new n(t);
    }
    var n = t.ResourceCollection;
    e.prototype = {
        constructor: e,
        initialize: function() {}
    }, e.initialize = function(n, r) {
        var o = n.id, i = n.source, c = n.resources;
        if (!o || !i) return void console.log("Exception: module not found [" + o + "]");
        var u = new e(o);
        try {
            u.resources.update(c), new Function("return (" + i + ");")().call(u, t), u.initialize.apply(u, r);
        } catch (t) {
            return console.log("Exception: ", t), null;
        }
        return u;
    }, t.Module = e;
}(MAD), function(t, e) {
    function n(t, e, n) {
        var r = f(e);
        "function" !== r && (n = e, e = m), n = void 0 === n ? [] : n, n = "array" === f(n) ? n : [ n ];
        var o = p[t];
        return o ? (o.initialize.apply(o, n), e.apply(o, n), o) : (i(t, e, n), null);
    }
    function r(t, e, n, r) {
        "boolean" === f(n) && (r = n, n = m), console.log("fetching resources", e);
    }
    function o() {
        return "undefined" != typeof e && e.process && "renderer" === e.process.type ? "electron" : "web";
    }
    function i(t, e, n) {
        var r = g[h] || m, o = {
            id: t,
            callback: e,
            params: n
        };
        r(t, c, o);
    }
    function c(t) {
        var e = this.params, n = this.callback, r = this.params, o = a.initialize(t, r);
        o && (p[e] = o, n.apply(o, r));
    }
    function u(t, e, n, r) {
        g[h] || m, {
            id: id,
            callback: n,
            params: r
        };
    }
    var a = t.Module, l = t.XHR, s = t.utilities, f = s.get_type, d = s.UID, p = {}, h = o(), m = (function() {
        function t() {
            d();
        }
        function e() {}
        function n() {}
        return {
            add: t,
            remove: e,
            find: n
        };
    }(), function() {}), y = function() {
        function t(t, i) {
            new l({
                url: "mad/module/" + t,
                module_id: t,
                callback: i || m,
                before: e,
                succeeded: n,
                failed: r,
                completed: o
            });
        }
        function e() {
            console.log("fetching module: ", this.module_id);
        }
        function n(t) {
            if (!t) return console.log("WARNING: Module not loaded.");
            var e, n;
            try {
                e = new Function("return (" + t + ")")();
            } catch (t) {
                n = t;
            }
            return (n = n || e.exception) ? console.log("WARNING: " + n) : void this.callback.apply(this, e);
        }
        function r(t) {
            throw t;
        }
        function o() {
            console.log("fetched module: ", this.module_id);
        }
        return t;
    }(), g = {
        web: y
    }, v = {
        transport: g,
        fetch_module: i,
        fetch_resources: u
    };
    t.get_module = n, t.get_resources = r, t.api = v;
}(MAD, window, document);