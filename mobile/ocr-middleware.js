const fs = require('node:fs');
const path = require('node:path');
const assets = {
  'index.html': ['text/html', path.join(__dirname,'ocr-preview.html')],
  'tesseract.min.js': ['text/javascript', require.resolve('tesseract.js/dist/tesseract.min.js')],
  'worker.min.js': ['text/javascript', require.resolve('tesseract.js/dist/worker.min.js')],
  'tesseract-core-lstm.wasm.js': ['text/javascript', require.resolve('tesseract.js-core/tesseract-core-lstm.wasm.js')]
};
for (const lang of ['uzb','uzb_cyrl']) {
  const name = lang + '.traineddata.gz';
  assets[name] = ['application/octet-stream', require.resolve('@tesseract.js-data/'+lang+'/4.0.0_best_int/'+name)];
}
module.exports = next => (req,res,callback) => {
  const prefix='/pro-alifbo-ocr/';
  if (!req.url.startsWith(prefix)) return next(req,res,callback);
  const key=req.url.slice(prefix.length);
  if (!Object.hasOwn(assets,key) || req.method !== 'GET') {res.writeHead(404);return res.end();}
  const [type,file]=assets[key];
  res.setHeader('Content-Type',type);
  fs.createReadStream(file).on('error',()=>res.destroy()).pipe(res);
};
