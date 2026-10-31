/* Global leaderboard viewer: read-only by design.
   Verified match results must be written by a trusted backend, not this browser. */
import {initializeApp,getApps} from "https://www.gstatic.com/firebasejs/10.14.1/firebase-app.js";
import {getDatabase,ref,query,orderByChild,limitToLast,get} from "https://www.gstatic.com/firebasejs/10.14.1/firebase-database.js";
const app=getApps()[0]||initializeApp({apiKey:"AIzaSyBreTSe1m0-xlbF4aupnU5isRZCihR25IE",authDomain:"formwheel.firebaseapp.com",databaseURL:"https://formwheel-default-rtdb.firebaseio.com",projectId:"formwheel",appId:"1:431583088241:web:74e0e34ea1e3e1170c55d0"});
const db=getDatabase(app);
const safeText=(v,max=24)=>String(v??"").replace(/[\\u0000-\\u001f]/g,"").slice(0,max);
const container=document.createElement("section");
container.className="card";container.id="pvp-global-leaderboard";
container.innerHTML='<h2>🌍 글로벌 리더보드 <small style="font-size:12px">준비 중 · 읽기 전용</small></h2><p>검증된 온라인 대전 결과만 집계하는 글로벌 순위입니다. 현재 로컬 AI 랭크는 글로벌 순위에 포함되지 않아요.</p><p><button type="button" id="pvp-global-refresh">🔄 순위 새로고침</button></p><div id="pvp-global-message" role="status" aria-live="polite">글로벌 기록을 확인할 수 있어요.</div><ol id="pvp-global-list"></ol><p style="font-size:12px;opacity:.8">닉네임은 공개되므로 실명이나 개인정보를 넣지 마세요. 점수 등록은 검증 서버 구축 후 제공됩니다.</p>';
const target=document.getElementById("arena");
target?.closest(".card")?.insertAdjacentElement("afterend",container);
const msg=container.querySelector("#pvp-global-message"),list=container.querySelector("#pvp-global-list");
async function refresh(){
  msg.textContent="순위 조회 중…";list.replaceChildren();
  try{
    const snap=await get(query(ref(db,"formwheelV2/pvpVerifiedLeaderboard"),orderByChild("rp"),limitToLast(30)));
    const rows=[];
    snap.forEach(c=>{const v=c.val();if(v&&Number.isSafeInteger(v.rp)&&v.rp>=0&&typeof v.nickname==="string")rows.push({id:c.key,nickname:safeText(v.nickname),rp:v.rp});});
    rows.sort((a,b)=>b.rp-a.rp||a.id.localeCompare(b.id));
    if(!rows.length){msg.textContent="아직 인증된 글로벌 기록이 없어요. 로컬 랭크는 그대로 이용할 수 있어요.";return;}
    msg.textContent="인증된 글로벌 기록 "+rows.length+"개 표시";
    rows.forEach((v,i)=>{const item=document.createElement("li");item.textContent=(i<3?["🥇 ","🥈 ","🥉 "][i]:"")+v.nickname+" · "+v.rp+" RP";list.append(item);});
  }catch(e){msg.textContent="글로벌 순위를 불러오지 못했어요. 서버 권한 설정이 필요할 수 있습니다. (로컬 플레이는 정상 이용 가능)";}
}
container.querySelector("#pvp-global-refresh").onclick=refresh;
refresh();
