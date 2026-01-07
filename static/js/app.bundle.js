(()=>{var Xs=Object.create;var pe=Object.defineProperty;var Ks=Object.getOwnPropertyDescriptor;var Zs=Object.getOwnPropertyNames;var er=Object.getPrototypeOf,tr=Object.prototype.hasOwnProperty;var Ge=a=>e=>{var t=a[e];if(t)return t();throw new Error("Module not found in bundle: "+e)};var Q=(a,e)=>()=>(a&&(e=a(a=0)),e);var Je=(a,e)=>()=>(e||a((e={exports:{}}).exports,e),e.exports),J=(a,e)=>{for(var t in e)pe(a,t,{get:e[t],enumerable:!0})},sr=(a,e,t,o)=>{if(e&&typeof e=="object"||typeof e=="function")for(let h of Zs(e))!tr.call(a,h)&&h!==t&&pe(a,h,{get:()=>e[h],enumerable:!(o=Ks(e,h))||o.enumerable});return a};var rr=(a,e,t)=>(t=a!=null?Xs(er(a)):{},sr(e||!a||!a.__esModule?pe(t,"default",{value:a,enumerable:!0}):t,a));function H(...a){return a.flat().filter(e=>e&&typeof e=="string").join(" ")}function F(a="div",{id:e="",className:t="",attrs:o={},html:h="",text:v=""}={}){let C=document.createElement(a);return e&&(C.id=e),t&&(C.className=t),v&&(C.textContent=v),h&&(C.innerHTML=h),Object.entries(o).forEach(([_,q])=>{q===!0?C.setAttribute(_,""):q!==!1&&q!==null&&C.setAttribute(_,q)}),C}function Xe(a,e,t,o={}){if(a)return a.addEventListener(e,t,o),()=>a.removeEventListener(e,t,o)}function ce(a){let e=a.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'),t=e[0],o=e[e.length-1];return{init(){a.addEventListener("keydown",h=>{h.key==="Tab"&&(h.shiftKey?document.activeElement===t&&(h.preventDefault(),o.focus()):document.activeElement===o&&(h.preventDefault(),t.focus()))})},destroy(){}}}function Ke(){return"id-"+Math.random().toString(36).substr(2,9)+Date.now().toString(36)}function ie(a=""){return F("div",{className:H("fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity duration-200",a),attrs:{"data-backdrop":"true"}})}var ue,K=Q(()=>{ue={isEnter:a=>a.key==="Enter",isEscape:a=>a.key==="Escape",isArrowUp:a=>a.key==="ArrowUp",isArrowDown:a=>a.key==="ArrowDown",isArrowLeft:a=>a.key==="ArrowLeft",isArrowRight:a=>a.key==="ArrowRight",isSpace:a=>a.key===" ",isTab:a=>a.key==="Tab"}});var z,Z=Q(()=>{K();z=class a{constructor(e={}){this.id=e.id||Ke(),this.element=null,this.listeners=[],this.isInitialized=!1,this.config=e}create(e="div",{className:t="",attrs:o={},html:h=""}={}){return this.element=F(e,{id:this.id,className:t,attrs:o,html:h}),this.element}mount(e){if(!this.element)return!1;let t=typeof e=="string"?document.querySelector(e):e;return t?(t.appendChild(this.element),this.isInitialized=!0,!0):!1}on(e,t,o={}){if(!this.element)return;let h=Xe(this.element,e,t,o);return this.listeners.push(h),h}delegate(e,t,o){if(!this.element)return;let h=v=>{let C=v.target.closest(e);C&&o.call(C,v)};this.element.addEventListener(t,h),this.listeners.push(()=>this.element.removeEventListener(t,h))}addClass(...e){this.element&&this.element.classList.add(...e)}removeClass(...e){this.element&&this.element.classList.remove(...e)}toggleClass(e,t){this.element&&this.element.classList.toggle(e,t)}hasClass(e){return this.element?.classList.contains(e)??!1}attr(e,t){if(this.element){if(t===void 0)return this.element.getAttribute(e);t===null||t===!1?this.element.removeAttribute(e):t===!0?this.element.setAttribute(e,""):this.element.setAttribute(e,t)}}attrs(e){Object.entries(e).forEach(([t,o])=>{this.attr(t,o)})}text(e){this.element&&(this.element.textContent=e)}html(e){this.element&&(this.element.innerHTML=e)}append(e){this.element&&e&&this.element.appendChild(e instanceof a?e.element:e)}prepend(e){this.element&&e&&this.element.prepend(e instanceof a?e.element:e)}show(){this.element&&(this.element.style.display="",this.element.removeAttribute("hidden"))}hide(){this.element&&(this.element.style.display="none")}toggle(e){this.element&&(e===void 0&&(e=this.element.style.display==="none"),e?this.show():this.hide())}getStyle(e){return this.element?window.getComputedStyle(this.element).getPropertyValue(e):null}setStyle(e,t){this.element&&(this.element.style[e]=t)}setStyles(e){Object.entries(e).forEach(([t,o])=>{this.setStyle(t,o)})}focus(e){if(this.element)try{typeof e>"u"?this.element.focus({preventScroll:!0}):this.element.focus(e)}catch{try{this.element.focus()}catch{}}}blur(){this.element&&this.element.blur()}getPosition(){return this.element?this.element.getBoundingClientRect():null}destroy(){this.listeners.forEach(e=>e?.()),this.listeners=[],this.element?.parentNode&&this.element.parentNode.removeChild(this.element),this.element=null,this.isInitialized=!1}init(){this.element&&!this.isInitialized&&(this.isInitialized=!0)}render(){return this.element}}});var Ze={};J(Ze,{Alert:()=>ge});var ge,et=Q(()=>{Z();K();ge=class extends z{constructor(e={}){super(e),this.title=e.title||"",this.message=e.message||"",this.type=e.type||"default",this.icon=e.icon||null,this.closeable=e.closeable||!1,this.className=e.className||""}create(){let e={default:{bg:"bg-blue-50",border:"border-blue-200",title:"text-blue-900",message:"text-blue-800",icon:"\u24D8"},success:{bg:"bg-green-50",border:"border-green-200",title:"text-green-900",message:"text-green-800",icon:"\u2713"},warning:{bg:"bg-yellow-50",border:"border-yellow-200",title:"text-yellow-900",message:"text-yellow-800",icon:"\u26A0"},error:{bg:"bg-red-50",border:"border-red-200",title:"text-red-900",message:"text-red-800",icon:"\u2715"},info:{bg:"bg-cyan-50",border:"border-cyan-200",title:"text-cyan-900",message:"text-cyan-800",icon:"\u2139"}},t=e[this.type]||e.default,h=super.create("div",{className:H("p-4 rounded-lg border-2",t.bg,t.border,this.className),attrs:{role:"alert"}}),v="";return(this.title||this.icon)&&(v+='<div class="flex items-center gap-3 mb-2">',this.icon,v+=`<span class="text-xl font-bold ${t.title}">${this.icon||t.icon}</span>`,this.title&&(v+=`<h4 class="font-semibold ${t.title}">${this.title}</h4>`),v+="</div>"),this.message&&(v+=`<p class="${t.message}">${this.message}</p>`),this.closeable&&(v+='<button class="absolute top-4 right-4 text-gray-400 hover:text-gray-600" aria-label="Close alert">\xD7</button>'),h.innerHTML=v,this.closeable&&h.querySelector("button")?.addEventListener("click",()=>{this.destroy()}),h}setMessage(e){if(this.message=e,this.element){let t=this.element.querySelector("p");t&&(t.textContent=e)}}}});var tt={};J(tt,{AlertDialog:()=>he});var he,st=Q(()=>{Z();K();he=class extends z{constructor(e={}){super(e),this.title=e.title||"",this.message=e.message||"",this.confirmText=e.confirmText||"Confirm",this.cancelText=e.cancelText||"Cancel",this.type=e.type||"warning",this.onConfirm=e.onConfirm||null,this.onCancel=e.onCancel||null,this.open=e.open||!1}create(){let e=super.create("div",{className:H("fixed inset-0 z-50 flex items-center justify-center",this.open?"":"hidden"),attrs:{role:"alertdialog","aria-modal":"true","aria-labelledby":`${this.id}-title`,"aria-describedby":`${this.id}-message`}}),t=ie();e.appendChild(t);let o=document.createElement("div");o.className="bg-white rounded-lg shadow-lg relative z-50 w-full max-w-md mx-4";let h=document.createElement("div");h.className="px-6 py-4 border-b border-gray-200";let v=document.createElement("h2");v.id=`${this.id}-title`,v.className="text-lg font-semibold text-gray-900",v.textContent=this.title,h.appendChild(v),o.appendChild(h);let C=document.createElement("div");C.id=`${this.id}-message`,C.className="px-6 py-4 text-gray-700",C.textContent=this.message,o.appendChild(C);let _=document.createElement("div");_.className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex gap-3 justify-end rounded-b-lg";let q=document.createElement("button");q.className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100 transition-colors duration-200",q.textContent=this.cancelText,q.addEventListener("click",()=>this.handleCancel()),_.appendChild(q);let R=document.createElement("button"),Y=this.type==="danger"?"bg-red-600 text-white hover:bg-red-700":"bg-blue-600 text-white hover:bg-blue-700";return R.className=H("px-4 py-2 rounded-md transition-colors duration-200",Y),R.textContent=this.confirmText,R.addEventListener("click",()=>this.handleConfirm()),_.appendChild(R),o.appendChild(_),e.appendChild(o),this.focusTrap=ce(o),e}open(){this.element||this.create(),this.open=!0,this.element.classList.remove("hidden"),this.focusTrap.init(),document.body.style.overflow="hidden"}close(){this.open=!1,this.element?.classList.add("hidden"),document.body.style.overflow=""}handleConfirm(){this.onConfirm&&this.onConfirm(),this.close()}handleCancel(){this.onCancel&&this.onCancel(),this.close()}}});var rt={};J(rt,{Avatar:()=>fe});var fe,at=Q(()=>{Z();K();fe=class extends z{constructor(e={}){super(e),this.src=e.src||"",this.alt=e.alt||"",this.initials=e.initials||"",this.size=e.size||"md",this.className=e.className||"",this.fallbackBg=e.fallbackBg||"bg-blue-600"}create(){let e={xs:"w-6 h-6 text-xs",sm:"w-8 h-8 text-sm",md:"w-10 h-10 text-base",lg:"w-12 h-12 text-lg",xl:"w-16 h-16 text-xl"},t="rounded-full overflow-hidden flex items-center justify-center flex-shrink-0 font-semibold";return this.src?super.create("img",{className:H(t,e[this.size],this.className),attrs:{src:this.src,alt:this.alt,role:"img"}}):this.initials?super.create("div",{className:H(t,e[this.size],"text-white",this.fallbackBg,this.className),text:this.initials.toUpperCase()}):super.create("div",{className:H(t,e[this.size],"bg-gray-300",this.className),html:'<svg class="w-full h-full text-gray-500" fill="currentColor" viewBox="0 0 24 24"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>'})}setSrc(e,t=""){this.src=e,this.alt=t,this.element&&this.element.tagName==="IMG"&&(this.element.src=e,this.element.alt=t)}setInitials(e,t=""){if(this.initials=e,t&&(this.fallbackBg=t),this.element&&(this.element.textContent=e.toUpperCase(),t&&this.element.className.includes("bg-"))){let o=this.element.className.match(/bg-\S+/)[0];this.element.classList.remove(o),this.element.classList.add(t)}}}});var nt={};J(nt,{Badge:()=>xe});var xe,ot=Q(()=>{Z();K();xe=class extends z{constructor(e={}){super(e),this.label=e.label||"Badge",this.variant=e.variant||"default",this.size=e.size||"md",this.className=e.className||""}create(){let e="inline-flex items-center rounded font-semibold whitespace-nowrap",t={default:"bg-gray-100 text-gray-800",primary:"bg-blue-100 text-blue-800",success:"bg-green-100 text-green-800",warning:"bg-yellow-100 text-yellow-800",destructive:"bg-red-100 text-red-800",outline:"border border-gray-300 text-gray-700"},o={sm:"px-2 py-1 text-xs",md:"px-3 py-1 text-sm",lg:"px-4 py-2 text-base"},h=super.create("span",{className:H(e,t[this.variant],o[this.size],this.className)});return h.textContent=this.label,h}setLabel(e){this.label=e,this.element&&(this.element.textContent=e)}}});var it={};J(it,{Button:()=>ve});var ve,lt=Q(()=>{Z();K();ve=class extends z{constructor(e={}){super(e),this.label=e.label||"Button",this.variant=e.variant||"default",this.size=e.size||"md",this.disabled=e.disabled||!1,this.onClick=e.onClick||null,this.className=e.className||""}create(){let e="px-4 py-2 font-medium rounded transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-offset-2",t={default:"bg-gray-200 text-gray-900 hover:bg-gray-300",primary:"bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500",secondary:"bg-green-600 text-white hover:bg-green-700 focus:ring-green-500",destructive:"bg-red-600 text-white hover:bg-red-700 focus:ring-red-500",outline:"border-2 border-gray-300 text-gray-900 hover:bg-gray-50",ghost:"text-gray-900 hover:bg-gray-100"},o={sm:"px-2 py-1 text-sm",md:"px-4 py-2 text-base",lg:"px-6 py-3 text-lg"},h=super.create("button",{className:H(e,t[this.variant],o[this.size],this.className),attrs:{disabled:this.disabled}});return h.textContent=this.label,this.onClick&&this.on("click",this.onClick),h}setLabel(e){this.label=e,this.element&&(this.element.textContent=e)}setDisabled(e){this.disabled=e,this.attr("disabled",e?"":null)}setLoading(e){this.setDisabled(e),e?this.html('<span class="flex items-center gap-2"><span class="inline-block w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></span>Loading...</span>'):this.text(this.label)}}});var dt={};J(dt,{ButtonGroup:()=>be});var be,ct=Q(()=>{Z();K();be=class extends z{constructor(e={}){super(e),this.buttons=e.buttons||[],this.orientation=e.orientation||"horizontal",this.size=e.size||"md",this.className=e.className||""}create(){let e=this.orientation==="vertical"?"flex-col":"flex-row",o=super.create("div",{className:H("flex",e,"inline-flex border border-gray-300 rounded-md overflow-hidden",this.className),attrs:{role:"group"}});return this.buttons.forEach((h,v)=>{let C=document.createElement("button");C.textContent=h.label||"Button",C.className=H("px-4 py-2 font-medium text-gray-700 hover:bg-gray-50 transition-colors duration-200",v>0?this.orientation==="vertical"?"border-t border-gray-300":"border-l border-gray-300":"",h.disabled?"opacity-50 cursor-not-allowed":""),C.disabled=h.disabled||!1,h.onClick&&C.addEventListener("click",h.onClick),o.appendChild(C)}),o}addButton(e,t){if(this.element){let o=document.createElement("button");o.textContent=e,o.className=H("px-4 py-2 font-medium text-gray-700 hover:bg-gray-50 transition-colors duration-200 border-l border-gray-300"),t&&o.addEventListener("click",t),this.element.appendChild(o)}}}});var ut={};J(ut,{Breadcrumb:()=>ye});var ye,mt=Q(()=>{Z();K();ye=class extends z{constructor(e={}){super(e),this.items=e.items||[],this.className=e.className||""}create(){let t=super.create("nav",{className:H("flex items-center gap-2",this.className),attrs:{"aria-label":"Breadcrumb"}});return this.items.forEach((o,h)=>{if(h>0){let v=F("span",{className:"text-gray-400 mx-1",text:"/"});t.appendChild(v)}if(h===this.items.length-1){let v=F("span",{className:"text-gray-700 font-medium",text:o.label,attrs:{"aria-current":"page"}});t.appendChild(v)}else{let v=F("a",{className:"text-blue-600 hover:text-blue-800 hover:underline transition-colors duration-200",text:o.label,attrs:{href:o.href||"#"}});t.appendChild(v)}}),t}addItem(e,t="#"){if(this.element){if(this.element.children.length>0){let h=F("span",{className:"text-gray-400 mx-1",text:"/"});this.element.appendChild(h)}let o=F("a",{className:"text-blue-600 hover:text-blue-800 hover:underline transition-colors duration-200",text:e,attrs:{href:t}});this.element.appendChild(o),this.items.push({label:e,href:t})}}}});var pt={};J(pt,{Card:()=>we});var we,gt=Q(()=>{Z();K();we=class extends z{constructor(e={}){super(e),this.title=e.title||"",this.subtitle=e.subtitle||"",this.content=e.content||"",this.footer=e.footer||"",this.className=e.className||"",this.hoverable=e.hoverable!==!1}create(){let e="bg-white rounded-lg border border-gray-200 overflow-hidden",t=this.hoverable?"hover:shadow-lg transition-shadow duration-300":"",o=super.create("div",{className:H(e,t,this.className)});if(this.title){let h=F("div",{className:"px-6 py-4 border-b border-gray-200 bg-gray-50"}),v=`<h3 class="text-lg font-semibold text-gray-900">${this.title}</h3>`;this.subtitle&&(v+=`<p class="text-sm text-gray-600 mt-1">${this.subtitle}</p>`),h.innerHTML=v,o.appendChild(h)}if(this.content){let h=F("div",{className:"px-6 py-4",html:this.content});o.appendChild(h)}if(this.footer){let h=F("div",{className:"px-6 py-4 border-t border-gray-200 bg-gray-50",html:this.footer});o.appendChild(h)}return o}setContent(e){if(this.content=e,this.element){let t=this.element.querySelector(".px-6.py-4:not(.border-b):not(.border-t)");t&&(t.innerHTML=e)}}addContent(e){if(this.element){let t=this.element.querySelector(".px-6.py-4:not(.border-b):not(.border-t)");t&&t.appendChild(e instanceof z?e.element:e)}}}});var ht={};J(ht,{Carousel:()=>ke});var ke,ft=Q(()=>{Z();K();ke=class extends z{constructor(e={}){super(e),this.items=e.items||[],this.autoplay=e.autoplay||!0,this.interval=e.interval||5e3,this.className=e.className||"",this.currentIndex=0,this.autoplayTimer=null}create(){let e=super.create("div",{className:H("relative w-full bg-black rounded-lg overflow-hidden",this.className)}),t=F("div",{className:"relative w-full h-96 overflow-hidden"});this.items.forEach((C,_)=>{let q=F("div",{className:H("absolute inset-0 transition-opacity duration-500",_===this.currentIndex?"opacity-100":"opacity-0")}),R=document.createElement("img");if(R.src=C.src,R.alt=C.alt||"",R.className="w-full h-full object-cover",q.appendChild(R),C.title){let Y=F("div",{className:"absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4",html:`<p class="text-white font-semibold">${C.title}</p>`});q.appendChild(Y)}t.appendChild(q)}),e.appendChild(t);let o=F("button",{className:"absolute left-4 top-1/2 transform -translate-y-1/2 z-10 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75 transition-all",html:"\u276E"});o.addEventListener("click",()=>{this.previous()});let h=F("button",{className:"absolute right-4 top-1/2 transform -translate-y-1/2 z-10 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75 transition-all",html:"\u276F"});h.addEventListener("click",()=>{this.next()}),e.appendChild(o),e.appendChild(h);let v=F("div",{className:"absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2 z-10"});return this.items.forEach((C,_)=>{let q=F("button",{className:H("w-2 h-2 rounded-full transition-all",_===this.currentIndex?"bg-white w-8":"bg-gray-500"),attrs:{"data-index":_}});q.addEventListener("click",()=>{this.goTo(_)}),v.appendChild(q)}),e.appendChild(v),this.slidesElement=t,this.dotsElement=v,this.autoplay&&this.startAutoplay(),e}next(){this.currentIndex=(this.currentIndex+1)%this.items.length,this.updateSlides()}previous(){this.currentIndex=(this.currentIndex-1+this.items.length)%this.items.length,this.updateSlides()}goTo(e){this.currentIndex=e,this.updateSlides(),this.autoplay&&this.resetAutoplay()}updateSlides(){let e=this.slidesElement.querySelectorAll("div"),t=this.dotsElement.querySelectorAll("button");e.forEach((o,h)=>{o.className=H("absolute inset-0 transition-opacity duration-500",h===this.currentIndex?"opacity-100":"opacity-0")}),t.forEach((o,h)=>{o.className=H("w-2 h-2 rounded-full transition-all",h===this.currentIndex?"bg-white w-8":"bg-gray-500")})}startAutoplay(){this.autoplayTimer=setInterval(()=>{this.next()},this.interval)}stopAutoplay(){this.autoplayTimer&&clearInterval(this.autoplayTimer)}resetAutoplay(){this.stopAutoplay(),this.autoplay&&this.startAutoplay()}destroy(){this.stopAutoplay(),super.destroy()}}});var xt={};J(xt,{Chart:()=>Ce});var Ce,vt=Q(()=>{Z();K();Ce=class extends z{constructor(e={}){super(e),this.type=e.type||"bar",this.data=e.data||[],this.title=e.title||"",this.height=e.height||"300px",this.className=e.className||""}create(){let e=super.create("div",{className:H("bg-white rounded-lg border border-gray-200 p-4",this.className)});if(this.title){let o=F("h3",{className:"text-lg font-semibold text-gray-900 mb-4",text:this.title});e.appendChild(o)}let t=this.createSVG();return e.appendChild(t),e}createSVG(){let e=Math.max(...this.data.map(C=>C.value)),t=400,o=200,h=40,v=document.createElementNS("http://www.w3.org/2000/svg","svg");if(v.setAttribute("viewBox",`0 0 ${t} ${o}`),v.setAttribute("class","w-full"),this.type==="bar"){let C=(t-h*2)/this.data.length;this.data.forEach((_,q)=>{let R=_.value/e*(o-h*2),Y=h+q*C+C*.25,j=o-h-R,y=document.createElementNS("http://www.w3.org/2000/svg","rect");y.setAttribute("x",Y),y.setAttribute("y",j),y.setAttribute("width",C*.5),y.setAttribute("height",R),y.setAttribute("fill","#3b82f6"),y.setAttribute("class","hover:fill-blue-700 transition-colors"),v.appendChild(y);let M=document.createElementNS("http://www.w3.org/2000/svg","text");M.setAttribute("x",Y+C*.25),M.setAttribute("y",o-10),M.setAttribute("text-anchor","middle"),M.setAttribute("font-size","12"),M.setAttribute("fill","#6b7280"),M.textContent=_.label,v.appendChild(M)})}return v}setData(e){if(this.data=e,this.element&&this.element.parentNode){let t=this.create();this.element.parentNode.replaceChild(t,this.element),this.element=t}}}});var bt={};J(bt,{Checkbox:()=>Ee});var Ee,yt=Q(()=>{Z();K();Ee=class extends z{constructor(e={}){super(e),this.label=e.label||"",this.checked=e.checked||!1,this.disabled=e.disabled||!1,this.required=e.required||!1,this.name=e.name||"",this.className=e.className||"",this.onChange=e.onChange||null}create(){let t=super.create("div",{className:H("flex items-center gap-2",this.className)}),o="w-5 h-5 border-2 border-gray-300 rounded cursor-pointer transition-colors duration-200 checked:bg-blue-600 checked:border-blue-600 disabled:opacity-50 disabled:cursor-not-allowed",h=document.createElement("input");if(h.type="checkbox",h.className=o,h.checked=this.checked,h.disabled=this.disabled,h.required=this.required,this.name&&(h.name=this.name),t.appendChild(h),this.label){let v=document.createElement("label");v.className="cursor-pointer select-none",v.textContent=this.label,t.appendChild(v),v.addEventListener("click",()=>{h.click()})}return this.onChange&&h.addEventListener("change",this.onChange),this.inputElement=h,t}isChecked(){return this.inputElement?.checked||!1}setChecked(e){this.checked=e,this.inputElement&&(this.inputElement.checked=e)}setDisabled(e){this.disabled=e,this.inputElement&&(this.inputElement.disabled=e)}toggle(){this.setChecked(!this.isChecked())}}});var wt={};J(wt,{Collapsible:()=>Le});var Le,kt=Q(()=>{Z();K();Le=class extends z{constructor(e={}){super(e),this.title=e.title||"",this.content=e.content||"",this.open=e.open||!1,this.className=e.className||"",this.onChange=e.onChange||null}create(){let e=super.create("div",{className:H("border border-gray-200 rounded-lg overflow-hidden",this.className)}),t=F("button",{className:H("w-full px-4 py-3 flex items-center justify-between","hover:bg-gray-50 transition-colors duration-200 text-left"),attrs:{"aria-expanded":this.open}}),o=F("span",{className:"font-semibold text-gray-900",text:this.title}),h=F("span",{className:H("w-5 h-5 transition-transform duration-300",this.open?"rotate-180":""),html:"\u25BC"});t.appendChild(o),t.appendChild(h),t.addEventListener("click",()=>{this.toggle()}),e.appendChild(t);let v=F("div",{className:H("overflow-hidden transition-all duration-300",this.open?"max-h-96":"max-h-0","border-t border-gray-200")}),C=F("div",{className:"px-4 py-3",html:this.content});return v.appendChild(C),e.appendChild(v),this.triggerElement=t,this.contentElement=v,this.chevron=h,e}toggle(){this.open=!this.open,this.updateUI(),this.onChange&&this.onChange(this.open)}open(){this.open||(this.open=!0,this.updateUI(),this.onChange&&this.onChange(!0))}close(){this.open&&(this.open=!1,this.updateUI(),this.onChange&&this.onChange(!1))}updateUI(){this.triggerElement.setAttribute("aria-expanded",this.open),this.contentElement.className=H("overflow-hidden transition-all duration-300",this.open?"max-h-96":"max-h-0","border-t border-gray-200"),this.chevron.className=H("w-5 h-5 transition-transform duration-300",this.open?"rotate-180":"")}setContent(e){if(this.content=e,this.contentElement){let t=this.contentElement.querySelector("div");t&&(t.innerHTML=e)}}}});var Ct={};J(Ct,{Command:()=>$e});var $e,Et=Q(()=>{Z();K();$e=class extends z{constructor(e={}){super(e),this.commands=e.commands||[],this.placeholder=e.placeholder||"Type a command...",this.className=e.className||"",this.open=!1}create(){let e=super.create("div",{className:H("fixed inset-0 z-50 hidden flex items-start justify-center pt-20",this.open?"flex":"")}),t=F("div",{className:"absolute inset-0 bg-black bg-opacity-50"});e.appendChild(t),t.addEventListener("click",()=>this.close());let o=F("div",{className:"relative w-full max-w-md bg-white rounded-lg shadow-lg z-50"}),h=document.createElement("input");h.type="text",h.placeholder=this.placeholder,h.className="w-full px-4 py-3 border-b border-gray-200 focus:outline-none",h.autofocus=!0,o.appendChild(h);let v=F("div",{className:"max-h-96 overflow-y-auto"}),C=(_="")=>{v.innerHTML="";let q=_?this.commands.filter(Y=>Y.label.toLowerCase().includes(_.toLowerCase())):this.commands;if(q.length===0){let Y=F("div",{className:"px-4 py-3 text-sm text-gray-500",text:"No commands found"});v.appendChild(Y);return}let R="";q.forEach(Y=>{if(Y.category&&Y.category!==R){R=Y.category;let M=F("div",{className:"px-4 py-2 text-xs font-semibold text-gray-600 bg-gray-50 uppercase",text:R});v.appendChild(M)}let j=F("div",{className:H("px-4 py-2 cursor-pointer hover:bg-blue-50 transition-colors flex items-center justify-between group")}),y=F("span",{text:Y.label,className:"text-sm text-gray-900"});if(j.appendChild(y),Y.shortcut){let M=F("span",{className:"text-xs text-gray-500 group-hover:text-gray-700",text:Y.shortcut});j.appendChild(M)}j.addEventListener("click",()=>{Y.action&&Y.action(),this.close()}),v.appendChild(j)})};return h.addEventListener("input",_=>{C(_.target.value)}),o.appendChild(v),e.appendChild(o),h.addEventListener("keydown",_=>{_.key==="Escape"&&this.close()}),C(),this.containerElement=e,e}open(){this.element||this.create(),this.open=!0,this.element.classList.remove("hidden"),this.element.classList.add("flex")}close(){this.open=!1,this.element?.classList.remove("flex"),this.element?.classList.add("hidden")}toggle(){this.open?this.close():this.open()}}});var Lt={};J(Lt,{Combobox:()=>Te});var Te,$t=Q(()=>{Z();K();Te=class extends z{constructor(e={}){super(e),this.items=e.items||[],this.value=e.value||"",this.placeholder=e.placeholder||"Search...",this.className=e.className||"",this.onChange=e.onChange||null,this.open=!1}create(){let e=super.create("div",{className:"relative w-full"}),t=document.createElement("input");t.type="text",t.placeholder=this.placeholder,t.value=this.value,t.className=H("w-full px-3 py-2 border border-gray-300 rounded-md","focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent");let o=F("div",{className:H("absolute hidden top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-md shadow-lg z-50","max-h-64 overflow-y-auto")}),h=(v="")=>{o.innerHTML="";let C=this.items.filter(_=>_.label.toLowerCase().includes(v.toLowerCase()));if(C.length===0){let _=F("div",{className:"px-3 py-2 text-gray-500",text:"No results found"});o.appendChild(_);return}C.forEach(_=>{let q=F("div",{className:H("px-3 py-2 cursor-pointer hover:bg-blue-50 transition-colors",_.value===this.value?"bg-blue-100":""),text:_.label,attrs:{"data-value":_.value}});q.addEventListener("click",()=>{this.value=_.value,t.value=_.label,o.classList.add("hidden"),this.onChange&&this.onChange(this.value,_)}),o.appendChild(q)})};return t.addEventListener("input",v=>{h(v.target.value),o.classList.remove("hidden")}),t.addEventListener("focus",()=>{h(t.value),o.classList.remove("hidden")}),t.addEventListener("blur",()=>{setTimeout(()=>{o.classList.add("hidden")},150)}),e.appendChild(t),e.appendChild(o),document.addEventListener("click",v=>{e.contains(v.target)||o.classList.add("hidden")}),this.inputElement=t,this.listElement=o,h(),e}getValue(){return this.value}setValue(e){this.value=e;let t=this.items.find(o=>o.value===e);t&&this.inputElement&&(this.inputElement.value=t.label)}}});var Tt={};J(Tt,{ContextMenu:()=>Ie});var Ie,It=Q(()=>{Z();K();Ie=class extends z{constructor(e={}){super(e),this.items=e.items||[],this.className=e.className||"",this.visible=!1}create(){let e=super.create("div",{className:"relative inline-block w-full"}),t=document.createElement("div");return t.className=H("absolute hidden bg-white border border-gray-200 rounded-lg shadow-lg py-1 z-50 min-w-max",this.className),this.items.forEach(o=>{let h=F("button",{className:H("w-full text-left px-4 py-2 hover:bg-gray-100 transition-colors duration-200 flex items-center gap-2",o.disabled?"opacity-50 cursor-not-allowed":"cursor-pointer"),attrs:{disabled:o.disabled?"":null,"data-action":o.label}});if(o.icon){let C=document.createElement("span");C.innerHTML=o.icon,h.appendChild(C)}let v=document.createElement("span");v.textContent=o.label,h.appendChild(v),h.addEventListener("click",()=>{!o.disabled&&o.onClick&&o.onClick(),this.hide()}),t.appendChild(h)}),e.appendChild(t),e.addEventListener("contextmenu",o=>{o.preventDefault(),this.showAt(o.clientX,o.clientY,t)}),document.addEventListener("click",()=>{this.visible&&this.hide()}),this.menuElement=t,e}showAt(e,t,o){o&&(this.visible=!0,o.classList.remove("hidden"),o.style.position="fixed",o.style.left=e+"px",o.style.top=t+"px")}hide(){this.visible=!1,this.menuElement&&(this.menuElement.classList.add("hidden"),this.menuElement.style.position="absolute")}addItem(e,t,o=null){let h={label:e,onClick:t,icon:o};if(this.items.push(h),this.menuElement){let v=F("button",{className:"w-full text-left px-4 py-2 hover:bg-gray-100 transition-colors duration-200 flex items-center gap-2"});if(o){let C=document.createElement("span");C.innerHTML=o,v.appendChild(C)}v.textContent=e,v.addEventListener("click",()=>{t(),this.hide()}),this.menuElement.appendChild(v)}}}});var Bt={};J(Bt,{DatePicker:()=>Be});var Be,St=Q(()=>{Z();K();Be=class extends z{constructor(e={}){super(e),this.value=e.value||"",this.placeholder=e.placeholder||"Select date...",this.format=e.format||"yyyy-mm-dd",this.className=e.className||"",this.onChange=e.onChange||null,this.open=!1}create(){let e=super.create("div",{className:"relative w-full"}),t=document.createElement("input");t.type="text",t.placeholder=this.placeholder,t.value=this.value,t.className=H("w-full px-3 py-2 border border-gray-300 rounded-md","focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"),t.addEventListener("click",()=>{this.openPicker()}),t.addEventListener("change",h=>{this.value=h.target.value,this.onChange&&this.onChange(this.value)}),e.appendChild(t);let o=document.createElement("input");return o.type="date",o.style.display="none",o.value=this.value,o.addEventListener("change",h=>{let v=new Date(h.target.value);this.value=this.formatDate(v),t.value=this.value,this.onChange&&this.onChange(this.value)}),e.appendChild(o),this.inputElement=t,this.nativeInput=o,e}openPicker(){this.nativeInput.click()}formatDate(e){let t=e.getFullYear(),o=String(e.getMonth()+1).padStart(2,"0"),h=String(e.getDate()).padStart(2,"0");return this.format==="dd/mm/yyyy"?`${h}/${o}/${t}`:`${t}-${o}-${h}`}getValue(){return this.value}setValue(e){this.value=e,this.inputElement&&(this.inputElement.value=e)}}});var At={};J(At,{Dialog:()=>Se});var Se,_t=Q(()=>{Z();K();Se=class extends z{constructor(e={}){super(e),this.title=e.title||"",this.content=e.content||"",this.size=e.size||"md",this.open=e.open||!1,this.onClose=e.onClose||null,this.closeButton=e.closeButton!==!1,this.closeOnBackdrop=e.closeOnBackdrop!==!1,this.closeOnEscape=e.closeOnEscape!==!1}create(){let e=super.create("div",{className:H("fixed inset-0 z-50 flex items-center justify-center",this.open?"":"hidden"),attrs:{role:"dialog","aria-modal":"true","aria-labelledby":`${this.id}-title`,"aria-describedby":`${this.id}-description`}}),t=ie("dialog-backdrop");e.appendChild(t),this.closeOnBackdrop&&t.addEventListener("click",()=>this.close());let o={sm:"w-full max-w-sm",md:"w-full max-w-md",lg:"w-full max-w-lg",xl:"w-full max-w-xl"},h=document.createElement("div");if(h.className=H("bg-white rounded-lg shadow-lg relative z-50",o[this.size],"mx-4 max-h-[90vh] overflow-y-auto"),this.title){let v=document.createElement("div");v.className="px-6 py-4 border-b border-gray-200 flex items-center justify-between";let C=document.createElement("h2");if(C.id=`${this.id}-title`,C.className="text-xl font-semibold text-gray-900",C.textContent=this.title,v.appendChild(C),this.closeButton){let _=document.createElement("button");_.className="text-gray-500 hover:text-gray-700 transition-colors duration-200",_.innerHTML="\xD7",_.setAttribute("aria-label","Close"),_.addEventListener("click",()=>this.close()),v.appendChild(_)}h.appendChild(v)}if(this.content){let v=document.createElement("div");v.id=`${this.id}-description`,v.className="px-6 py-4",v.innerHTML=this.content,h.appendChild(v)}return e.appendChild(h),this.on("keydown",v=>{ue.isEscape(v)&&this.closeOnEscape&&this.close()},{once:!1}),this.backdrop=t,this.dialogElement=h,this.focusTrap=ce(h),e}open(){this.element||this.create(),this.open=!0,this.element.classList.remove("hidden"),this.focusTrap.init(),document.body.style.overflow="hidden"}close(){this.open=!1,this.element?.classList.add("hidden"),document.body.style.overflow="",this.onClose&&this.onClose()}toggle(){this.open?this.close():this.open()}setContent(e){if(this.content=e,this.dialogElement){let t=this.dialogElement.querySelector(`#${this.id}-description`);t&&(t.innerHTML=e)}}}});var Mt={};J(Mt,{DropdownMenu:()=>Ae});var Ae,qt=Q(()=>{Z();K();Ae=class extends z{constructor(e={}){super(e),this.trigger=e.trigger||"Menu",this.items=e.items||[],this.position=e.position||"bottom",this.align=e.align||"left",this.className=e.className||"",this.open=!1}create(){let e=super.create("div",{className:"relative inline-block"}),t=document.createElement("button");t.className="px-4 py-2 bg-gray-100 text-gray-900 rounded hover:bg-gray-200 transition-colors duration-200 flex items-center gap-2",t.innerHTML=`${this.trigger} <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 14l-7 7m0 0l-7-7m7 7V3"></path></svg>`,t.addEventListener("click",()=>this.toggle()),e.appendChild(t);let o=this.position==="top"?"bottom-full mb-2":"top-full mt-2",h=this.align==="right"?"right-0":"left-0",v=document.createElement("div");return v.className=H("absolute hidden bg-white border border-gray-200 rounded-lg shadow-lg py-1 z-50 min-w-max",o,h,this.className),this.items.forEach(C=>{if(C.divider){let R=document.createElement("div");R.className="border-t border-gray-200 my-1",v.appendChild(R);return}let _=F("button",{className:H("w-full text-left px-4 py-2 hover:bg-gray-100 transition-colors duration-200 flex items-center gap-2",C.disabled?"opacity-50 cursor-not-allowed":"cursor-pointer"),attrs:{disabled:C.disabled?"":null}});if(C.icon){let R=document.createElement("span");R.innerHTML=C.icon,R.className="w-4 h-4",_.appendChild(R)}let q=document.createElement("span");q.textContent=C.label,_.appendChild(q),_.addEventListener("click",()=>{!C.disabled&&C.onClick&&C.onClick(),this.close()}),v.appendChild(_)}),e.appendChild(v),document.addEventListener("click",C=>{!e.contains(C.target)&&this.open&&this.close()}),this.triggerBtn=t,this.menuElement=v,e}toggle(){this.open?this.close():this.open()}open(){this.open=!0,this.menuElement.classList.remove("hidden")}close(){this.open=!1,this.menuElement.classList.add("hidden")}addItem(e,t,o=null){let h={label:e,onClick:t,icon:o};if(this.items.push(h),this.menuElement){let v=F("button",{className:"w-full text-left px-4 py-2 hover:bg-gray-100 transition-colors duration-200 flex items-center gap-2"});if(o){let _=document.createElement("span");_.innerHTML=o,_.className="w-4 h-4",v.appendChild(_)}let C=document.createElement("span");C.textContent=e,v.appendChild(C),v.addEventListener("click",()=>{t(),this.close()}),this.menuElement.appendChild(v)}}}});var Ht={};J(Ht,{Drawer:()=>_e});var _e,Pt=Q(()=>{Z();K();_e=class extends z{constructor(e={}){super(e),this.title=e.title||"",this.content=e.content||"",this.position=e.position||"right",this.open=e.open||!1,this.onClose=e.onClose||null,this.closeButton=e.closeButton!==!1,this.closeOnBackdrop=e.closeOnBackdrop!==!1,this.closeOnEscape=e.closeOnEscape!==!1}create(){let e=super.create("div",{className:H("fixed inset-0 z-50",this.open?"":"hidden")}),t=ie();e.appendChild(t),this.closeOnBackdrop&&t.addEventListener("click",()=>this.close());let o=this.position==="left"?"left-0":"right-0",h=document.createElement("div");if(h.className=H("absolute top-0 h-full w-96 bg-white shadow-lg transition-transform duration-300 flex flex-col z-50",o,this.open?"translate-x-0":this.position==="left"?"-translate-x-full":"translate-x-full"),this.title){let C=document.createElement("div");C.className="px-6 py-4 border-b border-gray-200 flex items-center justify-between";let _=document.createElement("h2");if(_.className="text-xl font-semibold text-gray-900",_.textContent=this.title,C.appendChild(_),this.closeButton){let q=document.createElement("button");q.className="text-gray-500 hover:text-gray-700 transition-colors duration-200",q.innerHTML="\xD7",q.addEventListener("click",()=>this.close()),C.appendChild(q)}h.appendChild(C)}let v=document.createElement("div");return v.className="flex-1 overflow-y-auto px-6 py-4",v.innerHTML=this.content,h.appendChild(v),e.appendChild(h),this.on("keydown",C=>{ue.isEscape(C)&&this.closeOnEscape&&this.close()},{once:!1}),this.backdrop=t,this.drawerElement=h,e}open(){this.element||this.create(),this.open=!0,this.element.classList.remove("hidden"),this.drawerElement.classList.remove("-translate-x-full","translate-x-full"),this.drawerElement.classList.add("translate-x-0"),document.body.style.overflow="hidden"}close(){this.open=!1;let e=this.position==="left"?"-translate-x-full":"translate-x-full";this.drawerElement.classList.remove("translate-x-0"),this.drawerElement.classList.add(e),setTimeout(()=>{this.element?.parentNode&&this.element.classList.add("hidden"),document.body.style.overflow=""},300),this.onClose&&this.onClose()}toggle(){this.open?this.close():this.open()}}});var jt={};J(jt,{Empty:()=>Me});var Me,Nt=Q(()=>{Z();K();Me=class extends z{constructor(e={}){super(e),this.icon=e.icon||"\u{1F4E6}",this.title=e.title||"No data",this.message=e.message||"There is no data to display",this.action=e.action||null,this.className=e.className||""}create(){let e=super.create("div",{className:H("flex flex-col items-center justify-center p-8 text-center",this.className)}),t=F("div",{className:"text-6xl mb-4",text:this.icon});e.appendChild(t);let o=F("h3",{className:"text-lg font-semibold text-gray-900 mb-2",text:this.title});e.appendChild(o);let h=F("p",{className:"text-gray-500 mb-4",text:this.message});if(e.appendChild(h),this.action){let v=F("button",{className:"px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors",text:this.action.label});v.addEventListener("click",this.action.onClick),e.appendChild(v)}return e}}});var Ft={};J(Ft,{Form:()=>qe});var qe,zt=Q(()=>{Z();K();qe=class extends z{constructor(e={}){super(e),this.fields=e.fields||[],this.onSubmit=e.onSubmit||null,this.submitText=e.submitText||"Submit",this.className=e.className||""}create(){let e=super.create("form",{className:H("space-y-6",this.className)});e.addEventListener("submit",o=>{o.preventDefault(),this.handleSubmit()}),this.fieldElements={},this.fields.forEach(o=>{let h=F("div",{className:"space-y-2"});if(o.label){let _=F("label",{className:"block text-sm font-medium text-gray-700",text:o.label,attrs:{for:o.name}});h.appendChild(_)}let v=document.createElement(o.type==="textarea"?"textarea":"input");v.id=o.name,v.name=o.name,v.className=H("w-full px-3 py-2 border border-gray-300 rounded-md","focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"),o.type!=="textarea"&&(v.type=o.type||"text"),o.placeholder&&(v.placeholder=o.placeholder),o.required&&(v.required=!0),o.disabled&&(v.disabled=!0),v.value=o.value||"",h.appendChild(v);let C=F("div",{className:"text-sm text-red-600 hidden",attrs:{"data-error":o.name}});h.appendChild(C),e.appendChild(h),this.fieldElements[o.name]=v});let t=F("button",{className:H("w-full px-4 py-2 bg-blue-600 text-white font-medium rounded","hover:bg-blue-700 transition-colors duration-200"),text:this.submitText,attrs:{type:"submit"}});return e.appendChild(t),e}handleSubmit(){let e={};Object.entries(this.fieldElements).forEach(([t,o])=>{e[t]=o.value}),this.onSubmit&&this.onSubmit(e)}getValues(){let e={};return Object.entries(this.fieldElements).forEach(([t,o])=>{e[t]=o.value}),e}setValues(e){Object.entries(e).forEach(([t,o])=>{this.fieldElements[t]&&(this.fieldElements[t].value=o)})}setError(e,t){let o=this.element.querySelector(`[data-error="${e}"]`);o&&(o.textContent=t,o.classList.remove("hidden"))}clearError(e){let t=this.element.querySelector(`[data-error="${e}"]`);t&&(t.textContent="",t.classList.add("hidden"))}reset(){this.element&&this.element.reset()}}});var Ot={};J(Ot,{HoverCard:()=>He});var He,Rt=Q(()=>{Z();K();He=class extends z{constructor(e={}){super(e),this.trigger=e.trigger||"Hover me",this.content=e.content||"",this.position=e.position||"bottom",this.delay=e.delay||200,this.className=e.className||"",this.visible=!1,this.timeoutId=null}create(){let e=super.create("div",{className:"relative inline-block"}),t=document.createElement("div");t.className="cursor-pointer px-3 py-2 rounded hover:bg-gray-100 transition-colors duration-200",t.textContent=this.trigger,e.appendChild(t);let o=document.createElement("div");return o.className=H("absolute hidden bg-white border border-gray-200 rounded-lg shadow-lg p-4 z-50","min-w-max max-w-sm",this.getPositionClasses(),this.className),o.innerHTML=this.content,e.appendChild(o),e.addEventListener("mouseenter",()=>this.show(o)),e.addEventListener("mouseleave",()=>this.hide(o)),this.cardElement=o,e}getPositionClasses(){let e={top:"bottom-full left-0 mb-2",bottom:"top-full left-0 mt-2",left:"right-full top-0 mr-2",right:"left-full top-0 ml-2"};return e[this.position]||e.bottom}show(e=this.cardElement){this.visible||!e||(this.timeoutId=setTimeout(()=>{this.visible=!0,e.classList.remove("hidden"),e.classList.add("opacity-100","transition-opacity","duration-200")},this.delay))}hide(e=this.cardElement){!this.visible||!e||(clearTimeout(this.timeoutId),this.visible=!1,e.classList.add("hidden"),e.classList.remove("opacity-100"))}setContent(e){this.content=e,this.cardElement&&(this.cardElement.innerHTML=e)}}});var Dt={};J(Dt,{Input:()=>Pe});var Pe,Vt=Q(()=>{Z();K();Pe=class extends z{constructor(e={}){super(e),this.type=e.type||"text",this.placeholder=e.placeholder||"",this.value=e.value||"",this.name=e.name||"",this.disabled=e.disabled||!1,this.required=e.required||!1,this.className=e.className||"",this.onChange=e.onChange||null}create(){let t=super.create("input",{className:H("w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900 placeholder-gray-500 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed",this.className),attrs:{type:this.type,placeholder:this.placeholder,value:this.value,name:this.name,disabled:this.disabled?"":null,required:this.required?"":null}});return this.onChange&&(this.on("change",this.onChange),this.on("input",this.onChange)),t}getValue(){return this.element?.value||""}setValue(e){this.value=e,this.element&&(this.element.value=e)}setDisabled(e){this.disabled=e,this.attr("disabled",e?"":null)}setPlaceholder(e){this.placeholder=e,this.element&&(this.element.placeholder=e)}focus(){super.focus()}clear(){this.setValue("")}}});var Ut={};J(Ut,{InputGroup:()=>je});var je,Wt=Q(()=>{Z();K();je=class extends z{constructor(e={}){super(e),this.prefix=e.prefix||null,this.suffix=e.suffix||null,this.input=e.input||null,this.className=e.className||""}create(){let t=super.create("div",{className:H("flex items-center border border-gray-300 rounded-md overflow-hidden focus-within:ring-2 focus-within:ring-blue-500",this.className)});if(this.prefix){let o=F("div",{className:"px-3 py-2 bg-gray-50 text-gray-700 font-medium text-sm",html:this.prefix});t.appendChild(o)}if(this.input){let o=this.input.element||this.input.create();o.classList.remove("border","focus:ring-2","focus:ring-blue-500"),t.appendChild(o)}if(this.suffix){let o=F("div",{className:"px-3 py-2 bg-gray-50 text-gray-700 font-medium text-sm",html:this.suffix});t.appendChild(o)}return t}}});var Yt={};J(Yt,{InputOTP:()=>Ne});var Ne,Qt=Q(()=>{Z();K();Ne=class extends z{constructor(e={}){super(e),this.length=e.length||6,this.value=e.value||"",this.className=e.className||"",this.onChange=e.onChange||null,this.onComplete=e.onComplete||null}create(){let e=super.create("div",{className:H("flex gap-2",this.className)});this.inputs=[];for(let t=0;t<this.length;t++){let o=document.createElement("input");o.type="text",o.maxLength="1",o.inputMode="numeric",o.className=H("w-12 h-12 text-center border-2 border-gray-300 rounded-lg font-semibold text-lg","focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-200","transition-colors duration-200"),this.value&&this.value[t]&&(o.value=this.value[t]),o.addEventListener("input",h=>{let v=h.target.value;if(!/^\d*$/.test(v)){h.target.value="";return}v&&t<this.length-1&&this.inputs[t+1].focus(),this.updateValue()}),o.addEventListener("keydown",h=>{h.key==="Backspace"?!o.value&&t>0&&this.inputs[t-1].focus():h.key==="ArrowLeft"&&t>0?this.inputs[t-1].focus():h.key==="ArrowRight"&&t<this.length-1&&this.inputs[t+1].focus()}),this.inputs.push(o),e.appendChild(o)}return e}updateValue(){this.value=this.inputs.map(e=>e.value).join(""),this.onChange&&this.onChange(this.value),this.value.length===this.length&&this.onComplete&&this.onComplete(this.value)}getValue(){return this.value}setValue(e){this.value=e;for(let t=0;t<this.length;t++)this.inputs[t].value=e[t]||""}clear(){this.inputs.forEach(e=>{e.value=""}),this.value=""}focus(){this.inputs.length>0&&this.inputs[0].focus()}}});var Gt={};J(Gt,{Item:()=>Fe});var Fe,Jt=Q(()=>{Z();K();Fe=class extends z{constructor(e={}){super(e),this.label=e.label||"",this.value=e.value||"",this.icon=e.icon||null,this.className=e.className||"",this.selected=e.selected||!1,this.disabled=e.disabled||!1}create(){let e="flex items-center gap-2 px-3 py-2 rounded cursor-pointer transition-colors duration-200 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed",t=this.selected?"bg-blue-50 text-blue-600":"text-gray-900",o=super.create("div",{className:H(e,t,this.className),attrs:{role:"option","aria-selected":this.selected,disabled:this.disabled?"":null,"data-value":this.value}}),h="";return this.icon&&(h+=`<span class="flex-shrink-0">${this.icon}</span>`),h+=`<span>${this.label}</span>`,o.innerHTML=h,o}setSelected(e){this.selected=e,this.element&&(this.attr("aria-selected",e),this.toggleClass("bg-blue-50 text-blue-600",e))}setDisabled(e){this.disabled=e,this.attr("disabled",e?"":null)}}});var Xt={};J(Xt,{Label:()=>ze});var ze,Kt=Q(()=>{Z();K();ze=class extends z{constructor(e={}){super(e),this.text=e.text||"",this.htmlFor=e.htmlFor||"",this.required=e.required||!1,this.className=e.className||""}create(){let t=super.create("label",{className:H("block text-sm font-medium text-gray-700 mb-1",this.className),attrs:{for:this.htmlFor}}),o=this.text;return this.required&&(o+=' <span class="text-red-500 ml-1">*</span>'),t.innerHTML=o,t}setText(e){if(this.text=e,this.element){let t=e;this.required&&(t+=' <span class="text-red-500 ml-1">*</span>'),this.element.innerHTML=t}}setRequired(e){if(this.required=e,this.element){let t=this.element.querySelector('[class*="text-red"]');e&&!t?this.element.innerHTML+=' <span class="text-red-500 ml-1">*</span>':!e&&t&&t.remove()}}}});var Zt={};J(Zt,{Kbd:()=>Oe});var Oe,es=Q(()=>{Z();K();Oe=class extends z{constructor(e={}){super(e),this.label=e.label||"K",this.className=e.className||""}create(){let t=super.create("kbd",{className:H("px-2 py-1 bg-gray-100 border border-gray-300 rounded text-xs font-semibold text-gray-900 inline-block font-mono",this.className)});return t.textContent=this.label,t}setLabel(e){this.label=e,this.element&&(this.element.textContent=e)}}});var ts={};J(ts,{NativeSelect:()=>Re});var Re,ss=Q(()=>{Z();K();Re=class extends z{constructor(e={}){super(e),this.items=e.items||[],this.selected=e.selected||"",this.placeholder=e.placeholder||"Select...",this.disabled=e.disabled||!1,this.required=e.required||!1,this.name=e.name||"",this.className=e.className||"",this.onChange=e.onChange||null}create(){let t=super.create("select",{className:H("w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed bg-white appearance-none cursor-pointer",this.className),attrs:{disabled:this.disabled?"":null,required:this.required?"":null,...this.name&&{name:this.name}}});if(this.placeholder){let o=document.createElement("option");o.value="",o.textContent=this.placeholder,o.disabled=!0,t.appendChild(o)}return this.items.forEach(o=>{let h=document.createElement("option");h.value=o.value,h.textContent=o.label,o.value===this.selected&&(h.selected=!0),t.appendChild(h)}),this.onChange&&this.on("change",this.onChange),t}getValue(){return this.element?.value||""}setValue(e){this.selected=e,this.element&&(this.element.value=e)}setDisabled(e){this.disabled=e,this.attr("disabled",e?"":null)}addItem(e,t){if(this.element){let o=document.createElement("option");o.value=t,o.textContent=e,this.element.appendChild(o)}}removeItem(e){if(this.element){let t=this.element.querySelector(`option[value="${e}"]`);t&&t.remove()}}}});var rs={};J(rs,{Tooltip:()=>De});var De,as=Q(()=>{Z();K();De=class extends z{constructor(e={}){super(e),this.content=e.content||"",this.position=e.position||"top",this.delay=e.delay||200,this.trigger=e.trigger||"hover",this.className=e.className||"",this.visible=!1,this.timeoutId=null}create(){let e=super.create("div",{className:"relative inline-block"}),t=document.createElement("div");t.className=H("absolute hidden bg-gray-900 text-white px-3 py-2 rounded text-sm whitespace-nowrap z-50","opacity-0 transition-opacity duration-200",this.getPositionClasses(),this.className),t.textContent=this.content;let o=document.createElement("div");return o.className=H("absolute w-2 h-2 bg-gray-900 transform rotate-45",this.getArrowClasses()),t.appendChild(o),e.appendChild(t),this.tooltipElement=t,this.trigger==="hover"?(e.addEventListener("mouseenter",()=>this.show()),e.addEventListener("mouseleave",()=>this.hide())):this.trigger==="focus"&&(e.addEventListener("focus",()=>this.show(),!0),e.addEventListener("blur",()=>this.hide(),!0)),e}getPositionClasses(){let e={top:"bottom-full left-1/2 transform -translate-x-1/2 mb-2",bottom:"top-full left-1/2 transform -translate-x-1/2 mt-2",left:"right-full top-1/2 transform -translate-y-1/2 mr-2",right:"left-full top-1/2 transform -translate-y-1/2 ml-2"};return e[this.position]||e.top}getArrowClasses(){let e={top:"top-full left-1/2 transform -translate-x-1/2 -translate-y-1/2",bottom:"bottom-full left-1/2 transform -translate-x-1/2 translate-y-1/2",left:"left-full top-1/2 transform translate-x-1/2 -translate-y-1/2",right:"right-full top-1/2 transform -translate-x-1/2 -translate-y-1/2"};return e[this.position]||e.top}show(){this.visible||(this.timeoutId=setTimeout(()=>{this.visible=!0,this.tooltipElement.classList.remove("hidden"),this.tooltipElement.classList.add("opacity-100")},this.delay))}hide(){this.visible&&(clearTimeout(this.timeoutId),this.visible=!1,this.tooltipElement.classList.remove("opacity-100"),this.tooltipElement.classList.add("hidden"))}setContent(e){this.content=e,this.tooltipElement&&(this.tooltipElement.textContent=e)}}});var ns={};J(ns,{Toggle:()=>Ve});var Ve,os=Q(()=>{Z();K();Ve=class extends z{constructor(e={}){super(e),this.label=e.label||"",this.pressed=e.pressed||!1,this.disabled=e.disabled||!1,this.variant=e.variant||"default",this.size=e.size||"md",this.className=e.className||"",this.onChange=e.onChange||null}create(){let e="px-4 py-2 font-medium rounded transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed",t={default:this.pressed?"bg-gray-900 text-white":"bg-gray-100 text-gray-900 hover:bg-gray-200",outline:this.pressed?"border-2 border-gray-900 bg-gray-900 text-white":"border-2 border-gray-300 text-gray-900 hover:bg-gray-50"},o={sm:"px-2 py-1 text-sm",md:"px-4 py-2 text-base",lg:"px-6 py-3 text-lg"},h=super.create("button",{className:H(e,t[this.variant],o[this.size],this.className),attrs:{"aria-pressed":this.pressed,disabled:this.disabled?"":null}});return h.textContent=this.label,this.on("click",()=>{this.toggle()}),h}isPressed(){return this.pressed}setPressed(e){this.pressed=e,this.element&&(this.attr("aria-pressed",e),this.toggleClass("bg-gray-900 text-white",e),this.onChange&&this.onChange(e))}toggle(){this.setPressed(!this.pressed)}setDisabled(e){this.disabled=e,this.attr("disabled",e?"":null)}}});var is={};J(is,{ToggleGroup:()=>Ue});var Ue,ls=Q(()=>{Z();K();Ue=class extends z{constructor(e={}){super(e),this.items=e.items||[],this.selected=e.selected||null,this.multiple=e.multiple||!1,this.orientation=e.orientation||"horizontal",this.className=e.className||"",this.onChange=e.onChange||null}create(){let e=this.orientation==="vertical"?"flex-col":"flex-row",o=super.create("div",{className:H("flex",e,"inline-flex border border-gray-300 rounded-md overflow-hidden",this.className),attrs:{role:"group"}});return this.toggleButtons=[],this.items.forEach((h,v)=>{let C=this.multiple?Array.isArray(this.selected)&&this.selected.includes(h.value):h.value===this.selected,_=H("flex-1 px-4 py-2 font-medium transition-colors duration-200",C?"bg-blue-600 text-white":"bg-white text-gray-700 hover:bg-gray-50",v>0?this.orientation==="vertical"?"border-t border-gray-300":"border-l border-gray-300":""),q=F("button",{className:_,text:h.label,attrs:{"data-value":h.value,"aria-pressed":C,type:"button"}});q.addEventListener("click",()=>{if(this.multiple){Array.isArray(this.selected)||(this.selected=[]);let R=this.selected.indexOf(h.value);R>-1?this.selected.splice(R,1):this.selected.push(h.value)}else this.selected=h.value;this.updateView(),this.onChange&&this.onChange(this.selected)}),o.appendChild(q),this.toggleButtons.push(q)}),o}updateView(){this.toggleButtons.forEach(e=>{let t=e.getAttribute("data-value"),o=this.multiple?Array.isArray(this.selected)&&this.selected.includes(t):t===this.selected;e.setAttribute("aria-pressed",o),e.className=H("flex-1 px-4 py-2 font-medium transition-colors duration-200",o?"bg-blue-600 text-white":"bg-white text-gray-700 hover:bg-gray-50")})}getValue(){return this.selected}setValue(e){this.selected=e,this.updateView()}}});var ds={};J(ds,{Toast:()=>We});var We,cs=Q(()=>{Z();K();We=class a extends z{constructor(e={}){super(e),this.message=e.message||"",this.type=e.type||"default",typeof e.duration<"u"?this.duration=e.duration:this.duration=typeof window<"u"&&window.innerWidth<640?2500:3e3,this.position=e.position||"top-right",this.className=e.className||"",this.onClose=e.onClose||null}destroy(){if(!this.element)return;let e=this.element;e.classList.add(this.getExitAnimationClass());let t=()=>{e.removeEventListener("animationend",t),super.destroy();let o=a.getContainer(this.position);o&&o.childElementCount===0&&o.parentNode&&(o.parentNode.removeChild(o),a._containers&&delete a._containers[this.position||"top-right"])};e.addEventListener("animationend",t),setTimeout(t,320)}static getContainer(e){let t=e||"top-right";if(this._containers||(this._containers={}),this._containers[t]&&document.body.contains(this._containers[t]))return this._containers[t];let o=F("div",{className:H("fixed z-50 p-2 flex flex-col gap-2 pointer-events-none",this.getPositionClassesForContainer(t))});return document.body.appendChild(o),this._containers[t]=o,o}static getPositionClassesForContainer(e){switch(e){case"top-left":return"top-4 left-4 items-start";case"top-right":return"top-4 right-4 items-end";case"bottom-left":return"bottom-4 left-4 items-start";case"bottom-right":return"bottom-4 right-4 items-end";case"top-center":return"top-4 left-1/2 -translate-x-1/2 items-center transform";default:return"top-4 right-4 items-end"}}create(){let e=a.getContainer(this.position),t=F("div",{className:H("rounded-lg shadow-lg p-2.5 flex items-center gap-2 min-w-0 max-w-[90vw] sm:max-w-sm bg-opacity-95",this.getEnterAnimationClass(),this.getTypeClasses(),this.className)}),o=F("span",{className:"text-base flex-shrink-0",text:this.getIcon()});t.appendChild(o);let h=F("span",{text:this.message,className:"flex-1 text-sm sm:text-base"});t.appendChild(h),t.setAttribute("role",this.type==="error"?"alert":"status"),t.setAttribute("aria-live",this.type==="error"?"assertive":"polite");let v=F("button",{className:"text-base hover:opacity-70 transition-opacity flex-shrink-0",text:"\xD7"});for(v.setAttribute("aria-label","Dismiss notification"),v.addEventListener("click",()=>{this.destroy()}),t.appendChild(v),this.element=t,e.appendChild(this.element);e.children.length>3;)e.removeChild(e.firstElementChild);return this.duration>0&&setTimeout(()=>{this.destroy()},this.duration),this.element}getEnterAnimationClass(){let e=this.position||"top-right";return e==="top-right"||e==="bottom-right"?"animate-slide-in-right transition-all duration-300 pointer-events-auto":e==="top-left"||e==="bottom-left"?"animate-slide-in-left transition-all duration-300 pointer-events-auto":"animate-slide-in-top transition-all duration-300 pointer-events-auto"}getExitAnimationClass(){let e=this.position||"top-right";return e==="top-right"||e==="bottom-right"?"animate-slide-out-right":e==="top-left"||e==="bottom-left"?"animate-slide-out-left":"animate-slide-out-top"}getPositionClasses(){let e={"top-left":"top-4 left-4","top-right":"top-4 right-4","bottom-left":"bottom-4 left-4","bottom-right":"bottom-4 right-4","top-center":"top-4 left-1/2 -translate-x-1/2 transform"};return e[this.position]||e["bottom-right"]}getTypeClasses(){let e={default:"bg-gray-900 text-white",success:"bg-green-600 text-white",error:"bg-red-600 text-white",warning:"bg-yellow-600 text-white",info:"bg-blue-600 text-white"};return e[this.type]||e.default}getIcon(){let e={default:"\u2139",success:"\u2713",error:"\u2715",warning:"\u26A0",info:"\u2139"};return e[this.type]||e.default}static show(e,t={}){let o=new a({message:e,...t}),h=o.create();return o}static success(e,t={}){return this.show(e,{...t,type:"success"})}static error(e,t={}){return this.show(e,{...t,type:"error",position:t.position||"top-right"})}static info(e,t={}){return this.show(e,{...t,type:"info"})}static warning(e,t={}){return this.show(e,{...t,type:"warning"})}};if(!document.querySelector("style[data-toast]")){let a=document.createElement("style");a.setAttribute("data-toast","true"),a.textContent=`
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
  `,document.head.appendChild(a)}});function us({root:a=document,selector:e="[data-hydrate]",threshold:t=.15}={}){if(typeof IntersectionObserver>"u")return;let o=new IntersectionObserver(async(h,v)=>{for(let C of h){if(!C.isIntersecting)continue;let _=C.target,q=_.dataset.hydrate||"",[R,Y="init"]=q.split("#");if(!R){v.unobserve(_);continue}try{let j=null,y=ar[R];if(typeof y=="function")j=await y();else throw new Error("Module not registered for lazy hydration: "+R);let M=j[Y]||j.default||null;if(typeof M=="function")try{M(_)}catch(D){console.error("hydrate init failed",D)}}catch(j){console.error("lazy hydrate import failed for",R,j)}finally{v.unobserve(_)}}},{threshold:t});a.querySelectorAll(e).forEach(h=>o.observe(h))}var ar,ms=Q(()=>{ar={"components/Alert.js":()=>Promise.resolve().then(()=>(et(),Ze)),"components/AlertDialog.js":()=>Promise.resolve().then(()=>(st(),tt)),"components/Avatar.js":()=>Promise.resolve().then(()=>(at(),rt)),"components/Badge.js":()=>Promise.resolve().then(()=>(ot(),nt)),"components/Button.js":()=>Promise.resolve().then(()=>(lt(),it)),"components/ButtonGroup.js":()=>Promise.resolve().then(()=>(ct(),dt)),"components/Breadcrumb.js":()=>Promise.resolve().then(()=>(mt(),ut)),"components/Card.js":()=>Promise.resolve().then(()=>(gt(),pt)),"components/Carousel.js":()=>Promise.resolve().then(()=>(ft(),ht)),"components/Chart.js":()=>Promise.resolve().then(()=>(vt(),xt)),"components/Checkbox.js":()=>Promise.resolve().then(()=>(yt(),bt)),"components/Collapsible.js":()=>Promise.resolve().then(()=>(kt(),wt)),"components/Command.js":()=>Promise.resolve().then(()=>(Et(),Ct)),"components/Combobox.js":()=>Promise.resolve().then(()=>($t(),Lt)),"components/ContextMenu.js":()=>Promise.resolve().then(()=>(It(),Tt)),"components/DatePicker.js":()=>Promise.resolve().then(()=>(St(),Bt)),"components/Dialog.js":()=>Promise.resolve().then(()=>(_t(),At)),"components/DropdownMenu.js":()=>Promise.resolve().then(()=>(qt(),Mt)),"components/Drawer.js":()=>Promise.resolve().then(()=>(Pt(),Ht)),"components/Empty.js":()=>Promise.resolve().then(()=>(Nt(),jt)),"components/Form.js":()=>Promise.resolve().then(()=>(zt(),Ft)),"components/HoverCard.js":()=>Promise.resolve().then(()=>(Rt(),Ot)),"components/Input.js":()=>Promise.resolve().then(()=>(Vt(),Dt)),"components/InputGroup.js":()=>Promise.resolve().then(()=>(Wt(),Ut)),"components/InputOTP.js":()=>Promise.resolve().then(()=>(Qt(),Yt)),"components/Item.js":()=>Promise.resolve().then(()=>(Jt(),Gt)),"components/Label.js":()=>Promise.resolve().then(()=>(Kt(),Xt)),"components/Kbd.js":()=>Promise.resolve().then(()=>(es(),Zt)),"components/NativeSelect.js":()=>Promise.resolve().then(()=>(ss(),ts)),"components/Tooltip.js":()=>Promise.resolve().then(()=>(as(),rs)),"components/Toggle.js":()=>Promise.resolve().then(()=>(os(),ns)),"components/ToggleGroup.js":()=>Promise.resolve().then(()=>(ls(),is)),"components/Toast.js":()=>Promise.resolve().then(()=>(cs(),ds))}});var gs={};J(gs,{default:()=>nr});var ps,nr,hs=Q(()=>{ps=(function(){"use strict";let a=null;async function e(){if(AuthGuard.protectPage()){await R();try{D()}catch{}Y(),M(),A(),E(),t()}}function t(){o(),h(),v(),C(),_(),q()}function o(){let s=document.getElementById("loyalty-points");if(!s)return;let n=a?.loyalty_points||Math.floor(Math.random()*500)+100,l=n>=500?"Gold":n>=200?"Silver":"Bronze",i={Bronze:"from-amber-600 to-amber-700",Silver:"from-gray-400 to-gray-500",Gold:"from-yellow-400 to-yellow-500"},u=l==="Gold"?null:l==="Silver"?"Gold":"Silver",p=l==="Gold"?0:l==="Silver"?500:200,d=u?Math.min(100,n/p*100):100;s.innerHTML=`
            <div class="bg-gradient-to-br ${i[l]} rounded-2xl p-6 text-white relative overflow-hidden">
                <div class="absolute top-0 right-0 w-32 h-32 opacity-10">
                    <svg viewBox="0 0 24 24" fill="currentColor" class="w-full h-full">
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                    </svg>
                </div>
                <div class="relative">
                    <div class="flex items-center justify-between mb-4">
                        <div>
                            <p class="text-white/80 text-sm font-medium">${l} Member</p>
                            <p class="text-3xl font-bold">${n.toLocaleString()} pts</p>
                        </div>
                        <div class="w-14 h-14 bg-white/20 backdrop-blur rounded-xl flex items-center justify-center">
                            <svg class="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                            </svg>
                        </div>
                    </div>
                    ${u?`
                        <div class="mt-4">
                            <div class="flex justify-between text-sm mb-1">
                                <span>${p-n} points to ${u}</span>
                                <span>${Math.round(d)}%</span>
                            </div>
                            <div class="w-full bg-white/30 rounded-full h-2">
                                <div class="bg-white h-2 rounded-full transition-all duration-500" style="width: ${d}%"></div>
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
        `}function h(){let s=document.getElementById("quick-stats");if(!s)return;let n={totalOrders:a?.total_orders||Math.floor(Math.random()*20)+5,totalSpent:a?.total_spent||Math.floor(Math.random()*1e3)+200,wishlistItems:a?.wishlist_count||Math.floor(Math.random()*10)+2,savedAddresses:a?.address_count||Math.floor(Math.random()*3)+1};s.innerHTML=`
            <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div class="bg-white dark:bg-stone-800 rounded-xl p-4 border border-gray-100 dark:border-stone-700">
                    <div class="flex items-center gap-3">
                        <div class="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                            <svg class="w-5 h-5 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/></svg>
                        </div>
                        <div>
                            <p class="text-2xl font-bold text-stone-900 dark:text-white">${n.totalOrders}</p>
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
                            <p class="text-2xl font-bold text-stone-900 dark:text-white">${Templates.formatPrice(n.totalSpent)}</p>
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
                            <p class="text-2xl font-bold text-stone-900 dark:text-white">${n.wishlistItems}</p>
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
                            <p class="text-2xl font-bold text-stone-900 dark:text-white">${n.savedAddresses}</p>
                            <p class="text-xs text-stone-500 dark:text-stone-400">Saved Addresses</p>
                        </div>
                    </div>
                </div>
            </div>
        `}async function v(){let s=document.getElementById("recent-activity");if(s)try{let l=(await OrdersApi.getAll({limit:3})).data||[];if(l.length===0){s.innerHTML=`
                    <div class="text-center py-6 text-stone-500 dark:text-stone-400">
                        <p>No recent activity</p>
                    </div>
                `;return}s.innerHTML=`
                <div class="bg-white dark:bg-stone-800 rounded-xl border border-gray-100 dark:border-stone-700 overflow-hidden">
                    <div class="px-4 py-3 border-b border-gray-100 dark:border-stone-700 flex items-center justify-between">
                        <h3 class="font-semibold text-stone-900 dark:text-white">Recent Orders</h3>
                        <a href="/orders/" class="text-sm text-primary-600 dark:text-amber-400 hover:underline">View All</a>
                    </div>
                    <div class="divide-y divide-gray-100 dark:divide-stone-700">
                        ${l.map(i=>{let p={pending:"text-yellow-600 dark:text-yellow-400",processing:"text-blue-600 dark:text-blue-400",shipped:"text-indigo-600 dark:text-indigo-400",delivered:"text-green-600 dark:text-green-400",cancelled:"text-red-600 dark:text-red-400"}[i.status]||"text-stone-600 dark:text-stone-400",d=i.items?.[0];return`
                                <a href="/orders/${i.id}/" class="flex items-center gap-4 p-4 hover:bg-stone-50 dark:hover:bg-stone-700/50 transition-colors">
                                    <div class="w-12 h-12 bg-stone-100 dark:bg-stone-700 rounded-lg overflow-hidden flex-shrink-0">
                                        ${d?.product?.image?`<img src="${d.product.image}" alt="" class="w-full h-full object-cover">`:`<div class="w-full h-full flex items-center justify-center text-stone-400">
                                                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/></svg>
                                            </div>`}
                                    </div>
                                    <div class="flex-1 min-w-0">
                                        <p class="font-medium text-stone-900 dark:text-white truncate">Order #${Templates.escapeHtml(i.order_number||i.id)}</p>
                                        <p class="text-sm ${p}">${Templates.escapeHtml(i.status_display||i.status)}</p>
                                    </div>
                                    <div class="text-right">
                                        <p class="font-semibold text-stone-900 dark:text-white">${Templates.formatPrice(i.total)}</p>
                                        <p class="text-xs text-stone-500 dark:text-stone-400">${Templates.formatDate(i.created_at)}</p>
                                    </div>
                                </a>
                            `}).join("")}
                    </div>
                </div>
            `}catch{s.innerHTML=""}}function C(){let s=document.getElementById("notification-preferences");if(!s)return;let n=JSON.parse(localStorage.getItem("notificationPreferences")||"{}"),i={...{orderUpdates:!0,promotions:!0,newArrivals:!1,priceDrops:!0,newsletter:!1},...n};s.innerHTML=`
            <div class="space-y-4">
                <div class="flex items-center justify-between">
                    <div>
                        <p class="font-medium text-stone-900 dark:text-white">Order Updates</p>
                        <p class="text-sm text-stone-500 dark:text-stone-400">Get notified about your order status</p>
                    </div>
                    <label class="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" class="sr-only peer" data-pref="orderUpdates" ${i.orderUpdates?"checked":""}>
                        <div class="w-11 h-6 bg-stone-200 dark:bg-stone-600 peer-focus:ring-2 peer-focus:ring-primary-300 dark:peer-focus:ring-amber-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600 dark:peer-checked:bg-amber-500"></div>
                    </label>
                </div>
                <div class="flex items-center justify-between">
                    <div>
                        <p class="font-medium text-stone-900 dark:text-white">Promotions & Sales</p>
                        <p class="text-sm text-stone-500 dark:text-stone-400">Be the first to know about deals</p>
                    </div>
                    <label class="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" class="sr-only peer" data-pref="promotions" ${i.promotions?"checked":""}>
                        <div class="w-11 h-6 bg-stone-200 dark:bg-stone-600 peer-focus:ring-2 peer-focus:ring-primary-300 dark:peer-focus:ring-amber-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600 dark:peer-checked:bg-amber-500"></div>
                    </label>
                </div>
                <div class="flex items-center justify-between">
                    <div>
                        <p class="font-medium text-stone-900 dark:text-white">Price Drops</p>
                        <p class="text-sm text-stone-500 dark:text-stone-400">Alert when wishlist items go on sale</p>
                    </div>
                    <label class="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" class="sr-only peer" data-pref="priceDrops" ${i.priceDrops?"checked":""}>
                        <div class="w-11 h-6 bg-stone-200 dark:bg-stone-600 peer-focus:ring-2 peer-focus:ring-primary-300 dark:peer-focus:ring-amber-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600 dark:peer-checked:bg-amber-500"></div>
                    </label>
                </div>
                <div class="flex items-center justify-between">
                    <div>
                        <p class="font-medium text-stone-900 dark:text-white">New Arrivals</p>
                        <p class="text-sm text-stone-500 dark:text-stone-400">Updates on new products</p>
                    </div>
                    <label class="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" class="sr-only peer" data-pref="newArrivals" ${i.newArrivals?"checked":""}>
                        <div class="w-11 h-6 bg-stone-200 dark:bg-stone-600 peer-focus:ring-2 peer-focus:ring-primary-300 dark:peer-focus:ring-amber-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600 dark:peer-checked:bg-amber-500"></div>
                    </label>
                </div>
            </div>
        `,s.querySelectorAll("input[data-pref]").forEach(u=>{u.addEventListener("change",()=>{let p=u.dataset.pref,d=JSON.parse(localStorage.getItem("notificationPreferences")||"{}");d[p]=u.checked,localStorage.setItem("notificationPreferences",JSON.stringify(d)),Toast.success("Preference saved")})})}function _(){let s=document.getElementById("quick-reorder");if(!s)return;let n=JSON.parse(localStorage.getItem("recentlyOrdered")||"[]");if(n.length===0){s.classList.add("hidden");return}s.innerHTML=`
            <div class="bg-white dark:bg-stone-800 rounded-xl border border-gray-100 dark:border-stone-700 p-4">
                <h3 class="font-semibold text-stone-900 dark:text-white mb-4">Quick Reorder</h3>
                <div class="flex gap-3 overflow-x-auto pb-2">
                    ${n.slice(0,5).map(l=>`
                        <button class="quick-reorder-btn flex-shrink-0 flex flex-col items-center gap-2 p-3 bg-stone-50 dark:bg-stone-700 rounded-xl hover:bg-stone-100 dark:hover:bg-stone-600 transition-colors" data-product-id="${l.id}">
                            <div class="w-16 h-16 rounded-lg bg-stone-200 dark:bg-stone-600 overflow-hidden">
                                <img src="${l.image||"/static/images/placeholder.jpg"}" alt="${Templates.escapeHtml(l.name)}" class="w-full h-full object-cover">
                            </div>
                            <span class="text-xs font-medium text-stone-700 dark:text-stone-300 text-center line-clamp-2 w-20">${Templates.escapeHtml(l.name)}</span>
                        </button>
                    `).join("")}
                </div>
            </div>
        `,s.querySelectorAll(".quick-reorder-btn").forEach(l=>{l.addEventListener("click",async()=>{let i=l.dataset.productId;l.disabled=!0;try{await CartApi.addItem(i,1),Toast.success("Added to cart!"),document.dispatchEvent(new CustomEvent("cart:updated"))}catch{Toast.error("Failed to add to cart")}finally{l.disabled=!1}})})}function q(){let s=document.getElementById("security-check");if(!s)return;let n=0,l=[],i=a?.email_verified!==!1;i&&(n+=25),l.push({label:"Email verified",completed:i});let u=!!a?.phone;u&&(n+=25),l.push({label:"Phone number added",completed:u});let p=a?.two_factor_enabled||!1;p&&(n+=25),l.push({label:"Two-factor authentication",completed:p});let d=!0;d&&(n+=25),l.push({label:"Strong password",completed:d});let m=n>=75?"text-green-600 dark:text-green-400":n>=50?"text-yellow-600 dark:text-yellow-400":"text-red-600 dark:text-red-400",L=n>=75?"bg-green-500":n>=50?"bg-yellow-500":"bg-red-500";s.innerHTML=`
            <div class="bg-white dark:bg-stone-800 rounded-xl border border-gray-100 dark:border-stone-700 p-4">
                <div class="flex items-center justify-between mb-4">
                    <h3 class="font-semibold text-stone-900 dark:text-white">Account Security</h3>
                    <span class="${m} font-bold">${n}%</span>
                </div>
                <div class="w-full bg-stone-200 dark:bg-stone-600 rounded-full h-2 mb-4">
                    <div class="${L} h-2 rounded-full transition-all duration-500" style="width: ${n}%"></div>
                </div>
                <div class="space-y-2">
                    ${l.map(T=>`
                        <div class="flex items-center gap-2 text-sm">
                            ${T.completed?'<svg class="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/></svg>':'<svg class="w-4 h-4 text-stone-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" stroke-width="2"/></svg>'}
                            <span class="${T.completed?"text-stone-700 dark:text-stone-300":"text-stone-500 dark:text-stone-400"}">${T.label}</span>
                        </div>
                    `).join("")}
                </div>
            </div>
        `}async function R(){if(AuthApi.isAuthenticated())try{a=(await AuthApi.getProfile()).data,j()}catch{Toast.error("Failed to load profile.")}}function Y(){let s=document.querySelectorAll("[data-profile-tab]"),n=document.querySelectorAll("[data-profile-panel]");if(!s.length||!n.length)return;let l=u=>{n.forEach(p=>{p.classList.toggle("hidden",p.dataset.profilePanel!==u)}),s.forEach(p=>{let d=p.dataset.profileTab===u;p.classList.toggle("bg-amber-600",d),p.classList.toggle("text-white",d),p.classList.toggle("shadow-sm",d),p.classList.toggle("text-stone-700",!d),p.classList.toggle("dark:text-stone-200",!d)}),localStorage.setItem("profileTab",u)},i=localStorage.getItem("profileTab")||"overview";l(i),s.forEach(u=>{u.addEventListener("click",()=>{l(u.dataset.profileTab)})})}function j(){let s=document.getElementById("profile-info");if(!s||!a)return;let n=`${Templates.escapeHtml(a.first_name||"")} ${Templates.escapeHtml(a.last_name||"")}`.trim()||Templates.escapeHtml(a.email||"User"),l=Templates.formatDate(a.created_at||a.date_joined),i=a.avatar?`<img id="avatar-preview" src="${a.avatar}" alt="Profile" class="w-full h-full object-cover">`:`
            <span class="flex h-full w-full items-center justify-center text-3xl font-semibold text-stone-500">
                ${(a.first_name?.[0]||a.email?.[0]||"U").toUpperCase()}
            </span>`;s.innerHTML=`
            <div class="absolute inset-0 bg-gradient-to-r from-amber-50/80 via-amber-100/60 to-transparent dark:from-amber-900/20 dark:via-amber-800/10" aria-hidden="true"></div>
            <div class="relative flex flex-col gap-4 md:flex-row md:items-center md:gap-6">
                <div class="relative">
                    <div class="w-24 h-24 rounded-2xl ring-4 ring-amber-100 dark:ring-amber-900/40 overflow-hidden bg-stone-100 dark:bg-stone-800">
                        ${i}
                    </div>
                </div>
                <div class="flex-1 min-w-0">
                    <p class="text-sm font-semibold text-amber-700 dark:text-amber-300">Profile</p>
                    <h1 class="text-2xl font-bold text-stone-900 dark:text-white leading-tight truncate">${n}</h1>
                    <p class="text-sm text-stone-600 dark:text-stone-300 truncate">${Templates.escapeHtml(a.email)}</p>
                    <p class="text-xs text-stone-500 dark:text-stone-400 mt-1">Member since ${l}</p>
                    <div class="flex flex-wrap gap-2 mt-4">
                        <button type="button" id="change-avatar-btn" class="btn btn-primary btn-sm">Update photo</button>
                        ${a.avatar?'<button type="button" id="remove-avatar-btn" class="btn btn-ghost btn-sm text-red-600 hover:text-red-700 dark:text-red-400">Remove photo</button>':""}
                    </div>
                    <p class="text-xs text-stone-500 dark:text-stone-400 mt-3">JPG, GIF or PNG. Max size 5MB.</p>
                </div>
            </div>
        `,D()}function y(){Tabs.init()}function M(){let s=document.getElementById("profile-form");if(!s||!a)return;let n=document.getElementById("profile-first-name"),l=document.getElementById("profile-last-name"),i=document.getElementById("profile-email"),u=document.getElementById("profile-phone");n&&(n.value=a.first_name||""),l&&(l.value=a.last_name||""),i&&(i.value=a.email||""),u&&(u.value=a.phone||""),s.addEventListener("submit",async p=>{p.preventDefault();let d=new FormData(s),m={first_name:d.get("first_name"),last_name:d.get("last_name"),phone:d.get("phone")},L=s.querySelector('button[type="submit"]');L.disabled=!0,L.textContent="Saving...";try{await AuthApi.updateProfile(m),Toast.success("Profile updated successfully!"),await R()}catch(T){Toast.error(T.message||"Failed to update profile.")}finally{L.disabled=!1,L.textContent="Save Changes"}})}function D(){let s=document.getElementById("avatar-input"),n=document.getElementById("change-avatar-btn"),l=document.getElementById("remove-avatar-btn");s||(s=document.createElement("input"),s.type="file",s.id="avatar-input",s.name="avatar",s.accept="image/*",s.className="hidden",document.body.appendChild(s)),document.querySelectorAll("#change-avatar-btn").forEach(p=>p.addEventListener("click",()=>s.click())),document.querySelectorAll("#remove-avatar-btn").forEach(p=>p.addEventListener("click",()=>{typeof window.removeAvatar=="function"&&window.removeAvatar()})),s.removeEventListener?.("change",window._avatarChangeHandler),window._avatarChangeHandler=async function(p){let d=p.target.files?.[0];if(d){if(!d.type.startsWith("image/")){Toast.error("Please select an image file.");return}if(d.size>5242880){Toast.error("Image must be smaller than 5MB.");return}try{await AuthApi.uploadAvatar(d),Toast.success("Avatar updated!"),await R()}catch(m){Toast.error(m.message||"Failed to update avatar.")}}},s.addEventListener("change",window._avatarChangeHandler)}function A(){let s=document.getElementById("password-form");s&&s.addEventListener("submit",async n=>{n.preventDefault();let l=new FormData(s),i=l.get("current_password"),u=l.get("new_password"),p=l.get("confirm_password");if(u!==p){Toast.error("Passwords do not match.");return}if(u.length<8){Toast.error("Password must be at least 8 characters.");return}let d=s.querySelector('button[type="submit"]');d.disabled=!0,d.textContent="Updating...";try{await AuthApi.changePassword(i,u),Toast.success("Password updated successfully!"),s.reset()}catch(m){Toast.error(m.message||"Failed to update password.")}finally{d.disabled=!1,d.textContent="Update Password"}})}function E(){b(),document.getElementById("add-address-btn")?.addEventListener("click",()=>{$()})}async function b(){let s=document.getElementById("addresses-list");if(s){Loader.show(s,"spinner");try{let l=(await AuthApi.getAddresses()).data||[];if(l.length===0){s.innerHTML=`
                    <div class="text-center py-8">
                        <svg class="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
                        </svg>
                        <p class="text-gray-500">No saved addresses yet.</p>
                    </div>
                `;return}s.innerHTML=`
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    ${l.map(i=>`
                        <div class="p-4 border border-gray-200 rounded-lg relative" data-address-id="${i.id}">
                            ${i.is_default?`
                                <span class="absolute top-2 right-2 px-2 py-0.5 bg-primary-100 text-primary-700 text-xs rounded">Default</span>
                            `:""}
                            <p class="font-medium text-gray-900">${Templates.escapeHtml(i.full_name||`${i.first_name} ${i.last_name}`)}</p>
                            <p class="text-sm text-gray-600 mt-1">${Templates.escapeHtml(i.address_line_1)}</p>
                            ${i.address_line_2?`<p class="text-sm text-gray-600">${Templates.escapeHtml(i.address_line_2)}</p>`:""}
                            <p class="text-sm text-gray-600">${Templates.escapeHtml(i.city)}, ${Templates.escapeHtml(i.state||"")} ${Templates.escapeHtml(i.postal_code)}</p>
                            <p class="text-sm text-gray-600">${Templates.escapeHtml(i.country)}</p>
                            ${i.phone?`<p class="text-sm text-gray-600 mt-1">${Templates.escapeHtml(i.phone)}</p>`:""}
                            
                            <div class="mt-4 flex gap-2">
                                <button class="edit-address-btn text-sm text-primary-600 hover:text-primary-700" data-address-id="${i.id}">Edit</button>
                                ${i.is_default?"":`
                                    <button class="set-default-btn text-sm text-gray-600 hover:text-gray-700" data-address-id="${i.id}">Set as Default</button>
                                `}
                                <button class="delete-address-btn text-sm text-red-600 hover:text-red-700" data-address-id="${i.id}">Delete</button>
                            </div>
                        </div>
                    `).join("")}
                </div>
            `,B()}catch(n){console.error("Failed to load addresses:",n),s.innerHTML='<p class="text-red-500">Failed to load addresses.</p>'}}}function B(){document.querySelectorAll(".edit-address-btn").forEach(s=>{s.addEventListener("click",async()=>{let n=s.dataset.addressId;try{let l=await AuthApi.getAddress(n);$(l.data)}catch{Toast.error("Failed to load address.")}})}),document.querySelectorAll(".set-default-btn").forEach(s=>{s.addEventListener("click",async()=>{let n=s.dataset.addressId;try{await AuthApi.setDefaultAddress(n),Toast.success("Default address updated."),await b()}catch{Toast.error("Failed to update default address.")}})}),document.querySelectorAll(".delete-address-btn").forEach(s=>{s.addEventListener("click",async()=>{let n=s.dataset.addressId;if(await Modal.confirm({title:"Delete Address",message:"Are you sure you want to delete this address?",confirmText:"Delete",cancelText:"Cancel"}))try{await AuthApi.deleteAddress(n),Toast.success("Address deleted."),await b()}catch{Toast.error("Failed to delete address.")}})})}function $(s=null){let n=!!s;Modal.open({title:n?"Edit Address":"Add New Address",content:`
                <form id="address-modal-form" class="space-y-4">
                    <div class="grid grid-cols-2 gap-4">
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">First Name *</label>
                            <input type="text" name="first_name" value="${s?.first_name||""}" required class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500">
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">Last Name *</label>
                            <input type="text" name="last_name" value="${s?.last_name||""}" required class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500">
                        </div>
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                        <input type="tel" name="phone" value="${s?.phone||""}" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500">
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Address Line 1 *</label>
                        <input type="text" name="address_line_1" value="${s?.address_line_1||""}" required class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500">
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Address Line 2</label>
                        <input type="text" name="address_line_2" value="${s?.address_line_2||""}" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500">
                    </div>
                    <div class="grid grid-cols-2 gap-4">
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">City *</label>
                            <input type="text" name="city" value="${s?.city||""}" required class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500">
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">State/Province</label>
                            <input type="text" name="state" value="${s?.state||""}" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500">
                        </div>
                    </div>
                    <div class="grid grid-cols-2 gap-4">
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">Postal Code *</label>
                            <input type="text" name="postal_code" value="${s?.postal_code||""}" required class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500">
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">Country *</label>
                            <select name="country" required class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500">
                                <option value="">Select country</option>
                                <option value="BD" ${s?.country==="BD"?"selected":""}>Bangladesh</option>
                                <option value="US" ${s?.country==="US"?"selected":""}>United States</option>
                                <option value="UK" ${s?.country==="UK"?"selected":""}>United Kingdom</option>
                                <option value="CA" ${s?.country==="CA"?"selected":""}>Canada</option>
                                <option value="AU" ${s?.country==="AU"?"selected":""}>Australia</option>
                            </select>
                        </div>
                    </div>
                    <div>
                        <label class="flex items-center">
                            <input type="checkbox" name="is_default" ${s?.is_default?"checked":""} class="text-primary-600 focus:ring-primary-500 rounded">
                            <span class="ml-2 text-sm text-gray-600">Set as default address</span>
                        </label>
                    </div>
                </form>
            `,confirmText:n?"Save Changes":"Add Address",onConfirm:async()=>{let l=document.getElementById("address-modal-form"),i=new FormData(l),u={first_name:i.get("first_name"),last_name:i.get("last_name"),phone:i.get("phone"),address_line_1:i.get("address_line_1"),address_line_2:i.get("address_line_2"),city:i.get("city"),state:i.get("state"),postal_code:i.get("postal_code"),country:i.get("country"),is_default:i.get("is_default")==="on"};try{return n?(await AuthApi.updateAddress(s.id,u),Toast.success("Address updated!")):(await AuthApi.addAddress(u),Toast.success("Address added!")),await b(),!0}catch(p){return Toast.error(p.message||"Failed to save address."),!1}}})}function f(){a=null}return{init:e,destroy:f}})();window.AccountPage=ps;nr=ps});var xs={};J(xs,{default:()=>or});var fs,or,vs=Q(()=>{fs=(function(){"use strict";let a=null,e=[],t=null,o=6e4;function h(){}function v(k){if(k==null||k==="")return 0;if(typeof k=="number"&&Number.isFinite(k))return k;let S=parseFloat(k);return Number.isFinite(S)?S:0}function C(k){let S=v(k);return Templates.formatPrice(S)}async function _(){await n(),T(),q()}function q(){R(),j(),A(),b(),B(),$(),s()}function R(){e=JSON.parse(localStorage.getItem("savedForLater")||"[]"),Y()}function Y(){let k=document.getElementById("saved-for-later");if(k){if(e.length===0){k.innerHTML="",k.classList.add("hidden");return}k.classList.remove("hidden"),k.innerHTML=`
            <div class="mt-8 bg-white dark:bg-stone-800 rounded-xl shadow-sm border border-gray-100 dark:border-stone-700 overflow-hidden">
                <div class="px-6 py-4 border-b border-gray-100 dark:border-stone-700 flex items-center justify-between">
                    <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Saved for Later (${e.length})</h3>
                    <button id="clear-saved-btn" class="text-sm text-gray-500 dark:text-stone-400 hover:text-gray-700 dark:hover:text-stone-300">Clear All</button>
                </div>
                <div class="p-6 grid grid-cols-2 md:grid-cols-4 gap-4">
                    ${e.map(S=>`
                        <div class="saved-item" data-product-id="${S.id}">
                            <div class="aspect-square bg-gray-100 dark:bg-stone-700 rounded-lg overflow-hidden mb-2">
                                <img src="${S.image||"/static/images/placeholder.jpg"}" alt="${Templates.escapeHtml(S.name)}" class="w-full h-full object-cover">
                            </div>
                            <h4 class="text-sm font-medium text-gray-900 dark:text-white truncate">${Templates.escapeHtml(S.name)}</h4>
                            <p class="text-sm font-semibold text-primary-600 dark:text-amber-400">${C(S.price)}</p>
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
        `,k.querySelectorAll(".move-to-cart-btn").forEach(S=>{S.addEventListener("click",async()=>{let O=S.closest(".saved-item")?.dataset.productId;if(O)try{await CartApi.addItem(O,1),e=e.filter(P=>P.id!==O),localStorage.setItem("savedForLater",JSON.stringify(e)),Toast.success("Item moved to cart"),await n(),Y()}catch{Toast.error("Failed to move item to cart")}})}),k.querySelectorAll(".remove-saved-btn").forEach(S=>{S.addEventListener("click",()=>{let O=S.closest(".saved-item")?.dataset.productId;O&&(e=e.filter(P=>P.id!==O),localStorage.setItem("savedForLater",JSON.stringify(e)),Y(),Toast.info("Item removed"))})}),document.getElementById("clear-saved-btn")?.addEventListener("click",()=>{e=[],localStorage.removeItem("savedForLater"),Y(),Toast.info("Saved items cleared")})}}function j(){let k=JSON.parse(localStorage.getItem("abandonedCart")||"null");k&&k.items?.length>0&&(!a||a.items?.length===0)&&M(k),y(),window.addEventListener("beforeunload",()=>{a&&a.items?.length>0&&localStorage.setItem("abandonedCart",JSON.stringify({items:a.items,savedAt:new Date().toISOString()}))})}function y(){let k=()=>{t&&clearTimeout(t),t=setTimeout(()=>{a&&a.items?.length>0&&D()},o)};["click","scroll","keypress","mousemove"].forEach(S=>{document.addEventListener(S,k,{passive:!0,once:!1})}),k()}function M(k){let S=document.createElement("div");S.id="abandoned-cart-modal",S.className="fixed inset-0 z-50 flex items-center justify-center p-4",S.innerHTML=`
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
                    <p class="text-stone-600 dark:text-stone-400">You left ${k.items.length} item(s) in your cart.</p>
                </div>
                <div class="max-h-48 overflow-y-auto mb-6 space-y-2">
                    ${k.items.slice(0,3).map(U=>`
                        <div class="flex items-center gap-3 p-2 bg-stone-50 dark:bg-stone-700/50 rounded-lg">
                            <img src="${U.product?.image||"/static/images/placeholder.jpg"}" alt="" class="w-12 h-12 rounded object-cover">
                            <div class="flex-1 min-w-0">
                                <p class="text-sm font-medium text-stone-900 dark:text-white truncate">${Templates.escapeHtml(U.product?.name||"Product")}</p>
                                <p class="text-xs text-stone-500 dark:text-stone-400">Qty: ${U.quantity}</p>
                            </div>
                        </div>
                    `).join("")}
                    ${k.items.length>3?`<p class="text-center text-sm text-stone-500 dark:text-stone-400">+${k.items.length-3} more items</p>`:""}
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
        `,document.body.appendChild(S)}function D(){sessionStorage.getItem("cartReminderShown")||(Toast.info("Don't forget! You have items in your cart",{duration:8e3,action:{text:"Checkout",onClick:()=>window.location.href="/checkout/"}}),sessionStorage.setItem("cartReminderShown","true"))}function A(){E()}function E(){let k=document.getElementById("free-shipping-progress");if(!k||!a)return;let S=50,U=v(a.summary?.subtotal||a.subtotal||0),O=Math.max(0,S-U),P=Math.min(100,U/S*100);U>=S?k.innerHTML=`
                <div class="flex items-center gap-2 p-3 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl">
                    <svg class="w-5 h-5 text-emerald-600 dark:text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>
                    <span class="text-sm font-medium text-emerald-700 dark:text-emerald-300">\u{1F389} You've unlocked FREE shipping!</span>
                </div>
            `:k.innerHTML=`
                <div class="p-3 bg-amber-50 dark:bg-amber-900/20 rounded-xl">
                    <div class="flex items-center justify-between text-sm mb-2">
                        <span class="text-amber-700 dark:text-amber-300">Add ${C(O)} for FREE shipping</span>
                        <span class="text-amber-600 dark:text-amber-400 font-medium">${Math.round(P)}%</span>
                    </div>
                    <div class="w-full bg-amber-200 dark:bg-amber-800 rounded-full h-2">
                        <div class="bg-amber-500 h-2 rounded-full transition-all duration-500" style="width: ${P}%"></div>
                    </div>
                </div>
            `}function b(){let k=document.getElementById("cart-delivery-estimate");if(!k)return;let S=new Date,U=3,O=7,P=new Date(S.getTime()+U*24*60*60*1e3),X=new Date(S.getTime()+O*24*60*60*1e3),ee=re=>re.toLocaleDateString("en-US",{weekday:"short",month:"short",day:"numeric"});k.innerHTML=`
            <div class="flex items-center gap-2 text-sm text-stone-600 dark:text-stone-400">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"/></svg>
                <span>Estimated delivery: <strong class="text-stone-900 dark:text-white">${ee(P)} - ${ee(X)}</strong></span>
            </div>
        `}async function B(){let k=document.getElementById("cart-recommendations");if(!(!k||!a||!a.items?.length))try{let S=a.items.map(P=>P.product?.id).filter(Boolean);if(!S.length)return;let U=await ProductsApi.getRelated(S[0],{limit:4}),O=U?.data||U?.results||[];if(!O.length)return;k.innerHTML=`
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
                                    <p class="text-sm font-semibold text-primary-600 dark:text-amber-400 mt-1">${C(P.current_price||P.price)}</p>
                                    <button class="quick-add-btn w-full mt-2 py-2 text-xs font-medium text-primary-600 dark:text-amber-400 border border-primary-600 dark:border-amber-400 rounded-lg hover:bg-primary-50 dark:hover:bg-amber-900/20 transition-colors" data-product-id="${P.id}">
                                        + Add to Cart
                                    </button>
                                </div>
                            </div>
                        `).join("")}
                    </div>
                </div>
            `,k.querySelectorAll(".quick-add-btn").forEach(P=>{P.addEventListener("click",async()=>{let X=P.dataset.productId;P.disabled=!0,P.textContent="Adding...";try{await CartApi.addItem(X,1),Toast.success("Added to cart"),await n()}catch{Toast.error("Failed to add item")}finally{P.disabled=!1,P.textContent="+ Add to Cart"}})})}catch(S){console.warn("Failed to load recommendations:",S)}}function $(){let k=document.getElementById("cart-note"),S=document.getElementById("gift-order");if(k){let U=localStorage.getItem("cartNote")||"";k.value=U,k.addEventListener("input",f(()=>{localStorage.setItem("cartNote",k.value)},500))}if(S){let U=localStorage.getItem("isGiftOrder")==="true";S.checked=U,S.addEventListener("change",()=>{localStorage.setItem("isGiftOrder",S.checked)})}}function f(k,S){let U;return function(...P){clearTimeout(U),U=setTimeout(()=>k(...P),S)}}function s(){let k=document.getElementById("express-checkout");k&&(k.innerHTML=`
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
        `,k.querySelectorAll(".express-pay-btn").forEach(S=>{S.addEventListener("click",()=>{Toast.info("Express checkout coming soon!")})}))}async function n(){let k=document.getElementById("cart-container");if(k){Loader.show(k,"skeleton");try{a=(await CartApi.getCart()).data,l(a)}catch(S){console.error("Failed to load cart:",S),k.innerHTML='<p class="text-red-500 text-center py-8">Failed to load cart. Please try again.</p>'}}}function l(k){let S=document.getElementById("cart-container");if(!S)return;let U=k?.items||[],O=k?.summary||{},P=O.subtotal??k?.subtotal??0,X=v(O.discount_amount??k?.discount_amount),ee=O.tax_amount??k?.tax_amount??0,re=O.total??k?.total??0,se=k?.coupon?.code||"";if(U.length===0){S.innerHTML=`
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
            `;return}S.innerHTML=`
            <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <!-- Cart Items -->
                <div class="lg:col-span-2">
                    <div class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                        <div class="px-6 py-4 border-b border-gray-100">
                            <h2 class="text-lg font-semibold text-gray-900">Shopping Cart (${U.length} items)</h2>
                        </div>
                        <div id="cart-items" class="divide-y divide-gray-100">
                            ${U.map(oe=>i(oe)).join("")}
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
                                <span class="font-medium text-gray-900 dark:text-white">${C(P)}</span>
                            </div>
                            ${X>0?`
                                <div class="flex justify-between text-green-600 dark:text-green-400">
                                    <span>Discount</span>
                                    <span>-${C(X)}</span>
                                </div>
                            `:""}
                            ${v(ee)>0?`
                                <div class="flex justify-between">
                                    <span class="text-gray-600 dark:text-stone-400">Tax</span>
                                    <span class="font-medium text-gray-900 dark:text-white">${C(ee)}</span>
                                </div>
                            `:""}
                            <div class="pt-3 border-t border-gray-200 dark:border-stone-600">
                                <div class="flex justify-between">
                                    <span class="text-base font-semibold text-gray-900 dark:text-white">Total</span>
                                    <span class="text-base font-bold text-gray-900 dark:text-white">${C(re)}</span>
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
        `,u(),q()}function i(k){let S=k.product||{},U=k.variant,O=S.slug||"#",P=S.name||"Product",X=S.primary_image||S.image,ee=v(k.price_at_add),re=v(k.current_price),se=v(k.line_total)||re*(k.quantity||1),oe=ee>re;return`
            <div class="cart-item p-6 flex gap-4" data-item-id="${k.id}" data-product-id="${S.id}">
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
                            ${U?`
                                <p class="text-sm text-gray-500 dark:text-stone-400 mt-1">${Templates.escapeHtml(U.name||U.value)}</p>
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
                                value="${k.quantity}" 
                                min="1" 
                                max="${S.stock_quantity||99}"
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
                                <span class="text-sm text-gray-400 dark:text-stone-500 line-through">${C(ee*k.quantity)}</span>
                            `:""}
                            <span class="font-semibold text-gray-900 dark:text-white block">${C(se)}</span>
                        </div>
                    </div>
                </div>
            </div>
        `}function u(){let k=document.getElementById("cart-items"),S=document.getElementById("clear-cart-btn"),U=document.getElementById("remove-coupon-btn");k?.addEventListener("click",async O=>{let P=O.target.closest(".cart-item");if(!P)return;let X=P.dataset.itemId,ee=P.dataset.productId,re=P.querySelector(".item-quantity");if(O.target.closest(".remove-item-btn"))await d(X);else if(O.target.closest(".save-for-later-btn"))await m(X,ee,P);else if(O.target.closest(".qty-decrease")){let se=parseInt(re.value)||1;se>1&&await p(X,se-1)}else if(O.target.closest(".qty-increase")){let se=parseInt(re.value)||1,oe=parseInt(re.max)||99;se<oe&&await p(X,se+1)}}),k?.addEventListener("change",async O=>{if(O.target.classList.contains("item-quantity")){let X=O.target.closest(".cart-item")?.dataset.itemId,ee=parseInt(O.target.value)||1;X&&ee>0&&await p(X,ee)}}),S?.addEventListener("click",async()=>{await Modal.confirm({title:"Clear Cart",message:"Are you sure you want to remove all items from your cart?",confirmText:"Clear Cart",cancelText:"Cancel"})&&await L()}),U?.addEventListener("click",async()=>{await N()})}async function p(k,S){try{await CartApi.updateItem(k,S),await n(),document.dispatchEvent(new CustomEvent("cart:updated"))}catch(U){Toast.error(U.message||"Failed to update quantity.")}}async function d(k){try{await CartApi.removeItem(k),Toast.success("Item removed from cart."),await n(),document.dispatchEvent(new CustomEvent("cart:updated"))}catch(S){Toast.error(S.message||"Failed to remove item.")}}async function m(k,S,U){try{let O=a?.items?.find(re=>String(re.id)===String(k));if(!O)return;let P=O.product||{},X={id:S,name:P.name||"Product",image:P.primary_image||P.image||"",price:O.current_price||P.price||0};e.findIndex(re=>re.id===S)===-1&&(e.push(X),localStorage.setItem("savedForLater",JSON.stringify(e))),await CartApi.removeItem(k),Toast.success("Item saved for later"),await n(),document.dispatchEvent(new CustomEvent("cart:updated"))}catch(O){Toast.error(O.message||"Failed to save item.")}}async function L(){try{await CartApi.clearCart(),Toast.success("Cart cleared."),await n(),document.dispatchEvent(new CustomEvent("cart:updated"))}catch(k){Toast.error(k.message||"Failed to clear cart.")}}function T(){let k=document.getElementById("coupon-form");k?.addEventListener("submit",async S=>{S.preventDefault();let O=document.getElementById("coupon-code")?.value.trim();if(!O){Toast.error("Please enter a coupon code.");return}let P=k.querySelector('button[type="submit"]');P.disabled=!0,P.textContent="Applying...";try{await CartApi.applyCoupon(O),Toast.success("Coupon applied!"),await n()}catch(X){Toast.error(X.message||"Invalid coupon code.")}finally{P.disabled=!1,P.textContent="Apply"}})}async function N(){try{await CartApi.removeCoupon(),Toast.success("Coupon removed."),await n()}catch(k){Toast.error(k.message||"Failed to remove coupon.")}}function V(){a=null}return{init:_,destroy:V}})();window.CartPage=fs;or=fs});var ys={};J(ys,{default:()=>ir});var bs,ir,ws=Q(()=>{bs=(function(){"use strict";let a={},e=1,t=null,o=null,h=!1,v=!1,C=!0,_=[],q=[],R=4;async function Y(){if(h)return;h=!0;let r=L();if(!r)return;let c=document.getElementById("category-header");if(c&&c.querySelector("h1")){oe(),le(),de(),j();return}a=T(),e=parseInt(new URLSearchParams(window.location.search).get("page"))||1,await N(r),oe(),le(),de(),j()}function j(){y(),A(),s(),l(),u(),d()}function y(){let r=document.getElementById("load-more-trigger");if(!r)return;new IntersectionObserver(g=>{g.forEach(x=>{x.isIntersecting&&!v&&C&&M()})},{rootMargin:"200px 0px",threshold:.01}).observe(r)}async function M(){if(v||!C||!t)return;v=!0,e++;let r=document.getElementById("loading-more-indicator");r&&r.classList.remove("hidden");try{let c={category:t.id,page:e,limit:12,...a},g=await ProductsApi.getAll(c),x=g.data||[],w=g.meta||{};x.length===0?C=!1:(_=[..._,...x],D(x),C=e<(w.total_pages||1)),X()}catch(c){console.error("Failed to load more products:",c)}finally{v=!1,r&&r.classList.add("hidden")}}function D(r){let c=document.getElementById("products-grid");if(!c)return;let g=Storage.get("productViewMode")||"grid";r.forEach(x=>{let w=ProductCard.render(x,{layout:g,showCompare:!0,showQuickView:!0}),I=document.createElement("div");I.innerHTML=w;let W=I.firstElementChild;W.classList.add("animate-fadeInUp"),c.appendChild(W)}),ProductCard.bindEvents(c)}function A(){q=JSON.parse(localStorage.getItem("compareProducts")||"[]"),b(),document.addEventListener("click",r=>{let c=r.target.closest("[data-compare]");if(!c)return;r.preventDefault();let g=parseInt(c.dataset.compare);E(g)})}function E(r){let c=q.findIndex(g=>g.id===r);if(c>-1)q.splice(c,1),Toast.info("Removed from compare");else{if(q.length>=R){Toast.warning(`You can compare up to ${R} products`);return}let g=_.find(x=>x.id===r);g&&(q.push({id:g.id,name:g.name,image:g.primary_image||g.image,price:g.price,sale_price:g.sale_price}),Toast.success("Added to compare"))}localStorage.setItem("compareProducts",JSON.stringify(q)),b(),B()}function b(){let r=document.getElementById("compare-bar");if(q.length===0){r?.remove();return}r||(r=document.createElement("div"),r.id="compare-bar",r.className="fixed bottom-0 left-0 right-0 bg-white dark:bg-stone-800 border-t border-stone-200 dark:border-stone-700 shadow-2xl z-40 transform transition-transform duration-300",document.body.appendChild(r)),r.innerHTML=`
            <div class="container mx-auto px-4 py-4">
                <div class="flex items-center justify-between gap-4">
                    <div class="flex items-center gap-3 overflow-x-auto">
                        <span class="text-sm font-medium text-stone-600 dark:text-stone-400 whitespace-nowrap">Compare (${q.length}/${R}):</span>
                        ${q.map(c=>`
                            <div class="relative flex-shrink-0 group">
                                <img src="${c.image||"/static/images/placeholder.jpg"}" alt="${Templates.escapeHtml(c.name)}" class="w-14 h-14 object-cover rounded-lg border border-stone-200 dark:border-stone-600">
                                <button data-remove-compare="${c.id}" class="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
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
        `,r.querySelectorAll("[data-remove-compare]").forEach(c=>{c.addEventListener("click",()=>{let g=parseInt(c.dataset.removeCompare);E(g)})}),document.getElementById("compare-now-btn")?.addEventListener("click",f),document.getElementById("clear-compare-btn")?.addEventListener("click",$)}function B(){document.querySelectorAll("[data-compare]").forEach(r=>{let c=parseInt(r.dataset.compare);q.some(x=>x.id===c)?(r.classList.add("bg-primary-100","text-primary-600"),r.classList.remove("bg-stone-100","text-stone-600")):(r.classList.remove("bg-primary-100","text-primary-600"),r.classList.add("bg-stone-100","text-stone-600"))})}function $(){q=[],localStorage.removeItem("compareProducts"),b(),B(),Toast.info("Compare list cleared")}async function f(){if(q.length<2)return;let r=document.createElement("div");r.id="compare-modal",r.className="fixed inset-0 z-50 overflow-auto",r.innerHTML=`
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
                                    ${q.map(c=>`
                                        <th class="p-3 text-center">
                                            <div class="flex flex-col items-center">
                                                <img src="${c.image||"/static/images/placeholder.jpg"}" alt="${Templates.escapeHtml(c.name)}" class="w-24 h-24 object-cover rounded-xl mb-2">
                                                <span class="text-sm font-semibold text-stone-900 dark:text-white">${Templates.escapeHtml(c.name)}</span>
                                            </div>
                                        </th>
                                    `).join("")}
                                </tr>
                            </thead>
                            <tbody>
                                <tr class="border-t border-stone-100 dark:border-stone-700">
                                    <td class="p-3 text-sm font-medium text-stone-600 dark:text-stone-400">Price</td>
                                    ${q.map(c=>`
                                        <td class="p-3 text-center">
                                            ${c.sale_price?`
                                                <span class="text-lg font-bold text-primary-600 dark:text-amber-400">${Templates.formatPrice(c.sale_price)}</span>
                                                <span class="text-sm text-stone-400 line-through ml-1">${Templates.formatPrice(c.price)}</span>
                                            `:`
                                                <span class="text-lg font-bold text-stone-900 dark:text-white">${Templates.formatPrice(c.price)}</span>
                                            `}
                                        </td>
                                    `).join("")}
                                </tr>
                                <tr class="border-t border-stone-100 dark:border-stone-700">
                                    <td class="p-3 text-sm font-medium text-stone-600 dark:text-stone-400">Actions</td>
                                    ${q.map(c=>`
                                        <td class="p-3 text-center">
                                            <button onclick="CartApi.addItem(${c.id}, 1).then(() => Toast.success('Added to cart'))" class="px-4 py-2 bg-primary-600 dark:bg-amber-600 text-white text-sm font-medium rounded-lg hover:bg-primary-700 dark:hover:bg-amber-700 transition-colors">
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
        `,document.body.appendChild(r)}function s(){document.addEventListener("click",async r=>{let c=r.target.closest("[data-quick-view]");if(!c)return;let g=c.dataset.quickView;g&&(r.preventDefault(),await n(g))})}async function n(r){let c=document.createElement("div");c.id="quick-view-modal",c.className="fixed inset-0 z-50 flex items-center justify-center p-4",c.innerHTML=`
            <div class="absolute inset-0 bg-black/50 backdrop-blur-sm" onclick="document.getElementById('quick-view-modal').remove()"></div>
            <div class="relative bg-white dark:bg-stone-800 rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-auto">
                <div class="p-8 flex items-center justify-center min-h-[400px]">
                    <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 dark:border-amber-400"></div>
                </div>
            </div>
        `,document.body.appendChild(c);try{let g=await ProductsApi.getProduct(r),x=g.data||g,w=c.querySelector(".relative");w.innerHTML=`
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
            `;let I=document.getElementById("qv-qty-input"),W=document.getElementById("qv-qty-minus"),G=document.getElementById("qv-qty-plus"),te=document.getElementById("qv-add-to-cart");W?.addEventListener("click",()=>{let ae=parseInt(I.value)||1;ae>1&&(I.value=ae-1)}),G?.addEventListener("click",()=>{let ae=parseInt(I.value)||1,ne=parseInt(I.max)||99;ae<ne&&(I.value=ae+1)}),te?.addEventListener("click",async()=>{let ae=parseInt(I.value)||1;te.disabled=!0,te.innerHTML='<svg class="animate-spin h-5 w-5 mx-auto" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>';try{await CartApi.addItem(x.id,ae),Toast.success("Added to cart"),c.remove()}catch{Toast.error("Failed to add to cart")}finally{te.disabled=!1,te.innerHTML='<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"/></svg> Add to Cart'}})}catch(g){console.error("Failed to load product:",g),c.remove(),Toast.error("Failed to load product details")}}function l(){if(!document.getElementById("price-range-slider"))return;let c=document.getElementById("filter-min-price"),g=document.getElementById("filter-max-price");!c||!g||[c,g].forEach(x=>{x.addEventListener("input",()=>{i()})})}function i(){let r=document.getElementById("price-range-display"),c=document.getElementById("filter-min-price")?.value||0,g=document.getElementById("filter-max-price")?.value||"\u221E";r&&(r.textContent=`$${c} - $${g}`)}function u(){p()}function p(){let r=document.getElementById("active-filters");if(!r)return;let c=[];if(a.min_price&&c.push({key:"min_price",label:`Min: $${a.min_price}`}),a.max_price&&c.push({key:"max_price",label:`Max: $${a.max_price}`}),a.in_stock&&c.push({key:"in_stock",label:"In Stock"}),a.on_sale&&c.push({key:"on_sale",label:"On Sale"}),a.ordering){let g={price:"Price: Low to High","-price":"Price: High to Low","-created_at":"Newest First",name:"A-Z","-popularity":"Most Popular"};c.push({key:"ordering",label:g[a.ordering]||a.ordering})}if(c.length===0){r.innerHTML="";return}r.innerHTML=`
            <div class="flex flex-wrap items-center gap-2 mb-4">
                <span class="text-sm text-stone-500 dark:text-stone-400">Active filters:</span>
                ${c.map(g=>`
                    <button data-remove-filter="${g.key}" class="inline-flex items-center gap-1 px-3 py-1 bg-primary-100 dark:bg-amber-900/30 text-primary-700 dark:text-amber-400 rounded-full text-sm hover:bg-primary-200 dark:hover:bg-amber-900/50 transition-colors">
                        ${g.label}
                        <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
                    </button>
                `).join("")}
                <button id="clear-all-active-filters" class="text-sm text-stone-500 dark:text-stone-400 hover:text-stone-700 dark:hover:text-stone-300 underline">Clear all</button>
            </div>
        `,r.querySelectorAll("[data-remove-filter]").forEach(g=>{g.addEventListener("click",()=>{let x=g.dataset.removeFilter;delete a[x],P()})}),document.getElementById("clear-all-active-filters")?.addEventListener("click",()=>{a={},P()})}function d(){m()}function m(r=null){let c=document.getElementById("product-count");c&&r!==null&&(c.textContent=`${r} products`)}function L(){let c=window.location.pathname.match(/\/categories\/([^\/]+)/);return c?c[1]:null}function T(){let r=new URLSearchParams(window.location.search),c={};r.get("min_price")&&(c.min_price=r.get("min_price")),r.get("max_price")&&(c.max_price=r.get("max_price")),r.get("ordering")&&(c.ordering=r.get("ordering")),r.get("in_stock")&&(c.in_stock=r.get("in_stock")==="true"),r.get("on_sale")&&(c.on_sale=r.get("on_sale")==="true");let g=r.getAll("attr");return g.length&&(c.attributes=g),c}async function N(r){let c=document.getElementById("category-header"),g=document.getElementById("category-products"),x=document.getElementById("category-filters");c&&Loader.show(c,"skeleton"),g&&Loader.show(g,"skeleton");try{let w=await CategoriesApi.getCategory(r);if(t=w.data||w,!t){window.location.href="/404/";return}V(t),await k(t),await S(t),await ee(),await se(t)}catch(w){console.error("Failed to load category:",w),c&&(c.innerHTML='<p class="text-red-500">Failed to load category.</p>')}}function V(r){let c=document.getElementById("category-header");c&&(document.title=`${r.name} | Bunoraa`,c.innerHTML=`
            <div class="relative py-8 md:py-12">
                ${r.image?`
                    <div class="absolute inset-0 overflow-hidden rounded-2xl">
                        <img src="${r.image}" alt="" class="w-full h-full object-cover opacity-20">
                        <div class="absolute inset-0 bg-gradient-to-r from-white via-white/95 to-white/80"></div>
                    </div>
                `:""}
                <div class="relative">
                    <h1 class="text-3xl md:text-4xl font-bold text-gray-900 mb-2">${Templates.escapeHtml(r.name)}</h1>
                    ${r.description?`
                        <p class="text-gray-600 max-w-2xl">${Templates.escapeHtml(r.description)}</p>
                    `:""}
                    ${r.product_count?`
                        <p class="mt-4 text-sm text-gray-500">${r.product_count} products</p>
                    `:""}
                </div>
            </div>
        `)}async function k(r){let c=document.getElementById("breadcrumbs");if(c)try{let x=(await CategoriesApi.getBreadcrumbs(r.id)).data||[],w=[{label:"Home",url:"/"},{label:"Categories",url:"/categories/"},...x.map(I=>({label:I.name,url:`/categories/${I.slug}/`}))];c.innerHTML=Breadcrumb.render(w)}catch(g){console.error("Failed to load breadcrumbs:",g)}}async function S(r){let c=document.getElementById("category-filters");if(c)try{let x=(await ProductsApi.getFilterOptions({category:r.id})).data||{};c.innerHTML=`
                <div class="space-y-6">
                    <!-- Price Range -->
                    <div class="border-b border-gray-200 pb-6">
                        <h3 class="text-sm font-semibold text-gray-900 mb-4">Price Range</h3>
                        <div class="flex items-center gap-2">
                            <input 
                                type="number" 
                                id="filter-min-price" 
                                placeholder="Min"
                                value="${a.min_price||""}"
                                class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-primary-500 focus:border-primary-500"
                            >
                            <span class="text-gray-400">-</span>
                            <input 
                                type="number" 
                                id="filter-max-price" 
                                placeholder="Max"
                                value="${a.max_price||""}"
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
                                    ${a.in_stock?"checked":""}
                                    class="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                                >
                                <span class="ml-2 text-sm text-gray-600">In Stock</span>
                            </label>
                            <label class="flex items-center">
                                <input 
                                    type="checkbox" 
                                    id="filter-on-sale"
                                    ${a.on_sale?"checked":""}
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
                                    ${w.values.map(I=>`
                                        <label class="flex items-center">
                                            <input 
                                                type="checkbox" 
                                                name="attr-${w.slug}"
                                                value="${Templates.escapeHtml(I.value)}"
                                                ${a.attributes?.includes(`${w.slug}:${I.value}`)?"checked":""}
                                                class="filter-attribute w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                                                data-attribute="${w.slug}"
                                            >
                                            <span class="ml-2 text-sm text-gray-600">${Templates.escapeHtml(I.value)}</span>
                                            ${I.count?`<span class="ml-auto text-xs text-gray-400">(${I.count})</span>`:""}
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
            `,U()}catch(g){console.error("Failed to load filters:",g),c.innerHTML=""}}function U(){let r=document.getElementById("apply-price-filter"),c=document.getElementById("filter-in-stock"),g=document.getElementById("filter-on-sale"),x=document.getElementById("clear-filters"),w=document.querySelectorAll(".filter-attribute");r?.addEventListener("click",()=>{let I=document.getElementById("filter-min-price")?.value,W=document.getElementById("filter-max-price")?.value;I?a.min_price=I:delete a.min_price,W?a.max_price=W:delete a.max_price,P()}),c?.addEventListener("change",I=>{I.target.checked?a.in_stock=!0:delete a.in_stock,P()}),g?.addEventListener("change",I=>{I.target.checked?a.on_sale=!0:delete a.on_sale,P()}),w.forEach(I=>{I.addEventListener("change",()=>{O(),P()})}),x?.addEventListener("click",()=>{a={},e=1,P()})}function O(){let r=document.querySelectorAll(".filter-attribute:checked"),c=[];r.forEach(g=>{c.push(`${g.dataset.attribute}:${g.value}`)}),c.length?a.attributes=c:delete a.attributes}function P(){e=1,X(),ee()}function X(){let r=new URLSearchParams;a.min_price&&r.set("min_price",a.min_price),a.max_price&&r.set("max_price",a.max_price),a.ordering&&r.set("ordering",a.ordering),a.in_stock&&r.set("in_stock","true"),a.on_sale&&r.set("on_sale","true"),a.attributes&&a.attributes.forEach(g=>r.append("attr",g)),e>1&&r.set("page",e);let c=`${window.location.pathname}${r.toString()?"?"+r.toString():""}`;window.history.pushState({},"",c)}async function ee(){let r=document.getElementById("category-products");if(!(!r||!t)){o&&o.abort(),o=new AbortController,Loader.show(r,"skeleton");try{let c={category:t.id,page:e,limit:12,...a};a.attributes&&(delete c.attributes,a.attributes.forEach(I=>{let[W,G]=I.split(":");c[`attr_${W}`]=G}));let g=await ProductsApi.getAll(c),x=g.data||[],w=g.meta||{};_=x,C=e<(w.total_pages||1),re(x,w),p(),m(w.total||x.length)}catch(c){if(c.name==="AbortError")return;console.error("Failed to load products:",c),r.innerHTML='<p class="text-red-500 text-center py-8">Failed to load products. Please try again.</p>'}}}function re(r,c){let g=document.getElementById("category-products");if(!g)return;let x=Storage.get("productViewMode")||"grid",w=x==="list"?"space-y-4":"grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6";if(r.length===0){g.innerHTML=`
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
            `,document.getElementById("clear-filters-empty")?.addEventListener("click",()=>{a={},e=1,P()});return}if(g.innerHTML=`
            <div id="active-filters" class="mb-4"></div>
            <div id="products-grid" class="${w}">
                ${r.map(I=>ProductCard.render(I,{layout:x,showCompare:!0,showQuickView:!0})).join("")}
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
            
            ${c.total_pages>1?`
                <div id="products-pagination" class="mt-8"></div>
            `:""}
        `,ProductCard.bindEvents(g),p(),B(),y(),c.total_pages>1){let I=document.getElementById("products-pagination");I.innerHTML=Pagination.render({currentPage:c.current_page||e,totalPages:c.total_pages,totalItems:c.total}),I.addEventListener("click",W=>{let G=W.target.closest("[data-page]");G&&(e=parseInt(G.dataset.page),C=!0,X(),ee(),window.scrollTo({top:0,behavior:"smooth"}))})}}async function se(r){let c=document.getElementById("subcategories");if(c)try{let x=(await CategoriesApi.getSubcategories(r.id)).data||[];if(x.length===0){c.innerHTML="";return}c.innerHTML=`
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
            `}catch(g){console.error("Failed to load subcategories:",g),c.innerHTML=""}}function oe(){let r=document.getElementById("mobile-filter-btn"),c=document.getElementById("filter-sidebar"),g=document.getElementById("close-filter-btn");r?.addEventListener("click",()=>{c?.classList.remove("hidden"),document.body.classList.add("overflow-hidden")}),g?.addEventListener("click",()=>{c?.classList.add("hidden"),document.body.classList.remove("overflow-hidden")})}function le(){let r=document.getElementById("sort-select");r&&(r.value=a.ordering||"",r.addEventListener("change",c=>{c.target.value?a.ordering=c.target.value:delete a.ordering,P()}))}function de(){let r=document.getElementById("view-grid"),c=document.getElementById("view-list");(Storage.get("productViewMode")||"grid")==="list"&&(r?.classList.remove("bg-gray-200"),c?.classList.add("bg-gray-200")),r?.addEventListener("click",()=>{Storage.set("productViewMode","grid"),r.classList.add("bg-gray-200"),c?.classList.remove("bg-gray-200"),ee()}),c?.addEventListener("click",()=>{Storage.set("productViewMode","list"),c.classList.add("bg-gray-200"),r?.classList.remove("bg-gray-200"),ee()})}function me(){o&&(o.abort(),o=null),a={},e=1,t=null,h=!1,v=!1,C=!0,_=[],document.getElementById("compare-bar")?.remove(),document.getElementById("quick-view-modal")?.remove(),document.getElementById("compare-modal")?.remove()}return{init:Y,destroy:me,toggleCompare:E,clearCompare:$}})();window.CategoryPage=bs;ir=bs});var Cs={};J(Cs,{default:()=>lr});var ks,lr,Es=Q(()=>{ks=(async function(){"use strict";let a=null,e={shipping_address:null,billing_address:null,same_as_shipping:!0,shipping_method:null,payment_method:null,notes:""},t=1;async function o(){if(!AuthApi.isAuthenticated()&&!document.getElementById("guest-checkout")){Toast.info("Please login to continue checkout."),window.location.href="/account/login/?next=/checkout/";return}if(await h(),!a||!a.items||a.items.length===0){Toast.warning("Your cart is empty."),window.location.href="/cart/";return}await C(),q(),n(),f()}async function h(){try{a=(await CartApi.getCart()).data,v()}catch(d){console.error("Failed to load cart:",d),Toast.error("Failed to load cart.")}}function v(){let d=document.getElementById("order-summary");!d||!a||(d.innerHTML=`
            <div class="bg-gray-50 rounded-xl p-6">
                <h3 class="text-lg font-semibold text-gray-900 mb-4">Order Summary</h3>
                
                <!-- Cart Items -->
                <div class="space-y-3 max-h-64 overflow-y-auto mb-4">
                    ${a.items.map(m=>`
                        <div class="flex gap-3">
                            <div class="flex-shrink-0 w-16 h-16 bg-gray-200 rounded-lg overflow-hidden">
                                ${m.product?.image?`
                                <img src="${m.product.image}" alt="" class="w-full h-full object-cover" onerror="this.style.display='none'">
                                `:`
                                <div class="w-full h-full flex items-center justify-center text-gray-400">
                                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                                    </svg>
                                </div>`}
                            </div>
                            <div class="flex-1 min-w-0">
                                <h4 class="text-sm font-medium text-gray-900 truncate">${Templates.escapeHtml(m.product?.name)}</h4>
                                ${m.variant?`<p class="text-xs text-gray-500">${Templates.escapeHtml(m.variant.name||m.variant.value)}</p>`:""}
                                <div class="flex justify-between mt-1">
                                    <span class="text-xs text-gray-500">Qty: ${m.quantity}</span>
                                    <span class="text-sm font-medium">${Templates.formatPrice(m.price*m.quantity)}</span>
                                </div>
                            </div>
                        </div>
                    `).join("")}
                </div>

                <div class="border-t border-gray-200 pt-4 space-y-2 text-sm">
                    <div class="flex justify-between">
                        <span class="text-gray-600">Subtotal</span>
                        <span class="font-medium">${Templates.formatPrice(a.subtotal||0)}</span>
                    </div>
                    ${a.discount_amount?`
                        <div class="flex justify-between text-green-600">
                            <span>Discount</span>
                            <span>-${Templates.formatPrice(a.discount_amount)}</span>
                        </div>
                    `:""}
                    <div class="flex justify-between" id="shipping-cost-row">
                        <span class="text-gray-600">Shipping</span>
                        <span class="font-medium" id="shipping-cost">Calculated next</span>
                    </div>
                    ${a.tax_amount?`
                        <div class="flex justify-between">
                            <span class="text-gray-600">Tax</span>
                            <span class="font-medium">${Templates.formatPrice(a.tax_amount)}</span>
                        </div>
                    `:""}
                    <div class="flex justify-between pt-2 border-t border-gray-200">
                        <span class="text-base font-semibold text-gray-900">Total</span>
                        <span class="text-base font-bold text-gray-900" id="order-total">${Templates.formatPrice(a.total||0)}</span>
                    </div>
                </div>
            </div>
        `)}async function C(){if(AuthApi.isAuthenticated())try{let m=(await AuthApi.getAddresses()).data||[],L=document.getElementById("saved-addresses");L&&m.length>0&&(L.innerHTML=`
                    <div class="mb-4">
                        <label class="block text-sm font-medium text-gray-700 mb-2">Saved Addresses</label>
                        <div class="space-y-2">
                            ${m.map(T=>`
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
                `,_())}catch(d){console.error("Failed to load addresses:",d)}}function _(){let d=document.querySelectorAll('input[name="saved_address"]'),m=document.getElementById("new-address-form");d.forEach(L=>{L.addEventListener("change",T=>{T.target.value==="new"?m?.classList.remove("hidden"):(m?.classList.add("hidden"),e.shipping_address=T.target.value)})})}function q(){let d=document.querySelectorAll("[data-step]"),m=document.querySelectorAll("[data-step-indicator]"),L=document.querySelectorAll("[data-next-step]"),T=document.querySelectorAll("[data-prev-step]");function N(V){d.forEach(k=>{k.classList.toggle("hidden",parseInt(k.dataset.step)!==V)}),m.forEach(k=>{let S=parseInt(k.dataset.stepIndicator);k.classList.toggle("bg-primary-600",S<=V),k.classList.toggle("text-white",S<=V),k.classList.toggle("bg-gray-200",S>V),k.classList.toggle("text-gray-600",S>V)}),t=V}L.forEach(V=>{V.addEventListener("click",async()=>{await R()&&(t===1&&await D(),N(t+1),window.scrollTo({top:0,behavior:"smooth"}))})}),T.forEach(V=>{V.addEventListener("click",()=>{N(t-1),window.scrollTo({top:0,behavior:"smooth"})})}),N(1)}async function R(){switch(t){case 1:return M();case 2:return $();case 3:return s();default:return!0}}function Y(d){d&&(d.querySelectorAll("[data-error-for]").forEach(m=>m.remove()),d.querySelectorAll(".!border-red-500").forEach(m=>m.classList.remove("!border-red-500")))}function j(d,m){if(!d)return;let L=d.getAttribute("name")||d.id||Math.random().toString(36).slice(2,8),T=d.closest("form")?.querySelector(`[data-error-for="${L}"]`);T&&T.remove();let N=document.createElement("p");N.className="text-sm text-red-600 mt-1",N.setAttribute("data-error-for",L),N.textContent=m,d.classList.add("!border-red-500"),d.nextSibling?d.parentNode.insertBefore(N,d.nextSibling):d.parentNode.appendChild(N)}function y(d){if(!d)return;let m=d.querySelector("[data-error-for]");if(!m)return;let L=m.getAttribute("data-error-for"),T=d.querySelector(`[name="${L}"]`)||d.querySelector(`#${L}`)||m.previousElementSibling;if(T&&typeof T.focus=="function")try{T.focus({preventScroll:!0})}catch{T.focus()}}function M(){let d=document.querySelector('input[name="saved_address"]:checked');if(d&&d.value!=="new")return Y(document.getElementById("new-address-form")||document.getElementById("information-form")),e.shipping_address=d.value,!0;let m=document.getElementById("shipping-address-form")||document.getElementById("information-form")||document.getElementById("new-address-form");if(!m)return!1;Y(m);let L=new FormData(m),T={first_name:L.get("first_name")||L.get("full_name")?.split(" ")?.[0],last_name:L.get("last_name")||(L.get("full_name")?L.get("full_name").split(" ").slice(1).join(" "):""),email:L.get("email"),phone:L.get("phone"),address_line_1:L.get("address_line1")||L.get("address_line_1"),address_line_2:L.get("address_line2")||L.get("address_line_2"),city:L.get("city"),state:L.get("state"),postal_code:L.get("postal_code"),country:L.get("country")},V=["email","first_name","address_line_1","city","postal_code"].filter(k=>!T[k]);if(V.length>0)return V.forEach(k=>{let S=`[name="${k}"]`;k==="address_line_1"&&(S='[name="address_line1"],[name="address_line_1"]');let U=m.querySelector(S);j(U||m,k.replace("_"," ").replace(/\b\w/g,O=>O.toUpperCase())+" is required.")}),y(m),!1;if(T.email&&!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(T.email)){let k=m.querySelector('[name="email"]');return j(k||m,"Please enter a valid email address."),y(m),!1}return e.shipping_address=T,!0}async function D(){let d=document.getElementById("shipping-methods");if(d){Loader.show(d,"spinner");try{let m=e.shipping_address;if(!m){d.innerHTML='<p class="text-gray-500">Please provide a shipping address to view shipping methods.</p>';return}let L=typeof m=="object"?{country:m.country,postal_code:m.postal_code,city:m.city}:{address_id:m},N=(await ShippingApi.getRates(L)).data||[];if(N.length===0){d.innerHTML='<p class="text-gray-500">No shipping methods available for your location.</p>';return}d.innerHTML=`
                <div class="space-y-3">
                    ${N.map((k,S)=>`
                        <label class="flex items-center justify-between p-4 border border-gray-200 rounded-lg cursor-pointer hover:border-primary-500 transition-colors">
                            <div class="flex items-center">
                                <input 
                                    type="radio" 
                                    name="shipping_method" 
                                    value="${k.id}" 
                                    ${S===0?"checked":""}
                                    class="text-primary-600 focus:ring-primary-500"
                                    data-price="${k.price}"
                                >
                                <div class="ml-3">
                                    <p class="font-medium text-gray-900">${Templates.escapeHtml(k.name)}</p>
                                    ${k.description?`<p class="text-sm text-gray-500">${Templates.escapeHtml(k.description)}</p>`:""}
                                    ${k.estimated_days?`<p class="text-sm text-gray-500">Delivery in ${k.estimated_days} days</p>`:""}
                                </div>
                            </div>
                            <span class="font-semibold text-gray-900">${k.price>0?Templates.formatPrice(k.price):"Free"}</span>
                        </label>
                    `).join("")}
                </div>
            `,d.querySelectorAll('input[name="shipping_method"]').forEach((k,S)=>{k.__price=N[S]?N[S].price:0,k.addEventListener("change",()=>{B(parseFloat(k.__price)||0)})}),N.length>0&&(e.shipping_method=N[0].id,B(N[0].price||0))}catch(m){console.error("Failed to load shipping methods:",m),d.innerHTML='<p class="text-red-500">Failed to load shipping methods. Please try again.</p>'}}}async function A(){let d=document.getElementById("payment-methods-container");if(d)try{let m=new URLSearchParams;window.CONFIG&&CONFIG.shippingData&&CONFIG.shippingData.countryCode&&m.set("country",CONFIG.shippingData.countryCode),a&&(a.total||a.total===0)&&m.set("amount",a.total);let T=await(await fetch(`/api/v1/payments/gateways/available/?${m.toString()}`,{credentials:"same-origin"})).json(),N=T&&T.data||[],V=d.querySelectorAll(".payment-option");if(V&&V.length>0){try{let S=Array.from(V).map(P=>P.dataset.gateway).filter(Boolean),U=(N||[]).map(P=>P.code);if(S.length===U.length&&S.every((P,X)=>P===U[X])){n();return}}catch(S){console.warn("Failed to compare existing payment gateways:",S)}if(N.length===0)return}if(!N||N.length===0){d.innerHTML=`
                    <div class="text-center py-8 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl">
                        <svg class="w-16 h-16 mx-auto mb-4 text-gray-300 dark:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"></path></svg>
                        <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">No payment methods are configured</h3>
                        <p class="text-gray-500 dark:text-gray-400 mb-2">We don't have any payment providers configured for your currency or location. Please contact support to enable online payments.</p>
                        <p class="text-sm text-gray-400">You can still place an order if Cash on Delivery or Bank Transfer is available from admin.</p>
                    </div>
                `;return}let k=document.createDocumentFragment();N.forEach((S,U)=>{let O=document.createElement("div");O.className="relative payment-option transform transition-all duration-300 hover:scale-[1.01]",O.dataset.gateway=S.code,O.style.animation="slideIn 0.3s ease-out both",O.style.animationDelay=`${U*80}ms`;let P=document.createElement("input");P.type="radio",P.name="payment_method",P.value=S.code,P.id=`payment-${S.code}`,P.className="peer sr-only",U===0&&(P.checked=!0);let X=document.createElement("label");X.setAttribute("for",P.id),X.className="flex items-center justify-between p-4 border-2 rounded-xl cursor-pointer transition-all duration-300 hover:border-gray-400 border-gray-200",X.innerHTML=`
                    <div class="flex items-center">
                        <div class="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mr-4">
                            ${S.icon_url?`<img src="${S.icon_url}" class="h-6" alt="${S.name}">`:`<span class="font-bold">${S.code.toUpperCase()}</span>`}
                        </div>
                        <div>
                            <p class="font-medium text-gray-900 dark:text-white">${Templates.escapeHtml(S.name)}</p>
                            <p class="text-sm text-gray-500 dark:text-gray-400">${Templates.escapeHtml(S.description||"")}</p>
                            ${S.fee_text?`<p class="text-xs text-amber-600 dark:text-amber-400 mt-1">${Templates.escapeHtml(S.fee_text)}</p>`:""}
                            ${S.instructions?`<p class="text-xs text-gray-500 dark:text-gray-400 mt-2">${S.instructions}</p>`:""}
                        </div>
                    </div>
                `,O.appendChild(P),O.appendChild(X);let ee=document.createElement("div");ee.className="absolute top-4 right-4 opacity-0 peer-checked:opacity-100 transition-opacity duration-300",ee.innerHTML='<svg class="w-6 h-6 text-primary-600" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"></path></svg>',O.appendChild(ee),k.appendChild(O),S.public_key&&S.requires_client&&E(S.public_key).catch(re=>console.error("Failed to load Stripe:",re))}),d.replaceChildren(k),n()}catch(m){console.error("Failed to load payment gateways:",m)}}function E(d){return new Promise((m,L)=>{if(window.Stripe&&window.STRIPE_PUBLISHABLE_KEY===d){m();return}if(window.STRIPE_PUBLISHABLE_KEY=d,window.Stripe){b(d),m();return}let T=document.createElement("script");T.src="https://js.stripe.com/v3/",T.async=!0,T.onload=()=>{try{b(d),m()}catch(N){L(N)}},T.onerror=N=>L(N),document.head.appendChild(T)})}function b(d){if(typeof Stripe>"u")throw new Error("Stripe script not loaded");try{let m=Stripe(d),T=m.elements().create("card"),N=document.getElementById("card-element");N&&(N.innerHTML="",T.mount("#card-element"),T.on("change",V=>{let k=document.getElementById("card-errors");k&&(k.textContent=V.error?V.error.message:"")}),window.stripeInstance=m,window.stripeCard=T)}catch(m){throw console.error("Error initializing Stripe elements:",m),m}}(function(){document.addEventListener("DOMContentLoaded",()=>{setTimeout(()=>{A()},50)})})();function B(d){let m=document.getElementById("shipping-cost"),L=document.getElementById("order-total");if(m&&(m.textContent=d>0?Templates.formatPrice(d):"Free"),L&&a){let T=(a.total||0)+d;L.textContent=Templates.formatPrice(T)}}function $(){let d=document.querySelector('input[name="shipping_method"]:checked');return d?(e.shipping_method=d.value,!0):(Toast.error("Please select a shipping method."),!1)}function f(){let d=document.getElementById("order-summary-toggle"),m=document.getElementById("order-summary-block");if(!d||!m)return;d.addEventListener("click",()=>{let T=m.classList.toggle("hidden");d.setAttribute("aria-expanded",(!T).toString());let N=d.querySelector("svg");N&&N.classList.toggle("rotate-180",!T)});let L=window.getComputedStyle(m).display==="none"||m.classList.contains("hidden");d.setAttribute("aria-expanded",(!L).toString())}function s(){let d=document.querySelector('input[name="payment_method"]:checked'),m=document.getElementById("payment-form");if(Y(m),!d){let T=document.getElementById("payment-methods-container")||m;return j(T,"Please select a payment method."),y(T),!1}let L=d.value;if(L==="stripe"){let T=document.getElementById("cardholder-name");if(!T||!T.value.trim())return j(T||m,"Cardholder name is required."),y(m),!1;if(!window.stripeCard)return j(document.getElementById("card-element")||m,"Card input not ready. Please wait and try again."),!1}if(L==="bkash"){let T=document.getElementById("bkash-number");if(!T||!T.value.trim())return j(T||m,"bKash mobile number is required."),y(m),!1}if(L==="nagad"){let T=document.getElementById("nagad-number");if(!T||!T.value.trim())return j(T||m,"Nagad mobile number is required."),y(m),!1}return e.payment_method=L,!0}function n(){let d=document.getElementById("same-as-shipping"),m=document.getElementById("billing-address-form");d?.addEventListener("change",V=>{e.same_as_shipping=V.target.checked,m?.classList.toggle("hidden",V.target.checked)}),document.querySelectorAll('input[name="payment_method"]').forEach(V=>{let k=S=>{document.querySelectorAll("[data-payment-form]").forEach(P=>{P.classList.add("hidden")});let U=S.target?S.target.value:V.value||null;if(!U)return;let O=document.querySelector(`[data-payment-form="${U}"]`);O||(O=document.getElementById(`${U}-form`)),O?.classList.remove("hidden")};V.addEventListener("change",k),V.checked&&k({target:V})});let T=document.getElementById("place-order-btn"),N=document.getElementById("place-order-form");T&&(!N||!N.action||N.action.includes("javascript"))&&T.addEventListener("click",async V=>{V.preventDefault(),await l()})}async function l(){if(!s())return;let d=document.getElementById("place-order-btn");d.disabled=!0,d.innerHTML='<svg class="animate-spin h-5 w-5 mx-auto" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>';try{let m=document.getElementById("order-notes")?.value;if(e.notes=m||"",!e.same_as_shipping){let N=document.getElementById("billing-address-form");if(N){let V=new FormData(N);e.billing_address={first_name:V.get("billing_first_name"),last_name:V.get("billing_last_name"),address_line_1:V.get("billing_address_line_1"),address_line_2:V.get("billing_address_line_2"),city:V.get("billing_city"),state:V.get("billing_state"),postal_code:V.get("billing_postal_code"),country:V.get("billing_country")}}}let T=(await CheckoutApi.createOrder(e)).data;e.payment_method==="stripe"||e.payment_method==="card"?await i(T):e.payment_method==="paypal"?await u(T):window.location.href=`/orders/${T.id}/confirmation/`}catch(m){console.error("Failed to place order:",m),Toast.error(m.message||"Failed to place order. Please try again."),d.disabled=!1,d.textContent="Place Order"}}async function i(d){try{let m=await CheckoutApi.createPaymentIntent(d.id),{client_secret:L}=m.data,T=m.data.publishable_key||window.STRIPE_PUBLISHABLE_KEY||(window.stripeInstance?window.STRIPE_PUBLISHABLE_KEY:null);if(typeof Stripe>"u"&&!window.stripeInstance)throw new Error("Stripe is not loaded.");let V=await(window.stripeInstance||Stripe(T)).confirmCardPayment(L,{payment_method:{card:window.stripeCard,billing_details:{name:`${e.shipping_address.first_name} ${e.shipping_address.last_name}`}}});if(V.error)throw new Error(V.error.message);window.location.href=`/orders/${d.id}/confirmation/`}catch(m){console.error("Stripe payment failed:",m),Toast.error(m.message||"Payment failed. Please try again.");let L=document.getElementById("place-order-btn");L.disabled=!1,L.textContent="Place Order"}}async function u(d){try{let m=await CheckoutApi.createPayPalOrder(d.id),{approval_url:L}=m.data;window.location.href=L}catch(m){console.error("PayPal payment failed:",m),Toast.error(m.message||"Payment failed. Please try again.");let L=document.getElementById("place-order-btn");L.disabled=!1,L.textContent="Place Order"}}function p(){a=null,e={shipping_address:null,billing_address:null,same_as_shipping:!0,shipping_method:null,payment_method:null,notes:""},t=1}return{init:o,destroy:p}})();window.CheckoutPage=ks;lr=ks});var $s={};J($s,{default:()=>dr});var Ls,dr,Ts=Q(()=>{Ls=(function(){"use strict";async function a(){_(),await R(),e()}function e(){t(),o(),h(),v(),C()}function t(){let j=document.getElementById("contact-map");if(!j)return;let y=j.dataset.lat||"0",M=j.dataset.lng||"0",D=j.dataset.address||"Our Location";j.innerHTML=`
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
        `,document.getElementById("open-live-chat")?.addEventListener("click",()=>{document.dispatchEvent(new CustomEvent("chat:open"))}))}function h(){let j=document.getElementById("quick-contact");if(!j)return;let y=[{icon:"phone",label:"Call Us",action:"tel:",color:"emerald"},{icon:"whatsapp",label:"WhatsApp",action:"https://wa.me/",color:"green"},{icon:"email",label:"Email",action:"mailto:",color:"blue"}];j.innerHTML=`
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
        `}function v(){let j=document.getElementById("faq-preview");if(!j)return;let y=[{q:"How long does shipping take?",a:"Standard shipping takes 5-7 business days. Express options are available at checkout."},{q:"What is your return policy?",a:"We offer a 30-day hassle-free return policy on all unused items in original packaging."},{q:"Do you ship internationally?",a:"Yes! We ship to over 100 countries worldwide."}];j.innerHTML=`
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
        `,j.querySelectorAll(".faq-trigger").forEach(M=>{M.addEventListener("click",()=>{let D=M.closest(".faq-item"),A=D.querySelector(".faq-answer"),E=D.querySelector(".faq-icon"),b=!A.classList.contains("hidden");j.querySelectorAll(".faq-item").forEach(B=>{B!==D&&(B.querySelector(".faq-answer").classList.add("hidden"),B.querySelector(".faq-icon").classList.remove("rotate-180"))}),A.classList.toggle("hidden"),E.classList.toggle("rotate-180")})})}function C(){let j=document.getElementById("office-status");if(!j)return;let y={start:9,end:18,timezone:"America/New_York",days:[1,2,3,4,5]};function M(){let D=new Date,A=D.getDay(),E=D.getHours(),B=y.days.includes(A)&&E>=y.start&&E<y.end;j.innerHTML=`
                <div class="flex items-center gap-3 p-4 rounded-xl ${B?"bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800":"bg-stone-100 dark:bg-stone-800 border border-stone-200 dark:border-stone-700"}">
                    <span class="relative flex h-3 w-3">
                        ${B?`<span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                             <span class="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>`:'<span class="relative inline-flex rounded-full h-3 w-3 bg-stone-400"></span>'}
                    </span>
                    <div>
                        <p class="font-medium ${B?"text-emerald-700 dark:text-emerald-400":"text-stone-600 dark:text-stone-400"}">
                            ${B?"We're Open!":"Currently Closed"}
                        </p>
                        <p class="text-xs ${B?"text-emerald-600 dark:text-emerald-500":"text-stone-500 dark:text-stone-500"}">
                            ${B?"Our team is available to help you.":`Office hours: Mon-Fri ${y.start}AM - ${y.end>12?y.end-12+"PM":y.end+"AM"}`}
                        </p>
                    </div>
                </div>
            `}M(),setInterval(M,6e4)}function _(){let j=document.getElementById("contact-form");if(!j)return;let y=FormValidator.create(j,{name:{required:!0,minLength:2,maxLength:100},email:{required:!0,email:!0},subject:{required:!0,minLength:5,maxLength:200},message:{required:!0,minLength:20,maxLength:2e3}});j.addEventListener("submit",async M=>{if(M.preventDefault(),!y.validate()){Toast.error("Please fill in all required fields correctly.");return}let D=j.querySelector('button[type="submit"]'),A=D.textContent;D.disabled=!0,D.innerHTML='<svg class="animate-spin h-5 w-5 mx-auto" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>';try{let E=new FormData(j),b={name:E.get("name"),email:E.get("email"),phone:E.get("phone"),subject:E.get("subject"),message:E.get("message")};await SupportApi.submitContactForm(b),Toast.success("Thank you for your message! We'll get back to you soon."),j.reset(),y.clearErrors(),q()}catch(E){Toast.error(E.message||"Failed to send message. Please try again.")}finally{D.disabled=!1,D.textContent=A}})}function q(){let j=document.getElementById("contact-form"),y=document.getElementById("contact-success");j&&y&&(j.classList.add("hidden"),y.classList.remove("hidden"),y.innerHTML=`
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
            `}catch(y){console.error("Failed to load contact info:",y)}}function Y(){}return{init:a,destroy:Y}})();window.ContactPage=Ls;dr=Ls});var Bs={};J(Bs,{default:()=>cr});var Is,cr,Ss=Q(()=>{Is=(function(){"use strict";let a=[],e=[];async function t(){let s=document.getElementById("faq-list");s&&s.querySelector(".faq-item")?j():await y(),B(),o()}function o(){h(),v(),C(),_(),q(),R(),Y()}function h(){if(!document.querySelector(".faq-search-container")||!("webkitSpeechRecognition"in window||"SpeechRecognition"in window))return;let n=window.SpeechRecognition||window.webkitSpeechRecognition,l=new n;l.continuous=!1,l.lang="en-US";let i=document.createElement("button");i.id="faq-voice-search",i.type="button",i.className="absolute right-12 top-1/2 -translate-y-1/2 p-2 text-stone-400 hover:text-primary-600 dark:hover:text-amber-400 transition-colors",i.innerHTML=`
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"/></svg>
        `;let u=document.getElementById("faq-search");u&&u.parentElement&&(u.parentElement.style.position="relative",u.parentElement.appendChild(i));let p=!1;i.addEventListener("click",()=>{p?l.stop():(l.start(),i.classList.add("text-red-500","animate-pulse")),p=!p}),l.onresult=d=>{let m=d.results[0][0].transcript;u&&(u.value=m,u.dispatchEvent(new Event("input"))),i.classList.remove("text-red-500","animate-pulse"),p=!1},l.onerror=()=>{i.classList.remove("text-red-500","animate-pulse"),p=!1}}function v(){document.querySelectorAll(".faq-content, .accordion-content, .faq-answer").forEach(s=>{if(s.querySelector(".faq-rating"))return;let l=(s.closest(".faq-item")||s.closest("[data-accordion]"))?.dataset.id||Math.random().toString(36).substr(2,9),i=`
                <div class="faq-rating mt-4 pt-4 border-t border-stone-200 dark:border-stone-700 flex items-center justify-between">
                    <span class="text-sm text-stone-500 dark:text-stone-400">Was this answer helpful?</span>
                    <div class="flex gap-2">
                        <button class="faq-rate-btn px-3 py-1 text-sm border border-stone-200 dark:border-stone-600 rounded-lg hover:bg-emerald-50 dark:hover:bg-emerald-900/20 hover:border-emerald-500 hover:text-emerald-600 dark:hover:text-emerald-400 transition-all" data-helpful="yes" data-question="${l}">
                            <span class="flex items-center gap-1">
                                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5"/></svg>
                                Yes
                            </span>
                        </button>
                        <button class="faq-rate-btn px-3 py-1 text-sm border border-stone-200 dark:border-stone-600 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 hover:border-red-500 hover:text-red-600 dark:hover:text-red-400 transition-all" data-helpful="no" data-question="${l}">
                            <span class="flex items-center gap-1">
                                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14H5.236a2 2 0 01-1.789-2.894l3.5-7A2 2 0 018.736 3h4.018a2 2 0 01.485.06l3.76.94m-7 10v5a2 2 0 002 2h.096c.5 0 .905-.405.905-.904 0-.715.211-1.413.608-2.008L17 13V4m-7 10h2m5-10h2a2 2 0 012 2v6a2 2 0 01-2 2h-2.5"/></svg>
                                No
                            </span>
                        </button>
                    </div>
                </div>
            `;s.insertAdjacentHTML("beforeend",i)}),document.addEventListener("click",s=>{let n=s.target.closest(".faq-rate-btn");if(!n)return;let l=n.dataset.helpful==="yes",i=n.dataset.question,u=n.closest(".faq-rating"),p=JSON.parse(localStorage.getItem("faqRatings")||"{}");p[i]=l,localStorage.setItem("faqRatings",JSON.stringify(p)),u.innerHTML=`
                <div class="flex items-center gap-2 text-sm ${l?"text-emerald-600 dark:text-emerald-400":"text-stone-500 dark:text-stone-400"}">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                    <span>Thanks for your feedback!</span>
                </div>
            `,typeof analytics<"u"&&analytics.track("faq_rated",{questionId:i,helpful:l})})}function C(){let s=document.getElementById("faq-contact-promo");s&&(s.innerHTML=`
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
        `,document.getElementById("open-chat-faq")?.addEventListener("click",()=>{document.dispatchEvent(new CustomEvent("chat:open"))}))}function _(){let s=document.getElementById("popular-questions");if(!s)return;let n=JSON.parse(localStorage.getItem("faqRatings")||"{}"),l=Object.entries(n).filter(([u,p])=>p).slice(0,5).map(([u])=>u),i=[];document.querySelectorAll(".faq-item, [data-accordion]").forEach(u=>{let p=u.dataset.id;if(l.includes(p)||i.length<3){let d=u.querySelector("button span, .accordion-toggle span")?.textContent?.trim();d&&i.push({id:p,question:d,element:u})}}),i.length!==0&&(s.innerHTML=`
            <div class="bg-primary-50 dark:bg-amber-900/20 rounded-2xl p-6">
                <h3 class="font-semibold text-stone-900 dark:text-white mb-4 flex items-center gap-2">
                    <svg class="w-5 h-5 text-primary-600 dark:text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"/></svg>
                    Most Helpful Questions
                </h3>
                <ul class="space-y-2">
                    ${i.slice(0,5).map(u=>`
                        <li>
                            <button class="popular-q-link text-left text-primary-600 dark:text-amber-400 hover:underline text-sm" data-target="${u.id}">
                                ${Templates.escapeHtml(u.question)}
                            </button>
                        </li>
                    `).join("")}
                </ul>
            </div>
        `,s.querySelectorAll(".popular-q-link").forEach(u=>{u.addEventListener("click",()=>{let p=u.dataset.target,d=document.querySelector(`[data-id="${p}"], .faq-item`);if(d){d.scrollIntoView({behavior:"smooth",block:"center"});let m=d.querySelector(".faq-trigger, .accordion-toggle");m&&m.click()}})}))}function q(){document.querySelectorAll(".faq-content, .accordion-content, .faq-answer").forEach(s=>{if(s.querySelector(".faq-share"))return;let l=(s.closest(".faq-item")||s.closest("[data-accordion]"))?.querySelector("button span, .accordion-toggle span")?.textContent?.trim();if(!l)return;let i=`
                <div class="faq-share flex items-center gap-2 mt-3">
                    <span class="text-xs text-stone-400 dark:text-stone-500">Share:</span>
                    <button class="faq-share-btn p-1.5 hover:bg-stone-100 dark:hover:bg-stone-700 rounded transition-colors" data-platform="copy" title="Copy link">
                        <svg class="w-4 h-4 text-stone-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"/></svg>
                    </button>
                    <a href="https://twitter.com/intent/tweet?text=${encodeURIComponent("Q: "+l)}&url=${encodeURIComponent(window.location.href)}" target="_blank" rel="noopener noreferrer" class="faq-share-btn p-1.5 hover:bg-stone-100 dark:hover:bg-stone-700 rounded transition-colors" title="Share on Twitter">
                        <svg class="w-4 h-4 text-stone-400" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                    </a>
                    <a href="mailto:?subject=${encodeURIComponent("FAQ: "+l)}&body=${encodeURIComponent(window.location.href)}" class="faq-share-btn p-1.5 hover:bg-stone-100 dark:hover:bg-stone-700 rounded transition-colors" title="Share via email">
                        <svg class="w-4 h-4 text-stone-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
                    </a>
                </div>
            `;s.insertAdjacentHTML("beforeend",i)}),document.addEventListener("click",s=>{let n=s.target.closest('.faq-share-btn[data-platform="copy"]');n&&navigator.clipboard.writeText(window.location.href).then(()=>{let l=n.innerHTML;n.innerHTML='<svg class="w-4 h-4 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>',setTimeout(()=>{n.innerHTML=l},2e3)})})}function R(){let s=document.querySelectorAll(".faq-item, [data-accordion]"),n=-1;document.addEventListener("keydown",l=>{if(document.querySelector("#faq-container, #faq-list")){if(l.key==="ArrowDown"||l.key==="ArrowUp"){l.preventDefault(),l.key==="ArrowDown"?n=Math.min(n+1,s.length-1):n=Math.max(n-1,0);let i=s[n];if(i){i.scrollIntoView({behavior:"smooth",block:"center"});let u=i.querySelector(".faq-trigger, .accordion-toggle, button");u&&u.focus()}}if(l.key==="Enter"&&n>=0){let u=s[n]?.querySelector(".faq-trigger, .accordion-toggle");u&&u.click()}l.key==="/"&&document.activeElement?.tagName!=="INPUT"&&(l.preventDefault(),document.getElementById("faq-search")?.focus())}})}function Y(){let s=new IntersectionObserver(n=>{n.forEach(l=>{if(l.isIntersecting){let i=l.target,u=i.querySelector("button span, .accordion-toggle span")?.textContent?.trim(),p=JSON.parse(localStorage.getItem("faqViews")||"{}"),d=i.dataset.id||u?.substring(0,30);d&&(p[d]=(p[d]||0)+1,localStorage.setItem("faqViews",JSON.stringify(p)))}})},{threshold:.5});document.querySelectorAll(".faq-item, [data-accordion]").forEach(n=>{s.observe(n)}),document.addEventListener("click",n=>{let l=n.target.closest(".faq-trigger, .accordion-toggle");if(l){let i=l.closest(".faq-item, [data-accordion]"),u=l.querySelector("span")?.textContent?.trim();typeof analytics<"u"&&analytics.track("faq_opened",{question:u?.substring(0,100)})}})}function j(){let s=document.querySelectorAll(".category-tab"),n=document.querySelectorAll(".faq-category");s.forEach(i=>{i.addEventListener("click",u=>{u.preventDefault(),s.forEach(m=>{m.classList.remove("bg-primary-600","dark:bg-amber-600","text-white"),m.classList.add("bg-stone-100","dark:bg-stone-800","text-stone-700","dark:text-stone-300")}),i.classList.add("bg-primary-600","dark:bg-amber-600","text-white"),i.classList.remove("bg-stone-100","dark:bg-stone-800","text-stone-700","dark:text-stone-300");let p=i.dataset.category;p==="all"?n.forEach(m=>m.classList.remove("hidden")):n.forEach(m=>{m.classList.toggle("hidden",m.dataset.category!==p)});let d=document.getElementById("faq-search");d&&(d.value=""),document.querySelectorAll(".faq-item").forEach(m=>m.classList.remove("hidden"))})}),document.querySelectorAll(".accordion-toggle").forEach(i=>{i.addEventListener("click",()=>{let u=i.closest("[data-accordion]"),p=u.querySelector(".accordion-content"),d=u.querySelector(".accordion-icon"),m=!p.classList.contains("hidden");document.querySelectorAll("[data-accordion]").forEach(L=>{L!==u&&(L.querySelector(".accordion-content")?.classList.add("hidden"),L.querySelector(".accordion-icon")?.classList.remove("rotate-180"))}),m?(p.classList.add("hidden"),d.classList.remove("rotate-180")):(p.classList.remove("hidden"),d.classList.add("rotate-180"))})})}async function y(){let s=document.getElementById("faq-container");if(s){Loader.show(s,"skeleton");try{let l=(await PagesApi.getFAQs()).data||[];if(e=l,l.length===0){s.innerHTML=`
                    <div class="text-center py-12">
                        <svg class="w-16 h-16 text-stone-300 dark:text-stone-600 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                        </svg>
                        <p class="text-stone-500 dark:text-stone-400">No FAQs available at the moment.</p>
                    </div>
                `;return}a=M(l),D(a)}catch(n){console.error("Failed to load FAQs:",n),s.innerHTML=`
                <div class="text-center py-12">
                    <svg class="w-16 h-16 text-red-300 dark:text-red-600 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                    </svg>
                    <p class="text-red-500 dark:text-red-400">Failed to load FAQs. Please try again later.</p>
                </div>
            `}}}function M(s){let n={};return s.forEach(l=>{let i=l.category||"General";n[i]||(n[i]=[]),n[i].push(l)}),n}function D(s,n=""){let l=document.getElementById("faq-container");if(!l)return;let i=Object.keys(s);if(i.length===0){l.innerHTML=`
                <div class="text-center py-12">
                    <svg class="w-16 h-16 text-stone-300 dark:text-stone-600 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                    </svg>
                    <p class="text-stone-500 dark:text-stone-400">No FAQs found${n?` for "${Templates.escapeHtml(n)}"`:""}.</p>
                </div>
            `;return}l.innerHTML=`
            <!-- Category Tabs -->
            <div class="mb-8 overflow-x-auto scrollbar-hide">
                <div class="flex gap-2 pb-2">
                    <button class="faq-category-btn px-4 py-2 bg-primary-600 dark:bg-amber-600 text-white rounded-full text-sm font-medium whitespace-nowrap transition-colors" data-category="all">
                        All
                    </button>
                    ${i.map(u=>`
                        <button class="faq-category-btn px-4 py-2 bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 text-stone-600 dark:text-stone-300 rounded-full text-sm font-medium whitespace-nowrap transition-colors" data-category="${Templates.escapeHtml(u)}">
                            ${Templates.escapeHtml(u)}
                        </button>
                    `).join("")}
                </div>
            </div>

            <!-- FAQ Accordion -->
            <div id="faq-list" class="space-y-6">
                ${i.map(u=>`
                    <div class="faq-category" data-category="${Templates.escapeHtml(u)}">
                        <h2 class="text-lg font-semibold text-stone-900 dark:text-white mb-4">${Templates.escapeHtml(u)}</h2>
                        <div class="space-y-3">
                            ${s[u].map(p=>A(p,n)).join("")}
                        </div>
                    </div>
                `).join("")}
            </div>
        `,E(),b(),v(),q()}function A(s,n=""){let l=Templates.escapeHtml(s.question),i=s.answer;if(n){let u=new RegExp(`(${n.replace(/[.*+?^${}()|[\]\\]/g,"\\$&")})`,"gi");l=l.replace(u,'<mark class="bg-yellow-200 dark:bg-yellow-800">$1</mark>'),i=i.replace(u,'<mark class="bg-yellow-200 dark:bg-yellow-800">$1</mark>')}return`
            <div class="faq-item border border-stone-200 dark:border-stone-700 rounded-xl overflow-hidden bg-white dark:bg-stone-800" data-id="${s.id||""}">
                <button class="faq-trigger w-full px-6 py-4 text-left flex items-center justify-between hover:bg-stone-50 dark:hover:bg-stone-700/50 transition-colors">
                    <span class="font-medium text-stone-900 dark:text-white pr-4">${l}</span>
                    <svg class="faq-icon w-5 h-5 text-stone-500 dark:text-stone-400 flex-shrink-0 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
                    </svg>
                </button>
                <div class="faq-content hidden px-6 pb-4">
                    <div class="prose prose-sm dark:prose-invert max-w-none text-stone-600 dark:text-stone-300">
                        ${i}
                    </div>
                </div>
            </div>
        `}function E(){let s=document.querySelectorAll(".faq-category-btn"),n=document.querySelectorAll(".faq-category");s.forEach(l=>{l.addEventListener("click",()=>{s.forEach(u=>{u.classList.remove("bg-primary-600","dark:bg-amber-600","text-white"),u.classList.add("bg-stone-100","dark:bg-stone-800","text-stone-600","dark:text-stone-300")}),l.classList.add("bg-primary-600","dark:bg-amber-600","text-white"),l.classList.remove("bg-stone-100","dark:bg-stone-800","text-stone-600","dark:text-stone-300");let i=l.dataset.category;n.forEach(u=>{i==="all"||u.dataset.category===i?u.classList.remove("hidden"):u.classList.add("hidden")})})})}function b(){document.querySelectorAll(".faq-trigger").forEach(n=>{n.addEventListener("click",()=>{let l=n.closest(".faq-item"),i=l.querySelector(".faq-content"),u=l.querySelector(".faq-icon"),p=!i.classList.contains("hidden");document.querySelectorAll(".faq-item").forEach(d=>{d!==l&&(d.querySelector(".faq-content")?.classList.add("hidden"),d.querySelector(".faq-icon")?.classList.remove("rotate-180"))}),i.classList.toggle("hidden"),u.classList.toggle("rotate-180")})})}function B(){let s=document.getElementById("faq-search");if(!s)return;let n=null;s.addEventListener("input",i=>{let u=i.target.value.trim().toLowerCase();clearTimeout(n),n=setTimeout(()=>{if(document.querySelector(".accordion-toggle"))$(u);else if(a&&Object.keys(a).length>0){if(u.length<2){D(a);return}let d={};Object.entries(a).forEach(([m,L])=>{let T=L.filter(N=>N.question.toLowerCase().includes(u)||N.answer.toLowerCase().includes(u));T.length>0&&(d[m]=T)}),D(d,u)}},300)});let l=document.createElement("span");l.className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-stone-400 dark:text-stone-500 hidden md:block",l.textContent="Press / to search",s.parentElement&&(s.parentElement.style.position="relative",s.parentElement.appendChild(l),s.addEventListener("focus",()=>l.classList.add("hidden")),s.addEventListener("blur",()=>l.classList.remove("hidden")))}function $(s){let n=document.querySelectorAll(".faq-item"),l=document.querySelectorAll(".faq-category"),i=document.getElementById("no-results"),u=0;n.forEach(p=>{let d=p.querySelector(".accordion-toggle span, button span"),m=p.querySelector(".accordion-content"),L=d?d.textContent.toLowerCase():"",T=m?m.textContent.toLowerCase():"";!s||L.includes(s)||T.includes(s)?(p.classList.remove("hidden"),u++):p.classList.add("hidden")}),l.forEach(p=>{let d=p.querySelectorAll(".faq-item:not(.hidden)");p.classList.toggle("hidden",d.length===0)}),i&&i.classList.toggle("hidden",u>0)}function f(){a=[],e=[]}return{init:t,destroy:f}})();window.FAQPage=Is;cr=Is});var As={};J(As,{CategoryCard:()=>ur});function ur(a){let e=document.createElement("a");e.href=`/categories/${a.slug}/`,e.className="group block";let t=document.createElement("div");t.className="relative aspect-square rounded-xl overflow-hidden bg-gray-100";let o="";if(typeof a.image_url=="string"&&a.image_url?o=a.image_url:typeof a.image=="string"&&a.image?o=a.image:a.image&&typeof a.image=="object"?o=a.image.url||a.image.src||a.image_url||"":typeof a.banner_image=="string"&&a.banner_image?o=a.banner_image:a.banner_image&&typeof a.banner_image=="object"?o=a.banner_image.url||a.banner_image.src||"":typeof a.hero_image=="string"&&a.hero_image?o=a.hero_image:a.hero_image&&typeof a.hero_image=="object"?o=a.hero_image.url||a.hero_image.src||"":typeof a.thumbnail=="string"&&a.thumbnail?o=a.thumbnail:a.thumbnail&&typeof a.thumbnail=="object"&&(o=a.thumbnail.url||a.thumbnail.src||""),o){let C=document.createElement("img");C.src=o,C.alt=a.name||"",C.className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300",C.loading="lazy",C.decoding="async",C.onerror=_=>{try{C.remove();let q=document.createElement("div");q.className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary-100 to-primary-200",q.innerHTML='<svg class="w-12 h-12 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"/></svg>',t.appendChild(q)}catch{}},t.appendChild(C)}else{let C=document.createElement("div");C.className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary-100 to-primary-200",C.innerHTML='<svg class="w-12 h-12 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"/></svg>',t.appendChild(C)}let h=document.createElement("div");h.className="absolute inset-0 bg-gradient-to-t from-black/30 dark:from-black/60 to-transparent",t.appendChild(h),e.appendChild(t);let v=document.createElement("h3");if(v.className="mt-3 text-sm font-medium text-stone-900 group-hover:text-primary-600 transition-colors text-center dark:text-white",v.textContent=a.name,e.appendChild(v),a.product_count){let C=document.createElement("p");C.className="text-xs text-stone-600 dark:text-white/60 text-center",C.textContent=`${a.product_count} products`,e.appendChild(C)}return e}var _s=Q(()=>{});var qs={};J(qs,{default:()=>mr});var Ms,mr,Hs=Q(()=>{Ms=(function(){"use strict";let a=null,e=0,t=null,o=null;async function h(){await Promise.all([D(),E(),b(),B(),$(),f(),M(),y()]),s(),v(),C(),_(),q(),R(),Y(),j(),initBackToTop()}function v(){let l=document.getElementById("live-visitors");if(!l)return;e=Math.floor(Math.random()*50)+25;function i(){let u=Math.random()>.5?1:-1;e=Math.max(15,Math.min(100,e+u)),l.innerHTML=`
                <div class="flex items-center gap-2 px-3 py-1.5 bg-emerald-100 dark:bg-emerald-900/30 rounded-full">
                    <span class="relative flex h-2 w-2">
                        <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                        <span class="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                    </span>
                    <span class="text-xs font-medium text-emerald-700 dark:text-emerald-300">${e} browsing now</span>
                </div>
            `}i(),setInterval(i,8e3)}function C(){let l=[{type:"purchase",location:"Dhaka",time:"2 min ago",product:"Handcrafted Leather Bag"},{type:"purchase",location:"Sylhet",time:"5 min ago",product:"Artisan Ceramic Vase"},{type:"review",location:"Dhaka",time:"8 min ago",rating:5,product:"Woven Basket Set"},{type:"signup",location:"Rangpur",time:"12 min ago"},{type:"purchase",location:"Chattogram",time:"15 min ago",product:"Custom Jewelry Box"}],i=0,u=0,p=10;function d(){if(u>=p)return;let m=l[i],L=document.createElement("div");L.className="social-proof-popup fixed bottom-4 left-4 z-50 max-w-xs bg-white dark:bg-stone-800 rounded-xl shadow-2xl border border-stone-200 dark:border-stone-700 p-4 transform translate-y-full opacity-0 transition-all duration-500";let T="";m.type==="purchase"?T=`
                    <div class="flex items-start gap-3">
                        <div class="w-10 h-10 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center flex-shrink-0">
                            <svg class="w-5 h-5 text-emerald-600 dark:text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>
                        </div>
                        <div>
                            <p class="text-sm font-medium text-stone-900 dark:text-white">Someone in ${m.location} purchased</p>
                            <p class="text-sm text-stone-600 dark:text-stone-400">${m.product}</p>
                            <p class="text-xs text-stone-400 dark:text-stone-500 mt-1">${m.time}</p>
                        </div>
                    </div>
                `:m.type==="review"?T=`
                    <div class="flex items-start gap-3">
                        <div class="w-10 h-10 bg-amber-100 dark:bg-amber-900/30 rounded-full flex items-center justify-center flex-shrink-0">
                            <svg class="w-5 h-5 text-amber-600 dark:text-amber-400" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.967a1 1 0 00.95.69h4.178c.969 0 1.371 1.24.588 1.81l-3.385 2.46a1 1 0 00-.364 1.118l1.287 3.966c.3.922-.755 1.688-1.54 1.118l-3.385-2.46a1 1 0 00-1.175 0l-3.385 2.46c-.784.57-1.838-.196-1.54-1.118l1.287-3.966a1 1 0 00-.364-1.118l-3.385-2.46c-.783-.57-.38-1.81.588-1.81h4.178a1 1 0 00.95-.69l1.286-3.967z"/></svg>
                        </div>
                        <div>
                            <p class="text-sm font-medium text-stone-900 dark:text-white">New 5-star review from ${m.location}</p>
                            <p class="text-sm text-stone-600 dark:text-stone-400">"${m.product}"</p>
                            <p class="text-xs text-stone-400 dark:text-stone-500 mt-1">${m.time}</p>
                        </div>
                    </div>
                `:m.type==="signup"&&(T=`
                    <div class="flex items-start gap-3">
                        <div class="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center flex-shrink-0">
                            <svg class="w-5 h-5 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"/></svg>
                        </div>
                        <div>
                            <p class="text-sm font-medium text-stone-900 dark:text-white">New member joined</p>
                            <p class="text-sm text-stone-600 dark:text-stone-400">Someone in ${m.location} signed up</p>
                            <p class="text-xs text-stone-400 dark:text-stone-500 mt-1">${m.time}</p>
                        </div>
                    </div>
                `),L.innerHTML=`
                ${T}
                <button class="absolute top-2 right-2 text-stone-400 hover:text-stone-600 dark:hover:text-stone-300" onclick="this.parentElement.remove()">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
                </button>
            `,document.body.appendChild(L),u++,requestAnimationFrame(()=>{L.classList.remove("translate-y-full","opacity-0")}),setTimeout(()=>{L.classList.add("translate-y-full","opacity-0"),setTimeout(()=>L.remove(),500)},5e3),i=(i+1)%l.length,u>=p&&t&&clearInterval(t)}setTimeout(()=>{d(),t=setInterval(()=>{u<p?d():clearInterval(t)},3e4)},1e4)}function _(){let l=document.getElementById("recently-viewed-section"),i=document.getElementById("recently-viewed"),u=document.getElementById("clear-recently-viewed");if(!l||!i)return;let p=JSON.parse(localStorage.getItem("recentlyViewed")||"[]");if(p.length===0){l.classList.add("hidden");return}l.classList.remove("hidden"),i.innerHTML=p.slice(0,5).map(d=>{let m=null;return d.discount_percent&&d.discount_percent>0&&(m=`-${d.discount_percent}%`),ProductCard.render(d,{showBadge:!!m,badge:m,priceSize:"small"})}).join(""),ProductCard.bindEvents(i),u?.addEventListener("click",()=>{localStorage.removeItem("recentlyViewed"),l.classList.add("hidden"),Toast.success("Recently viewed items cleared")})}function q(){let l=document.getElementById("flash-sale-section"),i=document.getElementById("flash-sale-countdown");if(!l||!i)return;if(!localStorage.getItem("flashSaleEnd")){let m=new Date().getTime()+144e5;localStorage.setItem("flashSaleEnd",m.toString())}let p=parseInt(localStorage.getItem("flashSaleEnd"));function d(){let m=new Date().getTime(),L=p-m;if(L<=0){l.classList.add("hidden"),clearInterval(o),localStorage.removeItem("flashSaleEnd");return}l.classList.remove("hidden");let T=Math.floor(L%(1e3*60*60*24)/(1e3*60*60)),N=Math.floor(L%(1e3*60*60)/(1e3*60)),V=Math.floor(L%(1e3*60)/1e3);i.innerHTML=`
                <div class="flex items-center gap-2 text-white">
                    <span class="text-sm font-medium">Ends in:</span>
                    <div class="flex items-center gap-1">
                        <span class="bg-white/20 px-2 py-1 rounded font-mono font-bold">${T.toString().padStart(2,"0")}</span>
                        <span class="font-bold">:</span>
                        <span class="bg-white/20 px-2 py-1 rounded font-mono font-bold">${N.toString().padStart(2,"0")}</span>
                        <span class="font-bold">:</span>
                        <span class="bg-white/20 px-2 py-1 rounded font-mono font-bold">${V.toString().padStart(2,"0")}</span>
                    </div>
                </div>
            `}d(),o=setInterval(d,1e3)}async function R(){let l=document.getElementById("artisan-spotlight");if(l)try{let i=[{name:"Sarah Chen",specialty:"Ceramic Art",image:"/static/images/artisans/sarah.jpg",story:"Third-generation potter from the mountain villages, crafting unique pieces for over 15 years.",products:45,rating:4.9},{name:"Ahmed Hassan",specialty:"Leatherwork",image:"/static/images/artisans/ahmed.jpg",story:"Master craftsman preserving traditional techniques passed down through generations.",products:32,rating:4.8},{name:"Maria Santos",specialty:"Textile Weaving",image:"/static/images/artisans/maria.jpg",story:"Creating vibrant handwoven textiles using natural dyes and ancestral patterns.",products:28,rating:4.9}];l.innerHTML=`
                <div class="grid md:grid-cols-3 gap-6">
                    ${i.map(u=>`
                        <div class="group relative bg-white dark:bg-stone-800 rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
                            <div class="aspect-[4/3] overflow-hidden bg-stone-100 dark:bg-stone-700">
                                <img src="${u.image}" alt="${Templates.escapeHtml(u.name)}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" decoding="async">
                            </div>
                            <div class="p-6">
                                <div class="flex items-center justify-between mb-2">
                                    <h3 class="text-lg font-semibold text-stone-900 dark:text-white">${Templates.escapeHtml(u.name)}</h3>
                                    <div class="flex items-center gap-1 text-amber-500">
                                        <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.967a1 1 0 00.95.69h4.178c.969 0 1.371 1.24.588 1.81l-3.385 2.46a1 1 0 00-.364 1.118l1.287 3.966c.3.922-.755 1.688-1.54 1.118l-3.385-2.46a1 1 0 00-1.175 0l-3.385 2.46c-.784.57-1.838-.196-1.54-1.118l1.287-3.966a1 1 0 00-.364-1.118l-3.385-2.46c-.783-.57-.38-1.81.588-1.81h4.178a1 1 0 00.95-.69l1.286-3.967z"/></svg>
                                        <span class="text-sm font-medium">${u.rating}</span>
                                    </div>
                                </div>
                                <p class="text-sm text-primary-600 dark:text-amber-400 font-medium mb-3">${Templates.escapeHtml(u.specialty)}</p>
                                <p class="text-sm text-stone-600 dark:text-stone-400 mb-4 line-clamp-2">${Templates.escapeHtml(u.story)}</p>
                                <div class="flex items-center justify-between">
                                    <span class="text-xs text-stone-500 dark:text-stone-500">${u.products} products</span>
                                    <a href="/artisans/${u.name.toLowerCase().replace(/\s+/g,"-")}/" class="text-sm font-medium text-primary-600 dark:text-amber-400 hover:underline">View Profile \u2192</a>
                                </div>
                            </div>
                        </div>
                    `).join("")}
                </div>
            `}catch(i){console.warn("Artisan spotlight unavailable:",i)}}function Y(){let l=document.querySelectorAll("[data-animate]");if(!l.length)return;let i=new IntersectionObserver(u=>{u.forEach(p=>{if(p.isIntersecting){let d=p.target.dataset.animate||"fadeInUp";p.target.classList.add("animate-"+d),p.target.classList.remove("opacity-0"),i.unobserve(p.target)}})},{threshold:.1,rootMargin:"0px 0px -50px 0px"});l.forEach(u=>{u.classList.add("opacity-0"),i.observe(u)})}function j(){document.addEventListener("click",async l=>{let i=l.target.closest("[data-quick-view]");if(!i)return;let u=i.dataset.quickView;if(!u)return;l.preventDefault();let p=document.createElement("div");p.id="quick-view-modal",p.className="fixed inset-0 z-50 flex items-center justify-center p-4",p.innerHTML=`
                <div class="absolute inset-0 bg-black/50 backdrop-blur-sm" onclick="document.getElementById('quick-view-modal').remove()"></div>
                <div class="relative bg-white dark:bg-stone-800 rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-auto">
                    <button class="absolute top-4 right-4 z-10 w-10 h-10 bg-stone-100 dark:bg-stone-700 rounded-full flex items-center justify-center hover:bg-stone-200 dark:hover:bg-stone-600 transition-colors" onclick="document.getElementById('quick-view-modal').remove()">
                        <svg class="w-5 h-5 text-stone-600 dark:text-stone-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
                    </button>
                    <div class="p-8 flex items-center justify-center min-h-[400px]">
                        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
                    </div>
                </div>
            `,document.body.appendChild(p);try{let d=await ProductsApi.getProduct(u),m=d.data||d,L=p.querySelector(".relative");L.innerHTML=`
                    <button class="absolute top-4 right-4 z-10 w-10 h-10 bg-stone-100 dark:bg-stone-700 rounded-full flex items-center justify-center hover:bg-stone-200 dark:hover:bg-stone-600 transition-colors" onclick="document.getElementById('quick-view-modal').remove()">
                        <svg class="w-5 h-5 text-stone-600 dark:text-stone-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
                    </button>
                    <div class="grid md:grid-cols-2 gap-8 p-8">
                        <div class="aspect-square rounded-xl overflow-hidden bg-stone-100 dark:bg-stone-700">
                            <img src="${m.primary_image||m.image||"/static/images/placeholder.jpg"}" alt="${Templates.escapeHtml(m.name)}" class="w-full h-full object-cover">
                        </div>
                        <div class="flex flex-col">
                            <h2 class="text-2xl font-bold text-stone-900 dark:text-white mb-2">${Templates.escapeHtml(m.name)}</h2>
                            <div class="flex items-center gap-2 mb-4">
                                <div class="flex text-amber-400">
                                    ${'<svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.967a1 1 0 00.95.69h4.178c.969 0 1.371 1.24.588 1.81l-3.385 2.46a1 1 0 00-.364 1.118l1.287 3.966c.3.922-.755 1.688-1.54 1.118l-3.385-2.46a1 1 0 00-1.175 0l-3.385 2.46c-.784.57-1.838-.196-1.54-1.118l1.287-3.966a1 1 0 00-.364-1.118l-3.385-2.46c-.783-.57-.38-1.81.588-1.81h4.178a1 1 0 00.95-.69l1.286-3.967z"/></svg>'.repeat(Math.round(m.rating||4))}
                                </div>
                                <span class="text-sm text-stone-500 dark:text-stone-400">(${m.review_count||0} reviews)</span>
                            </div>
                            <div class="mb-6">
                                ${m.sale_price||m.discounted_price?`
                                    <span class="text-3xl font-bold text-primary-600 dark:text-amber-400">${Templates.formatPrice(m.sale_price||m.discounted_price)}</span>
                                    <span class="text-lg text-stone-400 line-through ml-2">${Templates.formatPrice(m.price)}</span>
                                `:`
                                    <span class="text-3xl font-bold text-stone-900 dark:text-white">${Templates.formatPrice(m.price)}</span>
                                `}
                            </div>
                            <p class="text-stone-600 dark:text-stone-400 mb-6 line-clamp-3">${Templates.escapeHtml(m.short_description||m.description||"")}</p>
                            <div class="mt-auto space-y-3">
                                <button class="w-full py-3 px-6 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-xl transition-colors" onclick="CartApi.addItem(${m.id}, 1).then(() => { Toast.success('Added to cart'); document.getElementById('quick-view-modal').remove(); })">
                                    Add to Cart
                                </button>
                                <a href="/products/${m.slug||m.id}/" class="block w-full py-3 px-6 border-2 border-stone-200 dark:border-stone-600 text-stone-700 dark:text-stone-300 font-semibold rounded-xl text-center hover:bg-stone-50 dark:hover:bg-stone-700 transition-colors">
                                    View Full Details
                                </a>
                            </div>
                        </div>
                    </div>
                `}catch(d){console.error("Failed to load product:",d),p.remove(),Toast.error("Failed to load product details")}})}async function y(){let l=document.getElementById("testimonials-grid");if(l){Loader.show(l,"skeleton");try{let i=await CategoriesApi.getCategories({pageSize:6,featured:!0}),u=i?.data?.results||i?.data||i?.results||[],p=[];for(let d of u){let m=await ProductsApi.getProducts({category:d.id,featured:!0,pageSize:3}),L=m?.data?.results||m?.data||m?.results||[];for(let T of L){let N=await ProductsApi.getReviews(T.id,{pageSize:2}),V=N?.data?.results||N?.data||N?.results||[];V.forEach(k=>{k._product=T,k._category=d}),p.push(...V)}}if(l.innerHTML="",!p.length){l.innerHTML='<p class="text-gray-500 text-center py-8">No user reviews available.</p>';return}p=p.slice(0,6),p.forEach(d=>{let m=document.createElement("div");m.className="rounded-2xl bg-white dark:bg-stone-800 shadow p-6 flex flex-col gap-3",m.innerHTML=`
                        <div class="flex items-center gap-3 mb-2">
                            <div class="w-10 h-10 rounded-full bg-primary-100 dark:bg-stone-700 flex items-center justify-center text-lg font-bold text-primary-700 dark:text-amber-400">
                                ${d.user?.first_name?.[0]||d.user?.username?.[0]||"?"}
                            </div>
                            <div>
                                <div class="font-semibold text-gray-900 dark:text-white">${d.user?.first_name||d.user?.username||"Anonymous"}</div>
                                <div class="text-xs text-gray-500 dark:text-stone-400">${d.created_at?new Date(d.created_at).toLocaleDateString():""}</div>
                            </div>
                        </div>
                        <div class="flex gap-1 mb-1">
                            ${'<svg class="w-4 h-4 text-amber-400" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.967a1 1 0 00.95.69h4.178c.969 0 1.371 1.24.588 1.81l-3.385 2.46a1 1 0 00-.364 1.118l1.287 3.966c.3.922-.755 1.688-1.54 1.118l-3.385-2.46a1 1 0 00-1.175 0l-3.385 2.46c-.784.57-1.838-.196-1.54-1.118l1.287-3.966a1 1 0 00-.364-1.118l-3.385-2.46c-.783-.57-.38-1.81.588-1.81h4.178a1 1 0 00.95-.69l1.286-3.967z"/></svg>'.repeat(Math.round(d.rating||5))}
                        </div>
                        <div class="text-gray-800 dark:text-stone-200 text-base mb-2">${Templates.escapeHtml(d.title||"")}</div>
                        <div class="text-gray-600 dark:text-stone-400 text-sm">${Templates.escapeHtml(d.content||"")}</div>
                        <div class="mt-2 text-xs text-primary-700 dark:text-amber-400 font-semibold">${d._category?Templates.escapeHtml(d._category.name):""}${d._product?" - "+Templates.escapeHtml(d._product.name):""}</div>
                    `,l.appendChild(m)})}catch(i){console.error("Failed to load testimonials:",i),l.innerHTML='<p class="text-red-500 text-center py-8">Failed to load testimonials. Please try again later.</p>'}}}async function M(){let l=document.getElementById("best-sellers");if(!l)return;let i=l.querySelector(".products-grid")||l;Loader.show(i,"skeleton");try{let u=await ProductsApi.getProducts({bestseller:!0,pageSize:5}),p=u.data?.results||u.data||u.results||[];if(p.length===0){i.innerHTML='<p class="text-gray-500 text-center py-8">No best sellers available.</p>';return}i.innerHTML=p.map(d=>{let m=null;return d.discount_percent&&d.discount_percent>0&&(m=`-${d.discount_percent}%`),ProductCard.render(d,{showBadge:!!m,badge:m,priceSize:"small"})}).join(""),ProductCard.bindEvents(i)}catch(u){console.error("Failed to load best sellers:",u),i.innerHTML='<p class="text-red-500 text-center py-8">Failed to load products. Please try again later.</p>'}}async function D(){let l=document.getElementById("hero-slider");if(l)try{let i=await PagesApi.getBanners("home_hero"),u=i.data?.results||i.data||i.results||[];if(u.length===0){l.innerHTML="";return}l.innerHTML=`
                <div class="relative overflow-hidden w-full h-[55vh] sm:h-[70vh] md:h-[80vh]">
                    <div class="hero-slides relative w-full h-full">
                        ${u.map((p,d)=>`
                            <div class="hero-slide ${d===0?"":"hidden"} w-full h-full" data-index="${d}">
                                <a href="${p.link_url||"#"}" class="block relative w-full h-full">
                                    <img 
                                        src="${p.image}" 
                                        alt="${Templates.escapeHtml(p.title||"")}"
                                        class="absolute inset-0 w-full h-full object-cover"
                                        loading="${d===0?"eager":"lazy"}"
                                        decoding="async"
                                    >
                                    ${p.title||p.subtitle?`
                                        <div class="absolute inset-0 bg-gradient-to-r from-black/60 via-black/30 to-transparent flex items-center">
                                            <div class="px-8 md:px-16 max-w-xl">
                                                ${p.title?`<h2 class="text-2xl sm:text-3xl md:text-5xl font-bold text-white mb-4">${Templates.escapeHtml(p.title)}</h2>`:""}
                                                ${p.subtitle?`<p class="text-sm sm:text-lg text-white/90 mb-6">${Templates.escapeHtml(p.subtitle)}</p>`:""}
                                                ${p.link_text||p.button_text?`
                                                    <span class="inline-flex items-center px-6 py-3 bg-white text-gray-900 font-semibold rounded-lg hover:bg-gray-100 transition-colors">
                                                        ${Templates.escapeHtml(p.link_text||p.button_text)}
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
                    ${u.length>1?`
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
                            ${u.map((p,d)=>`
                                <button class="w-3 h-3 rounded-full transition-colors ${d===0?"bg-white dark:bg-stone-200":"bg-white/50 dark:bg-stone-600/60 hover:bg-white/75 dark:hover:bg-stone-500/80"}" data-slide="${d}" aria-label="Go to slide ${d+1}"></button>
                            `).join("")}
                        </div>
                    `:""}
                </div>
            `,u.length>1&&A(u.length)}catch(i){console.warn("Hero banners unavailable:",i?.status||i)}}function A(l){let i=0,u=document.querySelectorAll(".hero-slide"),p=document.querySelectorAll(".hero-dots button"),d=document.querySelector(".hero-prev"),m=document.querySelector(".hero-next");function L(N){u[i].classList.add("hidden"),p[i]?.classList.remove("bg-stone-100"),p[i]?.classList.add("bg-white/50"),i=(N+l)%l,u[i].classList.remove("hidden"),p[i]?.classList.add("bg-stone-100"),p[i]?.classList.remove("bg-white/50")}d?.addEventListener("click",()=>{L(i-1),T()}),m?.addEventListener("click",()=>{L(i+1),T()}),p.forEach((N,V)=>{N.addEventListener("click",()=>{L(V),T()})});function T(){a&&clearInterval(a),a=setInterval(()=>L(i+1),5e3)}try{let N=document.querySelector(".hero-slides"),V=0;N?.addEventListener("touchstart",k=>{V=k.touches[0].clientX},{passive:!0}),N?.addEventListener("touchend",k=>{let U=k.changedTouches[0].clientX-V;Math.abs(U)>50&&(U<0?L(i+1):L(i-1),T())})}catch{}T()}async function E(){let l=document.getElementById("featured-products");if(!l)return;let i=l.querySelector(".products-grid")||l;Loader.show(i,"skeleton");try{let u=await ProductsApi.getFeatured(8),p=u.data?.results||u.data||u.results||[];if(p.length===0){i.innerHTML='<p class="text-gray-500 text-center py-8">No featured products available.</p>';return}i.innerHTML=p.map(d=>{let m=null;return d.discount_percent&&d.discount_percent>0&&(m=`-${d.discount_percent}%`),ProductCard.render(d,{showBadge:!!m,badge:m,priceSize:"small"})}).join(""),ProductCard.bindEvents(i)}catch(u){console.error("Failed to load featured products:",u),i.innerHTML='<p class="text-red-500 text-center py-8">Failed to load products. Please try again later.</p>'}}async function b(){let l=document.getElementById("categories-showcase");if(l){Loader.show(l,"skeleton");try{try{window.ApiClient?.clearCache("/api/v1/catalog/categories/")}catch{}let i=await window.ApiClient.get("/catalog/categories/",{page_size:6,is_featured:!0},{useCache:!1}),u=i.data?.results||i.data||i.results||[];if(u.length===0){l.innerHTML="";return}let p;try{p=(await Promise.resolve().then(()=>(_s(),As))).CategoryCard}catch(d){console.error("Failed to import CategoryCard:",d);return}l.innerHTML="",u.forEach(d=>{let m=p(d);try{let L=m.querySelector("img");console.info("[Home] card image for",d.name,L?L.src:"NO_IMAGE")}catch{}l.appendChild(m)}),l.classList.add("grid","grid-cols-2","sm:grid-cols-2","md:grid-cols-3","lg:grid-cols-6","gap-4","lg:gap-6")}catch(i){console.error("Failed to load categories:",i),l.innerHTML=""}}}async function B(){let l=document.getElementById("new-arrivals");if(!l)return;let i=l.querySelector(".products-grid")||l;Loader.show(i,"skeleton");try{let u=await ProductsApi.getNewArrivals(4),p=u.data?.results||u.data||u.results||[];if(p.length===0){i.innerHTML='<p class="text-gray-500 text-center py-8">No new products available.</p>';return}i.innerHTML=p.map(d=>{let m=null;return d.discount_percent&&d.discount_percent>0&&(m=`-${d.discount_percent}%`),ProductCard.render(d,{showBadge:!!m,badge:m,priceSize:"small"})}).join(""),ProductCard.bindEvents(i)}catch(u){console.error("Failed to load new arrivals:",u),i.innerHTML='<p class="text-red-500 text-center py-8">Failed to load products.</p>'}}async function $(){let l=document.getElementById("promotions-banner")||document.getElementById("promotion-banners");if(l)try{let i=await PagesApi.getPromotions(),u=i?.data?.results??i?.results??i?.data??[];if(Array.isArray(u)||(u&&typeof u=="object"?u=Array.isArray(u.items)?u.items:[u]:u=[]),u.length===0){l.innerHTML="";return}let p=u[0]||{};l.innerHTML=`
                <div class="bg-gradient-to-r from-primary-600 to-primary-700 rounded-2xl overflow-hidden">
                    <div class="px-6 py-8 md:px-12 md:py-12 flex flex-col md:flex-row items-center justify-between gap-6">
                        <div class="text-center md:text-left">
                            <span class="inline-block px-3 py-1 bg-white/20 text-white text-sm font-medium rounded-full mb-3">
                                Limited Time Offer
                            </span>
                            <h3 class="text-2xl md:text-3xl font-bold text-white mb-2">
                                ${Templates.escapeHtml(p.title||p.name||"")}
                            </h3>
                            ${p.description?`
                                <p class="text-white/90 max-w-lg">${Templates.escapeHtml(p.description)}</p>
                            `:""}
                            ${p.discount_value?`
                                <p class="text-3xl font-bold text-white mt-4">
                                    ${p.discount_type==="percentage"?`${p.discount_value}% OFF`:`Save ${Templates.formatPrice(p.discount_value)}`}
                                </p>
                            `:""}
                        </div>
                        <div class="flex flex-col items-center gap-4">
                            ${p.code?`
                                <div class="bg-white/10 backdrop-blur-sm px-6 py-3 rounded-lg border-2 border-dashed border-white/30">
                                    <p class="text-sm text-white/80 mb-1">Use code:</p>
                                    <p class="text-2xl font-mono font-bold text-white tracking-wider">${Templates.escapeHtml(p.code)}</p>
                                </div>
                            `:""}
                            <a href="/products/?promotion=${p.id||""}" class="inline-flex items-center px-6 py-3 bg-stone-100 text-primary-600 font-semibold rounded-lg hover:bg-gray-100 transition-colors">
                                Shop Now
                                <svg class="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3"/>
                                </svg>
                            </a>
                        </div>
                    </div>
                </div>
            `}catch(i){console.warn("Promotions unavailable:",i?.status||i),l.innerHTML=""}}async function f(){let l=document.getElementById("custom-order-cta");if(!l||l.dataset?.loaded)return;l.dataset.loaded="1",l.innerHTML=`
            <div class="container mx-auto px-4">
                <div class="max-w-full w-full mx-auto rounded-3xl p-6 md:p-10">
                    <div class="animate-pulse">
                        <div class="h-6 w-1/3 bg-gray-200 dark:bg-stone-700 rounded mb-4"></div>
                        <div class="h-10 w-full bg-gray-200 dark:bg-stone-700 rounded mb-4"></div>
                        <div class="h-44 bg-gray-200 dark:bg-stone-800 rounded"></div>
                    </div>
                </div>
            </div>
        `;let i=window.BUNORAA_ROUTES||{},u=i.preordersWizard||"/preorders/create/",p=i.preordersLanding||"/preorders/";try{let d=[];if(typeof PreordersApi<"u"&&PreordersApi.getCategories)try{let m=await PreordersApi.getCategories({featured:!0,pageSize:4});d=m?.data?.results||m?.data||m?.results||[]}catch(m){console.warn("Pre-order categories unavailable:",m)}l.innerHTML=`
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
                            ${d.length>0?`
                                <div class="mb-8">
                                    <p class="text-stone-600 dark:text-white/60 text-sm mb-3">Popular categories:</p>
                                    <div class="flex flex-wrap gap-2">
                                        ${d.slice(0,4).map(m=>`
                                            <a href="${p}category/${m.slug}/" class="inline-flex items-center gap-2 px-4 py-2 bg-white/10 dark:bg-stone-800/30 hover:bg-white/20 dark:hover:bg-stone-700 rounded-full text-sm text-stone-900 dark:text-white transition-colors">
                                                ${m.icon?`<span>${m.icon}</span>`:""}
                                                ${Templates.escapeHtml(m.name)}
                                            </a>
                                        `).join("")}
                                    </div>
                                </div>
                            `:""}
                            <div class="flex flex-wrap gap-4">
                                <a href="${u}" class="cta-unlock inline-flex items-center gap-2 px-8 py-4 bg-amber-600 text-white font-bold rounded-xl shadow-lg hover:shadow-xl hover:text-black dark:hover:text-black transition-colors group dark:bg-amber-600 dark:text-white">
                                    Start Your Custom Order
                                    <svg class="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3"/></svg>
                                </a>
                                <a href="${p}" class="inline-flex items-center gap-2 px-8 py-4 bg-transparent text-stone-900 dark:text-white font-semibold rounded-xl border-2 border-stone-200 dark:border-stone-700 hover:bg-stone-100 dark:hover:bg-stone-800 transition-all">
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
            `}catch(d){console.warn("Custom order CTA failed to load:",d),l.innerHTML=`
                <div class="container mx-auto px-4 text-center text-stone-900 dark:text-white">
                    <h2 class="text-3xl lg:text-4xl font-display font-bold mb-4 text-stone-900 dark:text-white">Create Your Perfect Custom Order</h2>
                    <p class="text-stone-700 dark:text-white/80 mb-8 max-w-2xl mx-auto">Have a unique vision? Our skilled artisans will bring your ideas to life.</p>
                    <a href="${u}" class="cta-unlock inline-flex items-center gap-2 px-8 py-4 bg-amber-600 text-white font-bold rounded-xl shadow-lg hover:shadow-xl hover:text-black dark:hover:text-black transition-colors group dark:bg-amber-600 dark:text-white">
                        Start Your Custom Order
                    </a>
                </div>
            `}}function s(){let l=document.getElementById("newsletter-form");l&&l.addEventListener("submit",async i=>{i.preventDefault();let u=l.querySelector('input[type="email"]'),p=l.querySelector('button[type="submit"]'),d=u?.value?.trim();if(!d){Toast.error("Please enter your email address.");return}let m=p.textContent;p.disabled=!0,p.innerHTML='<svg class="animate-spin h-5 w-5 mx-auto" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>';try{await SupportApi.submitContactForm({email:d,type:"newsletter"}),Toast.success("Thank you for subscribing!"),u.value=""}catch(L){Toast.error(L.message||"Failed to subscribe. Please try again.")}finally{p.disabled=!1,p.textContent=m}})}function n(){a&&(clearInterval(a),a=null),t&&(clearInterval(t),t=null),o&&(clearInterval(o),o=null),document.getElementById("back-to-top")?.remove(),document.getElementById("quick-view-modal")?.remove(),document.querySelectorAll(".social-proof-popup").forEach(l=>l.remove())}return{init:h,destroy:n,initRecentlyViewed:_,initFlashSaleCountdown:q}})();window.HomePage=Ms;mr=Ms});var js={};J(js,{default:()=>pr});var Ps,pr,Ns=Q(()=>{Ps=(function(){"use strict";let a=1,e="all";async function t(){if(!AuthGuard.protectPage())return;let y=o();y?await _(y):(await h(),Y())}function o(){let M=window.location.pathname.match(/\/orders\/([^\/]+)/);return M?M[1]:null}async function h(){let y=document.getElementById("orders-list");if(y){Loader.show(y,"skeleton");try{let M={page:a,limit:10};e!=="all"&&(M.status=e);let D=await OrdersApi.getAll(M),A=D.data||[],E=D.meta||{};v(A,E)}catch(M){console.error("Failed to load orders:",M),y.innerHTML='<p class="text-red-500 text-center py-8">Failed to load orders.</p>'}}}function v(y,M){let D=document.getElementById("orders-list");if(!D)return;if(y.length===0){D.innerHTML=`
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
                ${y.map(E=>C(E)).join("")}
            </div>
            ${M.total_pages>1?`
                <div id="orders-pagination" class="mt-8">${Pagination.render({currentPage:M.current_page||a,totalPages:M.total_pages,totalItems:M.total})}</div>
            `:""}
        `,document.getElementById("orders-pagination")?.addEventListener("click",E=>{let b=E.target.closest("[data-page]");b&&(a=parseInt(b.dataset.page),h(),window.scrollTo({top:0,behavior:"smooth"}))})}function C(y){let D={pending:"bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",processing:"bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",shipped:"bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400",delivered:"bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",cancelled:"bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",refunded:"bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400"}[y.status]||"bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400",A=y.items||[],E=A.slice(0,3),b=A.length-3,B=["pending","processing","shipped","delivered"],$=B.indexOf(y.status),f=y.status==="cancelled"||y.status==="refunded";return`
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
                ${f?"":`
                    <div class="px-6 py-3 bg-stone-50 dark:bg-stone-900/50 border-b border-gray-100 dark:border-stone-700">
                        <div class="flex items-center justify-between relative">
                            <div class="absolute left-0 right-0 top-1/2 h-1 bg-stone-200 dark:bg-stone-700 -translate-y-1/2 rounded-full"></div>
                            <div class="absolute left-0 top-1/2 h-1 bg-primary-500 dark:bg-amber-500 -translate-y-1/2 rounded-full transition-all duration-500" style="width: ${Math.max(0,$/(B.length-1)*100)}%"></div>
                            ${B.map((s,n)=>`
                                <div class="relative z-10 flex flex-col items-center">
                                    <div class="w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium ${n<=$?"bg-primary-500 dark:bg-amber-500 text-white":"bg-stone-200 dark:bg-stone-700 text-stone-500 dark:text-stone-400"}">
                                        ${n<$?'<svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/></svg>':n+1}
                                    </div>
                                    <span class="text-xs text-stone-500 dark:text-stone-400 mt-1 capitalize hidden sm:block">${s}</span>
                                </div>
                            `).join("")}
                        </div>
                    </div>
                `}
                
                <div class="p-6">
                    <div class="flex flex-wrap gap-4">
                        ${E.map(s=>`
                            <div class="flex items-center gap-3">
                                <div class="w-16 h-16 bg-gray-100 dark:bg-stone-700 rounded-lg overflow-hidden flex-shrink-0">
                                    ${s.product?.image?`<img src="${s.product.image}" alt="" class="w-full h-full object-cover" onerror="this.parentElement.innerHTML='<div class=\\'w-full h-full flex items-center justify-center text-gray-400 dark:text-stone-500\\'><svg class=\\'w-6 h-6\\' fill=\\'none\\' stroke=\\'currentColor\\' viewBox=\\'0 0 24 24\\'><path stroke-linecap=\\'round\\' stroke-linejoin=\\'round\\' stroke-width=\\'1.5\\' d=\\'M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z\\'/></svg></div>'">`:'<div class="w-full h-full flex items-center justify-center text-gray-400 dark:text-stone-500"><svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg></div>'}
                                </div>
                                <div>
                                    <p class="text-sm font-medium text-gray-900 dark:text-white">${Templates.escapeHtml(s.product?.name||s.product_name)}</p>
                                    <p class="text-sm text-gray-500 dark:text-stone-400">Qty: ${s.quantity}</p>
                                </div>
                            </div>
                        `).join("")}
                        ${b>0?`
                            <div class="flex items-center justify-center w-16 h-16 bg-gray-100 dark:bg-stone-700 rounded-lg">
                                <span class="text-sm text-gray-500 dark:text-stone-400">+${b}</span>
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
                                ${y.timeline.map((b,B)=>`
                                    <div class="relative pl-8">
                                        <div class="absolute left-0 w-4 h-4 rounded-full ${B===0?"bg-primary-600":"bg-gray-300"}"></div>
                                        <p class="text-sm font-medium text-gray-900">${Templates.escapeHtml(b.status)}</p>
                                        <p class="text-xs text-gray-500">${Templates.formatDate(b.timestamp,{includeTime:!0})}</p>
                                        ${b.note?`<p class="text-sm text-gray-600 mt-1">${Templates.escapeHtml(b.note)}</p>`:""}
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
                        ${E.map(b=>`
                            <div class="flex gap-4">
                                <div class="w-20 h-20 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                                    ${b.product?.image?`<img src="${b.product.image}" alt="" class="w-full h-full object-cover" onerror="this.style.display='none'">`:""}
                                </div>
                                <div class="flex-1">
                                    <div class="flex justify-between">
                                        <div>
                                            <h3 class="font-medium text-gray-900">${Templates.escapeHtml(b.product?.name||b.product_name)}</h3>
                                            ${b.variant?`<p class="text-sm text-gray-500">${Templates.escapeHtml(b.variant.name||b.variant_name)}</p>`:""}
                                            <p class="text-sm text-gray-500">Qty: ${b.quantity}</p>
                                        </div>
                                        <p class="font-medium text-gray-900">${Templates.formatPrice(b.price*b.quantity)}</p>
                                    </div>
                                    ${b.product?.slug?`
                                        <a href="/products/${b.product.slug}/" class="text-sm text-primary-600 hover:text-primary-700 mt-2 inline-block">
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
        `,R(y)}function R(y){let M=document.getElementById("reorder-btn"),D=document.getElementById("cancel-order-btn"),A=document.getElementById("print-invoice-btn");M?.addEventListener("click",async()=>{try{await OrdersApi.reorder(y.id),Toast.success("Items added to cart!"),document.dispatchEvent(new CustomEvent("cart:updated")),window.location.href="/cart/"}catch(E){Toast.error(E.message||"Failed to reorder.")}}),D?.addEventListener("click",async()=>{if(await Modal.confirm({title:"Cancel Order",message:"Are you sure you want to cancel this order? This action cannot be undone.",confirmText:"Cancel Order",cancelText:"Keep Order"}))try{await OrdersApi.cancel(y.id),Toast.success("Order cancelled."),window.location.reload()}catch(b){Toast.error(b.message||"Failed to cancel order.")}}),A?.addEventListener("click",()=>{window.print()})}function Y(){let y=document.querySelectorAll("[data-filter-status]");y.forEach(M=>{M.addEventListener("click",()=>{y.forEach(D=>{D.classList.remove("bg-primary-100","text-primary-700"),D.classList.add("text-gray-600")}),M.classList.add("bg-primary-100","text-primary-700"),M.classList.remove("text-gray-600"),e=M.dataset.filterStatus,a=1,h()})})}function j(){a=1,e="all"}return{init:t,destroy:j}})();window.OrdersPage=Ps;pr=Ps});var Fs=Je(()=>{var gr=(function(){"use strict";let a=window.BUNORAA_ROUTES||{},e=a.preordersWizard||"/preorders/create/",t=a.preordersLanding||"/preorders/";async function o(){await Promise.all([h(),C(),_()])}async function h(){let A=document.getElementById("preorder-categories");if(A)try{let E=await PreordersApi.getCategories({featured:!0,pageSize:8}),b=E?.data?.results||E?.data||E?.results||[];if(b.length===0){A.innerHTML=`
                    <div class="col-span-full text-center py-12">
                        <svg class="w-16 h-16 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" 
                                  d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/>
                        </svg>
                        <p class="text-gray-600 dark:text-gray-400 mb-4">No categories available at the moment</p>
                        <p class="text-sm text-gray-500 dark:text-gray-500">Check back soon or contact us for custom requests</p>
                    </div>
                `;return}A.innerHTML=b.map(B=>v(B)).join("")}catch(E){console.error("Failed to load pre-order categories:",E),A.innerHTML=`
                <div class="col-span-full text-center py-12">
                    <svg class="w-16 h-16 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" 
                              d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/>
                    </svg>
                    <p class="text-gray-600 dark:text-gray-400">No categories available at the moment</p>
                </div>
            `}}function v(A){let E=A.image?.url||A.image||A.thumbnail||"",b=E&&E.length>0,B=Templates?.escapeHtml||(f=>f),$=Templates?.formatPrice||(f=>`${window.BUNORAA_CURRENCY?.symbol||"\u09F3"}${f}`);return`
            <a href="${t}category/${A.slug}/" 
               class="group bg-white dark:bg-gray-800 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-200 dark:border-gray-700">
                ${b?`
                    <div class="aspect-video relative overflow-hidden">
                        <img src="${E}" alt="${B(A.name)}" 
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
                            ${B(A.name)}
                        </h3>
                        ${A.icon?`<span class="text-2xl">${A.icon}</span>`:""}
                    </div>
                    
                    ${A.description?`
                        <p class="text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
                            ${B(A.description)}
                        </p>
                    `:""}
                    
                    <div class="flex items-center justify-between text-sm">
                        ${A.base_price?`
                            <span class="text-gray-500 dark:text-gray-500">
                                Starting from <span class="font-semibold text-purple-600">${$(A.base_price)}</span>
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
        `}async function C(){let A=document.getElementById("preorder-templates");A&&A.closest("section")?.classList.add("hidden")}async function _(){let A=document.getElementById("preorder-stats");if(!A)return;let E={totalOrders:"500+",happyCustomers:"450+",avgRating:"4.9"};A.innerHTML=`
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
        `}async function q(A){let E=document.getElementById("category-options");if(!(!E||!A))try{let b=await PreordersApi.getCategory(A),B=await PreordersApi.getCategoryOptions(b.id);R(E,B)}catch(b){console.error("Failed to load category options:",b)}}function R(A,E){if(!E||E.length===0){A.innerHTML='<p class="text-gray-500">No customization options available.</p>';return}A.innerHTML=E.map(b=>`
            <div class="border border-gray-200 dark:border-gray-700 rounded-xl p-4">
                <h4 class="font-semibold text-gray-900 dark:text-white mb-2">${Templates.escapeHtml(b.name)}</h4>
                ${b.description?`<p class="text-sm text-gray-600 dark:text-gray-400 mb-3">${Templates.escapeHtml(b.description)}</p>`:""}
                <div class="space-y-2">
                    ${b.choices?.map(B=>`
                        <label class="flex items-center gap-3 p-3 border border-gray-200 dark:border-gray-600 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                            <input type="${b.allow_multiple?"checkbox":"radio"}" name="option_${b.id}" value="${B.id}" class="text-purple-600 focus:ring-purple-500">
                            <span class="flex-1">
                                <span class="font-medium text-gray-900 dark:text-white">${Templates.escapeHtml(B.name)}</span>
                                ${B.price_modifier&&B.price_modifier!=="0.00"?`
                                    <span class="text-sm text-purple-600 dark:text-purple-400 ml-2">+${Templates.formatPrice(B.price_modifier)}</span>
                                `:""}
                            </span>
                        </label>
                    `).join("")||""}
                </div>
            </div>
        `).join("")}async function Y(){let A=document.getElementById("my-preorders-list");if(A){Loader.show(A,"skeleton");try{let E=await PreordersApi.getMyPreorders(),b=E?.data?.results||E?.data||E?.results||[];if(b.length===0){A.innerHTML=`
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
                `;return}A.innerHTML=b.map(B=>j(B)).join("")}catch(E){console.error("Failed to load pre-orders:",E),A.innerHTML=`
                <div class="text-center py-12">
                    <p class="text-red-500">Failed to load your orders. Please try again.</p>
                </div>
            `}}}function j(A){let E={pending:"bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",quoted:"bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",accepted:"bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-400",in_progress:"bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400",review:"bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400",approved:"bg-teal-100 text-teal-800 dark:bg-teal-900/30 dark:text-teal-400",completed:"bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",cancelled:"bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",refunded:"bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400"},b={pending:"Pending Review",quoted:"Quote Sent",accepted:"Quote Accepted",in_progress:"In Progress",review:"Under Review",approved:"Approved",completed:"Completed",cancelled:"Cancelled",refunded:"Refunded"},B=E[A.status]||"bg-gray-100 text-gray-800",$=b[A.status]||A.status;return`
            <a href="${t}order/${A.preorder_number}/" class="block bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 hover:shadow-lg transition-shadow">
                <div class="flex items-start justify-between gap-4 mb-4">
                    <div>
                        <p class="text-sm text-gray-500 dark:text-gray-400">${A.preorder_number}</p>
                        <h3 class="text-lg font-semibold text-gray-900 dark:text-white">${Templates.escapeHtml(A.title||A.category?.name||"Custom Order")}</h3>
                    </div>
                    <span class="px-3 py-1 text-xs font-medium rounded-full ${B}">${$}</span>
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
        `}async function y(A){A&&await Promise.all([M(A),D(A)])}async function M(A){if(document.getElementById("preorder-status"))try{let b=await PreordersApi.getPreorderStatus(A)}catch{}}function D(A){let E=document.getElementById("message-form");E&&E.addEventListener("submit",async b=>{b.preventDefault();let B=E.querySelector('textarea[name="message"]'),$=E.querySelector('button[type="submit"]'),f=B?.value?.trim();if(!f){Toast.error("Please enter a message");return}let s=$.innerHTML;$.disabled=!0,$.innerHTML='<svg class="animate-spin h-5 w-5 mx-auto" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>';try{await PreordersApi.sendMessage(A,f),Toast.success("Message sent successfully"),B.value="",location.reload()}catch(n){Toast.error(n.message||"Failed to send message")}finally{$.disabled=!1,$.innerHTML=s}})}return{initLanding:o,initCategoryDetail:q,initMyPreorders:Y,initDetail:y,loadFeaturedCategories:h,renderCategoryCard:v,renderPreorderCard:j}})();window.PreordersPage=gr});var Os={};J(Os,{default:()=>hr});var zs,hr,Rs=Q(()=>{zs=(function(){"use strict";let a=null,e=null,t=null,o=!1,h=!1,v=!1,C=null;async function _(){if(o)return;o=!0;let r=document.getElementById("product-detail");if(!r)return;let c=r.querySelector("h1")||r.dataset.productId;if(h=!!c,c){a={id:r.dataset.productId,slug:r.dataset.productSlug},B(),q();return}let g=i();if(!g){window.location.href="/products/";return}await u(g),q()}function q(){R(),Y(),j(),y(),M(),D(),A(),E(),b()}function R(){let r=document.getElementById("main-product-image")||document.getElementById("main-image"),c=r?.parentElement;if(!r||!c)return;let g=document.createElement("div");g.className="zoom-lens absolute w-32 h-32 border-2 border-primary-500 bg-white/30 pointer-events-none opacity-0 transition-opacity duration-200 z-10",g.style.backgroundRepeat="no-repeat";let x=document.createElement("div");x.className="zoom-result fixed right-8 top-1/2 -translate-y-1/2 w-96 h-96 border border-stone-200 dark:border-stone-700 rounded-xl shadow-2xl bg-white dark:bg-stone-800 opacity-0 pointer-events-none transition-opacity duration-200 z-50 hidden lg:block",x.style.backgroundRepeat="no-repeat",c.classList.add("relative"),c.appendChild(g),document.body.appendChild(x),c.addEventListener("mouseenter",()=>{window.innerWidth<1024||(g.classList.remove("opacity-0"),x.classList.remove("opacity-0"),v=!0)}),c.addEventListener("mouseleave",()=>{g.classList.add("opacity-0"),x.classList.add("opacity-0"),v=!1}),c.addEventListener("mousemove",w=>{if(!v||window.innerWidth<1024)return;let I=c.getBoundingClientRect(),W=w.clientX-I.left,G=w.clientY-I.top,te=W-g.offsetWidth/2,ae=G-g.offsetHeight/2;g.style.left=`${Math.max(0,Math.min(I.width-g.offsetWidth,te))}px`,g.style.top=`${Math.max(0,Math.min(I.height-g.offsetHeight,ae))}px`;let ne=3,Gs=-W*ne+x.offsetWidth/2,Js=-G*ne+x.offsetHeight/2;x.style.backgroundImage=`url(${r.src})`,x.style.backgroundSize=`${I.width*ne}px ${I.height*ne}px`,x.style.backgroundPosition=`${Gs}px ${Js}px`})}function Y(){let r=document.getElementById("size-guide-btn");r&&r.addEventListener("click",()=>{let c=document.createElement("div");c.id="size-guide-modal",c.className="fixed inset-0 z-50 flex items-center justify-center p-4",c.innerHTML=`
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
            `,document.body.appendChild(c)})}function j(){let r=document.getElementById("stock-alert-btn");r&&r.addEventListener("click",()=>{if(!document.getElementById("product-detail")?.dataset.productId)return;let g=document.createElement("div");g.id="stock-alert-modal",g.className="fixed inset-0 z-50 flex items-center justify-center p-4",g.innerHTML=`
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
            `,document.body.appendChild(g),document.getElementById("stock-alert-form")?.addEventListener("submit",async x=>{x.preventDefault();let w=document.getElementById("stock-alert-email")?.value;if(w)try{C=w,Toast.success("You will be notified when this product is back in stock!"),g.remove()}catch{Toast.error("Failed to subscribe. Please try again.")}})})}function y(){document.querySelectorAll(".share-btn").forEach(r=>{r.addEventListener("click",()=>{let c=r.dataset.platform,g=encodeURIComponent(window.location.href),x=encodeURIComponent(document.title),w=document.querySelector("h1")?.textContent||"",I={facebook:`https://www.facebook.com/sharer/sharer.php?u=${g}`,twitter:`https://twitter.com/intent/tweet?url=${g}&text=${encodeURIComponent(w)}`,pinterest:`https://pinterest.com/pin/create/button/?url=${g}&description=${encodeURIComponent(w)}`,whatsapp:`https://api.whatsapp.com/send?text=${encodeURIComponent(w+" "+window.location.href)}`,copy:null};c==="copy"?navigator.clipboard.writeText(window.location.href).then(()=>{Toast.success("Link copied to clipboard!")}).catch(()=>{Toast.error("Failed to copy link")}):I[c]&&window.open(I[c],"_blank","width=600,height=400")})})}function M(){let r=document.getElementById("qa-section");if(!r||!document.getElementById("product-detail")?.dataset.productId)return;let g=[{question:"Is this product machine washable?",answer:"Yes, we recommend washing on a gentle cycle with cold water.",askedBy:"John D.",date:"2 days ago"},{question:"What materials is this made from?",answer:"This product is crafted from 100% organic cotton sourced from sustainable farms.",askedBy:"Sarah M.",date:"1 week ago"}];r.innerHTML=`
            <div class="space-y-6">
                <div class="flex items-center justify-between">
                    <h3 class="text-lg font-semibold text-stone-900 dark:text-white">Questions & Answers</h3>
                    <button id="ask-question-btn" class="text-sm font-medium text-primary-600 dark:text-amber-400 hover:underline">Ask a Question</button>
                </div>
                <div id="qa-list" class="space-y-4">
                    ${g.map(x=>`
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
            `,document.body.appendChild(x),document.getElementById("question-form")?.addEventListener("submit",w=>{w.preventDefault(),Toast.success("Your question has been submitted!"),x.remove()})})}function D(){let r=document.getElementById("delivery-estimate");if(!r)return;let c=new Date,g=3,x=7,w=new Date(c.getTime()+g*24*60*60*1e3),I=new Date(c.getTime()+x*24*60*60*1e3),W=G=>G.toLocaleDateString("en-US",{weekday:"short",month:"short",day:"numeric"});r.innerHTML=`
            <div class="flex items-start gap-3 p-4 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl">
                <svg class="w-5 h-5 text-emerald-600 dark:text-emerald-400 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"/>
                </svg>
                <div>
                    <p class="text-sm font-medium text-emerald-700 dark:text-emerald-300">Estimated Delivery</p>
                    <p class="text-emerald-600 dark:text-emerald-400 font-semibold">${W(w)} - ${W(I)}</p>
                    <p class="text-xs text-emerald-600 dark:text-emerald-400 mt-1">Free shipping on orders over $50</p>
                </div>
            </div>
        `}function A(){let r=document.getElementById("product-detail")?.dataset.productId,c=document.getElementById("product-detail")?.dataset.productSlug,g=document.querySelector("h1")?.textContent,x=document.getElementById("main-product-image")?.src||document.getElementById("main-image")?.src,w=document.getElementById("product-price")?.textContent;if(!r)return;let I=JSON.parse(localStorage.getItem("recentlyViewed")||"[]"),W=I.findIndex(G=>G.id===r);W>-1&&I.splice(W,1),I.unshift({id:r,slug:c,name:g,image:x,price:w,viewedAt:new Date().toISOString()}),localStorage.setItem("recentlyViewed",JSON.stringify(I.slice(0,20)))}function E(){if(document.getElementById("mobile-sticky-atc")||document.getElementById("mobile-sticky-atc-js")||window.innerWidth>=1024)return;let c=a;if(!c)return;let g=document.createElement("div");g.id="mobile-sticky-atc-enhanced",g.className="fixed bottom-0 inset-x-0 z-40 lg:hidden bg-white dark:bg-stone-800 border-t border-stone-200 dark:border-stone-700 shadow-2xl p-3 transform translate-y-full transition-transform duration-300",g.innerHTML=`
            <div class="flex items-center gap-3">
                <div class="flex-1 min-w-0">
                    <p class="text-xs text-stone-500 dark:text-stone-400 truncate">${c.name||""}</p>
                    <p class="font-bold text-stone-900 dark:text-white">${c.sale_price?Templates.formatPrice(c.sale_price):Templates.formatPrice(c.price||0)}</p>
                </div>
                <button id="sticky-add-to-cart" class="px-6 py-3 bg-primary-600 dark:bg-amber-600 text-white font-semibold rounded-xl hover:bg-primary-700 dark:hover:bg-amber-700 transition-colors">
                    Add to Cart
                </button>
            </div>
        `,document.body.appendChild(g);let x=document.getElementById("add-to-cart-btn");x&&new IntersectionObserver(I=>{I.forEach(W=>{W.isIntersecting?g.classList.add("translate-y-full"):g.classList.remove("translate-y-full")})},{threshold:0}).observe(x),document.getElementById("sticky-add-to-cart")?.addEventListener("click",()=>{document.getElementById("add-to-cart-btn")?.click()})}function b(){document.querySelectorAll("[data-video-url]").forEach(c=>{c.addEventListener("click",()=>{let g=c.dataset.videoUrl;if(!g)return;let x=document.createElement("div");x.id="video-player-modal",x.className="fixed inset-0 z-50 flex items-center justify-center bg-black/90",x.innerHTML=`
                    <button onclick="document.getElementById('video-player-modal').remove()" class="absolute top-4 right-4 w-12 h-12 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-colors">
                        <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
                    </button>
                    <video controls autoplay class="max-w-full max-h-[90vh] rounded-xl">
                        <source src="${g}" type="video/mp4">
                        Your browser does not support video playback.
                    </video>
                `,document.body.appendChild(x)})})}function B(){T(),f(),s(),r();async function r(){let c=document.getElementById("add-to-wishlist-btn");if(!c)return;let g=document.getElementById("product-detail")?.dataset.productId;if(g&&!(typeof WishlistApi>"u"))try{let x=await WishlistApi.getWishlist({pageSize:100});x.success&&x.data?.items&&(x.data.items.some(I=>I.product_id===g||I.product===g)?(c.querySelector("svg")?.setAttribute("fill","currentColor"),c.classList.add("text-red-500")):(c.querySelector("svg")?.setAttribute("fill","none"),c.classList.remove("text-red-500")))}catch{}}n(),l(),U(),$()}function $(){let r=document.querySelectorAll(".tab-btn"),c=document.querySelectorAll(".tab-content");r.forEach(g=>{g.addEventListener("click",()=>{let x=g.dataset.tab;r.forEach(w=>{w.classList.remove("border-primary-500","text-primary-600"),w.classList.add("border-transparent","text-gray-500")}),g.classList.add("border-primary-500","text-primary-600"),g.classList.remove("border-transparent","text-gray-500"),c.forEach(w=>{w.id===`${x}-tab`?w.classList.remove("hidden"):w.classList.add("hidden")})})})}function f(){let r=document.getElementById("add-to-cart-btn");r&&r.addEventListener("click",async()=>{let c=document.getElementById("product-detail")?.dataset.productId,g=parseInt(document.getElementById("quantity")?.value)||1,w=!!document.querySelector('input[name="variant"]'),I=document.querySelector('input[name="variant"]:checked')?.value;if(!c)return;if(w&&!I){Toast.warning("Please select a variant before adding to cart.");return}r.disabled=!0;let W=r.innerHTML;r.innerHTML='<svg class="animate-spin h-5 w-5 mx-auto" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>';try{await CartApi.addItem(c,g,I||null),Toast.success("Added to cart!"),document.dispatchEvent(new CustomEvent("cart:updated"))}catch(G){Toast.error(G.message||"Failed to add to cart.")}finally{r.disabled=!1,r.innerHTML=W}})}function s(){let r=document.getElementById("add-to-wishlist-btn");r&&r.addEventListener("click",async()=>{let c=document.getElementById("product-detail")?.dataset.productId;if(c){if(typeof AuthApi<"u"&&!AuthApi.isAuthenticated()){Toast.warning("Please login to add items to your wishlist."),window.location.href="/account/login/?next="+encodeURIComponent(window.location.pathname);return}try{let g=!1;if(typeof WishlistApi<"u"){let x=await WishlistApi.getWishlist({pageSize:100});x.success&&x.data?.items&&(g=x.data.items.some(w=>w.product_id===c||w.product===c))}if(g){let w=(await WishlistApi.getWishlist({pageSize:100})).data.items.find(I=>I.product_id===c||I.product===c);w&&(await WishlistApi.removeItem(w.id),Toast.success("Removed from wishlist!"),r.querySelector("svg")?.setAttribute("fill","none"),r.classList.remove("text-red-500"),r.setAttribute("aria-pressed","false"))}else await WishlistApi.addItem(c),Toast.success("Added to wishlist!"),r.querySelector("svg")?.setAttribute("fill","currentColor"),r.classList.add("text-red-500"),r.setAttribute("aria-pressed","true")}catch(g){Toast.error(g.message||"Wishlist action failed.")}}})}function n(){document.querySelectorAll('input[name="variant"]').forEach(c=>{c.addEventListener("change",()=>{e=c.value;let g=c.dataset.price,x=parseInt(c.dataset.stock||"0");if(g){let te=document.getElementById("product-price");te&&window.Templates?.formatPrice&&(te.textContent=window.Templates.formatPrice(parseFloat(g)))}let w=document.getElementById("stock-status"),I=document.getElementById("add-to-cart-btn"),W=document.getElementById("mobile-stock"),G=document.getElementById("mobile-add-to-cart");w&&(x>10?w.innerHTML='<span class="text-green-600">In Stock</span>':x>0?w.innerHTML=`<span class="text-orange-500">Only ${x} left</span>`:w.innerHTML='<span class="text-red-600">Out of Stock</span>'),I&&(I.disabled=x<=0),G&&(G.disabled=x<=0),W&&(W.textContent=x>0?x>10?"In stock":`${x} available`:"Out of stock")})})}function l(){document.getElementById("main-image")?.addEventListener("click",()=>{})}function i(){let c=window.location.pathname.match(/\/products\/([^\/]+)/);return c?c[1]:null}async function u(r){let c=document.getElementById("product-detail");if(c){Loader.show(c,"skeleton");try{if(a=(await ProductsApi.getProduct(r)).data,!a){window.location.href="/404/";return}document.title=`${a.name} | Bunoraa`,p(a),re(a),se(a),await Promise.all([O(a),P(a),X(a),oe(a)]),le(),de(a)}catch(g){console.error("Failed to load product:",g),c.innerHTML='<p class="text-red-500 text-center py-8">Failed to load product. Please try again.</p>'}}}document.addEventListener("currency:changed",async r=>{try{!h&&a&&a.slug?await u(a.slug):location.reload()}catch{}});function p(r){let c=document.getElementById("product-detail");if(!c)return;let g=r.images||[],x=r.image||g[0]?.image||"",w=r.variants&&r.variants.length>0,I=r.stock_quantity>0||r.in_stock,W=r.sale_price&&r.sale_price<r.price;c.innerHTML=`
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
                <!-- Gallery -->
                <div id="product-gallery" class="product-gallery">
                    <div class="main-image-container relative rounded-xl overflow-hidden bg-gray-100" style="aspect-ratio: ${r?.aspect?.css||"1/1"};">
                        <img 
                            src="${x}" 
                            alt="${Templates.escapeHtml(r.name)}"
                            loading="lazy"
                            decoding="async"
                            class="main-image w-full h-full object-cover cursor-zoom-in"
                            id="main-product-image"
                        >
                        ${W?`
                            <span class="absolute top-4 left-4 px-3 py-1 bg-red-500 text-white text-sm font-medium rounded-full">
                                Sale
                            </span>
                        `:""}
                        ${I?"":`
                            <span class="absolute top-4 right-4 px-3 py-1 bg-gray-900 text-white text-sm font-medium rounded-full">
                                Out of Stock
                            </span>
                        `}
                    </div>
                    ${g.length>1?`
                        <div class="thumbnails flex gap-2 mt-4 overflow-x-auto pb-2">
                            ${g.map((G,te)=>`
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
                    ${r.brand?`
                        <a href="/products/?brand=${r.brand.id}" class="text-sm text-primary-600 hover:text-primary-700 font-medium">
                            ${Templates.escapeHtml(r.brand.name)}
                        </a>
                    `:""}

                    <!-- Title -->
                    <h1 class="text-2xl md:text-3xl font-bold text-gray-900 mt-2">
                        ${Templates.escapeHtml(r.name)}
                    </h1>

                    <!-- Rating -->
                    ${r.average_rating?`
                        <div class="flex items-center gap-2 mt-3">
                            <div class="flex items-center">
                                ${Templates.renderStars(r.average_rating)}
                            </div>
                            <span class="text-sm text-gray-600">
                                ${r.average_rating.toFixed(1)} (${r.review_count||0} reviews)
                            </span>
                            <a href="#reviews" class="text-sm text-primary-600 hover:text-primary-700">
                                Read reviews
                            </a>
                        </div>
                    `:""}

                    <!-- Price -->
                    <div class="mt-4">
                        ${Price.render({price:r.current_price??r.price_converted??r.price,salePrice:r.sale_price_converted??r.sale_price,size:"large"})}
                    </div>

                    <!-- Short Description -->
                    ${r.short_description?`
                        <p class="mt-4 text-gray-600">${Templates.escapeHtml(r.short_description)}</p>
                    `:""}

                    <!-- Variants -->
                    ${w?m(r.variants):""}

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
                                    max="${r.stock_quantity||99}"
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
                            ${r.stock_quantity?`
                                <div id="stock-status" class="text-sm text-gray-500">${r.stock_quantity>10?"In stock":r.stock_quantity+" available"}</div>
                            `:'<div id="stock-status" class="text-red-600">Out of Stock</div>'}
                        </div>

                        <div class="flex gap-3">
                            <button 
                                id="add-to-cart-btn"
                                class="flex-1 px-6 py-3 bg-primary-600 text-white font-semibold rounded-lg hover:bg-primary-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
                                ${I?"":"disabled"}
                            >
                                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"/>
                                </svg>
                                ${I?"Add to Cart":"Out of Stock"}
                            </button>
                            <button 
                                id="add-to-wishlist-btn"
                                class="px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                                aria-label="Add to wishlist"
                                data-product-id="${r.id}"
                            >
                                <svg class="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/>
                                </svg>
                            </button>
                        </div>
                    </div>

                    <!-- Product Meta -->
                    <div class="mt-6 pt-6 border-t border-gray-200 space-y-3 text-sm">
                        ${r.sku?`
                            <div class="flex">
                                <span class="text-gray-500 w-24">SKU:</span>
                                <span class="text-gray-900">${Templates.escapeHtml(r.sku)}</span>
                            </div>
                        `:""}
                        ${r.category?`
                            <div class="flex">
                                <span class="text-gray-500 w-24">Category:</span>
                                <a href="/categories/${r.category.slug}/" class="text-primary-600 hover:text-primary-700">
                                    ${Templates.escapeHtml(r.category.name)}
                                </a>
                            </div>
                        `:""}
                        ${r.tags&&r.tags.length?`
                            <div class="flex">
                                <span class="text-gray-500 w-24">Tags:</span>
                                <div class="flex flex-wrap gap-1">
                                    ${r.tags.map(G=>`
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
                        ${r.specifications&&Object.keys(r.specifications).length?`
                            <button data-tab class="px-6 py-4 text-sm font-medium text-gray-600 hover:text-gray-900 border-b-2 border-transparent">
                                Specifications
                            </button>
                        `:""}
                        <button data-tab class="px-6 py-4 text-sm font-medium text-gray-600 hover:text-gray-900 border-b-2 border-transparent">
                            Reviews (${r.review_count||0})
                        </button>
                    </nav>
                </div>
                <div class="py-6">
                    <div data-tab-panel>
                        <div class="prose max-w-none">
                            ${r.description||'<p class="text-gray-500">No description available.</p>'}
                        </div>
                    </div>
                    ${r.specifications&&Object.keys(r.specifications).length?`
                        <div data-tab-panel>
                            <table class="w-full">
                                <tbody>
                                    ${Object.entries(r.specifications).map(([G,te])=>`
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
        `,L(),T(),N(),V(),S(),k(),Tabs.init(),d(r)}function d(r){let c=document.getElementById("mobile-sticky-atc-js");if(c){let g=c.querySelector(".font-semibold");g&&(g.innerHTML=r.sale_price?Templates.formatPrice(r.sale_price)+' <span class="text-sm line-through text-gray-400">'+Templates.formatPrice(r.price)+"</span>":Templates.formatPrice(r.price));let x=document.getElementById("mobile-stock-js");x&&(x.textContent=r.stock_quantity>0?r.stock_quantity>10?"In stock":r.stock_quantity+" available":"Out of stock");let w=document.getElementById("mobile-add-to-cart-js");w&&(w.disabled=r.stock_quantity<=0)}else{c=document.createElement("div"),c.id="mobile-sticky-atc-js",c.className="fixed inset-x-4 bottom-4 z-40 lg:hidden",c.innerHTML=`
                <div class="bg-white shadow-lg rounded-xl p-3 flex items-center gap-3">
                    <div class="flex-1">
                        <div class="text-sm text-gray-500">${r.sale_price?"Now":""}</div>
                        <div class="font-semibold text-lg ${r.sale_price?"text-red-600":""}">${r.sale_price?Templates.formatPrice(r.sale_price)+' <span class="text-sm line-through text-gray-400">'+Templates.formatPrice(r.price)+"</span>":Templates.formatPrice(r.price)}</div>
                        <div id="mobile-stock-js" class="text-xs text-gray-500">${r.stock_quantity>0?r.stock_quantity>10?"In stock":r.stock_quantity+" available":"Out of stock"}</div>
                    </div>
                    ${r.stock_quantity>0?'<button id="mobile-add-to-cart-js" class="bg-primary-600 text-white px-4 py-2 rounded-lg font-semibold">Add</button>':'<button class="bg-gray-300 text-gray-500 px-4 py-2 rounded-lg font-semibold cursor-not-allowed" disabled>Out</button>'}
                </div>
            `,document.body.appendChild(c);let g=document.getElementById("mobile-add-to-cart-js");g&&g.addEventListener("click",()=>document.getElementById("add-to-cart-btn")?.click())}}function m(r){let c={};return r.forEach(g=>{c[g.attribute_name]||(c[g.attribute_name]=[]),c[g.attribute_name].push(g)}),Object.entries(c).map(([g,x])=>`
            <div class="mt-6">
                <label class="text-sm font-medium text-gray-700">${Templates.escapeHtml(g)}:</label>
                <div class="flex flex-wrap gap-2 mt-2" role="radiogroup" aria-label="${Templates.escapeHtml(g)}">
                    ${x.map((w,I)=>`
                        <button 
                            class="variant-btn px-4 py-2 border rounded-lg text-sm transition-colors ${I===0?"border-primary-500 bg-primary-50 text-primary-700":"border-gray-300 hover:border-gray-400"}"
                            role="radio"
                            aria-checked="${I===0?"true":"false"}"
                            data-variant-id="${w.id}"
                            data-price="${w.price_converted??w.price??""}"
                            data-stock="${w.stock_quantity||0}"
                            tabindex="0"
                        >
                            ${Templates.escapeHtml(w.value)}
                            ${(w.price_converted??w.price)&&w.price!==a.price?`
                                <span class="text-xs text-gray-500">(${Templates.formatPrice(w.price_converted??w.price)})</span>
                            `:""}
                        </button>
                    `).join("")}
                </div>
            </div>
        `).join("")}function L(){let r=document.querySelectorAll(".thumbnail"),c=document.getElementById("main-product-image"),g=0;r.forEach((x,w)=>{x.setAttribute("tabindex","0"),x.addEventListener("click",()=>{r.forEach(I=>I.classList.remove("border-primary-500")),x.classList.add("border-primary-500"),c.src=x.dataset.image||x.dataset.src,g=w}),x.addEventListener("keydown",I=>{if(I.key==="Enter"||I.key===" ")I.preventDefault(),x.click();else if(I.key==="ArrowRight"){I.preventDefault();let W=r[(w+1)%r.length];W.focus(),W.click()}else if(I.key==="ArrowLeft"){I.preventDefault();let W=r[(w-1+r.length)%r.length];W.focus(),W.click()}})}),c?.addEventListener("click",()=>{let x=a.images?.map(G=>G.image)||[a.image],w=parseInt(document.querySelector(".thumbnail.border-primary-500")?.dataset.index)||0,W=(a.images||[]).map(G=>({type:G.type||(G.video_url?"video":"image"),src:G.video_url||G.model_url||G.image})).map(G=>{if(G.type==="video")return`<div class="w-full h-full max-h-[70vh]"><video controls class="w-full h-full object-contain"><source src="${G.src}" type="video/mp4">Your browser does not support video.</video></div>`;if(G.type==="model"){if(!window.customElements||!window["model-viewer"]){let te=document.createElement("script");te.type="module",te.src="https://unpkg.com/@google/model-viewer/dist/model-viewer.min.js",document.head.appendChild(te)}return`<div class="w-full h-full max-h-[70vh]"><model-viewer src="${G.src}" camera-controls ar ar-modes="webxr scene-viewer quick-look" class="w-full h-full"></model-viewer></div>`}return`<div class="w-full h-full max-h-[70vh] flex items-center justify-center"><img src="${G.src}" class="max-w-full max-h-[70vh] object-contain" alt="${Templates.escapeHtml(a.name)}"></div>`}).join("");Modal.open({title:Templates.escapeHtml(a.name),content:`<div class="space-y-2">${W}</div>`,size:"xl"})})}function T(){let r=document.getElementById("product-quantity"),c=document.querySelector(".qty-decrease"),g=document.querySelector(".qty-increase");c?.addEventListener("click",()=>{let w=parseInt(r.value)||1;w>1&&(r.value=w-1)}),g?.addEventListener("click",()=>{let w=parseInt(r.value)||1,I=parseInt(r.max)||99;w<I&&(r.value=w+1)});let x=document.querySelectorAll(".variant-btn");if(x.forEach(w=>{w.addEventListener("click",()=>{if(x.forEach(ne=>{ne.classList.remove("border-primary-500","bg-primary-50","text-primary-700"),ne.classList.add("border-gray-300"),ne.setAttribute("aria-checked","false")}),w.classList.add("border-primary-500","bg-primary-50","text-primary-700"),w.classList.remove("border-gray-300"),w.setAttribute("aria-checked","true"),e=w.dataset.variantId,w.dataset.price){let ne=document.querySelector(".product-info .mt-4");ne&&(ne.innerHTML=Price.render({price:parseFloat(w.dataset.price),size:"large"}))}let I=parseInt(w.dataset.stock||"0"),W=document.getElementById("stock-status"),G=document.getElementById("add-to-cart-btn"),te=document.getElementById("mobile-stock"),ae=document.getElementById("mobile-add-to-cart");W&&(I>10?W.innerHTML='<span class="text-green-600 flex items-center"><svg class="w-5 h-5 mr-1" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path></svg>In Stock</span>':I>0?W.innerHTML=`<span class="text-orange-500 flex items-center"><svg class="w-5 h-5 mr-1" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd"></path></svg>Only ${I} left</span>`:W.innerHTML='<span class="text-red-600 flex items-center"><svg class="w-5 h-5 mr-1" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"></path></svg>Out of Stock</span>'),r&&(r.max=Math.max(I,1),parseInt(r.value)>parseInt(r.max)&&(r.value=r.max)),te&&(te.textContent=I>0?I>10?"In stock":`${I} available`:"Out of stock"),G&&(G.disabled=I<=0),ae&&(ae.disabled=I<=0)})}),x.length>0){let w=x[0];w.setAttribute("aria-checked","true"),e=w.dataset.variantId}}function N(){let r=document.getElementById("add-to-cart-btn"),c=document.getElementById("mobile-add-to-cart");if(!r&&!c)return;let g=async x=>{let w=parseInt(document.getElementById("product-quantity")?.value)||1,I=document.getElementById("stock-status");if(!!document.querySelector(".variant-btn")&&!e){Toast.warning("Please select a variant before adding to cart.");return}x.disabled=!0;let G=x.innerHTML;x.innerHTML='<svg class="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>';try{let te=document.querySelector(`.variant-btn[data-variant-id="${e}"]`);if((te?parseInt(te.dataset.stock||"0"):a.stock_quantity||0)<=0){Toast.error("This variant is out of stock.");return}await CartApi.addItem(a.id,w,e||null),Toast.success("Added to cart!"),document.dispatchEvent(new CustomEvent("cart:updated"))}catch(te){Toast.error(te.message||"Failed to add to cart.")}finally{x.disabled=!1,x.innerHTML=G}};r?.addEventListener("click",()=>g(r)),c?.addEventListener("click",()=>g(c))}function V(){let r=document.getElementById("add-to-wishlist-btn");r&&r.addEventListener("click",async()=>{if(!AuthApi.isAuthenticated()){Toast.warning("Please login to add items to your wishlist."),window.location.href="/account/login/?next="+encodeURIComponent(window.location.pathname);return}try{await WishlistApi.addItem(a.id),Toast.success("Added to wishlist!"),r.querySelector("svg").setAttribute("fill","currentColor"),r.classList.add("text-red-500"),r.setAttribute("aria-pressed","true")}catch(c){c.message?.includes("already")?Toast.info("This item is already in your wishlist."):Toast.error(c.message||"Failed to add to wishlist.")}})}function k(){let r=document.querySelectorAll(".share-btn"),c=encodeURIComponent(window.location.href),g=encodeURIComponent(a?.name||document.title);r.forEach(x=>{x.addEventListener("click",()=>{let w=x.dataset.platform,I="";switch(w){case"facebook":I=`https://www.facebook.com/sharer/sharer.php?u=${c}`;break;case"twitter":I=`https://twitter.com/intent/tweet?url=${c}&text=${g}`;break;case"pinterest":let W=encodeURIComponent(a?.image||"");I=`https://pinterest.com/pin/create/button/?url=${c}&media=${W}&description=${g}`;break;case"copy":navigator.clipboard.writeText(window.location.href).then(()=>Toast.success("Link copied to clipboard!")).catch(()=>Toast.error("Failed to copy link."));return}I&&window.open(I,"_blank","width=600,height=400")})})}function S(){let r=document.getElementById("add-to-compare-btn");r&&r.addEventListener("click",async()=>{if(typeof AuthApi<"u"&&!AuthApi.isAuthenticated()){Toast.warning("Please login to compare products."),window.location.href="/account/login/?next="+encodeURIComponent(window.location.pathname);return}let c=a?.id||document.getElementById("product-detail")?.dataset.productId;if(c)try{let g=await ApiClient.post("/compare/",{product_id:c},{requiresAuth:!0});g.success?(Toast.success(g.message||"Added to compare"),r.setAttribute("aria-pressed","true"),r.classList.add("text-primary-600"),r.querySelector("svg")?.setAttribute("fill","currentColor")):Toast.error(g.message||"Failed to add to compare")}catch(g){try{let x="b_compare",w=JSON.parse(localStorage.getItem(x)||"[]");if(!w.includes(c)){w.push(c),localStorage.setItem(x,JSON.stringify(w)),Toast.success("Added to compare (local)"),r.setAttribute("aria-pressed","true"),r.classList.add("text-primary-600");return}Toast.info("Already in compare list")}catch{Toast.error(g.message||"Failed to add to compare")}}})}function U(){let r=document.getElementById("add-to-compare-btn");r&&r.addEventListener("click",async c=>{c.preventDefault();let g=document.getElementById("product-detail")?.dataset.productId;if(g)try{if(typeof AuthApi<"u"&&!AuthApi.isAuthenticated()){Toast.warning("Please login to compare products."),window.location.href="/account/login/?next="+encodeURIComponent(window.location.pathname);return}let x=await ApiClient.post("/compare/",{product_id:g},{requiresAuth:!0});x.success?(Toast.success(x.message||"Added to compare"),r.setAttribute("aria-pressed","true"),r.classList.add("text-primary-600"),r.querySelector("svg")?.setAttribute("fill","currentColor")):Toast.error(x.message||"Failed to add to compare")}catch(x){try{let w="b_compare",I=JSON.parse(localStorage.getItem(w)||"[]");if(!I.includes(g)){I.push(g),localStorage.setItem(w,JSON.stringify(I)),Toast.success("Added to compare (local)"),r.setAttribute("aria-pressed","true"),r.classList.add("text-primary-600");return}Toast.info("Already in compare list")}catch{Toast.error(x.message||"Failed to add to compare")}}})}async function O(r){let c=document.getElementById("breadcrumbs");if(!c)return;let g=[{label:"Home",url:"/"},{label:"Products",url:"/products/"}];if(r.category)try{((await CategoriesAPI.getBreadcrumbs(r.category.id)).data||[]).forEach(I=>{g.push({label:I.name,url:`/categories/${I.slug}/`})})}catch{g.push({label:r.category.name,url:`/categories/${r.category.slug}/`})}g.push({label:r.name}),c.innerHTML=Breadcrumb.render(g)}async function P(r){let c=document.getElementById("related-products");if(c)try{let x=(await ProductsAPI.getRelated(r.id,{limit:4})).data||[];if(x.length===0){c.innerHTML="";return}c.innerHTML=`
                <h2 class="text-2xl font-bold text-gray-900 mb-6">You may also like</h2>
                <div class="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                    ${x.map(w=>ProductCard.render(w)).join("")}
                </div>
            `,ProductCard.bindEvents(c)}catch(g){console.error("Failed to load related products:",g),c.innerHTML=""}}async function X(r){let c=document.getElementById("reviews-container");if(c){Loader.show(c,"spinner");try{let x=(await ProductsAPI.getReviews(r.id)).data||[];c.innerHTML=`
                <!-- Review Summary -->
                <div class="flex flex-col md:flex-row gap-8 mb-8 pb-8 border-b border-gray-200">
                    <div class="text-center">
                        <div class="text-5xl font-bold text-gray-900">${r.average_rating?.toFixed(1)||"0.0"}</div>
                        <div class="flex justify-center mt-2">
                            ${Templates.renderStars(r.average_rating||0)}
                        </div>
                        <div class="text-sm text-gray-500 mt-1">${r.review_count||0} reviews</div>
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
            `,document.getElementById("write-review-btn")?.addEventListener("click",()=>{ee(r)})}catch(g){console.error("Failed to load reviews:",g),c.innerHTML='<p class="text-red-500">Failed to load reviews.</p>'}}}function ee(r){Modal.open({title:"Write a Review",content:`
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
            `,confirmText:"Submit Review",onConfirm:async()=>{let x=parseInt(document.getElementById("review-rating").value),w=document.getElementById("review-title").value.trim(),I=document.getElementById("review-comment").value.trim();if(!x||x<1)return Toast.error("Please select a rating."),!1;if(!I)return Toast.error("Please write a review."),!1;try{return await ProductsAPI.createReview(r.id,{rating:x,title:w,comment:I}),Toast.success("Thank you for your review!"),X(r),!0}catch(W){return Toast.error(W.message||"Failed to submit review."),!1}}});let c=document.querySelectorAll(".rating-star"),g=document.getElementById("review-rating");c.forEach(x=>{x.addEventListener("click",()=>{let w=parseInt(x.dataset.rating);g.value=w,c.forEach((I,W)=>{W<w?(I.classList.remove("text-gray-300"),I.classList.add("text-yellow-400")):(I.classList.add("text-gray-300"),I.classList.remove("text-yellow-400"))})})})}function re(r){try{document.title=`${r.name} | Bunoraa`;let c=r.meta_description||r.short_description||"";document.querySelector('meta[name="description"]')?.setAttribute("content",c),document.querySelector('meta[property="og:title"]')?.setAttribute("content",r.meta_title||r.name),document.querySelector('meta[property="og:description"]')?.setAttribute("content",c);let g=r.images?.[0]?.image||r.image;g&&document.querySelector('meta[property="og:image"]')?.setAttribute("content",g),document.querySelector('meta[name="twitter:title"]')?.setAttribute("content",r.meta_title||r.name),document.querySelector('meta[name="twitter:description"]')?.setAttribute("content",c)}catch{}}function se(r){try{let c=document.querySelector('script[type="application/ld+json"][data-ld="product"]');if(!c)return;let g={"@context":"https://schema.org","@type":"Product",name:r.name,image:(r.images||[]).map(x=>x.image||x),description:r.short_description||r.description||"",sku:r.sku||"",offers:{"@type":"Offer",url:window.location.href,priceCurrency:r.currency||window.BUNORAA_PRODUCT?.currency||"BDT",price:r.current_price||r.price}};c.textContent=JSON.stringify(g)}catch{}}async function oe(r){let c=document.getElementById("related-products");if(c)try{let[g,x,w]=await Promise.all([ProductsApi.getRecommendations(r.id,"frequently_bought_together",3),ProductsApi.getRecommendations(r.id,"similar",4),ProductsApi.getRecommendations(r.id,"you_may_also_like",6)]);if(g.success&&g.data?.length){let I=`
                    <section class="mt-8">
                        <h3 class="text-lg font-semibold mb-4">Frequently Bought Together</h3>
                        <div class="grid grid-cols-3 gap-3">${(g.data||[]).map(W=>ProductCard.render(W)).join("")}</div>
                    </section>
                `;c.insertAdjacentHTML("beforeend",I)}if(x.success&&x.data?.length){let I=`
                    <section class="mt-8">
                        <h3 class="text-lg font-semibold mb-4">Similar Products</h3>
                        <div class="grid grid-cols-2 md:grid-cols-4 gap-4">${(x.data||[]).map(W=>ProductCard.render(W)).join("")}</div>
                    </section>
                `;c.insertAdjacentHTML("beforeend",I)}if(w.success&&w.data?.length){let I=`
                    <section class="mt-8">
                        <h3 class="text-lg font-semibold mb-4">You May Also Like</h3>
                        <div class="grid grid-cols-2 md:grid-cols-4 gap-4">${(w.data||[]).map(W=>ProductCard.render(W)).join("")}</div>
                    </section>
                `;c.insertAdjacentHTML("beforeend",I)}ProductCard.bindEvents(c)}catch{}}function le(){if(!document.getElementById("product-detail")||typeof IntersectionObserver>"u")return;let c=new IntersectionObserver(g=>{g.forEach(x=>{if(!x.isIntersecting)return;let w=x.target;w.id,w.id==="reviews"||w.id,c.unobserve(w)})},{rootMargin:"200px"});document.querySelectorAll("#related-products, #reviews").forEach(g=>{c.observe(g)})}async function de(r){try{await ProductsAPI.trackView(r.id)}catch{}}function me(){a=null,e=null,t=null,o=!1}return{init:_,destroy:me}})();window.ProductPage=zs;hr=zs});var Vs={};J(Vs,{default:()=>fr});var Ds,fr,Us=Q(()=>{Ds=(function(){"use strict";let a="",e=1,t={},o=null,h=!1;async function v(){if(h)return;h=!0;let f=document.getElementById("search-results")||document.getElementById("products-grid");if(f&&f.querySelector(".product-card, [data-product-id]")){j(),E(),b(),C();return}a=R(),t=Y(),e=parseInt(new URLSearchParams(window.location.search).get("page"))||1,await _(),j(),E(),b(),C()}function C(){let f=document.getElementById("view-grid"),s=document.getElementById("view-list");f?.addEventListener("click",()=>{f.classList.add("bg-primary-100","text-primary-700"),f.classList.remove("text-gray-400"),s?.classList.remove("bg-primary-100","text-primary-700"),s?.classList.add("text-gray-400"),Storage?.set("productViewMode","grid"),_()}),s?.addEventListener("click",()=>{s.classList.add("bg-primary-100","text-primary-700"),s.classList.remove("text-gray-400"),f?.classList.remove("bg-primary-100","text-primary-700"),f?.classList.add("text-gray-400"),Storage?.set("productViewMode","list"),_()})}async function _(){let f=document.getElementById("search-results")||document.getElementById("products-grid"),s=document.getElementById("results-count")||document.getElementById("product-count");if(f){o&&o.abort(),o=new AbortController,Loader.show(f,"skeleton");try{let n={page:e,pageSize:12,...t};if(a&&(n.search=a),window.location.pathname==="/categories/"){await q();return}let i=await ProductsApi.getProducts(n),u=Array.isArray(i)?i:i.data||i.results||[],p=i.meta||{};s&&(a?s.textContent=`${p.total||u.length} results for "${Templates.escapeHtml(a)}"`:s.textContent=`${p.total||u.length} products`),M(u,p),await D()}catch(n){if(n.name==="AbortError")return;console.error("Failed to load products:",n),f.innerHTML='<p class="text-red-500 text-center py-8">Failed to load products. Please try again.</p>'}}}async function q(){let f=document.getElementById("search-results")||document.getElementById("products-grid"),s=document.getElementById("results-count")||document.getElementById("product-count"),n=document.getElementById("page-title");if(f)try{let l=await CategoriesApi.getCategories({limit:50}),i=Array.isArray(l)?l:l.data||l.results||[];if(n&&(n.textContent="All Categories"),s&&(s.textContent=`${i.length} categories`),i.length===0){f.innerHTML=`
                    <div class="text-center py-16">
                        <svg class="w-24 h-24 text-gray-300 mx-auto mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"/>
                        </svg>
                        <h2 class="text-2xl font-bold text-gray-900 mb-2">No categories found</h2>
                        <p class="text-gray-600">Check back later for new categories.</p>
                    </div>
                `;return}f.innerHTML=`
                <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                    ${i.map(u=>`
                        <a href="/categories/${u.slug}/" class="group bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden">
                            <div class="relative overflow-hidden" style="aspect-ratio: ${product?.aspect?.css||"1/1"};">
                                ${u.image?`
                                    <img src="${u.image}" alt="${Templates.escapeHtml(u.name)}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300">
                                `:`
                                    <div class="w-full h-full flex items-center justify-center">
                                        <svg class="w-16 h-16 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"/>
                                        </svg>
                                    </div>
                                `}
                            </div>
                            <div class="p-4 text-center">
                                <h3 class="font-semibold text-gray-900 group-hover:text-primary-600 transition-colors">${Templates.escapeHtml(u.name)}</h3>
                                ${u.product_count?`<p class="text-sm text-gray-500 mt-1">${u.product_count} products</p>`:""}
                            </div>
                        </a>
                    `).join("")}
                </div>
            `}catch(l){console.error("Failed to load categories:",l),f.innerHTML='<p class="text-red-500 text-center py-8">Failed to load categories. Please try again.</p>'}}function R(){return new URLSearchParams(window.location.search).get("q")||""}function Y(){let f=new URLSearchParams(window.location.search),s={};return f.get("category")&&(s.category=f.get("category")),f.get("min_price")&&(s.minPrice=f.get("min_price")),f.get("max_price")&&(s.maxPrice=f.get("max_price")),f.get("ordering")&&(s.ordering=f.get("ordering")),f.get("in_stock")&&(s.inStock=f.get("in_stock")==="true"),f.get("sale")&&(s.onSale=f.get("sale")==="true"),f.get("featured")&&(s.featured=f.get("featured")==="true"),s}function j(){let f=document.getElementById("search-form"),s=document.getElementById("search-input");s&&(s.value=a),f?.addEventListener("submit",i=>{i.preventDefault();let u=s?.value.trim();u&&(a=u,e=1,B(),y())});let n=document.getElementById("search-suggestions"),l=null;s?.addEventListener("input",i=>{let u=i.target.value.trim();if(clearTimeout(l),u.length<2){n&&(n.innerHTML="",n.classList.add("hidden"));return}l=setTimeout(async()=>{try{let d=(await ProductsApi.search({q:u,limit:5})).data||[];n&&d.length>0&&(n.innerHTML=`
                            <div class="py-2">
                                ${d.map(m=>`
                                    <a href="/products/${m.slug}/" class="flex items-center gap-3 px-4 py-2 hover:bg-gray-50">
                                        ${m.image?`<img src="${m.image}" alt="" class="w-10 h-10 object-cover rounded" onerror="this.style.display='none'">`:'<div class="w-10 h-10 bg-gray-100 rounded flex items-center justify-center"><svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg></div>'}
                                        <div>
                                            <p class="text-sm font-medium text-gray-900">${Templates.escapeHtml(m.name)}</p>
                                            <p class="text-sm text-primary-600">${Templates.formatPrice(m.current_price??m.price_converted??m.price)}</p>
                                        </div>
                                    </a>
                                `).join("")}
                            </div>
                        `,n.classList.remove("hidden"))}catch(p){console.error("Search suggestions failed:",p)}},300)}),s?.addEventListener("blur",()=>{setTimeout(()=>{n&&n.classList.add("hidden")},200)})}async function y(){await _()}function M(f,s){let n=document.getElementById("search-results");if(!n)return;if(f.length===0){n.innerHTML=`
                <div class="text-center py-16">
                    <svg class="w-24 h-24 text-gray-300 mx-auto mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
                    </svg>
                    <h2 class="text-2xl font-bold text-gray-900 mb-2">No results found</h2>
                    <p class="text-gray-600 mb-4">We couldn't find any products matching "${Templates.escapeHtml(a)}"</p>
                    <p class="text-gray-500 text-sm">Try different keywords or browse our categories</p>
                </div>
            `;return}let l=Storage.get("productViewMode")||"grid",i=l==="list"?"space-y-4":"grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6";n.innerHTML=`
            <div class="${i}">
                ${f.map(p=>ProductCard.render(p,{layout:l})).join("")}
            </div>
            ${s.total_pages>1?`
                <div id="search-pagination" class="mt-8">${Pagination.render({currentPage:s.current_page||e,totalPages:s.total_pages,totalItems:s.total})}</div>
            `:""}
        `,ProductCard.bindEvents(n),document.getElementById("search-pagination")?.addEventListener("click",p=>{let d=p.target.closest("[data-page]");d&&(e=parseInt(d.dataset.page),B(),y(),window.scrollTo({top:0,behavior:"smooth"}))})}async function D(){let f=document.getElementById("filter-categories");if(f)try{let n=(await CategoriesAPI.getAll({has_products:!0,limit:20})).data||[];f.innerHTML=`
                <div class="space-y-2">
                    <label class="flex items-center">
                        <input type="radio" name="category" value="" ${t.category?"":"checked"} class="text-primary-600 focus:ring-primary-500">
                        <span class="ml-2 text-sm text-gray-600">All Categories</span>
                    </label>
                    ${n.map(l=>`
                        <label class="flex items-center">
                            <input type="radio" name="category" value="${l.id}" ${t.category===String(l.id)?"checked":""} class="text-primary-600 focus:ring-primary-500">
                            <span class="ml-2 text-sm text-gray-600">${Templates.escapeHtml(l.name)}</span>
                        </label>
                    `).join("")}
                </div>
            `,A()}catch{}}function A(){document.querySelectorAll('input[name="category"]').forEach(s=>{s.addEventListener("change",n=>{n.target.value?t.category=n.target.value:delete t.category,e=1,B(),y()})})}function E(){let f=document.getElementById("apply-price-filter"),s=document.getElementById("filter-in-stock"),n=document.getElementById("clear-filters");f?.addEventListener("click",()=>{let u=document.getElementById("filter-min-price")?.value,p=document.getElementById("filter-max-price")?.value;u?t.min_price=u:delete t.min_price,p?t.max_price=p:delete t.max_price,e=1,B(),y()}),s?.addEventListener("change",u=>{u.target.checked?t.in_stock=!0:delete t.in_stock,e=1,B(),y()}),n?.addEventListener("click",()=>{t={},e=1,document.querySelectorAll('input[name="category"]').forEach(d=>{d.checked=d.value===""});let u=document.getElementById("filter-min-price"),p=document.getElementById("filter-max-price");u&&(u.value=""),p&&(p.value=""),s&&(s.checked=!1),B(),y()});let l=document.getElementById("filter-min-price"),i=document.getElementById("filter-max-price");l&&t.min_price&&(l.value=t.min_price),i&&t.max_price&&(i.value=t.max_price),s&&t.in_stock&&(s.checked=!0)}function b(){let f=document.getElementById("sort-select");f&&(f.value=t.ordering||"",f.addEventListener("change",s=>{s.target.value?t.ordering=s.target.value:delete t.ordering,e=1,B(),y()}))}function B(){let f=new URLSearchParams;a&&f.set("q",a),t.category&&f.set("category",t.category),t.min_price&&f.set("min_price",t.min_price),t.max_price&&f.set("max_price",t.max_price),t.ordering&&f.set("ordering",t.ordering),t.in_stock&&f.set("in_stock","true"),e>1&&f.set("page",e);let s=`${window.location.pathname}?${f.toString()}`;window.history.pushState({},"",s)}function $(){o&&(o.abort(),o=null),a="",e=1,t={},h=!1}return{init:v,destroy:$}})();window.SearchPage=Ds;fr=Ds});var Ys={};J(Ys,{default:()=>xr});var Ws,xr,Qs=Q(()=>{Ws=(function(){"use strict";let a=1,e="added_desc",t="all";function o(){return window.BUNORAA_CURRENCY?.symbol||"\u09F3"}let h={get CURRENCY_SYMBOL(){return o()},PRIORITY_LEVELS:{low:{label:"Low",color:"gray",icon:"\u25CB"},normal:{label:"Normal",color:"blue",icon:"\u25D0"},high:{label:"High",color:"amber",icon:"\u25CF"},urgent:{label:"Urgent",color:"red",icon:"\u2605"}}};async function v(){AuthGuard.protectPage()&&(await q(),j())}function C(E={}){let b=E.product||E||{},B=[E.product_image,b.product_image,b.primary_image,b.image,Array.isArray(b.images)?b.images[0]:null,b.image_url,b.thumbnail],$=f=>{if(!f)return"";if(typeof f=="string")return f;if(typeof f=="object"){if(typeof f.image=="string"&&f.image)return f.image;if(f.image&&typeof f.image=="object"){if(typeof f.image.url=="string"&&f.image.url)return f.image.url;if(typeof f.image.src=="string"&&f.image.src)return f.image.src}if(typeof f.url=="string"&&f.url)return f.url;if(typeof f.src=="string"&&f.src)return f.src}return""};for(let f of B){let s=$(f);if(s)return s}return""}function _(E={}){let b=E.product||E||{},B=d=>{if(d==null)return null;let m=Number(d);return Number.isFinite(m)?m:null},$=[E.product_price,b.price,E.price,E.current_price,E.price_at_add],f=null;for(let d of $)if(f=B(d),f!==null)break;let s=[E.product_sale_price,b.sale_price,E.sale_price],n=null;for(let d of s)if(n=B(d),n!==null)break;let l=B(E.lowest_price_seen),i=B(E.highest_price_seen),u=B(E.target_price),p=B(E.price_at_add);return{price:f!==null?f:0,salePrice:n!==null?n:null,lowestPrice:l,highestPrice:i,targetPrice:u,priceAtAdd:p}}async function q(){let E=document.getElementById("wishlist-container");if(E){Loader.show(E,"skeleton");try{let b=await WishlistApi.getWishlist({page:a,sort:e}),B=[],$={};Array.isArray(b)?B=b:b&&typeof b=="object"&&(B=b.data||b.results||b.items||[],!Array.isArray(B)&&b.data&&typeof b.data=="object"?(B=b.data.items||b.data.results||[],$=b.data.meta||b.meta||{}):$=b.meta||{}),Array.isArray(B)||(B=B&&typeof B=="object"?[B]:[]);let f=B;t==="on_sale"?f=B.filter(s=>{let n=_(s);return n.salePrice&&n.salePrice<n.price}):t==="in_stock"?f=B.filter(s=>s.is_in_stock!==!1):t==="price_drop"?f=B.filter(s=>{let n=_(s);return n.priceAtAdd&&n.price<n.priceAtAdd}):t==="at_target"&&(f=B.filter(s=>{let n=_(s);return n.targetPrice&&n.price<=n.targetPrice})),R(f,B,$)}catch(b){let B=b&&(b.message||b.detail)||"Failed to load wishlist.";if(b&&b.status===401){AuthGuard.redirectToLogin();return}E.innerHTML=`<p class="text-red-500 text-center py-8">${Templates.escapeHtml(B)}</p>`}}}function R(E,b,B){let $=document.getElementById("wishlist-container");if(!$)return;let f=b.length,s=b.filter(i=>{let u=_(i);return u.salePrice&&u.salePrice<u.price}).length,n=b.filter(i=>{let u=_(i);return u.priceAtAdd&&u.price<u.priceAtAdd}).length,l=b.filter(i=>{let u=_(i);return u.targetPrice&&u.price<=u.targetPrice}).length;if(f===0){$.innerHTML=`
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
            `;return}if($.innerHTML=`
            <!-- Header with Stats -->
            <div class="mb-6">
                <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">My Wishlist</h1>
                        <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">${f} items saved</p>
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
                        <div class="text-2xl font-bold text-gray-900 dark:text-white">${f}</div>
                        <div class="text-xs text-gray-500 dark:text-gray-400">Total Items</div>
                    </div>
                    <div class="bg-white dark:bg-gray-800 rounded-lg p-3 border border-gray-200 dark:border-gray-700 ${s>0?"ring-2 ring-green-500":""}">
                        <div class="text-2xl font-bold text-green-600 dark:text-green-400">${s}</div>
                        <div class="text-xs text-gray-500 dark:text-gray-400">On Sale</div>
                    </div>
                    <div class="bg-white dark:bg-gray-800 rounded-lg p-3 border border-gray-200 dark:border-gray-700 ${n>0?"ring-2 ring-blue-500":""}">
                        <div class="text-2xl font-bold text-blue-600 dark:text-blue-400">${n}</div>
                        <div class="text-xs text-gray-500 dark:text-gray-400">Price Dropped</div>
                    </div>
                    <div class="bg-white dark:bg-gray-800 rounded-lg p-3 border border-gray-200 dark:border-gray-700 ${l>0?"ring-2 ring-amber-500":""}">
                        <div class="text-2xl font-bold text-amber-600 dark:text-amber-400">${l}</div>
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
                ${E.map(i=>Y(i)).join("")}
            </div>
            
            ${E.length===0&&f>0?`
                <div class="text-center py-12">
                    <p class="text-gray-500 dark:text-gray-400">No items match the selected filter.</p>
                    <button class="mt-4 text-primary-600 hover:underline" onclick="document.querySelector('[data-filter=all]').click()">Show all items</button>
                </div>
            `:""}
            
            ${B.total_pages>1?'<div id="wishlist-pagination" class="mt-8"></div>':""}
        `,B&&B.total_pages>1){let i=document.getElementById("wishlist-pagination");if(i&&window.Pagination){let u=new window.Pagination({totalPages:B.total_pages,currentPage:B.current_page||a,className:"justify-center",onChange:p=>{a=p,q(),window.scrollTo({top:0,behavior:"smooth"})}});i.innerHTML="",i.appendChild(u.create())}}y()}function Y(E){try{let b=E.product||E||{},B=E.product_name||b.name||"",$=E.product_slug||b.slug||"",f=E.is_in_stock!==void 0?E.is_in_stock:b.is_in_stock!==void 0?b.is_in_stock:b.stock_quantity>0,s=C(E||{}),n=!!E.product_has_variants,l={price:0,salePrice:null,lowestPrice:null,highestPrice:null,targetPrice:null,priceAtAdd:null};try{l=_(E||{})}catch{l={price:0,salePrice:null}}let{price:i,salePrice:u,lowestPrice:p,highestPrice:d,targetPrice:m,priceAtAdd:L}=l,T=u||i,N=L&&T<L,V=L?Math.round((T-L)/L*100):0,k=m&&T<=m,S=u&&u<i,U=E.priority||"normal",O=h.PRIORITY_LEVELS[U]||h.PRIORITY_LEVELS.normal,P=se=>{try{return Templates.escapeHtml(se||"")}catch{return String(se||"")}},X=se=>{try{return Price.render({price:se.price,salePrice:se.salePrice})}catch{return`<span class="font-bold">${h.CURRENCY_SYMBOL}${se.price||0}</span>`}},ee=se=>{try{return Templates.formatPrice(se)}catch{return`${h.CURRENCY_SYMBOL}${se}`}},re=b&&b.aspect&&(b.aspect.css||(b.aspect.width&&b.aspect.height?`${b.aspect.width}/${b.aspect.height}`:null))||"1/1";return`
                <div class="wishlist-item relative bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden group" 
                     data-item-id="${E&&E.id?E.id:""}" 
                     data-product-id="${b&&b.id?b.id:E&&E.product?E.product:""}" 
                     data-product-slug="${P($)}" 
                     data-product-has-variants="${n}"
                     data-priority="${U}">
                    
                    <!-- Image Section -->
                    <div class="relative" style="aspect-ratio: ${re};">
                        <!-- Badges -->
                        <div class="absolute top-2 left-2 z-10 flex flex-col gap-1">
                            ${S?`
                                <div class="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
                                    -${Math.round((1-u/i)*100)}%
                                </div>
                            `:""}
                            ${N?`
                                <div class="bg-blue-500 text-white text-xs font-bold px-2 py-1 rounded flex items-center">
                                    <svg class="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
                                    </svg>
                                    ${Math.abs(V)}% drop
                                </div>
                            `:""}
                            ${k?`
                                <div class="bg-amber-500 text-white text-xs font-bold px-2 py-1 rounded flex items-center">
                                    <svg class="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                                    </svg>
                                    Target!
                                </div>
                            `:""}
                            ${f?"":`
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
                        <a href="/products/${P($)}/">
                            ${s?`
                                <img 
                                    src="${s}" 
                                    alt="${P(B)}"
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
                        ${b&&b.category?`
                            <a href="/categories/${P(b.category.slug)}/" class="text-xs text-gray-500 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400">
                                ${P(b.category.name)}
                            </a>
                        `:""}
                        <h3 class="font-medium text-gray-900 dark:text-white mt-1 line-clamp-2">
                            <a href="/products/${P($)}/" class="hover:text-primary-600 dark:hover:text-primary-400">
                                ${P(B)}
                            </a>
                        </h3>
                        
                        <!-- Price Section -->
                        <div class="mt-2">
                            ${X({price:i,salePrice:u})}
                        </div>
                        
                        <!-- Price History -->
                        ${p||m?`
                            <div class="mt-2 text-xs space-y-1">
                                ${p?`
                                    <div class="flex items-center justify-between text-gray-500 dark:text-gray-400">
                                        <span>Lowest:</span>
                                        <span class="font-medium text-green-600 dark:text-green-400">${ee(p)}</span>
                                    </div>
                                `:""}
                                ${m?`
                                    <div class="flex items-center justify-between text-gray-500 dark:text-gray-400">
                                        <span>Target:</span>
                                        <span class="font-medium text-amber-600 dark:text-amber-400">${ee(m)}</span>
                                    </div>
                                `:""}
                            </div>
                        `:""}
                        
                        <!-- Rating -->
                        ${b&&b.average_rating?`
                            <div class="flex items-center gap-1 mt-2">
                                ${Templates.renderStars(b.average_rating)}
                                <span class="text-xs text-gray-500 dark:text-gray-400">(${b.review_count||0})</span>
                            </div>
                        `:""}
                        
                        <!-- Actions -->
                        <div class="mt-4 flex gap-2">
                            <button 
                                class="add-to-cart-btn flex-1 px-3 py-2 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors text-sm flex items-center justify-center"
                                ${f?"":"disabled"}
                            >
                                <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path>
                                </svg>
                                ${n?"Options":f?"Add":"Sold Out"}
                            </button>
                            <button class="set-target-btn px-3 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-sm" title="Set target price" data-item-id="${E.id}" data-current-price="${T}">
                                <svg class="w-4 h-4" fill="${m?"currentColor":"none"}" stroke="currentColor" viewBox="0 0 24 24">
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
            `}catch(b){return console.error("Failed to render wishlist item:",b),'<div class="p-4 bg-white dark:bg-gray-800 rounded shadow text-gray-500 dark:text-gray-400">Failed to render item</div>'}}function j(){document.getElementById("wishlist-sort")?.addEventListener("change",E=>{e=E.target.value,q()}),document.querySelectorAll(".filter-btn").forEach(E=>{E.addEventListener("click",()=>{t=E.dataset.filter,q()})})}function y(){let E=document.getElementById("clear-wishlist-btn"),b=document.getElementById("add-all-to-cart-btn"),B=document.getElementById("share-wishlist-btn"),$=document.querySelectorAll(".wishlist-item"),f=document.getElementById("wishlist-sort"),s=document.querySelectorAll(".filter-btn");f?.addEventListener("change",n=>{e=n.target.value,q()}),s.forEach(n=>{n.addEventListener("click",()=>{t=n.dataset.filter,q()})}),E?.addEventListener("click",async()=>{if(await Modal.confirm({title:"Clear Wishlist",message:"Are you sure you want to remove all items from your wishlist?",confirmText:"Clear All",cancelText:"Cancel"}))try{await WishlistApi.clear(),Toast.success("Wishlist cleared."),await q()}catch(l){Toast.error(l.message||"Failed to clear wishlist.")}}),b?.addEventListener("click",async()=>{let n=b;n.disabled=!0,n.innerHTML='<svg class="animate-spin w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>Adding...';try{let l=document.querySelectorAll('.wishlist-item:not([data-product-has-variants="true"])'),i=0,u=0;for(let p of l){let d=p.dataset.productId;if(d)try{await CartApi.addItem(d,1),i++}catch{u++}}i>0&&(Toast.success(`Added ${i} items to cart!`),document.dispatchEvent(new CustomEvent("cart:updated"))),u>0&&Toast.warning(`${u} items could not be added (may require variant selection).`)}catch(l){Toast.error(l.message||"Failed to add items to cart.")}finally{n.disabled=!1,n.innerHTML='<svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>Add All to Cart'}}),B?.addEventListener("click",async()=>{try{let n=`${window.location.origin}/wishlist/share/`;navigator.share?await navigator.share({title:"My Wishlist",text:"Check out my wishlist!",url:n}):(await navigator.clipboard.writeText(n),Toast.success("Wishlist link copied to clipboard!"))}catch(n){n.name!=="AbortError"&&Toast.error("Failed to share wishlist.")}}),$.forEach(n=>{let l=n.dataset.itemId,i=n.dataset.productId,u=n.dataset.productSlug;n.querySelector(".remove-btn")?.addEventListener("click",async()=>{try{await WishlistApi.removeItem(l),Toast.success("Removed from wishlist."),n.remove(),document.querySelectorAll(".wishlist-item").length===0&&await q()}catch(p){Toast.error(p.message||"Failed to remove item.")}}),n.querySelector(".priority-btn")?.addEventListener("click",async()=>{let p=["low","normal","high","urgent"],d=n.dataset.priority||"normal",m=p.indexOf(d),L=p[(m+1)%p.length];try{WishlistApi.updateItem&&await WishlistApi.updateItem(l,{priority:L}),n.dataset.priority=L;let T=n.querySelector(".priority-btn"),N=h.PRIORITY_LEVELS[L];T.title=`Priority: ${N.label}`,T.innerHTML=`<span class="text-sm">${N.icon}</span>`,T.className=`priority-btn w-8 h-8 rounded-full bg-white dark:bg-gray-700 shadow-md flex items-center justify-center text-${N.color}-500 hover:scale-110 transition-transform`,Toast.success(`Priority set to ${N.label}`)}catch{Toast.error("Failed to update priority.")}}),n.querySelector(".set-target-btn")?.addEventListener("click",async()=>{let p=parseFloat(n.querySelector(".set-target-btn").dataset.currentPrice)||0,d=`
                    <div class="space-y-4">
                        <p class="text-sm text-gray-600 dark:text-gray-400">Set a target price and we'll notify you when the item drops to or below this price.</p>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Current Price</label>
                            <div class="text-lg font-bold text-gray-900 dark:text-white">${h.CURRENCY_SYMBOL}${p.toLocaleString()}</div>
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Target Price</label>
                            <div class="flex items-center">
                                <span class="text-gray-500 mr-2">${h.CURRENCY_SYMBOL}</span>
                                <input type="number" id="target-price-input" value="${Math.round(p*.9)}" min="1" max="${p}" class="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-primary-500 focus:border-primary-500">
                            </div>
                            <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">Suggested: ${h.CURRENCY_SYMBOL}${Math.round(p*.9).toLocaleString()} (10% off)</p>
                        </div>
                    </div>
                `,m=await Modal.open({title:"Set Target Price",content:d,confirmText:"Set Alert",cancelText:"Cancel",onConfirm:async()=>{let L=parseFloat(document.getElementById("target-price-input").value);if(!L||L<=0)return Toast.error("Please enter a valid target price."),!1;try{return WishlistApi.updateItem&&await WishlistApi.updateItem(l,{target_price:L}),Toast.success(`Price alert set for ${h.CURRENCY_SYMBOL}${L.toLocaleString()}`),await q(),!0}catch{return Toast.error("Failed to set price alert."),!1}}})}),n.querySelector(".add-to-cart-btn")?.addEventListener("click",async p=>{let d=p.target.closest(".add-to-cart-btn");if(d.disabled)return;d.disabled=!0;let m=d.innerHTML;if(d.innerHTML='<svg class="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>',n.dataset.productHasVariants==="true"||n.dataset.productHasVariants==="True"||n.dataset.productHasVariants==="1"){D(n),d.disabled=!1,d.innerHTML=m;return}try{await CartApi.addItem(i,1),Toast.success("Added to cart!"),document.dispatchEvent(new CustomEvent("cart:updated"))}catch(T){if(!!(T&&(T.errors&&T.errors.variant_id||T.message&&typeof T.message=="string"&&T.message.toLowerCase().includes("variant")))&&(Toast.info("This product requires selecting a variant."),u)){window.location.href=`/products/${u}/`;return}Toast.error(T.message||"Failed to add to cart.")}finally{d.disabled=!1,d.innerHTML=m}})})}function M(E){let b={};return E.forEach(B=>{b[B.attribute_name]||(b[B.attribute_name]=[]),b[B.attribute_name].push(B)}),Object.entries(b).map(([B,$])=>`
            <div class="mt-4">
                <label class="text-sm font-medium text-gray-700">${Templates.escapeHtml(B)}:</label>
                <div class="flex flex-wrap gap-2 mt-2" id="wishlist-variant-group-${Templates.slugify(B)}">
                    ${$.map((f,s)=>`
                        <button type="button" class="wishlist-modal-variant-btn px-3 py-2 border rounded-lg text-sm transition-colors ${s===0?"border-primary-500 bg-primary-50 text-primary-700":"border-gray-300 hover:border-gray-400"}" data-variant-id="${f.id}" data-price="${f.price_converted??f.price??""}" data-stock="${f.stock_quantity||0}">
                            ${Templates.escapeHtml(f.value)}
                            ${f.price_converted??f.price?`<span class="text-xs text-gray-500"> (${Templates.formatPrice(f.price_converted??f.price)})</span>`:""}
                        </button>
                    `).join("")}
                </div>
            </div>
        `).join("")}async function D(E){let b=E.product_slug||E.dataset?.productSlug||"",B=E.product||E.dataset?.productId||"";try{let $;if(typeof ProductsApi<"u"&&ProductsApi.getProduct)$=await ProductsApi.getProduct(b||B);else{let u=window.BUNORAA_CURRENCY&&window.BUNORAA_CURRENCY.code||void 0;$=await ApiClient.get(`/catalog/products/${b||B}/`,{currency:u})}if(!$||!$.success||!$.data){let u=$&&$.message?$.message:"Failed to load product variants.";Toast.error(u);return}let f=$.data,s=f.variants||[];if(!s.length){window.location.href=`/products/${f.slug||b||B}/`;return}let n=f.images?.[0]?.image||f.primary_image||f.image||"",l=`
                <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div class="col-span-1">
                        ${n?`<img src="${n}" class="w-full h-48 object-cover rounded" alt="${Templates.escapeHtml(f.name)}">`:'<div class="w-full h-48 bg-gray-100 rounded"></div>'}
                    </div>
                    <div class="col-span-2">
                        <h3 class="text-lg font-semibold">${Templates.escapeHtml(f.name)}</h3>
                        <div id="wishlist-variant-price" class="mt-2 text-lg font-bold">${Templates.formatPrice(s?.[0]?.price_converted??s?.[0]?.price??f.price)}</div>
                        <div id="wishlist-variant-options" class="mt-4">
                            ${M(s)}
                        </div>
                        <div class="mt-4 flex items-center gap-2">
                            <label class="text-sm text-gray-700">Qty</label>
                            <input id="wishlist-variant-qty" type="number" value="1" min="1" class="w-20 px-3 py-2 border rounded" />
                        </div>
                    </div>
                </div>
            `,i=await Modal.open({title:"Select Variant",content:l,confirmText:"Add to Cart",cancelText:"Cancel",size:"md",onConfirm:async()=>{let p=document.querySelector(".wishlist-modal-variant-btn.border-primary-500")||document.querySelector(".wishlist-modal-variant-btn");if(!p)return Toast.error("Please select a variant."),!1;let d=p.dataset.variantId,m=parseInt(document.getElementById("wishlist-variant-qty")?.value)||1;try{return await CartApi.addItem(f.id,m,d),Toast.success("Added to cart!"),document.dispatchEvent(new CustomEvent("cart:updated")),!0}catch(L){return Toast.error(L.message||"Failed to add to cart."),!1}}});setTimeout(()=>{let u=document.querySelectorAll(".wishlist-modal-variant-btn");u.forEach(d=>{d.addEventListener("click",()=>{u.forEach(L=>L.classList.remove("border-primary-500","bg-primary-50","text-primary-700")),d.classList.add("border-primary-500","bg-primary-50","text-primary-700");let m=d.dataset.price;if(m!==void 0){let L=document.getElementById("wishlist-variant-price");L&&(L.textContent=Templates.formatPrice(m))}})});let p=document.querySelector(".wishlist-modal-variant-btn");p&&p.click()},20)}catch{Toast.error("Failed to load variants.")}}function A(){a=1}return{init:v,destroy:A}})();window.WishlistPage=Ws;xr=Ws});var vr,Ye=Q(()=>{vr=Ge({"./pages/account.js":()=>Promise.resolve().then(()=>(hs(),gs)),"./pages/cart.js":()=>Promise.resolve().then(()=>(vs(),xs)),"./pages/category.js":()=>Promise.resolve().then(()=>(ws(),ys)),"./pages/checkout.js":()=>Promise.resolve().then(()=>(Es(),Cs)),"./pages/contact.js":()=>Promise.resolve().then(()=>(Ts(),$s)),"./pages/faq.js":()=>Promise.resolve().then(()=>(Ss(),Bs)),"./pages/home.js":()=>Promise.resolve().then(()=>(Hs(),qs)),"./pages/orders.js":()=>Promise.resolve().then(()=>(Ns(),js)),"./pages/preorders.js":()=>Promise.resolve().then(()=>rr(Fs())),"./pages/product.js":()=>Promise.resolve().then(()=>(Rs(),Os)),"./pages/search.js":()=>Promise.resolve().then(()=>(Us(),Vs)),"./pages/wishlist.js":()=>Promise.resolve().then(()=>(Qs(),Ys))})});var br=Je(()=>{ms();Ye();var Qe=(function(){"use strict";let a={},e=null,t=null;async function o($){try{let f=await vr(`./pages/${$}.js`);return f.default||f}catch{return null}}function h(){q(),R(),Y(),j(),v(),D(),E(),b();try{let $=performance.getEntriesByType?performance.getEntriesByType("navigation"):[],f=$&&$[0]||null;f&&f.type==="navigate"&&!window.location.hash&&setTimeout(()=>{let s=document.scrollingElement||document.documentElement;if(!s)return;let n=s.scrollTop||window.pageYOffset||0,l=Math.max(0,s.scrollHeight-window.innerHeight);n>Math.max(100,l*.6)&&window.scrollTo({top:0,behavior:"auto"})},60)}catch{}}async function v(){try{if(!AuthApi.isAuthenticated()){let n=localStorage.getItem("wishlist");if(n){let l=JSON.parse(n);WishlistApi.updateBadge(l);let i=l.items||l.data&&l.data.items||[];_(i)}else _([]);return}let f=(await WishlistApi.getWishlist({pageSize:200})).data||{},s=f.items||f.data||[];WishlistApi.updateBadge(f),_(s)}catch{try{let f=localStorage.getItem("wishlist");if(f){let s=JSON.parse(f);WishlistApi.updateBadge(s);let n=s.items||s.data&&s.data.items||[];_(n)}}catch{}}}let C=[];function _($){try{C=$||[];let f={},s={};($||[]).forEach(n=>{let l=n.product||n.product_id||n.product&&n.product.id||null,i=n.product_slug||n.product&&n.product.slug||null,u=n.id||n.pk||n.uuid||n.item||null;l&&(f[String(l)]=u||!0),i&&(s[String(i)]=u||!0)}),document.querySelectorAll(".wishlist-btn").forEach(n=>{try{let l=n.querySelector("svg"),i=l?.querySelector(".heart-fill"),u=n.dataset.productId||n.closest("[data-product-id]")?.dataset.productId,p=n.dataset.productSlug||n.closest("[data-product-slug]")?.dataset.productSlug,d=null;u&&f.hasOwnProperty(String(u))?d=f[String(u)]:p&&s.hasOwnProperty(String(p))&&(d=s[String(p)]),d?(n.dataset.wishlistItemId=d,n.classList.add("text-red-500"),n.setAttribute("aria-pressed","true"),l?.classList.add("fill-current"),i&&(i.style.opacity="1")):(n.removeAttribute("data-wishlist-item-id"),n.classList.remove("text-red-500"),n.setAttribute("aria-pressed","false"),l?.classList.remove("fill-current"),i&&(i.style.opacity="0"))}catch{}})}catch{}}(function(){if(typeof MutationObserver>"u")return;let $=null;new MutationObserver(function(s){let n=!1;for(let l of s){if(l.addedNodes&&l.addedNodes.length){for(let i of l.addedNodes)if(i.nodeType===1&&(i.matches?.(".product-card")||i.querySelector?.(".product-card")||i.querySelector?.(".wishlist-btn"))){n=!0;break}}if(n)break}n&&(clearTimeout($),$=setTimeout(()=>{try{_(C)}catch{}},150))}).observe(document.body,{childList:!0,subtree:!0})})();function q(){let $=window.location.pathname,f=document.body;if(f.dataset.page){e=f.dataset.page;return}if(($.startsWith("/accounts/")||$.startsWith("/account/"))&&!($.startsWith("/accounts/profile")||$.startsWith("/account/profile"))){e=null;return}$==="/"||$==="/home/"?e="home":$==="/categories/"||$==="/products/"?e="search":$.startsWith("/categories/")&&$!=="/categories/"?e="category":$.startsWith("/products/")&&$!=="/products/"?e="product":$==="/search/"||$.startsWith("/search")?e="search":$.startsWith("/cart")?e="cart":$.startsWith("/checkout")?e="checkout":$==="/account"||$.startsWith("/account/")||$.startsWith("/accounts/profile")?e="account":$.startsWith("/orders")?e="orders":$.startsWith("/wishlist")?e="wishlist":$.startsWith("/contact")&&(e="contact")}function R(){typeof Tabs<"u"&&document.querySelector("[data-tabs]")&&Tabs.init(),typeof Dropdown<"u"&&document.querySelectorAll("[data-dropdown-trigger]").forEach($=>{let f=$.dataset.dropdownTarget,s=document.getElementById(f);s&&Dropdown.create($,{content:s.innerHTML})});try{us()}catch{}}async function Y(){if(!e)return;try{t&&typeof t.destroy=="function"&&t.destroy()}catch{}let $=await o(e);if($&&typeof $.init=="function"){t=$;try{await t.init()}catch(f){console.error("failed to init page controller",f)}}}try{"serviceWorker"in navigator&&navigator.serviceWorker.register("/static/js/sw.js").catch(()=>{})}catch{}async function j(){if(document.querySelectorAll("[data-cart-count]").length)try{let s=(await CartApi.getCart()).data?.item_count||0;try{localStorage.setItem("cart",JSON.stringify({item_count:s,savedAt:Date.now()}))}catch{}M(s)}catch{try{let s=localStorage.getItem("cart");if(s){let l=JSON.parse(s)?.item_count||0;M(l);return}}catch(s){console.error("Failed to get cart count fallback:",s)}}}async function y($){try{return(((await WishlistApi.getWishlist({pageSize:200})).data||{}).items||[]).find(i=>String(i.product)===String($))?.id||null}catch{return null}}function M($){document.querySelectorAll("[data-cart-count]").forEach(s=>{s.textContent=$>99?"99+":$,s.classList.toggle("hidden",$===0)})}function D(){document.addEventListener("cart:updated",async()=>{await j()}),document.addEventListener("wishlist:updated",async()=>{await v()}),document.addEventListener("auth:login",()=>{A(!0)}),document.addEventListener("auth:logout",()=>{A(!1)}),document.querySelectorAll(".wishlist-btn").forEach(f=>{try{let s=f.querySelector("svg"),n=s?.querySelector(".heart-fill");f.classList.contains("text-red-500")?(s?.classList.add("fill-current"),n&&(n.style.opacity="1")):n&&(n.style.opacity="0")}catch{}}),document.addEventListener("click",async f=>{let s=f.target.closest("[data-quick-add], [data-add-to-cart], .add-to-cart-btn");if(s){f.preventDefault();let n=s.dataset.productId||s.dataset.quickAdd||s.dataset.addToCart;if(!n)return;s.disabled=!0;let l=s.innerHTML;s.innerHTML='<svg class="animate-spin h-4 w-4 mx-auto" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>';try{await CartApi.addItem(n,1),Toast.success("Added to cart!"),document.dispatchEvent(new CustomEvent("cart:updated"))}catch(i){Toast.error(i.message||"Failed to add to cart.")}finally{s.disabled=!1,s.innerHTML=l}}}),document.addEventListener("click",async f=>{let s=f.target.closest("[data-wishlist-toggle], .wishlist-btn");if(s){if(f.preventDefault(),!AuthApi.isAuthenticated()){Toast.warning("Please login to add items to your wishlist."),window.location.href="/account/login/?next="+encodeURIComponent(window.location.pathname);return}let n=s.dataset.wishlistToggle||s.dataset.productId||s.closest("[data-product-id]")?.dataset.productId;s.disabled=!0;let l=s.dataset.wishlistItemId||"";!l&&s.classList.contains("text-red-500")&&(l=await y(n)||"");let u=s.classList.contains("text-red-500")&&l;try{if(u){let p=await WishlistApi.removeItem(l);s.classList.remove("text-red-500"),s.setAttribute("aria-pressed","false"),s.querySelector("svg")?.classList.remove("fill-current");let d=s.querySelector("svg")?.querySelector(".heart-fill");d&&(d.style.opacity="0"),s.removeAttribute("data-wishlist-item-id"),Toast.success("Removed from wishlist.")}else{let p=await WishlistApi.addItem(n),d=p.data?.id||p.data?.item?.id||await y(n);d&&(s.dataset.wishlistItemId=d),s.classList.add("text-red-500"),s.setAttribute("aria-pressed","true"),s.querySelector("svg")?.classList.add("fill-current");let m=s.querySelector("svg")?.querySelector(".heart-fill");m&&(m.style.opacity="1"),Toast.success(p.message||"Added to wishlist!")}}catch(p){console.error("wishlist:error",p),Toast.error(p.message||"Failed to update wishlist.")}finally{s.disabled=!1}}}),document.addEventListener("click",f=>{let s=f.target.closest("[data-quick-view], .quick-view-btn");if(s){f.preventDefault();let n=s.dataset.quickView||s.dataset.productId,l=s.dataset.productSlug;l?window.location.href=`/products/${l}/`:n&&(typeof Modal<"u"&&Modal.showQuickView?Modal.showQuickView(n):window.location.href=`/products/${n}/`)}}),document.addEventListener("click",async f=>{if(f.target.closest("[data-logout]")){f.preventDefault();try{await AuthApi.logout(),Toast.success("Logged out successfully."),document.dispatchEvent(new CustomEvent("auth:logout")),window.location.href="/"}catch{Toast.error("Failed to logout.")}}});let $=document.getElementById("back-to-top");$&&(window.addEventListener("scroll",Debounce.throttle(()=>{window.scrollY>500?$.classList.remove("opacity-0","pointer-events-none"):$.classList.add("opacity-0","pointer-events-none")},100)),$.addEventListener("click",()=>{window.scrollTo({top:0,behavior:"smooth"})}))}function A($){document.querySelectorAll("[data-auth-state]").forEach(s=>{let n=s.dataset.authState;n==="logged-in"?s.classList.toggle("hidden",!$):n==="logged-out"&&s.classList.toggle("hidden",$)})}function E(){let $=document.getElementById("mobile-menu-btn"),f=document.getElementById("close-mobile-menu"),s=document.getElementById("mobile-menu"),n=document.getElementById("mobile-menu-overlay");function l(){s?.classList.remove("translate-x-full"),n?.classList.remove("hidden"),document.body.classList.add("overflow-hidden")}function i(){s?.classList.add("translate-x-full"),n?.classList.add("hidden"),document.body.classList.remove("overflow-hidden")}$?.addEventListener("click",l),f?.addEventListener("click",i),n?.addEventListener("click",i)}function b(){let $=document.querySelector("[data-language-selector]"),f=document.getElementById("language-dropdown");$&&f&&(Dropdown.create($,f),f.querySelectorAll("[data-language]").forEach(s=>{s.addEventListener("click",async()=>{let n=s.dataset.language;try{await LocalizationApi.setLanguage(n),Storage.set("language",n),window.location.reload()}catch{Toast.error("Failed to change language.")}})}))}function B(){t&&typeof t.destroy=="function"&&t.destroy(),e=null,t=null}return{init:h,destroy:B,getCurrentPage:()=>e,updateCartBadge:M}})();document.readyState==="loading"?document.addEventListener("DOMContentLoaded",Qe.init):Qe.init();window.App=Qe});br();})();
//# sourceMappingURL=app.bundle.js.map
