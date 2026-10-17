
const $=id=>document.getElementById(id),enc=new TextEncoder(),dec=new TextDecoder('utf-8',{fatal:true});let filename='AzerothSurvivors';
const keyBytes=Uint8Array.from('617a65726f74682d7375727669766f72732f736176652f76312f9c4e27d16af013b85de2710ca936c48f'.match(/../g),x=>parseInt(x,16));
const key=crypto.subtle.importKey('raw',keyBytes,{name:'HMAC',hash:'SHA-1'},false,['sign']);
function concat(...a){let r=new Uint8Array(a.reduce((n,b)=>n+b.length,0)),p=0;for(let b of a){r.set(b,p);p+=b.length}return r}
async function h(...a){return new Uint8Array(await crypto.subtle.sign('HMAC',await key,concat(...a)))}
async function transform(data,nonce){let r=data.slice();for(let i=0;i<r.length;i+=20){let ctr=new Uint8Array(8);new DataView(ctr.buffer).setBigUint64(0,BigInt(i/20),true);let k=await h(enc.encode('ks'),nonce,ctr);for(let j=0;j<20&&i+j<r.length;j++)r[i+j]^=k[j]}return r}
async function decode(s){s=s.trim();if(!s.startsWith('RSE1:'))throw Error('Expected an RSE1 save.');let r=Uint8Array.from(atob(s.slice(5)),c=>c.charCodeAt(0));if(r.length<36)throw Error('Truncated save.');let nonce=r.slice(0,16),body=r.slice(16,-20),tag=await h(enc.encode('tag'),nonce,body);if(tag.some((v,i)=>v!==r[r.length-20+i]))throw Error('Integrity check failed.');return dec.decode(await transform(body,nonce))}
async function encode(s){let nonce=crypto.getRandomValues(new Uint8Array(16)),body=await transform(enc.encode(s),nonce),tag=await h(enc.encode('tag'),nonce,body),r=concat(nonce,body,tag),binary='';for(let v of r)binary+=String.fromCharCode(v);return 'RSE1:'+btoa(binary)}
