(function(root){
 'use strict';
 const idOK=o=>typeof o.id==='string'&&o.id.length>0&&o.id.length<=128;
 function validMap(m,{requireId=false}={}){
  if(!m||typeof m.name!=='string'||!m.name.length||m.name.length>32||(requireId&&!idOK(m)))return false;
  if(!Array.isArray(m.grid)||m.grid.length!==18||!m.grid.every(row=>Array.isArray(row)&&row.length===28&&row.every(v=>Number.isInteger(v)&&v>=0&&v<=6)))return false;
  const cells=m.grid.flat();return cells.filter(v=>v===4).length===1&&cells.filter(v=>v===5).length===1;
 }
 function weaponCost(w){return Math.round(w.damage*.85+w.range*2.5+(1300-w.rate)/30+(w.speed-3)*1.6+(w.type==='melee'?5:10));}
 function validWeapon(w,{requireId=false}={}){
  return !!(w&&typeof w.name==='string'&&w.name.length>0&&w.name.length<=28&&(!requireId||idOK(w))&&['projectile','melee'].includes(w.type)&&Number.isInteger(w.damage)&&w.damage>=3&&w.damage<=50&&Number.isInteger(w.range)&&w.range>=1&&w.range<=12&&Number.isInteger(w.rate)&&w.rate>=200&&w.rate<=1300&&Number.isInteger(w.speed)&&w.speed>=3&&w.speed<=14&&['#fb923c','#60a5fa','#a78bfa','#4ade80','#f472b6'].includes(w.color)&&weaponCost(w)<=85);
 }
 const api=Object.freeze({validMap,validWeapon,weaponCost,maxItems:12});
 if(typeof module==='object'&&module.exports)module.exports=api;else root.FormwheelPvpData=api;
})(globalThis);
