const fs=require('node:fs'),path=require('node:path');
const root=path.resolve(__dirname,'..');
const read=name=>fs.readFileSync(path.join(root,name),'utf8');
const replacements={STYLES:read('src/styles.css'),CORE:read('src/crypto.js'),CATALOG:'const CATALOG='+JSON.stringify(JSON.parse(read('src/catalog.json')))+';',PRESETS:read('lib/progression.cjs'),APP:read('src/editor.js')};
let html=read('src/editor.html');
for(const [key,value] of Object.entries(replacements))html=html.replace('/*__'+key+'__*/',()=>value);
if(/\/\*__[A-Z]+__\*\//.test(html))throw Error('Unresolved build placeholder');
fs.writeFileSync(path.join(root,'index.html'),html);
console.log('Built Azeroth Survivors Saves Editor → index.html');
