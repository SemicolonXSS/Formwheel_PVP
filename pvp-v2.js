/* PVP 2.0: non-invasive HUD, map guide and local ranked solo seasons. */
(()=>{
 const $=id=>document.getElementById(id), arena=$("arena"), start=$("arena-start"), status=$("status"), map=$("map");
 if(!arena||!start||!status||!map)return;
 const style=document.createElement("style");
 style.textContent=`
 .pvp2-panel{background:#13243f;border:1px solid #38577b;padding:14px;border-radius:15px;margin:12px 0}
 .pvp2-heading{font-weight:800;margin-bottom:10px;color:#dceaff}
 .pvp2-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(140px,1fr));gap:9px}
 .pvp2-stat{background:#253d60;border-radius:10px;padding:9px}
 .pvp2-stat strong{display:block;font-size:18px;color:#a6e8f8}
 .pvp2-meter{height:9px;border-radius:12px;overflow:hidden;background:#3c4f69;margin-top:6px}
 .pvp2-meter>span{display:block;height:100%;width:100%;background:linear-gradient(90deg,#40a7f8,#73ebd2);transition:width .15s}
 .pvp2-map{font-size:13px;opacity:.9;margin:5px 0 0}
 `;
 document.head.append(style);
 const hud=document.createElement("section");hud.className="pvp2-panel";hud.setAttribute("aria-label","PVP 전투 상태");
 hud.innerHTML='<div class="pvp2-heading">⚔️ 전투 HUD 2.0</div><div class="pvp2-grid"><div class="pvp2-stat">내 체력 <strong id="pvp2-my-hp">100 HP</strong><div class="pvp2-meter"><span id="pvp2-my-bar"></span></div></div><div class="pvp2-stat">상대 체력 <strong id="pvp2-foe-hp">100 HP</strong><div class="pvp2-meter"><span id="pvp2-foe-bar"></span></div></div></div>';
 arena.parentElement.insertBefore(hud,arena);
 const maps={classic:"중앙 기둥 1개 · 엄폐 연습",twin:"기둥 2개 · 측면 진입",maze:"복잡한 장애물 · 길 찾기",open:"장애물 없음 · 빠른 대전",cross:"십자형 엄폐 · 위치 싸움"};
 const mapInfo=document.createElement("p");mapInfo.className="pvp2-map";map.parentElement.append(mapInfo);
 function updateMap(){mapInfo.textContent="🗺️ "+(maps[map.value]||"직접 만든 커스텀 맵");}
 map.addEventListener("change",updateMap);updateMap();
 const rank=document.createElement("section");rank.className="pvp2-panel";
 rank.innerHTML='<div class="pvp2-heading">🏆 솔로 랭크 1.0 (이 기기)</div><div class="pvp2-grid"><div class="pvp2-stat">현재 티어<strong id="pvp2-tier">브론즈</strong></div><div class="pvp2-stat">랭크 점수<strong id="pvp2-points">0 RP</strong></div><div class="pvp2-stat">다음 티어까지<strong id="pvp2-next">100 RP</strong></div></div><p class="pvp2-map">AI 3단계 이상에서 승리하면 RP를 얻고, 패배하면 일부 감소합니다. 랭크는 이 기기에만 저장되며 글로벌 랭킹이 아닙니다.</p>';
 hud.insertAdjacentElement("afterend",rank);
 const key="formwheel-pvp-ranked-solo-v1";let record={rp:0,wins:0,losses:0};
 try{const a=JSON.parse(localStorage.getItem(key)||"null");if(a&&Number.isSafeInteger(a.rp)&&a.rp>=0&&Number.isSafeInteger(a.wins)&&Number.isSafeInteger(a.losses))record=a;}catch(_){}
 const tiers=[[0,"브론즈"],[100,"실버"],[250,"골드"],[450,"플래티넘"],[700,"다이아"],[1000,"마스터"]];
 function showRank(){const t=[...tiers].reverse().find(x=>record.rp>=x[0])||tiers[0],next=tiers.find(x=>x[0]>record.rp);$("pvp2-tier").textContent=t[1];$("pvp2-points").textContent=record.rp+" RP";$("pvp2-next").textContent=next?next[0]-record.rp+" RP":"최고 티어";}showRank();
 function updateHUD(){
  const hp=Math.max(0,Number($("hp")?.textContent)||0),foe=Math.max(0,Number($("aihp")?.textContent)||0);
  $("pvp2-my-hp").textContent=Math.ceil(hp)+" HP";$("pvp2-foe-hp").textContent=Math.ceil(foe)+" HP";
  const max=window.fwPvpOnlineActive?175:205;
  $("pvp2-my-bar").style.width=Math.min(100,hp/max*100)+"%";
  $("pvp2-foe-bar").style.width=Math.min(100,foe/max*100)+"%";
 }
 const observer=new MutationObserver(updateHUD);
 observer.observe($("hp"),{childList:true,characterData:true,subtree:true});observer.observe($("aihp"),{childList:true,characterData:true,subtree:true});updateHUD();
 let last="",playedRanked=false,level=0;
 start.addEventListener("click",()=>{if(!window.fwPvpOnlineActive){level=Number($("difficulty").value)||0;playedRanked=level>=3;last="";}},true);
 new MutationObserver(()=>{
  const msg=status.textContent.trim();
  if(msg===last)return;last=msg;
  if(window.fwPvpOnlineActive||!playedRanked)return;
  const won=msg.startsWith("🏆 승리!"),lost=msg.startsWith("AI 승리!");
  if(!won&&!lost)return;playedRanked=false;
  if(won){record.wins++;record.rp+=Math.min(30,8+level*2);}
  else{record.losses++;record.rp=Math.max(0,record.rp-10);}
  try{localStorage.setItem(key,JSON.stringify(record));}catch(_){}
  showRank();
 }).observe(status,{childList:true,characterData:true,subtree:true});
})();