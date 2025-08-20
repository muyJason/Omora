const canvas=document.getElementById('cp-canvas')
const ctx=canvas.getContext('2d')
const pipette=document.getElementById('cp-pipette')
const hue=document.getElementById('cp-hue')
const alpha=document.getElementById('cp-alpha')
const hex=document.getElementById('cp-hex')
const rIn=document.getElementById('cp-r')
const gIn=document.getElementById('cp-g')
const bIn=document.getElementById('cp-b')
const aIn=document.getElementById('cp-a')
const swatch=document.querySelector('.cp-swatch')
const outRgba=document.querySelector('.cp-out-rgba')
const outHex=document.querySelector('.cp-out-hex')
const outHsv=document.querySelector('.cp-out-hsv')
const outCmyk=document.querySelector('.cp-out-cmyk')
const state={h:0,s:0,v:0,a:100}
const dpr=window.devicePixelRatio||1
function clamp(n,min,max){return Math.min(max,Math.max(min,n))}
function hsvToRgb(h,s,v){s/=100;v/=100;h/=60;const i=Math.floor(h);const f=h-i;const p=v*(1-s);const q=v*(1-s*f);const t=v*(1-s*(1-f));let r,g,b;switch(i%6){case 0:r=v;g=t;b=p;break;case 1:r=q;g=v;b=p;break;case 2:r=p;g=v;b=t;break;case 3:r=p;g=q;b=v;break;case 4:r=t;g=p;b=v;break;default:r=v;g=p;b=q}return{r:Math.round(r*255),g:Math.round(g*255),b:Math.round(b*255)}}
function rgbToHsv(r,g,b){r/=255;g/=255;b/=255;const max=Math.max(r,g,b);const min=Math.min(r,g,b);const d=max-min;let h=0;if(d){switch(max){case r:h=(g-b)/d+(g<b?6:0);break;case g:h=(b-r)/d+2;break;case b:h=(r-g)/d+4}h*=60}const s=max?d/max:0;const v=max;return{h:h,s:s*100,v:v*100}}
function rgbToHex(r,g,b){const t=n=>n.toString(16).padStart(2,'0');return`#${t(r)}${t(g)}${t(b)}`}
function hexToRgb(str){str=str.replace('#','');if(str.length===3)str=str.split('').map(c=>c+c).join('');if(!/^[0-9a-fA-F]{6}$/.test(str))return null;const n=parseInt(str,16);return{r:(n>>16)&255,g:(n>>8)&255,b:n&255}}
function rgbToCmyk(r,g,b){const c=1-r/255;const m=1-g/255;const y=1-b/255;const k=Math.min(c,m,y);const c1=(c-k)/(1-k)||0;const m1=(m-k)/(1-k)||0;const y1=(y-k)/(1-k)||0;return{c:Math.round(c1*100),m:Math.round(m1*100),y:Math.round(y1*100),k:Math.round(k*100)}}
function alphaStr(a){const v=a/100;return v%1?Number(v.toFixed(2)):v}
function updateAlphaBg(r,g,b){alpha.style.backgroundImage=`linear-gradient(90deg,rgba(${r},${g},${b},0),rgba(${r},${g},${b},1)),repeating-conic-gradient(#666 0% 25%,#777 0% 50%)`;alpha.style.backgroundSize='100% 100%,8px 8px'}
function renderCanvas(){const rect=canvas.getBoundingClientRect();const w=rect.width*dpr;const h=rect.height*dpr;if(canvas.width!==w||canvas.height!==h){canvas.width=w;canvas.height=h}const base=hsvToRgb(state.h,100,100);ctx.fillStyle=`rgb(${base.r},${base.g},${base.b})`;ctx.fillRect(0,0,w,h);const g1=ctx.createLinearGradient(0,0,w,0);g1.addColorStop(0,'#fff');g1.addColorStop(1,'rgba(255,255,255,0)');ctx.fillStyle=g1;ctx.fillRect(0,0,w,h);const g2=ctx.createLinearGradient(0,0,0,h);g2.addColorStop(0,'rgba(0,0,0,0)');g2.addColorStop(1,'#000');ctx.fillStyle=g2;ctx.fillRect(0,0,w,h);const x=state.s/100*w;const y=(1-state.v/100)*h;ctx.lineWidth=2*dpr;ctx.strokeStyle='#000';ctx.beginPath();ctx.arc(x,y,6*dpr,0,Math.PI*2);ctx.stroke();ctx.lineWidth=1*dpr;ctx.strokeStyle='#fff';ctx.beginPath();ctx.arc(x,y,6*dpr,0,Math.PI*2);ctx.stroke()}
function sync(){const rgb=hsvToRgb(state.h,state.s,state.v);hue.value=state.h;alpha.value=state.a;rIn.value=rgb.r;gIn.value=rgb.g;bIn.value=rgb.b;aIn.value=state.a;hex.value=rgbToHex(rgb.r,rgb.g,rgb.b);swatch.style.background=`rgba(${rgb.r},${rgb.g},${rgb.b},${state.a/100})`;updateAlphaBg(rgb.r,rgb.g,rgb.b);outRgba.textContent=`rgba(${rgb.r},${rgb.g},${rgb.b},${alphaStr(state.a)})`;outHex.textContent=rgbToHex(rgb.r,rgb.g,rgb.b);outHsv.textContent=`hsv(${Math.round(state.h)},${Math.round(state.s)}%,${Math.round(state.v)}%)`;const cmyk=rgbToCmyk(rgb.r,rgb.g,rgb.b);outCmyk.textContent=`cmyk(${cmyk.c},${cmyk.m},${cmyk.y},${cmyk.k})`;renderCanvas()}
function setFromRGB(r,g,b,a){const hsv=rgbToHsv(r,g,b);state.h=hsv.h;state.s=hsv.s;state.v=hsv.v;state.a=a;sync()}
function setFromHex(str){const rgb=hexToRgb(str);if(rgb)setFromRGB(rgb.r,rgb.g,rgb.b,state.a)}
function setFromHSV(h,s,v){state.h=h;state.s=s;state.v=v;sync()}
let prevHex=''
function commitHex(){const v=hex.value.trim();const rgb=hexToRgb(v);if(rgb){setFromRGB(rgb.r,rgb.g,rgb.b,state.a);prevHex=hex.value}else hex.value=prevHex}
hex.addEventListener('focus',()=>prevHex=hex.value)
hex.addEventListener('keydown',e=>{if(e.key==='Enter'){commitHex();hex.blur()}})
hex.addEventListener('blur',commitHex)
function commitRgb(){const r=clamp(+rIn.value||0,0,255);const g=clamp(+gIn.value||0,0,255);const b=clamp(+bIn.value||0,0,255);const a=clamp(+aIn.value||0,0,100);setFromRGB(r,g,b,a)}
rIn.addEventListener('change',commitRgb)
gIn.addEventListener('change',commitRgb)
bIn.addEventListener('change',commitRgb)
aIn.addEventListener('change',commitRgb)
hue.addEventListener('input',e=>{state.h=+e.target.value;sync()})
alpha.addEventListener('input',e=>{state.a=+e.target.value;sync()})
function canvasPoint(e){const rect=canvas.getBoundingClientRect();const x=e.clientX-rect.left;const y=e.clientY-rect.top;const s=clamp(x/rect.width*100,0,100);const v=clamp(100-y/rect.height*100,0,100);setFromHSV(state.h,s,v)}
canvas.addEventListener('pointerdown',e=>{canvas.setPointerCapture(e.pointerId);canvasPoint(e);canvas.addEventListener('pointermove',canvasPoint)})
canvas.addEventListener('pointerup',e=>{canvas.releasePointerCapture(e.pointerId);canvas.removeEventListener('pointermove',canvasPoint)})
document.querySelectorAll('.cp-copy').forEach(btn=>btn.addEventListener('click',()=>{const t=btn.dataset.copy;let text='';if(t==='rgba')text=outRgba.textContent;else if(t==='hex')text=outHex.textContent;else if(t==='hsv')text=outHsv.textContent;else text=outCmyk.textContent;navigator.clipboard.writeText(text)}))
if(!('EyeDropper'in window))pipette.disabled=true
pipette.addEventListener('click',async()=>{if(pipette.disabled)return;document.body.style.cursor='crosshair';try{const d=await new EyeDropper().open();setFromHex(d.sRGBHex)}catch{}document.body.style.cursor=''})
new ResizeObserver(renderCanvas).observe(document.querySelector('.cp-canvaswrap'))
setFromHex('#676cba')
