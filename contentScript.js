import { loadRegistry } from "./src/core/registry.js"
import { createRail } from "./src/ui/rail/railFactory.js"

;(async()=>{
  if(!chrome?.runtime?.id) return
  if(document.getElementById("omora-rail-root")) return
  const host=document.createElement("div")
  host.id="omora-rail-root"
  const shadow=host.attachShadow({mode:"open"})
  const style=document.createElement("style")
  style.textContent=`.om-rail{position:fixed;right:0;top:30vh;width:48px;padding:6px;display:flex;flex-direction:column;gap:8px;border-radius:10px 0 0 10px;z-index:2147483647} .om-rail__icon{width:36px;height:36px;border:0;border-radius:8px;background:transparent;display:grid;place-items:center} .om-rail__icon img{width:22px;height:22px} .om-rail__icon--active{outline:2px solid rgba(59,130,246,.9);outline-offset:0}`
  shadow.append(style)
  document.documentElement.appendChild(host)

  const metas=await loadRegistry()
  const rail=createRail({mount:shadow,features:metas,onClick:id=>chrome.runtime.sendMessage({type:"omora:open-esidebar",feature:id})})

  const key="omora:offset:"+location.origin
  chrome.storage.local.get(key).then(r=>{const v=r[key];if(typeof v==="number") shadow.host.style.top=v+"px"})
  shadow.host.addEventListener("pointerdown",e=>{
    if(e.button!==0) return
    const startY=e.clientY
    const startTop=parseInt(shadow.host.style.top||"0",10)||shadow.host.getBoundingClientRect().top
    const move=ev=>{const t=Math.max(0,startTop+ev.clientY-startY);shadow.host.style.top=t+"px"}
    const up=()=>{document.removeEventListener("pointermove",move);document.removeEventListener("pointerup",up);const t=parseInt(shadow.host.style.top,10)||0;chrome.storage.local.set({[key]:t})}
    document.addEventListener("pointermove",move);document.addEventListener("pointerup",up)
  })
})()
