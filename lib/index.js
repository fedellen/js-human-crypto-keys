"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getKeyPairFromSeed = exports.getKeyPairFromMnemonic = exports.generateKeyPair = void 0;
var bip39 = _interopRequireWildcard(require("bip39"));
var _algorithm = _interopRequireDefault(require("./algorithm"));
var _cryptoKeyComposer = require("crypto-key-composer");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function (e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && Object.prototype.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
const composeKeys = ({
  privateKey,
  publicKey
}, keyAlgorithm, options) => {
  options = {
    privateKeyFormat: 'pkcs8-pem',
    publicKeyFormat: 'spki-pem',
    ...options
  };
  const {
    privateKeyFormat,
    publicKeyFormat,
    encryptionAlgorithm,
    password
  } = options;
  return {
    privateKey: (0, _cryptoKeyComposer.composePrivateKey)({
      format: privateKeyFormat,
      keyAlgorithm,
      keyData: privateKey,
      encryptionAlgorithm
    }, {
      password
    }),
    publicKey: (0, _cryptoKeyComposer.composePublicKey)({
      format: publicKeyFormat,
      keyAlgorithm,
      keyData: publicKey
    })
  };
};
const generateKeys = async (seed, algorithm, options) => {
  const {
    id,
    params,
    generate
  } = (0, _algorithm.default)(algorithm);
  const keyPair = await generate(params, seed);
  const keyAlgorithm = {
    id,
    ...params
  };
  const composedKeyPair = composeKeys(keyPair, keyAlgorithm, options);
  return {
    keyAlgorithm,
    composedKeyPair
  };
};
const generateKeyPair = async (algorithm, options) => {
  const mnemonic = bip39.generateMnemonic();
  const seedBuffer = await bip39.mnemonicToSeed(mnemonic);
  const seed = new Uint8Array(seedBuffer.buffer);
  const {
    keyAlgorithm,
    composedKeyPair
  } = await generateKeys(seed, algorithm, options);
  return {
    algorithm: keyAlgorithm,
    mnemonic,
    seed,
    ...composedKeyPair
  };
};
exports.generateKeyPair = generateKeyPair;
const getKeyPairFromMnemonic = async (mnemonic, algorithm, options) => {
  const seedBuffer = await bip39.mnemonicToSeed(mnemonic);
  const seed = new Uint8Array(seedBuffer.buffer);
  return getKeyPairFromSeed(seed, algorithm, options);
};
exports.getKeyPairFromMnemonic = getKeyPairFromMnemonic;
const getKeyPairFromSeed = async (seed, algorithm, options) => {
  const {
    composedKeyPair
  } = await generateKeys(seed, algorithm, options);
  return composedKeyPair;
};
exports.getKeyPairFromSeed = getKeyPairFromSeed;