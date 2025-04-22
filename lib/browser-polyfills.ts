// Browser-compatible polyfills for Node.js modules
export const net = {};
export const fs = {
  readFileSync: () => null,
  writeFileSync: () => null,
};
export const http2 = {};
export const tls = {};
export const dns = {};

export default {
  net,
  fs,
  http2,
  tls,
  dns,
}; 