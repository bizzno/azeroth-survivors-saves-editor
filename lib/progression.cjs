function applyUnlocks(text,options={talents:true,gear:true,achievements:true,zones:true,codex:true},catalog,now=Math.floor(Date.now()/1000)){
 let lines=text.replace(/\r/g,'').trimEnd().split('\n');if(!lines[0].startsWith('pick|'))throw Error('Load or paste a decoded save first.');
 function find(type,id){return lines.findIndex(l=>{let p=l.split('|');return p[0]===type&&(id===undefined||p[1]===String(id))})}
 function upsert(type,value,id){let i=find(type,id),line=type+'|'+(id===undefined?'':id+'|')+value;if(i<0)lines.push(line);else lines[i]=line}
 if(options.talents)for(let c of catalog.classes){let i=find('talent',c.id),old=i<0?[]:lines[i].split('|');upsert('talent',Math.max(catalog.maxTalentXP,Number(old[2])||0)+'|'+(old[3]||''),c.id)}
 if(options.gear){let i=find('items'),owned=i<0?[]:lines[i].split('|')[1].split(',').filter(Boolean).map(Number);upsert('items',[...new Set([...owned,...catalog.classes.flatMap(c=>c.items)])].sort((a,b)=>a-b).join(','))}
 if(options.achievements){let i=find('ach'),keys=new Set(i<0?[]:lines[i].split('|')[1].split(',').filter(Boolean));for(let a of catalog.achievements)keys.add(a.key);upsert('ach',[...keys].sort().join(','));let j=find('achat'),times=new Map(j<0?[]:lines[j].split('|')[1].split(',').filter(Boolean).map(x=>x.split('=')));for(let k of keys)if(!times.has(k))times.set(k,String(now));upsert('achat',[...times].sort(([a],[b])=>a.localeCompare(b)).map(([k,v])=>k+'='+v).join(','));for(let c of catalog.classes){let i=find('beat',c.id),old=i<0?[]:lines[i].split('|')[2].split(',');upsert('beat',[...new Set([...old,...catalog.zones])].filter(Boolean).join(','),c.id)} }
 if(options.zones)for(let c of catalog.classes){let i=find('unlock',c.id),old=i<0?0:Number(lines[i].split('|')[2])||0;upsert('unlock',String(Math.max(old,catalog.zones.length)),c.id)}
 if(options.codex){let i=find('seen'),seen=new Map(i<0?[]:lines[i].slice(5).split(',').filter(Boolean).map(x=>x.split('=')));for(let entry of catalog.codex)seen.set(entry.key,String(Math.max(Number(seen.get(entry.key))||0,entry.maxRank)));upsert('seen',[...seen].sort(([a],[b])=>a.localeCompare(b)).map(([k,v])=>k+'='+v).join(','))}
 return lines.join('\n')+'\n';
}
if(typeof module!=='undefined')module.exports={applyUnlocks};
