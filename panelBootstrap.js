import { openFeature } from "./src/ui/appRouter.js"

async function activeTabId(){try{const c=await chrome.runtime.getContexts({contextTypes:["SIDE_PANEL"]});if(c?.[0]?.tabId)return c[0].tabId}catch(_){}const [t]=await chrome.tabs.query({active:true,currentWindow:true});return t?.id}
document.addEventListener("DOMContentLoaded",async()=>{
  const tabId=await activeTabId();if(!tabId)return
  const key="omora:feature:"+tabId
  const data=await chrome.storage.session.get(key)
  const id=data[key]
  if(!id)return
  await chrome.storage.session.remove(key)
  openFeature(id)
})
