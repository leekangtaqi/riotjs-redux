'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 *  Entry of application.
 */
var provider = null;
var debug = false;

/**
 *  Set polyfill.
 */

var TagContainerProxy = function () {
    function TagContainerProxy() {
        _classCallCheck(this, TagContainerProxy);

        if (typeof Set === 'undefined') {
            this.container = [];
            this.modern = false;
            return;
        }
        this.container = new Set();
        this.modern = true;
    }

    _createClass(TagContainerProxy, [{
        key: 'del',
        value: function del(tag) {
            if (this.modern === true) {
                return this.container.delete.apply(this.container, [tag]);
            }
            if (!tag['_riot_redux_id']) {
                throw new Error('delete tag from container expected a identity');
            }
            this.container = this.container.filter(function (t) {
                return t['_riot_redux_id'] != tag['_riot_redux_id'];
            });
            return this;
        }
    }, {
        key: 'add',
        value: function add(tag) {
            if (this.modern === true) {
                return this.container.add.apply(this.container, [tag]);
            }
            if (tag['_riot_redux_id'] && this.container.indexOf(tag) >= 0) {
                return;
            }
            tag['_riot_redux_id'] = this.genIdentity(16);
            this.container.push(tag);
            return this;
        }
    }, {
        key: 'genIdentity',
        value: function genIdentity(n) {
            var chars = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
            var res = '';
            for (var i = 0; i < n; i++) {
                var id = Math.ceil(Math.random() * 35);
                res += chars[id];
            }
            return res;
        }
    }, {
        key: 'loop',
        value: function loop(fn) {
            if (this.modern === true) {
                var _iteratorNormalCompletion = true;
                var _didIteratorError = false;
                var _iteratorError = undefined;

                try {
                    for (var _iterator = this.container[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                        var c = _step.value;

                        fn(c);
                    }
                } catch (err) {
                    _didIteratorError = true;
                    _iteratorError = err;
                } finally {
                    try {
                        if (!_iteratorNormalCompletion && _iterator.return) {
                            _iterator.return();
                        }
                    } finally {
                        if (_didIteratorError) {
                            throw _iteratorError;
                        }
                    }
                }

                return;
            }
            this.container.forEach(fn);
            return this;
        }
    }, {
        key: 'get',
        value: function get(tag) {
            var _this = this;

            if (this.modern === true) {
                return this.container.get(tag);
            }
            return Object.keys(this.container).filter(function (k) {
                return _this.container[k] === tag;
            })[0];
        }
    }, {
        key: 'getByTagName',
        value: function getByTagName(tagName) {
            var _this2 = this;

            if (this.modern === true) {
                var _iteratorNormalCompletion2 = true;
                var _didIteratorError2 = false;
                var _iteratorError2 = undefined;

                try {
                    for (var _iterator2 = this.container[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                        var c = _step2.value;

                        if (c.root.localName === tagName) {
                            return c;
                        }
                    }
                } catch (err) {
                    _didIteratorError2 = true;
                    _iteratorError2 = err;
                } finally {
                    try {
                        if (!_iteratorNormalCompletion2 && _iterator2.return) {
                            _iterator2.return();
                        }
                    } finally {
                        if (_didIteratorError2) {
                            throw _iteratorError2;
                        }
                    }
                }
            }
            return Object.keys(this.container).filter(function (k) {
                return _this2.container[k].root.localName === tagName;
            })[0];
        }
    }]);

    return TagContainerProxy;
}();

/**
 *  Array.from polyfill
 */


if (!Array.from) {
    Array.from = function () {
        var toStr = Object.prototype.toString;
        var isCallable = function isCallable(fn) {
            return typeof fn === 'function' || toStr.call(fn) === '[object Function]';
        };
        var toInteger = function toInteger(value) {
            var number = Number(value);
            if (isNaN(number)) {
                return 0;
            }
            if (number === 0 || !isFinite(number)) {
                return number;
            }
            return (number > 0 ? 1 : -1) * Math.floor(Math.abs(number));
        };
        var maxSafeInteger = Math.pow(2, 53) - 1;
        var toLength = function toLength(value) {
            var len = toInteger(value);
            return Math.min(Math.max(len, 0), maxSafeInteger);
        };

        return function from(arrayLike /*, mapFn, thisArg */) {
            var C = this;
            var items = Object(arrayLike);
            if (arrayLike == null) {
                throw new TypeError("Array.from requires an array-like object - not null or undefined");
            }
            var mapFn = arguments.length > 1 ? arguments[1] : void undefined;
            var T;
            if (typeof mapFn !== 'undefined') {
                if (!isCallable(mapFn)) {
                    throw new TypeError('Array.from: when provided, the second argument must be a function');
                }
                if (arguments.length > 2) {
                    T = arguments[2];
                }
            }
            var len = toLength(items.length);
            var A = isCallable(C) ? Object(new C(len)) : new Array(len);
            var k = 0;
            var kValue;
            while (k < len) {
                kValue = items[k];
                if (mapFn) {
                    A[k] = typeof T === 'undefined' ? mapFn(kValue, k) : mapFn.call(T, kValue, k);
                } else {
                    A[k] = kValue;
                }
                k += 1;
            }
            A.length = len;
            return A;
        };
    }();
}

/**
 *  Contain all containers of tag.
 *  when state is changed, mapStateToOpts will be recompute.
 *  tag will be update, when current result of recompute modified.
 */
var containers = new TagContainerProxy();

/**
 *  A mixin for connect the tag to redux store.(react-redux like)
 */
var connect = exports.connect = function connect(mapStateToOpts, mapDispatchToOpts) {
    return function (tag) {
        if (!tag) {
            throw new Error('riot redux connector expected a tag instance.');
        }
        tag.on('unmount', function () {
            containers.del(tag);
        });
        //collect tag to set.
        tag.opts.mapStateToOpts = mapStateToOpts;
        tag.opts.mapDispatchToOpts = mapDispatchToOpts;
        containers.add(tag);

        //find entry.
        var pv = provider || recurFindProvider(tag);
        mapStateToOpts && Object.assign(tag.opts, mapStateToOpts(pv.opts.store.getState(), tag.opts));
        mapDispatchToOpts && Object.assign(tag.opts, mapDispatchToOpts(pv.opts.store.dispatch, tag.opts));
    };
};

/**
 *   Bind application entry for the redux.
 *   @param store Object
 *   @return Function
 */
var provide = exports.provide = function provide(store) {
    var oldState = store.getState();
    return function (entry) {
        provider = entry;
        var distinctMap = {};
        store.subscribe(function (action) {
            var currState = store.getState();
            var callback = null;
            var toUpateSet = new TagContainerProxy();
            containers.loop(function (c) {
                var mapStateToOpts = c.opts.mapStateToOpts;
                if (!mapStateToOpts) {
                    return;
                }
                var prevSnapShot = mapStateToOpts(oldState, c.opts);
                var currSnapShot = mapStateToOpts(currState, c.opts);
                var distincts = recompute(prevSnapShot, currSnapShot);
                var isEqual = !distincts || !distincts.length;
                if (!isEqual) {
                    distincts.forEach(function (k) {
                        if (debug) {
                            if (!distinctMap[c.root.localName]) {
                                distinctMap[c.root.localName] = new TagContainerProxy();
                            }
                            distinctMap[c.root.localName].add(k);
                        }
                        c.opts[k] = currSnapShot[k];
                    });
                    c.show && toUpateSet.add(c);
                }
            });
            if (debug) {
                console.warn(distinctMap);
            }

            var arr = [];
            toUpateSet.loop(function (s) {
                arr.push(s);
            });
            enqueue(arr);
            oldState = currState;
        });
    };
};

var busy = false;
var queue = [];
/**
 * @param snapshot { Array }
 * @param gap { Number }
 * @returns null
 */
var enqueue = function enqueue(snapshot) {
    var during = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;

    if (!snapshot) {
        return;
    }
    queue.push(snapshot);
    if (busy) {
        return;
    }
    busy = true;
    iterator(0, during);
};

var iterator = function iterator(index, during) {
    var i = queue[index];
    setTimeout(function () {
        if (queue[index + 1]) {
            return iterator(index + 1);
        } else {
            compareAndUpate(queue.splice(0, index + 1));
            busy = !busy;
        }
    }, during);
};

var compareAndUpate = function compareAndUpate(arr) {
    var refinedComponents = distinct(Array.from(flat(arr)), function (c) {
        return c.root.localName;
    });
    refinedComponents.map(function (c) {
        c.show && setTimeout(function () {
            c.update();
        }, 0);
    });
};

/**
 *  Helpers
 */
var flat = function flat(arr) {
    return arr.reduce(function (acc, curr) {
        return acc.concat(curr);
    }, []);
};

var distinct = function distinct(arr, fn) {
    var res = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [];

    if (!arr.length) {
        return res;
    }
    var i = arr[0];
    if (res.map(function (r) {
        return fn(r);
    }).indexOf(fn(i)) < 0) {
        res.push(i);
        return distinct(arr.slice(1), fn, res);
    }
    return distinct(arr.slice(1), fn, res);
};

var recurFindProvider = function recurFindProvider(tag) {
    if (!tag.parent) return tag;
    return recurFindProvider(tag.parent);
};

var recompute = function recompute(prev, curr) {
    return Object.keys(curr).filter(function (k) {
        if (!prev.hasOwnProperty(k)) {
            return true;
        }
        if (Array.isArray(prev[k]) && Array.isArray(curr[k]) && prev[k].length === 0 && curr[k].length === 0) {
            return false;
        }
        if (prev[k] != curr[k]) {
            return true;
        }
        return false;
    });
};
