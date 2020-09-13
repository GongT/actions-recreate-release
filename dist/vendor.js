'use strict';

var path = require('path');
var fs = require('fs');
var constants = require('constants');
var Stream$1 = require('stream');
var util$1 = require('util');
var assert = require('assert');
var require$$0 = require('console');
var require$$0$1 = require('os');
var childProcess = require('child_process');
var require$$1 = require('events');
var require$$0$2 = require('buffer');
var http = require('http');
var url = require('url');
var https = require('https');
var zlib = require('zlib');
require('net');
var tls = require('tls');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var path__default = /*#__PURE__*/_interopDefaultLegacy(path);
var fs__default = /*#__PURE__*/_interopDefaultLegacy(fs);
var constants__default = /*#__PURE__*/_interopDefaultLegacy(constants);
var Stream__default = /*#__PURE__*/_interopDefaultLegacy(Stream$1);
var util__default = /*#__PURE__*/_interopDefaultLegacy(util$1);
var assert__default = /*#__PURE__*/_interopDefaultLegacy(assert);
var require$$0__default = /*#__PURE__*/_interopDefaultLegacy(require$$0);
var require$$0__default$1 = /*#__PURE__*/_interopDefaultLegacy(require$$0$1);
var childProcess__default = /*#__PURE__*/_interopDefaultLegacy(childProcess);
var require$$1__default = /*#__PURE__*/_interopDefaultLegacy(require$$1);
var require$$0__default$2 = /*#__PURE__*/_interopDefaultLegacy(require$$0$2);
var http__default = /*#__PURE__*/_interopDefaultLegacy(http);
var url__default = /*#__PURE__*/_interopDefaultLegacy(url);
var https__default = /*#__PURE__*/_interopDefaultLegacy(https);
var zlib__default = /*#__PURE__*/_interopDefaultLegacy(zlib);
var tls__default = /*#__PURE__*/_interopDefaultLegacy(tls);

var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

function createCommonjsModule(fn, basedir, module) {
	return module = {
	  path: basedir,
	  exports: {},
	  require: function (path, base) {
      return commonjsRequire(path, (base === undefined || base === null) ? module.path : base);
    }
	}, fn(module, module.exports), module.exports;
}

function commonjsRequire () {
	throw new Error('Dynamic requires are not currently supported by @rollup/plugin-commonjs');
}

/* -*- Mode: js; js-indent-level: 2; -*- */
/*
 * Copyright 2011 Mozilla Foundation and contributors
 * Licensed under the New BSD license. See LICENSE or:
 * http://opensource.org/licenses/BSD-3-Clause
 */

var intToCharMap = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'.split('');

/**
 * Encode an integer in the range of 0 to 63 to a single base 64 digit.
 */
var encode = function (number) {
  if (0 <= number && number < intToCharMap.length) {
    return intToCharMap[number];
  }
  throw new TypeError("Must be between 0 and 63: " + number);
};

/**
 * Decode a single base 64 character code digit to an integer. Returns -1 on
 * failure.
 */
var decode = function (charCode) {
  var bigA = 65;     // 'A'
  var bigZ = 90;     // 'Z'

  var littleA = 97;  // 'a'
  var littleZ = 122; // 'z'

  var zero = 48;     // '0'
  var nine = 57;     // '9'

  var plus = 43;     // '+'
  var slash = 47;    // '/'

  var littleOffset = 26;
  var numberOffset = 52;

  // 0 - 25: ABCDEFGHIJKLMNOPQRSTUVWXYZ
  if (bigA <= charCode && charCode <= bigZ) {
    return (charCode - bigA);
  }

  // 26 - 51: abcdefghijklmnopqrstuvwxyz
  if (littleA <= charCode && charCode <= littleZ) {
    return (charCode - littleA + littleOffset);
  }

  // 52 - 61: 0123456789
  if (zero <= charCode && charCode <= nine) {
    return (charCode - zero + numberOffset);
  }

  // 62: +
  if (charCode == plus) {
    return 62;
  }

  // 63: /
  if (charCode == slash) {
    return 63;
  }

  // Invalid base64 digit.
  return -1;
};

var base64 = {
	encode: encode,
	decode: decode
};

/* -*- Mode: js; js-indent-level: 2; -*- */
/*
 * Copyright 2011 Mozilla Foundation and contributors
 * Licensed under the New BSD license. See LICENSE or:
 * http://opensource.org/licenses/BSD-3-Clause
 *
 * Based on the Base 64 VLQ implementation in Closure Compiler:
 * https://code.google.com/p/closure-compiler/source/browse/trunk/src/com/google/debugging/sourcemap/Base64VLQ.java
 *
 * Copyright 2011 The Closure Compiler Authors. All rights reserved.
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are
 * met:
 *
 *  * Redistributions of source code must retain the above copyright
 *    notice, this list of conditions and the following disclaimer.
 *  * Redistributions in binary form must reproduce the above
 *    copyright notice, this list of conditions and the following
 *    disclaimer in the documentation and/or other materials provided
 *    with the distribution.
 *  * Neither the name of Google Inc. nor the names of its
 *    contributors may be used to endorse or promote products derived
 *    from this software without specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS
 * "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT
 * LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR
 * A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT
 * OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL,
 * SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
 * LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE,
 * DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY
 * THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
 * OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */



// A single base 64 digit can contain 6 bits of data. For the base 64 variable
// length quantities we use in the source map spec, the first bit is the sign,
// the next four bits are the actual value, and the 6th bit is the
// continuation bit. The continuation bit tells us whether there are more
// digits in this value following this digit.
//
//   Continuation
//   |    Sign
//   |    |
//   V    V
//   101011

var VLQ_BASE_SHIFT = 5;

// binary: 100000
var VLQ_BASE = 1 << VLQ_BASE_SHIFT;

// binary: 011111
var VLQ_BASE_MASK = VLQ_BASE - 1;

// binary: 100000
var VLQ_CONTINUATION_BIT = VLQ_BASE;

/**
 * Converts from a two-complement value to a value where the sign bit is
 * placed in the least significant bit.  For example, as decimals:
 *   1 becomes 2 (10 binary), -1 becomes 3 (11 binary)
 *   2 becomes 4 (100 binary), -2 becomes 5 (101 binary)
 */
function toVLQSigned(aValue) {
  return aValue < 0
    ? ((-aValue) << 1) + 1
    : (aValue << 1) + 0;
}

/**
 * Converts to a two-complement value from a value where the sign bit is
 * placed in the least significant bit.  For example, as decimals:
 *   2 (10 binary) becomes 1, 3 (11 binary) becomes -1
 *   4 (100 binary) becomes 2, 5 (101 binary) becomes -2
 */
function fromVLQSigned(aValue) {
  var isNegative = (aValue & 1) === 1;
  var shifted = aValue >> 1;
  return isNegative
    ? -shifted
    : shifted;
}

/**
 * Returns the base 64 VLQ encoded value.
 */
var encode$1 = function base64VLQ_encode(aValue) {
  var encoded = "";
  var digit;

  var vlq = toVLQSigned(aValue);

  do {
    digit = vlq & VLQ_BASE_MASK;
    vlq >>>= VLQ_BASE_SHIFT;
    if (vlq > 0) {
      // There are still more digits in this value, so we must make sure the
      // continuation bit is marked.
      digit |= VLQ_CONTINUATION_BIT;
    }
    encoded += base64.encode(digit);
  } while (vlq > 0);

  return encoded;
};

/**
 * Decodes the next base 64 VLQ value from the given string and returns the
 * value and the rest of the string via the out parameter.
 */
var decode$1 = function base64VLQ_decode(aStr, aIndex, aOutParam) {
  var strLen = aStr.length;
  var result = 0;
  var shift = 0;
  var continuation, digit;

  do {
    if (aIndex >= strLen) {
      throw new Error("Expected more digits in base 64 VLQ value.");
    }

    digit = base64.decode(aStr.charCodeAt(aIndex++));
    if (digit === -1) {
      throw new Error("Invalid base64 digit: " + aStr.charAt(aIndex - 1));
    }

    continuation = !!(digit & VLQ_CONTINUATION_BIT);
    digit &= VLQ_BASE_MASK;
    result = result + (digit << shift);
    shift += VLQ_BASE_SHIFT;
  } while (continuation);

  aOutParam.value = fromVLQSigned(result);
  aOutParam.rest = aIndex;
};

var base64Vlq = {
	encode: encode$1,
	decode: decode$1
};

var util = createCommonjsModule(function (module, exports) {
/* -*- Mode: js; js-indent-level: 2; -*- */
/*
 * Copyright 2011 Mozilla Foundation and contributors
 * Licensed under the New BSD license. See LICENSE or:
 * http://opensource.org/licenses/BSD-3-Clause
 */

/**
 * This is a helper function for getting values from parameter/options
 * objects.
 *
 * @param args The object we are extracting values from
 * @param name The name of the property we are getting.
 * @param defaultValue An optional value to return if the property is missing
 * from the object. If this is not specified and the property is missing, an
 * error will be thrown.
 */
function getArg(aArgs, aName, aDefaultValue) {
  if (aName in aArgs) {
    return aArgs[aName];
  } else if (arguments.length === 3) {
    return aDefaultValue;
  } else {
    throw new Error('"' + aName + '" is a required argument.');
  }
}
exports.getArg = getArg;

var urlRegexp = /^(?:([\w+\-.]+):)?\/\/(?:(\w+:\w+)@)?([\w.-]*)(?::(\d+))?(.*)$/;
var dataUrlRegexp = /^data:.+\,.+$/;

function urlParse(aUrl) {
  var match = aUrl.match(urlRegexp);
  if (!match) {
    return null;
  }
  return {
    scheme: match[1],
    auth: match[2],
    host: match[3],
    port: match[4],
    path: match[5]
  };
}
exports.urlParse = urlParse;

function urlGenerate(aParsedUrl) {
  var url = '';
  if (aParsedUrl.scheme) {
    url += aParsedUrl.scheme + ':';
  }
  url += '//';
  if (aParsedUrl.auth) {
    url += aParsedUrl.auth + '@';
  }
  if (aParsedUrl.host) {
    url += aParsedUrl.host;
  }
  if (aParsedUrl.port) {
    url += ":" + aParsedUrl.port;
  }
  if (aParsedUrl.path) {
    url += aParsedUrl.path;
  }
  return url;
}
exports.urlGenerate = urlGenerate;

/**
 * Normalizes a path, or the path portion of a URL:
 *
 * - Replaces consecutive slashes with one slash.
 * - Removes unnecessary '.' parts.
 * - Removes unnecessary '<dir>/..' parts.
 *
 * Based on code in the Node.js 'path' core module.
 *
 * @param aPath The path or url to normalize.
 */
function normalize(aPath) {
  var path = aPath;
  var url = urlParse(aPath);
  if (url) {
    if (!url.path) {
      return aPath;
    }
    path = url.path;
  }
  var isAbsolute = exports.isAbsolute(path);

  var parts = path.split(/\/+/);
  for (var part, up = 0, i = parts.length - 1; i >= 0; i--) {
    part = parts[i];
    if (part === '.') {
      parts.splice(i, 1);
    } else if (part === '..') {
      up++;
    } else if (up > 0) {
      if (part === '') {
        // The first part is blank if the path is absolute. Trying to go
        // above the root is a no-op. Therefore we can remove all '..' parts
        // directly after the root.
        parts.splice(i + 1, up);
        up = 0;
      } else {
        parts.splice(i, 2);
        up--;
      }
    }
  }
  path = parts.join('/');

  if (path === '') {
    path = isAbsolute ? '/' : '.';
  }

  if (url) {
    url.path = path;
    return urlGenerate(url);
  }
  return path;
}
exports.normalize = normalize;

/**
 * Joins two paths/URLs.
 *
 * @param aRoot The root path or URL.
 * @param aPath The path or URL to be joined with the root.
 *
 * - If aPath is a URL or a data URI, aPath is returned, unless aPath is a
 *   scheme-relative URL: Then the scheme of aRoot, if any, is prepended
 *   first.
 * - Otherwise aPath is a path. If aRoot is a URL, then its path portion
 *   is updated with the result and aRoot is returned. Otherwise the result
 *   is returned.
 *   - If aPath is absolute, the result is aPath.
 *   - Otherwise the two paths are joined with a slash.
 * - Joining for example 'http://' and 'www.example.com' is also supported.
 */
function join(aRoot, aPath) {
  if (aRoot === "") {
    aRoot = ".";
  }
  if (aPath === "") {
    aPath = ".";
  }
  var aPathUrl = urlParse(aPath);
  var aRootUrl = urlParse(aRoot);
  if (aRootUrl) {
    aRoot = aRootUrl.path || '/';
  }

  // `join(foo, '//www.example.org')`
  if (aPathUrl && !aPathUrl.scheme) {
    if (aRootUrl) {
      aPathUrl.scheme = aRootUrl.scheme;
    }
    return urlGenerate(aPathUrl);
  }

  if (aPathUrl || aPath.match(dataUrlRegexp)) {
    return aPath;
  }

  // `join('http://', 'www.example.com')`
  if (aRootUrl && !aRootUrl.host && !aRootUrl.path) {
    aRootUrl.host = aPath;
    return urlGenerate(aRootUrl);
  }

  var joined = aPath.charAt(0) === '/'
    ? aPath
    : normalize(aRoot.replace(/\/+$/, '') + '/' + aPath);

  if (aRootUrl) {
    aRootUrl.path = joined;
    return urlGenerate(aRootUrl);
  }
  return joined;
}
exports.join = join;

exports.isAbsolute = function (aPath) {
  return aPath.charAt(0) === '/' || urlRegexp.test(aPath);
};

/**
 * Make a path relative to a URL or another path.
 *
 * @param aRoot The root path or URL.
 * @param aPath The path or URL to be made relative to aRoot.
 */
function relative(aRoot, aPath) {
  if (aRoot === "") {
    aRoot = ".";
  }

  aRoot = aRoot.replace(/\/$/, '');

  // It is possible for the path to be above the root. In this case, simply
  // checking whether the root is a prefix of the path won't work. Instead, we
  // need to remove components from the root one by one, until either we find
  // a prefix that fits, or we run out of components to remove.
  var level = 0;
  while (aPath.indexOf(aRoot + '/') !== 0) {
    var index = aRoot.lastIndexOf("/");
    if (index < 0) {
      return aPath;
    }

    // If the only part of the root that is left is the scheme (i.e. http://,
    // file:///, etc.), one or more slashes (/), or simply nothing at all, we
    // have exhausted all components, so the path is not relative to the root.
    aRoot = aRoot.slice(0, index);
    if (aRoot.match(/^([^\/]+:\/)?\/*$/)) {
      return aPath;
    }

    ++level;
  }

  // Make sure we add a "../" for each component we removed from the root.
  return Array(level + 1).join("../") + aPath.substr(aRoot.length + 1);
}
exports.relative = relative;

var supportsNullProto = (function () {
  var obj = Object.create(null);
  return !('__proto__' in obj);
}());

function identity (s) {
  return s;
}

/**
 * Because behavior goes wacky when you set `__proto__` on objects, we
 * have to prefix all the strings in our set with an arbitrary character.
 *
 * See https://github.com/mozilla/source-map/pull/31 and
 * https://github.com/mozilla/source-map/issues/30
 *
 * @param String aStr
 */
function toSetString(aStr) {
  if (isProtoString(aStr)) {
    return '$' + aStr;
  }

  return aStr;
}
exports.toSetString = supportsNullProto ? identity : toSetString;

function fromSetString(aStr) {
  if (isProtoString(aStr)) {
    return aStr.slice(1);
  }

  return aStr;
}
exports.fromSetString = supportsNullProto ? identity : fromSetString;

function isProtoString(s) {
  if (!s) {
    return false;
  }

  var length = s.length;

  if (length < 9 /* "__proto__".length */) {
    return false;
  }

  if (s.charCodeAt(length - 1) !== 95  /* '_' */ ||
      s.charCodeAt(length - 2) !== 95  /* '_' */ ||
      s.charCodeAt(length - 3) !== 111 /* 'o' */ ||
      s.charCodeAt(length - 4) !== 116 /* 't' */ ||
      s.charCodeAt(length - 5) !== 111 /* 'o' */ ||
      s.charCodeAt(length - 6) !== 114 /* 'r' */ ||
      s.charCodeAt(length - 7) !== 112 /* 'p' */ ||
      s.charCodeAt(length - 8) !== 95  /* '_' */ ||
      s.charCodeAt(length - 9) !== 95  /* '_' */) {
    return false;
  }

  for (var i = length - 10; i >= 0; i--) {
    if (s.charCodeAt(i) !== 36 /* '$' */) {
      return false;
    }
  }

  return true;
}

/**
 * Comparator between two mappings where the original positions are compared.
 *
 * Optionally pass in `true` as `onlyCompareGenerated` to consider two
 * mappings with the same original source/line/column, but different generated
 * line and column the same. Useful when searching for a mapping with a
 * stubbed out mapping.
 */
function compareByOriginalPositions(mappingA, mappingB, onlyCompareOriginal) {
  var cmp = strcmp(mappingA.source, mappingB.source);
  if (cmp !== 0) {
    return cmp;
  }

  cmp = mappingA.originalLine - mappingB.originalLine;
  if (cmp !== 0) {
    return cmp;
  }

  cmp = mappingA.originalColumn - mappingB.originalColumn;
  if (cmp !== 0 || onlyCompareOriginal) {
    return cmp;
  }

  cmp = mappingA.generatedColumn - mappingB.generatedColumn;
  if (cmp !== 0) {
    return cmp;
  }

  cmp = mappingA.generatedLine - mappingB.generatedLine;
  if (cmp !== 0) {
    return cmp;
  }

  return strcmp(mappingA.name, mappingB.name);
}
exports.compareByOriginalPositions = compareByOriginalPositions;

/**
 * Comparator between two mappings with deflated source and name indices where
 * the generated positions are compared.
 *
 * Optionally pass in `true` as `onlyCompareGenerated` to consider two
 * mappings with the same generated line and column, but different
 * source/name/original line and column the same. Useful when searching for a
 * mapping with a stubbed out mapping.
 */
function compareByGeneratedPositionsDeflated(mappingA, mappingB, onlyCompareGenerated) {
  var cmp = mappingA.generatedLine - mappingB.generatedLine;
  if (cmp !== 0) {
    return cmp;
  }

  cmp = mappingA.generatedColumn - mappingB.generatedColumn;
  if (cmp !== 0 || onlyCompareGenerated) {
    return cmp;
  }

  cmp = strcmp(mappingA.source, mappingB.source);
  if (cmp !== 0) {
    return cmp;
  }

  cmp = mappingA.originalLine - mappingB.originalLine;
  if (cmp !== 0) {
    return cmp;
  }

  cmp = mappingA.originalColumn - mappingB.originalColumn;
  if (cmp !== 0) {
    return cmp;
  }

  return strcmp(mappingA.name, mappingB.name);
}
exports.compareByGeneratedPositionsDeflated = compareByGeneratedPositionsDeflated;

function strcmp(aStr1, aStr2) {
  if (aStr1 === aStr2) {
    return 0;
  }

  if (aStr1 === null) {
    return 1; // aStr2 !== null
  }

  if (aStr2 === null) {
    return -1; // aStr1 !== null
  }

  if (aStr1 > aStr2) {
    return 1;
  }

  return -1;
}

/**
 * Comparator between two mappings with inflated source and name strings where
 * the generated positions are compared.
 */
function compareByGeneratedPositionsInflated(mappingA, mappingB) {
  var cmp = mappingA.generatedLine - mappingB.generatedLine;
  if (cmp !== 0) {
    return cmp;
  }

  cmp = mappingA.generatedColumn - mappingB.generatedColumn;
  if (cmp !== 0) {
    return cmp;
  }

  cmp = strcmp(mappingA.source, mappingB.source);
  if (cmp !== 0) {
    return cmp;
  }

  cmp = mappingA.originalLine - mappingB.originalLine;
  if (cmp !== 0) {
    return cmp;
  }

  cmp = mappingA.originalColumn - mappingB.originalColumn;
  if (cmp !== 0) {
    return cmp;
  }

  return strcmp(mappingA.name, mappingB.name);
}
exports.compareByGeneratedPositionsInflated = compareByGeneratedPositionsInflated;

/**
 * Strip any JSON XSSI avoidance prefix from the string (as documented
 * in the source maps specification), and then parse the string as
 * JSON.
 */
function parseSourceMapInput(str) {
  return JSON.parse(str.replace(/^\)]}'[^\n]*\n/, ''));
}
exports.parseSourceMapInput = parseSourceMapInput;

/**
 * Compute the URL of a source given the the source root, the source's
 * URL, and the source map's URL.
 */
function computeSourceURL(sourceRoot, sourceURL, sourceMapURL) {
  sourceURL = sourceURL || '';

  if (sourceRoot) {
    // This follows what Chrome does.
    if (sourceRoot[sourceRoot.length - 1] !== '/' && sourceURL[0] !== '/') {
      sourceRoot += '/';
    }
    // The spec says:
    //   Line 4: An optional source root, useful for relocating source
    //   files on a server or removing repeated values in the
    //   “sources” entry.  This value is prepended to the individual
    //   entries in the “source” field.
    sourceURL = sourceRoot + sourceURL;
  }

  // Historically, SourceMapConsumer did not take the sourceMapURL as
  // a parameter.  This mode is still somewhat supported, which is why
  // this code block is conditional.  However, it's preferable to pass
  // the source map URL to SourceMapConsumer, so that this function
  // can implement the source URL resolution algorithm as outlined in
  // the spec.  This block is basically the equivalent of:
  //    new URL(sourceURL, sourceMapURL).toString()
  // ... except it avoids using URL, which wasn't available in the
  // older releases of node still supported by this library.
  //
  // The spec says:
  //   If the sources are not absolute URLs after prepending of the
  //   “sourceRoot”, the sources are resolved relative to the
  //   SourceMap (like resolving script src in a html document).
  if (sourceMapURL) {
    var parsed = urlParse(sourceMapURL);
    if (!parsed) {
      throw new Error("sourceMapURL could not be parsed");
    }
    if (parsed.path) {
      // Strip the last path component, but keep the "/".
      var index = parsed.path.lastIndexOf('/');
      if (index >= 0) {
        parsed.path = parsed.path.substring(0, index + 1);
      }
    }
    sourceURL = join(urlGenerate(parsed), sourceURL);
  }

  return normalize(sourceURL);
}
exports.computeSourceURL = computeSourceURL;
});

/* -*- Mode: js; js-indent-level: 2; -*- */
/*
 * Copyright 2011 Mozilla Foundation and contributors
 * Licensed under the New BSD license. See LICENSE or:
 * http://opensource.org/licenses/BSD-3-Clause
 */


var has = Object.prototype.hasOwnProperty;
var hasNativeMap = typeof Map !== "undefined";

/**
 * A data structure which is a combination of an array and a set. Adding a new
 * member is O(1), testing for membership is O(1), and finding the index of an
 * element is O(1). Removing elements from the set is not supported. Only
 * strings are supported for membership.
 */
function ArraySet() {
  this._array = [];
  this._set = hasNativeMap ? new Map() : Object.create(null);
}

/**
 * Static method for creating ArraySet instances from an existing array.
 */
ArraySet.fromArray = function ArraySet_fromArray(aArray, aAllowDuplicates) {
  var set = new ArraySet();
  for (var i = 0, len = aArray.length; i < len; i++) {
    set.add(aArray[i], aAllowDuplicates);
  }
  return set;
};

/**
 * Return how many unique items are in this ArraySet. If duplicates have been
 * added, than those do not count towards the size.
 *
 * @returns Number
 */
ArraySet.prototype.size = function ArraySet_size() {
  return hasNativeMap ? this._set.size : Object.getOwnPropertyNames(this._set).length;
};

/**
 * Add the given string to this set.
 *
 * @param String aStr
 */
ArraySet.prototype.add = function ArraySet_add(aStr, aAllowDuplicates) {
  var sStr = hasNativeMap ? aStr : util.toSetString(aStr);
  var isDuplicate = hasNativeMap ? this.has(aStr) : has.call(this._set, sStr);
  var idx = this._array.length;
  if (!isDuplicate || aAllowDuplicates) {
    this._array.push(aStr);
  }
  if (!isDuplicate) {
    if (hasNativeMap) {
      this._set.set(aStr, idx);
    } else {
      this._set[sStr] = idx;
    }
  }
};

/**
 * Is the given string a member of this set?
 *
 * @param String aStr
 */
ArraySet.prototype.has = function ArraySet_has(aStr) {
  if (hasNativeMap) {
    return this._set.has(aStr);
  } else {
    var sStr = util.toSetString(aStr);
    return has.call(this._set, sStr);
  }
};

/**
 * What is the index of the given string in the array?
 *
 * @param String aStr
 */
ArraySet.prototype.indexOf = function ArraySet_indexOf(aStr) {
  if (hasNativeMap) {
    var idx = this._set.get(aStr);
    if (idx >= 0) {
        return idx;
    }
  } else {
    var sStr = util.toSetString(aStr);
    if (has.call(this._set, sStr)) {
      return this._set[sStr];
    }
  }

  throw new Error('"' + aStr + '" is not in the set.');
};

/**
 * What is the element at the given index?
 *
 * @param Number aIdx
 */
ArraySet.prototype.at = function ArraySet_at(aIdx) {
  if (aIdx >= 0 && aIdx < this._array.length) {
    return this._array[aIdx];
  }
  throw new Error('No element indexed by ' + aIdx);
};

/**
 * Returns the array representation of this set (which has the proper indices
 * indicated by indexOf). Note that this is a copy of the internal array used
 * for storing the members so that no one can mess with internal state.
 */
ArraySet.prototype.toArray = function ArraySet_toArray() {
  return this._array.slice();
};

var ArraySet_1 = ArraySet;

var arraySet = {
	ArraySet: ArraySet_1
};

/* -*- Mode: js; js-indent-level: 2; -*- */
/*
 * Copyright 2014 Mozilla Foundation and contributors
 * Licensed under the New BSD license. See LICENSE or:
 * http://opensource.org/licenses/BSD-3-Clause
 */



/**
 * Determine whether mappingB is after mappingA with respect to generated
 * position.
 */
function generatedPositionAfter(mappingA, mappingB) {
  // Optimized for most common case
  var lineA = mappingA.generatedLine;
  var lineB = mappingB.generatedLine;
  var columnA = mappingA.generatedColumn;
  var columnB = mappingB.generatedColumn;
  return lineB > lineA || lineB == lineA && columnB >= columnA ||
         util.compareByGeneratedPositionsInflated(mappingA, mappingB) <= 0;
}

/**
 * A data structure to provide a sorted view of accumulated mappings in a
 * performance conscious manner. It trades a neglibable overhead in general
 * case for a large speedup in case of mappings being added in order.
 */
function MappingList() {
  this._array = [];
  this._sorted = true;
  // Serves as infimum
  this._last = {generatedLine: -1, generatedColumn: 0};
}

/**
 * Iterate through internal items. This method takes the same arguments that
 * `Array.prototype.forEach` takes.
 *
 * NOTE: The order of the mappings is NOT guaranteed.
 */
MappingList.prototype.unsortedForEach =
  function MappingList_forEach(aCallback, aThisArg) {
    this._array.forEach(aCallback, aThisArg);
  };

/**
 * Add the given source mapping.
 *
 * @param Object aMapping
 */
MappingList.prototype.add = function MappingList_add(aMapping) {
  if (generatedPositionAfter(this._last, aMapping)) {
    this._last = aMapping;
    this._array.push(aMapping);
  } else {
    this._sorted = false;
    this._array.push(aMapping);
  }
};

/**
 * Returns the flat, sorted array of mappings. The mappings are sorted by
 * generated position.
 *
 * WARNING: This method returns internal data without copying, for
 * performance. The return value must NOT be mutated, and should be treated as
 * an immutable borrow. If you want to take ownership, you must make your own
 * copy.
 */
MappingList.prototype.toArray = function MappingList_toArray() {
  if (!this._sorted) {
    this._array.sort(util.compareByGeneratedPositionsInflated);
    this._sorted = true;
  }
  return this._array;
};

var MappingList_1 = MappingList;

var mappingList = {
	MappingList: MappingList_1
};

/* -*- Mode: js; js-indent-level: 2; -*- */
/*
 * Copyright 2011 Mozilla Foundation and contributors
 * Licensed under the New BSD license. See LICENSE or:
 * http://opensource.org/licenses/BSD-3-Clause
 */



var ArraySet$1 = arraySet.ArraySet;
var MappingList$1 = mappingList.MappingList;

/**
 * An instance of the SourceMapGenerator represents a source map which is
 * being built incrementally. You may pass an object with the following
 * properties:
 *
 *   - file: The filename of the generated source.
 *   - sourceRoot: A root for all relative URLs in this source map.
 */
function SourceMapGenerator(aArgs) {
  if (!aArgs) {
    aArgs = {};
  }
  this._file = util.getArg(aArgs, 'file', null);
  this._sourceRoot = util.getArg(aArgs, 'sourceRoot', null);
  this._skipValidation = util.getArg(aArgs, 'skipValidation', false);
  this._sources = new ArraySet$1();
  this._names = new ArraySet$1();
  this._mappings = new MappingList$1();
  this._sourcesContents = null;
}

SourceMapGenerator.prototype._version = 3;

/**
 * Creates a new SourceMapGenerator based on a SourceMapConsumer
 *
 * @param aSourceMapConsumer The SourceMap.
 */
SourceMapGenerator.fromSourceMap =
  function SourceMapGenerator_fromSourceMap(aSourceMapConsumer) {
    var sourceRoot = aSourceMapConsumer.sourceRoot;
    var generator = new SourceMapGenerator({
      file: aSourceMapConsumer.file,
      sourceRoot: sourceRoot
    });
    aSourceMapConsumer.eachMapping(function (mapping) {
      var newMapping = {
        generated: {
          line: mapping.generatedLine,
          column: mapping.generatedColumn
        }
      };

      if (mapping.source != null) {
        newMapping.source = mapping.source;
        if (sourceRoot != null) {
          newMapping.source = util.relative(sourceRoot, newMapping.source);
        }

        newMapping.original = {
          line: mapping.originalLine,
          column: mapping.originalColumn
        };

        if (mapping.name != null) {
          newMapping.name = mapping.name;
        }
      }

      generator.addMapping(newMapping);
    });
    aSourceMapConsumer.sources.forEach(function (sourceFile) {
      var sourceRelative = sourceFile;
      if (sourceRoot !== null) {
        sourceRelative = util.relative(sourceRoot, sourceFile);
      }

      if (!generator._sources.has(sourceRelative)) {
        generator._sources.add(sourceRelative);
      }

      var content = aSourceMapConsumer.sourceContentFor(sourceFile);
      if (content != null) {
        generator.setSourceContent(sourceFile, content);
      }
    });
    return generator;
  };

/**
 * Add a single mapping from original source line and column to the generated
 * source's line and column for this source map being created. The mapping
 * object should have the following properties:
 *
 *   - generated: An object with the generated line and column positions.
 *   - original: An object with the original line and column positions.
 *   - source: The original source file (relative to the sourceRoot).
 *   - name: An optional original token name for this mapping.
 */
SourceMapGenerator.prototype.addMapping =
  function SourceMapGenerator_addMapping(aArgs) {
    var generated = util.getArg(aArgs, 'generated');
    var original = util.getArg(aArgs, 'original', null);
    var source = util.getArg(aArgs, 'source', null);
    var name = util.getArg(aArgs, 'name', null);

    if (!this._skipValidation) {
      this._validateMapping(generated, original, source, name);
    }

    if (source != null) {
      source = String(source);
      if (!this._sources.has(source)) {
        this._sources.add(source);
      }
    }

    if (name != null) {
      name = String(name);
      if (!this._names.has(name)) {
        this._names.add(name);
      }
    }

    this._mappings.add({
      generatedLine: generated.line,
      generatedColumn: generated.column,
      originalLine: original != null && original.line,
      originalColumn: original != null && original.column,
      source: source,
      name: name
    });
  };

/**
 * Set the source content for a source file.
 */
SourceMapGenerator.prototype.setSourceContent =
  function SourceMapGenerator_setSourceContent(aSourceFile, aSourceContent) {
    var source = aSourceFile;
    if (this._sourceRoot != null) {
      source = util.relative(this._sourceRoot, source);
    }

    if (aSourceContent != null) {
      // Add the source content to the _sourcesContents map.
      // Create a new _sourcesContents map if the property is null.
      if (!this._sourcesContents) {
        this._sourcesContents = Object.create(null);
      }
      this._sourcesContents[util.toSetString(source)] = aSourceContent;
    } else if (this._sourcesContents) {
      // Remove the source file from the _sourcesContents map.
      // If the _sourcesContents map is empty, set the property to null.
      delete this._sourcesContents[util.toSetString(source)];
      if (Object.keys(this._sourcesContents).length === 0) {
        this._sourcesContents = null;
      }
    }
  };

/**
 * Applies the mappings of a sub-source-map for a specific source file to the
 * source map being generated. Each mapping to the supplied source file is
 * rewritten using the supplied source map. Note: The resolution for the
 * resulting mappings is the minimium of this map and the supplied map.
 *
 * @param aSourceMapConsumer The source map to be applied.
 * @param aSourceFile Optional. The filename of the source file.
 *        If omitted, SourceMapConsumer's file property will be used.
 * @param aSourceMapPath Optional. The dirname of the path to the source map
 *        to be applied. If relative, it is relative to the SourceMapConsumer.
 *        This parameter is needed when the two source maps aren't in the same
 *        directory, and the source map to be applied contains relative source
 *        paths. If so, those relative source paths need to be rewritten
 *        relative to the SourceMapGenerator.
 */
SourceMapGenerator.prototype.applySourceMap =
  function SourceMapGenerator_applySourceMap(aSourceMapConsumer, aSourceFile, aSourceMapPath) {
    var sourceFile = aSourceFile;
    // If aSourceFile is omitted, we will use the file property of the SourceMap
    if (aSourceFile == null) {
      if (aSourceMapConsumer.file == null) {
        throw new Error(
          'SourceMapGenerator.prototype.applySourceMap requires either an explicit source file, ' +
          'or the source map\'s "file" property. Both were omitted.'
        );
      }
      sourceFile = aSourceMapConsumer.file;
    }
    var sourceRoot = this._sourceRoot;
    // Make "sourceFile" relative if an absolute Url is passed.
    if (sourceRoot != null) {
      sourceFile = util.relative(sourceRoot, sourceFile);
    }
    // Applying the SourceMap can add and remove items from the sources and
    // the names array.
    var newSources = new ArraySet$1();
    var newNames = new ArraySet$1();

    // Find mappings for the "sourceFile"
    this._mappings.unsortedForEach(function (mapping) {
      if (mapping.source === sourceFile && mapping.originalLine != null) {
        // Check if it can be mapped by the source map, then update the mapping.
        var original = aSourceMapConsumer.originalPositionFor({
          line: mapping.originalLine,
          column: mapping.originalColumn
        });
        if (original.source != null) {
          // Copy mapping
          mapping.source = original.source;
          if (aSourceMapPath != null) {
            mapping.source = util.join(aSourceMapPath, mapping.source);
          }
          if (sourceRoot != null) {
            mapping.source = util.relative(sourceRoot, mapping.source);
          }
          mapping.originalLine = original.line;
          mapping.originalColumn = original.column;
          if (original.name != null) {
            mapping.name = original.name;
          }
        }
      }

      var source = mapping.source;
      if (source != null && !newSources.has(source)) {
        newSources.add(source);
      }

      var name = mapping.name;
      if (name != null && !newNames.has(name)) {
        newNames.add(name);
      }

    }, this);
    this._sources = newSources;
    this._names = newNames;

    // Copy sourcesContents of applied map.
    aSourceMapConsumer.sources.forEach(function (sourceFile) {
      var content = aSourceMapConsumer.sourceContentFor(sourceFile);
      if (content != null) {
        if (aSourceMapPath != null) {
          sourceFile = util.join(aSourceMapPath, sourceFile);
        }
        if (sourceRoot != null) {
          sourceFile = util.relative(sourceRoot, sourceFile);
        }
        this.setSourceContent(sourceFile, content);
      }
    }, this);
  };

/**
 * A mapping can have one of the three levels of data:
 *
 *   1. Just the generated position.
 *   2. The Generated position, original position, and original source.
 *   3. Generated and original position, original source, as well as a name
 *      token.
 *
 * To maintain consistency, we validate that any new mapping being added falls
 * in to one of these categories.
 */
SourceMapGenerator.prototype._validateMapping =
  function SourceMapGenerator_validateMapping(aGenerated, aOriginal, aSource,
                                              aName) {
    // When aOriginal is truthy but has empty values for .line and .column,
    // it is most likely a programmer error. In this case we throw a very
    // specific error message to try to guide them the right way.
    // For example: https://github.com/Polymer/polymer-bundler/pull/519
    if (aOriginal && typeof aOriginal.line !== 'number' && typeof aOriginal.column !== 'number') {
        throw new Error(
            'original.line and original.column are not numbers -- you probably meant to omit ' +
            'the original mapping entirely and only map the generated position. If so, pass ' +
            'null for the original mapping instead of an object with empty or null values.'
        );
    }

    if (aGenerated && 'line' in aGenerated && 'column' in aGenerated
        && aGenerated.line > 0 && aGenerated.column >= 0
        && !aOriginal && !aSource && !aName) {
      // Case 1.
      return;
    }
    else if (aGenerated && 'line' in aGenerated && 'column' in aGenerated
             && aOriginal && 'line' in aOriginal && 'column' in aOriginal
             && aGenerated.line > 0 && aGenerated.column >= 0
             && aOriginal.line > 0 && aOriginal.column >= 0
             && aSource) {
      // Cases 2 and 3.
      return;
    }
    else {
      throw new Error('Invalid mapping: ' + JSON.stringify({
        generated: aGenerated,
        source: aSource,
        original: aOriginal,
        name: aName
      }));
    }
  };

/**
 * Serialize the accumulated mappings in to the stream of base 64 VLQs
 * specified by the source map format.
 */
SourceMapGenerator.prototype._serializeMappings =
  function SourceMapGenerator_serializeMappings() {
    var previousGeneratedColumn = 0;
    var previousGeneratedLine = 1;
    var previousOriginalColumn = 0;
    var previousOriginalLine = 0;
    var previousName = 0;
    var previousSource = 0;
    var result = '';
    var next;
    var mapping;
    var nameIdx;
    var sourceIdx;

    var mappings = this._mappings.toArray();
    for (var i = 0, len = mappings.length; i < len; i++) {
      mapping = mappings[i];
      next = '';

      if (mapping.generatedLine !== previousGeneratedLine) {
        previousGeneratedColumn = 0;
        while (mapping.generatedLine !== previousGeneratedLine) {
          next += ';';
          previousGeneratedLine++;
        }
      }
      else {
        if (i > 0) {
          if (!util.compareByGeneratedPositionsInflated(mapping, mappings[i - 1])) {
            continue;
          }
          next += ',';
        }
      }

      next += base64Vlq.encode(mapping.generatedColumn
                                 - previousGeneratedColumn);
      previousGeneratedColumn = mapping.generatedColumn;

      if (mapping.source != null) {
        sourceIdx = this._sources.indexOf(mapping.source);
        next += base64Vlq.encode(sourceIdx - previousSource);
        previousSource = sourceIdx;

        // lines are stored 0-based in SourceMap spec version 3
        next += base64Vlq.encode(mapping.originalLine - 1
                                   - previousOriginalLine);
        previousOriginalLine = mapping.originalLine - 1;

        next += base64Vlq.encode(mapping.originalColumn
                                   - previousOriginalColumn);
        previousOriginalColumn = mapping.originalColumn;

        if (mapping.name != null) {
          nameIdx = this._names.indexOf(mapping.name);
          next += base64Vlq.encode(nameIdx - previousName);
          previousName = nameIdx;
        }
      }

      result += next;
    }

    return result;
  };

SourceMapGenerator.prototype._generateSourcesContent =
  function SourceMapGenerator_generateSourcesContent(aSources, aSourceRoot) {
    return aSources.map(function (source) {
      if (!this._sourcesContents) {
        return null;
      }
      if (aSourceRoot != null) {
        source = util.relative(aSourceRoot, source);
      }
      var key = util.toSetString(source);
      return Object.prototype.hasOwnProperty.call(this._sourcesContents, key)
        ? this._sourcesContents[key]
        : null;
    }, this);
  };

/**
 * Externalize the source map.
 */
SourceMapGenerator.prototype.toJSON =
  function SourceMapGenerator_toJSON() {
    var map = {
      version: this._version,
      sources: this._sources.toArray(),
      names: this._names.toArray(),
      mappings: this._serializeMappings()
    };
    if (this._file != null) {
      map.file = this._file;
    }
    if (this._sourceRoot != null) {
      map.sourceRoot = this._sourceRoot;
    }
    if (this._sourcesContents) {
      map.sourcesContent = this._generateSourcesContent(map.sources, map.sourceRoot);
    }

    return map;
  };

/**
 * Render the source map being generated to a string.
 */
SourceMapGenerator.prototype.toString =
  function SourceMapGenerator_toString() {
    return JSON.stringify(this.toJSON());
  };

var SourceMapGenerator_1 = SourceMapGenerator;

var sourceMapGenerator = {
	SourceMapGenerator: SourceMapGenerator_1
};

var binarySearch = createCommonjsModule(function (module, exports) {
/* -*- Mode: js; js-indent-level: 2; -*- */
/*
 * Copyright 2011 Mozilla Foundation and contributors
 * Licensed under the New BSD license. See LICENSE or:
 * http://opensource.org/licenses/BSD-3-Clause
 */

exports.GREATEST_LOWER_BOUND = 1;
exports.LEAST_UPPER_BOUND = 2;

/**
 * Recursive implementation of binary search.
 *
 * @param aLow Indices here and lower do not contain the needle.
 * @param aHigh Indices here and higher do not contain the needle.
 * @param aNeedle The element being searched for.
 * @param aHaystack The non-empty array being searched.
 * @param aCompare Function which takes two elements and returns -1, 0, or 1.
 * @param aBias Either 'binarySearch.GREATEST_LOWER_BOUND' or
 *     'binarySearch.LEAST_UPPER_BOUND'. Specifies whether to return the
 *     closest element that is smaller than or greater than the one we are
 *     searching for, respectively, if the exact element cannot be found.
 */
function recursiveSearch(aLow, aHigh, aNeedle, aHaystack, aCompare, aBias) {
  // This function terminates when one of the following is true:
  //
  //   1. We find the exact element we are looking for.
  //
  //   2. We did not find the exact element, but we can return the index of
  //      the next-closest element.
  //
  //   3. We did not find the exact element, and there is no next-closest
  //      element than the one we are searching for, so we return -1.
  var mid = Math.floor((aHigh - aLow) / 2) + aLow;
  var cmp = aCompare(aNeedle, aHaystack[mid], true);
  if (cmp === 0) {
    // Found the element we are looking for.
    return mid;
  }
  else if (cmp > 0) {
    // Our needle is greater than aHaystack[mid].
    if (aHigh - mid > 1) {
      // The element is in the upper half.
      return recursiveSearch(mid, aHigh, aNeedle, aHaystack, aCompare, aBias);
    }

    // The exact needle element was not found in this haystack. Determine if
    // we are in termination case (3) or (2) and return the appropriate thing.
    if (aBias == exports.LEAST_UPPER_BOUND) {
      return aHigh < aHaystack.length ? aHigh : -1;
    } else {
      return mid;
    }
  }
  else {
    // Our needle is less than aHaystack[mid].
    if (mid - aLow > 1) {
      // The element is in the lower half.
      return recursiveSearch(aLow, mid, aNeedle, aHaystack, aCompare, aBias);
    }

    // we are in termination case (3) or (2) and return the appropriate thing.
    if (aBias == exports.LEAST_UPPER_BOUND) {
      return mid;
    } else {
      return aLow < 0 ? -1 : aLow;
    }
  }
}

/**
 * This is an implementation of binary search which will always try and return
 * the index of the closest element if there is no exact hit. This is because
 * mappings between original and generated line/col pairs are single points,
 * and there is an implicit region between each of them, so a miss just means
 * that you aren't on the very start of a region.
 *
 * @param aNeedle The element you are looking for.
 * @param aHaystack The array that is being searched.
 * @param aCompare A function which takes the needle and an element in the
 *     array and returns -1, 0, or 1 depending on whether the needle is less
 *     than, equal to, or greater than the element, respectively.
 * @param aBias Either 'binarySearch.GREATEST_LOWER_BOUND' or
 *     'binarySearch.LEAST_UPPER_BOUND'. Specifies whether to return the
 *     closest element that is smaller than or greater than the one we are
 *     searching for, respectively, if the exact element cannot be found.
 *     Defaults to 'binarySearch.GREATEST_LOWER_BOUND'.
 */
exports.search = function search(aNeedle, aHaystack, aCompare, aBias) {
  if (aHaystack.length === 0) {
    return -1;
  }

  var index = recursiveSearch(-1, aHaystack.length, aNeedle, aHaystack,
                              aCompare, aBias || exports.GREATEST_LOWER_BOUND);
  if (index < 0) {
    return -1;
  }

  // We have found either the exact element, or the next-closest element than
  // the one we are searching for. However, there may be more than one such
  // element. Make sure we always return the smallest of these.
  while (index - 1 >= 0) {
    if (aCompare(aHaystack[index], aHaystack[index - 1], true) !== 0) {
      break;
    }
    --index;
  }

  return index;
};
});

/* -*- Mode: js; js-indent-level: 2; -*- */
/*
 * Copyright 2011 Mozilla Foundation and contributors
 * Licensed under the New BSD license. See LICENSE or:
 * http://opensource.org/licenses/BSD-3-Clause
 */

// It turns out that some (most?) JavaScript engines don't self-host
// `Array.prototype.sort`. This makes sense because C++ will likely remain
// faster than JS when doing raw CPU-intensive sorting. However, when using a
// custom comparator function, calling back and forth between the VM's C++ and
// JIT'd JS is rather slow *and* loses JIT type information, resulting in
// worse generated code for the comparator function than would be optimal. In
// fact, when sorting with a comparator, these costs outweigh the benefits of
// sorting in C++. By using our own JS-implemented Quick Sort (below), we get
// a ~3500ms mean speed-up in `bench/bench.html`.

/**
 * Swap the elements indexed by `x` and `y` in the array `ary`.
 *
 * @param {Array} ary
 *        The array.
 * @param {Number} x
 *        The index of the first item.
 * @param {Number} y
 *        The index of the second item.
 */
function swap(ary, x, y) {
  var temp = ary[x];
  ary[x] = ary[y];
  ary[y] = temp;
}

/**
 * Returns a random integer within the range `low .. high` inclusive.
 *
 * @param {Number} low
 *        The lower bound on the range.
 * @param {Number} high
 *        The upper bound on the range.
 */
function randomIntInRange(low, high) {
  return Math.round(low + (Math.random() * (high - low)));
}

/**
 * The Quick Sort algorithm.
 *
 * @param {Array} ary
 *        An array to sort.
 * @param {function} comparator
 *        Function to use to compare two items.
 * @param {Number} p
 *        Start index of the array
 * @param {Number} r
 *        End index of the array
 */
function doQuickSort(ary, comparator, p, r) {
  // If our lower bound is less than our upper bound, we (1) partition the
  // array into two pieces and (2) recurse on each half. If it is not, this is
  // the empty array and our base case.

  if (p < r) {
    // (1) Partitioning.
    //
    // The partitioning chooses a pivot between `p` and `r` and moves all
    // elements that are less than or equal to the pivot to the before it, and
    // all the elements that are greater than it after it. The effect is that
    // once partition is done, the pivot is in the exact place it will be when
    // the array is put in sorted order, and it will not need to be moved
    // again. This runs in O(n) time.

    // Always choose a random pivot so that an input array which is reverse
    // sorted does not cause O(n^2) running time.
    var pivotIndex = randomIntInRange(p, r);
    var i = p - 1;

    swap(ary, pivotIndex, r);
    var pivot = ary[r];

    // Immediately after `j` is incremented in this loop, the following hold
    // true:
    //
    //   * Every element in `ary[p .. i]` is less than or equal to the pivot.
    //
    //   * Every element in `ary[i+1 .. j-1]` is greater than the pivot.
    for (var j = p; j < r; j++) {
      if (comparator(ary[j], pivot) <= 0) {
        i += 1;
        swap(ary, i, j);
      }
    }

    swap(ary, i + 1, j);
    var q = i + 1;

    // (2) Recurse on each half.

    doQuickSort(ary, comparator, p, q - 1);
    doQuickSort(ary, comparator, q + 1, r);
  }
}

/**
 * Sort the given array in-place with the given comparator function.
 *
 * @param {Array} ary
 *        An array to sort.
 * @param {function} comparator
 *        Function to use to compare two items.
 */
var quickSort_1 = function (ary, comparator) {
  doQuickSort(ary, comparator, 0, ary.length - 1);
};

var quickSort = {
	quickSort: quickSort_1
};

/* -*- Mode: js; js-indent-level: 2; -*- */
/*
 * Copyright 2011 Mozilla Foundation and contributors
 * Licensed under the New BSD license. See LICENSE or:
 * http://opensource.org/licenses/BSD-3-Clause
 */



var ArraySet$2 = arraySet.ArraySet;

var quickSort$1 = quickSort.quickSort;

function SourceMapConsumer(aSourceMap, aSourceMapURL) {
  var sourceMap = aSourceMap;
  if (typeof aSourceMap === 'string') {
    sourceMap = util.parseSourceMapInput(aSourceMap);
  }

  return sourceMap.sections != null
    ? new IndexedSourceMapConsumer(sourceMap, aSourceMapURL)
    : new BasicSourceMapConsumer(sourceMap, aSourceMapURL);
}

SourceMapConsumer.fromSourceMap = function(aSourceMap, aSourceMapURL) {
  return BasicSourceMapConsumer.fromSourceMap(aSourceMap, aSourceMapURL);
};

/**
 * The version of the source mapping spec that we are consuming.
 */
SourceMapConsumer.prototype._version = 3;

// `__generatedMappings` and `__originalMappings` are arrays that hold the
// parsed mapping coordinates from the source map's "mappings" attribute. They
// are lazily instantiated, accessed via the `_generatedMappings` and
// `_originalMappings` getters respectively, and we only parse the mappings
// and create these arrays once queried for a source location. We jump through
// these hoops because there can be many thousands of mappings, and parsing
// them is expensive, so we only want to do it if we must.
//
// Each object in the arrays is of the form:
//
//     {
//       generatedLine: The line number in the generated code,
//       generatedColumn: The column number in the generated code,
//       source: The path to the original source file that generated this
//               chunk of code,
//       originalLine: The line number in the original source that
//                     corresponds to this chunk of generated code,
//       originalColumn: The column number in the original source that
//                       corresponds to this chunk of generated code,
//       name: The name of the original symbol which generated this chunk of
//             code.
//     }
//
// All properties except for `generatedLine` and `generatedColumn` can be
// `null`.
//
// `_generatedMappings` is ordered by the generated positions.
//
// `_originalMappings` is ordered by the original positions.

SourceMapConsumer.prototype.__generatedMappings = null;
Object.defineProperty(SourceMapConsumer.prototype, '_generatedMappings', {
  configurable: true,
  enumerable: true,
  get: function () {
    if (!this.__generatedMappings) {
      this._parseMappings(this._mappings, this.sourceRoot);
    }

    return this.__generatedMappings;
  }
});

SourceMapConsumer.prototype.__originalMappings = null;
Object.defineProperty(SourceMapConsumer.prototype, '_originalMappings', {
  configurable: true,
  enumerable: true,
  get: function () {
    if (!this.__originalMappings) {
      this._parseMappings(this._mappings, this.sourceRoot);
    }

    return this.__originalMappings;
  }
});

SourceMapConsumer.prototype._charIsMappingSeparator =
  function SourceMapConsumer_charIsMappingSeparator(aStr, index) {
    var c = aStr.charAt(index);
    return c === ";" || c === ",";
  };

/**
 * Parse the mappings in a string in to a data structure which we can easily
 * query (the ordered arrays in the `this.__generatedMappings` and
 * `this.__originalMappings` properties).
 */
SourceMapConsumer.prototype._parseMappings =
  function SourceMapConsumer_parseMappings(aStr, aSourceRoot) {
    throw new Error("Subclasses must implement _parseMappings");
  };

SourceMapConsumer.GENERATED_ORDER = 1;
SourceMapConsumer.ORIGINAL_ORDER = 2;

SourceMapConsumer.GREATEST_LOWER_BOUND = 1;
SourceMapConsumer.LEAST_UPPER_BOUND = 2;

/**
 * Iterate over each mapping between an original source/line/column and a
 * generated line/column in this source map.
 *
 * @param Function aCallback
 *        The function that is called with each mapping.
 * @param Object aContext
 *        Optional. If specified, this object will be the value of `this` every
 *        time that `aCallback` is called.
 * @param aOrder
 *        Either `SourceMapConsumer.GENERATED_ORDER` or
 *        `SourceMapConsumer.ORIGINAL_ORDER`. Specifies whether you want to
 *        iterate over the mappings sorted by the generated file's line/column
 *        order or the original's source/line/column order, respectively. Defaults to
 *        `SourceMapConsumer.GENERATED_ORDER`.
 */
SourceMapConsumer.prototype.eachMapping =
  function SourceMapConsumer_eachMapping(aCallback, aContext, aOrder) {
    var context = aContext || null;
    var order = aOrder || SourceMapConsumer.GENERATED_ORDER;

    var mappings;
    switch (order) {
    case SourceMapConsumer.GENERATED_ORDER:
      mappings = this._generatedMappings;
      break;
    case SourceMapConsumer.ORIGINAL_ORDER:
      mappings = this._originalMappings;
      break;
    default:
      throw new Error("Unknown order of iteration.");
    }

    var sourceRoot = this.sourceRoot;
    mappings.map(function (mapping) {
      var source = mapping.source === null ? null : this._sources.at(mapping.source);
      source = util.computeSourceURL(sourceRoot, source, this._sourceMapURL);
      return {
        source: source,
        generatedLine: mapping.generatedLine,
        generatedColumn: mapping.generatedColumn,
        originalLine: mapping.originalLine,
        originalColumn: mapping.originalColumn,
        name: mapping.name === null ? null : this._names.at(mapping.name)
      };
    }, this).forEach(aCallback, context);
  };

/**
 * Returns all generated line and column information for the original source,
 * line, and column provided. If no column is provided, returns all mappings
 * corresponding to a either the line we are searching for or the next
 * closest line that has any mappings. Otherwise, returns all mappings
 * corresponding to the given line and either the column we are searching for
 * or the next closest column that has any offsets.
 *
 * The only argument is an object with the following properties:
 *
 *   - source: The filename of the original source.
 *   - line: The line number in the original source.  The line number is 1-based.
 *   - column: Optional. the column number in the original source.
 *    The column number is 0-based.
 *
 * and an array of objects is returned, each with the following properties:
 *
 *   - line: The line number in the generated source, or null.  The
 *    line number is 1-based.
 *   - column: The column number in the generated source, or null.
 *    The column number is 0-based.
 */
SourceMapConsumer.prototype.allGeneratedPositionsFor =
  function SourceMapConsumer_allGeneratedPositionsFor(aArgs) {
    var line = util.getArg(aArgs, 'line');

    // When there is no exact match, BasicSourceMapConsumer.prototype._findMapping
    // returns the index of the closest mapping less than the needle. By
    // setting needle.originalColumn to 0, we thus find the last mapping for
    // the given line, provided such a mapping exists.
    var needle = {
      source: util.getArg(aArgs, 'source'),
      originalLine: line,
      originalColumn: util.getArg(aArgs, 'column', 0)
    };

    needle.source = this._findSourceIndex(needle.source);
    if (needle.source < 0) {
      return [];
    }

    var mappings = [];

    var index = this._findMapping(needle,
                                  this._originalMappings,
                                  "originalLine",
                                  "originalColumn",
                                  util.compareByOriginalPositions,
                                  binarySearch.LEAST_UPPER_BOUND);
    if (index >= 0) {
      var mapping = this._originalMappings[index];

      if (aArgs.column === undefined) {
        var originalLine = mapping.originalLine;

        // Iterate until either we run out of mappings, or we run into
        // a mapping for a different line than the one we found. Since
        // mappings are sorted, this is guaranteed to find all mappings for
        // the line we found.
        while (mapping && mapping.originalLine === originalLine) {
          mappings.push({
            line: util.getArg(mapping, 'generatedLine', null),
            column: util.getArg(mapping, 'generatedColumn', null),
            lastColumn: util.getArg(mapping, 'lastGeneratedColumn', null)
          });

          mapping = this._originalMappings[++index];
        }
      } else {
        var originalColumn = mapping.originalColumn;

        // Iterate until either we run out of mappings, or we run into
        // a mapping for a different line than the one we were searching for.
        // Since mappings are sorted, this is guaranteed to find all mappings for
        // the line we are searching for.
        while (mapping &&
               mapping.originalLine === line &&
               mapping.originalColumn == originalColumn) {
          mappings.push({
            line: util.getArg(mapping, 'generatedLine', null),
            column: util.getArg(mapping, 'generatedColumn', null),
            lastColumn: util.getArg(mapping, 'lastGeneratedColumn', null)
          });

          mapping = this._originalMappings[++index];
        }
      }
    }

    return mappings;
  };

var SourceMapConsumer_1 = SourceMapConsumer;

/**
 * A BasicSourceMapConsumer instance represents a parsed source map which we can
 * query for information about the original file positions by giving it a file
 * position in the generated source.
 *
 * The first parameter is the raw source map (either as a JSON string, or
 * already parsed to an object). According to the spec, source maps have the
 * following attributes:
 *
 *   - version: Which version of the source map spec this map is following.
 *   - sources: An array of URLs to the original source files.
 *   - names: An array of identifiers which can be referrenced by individual mappings.
 *   - sourceRoot: Optional. The URL root from which all sources are relative.
 *   - sourcesContent: Optional. An array of contents of the original source files.
 *   - mappings: A string of base64 VLQs which contain the actual mappings.
 *   - file: Optional. The generated file this source map is associated with.
 *
 * Here is an example source map, taken from the source map spec[0]:
 *
 *     {
 *       version : 3,
 *       file: "out.js",
 *       sourceRoot : "",
 *       sources: ["foo.js", "bar.js"],
 *       names: ["src", "maps", "are", "fun"],
 *       mappings: "AA,AB;;ABCDE;"
 *     }
 *
 * The second parameter, if given, is a string whose value is the URL
 * at which the source map was found.  This URL is used to compute the
 * sources array.
 *
 * [0]: https://docs.google.com/document/d/1U1RGAehQwRypUTovF1KRlpiOFze0b-_2gc6fAH0KY0k/edit?pli=1#
 */
function BasicSourceMapConsumer(aSourceMap, aSourceMapURL) {
  var sourceMap = aSourceMap;
  if (typeof aSourceMap === 'string') {
    sourceMap = util.parseSourceMapInput(aSourceMap);
  }

  var version = util.getArg(sourceMap, 'version');
  var sources = util.getArg(sourceMap, 'sources');
  // Sass 3.3 leaves out the 'names' array, so we deviate from the spec (which
  // requires the array) to play nice here.
  var names = util.getArg(sourceMap, 'names', []);
  var sourceRoot = util.getArg(sourceMap, 'sourceRoot', null);
  var sourcesContent = util.getArg(sourceMap, 'sourcesContent', null);
  var mappings = util.getArg(sourceMap, 'mappings');
  var file = util.getArg(sourceMap, 'file', null);

  // Once again, Sass deviates from the spec and supplies the version as a
  // string rather than a number, so we use loose equality checking here.
  if (version != this._version) {
    throw new Error('Unsupported version: ' + version);
  }

  if (sourceRoot) {
    sourceRoot = util.normalize(sourceRoot);
  }

  sources = sources
    .map(String)
    // Some source maps produce relative source paths like "./foo.js" instead of
    // "foo.js".  Normalize these first so that future comparisons will succeed.
    // See bugzil.la/1090768.
    .map(util.normalize)
    // Always ensure that absolute sources are internally stored relative to
    // the source root, if the source root is absolute. Not doing this would
    // be particularly problematic when the source root is a prefix of the
    // source (valid, but why??). See github issue #199 and bugzil.la/1188982.
    .map(function (source) {
      return sourceRoot && util.isAbsolute(sourceRoot) && util.isAbsolute(source)
        ? util.relative(sourceRoot, source)
        : source;
    });

  // Pass `true` below to allow duplicate names and sources. While source maps
  // are intended to be compressed and deduplicated, the TypeScript compiler
  // sometimes generates source maps with duplicates in them. See Github issue
  // #72 and bugzil.la/889492.
  this._names = ArraySet$2.fromArray(names.map(String), true);
  this._sources = ArraySet$2.fromArray(sources, true);

  this._absoluteSources = this._sources.toArray().map(function (s) {
    return util.computeSourceURL(sourceRoot, s, aSourceMapURL);
  });

  this.sourceRoot = sourceRoot;
  this.sourcesContent = sourcesContent;
  this._mappings = mappings;
  this._sourceMapURL = aSourceMapURL;
  this.file = file;
}

BasicSourceMapConsumer.prototype = Object.create(SourceMapConsumer.prototype);
BasicSourceMapConsumer.prototype.consumer = SourceMapConsumer;

/**
 * Utility function to find the index of a source.  Returns -1 if not
 * found.
 */
BasicSourceMapConsumer.prototype._findSourceIndex = function(aSource) {
  var relativeSource = aSource;
  if (this.sourceRoot != null) {
    relativeSource = util.relative(this.sourceRoot, relativeSource);
  }

  if (this._sources.has(relativeSource)) {
    return this._sources.indexOf(relativeSource);
  }

  // Maybe aSource is an absolute URL as returned by |sources|.  In
  // this case we can't simply undo the transform.
  var i;
  for (i = 0; i < this._absoluteSources.length; ++i) {
    if (this._absoluteSources[i] == aSource) {
      return i;
    }
  }

  return -1;
};

/**
 * Create a BasicSourceMapConsumer from a SourceMapGenerator.
 *
 * @param SourceMapGenerator aSourceMap
 *        The source map that will be consumed.
 * @param String aSourceMapURL
 *        The URL at which the source map can be found (optional)
 * @returns BasicSourceMapConsumer
 */
BasicSourceMapConsumer.fromSourceMap =
  function SourceMapConsumer_fromSourceMap(aSourceMap, aSourceMapURL) {
    var smc = Object.create(BasicSourceMapConsumer.prototype);

    var names = smc._names = ArraySet$2.fromArray(aSourceMap._names.toArray(), true);
    var sources = smc._sources = ArraySet$2.fromArray(aSourceMap._sources.toArray(), true);
    smc.sourceRoot = aSourceMap._sourceRoot;
    smc.sourcesContent = aSourceMap._generateSourcesContent(smc._sources.toArray(),
                                                            smc.sourceRoot);
    smc.file = aSourceMap._file;
    smc._sourceMapURL = aSourceMapURL;
    smc._absoluteSources = smc._sources.toArray().map(function (s) {
      return util.computeSourceURL(smc.sourceRoot, s, aSourceMapURL);
    });

    // Because we are modifying the entries (by converting string sources and
    // names to indices into the sources and names ArraySets), we have to make
    // a copy of the entry or else bad things happen. Shared mutable state
    // strikes again! See github issue #191.

    var generatedMappings = aSourceMap._mappings.toArray().slice();
    var destGeneratedMappings = smc.__generatedMappings = [];
    var destOriginalMappings = smc.__originalMappings = [];

    for (var i = 0, length = generatedMappings.length; i < length; i++) {
      var srcMapping = generatedMappings[i];
      var destMapping = new Mapping;
      destMapping.generatedLine = srcMapping.generatedLine;
      destMapping.generatedColumn = srcMapping.generatedColumn;

      if (srcMapping.source) {
        destMapping.source = sources.indexOf(srcMapping.source);
        destMapping.originalLine = srcMapping.originalLine;
        destMapping.originalColumn = srcMapping.originalColumn;

        if (srcMapping.name) {
          destMapping.name = names.indexOf(srcMapping.name);
        }

        destOriginalMappings.push(destMapping);
      }

      destGeneratedMappings.push(destMapping);
    }

    quickSort$1(smc.__originalMappings, util.compareByOriginalPositions);

    return smc;
  };

/**
 * The version of the source mapping spec that we are consuming.
 */
BasicSourceMapConsumer.prototype._version = 3;

/**
 * The list of original sources.
 */
Object.defineProperty(BasicSourceMapConsumer.prototype, 'sources', {
  get: function () {
    return this._absoluteSources.slice();
  }
});

/**
 * Provide the JIT with a nice shape / hidden class.
 */
function Mapping() {
  this.generatedLine = 0;
  this.generatedColumn = 0;
  this.source = null;
  this.originalLine = null;
  this.originalColumn = null;
  this.name = null;
}

/**
 * Parse the mappings in a string in to a data structure which we can easily
 * query (the ordered arrays in the `this.__generatedMappings` and
 * `this.__originalMappings` properties).
 */
BasicSourceMapConsumer.prototype._parseMappings =
  function SourceMapConsumer_parseMappings(aStr, aSourceRoot) {
    var generatedLine = 1;
    var previousGeneratedColumn = 0;
    var previousOriginalLine = 0;
    var previousOriginalColumn = 0;
    var previousSource = 0;
    var previousName = 0;
    var length = aStr.length;
    var index = 0;
    var cachedSegments = {};
    var temp = {};
    var originalMappings = [];
    var generatedMappings = [];
    var mapping, str, segment, end, value;

    while (index < length) {
      if (aStr.charAt(index) === ';') {
        generatedLine++;
        index++;
        previousGeneratedColumn = 0;
      }
      else if (aStr.charAt(index) === ',') {
        index++;
      }
      else {
        mapping = new Mapping();
        mapping.generatedLine = generatedLine;

        // Because each offset is encoded relative to the previous one,
        // many segments often have the same encoding. We can exploit this
        // fact by caching the parsed variable length fields of each segment,
        // allowing us to avoid a second parse if we encounter the same
        // segment again.
        for (end = index; end < length; end++) {
          if (this._charIsMappingSeparator(aStr, end)) {
            break;
          }
        }
        str = aStr.slice(index, end);

        segment = cachedSegments[str];
        if (segment) {
          index += str.length;
        } else {
          segment = [];
          while (index < end) {
            base64Vlq.decode(aStr, index, temp);
            value = temp.value;
            index = temp.rest;
            segment.push(value);
          }

          if (segment.length === 2) {
            throw new Error('Found a source, but no line and column');
          }

          if (segment.length === 3) {
            throw new Error('Found a source and line, but no column');
          }

          cachedSegments[str] = segment;
        }

        // Generated column.
        mapping.generatedColumn = previousGeneratedColumn + segment[0];
        previousGeneratedColumn = mapping.generatedColumn;

        if (segment.length > 1) {
          // Original source.
          mapping.source = previousSource + segment[1];
          previousSource += segment[1];

          // Original line.
          mapping.originalLine = previousOriginalLine + segment[2];
          previousOriginalLine = mapping.originalLine;
          // Lines are stored 0-based
          mapping.originalLine += 1;

          // Original column.
          mapping.originalColumn = previousOriginalColumn + segment[3];
          previousOriginalColumn = mapping.originalColumn;

          if (segment.length > 4) {
            // Original name.
            mapping.name = previousName + segment[4];
            previousName += segment[4];
          }
        }

        generatedMappings.push(mapping);
        if (typeof mapping.originalLine === 'number') {
          originalMappings.push(mapping);
        }
      }
    }

    quickSort$1(generatedMappings, util.compareByGeneratedPositionsDeflated);
    this.__generatedMappings = generatedMappings;

    quickSort$1(originalMappings, util.compareByOriginalPositions);
    this.__originalMappings = originalMappings;
  };

/**
 * Find the mapping that best matches the hypothetical "needle" mapping that
 * we are searching for in the given "haystack" of mappings.
 */
BasicSourceMapConsumer.prototype._findMapping =
  function SourceMapConsumer_findMapping(aNeedle, aMappings, aLineName,
                                         aColumnName, aComparator, aBias) {
    // To return the position we are searching for, we must first find the
    // mapping for the given position and then return the opposite position it
    // points to. Because the mappings are sorted, we can use binary search to
    // find the best mapping.

    if (aNeedle[aLineName] <= 0) {
      throw new TypeError('Line must be greater than or equal to 1, got '
                          + aNeedle[aLineName]);
    }
    if (aNeedle[aColumnName] < 0) {
      throw new TypeError('Column must be greater than or equal to 0, got '
                          + aNeedle[aColumnName]);
    }

    return binarySearch.search(aNeedle, aMappings, aComparator, aBias);
  };

/**
 * Compute the last column for each generated mapping. The last column is
 * inclusive.
 */
BasicSourceMapConsumer.prototype.computeColumnSpans =
  function SourceMapConsumer_computeColumnSpans() {
    for (var index = 0; index < this._generatedMappings.length; ++index) {
      var mapping = this._generatedMappings[index];

      // Mappings do not contain a field for the last generated columnt. We
      // can come up with an optimistic estimate, however, by assuming that
      // mappings are contiguous (i.e. given two consecutive mappings, the
      // first mapping ends where the second one starts).
      if (index + 1 < this._generatedMappings.length) {
        var nextMapping = this._generatedMappings[index + 1];

        if (mapping.generatedLine === nextMapping.generatedLine) {
          mapping.lastGeneratedColumn = nextMapping.generatedColumn - 1;
          continue;
        }
      }

      // The last mapping for each line spans the entire line.
      mapping.lastGeneratedColumn = Infinity;
    }
  };

/**
 * Returns the original source, line, and column information for the generated
 * source's line and column positions provided. The only argument is an object
 * with the following properties:
 *
 *   - line: The line number in the generated source.  The line number
 *     is 1-based.
 *   - column: The column number in the generated source.  The column
 *     number is 0-based.
 *   - bias: Either 'SourceMapConsumer.GREATEST_LOWER_BOUND' or
 *     'SourceMapConsumer.LEAST_UPPER_BOUND'. Specifies whether to return the
 *     closest element that is smaller than or greater than the one we are
 *     searching for, respectively, if the exact element cannot be found.
 *     Defaults to 'SourceMapConsumer.GREATEST_LOWER_BOUND'.
 *
 * and an object is returned with the following properties:
 *
 *   - source: The original source file, or null.
 *   - line: The line number in the original source, or null.  The
 *     line number is 1-based.
 *   - column: The column number in the original source, or null.  The
 *     column number is 0-based.
 *   - name: The original identifier, or null.
 */
BasicSourceMapConsumer.prototype.originalPositionFor =
  function SourceMapConsumer_originalPositionFor(aArgs) {
    var needle = {
      generatedLine: util.getArg(aArgs, 'line'),
      generatedColumn: util.getArg(aArgs, 'column')
    };

    var index = this._findMapping(
      needle,
      this._generatedMappings,
      "generatedLine",
      "generatedColumn",
      util.compareByGeneratedPositionsDeflated,
      util.getArg(aArgs, 'bias', SourceMapConsumer.GREATEST_LOWER_BOUND)
    );

    if (index >= 0) {
      var mapping = this._generatedMappings[index];

      if (mapping.generatedLine === needle.generatedLine) {
        var source = util.getArg(mapping, 'source', null);
        if (source !== null) {
          source = this._sources.at(source);
          source = util.computeSourceURL(this.sourceRoot, source, this._sourceMapURL);
        }
        var name = util.getArg(mapping, 'name', null);
        if (name !== null) {
          name = this._names.at(name);
        }
        return {
          source: source,
          line: util.getArg(mapping, 'originalLine', null),
          column: util.getArg(mapping, 'originalColumn', null),
          name: name
        };
      }
    }

    return {
      source: null,
      line: null,
      column: null,
      name: null
    };
  };

/**
 * Return true if we have the source content for every source in the source
 * map, false otherwise.
 */
BasicSourceMapConsumer.prototype.hasContentsOfAllSources =
  function BasicSourceMapConsumer_hasContentsOfAllSources() {
    if (!this.sourcesContent) {
      return false;
    }
    return this.sourcesContent.length >= this._sources.size() &&
      !this.sourcesContent.some(function (sc) { return sc == null; });
  };

/**
 * Returns the original source content. The only argument is the url of the
 * original source file. Returns null if no original source content is
 * available.
 */
BasicSourceMapConsumer.prototype.sourceContentFor =
  function SourceMapConsumer_sourceContentFor(aSource, nullOnMissing) {
    if (!this.sourcesContent) {
      return null;
    }

    var index = this._findSourceIndex(aSource);
    if (index >= 0) {
      return this.sourcesContent[index];
    }

    var relativeSource = aSource;
    if (this.sourceRoot != null) {
      relativeSource = util.relative(this.sourceRoot, relativeSource);
    }

    var url;
    if (this.sourceRoot != null
        && (url = util.urlParse(this.sourceRoot))) {
      // XXX: file:// URIs and absolute paths lead to unexpected behavior for
      // many users. We can help them out when they expect file:// URIs to
      // behave like it would if they were running a local HTTP server. See
      // https://bugzilla.mozilla.org/show_bug.cgi?id=885597.
      var fileUriAbsPath = relativeSource.replace(/^file:\/\//, "");
      if (url.scheme == "file"
          && this._sources.has(fileUriAbsPath)) {
        return this.sourcesContent[this._sources.indexOf(fileUriAbsPath)]
      }

      if ((!url.path || url.path == "/")
          && this._sources.has("/" + relativeSource)) {
        return this.sourcesContent[this._sources.indexOf("/" + relativeSource)];
      }
    }

    // This function is used recursively from
    // IndexedSourceMapConsumer.prototype.sourceContentFor. In that case, we
    // don't want to throw if we can't find the source - we just want to
    // return null, so we provide a flag to exit gracefully.
    if (nullOnMissing) {
      return null;
    }
    else {
      throw new Error('"' + relativeSource + '" is not in the SourceMap.');
    }
  };

/**
 * Returns the generated line and column information for the original source,
 * line, and column positions provided. The only argument is an object with
 * the following properties:
 *
 *   - source: The filename of the original source.
 *   - line: The line number in the original source.  The line number
 *     is 1-based.
 *   - column: The column number in the original source.  The column
 *     number is 0-based.
 *   - bias: Either 'SourceMapConsumer.GREATEST_LOWER_BOUND' or
 *     'SourceMapConsumer.LEAST_UPPER_BOUND'. Specifies whether to return the
 *     closest element that is smaller than or greater than the one we are
 *     searching for, respectively, if the exact element cannot be found.
 *     Defaults to 'SourceMapConsumer.GREATEST_LOWER_BOUND'.
 *
 * and an object is returned with the following properties:
 *
 *   - line: The line number in the generated source, or null.  The
 *     line number is 1-based.
 *   - column: The column number in the generated source, or null.
 *     The column number is 0-based.
 */
BasicSourceMapConsumer.prototype.generatedPositionFor =
  function SourceMapConsumer_generatedPositionFor(aArgs) {
    var source = util.getArg(aArgs, 'source');
    source = this._findSourceIndex(source);
    if (source < 0) {
      return {
        line: null,
        column: null,
        lastColumn: null
      };
    }

    var needle = {
      source: source,
      originalLine: util.getArg(aArgs, 'line'),
      originalColumn: util.getArg(aArgs, 'column')
    };

    var index = this._findMapping(
      needle,
      this._originalMappings,
      "originalLine",
      "originalColumn",
      util.compareByOriginalPositions,
      util.getArg(aArgs, 'bias', SourceMapConsumer.GREATEST_LOWER_BOUND)
    );

    if (index >= 0) {
      var mapping = this._originalMappings[index];

      if (mapping.source === needle.source) {
        return {
          line: util.getArg(mapping, 'generatedLine', null),
          column: util.getArg(mapping, 'generatedColumn', null),
          lastColumn: util.getArg(mapping, 'lastGeneratedColumn', null)
        };
      }
    }

    return {
      line: null,
      column: null,
      lastColumn: null
    };
  };

var BasicSourceMapConsumer_1 = BasicSourceMapConsumer;

/**
 * An IndexedSourceMapConsumer instance represents a parsed source map which
 * we can query for information. It differs from BasicSourceMapConsumer in
 * that it takes "indexed" source maps (i.e. ones with a "sections" field) as
 * input.
 *
 * The first parameter is a raw source map (either as a JSON string, or already
 * parsed to an object). According to the spec for indexed source maps, they
 * have the following attributes:
 *
 *   - version: Which version of the source map spec this map is following.
 *   - file: Optional. The generated file this source map is associated with.
 *   - sections: A list of section definitions.
 *
 * Each value under the "sections" field has two fields:
 *   - offset: The offset into the original specified at which this section
 *       begins to apply, defined as an object with a "line" and "column"
 *       field.
 *   - map: A source map definition. This source map could also be indexed,
 *       but doesn't have to be.
 *
 * Instead of the "map" field, it's also possible to have a "url" field
 * specifying a URL to retrieve a source map from, but that's currently
 * unsupported.
 *
 * Here's an example source map, taken from the source map spec[0], but
 * modified to omit a section which uses the "url" field.
 *
 *  {
 *    version : 3,
 *    file: "app.js",
 *    sections: [{
 *      offset: {line:100, column:10},
 *      map: {
 *        version : 3,
 *        file: "section.js",
 *        sources: ["foo.js", "bar.js"],
 *        names: ["src", "maps", "are", "fun"],
 *        mappings: "AAAA,E;;ABCDE;"
 *      }
 *    }],
 *  }
 *
 * The second parameter, if given, is a string whose value is the URL
 * at which the source map was found.  This URL is used to compute the
 * sources array.
 *
 * [0]: https://docs.google.com/document/d/1U1RGAehQwRypUTovF1KRlpiOFze0b-_2gc6fAH0KY0k/edit#heading=h.535es3xeprgt
 */
function IndexedSourceMapConsumer(aSourceMap, aSourceMapURL) {
  var sourceMap = aSourceMap;
  if (typeof aSourceMap === 'string') {
    sourceMap = util.parseSourceMapInput(aSourceMap);
  }

  var version = util.getArg(sourceMap, 'version');
  var sections = util.getArg(sourceMap, 'sections');

  if (version != this._version) {
    throw new Error('Unsupported version: ' + version);
  }

  this._sources = new ArraySet$2();
  this._names = new ArraySet$2();

  var lastOffset = {
    line: -1,
    column: 0
  };
  this._sections = sections.map(function (s) {
    if (s.url) {
      // The url field will require support for asynchronicity.
      // See https://github.com/mozilla/source-map/issues/16
      throw new Error('Support for url field in sections not implemented.');
    }
    var offset = util.getArg(s, 'offset');
    var offsetLine = util.getArg(offset, 'line');
    var offsetColumn = util.getArg(offset, 'column');

    if (offsetLine < lastOffset.line ||
        (offsetLine === lastOffset.line && offsetColumn < lastOffset.column)) {
      throw new Error('Section offsets must be ordered and non-overlapping.');
    }
    lastOffset = offset;

    return {
      generatedOffset: {
        // The offset fields are 0-based, but we use 1-based indices when
        // encoding/decoding from VLQ.
        generatedLine: offsetLine + 1,
        generatedColumn: offsetColumn + 1
      },
      consumer: new SourceMapConsumer(util.getArg(s, 'map'), aSourceMapURL)
    }
  });
}

IndexedSourceMapConsumer.prototype = Object.create(SourceMapConsumer.prototype);
IndexedSourceMapConsumer.prototype.constructor = SourceMapConsumer;

/**
 * The version of the source mapping spec that we are consuming.
 */
IndexedSourceMapConsumer.prototype._version = 3;

/**
 * The list of original sources.
 */
Object.defineProperty(IndexedSourceMapConsumer.prototype, 'sources', {
  get: function () {
    var sources = [];
    for (var i = 0; i < this._sections.length; i++) {
      for (var j = 0; j < this._sections[i].consumer.sources.length; j++) {
        sources.push(this._sections[i].consumer.sources[j]);
      }
    }
    return sources;
  }
});

/**
 * Returns the original source, line, and column information for the generated
 * source's line and column positions provided. The only argument is an object
 * with the following properties:
 *
 *   - line: The line number in the generated source.  The line number
 *     is 1-based.
 *   - column: The column number in the generated source.  The column
 *     number is 0-based.
 *
 * and an object is returned with the following properties:
 *
 *   - source: The original source file, or null.
 *   - line: The line number in the original source, or null.  The
 *     line number is 1-based.
 *   - column: The column number in the original source, or null.  The
 *     column number is 0-based.
 *   - name: The original identifier, or null.
 */
IndexedSourceMapConsumer.prototype.originalPositionFor =
  function IndexedSourceMapConsumer_originalPositionFor(aArgs) {
    var needle = {
      generatedLine: util.getArg(aArgs, 'line'),
      generatedColumn: util.getArg(aArgs, 'column')
    };

    // Find the section containing the generated position we're trying to map
    // to an original position.
    var sectionIndex = binarySearch.search(needle, this._sections,
      function(needle, section) {
        var cmp = needle.generatedLine - section.generatedOffset.generatedLine;
        if (cmp) {
          return cmp;
        }

        return (needle.generatedColumn -
                section.generatedOffset.generatedColumn);
      });
    var section = this._sections[sectionIndex];

    if (!section) {
      return {
        source: null,
        line: null,
        column: null,
        name: null
      };
    }

    return section.consumer.originalPositionFor({
      line: needle.generatedLine -
        (section.generatedOffset.generatedLine - 1),
      column: needle.generatedColumn -
        (section.generatedOffset.generatedLine === needle.generatedLine
         ? section.generatedOffset.generatedColumn - 1
         : 0),
      bias: aArgs.bias
    });
  };

/**
 * Return true if we have the source content for every source in the source
 * map, false otherwise.
 */
IndexedSourceMapConsumer.prototype.hasContentsOfAllSources =
  function IndexedSourceMapConsumer_hasContentsOfAllSources() {
    return this._sections.every(function (s) {
      return s.consumer.hasContentsOfAllSources();
    });
  };

/**
 * Returns the original source content. The only argument is the url of the
 * original source file. Returns null if no original source content is
 * available.
 */
IndexedSourceMapConsumer.prototype.sourceContentFor =
  function IndexedSourceMapConsumer_sourceContentFor(aSource, nullOnMissing) {
    for (var i = 0; i < this._sections.length; i++) {
      var section = this._sections[i];

      var content = section.consumer.sourceContentFor(aSource, true);
      if (content) {
        return content;
      }
    }
    if (nullOnMissing) {
      return null;
    }
    else {
      throw new Error('"' + aSource + '" is not in the SourceMap.');
    }
  };

/**
 * Returns the generated line and column information for the original source,
 * line, and column positions provided. The only argument is an object with
 * the following properties:
 *
 *   - source: The filename of the original source.
 *   - line: The line number in the original source.  The line number
 *     is 1-based.
 *   - column: The column number in the original source.  The column
 *     number is 0-based.
 *
 * and an object is returned with the following properties:
 *
 *   - line: The line number in the generated source, or null.  The
 *     line number is 1-based. 
 *   - column: The column number in the generated source, or null.
 *     The column number is 0-based.
 */
IndexedSourceMapConsumer.prototype.generatedPositionFor =
  function IndexedSourceMapConsumer_generatedPositionFor(aArgs) {
    for (var i = 0; i < this._sections.length; i++) {
      var section = this._sections[i];

      // Only consider this section if the requested source is in the list of
      // sources of the consumer.
      if (section.consumer._findSourceIndex(util.getArg(aArgs, 'source')) === -1) {
        continue;
      }
      var generatedPosition = section.consumer.generatedPositionFor(aArgs);
      if (generatedPosition) {
        var ret = {
          line: generatedPosition.line +
            (section.generatedOffset.generatedLine - 1),
          column: generatedPosition.column +
            (section.generatedOffset.generatedLine === generatedPosition.line
             ? section.generatedOffset.generatedColumn - 1
             : 0)
        };
        return ret;
      }
    }

    return {
      line: null,
      column: null
    };
  };

/**
 * Parse the mappings in a string in to a data structure which we can easily
 * query (the ordered arrays in the `this.__generatedMappings` and
 * `this.__originalMappings` properties).
 */
IndexedSourceMapConsumer.prototype._parseMappings =
  function IndexedSourceMapConsumer_parseMappings(aStr, aSourceRoot) {
    this.__generatedMappings = [];
    this.__originalMappings = [];
    for (var i = 0; i < this._sections.length; i++) {
      var section = this._sections[i];
      var sectionMappings = section.consumer._generatedMappings;
      for (var j = 0; j < sectionMappings.length; j++) {
        var mapping = sectionMappings[j];

        var source = section.consumer._sources.at(mapping.source);
        source = util.computeSourceURL(section.consumer.sourceRoot, source, this._sourceMapURL);
        this._sources.add(source);
        source = this._sources.indexOf(source);

        var name = null;
        if (mapping.name) {
          name = section.consumer._names.at(mapping.name);
          this._names.add(name);
          name = this._names.indexOf(name);
        }

        // The mappings coming from the consumer for the section have
        // generated positions relative to the start of the section, so we
        // need to offset them to be relative to the start of the concatenated
        // generated file.
        var adjustedMapping = {
          source: source,
          generatedLine: mapping.generatedLine +
            (section.generatedOffset.generatedLine - 1),
          generatedColumn: mapping.generatedColumn +
            (section.generatedOffset.generatedLine === mapping.generatedLine
            ? section.generatedOffset.generatedColumn - 1
            : 0),
          originalLine: mapping.originalLine,
          originalColumn: mapping.originalColumn,
          name: name
        };

        this.__generatedMappings.push(adjustedMapping);
        if (typeof adjustedMapping.originalLine === 'number') {
          this.__originalMappings.push(adjustedMapping);
        }
      }
    }

    quickSort$1(this.__generatedMappings, util.compareByGeneratedPositionsDeflated);
    quickSort$1(this.__originalMappings, util.compareByOriginalPositions);
  };

var IndexedSourceMapConsumer_1 = IndexedSourceMapConsumer;

var sourceMapConsumer = {
	SourceMapConsumer: SourceMapConsumer_1,
	BasicSourceMapConsumer: BasicSourceMapConsumer_1,
	IndexedSourceMapConsumer: IndexedSourceMapConsumer_1
};

/* -*- Mode: js; js-indent-level: 2; -*- */
/*
 * Copyright 2011 Mozilla Foundation and contributors
 * Licensed under the New BSD license. See LICENSE or:
 * http://opensource.org/licenses/BSD-3-Clause
 */

var SourceMapGenerator$1 = sourceMapGenerator.SourceMapGenerator;


// Matches a Windows-style `\r\n` newline or a `\n` newline used by all other
// operating systems these days (capturing the result).
var REGEX_NEWLINE = /(\r?\n)/;

// Newline character code for charCodeAt() comparisons
var NEWLINE_CODE = 10;

// Private symbol for identifying `SourceNode`s when multiple versions of
// the source-map library are loaded. This MUST NOT CHANGE across
// versions!
var isSourceNode = "$$$isSourceNode$$$";

/**
 * SourceNodes provide a way to abstract over interpolating/concatenating
 * snippets of generated JavaScript source code while maintaining the line and
 * column information associated with the original source code.
 *
 * @param aLine The original line number.
 * @param aColumn The original column number.
 * @param aSource The original source's filename.
 * @param aChunks Optional. An array of strings which are snippets of
 *        generated JS, or other SourceNodes.
 * @param aName The original identifier.
 */
function SourceNode(aLine, aColumn, aSource, aChunks, aName) {
  this.children = [];
  this.sourceContents = {};
  this.line = aLine == null ? null : aLine;
  this.column = aColumn == null ? null : aColumn;
  this.source = aSource == null ? null : aSource;
  this.name = aName == null ? null : aName;
  this[isSourceNode] = true;
  if (aChunks != null) this.add(aChunks);
}

/**
 * Creates a SourceNode from generated code and a SourceMapConsumer.
 *
 * @param aGeneratedCode The generated code
 * @param aSourceMapConsumer The SourceMap for the generated code
 * @param aRelativePath Optional. The path that relative sources in the
 *        SourceMapConsumer should be relative to.
 */
SourceNode.fromStringWithSourceMap =
  function SourceNode_fromStringWithSourceMap(aGeneratedCode, aSourceMapConsumer, aRelativePath) {
    // The SourceNode we want to fill with the generated code
    // and the SourceMap
    var node = new SourceNode();

    // All even indices of this array are one line of the generated code,
    // while all odd indices are the newlines between two adjacent lines
    // (since `REGEX_NEWLINE` captures its match).
    // Processed fragments are accessed by calling `shiftNextLine`.
    var remainingLines = aGeneratedCode.split(REGEX_NEWLINE);
    var remainingLinesIndex = 0;
    var shiftNextLine = function() {
      var lineContents = getNextLine();
      // The last line of a file might not have a newline.
      var newLine = getNextLine() || "";
      return lineContents + newLine;

      function getNextLine() {
        return remainingLinesIndex < remainingLines.length ?
            remainingLines[remainingLinesIndex++] : undefined;
      }
    };

    // We need to remember the position of "remainingLines"
    var lastGeneratedLine = 1, lastGeneratedColumn = 0;

    // The generate SourceNodes we need a code range.
    // To extract it current and last mapping is used.
    // Here we store the last mapping.
    var lastMapping = null;

    aSourceMapConsumer.eachMapping(function (mapping) {
      if (lastMapping !== null) {
        // We add the code from "lastMapping" to "mapping":
        // First check if there is a new line in between.
        if (lastGeneratedLine < mapping.generatedLine) {
          // Associate first line with "lastMapping"
          addMappingWithCode(lastMapping, shiftNextLine());
          lastGeneratedLine++;
          lastGeneratedColumn = 0;
          // The remaining code is added without mapping
        } else {
          // There is no new line in between.
          // Associate the code between "lastGeneratedColumn" and
          // "mapping.generatedColumn" with "lastMapping"
          var nextLine = remainingLines[remainingLinesIndex] || '';
          var code = nextLine.substr(0, mapping.generatedColumn -
                                        lastGeneratedColumn);
          remainingLines[remainingLinesIndex] = nextLine.substr(mapping.generatedColumn -
                                              lastGeneratedColumn);
          lastGeneratedColumn = mapping.generatedColumn;
          addMappingWithCode(lastMapping, code);
          // No more remaining code, continue
          lastMapping = mapping;
          return;
        }
      }
      // We add the generated code until the first mapping
      // to the SourceNode without any mapping.
      // Each line is added as separate string.
      while (lastGeneratedLine < mapping.generatedLine) {
        node.add(shiftNextLine());
        lastGeneratedLine++;
      }
      if (lastGeneratedColumn < mapping.generatedColumn) {
        var nextLine = remainingLines[remainingLinesIndex] || '';
        node.add(nextLine.substr(0, mapping.generatedColumn));
        remainingLines[remainingLinesIndex] = nextLine.substr(mapping.generatedColumn);
        lastGeneratedColumn = mapping.generatedColumn;
      }
      lastMapping = mapping;
    }, this);
    // We have processed all mappings.
    if (remainingLinesIndex < remainingLines.length) {
      if (lastMapping) {
        // Associate the remaining code in the current line with "lastMapping"
        addMappingWithCode(lastMapping, shiftNextLine());
      }
      // and add the remaining lines without any mapping
      node.add(remainingLines.splice(remainingLinesIndex).join(""));
    }

    // Copy sourcesContent into SourceNode
    aSourceMapConsumer.sources.forEach(function (sourceFile) {
      var content = aSourceMapConsumer.sourceContentFor(sourceFile);
      if (content != null) {
        if (aRelativePath != null) {
          sourceFile = util.join(aRelativePath, sourceFile);
        }
        node.setSourceContent(sourceFile, content);
      }
    });

    return node;

    function addMappingWithCode(mapping, code) {
      if (mapping === null || mapping.source === undefined) {
        node.add(code);
      } else {
        var source = aRelativePath
          ? util.join(aRelativePath, mapping.source)
          : mapping.source;
        node.add(new SourceNode(mapping.originalLine,
                                mapping.originalColumn,
                                source,
                                code,
                                mapping.name));
      }
    }
  };

/**
 * Add a chunk of generated JS to this source node.
 *
 * @param aChunk A string snippet of generated JS code, another instance of
 *        SourceNode, or an array where each member is one of those things.
 */
SourceNode.prototype.add = function SourceNode_add(aChunk) {
  if (Array.isArray(aChunk)) {
    aChunk.forEach(function (chunk) {
      this.add(chunk);
    }, this);
  }
  else if (aChunk[isSourceNode] || typeof aChunk === "string") {
    if (aChunk) {
      this.children.push(aChunk);
    }
  }
  else {
    throw new TypeError(
      "Expected a SourceNode, string, or an array of SourceNodes and strings. Got " + aChunk
    );
  }
  return this;
};

/**
 * Add a chunk of generated JS to the beginning of this source node.
 *
 * @param aChunk A string snippet of generated JS code, another instance of
 *        SourceNode, or an array where each member is one of those things.
 */
SourceNode.prototype.prepend = function SourceNode_prepend(aChunk) {
  if (Array.isArray(aChunk)) {
    for (var i = aChunk.length-1; i >= 0; i--) {
      this.prepend(aChunk[i]);
    }
  }
  else if (aChunk[isSourceNode] || typeof aChunk === "string") {
    this.children.unshift(aChunk);
  }
  else {
    throw new TypeError(
      "Expected a SourceNode, string, or an array of SourceNodes and strings. Got " + aChunk
    );
  }
  return this;
};

/**
 * Walk over the tree of JS snippets in this node and its children. The
 * walking function is called once for each snippet of JS and is passed that
 * snippet and the its original associated source's line/column location.
 *
 * @param aFn The traversal function.
 */
SourceNode.prototype.walk = function SourceNode_walk(aFn) {
  var chunk;
  for (var i = 0, len = this.children.length; i < len; i++) {
    chunk = this.children[i];
    if (chunk[isSourceNode]) {
      chunk.walk(aFn);
    }
    else {
      if (chunk !== '') {
        aFn(chunk, { source: this.source,
                     line: this.line,
                     column: this.column,
                     name: this.name });
      }
    }
  }
};

/**
 * Like `String.prototype.join` except for SourceNodes. Inserts `aStr` between
 * each of `this.children`.
 *
 * @param aSep The separator.
 */
SourceNode.prototype.join = function SourceNode_join(aSep) {
  var newChildren;
  var i;
  var len = this.children.length;
  if (len > 0) {
    newChildren = [];
    for (i = 0; i < len-1; i++) {
      newChildren.push(this.children[i]);
      newChildren.push(aSep);
    }
    newChildren.push(this.children[i]);
    this.children = newChildren;
  }
  return this;
};

/**
 * Call String.prototype.replace on the very right-most source snippet. Useful
 * for trimming whitespace from the end of a source node, etc.
 *
 * @param aPattern The pattern to replace.
 * @param aReplacement The thing to replace the pattern with.
 */
SourceNode.prototype.replaceRight = function SourceNode_replaceRight(aPattern, aReplacement) {
  var lastChild = this.children[this.children.length - 1];
  if (lastChild[isSourceNode]) {
    lastChild.replaceRight(aPattern, aReplacement);
  }
  else if (typeof lastChild === 'string') {
    this.children[this.children.length - 1] = lastChild.replace(aPattern, aReplacement);
  }
  else {
    this.children.push(''.replace(aPattern, aReplacement));
  }
  return this;
};

/**
 * Set the source content for a source file. This will be added to the SourceMapGenerator
 * in the sourcesContent field.
 *
 * @param aSourceFile The filename of the source file
 * @param aSourceContent The content of the source file
 */
SourceNode.prototype.setSourceContent =
  function SourceNode_setSourceContent(aSourceFile, aSourceContent) {
    this.sourceContents[util.toSetString(aSourceFile)] = aSourceContent;
  };

/**
 * Walk over the tree of SourceNodes. The walking function is called for each
 * source file content and is passed the filename and source content.
 *
 * @param aFn The traversal function.
 */
SourceNode.prototype.walkSourceContents =
  function SourceNode_walkSourceContents(aFn) {
    for (var i = 0, len = this.children.length; i < len; i++) {
      if (this.children[i][isSourceNode]) {
        this.children[i].walkSourceContents(aFn);
      }
    }

    var sources = Object.keys(this.sourceContents);
    for (var i = 0, len = sources.length; i < len; i++) {
      aFn(util.fromSetString(sources[i]), this.sourceContents[sources[i]]);
    }
  };

/**
 * Return the string representation of this source node. Walks over the tree
 * and concatenates all the various snippets together to one string.
 */
SourceNode.prototype.toString = function SourceNode_toString() {
  var str = "";
  this.walk(function (chunk) {
    str += chunk;
  });
  return str;
};

/**
 * Returns the string representation of this source node along with a source
 * map.
 */
SourceNode.prototype.toStringWithSourceMap = function SourceNode_toStringWithSourceMap(aArgs) {
  var generated = {
    code: "",
    line: 1,
    column: 0
  };
  var map = new SourceMapGenerator$1(aArgs);
  var sourceMappingActive = false;
  var lastOriginalSource = null;
  var lastOriginalLine = null;
  var lastOriginalColumn = null;
  var lastOriginalName = null;
  this.walk(function (chunk, original) {
    generated.code += chunk;
    if (original.source !== null
        && original.line !== null
        && original.column !== null) {
      if(lastOriginalSource !== original.source
         || lastOriginalLine !== original.line
         || lastOriginalColumn !== original.column
         || lastOriginalName !== original.name) {
        map.addMapping({
          source: original.source,
          original: {
            line: original.line,
            column: original.column
          },
          generated: {
            line: generated.line,
            column: generated.column
          },
          name: original.name
        });
      }
      lastOriginalSource = original.source;
      lastOriginalLine = original.line;
      lastOriginalColumn = original.column;
      lastOriginalName = original.name;
      sourceMappingActive = true;
    } else if (sourceMappingActive) {
      map.addMapping({
        generated: {
          line: generated.line,
          column: generated.column
        }
      });
      lastOriginalSource = null;
      sourceMappingActive = false;
    }
    for (var idx = 0, length = chunk.length; idx < length; idx++) {
      if (chunk.charCodeAt(idx) === NEWLINE_CODE) {
        generated.line++;
        generated.column = 0;
        // Mappings end at eol
        if (idx + 1 === length) {
          lastOriginalSource = null;
          sourceMappingActive = false;
        } else if (sourceMappingActive) {
          map.addMapping({
            source: original.source,
            original: {
              line: original.line,
              column: original.column
            },
            generated: {
              line: generated.line,
              column: generated.column
            },
            name: original.name
          });
        }
      } else {
        generated.column++;
      }
    }
  });
  this.walkSourceContents(function (sourceFile, sourceContent) {
    map.setSourceContent(sourceFile, sourceContent);
  });

  return { code: generated.code, map: map };
};

var SourceNode_1 = SourceNode;

var sourceNode = {
	SourceNode: SourceNode_1
};

/*
 * Copyright 2009-2011 Mozilla Foundation and contributors
 * Licensed under the New BSD license. See LICENSE.txt or:
 * http://opensource.org/licenses/BSD-3-Clause
 */
var SourceMapGenerator$2 = sourceMapGenerator.SourceMapGenerator;
var SourceMapConsumer$1 = sourceMapConsumer.SourceMapConsumer;
var SourceNode$1 = sourceNode.SourceNode;

var sourceMap = {
	SourceMapGenerator: SourceMapGenerator$2,
	SourceMapConsumer: SourceMapConsumer$1,
	SourceNode: SourceNode$1
};

var toString = Object.prototype.toString;

var isModern = (
  typeof Buffer.alloc === 'function' &&
  typeof Buffer.allocUnsafe === 'function' &&
  typeof Buffer.from === 'function'
);

function isArrayBuffer (input) {
  return toString.call(input).slice(8, -1) === 'ArrayBuffer'
}

function fromArrayBuffer (obj, byteOffset, length) {
  byteOffset >>>= 0;

  var maxLength = obj.byteLength - byteOffset;

  if (maxLength < 0) {
    throw new RangeError("'offset' is out of bounds")
  }

  if (length === undefined) {
    length = maxLength;
  } else {
    length >>>= 0;

    if (length > maxLength) {
      throw new RangeError("'length' is out of bounds")
    }
  }

  return isModern
    ? Buffer.from(obj.slice(byteOffset, byteOffset + length))
    : new Buffer(new Uint8Array(obj.slice(byteOffset, byteOffset + length)))
}

function fromString (string, encoding) {
  if (typeof encoding !== 'string' || encoding === '') {
    encoding = 'utf8';
  }

  if (!Buffer.isEncoding(encoding)) {
    throw new TypeError('"encoding" must be a valid string encoding')
  }

  return isModern
    ? Buffer.from(string, encoding)
    : new Buffer(string, encoding)
}

function bufferFrom (value, encodingOrOffset, length) {
  if (typeof value === 'number') {
    throw new TypeError('"value" argument must not be a number')
  }

  if (isArrayBuffer(value)) {
    return fromArrayBuffer(value, encodingOrOffset, length)
  }

  if (typeof value === 'string') {
    return fromString(value, encodingOrOffset)
  }

  return isModern
    ? Buffer.from(value)
    : new Buffer(value)
}

var bufferFrom_1 = bufferFrom;

var sourceMapSupport = createCommonjsModule(function (module, exports) {
var SourceMapConsumer = sourceMap.SourceMapConsumer;
var path = path__default['default'];

var fs;
try {
  fs = fs__default['default'];
  if (!fs.existsSync || !fs.readFileSync) {
    // fs doesn't have all methods we need
    fs = null;
  }
} catch (err) {
  /* nop */
}



/**
 * Requires a module which is protected against bundler minification.
 *
 * @param {NodeModule} mod
 * @param {string} request
 */
function dynamicRequire(mod, request) {
  return mod.require(request);
}

// Only install once if called multiple times
var errorFormatterInstalled = false;
var uncaughtShimInstalled = false;

// If true, the caches are reset before a stack trace formatting operation
var emptyCacheBetweenOperations = false;

// Supports {browser, node, auto}
var environment = "auto";

// Maps a file path to a string containing the file contents
var fileContentsCache = {};

// Maps a file path to a source map for that file
var sourceMapCache = {};

// Regex for detecting source maps
var reSourceMap = /^data:application\/json[^,]+base64,/;

// Priority list of retrieve handlers
var retrieveFileHandlers = [];
var retrieveMapHandlers = [];

function isInBrowser() {
  if (environment === "browser")
    return true;
  if (environment === "node")
    return false;
  return ((typeof window !== 'undefined') && (typeof XMLHttpRequest === 'function') && !(window.require && window.module && window.process && window.process.type === "renderer"));
}

function hasGlobalProcessEventEmitter() {
  return ((typeof process === 'object') && (process !== null) && (typeof process.on === 'function'));
}

function handlerExec(list) {
  return function(arg) {
    for (var i = 0; i < list.length; i++) {
      var ret = list[i](arg);
      if (ret) {
        return ret;
      }
    }
    return null;
  };
}

var retrieveFile = handlerExec(retrieveFileHandlers);

retrieveFileHandlers.push(function(path) {
  // Trim the path to make sure there is no extra whitespace.
  path = path.trim();
  if (/^file:/.test(path)) {
    // existsSync/readFileSync can't handle file protocol, but once stripped, it works
    path = path.replace(/file:\/\/\/(\w:)?/, function(protocol, drive) {
      return drive ?
        '' : // file:///C:/dir/file -> C:/dir/file
        '/'; // file:///root-dir/file -> /root-dir/file
    });
  }
  if (path in fileContentsCache) {
    return fileContentsCache[path];
  }

  var contents = '';
  try {
    if (!fs) {
      // Use SJAX if we are in the browser
      var xhr = new XMLHttpRequest();
      xhr.open('GET', path, /** async */ false);
      xhr.send(null);
      if (xhr.readyState === 4 && xhr.status === 200) {
        contents = xhr.responseText;
      }
    } else if (fs.existsSync(path)) {
      // Otherwise, use the filesystem
      contents = fs.readFileSync(path, 'utf8');
    }
  } catch (er) {
    /* ignore any errors */
  }

  return fileContentsCache[path] = contents;
});

// Support URLs relative to a directory, but be careful about a protocol prefix
// in case we are in the browser (i.e. directories may start with "http://" or "file:///")
function supportRelativeURL(file, url) {
  if (!file) return url;
  var dir = path.dirname(file);
  var match = /^\w+:\/\/[^\/]*/.exec(dir);
  var protocol = match ? match[0] : '';
  var startPath = dir.slice(protocol.length);
  if (protocol && /^\/\w\:/.test(startPath)) {
    // handle file:///C:/ paths
    protocol += '/';
    return protocol + path.resolve(dir.slice(protocol.length), url).replace(/\\/g, '/');
  }
  return protocol + path.resolve(dir.slice(protocol.length), url);
}

function retrieveSourceMapURL(source) {
  var fileData;

  if (isInBrowser()) {
     try {
       var xhr = new XMLHttpRequest();
       xhr.open('GET', source, false);
       xhr.send(null);
       fileData = xhr.readyState === 4 ? xhr.responseText : null;

       // Support providing a sourceMappingURL via the SourceMap header
       var sourceMapHeader = xhr.getResponseHeader("SourceMap") ||
                             xhr.getResponseHeader("X-SourceMap");
       if (sourceMapHeader) {
         return sourceMapHeader;
       }
     } catch (e) {
     }
  }

  // Get the URL of the source map
  fileData = retrieveFile(source);
  var re = /(?:\/\/[@#][\s]*sourceMappingURL=([^\s'"]+)[\s]*$)|(?:\/\*[@#][\s]*sourceMappingURL=([^\s*'"]+)[\s]*(?:\*\/)[\s]*$)/mg;
  // Keep executing the search to find the *last* sourceMappingURL to avoid
  // picking up sourceMappingURLs from comments, strings, etc.
  var lastMatch, match;
  while (match = re.exec(fileData)) lastMatch = match;
  if (!lastMatch) return null;
  return lastMatch[1];
}
// Can be overridden by the retrieveSourceMap option to install. Takes a
// generated source filename; returns a {map, optional url} object, or null if
// there is no source map.  The map field may be either a string or the parsed
// JSON object (ie, it must be a valid argument to the SourceMapConsumer
// constructor).
var retrieveSourceMap = handlerExec(retrieveMapHandlers);
retrieveMapHandlers.push(function(source) {
  var sourceMappingURL = retrieveSourceMapURL(source);
  if (!sourceMappingURL) return null;

  // Read the contents of the source map
  var sourceMapData;
  if (reSourceMap.test(sourceMappingURL)) {
    // Support source map URL as a data url
    var rawData = sourceMappingURL.slice(sourceMappingURL.indexOf(',') + 1);
    sourceMapData = bufferFrom_1(rawData, "base64").toString();
    sourceMappingURL = source;
  } else {
    // Support source map URLs relative to the source URL
    sourceMappingURL = supportRelativeURL(source, sourceMappingURL);
    sourceMapData = retrieveFile(sourceMappingURL);
  }

  if (!sourceMapData) {
    return null;
  }

  return {
    url: sourceMappingURL,
    map: sourceMapData
  };
});

function mapSourcePosition(position) {
  var sourceMap = sourceMapCache[position.source];
  if (!sourceMap) {
    // Call the (overrideable) retrieveSourceMap function to get the source map.
    var urlAndMap = retrieveSourceMap(position.source);
    if (urlAndMap) {
      sourceMap = sourceMapCache[position.source] = {
        url: urlAndMap.url,
        map: new SourceMapConsumer(urlAndMap.map)
      };

      // Load all sources stored inline with the source map into the file cache
      // to pretend like they are already loaded. They may not exist on disk.
      if (sourceMap.map.sourcesContent) {
        sourceMap.map.sources.forEach(function(source, i) {
          var contents = sourceMap.map.sourcesContent[i];
          if (contents) {
            var url = supportRelativeURL(sourceMap.url, source);
            fileContentsCache[url] = contents;
          }
        });
      }
    } else {
      sourceMap = sourceMapCache[position.source] = {
        url: null,
        map: null
      };
    }
  }

  // Resolve the source URL relative to the URL of the source map
  if (sourceMap && sourceMap.map && typeof sourceMap.map.originalPositionFor === 'function') {
    var originalPosition = sourceMap.map.originalPositionFor(position);

    // Only return the original position if a matching line was found. If no
    // matching line is found then we return position instead, which will cause
    // the stack trace to print the path and line for the compiled file. It is
    // better to give a precise location in the compiled file than a vague
    // location in the original file.
    if (originalPosition.source !== null) {
      originalPosition.source = supportRelativeURL(
        sourceMap.url, originalPosition.source);
      return originalPosition;
    }
  }

  return position;
}

// Parses code generated by FormatEvalOrigin(), a function inside V8:
// https://code.google.com/p/v8/source/browse/trunk/src/messages.js
function mapEvalOrigin(origin) {
  // Most eval() calls are in this format
  var match = /^eval at ([^(]+) \((.+):(\d+):(\d+)\)$/.exec(origin);
  if (match) {
    var position = mapSourcePosition({
      source: match[2],
      line: +match[3],
      column: match[4] - 1
    });
    return 'eval at ' + match[1] + ' (' + position.source + ':' +
      position.line + ':' + (position.column + 1) + ')';
  }

  // Parse nested eval() calls using recursion
  match = /^eval at ([^(]+) \((.+)\)$/.exec(origin);
  if (match) {
    return 'eval at ' + match[1] + ' (' + mapEvalOrigin(match[2]) + ')';
  }

  // Make sure we still return useful information if we didn't find anything
  return origin;
}

// This is copied almost verbatim from the V8 source code at
// https://code.google.com/p/v8/source/browse/trunk/src/messages.js. The
// implementation of wrapCallSite() used to just forward to the actual source
// code of CallSite.prototype.toString but unfortunately a new release of V8
// did something to the prototype chain and broke the shim. The only fix I
// could find was copy/paste.
function CallSiteToString() {
  var fileName;
  var fileLocation = "";
  if (this.isNative()) {
    fileLocation = "native";
  } else {
    fileName = this.getScriptNameOrSourceURL();
    if (!fileName && this.isEval()) {
      fileLocation = this.getEvalOrigin();
      fileLocation += ", ";  // Expecting source position to follow.
    }

    if (fileName) {
      fileLocation += fileName;
    } else {
      // Source code does not originate from a file and is not native, but we
      // can still get the source position inside the source string, e.g. in
      // an eval string.
      fileLocation += "<anonymous>";
    }
    var lineNumber = this.getLineNumber();
    if (lineNumber != null) {
      fileLocation += ":" + lineNumber;
      var columnNumber = this.getColumnNumber();
      if (columnNumber) {
        fileLocation += ":" + columnNumber;
      }
    }
  }

  var line = "";
  var functionName = this.getFunctionName();
  var addSuffix = true;
  var isConstructor = this.isConstructor();
  var isMethodCall = !(this.isToplevel() || isConstructor);
  if (isMethodCall) {
    var typeName = this.getTypeName();
    // Fixes shim to be backward compatable with Node v0 to v4
    if (typeName === "[object Object]") {
      typeName = "null";
    }
    var methodName = this.getMethodName();
    if (functionName) {
      if (typeName && functionName.indexOf(typeName) != 0) {
        line += typeName + ".";
      }
      line += functionName;
      if (methodName && functionName.indexOf("." + methodName) != functionName.length - methodName.length - 1) {
        line += " [as " + methodName + "]";
      }
    } else {
      line += typeName + "." + (methodName || "<anonymous>");
    }
  } else if (isConstructor) {
    line += "new " + (functionName || "<anonymous>");
  } else if (functionName) {
    line += functionName;
  } else {
    line += fileLocation;
    addSuffix = false;
  }
  if (addSuffix) {
    line += " (" + fileLocation + ")";
  }
  return line;
}

function cloneCallSite(frame) {
  var object = {};
  Object.getOwnPropertyNames(Object.getPrototypeOf(frame)).forEach(function(name) {
    object[name] = /^(?:is|get)/.test(name) ? function() { return frame[name].call(frame); } : frame[name];
  });
  object.toString = CallSiteToString;
  return object;
}

function wrapCallSite(frame, state) {
  // provides interface backward compatibility
  if (state === undefined) {
    state = { nextPosition: null, curPosition: null };
  }
  if(frame.isNative()) {
    state.curPosition = null;
    return frame;
  }

  // Most call sites will return the source file from getFileName(), but code
  // passed to eval() ending in "//# sourceURL=..." will return the source file
  // from getScriptNameOrSourceURL() instead
  var source = frame.getFileName() || frame.getScriptNameOrSourceURL();
  if (source) {
    var line = frame.getLineNumber();
    var column = frame.getColumnNumber() - 1;

    // Fix position in Node where some (internal) code is prepended.
    // See https://github.com/evanw/node-source-map-support/issues/36
    // Header removed in node at ^10.16 || >=11.11.0
    // v11 is not an LTS candidate, we can just test the one version with it.
    // Test node versions for: 10.16-19, 10.20+, 12-19, 20-99, 100+, or 11.11
    var noHeader = /^v(10\.1[6-9]|10\.[2-9][0-9]|10\.[0-9]{3,}|1[2-9]\d*|[2-9]\d|\d{3,}|11\.11)/;
    var headerLength = noHeader.test(process.version) ? 0 : 62;
    if (line === 1 && column > headerLength && !isInBrowser() && !frame.isEval()) {
      column -= headerLength;
    }

    var position = mapSourcePosition({
      source: source,
      line: line,
      column: column
    });
    state.curPosition = position;
    frame = cloneCallSite(frame);
    var originalFunctionName = frame.getFunctionName;
    frame.getFunctionName = function() {
      if (state.nextPosition == null) {
        return originalFunctionName();
      }
      return state.nextPosition.name || originalFunctionName();
    };
    frame.getFileName = function() { return position.source; };
    frame.getLineNumber = function() { return position.line; };
    frame.getColumnNumber = function() { return position.column + 1; };
    frame.getScriptNameOrSourceURL = function() { return position.source; };
    return frame;
  }

  // Code called using eval() needs special handling
  var origin = frame.isEval() && frame.getEvalOrigin();
  if (origin) {
    origin = mapEvalOrigin(origin);
    frame = cloneCallSite(frame);
    frame.getEvalOrigin = function() { return origin; };
    return frame;
  }

  // If we get here then we were unable to change the source position
  return frame;
}

// This function is part of the V8 stack trace API, for more info see:
// https://v8.dev/docs/stack-trace-api
function prepareStackTrace(error, stack) {
  if (emptyCacheBetweenOperations) {
    fileContentsCache = {};
    sourceMapCache = {};
  }

  var name = error.name || 'Error';
  var message = error.message || '';
  var errorString = name + ": " + message;

  var state = { nextPosition: null, curPosition: null };
  var processedStack = [];
  for (var i = stack.length - 1; i >= 0; i--) {
    processedStack.push('\n    at ' + wrapCallSite(stack[i], state));
    state.nextPosition = state.curPosition;
  }
  state.curPosition = state.nextPosition = null;
  return errorString + processedStack.reverse().join('');
}

// Generate position and snippet of original source with pointer
function getErrorSource(error) {
  var match = /\n    at [^(]+ \((.*):(\d+):(\d+)\)/.exec(error.stack);
  if (match) {
    var source = match[1];
    var line = +match[2];
    var column = +match[3];

    // Support the inline sourceContents inside the source map
    var contents = fileContentsCache[source];

    // Support files on disk
    if (!contents && fs && fs.existsSync(source)) {
      try {
        contents = fs.readFileSync(source, 'utf8');
      } catch (er) {
        contents = '';
      }
    }

    // Format the line from the original source code like node does
    if (contents) {
      var code = contents.split(/(?:\r\n|\r|\n)/)[line - 1];
      if (code) {
        return source + ':' + line + '\n' + code + '\n' +
          new Array(column).join(' ') + '^';
      }
    }
  }
  return null;
}

function printErrorAndExit (error) {
  var source = getErrorSource(error);

  // Ensure error is printed synchronously and not truncated
  if (process.stderr._handle && process.stderr._handle.setBlocking) {
    process.stderr._handle.setBlocking(true);
  }

  if (source) {
    console.error();
    console.error(source);
  }

  console.error(error.stack);
  process.exit(1);
}

function shimEmitUncaughtException () {
  var origEmit = process.emit;

  process.emit = function (type) {
    if (type === 'uncaughtException') {
      var hasStack = (arguments[1] && arguments[1].stack);
      var hasListeners = (this.listeners(type).length > 0);

      if (hasStack && !hasListeners) {
        return printErrorAndExit(arguments[1]);
      }
    }

    return origEmit.apply(this, arguments);
  };
}

var originalRetrieveFileHandlers = retrieveFileHandlers.slice(0);
var originalRetrieveMapHandlers = retrieveMapHandlers.slice(0);

exports.wrapCallSite = wrapCallSite;
exports.getErrorSource = getErrorSource;
exports.mapSourcePosition = mapSourcePosition;
exports.retrieveSourceMap = retrieveSourceMap;

exports.install = function(options) {
  options = options || {};

  if (options.environment) {
    environment = options.environment;
    if (["node", "browser", "auto"].indexOf(environment) === -1) {
      throw new Error("environment " + environment + " was unknown. Available options are {auto, browser, node}")
    }
  }

  // Allow sources to be found by methods other than reading the files
  // directly from disk.
  if (options.retrieveFile) {
    if (options.overrideRetrieveFile) {
      retrieveFileHandlers.length = 0;
    }

    retrieveFileHandlers.unshift(options.retrieveFile);
  }

  // Allow source maps to be found by methods other than reading the files
  // directly from disk.
  if (options.retrieveSourceMap) {
    if (options.overrideRetrieveSourceMap) {
      retrieveMapHandlers.length = 0;
    }

    retrieveMapHandlers.unshift(options.retrieveSourceMap);
  }

  // Support runtime transpilers that include inline source maps
  if (options.hookRequire && !isInBrowser()) {
    // Use dynamicRequire to avoid including in browser bundles
    var Module = dynamicRequire(module, 'module');
    var $compile = Module.prototype._compile;

    if (!$compile.__sourceMapSupport) {
      Module.prototype._compile = function(content, filename) {
        fileContentsCache[filename] = content;
        sourceMapCache[filename] = undefined;
        return $compile.call(this, content, filename);
      };

      Module.prototype._compile.__sourceMapSupport = true;
    }
  }

  // Configure options
  if (!emptyCacheBetweenOperations) {
    emptyCacheBetweenOperations = 'emptyCacheBetweenOperations' in options ?
      options.emptyCacheBetweenOperations : false;
  }

  // Install the error reformatter
  if (!errorFormatterInstalled) {
    errorFormatterInstalled = true;
    Error.prepareStackTrace = prepareStackTrace;
  }

  if (!uncaughtShimInstalled) {
    var installHandler = 'handleUncaughtExceptions' in options ?
      options.handleUncaughtExceptions : true;

    // Do not override 'uncaughtException' with our own handler in Node.js
    // Worker threads. Workers pass the error to the main thread as an event,
    // rather than printing something to stderr and exiting.
    try {
      // We need to use `dynamicRequire` because `require` on it's own will be optimized by WebPack/Browserify.
      var worker_threads = dynamicRequire(module, 'worker_threads');
      if (worker_threads.isMainThread === false) {
        installHandler = false;
      }
    } catch(e) {}

    // Provide the option to not install the uncaught exception handler. This is
    // to support other uncaught exception handlers (in test frameworks, for
    // example). If this handler is not installed and there are no other uncaught
    // exception handlers, uncaught exceptions will be caught by node's built-in
    // exception handler and the process will still be terminated. However, the
    // generated JavaScript code will be shown above the stack trace instead of
    // the original source code.
    if (installHandler && hasGlobalProcessEventEmitter()) {
      uncaughtShimInstalled = true;
      shimEmitUncaughtException();
    }
  }
};

exports.resetRetrieveHandlers = function() {
  retrieveFileHandlers.length = 0;
  retrieveMapHandlers.length = 0;

  retrieveFileHandlers = originalRetrieveFileHandlers.slice(0);
  retrieveMapHandlers = originalRetrieveMapHandlers.slice(0);

  retrieveSourceMap = handlerExec(retrieveMapHandlers);
  retrieveFile = handlerExec(retrieveFileHandlers);
};
});

sourceMapSupport.install();

var fromCallback = function (fn) {
  return Object.defineProperty(function (...args) {
    if (typeof args[args.length - 1] === 'function') fn.apply(this, args);
    else {
      return new Promise((resolve, reject) => {
        fn.apply(
          this,
          args.concat([(err, res) => err ? reject(err) : resolve(res)])
        );
      })
    }
  }, 'name', { value: fn.name })
};

var fromPromise = function (fn) {
  return Object.defineProperty(function (...args) {
    const cb = args[args.length - 1];
    if (typeof cb !== 'function') return fn.apply(this, args)
    else fn.apply(this, args.slice(0, -1)).then(r => cb(null, r), cb);
  }, 'name', { value: fn.name })
};

var universalify = {
	fromCallback: fromCallback,
	fromPromise: fromPromise
};

var origCwd = process.cwd;
var cwd = null;

var platform = process.env.GRACEFUL_FS_PLATFORM || process.platform;

process.cwd = function() {
  if (!cwd)
    cwd = origCwd.call(process);
  return cwd
};
try {
  process.cwd();
} catch (er) {}

var chdir = process.chdir;
process.chdir = function(d) {
  cwd = null;
  chdir.call(process, d);
};

var polyfills = patch;

function patch (fs) {
  // (re-)implement some things that are known busted or missing.

  // lchmod, broken prior to 0.6.2
  // back-port the fix here.
  if (constants__default['default'].hasOwnProperty('O_SYMLINK') &&
      process.version.match(/^v0\.6\.[0-2]|^v0\.5\./)) {
    patchLchmod(fs);
  }

  // lutimes implementation, or no-op
  if (!fs.lutimes) {
    patchLutimes(fs);
  }

  // https://github.com/isaacs/node-graceful-fs/issues/4
  // Chown should not fail on einval or eperm if non-root.
  // It should not fail on enosys ever, as this just indicates
  // that a fs doesn't support the intended operation.

  fs.chown = chownFix(fs.chown);
  fs.fchown = chownFix(fs.fchown);
  fs.lchown = chownFix(fs.lchown);

  fs.chmod = chmodFix(fs.chmod);
  fs.fchmod = chmodFix(fs.fchmod);
  fs.lchmod = chmodFix(fs.lchmod);

  fs.chownSync = chownFixSync(fs.chownSync);
  fs.fchownSync = chownFixSync(fs.fchownSync);
  fs.lchownSync = chownFixSync(fs.lchownSync);

  fs.chmodSync = chmodFixSync(fs.chmodSync);
  fs.fchmodSync = chmodFixSync(fs.fchmodSync);
  fs.lchmodSync = chmodFixSync(fs.lchmodSync);

  fs.stat = statFix(fs.stat);
  fs.fstat = statFix(fs.fstat);
  fs.lstat = statFix(fs.lstat);

  fs.statSync = statFixSync(fs.statSync);
  fs.fstatSync = statFixSync(fs.fstatSync);
  fs.lstatSync = statFixSync(fs.lstatSync);

  // if lchmod/lchown do not exist, then make them no-ops
  if (!fs.lchmod) {
    fs.lchmod = function (path, mode, cb) {
      if (cb) process.nextTick(cb);
    };
    fs.lchmodSync = function () {};
  }
  if (!fs.lchown) {
    fs.lchown = function (path, uid, gid, cb) {
      if (cb) process.nextTick(cb);
    };
    fs.lchownSync = function () {};
  }

  // on Windows, A/V software can lock the directory, causing this
  // to fail with an EACCES or EPERM if the directory contains newly
  // created files.  Try again on failure, for up to 60 seconds.

  // Set the timeout this long because some Windows Anti-Virus, such as Parity
  // bit9, may lock files for up to a minute, causing npm package install
  // failures. Also, take care to yield the scheduler. Windows scheduling gives
  // CPU to a busy looping process, which can cause the program causing the lock
  // contention to be starved of CPU by node, so the contention doesn't resolve.
  if (platform === "win32") {
    fs.rename = (function (fs$rename) { return function (from, to, cb) {
      var start = Date.now();
      var backoff = 0;
      fs$rename(from, to, function CB (er) {
        if (er
            && (er.code === "EACCES" || er.code === "EPERM")
            && Date.now() - start < 60000) {
          setTimeout(function() {
            fs.stat(to, function (stater, st) {
              if (stater && stater.code === "ENOENT")
                fs$rename(from, to, CB);
              else
                cb(er);
            });
          }, backoff);
          if (backoff < 100)
            backoff += 10;
          return;
        }
        if (cb) cb(er);
      });
    }})(fs.rename);
  }

  // if read() returns EAGAIN, then just try it again.
  fs.read = (function (fs$read) {
    function read (fd, buffer, offset, length, position, callback_) {
      var callback;
      if (callback_ && typeof callback_ === 'function') {
        var eagCounter = 0;
        callback = function (er, _, __) {
          if (er && er.code === 'EAGAIN' && eagCounter < 10) {
            eagCounter ++;
            return fs$read.call(fs, fd, buffer, offset, length, position, callback)
          }
          callback_.apply(this, arguments);
        };
      }
      return fs$read.call(fs, fd, buffer, offset, length, position, callback)
    }

    // This ensures `util.promisify` works as it does for native `fs.read`.
    read.__proto__ = fs$read;
    return read
  })(fs.read);

  fs.readSync = (function (fs$readSync) { return function (fd, buffer, offset, length, position) {
    var eagCounter = 0;
    while (true) {
      try {
        return fs$readSync.call(fs, fd, buffer, offset, length, position)
      } catch (er) {
        if (er.code === 'EAGAIN' && eagCounter < 10) {
          eagCounter ++;
          continue
        }
        throw er
      }
    }
  }})(fs.readSync);

  function patchLchmod (fs) {
    fs.lchmod = function (path, mode, callback) {
      fs.open( path
             , constants__default['default'].O_WRONLY | constants__default['default'].O_SYMLINK
             , mode
             , function (err, fd) {
        if (err) {
          if (callback) callback(err);
          return
        }
        // prefer to return the chmod error, if one occurs,
        // but still try to close, and report closing errors if they occur.
        fs.fchmod(fd, mode, function (err) {
          fs.close(fd, function(err2) {
            if (callback) callback(err || err2);
          });
        });
      });
    };

    fs.lchmodSync = function (path, mode) {
      var fd = fs.openSync(path, constants__default['default'].O_WRONLY | constants__default['default'].O_SYMLINK, mode);

      // prefer to return the chmod error, if one occurs,
      // but still try to close, and report closing errors if they occur.
      var threw = true;
      var ret;
      try {
        ret = fs.fchmodSync(fd, mode);
        threw = false;
      } finally {
        if (threw) {
          try {
            fs.closeSync(fd);
          } catch (er) {}
        } else {
          fs.closeSync(fd);
        }
      }
      return ret
    };
  }

  function patchLutimes (fs) {
    if (constants__default['default'].hasOwnProperty("O_SYMLINK")) {
      fs.lutimes = function (path, at, mt, cb) {
        fs.open(path, constants__default['default'].O_SYMLINK, function (er, fd) {
          if (er) {
            if (cb) cb(er);
            return
          }
          fs.futimes(fd, at, mt, function (er) {
            fs.close(fd, function (er2) {
              if (cb) cb(er || er2);
            });
          });
        });
      };

      fs.lutimesSync = function (path, at, mt) {
        var fd = fs.openSync(path, constants__default['default'].O_SYMLINK);
        var ret;
        var threw = true;
        try {
          ret = fs.futimesSync(fd, at, mt);
          threw = false;
        } finally {
          if (threw) {
            try {
              fs.closeSync(fd);
            } catch (er) {}
          } else {
            fs.closeSync(fd);
          }
        }
        return ret
      };

    } else {
      fs.lutimes = function (_a, _b, _c, cb) { if (cb) process.nextTick(cb); };
      fs.lutimesSync = function () {};
    }
  }

  function chmodFix (orig) {
    if (!orig) return orig
    return function (target, mode, cb) {
      return orig.call(fs, target, mode, function (er) {
        if (chownErOk(er)) er = null;
        if (cb) cb.apply(this, arguments);
      })
    }
  }

  function chmodFixSync (orig) {
    if (!orig) return orig
    return function (target, mode) {
      try {
        return orig.call(fs, target, mode)
      } catch (er) {
        if (!chownErOk(er)) throw er
      }
    }
  }


  function chownFix (orig) {
    if (!orig) return orig
    return function (target, uid, gid, cb) {
      return orig.call(fs, target, uid, gid, function (er) {
        if (chownErOk(er)) er = null;
        if (cb) cb.apply(this, arguments);
      })
    }
  }

  function chownFixSync (orig) {
    if (!orig) return orig
    return function (target, uid, gid) {
      try {
        return orig.call(fs, target, uid, gid)
      } catch (er) {
        if (!chownErOk(er)) throw er
      }
    }
  }

  function statFix (orig) {
    if (!orig) return orig
    // Older versions of Node erroneously returned signed integers for
    // uid + gid.
    return function (target, options, cb) {
      if (typeof options === 'function') {
        cb = options;
        options = null;
      }
      function callback (er, stats) {
        if (stats) {
          if (stats.uid < 0) stats.uid += 0x100000000;
          if (stats.gid < 0) stats.gid += 0x100000000;
        }
        if (cb) cb.apply(this, arguments);
      }
      return options ? orig.call(fs, target, options, callback)
        : orig.call(fs, target, callback)
    }
  }

  function statFixSync (orig) {
    if (!orig) return orig
    // Older versions of Node erroneously returned signed integers for
    // uid + gid.
    return function (target, options) {
      var stats = options ? orig.call(fs, target, options)
        : orig.call(fs, target);
      if (stats.uid < 0) stats.uid += 0x100000000;
      if (stats.gid < 0) stats.gid += 0x100000000;
      return stats;
    }
  }

  // ENOSYS means that the fs doesn't support the op. Just ignore
  // that, because it doesn't matter.
  //
  // if there's no getuid, or if getuid() is something other
  // than 0, and the error is EINVAL or EPERM, then just ignore
  // it.
  //
  // This specific case is a silent failure in cp, install, tar,
  // and most other unix tools that manage permissions.
  //
  // When running as root, or if other types of errors are
  // encountered, then it's strict.
  function chownErOk (er) {
    if (!er)
      return true

    if (er.code === "ENOSYS")
      return true

    var nonroot = !process.getuid || process.getuid() !== 0;
    if (nonroot) {
      if (er.code === "EINVAL" || er.code === "EPERM")
        return true
    }

    return false
  }
}

var Stream = Stream__default['default'].Stream;

var legacyStreams = legacy;

function legacy (fs) {
  return {
    ReadStream: ReadStream,
    WriteStream: WriteStream
  }

  function ReadStream (path, options) {
    if (!(this instanceof ReadStream)) return new ReadStream(path, options);

    Stream.call(this);

    var self = this;

    this.path = path;
    this.fd = null;
    this.readable = true;
    this.paused = false;

    this.flags = 'r';
    this.mode = 438; /*=0666*/
    this.bufferSize = 64 * 1024;

    options = options || {};

    // Mixin options into this
    var keys = Object.keys(options);
    for (var index = 0, length = keys.length; index < length; index++) {
      var key = keys[index];
      this[key] = options[key];
    }

    if (this.encoding) this.setEncoding(this.encoding);

    if (this.start !== undefined) {
      if ('number' !== typeof this.start) {
        throw TypeError('start must be a Number');
      }
      if (this.end === undefined) {
        this.end = Infinity;
      } else if ('number' !== typeof this.end) {
        throw TypeError('end must be a Number');
      }

      if (this.start > this.end) {
        throw new Error('start must be <= end');
      }

      this.pos = this.start;
    }

    if (this.fd !== null) {
      process.nextTick(function() {
        self._read();
      });
      return;
    }

    fs.open(this.path, this.flags, this.mode, function (err, fd) {
      if (err) {
        self.emit('error', err);
        self.readable = false;
        return;
      }

      self.fd = fd;
      self.emit('open', fd);
      self._read();
    });
  }

  function WriteStream (path, options) {
    if (!(this instanceof WriteStream)) return new WriteStream(path, options);

    Stream.call(this);

    this.path = path;
    this.fd = null;
    this.writable = true;

    this.flags = 'w';
    this.encoding = 'binary';
    this.mode = 438; /*=0666*/
    this.bytesWritten = 0;

    options = options || {};

    // Mixin options into this
    var keys = Object.keys(options);
    for (var index = 0, length = keys.length; index < length; index++) {
      var key = keys[index];
      this[key] = options[key];
    }

    if (this.start !== undefined) {
      if ('number' !== typeof this.start) {
        throw TypeError('start must be a Number');
      }
      if (this.start < 0) {
        throw new Error('start must be >= zero');
      }

      this.pos = this.start;
    }

    this.busy = false;
    this._queue = [];

    if (this.fd === null) {
      this._open = fs.open;
      this._queue.push([this._open, this.path, this.flags, this.mode, undefined]);
      this.flush();
    }
  }
}

var clone_1 = clone;

function clone (obj) {
  if (obj === null || typeof obj !== 'object')
    return obj

  if (obj instanceof Object)
    var copy = { __proto__: obj.__proto__ };
  else
    var copy = Object.create(null);

  Object.getOwnPropertyNames(obj).forEach(function (key) {
    Object.defineProperty(copy, key, Object.getOwnPropertyDescriptor(obj, key));
  });

  return copy
}

var gracefulFs = createCommonjsModule(function (module) {
/* istanbul ignore next - node 0.x polyfill */
var gracefulQueue;
var previousSymbol;

/* istanbul ignore else - node 0.x polyfill */
if (typeof Symbol === 'function' && typeof Symbol.for === 'function') {
  gracefulQueue = Symbol.for('graceful-fs.queue');
  // This is used in testing by future versions
  previousSymbol = Symbol.for('graceful-fs.previous');
} else {
  gracefulQueue = '___graceful-fs.queue';
  previousSymbol = '___graceful-fs.previous';
}

function noop () {}

function publishQueue(context, queue) {
  Object.defineProperty(context, gracefulQueue, {
    get: function() {
      return queue
    }
  });
}

var debug = noop;
if (util__default['default'].debuglog)
  debug = util__default['default'].debuglog('gfs4');
else if (/\bgfs4\b/i.test(process.env.NODE_DEBUG || ''))
  debug = function() {
    var m = util__default['default'].format.apply(util__default['default'], arguments);
    m = 'GFS4: ' + m.split(/\n/).join('\nGFS4: ');
    console.error(m);
  };

// Once time initialization
if (!fs__default['default'][gracefulQueue]) {
  // This queue can be shared by multiple loaded instances
  var queue = commonjsGlobal[gracefulQueue] || [];
  publishQueue(fs__default['default'], queue);

  // Patch fs.close/closeSync to shared queue version, because we need
  // to retry() whenever a close happens *anywhere* in the program.
  // This is essential when multiple graceful-fs instances are
  // in play at the same time.
  fs__default['default'].close = (function (fs$close) {
    function close (fd, cb) {
      return fs$close.call(fs__default['default'], fd, function (err) {
        // This function uses the graceful-fs shared queue
        if (!err) {
          retry();
        }

        if (typeof cb === 'function')
          cb.apply(this, arguments);
      })
    }

    Object.defineProperty(close, previousSymbol, {
      value: fs$close
    });
    return close
  })(fs__default['default'].close);

  fs__default['default'].closeSync = (function (fs$closeSync) {
    function closeSync (fd) {
      // This function uses the graceful-fs shared queue
      fs$closeSync.apply(fs__default['default'], arguments);
      retry();
    }

    Object.defineProperty(closeSync, previousSymbol, {
      value: fs$closeSync
    });
    return closeSync
  })(fs__default['default'].closeSync);

  if (/\bgfs4\b/i.test(process.env.NODE_DEBUG || '')) {
    process.on('exit', function() {
      debug(fs__default['default'][gracefulQueue]);
      assert__default['default'].equal(fs__default['default'][gracefulQueue].length, 0);
    });
  }
}

if (!commonjsGlobal[gracefulQueue]) {
  publishQueue(commonjsGlobal, fs__default['default'][gracefulQueue]);
}

module.exports = patch(clone_1(fs__default['default']));
if (process.env.TEST_GRACEFUL_FS_GLOBAL_PATCH && !fs__default['default'].__patched) {
    module.exports = patch(fs__default['default']);
    fs__default['default'].__patched = true;
}

function patch (fs) {
  // Everything that references the open() function needs to be in here
  polyfills(fs);
  fs.gracefulify = patch;

  fs.createReadStream = createReadStream;
  fs.createWriteStream = createWriteStream;
  var fs$readFile = fs.readFile;
  fs.readFile = readFile;
  function readFile (path, options, cb) {
    if (typeof options === 'function')
      cb = options, options = null;

    return go$readFile(path, options, cb)

    function go$readFile (path, options, cb) {
      return fs$readFile(path, options, function (err) {
        if (err && (err.code === 'EMFILE' || err.code === 'ENFILE'))
          enqueue([go$readFile, [path, options, cb]]);
        else {
          if (typeof cb === 'function')
            cb.apply(this, arguments);
          retry();
        }
      })
    }
  }

  var fs$writeFile = fs.writeFile;
  fs.writeFile = writeFile;
  function writeFile (path, data, options, cb) {
    if (typeof options === 'function')
      cb = options, options = null;

    return go$writeFile(path, data, options, cb)

    function go$writeFile (path, data, options, cb) {
      return fs$writeFile(path, data, options, function (err) {
        if (err && (err.code === 'EMFILE' || err.code === 'ENFILE'))
          enqueue([go$writeFile, [path, data, options, cb]]);
        else {
          if (typeof cb === 'function')
            cb.apply(this, arguments);
          retry();
        }
      })
    }
  }

  var fs$appendFile = fs.appendFile;
  if (fs$appendFile)
    fs.appendFile = appendFile;
  function appendFile (path, data, options, cb) {
    if (typeof options === 'function')
      cb = options, options = null;

    return go$appendFile(path, data, options, cb)

    function go$appendFile (path, data, options, cb) {
      return fs$appendFile(path, data, options, function (err) {
        if (err && (err.code === 'EMFILE' || err.code === 'ENFILE'))
          enqueue([go$appendFile, [path, data, options, cb]]);
        else {
          if (typeof cb === 'function')
            cb.apply(this, arguments);
          retry();
        }
      })
    }
  }

  var fs$readdir = fs.readdir;
  fs.readdir = readdir;
  function readdir (path, options, cb) {
    var args = [path];
    if (typeof options !== 'function') {
      args.push(options);
    } else {
      cb = options;
    }
    args.push(go$readdir$cb);

    return go$readdir(args)

    function go$readdir$cb (err, files) {
      if (files && files.sort)
        files.sort();

      if (err && (err.code === 'EMFILE' || err.code === 'ENFILE'))
        enqueue([go$readdir, [args]]);

      else {
        if (typeof cb === 'function')
          cb.apply(this, arguments);
        retry();
      }
    }
  }

  function go$readdir (args) {
    return fs$readdir.apply(fs, args)
  }

  if (process.version.substr(0, 4) === 'v0.8') {
    var legStreams = legacyStreams(fs);
    ReadStream = legStreams.ReadStream;
    WriteStream = legStreams.WriteStream;
  }

  var fs$ReadStream = fs.ReadStream;
  if (fs$ReadStream) {
    ReadStream.prototype = Object.create(fs$ReadStream.prototype);
    ReadStream.prototype.open = ReadStream$open;
  }

  var fs$WriteStream = fs.WriteStream;
  if (fs$WriteStream) {
    WriteStream.prototype = Object.create(fs$WriteStream.prototype);
    WriteStream.prototype.open = WriteStream$open;
  }

  Object.defineProperty(fs, 'ReadStream', {
    get: function () {
      return ReadStream
    },
    set: function (val) {
      ReadStream = val;
    },
    enumerable: true,
    configurable: true
  });
  Object.defineProperty(fs, 'WriteStream', {
    get: function () {
      return WriteStream
    },
    set: function (val) {
      WriteStream = val;
    },
    enumerable: true,
    configurable: true
  });

  // legacy names
  var FileReadStream = ReadStream;
  Object.defineProperty(fs, 'FileReadStream', {
    get: function () {
      return FileReadStream
    },
    set: function (val) {
      FileReadStream = val;
    },
    enumerable: true,
    configurable: true
  });
  var FileWriteStream = WriteStream;
  Object.defineProperty(fs, 'FileWriteStream', {
    get: function () {
      return FileWriteStream
    },
    set: function (val) {
      FileWriteStream = val;
    },
    enumerable: true,
    configurable: true
  });

  function ReadStream (path, options) {
    if (this instanceof ReadStream)
      return fs$ReadStream.apply(this, arguments), this
    else
      return ReadStream.apply(Object.create(ReadStream.prototype), arguments)
  }

  function ReadStream$open () {
    var that = this;
    open(that.path, that.flags, that.mode, function (err, fd) {
      if (err) {
        if (that.autoClose)
          that.destroy();

        that.emit('error', err);
      } else {
        that.fd = fd;
        that.emit('open', fd);
        that.read();
      }
    });
  }

  function WriteStream (path, options) {
    if (this instanceof WriteStream)
      return fs$WriteStream.apply(this, arguments), this
    else
      return WriteStream.apply(Object.create(WriteStream.prototype), arguments)
  }

  function WriteStream$open () {
    var that = this;
    open(that.path, that.flags, that.mode, function (err, fd) {
      if (err) {
        that.destroy();
        that.emit('error', err);
      } else {
        that.fd = fd;
        that.emit('open', fd);
      }
    });
  }

  function createReadStream (path, options) {
    return new fs.ReadStream(path, options)
  }

  function createWriteStream (path, options) {
    return new fs.WriteStream(path, options)
  }

  var fs$open = fs.open;
  fs.open = open;
  function open (path, flags, mode, cb) {
    if (typeof mode === 'function')
      cb = mode, mode = null;

    return go$open(path, flags, mode, cb)

    function go$open (path, flags, mode, cb) {
      return fs$open(path, flags, mode, function (err, fd) {
        if (err && (err.code === 'EMFILE' || err.code === 'ENFILE'))
          enqueue([go$open, [path, flags, mode, cb]]);
        else {
          if (typeof cb === 'function')
            cb.apply(this, arguments);
          retry();
        }
      })
    }
  }

  return fs
}

function enqueue (elem) {
  debug('ENQUEUE', elem[0].name, elem[1]);
  fs__default['default'][gracefulQueue].push(elem);
}

function retry () {
  var elem = fs__default['default'][gracefulQueue].shift();
  if (elem) {
    debug('RETRY', elem[0].name, elem[1]);
    elem[0].apply(null, elem[1]);
  }
}
});

var fs_1 = createCommonjsModule(function (module, exports) {
// This is adapted from https://github.com/normalize/mz
// Copyright (c) 2014-2016 Jonathan Ong me@jongleberry.com and Contributors
const u = universalify.fromCallback;


const api = [
  'access',
  'appendFile',
  'chmod',
  'chown',
  'close',
  'copyFile',
  'fchmod',
  'fchown',
  'fdatasync',
  'fstat',
  'fsync',
  'ftruncate',
  'futimes',
  'lchmod',
  'lchown',
  'link',
  'lstat',
  'mkdir',
  'mkdtemp',
  'open',
  'opendir',
  'readdir',
  'readFile',
  'readlink',
  'realpath',
  'rename',
  'rmdir',
  'stat',
  'symlink',
  'truncate',
  'unlink',
  'utimes',
  'writeFile'
].filter(key => {
  // Some commands are not available on some systems. Ex:
  // fs.opendir was added in Node.js v12.12.0
  // fs.lchown is not available on at least some Linux
  return typeof gracefulFs[key] === 'function'
});

// Export all keys:
Object.keys(gracefulFs).forEach(key => {
  if (key === 'promises') {
    // fs.promises is a getter property that triggers ExperimentalWarning
    // Don't re-export it here, the getter is defined in "lib/index.js"
    return
  }
  exports[key] = gracefulFs[key];
});

// Universalify async methods:
api.forEach(method => {
  exports[method] = u(gracefulFs[method]);
});

// We differ from mz/fs in that we still ship the old, broken, fs.exists()
// since we are a drop-in replacement for the native module
exports.exists = function (filename, callback) {
  if (typeof callback === 'function') {
    return gracefulFs.exists(filename, callback)
  }
  return new Promise(resolve => {
    return gracefulFs.exists(filename, resolve)
  })
};

// fs.read(), fs.write(), & fs.writev() need special treatment due to multiple callback args

exports.read = function (fd, buffer, offset, length, position, callback) {
  if (typeof callback === 'function') {
    return gracefulFs.read(fd, buffer, offset, length, position, callback)
  }
  return new Promise((resolve, reject) => {
    gracefulFs.read(fd, buffer, offset, length, position, (err, bytesRead, buffer) => {
      if (err) return reject(err)
      resolve({ bytesRead, buffer });
    });
  })
};

// Function signature can be
// fs.write(fd, buffer[, offset[, length[, position]]], callback)
// OR
// fs.write(fd, string[, position[, encoding]], callback)
// We need to handle both cases, so we use ...args
exports.write = function (fd, buffer, ...args) {
  if (typeof args[args.length - 1] === 'function') {
    return gracefulFs.write(fd, buffer, ...args)
  }

  return new Promise((resolve, reject) => {
    gracefulFs.write(fd, buffer, ...args, (err, bytesWritten, buffer) => {
      if (err) return reject(err)
      resolve({ bytesWritten, buffer });
    });
  })
};

// fs.writev only available in Node v12.9.0+
if (typeof gracefulFs.writev === 'function') {
  // Function signature is
  // s.writev(fd, buffers[, position], callback)
  // We need to handle the optional arg, so we use ...args
  exports.writev = function (fd, buffers, ...args) {
    if (typeof args[args.length - 1] === 'function') {
      return gracefulFs.writev(fd, buffers, ...args)
    }

    return new Promise((resolve, reject) => {
      gracefulFs.writev(fd, buffers, ...args, (err, bytesWritten, buffers) => {
        if (err) return reject(err)
        resolve({ bytesWritten, buffers });
      });
    })
  };
}

// fs.realpath.native only available in Node v9.2+
if (typeof gracefulFs.realpath.native === 'function') {
  exports.realpath.native = u(gracefulFs.realpath.native);
}
});

var atLeastNode = r => {
  const n = process.versions.node.split('.').map(x => parseInt(x, 10));
  r = r.split('.').map(x => parseInt(x, 10));
  return n[0] > r[0] || (n[0] === r[0] && (n[1] > r[1] || (n[1] === r[1] && n[2] >= r[2])))
};

const useNativeRecursiveOption = atLeastNode('10.12.0');

// https://github.com/nodejs/node/issues/8987
// https://github.com/libuv/libuv/pull/1088
const checkPath = pth => {
  if (process.platform === 'win32') {
    const pathHasInvalidWinCharacters = /[<>:"|?*]/.test(pth.replace(path__default['default'].parse(pth).root, ''));

    if (pathHasInvalidWinCharacters) {
      const error = new Error(`Path contains invalid characters: ${pth}`);
      error.code = 'EINVAL';
      throw error
    }
  }
};

const processOptions = options => {
  const defaults = { mode: 0o777 };
  if (typeof options === 'number') options = { mode: options };
  return { ...defaults, ...options }
};

const permissionError = pth => {
  // This replicates the exception of `fs.mkdir` with native the
  // `recusive` option when run on an invalid drive under Windows.
  const error = new Error(`operation not permitted, mkdir '${pth}'`);
  error.code = 'EPERM';
  error.errno = -4048;
  error.path = pth;
  error.syscall = 'mkdir';
  return error
};

var makeDir_1 = async (input, options) => {
  checkPath(input);
  options = processOptions(options);

  if (useNativeRecursiveOption) {
    const pth = path__default['default'].resolve(input);

    return fs_1.mkdir(pth, {
      mode: options.mode,
      recursive: true
    })
  }

  const make = async pth => {
    try {
      await fs_1.mkdir(pth, options.mode);
    } catch (error) {
      if (error.code === 'EPERM') {
        throw error
      }

      if (error.code === 'ENOENT') {
        if (path__default['default'].dirname(pth) === pth) {
          throw permissionError(pth)
        }

        if (error.message.includes('null bytes')) {
          throw error
        }

        await make(path__default['default'].dirname(pth));
        return make(pth)
      }

      try {
        const stats = await fs_1.stat(pth);
        if (!stats.isDirectory()) {
          // This error is never exposed to the user
          // it is caught below, and the original error is thrown
          throw new Error('The path is not a directory')
        }
      } catch {
        throw error
      }
    }
  };

  return make(path__default['default'].resolve(input))
};

var makeDirSync = (input, options) => {
  checkPath(input);
  options = processOptions(options);

  if (useNativeRecursiveOption) {
    const pth = path__default['default'].resolve(input);

    return fs_1.mkdirSync(pth, {
      mode: options.mode,
      recursive: true
    })
  }

  const make = pth => {
    try {
      fs_1.mkdirSync(pth, options.mode);
    } catch (error) {
      if (error.code === 'EPERM') {
        throw error
      }

      if (error.code === 'ENOENT') {
        if (path__default['default'].dirname(pth) === pth) {
          throw permissionError(pth)
        }

        if (error.message.includes('null bytes')) {
          throw error
        }

        make(path__default['default'].dirname(pth));
        return make(pth)
      }

      try {
        if (!fs_1.statSync(pth).isDirectory()) {
          // This error is never exposed to the user
          // it is caught below, and the original error is thrown
          throw new Error('The path is not a directory')
        }
      } catch {
        throw error
      }
    }
  };

  return make(path__default['default'].resolve(input))
};

var makeDir = {
	makeDir: makeDir_1,
	makeDirSync: makeDirSync
};

const u = universalify.fromPromise;
const { makeDir: _makeDir, makeDirSync: makeDirSync$1 } = makeDir;
const makeDir$1 = u(_makeDir);

var mkdirs = {
  mkdirs: makeDir$1,
  mkdirsSync: makeDirSync$1,
  // alias
  mkdirp: makeDir$1,
  mkdirpSync: makeDirSync$1,
  ensureDir: makeDir$1,
  ensureDirSync: makeDirSync$1
};

function utimesMillis (path, atime, mtime, callback) {
  // if (!HAS_MILLIS_RES) return fs.utimes(path, atime, mtime, callback)
  gracefulFs.open(path, 'r+', (err, fd) => {
    if (err) return callback(err)
    gracefulFs.futimes(fd, atime, mtime, futimesErr => {
      gracefulFs.close(fd, closeErr => {
        if (callback) callback(futimesErr || closeErr);
      });
    });
  });
}

function utimesMillisSync (path, atime, mtime) {
  const fd = gracefulFs.openSync(path, 'r+');
  gracefulFs.futimesSync(fd, atime, mtime);
  return gracefulFs.closeSync(fd)
}

var utimes = {
  utimesMillis,
  utimesMillisSync
};

const nodeSupportsBigInt = atLeastNode('10.5.0');
const stat = (file) => nodeSupportsBigInt ? fs_1.stat(file, { bigint: true }) : fs_1.stat(file);
const statSync = (file) => nodeSupportsBigInt ? fs_1.statSync(file, { bigint: true }) : fs_1.statSync(file);

function getStats (src, dest) {
  return Promise.all([
    stat(src),
    stat(dest).catch(err => {
      if (err.code === 'ENOENT') return null
      throw err
    })
  ]).then(([srcStat, destStat]) => ({ srcStat, destStat }))
}

function getStatsSync (src, dest) {
  let destStat;
  const srcStat = statSync(src);
  try {
    destStat = statSync(dest);
  } catch (err) {
    if (err.code === 'ENOENT') return { srcStat, destStat: null }
    throw err
  }
  return { srcStat, destStat }
}

function checkPaths (src, dest, funcName, cb) {
  util__default['default'].callbackify(getStats)(src, dest, (err, stats) => {
    if (err) return cb(err)
    const { srcStat, destStat } = stats;
    if (destStat && areIdentical(srcStat, destStat)) {
      return cb(new Error('Source and destination must not be the same.'))
    }
    if (srcStat.isDirectory() && isSrcSubdir(src, dest)) {
      return cb(new Error(errMsg(src, dest, funcName)))
    }
    return cb(null, { srcStat, destStat })
  });
}

function checkPathsSync (src, dest, funcName) {
  const { srcStat, destStat } = getStatsSync(src, dest);
  if (destStat && areIdentical(srcStat, destStat)) {
    throw new Error('Source and destination must not be the same.')
  }
  if (srcStat.isDirectory() && isSrcSubdir(src, dest)) {
    throw new Error(errMsg(src, dest, funcName))
  }
  return { srcStat, destStat }
}

// recursively check if dest parent is a subdirectory of src.
// It works for all file types including symlinks since it
// checks the src and dest inodes. It starts from the deepest
// parent and stops once it reaches the src parent or the root path.
function checkParentPaths (src, srcStat, dest, funcName, cb) {
  const srcParent = path__default['default'].resolve(path__default['default'].dirname(src));
  const destParent = path__default['default'].resolve(path__default['default'].dirname(dest));
  if (destParent === srcParent || destParent === path__default['default'].parse(destParent).root) return cb()
  const callback = (err, destStat) => {
    if (err) {
      if (err.code === 'ENOENT') return cb()
      return cb(err)
    }
    if (areIdentical(srcStat, destStat)) {
      return cb(new Error(errMsg(src, dest, funcName)))
    }
    return checkParentPaths(src, srcStat, destParent, funcName, cb)
  };
  if (nodeSupportsBigInt) fs_1.stat(destParent, { bigint: true }, callback);
  else fs_1.stat(destParent, callback);
}

function checkParentPathsSync (src, srcStat, dest, funcName) {
  const srcParent = path__default['default'].resolve(path__default['default'].dirname(src));
  const destParent = path__default['default'].resolve(path__default['default'].dirname(dest));
  if (destParent === srcParent || destParent === path__default['default'].parse(destParent).root) return
  let destStat;
  try {
    destStat = statSync(destParent);
  } catch (err) {
    if (err.code === 'ENOENT') return
    throw err
  }
  if (areIdentical(srcStat, destStat)) {
    throw new Error(errMsg(src, dest, funcName))
  }
  return checkParentPathsSync(src, srcStat, destParent, funcName)
}

function areIdentical (srcStat, destStat) {
  if (destStat.ino && destStat.dev && destStat.ino === srcStat.ino && destStat.dev === srcStat.dev) {
    if (nodeSupportsBigInt || destStat.ino < Number.MAX_SAFE_INTEGER) {
      // definitive answer
      return true
    }
    // Use additional heuristics if we can't use 'bigint'.
    // Different 'ino' could be represented the same if they are >= Number.MAX_SAFE_INTEGER
    // See issue 657
    if (destStat.size === srcStat.size &&
        destStat.mode === srcStat.mode &&
        destStat.nlink === srcStat.nlink &&
        destStat.atimeMs === srcStat.atimeMs &&
        destStat.mtimeMs === srcStat.mtimeMs &&
        destStat.ctimeMs === srcStat.ctimeMs &&
        destStat.birthtimeMs === srcStat.birthtimeMs) {
      // heuristic answer
      return true
    }
  }
  return false
}

// return true if dest is a subdir of src, otherwise false.
// It only checks the path strings.
function isSrcSubdir (src, dest) {
  const srcArr = path__default['default'].resolve(src).split(path__default['default'].sep).filter(i => i);
  const destArr = path__default['default'].resolve(dest).split(path__default['default'].sep).filter(i => i);
  return srcArr.reduce((acc, cur, i) => acc && destArr[i] === cur, true)
}

function errMsg (src, dest, funcName) {
  return `Cannot ${funcName} '${src}' to a subdirectory of itself, '${dest}'.`
}

var stat_1 = {
  checkPaths,
  checkPathsSync,
  checkParentPaths,
  checkParentPathsSync,
  isSrcSubdir
};

const mkdirsSync = mkdirs.mkdirsSync;
const utimesMillisSync$1 = utimes.utimesMillisSync;


function copySync (src, dest, opts) {
  if (typeof opts === 'function') {
    opts = { filter: opts };
  }

  opts = opts || {};
  opts.clobber = 'clobber' in opts ? !!opts.clobber : true; // default to true for now
  opts.overwrite = 'overwrite' in opts ? !!opts.overwrite : opts.clobber; // overwrite falls back to clobber

  // Warn about using preserveTimestamps on 32-bit node
  if (opts.preserveTimestamps && process.arch === 'ia32') {
    console.warn(`fs-extra: Using the preserveTimestamps option in 32-bit node is not recommended;\n
    see https://github.com/jprichardson/node-fs-extra/issues/269`);
  }

  const { srcStat, destStat } = stat_1.checkPathsSync(src, dest, 'copy');
  stat_1.checkParentPathsSync(src, srcStat, dest, 'copy');
  return handleFilterAndCopy(destStat, src, dest, opts)
}

function handleFilterAndCopy (destStat, src, dest, opts) {
  if (opts.filter && !opts.filter(src, dest)) return
  const destParent = path__default['default'].dirname(dest);
  if (!gracefulFs.existsSync(destParent)) mkdirsSync(destParent);
  return startCopy(destStat, src, dest, opts)
}

function startCopy (destStat, src, dest, opts) {
  if (opts.filter && !opts.filter(src, dest)) return
  return getStats$1(destStat, src, dest, opts)
}

function getStats$1 (destStat, src, dest, opts) {
  const statSync = opts.dereference ? gracefulFs.statSync : gracefulFs.lstatSync;
  const srcStat = statSync(src);

  if (srcStat.isDirectory()) return onDir(srcStat, destStat, src, dest, opts)
  else if (srcStat.isFile() ||
           srcStat.isCharacterDevice() ||
           srcStat.isBlockDevice()) return onFile(srcStat, destStat, src, dest, opts)
  else if (srcStat.isSymbolicLink()) return onLink(destStat, src, dest, opts)
}

function onFile (srcStat, destStat, src, dest, opts) {
  if (!destStat) return copyFile(srcStat, src, dest, opts)
  return mayCopyFile(srcStat, src, dest, opts)
}

function mayCopyFile (srcStat, src, dest, opts) {
  if (opts.overwrite) {
    gracefulFs.unlinkSync(dest);
    return copyFile(srcStat, src, dest, opts)
  } else if (opts.errorOnExist) {
    throw new Error(`'${dest}' already exists`)
  }
}

function copyFile (srcStat, src, dest, opts) {
  gracefulFs.copyFileSync(src, dest);
  if (opts.preserveTimestamps) handleTimestamps(srcStat.mode, src, dest);
  return setDestMode(dest, srcStat.mode)
}

function handleTimestamps (srcMode, src, dest) {
  // Make sure the file is writable before setting the timestamp
  // otherwise open fails with EPERM when invoked with 'r+'
  // (through utimes call)
  if (fileIsNotWritable(srcMode)) makeFileWritable(dest, srcMode);
  return setDestTimestamps(src, dest)
}

function fileIsNotWritable (srcMode) {
  return (srcMode & 0o200) === 0
}

function makeFileWritable (dest, srcMode) {
  return setDestMode(dest, srcMode | 0o200)
}

function setDestMode (dest, srcMode) {
  return gracefulFs.chmodSync(dest, srcMode)
}

function setDestTimestamps (src, dest) {
  // The initial srcStat.atime cannot be trusted
  // because it is modified by the read(2) system call
  // (See https://nodejs.org/api/fs.html#fs_stat_time_values)
  const updatedSrcStat = gracefulFs.statSync(src);
  return utimesMillisSync$1(dest, updatedSrcStat.atime, updatedSrcStat.mtime)
}

function onDir (srcStat, destStat, src, dest, opts) {
  if (!destStat) return mkDirAndCopy(srcStat.mode, src, dest, opts)
  if (destStat && !destStat.isDirectory()) {
    throw new Error(`Cannot overwrite non-directory '${dest}' with directory '${src}'.`)
  }
  return copyDir(src, dest, opts)
}

function mkDirAndCopy (srcMode, src, dest, opts) {
  gracefulFs.mkdirSync(dest);
  copyDir(src, dest, opts);
  return setDestMode(dest, srcMode)
}

function copyDir (src, dest, opts) {
  gracefulFs.readdirSync(src).forEach(item => copyDirItem(item, src, dest, opts));
}

function copyDirItem (item, src, dest, opts) {
  const srcItem = path__default['default'].join(src, item);
  const destItem = path__default['default'].join(dest, item);
  const { destStat } = stat_1.checkPathsSync(srcItem, destItem, 'copy');
  return startCopy(destStat, srcItem, destItem, opts)
}

function onLink (destStat, src, dest, opts) {
  let resolvedSrc = gracefulFs.readlinkSync(src);
  if (opts.dereference) {
    resolvedSrc = path__default['default'].resolve(process.cwd(), resolvedSrc);
  }

  if (!destStat) {
    return gracefulFs.symlinkSync(resolvedSrc, dest)
  } else {
    let resolvedDest;
    try {
      resolvedDest = gracefulFs.readlinkSync(dest);
    } catch (err) {
      // dest exists and is a regular file or directory,
      // Windows may throw UNKNOWN error. If dest already exists,
      // fs throws error anyway, so no need to guard against it here.
      if (err.code === 'EINVAL' || err.code === 'UNKNOWN') return gracefulFs.symlinkSync(resolvedSrc, dest)
      throw err
    }
    if (opts.dereference) {
      resolvedDest = path__default['default'].resolve(process.cwd(), resolvedDest);
    }
    if (stat_1.isSrcSubdir(resolvedSrc, resolvedDest)) {
      throw new Error(`Cannot copy '${resolvedSrc}' to a subdirectory of itself, '${resolvedDest}'.`)
    }

    // prevent copy if src is a subdir of dest since unlinking
    // dest in this case would result in removing src contents
    // and therefore a broken symlink would be created.
    if (gracefulFs.statSync(dest).isDirectory() && stat_1.isSrcSubdir(resolvedDest, resolvedSrc)) {
      throw new Error(`Cannot overwrite '${resolvedDest}' with '${resolvedSrc}'.`)
    }
    return copyLink(resolvedSrc, dest)
  }
}

function copyLink (resolvedSrc, dest) {
  gracefulFs.unlinkSync(dest);
  return gracefulFs.symlinkSync(resolvedSrc, dest)
}

var copySync_1 = copySync;

var copySync$1 = {
  copySync: copySync_1
};

const u$1 = universalify.fromPromise;


function pathExists (path) {
  return fs_1.access(path).then(() => true).catch(() => false)
}

var pathExists_1 = {
  pathExists: u$1(pathExists),
  pathExistsSync: fs_1.existsSync
};

const mkdirs$1 = mkdirs.mkdirs;
const pathExists$1 = pathExists_1.pathExists;
const utimesMillis$1 = utimes.utimesMillis;


function copy (src, dest, opts, cb) {
  if (typeof opts === 'function' && !cb) {
    cb = opts;
    opts = {};
  } else if (typeof opts === 'function') {
    opts = { filter: opts };
  }

  cb = cb || function () {};
  opts = opts || {};

  opts.clobber = 'clobber' in opts ? !!opts.clobber : true; // default to true for now
  opts.overwrite = 'overwrite' in opts ? !!opts.overwrite : opts.clobber; // overwrite falls back to clobber

  // Warn about using preserveTimestamps on 32-bit node
  if (opts.preserveTimestamps && process.arch === 'ia32') {
    console.warn(`fs-extra: Using the preserveTimestamps option in 32-bit node is not recommended;\n
    see https://github.com/jprichardson/node-fs-extra/issues/269`);
  }

  stat_1.checkPaths(src, dest, 'copy', (err, stats) => {
    if (err) return cb(err)
    const { srcStat, destStat } = stats;
    stat_1.checkParentPaths(src, srcStat, dest, 'copy', err => {
      if (err) return cb(err)
      if (opts.filter) return handleFilter(checkParentDir, destStat, src, dest, opts, cb)
      return checkParentDir(destStat, src, dest, opts, cb)
    });
  });
}

function checkParentDir (destStat, src, dest, opts, cb) {
  const destParent = path__default['default'].dirname(dest);
  pathExists$1(destParent, (err, dirExists) => {
    if (err) return cb(err)
    if (dirExists) return startCopy$1(destStat, src, dest, opts, cb)
    mkdirs$1(destParent, err => {
      if (err) return cb(err)
      return startCopy$1(destStat, src, dest, opts, cb)
    });
  });
}

function handleFilter (onInclude, destStat, src, dest, opts, cb) {
  Promise.resolve(opts.filter(src, dest)).then(include => {
    if (include) return onInclude(destStat, src, dest, opts, cb)
    return cb()
  }, error => cb(error));
}

function startCopy$1 (destStat, src, dest, opts, cb) {
  if (opts.filter) return handleFilter(getStats$2, destStat, src, dest, opts, cb)
  return getStats$2(destStat, src, dest, opts, cb)
}

function getStats$2 (destStat, src, dest, opts, cb) {
  const stat = opts.dereference ? gracefulFs.stat : gracefulFs.lstat;
  stat(src, (err, srcStat) => {
    if (err) return cb(err)

    if (srcStat.isDirectory()) return onDir$1(srcStat, destStat, src, dest, opts, cb)
    else if (srcStat.isFile() ||
             srcStat.isCharacterDevice() ||
             srcStat.isBlockDevice()) return onFile$1(srcStat, destStat, src, dest, opts, cb)
    else if (srcStat.isSymbolicLink()) return onLink$1(destStat, src, dest, opts, cb)
  });
}

function onFile$1 (srcStat, destStat, src, dest, opts, cb) {
  if (!destStat) return copyFile$1(srcStat, src, dest, opts, cb)
  return mayCopyFile$1(srcStat, src, dest, opts, cb)
}

function mayCopyFile$1 (srcStat, src, dest, opts, cb) {
  if (opts.overwrite) {
    gracefulFs.unlink(dest, err => {
      if (err) return cb(err)
      return copyFile$1(srcStat, src, dest, opts, cb)
    });
  } else if (opts.errorOnExist) {
    return cb(new Error(`'${dest}' already exists`))
  } else return cb()
}

function copyFile$1 (srcStat, src, dest, opts, cb) {
  gracefulFs.copyFile(src, dest, err => {
    if (err) return cb(err)
    if (opts.preserveTimestamps) return handleTimestampsAndMode(srcStat.mode, src, dest, cb)
    return setDestMode$1(dest, srcStat.mode, cb)
  });
}

function handleTimestampsAndMode (srcMode, src, dest, cb) {
  // Make sure the file is writable before setting the timestamp
  // otherwise open fails with EPERM when invoked with 'r+'
  // (through utimes call)
  if (fileIsNotWritable$1(srcMode)) {
    return makeFileWritable$1(dest, srcMode, err => {
      if (err) return cb(err)
      return setDestTimestampsAndMode(srcMode, src, dest, cb)
    })
  }
  return setDestTimestampsAndMode(srcMode, src, dest, cb)
}

function fileIsNotWritable$1 (srcMode) {
  return (srcMode & 0o200) === 0
}

function makeFileWritable$1 (dest, srcMode, cb) {
  return setDestMode$1(dest, srcMode | 0o200, cb)
}

function setDestTimestampsAndMode (srcMode, src, dest, cb) {
  setDestTimestamps$1(src, dest, err => {
    if (err) return cb(err)
    return setDestMode$1(dest, srcMode, cb)
  });
}

function setDestMode$1 (dest, srcMode, cb) {
  return gracefulFs.chmod(dest, srcMode, cb)
}

function setDestTimestamps$1 (src, dest, cb) {
  // The initial srcStat.atime cannot be trusted
  // because it is modified by the read(2) system call
  // (See https://nodejs.org/api/fs.html#fs_stat_time_values)
  gracefulFs.stat(src, (err, updatedSrcStat) => {
    if (err) return cb(err)
    return utimesMillis$1(dest, updatedSrcStat.atime, updatedSrcStat.mtime, cb)
  });
}

function onDir$1 (srcStat, destStat, src, dest, opts, cb) {
  if (!destStat) return mkDirAndCopy$1(srcStat.mode, src, dest, opts, cb)
  if (destStat && !destStat.isDirectory()) {
    return cb(new Error(`Cannot overwrite non-directory '${dest}' with directory '${src}'.`))
  }
  return copyDir$1(src, dest, opts, cb)
}

function mkDirAndCopy$1 (srcMode, src, dest, opts, cb) {
  gracefulFs.mkdir(dest, err => {
    if (err) return cb(err)
    copyDir$1(src, dest, opts, err => {
      if (err) return cb(err)
      return setDestMode$1(dest, srcMode, cb)
    });
  });
}

function copyDir$1 (src, dest, opts, cb) {
  gracefulFs.readdir(src, (err, items) => {
    if (err) return cb(err)
    return copyDirItems(items, src, dest, opts, cb)
  });
}

function copyDirItems (items, src, dest, opts, cb) {
  const item = items.pop();
  if (!item) return cb()
  return copyDirItem$1(items, item, src, dest, opts, cb)
}

function copyDirItem$1 (items, item, src, dest, opts, cb) {
  const srcItem = path__default['default'].join(src, item);
  const destItem = path__default['default'].join(dest, item);
  stat_1.checkPaths(srcItem, destItem, 'copy', (err, stats) => {
    if (err) return cb(err)
    const { destStat } = stats;
    startCopy$1(destStat, srcItem, destItem, opts, err => {
      if (err) return cb(err)
      return copyDirItems(items, src, dest, opts, cb)
    });
  });
}

function onLink$1 (destStat, src, dest, opts, cb) {
  gracefulFs.readlink(src, (err, resolvedSrc) => {
    if (err) return cb(err)
    if (opts.dereference) {
      resolvedSrc = path__default['default'].resolve(process.cwd(), resolvedSrc);
    }

    if (!destStat) {
      return gracefulFs.symlink(resolvedSrc, dest, cb)
    } else {
      gracefulFs.readlink(dest, (err, resolvedDest) => {
        if (err) {
          // dest exists and is a regular file or directory,
          // Windows may throw UNKNOWN error. If dest already exists,
          // fs throws error anyway, so no need to guard against it here.
          if (err.code === 'EINVAL' || err.code === 'UNKNOWN') return gracefulFs.symlink(resolvedSrc, dest, cb)
          return cb(err)
        }
        if (opts.dereference) {
          resolvedDest = path__default['default'].resolve(process.cwd(), resolvedDest);
        }
        if (stat_1.isSrcSubdir(resolvedSrc, resolvedDest)) {
          return cb(new Error(`Cannot copy '${resolvedSrc}' to a subdirectory of itself, '${resolvedDest}'.`))
        }

        // do not copy if src is a subdir of dest since unlinking
        // dest in this case would result in removing src contents
        // and therefore a broken symlink would be created.
        if (destStat.isDirectory() && stat_1.isSrcSubdir(resolvedDest, resolvedSrc)) {
          return cb(new Error(`Cannot overwrite '${resolvedDest}' with '${resolvedSrc}'.`))
        }
        return copyLink$1(resolvedSrc, dest, cb)
      });
    }
  });
}

function copyLink$1 (resolvedSrc, dest, cb) {
  gracefulFs.unlink(dest, err => {
    if (err) return cb(err)
    return gracefulFs.symlink(resolvedSrc, dest, cb)
  });
}

var copy_1 = copy;

const u$2 = universalify.fromCallback;
var copy$1 = {
  copy: u$2(copy_1)
};

const isWindows = (process.platform === 'win32');

function defaults (options) {
  const methods = [
    'unlink',
    'chmod',
    'stat',
    'lstat',
    'rmdir',
    'readdir'
  ];
  methods.forEach(m => {
    options[m] = options[m] || gracefulFs[m];
    m = m + 'Sync';
    options[m] = options[m] || gracefulFs[m];
  });

  options.maxBusyTries = options.maxBusyTries || 3;
}

function rimraf (p, options, cb) {
  let busyTries = 0;

  if (typeof options === 'function') {
    cb = options;
    options = {};
  }

  assert__default['default'](p, 'rimraf: missing path');
  assert__default['default'].strictEqual(typeof p, 'string', 'rimraf: path should be a string');
  assert__default['default'].strictEqual(typeof cb, 'function', 'rimraf: callback function required');
  assert__default['default'](options, 'rimraf: invalid options argument provided');
  assert__default['default'].strictEqual(typeof options, 'object', 'rimraf: options should be object');

  defaults(options);

  rimraf_(p, options, function CB (er) {
    if (er) {
      if ((er.code === 'EBUSY' || er.code === 'ENOTEMPTY' || er.code === 'EPERM') &&
          busyTries < options.maxBusyTries) {
        busyTries++;
        const time = busyTries * 100;
        // try again, with the same exact callback as this one.
        return setTimeout(() => rimraf_(p, options, CB), time)
      }

      // already gone
      if (er.code === 'ENOENT') er = null;
    }

    cb(er);
  });
}

// Two possible strategies.
// 1. Assume it's a file.  unlink it, then do the dir stuff on EPERM or EISDIR
// 2. Assume it's a directory.  readdir, then do the file stuff on ENOTDIR
//
// Both result in an extra syscall when you guess wrong.  However, there
// are likely far more normal files in the world than directories.  This
// is based on the assumption that a the average number of files per
// directory is >= 1.
//
// If anyone ever complains about this, then I guess the strategy could
// be made configurable somehow.  But until then, YAGNI.
function rimraf_ (p, options, cb) {
  assert__default['default'](p);
  assert__default['default'](options);
  assert__default['default'](typeof cb === 'function');

  // sunos lets the root user unlink directories, which is... weird.
  // so we have to lstat here and make sure it's not a dir.
  options.lstat(p, (er, st) => {
    if (er && er.code === 'ENOENT') {
      return cb(null)
    }

    // Windows can EPERM on stat.  Life is suffering.
    if (er && er.code === 'EPERM' && isWindows) {
      return fixWinEPERM(p, options, er, cb)
    }

    if (st && st.isDirectory()) {
      return rmdir(p, options, er, cb)
    }

    options.unlink(p, er => {
      if (er) {
        if (er.code === 'ENOENT') {
          return cb(null)
        }
        if (er.code === 'EPERM') {
          return (isWindows)
            ? fixWinEPERM(p, options, er, cb)
            : rmdir(p, options, er, cb)
        }
        if (er.code === 'EISDIR') {
          return rmdir(p, options, er, cb)
        }
      }
      return cb(er)
    });
  });
}

function fixWinEPERM (p, options, er, cb) {
  assert__default['default'](p);
  assert__default['default'](options);
  assert__default['default'](typeof cb === 'function');

  options.chmod(p, 0o666, er2 => {
    if (er2) {
      cb(er2.code === 'ENOENT' ? null : er);
    } else {
      options.stat(p, (er3, stats) => {
        if (er3) {
          cb(er3.code === 'ENOENT' ? null : er);
        } else if (stats.isDirectory()) {
          rmdir(p, options, er, cb);
        } else {
          options.unlink(p, cb);
        }
      });
    }
  });
}

function fixWinEPERMSync (p, options, er) {
  let stats;

  assert__default['default'](p);
  assert__default['default'](options);

  try {
    options.chmodSync(p, 0o666);
  } catch (er2) {
    if (er2.code === 'ENOENT') {
      return
    } else {
      throw er
    }
  }

  try {
    stats = options.statSync(p);
  } catch (er3) {
    if (er3.code === 'ENOENT') {
      return
    } else {
      throw er
    }
  }

  if (stats.isDirectory()) {
    rmdirSync(p, options, er);
  } else {
    options.unlinkSync(p);
  }
}

function rmdir (p, options, originalEr, cb) {
  assert__default['default'](p);
  assert__default['default'](options);
  assert__default['default'](typeof cb === 'function');

  // try to rmdir first, and only readdir on ENOTEMPTY or EEXIST (SunOS)
  // if we guessed wrong, and it's not a directory, then
  // raise the original error.
  options.rmdir(p, er => {
    if (er && (er.code === 'ENOTEMPTY' || er.code === 'EEXIST' || er.code === 'EPERM')) {
      rmkids(p, options, cb);
    } else if (er && er.code === 'ENOTDIR') {
      cb(originalEr);
    } else {
      cb(er);
    }
  });
}

function rmkids (p, options, cb) {
  assert__default['default'](p);
  assert__default['default'](options);
  assert__default['default'](typeof cb === 'function');

  options.readdir(p, (er, files) => {
    if (er) return cb(er)

    let n = files.length;
    let errState;

    if (n === 0) return options.rmdir(p, cb)

    files.forEach(f => {
      rimraf(path__default['default'].join(p, f), options, er => {
        if (errState) {
          return
        }
        if (er) return cb(errState = er)
        if (--n === 0) {
          options.rmdir(p, cb);
        }
      });
    });
  });
}

// this looks simpler, and is strictly *faster*, but will
// tie up the JavaScript thread and fail on excessively
// deep directory trees.
function rimrafSync (p, options) {
  let st;

  options = options || {};
  defaults(options);

  assert__default['default'](p, 'rimraf: missing path');
  assert__default['default'].strictEqual(typeof p, 'string', 'rimraf: path should be a string');
  assert__default['default'](options, 'rimraf: missing options');
  assert__default['default'].strictEqual(typeof options, 'object', 'rimraf: options should be object');

  try {
    st = options.lstatSync(p);
  } catch (er) {
    if (er.code === 'ENOENT') {
      return
    }

    // Windows can EPERM on stat.  Life is suffering.
    if (er.code === 'EPERM' && isWindows) {
      fixWinEPERMSync(p, options, er);
    }
  }

  try {
    // sunos lets the root user unlink directories, which is... weird.
    if (st && st.isDirectory()) {
      rmdirSync(p, options, null);
    } else {
      options.unlinkSync(p);
    }
  } catch (er) {
    if (er.code === 'ENOENT') {
      return
    } else if (er.code === 'EPERM') {
      return isWindows ? fixWinEPERMSync(p, options, er) : rmdirSync(p, options, er)
    } else if (er.code !== 'EISDIR') {
      throw er
    }
    rmdirSync(p, options, er);
  }
}

function rmdirSync (p, options, originalEr) {
  assert__default['default'](p);
  assert__default['default'](options);

  try {
    options.rmdirSync(p);
  } catch (er) {
    if (er.code === 'ENOTDIR') {
      throw originalEr
    } else if (er.code === 'ENOTEMPTY' || er.code === 'EEXIST' || er.code === 'EPERM') {
      rmkidsSync(p, options);
    } else if (er.code !== 'ENOENT') {
      throw er
    }
  }
}

function rmkidsSync (p, options) {
  assert__default['default'](p);
  assert__default['default'](options);
  options.readdirSync(p).forEach(f => rimrafSync(path__default['default'].join(p, f), options));

  if (isWindows) {
    // We only end up here once we got ENOTEMPTY at least once, and
    // at this point, we are guaranteed to have removed all the kids.
    // So, we know that it won't be ENOENT or ENOTDIR or anything else.
    // try really hard to delete stuff on windows, because it has a
    // PROFOUNDLY annoying habit of not closing handles promptly when
    // files are deleted, resulting in spurious ENOTEMPTY errors.
    const startTime = Date.now();
    do {
      try {
        const ret = options.rmdirSync(p, options);
        return ret
      } catch {}
    } while (Date.now() - startTime < 500) // give up after 500ms
  } else {
    const ret = options.rmdirSync(p, options);
    return ret
  }
}

var rimraf_1 = rimraf;
rimraf.sync = rimrafSync;

const u$3 = universalify.fromCallback;


var remove = {
  remove: u$3(rimraf_1),
  removeSync: rimraf_1.sync
};

const u$4 = universalify.fromCallback;





const emptyDir = u$4(function emptyDir (dir, callback) {
  callback = callback || function () {};
  gracefulFs.readdir(dir, (err, items) => {
    if (err) return mkdirs.mkdirs(dir, callback)

    items = items.map(item => path__default['default'].join(dir, item));

    deleteItem();

    function deleteItem () {
      const item = items.pop();
      if (!item) return callback()
      remove.remove(item, err => {
        if (err) return callback(err)
        deleteItem();
      });
    }
  });
});

function emptyDirSync (dir) {
  let items;
  try {
    items = gracefulFs.readdirSync(dir);
  } catch {
    return mkdirs.mkdirsSync(dir)
  }

  items.forEach(item => {
    item = path__default['default'].join(dir, item);
    remove.removeSync(item);
  });
}

var empty = {
  emptyDirSync,
  emptydirSync: emptyDirSync,
  emptyDir,
  emptydir: emptyDir
};

const u$5 = universalify.fromCallback;




function createFile (file, callback) {
  function makeFile () {
    gracefulFs.writeFile(file, '', err => {
      if (err) return callback(err)
      callback();
    });
  }

  gracefulFs.stat(file, (err, stats) => { // eslint-disable-line handle-callback-err
    if (!err && stats.isFile()) return callback()
    const dir = path__default['default'].dirname(file);
    gracefulFs.stat(dir, (err, stats) => {
      if (err) {
        // if the directory doesn't exist, make it
        if (err.code === 'ENOENT') {
          return mkdirs.mkdirs(dir, err => {
            if (err) return callback(err)
            makeFile();
          })
        }
        return callback(err)
      }

      if (stats.isDirectory()) makeFile();
      else {
        // parent is not a directory
        // This is just to cause an internal ENOTDIR error to be thrown
        gracefulFs.readdir(dir, err => {
          if (err) return callback(err)
        });
      }
    });
  });
}

function createFileSync (file) {
  let stats;
  try {
    stats = gracefulFs.statSync(file);
  } catch {}
  if (stats && stats.isFile()) return

  const dir = path__default['default'].dirname(file);
  try {
    if (!gracefulFs.statSync(dir).isDirectory()) {
      // parent is not a directory
      // This is just to cause an internal ENOTDIR error to be thrown
      gracefulFs.readdirSync(dir);
    }
  } catch (err) {
    // If the stat call above failed because the directory doesn't exist, create it
    if (err && err.code === 'ENOENT') mkdirs.mkdirsSync(dir);
    else throw err
  }

  gracefulFs.writeFileSync(file, '');
}

var file = {
  createFile: u$5(createFile),
  createFileSync
};

const u$6 = universalify.fromCallback;



const pathExists$2 = pathExists_1.pathExists;

function createLink (srcpath, dstpath, callback) {
  function makeLink (srcpath, dstpath) {
    gracefulFs.link(srcpath, dstpath, err => {
      if (err) return callback(err)
      callback(null);
    });
  }

  pathExists$2(dstpath, (err, destinationExists) => {
    if (err) return callback(err)
    if (destinationExists) return callback(null)
    gracefulFs.lstat(srcpath, (err) => {
      if (err) {
        err.message = err.message.replace('lstat', 'ensureLink');
        return callback(err)
      }

      const dir = path__default['default'].dirname(dstpath);
      pathExists$2(dir, (err, dirExists) => {
        if (err) return callback(err)
        if (dirExists) return makeLink(srcpath, dstpath)
        mkdirs.mkdirs(dir, err => {
          if (err) return callback(err)
          makeLink(srcpath, dstpath);
        });
      });
    });
  });
}

function createLinkSync (srcpath, dstpath) {
  const destinationExists = gracefulFs.existsSync(dstpath);
  if (destinationExists) return undefined

  try {
    gracefulFs.lstatSync(srcpath);
  } catch (err) {
    err.message = err.message.replace('lstat', 'ensureLink');
    throw err
  }

  const dir = path__default['default'].dirname(dstpath);
  const dirExists = gracefulFs.existsSync(dir);
  if (dirExists) return gracefulFs.linkSync(srcpath, dstpath)
  mkdirs.mkdirsSync(dir);

  return gracefulFs.linkSync(srcpath, dstpath)
}

var link = {
  createLink: u$6(createLink),
  createLinkSync
};

const pathExists$3 = pathExists_1.pathExists;

/**
 * Function that returns two types of paths, one relative to symlink, and one
 * relative to the current working directory. Checks if path is absolute or
 * relative. If the path is relative, this function checks if the path is
 * relative to symlink or relative to current working directory. This is an
 * initiative to find a smarter `srcpath` to supply when building symlinks.
 * This allows you to determine which path to use out of one of three possible
 * types of source paths. The first is an absolute path. This is detected by
 * `path.isAbsolute()`. When an absolute path is provided, it is checked to
 * see if it exists. If it does it's used, if not an error is returned
 * (callback)/ thrown (sync). The other two options for `srcpath` are a
 * relative url. By default Node's `fs.symlink` works by creating a symlink
 * using `dstpath` and expects the `srcpath` to be relative to the newly
 * created symlink. If you provide a `srcpath` that does not exist on the file
 * system it results in a broken symlink. To minimize this, the function
 * checks to see if the 'relative to symlink' source file exists, and if it
 * does it will use it. If it does not, it checks if there's a file that
 * exists that is relative to the current working directory, if does its used.
 * This preserves the expectations of the original fs.symlink spec and adds
 * the ability to pass in `relative to current working direcotry` paths.
 */

function symlinkPaths (srcpath, dstpath, callback) {
  if (path__default['default'].isAbsolute(srcpath)) {
    return gracefulFs.lstat(srcpath, (err) => {
      if (err) {
        err.message = err.message.replace('lstat', 'ensureSymlink');
        return callback(err)
      }
      return callback(null, {
        toCwd: srcpath,
        toDst: srcpath
      })
    })
  } else {
    const dstdir = path__default['default'].dirname(dstpath);
    const relativeToDst = path__default['default'].join(dstdir, srcpath);
    return pathExists$3(relativeToDst, (err, exists) => {
      if (err) return callback(err)
      if (exists) {
        return callback(null, {
          toCwd: relativeToDst,
          toDst: srcpath
        })
      } else {
        return gracefulFs.lstat(srcpath, (err) => {
          if (err) {
            err.message = err.message.replace('lstat', 'ensureSymlink');
            return callback(err)
          }
          return callback(null, {
            toCwd: srcpath,
            toDst: path__default['default'].relative(dstdir, srcpath)
          })
        })
      }
    })
  }
}

function symlinkPathsSync (srcpath, dstpath) {
  let exists;
  if (path__default['default'].isAbsolute(srcpath)) {
    exists = gracefulFs.existsSync(srcpath);
    if (!exists) throw new Error('absolute srcpath does not exist')
    return {
      toCwd: srcpath,
      toDst: srcpath
    }
  } else {
    const dstdir = path__default['default'].dirname(dstpath);
    const relativeToDst = path__default['default'].join(dstdir, srcpath);
    exists = gracefulFs.existsSync(relativeToDst);
    if (exists) {
      return {
        toCwd: relativeToDst,
        toDst: srcpath
      }
    } else {
      exists = gracefulFs.existsSync(srcpath);
      if (!exists) throw new Error('relative srcpath does not exist')
      return {
        toCwd: srcpath,
        toDst: path__default['default'].relative(dstdir, srcpath)
      }
    }
  }
}

var symlinkPaths_1 = {
  symlinkPaths,
  symlinkPathsSync
};

function symlinkType (srcpath, type, callback) {
  callback = (typeof type === 'function') ? type : callback;
  type = (typeof type === 'function') ? false : type;
  if (type) return callback(null, type)
  gracefulFs.lstat(srcpath, (err, stats) => {
    if (err) return callback(null, 'file')
    type = (stats && stats.isDirectory()) ? 'dir' : 'file';
    callback(null, type);
  });
}

function symlinkTypeSync (srcpath, type) {
  let stats;

  if (type) return type
  try {
    stats = gracefulFs.lstatSync(srcpath);
  } catch {
    return 'file'
  }
  return (stats && stats.isDirectory()) ? 'dir' : 'file'
}

var symlinkType_1 = {
  symlinkType,
  symlinkTypeSync
};

const u$7 = universalify.fromCallback;



const mkdirs$2 = mkdirs.mkdirs;
const mkdirsSync$1 = mkdirs.mkdirsSync;


const symlinkPaths$1 = symlinkPaths_1.symlinkPaths;
const symlinkPathsSync$1 = symlinkPaths_1.symlinkPathsSync;


const symlinkType$1 = symlinkType_1.symlinkType;
const symlinkTypeSync$1 = symlinkType_1.symlinkTypeSync;

const pathExists$4 = pathExists_1.pathExists;

function createSymlink (srcpath, dstpath, type, callback) {
  callback = (typeof type === 'function') ? type : callback;
  type = (typeof type === 'function') ? false : type;

  pathExists$4(dstpath, (err, destinationExists) => {
    if (err) return callback(err)
    if (destinationExists) return callback(null)
    symlinkPaths$1(srcpath, dstpath, (err, relative) => {
      if (err) return callback(err)
      srcpath = relative.toDst;
      symlinkType$1(relative.toCwd, type, (err, type) => {
        if (err) return callback(err)
        const dir = path__default['default'].dirname(dstpath);
        pathExists$4(dir, (err, dirExists) => {
          if (err) return callback(err)
          if (dirExists) return gracefulFs.symlink(srcpath, dstpath, type, callback)
          mkdirs$2(dir, err => {
            if (err) return callback(err)
            gracefulFs.symlink(srcpath, dstpath, type, callback);
          });
        });
      });
    });
  });
}

function createSymlinkSync (srcpath, dstpath, type) {
  const destinationExists = gracefulFs.existsSync(dstpath);
  if (destinationExists) return undefined

  const relative = symlinkPathsSync$1(srcpath, dstpath);
  srcpath = relative.toDst;
  type = symlinkTypeSync$1(relative.toCwd, type);
  const dir = path__default['default'].dirname(dstpath);
  const exists = gracefulFs.existsSync(dir);
  if (exists) return gracefulFs.symlinkSync(srcpath, dstpath, type)
  mkdirsSync$1(dir);
  return gracefulFs.symlinkSync(srcpath, dstpath, type)
}

var symlink = {
  createSymlink: u$7(createSymlink),
  createSymlinkSync
};

var ensure = {
  // file
  createFile: file.createFile,
  createFileSync: file.createFileSync,
  ensureFile: file.createFile,
  ensureFileSync: file.createFileSync,
  // link
  createLink: link.createLink,
  createLinkSync: link.createLinkSync,
  ensureLink: link.createLink,
  ensureLinkSync: link.createLinkSync,
  // symlink
  createSymlink: symlink.createSymlink,
  createSymlinkSync: symlink.createSymlinkSync,
  ensureSymlink: symlink.createSymlink,
  ensureSymlinkSync: symlink.createSymlinkSync
};

function stringify (obj, options = {}) {
  const EOL = options.EOL || '\n';

  const str = JSON.stringify(obj, options ? options.replacer : null, options.spaces);

  return str.replace(/\n/g, EOL) + EOL
}

function stripBom (content) {
  // we do this because JSON.parse would convert it to a utf8 string if encoding wasn't specified
  if (Buffer.isBuffer(content)) content = content.toString('utf8');
  return content.replace(/^\uFEFF/, '')
}

var utils = { stringify, stripBom };

let _fs;
try {
  _fs = gracefulFs;
} catch (_) {
  _fs = fs__default['default'];
}

const { stringify: stringify$1, stripBom: stripBom$1 } = utils;

async function _readFile (file, options = {}) {
  if (typeof options === 'string') {
    options = { encoding: options };
  }

  const fs = options.fs || _fs;

  const shouldThrow = 'throws' in options ? options.throws : true;

  let data = await universalify.fromCallback(fs.readFile)(file, options);

  data = stripBom$1(data);

  let obj;
  try {
    obj = JSON.parse(data, options ? options.reviver : null);
  } catch (err) {
    if (shouldThrow) {
      err.message = `${file}: ${err.message}`;
      throw err
    } else {
      return null
    }
  }

  return obj
}

const readFile = universalify.fromPromise(_readFile);

function readFileSync (file, options = {}) {
  if (typeof options === 'string') {
    options = { encoding: options };
  }

  const fs = options.fs || _fs;

  const shouldThrow = 'throws' in options ? options.throws : true;

  try {
    let content = fs.readFileSync(file, options);
    content = stripBom$1(content);
    return JSON.parse(content, options.reviver)
  } catch (err) {
    if (shouldThrow) {
      err.message = `${file}: ${err.message}`;
      throw err
    } else {
      return null
    }
  }
}

async function _writeFile (file, obj, options = {}) {
  const fs = options.fs || _fs;

  const str = stringify$1(obj, options);

  await universalify.fromCallback(fs.writeFile)(file, str, options);
}

const writeFile = universalify.fromPromise(_writeFile);

function writeFileSync (file, obj, options = {}) {
  const fs = options.fs || _fs;

  const str = stringify$1(obj, options);
  // not sure if fs.writeFileSync returns anything, but just in case
  return fs.writeFileSync(file, str, options)
}

const jsonfile = {
  readFile,
  readFileSync,
  writeFile,
  writeFileSync
};

var jsonfile_1 = jsonfile;

var jsonfile$1 = {
  // jsonfile exports
  readJson: jsonfile_1.readFile,
  readJsonSync: jsonfile_1.readFileSync,
  writeJson: jsonfile_1.writeFile,
  writeJsonSync: jsonfile_1.writeFileSync
};

const u$8 = universalify.fromCallback;



const pathExists$5 = pathExists_1.pathExists;

function outputFile (file, data, encoding, callback) {
  if (typeof encoding === 'function') {
    callback = encoding;
    encoding = 'utf8';
  }

  const dir = path__default['default'].dirname(file);
  pathExists$5(dir, (err, itDoes) => {
    if (err) return callback(err)
    if (itDoes) return gracefulFs.writeFile(file, data, encoding, callback)

    mkdirs.mkdirs(dir, err => {
      if (err) return callback(err)

      gracefulFs.writeFile(file, data, encoding, callback);
    });
  });
}

function outputFileSync (file, ...args) {
  const dir = path__default['default'].dirname(file);
  if (gracefulFs.existsSync(dir)) {
    return gracefulFs.writeFileSync(file, ...args)
  }
  mkdirs.mkdirsSync(dir);
  gracefulFs.writeFileSync(file, ...args);
}

var output = {
  outputFile: u$8(outputFile),
  outputFileSync
};

const { stringify: stringify$2 } = utils;
const { outputFile: outputFile$1 } = output;

async function outputJson (file, data, options = {}) {
  const str = stringify$2(data, options);

  await outputFile$1(file, str, options);
}

var outputJson_1 = outputJson;

const { stringify: stringify$3 } = utils;
const { outputFileSync: outputFileSync$1 } = output;

function outputJsonSync (file, data, options) {
  const str = stringify$3(data, options);

  outputFileSync$1(file, str, options);
}

var outputJsonSync_1 = outputJsonSync;

const u$9 = universalify.fromPromise;


jsonfile$1.outputJson = u$9(outputJson_1);
jsonfile$1.outputJsonSync = outputJsonSync_1;
// aliases
jsonfile$1.outputJSON = jsonfile$1.outputJson;
jsonfile$1.outputJSONSync = jsonfile$1.outputJsonSync;
jsonfile$1.writeJSON = jsonfile$1.writeJson;
jsonfile$1.writeJSONSync = jsonfile$1.writeJsonSync;
jsonfile$1.readJSON = jsonfile$1.readJson;
jsonfile$1.readJSONSync = jsonfile$1.readJsonSync;

var json = jsonfile$1;

const copySync$2 = copySync$1.copySync;
const removeSync = remove.removeSync;
const mkdirpSync = mkdirs.mkdirpSync;


function moveSync (src, dest, opts) {
  opts = opts || {};
  const overwrite = opts.overwrite || opts.clobber || false;

  const { srcStat } = stat_1.checkPathsSync(src, dest, 'move');
  stat_1.checkParentPathsSync(src, srcStat, dest, 'move');
  mkdirpSync(path__default['default'].dirname(dest));
  return doRename(src, dest, overwrite)
}

function doRename (src, dest, overwrite) {
  if (overwrite) {
    removeSync(dest);
    return rename(src, dest, overwrite)
  }
  if (gracefulFs.existsSync(dest)) throw new Error('dest already exists.')
  return rename(src, dest, overwrite)
}

function rename (src, dest, overwrite) {
  try {
    gracefulFs.renameSync(src, dest);
  } catch (err) {
    if (err.code !== 'EXDEV') throw err
    return moveAcrossDevice(src, dest, overwrite)
  }
}

function moveAcrossDevice (src, dest, overwrite) {
  const opts = {
    overwrite,
    errorOnExist: true
  };
  copySync$2(src, dest, opts);
  return removeSync(src)
}

var moveSync_1 = moveSync;

var moveSync$1 = {
  moveSync: moveSync_1
};

const copy$2 = copy$1.copy;
const remove$1 = remove.remove;
const mkdirp = mkdirs.mkdirp;
const pathExists$6 = pathExists_1.pathExists;


function move (src, dest, opts, cb) {
  if (typeof opts === 'function') {
    cb = opts;
    opts = {};
  }

  const overwrite = opts.overwrite || opts.clobber || false;

  stat_1.checkPaths(src, dest, 'move', (err, stats) => {
    if (err) return cb(err)
    const { srcStat } = stats;
    stat_1.checkParentPaths(src, srcStat, dest, 'move', err => {
      if (err) return cb(err)
      mkdirp(path__default['default'].dirname(dest), err => {
        if (err) return cb(err)
        return doRename$1(src, dest, overwrite, cb)
      });
    });
  });
}

function doRename$1 (src, dest, overwrite, cb) {
  if (overwrite) {
    return remove$1(dest, err => {
      if (err) return cb(err)
      return rename$1(src, dest, overwrite, cb)
    })
  }
  pathExists$6(dest, (err, destExists) => {
    if (err) return cb(err)
    if (destExists) return cb(new Error('dest already exists.'))
    return rename$1(src, dest, overwrite, cb)
  });
}

function rename$1 (src, dest, overwrite, cb) {
  gracefulFs.rename(src, dest, err => {
    if (!err) return cb()
    if (err.code !== 'EXDEV') return cb(err)
    return moveAcrossDevice$1(src, dest, overwrite, cb)
  });
}

function moveAcrossDevice$1 (src, dest, overwrite, cb) {
  const opts = {
    overwrite,
    errorOnExist: true
  };
  copy$2(src, dest, opts, err => {
    if (err) return cb(err)
    return remove$1(src, cb)
  });
}

var move_1 = move;

const u$a = universalify.fromCallback;
var move$1 = {
  move: u$a(move_1)
};

var lib = createCommonjsModule(function (module) {

module.exports = {
  // Export promiseified graceful-fs:
  ...fs_1,
  // Export extra methods:
  ...copySync$1,
  ...copy$1,
  ...empty,
  ...ensure,
  ...json,
  ...mkdirs,
  ...moveSync$1,
  ...move$1,
  ...output,
  ...pathExists_1,
  ...remove
};

// Export fs.promises as a getter property so that we don't trigger
// ExperimentalWarning before fs.promises is actually accessed.

if (Object.getOwnPropertyDescriptor(fs__default['default'], 'promises')) {
  Object.defineProperty(module.exports, 'promises', {
    get () { return fs__default['default'].promises }
  });
}
});

var ansiWrap = function(a, b, msg) {
  return '\u001b['+ a + 'm' + msg + '\u001b[' + b + 'm';
};

var ansiGray = function gray(message) {
  return ansiWrap(90, 39, message);
};

/*!
 * time-stamp <https://github.com/jonschlinkert/time-stamp>
 *
 * Copyright (c) 2015-2017, Jon Schlinkert.
 * Released under the MIT License.
 */

/**
 * Parse the given pattern and return a formatted
 * timestamp.
 *
 * @param  {String} `pattern` Date pattern.
 * @param  {Date} `date` Date object.
 * @return {String}
 */

var timeStamp = function(pattern, date) {
  if (typeof pattern !== 'string') {
    date = pattern;
    pattern = 'YYYY:MM:DD';
  }

  if (!date) date = new Date();

  function timestamp() {
    var regex = /(?=(YYYY|YY|MM|DD|HH|mm|ss|ms))\1([:\/]*)/;
    var match = regex.exec(pattern);

    if (match) {
      var increment = method(match[1]);
      var val = '00' + String(date[increment[0]]() + (increment[2] || 0));
      var res = val.slice(-increment[1]) + (match[2] || '');
      pattern = pattern.replace(match[0], res);
      timestamp();
    }
  }

  timestamp();
  return pattern;
};

function method(key) {
  return ({
    YYYY: ['getFullYear', 4],
    YY: ['getFullYear', 2],
    // getMonth is zero-based, thus the extra increment field
    MM: ['getMonth', 2, 1],
    DD: ['getDate', 2],
    HH: ['getHours', 2],
    mm: ['getMinutes', 2],
    ss: ['getSeconds', 2],
    ms: ['getMilliseconds', 3]
  })[key];
}

// call it on itself so we can test the export val for basic stuff
var colorSupport_1 = colorSupport({ alwaysReturn: true }, colorSupport);

function hasNone (obj, options) {
  obj.level = 0;
  obj.hasBasic = false;
  obj.has256 = false;
  obj.has16m = false;
  if (!options.alwaysReturn) {
    return false
  }
  return obj
}

function hasBasic (obj) {
  obj.hasBasic = true;
  obj.has256 = false;
  obj.has16m = false;
  obj.level = 1;
  return obj
}

function has256 (obj) {
  obj.hasBasic = true;
  obj.has256 = true;
  obj.has16m = false;
  obj.level = 2;
  return obj
}

function has16m (obj) {
  obj.hasBasic = true;
  obj.has256 = true;
  obj.has16m = true;
  obj.level = 3;
  return obj
}

function colorSupport (options, obj) {
  options = options || {};

  obj = obj || {};

  // if just requesting a specific level, then return that.
  if (typeof options.level === 'number') {
    switch (options.level) {
      case 0:
        return hasNone(obj, options)
      case 1:
        return hasBasic(obj)
      case 2:
        return has256(obj)
      case 3:
        return has16m(obj)
    }
  }

  obj.level = 0;
  obj.hasBasic = false;
  obj.has256 = false;
  obj.has16m = false;

  if (typeof process === 'undefined' ||
      !process ||
      !process.stdout ||
      !process.env ||
      !process.platform) {
    return hasNone(obj, options)
  }

  var env = options.env || process.env;
  var stream = options.stream || process.stdout;
  var term = options.term || env.TERM || '';
  var platform = options.platform || process.platform;

  if (!options.ignoreTTY && !stream.isTTY) {
    return hasNone(obj, options)
  }

  if (!options.ignoreDumb && term === 'dumb' && !env.COLORTERM) {
    return hasNone(obj, options)
  }

  if (platform === 'win32') {
    return hasBasic(obj)
  }

  if (env.TMUX) {
    return has256(obj)
  }

  if (!options.ignoreCI && (env.CI || env.TEAMCITY_VERSION)) {
    if (env.TRAVIS) {
      return has256(obj)
    } else {
      return hasNone(obj, options)
    }
  }

  // TODO: add more term programs
  switch (env.TERM_PROGRAM) {
    case 'iTerm.app':
      var ver = env.TERM_PROGRAM_VERSION || '0.';
      if (/^[0-2]\./.test(ver)) {
        return has256(obj)
      } else {
        return has16m(obj)
      }

    case 'HyperTerm':
    case 'Hyper':
      return has16m(obj)

    case 'MacTerm':
      return has16m(obj)

    case 'Apple_Terminal':
      return has256(obj)
  }

  if (/^xterm-256/.test(term)) {
    return has256(obj)
  }

  if (/^screen|^xterm|^vt100|color|ansi|cygwin|linux/i.test(term)) {
    return hasBasic(obj)
  }

  if (env.COLORTERM) {
    return hasBasic(obj)
  }

  return hasNone(obj, options)
}

function parseNodeVersion(version) {
  var match = version.match(/^v(\d{1,2})\.(\d{1,2})\.(\d{1,2})(?:-([0-9A-Za-z-.]+))?(?:\+([0-9A-Za-z-.]+))?$/); // eslint-disable-line max-len
  if (!match) {
    throw new Error('Unable to parse: ' + version);
  }

  var res = {
    major: parseInt(match[1], 10),
    minor: parseInt(match[2], 10),
    patch: parseInt(match[3], 10),
    pre: match[4] || '',
    build: match[5] || '',
  };

  return res;
}

var parseNodeVersion_1 = parseNodeVersion;

var Console = require$$0__default['default'].Console;



var nodeVersion = parseNodeVersion_1(process.version);

var colorDetectionOptions = {
  // If on Windows, ignore the isTTY check
  // This is due to AppVeyor (and thus probably common Windows platforms?) failing the check
  // TODO: If this is too broad, we can reduce it to an APPVEYOR env check
  ignoreTTY: (process.platform === 'win32'),
};

// Needed to add this because node 10 decided to start coloring log output randomly
var console$1;
if (nodeVersion.major >= 10) {
  // Node 10 also changed the way this is constructed
  console$1 = new Console({
    stdout: process.stdout,
    stderr: process.stderr,
    colorMode: false,
  });
} else {
  console$1 = new Console(process.stdout, process.stderr);
}

function hasFlag(flag) {
  return (process.argv.indexOf('--' + flag) !== -1);
}

function addColor(str) {
  if (hasFlag('no-color')) {
    return str;
  }

  if (hasFlag('color')) {
    return ansiGray(str);
  }

  if (colorSupport_1(colorDetectionOptions)) {
    return ansiGray(str);
  }

  return str;
}

function getTimestamp() {
  return '[' + addColor(timeStamp('HH:mm:ss')) + ']';
}

function info() {
  var time = getTimestamp();
  process.stdout.write(time + ' ');
  console$1.info.apply(console$1, arguments);
  return this;
}

function warn() {
  var time = getTimestamp();
  process.stderr.write(time + ' ');
  console$1.warn.apply(console$1, arguments);
  return this;
}

function error() {
  var time = getTimestamp();
  process.stderr.write(time + ' ');
  console$1.error.apply(console$1, arguments);
  return this;
}
var info_1 = info;
var warn_1 = warn;
var error_1 = error;

var command = createCommonjsModule(function (module, exports) {
var __importStar = (commonjsGlobal && commonjsGlobal.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const os = __importStar(require$$0__default$1['default']);
/**
 * Commands
 *
 * Command Format:
 *   ::name key=value,key=value::message
 *
 * Examples:
 *   ::warning::This is the message
 *   ::set-env name=MY_VAR::some value
 */
function issueCommand(command, properties, message) {
    const cmd = new Command(command, properties, message);
    process.stdout.write(cmd.toString() + os.EOL);
}
exports.issueCommand = issueCommand;
function issue(name, message = '') {
    issueCommand(name, {}, message);
}
exports.issue = issue;
const CMD_STRING = '::';
class Command {
    constructor(command, properties, message) {
        if (!command) {
            command = 'missing.command';
        }
        this.command = command;
        this.properties = properties;
        this.message = message;
    }
    toString() {
        let cmdStr = CMD_STRING + this.command;
        if (this.properties && Object.keys(this.properties).length > 0) {
            cmdStr += ' ';
            let first = true;
            for (const key in this.properties) {
                if (this.properties.hasOwnProperty(key)) {
                    const val = this.properties[key];
                    if (val) {
                        if (first) {
                            first = false;
                        }
                        else {
                            cmdStr += ',';
                        }
                        cmdStr += `${key}=${escapeProperty(val)}`;
                    }
                }
            }
        }
        cmdStr += `${CMD_STRING}${escapeData(this.message)}`;
        return cmdStr;
    }
}
/**
 * Sanitizes an input into a string so it can be passed into issueCommand safely
 * @param input input to sanitize into a string
 */
function toCommandValue(input) {
    if (input === null || input === undefined) {
        return '';
    }
    else if (typeof input === 'string' || input instanceof String) {
        return input;
    }
    return JSON.stringify(input);
}
exports.toCommandValue = toCommandValue;
function escapeData(s) {
    return toCommandValue(s)
        .replace(/%/g, '%25')
        .replace(/\r/g, '%0D')
        .replace(/\n/g, '%0A');
}
function escapeProperty(s) {
    return toCommandValue(s)
        .replace(/%/g, '%25')
        .replace(/\r/g, '%0D')
        .replace(/\n/g, '%0A')
        .replace(/:/g, '%3A')
        .replace(/,/g, '%2C');
}

});

var core = createCommonjsModule(function (module, exports) {
var __awaiter = (commonjsGlobal && commonjsGlobal.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importStar = (commonjsGlobal && commonjsGlobal.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });

const os = __importStar(require$$0__default$1['default']);
const path = __importStar(path__default['default']);
/**
 * The code to exit an action
 */
var ExitCode;
(function (ExitCode) {
    /**
     * A code indicating that the action was successful
     */
    ExitCode[ExitCode["Success"] = 0] = "Success";
    /**
     * A code indicating that the action was a failure
     */
    ExitCode[ExitCode["Failure"] = 1] = "Failure";
})(ExitCode = exports.ExitCode || (exports.ExitCode = {}));
//-----------------------------------------------------------------------
// Variables
//-----------------------------------------------------------------------
/**
 * Sets env variable for this action and future actions in the job
 * @param name the name of the variable to set
 * @param val the value of the variable. Non-string values will be converted to a string via JSON.stringify
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function exportVariable(name, val) {
    const convertedVal = command.toCommandValue(val);
    process.env[name] = convertedVal;
    command.issueCommand('set-env', { name }, convertedVal);
}
exports.exportVariable = exportVariable;
/**
 * Registers a secret which will get masked from logs
 * @param secret value of the secret
 */
function setSecret(secret) {
    command.issueCommand('add-mask', {}, secret);
}
exports.setSecret = setSecret;
/**
 * Prepends inputPath to the PATH (for this action and future actions)
 * @param inputPath
 */
function addPath(inputPath) {
    command.issueCommand('add-path', {}, inputPath);
    process.env['PATH'] = `${inputPath}${path.delimiter}${process.env['PATH']}`;
}
exports.addPath = addPath;
/**
 * Gets the value of an input.  The value is also trimmed.
 *
 * @param     name     name of the input to get
 * @param     options  optional. See InputOptions.
 * @returns   string
 */
function getInput(name, options) {
    const val = process.env[`INPUT_${name.replace(/ /g, '_').toUpperCase()}`] || '';
    if (options && options.required && !val) {
        throw new Error(`Input required and not supplied: ${name}`);
    }
    return val.trim();
}
exports.getInput = getInput;
/**
 * Sets the value of an output.
 *
 * @param     name     name of the output to set
 * @param     value    value to store. Non-string values will be converted to a string via JSON.stringify
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function setOutput(name, value) {
    command.issueCommand('set-output', { name }, value);
}
exports.setOutput = setOutput;
/**
 * Enables or disables the echoing of commands into stdout for the rest of the step.
 * Echoing is disabled by default if ACTIONS_STEP_DEBUG is not set.
 *
 */
function setCommandEcho(enabled) {
    command.issue('echo', enabled ? 'on' : 'off');
}
exports.setCommandEcho = setCommandEcho;
//-----------------------------------------------------------------------
// Results
//-----------------------------------------------------------------------
/**
 * Sets the action status to failed.
 * When the action exits it will be with an exit code of 1
 * @param message add error issue message
 */
function setFailed(message) {
    process.exitCode = ExitCode.Failure;
    error(message);
}
exports.setFailed = setFailed;
//-----------------------------------------------------------------------
// Logging Commands
//-----------------------------------------------------------------------
/**
 * Gets whether Actions Step Debug is on or not
 */
function isDebug() {
    return process.env['RUNNER_DEBUG'] === '1';
}
exports.isDebug = isDebug;
/**
 * Writes debug message to user log
 * @param message debug message
 */
function debug(message) {
    command.issueCommand('debug', {}, message);
}
exports.debug = debug;
/**
 * Adds an error issue
 * @param message error issue message. Errors will be converted to string via toString()
 */
function error(message) {
    command.issue('error', message instanceof Error ? message.toString() : message);
}
exports.error = error;
/**
 * Adds an warning issue
 * @param message warning issue message. Errors will be converted to string via toString()
 */
function warning(message) {
    command.issue('warning', message instanceof Error ? message.toString() : message);
}
exports.warning = warning;
/**
 * Writes info to log with console.log.
 * @param message info message
 */
function info(message) {
    process.stdout.write(message + os.EOL);
}
exports.info = info;
/**
 * Begin an output group.
 *
 * Output until the next `groupEnd` will be foldable in this group
 *
 * @param name The name of the output group
 */
function startGroup(name) {
    command.issue('group', name);
}
exports.startGroup = startGroup;
/**
 * End an output group.
 */
function endGroup() {
    command.issue('endgroup');
}
exports.endGroup = endGroup;
/**
 * Wrap an asynchronous function call in a group.
 *
 * Returns the same type as the function itself.
 *
 * @param name The name of the group
 * @param fn The function to wrap in the group
 */
function group(name, fn) {
    return __awaiter(this, void 0, void 0, function* () {
        startGroup(name);
        let result;
        try {
            result = yield fn();
        }
        finally {
            endGroup();
        }
        return result;
    });
}
exports.group = group;
//-----------------------------------------------------------------------
// Wrapper action state
//-----------------------------------------------------------------------
/**
 * Saves state for current action, the state can only be retrieved by this action's post job execution.
 *
 * @param     name     name of the state to store
 * @param     value    value to store. Non-string values will be converted to a string via JSON.stringify
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function saveState(name, value) {
    command.issueCommand('save-state', { name }, value);
}
exports.saveState = saveState;
/**
 * Gets the value of an state set by this action's main execution.
 *
 * @param     name     name of the state to get
 * @returns   string
 */
function getState(name) {
    return process.env[`STATE_${name}`] || '';
}
exports.getState = getState;

});

var windows = isexe;
isexe.sync = sync;



function checkPathExt (path, options) {
  var pathext = options.pathExt !== undefined ?
    options.pathExt : process.env.PATHEXT;

  if (!pathext) {
    return true
  }

  pathext = pathext.split(';');
  if (pathext.indexOf('') !== -1) {
    return true
  }
  for (var i = 0; i < pathext.length; i++) {
    var p = pathext[i].toLowerCase();
    if (p && path.substr(-p.length).toLowerCase() === p) {
      return true
    }
  }
  return false
}

function checkStat (stat, path, options) {
  if (!stat.isSymbolicLink() && !stat.isFile()) {
    return false
  }
  return checkPathExt(path, options)
}

function isexe (path, options, cb) {
  fs__default['default'].stat(path, function (er, stat) {
    cb(er, er ? false : checkStat(stat, path, options));
  });
}

function sync (path, options) {
  return checkStat(fs__default['default'].statSync(path), path, options)
}

var mode = isexe$1;
isexe$1.sync = sync$1;



function isexe$1 (path, options, cb) {
  fs__default['default'].stat(path, function (er, stat) {
    cb(er, er ? false : checkStat$1(stat, options));
  });
}

function sync$1 (path, options) {
  return checkStat$1(fs__default['default'].statSync(path), options)
}

function checkStat$1 (stat, options) {
  return stat.isFile() && checkMode(stat, options)
}

function checkMode (stat, options) {
  var mod = stat.mode;
  var uid = stat.uid;
  var gid = stat.gid;

  var myUid = options.uid !== undefined ?
    options.uid : process.getuid && process.getuid();
  var myGid = options.gid !== undefined ?
    options.gid : process.getgid && process.getgid();

  var u = parseInt('100', 8);
  var g = parseInt('010', 8);
  var o = parseInt('001', 8);
  var ug = u | g;

  var ret = (mod & o) ||
    (mod & g) && gid === myGid ||
    (mod & u) && uid === myUid ||
    (mod & ug) && myUid === 0;

  return ret
}

var core$1;
if (process.platform === 'win32' || commonjsGlobal.TESTING_WINDOWS) {
  core$1 = windows;
} else {
  core$1 = mode;
}

var isexe_1 = isexe$2;
isexe$2.sync = sync$2;

function isexe$2 (path, options, cb) {
  if (typeof options === 'function') {
    cb = options;
    options = {};
  }

  if (!cb) {
    if (typeof Promise !== 'function') {
      throw new TypeError('callback not provided')
    }

    return new Promise(function (resolve, reject) {
      isexe$2(path, options || {}, function (er, is) {
        if (er) {
          reject(er);
        } else {
          resolve(is);
        }
      });
    })
  }

  core$1(path, options || {}, function (er, is) {
    // ignore EACCES because that just means we aren't allowed to run it
    if (er) {
      if (er.code === 'EACCES' || options && options.ignoreErrors) {
        er = null;
        is = false;
      }
    }
    cb(er, is);
  });
}

function sync$2 (path, options) {
  // my kingdom for a filtered catch
  try {
    return core$1.sync(path, options || {})
  } catch (er) {
    if (options && options.ignoreErrors || er.code === 'EACCES') {
      return false
    } else {
      throw er
    }
  }
}

const isWindows$1 = process.platform === 'win32' ||
    process.env.OSTYPE === 'cygwin' ||
    process.env.OSTYPE === 'msys';


const COLON = isWindows$1 ? ';' : ':';


const getNotFoundError = (cmd) =>
  Object.assign(new Error(`not found: ${cmd}`), { code: 'ENOENT' });

const getPathInfo = (cmd, opt) => {
  const colon = opt.colon || COLON;

  // If it has a slash, then we don't bother searching the pathenv.
  // just check the file itself, and that's it.
  const pathEnv = cmd.match(/\//) || isWindows$1 && cmd.match(/\\/) ? ['']
    : (
      [
        // windows always checks the cwd first
        ...(isWindows$1 ? [process.cwd()] : []),
        ...(opt.path || process.env.PATH ||
          /* istanbul ignore next: very unusual */ '').split(colon),
      ]
    );
  const pathExtExe = isWindows$1
    ? opt.pathExt || process.env.PATHEXT || '.EXE;.CMD;.BAT;.COM'
    : '';
  const pathExt = isWindows$1 ? pathExtExe.split(colon) : [''];

  if (isWindows$1) {
    if (cmd.indexOf('.') !== -1 && pathExt[0] !== '')
      pathExt.unshift('');
  }

  return {
    pathEnv,
    pathExt,
    pathExtExe,
  }
};

const which = (cmd, opt, cb) => {
  if (typeof opt === 'function') {
    cb = opt;
    opt = {};
  }
  if (!opt)
    opt = {};

  const { pathEnv, pathExt, pathExtExe } = getPathInfo(cmd, opt);
  const found = [];

  const step = i => new Promise((resolve, reject) => {
    if (i === pathEnv.length)
      return opt.all && found.length ? resolve(found)
        : reject(getNotFoundError(cmd))

    const ppRaw = pathEnv[i];
    const pathPart = /^".*"$/.test(ppRaw) ? ppRaw.slice(1, -1) : ppRaw;

    const pCmd = path__default['default'].join(pathPart, cmd);
    const p = !pathPart && /^\.[\\\/]/.test(cmd) ? cmd.slice(0, 2) + pCmd
      : pCmd;

    resolve(subStep(p, i, 0));
  });

  const subStep = (p, i, ii) => new Promise((resolve, reject) => {
    if (ii === pathExt.length)
      return resolve(step(i + 1))
    const ext = pathExt[ii];
    isexe_1(p + ext, { pathExt: pathExtExe }, (er, is) => {
      if (!er && is) {
        if (opt.all)
          found.push(p + ext);
        else
          return resolve(p + ext)
      }
      return resolve(subStep(p, i, ii + 1))
    });
  });

  return cb ? step(0).then(res => cb(null, res), cb) : step(0)
};

const whichSync = (cmd, opt) => {
  opt = opt || {};

  const { pathEnv, pathExt, pathExtExe } = getPathInfo(cmd, opt);
  const found = [];

  for (let i = 0; i < pathEnv.length; i ++) {
    const ppRaw = pathEnv[i];
    const pathPart = /^".*"$/.test(ppRaw) ? ppRaw.slice(1, -1) : ppRaw;

    const pCmd = path__default['default'].join(pathPart, cmd);
    const p = !pathPart && /^\.[\\\/]/.test(cmd) ? cmd.slice(0, 2) + pCmd
      : pCmd;

    for (let j = 0; j < pathExt.length; j ++) {
      const cur = p + pathExt[j];
      try {
        const is = isexe_1.sync(cur, { pathExt: pathExtExe });
        if (is) {
          if (opt.all)
            found.push(cur);
          else
            return cur
        }
      } catch (ex) {}
    }
  }

  if (opt.all && found.length)
    return found

  if (opt.nothrow)
    return null

  throw getNotFoundError(cmd)
};

var which_1 = which;
which.sync = whichSync;

const pathKey = (options = {}) => {
	const environment = options.env || process.env;
	const platform = options.platform || process.platform;

	if (platform !== 'win32') {
		return 'PATH';
	}

	return Object.keys(environment).reverse().find(key => key.toUpperCase() === 'PATH') || 'Path';
};

var pathKey_1 = pathKey;
// TODO: Remove this for the next major release
var _default = pathKey;
pathKey_1.default = _default;

function resolveCommandAttempt(parsed, withoutPathExt) {
    const env = parsed.options.env || process.env;
    const cwd = process.cwd();
    const hasCustomCwd = parsed.options.cwd != null;
    // Worker threads do not have process.chdir()
    const shouldSwitchCwd = hasCustomCwd && process.chdir !== undefined && !process.chdir.disabled;

    // If a custom `cwd` was specified, we need to change the process cwd
    // because `which` will do stat calls but does not support a custom cwd
    if (shouldSwitchCwd) {
        try {
            process.chdir(parsed.options.cwd);
        } catch (err) {
            /* Empty */
        }
    }

    let resolved;

    try {
        resolved = which_1.sync(parsed.command, {
            path: env[pathKey_1({ env })],
            pathExt: withoutPathExt ? path__default['default'].delimiter : undefined,
        });
    } catch (e) {
        /* Empty */
    } finally {
        if (shouldSwitchCwd) {
            process.chdir(cwd);
        }
    }

    // If we successfully resolved, ensure that an absolute path is returned
    // Note that when a custom `cwd` was used, we need to resolve to an absolute path based on it
    if (resolved) {
        resolved = path__default['default'].resolve(hasCustomCwd ? parsed.options.cwd : '', resolved);
    }

    return resolved;
}

function resolveCommand(parsed) {
    return resolveCommandAttempt(parsed) || resolveCommandAttempt(parsed, true);
}

var resolveCommand_1 = resolveCommand;

// See http://www.robvanderwoude.com/escapechars.php
const metaCharsRegExp = /([()\][%!^"`<>&|;, *?])/g;

function escapeCommand(arg) {
    // Escape meta chars
    arg = arg.replace(metaCharsRegExp, '^$1');

    return arg;
}

function escapeArgument(arg, doubleEscapeMetaChars) {
    // Convert to string
    arg = `${arg}`;

    // Algorithm below is based on https://qntm.org/cmd

    // Sequence of backslashes followed by a double quote:
    // double up all the backslashes and escape the double quote
    arg = arg.replace(/(\\*)"/g, '$1$1\\"');

    // Sequence of backslashes followed by the end of the string
    // (which will become a double quote later):
    // double up all the backslashes
    arg = arg.replace(/(\\*)$/, '$1$1');

    // All other backslashes occur literally

    // Quote the whole thing:
    arg = `"${arg}"`;

    // Escape meta chars
    arg = arg.replace(metaCharsRegExp, '^$1');

    // Double escape meta chars if necessary
    if (doubleEscapeMetaChars) {
        arg = arg.replace(metaCharsRegExp, '^$1');
    }

    return arg;
}

var command$1 = escapeCommand;
var argument = escapeArgument;

var _escape = {
	command: command$1,
	argument: argument
};

var shebangRegex = /^#!(.*)/;

var shebangCommand = (string = '') => {
	const match = string.match(shebangRegex);

	if (!match) {
		return null;
	}

	const [path, argument] = match[0].replace(/#! ?/, '').split(' ');
	const binary = path.split('/').pop();

	if (binary === 'env') {
		return argument;
	}

	return argument ? `${binary} ${argument}` : binary;
};

function readShebang(command) {
    // Read the first 150 bytes from the file
    const size = 150;
    const buffer = Buffer.alloc(size);

    let fd;

    try {
        fd = fs__default['default'].openSync(command, 'r');
        fs__default['default'].readSync(fd, buffer, 0, size, 0);
        fs__default['default'].closeSync(fd);
    } catch (e) { /* Empty */ }

    // Attempt to extract shebang (null is returned if not a shebang)
    return shebangCommand(buffer.toString());
}

var readShebang_1 = readShebang;

const isWin = process.platform === 'win32';
const isExecutableRegExp = /\.(?:com|exe)$/i;
const isCmdShimRegExp = /node_modules[\\/].bin[\\/][^\\/]+\.cmd$/i;

function detectShebang(parsed) {
    parsed.file = resolveCommand_1(parsed);

    const shebang = parsed.file && readShebang_1(parsed.file);

    if (shebang) {
        parsed.args.unshift(parsed.file);
        parsed.command = shebang;

        return resolveCommand_1(parsed);
    }

    return parsed.file;
}

function parseNonShell(parsed) {
    if (!isWin) {
        return parsed;
    }

    // Detect & add support for shebangs
    const commandFile = detectShebang(parsed);

    // We don't need a shell if the command filename is an executable
    const needsShell = !isExecutableRegExp.test(commandFile);

    // If a shell is required, use cmd.exe and take care of escaping everything correctly
    // Note that `forceShell` is an hidden option used only in tests
    if (parsed.options.forceShell || needsShell) {
        // Need to double escape meta chars if the command is a cmd-shim located in `node_modules/.bin/`
        // The cmd-shim simply calls execute the package bin file with NodeJS, proxying any argument
        // Because the escape of metachars with ^ gets interpreted when the cmd.exe is first called,
        // we need to double escape them
        const needsDoubleEscapeMetaChars = isCmdShimRegExp.test(commandFile);

        // Normalize posix paths into OS compatible paths (e.g.: foo/bar -> foo\bar)
        // This is necessary otherwise it will always fail with ENOENT in those cases
        parsed.command = path__default['default'].normalize(parsed.command);

        // Escape command & arguments
        parsed.command = _escape.command(parsed.command);
        parsed.args = parsed.args.map((arg) => _escape.argument(arg, needsDoubleEscapeMetaChars));

        const shellCommand = [parsed.command].concat(parsed.args).join(' ');

        parsed.args = ['/d', '/s', '/c', `"${shellCommand}"`];
        parsed.command = process.env.comspec || 'cmd.exe';
        parsed.options.windowsVerbatimArguments = true; // Tell node's spawn that the arguments are already escaped
    }

    return parsed;
}

function parse(command, args, options) {
    // Normalize arguments, similar to nodejs
    if (args && !Array.isArray(args)) {
        options = args;
        args = null;
    }

    args = args ? args.slice(0) : []; // Clone array to avoid changing the original
    options = Object.assign({}, options); // Clone object to avoid changing the original

    // Build our parsed object
    const parsed = {
        command,
        args,
        options,
        file: undefined,
        original: {
            command,
            args,
        },
    };

    // Delegate further parsing to shell or non-shell
    return options.shell ? parsed : parseNonShell(parsed);
}

var parse_1 = parse;

const isWin$1 = process.platform === 'win32';

function notFoundError(original, syscall) {
    return Object.assign(new Error(`${syscall} ${original.command} ENOENT`), {
        code: 'ENOENT',
        errno: 'ENOENT',
        syscall: `${syscall} ${original.command}`,
        path: original.command,
        spawnargs: original.args,
    });
}

function hookChildProcess(cp, parsed) {
    if (!isWin$1) {
        return;
    }

    const originalEmit = cp.emit;

    cp.emit = function (name, arg1) {
        // If emitting "exit" event and exit code is 1, we need to check if
        // the command exists and emit an "error" instead
        // See https://github.com/IndigoUnited/node-cross-spawn/issues/16
        if (name === 'exit') {
            const err = verifyENOENT(arg1, parsed);

            if (err) {
                return originalEmit.call(cp, 'error', err);
            }
        }

        return originalEmit.apply(cp, arguments); // eslint-disable-line prefer-rest-params
    };
}

function verifyENOENT(status, parsed) {
    if (isWin$1 && status === 1 && !parsed.file) {
        return notFoundError(parsed.original, 'spawn');
    }

    return null;
}

function verifyENOENTSync(status, parsed) {
    if (isWin$1 && status === 1 && !parsed.file) {
        return notFoundError(parsed.original, 'spawnSync');
    }

    return null;
}

var enoent = {
    hookChildProcess,
    verifyENOENT,
    verifyENOENTSync,
    notFoundError,
};

function spawn(command, args, options) {
    // Parse the arguments
    const parsed = parse_1(command, args, options);

    // Spawn the child process
    const spawned = childProcess__default['default'].spawn(parsed.command, parsed.args, parsed.options);

    // Hook into child process "exit" event to emit an error if the command
    // does not exists, see: https://github.com/IndigoUnited/node-cross-spawn/issues/16
    enoent.hookChildProcess(spawned, parsed);

    return spawned;
}

function spawnSync(command, args, options) {
    // Parse the arguments
    const parsed = parse_1(command, args, options);

    // Spawn the child process
    const result = childProcess__default['default'].spawnSync(parsed.command, parsed.args, parsed.options);

    // Analyze if the command does not exist, see: https://github.com/IndigoUnited/node-cross-spawn/issues/16
    result.error = result.error || enoent.verifyENOENTSync(result.status, parsed);

    return result;
}

var crossSpawn = spawn;
var spawn_1 = spawn;
var sync$3 = spawnSync;

var _parse = parse_1;
var _enoent = enoent;
crossSpawn.spawn = spawn_1;
crossSpawn.sync = sync$3;
crossSpawn._parse = _parse;
crossSpawn._enoent = _enoent;

var stripFinalNewline = input => {
	const LF = typeof input === 'string' ? '\n' : '\n'.charCodeAt();
	const CR = typeof input === 'string' ? '\r' : '\r'.charCodeAt();

	if (input[input.length - 1] === LF) {
		input = input.slice(0, input.length - 1);
	}

	if (input[input.length - 1] === CR) {
		input = input.slice(0, input.length - 1);
	}

	return input;
};

var npmRunPath_1 = createCommonjsModule(function (module) {



const npmRunPath = options => {
	options = {
		cwd: process.cwd(),
		path: process.env[pathKey_1()],
		execPath: process.execPath,
		...options
	};

	let previous;
	let cwdPath = path__default['default'].resolve(options.cwd);
	const result = [];

	while (previous !== cwdPath) {
		result.push(path__default['default'].join(cwdPath, 'node_modules/.bin'));
		previous = cwdPath;
		cwdPath = path__default['default'].resolve(cwdPath, '..');
	}

	// Ensure the running `node` binary is used
	const execPathDir = path__default['default'].resolve(options.cwd, options.execPath, '..');
	result.push(execPathDir);

	return result.concat(options.path).join(path__default['default'].delimiter);
};

module.exports = npmRunPath;
// TODO: Remove this for the next major release
module.exports.default = npmRunPath;

module.exports.env = options => {
	options = {
		env: process.env,
		...options
	};

	const env = {...options.env};
	const path = pathKey_1({env});

	options.path = env[path];
	env[path] = module.exports(options);

	return env;
};
});

const mimicFn = (to, from) => {
	for (const prop of Reflect.ownKeys(from)) {
		Object.defineProperty(to, prop, Object.getOwnPropertyDescriptor(from, prop));
	}

	return to;
};

var mimicFn_1 = mimicFn;
// TODO: Remove this for the next major release
var _default$1 = mimicFn;
mimicFn_1.default = _default$1;

const calledFunctions = new WeakMap();

const onetime = (function_, options = {}) => {
	if (typeof function_ !== 'function') {
		throw new TypeError('Expected a function');
	}

	let returnValue;
	let callCount = 0;
	const functionName = function_.displayName || function_.name || '<anonymous>';

	const onetime = function (...arguments_) {
		calledFunctions.set(onetime, ++callCount);

		if (callCount === 1) {
			returnValue = function_.apply(this, arguments_);
			function_ = null;
		} else if (options.throw === true) {
			throw new Error(`Function \`${functionName}\` can only be called once`);
		}

		return returnValue;
	};

	mimicFn_1(onetime, function_);
	calledFunctions.set(onetime, callCount);

	return onetime;
};

var onetime_1 = onetime;
// TODO: Remove this for the next major release
var _default$2 = onetime;

var callCount = function_ => {
	if (!calledFunctions.has(function_)) {
		throw new Error(`The given function \`${function_.name}\` is not wrapped by the \`onetime\` package`);
	}

	return calledFunctions.get(function_);
};
onetime_1.default = _default$2;
onetime_1.callCount = callCount;

var core$2 = createCommonjsModule(function (module, exports) {
Object.defineProperty(exports,"__esModule",{value:true});exports.SIGNALS=void 0;

const SIGNALS=[
{
name:"SIGHUP",
number:1,
action:"terminate",
description:"Terminal closed",
standard:"posix"},

{
name:"SIGINT",
number:2,
action:"terminate",
description:"User interruption with CTRL-C",
standard:"ansi"},

{
name:"SIGQUIT",
number:3,
action:"core",
description:"User interruption with CTRL-\\",
standard:"posix"},

{
name:"SIGILL",
number:4,
action:"core",
description:"Invalid machine instruction",
standard:"ansi"},

{
name:"SIGTRAP",
number:5,
action:"core",
description:"Debugger breakpoint",
standard:"posix"},

{
name:"SIGABRT",
number:6,
action:"core",
description:"Aborted",
standard:"ansi"},

{
name:"SIGIOT",
number:6,
action:"core",
description:"Aborted",
standard:"bsd"},

{
name:"SIGBUS",
number:7,
action:"core",
description:
"Bus error due to misaligned, non-existing address or paging error",
standard:"bsd"},

{
name:"SIGEMT",
number:7,
action:"terminate",
description:"Command should be emulated but is not implemented",
standard:"other"},

{
name:"SIGFPE",
number:8,
action:"core",
description:"Floating point arithmetic error",
standard:"ansi"},

{
name:"SIGKILL",
number:9,
action:"terminate",
description:"Forced termination",
standard:"posix",
forced:true},

{
name:"SIGUSR1",
number:10,
action:"terminate",
description:"Application-specific signal",
standard:"posix"},

{
name:"SIGSEGV",
number:11,
action:"core",
description:"Segmentation fault",
standard:"ansi"},

{
name:"SIGUSR2",
number:12,
action:"terminate",
description:"Application-specific signal",
standard:"posix"},

{
name:"SIGPIPE",
number:13,
action:"terminate",
description:"Broken pipe or socket",
standard:"posix"},

{
name:"SIGALRM",
number:14,
action:"terminate",
description:"Timeout or timer",
standard:"posix"},

{
name:"SIGTERM",
number:15,
action:"terminate",
description:"Termination",
standard:"ansi"},

{
name:"SIGSTKFLT",
number:16,
action:"terminate",
description:"Stack is empty or overflowed",
standard:"other"},

{
name:"SIGCHLD",
number:17,
action:"ignore",
description:"Child process terminated, paused or unpaused",
standard:"posix"},

{
name:"SIGCLD",
number:17,
action:"ignore",
description:"Child process terminated, paused or unpaused",
standard:"other"},

{
name:"SIGCONT",
number:18,
action:"unpause",
description:"Unpaused",
standard:"posix",
forced:true},

{
name:"SIGSTOP",
number:19,
action:"pause",
description:"Paused",
standard:"posix",
forced:true},

{
name:"SIGTSTP",
number:20,
action:"pause",
description:"Paused using CTRL-Z or \"suspend\"",
standard:"posix"},

{
name:"SIGTTIN",
number:21,
action:"pause",
description:"Background process cannot read terminal input",
standard:"posix"},

{
name:"SIGBREAK",
number:21,
action:"terminate",
description:"User interruption with CTRL-BREAK",
standard:"other"},

{
name:"SIGTTOU",
number:22,
action:"pause",
description:"Background process cannot write to terminal output",
standard:"posix"},

{
name:"SIGURG",
number:23,
action:"ignore",
description:"Socket received out-of-band data",
standard:"bsd"},

{
name:"SIGXCPU",
number:24,
action:"core",
description:"Process timed out",
standard:"bsd"},

{
name:"SIGXFSZ",
number:25,
action:"core",
description:"File too big",
standard:"bsd"},

{
name:"SIGVTALRM",
number:26,
action:"terminate",
description:"Timeout or timer",
standard:"bsd"},

{
name:"SIGPROF",
number:27,
action:"terminate",
description:"Timeout or timer",
standard:"bsd"},

{
name:"SIGWINCH",
number:28,
action:"ignore",
description:"Terminal window size changed",
standard:"bsd"},

{
name:"SIGIO",
number:29,
action:"terminate",
description:"I/O is available",
standard:"other"},

{
name:"SIGPOLL",
number:29,
action:"terminate",
description:"Watched event",
standard:"other"},

{
name:"SIGINFO",
number:29,
action:"ignore",
description:"Request for process information",
standard:"other"},

{
name:"SIGPWR",
number:30,
action:"terminate",
description:"Device running out of power",
standard:"systemv"},

{
name:"SIGSYS",
number:31,
action:"core",
description:"Invalid system call",
standard:"other"},

{
name:"SIGUNUSED",
number:31,
action:"terminate",
description:"Invalid system call",
standard:"other"}];exports.SIGNALS=SIGNALS;

});

var realtime = createCommonjsModule(function (module, exports) {
Object.defineProperty(exports,"__esModule",{value:true});exports.SIGRTMAX=exports.getRealtimeSignals=void 0;
const getRealtimeSignals=function(){
const length=SIGRTMAX-SIGRTMIN+1;
return Array.from({length},getRealtimeSignal);
};exports.getRealtimeSignals=getRealtimeSignals;

const getRealtimeSignal=function(value,index){
return {
name:`SIGRT${index+1}`,
number:SIGRTMIN+index,
action:"terminate",
description:"Application-specific signal (realtime)",
standard:"posix"};

};

const SIGRTMIN=34;
const SIGRTMAX=64;exports.SIGRTMAX=SIGRTMAX;

});

var signals = createCommonjsModule(function (module, exports) {
Object.defineProperty(exports,"__esModule",{value:true});exports.getSignals=void 0;






const getSignals=function(){
const realtimeSignals=(0, realtime.getRealtimeSignals)();
const signals=[...core$2.SIGNALS,...realtimeSignals].map(normalizeSignal);
return signals;
};exports.getSignals=getSignals;







const normalizeSignal=function({
name,
number:defaultNumber,
description,
action,
forced=false,
standard})
{
const{
signals:{[name]:constantSignal}}=
require$$0__default$1['default'].constants;
const supported=constantSignal!==undefined;
const number=supported?constantSignal:defaultNumber;
return {name,number,description,supported,action,forced,standard};
};

});

var main = createCommonjsModule(function (module, exports) {
Object.defineProperty(exports,"__esModule",{value:true});exports.signalsByNumber=exports.signalsByName=void 0;






const getSignalsByName=function(){
const signals$1=(0, signals.getSignals)();
return signals$1.reduce(getSignalByName,{});
};

const getSignalByName=function(
signalByNameMemo,
{name,number,description,supported,action,forced,standard})
{
return {
...signalByNameMemo,
[name]:{name,number,description,supported,action,forced,standard}};

};

const signalsByName=getSignalsByName();exports.signalsByName=signalsByName;




const getSignalsByNumber=function(){
const signals$1=(0, signals.getSignals)();
const length=realtime.SIGRTMAX+1;
const signalsA=Array.from({length},(value,number)=>
getSignalByNumber(number,signals$1));

return Object.assign({},...signalsA);
};

const getSignalByNumber=function(number,signals){
const signal=findSignalByNumber(number,signals);

if(signal===undefined){
return {};
}

const{name,description,supported,action,forced,standard}=signal;
return {
[number]:{
name,
number,
description,
supported,
action,
forced,
standard}};


};



const findSignalByNumber=function(number,signals){
const signal=signals.find(({name})=>require$$0__default$1['default'].constants.signals[name]===number);

if(signal!==undefined){
return signal;
}

return signals.find(signalA=>signalA.number===number);
};

const signalsByNumber=getSignalsByNumber();exports.signalsByNumber=signalsByNumber;

});

const {signalsByName} = main;

const getErrorPrefix = ({timedOut, timeout, errorCode, signal, signalDescription, exitCode, isCanceled}) => {
	if (timedOut) {
		return `timed out after ${timeout} milliseconds`;
	}

	if (isCanceled) {
		return 'was canceled';
	}

	if (errorCode !== undefined) {
		return `failed with ${errorCode}`;
	}

	if (signal !== undefined) {
		return `was killed with ${signal} (${signalDescription})`;
	}

	if (exitCode !== undefined) {
		return `failed with exit code ${exitCode}`;
	}

	return 'failed';
};

const makeError = ({
	stdout,
	stderr,
	all,
	error,
	signal,
	exitCode,
	command,
	timedOut,
	isCanceled,
	killed,
	parsed: {options: {timeout}}
}) => {
	// `signal` and `exitCode` emitted on `spawned.on('exit')` event can be `null`.
	// We normalize them to `undefined`
	exitCode = exitCode === null ? undefined : exitCode;
	signal = signal === null ? undefined : signal;
	const signalDescription = signal === undefined ? undefined : signalsByName[signal].description;

	const errorCode = error && error.code;

	const prefix = getErrorPrefix({timedOut, timeout, errorCode, signal, signalDescription, exitCode, isCanceled});
	const execaMessage = `Command ${prefix}: ${command}`;
	const isError = Object.prototype.toString.call(error) === '[object Error]';
	const shortMessage = isError ? `${execaMessage}\n${error.message}` : execaMessage;
	const message = [shortMessage, stderr, stdout].filter(Boolean).join('\n');

	if (isError) {
		error.originalMessage = error.message;
		error.message = message;
	} else {
		error = new Error(message);
	}

	error.shortMessage = shortMessage;
	error.command = command;
	error.exitCode = exitCode;
	error.signal = signal;
	error.signalDescription = signalDescription;
	error.stdout = stdout;
	error.stderr = stderr;

	if (all !== undefined) {
		error.all = all;
	}

	if ('bufferedData' in error) {
		delete error.bufferedData;
	}

	error.failed = true;
	error.timedOut = Boolean(timedOut);
	error.isCanceled = isCanceled;
	error.killed = killed && !timedOut;

	return error;
};

var error$1 = makeError;

const aliases = ['stdin', 'stdout', 'stderr'];

const hasAlias = opts => aliases.some(alias => opts[alias] !== undefined);

const normalizeStdio = opts => {
	if (!opts) {
		return;
	}

	const {stdio} = opts;

	if (stdio === undefined) {
		return aliases.map(alias => opts[alias]);
	}

	if (hasAlias(opts)) {
		throw new Error(`It's not possible to provide \`stdio\` in combination with one of ${aliases.map(alias => `\`${alias}\``).join(', ')}`);
	}

	if (typeof stdio === 'string') {
		return stdio;
	}

	if (!Array.isArray(stdio)) {
		throw new TypeError(`Expected \`stdio\` to be of type \`string\` or \`Array\`, got \`${typeof stdio}\``);
	}

	const length = Math.max(stdio.length, aliases.length);
	return Array.from({length}, (value, index) => stdio[index]);
};

var stdio = normalizeStdio;

// `ipc` is pushed unless it is already present
var node = opts => {
	const stdio = normalizeStdio(opts);

	if (stdio === 'ipc') {
		return 'ipc';
	}

	if (stdio === undefined || typeof stdio === 'string') {
		return [stdio, stdio, stdio, 'ipc'];
	}

	if (stdio.includes('ipc')) {
		return stdio;
	}

	return [...stdio, 'ipc'];
};
stdio.node = node;

var signals$1 = createCommonjsModule(function (module) {
// This is not the set of all possible signals.
//
// It IS, however, the set of all signals that trigger
// an exit on either Linux or BSD systems.  Linux is a
// superset of the signal names supported on BSD, and
// the unknown signals just fail to register, so we can
// catch that easily enough.
//
// Don't bother with SIGKILL.  It's uncatchable, which
// means that we can't fire any callbacks anyway.
//
// If a user does happen to register a handler on a non-
// fatal signal like SIGWINCH or something, and then
// exit, it'll end up firing `process.emit('exit')`, so
// the handler will be fired anyway.
//
// SIGBUS, SIGFPE, SIGSEGV and SIGILL, when not raised
// artificially, inherently leave the process in a
// state from which it is not safe to try and enter JS
// listeners.
module.exports = [
  'SIGABRT',
  'SIGALRM',
  'SIGHUP',
  'SIGINT',
  'SIGTERM'
];

if (process.platform !== 'win32') {
  module.exports.push(
    'SIGVTALRM',
    'SIGXCPU',
    'SIGXFSZ',
    'SIGUSR2',
    'SIGTRAP',
    'SIGSYS',
    'SIGQUIT',
    'SIGIOT'
    // should detect profiler and enable/disable accordingly.
    // see #21
    // 'SIGPROF'
  );
}

if (process.platform === 'linux') {
  module.exports.push(
    'SIGIO',
    'SIGPOLL',
    'SIGPWR',
    'SIGSTKFLT',
    'SIGUNUSED'
  );
}
});

// Note: since nyc uses this module to output coverage, any lines
// that are in the direct sync flow of nyc's outputCoverage are
// ignored, since we can never get coverage for them.

var signals$2 = signals$1;
var isWin$2 = /^win/i.test(process.platform);

var EE = require$$1__default['default'];
/* istanbul ignore if */
if (typeof EE !== 'function') {
  EE = EE.EventEmitter;
}

var emitter;
if (process.__signal_exit_emitter__) {
  emitter = process.__signal_exit_emitter__;
} else {
  emitter = process.__signal_exit_emitter__ = new EE();
  emitter.count = 0;
  emitter.emitted = {};
}

// Because this emitter is a global, we have to check to see if a
// previous version of this library failed to enable infinite listeners.
// I know what you're about to say.  But literally everything about
// signal-exit is a compromise with evil.  Get used to it.
if (!emitter.infinite) {
  emitter.setMaxListeners(Infinity);
  emitter.infinite = true;
}

var signalExit = function (cb, opts) {
  assert__default['default'].equal(typeof cb, 'function', 'a callback must be provided for exit handler');

  if (loaded === false) {
    load();
  }

  var ev = 'exit';
  if (opts && opts.alwaysLast) {
    ev = 'afterexit';
  }

  var remove = function () {
    emitter.removeListener(ev, cb);
    if (emitter.listeners('exit').length === 0 &&
        emitter.listeners('afterexit').length === 0) {
      unload();
    }
  };
  emitter.on(ev, cb);

  return remove
};

var unload_1 = unload;
function unload () {
  if (!loaded) {
    return
  }
  loaded = false;

  signals$2.forEach(function (sig) {
    try {
      process.removeListener(sig, sigListeners[sig]);
    } catch (er) {}
  });
  process.emit = originalProcessEmit;
  process.reallyExit = originalProcessReallyExit;
  emitter.count -= 1;
}

function emit (event, code, signal) {
  if (emitter.emitted[event]) {
    return
  }
  emitter.emitted[event] = true;
  emitter.emit(event, code, signal);
}

// { <signal>: <listener fn>, ... }
var sigListeners = {};
signals$2.forEach(function (sig) {
  sigListeners[sig] = function listener () {
    // If there are no other listeners, an exit is coming!
    // Simplest way: remove us and then re-send the signal.
    // We know that this will kill the process, so we can
    // safely emit now.
    var listeners = process.listeners(sig);
    if (listeners.length === emitter.count) {
      unload();
      emit('exit', null, sig);
      /* istanbul ignore next */
      emit('afterexit', null, sig);
      /* istanbul ignore next */
      if (isWin$2 && sig === 'SIGHUP') {
        // "SIGHUP" throws an `ENOSYS` error on Windows,
        // so use a supported signal instead
        sig = 'SIGINT';
      }
      process.kill(process.pid, sig);
    }
  };
});

var signals_1 = function () {
  return signals$2
};

var load_1 = load;

var loaded = false;

function load () {
  if (loaded) {
    return
  }
  loaded = true;

  // This is the number of onSignalExit's that are in play.
  // It's important so that we can count the correct number of
  // listeners on signals, and don't wait for the other one to
  // handle it instead of us.
  emitter.count += 1;

  signals$2 = signals$2.filter(function (sig) {
    try {
      process.on(sig, sigListeners[sig]);
      return true
    } catch (er) {
      return false
    }
  });

  process.emit = processEmit;
  process.reallyExit = processReallyExit;
}

var originalProcessReallyExit = process.reallyExit;
function processReallyExit (code) {
  process.exitCode = code || 0;
  emit('exit', process.exitCode, null);
  /* istanbul ignore next */
  emit('afterexit', process.exitCode, null);
  /* istanbul ignore next */
  originalProcessReallyExit.call(process, process.exitCode);
}

var originalProcessEmit = process.emit;
function processEmit (ev, arg) {
  if (ev === 'exit') {
    if (arg !== undefined) {
      process.exitCode = arg;
    }
    var ret = originalProcessEmit.apply(this, arguments);
    emit('exit', process.exitCode, null);
    /* istanbul ignore next */
    emit('afterexit', process.exitCode, null);
    return ret
  } else {
    return originalProcessEmit.apply(this, arguments)
  }
}
signalExit.unload = unload_1;
signalExit.signals = signals_1;
signalExit.load = load_1;

const DEFAULT_FORCE_KILL_TIMEOUT = 1000 * 5;

// Monkey-patches `childProcess.kill()` to add `forceKillAfterTimeout` behavior
const spawnedKill = (kill, signal = 'SIGTERM', options = {}) => {
	const killResult = kill(signal);
	setKillTimeout(kill, signal, options, killResult);
	return killResult;
};

const setKillTimeout = (kill, signal, options, killResult) => {
	if (!shouldForceKill(signal, options, killResult)) {
		return;
	}

	const timeout = getForceKillAfterTimeout(options);
	const t = setTimeout(() => {
		kill('SIGKILL');
	}, timeout);

	// Guarded because there's no `.unref()` when `execa` is used in the renderer
	// process in Electron. This cannot be tested since we don't run tests in
	// Electron.
	// istanbul ignore else
	if (t.unref) {
		t.unref();
	}
};

const shouldForceKill = (signal, {forceKillAfterTimeout}, killResult) => {
	return isSigterm(signal) && forceKillAfterTimeout !== false && killResult;
};

const isSigterm = signal => {
	return signal === require$$0__default$1['default'].constants.signals.SIGTERM ||
		(typeof signal === 'string' && signal.toUpperCase() === 'SIGTERM');
};

const getForceKillAfterTimeout = ({forceKillAfterTimeout = true}) => {
	if (forceKillAfterTimeout === true) {
		return DEFAULT_FORCE_KILL_TIMEOUT;
	}

	if (!Number.isFinite(forceKillAfterTimeout) || forceKillAfterTimeout < 0) {
		throw new TypeError(`Expected the \`forceKillAfterTimeout\` option to be a non-negative integer, got \`${forceKillAfterTimeout}\` (${typeof forceKillAfterTimeout})`);
	}

	return forceKillAfterTimeout;
};

// `childProcess.cancel()`
const spawnedCancel = (spawned, context) => {
	const killResult = spawned.kill();

	if (killResult) {
		context.isCanceled = true;
	}
};

const timeoutKill = (spawned, signal, reject) => {
	spawned.kill(signal);
	reject(Object.assign(new Error('Timed out'), {timedOut: true, signal}));
};

// `timeout` option handling
const setupTimeout = (spawned, {timeout, killSignal = 'SIGTERM'}, spawnedPromise) => {
	if (timeout === 0 || timeout === undefined) {
		return spawnedPromise;
	}

	if (!Number.isFinite(timeout) || timeout < 0) {
		throw new TypeError(`Expected the \`timeout\` option to be a non-negative integer, got \`${timeout}\` (${typeof timeout})`);
	}

	let timeoutId;
	const timeoutPromise = new Promise((resolve, reject) => {
		timeoutId = setTimeout(() => {
			timeoutKill(spawned, killSignal, reject);
		}, timeout);
	});

	const safeSpawnedPromise = spawnedPromise.finally(() => {
		clearTimeout(timeoutId);
	});

	return Promise.race([timeoutPromise, safeSpawnedPromise]);
};

// `cleanup` option handling
const setExitHandler = async (spawned, {cleanup, detached}, timedPromise) => {
	if (!cleanup || detached) {
		return timedPromise;
	}

	const removeExitHandler = signalExit(() => {
		spawned.kill();
	});

	return timedPromise.finally(() => {
		removeExitHandler();
	});
};

var kill = {
	spawnedKill,
	spawnedCancel,
	setupTimeout,
	setExitHandler
};

const isStream = stream =>
	stream !== null &&
	typeof stream === 'object' &&
	typeof stream.pipe === 'function';

isStream.writable = stream =>
	isStream(stream) &&
	stream.writable !== false &&
	typeof stream._write === 'function' &&
	typeof stream._writableState === 'object';

isStream.readable = stream =>
	isStream(stream) &&
	stream.readable !== false &&
	typeof stream._read === 'function' &&
	typeof stream._readableState === 'object';

isStream.duplex = stream =>
	isStream.writable(stream) &&
	isStream.readable(stream);

isStream.transform = stream =>
	isStream.duplex(stream) &&
	typeof stream._transform === 'function' &&
	typeof stream._transformState === 'object';

var isStream_1 = isStream;

// Returns a wrapper function that returns a wrapped callback
// The wrapper function should do some stuff, and return a
// presumably different callback function.
// This makes sure that own properties are retained, so that
// decorations and such are not lost along the way.
var wrappy_1 = wrappy;
function wrappy (fn, cb) {
  if (fn && cb) return wrappy(fn)(cb)

  if (typeof fn !== 'function')
    throw new TypeError('need wrapper function')

  Object.keys(fn).forEach(function (k) {
    wrapper[k] = fn[k];
  });

  return wrapper

  function wrapper() {
    var args = new Array(arguments.length);
    for (var i = 0; i < args.length; i++) {
      args[i] = arguments[i];
    }
    var ret = fn.apply(this, args);
    var cb = args[args.length-1];
    if (typeof ret === 'function' && ret !== cb) {
      Object.keys(cb).forEach(function (k) {
        ret[k] = cb[k];
      });
    }
    return ret
  }
}

var once_1 = wrappy_1(once);
var strict = wrappy_1(onceStrict);

once.proto = once(function () {
  Object.defineProperty(Function.prototype, 'once', {
    value: function () {
      return once(this)
    },
    configurable: true
  });

  Object.defineProperty(Function.prototype, 'onceStrict', {
    value: function () {
      return onceStrict(this)
    },
    configurable: true
  });
});

function once (fn) {
  var f = function () {
    if (f.called) return f.value
    f.called = true;
    return f.value = fn.apply(this, arguments)
  };
  f.called = false;
  return f
}

function onceStrict (fn) {
  var f = function () {
    if (f.called)
      throw new Error(f.onceError)
    f.called = true;
    return f.value = fn.apply(this, arguments)
  };
  var name = fn.name || 'Function wrapped with `once`';
  f.onceError = name + " shouldn't be called more than once";
  f.called = false;
  return f
}
once_1.strict = strict;

var noop = function() {};

var isRequest = function(stream) {
	return stream.setHeader && typeof stream.abort === 'function';
};

var isChildProcess = function(stream) {
	return stream.stdio && Array.isArray(stream.stdio) && stream.stdio.length === 3
};

var eos = function(stream, opts, callback) {
	if (typeof opts === 'function') return eos(stream, null, opts);
	if (!opts) opts = {};

	callback = once_1(callback || noop);

	var ws = stream._writableState;
	var rs = stream._readableState;
	var readable = opts.readable || (opts.readable !== false && stream.readable);
	var writable = opts.writable || (opts.writable !== false && stream.writable);
	var cancelled = false;

	var onlegacyfinish = function() {
		if (!stream.writable) onfinish();
	};

	var onfinish = function() {
		writable = false;
		if (!readable) callback.call(stream);
	};

	var onend = function() {
		readable = false;
		if (!writable) callback.call(stream);
	};

	var onexit = function(exitCode) {
		callback.call(stream, exitCode ? new Error('exited with error code: ' + exitCode) : null);
	};

	var onerror = function(err) {
		callback.call(stream, err);
	};

	var onclose = function() {
		process.nextTick(onclosenexttick);
	};

	var onclosenexttick = function() {
		if (cancelled) return;
		if (readable && !(rs && (rs.ended && !rs.destroyed))) return callback.call(stream, new Error('premature close'));
		if (writable && !(ws && (ws.ended && !ws.destroyed))) return callback.call(stream, new Error('premature close'));
	};

	var onrequest = function() {
		stream.req.on('finish', onfinish);
	};

	if (isRequest(stream)) {
		stream.on('complete', onfinish);
		stream.on('abort', onclose);
		if (stream.req) onrequest();
		else stream.on('request', onrequest);
	} else if (writable && !ws) { // legacy streams
		stream.on('end', onlegacyfinish);
		stream.on('close', onlegacyfinish);
	}

	if (isChildProcess(stream)) stream.on('exit', onexit);

	stream.on('end', onend);
	stream.on('finish', onfinish);
	if (opts.error !== false) stream.on('error', onerror);
	stream.on('close', onclose);

	return function() {
		cancelled = true;
		stream.removeListener('complete', onfinish);
		stream.removeListener('abort', onclose);
		stream.removeListener('request', onrequest);
		if (stream.req) stream.req.removeListener('finish', onfinish);
		stream.removeListener('end', onlegacyfinish);
		stream.removeListener('close', onlegacyfinish);
		stream.removeListener('finish', onfinish);
		stream.removeListener('exit', onexit);
		stream.removeListener('end', onend);
		stream.removeListener('error', onerror);
		stream.removeListener('close', onclose);
	};
};

var endOfStream = eos;

// we only need fs to get the ReadStream and WriteStream prototypes

var noop$1 = function () {};
var ancient = /^v?\.0/.test(process.version);

var isFn = function (fn) {
  return typeof fn === 'function'
};

var isFS = function (stream) {
  if (!ancient) return false // newer node version do not need to care about fs is a special way
  if (!fs__default['default']) return false // browser
  return (stream instanceof (fs__default['default'].ReadStream || noop$1) || stream instanceof (fs__default['default'].WriteStream || noop$1)) && isFn(stream.close)
};

var isRequest$1 = function (stream) {
  return stream.setHeader && isFn(stream.abort)
};

var destroyer = function (stream, reading, writing, callback) {
  callback = once_1(callback);

  var closed = false;
  stream.on('close', function () {
    closed = true;
  });

  endOfStream(stream, {readable: reading, writable: writing}, function (err) {
    if (err) return callback(err)
    closed = true;
    callback();
  });

  var destroyed = false;
  return function (err) {
    if (closed) return
    if (destroyed) return
    destroyed = true;

    if (isFS(stream)) return stream.close(noop$1) // use close for fs streams to avoid fd leaks
    if (isRequest$1(stream)) return stream.abort() // request.destroy just do .end - .abort is what we want

    if (isFn(stream.destroy)) return stream.destroy()

    callback(err || new Error('stream was destroyed'));
  }
};

var call = function (fn) {
  fn();
};

var pipe = function (from, to) {
  return from.pipe(to)
};

var pump = function () {
  var streams = Array.prototype.slice.call(arguments);
  var callback = isFn(streams[streams.length - 1] || noop$1) && streams.pop() || noop$1;

  if (Array.isArray(streams[0])) streams = streams[0];
  if (streams.length < 2) throw new Error('pump requires two streams per minimum')

  var error;
  var destroys = streams.map(function (stream, i) {
    var reading = i < streams.length - 1;
    var writing = i > 0;
    return destroyer(stream, reading, writing, function (err) {
      if (!error) error = err;
      if (err) destroys.forEach(call);
      if (reading) return
      destroys.forEach(call);
      callback(error);
    })
  });

  return streams.reduce(pipe)
};

var pump_1 = pump;

const {PassThrough: PassThroughStream} = Stream__default['default'];

var bufferStream = options => {
	options = {...options};

	const {array} = options;
	let {encoding} = options;
	const isBuffer = encoding === 'buffer';
	let objectMode = false;

	if (array) {
		objectMode = !(encoding || isBuffer);
	} else {
		encoding = encoding || 'utf8';
	}

	if (isBuffer) {
		encoding = null;
	}

	const stream = new PassThroughStream({objectMode});

	if (encoding) {
		stream.setEncoding(encoding);
	}

	let length = 0;
	const chunks = [];

	stream.on('data', chunk => {
		chunks.push(chunk);

		if (objectMode) {
			length = chunks.length;
		} else {
			length += chunk.length;
		}
	});

	stream.getBufferedValue = () => {
		if (array) {
			return chunks;
		}

		return isBuffer ? Buffer.concat(chunks, length) : chunks.join('');
	};

	stream.getBufferedLength = () => length;

	return stream;
};

const {constants: BufferConstants} = require$$0__default$2['default'];



class MaxBufferError extends Error {
	constructor() {
		super('maxBuffer exceeded');
		this.name = 'MaxBufferError';
	}
}

async function getStream(inputStream, options) {
	if (!inputStream) {
		return Promise.reject(new Error('Expected a stream'));
	}

	options = {
		maxBuffer: Infinity,
		...options
	};

	const {maxBuffer} = options;

	let stream;
	await new Promise((resolve, reject) => {
		const rejectPromise = error => {
			// Don't retrieve an oversized buffer.
			if (error && stream.getBufferedLength() <= BufferConstants.MAX_LENGTH) {
				error.bufferedData = stream.getBufferedValue();
			}

			reject(error);
		};

		stream = pump_1(inputStream, bufferStream(options), error => {
			if (error) {
				rejectPromise(error);
				return;
			}

			resolve();
		});

		stream.on('data', () => {
			if (stream.getBufferedLength() > maxBuffer) {
				rejectPromise(new MaxBufferError());
			}
		});
	});

	return stream.getBufferedValue();
}

var getStream_1 = getStream;
// TODO: Remove this for the next major release
var _default$3 = getStream;
var buffer = (stream, options) => getStream(stream, {...options, encoding: 'buffer'});
var array = (stream, options) => getStream(stream, {...options, array: true});
var MaxBufferError_1 = MaxBufferError;
getStream_1.default = _default$3;
getStream_1.buffer = buffer;
getStream_1.array = array;
getStream_1.MaxBufferError = MaxBufferError_1;

const { PassThrough } = Stream__default['default'];

var mergeStream = function (/*streams...*/) {
  var sources = [];
  var output  = new PassThrough({objectMode: true});

  output.setMaxListeners(0);

  output.add = add;
  output.isEmpty = isEmpty;

  output.on('unpipe', remove);

  Array.prototype.slice.call(arguments).forEach(add);

  return output

  function add (source) {
    if (Array.isArray(source)) {
      source.forEach(add);
      return this
    }

    sources.push(source);
    source.once('end', remove.bind(null, source));
    source.once('error', output.emit.bind(output, 'error'));
    source.pipe(output, {end: false});
    return this
  }

  function isEmpty () {
    return sources.length == 0;
  }

  function remove (source) {
    sources = sources.filter(function (it) { return it !== source });
    if (!sources.length && output.readable) { output.end(); }
  }
};

// `input` option
const handleInput = (spawned, input) => {
	// Checking for stdin is workaround for https://github.com/nodejs/node/issues/26852
	// TODO: Remove `|| spawned.stdin === undefined` once we drop support for Node.js <=12.2.0
	if (input === undefined || spawned.stdin === undefined) {
		return;
	}

	if (isStream_1(input)) {
		input.pipe(spawned.stdin);
	} else {
		spawned.stdin.end(input);
	}
};

// `all` interleaves `stdout` and `stderr`
const makeAllStream = (spawned, {all}) => {
	if (!all || (!spawned.stdout && !spawned.stderr)) {
		return;
	}

	const mixed = mergeStream();

	if (spawned.stdout) {
		mixed.add(spawned.stdout);
	}

	if (spawned.stderr) {
		mixed.add(spawned.stderr);
	}

	return mixed;
};

// On failure, `result.stdout|stderr|all` should contain the currently buffered stream
const getBufferedData = async (stream, streamPromise) => {
	if (!stream) {
		return;
	}

	stream.destroy();

	try {
		return await streamPromise;
	} catch (error) {
		return error.bufferedData;
	}
};

const getStreamPromise = (stream, {encoding, buffer, maxBuffer}) => {
	if (!stream || !buffer) {
		return;
	}

	if (encoding) {
		return getStream_1(stream, {encoding, maxBuffer});
	}

	return getStream_1.buffer(stream, {maxBuffer});
};

// Retrieve result of child process: exit code, signal, error, streams (stdout/stderr/all)
const getSpawnedResult = async ({stdout, stderr, all}, {encoding, buffer, maxBuffer}, processDone) => {
	const stdoutPromise = getStreamPromise(stdout, {encoding, buffer, maxBuffer});
	const stderrPromise = getStreamPromise(stderr, {encoding, buffer, maxBuffer});
	const allPromise = getStreamPromise(all, {encoding, buffer, maxBuffer: maxBuffer * 2});

	try {
		return await Promise.all([processDone, stdoutPromise, stderrPromise, allPromise]);
	} catch (error) {
		return Promise.all([
			{error, signal: error.signal, timedOut: error.timedOut},
			getBufferedData(stdout, stdoutPromise),
			getBufferedData(stderr, stderrPromise),
			getBufferedData(all, allPromise)
		]);
	}
};

const validateInputSync = ({input}) => {
	if (isStream_1(input)) {
		throw new TypeError('The `input` option cannot be a stream in sync mode');
	}
};

var stream = {
	handleInput,
	makeAllStream,
	getSpawnedResult,
	validateInputSync
};

const nativePromisePrototype = (async () => {})().constructor.prototype;
const descriptors = ['then', 'catch', 'finally'].map(property => [
	property,
	Reflect.getOwnPropertyDescriptor(nativePromisePrototype, property)
]);

// The return value is a mixin of `childProcess` and `Promise`
const mergePromise = (spawned, promise) => {
	for (const [property, descriptor] of descriptors) {
		// Starting the main `promise` is deferred to avoid consuming streams
		const value = typeof promise === 'function' ?
			(...args) => Reflect.apply(descriptor.value, promise(), args) :
			descriptor.value.bind(promise);

		Reflect.defineProperty(spawned, property, {...descriptor, value});
	}

	return spawned;
};

// Use promises instead of `child_process` events
const getSpawnedPromise = spawned => {
	return new Promise((resolve, reject) => {
		spawned.on('exit', (exitCode, signal) => {
			resolve({exitCode, signal});
		});

		spawned.on('error', error => {
			reject(error);
		});

		if (spawned.stdin) {
			spawned.stdin.on('error', error => {
				reject(error);
			});
		}
	});
};

var promise = {
	mergePromise,
	getSpawnedPromise
};

const SPACES_REGEXP = / +/g;

const joinCommand = (file, args = []) => {
	if (!Array.isArray(args)) {
		return file;
	}

	return [file, ...args].join(' ');
};

// Allow spaces to be escaped by a backslash if not meant as a delimiter
const handleEscaping = (tokens, token, index) => {
	if (index === 0) {
		return [token];
	}

	const previousToken = tokens[tokens.length - 1];

	if (previousToken.endsWith('\\')) {
		return [...tokens.slice(0, -1), `${previousToken.slice(0, -1)} ${token}`];
	}

	return [...tokens, token];
};

// Handle `execa.command()`
const parseCommand = command => {
	return command
		.trim()
		.split(SPACES_REGEXP)
		.reduce(handleEscaping, []);
};

var command$2 = {
	joinCommand,
	parseCommand
};

const {spawnedKill: spawnedKill$1, spawnedCancel: spawnedCancel$1, setupTimeout: setupTimeout$1, setExitHandler: setExitHandler$1} = kill;
const {handleInput: handleInput$1, getSpawnedResult: getSpawnedResult$1, makeAllStream: makeAllStream$1, validateInputSync: validateInputSync$1} = stream;
const {mergePromise: mergePromise$1, getSpawnedPromise: getSpawnedPromise$1} = promise;
const {joinCommand: joinCommand$1, parseCommand: parseCommand$1} = command$2;

const DEFAULT_MAX_BUFFER = 1000 * 1000 * 100;

const getEnv = ({env: envOption, extendEnv, preferLocal, localDir, execPath}) => {
	const env = extendEnv ? {...process.env, ...envOption} : envOption;

	if (preferLocal) {
		return npmRunPath_1.env({env, cwd: localDir, execPath});
	}

	return env;
};

const handleArguments = (file, args, options = {}) => {
	const parsed = crossSpawn._parse(file, args, options);
	file = parsed.command;
	args = parsed.args;
	options = parsed.options;

	options = {
		maxBuffer: DEFAULT_MAX_BUFFER,
		buffer: true,
		stripFinalNewline: true,
		extendEnv: true,
		preferLocal: false,
		localDir: options.cwd || process.cwd(),
		execPath: process.execPath,
		encoding: 'utf8',
		reject: true,
		cleanup: true,
		all: false,
		windowsHide: true,
		...options
	};

	options.env = getEnv(options);

	options.stdio = stdio(options);

	if (process.platform === 'win32' && path__default['default'].basename(file, '.exe') === 'cmd') {
		// #116
		args.unshift('/q');
	}

	return {file, args, options, parsed};
};

const handleOutput = (options, value, error) => {
	if (typeof value !== 'string' && !Buffer.isBuffer(value)) {
		// When `execa.sync()` errors, we normalize it to '' to mimic `execa()`
		return error === undefined ? undefined : '';
	}

	if (options.stripFinalNewline) {
		return stripFinalNewline(value);
	}

	return value;
};

const execa = (file, args, options) => {
	const parsed = handleArguments(file, args, options);
	const command = joinCommand$1(file, args);

	let spawned;
	try {
		spawned = childProcess__default['default'].spawn(parsed.file, parsed.args, parsed.options);
	} catch (error) {
		// Ensure the returned error is always both a promise and a child process
		const dummySpawned = new childProcess__default['default'].ChildProcess();
		const errorPromise = Promise.reject(error$1({
			error,
			stdout: '',
			stderr: '',
			all: '',
			command,
			parsed,
			timedOut: false,
			isCanceled: false,
			killed: false
		}));
		return mergePromise$1(dummySpawned, errorPromise);
	}

	const spawnedPromise = getSpawnedPromise$1(spawned);
	const timedPromise = setupTimeout$1(spawned, parsed.options, spawnedPromise);
	const processDone = setExitHandler$1(spawned, parsed.options, timedPromise);

	const context = {isCanceled: false};

	spawned.kill = spawnedKill$1.bind(null, spawned.kill.bind(spawned));
	spawned.cancel = spawnedCancel$1.bind(null, spawned, context);

	const handlePromise = async () => {
		const [{error, exitCode, signal, timedOut}, stdoutResult, stderrResult, allResult] = await getSpawnedResult$1(spawned, parsed.options, processDone);
		const stdout = handleOutput(parsed.options, stdoutResult);
		const stderr = handleOutput(parsed.options, stderrResult);
		const all = handleOutput(parsed.options, allResult);

		if (error || exitCode !== 0 || signal !== null) {
			const returnedError = error$1({
				error,
				exitCode,
				signal,
				stdout,
				stderr,
				all,
				command,
				parsed,
				timedOut,
				isCanceled: context.isCanceled,
				killed: spawned.killed
			});

			if (!parsed.options.reject) {
				return returnedError;
			}

			throw returnedError;
		}

		return {
			command,
			exitCode: 0,
			stdout,
			stderr,
			all,
			failed: false,
			timedOut: false,
			isCanceled: false,
			killed: false
		};
	};

	const handlePromiseOnce = onetime_1(handlePromise);

	crossSpawn._enoent.hookChildProcess(spawned, parsed.parsed);

	handleInput$1(spawned, parsed.options.input);

	spawned.all = makeAllStream$1(spawned, parsed.options);

	return mergePromise$1(spawned, handlePromiseOnce);
};

var execa_1 = execa;

var sync$4 = (file, args, options) => {
	const parsed = handleArguments(file, args, options);
	const command = joinCommand$1(file, args);

	validateInputSync$1(parsed.options);

	let result;
	try {
		result = childProcess__default['default'].spawnSync(parsed.file, parsed.args, parsed.options);
	} catch (error) {
		throw error$1({
			error,
			stdout: '',
			stderr: '',
			all: '',
			command,
			parsed,
			timedOut: false,
			isCanceled: false,
			killed: false
		});
	}

	const stdout = handleOutput(parsed.options, result.stdout, result.error);
	const stderr = handleOutput(parsed.options, result.stderr, result.error);

	if (result.error || result.status !== 0 || result.signal !== null) {
		const error = error$1({
			stdout,
			stderr,
			error: result.error,
			signal: result.signal,
			exitCode: result.status,
			command,
			parsed,
			timedOut: result.error && result.error.code === 'ETIMEDOUT',
			isCanceled: false,
			killed: result.signal !== null
		});

		if (!parsed.options.reject) {
			return error;
		}

		throw error;
	}

	return {
		command,
		exitCode: 0,
		stdout,
		stderr,
		failed: false,
		timedOut: false,
		isCanceled: false,
		killed: false
	};
};

var command$3 = (command, options) => {
	const [file, ...args] = parseCommand$1(command);
	return execa(file, args, options);
};

var commandSync = (command, options) => {
	const [file, ...args] = parseCommand$1(command);
	return execa.sync(file, args, options);
};

var node$1 = (scriptPath, args, options = {}) => {
	if (args && !Array.isArray(args) && typeof args === 'object') {
		options = args;
		args = [];
	}

	const stdio$1 = stdio.node(options);

	const {nodePath = process.execPath, nodeOptions = process.execArgv} = options;

	return execa(
		nodePath,
		[
			...nodeOptions,
			scriptPath,
			...(Array.isArray(args) ? args : [])
		],
		{
			...options,
			stdin: undefined,
			stdout: undefined,
			stderr: undefined,
			stdio: stdio$1,
			shell: false
		}
	);
};
execa_1.sync = sync$4;
execa_1.command = command$3;
execa_1.commandSync = commandSync;
execa_1.node = node$1;

function getUserAgent() {
    if (typeof navigator === "object" && "userAgent" in navigator) {
        return navigator.userAgent;
    }
    if (typeof process === "object" && "version" in process) {
        return `Node.js/${process.version.substr(1)} (${process.platform}; ${process.arch})`;
    }
    return "<environment undetectable>";
}

var register_1 = register;

function register (state, name, method, options) {
  if (typeof method !== 'function') {
    throw new Error('method for before hook must be a function')
  }

  if (!options) {
    options = {};
  }

  if (Array.isArray(name)) {
    return name.reverse().reduce(function (callback, name) {
      return register.bind(null, state, name, callback, options)
    }, method)()
  }

  return Promise.resolve()
    .then(function () {
      if (!state.registry[name]) {
        return method(options)
      }

      return (state.registry[name]).reduce(function (method, registered) {
        return registered.hook.bind(null, method, options)
      }, method)()
    })
}

var add = addHook;

function addHook (state, kind, name, hook) {
  var orig = hook;
  if (!state.registry[name]) {
    state.registry[name] = [];
  }

  if (kind === 'before') {
    hook = function (method, options) {
      return Promise.resolve()
        .then(orig.bind(null, options))
        .then(method.bind(null, options))
    };
  }

  if (kind === 'after') {
    hook = function (method, options) {
      var result;
      return Promise.resolve()
        .then(method.bind(null, options))
        .then(function (result_) {
          result = result_;
          return orig(result, options)
        })
        .then(function () {
          return result
        })
    };
  }

  if (kind === 'error') {
    hook = function (method, options) {
      return Promise.resolve()
        .then(method.bind(null, options))
        .catch(function (error) {
          return orig(error, options)
        })
    };
  }

  state.registry[name].push({
    hook: hook,
    orig: orig
  });
}

var remove$2 = removeHook;

function removeHook (state, name, method) {
  if (!state.registry[name]) {
    return
  }

  var index = state.registry[name]
    .map(function (registered) { return registered.orig })
    .indexOf(method);

  if (index === -1) {
    return
  }

  state.registry[name].splice(index, 1);
}

// bind with array of arguments: https://stackoverflow.com/a/21792913
var bind = Function.bind;
var bindable = bind.bind(bind);

function bindApi (hook, state, name) {
  var removeHookRef = bindable(remove$2, null).apply(null, name ? [state, name] : [state]);
  hook.api = { remove: removeHookRef };
  hook.remove = removeHookRef

  ;['before', 'error', 'after', 'wrap'].forEach(function (kind) {
    var args = name ? [state, kind, name] : [state, kind];
    hook[kind] = hook.api[kind] = bindable(add, null).apply(null, args);
  });
}

function HookSingular () {
  var singularHookName = 'h';
  var singularHookState = {
    registry: {}
  };
  var singularHook = register_1.bind(null, singularHookState, singularHookName);
  bindApi(singularHook, singularHookState, singularHookName);
  return singularHook
}

function HookCollection () {
  var state = {
    registry: {}
  };

  var hook = register_1.bind(null, state);
  bindApi(hook, state);

  return hook
}

var collectionHookDeprecationMessageDisplayed = false;
function Hook () {
  if (!collectionHookDeprecationMessageDisplayed) {
    console.warn('[before-after-hook]: "Hook()" repurposing warning, use "Hook.Collection()". Read more: https://git.io/upgrade-before-after-hook-to-1.4');
    collectionHookDeprecationMessageDisplayed = true;
  }
  return HookCollection()
}

Hook.Singular = HookSingular.bind();
Hook.Collection = HookCollection.bind();

var beforeAfterHook = Hook;
// expose constructors as a named property for TypeScript
var Hook_1 = Hook;
var Singular = Hook.Singular;
var Collection = Hook.Collection;
beforeAfterHook.Hook = Hook_1;
beforeAfterHook.Singular = Singular;
beforeAfterHook.Collection = Collection;

/*!
 * is-plain-object <https://github.com/jonschlinkert/is-plain-object>
 *
 * Copyright (c) 2014-2017, Jon Schlinkert.
 * Released under the MIT License.
 */

function isObject(o) {
  return Object.prototype.toString.call(o) === '[object Object]';
}

function isPlainObject(o) {
  var ctor,prot;

  if (isObject(o) === false) return false;

  // If has modified constructor
  ctor = o.constructor;
  if (ctor === undefined) return true;

  // If has modified prototype
  prot = ctor.prototype;
  if (isObject(prot) === false) return false;

  // If constructor does not have an Object-specific method
  if (prot.hasOwnProperty('isPrototypeOf') === false) {
    return false;
  }

  // Most likely a plain Object
  return true;
}

function lowercaseKeys(object) {
    if (!object) {
        return {};
    }
    return Object.keys(object).reduce((newObj, key) => {
        newObj[key.toLowerCase()] = object[key];
        return newObj;
    }, {});
}

function mergeDeep(defaults, options) {
    const result = Object.assign({}, defaults);
    Object.keys(options).forEach((key) => {
        if (isPlainObject(options[key])) {
            if (!(key in defaults))
                Object.assign(result, { [key]: options[key] });
            else
                result[key] = mergeDeep(defaults[key], options[key]);
        }
        else {
            Object.assign(result, { [key]: options[key] });
        }
    });
    return result;
}

function merge(defaults, route, options) {
    if (typeof route === "string") {
        let [method, url] = route.split(" ");
        options = Object.assign(url ? { method, url } : { url: method }, options);
    }
    else {
        options = Object.assign({}, route);
    }
    // lowercase header names before merging with defaults to avoid duplicates
    options.headers = lowercaseKeys(options.headers);
    const mergedOptions = mergeDeep(defaults || {}, options);
    // mediaType.previews arrays are merged, instead of overwritten
    if (defaults && defaults.mediaType.previews.length) {
        mergedOptions.mediaType.previews = defaults.mediaType.previews
            .filter((preview) => !mergedOptions.mediaType.previews.includes(preview))
            .concat(mergedOptions.mediaType.previews);
    }
    mergedOptions.mediaType.previews = mergedOptions.mediaType.previews.map((preview) => preview.replace(/-preview/, ""));
    return mergedOptions;
}

function addQueryParameters(url, parameters) {
    const separator = /\?/.test(url) ? "&" : "?";
    const names = Object.keys(parameters);
    if (names.length === 0) {
        return url;
    }
    return (url +
        separator +
        names
            .map((name) => {
            if (name === "q") {
                return ("q=" + parameters.q.split("+").map(encodeURIComponent).join("+"));
            }
            return `${name}=${encodeURIComponent(parameters[name])}`;
        })
            .join("&"));
}

const urlVariableRegex = /\{[^}]+\}/g;
function removeNonChars(variableName) {
    return variableName.replace(/^\W+|\W+$/g, "").split(/,/);
}
function extractUrlVariableNames(url) {
    const matches = url.match(urlVariableRegex);
    if (!matches) {
        return [];
    }
    return matches.map(removeNonChars).reduce((a, b) => a.concat(b), []);
}

function omit(object, keysToOmit) {
    return Object.keys(object)
        .filter((option) => !keysToOmit.includes(option))
        .reduce((obj, key) => {
        obj[key] = object[key];
        return obj;
    }, {});
}

// Based on https://github.com/bramstein/url-template, licensed under BSD
// TODO: create separate package.
//
// Copyright (c) 2012-2014, Bram Stein
// All rights reserved.
// Redistribution and use in source and binary forms, with or without
// modification, are permitted provided that the following conditions
// are met:
//  1. Redistributions of source code must retain the above copyright
//     notice, this list of conditions and the following disclaimer.
//  2. Redistributions in binary form must reproduce the above copyright
//     notice, this list of conditions and the following disclaimer in the
//     documentation and/or other materials provided with the distribution.
//  3. The name of the author may not be used to endorse or promote products
//     derived from this software without specific prior written permission.
// THIS SOFTWARE IS PROVIDED BY THE AUTHOR "AS IS" AND ANY EXPRESS OR IMPLIED
// WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF
// MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO
// EVENT SHALL THE COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT,
// INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING,
// BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE,
// DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY
// OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
// NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE,
// EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
/* istanbul ignore file */
function encodeReserved(str) {
    return str
        .split(/(%[0-9A-Fa-f]{2})/g)
        .map(function (part) {
        if (!/%[0-9A-Fa-f]/.test(part)) {
            part = encodeURI(part).replace(/%5B/g, "[").replace(/%5D/g, "]");
        }
        return part;
    })
        .join("");
}
function encodeUnreserved(str) {
    return encodeURIComponent(str).replace(/[!'()*]/g, function (c) {
        return "%" + c.charCodeAt(0).toString(16).toUpperCase();
    });
}
function encodeValue(operator, value, key) {
    value =
        operator === "+" || operator === "#"
            ? encodeReserved(value)
            : encodeUnreserved(value);
    if (key) {
        return encodeUnreserved(key) + "=" + value;
    }
    else {
        return value;
    }
}
function isDefined(value) {
    return value !== undefined && value !== null;
}
function isKeyOperator(operator) {
    return operator === ";" || operator === "&" || operator === "?";
}
function getValues(context, operator, key, modifier) {
    var value = context[key], result = [];
    if (isDefined(value) && value !== "") {
        if (typeof value === "string" ||
            typeof value === "number" ||
            typeof value === "boolean") {
            value = value.toString();
            if (modifier && modifier !== "*") {
                value = value.substring(0, parseInt(modifier, 10));
            }
            result.push(encodeValue(operator, value, isKeyOperator(operator) ? key : ""));
        }
        else {
            if (modifier === "*") {
                if (Array.isArray(value)) {
                    value.filter(isDefined).forEach(function (value) {
                        result.push(encodeValue(operator, value, isKeyOperator(operator) ? key : ""));
                    });
                }
                else {
                    Object.keys(value).forEach(function (k) {
                        if (isDefined(value[k])) {
                            result.push(encodeValue(operator, value[k], k));
                        }
                    });
                }
            }
            else {
                const tmp = [];
                if (Array.isArray(value)) {
                    value.filter(isDefined).forEach(function (value) {
                        tmp.push(encodeValue(operator, value));
                    });
                }
                else {
                    Object.keys(value).forEach(function (k) {
                        if (isDefined(value[k])) {
                            tmp.push(encodeUnreserved(k));
                            tmp.push(encodeValue(operator, value[k].toString()));
                        }
                    });
                }
                if (isKeyOperator(operator)) {
                    result.push(encodeUnreserved(key) + "=" + tmp.join(","));
                }
                else if (tmp.length !== 0) {
                    result.push(tmp.join(","));
                }
            }
        }
    }
    else {
        if (operator === ";") {
            if (isDefined(value)) {
                result.push(encodeUnreserved(key));
            }
        }
        else if (value === "" && (operator === "&" || operator === "?")) {
            result.push(encodeUnreserved(key) + "=");
        }
        else if (value === "") {
            result.push("");
        }
    }
    return result;
}
function parseUrl(template) {
    return {
        expand: expand.bind(null, template),
    };
}
function expand(template, context) {
    var operators = ["+", "#", ".", "/", ";", "?", "&"];
    return template.replace(/\{([^\{\}]+)\}|([^\{\}]+)/g, function (_, expression, literal) {
        if (expression) {
            let operator = "";
            const values = [];
            if (operators.indexOf(expression.charAt(0)) !== -1) {
                operator = expression.charAt(0);
                expression = expression.substr(1);
            }
            expression.split(/,/g).forEach(function (variable) {
                var tmp = /([^:\*]*)(?::(\d+)|(\*))?/.exec(variable);
                values.push(getValues(context, operator, tmp[1], tmp[2] || tmp[3]));
            });
            if (operator && operator !== "+") {
                var separator = ",";
                if (operator === "?") {
                    separator = "&";
                }
                else if (operator !== "#") {
                    separator = operator;
                }
                return (values.length !== 0 ? operator : "") + values.join(separator);
            }
            else {
                return values.join(",");
            }
        }
        else {
            return encodeReserved(literal);
        }
    });
}

function parse$1(options) {
    // https://fetch.spec.whatwg.org/#methods
    let method = options.method.toUpperCase();
    // replace :varname with {varname} to make it RFC 6570 compatible
    let url = (options.url || "/").replace(/:([a-z]\w+)/g, "{+$1}");
    let headers = Object.assign({}, options.headers);
    let body;
    let parameters = omit(options, [
        "method",
        "baseUrl",
        "url",
        "headers",
        "request",
        "mediaType",
    ]);
    // extract variable names from URL to calculate remaining variables later
    const urlVariableNames = extractUrlVariableNames(url);
    url = parseUrl(url).expand(parameters);
    if (!/^http/.test(url)) {
        url = options.baseUrl + url;
    }
    const omittedParameters = Object.keys(options)
        .filter((option) => urlVariableNames.includes(option))
        .concat("baseUrl");
    const remainingParameters = omit(parameters, omittedParameters);
    const isBinaryRequest = /application\/octet-stream/i.test(headers.accept);
    if (!isBinaryRequest) {
        if (options.mediaType.format) {
            // e.g. application/vnd.github.v3+json => application/vnd.github.v3.raw
            headers.accept = headers.accept
                .split(/,/)
                .map((preview) => preview.replace(/application\/vnd(\.\w+)(\.v3)?(\.\w+)?(\+json)?$/, `application/vnd$1$2.${options.mediaType.format}`))
                .join(",");
        }
        if (options.mediaType.previews.length) {
            const previewsFromAcceptHeader = headers.accept.match(/[\w-]+(?=-preview)/g) || [];
            headers.accept = previewsFromAcceptHeader
                .concat(options.mediaType.previews)
                .map((preview) => {
                const format = options.mediaType.format
                    ? `.${options.mediaType.format}`
                    : "+json";
                return `application/vnd.github.${preview}-preview${format}`;
            })
                .join(",");
        }
    }
    // for GET/HEAD requests, set URL query parameters from remaining parameters
    // for PATCH/POST/PUT/DELETE requests, set request body from remaining parameters
    if (["GET", "HEAD"].includes(method)) {
        url = addQueryParameters(url, remainingParameters);
    }
    else {
        if ("data" in remainingParameters) {
            body = remainingParameters.data;
        }
        else {
            if (Object.keys(remainingParameters).length) {
                body = remainingParameters;
            }
            else {
                headers["content-length"] = 0;
            }
        }
    }
    // default content-type for JSON if body is set
    if (!headers["content-type"] && typeof body !== "undefined") {
        headers["content-type"] = "application/json; charset=utf-8";
    }
    // GitHub expects 'content-length: 0' header for PUT/PATCH requests without body.
    // fetch does not allow to set `content-length` header, but we can set body to an empty string
    if (["PATCH", "PUT"].includes(method) && typeof body === "undefined") {
        body = "";
    }
    // Only return body/request keys if present
    return Object.assign({ method, url, headers }, typeof body !== "undefined" ? { body } : null, options.request ? { request: options.request } : null);
}

function endpointWithDefaults(defaults, route, options) {
    return parse$1(merge(defaults, route, options));
}

function withDefaults(oldDefaults, newDefaults) {
    const DEFAULTS = merge(oldDefaults, newDefaults);
    const endpoint = endpointWithDefaults.bind(null, DEFAULTS);
    return Object.assign(endpoint, {
        DEFAULTS,
        defaults: withDefaults.bind(null, DEFAULTS),
        merge: merge.bind(null, DEFAULTS),
        parse: parse$1,
    });
}

const VERSION = "6.0.6";

const userAgent = `octokit-endpoint.js/${VERSION} ${getUserAgent()}`;
// DEFAULTS has all properties set that EndpointOptions has, except url.
// So we use RequestParameters and add method as additional required property.
const DEFAULTS = {
    method: "GET",
    baseUrl: "https://api.github.com",
    headers: {
        accept: "application/vnd.github.v3+json",
        "user-agent": userAgent,
    },
    mediaType: {
        format: "",
        previews: [],
    },
};

const endpoint = withDefaults(null, DEFAULTS);

// Based on https://github.com/tmpvar/jsdom/blob/aa85b2abf07766ff7bf5c1f6daafb3726f2f2db5/lib/jsdom/living/blob.js

// fix for "Readable" isn't a named export issue
const Readable = Stream__default['default'].Readable;

const BUFFER = Symbol('buffer');
const TYPE = Symbol('type');

class Blob {
	constructor() {
		this[TYPE] = '';

		const blobParts = arguments[0];
		const options = arguments[1];

		const buffers = [];
		let size = 0;

		if (blobParts) {
			const a = blobParts;
			const length = Number(a.length);
			for (let i = 0; i < length; i++) {
				const element = a[i];
				let buffer;
				if (element instanceof Buffer) {
					buffer = element;
				} else if (ArrayBuffer.isView(element)) {
					buffer = Buffer.from(element.buffer, element.byteOffset, element.byteLength);
				} else if (element instanceof ArrayBuffer) {
					buffer = Buffer.from(element);
				} else if (element instanceof Blob) {
					buffer = element[BUFFER];
				} else {
					buffer = Buffer.from(typeof element === 'string' ? element : String(element));
				}
				size += buffer.length;
				buffers.push(buffer);
			}
		}

		this[BUFFER] = Buffer.concat(buffers);

		let type = options && options.type !== undefined && String(options.type).toLowerCase();
		if (type && !/[^\u0020-\u007E]/.test(type)) {
			this[TYPE] = type;
		}
	}
	get size() {
		return this[BUFFER].length;
	}
	get type() {
		return this[TYPE];
	}
	text() {
		return Promise.resolve(this[BUFFER].toString());
	}
	arrayBuffer() {
		const buf = this[BUFFER];
		const ab = buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength);
		return Promise.resolve(ab);
	}
	stream() {
		const readable = new Readable();
		readable._read = function () {};
		readable.push(this[BUFFER]);
		readable.push(null);
		return readable;
	}
	toString() {
		return '[object Blob]';
	}
	slice() {
		const size = this.size;

		const start = arguments[0];
		const end = arguments[1];
		let relativeStart, relativeEnd;
		if (start === undefined) {
			relativeStart = 0;
		} else if (start < 0) {
			relativeStart = Math.max(size + start, 0);
		} else {
			relativeStart = Math.min(start, size);
		}
		if (end === undefined) {
			relativeEnd = size;
		} else if (end < 0) {
			relativeEnd = Math.max(size + end, 0);
		} else {
			relativeEnd = Math.min(end, size);
		}
		const span = Math.max(relativeEnd - relativeStart, 0);

		const buffer = this[BUFFER];
		const slicedBuffer = buffer.slice(relativeStart, relativeStart + span);
		const blob = new Blob([], { type: arguments[2] });
		blob[BUFFER] = slicedBuffer;
		return blob;
	}
}

Object.defineProperties(Blob.prototype, {
	size: { enumerable: true },
	type: { enumerable: true },
	slice: { enumerable: true }
});

Object.defineProperty(Blob.prototype, Symbol.toStringTag, {
	value: 'Blob',
	writable: false,
	enumerable: false,
	configurable: true
});

/**
 * fetch-error.js
 *
 * FetchError interface for operational errors
 */

/**
 * Create FetchError instance
 *
 * @param   String      message      Error message for human
 * @param   String      type         Error type for machine
 * @param   String      systemError  For Node.js system error
 * @return  FetchError
 */
function FetchError(message, type, systemError) {
  Error.call(this, message);

  this.message = message;
  this.type = type;

  // when err.type is `system`, err.code contains system error code
  if (systemError) {
    this.code = this.errno = systemError.code;
  }

  // hide custom error implementation details from end-users
  Error.captureStackTrace(this, this.constructor);
}

FetchError.prototype = Object.create(Error.prototype);
FetchError.prototype.constructor = FetchError;
FetchError.prototype.name = 'FetchError';

let convert;
try {
	convert = require('encoding').convert;
} catch (e) {}

const INTERNALS = Symbol('Body internals');

// fix an issue where "PassThrough" isn't a named export for node <10
const PassThrough$1 = Stream__default['default'].PassThrough;

/**
 * Body mixin
 *
 * Ref: https://fetch.spec.whatwg.org/#body
 *
 * @param   Stream  body  Readable stream
 * @param   Object  opts  Response options
 * @return  Void
 */
function Body(body) {
	var _this = this;

	var _ref = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
	    _ref$size = _ref.size;

	let size = _ref$size === undefined ? 0 : _ref$size;
	var _ref$timeout = _ref.timeout;
	let timeout = _ref$timeout === undefined ? 0 : _ref$timeout;

	if (body == null) {
		// body is undefined or null
		body = null;
	} else if (isURLSearchParams(body)) {
		// body is a URLSearchParams
		body = Buffer.from(body.toString());
	} else if (isBlob(body)) ; else if (Buffer.isBuffer(body)) ; else if (Object.prototype.toString.call(body) === '[object ArrayBuffer]') {
		// body is ArrayBuffer
		body = Buffer.from(body);
	} else if (ArrayBuffer.isView(body)) {
		// body is ArrayBufferView
		body = Buffer.from(body.buffer, body.byteOffset, body.byteLength);
	} else if (body instanceof Stream__default['default']) ; else {
		// none of the above
		// coerce to string then buffer
		body = Buffer.from(String(body));
	}
	this[INTERNALS] = {
		body,
		disturbed: false,
		error: null
	};
	this.size = size;
	this.timeout = timeout;

	if (body instanceof Stream__default['default']) {
		body.on('error', function (err) {
			const error = err.name === 'AbortError' ? err : new FetchError(`Invalid response body while trying to fetch ${_this.url}: ${err.message}`, 'system', err);
			_this[INTERNALS].error = error;
		});
	}
}

Body.prototype = {
	get body() {
		return this[INTERNALS].body;
	},

	get bodyUsed() {
		return this[INTERNALS].disturbed;
	},

	/**
  * Decode response as ArrayBuffer
  *
  * @return  Promise
  */
	arrayBuffer() {
		return consumeBody.call(this).then(function (buf) {
			return buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength);
		});
	},

	/**
  * Return raw response as Blob
  *
  * @return Promise
  */
	blob() {
		let ct = this.headers && this.headers.get('content-type') || '';
		return consumeBody.call(this).then(function (buf) {
			return Object.assign(
			// Prevent copying
			new Blob([], {
				type: ct.toLowerCase()
			}), {
				[BUFFER]: buf
			});
		});
	},

	/**
  * Decode response as json
  *
  * @return  Promise
  */
	json() {
		var _this2 = this;

		return consumeBody.call(this).then(function (buffer) {
			try {
				return JSON.parse(buffer.toString());
			} catch (err) {
				return Body.Promise.reject(new FetchError(`invalid json response body at ${_this2.url} reason: ${err.message}`, 'invalid-json'));
			}
		});
	},

	/**
  * Decode response as text
  *
  * @return  Promise
  */
	text() {
		return consumeBody.call(this).then(function (buffer) {
			return buffer.toString();
		});
	},

	/**
  * Decode response as buffer (non-spec api)
  *
  * @return  Promise
  */
	buffer() {
		return consumeBody.call(this);
	},

	/**
  * Decode response as text, while automatically detecting the encoding and
  * trying to decode to UTF-8 (non-spec api)
  *
  * @return  Promise
  */
	textConverted() {
		var _this3 = this;

		return consumeBody.call(this).then(function (buffer) {
			return convertBody(buffer, _this3.headers);
		});
	}
};

// In browsers, all properties are enumerable.
Object.defineProperties(Body.prototype, {
	body: { enumerable: true },
	bodyUsed: { enumerable: true },
	arrayBuffer: { enumerable: true },
	blob: { enumerable: true },
	json: { enumerable: true },
	text: { enumerable: true }
});

Body.mixIn = function (proto) {
	for (const name of Object.getOwnPropertyNames(Body.prototype)) {
		// istanbul ignore else: future proof
		if (!(name in proto)) {
			const desc = Object.getOwnPropertyDescriptor(Body.prototype, name);
			Object.defineProperty(proto, name, desc);
		}
	}
};

/**
 * Consume and convert an entire Body to a Buffer.
 *
 * Ref: https://fetch.spec.whatwg.org/#concept-body-consume-body
 *
 * @return  Promise
 */
function consumeBody() {
	var _this4 = this;

	if (this[INTERNALS].disturbed) {
		return Body.Promise.reject(new TypeError(`body used already for: ${this.url}`));
	}

	this[INTERNALS].disturbed = true;

	if (this[INTERNALS].error) {
		return Body.Promise.reject(this[INTERNALS].error);
	}

	let body = this.body;

	// body is null
	if (body === null) {
		return Body.Promise.resolve(Buffer.alloc(0));
	}

	// body is blob
	if (isBlob(body)) {
		body = body.stream();
	}

	// body is buffer
	if (Buffer.isBuffer(body)) {
		return Body.Promise.resolve(body);
	}

	// istanbul ignore if: should never happen
	if (!(body instanceof Stream__default['default'])) {
		return Body.Promise.resolve(Buffer.alloc(0));
	}

	// body is stream
	// get ready to actually consume the body
	let accum = [];
	let accumBytes = 0;
	let abort = false;

	return new Body.Promise(function (resolve, reject) {
		let resTimeout;

		// allow timeout on slow response body
		if (_this4.timeout) {
			resTimeout = setTimeout(function () {
				abort = true;
				reject(new FetchError(`Response timeout while trying to fetch ${_this4.url} (over ${_this4.timeout}ms)`, 'body-timeout'));
			}, _this4.timeout);
		}

		// handle stream errors
		body.on('error', function (err) {
			if (err.name === 'AbortError') {
				// if the request was aborted, reject with this Error
				abort = true;
				reject(err);
			} else {
				// other errors, such as incorrect content-encoding
				reject(new FetchError(`Invalid response body while trying to fetch ${_this4.url}: ${err.message}`, 'system', err));
			}
		});

		body.on('data', function (chunk) {
			if (abort || chunk === null) {
				return;
			}

			if (_this4.size && accumBytes + chunk.length > _this4.size) {
				abort = true;
				reject(new FetchError(`content size at ${_this4.url} over limit: ${_this4.size}`, 'max-size'));
				return;
			}

			accumBytes += chunk.length;
			accum.push(chunk);
		});

		body.on('end', function () {
			if (abort) {
				return;
			}

			clearTimeout(resTimeout);

			try {
				resolve(Buffer.concat(accum, accumBytes));
			} catch (err) {
				// handle streams that have accumulated too much data (issue #414)
				reject(new FetchError(`Could not create Buffer from response body for ${_this4.url}: ${err.message}`, 'system', err));
			}
		});
	});
}

/**
 * Detect buffer encoding and convert to target encoding
 * ref: http://www.w3.org/TR/2011/WD-html5-20110113/parsing.html#determining-the-character-encoding
 *
 * @param   Buffer  buffer    Incoming buffer
 * @param   String  encoding  Target encoding
 * @return  String
 */
function convertBody(buffer, headers) {
	if (typeof convert !== 'function') {
		throw new Error('The package `encoding` must be installed to use the textConverted() function');
	}

	const ct = headers.get('content-type');
	let charset = 'utf-8';
	let res, str;

	// header
	if (ct) {
		res = /charset=([^;]*)/i.exec(ct);
	}

	// no charset in content type, peek at response body for at most 1024 bytes
	str = buffer.slice(0, 1024).toString();

	// html5
	if (!res && str) {
		res = /<meta.+?charset=(['"])(.+?)\1/i.exec(str);
	}

	// html4
	if (!res && str) {
		res = /<meta[\s]+?http-equiv=(['"])content-type\1[\s]+?content=(['"])(.+?)\2/i.exec(str);
		if (!res) {
			res = /<meta[\s]+?content=(['"])(.+?)\1[\s]+?http-equiv=(['"])content-type\3/i.exec(str);
			if (res) {
				res.pop(); // drop last quote
			}
		}

		if (res) {
			res = /charset=(.*)/i.exec(res.pop());
		}
	}

	// xml
	if (!res && str) {
		res = /<\?xml.+?encoding=(['"])(.+?)\1/i.exec(str);
	}

	// found charset
	if (res) {
		charset = res.pop();

		// prevent decode issues when sites use incorrect encoding
		// ref: https://hsivonen.fi/encoding-menu/
		if (charset === 'gb2312' || charset === 'gbk') {
			charset = 'gb18030';
		}
	}

	// turn raw buffers into a single utf-8 buffer
	return convert(buffer, 'UTF-8', charset).toString();
}

/**
 * Detect a URLSearchParams object
 * ref: https://github.com/bitinn/node-fetch/issues/296#issuecomment-307598143
 *
 * @param   Object  obj     Object to detect by type or brand
 * @return  String
 */
function isURLSearchParams(obj) {
	// Duck-typing as a necessary condition.
	if (typeof obj !== 'object' || typeof obj.append !== 'function' || typeof obj.delete !== 'function' || typeof obj.get !== 'function' || typeof obj.getAll !== 'function' || typeof obj.has !== 'function' || typeof obj.set !== 'function') {
		return false;
	}

	// Brand-checking and more duck-typing as optional condition.
	return obj.constructor.name === 'URLSearchParams' || Object.prototype.toString.call(obj) === '[object URLSearchParams]' || typeof obj.sort === 'function';
}

/**
 * Check if `obj` is a W3C `Blob` object (which `File` inherits from)
 * @param  {*} obj
 * @return {boolean}
 */
function isBlob(obj) {
	return typeof obj === 'object' && typeof obj.arrayBuffer === 'function' && typeof obj.type === 'string' && typeof obj.stream === 'function' && typeof obj.constructor === 'function' && typeof obj.constructor.name === 'string' && /^(Blob|File)$/.test(obj.constructor.name) && /^(Blob|File)$/.test(obj[Symbol.toStringTag]);
}

/**
 * Clone body given Res/Req instance
 *
 * @param   Mixed  instance  Response or Request instance
 * @return  Mixed
 */
function clone$1(instance) {
	let p1, p2;
	let body = instance.body;

	// don't allow cloning a used body
	if (instance.bodyUsed) {
		throw new Error('cannot clone body after it is used');
	}

	// check that body is a stream and not form-data object
	// note: we can't clone the form-data object without having it as a dependency
	if (body instanceof Stream__default['default'] && typeof body.getBoundary !== 'function') {
		// tee instance body
		p1 = new PassThrough$1();
		p2 = new PassThrough$1();
		body.pipe(p1);
		body.pipe(p2);
		// set instance body to teed body and return the other teed body
		instance[INTERNALS].body = p1;
		body = p2;
	}

	return body;
}

/**
 * Performs the operation "extract a `Content-Type` value from |object|" as
 * specified in the specification:
 * https://fetch.spec.whatwg.org/#concept-bodyinit-extract
 *
 * This function assumes that instance.body is present.
 *
 * @param   Mixed  instance  Any options.body input
 */
function extractContentType(body) {
	if (body === null) {
		// body is null
		return null;
	} else if (typeof body === 'string') {
		// body is string
		return 'text/plain;charset=UTF-8';
	} else if (isURLSearchParams(body)) {
		// body is a URLSearchParams
		return 'application/x-www-form-urlencoded;charset=UTF-8';
	} else if (isBlob(body)) {
		// body is blob
		return body.type || null;
	} else if (Buffer.isBuffer(body)) {
		// body is buffer
		return null;
	} else if (Object.prototype.toString.call(body) === '[object ArrayBuffer]') {
		// body is ArrayBuffer
		return null;
	} else if (ArrayBuffer.isView(body)) {
		// body is ArrayBufferView
		return null;
	} else if (typeof body.getBoundary === 'function') {
		// detect form data input from form-data module
		return `multipart/form-data;boundary=${body.getBoundary()}`;
	} else if (body instanceof Stream__default['default']) {
		// body is stream
		// can't really do much about this
		return null;
	} else {
		// Body constructor defaults other things to string
		return 'text/plain;charset=UTF-8';
	}
}

/**
 * The Fetch Standard treats this as if "total bytes" is a property on the body.
 * For us, we have to explicitly get it with a function.
 *
 * ref: https://fetch.spec.whatwg.org/#concept-body-total-bytes
 *
 * @param   Body    instance   Instance of Body
 * @return  Number?            Number of bytes, or null if not possible
 */
function getTotalBytes(instance) {
	const body = instance.body;


	if (body === null) {
		// body is null
		return 0;
	} else if (isBlob(body)) {
		return body.size;
	} else if (Buffer.isBuffer(body)) {
		// body is buffer
		return body.length;
	} else if (body && typeof body.getLengthSync === 'function') {
		// detect form data input from form-data module
		if (body._lengthRetrievers && body._lengthRetrievers.length == 0 || // 1.x
		body.hasKnownLength && body.hasKnownLength()) {
			// 2.x
			return body.getLengthSync();
		}
		return null;
	} else {
		// body is stream
		return null;
	}
}

/**
 * Write a Body to a Node.js WritableStream (e.g. http.Request) object.
 *
 * @param   Body    instance   Instance of Body
 * @return  Void
 */
function writeToStream(dest, instance) {
	const body = instance.body;


	if (body === null) {
		// body is null
		dest.end();
	} else if (isBlob(body)) {
		body.stream().pipe(dest);
	} else if (Buffer.isBuffer(body)) {
		// body is buffer
		dest.write(body);
		dest.end();
	} else {
		// body is stream
		body.pipe(dest);
	}
}

// expose Promise
Body.Promise = global.Promise;

/**
 * headers.js
 *
 * Headers class offers convenient helpers
 */

const invalidTokenRegex = /[^\^_`a-zA-Z\-0-9!#$%&'*+.|~]/;
const invalidHeaderCharRegex = /[^\t\x20-\x7e\x80-\xff]/;

function validateName(name) {
	name = `${name}`;
	if (invalidTokenRegex.test(name) || name === '') {
		throw new TypeError(`${name} is not a legal HTTP header name`);
	}
}

function validateValue(value) {
	value = `${value}`;
	if (invalidHeaderCharRegex.test(value)) {
		throw new TypeError(`${value} is not a legal HTTP header value`);
	}
}

/**
 * Find the key in the map object given a header name.
 *
 * Returns undefined if not found.
 *
 * @param   String  name  Header name
 * @return  String|Undefined
 */
function find(map, name) {
	name = name.toLowerCase();
	for (const key in map) {
		if (key.toLowerCase() === name) {
			return key;
		}
	}
	return undefined;
}

const MAP = Symbol('map');
class Headers {
	/**
  * Headers class
  *
  * @param   Object  headers  Response headers
  * @return  Void
  */
	constructor() {
		let init = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : undefined;

		this[MAP] = Object.create(null);

		if (init instanceof Headers) {
			const rawHeaders = init.raw();
			const headerNames = Object.keys(rawHeaders);

			for (const headerName of headerNames) {
				for (const value of rawHeaders[headerName]) {
					this.append(headerName, value);
				}
			}

			return;
		}

		// We don't worry about converting prop to ByteString here as append()
		// will handle it.
		if (init == null) ; else if (typeof init === 'object') {
			const method = init[Symbol.iterator];
			if (method != null) {
				if (typeof method !== 'function') {
					throw new TypeError('Header pairs must be iterable');
				}

				// sequence<sequence<ByteString>>
				// Note: per spec we have to first exhaust the lists then process them
				const pairs = [];
				for (const pair of init) {
					if (typeof pair !== 'object' || typeof pair[Symbol.iterator] !== 'function') {
						throw new TypeError('Each header pair must be iterable');
					}
					pairs.push(Array.from(pair));
				}

				for (const pair of pairs) {
					if (pair.length !== 2) {
						throw new TypeError('Each header pair must be a name/value tuple');
					}
					this.append(pair[0], pair[1]);
				}
			} else {
				// record<ByteString, ByteString>
				for (const key of Object.keys(init)) {
					const value = init[key];
					this.append(key, value);
				}
			}
		} else {
			throw new TypeError('Provided initializer must be an object');
		}
	}

	/**
  * Return combined header value given name
  *
  * @param   String  name  Header name
  * @return  Mixed
  */
	get(name) {
		name = `${name}`;
		validateName(name);
		const key = find(this[MAP], name);
		if (key === undefined) {
			return null;
		}

		return this[MAP][key].join(', ');
	}

	/**
  * Iterate over all headers
  *
  * @param   Function  callback  Executed for each item with parameters (value, name, thisArg)
  * @param   Boolean   thisArg   `this` context for callback function
  * @return  Void
  */
	forEach(callback) {
		let thisArg = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : undefined;

		let pairs = getHeaders(this);
		let i = 0;
		while (i < pairs.length) {
			var _pairs$i = pairs[i];
			const name = _pairs$i[0],
			      value = _pairs$i[1];

			callback.call(thisArg, value, name, this);
			pairs = getHeaders(this);
			i++;
		}
	}

	/**
  * Overwrite header values given name
  *
  * @param   String  name   Header name
  * @param   String  value  Header value
  * @return  Void
  */
	set(name, value) {
		name = `${name}`;
		value = `${value}`;
		validateName(name);
		validateValue(value);
		const key = find(this[MAP], name);
		this[MAP][key !== undefined ? key : name] = [value];
	}

	/**
  * Append a value onto existing header
  *
  * @param   String  name   Header name
  * @param   String  value  Header value
  * @return  Void
  */
	append(name, value) {
		name = `${name}`;
		value = `${value}`;
		validateName(name);
		validateValue(value);
		const key = find(this[MAP], name);
		if (key !== undefined) {
			this[MAP][key].push(value);
		} else {
			this[MAP][name] = [value];
		}
	}

	/**
  * Check for header name existence
  *
  * @param   String   name  Header name
  * @return  Boolean
  */
	has(name) {
		name = `${name}`;
		validateName(name);
		return find(this[MAP], name) !== undefined;
	}

	/**
  * Delete all header values given name
  *
  * @param   String  name  Header name
  * @return  Void
  */
	delete(name) {
		name = `${name}`;
		validateName(name);
		const key = find(this[MAP], name);
		if (key !== undefined) {
			delete this[MAP][key];
		}
	}

	/**
  * Return raw headers (non-spec api)
  *
  * @return  Object
  */
	raw() {
		return this[MAP];
	}

	/**
  * Get an iterator on keys.
  *
  * @return  Iterator
  */
	keys() {
		return createHeadersIterator(this, 'key');
	}

	/**
  * Get an iterator on values.
  *
  * @return  Iterator
  */
	values() {
		return createHeadersIterator(this, 'value');
	}

	/**
  * Get an iterator on entries.
  *
  * This is the default iterator of the Headers object.
  *
  * @return  Iterator
  */
	[Symbol.iterator]() {
		return createHeadersIterator(this, 'key+value');
	}
}
Headers.prototype.entries = Headers.prototype[Symbol.iterator];

Object.defineProperty(Headers.prototype, Symbol.toStringTag, {
	value: 'Headers',
	writable: false,
	enumerable: false,
	configurable: true
});

Object.defineProperties(Headers.prototype, {
	get: { enumerable: true },
	forEach: { enumerable: true },
	set: { enumerable: true },
	append: { enumerable: true },
	has: { enumerable: true },
	delete: { enumerable: true },
	keys: { enumerable: true },
	values: { enumerable: true },
	entries: { enumerable: true }
});

function getHeaders(headers) {
	let kind = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'key+value';

	const keys = Object.keys(headers[MAP]).sort();
	return keys.map(kind === 'key' ? function (k) {
		return k.toLowerCase();
	} : kind === 'value' ? function (k) {
		return headers[MAP][k].join(', ');
	} : function (k) {
		return [k.toLowerCase(), headers[MAP][k].join(', ')];
	});
}

const INTERNAL = Symbol('internal');

function createHeadersIterator(target, kind) {
	const iterator = Object.create(HeadersIteratorPrototype);
	iterator[INTERNAL] = {
		target,
		kind,
		index: 0
	};
	return iterator;
}

const HeadersIteratorPrototype = Object.setPrototypeOf({
	next() {
		// istanbul ignore if
		if (!this || Object.getPrototypeOf(this) !== HeadersIteratorPrototype) {
			throw new TypeError('Value of `this` is not a HeadersIterator');
		}

		var _INTERNAL = this[INTERNAL];
		const target = _INTERNAL.target,
		      kind = _INTERNAL.kind,
		      index = _INTERNAL.index;

		const values = getHeaders(target, kind);
		const len = values.length;
		if (index >= len) {
			return {
				value: undefined,
				done: true
			};
		}

		this[INTERNAL].index = index + 1;

		return {
			value: values[index],
			done: false
		};
	}
}, Object.getPrototypeOf(Object.getPrototypeOf([][Symbol.iterator]())));

Object.defineProperty(HeadersIteratorPrototype, Symbol.toStringTag, {
	value: 'HeadersIterator',
	writable: false,
	enumerable: false,
	configurable: true
});

/**
 * Export the Headers object in a form that Node.js can consume.
 *
 * @param   Headers  headers
 * @return  Object
 */
function exportNodeCompatibleHeaders(headers) {
	const obj = Object.assign({ __proto__: null }, headers[MAP]);

	// http.request() only supports string as Host header. This hack makes
	// specifying custom Host header possible.
	const hostHeaderKey = find(headers[MAP], 'Host');
	if (hostHeaderKey !== undefined) {
		obj[hostHeaderKey] = obj[hostHeaderKey][0];
	}

	return obj;
}

/**
 * Create a Headers object from an object of headers, ignoring those that do
 * not conform to HTTP grammar productions.
 *
 * @param   Object  obj  Object of headers
 * @return  Headers
 */
function createHeadersLenient(obj) {
	const headers = new Headers();
	for (const name of Object.keys(obj)) {
		if (invalidTokenRegex.test(name)) {
			continue;
		}
		if (Array.isArray(obj[name])) {
			for (const val of obj[name]) {
				if (invalidHeaderCharRegex.test(val)) {
					continue;
				}
				if (headers[MAP][name] === undefined) {
					headers[MAP][name] = [val];
				} else {
					headers[MAP][name].push(val);
				}
			}
		} else if (!invalidHeaderCharRegex.test(obj[name])) {
			headers[MAP][name] = [obj[name]];
		}
	}
	return headers;
}

const INTERNALS$1 = Symbol('Response internals');

// fix an issue where "STATUS_CODES" aren't a named export for node <10
const STATUS_CODES = http__default['default'].STATUS_CODES;

/**
 * Response class
 *
 * @param   Stream  body  Readable stream
 * @param   Object  opts  Response options
 * @return  Void
 */
class Response {
	constructor() {
		let body = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
		let opts = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

		Body.call(this, body, opts);

		const status = opts.status || 200;
		const headers = new Headers(opts.headers);

		if (body != null && !headers.has('Content-Type')) {
			const contentType = extractContentType(body);
			if (contentType) {
				headers.append('Content-Type', contentType);
			}
		}

		this[INTERNALS$1] = {
			url: opts.url,
			status,
			statusText: opts.statusText || STATUS_CODES[status],
			headers,
			counter: opts.counter
		};
	}

	get url() {
		return this[INTERNALS$1].url || '';
	}

	get status() {
		return this[INTERNALS$1].status;
	}

	/**
  * Convenience property representing if the request ended normally
  */
	get ok() {
		return this[INTERNALS$1].status >= 200 && this[INTERNALS$1].status < 300;
	}

	get redirected() {
		return this[INTERNALS$1].counter > 0;
	}

	get statusText() {
		return this[INTERNALS$1].statusText;
	}

	get headers() {
		return this[INTERNALS$1].headers;
	}

	/**
  * Clone this response
  *
  * @return  Response
  */
	clone() {
		return new Response(clone$1(this), {
			url: this.url,
			status: this.status,
			statusText: this.statusText,
			headers: this.headers,
			ok: this.ok,
			redirected: this.redirected
		});
	}
}

Body.mixIn(Response.prototype);

Object.defineProperties(Response.prototype, {
	url: { enumerable: true },
	status: { enumerable: true },
	ok: { enumerable: true },
	redirected: { enumerable: true },
	statusText: { enumerable: true },
	headers: { enumerable: true },
	clone: { enumerable: true }
});

Object.defineProperty(Response.prototype, Symbol.toStringTag, {
	value: 'Response',
	writable: false,
	enumerable: false,
	configurable: true
});

const INTERNALS$2 = Symbol('Request internals');

// fix an issue where "format", "parse" aren't a named export for node <10
const parse_url = url__default['default'].parse;
const format_url = url__default['default'].format;

const streamDestructionSupported = 'destroy' in Stream__default['default'].Readable.prototype;

/**
 * Check if a value is an instance of Request.
 *
 * @param   Mixed   input
 * @return  Boolean
 */
function isRequest$2(input) {
	return typeof input === 'object' && typeof input[INTERNALS$2] === 'object';
}

function isAbortSignal(signal) {
	const proto = signal && typeof signal === 'object' && Object.getPrototypeOf(signal);
	return !!(proto && proto.constructor.name === 'AbortSignal');
}

/**
 * Request class
 *
 * @param   Mixed   input  Url or Request instance
 * @param   Object  init   Custom options
 * @return  Void
 */
class Request {
	constructor(input) {
		let init = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

		let parsedURL;

		// normalize input
		if (!isRequest$2(input)) {
			if (input && input.href) {
				// in order to support Node.js' Url objects; though WHATWG's URL objects
				// will fall into this branch also (since their `toString()` will return
				// `href` property anyway)
				parsedURL = parse_url(input.href);
			} else {
				// coerce input to a string before attempting to parse
				parsedURL = parse_url(`${input}`);
			}
			input = {};
		} else {
			parsedURL = parse_url(input.url);
		}

		let method = init.method || input.method || 'GET';
		method = method.toUpperCase();

		if ((init.body != null || isRequest$2(input) && input.body !== null) && (method === 'GET' || method === 'HEAD')) {
			throw new TypeError('Request with GET/HEAD method cannot have body');
		}

		let inputBody = init.body != null ? init.body : isRequest$2(input) && input.body !== null ? clone$1(input) : null;

		Body.call(this, inputBody, {
			timeout: init.timeout || input.timeout || 0,
			size: init.size || input.size || 0
		});

		const headers = new Headers(init.headers || input.headers || {});

		if (inputBody != null && !headers.has('Content-Type')) {
			const contentType = extractContentType(inputBody);
			if (contentType) {
				headers.append('Content-Type', contentType);
			}
		}

		let signal = isRequest$2(input) ? input.signal : null;
		if ('signal' in init) signal = init.signal;

		if (signal != null && !isAbortSignal(signal)) {
			throw new TypeError('Expected signal to be an instanceof AbortSignal');
		}

		this[INTERNALS$2] = {
			method,
			redirect: init.redirect || input.redirect || 'follow',
			headers,
			parsedURL,
			signal
		};

		// node-fetch-only options
		this.follow = init.follow !== undefined ? init.follow : input.follow !== undefined ? input.follow : 20;
		this.compress = init.compress !== undefined ? init.compress : input.compress !== undefined ? input.compress : true;
		this.counter = init.counter || input.counter || 0;
		this.agent = init.agent || input.agent;
	}

	get method() {
		return this[INTERNALS$2].method;
	}

	get url() {
		return format_url(this[INTERNALS$2].parsedURL);
	}

	get headers() {
		return this[INTERNALS$2].headers;
	}

	get redirect() {
		return this[INTERNALS$2].redirect;
	}

	get signal() {
		return this[INTERNALS$2].signal;
	}

	/**
  * Clone this request
  *
  * @return  Request
  */
	clone() {
		return new Request(this);
	}
}

Body.mixIn(Request.prototype);

Object.defineProperty(Request.prototype, Symbol.toStringTag, {
	value: 'Request',
	writable: false,
	enumerable: false,
	configurable: true
});

Object.defineProperties(Request.prototype, {
	method: { enumerable: true },
	url: { enumerable: true },
	headers: { enumerable: true },
	redirect: { enumerable: true },
	clone: { enumerable: true },
	signal: { enumerable: true }
});

/**
 * Convert a Request to Node.js http request options.
 *
 * @param   Request  A Request instance
 * @return  Object   The options object to be passed to http.request
 */
function getNodeRequestOptions(request) {
	const parsedURL = request[INTERNALS$2].parsedURL;
	const headers = new Headers(request[INTERNALS$2].headers);

	// fetch step 1.3
	if (!headers.has('Accept')) {
		headers.set('Accept', '*/*');
	}

	// Basic fetch
	if (!parsedURL.protocol || !parsedURL.hostname) {
		throw new TypeError('Only absolute URLs are supported');
	}

	if (!/^https?:$/.test(parsedURL.protocol)) {
		throw new TypeError('Only HTTP(S) protocols are supported');
	}

	if (request.signal && request.body instanceof Stream__default['default'].Readable && !streamDestructionSupported) {
		throw new Error('Cancellation of streamed requests with AbortSignal is not supported in node < 8');
	}

	// HTTP-network-or-cache fetch steps 2.4-2.7
	let contentLengthValue = null;
	if (request.body == null && /^(POST|PUT)$/i.test(request.method)) {
		contentLengthValue = '0';
	}
	if (request.body != null) {
		const totalBytes = getTotalBytes(request);
		if (typeof totalBytes === 'number') {
			contentLengthValue = String(totalBytes);
		}
	}
	if (contentLengthValue) {
		headers.set('Content-Length', contentLengthValue);
	}

	// HTTP-network-or-cache fetch step 2.11
	if (!headers.has('User-Agent')) {
		headers.set('User-Agent', 'node-fetch/1.0 (+https://github.com/bitinn/node-fetch)');
	}

	// HTTP-network-or-cache fetch step 2.15
	if (request.compress && !headers.has('Accept-Encoding')) {
		headers.set('Accept-Encoding', 'gzip,deflate');
	}

	let agent = request.agent;
	if (typeof agent === 'function') {
		agent = agent(parsedURL);
	}

	if (!headers.has('Connection') && !agent) {
		headers.set('Connection', 'close');
	}

	// HTTP-network fetch step 4.2
	// chunked encoding is handled by Node.js

	return Object.assign({}, parsedURL, {
		method: request.method,
		headers: exportNodeCompatibleHeaders(headers),
		agent
	});
}

/**
 * abort-error.js
 *
 * AbortError interface for cancelled requests
 */

/**
 * Create AbortError instance
 *
 * @param   String      message      Error message for human
 * @return  AbortError
 */
function AbortError(message) {
  Error.call(this, message);

  this.type = 'aborted';
  this.message = message;

  // hide custom error implementation details from end-users
  Error.captureStackTrace(this, this.constructor);
}

AbortError.prototype = Object.create(Error.prototype);
AbortError.prototype.constructor = AbortError;
AbortError.prototype.name = 'AbortError';

// fix an issue where "PassThrough", "resolve" aren't a named export for node <10
const PassThrough$1$1 = Stream__default['default'].PassThrough;
const resolve_url = url__default['default'].resolve;

/**
 * Fetch function
 *
 * @param   Mixed    url   Absolute url or Request instance
 * @param   Object   opts  Fetch options
 * @return  Promise
 */
function fetch(url, opts) {

	// allow custom promise
	if (!fetch.Promise) {
		throw new Error('native promise missing, set fetch.Promise to your favorite alternative');
	}

	Body.Promise = fetch.Promise;

	// wrap http.request into fetch
	return new fetch.Promise(function (resolve, reject) {
		// build request object
		const request = new Request(url, opts);
		const options = getNodeRequestOptions(request);

		const send = (options.protocol === 'https:' ? https__default['default'] : http__default['default']).request;
		const signal = request.signal;

		let response = null;

		const abort = function abort() {
			let error = new AbortError('The user aborted a request.');
			reject(error);
			if (request.body && request.body instanceof Stream__default['default'].Readable) {
				request.body.destroy(error);
			}
			if (!response || !response.body) return;
			response.body.emit('error', error);
		};

		if (signal && signal.aborted) {
			abort();
			return;
		}

		const abortAndFinalize = function abortAndFinalize() {
			abort();
			finalize();
		};

		// send request
		const req = send(options);
		let reqTimeout;

		if (signal) {
			signal.addEventListener('abort', abortAndFinalize);
		}

		function finalize() {
			req.abort();
			if (signal) signal.removeEventListener('abort', abortAndFinalize);
			clearTimeout(reqTimeout);
		}

		if (request.timeout) {
			req.once('socket', function (socket) {
				reqTimeout = setTimeout(function () {
					reject(new FetchError(`network timeout at: ${request.url}`, 'request-timeout'));
					finalize();
				}, request.timeout);
			});
		}

		req.on('error', function (err) {
			reject(new FetchError(`request to ${request.url} failed, reason: ${err.message}`, 'system', err));
			finalize();
		});

		req.on('response', function (res) {
			clearTimeout(reqTimeout);

			const headers = createHeadersLenient(res.headers);

			// HTTP fetch step 5
			if (fetch.isRedirect(res.statusCode)) {
				// HTTP fetch step 5.2
				const location = headers.get('Location');

				// HTTP fetch step 5.3
				const locationURL = location === null ? null : resolve_url(request.url, location);

				// HTTP fetch step 5.5
				switch (request.redirect) {
					case 'error':
						reject(new FetchError(`uri requested responds with a redirect, redirect mode is set to error: ${request.url}`, 'no-redirect'));
						finalize();
						return;
					case 'manual':
						// node-fetch-specific step: make manual redirect a bit easier to use by setting the Location header value to the resolved URL.
						if (locationURL !== null) {
							// handle corrupted header
							try {
								headers.set('Location', locationURL);
							} catch (err) {
								// istanbul ignore next: nodejs server prevent invalid response headers, we can't test this through normal request
								reject(err);
							}
						}
						break;
					case 'follow':
						// HTTP-redirect fetch step 2
						if (locationURL === null) {
							break;
						}

						// HTTP-redirect fetch step 5
						if (request.counter >= request.follow) {
							reject(new FetchError(`maximum redirect reached at: ${request.url}`, 'max-redirect'));
							finalize();
							return;
						}

						// HTTP-redirect fetch step 6 (counter increment)
						// Create a new Request object.
						const requestOpts = {
							headers: new Headers(request.headers),
							follow: request.follow,
							counter: request.counter + 1,
							agent: request.agent,
							compress: request.compress,
							method: request.method,
							body: request.body,
							signal: request.signal,
							timeout: request.timeout,
							size: request.size
						};

						// HTTP-redirect fetch step 9
						if (res.statusCode !== 303 && request.body && getTotalBytes(request) === null) {
							reject(new FetchError('Cannot follow redirect with body being a readable stream', 'unsupported-redirect'));
							finalize();
							return;
						}

						// HTTP-redirect fetch step 11
						if (res.statusCode === 303 || (res.statusCode === 301 || res.statusCode === 302) && request.method === 'POST') {
							requestOpts.method = 'GET';
							requestOpts.body = undefined;
							requestOpts.headers.delete('content-length');
						}

						// HTTP-redirect fetch step 15
						resolve(fetch(new Request(locationURL, requestOpts)));
						finalize();
						return;
				}
			}

			// prepare response
			res.once('end', function () {
				if (signal) signal.removeEventListener('abort', abortAndFinalize);
			});
			let body = res.pipe(new PassThrough$1$1());

			const response_options = {
				url: request.url,
				status: res.statusCode,
				statusText: res.statusMessage,
				headers: headers,
				size: request.size,
				timeout: request.timeout,
				counter: request.counter
			};

			// HTTP-network fetch step 12.1.1.3
			const codings = headers.get('Content-Encoding');

			// HTTP-network fetch step 12.1.1.4: handle content codings

			// in following scenarios we ignore compression support
			// 1. compression support is disabled
			// 2. HEAD request
			// 3. no Content-Encoding header
			// 4. no content response (204)
			// 5. content not modified response (304)
			if (!request.compress || request.method === 'HEAD' || codings === null || res.statusCode === 204 || res.statusCode === 304) {
				response = new Response(body, response_options);
				resolve(response);
				return;
			}

			// For Node v6+
			// Be less strict when decoding compressed responses, since sometimes
			// servers send slightly invalid responses that are still accepted
			// by common browsers.
			// Always using Z_SYNC_FLUSH is what cURL does.
			const zlibOptions = {
				flush: zlib__default['default'].Z_SYNC_FLUSH,
				finishFlush: zlib__default['default'].Z_SYNC_FLUSH
			};

			// for gzip
			if (codings == 'gzip' || codings == 'x-gzip') {
				body = body.pipe(zlib__default['default'].createGunzip(zlibOptions));
				response = new Response(body, response_options);
				resolve(response);
				return;
			}

			// for deflate
			if (codings == 'deflate' || codings == 'x-deflate') {
				// handle the infamous raw deflate response from old servers
				// a hack for old IIS and Apache servers
				const raw = res.pipe(new PassThrough$1$1());
				raw.once('data', function (chunk) {
					// see http://stackoverflow.com/questions/37519828
					if ((chunk[0] & 0x0F) === 0x08) {
						body = body.pipe(zlib__default['default'].createInflate());
					} else {
						body = body.pipe(zlib__default['default'].createInflateRaw());
					}
					response = new Response(body, response_options);
					resolve(response);
				});
				return;
			}

			// for br
			if (codings == 'br' && typeof zlib__default['default'].createBrotliDecompress === 'function') {
				body = body.pipe(zlib__default['default'].createBrotliDecompress());
				response = new Response(body, response_options);
				resolve(response);
				return;
			}

			// otherwise, use response as-is
			response = new Response(body, response_options);
			resolve(response);
		});

		writeToStream(req, request);
	});
}
/**
 * Redirect code matching
 *
 * @param   Number   code  Status code
 * @return  Boolean
 */
fetch.isRedirect = function (code) {
	return code === 301 || code === 302 || code === 303 || code === 307 || code === 308;
};

// expose Promise
fetch.Promise = global.Promise;

class Deprecation extends Error {
  constructor(message) {
    super(message); // Maintains proper stack trace (only available on V8)

    /* istanbul ignore next */

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }

    this.name = 'Deprecation';
  }

}

var distWeb = /*#__PURE__*/Object.freeze({
	__proto__: null,
	Deprecation: Deprecation
});

const logOnce = once_1((deprecation) => console.warn(deprecation));
/**
 * Error with extra properties to help with debugging
 */
class RequestError extends Error {
    constructor(message, statusCode, options) {
        super(message);
        // Maintains proper stack trace (only available on V8)
        /* istanbul ignore next */
        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, this.constructor);
        }
        this.name = "HttpError";
        this.status = statusCode;
        Object.defineProperty(this, "code", {
            get() {
                logOnce(new Deprecation("[@octokit/request-error] `error.code` is deprecated, use `error.status`."));
                return statusCode;
            },
        });
        this.headers = options.headers || {};
        // redact request credentials without mutating original request options
        const requestCopy = Object.assign({}, options.request);
        if (options.request.headers.authorization) {
            requestCopy.headers = Object.assign({}, options.request.headers, {
                authorization: options.request.headers.authorization.replace(/ .*$/, " [REDACTED]"),
            });
        }
        requestCopy.url = requestCopy.url
            // client_id & client_secret can be passed as URL query parameters to increase rate limit
            // see https://developer.github.com/v3/#increasing-the-unauthenticated-rate-limit-for-oauth-applications
            .replace(/\bclient_secret=\w+/g, "client_secret=[REDACTED]")
            // OAuth tokens can be passed as URL query parameters, although it is not recommended
            // see https://developer.github.com/v3/#oauth2-token-sent-in-a-header
            .replace(/\baccess_token=\w+/g, "access_token=[REDACTED]");
        this.request = requestCopy;
    }
}

const VERSION$1 = "5.4.8";

function getBufferResponse(response) {
    return response.arrayBuffer();
}

function fetchWrapper(requestOptions) {
    if (isPlainObject(requestOptions.body) ||
        Array.isArray(requestOptions.body)) {
        requestOptions.body = JSON.stringify(requestOptions.body);
    }
    let headers = {};
    let status;
    let url;
    const fetch$1 = (requestOptions.request && requestOptions.request.fetch) || fetch;
    return fetch$1(requestOptions.url, Object.assign({
        method: requestOptions.method,
        body: requestOptions.body,
        headers: requestOptions.headers,
        redirect: requestOptions.redirect,
    }, requestOptions.request))
        .then((response) => {
        url = response.url;
        status = response.status;
        for (const keyAndValue of response.headers) {
            headers[keyAndValue[0]] = keyAndValue[1];
        }
        if (status === 204 || status === 205) {
            return;
        }
        // GitHub API returns 200 for HEAD requests
        if (requestOptions.method === "HEAD") {
            if (status < 400) {
                return;
            }
            throw new RequestError(response.statusText, status, {
                headers,
                request: requestOptions,
            });
        }
        if (status === 304) {
            throw new RequestError("Not modified", status, {
                headers,
                request: requestOptions,
            });
        }
        if (status >= 400) {
            return response
                .text()
                .then((message) => {
                const error = new RequestError(message, status, {
                    headers,
                    request: requestOptions,
                });
                try {
                    let responseBody = JSON.parse(error.message);
                    Object.assign(error, responseBody);
                    let errors = responseBody.errors;
                    // Assumption `errors` would always be in Array format
                    error.message =
                        error.message + ": " + errors.map(JSON.stringify).join(", ");
                }
                catch (e) {
                    // ignore, see octokit/rest.js#684
                }
                throw error;
            });
        }
        const contentType = response.headers.get("content-type");
        if (/application\/json/.test(contentType)) {
            return response.json();
        }
        if (!contentType || /^text\/|charset=utf-8$/.test(contentType)) {
            return response.text();
        }
        return getBufferResponse(response);
    })
        .then((data) => {
        return {
            status,
            url,
            headers,
            data,
        };
    })
        .catch((error) => {
        if (error instanceof RequestError) {
            throw error;
        }
        throw new RequestError(error.message, 500, {
            headers,
            request: requestOptions,
        });
    });
}

function withDefaults$1(oldEndpoint, newDefaults) {
    const endpoint = oldEndpoint.defaults(newDefaults);
    const newApi = function (route, parameters) {
        const endpointOptions = endpoint.merge(route, parameters);
        if (!endpointOptions.request || !endpointOptions.request.hook) {
            return fetchWrapper(endpoint.parse(endpointOptions));
        }
        const request = (route, parameters) => {
            return fetchWrapper(endpoint.parse(endpoint.merge(route, parameters)));
        };
        Object.assign(request, {
            endpoint,
            defaults: withDefaults$1.bind(null, endpoint),
        });
        return endpointOptions.request.hook(request, endpointOptions);
    };
    return Object.assign(newApi, {
        endpoint,
        defaults: withDefaults$1.bind(null, endpoint),
    });
}

const request = withDefaults$1(endpoint, {
    headers: {
        "user-agent": `octokit-request.js/${VERSION$1} ${getUserAgent()}`,
    },
});

var distWeb$1 = /*#__PURE__*/Object.freeze({
	__proto__: null,
	request: request
});

const VERSION$2 = "4.5.6";

class GraphqlError extends Error {
    constructor(request, response) {
        const message = response.data.errors[0].message;
        super(message);
        Object.assign(this, response.data);
        Object.assign(this, { headers: response.headers });
        this.name = "GraphqlError";
        this.request = request;
        // Maintains proper stack trace (only available on V8)
        /* istanbul ignore next */
        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, this.constructor);
        }
    }
}

const NON_VARIABLE_OPTIONS = [
    "method",
    "baseUrl",
    "url",
    "headers",
    "request",
    "query",
    "mediaType",
];
const GHES_V3_SUFFIX_REGEX = /\/api\/v3\/?$/;
function graphql(request, query, options) {
    if (typeof query === "string" && options && "query" in options) {
        return Promise.reject(new Error(`[@octokit/graphql] "query" cannot be used as variable name`));
    }
    const parsedOptions = typeof query === "string" ? Object.assign({ query }, options) : query;
    const requestOptions = Object.keys(parsedOptions).reduce((result, key) => {
        if (NON_VARIABLE_OPTIONS.includes(key)) {
            result[key] = parsedOptions[key];
            return result;
        }
        if (!result.variables) {
            result.variables = {};
        }
        result.variables[key] = parsedOptions[key];
        return result;
    }, {});
    // workaround for GitHub Enterprise baseUrl set with /api/v3 suffix
    // https://github.com/octokit/auth-app.js/issues/111#issuecomment-657610451
    const baseUrl = parsedOptions.baseUrl || request.endpoint.DEFAULTS.baseUrl;
    if (GHES_V3_SUFFIX_REGEX.test(baseUrl)) {
        requestOptions.url = baseUrl.replace(GHES_V3_SUFFIX_REGEX, "/api/graphql");
    }
    return request(requestOptions).then((response) => {
        if (response.data.errors) {
            const headers = {};
            for (const key of Object.keys(response.headers)) {
                headers[key] = response.headers[key];
            }
            throw new GraphqlError(requestOptions, {
                headers,
                data: response.data,
            });
        }
        return response.data.data;
    });
}

function withDefaults$2(request$1, newDefaults) {
    const newRequest = request$1.defaults(newDefaults);
    const newApi = (query, options) => {
        return graphql(newRequest, query, options);
    };
    return Object.assign(newApi, {
        defaults: withDefaults$2.bind(null, newRequest),
        endpoint: request.endpoint,
    });
}

const graphql$1 = withDefaults$2(request, {
    headers: {
        "user-agent": `octokit-graphql.js/${VERSION$2} ${getUserAgent()}`,
    },
    method: "POST",
    url: "/graphql",
});
function withCustomRequest(customRequest) {
    return withDefaults$2(customRequest, {
        method: "POST",
        url: "/graphql",
    });
}

var distWeb$2 = /*#__PURE__*/Object.freeze({
	__proto__: null,
	graphql: graphql$1,
	withCustomRequest: withCustomRequest
});

async function auth(token) {
    const tokenType = token.split(/\./).length === 3
        ? "app"
        : /^v\d+\./.test(token)
            ? "installation"
            : "oauth";
    return {
        type: "token",
        token: token,
        tokenType
    };
}

/**
 * Prefix token for usage in the Authorization header
 *
 * @param token OAuth token or JSON Web Token
 */
function withAuthorizationPrefix(token) {
    if (token.split(/\./).length === 3) {
        return `bearer ${token}`;
    }
    return `token ${token}`;
}

async function hook(token, request, route, parameters) {
    const endpoint = request.endpoint.merge(route, parameters);
    endpoint.headers.authorization = withAuthorizationPrefix(token);
    return request(endpoint);
}

const createTokenAuth = function createTokenAuth(token) {
    if (!token) {
        throw new Error("[@octokit/auth-token] No token passed to createTokenAuth");
    }
    if (typeof token !== "string") {
        throw new Error("[@octokit/auth-token] Token passed to createTokenAuth is not a string");
    }
    token = token.replace(/^(token|bearer) +/i, "");
    return Object.assign(auth.bind(null, token), {
        hook: hook.bind(null, token)
    });
};

var distWeb$3 = /*#__PURE__*/Object.freeze({
	__proto__: null,
	createTokenAuth: createTokenAuth
});

const VERSION$3 = "3.1.2";

class Octokit {
    constructor(options = {}) {
        const hook = new Collection();
        const requestDefaults = {
            baseUrl: request.endpoint.DEFAULTS.baseUrl,
            headers: {},
            request: Object.assign({}, options.request, {
                hook: hook.bind(null, "request"),
            }),
            mediaType: {
                previews: [],
                format: "",
            },
        };
        // prepend default user agent with `options.userAgent` if set
        requestDefaults.headers["user-agent"] = [
            options.userAgent,
            `octokit-core.js/${VERSION$3} ${getUserAgent()}`,
        ]
            .filter(Boolean)
            .join(" ");
        if (options.baseUrl) {
            requestDefaults.baseUrl = options.baseUrl;
        }
        if (options.previews) {
            requestDefaults.mediaType.previews = options.previews;
        }
        if (options.timeZone) {
            requestDefaults.headers["time-zone"] = options.timeZone;
        }
        this.request = request.defaults(requestDefaults);
        this.graphql = withCustomRequest(this.request).defaults({
            ...requestDefaults,
            baseUrl: requestDefaults.baseUrl.replace(/\/api\/v3$/, "/api"),
        });
        this.log = Object.assign({
            debug: () => { },
            info: () => { },
            warn: console.warn.bind(console),
            error: console.error.bind(console),
        }, options.log);
        this.hook = hook;
        // (1) If neither `options.authStrategy` nor `options.auth` are set, the `octokit` instance
        //     is unauthenticated. The `this.auth()` method is a no-op and no request hook is registred.
        // (2) If only `options.auth` is set, use the default token authentication strategy.
        // (3) If `options.authStrategy` is set then use it and pass in `options.auth`. Always pass own request as many strategies accept a custom request instance.
        // TODO: type `options.auth` based on `options.authStrategy`.
        if (!options.authStrategy) {
            if (!options.auth) {
                // (1)
                this.auth = async () => ({
                    type: "unauthenticated",
                });
            }
            else {
                // (2)
                const auth = createTokenAuth(options.auth);
                // @ts-ignore  ¯\_(ツ)_/¯
                hook.wrap("request", auth.hook);
                this.auth = auth;
            }
        }
        else {
            const auth = options.authStrategy(Object.assign({
                request: this.request,
            }, options.auth));
            // @ts-ignore  ¯\_(ツ)_/¯
            hook.wrap("request", auth.hook);
            this.auth = auth;
        }
        // apply plugins
        // https://stackoverflow.com/a/16345172
        const classConstructor = this.constructor;
        classConstructor.plugins.forEach((plugin) => {
            Object.assign(this, plugin(this, options));
        });
    }
    static defaults(defaults) {
        const OctokitWithDefaults = class extends this {
            constructor(...args) {
                const options = args[0] || {};
                if (typeof defaults === "function") {
                    super(defaults(options));
                    return;
                }
                super(Object.assign({}, defaults, options, options.userAgent && defaults.userAgent
                    ? {
                        userAgent: `${options.userAgent} ${defaults.userAgent}`,
                    }
                    : null));
            }
        };
        return OctokitWithDefaults;
    }
    /**
     * Attach a plugin (or many) to your Octokit instance.
     *
     * @example
     * const API = Octokit.plugin(plugin1, plugin2, plugin3, ...)
     */
    static plugin(...newPlugins) {
        var _a;
        const currentPlugins = this.plugins;
        const NewOctokit = (_a = class extends this {
            },
            _a.plugins = currentPlugins.concat(newPlugins.filter((plugin) => !currentPlugins.includes(plugin))),
            _a);
        return NewOctokit;
    }
}
Octokit.VERSION = VERSION$3;
Octokit.plugins = [];

const VERSION$4 = "1.0.0";

/**
 * @param octokit Octokit instance
 * @param options Options passed to Octokit constructor
 */
function requestLog(octokit) {
    octokit.hook.wrap("request", (request, options) => {
        octokit.log.debug("request", options);
        const start = Date.now();
        const requestOptions = octokit.request.endpoint.parse(options);
        const path = requestOptions.url.replace(options.baseUrl, "");
        return request(options)
            .then(response => {
            octokit.log.info(`${requestOptions.method} ${path} - ${response.status} in ${Date.now() - start}ms`);
            return response;
        })
            .catch(error => {
            octokit.log.info(`${requestOptions.method} ${path} - ${error.status} in ${Date.now() -
                start}ms`);
            throw error;
        });
    });
}
requestLog.VERSION = VERSION$4;

var distWeb$4 = /*#__PURE__*/Object.freeze({
	__proto__: null,
	requestLog: requestLog
});

const VERSION$5 = "2.3.3";

/**
 * Some “list” response that can be paginated have a different response structure
 *
 * They have a `total_count` key in the response (search also has `incomplete_results`,
 * /installation/repositories also has `repository_selection`), as well as a key with
 * the list of the items which name varies from endpoint to endpoint.
 *
 * Octokit normalizes these responses so that paginated results are always returned following
 * the same structure. One challenge is that if the list response has only one page, no Link
 * header is provided, so this header alone is not sufficient to check wether a response is
 * paginated or not.
 *
 * We check if a "total_count" key is present in the response data, but also make sure that
 * a "url" property is not, as the "Get the combined status for a specific ref" endpoint would
 * otherwise match: https://developer.github.com/v3/repos/statuses/#get-the-combined-status-for-a-specific-ref
 */
function normalizePaginatedListResponse(response) {
    const responseNeedsNormalization = "total_count" in response.data && !("url" in response.data);
    if (!responseNeedsNormalization)
        return response;
    // keep the additional properties intact as there is currently no other way
    // to retrieve the same information.
    const incompleteResults = response.data.incomplete_results;
    const repositorySelection = response.data.repository_selection;
    const totalCount = response.data.total_count;
    delete response.data.incomplete_results;
    delete response.data.repository_selection;
    delete response.data.total_count;
    const namespaceKey = Object.keys(response.data)[0];
    const data = response.data[namespaceKey];
    response.data = data;
    if (typeof incompleteResults !== "undefined") {
        response.data.incomplete_results = incompleteResults;
    }
    if (typeof repositorySelection !== "undefined") {
        response.data.repository_selection = repositorySelection;
    }
    response.data.total_count = totalCount;
    return response;
}

function iterator(octokit, route, parameters) {
    const options = typeof route === "function"
        ? route.endpoint(parameters)
        : octokit.request.endpoint(route, parameters);
    const requestMethod = typeof route === "function" ? route : octokit.request;
    const method = options.method;
    const headers = options.headers;
    let url = options.url;
    return {
        [Symbol.asyncIterator]: () => ({
            next() {
                if (!url) {
                    return Promise.resolve({ done: true });
                }
                return requestMethod({ method, url, headers })
                    .then(normalizePaginatedListResponse)
                    .then((response) => {
                    // `response.headers.link` format:
                    // '<https://api.github.com/users/aseemk/followers?page=2>; rel="next", <https://api.github.com/users/aseemk/followers?page=2>; rel="last"'
                    // sets `url` to undefined if "next" URL is not present or `link` header is not set
                    url = ((response.headers.link || "").match(/<([^>]+)>;\s*rel="next"/) || [])[1];
                    return { value: response };
                });
            },
        }),
    };
}

function paginate(octokit, route, parameters, mapFn) {
    if (typeof parameters === "function") {
        mapFn = parameters;
        parameters = undefined;
    }
    return gather(octokit, [], iterator(octokit, route, parameters)[Symbol.asyncIterator](), mapFn);
}
function gather(octokit, results, iterator, mapFn) {
    return iterator.next().then((result) => {
        if (result.done) {
            return results;
        }
        let earlyExit = false;
        function done() {
            earlyExit = true;
        }
        results = results.concat(mapFn ? mapFn(result.value, done) : result.value.data);
        if (earlyExit) {
            return results;
        }
        return gather(octokit, results, iterator, mapFn);
    });
}

/**
 * @param octokit Octokit instance
 * @param options Options passed to Octokit constructor
 */
function paginateRest(octokit) {
    return {
        paginate: Object.assign(paginate.bind(null, octokit), {
            iterator: iterator.bind(null, octokit),
        }),
    };
}
paginateRest.VERSION = VERSION$5;

const Endpoints = {
    actions: {
        addSelectedRepoToOrgSecret: [
            "PUT /orgs/{org}/actions/secrets/{secret_name}/repositories/{repository_id}",
        ],
        cancelWorkflowRun: [
            "POST /repos/{owner}/{repo}/actions/runs/{run_id}/cancel",
        ],
        createOrUpdateOrgSecret: ["PUT /orgs/{org}/actions/secrets/{secret_name}"],
        createOrUpdateRepoSecret: [
            "PUT /repos/{owner}/{repo}/actions/secrets/{secret_name}",
        ],
        createRegistrationTokenForOrg: [
            "POST /orgs/{org}/actions/runners/registration-token",
        ],
        createRegistrationTokenForRepo: [
            "POST /repos/{owner}/{repo}/actions/runners/registration-token",
        ],
        createRemoveTokenForOrg: ["POST /orgs/{org}/actions/runners/remove-token"],
        createRemoveTokenForRepo: [
            "POST /repos/{owner}/{repo}/actions/runners/remove-token",
        ],
        createWorkflowDispatch: [
            "POST /repos/{owner}/{repo}/actions/workflows/{workflow_id}/dispatches",
        ],
        deleteArtifact: [
            "DELETE /repos/{owner}/{repo}/actions/artifacts/{artifact_id}",
        ],
        deleteOrgSecret: ["DELETE /orgs/{org}/actions/secrets/{secret_name}"],
        deleteRepoSecret: [
            "DELETE /repos/{owner}/{repo}/actions/secrets/{secret_name}",
        ],
        deleteSelfHostedRunnerFromOrg: [
            "DELETE /orgs/{org}/actions/runners/{runner_id}",
        ],
        deleteSelfHostedRunnerFromRepo: [
            "DELETE /repos/{owner}/{repo}/actions/runners/{runner_id}",
        ],
        deleteWorkflowRun: ["DELETE /repos/{owner}/{repo}/actions/runs/{run_id}"],
        deleteWorkflowRunLogs: [
            "DELETE /repos/{owner}/{repo}/actions/runs/{run_id}/logs",
        ],
        downloadArtifact: [
            "GET /repos/{owner}/{repo}/actions/artifacts/{artifact_id}/{archive_format}",
        ],
        downloadJobLogsForWorkflowRun: [
            "GET /repos/{owner}/{repo}/actions/jobs/{job_id}/logs",
        ],
        downloadWorkflowRunLogs: [
            "GET /repos/{owner}/{repo}/actions/runs/{run_id}/logs",
        ],
        getArtifact: ["GET /repos/{owner}/{repo}/actions/artifacts/{artifact_id}"],
        getJobForWorkflowRun: ["GET /repos/{owner}/{repo}/actions/jobs/{job_id}"],
        getOrgPublicKey: ["GET /orgs/{org}/actions/secrets/public-key"],
        getOrgSecret: ["GET /orgs/{org}/actions/secrets/{secret_name}"],
        getRepoPublicKey: ["GET /repos/{owner}/{repo}/actions/secrets/public-key"],
        getRepoSecret: ["GET /repos/{owner}/{repo}/actions/secrets/{secret_name}"],
        getSelfHostedRunnerForOrg: ["GET /orgs/{org}/actions/runners/{runner_id}"],
        getSelfHostedRunnerForRepo: [
            "GET /repos/{owner}/{repo}/actions/runners/{runner_id}",
        ],
        getWorkflow: ["GET /repos/{owner}/{repo}/actions/workflows/{workflow_id}"],
        getWorkflowRun: ["GET /repos/{owner}/{repo}/actions/runs/{run_id}"],
        getWorkflowRunUsage: [
            "GET /repos/{owner}/{repo}/actions/runs/{run_id}/timing",
        ],
        getWorkflowUsage: [
            "GET /repos/{owner}/{repo}/actions/workflows/{workflow_id}/timing",
        ],
        listArtifactsForRepo: ["GET /repos/{owner}/{repo}/actions/artifacts"],
        listJobsForWorkflowRun: [
            "GET /repos/{owner}/{repo}/actions/runs/{run_id}/jobs",
        ],
        listOrgSecrets: ["GET /orgs/{org}/actions/secrets"],
        listRepoSecrets: ["GET /repos/{owner}/{repo}/actions/secrets"],
        listRepoWorkflows: ["GET /repos/{owner}/{repo}/actions/workflows"],
        listRunnerApplicationsForOrg: ["GET /orgs/{org}/actions/runners/downloads"],
        listRunnerApplicationsForRepo: [
            "GET /repos/{owner}/{repo}/actions/runners/downloads",
        ],
        listSelectedReposForOrgSecret: [
            "GET /orgs/{org}/actions/secrets/{secret_name}/repositories",
        ],
        listSelfHostedRunnersForOrg: ["GET /orgs/{org}/actions/runners"],
        listSelfHostedRunnersForRepo: ["GET /repos/{owner}/{repo}/actions/runners"],
        listWorkflowRunArtifacts: [
            "GET /repos/{owner}/{repo}/actions/runs/{run_id}/artifacts",
        ],
        listWorkflowRuns: [
            "GET /repos/{owner}/{repo}/actions/workflows/{workflow_id}/runs",
        ],
        listWorkflowRunsForRepo: ["GET /repos/{owner}/{repo}/actions/runs"],
        reRunWorkflow: ["POST /repos/{owner}/{repo}/actions/runs/{run_id}/rerun"],
        removeSelectedRepoFromOrgSecret: [
            "DELETE /orgs/{org}/actions/secrets/{secret_name}/repositories/{repository_id}",
        ],
        setSelectedReposForOrgSecret: [
            "PUT /orgs/{org}/actions/secrets/{secret_name}/repositories",
        ],
    },
    activity: {
        checkRepoIsStarredByAuthenticatedUser: ["GET /user/starred/{owner}/{repo}"],
        deleteRepoSubscription: ["DELETE /repos/{owner}/{repo}/subscription"],
        deleteThreadSubscription: [
            "DELETE /notifications/threads/{thread_id}/subscription",
        ],
        getFeeds: ["GET /feeds"],
        getRepoSubscription: ["GET /repos/{owner}/{repo}/subscription"],
        getThread: ["GET /notifications/threads/{thread_id}"],
        getThreadSubscriptionForAuthenticatedUser: [
            "GET /notifications/threads/{thread_id}/subscription",
        ],
        listEventsForAuthenticatedUser: ["GET /users/{username}/events"],
        listNotificationsForAuthenticatedUser: ["GET /notifications"],
        listOrgEventsForAuthenticatedUser: [
            "GET /users/{username}/events/orgs/{org}",
        ],
        listPublicEvents: ["GET /events"],
        listPublicEventsForRepoNetwork: ["GET /networks/{owner}/{repo}/events"],
        listPublicEventsForUser: ["GET /users/{username}/events/public"],
        listPublicOrgEvents: ["GET /orgs/{org}/events"],
        listReceivedEventsForUser: ["GET /users/{username}/received_events"],
        listReceivedPublicEventsForUser: [
            "GET /users/{username}/received_events/public",
        ],
        listRepoEvents: ["GET /repos/{owner}/{repo}/events"],
        listRepoNotificationsForAuthenticatedUser: [
            "GET /repos/{owner}/{repo}/notifications",
        ],
        listReposStarredByAuthenticatedUser: ["GET /user/starred"],
        listReposStarredByUser: ["GET /users/{username}/starred"],
        listReposWatchedByUser: ["GET /users/{username}/subscriptions"],
        listStargazersForRepo: ["GET /repos/{owner}/{repo}/stargazers"],
        listWatchedReposForAuthenticatedUser: ["GET /user/subscriptions"],
        listWatchersForRepo: ["GET /repos/{owner}/{repo}/subscribers"],
        markNotificationsAsRead: ["PUT /notifications"],
        markRepoNotificationsAsRead: ["PUT /repos/{owner}/{repo}/notifications"],
        markThreadAsRead: ["PATCH /notifications/threads/{thread_id}"],
        setRepoSubscription: ["PUT /repos/{owner}/{repo}/subscription"],
        setThreadSubscription: [
            "PUT /notifications/threads/{thread_id}/subscription",
        ],
        starRepoForAuthenticatedUser: ["PUT /user/starred/{owner}/{repo}"],
        unstarRepoForAuthenticatedUser: ["DELETE /user/starred/{owner}/{repo}"],
    },
    apps: {
        addRepoToInstallation: [
            "PUT /user/installations/{installation_id}/repositories/{repository_id}",
        ],
        checkToken: ["POST /applications/{client_id}/token"],
        createContentAttachment: [
            "POST /content_references/{content_reference_id}/attachments",
            { mediaType: { previews: ["corsair"] } },
        ],
        createFromManifest: ["POST /app-manifests/{code}/conversions"],
        createInstallationAccessToken: [
            "POST /app/installations/{installation_id}/access_tokens",
        ],
        deleteAuthorization: ["DELETE /applications/{client_id}/grant"],
        deleteInstallation: ["DELETE /app/installations/{installation_id}"],
        deleteToken: ["DELETE /applications/{client_id}/token"],
        getAuthenticated: ["GET /app"],
        getBySlug: ["GET /apps/{app_slug}"],
        getInstallation: ["GET /app/installations/{installation_id}"],
        getOrgInstallation: ["GET /orgs/{org}/installation"],
        getRepoInstallation: ["GET /repos/{owner}/{repo}/installation"],
        getSubscriptionPlanForAccount: [
            "GET /marketplace_listing/accounts/{account_id}",
        ],
        getSubscriptionPlanForAccountStubbed: [
            "GET /marketplace_listing/stubbed/accounts/{account_id}",
        ],
        getUserInstallation: ["GET /users/{username}/installation"],
        listAccountsForPlan: ["GET /marketplace_listing/plans/{plan_id}/accounts"],
        listAccountsForPlanStubbed: [
            "GET /marketplace_listing/stubbed/plans/{plan_id}/accounts",
        ],
        listInstallationReposForAuthenticatedUser: [
            "GET /user/installations/{installation_id}/repositories",
        ],
        listInstallations: ["GET /app/installations"],
        listInstallationsForAuthenticatedUser: ["GET /user/installations"],
        listPlans: ["GET /marketplace_listing/plans"],
        listPlansStubbed: ["GET /marketplace_listing/stubbed/plans"],
        listReposAccessibleToInstallation: ["GET /installation/repositories"],
        listSubscriptionsForAuthenticatedUser: ["GET /user/marketplace_purchases"],
        listSubscriptionsForAuthenticatedUserStubbed: [
            "GET /user/marketplace_purchases/stubbed",
        ],
        removeRepoFromInstallation: [
            "DELETE /user/installations/{installation_id}/repositories/{repository_id}",
        ],
        resetToken: ["PATCH /applications/{client_id}/token"],
        revokeInstallationAccessToken: ["DELETE /installation/token"],
        suspendInstallation: ["PUT /app/installations/{installation_id}/suspended"],
        unsuspendInstallation: [
            "DELETE /app/installations/{installation_id}/suspended",
        ],
    },
    billing: {
        getGithubActionsBillingOrg: ["GET /orgs/{org}/settings/billing/actions"],
        getGithubActionsBillingUser: [
            "GET /users/{username}/settings/billing/actions",
        ],
        getGithubPackagesBillingOrg: ["GET /orgs/{org}/settings/billing/packages"],
        getGithubPackagesBillingUser: [
            "GET /users/{username}/settings/billing/packages",
        ],
        getSharedStorageBillingOrg: [
            "GET /orgs/{org}/settings/billing/shared-storage",
        ],
        getSharedStorageBillingUser: [
            "GET /users/{username}/settings/billing/shared-storage",
        ],
    },
    checks: {
        create: [
            "POST /repos/{owner}/{repo}/check-runs",
            { mediaType: { previews: ["antiope"] } },
        ],
        createSuite: [
            "POST /repos/{owner}/{repo}/check-suites",
            { mediaType: { previews: ["antiope"] } },
        ],
        get: [
            "GET /repos/{owner}/{repo}/check-runs/{check_run_id}",
            { mediaType: { previews: ["antiope"] } },
        ],
        getSuite: [
            "GET /repos/{owner}/{repo}/check-suites/{check_suite_id}",
            { mediaType: { previews: ["antiope"] } },
        ],
        listAnnotations: [
            "GET /repos/{owner}/{repo}/check-runs/{check_run_id}/annotations",
            { mediaType: { previews: ["antiope"] } },
        ],
        listForRef: [
            "GET /repos/{owner}/{repo}/commits/{ref}/check-runs",
            { mediaType: { previews: ["antiope"] } },
        ],
        listForSuite: [
            "GET /repos/{owner}/{repo}/check-suites/{check_suite_id}/check-runs",
            { mediaType: { previews: ["antiope"] } },
        ],
        listSuitesForRef: [
            "GET /repos/{owner}/{repo}/commits/{ref}/check-suites",
            { mediaType: { previews: ["antiope"] } },
        ],
        rerequestSuite: [
            "POST /repos/{owner}/{repo}/check-suites/{check_suite_id}/rerequest",
            { mediaType: { previews: ["antiope"] } },
        ],
        setSuitesPreferences: [
            "PATCH /repos/{owner}/{repo}/check-suites/preferences",
            { mediaType: { previews: ["antiope"] } },
        ],
        update: [
            "PATCH /repos/{owner}/{repo}/check-runs/{check_run_id}",
            { mediaType: { previews: ["antiope"] } },
        ],
    },
    codeScanning: {
        getAlert: ["GET /repos/{owner}/{repo}/code-scanning/alerts/{alert_id}"],
        listAlertsForRepo: ["GET /repos/{owner}/{repo}/code-scanning/alerts"],
    },
    codesOfConduct: {
        getAllCodesOfConduct: [
            "GET /codes_of_conduct",
            { mediaType: { previews: ["scarlet-witch"] } },
        ],
        getConductCode: [
            "GET /codes_of_conduct/{key}",
            { mediaType: { previews: ["scarlet-witch"] } },
        ],
        getForRepo: [
            "GET /repos/{owner}/{repo}/community/code_of_conduct",
            { mediaType: { previews: ["scarlet-witch"] } },
        ],
    },
    emojis: { get: ["GET /emojis"] },
    gists: {
        checkIsStarred: ["GET /gists/{gist_id}/star"],
        create: ["POST /gists"],
        createComment: ["POST /gists/{gist_id}/comments"],
        delete: ["DELETE /gists/{gist_id}"],
        deleteComment: ["DELETE /gists/{gist_id}/comments/{comment_id}"],
        fork: ["POST /gists/{gist_id}/forks"],
        get: ["GET /gists/{gist_id}"],
        getComment: ["GET /gists/{gist_id}/comments/{comment_id}"],
        getRevision: ["GET /gists/{gist_id}/{sha}"],
        list: ["GET /gists"],
        listComments: ["GET /gists/{gist_id}/comments"],
        listCommits: ["GET /gists/{gist_id}/commits"],
        listForUser: ["GET /users/{username}/gists"],
        listForks: ["GET /gists/{gist_id}/forks"],
        listPublic: ["GET /gists/public"],
        listStarred: ["GET /gists/starred"],
        star: ["PUT /gists/{gist_id}/star"],
        unstar: ["DELETE /gists/{gist_id}/star"],
        update: ["PATCH /gists/{gist_id}"],
        updateComment: ["PATCH /gists/{gist_id}/comments/{comment_id}"],
    },
    git: {
        createBlob: ["POST /repos/{owner}/{repo}/git/blobs"],
        createCommit: ["POST /repos/{owner}/{repo}/git/commits"],
        createRef: ["POST /repos/{owner}/{repo}/git/refs"],
        createTag: ["POST /repos/{owner}/{repo}/git/tags"],
        createTree: ["POST /repos/{owner}/{repo}/git/trees"],
        deleteRef: ["DELETE /repos/{owner}/{repo}/git/refs/{ref}"],
        getBlob: ["GET /repos/{owner}/{repo}/git/blobs/{file_sha}"],
        getCommit: ["GET /repos/{owner}/{repo}/git/commits/{commit_sha}"],
        getRef: ["GET /repos/{owner}/{repo}/git/ref/{ref}"],
        getTag: ["GET /repos/{owner}/{repo}/git/tags/{tag_sha}"],
        getTree: ["GET /repos/{owner}/{repo}/git/trees/{tree_sha}"],
        listMatchingRefs: ["GET /repos/{owner}/{repo}/git/matching-refs/{ref}"],
        updateRef: ["PATCH /repos/{owner}/{repo}/git/refs/{ref}"],
    },
    gitignore: {
        getAllTemplates: ["GET /gitignore/templates"],
        getTemplate: ["GET /gitignore/templates/{name}"],
    },
    interactions: {
        getRestrictionsForOrg: [
            "GET /orgs/{org}/interaction-limits",
            { mediaType: { previews: ["sombra"] } },
        ],
        getRestrictionsForRepo: [
            "GET /repos/{owner}/{repo}/interaction-limits",
            { mediaType: { previews: ["sombra"] } },
        ],
        removeRestrictionsForOrg: [
            "DELETE /orgs/{org}/interaction-limits",
            { mediaType: { previews: ["sombra"] } },
        ],
        removeRestrictionsForRepo: [
            "DELETE /repos/{owner}/{repo}/interaction-limits",
            { mediaType: { previews: ["sombra"] } },
        ],
        setRestrictionsForOrg: [
            "PUT /orgs/{org}/interaction-limits",
            { mediaType: { previews: ["sombra"] } },
        ],
        setRestrictionsForRepo: [
            "PUT /repos/{owner}/{repo}/interaction-limits",
            { mediaType: { previews: ["sombra"] } },
        ],
    },
    issues: {
        addAssignees: [
            "POST /repos/{owner}/{repo}/issues/{issue_number}/assignees",
        ],
        addLabels: ["POST /repos/{owner}/{repo}/issues/{issue_number}/labels"],
        checkUserCanBeAssigned: ["GET /repos/{owner}/{repo}/assignees/{assignee}"],
        create: ["POST /repos/{owner}/{repo}/issues"],
        createComment: [
            "POST /repos/{owner}/{repo}/issues/{issue_number}/comments",
        ],
        createLabel: ["POST /repos/{owner}/{repo}/labels"],
        createMilestone: ["POST /repos/{owner}/{repo}/milestones"],
        deleteComment: [
            "DELETE /repos/{owner}/{repo}/issues/comments/{comment_id}",
        ],
        deleteLabel: ["DELETE /repos/{owner}/{repo}/labels/{name}"],
        deleteMilestone: [
            "DELETE /repos/{owner}/{repo}/milestones/{milestone_number}",
        ],
        get: ["GET /repos/{owner}/{repo}/issues/{issue_number}"],
        getComment: ["GET /repos/{owner}/{repo}/issues/comments/{comment_id}"],
        getEvent: ["GET /repos/{owner}/{repo}/issues/events/{event_id}"],
        getLabel: ["GET /repos/{owner}/{repo}/labels/{name}"],
        getMilestone: ["GET /repos/{owner}/{repo}/milestones/{milestone_number}"],
        list: ["GET /issues"],
        listAssignees: ["GET /repos/{owner}/{repo}/assignees"],
        listComments: ["GET /repos/{owner}/{repo}/issues/{issue_number}/comments"],
        listCommentsForRepo: ["GET /repos/{owner}/{repo}/issues/comments"],
        listEvents: ["GET /repos/{owner}/{repo}/issues/{issue_number}/events"],
        listEventsForRepo: ["GET /repos/{owner}/{repo}/issues/events"],
        listEventsForTimeline: [
            "GET /repos/{owner}/{repo}/issues/{issue_number}/timeline",
            { mediaType: { previews: ["mockingbird"] } },
        ],
        listForAuthenticatedUser: ["GET /user/issues"],
        listForOrg: ["GET /orgs/{org}/issues"],
        listForRepo: ["GET /repos/{owner}/{repo}/issues"],
        listLabelsForMilestone: [
            "GET /repos/{owner}/{repo}/milestones/{milestone_number}/labels",
        ],
        listLabelsForRepo: ["GET /repos/{owner}/{repo}/labels"],
        listLabelsOnIssue: [
            "GET /repos/{owner}/{repo}/issues/{issue_number}/labels",
        ],
        listMilestones: ["GET /repos/{owner}/{repo}/milestones"],
        lock: ["PUT /repos/{owner}/{repo}/issues/{issue_number}/lock"],
        removeAllLabels: [
            "DELETE /repos/{owner}/{repo}/issues/{issue_number}/labels",
        ],
        removeAssignees: [
            "DELETE /repos/{owner}/{repo}/issues/{issue_number}/assignees",
        ],
        removeLabel: [
            "DELETE /repos/{owner}/{repo}/issues/{issue_number}/labels/{name}",
        ],
        setLabels: ["PUT /repos/{owner}/{repo}/issues/{issue_number}/labels"],
        unlock: ["DELETE /repos/{owner}/{repo}/issues/{issue_number}/lock"],
        update: ["PATCH /repos/{owner}/{repo}/issues/{issue_number}"],
        updateComment: ["PATCH /repos/{owner}/{repo}/issues/comments/{comment_id}"],
        updateLabel: ["PATCH /repos/{owner}/{repo}/labels/{name}"],
        updateMilestone: [
            "PATCH /repos/{owner}/{repo}/milestones/{milestone_number}",
        ],
    },
    licenses: {
        get: ["GET /licenses/{license}"],
        getAllCommonlyUsed: ["GET /licenses"],
        getForRepo: ["GET /repos/{owner}/{repo}/license"],
    },
    markdown: {
        render: ["POST /markdown"],
        renderRaw: [
            "POST /markdown/raw",
            { headers: { "content-type": "text/plain; charset=utf-8" } },
        ],
    },
    meta: { get: ["GET /meta"] },
    migrations: {
        cancelImport: ["DELETE /repos/{owner}/{repo}/import"],
        deleteArchiveForAuthenticatedUser: [
            "DELETE /user/migrations/{migration_id}/archive",
            { mediaType: { previews: ["wyandotte"] } },
        ],
        deleteArchiveForOrg: [
            "DELETE /orgs/{org}/migrations/{migration_id}/archive",
            { mediaType: { previews: ["wyandotte"] } },
        ],
        downloadArchiveForOrg: [
            "GET /orgs/{org}/migrations/{migration_id}/archive",
            { mediaType: { previews: ["wyandotte"] } },
        ],
        getArchiveForAuthenticatedUser: [
            "GET /user/migrations/{migration_id}/archive",
            { mediaType: { previews: ["wyandotte"] } },
        ],
        getCommitAuthors: ["GET /repos/{owner}/{repo}/import/authors"],
        getImportStatus: ["GET /repos/{owner}/{repo}/import"],
        getLargeFiles: ["GET /repos/{owner}/{repo}/import/large_files"],
        getStatusForAuthenticatedUser: [
            "GET /user/migrations/{migration_id}",
            { mediaType: { previews: ["wyandotte"] } },
        ],
        getStatusForOrg: [
            "GET /orgs/{org}/migrations/{migration_id}",
            { mediaType: { previews: ["wyandotte"] } },
        ],
        listForAuthenticatedUser: [
            "GET /user/migrations",
            { mediaType: { previews: ["wyandotte"] } },
        ],
        listForOrg: [
            "GET /orgs/{org}/migrations",
            { mediaType: { previews: ["wyandotte"] } },
        ],
        listReposForOrg: [
            "GET /orgs/{org}/migrations/{migration_id}/repositories",
            { mediaType: { previews: ["wyandotte"] } },
        ],
        listReposForUser: [
            "GET /user/migrations/{migration_id}/repositories",
            { mediaType: { previews: ["wyandotte"] } },
        ],
        mapCommitAuthor: ["PATCH /repos/{owner}/{repo}/import/authors/{author_id}"],
        setLfsPreference: ["PATCH /repos/{owner}/{repo}/import/lfs"],
        startForAuthenticatedUser: ["POST /user/migrations"],
        startForOrg: ["POST /orgs/{org}/migrations"],
        startImport: ["PUT /repos/{owner}/{repo}/import"],
        unlockRepoForAuthenticatedUser: [
            "DELETE /user/migrations/{migration_id}/repos/{repo_name}/lock",
            { mediaType: { previews: ["wyandotte"] } },
        ],
        unlockRepoForOrg: [
            "DELETE /orgs/{org}/migrations/{migration_id}/repos/{repo_name}/lock",
            { mediaType: { previews: ["wyandotte"] } },
        ],
        updateImport: ["PATCH /repos/{owner}/{repo}/import"],
    },
    orgs: {
        blockUser: ["PUT /orgs/{org}/blocks/{username}"],
        checkBlockedUser: ["GET /orgs/{org}/blocks/{username}"],
        checkMembershipForUser: ["GET /orgs/{org}/members/{username}"],
        checkPublicMembershipForUser: ["GET /orgs/{org}/public_members/{username}"],
        convertMemberToOutsideCollaborator: [
            "PUT /orgs/{org}/outside_collaborators/{username}",
        ],
        createInvitation: ["POST /orgs/{org}/invitations"],
        createWebhook: ["POST /orgs/{org}/hooks"],
        deleteWebhook: ["DELETE /orgs/{org}/hooks/{hook_id}"],
        get: ["GET /orgs/{org}"],
        getMembershipForAuthenticatedUser: ["GET /user/memberships/orgs/{org}"],
        getMembershipForUser: ["GET /orgs/{org}/memberships/{username}"],
        getWebhook: ["GET /orgs/{org}/hooks/{hook_id}"],
        list: ["GET /organizations"],
        listAppInstallations: ["GET /orgs/{org}/installations"],
        listBlockedUsers: ["GET /orgs/{org}/blocks"],
        listForAuthenticatedUser: ["GET /user/orgs"],
        listForUser: ["GET /users/{username}/orgs"],
        listInvitationTeams: ["GET /orgs/{org}/invitations/{invitation_id}/teams"],
        listMembers: ["GET /orgs/{org}/members"],
        listMembershipsForAuthenticatedUser: ["GET /user/memberships/orgs"],
        listOutsideCollaborators: ["GET /orgs/{org}/outside_collaborators"],
        listPendingInvitations: ["GET /orgs/{org}/invitations"],
        listPublicMembers: ["GET /orgs/{org}/public_members"],
        listWebhooks: ["GET /orgs/{org}/hooks"],
        pingWebhook: ["POST /orgs/{org}/hooks/{hook_id}/pings"],
        removeMember: ["DELETE /orgs/{org}/members/{username}"],
        removeMembershipForUser: ["DELETE /orgs/{org}/memberships/{username}"],
        removeOutsideCollaborator: [
            "DELETE /orgs/{org}/outside_collaborators/{username}",
        ],
        removePublicMembershipForAuthenticatedUser: [
            "DELETE /orgs/{org}/public_members/{username}",
        ],
        setMembershipForUser: ["PUT /orgs/{org}/memberships/{username}"],
        setPublicMembershipForAuthenticatedUser: [
            "PUT /orgs/{org}/public_members/{username}",
        ],
        unblockUser: ["DELETE /orgs/{org}/blocks/{username}"],
        update: ["PATCH /orgs/{org}"],
        updateMembershipForAuthenticatedUser: [
            "PATCH /user/memberships/orgs/{org}",
        ],
        updateWebhook: ["PATCH /orgs/{org}/hooks/{hook_id}"],
    },
    projects: {
        addCollaborator: [
            "PUT /projects/{project_id}/collaborators/{username}",
            { mediaType: { previews: ["inertia"] } },
        ],
        createCard: [
            "POST /projects/columns/{column_id}/cards",
            { mediaType: { previews: ["inertia"] } },
        ],
        createColumn: [
            "POST /projects/{project_id}/columns",
            { mediaType: { previews: ["inertia"] } },
        ],
        createForAuthenticatedUser: [
            "POST /user/projects",
            { mediaType: { previews: ["inertia"] } },
        ],
        createForOrg: [
            "POST /orgs/{org}/projects",
            { mediaType: { previews: ["inertia"] } },
        ],
        createForRepo: [
            "POST /repos/{owner}/{repo}/projects",
            { mediaType: { previews: ["inertia"] } },
        ],
        delete: [
            "DELETE /projects/{project_id}",
            { mediaType: { previews: ["inertia"] } },
        ],
        deleteCard: [
            "DELETE /projects/columns/cards/{card_id}",
            { mediaType: { previews: ["inertia"] } },
        ],
        deleteColumn: [
            "DELETE /projects/columns/{column_id}",
            { mediaType: { previews: ["inertia"] } },
        ],
        get: [
            "GET /projects/{project_id}",
            { mediaType: { previews: ["inertia"] } },
        ],
        getCard: [
            "GET /projects/columns/cards/{card_id}",
            { mediaType: { previews: ["inertia"] } },
        ],
        getColumn: [
            "GET /projects/columns/{column_id}",
            { mediaType: { previews: ["inertia"] } },
        ],
        getPermissionForUser: [
            "GET /projects/{project_id}/collaborators/{username}/permission",
            { mediaType: { previews: ["inertia"] } },
        ],
        listCards: [
            "GET /projects/columns/{column_id}/cards",
            { mediaType: { previews: ["inertia"] } },
        ],
        listCollaborators: [
            "GET /projects/{project_id}/collaborators",
            { mediaType: { previews: ["inertia"] } },
        ],
        listColumns: [
            "GET /projects/{project_id}/columns",
            { mediaType: { previews: ["inertia"] } },
        ],
        listForOrg: [
            "GET /orgs/{org}/projects",
            { mediaType: { previews: ["inertia"] } },
        ],
        listForRepo: [
            "GET /repos/{owner}/{repo}/projects",
            { mediaType: { previews: ["inertia"] } },
        ],
        listForUser: [
            "GET /users/{username}/projects",
            { mediaType: { previews: ["inertia"] } },
        ],
        moveCard: [
            "POST /projects/columns/cards/{card_id}/moves",
            { mediaType: { previews: ["inertia"] } },
        ],
        moveColumn: [
            "POST /projects/columns/{column_id}/moves",
            { mediaType: { previews: ["inertia"] } },
        ],
        removeCollaborator: [
            "DELETE /projects/{project_id}/collaborators/{username}",
            { mediaType: { previews: ["inertia"] } },
        ],
        update: [
            "PATCH /projects/{project_id}",
            { mediaType: { previews: ["inertia"] } },
        ],
        updateCard: [
            "PATCH /projects/columns/cards/{card_id}",
            { mediaType: { previews: ["inertia"] } },
        ],
        updateColumn: [
            "PATCH /projects/columns/{column_id}",
            { mediaType: { previews: ["inertia"] } },
        ],
    },
    pulls: {
        checkIfMerged: ["GET /repos/{owner}/{repo}/pulls/{pull_number}/merge"],
        create: ["POST /repos/{owner}/{repo}/pulls"],
        createReplyForReviewComment: [
            "POST /repos/{owner}/{repo}/pulls/{pull_number}/comments/{comment_id}/replies",
        ],
        createReview: ["POST /repos/{owner}/{repo}/pulls/{pull_number}/reviews"],
        createReviewComment: [
            "POST /repos/{owner}/{repo}/pulls/{pull_number}/comments",
        ],
        deletePendingReview: [
            "DELETE /repos/{owner}/{repo}/pulls/{pull_number}/reviews/{review_id}",
        ],
        deleteReviewComment: [
            "DELETE /repos/{owner}/{repo}/pulls/comments/{comment_id}",
        ],
        dismissReview: [
            "PUT /repos/{owner}/{repo}/pulls/{pull_number}/reviews/{review_id}/dismissals",
        ],
        get: ["GET /repos/{owner}/{repo}/pulls/{pull_number}"],
        getReview: [
            "GET /repos/{owner}/{repo}/pulls/{pull_number}/reviews/{review_id}",
        ],
        getReviewComment: ["GET /repos/{owner}/{repo}/pulls/comments/{comment_id}"],
        list: ["GET /repos/{owner}/{repo}/pulls"],
        listCommentsForReview: [
            "GET /repos/{owner}/{repo}/pulls/{pull_number}/reviews/{review_id}/comments",
        ],
        listCommits: ["GET /repos/{owner}/{repo}/pulls/{pull_number}/commits"],
        listFiles: ["GET /repos/{owner}/{repo}/pulls/{pull_number}/files"],
        listRequestedReviewers: [
            "GET /repos/{owner}/{repo}/pulls/{pull_number}/requested_reviewers",
        ],
        listReviewComments: [
            "GET /repos/{owner}/{repo}/pulls/{pull_number}/comments",
        ],
        listReviewCommentsForRepo: ["GET /repos/{owner}/{repo}/pulls/comments"],
        listReviews: ["GET /repos/{owner}/{repo}/pulls/{pull_number}/reviews"],
        merge: ["PUT /repos/{owner}/{repo}/pulls/{pull_number}/merge"],
        removeRequestedReviewers: [
            "DELETE /repos/{owner}/{repo}/pulls/{pull_number}/requested_reviewers",
        ],
        requestReviewers: [
            "POST /repos/{owner}/{repo}/pulls/{pull_number}/requested_reviewers",
        ],
        submitReview: [
            "POST /repos/{owner}/{repo}/pulls/{pull_number}/reviews/{review_id}/events",
        ],
        update: ["PATCH /repos/{owner}/{repo}/pulls/{pull_number}"],
        updateBranch: [
            "PUT /repos/{owner}/{repo}/pulls/{pull_number}/update-branch",
            { mediaType: { previews: ["lydian"] } },
        ],
        updateReview: [
            "PUT /repos/{owner}/{repo}/pulls/{pull_number}/reviews/{review_id}",
        ],
        updateReviewComment: [
            "PATCH /repos/{owner}/{repo}/pulls/comments/{comment_id}",
        ],
    },
    rateLimit: { get: ["GET /rate_limit"] },
    reactions: {
        createForCommitComment: [
            "POST /repos/{owner}/{repo}/comments/{comment_id}/reactions",
            { mediaType: { previews: ["squirrel-girl"] } },
        ],
        createForIssue: [
            "POST /repos/{owner}/{repo}/issues/{issue_number}/reactions",
            { mediaType: { previews: ["squirrel-girl"] } },
        ],
        createForIssueComment: [
            "POST /repos/{owner}/{repo}/issues/comments/{comment_id}/reactions",
            { mediaType: { previews: ["squirrel-girl"] } },
        ],
        createForPullRequestReviewComment: [
            "POST /repos/{owner}/{repo}/pulls/comments/{comment_id}/reactions",
            { mediaType: { previews: ["squirrel-girl"] } },
        ],
        createForTeamDiscussionCommentInOrg: [
            "POST /orgs/{org}/teams/{team_slug}/discussions/{discussion_number}/comments/{comment_number}/reactions",
            { mediaType: { previews: ["squirrel-girl"] } },
        ],
        createForTeamDiscussionInOrg: [
            "POST /orgs/{org}/teams/{team_slug}/discussions/{discussion_number}/reactions",
            { mediaType: { previews: ["squirrel-girl"] } },
        ],
        deleteForCommitComment: [
            "DELETE /repos/{owner}/{repo}/comments/{comment_id}/reactions/{reaction_id}",
            { mediaType: { previews: ["squirrel-girl"] } },
        ],
        deleteForIssue: [
            "DELETE /repos/{owner}/{repo}/issues/{issue_number}/reactions/{reaction_id}",
            { mediaType: { previews: ["squirrel-girl"] } },
        ],
        deleteForIssueComment: [
            "DELETE /repos/{owner}/{repo}/issues/comments/{comment_id}/reactions/{reaction_id}",
            { mediaType: { previews: ["squirrel-girl"] } },
        ],
        deleteForPullRequestComment: [
            "DELETE /repos/{owner}/{repo}/pulls/comments/{comment_id}/reactions/{reaction_id}",
            { mediaType: { previews: ["squirrel-girl"] } },
        ],
        deleteForTeamDiscussion: [
            "DELETE /orgs/{org}/teams/{team_slug}/discussions/{discussion_number}/reactions/{reaction_id}",
            { mediaType: { previews: ["squirrel-girl"] } },
        ],
        deleteForTeamDiscussionComment: [
            "DELETE /orgs/{org}/teams/{team_slug}/discussions/{discussion_number}/comments/{comment_number}/reactions/{reaction_id}",
            { mediaType: { previews: ["squirrel-girl"] } },
        ],
        deleteLegacy: [
            "DELETE /reactions/{reaction_id}",
            { mediaType: { previews: ["squirrel-girl"] } },
            {
                deprecated: "octokit.reactions.deleteLegacy() is deprecated, see https://developer.github.com/v3/reactions/#delete-a-reaction-legacy",
            },
        ],
        listForCommitComment: [
            "GET /repos/{owner}/{repo}/comments/{comment_id}/reactions",
            { mediaType: { previews: ["squirrel-girl"] } },
        ],
        listForIssue: [
            "GET /repos/{owner}/{repo}/issues/{issue_number}/reactions",
            { mediaType: { previews: ["squirrel-girl"] } },
        ],
        listForIssueComment: [
            "GET /repos/{owner}/{repo}/issues/comments/{comment_id}/reactions",
            { mediaType: { previews: ["squirrel-girl"] } },
        ],
        listForPullRequestReviewComment: [
            "GET /repos/{owner}/{repo}/pulls/comments/{comment_id}/reactions",
            { mediaType: { previews: ["squirrel-girl"] } },
        ],
        listForTeamDiscussionCommentInOrg: [
            "GET /orgs/{org}/teams/{team_slug}/discussions/{discussion_number}/comments/{comment_number}/reactions",
            { mediaType: { previews: ["squirrel-girl"] } },
        ],
        listForTeamDiscussionInOrg: [
            "GET /orgs/{org}/teams/{team_slug}/discussions/{discussion_number}/reactions",
            { mediaType: { previews: ["squirrel-girl"] } },
        ],
    },
    repos: {
        acceptInvitation: ["PATCH /user/repository_invitations/{invitation_id}"],
        addAppAccessRestrictions: [
            "POST /repos/{owner}/{repo}/branches/{branch}/protection/restrictions/apps",
            {},
            { mapToData: "apps" },
        ],
        addCollaborator: ["PUT /repos/{owner}/{repo}/collaborators/{username}"],
        addStatusCheckContexts: [
            "POST /repos/{owner}/{repo}/branches/{branch}/protection/required_status_checks/contexts",
            {},
            { mapToData: "contexts" },
        ],
        addTeamAccessRestrictions: [
            "POST /repos/{owner}/{repo}/branches/{branch}/protection/restrictions/teams",
            {},
            { mapToData: "teams" },
        ],
        addUserAccessRestrictions: [
            "POST /repos/{owner}/{repo}/branches/{branch}/protection/restrictions/users",
            {},
            { mapToData: "users" },
        ],
        checkCollaborator: ["GET /repos/{owner}/{repo}/collaborators/{username}"],
        checkVulnerabilityAlerts: [
            "GET /repos/{owner}/{repo}/vulnerability-alerts",
            { mediaType: { previews: ["dorian"] } },
        ],
        compareCommits: ["GET /repos/{owner}/{repo}/compare/{base}...{head}"],
        createCommitComment: [
            "POST /repos/{owner}/{repo}/commits/{commit_sha}/comments",
        ],
        createCommitSignatureProtection: [
            "POST /repos/{owner}/{repo}/branches/{branch}/protection/required_signatures",
            { mediaType: { previews: ["zzzax"] } },
        ],
        createCommitStatus: ["POST /repos/{owner}/{repo}/statuses/{sha}"],
        createDeployKey: ["POST /repos/{owner}/{repo}/keys"],
        createDeployment: ["POST /repos/{owner}/{repo}/deployments"],
        createDeploymentStatus: [
            "POST /repos/{owner}/{repo}/deployments/{deployment_id}/statuses",
        ],
        createDispatchEvent: ["POST /repos/{owner}/{repo}/dispatches"],
        createForAuthenticatedUser: ["POST /user/repos"],
        createFork: ["POST /repos/{owner}/{repo}/forks"],
        createInOrg: ["POST /orgs/{org}/repos"],
        createOrUpdateFileContents: ["PUT /repos/{owner}/{repo}/contents/{path}"],
        createPagesSite: [
            "POST /repos/{owner}/{repo}/pages",
            { mediaType: { previews: ["switcheroo"] } },
        ],
        createRelease: ["POST /repos/{owner}/{repo}/releases"],
        createUsingTemplate: [
            "POST /repos/{template_owner}/{template_repo}/generate",
            { mediaType: { previews: ["baptiste"] } },
        ],
        createWebhook: ["POST /repos/{owner}/{repo}/hooks"],
        declineInvitation: ["DELETE /user/repository_invitations/{invitation_id}"],
        delete: ["DELETE /repos/{owner}/{repo}"],
        deleteAccessRestrictions: [
            "DELETE /repos/{owner}/{repo}/branches/{branch}/protection/restrictions",
        ],
        deleteAdminBranchProtection: [
            "DELETE /repos/{owner}/{repo}/branches/{branch}/protection/enforce_admins",
        ],
        deleteBranchProtection: [
            "DELETE /repos/{owner}/{repo}/branches/{branch}/protection",
        ],
        deleteCommitComment: ["DELETE /repos/{owner}/{repo}/comments/{comment_id}"],
        deleteCommitSignatureProtection: [
            "DELETE /repos/{owner}/{repo}/branches/{branch}/protection/required_signatures",
            { mediaType: { previews: ["zzzax"] } },
        ],
        deleteDeployKey: ["DELETE /repos/{owner}/{repo}/keys/{key_id}"],
        deleteDeployment: [
            "DELETE /repos/{owner}/{repo}/deployments/{deployment_id}",
        ],
        deleteFile: ["DELETE /repos/{owner}/{repo}/contents/{path}"],
        deleteInvitation: [
            "DELETE /repos/{owner}/{repo}/invitations/{invitation_id}",
        ],
        deletePagesSite: [
            "DELETE /repos/{owner}/{repo}/pages",
            { mediaType: { previews: ["switcheroo"] } },
        ],
        deletePullRequestReviewProtection: [
            "DELETE /repos/{owner}/{repo}/branches/{branch}/protection/required_pull_request_reviews",
        ],
        deleteRelease: ["DELETE /repos/{owner}/{repo}/releases/{release_id}"],
        deleteReleaseAsset: [
            "DELETE /repos/{owner}/{repo}/releases/assets/{asset_id}",
        ],
        deleteWebhook: ["DELETE /repos/{owner}/{repo}/hooks/{hook_id}"],
        disableAutomatedSecurityFixes: [
            "DELETE /repos/{owner}/{repo}/automated-security-fixes",
            { mediaType: { previews: ["london"] } },
        ],
        disableVulnerabilityAlerts: [
            "DELETE /repos/{owner}/{repo}/vulnerability-alerts",
            { mediaType: { previews: ["dorian"] } },
        ],
        downloadArchive: ["GET /repos/{owner}/{repo}/{archive_format}/{ref}"],
        enableAutomatedSecurityFixes: [
            "PUT /repos/{owner}/{repo}/automated-security-fixes",
            { mediaType: { previews: ["london"] } },
        ],
        enableVulnerabilityAlerts: [
            "PUT /repos/{owner}/{repo}/vulnerability-alerts",
            { mediaType: { previews: ["dorian"] } },
        ],
        get: ["GET /repos/{owner}/{repo}"],
        getAccessRestrictions: [
            "GET /repos/{owner}/{repo}/branches/{branch}/protection/restrictions",
        ],
        getAdminBranchProtection: [
            "GET /repos/{owner}/{repo}/branches/{branch}/protection/enforce_admins",
        ],
        getAllStatusCheckContexts: [
            "GET /repos/{owner}/{repo}/branches/{branch}/protection/required_status_checks/contexts",
        ],
        getAllTopics: [
            "GET /repos/{owner}/{repo}/topics",
            { mediaType: { previews: ["mercy"] } },
        ],
        getAppsWithAccessToProtectedBranch: [
            "GET /repos/{owner}/{repo}/branches/{branch}/protection/restrictions/apps",
        ],
        getBranch: ["GET /repos/{owner}/{repo}/branches/{branch}"],
        getBranchProtection: [
            "GET /repos/{owner}/{repo}/branches/{branch}/protection",
        ],
        getClones: ["GET /repos/{owner}/{repo}/traffic/clones"],
        getCodeFrequencyStats: ["GET /repos/{owner}/{repo}/stats/code_frequency"],
        getCollaboratorPermissionLevel: [
            "GET /repos/{owner}/{repo}/collaborators/{username}/permission",
        ],
        getCombinedStatusForRef: ["GET /repos/{owner}/{repo}/commits/{ref}/status"],
        getCommit: ["GET /repos/{owner}/{repo}/commits/{ref}"],
        getCommitActivityStats: ["GET /repos/{owner}/{repo}/stats/commit_activity"],
        getCommitComment: ["GET /repos/{owner}/{repo}/comments/{comment_id}"],
        getCommitSignatureProtection: [
            "GET /repos/{owner}/{repo}/branches/{branch}/protection/required_signatures",
            { mediaType: { previews: ["zzzax"] } },
        ],
        getCommunityProfileMetrics: [
            "GET /repos/{owner}/{repo}/community/profile",
            { mediaType: { previews: ["black-panther"] } },
        ],
        getContent: ["GET /repos/{owner}/{repo}/contents/{path}"],
        getContributorsStats: ["GET /repos/{owner}/{repo}/stats/contributors"],
        getDeployKey: ["GET /repos/{owner}/{repo}/keys/{key_id}"],
        getDeployment: ["GET /repos/{owner}/{repo}/deployments/{deployment_id}"],
        getDeploymentStatus: [
            "GET /repos/{owner}/{repo}/deployments/{deployment_id}/statuses/{status_id}",
        ],
        getLatestPagesBuild: ["GET /repos/{owner}/{repo}/pages/builds/latest"],
        getLatestRelease: ["GET /repos/{owner}/{repo}/releases/latest"],
        getPages: ["GET /repos/{owner}/{repo}/pages"],
        getPagesBuild: ["GET /repos/{owner}/{repo}/pages/builds/{build_id}"],
        getParticipationStats: ["GET /repos/{owner}/{repo}/stats/participation"],
        getPullRequestReviewProtection: [
            "GET /repos/{owner}/{repo}/branches/{branch}/protection/required_pull_request_reviews",
        ],
        getPunchCardStats: ["GET /repos/{owner}/{repo}/stats/punch_card"],
        getReadme: ["GET /repos/{owner}/{repo}/readme"],
        getRelease: ["GET /repos/{owner}/{repo}/releases/{release_id}"],
        getReleaseAsset: ["GET /repos/{owner}/{repo}/releases/assets/{asset_id}"],
        getReleaseByTag: ["GET /repos/{owner}/{repo}/releases/tags/{tag}"],
        getStatusChecksProtection: [
            "GET /repos/{owner}/{repo}/branches/{branch}/protection/required_status_checks",
        ],
        getTeamsWithAccessToProtectedBranch: [
            "GET /repos/{owner}/{repo}/branches/{branch}/protection/restrictions/teams",
        ],
        getTopPaths: ["GET /repos/{owner}/{repo}/traffic/popular/paths"],
        getTopReferrers: ["GET /repos/{owner}/{repo}/traffic/popular/referrers"],
        getUsersWithAccessToProtectedBranch: [
            "GET /repos/{owner}/{repo}/branches/{branch}/protection/restrictions/users",
        ],
        getViews: ["GET /repos/{owner}/{repo}/traffic/views"],
        getWebhook: ["GET /repos/{owner}/{repo}/hooks/{hook_id}"],
        listBranches: ["GET /repos/{owner}/{repo}/branches"],
        listBranchesForHeadCommit: [
            "GET /repos/{owner}/{repo}/commits/{commit_sha}/branches-where-head",
            { mediaType: { previews: ["groot"] } },
        ],
        listCollaborators: ["GET /repos/{owner}/{repo}/collaborators"],
        listCommentsForCommit: [
            "GET /repos/{owner}/{repo}/commits/{commit_sha}/comments",
        ],
        listCommitCommentsForRepo: ["GET /repos/{owner}/{repo}/comments"],
        listCommitStatusesForRef: [
            "GET /repos/{owner}/{repo}/commits/{ref}/statuses",
        ],
        listCommits: ["GET /repos/{owner}/{repo}/commits"],
        listContributors: ["GET /repos/{owner}/{repo}/contributors"],
        listDeployKeys: ["GET /repos/{owner}/{repo}/keys"],
        listDeploymentStatuses: [
            "GET /repos/{owner}/{repo}/deployments/{deployment_id}/statuses",
        ],
        listDeployments: ["GET /repos/{owner}/{repo}/deployments"],
        listForAuthenticatedUser: ["GET /user/repos"],
        listForOrg: ["GET /orgs/{org}/repos"],
        listForUser: ["GET /users/{username}/repos"],
        listForks: ["GET /repos/{owner}/{repo}/forks"],
        listInvitations: ["GET /repos/{owner}/{repo}/invitations"],
        listInvitationsForAuthenticatedUser: ["GET /user/repository_invitations"],
        listLanguages: ["GET /repos/{owner}/{repo}/languages"],
        listPagesBuilds: ["GET /repos/{owner}/{repo}/pages/builds"],
        listPublic: ["GET /repositories"],
        listPullRequestsAssociatedWithCommit: [
            "GET /repos/{owner}/{repo}/commits/{commit_sha}/pulls",
            { mediaType: { previews: ["groot"] } },
        ],
        listReleaseAssets: [
            "GET /repos/{owner}/{repo}/releases/{release_id}/assets",
        ],
        listReleases: ["GET /repos/{owner}/{repo}/releases"],
        listTags: ["GET /repos/{owner}/{repo}/tags"],
        listTeams: ["GET /repos/{owner}/{repo}/teams"],
        listWebhooks: ["GET /repos/{owner}/{repo}/hooks"],
        merge: ["POST /repos/{owner}/{repo}/merges"],
        pingWebhook: ["POST /repos/{owner}/{repo}/hooks/{hook_id}/pings"],
        removeAppAccessRestrictions: [
            "DELETE /repos/{owner}/{repo}/branches/{branch}/protection/restrictions/apps",
            {},
            { mapToData: "apps" },
        ],
        removeCollaborator: [
            "DELETE /repos/{owner}/{repo}/collaborators/{username}",
        ],
        removeStatusCheckContexts: [
            "DELETE /repos/{owner}/{repo}/branches/{branch}/protection/required_status_checks/contexts",
            {},
            { mapToData: "contexts" },
        ],
        removeStatusCheckProtection: [
            "DELETE /repos/{owner}/{repo}/branches/{branch}/protection/required_status_checks",
        ],
        removeTeamAccessRestrictions: [
            "DELETE /repos/{owner}/{repo}/branches/{branch}/protection/restrictions/teams",
            {},
            { mapToData: "teams" },
        ],
        removeUserAccessRestrictions: [
            "DELETE /repos/{owner}/{repo}/branches/{branch}/protection/restrictions/users",
            {},
            { mapToData: "users" },
        ],
        replaceAllTopics: [
            "PUT /repos/{owner}/{repo}/topics",
            { mediaType: { previews: ["mercy"] } },
        ],
        requestPagesBuild: ["POST /repos/{owner}/{repo}/pages/builds"],
        setAdminBranchProtection: [
            "POST /repos/{owner}/{repo}/branches/{branch}/protection/enforce_admins",
        ],
        setAppAccessRestrictions: [
            "PUT /repos/{owner}/{repo}/branches/{branch}/protection/restrictions/apps",
            {},
            { mapToData: "apps" },
        ],
        setStatusCheckContexts: [
            "PUT /repos/{owner}/{repo}/branches/{branch}/protection/required_status_checks/contexts",
            {},
            { mapToData: "contexts" },
        ],
        setTeamAccessRestrictions: [
            "PUT /repos/{owner}/{repo}/branches/{branch}/protection/restrictions/teams",
            {},
            { mapToData: "teams" },
        ],
        setUserAccessRestrictions: [
            "PUT /repos/{owner}/{repo}/branches/{branch}/protection/restrictions/users",
            {},
            { mapToData: "users" },
        ],
        testPushWebhook: ["POST /repos/{owner}/{repo}/hooks/{hook_id}/tests"],
        transfer: ["POST /repos/{owner}/{repo}/transfer"],
        update: ["PATCH /repos/{owner}/{repo}"],
        updateBranchProtection: [
            "PUT /repos/{owner}/{repo}/branches/{branch}/protection",
        ],
        updateCommitComment: ["PATCH /repos/{owner}/{repo}/comments/{comment_id}"],
        updateInformationAboutPagesSite: ["PUT /repos/{owner}/{repo}/pages"],
        updateInvitation: [
            "PATCH /repos/{owner}/{repo}/invitations/{invitation_id}",
        ],
        updatePullRequestReviewProtection: [
            "PATCH /repos/{owner}/{repo}/branches/{branch}/protection/required_pull_request_reviews",
        ],
        updateRelease: ["PATCH /repos/{owner}/{repo}/releases/{release_id}"],
        updateReleaseAsset: [
            "PATCH /repos/{owner}/{repo}/releases/assets/{asset_id}",
        ],
        updateStatusCheckPotection: [
            "PATCH /repos/{owner}/{repo}/branches/{branch}/protection/required_status_checks",
        ],
        updateWebhook: ["PATCH /repos/{owner}/{repo}/hooks/{hook_id}"],
        uploadReleaseAsset: [
            "POST /repos/{owner}/{repo}/releases/{release_id}/assets{?name,label}",
            { baseUrl: "https://uploads.github.com" },
        ],
    },
    search: {
        code: ["GET /search/code"],
        commits: ["GET /search/commits", { mediaType: { previews: ["cloak"] } }],
        issuesAndPullRequests: ["GET /search/issues"],
        labels: ["GET /search/labels"],
        repos: ["GET /search/repositories"],
        topics: ["GET /search/topics", { mediaType: { previews: ["mercy"] } }],
        users: ["GET /search/users"],
    },
    teams: {
        addOrUpdateMembershipForUserInOrg: [
            "PUT /orgs/{org}/teams/{team_slug}/memberships/{username}",
        ],
        addOrUpdateProjectPermissionsInOrg: [
            "PUT /orgs/{org}/teams/{team_slug}/projects/{project_id}",
            { mediaType: { previews: ["inertia"] } },
        ],
        addOrUpdateRepoPermissionsInOrg: [
            "PUT /orgs/{org}/teams/{team_slug}/repos/{owner}/{repo}",
        ],
        checkPermissionsForProjectInOrg: [
            "GET /orgs/{org}/teams/{team_slug}/projects/{project_id}",
            { mediaType: { previews: ["inertia"] } },
        ],
        checkPermissionsForRepoInOrg: [
            "GET /orgs/{org}/teams/{team_slug}/repos/{owner}/{repo}",
        ],
        create: ["POST /orgs/{org}/teams"],
        createDiscussionCommentInOrg: [
            "POST /orgs/{org}/teams/{team_slug}/discussions/{discussion_number}/comments",
        ],
        createDiscussionInOrg: ["POST /orgs/{org}/teams/{team_slug}/discussions"],
        deleteDiscussionCommentInOrg: [
            "DELETE /orgs/{org}/teams/{team_slug}/discussions/{discussion_number}/comments/{comment_number}",
        ],
        deleteDiscussionInOrg: [
            "DELETE /orgs/{org}/teams/{team_slug}/discussions/{discussion_number}",
        ],
        deleteInOrg: ["DELETE /orgs/{org}/teams/{team_slug}"],
        getByName: ["GET /orgs/{org}/teams/{team_slug}"],
        getDiscussionCommentInOrg: [
            "GET /orgs/{org}/teams/{team_slug}/discussions/{discussion_number}/comments/{comment_number}",
        ],
        getDiscussionInOrg: [
            "GET /orgs/{org}/teams/{team_slug}/discussions/{discussion_number}",
        ],
        getMembershipForUserInOrg: [
            "GET /orgs/{org}/teams/{team_slug}/memberships/{username}",
        ],
        list: ["GET /orgs/{org}/teams"],
        listChildInOrg: ["GET /orgs/{org}/teams/{team_slug}/teams"],
        listDiscussionCommentsInOrg: [
            "GET /orgs/{org}/teams/{team_slug}/discussions/{discussion_number}/comments",
        ],
        listDiscussionsInOrg: ["GET /orgs/{org}/teams/{team_slug}/discussions"],
        listForAuthenticatedUser: ["GET /user/teams"],
        listMembersInOrg: ["GET /orgs/{org}/teams/{team_slug}/members"],
        listPendingInvitationsInOrg: [
            "GET /orgs/{org}/teams/{team_slug}/invitations",
        ],
        listProjectsInOrg: [
            "GET /orgs/{org}/teams/{team_slug}/projects",
            { mediaType: { previews: ["inertia"] } },
        ],
        listReposInOrg: ["GET /orgs/{org}/teams/{team_slug}/repos"],
        removeMembershipForUserInOrg: [
            "DELETE /orgs/{org}/teams/{team_slug}/memberships/{username}",
        ],
        removeProjectInOrg: [
            "DELETE /orgs/{org}/teams/{team_slug}/projects/{project_id}",
        ],
        removeRepoInOrg: [
            "DELETE /orgs/{org}/teams/{team_slug}/repos/{owner}/{repo}",
        ],
        updateDiscussionCommentInOrg: [
            "PATCH /orgs/{org}/teams/{team_slug}/discussions/{discussion_number}/comments/{comment_number}",
        ],
        updateDiscussionInOrg: [
            "PATCH /orgs/{org}/teams/{team_slug}/discussions/{discussion_number}",
        ],
        updateInOrg: ["PATCH /orgs/{org}/teams/{team_slug}"],
    },
    users: {
        addEmailForAuthenticated: ["POST /user/emails"],
        block: ["PUT /user/blocks/{username}"],
        checkBlocked: ["GET /user/blocks/{username}"],
        checkFollowingForUser: ["GET /users/{username}/following/{target_user}"],
        checkPersonIsFollowedByAuthenticated: ["GET /user/following/{username}"],
        createGpgKeyForAuthenticated: ["POST /user/gpg_keys"],
        createPublicSshKeyForAuthenticated: ["POST /user/keys"],
        deleteEmailForAuthenticated: ["DELETE /user/emails"],
        deleteGpgKeyForAuthenticated: ["DELETE /user/gpg_keys/{gpg_key_id}"],
        deletePublicSshKeyForAuthenticated: ["DELETE /user/keys/{key_id}"],
        follow: ["PUT /user/following/{username}"],
        getAuthenticated: ["GET /user"],
        getByUsername: ["GET /users/{username}"],
        getContextForUser: ["GET /users/{username}/hovercard"],
        getGpgKeyForAuthenticated: ["GET /user/gpg_keys/{gpg_key_id}"],
        getPublicSshKeyForAuthenticated: ["GET /user/keys/{key_id}"],
        list: ["GET /users"],
        listBlockedByAuthenticated: ["GET /user/blocks"],
        listEmailsForAuthenticated: ["GET /user/emails"],
        listFollowedByAuthenticated: ["GET /user/following"],
        listFollowersForAuthenticatedUser: ["GET /user/followers"],
        listFollowersForUser: ["GET /users/{username}/followers"],
        listFollowingForUser: ["GET /users/{username}/following"],
        listGpgKeysForAuthenticated: ["GET /user/gpg_keys"],
        listGpgKeysForUser: ["GET /users/{username}/gpg_keys"],
        listPublicEmailsForAuthenticated: ["GET /user/public_emails"],
        listPublicKeysForUser: ["GET /users/{username}/keys"],
        listPublicSshKeysForAuthenticated: ["GET /user/keys"],
        setPrimaryEmailVisibilityForAuthenticated: ["PATCH /user/email/visibility"],
        unblock: ["DELETE /user/blocks/{username}"],
        unfollow: ["DELETE /user/following/{username}"],
        updateAuthenticated: ["PATCH /user"],
    },
};

const VERSION$6 = "4.1.4";

function endpointsToMethods(octokit, endpointsMap) {
    const newMethods = {};
    for (const [scope, endpoints] of Object.entries(endpointsMap)) {
        for (const [methodName, endpoint] of Object.entries(endpoints)) {
            const [route, defaults, decorations] = endpoint;
            const [method, url] = route.split(/ /);
            const endpointDefaults = Object.assign({ method, url }, defaults);
            if (!newMethods[scope]) {
                newMethods[scope] = {};
            }
            const scopeMethods = newMethods[scope];
            if (decorations) {
                scopeMethods[methodName] = decorate(octokit, scope, methodName, endpointDefaults, decorations);
                continue;
            }
            scopeMethods[methodName] = octokit.request.defaults(endpointDefaults);
        }
    }
    return newMethods;
}
function decorate(octokit, scope, methodName, defaults, decorations) {
    const requestWithDefaults = octokit.request.defaults(defaults);
    /* istanbul ignore next */
    function withDecorations(...args) {
        // @ts-ignore https://github.com/microsoft/TypeScript/issues/25488
        let options = requestWithDefaults.endpoint.merge(...args);
        // There are currently no other decorations than `.mapToData`
        if (decorations.mapToData) {
            options = Object.assign({}, options, {
                data: options[decorations.mapToData],
                [decorations.mapToData]: undefined,
            });
            return requestWithDefaults(options);
        }
        if (decorations.renamed) {
            const [newScope, newMethodName] = decorations.renamed;
            octokit.log.warn(`octokit.${scope}.${methodName}() has been renamed to octokit.${newScope}.${newMethodName}()`);
        }
        if (decorations.deprecated) {
            octokit.log.warn(decorations.deprecated);
        }
        if (decorations.renamedParameters) {
            // @ts-ignore https://github.com/microsoft/TypeScript/issues/25488
            const options = requestWithDefaults.endpoint.merge(...args);
            for (const [name, alias] of Object.entries(decorations.renamedParameters)) {
                if (name in options) {
                    octokit.log.warn(`"${name}" parameter is deprecated for "octokit.${scope}.${methodName}()". Use "${alias}" instead`);
                    if (!(alias in options)) {
                        options[alias] = options[name];
                    }
                    delete options[name];
                }
            }
            return requestWithDefaults(options);
        }
        // @ts-ignore https://github.com/microsoft/TypeScript/issues/25488
        return requestWithDefaults(...args);
    }
    return Object.assign(withDecorations, requestWithDefaults);
}

/**
 * This plugin is a 1:1 copy of internal @octokit/rest plugins. The primary
 * goal is to rebuild @octokit/rest on top of @octokit/core. Once that is
 * done, we will remove the registerEndpoints methods and return the methods
 * directly as with the other plugins. At that point we will also remove the
 * legacy workarounds and deprecations.
 *
 * See the plan at
 * https://github.com/octokit/plugin-rest-endpoint-methods.js/pull/1
 */
function restEndpointMethods(octokit) {
    return endpointsToMethods(octokit, Endpoints);
}
restEndpointMethods.VERSION = VERSION$6;

const VERSION$7 = "18.0.5";

const Octokit$1 = Octokit.plugin(requestLog, restEndpointMethods, paginateRest).defaults({
    userAgent: `octokit-rest.js/${VERSION$7}`,
});

var endpointsByScope = {
    actions: {
        cancelWorkflowRun: {
            method: "POST",
            params: {
                owner: { required: true, type: "string" },
                repo: { required: true, type: "string" },
                run_id: { required: true, type: "integer" }
            },
            url: "/repos/:owner/:repo/actions/runs/:run_id/cancel"
        },
        createOrUpdateSecretForRepo: {
            method: "PUT",
            params: {
                encrypted_value: { type: "string" },
                key_id: { type: "string" },
                name: { required: true, type: "string" },
                owner: { required: true, type: "string" },
                repo: { required: true, type: "string" }
            },
            url: "/repos/:owner/:repo/actions/secrets/:name"
        },
        createRegistrationToken: {
            method: "POST",
            params: {
                owner: { required: true, type: "string" },
                repo: { required: true, type: "string" }
            },
            url: "/repos/:owner/:repo/actions/runners/registration-token"
        },
        createRemoveToken: {
            method: "POST",
            params: {
                owner: { required: true, type: "string" },
                repo: { required: true, type: "string" }
            },
            url: "/repos/:owner/:repo/actions/runners/remove-token"
        },
        deleteArtifact: {
            method: "DELETE",
            params: {
                artifact_id: { required: true, type: "integer" },
                owner: { required: true, type: "string" },
                repo: { required: true, type: "string" }
            },
            url: "/repos/:owner/:repo/actions/artifacts/:artifact_id"
        },
        deleteSecretFromRepo: {
            method: "DELETE",
            params: {
                name: { required: true, type: "string" },
                owner: { required: true, type: "string" },
                repo: { required: true, type: "string" }
            },
            url: "/repos/:owner/:repo/actions/secrets/:name"
        },
        downloadArtifact: {
            method: "GET",
            params: {
                archive_format: { required: true, type: "string" },
                artifact_id: { required: true, type: "integer" },
                owner: { required: true, type: "string" },
                repo: { required: true, type: "string" }
            },
            url: "/repos/:owner/:repo/actions/artifacts/:artifact_id/:archive_format"
        },
        getArtifact: {
            method: "GET",
            params: {
                artifact_id: { required: true, type: "integer" },
                owner: { required: true, type: "string" },
                repo: { required: true, type: "string" }
            },
            url: "/repos/:owner/:repo/actions/artifacts/:artifact_id"
        },
        getPublicKey: {
            method: "GET",
            params: {
                owner: { required: true, type: "string" },
                repo: { required: true, type: "string" }
            },
            url: "/repos/:owner/:repo/actions/secrets/public-key"
        },
        getSecret: {
            method: "GET",
            params: {
                name: { required: true, type: "string" },
                owner: { required: true, type: "string" },
                page: { type: "integer" },
                per_page: { type: "integer" },
                repo: { required: true, type: "string" }
            },
            url: "/repos/:owner/:repo/actions/secrets/:name"
        },
        getSelfHostedRunner: {
            method: "GET",
            params: {
                owner: { required: true, type: "string" },
                repo: { required: true, type: "string" },
                runner_id: { required: true, type: "integer" }
            },
            url: "/repos/:owner/:repo/actions/runners/:runner_id"
        },
        getWorkflow: {
            method: "GET",
            params: {
                owner: { required: true, type: "string" },
                repo: { required: true, type: "string" },
                workflow_id: { required: true, type: "integer" }
            },
            url: "/repos/:owner/:repo/actions/workflows/:workflow_id"
        },
        getWorkflowJob: {
            method: "GET",
            params: {
                job_id: { required: true, type: "integer" },
                owner: { required: true, type: "string" },
                repo: { required: true, type: "string" }
            },
            url: "/repos/:owner/:repo/actions/jobs/:job_id"
        },
        getWorkflowRun: {
            method: "GET",
            params: {
                owner: { required: true, type: "string" },
                repo: { required: true, type: "string" },
                run_id: { required: true, type: "integer" }
            },
            url: "/repos/:owner/:repo/actions/runs/:run_id"
        },
        listDownloadsForSelfHostedRunnerApplication: {
            method: "GET",
            params: {
                owner: { required: true, type: "string" },
                repo: { required: true, type: "string" }
            },
            url: "/repos/:owner/:repo/actions/runners/downloads"
        },
        listJobsForWorkflowRun: {
            method: "GET",
            params: {
                owner: { required: true, type: "string" },
                page: { type: "integer" },
                per_page: { type: "integer" },
                repo: { required: true, type: "string" },
                run_id: { required: true, type: "integer" }
            },
            url: "/repos/:owner/:repo/actions/runs/:run_id/jobs"
        },
        listRepoWorkflowRuns: {
            method: "GET",
            params: {
                actor: { type: "string" },
                branch: { type: "string" },
                event: { type: "string" },
                owner: { required: true, type: "string" },
                page: { type: "integer" },
                per_page: { type: "integer" },
                repo: { required: true, type: "string" },
                status: { enum: ["completed", "status", "conclusion"], type: "string" }
            },
            url: "/repos/:owner/:repo/actions/runs"
        },
        listRepoWorkflows: {
            method: "GET",
            params: {
                owner: { required: true, type: "string" },
                page: { type: "integer" },
                per_page: { type: "integer" },
                repo: { required: true, type: "string" }
            },
            url: "/repos/:owner/:repo/actions/workflows"
        },
        listSecretsForRepo: {
            method: "GET",
            params: {
                owner: { required: true, type: "string" },
                page: { type: "integer" },
                per_page: { type: "integer" },
                repo: { required: true, type: "string" }
            },
            url: "/repos/:owner/:repo/actions/secrets"
        },
        listSelfHostedRunnersForRepo: {
            method: "GET",
            params: {
                owner: { required: true, type: "string" },
                page: { type: "integer" },
                per_page: { type: "integer" },
                repo: { required: true, type: "string" }
            },
            url: "/repos/:owner/:repo/actions/runners"
        },
        listWorkflowJobLogs: {
            method: "GET",
            params: {
                job_id: { required: true, type: "integer" },
                owner: { required: true, type: "string" },
                page: { type: "integer" },
                per_page: { type: "integer" },
                repo: { required: true, type: "string" }
            },
            url: "/repos/:owner/:repo/actions/jobs/:job_id/logs"
        },
        listWorkflowRunArtifacts: {
            method: "GET",
            params: {
                owner: { required: true, type: "string" },
                page: { type: "integer" },
                per_page: { type: "integer" },
                repo: { required: true, type: "string" },
                run_id: { required: true, type: "integer" }
            },
            url: "/repos/:owner/:repo/actions/runs/:run_id/artifacts"
        },
        listWorkflowRunLogs: {
            method: "GET",
            params: {
                owner: { required: true, type: "string" },
                page: { type: "integer" },
                per_page: { type: "integer" },
                repo: { required: true, type: "string" },
                run_id: { required: true, type: "integer" }
            },
            url: "/repos/:owner/:repo/actions/runs/:run_id/logs"
        },
        listWorkflowRuns: {
            method: "GET",
            params: {
                actor: { type: "string" },
                branch: { type: "string" },
                event: { type: "string" },
                owner: { required: true, type: "string" },
                page: { type: "integer" },
                per_page: { type: "integer" },
                repo: { required: true, type: "string" },
                status: { enum: ["completed", "status", "conclusion"], type: "string" },
                workflow_id: { required: true, type: "integer" }
            },
            url: "/repos/:owner/:repo/actions/workflows/:workflow_id/runs"
        },
        reRunWorkflow: {
            method: "POST",
            params: {
                owner: { required: true, type: "string" },
                repo: { required: true, type: "string" },
                run_id: { required: true, type: "integer" }
            },
            url: "/repos/:owner/:repo/actions/runs/:run_id/rerun"
        },
        removeSelfHostedRunner: {
            method: "DELETE",
            params: {
                owner: { required: true, type: "string" },
                repo: { required: true, type: "string" },
                runner_id: { required: true, type: "integer" }
            },
            url: "/repos/:owner/:repo/actions/runners/:runner_id"
        }
    },
    activity: {
        checkStarringRepo: {
            method: "GET",
            params: {
                owner: { required: true, type: "string" },
                repo: { required: true, type: "string" }
            },
            url: "/user/starred/:owner/:repo"
        },
        deleteRepoSubscription: {
            method: "DELETE",
            params: {
                owner: { required: true, type: "string" },
                repo: { required: true, type: "string" }
            },
            url: "/repos/:owner/:repo/subscription"
        },
        deleteThreadSubscription: {
            method: "DELETE",
            params: { thread_id: { required: true, type: "integer" } },
            url: "/notifications/threads/:thread_id/subscription"
        },
        getRepoSubscription: {
            method: "GET",
            params: {
                owner: { required: true, type: "string" },
                repo: { required: true, type: "string" }
            },
            url: "/repos/:owner/:repo/subscription"
        },
        getThread: {
            method: "GET",
            params: { thread_id: { required: true, type: "integer" } },
            url: "/notifications/threads/:thread_id"
        },
        getThreadSubscription: {
            method: "GET",
            params: { thread_id: { required: true, type: "integer" } },
            url: "/notifications/threads/:thread_id/subscription"
        },
        listEventsForOrg: {
            method: "GET",
            params: {
                org: { required: true, type: "string" },
                page: { type: "integer" },
                per_page: { type: "integer" },
                username: { required: true, type: "string" }
            },
            url: "/users/:username/events/orgs/:org"
        },
        listEventsForUser: {
            method: "GET",
            params: {
                page: { type: "integer" },
                per_page: { type: "integer" },
                username: { required: true, type: "string" }
            },
            url: "/users/:username/events"
        },
        listFeeds: { method: "GET", params: {}, url: "/feeds" },
        listNotifications: {
            method: "GET",
            params: {
                all: { type: "boolean" },
                before: { type: "string" },
                page: { type: "integer" },
                participating: { type: "boolean" },
                per_page: { type: "integer" },
                since: { type: "string" }
            },
            url: "/notifications"
        },
        listNotificationsForRepo: {
            method: "GET",
            params: {
                all: { type: "boolean" },
                before: { type: "string" },
                owner: { required: true, type: "string" },
                page: { type: "integer" },
                participating: { type: "boolean" },
                per_page: { type: "integer" },
                repo: { required: true, type: "string" },
                since: { type: "string" }
            },
            url: "/repos/:owner/:repo/notifications"
        },
        listPublicEvents: {
            method: "GET",
            params: { page: { type: "integer" }, per_page: { type: "integer" } },
            url: "/events"
        },
        listPublicEventsForOrg: {
            method: "GET",
            params: {
                org: { required: true, type: "string" },
                page: { type: "integer" },
                per_page: { type: "integer" }
            },
            url: "/orgs/:org/events"
        },
        listPublicEventsForRepoNetwork: {
            method: "GET",
            params: {
                owner: { required: true, type: "string" },
                page: { type: "integer" },
                per_page: { type: "integer" },
                repo: { required: true, type: "string" }
            },
            url: "/networks/:owner/:repo/events"
        },
        listPublicEventsForUser: {
            method: "GET",
            params: {
                page: { type: "integer" },
                per_page: { type: "integer" },
                username: { required: true, type: "string" }
            },
            url: "/users/:username/events/public"
        },
        listReceivedEventsForUser: {
            method: "GET",
            params: {
                page: { type: "integer" },
                per_page: { type: "integer" },
                username: { required: true, type: "string" }
            },
            url: "/users/:username/received_events"
        },
        listReceivedPublicEventsForUser: {
            method: "GET",
            params: {
                page: { type: "integer" },
                per_page: { type: "integer" },
                username: { required: true, type: "string" }
            },
            url: "/users/:username/received_events/public"
        },
        listRepoEvents: {
            method: "GET",
            params: {
                owner: { required: true, type: "string" },
                page: { type: "integer" },
                per_page: { type: "integer" },
                repo: { required: true, type: "string" }
            },
            url: "/repos/:owner/:repo/events"
        },
        listReposStarredByAuthenticatedUser: {
            method: "GET",
            params: {
                direction: { enum: ["asc", "desc"], type: "string" },
                page: { type: "integer" },
                per_page: { type: "integer" },
                sort: { enum: ["created", "updated"], type: "string" }
            },
            url: "/user/starred"
        },
        listReposStarredByUser: {
            method: "GET",
            params: {
                direction: { enum: ["asc", "desc"], type: "string" },
                page: { type: "integer" },
                per_page: { type: "integer" },
                sort: { enum: ["created", "updated"], type: "string" },
                username: { required: true, type: "string" }
            },
            url: "/users/:username/starred"
        },
        listReposWatchedByUser: {
            method: "GET",
            params: {
                page: { type: "integer" },
                per_page: { type: "integer" },
                username: { required: true, type: "string" }
            },
            url: "/users/:username/subscriptions"
        },
        listStargazersForRepo: {
            method: "GET",
            params: {
                owner: { required: true, type: "string" },
                page: { type: "integer" },
                per_page: { type: "integer" },
                repo: { required: true, type: "string" }
            },
            url: "/repos/:owner/:repo/stargazers"
        },
        listWatchedReposForAuthenticatedUser: {
            method: "GET",
            params: { page: { type: "integer" }, per_page: { type: "integer" } },
            url: "/user/subscriptions"
        },
        listWatchersForRepo: {
            method: "GET",
            params: {
                owner: { required: true, type: "string" },
                page: { type: "integer" },
                per_page: { type: "integer" },
                repo: { required: true, type: "string" }
            },
            url: "/repos/:owner/:repo/subscribers"
        },
        markAsRead: {
            method: "PUT",
            params: { last_read_at: { type: "string" } },
            url: "/notifications"
        },
        markNotificationsAsReadForRepo: {
            method: "PUT",
            params: {
                last_read_at: { type: "string" },
                owner: { required: true, type: "string" },
                repo: { required: true, type: "string" }
            },
            url: "/repos/:owner/:repo/notifications"
        },
        markThreadAsRead: {
            method: "PATCH",
            params: { thread_id: { required: true, type: "integer" } },
            url: "/notifications/threads/:thread_id"
        },
        setRepoSubscription: {
            method: "PUT",
            params: {
                ignored: { type: "boolean" },
                owner: { required: true, type: "string" },
                repo: { required: true, type: "string" },
                subscribed: { type: "boolean" }
            },
            url: "/repos/:owner/:repo/subscription"
        },
        setThreadSubscription: {
            method: "PUT",
            params: {
                ignored: { type: "boolean" },
                thread_id: { required: true, type: "integer" }
            },
            url: "/notifications/threads/:thread_id/subscription"
        },
        starRepo: {
            method: "PUT",
            params: {
                owner: { required: true, type: "string" },
                repo: { required: true, type: "string" }
            },
            url: "/user/starred/:owner/:repo"
        },
        unstarRepo: {
            method: "DELETE",
            params: {
                owner: { required: true, type: "string" },
                repo: { required: true, type: "string" }
            },
            url: "/user/starred/:owner/:repo"
        }
    },
    apps: {
        addRepoToInstallation: {
            headers: { accept: "application/vnd.github.machine-man-preview+json" },
            method: "PUT",
            params: {
                installation_id: { required: true, type: "integer" },
                repository_id: { required: true, type: "integer" }
            },
            url: "/user/installations/:installation_id/repositories/:repository_id"
        },
        checkAccountIsAssociatedWithAny: {
            method: "GET",
            params: { account_id: { required: true, type: "integer" } },
            url: "/marketplace_listing/accounts/:account_id"
        },
        checkAccountIsAssociatedWithAnyStubbed: {
            method: "GET",
            params: { account_id: { required: true, type: "integer" } },
            url: "/marketplace_listing/stubbed/accounts/:account_id"
        },
        checkAuthorization: {
            deprecated: "octokit.apps.checkAuthorization() is deprecated, see https://developer.github.com/v3/apps/oauth_applications/#check-an-authorization",
            method: "GET",
            params: {
                access_token: { required: true, type: "string" },
                client_id: { required: true, type: "string" }
            },
            url: "/applications/:client_id/tokens/:access_token"
        },
        checkToken: {
            headers: { accept: "application/vnd.github.doctor-strange-preview+json" },
            method: "POST",
            params: {
                access_token: { type: "string" },
                client_id: { required: true, type: "string" }
            },
            url: "/applications/:client_id/token"
        },
        createContentAttachment: {
            headers: { accept: "application/vnd.github.corsair-preview+json" },
            method: "POST",
            params: {
                body: { required: true, type: "string" },
                content_reference_id: { required: true, type: "integer" },
                title: { required: true, type: "string" }
            },
            url: "/content_references/:content_reference_id/attachments"
        },
        createFromManifest: {
            headers: { accept: "application/vnd.github.fury-preview+json" },
            method: "POST",
            params: { code: { required: true, type: "string" } },
            url: "/app-manifests/:code/conversions"
        },
        createInstallationToken: {
            headers: { accept: "application/vnd.github.machine-man-preview+json" },
            method: "POST",
            params: {
                installation_id: { required: true, type: "integer" },
                permissions: { type: "object" },
                repository_ids: { type: "integer[]" }
            },
            url: "/app/installations/:installation_id/access_tokens"
        },
        deleteAuthorization: {
            headers: { accept: "application/vnd.github.doctor-strange-preview+json" },
            method: "DELETE",
            params: {
                access_token: { type: "string" },
                client_id: { required: true, type: "string" }
            },
            url: "/applications/:client_id/grant"
        },
        deleteInstallation: {
            headers: {
                accept: "application/vnd.github.gambit-preview+json,application/vnd.github.machine-man-preview+json"
            },
            method: "DELETE",
            params: { installation_id: { required: true, type: "integer" } },
            url: "/app/installations/:installation_id"
        },
        deleteToken: {
            headers: { accept: "application/vnd.github.doctor-strange-preview+json" },
            method: "DELETE",
            params: {
                access_token: { type: "string" },
                client_id: { required: true, type: "string" }
            },
            url: "/applications/:client_id/token"
        },
        findOrgInstallation: {
            deprecated: "octokit.apps.findOrgInstallation() has been renamed to octokit.apps.getOrgInstallation() (2019-04-10)",
            headers: { accept: "application/vnd.github.machine-man-preview+json" },
            method: "GET",
            params: { org: { required: true, type: "string" } },
            url: "/orgs/:org/installation"
        },
        findRepoInstallation: {
            deprecated: "octokit.apps.findRepoInstallation() has been renamed to octokit.apps.getRepoInstallation() (2019-04-10)",
            headers: { accept: "application/vnd.github.machine-man-preview+json" },
            method: "GET",
            params: {
                owner: { required: true, type: "string" },
                repo: { required: true, type: "string" }
            },
            url: "/repos/:owner/:repo/installation"
        },
        findUserInstallation: {
            deprecated: "octokit.apps.findUserInstallation() has been renamed to octokit.apps.getUserInstallation() (2019-04-10)",
            headers: { accept: "application/vnd.github.machine-man-preview+json" },
            method: "GET",
            params: { username: { required: true, type: "string" } },
            url: "/users/:username/installation"
        },
        getAuthenticated: {
            headers: { accept: "application/vnd.github.machine-man-preview+json" },
            method: "GET",
            params: {},
            url: "/app"
        },
        getBySlug: {
            headers: { accept: "application/vnd.github.machine-man-preview+json" },
            method: "GET",
            params: { app_slug: { required: true, type: "string" } },
            url: "/apps/:app_slug"
        },
        getInstallation: {
            headers: { accept: "application/vnd.github.machine-man-preview+json" },
            method: "GET",
            params: { installation_id: { required: true, type: "integer" } },
            url: "/app/installations/:installation_id"
        },
        getOrgInstallation: {
            headers: { accept: "application/vnd.github.machine-man-preview+json" },
            method: "GET",
            params: { org: { required: true, type: "string" } },
            url: "/orgs/:org/installation"
        },
        getRepoInstallation: {
            headers: { accept: "application/vnd.github.machine-man-preview+json" },
            method: "GET",
            params: {
                owner: { required: true, type: "string" },
                repo: { required: true, type: "string" }
            },
            url: "/repos/:owner/:repo/installation"
        },
        getUserInstallation: {
            headers: { accept: "application/vnd.github.machine-man-preview+json" },
            method: "GET",
            params: { username: { required: true, type: "string" } },
            url: "/users/:username/installation"
        },
        listAccountsUserOrOrgOnPlan: {
            method: "GET",
            params: {
                direction: { enum: ["asc", "desc"], type: "string" },
                page: { type: "integer" },
                per_page: { type: "integer" },
                plan_id: { required: true, type: "integer" },
                sort: { enum: ["created", "updated"], type: "string" }
            },
            url: "/marketplace_listing/plans/:plan_id/accounts"
        },
        listAccountsUserOrOrgOnPlanStubbed: {
            method: "GET",
            params: {
                direction: { enum: ["asc", "desc"], type: "string" },
                page: { type: "integer" },
                per_page: { type: "integer" },
                plan_id: { required: true, type: "integer" },
                sort: { enum: ["created", "updated"], type: "string" }
            },
            url: "/marketplace_listing/stubbed/plans/:plan_id/accounts"
        },
        listInstallationReposForAuthenticatedUser: {
            headers: { accept: "application/vnd.github.machine-man-preview+json" },
            method: "GET",
            params: {
                installation_id: { required: true, type: "integer" },
                page: { type: "integer" },
                per_page: { type: "integer" }
            },
            url: "/user/installations/:installation_id/repositories"
        },
        listInstallations: {
            headers: { accept: "application/vnd.github.machine-man-preview+json" },
            method: "GET",
            params: { page: { type: "integer" }, per_page: { type: "integer" } },
            url: "/app/installations"
        },
        listInstallationsForAuthenticatedUser: {
            headers: { accept: "application/vnd.github.machine-man-preview+json" },
            method: "GET",
            params: { page: { type: "integer" }, per_page: { type: "integer" } },
            url: "/user/installations"
        },
        listMarketplacePurchasesForAuthenticatedUser: {
            method: "GET",
            params: { page: { type: "integer" }, per_page: { type: "integer" } },
            url: "/user/marketplace_purchases"
        },
        listMarketplacePurchasesForAuthenticatedUserStubbed: {
            method: "GET",
            params: { page: { type: "integer" }, per_page: { type: "integer" } },
            url: "/user/marketplace_purchases/stubbed"
        },
        listPlans: {
            method: "GET",
            params: { page: { type: "integer" }, per_page: { type: "integer" } },
            url: "/marketplace_listing/plans"
        },
        listPlansStubbed: {
            method: "GET",
            params: { page: { type: "integer" }, per_page: { type: "integer" } },
            url: "/marketplace_listing/stubbed/plans"
        },
        listRepos: {
            headers: { accept: "application/vnd.github.machine-man-preview+json" },
            method: "GET",
            params: { page: { type: "integer" }, per_page: { type: "integer" } },
            url: "/installation/repositories"
        },
        removeRepoFromInstallation: {
            headers: { accept: "application/vnd.github.machine-man-preview+json" },
            method: "DELETE",
            params: {
                installation_id: { required: true, type: "integer" },
                repository_id: { required: true, type: "integer" }
            },
            url: "/user/installations/:installation_id/repositories/:repository_id"
        },
        resetAuthorization: {
            deprecated: "octokit.apps.resetAuthorization() is deprecated, see https://developer.github.com/v3/apps/oauth_applications/#reset-an-authorization",
            method: "POST",
            params: {
                access_token: { required: true, type: "string" },
                client_id: { required: true, type: "string" }
            },
            url: "/applications/:client_id/tokens/:access_token"
        },
        resetToken: {
            headers: { accept: "application/vnd.github.doctor-strange-preview+json" },
            method: "PATCH",
            params: {
                access_token: { type: "string" },
                client_id: { required: true, type: "string" }
            },
            url: "/applications/:client_id/token"
        },
        revokeAuthorizationForApplication: {
            deprecated: "octokit.apps.revokeAuthorizationForApplication() is deprecated, see https://developer.github.com/v3/apps/oauth_applications/#revoke-an-authorization-for-an-application",
            method: "DELETE",
            params: {
                access_token: { required: true, type: "string" },
                client_id: { required: true, type: "string" }
            },
            url: "/applications/:client_id/tokens/:access_token"
        },
        revokeGrantForApplication: {
            deprecated: "octokit.apps.revokeGrantForApplication() is deprecated, see https://developer.github.com/v3/apps/oauth_applications/#revoke-a-grant-for-an-application",
            method: "DELETE",
            params: {
                access_token: { required: true, type: "string" },
                client_id: { required: true, type: "string" }
            },
            url: "/applications/:client_id/grants/:access_token"
        },
        revokeInstallationToken: {
            headers: { accept: "application/vnd.github.gambit-preview+json" },
            method: "DELETE",
            params: {},
            url: "/installation/token"
        }
    },
    checks: {
        create: {
            headers: { accept: "application/vnd.github.antiope-preview+json" },
            method: "POST",
            params: {
                actions: { type: "object[]" },
                "actions[].description": { required: true, type: "string" },
                "actions[].identifier": { required: true, type: "string" },
                "actions[].label": { required: true, type: "string" },
                completed_at: { type: "string" },
                conclusion: {
                    enum: [
                        "success",
                        "failure",
                        "neutral",
                        "cancelled",
                        "timed_out",
                        "action_required"
                    ],
                    type: "string"
                },
                details_url: { type: "string" },
                external_id: { type: "string" },
                head_sha: { required: true, type: "string" },
                name: { required: true, type: "string" },
                output: { type: "object" },
                "output.annotations": { type: "object[]" },
                "output.annotations[].annotation_level": {
                    enum: ["notice", "warning", "failure"],
                    required: true,
                    type: "string"
                },
                "output.annotations[].end_column": { type: "integer" },
                "output.annotations[].end_line": { required: true, type: "integer" },
                "output.annotations[].message": { required: true, type: "string" },
                "output.annotations[].path": { required: true, type: "string" },
                "output.annotations[].raw_details": { type: "string" },
                "output.annotations[].start_column": { type: "integer" },
                "output.annotations[].start_line": { required: true, type: "integer" },
                "output.annotations[].title": { type: "string" },
                "output.images": { type: "object[]" },
                "output.images[].alt": { required: true, type: "string" },
                "output.images[].caption": { type: "string" },
                "output.images[].image_url": { required: true, type: "string" },
                "output.summary": { required: true, type: "string" },
                "output.text": { type: "string" },
                "output.title": { required: true, type: "string" },
                owner: { required: true, type: "string" },
                repo: { required: true, type: "string" },
                started_at: { type: "string" },
                status: { enum: ["queued", "in_progress", "completed"], type: "string" }
            },
            url: "/repos/:owner/:repo/check-runs"
        },
        createSuite: {
            headers: { accept: "application/vnd.github.antiope-preview+json" },
            method: "POST",
            params: {
                head_sha: { required: true, type: "string" },
                owner: { required: true, type: "string" },
                repo: { required: true, type: "string" }
            },
            url: "/repos/:owner/:repo/check-suites"
        },
        get: {
            headers: { accept: "application/vnd.github.antiope-preview+json" },
            method: "GET",
            params: {
                check_run_id: { required: true, type: "integer" },
                owner: { required: true, type: "string" },
                repo: { required: true, type: "string" }
            },
            url: "/repos/:owner/:repo/check-runs/:check_run_id"
        },
        getSuite: {
            headers: { accept: "application/vnd.github.antiope-preview+json" },
            method: "GET",
            params: {
                check_suite_id: { required: true, type: "integer" },
                owner: { required: true, type: "string" },
                repo: { required: true, type: "string" }
            },
            url: "/repos/:owner/:repo/check-suites/:check_suite_id"
        },
        listAnnotations: {
            headers: { accept: "application/vnd.github.antiope-preview+json" },
            method: "GET",
            params: {
                check_run_id: { required: true, type: "integer" },
                owner: { required: true, type: "string" },
                page: { type: "integer" },
                per_page: { type: "integer" },
                repo: { required: true, type: "string" }
            },
            url: "/repos/:owner/:repo/check-runs/:check_run_id/annotations"
        },
        listForRef: {
            headers: { accept: "application/vnd.github.antiope-preview+json" },
            method: "GET",
            params: {
                check_name: { type: "string" },
                filter: { enum: ["latest", "all"], type: "string" },
                owner: { required: true, type: "string" },
                page: { type: "integer" },
                per_page: { type: "integer" },
                ref: { required: true, type: "string" },
                repo: { required: true, type: "string" },
                status: { enum: ["queued", "in_progress", "completed"], type: "string" }
            },
            url: "/repos/:owner/:repo/commits/:ref/check-runs"
        },
        listForSuite: {
            headers: { accept: "application/vnd.github.antiope-preview+json" },
            method: "GET",
            params: {
                check_name: { type: "string" },
                check_suite_id: { required: true, type: "integer" },
                filter: { enum: ["latest", "all"], type: "string" },
                owner: { required: true, type: "string" },
                page: { type: "integer" },
                per_page: { type: "integer" },
                repo: { required: true, type: "string" },
                status: { enum: ["queued", "in_progress", "completed"], type: "string" }
            },
            url: "/repos/:owner/:repo/check-suites/:check_suite_id/check-runs"
        },
        listSuitesForRef: {
            headers: { accept: "application/vnd.github.antiope-preview+json" },
            method: "GET",
            params: {
                app_id: { type: "integer" },
                check_name: { type: "string" },
                owner: { required: true, type: "string" },
                page: { type: "integer" },
                per_page: { type: "integer" },
                ref: { required: true, type: "string" },
                repo: { required: true, type: "string" }
            },
            url: "/repos/:owner/:repo/commits/:ref/check-suites"
        },
        rerequestSuite: {
            headers: { accept: "application/vnd.github.antiope-preview+json" },
            method: "POST",
            params: {
                check_suite_id: { required: true, type: "integer" },
                owner: { required: true, type: "string" },
                repo: { required: true, type: "string" }
            },
            url: "/repos/:owner/:repo/check-suites/:check_suite_id/rerequest"
        },
        setSuitesPreferences: {
            headers: { accept: "application/vnd.github.antiope-preview+json" },
            method: "PATCH",
            params: {
                auto_trigger_checks: { type: "object[]" },
                "auto_trigger_checks[].app_id": { required: true, type: "integer" },
                "auto_trigger_checks[].setting": { required: true, type: "boolean" },
                owner: { required: true, type: "string" },
                repo: { required: true, type: "string" }
            },
            url: "/repos/:owner/:repo/check-suites/preferences"
        },
        update: {
            headers: { accept: "application/vnd.github.antiope-preview+json" },
            method: "PATCH",
            params: {
                actions: { type: "object[]" },
                "actions[].description": { required: true, type: "string" },
                "actions[].identifier": { required: true, type: "string" },
                "actions[].label": { required: true, type: "string" },
                check_run_id: { required: true, type: "integer" },
                completed_at: { type: "string" },
                conclusion: {
                    enum: [
                        "success",
                        "failure",
                        "neutral",
                        "cancelled",
                        "timed_out",
                        "action_required"
                    ],
                    type: "string"
                },
                details_url: { type: "string" },
                external_id: { type: "string" },
                name: { type: "string" },
                output: { type: "object" },
                "output.annotations": { type: "object[]" },
                "output.annotations[].annotation_level": {
                    enum: ["notice", "warning", "failure"],
                    required: true,
                    type: "string"
                },
                "output.annotations[].end_column": { type: "integer" },
                "output.annotations[].end_line": { required: true, type: "integer" },
                "output.annotations[].message": { required: true, type: "string" },
                "output.annotations[].path": { required: true, type: "string" },
                "output.annotations[].raw_details": { type: "string" },
                "output.annotations[].start_column": { type: "integer" },
                "output.annotations[].start_line": { required: true, type: "integer" },
                "output.annotations[].title": { type: "string" },
                "output.images": { type: "object[]" },
                "output.images[].alt": { required: true, type: "string" },
                "output.images[].caption": { type: "string" },
                "output.images[].image_url": { required: true, type: "string" },
                "output.summary": { required: true, type: "string" },
                "output.text": { type: "string" },
                "output.title": { type: "string" },
                owner: { required: true, type: "string" },
                repo: { required: true, type: "string" },
                started_at: { type: "string" },
                status: { enum: ["queued", "in_progress", "completed"], type: "string" }
            },
            url: "/repos/:owner/:repo/check-runs/:check_run_id"
        }
    },
    codesOfConduct: {
        getConductCode: {
            headers: { accept: "application/vnd.github.scarlet-witch-preview+json" },
            method: "GET",
            params: { key: { required: true, type: "string" } },
            url: "/codes_of_conduct/:key"
        },
        getForRepo: {
            headers: { accept: "application/vnd.github.scarlet-witch-preview+json" },
            method: "GET",
            params: {
                owner: { required: true, type: "string" },
                repo: { required: true, type: "string" }
            },
            url: "/repos/:owner/:repo/community/code_of_conduct"
        },
        listConductCodes: {
            headers: { accept: "application/vnd.github.scarlet-witch-preview+json" },
            method: "GET",
            params: {},
            url: "/codes_of_conduct"
        }
    },
    emojis: { get: { method: "GET", params: {}, url: "/emojis" } },
    gists: {
        checkIsStarred: {
            method: "GET",
            params: { gist_id: { required: true, type: "string" } },
            url: "/gists/:gist_id/star"
        },
        create: {
            method: "POST",
            params: {
                description: { type: "string" },
                files: { required: true, type: "object" },
                "files.content": { type: "string" },
                public: { type: "boolean" }
            },
            url: "/gists"
        },
        createComment: {
            method: "POST",
            params: {
                body: { required: true, type: "string" },
                gist_id: { required: true, type: "string" }
            },
            url: "/gists/:gist_id/comments"
        },
        delete: {
            method: "DELETE",
            params: { gist_id: { required: true, type: "string" } },
            url: "/gists/:gist_id"
        },
        deleteComment: {
            method: "DELETE",
            params: {
                comment_id: { required: true, type: "integer" },
                gist_id: { required: true, type: "string" }
            },
            url: "/gists/:gist_id/comments/:comment_id"
        },
        fork: {
            method: "POST",
            params: { gist_id: { required: true, type: "string" } },
            url: "/gists/:gist_id/forks"
        },
        get: {
            method: "GET",
            params: { gist_id: { required: true, type: "string" } },
            url: "/gists/:gist_id"
        },
        getComment: {
            method: "GET",
            params: {
                comment_id: { required: true, type: "integer" },
                gist_id: { required: true, type: "string" }
            },
            url: "/gists/:gist_id/comments/:comment_id"
        },
        getRevision: {
            method: "GET",
            params: {
                gist_id: { required: true, type: "string" },
                sha: { required: true, type: "string" }
            },
            url: "/gists/:gist_id/:sha"
        },
        list: {
            method: "GET",
            params: {
                page: { type: "integer" },
                per_page: { type: "integer" },
                since: { type: "string" }
            },
            url: "/gists"
        },
        listComments: {
            method: "GET",
            params: {
                gist_id: { required: true, type: "string" },
                page: { type: "integer" },
                per_page: { type: "integer" }
            },
            url: "/gists/:gist_id/comments"
        },
        listCommits: {
            method: "GET",
            params: {
                gist_id: { required: true, type: "string" },
                page: { type: "integer" },
                per_page: { type: "integer" }
            },
            url: "/gists/:gist_id/commits"
        },
        listForks: {
            method: "GET",
            params: {
                gist_id: { required: true, type: "string" },
                page: { type: "integer" },
                per_page: { type: "integer" }
            },
            url: "/gists/:gist_id/forks"
        },
        listPublic: {
            method: "GET",
            params: {
                page: { type: "integer" },
                per_page: { type: "integer" },
                since: { type: "string" }
            },
            url: "/gists/public"
        },
        listPublicForUser: {
            method: "GET",
            params: {
                page: { type: "integer" },
                per_page: { type: "integer" },
                since: { type: "string" },
                username: { required: true, type: "string" }
            },
            url: "/users/:username/gists"
        },
        listStarred: {
            method: "GET",
            params: {
                page: { type: "integer" },
                per_page: { type: "integer" },
                since: { type: "string" }
            },
            url: "/gists/starred"
        },
        star: {
            method: "PUT",
            params: { gist_id: { required: true, type: "string" } },
            url: "/gists/:gist_id/star"
        },
        unstar: {
            method: "DELETE",
            params: { gist_id: { required: true, type: "string" } },
            url: "/gists/:gist_id/star"
        },
        update: {
            method: "PATCH",
            params: {
                description: { type: "string" },
                files: { type: "object" },
                "files.content": { type: "string" },
                "files.filename": { type: "string" },
                gist_id: { required: true, type: "string" }
            },
            url: "/gists/:gist_id"
        },
        updateComment: {
            method: "PATCH",
            params: {
                body: { required: true, type: "string" },
                comment_id: { required: true, type: "integer" },
                gist_id: { required: true, type: "string" }
            },
            url: "/gists/:gist_id/comments/:comment_id"
        }
    },
    git: {
        createBlob: {
            method: "POST",
            params: {
                content: { required: true, type: "string" },
                encoding: { type: "string" },
                owner: { required: true, type: "string" },
                repo: { required: true, type: "string" }
            },
            url: "/repos/:owner/:repo/git/blobs"
        },
        createCommit: {
            method: "POST",
            params: {
                author: { type: "object" },
                "author.date": { type: "string" },
                "author.email": { type: "string" },
                "author.name": { type: "string" },
                committer: { type: "object" },
                "committer.date": { type: "string" },
                "committer.email": { type: "string" },
                "committer.name": { type: "string" },
                message: { required: true, type: "string" },
                owner: { required: true, type: "string" },
                parents: { required: true, type: "string[]" },
                repo: { required: true, type: "string" },
                signature: { type: "string" },
                tree: { required: true, type: "string" }
            },
            url: "/repos/:owner/:repo/git/commits"
        },
        createRef: {
            method: "POST",
            params: {
                owner: { required: true, type: "string" },
                ref: { required: true, type: "string" },
                repo: { required: true, type: "string" },
                sha: { required: true, type: "string" }
            },
            url: "/repos/:owner/:repo/git/refs"
        },
        createTag: {
            method: "POST",
            params: {
                message: { required: true, type: "string" },
                object: { required: true, type: "string" },
                owner: { required: true, type: "string" },
                repo: { required: true, type: "string" },
                tag: { required: true, type: "string" },
                tagger: { type: "object" },
                "tagger.date": { type: "string" },
                "tagger.email": { type: "string" },
                "tagger.name": { type: "string" },
                type: {
                    enum: ["commit", "tree", "blob"],
                    required: true,
                    type: "string"
                }
            },
            url: "/repos/:owner/:repo/git/tags"
        },
        createTree: {
            method: "POST",
            params: {
                base_tree: { type: "string" },
                owner: { required: true, type: "string" },
                repo: { required: true, type: "string" },
                tree: { required: true, type: "object[]" },
                "tree[].content": { type: "string" },
                "tree[].mode": {
                    enum: ["100644", "100755", "040000", "160000", "120000"],
                    type: "string"
                },
                "tree[].path": { type: "string" },
                "tree[].sha": { allowNull: true, type: "string" },
                "tree[].type": { enum: ["blob", "tree", "commit"], type: "string" }
            },
            url: "/repos/:owner/:repo/git/trees"
        },
        deleteRef: {
            method: "DELETE",
            params: {
                owner: { required: true, type: "string" },
                ref: { required: true, type: "string" },
                repo: { required: true, type: "string" }
            },
            url: "/repos/:owner/:repo/git/refs/:ref"
        },
        getBlob: {
            method: "GET",
            params: {
                file_sha: { required: true, type: "string" },
                owner: { required: true, type: "string" },
                repo: { required: true, type: "string" }
            },
            url: "/repos/:owner/:repo/git/blobs/:file_sha"
        },
        getCommit: {
            method: "GET",
            params: {
                commit_sha: { required: true, type: "string" },
                owner: { required: true, type: "string" },
                repo: { required: true, type: "string" }
            },
            url: "/repos/:owner/:repo/git/commits/:commit_sha"
        },
        getRef: {
            method: "GET",
            params: {
                owner: { required: true, type: "string" },
                ref: { required: true, type: "string" },
                repo: { required: true, type: "string" }
            },
            url: "/repos/:owner/:repo/git/ref/:ref"
        },
        getTag: {
            method: "GET",
            params: {
                owner: { required: true, type: "string" },
                repo: { required: true, type: "string" },
                tag_sha: { required: true, type: "string" }
            },
            url: "/repos/:owner/:repo/git/tags/:tag_sha"
        },
        getTree: {
            method: "GET",
            params: {
                owner: { required: true, type: "string" },
                recursive: { enum: ["1"], type: "integer" },
                repo: { required: true, type: "string" },
                tree_sha: { required: true, type: "string" }
            },
            url: "/repos/:owner/:repo/git/trees/:tree_sha"
        },
        listMatchingRefs: {
            method: "GET",
            params: {
                owner: { required: true, type: "string" },
                page: { type: "integer" },
                per_page: { type: "integer" },
                ref: { required: true, type: "string" },
                repo: { required: true, type: "string" }
            },
            url: "/repos/:owner/:repo/git/matching-refs/:ref"
        },
        listRefs: {
            method: "GET",
            params: {
                namespace: { type: "string" },
                owner: { required: true, type: "string" },
                page: { type: "integer" },
                per_page: { type: "integer" },
                repo: { required: true, type: "string" }
            },
            url: "/repos/:owner/:repo/git/refs/:namespace"
        },
        updateRef: {
            method: "PATCH",
            params: {
                force: { type: "boolean" },
                owner: { required: true, type: "string" },
                ref: { required: true, type: "string" },
                repo: { required: true, type: "string" },
                sha: { required: true, type: "string" }
            },
            url: "/repos/:owner/:repo/git/refs/:ref"
        }
    },
    gitignore: {
        getTemplate: {
            method: "GET",
            params: { name: { required: true, type: "string" } },
            url: "/gitignore/templates/:name"
        },
        listTemplates: { method: "GET", params: {}, url: "/gitignore/templates" }
    },
    interactions: {
        addOrUpdateRestrictionsForOrg: {
            headers: { accept: "application/vnd.github.sombra-preview+json" },
            method: "PUT",
            params: {
                limit: {
                    enum: ["existing_users", "contributors_only", "collaborators_only"],
                    required: true,
                    type: "string"
                },
                org: { required: true, type: "string" }
            },
            url: "/orgs/:org/interaction-limits"
        },
        addOrUpdateRestrictionsForRepo: {
            headers: { accept: "application/vnd.github.sombra-preview+json" },
            method: "PUT",
            params: {
                limit: {
                    enum: ["existing_users", "contributors_only", "collaborators_only"],
                    required: true,
                    type: "string"
                },
                owner: { required: true, type: "string" },
                repo: { required: true, type: "string" }
            },
            url: "/repos/:owner/:repo/interaction-limits"
        },
        getRestrictionsForOrg: {
            headers: { accept: "application/vnd.github.sombra-preview+json" },
            method: "GET",
            params: { org: { required: true, type: "string" } },
            url: "/orgs/:org/interaction-limits"
        },
        getRestrictionsForRepo: {
            headers: { accept: "application/vnd.github.sombra-preview+json" },
            method: "GET",
            params: {
                owner: { required: true, type: "string" },
                repo: { required: true, type: "string" }
            },
            url: "/repos/:owner/:repo/interaction-limits"
        },
        removeRestrictionsForOrg: {
            headers: { accept: "application/vnd.github.sombra-preview+json" },
            method: "DELETE",
            params: { org: { required: true, type: "string" } },
            url: "/orgs/:org/interaction-limits"
        },
        removeRestrictionsForRepo: {
            headers: { accept: "application/vnd.github.sombra-preview+json" },
            method: "DELETE",
            params: {
                owner: { required: true, type: "string" },
                repo: { required: true, type: "string" }
            },
            url: "/repos/:owner/:repo/interaction-limits"
        }
    },
    issues: {
        addAssignees: {
            method: "POST",
            params: {
                assignees: { type: "string[]" },
                issue_number: { required: true, type: "integer" },
                number: { alias: "issue_number", deprecated: true, type: "integer" },
                owner: { required: true, type: "string" },
                repo: { required: true, type: "string" }
            },
            url: "/repos/:owner/:repo/issues/:issue_number/assignees"
        },
        addLabels: {
            method: "POST",
            params: {
                issue_number: { required: true, type: "integer" },
                labels: { required: true, type: "string[]" },
                number: { alias: "issue_number", deprecated: true, type: "integer" },
                owner: { required: true, type: "string" },
                repo: { required: true, type: "string" }
            },
            url: "/repos/:owner/:repo/issues/:issue_number/labels"
        },
        checkAssignee: {
            method: "GET",
            params: {
                assignee: { required: true, type: "string" },
                owner: { required: true, type: "string" },
                repo: { required: true, type: "string" }
            },
            url: "/repos/:owner/:repo/assignees/:assignee"
        },
        create: {
            method: "POST",
            params: {
                assignee: { type: "string" },
                assignees: { type: "string[]" },
                body: { type: "string" },
                labels: { type: "string[]" },
                milestone: { type: "integer" },
                owner: { required: true, type: "string" },
                repo: { required: true, type: "string" },
                title: { required: true, type: "string" }
            },
            url: "/repos/:owner/:repo/issues"
        },
        createComment: {
            method: "POST",
            params: {
                body: { required: true, type: "string" },
                issue_number: { required: true, type: "integer" },
                number: { alias: "issue_number", deprecated: true, type: "integer" },
                owner: { required: true, type: "string" },
                repo: { required: true, type: "string" }
            },
            url: "/repos/:owner/:repo/issues/:issue_number/comments"
        },
        createLabel: {
            method: "POST",
            params: {
                color: { required: true, type: "string" },
                description: { type: "string" },
                name: { required: true, type: "string" },
                owner: { required: true, type: "string" },
                repo: { required: true, type: "string" }
            },
            url: "/repos/:owner/:repo/labels"
        },
        createMilestone: {
            method: "POST",
            params: {
                description: { type: "string" },
                due_on: { type: "string" },
                owner: { required: true, type: "string" },
                repo: { required: true, type: "string" },
                state: { enum: ["open", "closed"], type: "string" },
                title: { required: true, type: "string" }
            },
            url: "/repos/:owner/:repo/milestones"
        },
        deleteComment: {
            method: "DELETE",
            params: {
                comment_id: { required: true, type: "integer" },
                owner: { required: true, type: "string" },
                repo: { required: true, type: "string" }
            },
            url: "/repos/:owner/:repo/issues/comments/:comment_id"
        },
        deleteLabel: {
            method: "DELETE",
            params: {
                name: { required: true, type: "string" },
                owner: { required: true, type: "string" },
                repo: { required: true, type: "string" }
            },
            url: "/repos/:owner/:repo/labels/:name"
        },
        deleteMilestone: {
            method: "DELETE",
            params: {
                milestone_number: { required: true, type: "integer" },
                number: {
                    alias: "milestone_number",
                    deprecated: true,
                    type: "integer"
                },
                owner: { required: true, type: "string" },
                repo: { required: true, type: "string" }
            },
            url: "/repos/:owner/:repo/milestones/:milestone_number"
        },
        get: {
            method: "GET",
            params: {
                issue_number: { required: true, type: "integer" },
                number: { alias: "issue_number", deprecated: true, type: "integer" },
                owner: { required: true, type: "string" },
                repo: { required: true, type: "string" }
            },
            url: "/repos/:owner/:repo/issues/:issue_number"
        },
        getComment: {
            method: "GET",
            params: {
                comment_id: { required: true, type: "integer" },
                owner: { required: true, type: "string" },
                repo: { required: true, type: "string" }
            },
            url: "/repos/:owner/:repo/issues/comments/:comment_id"
        },
        getEvent: {
            method: "GET",
            params: {
                event_id: { required: true, type: "integer" },
                owner: { required: true, type: "string" },
                repo: { required: true, type: "string" }
            },
            url: "/repos/:owner/:repo/issues/events/:event_id"
        },
        getLabel: {
            method: "GET",
            params: {
                name: { required: true, type: "string" },
                owner: { required: true, type: "string" },
                repo: { required: true, type: "string" }
            },
            url: "/repos/:owner/:repo/labels/:name"
        },
        getMilestone: {
            method: "GET",
            params: {
                milestone_number: { required: true, type: "integer" },
                number: {
                    alias: "milestone_number",
                    deprecated: true,
                    type: "integer"
                },
                owner: { required: true, type: "string" },
                repo: { required: true, type: "string" }
            },
            url: "/repos/:owner/:repo/milestones/:milestone_number"
        },
        list: {
            method: "GET",
            params: {
                direction: { enum: ["asc", "desc"], type: "string" },
                filter: {
                    enum: ["assigned", "created", "mentioned", "subscribed", "all"],
                    type: "string"
                },
                labels: { type: "string" },
                page: { type: "integer" },
                per_page: { type: "integer" },
                since: { type: "string" },
                sort: { enum: ["created", "updated", "comments"], type: "string" },
                state: { enum: ["open", "closed", "all"], type: "string" }
            },
            url: "/issues"
        },
        listAssignees: {
            method: "GET",
            params: {
                owner: { required: true, type: "string" },
                page: { type: "integer" },
                per_page: { type: "integer" },
                repo: { required: true, type: "string" }
            },
            url: "/repos/:owner/:repo/assignees"
        },
        listComments: {
            method: "GET",
            params: {
                issue_number: { required: true, type: "integer" },
                number: { alias: "issue_number", deprecated: true, type: "integer" },
                owner: { required: true, type: "string" },
                page: { type: "integer" },
                per_page: { type: "integer" },
                repo: { required: true, type: "string" },
                since: { type: "string" }
            },
            url: "/repos/:owner/:repo/issues/:issue_number/comments"
        },
        listCommentsForRepo: {
            method: "GET",
            params: {
                direction: { enum: ["asc", "desc"], type: "string" },
                owner: { required: true, type: "string" },
                repo: { required: true, type: "string" },
                since: { type: "string" },
                sort: { enum: ["created", "updated"], type: "string" }
            },
            url: "/repos/:owner/:repo/issues/comments"
        },
        listEvents: {
            method: "GET",
            params: {
                issue_number: { required: true, type: "integer" },
                number: { alias: "issue_number", deprecated: true, type: "integer" },
                owner: { required: true, type: "string" },
                page: { type: "integer" },
                per_page: { type: "integer" },
                repo: { required: true, type: "string" }
            },
            url: "/repos/:owner/:repo/issues/:issue_number/events"
        },
        listEventsForRepo: {
            method: "GET",
            params: {
                owner: { required: true, type: "string" },
                page: { type: "integer" },
                per_page: { type: "integer" },
                repo: { required: true, type: "string" }
            },
            url: "/repos/:owner/:repo/issues/events"
        },
        listEventsForTimeline: {
            headers: { accept: "application/vnd.github.mockingbird-preview+json" },
            method: "GET",
            params: {
                issue_number: { required: true, type: "integer" },
                number: { alias: "issue_number", deprecated: true, type: "integer" },
                owner: { required: true, type: "string" },
                page: { type: "integer" },
                per_page: { type: "integer" },
                repo: { required: true, type: "string" }
            },
            url: "/repos/:owner/:repo/issues/:issue_number/timeline"
        },
        listForAuthenticatedUser: {
            method: "GET",
            params: {
                direction: { enum: ["asc", "desc"], type: "string" },
                filter: {
                    enum: ["assigned", "created", "mentioned", "subscribed", "all"],
                    type: "string"
                },
                labels: { type: "string" },
                page: { type: "integer" },
                per_page: { type: "integer" },
                since: { type: "string" },
                sort: { enum: ["created", "updated", "comments"], type: "string" },
                state: { enum: ["open", "closed", "all"], type: "string" }
            },
            url: "/user/issues"
        },
        listForOrg: {
            method: "GET",
            params: {
                direction: { enum: ["asc", "desc"], type: "string" },
                filter: {
                    enum: ["assigned", "created", "mentioned", "subscribed", "all"],
                    type: "string"
                },
                labels: { type: "string" },
                org: { required: true, type: "string" },
                page: { type: "integer" },
                per_page: { type: "integer" },
                since: { type: "string" },
                sort: { enum: ["created", "updated", "comments"], type: "string" },
                state: { enum: ["open", "closed", "all"], type: "string" }
            },
            url: "/orgs/:org/issues"
        },
        listForRepo: {
            method: "GET",
            params: {
                assignee: { type: "string" },
                creator: { type: "string" },
                direction: { enum: ["asc", "desc"], type: "string" },
                labels: { type: "string" },
                mentioned: { type: "string" },
                milestone: { type: "string" },
                owner: { required: true, type: "string" },
                page: { type: "integer" },
                per_page: { type: "integer" },
                repo: { required: true, type: "string" },
                since: { type: "string" },
                sort: { enum: ["created", "updated", "comments"], type: "string" },
                state: { enum: ["open", "closed", "all"], type: "string" }
            },
            url: "/repos/:owner/:repo/issues"
        },
        listLabelsForMilestone: {
            method: "GET",
            params: {
                milestone_number: { required: true, type: "integer" },
                number: {
                    alias: "milestone_number",
                    deprecated: true,
                    type: "integer"
                },
                owner: { required: true, type: "string" },
                page: { type: "integer" },
                per_page: { type: "integer" },
                repo: { required: true, type: "string" }
            },
            url: "/repos/:owner/:repo/milestones/:milestone_number/labels"
        },
        listLabelsForRepo: {
            method: "GET",
            params: {
                owner: { required: true, type: "string" },
                page: { type: "integer" },
                per_page: { type: "integer" },
                repo: { required: true, type: "string" }
            },
            url: "/repos/:owner/:repo/labels"
        },
        listLabelsOnIssue: {
            method: "GET",
            params: {
                issue_number: { required: true, type: "integer" },
                number: { alias: "issue_number", deprecated: true, type: "integer" },
                owner: { required: true, type: "string" },
                page: { type: "integer" },
                per_page: { type: "integer" },
                repo: { required: true, type: "string" }
            },
            url: "/repos/:owner/:repo/issues/:issue_number/labels"
        },
        listMilestonesForRepo: {
            method: "GET",
            params: {
                direction: { enum: ["asc", "desc"], type: "string" },
                owner: { required: true, type: "string" },
                page: { type: "integer" },
                per_page: { type: "integer" },
                repo: { required: true, type: "string" },
                sort: { enum: ["due_on", "completeness"], type: "string" },
                state: { enum: ["open", "closed", "all"], type: "string" }
            },
            url: "/repos/:owner/:repo/milestones"
        },
        lock: {
            method: "PUT",
            params: {
                issue_number: { required: true, type: "integer" },
                lock_reason: {
                    enum: ["off-topic", "too heated", "resolved", "spam"],
                    type: "string"
                },
                number: { alias: "issue_number", deprecated: true, type: "integer" },
                owner: { required: true, type: "string" },
                repo: { required: true, type: "string" }
            },
            url: "/repos/:owner/:repo/issues/:issue_number/lock"
        },
        removeAssignees: {
            method: "DELETE",
            params: {
                assignees: { type: "string[]" },
                issue_number: { required: true, type: "integer" },
                number: { alias: "issue_number", deprecated: true, type: "integer" },
                owner: { required: true, type: "string" },
                repo: { required: true, type: "string" }
            },
            url: "/repos/:owner/:repo/issues/:issue_number/assignees"
        },
        removeLabel: {
            method: "DELETE",
            params: {
                issue_number: { required: true, type: "integer" },
                name: { required: true, type: "string" },
                number: { alias: "issue_number", deprecated: true, type: "integer" },
                owner: { required: true, type: "string" },
                repo: { required: true, type: "string" }
            },
            url: "/repos/:owner/:repo/issues/:issue_number/labels/:name"
        },
        removeLabels: {
            method: "DELETE",
            params: {
                issue_number: { required: true, type: "integer" },
                number: { alias: "issue_number", deprecated: true, type: "integer" },
                owner: { required: true, type: "string" },
                repo: { required: true, type: "string" }
            },
            url: "/repos/:owner/:repo/issues/:issue_number/labels"
        },
        replaceLabels: {
            method: "PUT",
            params: {
                issue_number: { required: true, type: "integer" },
                labels: { type: "string[]" },
                number: { alias: "issue_number", deprecated: true, type: "integer" },
                owner: { required: true, type: "string" },
                repo: { required: true, type: "string" }
            },
            url: "/repos/:owner/:repo/issues/:issue_number/labels"
        },
        unlock: {
            method: "DELETE",
            params: {
                issue_number: { required: true, type: "integer" },
                number: { alias: "issue_number", deprecated: true, type: "integer" },
                owner: { required: true, type: "string" },
                repo: { required: true, type: "string" }
            },
            url: "/repos/:owner/:repo/issues/:issue_number/lock"
        },
        update: {
            method: "PATCH",
            params: {
                assignee: { type: "string" },
                assignees: { type: "string[]" },
                body: { type: "string" },
                issue_number: { required: true, type: "integer" },
                labels: { type: "string[]" },
                milestone: { allowNull: true, type: "integer" },
                number: { alias: "issue_number", deprecated: true, type: "integer" },
                owner: { required: true, type: "string" },
                repo: { required: true, type: "string" },
                state: { enum: ["open", "closed"], type: "string" },
                title: { type: "string" }
            },
            url: "/repos/:owner/:repo/issues/:issue_number"
        },
        updateComment: {
            method: "PATCH",
            params: {
                body: { required: true, type: "string" },
                comment_id: { required: true, type: "integer" },
                owner: { required: true, type: "string" },
                repo: { required: true, type: "string" }
            },
            url: "/repos/:owner/:repo/issues/comments/:comment_id"
        },
        updateLabel: {
            method: "PATCH",
            params: {
                color: { type: "string" },
                current_name: { required: true, type: "string" },
                description: { type: "string" },
                name: { type: "string" },
                owner: { required: true, type: "string" },
                repo: { required: true, type: "string" }
            },
            url: "/repos/:owner/:repo/labels/:current_name"
        },
        updateMilestone: {
            method: "PATCH",
            params: {
                description: { type: "string" },
                due_on: { type: "string" },
                milestone_number: { required: true, type: "integer" },
                number: {
                    alias: "milestone_number",
                    deprecated: true,
                    type: "integer"
                },
                owner: { required: true, type: "string" },
                repo: { required: true, type: "string" },
                state: { enum: ["open", "closed"], type: "string" },
                title: { type: "string" }
            },
            url: "/repos/:owner/:repo/milestones/:milestone_number"
        }
    },
    licenses: {
        get: {
            method: "GET",
            params: { license: { required: true, type: "string" } },
            url: "/licenses/:license"
        },
        getForRepo: {
            method: "GET",
            params: {
                owner: { required: true, type: "string" },
                repo: { required: true, type: "string" }
            },
            url: "/repos/:owner/:repo/license"
        },
        list: {
            deprecated: "octokit.licenses.list() has been renamed to octokit.licenses.listCommonlyUsed() (2019-03-05)",
            method: "GET",
            params: {},
            url: "/licenses"
        },
        listCommonlyUsed: { method: "GET", params: {}, url: "/licenses" }
    },
    markdown: {
        render: {
            method: "POST",
            params: {
                context: { type: "string" },
                mode: { enum: ["markdown", "gfm"], type: "string" },
                text: { required: true, type: "string" }
            },
            url: "/markdown"
        },
        renderRaw: {
            headers: { "content-type": "text/plain; charset=utf-8" },
            method: "POST",
            params: { data: { mapTo: "data", required: true, type: "string" } },
            url: "/markdown/raw"
        }
    },
    meta: { get: { method: "GET", params: {}, url: "/meta" } },
    migrations: {
        cancelImport: {
            method: "DELETE",
            params: {
                owner: { required: true, type: "string" },
                repo: { required: true, type: "string" }
            },
            url: "/repos/:owner/:repo/import"
        },
        deleteArchiveForAuthenticatedUser: {
            headers: { accept: "application/vnd.github.wyandotte-preview+json" },
            method: "DELETE",
            params: { migration_id: { required: true, type: "integer" } },
            url: "/user/migrations/:migration_id/archive"
        },
        deleteArchiveForOrg: {
            headers: { accept: "application/vnd.github.wyandotte-preview+json" },
            method: "DELETE",
            params: {
                migration_id: { required: true, type: "integer" },
                org: { required: true, type: "string" }
            },
            url: "/orgs/:org/migrations/:migration_id/archive"
        },
        downloadArchiveForOrg: {
            headers: { accept: "application/vnd.github.wyandotte-preview+json" },
            method: "GET",
            params: {
                migration_id: { required: true, type: "integer" },
                org: { required: true, type: "string" }
            },
            url: "/orgs/:org/migrations/:migration_id/archive"
        },
        getArchiveForAuthenticatedUser: {
            headers: { accept: "application/vnd.github.wyandotte-preview+json" },
            method: "GET",
            params: { migration_id: { required: true, type: "integer" } },
            url: "/user/migrations/:migration_id/archive"
        },
        getArchiveForOrg: {
            deprecated: "octokit.migrations.getArchiveForOrg() has been renamed to octokit.migrations.downloadArchiveForOrg() (2020-01-27)",
            headers: { accept: "application/vnd.github.wyandotte-preview+json" },
            method: "GET",
            params: {
                migration_id: { required: true, type: "integer" },
                org: { required: true, type: "string" }
            },
            url: "/orgs/:org/migrations/:migration_id/archive"
        },
        getCommitAuthors: {
            method: "GET",
            params: {
                owner: { required: true, type: "string" },
                repo: { required: true, type: "string" },
                since: { type: "string" }
            },
            url: "/repos/:owner/:repo/import/authors"
        },
        getImportProgress: {
            method: "GET",
            params: {
                owner: { required: true, type: "string" },
                repo: { required: true, type: "string" }
            },
            url: "/repos/:owner/:repo/import"
        },
        getLargeFiles: {
            method: "GET",
            params: {
                owner: { required: true, type: "string" },
                repo: { required: true, type: "string" }
            },
            url: "/repos/:owner/:repo/import/large_files"
        },
        getStatusForAuthenticatedUser: {
            headers: { accept: "application/vnd.github.wyandotte-preview+json" },
            method: "GET",
            params: { migration_id: { required: true, type: "integer" } },
            url: "/user/migrations/:migration_id"
        },
        getStatusForOrg: {
            headers: { accept: "application/vnd.github.wyandotte-preview+json" },
            method: "GET",
            params: {
                migration_id: { required: true, type: "integer" },
                org: { required: true, type: "string" }
            },
            url: "/orgs/:org/migrations/:migration_id"
        },
        listForAuthenticatedUser: {
            headers: { accept: "application/vnd.github.wyandotte-preview+json" },
            method: "GET",
            params: { page: { type: "integer" }, per_page: { type: "integer" } },
            url: "/user/migrations"
        },
        listForOrg: {
            headers: { accept: "application/vnd.github.wyandotte-preview+json" },
            method: "GET",
            params: {
                org: { required: true, type: "string" },
                page: { type: "integer" },
                per_page: { type: "integer" }
            },
            url: "/orgs/:org/migrations"
        },
        listReposForOrg: {
            headers: { accept: "application/vnd.github.wyandotte-preview+json" },
            method: "GET",
            params: {
                migration_id: { required: true, type: "integer" },
                org: { required: true, type: "string" },
                page: { type: "integer" },
                per_page: { type: "integer" }
            },
            url: "/orgs/:org/migrations/:migration_id/repositories"
        },
        listReposForUser: {
            headers: { accept: "application/vnd.github.wyandotte-preview+json" },
            method: "GET",
            params: {
                migration_id: { required: true, type: "integer" },
                page: { type: "integer" },
                per_page: { type: "integer" }
            },
            url: "/user/:migration_id/repositories"
        },
        mapCommitAuthor: {
            method: "PATCH",
            params: {
                author_id: { required: true, type: "integer" },
                email: { type: "string" },
                name: { type: "string" },
                owner: { required: true, type: "string" },
                repo: { required: true, type: "string" }
            },
            url: "/repos/:owner/:repo/import/authors/:author_id"
        },
        setLfsPreference: {
            method: "PATCH",
            params: {
                owner: { required: true, type: "string" },
                repo: { required: true, type: "string" },
                use_lfs: { enum: ["opt_in", "opt_out"], required: true, type: "string" }
            },
            url: "/repos/:owner/:repo/import/lfs"
        },
        startForAuthenticatedUser: {
            method: "POST",
            params: {
                exclude_attachments: { type: "boolean" },
                lock_repositories: { type: "boolean" },
                repositories: { required: true, type: "string[]" }
            },
            url: "/user/migrations"
        },
        startForOrg: {
            method: "POST",
            params: {
                exclude_attachments: { type: "boolean" },
                lock_repositories: { type: "boolean" },
                org: { required: true, type: "string" },
                repositories: { required: true, type: "string[]" }
            },
            url: "/orgs/:org/migrations"
        },
        startImport: {
            method: "PUT",
            params: {
                owner: { required: true, type: "string" },
                repo: { required: true, type: "string" },
                tfvc_project: { type: "string" },
                vcs: {
                    enum: ["subversion", "git", "mercurial", "tfvc"],
                    type: "string"
                },
                vcs_password: { type: "string" },
                vcs_url: { required: true, type: "string" },
                vcs_username: { type: "string" }
            },
            url: "/repos/:owner/:repo/import"
        },
        unlockRepoForAuthenticatedUser: {
            headers: { accept: "application/vnd.github.wyandotte-preview+json" },
            method: "DELETE",
            params: {
                migration_id: { required: true, type: "integer" },
                repo_name: { required: true, type: "string" }
            },
            url: "/user/migrations/:migration_id/repos/:repo_name/lock"
        },
        unlockRepoForOrg: {
            headers: { accept: "application/vnd.github.wyandotte-preview+json" },
            method: "DELETE",
            params: {
                migration_id: { required: true, type: "integer" },
                org: { required: true, type: "string" },
                repo_name: { required: true, type: "string" }
            },
            url: "/orgs/:org/migrations/:migration_id/repos/:repo_name/lock"
        },
        updateImport: {
            method: "PATCH",
            params: {
                owner: { required: true, type: "string" },
                repo: { required: true, type: "string" },
                vcs_password: { type: "string" },
                vcs_username: { type: "string" }
            },
            url: "/repos/:owner/:repo/import"
        }
    },
    oauthAuthorizations: {
        checkAuthorization: {
            deprecated: "octokit.oauthAuthorizations.checkAuthorization() has been renamed to octokit.apps.checkAuthorization() (2019-11-05)",
            method: "GET",
            params: {
                access_token: { required: true, type: "string" },
                client_id: { required: true, type: "string" }
            },
            url: "/applications/:client_id/tokens/:access_token"
        },
        createAuthorization: {
            deprecated: "octokit.oauthAuthorizations.createAuthorization() is deprecated, see https://developer.github.com/v3/oauth_authorizations/#create-a-new-authorization",
            method: "POST",
            params: {
                client_id: { type: "string" },
                client_secret: { type: "string" },
                fingerprint: { type: "string" },
                note: { required: true, type: "string" },
                note_url: { type: "string" },
                scopes: { type: "string[]" }
            },
            url: "/authorizations"
        },
        deleteAuthorization: {
            deprecated: "octokit.oauthAuthorizations.deleteAuthorization() is deprecated, see https://developer.github.com/v3/oauth_authorizations/#delete-an-authorization",
            method: "DELETE",
            params: { authorization_id: { required: true, type: "integer" } },
            url: "/authorizations/:authorization_id"
        },
        deleteGrant: {
            deprecated: "octokit.oauthAuthorizations.deleteGrant() is deprecated, see https://developer.github.com/v3/oauth_authorizations/#delete-a-grant",
            method: "DELETE",
            params: { grant_id: { required: true, type: "integer" } },
            url: "/applications/grants/:grant_id"
        },
        getAuthorization: {
            deprecated: "octokit.oauthAuthorizations.getAuthorization() is deprecated, see https://developer.github.com/v3/oauth_authorizations/#get-a-single-authorization",
            method: "GET",
            params: { authorization_id: { required: true, type: "integer" } },
            url: "/authorizations/:authorization_id"
        },
        getGrant: {
            deprecated: "octokit.oauthAuthorizations.getGrant() is deprecated, see https://developer.github.com/v3/oauth_authorizations/#get-a-single-grant",
            method: "GET",
            params: { grant_id: { required: true, type: "integer" } },
            url: "/applications/grants/:grant_id"
        },
        getOrCreateAuthorizationForApp: {
            deprecated: "octokit.oauthAuthorizations.getOrCreateAuthorizationForApp() is deprecated, see https://developer.github.com/v3/oauth_authorizations/#get-or-create-an-authorization-for-a-specific-app",
            method: "PUT",
            params: {
                client_id: { required: true, type: "string" },
                client_secret: { required: true, type: "string" },
                fingerprint: { type: "string" },
                note: { type: "string" },
                note_url: { type: "string" },
                scopes: { type: "string[]" }
            },
            url: "/authorizations/clients/:client_id"
        },
        getOrCreateAuthorizationForAppAndFingerprint: {
            deprecated: "octokit.oauthAuthorizations.getOrCreateAuthorizationForAppAndFingerprint() is deprecated, see https://developer.github.com/v3/oauth_authorizations/#get-or-create-an-authorization-for-a-specific-app-and-fingerprint",
            method: "PUT",
            params: {
                client_id: { required: true, type: "string" },
                client_secret: { required: true, type: "string" },
                fingerprint: { required: true, type: "string" },
                note: { type: "string" },
                note_url: { type: "string" },
                scopes: { type: "string[]" }
            },
            url: "/authorizations/clients/:client_id/:fingerprint"
        },
        getOrCreateAuthorizationForAppFingerprint: {
            deprecated: "octokit.oauthAuthorizations.getOrCreateAuthorizationForAppFingerprint() has been renamed to octokit.oauthAuthorizations.getOrCreateAuthorizationForAppAndFingerprint() (2018-12-27)",
            method: "PUT",
            params: {
                client_id: { required: true, type: "string" },
                client_secret: { required: true, type: "string" },
                fingerprint: { required: true, type: "string" },
                note: { type: "string" },
                note_url: { type: "string" },
                scopes: { type: "string[]" }
            },
            url: "/authorizations/clients/:client_id/:fingerprint"
        },
        listAuthorizations: {
            deprecated: "octokit.oauthAuthorizations.listAuthorizations() is deprecated, see https://developer.github.com/v3/oauth_authorizations/#list-your-authorizations",
            method: "GET",
            params: { page: { type: "integer" }, per_page: { type: "integer" } },
            url: "/authorizations"
        },
        listGrants: {
            deprecated: "octokit.oauthAuthorizations.listGrants() is deprecated, see https://developer.github.com/v3/oauth_authorizations/#list-your-grants",
            method: "GET",
            params: { page: { type: "integer" }, per_page: { type: "integer" } },
            url: "/applications/grants"
        },
        resetAuthorization: {
            deprecated: "octokit.oauthAuthorizations.resetAuthorization() has been renamed to octokit.apps.resetAuthorization() (2019-11-05)",
            method: "POST",
            params: {
                access_token: { required: true, type: "string" },
                client_id: { required: true, type: "string" }
            },
            url: "/applications/:client_id/tokens/:access_token"
        },
        revokeAuthorizationForApplication: {
            deprecated: "octokit.oauthAuthorizations.revokeAuthorizationForApplication() has been renamed to octokit.apps.revokeAuthorizationForApplication() (2019-11-05)",
            method: "DELETE",
            params: {
                access_token: { required: true, type: "string" },
                client_id: { required: true, type: "string" }
            },
            url: "/applications/:client_id/tokens/:access_token"
        },
        revokeGrantForApplication: {
            deprecated: "octokit.oauthAuthorizations.revokeGrantForApplication() has been renamed to octokit.apps.revokeGrantForApplication() (2019-11-05)",
            method: "DELETE",
            params: {
                access_token: { required: true, type: "string" },
                client_id: { required: true, type: "string" }
            },
            url: "/applications/:client_id/grants/:access_token"
        },
        updateAuthorization: {
            deprecated: "octokit.oauthAuthorizations.updateAuthorization() is deprecated, see https://developer.github.com/v3/oauth_authorizations/#update-an-existing-authorization",
            method: "PATCH",
            params: {
                add_scopes: { type: "string[]" },
                authorization_id: { required: true, type: "integer" },
                fingerprint: { type: "string" },
                note: { type: "string" },
                note_url: { type: "string" },
                remove_scopes: { type: "string[]" },
                scopes: { type: "string[]" }
            },
            url: "/authorizations/:authorization_id"
        }
    },
    orgs: {
        addOrUpdateMembership: {
            method: "PUT",
            params: {
                org: { required: true, type: "string" },
                role: { enum: ["admin", "member"], type: "string" },
                username: { required: true, type: "string" }
            },
            url: "/orgs/:org/memberships/:username"
        },
        blockUser: {
            method: "PUT",
            params: {
                org: { required: true, type: "string" },
                username: { required: true, type: "string" }
            },
            url: "/orgs/:org/blocks/:username"
        },
        checkBlockedUser: {
            method: "GET",
            params: {
                org: { required: true, type: "string" },
                username: { required: true, type: "string" }
            },
            url: "/orgs/:org/blocks/:username"
        },
        checkMembership: {
            method: "GET",
            params: {
                org: { required: true, type: "string" },
                username: { required: true, type: "string" }
            },
            url: "/orgs/:org/members/:username"
        },
        checkPublicMembership: {
            method: "GET",
            params: {
                org: { required: true, type: "string" },
                username: { required: true, type: "string" }
            },
            url: "/orgs/:org/public_members/:username"
        },
        concealMembership: {
            method: "DELETE",
            params: {
                org: { required: true, type: "string" },
                username: { required: true, type: "string" }
            },
            url: "/orgs/:org/public_members/:username"
        },
        convertMemberToOutsideCollaborator: {
            method: "PUT",
            params: {
                org: { required: true, type: "string" },
                username: { required: true, type: "string" }
            },
            url: "/orgs/:org/outside_collaborators/:username"
        },
        createHook: {
            method: "POST",
            params: {
                active: { type: "boolean" },
                config: { required: true, type: "object" },
                "config.content_type": { type: "string" },
                "config.insecure_ssl": { type: "string" },
                "config.secret": { type: "string" },
                "config.url": { required: true, type: "string" },
                events: { type: "string[]" },
                name: { required: true, type: "string" },
                org: { required: true, type: "string" }
            },
            url: "/orgs/:org/hooks"
        },
        createInvitation: {
            method: "POST",
            params: {
                email: { type: "string" },
                invitee_id: { type: "integer" },
                org: { required: true, type: "string" },
                role: {
                    enum: ["admin", "direct_member", "billing_manager"],
                    type: "string"
                },
                team_ids: { type: "integer[]" }
            },
            url: "/orgs/:org/invitations"
        },
        deleteHook: {
            method: "DELETE",
            params: {
                hook_id: { required: true, type: "integer" },
                org: { required: true, type: "string" }
            },
            url: "/orgs/:org/hooks/:hook_id"
        },
        get: {
            method: "GET",
            params: { org: { required: true, type: "string" } },
            url: "/orgs/:org"
        },
        getHook: {
            method: "GET",
            params: {
                hook_id: { required: true, type: "integer" },
                org: { required: true, type: "string" }
            },
            url: "/orgs/:org/hooks/:hook_id"
        },
        getMembership: {
            method: "GET",
            params: {
                org: { required: true, type: "string" },
                username: { required: true, type: "string" }
            },
            url: "/orgs/:org/memberships/:username"
        },
        getMembershipForAuthenticatedUser: {
            method: "GET",
            params: { org: { required: true, type: "string" } },
            url: "/user/memberships/orgs/:org"
        },
        list: {
            method: "GET",
            params: {
                page: { type: "integer" },
                per_page: { type: "integer" },
                since: { type: "integer" }
            },
            url: "/organizations"
        },
        listBlockedUsers: {
            method: "GET",
            params: { org: { required: true, type: "string" } },
            url: "/orgs/:org/blocks"
        },
        listForAuthenticatedUser: {
            method: "GET",
            params: { page: { type: "integer" }, per_page: { type: "integer" } },
            url: "/user/orgs"
        },
        listForUser: {
            method: "GET",
            params: {
                page: { type: "integer" },
                per_page: { type: "integer" },
                username: { required: true, type: "string" }
            },
            url: "/users/:username/orgs"
        },
        listHooks: {
            method: "GET",
            params: {
                org: { required: true, type: "string" },
                page: { type: "integer" },
                per_page: { type: "integer" }
            },
            url: "/orgs/:org/hooks"
        },
        listInstallations: {
            headers: { accept: "application/vnd.github.machine-man-preview+json" },
            method: "GET",
            params: {
                org: { required: true, type: "string" },
                page: { type: "integer" },
                per_page: { type: "integer" }
            },
            url: "/orgs/:org/installations"
        },
        listInvitationTeams: {
            method: "GET",
            params: {
                invitation_id: { required: true, type: "integer" },
                org: { required: true, type: "string" },
                page: { type: "integer" },
                per_page: { type: "integer" }
            },
            url: "/orgs/:org/invitations/:invitation_id/teams"
        },
        listMembers: {
            method: "GET",
            params: {
                filter: { enum: ["2fa_disabled", "all"], type: "string" },
                org: { required: true, type: "string" },
                page: { type: "integer" },
                per_page: { type: "integer" },
                role: { enum: ["all", "admin", "member"], type: "string" }
            },
            url: "/orgs/:org/members"
        },
        listMemberships: {
            method: "GET",
            params: {
                page: { type: "integer" },
                per_page: { type: "integer" },
                state: { enum: ["active", "pending"], type: "string" }
            },
            url: "/user/memberships/orgs"
        },
        listOutsideCollaborators: {
            method: "GET",
            params: {
                filter: { enum: ["2fa_disabled", "all"], type: "string" },
                org: { required: true, type: "string" },
                page: { type: "integer" },
                per_page: { type: "integer" }
            },
            url: "/orgs/:org/outside_collaborators"
        },
        listPendingInvitations: {
            method: "GET",
            params: {
                org: { required: true, type: "string" },
                page: { type: "integer" },
                per_page: { type: "integer" }
            },
            url: "/orgs/:org/invitations"
        },
        listPublicMembers: {
            method: "GET",
            params: {
                org: { required: true, type: "string" },
                page: { type: "integer" },
                per_page: { type: "integer" }
            },
            url: "/orgs/:org/public_members"
        },
        pingHook: {
            method: "POST",
            params: {
                hook_id: { required: true, type: "integer" },
                org: { required: true, type: "string" }
            },
            url: "/orgs/:org/hooks/:hook_id/pings"
        },
        publicizeMembership: {
            method: "PUT",
            params: {
                org: { required: true, type: "string" },
                username: { required: true, type: "string" }
            },
            url: "/orgs/:org/public_members/:username"
        },
        removeMember: {
            method: "DELETE",
            params: {
                org: { required: true, type: "string" },
                username: { required: true, type: "string" }
            },
            url: "/orgs/:org/members/:username"
        },
        removeMembership: {
            method: "DELETE",
            params: {
                org: { required: true, type: "string" },
                username: { required: true, type: "string" }
            },
            url: "/orgs/:org/memberships/:username"
        },
        removeOutsideCollaborator: {
            method: "DELETE",
            params: {
                org: { required: true, type: "string" },
                username: { required: true, type: "string" }
            },
            url: "/orgs/:org/outside_collaborators/:username"
        },
        unblockUser: {
            method: "DELETE",
            params: {
                org: { required: true, type: "string" },
                username: { required: true, type: "string" }
            },
            url: "/orgs/:org/blocks/:username"
        },
        update: {
            method: "PATCH",
            params: {
                billing_email: { type: "string" },
                company: { type: "string" },
                default_repository_permission: {
                    enum: ["read", "write", "admin", "none"],
                    type: "string"
                },
                description: { type: "string" },
                email: { type: "string" },
                has_organization_projects: { type: "boolean" },
                has_repository_projects: { type: "boolean" },
                location: { type: "string" },
                members_allowed_repository_creation_type: {
                    enum: ["all", "private", "none"],
                    type: "string"
                },
                members_can_create_internal_repositories: { type: "boolean" },
                members_can_create_private_repositories: { type: "boolean" },
                members_can_create_public_repositories: { type: "boolean" },
                members_can_create_repositories: { type: "boolean" },
                name: { type: "string" },
                org: { required: true, type: "string" }
            },
            url: "/orgs/:org"
        },
        updateHook: {
            method: "PATCH",
            params: {
                active: { type: "boolean" },
                config: { type: "object" },
                "config.content_type": { type: "string" },
                "config.insecure_ssl": { type: "string" },
                "config.secret": { type: "string" },
                "config.url": { required: true, type: "string" },
                events: { type: "string[]" },
                hook_id: { required: true, type: "integer" },
                org: { required: true, type: "string" }
            },
            url: "/orgs/:org/hooks/:hook_id"
        },
        updateMembership: {
            method: "PATCH",
            params: {
                org: { required: true, type: "string" },
                state: { enum: ["active"], required: true, type: "string" }
            },
            url: "/user/memberships/orgs/:org"
        }
    },
    projects: {
        addCollaborator: {
            headers: { accept: "application/vnd.github.inertia-preview+json" },
            method: "PUT",
            params: {
                permission: { enum: ["read", "write", "admin"], type: "string" },
                project_id: { required: true, type: "integer" },
                username: { required: true, type: "string" }
            },
            url: "/projects/:project_id/collaborators/:username"
        },
        createCard: {
            headers: { accept: "application/vnd.github.inertia-preview+json" },
            method: "POST",
            params: {
                column_id: { required: true, type: "integer" },
                content_id: { type: "integer" },
                content_type: { type: "string" },
                note: { type: "string" }
            },
            url: "/projects/columns/:column_id/cards"
        },
        createColumn: {
            headers: { accept: "application/vnd.github.inertia-preview+json" },
            method: "POST",
            params: {
                name: { required: true, type: "string" },
                project_id: { required: true, type: "integer" }
            },
            url: "/projects/:project_id/columns"
        },
        createForAuthenticatedUser: {
            headers: { accept: "application/vnd.github.inertia-preview+json" },
            method: "POST",
            params: {
                body: { type: "string" },
                name: { required: true, type: "string" }
            },
            url: "/user/projects"
        },
        createForOrg: {
            headers: { accept: "application/vnd.github.inertia-preview+json" },
            method: "POST",
            params: {
                body: { type: "string" },
                name: { required: true, type: "string" },
                org: { required: true, type: "string" }
            },
            url: "/orgs/:org/projects"
        },
        createForRepo: {
            headers: { accept: "application/vnd.github.inertia-preview+json" },
            method: "POST",
            params: {
                body: { type: "string" },
                name: { required: true, type: "string" },
                owner: { required: true, type: "string" },
                repo: { required: true, type: "string" }
            },
            url: "/repos/:owner/:repo/projects"
        },
        delete: {
            headers: { accept: "application/vnd.github.inertia-preview+json" },
            method: "DELETE",
            params: { project_id: { required: true, type: "integer" } },
            url: "/projects/:project_id"
        },
        deleteCard: {
            headers: { accept: "application/vnd.github.inertia-preview+json" },
            method: "DELETE",
            params: { card_id: { required: true, type: "integer" } },
            url: "/projects/columns/cards/:card_id"
        },
        deleteColumn: {
            headers: { accept: "application/vnd.github.inertia-preview+json" },
            method: "DELETE",
            params: { column_id: { required: true, type: "integer" } },
            url: "/projects/columns/:column_id"
        },
        get: {
            headers: { accept: "application/vnd.github.inertia-preview+json" },
            method: "GET",
            params: { project_id: { required: true, type: "integer" } },
            url: "/projects/:project_id"
        },
        getCard: {
            headers: { accept: "application/vnd.github.inertia-preview+json" },
            method: "GET",
            params: { card_id: { required: true, type: "integer" } },
            url: "/projects/columns/cards/:card_id"
        },
        getColumn: {
            headers: { accept: "application/vnd.github.inertia-preview+json" },
            method: "GET",
            params: { column_id: { required: true, type: "integer" } },
            url: "/projects/columns/:column_id"
        },
        listCards: {
            headers: { accept: "application/vnd.github.inertia-preview+json" },
            method: "GET",
            params: {
                archived_state: {
                    enum: ["all", "archived", "not_archived"],
                    type: "string"
                },
                column_id: { required: true, type: "integer" },
                page: { type: "integer" },
                per_page: { type: "integer" }
            },
            url: "/projects/columns/:column_id/cards"
        },
        listCollaborators: {
            headers: { accept: "application/vnd.github.inertia-preview+json" },
            method: "GET",
            params: {
                affiliation: { enum: ["outside", "direct", "all"], type: "string" },
                page: { type: "integer" },
                per_page: { type: "integer" },
                project_id: { required: true, type: "integer" }
            },
            url: "/projects/:project_id/collaborators"
        },
        listColumns: {
            headers: { accept: "application/vnd.github.inertia-preview+json" },
            method: "GET",
            params: {
                page: { type: "integer" },
                per_page: { type: "integer" },
                project_id: { required: true, type: "integer" }
            },
            url: "/projects/:project_id/columns"
        },
        listForOrg: {
            headers: { accept: "application/vnd.github.inertia-preview+json" },
            method: "GET",
            params: {
                org: { required: true, type: "string" },
                page: { type: "integer" },
                per_page: { type: "integer" },
                state: { enum: ["open", "closed", "all"], type: "string" }
            },
            url: "/orgs/:org/projects"
        },
        listForRepo: {
            headers: { accept: "application/vnd.github.inertia-preview+json" },
            method: "GET",
            params: {
                owner: { required: true, type: "string" },
                page: { type: "integer" },
                per_page: { type: "integer" },
                repo: { required: true, type: "string" },
                state: { enum: ["open", "closed", "all"], type: "string" }
            },
            url: "/repos/:owner/:repo/projects"
        },
        listForUser: {
            headers: { accept: "application/vnd.github.inertia-preview+json" },
            method: "GET",
            params: {
                page: { type: "integer" },
                per_page: { type: "integer" },
                state: { enum: ["open", "closed", "all"], type: "string" },
                username: { required: true, type: "string" }
            },
            url: "/users/:username/projects"
        },
        moveCard: {
            headers: { accept: "application/vnd.github.inertia-preview+json" },
            method: "POST",
            params: {
                card_id: { required: true, type: "integer" },
                column_id: { type: "integer" },
                position: {
                    required: true,
                    type: "string",
                    validation: "^(top|bottom|after:\\d+)$"
                }
            },
            url: "/projects/columns/cards/:card_id/moves"
        },
        moveColumn: {
            headers: { accept: "application/vnd.github.inertia-preview+json" },
            method: "POST",
            params: {
                column_id: { required: true, type: "integer" },
                position: {
                    required: true,
                    type: "string",
                    validation: "^(first|last|after:\\d+)$"
                }
            },
            url: "/projects/columns/:column_id/moves"
        },
        removeCollaborator: {
            headers: { accept: "application/vnd.github.inertia-preview+json" },
            method: "DELETE",
            params: {
                project_id: { required: true, type: "integer" },
                username: { required: true, type: "string" }
            },
            url: "/projects/:project_id/collaborators/:username"
        },
        reviewUserPermissionLevel: {
            headers: { accept: "application/vnd.github.inertia-preview+json" },
            method: "GET",
            params: {
                project_id: { required: true, type: "integer" },
                username: { required: true, type: "string" }
            },
            url: "/projects/:project_id/collaborators/:username/permission"
        },
        update: {
            headers: { accept: "application/vnd.github.inertia-preview+json" },
            method: "PATCH",
            params: {
                body: { type: "string" },
                name: { type: "string" },
                organization_permission: { type: "string" },
                private: { type: "boolean" },
                project_id: { required: true, type: "integer" },
                state: { enum: ["open", "closed"], type: "string" }
            },
            url: "/projects/:project_id"
        },
        updateCard: {
            headers: { accept: "application/vnd.github.inertia-preview+json" },
            method: "PATCH",
            params: {
                archived: { type: "boolean" },
                card_id: { required: true, type: "integer" },
                note: { type: "string" }
            },
            url: "/projects/columns/cards/:card_id"
        },
        updateColumn: {
            headers: { accept: "application/vnd.github.inertia-preview+json" },
            method: "PATCH",
            params: {
                column_id: { required: true, type: "integer" },
                name: { required: true, type: "string" }
            },
            url: "/projects/columns/:column_id"
        }
    },
    pulls: {
        checkIfMerged: {
            method: "GET",
            params: {
                number: { alias: "pull_number", deprecated: true, type: "integer" },
                owner: { required: true, type: "string" },
                pull_number: { required: true, type: "integer" },
                repo: { required: true, type: "string" }
            },
            url: "/repos/:owner/:repo/pulls/:pull_number/merge"
        },
        create: {
            method: "POST",
            params: {
                base: { required: true, type: "string" },
                body: { type: "string" },
                draft: { type: "boolean" },
                head: { required: true, type: "string" },
                maintainer_can_modify: { type: "boolean" },
                owner: { required: true, type: "string" },
                repo: { required: true, type: "string" },
                title: { required: true, type: "string" }
            },
            url: "/repos/:owner/:repo/pulls"
        },
        createComment: {
            method: "POST",
            params: {
                body: { required: true, type: "string" },
                commit_id: { required: true, type: "string" },
                in_reply_to: {
                    deprecated: true,
                    description: "The comment ID to reply to. **Note**: This must be the ID of a top-level comment, not a reply to that comment. Replies to replies are not supported.",
                    type: "integer"
                },
                line: { type: "integer" },
                number: { alias: "pull_number", deprecated: true, type: "integer" },
                owner: { required: true, type: "string" },
                path: { required: true, type: "string" },
                position: { type: "integer" },
                pull_number: { required: true, type: "integer" },
                repo: { required: true, type: "string" },
                side: { enum: ["LEFT", "RIGHT"], type: "string" },
                start_line: { type: "integer" },
                start_side: { enum: ["LEFT", "RIGHT", "side"], type: "string" }
            },
            url: "/repos/:owner/:repo/pulls/:pull_number/comments"
        },
        createCommentReply: {
            deprecated: "octokit.pulls.createCommentReply() has been renamed to octokit.pulls.createComment() (2019-09-09)",
            method: "POST",
            params: {
                body: { required: true, type: "string" },
                commit_id: { required: true, type: "string" },
                in_reply_to: {
                    deprecated: true,
                    description: "The comment ID to reply to. **Note**: This must be the ID of a top-level comment, not a reply to that comment. Replies to replies are not supported.",
                    type: "integer"
                },
                line: { type: "integer" },
                number: { alias: "pull_number", deprecated: true, type: "integer" },
                owner: { required: true, type: "string" },
                path: { required: true, type: "string" },
                position: { type: "integer" },
                pull_number: { required: true, type: "integer" },
                repo: { required: true, type: "string" },
                side: { enum: ["LEFT", "RIGHT"], type: "string" },
                start_line: { type: "integer" },
                start_side: { enum: ["LEFT", "RIGHT", "side"], type: "string" }
            },
            url: "/repos/:owner/:repo/pulls/:pull_number/comments"
        },
        createFromIssue: {
            deprecated: "octokit.pulls.createFromIssue() is deprecated, see https://developer.github.com/v3/pulls/#create-a-pull-request",
            method: "POST",
            params: {
                base: { required: true, type: "string" },
                draft: { type: "boolean" },
                head: { required: true, type: "string" },
                issue: { required: true, type: "integer" },
                maintainer_can_modify: { type: "boolean" },
                owner: { required: true, type: "string" },
                repo: { required: true, type: "string" }
            },
            url: "/repos/:owner/:repo/pulls"
        },
        createReview: {
            method: "POST",
            params: {
                body: { type: "string" },
                comments: { type: "object[]" },
                "comments[].body": { required: true, type: "string" },
                "comments[].path": { required: true, type: "string" },
                "comments[].position": { required: true, type: "integer" },
                commit_id: { type: "string" },
                event: {
                    enum: ["APPROVE", "REQUEST_CHANGES", "COMMENT"],
                    type: "string"
                },
                number: { alias: "pull_number", deprecated: true, type: "integer" },
                owner: { required: true, type: "string" },
                pull_number: { required: true, type: "integer" },
                repo: { required: true, type: "string" }
            },
            url: "/repos/:owner/:repo/pulls/:pull_number/reviews"
        },
        createReviewCommentReply: {
            method: "POST",
            params: {
                body: { required: true, type: "string" },
                comment_id: { required: true, type: "integer" },
                owner: { required: true, type: "string" },
                pull_number: { required: true, type: "integer" },
                repo: { required: true, type: "string" }
            },
            url: "/repos/:owner/:repo/pulls/:pull_number/comments/:comment_id/replies"
        },
        createReviewRequest: {
            method: "POST",
            params: {
                number: { alias: "pull_number", deprecated: true, type: "integer" },
                owner: { required: true, type: "string" },
                pull_number: { required: true, type: "integer" },
                repo: { required: true, type: "string" },
                reviewers: { type: "string[]" },
                team_reviewers: { type: "string[]" }
            },
            url: "/repos/:owner/:repo/pulls/:pull_number/requested_reviewers"
        },
        deleteComment: {
            method: "DELETE",
            params: {
                comment_id: { required: true, type: "integer" },
                owner: { required: true, type: "string" },
                repo: { required: true, type: "string" }
            },
            url: "/repos/:owner/:repo/pulls/comments/:comment_id"
        },
        deletePendingReview: {
            method: "DELETE",
            params: {
                number: { alias: "pull_number", deprecated: true, type: "integer" },
                owner: { required: true, type: "string" },
                pull_number: { required: true, type: "integer" },
                repo: { required: true, type: "string" },
                review_id: { required: true, type: "integer" }
            },
            url: "/repos/:owner/:repo/pulls/:pull_number/reviews/:review_id"
        },
        deleteReviewRequest: {
            method: "DELETE",
            params: {
                number: { alias: "pull_number", deprecated: true, type: "integer" },
                owner: { required: true, type: "string" },
                pull_number: { required: true, type: "integer" },
                repo: { required: true, type: "string" },
                reviewers: { type: "string[]" },
                team_reviewers: { type: "string[]" }
            },
            url: "/repos/:owner/:repo/pulls/:pull_number/requested_reviewers"
        },
        dismissReview: {
            method: "PUT",
            params: {
                message: { required: true, type: "string" },
                number: { alias: "pull_number", deprecated: true, type: "integer" },
                owner: { required: true, type: "string" },
                pull_number: { required: true, type: "integer" },
                repo: { required: true, type: "string" },
                review_id: { required: true, type: "integer" }
            },
            url: "/repos/:owner/:repo/pulls/:pull_number/reviews/:review_id/dismissals"
        },
        get: {
            method: "GET",
            params: {
                number: { alias: "pull_number", deprecated: true, type: "integer" },
                owner: { required: true, type: "string" },
                pull_number: { required: true, type: "integer" },
                repo: { required: true, type: "string" }
            },
            url: "/repos/:owner/:repo/pulls/:pull_number"
        },
        getComment: {
            method: "GET",
            params: {
                comment_id: { required: true, type: "integer" },
                owner: { required: true, type: "string" },
                repo: { required: true, type: "string" }
            },
            url: "/repos/:owner/:repo/pulls/comments/:comment_id"
        },
        getCommentsForReview: {
            method: "GET",
            params: {
                number: { alias: "pull_number", deprecated: true, type: "integer" },
                owner: { required: true, type: "string" },
                page: { type: "integer" },
                per_page: { type: "integer" },
                pull_number: { required: true, type: "integer" },
                repo: { required: true, type: "string" },
                review_id: { required: true, type: "integer" }
            },
            url: "/repos/:owner/:repo/pulls/:pull_number/reviews/:review_id/comments"
        },
        getReview: {
            method: "GET",
            params: {
                number: { alias: "pull_number", deprecated: true, type: "integer" },
                owner: { required: true, type: "string" },
                pull_number: { required: true, type: "integer" },
                repo: { required: true, type: "string" },
                review_id: { required: true, type: "integer" }
            },
            url: "/repos/:owner/:repo/pulls/:pull_number/reviews/:review_id"
        },
        list: {
            method: "GET",
            params: {
                base: { type: "string" },
                direction: { enum: ["asc", "desc"], type: "string" },
                head: { type: "string" },
                owner: { required: true, type: "string" },
                page: { type: "integer" },
                per_page: { type: "integer" },
                repo: { required: true, type: "string" },
                sort: {
                    enum: ["created", "updated", "popularity", "long-running"],
                    type: "string"
                },
                state: { enum: ["open", "closed", "all"], type: "string" }
            },
            url: "/repos/:owner/:repo/pulls"
        },
        listComments: {
            method: "GET",
            params: {
                direction: { enum: ["asc", "desc"], type: "string" },
                number: { alias: "pull_number", deprecated: true, type: "integer" },
                owner: { required: true, type: "string" },
                page: { type: "integer" },
                per_page: { type: "integer" },
                pull_number: { required: true, type: "integer" },
                repo: { required: true, type: "string" },
                since: { type: "string" },
                sort: { enum: ["created", "updated"], type: "string" }
            },
            url: "/repos/:owner/:repo/pulls/:pull_number/comments"
        },
        listCommentsForRepo: {
            method: "GET",
            params: {
                direction: { enum: ["asc", "desc"], type: "string" },
                owner: { required: true, type: "string" },
                page: { type: "integer" },
                per_page: { type: "integer" },
                repo: { required: true, type: "string" },
                since: { type: "string" },
                sort: { enum: ["created", "updated"], type: "string" }
            },
            url: "/repos/:owner/:repo/pulls/comments"
        },
        listCommits: {
            method: "GET",
            params: {
                number: { alias: "pull_number", deprecated: true, type: "integer" },
                owner: { required: true, type: "string" },
                page: { type: "integer" },
                per_page: { type: "integer" },
                pull_number: { required: true, type: "integer" },
                repo: { required: true, type: "string" }
            },
            url: "/repos/:owner/:repo/pulls/:pull_number/commits"
        },
        listFiles: {
            method: "GET",
            params: {
                number: { alias: "pull_number", deprecated: true, type: "integer" },
                owner: { required: true, type: "string" },
                page: { type: "integer" },
                per_page: { type: "integer" },
                pull_number: { required: true, type: "integer" },
                repo: { required: true, type: "string" }
            },
            url: "/repos/:owner/:repo/pulls/:pull_number/files"
        },
        listReviewRequests: {
            method: "GET",
            params: {
                number: { alias: "pull_number", deprecated: true, type: "integer" },
                owner: { required: true, type: "string" },
                page: { type: "integer" },
                per_page: { type: "integer" },
                pull_number: { required: true, type: "integer" },
                repo: { required: true, type: "string" }
            },
            url: "/repos/:owner/:repo/pulls/:pull_number/requested_reviewers"
        },
        listReviews: {
            method: "GET",
            params: {
                number: { alias: "pull_number", deprecated: true, type: "integer" },
                owner: { required: true, type: "string" },
                page: { type: "integer" },
                per_page: { type: "integer" },
                pull_number: { required: true, type: "integer" },
                repo: { required: true, type: "string" }
            },
            url: "/repos/:owner/:repo/pulls/:pull_number/reviews"
        },
        merge: {
            method: "PUT",
            params: {
                commit_message: { type: "string" },
                commit_title: { type: "string" },
                merge_method: { enum: ["merge", "squash", "rebase"], type: "string" },
                number: { alias: "pull_number", deprecated: true, type: "integer" },
                owner: { required: true, type: "string" },
                pull_number: { required: true, type: "integer" },
                repo: { required: true, type: "string" },
                sha: { type: "string" }
            },
            url: "/repos/:owner/:repo/pulls/:pull_number/merge"
        },
        submitReview: {
            method: "POST",
            params: {
                body: { type: "string" },
                event: {
                    enum: ["APPROVE", "REQUEST_CHANGES", "COMMENT"],
                    required: true,
                    type: "string"
                },
                number: { alias: "pull_number", deprecated: true, type: "integer" },
                owner: { required: true, type: "string" },
                pull_number: { required: true, type: "integer" },
                repo: { required: true, type: "string" },
                review_id: { required: true, type: "integer" }
            },
            url: "/repos/:owner/:repo/pulls/:pull_number/reviews/:review_id/events"
        },
        update: {
            method: "PATCH",
            params: {
                base: { type: "string" },
                body: { type: "string" },
                maintainer_can_modify: { type: "boolean" },
                number: { alias: "pull_number", deprecated: true, type: "integer" },
                owner: { required: true, type: "string" },
                pull_number: { required: true, type: "integer" },
                repo: { required: true, type: "string" },
                state: { enum: ["open", "closed"], type: "string" },
                title: { type: "string" }
            },
            url: "/repos/:owner/:repo/pulls/:pull_number"
        },
        updateBranch: {
            headers: { accept: "application/vnd.github.lydian-preview+json" },
            method: "PUT",
            params: {
                expected_head_sha: { type: "string" },
                owner: { required: true, type: "string" },
                pull_number: { required: true, type: "integer" },
                repo: { required: true, type: "string" }
            },
            url: "/repos/:owner/:repo/pulls/:pull_number/update-branch"
        },
        updateComment: {
            method: "PATCH",
            params: {
                body: { required: true, type: "string" },
                comment_id: { required: true, type: "integer" },
                owner: { required: true, type: "string" },
                repo: { required: true, type: "string" }
            },
            url: "/repos/:owner/:repo/pulls/comments/:comment_id"
        },
        updateReview: {
            method: "PUT",
            params: {
                body: { required: true, type: "string" },
                number: { alias: "pull_number", deprecated: true, type: "integer" },
                owner: { required: true, type: "string" },
                pull_number: { required: true, type: "integer" },
                repo: { required: true, type: "string" },
                review_id: { required: true, type: "integer" }
            },
            url: "/repos/:owner/:repo/pulls/:pull_number/reviews/:review_id"
        }
    },
    rateLimit: { get: { method: "GET", params: {}, url: "/rate_limit" } },
    reactions: {
        createForCommitComment: {
            headers: { accept: "application/vnd.github.squirrel-girl-preview+json" },
            method: "POST",
            params: {
                comment_id: { required: true, type: "integer" },
                content: {
                    enum: [
                        "+1",
                        "-1",
                        "laugh",
                        "confused",
                        "heart",
                        "hooray",
                        "rocket",
                        "eyes"
                    ],
                    required: true,
                    type: "string"
                },
                owner: { required: true, type: "string" },
                repo: { required: true, type: "string" }
            },
            url: "/repos/:owner/:repo/comments/:comment_id/reactions"
        },
        createForIssue: {
            headers: { accept: "application/vnd.github.squirrel-girl-preview+json" },
            method: "POST",
            params: {
                content: {
                    enum: [
                        "+1",
                        "-1",
                        "laugh",
                        "confused",
                        "heart",
                        "hooray",
                        "rocket",
                        "eyes"
                    ],
                    required: true,
                    type: "string"
                },
                issue_number: { required: true, type: "integer" },
                number: { alias: "issue_number", deprecated: true, type: "integer" },
                owner: { required: true, type: "string" },
                repo: { required: true, type: "string" }
            },
            url: "/repos/:owner/:repo/issues/:issue_number/reactions"
        },
        createForIssueComment: {
            headers: { accept: "application/vnd.github.squirrel-girl-preview+json" },
            method: "POST",
            params: {
                comment_id: { required: true, type: "integer" },
                content: {
                    enum: [
                        "+1",
                        "-1",
                        "laugh",
                        "confused",
                        "heart",
                        "hooray",
                        "rocket",
                        "eyes"
                    ],
                    required: true,
                    type: "string"
                },
                owner: { required: true, type: "string" },
                repo: { required: true, type: "string" }
            },
            url: "/repos/:owner/:repo/issues/comments/:comment_id/reactions"
        },
        createForPullRequestReviewComment: {
            headers: { accept: "application/vnd.github.squirrel-girl-preview+json" },
            method: "POST",
            params: {
                comment_id: { required: true, type: "integer" },
                content: {
                    enum: [
                        "+1",
                        "-1",
                        "laugh",
                        "confused",
                        "heart",
                        "hooray",
                        "rocket",
                        "eyes"
                    ],
                    required: true,
                    type: "string"
                },
                owner: { required: true, type: "string" },
                repo: { required: true, type: "string" }
            },
            url: "/repos/:owner/:repo/pulls/comments/:comment_id/reactions"
        },
        createForTeamDiscussion: {
            deprecated: "octokit.reactions.createForTeamDiscussion() has been renamed to octokit.reactions.createForTeamDiscussionLegacy() (2020-01-16)",
            headers: { accept: "application/vnd.github.squirrel-girl-preview+json" },
            method: "POST",
            params: {
                content: {
                    enum: [
                        "+1",
                        "-1",
                        "laugh",
                        "confused",
                        "heart",
                        "hooray",
                        "rocket",
                        "eyes"
                    ],
                    required: true,
                    type: "string"
                },
                discussion_number: { required: true, type: "integer" },
                team_id: { required: true, type: "integer" }
            },
            url: "/teams/:team_id/discussions/:discussion_number/reactions"
        },
        createForTeamDiscussionComment: {
            deprecated: "octokit.reactions.createForTeamDiscussionComment() has been renamed to octokit.reactions.createForTeamDiscussionCommentLegacy() (2020-01-16)",
            headers: { accept: "application/vnd.github.squirrel-girl-preview+json" },
            method: "POST",
            params: {
                comment_number: { required: true, type: "integer" },
                content: {
                    enum: [
                        "+1",
                        "-1",
                        "laugh",
                        "confused",
                        "heart",
                        "hooray",
                        "rocket",
                        "eyes"
                    ],
                    required: true,
                    type: "string"
                },
                discussion_number: { required: true, type: "integer" },
                team_id: { required: true, type: "integer" }
            },
            url: "/teams/:team_id/discussions/:discussion_number/comments/:comment_number/reactions"
        },
        createForTeamDiscussionCommentInOrg: {
            headers: { accept: "application/vnd.github.squirrel-girl-preview+json" },
            method: "POST",
            params: {
                comment_number: { required: true, type: "integer" },
                content: {
                    enum: [
                        "+1",
                        "-1",
                        "laugh",
                        "confused",
                        "heart",
                        "hooray",
                        "rocket",
                        "eyes"
                    ],
                    required: true,
                    type: "string"
                },
                discussion_number: { required: true, type: "integer" },
                org: { required: true, type: "string" },
                team_slug: { required: true, type: "string" }
            },
            url: "/orgs/:org/teams/:team_slug/discussions/:discussion_number/comments/:comment_number/reactions"
        },
        createForTeamDiscussionCommentLegacy: {
            deprecated: "octokit.reactions.createForTeamDiscussionCommentLegacy() is deprecated, see https://developer.github.com/v3/reactions/#create-reaction-for-a-team-discussion-comment-legacy",
            headers: { accept: "application/vnd.github.squirrel-girl-preview+json" },
            method: "POST",
            params: {
                comment_number: { required: true, type: "integer" },
                content: {
                    enum: [
                        "+1",
                        "-1",
                        "laugh",
                        "confused",
                        "heart",
                        "hooray",
                        "rocket",
                        "eyes"
                    ],
                    required: true,
                    type: "string"
                },
                discussion_number: { required: true, type: "integer" },
                team_id: { required: true, type: "integer" }
            },
            url: "/teams/:team_id/discussions/:discussion_number/comments/:comment_number/reactions"
        },
        createForTeamDiscussionInOrg: {
            headers: { accept: "application/vnd.github.squirrel-girl-preview+json" },
            method: "POST",
            params: {
                content: {
                    enum: [
                        "+1",
                        "-1",
                        "laugh",
                        "confused",
                        "heart",
                        "hooray",
                        "rocket",
                        "eyes"
                    ],
                    required: true,
                    type: "string"
                },
                discussion_number: { required: true, type: "integer" },
                org: { required: true, type: "string" },
                team_slug: { required: true, type: "string" }
            },
            url: "/orgs/:org/teams/:team_slug/discussions/:discussion_number/reactions"
        },
        createForTeamDiscussionLegacy: {
            deprecated: "octokit.reactions.createForTeamDiscussionLegacy() is deprecated, see https://developer.github.com/v3/reactions/#create-reaction-for-a-team-discussion-legacy",
            headers: { accept: "application/vnd.github.squirrel-girl-preview+json" },
            method: "POST",
            params: {
                content: {
                    enum: [
                        "+1",
                        "-1",
                        "laugh",
                        "confused",
                        "heart",
                        "hooray",
                        "rocket",
                        "eyes"
                    ],
                    required: true,
                    type: "string"
                },
                discussion_number: { required: true, type: "integer" },
                team_id: { required: true, type: "integer" }
            },
            url: "/teams/:team_id/discussions/:discussion_number/reactions"
        },
        delete: {
            headers: { accept: "application/vnd.github.squirrel-girl-preview+json" },
            method: "DELETE",
            params: { reaction_id: { required: true, type: "integer" } },
            url: "/reactions/:reaction_id"
        },
        listForCommitComment: {
            headers: { accept: "application/vnd.github.squirrel-girl-preview+json" },
            method: "GET",
            params: {
                comment_id: { required: true, type: "integer" },
                content: {
                    enum: [
                        "+1",
                        "-1",
                        "laugh",
                        "confused",
                        "heart",
                        "hooray",
                        "rocket",
                        "eyes"
                    ],
                    type: "string"
                },
                owner: { required: true, type: "string" },
                page: { type: "integer" },
                per_page: { type: "integer" },
                repo: { required: true, type: "string" }
            },
            url: "/repos/:owner/:repo/comments/:comment_id/reactions"
        },
        listForIssue: {
            headers: { accept: "application/vnd.github.squirrel-girl-preview+json" },
            method: "GET",
            params: {
                content: {
                    enum: [
                        "+1",
                        "-1",
                        "laugh",
                        "confused",
                        "heart",
                        "hooray",
                        "rocket",
                        "eyes"
                    ],
                    type: "string"
                },
                issue_number: { required: true, type: "integer" },
                number: { alias: "issue_number", deprecated: true, type: "integer" },
                owner: { required: true, type: "string" },
                page: { type: "integer" },
                per_page: { type: "integer" },
                repo: { required: true, type: "string" }
            },
            url: "/repos/:owner/:repo/issues/:issue_number/reactions"
        },
        listForIssueComment: {
            headers: { accept: "application/vnd.github.squirrel-girl-preview+json" },
            method: "GET",
            params: {
                comment_id: { required: true, type: "integer" },
                content: {
                    enum: [
                        "+1",
                        "-1",
                        "laugh",
                        "confused",
                        "heart",
                        "hooray",
                        "rocket",
                        "eyes"
                    ],
                    type: "string"
                },
                owner: { required: true, type: "string" },
                page: { type: "integer" },
                per_page: { type: "integer" },
                repo: { required: true, type: "string" }
            },
            url: "/repos/:owner/:repo/issues/comments/:comment_id/reactions"
        },
        listForPullRequestReviewComment: {
            headers: { accept: "application/vnd.github.squirrel-girl-preview+json" },
            method: "GET",
            params: {
                comment_id: { required: true, type: "integer" },
                content: {
                    enum: [
                        "+1",
                        "-1",
                        "laugh",
                        "confused",
                        "heart",
                        "hooray",
                        "rocket",
                        "eyes"
                    ],
                    type: "string"
                },
                owner: { required: true, type: "string" },
                page: { type: "integer" },
                per_page: { type: "integer" },
                repo: { required: true, type: "string" }
            },
            url: "/repos/:owner/:repo/pulls/comments/:comment_id/reactions"
        },
        listForTeamDiscussion: {
            deprecated: "octokit.reactions.listForTeamDiscussion() has been renamed to octokit.reactions.listForTeamDiscussionLegacy() (2020-01-16)",
            headers: { accept: "application/vnd.github.squirrel-girl-preview+json" },
            method: "GET",
            params: {
                content: {
                    enum: [
                        "+1",
                        "-1",
                        "laugh",
                        "confused",
                        "heart",
                        "hooray",
                        "rocket",
                        "eyes"
                    ],
                    type: "string"
                },
                discussion_number: { required: true, type: "integer" },
                page: { type: "integer" },
                per_page: { type: "integer" },
                team_id: { required: true, type: "integer" }
            },
            url: "/teams/:team_id/discussions/:discussion_number/reactions"
        },
        listForTeamDiscussionComment: {
            deprecated: "octokit.reactions.listForTeamDiscussionComment() has been renamed to octokit.reactions.listForTeamDiscussionCommentLegacy() (2020-01-16)",
            headers: { accept: "application/vnd.github.squirrel-girl-preview+json" },
            method: "GET",
            params: {
                comment_number: { required: true, type: "integer" },
                content: {
                    enum: [
                        "+1",
                        "-1",
                        "laugh",
                        "confused",
                        "heart",
                        "hooray",
                        "rocket",
                        "eyes"
                    ],
                    type: "string"
                },
                discussion_number: { required: true, type: "integer" },
                page: { type: "integer" },
                per_page: { type: "integer" },
                team_id: { required: true, type: "integer" }
            },
            url: "/teams/:team_id/discussions/:discussion_number/comments/:comment_number/reactions"
        },
        listForTeamDiscussionCommentInOrg: {
            headers: { accept: "application/vnd.github.squirrel-girl-preview+json" },
            method: "GET",
            params: {
                comment_number: { required: true, type: "integer" },
                content: {
                    enum: [
                        "+1",
                        "-1",
                        "laugh",
                        "confused",
                        "heart",
                        "hooray",
                        "rocket",
                        "eyes"
                    ],
                    type: "string"
                },
                discussion_number: { required: true, type: "integer" },
                org: { required: true, type: "string" },
                page: { type: "integer" },
                per_page: { type: "integer" },
                team_slug: { required: true, type: "string" }
            },
            url: "/orgs/:org/teams/:team_slug/discussions/:discussion_number/comments/:comment_number/reactions"
        },
        listForTeamDiscussionCommentLegacy: {
            deprecated: "octokit.reactions.listForTeamDiscussionCommentLegacy() is deprecated, see https://developer.github.com/v3/reactions/#list-reactions-for-a-team-discussion-comment-legacy",
            headers: { accept: "application/vnd.github.squirrel-girl-preview+json" },
            method: "GET",
            params: {
                comment_number: { required: true, type: "integer" },
                content: {
                    enum: [
                        "+1",
                        "-1",
                        "laugh",
                        "confused",
                        "heart",
                        "hooray",
                        "rocket",
                        "eyes"
                    ],
                    type: "string"
                },
                discussion_number: { required: true, type: "integer" },
                page: { type: "integer" },
                per_page: { type: "integer" },
                team_id: { required: true, type: "integer" }
            },
            url: "/teams/:team_id/discussions/:discussion_number/comments/:comment_number/reactions"
        },
        listForTeamDiscussionInOrg: {
            headers: { accept: "application/vnd.github.squirrel-girl-preview+json" },
            method: "GET",
            params: {
                content: {
                    enum: [
                        "+1",
                        "-1",
                        "laugh",
                        "confused",
                        "heart",
                        "hooray",
                        "rocket",
                        "eyes"
                    ],
                    type: "string"
                },
                discussion_number: { required: true, type: "integer" },
                org: { required: true, type: "string" },
                page: { type: "integer" },
                per_page: { type: "integer" },
                team_slug: { required: true, type: "string" }
            },
            url: "/orgs/:org/teams/:team_slug/discussions/:discussion_number/reactions"
        },
        listForTeamDiscussionLegacy: {
            deprecated: "octokit.reactions.listForTeamDiscussionLegacy() is deprecated, see https://developer.github.com/v3/reactions/#list-reactions-for-a-team-discussion-legacy",
            headers: { accept: "application/vnd.github.squirrel-girl-preview+json" },
            method: "GET",
            params: {
                content: {
                    enum: [
                        "+1",
                        "-1",
                        "laugh",
                        "confused",
                        "heart",
                        "hooray",
                        "rocket",
                        "eyes"
                    ],
                    type: "string"
                },
                discussion_number: { required: true, type: "integer" },
                page: { type: "integer" },
                per_page: { type: "integer" },
                team_id: { required: true, type: "integer" }
            },
            url: "/teams/:team_id/discussions/:discussion_number/reactions"
        }
    },
    repos: {
        acceptInvitation: {
            method: "PATCH",
            params: { invitation_id: { required: true, type: "integer" } },
            url: "/user/repository_invitations/:invitation_id"
        },
        addCollaborator: {
            method: "PUT",
            params: {
                owner: { required: true, type: "string" },
                permission: { enum: ["pull", "push", "admin"], type: "string" },
                repo: { required: true, type: "string" },
                username: { required: true, type: "string" }
            },
            url: "/repos/:owner/:repo/collaborators/:username"
        },
        addDeployKey: {
            method: "POST",
            params: {
                key: { required: true, type: "string" },
                owner: { required: true, type: "string" },
                read_only: { type: "boolean" },
                repo: { required: true, type: "string" },
                title: { type: "string" }
            },
            url: "/repos/:owner/:repo/keys"
        },
        addProtectedBranchAdminEnforcement: {
            method: "POST",
            params: {
                branch: { required: true, type: "string" },
                owner: { required: true, type: "string" },
                repo: { required: true, type: "string" }
            },
            url: "/repos/:owner/:repo/branches/:branch/protection/enforce_admins"
        },
        addProtectedBranchAppRestrictions: {
            method: "POST",
            params: {
                apps: { mapTo: "data", required: true, type: "string[]" },
                branch: { required: true, type: "string" },
                owner: { required: true, type: "string" },
                repo: { required: true, type: "string" }
            },
            url: "/repos/:owner/:repo/branches/:branch/protection/restrictions/apps"
        },
        addProtectedBranchRequiredSignatures: {
            headers: { accept: "application/vnd.github.zzzax-preview+json" },
            method: "POST",
            params: {
                branch: { required: true, type: "string" },
                owner: { required: true, type: "string" },
                repo: { required: true, type: "string" }
            },
            url: "/repos/:owner/:repo/branches/:branch/protection/required_signatures"
        },
        addProtectedBranchRequiredStatusChecksContexts: {
            method: "POST",
            params: {
                branch: { required: true, type: "string" },
                contexts: { mapTo: "data", required: true, type: "string[]" },
                owner: { required: true, type: "string" },
                repo: { required: true, type: "string" }
            },
            url: "/repos/:owner/:repo/branches/:branch/protection/required_status_checks/contexts"
        },
        addProtectedBranchTeamRestrictions: {
            method: "POST",
            params: {
                branch: { required: true, type: "string" },
                owner: { required: true, type: "string" },
                repo: { required: true, type: "string" },
                teams: { mapTo: "data", required: true, type: "string[]" }
            },
            url: "/repos/:owner/:repo/branches/:branch/protection/restrictions/teams"
        },
        addProtectedBranchUserRestrictions: {
            method: "POST",
            params: {
                branch: { required: true, type: "string" },
                owner: { required: true, type: "string" },
                repo: { required: true, type: "string" },
                users: { mapTo: "data", required: true, type: "string[]" }
            },
            url: "/repos/:owner/:repo/branches/:branch/protection/restrictions/users"
        },
        checkCollaborator: {
            method: "GET",
            params: {
                owner: { required: true, type: "string" },
                repo: { required: true, type: "string" },
                username: { required: true, type: "string" }
            },
            url: "/repos/:owner/:repo/collaborators/:username"
        },
        checkVulnerabilityAlerts: {
            headers: { accept: "application/vnd.github.dorian-preview+json" },
            method: "GET",
            params: {
                owner: { required: true, type: "string" },
                repo: { required: true, type: "string" }
            },
            url: "/repos/:owner/:repo/vulnerability-alerts"
        },
        compareCommits: {
            method: "GET",
            params: {
                base: { required: true, type: "string" },
                head: { required: true, type: "string" },
                owner: { required: true, type: "string" },
                repo: { required: true, type: "string" }
            },
            url: "/repos/:owner/:repo/compare/:base...:head"
        },
        createCommitComment: {
            method: "POST",
            params: {
                body: { required: true, type: "string" },
                commit_sha: { required: true, type: "string" },
                line: { type: "integer" },
                owner: { required: true, type: "string" },
                path: { type: "string" },
                position: { type: "integer" },
                repo: { required: true, type: "string" },
                sha: { alias: "commit_sha", deprecated: true, type: "string" }
            },
            url: "/repos/:owner/:repo/commits/:commit_sha/comments"
        },
        createDeployment: {
            method: "POST",
            params: {
                auto_merge: { type: "boolean" },
                description: { type: "string" },
                environment: { type: "string" },
                owner: { required: true, type: "string" },
                payload: { type: "string" },
                production_environment: { type: "boolean" },
                ref: { required: true, type: "string" },
                repo: { required: true, type: "string" },
                required_contexts: { type: "string[]" },
                task: { type: "string" },
                transient_environment: { type: "boolean" }
            },
            url: "/repos/:owner/:repo/deployments"
        },
        createDeploymentStatus: {
            method: "POST",
            params: {
                auto_inactive: { type: "boolean" },
                deployment_id: { required: true, type: "integer" },
                description: { type: "string" },
                environment: { enum: ["production", "staging", "qa"], type: "string" },
                environment_url: { type: "string" },
                log_url: { type: "string" },
                owner: { required: true, type: "string" },
                repo: { required: true, type: "string" },
                state: {
                    enum: [
                        "error",
                        "failure",
                        "inactive",
                        "in_progress",
                        "queued",
                        "pending",
                        "success"
                    ],
                    required: true,
                    type: "string"
                },
                target_url: { type: "string" }
            },
            url: "/repos/:owner/:repo/deployments/:deployment_id/statuses"
        },
        createDispatchEvent: {
            method: "POST",
            params: {
                client_payload: { type: "object" },
                event_type: { type: "string" },
                owner: { required: true, type: "string" },
                repo: { required: true, type: "string" }
            },
            url: "/repos/:owner/:repo/dispatches"
        },
        createFile: {
            deprecated: "octokit.repos.createFile() has been renamed to octokit.repos.createOrUpdateFile() (2019-06-07)",
            method: "PUT",
            params: {
                author: { type: "object" },
                "author.email": { required: true, type: "string" },
                "author.name": { required: true, type: "string" },
                branch: { type: "string" },
                committer: { type: "object" },
                "committer.email": { required: true, type: "string" },
                "committer.name": { required: true, type: "string" },
                content: { required: true, type: "string" },
                message: { required: true, type: "string" },
                owner: { required: true, type: "string" },
                path: { required: true, type: "string" },
                repo: { required: true, type: "string" },
                sha: { type: "string" }
            },
            url: "/repos/:owner/:repo/contents/:path"
        },
        createForAuthenticatedUser: {
            method: "POST",
            params: {
                allow_merge_commit: { type: "boolean" },
                allow_rebase_merge: { type: "boolean" },
                allow_squash_merge: { type: "boolean" },
                auto_init: { type: "boolean" },
                delete_branch_on_merge: { type: "boolean" },
                description: { type: "string" },
                gitignore_template: { type: "string" },
                has_issues: { type: "boolean" },
                has_projects: { type: "boolean" },
                has_wiki: { type: "boolean" },
                homepage: { type: "string" },
                is_template: { type: "boolean" },
                license_template: { type: "string" },
                name: { required: true, type: "string" },
                private: { type: "boolean" },
                team_id: { type: "integer" },
                visibility: {
                    enum: ["public", "private", "visibility", "internal"],
                    type: "string"
                }
            },
            url: "/user/repos"
        },
        createFork: {
            method: "POST",
            params: {
                organization: { type: "string" },
                owner: { required: true, type: "string" },
                repo: { required: true, type: "string" }
            },
            url: "/repos/:owner/:repo/forks"
        },
        createHook: {
            method: "POST",
            params: {
                active: { type: "boolean" },
                config: { required: true, type: "object" },
                "config.content_type": { type: "string" },
                "config.insecure_ssl": { type: "string" },
                "config.secret": { type: "string" },
                "config.url": { required: true, type: "string" },
                events: { type: "string[]" },
                name: { type: "string" },
                owner: { required: true, type: "string" },
                repo: { required: true, type: "string" }
            },
            url: "/repos/:owner/:repo/hooks"
        },
        createInOrg: {
            method: "POST",
            params: {
                allow_merge_commit: { type: "boolean" },
                allow_rebase_merge: { type: "boolean" },
                allow_squash_merge: { type: "boolean" },
                auto_init: { type: "boolean" },
                delete_branch_on_merge: { type: "boolean" },
                description: { type: "string" },
                gitignore_template: { type: "string" },
                has_issues: { type: "boolean" },
                has_projects: { type: "boolean" },
                has_wiki: { type: "boolean" },
                homepage: { type: "string" },
                is_template: { type: "boolean" },
                license_template: { type: "string" },
                name: { required: true, type: "string" },
                org: { required: true, type: "string" },
                private: { type: "boolean" },
                team_id: { type: "integer" },
                visibility: {
                    enum: ["public", "private", "visibility", "internal"],
                    type: "string"
                }
            },
            url: "/orgs/:org/repos"
        },
        createOrUpdateFile: {
            method: "PUT",
            params: {
                author: { type: "object" },
                "author.email": { required: true, type: "string" },
                "author.name": { required: true, type: "string" },
                branch: { type: "string" },
                committer: { type: "object" },
                "committer.email": { required: true, type: "string" },
                "committer.name": { required: true, type: "string" },
                content: { required: true, type: "string" },
                message: { required: true, type: "string" },
                owner: { required: true, type: "string" },
                path: { required: true, type: "string" },
                repo: { required: true, type: "string" },
                sha: { type: "string" }
            },
            url: "/repos/:owner/:repo/contents/:path"
        },
        createRelease: {
            method: "POST",
            params: {
                body: { type: "string" },
                draft: { type: "boolean" },
                name: { type: "string" },
                owner: { required: true, type: "string" },
                prerelease: { type: "boolean" },
                repo: { required: true, type: "string" },
                tag_name: { required: true, type: "string" },
                target_commitish: { type: "string" }
            },
            url: "/repos/:owner/:repo/releases"
        },
        createStatus: {
            method: "POST",
            params: {
                context: { type: "string" },
                description: { type: "string" },
                owner: { required: true, type: "string" },
                repo: { required: true, type: "string" },
                sha: { required: true, type: "string" },
                state: {
                    enum: ["error", "failure", "pending", "success"],
                    required: true,
                    type: "string"
                },
                target_url: { type: "string" }
            },
            url: "/repos/:owner/:repo/statuses/:sha"
        },
        createUsingTemplate: {
            headers: { accept: "application/vnd.github.baptiste-preview+json" },
            method: "POST",
            params: {
                description: { type: "string" },
                name: { required: true, type: "string" },
                owner: { type: "string" },
                private: { type: "boolean" },
                template_owner: { required: true, type: "string" },
                template_repo: { required: true, type: "string" }
            },
            url: "/repos/:template_owner/:template_repo/generate"
        },
        declineInvitation: {
            method: "DELETE",
            params: { invitation_id: { required: true, type: "integer" } },
            url: "/user/repository_invitations/:invitation_id"
        },
        delete: {
            method: "DELETE",
            params: {
                owner: { required: true, type: "string" },
                repo: { required: true, type: "string" }
            },
            url: "/repos/:owner/:repo"
        },
        deleteCommitComment: {
            method: "DELETE",
            params: {
                comment_id: { required: true, type: "integer" },
                owner: { required: true, type: "string" },
                repo: { required: true, type: "string" }
            },
            url: "/repos/:owner/:repo/comments/:comment_id"
        },
        deleteDownload: {
            method: "DELETE",
            params: {
                download_id: { required: true, type: "integer" },
                owner: { required: true, type: "string" },
                repo: { required: true, type: "string" }
            },
            url: "/repos/:owner/:repo/downloads/:download_id"
        },
        deleteFile: {
            method: "DELETE",
            params: {
                author: { type: "object" },
                "author.email": { type: "string" },
                "author.name": { type: "string" },
                branch: { type: "string" },
                committer: { type: "object" },
                "committer.email": { type: "string" },
                "committer.name": { type: "string" },
                message: { required: true, type: "string" },
                owner: { required: true, type: "string" },
                path: { required: true, type: "string" },
                repo: { required: true, type: "string" },
                sha: { required: true, type: "string" }
            },
            url: "/repos/:owner/:repo/contents/:path"
        },
        deleteHook: {
            method: "DELETE",
            params: {
                hook_id: { required: true, type: "integer" },
                owner: { required: true, type: "string" },
                repo: { required: true, type: "string" }
            },
            url: "/repos/:owner/:repo/hooks/:hook_id"
        },
        deleteInvitation: {
            method: "DELETE",
            params: {
                invitation_id: { required: true, type: "integer" },
                owner: { required: true, type: "string" },
                repo: { required: true, type: "string" }
            },
            url: "/repos/:owner/:repo/invitations/:invitation_id"
        },
        deleteRelease: {
            method: "DELETE",
            params: {
                owner: { required: true, type: "string" },
                release_id: { required: true, type: "integer" },
                repo: { required: true, type: "string" }
            },
            url: "/repos/:owner/:repo/releases/:release_id"
        },
        deleteReleaseAsset: {
            method: "DELETE",
            params: {
                asset_id: { required: true, type: "integer" },
                owner: { required: true, type: "string" },
                repo: { required: true, type: "string" }
            },
            url: "/repos/:owner/:repo/releases/assets/:asset_id"
        },
        disableAutomatedSecurityFixes: {
            headers: { accept: "application/vnd.github.london-preview+json" },
            method: "DELETE",
            params: {
                owner: { required: true, type: "string" },
                repo: { required: true, type: "string" }
            },
            url: "/repos/:owner/:repo/automated-security-fixes"
        },
        disablePagesSite: {
            headers: { accept: "application/vnd.github.switcheroo-preview+json" },
            method: "DELETE",
            params: {
                owner: { required: true, type: "string" },
                repo: { required: true, type: "string" }
            },
            url: "/repos/:owner/:repo/pages"
        },
        disableVulnerabilityAlerts: {
            headers: { accept: "application/vnd.github.dorian-preview+json" },
            method: "DELETE",
            params: {
                owner: { required: true, type: "string" },
                repo: { required: true, type: "string" }
            },
            url: "/repos/:owner/:repo/vulnerability-alerts"
        },
        enableAutomatedSecurityFixes: {
            headers: { accept: "application/vnd.github.london-preview+json" },
            method: "PUT",
            params: {
                owner: { required: true, type: "string" },
                repo: { required: true, type: "string" }
            },
            url: "/repos/:owner/:repo/automated-security-fixes"
        },
        enablePagesSite: {
            headers: { accept: "application/vnd.github.switcheroo-preview+json" },
            method: "POST",
            params: {
                owner: { required: true, type: "string" },
                repo: { required: true, type: "string" },
                source: { type: "object" },
                "source.branch": { enum: ["master", "gh-pages"], type: "string" },
                "source.path": { type: "string" }
            },
            url: "/repos/:owner/:repo/pages"
        },
        enableVulnerabilityAlerts: {
            headers: { accept: "application/vnd.github.dorian-preview+json" },
            method: "PUT",
            params: {
                owner: { required: true, type: "string" },
                repo: { required: true, type: "string" }
            },
            url: "/repos/:owner/:repo/vulnerability-alerts"
        },
        get: {
            method: "GET",
            params: {
                owner: { required: true, type: "string" },
                repo: { required: true, type: "string" }
            },
            url: "/repos/:owner/:repo"
        },
        getAppsWithAccessToProtectedBranch: {
            method: "GET",
            params: {
                branch: { required: true, type: "string" },
                owner: { required: true, type: "string" },
                repo: { required: true, type: "string" }
            },
            url: "/repos/:owner/:repo/branches/:branch/protection/restrictions/apps"
        },
        getArchiveLink: {
            method: "GET",
            params: {
                archive_format: { required: true, type: "string" },
                owner: { required: true, type: "string" },
                ref: { required: true, type: "string" },
                repo: { required: true, type: "string" }
            },
            url: "/repos/:owner/:repo/:archive_format/:ref"
        },
        getBranch: {
            method: "GET",
            params: {
                branch: { required: true, type: "string" },
                owner: { required: true, type: "string" },
                repo: { required: true, type: "string" }
            },
            url: "/repos/:owner/:repo/branches/:branch"
        },
        getBranchProtection: {
            method: "GET",
            params: {
                branch: { required: true, type: "string" },
                owner: { required: true, type: "string" },
                repo: { required: true, type: "string" }
            },
            url: "/repos/:owner/:repo/branches/:branch/protection"
        },
        getClones: {
            method: "GET",
            params: {
                owner: { required: true, type: "string" },
                per: { enum: ["day", "week"], type: "string" },
                repo: { required: true, type: "string" }
            },
            url: "/repos/:owner/:repo/traffic/clones"
        },
        getCodeFrequencyStats: {
            method: "GET",
            params: {
                owner: { required: true, type: "string" },
                repo: { required: true, type: "string" }
            },
            url: "/repos/:owner/:repo/stats/code_frequency"
        },
        getCollaboratorPermissionLevel: {
            method: "GET",
            params: {
                owner: { required: true, type: "string" },
                repo: { required: true, type: "string" },
                username: { required: true, type: "string" }
            },
            url: "/repos/:owner/:repo/collaborators/:username/permission"
        },
        getCombinedStatusForRef: {
            method: "GET",
            params: {
                owner: { required: true, type: "string" },
                ref: { required: true, type: "string" },
                repo: { required: true, type: "string" }
            },
            url: "/repos/:owner/:repo/commits/:ref/status"
        },
        getCommit: {
            method: "GET",
            params: {
                commit_sha: { alias: "ref", deprecated: true, type: "string" },
                owner: { required: true, type: "string" },
                ref: { required: true, type: "string" },
                repo: { required: true, type: "string" },
                sha: { alias: "ref", deprecated: true, type: "string" }
            },
            url: "/repos/:owner/:repo/commits/:ref"
        },
        getCommitActivityStats: {
            method: "GET",
            params: {
                owner: { required: true, type: "string" },
                repo: { required: true, type: "string" }
            },
            url: "/repos/:owner/:repo/stats/commit_activity"
        },
        getCommitComment: {
            method: "GET",
            params: {
                comment_id: { required: true, type: "integer" },
                owner: { required: true, type: "string" },
                repo: { required: true, type: "string" }
            },
            url: "/repos/:owner/:repo/comments/:comment_id"
        },
        getCommitRefSha: {
            deprecated: "octokit.repos.getCommitRefSha() is deprecated, see https://developer.github.com/v3/repos/commits/#get-a-single-commit",
            headers: { accept: "application/vnd.github.v3.sha" },
            method: "GET",
            params: {
                owner: { required: true, type: "string" },
                ref: { required: true, type: "string" },
                repo: { required: true, type: "string" }
            },
            url: "/repos/:owner/:repo/commits/:ref"
        },
        getContents: {
            method: "GET",
            params: {
                owner: { required: true, type: "string" },
                path: { required: true, type: "string" },
                ref: { type: "string" },
                repo: { required: true, type: "string" }
            },
            url: "/repos/:owner/:repo/contents/:path"
        },
        getContributorsStats: {
            method: "GET",
            params: {
                owner: { required: true, type: "string" },
                repo: { required: true, type: "string" }
            },
            url: "/repos/:owner/:repo/stats/contributors"
        },
        getDeployKey: {
            method: "GET",
            params: {
                key_id: { required: true, type: "integer" },
                owner: { required: true, type: "string" },
                repo: { required: true, type: "string" }
            },
            url: "/repos/:owner/:repo/keys/:key_id"
        },
        getDeployment: {
            method: "GET",
            params: {
                deployment_id: { required: true, type: "integer" },
                owner: { required: true, type: "string" },
                repo: { required: true, type: "string" }
            },
            url: "/repos/:owner/:repo/deployments/:deployment_id"
        },
        getDeploymentStatus: {
            method: "GET",
            params: {
                deployment_id: { required: true, type: "integer" },
                owner: { required: true, type: "string" },
                repo: { required: true, type: "string" },
                status_id: { required: true, type: "integer" }
            },
            url: "/repos/:owner/:repo/deployments/:deployment_id/statuses/:status_id"
        },
        getDownload: {
            method: "GET",
            params: {
                download_id: { required: true, type: "integer" },
                owner: { required: true, type: "string" },
                repo: { required: true, type: "string" }
            },
            url: "/repos/:owner/:repo/downloads/:download_id"
        },
        getHook: {
            method: "GET",
            params: {
                hook_id: { required: true, type: "integer" },
                owner: { required: true, type: "string" },
                repo: { required: true, type: "string" }
            },
            url: "/repos/:owner/:repo/hooks/:hook_id"
        },
        getLatestPagesBuild: {
            method: "GET",
            params: {
                owner: { required: true, type: "string" },
                repo: { required: true, type: "string" }
            },
            url: "/repos/:owner/:repo/pages/builds/latest"
        },
        getLatestRelease: {
            method: "GET",
            params: {
                owner: { required: true, type: "string" },
                repo: { required: true, type: "string" }
            },
            url: "/repos/:owner/:repo/releases/latest"
        },
        getPages: {
            method: "GET",
            params: {
                owner: { required: true, type: "string" },
                repo: { required: true, type: "string" }
            },
            url: "/repos/:owner/:repo/pages"
        },
        getPagesBuild: {
            method: "GET",
            params: {
                build_id: { required: true, type: "integer" },
                owner: { required: true, type: "string" },
                repo: { required: true, type: "string" }
            },
            url: "/repos/:owner/:repo/pages/builds/:build_id"
        },
        getParticipationStats: {
            method: "GET",
            params: {
                owner: { required: true, type: "string" },
                repo: { required: true, type: "string" }
            },
            url: "/repos/:owner/:repo/stats/participation"
        },
        getProtectedBranchAdminEnforcement: {
            method: "GET",
            params: {
                branch: { required: true, type: "string" },
                owner: { required: true, type: "string" },
                repo: { required: true, type: "string" }
            },
            url: "/repos/:owner/:repo/branches/:branch/protection/enforce_admins"
        },
        getProtectedBranchPullRequestReviewEnforcement: {
            method: "GET",
            params: {
                branch: { required: true, type: "string" },
                owner: { required: true, type: "string" },
                repo: { required: true, type: "string" }
            },
            url: "/repos/:owner/:repo/branches/:branch/protection/required_pull_request_reviews"
        },
        getProtectedBranchRequiredSignatures: {
            headers: { accept: "application/vnd.github.zzzax-preview+json" },
            method: "GET",
            params: {
                branch: { required: true, type: "string" },
                owner: { required: true, type: "string" },
                repo: { required: true, type: "string" }
            },
            url: "/repos/:owner/:repo/branches/:branch/protection/required_signatures"
        },
        getProtectedBranchRequiredStatusChecks: {
            method: "GET",
            params: {
                branch: { required: true, type: "string" },
                owner: { required: true, type: "string" },
                repo: { required: true, type: "string" }
            },
            url: "/repos/:owner/:repo/branches/:branch/protection/required_status_checks"
        },
        getProtectedBranchRestrictions: {
            method: "GET",
            params: {
                branch: { required: true, type: "string" },
                owner: { required: true, type: "string" },
                repo: { required: true, type: "string" }
            },
            url: "/repos/:owner/:repo/branches/:branch/protection/restrictions"
        },
        getPunchCardStats: {
            method: "GET",
            params: {
                owner: { required: true, type: "string" },
                repo: { required: true, type: "string" }
            },
            url: "/repos/:owner/:repo/stats/punch_card"
        },
        getReadme: {
            method: "GET",
            params: {
                owner: { required: true, type: "string" },
                ref: { type: "string" },
                repo: { required: true, type: "string" }
            },
            url: "/repos/:owner/:repo/readme"
        },
        getRelease: {
            method: "GET",
            params: {
                owner: { required: true, type: "string" },
                release_id: { required: true, type: "integer" },
                repo: { required: true, type: "string" }
            },
            url: "/repos/:owner/:repo/releases/:release_id"
        },
        getReleaseAsset: {
            method: "GET",
            params: {
                asset_id: { required: true, type: "integer" },
                owner: { required: true, type: "string" },
                repo: { required: true, type: "string" }
            },
            url: "/repos/:owner/:repo/releases/assets/:asset_id"
        },
        getReleaseByTag: {
            method: "GET",
            params: {
                owner: { required: true, type: "string" },
                repo: { required: true, type: "string" },
                tag: { required: true, type: "string" }
            },
            url: "/repos/:owner/:repo/releases/tags/:tag"
        },
        getTeamsWithAccessToProtectedBranch: {
            method: "GET",
            params: {
                branch: { required: true, type: "string" },
                owner: { required: true, type: "string" },
                repo: { required: true, type: "string" }
            },
            url: "/repos/:owner/:repo/branches/:branch/protection/restrictions/teams"
        },
        getTopPaths: {
            method: "GET",
            params: {
                owner: { required: true, type: "string" },
                repo: { required: true, type: "string" }
            },
            url: "/repos/:owner/:repo/traffic/popular/paths"
        },
        getTopReferrers: {
            method: "GET",
            params: {
                owner: { required: true, type: "string" },
                repo: { required: true, type: "string" }
            },
            url: "/repos/:owner/:repo/traffic/popular/referrers"
        },
        getUsersWithAccessToProtectedBranch: {
            method: "GET",
            params: {
                branch: { required: true, type: "string" },
                owner: { required: true, type: "string" },
                repo: { required: true, type: "string" }
            },
            url: "/repos/:owner/:repo/branches/:branch/protection/restrictions/users"
        },
        getViews: {
            method: "GET",
            params: {
                owner: { required: true, type: "string" },
                per: { enum: ["day", "week"], type: "string" },
                repo: { required: true, type: "string" }
            },
            url: "/repos/:owner/:repo/traffic/views"
        },
        list: {
            method: "GET",
            params: {
                affiliation: { type: "string" },
                direction: { enum: ["asc", "desc"], type: "string" },
                page: { type: "integer" },
                per_page: { type: "integer" },
                sort: {
                    enum: ["created", "updated", "pushed", "full_name"],
                    type: "string"
                },
                type: {
                    enum: ["all", "owner", "public", "private", "member"],
                    type: "string"
                },
                visibility: { enum: ["all", "public", "private"], type: "string" }
            },
            url: "/user/repos"
        },
        listAppsWithAccessToProtectedBranch: {
            deprecated: "octokit.repos.listAppsWithAccessToProtectedBranch() has been renamed to octokit.repos.getAppsWithAccessToProtectedBranch() (2019-09-13)",
            method: "GET",
            params: {
                branch: { required: true, type: "string" },
                owner: { required: true, type: "string" },
                repo: { required: true, type: "string" }
            },
            url: "/repos/:owner/:repo/branches/:branch/protection/restrictions/apps"
        },
        listAssetsForRelease: {
            method: "GET",
            params: {
                owner: { required: true, type: "string" },
                page: { type: "integer" },
                per_page: { type: "integer" },
                release_id: { required: true, type: "integer" },
                repo: { required: true, type: "string" }
            },
            url: "/repos/:owner/:repo/releases/:release_id/assets"
        },
        listBranches: {
            method: "GET",
            params: {
                owner: { required: true, type: "string" },
                page: { type: "integer" },
                per_page: { type: "integer" },
                protected: { type: "boolean" },
                repo: { required: true, type: "string" }
            },
            url: "/repos/:owner/:repo/branches"
        },
        listBranchesForHeadCommit: {
            headers: { accept: "application/vnd.github.groot-preview+json" },
            method: "GET",
            params: {
                commit_sha: { required: true, type: "string" },
                owner: { required: true, type: "string" },
                repo: { required: true, type: "string" }
            },
            url: "/repos/:owner/:repo/commits/:commit_sha/branches-where-head"
        },
        listCollaborators: {
            method: "GET",
            params: {
                affiliation: { enum: ["outside", "direct", "all"], type: "string" },
                owner: { required: true, type: "string" },
                page: { type: "integer" },
                per_page: { type: "integer" },
                repo: { required: true, type: "string" }
            },
            url: "/repos/:owner/:repo/collaborators"
        },
        listCommentsForCommit: {
            method: "GET",
            params: {
                commit_sha: { required: true, type: "string" },
                owner: { required: true, type: "string" },
                page: { type: "integer" },
                per_page: { type: "integer" },
                ref: { alias: "commit_sha", deprecated: true, type: "string" },
                repo: { required: true, type: "string" }
            },
            url: "/repos/:owner/:repo/commits/:commit_sha/comments"
        },
        listCommitComments: {
            method: "GET",
            params: {
                owner: { required: true, type: "string" },
                page: { type: "integer" },
                per_page: { type: "integer" },
                repo: { required: true, type: "string" }
            },
            url: "/repos/:owner/:repo/comments"
        },
        listCommits: {
            method: "GET",
            params: {
                author: { type: "string" },
                owner: { required: true, type: "string" },
                page: { type: "integer" },
                path: { type: "string" },
                per_page: { type: "integer" },
                repo: { required: true, type: "string" },
                sha: { type: "string" },
                since: { type: "string" },
                until: { type: "string" }
            },
            url: "/repos/:owner/:repo/commits"
        },
        listContributors: {
            method: "GET",
            params: {
                anon: { type: "string" },
                owner: { required: true, type: "string" },
                page: { type: "integer" },
                per_page: { type: "integer" },
                repo: { required: true, type: "string" }
            },
            url: "/repos/:owner/:repo/contributors"
        },
        listDeployKeys: {
            method: "GET",
            params: {
                owner: { required: true, type: "string" },
                page: { type: "integer" },
                per_page: { type: "integer" },
                repo: { required: true, type: "string" }
            },
            url: "/repos/:owner/:repo/keys"
        },
        listDeploymentStatuses: {
            method: "GET",
            params: {
                deployment_id: { required: true, type: "integer" },
                owner: { required: true, type: "string" },
                page: { type: "integer" },
                per_page: { type: "integer" },
                repo: { required: true, type: "string" }
            },
            url: "/repos/:owner/:repo/deployments/:deployment_id/statuses"
        },
        listDeployments: {
            method: "GET",
            params: {
                environment: { type: "string" },
                owner: { required: true, type: "string" },
                page: { type: "integer" },
                per_page: { type: "integer" },
                ref: { type: "string" },
                repo: { required: true, type: "string" },
                sha: { type: "string" },
                task: { type: "string" }
            },
            url: "/repos/:owner/:repo/deployments"
        },
        listDownloads: {
            method: "GET",
            params: {
                owner: { required: true, type: "string" },
                page: { type: "integer" },
                per_page: { type: "integer" },
                repo: { required: true, type: "string" }
            },
            url: "/repos/:owner/:repo/downloads"
        },
        listForOrg: {
            method: "GET",
            params: {
                direction: { enum: ["asc", "desc"], type: "string" },
                org: { required: true, type: "string" },
                page: { type: "integer" },
                per_page: { type: "integer" },
                sort: {
                    enum: ["created", "updated", "pushed", "full_name"],
                    type: "string"
                },
                type: {
                    enum: [
                        "all",
                        "public",
                        "private",
                        "forks",
                        "sources",
                        "member",
                        "internal"
                    ],
                    type: "string"
                }
            },
            url: "/orgs/:org/repos"
        },
        listForUser: {
            method: "GET",
            params: {
                direction: { enum: ["asc", "desc"], type: "string" },
                page: { type: "integer" },
                per_page: { type: "integer" },
                sort: {
                    enum: ["created", "updated", "pushed", "full_name"],
                    type: "string"
                },
                type: { enum: ["all", "owner", "member"], type: "string" },
                username: { required: true, type: "string" }
            },
            url: "/users/:username/repos"
        },
        listForks: {
            method: "GET",
            params: {
                owner: { required: true, type: "string" },
                page: { type: "integer" },
                per_page: { type: "integer" },
                repo: { required: true, type: "string" },
                sort: { enum: ["newest", "oldest", "stargazers"], type: "string" }
            },
            url: "/repos/:owner/:repo/forks"
        },
        listHooks: {
            method: "GET",
            params: {
                owner: { required: true, type: "string" },
                page: { type: "integer" },
                per_page: { type: "integer" },
                repo: { required: true, type: "string" }
            },
            url: "/repos/:owner/:repo/hooks"
        },
        listInvitations: {
            method: "GET",
            params: {
                owner: { required: true, type: "string" },
                page: { type: "integer" },
                per_page: { type: "integer" },
                repo: { required: true, type: "string" }
            },
            url: "/repos/:owner/:repo/invitations"
        },
        listInvitationsForAuthenticatedUser: {
            method: "GET",
            params: { page: { type: "integer" }, per_page: { type: "integer" } },
            url: "/user/repository_invitations"
        },
        listLanguages: {
            method: "GET",
            params: {
                owner: { required: true, type: "string" },
                repo: { required: true, type: "string" }
            },
            url: "/repos/:owner/:repo/languages"
        },
        listPagesBuilds: {
            method: "GET",
            params: {
                owner: { required: true, type: "string" },
                page: { type: "integer" },
                per_page: { type: "integer" },
                repo: { required: true, type: "string" }
            },
            url: "/repos/:owner/:repo/pages/builds"
        },
        listProtectedBranchRequiredStatusChecksContexts: {
            method: "GET",
            params: {
                branch: { required: true, type: "string" },
                owner: { required: true, type: "string" },
                repo: { required: true, type: "string" }
            },
            url: "/repos/:owner/:repo/branches/:branch/protection/required_status_checks/contexts"
        },
        listProtectedBranchTeamRestrictions: {
            deprecated: "octokit.repos.listProtectedBranchTeamRestrictions() has been renamed to octokit.repos.getTeamsWithAccessToProtectedBranch() (2019-09-09)",
            method: "GET",
            params: {
                branch: { required: true, type: "string" },
                owner: { required: true, type: "string" },
                repo: { required: true, type: "string" }
            },
            url: "/repos/:owner/:repo/branches/:branch/protection/restrictions/teams"
        },
        listProtectedBranchUserRestrictions: {
            deprecated: "octokit.repos.listProtectedBranchUserRestrictions() has been renamed to octokit.repos.getUsersWithAccessToProtectedBranch() (2019-09-09)",
            method: "GET",
            params: {
                branch: { required: true, type: "string" },
                owner: { required: true, type: "string" },
                repo: { required: true, type: "string" }
            },
            url: "/repos/:owner/:repo/branches/:branch/protection/restrictions/users"
        },
        listPublic: {
            method: "GET",
            params: {
                page: { type: "integer" },
                per_page: { type: "integer" },
                since: { type: "integer" }
            },
            url: "/repositories"
        },
        listPullRequestsAssociatedWithCommit: {
            headers: { accept: "application/vnd.github.groot-preview+json" },
            method: "GET",
            params: {
                commit_sha: { required: true, type: "string" },
                owner: { required: true, type: "string" },
                page: { type: "integer" },
                per_page: { type: "integer" },
                repo: { required: true, type: "string" }
            },
            url: "/repos/:owner/:repo/commits/:commit_sha/pulls"
        },
        listReleases: {
            method: "GET",
            params: {
                owner: { required: true, type: "string" },
                page: { type: "integer" },
                per_page: { type: "integer" },
                repo: { required: true, type: "string" }
            },
            url: "/repos/:owner/:repo/releases"
        },
        listStatusesForRef: {
            method: "GET",
            params: {
                owner: { required: true, type: "string" },
                page: { type: "integer" },
                per_page: { type: "integer" },
                ref: { required: true, type: "string" },
                repo: { required: true, type: "string" }
            },
            url: "/repos/:owner/:repo/commits/:ref/statuses"
        },
        listTags: {
            method: "GET",
            params: {
                owner: { required: true, type: "string" },
                page: { type: "integer" },
                per_page: { type: "integer" },
                repo: { required: true, type: "string" }
            },
            url: "/repos/:owner/:repo/tags"
        },
        listTeams: {
            method: "GET",
            params: {
                owner: { required: true, type: "string" },
                page: { type: "integer" },
                per_page: { type: "integer" },
                repo: { required: true, type: "string" }
            },
            url: "/repos/:owner/:repo/teams"
        },
        listTeamsWithAccessToProtectedBranch: {
            deprecated: "octokit.repos.listTeamsWithAccessToProtectedBranch() has been renamed to octokit.repos.getTeamsWithAccessToProtectedBranch() (2019-09-13)",
            method: "GET",
            params: {
                branch: { required: true, type: "string" },
                owner: { required: true, type: "string" },
                repo: { required: true, type: "string" }
            },
            url: "/repos/:owner/:repo/branches/:branch/protection/restrictions/teams"
        },
        listTopics: {
            headers: { accept: "application/vnd.github.mercy-preview+json" },
            method: "GET",
            params: {
                owner: { required: true, type: "string" },
                repo: { required: true, type: "string" }
            },
            url: "/repos/:owner/:repo/topics"
        },
        listUsersWithAccessToProtectedBranch: {
            deprecated: "octokit.repos.listUsersWithAccessToProtectedBranch() has been renamed to octokit.repos.getUsersWithAccessToProtectedBranch() (2019-09-13)",
            method: "GET",
            params: {
                branch: { required: true, type: "string" },
                owner: { required: true, type: "string" },
                repo: { required: true, type: "string" }
            },
            url: "/repos/:owner/:repo/branches/:branch/protection/restrictions/users"
        },
        merge: {
            method: "POST",
            params: {
                base: { required: true, type: "string" },
                commit_message: { type: "string" },
                head: { required: true, type: "string" },
                owner: { required: true, type: "string" },
                repo: { required: true, type: "string" }
            },
            url: "/repos/:owner/:repo/merges"
        },
        pingHook: {
            method: "POST",
            params: {
                hook_id: { required: true, type: "integer" },
                owner: { required: true, type: "string" },
                repo: { required: true, type: "string" }
            },
            url: "/repos/:owner/:repo/hooks/:hook_id/pings"
        },
        removeBranchProtection: {
            method: "DELETE",
            params: {
                branch: { required: true, type: "string" },
                owner: { required: true, type: "string" },
                repo: { required: true, type: "string" }
            },
            url: "/repos/:owner/:repo/branches/:branch/protection"
        },
        removeCollaborator: {
            method: "DELETE",
            params: {
                owner: { required: true, type: "string" },
                repo: { required: true, type: "string" },
                username: { required: true, type: "string" }
            },
            url: "/repos/:owner/:repo/collaborators/:username"
        },
        removeDeployKey: {
            method: "DELETE",
            params: {
                key_id: { required: true, type: "integer" },
                owner: { required: true, type: "string" },
                repo: { required: true, type: "string" }
            },
            url: "/repos/:owner/:repo/keys/:key_id"
        },
        removeProtectedBranchAdminEnforcement: {
            method: "DELETE",
            params: {
                branch: { required: true, type: "string" },
                owner: { required: true, type: "string" },
                repo: { required: true, type: "string" }
            },
            url: "/repos/:owner/:repo/branches/:branch/protection/enforce_admins"
        },
        removeProtectedBranchAppRestrictions: {
            method: "DELETE",
            params: {
                apps: { mapTo: "data", required: true, type: "string[]" },
                branch: { required: true, type: "string" },
                owner: { required: true, type: "string" },
                repo: { required: true, type: "string" }
            },
            url: "/repos/:owner/:repo/branches/:branch/protection/restrictions/apps"
        },
        removeProtectedBranchPullRequestReviewEnforcement: {
            method: "DELETE",
            params: {
                branch: { required: true, type: "string" },
                owner: { required: true, type: "string" },
                repo: { required: true, type: "string" }
            },
            url: "/repos/:owner/:repo/branches/:branch/protection/required_pull_request_reviews"
        },
        removeProtectedBranchRequiredSignatures: {
            headers: { accept: "application/vnd.github.zzzax-preview+json" },
            method: "DELETE",
            params: {
                branch: { required: true, type: "string" },
                owner: { required: true, type: "string" },
                repo: { required: true, type: "string" }
            },
            url: "/repos/:owner/:repo/branches/:branch/protection/required_signatures"
        },
        removeProtectedBranchRequiredStatusChecks: {
            method: "DELETE",
            params: {
                branch: { required: true, type: "string" },
                owner: { required: true, type: "string" },
                repo: { required: true, type: "string" }
            },
            url: "/repos/:owner/:repo/branches/:branch/protection/required_status_checks"
        },
        removeProtectedBranchRequiredStatusChecksContexts: {
            method: "DELETE",
            params: {
                branch: { required: true, type: "string" },
                contexts: { mapTo: "data", required: true, type: "string[]" },
                owner: { required: true, type: "string" },
                repo: { required: true, type: "string" }
            },
            url: "/repos/:owner/:repo/branches/:branch/protection/required_status_checks/contexts"
        },
        removeProtectedBranchRestrictions: {
            method: "DELETE",
            params: {
                branch: { required: true, type: "string" },
                owner: { required: true, type: "string" },
                repo: { required: true, type: "string" }
            },
            url: "/repos/:owner/:repo/branches/:branch/protection/restrictions"
        },
        removeProtectedBranchTeamRestrictions: {
            method: "DELETE",
            params: {
                branch: { required: true, type: "string" },
                owner: { required: true, type: "string" },
                repo: { required: true, type: "string" },
                teams: { mapTo: "data", required: true, type: "string[]" }
            },
            url: "/repos/:owner/:repo/branches/:branch/protection/restrictions/teams"
        },
        removeProtectedBranchUserRestrictions: {
            method: "DELETE",
            params: {
                branch: { required: true, type: "string" },
                owner: { required: true, type: "string" },
                repo: { required: true, type: "string" },
                users: { mapTo: "data", required: true, type: "string[]" }
            },
            url: "/repos/:owner/:repo/branches/:branch/protection/restrictions/users"
        },
        replaceProtectedBranchAppRestrictions: {
            method: "PUT",
            params: {
                apps: { mapTo: "data", required: true, type: "string[]" },
                branch: { required: true, type: "string" },
                owner: { required: true, type: "string" },
                repo: { required: true, type: "string" }
            },
            url: "/repos/:owner/:repo/branches/:branch/protection/restrictions/apps"
        },
        replaceProtectedBranchRequiredStatusChecksContexts: {
            method: "PUT",
            params: {
                branch: { required: true, type: "string" },
                contexts: { mapTo: "data", required: true, type: "string[]" },
                owner: { required: true, type: "string" },
                repo: { required: true, type: "string" }
            },
            url: "/repos/:owner/:repo/branches/:branch/protection/required_status_checks/contexts"
        },
        replaceProtectedBranchTeamRestrictions: {
            method: "PUT",
            params: {
                branch: { required: true, type: "string" },
                owner: { required: true, type: "string" },
                repo: { required: true, type: "string" },
                teams: { mapTo: "data", required: true, type: "string[]" }
            },
            url: "/repos/:owner/:repo/branches/:branch/protection/restrictions/teams"
        },
        replaceProtectedBranchUserRestrictions: {
            method: "PUT",
            params: {
                branch: { required: true, type: "string" },
                owner: { required: true, type: "string" },
                repo: { required: true, type: "string" },
                users: { mapTo: "data", required: true, type: "string[]" }
            },
            url: "/repos/:owner/:repo/branches/:branch/protection/restrictions/users"
        },
        replaceTopics: {
            headers: { accept: "application/vnd.github.mercy-preview+json" },
            method: "PUT",
            params: {
                names: { required: true, type: "string[]" },
                owner: { required: true, type: "string" },
                repo: { required: true, type: "string" }
            },
            url: "/repos/:owner/:repo/topics"
        },
        requestPageBuild: {
            method: "POST",
            params: {
                owner: { required: true, type: "string" },
                repo: { required: true, type: "string" }
            },
            url: "/repos/:owner/:repo/pages/builds"
        },
        retrieveCommunityProfileMetrics: {
            method: "GET",
            params: {
                owner: { required: true, type: "string" },
                repo: { required: true, type: "string" }
            },
            url: "/repos/:owner/:repo/community/profile"
        },
        testPushHook: {
            method: "POST",
            params: {
                hook_id: { required: true, type: "integer" },
                owner: { required: true, type: "string" },
                repo: { required: true, type: "string" }
            },
            url: "/repos/:owner/:repo/hooks/:hook_id/tests"
        },
        transfer: {
            method: "POST",
            params: {
                new_owner: { type: "string" },
                owner: { required: true, type: "string" },
                repo: { required: true, type: "string" },
                team_ids: { type: "integer[]" }
            },
            url: "/repos/:owner/:repo/transfer"
        },
        update: {
            method: "PATCH",
            params: {
                allow_merge_commit: { type: "boolean" },
                allow_rebase_merge: { type: "boolean" },
                allow_squash_merge: { type: "boolean" },
                archived: { type: "boolean" },
                default_branch: { type: "string" },
                delete_branch_on_merge: { type: "boolean" },
                description: { type: "string" },
                has_issues: { type: "boolean" },
                has_projects: { type: "boolean" },
                has_wiki: { type: "boolean" },
                homepage: { type: "string" },
                is_template: { type: "boolean" },
                name: { type: "string" },
                owner: { required: true, type: "string" },
                private: { type: "boolean" },
                repo: { required: true, type: "string" },
                visibility: {
                    enum: ["public", "private", "visibility", "internal"],
                    type: "string"
                }
            },
            url: "/repos/:owner/:repo"
        },
        updateBranchProtection: {
            method: "PUT",
            params: {
                allow_deletions: { type: "boolean" },
                allow_force_pushes: { allowNull: true, type: "boolean" },
                branch: { required: true, type: "string" },
                enforce_admins: { allowNull: true, required: true, type: "boolean" },
                owner: { required: true, type: "string" },
                repo: { required: true, type: "string" },
                required_linear_history: { type: "boolean" },
                required_pull_request_reviews: {
                    allowNull: true,
                    required: true,
                    type: "object"
                },
                "required_pull_request_reviews.dismiss_stale_reviews": {
                    type: "boolean"
                },
                "required_pull_request_reviews.dismissal_restrictions": {
                    type: "object"
                },
                "required_pull_request_reviews.dismissal_restrictions.teams": {
                    type: "string[]"
                },
                "required_pull_request_reviews.dismissal_restrictions.users": {
                    type: "string[]"
                },
                "required_pull_request_reviews.require_code_owner_reviews": {
                    type: "boolean"
                },
                "required_pull_request_reviews.required_approving_review_count": {
                    type: "integer"
                },
                required_status_checks: {
                    allowNull: true,
                    required: true,
                    type: "object"
                },
                "required_status_checks.contexts": { required: true, type: "string[]" },
                "required_status_checks.strict": { required: true, type: "boolean" },
                restrictions: { allowNull: true, required: true, type: "object" },
                "restrictions.apps": { type: "string[]" },
                "restrictions.teams": { required: true, type: "string[]" },
                "restrictions.users": { required: true, type: "string[]" }
            },
            url: "/repos/:owner/:repo/branches/:branch/protection"
        },
        updateCommitComment: {
            method: "PATCH",
            params: {
                body: { required: true, type: "string" },
                comment_id: { required: true, type: "integer" },
                owner: { required: true, type: "string" },
                repo: { required: true, type: "string" }
            },
            url: "/repos/:owner/:repo/comments/:comment_id"
        },
        updateFile: {
            deprecated: "octokit.repos.updateFile() has been renamed to octokit.repos.createOrUpdateFile() (2019-06-07)",
            method: "PUT",
            params: {
                author: { type: "object" },
                "author.email": { required: true, type: "string" },
                "author.name": { required: true, type: "string" },
                branch: { type: "string" },
                committer: { type: "object" },
                "committer.email": { required: true, type: "string" },
                "committer.name": { required: true, type: "string" },
                content: { required: true, type: "string" },
                message: { required: true, type: "string" },
                owner: { required: true, type: "string" },
                path: { required: true, type: "string" },
                repo: { required: true, type: "string" },
                sha: { type: "string" }
            },
            url: "/repos/:owner/:repo/contents/:path"
        },
        updateHook: {
            method: "PATCH",
            params: {
                active: { type: "boolean" },
                add_events: { type: "string[]" },
                config: { type: "object" },
                "config.content_type": { type: "string" },
                "config.insecure_ssl": { type: "string" },
                "config.secret": { type: "string" },
                "config.url": { required: true, type: "string" },
                events: { type: "string[]" },
                hook_id: { required: true, type: "integer" },
                owner: { required: true, type: "string" },
                remove_events: { type: "string[]" },
                repo: { required: true, type: "string" }
            },
            url: "/repos/:owner/:repo/hooks/:hook_id"
        },
        updateInformationAboutPagesSite: {
            method: "PUT",
            params: {
                cname: { type: "string" },
                owner: { required: true, type: "string" },
                repo: { required: true, type: "string" },
                source: {
                    enum: ['"gh-pages"', '"master"', '"master /docs"'],
                    type: "string"
                }
            },
            url: "/repos/:owner/:repo/pages"
        },
        updateInvitation: {
            method: "PATCH",
            params: {
                invitation_id: { required: true, type: "integer" },
                owner: { required: true, type: "string" },
                permissions: { enum: ["read", "write", "admin"], type: "string" },
                repo: { required: true, type: "string" }
            },
            url: "/repos/:owner/:repo/invitations/:invitation_id"
        },
        updateProtectedBranchPullRequestReviewEnforcement: {
            method: "PATCH",
            params: {
                branch: { required: true, type: "string" },
                dismiss_stale_reviews: { type: "boolean" },
                dismissal_restrictions: { type: "object" },
                "dismissal_restrictions.teams": { type: "string[]" },
                "dismissal_restrictions.users": { type: "string[]" },
                owner: { required: true, type: "string" },
                repo: { required: true, type: "string" },
                require_code_owner_reviews: { type: "boolean" },
                required_approving_review_count: { type: "integer" }
            },
            url: "/repos/:owner/:repo/branches/:branch/protection/required_pull_request_reviews"
        },
        updateProtectedBranchRequiredStatusChecks: {
            method: "PATCH",
            params: {
                branch: { required: true, type: "string" },
                contexts: { type: "string[]" },
                owner: { required: true, type: "string" },
                repo: { required: true, type: "string" },
                strict: { type: "boolean" }
            },
            url: "/repos/:owner/:repo/branches/:branch/protection/required_status_checks"
        },
        updateRelease: {
            method: "PATCH",
            params: {
                body: { type: "string" },
                draft: { type: "boolean" },
                name: { type: "string" },
                owner: { required: true, type: "string" },
                prerelease: { type: "boolean" },
                release_id: { required: true, type: "integer" },
                repo: { required: true, type: "string" },
                tag_name: { type: "string" },
                target_commitish: { type: "string" }
            },
            url: "/repos/:owner/:repo/releases/:release_id"
        },
        updateReleaseAsset: {
            method: "PATCH",
            params: {
                asset_id: { required: true, type: "integer" },
                label: { type: "string" },
                name: { type: "string" },
                owner: { required: true, type: "string" },
                repo: { required: true, type: "string" }
            },
            url: "/repos/:owner/:repo/releases/assets/:asset_id"
        },
        uploadReleaseAsset: {
            method: "POST",
            params: {
                data: { mapTo: "data", required: true, type: "string | object" },
                file: { alias: "data", deprecated: true, type: "string | object" },
                headers: { required: true, type: "object" },
                "headers.content-length": { required: true, type: "integer" },
                "headers.content-type": { required: true, type: "string" },
                label: { type: "string" },
                name: { required: true, type: "string" },
                url: { required: true, type: "string" }
            },
            url: ":url"
        }
    },
    search: {
        code: {
            method: "GET",
            params: {
                order: { enum: ["desc", "asc"], type: "string" },
                page: { type: "integer" },
                per_page: { type: "integer" },
                q: { required: true, type: "string" },
                sort: { enum: ["indexed"], type: "string" }
            },
            url: "/search/code"
        },
        commits: {
            headers: { accept: "application/vnd.github.cloak-preview+json" },
            method: "GET",
            params: {
                order: { enum: ["desc", "asc"], type: "string" },
                page: { type: "integer" },
                per_page: { type: "integer" },
                q: { required: true, type: "string" },
                sort: { enum: ["author-date", "committer-date"], type: "string" }
            },
            url: "/search/commits"
        },
        issues: {
            deprecated: "octokit.search.issues() has been renamed to octokit.search.issuesAndPullRequests() (2018-12-27)",
            method: "GET",
            params: {
                order: { enum: ["desc", "asc"], type: "string" },
                page: { type: "integer" },
                per_page: { type: "integer" },
                q: { required: true, type: "string" },
                sort: {
                    enum: [
                        "comments",
                        "reactions",
                        "reactions-+1",
                        "reactions--1",
                        "reactions-smile",
                        "reactions-thinking_face",
                        "reactions-heart",
                        "reactions-tada",
                        "interactions",
                        "created",
                        "updated"
                    ],
                    type: "string"
                }
            },
            url: "/search/issues"
        },
        issuesAndPullRequests: {
            method: "GET",
            params: {
                order: { enum: ["desc", "asc"], type: "string" },
                page: { type: "integer" },
                per_page: { type: "integer" },
                q: { required: true, type: "string" },
                sort: {
                    enum: [
                        "comments",
                        "reactions",
                        "reactions-+1",
                        "reactions--1",
                        "reactions-smile",
                        "reactions-thinking_face",
                        "reactions-heart",
                        "reactions-tada",
                        "interactions",
                        "created",
                        "updated"
                    ],
                    type: "string"
                }
            },
            url: "/search/issues"
        },
        labels: {
            method: "GET",
            params: {
                order: { enum: ["desc", "asc"], type: "string" },
                q: { required: true, type: "string" },
                repository_id: { required: true, type: "integer" },
                sort: { enum: ["created", "updated"], type: "string" }
            },
            url: "/search/labels"
        },
        repos: {
            method: "GET",
            params: {
                order: { enum: ["desc", "asc"], type: "string" },
                page: { type: "integer" },
                per_page: { type: "integer" },
                q: { required: true, type: "string" },
                sort: {
                    enum: ["stars", "forks", "help-wanted-issues", "updated"],
                    type: "string"
                }
            },
            url: "/search/repositories"
        },
        topics: {
            method: "GET",
            params: { q: { required: true, type: "string" } },
            url: "/search/topics"
        },
        users: {
            method: "GET",
            params: {
                order: { enum: ["desc", "asc"], type: "string" },
                page: { type: "integer" },
                per_page: { type: "integer" },
                q: { required: true, type: "string" },
                sort: { enum: ["followers", "repositories", "joined"], type: "string" }
            },
            url: "/search/users"
        }
    },
    teams: {
        addMember: {
            deprecated: "octokit.teams.addMember() has been renamed to octokit.teams.addMemberLegacy() (2020-01-16)",
            method: "PUT",
            params: {
                team_id: { required: true, type: "integer" },
                username: { required: true, type: "string" }
            },
            url: "/teams/:team_id/members/:username"
        },
        addMemberLegacy: {
            deprecated: "octokit.teams.addMemberLegacy() is deprecated, see https://developer.github.com/v3/teams/members/#add-team-member-legacy",
            method: "PUT",
            params: {
                team_id: { required: true, type: "integer" },
                username: { required: true, type: "string" }
            },
            url: "/teams/:team_id/members/:username"
        },
        addOrUpdateMembership: {
            deprecated: "octokit.teams.addOrUpdateMembership() has been renamed to octokit.teams.addOrUpdateMembershipLegacy() (2020-01-16)",
            method: "PUT",
            params: {
                role: { enum: ["member", "maintainer"], type: "string" },
                team_id: { required: true, type: "integer" },
                username: { required: true, type: "string" }
            },
            url: "/teams/:team_id/memberships/:username"
        },
        addOrUpdateMembershipInOrg: {
            method: "PUT",
            params: {
                org: { required: true, type: "string" },
                role: { enum: ["member", "maintainer"], type: "string" },
                team_slug: { required: true, type: "string" },
                username: { required: true, type: "string" }
            },
            url: "/orgs/:org/teams/:team_slug/memberships/:username"
        },
        addOrUpdateMembershipLegacy: {
            deprecated: "octokit.teams.addOrUpdateMembershipLegacy() is deprecated, see https://developer.github.com/v3/teams/members/#add-or-update-team-membership-legacy",
            method: "PUT",
            params: {
                role: { enum: ["member", "maintainer"], type: "string" },
                team_id: { required: true, type: "integer" },
                username: { required: true, type: "string" }
            },
            url: "/teams/:team_id/memberships/:username"
        },
        addOrUpdateProject: {
            deprecated: "octokit.teams.addOrUpdateProject() has been renamed to octokit.teams.addOrUpdateProjectLegacy() (2020-01-16)",
            headers: { accept: "application/vnd.github.inertia-preview+json" },
            method: "PUT",
            params: {
                permission: { enum: ["read", "write", "admin"], type: "string" },
                project_id: { required: true, type: "integer" },
                team_id: { required: true, type: "integer" }
            },
            url: "/teams/:team_id/projects/:project_id"
        },
        addOrUpdateProjectInOrg: {
            headers: { accept: "application/vnd.github.inertia-preview+json" },
            method: "PUT",
            params: {
                org: { required: true, type: "string" },
                permission: { enum: ["read", "write", "admin"], type: "string" },
                project_id: { required: true, type: "integer" },
                team_slug: { required: true, type: "string" }
            },
            url: "/orgs/:org/teams/:team_slug/projects/:project_id"
        },
        addOrUpdateProjectLegacy: {
            deprecated: "octokit.teams.addOrUpdateProjectLegacy() is deprecated, see https://developer.github.com/v3/teams/#add-or-update-team-project-legacy",
            headers: { accept: "application/vnd.github.inertia-preview+json" },
            method: "PUT",
            params: {
                permission: { enum: ["read", "write", "admin"], type: "string" },
                project_id: { required: true, type: "integer" },
                team_id: { required: true, type: "integer" }
            },
            url: "/teams/:team_id/projects/:project_id"
        },
        addOrUpdateRepo: {
            deprecated: "octokit.teams.addOrUpdateRepo() has been renamed to octokit.teams.addOrUpdateRepoLegacy() (2020-01-16)",
            method: "PUT",
            params: {
                owner: { required: true, type: "string" },
                permission: { enum: ["pull", "push", "admin"], type: "string" },
                repo: { required: true, type: "string" },
                team_id: { required: true, type: "integer" }
            },
            url: "/teams/:team_id/repos/:owner/:repo"
        },
        addOrUpdateRepoInOrg: {
            method: "PUT",
            params: {
                org: { required: true, type: "string" },
                owner: { required: true, type: "string" },
                permission: { enum: ["pull", "push", "admin"], type: "string" },
                repo: { required: true, type: "string" },
                team_slug: { required: true, type: "string" }
            },
            url: "/orgs/:org/teams/:team_slug/repos/:owner/:repo"
        },
        addOrUpdateRepoLegacy: {
            deprecated: "octokit.teams.addOrUpdateRepoLegacy() is deprecated, see https://developer.github.com/v3/teams/#add-or-update-team-repository-legacy",
            method: "PUT",
            params: {
                owner: { required: true, type: "string" },
                permission: { enum: ["pull", "push", "admin"], type: "string" },
                repo: { required: true, type: "string" },
                team_id: { required: true, type: "integer" }
            },
            url: "/teams/:team_id/repos/:owner/:repo"
        },
        checkManagesRepo: {
            deprecated: "octokit.teams.checkManagesRepo() has been renamed to octokit.teams.checkManagesRepoLegacy() (2020-01-16)",
            method: "GET",
            params: {
                owner: { required: true, type: "string" },
                repo: { required: true, type: "string" },
                team_id: { required: true, type: "integer" }
            },
            url: "/teams/:team_id/repos/:owner/:repo"
        },
        checkManagesRepoInOrg: {
            method: "GET",
            params: {
                org: { required: true, type: "string" },
                owner: { required: true, type: "string" },
                repo: { required: true, type: "string" },
                team_slug: { required: true, type: "string" }
            },
            url: "/orgs/:org/teams/:team_slug/repos/:owner/:repo"
        },
        checkManagesRepoLegacy: {
            deprecated: "octokit.teams.checkManagesRepoLegacy() is deprecated, see https://developer.github.com/v3/teams/#check-if-a-team-manages-a-repository-legacy",
            method: "GET",
            params: {
                owner: { required: true, type: "string" },
                repo: { required: true, type: "string" },
                team_id: { required: true, type: "integer" }
            },
            url: "/teams/:team_id/repos/:owner/:repo"
        },
        create: {
            method: "POST",
            params: {
                description: { type: "string" },
                maintainers: { type: "string[]" },
                name: { required: true, type: "string" },
                org: { required: true, type: "string" },
                parent_team_id: { type: "integer" },
                permission: { enum: ["pull", "push", "admin"], type: "string" },
                privacy: { enum: ["secret", "closed"], type: "string" },
                repo_names: { type: "string[]" }
            },
            url: "/orgs/:org/teams"
        },
        createDiscussion: {
            deprecated: "octokit.teams.createDiscussion() has been renamed to octokit.teams.createDiscussionLegacy() (2020-01-16)",
            method: "POST",
            params: {
                body: { required: true, type: "string" },
                private: { type: "boolean" },
                team_id: { required: true, type: "integer" },
                title: { required: true, type: "string" }
            },
            url: "/teams/:team_id/discussions"
        },
        createDiscussionComment: {
            deprecated: "octokit.teams.createDiscussionComment() has been renamed to octokit.teams.createDiscussionCommentLegacy() (2020-01-16)",
            method: "POST",
            params: {
                body: { required: true, type: "string" },
                discussion_number: { required: true, type: "integer" },
                team_id: { required: true, type: "integer" }
            },
            url: "/teams/:team_id/discussions/:discussion_number/comments"
        },
        createDiscussionCommentInOrg: {
            method: "POST",
            params: {
                body: { required: true, type: "string" },
                discussion_number: { required: true, type: "integer" },
                org: { required: true, type: "string" },
                team_slug: { required: true, type: "string" }
            },
            url: "/orgs/:org/teams/:team_slug/discussions/:discussion_number/comments"
        },
        createDiscussionCommentLegacy: {
            deprecated: "octokit.teams.createDiscussionCommentLegacy() is deprecated, see https://developer.github.com/v3/teams/discussion_comments/#create-a-comment-legacy",
            method: "POST",
            params: {
                body: { required: true, type: "string" },
                discussion_number: { required: true, type: "integer" },
                team_id: { required: true, type: "integer" }
            },
            url: "/teams/:team_id/discussions/:discussion_number/comments"
        },
        createDiscussionInOrg: {
            method: "POST",
            params: {
                body: { required: true, type: "string" },
                org: { required: true, type: "string" },
                private: { type: "boolean" },
                team_slug: { required: true, type: "string" },
                title: { required: true, type: "string" }
            },
            url: "/orgs/:org/teams/:team_slug/discussions"
        },
        createDiscussionLegacy: {
            deprecated: "octokit.teams.createDiscussionLegacy() is deprecated, see https://developer.github.com/v3/teams/discussions/#create-a-discussion-legacy",
            method: "POST",
            params: {
                body: { required: true, type: "string" },
                private: { type: "boolean" },
                team_id: { required: true, type: "integer" },
                title: { required: true, type: "string" }
            },
            url: "/teams/:team_id/discussions"
        },
        delete: {
            deprecated: "octokit.teams.delete() has been renamed to octokit.teams.deleteLegacy() (2020-01-16)",
            method: "DELETE",
            params: { team_id: { required: true, type: "integer" } },
            url: "/teams/:team_id"
        },
        deleteDiscussion: {
            deprecated: "octokit.teams.deleteDiscussion() has been renamed to octokit.teams.deleteDiscussionLegacy() (2020-01-16)",
            method: "DELETE",
            params: {
                discussion_number: { required: true, type: "integer" },
                team_id: { required: true, type: "integer" }
            },
            url: "/teams/:team_id/discussions/:discussion_number"
        },
        deleteDiscussionComment: {
            deprecated: "octokit.teams.deleteDiscussionComment() has been renamed to octokit.teams.deleteDiscussionCommentLegacy() (2020-01-16)",
            method: "DELETE",
            params: {
                comment_number: { required: true, type: "integer" },
                discussion_number: { required: true, type: "integer" },
                team_id: { required: true, type: "integer" }
            },
            url: "/teams/:team_id/discussions/:discussion_number/comments/:comment_number"
        },
        deleteDiscussionCommentInOrg: {
            method: "DELETE",
            params: {
                comment_number: { required: true, type: "integer" },
                discussion_number: { required: true, type: "integer" },
                org: { required: true, type: "string" },
                team_slug: { required: true, type: "string" }
            },
            url: "/orgs/:org/teams/:team_slug/discussions/:discussion_number/comments/:comment_number"
        },
        deleteDiscussionCommentLegacy: {
            deprecated: "octokit.teams.deleteDiscussionCommentLegacy() is deprecated, see https://developer.github.com/v3/teams/discussion_comments/#delete-a-comment-legacy",
            method: "DELETE",
            params: {
                comment_number: { required: true, type: "integer" },
                discussion_number: { required: true, type: "integer" },
                team_id: { required: true, type: "integer" }
            },
            url: "/teams/:team_id/discussions/:discussion_number/comments/:comment_number"
        },
        deleteDiscussionInOrg: {
            method: "DELETE",
            params: {
                discussion_number: { required: true, type: "integer" },
                org: { required: true, type: "string" },
                team_slug: { required: true, type: "string" }
            },
            url: "/orgs/:org/teams/:team_slug/discussions/:discussion_number"
        },
        deleteDiscussionLegacy: {
            deprecated: "octokit.teams.deleteDiscussionLegacy() is deprecated, see https://developer.github.com/v3/teams/discussions/#delete-a-discussion-legacy",
            method: "DELETE",
            params: {
                discussion_number: { required: true, type: "integer" },
                team_id: { required: true, type: "integer" }
            },
            url: "/teams/:team_id/discussions/:discussion_number"
        },
        deleteInOrg: {
            method: "DELETE",
            params: {
                org: { required: true, type: "string" },
                team_slug: { required: true, type: "string" }
            },
            url: "/orgs/:org/teams/:team_slug"
        },
        deleteLegacy: {
            deprecated: "octokit.teams.deleteLegacy() is deprecated, see https://developer.github.com/v3/teams/#delete-team-legacy",
            method: "DELETE",
            params: { team_id: { required: true, type: "integer" } },
            url: "/teams/:team_id"
        },
        get: {
            deprecated: "octokit.teams.get() has been renamed to octokit.teams.getLegacy() (2020-01-16)",
            method: "GET",
            params: { team_id: { required: true, type: "integer" } },
            url: "/teams/:team_id"
        },
        getByName: {
            method: "GET",
            params: {
                org: { required: true, type: "string" },
                team_slug: { required: true, type: "string" }
            },
            url: "/orgs/:org/teams/:team_slug"
        },
        getDiscussion: {
            deprecated: "octokit.teams.getDiscussion() has been renamed to octokit.teams.getDiscussionLegacy() (2020-01-16)",
            method: "GET",
            params: {
                discussion_number: { required: true, type: "integer" },
                team_id: { required: true, type: "integer" }
            },
            url: "/teams/:team_id/discussions/:discussion_number"
        },
        getDiscussionComment: {
            deprecated: "octokit.teams.getDiscussionComment() has been renamed to octokit.teams.getDiscussionCommentLegacy() (2020-01-16)",
            method: "GET",
            params: {
                comment_number: { required: true, type: "integer" },
                discussion_number: { required: true, type: "integer" },
                team_id: { required: true, type: "integer" }
            },
            url: "/teams/:team_id/discussions/:discussion_number/comments/:comment_number"
        },
        getDiscussionCommentInOrg: {
            method: "GET",
            params: {
                comment_number: { required: true, type: "integer" },
                discussion_number: { required: true, type: "integer" },
                org: { required: true, type: "string" },
                team_slug: { required: true, type: "string" }
            },
            url: "/orgs/:org/teams/:team_slug/discussions/:discussion_number/comments/:comment_number"
        },
        getDiscussionCommentLegacy: {
            deprecated: "octokit.teams.getDiscussionCommentLegacy() is deprecated, see https://developer.github.com/v3/teams/discussion_comments/#get-a-single-comment-legacy",
            method: "GET",
            params: {
                comment_number: { required: true, type: "integer" },
                discussion_number: { required: true, type: "integer" },
                team_id: { required: true, type: "integer" }
            },
            url: "/teams/:team_id/discussions/:discussion_number/comments/:comment_number"
        },
        getDiscussionInOrg: {
            method: "GET",
            params: {
                discussion_number: { required: true, type: "integer" },
                org: { required: true, type: "string" },
                team_slug: { required: true, type: "string" }
            },
            url: "/orgs/:org/teams/:team_slug/discussions/:discussion_number"
        },
        getDiscussionLegacy: {
            deprecated: "octokit.teams.getDiscussionLegacy() is deprecated, see https://developer.github.com/v3/teams/discussions/#get-a-single-discussion-legacy",
            method: "GET",
            params: {
                discussion_number: { required: true, type: "integer" },
                team_id: { required: true, type: "integer" }
            },
            url: "/teams/:team_id/discussions/:discussion_number"
        },
        getLegacy: {
            deprecated: "octokit.teams.getLegacy() is deprecated, see https://developer.github.com/v3/teams/#get-team-legacy",
            method: "GET",
            params: { team_id: { required: true, type: "integer" } },
            url: "/teams/:team_id"
        },
        getMember: {
            deprecated: "octokit.teams.getMember() has been renamed to octokit.teams.getMemberLegacy() (2020-01-16)",
            method: "GET",
            params: {
                team_id: { required: true, type: "integer" },
                username: { required: true, type: "string" }
            },
            url: "/teams/:team_id/members/:username"
        },
        getMemberLegacy: {
            deprecated: "octokit.teams.getMemberLegacy() is deprecated, see https://developer.github.com/v3/teams/members/#get-team-member-legacy",
            method: "GET",
            params: {
                team_id: { required: true, type: "integer" },
                username: { required: true, type: "string" }
            },
            url: "/teams/:team_id/members/:username"
        },
        getMembership: {
            deprecated: "octokit.teams.getMembership() has been renamed to octokit.teams.getMembershipLegacy() (2020-01-16)",
            method: "GET",
            params: {
                team_id: { required: true, type: "integer" },
                username: { required: true, type: "string" }
            },
            url: "/teams/:team_id/memberships/:username"
        },
        getMembershipInOrg: {
            method: "GET",
            params: {
                org: { required: true, type: "string" },
                team_slug: { required: true, type: "string" },
                username: { required: true, type: "string" }
            },
            url: "/orgs/:org/teams/:team_slug/memberships/:username"
        },
        getMembershipLegacy: {
            deprecated: "octokit.teams.getMembershipLegacy() is deprecated, see https://developer.github.com/v3/teams/members/#get-team-membership-legacy",
            method: "GET",
            params: {
                team_id: { required: true, type: "integer" },
                username: { required: true, type: "string" }
            },
            url: "/teams/:team_id/memberships/:username"
        },
        list: {
            method: "GET",
            params: {
                org: { required: true, type: "string" },
                page: { type: "integer" },
                per_page: { type: "integer" }
            },
            url: "/orgs/:org/teams"
        },
        listChild: {
            deprecated: "octokit.teams.listChild() has been renamed to octokit.teams.listChildLegacy() (2020-01-16)",
            method: "GET",
            params: {
                page: { type: "integer" },
                per_page: { type: "integer" },
                team_id: { required: true, type: "integer" }
            },
            url: "/teams/:team_id/teams"
        },
        listChildInOrg: {
            method: "GET",
            params: {
                org: { required: true, type: "string" },
                page: { type: "integer" },
                per_page: { type: "integer" },
                team_slug: { required: true, type: "string" }
            },
            url: "/orgs/:org/teams/:team_slug/teams"
        },
        listChildLegacy: {
            deprecated: "octokit.teams.listChildLegacy() is deprecated, see https://developer.github.com/v3/teams/#list-child-teams-legacy",
            method: "GET",
            params: {
                page: { type: "integer" },
                per_page: { type: "integer" },
                team_id: { required: true, type: "integer" }
            },
            url: "/teams/:team_id/teams"
        },
        listDiscussionComments: {
            deprecated: "octokit.teams.listDiscussionComments() has been renamed to octokit.teams.listDiscussionCommentsLegacy() (2020-01-16)",
            method: "GET",
            params: {
                direction: { enum: ["asc", "desc"], type: "string" },
                discussion_number: { required: true, type: "integer" },
                page: { type: "integer" },
                per_page: { type: "integer" },
                team_id: { required: true, type: "integer" }
            },
            url: "/teams/:team_id/discussions/:discussion_number/comments"
        },
        listDiscussionCommentsInOrg: {
            method: "GET",
            params: {
                direction: { enum: ["asc", "desc"], type: "string" },
                discussion_number: { required: true, type: "integer" },
                org: { required: true, type: "string" },
                page: { type: "integer" },
                per_page: { type: "integer" },
                team_slug: { required: true, type: "string" }
            },
            url: "/orgs/:org/teams/:team_slug/discussions/:discussion_number/comments"
        },
        listDiscussionCommentsLegacy: {
            deprecated: "octokit.teams.listDiscussionCommentsLegacy() is deprecated, see https://developer.github.com/v3/teams/discussion_comments/#list-comments-legacy",
            method: "GET",
            params: {
                direction: { enum: ["asc", "desc"], type: "string" },
                discussion_number: { required: true, type: "integer" },
                page: { type: "integer" },
                per_page: { type: "integer" },
                team_id: { required: true, type: "integer" }
            },
            url: "/teams/:team_id/discussions/:discussion_number/comments"
        },
        listDiscussions: {
            deprecated: "octokit.teams.listDiscussions() has been renamed to octokit.teams.listDiscussionsLegacy() (2020-01-16)",
            method: "GET",
            params: {
                direction: { enum: ["asc", "desc"], type: "string" },
                page: { type: "integer" },
                per_page: { type: "integer" },
                team_id: { required: true, type: "integer" }
            },
            url: "/teams/:team_id/discussions"
        },
        listDiscussionsInOrg: {
            method: "GET",
            params: {
                direction: { enum: ["asc", "desc"], type: "string" },
                org: { required: true, type: "string" },
                page: { type: "integer" },
                per_page: { type: "integer" },
                team_slug: { required: true, type: "string" }
            },
            url: "/orgs/:org/teams/:team_slug/discussions"
        },
        listDiscussionsLegacy: {
            deprecated: "octokit.teams.listDiscussionsLegacy() is deprecated, see https://developer.github.com/v3/teams/discussions/#list-discussions-legacy",
            method: "GET",
            params: {
                direction: { enum: ["asc", "desc"], type: "string" },
                page: { type: "integer" },
                per_page: { type: "integer" },
                team_id: { required: true, type: "integer" }
            },
            url: "/teams/:team_id/discussions"
        },
        listForAuthenticatedUser: {
            method: "GET",
            params: { page: { type: "integer" }, per_page: { type: "integer" } },
            url: "/user/teams"
        },
        listMembers: {
            deprecated: "octokit.teams.listMembers() has been renamed to octokit.teams.listMembersLegacy() (2020-01-16)",
            method: "GET",
            params: {
                page: { type: "integer" },
                per_page: { type: "integer" },
                role: { enum: ["member", "maintainer", "all"], type: "string" },
                team_id: { required: true, type: "integer" }
            },
            url: "/teams/:team_id/members"
        },
        listMembersInOrg: {
            method: "GET",
            params: {
                org: { required: true, type: "string" },
                page: { type: "integer" },
                per_page: { type: "integer" },
                role: { enum: ["member", "maintainer", "all"], type: "string" },
                team_slug: { required: true, type: "string" }
            },
            url: "/orgs/:org/teams/:team_slug/members"
        },
        listMembersLegacy: {
            deprecated: "octokit.teams.listMembersLegacy() is deprecated, see https://developer.github.com/v3/teams/members/#list-team-members-legacy",
            method: "GET",
            params: {
                page: { type: "integer" },
                per_page: { type: "integer" },
                role: { enum: ["member", "maintainer", "all"], type: "string" },
                team_id: { required: true, type: "integer" }
            },
            url: "/teams/:team_id/members"
        },
        listPendingInvitations: {
            deprecated: "octokit.teams.listPendingInvitations() has been renamed to octokit.teams.listPendingInvitationsLegacy() (2020-01-16)",
            method: "GET",
            params: {
                page: { type: "integer" },
                per_page: { type: "integer" },
                team_id: { required: true, type: "integer" }
            },
            url: "/teams/:team_id/invitations"
        },
        listPendingInvitationsInOrg: {
            method: "GET",
            params: {
                org: { required: true, type: "string" },
                page: { type: "integer" },
                per_page: { type: "integer" },
                team_slug: { required: true, type: "string" }
            },
            url: "/orgs/:org/teams/:team_slug/invitations"
        },
        listPendingInvitationsLegacy: {
            deprecated: "octokit.teams.listPendingInvitationsLegacy() is deprecated, see https://developer.github.com/v3/teams/members/#list-pending-team-invitations-legacy",
            method: "GET",
            params: {
                page: { type: "integer" },
                per_page: { type: "integer" },
                team_id: { required: true, type: "integer" }
            },
            url: "/teams/:team_id/invitations"
        },
        listProjects: {
            deprecated: "octokit.teams.listProjects() has been renamed to octokit.teams.listProjectsLegacy() (2020-01-16)",
            headers: { accept: "application/vnd.github.inertia-preview+json" },
            method: "GET",
            params: {
                page: { type: "integer" },
                per_page: { type: "integer" },
                team_id: { required: true, type: "integer" }
            },
            url: "/teams/:team_id/projects"
        },
        listProjectsInOrg: {
            headers: { accept: "application/vnd.github.inertia-preview+json" },
            method: "GET",
            params: {
                org: { required: true, type: "string" },
                page: { type: "integer" },
                per_page: { type: "integer" },
                team_slug: { required: true, type: "string" }
            },
            url: "/orgs/:org/teams/:team_slug/projects"
        },
        listProjectsLegacy: {
            deprecated: "octokit.teams.listProjectsLegacy() is deprecated, see https://developer.github.com/v3/teams/#list-team-projects-legacy",
            headers: { accept: "application/vnd.github.inertia-preview+json" },
            method: "GET",
            params: {
                page: { type: "integer" },
                per_page: { type: "integer" },
                team_id: { required: true, type: "integer" }
            },
            url: "/teams/:team_id/projects"
        },
        listRepos: {
            deprecated: "octokit.teams.listRepos() has been renamed to octokit.teams.listReposLegacy() (2020-01-16)",
            method: "GET",
            params: {
                page: { type: "integer" },
                per_page: { type: "integer" },
                team_id: { required: true, type: "integer" }
            },
            url: "/teams/:team_id/repos"
        },
        listReposInOrg: {
            method: "GET",
            params: {
                org: { required: true, type: "string" },
                page: { type: "integer" },
                per_page: { type: "integer" },
                team_slug: { required: true, type: "string" }
            },
            url: "/orgs/:org/teams/:team_slug/repos"
        },
        listReposLegacy: {
            deprecated: "octokit.teams.listReposLegacy() is deprecated, see https://developer.github.com/v3/teams/#list-team-repos-legacy",
            method: "GET",
            params: {
                page: { type: "integer" },
                per_page: { type: "integer" },
                team_id: { required: true, type: "integer" }
            },
            url: "/teams/:team_id/repos"
        },
        removeMember: {
            deprecated: "octokit.teams.removeMember() has been renamed to octokit.teams.removeMemberLegacy() (2020-01-16)",
            method: "DELETE",
            params: {
                team_id: { required: true, type: "integer" },
                username: { required: true, type: "string" }
            },
            url: "/teams/:team_id/members/:username"
        },
        removeMemberLegacy: {
            deprecated: "octokit.teams.removeMemberLegacy() is deprecated, see https://developer.github.com/v3/teams/members/#remove-team-member-legacy",
            method: "DELETE",
            params: {
                team_id: { required: true, type: "integer" },
                username: { required: true, type: "string" }
            },
            url: "/teams/:team_id/members/:username"
        },
        removeMembership: {
            deprecated: "octokit.teams.removeMembership() has been renamed to octokit.teams.removeMembershipLegacy() (2020-01-16)",
            method: "DELETE",
            params: {
                team_id: { required: true, type: "integer" },
                username: { required: true, type: "string" }
            },
            url: "/teams/:team_id/memberships/:username"
        },
        removeMembershipInOrg: {
            method: "DELETE",
            params: {
                org: { required: true, type: "string" },
                team_slug: { required: true, type: "string" },
                username: { required: true, type: "string" }
            },
            url: "/orgs/:org/teams/:team_slug/memberships/:username"
        },
        removeMembershipLegacy: {
            deprecated: "octokit.teams.removeMembershipLegacy() is deprecated, see https://developer.github.com/v3/teams/members/#remove-team-membership-legacy",
            method: "DELETE",
            params: {
                team_id: { required: true, type: "integer" },
                username: { required: true, type: "string" }
            },
            url: "/teams/:team_id/memberships/:username"
        },
        removeProject: {
            deprecated: "octokit.teams.removeProject() has been renamed to octokit.teams.removeProjectLegacy() (2020-01-16)",
            method: "DELETE",
            params: {
                project_id: { required: true, type: "integer" },
                team_id: { required: true, type: "integer" }
            },
            url: "/teams/:team_id/projects/:project_id"
        },
        removeProjectInOrg: {
            method: "DELETE",
            params: {
                org: { required: true, type: "string" },
                project_id: { required: true, type: "integer" },
                team_slug: { required: true, type: "string" }
            },
            url: "/orgs/:org/teams/:team_slug/projects/:project_id"
        },
        removeProjectLegacy: {
            deprecated: "octokit.teams.removeProjectLegacy() is deprecated, see https://developer.github.com/v3/teams/#remove-team-project-legacy",
            method: "DELETE",
            params: {
                project_id: { required: true, type: "integer" },
                team_id: { required: true, type: "integer" }
            },
            url: "/teams/:team_id/projects/:project_id"
        },
        removeRepo: {
            deprecated: "octokit.teams.removeRepo() has been renamed to octokit.teams.removeRepoLegacy() (2020-01-16)",
            method: "DELETE",
            params: {
                owner: { required: true, type: "string" },
                repo: { required: true, type: "string" },
                team_id: { required: true, type: "integer" }
            },
            url: "/teams/:team_id/repos/:owner/:repo"
        },
        removeRepoInOrg: {
            method: "DELETE",
            params: {
                org: { required: true, type: "string" },
                owner: { required: true, type: "string" },
                repo: { required: true, type: "string" },
                team_slug: { required: true, type: "string" }
            },
            url: "/orgs/:org/teams/:team_slug/repos/:owner/:repo"
        },
        removeRepoLegacy: {
            deprecated: "octokit.teams.removeRepoLegacy() is deprecated, see https://developer.github.com/v3/teams/#remove-team-repository-legacy",
            method: "DELETE",
            params: {
                owner: { required: true, type: "string" },
                repo: { required: true, type: "string" },
                team_id: { required: true, type: "integer" }
            },
            url: "/teams/:team_id/repos/:owner/:repo"
        },
        reviewProject: {
            deprecated: "octokit.teams.reviewProject() has been renamed to octokit.teams.reviewProjectLegacy() (2020-01-16)",
            headers: { accept: "application/vnd.github.inertia-preview+json" },
            method: "GET",
            params: {
                project_id: { required: true, type: "integer" },
                team_id: { required: true, type: "integer" }
            },
            url: "/teams/:team_id/projects/:project_id"
        },
        reviewProjectInOrg: {
            headers: { accept: "application/vnd.github.inertia-preview+json" },
            method: "GET",
            params: {
                org: { required: true, type: "string" },
                project_id: { required: true, type: "integer" },
                team_slug: { required: true, type: "string" }
            },
            url: "/orgs/:org/teams/:team_slug/projects/:project_id"
        },
        reviewProjectLegacy: {
            deprecated: "octokit.teams.reviewProjectLegacy() is deprecated, see https://developer.github.com/v3/teams/#review-a-team-project-legacy",
            headers: { accept: "application/vnd.github.inertia-preview+json" },
            method: "GET",
            params: {
                project_id: { required: true, type: "integer" },
                team_id: { required: true, type: "integer" }
            },
            url: "/teams/:team_id/projects/:project_id"
        },
        update: {
            deprecated: "octokit.teams.update() has been renamed to octokit.teams.updateLegacy() (2020-01-16)",
            method: "PATCH",
            params: {
                description: { type: "string" },
                name: { required: true, type: "string" },
                parent_team_id: { type: "integer" },
                permission: { enum: ["pull", "push", "admin"], type: "string" },
                privacy: { enum: ["secret", "closed"], type: "string" },
                team_id: { required: true, type: "integer" }
            },
            url: "/teams/:team_id"
        },
        updateDiscussion: {
            deprecated: "octokit.teams.updateDiscussion() has been renamed to octokit.teams.updateDiscussionLegacy() (2020-01-16)",
            method: "PATCH",
            params: {
                body: { type: "string" },
                discussion_number: { required: true, type: "integer" },
                team_id: { required: true, type: "integer" },
                title: { type: "string" }
            },
            url: "/teams/:team_id/discussions/:discussion_number"
        },
        updateDiscussionComment: {
            deprecated: "octokit.teams.updateDiscussionComment() has been renamed to octokit.teams.updateDiscussionCommentLegacy() (2020-01-16)",
            method: "PATCH",
            params: {
                body: { required: true, type: "string" },
                comment_number: { required: true, type: "integer" },
                discussion_number: { required: true, type: "integer" },
                team_id: { required: true, type: "integer" }
            },
            url: "/teams/:team_id/discussions/:discussion_number/comments/:comment_number"
        },
        updateDiscussionCommentInOrg: {
            method: "PATCH",
            params: {
                body: { required: true, type: "string" },
                comment_number: { required: true, type: "integer" },
                discussion_number: { required: true, type: "integer" },
                org: { required: true, type: "string" },
                team_slug: { required: true, type: "string" }
            },
            url: "/orgs/:org/teams/:team_slug/discussions/:discussion_number/comments/:comment_number"
        },
        updateDiscussionCommentLegacy: {
            deprecated: "octokit.teams.updateDiscussionCommentLegacy() is deprecated, see https://developer.github.com/v3/teams/discussion_comments/#edit-a-comment-legacy",
            method: "PATCH",
            params: {
                body: { required: true, type: "string" },
                comment_number: { required: true, type: "integer" },
                discussion_number: { required: true, type: "integer" },
                team_id: { required: true, type: "integer" }
            },
            url: "/teams/:team_id/discussions/:discussion_number/comments/:comment_number"
        },
        updateDiscussionInOrg: {
            method: "PATCH",
            params: {
                body: { type: "string" },
                discussion_number: { required: true, type: "integer" },
                org: { required: true, type: "string" },
                team_slug: { required: true, type: "string" },
                title: { type: "string" }
            },
            url: "/orgs/:org/teams/:team_slug/discussions/:discussion_number"
        },
        updateDiscussionLegacy: {
            deprecated: "octokit.teams.updateDiscussionLegacy() is deprecated, see https://developer.github.com/v3/teams/discussions/#edit-a-discussion-legacy",
            method: "PATCH",
            params: {
                body: { type: "string" },
                discussion_number: { required: true, type: "integer" },
                team_id: { required: true, type: "integer" },
                title: { type: "string" }
            },
            url: "/teams/:team_id/discussions/:discussion_number"
        },
        updateInOrg: {
            method: "PATCH",
            params: {
                description: { type: "string" },
                name: { required: true, type: "string" },
                org: { required: true, type: "string" },
                parent_team_id: { type: "integer" },
                permission: { enum: ["pull", "push", "admin"], type: "string" },
                privacy: { enum: ["secret", "closed"], type: "string" },
                team_slug: { required: true, type: "string" }
            },
            url: "/orgs/:org/teams/:team_slug"
        },
        updateLegacy: {
            deprecated: "octokit.teams.updateLegacy() is deprecated, see https://developer.github.com/v3/teams/#edit-team-legacy",
            method: "PATCH",
            params: {
                description: { type: "string" },
                name: { required: true, type: "string" },
                parent_team_id: { type: "integer" },
                permission: { enum: ["pull", "push", "admin"], type: "string" },
                privacy: { enum: ["secret", "closed"], type: "string" },
                team_id: { required: true, type: "integer" }
            },
            url: "/teams/:team_id"
        }
    },
    users: {
        addEmails: {
            method: "POST",
            params: { emails: { required: true, type: "string[]" } },
            url: "/user/emails"
        },
        block: {
            method: "PUT",
            params: { username: { required: true, type: "string" } },
            url: "/user/blocks/:username"
        },
        checkBlocked: {
            method: "GET",
            params: { username: { required: true, type: "string" } },
            url: "/user/blocks/:username"
        },
        checkFollowing: {
            method: "GET",
            params: { username: { required: true, type: "string" } },
            url: "/user/following/:username"
        },
        checkFollowingForUser: {
            method: "GET",
            params: {
                target_user: { required: true, type: "string" },
                username: { required: true, type: "string" }
            },
            url: "/users/:username/following/:target_user"
        },
        createGpgKey: {
            method: "POST",
            params: { armored_public_key: { type: "string" } },
            url: "/user/gpg_keys"
        },
        createPublicKey: {
            method: "POST",
            params: { key: { type: "string" }, title: { type: "string" } },
            url: "/user/keys"
        },
        deleteEmails: {
            method: "DELETE",
            params: { emails: { required: true, type: "string[]" } },
            url: "/user/emails"
        },
        deleteGpgKey: {
            method: "DELETE",
            params: { gpg_key_id: { required: true, type: "integer" } },
            url: "/user/gpg_keys/:gpg_key_id"
        },
        deletePublicKey: {
            method: "DELETE",
            params: { key_id: { required: true, type: "integer" } },
            url: "/user/keys/:key_id"
        },
        follow: {
            method: "PUT",
            params: { username: { required: true, type: "string" } },
            url: "/user/following/:username"
        },
        getAuthenticated: { method: "GET", params: {}, url: "/user" },
        getByUsername: {
            method: "GET",
            params: { username: { required: true, type: "string" } },
            url: "/users/:username"
        },
        getContextForUser: {
            method: "GET",
            params: {
                subject_id: { type: "string" },
                subject_type: {
                    enum: ["organization", "repository", "issue", "pull_request"],
                    type: "string"
                },
                username: { required: true, type: "string" }
            },
            url: "/users/:username/hovercard"
        },
        getGpgKey: {
            method: "GET",
            params: { gpg_key_id: { required: true, type: "integer" } },
            url: "/user/gpg_keys/:gpg_key_id"
        },
        getPublicKey: {
            method: "GET",
            params: { key_id: { required: true, type: "integer" } },
            url: "/user/keys/:key_id"
        },
        list: {
            method: "GET",
            params: {
                page: { type: "integer" },
                per_page: { type: "integer" },
                since: { type: "string" }
            },
            url: "/users"
        },
        listBlocked: { method: "GET", params: {}, url: "/user/blocks" },
        listEmails: {
            method: "GET",
            params: { page: { type: "integer" }, per_page: { type: "integer" } },
            url: "/user/emails"
        },
        listFollowersForAuthenticatedUser: {
            method: "GET",
            params: { page: { type: "integer" }, per_page: { type: "integer" } },
            url: "/user/followers"
        },
        listFollowersForUser: {
            method: "GET",
            params: {
                page: { type: "integer" },
                per_page: { type: "integer" },
                username: { required: true, type: "string" }
            },
            url: "/users/:username/followers"
        },
        listFollowingForAuthenticatedUser: {
            method: "GET",
            params: { page: { type: "integer" }, per_page: { type: "integer" } },
            url: "/user/following"
        },
        listFollowingForUser: {
            method: "GET",
            params: {
                page: { type: "integer" },
                per_page: { type: "integer" },
                username: { required: true, type: "string" }
            },
            url: "/users/:username/following"
        },
        listGpgKeys: {
            method: "GET",
            params: { page: { type: "integer" }, per_page: { type: "integer" } },
            url: "/user/gpg_keys"
        },
        listGpgKeysForUser: {
            method: "GET",
            params: {
                page: { type: "integer" },
                per_page: { type: "integer" },
                username: { required: true, type: "string" }
            },
            url: "/users/:username/gpg_keys"
        },
        listPublicEmails: {
            method: "GET",
            params: { page: { type: "integer" }, per_page: { type: "integer" } },
            url: "/user/public_emails"
        },
        listPublicKeys: {
            method: "GET",
            params: { page: { type: "integer" }, per_page: { type: "integer" } },
            url: "/user/keys"
        },
        listPublicKeysForUser: {
            method: "GET",
            params: {
                page: { type: "integer" },
                per_page: { type: "integer" },
                username: { required: true, type: "string" }
            },
            url: "/users/:username/keys"
        },
        togglePrimaryEmailVisibility: {
            method: "PATCH",
            params: {
                email: { required: true, type: "string" },
                visibility: { required: true, type: "string" }
            },
            url: "/user/email/visibility"
        },
        unblock: {
            method: "DELETE",
            params: { username: { required: true, type: "string" } },
            url: "/user/blocks/:username"
        },
        unfollow: {
            method: "DELETE",
            params: { username: { required: true, type: "string" } },
            url: "/user/following/:username"
        },
        updateAuthenticated: {
            method: "PATCH",
            params: {
                bio: { type: "string" },
                blog: { type: "string" },
                company: { type: "string" },
                email: { type: "string" },
                hireable: { type: "boolean" },
                location: { type: "string" },
                name: { type: "string" }
            },
            url: "/user"
        }
    }
};

const VERSION$8 = "2.4.0";

function registerEndpoints(octokit, routes) {
    Object.keys(routes).forEach(namespaceName => {
        if (!octokit[namespaceName]) {
            octokit[namespaceName] = {};
        }
        Object.keys(routes[namespaceName]).forEach(apiName => {
            const apiOptions = routes[namespaceName][apiName];
            const endpointDefaults = ["method", "url", "headers"].reduce((map, key) => {
                if (typeof apiOptions[key] !== "undefined") {
                    map[key] = apiOptions[key];
                }
                return map;
            }, {});
            endpointDefaults.request = {
                validate: apiOptions.params
            };
            let request = octokit.request.defaults(endpointDefaults);
            // patch request & endpoint methods to support deprecated parameters.
            // Not the most elegant solution, but we don’t want to move deprecation
            // logic into octokit/endpoint.js as it’s out of scope
            const hasDeprecatedParam = Object.keys(apiOptions.params || {}).find(key => apiOptions.params[key].deprecated);
            if (hasDeprecatedParam) {
                const patch = patchForDeprecation.bind(null, octokit, apiOptions);
                request = patch(octokit.request.defaults(endpointDefaults), `.${namespaceName}.${apiName}()`);
                request.endpoint = patch(request.endpoint, `.${namespaceName}.${apiName}.endpoint()`);
                request.endpoint.merge = patch(request.endpoint.merge, `.${namespaceName}.${apiName}.endpoint.merge()`);
            }
            if (apiOptions.deprecated) {
                octokit[namespaceName][apiName] = Object.assign(function deprecatedEndpointMethod() {
                    octokit.log.warn(new Deprecation(`[@octokit/rest] ${apiOptions.deprecated}`));
                    octokit[namespaceName][apiName] = request;
                    return request.apply(null, arguments);
                }, request);
                return;
            }
            octokit[namespaceName][apiName] = request;
        });
    });
}
function patchForDeprecation(octokit, apiOptions, method, methodName) {
    const patchedMethod = (options) => {
        options = Object.assign({}, options);
        Object.keys(options).forEach(key => {
            if (apiOptions.params[key] && apiOptions.params[key].deprecated) {
                const aliasKey = apiOptions.params[key].alias;
                octokit.log.warn(new Deprecation(`[@octokit/rest] "${key}" parameter is deprecated for "${methodName}". Use "${aliasKey}" instead`));
                if (!(aliasKey in options)) {
                    options[aliasKey] = options[key];
                }
                delete options[key];
            }
        });
        return method(options);
    };
    Object.keys(method).forEach(key => {
        patchedMethod[key] = method[key];
    });
    return patchedMethod;
}

/**
 * This plugin is a 1:1 copy of internal @octokit/rest plugins. The primary
 * goal is to rebuild @octokit/rest on top of @octokit/core. Once that is
 * done, we will remove the registerEndpoints methods and return the methods
 * directly as with the other plugins. At that point we will also remove the
 * legacy workarounds and deprecations.
 *
 * See the plan at
 * https://github.com/octokit/plugin-rest-endpoint-methods.js/pull/1
 */
function restEndpointMethods$1(octokit) {
    // @ts-ignore
    octokit.registerEndpoints = registerEndpoints.bind(null, octokit);
    registerEndpoints(octokit, endpointsByScope);
    // Aliasing scopes for backward compatibility
    // See https://github.com/octokit/rest.js/pull/1134
    [
        ["gitdata", "git"],
        ["authorization", "oauthAuthorizations"],
        ["pullRequests", "pulls"]
    ].forEach(([deprecatedScope, scope]) => {
        Object.defineProperty(octokit, deprecatedScope, {
            get() {
                octokit.log.warn(
                // @ts-ignore
                new Deprecation(`[@octokit/plugin-rest-endpoint-methods] "octokit.${deprecatedScope}.*" methods are deprecated, use "octokit.${scope}.*" instead`));
                // @ts-ignore
                return octokit[scope];
            }
        });
    });
    return {};
}
restEndpointMethods$1.VERSION = VERSION$8;

var distWeb$5 = /*#__PURE__*/Object.freeze({
	__proto__: null,
	restEndpointMethods: restEndpointMethods$1
});

function getUserAgent$1() {
    try {
        return navigator.userAgent;
    }
    catch (e) {
        return "<environment unknown>";
    }
}

var distWeb$6 = /*#__PURE__*/Object.freeze({
	__proto__: null,
	getUserAgent: getUserAgent$1
});

var name = "@octokit/rest";
var version = "16.43.2";
var publishConfig = {
	access: "public"
};
var description = "GitHub REST API client for Node.js";
var keywords = [
	"octokit",
	"github",
	"rest",
	"api-client"
];
var author = "Gregor Martynus (https://github.com/gr2m)";
var contributors = [
	{
		name: "Mike de Boer",
		email: "info@mikedeboer.nl"
	},
	{
		name: "Fabian Jakobs",
		email: "fabian@c9.io"
	},
	{
		name: "Joe Gallo",
		email: "joe@brassafrax.com"
	},
	{
		name: "Gregor Martynus",
		url: "https://github.com/gr2m"
	}
];
var repository = "https://github.com/octokit/rest.js";
var dependencies = {
	"@octokit/auth-token": "^2.4.0",
	"@octokit/plugin-paginate-rest": "^1.1.1",
	"@octokit/plugin-request-log": "^1.0.0",
	"@octokit/plugin-rest-endpoint-methods": "2.4.0",
	"@octokit/request": "^5.2.0",
	"@octokit/request-error": "^1.0.2",
	"atob-lite": "^2.0.0",
	"before-after-hook": "^2.0.0",
	"btoa-lite": "^1.0.0",
	deprecation: "^2.0.0",
	"lodash.get": "^4.4.2",
	"lodash.set": "^4.3.2",
	"lodash.uniq": "^4.5.0",
	"octokit-pagination-methods": "^1.1.0",
	once: "^1.4.0",
	"universal-user-agent": "^4.0.0"
};
var devDependencies = {
	"@gimenete/type-writer": "^0.1.3",
	"@octokit/auth": "^1.1.1",
	"@octokit/fixtures-server": "^5.0.6",
	"@octokit/graphql": "^4.2.0",
	"@types/node": "^13.1.0",
	bundlesize: "^0.18.0",
	chai: "^4.1.2",
	"compression-webpack-plugin": "^3.1.0",
	cypress: "^4.0.0",
	glob: "^7.1.2",
	"http-proxy-agent": "^4.0.0",
	"lodash.camelcase": "^4.3.0",
	"lodash.merge": "^4.6.1",
	"lodash.upperfirst": "^4.3.1",
	lolex: "^6.0.0",
	mkdirp: "^1.0.0",
	mocha: "^7.0.1",
	mustache: "^4.0.0",
	nock: "^11.3.3",
	"npm-run-all": "^4.1.2",
	nyc: "^15.0.0",
	prettier: "^1.14.2",
	proxy: "^1.0.0",
	"semantic-release": "^17.0.0",
	sinon: "^8.0.0",
	"sinon-chai": "^3.0.0",
	"sort-keys": "^4.0.0",
	"string-to-arraybuffer": "^1.0.0",
	"string-to-jsdoc-comment": "^1.0.0",
	typescript: "^3.3.1",
	webpack: "^4.0.0",
	"webpack-bundle-analyzer": "^3.0.0",
	"webpack-cli": "^3.0.0"
};
var types = "index.d.ts";
var scripts = {
	coverage: "nyc report --reporter=html && open coverage/index.html",
	lint: "prettier --check '{lib,plugins,scripts,test}/**/*.{js,json,ts}' 'docs/*.{js,json}' 'docs/src/**/*' index.js README.md package.json",
	"lint:fix": "prettier --write '{lib,plugins,scripts,test}/**/*.{js,json,ts}' 'docs/*.{js,json}' 'docs/src/**/*' index.js README.md package.json",
	pretest: "npm run -s lint",
	test: "nyc mocha test/mocha-node-setup.js \"test/*/**/*-test.js\"",
	"test:browser": "cypress run --browser chrome",
	build: "npm-run-all build:*",
	"build:ts": "npm run -s update-endpoints:typescript",
	"prebuild:browser": "mkdirp dist/",
	"build:browser": "npm-run-all build:browser:*",
	"build:browser:development": "webpack --mode development --entry . --output-library=Octokit --output=./dist/octokit-rest.js --profile --json > dist/bundle-stats.json",
	"build:browser:production": "webpack --mode production --entry . --plugin=compression-webpack-plugin --output-library=Octokit --output-path=./dist --output-filename=octokit-rest.min.js --devtool source-map",
	"generate-bundle-report": "webpack-bundle-analyzer dist/bundle-stats.json --mode=static --no-open --report dist/bundle-report.html",
	"update-endpoints": "npm-run-all update-endpoints:*",
	"update-endpoints:fetch-json": "node scripts/update-endpoints/fetch-json",
	"update-endpoints:typescript": "node scripts/update-endpoints/typescript",
	"prevalidate:ts": "npm run -s build:ts",
	"validate:ts": "tsc --target es6 --noImplicitAny index.d.ts",
	"postvalidate:ts": "tsc --noEmit --target es6 test/typescript-validate.ts",
	"start-fixtures-server": "octokit-fixtures-server"
};
var license = "MIT";
var files = [
	"index.js",
	"index.d.ts",
	"lib",
	"plugins"
];
var nyc = {
	ignore: [
		"test"
	]
};
var release = {
	publish: [
		"@semantic-release/npm",
		{
			path: "@semantic-release/github",
			assets: [
				"dist/*",
				"!dist/*.map.gz"
			]
		}
	]
};
var bundlesize = [
	{
		path: "./dist/octokit-rest.min.js.gz",
		maxSize: "33 kB"
	}
];
var pkg = {
	name: name,
	version: version,
	publishConfig: publishConfig,
	description: description,
	keywords: keywords,
	author: author,
	contributors: contributors,
	repository: repository,
	dependencies: dependencies,
	devDependencies: devDependencies,
	types: types,
	scripts: scripts,
	license: license,
	files: files,
	nyc: nyc,
	release: release,
	bundlesize: bundlesize
};

var parseClientOptions = parseOptions;

const { Deprecation: Deprecation$1 } = distWeb;
const { getUserAgent: getUserAgent$2 } = distWeb$6;




const deprecateOptionsTimeout = once_1((log, deprecation) =>
  log.warn(deprecation)
);
const deprecateOptionsAgent = once_1((log, deprecation) => log.warn(deprecation));
const deprecateOptionsHeaders = once_1((log, deprecation) =>
  log.warn(deprecation)
);

function parseOptions(options, log, hook) {
  if (options.headers) {
    options.headers = Object.keys(options.headers).reduce((newObj, key) => {
      newObj[key.toLowerCase()] = options.headers[key];
      return newObj;
    }, {});
  }

  const clientDefaults = {
    headers: options.headers || {},
    request: options.request || {},
    mediaType: {
      previews: [],
      format: ""
    }
  };

  if (options.baseUrl) {
    clientDefaults.baseUrl = options.baseUrl;
  }

  if (options.userAgent) {
    clientDefaults.headers["user-agent"] = options.userAgent;
  }

  if (options.previews) {
    clientDefaults.mediaType.previews = options.previews;
  }

  if (options.timeZone) {
    clientDefaults.headers["time-zone"] = options.timeZone;
  }

  if (options.timeout) {
    deprecateOptionsTimeout(
      log,
      new Deprecation$1(
        "[@octokit/rest] new Octokit({timeout}) is deprecated. Use {request: {timeout}} instead. See https://github.com/octokit/request.js#request"
      )
    );
    clientDefaults.request.timeout = options.timeout;
  }

  if (options.agent) {
    deprecateOptionsAgent(
      log,
      new Deprecation$1(
        "[@octokit/rest] new Octokit({agent}) is deprecated. Use {request: {agent}} instead. See https://github.com/octokit/request.js#request"
      )
    );
    clientDefaults.request.agent = options.agent;
  }

  if (options.headers) {
    deprecateOptionsHeaders(
      log,
      new Deprecation$1(
        "[@octokit/rest] new Octokit({headers}) is deprecated. Use {userAgent, previews} instead. See https://github.com/octokit/request.js#request"
      )
    );
  }

  const userAgentOption = clientDefaults.headers["user-agent"];
  const defaultUserAgent = `octokit.js/${pkg.version} ${getUserAgent$2()}`;

  clientDefaults.headers["user-agent"] = [userAgentOption, defaultUserAgent]
    .filter(Boolean)
    .join(" ");

  clientDefaults.request.hook = hook.bind(null, "request");

  return clientDefaults;
}

var constructor_1 = Octokit$2;

const { request: request$1 } = distWeb$1;




function Octokit$2(plugins, options) {
  options = options || {};
  const hook = new beforeAfterHook.Collection();
  const log = Object.assign(
    {
      debug: () => {},
      info: () => {},
      warn: console.warn,
      error: console.error
    },
    options && options.log
  );
  const api = {
    hook,
    log,
    request: request$1.defaults(parseClientOptions(options, log, hook))
  };

  plugins.forEach(pluginFunction => pluginFunction(api, options));

  return api;
}

var registerPlugin_1 = registerPlugin;



function registerPlugin(plugins, pluginFunction) {
  return factory_1(
    plugins.includes(pluginFunction) ? plugins : plugins.concat(pluginFunction)
  );
}

var factory_1 = factory;




function factory(plugins) {
  const Api = constructor_1.bind(null, plugins || []);
  Api.plugin = registerPlugin_1.bind(null, plugins || []);
  return Api;
}

var core$3 = factory_1();

var btoaNode = function btoa(str) {
  return new Buffer(str).toString('base64')
};

var atobNode = function atob(str) {
  return Buffer.from(str, 'base64').toString('binary')
};

var withAuthorizationPrefix_1 = withAuthorizationPrefix$1;



const REGEX_IS_BASIC_AUTH = /^[\w-]+:/;

function withAuthorizationPrefix$1(authorization) {
  if (/^(basic|bearer|token) /i.test(authorization)) {
    return authorization;
  }

  try {
    if (REGEX_IS_BASIC_AUTH.test(atobNode(authorization))) {
      return `basic ${authorization}`;
    }
  } catch (error) {}

  if (authorization.split(/\./).length === 3) {
    return `bearer ${authorization}`;
  }

  return `token ${authorization}`;
}

var beforeRequest = authenticationBeforeRequest;





function authenticationBeforeRequest(state, options) {
  if (typeof state.auth === "string") {
    options.headers.authorization = withAuthorizationPrefix_1(state.auth);
    return;
  }

  if (state.auth.username) {
    const hash = btoaNode(`${state.auth.username}:${state.auth.password}`);
    options.headers.authorization = `Basic ${hash}`;
    if (state.otp) {
      options.headers["x-github-otp"] = state.otp;
    }
    return;
  }

  if (state.auth.clientId) {
    // There is a special case for OAuth applications, when `clientId` and `clientSecret` is passed as
    // Basic Authorization instead of query parameters. The only routes where that applies share the same
    // URL though: `/applications/:client_id/tokens/:access_token`.
    //
    //  1. [Check an authorization](https://developer.github.com/v3/oauth_authorizations/#check-an-authorization)
    //  2. [Reset an authorization](https://developer.github.com/v3/oauth_authorizations/#reset-an-authorization)
    //  3. [Revoke an authorization for an application](https://developer.github.com/v3/oauth_authorizations/#revoke-an-authorization-for-an-application)
    //
    // We identify by checking the URL. It must merge both "/applications/:client_id/tokens/:access_token"
    // as well as "/applications/123/tokens/token456"
    if (/\/applications\/:?[\w_]+\/tokens\/:?[\w_]+($|\?)/.test(options.url)) {
      const hash = btoaNode(`${state.auth.clientId}:${state.auth.clientSecret}`);
      options.headers.authorization = `Basic ${hash}`;
      return;
    }

    options.url += options.url.indexOf("?") === -1 ? "?" : "&";
    options.url += `client_id=${state.auth.clientId}&client_secret=${state.auth.clientSecret}`;
    return;
  }

  return Promise.resolve()

    .then(() => {
      return state.auth();
    })

    .then(authorization => {
      options.headers.authorization = withAuthorizationPrefix_1(authorization);
    });
}

const logOnce$1 = once_1((deprecation) => console.warn(deprecation));
/**
 * Error with extra properties to help with debugging
 */
class RequestError$1 extends Error {
    constructor(message, statusCode, options) {
        super(message);
        // Maintains proper stack trace (only available on V8)
        /* istanbul ignore next */
        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, this.constructor);
        }
        this.name = "HttpError";
        this.status = statusCode;
        Object.defineProperty(this, "code", {
            get() {
                logOnce$1(new Deprecation("[@octokit/request-error] `error.code` is deprecated, use `error.status`."));
                return statusCode;
            }
        });
        this.headers = options.headers || {};
        // redact request credentials without mutating original request options
        const requestCopy = Object.assign({}, options.request);
        if (options.request.headers.authorization) {
            requestCopy.headers = Object.assign({}, options.request.headers, {
                authorization: options.request.headers.authorization.replace(/ .*$/, " [REDACTED]")
            });
        }
        requestCopy.url = requestCopy.url
            // client_id & client_secret can be passed as URL query parameters to increase rate limit
            // see https://developer.github.com/v3/#increasing-the-unauthenticated-rate-limit-for-oauth-applications
            .replace(/\bclient_secret=\w+/g, "client_secret=[REDACTED]")
            // OAuth tokens can be passed as URL query parameters, although it is not recommended
            // see https://developer.github.com/v3/#oauth2-token-sent-in-a-header
            .replace(/\baccess_token=\w+/g, "access_token=[REDACTED]");
        this.request = requestCopy;
    }
}

var distWeb$7 = /*#__PURE__*/Object.freeze({
	__proto__: null,
	RequestError: RequestError$1
});

var requestError = authenticationRequestError;

const { RequestError: RequestError$2 } = distWeb$7;

function authenticationRequestError(state, error, options) {
  if (!error.headers) throw error;

  const otpRequired = /required/.test(error.headers["x-github-otp"] || "");
  // handle "2FA required" error only
  if (error.status !== 401 || !otpRequired) {
    throw error;
  }

  if (
    error.status === 401 &&
    otpRequired &&
    error.request &&
    error.request.headers["x-github-otp"]
  ) {
    if (state.otp) {
      delete state.otp; // no longer valid, request again
    } else {
      throw new RequestError$2(
        "Invalid one-time password for two-factor authentication",
        401,
        {
          headers: error.headers,
          request: options
        }
      );
    }
  }

  if (typeof state.auth.on2fa !== "function") {
    throw new RequestError$2(
      "2FA required, but options.on2fa is not a function. See https://github.com/octokit/rest.js#authentication",
      401,
      {
        headers: error.headers,
        request: options
      }
    );
  }

  return Promise.resolve()
    .then(() => {
      return state.auth.on2fa();
    })
    .then(oneTimePassword => {
      const newOptions = Object.assign(options, {
        headers: Object.assign(options.headers, {
          "x-github-otp": oneTimePassword
        })
      });
      return state.octokit.request(newOptions).then(response => {
        // If OTP still valid, then persist it for following requests
        state.otp = oneTimePassword;
        return response;
      });
    });
}

var validate = validateAuth;

function validateAuth(auth) {
  if (typeof auth === "string") {
    return;
  }

  if (typeof auth === "function") {
    return;
  }

  if (auth.username && auth.password) {
    return;
  }

  if (auth.clientId && auth.clientSecret) {
    return;
  }

  throw new Error(`Invalid "auth" option: ${JSON.stringify(auth)}`);
}

var authentication = authenticationPlugin;

const { createTokenAuth: createTokenAuth$1 } = distWeb$3;
const { Deprecation: Deprecation$2 } = distWeb;







const deprecateAuthBasic = once_1((log, deprecation) => log.warn(deprecation));
const deprecateAuthObject = once_1((log, deprecation) => log.warn(deprecation));

function authenticationPlugin(octokit, options) {
  // If `options.authStrategy` is set then use it and pass in `options.auth`
  if (options.authStrategy) {
    const auth = options.authStrategy(options.auth);
    octokit.hook.wrap("request", auth.hook);
    octokit.auth = auth;
    return;
  }

  // If neither `options.authStrategy` nor `options.auth` are set, the `octokit` instance
  // is unauthenticated. The `octokit.auth()` method is a no-op and no request hook is registred.
  if (!options.auth) {
    octokit.auth = () =>
      Promise.resolve({
        type: "unauthenticated"
      });
    return;
  }

  const isBasicAuthString =
    typeof options.auth === "string" &&
    /^basic/.test(withAuthorizationPrefix_1(options.auth));

  // If only `options.auth` is set to a string, use the default token authentication strategy.
  if (typeof options.auth === "string" && !isBasicAuthString) {
    const auth = createTokenAuth$1(options.auth);
    octokit.hook.wrap("request", auth.hook);
    octokit.auth = auth;
    return;
  }

  // Otherwise log a deprecation message
  const [deprecationMethod, deprecationMessapge] = isBasicAuthString
    ? [
        deprecateAuthBasic,
        'Setting the "new Octokit({ auth })" option to a Basic Auth string is deprecated. Use https://github.com/octokit/auth-basic.js instead. See (https://octokit.github.io/rest.js/#authentication)'
      ]
    : [
        deprecateAuthObject,
        'Setting the "new Octokit({ auth })" option to an object without also setting the "authStrategy" option is deprecated and will be removed in v17. See (https://octokit.github.io/rest.js/#authentication)'
      ];
  deprecationMethod(
    octokit.log,
    new Deprecation$2("[@octokit/rest] " + deprecationMessapge)
  );

  octokit.auth = () =>
    Promise.resolve({
      type: "deprecated",
      message: deprecationMessapge
    });

  validate(options.auth);

  const state = {
    octokit,
    auth: options.auth
  };

  octokit.hook.before("request", beforeRequest.bind(null, state));
  octokit.hook.error("request", requestError.bind(null, state));
}

var authenticate_1 = authenticate;

const { Deprecation: Deprecation$3 } = distWeb;


const deprecateAuthenticate = once_1((log, deprecation) => log.warn(deprecation));

function authenticate(state, options) {
  deprecateAuthenticate(
    state.octokit.log,
    new Deprecation$3(
      '[@octokit/rest] octokit.authenticate() is deprecated. Use "auth" constructor option instead.'
    )
  );

  if (!options) {
    state.auth = false;
    return;
  }

  switch (options.type) {
    case "basic":
      if (!options.username || !options.password) {
        throw new Error(
          "Basic authentication requires both a username and password to be set"
        );
      }
      break;

    case "oauth":
      if (!options.token && !(options.key && options.secret)) {
        throw new Error(
          "OAuth2 authentication requires a token or key & secret to be set"
        );
      }
      break;

    case "token":
    case "app":
      if (!options.token) {
        throw new Error("Token authentication requires a token to be set");
      }
      break;

    default:
      throw new Error(
        "Invalid authentication type, must be 'basic', 'oauth', 'token' or 'app'"
      );
  }

  state.auth = options;
}

/**
 * lodash (Custom Build) <https://lodash.com/>
 * Build: `lodash modularize exports="npm" -o ./`
 * Copyright jQuery Foundation and other contributors <https://jquery.org/>
 * Released under MIT license <https://lodash.com/license>
 * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
 * Copyright Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 */

/** Used as the size to enable large array optimizations. */
var LARGE_ARRAY_SIZE = 200;

/** Used to stand-in for `undefined` hash values. */
var HASH_UNDEFINED = '__lodash_hash_undefined__';

/** Used as references for various `Number` constants. */
var INFINITY = 1 / 0;

/** `Object#toString` result references. */
var funcTag = '[object Function]',
    genTag = '[object GeneratorFunction]';

/**
 * Used to match `RegExp`
 * [syntax characters](http://ecma-international.org/ecma-262/7.0/#sec-patterns).
 */
var reRegExpChar = /[\\^$.*+?()[\]{}|]/g;

/** Used to detect host constructors (Safari). */
var reIsHostCtor = /^\[object .+?Constructor\]$/;

/** Detect free variable `global` from Node.js. */
var freeGlobal = typeof commonjsGlobal == 'object' && commonjsGlobal && commonjsGlobal.Object === Object && commonjsGlobal;

/** Detect free variable `self`. */
var freeSelf = typeof self == 'object' && self && self.Object === Object && self;

/** Used as a reference to the global object. */
var root = freeGlobal || freeSelf || Function('return this')();

/**
 * A specialized version of `_.includes` for arrays without support for
 * specifying an index to search from.
 *
 * @private
 * @param {Array} [array] The array to inspect.
 * @param {*} target The value to search for.
 * @returns {boolean} Returns `true` if `target` is found, else `false`.
 */
function arrayIncludes(array, value) {
  var length = array ? array.length : 0;
  return !!length && baseIndexOf(array, value, 0) > -1;
}

/**
 * This function is like `arrayIncludes` except that it accepts a comparator.
 *
 * @private
 * @param {Array} [array] The array to inspect.
 * @param {*} target The value to search for.
 * @param {Function} comparator The comparator invoked per element.
 * @returns {boolean} Returns `true` if `target` is found, else `false`.
 */
function arrayIncludesWith(array, value, comparator) {
  var index = -1,
      length = array ? array.length : 0;

  while (++index < length) {
    if (comparator(value, array[index])) {
      return true;
    }
  }
  return false;
}

/**
 * The base implementation of `_.findIndex` and `_.findLastIndex` without
 * support for iteratee shorthands.
 *
 * @private
 * @param {Array} array The array to inspect.
 * @param {Function} predicate The function invoked per iteration.
 * @param {number} fromIndex The index to search from.
 * @param {boolean} [fromRight] Specify iterating from right to left.
 * @returns {number} Returns the index of the matched value, else `-1`.
 */
function baseFindIndex(array, predicate, fromIndex, fromRight) {
  var length = array.length,
      index = fromIndex + (fromRight ? 1 : -1);

  while ((fromRight ? index-- : ++index < length)) {
    if (predicate(array[index], index, array)) {
      return index;
    }
  }
  return -1;
}

/**
 * The base implementation of `_.indexOf` without `fromIndex` bounds checks.
 *
 * @private
 * @param {Array} array The array to inspect.
 * @param {*} value The value to search for.
 * @param {number} fromIndex The index to search from.
 * @returns {number} Returns the index of the matched value, else `-1`.
 */
function baseIndexOf(array, value, fromIndex) {
  if (value !== value) {
    return baseFindIndex(array, baseIsNaN, fromIndex);
  }
  var index = fromIndex - 1,
      length = array.length;

  while (++index < length) {
    if (array[index] === value) {
      return index;
    }
  }
  return -1;
}

/**
 * The base implementation of `_.isNaN` without support for number objects.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is `NaN`, else `false`.
 */
function baseIsNaN(value) {
  return value !== value;
}

/**
 * Checks if a cache value for `key` exists.
 *
 * @private
 * @param {Object} cache The cache to query.
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function cacheHas(cache, key) {
  return cache.has(key);
}

/**
 * Gets the value at `key` of `object`.
 *
 * @private
 * @param {Object} [object] The object to query.
 * @param {string} key The key of the property to get.
 * @returns {*} Returns the property value.
 */
function getValue(object, key) {
  return object == null ? undefined : object[key];
}

/**
 * Checks if `value` is a host object in IE < 9.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a host object, else `false`.
 */
function isHostObject(value) {
  // Many host objects are `Object` objects that can coerce to strings
  // despite having improperly defined `toString` methods.
  var result = false;
  if (value != null && typeof value.toString != 'function') {
    try {
      result = !!(value + '');
    } catch (e) {}
  }
  return result;
}

/**
 * Converts `set` to an array of its values.
 *
 * @private
 * @param {Object} set The set to convert.
 * @returns {Array} Returns the values.
 */
function setToArray(set) {
  var index = -1,
      result = Array(set.size);

  set.forEach(function(value) {
    result[++index] = value;
  });
  return result;
}

/** Used for built-in method references. */
var arrayProto = Array.prototype,
    funcProto = Function.prototype,
    objectProto = Object.prototype;

/** Used to detect overreaching core-js shims. */
var coreJsData = root['__core-js_shared__'];

/** Used to detect methods masquerading as native. */
var maskSrcKey = (function() {
  var uid = /[^.]+$/.exec(coreJsData && coreJsData.keys && coreJsData.keys.IE_PROTO || '');
  return uid ? ('Symbol(src)_1.' + uid) : '';
}());

/** Used to resolve the decompiled source of functions. */
var funcToString = funcProto.toString;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * Used to resolve the
 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
 * of values.
 */
var objectToString = objectProto.toString;

/** Used to detect if a method is native. */
var reIsNative = RegExp('^' +
  funcToString.call(hasOwnProperty).replace(reRegExpChar, '\\$&')
  .replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, '$1.*?') + '$'
);

/** Built-in value references. */
var splice = arrayProto.splice;

/* Built-in method references that are verified to be native. */
var Map$1 = getNative(root, 'Map'),
    Set = getNative(root, 'Set'),
    nativeCreate = getNative(Object, 'create');

/**
 * Creates a hash object.
 *
 * @private
 * @constructor
 * @param {Array} [entries] The key-value pairs to cache.
 */
function Hash(entries) {
  var index = -1,
      length = entries ? entries.length : 0;

  this.clear();
  while (++index < length) {
    var entry = entries[index];
    this.set(entry[0], entry[1]);
  }
}

/**
 * Removes all key-value entries from the hash.
 *
 * @private
 * @name clear
 * @memberOf Hash
 */
function hashClear() {
  this.__data__ = nativeCreate ? nativeCreate(null) : {};
}

/**
 * Removes `key` and its value from the hash.
 *
 * @private
 * @name delete
 * @memberOf Hash
 * @param {Object} hash The hash to modify.
 * @param {string} key The key of the value to remove.
 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
 */
function hashDelete(key) {
  return this.has(key) && delete this.__data__[key];
}

/**
 * Gets the hash value for `key`.
 *
 * @private
 * @name get
 * @memberOf Hash
 * @param {string} key The key of the value to get.
 * @returns {*} Returns the entry value.
 */
function hashGet(key) {
  var data = this.__data__;
  if (nativeCreate) {
    var result = data[key];
    return result === HASH_UNDEFINED ? undefined : result;
  }
  return hasOwnProperty.call(data, key) ? data[key] : undefined;
}

/**
 * Checks if a hash value for `key` exists.
 *
 * @private
 * @name has
 * @memberOf Hash
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function hashHas(key) {
  var data = this.__data__;
  return nativeCreate ? data[key] !== undefined : hasOwnProperty.call(data, key);
}

/**
 * Sets the hash `key` to `value`.
 *
 * @private
 * @name set
 * @memberOf Hash
 * @param {string} key The key of the value to set.
 * @param {*} value The value to set.
 * @returns {Object} Returns the hash instance.
 */
function hashSet(key, value) {
  var data = this.__data__;
  data[key] = (nativeCreate && value === undefined) ? HASH_UNDEFINED : value;
  return this;
}

// Add methods to `Hash`.
Hash.prototype.clear = hashClear;
Hash.prototype['delete'] = hashDelete;
Hash.prototype.get = hashGet;
Hash.prototype.has = hashHas;
Hash.prototype.set = hashSet;

/**
 * Creates an list cache object.
 *
 * @private
 * @constructor
 * @param {Array} [entries] The key-value pairs to cache.
 */
function ListCache(entries) {
  var index = -1,
      length = entries ? entries.length : 0;

  this.clear();
  while (++index < length) {
    var entry = entries[index];
    this.set(entry[0], entry[1]);
  }
}

/**
 * Removes all key-value entries from the list cache.
 *
 * @private
 * @name clear
 * @memberOf ListCache
 */
function listCacheClear() {
  this.__data__ = [];
}

/**
 * Removes `key` and its value from the list cache.
 *
 * @private
 * @name delete
 * @memberOf ListCache
 * @param {string} key The key of the value to remove.
 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
 */
function listCacheDelete(key) {
  var data = this.__data__,
      index = assocIndexOf(data, key);

  if (index < 0) {
    return false;
  }
  var lastIndex = data.length - 1;
  if (index == lastIndex) {
    data.pop();
  } else {
    splice.call(data, index, 1);
  }
  return true;
}

/**
 * Gets the list cache value for `key`.
 *
 * @private
 * @name get
 * @memberOf ListCache
 * @param {string} key The key of the value to get.
 * @returns {*} Returns the entry value.
 */
function listCacheGet(key) {
  var data = this.__data__,
      index = assocIndexOf(data, key);

  return index < 0 ? undefined : data[index][1];
}

/**
 * Checks if a list cache value for `key` exists.
 *
 * @private
 * @name has
 * @memberOf ListCache
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function listCacheHas(key) {
  return assocIndexOf(this.__data__, key) > -1;
}

/**
 * Sets the list cache `key` to `value`.
 *
 * @private
 * @name set
 * @memberOf ListCache
 * @param {string} key The key of the value to set.
 * @param {*} value The value to set.
 * @returns {Object} Returns the list cache instance.
 */
function listCacheSet(key, value) {
  var data = this.__data__,
      index = assocIndexOf(data, key);

  if (index < 0) {
    data.push([key, value]);
  } else {
    data[index][1] = value;
  }
  return this;
}

// Add methods to `ListCache`.
ListCache.prototype.clear = listCacheClear;
ListCache.prototype['delete'] = listCacheDelete;
ListCache.prototype.get = listCacheGet;
ListCache.prototype.has = listCacheHas;
ListCache.prototype.set = listCacheSet;

/**
 * Creates a map cache object to store key-value pairs.
 *
 * @private
 * @constructor
 * @param {Array} [entries] The key-value pairs to cache.
 */
function MapCache(entries) {
  var index = -1,
      length = entries ? entries.length : 0;

  this.clear();
  while (++index < length) {
    var entry = entries[index];
    this.set(entry[0], entry[1]);
  }
}

/**
 * Removes all key-value entries from the map.
 *
 * @private
 * @name clear
 * @memberOf MapCache
 */
function mapCacheClear() {
  this.__data__ = {
    'hash': new Hash,
    'map': new (Map$1 || ListCache),
    'string': new Hash
  };
}

/**
 * Removes `key` and its value from the map.
 *
 * @private
 * @name delete
 * @memberOf MapCache
 * @param {string} key The key of the value to remove.
 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
 */
function mapCacheDelete(key) {
  return getMapData(this, key)['delete'](key);
}

/**
 * Gets the map value for `key`.
 *
 * @private
 * @name get
 * @memberOf MapCache
 * @param {string} key The key of the value to get.
 * @returns {*} Returns the entry value.
 */
function mapCacheGet(key) {
  return getMapData(this, key).get(key);
}

/**
 * Checks if a map value for `key` exists.
 *
 * @private
 * @name has
 * @memberOf MapCache
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function mapCacheHas(key) {
  return getMapData(this, key).has(key);
}

/**
 * Sets the map `key` to `value`.
 *
 * @private
 * @name set
 * @memberOf MapCache
 * @param {string} key The key of the value to set.
 * @param {*} value The value to set.
 * @returns {Object} Returns the map cache instance.
 */
function mapCacheSet(key, value) {
  getMapData(this, key).set(key, value);
  return this;
}

// Add methods to `MapCache`.
MapCache.prototype.clear = mapCacheClear;
MapCache.prototype['delete'] = mapCacheDelete;
MapCache.prototype.get = mapCacheGet;
MapCache.prototype.has = mapCacheHas;
MapCache.prototype.set = mapCacheSet;

/**
 *
 * Creates an array cache object to store unique values.
 *
 * @private
 * @constructor
 * @param {Array} [values] The values to cache.
 */
function SetCache(values) {
  var index = -1,
      length = values ? values.length : 0;

  this.__data__ = new MapCache;
  while (++index < length) {
    this.add(values[index]);
  }
}

/**
 * Adds `value` to the array cache.
 *
 * @private
 * @name add
 * @memberOf SetCache
 * @alias push
 * @param {*} value The value to cache.
 * @returns {Object} Returns the cache instance.
 */
function setCacheAdd(value) {
  this.__data__.set(value, HASH_UNDEFINED);
  return this;
}

/**
 * Checks if `value` is in the array cache.
 *
 * @private
 * @name has
 * @memberOf SetCache
 * @param {*} value The value to search for.
 * @returns {number} Returns `true` if `value` is found, else `false`.
 */
function setCacheHas(value) {
  return this.__data__.has(value);
}

// Add methods to `SetCache`.
SetCache.prototype.add = SetCache.prototype.push = setCacheAdd;
SetCache.prototype.has = setCacheHas;

/**
 * Gets the index at which the `key` is found in `array` of key-value pairs.
 *
 * @private
 * @param {Array} array The array to inspect.
 * @param {*} key The key to search for.
 * @returns {number} Returns the index of the matched value, else `-1`.
 */
function assocIndexOf(array, key) {
  var length = array.length;
  while (length--) {
    if (eq(array[length][0], key)) {
      return length;
    }
  }
  return -1;
}

/**
 * The base implementation of `_.isNative` without bad shim checks.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a native function,
 *  else `false`.
 */
function baseIsNative(value) {
  if (!isObject$1(value) || isMasked(value)) {
    return false;
  }
  var pattern = (isFunction(value) || isHostObject(value)) ? reIsNative : reIsHostCtor;
  return pattern.test(toSource(value));
}

/**
 * The base implementation of `_.uniqBy` without support for iteratee shorthands.
 *
 * @private
 * @param {Array} array The array to inspect.
 * @param {Function} [iteratee] The iteratee invoked per element.
 * @param {Function} [comparator] The comparator invoked per element.
 * @returns {Array} Returns the new duplicate free array.
 */
function baseUniq(array, iteratee, comparator) {
  var index = -1,
      includes = arrayIncludes,
      length = array.length,
      isCommon = true,
      result = [],
      seen = result;

  if (comparator) {
    isCommon = false;
    includes = arrayIncludesWith;
  }
  else if (length >= LARGE_ARRAY_SIZE) {
    var set = iteratee ? null : createSet(array);
    if (set) {
      return setToArray(set);
    }
    isCommon = false;
    includes = cacheHas;
    seen = new SetCache;
  }
  else {
    seen = iteratee ? [] : result;
  }
  outer:
  while (++index < length) {
    var value = array[index],
        computed = iteratee ? iteratee(value) : value;

    value = (comparator || value !== 0) ? value : 0;
    if (isCommon && computed === computed) {
      var seenIndex = seen.length;
      while (seenIndex--) {
        if (seen[seenIndex] === computed) {
          continue outer;
        }
      }
      if (iteratee) {
        seen.push(computed);
      }
      result.push(value);
    }
    else if (!includes(seen, computed, comparator)) {
      if (seen !== result) {
        seen.push(computed);
      }
      result.push(value);
    }
  }
  return result;
}

/**
 * Creates a set object of `values`.
 *
 * @private
 * @param {Array} values The values to add to the set.
 * @returns {Object} Returns the new set.
 */
var createSet = !(Set && (1 / setToArray(new Set([,-0]))[1]) == INFINITY) ? noop$2 : function(values) {
  return new Set(values);
};

/**
 * Gets the data for `map`.
 *
 * @private
 * @param {Object} map The map to query.
 * @param {string} key The reference key.
 * @returns {*} Returns the map data.
 */
function getMapData(map, key) {
  var data = map.__data__;
  return isKeyable(key)
    ? data[typeof key == 'string' ? 'string' : 'hash']
    : data.map;
}

/**
 * Gets the native function at `key` of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @param {string} key The key of the method to get.
 * @returns {*} Returns the function if it's native, else `undefined`.
 */
function getNative(object, key) {
  var value = getValue(object, key);
  return baseIsNative(value) ? value : undefined;
}

/**
 * Checks if `value` is suitable for use as unique object key.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is suitable, else `false`.
 */
function isKeyable(value) {
  var type = typeof value;
  return (type == 'string' || type == 'number' || type == 'symbol' || type == 'boolean')
    ? (value !== '__proto__')
    : (value === null);
}

/**
 * Checks if `func` has its source masked.
 *
 * @private
 * @param {Function} func The function to check.
 * @returns {boolean} Returns `true` if `func` is masked, else `false`.
 */
function isMasked(func) {
  return !!maskSrcKey && (maskSrcKey in func);
}

/**
 * Converts `func` to its source code.
 *
 * @private
 * @param {Function} func The function to process.
 * @returns {string} Returns the source code.
 */
function toSource(func) {
  if (func != null) {
    try {
      return funcToString.call(func);
    } catch (e) {}
    try {
      return (func + '');
    } catch (e) {}
  }
  return '';
}

/**
 * Creates a duplicate-free version of an array, using
 * [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
 * for equality comparisons, in which only the first occurrence of each
 * element is kept.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Array
 * @param {Array} array The array to inspect.
 * @returns {Array} Returns the new duplicate free array.
 * @example
 *
 * _.uniq([2, 1, 2]);
 * // => [2, 1]
 */
function uniq(array) {
  return (array && array.length)
    ? baseUniq(array)
    : [];
}

/**
 * Performs a
 * [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
 * comparison between two values to determine if they are equivalent.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to compare.
 * @param {*} other The other value to compare.
 * @returns {boolean} Returns `true` if the values are equivalent, else `false`.
 * @example
 *
 * var object = { 'a': 1 };
 * var other = { 'a': 1 };
 *
 * _.eq(object, object);
 * // => true
 *
 * _.eq(object, other);
 * // => false
 *
 * _.eq('a', 'a');
 * // => true
 *
 * _.eq('a', Object('a'));
 * // => false
 *
 * _.eq(NaN, NaN);
 * // => true
 */
function eq(value, other) {
  return value === other || (value !== value && other !== other);
}

/**
 * Checks if `value` is classified as a `Function` object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a function, else `false`.
 * @example
 *
 * _.isFunction(_);
 * // => true
 *
 * _.isFunction(/abc/);
 * // => false
 */
function isFunction(value) {
  // The use of `Object#toString` avoids issues with the `typeof` operator
  // in Safari 8-9 which returns 'object' for typed array and other constructors.
  var tag = isObject$1(value) ? objectToString.call(value) : '';
  return tag == funcTag || tag == genTag;
}

/**
 * Checks if `value` is the
 * [language type](http://www.ecma-international.org/ecma-262/7.0/#sec-ecmascript-language-types)
 * of `Object`. (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an object, else `false`.
 * @example
 *
 * _.isObject({});
 * // => true
 *
 * _.isObject([1, 2, 3]);
 * // => true
 *
 * _.isObject(_.noop);
 * // => true
 *
 * _.isObject(null);
 * // => false
 */
function isObject$1(value) {
  var type = typeof value;
  return !!value && (type == 'object' || type == 'function');
}

/**
 * This method returns `undefined`.
 *
 * @static
 * @memberOf _
 * @since 2.3.0
 * @category Util
 * @example
 *
 * _.times(2, _.noop);
 * // => [undefined, undefined]
 */
function noop$2() {
  // No operation performed.
}

var lodash_uniq = uniq;

var beforeRequest$1 = authenticationBeforeRequest$1;




function authenticationBeforeRequest$1(state, options) {
  if (!state.auth.type) {
    return;
  }

  if (state.auth.type === "basic") {
    const hash = btoaNode(`${state.auth.username}:${state.auth.password}`);
    options.headers.authorization = `Basic ${hash}`;
    return;
  }

  if (state.auth.type === "token") {
    options.headers.authorization = `token ${state.auth.token}`;
    return;
  }

  if (state.auth.type === "app") {
    options.headers.authorization = `Bearer ${state.auth.token}`;
    const acceptHeaders = options.headers.accept
      .split(",")
      .concat("application/vnd.github.machine-man-preview+json");
    options.headers.accept = lodash_uniq(acceptHeaders)
      .filter(Boolean)
      .join(",");
    return;
  }

  options.url += options.url.indexOf("?") === -1 ? "?" : "&";

  if (state.auth.token) {
    options.url += `access_token=${encodeURIComponent(state.auth.token)}`;
    return;
  }

  const key = encodeURIComponent(state.auth.key);
  const secret = encodeURIComponent(state.auth.secret);
  options.url += `client_id=${key}&client_secret=${secret}`;
}

var requestError$1 = authenticationRequestError$1;

const { RequestError: RequestError$3 } = distWeb$7;

function authenticationRequestError$1(state, error, options) {
  /* istanbul ignore next */
  if (!error.headers) throw error;

  const otpRequired = /required/.test(error.headers["x-github-otp"] || "");
  // handle "2FA required" error only
  if (error.status !== 401 || !otpRequired) {
    throw error;
  }

  if (
    error.status === 401 &&
    otpRequired &&
    error.request &&
    error.request.headers["x-github-otp"]
  ) {
    throw new RequestError$3(
      "Invalid one-time password for two-factor authentication",
      401,
      {
        headers: error.headers,
        request: options
      }
    );
  }

  if (typeof state.auth.on2fa !== "function") {
    throw new RequestError$3(
      "2FA required, but options.on2fa is not a function. See https://github.com/octokit/rest.js#authentication",
      401,
      {
        headers: error.headers,
        request: options
      }
    );
  }

  return Promise.resolve()
    .then(() => {
      return state.auth.on2fa();
    })
    .then(oneTimePassword => {
      const newOptions = Object.assign(options, {
        headers: Object.assign(
          { "x-github-otp": oneTimePassword },
          options.headers
        )
      });
      return state.octokit.request(newOptions);
    });
}

var authenticationDeprecated = authenticationPlugin$1;

const { Deprecation: Deprecation$4 } = distWeb;


const deprecateAuthenticate$1 = once_1((log, deprecation) => log.warn(deprecation));





function authenticationPlugin$1(octokit, options) {
  if (options.auth) {
    octokit.authenticate = () => {
      deprecateAuthenticate$1(
        octokit.log,
        new Deprecation$4(
          '[@octokit/rest] octokit.authenticate() is deprecated and has no effect when "auth" option is set on Octokit constructor'
        )
      );
    };
    return;
  }
  const state = {
    octokit,
    auth: false
  };
  octokit.authenticate = authenticate_1.bind(null, state);
  octokit.hook.before("request", beforeRequest$1.bind(null, state));
  octokit.hook.error("request", requestError$1.bind(null, state));
}

const VERSION$9 = "1.1.2";

/**
 * Some “list” response that can be paginated have a different response structure
 *
 * They have a `total_count` key in the response (search also has `incomplete_results`,
 * /installation/repositories also has `repository_selection`), as well as a key with
 * the list of the items which name varies from endpoint to endpoint:
 *
 * - https://developer.github.com/v3/search/#example (key `items`)
 * - https://developer.github.com/v3/checks/runs/#response-3 (key: `check_runs`)
 * - https://developer.github.com/v3/checks/suites/#response-1 (key: `check_suites`)
 * - https://developer.github.com/v3/apps/installations/#list-repositories (key: `repositories`)
 * - https://developer.github.com/v3/apps/installations/#list-installations-for-a-user (key `installations`)
 *
 * Octokit normalizes these responses so that paginated results are always returned following
 * the same structure. One challenge is that if the list response has only one page, no Link
 * header is provided, so this header alone is not sufficient to check wether a response is
 * paginated or not. For the exceptions with the namespace, a fallback check for the route
 * paths has to be added in order to normalize the response. We cannot check for the total_count
 * property because it also exists in the response of Get the combined status for a specific ref.
 */
const REGEX = [
    /^\/search\//,
    /^\/repos\/[^/]+\/[^/]+\/commits\/[^/]+\/(check-runs|check-suites)([^/]|$)/,
    /^\/installation\/repositories([^/]|$)/,
    /^\/user\/installations([^/]|$)/,
    /^\/repos\/[^/]+\/[^/]+\/actions\/secrets([^/]|$)/,
    /^\/repos\/[^/]+\/[^/]+\/actions\/workflows(\/[^/]+\/runs)?([^/]|$)/,
    /^\/repos\/[^/]+\/[^/]+\/actions\/runs(\/[^/]+\/(artifacts|jobs))?([^/]|$)/
];
function normalizePaginatedListResponse$1(octokit, url, response) {
    const path = url.replace(octokit.request.endpoint.DEFAULTS.baseUrl, "");
    const responseNeedsNormalization = REGEX.find(regex => regex.test(path));
    if (!responseNeedsNormalization)
        return;
    // keep the additional properties intact as there is currently no other way
    // to retrieve the same information.
    const incompleteResults = response.data.incomplete_results;
    const repositorySelection = response.data.repository_selection;
    const totalCount = response.data.total_count;
    delete response.data.incomplete_results;
    delete response.data.repository_selection;
    delete response.data.total_count;
    const namespaceKey = Object.keys(response.data)[0];
    const data = response.data[namespaceKey];
    response.data = data;
    if (typeof incompleteResults !== "undefined") {
        response.data.incomplete_results = incompleteResults;
    }
    if (typeof repositorySelection !== "undefined") {
        response.data.repository_selection = repositorySelection;
    }
    response.data.total_count = totalCount;
    Object.defineProperty(response.data, namespaceKey, {
        get() {
            octokit.log.warn(`[@octokit/paginate-rest] "response.data.${namespaceKey}" is deprecated for "GET ${path}". Get the results directly from "response.data"`);
            return Array.from(data);
        }
    });
}

function iterator$1(octokit, route, parameters) {
    const options = octokit.request.endpoint(route, parameters);
    const method = options.method;
    const headers = options.headers;
    let url = options.url;
    return {
        [Symbol.asyncIterator]: () => ({
            next() {
                if (!url) {
                    return Promise.resolve({ done: true });
                }
                return octokit
                    .request({ method, url, headers })
                    .then((response) => {
                    normalizePaginatedListResponse$1(octokit, url, response);
                    // `response.headers.link` format:
                    // '<https://api.github.com/users/aseemk/followers?page=2>; rel="next", <https://api.github.com/users/aseemk/followers?page=2>; rel="last"'
                    // sets `url` to undefined if "next" URL is not present or `link` header is not set
                    url = ((response.headers.link || "").match(/<([^>]+)>;\s*rel="next"/) || [])[1];
                    return { value: response };
                });
            }
        })
    };
}

function paginate$1(octokit, route, parameters, mapFn) {
    if (typeof parameters === "function") {
        mapFn = parameters;
        parameters = undefined;
    }
    return gather$1(octokit, [], iterator$1(octokit, route, parameters)[Symbol.asyncIterator](), mapFn);
}
function gather$1(octokit, results, iterator, mapFn) {
    return iterator.next().then(result => {
        if (result.done) {
            return results;
        }
        let earlyExit = false;
        function done() {
            earlyExit = true;
        }
        results = results.concat(mapFn ? mapFn(result.value, done) : result.value.data);
        if (earlyExit) {
            return results;
        }
        return gather$1(octokit, results, iterator, mapFn);
    });
}

/**
 * @param octokit Octokit instance
 * @param options Options passed to Octokit constructor
 */
function paginateRest$1(octokit) {
    return {
        paginate: Object.assign(paginate$1.bind(null, octokit), {
            iterator: iterator$1.bind(null, octokit)
        })
    };
}
paginateRest$1.VERSION = VERSION$9;

var distWeb$8 = /*#__PURE__*/Object.freeze({
	__proto__: null,
	paginateRest: paginateRest$1
});

var pagination = paginatePlugin;

const { paginateRest: paginateRest$2 } = distWeb$8;

function paginatePlugin(octokit) {
  Object.assign(octokit, paginateRest$2(octokit));
}

/**
 * lodash (Custom Build) <https://lodash.com/>
 * Build: `lodash modularize exports="npm" -o ./`
 * Copyright jQuery Foundation and other contributors <https://jquery.org/>
 * Released under MIT license <https://lodash.com/license>
 * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
 * Copyright Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 */

/** Used as the `TypeError` message for "Functions" methods. */
var FUNC_ERROR_TEXT = 'Expected a function';

/** Used to stand-in for `undefined` hash values. */
var HASH_UNDEFINED$1 = '__lodash_hash_undefined__';

/** Used as references for various `Number` constants. */
var INFINITY$1 = 1 / 0;

/** `Object#toString` result references. */
var funcTag$1 = '[object Function]',
    genTag$1 = '[object GeneratorFunction]',
    symbolTag = '[object Symbol]';

/** Used to match property names within property paths. */
var reIsDeepProp = /\.|\[(?:[^[\]]*|(["'])(?:(?!\1)[^\\]|\\.)*?\1)\]/,
    reIsPlainProp = /^\w*$/,
    reLeadingDot = /^\./,
    rePropName = /[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|$))/g;

/**
 * Used to match `RegExp`
 * [syntax characters](http://ecma-international.org/ecma-262/7.0/#sec-patterns).
 */
var reRegExpChar$1 = /[\\^$.*+?()[\]{}|]/g;

/** Used to match backslashes in property paths. */
var reEscapeChar = /\\(\\)?/g;

/** Used to detect host constructors (Safari). */
var reIsHostCtor$1 = /^\[object .+?Constructor\]$/;

/** Detect free variable `global` from Node.js. */
var freeGlobal$1 = typeof commonjsGlobal == 'object' && commonjsGlobal && commonjsGlobal.Object === Object && commonjsGlobal;

/** Detect free variable `self`. */
var freeSelf$1 = typeof self == 'object' && self && self.Object === Object && self;

/** Used as a reference to the global object. */
var root$1 = freeGlobal$1 || freeSelf$1 || Function('return this')();

/**
 * Gets the value at `key` of `object`.
 *
 * @private
 * @param {Object} [object] The object to query.
 * @param {string} key The key of the property to get.
 * @returns {*} Returns the property value.
 */
function getValue$1(object, key) {
  return object == null ? undefined : object[key];
}

/**
 * Checks if `value` is a host object in IE < 9.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a host object, else `false`.
 */
function isHostObject$1(value) {
  // Many host objects are `Object` objects that can coerce to strings
  // despite having improperly defined `toString` methods.
  var result = false;
  if (value != null && typeof value.toString != 'function') {
    try {
      result = !!(value + '');
    } catch (e) {}
  }
  return result;
}

/** Used for built-in method references. */
var arrayProto$1 = Array.prototype,
    funcProto$1 = Function.prototype,
    objectProto$1 = Object.prototype;

/** Used to detect overreaching core-js shims. */
var coreJsData$1 = root$1['__core-js_shared__'];

/** Used to detect methods masquerading as native. */
var maskSrcKey$1 = (function() {
  var uid = /[^.]+$/.exec(coreJsData$1 && coreJsData$1.keys && coreJsData$1.keys.IE_PROTO || '');
  return uid ? ('Symbol(src)_1.' + uid) : '';
}());

/** Used to resolve the decompiled source of functions. */
var funcToString$1 = funcProto$1.toString;

/** Used to check objects for own properties. */
var hasOwnProperty$1 = objectProto$1.hasOwnProperty;

/**
 * Used to resolve the
 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
 * of values.
 */
var objectToString$1 = objectProto$1.toString;

/** Used to detect if a method is native. */
var reIsNative$1 = RegExp('^' +
  funcToString$1.call(hasOwnProperty$1).replace(reRegExpChar$1, '\\$&')
  .replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, '$1.*?') + '$'
);

/** Built-in value references. */
var Symbol$1 = root$1.Symbol,
    splice$1 = arrayProto$1.splice;

/* Built-in method references that are verified to be native. */
var Map$2 = getNative$1(root$1, 'Map'),
    nativeCreate$1 = getNative$1(Object, 'create');

/** Used to convert symbols to primitives and strings. */
var symbolProto = Symbol$1 ? Symbol$1.prototype : undefined,
    symbolToString = symbolProto ? symbolProto.toString : undefined;

/**
 * Creates a hash object.
 *
 * @private
 * @constructor
 * @param {Array} [entries] The key-value pairs to cache.
 */
function Hash$1(entries) {
  var index = -1,
      length = entries ? entries.length : 0;

  this.clear();
  while (++index < length) {
    var entry = entries[index];
    this.set(entry[0], entry[1]);
  }
}

/**
 * Removes all key-value entries from the hash.
 *
 * @private
 * @name clear
 * @memberOf Hash
 */
function hashClear$1() {
  this.__data__ = nativeCreate$1 ? nativeCreate$1(null) : {};
}

/**
 * Removes `key` and its value from the hash.
 *
 * @private
 * @name delete
 * @memberOf Hash
 * @param {Object} hash The hash to modify.
 * @param {string} key The key of the value to remove.
 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
 */
function hashDelete$1(key) {
  return this.has(key) && delete this.__data__[key];
}

/**
 * Gets the hash value for `key`.
 *
 * @private
 * @name get
 * @memberOf Hash
 * @param {string} key The key of the value to get.
 * @returns {*} Returns the entry value.
 */
function hashGet$1(key) {
  var data = this.__data__;
  if (nativeCreate$1) {
    var result = data[key];
    return result === HASH_UNDEFINED$1 ? undefined : result;
  }
  return hasOwnProperty$1.call(data, key) ? data[key] : undefined;
}

/**
 * Checks if a hash value for `key` exists.
 *
 * @private
 * @name has
 * @memberOf Hash
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function hashHas$1(key) {
  var data = this.__data__;
  return nativeCreate$1 ? data[key] !== undefined : hasOwnProperty$1.call(data, key);
}

/**
 * Sets the hash `key` to `value`.
 *
 * @private
 * @name set
 * @memberOf Hash
 * @param {string} key The key of the value to set.
 * @param {*} value The value to set.
 * @returns {Object} Returns the hash instance.
 */
function hashSet$1(key, value) {
  var data = this.__data__;
  data[key] = (nativeCreate$1 && value === undefined) ? HASH_UNDEFINED$1 : value;
  return this;
}

// Add methods to `Hash`.
Hash$1.prototype.clear = hashClear$1;
Hash$1.prototype['delete'] = hashDelete$1;
Hash$1.prototype.get = hashGet$1;
Hash$1.prototype.has = hashHas$1;
Hash$1.prototype.set = hashSet$1;

/**
 * Creates an list cache object.
 *
 * @private
 * @constructor
 * @param {Array} [entries] The key-value pairs to cache.
 */
function ListCache$1(entries) {
  var index = -1,
      length = entries ? entries.length : 0;

  this.clear();
  while (++index < length) {
    var entry = entries[index];
    this.set(entry[0], entry[1]);
  }
}

/**
 * Removes all key-value entries from the list cache.
 *
 * @private
 * @name clear
 * @memberOf ListCache
 */
function listCacheClear$1() {
  this.__data__ = [];
}

/**
 * Removes `key` and its value from the list cache.
 *
 * @private
 * @name delete
 * @memberOf ListCache
 * @param {string} key The key of the value to remove.
 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
 */
function listCacheDelete$1(key) {
  var data = this.__data__,
      index = assocIndexOf$1(data, key);

  if (index < 0) {
    return false;
  }
  var lastIndex = data.length - 1;
  if (index == lastIndex) {
    data.pop();
  } else {
    splice$1.call(data, index, 1);
  }
  return true;
}

/**
 * Gets the list cache value for `key`.
 *
 * @private
 * @name get
 * @memberOf ListCache
 * @param {string} key The key of the value to get.
 * @returns {*} Returns the entry value.
 */
function listCacheGet$1(key) {
  var data = this.__data__,
      index = assocIndexOf$1(data, key);

  return index < 0 ? undefined : data[index][1];
}

/**
 * Checks if a list cache value for `key` exists.
 *
 * @private
 * @name has
 * @memberOf ListCache
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function listCacheHas$1(key) {
  return assocIndexOf$1(this.__data__, key) > -1;
}

/**
 * Sets the list cache `key` to `value`.
 *
 * @private
 * @name set
 * @memberOf ListCache
 * @param {string} key The key of the value to set.
 * @param {*} value The value to set.
 * @returns {Object} Returns the list cache instance.
 */
function listCacheSet$1(key, value) {
  var data = this.__data__,
      index = assocIndexOf$1(data, key);

  if (index < 0) {
    data.push([key, value]);
  } else {
    data[index][1] = value;
  }
  return this;
}

// Add methods to `ListCache`.
ListCache$1.prototype.clear = listCacheClear$1;
ListCache$1.prototype['delete'] = listCacheDelete$1;
ListCache$1.prototype.get = listCacheGet$1;
ListCache$1.prototype.has = listCacheHas$1;
ListCache$1.prototype.set = listCacheSet$1;

/**
 * Creates a map cache object to store key-value pairs.
 *
 * @private
 * @constructor
 * @param {Array} [entries] The key-value pairs to cache.
 */
function MapCache$1(entries) {
  var index = -1,
      length = entries ? entries.length : 0;

  this.clear();
  while (++index < length) {
    var entry = entries[index];
    this.set(entry[0], entry[1]);
  }
}

/**
 * Removes all key-value entries from the map.
 *
 * @private
 * @name clear
 * @memberOf MapCache
 */
function mapCacheClear$1() {
  this.__data__ = {
    'hash': new Hash$1,
    'map': new (Map$2 || ListCache$1),
    'string': new Hash$1
  };
}

/**
 * Removes `key` and its value from the map.
 *
 * @private
 * @name delete
 * @memberOf MapCache
 * @param {string} key The key of the value to remove.
 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
 */
function mapCacheDelete$1(key) {
  return getMapData$1(this, key)['delete'](key);
}

/**
 * Gets the map value for `key`.
 *
 * @private
 * @name get
 * @memberOf MapCache
 * @param {string} key The key of the value to get.
 * @returns {*} Returns the entry value.
 */
function mapCacheGet$1(key) {
  return getMapData$1(this, key).get(key);
}

/**
 * Checks if a map value for `key` exists.
 *
 * @private
 * @name has
 * @memberOf MapCache
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function mapCacheHas$1(key) {
  return getMapData$1(this, key).has(key);
}

/**
 * Sets the map `key` to `value`.
 *
 * @private
 * @name set
 * @memberOf MapCache
 * @param {string} key The key of the value to set.
 * @param {*} value The value to set.
 * @returns {Object} Returns the map cache instance.
 */
function mapCacheSet$1(key, value) {
  getMapData$1(this, key).set(key, value);
  return this;
}

// Add methods to `MapCache`.
MapCache$1.prototype.clear = mapCacheClear$1;
MapCache$1.prototype['delete'] = mapCacheDelete$1;
MapCache$1.prototype.get = mapCacheGet$1;
MapCache$1.prototype.has = mapCacheHas$1;
MapCache$1.prototype.set = mapCacheSet$1;

/**
 * Gets the index at which the `key` is found in `array` of key-value pairs.
 *
 * @private
 * @param {Array} array The array to inspect.
 * @param {*} key The key to search for.
 * @returns {number} Returns the index of the matched value, else `-1`.
 */
function assocIndexOf$1(array, key) {
  var length = array.length;
  while (length--) {
    if (eq$1(array[length][0], key)) {
      return length;
    }
  }
  return -1;
}

/**
 * The base implementation of `_.get` without support for default values.
 *
 * @private
 * @param {Object} object The object to query.
 * @param {Array|string} path The path of the property to get.
 * @returns {*} Returns the resolved value.
 */
function baseGet(object, path) {
  path = isKey(path, object) ? [path] : castPath(path);

  var index = 0,
      length = path.length;

  while (object != null && index < length) {
    object = object[toKey(path[index++])];
  }
  return (index && index == length) ? object : undefined;
}

/**
 * The base implementation of `_.isNative` without bad shim checks.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a native function,
 *  else `false`.
 */
function baseIsNative$1(value) {
  if (!isObject$2(value) || isMasked$1(value)) {
    return false;
  }
  var pattern = (isFunction$1(value) || isHostObject$1(value)) ? reIsNative$1 : reIsHostCtor$1;
  return pattern.test(toSource$1(value));
}

/**
 * The base implementation of `_.toString` which doesn't convert nullish
 * values to empty strings.
 *
 * @private
 * @param {*} value The value to process.
 * @returns {string} Returns the string.
 */
function baseToString(value) {
  // Exit early for strings to avoid a performance hit in some environments.
  if (typeof value == 'string') {
    return value;
  }
  if (isSymbol(value)) {
    return symbolToString ? symbolToString.call(value) : '';
  }
  var result = (value + '');
  return (result == '0' && (1 / value) == -INFINITY$1) ? '-0' : result;
}

/**
 * Casts `value` to a path array if it's not one.
 *
 * @private
 * @param {*} value The value to inspect.
 * @returns {Array} Returns the cast property path array.
 */
function castPath(value) {
  return isArray(value) ? value : stringToPath(value);
}

/**
 * Gets the data for `map`.
 *
 * @private
 * @param {Object} map The map to query.
 * @param {string} key The reference key.
 * @returns {*} Returns the map data.
 */
function getMapData$1(map, key) {
  var data = map.__data__;
  return isKeyable$1(key)
    ? data[typeof key == 'string' ? 'string' : 'hash']
    : data.map;
}

/**
 * Gets the native function at `key` of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @param {string} key The key of the method to get.
 * @returns {*} Returns the function if it's native, else `undefined`.
 */
function getNative$1(object, key) {
  var value = getValue$1(object, key);
  return baseIsNative$1(value) ? value : undefined;
}

/**
 * Checks if `value` is a property name and not a property path.
 *
 * @private
 * @param {*} value The value to check.
 * @param {Object} [object] The object to query keys on.
 * @returns {boolean} Returns `true` if `value` is a property name, else `false`.
 */
function isKey(value, object) {
  if (isArray(value)) {
    return false;
  }
  var type = typeof value;
  if (type == 'number' || type == 'symbol' || type == 'boolean' ||
      value == null || isSymbol(value)) {
    return true;
  }
  return reIsPlainProp.test(value) || !reIsDeepProp.test(value) ||
    (object != null && value in Object(object));
}

/**
 * Checks if `value` is suitable for use as unique object key.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is suitable, else `false`.
 */
function isKeyable$1(value) {
  var type = typeof value;
  return (type == 'string' || type == 'number' || type == 'symbol' || type == 'boolean')
    ? (value !== '__proto__')
    : (value === null);
}

/**
 * Checks if `func` has its source masked.
 *
 * @private
 * @param {Function} func The function to check.
 * @returns {boolean} Returns `true` if `func` is masked, else `false`.
 */
function isMasked$1(func) {
  return !!maskSrcKey$1 && (maskSrcKey$1 in func);
}

/**
 * Converts `string` to a property path array.
 *
 * @private
 * @param {string} string The string to convert.
 * @returns {Array} Returns the property path array.
 */
var stringToPath = memoize(function(string) {
  string = toString$1(string);

  var result = [];
  if (reLeadingDot.test(string)) {
    result.push('');
  }
  string.replace(rePropName, function(match, number, quote, string) {
    result.push(quote ? string.replace(reEscapeChar, '$1') : (number || match));
  });
  return result;
});

/**
 * Converts `value` to a string key if it's not a string or symbol.
 *
 * @private
 * @param {*} value The value to inspect.
 * @returns {string|symbol} Returns the key.
 */
function toKey(value) {
  if (typeof value == 'string' || isSymbol(value)) {
    return value;
  }
  var result = (value + '');
  return (result == '0' && (1 / value) == -INFINITY$1) ? '-0' : result;
}

/**
 * Converts `func` to its source code.
 *
 * @private
 * @param {Function} func The function to process.
 * @returns {string} Returns the source code.
 */
function toSource$1(func) {
  if (func != null) {
    try {
      return funcToString$1.call(func);
    } catch (e) {}
    try {
      return (func + '');
    } catch (e) {}
  }
  return '';
}

/**
 * Creates a function that memoizes the result of `func`. If `resolver` is
 * provided, it determines the cache key for storing the result based on the
 * arguments provided to the memoized function. By default, the first argument
 * provided to the memoized function is used as the map cache key. The `func`
 * is invoked with the `this` binding of the memoized function.
 *
 * **Note:** The cache is exposed as the `cache` property on the memoized
 * function. Its creation may be customized by replacing the `_.memoize.Cache`
 * constructor with one whose instances implement the
 * [`Map`](http://ecma-international.org/ecma-262/7.0/#sec-properties-of-the-map-prototype-object)
 * method interface of `delete`, `get`, `has`, and `set`.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Function
 * @param {Function} func The function to have its output memoized.
 * @param {Function} [resolver] The function to resolve the cache key.
 * @returns {Function} Returns the new memoized function.
 * @example
 *
 * var object = { 'a': 1, 'b': 2 };
 * var other = { 'c': 3, 'd': 4 };
 *
 * var values = _.memoize(_.values);
 * values(object);
 * // => [1, 2]
 *
 * values(other);
 * // => [3, 4]
 *
 * object.a = 2;
 * values(object);
 * // => [1, 2]
 *
 * // Modify the result cache.
 * values.cache.set(object, ['a', 'b']);
 * values(object);
 * // => ['a', 'b']
 *
 * // Replace `_.memoize.Cache`.
 * _.memoize.Cache = WeakMap;
 */
function memoize(func, resolver) {
  if (typeof func != 'function' || (resolver && typeof resolver != 'function')) {
    throw new TypeError(FUNC_ERROR_TEXT);
  }
  var memoized = function() {
    var args = arguments,
        key = resolver ? resolver.apply(this, args) : args[0],
        cache = memoized.cache;

    if (cache.has(key)) {
      return cache.get(key);
    }
    var result = func.apply(this, args);
    memoized.cache = cache.set(key, result);
    return result;
  };
  memoized.cache = new (memoize.Cache || MapCache$1);
  return memoized;
}

// Assign cache to `_.memoize`.
memoize.Cache = MapCache$1;

/**
 * Performs a
 * [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
 * comparison between two values to determine if they are equivalent.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to compare.
 * @param {*} other The other value to compare.
 * @returns {boolean} Returns `true` if the values are equivalent, else `false`.
 * @example
 *
 * var object = { 'a': 1 };
 * var other = { 'a': 1 };
 *
 * _.eq(object, object);
 * // => true
 *
 * _.eq(object, other);
 * // => false
 *
 * _.eq('a', 'a');
 * // => true
 *
 * _.eq('a', Object('a'));
 * // => false
 *
 * _.eq(NaN, NaN);
 * // => true
 */
function eq$1(value, other) {
  return value === other || (value !== value && other !== other);
}

/**
 * Checks if `value` is classified as an `Array` object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an array, else `false`.
 * @example
 *
 * _.isArray([1, 2, 3]);
 * // => true
 *
 * _.isArray(document.body.children);
 * // => false
 *
 * _.isArray('abc');
 * // => false
 *
 * _.isArray(_.noop);
 * // => false
 */
var isArray = Array.isArray;

/**
 * Checks if `value` is classified as a `Function` object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a function, else `false`.
 * @example
 *
 * _.isFunction(_);
 * // => true
 *
 * _.isFunction(/abc/);
 * // => false
 */
function isFunction$1(value) {
  // The use of `Object#toString` avoids issues with the `typeof` operator
  // in Safari 8-9 which returns 'object' for typed array and other constructors.
  var tag = isObject$2(value) ? objectToString$1.call(value) : '';
  return tag == funcTag$1 || tag == genTag$1;
}

/**
 * Checks if `value` is the
 * [language type](http://www.ecma-international.org/ecma-262/7.0/#sec-ecmascript-language-types)
 * of `Object`. (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an object, else `false`.
 * @example
 *
 * _.isObject({});
 * // => true
 *
 * _.isObject([1, 2, 3]);
 * // => true
 *
 * _.isObject(_.noop);
 * // => true
 *
 * _.isObject(null);
 * // => false
 */
function isObject$2(value) {
  var type = typeof value;
  return !!value && (type == 'object' || type == 'function');
}

/**
 * Checks if `value` is object-like. A value is object-like if it's not `null`
 * and has a `typeof` result of "object".
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
 * @example
 *
 * _.isObjectLike({});
 * // => true
 *
 * _.isObjectLike([1, 2, 3]);
 * // => true
 *
 * _.isObjectLike(_.noop);
 * // => false
 *
 * _.isObjectLike(null);
 * // => false
 */
function isObjectLike(value) {
  return !!value && typeof value == 'object';
}

/**
 * Checks if `value` is classified as a `Symbol` primitive or object.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a symbol, else `false`.
 * @example
 *
 * _.isSymbol(Symbol.iterator);
 * // => true
 *
 * _.isSymbol('abc');
 * // => false
 */
function isSymbol(value) {
  return typeof value == 'symbol' ||
    (isObjectLike(value) && objectToString$1.call(value) == symbolTag);
}

/**
 * Converts `value` to a string. An empty string is returned for `null`
 * and `undefined` values. The sign of `-0` is preserved.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to process.
 * @returns {string} Returns the string.
 * @example
 *
 * _.toString(null);
 * // => ''
 *
 * _.toString(-0);
 * // => '-0'
 *
 * _.toString([1, 2, 3]);
 * // => '1,2,3'
 */
function toString$1(value) {
  return value == null ? '' : baseToString(value);
}

/**
 * Gets the value at `path` of `object`. If the resolved value is
 * `undefined`, the `defaultValue` is returned in its place.
 *
 * @static
 * @memberOf _
 * @since 3.7.0
 * @category Object
 * @param {Object} object The object to query.
 * @param {Array|string} path The path of the property to get.
 * @param {*} [defaultValue] The value returned for `undefined` resolved values.
 * @returns {*} Returns the resolved value.
 * @example
 *
 * var object = { 'a': [{ 'b': { 'c': 3 } }] };
 *
 * _.get(object, 'a[0].b.c');
 * // => 3
 *
 * _.get(object, ['a', '0', 'b', 'c']);
 * // => 3
 *
 * _.get(object, 'a.b.c', 'default');
 * // => 'default'
 */
function get(object, path, defaultValue) {
  var result = object == null ? undefined : baseGet(object, path);
  return result === undefined ? defaultValue : result;
}

var lodash_get = get;

/**
 * lodash (Custom Build) <https://lodash.com/>
 * Build: `lodash modularize exports="npm" -o ./`
 * Copyright jQuery Foundation and other contributors <https://jquery.org/>
 * Released under MIT license <https://lodash.com/license>
 * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
 * Copyright Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 */

/** Used as the `TypeError` message for "Functions" methods. */
var FUNC_ERROR_TEXT$1 = 'Expected a function';

/** Used to stand-in for `undefined` hash values. */
var HASH_UNDEFINED$2 = '__lodash_hash_undefined__';

/** Used as references for various `Number` constants. */
var INFINITY$2 = 1 / 0,
    MAX_SAFE_INTEGER = 9007199254740991;

/** `Object#toString` result references. */
var funcTag$2 = '[object Function]',
    genTag$2 = '[object GeneratorFunction]',
    symbolTag$1 = '[object Symbol]';

/** Used to match property names within property paths. */
var reIsDeepProp$1 = /\.|\[(?:[^[\]]*|(["'])(?:(?!\1)[^\\]|\\.)*?\1)\]/,
    reIsPlainProp$1 = /^\w*$/,
    reLeadingDot$1 = /^\./,
    rePropName$1 = /[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|$))/g;

/**
 * Used to match `RegExp`
 * [syntax characters](http://ecma-international.org/ecma-262/7.0/#sec-patterns).
 */
var reRegExpChar$2 = /[\\^$.*+?()[\]{}|]/g;

/** Used to match backslashes in property paths. */
var reEscapeChar$1 = /\\(\\)?/g;

/** Used to detect host constructors (Safari). */
var reIsHostCtor$2 = /^\[object .+?Constructor\]$/;

/** Used to detect unsigned integer values. */
var reIsUint = /^(?:0|[1-9]\d*)$/;

/** Detect free variable `global` from Node.js. */
var freeGlobal$2 = typeof commonjsGlobal == 'object' && commonjsGlobal && commonjsGlobal.Object === Object && commonjsGlobal;

/** Detect free variable `self`. */
var freeSelf$2 = typeof self == 'object' && self && self.Object === Object && self;

/** Used as a reference to the global object. */
var root$2 = freeGlobal$2 || freeSelf$2 || Function('return this')();

/**
 * Gets the value at `key` of `object`.
 *
 * @private
 * @param {Object} [object] The object to query.
 * @param {string} key The key of the property to get.
 * @returns {*} Returns the property value.
 */
function getValue$2(object, key) {
  return object == null ? undefined : object[key];
}

/**
 * Checks if `value` is a host object in IE < 9.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a host object, else `false`.
 */
function isHostObject$2(value) {
  // Many host objects are `Object` objects that can coerce to strings
  // despite having improperly defined `toString` methods.
  var result = false;
  if (value != null && typeof value.toString != 'function') {
    try {
      result = !!(value + '');
    } catch (e) {}
  }
  return result;
}

/** Used for built-in method references. */
var arrayProto$2 = Array.prototype,
    funcProto$2 = Function.prototype,
    objectProto$2 = Object.prototype;

/** Used to detect overreaching core-js shims. */
var coreJsData$2 = root$2['__core-js_shared__'];

/** Used to detect methods masquerading as native. */
var maskSrcKey$2 = (function() {
  var uid = /[^.]+$/.exec(coreJsData$2 && coreJsData$2.keys && coreJsData$2.keys.IE_PROTO || '');
  return uid ? ('Symbol(src)_1.' + uid) : '';
}());

/** Used to resolve the decompiled source of functions. */
var funcToString$2 = funcProto$2.toString;

/** Used to check objects for own properties. */
var hasOwnProperty$2 = objectProto$2.hasOwnProperty;

/**
 * Used to resolve the
 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
 * of values.
 */
var objectToString$2 = objectProto$2.toString;

/** Used to detect if a method is native. */
var reIsNative$2 = RegExp('^' +
  funcToString$2.call(hasOwnProperty$2).replace(reRegExpChar$2, '\\$&')
  .replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, '$1.*?') + '$'
);

/** Built-in value references. */
var Symbol$2 = root$2.Symbol,
    splice$2 = arrayProto$2.splice;

/* Built-in method references that are verified to be native. */
var Map$3 = getNative$2(root$2, 'Map'),
    nativeCreate$2 = getNative$2(Object, 'create');

/** Used to convert symbols to primitives and strings. */
var symbolProto$1 = Symbol$2 ? Symbol$2.prototype : undefined,
    symbolToString$1 = symbolProto$1 ? symbolProto$1.toString : undefined;

/**
 * Creates a hash object.
 *
 * @private
 * @constructor
 * @param {Array} [entries] The key-value pairs to cache.
 */
function Hash$2(entries) {
  var index = -1,
      length = entries ? entries.length : 0;

  this.clear();
  while (++index < length) {
    var entry = entries[index];
    this.set(entry[0], entry[1]);
  }
}

/**
 * Removes all key-value entries from the hash.
 *
 * @private
 * @name clear
 * @memberOf Hash
 */
function hashClear$2() {
  this.__data__ = nativeCreate$2 ? nativeCreate$2(null) : {};
}

/**
 * Removes `key` and its value from the hash.
 *
 * @private
 * @name delete
 * @memberOf Hash
 * @param {Object} hash The hash to modify.
 * @param {string} key The key of the value to remove.
 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
 */
function hashDelete$2(key) {
  return this.has(key) && delete this.__data__[key];
}

/**
 * Gets the hash value for `key`.
 *
 * @private
 * @name get
 * @memberOf Hash
 * @param {string} key The key of the value to get.
 * @returns {*} Returns the entry value.
 */
function hashGet$2(key) {
  var data = this.__data__;
  if (nativeCreate$2) {
    var result = data[key];
    return result === HASH_UNDEFINED$2 ? undefined : result;
  }
  return hasOwnProperty$2.call(data, key) ? data[key] : undefined;
}

/**
 * Checks if a hash value for `key` exists.
 *
 * @private
 * @name has
 * @memberOf Hash
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function hashHas$2(key) {
  var data = this.__data__;
  return nativeCreate$2 ? data[key] !== undefined : hasOwnProperty$2.call(data, key);
}

/**
 * Sets the hash `key` to `value`.
 *
 * @private
 * @name set
 * @memberOf Hash
 * @param {string} key The key of the value to set.
 * @param {*} value The value to set.
 * @returns {Object} Returns the hash instance.
 */
function hashSet$2(key, value) {
  var data = this.__data__;
  data[key] = (nativeCreate$2 && value === undefined) ? HASH_UNDEFINED$2 : value;
  return this;
}

// Add methods to `Hash`.
Hash$2.prototype.clear = hashClear$2;
Hash$2.prototype['delete'] = hashDelete$2;
Hash$2.prototype.get = hashGet$2;
Hash$2.prototype.has = hashHas$2;
Hash$2.prototype.set = hashSet$2;

/**
 * Creates an list cache object.
 *
 * @private
 * @constructor
 * @param {Array} [entries] The key-value pairs to cache.
 */
function ListCache$2(entries) {
  var index = -1,
      length = entries ? entries.length : 0;

  this.clear();
  while (++index < length) {
    var entry = entries[index];
    this.set(entry[0], entry[1]);
  }
}

/**
 * Removes all key-value entries from the list cache.
 *
 * @private
 * @name clear
 * @memberOf ListCache
 */
function listCacheClear$2() {
  this.__data__ = [];
}

/**
 * Removes `key` and its value from the list cache.
 *
 * @private
 * @name delete
 * @memberOf ListCache
 * @param {string} key The key of the value to remove.
 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
 */
function listCacheDelete$2(key) {
  var data = this.__data__,
      index = assocIndexOf$2(data, key);

  if (index < 0) {
    return false;
  }
  var lastIndex = data.length - 1;
  if (index == lastIndex) {
    data.pop();
  } else {
    splice$2.call(data, index, 1);
  }
  return true;
}

/**
 * Gets the list cache value for `key`.
 *
 * @private
 * @name get
 * @memberOf ListCache
 * @param {string} key The key of the value to get.
 * @returns {*} Returns the entry value.
 */
function listCacheGet$2(key) {
  var data = this.__data__,
      index = assocIndexOf$2(data, key);

  return index < 0 ? undefined : data[index][1];
}

/**
 * Checks if a list cache value for `key` exists.
 *
 * @private
 * @name has
 * @memberOf ListCache
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function listCacheHas$2(key) {
  return assocIndexOf$2(this.__data__, key) > -1;
}

/**
 * Sets the list cache `key` to `value`.
 *
 * @private
 * @name set
 * @memberOf ListCache
 * @param {string} key The key of the value to set.
 * @param {*} value The value to set.
 * @returns {Object} Returns the list cache instance.
 */
function listCacheSet$2(key, value) {
  var data = this.__data__,
      index = assocIndexOf$2(data, key);

  if (index < 0) {
    data.push([key, value]);
  } else {
    data[index][1] = value;
  }
  return this;
}

// Add methods to `ListCache`.
ListCache$2.prototype.clear = listCacheClear$2;
ListCache$2.prototype['delete'] = listCacheDelete$2;
ListCache$2.prototype.get = listCacheGet$2;
ListCache$2.prototype.has = listCacheHas$2;
ListCache$2.prototype.set = listCacheSet$2;

/**
 * Creates a map cache object to store key-value pairs.
 *
 * @private
 * @constructor
 * @param {Array} [entries] The key-value pairs to cache.
 */
function MapCache$2(entries) {
  var index = -1,
      length = entries ? entries.length : 0;

  this.clear();
  while (++index < length) {
    var entry = entries[index];
    this.set(entry[0], entry[1]);
  }
}

/**
 * Removes all key-value entries from the map.
 *
 * @private
 * @name clear
 * @memberOf MapCache
 */
function mapCacheClear$2() {
  this.__data__ = {
    'hash': new Hash$2,
    'map': new (Map$3 || ListCache$2),
    'string': new Hash$2
  };
}

/**
 * Removes `key` and its value from the map.
 *
 * @private
 * @name delete
 * @memberOf MapCache
 * @param {string} key The key of the value to remove.
 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
 */
function mapCacheDelete$2(key) {
  return getMapData$2(this, key)['delete'](key);
}

/**
 * Gets the map value for `key`.
 *
 * @private
 * @name get
 * @memberOf MapCache
 * @param {string} key The key of the value to get.
 * @returns {*} Returns the entry value.
 */
function mapCacheGet$2(key) {
  return getMapData$2(this, key).get(key);
}

/**
 * Checks if a map value for `key` exists.
 *
 * @private
 * @name has
 * @memberOf MapCache
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function mapCacheHas$2(key) {
  return getMapData$2(this, key).has(key);
}

/**
 * Sets the map `key` to `value`.
 *
 * @private
 * @name set
 * @memberOf MapCache
 * @param {string} key The key of the value to set.
 * @param {*} value The value to set.
 * @returns {Object} Returns the map cache instance.
 */
function mapCacheSet$2(key, value) {
  getMapData$2(this, key).set(key, value);
  return this;
}

// Add methods to `MapCache`.
MapCache$2.prototype.clear = mapCacheClear$2;
MapCache$2.prototype['delete'] = mapCacheDelete$2;
MapCache$2.prototype.get = mapCacheGet$2;
MapCache$2.prototype.has = mapCacheHas$2;
MapCache$2.prototype.set = mapCacheSet$2;

/**
 * Assigns `value` to `key` of `object` if the existing value is not equivalent
 * using [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
 * for equality comparisons.
 *
 * @private
 * @param {Object} object The object to modify.
 * @param {string} key The key of the property to assign.
 * @param {*} value The value to assign.
 */
function assignValue(object, key, value) {
  var objValue = object[key];
  if (!(hasOwnProperty$2.call(object, key) && eq$2(objValue, value)) ||
      (value === undefined && !(key in object))) {
    object[key] = value;
  }
}

/**
 * Gets the index at which the `key` is found in `array` of key-value pairs.
 *
 * @private
 * @param {Array} array The array to inspect.
 * @param {*} key The key to search for.
 * @returns {number} Returns the index of the matched value, else `-1`.
 */
function assocIndexOf$2(array, key) {
  var length = array.length;
  while (length--) {
    if (eq$2(array[length][0], key)) {
      return length;
    }
  }
  return -1;
}

/**
 * The base implementation of `_.isNative` without bad shim checks.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a native function,
 *  else `false`.
 */
function baseIsNative$2(value) {
  if (!isObject$3(value) || isMasked$2(value)) {
    return false;
  }
  var pattern = (isFunction$2(value) || isHostObject$2(value)) ? reIsNative$2 : reIsHostCtor$2;
  return pattern.test(toSource$2(value));
}

/**
 * The base implementation of `_.set`.
 *
 * @private
 * @param {Object} object The object to modify.
 * @param {Array|string} path The path of the property to set.
 * @param {*} value The value to set.
 * @param {Function} [customizer] The function to customize path creation.
 * @returns {Object} Returns `object`.
 */
function baseSet(object, path, value, customizer) {
  if (!isObject$3(object)) {
    return object;
  }
  path = isKey$1(path, object) ? [path] : castPath$1(path);

  var index = -1,
      length = path.length,
      lastIndex = length - 1,
      nested = object;

  while (nested != null && ++index < length) {
    var key = toKey$1(path[index]),
        newValue = value;

    if (index != lastIndex) {
      var objValue = nested[key];
      newValue = customizer ? customizer(objValue, key, nested) : undefined;
      if (newValue === undefined) {
        newValue = isObject$3(objValue)
          ? objValue
          : (isIndex(path[index + 1]) ? [] : {});
      }
    }
    assignValue(nested, key, newValue);
    nested = nested[key];
  }
  return object;
}

/**
 * The base implementation of `_.toString` which doesn't convert nullish
 * values to empty strings.
 *
 * @private
 * @param {*} value The value to process.
 * @returns {string} Returns the string.
 */
function baseToString$1(value) {
  // Exit early for strings to avoid a performance hit in some environments.
  if (typeof value == 'string') {
    return value;
  }
  if (isSymbol$1(value)) {
    return symbolToString$1 ? symbolToString$1.call(value) : '';
  }
  var result = (value + '');
  return (result == '0' && (1 / value) == -INFINITY$2) ? '-0' : result;
}

/**
 * Casts `value` to a path array if it's not one.
 *
 * @private
 * @param {*} value The value to inspect.
 * @returns {Array} Returns the cast property path array.
 */
function castPath$1(value) {
  return isArray$1(value) ? value : stringToPath$1(value);
}

/**
 * Gets the data for `map`.
 *
 * @private
 * @param {Object} map The map to query.
 * @param {string} key The reference key.
 * @returns {*} Returns the map data.
 */
function getMapData$2(map, key) {
  var data = map.__data__;
  return isKeyable$2(key)
    ? data[typeof key == 'string' ? 'string' : 'hash']
    : data.map;
}

/**
 * Gets the native function at `key` of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @param {string} key The key of the method to get.
 * @returns {*} Returns the function if it's native, else `undefined`.
 */
function getNative$2(object, key) {
  var value = getValue$2(object, key);
  return baseIsNative$2(value) ? value : undefined;
}

/**
 * Checks if `value` is a valid array-like index.
 *
 * @private
 * @param {*} value The value to check.
 * @param {number} [length=MAX_SAFE_INTEGER] The upper bounds of a valid index.
 * @returns {boolean} Returns `true` if `value` is a valid index, else `false`.
 */
function isIndex(value, length) {
  length = length == null ? MAX_SAFE_INTEGER : length;
  return !!length &&
    (typeof value == 'number' || reIsUint.test(value)) &&
    (value > -1 && value % 1 == 0 && value < length);
}

/**
 * Checks if `value` is a property name and not a property path.
 *
 * @private
 * @param {*} value The value to check.
 * @param {Object} [object] The object to query keys on.
 * @returns {boolean} Returns `true` if `value` is a property name, else `false`.
 */
function isKey$1(value, object) {
  if (isArray$1(value)) {
    return false;
  }
  var type = typeof value;
  if (type == 'number' || type == 'symbol' || type == 'boolean' ||
      value == null || isSymbol$1(value)) {
    return true;
  }
  return reIsPlainProp$1.test(value) || !reIsDeepProp$1.test(value) ||
    (object != null && value in Object(object));
}

/**
 * Checks if `value` is suitable for use as unique object key.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is suitable, else `false`.
 */
function isKeyable$2(value) {
  var type = typeof value;
  return (type == 'string' || type == 'number' || type == 'symbol' || type == 'boolean')
    ? (value !== '__proto__')
    : (value === null);
}

/**
 * Checks if `func` has its source masked.
 *
 * @private
 * @param {Function} func The function to check.
 * @returns {boolean} Returns `true` if `func` is masked, else `false`.
 */
function isMasked$2(func) {
  return !!maskSrcKey$2 && (maskSrcKey$2 in func);
}

/**
 * Converts `string` to a property path array.
 *
 * @private
 * @param {string} string The string to convert.
 * @returns {Array} Returns the property path array.
 */
var stringToPath$1 = memoize$1(function(string) {
  string = toString$2(string);

  var result = [];
  if (reLeadingDot$1.test(string)) {
    result.push('');
  }
  string.replace(rePropName$1, function(match, number, quote, string) {
    result.push(quote ? string.replace(reEscapeChar$1, '$1') : (number || match));
  });
  return result;
});

/**
 * Converts `value` to a string key if it's not a string or symbol.
 *
 * @private
 * @param {*} value The value to inspect.
 * @returns {string|symbol} Returns the key.
 */
function toKey$1(value) {
  if (typeof value == 'string' || isSymbol$1(value)) {
    return value;
  }
  var result = (value + '');
  return (result == '0' && (1 / value) == -INFINITY$2) ? '-0' : result;
}

/**
 * Converts `func` to its source code.
 *
 * @private
 * @param {Function} func The function to process.
 * @returns {string} Returns the source code.
 */
function toSource$2(func) {
  if (func != null) {
    try {
      return funcToString$2.call(func);
    } catch (e) {}
    try {
      return (func + '');
    } catch (e) {}
  }
  return '';
}

/**
 * Creates a function that memoizes the result of `func`. If `resolver` is
 * provided, it determines the cache key for storing the result based on the
 * arguments provided to the memoized function. By default, the first argument
 * provided to the memoized function is used as the map cache key. The `func`
 * is invoked with the `this` binding of the memoized function.
 *
 * **Note:** The cache is exposed as the `cache` property on the memoized
 * function. Its creation may be customized by replacing the `_.memoize.Cache`
 * constructor with one whose instances implement the
 * [`Map`](http://ecma-international.org/ecma-262/7.0/#sec-properties-of-the-map-prototype-object)
 * method interface of `delete`, `get`, `has`, and `set`.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Function
 * @param {Function} func The function to have its output memoized.
 * @param {Function} [resolver] The function to resolve the cache key.
 * @returns {Function} Returns the new memoized function.
 * @example
 *
 * var object = { 'a': 1, 'b': 2 };
 * var other = { 'c': 3, 'd': 4 };
 *
 * var values = _.memoize(_.values);
 * values(object);
 * // => [1, 2]
 *
 * values(other);
 * // => [3, 4]
 *
 * object.a = 2;
 * values(object);
 * // => [1, 2]
 *
 * // Modify the result cache.
 * values.cache.set(object, ['a', 'b']);
 * values(object);
 * // => ['a', 'b']
 *
 * // Replace `_.memoize.Cache`.
 * _.memoize.Cache = WeakMap;
 */
function memoize$1(func, resolver) {
  if (typeof func != 'function' || (resolver && typeof resolver != 'function')) {
    throw new TypeError(FUNC_ERROR_TEXT$1);
  }
  var memoized = function() {
    var args = arguments,
        key = resolver ? resolver.apply(this, args) : args[0],
        cache = memoized.cache;

    if (cache.has(key)) {
      return cache.get(key);
    }
    var result = func.apply(this, args);
    memoized.cache = cache.set(key, result);
    return result;
  };
  memoized.cache = new (memoize$1.Cache || MapCache$2);
  return memoized;
}

// Assign cache to `_.memoize`.
memoize$1.Cache = MapCache$2;

/**
 * Performs a
 * [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
 * comparison between two values to determine if they are equivalent.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to compare.
 * @param {*} other The other value to compare.
 * @returns {boolean} Returns `true` if the values are equivalent, else `false`.
 * @example
 *
 * var object = { 'a': 1 };
 * var other = { 'a': 1 };
 *
 * _.eq(object, object);
 * // => true
 *
 * _.eq(object, other);
 * // => false
 *
 * _.eq('a', 'a');
 * // => true
 *
 * _.eq('a', Object('a'));
 * // => false
 *
 * _.eq(NaN, NaN);
 * // => true
 */
function eq$2(value, other) {
  return value === other || (value !== value && other !== other);
}

/**
 * Checks if `value` is classified as an `Array` object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an array, else `false`.
 * @example
 *
 * _.isArray([1, 2, 3]);
 * // => true
 *
 * _.isArray(document.body.children);
 * // => false
 *
 * _.isArray('abc');
 * // => false
 *
 * _.isArray(_.noop);
 * // => false
 */
var isArray$1 = Array.isArray;

/**
 * Checks if `value` is classified as a `Function` object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a function, else `false`.
 * @example
 *
 * _.isFunction(_);
 * // => true
 *
 * _.isFunction(/abc/);
 * // => false
 */
function isFunction$2(value) {
  // The use of `Object#toString` avoids issues with the `typeof` operator
  // in Safari 8-9 which returns 'object' for typed array and other constructors.
  var tag = isObject$3(value) ? objectToString$2.call(value) : '';
  return tag == funcTag$2 || tag == genTag$2;
}

/**
 * Checks if `value` is the
 * [language type](http://www.ecma-international.org/ecma-262/7.0/#sec-ecmascript-language-types)
 * of `Object`. (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an object, else `false`.
 * @example
 *
 * _.isObject({});
 * // => true
 *
 * _.isObject([1, 2, 3]);
 * // => true
 *
 * _.isObject(_.noop);
 * // => true
 *
 * _.isObject(null);
 * // => false
 */
function isObject$3(value) {
  var type = typeof value;
  return !!value && (type == 'object' || type == 'function');
}

/**
 * Checks if `value` is object-like. A value is object-like if it's not `null`
 * and has a `typeof` result of "object".
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
 * @example
 *
 * _.isObjectLike({});
 * // => true
 *
 * _.isObjectLike([1, 2, 3]);
 * // => true
 *
 * _.isObjectLike(_.noop);
 * // => false
 *
 * _.isObjectLike(null);
 * // => false
 */
function isObjectLike$1(value) {
  return !!value && typeof value == 'object';
}

/**
 * Checks if `value` is classified as a `Symbol` primitive or object.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a symbol, else `false`.
 * @example
 *
 * _.isSymbol(Symbol.iterator);
 * // => true
 *
 * _.isSymbol('abc');
 * // => false
 */
function isSymbol$1(value) {
  return typeof value == 'symbol' ||
    (isObjectLike$1(value) && objectToString$2.call(value) == symbolTag$1);
}

/**
 * Converts `value` to a string. An empty string is returned for `null`
 * and `undefined` values. The sign of `-0` is preserved.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to process.
 * @returns {string} Returns the string.
 * @example
 *
 * _.toString(null);
 * // => ''
 *
 * _.toString(-0);
 * // => '-0'
 *
 * _.toString([1, 2, 3]);
 * // => '1,2,3'
 */
function toString$2(value) {
  return value == null ? '' : baseToString$1(value);
}

/**
 * Sets the value at `path` of `object`. If a portion of `path` doesn't exist,
 * it's created. Arrays are created for missing index properties while objects
 * are created for all other missing properties. Use `_.setWith` to customize
 * `path` creation.
 *
 * **Note:** This method mutates `object`.
 *
 * @static
 * @memberOf _
 * @since 3.7.0
 * @category Object
 * @param {Object} object The object to modify.
 * @param {Array|string} path The path of the property to set.
 * @param {*} value The value to set.
 * @returns {Object} Returns `object`.
 * @example
 *
 * var object = { 'a': [{ 'b': { 'c': 3 } }] };
 *
 * _.set(object, 'a[0].b.c', 4);
 * console.log(object.a[0].b.c);
 * // => 4
 *
 * _.set(object, ['x', '0', 'y', 'z'], 5);
 * console.log(object.x[0].y.z);
 * // => 5
 */
function set(object, path, value) {
  return object == null ? object : baseSet(object, path, value);
}

var lodash_set = set;

var validate_1 = validate$1;

const { RequestError: RequestError$4 } = distWeb$7;



function validate$1(octokit, options) {
  if (!options.request.validate) {
    return;
  }
  const { validate: params } = options.request;

  Object.keys(params).forEach(parameterName => {
    const parameter = lodash_get(params, parameterName);

    const expectedType = parameter.type;
    let parentParameterName;
    let parentValue;
    let parentParamIsPresent = true;
    let parentParameterIsArray = false;

    if (/\./.test(parameterName)) {
      parentParameterName = parameterName.replace(/\.[^.]+$/, "");
      parentParameterIsArray = parentParameterName.slice(-2) === "[]";
      if (parentParameterIsArray) {
        parentParameterName = parentParameterName.slice(0, -2);
      }
      parentValue = lodash_get(options, parentParameterName);
      parentParamIsPresent =
        parentParameterName === "headers" ||
        (typeof parentValue === "object" && parentValue !== null);
    }

    const values = parentParameterIsArray
      ? (lodash_get(options, parentParameterName) || []).map(
          value => value[parameterName.split(/\./).pop()]
        )
      : [lodash_get(options, parameterName)];

    values.forEach((value, i) => {
      const valueIsPresent = typeof value !== "undefined";
      const valueIsNull = value === null;
      const currentParameterName = parentParameterIsArray
        ? parameterName.replace(/\[\]/, `[${i}]`)
        : parameterName;

      if (!parameter.required && !valueIsPresent) {
        return;
      }

      // if the parent parameter is of type object but allows null
      // then the child parameters can be ignored
      if (!parentParamIsPresent) {
        return;
      }

      if (parameter.allowNull && valueIsNull) {
        return;
      }

      if (!parameter.allowNull && valueIsNull) {
        throw new RequestError$4(
          `'${currentParameterName}' cannot be null`,
          400,
          {
            request: options
          }
        );
      }

      if (parameter.required && !valueIsPresent) {
        throw new RequestError$4(
          `Empty value for parameter '${currentParameterName}': ${JSON.stringify(
            value
          )}`,
          400,
          {
            request: options
          }
        );
      }

      // parse to integer before checking for enum
      // so that string "1" will match enum with number 1
      if (expectedType === "integer") {
        const unparsedValue = value;
        value = parseInt(value, 10);
        if (isNaN(value)) {
          throw new RequestError$4(
            `Invalid value for parameter '${currentParameterName}': ${JSON.stringify(
              unparsedValue
            )} is NaN`,
            400,
            {
              request: options
            }
          );
        }
      }

      if (parameter.enum && parameter.enum.indexOf(String(value)) === -1) {
        throw new RequestError$4(
          `Invalid value for parameter '${currentParameterName}': ${JSON.stringify(
            value
          )}`,
          400,
          {
            request: options
          }
        );
      }

      if (parameter.validation) {
        const regex = new RegExp(parameter.validation);
        if (!regex.test(value)) {
          throw new RequestError$4(
            `Invalid value for parameter '${currentParameterName}': ${JSON.stringify(
              value
            )}`,
            400,
            {
              request: options
            }
          );
        }
      }

      if (expectedType === "object" && typeof value === "string") {
        try {
          value = JSON.parse(value);
        } catch (exception) {
          throw new RequestError$4(
            `JSON parse error of value for parameter '${currentParameterName}': ${JSON.stringify(
              value
            )}`,
            400,
            {
              request: options
            }
          );
        }
      }

      lodash_set(options, parameter.mapTo || currentParameterName, value);
    });
  });

  return options;
}

var validate_1$1 = octokitValidate;



function octokitValidate(octokit) {
  octokit.hook.before("request", validate_1.bind(null, octokit));
}

var deprecate_1 = deprecate;

const loggedMessages = {};

function deprecate (message) {
  if (loggedMessages[message]) {
    return
  }

  console.warn(`DEPRECATED (@octokit/rest): ${message}`);
  loggedMessages[message] = 1;
}

var getPageLinks_1 = getPageLinks;

function getPageLinks (link) {
  link = link.link || link.headers.link || '';

  const links = {};

  // link format:
  // '<https://api.github.com/users/aseemk/followers?page=2>; rel="next", <https://api.github.com/users/aseemk/followers?page=2>; rel="last"'
  link.replace(/<([^>]*)>;\s*rel="([\w]*)"/g, (m, uri, type) => {
    links[type] = uri;
  });

  return links
}

var httpError = class HttpError extends Error {
  constructor (message, code, headers) {
    super(message);

    // Maintains proper stack trace (only available on V8)
    /* istanbul ignore next */
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }

    this.name = 'HttpError';
    this.code = code;
    this.headers = headers;
  }
};

var getPage_1 = getPage;





function getPage (octokit, link, which, headers) {
  deprecate_1(`octokit.get${which.charAt(0).toUpperCase() + which.slice(1)}Page() – You can use octokit.paginate or async iterators instead: https://github.com/octokit/rest.js#pagination.`);
  const url = getPageLinks_1(link)[which];

  if (!url) {
    const urlError = new httpError(`No ${which} page found`, 404);
    return Promise.reject(urlError)
  }

  const requestOptions = {
    url,
    headers: applyAcceptHeader(link, headers)
  };

  const promise = octokit.request(requestOptions);

  return promise
}

function applyAcceptHeader (res, headers) {
  const previous = res.headers && res.headers['x-github-media-type'];

  if (!previous || (headers && headers.accept)) {
    return headers
  }
  headers = headers || {};
  headers.accept = 'application/vnd.' + previous
    .replace('; param=', '.')
    .replace('; format=', '+');

  return headers
}

var getFirstPage_1 = getFirstPage;



function getFirstPage (octokit, link, headers) {
  return getPage_1(octokit, link, 'first', headers)
}

var getLastPage_1 = getLastPage;



function getLastPage (octokit, link, headers) {
  return getPage_1(octokit, link, 'last', headers)
}

var getNextPage_1 = getNextPage;



function getNextPage (octokit, link, headers) {
  return getPage_1(octokit, link, 'next', headers)
}

var getPreviousPage_1 = getPreviousPage;



function getPreviousPage (octokit, link, headers) {
  return getPage_1(octokit, link, 'prev', headers)
}

var hasFirstPage_1 = hasFirstPage;




function hasFirstPage (link) {
  deprecate_1(`octokit.hasFirstPage() – You can use octokit.paginate or async iterators instead: https://github.com/octokit/rest.js#pagination.`);
  return getPageLinks_1(link).first
}

var hasLastPage_1 = hasLastPage;




function hasLastPage (link) {
  deprecate_1(`octokit.hasLastPage() – You can use octokit.paginate or async iterators instead: https://github.com/octokit/rest.js#pagination.`);
  return getPageLinks_1(link).last
}

var hasNextPage_1 = hasNextPage;




function hasNextPage (link) {
  deprecate_1(`octokit.hasNextPage() – You can use octokit.paginate or async iterators instead: https://github.com/octokit/rest.js#pagination.`);
  return getPageLinks_1(link).next
}

var hasPreviousPage_1 = hasPreviousPage;




function hasPreviousPage (link) {
  deprecate_1(`octokit.hasPreviousPage() – You can use octokit.paginate or async iterators instead: https://github.com/octokit/rest.js#pagination.`);
  return getPageLinks_1(link).prev
}

var octokitPaginationMethods = paginationMethodsPlugin;

function paginationMethodsPlugin (octokit) {
  octokit.getFirstPage = getFirstPage_1.bind(null, octokit);
  octokit.getLastPage = getLastPage_1.bind(null, octokit);
  octokit.getNextPage = getNextPage_1.bind(null, octokit);
  octokit.getPreviousPage = getPreviousPage_1.bind(null, octokit);
  octokit.hasFirstPage = hasFirstPage_1;
  octokit.hasLastPage = hasLastPage_1;
  octokit.hasNextPage = hasNextPage_1;
  octokit.hasPreviousPage = hasPreviousPage_1;
}

const { requestLog: requestLog$1 } = distWeb$4;
const {
  restEndpointMethods: restEndpointMethods$2
} = distWeb$5;



const CORE_PLUGINS = [
  authentication,
  authenticationDeprecated, // deprecated: remove in v17
  requestLog$1,
  pagination,
  restEndpointMethods$2,
  validate_1$1,

  octokitPaginationMethods // deprecated: remove in v17
];

const OctokitRest = core$3.plugin(CORE_PLUGINS);

function DeprecatedOctokit(options) {
  const warn =
    options && options.log && options.log.warn
      ? options.log.warn
      : console.warn;
  warn(
    '[@octokit/rest] `const Octokit = require("@octokit/rest")` is deprecated. Use `const { Octokit } = require("@octokit/rest")` instead'
  );
  return new OctokitRest(options);
}

const Octokit$3 = Object.assign(DeprecatedOctokit, {
  Octokit: OctokitRest
});

Object.keys(OctokitRest).forEach(key => {
  /* istanbul ignore else */
  if (OctokitRest.hasOwnProperty(key)) {
    Octokit$3[key] = OctokitRest[key];
  }
});

var rest = Octokit$3;

var context = createCommonjsModule(function (module, exports) {
Object.defineProperty(exports, "__esModule", { value: true });


class Context {
    /**
     * Hydrate the context from the environment
     */
    constructor() {
        this.payload = {};
        if (process.env.GITHUB_EVENT_PATH) {
            if (fs__default['default'].existsSync(process.env.GITHUB_EVENT_PATH)) {
                this.payload = JSON.parse(fs__default['default'].readFileSync(process.env.GITHUB_EVENT_PATH, { encoding: 'utf8' }));
            }
            else {
                const path = process.env.GITHUB_EVENT_PATH;
                process.stdout.write(`GITHUB_EVENT_PATH ${path} does not exist${require$$0__default$1['default'].EOL}`);
            }
        }
        this.eventName = process.env.GITHUB_EVENT_NAME;
        this.sha = process.env.GITHUB_SHA;
        this.ref = process.env.GITHUB_REF;
        this.workflow = process.env.GITHUB_WORKFLOW;
        this.action = process.env.GITHUB_ACTION;
        this.actor = process.env.GITHUB_ACTOR;
    }
    get issue() {
        const payload = this.payload;
        return Object.assign(Object.assign({}, this.repo), { number: (payload.issue || payload.pull_request || payload).number });
    }
    get repo() {
        if (process.env.GITHUB_REPOSITORY) {
            const [owner, repo] = process.env.GITHUB_REPOSITORY.split('/');
            return { owner, repo };
        }
        if (this.payload.repository) {
            return {
                owner: this.payload.repository.owner.login,
                repo: this.payload.repository.name
            };
        }
        throw new Error("context.repo requires a GITHUB_REPOSITORY environment variable like 'owner/repo'");
    }
}
exports.Context = Context;

});

var proxy = createCommonjsModule(function (module, exports) {
Object.defineProperty(exports, "__esModule", { value: true });

function getProxyUrl(reqUrl) {
    let usingSsl = reqUrl.protocol === 'https:';
    let proxyUrl;
    if (checkBypass(reqUrl)) {
        return proxyUrl;
    }
    let proxyVar;
    if (usingSsl) {
        proxyVar = process.env['https_proxy'] || process.env['HTTPS_PROXY'];
    }
    else {
        proxyVar = process.env['http_proxy'] || process.env['HTTP_PROXY'];
    }
    if (proxyVar) {
        proxyUrl = url__default['default'].parse(proxyVar);
    }
    return proxyUrl;
}
exports.getProxyUrl = getProxyUrl;
function checkBypass(reqUrl) {
    if (!reqUrl.hostname) {
        return false;
    }
    let noProxy = process.env['no_proxy'] || process.env['NO_PROXY'] || '';
    if (!noProxy) {
        return false;
    }
    // Determine the request port
    let reqPort;
    if (reqUrl.port) {
        reqPort = Number(reqUrl.port);
    }
    else if (reqUrl.protocol === 'http:') {
        reqPort = 80;
    }
    else if (reqUrl.protocol === 'https:') {
        reqPort = 443;
    }
    // Format the request hostname and hostname with port
    let upperReqHosts = [reqUrl.hostname.toUpperCase()];
    if (typeof reqPort === 'number') {
        upperReqHosts.push(`${upperReqHosts[0]}:${reqPort}`);
    }
    // Compare request host against noproxy
    for (let upperNoProxyItem of noProxy
        .split(',')
        .map(x => x.trim().toUpperCase())
        .filter(x => x)) {
        if (upperReqHosts.some(x => x === upperNoProxyItem)) {
            return true;
        }
    }
    return false;
}
exports.checkBypass = checkBypass;
});

var httpOverHttp_1 = httpOverHttp;
var httpsOverHttp_1 = httpsOverHttp;
var httpOverHttps_1 = httpOverHttps;
var httpsOverHttps_1 = httpsOverHttps;


function httpOverHttp(options) {
  var agent = new TunnelingAgent(options);
  agent.request = http__default['default'].request;
  return agent;
}

function httpsOverHttp(options) {
  var agent = new TunnelingAgent(options);
  agent.request = http__default['default'].request;
  agent.createSocket = createSecureSocket;
  agent.defaultPort = 443;
  return agent;
}

function httpOverHttps(options) {
  var agent = new TunnelingAgent(options);
  agent.request = https__default['default'].request;
  return agent;
}

function httpsOverHttps(options) {
  var agent = new TunnelingAgent(options);
  agent.request = https__default['default'].request;
  agent.createSocket = createSecureSocket;
  agent.defaultPort = 443;
  return agent;
}


function TunnelingAgent(options) {
  var self = this;
  self.options = options || {};
  self.proxyOptions = self.options.proxy || {};
  self.maxSockets = self.options.maxSockets || http__default['default'].Agent.defaultMaxSockets;
  self.requests = [];
  self.sockets = [];

  self.on('free', function onFree(socket, host, port, localAddress) {
    var options = toOptions(host, port, localAddress);
    for (var i = 0, len = self.requests.length; i < len; ++i) {
      var pending = self.requests[i];
      if (pending.host === options.host && pending.port === options.port) {
        // Detect the request to connect same origin server,
        // reuse the connection.
        self.requests.splice(i, 1);
        pending.request.onSocket(socket);
        return;
      }
    }
    socket.destroy();
    self.removeSocket(socket);
  });
}
util__default['default'].inherits(TunnelingAgent, require$$1__default['default'].EventEmitter);

TunnelingAgent.prototype.addRequest = function addRequest(req, host, port, localAddress) {
  var self = this;
  var options = mergeOptions({request: req}, self.options, toOptions(host, port, localAddress));

  if (self.sockets.length >= this.maxSockets) {
    // We are over limit so we'll add it to the queue.
    self.requests.push(options);
    return;
  }

  // If we are under maxSockets create a new one.
  self.createSocket(options, function(socket) {
    socket.on('free', onFree);
    socket.on('close', onCloseOrRemove);
    socket.on('agentRemove', onCloseOrRemove);
    req.onSocket(socket);

    function onFree() {
      self.emit('free', socket, options);
    }

    function onCloseOrRemove(err) {
      self.removeSocket(socket);
      socket.removeListener('free', onFree);
      socket.removeListener('close', onCloseOrRemove);
      socket.removeListener('agentRemove', onCloseOrRemove);
    }
  });
};

TunnelingAgent.prototype.createSocket = function createSocket(options, cb) {
  var self = this;
  var placeholder = {};
  self.sockets.push(placeholder);

  var connectOptions = mergeOptions({}, self.proxyOptions, {
    method: 'CONNECT',
    path: options.host + ':' + options.port,
    agent: false,
    headers: {
      host: options.host + ':' + options.port
    }
  });
  if (options.localAddress) {
    connectOptions.localAddress = options.localAddress;
  }
  if (connectOptions.proxyAuth) {
    connectOptions.headers = connectOptions.headers || {};
    connectOptions.headers['Proxy-Authorization'] = 'Basic ' +
        new Buffer(connectOptions.proxyAuth).toString('base64');
  }

  debug('making CONNECT request');
  var connectReq = self.request(connectOptions);
  connectReq.useChunkedEncodingByDefault = false; // for v0.6
  connectReq.once('response', onResponse); // for v0.6
  connectReq.once('upgrade', onUpgrade);   // for v0.6
  connectReq.once('connect', onConnect);   // for v0.7 or later
  connectReq.once('error', onError);
  connectReq.end();

  function onResponse(res) {
    // Very hacky. This is necessary to avoid http-parser leaks.
    res.upgrade = true;
  }

  function onUpgrade(res, socket, head) {
    // Hacky.
    process.nextTick(function() {
      onConnect(res, socket, head);
    });
  }

  function onConnect(res, socket, head) {
    connectReq.removeAllListeners();
    socket.removeAllListeners();

    if (res.statusCode !== 200) {
      debug('tunneling socket could not be established, statusCode=%d',
        res.statusCode);
      socket.destroy();
      var error = new Error('tunneling socket could not be established, ' +
        'statusCode=' + res.statusCode);
      error.code = 'ECONNRESET';
      options.request.emit('error', error);
      self.removeSocket(placeholder);
      return;
    }
    if (head.length > 0) {
      debug('got illegal response body from proxy');
      socket.destroy();
      var error = new Error('got illegal response body from proxy');
      error.code = 'ECONNRESET';
      options.request.emit('error', error);
      self.removeSocket(placeholder);
      return;
    }
    debug('tunneling connection has established');
    self.sockets[self.sockets.indexOf(placeholder)] = socket;
    return cb(socket);
  }

  function onError(cause) {
    connectReq.removeAllListeners();

    debug('tunneling socket could not be established, cause=%s\n',
          cause.message, cause.stack);
    var error = new Error('tunneling socket could not be established, ' +
                          'cause=' + cause.message);
    error.code = 'ECONNRESET';
    options.request.emit('error', error);
    self.removeSocket(placeholder);
  }
};

TunnelingAgent.prototype.removeSocket = function removeSocket(socket) {
  var pos = this.sockets.indexOf(socket);
  if (pos === -1) {
    return;
  }
  this.sockets.splice(pos, 1);

  var pending = this.requests.shift();
  if (pending) {
    // If we have pending requests and a socket gets closed a new one
    // needs to be created to take over in the pool for the one that closed.
    this.createSocket(pending, function(socket) {
      pending.request.onSocket(socket);
    });
  }
};

function createSecureSocket(options, cb) {
  var self = this;
  TunnelingAgent.prototype.createSocket.call(self, options, function(socket) {
    var hostHeader = options.request.getHeader('host');
    var tlsOptions = mergeOptions({}, self.options, {
      socket: socket,
      servername: hostHeader ? hostHeader.replace(/:.*$/, '') : options.host
    });

    // 0 is dummy port for v0.6
    var secureSocket = tls__default['default'].connect(0, tlsOptions);
    self.sockets[self.sockets.indexOf(socket)] = secureSocket;
    cb(secureSocket);
  });
}


function toOptions(host, port, localAddress) {
  if (typeof host === 'string') { // since v0.10
    return {
      host: host,
      port: port,
      localAddress: localAddress
    };
  }
  return host; // for v0.11 or later
}

function mergeOptions(target) {
  for (var i = 1, len = arguments.length; i < len; ++i) {
    var overrides = arguments[i];
    if (typeof overrides === 'object') {
      var keys = Object.keys(overrides);
      for (var j = 0, keyLen = keys.length; j < keyLen; ++j) {
        var k = keys[j];
        if (overrides[k] !== undefined) {
          target[k] = overrides[k];
        }
      }
    }
  }
  return target;
}


var debug;
if (process.env.NODE_DEBUG && /\btunnel\b/.test(process.env.NODE_DEBUG)) {
  debug = function() {
    var args = Array.prototype.slice.call(arguments);
    if (typeof args[0] === 'string') {
      args[0] = 'TUNNEL: ' + args[0];
    } else {
      args.unshift('TUNNEL:');
    }
    console.error.apply(console, args);
  };
} else {
  debug = function() {};
}
var debug_1 = debug; // for test

var tunnel = {
	httpOverHttp: httpOverHttp_1,
	httpsOverHttp: httpsOverHttp_1,
	httpOverHttps: httpOverHttps_1,
	httpsOverHttps: httpsOverHttps_1,
	debug: debug_1
};

var tunnel$1 = tunnel;

var httpClient = createCommonjsModule(function (module, exports) {
Object.defineProperty(exports, "__esModule", { value: true });




let tunnel;
var HttpCodes;
(function (HttpCodes) {
    HttpCodes[HttpCodes["OK"] = 200] = "OK";
    HttpCodes[HttpCodes["MultipleChoices"] = 300] = "MultipleChoices";
    HttpCodes[HttpCodes["MovedPermanently"] = 301] = "MovedPermanently";
    HttpCodes[HttpCodes["ResourceMoved"] = 302] = "ResourceMoved";
    HttpCodes[HttpCodes["SeeOther"] = 303] = "SeeOther";
    HttpCodes[HttpCodes["NotModified"] = 304] = "NotModified";
    HttpCodes[HttpCodes["UseProxy"] = 305] = "UseProxy";
    HttpCodes[HttpCodes["SwitchProxy"] = 306] = "SwitchProxy";
    HttpCodes[HttpCodes["TemporaryRedirect"] = 307] = "TemporaryRedirect";
    HttpCodes[HttpCodes["PermanentRedirect"] = 308] = "PermanentRedirect";
    HttpCodes[HttpCodes["BadRequest"] = 400] = "BadRequest";
    HttpCodes[HttpCodes["Unauthorized"] = 401] = "Unauthorized";
    HttpCodes[HttpCodes["PaymentRequired"] = 402] = "PaymentRequired";
    HttpCodes[HttpCodes["Forbidden"] = 403] = "Forbidden";
    HttpCodes[HttpCodes["NotFound"] = 404] = "NotFound";
    HttpCodes[HttpCodes["MethodNotAllowed"] = 405] = "MethodNotAllowed";
    HttpCodes[HttpCodes["NotAcceptable"] = 406] = "NotAcceptable";
    HttpCodes[HttpCodes["ProxyAuthenticationRequired"] = 407] = "ProxyAuthenticationRequired";
    HttpCodes[HttpCodes["RequestTimeout"] = 408] = "RequestTimeout";
    HttpCodes[HttpCodes["Conflict"] = 409] = "Conflict";
    HttpCodes[HttpCodes["Gone"] = 410] = "Gone";
    HttpCodes[HttpCodes["TooManyRequests"] = 429] = "TooManyRequests";
    HttpCodes[HttpCodes["InternalServerError"] = 500] = "InternalServerError";
    HttpCodes[HttpCodes["NotImplemented"] = 501] = "NotImplemented";
    HttpCodes[HttpCodes["BadGateway"] = 502] = "BadGateway";
    HttpCodes[HttpCodes["ServiceUnavailable"] = 503] = "ServiceUnavailable";
    HttpCodes[HttpCodes["GatewayTimeout"] = 504] = "GatewayTimeout";
})(HttpCodes = exports.HttpCodes || (exports.HttpCodes = {}));
var Headers;
(function (Headers) {
    Headers["Accept"] = "accept";
    Headers["ContentType"] = "content-type";
})(Headers = exports.Headers || (exports.Headers = {}));
var MediaTypes;
(function (MediaTypes) {
    MediaTypes["ApplicationJson"] = "application/json";
})(MediaTypes = exports.MediaTypes || (exports.MediaTypes = {}));
/**
 * Returns the proxy URL, depending upon the supplied url and proxy environment variables.
 * @param serverUrl  The server URL where the request will be sent. For example, https://api.github.com
 */
function getProxyUrl(serverUrl) {
    let proxyUrl = proxy.getProxyUrl(url__default['default'].parse(serverUrl));
    return proxyUrl ? proxyUrl.href : '';
}
exports.getProxyUrl = getProxyUrl;
const HttpRedirectCodes = [
    HttpCodes.MovedPermanently,
    HttpCodes.ResourceMoved,
    HttpCodes.SeeOther,
    HttpCodes.TemporaryRedirect,
    HttpCodes.PermanentRedirect
];
const HttpResponseRetryCodes = [
    HttpCodes.BadGateway,
    HttpCodes.ServiceUnavailable,
    HttpCodes.GatewayTimeout
];
const RetryableHttpVerbs = ['OPTIONS', 'GET', 'DELETE', 'HEAD'];
const ExponentialBackoffCeiling = 10;
const ExponentialBackoffTimeSlice = 5;
class HttpClientResponse {
    constructor(message) {
        this.message = message;
    }
    readBody() {
        return new Promise(async (resolve, reject) => {
            let output = Buffer.alloc(0);
            this.message.on('data', (chunk) => {
                output = Buffer.concat([output, chunk]);
            });
            this.message.on('end', () => {
                resolve(output.toString());
            });
        });
    }
}
exports.HttpClientResponse = HttpClientResponse;
function isHttps(requestUrl) {
    let parsedUrl = url__default['default'].parse(requestUrl);
    return parsedUrl.protocol === 'https:';
}
exports.isHttps = isHttps;
class HttpClient {
    constructor(userAgent, handlers, requestOptions) {
        this._ignoreSslError = false;
        this._allowRedirects = true;
        this._allowRedirectDowngrade = false;
        this._maxRedirects = 50;
        this._allowRetries = false;
        this._maxRetries = 1;
        this._keepAlive = false;
        this._disposed = false;
        this.userAgent = userAgent;
        this.handlers = handlers || [];
        this.requestOptions = requestOptions;
        if (requestOptions) {
            if (requestOptions.ignoreSslError != null) {
                this._ignoreSslError = requestOptions.ignoreSslError;
            }
            this._socketTimeout = requestOptions.socketTimeout;
            if (requestOptions.allowRedirects != null) {
                this._allowRedirects = requestOptions.allowRedirects;
            }
            if (requestOptions.allowRedirectDowngrade != null) {
                this._allowRedirectDowngrade = requestOptions.allowRedirectDowngrade;
            }
            if (requestOptions.maxRedirects != null) {
                this._maxRedirects = Math.max(requestOptions.maxRedirects, 0);
            }
            if (requestOptions.keepAlive != null) {
                this._keepAlive = requestOptions.keepAlive;
            }
            if (requestOptions.allowRetries != null) {
                this._allowRetries = requestOptions.allowRetries;
            }
            if (requestOptions.maxRetries != null) {
                this._maxRetries = requestOptions.maxRetries;
            }
        }
    }
    options(requestUrl, additionalHeaders) {
        return this.request('OPTIONS', requestUrl, null, additionalHeaders || {});
    }
    get(requestUrl, additionalHeaders) {
        return this.request('GET', requestUrl, null, additionalHeaders || {});
    }
    del(requestUrl, additionalHeaders) {
        return this.request('DELETE', requestUrl, null, additionalHeaders || {});
    }
    post(requestUrl, data, additionalHeaders) {
        return this.request('POST', requestUrl, data, additionalHeaders || {});
    }
    patch(requestUrl, data, additionalHeaders) {
        return this.request('PATCH', requestUrl, data, additionalHeaders || {});
    }
    put(requestUrl, data, additionalHeaders) {
        return this.request('PUT', requestUrl, data, additionalHeaders || {});
    }
    head(requestUrl, additionalHeaders) {
        return this.request('HEAD', requestUrl, null, additionalHeaders || {});
    }
    sendStream(verb, requestUrl, stream, additionalHeaders) {
        return this.request(verb, requestUrl, stream, additionalHeaders);
    }
    /**
     * Gets a typed object from an endpoint
     * Be aware that not found returns a null.  Other errors (4xx, 5xx) reject the promise
     */
    async getJson(requestUrl, additionalHeaders = {}) {
        additionalHeaders[Headers.Accept] = this._getExistingOrDefaultHeader(additionalHeaders, Headers.Accept, MediaTypes.ApplicationJson);
        let res = await this.get(requestUrl, additionalHeaders);
        return this._processResponse(res, this.requestOptions);
    }
    async postJson(requestUrl, obj, additionalHeaders = {}) {
        let data = JSON.stringify(obj, null, 2);
        additionalHeaders[Headers.Accept] = this._getExistingOrDefaultHeader(additionalHeaders, Headers.Accept, MediaTypes.ApplicationJson);
        additionalHeaders[Headers.ContentType] = this._getExistingOrDefaultHeader(additionalHeaders, Headers.ContentType, MediaTypes.ApplicationJson);
        let res = await this.post(requestUrl, data, additionalHeaders);
        return this._processResponse(res, this.requestOptions);
    }
    async putJson(requestUrl, obj, additionalHeaders = {}) {
        let data = JSON.stringify(obj, null, 2);
        additionalHeaders[Headers.Accept] = this._getExistingOrDefaultHeader(additionalHeaders, Headers.Accept, MediaTypes.ApplicationJson);
        additionalHeaders[Headers.ContentType] = this._getExistingOrDefaultHeader(additionalHeaders, Headers.ContentType, MediaTypes.ApplicationJson);
        let res = await this.put(requestUrl, data, additionalHeaders);
        return this._processResponse(res, this.requestOptions);
    }
    async patchJson(requestUrl, obj, additionalHeaders = {}) {
        let data = JSON.stringify(obj, null, 2);
        additionalHeaders[Headers.Accept] = this._getExistingOrDefaultHeader(additionalHeaders, Headers.Accept, MediaTypes.ApplicationJson);
        additionalHeaders[Headers.ContentType] = this._getExistingOrDefaultHeader(additionalHeaders, Headers.ContentType, MediaTypes.ApplicationJson);
        let res = await this.patch(requestUrl, data, additionalHeaders);
        return this._processResponse(res, this.requestOptions);
    }
    /**
     * Makes a raw http request.
     * All other methods such as get, post, patch, and request ultimately call this.
     * Prefer get, del, post and patch
     */
    async request(verb, requestUrl, data, headers) {
        if (this._disposed) {
            throw new Error('Client has already been disposed.');
        }
        let parsedUrl = url__default['default'].parse(requestUrl);
        let info = this._prepareRequest(verb, parsedUrl, headers);
        // Only perform retries on reads since writes may not be idempotent.
        let maxTries = this._allowRetries && RetryableHttpVerbs.indexOf(verb) != -1
            ? this._maxRetries + 1
            : 1;
        let numTries = 0;
        let response;
        while (numTries < maxTries) {
            response = await this.requestRaw(info, data);
            // Check if it's an authentication challenge
            if (response &&
                response.message &&
                response.message.statusCode === HttpCodes.Unauthorized) {
                let authenticationHandler;
                for (let i = 0; i < this.handlers.length; i++) {
                    if (this.handlers[i].canHandleAuthentication(response)) {
                        authenticationHandler = this.handlers[i];
                        break;
                    }
                }
                if (authenticationHandler) {
                    return authenticationHandler.handleAuthentication(this, info, data);
                }
                else {
                    // We have received an unauthorized response but have no handlers to handle it.
                    // Let the response return to the caller.
                    return response;
                }
            }
            let redirectsRemaining = this._maxRedirects;
            while (HttpRedirectCodes.indexOf(response.message.statusCode) != -1 &&
                this._allowRedirects &&
                redirectsRemaining > 0) {
                const redirectUrl = response.message.headers['location'];
                if (!redirectUrl) {
                    // if there's no location to redirect to, we won't
                    break;
                }
                let parsedRedirectUrl = url__default['default'].parse(redirectUrl);
                if (parsedUrl.protocol == 'https:' &&
                    parsedUrl.protocol != parsedRedirectUrl.protocol &&
                    !this._allowRedirectDowngrade) {
                    throw new Error('Redirect from HTTPS to HTTP protocol. This downgrade is not allowed for security reasons. If you want to allow this behavior, set the allowRedirectDowngrade option to true.');
                }
                // we need to finish reading the response before reassigning response
                // which will leak the open socket.
                await response.readBody();
                // strip authorization header if redirected to a different hostname
                if (parsedRedirectUrl.hostname !== parsedUrl.hostname) {
                    for (let header in headers) {
                        // header names are case insensitive
                        if (header.toLowerCase() === 'authorization') {
                            delete headers[header];
                        }
                    }
                }
                // let's make the request with the new redirectUrl
                info = this._prepareRequest(verb, parsedRedirectUrl, headers);
                response = await this.requestRaw(info, data);
                redirectsRemaining--;
            }
            if (HttpResponseRetryCodes.indexOf(response.message.statusCode) == -1) {
                // If not a retry code, return immediately instead of retrying
                return response;
            }
            numTries += 1;
            if (numTries < maxTries) {
                await response.readBody();
                await this._performExponentialBackoff(numTries);
            }
        }
        return response;
    }
    /**
     * Needs to be called if keepAlive is set to true in request options.
     */
    dispose() {
        if (this._agent) {
            this._agent.destroy();
        }
        this._disposed = true;
    }
    /**
     * Raw request.
     * @param info
     * @param data
     */
    requestRaw(info, data) {
        return new Promise((resolve, reject) => {
            let callbackForResult = function (err, res) {
                if (err) {
                    reject(err);
                }
                resolve(res);
            };
            this.requestRawWithCallback(info, data, callbackForResult);
        });
    }
    /**
     * Raw request with callback.
     * @param info
     * @param data
     * @param onResult
     */
    requestRawWithCallback(info, data, onResult) {
        let socket;
        if (typeof data === 'string') {
            info.options.headers['Content-Length'] = Buffer.byteLength(data, 'utf8');
        }
        let callbackCalled = false;
        let handleResult = (err, res) => {
            if (!callbackCalled) {
                callbackCalled = true;
                onResult(err, res);
            }
        };
        let req = info.httpModule.request(info.options, (msg) => {
            let res = new HttpClientResponse(msg);
            handleResult(null, res);
        });
        req.on('socket', sock => {
            socket = sock;
        });
        // If we ever get disconnected, we want the socket to timeout eventually
        req.setTimeout(this._socketTimeout || 3 * 60000, () => {
            if (socket) {
                socket.end();
            }
            handleResult(new Error('Request timeout: ' + info.options.path), null);
        });
        req.on('error', function (err) {
            // err has statusCode property
            // res should have headers
            handleResult(err, null);
        });
        if (data && typeof data === 'string') {
            req.write(data, 'utf8');
        }
        if (data && typeof data !== 'string') {
            data.on('close', function () {
                req.end();
            });
            data.pipe(req);
        }
        else {
            req.end();
        }
    }
    /**
     * Gets an http agent. This function is useful when you need an http agent that handles
     * routing through a proxy server - depending upon the url and proxy environment variables.
     * @param serverUrl  The server URL where the request will be sent. For example, https://api.github.com
     */
    getAgent(serverUrl) {
        let parsedUrl = url__default['default'].parse(serverUrl);
        return this._getAgent(parsedUrl);
    }
    _prepareRequest(method, requestUrl, headers) {
        const info = {};
        info.parsedUrl = requestUrl;
        const usingSsl = info.parsedUrl.protocol === 'https:';
        info.httpModule = usingSsl ? https__default['default'] : http__default['default'];
        const defaultPort = usingSsl ? 443 : 80;
        info.options = {};
        info.options.host = info.parsedUrl.hostname;
        info.options.port = info.parsedUrl.port
            ? parseInt(info.parsedUrl.port)
            : defaultPort;
        info.options.path =
            (info.parsedUrl.pathname || '') + (info.parsedUrl.search || '');
        info.options.method = method;
        info.options.headers = this._mergeHeaders(headers);
        if (this.userAgent != null) {
            info.options.headers['user-agent'] = this.userAgent;
        }
        info.options.agent = this._getAgent(info.parsedUrl);
        // gives handlers an opportunity to participate
        if (this.handlers) {
            this.handlers.forEach(handler => {
                handler.prepareRequest(info.options);
            });
        }
        return info;
    }
    _mergeHeaders(headers) {
        const lowercaseKeys = obj => Object.keys(obj).reduce((c, k) => ((c[k.toLowerCase()] = obj[k]), c), {});
        if (this.requestOptions && this.requestOptions.headers) {
            return Object.assign({}, lowercaseKeys(this.requestOptions.headers), lowercaseKeys(headers));
        }
        return lowercaseKeys(headers || {});
    }
    _getExistingOrDefaultHeader(additionalHeaders, header, _default) {
        const lowercaseKeys = obj => Object.keys(obj).reduce((c, k) => ((c[k.toLowerCase()] = obj[k]), c), {});
        let clientHeader;
        if (this.requestOptions && this.requestOptions.headers) {
            clientHeader = lowercaseKeys(this.requestOptions.headers)[header];
        }
        return additionalHeaders[header] || clientHeader || _default;
    }
    _getAgent(parsedUrl) {
        let agent;
        let proxyUrl = proxy.getProxyUrl(parsedUrl);
        let useProxy = proxyUrl && proxyUrl.hostname;
        if (this._keepAlive && useProxy) {
            agent = this._proxyAgent;
        }
        if (this._keepAlive && !useProxy) {
            agent = this._agent;
        }
        // if agent is already assigned use that agent.
        if (!!agent) {
            return agent;
        }
        const usingSsl = parsedUrl.protocol === 'https:';
        let maxSockets = 100;
        if (!!this.requestOptions) {
            maxSockets = this.requestOptions.maxSockets || http__default['default'].globalAgent.maxSockets;
        }
        if (useProxy) {
            // If using proxy, need tunnel
            if (!tunnel) {
                tunnel = tunnel$1;
            }
            const agentOptions = {
                maxSockets: maxSockets,
                keepAlive: this._keepAlive,
                proxy: {
                    proxyAuth: proxyUrl.auth,
                    host: proxyUrl.hostname,
                    port: proxyUrl.port
                }
            };
            let tunnelAgent;
            const overHttps = proxyUrl.protocol === 'https:';
            if (usingSsl) {
                tunnelAgent = overHttps ? tunnel.httpsOverHttps : tunnel.httpsOverHttp;
            }
            else {
                tunnelAgent = overHttps ? tunnel.httpOverHttps : tunnel.httpOverHttp;
            }
            agent = tunnelAgent(agentOptions);
            this._proxyAgent = agent;
        }
        // if reusing agent across request and tunneling agent isn't assigned create a new agent
        if (this._keepAlive && !agent) {
            const options = { keepAlive: this._keepAlive, maxSockets: maxSockets };
            agent = usingSsl ? new https__default['default'].Agent(options) : new http__default['default'].Agent(options);
            this._agent = agent;
        }
        // if not using private agent and tunnel agent isn't setup then use global agent
        if (!agent) {
            agent = usingSsl ? https__default['default'].globalAgent : http__default['default'].globalAgent;
        }
        if (usingSsl && this._ignoreSslError) {
            // we don't want to set NODE_TLS_REJECT_UNAUTHORIZED=0 since that will affect request for entire process
            // http.RequestOptions doesn't expose a way to modify RequestOptions.agent.options
            // we have to cast it to any and change it directly
            agent.options = Object.assign(agent.options || {}, {
                rejectUnauthorized: false
            });
        }
        return agent;
    }
    _performExponentialBackoff(retryNumber) {
        retryNumber = Math.min(ExponentialBackoffCeiling, retryNumber);
        const ms = ExponentialBackoffTimeSlice * Math.pow(2, retryNumber);
        return new Promise(resolve => setTimeout(() => resolve(), ms));
    }
    static dateTimeDeserializer(key, value) {
        if (typeof value === 'string') {
            let a = new Date(value);
            if (!isNaN(a.valueOf())) {
                return a;
            }
        }
        return value;
    }
    async _processResponse(res, options) {
        return new Promise(async (resolve, reject) => {
            const statusCode = res.message.statusCode;
            const response = {
                statusCode: statusCode,
                result: null,
                headers: {}
            };
            // not found leads to null obj returned
            if (statusCode == HttpCodes.NotFound) {
                resolve(response);
            }
            let obj;
            let contents;
            // get the result from the body
            try {
                contents = await res.readBody();
                if (contents && contents.length > 0) {
                    if (options && options.deserializeDates) {
                        obj = JSON.parse(contents, HttpClient.dateTimeDeserializer);
                    }
                    else {
                        obj = JSON.parse(contents);
                    }
                    response.result = obj;
                }
                response.headers = res.message.headers;
            }
            catch (err) {
                // Invalid resource (contents not json);  leaving result obj null
            }
            // note that 3xx redirects are handled by the http layer.
            if (statusCode > 299) {
                let msg;
                // if exception/error in body, attempt to get better error
                if (obj && obj.message) {
                    msg = obj.message;
                }
                else if (contents && contents.length > 0) {
                    // it may be the case that the exception is in the body message as string
                    msg = contents;
                }
                else {
                    msg = 'Failed request: (' + statusCode + ')';
                }
                let err = new Error(msg);
                // attach statusCode and body obj (if available) to the error object
                err['statusCode'] = statusCode;
                if (response.result) {
                    err['result'] = response.result;
                }
                reject(err);
            }
            else {
                resolve(response);
            }
        });
    }
}
exports.HttpClient = HttpClient;
});

var github = createCommonjsModule(function (module, exports) {
var __importStar = (commonjsGlobal && commonjsGlobal.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
// Originally pulled from https://github.com/JasonEtco/actions-toolkit/blob/master/src/github.ts


const Context = __importStar(context);
const httpClient$1 = __importStar(httpClient);
// We need this in order to extend Octokit
rest.Octokit.prototype = new rest.Octokit();
exports.context = new Context.Context();
class GitHub extends rest.Octokit {
    constructor(token, opts) {
        super(GitHub.getOctokitOptions(GitHub.disambiguate(token, opts)));
        this.graphql = GitHub.getGraphQL(GitHub.disambiguate(token, opts));
    }
    /**
     * Disambiguates the constructor overload parameters
     */
    static disambiguate(token, opts) {
        return [
            typeof token === 'string' ? token : '',
            typeof token === 'object' ? token : opts || {}
        ];
    }
    static getOctokitOptions(args) {
        const token = args[0];
        const options = Object.assign({}, args[1]); // Shallow clone - don't mutate the object provided by the caller
        // Base URL - GHES or Dotcom
        options.baseUrl = options.baseUrl || this.getApiBaseUrl();
        // Auth
        const auth = GitHub.getAuthString(token, options);
        if (auth) {
            options.auth = auth;
        }
        // Proxy
        const agent = GitHub.getProxyAgent(options.baseUrl, options);
        if (agent) {
            // Shallow clone - don't mutate the object provided by the caller
            options.request = options.request ? Object.assign({}, options.request) : {};
            // Set the agent
            options.request.agent = agent;
        }
        return options;
    }
    static getGraphQL(args) {
        const defaults = {};
        defaults.baseUrl = this.getGraphQLBaseUrl();
        const token = args[0];
        const options = args[1];
        // Authorization
        const auth = this.getAuthString(token, options);
        if (auth) {
            defaults.headers = {
                authorization: auth
            };
        }
        // Proxy
        const agent = GitHub.getProxyAgent(defaults.baseUrl, options);
        if (agent) {
            defaults.request = { agent };
        }
        return distWeb$2.graphql.defaults(defaults);
    }
    static getAuthString(token, options) {
        // Validate args
        if (!token && !options.auth) {
            throw new Error('Parameter token or opts.auth is required');
        }
        else if (token && options.auth) {
            throw new Error('Parameters token and opts.auth may not both be specified');
        }
        return typeof options.auth === 'string' ? options.auth : `token ${token}`;
    }
    static getProxyAgent(destinationUrl, options) {
        var _a;
        if (!((_a = options.request) === null || _a === void 0 ? void 0 : _a.agent)) {
            if (httpClient$1.getProxyUrl(destinationUrl)) {
                const hc = new httpClient$1.HttpClient();
                return hc.getAgent(destinationUrl);
            }
        }
        return undefined;
    }
    static getApiBaseUrl() {
        return process.env['GITHUB_API_URL'] || 'https://api.github.com';
    }
    static getGraphQLBaseUrl() {
        let url = process.env['GITHUB_GRAPHQL_URL'] || 'https://api.github.com/graphql';
        // Shouldn't be a trailing slash, but remove if so
        if (url.endsWith('/')) {
            url = url.substr(0, url.length - 1);
        }
        // Remove trailing "/graphql"
        if (url.toUpperCase().endsWith('/GRAPHQL')) {
            url = url.substr(0, url.length - '/graphql'.length);
        }
        return url;
    }
}
exports.GitHub = GitHub;

});

const { GitHub, context: context$1 } = github;


async function run() {
  try {
    // Get authenticated GitHub client (Ocktokit): https://github.com/actions/toolkit/tree/master/packages/github#usage
    const github = new GitHub(process.env.GITHUB_TOKEN);

    // Get owner and repo from context of payload that triggered the action
    const { owner, repo } = context$1.repo;

    // Get the inputs from the workflow file: https://github.com/actions/toolkit/tree/master/packages/core#inputsoutputs
    const tagName = core.getInput('tag_name', { required: true });

    // This removes the 'refs/tags' portion of the string, i.e. from 'refs/tags/v1.10.15' to 'v1.10.15'
    const tag = tagName.replace('refs/tags/', '');
    const releaseName = core.getInput('release_name', { required: false }).replace('refs/tags/', '');
    const body = core.getInput('body', { required: false });
    const draft = core.getInput('draft', { required: false }) === 'true';
    const prerelease = core.getInput('prerelease', { required: false }) === 'true';
    const commitish = core.getInput('commitish', { required: false }) || context$1.sha;

    const bodyPath = core.getInput('body_path', { required: false });
    let bodyFileContent = null;
    if (bodyPath !== '' && !!bodyPath) {
      try {
        bodyFileContent = fs__default['default'].readFileSync(bodyPath, { encoding: 'utf8' });
      } catch (error) {
        core.setFailed(error.message);
      }
    }

    // Create a release
    // API Documentation: https://developer.github.com/v3/repos/releases/#create-a-release
    // Octokit Documentation: https://octokit.github.io/rest.js/#octokit-routes-repos-create-release
    const createReleaseResponse = await github.repos.createRelease({
      owner,
      repo,
      tag_name: tag,
      name: releaseName,
      body: bodyFileContent || body,
      draft,
      prerelease,
      target_commitish: commitish
    });

    // Get the ID, html_url, and upload URL for the created Release from the response
    const {
      data: { id: releaseId, html_url: htmlUrl, upload_url: uploadUrl }
    } = createReleaseResponse;

    // Set the output variables for use by other actions: https://github.com/actions/toolkit/tree/master/packages/core#inputsoutputs
    core.setOutput('id', releaseId);
    core.setOutput('html_url', htmlUrl);
    core.setOutput('upload_url', uploadUrl);
  } catch (error) {
    core.setFailed(error.message);
  }
}

var createRelease = run;

var createRelease$1 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.assign(/*#__PURE__*/Object.create(null), createRelease, {
	'default': createRelease
}));

exports.Octokit = Octokit$1;
exports.core = core;
exports.createRelease = createRelease$1;
exports.error_1 = error_1;
exports.execa_1 = execa_1;
exports.info_1 = info_1;
exports.lib = lib;
exports.warn_1 = warn_1;
