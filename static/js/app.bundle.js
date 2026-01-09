(()=>{var Xs=Object.create;var pe=Object.defineProperty;var Ks=Object.getOwnPropertyDescriptor;var Zs=Object.getOwnPropertyNames;var er=Object.getPrototypeOf,tr=Object.prototype.hasOwnProperty;var Ge=n=>e=>{var t=n[e];if(t)return t();throw new Error("Module not found in bundle: "+e)};var Q=(n,e)=>()=>(n&&(e=n(n=0)),e);var Je=(n,e)=>()=>(e||n((e={exports:{}}).exports,e),e.exports),J=(n,e)=>{for(var t in e)pe(n,t,{get:e[t],enumerable:!0})},sr=(n,e,t,o)=>{if(e&&typeof e=="object"||typeof e=="function")for(let p of Zs(e))!tr.call(n,p)&&p!==t&&pe(n,p,{get:()=>e[p],enumerable:!(o=Ks(e,p))||o.enumerable});return n};var rr=(n,e,t)=>(t=n!=null?Xs(er(n)):{},sr(e||!n||!n.__esModule?pe(t,"default",{value:n,enumerable:!0}):t,n));function H(...n){return n.flat().filter(e=>e&&typeof e=="string").join(" ")}function N(n="div",{id:e="",className:t="",attrs:o={},html:p="",text:b=""}={}){let k=document.createElement(n);return e&&(k.id=e),t&&(k.className=t),b&&(k.textContent=b),p&&(k.innerHTML=p),Object.entries(o).forEach(([_,q])=>{q===!0?k.setAttribute(_,""):q!==!1&&q!==null&&k.setAttribute(_,q)}),k}function Xe(n,e,t,o={}){if(n)return n.addEventListener(e,t,o),()=>n.removeEventListener(e,t,o)}function ce(n){let e=n.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'),t=e[0],o=e[e.length-1];return{init(){n.addEventListener("keydown",p=>{p.key==="Tab"&&(p.shiftKey?document.activeElement===t&&(p.preventDefault(),o.focus()):document.activeElement===o&&(p.preventDefault(),t.focus()))})},destroy(){}}}function Ke(){return"id-"+Math.random().toString(36).substr(2,9)+Date.now().toString(36)}function ie(n=""){return N("div",{className:H("fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity duration-200",n),attrs:{"data-backdrop":"true"}})}var ue,K=Q(()=>{ue={isEnter:n=>n.key==="Enter",isEscape:n=>n.key==="Escape",isArrowUp:n=>n.key==="ArrowUp",isArrowDown:n=>n.key==="ArrowDown",isArrowLeft:n=>n.key==="ArrowLeft",isArrowRight:n=>n.key==="ArrowRight",isSpace:n=>n.key===" ",isTab:n=>n.key==="Tab"}});var F,Z=Q(()=>{K();F=class n{constructor(e={}){this.id=e.id||Ke(),this.element=null,this.listeners=[],this.isInitialized=!1,this.config=e}create(e="div",{className:t="",attrs:o={},html:p=""}={}){return this.element=N(e,{id:this.id,className:t,attrs:o,html:p}),this.element}mount(e){if(!this.element)return!1;let t=typeof e=="string"?document.querySelector(e):e;return t?(t.appendChild(this.element),this.isInitialized=!0,!0):!1}on(e,t,o={}){if(!this.element)return;let p=Xe(this.element,e,t,o);return this.listeners.push(p),p}delegate(e,t,o){if(!this.element)return;let p=b=>{let k=b.target.closest(e);k&&o.call(k,b)};this.element.addEventListener(t,p),this.listeners.push(()=>this.element.removeEventListener(t,p))}addClass(...e){this.element&&this.element.classList.add(...e)}removeClass(...e){this.element&&this.element.classList.remove(...e)}toggleClass(e,t){this.element&&this.element.classList.toggle(e,t)}hasClass(e){return this.element?.classList.contains(e)??!1}attr(e,t){if(this.element){if(t===void 0)return this.element.getAttribute(e);t===null||t===!1?this.element.removeAttribute(e):t===!0?this.element.setAttribute(e,""):this.element.setAttribute(e,t)}}attrs(e){Object.entries(e).forEach(([t,o])=>{this.attr(t,o)})}text(e){this.element&&(this.element.textContent=e)}html(e){this.element&&(this.element.innerHTML=e)}append(e){this.element&&e&&this.element.appendChild(e instanceof n?e.element:e)}prepend(e){this.element&&e&&this.element.prepend(e instanceof n?e.element:e)}show(){this.element&&(this.element.style.display="",this.element.removeAttribute("hidden"))}hide(){this.element&&(this.element.style.display="none")}toggle(e){this.element&&(e===void 0&&(e=this.element.style.display==="none"),e?this.show():this.hide())}getStyle(e){return this.element?window.getComputedStyle(this.element).getPropertyValue(e):null}setStyle(e,t){this.element&&(this.element.style[e]=t)}setStyles(e){Object.entries(e).forEach(([t,o])=>{this.setStyle(t,o)})}focus(e){if(this.element)try{typeof e>"u"?this.element.focus({preventScroll:!0}):this.element.focus(e)}catch{try{this.element.focus()}catch{}}}blur(){this.element&&this.element.blur()}getPosition(){return this.element?this.element.getBoundingClientRect():null}destroy(){this.listeners.forEach(e=>e?.()),this.listeners=[],this.element?.parentNode&&this.element.parentNode.removeChild(this.element),this.element=null,this.isInitialized=!1}init(){this.element&&!this.isInitialized&&(this.isInitialized=!0)}render(){return this.element}}});var Ze={};J(Ze,{Alert:()=>ge});var ge,et=Q(()=>{Z();K();ge=class extends F{constructor(e={}){super(e),this.title=e.title||"",this.message=e.message||"",this.type=e.type||"default",this.icon=e.icon||null,this.closeable=e.closeable||!1,this.className=e.className||""}create(){let e={default:{bg:"bg-blue-50",border:"border-blue-200",title:"text-blue-900",message:"text-blue-800",icon:"\u24D8"},success:{bg:"bg-green-50",border:"border-green-200",title:"text-green-900",message:"text-green-800",icon:"\u2713"},warning:{bg:"bg-yellow-50",border:"border-yellow-200",title:"text-yellow-900",message:"text-yellow-800",icon:"\u26A0"},error:{bg:"bg-red-50",border:"border-red-200",title:"text-red-900",message:"text-red-800",icon:"\u2715"},info:{bg:"bg-cyan-50",border:"border-cyan-200",title:"text-cyan-900",message:"text-cyan-800",icon:"\u2139"}},t=e[this.type]||e.default,p=super.create("div",{className:H("p-4 rounded-lg border-2",t.bg,t.border,this.className),attrs:{role:"alert"}}),b="";return(this.title||this.icon)&&(b+='<div class="flex items-center gap-3 mb-2">',this.icon,b+=`<span class="text-xl font-bold ${t.title}">${this.icon||t.icon}</span>`,this.title&&(b+=`<h4 class="font-semibold ${t.title}">${this.title}</h4>`),b+="</div>"),this.message&&(b+=`<p class="${t.message}">${this.message}</p>`),this.closeable&&(b+='<button class="absolute top-4 right-4 text-gray-400 hover:text-gray-600" aria-label="Close alert">\xD7</button>'),p.innerHTML=b,this.closeable&&p.querySelector("button")?.addEventListener("click",()=>{this.destroy()}),p}setMessage(e){if(this.message=e,this.element){let t=this.element.querySelector("p");t&&(t.textContent=e)}}}});var tt={};J(tt,{AlertDialog:()=>he});var he,st=Q(()=>{Z();K();he=class extends F{constructor(e={}){super(e),this.title=e.title||"",this.message=e.message||"",this.confirmText=e.confirmText||"Confirm",this.cancelText=e.cancelText||"Cancel",this.type=e.type||"warning",this.onConfirm=e.onConfirm||null,this.onCancel=e.onCancel||null,this.open=e.open||!1}create(){let e=super.create("div",{className:H("fixed inset-0 z-50 flex items-center justify-center",this.open?"":"hidden"),attrs:{role:"alertdialog","aria-modal":"true","aria-labelledby":`${this.id}-title`,"aria-describedby":`${this.id}-message`}}),t=ie();e.appendChild(t);let o=document.createElement("div");o.className="bg-white rounded-lg shadow-lg relative z-50 w-full max-w-md mx-4";let p=document.createElement("div");p.className="px-6 py-4 border-b border-gray-200";let b=document.createElement("h2");b.id=`${this.id}-title`,b.className="text-lg font-semibold text-gray-900",b.textContent=this.title,p.appendChild(b),o.appendChild(p);let k=document.createElement("div");k.id=`${this.id}-message`,k.className="px-6 py-4 text-gray-700",k.textContent=this.message,o.appendChild(k);let _=document.createElement("div");_.className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex gap-3 justify-end rounded-b-lg";let q=document.createElement("button");q.className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100 transition-colors duration-200",q.textContent=this.cancelText,q.addEventListener("click",()=>this.handleCancel()),_.appendChild(q);let R=document.createElement("button"),Y=this.type==="danger"?"bg-red-600 text-white hover:bg-red-700":"bg-blue-600 text-white hover:bg-blue-700";return R.className=H("px-4 py-2 rounded-md transition-colors duration-200",Y),R.textContent=this.confirmText,R.addEventListener("click",()=>this.handleConfirm()),_.appendChild(R),o.appendChild(_),e.appendChild(o),this.focusTrap=ce(o),e}open(){this.element||this.create(),this.open=!0,this.element.classList.remove("hidden"),this.focusTrap.init(),document.body.style.overflow="hidden"}close(){this.open=!1,this.element?.classList.add("hidden"),document.body.style.overflow=""}handleConfirm(){this.onConfirm&&this.onConfirm(),this.close()}handleCancel(){this.onCancel&&this.onCancel(),this.close()}}});var rt={};J(rt,{Avatar:()=>fe});var fe,at=Q(()=>{Z();K();fe=class extends F{constructor(e={}){super(e),this.src=e.src||"",this.alt=e.alt||"",this.initials=e.initials||"",this.size=e.size||"md",this.className=e.className||"",this.fallbackBg=e.fallbackBg||"bg-blue-600"}create(){let e={xs:"w-6 h-6 text-xs",sm:"w-8 h-8 text-sm",md:"w-10 h-10 text-base",lg:"w-12 h-12 text-lg",xl:"w-16 h-16 text-xl"},t="rounded-full overflow-hidden flex items-center justify-center flex-shrink-0 font-semibold";return this.src?super.create("img",{className:H(t,e[this.size],this.className),attrs:{src:this.src,alt:this.alt,role:"img"}}):this.initials?super.create("div",{className:H(t,e[this.size],"text-white",this.fallbackBg,this.className),text:this.initials.toUpperCase()}):super.create("div",{className:H(t,e[this.size],"bg-gray-300",this.className),html:'<svg class="w-full h-full text-gray-500" fill="currentColor" viewBox="0 0 24 24"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>'})}setSrc(e,t=""){this.src=e,this.alt=t,this.element&&this.element.tagName==="IMG"&&(this.element.src=e,this.element.alt=t)}setInitials(e,t=""){if(this.initials=e,t&&(this.fallbackBg=t),this.element&&(this.element.textContent=e.toUpperCase(),t&&this.element.className.includes("bg-"))){let o=this.element.className.match(/bg-\S+/)[0];this.element.classList.remove(o),this.element.classList.add(t)}}}});var nt={};J(nt,{Badge:()=>xe});var xe,ot=Q(()=>{Z();K();xe=class extends F{constructor(e={}){super(e),this.label=e.label||"Badge",this.variant=e.variant||"default",this.size=e.size||"md",this.className=e.className||""}create(){let e="inline-flex items-center rounded font-semibold whitespace-nowrap",t={default:"bg-gray-100 text-gray-800",primary:"bg-blue-100 text-blue-800",success:"bg-green-100 text-green-800",warning:"bg-yellow-100 text-yellow-800",destructive:"bg-red-100 text-red-800",outline:"border border-gray-300 text-gray-700"},o={sm:"px-2 py-1 text-xs",md:"px-3 py-1 text-sm",lg:"px-4 py-2 text-base"},p=super.create("span",{className:H(e,t[this.variant],o[this.size],this.className)});return p.textContent=this.label,p}setLabel(e){this.label=e,this.element&&(this.element.textContent=e)}}});var it={};J(it,{Button:()=>be});var be,lt=Q(()=>{Z();K();be=class extends F{constructor(e={}){super(e),this.label=e.label||"Button",this.variant=e.variant||"default",this.size=e.size||"md",this.disabled=e.disabled||!1,this.onClick=e.onClick||null,this.className=e.className||""}create(){let e="px-4 py-2 font-medium rounded transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-offset-2",t={default:"bg-gray-200 text-gray-900 hover:bg-gray-300",primary:"bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500",secondary:"bg-green-600 text-white hover:bg-green-700 focus:ring-green-500",destructive:"bg-red-600 text-white hover:bg-red-700 focus:ring-red-500",outline:"border-2 border-gray-300 text-gray-900 hover:bg-gray-50",ghost:"text-gray-900 hover:bg-gray-100"},o={sm:"px-2 py-1 text-sm",md:"px-4 py-2 text-base",lg:"px-6 py-3 text-lg"},p=super.create("button",{className:H(e,t[this.variant],o[this.size],this.className),attrs:{disabled:this.disabled}});return p.textContent=this.label,this.onClick&&this.on("click",this.onClick),p}setLabel(e){this.label=e,this.element&&(this.element.textContent=e)}setDisabled(e){this.disabled=e,this.attr("disabled",e?"":null)}setLoading(e){this.setDisabled(e),e?this.html('<span class="flex items-center gap-2"><span class="inline-block w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></span>Loading...</span>'):this.text(this.label)}}});var dt={};J(dt,{ButtonGroup:()=>ve});var ve,ct=Q(()=>{Z();K();ve=class extends F{constructor(e={}){super(e),this.buttons=e.buttons||[],this.orientation=e.orientation||"horizontal",this.size=e.size||"md",this.className=e.className||""}create(){let e=this.orientation==="vertical"?"flex-col":"flex-row",o=super.create("div",{className:H("flex",e,"inline-flex border border-gray-300 rounded-md overflow-hidden",this.className),attrs:{role:"group"}});return this.buttons.forEach((p,b)=>{let k=document.createElement("button");k.textContent=p.label||"Button",k.className=H("px-4 py-2 font-medium text-gray-700 hover:bg-gray-50 transition-colors duration-200",b>0?this.orientation==="vertical"?"border-t border-gray-300":"border-l border-gray-300":"",p.disabled?"opacity-50 cursor-not-allowed":""),k.disabled=p.disabled||!1,p.onClick&&k.addEventListener("click",p.onClick),o.appendChild(k)}),o}addButton(e,t){if(this.element){let o=document.createElement("button");o.textContent=e,o.className=H("px-4 py-2 font-medium text-gray-700 hover:bg-gray-50 transition-colors duration-200 border-l border-gray-300"),t&&o.addEventListener("click",t),this.element.appendChild(o)}}}});var ut={};J(ut,{Breadcrumb:()=>ye});var ye,mt=Q(()=>{Z();K();ye=class extends F{constructor(e={}){super(e),this.items=e.items||[],this.className=e.className||""}create(){let t=super.create("nav",{className:H("flex items-center gap-2",this.className),attrs:{"aria-label":"Breadcrumb"}});return this.items.forEach((o,p)=>{if(p>0){let b=N("span",{className:"text-gray-400 mx-1",text:"/"});t.appendChild(b)}if(p===this.items.length-1){let b=N("span",{className:"text-gray-700 font-medium",text:o.label,attrs:{"aria-current":"page"}});t.appendChild(b)}else{let b=N("a",{className:"text-blue-600 hover:text-blue-800 hover:underline transition-colors duration-200",text:o.label,attrs:{href:o.href||"#"}});t.appendChild(b)}}),t}addItem(e,t="#"){if(this.element){if(this.element.children.length>0){let p=N("span",{className:"text-gray-400 mx-1",text:"/"});this.element.appendChild(p)}let o=N("a",{className:"text-blue-600 hover:text-blue-800 hover:underline transition-colors duration-200",text:e,attrs:{href:t}});this.element.appendChild(o),this.items.push({label:e,href:t})}}}});var pt={};J(pt,{Card:()=>we});var we,gt=Q(()=>{Z();K();we=class extends F{constructor(e={}){super(e),this.title=e.title||"",this.subtitle=e.subtitle||"",this.content=e.content||"",this.footer=e.footer||"",this.className=e.className||"",this.hoverable=e.hoverable!==!1}create(){let e="bg-white rounded-lg border border-gray-200 overflow-hidden",t=this.hoverable?"hover:shadow-lg transition-shadow duration-300":"",o=super.create("div",{className:H(e,t,this.className)});if(this.title){let p=N("div",{className:"px-6 py-4 border-b border-gray-200 bg-gray-50"}),b=`<h3 class="text-lg font-semibold text-gray-900">${this.title}</h3>`;this.subtitle&&(b+=`<p class="text-sm text-gray-600 mt-1">${this.subtitle}</p>`),p.innerHTML=b,o.appendChild(p)}if(this.content){let p=N("div",{className:"px-6 py-4",html:this.content});o.appendChild(p)}if(this.footer){let p=N("div",{className:"px-6 py-4 border-t border-gray-200 bg-gray-50",html:this.footer});o.appendChild(p)}return o}setContent(e){if(this.content=e,this.element){let t=this.element.querySelector(".px-6.py-4:not(.border-b):not(.border-t)");t&&(t.innerHTML=e)}}addContent(e){if(this.element){let t=this.element.querySelector(".px-6.py-4:not(.border-b):not(.border-t)");t&&t.appendChild(e instanceof F?e.element:e)}}}});var ht={};J(ht,{Carousel:()=>ke});var ke,ft=Q(()=>{Z();K();ke=class extends F{constructor(e={}){super(e),this.items=e.items||[],this.autoplay=e.autoplay||!0,this.interval=e.interval||5e3,this.className=e.className||"",this.currentIndex=0,this.autoplayTimer=null}create(){let e=super.create("div",{className:H("relative w-full bg-black rounded-lg overflow-hidden",this.className)}),t=N("div",{className:"relative w-full h-96 overflow-hidden"});this.items.forEach((k,_)=>{let q=N("div",{className:H("absolute inset-0 transition-opacity duration-500",_===this.currentIndex?"opacity-100":"opacity-0")}),R=document.createElement("img");if(R.src=k.src,R.alt=k.alt||"",R.className="w-full h-full object-cover",q.appendChild(R),k.title){let Y=N("div",{className:"absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4",html:`<p class="text-white font-semibold">${k.title}</p>`});q.appendChild(Y)}t.appendChild(q)}),e.appendChild(t);let o=N("button",{className:"absolute left-4 top-1/2 transform -translate-y-1/2 z-10 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75 transition-all",html:"\u276E"});o.addEventListener("click",()=>{this.previous()});let p=N("button",{className:"absolute right-4 top-1/2 transform -translate-y-1/2 z-10 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75 transition-all",html:"\u276F"});p.addEventListener("click",()=>{this.next()}),e.appendChild(o),e.appendChild(p);let b=N("div",{className:"absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2 z-10"});return this.items.forEach((k,_)=>{let q=N("button",{className:H("w-2 h-2 rounded-full transition-all",_===this.currentIndex?"bg-white w-8":"bg-gray-500"),attrs:{"data-index":_}});q.addEventListener("click",()=>{this.goTo(_)}),b.appendChild(q)}),e.appendChild(b),this.slidesElement=t,this.dotsElement=b,this.autoplay&&this.startAutoplay(),e}next(){this.currentIndex=(this.currentIndex+1)%this.items.length,this.updateSlides()}previous(){this.currentIndex=(this.currentIndex-1+this.items.length)%this.items.length,this.updateSlides()}goTo(e){this.currentIndex=e,this.updateSlides(),this.autoplay&&this.resetAutoplay()}updateSlides(){let e=this.slidesElement.querySelectorAll("div"),t=this.dotsElement.querySelectorAll("button");e.forEach((o,p)=>{o.className=H("absolute inset-0 transition-opacity duration-500",p===this.currentIndex?"opacity-100":"opacity-0")}),t.forEach((o,p)=>{o.className=H("w-2 h-2 rounded-full transition-all",p===this.currentIndex?"bg-white w-8":"bg-gray-500")})}startAutoplay(){this.autoplayTimer=setInterval(()=>{this.next()},this.interval)}stopAutoplay(){this.autoplayTimer&&clearInterval(this.autoplayTimer)}resetAutoplay(){this.stopAutoplay(),this.autoplay&&this.startAutoplay()}destroy(){this.stopAutoplay(),super.destroy()}}});var xt={};J(xt,{Chart:()=>Ee});var Ee,bt=Q(()=>{Z();K();Ee=class extends F{constructor(e={}){super(e),this.type=e.type||"bar",this.data=e.data||[],this.title=e.title||"",this.height=e.height||"300px",this.className=e.className||""}create(){let e=super.create("div",{className:H("bg-white rounded-lg border border-gray-200 p-4",this.className)});if(this.title){let o=N("h3",{className:"text-lg font-semibold text-gray-900 mb-4",text:this.title});e.appendChild(o)}let t=this.createSVG();return e.appendChild(t),e}createSVG(){let e=Math.max(...this.data.map(k=>k.value)),t=400,o=200,p=40,b=document.createElementNS("http://www.w3.org/2000/svg","svg");if(b.setAttribute("viewBox",`0 0 ${t} ${o}`),b.setAttribute("class","w-full"),this.type==="bar"){let k=(t-p*2)/this.data.length;this.data.forEach((_,q)=>{let R=_.value/e*(o-p*2),Y=p+q*k+k*.25,j=o-p-R,y=document.createElementNS("http://www.w3.org/2000/svg","rect");y.setAttribute("x",Y),y.setAttribute("y",j),y.setAttribute("width",k*.5),y.setAttribute("height",R),y.setAttribute("fill","#3b82f6"),y.setAttribute("class","hover:fill-blue-700 transition-colors"),b.appendChild(y);let M=document.createElementNS("http://www.w3.org/2000/svg","text");M.setAttribute("x",Y+k*.25),M.setAttribute("y",o-10),M.setAttribute("text-anchor","middle"),M.setAttribute("font-size","12"),M.setAttribute("fill","#6b7280"),M.textContent=_.label,b.appendChild(M)})}return b}setData(e){if(this.data=e,this.element&&this.element.parentNode){let t=this.create();this.element.parentNode.replaceChild(t,this.element),this.element=t}}}});var vt={};J(vt,{Checkbox:()=>Ce});var Ce,yt=Q(()=>{Z();K();Ce=class extends F{constructor(e={}){super(e),this.label=e.label||"",this.checked=e.checked||!1,this.disabled=e.disabled||!1,this.required=e.required||!1,this.name=e.name||"",this.className=e.className||"",this.onChange=e.onChange||null}create(){let t=super.create("div",{className:H("flex items-center gap-2",this.className)}),o="w-5 h-5 border-2 border-gray-300 rounded cursor-pointer transition-colors duration-200 checked:bg-blue-600 checked:border-blue-600 disabled:opacity-50 disabled:cursor-not-allowed",p=document.createElement("input");if(p.type="checkbox",p.className=o,p.checked=this.checked,p.disabled=this.disabled,p.required=this.required,this.name&&(p.name=this.name),t.appendChild(p),this.label){let b=document.createElement("label");b.className="cursor-pointer select-none",b.textContent=this.label,t.appendChild(b),b.addEventListener("click",()=>{p.click()})}return this.onChange&&p.addEventListener("change",this.onChange),this.inputElement=p,t}isChecked(){return this.inputElement?.checked||!1}setChecked(e){this.checked=e,this.inputElement&&(this.inputElement.checked=e)}setDisabled(e){this.disabled=e,this.inputElement&&(this.inputElement.disabled=e)}toggle(){this.setChecked(!this.isChecked())}}});var wt={};J(wt,{Collapsible:()=>Le});var Le,kt=Q(()=>{Z();K();Le=class extends F{constructor(e={}){super(e),this.title=e.title||"",this.content=e.content||"",this.open=e.open||!1,this.className=e.className||"",this.onChange=e.onChange||null}create(){let e=super.create("div",{className:H("border border-gray-200 rounded-lg overflow-hidden",this.className)}),t=N("button",{className:H("w-full px-4 py-3 flex items-center justify-between","hover:bg-gray-50 transition-colors duration-200 text-left"),attrs:{"aria-expanded":this.open}}),o=N("span",{className:"font-semibold text-gray-900",text:this.title}),p=N("span",{className:H("w-5 h-5 transition-transform duration-300",this.open?"rotate-180":""),html:"\u25BC"});t.appendChild(o),t.appendChild(p),t.addEventListener("click",()=>{this.toggle()}),e.appendChild(t);let b=N("div",{className:H("overflow-hidden transition-all duration-300",this.open?"max-h-96":"max-h-0","border-t border-gray-200")}),k=N("div",{className:"px-4 py-3",html:this.content});return b.appendChild(k),e.appendChild(b),this.triggerElement=t,this.contentElement=b,this.chevron=p,e}toggle(){this.open=!this.open,this.updateUI(),this.onChange&&this.onChange(this.open)}open(){this.open||(this.open=!0,this.updateUI(),this.onChange&&this.onChange(!0))}close(){this.open&&(this.open=!1,this.updateUI(),this.onChange&&this.onChange(!1))}updateUI(){this.triggerElement.setAttribute("aria-expanded",this.open),this.contentElement.className=H("overflow-hidden transition-all duration-300",this.open?"max-h-96":"max-h-0","border-t border-gray-200"),this.chevron.className=H("w-5 h-5 transition-transform duration-300",this.open?"rotate-180":"")}setContent(e){if(this.content=e,this.contentElement){let t=this.contentElement.querySelector("div");t&&(t.innerHTML=e)}}}});var Et={};J(Et,{Command:()=>$e});var $e,Ct=Q(()=>{Z();K();$e=class extends F{constructor(e={}){super(e),this.commands=e.commands||[],this.placeholder=e.placeholder||"Type a command...",this.className=e.className||"",this.open=!1}create(){let e=super.create("div",{className:H("fixed inset-0 z-50 hidden flex items-start justify-center pt-20",this.open?"flex":"")}),t=N("div",{className:"absolute inset-0 bg-black bg-opacity-50"});e.appendChild(t),t.addEventListener("click",()=>this.close());let o=N("div",{className:"relative w-full max-w-md bg-white rounded-lg shadow-lg z-50"}),p=document.createElement("input");p.type="text",p.placeholder=this.placeholder,p.className="w-full px-4 py-3 border-b border-gray-200 focus:outline-none",p.autofocus=!0,o.appendChild(p);let b=N("div",{className:"max-h-96 overflow-y-auto"}),k=(_="")=>{b.innerHTML="";let q=_?this.commands.filter(Y=>Y.label.toLowerCase().includes(_.toLowerCase())):this.commands;if(q.length===0){let Y=N("div",{className:"px-4 py-3 text-sm text-gray-500",text:"No commands found"});b.appendChild(Y);return}let R="";q.forEach(Y=>{if(Y.category&&Y.category!==R){R=Y.category;let M=N("div",{className:"px-4 py-2 text-xs font-semibold text-gray-600 bg-gray-50 uppercase",text:R});b.appendChild(M)}let j=N("div",{className:H("px-4 py-2 cursor-pointer hover:bg-blue-50 transition-colors flex items-center justify-between group")}),y=N("span",{text:Y.label,className:"text-sm text-gray-900"});if(j.appendChild(y),Y.shortcut){let M=N("span",{className:"text-xs text-gray-500 group-hover:text-gray-700",text:Y.shortcut});j.appendChild(M)}j.addEventListener("click",()=>{Y.action&&Y.action(),this.close()}),b.appendChild(j)})};return p.addEventListener("input",_=>{k(_.target.value)}),o.appendChild(b),e.appendChild(o),p.addEventListener("keydown",_=>{_.key==="Escape"&&this.close()}),k(),this.containerElement=e,e}open(){this.element||this.create(),this.open=!0,this.element.classList.remove("hidden"),this.element.classList.add("flex")}close(){this.open=!1,this.element?.classList.remove("flex"),this.element?.classList.add("hidden")}toggle(){this.open?this.close():this.open()}}});var Lt={};J(Lt,{Combobox:()=>Te});var Te,$t=Q(()=>{Z();K();Te=class extends F{constructor(e={}){super(e),this.items=e.items||[],this.value=e.value||"",this.placeholder=e.placeholder||"Search...",this.className=e.className||"",this.onChange=e.onChange||null,this.open=!1}create(){let e=super.create("div",{className:"relative w-full"}),t=document.createElement("input");t.type="text",t.placeholder=this.placeholder,t.value=this.value,t.className=H("w-full px-3 py-2 border border-gray-300 rounded-md","focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent");let o=N("div",{className:H("absolute hidden top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-md shadow-lg z-50","max-h-64 overflow-y-auto")}),p=(b="")=>{o.innerHTML="";let k=this.items.filter(_=>_.label.toLowerCase().includes(b.toLowerCase()));if(k.length===0){let _=N("div",{className:"px-3 py-2 text-gray-500",text:"No results found"});o.appendChild(_);return}k.forEach(_=>{let q=N("div",{className:H("px-3 py-2 cursor-pointer hover:bg-blue-50 transition-colors",_.value===this.value?"bg-blue-100":""),text:_.label,attrs:{"data-value":_.value}});q.addEventListener("click",()=>{this.value=_.value,t.value=_.label,o.classList.add("hidden"),this.onChange&&this.onChange(this.value,_)}),o.appendChild(q)})};return t.addEventListener("input",b=>{p(b.target.value),o.classList.remove("hidden")}),t.addEventListener("focus",()=>{p(t.value),o.classList.remove("hidden")}),t.addEventListener("blur",()=>{setTimeout(()=>{o.classList.add("hidden")},150)}),e.appendChild(t),e.appendChild(o),document.addEventListener("click",b=>{e.contains(b.target)||o.classList.add("hidden")}),this.inputElement=t,this.listElement=o,p(),e}getValue(){return this.value}setValue(e){this.value=e;let t=this.items.find(o=>o.value===e);t&&this.inputElement&&(this.inputElement.value=t.label)}}});var Tt={};J(Tt,{ContextMenu:()=>Ie});var Ie,It=Q(()=>{Z();K();Ie=class extends F{constructor(e={}){super(e),this.items=e.items||[],this.className=e.className||"",this.visible=!1}create(){let e=super.create("div",{className:"relative inline-block w-full"}),t=document.createElement("div");return t.className=H("absolute hidden bg-white border border-gray-200 rounded-lg shadow-lg py-1 z-50 min-w-max",this.className),this.items.forEach(o=>{let p=N("button",{className:H("w-full text-left px-4 py-2 hover:bg-gray-100 transition-colors duration-200 flex items-center gap-2",o.disabled?"opacity-50 cursor-not-allowed":"cursor-pointer"),attrs:{disabled:o.disabled?"":null,"data-action":o.label}});if(o.icon){let k=document.createElement("span");k.innerHTML=o.icon,p.appendChild(k)}let b=document.createElement("span");b.textContent=o.label,p.appendChild(b),p.addEventListener("click",()=>{!o.disabled&&o.onClick&&o.onClick(),this.hide()}),t.appendChild(p)}),e.appendChild(t),e.addEventListener("contextmenu",o=>{o.preventDefault(),this.showAt(o.clientX,o.clientY,t)}),document.addEventListener("click",()=>{this.visible&&this.hide()}),this.menuElement=t,e}showAt(e,t,o){o&&(this.visible=!0,o.classList.remove("hidden"),o.style.position="fixed",o.style.left=e+"px",o.style.top=t+"px")}hide(){this.visible=!1,this.menuElement&&(this.menuElement.classList.add("hidden"),this.menuElement.style.position="absolute")}addItem(e,t,o=null){let p={label:e,onClick:t,icon:o};if(this.items.push(p),this.menuElement){let b=N("button",{className:"w-full text-left px-4 py-2 hover:bg-gray-100 transition-colors duration-200 flex items-center gap-2"});if(o){let k=document.createElement("span");k.innerHTML=o,b.appendChild(k)}b.textContent=e,b.addEventListener("click",()=>{t(),this.hide()}),this.menuElement.appendChild(b)}}}});var Bt={};J(Bt,{DatePicker:()=>Be});var Be,St=Q(()=>{Z();K();Be=class extends F{constructor(e={}){super(e),this.value=e.value||"",this.placeholder=e.placeholder||"Select date...",this.format=e.format||"yyyy-mm-dd",this.className=e.className||"",this.onChange=e.onChange||null,this.open=!1}create(){let e=super.create("div",{className:"relative w-full"}),t=document.createElement("input");t.type="text",t.placeholder=this.placeholder,t.value=this.value,t.className=H("w-full px-3 py-2 border border-gray-300 rounded-md","focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"),t.addEventListener("click",()=>{this.openPicker()}),t.addEventListener("change",p=>{this.value=p.target.value,this.onChange&&this.onChange(this.value)}),e.appendChild(t);let o=document.createElement("input");return o.type="date",o.style.display="none",o.value=this.value,o.addEventListener("change",p=>{let b=new Date(p.target.value);this.value=this.formatDate(b),t.value=this.value,this.onChange&&this.onChange(this.value)}),e.appendChild(o),this.inputElement=t,this.nativeInput=o,e}openPicker(){this.nativeInput.click()}formatDate(e){let t=e.getFullYear(),o=String(e.getMonth()+1).padStart(2,"0"),p=String(e.getDate()).padStart(2,"0");return this.format==="dd/mm/yyyy"?`${p}/${o}/${t}`:`${t}-${o}-${p}`}getValue(){return this.value}setValue(e){this.value=e,this.inputElement&&(this.inputElement.value=e)}}});var At={};J(At,{Dialog:()=>Se});var Se,_t=Q(()=>{Z();K();Se=class extends F{constructor(e={}){super(e),this.title=e.title||"",this.content=e.content||"",this.size=e.size||"md",this.open=e.open||!1,this.onClose=e.onClose||null,this.closeButton=e.closeButton!==!1,this.closeOnBackdrop=e.closeOnBackdrop!==!1,this.closeOnEscape=e.closeOnEscape!==!1}create(){let e=super.create("div",{className:H("fixed inset-0 z-50 flex items-center justify-center",this.open?"":"hidden"),attrs:{role:"dialog","aria-modal":"true","aria-labelledby":`${this.id}-title`,"aria-describedby":`${this.id}-description`}}),t=ie("dialog-backdrop");e.appendChild(t),this.closeOnBackdrop&&t.addEventListener("click",()=>this.close());let o={sm:"w-full max-w-sm",md:"w-full max-w-md",lg:"w-full max-w-lg",xl:"w-full max-w-xl"},p=document.createElement("div");if(p.className=H("bg-white rounded-lg shadow-lg relative z-50",o[this.size],"mx-4 max-h-[90vh] overflow-y-auto"),this.title){let b=document.createElement("div");b.className="px-6 py-4 border-b border-gray-200 flex items-center justify-between";let k=document.createElement("h2");if(k.id=`${this.id}-title`,k.className="text-xl font-semibold text-gray-900",k.textContent=this.title,b.appendChild(k),this.closeButton){let _=document.createElement("button");_.className="text-gray-500 hover:text-gray-700 transition-colors duration-200",_.innerHTML="\xD7",_.setAttribute("aria-label","Close"),_.addEventListener("click",()=>this.close()),b.appendChild(_)}p.appendChild(b)}if(this.content){let b=document.createElement("div");b.id=`${this.id}-description`,b.className="px-6 py-4",b.innerHTML=this.content,p.appendChild(b)}return e.appendChild(p),this.on("keydown",b=>{ue.isEscape(b)&&this.closeOnEscape&&this.close()},{once:!1}),this.backdrop=t,this.dialogElement=p,this.focusTrap=ce(p),e}open(){this.element||this.create(),this.open=!0,this.element.classList.remove("hidden"),this.focusTrap.init(),document.body.style.overflow="hidden"}close(){this.open=!1,this.element?.classList.add("hidden"),document.body.style.overflow="",this.onClose&&this.onClose()}toggle(){this.open?this.close():this.open()}setContent(e){if(this.content=e,this.dialogElement){let t=this.dialogElement.querySelector(`#${this.id}-description`);t&&(t.innerHTML=e)}}}});var Mt={};J(Mt,{DropdownMenu:()=>Ae});var Ae,qt=Q(()=>{Z();K();Ae=class extends F{constructor(e={}){super(e),this.trigger=e.trigger||"Menu",this.items=e.items||[],this.position=e.position||"bottom",this.align=e.align||"left",this.className=e.className||"",this.open=!1}create(){let e=super.create("div",{className:"relative inline-block"}),t=document.createElement("button");t.className="px-4 py-2 bg-gray-100 text-gray-900 rounded hover:bg-gray-200 transition-colors duration-200 flex items-center gap-2",t.innerHTML=`${this.trigger} <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 14l-7 7m0 0l-7-7m7 7V3"></path></svg>`,t.addEventListener("click",()=>this.toggle()),e.appendChild(t);let o=this.position==="top"?"bottom-full mb-2":"top-full mt-2",p=this.align==="right"?"right-0":"left-0",b=document.createElement("div");return b.className=H("absolute hidden bg-white border border-gray-200 rounded-lg shadow-lg py-1 z-50 min-w-max",o,p,this.className),this.items.forEach(k=>{if(k.divider){let R=document.createElement("div");R.className="border-t border-gray-200 my-1",b.appendChild(R);return}let _=N("button",{className:H("w-full text-left px-4 py-2 hover:bg-gray-100 transition-colors duration-200 flex items-center gap-2",k.disabled?"opacity-50 cursor-not-allowed":"cursor-pointer"),attrs:{disabled:k.disabled?"":null}});if(k.icon){let R=document.createElement("span");R.innerHTML=k.icon,R.className="w-4 h-4",_.appendChild(R)}let q=document.createElement("span");q.textContent=k.label,_.appendChild(q),_.addEventListener("click",()=>{!k.disabled&&k.onClick&&k.onClick(),this.close()}),b.appendChild(_)}),e.appendChild(b),document.addEventListener("click",k=>{!e.contains(k.target)&&this.open&&this.close()}),this.triggerBtn=t,this.menuElement=b,e}toggle(){this.open?this.close():this.open()}open(){this.open=!0,this.menuElement.classList.remove("hidden")}close(){this.open=!1,this.menuElement.classList.add("hidden")}addItem(e,t,o=null){let p={label:e,onClick:t,icon:o};if(this.items.push(p),this.menuElement){let b=N("button",{className:"w-full text-left px-4 py-2 hover:bg-gray-100 transition-colors duration-200 flex items-center gap-2"});if(o){let _=document.createElement("span");_.innerHTML=o,_.className="w-4 h-4",b.appendChild(_)}let k=document.createElement("span");k.textContent=e,b.appendChild(k),b.addEventListener("click",()=>{t(),this.close()}),this.menuElement.appendChild(b)}}}});var Ht={};J(Ht,{Drawer:()=>_e});var _e,Pt=Q(()=>{Z();K();_e=class extends F{constructor(e={}){super(e),this.title=e.title||"",this.content=e.content||"",this.position=e.position||"right",this.open=e.open||!1,this.onClose=e.onClose||null,this.closeButton=e.closeButton!==!1,this.closeOnBackdrop=e.closeOnBackdrop!==!1,this.closeOnEscape=e.closeOnEscape!==!1}create(){let e=super.create("div",{className:H("fixed inset-0 z-50",this.open?"":"hidden")}),t=ie();e.appendChild(t),this.closeOnBackdrop&&t.addEventListener("click",()=>this.close());let o=this.position==="left"?"left-0":"right-0",p=document.createElement("div");if(p.className=H("absolute top-0 h-full w-96 bg-white shadow-lg transition-transform duration-300 flex flex-col z-50",o,this.open?"translate-x-0":this.position==="left"?"-translate-x-full":"translate-x-full"),this.title){let k=document.createElement("div");k.className="px-6 py-4 border-b border-gray-200 flex items-center justify-between";let _=document.createElement("h2");if(_.className="text-xl font-semibold text-gray-900",_.textContent=this.title,k.appendChild(_),this.closeButton){let q=document.createElement("button");q.className="text-gray-500 hover:text-gray-700 transition-colors duration-200",q.innerHTML="\xD7",q.addEventListener("click",()=>this.close()),k.appendChild(q)}p.appendChild(k)}let b=document.createElement("div");return b.className="flex-1 overflow-y-auto px-6 py-4",b.innerHTML=this.content,p.appendChild(b),e.appendChild(p),this.on("keydown",k=>{ue.isEscape(k)&&this.closeOnEscape&&this.close()},{once:!1}),this.backdrop=t,this.drawerElement=p,e}open(){this.element||this.create(),this.open=!0,this.element.classList.remove("hidden"),this.drawerElement.classList.remove("-translate-x-full","translate-x-full"),this.drawerElement.classList.add("translate-x-0"),document.body.style.overflow="hidden"}close(){this.open=!1;let e=this.position==="left"?"-translate-x-full":"translate-x-full";this.drawerElement.classList.remove("translate-x-0"),this.drawerElement.classList.add(e),setTimeout(()=>{this.element?.parentNode&&this.element.classList.add("hidden"),document.body.style.overflow=""},300),this.onClose&&this.onClose()}toggle(){this.open?this.close():this.open()}}});var jt={};J(jt,{Empty:()=>Me});var Me,Nt=Q(()=>{Z();K();Me=class extends F{constructor(e={}){super(e),this.icon=e.icon||"\u{1F4E6}",this.title=e.title||"No data",this.message=e.message||"There is no data to display",this.action=e.action||null,this.className=e.className||""}create(){let e=super.create("div",{className:H("flex flex-col items-center justify-center p-8 text-center",this.className)}),t=N("div",{className:"text-6xl mb-4",text:this.icon});e.appendChild(t);let o=N("h3",{className:"text-lg font-semibold text-gray-900 mb-2",text:this.title});e.appendChild(o);let p=N("p",{className:"text-gray-500 mb-4",text:this.message});if(e.appendChild(p),this.action){let b=N("button",{className:"px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors",text:this.action.label});b.addEventListener("click",this.action.onClick),e.appendChild(b)}return e}}});var Ft={};J(Ft,{Form:()=>qe});var qe,zt=Q(()=>{Z();K();qe=class extends F{constructor(e={}){super(e),this.fields=e.fields||[],this.onSubmit=e.onSubmit||null,this.submitText=e.submitText||"Submit",this.className=e.className||""}create(){let e=super.create("form",{className:H("space-y-6",this.className)});e.addEventListener("submit",o=>{o.preventDefault(),this.handleSubmit()}),this.fieldElements={},this.fields.forEach(o=>{let p=N("div",{className:"space-y-2"});if(o.label){let _=N("label",{className:"block text-sm font-medium text-gray-700",text:o.label,attrs:{for:o.name}});p.appendChild(_)}let b=document.createElement(o.type==="textarea"?"textarea":"input");b.id=o.name,b.name=o.name,b.className=H("w-full px-3 py-2 border border-gray-300 rounded-md","focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"),o.type!=="textarea"&&(b.type=o.type||"text"),o.placeholder&&(b.placeholder=o.placeholder),o.required&&(b.required=!0),o.disabled&&(b.disabled=!0),b.value=o.value||"",p.appendChild(b);let k=N("div",{className:"text-sm text-red-600 hidden",attrs:{"data-error":o.name}});p.appendChild(k),e.appendChild(p),this.fieldElements[o.name]=b});let t=N("button",{className:H("w-full px-4 py-2 bg-blue-600 text-white font-medium rounded","hover:bg-blue-700 transition-colors duration-200"),text:this.submitText,attrs:{type:"submit"}});return e.appendChild(t),e}handleSubmit(){let e={};Object.entries(this.fieldElements).forEach(([t,o])=>{e[t]=o.value}),this.onSubmit&&this.onSubmit(e)}getValues(){let e={};return Object.entries(this.fieldElements).forEach(([t,o])=>{e[t]=o.value}),e}setValues(e){Object.entries(e).forEach(([t,o])=>{this.fieldElements[t]&&(this.fieldElements[t].value=o)})}setError(e,t){let o=this.element.querySelector(`[data-error="${e}"]`);o&&(o.textContent=t,o.classList.remove("hidden"))}clearError(e){let t=this.element.querySelector(`[data-error="${e}"]`);t&&(t.textContent="",t.classList.add("hidden"))}reset(){this.element&&this.element.reset()}}});var Ot={};J(Ot,{HoverCard:()=>He});var He,Rt=Q(()=>{Z();K();He=class extends F{constructor(e={}){super(e),this.trigger=e.trigger||"Hover me",this.content=e.content||"",this.position=e.position||"bottom",this.delay=e.delay||200,this.className=e.className||"",this.visible=!1,this.timeoutId=null}create(){let e=super.create("div",{className:"relative inline-block"}),t=document.createElement("div");t.className="cursor-pointer px-3 py-2 rounded hover:bg-gray-100 transition-colors duration-200",t.textContent=this.trigger,e.appendChild(t);let o=document.createElement("div");return o.className=H("absolute hidden bg-white border border-gray-200 rounded-lg shadow-lg p-4 z-50","min-w-max max-w-sm",this.getPositionClasses(),this.className),o.innerHTML=this.content,e.appendChild(o),e.addEventListener("mouseenter",()=>this.show(o)),e.addEventListener("mouseleave",()=>this.hide(o)),this.cardElement=o,e}getPositionClasses(){let e={top:"bottom-full left-0 mb-2",bottom:"top-full left-0 mt-2",left:"right-full top-0 mr-2",right:"left-full top-0 ml-2"};return e[this.position]||e.bottom}show(e=this.cardElement){this.visible||!e||(this.timeoutId=setTimeout(()=>{this.visible=!0,e.classList.remove("hidden"),e.classList.add("opacity-100","transition-opacity","duration-200")},this.delay))}hide(e=this.cardElement){!this.visible||!e||(clearTimeout(this.timeoutId),this.visible=!1,e.classList.add("hidden"),e.classList.remove("opacity-100"))}setContent(e){this.content=e,this.cardElement&&(this.cardElement.innerHTML=e)}}});var Dt={};J(Dt,{Input:()=>Pe});var Pe,Vt=Q(()=>{Z();K();Pe=class extends F{constructor(e={}){super(e),this.type=e.type||"text",this.placeholder=e.placeholder||"",this.value=e.value||"",this.name=e.name||"",this.disabled=e.disabled||!1,this.required=e.required||!1,this.className=e.className||"",this.onChange=e.onChange||null}create(){let t=super.create("input",{className:H("w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900 placeholder-gray-500 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed",this.className),attrs:{type:this.type,placeholder:this.placeholder,value:this.value,name:this.name,disabled:this.disabled?"":null,required:this.required?"":null}});return this.onChange&&(this.on("change",this.onChange),this.on("input",this.onChange)),t}getValue(){return this.element?.value||""}setValue(e){this.value=e,this.element&&(this.element.value=e)}setDisabled(e){this.disabled=e,this.attr("disabled",e?"":null)}setPlaceholder(e){this.placeholder=e,this.element&&(this.element.placeholder=e)}focus(){super.focus()}clear(){this.setValue("")}}});var Ut={};J(Ut,{InputGroup:()=>je});var je,Wt=Q(()=>{Z();K();je=class extends F{constructor(e={}){super(e),this.prefix=e.prefix||null,this.suffix=e.suffix||null,this.input=e.input||null,this.className=e.className||""}create(){let t=super.create("div",{className:H("flex items-center border border-gray-300 rounded-md overflow-hidden focus-within:ring-2 focus-within:ring-blue-500",this.className)});if(this.prefix){let o=N("div",{className:"px-3 py-2 bg-gray-50 text-gray-700 font-medium text-sm",html:this.prefix});t.appendChild(o)}if(this.input){let o=this.input.element||this.input.create();o.classList.remove("border","focus:ring-2","focus:ring-blue-500"),t.appendChild(o)}if(this.suffix){let o=N("div",{className:"px-3 py-2 bg-gray-50 text-gray-700 font-medium text-sm",html:this.suffix});t.appendChild(o)}return t}}});var Yt={};J(Yt,{InputOTP:()=>Ne});var Ne,Qt=Q(()=>{Z();K();Ne=class extends F{constructor(e={}){super(e),this.length=e.length||6,this.value=e.value||"",this.className=e.className||"",this.onChange=e.onChange||null,this.onComplete=e.onComplete||null}create(){let e=super.create("div",{className:H("flex gap-2",this.className)});this.inputs=[];for(let t=0;t<this.length;t++){let o=document.createElement("input");o.type="text",o.maxLength="1",o.inputMode="numeric",o.className=H("w-12 h-12 text-center border-2 border-gray-300 rounded-lg font-semibold text-lg","focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-200","transition-colors duration-200"),this.value&&this.value[t]&&(o.value=this.value[t]),o.addEventListener("input",p=>{let b=p.target.value;if(!/^\d*$/.test(b)){p.target.value="";return}b&&t<this.length-1&&this.inputs[t+1].focus(),this.updateValue()}),o.addEventListener("keydown",p=>{p.key==="Backspace"?!o.value&&t>0&&this.inputs[t-1].focus():p.key==="ArrowLeft"&&t>0?this.inputs[t-1].focus():p.key==="ArrowRight"&&t<this.length-1&&this.inputs[t+1].focus()}),this.inputs.push(o),e.appendChild(o)}return e}updateValue(){this.value=this.inputs.map(e=>e.value).join(""),this.onChange&&this.onChange(this.value),this.value.length===this.length&&this.onComplete&&this.onComplete(this.value)}getValue(){return this.value}setValue(e){this.value=e;for(let t=0;t<this.length;t++)this.inputs[t].value=e[t]||""}clear(){this.inputs.forEach(e=>{e.value=""}),this.value=""}focus(){this.inputs.length>0&&this.inputs[0].focus()}}});var Gt={};J(Gt,{Item:()=>Fe});var Fe,Jt=Q(()=>{Z();K();Fe=class extends F{constructor(e={}){super(e),this.label=e.label||"",this.value=e.value||"",this.icon=e.icon||null,this.className=e.className||"",this.selected=e.selected||!1,this.disabled=e.disabled||!1}create(){let e="flex items-center gap-2 px-3 py-2 rounded cursor-pointer transition-colors duration-200 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed",t=this.selected?"bg-blue-50 text-blue-600":"text-gray-900",o=super.create("div",{className:H(e,t,this.className),attrs:{role:"option","aria-selected":this.selected,disabled:this.disabled?"":null,"data-value":this.value}}),p="";return this.icon&&(p+=`<span class="flex-shrink-0">${this.icon}</span>`),p+=`<span>${this.label}</span>`,o.innerHTML=p,o}setSelected(e){this.selected=e,this.element&&(this.attr("aria-selected",e),this.toggleClass("bg-blue-50 text-blue-600",e))}setDisabled(e){this.disabled=e,this.attr("disabled",e?"":null)}}});var Xt={};J(Xt,{Label:()=>ze});var ze,Kt=Q(()=>{Z();K();ze=class extends F{constructor(e={}){super(e),this.text=e.text||"",this.htmlFor=e.htmlFor||"",this.required=e.required||!1,this.className=e.className||""}create(){let t=super.create("label",{className:H("block text-sm font-medium text-gray-700 mb-1",this.className),attrs:{for:this.htmlFor}}),o=this.text;return this.required&&(o+=' <span class="text-red-500 ml-1">*</span>'),t.innerHTML=o,t}setText(e){if(this.text=e,this.element){let t=e;this.required&&(t+=' <span class="text-red-500 ml-1">*</span>'),this.element.innerHTML=t}}setRequired(e){if(this.required=e,this.element){let t=this.element.querySelector('[class*="text-red"]');e&&!t?this.element.innerHTML+=' <span class="text-red-500 ml-1">*</span>':!e&&t&&t.remove()}}}});var Zt={};J(Zt,{Kbd:()=>Oe});var Oe,es=Q(()=>{Z();K();Oe=class extends F{constructor(e={}){super(e),this.label=e.label||"K",this.className=e.className||""}create(){let t=super.create("kbd",{className:H("px-2 py-1 bg-gray-100 border border-gray-300 rounded text-xs font-semibold text-gray-900 inline-block font-mono",this.className)});return t.textContent=this.label,t}setLabel(e){this.label=e,this.element&&(this.element.textContent=e)}}});var ts={};J(ts,{NativeSelect:()=>Re});var Re,ss=Q(()=>{Z();K();Re=class extends F{constructor(e={}){super(e),this.items=e.items||[],this.selected=e.selected||"",this.placeholder=e.placeholder||"Select...",this.disabled=e.disabled||!1,this.required=e.required||!1,this.name=e.name||"",this.className=e.className||"",this.onChange=e.onChange||null}create(){let t=super.create("select",{className:H("w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed bg-white appearance-none cursor-pointer",this.className),attrs:{disabled:this.disabled?"":null,required:this.required?"":null,...this.name&&{name:this.name}}});if(this.placeholder){let o=document.createElement("option");o.value="",o.textContent=this.placeholder,o.disabled=!0,t.appendChild(o)}return this.items.forEach(o=>{let p=document.createElement("option");p.value=o.value,p.textContent=o.label,o.value===this.selected&&(p.selected=!0),t.appendChild(p)}),this.onChange&&this.on("change",this.onChange),t}getValue(){return this.element?.value||""}setValue(e){this.selected=e,this.element&&(this.element.value=e)}setDisabled(e){this.disabled=e,this.attr("disabled",e?"":null)}addItem(e,t){if(this.element){let o=document.createElement("option");o.value=t,o.textContent=e,this.element.appendChild(o)}}removeItem(e){if(this.element){let t=this.element.querySelector(`option[value="${e}"]`);t&&t.remove()}}}});var rs={};J(rs,{Tooltip:()=>De});var De,as=Q(()=>{Z();K();De=class extends F{constructor(e={}){super(e),this.content=e.content||"",this.position=e.position||"top",this.delay=e.delay||200,this.trigger=e.trigger||"hover",this.className=e.className||"",this.visible=!1,this.timeoutId=null}create(){let e=super.create("div",{className:"relative inline-block"}),t=document.createElement("div");t.className=H("absolute hidden bg-gray-900 text-white px-3 py-2 rounded text-sm whitespace-nowrap z-50","opacity-0 transition-opacity duration-200",this.getPositionClasses(),this.className),t.textContent=this.content;let o=document.createElement("div");return o.className=H("absolute w-2 h-2 bg-gray-900 transform rotate-45",this.getArrowClasses()),t.appendChild(o),e.appendChild(t),this.tooltipElement=t,this.trigger==="hover"?(e.addEventListener("mouseenter",()=>this.show()),e.addEventListener("mouseleave",()=>this.hide())):this.trigger==="focus"&&(e.addEventListener("focus",()=>this.show(),!0),e.addEventListener("blur",()=>this.hide(),!0)),e}getPositionClasses(){let e={top:"bottom-full left-1/2 transform -translate-x-1/2 mb-2",bottom:"top-full left-1/2 transform -translate-x-1/2 mt-2",left:"right-full top-1/2 transform -translate-y-1/2 mr-2",right:"left-full top-1/2 transform -translate-y-1/2 ml-2"};return e[this.position]||e.top}getArrowClasses(){let e={top:"top-full left-1/2 transform -translate-x-1/2 -translate-y-1/2",bottom:"bottom-full left-1/2 transform -translate-x-1/2 translate-y-1/2",left:"left-full top-1/2 transform translate-x-1/2 -translate-y-1/2",right:"right-full top-1/2 transform -translate-x-1/2 -translate-y-1/2"};return e[this.position]||e.top}show(){this.visible||(this.timeoutId=setTimeout(()=>{this.visible=!0,this.tooltipElement.classList.remove("hidden"),this.tooltipElement.classList.add("opacity-100")},this.delay))}hide(){this.visible&&(clearTimeout(this.timeoutId),this.visible=!1,this.tooltipElement.classList.remove("opacity-100"),this.tooltipElement.classList.add("hidden"))}setContent(e){this.content=e,this.tooltipElement&&(this.tooltipElement.textContent=e)}}});var ns={};J(ns,{Toggle:()=>Ve});var Ve,os=Q(()=>{Z();K();Ve=class extends F{constructor(e={}){super(e),this.label=e.label||"",this.pressed=e.pressed||!1,this.disabled=e.disabled||!1,this.variant=e.variant||"default",this.size=e.size||"md",this.className=e.className||"",this.onChange=e.onChange||null}create(){let e="px-4 py-2 font-medium rounded transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed",t={default:this.pressed?"bg-gray-900 text-white":"bg-gray-100 text-gray-900 hover:bg-gray-200",outline:this.pressed?"border-2 border-gray-900 bg-gray-900 text-white":"border-2 border-gray-300 text-gray-900 hover:bg-gray-50"},o={sm:"px-2 py-1 text-sm",md:"px-4 py-2 text-base",lg:"px-6 py-3 text-lg"},p=super.create("button",{className:H(e,t[this.variant],o[this.size],this.className),attrs:{"aria-pressed":this.pressed,disabled:this.disabled?"":null}});return p.textContent=this.label,this.on("click",()=>{this.toggle()}),p}isPressed(){return this.pressed}setPressed(e){this.pressed=e,this.element&&(this.attr("aria-pressed",e),this.toggleClass("bg-gray-900 text-white",e),this.onChange&&this.onChange(e))}toggle(){this.setPressed(!this.pressed)}setDisabled(e){this.disabled=e,this.attr("disabled",e?"":null)}}});var is={};J(is,{ToggleGroup:()=>Ue});var Ue,ls=Q(()=>{Z();K();Ue=class extends F{constructor(e={}){super(e),this.items=e.items||[],this.selected=e.selected||null,this.multiple=e.multiple||!1,this.orientation=e.orientation||"horizontal",this.className=e.className||"",this.onChange=e.onChange||null}create(){let e=this.orientation==="vertical"?"flex-col":"flex-row",o=super.create("div",{className:H("flex",e,"inline-flex border border-gray-300 rounded-md overflow-hidden",this.className),attrs:{role:"group"}});return this.toggleButtons=[],this.items.forEach((p,b)=>{let k=this.multiple?Array.isArray(this.selected)&&this.selected.includes(p.value):p.value===this.selected,_=H("flex-1 px-4 py-2 font-medium transition-colors duration-200",k?"bg-blue-600 text-white":"bg-white text-gray-700 hover:bg-gray-50",b>0?this.orientation==="vertical"?"border-t border-gray-300":"border-l border-gray-300":""),q=N("button",{className:_,text:p.label,attrs:{"data-value":p.value,"aria-pressed":k,type:"button"}});q.addEventListener("click",()=>{if(this.multiple){Array.isArray(this.selected)||(this.selected=[]);let R=this.selected.indexOf(p.value);R>-1?this.selected.splice(R,1):this.selected.push(p.value)}else this.selected=p.value;this.updateView(),this.onChange&&this.onChange(this.selected)}),o.appendChild(q),this.toggleButtons.push(q)}),o}updateView(){this.toggleButtons.forEach(e=>{let t=e.getAttribute("data-value"),o=this.multiple?Array.isArray(this.selected)&&this.selected.includes(t):t===this.selected;e.setAttribute("aria-pressed",o),e.className=H("flex-1 px-4 py-2 font-medium transition-colors duration-200",o?"bg-blue-600 text-white":"bg-white text-gray-700 hover:bg-gray-50")})}getValue(){return this.selected}setValue(e){this.selected=e,this.updateView()}}});var ds={};J(ds,{Toast:()=>We});var We,cs=Q(()=>{Z();K();We=class n extends F{constructor(e={}){super(e),this.message=e.message||"",this.type=e.type||"default",typeof e.duration<"u"?this.duration=e.duration:this.duration=typeof window<"u"&&window.innerWidth<640?2500:3e3,this.position=e.position||"top-right",this.className=e.className||"",this.onClose=e.onClose||null}destroy(){if(!this.element)return;let e=this.element;e.classList.add(this.getExitAnimationClass());let t=()=>{e.removeEventListener("animationend",t),super.destroy();let o=n.getContainer(this.position);o&&o.childElementCount===0&&o.parentNode&&(o.parentNode.removeChild(o),n._containers&&delete n._containers[this.position||"top-right"])};e.addEventListener("animationend",t),setTimeout(t,320)}static getContainer(e){let t=e||"top-right";if(this._containers||(this._containers={}),this._containers[t]&&document.body.contains(this._containers[t]))return this._containers[t];let o=N("div",{className:H("fixed z-50 p-2 flex flex-col gap-2 pointer-events-none",this.getPositionClassesForContainer(t))});return document.body.appendChild(o),this._containers[t]=o,o}static getPositionClassesForContainer(e){switch(e){case"top-left":return"top-4 left-4 items-start";case"top-right":return"top-4 right-4 items-end";case"bottom-left":return"bottom-4 left-4 items-start";case"bottom-right":return"bottom-4 right-4 items-end";case"top-center":return"top-4 left-1/2 -translate-x-1/2 items-center transform";default:return"top-4 right-4 items-end"}}create(){let e=n.getContainer(this.position),t=N("div",{className:H("rounded-lg shadow-lg p-2.5 flex items-center gap-2 min-w-0 max-w-[90vw] sm:max-w-sm bg-opacity-95",this.getEnterAnimationClass(),this.getTypeClasses(),this.className)}),o=N("span",{className:"text-base flex-shrink-0",text:this.getIcon()});t.appendChild(o);let p=N("span",{text:this.message,className:"flex-1 text-sm sm:text-base"});t.appendChild(p),t.setAttribute("role",this.type==="error"?"alert":"status"),t.setAttribute("aria-live",this.type==="error"?"assertive":"polite");let b=N("button",{className:"text-base hover:opacity-70 transition-opacity flex-shrink-0",text:"\xD7"});for(b.setAttribute("aria-label","Dismiss notification"),b.addEventListener("click",()=>{this.destroy()}),t.appendChild(b),this.element=t,e.appendChild(this.element);e.children.length>3;)e.removeChild(e.firstElementChild);return this.duration>0&&setTimeout(()=>{this.destroy()},this.duration),this.element}getEnterAnimationClass(){let e=this.position||"top-right";return e==="top-right"||e==="bottom-right"?"animate-slide-in-right transition-all duration-300 pointer-events-auto":e==="top-left"||e==="bottom-left"?"animate-slide-in-left transition-all duration-300 pointer-events-auto":"animate-slide-in-top transition-all duration-300 pointer-events-auto"}getExitAnimationClass(){let e=this.position||"top-right";return e==="top-right"||e==="bottom-right"?"animate-slide-out-right":e==="top-left"||e==="bottom-left"?"animate-slide-out-left":"animate-slide-out-top"}getPositionClasses(){let e={"top-left":"top-4 left-4","top-right":"top-4 right-4","bottom-left":"bottom-4 left-4","bottom-right":"bottom-4 right-4","top-center":"top-4 left-1/2 -translate-x-1/2 transform"};return e[this.position]||e["bottom-right"]}getTypeClasses(){let e={default:"bg-gray-900 text-white",success:"bg-green-600 text-white",error:"bg-red-600 text-white",warning:"bg-yellow-600 text-white",info:"bg-blue-600 text-white"};return e[this.type]||e.default}getIcon(){let e={default:"\u2139",success:"\u2713",error:"\u2715",warning:"\u26A0",info:"\u2139"};return e[this.type]||e.default}static show(e,t={}){let o=new n({message:e,...t}),p=o.create();return o}static success(e,t={}){return this.show(e,{...t,type:"success"})}static error(e,t={}){return this.show(e,{...t,type:"error",position:t.position||"top-right"})}static info(e,t={}){return this.show(e,{...t,type:"info"})}static warning(e,t={}){return this.show(e,{...t,type:"warning"})}};if(!document.querySelector("style[data-toast]")){let n=document.createElement("style");n.setAttribute("data-toast","true"),n.textContent=`
    @keyframes slideInTop {
      from { transform: translateY(-12px); opacity: 0; }
      to { transform: translateY(0); opacity: 1; }
    }
    .animate-slide-in-top { animation: slideInTop 0.25s ease-out; }

    @keyframes slideOutTop {
      from { transform: translateY(0); opacity: 1; }
      to { transform: translateY(-12px); opacity: 0; }
    }
    .animate-slide-out-top { animation: slideOutTop 0.2s ease-in forwards; }

    @keyframes slideInRight {
      from { transform: translateX(16px); opacity: 0; }
      to { transform: translateX(0); opacity: 1; }
    }
    .animate-slide-in-right { animation: slideInRight 0.25s ease-out; }

    @keyframes slideOutRight {
      from { transform: translateX(0); opacity: 1; }
      to { transform: translateX(16px); opacity: 0; }
    }
    .animate-slide-out-right { animation: slideOutRight 0.2s ease-in forwards; }

    @keyframes slideInLeft {
      from { transform: translateX(-16px); opacity: 0; }
      to { transform: translateX(0); opacity: 1; }
    }
    .animate-slide-in-left { animation: slideInLeft 0.25s ease-out; }

    @keyframes slideOutLeft {
      from { transform: translateX(0); opacity: 1; }
      to { transform: translateX(-16px); opacity: 0; }
    }
    .animate-slide-out-left { animation: slideOutLeft 0.2s ease-in forwards; }
  `,document.head.appendChild(n)}});function us({root:n=document,selector:e="[data-hydrate]",threshold:t=.15}={}){if(typeof IntersectionObserver>"u")return;let o=new IntersectionObserver(async(p,b)=>{for(let k of p){if(!k.isIntersecting)continue;let _=k.target,q=_.dataset.hydrate||"",[R,Y="init"]=q.split("#");if(!R){b.unobserve(_);continue}try{let j=null,y=ar[R];if(typeof y=="function")j=await y();else throw new Error("Module not registered for lazy hydration: "+R);let M=j[Y]||j.default||null;if(typeof M=="function")try{M(_)}catch(D){console.error("hydrate init failed",D)}}catch(j){console.error("lazy hydrate import failed for",R,j)}finally{b.unobserve(_)}}},{threshold:t});n.querySelectorAll(e).forEach(p=>o.observe(p))}var ar,ms=Q(()=>{ar={"components/Alert.js":()=>Promise.resolve().then(()=>(et(),Ze)),"components/AlertDialog.js":()=>Promise.resolve().then(()=>(st(),tt)),"components/Avatar.js":()=>Promise.resolve().then(()=>(at(),rt)),"components/Badge.js":()=>Promise.resolve().then(()=>(ot(),nt)),"components/Button.js":()=>Promise.resolve().then(()=>(lt(),it)),"components/ButtonGroup.js":()=>Promise.resolve().then(()=>(ct(),dt)),"components/Breadcrumb.js":()=>Promise.resolve().then(()=>(mt(),ut)),"components/Card.js":()=>Promise.resolve().then(()=>(gt(),pt)),"components/Carousel.js":()=>Promise.resolve().then(()=>(ft(),ht)),"components/Chart.js":()=>Promise.resolve().then(()=>(bt(),xt)),"components/Checkbox.js":()=>Promise.resolve().then(()=>(yt(),vt)),"components/Collapsible.js":()=>Promise.resolve().then(()=>(kt(),wt)),"components/Command.js":()=>Promise.resolve().then(()=>(Ct(),Et)),"components/Combobox.js":()=>Promise.resolve().then(()=>($t(),Lt)),"components/ContextMenu.js":()=>Promise.resolve().then(()=>(It(),Tt)),"components/DatePicker.js":()=>Promise.resolve().then(()=>(St(),Bt)),"components/Dialog.js":()=>Promise.resolve().then(()=>(_t(),At)),"components/DropdownMenu.js":()=>Promise.resolve().then(()=>(qt(),Mt)),"components/Drawer.js":()=>Promise.resolve().then(()=>(Pt(),Ht)),"components/Empty.js":()=>Promise.resolve().then(()=>(Nt(),jt)),"components/Form.js":()=>Promise.resolve().then(()=>(zt(),Ft)),"components/HoverCard.js":()=>Promise.resolve().then(()=>(Rt(),Ot)),"components/Input.js":()=>Promise.resolve().then(()=>(Vt(),Dt)),"components/InputGroup.js":()=>Promise.resolve().then(()=>(Wt(),Ut)),"components/InputOTP.js":()=>Promise.resolve().then(()=>(Qt(),Yt)),"components/Item.js":()=>Promise.resolve().then(()=>(Jt(),Gt)),"components/Label.js":()=>Promise.resolve().then(()=>(Kt(),Xt)),"components/Kbd.js":()=>Promise.resolve().then(()=>(es(),Zt)),"components/NativeSelect.js":()=>Promise.resolve().then(()=>(ss(),ts)),"components/Tooltip.js":()=>Promise.resolve().then(()=>(as(),rs)),"components/Toggle.js":()=>Promise.resolve().then(()=>(os(),ns)),"components/ToggleGroup.js":()=>Promise.resolve().then(()=>(ls(),is)),"components/Toast.js":()=>Promise.resolve().then(()=>(cs(),ds))}});var gs={};J(gs,{default:()=>nr});var ps,nr,hs=Q(()=>{ps=(function(){"use strict";let n=null;async function e(){if(AuthGuard.protectPage()){await R();try{D()}catch{}Y(),M(),A(),E(),t()}}function t(){o(),p(),b(),k(),_(),q()}function o(){let r=document.getElementById("loyalty-points");if(!r)return;let s=n?.loyalty_points||Math.floor(Math.random()*500)+100,i=s>=500?"Gold":s>=200?"Silver":"Bronze",l={Bronze:"from-amber-600 to-amber-700",Silver:"from-gray-400 to-gray-500",Gold:"from-yellow-400 to-yellow-500"},c=i==="Gold"?null:i==="Silver"?"Gold":"Silver",h=i==="Gold"?0:i==="Silver"?500:200,u=c?Math.min(100,s/h*100):100;r.innerHTML=`
            <div class="bg-gradient-to-br ${l[i]} rounded-2xl p-6 text-white relative overflow-hidden">
                <div class="absolute top-0 right-0 w-32 h-32 opacity-10">
                    <svg viewBox="0 0 24 24" fill="currentColor" class="w-full h-full">
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                    </svg>
                </div>
                <div class="relative">
                    <div class="flex items-center justify-between mb-4">
                        <div>
                            <p class="text-white/80 text-sm font-medium">${i} Member</p>
                            <p class="text-3xl font-bold">${s.toLocaleString()} pts</p>
                        </div>
                        <div class="w-14 h-14 bg-white/20 backdrop-blur rounded-xl flex items-center justify-center">
                            <svg class="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                            </svg>
                        </div>
                    </div>
                    ${c?`
                        <div class="mt-4">
                            <div class="flex justify-between text-sm mb-1">
                                <span>${h-s} points to ${c}</span>
                                <span>${Math.round(u)}%</span>
                            </div>
                            <div class="w-full bg-white/30 rounded-full h-2">
                                <div class="bg-white h-2 rounded-full transition-all duration-500" style="width: ${u}%"></div>
                            </div>
                        </div>
                    `:`<p class="text-sm text-white/80 mt-2">\u{1F389} You've reached the highest tier!</p>`}
                    <div class="mt-4 pt-4 border-t border-white/20">
                        <a href="/loyalty/" class="text-sm font-medium hover:underline flex items-center gap-1">
                            View Rewards
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
                        </a>
                    </div>
                </div>
            </div>
        `}function p(){let r=document.getElementById("quick-stats");if(!r)return;let s={totalOrders:n?.total_orders||Math.floor(Math.random()*20)+5,totalSpent:n?.total_spent||Math.floor(Math.random()*1e3)+200,wishlistItems:n?.wishlist_count||Math.floor(Math.random()*10)+2,savedAddresses:n?.address_count||Math.floor(Math.random()*3)+1};r.innerHTML=`
            <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div class="bg-white dark:bg-stone-800 rounded-xl p-4 border border-gray-100 dark:border-stone-700">
                    <div class="flex items-center gap-3">
                        <div class="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                            <svg class="w-5 h-5 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/></svg>
                        </div>
                        <div>
                            <p class="text-2xl font-bold text-stone-900 dark:text-white">${s.totalOrders}</p>
                            <p class="text-xs text-stone-500 dark:text-stone-400">Total Orders</p>
                        </div>
                    </div>
                </div>
                <div class="bg-white dark:bg-stone-800 rounded-xl p-4 border border-gray-100 dark:border-stone-700">
                    <div class="flex items-center gap-3">
                        <div class="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                            <svg class="w-5 h-5 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                        </div>
                        <div>
                            <p class="text-2xl font-bold text-stone-900 dark:text-white">${Templates.formatPrice(s.totalSpent)}</p>
                            <p class="text-xs text-stone-500 dark:text-stone-400">Total Spent</p>
                        </div>
                    </div>
                </div>
                <div class="bg-white dark:bg-stone-800 rounded-xl p-4 border border-gray-100 dark:border-stone-700">
                    <div class="flex items-center gap-3">
                        <div class="w-10 h-10 bg-rose-100 dark:bg-rose-900/30 rounded-lg flex items-center justify-center">
                            <svg class="w-5 h-5 text-rose-600 dark:text-rose-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/></svg>
                        </div>
                        <div>
                            <p class="text-2xl font-bold text-stone-900 dark:text-white">${s.wishlistItems}</p>
                            <p class="text-xs text-stone-500 dark:text-stone-400">Wishlist Items</p>
                        </div>
                    </div>
                </div>
                <div class="bg-white dark:bg-stone-800 rounded-xl p-4 border border-gray-100 dark:border-stone-700">
                    <div class="flex items-center gap-3">
                        <div class="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
                            <svg class="w-5 h-5 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
                        </div>
                        <div>
                            <p class="text-2xl font-bold text-stone-900 dark:text-white">${s.savedAddresses}</p>
                            <p class="text-xs text-stone-500 dark:text-stone-400">Saved Addresses</p>
                        </div>
                    </div>
                </div>
            </div>
        `}async function b(){let r=document.getElementById("recent-activity");if(r)try{let i=(await OrdersApi.getAll({limit:3})).data||[];if(i.length===0){r.innerHTML=`
                    <div class="text-center py-6 text-stone-500 dark:text-stone-400">
                        <p>No recent activity</p>
                    </div>
                `;return}r.innerHTML=`
                <div class="bg-white dark:bg-stone-800 rounded-xl border border-gray-100 dark:border-stone-700 overflow-hidden">
                    <div class="px-4 py-3 border-b border-gray-100 dark:border-stone-700 flex items-center justify-between">
                        <h3 class="font-semibold text-stone-900 dark:text-white">Recent Orders</h3>
                        <a href="/orders/" class="text-sm text-primary-600 dark:text-amber-400 hover:underline">View All</a>
                    </div>
                    <div class="divide-y divide-gray-100 dark:divide-stone-700">
                        ${i.map(l=>{let h={pending:"text-yellow-600 dark:text-yellow-400",processing:"text-blue-600 dark:text-blue-400",shipped:"text-indigo-600 dark:text-indigo-400",delivered:"text-green-600 dark:text-green-400",cancelled:"text-red-600 dark:text-red-400"}[l.status]||"text-stone-600 dark:text-stone-400",u=l.items?.[0];return`
                                <a href="/orders/${l.id}/" class="flex items-center gap-4 p-4 hover:bg-stone-50 dark:hover:bg-stone-700/50 transition-colors">
                                    <div class="w-12 h-12 bg-stone-100 dark:bg-stone-700 rounded-lg overflow-hidden flex-shrink-0">
                                        ${u?.product?.image?`<img src="${u.product.image}" alt="" class="w-full h-full object-cover">`:`<div class="w-full h-full flex items-center justify-center text-stone-400">
                                                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/></svg>
                                            </div>`}
                                    </div>
                                    <div class="flex-1 min-w-0">
                                        <p class="font-medium text-stone-900 dark:text-white truncate">Order #${Templates.escapeHtml(l.order_number||l.id)}</p>
                                        <p class="text-sm ${h}">${Templates.escapeHtml(l.status_display||l.status)}</p>
                                    </div>
                                    <div class="text-right">
                                        <p class="font-semibold text-stone-900 dark:text-white">${Templates.formatPrice(l.total)}</p>
                                        <p class="text-xs text-stone-500 dark:text-stone-400">${Templates.formatDate(l.created_at)}</p>
                                    </div>
                                </a>
                            `}).join("")}
                    </div>
                </div>
            `}catch{r.innerHTML=""}}function k(){let r=document.getElementById("notification-preferences");if(!r)return;let s=JSON.parse(localStorage.getItem("notificationPreferences")||"{}"),l={...{orderUpdates:!0,promotions:!0,newArrivals:!1,priceDrops:!0,newsletter:!1},...s};r.innerHTML=`
            <div class="space-y-4">
                <div class="flex items-center justify-between">
                    <div>
                        <p class="font-medium text-stone-900 dark:text-white">Order Updates</p>
                        <p class="text-sm text-stone-500 dark:text-stone-400">Get notified about your order status</p>
                    </div>
                    <label class="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" class="sr-only peer" data-pref="orderUpdates" ${l.orderUpdates?"checked":""}>
                        <div class="w-11 h-6 bg-stone-200 dark:bg-stone-600 peer-focus:ring-2 peer-focus:ring-primary-300 dark:peer-focus:ring-amber-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600 dark:peer-checked:bg-amber-500"></div>
                    </label>
                </div>
                <div class="flex items-center justify-between">
                    <div>
                        <p class="font-medium text-stone-900 dark:text-white">Promotions & Sales</p>
                        <p class="text-sm text-stone-500 dark:text-stone-400">Be the first to know about deals</p>
                    </div>
                    <label class="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" class="sr-only peer" data-pref="promotions" ${l.promotions?"checked":""}>
                        <div class="w-11 h-6 bg-stone-200 dark:bg-stone-600 peer-focus:ring-2 peer-focus:ring-primary-300 dark:peer-focus:ring-amber-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600 dark:peer-checked:bg-amber-500"></div>
                    </label>
                </div>
                <div class="flex items-center justify-between">
                    <div>
                        <p class="font-medium text-stone-900 dark:text-white">Price Drops</p>
                        <p class="text-sm text-stone-500 dark:text-stone-400">Alert when wishlist items go on sale</p>
                    </div>
                    <label class="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" class="sr-only peer" data-pref="priceDrops" ${l.priceDrops?"checked":""}>
                        <div class="w-11 h-6 bg-stone-200 dark:bg-stone-600 peer-focus:ring-2 peer-focus:ring-primary-300 dark:peer-focus:ring-amber-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600 dark:peer-checked:bg-amber-500"></div>
                    </label>
                </div>
                <div class="flex items-center justify-between">
                    <div>
                        <p class="font-medium text-stone-900 dark:text-white">New Arrivals</p>
                        <p class="text-sm text-stone-500 dark:text-stone-400">Updates on new products</p>
                    </div>
                    <label class="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" class="sr-only peer" data-pref="newArrivals" ${l.newArrivals?"checked":""}>
                        <div class="w-11 h-6 bg-stone-200 dark:bg-stone-600 peer-focus:ring-2 peer-focus:ring-primary-300 dark:peer-focus:ring-amber-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600 dark:peer-checked:bg-amber-500"></div>
                    </label>
                </div>
            </div>
        `,r.querySelectorAll("input[data-pref]").forEach(c=>{c.addEventListener("change",()=>{let h=c.dataset.pref,u=JSON.parse(localStorage.getItem("notificationPreferences")||"{}");u[h]=c.checked,localStorage.setItem("notificationPreferences",JSON.stringify(u)),Toast.success("Preference saved")})})}function _(){let r=document.getElementById("quick-reorder");if(!r)return;let s=JSON.parse(localStorage.getItem("recentlyOrdered")||"[]");if(s.length===0){r.classList.add("hidden");return}r.innerHTML=`
            <div class="bg-white dark:bg-stone-800 rounded-xl border border-gray-100 dark:border-stone-700 p-4">
                <h3 class="font-semibold text-stone-900 dark:text-white mb-4">Quick Reorder</h3>
                <div class="flex gap-3 overflow-x-auto pb-2">
                    ${s.slice(0,5).map(i=>`
                        <button class="quick-reorder-btn flex-shrink-0 flex flex-col items-center gap-2 p-3 bg-stone-50 dark:bg-stone-700 rounded-xl hover:bg-stone-100 dark:hover:bg-stone-600 transition-colors" data-product-id="${i.id}">
                            <div class="w-16 h-16 rounded-lg bg-stone-200 dark:bg-stone-600 overflow-hidden">
                                <img src="${i.image||"/static/images/placeholder.jpg"}" alt="${Templates.escapeHtml(i.name)}" class="w-full h-full object-cover">
                            </div>
                            <span class="text-xs font-medium text-stone-700 dark:text-stone-300 text-center line-clamp-2 w-20">${Templates.escapeHtml(i.name)}</span>
                        </button>
                    `).join("")}
                </div>
            </div>
        `,r.querySelectorAll(".quick-reorder-btn").forEach(i=>{i.addEventListener("click",async()=>{let l=i.dataset.productId;i.disabled=!0;try{await CartApi.addItem(l,1),Toast.success("Added to cart!"),document.dispatchEvent(new CustomEvent("cart:updated"))}catch{Toast.error("Failed to add to cart")}finally{i.disabled=!1}})})}function q(){let r=document.getElementById("security-check");if(!r)return;let s=0,i=[],l=n?.email_verified!==!1;l&&(s+=25),i.push({label:"Email verified",completed:l});let c=!!n?.phone;c&&(s+=25),i.push({label:"Phone number added",completed:c});let h=n?.two_factor_enabled||!1;h&&(s+=25),i.push({label:"Two-factor authentication",completed:h});let u=!0;u&&(s+=25),i.push({label:"Strong password",completed:u});let f=s>=75?"text-green-600 dark:text-green-400":s>=50?"text-yellow-600 dark:text-yellow-400":"text-red-600 dark:text-red-400",I=s>=75?"bg-green-500":s>=50?"bg-yellow-500":"bg-red-500";r.innerHTML=`
            <div class="bg-white dark:bg-stone-800 rounded-xl border border-gray-100 dark:border-stone-700 p-4">
                <div class="flex items-center justify-between mb-4">
                    <h3 class="font-semibold text-stone-900 dark:text-white">Account Security</h3>
                    <span class="${f} font-bold">${s}%</span>
                </div>
                <div class="w-full bg-stone-200 dark:bg-stone-600 rounded-full h-2 mb-4">
                    <div class="${I} h-2 rounded-full transition-all duration-500" style="width: ${s}%"></div>
                </div>
                <div class="space-y-2">
                    ${i.map(T=>`
                        <div class="flex items-center gap-2 text-sm">
                            ${T.completed?'<svg class="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/></svg>':'<svg class="w-4 h-4 text-stone-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" stroke-width="2"/></svg>'}
                            <span class="${T.completed?"text-stone-700 dark:text-stone-300":"text-stone-500 dark:text-stone-400"}">${T.label}</span>
                        </div>
                    `).join("")}
                </div>
            </div>
        `}async function R(){if(AuthApi.isAuthenticated())try{n=(await AuthApi.getProfile()).data,j()}catch{Toast.error("Failed to load profile.")}}function Y(){let r=document.querySelectorAll("[data-profile-tab]"),s=document.querySelectorAll("[data-profile-panel]");if(!r.length||!s.length)return;let i=c=>{s.forEach(h=>{h.classList.toggle("hidden",h.dataset.profilePanel!==c)}),r.forEach(h=>{let u=h.dataset.profileTab===c;h.classList.toggle("bg-amber-600",u),h.classList.toggle("text-white",u),h.classList.toggle("shadow-sm",u),h.classList.toggle("text-stone-700",!u),h.classList.toggle("dark:text-stone-200",!u)}),localStorage.setItem("profileTab",c)},l=localStorage.getItem("profileTab")||"overview";i(l),r.forEach(c=>{c.addEventListener("click",()=>{i(c.dataset.profileTab)})})}function j(){let r=document.getElementById("profile-info");if(!r||!n)return;let s=`${Templates.escapeHtml(n.first_name||"")} ${Templates.escapeHtml(n.last_name||"")}`.trim()||Templates.escapeHtml(n.email||"User"),i=Templates.formatDate(n.created_at||n.date_joined),l=n.avatar?`<img id="avatar-preview" src="${n.avatar}" alt="Profile" class="w-full h-full object-cover">`:`
            <span class="flex h-full w-full items-center justify-center text-3xl font-semibold text-stone-500">
                ${(n.first_name?.[0]||n.email?.[0]||"U").toUpperCase()}
            </span>`;r.innerHTML=`
            <div class="absolute inset-0 bg-gradient-to-r from-amber-50/80 via-amber-100/60 to-transparent dark:from-amber-900/20 dark:via-amber-800/10" aria-hidden="true"></div>
            <div class="relative flex flex-col gap-4 md:flex-row md:items-center md:gap-6">
                <div class="relative">
                    <div class="w-24 h-24 rounded-2xl ring-4 ring-amber-100 dark:ring-amber-900/40 overflow-hidden bg-stone-100 dark:bg-stone-800">
                        ${l}
                    </div>
                </div>
                <div class="flex-1 min-w-0">
                    <p class="text-sm font-semibold text-amber-700 dark:text-amber-300">Profile</p>
                    <h1 class="text-2xl font-bold text-stone-900 dark:text-white leading-tight truncate">${s}</h1>
                    <p class="text-sm text-stone-600 dark:text-stone-300 truncate">${Templates.escapeHtml(n.email)}</p>
                    <p class="text-xs text-stone-500 dark:text-stone-400 mt-1">Member since ${i}</p>
                    <div class="flex flex-wrap gap-2 mt-4">
                        <button type="button" id="change-avatar-btn" class="btn btn-primary btn-sm">Update photo</button>
                        ${n.avatar?'<button type="button" id="remove-avatar-btn" class="btn btn-ghost btn-sm text-red-600 hover:text-red-700 dark:text-red-400">Remove photo</button>':""}
                    </div>
                    <p class="text-xs text-stone-500 dark:text-stone-400 mt-3">JPG, GIF or PNG. Max size 5MB.</p>
                </div>
            </div>
        `,D()}function y(){Tabs.init()}function M(){let r=document.getElementById("profile-form");if(!r||!n)return;let s=document.getElementById("profile-first-name"),i=document.getElementById("profile-last-name"),l=document.getElementById("profile-email"),c=document.getElementById("profile-phone");s&&(s.value=n.first_name||""),i&&(i.value=n.last_name||""),l&&(l.value=n.email||""),c&&(c.value=n.phone||""),r.addEventListener("submit",async h=>{h.preventDefault();let u=new FormData(r),f={first_name:u.get("first_name"),last_name:u.get("last_name"),phone:u.get("phone")},I=r.querySelector('button[type="submit"]');I.disabled=!0,I.textContent="Saving...";try{await AuthApi.updateProfile(f),Toast.success("Profile updated successfully!"),await R()}catch(T){Toast.error(T.message||"Failed to update profile.")}finally{I.disabled=!1,I.textContent="Save Changes"}})}function D(){let r=document.getElementById("avatar-input"),s=document.getElementById("change-avatar-btn"),i=document.getElementById("remove-avatar-btn");r||(r=document.createElement("input"),r.type="file",r.id="avatar-input",r.name="avatar",r.accept="image/*",r.className="hidden",document.body.appendChild(r)),document.querySelectorAll("#change-avatar-btn").forEach(h=>h.addEventListener("click",()=>r.click())),document.querySelectorAll("#remove-avatar-btn").forEach(h=>h.addEventListener("click",()=>{typeof window.removeAvatar=="function"&&window.removeAvatar()})),r.removeEventListener?.("change",window._avatarChangeHandler),window._avatarChangeHandler=async function(h){let u=h.target.files?.[0];if(u){if(!u.type.startsWith("image/")){Toast.error("Please select an image file.");return}if(u.size>5242880){Toast.error("Image must be smaller than 5MB.");return}try{await AuthApi.uploadAvatar(u),Toast.success("Avatar updated!"),await R()}catch(f){Toast.error(f.message||"Failed to update avatar.")}}},r.addEventListener("change",window._avatarChangeHandler)}function A(){let r=document.getElementById("password-form");r&&r.addEventListener("submit",async s=>{s.preventDefault();let i=new FormData(r),l=i.get("current_password"),c=i.get("new_password"),h=i.get("confirm_password");if(c!==h){Toast.error("Passwords do not match.");return}if(c.length<8){Toast.error("Password must be at least 8 characters.");return}let u=r.querySelector('button[type="submit"]');u.disabled=!0,u.textContent="Updating...";try{await AuthApi.changePassword(l,c),Toast.success("Password updated successfully!"),r.reset()}catch(f){Toast.error(f.message||"Failed to update password.")}finally{u.disabled=!1,u.textContent="Update Password"}})}function E(){v(),document.getElementById("add-address-btn")?.addEventListener("click",()=>{L()})}async function v(){let r=document.getElementById("addresses-list");if(r){Loader.show(r,"spinner");try{let i=(await AuthApi.getAddresses()).data||[];if(i.length===0){r.innerHTML=`
                    <div class="text-center py-8">
                        <svg class="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
                        </svg>
                        <p class="text-gray-500">No saved addresses yet.</p>
                    </div>
                `;return}r.innerHTML=`
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    ${i.map(l=>`
                        <div class="p-4 border border-gray-200 rounded-lg relative" data-address-id="${l.id}">
                            ${l.is_default?`
                                <span class="absolute top-2 right-2 px-2 py-0.5 bg-primary-100 text-primary-700 text-xs rounded">Default</span>
                            `:""}
                            <p class="font-medium text-gray-900">${Templates.escapeHtml(l.full_name||`${l.first_name} ${l.last_name}`)}</p>
                            <p class="text-sm text-gray-600 mt-1">${Templates.escapeHtml(l.address_line_1)}</p>
                            ${l.address_line_2?`<p class="text-sm text-gray-600">${Templates.escapeHtml(l.address_line_2)}</p>`:""}
                            <p class="text-sm text-gray-600">${Templates.escapeHtml(l.city)}, ${Templates.escapeHtml(l.state||"")} ${Templates.escapeHtml(l.postal_code)}</p>
                            <p class="text-sm text-gray-600">${Templates.escapeHtml(l.country)}</p>
                            ${l.phone?`<p class="text-sm text-gray-600 mt-1">${Templates.escapeHtml(l.phone)}</p>`:""}
                            
                            <div class="mt-4 flex gap-2">
                                <button class="edit-address-btn text-sm text-primary-600 hover:text-primary-700" data-address-id="${l.id}">Edit</button>
                                ${l.is_default?"":`
                                    <button class="set-default-btn text-sm text-gray-600 hover:text-gray-700" data-address-id="${l.id}">Set as Default</button>
                                `}
                                <button class="delete-address-btn text-sm text-red-600 hover:text-red-700" data-address-id="${l.id}">Delete</button>
                            </div>
                        </div>
                    `).join("")}
                </div>
            `,S()}catch(s){console.error("Failed to load addresses:",s),r.innerHTML='<p class="text-red-500">Failed to load addresses.</p>'}}}function S(){document.querySelectorAll(".edit-address-btn").forEach(r=>{r.addEventListener("click",async()=>{let s=r.dataset.addressId;try{let i=await AuthApi.getAddress(s);L(i.data)}catch{Toast.error("Failed to load address.")}})}),document.querySelectorAll(".set-default-btn").forEach(r=>{r.addEventListener("click",async()=>{let s=r.dataset.addressId;try{await AuthApi.setDefaultAddress(s),Toast.success("Default address updated."),await v()}catch{Toast.error("Failed to update default address.")}})}),document.querySelectorAll(".delete-address-btn").forEach(r=>{r.addEventListener("click",async()=>{let s=r.dataset.addressId;if(await Modal.confirm({title:"Delete Address",message:"Are you sure you want to delete this address?",confirmText:"Delete",cancelText:"Cancel"}))try{await AuthApi.deleteAddress(s),Toast.success("Address deleted."),await v()}catch{Toast.error("Failed to delete address.")}})})}function L(r=null){let s=!!r;Modal.open({title:s?"Edit Address":"Add New Address",content:`
                <form id="address-modal-form" class="space-y-4">
                    <div class="grid grid-cols-2 gap-4">
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">First Name *</label>
                            <input type="text" name="first_name" value="${r?.first_name||""}" required class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500">
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">Last Name *</label>
                            <input type="text" name="last_name" value="${r?.last_name||""}" required class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500">
                        </div>
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                        <input type="tel" name="phone" value="${r?.phone||""}" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500">
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Address Line 1 *</label>
                        <input type="text" name="address_line_1" value="${r?.address_line_1||""}" required class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500">
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Address Line 2</label>
                        <input type="text" name="address_line_2" value="${r?.address_line_2||""}" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500">
                    </div>
                    <div class="grid grid-cols-2 gap-4">
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">City *</label>
                            <input type="text" name="city" value="${r?.city||""}" required class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500">
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">State/Province</label>
                            <input type="text" name="state" value="${r?.state||""}" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500">
                        </div>
                    </div>
                    <div class="grid grid-cols-2 gap-4">
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">Postal Code *</label>
                            <input type="text" name="postal_code" value="${r?.postal_code||""}" required class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500">
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">Country *</label>
                            <select name="country" required class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500">
                                <option value="">Select country</option>
                                <option value="BD" ${r?.country==="BD"?"selected":""}>Bangladesh</option>
                                <option value="US" ${r?.country==="US"?"selected":""}>United States</option>
                                <option value="UK" ${r?.country==="UK"?"selected":""}>United Kingdom</option>
                                <option value="CA" ${r?.country==="CA"?"selected":""}>Canada</option>
                                <option value="AU" ${r?.country==="AU"?"selected":""}>Australia</option>
                            </select>
                        </div>
                    </div>
                    <div>
                        <label class="flex items-center">
                            <input type="checkbox" name="is_default" ${r?.is_default?"checked":""} class="text-primary-600 focus:ring-primary-500 rounded">
                            <span class="ml-2 text-sm text-gray-600">Set as default address</span>
                        </label>
                    </div>
                </form>
            `,confirmText:s?"Save Changes":"Add Address",onConfirm:async()=>{let i=document.getElementById("address-modal-form"),l=new FormData(i),c={first_name:l.get("first_name"),last_name:l.get("last_name"),phone:l.get("phone"),address_line_1:l.get("address_line_1"),address_line_2:l.get("address_line_2"),city:l.get("city"),state:l.get("state"),postal_code:l.get("postal_code"),country:l.get("country"),is_default:l.get("is_default")==="on"};try{return s?(await AuthApi.updateAddress(r.id,c),Toast.success("Address updated!")):(await AuthApi.addAddress(c),Toast.success("Address added!")),await v(),!0}catch(h){return Toast.error(h.message||"Failed to save address."),!1}}})}function g(){n=null}return{init:e,destroy:g}})();window.AccountPage=ps;nr=ps});var xs={};J(xs,{default:()=>or});var fs,or,bs=Q(()=>{fs=(function(){"use strict";let n=null,e=[],t=null,o=6e4;function p(){}function b(C){if(C==null||C==="")return 0;if(typeof C=="number"&&Number.isFinite(C))return C;let B=parseFloat(C);return Number.isFinite(B)?B:0}function k(C){let B=b(C);return Templates.formatPrice(B)}async function _(){await s(),T(),q()}function q(){R(),j(),A(),v(),S(),L(),r()}function R(){e=JSON.parse(localStorage.getItem("savedForLater")||"[]"),Y()}function Y(){let C=document.getElementById("saved-for-later");if(C){if(e.length===0){C.innerHTML="",C.classList.add("hidden");return}C.classList.remove("hidden"),C.innerHTML=`
            <div class="mt-8 bg-white dark:bg-stone-800 rounded-xl shadow-sm border border-gray-100 dark:border-stone-700 overflow-hidden">
                <div class="px-6 py-4 border-b border-gray-100 dark:border-stone-700 flex items-center justify-between">
                    <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Saved for Later (${e.length})</h3>
                    <button id="clear-saved-btn" class="text-sm text-gray-500 dark:text-stone-400 hover:text-gray-700 dark:hover:text-stone-300">Clear All</button>
                </div>
                <div class="p-6 grid grid-cols-2 md:grid-cols-4 gap-4">
                    ${e.map(B=>`
                        <div class="saved-item" data-product-id="${B.id}">
                            <div class="aspect-square bg-gray-100 dark:bg-stone-700 rounded-lg overflow-hidden mb-2">
                                <img src="${B.image||"/static/images/placeholder.jpg"}" alt="${Templates.escapeHtml(B.name)}" class="w-full h-full object-cover">
                            </div>
                            <h4 class="text-sm font-medium text-gray-900 dark:text-white truncate">${Templates.escapeHtml(B.name)}</h4>
                            <p class="text-sm font-semibold text-primary-600 dark:text-amber-400">${k(B.price)}</p>
                            <div class="flex gap-2 mt-2">
                                <button class="move-to-cart-btn flex-1 px-2 py-1 bg-primary-600 dark:bg-amber-600 text-white text-xs font-medium rounded hover:bg-primary-700 dark:hover:bg-amber-700 transition-colors">Move to Cart</button>
                                <button class="remove-saved-btn px-2 py-1 text-gray-400 hover:text-red-500">
                                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
                                </button>
                            </div>
                        </div>
                    `).join("")}
                </div>
            </div>
        `,C.querySelectorAll(".move-to-cart-btn").forEach(B=>{B.addEventListener("click",async()=>{let O=B.closest(".saved-item")?.dataset.productId;if(O)try{await CartApi.addItem(O,1),e=e.filter(P=>P.id!==O),localStorage.setItem("savedForLater",JSON.stringify(e)),Toast.success("Item moved to cart"),await s(),Y()}catch{Toast.error("Failed to move item to cart")}})}),C.querySelectorAll(".remove-saved-btn").forEach(B=>{B.addEventListener("click",()=>{let O=B.closest(".saved-item")?.dataset.productId;O&&(e=e.filter(P=>P.id!==O),localStorage.setItem("savedForLater",JSON.stringify(e)),Y(),Toast.info("Item removed"))})}),document.getElementById("clear-saved-btn")?.addEventListener("click",()=>{e=[],localStorage.removeItem("savedForLater"),Y(),Toast.info("Saved items cleared")})}}function j(){let C=JSON.parse(localStorage.getItem("abandonedCart")||"null");C&&C.items?.length>0&&(!n||n.items?.length===0)&&M(C),y(),window.addEventListener("beforeunload",()=>{n&&n.items?.length>0&&localStorage.setItem("abandonedCart",JSON.stringify({items:n.items,savedAt:new Date().toISOString()}))})}function y(){let C=()=>{t&&clearTimeout(t),t=setTimeout(()=>{n&&n.items?.length>0&&D()},o)};["click","scroll","keypress","mousemove"].forEach(B=>{document.addEventListener(B,C,{passive:!0,once:!1})}),C()}function M(C){let B=document.createElement("div");B.id="abandoned-cart-modal",B.className="fixed inset-0 z-50 flex items-center justify-center p-4",B.innerHTML=`
            <div class="absolute inset-0 bg-black/50 backdrop-blur-sm" onclick="document.getElementById('abandoned-cart-modal').remove()"></div>
            <div class="relative bg-white dark:bg-stone-800 rounded-2xl shadow-2xl max-w-md w-full p-6">
                <button onclick="document.getElementById('abandoned-cart-modal').remove()" class="absolute top-4 right-4 w-8 h-8 bg-stone-100 dark:bg-stone-700 rounded-full flex items-center justify-center">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
                </button>
                <div class="text-center mb-6">
                    <div class="w-16 h-16 bg-amber-100 dark:bg-amber-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg class="w-8 h-8 text-amber-600 dark:text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"/></svg>
                    </div>
                    <h3 class="text-xl font-bold text-stone-900 dark:text-white mb-2">Welcome Back!</h3>
                    <p class="text-stone-600 dark:text-stone-400">You left ${C.items.length} item(s) in your cart.</p>
                </div>
                <div class="max-h-48 overflow-y-auto mb-6 space-y-2">
                    ${C.items.slice(0,3).map(W=>`
                        <div class="flex items-center gap-3 p-2 bg-stone-50 dark:bg-stone-700/50 rounded-lg">
                            <img src="${W.product?.image||"/static/images/placeholder.jpg"}" alt="" class="w-12 h-12 rounded object-cover">
                            <div class="flex-1 min-w-0">
                                <p class="text-sm font-medium text-stone-900 dark:text-white truncate">${Templates.escapeHtml(W.product?.name||"Product")}</p>
                                <p class="text-xs text-stone-500 dark:text-stone-400">Qty: ${W.quantity}</p>
                            </div>
                        </div>
                    `).join("")}
                    ${C.items.length>3?`<p class="text-center text-sm text-stone-500 dark:text-stone-400">+${C.items.length-3} more items</p>`:""}
                </div>
                <div class="grid grid-cols-2 gap-3">
                    <button onclick="document.getElementById('abandoned-cart-modal').remove(); localStorage.removeItem('abandonedCart');" class="py-3 px-4 border border-stone-300 dark:border-stone-600 text-stone-700 dark:text-stone-300 font-medium rounded-xl hover:bg-stone-50 dark:hover:bg-stone-700 transition-colors">
                        Start Fresh
                    </button>
                    <button onclick="document.getElementById('abandoned-cart-modal').remove();" class="py-3 px-4 bg-primary-600 dark:bg-amber-600 text-white font-semibold rounded-xl hover:bg-primary-700 dark:hover:bg-amber-700 transition-colors">
                        Continue Shopping
                    </button>
                </div>
            </div>
        `,document.body.appendChild(B)}function D(){sessionStorage.getItem("cartReminderShown")||(Toast.info("Don't forget! You have items in your cart",{duration:8e3,action:{text:"Checkout",onClick:()=>window.location.href="/checkout/"}}),sessionStorage.setItem("cartReminderShown","true"))}function A(){E()}function E(){let C=document.getElementById("free-shipping-progress");if(!C||!n)return;let B=50,W=b(n.summary?.subtotal||n.subtotal||0),O=Math.max(0,B-W),P=Math.min(100,W/B*100);W>=B?C.innerHTML=`
                <div class="flex items-center gap-2 p-3 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl">
                    <svg class="w-5 h-5 text-emerald-600 dark:text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>
                    <span class="text-sm font-medium text-emerald-700 dark:text-emerald-300">\u{1F389} You've unlocked FREE shipping!</span>
                </div>
            `:C.innerHTML=`
                <div class="p-3 bg-amber-50 dark:bg-amber-900/20 rounded-xl">
                    <div class="flex items-center justify-between text-sm mb-2">
                        <span class="text-amber-700 dark:text-amber-300">Add ${k(O)} for FREE shipping</span>
                        <span class="text-amber-600 dark:text-amber-400 font-medium">${Math.round(P)}%</span>
                    </div>
                    <div class="w-full bg-amber-200 dark:bg-amber-800 rounded-full h-2">
                        <div class="bg-amber-500 h-2 rounded-full transition-all duration-500" style="width: ${P}%"></div>
                    </div>
                </div>
            `}function v(){let C=document.getElementById("cart-delivery-estimate");if(!C)return;let B=new Date,W=3,O=7,P=new Date(B.getTime()+W*24*60*60*1e3),X=new Date(B.getTime()+O*24*60*60*1e3),ee=re=>re.toLocaleDateString("en-US",{weekday:"short",month:"short",day:"numeric"});C.innerHTML=`
            <div class="flex items-center gap-2 text-sm text-stone-600 dark:text-stone-400">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"/></svg>
                <span>Estimated delivery: <strong class="text-stone-900 dark:text-white">${ee(P)} - ${ee(X)}</strong></span>
            </div>
        `}async function S(){let C=document.getElementById("cart-recommendations");if(!(!C||!n||!n.items?.length))try{let B=n.items.map(P=>P.product?.id).filter(Boolean);if(!B.length)return;let W=await ProductsApi.getRelated(B[0],{limit:4}),O=W?.data||W?.results||[];if(!O.length)return;C.innerHTML=`
                <div class="mt-8">
                    <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">You might also like</h3>
                    <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
                        ${O.slice(0,4).map(P=>`
                            <div class="bg-white dark:bg-stone-800 rounded-xl shadow-sm border border-gray-100 dark:border-stone-700 overflow-hidden group">
                                <a href="/products/${P.slug}/" class="block aspect-square bg-gray-100 dark:bg-stone-700 overflow-hidden">
                                    <img src="${P.primary_image||P.image||"/static/images/placeholder.jpg"}" alt="${Templates.escapeHtml(P.name)}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300">
                                </a>
                                <div class="p-3">
                                    <h4 class="text-sm font-medium text-gray-900 dark:text-white truncate">${Templates.escapeHtml(P.name)}</h4>
                                    <p class="text-sm font-semibold text-primary-600 dark:text-amber-400 mt-1">${k(P.current_price||P.price)}</p>
                                    <button class="quick-add-btn w-full mt-2 py-2 text-xs font-medium text-primary-600 dark:text-amber-400 border border-primary-600 dark:border-amber-400 rounded-lg hover:bg-primary-50 dark:hover:bg-amber-900/20 transition-colors" data-product-id="${P.id}">
                                        + Add to Cart
                                    </button>
                                </div>
                            </div>
                        `).join("")}
                    </div>
                </div>
            `,C.querySelectorAll(".quick-add-btn").forEach(P=>{P.addEventListener("click",async()=>{let X=P.dataset.productId;P.disabled=!0,P.textContent="Adding...";try{await CartApi.addItem(X,1),Toast.success("Added to cart"),await s()}catch{Toast.error("Failed to add item")}finally{P.disabled=!1,P.textContent="+ Add to Cart"}})})}catch(B){console.warn("Failed to load recommendations:",B)}}function L(){let C=document.getElementById("cart-note"),B=document.getElementById("gift-order");if(C){let W=localStorage.getItem("cartNote")||"";C.value=W,C.addEventListener("input",g(()=>{localStorage.setItem("cartNote",C.value)},500))}if(B){let W=localStorage.getItem("isGiftOrder")==="true";B.checked=W,B.addEventListener("change",()=>{localStorage.setItem("isGiftOrder",B.checked)})}}function g(C,B){let W;return function(...P){clearTimeout(W),W=setTimeout(()=>C(...P),B)}}function r(){let C=document.getElementById("express-checkout");C&&(C.innerHTML=`
            <div class="mt-4 space-y-2">
                <p class="text-xs text-center text-stone-500 dark:text-stone-400 mb-3">Or checkout faster with</p>
                <div class="grid grid-cols-2 gap-2">
                    <button class="express-pay-btn flex items-center justify-center gap-2 px-4 py-2.5 bg-black text-white rounded-lg font-medium text-sm hover:bg-gray-800 transition-colors">
                        <svg class="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.53 4.08zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.27 2.43-2.22 4.38-3.74 4.25z"/></svg>
                        Apple Pay
                    </button>
                    <button class="express-pay-btn flex items-center justify-center gap-2 px-4 py-2.5 bg-[#5f6368] text-white rounded-lg font-medium text-sm hover:bg-[#4a4e52] transition-colors">
                        <svg class="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
                        Google Pay
                    </button>
                </div>
            </div>
        `,C.querySelectorAll(".express-pay-btn").forEach(B=>{B.addEventListener("click",()=>{Toast.info("Express checkout coming soon!")})}))}async function s(){let C=document.getElementById("cart-container");if(C){Loader.show(C,"skeleton");try{n=(await CartApi.getCart()).data,i(n)}catch(B){console.error("Failed to load cart:",B),C.innerHTML='<p class="text-red-500 text-center py-8">Failed to load cart. Please try again.</p>'}}}function i(C){let B=document.getElementById("cart-container");if(!B)return;let W=C?.items||[],O=C?.summary||{},P=O.subtotal??C?.subtotal??0,X=b(O.discount_amount??C?.discount_amount),ee=O.tax_amount??C?.tax_amount??0,re=O.total??C?.total??0,se=C?.coupon?.code||"";if(W.length===0){B.innerHTML=`
                <div class="text-center py-16">
                    <svg class="w-24 h-24 text-gray-300 mx-auto mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"/>
                    </svg>
                    <h2 class="text-2xl font-bold text-gray-900 mb-2">Your cart is empty</h2>
                    <p class="text-gray-600 mb-8">Looks like you haven't added any items to your cart yet.</p>
                    <a href="/products/" class="inline-flex items-center px-6 py-3 bg-primary-600 text-white font-semibold rounded-lg hover:bg-primary-700 transition-colors">
                        Start Shopping
                        <svg class="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3"/>
                        </svg>
                    </a>
                </div>
            `;return}B.innerHTML=`
            <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <!-- Cart Items -->
                <div class="lg:col-span-2">
                    <div class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                        <div class="px-6 py-4 border-b border-gray-100">
                            <h2 class="text-lg font-semibold text-gray-900">Shopping Cart (${W.length} items)</h2>
                        </div>
                        <div id="cart-items" class="divide-y divide-gray-100">
                            ${W.map(oe=>l(oe)).join("")}
                        </div>
                    </div>

                    <!-- Continue Shopping -->
                    <div class="mt-6 flex items-center justify-between">
                        <a href="/products/" class="inline-flex items-center text-primary-600 hover:text-primary-700 font-medium">
                            <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16l-4-4m0 0l4-4m-4 4h18"/>
                            </svg>
                            Continue Shopping
                        </a>
                        <button id="clear-cart-btn" class="text-red-600 hover:text-red-700 font-medium">
                            Clear Cart
                        </button>
                    </div>
                    
                    <!-- Saved for Later -->
                    <div id="saved-for-later"></div>
                    
                    <!-- Recommendations -->
                    <div id="cart-recommendations"></div>
                </div>

                <!-- Order Summary -->
                <div class="lg:col-span-1">
                    <div class="bg-white dark:bg-stone-800 rounded-xl shadow-sm border border-gray-100 dark:border-stone-700 p-6 sticky top-4">
                        <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Order Summary</h3>
                        
                        <!-- Free Shipping Progress -->
                        <div id="free-shipping-progress" class="mb-4"></div>
                        
                        <div class="space-y-3 text-sm">
                            <div class="flex justify-between">
                                <span class="text-gray-600 dark:text-stone-400">Subtotal</span>
                                <span class="font-medium text-gray-900 dark:text-white">${k(P)}</span>
                            </div>
                            ${X>0?`
                                <div class="flex justify-between text-green-600 dark:text-green-400">
                                    <span>Discount</span>
                                    <span>-${k(X)}</span>
                                </div>
                            `:""}
                            ${b(ee)>0?`
                                <div class="flex justify-between">
                                    <span class="text-gray-600 dark:text-stone-400">Tax</span>
                                    <span class="font-medium text-gray-900 dark:text-white">${k(ee)}</span>
                                </div>
                            `:""}
                            <div class="pt-3 border-t border-gray-200 dark:border-stone-600">
                                <div class="flex justify-between">
                                    <span class="text-base font-semibold text-gray-900 dark:text-white">Total</span>
                                    <span class="text-base font-bold text-gray-900 dark:text-white">${k(re)}</span>
                                </div>
                                <p class="text-xs text-gray-500 dark:text-stone-400 mt-1">Shipping calculated at checkout</p>
                            </div>
                        </div>
                        
                        <!-- Delivery Estimate -->
                        <div id="cart-delivery-estimate" class="mt-4"></div>

                        <!-- Coupon Form -->
                        <div class="mt-6 pt-6 border-t border-gray-200 dark:border-stone-600">
                            ${se?`
                                <div class="flex items-center justify-between px-3 py-2 bg-green-50 dark:bg-green-900/20 rounded-lg">
                                    <div>
                                        <p class="text-sm font-medium text-green-700 dark:text-green-400">Coupon applied</p>
                                        <p class="text-xs text-green-600 dark:text-green-500">${Templates.escapeHtml(se)}</p>
                                    </div>
                                    <button id="remove-coupon-btn" class="text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300" aria-label="Remove coupon">
                                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                                        </svg>
                                    </button>
                                </div>
                            `:`
                                <form id="coupon-form" class="flex gap-2">
                                    <input 
                                        type="text" 
                                        id="coupon-code" 
                                        placeholder="Enter coupon code"
                                        class="flex-1 px-3 py-2 border border-gray-300 dark:border-stone-600 dark:bg-stone-700 dark:text-white rounded-lg text-sm focus:ring-primary-500 dark:focus:ring-amber-500 focus:border-primary-500 dark:focus:border-amber-500"
                                        value="${Templates.escapeHtml(se)}"
                                    >
                                    <button type="submit" class="px-4 py-2 bg-gray-100 dark:bg-stone-700 hover:bg-gray-200 dark:hover:bg-stone-600 text-gray-700 dark:text-stone-200 font-medium rounded-lg transition-colors text-sm">
                                        Apply
                                    </button>
                                </form>
                            `}
                        </div>
                        
                        <!-- Cart Note / Gift Message -->
                        <div class="mt-4">
                            <label class="flex items-center gap-2 cursor-pointer">
                                <input type="checkbox" id="gift-order" class="rounded border-gray-300 dark:border-stone-600 text-primary-600 dark:text-amber-500 focus:ring-primary-500 dark:focus:ring-amber-500">
                                <span class="text-sm text-gray-700 dark:text-stone-300">This is a gift</span>
                            </label>
                            <textarea 
                                id="cart-note" 
                                placeholder="Add a note or gift message..." 
                                class="mt-2 w-full px-3 py-2 border border-gray-300 dark:border-stone-600 dark:bg-stone-700 dark:text-white rounded-lg text-sm focus:ring-primary-500 dark:focus:ring-amber-500 focus:border-primary-500 dark:focus:border-amber-500"
                                rows="2"
                            ></textarea>
                        </div>

                        <!-- Checkout Button -->
                        <a href="${window.BUNORAA_CART&&window.BUNORAA_CART.checkoutUrl?window.BUNORAA_CART.checkoutUrl:"/checkout/"}" class="mt-6 w-full px-6 py-3 bg-primary-600 dark:bg-amber-600 text-white font-semibold rounded-lg hover:bg-primary-700 dark:hover:bg-amber-700 transition-colors flex items-center justify-center gap-2">
                            Proceed to Checkout
                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3"/>
                            </svg>
                        </a>
                        
                        <!-- Express Checkout -->
                        <div id="express-checkout"></div>

                        <!-- Trust Badges -->
                        <div class="mt-6 pt-6 border-t border-gray-200 dark:border-stone-600">
                            <div class="flex items-center justify-center gap-4 text-gray-400 dark:text-stone-500">
                                <div class="flex flex-col items-center">
                                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
                                    </svg>
                                    <span class="text-xs mt-1">Secure</span>
                                </div>
                                <div class="flex flex-col items-center">
                                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/>
                                    </svg>
                                    <span class="text-xs mt-1">Protected</span>
                                </div>
                                <div class="flex flex-col items-center">
                                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"/>
                                    </svg>
                                    <span class="text-xs mt-1">Easy Pay</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `,c(),q()}function l(C){let B=C.product||{},W=C.variant,O=B.slug||"#",P=B.name||"Product",X=B.primary_image||B.image,ee=b(C.price_at_add),re=b(C.current_price),se=b(C.line_total)||re*(C.quantity||1),oe=ee>re;return`
            <div class="cart-item p-6 flex gap-4" data-item-id="${C.id}" data-product-id="${B.id}">
                <div class="flex-shrink-0 w-24 h-24 bg-gray-100 dark:bg-stone-700 rounded-lg overflow-hidden">
                    <a href="/products/${O}/">
                        ${X?`
                        <img 
                            src="${X}" 
                            alt="${Templates.escapeHtml(P)}"
                            class="w-full h-full object-cover"
                            onerror="this.style.display='none'"
                        >`:`
                        <div class="w-full h-full flex items-center justify-center text-gray-400 dark:text-stone-500">
                            <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                            </svg>
                        </div>`}
                    </a>
                </div>
                <div class="flex-1 min-w-0">
                    <div class="flex justify-between">
                        <div>
                            <h3 class="font-medium text-gray-900 dark:text-white">
                                <a href="/products/${O}/" class="hover:text-primary-600 dark:hover:text-amber-400">
                                    ${Templates.escapeHtml(P)}
                                </a>
                            </h3>
                            ${W?`
                                <p class="text-sm text-gray-500 dark:text-stone-400 mt-1">${Templates.escapeHtml(W.name||W.value)}</p>
                            `:""}
                        </div>
                        <div class="flex items-center gap-2">
                            <button class="save-for-later-btn text-gray-400 dark:text-stone-500 hover:text-primary-600 dark:hover:text-amber-400 transition-colors" aria-label="Save for later" title="Save for later">
                                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/>
                                </svg>
                            </button>
                            <button class="remove-item-btn text-gray-400 dark:text-stone-500 hover:text-red-500 transition-colors" aria-label="Remove item">
                                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                                </svg>
                            </button>
                        </div>
                    </div>
                    <div class="mt-4 flex items-center justify-between">
                        <div class="flex items-center border border-gray-300 dark:border-stone-600 rounded-lg">
                            <button 
                                class="qty-decrease px-3 py-1 text-gray-600 dark:text-stone-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-stone-700 transition-colors"
                                aria-label="Decrease quantity"
                            >
                                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4"/>
                                </svg>
                            </button>
                            <input 
                                type="number" 
                                class="item-quantity w-12 text-center border-0 bg-transparent dark:text-white focus:ring-0 text-sm"
                                value="${C.quantity}" 
                                min="1" 
                                max="${B.stock_quantity||99}"
                            >
                            <button 
                                class="qty-increase px-3 py-1 text-gray-600 dark:text-stone-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-stone-700 transition-colors"
                                aria-label="Increase quantity"
                            >
                                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
                                </svg>
                            </button>
                        </div>
                        <div class="text-right">
                            ${oe?`
                                <span class="text-sm text-gray-400 dark:text-stone-500 line-through">${k(ee*C.quantity)}</span>
                            `:""}
                            <span class="font-semibold text-gray-900 dark:text-white block">${k(se)}</span>
                        </div>
                    </div>
                </div>
            </div>
        `}function c(){let C=document.getElementById("cart-items"),B=document.getElementById("clear-cart-btn"),W=document.getElementById("remove-coupon-btn");C?.addEventListener("click",async O=>{let P=O.target.closest(".cart-item");if(!P)return;let X=P.dataset.itemId,ee=P.dataset.productId,re=P.querySelector(".item-quantity");if(O.target.closest(".remove-item-btn"))await u(X);else if(O.target.closest(".save-for-later-btn"))await f(X,ee,P);else if(O.target.closest(".qty-decrease")){let se=parseInt(re.value)||1;se>1&&await h(X,se-1)}else if(O.target.closest(".qty-increase")){let se=parseInt(re.value)||1,oe=parseInt(re.max)||99;se<oe&&await h(X,se+1)}}),C?.addEventListener("change",async O=>{if(O.target.classList.contains("item-quantity")){let X=O.target.closest(".cart-item")?.dataset.itemId,ee=parseInt(O.target.value)||1;X&&ee>0&&await h(X,ee)}}),B?.addEventListener("click",async()=>{await Modal.confirm({title:"Clear Cart",message:"Are you sure you want to remove all items from your cart?",confirmText:"Clear Cart",cancelText:"Cancel"})&&await I()}),W?.addEventListener("click",async()=>{await z()})}async function h(C,B){try{await CartApi.updateItem(C,B),await s(),document.dispatchEvent(new CustomEvent("cart:updated"))}catch(W){Toast.error(W.message||"Failed to update quantity.")}}async function u(C){try{await CartApi.removeItem(C),Toast.success("Item removed from cart."),await s(),document.dispatchEvent(new CustomEvent("cart:updated"))}catch(B){Toast.error(B.message||"Failed to remove item.")}}async function f(C,B,W){try{let O=n?.items?.find(re=>String(re.id)===String(C));if(!O)return;let P=O.product||{},X={id:B,name:P.name||"Product",image:P.primary_image||P.image||"",price:O.current_price||P.price||0};e.findIndex(re=>re.id===B)===-1&&(e.push(X),localStorage.setItem("savedForLater",JSON.stringify(e))),await CartApi.removeItem(C),Toast.success("Item saved for later"),await s(),document.dispatchEvent(new CustomEvent("cart:updated"))}catch(O){Toast.error(O.message||"Failed to save item.")}}async function I(){try{await CartApi.clearCart(),Toast.success("Cart cleared."),await s(),document.dispatchEvent(new CustomEvent("cart:updated"))}catch(C){Toast.error(C.message||"Failed to clear cart.")}}function T(){let C=document.getElementById("coupon-form");C?.addEventListener("submit",async B=>{B.preventDefault();let O=document.getElementById("coupon-code")?.value.trim();if(!O){Toast.error("Please enter a coupon code.");return}let P=C.querySelector('button[type="submit"]');P.disabled=!0,P.textContent="Applying...";try{await CartApi.applyCoupon(O),Toast.success("Coupon applied!"),await s()}catch(X){Toast.error(X.message||"Invalid coupon code.")}finally{P.disabled=!1,P.textContent="Apply"}})}async function z(){try{await CartApi.removeCoupon(),Toast.success("Coupon removed."),await s()}catch(C){Toast.error(C.message||"Failed to remove coupon.")}}function V(){n=null}return{init:_,destroy:V}})();window.CartPage=fs;or=fs});var ys={};J(ys,{default:()=>ir});var vs,ir,ws=Q(()=>{vs=(function(){"use strict";let n={},e=1,t=null,o=null,p=!1,b=!1,k=!0,_=[],q=[],R=4;async function Y(){if(p)return;p=!0;let a=I();if(!a)return;let d=document.getElementById("category-header");if(d&&d.querySelector("h1")){oe(),le(),de(),j();return}n=T(),e=parseInt(new URLSearchParams(window.location.search).get("page"))||1,await z(a),oe(),le(),de(),j()}function j(){y(),A(),r(),i(),c(),u()}function y(){let a=document.getElementById("load-more-trigger");if(!a)return;new IntersectionObserver(m=>{m.forEach(x=>{x.isIntersecting&&!b&&k&&M()})},{rootMargin:"200px 0px",threshold:.01}).observe(a)}async function M(){if(b||!k||!t)return;b=!0,e++;let a=document.getElementById("loading-more-indicator");a&&a.classList.remove("hidden");try{let d={category:t.id,page:e,limit:12,...n},m=await ProductsApi.getAll(d),x=m.data||[],w=m.meta||{};x.length===0?k=!1:(_=[..._,...x],D(x),k=e<(w.total_pages||1)),X()}catch(d){console.error("Failed to load more products:",d)}finally{b=!1,a&&a.classList.add("hidden")}}function D(a){let d=document.getElementById("products-grid");if(!d)return;let m=Storage.get("productViewMode")||"grid";a.forEach(x=>{let w=ProductCard.render(x,{layout:m,showCompare:!0,showQuickView:!0}),$=document.createElement("div");$.innerHTML=w;let U=$.firstElementChild;U.classList.add("animate-fadeInUp"),d.appendChild(U)}),ProductCard.bindEvents(d)}function A(){q=JSON.parse(localStorage.getItem("compareProducts")||"[]"),v(),document.addEventListener("click",a=>{let d=a.target.closest("[data-compare]");if(!d)return;a.preventDefault();let m=parseInt(d.dataset.compare);E(m)})}function E(a){let d=q.findIndex(m=>m.id===a);if(d>-1)q.splice(d,1),Toast.info("Removed from compare");else{if(q.length>=R){Toast.warning(`You can compare up to ${R} products`);return}let m=_.find(x=>x.id===a);m&&(q.push({id:m.id,name:m.name,image:m.primary_image||m.image,price:m.price,sale_price:m.sale_price}),Toast.success("Added to compare"))}localStorage.setItem("compareProducts",JSON.stringify(q)),v(),S()}function v(){let a=document.getElementById("compare-bar");if(q.length===0){a?.remove();return}a||(a=document.createElement("div"),a.id="compare-bar",a.className="fixed bottom-0 left-0 right-0 bg-white dark:bg-stone-800 border-t border-stone-200 dark:border-stone-700 shadow-2xl z-40 transform transition-transform duration-300",document.body.appendChild(a)),a.innerHTML=`
            <div class="container mx-auto px-4 py-4">
                <div class="flex items-center justify-between gap-4">
                    <div class="flex items-center gap-3 overflow-x-auto">
                        <span class="text-sm font-medium text-stone-600 dark:text-stone-400 whitespace-nowrap">Compare (${q.length}/${R}):</span>
                        ${q.map(d=>`
                            <div class="relative flex-shrink-0 group">
                                <img src="${d.image||"/static/images/placeholder.jpg"}" alt="${Templates.escapeHtml(d.name)}" class="w-14 h-14 object-cover rounded-lg border border-stone-200 dark:border-stone-600">
                                <button data-remove-compare="${d.id}" class="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                    <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
                                </button>
                            </div>
                        `).join("")}
                    </div>
                    <div class="flex items-center gap-2">
                        <button id="compare-now-btn" class="px-4 py-2 bg-primary-600 dark:bg-amber-600 text-white font-semibold rounded-lg hover:bg-primary-700 dark:hover:bg-amber-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed" ${q.length<2?"disabled":""}>
                            Compare Now
                        </button>
                        <button id="clear-compare-btn" class="px-4 py-2 text-stone-600 dark:text-stone-400 hover:text-stone-800 dark:hover:text-stone-200 transition-colors">
                            Clear All
                        </button>
                    </div>
                </div>
            </div>
        `,a.querySelectorAll("[data-remove-compare]").forEach(d=>{d.addEventListener("click",()=>{let m=parseInt(d.dataset.removeCompare);E(m)})}),document.getElementById("compare-now-btn")?.addEventListener("click",g),document.getElementById("clear-compare-btn")?.addEventListener("click",L)}function S(){document.querySelectorAll("[data-compare]").forEach(a=>{let d=parseInt(a.dataset.compare);q.some(x=>x.id===d)?(a.classList.add("bg-primary-100","text-primary-600"),a.classList.remove("bg-stone-100","text-stone-600")):(a.classList.remove("bg-primary-100","text-primary-600"),a.classList.add("bg-stone-100","text-stone-600"))})}function L(){q=[],localStorage.removeItem("compareProducts"),v(),S(),Toast.info("Compare list cleared")}async function g(){if(q.length<2)return;let a=document.createElement("div");a.id="compare-modal",a.className="fixed inset-0 z-50 overflow-auto",a.innerHTML=`
            <div class="absolute inset-0 bg-black/50 backdrop-blur-sm" onclick="document.getElementById('compare-modal').remove()"></div>
            <div class="relative min-h-full flex items-center justify-center p-4">
                <div class="bg-white dark:bg-stone-800 rounded-2xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-auto">
                    <div class="sticky top-0 bg-white dark:bg-stone-800 border-b border-stone-200 dark:border-stone-700 p-4 flex items-center justify-between z-10">
                        <h2 class="text-xl font-bold text-stone-900 dark:text-white">Compare Products</h2>
                        <button onclick="document.getElementById('compare-modal').remove()" class="w-10 h-10 bg-stone-100 dark:bg-stone-700 rounded-full flex items-center justify-center hover:bg-stone-200 dark:hover:bg-stone-600 transition-colors">
                            <svg class="w-5 h-5 text-stone-600 dark:text-stone-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
                        </button>
                    </div>
                    <div class="p-4 overflow-x-auto">
                        <table class="w-full min-w-[600px]">
                            <thead>
                                <tr>
                                    <th class="text-left p-3 text-sm font-medium text-stone-500 dark:text-stone-400 w-32">Feature</th>
                                    ${q.map(d=>`
                                        <th class="p-3 text-center">
                                            <div class="flex flex-col items-center">
                                                <img src="${d.image||"/static/images/placeholder.jpg"}" alt="${Templates.escapeHtml(d.name)}" class="w-24 h-24 object-cover rounded-xl mb-2">
                                                <span class="text-sm font-semibold text-stone-900 dark:text-white">${Templates.escapeHtml(d.name)}</span>
                                            </div>
                                        </th>
                                    `).join("")}
                                </tr>
                            </thead>
                            <tbody>
                                <tr class="border-t border-stone-100 dark:border-stone-700">
                                    <td class="p-3 text-sm font-medium text-stone-600 dark:text-stone-400">Price</td>
                                    ${q.map(d=>`
                                        <td class="p-3 text-center">
                                            ${d.sale_price?`
                                                <span class="text-lg font-bold text-primary-600 dark:text-amber-400">${Templates.formatPrice(d.sale_price)}</span>
                                                <span class="text-sm text-stone-400 line-through ml-1">${Templates.formatPrice(d.price)}</span>
                                            `:`
                                                <span class="text-lg font-bold text-stone-900 dark:text-white">${Templates.formatPrice(d.price)}</span>
                                            `}
                                        </td>
                                    `).join("")}
                                </tr>
                                <tr class="border-t border-stone-100 dark:border-stone-700">
                                    <td class="p-3 text-sm font-medium text-stone-600 dark:text-stone-400">Actions</td>
                                    ${q.map(d=>`
                                        <td class="p-3 text-center">
                                            <button onclick="CartApi.addItem(${d.id}, 1).then(() => Toast.success('Added to cart'))" class="px-4 py-2 bg-primary-600 dark:bg-amber-600 text-white text-sm font-medium rounded-lg hover:bg-primary-700 dark:hover:bg-amber-700 transition-colors">
                                                Add to Cart
                                            </button>
                                        </td>
                                    `).join("")}
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        `,document.body.appendChild(a)}function r(){document.addEventListener("click",async a=>{let d=a.target.closest("[data-quick-view]");if(!d)return;let m=d.dataset.quickView;m&&(a.preventDefault(),await s(m))})}async function s(a){let d=document.createElement("div");d.id="quick-view-modal",d.className="fixed inset-0 z-50 flex items-center justify-center p-4",d.innerHTML=`
            <div class="absolute inset-0 bg-black/50 backdrop-blur-sm" onclick="document.getElementById('quick-view-modal').remove()"></div>
            <div class="relative bg-white dark:bg-stone-800 rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-auto">
                <div class="p-8 flex items-center justify-center min-h-[400px]">
                    <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 dark:border-amber-400"></div>
                </div>
            </div>
        `,document.body.appendChild(d);try{let m=await ProductsApi.getProduct(a),x=m.data||m,w=d.querySelector(".relative");w.innerHTML=`
                <button class="absolute top-4 right-4 z-10 w-10 h-10 bg-stone-100 dark:bg-stone-700 rounded-full flex items-center justify-center hover:bg-stone-200 dark:hover:bg-stone-600 transition-colors" onclick="document.getElementById('quick-view-modal').remove()">
                    <svg class="w-5 h-5 text-stone-600 dark:text-stone-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
                </button>
                <div class="grid md:grid-cols-2 gap-8 p-8">
                    <div>
                        <div class="aspect-square rounded-xl overflow-hidden bg-stone-100 dark:bg-stone-700 mb-4">
                            <img src="${x.primary_image||x.image||"/static/images/placeholder.jpg"}" alt="${Templates.escapeHtml(x.name)}" class="w-full h-full object-cover" id="quick-view-main-image">
                        </div>
                        ${x.images&&x.images.length>1?`
                            <div class="flex gap-2 overflow-x-auto pb-2">
                                ${x.images.slice(0,5).map((ae,ne)=>`
                                    <button class="w-16 h-16 flex-shrink-0 rounded-lg overflow-hidden border-2 ${ne===0?"border-primary-600 dark:border-amber-400":"border-transparent"} hover:border-primary-400 transition-colors" onclick="document.getElementById('quick-view-main-image').src='${ae.image||ae}'">
                                        <img src="${ae.thumbnail||ae.image||ae}" alt="" class="w-full h-full object-cover">
                                    </button>
                                `).join("")}
                            </div>
                        `:""}
                    </div>
                    <div class="flex flex-col">
                        <h2 class="text-2xl font-bold text-stone-900 dark:text-white mb-2">${Templates.escapeHtml(x.name)}</h2>
                        <div class="flex items-center gap-2 mb-4">
                            <div class="flex text-amber-400">
                                ${'<svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.967a1 1 0 00.95.69h4.178c.969 0 1.371 1.24.588 1.81l-3.385 2.46a1 1 0 00-.364 1.118l1.287 3.966c.3.922-.755 1.688-1.54 1.118l-3.385-2.46a1 1 0 00-1.175 0l-3.385 2.46c-.784.57-1.838-.196-1.54-1.118l1.287-3.966a1 1 0 00-.364-1.118l-3.385-2.46c-.783-.57-.38-1.81.588-1.81h4.178a1 1 0 00.95-.69l1.286-3.967z"/></svg>'.repeat(Math.round(x.rating||4))}
                            </div>
                            <span class="text-sm text-stone-500 dark:text-stone-400">(${x.review_count||0} reviews)</span>
                            ${x.stock_quantity<=5&&x.stock_quantity>0?`
                                <span class="text-sm text-orange-600 dark:text-orange-400 font-medium">Only ${x.stock_quantity} left!</span>
                            `:""}
                        </div>
                        <div class="mb-6">
                            ${x.sale_price||x.discounted_price?`
                                <span class="text-3xl font-bold text-primary-600 dark:text-amber-400">${Templates.formatPrice(x.sale_price||x.discounted_price)}</span>
                                <span class="text-lg text-stone-400 line-through ml-2">${Templates.formatPrice(x.price)}</span>
                                <span class="ml-2 px-2 py-1 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 text-sm font-medium rounded">Save ${Math.round((1-(x.sale_price||x.discounted_price)/x.price)*100)}%</span>
                            `:`
                                <span class="text-3xl font-bold text-stone-900 dark:text-white">${Templates.formatPrice(x.price)}</span>
                            `}
                        </div>
                        <p class="text-stone-600 dark:text-stone-400 mb-6 line-clamp-3">${Templates.escapeHtml(x.short_description||x.description||"")}</p>
                        
                        <!-- Quantity Selector -->
                        <div class="flex items-center gap-4 mb-6">
                            <span class="text-sm font-medium text-stone-700 dark:text-stone-300">Quantity:</span>
                            <div class="flex items-center border border-stone-300 dark:border-stone-600 rounded-lg">
                                <button id="qv-qty-minus" class="w-10 h-10 flex items-center justify-center text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-700 transition-colors">\u2212</button>
                                <input type="number" id="qv-qty-input" value="1" min="1" max="${x.stock_quantity||99}" class="w-16 h-10 text-center border-x border-stone-300 dark:border-stone-600 bg-transparent text-stone-900 dark:text-white">
                                <button id="qv-qty-plus" class="w-10 h-10 flex items-center justify-center text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-700 transition-colors">+</button>
                            </div>
                        </div>

                        <div class="mt-auto space-y-3">
                            <button id="qv-add-to-cart" class="w-full py-3 px-6 bg-primary-600 dark:bg-amber-600 hover:bg-primary-700 dark:hover:bg-amber-700 text-white font-semibold rounded-xl transition-colors flex items-center justify-center gap-2">
                                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"/></svg>
                                Add to Cart
                            </button>
                            <div class="grid grid-cols-2 gap-3">
                                <button onclick="WishlistApi.add(${x.id}).then(() => Toast.success('Added to wishlist'))" class="py-3 px-6 border-2 border-stone-200 dark:border-stone-600 text-stone-700 dark:text-stone-300 font-semibold rounded-xl hover:bg-stone-50 dark:hover:bg-stone-700 transition-colors flex items-center justify-center gap-2">
                                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/></svg>
                                    Wishlist
                                </button>
                                <a href="/products/${x.slug||x.id}/" class="py-3 px-6 border-2 border-stone-200 dark:border-stone-600 text-stone-700 dark:text-stone-300 font-semibold rounded-xl text-center hover:bg-stone-50 dark:hover:bg-stone-700 transition-colors">
                                    Full Details
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            `;let $=document.getElementById("qv-qty-input"),U=document.getElementById("qv-qty-minus"),G=document.getElementById("qv-qty-plus"),te=document.getElementById("qv-add-to-cart");U?.addEventListener("click",()=>{let ae=parseInt($.value)||1;ae>1&&($.value=ae-1)}),G?.addEventListener("click",()=>{let ae=parseInt($.value)||1,ne=parseInt($.max)||99;ae<ne&&($.value=ae+1)}),te?.addEventListener("click",async()=>{let ae=parseInt($.value)||1;te.disabled=!0,te.innerHTML='<svg class="animate-spin h-5 w-5 mx-auto" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>';try{await CartApi.addItem(x.id,ae),Toast.success("Added to cart"),d.remove()}catch{Toast.error("Failed to add to cart")}finally{te.disabled=!1,te.innerHTML='<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"/></svg> Add to Cart'}})}catch(m){console.error("Failed to load product:",m),d.remove(),Toast.error("Failed to load product details")}}function i(){if(!document.getElementById("price-range-slider"))return;let d=document.getElementById("filter-min-price"),m=document.getElementById("filter-max-price");!d||!m||[d,m].forEach(x=>{x.addEventListener("input",()=>{l()})})}function l(){let a=document.getElementById("price-range-display"),d=document.getElementById("filter-min-price")?.value||0,m=document.getElementById("filter-max-price")?.value||"\u221E";a&&(a.textContent=`$${d} - $${m}`)}function c(){h()}function h(){let a=document.getElementById("active-filters");if(!a)return;let d=[];if(n.min_price&&d.push({key:"min_price",label:`Min: $${n.min_price}`}),n.max_price&&d.push({key:"max_price",label:`Max: $${n.max_price}`}),n.in_stock&&d.push({key:"in_stock",label:"In Stock"}),n.on_sale&&d.push({key:"on_sale",label:"On Sale"}),n.ordering){let m={price:"Price: Low to High","-price":"Price: High to Low","-created_at":"Newest First",name:"A-Z","-popularity":"Most Popular"};d.push({key:"ordering",label:m[n.ordering]||n.ordering})}if(d.length===0){a.innerHTML="";return}a.innerHTML=`
            <div class="flex flex-wrap items-center gap-2 mb-4">
                <span class="text-sm text-stone-500 dark:text-stone-400">Active filters:</span>
                ${d.map(m=>`
                    <button data-remove-filter="${m.key}" class="inline-flex items-center gap-1 px-3 py-1 bg-primary-100 dark:bg-amber-900/30 text-primary-700 dark:text-amber-400 rounded-full text-sm hover:bg-primary-200 dark:hover:bg-amber-900/50 transition-colors">
                        ${m.label}
                        <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
                    </button>
                `).join("")}
                <button id="clear-all-active-filters" class="text-sm text-stone-500 dark:text-stone-400 hover:text-stone-700 dark:hover:text-stone-300 underline">Clear all</button>
            </div>
        `,a.querySelectorAll("[data-remove-filter]").forEach(m=>{m.addEventListener("click",()=>{let x=m.dataset.removeFilter;delete n[x],P()})}),document.getElementById("clear-all-active-filters")?.addEventListener("click",()=>{n={},P()})}function u(){f()}function f(a=null){let d=document.getElementById("product-count");d&&a!==null&&(d.textContent=`${a} products`)}function I(){let d=window.location.pathname.match(/\/categories\/([^\/]+)/);return d?d[1]:null}function T(){let a=new URLSearchParams(window.location.search),d={};a.get("min_price")&&(d.min_price=a.get("min_price")),a.get("max_price")&&(d.max_price=a.get("max_price")),a.get("ordering")&&(d.ordering=a.get("ordering")),a.get("in_stock")&&(d.in_stock=a.get("in_stock")==="true"),a.get("on_sale")&&(d.on_sale=a.get("on_sale")==="true");let m=a.getAll("attr");return m.length&&(d.attributes=m),d}async function z(a){let d=document.getElementById("category-header"),m=document.getElementById("category-products"),x=document.getElementById("category-filters");d&&Loader.show(d,"skeleton"),m&&Loader.show(m,"skeleton");try{let w=await CategoriesApi.getCategory(a);if(t=w.data||w,!t){window.location.href="/404/";return}V(t),await C(t),await B(t),await ee(),await se(t)}catch(w){console.error("Failed to load category:",w),d&&(d.innerHTML='<p class="text-red-500">Failed to load category.</p>')}}function V(a){let d=document.getElementById("category-header");d&&(document.title=`${a.name} | Bunoraa`,d.innerHTML=`
            <div class="relative py-8 md:py-12">
                ${a.image?`
                    <div class="absolute inset-0 overflow-hidden rounded-2xl">
                        <img src="${a.image}" alt="" class="w-full h-full object-cover opacity-20">
                        <div class="absolute inset-0 bg-gradient-to-r from-white via-white/95 to-white/80"></div>
                    </div>
                `:""}
                <div class="relative">
                    <h1 class="text-3xl md:text-4xl font-bold text-gray-900 mb-2">${Templates.escapeHtml(a.name)}</h1>
                    ${a.description?`
                        <p class="text-gray-600 max-w-2xl">${Templates.escapeHtml(a.description)}</p>
                    `:""}
                    ${a.product_count?`
                        <p class="mt-4 text-sm text-gray-500">${a.product_count} products</p>
                    `:""}
                </div>
            </div>
        `)}async function C(a){let d=document.getElementById("breadcrumbs");if(d)try{let x=(await CategoriesApi.getBreadcrumbs(a.id)).data||[],w=[{label:"Home",url:"/"},{label:"Categories",url:"/categories/"},...x.map($=>({label:$.name,url:`/categories/${$.slug}/`}))];d.innerHTML=Breadcrumb.render(w)}catch(m){console.error("Failed to load breadcrumbs:",m)}}async function B(a){let d=document.getElementById("category-filters");if(d)try{let x=(await ProductsApi.getFilterOptions({category:a.id})).data||{};d.innerHTML=`
                <div class="space-y-6">
                    <!-- Price Range -->
                    <div class="border-b border-gray-200 pb-6">
                        <h3 class="text-sm font-semibold text-gray-900 mb-4">Price Range</h3>
                        <div class="flex items-center gap-2">
                            <input 
                                type="number" 
                                id="filter-min-price" 
                                placeholder="Min"
                                value="${n.min_price||""}"
                                class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-primary-500 focus:border-primary-500"
                            >
                            <span class="text-gray-400">-</span>
                            <input 
                                type="number" 
                                id="filter-max-price" 
                                placeholder="Max"
                                value="${n.max_price||""}"
                                class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-primary-500 focus:border-primary-500"
                            >
                        </div>
                        <button id="apply-price-filter" class="mt-3 w-full px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium rounded-lg transition-colors">
                            Apply
                        </button>
                    </div>

                    <!-- Availability -->
                    <div class="border-b border-gray-200 pb-6">
                        <h3 class="text-sm font-semibold text-gray-900 mb-4">Availability</h3>
                        <div class="space-y-2">
                            <label class="flex items-center">
                                <input 
                                    type="checkbox" 
                                    id="filter-in-stock"
                                    ${n.in_stock?"checked":""}
                                    class="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                                >
                                <span class="ml-2 text-sm text-gray-600">In Stock</span>
                            </label>
                            <label class="flex items-center">
                                <input 
                                    type="checkbox" 
                                    id="filter-on-sale"
                                    ${n.on_sale?"checked":""}
                                    class="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                                >
                                <span class="ml-2 text-sm text-gray-600">On Sale</span>
                            </label>
                        </div>
                    </div>

                    ${x.attributes&&x.attributes.length?`
                        ${x.attributes.map(w=>`
                            <div class="border-b border-gray-200 pb-6">
                                <h3 class="text-sm font-semibold text-gray-900 mb-4">${Templates.escapeHtml(w.name)}</h3>
                                <div class="space-y-2 max-h-48 overflow-y-auto">
                                    ${w.values.map($=>`
                                        <label class="flex items-center">
                                            <input 
                                                type="checkbox" 
                                                name="attr-${w.slug}"
                                                value="${Templates.escapeHtml($.value)}"
                                                ${n.attributes?.includes(`${w.slug}:${$.value}`)?"checked":""}
                                                class="filter-attribute w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                                                data-attribute="${w.slug}"
                                            >
                                            <span class="ml-2 text-sm text-gray-600">${Templates.escapeHtml($.value)}</span>
                                            ${$.count?`<span class="ml-auto text-xs text-gray-400">(${$.count})</span>`:""}
                                        </label>
                                    `).join("")}
                                </div>
                            </div>
                        `).join("")}
                    `:""}

                    <!-- Clear Filters -->
                    <button id="clear-filters" class="w-full px-4 py-2 border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors">
                        Clear All Filters
                    </button>
                </div>
            `,W()}catch(m){console.error("Failed to load filters:",m),d.innerHTML=""}}function W(){let a=document.getElementById("apply-price-filter"),d=document.getElementById("filter-in-stock"),m=document.getElementById("filter-on-sale"),x=document.getElementById("clear-filters"),w=document.querySelectorAll(".filter-attribute");a?.addEventListener("click",()=>{let $=document.getElementById("filter-min-price")?.value,U=document.getElementById("filter-max-price")?.value;$?n.min_price=$:delete n.min_price,U?n.max_price=U:delete n.max_price,P()}),d?.addEventListener("change",$=>{$.target.checked?n.in_stock=!0:delete n.in_stock,P()}),m?.addEventListener("change",$=>{$.target.checked?n.on_sale=!0:delete n.on_sale,P()}),w.forEach($=>{$.addEventListener("change",()=>{O(),P()})}),x?.addEventListener("click",()=>{n={},e=1,P()})}function O(){let a=document.querySelectorAll(".filter-attribute:checked"),d=[];a.forEach(m=>{d.push(`${m.dataset.attribute}:${m.value}`)}),d.length?n.attributes=d:delete n.attributes}function P(){e=1,X(),ee()}function X(){let a=new URLSearchParams;n.min_price&&a.set("min_price",n.min_price),n.max_price&&a.set("max_price",n.max_price),n.ordering&&a.set("ordering",n.ordering),n.in_stock&&a.set("in_stock","true"),n.on_sale&&a.set("on_sale","true"),n.attributes&&n.attributes.forEach(m=>a.append("attr",m)),e>1&&a.set("page",e);let d=`${window.location.pathname}${a.toString()?"?"+a.toString():""}`;window.history.pushState({},"",d)}async function ee(){let a=document.getElementById("category-products");if(!(!a||!t)){o&&o.abort(),o=new AbortController,Loader.show(a,"skeleton");try{let d={category:t.id,page:e,limit:12,...n};n.attributes&&(delete d.attributes,n.attributes.forEach($=>{let[U,G]=$.split(":");d[`attr_${U}`]=G}));let m=await ProductsApi.getAll(d),x=m.data||[],w=m.meta||{};_=x,k=e<(w.total_pages||1),re(x,w),h(),f(w.total||x.length)}catch(d){if(d.name==="AbortError")return;console.error("Failed to load products:",d),a.innerHTML='<p class="text-red-500 text-center py-8">Failed to load products. Please try again.</p>'}}}function re(a,d){let m=document.getElementById("category-products");if(!m)return;let x=Storage.get("productViewMode")||"grid",w=x==="list"?"space-y-4":"grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6";if(a.length===0){m.innerHTML=`
                <div class="text-center py-12">
                    <svg class="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                    </svg>
                    <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">No products found</h3>
                    <p class="text-gray-500 dark:text-stone-400 mb-4">Try adjusting your filters or browse other categories.</p>
                    <button id="clear-filters-empty" class="px-4 py-2 bg-primary-600 dark:bg-amber-600 text-white rounded-lg hover:bg-primary-700 dark:hover:bg-amber-700 transition-colors">
                        Clear Filters
                    </button>
                </div>
            `,document.getElementById("clear-filters-empty")?.addEventListener("click",()=>{n={},e=1,P()});return}if(m.innerHTML=`
            <div id="active-filters" class="mb-4"></div>
            <div id="products-grid" class="${w}">
                ${a.map($=>ProductCard.render($,{layout:x,showCompare:!0,showQuickView:!0})).join("")}
            </div>
            
            <!-- Infinite Scroll Trigger -->
            <div id="load-more-trigger" class="h-20 flex items-center justify-center">
                <div id="loading-more-indicator" class="hidden">
                    <svg class="animate-spin h-8 w-8 text-primary-600 dark:text-amber-400" fill="none" viewBox="0 0 24 24">
                        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                </div>
            </div>
            
            ${d.total_pages>1?`
                <div id="products-pagination" class="mt-8"></div>
            `:""}
        `,ProductCard.bindEvents(m),h(),S(),y(),d.total_pages>1){let $=document.getElementById("products-pagination");$.innerHTML=Pagination.render({currentPage:d.current_page||e,totalPages:d.total_pages,totalItems:d.total}),$.addEventListener("click",U=>{let G=U.target.closest("[data-page]");G&&(e=parseInt(G.dataset.page),k=!0,X(),ee(),window.scrollTo({top:0,behavior:"smooth"}))})}}async function se(a){let d=document.getElementById("subcategories");if(d)try{let x=(await CategoriesApi.getSubcategories(a.id)).data||[];if(x.length===0){d.innerHTML="";return}d.innerHTML=`
                <div class="mb-8">
                    <h2 class="text-lg font-semibold text-gray-900 mb-4">Browse Subcategories</h2>
                    <div class="flex flex-wrap gap-2">
                        ${x.map(w=>`
                            <a href="/categories/${w.slug}/" class="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-full text-sm transition-colors">
                                ${Templates.escapeHtml(w.name)}
                                ${w.product_count?`<span class="text-gray-400 ml-1">(${w.product_count})</span>`:""}
                            </a>
                        `).join("")}
                    </div>
                </div>
            `}catch(m){console.error("Failed to load subcategories:",m),d.innerHTML=""}}function oe(){let a=document.getElementById("mobile-filter-btn"),d=document.getElementById("filter-sidebar"),m=document.getElementById("close-filter-btn");a?.addEventListener("click",()=>{d?.classList.remove("hidden"),document.body.classList.add("overflow-hidden")}),m?.addEventListener("click",()=>{d?.classList.add("hidden"),document.body.classList.remove("overflow-hidden")})}function le(){let a=document.getElementById("sort-select");a&&(a.value=n.ordering||"",a.addEventListener("change",d=>{d.target.value?n.ordering=d.target.value:delete n.ordering,P()}))}function de(){let a=document.getElementById("view-grid"),d=document.getElementById("view-list");(Storage.get("productViewMode")||"grid")==="list"&&(a?.classList.remove("bg-gray-200"),d?.classList.add("bg-gray-200")),a?.addEventListener("click",()=>{Storage.set("productViewMode","grid"),a.classList.add("bg-gray-200"),d?.classList.remove("bg-gray-200"),ee()}),d?.addEventListener("click",()=>{Storage.set("productViewMode","list"),d.classList.add("bg-gray-200"),a?.classList.remove("bg-gray-200"),ee()})}function me(){o&&(o.abort(),o=null),n={},e=1,t=null,p=!1,b=!1,k=!0,_=[],document.getElementById("compare-bar")?.remove(),document.getElementById("quick-view-modal")?.remove(),document.getElementById("compare-modal")?.remove()}return{init:Y,destroy:me,toggleCompare:E,clearCompare:L}})();window.CategoryPage=vs;ir=vs});var Es={};J(Es,{default:()=>lr});var ks,lr,Cs=Q(()=>{ks=(async function(){"use strict";let n=null,e={shipping_address:null,billing_address:null,same_as_shipping:!0,shipping_method:null,payment_method:null,notes:""},t=1;async function o(){if(!AuthApi.isAuthenticated()&&!document.getElementById("guest-checkout")){Toast.info("Please login to continue checkout."),window.location.href="/account/login/?next=/checkout/";return}if(await p(),!n||!n.items||n.items.length===0){Toast.warning("Your cart is empty."),window.location.href="/cart/";return}await k(),q(),s(),g()}async function p(){try{n=(await CartApi.getCart()).data,b()}catch(u){console.error("Failed to load cart:",u),Toast.error("Failed to load cart.")}}function b(){let u=document.getElementById("order-summary");!u||!n||(u.innerHTML=`
            <div class="bg-gray-50 rounded-xl p-6">
                <h3 class="text-lg font-semibold text-gray-900 mb-4">Order Summary</h3>
                
                <!-- Cart Items -->
                <div class="space-y-3 max-h-64 overflow-y-auto mb-4">
                    ${n.items.map(f=>`
                        <div class="flex gap-3">
                            <div class="flex-shrink-0 w-16 h-16 bg-gray-200 rounded-lg overflow-hidden">
                                ${f.product?.image?`
                                <img src="${f.product.image}" alt="" class="w-full h-full object-cover" onerror="this.style.display='none'">
                                `:`
                                <div class="w-full h-full flex items-center justify-center text-gray-400">
                                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                                    </svg>
                                </div>`}
                            </div>
                            <div class="flex-1 min-w-0">
                                <h4 class="text-sm font-medium text-gray-900 truncate">${Templates.escapeHtml(f.product?.name)}</h4>
                                ${f.variant?`<p class="text-xs text-gray-500">${Templates.escapeHtml(f.variant.name||f.variant.value)}</p>`:""}
                                <div class="flex justify-between mt-1">
                                    <span class="text-xs text-gray-500">Qty: ${f.quantity}</span>
                                    <span class="text-sm font-medium">${Templates.formatPrice(f.price*f.quantity)}</span>
                                </div>
                            </div>
                        </div>
                    `).join("")}
                </div>

                <div class="border-t border-gray-200 pt-4 space-y-2 text-sm">
                    <div class="flex justify-between">
                        <span class="text-gray-600">Subtotal</span>
                        <span class="font-medium">${Templates.formatPrice(n.subtotal||0)}</span>
                    </div>
                    ${n.discount_amount?`
                        <div class="flex justify-between text-green-600">
                            <span>Discount</span>
                            <span>-${Templates.formatPrice(n.discount_amount)}</span>
                        </div>
                    `:""}
                    <div class="flex justify-between" id="shipping-cost-row">
                        <span class="text-gray-600">Shipping</span>
                        <span class="font-medium" id="shipping-cost">Calculated next</span>
                    </div>
                    ${n.tax_amount?`
                        <div class="flex justify-between">
                            <span class="text-gray-600">Tax</span>
                            <span class="font-medium">${Templates.formatPrice(n.tax_amount)}</span>
                        </div>
                    `:""}
                    <div class="flex justify-between pt-2 border-t border-gray-200">
                        <span class="text-base font-semibold text-gray-900">Total</span>
                        <span class="text-base font-bold text-gray-900" id="order-total">${Templates.formatPrice(n.total||0)}</span>
                    </div>
                </div>
            </div>
        `)}async function k(){if(AuthApi.isAuthenticated())try{let f=(await AuthApi.getAddresses()).data||[],I=document.getElementById("saved-addresses");I&&f.length>0&&(I.innerHTML=`
                    <div class="mb-4">
                        <label class="block text-sm font-medium text-gray-700 mb-2">Saved Addresses</label>
                        <div class="space-y-2">
                            ${f.map(T=>`
                                <label class="flex items-start p-3 border border-gray-200 rounded-lg cursor-pointer hover:border-primary-500 transition-colors">
                                    <input type="radio" name="saved_address" value="${T.id}" class="mt-1 text-primary-600 focus:ring-primary-500">
                                    <div class="ml-3">
                                        <p class="font-medium text-gray-900">${Templates.escapeHtml(T.full_name||`${T.first_name} ${T.last_name}`)}</p>
                                        <p class="text-sm text-gray-600">${Templates.escapeHtml(T.address_line_1)}</p>
                                        ${T.address_line_2?`<p class="text-sm text-gray-600">${Templates.escapeHtml(T.address_line_2)}</p>`:""}
                                        <p class="text-sm text-gray-600">${Templates.escapeHtml(T.city)}, ${Templates.escapeHtml(T.state||"")} ${Templates.escapeHtml(T.postal_code)}</p>
                                        <p class="text-sm text-gray-600">${Templates.escapeHtml(T.country)}</p>
                                        ${T.is_default?'<span class="inline-block mt-1 px-2 py-0.5 bg-primary-100 text-primary-700 text-xs rounded">Default</span>':""}
                                    </div>
                                </label>
                            `).join("")}
                            <label class="flex items-center p-3 border border-gray-200 rounded-lg cursor-pointer hover:border-primary-500 transition-colors">
                                <input type="radio" name="saved_address" value="new" class="text-primary-600 focus:ring-primary-500" checked>
                                <span class="ml-3 text-gray-700">Enter a new address</span>
                            </label>
                        </div>
                    </div>
                `,_())}catch(u){console.error("Failed to load addresses:",u)}}function _(){let u=document.querySelectorAll('input[name="saved_address"]'),f=document.getElementById("new-address-form");u.forEach(I=>{I.addEventListener("change",T=>{T.target.value==="new"?f?.classList.remove("hidden"):(f?.classList.add("hidden"),e.shipping_address=T.target.value)})})}function q(){let u=document.querySelectorAll("[data-step]"),f=document.querySelectorAll("[data-step-indicator]"),I=document.querySelectorAll("[data-next-step]"),T=document.querySelectorAll("[data-prev-step]");function z(V){u.forEach(C=>{C.classList.toggle("hidden",parseInt(C.dataset.step)!==V)}),f.forEach(C=>{let B=parseInt(C.dataset.stepIndicator);C.classList.toggle("bg-primary-600",B<=V),C.classList.toggle("text-white",B<=V),C.classList.toggle("bg-gray-200",B>V),C.classList.toggle("text-gray-600",B>V)}),t=V}I.forEach(V=>{V.addEventListener("click",async()=>{await R()&&(t===1&&await D(),z(t+1),window.scrollTo({top:0,behavior:"smooth"}))})}),T.forEach(V=>{V.addEventListener("click",()=>{z(t-1),window.scrollTo({top:0,behavior:"smooth"})})}),z(1)}async function R(){switch(t){case 1:return M();case 2:return L();case 3:return r();default:return!0}}function Y(u){u&&(u.querySelectorAll("[data-error-for]").forEach(f=>f.remove()),u.querySelectorAll(".!border-red-500").forEach(f=>f.classList.remove("!border-red-500")))}function j(u,f){if(!u)return;let I=u.getAttribute("name")||u.id||Math.random().toString(36).slice(2,8),T=u.closest("form")?.querySelector(`[data-error-for="${I}"]`);T&&T.remove();let z=document.createElement("p");z.className="text-sm text-red-600 mt-1",z.setAttribute("data-error-for",I),z.textContent=f,u.classList.add("!border-red-500"),u.nextSibling?u.parentNode.insertBefore(z,u.nextSibling):u.parentNode.appendChild(z)}function y(u){if(!u)return;let f=u.querySelector("[data-error-for]");if(!f)return;let I=f.getAttribute("data-error-for"),T=u.querySelector(`[name="${I}"]`)||u.querySelector(`#${I}`)||f.previousElementSibling;if(T&&typeof T.focus=="function")try{T.focus({preventScroll:!0})}catch{T.focus()}}function M(){let u=document.querySelector('input[name="saved_address"]:checked');if(u&&u.value!=="new")return Y(document.getElementById("new-address-form")||document.getElementById("information-form")),e.shipping_address=u.value,!0;let f=document.getElementById("shipping-address-form")||document.getElementById("information-form")||document.getElementById("new-address-form");if(!f)return!1;Y(f);let I=new FormData(f),T={first_name:I.get("first_name")||I.get("full_name")?.split(" ")?.[0],last_name:I.get("last_name")||(I.get("full_name")?I.get("full_name").split(" ").slice(1).join(" "):""),email:I.get("email"),phone:I.get("phone"),address_line_1:I.get("address_line1")||I.get("address_line_1"),address_line_2:I.get("address_line2")||I.get("address_line_2"),city:I.get("city"),state:I.get("state"),postal_code:I.get("postal_code"),country:I.get("country")},V=["email","first_name","address_line_1","city","postal_code"].filter(C=>!T[C]);if(V.length>0)return V.forEach(C=>{let B=`[name="${C}"]`;C==="address_line_1"&&(B='[name="address_line1"],[name="address_line_1"]');let W=f.querySelector(B);j(W||f,C.replace("_"," ").replace(/\b\w/g,O=>O.toUpperCase())+" is required.")}),y(f),!1;if(T.email&&!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(T.email)){let C=f.querySelector('[name="email"]');return j(C||f,"Please enter a valid email address."),y(f),!1}return e.shipping_address=T,!0}async function D(){let u=document.getElementById("shipping-methods");if(u){Loader.show(u,"spinner");try{let f=e.shipping_address;if(!f){u.innerHTML='<p class="text-gray-500">Please provide a shipping address to view shipping methods.</p>';return}let I=typeof f=="object"?{country:f.country,postal_code:f.postal_code,city:f.city}:{address_id:f},z=(await ShippingApi.getRates(I)).data||[];if(z.length===0){u.innerHTML='<p class="text-gray-500">No shipping methods available for your location.</p>';return}u.innerHTML=`
                <div class="space-y-3">
                    ${z.map((C,B)=>`
                        <label class="flex items-center justify-between p-4 border border-gray-200 rounded-lg cursor-pointer hover:border-primary-500 transition-colors">
                            <div class="flex items-center">
                                <input 
                                    type="radio" 
                                    name="shipping_method" 
                                    value="${C.id}" 
                                    ${B===0?"checked":""}
                                    class="text-primary-600 focus:ring-primary-500"
                                    data-price="${C.price}"
                                >
                                <div class="ml-3">
                                    <p class="font-medium text-gray-900">${Templates.escapeHtml(C.name)}</p>
                                    ${C.description?`<p class="text-sm text-gray-500">${Templates.escapeHtml(C.description)}</p>`:""}
                                    ${C.estimated_days?`<p class="text-sm text-gray-500">Delivery in ${C.estimated_days} days</p>`:""}
                                </div>
                            </div>
                            <span class="font-semibold text-gray-900">${C.price>0?Templates.formatPrice(C.price):"Free"}</span>
                        </label>
                    `).join("")}
                </div>
            `,u.querySelectorAll('input[name="shipping_method"]').forEach((C,B)=>{C.__price=z[B]?z[B].price:0,C.addEventListener("change",()=>{S(parseFloat(C.__price)||0)})}),z.length>0&&(e.shipping_method=z[0].id,S(z[0].price||0))}catch(f){console.error("Failed to load shipping methods:",f),u.innerHTML='<p class="text-red-500">Failed to load shipping methods. Please try again.</p>'}}}async function A(){let u=document.getElementById("payment-methods-container");if(u)try{let f=new URLSearchParams;window.CONFIG&&CONFIG.shippingData&&CONFIG.shippingData.countryCode&&f.set("country",CONFIG.shippingData.countryCode),n&&(n.total||n.total===0)&&f.set("amount",n.total);let T=await(await fetch(`/api/v1/payments/gateways/available/?${f.toString()}`,{credentials:"same-origin"})).json(),z=T&&T.data||[],V=u.querySelectorAll(".payment-option");if(V&&V.length>0){try{let B=Array.from(V).map(P=>P.dataset.gateway).filter(Boolean),W=(z||[]).map(P=>P.code);if(B.length===W.length&&B.every((P,X)=>P===W[X])){s();return}}catch(B){console.warn("Failed to compare existing payment gateways:",B)}if(z.length===0)return}if(!z||z.length===0){u.innerHTML=`
                    <div class="text-center py-8 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl">
                        <svg class="w-16 h-16 mx-auto mb-4 text-gray-300 dark:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"></path></svg>
                        <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">No payment methods are configured</h3>
                        <p class="text-gray-500 dark:text-gray-400 mb-2">We don't have any payment providers configured for your currency or location. Please contact support to enable online payments.</p>
                        <p class="text-sm text-gray-400">You can still place an order if Cash on Delivery or Bank Transfer is available from admin.</p>
                    </div>
                `;return}let C=document.createDocumentFragment();z.forEach((B,W)=>{let O=document.createElement("div");O.className="relative payment-option transform transition-all duration-300 hover:scale-[1.01]",O.dataset.gateway=B.code,O.style.animation="slideIn 0.3s ease-out both",O.style.animationDelay=`${W*80}ms`;let P=document.createElement("input");P.type="radio",P.name="payment_method",P.value=B.code,P.id=`payment-${B.code}`,P.className="peer sr-only",W===0&&(P.checked=!0);let X=document.createElement("label");X.setAttribute("for",P.id),X.className="flex items-center justify-between p-4 border-2 rounded-xl cursor-pointer transition-all duration-300 hover:border-gray-400 border-gray-200",X.innerHTML=`
                    <div class="flex items-center">
                        <div class="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mr-4">
                            ${B.icon_url?`<img src="${B.icon_url}" class="h-6" alt="${B.name}">`:`<span class="font-bold">${B.code.toUpperCase()}</span>`}
                        </div>
                        <div>
                            <p class="font-medium text-gray-900 dark:text-white">${Templates.escapeHtml(B.name)}</p>
                            <p class="text-sm text-gray-500 dark:text-gray-400">${Templates.escapeHtml(B.description||"")}</p>
                            ${B.fee_text?`<p class="text-xs text-amber-600 dark:text-amber-400 mt-1">${Templates.escapeHtml(B.fee_text)}</p>`:""}
                            ${B.instructions?`<p class="text-xs text-gray-500 dark:text-gray-400 mt-2">${B.instructions}</p>`:""}
                        </div>
                    </div>
                `,O.appendChild(P),O.appendChild(X);let ee=document.createElement("div");ee.className="absolute top-4 right-4 opacity-0 peer-checked:opacity-100 transition-opacity duration-300",ee.innerHTML='<svg class="w-6 h-6 text-primary-600" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"></path></svg>',O.appendChild(ee),C.appendChild(O),B.public_key&&B.requires_client&&E(B.public_key).catch(re=>console.error("Failed to load Stripe:",re))}),u.replaceChildren(C),s()}catch(f){console.error("Failed to load payment gateways:",f)}}function E(u){return new Promise((f,I)=>{if(window.Stripe&&window.STRIPE_PUBLISHABLE_KEY===u){f();return}if(window.STRIPE_PUBLISHABLE_KEY=u,window.Stripe){v(u),f();return}let T=document.createElement("script");T.src="https://js.stripe.com/v3/",T.async=!0,T.onload=()=>{try{v(u),f()}catch(z){I(z)}},T.onerror=z=>I(z),document.head.appendChild(T)})}function v(u){if(typeof Stripe>"u")throw new Error("Stripe script not loaded");try{let f=Stripe(u),T=f.elements().create("card"),z=document.getElementById("card-element");z&&(z.innerHTML="",T.mount("#card-element"),T.on("change",V=>{let C=document.getElementById("card-errors");C&&(C.textContent=V.error?V.error.message:"")}),window.stripeInstance=f,window.stripeCard=T)}catch(f){throw console.error("Error initializing Stripe elements:",f),f}}(function(){document.addEventListener("DOMContentLoaded",()=>{setTimeout(()=>{A()},50)})})();function S(u){let f=document.getElementById("shipping-cost"),I=document.getElementById("order-total");if(f&&(f.textContent=u>0?Templates.formatPrice(u):"Free"),I&&n){let T=(n.total||0)+u;I.textContent=Templates.formatPrice(T)}}function L(){let u=document.querySelector('input[name="shipping_method"]:checked');return u?(e.shipping_method=u.value,!0):(Toast.error("Please select a shipping method."),!1)}function g(){let u=document.getElementById("order-summary-toggle"),f=document.getElementById("order-summary-block");if(!u||!f)return;u.addEventListener("click",()=>{let T=f.classList.toggle("hidden");u.setAttribute("aria-expanded",(!T).toString());let z=u.querySelector("svg");z&&z.classList.toggle("rotate-180",!T)});let I=window.getComputedStyle(f).display==="none"||f.classList.contains("hidden");u.setAttribute("aria-expanded",(!I).toString())}function r(){let u=document.querySelector('input[name="payment_method"]:checked'),f=document.getElementById("payment-form");if(Y(f),!u){let T=document.getElementById("payment-methods-container")||f;return j(T,"Please select a payment method."),y(T),!1}let I=u.value;if(I==="stripe"){let T=document.getElementById("cardholder-name");if(!T||!T.value.trim())return j(T||f,"Cardholder name is required."),y(f),!1;if(!window.stripeCard)return j(document.getElementById("card-element")||f,"Card input not ready. Please wait and try again."),!1}if(I==="bkash"){let T=document.getElementById("bkash-number");if(!T||!T.value.trim())return j(T||f,"bKash mobile number is required."),y(f),!1}if(I==="nagad"){let T=document.getElementById("nagad-number");if(!T||!T.value.trim())return j(T||f,"Nagad mobile number is required."),y(f),!1}return e.payment_method=I,!0}function s(){let u=document.getElementById("same-as-shipping"),f=document.getElementById("billing-address-form");u?.addEventListener("change",V=>{e.same_as_shipping=V.target.checked,f?.classList.toggle("hidden",V.target.checked)}),document.querySelectorAll('input[name="payment_method"]').forEach(V=>{let C=B=>{document.querySelectorAll("[data-payment-form]").forEach(P=>{P.classList.add("hidden")});let W=B.target?B.target.value:V.value||null;if(!W)return;let O=document.querySelector(`[data-payment-form="${W}"]`);O||(O=document.getElementById(`${W}-form`)),O?.classList.remove("hidden")};V.addEventListener("change",C),V.checked&&C({target:V})});let T=document.getElementById("place-order-btn"),z=document.getElementById("place-order-form");T&&(!z||!z.action||z.action.includes("javascript"))&&T.addEventListener("click",async V=>{V.preventDefault(),await i()})}async function i(){if(!r())return;let u=document.getElementById("place-order-btn");u.disabled=!0,u.innerHTML='<svg class="animate-spin h-5 w-5 mx-auto" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>';try{let f=document.getElementById("order-notes")?.value;if(e.notes=f||"",!e.same_as_shipping){let z=document.getElementById("billing-address-form");if(z){let V=new FormData(z);e.billing_address={first_name:V.get("billing_first_name"),last_name:V.get("billing_last_name"),address_line_1:V.get("billing_address_line_1"),address_line_2:V.get("billing_address_line_2"),city:V.get("billing_city"),state:V.get("billing_state"),postal_code:V.get("billing_postal_code"),country:V.get("billing_country")}}}let T=(await CheckoutApi.createOrder(e)).data;e.payment_method==="stripe"||e.payment_method==="card"?await l(T):e.payment_method==="paypal"?await c(T):window.location.href=`/orders/${T.id}/confirmation/`}catch(f){console.error("Failed to place order:",f),Toast.error(f.message||"Failed to place order. Please try again."),u.disabled=!1,u.textContent="Place Order"}}async function l(u){try{let f=await CheckoutApi.createPaymentIntent(u.id),{client_secret:I}=f.data,T=f.data.publishable_key||window.STRIPE_PUBLISHABLE_KEY||(window.stripeInstance?window.STRIPE_PUBLISHABLE_KEY:null);if(typeof Stripe>"u"&&!window.stripeInstance)throw new Error("Stripe is not loaded.");let V=await(window.stripeInstance||Stripe(T)).confirmCardPayment(I,{payment_method:{card:window.stripeCard,billing_details:{name:`${e.shipping_address.first_name} ${e.shipping_address.last_name}`}}});if(V.error)throw new Error(V.error.message);window.location.href=`/orders/${u.id}/confirmation/`}catch(f){console.error("Stripe payment failed:",f),Toast.error(f.message||"Payment failed. Please try again.");let I=document.getElementById("place-order-btn");I.disabled=!1,I.textContent="Place Order"}}async function c(u){try{let f=await CheckoutApi.createPayPalOrder(u.id),{approval_url:I}=f.data;window.location.href=I}catch(f){console.error("PayPal payment failed:",f),Toast.error(f.message||"Payment failed. Please try again.");let I=document.getElementById("place-order-btn");I.disabled=!1,I.textContent="Place Order"}}function h(){n=null,e={shipping_address:null,billing_address:null,same_as_shipping:!0,shipping_method:null,payment_method:null,notes:""},t=1}return{init:o,destroy:h}})();window.CheckoutPage=ks;lr=ks});var $s={};J($s,{default:()=>dr});var Ls,dr,Ts=Q(()=>{Ls=(function(){"use strict";async function n(){_(),await R(),e()}function e(){t(),o(),p(),b(),k()}function t(){let j=document.getElementById("contact-map");if(!j)return;let y=j.dataset.lat||"0",M=j.dataset.lng||"0",D=j.dataset.address||"Our Location";j.innerHTML=`
            <div class="relative w-full h-64 md:h-80 rounded-2xl overflow-hidden bg-stone-100 dark:bg-stone-800 group">
                <iframe 
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3022.9663095343008!2d${M}!3d${y}!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zM!5e0!3m2!1sen!2sus!4v1234567890"
                    class="w-full h-full border-0"
                    allowfullscreen=""
                    loading="lazy"
                    referrerpolicy="no-referrer-when-downgrade"
                ></iframe>
                <a 
                    href="https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(D)}"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="absolute bottom-4 right-4 px-4 py-2 bg-white dark:bg-stone-800 rounded-xl shadow-lg flex items-center gap-2 text-sm font-medium text-stone-700 dark:text-stone-200 hover:bg-stone-50 dark:hover:bg-stone-700 transition-colors"
                >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/></svg>
                    Open in Google Maps
                </a>
            </div>
        `}function o(){let j=document.getElementById("live-chat-cta");j&&(j.innerHTML=`
            <div class="bg-gradient-to-br from-primary-600 to-primary-700 dark:from-amber-600 dark:to-amber-700 rounded-2xl p-6 text-white">
                <div class="flex items-start gap-4">
                    <div class="w-12 h-12 bg-white/20 backdrop-blur rounded-xl flex items-center justify-center flex-shrink-0">
                        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/></svg>
                    </div>
                    <div class="flex-1">
                        <h3 class="font-bold text-lg">Need Instant Help?</h3>
                        <p class="text-white/90 text-sm mt-1 mb-4">Our support team is online and ready to assist you right now.</p>
                        <button id="open-live-chat" class="inline-flex items-center gap-2 px-4 py-2 bg-white text-primary-700 dark:text-amber-700 font-semibold rounded-xl hover:bg-white/90 transition-colors">
                            <span class="relative flex h-2 w-2">
                                <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                <span class="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                            </span>
                            Start Live Chat
                        </button>
                    </div>
                </div>
            </div>
        `,document.getElementById("open-live-chat")?.addEventListener("click",()=>{document.dispatchEvent(new CustomEvent("chat:open"))}))}function p(){let j=document.getElementById("quick-contact");if(!j)return;let y=[{icon:"phone",label:"Call Us",action:"tel:",color:"emerald"},{icon:"whatsapp",label:"WhatsApp",action:"https://wa.me/",color:"green"},{icon:"email",label:"Email",action:"mailto:",color:"blue"}];j.innerHTML=`
            <div class="grid grid-cols-3 gap-4">
                <a href="tel:+1234567890" class="flex flex-col items-center gap-2 p-4 bg-white dark:bg-stone-800 rounded-xl border border-stone-200 dark:border-stone-700 hover:border-emerald-500 dark:hover:border-emerald-500 hover:shadow-lg transition-all group">
                    <div class="w-12 h-12 bg-emerald-100 dark:bg-emerald-900/30 rounded-xl flex items-center justify-center text-emerald-600 dark:text-emerald-400 group-hover:scale-110 transition-transform">
                        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/></svg>
                    </div>
                    <span class="text-sm font-medium text-stone-700 dark:text-stone-300">Call Us</span>
                </a>
                <a href="https://wa.me/1234567890" target="_blank" rel="noopener noreferrer" class="flex flex-col items-center gap-2 p-4 bg-white dark:bg-stone-800 rounded-xl border border-stone-200 dark:border-stone-700 hover:border-green-500 dark:hover:border-green-500 hover:shadow-lg transition-all group">
                    <div class="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-xl flex items-center justify-center text-green-600 dark:text-green-400 group-hover:scale-110 transition-transform">
                        <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                    </div>
                    <span class="text-sm font-medium text-stone-700 dark:text-stone-300">WhatsApp</span>
                </a>
                <a href="mailto:support@bunoraa.com" class="flex flex-col items-center gap-2 p-4 bg-white dark:bg-stone-800 rounded-xl border border-stone-200 dark:border-stone-700 hover:border-blue-500 dark:hover:border-blue-500 hover:shadow-lg transition-all group">
                    <div class="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform">
                        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
                    </div>
                    <span class="text-sm font-medium text-stone-700 dark:text-stone-300">Email</span>
                </a>
            </div>
        `}function b(){let j=document.getElementById("faq-preview");if(!j)return;let y=[{q:"How long does shipping take?",a:"Standard shipping takes 5-7 business days. Express options are available at checkout."},{q:"What is your return policy?",a:"We offer a 30-day hassle-free return policy on all unused items in original packaging."},{q:"Do you ship internationally?",a:"Yes! We ship to over 100 countries worldwide."}];j.innerHTML=`
            <div class="bg-white dark:bg-stone-800 rounded-2xl border border-stone-200 dark:border-stone-700 overflow-hidden">
                <div class="px-6 py-4 border-b border-stone-200 dark:border-stone-700 flex items-center justify-between">
                    <h3 class="font-semibold text-stone-900 dark:text-white">Frequently Asked Questions</h3>
                    <a href="/faq/" class="text-sm text-primary-600 dark:text-amber-400 hover:underline">View All</a>
                </div>
                <div class="divide-y divide-stone-200 dark:divide-stone-700">
                    ${y.map((M,D)=>`
                        <div class="faq-item" data-index="${D}">
                            <button class="faq-trigger w-full px-6 py-4 flex items-center justify-between text-left hover:bg-stone-50 dark:hover:bg-stone-700/50 transition-colors">
                                <span class="font-medium text-stone-900 dark:text-white pr-4">${Templates.escapeHtml(M.q)}</span>
                                <svg class="faq-icon w-5 h-5 text-stone-400 transform transition-transform flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/></svg>
                            </button>
                            <div class="faq-answer hidden px-6 pb-4 text-stone-600 dark:text-stone-400">
                                ${Templates.escapeHtml(M.a)}
                            </div>
                        </div>
                    `).join("")}
                </div>
            </div>
        `,j.querySelectorAll(".faq-trigger").forEach(M=>{M.addEventListener("click",()=>{let D=M.closest(".faq-item"),A=D.querySelector(".faq-answer"),E=D.querySelector(".faq-icon"),v=!A.classList.contains("hidden");j.querySelectorAll(".faq-item").forEach(S=>{S!==D&&(S.querySelector(".faq-answer").classList.add("hidden"),S.querySelector(".faq-icon").classList.remove("rotate-180"))}),A.classList.toggle("hidden"),E.classList.toggle("rotate-180")})})}function k(){let j=document.getElementById("office-status");if(!j)return;let y={start:9,end:18,timezone:"America/New_York",days:[1,2,3,4,5]};function M(){let D=new Date,A=D.getDay(),E=D.getHours(),S=y.days.includes(A)&&E>=y.start&&E<y.end;j.innerHTML=`
                <div class="flex items-center gap-3 p-4 rounded-xl ${S?"bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800":"bg-stone-100 dark:bg-stone-800 border border-stone-200 dark:border-stone-700"}">
                    <span class="relative flex h-3 w-3">
                        ${S?`<span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                             <span class="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>`:'<span class="relative inline-flex rounded-full h-3 w-3 bg-stone-400"></span>'}
                    </span>
                    <div>
                        <p class="font-medium ${S?"text-emerald-700 dark:text-emerald-400":"text-stone-600 dark:text-stone-400"}">
                            ${S?"We're Open!":"Currently Closed"}
                        </p>
                        <p class="text-xs ${S?"text-emerald-600 dark:text-emerald-500":"text-stone-500 dark:text-stone-500"}">
                            ${S?"Our team is available to help you.":`Office hours: Mon-Fri ${y.start}AM - ${y.end>12?y.end-12+"PM":y.end+"AM"}`}
                        </p>
                    </div>
                </div>
            `}M(),setInterval(M,6e4)}function _(){let j=document.getElementById("contact-form");if(!j)return;let y=FormValidator.create(j,{name:{required:!0,minLength:2,maxLength:100},email:{required:!0,email:!0},subject:{required:!0,minLength:5,maxLength:200},message:{required:!0,minLength:20,maxLength:2e3}});j.addEventListener("submit",async M=>{if(M.preventDefault(),!y.validate()){Toast.error("Please fill in all required fields correctly.");return}let D=j.querySelector('button[type="submit"]'),A=D.textContent;D.disabled=!0,D.innerHTML='<svg class="animate-spin h-5 w-5 mx-auto" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>';try{let E=new FormData(j),v={name:E.get("name"),email:E.get("email"),phone:E.get("phone"),subject:E.get("subject"),message:E.get("message")};await SupportApi.submitContactForm(v),Toast.success("Thank you for your message! We'll get back to you soon."),j.reset(),y.clearErrors(),q()}catch(E){Toast.error(E.message||"Failed to send message. Please try again.")}finally{D.disabled=!1,D.textContent=A}})}function q(){let j=document.getElementById("contact-form"),y=document.getElementById("contact-success");j&&y&&(j.classList.add("hidden"),y.classList.remove("hidden"),y.innerHTML=`
                <div class="text-center py-12">
                    <div class="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg class="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                        </svg>
                    </div>
                    <h3 class="text-xl font-semibold text-gray-900 mb-2">Message Sent!</h3>
                    <p class="text-gray-600 mb-6">Thank you for reaching out. We'll respond to your inquiry within 24-48 hours.</p>
                    <button id="send-another-btn" class="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors">
                        Send Another Message
                    </button>
                </div>
            `,document.getElementById("send-another-btn")?.addEventListener("click",()=>{j.classList.remove("hidden"),y.classList.add("hidden")}))}async function R(){let j=document.getElementById("contact-info");if(j)try{let M=(await PagesApi.getContactInfo()).data;if(!M)return;j.innerHTML=`
                <div class="space-y-6">
                    ${M.address?`
                        <div class="flex gap-4">
                            <div class="flex-shrink-0 w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                                <svg class="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
                                </svg>
                            </div>
                            <div>
                                <h3 class="font-semibold text-gray-900">Address</h3>
                                <p class="text-gray-600">${Templates.escapeHtml(M.address)}</p>
                            </div>
                        </div>
                    `:""}
                    
                    ${M.phone?`
                        <div class="flex gap-4">
                            <div class="flex-shrink-0 w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                                <svg class="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>
                                </svg>
                            </div>
                            <div>
                                <h3 class="font-semibold text-gray-900">Phone</h3>
                                <a href="tel:${M.phone}" class="text-gray-600 hover:text-primary-600">${Templates.escapeHtml(M.phone)}</a>
                            </div>
                        </div>
                    `:""}
                    
                    ${M.email?`
                        <div class="flex gap-4">
                            <div class="flex-shrink-0 w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                                <svg class="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                                </svg>
                            </div>
                            <div>
                                <h3 class="font-semibold text-gray-900">Email</h3>
                                <a href="mailto:${M.email}" class="text-gray-600 hover:text-primary-600">${Templates.escapeHtml(M.email)}</a>
                            </div>
                        </div>
                    `:""}
                    
                    ${M.business_hours?`
                        <div class="flex gap-4">
                            <div class="flex-shrink-0 w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                                <svg class="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                                </svg>
                            </div>
                            <div>
                                <h3 class="font-semibold text-gray-900">Business Hours</h3>
                                <p class="text-gray-600">${Templates.escapeHtml(M.business_hours)}</p>
                            </div>
                        </div>
                    `:""}
                    
                    ${M.social_links&&Object.keys(M.social_links).length>0?`
                        <div class="pt-4 border-t border-gray-200">
                            <h3 class="font-semibold text-gray-900 mb-3">Follow Us</h3>
                            <div class="flex gap-3">
                                ${M.social_links.facebook?`
                                    <a href="${M.social_links.facebook}" target="_blank" class="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center hover:bg-gray-200 transition-colors">
                                        <svg class="w-5 h-5 text-[#1877F2]" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                                    </a>
                                `:""}
                                ${M.social_links.instagram?`
                                    <a href="${M.social_links.instagram}" target="_blank" class="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center hover:bg-gray-200 transition-colors">
                                        <svg class="w-5 h-5 text-[#E4405F]" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
                                    </a>
                                `:""}
                                ${M.social_links.twitter?`
                                    <a href="${M.social_links.twitter}" target="_blank" class="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center hover:bg-gray-200 transition-colors">
                                        <svg class="w-5 h-5 text-[#1DA1F2]" fill="currentColor" viewBox="0 0 24 24"><path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/></svg>
                                    </a>
                                `:""}
                                ${M.social_links.youtube?`
                                    <a href="${M.social_links.youtube}" target="_blank" class="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center hover:bg-gray-200 transition-colors">
                                        <svg class="w-5 h-5 text-[#FF0000]" fill="currentColor" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
                                    </a>
                                `:""}
                            </div>
                        </div>
                    `:""}
                </div>
            `}catch(y){console.error("Failed to load contact info:",y)}}function Y(){}return{init:n,destroy:Y}})();window.ContactPage=Ls;dr=Ls});var Bs={};J(Bs,{default:()=>cr});var Is,cr,Ss=Q(()=>{Is=(function(){"use strict";let n=[],e=[];async function t(){let r=document.getElementById("faq-list");r&&r.querySelector(".faq-item")?j():await y(),S(),o()}function o(){p(),b(),k(),_(),q(),R(),Y()}function p(){if(!document.querySelector(".faq-search-container")||!("webkitSpeechRecognition"in window||"SpeechRecognition"in window))return;let s=window.SpeechRecognition||window.webkitSpeechRecognition,i=new s;i.continuous=!1,i.lang="en-US";let l=document.createElement("button");l.id="faq-voice-search",l.type="button",l.className="absolute right-12 top-1/2 -translate-y-1/2 p-2 text-stone-400 hover:text-primary-600 dark:hover:text-amber-400 transition-colors",l.innerHTML=`
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"/></svg>
        `;let c=document.getElementById("faq-search");c&&c.parentElement&&(c.parentElement.style.position="relative",c.parentElement.appendChild(l));let h=!1;l.addEventListener("click",()=>{h?i.stop():(i.start(),l.classList.add("text-red-500","animate-pulse")),h=!h}),i.onresult=u=>{let f=u.results[0][0].transcript;c&&(c.value=f,c.dispatchEvent(new Event("input"))),l.classList.remove("text-red-500","animate-pulse"),h=!1},i.onerror=()=>{l.classList.remove("text-red-500","animate-pulse"),h=!1}}function b(){document.querySelectorAll(".faq-content, .accordion-content, .faq-answer").forEach(r=>{if(r.querySelector(".faq-rating"))return;let i=(r.closest(".faq-item")||r.closest("[data-accordion]"))?.dataset.id||Math.random().toString(36).substr(2,9),l=`
                <div class="faq-rating mt-4 pt-4 border-t border-stone-200 dark:border-stone-700 flex items-center justify-between">
                    <span class="text-sm text-stone-500 dark:text-stone-400">Was this answer helpful?</span>
                    <div class="flex gap-2">
                        <button class="faq-rate-btn px-3 py-1 text-sm border border-stone-200 dark:border-stone-600 rounded-lg hover:bg-emerald-50 dark:hover:bg-emerald-900/20 hover:border-emerald-500 hover:text-emerald-600 dark:hover:text-emerald-400 transition-all" data-helpful="yes" data-question="${i}">
                            <span class="flex items-center gap-1">
                                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5"/></svg>
                                Yes
                            </span>
                        </button>
                        <button class="faq-rate-btn px-3 py-1 text-sm border border-stone-200 dark:border-stone-600 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 hover:border-red-500 hover:text-red-600 dark:hover:text-red-400 transition-all" data-helpful="no" data-question="${i}">
                            <span class="flex items-center gap-1">
                                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14H5.236a2 2 0 01-1.789-2.894l3.5-7A2 2 0 018.736 3h4.018a2 2 0 01.485.06l3.76.94m-7 10v5a2 2 0 002 2h.096c.5 0 .905-.405.905-.904 0-.715.211-1.413.608-2.008L17 13V4m-7 10h2m5-10h2a2 2 0 012 2v6a2 2 0 01-2 2h-2.5"/></svg>
                                No
                            </span>
                        </button>
                    </div>
                </div>
            `;r.insertAdjacentHTML("beforeend",l)}),document.addEventListener("click",r=>{let s=r.target.closest(".faq-rate-btn");if(!s)return;let i=s.dataset.helpful==="yes",l=s.dataset.question,c=s.closest(".faq-rating"),h=JSON.parse(localStorage.getItem("faqRatings")||"{}");h[l]=i,localStorage.setItem("faqRatings",JSON.stringify(h)),c.innerHTML=`
                <div class="flex items-center gap-2 text-sm ${i?"text-emerald-600 dark:text-emerald-400":"text-stone-500 dark:text-stone-400"}">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                    <span>Thanks for your feedback!</span>
                </div>
            `,typeof analytics<"u"&&analytics.track("faq_rated",{questionId:l,helpful:i})})}function k(){let r=document.getElementById("faq-contact-promo");r&&(r.innerHTML=`
            <div class="bg-gradient-to-br from-stone-900 to-stone-800 dark:from-stone-800 dark:to-stone-900 text-white rounded-2xl p-6 md:p-8">
                <div class="flex flex-col md:flex-row items-center gap-6">
                    <div class="w-16 h-16 bg-primary-600 dark:bg-amber-600 rounded-2xl flex items-center justify-center flex-shrink-0">
                        <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                    </div>
                    <div class="text-center md:text-left flex-1">
                        <h3 class="text-xl font-bold mb-2">Can't Find What You're Looking For?</h3>
                        <p class="text-stone-300 mb-4">Our support team is here to help. Get personalized assistance for your questions.</p>
                        <div class="flex flex-col sm:flex-row gap-3 justify-center md:justify-start">
                            <a href="/contact/" class="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white text-stone-900 font-semibold rounded-xl hover:bg-stone-100 transition-colors">
                                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
                                Contact Support
                            </a>
                            <button id="open-chat-faq" class="inline-flex items-center justify-center gap-2 px-6 py-3 bg-primary-600 dark:bg-amber-600 text-white font-semibold rounded-xl hover:bg-primary-700 dark:hover:bg-amber-700 transition-colors">
                                <span class="relative flex h-2 w-2">
                                    <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                                    <span class="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
                                </span>
                                Live Chat
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `,document.getElementById("open-chat-faq")?.addEventListener("click",()=>{document.dispatchEvent(new CustomEvent("chat:open"))}))}function _(){let r=document.getElementById("popular-questions");if(!r)return;let s=JSON.parse(localStorage.getItem("faqRatings")||"{}"),i=Object.entries(s).filter(([c,h])=>h).slice(0,5).map(([c])=>c),l=[];document.querySelectorAll(".faq-item, [data-accordion]").forEach(c=>{let h=c.dataset.id;if(i.includes(h)||l.length<3){let u=c.querySelector("button span, .accordion-toggle span")?.textContent?.trim();u&&l.push({id:h,question:u,element:c})}}),l.length!==0&&(r.innerHTML=`
            <div class="bg-primary-50 dark:bg-amber-900/20 rounded-2xl p-6">
                <h3 class="font-semibold text-stone-900 dark:text-white mb-4 flex items-center gap-2">
                    <svg class="w-5 h-5 text-primary-600 dark:text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"/></svg>
                    Most Helpful Questions
                </h3>
                <ul class="space-y-2">
                    ${l.slice(0,5).map(c=>`
                        <li>
                            <button class="popular-q-link text-left text-primary-600 dark:text-amber-400 hover:underline text-sm" data-target="${c.id}">
                                ${Templates.escapeHtml(c.question)}
                            </button>
                        </li>
                    `).join("")}
                </ul>
            </div>
        `,r.querySelectorAll(".popular-q-link").forEach(c=>{c.addEventListener("click",()=>{let h=c.dataset.target,u=document.querySelector(`[data-id="${h}"], .faq-item`);if(u){u.scrollIntoView({behavior:"smooth",block:"center"});let f=u.querySelector(".faq-trigger, .accordion-toggle");f&&f.click()}})}))}function q(){document.querySelectorAll(".faq-content, .accordion-content, .faq-answer").forEach(r=>{if(r.querySelector(".faq-share"))return;let i=(r.closest(".faq-item")||r.closest("[data-accordion]"))?.querySelector("button span, .accordion-toggle span")?.textContent?.trim();if(!i)return;let l=`
                <div class="faq-share flex items-center gap-2 mt-3">
                    <span class="text-xs text-stone-400 dark:text-stone-500">Share:</span>
                    <button class="faq-share-btn p-1.5 hover:bg-stone-100 dark:hover:bg-stone-700 rounded transition-colors" data-platform="copy" title="Copy link">
                        <svg class="w-4 h-4 text-stone-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"/></svg>
                    </button>
                    <a href="https://twitter.com/intent/tweet?text=${encodeURIComponent("Q: "+i)}&url=${encodeURIComponent(window.location.href)}" target="_blank" rel="noopener noreferrer" class="faq-share-btn p-1.5 hover:bg-stone-100 dark:hover:bg-stone-700 rounded transition-colors" title="Share on Twitter">
                        <svg class="w-4 h-4 text-stone-400" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                    </a>
                    <a href="mailto:?subject=${encodeURIComponent("FAQ: "+i)}&body=${encodeURIComponent(window.location.href)}" class="faq-share-btn p-1.5 hover:bg-stone-100 dark:hover:bg-stone-700 rounded transition-colors" title="Share via email">
                        <svg class="w-4 h-4 text-stone-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
                    </a>
                </div>
            `;r.insertAdjacentHTML("beforeend",l)}),document.addEventListener("click",r=>{let s=r.target.closest('.faq-share-btn[data-platform="copy"]');s&&navigator.clipboard.writeText(window.location.href).then(()=>{let i=s.innerHTML;s.innerHTML='<svg class="w-4 h-4 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>',setTimeout(()=>{s.innerHTML=i},2e3)})})}function R(){let r=document.querySelectorAll(".faq-item, [data-accordion]"),s=-1;document.addEventListener("keydown",i=>{if(document.querySelector("#faq-container, #faq-list")){if(i.key==="ArrowDown"||i.key==="ArrowUp"){i.preventDefault(),i.key==="ArrowDown"?s=Math.min(s+1,r.length-1):s=Math.max(s-1,0);let l=r[s];if(l){l.scrollIntoView({behavior:"smooth",block:"center"});let c=l.querySelector(".faq-trigger, .accordion-toggle, button");c&&c.focus()}}if(i.key==="Enter"&&s>=0){let c=r[s]?.querySelector(".faq-trigger, .accordion-toggle");c&&c.click()}i.key==="/"&&document.activeElement?.tagName!=="INPUT"&&(i.preventDefault(),document.getElementById("faq-search")?.focus())}})}function Y(){let r=new IntersectionObserver(s=>{s.forEach(i=>{if(i.isIntersecting){let l=i.target,c=l.querySelector("button span, .accordion-toggle span")?.textContent?.trim(),h=JSON.parse(localStorage.getItem("faqViews")||"{}"),u=l.dataset.id||c?.substring(0,30);u&&(h[u]=(h[u]||0)+1,localStorage.setItem("faqViews",JSON.stringify(h)))}})},{threshold:.5});document.querySelectorAll(".faq-item, [data-accordion]").forEach(s=>{r.observe(s)}),document.addEventListener("click",s=>{let i=s.target.closest(".faq-trigger, .accordion-toggle");if(i){let l=i.closest(".faq-item, [data-accordion]"),c=i.querySelector("span")?.textContent?.trim();typeof analytics<"u"&&analytics.track("faq_opened",{question:c?.substring(0,100)})}})}function j(){let r=document.querySelectorAll(".category-tab"),s=document.querySelectorAll(".faq-category");r.forEach(l=>{l.addEventListener("click",c=>{c.preventDefault(),r.forEach(f=>{f.classList.remove("bg-primary-600","dark:bg-amber-600","text-white"),f.classList.add("bg-stone-100","dark:bg-stone-800","text-stone-700","dark:text-stone-300")}),l.classList.add("bg-primary-600","dark:bg-amber-600","text-white"),l.classList.remove("bg-stone-100","dark:bg-stone-800","text-stone-700","dark:text-stone-300");let h=l.dataset.category;h==="all"?s.forEach(f=>f.classList.remove("hidden")):s.forEach(f=>{f.classList.toggle("hidden",f.dataset.category!==h)});let u=document.getElementById("faq-search");u&&(u.value=""),document.querySelectorAll(".faq-item").forEach(f=>f.classList.remove("hidden"))})}),document.querySelectorAll(".accordion-toggle").forEach(l=>{l.addEventListener("click",()=>{let c=l.closest("[data-accordion]"),h=c.querySelector(".accordion-content"),u=c.querySelector(".accordion-icon"),f=!h.classList.contains("hidden");document.querySelectorAll("[data-accordion]").forEach(I=>{I!==c&&(I.querySelector(".accordion-content")?.classList.add("hidden"),I.querySelector(".accordion-icon")?.classList.remove("rotate-180"))}),f?(h.classList.add("hidden"),u.classList.remove("rotate-180")):(h.classList.remove("hidden"),u.classList.add("rotate-180"))})})}async function y(){let r=document.getElementById("faq-container");if(r){Loader.show(r,"skeleton");try{let i=(await PagesApi.getFAQs()).data||[];if(e=i,i.length===0){r.innerHTML=`
                    <div class="text-center py-12">
                        <svg class="w-16 h-16 text-stone-300 dark:text-stone-600 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                        </svg>
                        <p class="text-stone-500 dark:text-stone-400">No FAQs available at the moment.</p>
                    </div>
                `;return}n=M(i),D(n)}catch(s){console.error("Failed to load FAQs:",s),r.innerHTML=`
                <div class="text-center py-12">
                    <svg class="w-16 h-16 text-red-300 dark:text-red-600 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                    </svg>
                    <p class="text-red-500 dark:text-red-400">Failed to load FAQs. Please try again later.</p>
                </div>
            `}}}function M(r){let s={};return r.forEach(i=>{let l=i.category||"General";s[l]||(s[l]=[]),s[l].push(i)}),s}function D(r,s=""){let i=document.getElementById("faq-container");if(!i)return;let l=Object.keys(r);if(l.length===0){i.innerHTML=`
                <div class="text-center py-12">
                    <svg class="w-16 h-16 text-stone-300 dark:text-stone-600 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                    </svg>
                    <p class="text-stone-500 dark:text-stone-400">No FAQs found${s?` for "${Templates.escapeHtml(s)}"`:""}.</p>
                </div>
            `;return}i.innerHTML=`
            <!-- Category Tabs -->
            <div class="mb-8 overflow-x-auto scrollbar-hide">
                <div class="flex gap-2 pb-2">
                    <button class="faq-category-btn px-4 py-2 bg-primary-600 dark:bg-amber-600 text-white rounded-full text-sm font-medium whitespace-nowrap transition-colors" data-category="all">
                        All
                    </button>
                    ${l.map(c=>`
                        <button class="faq-category-btn px-4 py-2 bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 text-stone-600 dark:text-stone-300 rounded-full text-sm font-medium whitespace-nowrap transition-colors" data-category="${Templates.escapeHtml(c)}">
                            ${Templates.escapeHtml(c)}
                        </button>
                    `).join("")}
                </div>
            </div>

            <!-- FAQ Accordion -->
            <div id="faq-list" class="space-y-6">
                ${l.map(c=>`
                    <div class="faq-category" data-category="${Templates.escapeHtml(c)}">
                        <h2 class="text-lg font-semibold text-stone-900 dark:text-white mb-4">${Templates.escapeHtml(c)}</h2>
                        <div class="space-y-3">
                            ${r[c].map(h=>A(h,s)).join("")}
                        </div>
                    </div>
                `).join("")}
            </div>
        `,E(),v(),b(),q()}function A(r,s=""){let i=Templates.escapeHtml(r.question),l=r.answer;if(s){let c=new RegExp(`(${s.replace(/[.*+?^${}()|[\]\\]/g,"\\$&")})`,"gi");i=i.replace(c,'<mark class="bg-yellow-200 dark:bg-yellow-800">$1</mark>'),l=l.replace(c,'<mark class="bg-yellow-200 dark:bg-yellow-800">$1</mark>')}return`
            <div class="faq-item border border-stone-200 dark:border-stone-700 rounded-xl overflow-hidden bg-white dark:bg-stone-800" data-id="${r.id||""}">
                <button class="faq-trigger w-full px-6 py-4 text-left flex items-center justify-between hover:bg-stone-50 dark:hover:bg-stone-700/50 transition-colors">
                    <span class="font-medium text-stone-900 dark:text-white pr-4">${i}</span>
                    <svg class="faq-icon w-5 h-5 text-stone-500 dark:text-stone-400 flex-shrink-0 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
                    </svg>
                </button>
                <div class="faq-content hidden px-6 pb-4">
                    <div class="prose prose-sm dark:prose-invert max-w-none text-stone-600 dark:text-stone-300">
                        ${l}
                    </div>
                </div>
            </div>
        `}function E(){let r=document.querySelectorAll(".faq-category-btn"),s=document.querySelectorAll(".faq-category");r.forEach(i=>{i.addEventListener("click",()=>{r.forEach(c=>{c.classList.remove("bg-primary-600","dark:bg-amber-600","text-white"),c.classList.add("bg-stone-100","dark:bg-stone-800","text-stone-600","dark:text-stone-300")}),i.classList.add("bg-primary-600","dark:bg-amber-600","text-white"),i.classList.remove("bg-stone-100","dark:bg-stone-800","text-stone-600","dark:text-stone-300");let l=i.dataset.category;s.forEach(c=>{l==="all"||c.dataset.category===l?c.classList.remove("hidden"):c.classList.add("hidden")})})})}function v(){document.querySelectorAll(".faq-trigger").forEach(s=>{s.addEventListener("click",()=>{let i=s.closest(".faq-item"),l=i.querySelector(".faq-content"),c=i.querySelector(".faq-icon"),h=!l.classList.contains("hidden");document.querySelectorAll(".faq-item").forEach(u=>{u!==i&&(u.querySelector(".faq-content")?.classList.add("hidden"),u.querySelector(".faq-icon")?.classList.remove("rotate-180"))}),l.classList.toggle("hidden"),c.classList.toggle("rotate-180")})})}function S(){let r=document.getElementById("faq-search");if(!r)return;let s=null;r.addEventListener("input",l=>{let c=l.target.value.trim().toLowerCase();clearTimeout(s),s=setTimeout(()=>{if(document.querySelector(".accordion-toggle"))L(c);else if(n&&Object.keys(n).length>0){if(c.length<2){D(n);return}let u={};Object.entries(n).forEach(([f,I])=>{let T=I.filter(z=>z.question.toLowerCase().includes(c)||z.answer.toLowerCase().includes(c));T.length>0&&(u[f]=T)}),D(u,c)}},300)});let i=document.createElement("span");i.className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-stone-400 dark:text-stone-500 hidden md:block",i.textContent="Press / to search",r.parentElement&&(r.parentElement.style.position="relative",r.parentElement.appendChild(i),r.addEventListener("focus",()=>i.classList.add("hidden")),r.addEventListener("blur",()=>i.classList.remove("hidden")))}function L(r){let s=document.querySelectorAll(".faq-item"),i=document.querySelectorAll(".faq-category"),l=document.getElementById("no-results"),c=0;s.forEach(h=>{let u=h.querySelector(".accordion-toggle span, button span"),f=h.querySelector(".accordion-content"),I=u?u.textContent.toLowerCase():"",T=f?f.textContent.toLowerCase():"";!r||I.includes(r)||T.includes(r)?(h.classList.remove("hidden"),c++):h.classList.add("hidden")}),i.forEach(h=>{let u=h.querySelectorAll(".faq-item:not(.hidden)");h.classList.toggle("hidden",u.length===0)}),l&&l.classList.toggle("hidden",c>0)}function g(){n=[],e=[]}return{init:t,destroy:g}})();window.FAQPage=Is;cr=Is});var As={};J(As,{CategoryCard:()=>ur});function ur(n){let e=document.createElement("a");e.href=`/categories/${n.slug}/`,e.className="group block";let t=document.createElement("div");t.className="relative aspect-square rounded-xl overflow-hidden bg-gray-100";let o="";if(typeof n.image_url=="string"&&n.image_url?o=n.image_url:typeof n.image=="string"&&n.image?o=n.image:n.image&&typeof n.image=="object"?o=n.image.url||n.image.src||n.image_url||"":typeof n.banner_image=="string"&&n.banner_image?o=n.banner_image:n.banner_image&&typeof n.banner_image=="object"?o=n.banner_image.url||n.banner_image.src||"":typeof n.hero_image=="string"&&n.hero_image?o=n.hero_image:n.hero_image&&typeof n.hero_image=="object"?o=n.hero_image.url||n.hero_image.src||"":typeof n.thumbnail=="string"&&n.thumbnail?o=n.thumbnail:n.thumbnail&&typeof n.thumbnail=="object"&&(o=n.thumbnail.url||n.thumbnail.src||""),o){let k=document.createElement("img");k.src=o,k.alt=n.name||"",k.className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300",k.loading="lazy",k.decoding="async",k.onerror=_=>{try{k.remove();let q=document.createElement("div");q.className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary-100 to-primary-200",q.innerHTML='<svg class="w-12 h-12 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"/></svg>',t.appendChild(q)}catch{}},t.appendChild(k)}else{let k=document.createElement("div");k.className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary-100 to-primary-200",k.innerHTML='<svg class="w-12 h-12 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"/></svg>',t.appendChild(k)}let p=document.createElement("div");p.className="absolute inset-0 bg-gradient-to-t from-black/30 dark:from-black/60 to-transparent",t.appendChild(p),e.appendChild(t);let b=document.createElement("h3");if(b.className="mt-3 text-sm font-medium text-stone-900 group-hover:text-primary-600 transition-colors text-center dark:text-white",b.textContent=n.name,e.appendChild(b),n.product_count){let k=document.createElement("p");k.className="text-xs text-stone-600 dark:text-white/60 text-center",k.textContent=`${n.product_count} products`,e.appendChild(k)}return e}var _s=Q(()=>{});var qs={};J(qs,{default:()=>mr});var Ms,mr,Hs=Q(()=>{Ms=(function(){"use strict";let n=null,e=0,t=null,o=null;async function p(){window.scrollTo(0,0),await Promise.all([M(),A(),v()]),g(),R(),Y(),Promise.all([E(),y(),j()]).catch(s=>console.error("Failed to load secondary sections:",s)),setTimeout(()=>{b(),k(),_(),q()},2e3);try{S(),L()}catch(s){console.warn("Failed to load promotions/CTA:",s)}}function b(){let s=document.getElementById("live-visitors");if(!s)return;async function i(){try{let l=await window.ApiClient.get("/analytics/active-visitors/",{}),c=l.data||l;if(e=c.active_visitors||c.count||0,e===0){s.innerHTML="";return}s.innerHTML=`
                    <div class="flex items-center gap-2 px-3 py-1.5 bg-emerald-100 dark:bg-emerald-900/30 rounded-full">
                        <span class="relative flex h-2 w-2">
                            <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                            <span class="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                        </span>
                        <span class="text-xs font-medium text-emerald-700 dark:text-emerald-300">${e} browsing now</span>
                    </div>
                `}catch(l){console.warn("Failed to fetch active visitors:",l),s.innerHTML=""}}i(),setInterval(i,8e3)}function k(){let s=[],i=0,l=0,c=10;async function h(){try{let f=await window.ApiClient.get("/analytics/recent-purchases/",{});if(s=f.data||f.purchases||[],s.length===0)return;setTimeout(()=>{u(),t=setInterval(()=>{l<c?u():clearInterval(t)},3e4)},1e4)}catch(f){console.warn("Failed to fetch recent purchases:",f)}}function u(){if(s.length===0||l>=c)return;let f=s[i],I=document.createElement("div");I.className="social-proof-popup fixed bottom-4 left-4 z-50 max-w-xs bg-white dark:bg-stone-800 rounded-xl shadow-2xl border border-stone-200 dark:border-stone-700 p-4 transform translate-y-full opacity-0 transition-all duration-500";let T=`
                <div class="flex items-start gap-3">
                    <div class="w-10 h-10 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center flex-shrink-0">
                        <svg class="w-5 h-5 text-emerald-600 dark:text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>
                    </div>
                    <div>
                        <p class="text-sm font-medium text-stone-900 dark:text-white">${f.message}</p>
                        <p class="text-xs text-stone-400 dark:text-stone-500 mt-1">${f.time_ago}</p>
                    </div>
                </div>
            `;I.innerHTML=`
                ${T}
                <button class="absolute top-2 right-2 text-stone-400 hover:text-stone-600 dark:hover:text-stone-300" onclick="this.parentElement.remove()">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
                </button>
            `,document.body.appendChild(I),l++,requestAnimationFrame(()=>{I.classList.remove("translate-y-full","opacity-0")}),setTimeout(()=>{I.classList.add("translate-y-full","opacity-0"),setTimeout(()=>I.remove(),500)},5e3),i=(i+1)%s.length,l>=c&&t&&clearInterval(t)}h()}function _(){let s=document.getElementById("recently-viewed-section"),i=document.getElementById("recently-viewed"),l=document.getElementById("clear-recently-viewed");if(!s||!i)return;let c=JSON.parse(localStorage.getItem("recentlyViewed")||"[]");if(c.length===0){s.classList.add("hidden");return}s.classList.remove("hidden"),i.innerHTML=c.slice(0,5).map(h=>{let u=null;return h.discount_percent&&h.discount_percent>0&&(u=`-${h.discount_percent}%`),ProductCard.render(h,{showBadge:!!u,badge:u,priceSize:"small"})}).join(""),ProductCard.bindEvents(i),l?.addEventListener("click",()=>{localStorage.removeItem("recentlyViewed"),s.classList.add("hidden"),Toast.success("Recently viewed items cleared")})}function q(){let s=document.getElementById("flash-sale-section"),i=document.getElementById("flash-sale-countdown");if(!s||!i)return;if(!localStorage.getItem("flashSaleEnd")){let u=new Date().getTime()+144e5;localStorage.setItem("flashSaleEnd",u.toString())}let c=parseInt(localStorage.getItem("flashSaleEnd"));function h(){let u=new Date().getTime(),f=c-u;if(f<=0){s.classList.add("hidden"),clearInterval(o),localStorage.removeItem("flashSaleEnd");return}s.classList.remove("hidden");let I=Math.floor(f%(1e3*60*60*24)/(1e3*60*60)),T=Math.floor(f%(1e3*60*60)/(1e3*60)),z=Math.floor(f%(1e3*60)/1e3);i.innerHTML=`
                <div class="flex items-center gap-2 text-white">
                    <span class="text-sm font-medium">Ends in:</span>
                    <div class="flex items-center gap-1">
                        <span class="bg-white/20 px-2 py-1 rounded font-mono font-bold">${I.toString().padStart(2,"0")}</span>
                        <span class="font-bold">:</span>
                        <span class="bg-white/20 px-2 py-1 rounded font-mono font-bold">${T.toString().padStart(2,"0")}</span>
                        <span class="font-bold">:</span>
                        <span class="bg-white/20 px-2 py-1 rounded font-mono font-bold">${z.toString().padStart(2,"0")}</span>
                    </div>
                </div>
            `}h(),o=setInterval(h,1e3)}function R(){let s=document.querySelectorAll("[data-animate]");if(!s.length)return;let i=new IntersectionObserver(l=>{l.forEach(c=>{if(c.isIntersecting){let h=c.target.dataset.animate||"fadeInUp";c.target.classList.add("animate-"+h),c.target.classList.remove("opacity-0"),i.unobserve(c.target)}})},{threshold:.1,rootMargin:"0px 0px -50px 0px"});s.forEach(l=>{l.classList.add("opacity-0"),i.observe(l)})}function Y(){document.addEventListener("click",async s=>{let i=s.target.closest("[data-quick-view]");if(!i)return;let l=i.dataset.quickView;if(!l)return;s.preventDefault();let c=document.createElement("div");c.id="quick-view-modal",c.className="fixed inset-0 z-50 flex items-center justify-center p-4",c.innerHTML=`
                <div class="absolute inset-0 bg-black/50 backdrop-blur-sm" onclick="document.getElementById('quick-view-modal').remove()"></div>
                <div class="relative bg-white dark:bg-stone-800 rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-auto">
                    <button class="absolute top-4 right-4 z-10 w-10 h-10 bg-stone-100 dark:bg-stone-700 rounded-full flex items-center justify-center hover:bg-stone-200 dark:hover:bg-stone-600 transition-colors" onclick="document.getElementById('quick-view-modal').remove()">
                        <svg class="w-5 h-5 text-stone-600 dark:text-stone-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
                    </button>
                    <div class="p-8 flex items-center justify-center min-h-[400px]">
                        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
                    </div>
                </div>
            `,document.body.appendChild(c);try{let h=await ProductsApi.getProduct(l),u=h.data||h,f=c.querySelector(".relative");f.innerHTML=`
                    <button class="absolute top-4 right-4 z-10 w-10 h-10 bg-stone-100 dark:bg-stone-700 rounded-full flex items-center justify-center hover:bg-stone-200 dark:hover:bg-stone-600 transition-colors" onclick="document.getElementById('quick-view-modal').remove()">
                        <svg class="w-5 h-5 text-stone-600 dark:text-stone-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
                    </button>
                    <div class="grid md:grid-cols-2 gap-8 p-8">
                        <div class="aspect-square rounded-xl overflow-hidden bg-stone-100 dark:bg-stone-700">
                            <img src="${u.primary_image||u.image||"/static/images/placeholder.jpg"}" alt="${Templates.escapeHtml(u.name)}" class="w-full h-full object-cover">
                        </div>
                        <div class="flex flex-col">
                            <h2 class="text-2xl font-bold text-stone-900 dark:text-white mb-2">${Templates.escapeHtml(u.name)}</h2>
                            <div class="flex items-center gap-2 mb-4">
                                <div class="flex text-amber-400">
                                    ${'<svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.967a1 1 0 00.95.69h4.178c.969 0 1.371 1.24.588 1.81l-3.385 2.46a1 1 0 00-.364 1.118l1.287 3.966c.3.922-.755 1.688-1.54 1.118l-3.385-2.46a1 1 0 00-1.175 0l-3.385 2.46c-.784.57-1.838-.196-1.54-1.118l1.287-3.966a1 1 0 00-.364-1.118l-3.385-2.46c-.783-.57-.38-1.81.588-1.81h4.178a1 1 0 00.95-.69l1.286-3.967z"/></svg>'.repeat(Math.round(u.rating||4))}
                                </div>
                                <span class="text-sm text-stone-500 dark:text-stone-400">(${u.review_count||0} reviews)</span>
                            </div>
                            <div class="mb-6">
                                ${u.sale_price||u.discounted_price?`
                                    <span class="text-3xl font-bold text-primary-600 dark:text-amber-400">${Templates.formatPrice(u.sale_price||u.discounted_price)}</span>
                                    <span class="text-lg text-stone-400 line-through ml-2">${Templates.formatPrice(u.price)}</span>
                                `:`
                                    <span class="text-3xl font-bold text-stone-900 dark:text-white">${Templates.formatPrice(u.price)}</span>
                                `}
                            </div>
                            <p class="text-stone-600 dark:text-stone-400 mb-6 line-clamp-3">${Templates.escapeHtml(u.short_description||u.description||"")}</p>
                            <div class="mt-auto space-y-3">
                                <button class="w-full py-3 px-6 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-xl transition-colors" onclick="CartApi.addItem(${u.id}, 1).then(() => { Toast.success('Added to cart'); document.getElementById('quick-view-modal').remove(); })">
                                    Add to Cart
                                </button>
                                <a href="/products/${u.slug||u.id}/" class="block w-full py-3 px-6 border-2 border-stone-200 dark:border-stone-600 text-stone-700 dark:text-stone-300 font-semibold rounded-xl text-center hover:bg-stone-50 dark:hover:bg-stone-700 transition-colors">
                                    View Full Details
                                </a>
                            </div>
                        </div>
                    </div>
                `}catch(h){console.error("Failed to load product:",h),c.remove(),Toast.error("Failed to load product details")}})}async function j(){let s=document.getElementById("testimonials-grid");if(s){Loader.show(s,"skeleton");try{let i=await ProductsApi.getReviews(null,{pageSize:6,orderBy:"-rating"}),l=i?.data?.results||i?.data||i?.results||[];if(s.innerHTML="",!l.length){s.innerHTML='<p class="text-gray-500 text-center py-8">No user reviews available.</p>';return}l=l.slice(0,6),l.forEach(c=>{let h=document.createElement("div");h.className="rounded-2xl bg-white dark:bg-stone-800 shadow p-6 flex flex-col gap-3",h.innerHTML=`
                        <div class="flex items-center gap-3 mb-2">
                            <div class="w-10 h-10 rounded-full bg-primary-100 dark:bg-stone-700 flex items-center justify-center text-lg font-bold text-primary-700 dark:text-amber-400">
                                ${c.user?.first_name?.[0]||c.user?.username?.[0]||"?"}
                            </div>
                            <div>
                                <div class="font-semibold text-gray-900 dark:text-white">${c.user?.first_name||c.user?.username||"Anonymous"}</div>
                                <div class="text-xs text-gray-500 dark:text-stone-400">${c.created_at?new Date(c.created_at).toLocaleDateString():""}</div>
                            </div>
                        </div>
                        <div class="flex gap-1 mb-1">
                            ${'<svg class="w-4 h-4 text-amber-400" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.967a1 1 0 00.95.69h4.178c.969 0 1.371 1.24.588 1.81l-3.385 2.46a1 1 0 00-.364 1.118l1.287 3.966c.3.922-.755 1.688-1.54 1.118l-3.385-2.46a1 1 0 00-1.175 0l-3.385 2.46c-.784.57-1.838-.196-1.54-1.118l1.287-3.966a1 1 0 00-.364-1.118l-3.385-2.46c-.783-.57-.38-1.81.588-1.81h4.178a1 1 0 00.95-.69l1.286-3.967z"/></svg>'.repeat(Math.round(c.rating||5))}
                        </div>
                        <div class="text-gray-800 dark:text-stone-200 text-base mb-2">${Templates.escapeHtml(c.title||"")}</div>
                        <div class="text-gray-600 dark:text-stone-400 text-sm">${Templates.escapeHtml(c.content||"")}</div>
                    `,s.appendChild(h)})}catch(i){console.error("Failed to load testimonials:",i),s.innerHTML='<p class="text-red-500 text-center py-8">Failed to load reviews. Please try again later.</p>'}}}async function y(){let s=document.getElementById("best-sellers");if(!s)return;let i=s.querySelector(".products-grid")||s;Loader.show(i,"skeleton");try{let l=await ProductsApi.getProducts({bestseller:!0,pageSize:5}),c=l.data?.results||l.data||l.results||[];if(c.length===0){i.innerHTML='<p class="text-gray-500 text-center py-8">No best sellers available.</p>';return}i.innerHTML=c.map(h=>{let u=null;return h.discount_percent&&h.discount_percent>0&&(u=`-${h.discount_percent}%`),ProductCard.render(h,{showBadge:!!u,badge:u,priceSize:"small"})}).join(""),ProductCard.bindEvents(i)}catch(l){console.error("Failed to load best sellers:",l),i.innerHTML='<p class="text-red-500 text-center py-8">Failed to load products. Please try again later.</p>'}}async function M(){let s=document.getElementById("hero-slider");if(s)try{let i=await PagesApi.getBanners("home_hero"),l=i.data?.results||i.data||i.results||[];if(l.length===0){s.innerHTML="";return}s.innerHTML=`
                <div class="relative overflow-hidden w-full h-[55vh] sm:h-[70vh] md:h-[80vh]">
                    <div class="hero-slides relative w-full h-full">
                        ${l.map((c,h)=>`
                            <div class="hero-slide ${h===0?"":"hidden"} w-full h-full" data-index="${h}">
                                <a href="${c.link_url||"#"}" class="block relative w-full h-full">
                                    <img 
                                        src="${c.image}" 
                                        alt="${Templates.escapeHtml(c.title||"")}"
                                        class="absolute inset-0 w-full h-full object-cover"
                                        loading="${h===0?"eager":"lazy"}"
                                        decoding="async"
                                    >
                                    ${c.title||c.subtitle?`
                                        <div class="absolute inset-0 bg-gradient-to-r from-black/60 via-black/30 to-transparent flex items-center">
                                            <div class="px-8 md:px-16 max-w-xl">
                                                ${c.title?`<h2 class="text-2xl sm:text-3xl md:text-5xl font-bold text-white mb-4">${Templates.escapeHtml(c.title)}</h2>`:""}
                                                ${c.subtitle?`<p class="text-sm sm:text-lg text-white/90 mb-6">${Templates.escapeHtml(c.subtitle)}</p>`:""}
                                                ${c.link_text||c.button_text?`
                                                    <span class="inline-flex items-center px-6 py-3 bg-white text-gray-900 font-semibold rounded-lg hover:bg-gray-100 transition-colors">
                                                        ${Templates.escapeHtml(c.link_text||c.button_text)}
                                                        <svg class="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3"/>
                                                        </svg>
                                                    </span>
                                                `:""}
                                            </div>
                                        </div>
                                    `:""}
                                </a>
                            </div>
                        `).join("")}
                    </div>
                    ${l.length>1?`
                        <button class="hero-prev absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/30 dark:bg-stone-800/30 hover:bg-white/40 dark:hover:bg-stone-700/40 rounded-full text-stone-900 dark:text-stone-100 flex items-center justify-center shadow-lg transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500" aria-label="Previous slide">
                            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
                            </svg>
                        </button>
                        <button class="hero-next absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/30 dark:bg-stone-800/30 hover:bg-white/40 dark:hover:bg-stone-700/40 rounded-full text-stone-900 dark:text-stone-100 flex items-center justify-center shadow-lg transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500" aria-label="Next slide">
                            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
                            </svg>
                        </button>
                        <div class="hero-dots absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                            ${l.map((c,h)=>`
                                <button class="w-3 h-3 rounded-full transition-colors ${h===0?"bg-white dark:bg-stone-200":"bg-white/50 dark:bg-stone-600/60 hover:bg-white/75 dark:hover:bg-stone-500/80"}" data-slide="${h}" aria-label="Go to slide ${h+1}"></button>
                            `).join("")}
                        </div>
                    `:""}
                </div>
            `,l.length>1&&D(l.length)}catch(i){console.warn("Hero banners unavailable:",i?.status||i)}}function D(s){let i=0,l=document.querySelectorAll(".hero-slide"),c=document.querySelectorAll(".hero-dots button"),h=document.querySelector(".hero-prev"),u=document.querySelector(".hero-next");function f(T){l[i].classList.add("hidden"),c[i]?.classList.remove("bg-stone-100"),c[i]?.classList.add("bg-white/50"),i=(T+s)%s,l[i].classList.remove("hidden"),c[i]?.classList.add("bg-stone-100"),c[i]?.classList.remove("bg-white/50")}h?.addEventListener("click",()=>{f(i-1),I()}),u?.addEventListener("click",()=>{f(i+1),I()}),c.forEach((T,z)=>{T.addEventListener("click",()=>{f(z),I()})});function I(){n&&clearInterval(n),n=setInterval(()=>f(i+1),5e3)}try{let T=document.querySelector(".hero-slides"),z=0;T?.addEventListener("touchstart",V=>{z=V.touches[0].clientX},{passive:!0}),T?.addEventListener("touchend",V=>{let B=V.changedTouches[0].clientX-z;Math.abs(B)>50&&(B<0?f(i+1):f(i-1),I())})}catch{}I()}async function A(){let s=document.getElementById("featured-products");if(!s)return;let i=s.querySelector(".products-grid")||s;Loader.show(i,"skeleton");try{let l=await ProductsApi.getFeatured(8),c=l.data?.results||l.data||l.results||[];if(c.length===0){i.innerHTML='<p class="text-gray-500 text-center py-8">No featured products available.</p>';return}i.innerHTML=c.map(h=>{let u=null;return h.discount_percent&&h.discount_percent>0&&(u=`-${h.discount_percent}%`),ProductCard.render(h,{showBadge:!!u,badge:u,priceSize:"small"})}).join(""),ProductCard.bindEvents(i)}catch(l){console.error("Failed to load featured products:",l),i.innerHTML='<p class="text-red-500 text-center py-8">Failed to load products. Please try again later.</p>'}}async function E(){let s=document.getElementById("categories-showcase");if(s){Loader.show(s,"skeleton");try{try{window.ApiClient?.clearCache("/api/v1/catalog/categories/")}catch{}let i=await window.ApiClient.get("/catalog/categories/",{page_size:6,is_featured:!0},{useCache:!1}),l=i.data?.results||i.data||i.results||[];if(l.length===0){s.innerHTML="";return}let c;try{c=(await Promise.resolve().then(()=>(_s(),As))).CategoryCard}catch(h){console.error("Failed to import CategoryCard:",h);return}s.innerHTML="",l.forEach(h=>{let u=c(h);try{let f=u.querySelector("img");console.info("[Home] card image for",h.name,f?f.src:"NO_IMAGE")}catch{}s.appendChild(u)}),s.classList.add("grid","grid-cols-2","sm:grid-cols-2","md:grid-cols-3","lg:grid-cols-6","gap-4","lg:gap-6")}catch(i){console.error("Failed to load categories:",i),s.innerHTML=""}}}async function v(){let s=document.getElementById("new-arrivals");if(!s)return;let i=s.querySelector(".products-grid")||s;Loader.show(i,"skeleton");try{let l=await ProductsApi.getNewArrivals(4),c=l.data?.results||l.data||l.results||[];if(c.length===0){i.innerHTML='<p class="text-gray-500 text-center py-8">No new products available.</p>';return}i.innerHTML=c.map(h=>{let u=null;return h.discount_percent&&h.discount_percent>0&&(u=`-${h.discount_percent}%`),ProductCard.render(h,{showBadge:!!u,badge:u,priceSize:"small"})}).join(""),ProductCard.bindEvents(i)}catch(l){console.error("Failed to load new arrivals:",l),i.innerHTML='<p class="text-red-500 text-center py-8">Failed to load products.</p>'}}async function S(){let s=document.getElementById("promotions-banner")||document.getElementById("promotion-banners");if(s)try{let i=await PagesApi.getPromotions(),l=i?.data?.results??i?.results??i?.data??[];if(Array.isArray(l)||(l&&typeof l=="object"?l=Array.isArray(l.items)?l.items:[l]:l=[]),l.length===0){s.innerHTML="";return}let c=l[0]||{};s.innerHTML=`
                <div class="bg-gradient-to-r from-primary-600 to-primary-700 rounded-2xl overflow-hidden">
                    <div class="px-6 py-8 md:px-12 md:py-12 flex flex-col md:flex-row items-center justify-between gap-6">
                        <div class="text-center md:text-left">
                            <span class="inline-block px-3 py-1 bg-white/20 text-white text-sm font-medium rounded-full mb-3">
                                Limited Time Offer
                            </span>
                            <h3 class="text-2xl md:text-3xl font-bold text-white mb-2">
                                ${Templates.escapeHtml(c.title||c.name||"")}
                            </h3>
                            ${c.description?`
                                <p class="text-white/90 max-w-lg">${Templates.escapeHtml(c.description)}</p>
                            `:""}
                            ${c.discount_value?`
                                <p class="text-3xl font-bold text-white mt-4">
                                    ${c.discount_type==="percentage"?`${c.discount_value}% OFF`:`Save ${Templates.formatPrice(c.discount_value)}`}
                                </p>
                            `:""}
                        </div>
                        <div class="flex flex-col items-center gap-4">
                            ${c.code?`
                                <div class="bg-white/10 backdrop-blur-sm px-6 py-3 rounded-lg border-2 border-dashed border-white/30">
                                    <p class="text-sm text-white/80 mb-1">Use code:</p>
                                    <p class="text-2xl font-mono font-bold text-white tracking-wider">${Templates.escapeHtml(c.code)}</p>
                                </div>
                            `:""}
                            <a href="/products/?promotion=${c.id||""}" class="inline-flex items-center px-6 py-3 bg-stone-100 text-primary-600 font-semibold rounded-lg hover:bg-gray-100 transition-colors">
                                Shop Now
                                <svg class="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3"/>
                                </svg>
                            </a>
                        </div>
                    </div>
                </div>
            `}catch(i){console.warn("Promotions unavailable:",i?.status||i),s.innerHTML=""}}async function L(){let s=document.getElementById("custom-order-cta");if(!s||s.dataset?.loaded)return;s.dataset.loaded="1",s.innerHTML=`
            <div class="container mx-auto px-4">
                <div class="max-w-full w-full mx-auto rounded-3xl p-6 md:p-10">
                    <div class="animate-pulse">
                        <div class="h-6 w-1/3 bg-gray-200 dark:bg-stone-700 rounded mb-4"></div>
                        <div class="h-10 w-full bg-gray-200 dark:bg-stone-700 rounded mb-4"></div>
                        <div class="h-44 bg-gray-200 dark:bg-stone-800 rounded"></div>
                    </div>
                </div>
            </div>
        `;let i=window.BUNORAA_ROUTES||{},l=i.preordersWizard||"/preorders/create/",c=i.preordersLanding||"/preorders/";try{let h=[];if(typeof PreordersApi<"u"&&PreordersApi.getCategories)try{let u=await PreordersApi.getCategories({featured:!0,pageSize:4});h=u?.data?.results||u?.data||u?.results||[]}catch(u){console.warn("Pre-order categories unavailable:",u)}s.innerHTML=`
                <div class="container mx-auto px-4 relative">
                    <div class="max-w-full w-full mx-auto rounded-3xl shadow-lg overflow-hidden bg-white dark:bg-neutral-900 p-6 md:p-10 border border-stone-100 dark:border-stone-700">
                      <div class="grid lg:grid-cols-2 gap-12 items-center">
                        <div class="text-stone-900 dark:text-white">
                            <span class="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-100/40 dark:bg-amber-700/20 text-xs uppercase tracking-[0.2em] mb-6 text-amber-800 dark:text-white">
                                <span class="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></span>
                                Made Just For You
                            </span>
                            <h2 class="text-3xl lg:text-5xl font-display font-bold mb-6 leading-tight text-stone-900 dark:text-white">Create Your Perfect Custom Order</h2>
                            <p class="text-stone-700 dark:text-white/80 text-lg mb-8 max-w-xl">Have a unique vision? Our skilled artisans will bring your ideas to life. From personalized gifts to custom designs, we craft exactly what you need.</p>
                            <div class="grid sm:grid-cols-3 gap-4 mb-8">
                                <div class="flex items-center gap-3 bg-white/5 dark:bg-stone-800/40 backdrop-blur-sm rounded-xl p-4 border border-stone-100 dark:border-stone-700">
                                    <div class="w-10 h-10 bg-purple-500/30 rounded-lg flex items-center justify-center">
                                        <svg class="w-5 h-5 text-purple-800" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/></svg>
                                    </div>
                                    <div>
                                        <p class="text-sm font-semibold text-stone-900 dark:text-white">Custom Design</p>
                                        <p class="text-xs text-stone-600 dark:text-white/60">Your vision, our craft</p>
                                    </div>
                                </div>
                                <div class="flex items-center gap-3 bg-white/5 dark:bg-stone-800/40 backdrop-blur-sm rounded-xl p-4 border border-stone-100 dark:border-stone-700">
                                    <div class="w-10 h-10 bg-indigo-500/30 rounded-lg flex items-center justify-center">
                                        <svg class="w-5 h-5 text-indigo-700 dark:text-indigo-200" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/></svg>
                                    </div>
                                    <div>
                                        <p class="text-sm font-semibold text-stone-900 dark:text-white">Direct Chat</p>
                                        <p class="text-xs text-stone-600 dark:text-white/60">Talk to artisans</p>
                                    </div>
                                </div>
                                <div class="flex items-center gap-3 bg-white/5 dark:bg-stone-800/40 backdrop-blur-sm rounded-xl p-4 border border-stone-100 dark:border-stone-700">
                                    <div class="w-10 h-10 bg-pink-500/30 rounded-lg flex items-center justify-center">
                                        <svg class="w-5 h-5 text-pink-700 dark:text-pink-200" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                                    </div>
                                    <div>
                                        <p class="text-sm font-semibold text-stone-900 dark:text-white">Quality Assured</p>
                                        <p class="text-xs text-stone-600 dark:text-white/60">Satisfaction guaranteed</p>
                                    </div>
                                </div>
                            </div>
                            ${h.length>0?`
                                <div class="mb-8">
                                    <p class="text-stone-600 dark:text-white/60 text-sm mb-3">Popular categories:</p>
                                    <div class="flex flex-wrap gap-2">
                                        ${h.slice(0,4).map(u=>`
                                            <a href="${c}category/${u.slug}/" class="inline-flex items-center gap-2 px-4 py-2 bg-white/10 dark:bg-stone-800/30 hover:bg-white/20 dark:hover:bg-stone-700 rounded-full text-sm text-stone-900 dark:text-white transition-colors">
                                                ${u.icon?`<span>${u.icon}</span>`:""}
                                                ${Templates.escapeHtml(u.name)}
                                            </a>
                                        `).join("")}
                                    </div>
                                </div>
                            `:""}
                            <div class="flex flex-wrap gap-4">
                                <a href="${l}" class="cta-unlock inline-flex items-center gap-2 px-8 py-4 bg-amber-600 text-white font-bold rounded-xl shadow-lg hover:shadow-xl hover:text-black dark:hover:text-black transition-colors group dark:bg-amber-600 dark:text-white">
                                    Start Your Custom Order
                                    <svg class="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3"/></svg>
                                </a>
                                <a href="${c}" class="inline-flex items-center gap-2 px-8 py-4 bg-transparent text-stone-900 dark:text-white font-semibold rounded-xl border-2 border-stone-200 dark:border-stone-700 hover:bg-stone-100 dark:hover:bg-stone-800 transition-all">
                                    Learn More
                                </a>
                            </div>
                        </div>
                        <div class="hidden lg:block">
                            <div class="relative">
                                <div class="absolute -inset-4 bg-gradient-to-r from-purple-500/30 to-indigo-500/30 rounded-3xl blur-2xl"></div>
                                <div class="relative bg-white/5 dark:bg-stone-800/40 backdrop-blur-md rounded-3xl p-8 border border-stone-100 dark:border-stone-700">
                                    <div class="space-y-6">
                                        <div class="flex items-start gap-4">
                                            <div class="w-12 h-12 bg-purple-600 rounded-xl flex items-center justify-center flex-shrink-0 text-white text-xl font-bold shadow-sm ring-1 ring-stone-100 dark:ring-stone-700">1</div>
                                            <div>
                                                <h4 class="text-stone-900 dark:text-white font-semibold mb-1">Choose Category</h4>
                                                <p class="text-stone-600 dark:text-white/60 text-sm">Select from custom apparel, gifts, home decor & more</p>
                                            </div>
                                        </div>
                                        <div class="flex items-start gap-4">
                                            <div class="w-12 h-12 bg-indigo-600 rounded-xl flex items-center justify-center flex-shrink-0 text-white text-xl font-bold shadow-sm ring-1 ring-stone-100 dark:ring-stone-700">2</div>
                                            <div>
                                                <h4 class="text-stone-900 dark:text-white font-semibold mb-1">Share Your Vision</h4>
                                                <p class="text-stone-600 dark:text-white/60 text-sm">Upload designs, describe your requirements</p>
                                            </div>
                                        </div>
                                        <div class="flex items-start gap-4">
                                            <div class="w-12 h-12 bg-amber-600 rounded-xl flex items-center justify-center flex-shrink-0 text-white text-xl font-bold shadow-sm ring-1 ring-stone-100 dark:ring-stone-700">3</div>
                                            <div>
                                                <h4 class="text-stone-900 dark:text-white font-semibold mb-1">Get Your Quote</h4>
                                                <p class="text-stone-600 dark:text-white/60 text-sm">Receive pricing and timeline from our team</p>
                                            </div>
                                        </div>
                                        <div class="flex items-start gap-4">
                                            <div class="w-12 h-12 bg-emerald-600 rounded-xl flex items-center justify-center flex-shrink-0 text-white text-xl font-bold shadow-sm ring-1 ring-stone-100 dark:ring-stone-700">4</div>
                                            <div>
                                                <h4 class="text-stone-900 dark:text-white font-semibold mb-1">We Create & Deliver</h4>
                                                <p class="text-stone-600 dark:text-white/60 text-sm">Track progress and receive your masterpiece</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            `}catch(h){console.warn("Custom order CTA failed to load:",h),s.innerHTML=`
                <div class="container mx-auto px-4 text-center text-stone-900 dark:text-white">
                    <h2 class="text-3xl lg:text-4xl font-display font-bold mb-4 text-stone-900 dark:text-white">Create Your Perfect Custom Order</h2>
                    <p class="text-stone-700 dark:text-white/80 mb-8 max-w-2xl mx-auto">Have a unique vision? Our skilled artisans will bring your ideas to life.</p>
                    <a href="${l}" class="cta-unlock inline-flex items-center gap-2 px-8 py-4 bg-amber-600 text-white font-bold rounded-xl shadow-lg hover:shadow-xl hover:text-black dark:hover:text-black transition-colors group dark:bg-amber-600 dark:text-white">
                        Start Your Custom Order
                    </a>
                </div>
            `}}function g(){let s=document.getElementById("newsletter-form")||document.getElementById("newsletter-form-home");s&&s.addEventListener("submit",async i=>{i.preventDefault();let l=s.querySelector('input[type="email"]'),c=s.querySelector('button[type="submit"]'),h=l?.value?.trim();if(!h){Toast.error("Please enter your email address.");return}let u=c.textContent;c.disabled=!0,c.innerHTML='<svg class="animate-spin h-5 w-5 mx-auto" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>';try{await SupportApi.submitContactForm({email:h,type:"newsletter"}),Toast.success("Thank you for subscribing!"),l.value=""}catch(f){Toast.error(f.message||"Failed to subscribe. Please try again.")}finally{c.disabled=!1,c.textContent=u}})}function r(){n&&(clearInterval(n),n=null),t&&(clearInterval(t),t=null),o&&(clearInterval(o),o=null),document.getElementById("quick-view-modal")?.remove(),document.querySelectorAll(".social-proof-popup").forEach(s=>s.remove())}return{init:p,destroy:r,initRecentlyViewed:_,initFlashSaleCountdown:q}})();window.HomePage=Ms;mr=Ms});var js={};J(js,{default:()=>pr});var Ps,pr,Ns=Q(()=>{Ps=(function(){"use strict";let n=1,e="all";async function t(){if(!AuthGuard.protectPage())return;let y=o();y?await _(y):(await p(),Y())}function o(){let M=window.location.pathname.match(/\/orders\/([^\/]+)/);return M?M[1]:null}async function p(){let y=document.getElementById("orders-list");if(y){Loader.show(y,"skeleton");try{let M={page:n,limit:10};e!=="all"&&(M.status=e);let D=await OrdersApi.getAll(M),A=D.data||[],E=D.meta||{};b(A,E)}catch(M){console.error("Failed to load orders:",M),y.innerHTML='<p class="text-red-500 text-center py-8">Failed to load orders.</p>'}}}function b(y,M){let D=document.getElementById("orders-list");if(!D)return;if(y.length===0){D.innerHTML=`
                <div class="text-center py-16">
                    <svg class="w-24 h-24 text-gray-300 mx-auto mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
                    </svg>
                    <h2 class="text-2xl font-bold text-gray-900 mb-2">No orders yet</h2>
                    <p class="text-gray-600 mb-8">When you place an order, it will appear here.</p>
                    <a href="/products/" class="inline-flex items-center px-6 py-3 bg-primary-600 text-white font-semibold rounded-lg hover:bg-primary-700 transition-colors">
                        Start Shopping
                    </a>
                </div>
            `;return}D.innerHTML=`
            <div class="space-y-4">
                ${y.map(E=>k(E)).join("")}
            </div>
            ${M.total_pages>1?`
                <div id="orders-pagination" class="mt-8">${Pagination.render({currentPage:M.current_page||n,totalPages:M.total_pages,totalItems:M.total})}</div>
            `:""}
        `,document.getElementById("orders-pagination")?.addEventListener("click",E=>{let v=E.target.closest("[data-page]");v&&(n=parseInt(v.dataset.page),p(),window.scrollTo({top:0,behavior:"smooth"}))})}function k(y){let D={pending:"bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",processing:"bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",shipped:"bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400",delivered:"bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",cancelled:"bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",refunded:"bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400"}[y.status]||"bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400",A=y.items||[],E=A.slice(0,3),v=A.length-3,S=["pending","processing","shipped","delivered"],L=S.indexOf(y.status),g=y.status==="cancelled"||y.status==="refunded";return`
            <div class="bg-white dark:bg-stone-800 rounded-xl shadow-sm border border-gray-100 dark:border-stone-700 overflow-hidden">
                <div class="px-6 py-4 border-b border-gray-100 dark:border-stone-700 flex flex-wrap items-center justify-between gap-4">
                    <div>
                        <p class="text-sm text-gray-500 dark:text-stone-400">Order #${Templates.escapeHtml(y.order_number||y.id)}</p>
                        <p class="text-sm text-gray-500 dark:text-stone-400">Placed on ${Templates.formatDate(y.created_at)}</p>
                    </div>
                    <div class="flex items-center gap-4">
                        <span class="px-3 py-1 rounded-full text-sm font-medium ${D}">
                            ${Templates.escapeHtml(y.status_display||y.status)}
                        </span>
                        <a href="/orders/${y.id}/" class="text-primary-600 dark:text-amber-400 hover:text-primary-700 dark:hover:text-amber-300 font-medium text-sm">
                            View Details
                        </a>
                    </div>
                </div>
                
                <!-- Visual Progress Bar -->
                ${g?"":`
                    <div class="px-6 py-3 bg-stone-50 dark:bg-stone-900/50 border-b border-gray-100 dark:border-stone-700">
                        <div class="flex items-center justify-between relative">
                            <div class="absolute left-0 right-0 top-1/2 h-1 bg-stone-200 dark:bg-stone-700 -translate-y-1/2 rounded-full"></div>
                            <div class="absolute left-0 top-1/2 h-1 bg-primary-500 dark:bg-amber-500 -translate-y-1/2 rounded-full transition-all duration-500" style="width: ${Math.max(0,L/(S.length-1)*100)}%"></div>
                            ${S.map((r,s)=>`
                                <div class="relative z-10 flex flex-col items-center">
                                    <div class="w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium ${s<=L?"bg-primary-500 dark:bg-amber-500 text-white":"bg-stone-200 dark:bg-stone-700 text-stone-500 dark:text-stone-400"}">
                                        ${s<L?'<svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/></svg>':s+1}
                                    </div>
                                    <span class="text-xs text-stone-500 dark:text-stone-400 mt-1 capitalize hidden sm:block">${r}</span>
                                </div>
                            `).join("")}
                        </div>
                    </div>
                `}
                
                <div class="p-6">
                    <div class="flex flex-wrap gap-4">
                        ${E.map(r=>`
                            <div class="flex items-center gap-3">
                                <div class="w-16 h-16 bg-gray-100 dark:bg-stone-700 rounded-lg overflow-hidden flex-shrink-0">
                                    ${r.product?.image?`<img src="${r.product.image}" alt="" class="w-full h-full object-cover" onerror="this.parentElement.innerHTML='<div class=\\'w-full h-full flex items-center justify-center text-gray-400 dark:text-stone-500\\'><svg class=\\'w-6 h-6\\' fill=\\'none\\' stroke=\\'currentColor\\' viewBox=\\'0 0 24 24\\'><path stroke-linecap=\\'round\\' stroke-linejoin=\\'round\\' stroke-width=\\'1.5\\' d=\\'M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z\\'/></svg></div>'">`:'<div class="w-full h-full flex items-center justify-center text-gray-400 dark:text-stone-500"><svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg></div>'}
                                </div>
                                <div>
                                    <p class="text-sm font-medium text-gray-900 dark:text-white">${Templates.escapeHtml(r.product?.name||r.product_name)}</p>
                                    <p class="text-sm text-gray-500 dark:text-stone-400">Qty: ${r.quantity}</p>
                                </div>
                            </div>
                        `).join("")}
                        ${v>0?`
                            <div class="flex items-center justify-center w-16 h-16 bg-gray-100 dark:bg-stone-700 rounded-lg">
                                <span class="text-sm text-gray-500 dark:text-stone-400">+${v}</span>
                            </div>
                        `:""}
                    </div>
                    <div class="mt-4 pt-4 border-t border-gray-100 flex justify-between items-center">
                        <p class="text-sm text-gray-600">
                            ${A.length} ${A.length===1?"item":"items"}
                        </p>
                        <p class="font-semibold text-gray-900">Total: ${Templates.formatPrice(y.total)}</p>
                    </div>
                </div>
            </div>
        `}async function _(y){let M=document.getElementById("order-detail");if(M){Loader.show(M,"skeleton");try{let A=(await OrdersApi.getById(y)).data;if(!A){window.location.href="/orders/";return}q(A)}catch(D){console.error("Failed to load order:",D),M.innerHTML='<p class="text-red-500 text-center py-8">Failed to load order details.</p>'}}}function q(y){let M=document.getElementById("order-detail");if(!M)return;let A={pending:"bg-yellow-100 text-yellow-700",processing:"bg-blue-100 text-blue-700",shipped:"bg-indigo-100 text-indigo-700",delivered:"bg-green-100 text-green-700",cancelled:"bg-red-100 text-red-700",refunded:"bg-gray-100 text-gray-700"}[y.status]||"bg-gray-100 text-gray-700",E=y.items||[];M.innerHTML=`
            <div class="mb-6">
                <a href="/orders/" class="inline-flex items-center text-primary-600 hover:text-primary-700">
                    <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16l-4-4m0 0l4-4m-4 4h18"/>
                    </svg>
                    Back to Orders
                </a>
            </div>

            <div class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div class="px-6 py-4 border-b border-gray-100">
                    <div class="flex flex-wrap items-center justify-between gap-4">
                        <div>
                            <h1 class="text-xl font-bold text-gray-900">Order #${Templates.escapeHtml(y.order_number||y.id)}</h1>
                            <p class="text-sm text-gray-500">Placed on ${Templates.formatDate(y.created_at)}</p>
                        </div>
                        <span class="px-4 py-1.5 rounded-full text-sm font-medium ${A}">
                            ${Templates.escapeHtml(y.status_display||y.status)}
                        </span>
                    </div>
                </div>

                <!-- Order Timeline -->
                ${y.timeline&&y.timeline.length>0?`
                    <div class="px-6 py-4 border-b border-gray-100">
                        <h2 class="text-sm font-semibold text-gray-900 mb-4">Order Timeline</h2>
                        <div class="relative">
                            <div class="absolute left-2 top-2 bottom-2 w-0.5 bg-gray-200"></div>
                            <div class="space-y-4">
                                ${y.timeline.map((v,S)=>`
                                    <div class="relative pl-8">
                                        <div class="absolute left-0 w-4 h-4 rounded-full ${S===0?"bg-primary-600":"bg-gray-300"}"></div>
                                        <p class="text-sm font-medium text-gray-900">${Templates.escapeHtml(v.status)}</p>
                                        <p class="text-xs text-gray-500">${Templates.formatDate(v.timestamp,{includeTime:!0})}</p>
                                        ${v.note?`<p class="text-sm text-gray-600 mt-1">${Templates.escapeHtml(v.note)}</p>`:""}
                                    </div>
                                `).join("")}
                            </div>
                        </div>
                    </div>
                `:""}

                <!-- Tracking Info -->
                ${y.tracking_number?`
                    <div class="px-6 py-4 border-b border-gray-100 bg-blue-50">
                        <div class="flex items-center justify-between">
                            <div>
                                <p class="text-sm font-medium text-blue-900">Tracking Number</p>
                                <p class="text-lg font-mono text-blue-700">${Templates.escapeHtml(y.tracking_number)}</p>
                            </div>
                            ${y.tracking_url?`
                                <a href="${y.tracking_url}" target="_blank" class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium">
                                    Track Package
                                </a>
                            `:""}
                        </div>
                    </div>
                `:""}

                <!-- Order Items -->
                <div class="px-6 py-4 border-b border-gray-100">
                    <h2 class="text-sm font-semibold text-gray-900 mb-4">Items Ordered</h2>
                    <div class="space-y-4">
                        ${E.map(v=>`
                            <div class="flex gap-4">
                                <div class="w-20 h-20 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                                    ${v.product?.image?`<img src="${v.product.image}" alt="" class="w-full h-full object-cover" onerror="this.style.display='none'">`:""}
                                </div>
                                <div class="flex-1">
                                    <div class="flex justify-between">
                                        <div>
                                            <h3 class="font-medium text-gray-900">${Templates.escapeHtml(v.product?.name||v.product_name)}</h3>
                                            ${v.variant?`<p class="text-sm text-gray-500">${Templates.escapeHtml(v.variant.name||v.variant_name)}</p>`:""}
                                            <p class="text-sm text-gray-500">Qty: ${v.quantity}</p>
                                        </div>
                                        <p class="font-medium text-gray-900">${Templates.formatPrice(v.price*v.quantity)}</p>
                                    </div>
                                    ${v.product?.slug?`
                                        <a href="/products/${v.product.slug}/" class="text-sm text-primary-600 hover:text-primary-700 mt-2 inline-block">
                                            View Product
                                        </a>
                                    `:""}
                                </div>
                            </div>
                        `).join("")}
                    </div>
                </div>

                <!-- Addresses -->
                <div class="px-6 py-4 border-b border-gray-100 grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <h2 class="text-sm font-semibold text-gray-900 mb-2">Shipping Address</h2>
                        ${y.shipping_address?`
                            <p class="text-sm text-gray-600">${Templates.escapeHtml(y.shipping_address.full_name||`${y.shipping_address.first_name} ${y.shipping_address.last_name}`)}</p>
                            <p class="text-sm text-gray-600">${Templates.escapeHtml(y.shipping_address.address_line_1)}</p>
                            ${y.shipping_address.address_line_2?`<p class="text-sm text-gray-600">${Templates.escapeHtml(y.shipping_address.address_line_2)}</p>`:""}
                            <p class="text-sm text-gray-600">${Templates.escapeHtml(y.shipping_address.city)}, ${Templates.escapeHtml(y.shipping_address.state||"")} ${Templates.escapeHtml(y.shipping_address.postal_code)}</p>
                            <p class="text-sm text-gray-600">${Templates.escapeHtml(y.shipping_address.country)}</p>
                        `:'<p class="text-sm text-gray-500">Not available</p>'}
                    </div>
                    <div>
                        <h2 class="text-sm font-semibold text-gray-900 mb-2">Billing Address</h2>
                        ${y.billing_address?`
                            <p class="text-sm text-gray-600">${Templates.escapeHtml(y.billing_address.full_name||`${y.billing_address.first_name} ${y.billing_address.last_name}`)}</p>
                            <p class="text-sm text-gray-600">${Templates.escapeHtml(y.billing_address.address_line_1)}</p>
                            ${y.billing_address.address_line_2?`<p class="text-sm text-gray-600">${Templates.escapeHtml(y.billing_address.address_line_2)}</p>`:""}
                            <p class="text-sm text-gray-600">${Templates.escapeHtml(y.billing_address.city)}, ${Templates.escapeHtml(y.billing_address.state||"")} ${Templates.escapeHtml(y.billing_address.postal_code)}</p>
                            <p class="text-sm text-gray-600">${Templates.escapeHtml(y.billing_address.country)}</p>
                        `:'<p class="text-sm text-gray-500">Same as shipping</p>'}
                    </div>
                </div>

                <!-- Order Summary -->
                <div class="px-6 py-4">
                    <h2 class="text-sm font-semibold text-gray-900 mb-4">Order Summary</h2>
                    <div class="space-y-2 text-sm">
                        <div class="flex justify-between">
                            <span class="text-gray-600">Subtotal</span>
                            <span class="font-medium">${Templates.formatPrice(y.subtotal||0)}</span>
                        </div>
                        ${y.discount_amount?`
                            <div class="flex justify-between text-green-600">
                                <span>Discount</span>
                                <span>-${Templates.formatPrice(y.discount_amount)}</span>
                            </div>
                        `:""}
                        <div class="flex justify-between">
                            <span class="text-gray-600">Shipping</span>
                            <span class="font-medium">${y.shipping_cost>0?Templates.formatPrice(y.shipping_cost):"Free"}</span>
                        </div>
                        ${y.tax_amount?`
                            <div class="flex justify-between">
                                <span class="text-gray-600">Tax</span>
                                <span class="font-medium">${Templates.formatPrice(y.tax_amount)}</span>
                            </div>
                        `:""}
                        <div class="flex justify-between pt-2 border-t border-gray-200">
                            <span class="font-semibold text-gray-900">Total</span>
                            <span class="font-bold text-gray-900">${Templates.formatPrice(y.total)}</span>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Actions -->
            <div class="mt-6 flex flex-wrap gap-4">
                ${y.status==="delivered"?`
                    <button id="reorder-btn" class="px-6 py-3 bg-primary-600 text-white font-semibold rounded-lg hover:bg-primary-700 transition-colors" data-order-id="${y.id}">
                        Order Again
                    </button>
                `:""}
                ${["pending","processing"].includes(y.status)?`
                    <button id="cancel-order-btn" class="px-6 py-3 border border-red-300 text-red-600 font-semibold rounded-lg hover:bg-red-50 transition-colors" data-order-id="${y.id}">
                        Cancel Order
                    </button>
                `:""}
                <button id="print-invoice-btn" class="px-6 py-3 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors">
                    Print Invoice
                </button>
            </div>
        `,R(y)}function R(y){let M=document.getElementById("reorder-btn"),D=document.getElementById("cancel-order-btn"),A=document.getElementById("print-invoice-btn");M?.addEventListener("click",async()=>{try{await OrdersApi.reorder(y.id),Toast.success("Items added to cart!"),document.dispatchEvent(new CustomEvent("cart:updated")),window.location.href="/cart/"}catch(E){Toast.error(E.message||"Failed to reorder.")}}),D?.addEventListener("click",async()=>{if(await Modal.confirm({title:"Cancel Order",message:"Are you sure you want to cancel this order? This action cannot be undone.",confirmText:"Cancel Order",cancelText:"Keep Order"}))try{await OrdersApi.cancel(y.id),Toast.success("Order cancelled."),window.location.reload()}catch(v){Toast.error(v.message||"Failed to cancel order.")}}),A?.addEventListener("click",()=>{window.print()})}function Y(){let y=document.querySelectorAll("[data-filter-status]");y.forEach(M=>{M.addEventListener("click",()=>{y.forEach(D=>{D.classList.remove("bg-primary-100","text-primary-700"),D.classList.add("text-gray-600")}),M.classList.add("bg-primary-100","text-primary-700"),M.classList.remove("text-gray-600"),e=M.dataset.filterStatus,n=1,p()})})}function j(){n=1,e="all"}return{init:t,destroy:j}})();window.OrdersPage=Ps;pr=Ps});var Fs=Je(()=>{var gr=(function(){"use strict";let n=window.BUNORAA_ROUTES||{},e=n.preordersWizard||"/preorders/create/",t=n.preordersLanding||"/preorders/";async function o(){await Promise.all([p(),k(),_()])}async function p(){let A=document.getElementById("preorder-categories");if(A)try{let E=await PreordersApi.getCategories({featured:!0,pageSize:8}),v=E?.data?.results||E?.data||E?.results||[];if(v.length===0){A.innerHTML=`
                    <div class="col-span-full text-center py-12">
                        <svg class="w-16 h-16 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" 
                                  d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/>
                        </svg>
                        <p class="text-gray-600 dark:text-gray-400 mb-4">No categories available at the moment</p>
                        <p class="text-sm text-gray-500 dark:text-gray-500">Check back soon or contact us for custom requests</p>
                    </div>
                `;return}A.innerHTML=v.map(S=>b(S)).join("")}catch(E){console.error("Failed to load pre-order categories:",E),A.innerHTML=`
                <div class="col-span-full text-center py-12">
                    <svg class="w-16 h-16 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" 
                              d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/>
                    </svg>
                    <p class="text-gray-600 dark:text-gray-400">No categories available at the moment</p>
                </div>
            `}}function b(A){let E=A.image?.url||A.image||A.thumbnail||"",v=E&&E.length>0,S=Templates?.escapeHtml||(g=>g),L=Templates?.formatPrice||(g=>`${window.BUNORAA_CURRENCY?.symbol||"\u09F3"}${g}`);return`
            <a href="${t}category/${A.slug}/" 
               class="group bg-white dark:bg-gray-800 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-200 dark:border-gray-700">
                ${v?`
                    <div class="aspect-video relative overflow-hidden">
                        <img src="${E}" alt="${S(A.name)}" 
                             class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                             loading="lazy">
                        <div class="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                    </div>
                `:`
                    <div class="aspect-video bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center">
                        ${A.icon?`<span class="text-5xl">${A.icon}</span>`:`
                            <svg class="w-16 h-16 text-white/80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" 
                                      d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/>
                            </svg>
                        `}
                    </div>
                `}
                
                <div class="p-6">
                    <div class="flex items-start justify-between mb-3">
                        <h3 class="text-xl font-bold text-gray-900 dark:text-white group-hover:text-purple-600 transition-colors">
                            ${S(A.name)}
                        </h3>
                        ${A.icon?`<span class="text-2xl">${A.icon}</span>`:""}
                    </div>
                    
                    ${A.description?`
                        <p class="text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
                            ${S(A.description)}
                        </p>
                    `:""}
                    
                    <div class="flex items-center justify-between text-sm">
                        ${A.base_price?`
                            <span class="text-gray-500 dark:text-gray-500">
                                Starting from <span class="font-semibold text-purple-600">${L(A.base_price)}</span>
                            </span>
                        `:"<span></span>"}
                        ${A.min_production_days&&A.max_production_days?`
                            <span class="text-gray-500 dark:text-gray-500">
                                ${A.min_production_days}-${A.max_production_days} days
                            </span>
                        `:""}
                    </div>
                    
                    <div class="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700 flex items-center justify-between">
                        <div class="flex gap-2 flex-wrap">
                            ${A.requires_design?`
                                <span class="text-xs px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full">
                                    Design Required
                                </span>
                            `:""}
                            ${A.allow_rush_order?`
                                <span class="text-xs px-2 py-1 bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 rounded-full">
                                    Rush Available
                                </span>
                            `:""}
                        </div>
                        <svg class="w-5 h-5 text-gray-400 group-hover:text-purple-600 group-hover:translate-x-1 transition-all flex-shrink-0" 
                             fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
                        </svg>
                    </div>
                </div>
            </a>
        `}async function k(){let A=document.getElementById("preorder-templates");A&&A.closest("section")?.classList.add("hidden")}async function _(){let A=document.getElementById("preorder-stats");if(!A)return;let E={totalOrders:"500+",happyCustomers:"450+",avgRating:"4.9"};A.innerHTML=`
            <div class="flex items-center gap-8 justify-center flex-wrap">
                <div class="text-center">
                    <p class="text-3xl font-bold text-purple-600 dark:text-purple-400">${E.totalOrders}</p>
                    <p class="text-sm text-gray-600 dark:text-gray-400">Orders Completed</p>
                </div>
                <div class="h-12 w-px bg-gray-200 dark:bg-gray-700 hidden sm:block"></div>
                <div class="text-center">
                    <p class="text-3xl font-bold text-purple-600 dark:text-purple-400">${E.happyCustomers}</p>
                    <p class="text-sm text-gray-600 dark:text-gray-400">Happy Customers</p>
                </div>
                <div class="h-12 w-px bg-gray-200 dark:bg-gray-700 hidden sm:block"></div>
                <div class="text-center">
                    <p class="text-3xl font-bold text-purple-600 dark:text-purple-400">${E.avgRating}</p>
                    <p class="text-sm text-gray-600 dark:text-gray-400">Average Rating</p>
                </div>
            </div>
        `}async function q(A){let E=document.getElementById("category-options");if(!(!E||!A))try{let v=await PreordersApi.getCategory(A),S=await PreordersApi.getCategoryOptions(v.id);R(E,S)}catch(v){console.error("Failed to load category options:",v)}}function R(A,E){if(!E||E.length===0){A.innerHTML='<p class="text-gray-500">No customization options available.</p>';return}A.innerHTML=E.map(v=>`
            <div class="border border-gray-200 dark:border-gray-700 rounded-xl p-4">
                <h4 class="font-semibold text-gray-900 dark:text-white mb-2">${Templates.escapeHtml(v.name)}</h4>
                ${v.description?`<p class="text-sm text-gray-600 dark:text-gray-400 mb-3">${Templates.escapeHtml(v.description)}</p>`:""}
                <div class="space-y-2">
                    ${v.choices?.map(S=>`
                        <label class="flex items-center gap-3 p-3 border border-gray-200 dark:border-gray-600 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                            <input type="${v.allow_multiple?"checkbox":"radio"}" name="option_${v.id}" value="${S.id}" class="text-purple-600 focus:ring-purple-500">
                            <span class="flex-1">
                                <span class="font-medium text-gray-900 dark:text-white">${Templates.escapeHtml(S.name)}</span>
                                ${S.price_modifier&&S.price_modifier!=="0.00"?`
                                    <span class="text-sm text-purple-600 dark:text-purple-400 ml-2">+${Templates.formatPrice(S.price_modifier)}</span>
                                `:""}
                            </span>
                        </label>
                    `).join("")||""}
                </div>
            </div>
        `).join("")}async function Y(){let A=document.getElementById("my-preorders-list");if(A){Loader.show(A,"skeleton");try{let E=await PreordersApi.getMyPreorders(),v=E?.data?.results||E?.data||E?.results||[];if(v.length===0){A.innerHTML=`
                    <div class="text-center py-12">
                        <svg class="w-20 h-20 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                        </svg>
                        <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-2">No custom orders yet</h3>
                        <p class="text-gray-600 dark:text-gray-400 mb-6">Start creating your first custom order today!</p>
                        <a href="${e}" class="inline-flex items-center gap-2 px-6 py-3 bg-purple-600 text-white font-semibold rounded-xl hover:bg-purple-700 transition-colors">
                            Create Custom Order
                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/></svg>
                        </a>
                    </div>
                `;return}A.innerHTML=v.map(S=>j(S)).join("")}catch(E){console.error("Failed to load pre-orders:",E),A.innerHTML=`
                <div class="text-center py-12">
                    <p class="text-red-500">Failed to load your orders. Please try again.</p>
                </div>
            `}}}function j(A){let E={pending:"bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",quoted:"bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",accepted:"bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-400",in_progress:"bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400",review:"bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400",approved:"bg-teal-100 text-teal-800 dark:bg-teal-900/30 dark:text-teal-400",completed:"bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",cancelled:"bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",refunded:"bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400"},v={pending:"Pending Review",quoted:"Quote Sent",accepted:"Quote Accepted",in_progress:"In Progress",review:"Under Review",approved:"Approved",completed:"Completed",cancelled:"Cancelled",refunded:"Refunded"},S=E[A.status]||"bg-gray-100 text-gray-800",L=v[A.status]||A.status;return`
            <a href="${t}order/${A.preorder_number}/" class="block bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 hover:shadow-lg transition-shadow">
                <div class="flex items-start justify-between gap-4 mb-4">
                    <div>
                        <p class="text-sm text-gray-500 dark:text-gray-400">${A.preorder_number}</p>
                        <h3 class="text-lg font-semibold text-gray-900 dark:text-white">${Templates.escapeHtml(A.title||A.category?.name||"Custom Order")}</h3>
                    </div>
                    <span class="px-3 py-1 text-xs font-medium rounded-full ${S}">${L}</span>
                </div>
                ${A.description?`
                    <p class="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-2">${Templates.escapeHtml(A.description)}</p>
                `:""}
                <div class="flex items-center justify-between text-sm">
                    <span class="text-gray-500 dark:text-gray-400">
                        ${new Date(A.created_at).toLocaleDateString()}
                    </span>
                    ${A.final_price||A.estimated_price?`
                        <span class="font-semibold text-purple-600 dark:text-purple-400">
                            ${Templates.formatPrice(A.final_price||A.estimated_price)}
                        </span>
                    `:""}
                </div>
            </a>
        `}async function y(A){A&&await Promise.all([M(A),D(A)])}async function M(A){if(document.getElementById("preorder-status"))try{let v=await PreordersApi.getPreorderStatus(A)}catch{}}function D(A){let E=document.getElementById("message-form");E&&E.addEventListener("submit",async v=>{v.preventDefault();let S=E.querySelector('textarea[name="message"]'),L=E.querySelector('button[type="submit"]'),g=S?.value?.trim();if(!g){Toast.error("Please enter a message");return}let r=L.innerHTML;L.disabled=!0,L.innerHTML='<svg class="animate-spin h-5 w-5 mx-auto" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>';try{await PreordersApi.sendMessage(A,g),Toast.success("Message sent successfully"),S.value="",location.reload()}catch(s){Toast.error(s.message||"Failed to send message")}finally{L.disabled=!1,L.innerHTML=r}})}return{initLanding:o,initCategoryDetail:q,initMyPreorders:Y,initDetail:y,loadFeaturedCategories:p,renderCategoryCard:b,renderPreorderCard:j}})();window.PreordersPage=gr});var Os={};J(Os,{default:()=>hr});var zs,hr,Rs=Q(()=>{zs=(function(){"use strict";let n=null,e=null,t=null,o=!1,p=!1,b=!1,k=null;async function _(){if(o)return;o=!0;let a=document.getElementById("product-detail");if(!a)return;let d=a.querySelector("h1")||a.dataset.productId;if(p=!!d,d){n={id:a.dataset.productId,slug:a.dataset.productSlug},S(),q();return}let m=l();if(!m){window.location.href="/products/";return}await c(m),q()}function q(){R(),Y(),j(),y(),M(),D(),A(),E(),v()}function R(){let a=document.getElementById("main-product-image")||document.getElementById("main-image"),d=a?.parentElement;if(!a||!d)return;let m=document.createElement("div");m.className="zoom-lens absolute w-32 h-32 border-2 border-primary-500 bg-white/30 pointer-events-none opacity-0 transition-opacity duration-200 z-10",m.style.backgroundRepeat="no-repeat";let x=document.createElement("div");x.className="zoom-result fixed right-8 top-1/2 -translate-y-1/2 w-96 h-96 border border-stone-200 dark:border-stone-700 rounded-xl shadow-2xl bg-white dark:bg-stone-800 opacity-0 pointer-events-none transition-opacity duration-200 z-50 hidden lg:block",x.style.backgroundRepeat="no-repeat",d.classList.add("relative"),d.appendChild(m),document.body.appendChild(x),d.addEventListener("mouseenter",()=>{window.innerWidth<1024||(m.classList.remove("opacity-0"),x.classList.remove("opacity-0"),b=!0)}),d.addEventListener("mouseleave",()=>{m.classList.add("opacity-0"),x.classList.add("opacity-0"),b=!1}),d.addEventListener("mousemove",w=>{if(!b||window.innerWidth<1024)return;let $=d.getBoundingClientRect(),U=w.clientX-$.left,G=w.clientY-$.top,te=U-m.offsetWidth/2,ae=G-m.offsetHeight/2;m.style.left=`${Math.max(0,Math.min($.width-m.offsetWidth,te))}px`,m.style.top=`${Math.max(0,Math.min($.height-m.offsetHeight,ae))}px`;let ne=3,Gs=-U*ne+x.offsetWidth/2,Js=-G*ne+x.offsetHeight/2;x.style.backgroundImage=`url(${a.src})`,x.style.backgroundSize=`${$.width*ne}px ${$.height*ne}px`,x.style.backgroundPosition=`${Gs}px ${Js}px`})}function Y(){let a=document.getElementById("size-guide-btn");a&&a.addEventListener("click",()=>{let d=document.createElement("div");d.id="size-guide-modal",d.className="fixed inset-0 z-50 flex items-center justify-center p-4",d.innerHTML=`
                <div class="absolute inset-0 bg-black/50 backdrop-blur-sm" onclick="document.getElementById('size-guide-modal').remove()"></div>
                <div class="relative bg-white dark:bg-stone-800 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-auto">
                    <div class="sticky top-0 bg-white dark:bg-stone-800 border-b border-stone-200 dark:border-stone-700 p-4 flex items-center justify-between">
                        <h2 class="text-xl font-bold text-stone-900 dark:text-white">Size Guide</h2>
                        <button onclick="document.getElementById('size-guide-modal').remove()" class="w-10 h-10 bg-stone-100 dark:bg-stone-700 rounded-full flex items-center justify-center hover:bg-stone-200 dark:hover:bg-stone-600 transition-colors">
                            <svg class="w-5 h-5 text-stone-600 dark:text-stone-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
                        </button>
                    </div>
                    <div class="p-6">
                        <div class="mb-6">
                            <h3 class="text-lg font-semibold text-stone-900 dark:text-white mb-2">How to Measure</h3>
                            <p class="text-stone-600 dark:text-stone-400 text-sm">Use a flexible measuring tape for accurate measurements. Measure over your undergarments for best results.</p>
                        </div>
                        <div class="overflow-x-auto">
                            <table class="w-full text-sm">
                                <thead>
                                    <tr class="bg-stone-50 dark:bg-stone-700">
                                        <th class="px-4 py-3 text-left font-semibold text-stone-900 dark:text-white">Size</th>
                                        <th class="px-4 py-3 text-center font-semibold text-stone-900 dark:text-white">Chest (in)</th>
                                        <th class="px-4 py-3 text-center font-semibold text-stone-900 dark:text-white">Waist (in)</th>
                                        <th class="px-4 py-3 text-center font-semibold text-stone-900 dark:text-white">Length (in)</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr class="border-b border-stone-100 dark:border-stone-600">
                                        <td class="px-4 py-3 font-medium text-stone-900 dark:text-white">XS</td>
                                        <td class="px-4 py-3 text-center text-stone-600 dark:text-stone-400">32-34</td>
                                        <td class="px-4 py-3 text-center text-stone-600 dark:text-stone-400">26-28</td>
                                        <td class="px-4 py-3 text-center text-stone-600 dark:text-stone-400">26</td>
                                    </tr>
                                    <tr class="border-b border-stone-100 dark:border-stone-600">
                                        <td class="px-4 py-3 font-medium text-stone-900 dark:text-white">S</td>
                                        <td class="px-4 py-3 text-center text-stone-600 dark:text-stone-400">35-37</td>
                                        <td class="px-4 py-3 text-center text-stone-600 dark:text-stone-400">29-31</td>
                                        <td class="px-4 py-3 text-center text-stone-600 dark:text-stone-400">27</td>
                                    </tr>
                                    <tr class="border-b border-stone-100 dark:border-stone-600">
                                        <td class="px-4 py-3 font-medium text-stone-900 dark:text-white">M</td>
                                        <td class="px-4 py-3 text-center text-stone-600 dark:text-stone-400">38-40</td>
                                        <td class="px-4 py-3 text-center text-stone-600 dark:text-stone-400">32-34</td>
                                        <td class="px-4 py-3 text-center text-stone-600 dark:text-stone-400">28</td>
                                    </tr>
                                    <tr class="border-b border-stone-100 dark:border-stone-600">
                                        <td class="px-4 py-3 font-medium text-stone-900 dark:text-white">L</td>
                                        <td class="px-4 py-3 text-center text-stone-600 dark:text-stone-400">41-43</td>
                                        <td class="px-4 py-3 text-center text-stone-600 dark:text-stone-400">35-37</td>
                                        <td class="px-4 py-3 text-center text-stone-600 dark:text-stone-400">29</td>
                                    </tr>
                                    <tr>
                                        <td class="px-4 py-3 font-medium text-stone-900 dark:text-white">XL</td>
                                        <td class="px-4 py-3 text-center text-stone-600 dark:text-stone-400">44-46</td>
                                        <td class="px-4 py-3 text-center text-stone-600 dark:text-stone-400">38-40</td>
                                        <td class="px-4 py-3 text-center text-stone-600 dark:text-stone-400">30</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                        <div class="mt-6 p-4 bg-amber-50 dark:bg-amber-900/20 rounded-xl">
                            <p class="text-sm text-amber-800 dark:text-amber-200">\u{1F4A1} <strong>Tip:</strong> If you're between sizes, we recommend sizing up for a more comfortable fit.</p>
                        </div>
                    </div>
                </div>
            `,document.body.appendChild(d)})}function j(){let a=document.getElementById("stock-alert-btn");a&&a.addEventListener("click",()=>{if(!document.getElementById("product-detail")?.dataset.productId)return;let m=document.createElement("div");m.id="stock-alert-modal",m.className="fixed inset-0 z-50 flex items-center justify-center p-4",m.innerHTML=`
                <div class="absolute inset-0 bg-black/50 backdrop-blur-sm" onclick="document.getElementById('stock-alert-modal').remove()"></div>
                <div class="relative bg-white dark:bg-stone-800 rounded-2xl shadow-2xl max-w-md w-full p-6">
                    <button onclick="document.getElementById('stock-alert-modal').remove()" class="absolute top-4 right-4 w-8 h-8 bg-stone-100 dark:bg-stone-700 rounded-full flex items-center justify-center hover:bg-stone-200 dark:hover:bg-stone-600 transition-colors">
                        <svg class="w-4 h-4 text-stone-600 dark:text-stone-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
                    </button>
                    <div class="text-center mb-6">
                        <div class="w-16 h-16 bg-primary-100 dark:bg-amber-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg class="w-8 h-8 text-primary-600 dark:text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/></svg>
                        </div>
                        <h3 class="text-xl font-bold text-stone-900 dark:text-white mb-2">Notify Me When Available</h3>
                        <p class="text-stone-600 dark:text-stone-400 text-sm">We'll email you when this product is back in stock.</p>
                    </div>
                    <form id="stock-alert-form" class="space-y-4">
                        <input type="email" id="stock-alert-email" placeholder="Enter your email" required class="w-full px-4 py-3 border border-stone-300 dark:border-stone-600 rounded-xl bg-white dark:bg-stone-700 text-stone-900 dark:text-white focus:ring-2 focus:ring-primary-500 dark:focus:ring-amber-500">
                        <button type="submit" class="w-full py-3 bg-primary-600 dark:bg-amber-600 text-white font-semibold rounded-xl hover:bg-primary-700 dark:hover:bg-amber-700 transition-colors">
                            Notify Me
                        </button>
                    </form>
                </div>
            `,document.body.appendChild(m),document.getElementById("stock-alert-form")?.addEventListener("submit",async x=>{x.preventDefault();let w=document.getElementById("stock-alert-email")?.value;if(w)try{k=w,Toast.success("You will be notified when this product is back in stock!"),m.remove()}catch{Toast.error("Failed to subscribe. Please try again.")}})})}function y(){document.querySelectorAll(".share-btn").forEach(a=>{a.addEventListener("click",()=>{let d=a.dataset.platform,m=encodeURIComponent(window.location.href),x=encodeURIComponent(document.title),w=document.querySelector("h1")?.textContent||"",$={facebook:`https://www.facebook.com/sharer/sharer.php?u=${m}`,twitter:`https://twitter.com/intent/tweet?url=${m}&text=${encodeURIComponent(w)}`,pinterest:`https://pinterest.com/pin/create/button/?url=${m}&description=${encodeURIComponent(w)}`,whatsapp:`https://api.whatsapp.com/send?text=${encodeURIComponent(w+" "+window.location.href)}`,copy:null};d==="copy"?navigator.clipboard.writeText(window.location.href).then(()=>{Toast.success("Link copied to clipboard!")}).catch(()=>{Toast.error("Failed to copy link")}):$[d]&&window.open($[d],"_blank","width=600,height=400")})})}function M(){let a=document.getElementById("qa-section");if(!a||!document.getElementById("product-detail")?.dataset.productId)return;let m=[{question:"Is this product machine washable?",answer:"Yes, we recommend washing on a gentle cycle with cold water.",askedBy:"John D.",date:"2 days ago"},{question:"What materials is this made from?",answer:"This product is crafted from 100% organic cotton sourced from sustainable farms.",askedBy:"Sarah M.",date:"1 week ago"}];a.innerHTML=`
            <div class="space-y-6">
                <div class="flex items-center justify-between">
                    <h3 class="text-lg font-semibold text-stone-900 dark:text-white">Questions & Answers</h3>
                    <button id="ask-question-btn" class="text-sm font-medium text-primary-600 dark:text-amber-400 hover:underline">Ask a Question</button>
                </div>
                <div id="qa-list" class="space-y-4">
                    ${m.map(x=>`
                        <div class="bg-stone-50 dark:bg-stone-700/50 rounded-xl p-4">
                            <div class="flex items-start gap-3 mb-2">
                                <span class="text-primary-600 dark:text-amber-400 font-bold">Q:</span>
                                <div>
                                    <p class="text-stone-900 dark:text-white font-medium">${Templates.escapeHtml(x.question)}</p>
                                    <p class="text-xs text-stone-500 dark:text-stone-400 mt-1">${x.askedBy} \u2022 ${x.date}</p>
                                </div>
                            </div>
                            ${x.answer?`
                                <div class="flex items-start gap-3 mt-3 pl-6">
                                    <span class="text-emerald-600 dark:text-emerald-400 font-bold">A:</span>
                                    <p class="text-stone-600 dark:text-stone-300">${Templates.escapeHtml(x.answer)}</p>
                                </div>
                            `:""}
                        </div>
                    `).join("")}
                </div>
            </div>
        `,document.getElementById("ask-question-btn")?.addEventListener("click",()=>{let x=document.createElement("div");x.id="ask-question-modal",x.className="fixed inset-0 z-50 flex items-center justify-center p-4",x.innerHTML=`
                <div class="absolute inset-0 bg-black/50 backdrop-blur-sm" onclick="document.getElementById('ask-question-modal').remove()"></div>
                <div class="relative bg-white dark:bg-stone-800 rounded-2xl shadow-2xl max-w-md w-full p-6">
                    <button onclick="document.getElementById('ask-question-modal').remove()" class="absolute top-4 right-4 w-8 h-8 bg-stone-100 dark:bg-stone-700 rounded-full flex items-center justify-center">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
                    </button>
                    <h3 class="text-xl font-bold text-stone-900 dark:text-white mb-4">Ask a Question</h3>
                    <form id="question-form" class="space-y-4">
                        <textarea id="question-input" rows="4" placeholder="Type your question here..." required class="w-full px-4 py-3 border border-stone-300 dark:border-stone-600 rounded-xl bg-white dark:bg-stone-700 text-stone-900 dark:text-white resize-none focus:ring-2 focus:ring-primary-500"></textarea>
                        <button type="submit" class="w-full py-3 bg-primary-600 dark:bg-amber-600 text-white font-semibold rounded-xl hover:bg-primary-700 dark:hover:bg-amber-700 transition-colors">
                            Submit Question
                        </button>
                    </form>
                </div>
            `,document.body.appendChild(x),document.getElementById("question-form")?.addEventListener("submit",w=>{w.preventDefault(),Toast.success("Your question has been submitted!"),x.remove()})})}function D(){let a=document.getElementById("delivery-estimate");if(!a)return;let d=new Date,m=3,x=7,w=new Date(d.getTime()+m*24*60*60*1e3),$=new Date(d.getTime()+x*24*60*60*1e3),U=G=>G.toLocaleDateString("en-US",{weekday:"short",month:"short",day:"numeric"});a.innerHTML=`
            <div class="flex items-start gap-3 p-4 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl">
                <svg class="w-5 h-5 text-emerald-600 dark:text-emerald-400 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"/>
                </svg>
                <div>
                    <p class="text-sm font-medium text-emerald-700 dark:text-emerald-300">Estimated Delivery</p>
                    <p class="text-emerald-600 dark:text-emerald-400 font-semibold">${U(w)} - ${U($)}</p>
                    <p class="text-xs text-emerald-600 dark:text-emerald-400 mt-1">Free shipping on orders over $50</p>
                </div>
            </div>
        `}function A(){let a=document.getElementById("product-detail")?.dataset.productId,d=document.getElementById("product-detail")?.dataset.productSlug,m=document.querySelector("h1")?.textContent,x=document.getElementById("main-product-image")?.src||document.getElementById("main-image")?.src,w=document.getElementById("product-price")?.textContent;if(!a)return;let $=JSON.parse(localStorage.getItem("recentlyViewed")||"[]"),U=$.findIndex(G=>G.id===a);U>-1&&$.splice(U,1),$.unshift({id:a,slug:d,name:m,image:x,price:w,viewedAt:new Date().toISOString()}),localStorage.setItem("recentlyViewed",JSON.stringify($.slice(0,20)))}function E(){if(document.getElementById("mobile-sticky-atc")||document.getElementById("mobile-sticky-atc-js")||window.innerWidth>=1024)return;let d=n;if(!d)return;let m=document.createElement("div");m.id="mobile-sticky-atc-enhanced",m.className="fixed bottom-0 inset-x-0 z-40 lg:hidden bg-white dark:bg-stone-800 border-t border-stone-200 dark:border-stone-700 shadow-2xl p-3 transform translate-y-full transition-transform duration-300",m.innerHTML=`
            <div class="flex items-center gap-3">
                <div class="flex-1 min-w-0">
                    <p class="text-xs text-stone-500 dark:text-stone-400 truncate">${d.name||""}</p>
                    <p class="font-bold text-stone-900 dark:text-white">${d.sale_price?Templates.formatPrice(d.sale_price):Templates.formatPrice(d.price||0)}</p>
                </div>
                <button id="sticky-add-to-cart" class="px-6 py-3 bg-primary-600 dark:bg-amber-600 text-white font-semibold rounded-xl hover:bg-primary-700 dark:hover:bg-amber-700 transition-colors">
                    Add to Cart
                </button>
            </div>
        `,document.body.appendChild(m);let x=document.getElementById("add-to-cart-btn");x&&new IntersectionObserver($=>{$.forEach(U=>{U.isIntersecting?m.classList.add("translate-y-full"):m.classList.remove("translate-y-full")})},{threshold:0}).observe(x),document.getElementById("sticky-add-to-cart")?.addEventListener("click",()=>{document.getElementById("add-to-cart-btn")?.click()})}function v(){document.querySelectorAll("[data-video-url]").forEach(d=>{d.addEventListener("click",()=>{let m=d.dataset.videoUrl;if(!m)return;let x=document.createElement("div");x.id="video-player-modal",x.className="fixed inset-0 z-50 flex items-center justify-center bg-black/90",x.innerHTML=`
                    <button onclick="document.getElementById('video-player-modal').remove()" class="absolute top-4 right-4 w-12 h-12 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-colors">
                        <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
                    </button>
                    <video controls autoplay class="max-w-full max-h-[90vh] rounded-xl">
                        <source src="${m}" type="video/mp4">
                        Your browser does not support video playback.
                    </video>
                `,document.body.appendChild(x)})})}function S(){T(),g(),r(),a();async function a(){let d=document.getElementById("add-to-wishlist-btn");if(!d)return;let m=document.getElementById("product-detail")?.dataset.productId;if(m&&!(typeof WishlistApi>"u"))try{let x=await WishlistApi.getWishlist({pageSize:100});x.success&&x.data?.items&&(x.data.items.some($=>$.product_id===m||$.product===m)?(d.querySelector("svg")?.setAttribute("fill","currentColor"),d.classList.add("text-red-500")):(d.querySelector("svg")?.setAttribute("fill","none"),d.classList.remove("text-red-500")))}catch{}}s(),i(),W(),L()}function L(){let a=document.querySelectorAll(".tab-btn"),d=document.querySelectorAll(".tab-content");a.forEach(m=>{m.addEventListener("click",()=>{let x=m.dataset.tab;a.forEach(w=>{w.classList.remove("border-primary-500","text-primary-600"),w.classList.add("border-transparent","text-gray-500")}),m.classList.add("border-primary-500","text-primary-600"),m.classList.remove("border-transparent","text-gray-500"),d.forEach(w=>{w.id===`${x}-tab`?w.classList.remove("hidden"):w.classList.add("hidden")})})})}function g(){let a=document.getElementById("add-to-cart-btn");a&&a.addEventListener("click",async()=>{let d=document.getElementById("product-detail")?.dataset.productId,m=parseInt(document.getElementById("quantity")?.value)||1,w=!!document.querySelector('input[name="variant"]'),$=document.querySelector('input[name="variant"]:checked')?.value;if(!d)return;if(w&&!$){Toast.warning("Please select a variant before adding to cart.");return}a.disabled=!0;let U=a.innerHTML;a.innerHTML='<svg class="animate-spin h-5 w-5 mx-auto" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>';try{await CartApi.addItem(d,m,$||null),Toast.success("Added to cart!"),document.dispatchEvent(new CustomEvent("cart:updated"))}catch(G){Toast.error(G.message||"Failed to add to cart.")}finally{a.disabled=!1,a.innerHTML=U}})}function r(){let a=document.getElementById("add-to-wishlist-btn");a&&a.addEventListener("click",async()=>{let d=document.getElementById("product-detail")?.dataset.productId;if(d){if(typeof AuthApi<"u"&&!AuthApi.isAuthenticated()){Toast.warning("Please login to add items to your wishlist."),window.location.href="/account/login/?next="+encodeURIComponent(window.location.pathname);return}try{let m=!1;if(typeof WishlistApi<"u"){let x=await WishlistApi.getWishlist({pageSize:100});x.success&&x.data?.items&&(m=x.data.items.some(w=>w.product_id===d||w.product===d))}if(m){let w=(await WishlistApi.getWishlist({pageSize:100})).data.items.find($=>$.product_id===d||$.product===d);w&&(await WishlistApi.removeItem(w.id),Toast.success("Removed from wishlist!"),a.querySelector("svg")?.setAttribute("fill","none"),a.classList.remove("text-red-500"),a.setAttribute("aria-pressed","false"))}else await WishlistApi.addItem(d),Toast.success("Added to wishlist!"),a.querySelector("svg")?.setAttribute("fill","currentColor"),a.classList.add("text-red-500"),a.setAttribute("aria-pressed","true")}catch(m){Toast.error(m.message||"Wishlist action failed.")}}})}function s(){document.querySelectorAll('input[name="variant"]').forEach(d=>{d.addEventListener("change",()=>{e=d.value;let m=d.dataset.price,x=parseInt(d.dataset.stock||"0");if(m){let te=document.getElementById("product-price");te&&window.Templates?.formatPrice&&(te.textContent=window.Templates.formatPrice(parseFloat(m)))}let w=document.getElementById("stock-status"),$=document.getElementById("add-to-cart-btn"),U=document.getElementById("mobile-stock"),G=document.getElementById("mobile-add-to-cart");w&&(x>10?w.innerHTML='<span class="text-green-600">In Stock</span>':x>0?w.innerHTML=`<span class="text-orange-500">Only ${x} left</span>`:w.innerHTML='<span class="text-red-600">Out of Stock</span>'),$&&($.disabled=x<=0),G&&(G.disabled=x<=0),U&&(U.textContent=x>0?x>10?"In stock":`${x} available`:"Out of stock")})})}function i(){document.getElementById("main-image")?.addEventListener("click",()=>{})}function l(){let d=window.location.pathname.match(/\/products\/([^\/]+)/);return d?d[1]:null}async function c(a){let d=document.getElementById("product-detail");if(d){Loader.show(d,"skeleton");try{if(n=(await ProductsApi.getProduct(a)).data,!n){window.location.href="/404/";return}document.title=`${n.name} | Bunoraa`,h(n),re(n),se(n),await Promise.all([O(n),P(n),X(n),oe(n)]),le(),de(n)}catch(m){console.error("Failed to load product:",m),d.innerHTML='<p class="text-red-500 text-center py-8">Failed to load product. Please try again.</p>'}}}document.addEventListener("currency:changed",async a=>{try{!p&&n&&n.slug?await c(n.slug):location.reload()}catch{}});function h(a){let d=document.getElementById("product-detail");if(!d)return;let m=a.images||[],x=a.image||m[0]?.image||"",w=a.variants&&a.variants.length>0,$=a.stock_quantity>0||a.in_stock,U=a.sale_price&&a.sale_price<a.price;d.innerHTML=`
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
                <!-- Gallery -->
                <div id="product-gallery" class="product-gallery">
                    <div class="main-image-container relative rounded-xl overflow-hidden bg-gray-100" style="aspect-ratio: ${a?.aspect?.css||"1/1"};">
                        <img 
                            src="${x}" 
                            alt="${Templates.escapeHtml(a.name)}"
                            loading="lazy"
                            decoding="async"
                            class="main-image w-full h-full object-cover cursor-zoom-in"
                            id="main-product-image"
                        >
                        ${U?`
                            <span class="absolute top-4 left-4 px-3 py-1 bg-red-500 text-white text-sm font-medium rounded-full">
                                Sale
                            </span>
                        `:""}
                        ${$?"":`
                            <span class="absolute top-4 right-4 px-3 py-1 bg-gray-900 text-white text-sm font-medium rounded-full">
                                Out of Stock
                            </span>
                        `}
                    </div>
                    ${m.length>1?`
                        <div class="thumbnails flex gap-2 mt-4 overflow-x-auto pb-2">
                            ${m.map((G,te)=>`
                                <button 
                                    class="thumbnail flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 ${te===0?"border-primary-500":"border-transparent"} hover:border-primary-500 transition-colors"
                                    data-image="${G.image}"
                                    data-index="${te}"
                                >
                                    <img src="${G.image}" alt="" loading="lazy" decoding="async" class="w-full h-full object-cover">
                                </button>
                            `).join("")}
                        </div>
                    `:""}
                </div>

                <!-- Product Info -->
                <div class="product-info">
                    <!-- Brand -->
                    ${a.brand?`
                        <a href="/products/?brand=${a.brand.id}" class="text-sm text-primary-600 hover:text-primary-700 font-medium">
                            ${Templates.escapeHtml(a.brand.name)}
                        </a>
                    `:""}

                    <!-- Title -->
                    <h1 class="text-2xl md:text-3xl font-bold text-gray-900 mt-2">
                        ${Templates.escapeHtml(a.name)}
                    </h1>

                    <!-- Rating -->
                    ${a.average_rating?`
                        <div class="flex items-center gap-2 mt-3">
                            <div class="flex items-center">
                                ${Templates.renderStars(a.average_rating)}
                            </div>
                            <span class="text-sm text-gray-600">
                                ${a.average_rating.toFixed(1)} (${a.review_count||0} reviews)
                            </span>
                            <a href="#reviews" class="text-sm text-primary-600 hover:text-primary-700">
                                Read reviews
                            </a>
                        </div>
                    `:""}

                    <!-- Price -->
                    <div class="mt-4">
                        ${Price.render({price:a.current_price??a.price_converted??a.price,salePrice:a.sale_price_converted??a.sale_price,size:"large"})}
                    </div>

                    <!-- Short Description -->
                    ${a.short_description?`
                        <p class="mt-4 text-gray-600">${Templates.escapeHtml(a.short_description)}</p>
                    `:""}

                    <!-- Variants -->
                    ${w?f(a.variants):""}

                    <!-- Quantity & Add to Cart -->
                    <div class="mt-6 space-y-4">
                        <div class="flex items-center gap-4">
                            <label class="text-sm font-medium text-gray-700">Quantity:</label>
                            <div class="flex items-center border border-gray-300 rounded-lg">
                                <button 
                                    class="qty-decrease px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors"
                                    aria-label="Decrease quantity"
                                >
                                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4"/>
                                    </svg>
                                </button>
                                <input 
                                    type="number" 
                                    id="product-quantity"
                                    value="1" 
                                    min="1" 
                                    max="${a.stock_quantity||99}"
                                    class="w-16 text-center border-0 focus:ring-0"
                                >
                                <button 
                                    class="qty-increase px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors"
                                    aria-label="Increase quantity"
                                >
                                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
                                    </svg>
                                </button>
                            </div>
                            ${a.stock_quantity?`
                                <div id="stock-status" class="text-sm text-gray-500">${a.stock_quantity>10?"In stock":a.stock_quantity+" available"}</div>
                            `:'<div id="stock-status" class="text-red-600">Out of Stock</div>'}
                        </div>

                        <div class="flex gap-3">
                            <button 
                                id="add-to-cart-btn"
                                class="flex-1 px-6 py-3 bg-primary-600 text-white font-semibold rounded-lg hover:bg-primary-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
                                ${$?"":"disabled"}
                            >
                                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"/>
                                </svg>
                                ${$?"Add to Cart":"Out of Stock"}
                            </button>
                            <button 
                                id="add-to-wishlist-btn"
                                class="px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                                aria-label="Add to wishlist"
                                data-product-id="${a.id}"
                            >
                                <svg class="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/>
                                </svg>
                            </button>
                        </div>
                    </div>

                    <!-- Product Meta -->
                    <div class="mt-6 pt-6 border-t border-gray-200 space-y-3 text-sm">
                        ${a.sku?`
                            <div class="flex">
                                <span class="text-gray-500 w-24">SKU:</span>
                                <span class="text-gray-900">${Templates.escapeHtml(a.sku)}</span>
                            </div>
                        `:""}
                        ${a.category?`
                            <div class="flex">
                                <span class="text-gray-500 w-24">Category:</span>
                                <a href="/categories/${a.category.slug}/" class="text-primary-600 hover:text-primary-700">
                                    ${Templates.escapeHtml(a.category.name)}
                                </a>
                            </div>
                        `:""}
                        ${a.tags&&a.tags.length?`
                            <div class="flex">
                                <span class="text-gray-500 w-24">Tags:</span>
                                <div class="flex flex-wrap gap-1">
                                    ${a.tags.map(G=>`
                                        <a href="/products/?tag=${G.slug}" class="px-2 py-0.5 bg-gray-100 text-gray-600 rounded hover:bg-gray-200 transition-colors">
                                            ${Templates.escapeHtml(G.name)}
                                        </a>
                                    `).join("")}
                                </div>
                            </div>
                        `:""}
                    </div>

                    <!-- Share -->
                    <div class="mt-6 pt-6 border-t border-gray-200">
                        <span class="text-sm text-gray-500">Share:</span>
                        <div class="flex gap-2 mt-2">
                            <button class="share-btn p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors" data-platform="facebook" aria-label="Share on Facebook">
                                <svg class="w-5 h-5 text-[#1877F2]" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                            </button>
                            <button class="share-btn p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors" data-platform="twitter" aria-label="Share on Twitter">
                                <svg class="w-5 h-5 text-[#1DA1F2]" fill="currentColor" viewBox="0 0 24 24"><path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/></svg>
                            </button>
                            <button class="share-btn p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors" data-platform="pinterest" aria-label="Share on Pinterest">
                                <svg class="w-5 h-5 text-[#E60023]" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0C5.373 0 0 5.372 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738a.36.36 0 01.083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.631-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12 24c6.627 0 12-5.373 12-12 0-6.628-5.373-12-12-12z"/></svg>
                            </button>
                            <button class="share-btn p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors" data-platform="copy" aria-label="Copy link">
                                <svg class="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"/>
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Product Tabs -->
            <div class="mt-12" data-tabs data-variant="underline" id="product-tabs">
                <div class="border-b border-gray-200">
                    <nav class="flex -mb-px">
                        <button data-tab class="px-6 py-4 text-sm font-medium text-gray-600 hover:text-gray-900 border-b-2 border-transparent">
                            Description
                        </button>
                        ${a.specifications&&Object.keys(a.specifications).length?`
                            <button data-tab class="px-6 py-4 text-sm font-medium text-gray-600 hover:text-gray-900 border-b-2 border-transparent">
                                Specifications
                            </button>
                        `:""}
                        <button data-tab class="px-6 py-4 text-sm font-medium text-gray-600 hover:text-gray-900 border-b-2 border-transparent">
                            Reviews (${a.review_count||0})
                        </button>
                    </nav>
                </div>
                <div class="py-6">
                    <div data-tab-panel>
                        <div class="prose max-w-none">
                            ${a.description||'<p class="text-gray-500">No description available.</p>'}
                        </div>
                    </div>
                    ${a.specifications&&Object.keys(a.specifications).length?`
                        <div data-tab-panel>
                            <table class="w-full">
                                <tbody>
                                    ${Object.entries(a.specifications).map(([G,te])=>`
                                        <tr class="border-b border-gray-100">
                                            <td class="py-3 text-sm font-medium text-gray-500 w-1/3">${Templates.escapeHtml(G)}</td>
                                            <td class="py-3 text-sm text-gray-900">${Templates.escapeHtml(String(te))}</td>
                                        </tr>
                                    `).join("")}
                                </tbody>
                            </table>
                        </div>
                    `:""}
                    <div data-tab-panel id="reviews">
                        <div id="reviews-container">
                            <!-- Reviews loaded here -->
                        </div>
                    </div>
                </div>
            </div>
        `,I(),T(),z(),V(),B(),C(),Tabs.init(),u(a)}function u(a){let d=document.getElementById("mobile-sticky-atc-js");if(d){let m=d.querySelector(".font-semibold");m&&(m.innerHTML=a.sale_price?Templates.formatPrice(a.sale_price)+' <span class="text-sm line-through text-gray-400">'+Templates.formatPrice(a.price)+"</span>":Templates.formatPrice(a.price));let x=document.getElementById("mobile-stock-js");x&&(x.textContent=a.stock_quantity>0?a.stock_quantity>10?"In stock":a.stock_quantity+" available":"Out of stock");let w=document.getElementById("mobile-add-to-cart-js");w&&(w.disabled=a.stock_quantity<=0)}else{d=document.createElement("div"),d.id="mobile-sticky-atc-js",d.className="fixed inset-x-4 bottom-4 z-40 lg:hidden",d.innerHTML=`
                <div class="bg-white shadow-lg rounded-xl p-3 flex items-center gap-3">
                    <div class="flex-1">
                        <div class="text-sm text-gray-500">${a.sale_price?"Now":""}</div>
                        <div class="font-semibold text-lg ${a.sale_price?"text-red-600":""}">${a.sale_price?Templates.formatPrice(a.sale_price)+' <span class="text-sm line-through text-gray-400">'+Templates.formatPrice(a.price)+"</span>":Templates.formatPrice(a.price)}</div>
                        <div id="mobile-stock-js" class="text-xs text-gray-500">${a.stock_quantity>0?a.stock_quantity>10?"In stock":a.stock_quantity+" available":"Out of stock"}</div>
                    </div>
                    ${a.stock_quantity>0?'<button id="mobile-add-to-cart-js" class="bg-primary-600 text-white px-4 py-2 rounded-lg font-semibold">Add</button>':'<button class="bg-gray-300 text-gray-500 px-4 py-2 rounded-lg font-semibold cursor-not-allowed" disabled>Out</button>'}
                </div>
            `,document.body.appendChild(d);let m=document.getElementById("mobile-add-to-cart-js");m&&m.addEventListener("click",()=>document.getElementById("add-to-cart-btn")?.click())}}function f(a){let d={};return a.forEach(m=>{d[m.attribute_name]||(d[m.attribute_name]=[]),d[m.attribute_name].push(m)}),Object.entries(d).map(([m,x])=>`
            <div class="mt-6">
                <label class="text-sm font-medium text-gray-700">${Templates.escapeHtml(m)}:</label>
                <div class="flex flex-wrap gap-2 mt-2" role="radiogroup" aria-label="${Templates.escapeHtml(m)}">
                    ${x.map((w,$)=>`
                        <button 
                            class="variant-btn px-4 py-2 border rounded-lg text-sm transition-colors ${$===0?"border-primary-500 bg-primary-50 text-primary-700":"border-gray-300 hover:border-gray-400"}"
                            role="radio"
                            aria-checked="${$===0?"true":"false"}"
                            data-variant-id="${w.id}"
                            data-price="${w.price_converted??w.price??""}"
                            data-stock="${w.stock_quantity||0}"
                            tabindex="0"
                        >
                            ${Templates.escapeHtml(w.value)}
                            ${(w.price_converted??w.price)&&w.price!==n.price?`
                                <span class="text-xs text-gray-500">(${Templates.formatPrice(w.price_converted??w.price)})</span>
                            `:""}
                        </button>
                    `).join("")}
                </div>
            </div>
        `).join("")}function I(){let a=document.querySelectorAll(".thumbnail"),d=document.getElementById("main-product-image"),m=0;a.forEach((x,w)=>{x.setAttribute("tabindex","0"),x.addEventListener("click",()=>{a.forEach($=>$.classList.remove("border-primary-500")),x.classList.add("border-primary-500"),d.src=x.dataset.image||x.dataset.src,m=w}),x.addEventListener("keydown",$=>{if($.key==="Enter"||$.key===" ")$.preventDefault(),x.click();else if($.key==="ArrowRight"){$.preventDefault();let U=a[(w+1)%a.length];U.focus(),U.click()}else if($.key==="ArrowLeft"){$.preventDefault();let U=a[(w-1+a.length)%a.length];U.focus(),U.click()}})}),d?.addEventListener("click",()=>{let x=n.images?.map(G=>G.image)||[n.image],w=parseInt(document.querySelector(".thumbnail.border-primary-500")?.dataset.index)||0,U=(n.images||[]).map(G=>({type:G.type||(G.video_url?"video":"image"),src:G.video_url||G.model_url||G.image})).map(G=>{if(G.type==="video")return`<div class="w-full h-full max-h-[70vh]"><video controls class="w-full h-full object-contain"><source src="${G.src}" type="video/mp4">Your browser does not support video.</video></div>`;if(G.type==="model"){if(!window.customElements||!window["model-viewer"]){let te=document.createElement("script");te.type="module",te.src="https://unpkg.com/@google/model-viewer/dist/model-viewer.min.js",document.head.appendChild(te)}return`<div class="w-full h-full max-h-[70vh]"><model-viewer src="${G.src}" camera-controls ar ar-modes="webxr scene-viewer quick-look" class="w-full h-full"></model-viewer></div>`}return`<div class="w-full h-full max-h-[70vh] flex items-center justify-center"><img src="${G.src}" class="max-w-full max-h-[70vh] object-contain" alt="${Templates.escapeHtml(n.name)}"></div>`}).join("");Modal.open({title:Templates.escapeHtml(n.name),content:`<div class="space-y-2">${U}</div>`,size:"xl"})})}function T(){let a=document.getElementById("product-quantity"),d=document.querySelector(".qty-decrease"),m=document.querySelector(".qty-increase");d?.addEventListener("click",()=>{let w=parseInt(a.value)||1;w>1&&(a.value=w-1)}),m?.addEventListener("click",()=>{let w=parseInt(a.value)||1,$=parseInt(a.max)||99;w<$&&(a.value=w+1)});let x=document.querySelectorAll(".variant-btn");if(x.forEach(w=>{w.addEventListener("click",()=>{if(x.forEach(ne=>{ne.classList.remove("border-primary-500","bg-primary-50","text-primary-700"),ne.classList.add("border-gray-300"),ne.setAttribute("aria-checked","false")}),w.classList.add("border-primary-500","bg-primary-50","text-primary-700"),w.classList.remove("border-gray-300"),w.setAttribute("aria-checked","true"),e=w.dataset.variantId,w.dataset.price){let ne=document.querySelector(".product-info .mt-4");ne&&(ne.innerHTML=Price.render({price:parseFloat(w.dataset.price),size:"large"}))}let $=parseInt(w.dataset.stock||"0"),U=document.getElementById("stock-status"),G=document.getElementById("add-to-cart-btn"),te=document.getElementById("mobile-stock"),ae=document.getElementById("mobile-add-to-cart");U&&($>10?U.innerHTML='<span class="text-green-600 flex items-center"><svg class="w-5 h-5 mr-1" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path></svg>In Stock</span>':$>0?U.innerHTML=`<span class="text-orange-500 flex items-center"><svg class="w-5 h-5 mr-1" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd"></path></svg>Only ${$} left</span>`:U.innerHTML='<span class="text-red-600 flex items-center"><svg class="w-5 h-5 mr-1" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"></path></svg>Out of Stock</span>'),a&&(a.max=Math.max($,1),parseInt(a.value)>parseInt(a.max)&&(a.value=a.max)),te&&(te.textContent=$>0?$>10?"In stock":`${$} available`:"Out of stock"),G&&(G.disabled=$<=0),ae&&(ae.disabled=$<=0)})}),x.length>0){let w=x[0];w.setAttribute("aria-checked","true"),e=w.dataset.variantId}}function z(){let a=document.getElementById("add-to-cart-btn"),d=document.getElementById("mobile-add-to-cart");if(!a&&!d)return;let m=async x=>{let w=parseInt(document.getElementById("product-quantity")?.value)||1,$=document.getElementById("stock-status");if(!!document.querySelector(".variant-btn")&&!e){Toast.warning("Please select a variant before adding to cart.");return}x.disabled=!0;let G=x.innerHTML;x.innerHTML='<svg class="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>';try{let te=document.querySelector(`.variant-btn[data-variant-id="${e}"]`);if((te?parseInt(te.dataset.stock||"0"):n.stock_quantity||0)<=0){Toast.error("This variant is out of stock.");return}await CartApi.addItem(n.id,w,e||null),Toast.success("Added to cart!"),document.dispatchEvent(new CustomEvent("cart:updated"))}catch(te){Toast.error(te.message||"Failed to add to cart.")}finally{x.disabled=!1,x.innerHTML=G}};a?.addEventListener("click",()=>m(a)),d?.addEventListener("click",()=>m(d))}function V(){let a=document.getElementById("add-to-wishlist-btn");a&&a.addEventListener("click",async()=>{if(!AuthApi.isAuthenticated()){Toast.warning("Please login to add items to your wishlist."),window.location.href="/account/login/?next="+encodeURIComponent(window.location.pathname);return}try{await WishlistApi.addItem(n.id),Toast.success("Added to wishlist!"),a.querySelector("svg").setAttribute("fill","currentColor"),a.classList.add("text-red-500"),a.setAttribute("aria-pressed","true")}catch(d){d.message?.includes("already")?Toast.info("This item is already in your wishlist."):Toast.error(d.message||"Failed to add to wishlist.")}})}function C(){let a=document.querySelectorAll(".share-btn"),d=encodeURIComponent(window.location.href),m=encodeURIComponent(n?.name||document.title);a.forEach(x=>{x.addEventListener("click",()=>{let w=x.dataset.platform,$="";switch(w){case"facebook":$=`https://www.facebook.com/sharer/sharer.php?u=${d}`;break;case"twitter":$=`https://twitter.com/intent/tweet?url=${d}&text=${m}`;break;case"pinterest":let U=encodeURIComponent(n?.image||"");$=`https://pinterest.com/pin/create/button/?url=${d}&media=${U}&description=${m}`;break;case"copy":navigator.clipboard.writeText(window.location.href).then(()=>Toast.success("Link copied to clipboard!")).catch(()=>Toast.error("Failed to copy link."));return}$&&window.open($,"_blank","width=600,height=400")})})}function B(){let a=document.getElementById("add-to-compare-btn");a&&a.addEventListener("click",async()=>{if(typeof AuthApi<"u"&&!AuthApi.isAuthenticated()){Toast.warning("Please login to compare products."),window.location.href="/account/login/?next="+encodeURIComponent(window.location.pathname);return}let d=n?.id||document.getElementById("product-detail")?.dataset.productId;if(d)try{let m=await ApiClient.post("/compare/",{product_id:d},{requiresAuth:!0});m.success?(Toast.success(m.message||"Added to compare"),a.setAttribute("aria-pressed","true"),a.classList.add("text-primary-600"),a.querySelector("svg")?.setAttribute("fill","currentColor")):Toast.error(m.message||"Failed to add to compare")}catch(m){try{let x="b_compare",w=JSON.parse(localStorage.getItem(x)||"[]");if(!w.includes(d)){w.push(d),localStorage.setItem(x,JSON.stringify(w)),Toast.success("Added to compare (local)"),a.setAttribute("aria-pressed","true"),a.classList.add("text-primary-600");return}Toast.info("Already in compare list")}catch{Toast.error(m.message||"Failed to add to compare")}}})}function W(){let a=document.getElementById("add-to-compare-btn");a&&a.addEventListener("click",async d=>{d.preventDefault();let m=document.getElementById("product-detail")?.dataset.productId;if(m)try{if(typeof AuthApi<"u"&&!AuthApi.isAuthenticated()){Toast.warning("Please login to compare products."),window.location.href="/account/login/?next="+encodeURIComponent(window.location.pathname);return}let x=await ApiClient.post("/compare/",{product_id:m},{requiresAuth:!0});x.success?(Toast.success(x.message||"Added to compare"),a.setAttribute("aria-pressed","true"),a.classList.add("text-primary-600"),a.querySelector("svg")?.setAttribute("fill","currentColor")):Toast.error(x.message||"Failed to add to compare")}catch(x){try{let w="b_compare",$=JSON.parse(localStorage.getItem(w)||"[]");if(!$.includes(m)){$.push(m),localStorage.setItem(w,JSON.stringify($)),Toast.success("Added to compare (local)"),a.setAttribute("aria-pressed","true"),a.classList.add("text-primary-600");return}Toast.info("Already in compare list")}catch{Toast.error(x.message||"Failed to add to compare")}}})}async function O(a){let d=document.getElementById("breadcrumbs");if(!d)return;let m=[{label:"Home",url:"/"},{label:"Products",url:"/products/"}];if(a.category)try{((await CategoriesAPI.getBreadcrumbs(a.category.id)).data||[]).forEach($=>{m.push({label:$.name,url:`/categories/${$.slug}/`})})}catch{m.push({label:a.category.name,url:`/categories/${a.category.slug}/`})}m.push({label:a.name}),d.innerHTML=Breadcrumb.render(m)}async function P(a){let d=document.getElementById("related-products");if(d)try{let x=(await ProductsAPI.getRelated(a.id,{limit:4})).data||[];if(x.length===0){d.innerHTML="";return}d.innerHTML=`
                <h2 class="text-2xl font-bold text-gray-900 mb-6">You may also like</h2>
                <div class="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                    ${x.map(w=>ProductCard.render(w)).join("")}
                </div>
            `,ProductCard.bindEvents(d)}catch(m){console.error("Failed to load related products:",m),d.innerHTML=""}}async function X(a){let d=document.getElementById("reviews-container");if(d){Loader.show(d,"spinner");try{let x=(await ProductsAPI.getReviews(a.id)).data||[];d.innerHTML=`
                <!-- Review Summary -->
                <div class="flex flex-col md:flex-row gap-8 mb-8 pb-8 border-b border-gray-200">
                    <div class="text-center">
                        <div class="text-5xl font-bold text-gray-900">${a.average_rating?.toFixed(1)||"0.0"}</div>
                        <div class="flex justify-center mt-2">
                            ${Templates.renderStars(a.average_rating||0)}
                        </div>
                        <div class="text-sm text-gray-500 mt-1">${a.review_count||0} reviews</div>
                    </div>
                    ${AuthAPI.isAuthenticated()?`
                        <div class="flex-1">
                            <button id="write-review-btn" class="px-6 py-3 bg-primary-600 text-white font-semibold rounded-lg hover:bg-primary-700 transition-colors">
                                Write a Review
                            </button>
                        </div>
                    `:`
                        <div class="flex-1">
                            <p class="text-gray-600">
                                <a href="/account/login/?next=${encodeURIComponent(window.location.pathname)}" class="text-primary-600 hover:text-primary-700">Sign in</a> 
                                to write a review.
                            </p>
                        </div>
                    `}
                </div>

                <!-- Reviews List -->
                ${x.length>0?`
                    <div class="space-y-6">
                        ${x.map(w=>`
                            <div class="border-b border-gray-100 pb-6">
                                <div class="flex items-start gap-4">
                                    <div class="flex-shrink-0 w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                                        <span class="text-gray-600 font-medium">${(w.user?.first_name?.[0]||w.user?.email?.[0]||"U").toUpperCase()}</span>
                                    </div>
                                    <div class="flex-1">
                                        <div class="flex items-center gap-2">
                                            <span class="font-medium text-gray-900">${Templates.escapeHtml(w.user?.first_name||"Anonymous")}</span>
                                            ${w.verified_purchase?`
                                                <span class="px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded">Verified Purchase</span>
                                            `:""}
                                        </div>
                                        <div class="flex items-center gap-2 mt-1">
                                            ${Templates.renderStars(w.rating)}
                                            <span class="text-sm text-gray-500">${Templates.formatDate(w.created_at)}</span>
                                        </div>
                                        ${w.title?`<h4 class="font-medium text-gray-900 mt-2">${Templates.escapeHtml(w.title)}</h4>`:""}
                                        <p class="text-gray-600 mt-2">${Templates.escapeHtml(w.comment)}</p>
                                    </div>
                                </div>
                            </div>
                        `).join("")}
                    </div>
                `:`
                    <p class="text-gray-500 text-center py-8">No reviews yet. Be the first to review this product!</p>
                `}
            `,document.getElementById("write-review-btn")?.addEventListener("click",()=>{ee(a)})}catch(m){console.error("Failed to load reviews:",m),d.innerHTML='<p class="text-red-500">Failed to load reviews.</p>'}}}function ee(a){Modal.open({title:"Write a Review",content:`
                <form id="review-form" class="space-y-4">
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">Rating</label>
                        <div class="flex gap-1" id="rating-stars">
                            ${[1,2,3,4,5].map(x=>`
                                <button type="button" class="rating-star text-gray-300 hover:text-yellow-400" data-rating="${x}">
                                    <svg class="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                                    </svg>
                                </button>
                            `).join("")}
                        </div>
                        <input type="hidden" id="review-rating" value="0">
                    </div>
                    <div>
                        <label for="review-title" class="block text-sm font-medium text-gray-700 mb-1">Title (optional)</label>
                        <input type="text" id="review-title" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500">
                    </div>
                    <div>
                        <label for="review-comment" class="block text-sm font-medium text-gray-700 mb-1">Your Review</label>
                        <textarea id="review-comment" rows="4" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500" required></textarea>
                    </div>
                </form>
            `,confirmText:"Submit Review",onConfirm:async()=>{let x=parseInt(document.getElementById("review-rating").value),w=document.getElementById("review-title").value.trim(),$=document.getElementById("review-comment").value.trim();if(!x||x<1)return Toast.error("Please select a rating."),!1;if(!$)return Toast.error("Please write a review."),!1;try{return await ProductsAPI.createReview(a.id,{rating:x,title:w,comment:$}),Toast.success("Thank you for your review!"),X(a),!0}catch(U){return Toast.error(U.message||"Failed to submit review."),!1}}});let d=document.querySelectorAll(".rating-star"),m=document.getElementById("review-rating");d.forEach(x=>{x.addEventListener("click",()=>{let w=parseInt(x.dataset.rating);m.value=w,d.forEach(($,U)=>{U<w?($.classList.remove("text-gray-300"),$.classList.add("text-yellow-400")):($.classList.add("text-gray-300"),$.classList.remove("text-yellow-400"))})})})}function re(a){try{document.title=`${a.name} | Bunoraa`;let d=a.meta_description||a.short_description||"";document.querySelector('meta[name="description"]')?.setAttribute("content",d),document.querySelector('meta[property="og:title"]')?.setAttribute("content",a.meta_title||a.name),document.querySelector('meta[property="og:description"]')?.setAttribute("content",d);let m=a.images?.[0]?.image||a.image;m&&document.querySelector('meta[property="og:image"]')?.setAttribute("content",m),document.querySelector('meta[name="twitter:title"]')?.setAttribute("content",a.meta_title||a.name),document.querySelector('meta[name="twitter:description"]')?.setAttribute("content",d)}catch{}}function se(a){try{let d=document.querySelector('script[type="application/ld+json"][data-ld="product"]');if(!d)return;let m={"@context":"https://schema.org","@type":"Product",name:a.name,image:(a.images||[]).map(x=>x.image||x),description:a.short_description||a.description||"",sku:a.sku||"",offers:{"@type":"Offer",url:window.location.href,priceCurrency:a.currency||window.BUNORAA_PRODUCT?.currency||"BDT",price:a.current_price||a.price}};d.textContent=JSON.stringify(m)}catch{}}async function oe(a){let d=document.getElementById("related-products");if(d)try{let[m,x,w]=await Promise.all([ProductsApi.getRecommendations(a.id,"frequently_bought_together",3),ProductsApi.getRecommendations(a.id,"similar",4),ProductsApi.getRecommendations(a.id,"you_may_also_like",6)]);if(m.success&&m.data?.length){let $=`
                    <section class="mt-8">
                        <h3 class="text-lg font-semibold mb-4">Frequently Bought Together</h3>
                        <div class="grid grid-cols-3 gap-3">${(m.data||[]).map(U=>ProductCard.render(U)).join("")}</div>
                    </section>
                `;d.insertAdjacentHTML("beforeend",$)}if(x.success&&x.data?.length){let $=`
                    <section class="mt-8">
                        <h3 class="text-lg font-semibold mb-4">Similar Products</h3>
                        <div class="grid grid-cols-2 md:grid-cols-4 gap-4">${(x.data||[]).map(U=>ProductCard.render(U)).join("")}</div>
                    </section>
                `;d.insertAdjacentHTML("beforeend",$)}if(w.success&&w.data?.length){let $=`
                    <section class="mt-8">
                        <h3 class="text-lg font-semibold mb-4">You May Also Like</h3>
                        <div class="grid grid-cols-2 md:grid-cols-4 gap-4">${(w.data||[]).map(U=>ProductCard.render(U)).join("")}</div>
                    </section>
                `;d.insertAdjacentHTML("beforeend",$)}ProductCard.bindEvents(d)}catch{}}function le(){if(!document.getElementById("product-detail")||typeof IntersectionObserver>"u")return;let d=new IntersectionObserver(m=>{m.forEach(x=>{if(!x.isIntersecting)return;let w=x.target;w.id,w.id==="reviews"||w.id,d.unobserve(w)})},{rootMargin:"200px"});document.querySelectorAll("#related-products, #reviews").forEach(m=>{d.observe(m)})}async function de(a){try{await ProductsAPI.trackView(a.id)}catch{}}function me(){n=null,e=null,t=null,o=!1}return{init:_,destroy:me}})();window.ProductPage=zs;hr=zs});var Vs={};J(Vs,{default:()=>fr});var Ds,fr,Us=Q(()=>{Ds=(function(){"use strict";let n="",e=1,t={},o=null,p=!1;async function b(){if(p)return;p=!0;let g=document.getElementById("search-results")||document.getElementById("products-grid");if(g&&g.querySelector(".product-card, [data-product-id]")){j(),E(),v(),k();return}n=R(),t=Y(),e=parseInt(new URLSearchParams(window.location.search).get("page"))||1,await _(),j(),E(),v(),k()}function k(){let g=document.getElementById("view-grid"),r=document.getElementById("view-list");g?.addEventListener("click",()=>{g.classList.add("bg-primary-100","text-primary-700"),g.classList.remove("text-gray-400"),r?.classList.remove("bg-primary-100","text-primary-700"),r?.classList.add("text-gray-400"),Storage?.set("productViewMode","grid"),_()}),r?.addEventListener("click",()=>{r.classList.add("bg-primary-100","text-primary-700"),r.classList.remove("text-gray-400"),g?.classList.remove("bg-primary-100","text-primary-700"),g?.classList.add("text-gray-400"),Storage?.set("productViewMode","list"),_()})}async function _(){let g=document.getElementById("search-results")||document.getElementById("products-grid"),r=document.getElementById("results-count")||document.getElementById("product-count");if(g){o&&o.abort(),o=new AbortController,Loader.show(g,"skeleton");try{let s={page:e,pageSize:12,...t};if(n&&(s.search=n),window.location.pathname==="/categories/"){await q();return}let l=await ProductsApi.getProducts(s),c=Array.isArray(l)?l:l.data||l.results||[],h=l.meta||{};r&&(n?r.textContent=`${h.total||c.length} results for "${Templates.escapeHtml(n)}"`:r.textContent=`${h.total||c.length} products`),M(c,h),await D()}catch(s){if(s.name==="AbortError")return;console.error("Failed to load products:",s),g.innerHTML='<p class="text-red-500 text-center py-8">Failed to load products. Please try again.</p>'}}}async function q(){let g=document.getElementById("search-results")||document.getElementById("products-grid"),r=document.getElementById("results-count")||document.getElementById("product-count"),s=document.getElementById("page-title");if(g)try{let i=await CategoriesApi.getCategories({limit:50}),l=Array.isArray(i)?i:i.data||i.results||[];if(s&&(s.textContent="All Categories"),r&&(r.textContent=`${l.length} categories`),l.length===0){g.innerHTML=`
                    <div class="text-center py-16">
                        <svg class="w-24 h-24 text-gray-300 mx-auto mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"/>
                        </svg>
                        <h2 class="text-2xl font-bold text-gray-900 mb-2">No categories found</h2>
                        <p class="text-gray-600">Check back later for new categories.</p>
                    </div>
                `;return}g.innerHTML=`
                <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                    ${l.map(c=>`
                        <a href="/categories/${c.slug}/" class="group bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden">
                            <div class="relative overflow-hidden" style="aspect-ratio: ${product?.aspect?.css||"1/1"};">
                                ${c.image?`
                                    <img src="${c.image}" alt="${Templates.escapeHtml(c.name)}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300">
                                `:`
                                    <div class="w-full h-full flex items-center justify-center">
                                        <svg class="w-16 h-16 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"/>
                                        </svg>
                                    </div>
                                `}
                            </div>
                            <div class="p-4 text-center">
                                <h3 class="font-semibold text-gray-900 group-hover:text-primary-600 transition-colors">${Templates.escapeHtml(c.name)}</h3>
                                ${c.product_count?`<p class="text-sm text-gray-500 mt-1">${c.product_count} products</p>`:""}
                            </div>
                        </a>
                    `).join("")}
                </div>
            `}catch(i){console.error("Failed to load categories:",i),g.innerHTML='<p class="text-red-500 text-center py-8">Failed to load categories. Please try again.</p>'}}function R(){return new URLSearchParams(window.location.search).get("q")||""}function Y(){let g=new URLSearchParams(window.location.search),r={};return g.get("category")&&(r.category=g.get("category")),g.get("min_price")&&(r.minPrice=g.get("min_price")),g.get("max_price")&&(r.maxPrice=g.get("max_price")),g.get("ordering")&&(r.ordering=g.get("ordering")),g.get("in_stock")&&(r.inStock=g.get("in_stock")==="true"),g.get("sale")&&(r.onSale=g.get("sale")==="true"),g.get("featured")&&(r.featured=g.get("featured")==="true"),r}function j(){let g=document.getElementById("search-form"),r=document.getElementById("search-input");r&&(r.value=n),g?.addEventListener("submit",l=>{l.preventDefault();let c=r?.value.trim();c&&(n=c,e=1,S(),y())});let s=document.getElementById("search-suggestions"),i=null;r?.addEventListener("input",l=>{let c=l.target.value.trim();if(clearTimeout(i),c.length<2){s&&(s.innerHTML="",s.classList.add("hidden"));return}i=setTimeout(async()=>{try{let u=(await ProductsApi.search({q:c,limit:5})).data||[];s&&u.length>0&&(s.innerHTML=`
                            <div class="py-2">
                                ${u.map(f=>`
                                    <a href="/products/${f.slug}/" class="flex items-center gap-3 px-4 py-2 hover:bg-gray-50">
                                        ${f.image?`<img src="${f.image}" alt="" class="w-10 h-10 object-cover rounded" onerror="this.style.display='none'">`:'<div class="w-10 h-10 bg-gray-100 rounded flex items-center justify-center"><svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg></div>'}
                                        <div>
                                            <p class="text-sm font-medium text-gray-900">${Templates.escapeHtml(f.name)}</p>
                                            <p class="text-sm text-primary-600">${Templates.formatPrice(f.current_price??f.price_converted??f.price)}</p>
                                        </div>
                                    </a>
                                `).join("")}
                            </div>
                        `,s.classList.remove("hidden"))}catch(h){console.error("Search suggestions failed:",h)}},300)}),r?.addEventListener("blur",()=>{setTimeout(()=>{s&&s.classList.add("hidden")},200)})}async function y(){await _()}function M(g,r){let s=document.getElementById("search-results");if(!s)return;if(g.length===0){s.innerHTML=`
                <div class="text-center py-16">
                    <svg class="w-24 h-24 text-gray-300 mx-auto mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
                    </svg>
                    <h2 class="text-2xl font-bold text-gray-900 mb-2">No results found</h2>
                    <p class="text-gray-600 mb-4">We couldn't find any products matching "${Templates.escapeHtml(n)}"</p>
                    <p class="text-gray-500 text-sm">Try different keywords or browse our categories</p>
                </div>
            `;return}let i=Storage.get("productViewMode")||"grid",l=i==="list"?"space-y-4":"grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6";s.innerHTML=`
            <div class="${l}">
                ${g.map(h=>ProductCard.render(h,{layout:i})).join("")}
            </div>
            ${r.total_pages>1?`
                <div id="search-pagination" class="mt-8">${Pagination.render({currentPage:r.current_page||e,totalPages:r.total_pages,totalItems:r.total})}</div>
            `:""}
        `,ProductCard.bindEvents(s),document.getElementById("search-pagination")?.addEventListener("click",h=>{let u=h.target.closest("[data-page]");u&&(e=parseInt(u.dataset.page),S(),y(),window.scrollTo({top:0,behavior:"smooth"}))})}async function D(){let g=document.getElementById("filter-categories");if(g)try{let s=(await CategoriesAPI.getAll({has_products:!0,limit:20})).data||[];g.innerHTML=`
                <div class="space-y-2">
                    <label class="flex items-center">
                        <input type="radio" name="category" value="" ${t.category?"":"checked"} class="text-primary-600 focus:ring-primary-500">
                        <span class="ml-2 text-sm text-gray-600">All Categories</span>
                    </label>
                    ${s.map(i=>`
                        <label class="flex items-center">
                            <input type="radio" name="category" value="${i.id}" ${t.category===String(i.id)?"checked":""} class="text-primary-600 focus:ring-primary-500">
                            <span class="ml-2 text-sm text-gray-600">${Templates.escapeHtml(i.name)}</span>
                        </label>
                    `).join("")}
                </div>
            `,A()}catch{}}function A(){document.querySelectorAll('input[name="category"]').forEach(r=>{r.addEventListener("change",s=>{s.target.value?t.category=s.target.value:delete t.category,e=1,S(),y()})})}function E(){let g=document.getElementById("apply-price-filter"),r=document.getElementById("filter-in-stock"),s=document.getElementById("clear-filters");g?.addEventListener("click",()=>{let c=document.getElementById("filter-min-price")?.value,h=document.getElementById("filter-max-price")?.value;c?t.min_price=c:delete t.min_price,h?t.max_price=h:delete t.max_price,e=1,S(),y()}),r?.addEventListener("change",c=>{c.target.checked?t.in_stock=!0:delete t.in_stock,e=1,S(),y()}),s?.addEventListener("click",()=>{t={},e=1,document.querySelectorAll('input[name="category"]').forEach(u=>{u.checked=u.value===""});let c=document.getElementById("filter-min-price"),h=document.getElementById("filter-max-price");c&&(c.value=""),h&&(h.value=""),r&&(r.checked=!1),S(),y()});let i=document.getElementById("filter-min-price"),l=document.getElementById("filter-max-price");i&&t.min_price&&(i.value=t.min_price),l&&t.max_price&&(l.value=t.max_price),r&&t.in_stock&&(r.checked=!0)}function v(){let g=document.getElementById("sort-select");g&&(g.value=t.ordering||"",g.addEventListener("change",r=>{r.target.value?t.ordering=r.target.value:delete t.ordering,e=1,S(),y()}))}function S(){let g=new URLSearchParams;n&&g.set("q",n),t.category&&g.set("category",t.category),t.min_price&&g.set("min_price",t.min_price),t.max_price&&g.set("max_price",t.max_price),t.ordering&&g.set("ordering",t.ordering),t.in_stock&&g.set("in_stock","true"),e>1&&g.set("page",e);let r=`${window.location.pathname}?${g.toString()}`;window.history.pushState({},"",r)}function L(){o&&(o.abort(),o=null),n="",e=1,t={},p=!1}return{init:b,destroy:L}})();window.SearchPage=Ds;fr=Ds});var Ys={};J(Ys,{default:()=>xr});var Ws,xr,Qs=Q(()=>{Ws=(function(){"use strict";let n=1,e="added_desc",t="all";function o(){return window.BUNORAA_CURRENCY?.symbol||"\u09F3"}let p={get CURRENCY_SYMBOL(){return o()},PRIORITY_LEVELS:{low:{label:"Low",color:"gray",icon:"\u25CB"},normal:{label:"Normal",color:"blue",icon:"\u25D0"},high:{label:"High",color:"amber",icon:"\u25CF"},urgent:{label:"Urgent",color:"red",icon:"\u2605"}}};async function b(){AuthGuard.protectPage()&&(await q(),j())}function k(E={}){let v=E.product||E||{},S=[E.product_image,v.product_image,v.primary_image,v.image,Array.isArray(v.images)?v.images[0]:null,v.image_url,v.thumbnail],L=g=>{if(!g)return"";if(typeof g=="string")return g;if(typeof g=="object"){if(typeof g.image=="string"&&g.image)return g.image;if(g.image&&typeof g.image=="object"){if(typeof g.image.url=="string"&&g.image.url)return g.image.url;if(typeof g.image.src=="string"&&g.image.src)return g.image.src}if(typeof g.url=="string"&&g.url)return g.url;if(typeof g.src=="string"&&g.src)return g.src}return""};for(let g of S){let r=L(g);if(r)return r}return""}function _(E={}){let v=E.product||E||{},S=u=>{if(u==null)return null;let f=Number(u);return Number.isFinite(f)?f:null},L=[E.product_price,v.price,E.price,E.current_price,E.price_at_add],g=null;for(let u of L)if(g=S(u),g!==null)break;let r=[E.product_sale_price,v.sale_price,E.sale_price],s=null;for(let u of r)if(s=S(u),s!==null)break;let i=S(E.lowest_price_seen),l=S(E.highest_price_seen),c=S(E.target_price),h=S(E.price_at_add);return{price:g!==null?g:0,salePrice:s!==null?s:null,lowestPrice:i,highestPrice:l,targetPrice:c,priceAtAdd:h}}async function q(){let E=document.getElementById("wishlist-container");if(E){Loader.show(E,"skeleton");try{let v=await WishlistApi.getWishlist({page:n,sort:e}),S=[],L={};Array.isArray(v)?S=v:v&&typeof v=="object"&&(S=v.data||v.results||v.items||[],!Array.isArray(S)&&v.data&&typeof v.data=="object"?(S=v.data.items||v.data.results||[],L=v.data.meta||v.meta||{}):L=v.meta||{}),Array.isArray(S)||(S=S&&typeof S=="object"?[S]:[]);let g=S;t==="on_sale"?g=S.filter(r=>{let s=_(r);return s.salePrice&&s.salePrice<s.price}):t==="in_stock"?g=S.filter(r=>r.is_in_stock!==!1):t==="price_drop"?g=S.filter(r=>{let s=_(r);return s.priceAtAdd&&s.price<s.priceAtAdd}):t==="at_target"&&(g=S.filter(r=>{let s=_(r);return s.targetPrice&&s.price<=s.targetPrice})),R(g,S,L)}catch(v){let S=v&&(v.message||v.detail)||"Failed to load wishlist.";if(v&&v.status===401){AuthGuard.redirectToLogin();return}E.innerHTML=`<p class="text-red-500 text-center py-8">${Templates.escapeHtml(S)}</p>`}}}function R(E,v,S){let L=document.getElementById("wishlist-container");if(!L)return;let g=v.length,r=v.filter(l=>{let c=_(l);return c.salePrice&&c.salePrice<c.price}).length,s=v.filter(l=>{let c=_(l);return c.priceAtAdd&&c.price<c.priceAtAdd}).length,i=v.filter(l=>{let c=_(l);return c.targetPrice&&c.price<=c.targetPrice}).length;if(g===0){L.innerHTML=`
                <div class="text-center py-16">
                    <svg class="w-24 h-24 text-gray-300 mx-auto mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/>
                    </svg>
                    <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">Your wishlist is empty</h2>
                    <p class="text-gray-600 dark:text-gray-400 mb-8">Start adding items you love to your wishlist.</p>
                    <a href="/products/" class="inline-flex items-center px-6 py-3 bg-primary-600 text-white font-semibold rounded-lg hover:bg-primary-700 transition-colors">
                        Browse Products
                    </a>
                </div>
            `;return}if(L.innerHTML=`
            <!-- Header with Stats -->
            <div class="mb-6">
                <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">My Wishlist</h1>
                        <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">${g} items saved</p>
                    </div>
                    <div class="flex flex-wrap gap-2">
                        <button id="add-all-to-cart-btn" class="px-4 py-2 bg-primary-600 text-white text-sm font-medium rounded-lg hover:bg-primary-700 transition-colors flex items-center">
                            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path>
                            </svg>
                            Add All to Cart
                        </button>
                        <button id="share-wishlist-btn" class="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 text-sm font-medium rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors flex items-center">
                            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"></path>
                            </svg>
                            Share
                        </button>
                        <button id="clear-wishlist-btn" class="px-4 py-2 text-red-600 dark:text-red-400 text-sm font-medium hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors">
                            Clear All
                        </button>
                    </div>
                </div>
                
                <!-- Quick Stats -->
                <div class="mt-4 grid grid-cols-2 md:grid-cols-4 gap-3">
                    <div class="bg-white dark:bg-gray-800 rounded-lg p-3 border border-gray-200 dark:border-gray-700">
                        <div class="text-2xl font-bold text-gray-900 dark:text-white">${g}</div>
                        <div class="text-xs text-gray-500 dark:text-gray-400">Total Items</div>
                    </div>
                    <div class="bg-white dark:bg-gray-800 rounded-lg p-3 border border-gray-200 dark:border-gray-700 ${r>0?"ring-2 ring-green-500":""}">
                        <div class="text-2xl font-bold text-green-600 dark:text-green-400">${r}</div>
                        <div class="text-xs text-gray-500 dark:text-gray-400">On Sale</div>
                    </div>
                    <div class="bg-white dark:bg-gray-800 rounded-lg p-3 border border-gray-200 dark:border-gray-700 ${s>0?"ring-2 ring-blue-500":""}">
                        <div class="text-2xl font-bold text-blue-600 dark:text-blue-400">${s}</div>
                        <div class="text-xs text-gray-500 dark:text-gray-400">Price Dropped</div>
                    </div>
                    <div class="bg-white dark:bg-gray-800 rounded-lg p-3 border border-gray-200 dark:border-gray-700 ${i>0?"ring-2 ring-amber-500":""}">
                        <div class="text-2xl font-bold text-amber-600 dark:text-amber-400">${i}</div>
                        <div class="text-xs text-gray-500 dark:text-gray-400">At Target Price</div>
                    </div>
                </div>
            </div>
            
            <!-- Filters and Sort -->
            <div class="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                <div class="flex flex-wrap gap-2">
                    <button class="filter-btn px-3 py-1.5 text-sm rounded-lg transition-colors ${t==="all"?"bg-primary-600 text-white":"bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300"}" data-filter="all">All</button>
                    <button class="filter-btn px-3 py-1.5 text-sm rounded-lg transition-colors ${t==="on_sale"?"bg-primary-600 text-white":"bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300"}" data-filter="on_sale">On Sale</button>
                    <button class="filter-btn px-3 py-1.5 text-sm rounded-lg transition-colors ${t==="in_stock"?"bg-primary-600 text-white":"bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300"}" data-filter="in_stock">In Stock</button>
                    <button class="filter-btn px-3 py-1.5 text-sm rounded-lg transition-colors ${t==="price_drop"?"bg-primary-600 text-white":"bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300"}" data-filter="price_drop">Price Drop</button>
                    <button class="filter-btn px-3 py-1.5 text-sm rounded-lg transition-colors ${t==="at_target"?"bg-primary-600 text-white":"bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300"}" data-filter="at_target">At Target</button>
                </div>
                <div class="flex items-center gap-2">
                    <label class="text-sm text-gray-500 dark:text-gray-400">Sort:</label>
                    <select id="wishlist-sort" class="text-sm border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 focus:ring-primary-500 focus:border-primary-500">
                        <option value="added_desc" ${e==="added_desc"?"selected":""}>Newest First</option>
                        <option value="added_asc" ${e==="added_asc"?"selected":""}>Oldest First</option>
                        <option value="price_asc" ${e==="price_asc"?"selected":""}>Price: Low to High</option>
                        <option value="price_desc" ${e==="price_desc"?"selected":""}>Price: High to Low</option>
                        <option value="priority" ${e==="priority"?"selected":""}>Priority</option>
                        <option value="name" ${e==="name"?"selected":""}>Name A-Z</option>
                    </select>
                </div>
            </div>
            
            <!-- Items Grid -->
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                ${E.map(l=>Y(l)).join("")}
            </div>
            
            ${E.length===0&&g>0?`
                <div class="text-center py-12">
                    <p class="text-gray-500 dark:text-gray-400">No items match the selected filter.</p>
                    <button class="mt-4 text-primary-600 hover:underline" onclick="document.querySelector('[data-filter=all]').click()">Show all items</button>
                </div>
            `:""}
            
            ${S.total_pages>1?'<div id="wishlist-pagination" class="mt-8"></div>':""}
        `,S&&S.total_pages>1){let l=document.getElementById("wishlist-pagination");if(l&&window.Pagination){let c=new window.Pagination({totalPages:S.total_pages,currentPage:S.current_page||n,className:"justify-center",onChange:h=>{n=h,q(),window.scrollTo({top:0,behavior:"smooth"})}});l.innerHTML="",l.appendChild(c.create())}}y()}function Y(E){try{let v=E.product||E||{},S=E.product_name||v.name||"",L=E.product_slug||v.slug||"",g=E.is_in_stock!==void 0?E.is_in_stock:v.is_in_stock!==void 0?v.is_in_stock:v.stock_quantity>0,r=k(E||{}),s=!!E.product_has_variants,i={price:0,salePrice:null,lowestPrice:null,highestPrice:null,targetPrice:null,priceAtAdd:null};try{i=_(E||{})}catch{i={price:0,salePrice:null}}let{price:l,salePrice:c,lowestPrice:h,highestPrice:u,targetPrice:f,priceAtAdd:I}=i,T=c||l,z=I&&T<I,V=I?Math.round((T-I)/I*100):0,C=f&&T<=f,B=c&&c<l,W=E.priority||"normal",O=p.PRIORITY_LEVELS[W]||p.PRIORITY_LEVELS.normal,P=se=>{try{return Templates.escapeHtml(se||"")}catch{return String(se||"")}},X=se=>{try{return Price.render({price:se.price,salePrice:se.salePrice})}catch{return`<span class="font-bold">${p.CURRENCY_SYMBOL}${se.price||0}</span>`}},ee=se=>{try{return Templates.formatPrice(se)}catch{return`${p.CURRENCY_SYMBOL}${se}`}},re=v&&v.aspect&&(v.aspect.css||(v.aspect.width&&v.aspect.height?`${v.aspect.width}/${v.aspect.height}`:null))||"1/1";return`
                <div class="wishlist-item relative bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden group" 
                     data-item-id="${E&&E.id?E.id:""}" 
                     data-product-id="${v&&v.id?v.id:E&&E.product?E.product:""}" 
                     data-product-slug="${P(L)}" 
                     data-product-has-variants="${s}"
                     data-priority="${W}">
                    
                    <!-- Image Section -->
                    <div class="relative" style="aspect-ratio: ${re};">
                        <!-- Badges -->
                        <div class="absolute top-2 left-2 z-10 flex flex-col gap-1">
                            ${B?`
                                <div class="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
                                    -${Math.round((1-c/l)*100)}%
                                </div>
                            `:""}
                            ${z?`
                                <div class="bg-blue-500 text-white text-xs font-bold px-2 py-1 rounded flex items-center">
                                    <svg class="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
                                    </svg>
                                    ${Math.abs(V)}% drop
                                </div>
                            `:""}
                            ${C?`
                                <div class="bg-amber-500 text-white text-xs font-bold px-2 py-1 rounded flex items-center">
                                    <svg class="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                                    </svg>
                                    Target!
                                </div>
                            `:""}
                            ${g?"":`
                                <div class="bg-gray-800 text-white text-xs font-bold px-2 py-1 rounded">
                                    Out of Stock
                                </div>
                            `}
                        </div>
                        
                        <!-- Priority Indicator -->
                        <div class="absolute top-2 right-12 z-10">
                            <button class="priority-btn w-8 h-8 rounded-full bg-white dark:bg-gray-700 shadow-md flex items-center justify-center text-${O.color}-500 hover:scale-110 transition-transform" title="Priority: ${O.label}" data-item-id="${E.id}">
                                <span class="text-sm">${O.icon}</span>
                            </button>
                        </div>
                        
                        <!-- Remove Button -->
                        <button class="remove-btn absolute top-2 right-2 z-20 w-8 h-8 bg-gray-900/80 text-white rounded-full shadow-lg flex items-center justify-center hover:bg-red-600 transition-colors opacity-0 group-hover:opacity-100" aria-label="Remove from wishlist">
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                            </svg>
                        </button>
                        
                        <!-- Product Image -->
                        <a href="/products/${P(L)}/">
                            ${r?`
                                <img 
                                    src="${r}" 
                                    alt="${P(S)}"
                                    class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                    loading="lazy"
                                >
                            `:`
                                <div class="w-full h-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-gray-400 dark:text-gray-500 text-xs uppercase tracking-wide">No Image</div>
                            `}
                        </a>
                    </div>
                    
                    <!-- Content Section -->
                    <div class="p-4">
                        ${v&&v.category?`
                            <a href="/categories/${P(v.category.slug)}/" class="text-xs text-gray-500 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400">
                                ${P(v.category.name)}
                            </a>
                        `:""}
                        <h3 class="font-medium text-gray-900 dark:text-white mt-1 line-clamp-2">
                            <a href="/products/${P(L)}/" class="hover:text-primary-600 dark:hover:text-primary-400">
                                ${P(S)}
                            </a>
                        </h3>
                        
                        <!-- Price Section -->
                        <div class="mt-2">
                            ${X({price:l,salePrice:c})}
                        </div>
                        
                        <!-- Price History -->
                        ${h||f?`
                            <div class="mt-2 text-xs space-y-1">
                                ${h?`
                                    <div class="flex items-center justify-between text-gray-500 dark:text-gray-400">
                                        <span>Lowest:</span>
                                        <span class="font-medium text-green-600 dark:text-green-400">${ee(h)}</span>
                                    </div>
                                `:""}
                                ${f?`
                                    <div class="flex items-center justify-between text-gray-500 dark:text-gray-400">
                                        <span>Target:</span>
                                        <span class="font-medium text-amber-600 dark:text-amber-400">${ee(f)}</span>
                                    </div>
                                `:""}
                            </div>
                        `:""}
                        
                        <!-- Rating -->
                        ${v&&v.average_rating?`
                            <div class="flex items-center gap-1 mt-2">
                                ${Templates.renderStars(v.average_rating)}
                                <span class="text-xs text-gray-500 dark:text-gray-400">(${v.review_count||0})</span>
                            </div>
                        `:""}
                        
                        <!-- Actions -->
                        <div class="mt-4 flex gap-2">
                            <button 
                                class="add-to-cart-btn flex-1 px-3 py-2 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors text-sm flex items-center justify-center"
                                ${g?"":"disabled"}
                            >
                                <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path>
                                </svg>
                                ${s?"Options":g?"Add":"Sold Out"}
                            </button>
                            <button class="set-target-btn px-3 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-sm" title="Set target price" data-item-id="${E.id}" data-current-price="${T}">
                                <svg class="w-4 h-4" fill="${f?"currentColor":"none"}" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path>
                                </svg>
                            </button>
                        </div>
                    </div>
                    
                    <!-- Added Date -->
                    ${E&&E.added_at?`
                        <div class="px-4 pb-3 border-t border-gray-100 dark:border-gray-700 pt-3">
                            <p class="text-xs text-gray-400 dark:text-gray-500">Added ${Templates.formatDate(E.added_at)}</p>
                        </div>
                    `:""}
                </div>
            `}catch(v){return console.error("Failed to render wishlist item:",v),'<div class="p-4 bg-white dark:bg-gray-800 rounded shadow text-gray-500 dark:text-gray-400">Failed to render item</div>'}}function j(){document.getElementById("wishlist-sort")?.addEventListener("change",E=>{e=E.target.value,q()}),document.querySelectorAll(".filter-btn").forEach(E=>{E.addEventListener("click",()=>{t=E.dataset.filter,q()})})}function y(){let E=document.getElementById("clear-wishlist-btn"),v=document.getElementById("add-all-to-cart-btn"),S=document.getElementById("share-wishlist-btn"),L=document.querySelectorAll(".wishlist-item"),g=document.getElementById("wishlist-sort"),r=document.querySelectorAll(".filter-btn");g?.addEventListener("change",s=>{e=s.target.value,q()}),r.forEach(s=>{s.addEventListener("click",()=>{t=s.dataset.filter,q()})}),E?.addEventListener("click",async()=>{if(await Modal.confirm({title:"Clear Wishlist",message:"Are you sure you want to remove all items from your wishlist?",confirmText:"Clear All",cancelText:"Cancel"}))try{await WishlistApi.clear(),Toast.success("Wishlist cleared."),await q()}catch(i){Toast.error(i.message||"Failed to clear wishlist.")}}),v?.addEventListener("click",async()=>{let s=v;s.disabled=!0,s.innerHTML='<svg class="animate-spin w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>Adding...';try{let i=document.querySelectorAll('.wishlist-item:not([data-product-has-variants="true"])'),l=0,c=0;for(let h of i){let u=h.dataset.productId;if(u)try{await CartApi.addItem(u,1),l++}catch{c++}}l>0&&(Toast.success(`Added ${l} items to cart!`),document.dispatchEvent(new CustomEvent("cart:updated"))),c>0&&Toast.warning(`${c} items could not be added (may require variant selection).`)}catch(i){Toast.error(i.message||"Failed to add items to cart.")}finally{s.disabled=!1,s.innerHTML='<svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>Add All to Cart'}}),S?.addEventListener("click",async()=>{try{let s=`${window.location.origin}/wishlist/share/`;navigator.share?await navigator.share({title:"My Wishlist",text:"Check out my wishlist!",url:s}):(await navigator.clipboard.writeText(s),Toast.success("Wishlist link copied to clipboard!"))}catch(s){s.name!=="AbortError"&&Toast.error("Failed to share wishlist.")}}),L.forEach(s=>{let i=s.dataset.itemId,l=s.dataset.productId,c=s.dataset.productSlug;s.querySelector(".remove-btn")?.addEventListener("click",async()=>{try{await WishlistApi.removeItem(i),Toast.success("Removed from wishlist."),s.remove(),document.querySelectorAll(".wishlist-item").length===0&&await q()}catch(h){Toast.error(h.message||"Failed to remove item.")}}),s.querySelector(".priority-btn")?.addEventListener("click",async()=>{let h=["low","normal","high","urgent"],u=s.dataset.priority||"normal",f=h.indexOf(u),I=h[(f+1)%h.length];try{WishlistApi.updateItem&&await WishlistApi.updateItem(i,{priority:I}),s.dataset.priority=I;let T=s.querySelector(".priority-btn"),z=p.PRIORITY_LEVELS[I];T.title=`Priority: ${z.label}`,T.innerHTML=`<span class="text-sm">${z.icon}</span>`,T.className=`priority-btn w-8 h-8 rounded-full bg-white dark:bg-gray-700 shadow-md flex items-center justify-center text-${z.color}-500 hover:scale-110 transition-transform`,Toast.success(`Priority set to ${z.label}`)}catch{Toast.error("Failed to update priority.")}}),s.querySelector(".set-target-btn")?.addEventListener("click",async()=>{let h=parseFloat(s.querySelector(".set-target-btn").dataset.currentPrice)||0,u=`
                    <div class="space-y-4">
                        <p class="text-sm text-gray-600 dark:text-gray-400">Set a target price and we'll notify you when the item drops to or below this price.</p>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Current Price</label>
                            <div class="text-lg font-bold text-gray-900 dark:text-white">${p.CURRENCY_SYMBOL}${h.toLocaleString()}</div>
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Target Price</label>
                            <div class="flex items-center">
                                <span class="text-gray-500 mr-2">${p.CURRENCY_SYMBOL}</span>
                                <input type="number" id="target-price-input" value="${Math.round(h*.9)}" min="1" max="${h}" class="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-primary-500 focus:border-primary-500">
                            </div>
                            <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">Suggested: ${p.CURRENCY_SYMBOL}${Math.round(h*.9).toLocaleString()} (10% off)</p>
                        </div>
                    </div>
                `,f=await Modal.open({title:"Set Target Price",content:u,confirmText:"Set Alert",cancelText:"Cancel",onConfirm:async()=>{let I=parseFloat(document.getElementById("target-price-input").value);if(!I||I<=0)return Toast.error("Please enter a valid target price."),!1;try{return WishlistApi.updateItem&&await WishlistApi.updateItem(i,{target_price:I}),Toast.success(`Price alert set for ${p.CURRENCY_SYMBOL}${I.toLocaleString()}`),await q(),!0}catch{return Toast.error("Failed to set price alert."),!1}}})}),s.querySelector(".add-to-cart-btn")?.addEventListener("click",async h=>{let u=h.target.closest(".add-to-cart-btn");if(u.disabled)return;u.disabled=!0;let f=u.innerHTML;if(u.innerHTML='<svg class="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>',s.dataset.productHasVariants==="true"||s.dataset.productHasVariants==="True"||s.dataset.productHasVariants==="1"){D(s),u.disabled=!1,u.innerHTML=f;return}try{await CartApi.addItem(l,1),Toast.success("Added to cart!"),document.dispatchEvent(new CustomEvent("cart:updated"))}catch(T){if(!!(T&&(T.errors&&T.errors.variant_id||T.message&&typeof T.message=="string"&&T.message.toLowerCase().includes("variant")))&&(Toast.info("This product requires selecting a variant."),c)){window.location.href=`/products/${c}/`;return}Toast.error(T.message||"Failed to add to cart.")}finally{u.disabled=!1,u.innerHTML=f}})})}function M(E){let v={};return E.forEach(S=>{v[S.attribute_name]||(v[S.attribute_name]=[]),v[S.attribute_name].push(S)}),Object.entries(v).map(([S,L])=>`
            <div class="mt-4">
                <label class="text-sm font-medium text-gray-700">${Templates.escapeHtml(S)}:</label>
                <div class="flex flex-wrap gap-2 mt-2" id="wishlist-variant-group-${Templates.slugify(S)}">
                    ${L.map((g,r)=>`
                        <button type="button" class="wishlist-modal-variant-btn px-3 py-2 border rounded-lg text-sm transition-colors ${r===0?"border-primary-500 bg-primary-50 text-primary-700":"border-gray-300 hover:border-gray-400"}" data-variant-id="${g.id}" data-price="${g.price_converted??g.price??""}" data-stock="${g.stock_quantity||0}">
                            ${Templates.escapeHtml(g.value)}
                            ${g.price_converted??g.price?`<span class="text-xs text-gray-500"> (${Templates.formatPrice(g.price_converted??g.price)})</span>`:""}
                        </button>
                    `).join("")}
                </div>
            </div>
        `).join("")}async function D(E){let v=E.product_slug||E.dataset?.productSlug||"",S=E.product||E.dataset?.productId||"";try{let L;if(typeof ProductsApi<"u"&&ProductsApi.getProduct)L=await ProductsApi.getProduct(v||S);else{let c=window.BUNORAA_CURRENCY&&window.BUNORAA_CURRENCY.code||void 0;L=await ApiClient.get(`/catalog/products/${v||S}/`,{currency:c})}if(!L||!L.success||!L.data){let c=L&&L.message?L.message:"Failed to load product variants.";Toast.error(c);return}let g=L.data,r=g.variants||[];if(!r.length){window.location.href=`/products/${g.slug||v||S}/`;return}let s=g.images?.[0]?.image||g.primary_image||g.image||"",i=`
                <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div class="col-span-1">
                        ${s?`<img src="${s}" class="w-full h-48 object-cover rounded" alt="${Templates.escapeHtml(g.name)}">`:'<div class="w-full h-48 bg-gray-100 rounded"></div>'}
                    </div>
                    <div class="col-span-2">
                        <h3 class="text-lg font-semibold">${Templates.escapeHtml(g.name)}</h3>
                        <div id="wishlist-variant-price" class="mt-2 text-lg font-bold">${Templates.formatPrice(r?.[0]?.price_converted??r?.[0]?.price??g.price)}</div>
                        <div id="wishlist-variant-options" class="mt-4">
                            ${M(r)}
                        </div>
                        <div class="mt-4 flex items-center gap-2">
                            <label class="text-sm text-gray-700">Qty</label>
                            <input id="wishlist-variant-qty" type="number" value="1" min="1" class="w-20 px-3 py-2 border rounded" />
                        </div>
                    </div>
                </div>
            `,l=await Modal.open({title:"Select Variant",content:i,confirmText:"Add to Cart",cancelText:"Cancel",size:"md",onConfirm:async()=>{let h=document.querySelector(".wishlist-modal-variant-btn.border-primary-500")||document.querySelector(".wishlist-modal-variant-btn");if(!h)return Toast.error("Please select a variant."),!1;let u=h.dataset.variantId,f=parseInt(document.getElementById("wishlist-variant-qty")?.value)||1;try{return await CartApi.addItem(g.id,f,u),Toast.success("Added to cart!"),document.dispatchEvent(new CustomEvent("cart:updated")),!0}catch(I){return Toast.error(I.message||"Failed to add to cart."),!1}}});setTimeout(()=>{let c=document.querySelectorAll(".wishlist-modal-variant-btn");c.forEach(u=>{u.addEventListener("click",()=>{c.forEach(I=>I.classList.remove("border-primary-500","bg-primary-50","text-primary-700")),u.classList.add("border-primary-500","bg-primary-50","text-primary-700");let f=u.dataset.price;if(f!==void 0){let I=document.getElementById("wishlist-variant-price");I&&(I.textContent=Templates.formatPrice(f))}})});let h=document.querySelector(".wishlist-modal-variant-btn");h&&h.click()},20)}catch{Toast.error("Failed to load variants.")}}function A(){n=1}return{init:b,destroy:A}})();window.WishlistPage=Ws;xr=Ws});var br,Ye=Q(()=>{br=Ge({"./pages/account.js":()=>Promise.resolve().then(()=>(hs(),gs)),"./pages/cart.js":()=>Promise.resolve().then(()=>(bs(),xs)),"./pages/category.js":()=>Promise.resolve().then(()=>(ws(),ys)),"./pages/checkout.js":()=>Promise.resolve().then(()=>(Cs(),Es)),"./pages/contact.js":()=>Promise.resolve().then(()=>(Ts(),$s)),"./pages/faq.js":()=>Promise.resolve().then(()=>(Ss(),Bs)),"./pages/home.js":()=>Promise.resolve().then(()=>(Hs(),qs)),"./pages/orders.js":()=>Promise.resolve().then(()=>(Ns(),js)),"./pages/preorders.js":()=>Promise.resolve().then(()=>rr(Fs())),"./pages/product.js":()=>Promise.resolve().then(()=>(Rs(),Os)),"./pages/search.js":()=>Promise.resolve().then(()=>(Us(),Vs)),"./pages/wishlist.js":()=>Promise.resolve().then(()=>(Qs(),Ys))})});var vr=Je(()=>{ms();Ye();var Qe=(function(){"use strict";let n={},e=null,t=null;async function o(L){try{let g=await br(`./pages/${L}.js`);return g.default||g}catch{return null}}function p(){q(),R(),Y(),j(),b(),D(),E(),v();try{let L=performance.getEntriesByType?performance.getEntriesByType("navigation"):[],g=L&&L[0]||null;g&&g.type==="navigate"&&!window.location.hash&&setTimeout(()=>{let r=document.scrollingElement||document.documentElement;if(!r)return;let s=r.scrollTop||window.pageYOffset||0,i=Math.max(0,r.scrollHeight-window.innerHeight);s>Math.max(100,i*.6)&&window.scrollTo({top:0,behavior:"auto"})},60)}catch{}}async function b(){try{if(!AuthApi.isAuthenticated()){let s=localStorage.getItem("wishlist");if(s){let i=JSON.parse(s);WishlistApi.updateBadge(i);let l=i.items||i.data&&i.data.items||[];_(l)}else _([]);return}let g=(await WishlistApi.getWishlist({pageSize:200})).data||{},r=g.items||g.data||[];WishlistApi.updateBadge(g),_(r)}catch{try{let g=localStorage.getItem("wishlist");if(g){let r=JSON.parse(g);WishlistApi.updateBadge(r);let s=r.items||r.data&&r.data.items||[];_(s)}}catch{}}}let k=[];function _(L){try{k=L||[];let g={},r={};(L||[]).forEach(s=>{let i=s.product||s.product_id||s.product&&s.product.id||null,l=s.product_slug||s.product&&s.product.slug||null,c=s.id||s.pk||s.uuid||s.item||null;i&&(g[String(i)]=c||!0),l&&(r[String(l)]=c||!0)}),document.querySelectorAll(".wishlist-btn").forEach(s=>{try{let i=s.querySelector("svg"),l=i?.querySelector(".heart-fill"),c=s.dataset.productId||s.closest("[data-product-id]")?.dataset.productId,h=s.dataset.productSlug||s.closest("[data-product-slug]")?.dataset.productSlug,u=null;c&&g.hasOwnProperty(String(c))?u=g[String(c)]:h&&r.hasOwnProperty(String(h))&&(u=r[String(h)]),u?(s.dataset.wishlistItemId=u,s.classList.add("text-red-500"),s.setAttribute("aria-pressed","true"),i?.classList.add("fill-current"),l&&(l.style.opacity="1")):(s.removeAttribute("data-wishlist-item-id"),s.classList.remove("text-red-500"),s.setAttribute("aria-pressed","false"),i?.classList.remove("fill-current"),l&&(l.style.opacity="0"))}catch{}})}catch{}}(function(){if(typeof MutationObserver>"u")return;let L=null;new MutationObserver(function(r){let s=!1;for(let i of r){if(i.addedNodes&&i.addedNodes.length){for(let l of i.addedNodes)if(l.nodeType===1&&(l.matches?.(".product-card")||l.querySelector?.(".product-card")||l.querySelector?.(".wishlist-btn"))){s=!0;break}}if(s)break}s&&(clearTimeout(L),L=setTimeout(()=>{try{_(k)}catch{}},150))}).observe(document.body,{childList:!0,subtree:!0})})();function q(){let L=window.location.pathname,g=document.body;if(g.dataset.page){e=g.dataset.page;return}if((L.startsWith("/accounts/")||L.startsWith("/account/"))&&!(L.startsWith("/accounts/profile")||L.startsWith("/account/profile"))){e=null;return}L==="/"||L==="/home/"?e="home":L==="/categories/"||L==="/products/"?e="search":L.startsWith("/categories/")&&L!=="/categories/"?e="category":L.startsWith("/products/")&&L!=="/products/"?e="product":L==="/search/"||L.startsWith("/search")?e="search":L.startsWith("/cart")?e="cart":L.startsWith("/checkout")?e="checkout":L==="/account"||L.startsWith("/account/")||L.startsWith("/accounts/profile")?e="account":L.startsWith("/orders")?e="orders":L.startsWith("/wishlist")?e="wishlist":L.startsWith("/contact")&&(e="contact")}function R(){typeof Tabs<"u"&&document.querySelector("[data-tabs]")&&Tabs.init(),typeof Dropdown<"u"&&document.querySelectorAll("[data-dropdown-trigger]").forEach(L=>{let g=L.dataset.dropdownTarget,r=document.getElementById(g);r&&Dropdown.create(L,{content:r.innerHTML})});try{us()}catch{}}async function Y(){if(!e)return;try{t&&typeof t.destroy=="function"&&t.destroy()}catch{}let L=await o(e);if(L&&typeof L.init=="function"){t=L;try{await t.init()}catch(g){console.error("failed to init page controller",g)}}}try{"serviceWorker"in navigator&&navigator.serviceWorker.register("/static/js/sw.js").catch(()=>{})}catch{}async function j(){if(document.querySelectorAll("[data-cart-count]").length)try{let r=(await CartApi.getCart()).data?.item_count||0;try{localStorage.setItem("cart",JSON.stringify({item_count:r,savedAt:Date.now()}))}catch{}M(r)}catch{try{let r=localStorage.getItem("cart");if(r){let i=JSON.parse(r)?.item_count||0;M(i);return}}catch(r){console.error("Failed to get cart count fallback:",r)}}}async function y(L){try{return(((await WishlistApi.getWishlist({pageSize:200})).data||{}).items||[]).find(l=>String(l.product)===String(L))?.id||null}catch{return null}}function M(L){document.querySelectorAll("[data-cart-count]").forEach(r=>{r.textContent=L>99?"99+":L,r.classList.toggle("hidden",L===0)})}function D(){document.addEventListener("cart:updated",async()=>{await j()}),document.addEventListener("wishlist:updated",async()=>{await b()}),document.addEventListener("auth:login",()=>{A(!0)}),document.addEventListener("auth:logout",()=>{A(!1)}),document.querySelectorAll(".wishlist-btn").forEach(g=>{try{let r=g.querySelector("svg"),s=r?.querySelector(".heart-fill");g.classList.contains("text-red-500")?(r?.classList.add("fill-current"),s&&(s.style.opacity="1")):s&&(s.style.opacity="0")}catch{}}),document.addEventListener("click",async g=>{let r=g.target.closest("[data-quick-add], [data-add-to-cart], .add-to-cart-btn");if(r){g.preventDefault();let s=r.dataset.productId||r.dataset.quickAdd||r.dataset.addToCart;if(!s)return;r.disabled=!0;let i=r.innerHTML;r.innerHTML='<svg class="animate-spin h-4 w-4 mx-auto" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>';try{await CartApi.addItem(s,1),Toast.success("Added to cart!"),document.dispatchEvent(new CustomEvent("cart:updated"))}catch(l){Toast.error(l.message||"Failed to add to cart.")}finally{r.disabled=!1,r.innerHTML=i}}}),document.addEventListener("click",async g=>{let r=g.target.closest("[data-wishlist-toggle], .wishlist-btn");if(r){if(g.preventDefault(),!AuthApi.isAuthenticated()){Toast.warning("Please login to add items to your wishlist."),window.location.href="/account/login/?next="+encodeURIComponent(window.location.pathname);return}let s=r.dataset.wishlistToggle||r.dataset.productId||r.closest("[data-product-id]")?.dataset.productId;r.disabled=!0;let i=r.dataset.wishlistItemId||"";!i&&r.classList.contains("text-red-500")&&(i=await y(s)||"");let c=r.classList.contains("text-red-500")&&i;try{if(c){let h=await WishlistApi.removeItem(i);r.classList.remove("text-red-500"),r.setAttribute("aria-pressed","false"),r.querySelector("svg")?.classList.remove("fill-current");let u=r.querySelector("svg")?.querySelector(".heart-fill");u&&(u.style.opacity="0"),r.removeAttribute("data-wishlist-item-id"),Toast.success("Removed from wishlist.")}else{let h=await WishlistApi.addItem(s),u=h.data?.id||h.data?.item?.id||await y(s);u&&(r.dataset.wishlistItemId=u),r.classList.add("text-red-500"),r.setAttribute("aria-pressed","true"),r.querySelector("svg")?.classList.add("fill-current");let f=r.querySelector("svg")?.querySelector(".heart-fill");f&&(f.style.opacity="1"),Toast.success(h.message||"Added to wishlist!")}}catch(h){console.error("wishlist:error",h),Toast.error(h.message||"Failed to update wishlist.")}finally{r.disabled=!1}}}),document.addEventListener("click",g=>{let r=g.target.closest("[data-quick-view], .quick-view-btn");if(r){g.preventDefault();let s=r.dataset.quickView||r.dataset.productId,i=r.dataset.productSlug;i?window.location.href=`/products/${i}/`:s&&(typeof Modal<"u"&&Modal.showQuickView?Modal.showQuickView(s):window.location.href=`/products/${s}/`)}}),document.addEventListener("click",async g=>{if(g.target.closest("[data-logout]")){g.preventDefault();try{await AuthApi.logout(),Toast.success("Logged out successfully."),document.dispatchEvent(new CustomEvent("auth:logout")),window.location.href="/"}catch{Toast.error("Failed to logout.")}}});let L=document.getElementById("back-to-top");L&&(window.addEventListener("scroll",Debounce.throttle(()=>{window.scrollY>500?L.classList.remove("opacity-0","pointer-events-none"):L.classList.add("opacity-0","pointer-events-none")},100)),L.addEventListener("click",()=>{window.scrollTo({top:0,behavior:"smooth"})}))}function A(L){document.querySelectorAll("[data-auth-state]").forEach(r=>{let s=r.dataset.authState;s==="logged-in"?r.classList.toggle("hidden",!L):s==="logged-out"&&r.classList.toggle("hidden",L)})}function E(){let L=document.getElementById("mobile-menu-btn"),g=document.getElementById("close-mobile-menu"),r=document.getElementById("mobile-menu"),s=document.getElementById("mobile-menu-overlay");function i(){r?.classList.remove("translate-x-full"),s?.classList.remove("hidden"),document.body.classList.add("overflow-hidden")}function l(){r?.classList.add("translate-x-full"),s?.classList.add("hidden"),document.body.classList.remove("overflow-hidden")}L?.addEventListener("click",i),g?.addEventListener("click",l),s?.addEventListener("click",l)}function v(){let L=document.querySelector("[data-language-selector]"),g=document.getElementById("language-dropdown");L&&g&&(Dropdown.create(L,g),g.querySelectorAll("[data-language]").forEach(r=>{r.addEventListener("click",async()=>{let s=r.dataset.language;try{await LocalizationApi.setLanguage(s),Storage.set("language",s),window.location.reload()}catch{Toast.error("Failed to change language.")}})}))}function S(){t&&typeof t.destroy=="function"&&t.destroy(),e=null,t=null}return{init:p,destroy:S,getCurrentPage:()=>e,updateCartBadge:M}})();document.readyState==="loading"?document.addEventListener("DOMContentLoaded",Qe.init):Qe.init();window.App=Qe});vr();})();
//# sourceMappingURL=app.bundle.js.map
