"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _cryptoKeyComposer = require("crypto-key-composer");
var rsa = _interopRequireWildcard(require("./keys/rsa"));
var ed25519 = _interopRequireWildcard(require("./keys/ed25519"));
var _errors = require("./utils/errors");
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function (e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && Object.prototype.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
const supportedAlgorithms = {
  rsa,
  ed25519
};
const buildParams = (defaultParams, customParams) => Object.keys(customParams).reduce((params, key) => {
  // Do not allow unknown keys (params)
  if (defaultParams[key] == null) {
    throw new _errors.UnknownAlgorithmParamError(key);
  }

  // Do not allow nullish values
  if (customParams[key] == null) {
    throw new _errors.NilAlgorithmParamError(key);
  }

  // Do not allow different types
  if (typeof customParams[key] !== typeof defaultParams[key]) {
    throw new _errors.TypeMismatchAlgorithmParamError(key, typeof defaultParams[key]);
  }
  params[key] = customParams[key];
  return params;
}, {
  ...defaultParams
});
const parseAlgorithm = keyAlgorithm => {
  const algorithm = typeof keyAlgorithm === 'string' ? {
    id: keyAlgorithm
  } : keyAlgorithm;
  const type = supportedAlgorithms[algorithm.id] ? algorithm.id : (0, _cryptoKeyComposer.getKeyTypeFromAlgorithm)(algorithm.id);
  if (!type) {
    throw new _errors.UnknownAlgorithmError(algorithm.id);
  }
  const {
    generateKeyPair,
    defaultParams
  } = supportedAlgorithms[type];
  const {
    id,
    ...customParams
  } = algorithm;
  const params = buildParams(defaultParams, customParams);
  return {
    id,
    type,
    params,
    generate: generateKeyPair
  };
};
var _default = exports.default = parseAlgorithm;
module.exports = exports.default;