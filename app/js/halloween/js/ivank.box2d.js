function Point(e, t) {
    if (!e) e = 0;
    if (!t) t = 0;
    this.x = e;
    this.y = t
}

function Rectangle(e, t, n, r) {
    this.x = e;
    this.y = t;
    this.width = n;
    this.height = r
}

function Transform() {
    this._obj = null;
    this._mdirty = false;
    this._vdirty = false;
    this._tmat = Point._m4.create();
    this._imat = Point._m4.create();
    this._atmat = Point._m4.create();
    this._aimat = Point._m4.create();
    this._cmat = Point._m4.create();
    this._cvec = Point._v4.create();
    this._cID = true;
    this._scaleX = 1;
    this._scaleY = 1;
    this._scaleZ = 1;
    this._rotationX = 0;
    this._rotationY = 0;
    this._rotationZ = 0
}

function EventDispatcher() {
    this.lsrs = {};
    this.cals = {}
}

function Event(e, t) {
    if (!t) t = false;
    this.type = e;
    this.target = null;
    this.currentTarget = null;
    this.bubbles = t
}

function MouseEvent(e, t) {
    Event.call(this, e, t);
    this.movementX = 0;
    this.movementY = 0
}

//function KeyboardEvent(e, t) {
//    Event.call(this, e, t);
//    this.altKey = false;
//    this.ctrlKey = false;
//    this.shiftKey = false;
//    this.keyCode = 0;
//    this.charCode = 0
//}

function DisplayObject() {
    EventDispatcher.call(this);
    this.visible = true;
    this.parent = null;
    this.stage = null;
    this.transform = new Transform;
    this.transform._obj = this;
    this.blendMode = BlendMode.NORMAL;
    this.x = 0;
    this.y = 0;
    this.z = 0;
    this._brect = new Rectangle(0, 0, 0, 0);
    this._temp = new Float32Array(2);
    this._temp2 = new Float32Array(2);
    this._tempm = Point._m4.create();
    this._atsEv = new Event(Event.ADDED_TO_STAGE);
    this._rfsEv = new Event(Event.REMOVED_FROM_STAGE);
    this._atsEv.target = this._rfsEv.target = this
}

function InteractiveObject() {
    DisplayObject.call(this);
    this.buttonMode = false;
    this.mouseEnabled = true
}

function DisplayObjectContainer() {
    InteractiveObject.call(this);
    this.numChildren = 0;
    this.mouseChildren = true;
    this._children = [];
    this._brect2 = new Rectangle(0, 0, 0, 0)
}

function BitmapData(e) {
    this.width = 0;
    this.height = 0;
    this.rect = null;
    this.loader = new EventDispatcher;
    this.loader.bytesLoaded = 0;
    this.loader.bytesTotal = 0;
    this._img = null;
    this._texture = gl.createTexture();
    this._rwidth = 0;
    this._rheight = 0;
    this._tcBuffer = gl.createBuffer();
    this._vBuffer = gl.createBuffer();
    this._loaded = false;
    this._opEv = new Event(Event.OPEN);
    this._pgEv = new Event(Event.PROGRESS);
    this._cpEv = new Event(Event.COMPLETE);
    this._opEv.target = this._pgEv.target = this._cpEv.target = this.loader;
    if (e == null) return;
    this._img = document.createElement("img");
    var t = this,
        n = this._img;
    this._img.onload = function (e) {
        t._initFromImg(n, n.width, n.height);
        t.loader.dispatchEvent(t._cpEv)
    };
    this._img.src = e
}

function Bitmap(e) {
    DisplayObject.call(this);
    this.bitmapData = e
}

function Stage(e) {
    DisplayObjectContainer.call(this);
//    document.body.style.margin = "0";
    this.stage = this;
    this.stageWidth = 0;
    this.stageHeight = 0;
    this.focus = null;
    this._focii = [null, null, null];
    this._mousefocus = null;
    this._useHand = false;
    this._knM = false;
    this._mstack = new Stage._MStack;
    this._cmstack = new Stage._CMStack;
    this._sprg = null;
    this._pmat = Point._m4.create([1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 1, 0, 0, 0, 1]);
    this._umat = Point._m4.create([2, 0, 0, 0, 0, -2, 0, 0, 0, 0, 2, 0, -1, 1, 0, 1]);
    this._smat = Point._m4.create([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, .001, 0, 0, 0, 0, 1]);
    this._efEv = new Event(Event.ENTER_FRAME);
    this._rsEv = new Event(Event.RESIZE);
    this._mcEvs = [new MouseEvent(MouseEvent.CLICK, true), new MouseEvent(MouseEvent.MIDDLE_CLICK, true), new MouseEvent(MouseEvent.RIGHT_CLICK, true)];
    this._mdEvs = [new MouseEvent(MouseEvent.MOUSE_DOWN, true), new MouseEvent(MouseEvent.MIDDLE_MOUSE_DOWN, true), new MouseEvent(MouseEvent.RIGHT_MOUSE_DOWN, true)];
    this._muEvs = [new MouseEvent(MouseEvent.MOUSE_UP, true), new MouseEvent(MouseEvent.MIDDLE_MOUSE_UP, true), new MouseEvent(MouseEvent.RIGHT_MOUSE_UP, true)];
    this._mmoEv = new MouseEvent(MouseEvent.MOUSE_MOVE, true);
    this._movEv = new MouseEvent(MouseEvent.MOUSE_OVER, true);
    this._mouEv = new MouseEvent(MouseEvent.MOUSE_OUT, true);
//    this._kdEv = new KeyboardEvent(KeyboardEvent.KEY_DOWN, true);
//    this._kuEv = new KeyboardEvent(KeyboardEvent.KEY_UP, true);
    this._smd = [false, false, false];
    this._smu = [false, false, false];
    this._smm = false;
    this._srs = false;
    this._canvas = this.canvas = document.getElementById(e);
    Stage._main = this;
    var t = {
        alpha: true,
        antialias: true,
        depth: true,
        premultipliedAlpha: true
    };
    var n = this.canvas;
    gl = n.getContext("webgl", t);
    if (!gl) gl = n.getContext("experimental-webgl", t);
    if (!gl) alert("Could not initialize WebGL. Try to update your browser or graphic drivers.");
    n.style["-webkit-user-select"] = "none";
    var r = document;
//    r.addEventListener("contextmenu", Stage._ctxt, false);
//    r.addEventListener("dragstart", Stage._blck, false);
    if (Stage._isTD()) {
        r.addEventListener("touchstart", Stage._onTD, false);
        r.addEventListener("touchmove", Stage._onTM, false);
        r.addEventListener("touchend", Stage._onTU, false);
        r.addEventListener("touchstart", Stage._blck, false);
        r.addEventListener("touchmove", Stage._blck, false);
        r.addEventListener("touchend", Stage._blck, false)
    } else {
        r.addEventListener("mousedown", Stage._onMD, false);
        r.addEventListener("mousemove", Stage._onMM, false);
        r.addEventListener("mouseup", Stage._onMU, false)
    }
//    document.addEventListener("keydown", Stage._onKD, false);
//    document.addEventListener("keyup", Stage._onKU, false);
//    document.addEventListener("keydown", Stage._blck, false);
//    document.addEventListener("keyup", Stage._blck, false);
//    window.addEventListener("resize", Stage._onRS, false);
    this._initShaders();
    this._initBuffers();
    gl.clearColor(0, 0, 0, 0);
    gl.enable(gl.BLEND);
    gl.blendEquation(gl.FUNC_ADD);
    gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
    gl.enable(gl.DEPTH_TEST);
    gl.depthFunc(gl.LEQUAL);
    this._resize();
    this._srs = true;
    _requestAF(Stage._tick)
}

function Graphics() {
    this._px = 0;
    this._py = 0;
    this._uls = [];
    this._cvs = [];
    this._tgs = [];
    this._elems = [];
    this._duls = [];
    this._dcvs = [];
    this._dtgs = {};
    this._minx = Number.POSITIVE_INFINITY;
    this._miny = this._minx;
    this._maxx = Number.NEGATIVE_INFINITY;
    this._maxy = this._maxx;
    this._sminx = Number.POSITIVE_INFINITY;
    this._sminy = this._sminx;
    this._smaxx = Number.NEGATIVE_INFINITY;
    this._smaxy = this._smaxx;
    this._brect = new Rectangle(0, 0, 0, 0);
    this._clstyle = new LineStyle(1, 0, 1);
    this._cfstyle = new FillStyle(16711680, 1);
    this._bdata = null;
    this._ftype = 0;
    this._empty = true;
    this._lvbuf = gl ? gl.createBuffer() : null;
    this._lvval = new Float32Array(18);
    this._lused = 0;
    this._ltotal = 1;
    this._ldirty = false;
    this._lsegment = null;
    if (gl) this._sendLBuffers()
}

function ULSegment(e, t, n) {
    this.vbuf = n;
    this.offset = 0;
    this.count = 0;
    this.color = new Float32Array(4);
    this.update(e, t)
}

function UTgs(e, t) {
    this.key = e + "-" + t;
    this.vrt = new Float32Array(3 * e);
    this.ind = new Uint16Array(3 * t);
    this.uvt = new Float32Array(2 * e);
    this.useTex = false;
    this.dirtyUVT = false;
    this.emptyUVT = false;
    this.color = new Float32Array(4);
    this._bdata = null;
    this.vbuf = gl.createBuffer();
    Stage._setBF(this.vbuf);
    gl.bufferData(gl.ARRAY_BUFFER, this.vrt, gl.STATIC_DRAW);
    this.ibuf = gl.createBuffer();
    Stage._setEBF(this.ibuf);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, this.ind, gl.STATIC_DRAW);
    this.tbuf = gl.createBuffer();
    Stage._setBF(this.tbuf);
    gl.bufferData(gl.ARRAY_BUFFER, this.uvt, gl.STATIC_DRAW)
}

function FillStyle(e, t) {
    this.color = 0;
    this.alpha = 1;
    this.colARR = new Float32Array(4);
    this.Set(e, t)
}

function LineStyle(e, t, n) {
    FillStyle.call(this);
    this.color = t;
    this.alpha = n;
    this.thickness = e;
    this.Set(e, t, n)
}

function Sprite() {
    DisplayObjectContainer.call(this);
    this.graphics = new Graphics
}

function TextFormat(e, t, n, r, i, s, o) {
    this.font = e ? e : "Times new Roman";
    this.size = t ? t : 12;
    this.color = n ? n : 0;
    this.bold = r ? r : false;
    this.italic = i ? i : false;
    this.align = s ? s : TextFormatAlign.LEFT;
    this.leading = o ? o : 0;
    this.maxW = 0;
    this.data = {
        image: null,
        tw: 0,
        th: 0,
        rw: 0,
        rh: 0
    }
}

function TextField() {
    InteractiveObject.call(this);
    this._wordWrap = false;
    this._textW = 0;
    this._textH = 0;
    this._areaW = 100;
    this._areaH = 100;
    this._text = "";
    this._tForm = new TextFormat;
    this._rwidth = 0;
    this._rheight = 0;
    this._texture = gl.createTexture();
    this._tcArray = new Float32Array([0, 0, 0, 0, 0, 0, 0, 0]);
    this._tcBuffer = gl.createBuffer();
    Stage._setBF(this._tcBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, this._tcArray, gl.STATIC_DRAW);
    this._fArray = new Float32Array([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
    this._vBuffer = gl.createBuffer();
    Stage._setBF(this._vBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, this._fArray, gl.STATIC_DRAW);
    this._brect.x = this._brect.y = 0
}
window._requestAF = function () {
    return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame || function (e, t) {
        window.setTimeout(e, 1e3 / 60)
    }
}();
Point.prototype.clone = function () {
    return new Point(this.x, this.y)
};
Point.prototype.setTo = function (e, t) {
    this.x = e;
    this.y = t
};
Point.prototype.copyFrom = function (e) {
    this.x = e.x;
    this.y = e.y
};
Point.distance = function (e, t) {
    return Point._distance(e.x, e.y, t.x, t.y)
};
Point._distance = function (e, t, n, r) {
    return Math.sqrt((n - e) * (n - e) + (r - t) * (r - t))
};
"use strict";
Point._v4 = {};
Point._m4 = {};
Point._v4.create = function () {
    var e = new Float32Array(4);
    return e
};
Point._m4.create = function (e) {
    var t = new Float32Array(16);
    t[0] = t[5] = t[10] = t[15] = 1;
    if (e) Point._m4.set(e, t);
    return t
};
Point._v4.add = function (e, t, n) {
    n[0] = e[0] + t[0];
    n[1] = e[1] + t[1];
    n[2] = e[2] + t[2];
    n[3] = e[3] + t[3]
};
Point._v4.set = function (e, t) {
    t[0] = e[0];
    t[1] = e[1];
    t[2] = e[2];
    t[3] = e[3]
};
Point._m4.set = function (e, t) {
    t[0] = e[0];
    t[1] = e[1];
    t[2] = e[2];
    t[3] = e[3];
    t[4] = e[4];
    t[5] = e[5];
    t[6] = e[6];
    t[7] = e[7];
    t[8] = e[8];
    t[9] = e[9];
    t[10] = e[10];
    t[11] = e[11];
    t[12] = e[12];
    t[13] = e[13];
    t[14] = e[14];
    t[15] = e[15]
};
Point._m4.multiply = function (e, t, n) {
    var r = e[0],
        i = e[1],
        s = e[2],
        o = e[3],
        u = e[4],
        a = e[5],
        f = e[6],
        l = e[7],
        c = e[8],
        h = e[9],
        p = e[10],
        d = e[11],
        v = e[12],
        m = e[13],
        g = e[14],
        y = e[15];
    var b = t[0],
        w = t[1],
        E = t[2],
        S = t[3];
    n[0] = b * r + w * u + E * c + S * v;
    n[1] = b * i + w * a + E * h + S * m;
    n[2] = b * s + w * f + E * p + S * g;
    n[3] = b * o + w * l + E * d + S * y;
    b = t[4];
    w = t[5];
    E = t[6];
    S = t[7];
    n[4] = b * r + w * u + E * c + S * v;
    n[5] = b * i + w * a + E * h + S * m;
    n[6] = b * s + w * f + E * p + S * g;
    n[7] = b * o + w * l + E * d + S * y;
    b = t[8];
    w = t[9];
    E = t[10];
    S = t[11];
    n[8] = b * r + w * u + E * c + S * v;
    n[9] = b * i + w * a + E * h + S * m;
    n[10] = b * s + w * f + E * p + S * g;
    n[11] = b * o + w * l + E * d + S * y;
    b = t[12];
    w = t[13];
    E = t[14];
    S = t[15];
    n[12] = b * r + w * u + E * c + S * v;
    n[13] = b * i + w * a + E * h + S * m;
    n[14] = b * s + w * f + E * p + S * g;
    n[15] = b * o + w * l + E * d + S * y;
    return n
};
Point._m4.inverse = function (e, t) {
    var n = e[0],
        r = e[1],
        i = e[2],
        s = e[3],
        o = e[4],
        u = e[5],
        a = e[6],
        f = e[7],
        l = e[8],
        c = e[9],
        h = e[10],
        p = e[11],
        d = e[12],
        v = e[13],
        m = e[14],
        g = e[15],
        y = n * u - r * o,
        b = n * a - i * o,
        w = n * f - s * o,
        E = r * a - i * u,
        S = r * f - s * u,
        x = i * f - s * a,
        T = l * v - c * d,
        N = l * m - h * d,
        C = l * g - p * d,
        k = c * m - h * v,
        L = c * g - p * v,
        A = h * g - p * m,
        O = y * A - b * L + w * k + E * C - S * N + x * T;
    if (!O) {
        return null
    }
    O = 1 / O;
    t[0] = (u * A - a * L + f * k) * O;
    t[1] = (i * L - r * A - s * k) * O;
    t[2] = (v * x - m * S + g * E) * O;
    t[3] = (h * S - c * x - p * E) * O;
    t[4] = (a * C - o * A - f * N) * O;
    t[5] = (n * A - i * C + s * N) * O;
    t[6] = (m * w - d * x - g * b) * O;
    t[7] = (l * x - h * w + p * b) * O;
    t[8] = (o * L - u * C + f * T) * O;
    t[9] = (r * C - n * L - s * T) * O;
    t[10] = (d * S - v * w + g * y) * O;
    t[11] = (c * w - l * S - p * y) * O;
    t[12] = (u * N - o * k - a * T) * O;
    t[13] = (n * k - r * N + i * T) * O;
    t[14] = (v * b - d * E - m * y) * O;
    t[15] = (l * E - c * b + h * y) * O;
    return t
};
Point._m4.multiplyVec2 = function (e, t, n) {
    if (n == null) n = t;
    var r = t[0],
        i = t[1];
    n[0] = r * e[0] + i * e[4] + e[12];
    n[1] = r * e[1] + i * e[5] + e[13]
};
Point._m4.multiplyVec4 = function (e, t, n) {
    var r = t[0],
        i = t[1],
        s = t[2],
        o = t[3];
    n[0] = e[0] * r + e[4] * i + e[8] * s + e[12] * o;
    n[1] = e[1] * r + e[5] * i + e[9] * s + e[13] * o;
    n[2] = e[2] * r + e[6] * i + e[10] * s + e[14] * o;
    n[3] = e[3] * r + e[7] * i + e[11] * s + e[15] * o
};
Rectangle.prototype.containsPoint = function (e) {
    return this.contains(e.x, e.y)
};
Rectangle.prototype.contains = function (e, t) {
    return e >= this.x && e <= this.x + this.width && t >= this.y && t <= this.y + this.height
};
Rectangle.prototype.clone = function () {
    return new Rectangle(this.x, this.y, this.width, this.height)
};
Rectangle.prototype.copyFrom = function (e) {
    this.x = e.x;
    this.y = e.y;
    this.width = e.width;
    this.height = e.height
};
Rectangle.prototype.union = function (e) {
    var t = this.clone();
    t._unionWith(e);
    return t
};
Rectangle.prototype.intersection = function (e) {
    var t = Math.max(this.x, e.x);
    var n = Math.max(this.y, e.y);
    var r = Math.min(this.x + this.width, e.x + e.width);
    var i = Math.min(this.y + this.height, e.y + e.height);
    return new Rectangle(t, n, r - t, i - n)
};
Rectangle.prototype.intersects = function (e) {
    if (e.y + e.height < this.y || e.x > this.x + this.width || e.y > this.y + this.height || e.x + e.width < this.x) return false;
    return true
};
Rectangle._temp = new Float32Array(2);
Rectangle.prototype._unionWith = function (e) {
    this._unionWP(e.x, e.y);
    this._unionWP(e.x + e.width, e.y + e.height)
};
Rectangle.prototype._unionWP = function (e, t) {
    var n = Math.min(this.x, e);
    var r = Math.min(this.y, t);
    this.width = Math.max(this.x + this.width, e) - n;
    this.height = Math.max(this.y + this.height, t) - r;
    this.x = n;
    this.y = r
};
Rectangle.prototype._setP = function (e, t) {
    this.x = e;
    this.y = t;
    this.width = this.height = 0
};
Rectangle.prototype._setAndTransform = function (e, t) {
    var n = Rectangle._temp;
    var r = Point._m4.multiplyVec2;
    n[0] = e.x;
    n[1] = e.y;
    r(t, n);
    this._setP(n[0], n[1]);
    n[0] = e.x + e.width;
    n[1] = e.y;
    r(t, n);
    this._unionWP(n[0], n[1]);
    n[0] = e.x;
    n[1] = e.y + e.height;
    r(t, n);
    this._unionWP(n[0], n[1]);
    n[0] = e.x + e.width;
    n[1] = e.y + e.height;
    r(t, n);
    this._unionWP(n[0], n[1])
};
Transform.prototype._getTMat = function () {
    var e = this._obj;
    var t = this._tmat;
    this._checkMat();
    t[12] = e.x;
    t[13] = e.y;
    t[14] = e.z;
    return t
};
Transform.prototype._getIMat = function () {
    Point._m4.inverse(this._getTMat(), this._imat);
    return this._imat
};
Transform.prototype._valsToMat = function () {
    var e = this._tmat;
    var t = this._scaleX;
    var n = this._scaleY;
    var r = this._scaleZ;
    var i = -.01745329252;
    var s = this._rotationX * i;
    var o = this._rotationY * i;
    var u = this._rotationZ * i;
    var a = Math.cos(s),
        f = Math.cos(o),
        l = Math.cos(u);
    var c = Math.sin(s),
        h = Math.sin(o),
        p = Math.sin(u);
    e[0] = f * l * t;
    e[1] = -f * p * t;
    e[2] = h * t;
    e[4] = (a * p + c * h * l) * n;
    e[5] = (a * l - c * h * p) * n;
    e[6] = -c * f * n;
    e[8] = (c * p - a * h * l) * r;
    e[9] = (c * l + a * h * p) * r;
    e[10] = a * f * r
};
Transform.prototype._matToVals = function () {
    var e = this._tmat;
    var t = e[0],
        n = e[1],
        r = e[2],
        i = e[4],
        s = e[5],
        o = e[6],
        u = e[8],
        a = e[9],
        f = e[10];
    this._scaleX = Math.sqrt(t * t + n * n + r * r);
    this._scaleY = Math.sqrt(i * i + s * s + o * o);
    this._scaleZ = Math.sqrt(u * u + a * a + f * f);
    var l = 1 / this._scaleX,
        c = 1 / this._scaleY,
        h = 1 / this._scaleZ;
    t *= l;
    n *= l;
    r *= l;
    i *= c;
    s *= c;
    o *= c;
    u *= h;
    a *= h;
    f *= h;
    var p = -57.29577951308;
    this._rotationX = p * Math.atan2(-o, f);
    this._rotationY = p * Math.atan2(r, Math.sqrt(o * o + f * f));
    this._rotationZ = p * Math.atan2(-n, t)
};
Transform.prototype._checkVals = function () {
    if (this._vdirty) {
        this._matToVals();
        this._vdirty = false
    }
};
Transform.prototype._checkMat = function () {
    if (this._mdirty) {
        this._valsToMat();
        this._mdirty = false
    }
};
Transform.prototype._setOPos = function (e) {
    var e = this._tmat;
    this._obj.x = e[12];
    this._obj.y = e[13];
    this._obj.z = e[14]
};
Transform.prototype._checkColorID = function () {
    var e = this._cmat;
    var t = this._cvec;
    this._cID = e[15] == 1 && e[0] == 1 && e[1] == 0 && e[2] == 0 && e[3] == 0 && e[4] == 0 && e[5] == 1 && e[6] == 0 && e[7] == 0 && e[8] == 0 && e[9] == 0 && e[10] == 1 && e[11] == 0 && e[12] == 0 && e[13] == 0 && e[14] == 0 && e[15] == 1 && t[0] == 0 && t[1] == 0 && t[2] == 0 && t[3] == 0
};
Transform.prototype._setMat3 = function (e) {
    var t = this._tmat;
    t[0] = e[0];
    t[1] = e[1];
    t[4] = e[3];
    t[5] = e[4];
    t[12] = e[6];
    t[13] = e[7]
};
Transform.prototype._getMat3 = function (e) {
    var t = this._tmat;
    e[0] = t[0];
    e[1] = t[1];
    e[3] = t[4];
    e[4] = t[5];
    e[6] = t[12];
    e[7] = t[13]
};
Transform.prototype._setCMat5 = function (e) {
    var t = this._cmat,
        n = this._cvec;
    for (var r = 0; r < 4; r++) {
        n[r] = e[20 + r];
        for (var i = 0; i < 4; i++) t[4 * r + i] = e[5 * r + i]
    }
};
Transform.prototype._getCMat5 = function (e) {
    var t = this._cmat,
        n = this._cvec;
    e[24] = 1;
    for (var r = 0; r < 4; r++) {
        e[20 + r] = n[r];
        for (var i = 0; i < 4; i++) e[5 * r + i] = t[4 * r + i]
    }
};
Transform.prototype.__defineSetter__("matrix", function (e) {
    this._checkMat();
    this._setMat3(e);
    this._setOPos();
    this._vdirty = true
});
Transform.prototype.__defineGetter__("matrix", function () {
    this._checkMat();
    var e = new Float32Array(9);
    this._getMat3(e);
    return e
});
Transform.prototype.__defineSetter__("matrix3D", function (e) {
    this._checkMat();
    Point._m4.set(e, this._tmat);
    this._setOPos();
    this._vdirty = true
});
Transform.prototype.__defineGetter__("matrix3D", function () {
    this._checkMat();
    return Point._m4.create(this._getTMat())
});
Transform.prototype.__defineSetter__("colorTransform", function (e) {
    this._setCMat5(e);
    this._checkColorID()
});
Transform.prototype.__defineGetter__("colorTransform", function () {
    var e = new Float32Array(25);
    this._getCMat5(e);
    return e
});
EventDispatcher.efbc = [];
EventDispatcher.prototype.hasEventListener = function (e) {
    var t = this.lsrs[e];
    if (t == null) return false;
    return t.length > 0
};
EventDispatcher.prototype.addEventListener = function (e, t) {
    this.addEventListener2(e, t, null)
};
EventDispatcher.prototype.addEventListener2 = function (e, t, n) {
    if (this.lsrs[e] == null) {
        this.lsrs[e] = [];
        this.cals[e] = []
    }
    this.lsrs[e].push(t);
    this.cals[e].push(n);
    if (e == Event.ENTER_FRAME) {
        var r = EventDispatcher.efbc;
        if (r.indexOf(this) < 0) r.push(this)
    }
};
EventDispatcher.prototype.removeEventListener = function (e, t) {
    var n = this.lsrs[e];
    if (n == null) return;
    var r = n.indexOf(t);
    if (r < 0) return;
    var i = this.cals[e];
    n.splice(r, 1);
    i.splice(r, 1);
    if (e == Event.ENTER_FRAME && n.length == 0) {
        var s = EventDispatcher.efbc;
        s.splice(s.indexOf(this), 1)
    }
};
EventDispatcher.prototype.dispatchEvent = function (e) {
    var t = this.lsrs[e.type];
    if (t == null) return;
    var n = this.cals[e.type];
    for (var r = 0; r < t.length; r++) {
        e.currentTarget = this;
        if (e.target == null) e.target = this;
        if (n[r] == null) t[r](e);
        else t[r].call(n[r], e)
    }
};
Event.ENTER_FRAME = "enterFrame";
Event.RESIZE = "resize";
Event.ADDED_TO_STAGE = "addedToStage";
Event.REMOVED_FROM_STAGE = "removedFromStage";
Event.CHANGE = "change";
Event.OPEN = "open";
Event.PROGRESS = "progress";
Event.COMPLETE = "complete";
MouseEvent.prototype = new Event;
MouseEvent.CLICK = "click";
MouseEvent.MOUSE_DOWN = "mouseDown";
MouseEvent.MOUSE_UP = "mouseUp";
MouseEvent.MIDDLE_CLICK = "middleClick";
MouseEvent.MIDDLE_MOUSE_DOWN = "middleMouseDown";
MouseEvent.MIDDLE_MOUSE_UP = "middleMouseUp";
MouseEvent.RIGHT_CLICK = "rightClick";
MouseEvent.RIGHT_MOUSE_DOWN = "rightMouseDown";
MouseEvent.RIGHT_MOUSE_UP = "rightMouseUp";
MouseEvent.MOUSE_MOVE = "mouseMove";
MouseEvent.MOUSE_OVER = "mouseOver";
MouseEvent.MOUSE_OUT = "mouseOut";
//KeyboardEvent.prototype = new Event;
//KeyboardEvent.prototype._setFromDom = function (e) {
//    this.altKey = e.altKey;
//    this.ctrlKey = e.ctrlKey;
//    this.shiftKey = e.ShiftKey;
//    this.keyCode = e.keyCode;
//    this.charCode = e.charCode
//};
//KeyboardEvent.KEY_DOWN = "keyDown";
//KeyboardEvent.KEY_UP = "keyUp";
var BlendMode = {
    NORMAL: "normal",
    ADD: "add",
    SUBTRACT: "subtract",
    MULTIPLY: "multiply",
    SCREEN: "screen",
    ERASE: "erase",
    ALPHA: "alpha"
};
DisplayObject.prototype = new EventDispatcher;
DisplayObject.prototype.dispatchEvent = function (e) {
    EventDispatcher.prototype.dispatchEvent.call(this, e);
    if (e.bubbles && this.parent != null) this.parent.dispatchEvent(e)
};
DisplayObject.prototype.globalToLocal = function (e) {
    var t = this._temp;
    t[0] = e.x;
    t[1] = e.y;
    Point._m4.multiplyVec2(this._getAIMat(), t);
    return new Point(t[0], t[1])
};
DisplayObject.prototype.localToGlobal = function (e) {
    var t = this._temp;
    t[0] = e.x;
    t[1] = e.y;
    Point._m4.multiplyVec2(this._getATMat(), t);
    return new Point(t[0], t[1])
};
DisplayObject.prototype.hitTestPoint = function (e) {
    var t = this._temp2;
    t[0] = e.x;
    t[1] = e.y;
    Point._m4.multiplyVec2(this._getAIMat(), t);
    Point._m4.multiplyVec2(this.transform._getTMat(), t);
    return this._htpLocal(t)
};
DisplayObject.prototype.hitTestObject = function (e) {
    var t = this._getRect(false);
    var n = e._getRect(false);
    if (!t || !n) return false;
    var r = this._getATMat();
    var i = e._getATMat();
    var s = t.clone(),
        o = n.clone();
    s._setAndTransform(t, r);
    o._setAndTransform(n, i);
    return s.intersects(o)
};
DisplayObject.prototype.getRect = function (e) {
    return this._makeRect(false, e)
};
DisplayObject.prototype.getBounds = function (e) {
    return this._makeRect(true, e)
};
DisplayObject.prototype._makeRect = function (e, t) {
    var n = this._getRect(e);
    var r = this._tempm;
    Point._m4.multiply(this._getATMat(), t._getAIMat(), r);
    var i = new Rectangle(6710886.4, 6710886.4, 0, 0);
    if (n) i._setAndTransform(n, r);
    return i
};
DisplayObject.prototype._htpLocal = function (e) {
    var t = this._temp;
    Point._m4.multiplyVec2(this.transform._getIMat(), e, t);
    var n = this._getRect();
    if (n == null) return false;
    return n.contains(t[0], t[1])
};
DisplayObject.prototype._moveMouse = function (e, t, n) {
    return null
};
DisplayObject.prototype._getRect = function (e) {
    return this._brect
};
DisplayObject.prototype._setStage = function (e) {
    var t = this.stage;
    this.stage = e;
    if (t == null && e != null) this.dispatchEvent(this._atsEv);
    if (t != null && e == null) this.dispatchEvent(this._rfsEv)
};
DisplayObject.prototype._preRender = function (e) {
    var t = this.transform._getTMat();
    e._mstack.push(t);
    e._cmstack.push(this.transform._cmat, this.transform._cvec, this.transform._cID, this.blendMode)
};
DisplayObject.prototype._render = function (e) {};
DisplayObject.prototype._renderAll = function (e) {
    if (!this.visible) return;
    this._preRender(e);
    this._render(e);
    e._mstack.pop();
    e._cmstack.pop()
};
DisplayObject.prototype._getATMat = function () {
    if (this.parent == null) return this.transform._getTMat();
    Point._m4.multiply(this.parent.transform._getTMat(), this.transform._getTMat(), this.transform._atmat);
    return this.transform._atmat
};
DisplayObject.prototype._getAIMat = function () {
    if (this.parent == null) return this.transform._getIMat();
    Point._m4.multiply(this.transform._getIMat(), this.parent._getAIMat(), this.transform._aimat);
    return this.transform._aimat
};
DisplayObject.prototype._getMouse = function () {
    var e = this._temp;
    e[0] = Stage._mouseX;
    e[1] = Stage._mouseY;
    Point._m4.multiplyVec2(this._getAIMat(), e);
    return e
};
this.dp = DisplayObject.prototype;
dp.ds = dp.__defineSetter__;
dp.dg = dp.__defineGetter__;
dp.ds("scaleX", function (e) {
    this.transform._checkVals();
    this.transform._scaleX = e;
    this.transform._mdirty = true
});
dp.ds("scaleY", function (e) {
    this.transform._checkVals();
    this.transform._scaleY = e;
    this.transform._mdirty = true
});
dp.ds("scaleZ", function (e) {
    this.transform._checkVals();
    this.transform._scaleZ = e;
    this.transform._mdirty = true
});
dp.dg("scaleX", function () {
    this.transform._checkVals();
    return this.transform._scaleX
});
dp.dg("scaleY", function () {
    this.transform._checkVals();
    return this.transform._scaleY
});
dp.dg("scaleZ", function () {
    this.transform._checkVals();
    return this.transform._scaleZ
});
dp.ds("rotationX", function (e) {
    this.transform._checkVals();
    this.transform._rotationX = e;
    this.transform._mdirty = true
});
dp.ds("rotationY", function (e) {
    this.transform._checkVals();
    this.transform._rotationY = e;
    this.transform._mdirty = true
});
dp.ds("rotationZ", function (e) {
    this.transform._checkVals();
    this.transform._rotationZ = e;
    this.transform._mdirty = true
});
dp.ds("rotation", function (e) {
    this.transform._checkVals();
    this.transform._rotationZ = e;
    this.transform._mdirty = true
});
dp.dg("rotationX", function () {
    this.transform._checkVals();
    return this.transform._rotationX
});
dp.dg("rotationY", function () {
    this.transform._checkVals();
    return this.transform._rotationY
});
dp.dg("rotationZ", function () {
    this.transform._checkVals();
    return this.transform._rotationZ
});
dp.dg("rotation", function () {
    this.transform._checkVals();
    return this.transform._rotationZ
});
dp.ds("alpha", function (e) {
    this.transform._cmat[15] = e;
    this.transform._checkColorID()
});
dp.dg("alpha", function () {
    return this.transform._cmat[15]
});
dp.dg("mouseX", function () {
    return this._getMouse()[0]
});
dp.dg("mouseY", function () {
    return this._getMouse()[1]
});
delete dp.ds;
delete dp.dg;
delete this.dp;
InteractiveObject.prototype = new DisplayObject;
InteractiveObject.prototype._moveMouse = function (e, t, n) {
    if (!n || !this.visible || !this.mouseEnabled) return null;
    var r = this._getRect();
    if (r == null) return null;
    var i = this._temp;
    i[0] = e;
    i[1] = t;
    Point._m4.multiplyVec2(this.transform._getIMat(), i);
    if (r.contains(i[0], i[1])) return this;
    return null
};
DisplayObjectContainer.prototype = new InteractiveObject;
DisplayObjectContainer.prototype.addChild = function (e) {
    this._children.push(e);
    e.parent = this;
    e._setStage(this.stage);
    ++this.numChildren
};
DisplayObjectContainer.prototype.removeChild = function (e) {
    var t = this._children.indexOf(e);
    if (t < 0) return;
    this._children.splice(t, 1);
    e.parent = null;
    e._setStage(null);
    --this.numChildren
};
DisplayObjectContainer.prototype.removeChildAt = function (e) {
    this.removeChild(this._children[e])
};
DisplayObjectContainer.prototype.contains = function (e) {
    return this._children.indexOf(e) >= 0
};
DisplayObjectContainer.prototype.getChildIndex = function (e) {
    return this._children.indexOf(e)
};
DisplayObjectContainer.prototype.setChildIndex = function (e, t) {
    var n = this._children.indexOf(e);
    if (t > n) {
        for (var r = n + 1; r <= t; r++) this._children[r - 1] = this._children[r];
        this._children[t] = e
    } else if (t < n) {
        for (var r = n - 1; r >= t; r--) this._children[r + 1] = this._children[r];
        this._children[t] = e
    }
};
DisplayObjectContainer.prototype.getChildAt = function (e) {
    return this._children[e]
};
DisplayObjectContainer.prototype._render = function (e) {
    for (var t = 0; t < this.numChildren; t++) this._children[t]._renderAll(e)
};
DisplayObjectContainer.prototype._moveMouse = function (e, t, n) {
    if (!n || !this.visible || !this.mouseChildren && !this.mouseEnabled) return null;
    var r = this._temp;
    r[0] = e;
    r[1] = t;
    Point._m4.multiplyVec2(this.transform._getIMat(), r);
    var i = r[0],
        s = r[1];
    var o = n;
    var u = null;
    var a = this.numChildren - 1;
    for (var f = a; f > -1; f--) {
        var l = this._children[f]._moveMouse(i, s, o);
        if (l != null) {
            u = l;
            break
        }
    }
    if (!this.mouseChildren && u != null) return this;
    return u
};
DisplayObjectContainer.prototype._htpLocal = function (e) {
    var t = this._temp;
    Point._m4.multiplyVec2(this.transform._getIMat(), e, t);
    var n = this._children.length;
    for (var r = 0; r < n; r++) {
        var i = this._children[r];
        if (i.visible)
            if (i._htpLocal(t)) return true
    }
    return false
};
DisplayObjectContainer.prototype._setStage = function (e) {
    InteractiveObject.prototype._setStage.call(this, e);
    for (var t = 0; t < this.numChildren; t++) this._children[t]._setStage(e)
};
DisplayObjectContainer.prototype._getRect = function (e) {
    if (this.numChildren == 0) return null;
    var t = null;
    var n = this._brect2;
    for (var r = 0; r < this.numChildren; r++) {
        var i = this._children[r];
        var s = i._getRect(e);
        if (!i.visible || s == null) continue;
        if (t == null) {
            t = this._brect;
            t._setAndTransform(s, i.transform._getTMat())
        } else {
            n._setAndTransform(s, i.transform._getTMat());
            t._unionWith(n)
        }
    }
    return t
};
BitmapData.empty = function (e, t) {
    var n = new BitmapData(null);
    n._initFromImg(null, e, t);
    return n
};
BitmapData.prototype.setPixels = function (e, t) {
    Stage._setTEX(this._texture);
    gl.texSubImage2D(gl.TEXTURE_2D, 0, e.x, e.y, e.width, e.height, gl.RGBA, gl.UNSIGNED_BYTE, t);
    gl.generateMipmap(gl.TEXTURE_2D)
};
BitmapData.prototype.getPixels = function (e, t) {
    if (!t) t = new Uint8Array(e.width * e.height * 4);
    this._setTexAsFB();
    gl.readPixels(e.x, e.y, e.width, e.height, gl.RGBA, gl.UNSIGNED_BYTE, t);
    Stage._main._setFramebuffer(null, Stage._main.stageWidth, Stage._main.stageHeight, false);
    return t
};
BitmapData.prototype.draw = function (e) {
    this._setTexAsFB();
    e._render(Stage._main);
    Stage._main._setFramebuffer(null, Stage._main.stageWidth, Stage._main.stageHeight, false);
    Stage._setTEX(this._texture);
    gl.generateMipmap(gl.TEXTURE_2D)
};
BitmapData.prototype._setTexAsFB = function () {
    if (BitmapData._fbo == null) {
        BitmapData._fbo = gl.createFramebuffer();
        var e = gl.createRenderbuffer();
        gl.bindRenderbuffer(gl.RENDERBUFFER, e);
        gl.bindFramebuffer(gl.FRAMEBUFFER, BitmapData._fbo);
        gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.RENDERBUFFER, e)
    }
    Stage._main._setFramebuffer(BitmapData._fbo, this._rwidth, this._rheight, true);
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, this._texture, 0)
};
BitmapData.prototype._initFromImg = function (e, t, n) {
    this._loaded = true;
    this.width = t;
    this.height = n;
    this._rwidth = BitmapData._nhpot(t);
    this._rheight = BitmapData._nhpot(n);
    this.rect = new Rectangle(0, 0, t, n);
    var r = t / this._rwidth;
    var i = n / this._rheight;
    Stage._setBF(this._tcBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([0, 0, r, 0, 0, i, r, i]), gl.STATIC_DRAW);
    Stage._setBF(this._vBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([0, 0, 0, t, 0, 0, 0, n, 0, t, n, 0]), gl.STATIC_DRAW);
    var s = BitmapData._canv;
    s.width = this._rwidth;
    s.height = this._rheight;
    var o = BitmapData._ctx;
    if (e != null) o.drawImage(e, 0, 0);
    var u = o.getImageData(0, 0, this._rwidth, this._rheight);
    Stage._setTEX(this._texture);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, u);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
    gl.generateMipmap(gl.TEXTURE_2D)
};
BitmapData._canv = document.createElement("canvas");
BitmapData._ctx = BitmapData._canv.getContext("2d");
BitmapData._ipot = function (e) {
    return (e & e - 1) == 0
};
BitmapData._nhpot = function (e) {
    --e;
    for (var t = 1; t < 32; t <<= 1) e = e | e >> t;
    return e + 1
};
Bitmap.prototype = new InteractiveObject;
Bitmap.prototype._getRect = function () {
    return this.bitmapData.rect
};
Bitmap.prototype._render = function (e) {
    var t = this.bitmapData;
    if (!t._loaded) return;
    gl.uniformMatrix4fv(e._sprg.tMatUniform, false, e._mstack.top());
    e._cmstack.update();
    Stage._setVC(t._vBuffer);
    Stage._setTC(t._tcBuffer);
    Stage._setUT(1);
    Stage._setTEX(t._texture);
    Stage._setEBF(e._unitIBuffer);
    gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 0)
};
var gl;
Stage.prototype = new DisplayObjectContainer;
Stage._mouseX = 0;
Stage._mouseY = 0;
Stage._curBF = -1;
Stage._curEBF = -1;
Stage._curVC = -1;
Stage._curTC = -1;
Stage._curUT = -1;
Stage._curTEX = -1;
Stage._curBMD = "normal";
Stage._setBF = function (e) {
    if (Stage._curBF != e) {
        gl.bindBuffer(gl.ARRAY_BUFFER, e);
        Stage._curBF = e
    }
};
Stage._setEBF = function (e) {
    if (Stage._curEBF != e) {
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, e);
        Stage._curEBF = e
    }
};
Stage._setVC = function (e) {
    if (Stage._curVC != e) {
        gl.bindBuffer(gl.ARRAY_BUFFER, e);
        gl.vertexAttribPointer(Stage._main._sprg.vpa, 3, gl.FLOAT, false, 0, 0);
        Stage._curVC = Stage._curBF = e
    }
};
Stage._setTC = function (e) {
    if (Stage._curTC != e) {
        gl.bindBuffer(gl.ARRAY_BUFFER, e);
        gl.vertexAttribPointer(Stage._main._sprg.tca, 2, gl.FLOAT, false, 0, 0);
        Stage._curTC = Stage._curBF = e
    }
};
Stage._setUT = function (e) {
    if (Stage._curUT != e) {
        gl.uniform1i(Stage._main._sprg.useTex, e);
        Stage._curUT = e
    }
};
Stage._setTEX = function (e) {
    if (Stage._curTEX != e) {
        gl.bindTexture(gl.TEXTURE_2D, e);
        Stage._curTEX = e
    }
};
Stage._setBMD = function (e) {
    if (Stage._curBMD != e) {
        if (e == BlendMode.NORMAL) {
            gl.blendEquation(gl.FUNC_ADD);
            gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA)
        } else if (e == BlendMode.MULTIPLY) {
            gl.blendEquation(gl.FUNC_ADD);
            gl.blendFunc(gl.DST_COLOR, gl.ONE_MINUS_SRC_ALPHA)
        } else if (e == BlendMode.ADD) {
            gl.blendEquation(gl.FUNC_ADD);
            gl.blendFunc(gl.ONE, gl.ONE)
        } else if (e == BlendMode.SUBTRACT) {
            gl.blendEquationSeparate(gl.FUNC_REVERSE_SUBTRACT, gl.FUNC_ADD);
            gl.blendFunc(gl.ONE, gl.ONE)
        } else if (e == BlendMode.SCREEN) {
            gl.blendEquation(gl.FUNC_ADD);
            gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_COLOR)
        } else if (e == BlendMode.ERASE) {
            gl.blendEquation(gl.FUNC_ADD);
            gl.blendFunc(gl.ZERO, gl.ONE_MINUS_SRC_ALPHA)
        } else if (e == BlendMode.ALPHA) {
            gl.blendEquation(gl.FUNC_ADD);
            gl.blendFunc(gl.ZERO, gl.SRC_ALPHA)
        }
        Stage._curBMD = e
    }
};
Stage._okKeys = [112, 113, 114, 115, 116, 117, 118, 119, 120, 121, 122, 123, 13, 16, 18, 27];
Stage._isTD = function () {
    return !!("ontouchstart" in window)
};
Stage._ctxt = function (e) {
    if (Stage._main.hasEventListener(MouseEvent.RIGHT_CLICK)) e.preventDefault()
};
Stage._onTD = function (e) {
    Stage._setStageMouse(e);
    Stage._main._smd[0] = true;
    Stage._main._knM = true
};
Stage._onTM = function (e) {
    Stage._setStageMouse(e);
    Stage._main._smm = true;
    Stage._main._knM = true
};
Stage._onTU = function (e) {
    Stage._main._smu[0] = true;
    Stage._main._knM = true
};
Stage._onMD = function (e) {
    Stage._setStageMouse(e);
    Stage._main._smd[e.button] = true;
    Stage._main._knM = true
};
Stage._onMM = function (e) {
    Stage._setStageMouse(e);
    Stage._main._smm = true;
    Stage._main._knM = true
};
Stage._onMU = function (e) {
    Stage._main._smu[e.button] = true;
    Stage._main._knM = true
};
Stage._onKD = function (e) {
    var t = Stage._main;
    t._kdEv._setFromDom(e);
    if (t.focus && t.focus.stage) t.focus.dispatchEvent(t._kdEv);
    else t.dispatchEvent(t._kdEv)
};
Stage._onKU = function (e) {
    var t = Stage._main;
    t._kuEv._setFromDom(e);
    if (t.focus && t.focus.stage) t.focus.dispatchEvent(t._kuEv);
    else t.dispatchEvent(t._kuEv)
};
Stage._blck = function (e) {
    if (e.keyCode != null) {
        if (Stage._okKeys.indexOf(e.keyCode) == -1) e.preventDefault()
    } else e.preventDefault()
};
Stage._onRS = function (e) {
    Stage._main._srs = true
};
Stage.prototype._resize = function () {
    var e = window.innerWidth;
    var t = window.innerHeight;
    this.stageWidth = e;
    this.stageHeight = t;
    this._canvas.width = e;
    this._canvas.height = t;
    this._setFramebuffer(null, e, t, false)
};
Stage.prototype._getShader = function (e, t, n) {
    var r;
    if (n) r = e.createShader(e.FRAGMENT_SHADER);
    else r = e.createShader(e.VERTEX_SHADER);
    e.shaderSource(r, t);
    e.compileShader(r);
    if (!e.getShaderParameter(r, e.COMPILE_STATUS)) {
        alert(e.getShaderInfoLog(r));
        return null
    }
    return r
};
Stage.prototype._initShaders = function () {
    var e = "			precision mediump float;			varying vec2 texCoord;						uniform sampler2D uSampler;			uniform vec4 color;			uniform bool useTex;						uniform mat4 cMat;			uniform vec4 cVec;						void main(void) {				vec4 c = useTex ? texture2D(uSampler, texCoord) : color;				c = (cMat*c)+cVec;\n				c.xyz *= min(c.w, 1.0);\n				gl_FragColor = c;			}";
    var t = "			attribute vec3 verPos;			attribute vec2 texPos;						uniform mat4 tMat;						varying vec2 texCoord;						void main(void) {				gl_Position = tMat * vec4(verPos, 1.0);				texCoord = texPos;			}";
    var n = this._getShader(gl, e, true);
    var r = this._getShader(gl, t, false);
    this._sprg = gl.createProgram();
    gl.attachShader(this._sprg, r);
    gl.attachShader(this._sprg, n);
    gl.linkProgram(this._sprg);
    if (!gl.getProgramParameter(this._sprg, gl.LINK_STATUS)) {
        alert("Could not initialise shaders")
    }
    gl.useProgram(this._sprg);
    this._sprg.vpa = gl.getAttribLocation(this._sprg, "verPos");
    this._sprg.tca = gl.getAttribLocation(this._sprg, "texPos");
    gl.enableVertexAttribArray(this._sprg.tca);
    gl.enableVertexAttribArray(this._sprg.vpa);
    this._sprg.tMatUniform = gl.getUniformLocation(this._sprg, "tMat");
    this._sprg.cMatUniform = gl.getUniformLocation(this._sprg, "cMat");
    this._sprg.cVecUniform = gl.getUniformLocation(this._sprg, "cVec");
    this._sprg.samplerUniform = gl.getUniformLocation(this._sprg, "uSampler");
    this._sprg.useTex = gl.getUniformLocation(this._sprg, "useTex");
    this._sprg.color = gl.getUniformLocation(this._sprg, "color")
};
Stage.prototype._initBuffers = function () {
    this._unitIBuffer = gl.createBuffer();
    Stage._setEBF(this._unitIBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array([0, 1, 2, 1, 2, 3]), gl.STATIC_DRAW)
};
Stage.prototype._setFramebuffer = function (e, t, n, r) {
    this._mstack.clear();
    this._mstack.push(this._pmat, 0);
    if (r) {
        this._umat[5] = 2;
        this._umat[13] = -1
    } else {
        this._umat[5] = -2;
        this._umat[13] = 1
    }
    this._mstack.push(this._umat);
    this._smat[0] = 1 / t;
    this._smat[5] = 1 / n;
    this._mstack.push(this._smat);
    gl.bindFramebuffer(gl.FRAMEBUFFER, e);
    if (e) gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_COMPONENT16, t, n);
    gl.viewport(0, 0, t, n)
};
Stage._setStageMouse = function (e) {
    var t = e;
    if (e.type == "touchstart" || e.type == "touchmove" || e.type == "touchend") t = e.touches.item(0);
    var n = t.clientX;
    var r = t.clientY;
    Stage._mouseX = n;
    Stage._mouseY = r
};
Stage.prototype._drawScene = function () {
    if (this._srs) {
        this._resize();
        this.dispatchEvent(this._rsEv);
        this._srs = false
    }
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    if (this._knM) {
        var e = this._moveMouse(Stage._mouseX, Stage._mouseY, true);
        var t = this._mousefocus || this,
            n = e || this;
        if (e != this._mousefocus) {
            if (t != this) {
                var r = this._mouEv;
                r.target = t;
                t.dispatchEvent(r)
            }
            if (n != this) {
                r = this._movEv;
                r.target = n;
                n.dispatchEvent(r)
            }
        }
        var i = this._smd,
            s = this._smu;
        for (var o = 0; o < 3; o++) {
            this._mcEvs[o].target = this._mdEvs[o].target = this._muEvs[o].target = n;
            if (i[o]) {
                n.dispatchEvent(this._mdEvs[o]);
                this._focii[o] = this.focus = e
            }
            if (s[o]) {
                n.dispatchEvent(this._muEvs[o]);
                if (e == this._focii[o]) n.dispatchEvent(this._mcEvs[o])
            }
            i[o] = s[o] = false
        }
        this._mmoEv.target = n;
        if (this._smm) {
            n.dispatchEvent(this._mmoEv)
        }
        this._smm = false;
        this._mousefocus = e;
        var u = false,
            a = n;
        while (a.parent != null) {
            u |= a.buttonMode;
            a = a.parent
        }
        if (u != this._useHand) this._canvas.style.cursor = u ? "pointer" : "default";
        this._useHand = u
    }
    var f = EventDispatcher.efbc;
    var r = this._efEv;
    for (var o = 0; o < f.length; o++) {
        r.target = f[o];
        f[o].dispatchEvent(r)
    }
    this._renderAll(this)
};
Stage._tick = function () {
    _requestAF(Stage._tick);
    Stage.prototype._drawScene.call(Stage._main)
};
Stage._MStack = function () {
    this.mats = [];
    this.size = 1;
    for (var e = 0; e < 30; e++) this.mats.push(Point._m4.create())
};
Stage._MStack.prototype.clear = function () {
    this.size = 1
};
Stage._MStack.prototype.push = function (e) {
    var t = this.size++;
    Point._m4.multiply(this.mats[t - 1], e, this.mats[t])
};
Stage._MStack.prototype.pop = function () {
    this.size--
};
Stage._MStack.prototype.top = function () {
    return this.mats[this.size - 1]
};
Stage._CMStack = function () {
    this.mats = [];
    this.vecs = [];
    this.isID = [];
    this.bmds = [];
    this.lnnm = [];
    this.size = 1;
    this.dirty = true;
    for (var e = 0; e < 30; e++) {
        this.mats.push(Point._m4.create());
        this.vecs.push(new Float32Array(4));
        this.isID.push(true);
        this.bmds.push(BlendMode.NORMAL);
        this.lnnm.push(0)
    }
};
Stage._CMStack.prototype.push = function (e, t, n, r) {
    var i = this.size++;
    this.isID[i] = n;
    if (n) {
        Point._m4.set(this.mats[i - 1], this.mats[i]);
        Point._v4.set(this.vecs[i - 1], this.vecs[i])
    } else {
        Point._m4.multiply(this.mats[i - 1], e, this.mats[i]);
        Point._m4.multiplyVec4(this.mats[i - 1], t, this.vecs[i]);
        Point._v4.add(this.vecs[i - 1], this.vecs[i], this.vecs[i])
    } if (!n) this.dirty = true;
    this.bmds[i] = r;
    this.lnnm[i] = r == BlendMode.NORMAL ? this.lnnm[i - 1] : i
};
Stage._CMStack.prototype.update = function () {
    if (this.dirty) {
        var e = Stage._main,
            t = this.size - 1;
        gl.uniformMatrix4fv(e._sprg.cMatUniform, false, this.mats[t]);
        gl.uniform4fv(e._sprg.cVecUniform, this.vecs[t]);
        this.dirty = false
    }
    var n = this.lnnm[this.size - 1];
    Stage._setBMD(this.bmds[n])
};
Stage._CMStack.prototype.pop = function () {
    if (!this.isID[this.size - 1]) this.dirty = true;
    this.size--
};
Graphics.prototype._render = function (e) {
    gl.uniformMatrix4fv(e._sprg.tMatUniform, false, e._mstack.top());
    e._cmstack.update();
    if (this._ldirty) {
        Stage._setBF(this._lvbuf);
        gl.bufferSubData(gl.ARRAY_BUFFER, 0, this._lvval);
        this._ldirty = false
    }
    var t = this._elems;
    for (var n = 0; n < t.length; n++) t[n].render(e)
};
Graphics.prototype._sendLBuffers = function () {
    Stage._setBF(this._lvbuf);
    gl.bufferData(gl.ARRAY_BUFFER, this._lvval, gl.STATIC_DRAW)
};
Graphics.prototype._newLineSegment = function () {
    var e;
    if (this._duls.length == 0) e = new ULSegment(this._lused, this._clstyle.colARR, this._lvbuf);
    else {
        e = this._duls.pop();
        e.update(this._lused, this._clstyle.colARR)
    }
    this._uls.push(e);
    this._elems.push(e);
    return e
};
Graphics.prototype._checkLineAvail = function (e) {
    var t = this._ltotal;
    if (t - this._lused < e) {
        t = Math.max(t + e, 2 * t);
        var n = this._lvval;
        var r = new Float32Array(18 * t);
        for (var i = 0; i < n.length; i++) r[i] = n[i];
        this._ltotal = t;
        this._lvval = r;
        this._sendLBuffers()
    }
};
Graphics.prototype._putLine = function (e, t, n, r) {
    this._updateSBounds(e, t);
    this._updateSBounds(n, r);
    if (this._lsegment == null) this._lsegment = this._newLineSegment();
    this._checkLineAvail(1);
    var i = .5 * this._clstyle.thickness / this.len(e - n, t - r);
    var s = i * (t - r);
    var o = -i * (e - n);
    var u = this._lvval;
    var a = this._lused * 18;
    u[a++] = e + s;
    u[a++] = t + o;
    a++;
    u[a++] = e - s;
    u[a++] = t - o;
    a++;
    u[a++] = n + s;
    u[a++] = r + o;
    a++;
    u[a++] = e - s;
    u[a++] = t - o;
    a++;
    u[a++] = n + s;
    u[a++] = r + o;
    a++;
    u[a++] = n - s;
    u[a++] = r - o;
    a++;
    this._ldirty = true;
    this._lused++;
    this._lsegment.count++;
    this._empty = false
};
Graphics.prototype.lineStyle = function (e, t, n) {
    if (!t) t = 0;
    if (!n) n = 1;
    if (t != this._clstyle.color || n != this._clstyle.alpha) this._lsegment = null;
    this._clstyle.Set(e, t, n)
};
Graphics.prototype.beginFill = function (e, t) {
    this._ftype = 0;
    if (!t) t = 1;
    this._cfstyle.Set(e, t)
};
Graphics.prototype.beginBitmapFill = function (e) {
    this._ftype = 1;
    this._bdata = e
};
Graphics.prototype.endFill = function () {};
Graphics.prototype.moveTo = function (e, t) {
    this._px = e;
    this._py = t
};
Graphics.prototype.lineTo = function (e, t) {
    this._putLine(this._px, this._py, e, t);
    this._px = e;
    this._py = t
};
Graphics.prototype.len = function (e, t) {
    return Math.sqrt(e * e + t * t)
};
Graphics.prototype.curveTo = function (e, t, n, r) {
    var i = this._px,
        s = this._py,
        o = .666666;
    this.cubicCurveTo(i + o * (e - i), s + o * (t - s), n + o * (e - n), r + o * (t - r), n, r)
};
Graphics.prototype.cubicCurveTo = function (e, t, n, r, i, s) {
    this._checkLineAvail(40);
    if (this._lsegment == null) this._lsegment = this._newLineSegment();
    var o, u, a, f, l, c, h, p, d, v, m, g, y, b, w, E, S, x, T, N, C, k, L, A;
    var O = .5 * this._clstyle.thickness;
    var M, _, D, P, H;
    o = this._px;
    u = this._py;
    y = e - o;
    b = t - u;
    w = n - e;
    E = r - t;
    S = i - n;
    x = s - r;
    step = 1 / 40;
    var B, j, F, I;
    var q = this._lvval;
    var R = this._lused * 18;
    for (var U = 0; U < 41; U++) {
        var z = U * step;
        a = o + z * y;
        f = u + z * b;
        l = e + z * w;
        c = t + z * E;
        h = n + z * S;
        p = r + z * x;
        T = l - a;
        N = c - f;
        C = h - l;
        k = p - c;
        d = a + z * T;
        v = f + z * N;
        m = l + z * C;
        g = c + z * k;
        L = m - d;
        A = g - v;
        P = d + z * L;
        H = v + z * A;
        M = O / this.len(L, A);
        _ = M * A;
        D = -M * L;
        this._updateSBounds(P, H);
        if (U > 0) {
            q[R++] = B + F;
            q[R++] = j + I;
            R++;
            q[R++] = B - F;
            q[R++] = j - I;
            R++;
            q[R++] = P + _;
            q[R++] = H + D;
            R++;
            q[R++] = B - F;
            q[R++] = j - I;
            R++;
            q[R++] = P + _;
            q[R++] = H + D;
            R++;
            q[R++] = P - _;
            q[R++] = H - D;
            R++
        }
        B = P;
        j = H;
        F = _;
        I = D
    }
    this._px = i;
    this._py = s;
    this._ldirty = true;
    this._lused += 40;
    this._lsegment.count += 40;
    this._empty = false
};
Graphics.prototype.drawCircle = function (e, t, n) {
    this.drawEllipse(e, t, n * 2, n * 2)
};
Graphics.prototype.drawEllipse = function (e, t, n, r) {
    var i = Math.PI / 16;
    var s = n * .5;
    var o = r * .5;
    var u = Graphics._eVrt;
    var a = 0;
    for (var f = 0; f < 2 * Math.PI; f += i) {
        u[a++] = e + Math.cos(f) * s;
        u[a++] = t + Math.sin(f) * o
    }
    this.drawTriangles(u, Graphics._eInd)
};
Graphics.prototype.drawRect = function (e, t, n, r) {
    var i = Graphics._rVrt;
    i[0] = i[4] = e;
    i[1] = i[3] = t;
    i[2] = i[6] = e + n;
    i[5] = i[7] = t + r;
    this.drawTriangles(i, Graphics._rInd)
};
Graphics.prototype.drawRoundRect = function (e, t, n, r, i, s) {
    var o = Graphics._rrVrt;
    var u = Math.PI / 14;
    if (!s) s = i;
    var a = i * .5;
    var f = s * .5;
    var l = 0;
    var c = e + a;
    var h = t + f;
    for (var p = -Math.PI; p <= Math.PI; p += u) {
        if (l == 16) c += n - i;
        if (l == 32) h += r - s;
        if (l == 48) c -= n - i;
        if (l > 0 && (l & 15) == 0) p -= u;
        o[l++] = c + Math.cos(p) * a;
        o[l++] = h + Math.sin(p) * f
    }
    this.drawTriangles(o, Graphics._rrInd)
};
Graphics.prototype.drawTriangles = function (e, t, n) {
    this._drawTGS(e, t, n, 2)
};
Graphics.prototype.drawTriangles3D = function (e, t, n) {
    this._drawTGS(e, t, n, 3)
};
Graphics.prototype._drawTGS = function (e, t, n, r) {
    this._lsegment = null;
    var i = Math.floor(e.length / r);
    var s = Math.floor(t.length / 3);
    var o = i + "-" + s;
    var u;
    var a = this._dtgs[o];
    if (a && a.length > 0) u = a.pop();
    else u = new UTgs(i, s);
    var f = 0;
    if (r == 2)
        for (var l = 0; l < e.length; l += 2) {
            var c = e[l];
            var h = e[l + 1];
            u.vrt[f++] = c;
            u.vrt[f++] = h;
            f++;
            this._updateBounds(c, h)
        }
    if (r == 3)
        for (var l = 0; l < e.length; l += 3) {
            var c = e[l];
            var h = e[l + 1];
            var p = e[l + 2];
            u.vrt[f++] = c;
            u.vrt[f++] = h;
            u.vrt[f++] = p;
            this._updateBounds(c, h)
        }
    if (this._ftype == 1) {
        if (n != null)
            for (var l = 0; l < n.length; l++) u.uvt[l] = n[l];
        else u.emptyUVT = true;
        u.dirtyUVT = true
    }
    for (var l = 0; l < t.length; l++) u.ind[l] = t[l];
    if (this._ftype == 1) {
        u.useTex = true;
        u._bdata = this._bdata
    } else {
        u.useTex = false;
        u.SetColor(this._cfstyle.colARR)
    }
    u.updateData();
    this._tgs.push(u);
    this._elems.push(u);
    this._empty = false
};
Graphics.prototype.clear = function () {
    this._duls = this._uls;
    this._dcvs = this._cvs;
    for (var e = 0; e < this._tgs.length; e++) {
        var t = this._tgs[e];
        if (this._dtgs[t.key] == null) this._dtgs[t.key] = [];
        this._dtgs[t.key].push(t)
    }
    this._uls = [];
    this._cvs = [];
    this._tgs = [];
    this._elems = [];
    this._ftype = 0;
    this._empty = true;
    this._minx = this._sminx = this._miny = this._sminy = Number.POSITIVE_INFINITY;
    this._maxx = this._smaxx = this._maxy = this._smaxy = Number.NEGATIVE_INFINITY;
    this._lused = 0;
    this._lsegment = null
};
Graphics.prototype._getRect = function (e) {
    if (this._empty) return null;
    var t = this._tgs.length != 0;
    var n = this._uls.length != 0 || this._cvs.length != 0;
    if (!e && !t) return null;
    var r = this._brect;
    var i = this._sminx,
        s = this._sminy,
        o = this._smaxx,
        u = this._smaxy;
    if (t) {
        r._setP(this._minx, this._miny);
        r._unionWP(this._maxx, this._maxy);
        if (n && e) {
            r._unionWP(i, s);
            r._unionWP(o, u)
        }
        return r
    }
    r._setP(i, s);
    r._unionWP(o, u);
    return r
};
Graphics.prototype._hits = function (e, t) {
    if (this._empty) return false;
    if (e < this._minx || e > this._maxx || t < this._miny || t > this._maxy) return false;
    return true
};
Graphics.prototype._updateBounds = function (e, t) {
    e < this._minx ? this._minx = e : e > this._maxx ? this._maxx = e : 0;
    t < this._miny ? this._miny = t : t > this._maxy ? this._maxy = t : 0
};
Graphics.prototype._updateSBounds = function (e, t) {
    e < this._sminx ? this._sminx = e : e > this._smaxx ? this._smaxx = e : 0;
    t < this._sminy ? this._sminy = t : t > this._smaxy ? this._smaxy = t : 0
};
Graphics._makeConvexInd = function (e) {
    var t = [];
    for (var n = 1; n < e - 1; n++) t.push(0, n, n + 1);
    return t
};
Graphics._rVrt = [0, 0, 0, 0, 0, 0, 0, 0];
Graphics._rInd = [0, 1, 2, 1, 2, 3];
Graphics._eVrt = [];
for (var i = 0; i < 32; i++) Graphics._eVrt.push(0, 0);
Graphics._eInd = Graphics._makeConvexInd(32);
Graphics._rrVrt = [];
for (var i = 0; i < 32; i++) Graphics._rrVrt.push(0, 0);
Graphics._rrInd = Graphics._makeConvexInd(32);
ULSegment.prototype.update = function (e, t) {
    this.count = 0;
    this.offset = e;
    var n = this.color;
    n[0] = t[0];
    n[1] = t[1];
    n[2] = t[2];
    n[3] = t[3]
};
ULSegment.prototype.render = function (e) {
    Stage._setUT(0);
    gl.uniform4fv(e._sprg.color, this.color);
    Stage._setVC(this.vbuf);
    Stage._setTC(this.vbuf);
    gl.drawArrays(gl.TRIANGLES, 6 * this.offset, 6 * this.count)
};
UTgs.prototype.SetColor = function (e) {
    var t = this.color;
    t[0] = e[0];
    t[1] = e[1];
    t[2] = e[2];
    t[3] = e[3]
};
UTgs.prototype._hits = function (e, t) {
    return e > this._minx && e < this._maxx && t > this._miny && t < this._maxy
};
UTgs.prototype.updateData = function () {
    Stage._setBF(this.vbuf);
    gl.bufferSubData(gl.ARRAY_BUFFER, 0, this.vrt);
    Stage._setEBF(this.ibuf);
    gl.bufferSubData(gl.ELEMENT_ARRAY_BUFFER, 0, this.ind);
    Stage._setBF(this.tbuf);
    gl.bufferSubData(gl.ARRAY_BUFFER, 0, this.uvt)
};
UTgs.prototype.render = function (e) {
    if (this.useTex) {
        var t = this._bdata;
        if (t._loaded == false) return;
        if (this.dirtyUVT) {
            this.dirtyUVT = false;
            if (this.emptyUVT) {
                this.emptyUVT = false;
                var n = 1 / t._rwidth,
                    r = 1 / t._rheight;
                for (var i = 0; i < this.uvt.length; i++) {
                    this.uvt[2 * i] = n * this.vrt[3 * i];
                    this.uvt[2 * i + 1] = r * this.vrt[3 * i + 1]
                }
            } else if (t.width != t._rwidth || t.height != t._rheight) {
                var n = t.width / t._rwidth,
                    r = t.height / t._rheight;
                for (var i = 0; i < this.uvt.length; i++) {
                    this.uvt[2 * i] *= n;
                    this.uvt[2 * i + 1] *= r
                }
            }
            this.updateData()
        }
        Stage._setUT(1);
        Stage._setTEX(t._texture)
    } else {
        Stage._setUT(0);
        gl.uniform4fv(e._sprg.color, this.color)
    }
    Stage._setTC(this.tbuf);
    Stage._setVC(this.vbuf);
    Stage._setEBF(this.ibuf);
    gl.drawElements(gl.TRIANGLES, this.ind.length, gl.UNSIGNED_SHORT, 0)
};
UTgs.prototype.clear = function () {
    gl.deleteBuffer(this.vbuf);
    gl.deleteBuffer(this.ibuf);
    gl.deleteBuffer(this.tbuf)
};
FillStyle.prototype.Set = function (e, t) {
    this.color = e;
    this.alpha = t;
    var n = this.colARR;
    n[0] = (e >> 16 & 255) * .0039215686;
    n[1] = (e >> 8 & 255) * .0039215686;
    n[2] = (e & 255) * .0039215686;
    n[3] = t
};
LineStyle.prototype = new FillStyle;
LineStyle.prototype.Set = function (e, t, n) {
    this.thickness = e;
    FillStyle.prototype.Set.call(this, t, n)
};
Sprite.prototype = new DisplayObjectContainer;
Sprite.prototype._render = function (e) {
    if (!this.graphics._empty) this.graphics._render(e);
    DisplayObjectContainer.prototype._render.call(this, e)
};
Sprite.prototype._moveMouse = function (e, t, n) {
    if (!n || !this.visible || !this.mouseChildren && !this.mouseEnabled) return null;
    var r = DisplayObjectContainer.prototype._moveMouse.call(this, e, t, n);
    if (r != null) return r;
    if (!this.mouseEnabled) return null;
    var i = this._temp;
    if (this.graphics._hits(i[0], i[1])) return this;
    return null
};
Sprite.prototype._getRect = function (e) {
    var t;
    var n = DisplayObjectContainer.prototype._getRect.call(this, e);
    var r = this.graphics._getRect(e);
    if (n != null && r != null) n._unionWith(r);
    if (n != null) t = n;
    else t = r;
    return t
};
Sprite.prototype._htpLocal = function (e) {
    var t = this._temp;
    Point._m4.multiplyVec2(this._getIMat(), e, t);
    if (this.graphics._hits(t[0], t[1])) return true;
    return DisplayObjectContainer.prototype._htpLocal.call(this, e)
};
var TextFormatAlign = {
    LEFT: "left",
    CENTER: "center",
    RIGHT: "right",
    JUSTIFY: "justify"
};
TextFormat.prototype.clone = function () {
    return new TextFormat(this.font, this.size, this.color, this.bold, this.italic, this.align, this.leading)
};
TextFormat.prototype.set = function (e) {
    this.font = e.font;
    this.size = e.size;
    this.color = e.color;
    this.bold = e.bold;
    this.italic = e.italic;
    this.align = e.align;
    this.leading = e.leading
};
TextFormat.prototype.getImageData = function (e, t) {
    var n = TextFormat._canvas;
    var r = TextFormat._context;
    var i = this.data;
    n.width = i.rw = this._nhpt(t._areaW);
    n.height = i.rh = this._nhpt(t._areaH);
    var s = this.color;
    var o = s >> 16 & 255;
    var u = s >> 8 & 255;
    var a = s & 255;
    r.textBaseline = "top";
    r.fillStyle = "rgb(" + o + "," + u + "," + a + ")";
    r.font = (this.italic ? "italic " : "") + (this.bold ? "bold " : "") + this.size + "px " + this.font;
    this.maxW = 0;
    var f = e.split("\n");
    var l = 0;
    var c = 0;
    var h = this.size * 1.25;
    for (var p = 0; p < f.length; p++) {
        var d = this.renderPar(f[p], c, h, r, t);
        l += d;
        c += d * (h + this.leading)
    }
    if (this.align == TextFormatAlign.JUSTIFY) this.maxW = Math.max(this.maxW, t._areaW);
    i.image = n;
    i.tw = this.maxW;
    i.th = (h + this.leading) * l - this.leading;
    return i
};
TextFormat.prototype.renderPar = function (e, t, n, r, i) {
    var s;
    if (i._wordWrap) s = e.split(" ");
    else s = [e];
    var o = r.measureText(" ").width;
    var u = 0;
    var a = i._areaW;
    var f = 0;
    var l = [
        []
    ];
    var c = [];
    for (var h = 0; h < s.length; h++) {
        var p = s[h];
        var d = r.measureText(p).width;
        if (u + d <= a || u == 0) {
            l[f].push(p);
            u += d + o
        } else {
            c.push(a - u + o);
            l.push([]);
            f++;
            u = 0;
            h--
        }
    }
    c.push(a - u + o);
    for (var h = 0; h < l.length; h++) {
        var v = l[h];
        while (v[v.length - 1] == "") {
            v.pop();
            c[h] += o
        }
        this.maxW = Math.max(this.maxW, a - c[h]);
        var m, g = t + (n + this.leading) * h;
        u = 0, m = o;
        if (this.align == TextFormatAlign.CENTER) u = c[h] * .5;
        if (this.align == TextFormatAlign.RIGHT) u = c[h];
        if (this.align == TextFormatAlign.JUSTIFY) m = o + c[h] / (v.length - 1);
        for (var y = 0; y < v.length; y++) {
            var p = v[y];
            r.fillText(p, u, g);
            var d = r.measureText(p).width;
            if (h < l.length - 1) u += d + m;
            else {
                u += d + o
            }
        }
    }
    return f + 1
};
TextFormat.prototype._nhpt = function (e) {
    --e;
    for (var t = 1; t < 32; t <<= 1) e = e | e >> t;
    return e + 1
};
TextFormat._canvas = document.createElement("canvas");
TextFormat._context = TextFormat._canvas.getContext("2d");
TextField.prototype = new InteractiveObject;
TextField.prototype.setTextFormat = function (e) {
    this._tForm.set(e);
    this._update()
};
TextField.prototype.getTextFormat = function (e) {
    return this._tForm.clone()
};
TextField.prototype._update = function () {
    var e = this._brect.width = this._areaW;
    var t = this._brect.height = this._areaH;
    if (e == 0 || t == 0) return;
    var n = this._tForm.getImageData(this._text, this);
    this._textW = n.tw;
    this._textH = n.th;
    if (n.rw != this._rwidth || n.rh != this._rheight) {
        gl.deleteTexture(this._texture);
        this._texture = gl.createTexture()
    }
    Stage._setTEX(this._texture);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, n.image);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
    gl.generateMipmap(gl.TEXTURE_2D);
    this._rwidth = n.rw;
    this._rheight = n.rh;
    var r = e / n.rw;
    var i = t / n.rh;
    var s = this._tcArray;
    s[2] = s[6] = r;
    s[5] = s[7] = i;
    Stage._setBF(this._tcBuffer);
    gl.vertexAttribPointer(Stage._main._sprg.tca, 2, gl.FLOAT, false, 0, 0);
    gl.bufferSubData(gl.ARRAY_BUFFER, 0, s);
    var o = this._fArray;
    o[3] = o[9] = e;
    o[7] = o[10] = t;
    Stage._setBF(this._vBuffer);
    gl.vertexAttribPointer(Stage._main._sprg.vpa, 3, gl.FLOAT, false, 0, 0);
    gl.bufferSubData(gl.ARRAY_BUFFER, 0, o)
};
TextField.prototype._render = function (e) {
    if (this._areaW == 0 || this._areaH == 0) return;
    gl.uniformMatrix4fv(e._sprg.tMatUniform, false, e._mstack.top());
    e._cmstack.update();
    Stage._setVC(this._vBuffer);
    Stage._setTC(this._tcBuffer);
    Stage._setUT(1);
    Stage._setTEX(this._texture);
    Stage._setEBF(e._unitIBuffer);
    gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 0)
};
this.tp = TextField.prototype;
tp.ds = tp.__defineSetter__;
tp.dg = tp.__defineGetter__;
tp.dg("textWidth", function () {
    return this._textW
});
tp.dg("textHeight", function () {
    return this._textH
});
tp.ds("wordWrap", function (e) {
    this._wordWrap = e;
    this._update()
});
tp.dg("wordWrap", function () {
    return this._wordWrap
});
tp.ds("width", function (e) {
    this._areaW = Math.max(0, e);
    this._update()
});
tp.dg("width", function () {
    return this._areaW
});
tp.ds("height", function (e) {
    this._areaH = Math.max(0, e);
    this._update()
});
tp.dg("height", function () {
    return this._areaH
});
tp.ds("text", function (e) {
    this._text = e.toString();
    this._update()
});
tp.dg("text", function () {
    return this._text
});
delete tp.ds;
delete tp.dg;
delete this.tp