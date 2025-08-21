export function createRail({mount,features,onClick}){
  const rail=document.createElement("div")
  rail.className="om-rail"
  for(const m of features){
    const b=document.createElement("button")
    b.className="om-rail__icon"
    b.dataset.id=m.id
    b.title=m.tooltip||m.name||m.id
    const img=document.createElement("img")
    img.alt=m.name||m.id
    img.src=chrome.runtime.getURL(`src/features/${m.id}/${m.icon}`)
    b.appendChild(img)
    b.addEventListener("click",()=>{
      setActive(m.id)
      onClick(m.id)
    })
    rail.appendChild(b)
  }
  mount.appendChild(rail)
  function setActive(id){
    rail.querySelectorAll(".om-rail__icon").forEach(el=>el.classList.toggle("om-rail__icon--active",el.dataset.id===id))
  }
  return{root:rail,setActive}
}
