import { loadRegistry } from "../core/registry.js"
import { loadFeature } from "./loader.js"
import { expand } from "./app.js"

let registry
export async function openFeature(id){
  registry=registry||await loadRegistry()
  const f=registry.find(x=>x.id===id)
  if(!f)return
  const panel=document.querySelector(".om-panel")
  if(!panel)return
  loadFeature(panel,f)
  expand()
}
