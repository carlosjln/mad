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
window.mad = window.mad || {
    version: "0.1.0"
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
        var o, i, c = s(t);
        if (r = r === !0, "date" === c) return n = new Date(), n.setTime(t.getTime()), n;
        if ("array" === c && r === !1) {
            var a = t.length;
            for (n = void 0 === n ? [] : n; a--; ) n[a] = e(t[a], n[a], r);
            return n;
        }
        if ("object" === c) {
            n = void 0 === n ? {} : n;
            for (var u in t) t.hasOwnProperty(u) && (o = t[u], i = n[u], n[u] = e(o, i, r));
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
        for (var e, n, r, o, c, a, s, l = u, f = i(t), d = f.length, p = 0, h = ""; p < d; ) e = f.charCodeAt(p++), 
        n = f.charCodeAt(p++), r = f.charCodeAt(p++), o = e >> 2, c = (3 & e) << 4 | n >> 4, 
        a = (15 & n) << 2 | r >> 6, s = 63 & r, isNaN(n) ? a = s = 64 : isNaN(r) && (s = 64), 
        h = h + l.charAt(o) + l.charAt(c) + l.charAt(a) + l.charAt(s);
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
    function a(t, e) {
        if (!t) return null;
        var n = t.oid;
        return n && !e ? n : t.oid = l("OID");
    }
    var s = function() {
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
    }(), u = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=", l = function() {
        function t(t) {
            return (t || "") + ++e;
        }
        var e = new Date().getTime();
        return t;
    }();
    t.utilities = {
        get_type: s,
        copy: e,
        merge: n,
        filter: r,
        encode_base64: o,
        encode_utf8: i,
        serialize: c,
        generate_uid: l,
        set_oid: a
    };
}(window.mad), function(t, e) {
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
}(window.mad, document), function(t) {
    function e(t, r) {
        if (this instanceof e == !1) return new e(t, r);
        "object" == typeof t && (r = t, t = r.url), o(r, this);
        var i = this.transport = a(), c = this;
        i.onreadystatechange = function() {
            n.call(c);
        }, this.start();
    }
    function n(t) {
        var e, n = this.transport, r = n.readyState;
        if (4 !== r) return null;
        try {
            e = n.status;
        } catch (t) {}
        if (200 !== e) return null;
        var o, i = n.responseText, c = this.context || this;
        try {
            this.succeeded.call(c, i);
        } catch (t) {
            o = t, this.failed.call(c, t);
        }
        this.completed.call(c, i, o);
    }
    var r = t.utilities, o = (r.get_type, r.copy), i = r.serialize, c = function() {}, a = window.XMLHttpRequest ? function() {
        return new XMLHttpRequest();
    } : function() {
        return new ActiveXObject("Microsoft.XMLHTTP");
    };
    e.prototype = {
        constructor: e,
        url: null,
        method: "GET",
        before_send: c,
        succeeded: c,
        failed: c,
        completed: c,
        start: function() {
            var t = this.transport, e = this.context || this, n = this.method.toUpperCase(), r = this.data, o = this.url;
            if (o && ("object" == typeof r && (r = i(r)), "POST" === n ? t.setRequestHeader("Content-type", "application/x-www-form-urlencoded") : r && (o = o + (o.indexOf("?") > -1 ? "&" : "?") + r, 
            r = null), this.before_send.call(e) !== !1)) return t.open(n, o, !0), t.send(r), 
            this;
        }
    }, t.XHR = e;
}(window.mad), function(t) {
    function e(t) {
        var e = u(this);
        this.templates = {}, this.styles = {}, this.components = {}, f[e] = {
            module: t
        };
    }
    function n(t) {
        this.callback.call(this.collection.update(t, !0));
    }
    function r(t, e) {
        var n, r, o;
        for (var i in e) n = (e[i] || "").trim(), e.hasOwnProperty(i) && (r = l(n)) && (o = t[i], 
        o && o.parentNode.removeChild(o), t[i] = r);
    }
    function o(t, e) {
        var n, r;
        for (r in e) if (n = e[r], n && "string" == typeof n && e.hasOwnProperty(r)) try {
            t[r] = new Function("return (" + n + ");")();
        } catch (t) {
            throw console.log("Exception: unable to process component [" + r + "]"), t;
        }
    }
    function i(t, e) {
        if (!e) return [];
        for (var n, r = [], o = e.length; o--; ) n = e[o], t[n] || r.add(n);
        return r;
    }
    var c = t.utilities, a = c.copy, s = c.get_type, u = c.set_oid, l = (t.XHR, t.html.create_style), f = {};
    e.prototype = {
        constructor: e,
        update: function(t, e) {
            if ("object" === s(t)) return a(t.templates, this.templates, !e), r(this.styles, t.styles), 
            o(this.components, t.components), this;
        },
        get: function(e, r, o) {
            var c, a, s, u = f[this.oid], l = u.module;
            o ? (c = e.templates, a = e.styles, s = e.components) : (c = i(this.templates, e.templates), 
            a = i(this.styles, e.styles), s = i(this.components, e.components));
            var d = {
                templates: c,
                styles: a,
                components: s
            }, p = {
                callback: r,
                collection: this
            };
            return t.api.fetch_resources(l.id, d, n, p);
        }
    }, t.ResourceCollection = e;
}(window.mad), function(t) {
    function e(t) {
        if ("string" != typeof t) throw "The module [id] must be a string.";
        this.id = t, this.resources = new n(this);
    }
    var n = t.ResourceCollection;
    e.prototype = {
        constructor: e,
        main: function() {}
    }, e.initialize = function(n) {
        var r = n.id, o = n.source, i = n.resources;
        if (!r || !o) return console.log("Exception: module not found [" + r + "]"), null;
        var c = new e(r);
        try {
            c.resources.update(i), new Function("return (" + o + ");")().call(c, t);
        } catch (t) {
            return console.log("Exception: ", t), null;
        }
        return c;
    }, t.Module = e;
}(window.mad), function(t, e) {
    function n(t, e, n) {
        return p[f].fetch_module(t, e, n);
    }
    function r(t, e, n, r) {
        return p[f].fetch_resources(t, e, n, r);
    }
    function o(t, e, r) {
        e = e || d, "function" !== u(e) && (r = e, e = d), r = void 0 === r ? [] : r, r = "array" === u(r) ? r : [ r ];
        var o = l[t];
        if (o) return o.main.apply(o, r), e.apply(o, r), o;
        var c = {
            id: t,
            callback: e,
            params: r
        };
        n(t, i, c);
    }
    function i(t) {
        var e = this.id, n = this.callback, r = this.params, o = a.initialize(t, r);
        o && (l[e] = o, o.main.apply(o, r), n.apply(o, r));
    }
    function c() {
        return "undefined" != typeof e && e.process && "renderer" === e.process.type ? "electron" : "web";
    }
    var a = t.Module, s = (t.XHR, t.utilities), u = s.get_type, l = (s.generate_uid, 
    {}), f = c(), d = function() {}, p = {}, h = {
        transport: p,
        fetch_module: n,
        fetch_resources: r
    };
    t.get_module = o, t.api = h;
}(window.mad, window, document), function(t) {
    function e(t, e, c) {
        return new s({
            url: "mad/module/" + t,
            callback: e || a,
            callback_context: c,
            before_send: n,
            succeeded: r,
            failed: o,
            completed: i
        });
    }
    function n() {
        console.log("Fetching [" + this.url + "]");
    }
    function r(t) {
        if (!t) throw "WARNING: Empty response from [" + this.url + "]";
        var e;
        try {
            e = new Function("return (" + t + ")")();
        } catch (t) {
            throw t;
        }
        var n = e.exception;
        return n ? (console.log("WARNING: " + n), null) : void this.callback.apply(this.callback_context, e);
    }
    function o(t) {
        console.log("WARNING: Fetching failed [" + this.url + "]", t);
    }
    function i() {
        console.log("Fetch completed [" + this.url + "]");
    }
    function c(t, e, c, u) {
        var l = (e.templates || [], e.styles || []), f = e.components || [], d = "templates=" + e.templates.join(",") + "&styles=" + l.join(",") + "&components=" + f.join(",");
        new s({
            url: "mad/module/" + id + "/resources",
            callback: c || a,
            callback_context: u,
            data: d,
            before_send: n,
            succeeded: r,
            failed: o,
            completed: i
        });
    }
    var a = function() {}, s = t.XHR;
    t.api.transport.web = {
        fetch_module: e,
        fetch_resources: c
    };
}(window.mad);