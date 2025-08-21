import { buildHeader, setTitle } from './header.js'

const STATE_KEY='omora:ui:state'

function getState(){return chrome.storage.local.get(STATE_KEY).then(r=>r[STATE_KEY])}
function setState(collapsed){return chrome.storage.local.set({[STATE_KEY]:{collapsed}})}
export function expand(){document.body.classList.remove('om-collapsed');setState(false)}
function collapse(){document.body.classList.add('om-collapsed');setState(true)}
function toggle(){document.body.classList.contains('om-collapsed')?expand():collapse()}

async function init(){
  const shell=document.querySelector('.om-shell')
  const panel=document.querySelector('.om-panel')
  const header=buildHeader()
  shell.insertBefore(header,panel)
  const close=header.querySelector('#om-close')
  close.addEventListener('click',()=>collapse())
  document.addEventListener('omora:feature-activated',e=>setTitle(e.detail.name??''))
  document.addEventListener('keydown',e=>{if(e.ctrlKey&&e.shiftKey&&e.code==='KeyO'){e.preventDefault();toggle()}})
  const state=await getState()
  state?.collapsed?collapse():expand()
}

init().catch(err=>console.error(err))
