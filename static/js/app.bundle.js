(()=>{var pr=Object.create;var _e=Object.defineProperty;var gr=Object.getOwnPropertyDescriptor;var hr=Object.getOwnPropertyNames;var fr=Object.getPrototypeOf,xr=Object.prototype.hasOwnProperty;var pt=n=>e=>{var t=n[e];if(t)return t();throw new Error("Module not found in bundle: "+e)};var X=(n,e)=>()=>(n&&(e=n(n=0)),e);var gt=(n,e)=>()=>(e||n((e={exports:{}}).exports,e),e.exports),te=(n,e)=>{for(var t in e)_e(n,t,{get:e[t],enumerable:!0})},br=(n,e,t,o)=>{if(e&&typeof e=="object"||typeof e=="function")for(let m of hr(e))!xr.call(n,m)&&m!==t&&_e(n,m,{get:()=>e[m],enumerable:!(o=gr(e,m))||o.enumerable});return n};var vr=(n,e,t)=>(t=n!=null?pr(fr(n)):{},br(e||!n||!n.__esModule?_e(t,"default",{value:n,enumerable:!0}):t,n));function P(...n){return n.flat().filter(e=>e&&typeof e=="string").join(" ")}function z(n="div",{id:e="",className:t="",attrs:o={},html:m="",text:v=""}={}){let k=document.createElement(n);return e&&(k.id=e),t&&(k.className=t),v&&(k.textContent=v),m&&(k.innerHTML=m),Object.entries(o).forEach(([I,H])=>{H===!0?k.setAttribute(I,""):H!==!1&&H!==null&&k.setAttribute(I,H)}),k}function ht(n,e,t,o={}){if(n)return n.addEventListener(e,t,o),()=>n.removeEventListener(e,t,o)}function Te(n){let e=n.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'),t=e[0],o=e[e.length-1];return{init(){n.addEventListener("keydown",m=>{m.key==="Tab"&&(m.shiftKey?document.activeElement===t&&(m.preventDefault(),o.focus()):document.activeElement===o&&(m.preventDefault(),t.focus()))})},destroy(){}}}function ft(){return"id-"+Math.random().toString(36).substr(2,9)+Date.now().toString(36)}function Ee(n=""){return z("div",{className:P("fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity duration-200",n),attrs:{"data-backdrop":"true"}})}var Ie,ae=X(()=>{Ie={isEnter:n=>n.key==="Enter",isEscape:n=>n.key==="Escape",isArrowUp:n=>n.key==="ArrowUp",isArrowDown:n=>n.key==="ArrowDown",isArrowLeft:n=>n.key==="ArrowLeft",isArrowRight:n=>n.key==="ArrowRight",isSpace:n=>n.key===" ",isTab:n=>n.key==="Tab"}});var O,ne=X(()=>{ae();O=class n{constructor(e={}){this.id=e.id||ft(),this.element=null,this.listeners=[],this.isInitialized=!1,this.config=e}create(e="div",{className:t="",attrs:o={},html:m=""}={}){return this.element=z(e,{id:this.id,className:t,attrs:o,html:m}),this.element}mount(e){if(!this.element)return!1;let t=typeof e=="string"?document.querySelector(e):e;return t?(t.appendChild(this.element),this.isInitialized=!0,!0):!1}on(e,t,o={}){if(!this.element)return;let m=ht(this.element,e,t,o);return this.listeners.push(m),m}delegate(e,t,o){if(!this.element)return;let m=v=>{let k=v.target.closest(e);k&&o.call(k,v)};this.element.addEventListener(t,m),this.listeners.push(()=>this.element.removeEventListener(t,m))}addClass(...e){this.element&&this.element.classList.add(...e)}removeClass(...e){this.element&&this.element.classList.remove(...e)}toggleClass(e,t){this.element&&this.element.classList.toggle(e,t)}hasClass(e){return this.element?.classList.contains(e)??!1}attr(e,t){if(this.element){if(t===void 0)return this.element.getAttribute(e);t===null||t===!1?this.element.removeAttribute(e):t===!0?this.element.setAttribute(e,""):this.element.setAttribute(e,t)}}attrs(e){Object.entries(e).forEach(([t,o])=>{this.attr(t,o)})}text(e){this.element&&(this.element.textContent=e)}html(e){this.element&&(this.element.innerHTML=e)}append(e){this.element&&e&&this.element.appendChild(e instanceof n?e.element:e)}prepend(e){this.element&&e&&this.element.prepend(e instanceof n?e.element:e)}show(){this.element&&(this.element.style.display="",this.element.removeAttribute("hidden"))}hide(){this.element&&(this.element.style.display="none")}toggle(e){this.element&&(e===void 0&&(e=this.element.style.display==="none"),e?this.show():this.hide())}getStyle(e){return this.element?window.getComputedStyle(this.element).getPropertyValue(e):null}setStyle(e,t){this.element&&(this.element.style[e]=t)}setStyles(e){Object.entries(e).forEach(([t,o])=>{this.setStyle(t,o)})}focus(e){if(this.element)try{typeof e>"u"?this.element.focus({preventScroll:!0}):this.element.focus(e)}catch{try{this.element.focus()}catch{}}}blur(){this.element&&this.element.blur()}getPosition(){return this.element?this.element.getBoundingClientRect():null}destroy(){this.listeners.forEach(e=>e?.()),this.listeners=[],this.element?.parentNode&&this.element.parentNode.removeChild(this.element),this.element=null,this.isInitialized=!1}init(){this.element&&!this.isInitialized&&(this.isInitialized=!0)}render(){return this.element}}});var xt={};te(xt,{Alert:()=>Se});var Se,bt=X(()=>{ne();ae();Se=class extends O{constructor(e={}){super(e),this.title=e.title||"",this.message=e.message||"",this.type=e.type||"default",this.icon=e.icon||null,this.closeable=e.closeable||!1,this.className=e.className||""}create(){let e={default:{bg:"bg-blue-50",border:"border-blue-200",title:"text-blue-900",message:"text-blue-800",icon:"\u24D8"},success:{bg:"bg-green-50",border:"border-green-200",title:"text-green-900",message:"text-green-800",icon:"\u2713"},warning:{bg:"bg-yellow-50",border:"border-yellow-200",title:"text-yellow-900",message:"text-yellow-800",icon:"\u26A0"},error:{bg:"bg-red-50",border:"border-red-200",title:"text-red-900",message:"text-red-800",icon:"\u2715"},info:{bg:"bg-cyan-50",border:"border-cyan-200",title:"text-cyan-900",message:"text-cyan-800",icon:"\u2139"}},t=e[this.type]||e.default,m=super.create("div",{className:P("p-4 rounded-lg border-2",t.bg,t.border,this.className),attrs:{role:"alert"}}),v="";return(this.title||this.icon)&&(v+='<div class="flex items-center gap-3 mb-2">',this.icon,v+=`<span class="text-xl font-bold ${t.title}">${this.icon||t.icon}</span>`,this.title&&(v+=`<h4 class="font-semibold ${t.title}">${this.title}</h4>`),v+="</div>"),this.message&&(v+=`<p class="${t.message}">${this.message}</p>`),this.closeable&&(v+='<button class="absolute top-4 right-4 text-gray-400 hover:text-gray-600" aria-label="Close alert">\xD7</button>'),m.innerHTML=v,this.closeable&&m.querySelector("button")?.addEventListener("click",()=>{this.destroy()}),m}setMessage(e){if(this.message=e,this.element){let t=this.element.querySelector("p");t&&(t.textContent=e)}}}});var vt={};te(vt,{AlertDialog:()=>Me});var Me,yt=X(()=>{ne();ae();Me=class extends O{constructor(e={}){super(e),this.title=e.title||"",this.message=e.message||"",this.confirmText=e.confirmText||"Confirm",this.cancelText=e.cancelText||"Cancel",this.type=e.type||"warning",this.onConfirm=e.onConfirm||null,this.onCancel=e.onCancel||null,this.open=e.open||!1}create(){let e=super.create("div",{className:P("fixed inset-0 z-50 flex items-center justify-center",this.open?"":"hidden"),attrs:{role:"alertdialog","aria-modal":"true","aria-labelledby":`${this.id}-title`,"aria-describedby":`${this.id}-message`}}),t=Ee();e.appendChild(t);let o=document.createElement("div");o.className="bg-white rounded-lg shadow-lg relative z-50 w-full max-w-md mx-4";let m=document.createElement("div");m.className="px-6 py-4 border-b border-gray-200";let v=document.createElement("h2");v.id=`${this.id}-title`,v.className="text-lg font-semibold text-gray-900",v.textContent=this.title,m.appendChild(v),o.appendChild(m);let k=document.createElement("div");k.id=`${this.id}-message`,k.className="px-6 py-4 text-gray-700",k.textContent=this.message,o.appendChild(k);let I=document.createElement("div");I.className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex gap-3 justify-end rounded-b-lg";let H=document.createElement("button");H.className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100 transition-colors duration-200",H.textContent=this.cancelText,H.addEventListener("click",()=>this.handleCancel()),I.appendChild(H);let U=document.createElement("button"),K=this.type==="danger"?"bg-red-600 text-white hover:bg-red-700":"bg-blue-600 text-white hover:bg-blue-700";return U.className=P("px-4 py-2 rounded-md transition-colors duration-200",K),U.textContent=this.confirmText,U.addEventListener("click",()=>this.handleConfirm()),I.appendChild(U),o.appendChild(I),e.appendChild(o),this.focusTrap=Te(o),e}open(){this.element||this.create(),this.open=!0,this.element.classList.remove("hidden"),this.focusTrap.init(),document.body.style.overflow="hidden"}close(){this.open=!1,this.element?.classList.add("hidden"),document.body.style.overflow=""}handleConfirm(){this.onConfirm&&this.onConfirm(),this.close()}handleCancel(){this.onCancel&&this.onCancel(),this.close()}}});var wt={};te(wt,{Avatar:()=>qe});var qe,kt=X(()=>{ne();ae();qe=class extends O{constructor(e={}){super(e),this.src=e.src||"",this.alt=e.alt||"",this.initials=e.initials||"",this.size=e.size||"md",this.className=e.className||"",this.fallbackBg=e.fallbackBg||"bg-blue-600"}create(){let e={xs:"w-6 h-6 text-xs",sm:"w-8 h-8 text-sm",md:"w-10 h-10 text-base",lg:"w-12 h-12 text-lg",xl:"w-16 h-16 text-xl"},t="rounded-full overflow-hidden flex items-center justify-center flex-shrink-0 font-semibold";return this.src?super.create("img",{className:P(t,e[this.size],this.className),attrs:{src:this.src,alt:this.alt,role:"img"}}):this.initials?super.create("div",{className:P(t,e[this.size],"text-white",this.fallbackBg,this.className),text:this.initials.toUpperCase()}):super.create("div",{className:P(t,e[this.size],"bg-gray-300",this.className),html:'<svg class="w-full h-full text-gray-500" fill="currentColor" viewBox="0 0 24 24"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>'})}setSrc(e,t=""){this.src=e,this.alt=t,this.element&&this.element.tagName==="IMG"&&(this.element.src=e,this.element.alt=t)}setInitials(e,t=""){if(this.initials=e,t&&(this.fallbackBg=t),this.element&&(this.element.textContent=e.toUpperCase(),t&&this.element.className.includes("bg-"))){let o=this.element.className.match(/bg-\S+/)[0];this.element.classList.remove(o),this.element.classList.add(t)}}}});var Ct={};te(Ct,{Badge:()=>He});var He,Et=X(()=>{ne();ae();He=class extends O{constructor(e={}){super(e),this.label=e.label||"Badge",this.variant=e.variant||"default",this.size=e.size||"md",this.className=e.className||""}create(){let e="inline-flex items-center rounded font-semibold whitespace-nowrap",t={default:"bg-gray-100 text-gray-800",primary:"bg-blue-100 text-blue-800",success:"bg-green-100 text-green-800",warning:"bg-yellow-100 text-yellow-800",destructive:"bg-red-100 text-red-800",outline:"border border-gray-300 text-gray-700"},o={sm:"px-2 py-1 text-xs",md:"px-3 py-1 text-sm",lg:"px-4 py-2 text-base"},m=super.create("span",{className:P(e,t[this.variant],o[this.size],this.className)});return m.textContent=this.label,m}setLabel(e){this.label=e,this.element&&(this.element.textContent=e)}}});var Lt={};te(Lt,{Button:()=>Pe});var Pe,$t=X(()=>{ne();ae();Pe=class extends O{constructor(e={}){super(e),this.label=e.label||"Button",this.variant=e.variant||"default",this.size=e.size||"md",this.disabled=e.disabled||!1,this.onClick=e.onClick||null,this.className=e.className||""}create(){let e="px-4 py-2 font-medium rounded transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-offset-2",t={default:"bg-gray-200 text-gray-900 hover:bg-gray-300",primary:"bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500",secondary:"bg-green-600 text-white hover:bg-green-700 focus:ring-green-500",destructive:"bg-red-600 text-white hover:bg-red-700 focus:ring-red-500",outline:"border-2 border-gray-300 text-gray-900 hover:bg-gray-50",ghost:"text-gray-900 hover:bg-gray-100"},o={sm:"px-2 py-1 text-sm",md:"px-4 py-2 text-base",lg:"px-6 py-3 text-lg"},m=super.create("button",{className:P(e,t[this.variant],o[this.size],this.className),attrs:{disabled:this.disabled}});return m.textContent=this.label,this.onClick&&this.on("click",this.onClick),m}setLabel(e){this.label=e,this.element&&(this.element.textContent=e)}setDisabled(e){this.disabled=e,this.attr("disabled",e?"":null)}setLoading(e){this.setDisabled(e),e?this.html('<span class="flex items-center gap-2"><span class="inline-block w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></span>Loading...</span>'):this.text(this.label)}}});var Tt={};te(Tt,{ButtonGroup:()=>je});var je,It=X(()=>{ne();ae();je=class extends O{constructor(e={}){super(e),this.buttons=e.buttons||[],this.orientation=e.orientation||"horizontal",this.size=e.size||"md",this.className=e.className||""}create(){let e=this.orientation==="vertical"?"flex-col":"flex-row",o=super.create("div",{className:P("flex",e,"inline-flex border border-gray-300 rounded-md overflow-hidden",this.className),attrs:{role:"group"}});return this.buttons.forEach((m,v)=>{let k=document.createElement("button");k.textContent=m.label||"Button",k.className=P("px-4 py-2 font-medium text-gray-700 hover:bg-gray-50 transition-colors duration-200",v>0?this.orientation==="vertical"?"border-t border-gray-300":"border-l border-gray-300":"",m.disabled?"opacity-50 cursor-not-allowed":""),k.disabled=m.disabled||!1,m.onClick&&k.addEventListener("click",m.onClick),o.appendChild(k)}),o}addButton(e,t){if(this.element){let o=document.createElement("button");o.textContent=e,o.className=P("px-4 py-2 font-medium text-gray-700 hover:bg-gray-50 transition-colors duration-200 border-l border-gray-300"),t&&o.addEventListener("click",t),this.element.appendChild(o)}}}});var At={};te(At,{Breadcrumb:()=>Ne});var Ne,Bt=X(()=>{ne();ae();Ne=class extends O{constructor(e={}){super(e),this.items=e.items||[],this.className=e.className||""}create(){let t=super.create("nav",{className:P("flex items-center gap-2",this.className),attrs:{"aria-label":"Breadcrumb"}});return this.items.forEach((o,m)=>{if(m>0){let v=z("span",{className:"text-gray-400 mx-1",text:"/"});t.appendChild(v)}if(m===this.items.length-1){let v=z("span",{className:"text-gray-700 font-medium",text:o.label,attrs:{"aria-current":"page"}});t.appendChild(v)}else{let v=z("a",{className:"text-blue-600 hover:text-blue-800 hover:underline transition-colors duration-200",text:o.label,attrs:{href:o.href||"#"}});t.appendChild(v)}}),t}addItem(e,t="#"){if(this.element){if(this.element.children.length>0){let m=z("span",{className:"text-gray-400 mx-1",text:"/"});this.element.appendChild(m)}let o=z("a",{className:"text-blue-600 hover:text-blue-800 hover:underline transition-colors duration-200",text:e,attrs:{href:t}});this.element.appendChild(o),this.items.push({label:e,href:t})}}}});var _t={};te(_t,{Card:()=>Fe});var Fe,St=X(()=>{ne();ae();Fe=class extends O{constructor(e={}){super(e),this.title=e.title||"",this.subtitle=e.subtitle||"",this.content=e.content||"",this.footer=e.footer||"",this.className=e.className||"",this.hoverable=e.hoverable!==!1}create(){let e="bg-white rounded-lg border border-gray-200 overflow-hidden",t=this.hoverable?"hover:shadow-lg transition-shadow duration-300":"",o=super.create("div",{className:P(e,t,this.className)});if(this.title){let m=z("div",{className:"px-6 py-4 border-b border-gray-200 bg-gray-50"}),v=`<h3 class="text-lg font-semibold text-gray-900">${this.title}</h3>`;this.subtitle&&(v+=`<p class="text-sm text-gray-600 mt-1">${this.subtitle}</p>`),m.innerHTML=v,o.appendChild(m)}if(this.content){let m=z("div",{className:"px-6 py-4",html:this.content});o.appendChild(m)}if(this.footer){let m=z("div",{className:"px-6 py-4 border-t border-gray-200 bg-gray-50",html:this.footer});o.appendChild(m)}return o}setContent(e){if(this.content=e,this.element){let t=this.element.querySelector(".px-6.py-4:not(.border-b):not(.border-t)");t&&(t.innerHTML=e)}}addContent(e){if(this.element){let t=this.element.querySelector(".px-6.py-4:not(.border-b):not(.border-t)");t&&t.appendChild(e instanceof O?e.element:e)}}}});var Mt={};te(Mt,{Carousel:()=>ze});var ze,qt=X(()=>{ne();ae();ze=class extends O{constructor(e={}){super(e),this.items=e.items||[],this.autoplay=e.autoplay||!0,this.interval=e.interval||5e3,this.className=e.className||"",this.currentIndex=0,this.autoplayTimer=null}create(){let e=super.create("div",{className:P("relative w-full bg-black rounded-lg overflow-hidden",this.className)}),t=z("div",{className:"relative w-full h-96 overflow-hidden"});this.items.forEach((k,I)=>{let H=z("div",{className:P("absolute inset-0 transition-opacity duration-500",I===this.currentIndex?"opacity-100":"opacity-0")}),U=document.createElement("img");if(U.src=k.src,U.alt=k.alt||"",U.className="w-full h-full object-cover",H.appendChild(U),k.title){let K=z("div",{className:"absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4",html:`<p class="text-white font-semibold">${k.title}</p>`});H.appendChild(K)}t.appendChild(H)}),e.appendChild(t);let o=z("button",{className:"absolute left-4 top-1/2 transform -translate-y-1/2 z-10 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75 transition-all",html:"\u276E"});o.addEventListener("click",()=>{this.previous()});let m=z("button",{className:"absolute right-4 top-1/2 transform -translate-y-1/2 z-10 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75 transition-all",html:"\u276F"});m.addEventListener("click",()=>{this.next()}),e.appendChild(o),e.appendChild(m);let v=z("div",{className:"absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2 z-10"});return this.items.forEach((k,I)=>{let H=z("button",{className:P("w-2 h-2 rounded-full transition-all",I===this.currentIndex?"bg-white w-8":"bg-gray-500"),attrs:{"data-index":I}});H.addEventListener("click",()=>{this.goTo(I)}),v.appendChild(H)}),e.appendChild(v),this.slidesElement=t,this.dotsElement=v,this.autoplay&&this.startAutoplay(),e}next(){this.currentIndex=(this.currentIndex+1)%this.items.length,this.updateSlides()}previous(){this.currentIndex=(this.currentIndex-1+this.items.length)%this.items.length,this.updateSlides()}goTo(e){this.currentIndex=e,this.updateSlides(),this.autoplay&&this.resetAutoplay()}updateSlides(){let e=this.slidesElement.querySelectorAll("div"),t=this.dotsElement.querySelectorAll("button");e.forEach((o,m)=>{o.className=P("absolute inset-0 transition-opacity duration-500",m===this.currentIndex?"opacity-100":"opacity-0")}),t.forEach((o,m)=>{o.className=P("w-2 h-2 rounded-full transition-all",m===this.currentIndex?"bg-white w-8":"bg-gray-500")})}startAutoplay(){this.autoplayTimer=setInterval(()=>{this.next()},this.interval)}stopAutoplay(){this.autoplayTimer&&clearInterval(this.autoplayTimer)}resetAutoplay(){this.stopAutoplay(),this.autoplay&&this.startAutoplay()}destroy(){this.stopAutoplay(),super.destroy()}}});var Ht={};te(Ht,{Chart:()=>Oe});var Oe,Pt=X(()=>{ne();ae();Oe=class extends O{constructor(e={}){super(e),this.type=e.type||"bar",this.data=e.data||[],this.title=e.title||"",this.height=e.height||"300px",this.className=e.className||""}create(){let e=super.create("div",{className:P("bg-white rounded-lg border border-gray-200 p-4",this.className)});if(this.title){let o=z("h3",{className:"text-lg font-semibold text-gray-900 mb-4",text:this.title});e.appendChild(o)}let t=this.createSVG();return e.appendChild(t),e}createSVG(){let e=Math.max(...this.data.map(k=>k.value)),t=400,o=200,m=40,v=document.createElementNS("http://www.w3.org/2000/svg","svg");if(v.setAttribute("viewBox",`0 0 ${t} ${o}`),v.setAttribute("class","w-full"),this.type==="bar"){let k=(t-m*2)/this.data.length;this.data.forEach((I,H)=>{let U=I.value/e*(o-m*2),K=m+H*k+k*.25,N=o-m-U,y=document.createElementNS("http://www.w3.org/2000/svg","rect");y.setAttribute("x",K),y.setAttribute("y",N),y.setAttribute("width",k*.5),y.setAttribute("height",U),y.setAttribute("fill","#3b82f6"),y.setAttribute("class","hover:fill-blue-700 transition-colors"),v.appendChild(y);let M=document.createElementNS("http://www.w3.org/2000/svg","text");M.setAttribute("x",K+k*.25),M.setAttribute("y",o-10),M.setAttribute("text-anchor","middle"),M.setAttribute("font-size","12"),M.setAttribute("fill","#6b7280"),M.textContent=I.label,v.appendChild(M)})}return v}setData(e){if(this.data=e,this.element&&this.element.parentNode){let t=this.create();this.element.parentNode.replaceChild(t,this.element),this.element=t}}}});var jt={};te(jt,{Checkbox:()=>Re});var Re,Nt=X(()=>{ne();ae();Re=class extends O{constructor(e={}){super(e),this.label=e.label||"",this.checked=e.checked||!1,this.disabled=e.disabled||!1,this.required=e.required||!1,this.name=e.name||"",this.className=e.className||"",this.onChange=e.onChange||null}create(){let t=super.create("div",{className:P("flex items-center gap-2",this.className)}),o="w-5 h-5 border-2 border-gray-300 rounded cursor-pointer transition-colors duration-200 checked:bg-blue-600 checked:border-blue-600 disabled:opacity-50 disabled:cursor-not-allowed",m=document.createElement("input");if(m.type="checkbox",m.className=o,m.checked=this.checked,m.disabled=this.disabled,m.required=this.required,this.name&&(m.name=this.name),t.appendChild(m),this.label){let v=document.createElement("label");v.className="cursor-pointer select-none",v.textContent=this.label,t.appendChild(v),v.addEventListener("click",()=>{m.click()})}return this.onChange&&m.addEventListener("change",this.onChange),this.inputElement=m,t}isChecked(){return this.inputElement?.checked||!1}setChecked(e){this.checked=e,this.inputElement&&(this.inputElement.checked=e)}setDisabled(e){this.disabled=e,this.inputElement&&(this.inputElement.disabled=e)}toggle(){this.setChecked(!this.isChecked())}}});var Ft={};te(Ft,{Collapsible:()=>Ve});var Ve,zt=X(()=>{ne();ae();Ve=class extends O{constructor(e={}){super(e),this.title=e.title||"",this.content=e.content||"",this.open=e.open||!1,this.className=e.className||"",this.onChange=e.onChange||null}create(){let e=super.create("div",{className:P("border border-gray-200 rounded-lg overflow-hidden",this.className)}),t=z("button",{className:P("w-full px-4 py-3 flex items-center justify-between","hover:bg-gray-50 transition-colors duration-200 text-left"),attrs:{"aria-expanded":this.open}}),o=z("span",{className:"font-semibold text-gray-900",text:this.title}),m=z("span",{className:P("w-5 h-5 transition-transform duration-300",this.open?"rotate-180":""),html:"\u25BC"});t.appendChild(o),t.appendChild(m),t.addEventListener("click",()=>{this.toggle()}),e.appendChild(t);let v=z("div",{className:P("overflow-hidden transition-all duration-300",this.open?"max-h-96":"max-h-0","border-t border-gray-200")}),k=z("div",{className:"px-4 py-3",html:this.content});return v.appendChild(k),e.appendChild(v),this.triggerElement=t,this.contentElement=v,this.chevron=m,e}toggle(){this.open=!this.open,this.updateUI(),this.onChange&&this.onChange(this.open)}open(){this.open||(this.open=!0,this.updateUI(),this.onChange&&this.onChange(!0))}close(){this.open&&(this.open=!1,this.updateUI(),this.onChange&&this.onChange(!1))}updateUI(){this.triggerElement.setAttribute("aria-expanded",this.open),this.contentElement.className=P("overflow-hidden transition-all duration-300",this.open?"max-h-96":"max-h-0","border-t border-gray-200"),this.chevron.className=P("w-5 h-5 transition-transform duration-300",this.open?"rotate-180":"")}setContent(e){if(this.content=e,this.contentElement){let t=this.contentElement.querySelector("div");t&&(t.innerHTML=e)}}}});var Ot={};te(Ot,{Command:()=>De});var De,Rt=X(()=>{ne();ae();De=class extends O{constructor(e={}){super(e),this.commands=e.commands||[],this.placeholder=e.placeholder||"Type a command...",this.className=e.className||"",this.open=!1}create(){let e=super.create("div",{className:P("fixed inset-0 z-50 hidden flex items-start justify-center pt-20",this.open?"flex":"")}),t=z("div",{className:"absolute inset-0 bg-black bg-opacity-50"});e.appendChild(t),t.addEventListener("click",()=>this.close());let o=z("div",{className:"relative w-full max-w-md bg-white rounded-lg shadow-lg z-50"}),m=document.createElement("input");m.type="text",m.placeholder=this.placeholder,m.className="w-full px-4 py-3 border-b border-gray-200 focus:outline-none",m.autofocus=!0,o.appendChild(m);let v=z("div",{className:"max-h-96 overflow-y-auto"}),k=(I="")=>{v.innerHTML="";let H=I?this.commands.filter(K=>K.label.toLowerCase().includes(I.toLowerCase())):this.commands;if(H.length===0){let K=z("div",{className:"px-4 py-3 text-sm text-gray-500",text:"No commands found"});v.appendChild(K);return}let U="";H.forEach(K=>{if(K.category&&K.category!==U){U=K.category;let M=z("div",{className:"px-4 py-2 text-xs font-semibold text-gray-600 bg-gray-50 uppercase",text:U});v.appendChild(M)}let N=z("div",{className:P("px-4 py-2 cursor-pointer hover:bg-blue-50 transition-colors flex items-center justify-between group")}),y=z("span",{text:K.label,className:"text-sm text-gray-900"});if(N.appendChild(y),K.shortcut){let M=z("span",{className:"text-xs text-gray-500 group-hover:text-gray-700",text:K.shortcut});N.appendChild(M)}N.addEventListener("click",()=>{K.action&&K.action(),this.close()}),v.appendChild(N)})};return m.addEventListener("input",I=>{k(I.target.value)}),o.appendChild(v),e.appendChild(o),m.addEventListener("keydown",I=>{I.key==="Escape"&&this.close()}),k(),this.containerElement=e,e}open(){this.element||this.create(),this.open=!0,this.element.classList.remove("hidden"),this.element.classList.add("flex")}close(){this.open=!1,this.element?.classList.remove("flex"),this.element?.classList.add("hidden")}toggle(){this.open?this.close():this.open()}}});var Vt={};te(Vt,{Combobox:()=>Ue});var Ue,Dt=X(()=>{ne();ae();Ue=class extends O{constructor(e={}){super(e),this.items=e.items||[],this.value=e.value||"",this.placeholder=e.placeholder||"Search...",this.className=e.className||"",this.onChange=e.onChange||null,this.open=!1}create(){let e=super.create("div",{className:"relative w-full"}),t=document.createElement("input");t.type="text",t.placeholder=this.placeholder,t.value=this.value,t.className=P("w-full px-3 py-2 border border-gray-300 rounded-md","focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent");let o=z("div",{className:P("absolute hidden top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-md shadow-lg z-50","max-h-64 overflow-y-auto")}),m=(v="")=>{o.innerHTML="";let k=this.items.filter(I=>I.label.toLowerCase().includes(v.toLowerCase()));if(k.length===0){let I=z("div",{className:"px-3 py-2 text-gray-500",text:"No results found"});o.appendChild(I);return}k.forEach(I=>{let H=z("div",{className:P("px-3 py-2 cursor-pointer hover:bg-blue-50 transition-colors",I.value===this.value?"bg-blue-100":""),text:I.label,attrs:{"data-value":I.value}});H.addEventListener("click",()=>{this.value=I.value,t.value=I.label,o.classList.add("hidden"),this.onChange&&this.onChange(this.value,I)}),o.appendChild(H)})};return t.addEventListener("input",v=>{m(v.target.value),o.classList.remove("hidden")}),t.addEventListener("focus",()=>{m(t.value),o.classList.remove("hidden")}),t.addEventListener("blur",()=>{setTimeout(()=>{o.classList.add("hidden")},150)}),e.appendChild(t),e.appendChild(o),document.addEventListener("click",v=>{e.contains(v.target)||o.classList.add("hidden")}),this.inputElement=t,this.listElement=o,m(),e}getValue(){return this.value}setValue(e){this.value=e;let t=this.items.find(o=>o.value===e);t&&this.inputElement&&(this.inputElement.value=t.label)}}});var Ut={};te(Ut,{ContextMenu:()=>We});var We,Wt=X(()=>{ne();ae();We=class extends O{constructor(e={}){super(e),this.items=e.items||[],this.className=e.className||"",this.visible=!1}create(){let e=super.create("div",{className:"relative inline-block w-full"}),t=document.createElement("div");return t.className=P("absolute hidden bg-white border border-gray-200 rounded-lg shadow-lg py-1 z-50 min-w-max",this.className),this.items.forEach(o=>{let m=z("button",{className:P("w-full text-left px-4 py-2 hover:bg-gray-100 transition-colors duration-200 flex items-center gap-2",o.disabled?"opacity-50 cursor-not-allowed":"cursor-pointer"),attrs:{disabled:o.disabled?"":null,"data-action":o.label}});if(o.icon){let k=document.createElement("span");k.innerHTML=o.icon,m.appendChild(k)}let v=document.createElement("span");v.textContent=o.label,m.appendChild(v),m.addEventListener("click",()=>{!o.disabled&&o.onClick&&o.onClick(),this.hide()}),t.appendChild(m)}),e.appendChild(t),e.addEventListener("contextmenu",o=>{o.preventDefault(),this.showAt(o.clientX,o.clientY,t)}),document.addEventListener("click",()=>{this.visible&&this.hide()}),this.menuElement=t,e}showAt(e,t,o){o&&(this.visible=!0,o.classList.remove("hidden"),o.style.position="fixed",o.style.left=e+"px",o.style.top=t+"px")}hide(){this.visible=!1,this.menuElement&&(this.menuElement.classList.add("hidden"),this.menuElement.style.position="absolute")}addItem(e,t,o=null){let m={label:e,onClick:t,icon:o};if(this.items.push(m),this.menuElement){let v=z("button",{className:"w-full text-left px-4 py-2 hover:bg-gray-100 transition-colors duration-200 flex items-center gap-2"});if(o){let k=document.createElement("span");k.innerHTML=o,v.appendChild(k)}v.textContent=e,v.addEventListener("click",()=>{t(),this.hide()}),this.menuElement.appendChild(v)}}}});var Yt={};te(Yt,{DatePicker:()=>Ye});var Ye,Qt=X(()=>{ne();ae();Ye=class extends O{constructor(e={}){super(e),this.value=e.value||"",this.placeholder=e.placeholder||"Select date...",this.format=e.format||"yyyy-mm-dd",this.className=e.className||"",this.onChange=e.onChange||null,this.open=!1}create(){let e=super.create("div",{className:"relative w-full"}),t=document.createElement("input");t.type="text",t.placeholder=this.placeholder,t.value=this.value,t.className=P("w-full px-3 py-2 border border-gray-300 rounded-md","focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"),t.addEventListener("click",()=>{this.openPicker()}),t.addEventListener("change",m=>{this.value=m.target.value,this.onChange&&this.onChange(this.value)}),e.appendChild(t);let o=document.createElement("input");return o.type="date",o.style.display="none",o.value=this.value,o.addEventListener("change",m=>{let v=new Date(m.target.value);this.value=this.formatDate(v),t.value=this.value,this.onChange&&this.onChange(this.value)}),e.appendChild(o),this.inputElement=t,this.nativeInput=o,e}openPicker(){this.nativeInput.click()}formatDate(e){let t=e.getFullYear(),o=String(e.getMonth()+1).padStart(2,"0"),m=String(e.getDate()).padStart(2,"0");return this.format==="dd/mm/yyyy"?`${m}/${o}/${t}`:`${t}-${o}-${m}`}getValue(){return this.value}setValue(e){this.value=e,this.inputElement&&(this.inputElement.value=e)}}});var Gt={};te(Gt,{Dialog:()=>Qe});var Qe,Jt=X(()=>{ne();ae();Qe=class extends O{constructor(e={}){super(e),this.title=e.title||"",this.content=e.content||"",this.size=e.size||"md",this.open=e.open||!1,this.onClose=e.onClose||null,this.closeButton=e.closeButton!==!1,this.closeOnBackdrop=e.closeOnBackdrop!==!1,this.closeOnEscape=e.closeOnEscape!==!1}create(){let e=super.create("div",{className:P("fixed inset-0 z-50 flex items-center justify-center",this.open?"":"hidden"),attrs:{role:"dialog","aria-modal":"true","aria-labelledby":`${this.id}-title`,"aria-describedby":`${this.id}-description`}}),t=Ee("dialog-backdrop");e.appendChild(t),this.closeOnBackdrop&&t.addEventListener("click",()=>this.close());let o={sm:"w-full max-w-sm",md:"w-full max-w-md",lg:"w-full max-w-lg",xl:"w-full max-w-xl"},m=document.createElement("div");if(m.className=P("bg-white rounded-lg shadow-lg relative z-50",o[this.size],"mx-4 max-h-[90vh] overflow-y-auto"),this.title){let v=document.createElement("div");v.className="px-6 py-4 border-b border-gray-200 flex items-center justify-between";let k=document.createElement("h2");if(k.id=`${this.id}-title`,k.className="text-xl font-semibold text-gray-900",k.textContent=this.title,v.appendChild(k),this.closeButton){let I=document.createElement("button");I.className="text-gray-500 hover:text-gray-700 transition-colors duration-200",I.innerHTML="\xD7",I.setAttribute("aria-label","Close"),I.addEventListener("click",()=>this.close()),v.appendChild(I)}m.appendChild(v)}if(this.content){let v=document.createElement("div");v.id=`${this.id}-description`,v.className="px-6 py-4",v.innerHTML=this.content,m.appendChild(v)}return e.appendChild(m),this.on("keydown",v=>{Ie.isEscape(v)&&this.closeOnEscape&&this.close()},{once:!1}),this.backdrop=t,this.dialogElement=m,this.focusTrap=Te(m),e}open(){this.element||this.create(),this.open=!0,this.element.classList.remove("hidden"),this.focusTrap.init(),document.body.style.overflow="hidden"}close(){this.open=!1,this.element?.classList.add("hidden"),document.body.style.overflow="",this.onClose&&this.onClose()}toggle(){this.open?this.close():this.open()}setContent(e){if(this.content=e,this.dialogElement){let t=this.dialogElement.querySelector(`#${this.id}-description`);t&&(t.innerHTML=e)}}}});var Xt={};te(Xt,{DropdownMenu:()=>Ge});var Ge,Kt=X(()=>{ne();ae();Ge=class extends O{constructor(e={}){super(e),this.trigger=e.trigger||"Menu",this.items=e.items||[],this.position=e.position||"bottom",this.align=e.align||"left",this.className=e.className||"",this.open=!1}create(){let e=super.create("div",{className:"relative inline-block"}),t=document.createElement("button");t.className="px-4 py-2 bg-gray-100 text-gray-900 rounded hover:bg-gray-200 transition-colors duration-200 flex items-center gap-2",t.innerHTML=`${this.trigger} <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 14l-7 7m0 0l-7-7m7 7V3"></path></svg>`,t.addEventListener("click",()=>this.toggle()),e.appendChild(t);let o=this.position==="top"?"bottom-full mb-2":"top-full mt-2",m=this.align==="right"?"right-0":"left-0",v=document.createElement("div");return v.className=P("absolute hidden bg-white border border-gray-200 rounded-lg shadow-lg py-1 z-50 min-w-max",o,m,this.className),this.items.forEach(k=>{if(k.divider){let U=document.createElement("div");U.className="border-t border-gray-200 my-1",v.appendChild(U);return}let I=z("button",{className:P("w-full text-left px-4 py-2 hover:bg-gray-100 transition-colors duration-200 flex items-center gap-2",k.disabled?"opacity-50 cursor-not-allowed":"cursor-pointer"),attrs:{disabled:k.disabled?"":null}});if(k.icon){let U=document.createElement("span");U.innerHTML=k.icon,U.className="w-4 h-4",I.appendChild(U)}let H=document.createElement("span");H.textContent=k.label,I.appendChild(H),I.addEventListener("click",()=>{!k.disabled&&k.onClick&&k.onClick(),this.close()}),v.appendChild(I)}),e.appendChild(v),document.addEventListener("click",k=>{!e.contains(k.target)&&this.open&&this.close()}),this.triggerBtn=t,this.menuElement=v,e}toggle(){this.open?this.close():this.open()}open(){this.open=!0,this.menuElement.classList.remove("hidden")}close(){this.open=!1,this.menuElement.classList.add("hidden")}addItem(e,t,o=null){let m={label:e,onClick:t,icon:o};if(this.items.push(m),this.menuElement){let v=z("button",{className:"w-full text-left px-4 py-2 hover:bg-gray-100 transition-colors duration-200 flex items-center gap-2"});if(o){let I=document.createElement("span");I.innerHTML=o,I.className="w-4 h-4",v.appendChild(I)}let k=document.createElement("span");k.textContent=e,v.appendChild(k),v.addEventListener("click",()=>{t(),this.close()}),this.menuElement.appendChild(v)}}}});var Zt={};te(Zt,{Drawer:()=>Je});var Je,es=X(()=>{ne();ae();Je=class extends O{constructor(e={}){super(e),this.title=e.title||"",this.content=e.content||"",this.position=e.position||"right",this.open=e.open||!1,this.onClose=e.onClose||null,this.closeButton=e.closeButton!==!1,this.closeOnBackdrop=e.closeOnBackdrop!==!1,this.closeOnEscape=e.closeOnEscape!==!1}create(){let e=super.create("div",{className:P("fixed inset-0 z-50",this.open?"":"hidden")}),t=Ee();e.appendChild(t),this.closeOnBackdrop&&t.addEventListener("click",()=>this.close());let o=this.position==="left"?"left-0":"right-0",m=document.createElement("div");if(m.className=P("absolute top-0 h-full w-96 bg-white shadow-lg transition-transform duration-300 flex flex-col z-50",o,this.open?"translate-x-0":this.position==="left"?"-translate-x-full":"translate-x-full"),this.title){let k=document.createElement("div");k.className="px-6 py-4 border-b border-gray-200 flex items-center justify-between";let I=document.createElement("h2");if(I.className="text-xl font-semibold text-gray-900",I.textContent=this.title,k.appendChild(I),this.closeButton){let H=document.createElement("button");H.className="text-gray-500 hover:text-gray-700 transition-colors duration-200",H.innerHTML="\xD7",H.addEventListener("click",()=>this.close()),k.appendChild(H)}m.appendChild(k)}let v=document.createElement("div");return v.className="flex-1 overflow-y-auto px-6 py-4",v.innerHTML=this.content,m.appendChild(v),e.appendChild(m),this.on("keydown",k=>{Ie.isEscape(k)&&this.closeOnEscape&&this.close()},{once:!1}),this.backdrop=t,this.drawerElement=m,e}open(){this.element||this.create(),this.open=!0,this.element.classList.remove("hidden"),this.drawerElement.classList.remove("-translate-x-full","translate-x-full"),this.drawerElement.classList.add("translate-x-0"),document.body.style.overflow="hidden"}close(){this.open=!1;let e=this.position==="left"?"-translate-x-full":"translate-x-full";this.drawerElement.classList.remove("translate-x-0"),this.drawerElement.classList.add(e),setTimeout(()=>{this.element?.parentNode&&this.element.classList.add("hidden"),document.body.style.overflow=""},300),this.onClose&&this.onClose()}toggle(){this.open?this.close():this.open()}}});var ts={};te(ts,{Empty:()=>Xe});var Xe,ss=X(()=>{ne();ae();Xe=class extends O{constructor(e={}){super(e),this.icon=e.icon||"\u{1F4E6}",this.title=e.title||"No data",this.message=e.message||"There is no data to display",this.action=e.action||null,this.className=e.className||""}create(){let e=super.create("div",{className:P("flex flex-col items-center justify-center p-8 text-center",this.className)}),t=z("div",{className:"text-6xl mb-4",text:this.icon});e.appendChild(t);let o=z("h3",{className:"text-lg font-semibold text-gray-900 mb-2",text:this.title});e.appendChild(o);let m=z("p",{className:"text-gray-500 mb-4",text:this.message});if(e.appendChild(m),this.action){let v=z("button",{className:"px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors",text:this.action.label});v.addEventListener("click",this.action.onClick),e.appendChild(v)}return e}}});var rs={};te(rs,{Form:()=>Ke});var Ke,as=X(()=>{ne();ae();Ke=class extends O{constructor(e={}){super(e),this.fields=e.fields||[],this.onSubmit=e.onSubmit||null,this.submitText=e.submitText||"Submit",this.className=e.className||""}create(){let e=super.create("form",{className:P("space-y-6",this.className)});e.addEventListener("submit",o=>{o.preventDefault(),this.handleSubmit()}),this.fieldElements={},this.fields.forEach(o=>{let m=z("div",{className:"space-y-2"});if(o.label){let I=z("label",{className:"block text-sm font-medium text-gray-700",text:o.label,attrs:{for:o.name}});m.appendChild(I)}let v=document.createElement(o.type==="textarea"?"textarea":"input");v.id=o.name,v.name=o.name,v.className=P("w-full px-3 py-2 border border-gray-300 rounded-md","focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"),o.type!=="textarea"&&(v.type=o.type||"text"),o.placeholder&&(v.placeholder=o.placeholder),o.required&&(v.required=!0),o.disabled&&(v.disabled=!0),v.value=o.value||"",m.appendChild(v);let k=z("div",{className:"text-sm text-red-600 hidden",attrs:{"data-error":o.name}});m.appendChild(k),e.appendChild(m),this.fieldElements[o.name]=v});let t=z("button",{className:P("w-full px-4 py-2 bg-blue-600 text-white font-medium rounded","hover:bg-blue-700 transition-colors duration-200"),text:this.submitText,attrs:{type:"submit"}});return e.appendChild(t),e}handleSubmit(){let e={};Object.entries(this.fieldElements).forEach(([t,o])=>{e[t]=o.value}),this.onSubmit&&this.onSubmit(e)}getValues(){let e={};return Object.entries(this.fieldElements).forEach(([t,o])=>{e[t]=o.value}),e}setValues(e){Object.entries(e).forEach(([t,o])=>{this.fieldElements[t]&&(this.fieldElements[t].value=o)})}setError(e,t){let o=this.element.querySelector(`[data-error="${e}"]`);o&&(o.textContent=t,o.classList.remove("hidden"))}clearError(e){let t=this.element.querySelector(`[data-error="${e}"]`);t&&(t.textContent="",t.classList.add("hidden"))}reset(){this.element&&this.element.reset()}}});var ns={};te(ns,{HoverCard:()=>Ze});var Ze,os=X(()=>{ne();ae();Ze=class extends O{constructor(e={}){super(e),this.trigger=e.trigger||"Hover me",this.content=e.content||"",this.position=e.position||"bottom",this.delay=e.delay||200,this.className=e.className||"",this.visible=!1,this.timeoutId=null}create(){let e=super.create("div",{className:"relative inline-block"}),t=document.createElement("div");t.className="cursor-pointer px-3 py-2 rounded hover:bg-gray-100 transition-colors duration-200",t.textContent=this.trigger,e.appendChild(t);let o=document.createElement("div");return o.className=P("absolute hidden bg-white border border-gray-200 rounded-lg shadow-lg p-4 z-50","min-w-max max-w-sm",this.getPositionClasses(),this.className),o.innerHTML=this.content,e.appendChild(o),e.addEventListener("mouseenter",()=>this.show(o)),e.addEventListener("mouseleave",()=>this.hide(o)),this.cardElement=o,e}getPositionClasses(){let e={top:"bottom-full left-0 mb-2",bottom:"top-full left-0 mt-2",left:"right-full top-0 mr-2",right:"left-full top-0 ml-2"};return e[this.position]||e.bottom}show(e=this.cardElement){this.visible||!e||(this.timeoutId=setTimeout(()=>{this.visible=!0,e.classList.remove("hidden"),e.classList.add("opacity-100","transition-opacity","duration-200")},this.delay))}hide(e=this.cardElement){!this.visible||!e||(clearTimeout(this.timeoutId),this.visible=!1,e.classList.add("hidden"),e.classList.remove("opacity-100"))}setContent(e){this.content=e,this.cardElement&&(this.cardElement.innerHTML=e)}}});var is={};te(is,{Input:()=>et});var et,ls=X(()=>{ne();ae();et=class extends O{constructor(e={}){super(e),this.type=e.type||"text",this.placeholder=e.placeholder||"",this.value=e.value||"",this.name=e.name||"",this.disabled=e.disabled||!1,this.required=e.required||!1,this.className=e.className||"",this.onChange=e.onChange||null}create(){let t=super.create("input",{className:P("w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900 placeholder-gray-500 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed",this.className),attrs:{type:this.type,placeholder:this.placeholder,value:this.value,name:this.name,disabled:this.disabled?"":null,required:this.required?"":null}});return this.onChange&&(this.on("change",this.onChange),this.on("input",this.onChange)),t}getValue(){return this.element?.value||""}setValue(e){this.value=e,this.element&&(this.element.value=e)}setDisabled(e){this.disabled=e,this.attr("disabled",e?"":null)}setPlaceholder(e){this.placeholder=e,this.element&&(this.element.placeholder=e)}focus(){super.focus()}clear(){this.setValue("")}}});var ds={};te(ds,{InputGroup:()=>tt});var tt,cs=X(()=>{ne();ae();tt=class extends O{constructor(e={}){super(e),this.prefix=e.prefix||null,this.suffix=e.suffix||null,this.input=e.input||null,this.className=e.className||""}create(){let t=super.create("div",{className:P("flex items-center border border-gray-300 rounded-md overflow-hidden focus-within:ring-2 focus-within:ring-blue-500",this.className)});if(this.prefix){let o=z("div",{className:"px-3 py-2 bg-gray-50 text-gray-700 font-medium text-sm",html:this.prefix});t.appendChild(o)}if(this.input){let o=this.input.element||this.input.create();o.classList.remove("border","focus:ring-2","focus:ring-blue-500"),t.appendChild(o)}if(this.suffix){let o=z("div",{className:"px-3 py-2 bg-gray-50 text-gray-700 font-medium text-sm",html:this.suffix});t.appendChild(o)}return t}}});var us={};te(us,{InputOTP:()=>st});var st,ms=X(()=>{ne();ae();st=class extends O{constructor(e={}){super(e),this.length=e.length||6,this.value=e.value||"",this.className=e.className||"",this.onChange=e.onChange||null,this.onComplete=e.onComplete||null}create(){let e=super.create("div",{className:P("flex gap-2",this.className)});this.inputs=[];for(let t=0;t<this.length;t++){let o=document.createElement("input");o.type="text",o.maxLength="1",o.inputMode="numeric",o.className=P("w-12 h-12 text-center border-2 border-gray-300 rounded-lg font-semibold text-lg","focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-200","transition-colors duration-200"),this.value&&this.value[t]&&(o.value=this.value[t]),o.addEventListener("input",m=>{let v=m.target.value;if(!/^\d*$/.test(v)){m.target.value="";return}v&&t<this.length-1&&this.inputs[t+1].focus(),this.updateValue()}),o.addEventListener("keydown",m=>{m.key==="Backspace"?!o.value&&t>0&&this.inputs[t-1].focus():m.key==="ArrowLeft"&&t>0?this.inputs[t-1].focus():m.key==="ArrowRight"&&t<this.length-1&&this.inputs[t+1].focus()}),this.inputs.push(o),e.appendChild(o)}return e}updateValue(){this.value=this.inputs.map(e=>e.value).join(""),this.onChange&&this.onChange(this.value),this.value.length===this.length&&this.onComplete&&this.onComplete(this.value)}getValue(){return this.value}setValue(e){this.value=e;for(let t=0;t<this.length;t++)this.inputs[t].value=e[t]||""}clear(){this.inputs.forEach(e=>{e.value=""}),this.value=""}focus(){this.inputs.length>0&&this.inputs[0].focus()}}});var ps={};te(ps,{Item:()=>rt});var rt,gs=X(()=>{ne();ae();rt=class extends O{constructor(e={}){super(e),this.label=e.label||"",this.value=e.value||"",this.icon=e.icon||null,this.className=e.className||"",this.selected=e.selected||!1,this.disabled=e.disabled||!1}create(){let e="flex items-center gap-2 px-3 py-2 rounded cursor-pointer transition-colors duration-200 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed",t=this.selected?"bg-blue-50 text-blue-600":"text-gray-900",o=super.create("div",{className:P(e,t,this.className),attrs:{role:"option","aria-selected":this.selected,disabled:this.disabled?"":null,"data-value":this.value}}),m="";return this.icon&&(m+=`<span class="flex-shrink-0">${this.icon}</span>`),m+=`<span>${this.label}</span>`,o.innerHTML=m,o}setSelected(e){this.selected=e,this.element&&(this.attr("aria-selected",e),this.toggleClass("bg-blue-50 text-blue-600",e))}setDisabled(e){this.disabled=e,this.attr("disabled",e?"":null)}}});var hs={};te(hs,{Label:()=>at});var at,fs=X(()=>{ne();ae();at=class extends O{constructor(e={}){super(e),this.text=e.text||"",this.htmlFor=e.htmlFor||"",this.required=e.required||!1,this.className=e.className||""}create(){let t=super.create("label",{className:P("block text-sm font-medium text-gray-700 mb-1",this.className),attrs:{for:this.htmlFor}}),o=this.text;return this.required&&(o+=' <span class="text-red-500 ml-1">*</span>'),t.innerHTML=o,t}setText(e){if(this.text=e,this.element){let t=e;this.required&&(t+=' <span class="text-red-500 ml-1">*</span>'),this.element.innerHTML=t}}setRequired(e){if(this.required=e,this.element){let t=this.element.querySelector('[class*="text-red"]');e&&!t?this.element.innerHTML+=' <span class="text-red-500 ml-1">*</span>':!e&&t&&t.remove()}}}});var xs={};te(xs,{Kbd:()=>nt});var nt,bs=X(()=>{ne();ae();nt=class extends O{constructor(e={}){super(e),this.label=e.label||"K",this.className=e.className||""}create(){let t=super.create("kbd",{className:P("px-2 py-1 bg-gray-100 border border-gray-300 rounded text-xs font-semibold text-gray-900 inline-block font-mono",this.className)});return t.textContent=this.label,t}setLabel(e){this.label=e,this.element&&(this.element.textContent=e)}}});var vs={};te(vs,{NativeSelect:()=>ot});var ot,ys=X(()=>{ne();ae();ot=class extends O{constructor(e={}){super(e),this.items=e.items||[],this.selected=e.selected||"",this.placeholder=e.placeholder||"Select...",this.disabled=e.disabled||!1,this.required=e.required||!1,this.name=e.name||"",this.className=e.className||"",this.onChange=e.onChange||null}create(){let t=super.create("select",{className:P("w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed bg-white appearance-none cursor-pointer",this.className),attrs:{disabled:this.disabled?"":null,required:this.required?"":null,...this.name&&{name:this.name}}});if(this.placeholder){let o=document.createElement("option");o.value="",o.textContent=this.placeholder,o.disabled=!0,t.appendChild(o)}return this.items.forEach(o=>{let m=document.createElement("option");m.value=o.value,m.textContent=o.label,o.value===this.selected&&(m.selected=!0),t.appendChild(m)}),this.onChange&&this.on("change",this.onChange),t}getValue(){return this.element?.value||""}setValue(e){this.selected=e,this.element&&(this.element.value=e)}setDisabled(e){this.disabled=e,this.attr("disabled",e?"":null)}addItem(e,t){if(this.element){let o=document.createElement("option");o.value=t,o.textContent=e,this.element.appendChild(o)}}removeItem(e){if(this.element){let t=this.element.querySelector(`option[value="${e}"]`);t&&t.remove()}}}});var ws={};te(ws,{Tooltip:()=>it});var it,ks=X(()=>{ne();ae();it=class extends O{constructor(e={}){super(e),this.content=e.content||"",this.position=e.position||"top",this.delay=e.delay||200,this.trigger=e.trigger||"hover",this.className=e.className||"",this.visible=!1,this.timeoutId=null}create(){let e=super.create("div",{className:"relative inline-block"}),t=document.createElement("div");t.className=P("absolute hidden bg-gray-900 text-white px-3 py-2 rounded text-sm whitespace-nowrap z-50","opacity-0 transition-opacity duration-200",this.getPositionClasses(),this.className),t.textContent=this.content;let o=document.createElement("div");return o.className=P("absolute w-2 h-2 bg-gray-900 transform rotate-45",this.getArrowClasses()),t.appendChild(o),e.appendChild(t),this.tooltipElement=t,this.trigger==="hover"?(e.addEventListener("mouseenter",()=>this.show()),e.addEventListener("mouseleave",()=>this.hide())):this.trigger==="focus"&&(e.addEventListener("focus",()=>this.show(),!0),e.addEventListener("blur",()=>this.hide(),!0)),e}getPositionClasses(){let e={top:"bottom-full left-1/2 transform -translate-x-1/2 mb-2",bottom:"top-full left-1/2 transform -translate-x-1/2 mt-2",left:"right-full top-1/2 transform -translate-y-1/2 mr-2",right:"left-full top-1/2 transform -translate-y-1/2 ml-2"};return e[this.position]||e.top}getArrowClasses(){let e={top:"top-full left-1/2 transform -translate-x-1/2 -translate-y-1/2",bottom:"bottom-full left-1/2 transform -translate-x-1/2 translate-y-1/2",left:"left-full top-1/2 transform translate-x-1/2 -translate-y-1/2",right:"right-full top-1/2 transform -translate-x-1/2 -translate-y-1/2"};return e[this.position]||e.top}show(){this.visible||(this.timeoutId=setTimeout(()=>{this.visible=!0,this.tooltipElement.classList.remove("hidden"),this.tooltipElement.classList.add("opacity-100")},this.delay))}hide(){this.visible&&(clearTimeout(this.timeoutId),this.visible=!1,this.tooltipElement.classList.remove("opacity-100"),this.tooltipElement.classList.add("hidden"))}setContent(e){this.content=e,this.tooltipElement&&(this.tooltipElement.textContent=e)}}});var Cs={};te(Cs,{Toggle:()=>lt});var lt,Es=X(()=>{ne();ae();lt=class extends O{constructor(e={}){super(e),this.label=e.label||"",this.pressed=e.pressed||!1,this.disabled=e.disabled||!1,this.variant=e.variant||"default",this.size=e.size||"md",this.className=e.className||"",this.onChange=e.onChange||null}create(){let e="px-4 py-2 font-medium rounded transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed",t={default:this.pressed?"bg-gray-900 text-white":"bg-gray-100 text-gray-900 hover:bg-gray-200",outline:this.pressed?"border-2 border-gray-900 bg-gray-900 text-white":"border-2 border-gray-300 text-gray-900 hover:bg-gray-50"},o={sm:"px-2 py-1 text-sm",md:"px-4 py-2 text-base",lg:"px-6 py-3 text-lg"},m=super.create("button",{className:P(e,t[this.variant],o[this.size],this.className),attrs:{"aria-pressed":this.pressed,disabled:this.disabled?"":null}});return m.textContent=this.label,this.on("click",()=>{this.toggle()}),m}isPressed(){return this.pressed}setPressed(e){this.pressed=e,this.element&&(this.attr("aria-pressed",e),this.toggleClass("bg-gray-900 text-white",e),this.onChange&&this.onChange(e))}toggle(){this.setPressed(!this.pressed)}setDisabled(e){this.disabled=e,this.attr("disabled",e?"":null)}}});var Ls={};te(Ls,{ToggleGroup:()=>dt});var dt,$s=X(()=>{ne();ae();dt=class extends O{constructor(e={}){super(e),this.items=e.items||[],this.selected=e.selected||null,this.multiple=e.multiple||!1,this.orientation=e.orientation||"horizontal",this.className=e.className||"",this.onChange=e.onChange||null}create(){let e=this.orientation==="vertical"?"flex-col":"flex-row",o=super.create("div",{className:P("flex",e,"inline-flex border border-gray-300 rounded-md overflow-hidden",this.className),attrs:{role:"group"}});return this.toggleButtons=[],this.items.forEach((m,v)=>{let k=this.multiple?Array.isArray(this.selected)&&this.selected.includes(m.value):m.value===this.selected,I=P("flex-1 px-4 py-2 font-medium transition-colors duration-200",k?"bg-blue-600 text-white":"bg-white text-gray-700 hover:bg-gray-50",v>0?this.orientation==="vertical"?"border-t border-gray-300":"border-l border-gray-300":""),H=z("button",{className:I,text:m.label,attrs:{"data-value":m.value,"aria-pressed":k,type:"button"}});H.addEventListener("click",()=>{if(this.multiple){Array.isArray(this.selected)||(this.selected=[]);let U=this.selected.indexOf(m.value);U>-1?this.selected.splice(U,1):this.selected.push(m.value)}else this.selected=m.value;this.updateView(),this.onChange&&this.onChange(this.selected)}),o.appendChild(H),this.toggleButtons.push(H)}),o}updateView(){this.toggleButtons.forEach(e=>{let t=e.getAttribute("data-value"),o=this.multiple?Array.isArray(this.selected)&&this.selected.includes(t):t===this.selected;e.setAttribute("aria-pressed",o),e.className=P("flex-1 px-4 py-2 font-medium transition-colors duration-200",o?"bg-blue-600 text-white":"bg-white text-gray-700 hover:bg-gray-50")})}getValue(){return this.selected}setValue(e){this.selected=e,this.updateView()}}});var Ts={};te(Ts,{Toast:()=>ct});var ct,Is=X(()=>{ne();ae();ct=class n extends O{constructor(e={}){super(e),this.message=e.message||"",this.type=e.type||"default",typeof e.duration<"u"?this.duration=e.duration:this.duration=typeof window<"u"&&window.innerWidth<640?2500:3e3,this.position=e.position||"top-right",this.className=e.className||"",this.onClose=e.onClose||null}destroy(){if(!this.element)return;let e=this.element;e.classList.add(this.getExitAnimationClass());let t=()=>{e.removeEventListener("animationend",t),super.destroy();let o=n.getContainer(this.position);o&&o.childElementCount===0&&o.parentNode&&(o.parentNode.removeChild(o),n._containers&&delete n._containers[this.position||"top-right"])};e.addEventListener("animationend",t),setTimeout(t,320)}static getContainer(e){let t=e||"top-right";if(this._containers||(this._containers={}),this._containers[t]&&document.body.contains(this._containers[t]))return this._containers[t];let o=z("div",{className:P("fixed z-50 p-2 flex flex-col gap-2 pointer-events-none",this.getPositionClassesForContainer(t))});return document.body.appendChild(o),this._containers[t]=o,o}static getPositionClassesForContainer(e){switch(e){case"top-left":return"top-4 left-4 items-start";case"top-right":return"top-4 right-4 items-end";case"bottom-left":return"bottom-4 left-4 items-start";case"bottom-right":return"bottom-4 right-4 items-end";case"top-center":return"top-4 left-1/2 -translate-x-1/2 items-center transform";default:return"top-4 right-4 items-end"}}create(){let e=n.getContainer(this.position),t=z("div",{className:P("rounded-lg shadow-lg p-2.5 flex items-center gap-2 min-w-0 max-w-[90vw] sm:max-w-sm bg-opacity-95",this.getEnterAnimationClass(),this.getTypeClasses(),this.className)}),o=z("span",{className:"text-base flex-shrink-0",text:this.getIcon()});t.appendChild(o);let m=z("span",{text:this.message,className:"flex-1 text-sm sm:text-base"});t.appendChild(m),t.setAttribute("role",this.type==="error"?"alert":"status"),t.setAttribute("aria-live",this.type==="error"?"assertive":"polite");let v=z("button",{className:"text-base hover:opacity-70 transition-opacity flex-shrink-0",text:"\xD7"});for(v.setAttribute("aria-label","Dismiss notification"),v.addEventListener("click",()=>{this.destroy()}),t.appendChild(v),this.element=t,e.appendChild(this.element);e.children.length>3;)e.removeChild(e.firstElementChild);return this.duration>0&&setTimeout(()=>{this.destroy()},this.duration),this.element}getEnterAnimationClass(){let e=this.position||"top-right";return e==="top-right"||e==="bottom-right"?"animate-slide-in-right transition-all duration-300 pointer-events-auto":e==="top-left"||e==="bottom-left"?"animate-slide-in-left transition-all duration-300 pointer-events-auto":"animate-slide-in-top transition-all duration-300 pointer-events-auto"}getExitAnimationClass(){let e=this.position||"top-right";return e==="top-right"||e==="bottom-right"?"animate-slide-out-right":e==="top-left"||e==="bottom-left"?"animate-slide-out-left":"animate-slide-out-top"}getPositionClasses(){let e={"top-left":"top-4 left-4","top-right":"top-4 right-4","bottom-left":"bottom-4 left-4","bottom-right":"bottom-4 right-4","top-center":"top-4 left-1/2 -translate-x-1/2 transform"};return e[this.position]||e["bottom-right"]}getTypeClasses(){let e={default:"bg-gray-900 text-white",success:"bg-green-600 text-white",error:"bg-red-600 text-white",warning:"bg-yellow-600 text-white",info:"bg-blue-600 text-white"};return e[this.type]||e.default}getIcon(){let e={default:"\u2139",success:"\u2713",error:"\u2715",warning:"\u26A0",info:"\u2139"};return e[this.type]||e.default}static show(e,t={}){let o=new n({message:e,...t}),m=o.create();return o}static success(e,t={}){return this.show(e,{...t,type:"success"})}static error(e,t={}){return this.show(e,{...t,type:"error",position:t.position||"top-right"})}static info(e,t={}){return this.show(e,{...t,type:"info"})}static warning(e,t={}){return this.show(e,{...t,type:"warning"})}};if(!document.querySelector("style[data-toast]")){let n=document.createElement("style");n.setAttribute("data-toast","true"),n.textContent=`
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
  `,document.head.appendChild(n)}});function As({root:n=document,selector:e="[data-hydrate]",threshold:t=.15}={}){if(typeof IntersectionObserver>"u")return;let o=new IntersectionObserver(async(m,v)=>{for(let k of m){if(!k.isIntersecting)continue;let I=k.target,H=I.dataset.hydrate||"",[U,K="init"]=H.split("#");if(!U){v.unobserve(I);continue}try{let N=null,y=yr[U];if(typeof y=="function")N=await y();else throw new Error("Module not registered for lazy hydration: "+U);let M=N[K]||N.default||null;if(typeof M=="function")try{M(I)}catch(D){console.error("hydrate init failed",D)}}catch(N){console.error("lazy hydrate import failed for",U,N)}finally{v.unobserve(I)}}},{threshold:t});n.querySelectorAll(e).forEach(m=>o.observe(m))}var yr,Bs=X(()=>{yr={"components/Alert.js":()=>Promise.resolve().then(()=>(bt(),xt)),"components/AlertDialog.js":()=>Promise.resolve().then(()=>(yt(),vt)),"components/Avatar.js":()=>Promise.resolve().then(()=>(kt(),wt)),"components/Badge.js":()=>Promise.resolve().then(()=>(Et(),Ct)),"components/Button.js":()=>Promise.resolve().then(()=>($t(),Lt)),"components/ButtonGroup.js":()=>Promise.resolve().then(()=>(It(),Tt)),"components/Breadcrumb.js":()=>Promise.resolve().then(()=>(Bt(),At)),"components/Card.js":()=>Promise.resolve().then(()=>(St(),_t)),"components/Carousel.js":()=>Promise.resolve().then(()=>(qt(),Mt)),"components/Chart.js":()=>Promise.resolve().then(()=>(Pt(),Ht)),"components/Checkbox.js":()=>Promise.resolve().then(()=>(Nt(),jt)),"components/Collapsible.js":()=>Promise.resolve().then(()=>(zt(),Ft)),"components/Command.js":()=>Promise.resolve().then(()=>(Rt(),Ot)),"components/Combobox.js":()=>Promise.resolve().then(()=>(Dt(),Vt)),"components/ContextMenu.js":()=>Promise.resolve().then(()=>(Wt(),Ut)),"components/DatePicker.js":()=>Promise.resolve().then(()=>(Qt(),Yt)),"components/Dialog.js":()=>Promise.resolve().then(()=>(Jt(),Gt)),"components/DropdownMenu.js":()=>Promise.resolve().then(()=>(Kt(),Xt)),"components/Drawer.js":()=>Promise.resolve().then(()=>(es(),Zt)),"components/Empty.js":()=>Promise.resolve().then(()=>(ss(),ts)),"components/Form.js":()=>Promise.resolve().then(()=>(as(),rs)),"components/HoverCard.js":()=>Promise.resolve().then(()=>(os(),ns)),"components/Input.js":()=>Promise.resolve().then(()=>(ls(),is)),"components/InputGroup.js":()=>Promise.resolve().then(()=>(cs(),ds)),"components/InputOTP.js":()=>Promise.resolve().then(()=>(ms(),us)),"components/Item.js":()=>Promise.resolve().then(()=>(gs(),ps)),"components/Label.js":()=>Promise.resolve().then(()=>(fs(),hs)),"components/Kbd.js":()=>Promise.resolve().then(()=>(bs(),xs)),"components/NativeSelect.js":()=>Promise.resolve().then(()=>(ys(),vs)),"components/Tooltip.js":()=>Promise.resolve().then(()=>(ks(),ws)),"components/Toggle.js":()=>Promise.resolve().then(()=>(Es(),Cs)),"components/ToggleGroup.js":()=>Promise.resolve().then(()=>($s(),Ls)),"components/Toast.js":()=>Promise.resolve().then(()=>(Is(),Ts))}});var Ss={};te(Ss,{default:()=>wr});var _s,wr,Ms=X(()=>{_s=(function(){"use strict";let n=null;async function e(){if(AuthGuard.protectPage()){await U();try{D()}catch{}K(),M(),S(),E(),t()}}function t(){o(),m(),v(),k(),I(),H()}function o(){let a=document.getElementById("loyalty-points");if(!a)return;let s=n?.loyalty_points||Math.floor(Math.random()*500)+100,i=s>=500?"Gold":s>=200?"Silver":"Bronze",l={Bronze:"from-amber-600 to-amber-700",Silver:"from-gray-400 to-gray-500",Gold:"from-yellow-400 to-yellow-500"},u=i==="Gold"?null:i==="Silver"?"Gold":"Silver",h=i==="Gold"?0:i==="Silver"?500:200,c=u?Math.min(100,s/h*100):100;a.innerHTML=`
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
                    ${u?`
                        <div class="mt-4">
                            <div class="flex justify-between text-sm mb-1">
                                <span>${h-s} points to ${u}</span>
                                <span>${Math.round(c)}%</span>
                            </div>
                            <div class="w-full bg-white/30 rounded-full h-2">
                                <div class="bg-white h-2 rounded-full transition-all duration-500" style="width: ${c}%"></div>
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
        `}function m(){let a=document.getElementById("quick-stats");if(!a)return;let s={totalOrders:n?.total_orders||Math.floor(Math.random()*20)+5,totalSpent:n?.total_spent||Math.floor(Math.random()*1e3)+200,wishlistItems:n?.wishlist_count||Math.floor(Math.random()*10)+2,savedAddresses:n?.address_count||Math.floor(Math.random()*3)+1};a.innerHTML=`
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
        `}async function v(){let a=document.getElementById("recent-activity");if(a)try{let i=(await OrdersApi.getAll({limit:3})).data||[];if(i.length===0){a.innerHTML=`
                    <div class="text-center py-6 text-stone-500 dark:text-stone-400">
                        <p>No recent activity</p>
                    </div>
                `;return}a.innerHTML=`
                <div class="bg-white dark:bg-stone-800 rounded-xl border border-gray-100 dark:border-stone-700 overflow-hidden">
                    <div class="px-4 py-3 border-b border-gray-100 dark:border-stone-700 flex items-center justify-between">
                        <h3 class="font-semibold text-stone-900 dark:text-white">Recent Orders</h3>
                        <a href="/orders/" class="text-sm text-primary-600 dark:text-amber-400 hover:underline">View All</a>
                    </div>
                    <div class="divide-y divide-gray-100 dark:divide-stone-700">
                        ${i.map(l=>{let h={pending:"text-yellow-600 dark:text-yellow-400",processing:"text-blue-600 dark:text-blue-400",shipped:"text-indigo-600 dark:text-indigo-400",delivered:"text-green-600 dark:text-green-400",cancelled:"text-red-600 dark:text-red-400"}[l.status]||"text-stone-600 dark:text-stone-400",c=l.items?.[0];return`
                                <a href="/orders/${l.id}/" class="flex items-center gap-4 p-4 hover:bg-stone-50 dark:hover:bg-stone-700/50 transition-colors">
                                    <div class="w-12 h-12 bg-stone-100 dark:bg-stone-700 rounded-lg overflow-hidden flex-shrink-0">
                                        ${c?.product?.image?`<img src="${c.product.image}" alt="" class="w-full h-full object-cover">`:`<div class="w-full h-full flex items-center justify-center text-stone-400">
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
            `}catch{a.innerHTML=""}}function k(){let a=document.getElementById("notification-preferences");if(!a)return;let s=JSON.parse(localStorage.getItem("notificationPreferences")||"{}"),l={...{orderUpdates:!0,promotions:!0,newArrivals:!1,priceDrops:!0,newsletter:!1},...s};a.innerHTML=`
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
        `,a.querySelectorAll("input[data-pref]").forEach(u=>{u.addEventListener("change",()=>{let h=u.dataset.pref,c=JSON.parse(localStorage.getItem("notificationPreferences")||"{}");c[h]=u.checked,localStorage.setItem("notificationPreferences",JSON.stringify(c)),Toast.success("Preference saved")})})}function I(){let a=document.getElementById("quick-reorder");if(!a)return;let s=JSON.parse(localStorage.getItem("recentlyOrdered")||"[]");if(s.length===0){a.classList.add("hidden");return}a.innerHTML=`
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
        `,a.querySelectorAll(".quick-reorder-btn").forEach(i=>{i.addEventListener("click",async()=>{let l=i.dataset.productId;i.disabled=!0;try{await CartApi.addItem(l,1),Toast.success("Added to cart!"),document.dispatchEvent(new CustomEvent("cart:updated"))}catch{Toast.error("Failed to add to cart")}finally{i.disabled=!1}})})}function H(){let a=document.getElementById("security-check");if(!a)return;let s=0,i=[],l=n?.email_verified!==!1;l&&(s+=25),i.push({label:"Email verified",completed:l});let u=!!n?.phone;u&&(s+=25),i.push({label:"Phone number added",completed:u});let h=n?.two_factor_enabled||!1;h&&(s+=25),i.push({label:"Two-factor authentication",completed:h});let c=!0;c&&(s+=25),i.push({label:"Strong password",completed:c});let x=s>=75?"text-green-600 dark:text-green-400":s>=50?"text-yellow-600 dark:text-yellow-400":"text-red-600 dark:text-red-400",B=s>=75?"bg-green-500":s>=50?"bg-yellow-500":"bg-red-500";a.innerHTML=`
            <div class="bg-white dark:bg-stone-800 rounded-xl border border-gray-100 dark:border-stone-700 p-4">
                <div class="flex items-center justify-between mb-4">
                    <h3 class="font-semibold text-stone-900 dark:text-white">Account Security</h3>
                    <span class="${x} font-bold">${s}%</span>
                </div>
                <div class="w-full bg-stone-200 dark:bg-stone-600 rounded-full h-2 mb-4">
                    <div class="${B} h-2 rounded-full transition-all duration-500" style="width: ${s}%"></div>
                </div>
                <div class="space-y-2">
                    ${i.map(A=>`
                        <div class="flex items-center gap-2 text-sm">
                            ${A.completed?'<svg class="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/></svg>':'<svg class="w-4 h-4 text-stone-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" stroke-width="2"/></svg>'}
                            <span class="${A.completed?"text-stone-700 dark:text-stone-300":"text-stone-500 dark:text-stone-400"}">${A.label}</span>
                        </div>
                    `).join("")}
                </div>
            </div>
        `}async function U(){if(AuthApi.isAuthenticated())try{n=(await AuthApi.getProfile()).data,N()}catch{Toast.error("Failed to load profile.")}}function K(){let a=document.querySelectorAll("[data-profile-tab]"),s=document.querySelectorAll("[data-profile-panel]");if(!a.length||!s.length)return;let i=u=>{s.forEach(h=>{h.classList.toggle("hidden",h.dataset.profilePanel!==u)}),a.forEach(h=>{let c=h.dataset.profileTab===u;h.classList.toggle("bg-amber-600",c),h.classList.toggle("text-white",c),h.classList.toggle("shadow-sm",c),h.classList.toggle("text-stone-700",!c),h.classList.toggle("dark:text-stone-200",!c)}),localStorage.setItem("profileTab",u)},l=localStorage.getItem("profileTab")||"overview";i(l),a.forEach(u=>{u.addEventListener("click",()=>{i(u.dataset.profileTab)})})}function N(){let a=document.getElementById("profile-info");if(!a||!n)return;let s=`${Templates.escapeHtml(n.first_name||"")} ${Templates.escapeHtml(n.last_name||"")}`.trim()||Templates.escapeHtml(n.email||"User"),i=Templates.formatDate(n.created_at||n.date_joined),l=n.avatar?`<img id="avatar-preview" src="${n.avatar}" alt="Profile" class="w-full h-full object-cover">`:`
            <span class="flex h-full w-full items-center justify-center text-3xl font-semibold text-stone-500">
                ${(n.first_name?.[0]||n.email?.[0]||"U").toUpperCase()}
            </span>`;a.innerHTML=`
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
        `,D()}function y(){Tabs.init()}function M(){let a=document.getElementById("profile-form");if(!a||!n)return;let s=document.getElementById("profile-first-name"),i=document.getElementById("profile-last-name"),l=document.getElementById("profile-email"),u=document.getElementById("profile-phone");s&&(s.value=n.first_name||""),i&&(i.value=n.last_name||""),l&&(l.value=n.email||""),u&&(u.value=n.phone||""),a.addEventListener("submit",async h=>{h.preventDefault();let c=new FormData(a),x={first_name:c.get("first_name"),last_name:c.get("last_name"),phone:c.get("phone")},B=a.querySelector('button[type="submit"]');B.disabled=!0,B.textContent="Saving...";try{await AuthApi.updateProfile(x),Toast.success("Profile updated successfully!"),await U()}catch(A){Toast.error(A.message||"Failed to update profile.")}finally{B.disabled=!1,B.textContent="Save Changes"}})}function D(){let a=document.getElementById("avatar-input"),s=document.getElementById("change-avatar-btn"),i=document.getElementById("remove-avatar-btn");a||(a=document.createElement("input"),a.type="file",a.id="avatar-input",a.name="avatar",a.accept="image/*",a.className="hidden",document.body.appendChild(a)),document.querySelectorAll("#change-avatar-btn").forEach(h=>h.addEventListener("click",()=>a.click())),document.querySelectorAll("#remove-avatar-btn").forEach(h=>h.addEventListener("click",()=>{typeof window.removeAvatar=="function"&&window.removeAvatar()})),a.removeEventListener?.("change",window._avatarChangeHandler),window._avatarChangeHandler=async function(h){let c=h.target.files?.[0];if(c){if(!c.type.startsWith("image/")){Toast.error("Please select an image file.");return}if(c.size>5242880){Toast.error("Image must be smaller than 5MB.");return}try{await AuthApi.uploadAvatar(c),Toast.success("Avatar updated!"),await U()}catch(x){Toast.error(x.message||"Failed to update avatar.")}}},a.addEventListener("change",window._avatarChangeHandler)}function S(){let a=document.getElementById("password-form");a&&a.addEventListener("submit",async s=>{s.preventDefault();let i=new FormData(a),l=i.get("current_password"),u=i.get("new_password"),h=i.get("confirm_password");if(u!==h){Toast.error("Passwords do not match.");return}if(u.length<8){Toast.error("Password must be at least 8 characters.");return}let c=a.querySelector('button[type="submit"]');c.disabled=!0,c.textContent="Updating...";try{await AuthApi.changePassword(l,u),Toast.success("Password updated successfully!"),a.reset()}catch(x){Toast.error(x.message||"Failed to update password.")}finally{c.disabled=!1,c.textContent="Update Password"}})}function E(){w(),document.getElementById("add-address-btn")?.addEventListener("click",()=>{L()})}async function w(){let a=document.getElementById("addresses-list");if(a){Loader.show(a,"spinner");try{let i=(await AuthApi.getAddresses()).data||[];if(i.length===0){a.innerHTML=`
                    <div class="text-center py-8">
                        <svg class="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
                        </svg>
                        <p class="text-gray-500">No saved addresses yet.</p>
                    </div>
                `;return}a.innerHTML=`
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
            `,_()}catch(s){console.error("Failed to load addresses:",s),a.innerHTML='<p class="text-red-500">Failed to load addresses.</p>'}}}function _(){document.querySelectorAll(".edit-address-btn").forEach(a=>{a.addEventListener("click",async()=>{let s=a.dataset.addressId;try{let i=await AuthApi.getAddress(s);L(i.data)}catch{Toast.error("Failed to load address.")}})}),document.querySelectorAll(".set-default-btn").forEach(a=>{a.addEventListener("click",async()=>{let s=a.dataset.addressId;try{await AuthApi.setDefaultAddress(s),Toast.success("Default address updated."),await w()}catch{Toast.error("Failed to update default address.")}})}),document.querySelectorAll(".delete-address-btn").forEach(a=>{a.addEventListener("click",async()=>{let s=a.dataset.addressId;if(await Modal.confirm({title:"Delete Address",message:"Are you sure you want to delete this address?",confirmText:"Delete",cancelText:"Cancel"}))try{await AuthApi.deleteAddress(s),Toast.success("Address deleted."),await w()}catch{Toast.error("Failed to delete address.")}})})}function L(a=null){let s=!!a;Modal.open({title:s?"Edit Address":"Add New Address",content:`
                <form id="address-modal-form" class="space-y-4">
                    <div class="grid grid-cols-2 gap-4">
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">First Name *</label>
                            <input type="text" name="first_name" value="${a?.first_name||""}" required class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500">
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">Last Name *</label>
                            <input type="text" name="last_name" value="${a?.last_name||""}" required class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500">
                        </div>
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                        <input type="tel" name="phone" value="${a?.phone||""}" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500">
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Address Line 1 *</label>
                        <input type="text" name="address_line_1" value="${a?.address_line_1||""}" required class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500">
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Address Line 2</label>
                        <input type="text" name="address_line_2" value="${a?.address_line_2||""}" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500">
                    </div>
                    <div class="grid grid-cols-2 gap-4">
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">City *</label>
                            <input type="text" name="city" value="${a?.city||""}" required class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500">
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">State/Province</label>
                            <input type="text" name="state" value="${a?.state||""}" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500">
                        </div>
                    </div>
                    <div class="grid grid-cols-2 gap-4">
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">Postal Code *</label>
                            <input type="text" name="postal_code" value="${a?.postal_code||""}" required class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500">
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">Country *</label>
                            <select name="country" required class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500">
                                <option value="">Select country</option>
                                <option value="BD" ${a?.country==="BD"?"selected":""}>Bangladesh</option>
                                <option value="US" ${a?.country==="US"?"selected":""}>United States</option>
                                <option value="UK" ${a?.country==="UK"?"selected":""}>United Kingdom</option>
                                <option value="CA" ${a?.country==="CA"?"selected":""}>Canada</option>
                                <option value="AU" ${a?.country==="AU"?"selected":""}>Australia</option>
                            </select>
                        </div>
                    </div>
                    <div>
                        <label class="flex items-center">
                            <input type="checkbox" name="is_default" ${a?.is_default?"checked":""} class="text-primary-600 focus:ring-primary-500 rounded">
                            <span class="ml-2 text-sm text-gray-600">Set as default address</span>
                        </label>
                    </div>
                </form>
            `,confirmText:s?"Save Changes":"Add Address",onConfirm:async()=>{let i=document.getElementById("address-modal-form"),l=new FormData(i),u={first_name:l.get("first_name"),last_name:l.get("last_name"),phone:l.get("phone"),address_line_1:l.get("address_line_1"),address_line_2:l.get("address_line_2"),city:l.get("city"),state:l.get("state"),postal_code:l.get("postal_code"),country:l.get("country"),is_default:l.get("is_default")==="on"};try{return s?(await AuthApi.updateAddress(a.id,u),Toast.success("Address updated!")):(await AuthApi.addAddress(u),Toast.success("Address added!")),await w(),!0}catch(h){return Toast.error(h.message||"Failed to save address."),!1}}})}function g(){n=null}return{init:e,destroy:g}})();window.AccountPage=_s;wr=_s});var Hs={};te(Hs,{default:()=>kr});var qs,kr,Ps=X(()=>{qs=(function(){"use strict";let n=null,e=[],t=null,o=6e4,m="data-bound";function v(){}function k(f){if(f==null||f==="")return 0;if(typeof f=="number"&&Number.isFinite(f))return f;let T=parseFloat(f);return Number.isFinite(T)?T:0}function I(f){let T=k(f);return Templates.formatPrice(T)}function H(f){return f!=null&&f!==""}function U(){let f=window.BUNORAA_CART?.taxRate;return k(H(f)?f:0)}function K(){let f=window.BUNORAA_CART?.freeShippingThreshold,F=(window.BUNORAA_SHIPPING||{}).free_shipping_threshold??window.BUNORAA_CURRENCY?.free_shipping_threshold??0;return k(H(f)?f:F)}let N='<a href="/account/addresses/" class="text-xs font-medium text-amber-600 dark:text-amber-400 underline underline-offset-2 hover:text-amber-700 dark:hover:text-amber-300">Add shipping address to see shipping cost.</a>',y=null,M=null,D={key:null,quote:null};function S(){return(document.getElementById("delivery-division")?.value||"dhaka").toLowerCase()}function E(f){return f?f.charAt(0).toUpperCase()+f.slice(1):"Dhaka"}function w(){return window.AuthApi?.isAuthenticated&&AuthApi.isAuthenticated()}function _(f){return f?Array.isArray(f)?f:Array.isArray(f.data)?f.data:Array.isArray(f.data?.results)?f.data.results:Array.isArray(f.results)?f.results:[]:[]}async function L(){return w()?y||(M||(M=(async()=>{try{let f=await AuthApi.getAddresses(),T=_(f);if(!T.length)return null;let F=T.filter(q=>{let j=String(q.address_type||"").toLowerCase();return j==="shipping"||j==="both"});return F.find(q=>q.is_default)||F[0]||T.find(q=>q.is_default)||T[0]||null}catch{return null}})()),y=await M,y):null}function g(f){let T=U();return T>0?f*T/100:0}function a(f){let T=document.getElementById("shipping-location");if(!T)return;if(f&&(f.city||f.state||f.country)){T.textContent=f.city||f.state||f.country;return}let F=document.getElementById("delivery-division");T.textContent=F?E(S()):"Address"}function s(f,T,F,q){return{country:f?.country||"BD",state:f?.state||f?.city||"",postal_code:f?.postal_code||"",subtotal:T,weight:0,item_count:F,product_ids:q}}async function i(f,T,F){if(!F)return null;let q=f?.items||[],j=q.reduce((se,le)=>se+Number(le.quantity||1),0),V=q.map(se=>se.product?.id||se.product_id).filter(Boolean),J=s(F,T,j,V),Q=[F.id||"",J.country,J.state,J.postal_code,T,j,V.join(",")].join("|");if(D.key===Q)return D.quote;try{let se;if(window.ShippingApi?.calculateShipping)se=await ShippingApi.calculateShipping(J);else{let ve=window.BUNORAA_CURRENCY?.code;se=await fetch("/api/v1/shipping/calculate/",{method:"POST",headers:{"Content-Type":"application/json","X-CSRFToken":window.CSRF_TOKEN||document.querySelector("[name=csrfmiddlewaretoken]")?.value||"",...ve?{"X-User-Currency":ve}:{}},body:JSON.stringify(J)}).then(ye=>ye.json())}let le=se?.data?.methods||se?.data?.data?.methods||se?.methods||[];if(!Array.isArray(le)||le.length===0)return null;let pe=le.reduce((ve,ye)=>{let $e=k(ve.rate);return k(ye.rate)<$e?ye:ve},le[0]),ce=k(pe.rate),xe={cost:ce,isFree:pe.is_free||ce<=0,display:pe.rate_display||I(ce)};return D={key:Q,quote:xe},xe}catch{return null}}async function l(f,T,F){let q=document.getElementById("shipping"),j=document.getElementById("tax"),V=document.getElementById("total"),J=Math.max(0,f-T),Q=g(J);j&&(j.textContent=I(Q));let se=await L();if(!se){q&&(q.innerHTML=N),V&&(V.textContent=I(J+Q)),a(null);return}q&&(q.textContent="Calculating...");let le=await i(F||n,f,se);if(!le){q&&(q.innerHTML=N),V&&(V.textContent=I(J+Q)),a(se);return}q&&(q.textContent=le.isFree?"Free":le.display),V&&(V.textContent=I(J+Q+le.cost)),a(se)}async function u(){await r(),A(),de(),R()}function h(f,T,F){f&&(f.dataset.originalText||(f.dataset.originalText=f.textContent),f.disabled=T,f.textContent=T?F:f.dataset.originalText)}function c(f,T){let F=["request failed.","request failed","invalid response format","invalid request format"],q=Q=>{if(!Q)return!0;let se=String(Q).trim().toLowerCase();return F.includes(se)},j=Q=>{if(!Q)return null;if(typeof Q=="string")return Q;if(Array.isArray(Q))return Q[0];if(typeof Q=="object"){let se=Object.values(Q),pe=(se.flat?se.flat():se.reduce((ce,xe)=>ce.concat(xe),[]))[0]??se[0];if(typeof pe=="string")return pe;if(pe&&typeof pe=="object")return j(pe)}return null},V=[];return f?.message&&V.push(f.message),f?.data?.message&&V.push(f.data.message),f?.data?.detail&&V.push(f.data.detail),f?.data&&typeof f.data=="string"&&V.push(f.data),f?.errors&&V.push(j(f.errors)),f?.data&&typeof f.data=="object"&&V.push(j(f.data)),V.find(Q=>Q&&!q(Q))||T}function x(f){let T=document.getElementById("applied-coupon"),F=document.getElementById("coupon-name"),q=document.getElementById("coupon-form"),j=document.getElementById("coupon-code"),V=document.getElementById("apply-coupon-btn"),J=j?.closest("div.flex"),Q=document.getElementById("coupon-message");if(f){T&&T.classList.remove("hidden"),F&&(F.textContent=f),q&&q.classList.add("hidden"),!q&&J&&J.classList.add("hidden"),V&&V.classList.add("hidden"),j&&(j.value=f),Q&&Q.classList.add("hidden");return}T&&T.classList.add("hidden"),q&&q.classList.remove("hidden"),!q&&J&&J.classList.remove("hidden"),V&&V.classList.remove("hidden"),j&&(j.value="")}function B(f){let T=document.getElementById("validation-messages"),F=document.getElementById("validation-issues"),q=document.getElementById("validation-warnings"),j=document.getElementById("issues-list"),V=document.getElementById("warnings-list");if(!T||!F||!q||!j||!V)return;let J=Array.isArray(f?.issues)?f.issues:[],Q=Array.isArray(f?.warnings)?f.warnings:[];if(j.innerHTML=J.map(se=>`<li class="flex items-start gap-2"><span class="mt-1 w-1.5 h-1.5 rounded-full bg-red-500 flex-shrink-0"></span><span>${Templates.escapeHtml(se?.message||"Issue found")}</span></li>`).join(""),V.innerHTML=Q.map(se=>`<li class="flex items-start gap-2"><span class="mt-1 w-1.5 h-1.5 rounded-full bg-amber-500 flex-shrink-0"></span><span>${Templates.escapeHtml(se?.message||"Warning")}</span></li>`).join(""),!J.length&&!Q.length){T.classList.add("hidden"),F.classList.add("hidden"),q.classList.add("hidden");return}T.classList.remove("hidden"),F.classList.toggle("hidden",J.length===0),q.classList.toggle("hidden",Q.length===0),T.scrollIntoView({behavior:"smooth",block:"start"})}function A(){let f=document.getElementById("validate-cart-btn"),T=document.getElementById("lock-prices-btn"),F=document.getElementById("share-cart-btn");f&&f.getAttribute(m)!=="true"&&(f.setAttribute(m,"true"),f.addEventListener("click",async()=>{h(f,!0,"Validating...");try{let q=await CartApi.validateCart();B(q.data),(q.data?.issues||[]).length>0?Toast.warning("We found a few issues in your cart."):Toast.success("Cart looks good!")}catch(q){Toast.error(c(q,"Unable to validate cart right now."))}finally{h(f,!1)}})),T&&T.getAttribute(m)!=="true"&&(T.setAttribute(m,"true"),T.addEventListener("click",async()=>{h(T,!0,"Locking...");try{let j=(await CartApi.lockPrices()).data?.locked_count??0;Toast.success(`Locked prices for ${j} item${j===1?"":"s"}.`),await r()}catch(q){Toast.error(c(q,"Failed to lock prices."))}finally{h(T,!1)}})),F&&F.getAttribute(m)!=="true"&&(F.setAttribute(m,"true"),F.addEventListener("click",async()=>{h(F,!0,"Creating...");try{let j=(await CartApi.shareCart({permission:"view",expires_days:7})).data?.share_url;if(!j)throw new Error("Share link unavailable.");navigator.share?(await navigator.share({title:"Shared Cart",url:j}),Toast.success("Share link ready.")):navigator.clipboard?.writeText?(await navigator.clipboard.writeText(j),Toast.success("Share link copied to clipboard.")):window.prompt("Copy this link to share your cart:",j)}catch(q){Toast.error(c(q,"Failed to create share link."))}finally{h(F,!1)}}))}function R(){Y(),Z(),ge(),we(),ke()}function Y(){e=JSON.parse(localStorage.getItem("savedForLater")||"[]"),G()}function G(){let f=document.getElementById("saved-for-later");if(f){if(e.length===0){f.innerHTML="",f.classList.add("hidden");return}f.classList.remove("hidden"),f.innerHTML=`
            <div class="mt-8 bg-white dark:bg-stone-800 rounded-xl shadow-sm border border-gray-100 dark:border-stone-700 overflow-hidden">
                <div class="px-6 py-4 border-b border-gray-100 dark:border-stone-700 flex items-center justify-between">
                    <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Saved for Later (${e.length})</h3>
                    <button id="clear-saved-btn" class="text-sm text-gray-500 dark:text-stone-400 hover:text-gray-700 dark:hover:text-stone-300">Clear All</button>
                </div>
                <div class="p-6 grid grid-cols-2 md:grid-cols-4 gap-4">
                    ${e.map(T=>`
                        <div class="saved-item" data-product-id="${T.id}">
                            <div class="aspect-square bg-gray-100 dark:bg-stone-700 rounded-lg overflow-hidden mb-2">
                                <img src="${T.image||"/static/images/placeholder.jpg"}" alt="${Templates.escapeHtml(T.name)}" class="w-full h-full object-cover">
                            </div>
                            <h4 class="text-sm font-medium text-gray-900 dark:text-white truncate">${Templates.escapeHtml(T.name)}</h4>
                            <p class="text-sm font-semibold text-primary-600 dark:text-amber-400">${I(T.price)}</p>
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
        `,f.querySelectorAll(".move-to-cart-btn").forEach(T=>{T.addEventListener("click",async()=>{let q=T.closest(".saved-item")?.dataset.productId;if(q)try{await CartApi.addItem(q,1),e=e.filter(j=>j.id!==q),localStorage.setItem("savedForLater",JSON.stringify(e)),Toast.success("Item moved to cart"),await r(),G()}catch{Toast.error("Failed to move item to cart")}})}),f.querySelectorAll(".remove-saved-btn").forEach(T=>{T.addEventListener("click",()=>{let q=T.closest(".saved-item")?.dataset.productId;q&&(e=e.filter(j=>j.id!==q),localStorage.setItem("savedForLater",JSON.stringify(e)),G(),Toast.info("Item removed"))})}),document.getElementById("clear-saved-btn")?.addEventListener("click",()=>{e=[],localStorage.removeItem("savedForLater"),G(),Toast.info("Saved items cleared")})}}function Z(){let f=JSON.parse(localStorage.getItem("abandonedCart")||"null");f&&f.items?.length>0&&(!n||n.items?.length===0)&&ie(f),ue(),window.addEventListener("beforeunload",()=>{n&&n.items?.length>0&&localStorage.setItem("abandonedCart",JSON.stringify({items:n.items,savedAt:new Date().toISOString()}))})}function ue(){let f=()=>{t&&clearTimeout(t),t=setTimeout(()=>{n&&n.items?.length>0&&re()},o)};["click","scroll","keypress","mousemove"].forEach(T=>{document.addEventListener(T,f,{passive:!0,once:!1})}),f()}function ie(f){let T=document.createElement("div");T.id="abandoned-cart-modal",T.className="fixed inset-0 z-50 flex items-center justify-center p-4",T.innerHTML=`
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
                    <p class="text-stone-600 dark:text-stone-400">You left ${f.items.length} item(s) in your cart.</p>
                </div>
                <div class="max-h-48 overflow-y-auto mb-6 space-y-2">
                    ${f.items.slice(0,3).map(F=>`
                        <div class="flex items-center gap-3 p-2 bg-stone-50 dark:bg-stone-700/50 rounded-lg">
                            <img src="${F.product_image||F.product?.image||"/static/images/placeholder.jpg"}" alt="" class="w-12 h-12 rounded object-cover">
                            <div class="flex-1 min-w-0">
                                <p class="text-sm font-medium text-stone-900 dark:text-white truncate">${Templates.escapeHtml(F.product_name||F.product?.name||"Product")}</p>
                                <p class="text-xs text-stone-500 dark:text-stone-400">Qty: ${F.quantity}</p>
                            </div>
                        </div>
                    `).join("")}
                    ${f.items.length>3?`<p class="text-center text-sm text-stone-500 dark:text-stone-400">+${f.items.length-3} more items</p>`:""}
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
        `,document.body.appendChild(T)}function re(){sessionStorage.getItem("cartReminderShown")||(Toast.info("Don't forget! You have items in your cart",{duration:8e3,action:{text:"Checkout",onClick:()=>window.location.href="/checkout/"}}),sessionStorage.setItem("cartReminderShown","true"))}function ge(){he()}function he(){let f=document.getElementById("free-shipping-progress");if(!f||!n)return;let T=k(window.BUNORAA_CART?.freeShippingThreshold??50),F=k(n.summary?.subtotal||n.subtotal||0),q=Math.max(0,T-F),j=Math.min(100,F/T*100);if(f.dataset.freeShippingProgress==="bar"){let V=document.getElementById("free-shipping-status"),J=document.getElementById("free-shipping-message");f.style.width=`${j}%`,F>=T?(V&&(V.textContent="Unlocked"),J&&(J.textContent="You've unlocked free delivery")):(V&&(V.textContent=`${I(q)} away`),J&&(J.textContent=`Free delivery on orders over ${I(T)}`));return}F>=T?f.innerHTML=`
                <div class="flex items-center gap-2 p-3 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl">
                    <svg class="w-5 h-5 text-emerald-600 dark:text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>
                    <span class="text-sm font-medium text-emerald-700 dark:text-emerald-300">You've unlocked FREE shipping!</span>
                </div>
            `:f.innerHTML=`
                <div class="p-3 bg-amber-50 dark:bg-amber-900/20 rounded-xl">
                    <div class="flex items-center justify-between text-sm mb-2">
                        <span class="text-amber-700 dark:text-amber-300">Add ${I(q)} for FREE shipping</span>
                        <span class="text-amber-600 dark:text-amber-400 font-medium">${Math.round(j)}%</span>
                    </div>
                    <div class="w-full bg-amber-200 dark:bg-amber-800 rounded-full h-2">
                        <div class="bg-amber-500 h-2 rounded-full transition-all duration-500" style="width: ${j}%"></div>
                    </div>
                </div>
            `}function be(){let f=document.getElementById("cart-delivery-estimate");if(!f)return;let T=new Date,F=3,q=7,j=new Date(T.getTime()+F*24*60*60*1e3),V=new Date(T.getTime()+q*24*60*60*1e3),J=Q=>Q.toLocaleDateString("en-US",{weekday:"short",month:"short",day:"numeric"});f.innerHTML=`
            <div class="flex items-center gap-2 text-sm text-stone-600 dark:text-stone-400">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"/></svg>
                <span>Estimated delivery: <strong class="text-stone-900 dark:text-white">${J(j)} - ${J(V)}</strong></span>
            </div>
        `}function fe(){let f=document.getElementById("delivery-division");if(!f)return;let T=()=>{let F=n?.summary||{},q=k(F.subtotal??n?.subtotal??0),j=k(F.discount_amount??n?.discount_amount??0);l(q,j,n)};f.addEventListener("change",T),T()}async function we(){let f=document.getElementById("cart-recommendations");if(!(!f||!n||!n.items?.length))try{let T=n.items.map(j=>j.product?.id||j.product_id).filter(Boolean);if(!T.length)return;let F=await ProductsApi.getRelated(T[0],{limit:4}),q=F?.data||F?.results||[];if(!q.length)return;f.innerHTML=`
                <div class="mt-8">
                    <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">You might also like</h3>
                    <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
                        ${q.slice(0,4).map(j=>`
                            <div class="bg-white dark:bg-stone-800 rounded-xl shadow-sm border border-gray-100 dark:border-stone-700 overflow-hidden group">
                                <a href="/products/${j.slug}/" class="block aspect-square bg-gray-100 dark:bg-stone-700 overflow-hidden">
                                    <img src="${j.primary_image||j.image||"/static/images/placeholder.jpg"}" alt="${Templates.escapeHtml(j.name)}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300">
                                </a>
                                <div class="p-3">
                                    <h4 class="text-sm font-medium text-gray-900 dark:text-white truncate">${Templates.escapeHtml(j.name)}</h4>
                                    <p class="text-sm font-semibold text-primary-600 dark:text-amber-400 mt-1">${I(j.current_price||j.price)}</p>
                                    <button class="quick-add-btn w-full mt-2 py-2 text-xs font-medium text-primary-600 dark:text-amber-400 border border-primary-600 dark:border-amber-400 rounded-lg hover:bg-primary-50 dark:hover:bg-amber-900/20 transition-colors" data-product-id="${j.id}">
                                        + Add to Cart
                                    </button>
                                </div>
                            </div>
                        `).join("")}
                    </div>
                </div>
            `,f.querySelectorAll(".quick-add-btn").forEach(j=>{j.addEventListener("click",async()=>{let V=j.dataset.productId;j.disabled=!0,j.textContent="Adding...";try{await CartApi.addItem(V,1),Toast.success("Added to cart"),await r()}catch{Toast.error("Failed to add item")}finally{j.disabled=!1,j.textContent="+ Add to Cart"}})})}catch(T){console.warn("Failed to load recommendations:",T)}}function ke(){let f=document.getElementById("cart-note"),T=document.getElementById("gift-order");if(f){let F=localStorage.getItem("cartNote")||"";f.value=F,f.addEventListener("input",Ce(()=>{localStorage.setItem("cartNote",f.value)},500))}if(T){let F=localStorage.getItem("isGiftOrder")==="true";T.checked=F,T.addEventListener("change",()=>{localStorage.setItem("isGiftOrder",T.checked)})}}function Ce(f,T){let F;return function(...j){clearTimeout(F),F=setTimeout(()=>f(...j),T)}}function Le(){let f=document.getElementById("express-checkout");f&&(f.innerHTML=`
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
        `,f.querySelectorAll(".express-pay-btn").forEach(T=>{T.addEventListener("click",()=>{Toast.info("Express checkout coming soon!")})}))}async function r(){let f=document.getElementById("cart-container");if(f){f.dataset.cartRender!=="server"&&Loader.show(f,"skeleton");try{n=(await CartApi.getCart()).data,f.dataset.cartRender==="server"?d(n):p(n)}catch(T){console.error("Failed to load cart:",T),f.innerHTML='<p class="text-red-500 text-center py-8">Failed to load cart. Please try again.</p>'}}}function d(f){let T=document.getElementById("cart-container");if(!T)return;let F=f?.items||[],q=f?.summary||{};if(!F.length){T.innerHTML=`
                <div class="text-center py-16">
                    <svg class="w-24 h-24 text-gray-300 dark:text-gray-600 mx-auto mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"/>
                    </svg>
                    <h2 class="text-2xl font-semibold text-gray-900 dark:text-white mb-2">Your cart is empty</h2>
                    <p class="text-gray-600 dark:text-gray-300 mb-6">Explore the collection and add your favorites to the bag.</p>
                    <a href="/products/" class="inline-block bg-gradient-to-r from-amber-600 to-amber-700 text-white px-8 py-3 rounded-xl font-semibold hover:from-amber-700 hover:to-amber-800 transition-colors shadow-lg shadow-amber-500/20">
                        Start Shopping
                    </a>
                </div>
            `;return}let j=q.subtotal??f?.subtotal??0,V=k(q.discount_amount??f?.discount_amount),J=document.getElementById("subtotal"),Q=document.getElementById("discount-row"),se=document.getElementById("discount"),le=document.getElementById("savings-row"),pe=document.getElementById("savings");if(J&&(J.textContent=I(j)),Q&&se&&(V>0?(Q.classList.remove("hidden"),se.textContent=`-${I(V)}`):Q.classList.add("hidden")),le&&pe){let ce=k(q.total_savings);ce>0?(le.classList.remove("hidden"),pe.textContent=I(ce)):le.classList.add("hidden")}l(j,V,f),x(f?.coupon_code||f?.coupon?.code||q?.coupon_code||""),F.forEach(ce=>{let xe=T.querySelector(`.cart-item[data-item-id="${ce.id}"]`);if(!xe)return;let ve=xe.querySelector(".qty-input");ve&&ce.quantity&&(ve.value=ce.quantity);let ye=xe.querySelector(".item-total");ye&&(ye.textContent=I(ce.total||ce.line_total||0));let $e=xe.querySelector(".item-unit-price");$e&&($e.textContent=I(ce.unit_price||ce.current_price||ce.price_at_add||0));let Be=xe.querySelector("img");Be&&ce.product_image&&(Be.src=ce.product_image)}),C(),he()}function p(f){let T=document.getElementById("cart-container");if(!T)return;let F=f?.items||[],q=f?.summary||{},j=q.subtotal??f?.subtotal??0,V=k(q.discount_amount??f?.discount_amount),J=Math.max(0,j-V),Q=g(J),se=J+Q,le=U(),pe=f?.coupon?.code||f?.coupon_code||"";if(F.length===0){T.innerHTML=`
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
            `;return}T.innerHTML=`
            <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <!-- Cart Items -->
                <div class="lg:col-span-2">
                    <div class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                        <div class="px-6 py-4 border-b border-gray-100">
                            <h2 class="text-lg font-semibold text-gray-900">Shopping Cart (${F.length} items)</h2>
                        </div>
                        <div id="cart-items" class="divide-y divide-gray-100">
                            ${F.map(ce=>b(ce)).join("")}
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
                                <span class="font-medium text-gray-900 dark:text-white">${I(j)}</span>
                            </div>
                            ${V>0?`
                                <div class="flex justify-between text-green-600 dark:text-green-400">
                                    <span>Discount</span>
                                    <span>-${I(V)}</span>
                                </div>
                            `:""}
                            <div class="flex justify-between">
                                <span class="text-gray-600 dark:text-stone-400">Shipping</span>
                                <span id="shipping" class="font-medium text-gray-900 dark:text-white">Calculating...</span>
                            </div>
                            <div class="flex justify-between">
                                <span class="text-gray-600 dark:text-stone-400">VAT (${le}%)</span>
                                <span id="tax" class="font-medium text-gray-900 dark:text-white">${I(Q)}</span>
                            </div>
                            <div class="pt-3 border-t border-gray-200 dark:border-stone-600">
                                <div class="flex justify-between">
                                    <span class="text-base font-semibold text-gray-900 dark:text-white">Total</span>
                                    <span id="total" class="text-base font-bold text-gray-900 dark:text-white">${I(se)}</span>
                                </div>
                                <p class="text-xs text-gray-500 dark:text-stone-400 mt-1">Shipping calculated from your saved address</p>
                            </div>
                        </div>
                        
                        <!-- Coupon Form -->
                        <div class="mt-6 pt-6 border-t border-gray-200 dark:border-stone-600">
                            ${pe?`
                                <div class="flex items-center justify-between px-3 py-2 bg-green-50 dark:bg-green-900/20 rounded-lg">
                                    <p class="text-sm font-medium text-green-700 dark:text-green-400">
                                        Coupon Applied: <span class="font-semibold">${Templates.escapeHtml(pe)}</span>
                                    </p>
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
                                        value="${Templates.escapeHtml(pe)}"
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
        `,C(),R(),l(j,V,f)}function b(f){let T=f.product||{},F=f.variant,q=T.slug||f.product_slug||"#",j=T.name||f.product_name||"Product",V=f.product_image||T.primary_image||T.image,J=T.id||f.product_id||"",Q=k(f.price_at_add),se=k(f.current_price||f.unit_price),le=k(f.total||f.line_total)||se*(f.quantity||1),pe=Q>se&&se>0;return`
            <div class="cart-item p-6 flex gap-4" data-item-id="${f.id}" data-product-id="${J}">
                <div class="flex-shrink-0 w-24 h-24 bg-gray-100 dark:bg-stone-700 rounded-lg overflow-hidden">
                    <a href="/products/${q}/">
                        ${V?`
                        <img 
                            src="${V}" 
                            alt="${Templates.escapeHtml(j)}"
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
                                <a href="/products/${q}/" class="hover:text-primary-600 dark:hover:text-amber-400">
                                    ${Templates.escapeHtml(j)}
                                </a>
                            </h3>
                            ${F||f.variant_name?`
                                <p class="text-sm text-gray-500 dark:text-stone-400 mt-1">${Templates.escapeHtml(F?.name||F?.value||f.variant_name)}</p>
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
                                type="text"
                                inputmode="numeric"
                                readonly
                                class="item-quantity w-12 text-center border-0 bg-transparent dark:text-white focus:ring-0 text-sm appearance-none"
                                value="${f.quantity}" 
                                min="1" 
                                max="${T.stock_quantity||99}"
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
                            ${pe?`
                                <span class="text-sm text-gray-400 dark:text-stone-500 line-through">${I(Q*f.quantity)}</span>
                            `:""}
                            <span class="font-semibold text-gray-900 dark:text-white block">${I(le)}</span>
                        </div>
                    </div>
                </div>
            </div>
        `}function C(){let f=document.getElementById("cart-items"),T=document.getElementById("clear-cart-btn"),F=document.getElementById("remove-coupon-btn");f&&f.getAttribute(m)!=="true"&&(f.setAttribute(m,"true"),f.addEventListener("click",async q=>{let j=q.target.closest(".cart-item");if(!j)return;let V=j.dataset.itemId,J=j.dataset.productId,Q=j.querySelector(".item-quantity")||j.querySelector(".qty-input");if(q.target.closest(".remove-item-btn"))await W(V);else if(q.target.closest(".save-for-later-btn"))await ee(V,J,j);else if(q.target.closest(".qty-decrease")){let se=parseInt(Q?.value,10)||1;se>1&&await $(V,se-1)}else if(q.target.closest(".qty-increase")){let se=parseInt(Q?.value,10)||1,le=parseInt(Q?.max,10)||99;se<le&&await $(V,se+1)}}),f.addEventListener("change",async q=>{if(q.target.classList.contains("item-quantity")||q.target.classList.contains("qty-input")){let V=q.target.closest(".cart-item")?.dataset.itemId,J=parseInt(q.target.value,10)||1;V&&J>0&&await $(V,J)}})),T&&T.getAttribute(m)!=="true"&&(T.setAttribute(m,"true"),T.addEventListener("click",async()=>{await Modal.confirm({title:"Clear Cart",message:"Are you sure you want to remove all items from your cart?",confirmText:"Clear Cart",cancelText:"Cancel"})&&await oe()})),F&&F.getAttribute(m)!=="true"&&(F.setAttribute(m,"true"),F.addEventListener("click",async()=>{await me()}))}async function $(f,T){try{await CartApi.updateItem(f,T),await r(),document.dispatchEvent(new CustomEvent("cart:updated"))}catch(F){Toast.error(F.message||"Failed to update quantity.")}}async function W(f){try{await CartApi.removeItem(f),Toast.success("Item removed from cart."),await r(),document.dispatchEvent(new CustomEvent("cart:updated"))}catch(T){Toast.error(T.message||"Failed to remove item.")}}async function ee(f,T,F){try{let q=n?.items?.find(Q=>String(Q.id)===String(f));if(!q)return;let j=q.product||{},V={id:T||j.id||q.product_id,name:j.name||q.product_name||"Product",image:q.product_image||j.primary_image||j.image||"",price:q.current_price||q.unit_price||j.price||0};e.findIndex(Q=>Q.id===T)===-1&&(e.push(V),localStorage.setItem("savedForLater",JSON.stringify(e))),await CartApi.removeItem(f),Toast.success("Item saved for later"),await r(),document.dispatchEvent(new CustomEvent("cart:updated"))}catch(q){Toast.error(q.message||"Failed to save item.")}}async function oe(){try{await CartApi.clearCart(),Toast.success("Cart cleared."),await r(),document.dispatchEvent(new CustomEvent("cart:updated"))}catch(f){Toast.error(f.message||"Failed to clear cart.")}}function de(){let f=document.getElementById("coupon-form");f?.addEventListener("submit",async F=>{F.preventDefault();let j=document.getElementById("coupon-code")?.value.trim();if(!j){Toast.error("Please enter a coupon code.");return}let V=f.querySelector('button[type="submit"]');V.disabled=!0,V.textContent="Applying...";try{let J=k(n?.summary?.subtotal??n?.subtotal??0),Q=await CartApi.applyCoupon(j,{subtotal:J}),se=Q?.data?.cart?.coupon?.code||Q?.data?.cart?.coupon_code||j;x(se),Toast.success("Coupon applied!"),await r()}catch(J){Toast.error(c(J,"Invalid coupon code."))}finally{V.disabled=!1,V.textContent="Apply"}});let T=document.getElementById("apply-coupon-btn");T?.addEventListener("click",async()=>{let q=document.getElementById("coupon-code")?.value.trim();if(!q){Toast.error("Please enter a coupon code.");return}T.disabled=!0;let j=T.textContent;T.textContent="Applying...";try{let V=k(n?.summary?.subtotal??n?.subtotal??0),J=await CartApi.applyCoupon(q,{subtotal:V}),Q=J?.data?.cart?.coupon?.code||J?.data?.cart?.coupon_code||q;x(Q),Toast.success("Coupon applied!"),await r()}catch(V){Toast.error(c(V,"Invalid coupon code."))}finally{T.disabled=!1,T.textContent=j||"Apply"}})}async function me(){try{await CartApi.removeCoupon(),x(""),Toast.success("Coupon removed."),await r()}catch(f){Toast.error(c(f,"Failed to remove coupon."))}}function Ae(){n=null}return{init:u,destroy:Ae}})();window.CartPage=qs;kr=qs});var Ns={};te(Ns,{default:()=>Cr});var js,Cr,Fs=X(()=>{js=(function(){"use strict";let n={},e=1,t=null,o=null,m=!1,v=!1,k=!0,I=[],H=[],U=4;async function K(){if(m)return;m=!0;let r=B();if(!r)return;let d=document.getElementById("category-header");if(d&&d.querySelector("h1")){we(),ke(),Ce(),N();return}n=A(),e=parseInt(new URLSearchParams(window.location.search).get("page"))||1,await R(r),we(),ke(),Ce(),N()}function N(){y(),S(),a(),i(),u(),c()}function y(){let r=document.getElementById("load-more-trigger");if(!r)return;new IntersectionObserver(p=>{p.forEach(b=>{b.isIntersecting&&!v&&k&&M()})},{rootMargin:"200px 0px",threshold:.01}).observe(r)}async function M(){if(v||!k||!t)return;v=!0,e++;let r=document.getElementById("loading-more-indicator");r&&r.classList.remove("hidden");try{let d={category:t.id,page:e,limit:12,...n},p=await ProductsApi.getAll(d),b=p.data||[],C=p.meta||{};b.length===0?k=!1:(I=[...I,...b],D(b),k=e<(C.total_pages||1)),ge()}catch(d){console.error("Failed to load more products:",d)}finally{v=!1,r&&r.classList.add("hidden")}}function D(r){let d=document.getElementById("products-grid");if(!d)return;let p=Storage.get("productViewMode")||"grid";r.forEach(b=>{let C=ProductCard.render(b,{layout:p,showCompare:!0,showQuickView:!0}),$=document.createElement("div");$.innerHTML=C;let W=$.firstElementChild;W.classList.add("animate-fadeInUp"),d.appendChild(W)}),ProductCard.bindEvents(d)}function S(){H=JSON.parse(localStorage.getItem("compareProducts")||"[]"),w(),document.addEventListener("click",r=>{let d=r.target.closest("[data-compare]");if(!d)return;r.preventDefault();let p=parseInt(d.dataset.compare);E(p)})}function E(r){let d=H.findIndex(p=>p.id===r);if(d>-1)H.splice(d,1),Toast.info("Removed from compare");else{if(H.length>=U){Toast.warning(`You can compare up to ${U} products`);return}let p=I.find(b=>b.id===r);p&&(H.push({id:p.id,name:p.name,image:p.primary_image||p.image,price:p.price,sale_price:p.sale_price}),Toast.success("Added to compare"))}localStorage.setItem("compareProducts",JSON.stringify(H)),w(),_()}function w(){let r=document.getElementById("compare-bar");if(H.length===0){r?.remove();return}r||(r=document.createElement("div"),r.id="compare-bar",r.className="fixed bottom-0 left-0 right-0 bg-white dark:bg-stone-800 border-t border-stone-200 dark:border-stone-700 shadow-2xl z-40 transform transition-transform duration-300",document.body.appendChild(r)),r.innerHTML=`
            <div class="container mx-auto px-4 py-4">
                <div class="flex items-center justify-between gap-4">
                    <div class="flex items-center gap-3 overflow-x-auto">
                        <span class="text-sm font-medium text-stone-600 dark:text-stone-400 whitespace-nowrap">Compare (${H.length}/${U}):</span>
                        ${H.map(d=>`
                            <div class="relative flex-shrink-0 group">
                                <img src="${d.image||"/static/images/placeholder.jpg"}" alt="${Templates.escapeHtml(d.name)}" class="w-14 h-14 object-cover rounded-lg border border-stone-200 dark:border-stone-600">
                                <button data-remove-compare="${d.id}" class="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                    <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
                                </button>
                            </div>
                        `).join("")}
                    </div>
                    <div class="flex items-center gap-2">
                        <button id="compare-now-btn" class="px-4 py-2 bg-primary-600 dark:bg-amber-600 text-white font-semibold rounded-lg hover:bg-primary-700 dark:hover:bg-amber-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed" ${H.length<2?"disabled":""}>
                            Compare Now
                        </button>
                        <button id="clear-compare-btn" class="px-4 py-2 text-stone-600 dark:text-stone-400 hover:text-stone-800 dark:hover:text-stone-200 transition-colors">
                            Clear All
                        </button>
                    </div>
                </div>
            </div>
        `,r.querySelectorAll("[data-remove-compare]").forEach(d=>{d.addEventListener("click",()=>{let p=parseInt(d.dataset.removeCompare);E(p)})}),document.getElementById("compare-now-btn")?.addEventListener("click",g),document.getElementById("clear-compare-btn")?.addEventListener("click",L)}function _(){document.querySelectorAll("[data-compare]").forEach(r=>{let d=parseInt(r.dataset.compare);H.some(b=>b.id===d)?(r.classList.add("bg-primary-100","text-primary-600"),r.classList.remove("bg-stone-100","text-stone-600")):(r.classList.remove("bg-primary-100","text-primary-600"),r.classList.add("bg-stone-100","text-stone-600"))})}function L(){H=[],localStorage.removeItem("compareProducts"),w(),_(),Toast.info("Compare list cleared")}async function g(){if(H.length<2)return;let r=document.createElement("div");r.id="compare-modal",r.className="fixed inset-0 z-50 overflow-auto",r.innerHTML=`
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
                                    ${H.map(d=>`
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
                                    ${H.map(d=>`
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
                                    ${H.map(d=>`
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
        `,document.body.appendChild(r)}function a(){document.addEventListener("click",async r=>{let d=r.target.closest("[data-quick-view]");if(!d)return;let p=d.dataset.quickView;p&&(r.preventDefault(),await s(p))})}async function s(r){let d=document.createElement("div");d.id="quick-view-modal",d.className="fixed inset-0 z-50 flex items-center justify-center p-4",d.innerHTML=`
            <div class="absolute inset-0 bg-black/50 backdrop-blur-sm" onclick="document.getElementById('quick-view-modal').remove()"></div>
            <div class="relative bg-white dark:bg-stone-800 rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-auto">
                <div class="p-8 flex items-center justify-center min-h-[400px]">
                    <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 dark:border-amber-400"></div>
                </div>
            </div>
        `,document.body.appendChild(d);try{let p=await ProductsApi.getProduct(r),b=p.data||p,C=d.querySelector(".relative");C.innerHTML=`
                <button class="absolute top-4 right-4 z-10 w-10 h-10 bg-stone-100 dark:bg-stone-700 rounded-full flex items-center justify-center hover:bg-stone-200 dark:hover:bg-stone-600 transition-colors" onclick="document.getElementById('quick-view-modal').remove()">
                    <svg class="w-5 h-5 text-stone-600 dark:text-stone-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
                </button>
                <div class="grid md:grid-cols-2 gap-8 p-8">
                    <div>
                        <div class="aspect-square rounded-xl overflow-hidden bg-stone-100 dark:bg-stone-700 mb-4">
                            <img src="${b.primary_image||b.image||"/static/images/placeholder.jpg"}" alt="${Templates.escapeHtml(b.name)}" class="w-full h-full object-cover" id="quick-view-main-image">
                        </div>
                        ${b.images&&b.images.length>1?`
                            <div class="flex gap-2 overflow-x-auto pb-2">
                                ${b.images.slice(0,5).map((de,me)=>`
                                    <button class="w-16 h-16 flex-shrink-0 rounded-lg overflow-hidden border-2 ${me===0?"border-primary-600 dark:border-amber-400":"border-transparent"} hover:border-primary-400 transition-colors" onclick="document.getElementById('quick-view-main-image').src='${de.image||de}'">
                                        <img src="${de.thumbnail||de.image||de}" alt="" class="w-full h-full object-cover">
                                    </button>
                                `).join("")}
                            </div>
                        `:""}
                    </div>
                    <div class="flex flex-col">
                        <h2 class="text-2xl font-bold text-stone-900 dark:text-white mb-2">${Templates.escapeHtml(b.name)}</h2>
                        <div class="flex items-center gap-2 mb-4">
                            <div class="flex text-amber-400">
                                ${'<svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.967a1 1 0 00.95.69h4.178c.969 0 1.371 1.24.588 1.81l-3.385 2.46a1 1 0 00-.364 1.118l1.287 3.966c.3.922-.755 1.688-1.54 1.118l-3.385-2.46a1 1 0 00-1.175 0l-3.385 2.46c-.784.57-1.838-.196-1.54-1.118l1.287-3.966a1 1 0 00-.364-1.118l-3.385-2.46c-.783-.57-.38-1.81.588-1.81h4.178a1 1 0 00.95-.69l1.286-3.967z"/></svg>'.repeat(Math.round(b.rating||4))}
                            </div>
                            <span class="text-sm text-stone-500 dark:text-stone-400">(${b.review_count||0} reviews)</span>
                            ${b.stock_quantity<=5&&b.stock_quantity>0?`
                                <span class="text-sm text-orange-600 dark:text-orange-400 font-medium">Only ${b.stock_quantity} left!</span>
                            `:""}
                        </div>
                        <div class="mb-6">
                            ${b.sale_price||b.discounted_price?`
                                <span class="text-3xl font-bold text-primary-600 dark:text-amber-400">${Templates.formatPrice(b.sale_price||b.discounted_price)}</span>
                                <span class="text-lg text-stone-400 line-through ml-2">${Templates.formatPrice(b.price)}</span>
                                <span class="ml-2 px-2 py-1 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 text-sm font-medium rounded">Save ${Math.round((1-(b.sale_price||b.discounted_price)/b.price)*100)}%</span>
                            `:`
                                <span class="text-3xl font-bold text-stone-900 dark:text-white">${Templates.formatPrice(b.price)}</span>
                            `}
                        </div>
                        <p class="text-stone-600 dark:text-stone-400 mb-6 line-clamp-3">${Templates.escapeHtml(b.short_description||b.description||"")}</p>
                        
                        <!-- Quantity Selector -->
                        <div class="flex items-center gap-4 mb-6">
                            <span class="text-sm font-medium text-stone-700 dark:text-stone-300">Quantity:</span>
                            <div class="flex items-center border border-stone-300 dark:border-stone-600 rounded-lg">
                                <button id="qv-qty-minus" class="w-10 h-10 flex items-center justify-center text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-700 transition-colors">\u2212</button>
                                <input type="number" id="qv-qty-input" value="1" min="1" max="${b.stock_quantity||99}" class="w-16 h-10 text-center border-x border-stone-300 dark:border-stone-600 bg-transparent text-stone-900 dark:text-white">
                                <button id="qv-qty-plus" class="w-10 h-10 flex items-center justify-center text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-700 transition-colors">+</button>
                            </div>
                        </div>

                        <div class="mt-auto space-y-3">
                            <button id="qv-add-to-cart" class="w-full py-3 px-6 bg-primary-600 dark:bg-amber-600 hover:bg-primary-700 dark:hover:bg-amber-700 text-white font-semibold rounded-xl transition-colors flex items-center justify-center gap-2">
                                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"/></svg>
                                Add to Cart
                            </button>
                            <div class="grid grid-cols-2 gap-3">
                                <button onclick="WishlistApi.add(${b.id}).then(() => Toast.success('Added to wishlist'))" class="py-3 px-6 border-2 border-stone-200 dark:border-stone-600 text-stone-700 dark:text-stone-300 font-semibold rounded-xl hover:bg-stone-50 dark:hover:bg-stone-700 transition-colors flex items-center justify-center gap-2">
                                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/></svg>
                                    Wishlist
                                </button>
                                <a href="/products/${b.slug||b.id}/" class="py-3 px-6 border-2 border-stone-200 dark:border-stone-600 text-stone-700 dark:text-stone-300 font-semibold rounded-xl text-center hover:bg-stone-50 dark:hover:bg-stone-700 transition-colors">
                                    Full Details
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            `;let $=document.getElementById("qv-qty-input"),W=document.getElementById("qv-qty-minus"),ee=document.getElementById("qv-qty-plus"),oe=document.getElementById("qv-add-to-cart");W?.addEventListener("click",()=>{let de=parseInt($.value)||1;de>1&&($.value=de-1)}),ee?.addEventListener("click",()=>{let de=parseInt($.value)||1,me=parseInt($.max)||99;de<me&&($.value=de+1)}),oe?.addEventListener("click",async()=>{let de=parseInt($.value)||1;oe.disabled=!0,oe.innerHTML='<svg class="animate-spin h-5 w-5 mx-auto" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>';try{await CartApi.addItem(b.id,de),Toast.success("Added to cart"),d.remove()}catch{Toast.error("Failed to add to cart")}finally{oe.disabled=!1,oe.innerHTML='<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"/></svg> Add to Cart'}})}catch(p){console.error("Failed to load product:",p),d.remove(),Toast.error("Failed to load product details")}}function i(){if(!document.getElementById("price-range-slider"))return;let d=document.getElementById("filter-min-price"),p=document.getElementById("filter-max-price");!d||!p||[d,p].forEach(b=>{b.addEventListener("input",()=>{l()})})}function l(){let r=document.getElementById("price-range-display"),d=document.getElementById("filter-min-price")?.value||0,p=document.getElementById("filter-max-price")?.value||"\u221E";r&&(r.textContent=`$${d} - $${p}`)}function u(){h()}function h(){let r=document.getElementById("active-filters");if(!r)return;let d=[];if(n.min_price&&d.push({key:"min_price",label:`Min: $${n.min_price}`}),n.max_price&&d.push({key:"max_price",label:`Max: $${n.max_price}`}),n.in_stock&&d.push({key:"in_stock",label:"In Stock"}),n.on_sale&&d.push({key:"on_sale",label:"On Sale"}),n.ordering){let p={price:"Price: Low to High","-price":"Price: High to Low","-created_at":"Newest First",name:"A-Z","-popularity":"Most Popular"};d.push({key:"ordering",label:p[n.ordering]||n.ordering})}if(d.length===0){r.innerHTML="";return}r.innerHTML=`
            <div class="flex flex-wrap items-center gap-2 mb-4">
                <span class="text-sm text-stone-500 dark:text-stone-400">Active filters:</span>
                ${d.map(p=>`
                    <button data-remove-filter="${p.key}" class="inline-flex items-center gap-1 px-3 py-1 bg-primary-100 dark:bg-amber-900/30 text-primary-700 dark:text-amber-400 rounded-full text-sm hover:bg-primary-200 dark:hover:bg-amber-900/50 transition-colors">
                        ${p.label}
                        <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
                    </button>
                `).join("")}
                <button id="clear-all-active-filters" class="text-sm text-stone-500 dark:text-stone-400 hover:text-stone-700 dark:hover:text-stone-300 underline">Clear all</button>
            </div>
        `,r.querySelectorAll("[data-remove-filter]").forEach(p=>{p.addEventListener("click",()=>{let b=p.dataset.removeFilter;delete n[b],re()})}),document.getElementById("clear-all-active-filters")?.addEventListener("click",()=>{n={},re()})}function c(){x()}function x(r=null){let d=document.getElementById("product-count");d&&r!==null&&(d.textContent=`${r} products`)}function B(){let d=window.location.pathname.match(/\/categories\/([^\/]+)/);return d?d[1]:null}function A(){let r=new URLSearchParams(window.location.search),d={};r.get("min_price")&&(d.min_price=r.get("min_price")),r.get("max_price")&&(d.max_price=r.get("max_price")),r.get("ordering")&&(d.ordering=r.get("ordering")),r.get("in_stock")&&(d.in_stock=r.get("in_stock")==="true"),r.get("on_sale")&&(d.on_sale=r.get("on_sale")==="true");let p=r.getAll("attr");return p.length&&(d.attributes=p),d}async function R(r){let d=document.getElementById("category-header"),p=document.getElementById("category-products"),b=document.getElementById("category-filters");d&&Loader.show(d,"skeleton"),p&&Loader.show(p,"skeleton");try{let C=await CategoriesApi.getCategory(r);if(t=C.data||C,!t){window.location.href="/404/";return}Y(t),await G(t),await Z(t),await he(),await fe(t)}catch(C){console.error("Failed to load category:",C),d&&(d.innerHTML='<p class="text-red-500">Failed to load category.</p>')}}function Y(r){let d=document.getElementById("category-header");d&&(document.title=`${r.name} | Bunoraa`,d.innerHTML=`
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
        `)}async function G(r){let d=document.getElementById("breadcrumbs");if(d)try{let b=(await CategoriesApi.getBreadcrumbs(r.id)).data||[],C=[{label:"Home",url:"/"},{label:"Categories",url:"/categories/"},...b.map($=>({label:$.name,url:`/categories/${$.slug}/`}))];d.innerHTML=Breadcrumb.render(C)}catch(p){console.error("Failed to load breadcrumbs:",p)}}async function Z(r){let d=document.getElementById("category-filters");if(d)try{let b=(await ProductsApi.getFilterOptions({category:r.id})).data||{};d.innerHTML=`
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

                    ${b.attributes&&b.attributes.length?`
                        ${b.attributes.map(C=>`
                            <div class="border-b border-gray-200 pb-6">
                                <h3 class="text-sm font-semibold text-gray-900 mb-4">${Templates.escapeHtml(C.name)}</h3>
                                <div class="space-y-2 max-h-48 overflow-y-auto">
                                    ${C.values.map($=>`
                                        <label class="flex items-center">
                                            <input 
                                                type="checkbox" 
                                                name="attr-${C.slug}"
                                                value="${Templates.escapeHtml($.value)}"
                                                ${n.attributes?.includes(`${C.slug}:${$.value}`)?"checked":""}
                                                class="filter-attribute w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                                                data-attribute="${C.slug}"
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
            `,ue()}catch(p){console.error("Failed to load filters:",p),d.innerHTML=""}}function ue(){let r=document.getElementById("apply-price-filter"),d=document.getElementById("filter-in-stock"),p=document.getElementById("filter-on-sale"),b=document.getElementById("clear-filters"),C=document.querySelectorAll(".filter-attribute");r?.addEventListener("click",()=>{let $=document.getElementById("filter-min-price")?.value,W=document.getElementById("filter-max-price")?.value;$?n.min_price=$:delete n.min_price,W?n.max_price=W:delete n.max_price,re()}),d?.addEventListener("change",$=>{$.target.checked?n.in_stock=!0:delete n.in_stock,re()}),p?.addEventListener("change",$=>{$.target.checked?n.on_sale=!0:delete n.on_sale,re()}),C.forEach($=>{$.addEventListener("change",()=>{ie(),re()})}),b?.addEventListener("click",()=>{n={},e=1,re()})}function ie(){let r=document.querySelectorAll(".filter-attribute:checked"),d=[];r.forEach(p=>{d.push(`${p.dataset.attribute}:${p.value}`)}),d.length?n.attributes=d:delete n.attributes}function re(){e=1,ge(),he()}function ge(){let r=new URLSearchParams;n.min_price&&r.set("min_price",n.min_price),n.max_price&&r.set("max_price",n.max_price),n.ordering&&r.set("ordering",n.ordering),n.in_stock&&r.set("in_stock","true"),n.on_sale&&r.set("on_sale","true"),n.attributes&&n.attributes.forEach(p=>r.append("attr",p)),e>1&&r.set("page",e);let d=`${window.location.pathname}${r.toString()?"?"+r.toString():""}`;window.history.pushState({},"",d)}async function he(){let r=document.getElementById("category-products");if(!(!r||!t)){o&&o.abort(),o=new AbortController,Loader.show(r,"skeleton");try{let d={category:t.id,page:e,limit:12,...n};n.attributes&&(delete d.attributes,n.attributes.forEach($=>{let[W,ee]=$.split(":");d[`attr_${W}`]=ee}));let p=await ProductsApi.getAll(d),b=p.data||[],C=p.meta||{};I=b,k=e<(C.total_pages||1),be(b,C),h(),x(C.total||b.length)}catch(d){if(d.name==="AbortError")return;console.error("Failed to load products:",d),r.innerHTML='<p class="text-red-500 text-center py-8">Failed to load products. Please try again.</p>'}}}function be(r,d){let p=document.getElementById("category-products");if(!p)return;let b=Storage.get("productViewMode")||"grid",C=b==="list"?"space-y-4":"grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6";if(r.length===0){p.innerHTML=`
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
            `,document.getElementById("clear-filters-empty")?.addEventListener("click",()=>{n={},e=1,re()});return}if(p.innerHTML=`
            <div id="active-filters" class="mb-4"></div>
            <div id="products-grid" class="${C}">
                ${r.map($=>ProductCard.render($,{layout:b,showCompare:!0,showQuickView:!0})).join("")}
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
        `,ProductCard.bindEvents(p),h(),_(),y(),d.total_pages>1){let $=document.getElementById("products-pagination");$.innerHTML=Pagination.render({currentPage:d.current_page||e,totalPages:d.total_pages,totalItems:d.total}),$.addEventListener("click",W=>{let ee=W.target.closest("[data-page]");ee&&(e=parseInt(ee.dataset.page),k=!0,ge(),he(),window.scrollTo({top:0,behavior:"smooth"}))})}}async function fe(r){let d=document.getElementById("subcategories");if(d)try{let b=(await CategoriesApi.getSubcategories(r.id)).data||[];if(b.length===0){d.innerHTML="";return}d.innerHTML=`
                <div class="mb-8">
                    <h2 class="text-lg font-semibold text-gray-900 mb-4">Browse Subcategories</h2>
                    <div class="flex flex-wrap gap-2">
                        ${b.map(C=>`
                            <a href="/categories/${C.slug}/" class="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-full text-sm transition-colors">
                                ${Templates.escapeHtml(C.name)}
                                ${C.product_count?`<span class="text-gray-400 ml-1">(${C.product_count})</span>`:""}
                            </a>
                        `).join("")}
                    </div>
                </div>
            `}catch(p){console.error("Failed to load subcategories:",p),d.innerHTML=""}}function we(){let r=document.getElementById("mobile-filter-btn"),d=document.getElementById("filter-sidebar"),p=document.getElementById("close-filter-btn");r?.addEventListener("click",()=>{d?.classList.remove("hidden"),document.body.classList.add("overflow-hidden")}),p?.addEventListener("click",()=>{d?.classList.add("hidden"),document.body.classList.remove("overflow-hidden")})}function ke(){let r=document.getElementById("sort-select");r&&(r.value=n.ordering||"",r.addEventListener("change",d=>{d.target.value?n.ordering=d.target.value:delete n.ordering,re()}))}function Ce(){let r=document.getElementById("view-grid"),d=document.getElementById("view-list");(Storage.get("productViewMode")||"grid")==="list"&&(r?.classList.remove("bg-gray-200"),d?.classList.add("bg-gray-200")),r?.addEventListener("click",()=>{Storage.set("productViewMode","grid"),r.classList.add("bg-gray-200"),d?.classList.remove("bg-gray-200"),he()}),d?.addEventListener("click",()=>{Storage.set("productViewMode","list"),d.classList.add("bg-gray-200"),r?.classList.remove("bg-gray-200"),he()})}function Le(){o&&(o.abort(),o=null),n={},e=1,t=null,m=!1,v=!1,k=!0,I=[],document.getElementById("compare-bar")?.remove(),document.getElementById("quick-view-modal")?.remove(),document.getElementById("compare-modal")?.remove()}return{init:K,destroy:Le,toggleCompare:E,clearCompare:L}})();window.CategoryPage=js;Cr=js});var Os={};te(Os,{default:()=>Er});var zs,Er,Rs=X(()=>{zs=(async function(){"use strict";let n=null,e={shipping_address:null,billing_address:null,same_as_shipping:!0,shipping_method:null,payment_method:null,notes:""},t=1;async function o(){if(!AuthApi.isAuthenticated()&&!document.getElementById("guest-checkout")){Toast.info("Please login to continue checkout."),window.location.href="/account/login/?next=/checkout/";return}if(await m(),!n||!n.items||n.items.length===0){Toast.warning("Your cart is empty."),window.location.href="/cart/";return}await k(),H(),s(),g()}async function m(){try{n=(await CartApi.getCart()).data,v()}catch(c){console.error("Failed to load cart:",c),Toast.error("Failed to load cart.")}}function v(){let c=document.getElementById("order-summary");!c||!n||(c.innerHTML=`
            <div class="bg-gray-50 rounded-xl p-6">
                <h3 class="text-lg font-semibold text-gray-900 mb-4">Order Summary</h3>
                
                <!-- Cart Items -->
                <div class="space-y-3 max-h-64 overflow-y-auto mb-4">
                    ${n.items.map(x=>`
                        <div class="flex gap-3">
                            <div class="flex-shrink-0 w-16 h-16 bg-gray-200 rounded-lg overflow-hidden">
                                ${x.product?.image?`
                                <img src="${x.product.image}" alt="" class="w-full h-full object-cover" onerror="this.style.display='none'">
                                `:`
                                <div class="w-full h-full flex items-center justify-center text-gray-400">
                                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                                    </svg>
                                </div>`}
                            </div>
                            <div class="flex-1 min-w-0">
                                <h4 class="text-sm font-medium text-gray-900 truncate">${Templates.escapeHtml(x.product?.name)}</h4>
                                ${x.variant?`<p class="text-xs text-gray-500">${Templates.escapeHtml(x.variant.name||x.variant.value)}</p>`:""}
                                <div class="flex justify-between mt-1">
                                    <span class="text-xs text-gray-500">Qty: ${x.quantity}</span>
                                    <span class="text-sm font-medium">${Templates.formatPrice(x.price*x.quantity)}</span>
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
        `)}async function k(){if(AuthApi.isAuthenticated())try{let x=(await AuthApi.getAddresses()).data||[],B=document.getElementById("saved-addresses");B&&x.length>0&&(B.innerHTML=`
                    <div class="mb-4">
                        <label class="block text-sm font-medium text-gray-700 mb-2">Saved Addresses</label>
                        <div class="space-y-2">
                            ${x.map(A=>`
                                <label class="flex items-start p-3 border border-gray-200 rounded-lg cursor-pointer hover:border-primary-500 transition-colors">
                                    <input type="radio" name="saved_address" value="${A.id}" class="mt-1 text-primary-600 focus:ring-primary-500">
                                    <div class="ml-3">
                                        <p class="font-medium text-gray-900">${Templates.escapeHtml(A.full_name||`${A.first_name} ${A.last_name}`)}</p>
                                        <p class="text-sm text-gray-600">${Templates.escapeHtml(A.address_line_1)}</p>
                                        ${A.address_line_2?`<p class="text-sm text-gray-600">${Templates.escapeHtml(A.address_line_2)}</p>`:""}
                                        <p class="text-sm text-gray-600">${Templates.escapeHtml(A.city)}, ${Templates.escapeHtml(A.state||"")} ${Templates.escapeHtml(A.postal_code)}</p>
                                        <p class="text-sm text-gray-600">${Templates.escapeHtml(A.country)}</p>
                                        ${A.is_default?'<span class="inline-block mt-1 px-2 py-0.5 bg-primary-100 text-primary-700 text-xs rounded">Default</span>':""}
                                    </div>
                                </label>
                            `).join("")}
                            <label class="flex items-center p-3 border border-gray-200 rounded-lg cursor-pointer hover:border-primary-500 transition-colors">
                                <input type="radio" name="saved_address" value="new" class="text-primary-600 focus:ring-primary-500" checked>
                                <span class="ml-3 text-gray-700">Enter a new address</span>
                            </label>
                        </div>
                    </div>
                `,I())}catch(c){console.error("Failed to load addresses:",c)}}function I(){let c=document.querySelectorAll('input[name="saved_address"]'),x=document.getElementById("new-address-form");c.forEach(B=>{B.addEventListener("change",A=>{A.target.value==="new"?x?.classList.remove("hidden"):(x?.classList.add("hidden"),e.shipping_address=A.target.value)})})}function H(){let c=document.querySelectorAll("[data-step]"),x=document.querySelectorAll("[data-step-indicator]"),B=document.querySelectorAll("[data-next-step]"),A=document.querySelectorAll("[data-prev-step]");function R(Y){c.forEach(G=>{G.classList.toggle("hidden",parseInt(G.dataset.step)!==Y)}),x.forEach(G=>{let Z=parseInt(G.dataset.stepIndicator);G.classList.toggle("bg-primary-600",Z<=Y),G.classList.toggle("text-white",Z<=Y),G.classList.toggle("bg-gray-200",Z>Y),G.classList.toggle("text-gray-600",Z>Y)}),t=Y}B.forEach(Y=>{Y.addEventListener("click",async()=>{await U()&&(t===1&&await D(),R(t+1),window.scrollTo({top:0,behavior:"smooth"}))})}),A.forEach(Y=>{Y.addEventListener("click",()=>{R(t-1),window.scrollTo({top:0,behavior:"smooth"})})}),R(1)}async function U(){switch(t){case 1:return M();case 2:return L();case 3:return a();default:return!0}}function K(c){c&&(c.querySelectorAll("[data-error-for]").forEach(x=>x.remove()),c.querySelectorAll(".!border-red-500").forEach(x=>x.classList.remove("!border-red-500")))}function N(c,x){if(!c)return;let B=c.getAttribute("name")||c.id||Math.random().toString(36).slice(2,8),A=c.closest("form")?.querySelector(`[data-error-for="${B}"]`);A&&A.remove();let R=document.createElement("p");R.className="text-sm text-red-600 mt-1",R.setAttribute("data-error-for",B),R.textContent=x,c.classList.add("!border-red-500"),c.nextSibling?c.parentNode.insertBefore(R,c.nextSibling):c.parentNode.appendChild(R)}function y(c){if(!c)return;let x=c.querySelector("[data-error-for]");if(!x)return;let B=x.getAttribute("data-error-for"),A=c.querySelector(`[name="${B}"]`)||c.querySelector(`#${B}`)||x.previousElementSibling;if(A&&typeof A.focus=="function")try{A.focus({preventScroll:!0})}catch{A.focus()}}function M(){let c=document.querySelector('input[name="saved_address"]:checked');if(c&&c.value!=="new")return K(document.getElementById("new-address-form")||document.getElementById("information-form")),e.shipping_address=c.value,!0;let x=document.getElementById("shipping-address-form")||document.getElementById("information-form")||document.getElementById("new-address-form");if(!x)return!1;K(x);let B=new FormData(x),A={first_name:B.get("first_name")||B.get("full_name")?.split(" ")?.[0],last_name:B.get("last_name")||(B.get("full_name")?B.get("full_name").split(" ").slice(1).join(" "):""),email:B.get("email"),phone:B.get("phone"),address_line_1:B.get("address_line1")||B.get("address_line_1"),address_line_2:B.get("address_line2")||B.get("address_line_2"),city:B.get("city"),state:B.get("state"),postal_code:B.get("postal_code"),country:B.get("country")},Y=["email","first_name","address_line_1","city","postal_code"].filter(G=>!A[G]);if(Y.length>0)return Y.forEach(G=>{let Z=`[name="${G}"]`;G==="address_line_1"&&(Z='[name="address_line1"],[name="address_line_1"]');let ue=x.querySelector(Z);N(ue||x,G.replace("_"," ").replace(/\b\w/g,ie=>ie.toUpperCase())+" is required.")}),y(x),!1;if(A.email&&!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(A.email)){let G=x.querySelector('[name="email"]');return N(G||x,"Please enter a valid email address."),y(x),!1}return e.shipping_address=A,!0}async function D(){let c=document.getElementById("shipping-methods");if(c){Loader.show(c,"spinner");try{let x=e.shipping_address;if(!x){c.innerHTML='<p class="text-gray-500">Please provide a shipping address to view shipping methods.</p>';return}let B=typeof x=="object"?{country:x.country,postal_code:x.postal_code,city:x.city}:{address_id:x},R=(await ShippingApi.getRates(B)).data||[];if(R.length===0){c.innerHTML='<p class="text-gray-500">No shipping methods available for your location.</p>';return}c.innerHTML=`
                <div class="space-y-3">
                    ${R.map((G,Z)=>`
                        <label class="flex items-center justify-between p-4 border border-gray-200 rounded-lg cursor-pointer hover:border-primary-500 transition-colors">
                            <div class="flex items-center">
                                <input 
                                    type="radio" 
                                    name="shipping_method" 
                                    value="${G.id}" 
                                    ${Z===0?"checked":""}
                                    class="text-primary-600 focus:ring-primary-500"
                                    data-price="${G.price}"
                                >
                                <div class="ml-3">
                                    <p class="font-medium text-gray-900">${Templates.escapeHtml(G.name)}</p>
                                    ${G.description?`<p class="text-sm text-gray-500">${Templates.escapeHtml(G.description)}</p>`:""}
                                    ${G.estimated_days?`<p class="text-sm text-gray-500">Delivery in ${G.estimated_days} days</p>`:""}
                                </div>
                            </div>
                            <span class="font-semibold text-gray-900">${G.price>0?Templates.formatPrice(G.price):"Free"}</span>
                        </label>
                    `).join("")}
                </div>
            `,c.querySelectorAll('input[name="shipping_method"]').forEach((G,Z)=>{G.__price=R[Z]?R[Z].price:0,G.addEventListener("change",()=>{_(parseFloat(G.__price)||0)})}),R.length>0&&(e.shipping_method=R[0].id,_(R[0].price||0))}catch(x){console.error("Failed to load shipping methods:",x),c.innerHTML='<p class="text-red-500">Failed to load shipping methods. Please try again.</p>'}}}async function S(){let c=document.getElementById("payment-methods-container");if(c)try{let x=new URLSearchParams;window.CONFIG&&CONFIG.shippingData&&CONFIG.shippingData.countryCode&&x.set("country",CONFIG.shippingData.countryCode),n&&(n.total||n.total===0)&&x.set("amount",n.total);let A=await(await fetch(`/api/v1/payments/gateways/available/?${x.toString()}`,{credentials:"same-origin"})).json(),R=A&&A.data||[],Y=c.querySelectorAll(".payment-option");if(Y&&Y.length>0){try{let Z=Array.from(Y).map(re=>re.dataset.gateway).filter(Boolean),ue=(R||[]).map(re=>re.code);if(Z.length===ue.length&&Z.every((re,ge)=>re===ue[ge])){s();return}}catch(Z){console.warn("Failed to compare existing payment gateways:",Z)}if(R.length===0)return}if(!R||R.length===0){c.innerHTML=`
                    <div class="text-center py-8 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl">
                        <svg class="w-16 h-16 mx-auto mb-4 text-gray-300 dark:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"></path></svg>
                        <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">No payment methods are configured</h3>
                        <p class="text-gray-500 dark:text-gray-400 mb-2">We don't have any payment providers configured for your currency or location. Please contact support to enable online payments.</p>
                        <p class="text-sm text-gray-400">You can still place an order if Cash on Delivery or Bank Transfer is available from admin.</p>
                    </div>
                `;return}let G=document.createDocumentFragment();R.forEach((Z,ue)=>{let ie=document.createElement("div");ie.className="relative payment-option transform transition-all duration-300 hover:scale-[1.01]",ie.dataset.gateway=Z.code,ie.style.animation="slideIn 0.3s ease-out both",ie.style.animationDelay=`${ue*80}ms`;let re=document.createElement("input");re.type="radio",re.name="payment_method",re.value=Z.code,re.id=`payment-${Z.code}`,re.className="peer sr-only",ue===0&&(re.checked=!0);let ge=document.createElement("label");ge.setAttribute("for",re.id),ge.className="flex items-center justify-between p-4 border-2 rounded-xl cursor-pointer transition-all duration-300 hover:border-gray-400 border-gray-200",ge.innerHTML=`
                    <div class="flex items-center">
                        <div class="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mr-4">
                            ${Z.icon_url?`<img src="${Z.icon_url}" class="h-6" alt="${Z.name}">`:`<span class="font-bold">${Z.code.toUpperCase()}</span>`}
                        </div>
                        <div>
                            <p class="font-medium text-gray-900 dark:text-white">${Templates.escapeHtml(Z.name)}</p>
                            <p class="text-sm text-gray-500 dark:text-gray-400">${Templates.escapeHtml(Z.description||"")}</p>
                            ${Z.fee_text?`<p class="text-xs text-amber-600 dark:text-amber-400 mt-1">${Templates.escapeHtml(Z.fee_text)}</p>`:""}
                            ${Z.instructions?`<p class="text-xs text-gray-500 dark:text-gray-400 mt-2">${Z.instructions}</p>`:""}
                        </div>
                    </div>
                `,ie.appendChild(re),ie.appendChild(ge);let he=document.createElement("div");he.className="absolute top-4 right-4 opacity-0 peer-checked:opacity-100 transition-opacity duration-300",he.innerHTML='<svg class="w-6 h-6 text-primary-600" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"></path></svg>',ie.appendChild(he),G.appendChild(ie),Z.public_key&&Z.requires_client&&E(Z.public_key).catch(be=>console.error("Failed to load Stripe:",be))}),c.replaceChildren(G),s()}catch(x){console.error("Failed to load payment gateways:",x)}}function E(c){return new Promise((x,B)=>{if(window.Stripe&&window.STRIPE_PUBLISHABLE_KEY===c){x();return}if(window.STRIPE_PUBLISHABLE_KEY=c,window.Stripe){w(c),x();return}let A=document.createElement("script");A.src="https://js.stripe.com/v3/",A.async=!0,A.onload=()=>{try{w(c),x()}catch(R){B(R)}},A.onerror=R=>B(R),document.head.appendChild(A)})}function w(c){if(typeof Stripe>"u")throw new Error("Stripe script not loaded");try{let x=Stripe(c),A=x.elements().create("card"),R=document.getElementById("card-element");R&&(R.innerHTML="",A.mount("#card-element"),A.on("change",Y=>{let G=document.getElementById("card-errors");G&&(G.textContent=Y.error?Y.error.message:"")}),window.stripeInstance=x,window.stripeCard=A)}catch(x){throw console.error("Error initializing Stripe elements:",x),x}}(function(){document.addEventListener("DOMContentLoaded",()=>{setTimeout(()=>{S()},50)})})();function _(c){let x=document.getElementById("shipping-cost"),B=document.getElementById("order-total");if(x&&(x.textContent=c>0?Templates.formatPrice(c):"Free"),B&&n){let A=(n.total||0)+c;B.textContent=Templates.formatPrice(A)}}function L(){let c=document.querySelector('input[name="shipping_method"]:checked');return c?(e.shipping_method=c.value,!0):(Toast.error("Please select a shipping method."),!1)}function g(){let c=document.getElementById("order-summary-toggle"),x=document.getElementById("order-summary-block");if(!c||!x)return;c.addEventListener("click",()=>{let A=x.classList.toggle("hidden");c.setAttribute("aria-expanded",(!A).toString());let R=c.querySelector("svg");R&&R.classList.toggle("rotate-180",!A)});let B=window.getComputedStyle(x).display==="none"||x.classList.contains("hidden");c.setAttribute("aria-expanded",(!B).toString())}function a(){let c=document.querySelector('input[name="payment_method"]:checked'),x=document.getElementById("payment-form");if(K(x),!c){let A=document.getElementById("payment-methods-container")||x;return N(A,"Please select a payment method."),y(A),!1}let B=c.value;if(B==="stripe"){let A=document.getElementById("cardholder-name");if(!A||!A.value.trim())return N(A||x,"Cardholder name is required."),y(x),!1;if(!window.stripeCard)return N(document.getElementById("card-element")||x,"Card input not ready. Please wait and try again."),!1}if(B==="bkash"){let A=document.getElementById("bkash-number");if(!A||!A.value.trim())return N(A||x,"bKash mobile number is required."),y(x),!1}if(B==="nagad"){let A=document.getElementById("nagad-number");if(!A||!A.value.trim())return N(A||x,"Nagad mobile number is required."),y(x),!1}return e.payment_method=B,!0}function s(){let c=document.getElementById("same-as-shipping"),x=document.getElementById("billing-address-form");c?.addEventListener("change",Y=>{e.same_as_shipping=Y.target.checked,x?.classList.toggle("hidden",Y.target.checked)}),document.querySelectorAll('input[name="payment_method"]').forEach(Y=>{let G=Z=>{document.querySelectorAll("[data-payment-form]").forEach(re=>{re.classList.add("hidden")});let ue=Z.target?Z.target.value:Y.value||null;if(!ue)return;let ie=document.querySelector(`[data-payment-form="${ue}"]`);ie||(ie=document.getElementById(`${ue}-form`)),ie?.classList.remove("hidden")};Y.addEventListener("change",G),Y.checked&&G({target:Y})});let A=document.getElementById("place-order-btn"),R=document.getElementById("place-order-form");A&&(!R||!R.action||R.action.includes("javascript"))&&A.addEventListener("click",async Y=>{Y.preventDefault(),await i()})}async function i(){if(!a())return;let c=document.getElementById("place-order-btn");c.disabled=!0,c.innerHTML='<svg class="animate-spin h-5 w-5 mx-auto" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>';try{let x=document.getElementById("order-notes")?.value;if(e.notes=x||"",!e.same_as_shipping){let R=document.getElementById("billing-address-form");if(R){let Y=new FormData(R);e.billing_address={first_name:Y.get("billing_first_name"),last_name:Y.get("billing_last_name"),address_line_1:Y.get("billing_address_line_1"),address_line_2:Y.get("billing_address_line_2"),city:Y.get("billing_city"),state:Y.get("billing_state"),postal_code:Y.get("billing_postal_code"),country:Y.get("billing_country")}}}let A=(await CheckoutApi.createOrder(e)).data;e.payment_method==="stripe"||e.payment_method==="card"?await l(A):e.payment_method==="paypal"?await u(A):window.location.href=`/orders/${A.id}/confirmation/`}catch(x){console.error("Failed to place order:",x),Toast.error(x.message||"Failed to place order. Please try again."),c.disabled=!1,c.textContent="Place Order"}}async function l(c){try{let x=await CheckoutApi.createPaymentIntent(c.id),{client_secret:B}=x.data,A=x.data.publishable_key||window.STRIPE_PUBLISHABLE_KEY||(window.stripeInstance?window.STRIPE_PUBLISHABLE_KEY:null);if(typeof Stripe>"u"&&!window.stripeInstance)throw new Error("Stripe is not loaded.");let Y=await(window.stripeInstance||Stripe(A)).confirmCardPayment(B,{payment_method:{card:window.stripeCard,billing_details:{name:`${e.shipping_address.first_name} ${e.shipping_address.last_name}`}}});if(Y.error)throw new Error(Y.error.message);window.location.href=`/orders/${c.id}/confirmation/`}catch(x){console.error("Stripe payment failed:",x),Toast.error(x.message||"Payment failed. Please try again.");let B=document.getElementById("place-order-btn");B.disabled=!1,B.textContent="Place Order"}}async function u(c){try{let x=await CheckoutApi.createPayPalOrder(c.id),{approval_url:B}=x.data;window.location.href=B}catch(x){console.error("PayPal payment failed:",x),Toast.error(x.message||"Payment failed. Please try again.");let B=document.getElementById("place-order-btn");B.disabled=!1,B.textContent="Place Order"}}function h(){n=null,e={shipping_address:null,billing_address:null,same_as_shipping:!0,shipping_method:null,payment_method:null,notes:""},t=1}return{init:o,destroy:h}})();window.CheckoutPage=zs;Er=zs});var Ds={};te(Ds,{default:()=>Lr});var Vs,Lr,Us=X(()=>{Vs=(function(){"use strict";async function n(){I(),await U(),e()}function e(){t(),o(),m(),v(),k()}function t(){let N=document.getElementById("contact-map");if(!N)return;let y=N.dataset.lat||"0",M=N.dataset.lng||"0",D=N.dataset.address||"Our Location";N.innerHTML=`
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
        `}function o(){let N=document.getElementById("live-chat-cta");N&&(N.innerHTML=`
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
        `,document.getElementById("open-live-chat")?.addEventListener("click",()=>{document.dispatchEvent(new CustomEvent("chat:open"))}))}function m(){let N=document.getElementById("quick-contact");if(!N)return;let y=[{icon:"phone",label:"Call Us",action:"tel:",color:"emerald"},{icon:"whatsapp",label:"WhatsApp",action:"https://wa.me/",color:"green"},{icon:"email",label:"Email",action:"mailto:",color:"blue"}];N.innerHTML=`
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
        `}function v(){let N=document.getElementById("faq-preview");if(!N)return;let y=[{q:"How long does shipping take?",a:"Standard shipping takes 5-7 business days. Express options are available at checkout."},{q:"What is your return policy?",a:"We offer a 30-day hassle-free return policy on all unused items in original packaging."},{q:"Do you ship internationally?",a:"Yes! We ship to over 100 countries worldwide."}];N.innerHTML=`
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
        `,N.querySelectorAll(".faq-trigger").forEach(M=>{M.addEventListener("click",()=>{let D=M.closest(".faq-item"),S=D.querySelector(".faq-answer"),E=D.querySelector(".faq-icon"),w=!S.classList.contains("hidden");N.querySelectorAll(".faq-item").forEach(_=>{_!==D&&(_.querySelector(".faq-answer").classList.add("hidden"),_.querySelector(".faq-icon").classList.remove("rotate-180"))}),S.classList.toggle("hidden"),E.classList.toggle("rotate-180")})})}function k(){let N=document.getElementById("office-status");if(!N)return;let y={start:9,end:18,timezone:"America/New_York",days:[1,2,3,4,5]};function M(){let D=new Date,S=D.getDay(),E=D.getHours(),_=y.days.includes(S)&&E>=y.start&&E<y.end;N.innerHTML=`
                <div class="flex items-center gap-3 p-4 rounded-xl ${_?"bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800":"bg-stone-100 dark:bg-stone-800 border border-stone-200 dark:border-stone-700"}">
                    <span class="relative flex h-3 w-3">
                        ${_?`<span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                             <span class="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>`:'<span class="relative inline-flex rounded-full h-3 w-3 bg-stone-400"></span>'}
                    </span>
                    <div>
                        <p class="font-medium ${_?"text-emerald-700 dark:text-emerald-400":"text-stone-600 dark:text-stone-400"}">
                            ${_?"We're Open!":"Currently Closed"}
                        </p>
                        <p class="text-xs ${_?"text-emerald-600 dark:text-emerald-500":"text-stone-500 dark:text-stone-500"}">
                            ${_?"Our team is available to help you.":`Office hours: Mon-Fri ${y.start}AM - ${y.end>12?y.end-12+"PM":y.end+"AM"}`}
                        </p>
                    </div>
                </div>
            `}M(),setInterval(M,6e4)}function I(){let N=document.getElementById("contact-form");if(!N)return;let y=FormValidator.create(N,{name:{required:!0,minLength:2,maxLength:100},email:{required:!0,email:!0},subject:{required:!0,minLength:5,maxLength:200},message:{required:!0,minLength:20,maxLength:2e3}});N.addEventListener("submit",async M=>{if(M.preventDefault(),!y.validate()){Toast.error("Please fill in all required fields correctly.");return}let D=N.querySelector('button[type="submit"]'),S=D.textContent;D.disabled=!0,D.innerHTML='<svg class="animate-spin h-5 w-5 mx-auto" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>';try{let E=new FormData(N),w={name:E.get("name"),email:E.get("email"),phone:E.get("phone"),subject:E.get("subject"),message:E.get("message")};await SupportApi.submitContactForm(w),Toast.success("Thank you for your message! We'll get back to you soon."),N.reset(),y.clearErrors(),H()}catch(E){Toast.error(E.message||"Failed to send message. Please try again.")}finally{D.disabled=!1,D.textContent=S}})}function H(){let N=document.getElementById("contact-form"),y=document.getElementById("contact-success");N&&y&&(N.classList.add("hidden"),y.classList.remove("hidden"),y.innerHTML=`
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
            `,document.getElementById("send-another-btn")?.addEventListener("click",()=>{N.classList.remove("hidden"),y.classList.add("hidden")}))}async function U(){let N=document.getElementById("contact-info");if(N)try{let M=(await PagesApi.getContactInfo()).data;if(!M)return;N.innerHTML=`
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
            `}catch(y){console.error("Failed to load contact info:",y)}}function K(){}return{init:n,destroy:K}})();window.ContactPage=Vs;Lr=Vs});var Ys={};te(Ys,{default:()=>$r});var Ws,$r,Qs=X(()=>{Ws=(function(){"use strict";let n=[],e=[];async function t(){let a=document.getElementById("faq-list");a&&a.querySelector(".faq-item")?N():await y(),_(),o()}function o(){m(),v(),k(),I(),H(),U(),K()}function m(){if(!document.querySelector(".faq-search-container")||!("webkitSpeechRecognition"in window||"SpeechRecognition"in window))return;let s=window.SpeechRecognition||window.webkitSpeechRecognition,i=new s;i.continuous=!1,i.lang="en-US";let l=document.createElement("button");l.id="faq-voice-search",l.type="button",l.className="absolute right-12 top-1/2 -translate-y-1/2 p-2 text-stone-400 hover:text-primary-600 dark:hover:text-amber-400 transition-colors",l.innerHTML=`
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"/></svg>
        `;let u=document.getElementById("faq-search");u&&u.parentElement&&(u.parentElement.style.position="relative",u.parentElement.appendChild(l));let h=!1;l.addEventListener("click",()=>{h?i.stop():(i.start(),l.classList.add("text-red-500","animate-pulse")),h=!h}),i.onresult=c=>{let x=c.results[0][0].transcript;u&&(u.value=x,u.dispatchEvent(new Event("input"))),l.classList.remove("text-red-500","animate-pulse"),h=!1},i.onerror=()=>{l.classList.remove("text-red-500","animate-pulse"),h=!1}}function v(){document.querySelectorAll(".faq-content, .accordion-content, .faq-answer").forEach(a=>{if(a.querySelector(".faq-rating"))return;let i=(a.closest(".faq-item")||a.closest("[data-accordion]"))?.dataset.id||Math.random().toString(36).substr(2,9),l=`
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
            `;a.insertAdjacentHTML("beforeend",l)}),document.addEventListener("click",a=>{let s=a.target.closest(".faq-rate-btn");if(!s)return;let i=s.dataset.helpful==="yes",l=s.dataset.question,u=s.closest(".faq-rating"),h=JSON.parse(localStorage.getItem("faqRatings")||"{}");h[l]=i,localStorage.setItem("faqRatings",JSON.stringify(h)),u.innerHTML=`
                <div class="flex items-center gap-2 text-sm ${i?"text-emerald-600 dark:text-emerald-400":"text-stone-500 dark:text-stone-400"}">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                    <span>Thanks for your feedback!</span>
                </div>
            `,typeof analytics<"u"&&analytics.track("faq_rated",{questionId:l,helpful:i})})}function k(){let a=document.getElementById("faq-contact-promo");a&&(a.innerHTML=`
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
        `,document.getElementById("open-chat-faq")?.addEventListener("click",()=>{document.dispatchEvent(new CustomEvent("chat:open"))}))}function I(){let a=document.getElementById("popular-questions");if(!a)return;let s=JSON.parse(localStorage.getItem("faqRatings")||"{}"),i=Object.entries(s).filter(([u,h])=>h).slice(0,5).map(([u])=>u),l=[];document.querySelectorAll(".faq-item, [data-accordion]").forEach(u=>{let h=u.dataset.id;if(i.includes(h)||l.length<3){let c=u.querySelector("button span, .accordion-toggle span")?.textContent?.trim();c&&l.push({id:h,question:c,element:u})}}),l.length!==0&&(a.innerHTML=`
            <div class="bg-primary-50 dark:bg-amber-900/20 rounded-2xl p-6">
                <h3 class="font-semibold text-stone-900 dark:text-white mb-4 flex items-center gap-2">
                    <svg class="w-5 h-5 text-primary-600 dark:text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"/></svg>
                    Most Helpful Questions
                </h3>
                <ul class="space-y-2">
                    ${l.slice(0,5).map(u=>`
                        <li>
                            <button class="popular-q-link text-left text-primary-600 dark:text-amber-400 hover:underline text-sm" data-target="${u.id}">
                                ${Templates.escapeHtml(u.question)}
                            </button>
                        </li>
                    `).join("")}
                </ul>
            </div>
        `,a.querySelectorAll(".popular-q-link").forEach(u=>{u.addEventListener("click",()=>{let h=u.dataset.target,c=document.querySelector(`[data-id="${h}"], .faq-item`);if(c){c.scrollIntoView({behavior:"smooth",block:"center"});let x=c.querySelector(".faq-trigger, .accordion-toggle");x&&x.click()}})}))}function H(){document.querySelectorAll(".faq-content, .accordion-content, .faq-answer").forEach(a=>{if(a.querySelector(".faq-share"))return;let i=(a.closest(".faq-item")||a.closest("[data-accordion]"))?.querySelector("button span, .accordion-toggle span")?.textContent?.trim();if(!i)return;let l=`
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
            `;a.insertAdjacentHTML("beforeend",l)}),document.addEventListener("click",a=>{let s=a.target.closest('.faq-share-btn[data-platform="copy"]');s&&navigator.clipboard.writeText(window.location.href).then(()=>{let i=s.innerHTML;s.innerHTML='<svg class="w-4 h-4 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>',setTimeout(()=>{s.innerHTML=i},2e3)})})}function U(){let a=document.querySelectorAll(".faq-item, [data-accordion]"),s=-1;document.addEventListener("keydown",i=>{if(document.querySelector("#faq-container, #faq-list")){if(i.key==="ArrowDown"||i.key==="ArrowUp"){i.preventDefault(),i.key==="ArrowDown"?s=Math.min(s+1,a.length-1):s=Math.max(s-1,0);let l=a[s];if(l){l.scrollIntoView({behavior:"smooth",block:"center"});let u=l.querySelector(".faq-trigger, .accordion-toggle, button");u&&u.focus()}}if(i.key==="Enter"&&s>=0){let u=a[s]?.querySelector(".faq-trigger, .accordion-toggle");u&&u.click()}i.key==="/"&&document.activeElement?.tagName!=="INPUT"&&(i.preventDefault(),document.getElementById("faq-search")?.focus())}})}function K(){let a=new IntersectionObserver(s=>{s.forEach(i=>{if(i.isIntersecting){let l=i.target,u=l.querySelector("button span, .accordion-toggle span")?.textContent?.trim(),h=JSON.parse(localStorage.getItem("faqViews")||"{}"),c=l.dataset.id||u?.substring(0,30);c&&(h[c]=(h[c]||0)+1,localStorage.setItem("faqViews",JSON.stringify(h)))}})},{threshold:.5});document.querySelectorAll(".faq-item, [data-accordion]").forEach(s=>{a.observe(s)}),document.addEventListener("click",s=>{let i=s.target.closest(".faq-trigger, .accordion-toggle");if(i){let l=i.closest(".faq-item, [data-accordion]"),u=i.querySelector("span")?.textContent?.trim();typeof analytics<"u"&&analytics.track("faq_opened",{question:u?.substring(0,100)})}})}function N(){let a=document.querySelectorAll(".category-tab"),s=document.querySelectorAll(".faq-category");a.forEach(l=>{l.addEventListener("click",u=>{u.preventDefault(),a.forEach(x=>{x.classList.remove("bg-primary-600","dark:bg-amber-600","text-white"),x.classList.add("bg-stone-100","dark:bg-stone-800","text-stone-700","dark:text-stone-300")}),l.classList.add("bg-primary-600","dark:bg-amber-600","text-white"),l.classList.remove("bg-stone-100","dark:bg-stone-800","text-stone-700","dark:text-stone-300");let h=l.dataset.category;h==="all"?s.forEach(x=>x.classList.remove("hidden")):s.forEach(x=>{x.classList.toggle("hidden",x.dataset.category!==h)});let c=document.getElementById("faq-search");c&&(c.value=""),document.querySelectorAll(".faq-item").forEach(x=>x.classList.remove("hidden"))})}),document.querySelectorAll(".accordion-toggle").forEach(l=>{l.addEventListener("click",()=>{let u=l.closest("[data-accordion]"),h=u.querySelector(".accordion-content"),c=u.querySelector(".accordion-icon"),x=!h.classList.contains("hidden");document.querySelectorAll("[data-accordion]").forEach(B=>{B!==u&&(B.querySelector(".accordion-content")?.classList.add("hidden"),B.querySelector(".accordion-icon")?.classList.remove("rotate-180"))}),x?(h.classList.add("hidden"),c.classList.remove("rotate-180")):(h.classList.remove("hidden"),c.classList.add("rotate-180"))})})}async function y(){let a=document.getElementById("faq-container");if(a){Loader.show(a,"skeleton");try{let i=(await PagesApi.getFAQs()).data||[];if(e=i,i.length===0){a.innerHTML=`
                    <div class="text-center py-12">
                        <svg class="w-16 h-16 text-stone-300 dark:text-stone-600 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                        </svg>
                        <p class="text-stone-500 dark:text-stone-400">No FAQs available at the moment.</p>
                    </div>
                `;return}n=M(i),D(n)}catch(s){console.error("Failed to load FAQs:",s),a.innerHTML=`
                <div class="text-center py-12">
                    <svg class="w-16 h-16 text-red-300 dark:text-red-600 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                    </svg>
                    <p class="text-red-500 dark:text-red-400">Failed to load FAQs. Please try again later.</p>
                </div>
            `}}}function M(a){let s={};return a.forEach(i=>{let l=i.category||"General";s[l]||(s[l]=[]),s[l].push(i)}),s}function D(a,s=""){let i=document.getElementById("faq-container");if(!i)return;let l=Object.keys(a);if(l.length===0){i.innerHTML=`
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
                    ${l.map(u=>`
                        <button class="faq-category-btn px-4 py-2 bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 text-stone-600 dark:text-stone-300 rounded-full text-sm font-medium whitespace-nowrap transition-colors" data-category="${Templates.escapeHtml(u)}">
                            ${Templates.escapeHtml(u)}
                        </button>
                    `).join("")}
                </div>
            </div>

            <!-- FAQ Accordion -->
            <div id="faq-list" class="space-y-6">
                ${l.map(u=>`
                    <div class="faq-category" data-category="${Templates.escapeHtml(u)}">
                        <h2 class="text-lg font-semibold text-stone-900 dark:text-white mb-4">${Templates.escapeHtml(u)}</h2>
                        <div class="space-y-3">
                            ${a[u].map(h=>S(h,s)).join("")}
                        </div>
                    </div>
                `).join("")}
            </div>
        `,E(),w(),v(),H()}function S(a,s=""){let i=Templates.escapeHtml(a.question),l=a.answer;if(s){let u=new RegExp(`(${s.replace(/[.*+?^${}()|[\]\\]/g,"\\$&")})`,"gi");i=i.replace(u,'<mark class="bg-yellow-200 dark:bg-yellow-800">$1</mark>'),l=l.replace(u,'<mark class="bg-yellow-200 dark:bg-yellow-800">$1</mark>')}return`
            <div class="faq-item border border-stone-200 dark:border-stone-700 rounded-xl overflow-hidden bg-white dark:bg-stone-800" data-id="${a.id||""}">
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
        `}function E(){let a=document.querySelectorAll(".faq-category-btn"),s=document.querySelectorAll(".faq-category");a.forEach(i=>{i.addEventListener("click",()=>{a.forEach(u=>{u.classList.remove("bg-primary-600","dark:bg-amber-600","text-white"),u.classList.add("bg-stone-100","dark:bg-stone-800","text-stone-600","dark:text-stone-300")}),i.classList.add("bg-primary-600","dark:bg-amber-600","text-white"),i.classList.remove("bg-stone-100","dark:bg-stone-800","text-stone-600","dark:text-stone-300");let l=i.dataset.category;s.forEach(u=>{l==="all"||u.dataset.category===l?u.classList.remove("hidden"):u.classList.add("hidden")})})})}function w(){document.querySelectorAll(".faq-trigger").forEach(s=>{s.addEventListener("click",()=>{let i=s.closest(".faq-item"),l=i.querySelector(".faq-content"),u=i.querySelector(".faq-icon"),h=!l.classList.contains("hidden");document.querySelectorAll(".faq-item").forEach(c=>{c!==i&&(c.querySelector(".faq-content")?.classList.add("hidden"),c.querySelector(".faq-icon")?.classList.remove("rotate-180"))}),l.classList.toggle("hidden"),u.classList.toggle("rotate-180")})})}function _(){let a=document.getElementById("faq-search");if(!a)return;let s=null;a.addEventListener("input",l=>{let u=l.target.value.trim().toLowerCase();clearTimeout(s),s=setTimeout(()=>{if(document.querySelector(".accordion-toggle"))L(u);else if(n&&Object.keys(n).length>0){if(u.length<2){D(n);return}let c={};Object.entries(n).forEach(([x,B])=>{let A=B.filter(R=>R.question.toLowerCase().includes(u)||R.answer.toLowerCase().includes(u));A.length>0&&(c[x]=A)}),D(c,u)}},300)});let i=document.createElement("span");i.className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-stone-400 dark:text-stone-500 hidden md:block",i.textContent="Press / to search",a.parentElement&&(a.parentElement.style.position="relative",a.parentElement.appendChild(i),a.addEventListener("focus",()=>i.classList.add("hidden")),a.addEventListener("blur",()=>i.classList.remove("hidden")))}function L(a){let s=document.querySelectorAll(".faq-item"),i=document.querySelectorAll(".faq-category"),l=document.getElementById("no-results"),u=0;s.forEach(h=>{let c=h.querySelector(".accordion-toggle span, button span"),x=h.querySelector(".accordion-content"),B=c?c.textContent.toLowerCase():"",A=x?x.textContent.toLowerCase():"";!a||B.includes(a)||A.includes(a)?(h.classList.remove("hidden"),u++):h.classList.add("hidden")}),i.forEach(h=>{let c=h.querySelectorAll(".faq-item:not(.hidden)");h.classList.toggle("hidden",c.length===0)}),l&&l.classList.toggle("hidden",u>0)}function g(){n=[],e=[]}return{init:t,destroy:g}})();window.FAQPage=Ws;$r=Ws});var Gs={};te(Gs,{CategoryCard:()=>Tr});function Tr(n){let e=document.createElement("a");e.href=`/categories/${n.slug}/`,e.className="group block";let t=document.createElement("div");t.className="relative aspect-square rounded-xl overflow-hidden bg-gray-100";let o="";if(typeof n.image_url=="string"&&n.image_url?o=n.image_url:typeof n.image=="string"&&n.image?o=n.image:n.image&&typeof n.image=="object"?o=n.image.url||n.image.src||n.image_url||"":typeof n.banner_image=="string"&&n.banner_image?o=n.banner_image:n.banner_image&&typeof n.banner_image=="object"?o=n.banner_image.url||n.banner_image.src||"":typeof n.hero_image=="string"&&n.hero_image?o=n.hero_image:n.hero_image&&typeof n.hero_image=="object"?o=n.hero_image.url||n.hero_image.src||"":typeof n.thumbnail=="string"&&n.thumbnail?o=n.thumbnail:n.thumbnail&&typeof n.thumbnail=="object"&&(o=n.thumbnail.url||n.thumbnail.src||""),o){let k=document.createElement("img");k.src=o,k.alt=n.name||"",k.className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300",k.loading="lazy",k.decoding="async",k.onerror=I=>{try{k.remove();let H=document.createElement("div");H.className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary-100 to-primary-200",H.innerHTML='<svg class="w-12 h-12 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"/></svg>',t.appendChild(H)}catch{}},t.appendChild(k)}else{let k=document.createElement("div");k.className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary-100 to-primary-200",k.innerHTML='<svg class="w-12 h-12 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"/></svg>',t.appendChild(k)}let m=document.createElement("div");m.className="absolute inset-0 bg-gradient-to-t from-black/30 dark:from-black/60 to-transparent",t.appendChild(m),e.appendChild(t);let v=document.createElement("h3");if(v.className="mt-3 text-sm font-medium text-stone-900 group-hover:text-primary-600 transition-colors text-center dark:text-white",v.textContent=n.name,e.appendChild(v),n.product_count){let k=document.createElement("p");k.className="text-xs text-stone-600 dark:text-white/60 text-center",k.textContent=`${n.product_count} products`,e.appendChild(k)}return e}var Js=X(()=>{});var Ks={};te(Ks,{default:()=>Ir});var Xs,Ir,Zs=X(()=>{Xs=(function(){"use strict";let n=null,e=0,t=null,o=null;async function m(){window.scrollTo(0,0),await Promise.all([M(),S(),w()]),g(),U(),K(),Promise.all([E(),y(),N()]).catch(s=>console.error("Failed to load secondary sections:",s)),setTimeout(()=>{v(),k(),I(),H()},2e3);try{_(),L()}catch(s){console.warn("Failed to load promotions/CTA:",s)}}function v(){let s=document.getElementById("live-visitors");if(!s)return;async function i(){try{let l=await window.ApiClient.get("/analytics/active-visitors/",{}),u=l.data||l;if(e=u.active_visitors||u.count||0,e===0){s.innerHTML="";return}s.innerHTML=`
                    <div class="flex items-center gap-2 px-3 py-1.5 bg-emerald-100 dark:bg-emerald-900/30 rounded-full">
                        <span class="relative flex h-2 w-2">
                            <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                            <span class="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                        </span>
                        <span class="text-xs font-medium text-emerald-700 dark:text-emerald-300">${e} browsing now</span>
                    </div>
                `}catch(l){console.warn("Failed to fetch active visitors:",l),s.innerHTML=""}}i(),setInterval(i,8e3)}function k(){let s=[],i=0,l=0,u=10;async function h(){try{let x=await window.ApiClient.get("/analytics/recent-purchases/",{});if(s=x.data||x.purchases||[],s.length===0)return;setTimeout(()=>{c(),t=setInterval(()=>{l<u?c():clearInterval(t)},3e4)},1e4)}catch(x){console.warn("Failed to fetch recent purchases:",x)}}function c(){if(s.length===0||l>=u)return;let x=s[i];if(!x)return;let B=document.createElement("div");B.className="social-proof-popup fixed bottom-4 left-4 z-50 max-w-xs bg-white dark:bg-stone-800 rounded-xl shadow-2xl border border-stone-200 dark:border-stone-700 p-4 transform translate-y-full opacity-0 transition-all duration-500";let A=`
                <div class="flex items-start gap-3">
                    <div class="w-10 h-10 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center flex-shrink-0">
                        <svg class="w-5 h-5 text-emerald-600 dark:text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>
                    </div>
                    <div>
                        <p class="text-sm font-medium text-stone-900 dark:text-white">${x.message}</p>
                        <p class="text-xs text-stone-400 dark:text-stone-500 mt-1">${x.time_ago}</p>
                    </div>
                </div>
            `;B.innerHTML=`
                ${A}
                <button class="absolute top-2 right-2 text-stone-400 hover:text-stone-600 dark:hover:text-stone-300" onclick="this.parentElement.remove()">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
                </button>
            `,document.body.appendChild(B),l++,requestAnimationFrame(()=>{B.classList.remove("translate-y-full","opacity-0")}),setTimeout(()=>{B.classList.add("translate-y-full","opacity-0"),setTimeout(()=>B.remove(),500)},5e3),i=(i+1)%s.length,l>=u&&t&&clearInterval(t)}h()}function I(){let s=document.getElementById("recently-viewed-section"),i=document.getElementById("recently-viewed"),l=document.getElementById("clear-recently-viewed");if(!s||!i)return;let u=JSON.parse(localStorage.getItem("recentlyViewed")||"[]");if(u.length===0){s.classList.add("hidden");return}s.classList.remove("hidden"),i.innerHTML=u.slice(0,5).map(h=>{let c=null;return h.discount_percent&&h.discount_percent>0&&(c=`-${h.discount_percent}%`),ProductCard.render(h,{showBadge:!!c,badge:c,priceSize:"small"})}).join(""),ProductCard.bindEvents(i),l?.addEventListener("click",()=>{localStorage.removeItem("recentlyViewed"),s.classList.add("hidden"),Toast.success("Recently viewed items cleared")})}function H(){let s=document.getElementById("flash-sale-section"),i=document.getElementById("flash-sale-countdown");if(!s||!i)return;if(!localStorage.getItem("flashSaleEnd")){let c=new Date().getTime()+144e5;localStorage.setItem("flashSaleEnd",c.toString())}let u=parseInt(localStorage.getItem("flashSaleEnd"));function h(){let c=new Date().getTime(),x=u-c;if(x<=0){s.classList.add("hidden"),clearInterval(o),localStorage.removeItem("flashSaleEnd");return}s.classList.remove("hidden");let B=Math.floor(x%(1e3*60*60*24)/(1e3*60*60)),A=Math.floor(x%(1e3*60*60)/(1e3*60)),R=Math.floor(x%(1e3*60)/1e3);i.innerHTML=`
                <div class="flex items-center gap-2 text-white">
                    <span class="text-sm font-medium">Ends in:</span>
                    <div class="flex items-center gap-1">
                        <span class="bg-white/20 px-2 py-1 rounded font-mono font-bold">${B.toString().padStart(2,"0")}</span>
                        <span class="font-bold">:</span>
                        <span class="bg-white/20 px-2 py-1 rounded font-mono font-bold">${A.toString().padStart(2,"0")}</span>
                        <span class="font-bold">:</span>
                        <span class="bg-white/20 px-2 py-1 rounded font-mono font-bold">${R.toString().padStart(2,"0")}</span>
                    </div>
                </div>
            `}h(),o=setInterval(h,1e3)}function U(){let s=document.querySelectorAll("[data-animate]");if(!s.length)return;let i=new IntersectionObserver(l=>{l.forEach(u=>{if(u.isIntersecting){let h=u.target.dataset.animate||"fadeInUp";u.target.classList.add("animate-"+h),u.target.classList.remove("opacity-0"),i.unobserve(u.target)}})},{threshold:.1,rootMargin:"0px 0px -50px 0px"});s.forEach(l=>{l.classList.add("opacity-0"),i.observe(l)})}function K(){document.addEventListener("click",async s=>{let i=s.target.closest("[data-quick-view]");if(!i)return;let l=i.dataset.quickView;if(!l)return;s.preventDefault();let u=document.createElement("div");u.id="quick-view-modal",u.className="fixed inset-0 z-50 flex items-center justify-center p-4",u.innerHTML=`
                <div class="absolute inset-0 bg-black/50 backdrop-blur-sm" onclick="document.getElementById('quick-view-modal').remove()"></div>
                <div class="relative bg-white dark:bg-stone-800 rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-auto">
                    <button class="absolute top-4 right-4 z-10 w-10 h-10 bg-stone-100 dark:bg-stone-700 rounded-full flex items-center justify-center hover:bg-stone-200 dark:hover:bg-stone-600 transition-colors" onclick="document.getElementById('quick-view-modal').remove()">
                        <svg class="w-5 h-5 text-stone-600 dark:text-stone-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
                    </button>
                    <div class="p-8 flex items-center justify-center min-h-[400px]">
                        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
                    </div>
                </div>
            `,document.body.appendChild(u);try{let h=await ProductsApi.getProduct(l),c=h.data||h,x=u.querySelector(".relative");x.innerHTML=`
                    <button class="absolute top-4 right-4 z-10 w-10 h-10 bg-stone-100 dark:bg-stone-700 rounded-full flex items-center justify-center hover:bg-stone-200 dark:hover:bg-stone-600 transition-colors" onclick="document.getElementById('quick-view-modal').remove()">
                        <svg class="w-5 h-5 text-stone-600 dark:text-stone-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
                    </button>
                    <div class="grid md:grid-cols-2 gap-8 p-8">
                        <div class="aspect-square rounded-xl overflow-hidden bg-stone-100 dark:bg-stone-700">
                            <img src="${c.primary_image||c.image||"/static/images/placeholder.jpg"}" alt="${Templates.escapeHtml(c.name)}" class="w-full h-full object-cover">
                        </div>
                        <div class="flex flex-col">
                            <h2 class="text-2xl font-bold text-stone-900 dark:text-white mb-2">${Templates.escapeHtml(c.name)}</h2>
                            <div class="flex items-center gap-2 mb-4">
                                <div class="flex text-amber-400">
                                    ${'<svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.967a1 1 0 00.95.69h4.178c.969 0 1.371 1.24.588 1.81l-3.385 2.46a1 1 0 00-.364 1.118l1.287 3.966c.3.922-.755 1.688-1.54 1.118l-3.385-2.46a1 1 0 00-1.175 0l-3.385 2.46c-.784.57-1.838-.196-1.54-1.118l1.287-3.966a1 1 0 00-.364-1.118l-3.385-2.46c-.783-.57-.38-1.81.588-1.81h4.178a1 1 0 00.95-.69l1.286-3.967z"/></svg>'.repeat(Math.round(c.rating||4))}
                                </div>
                                <span class="text-sm text-stone-500 dark:text-stone-400">(${c.review_count||0} reviews)</span>
                            </div>
                            <div class="mb-6">
                                ${c.sale_price||c.discounted_price?`
                                    <span class="text-3xl font-bold text-primary-600 dark:text-amber-400">${Templates.formatPrice(c.sale_price||c.discounted_price)}</span>
                                    <span class="text-lg text-stone-400 line-through ml-2">${Templates.formatPrice(c.price)}</span>
                                `:`
                                    <span class="text-3xl font-bold text-stone-900 dark:text-white">${Templates.formatPrice(c.price)}</span>
                                `}
                            </div>
                            <p class="text-stone-600 dark:text-stone-400 mb-6 line-clamp-3">${Templates.escapeHtml(c.short_description||c.description||"")}</p>
                            <div class="mt-auto space-y-3">
                                <button class="w-full py-3 px-6 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-xl transition-colors" onclick="CartApi.addItem(${c.id}, 1).then(() => { Toast.success('Added to cart'); document.getElementById('quick-view-modal').remove(); })">
                                    Add to Cart
                                </button>
                                <a href="/products/${c.slug||c.id}/" class="block w-full py-3 px-6 border-2 border-stone-200 dark:border-stone-600 text-stone-700 dark:text-stone-300 font-semibold rounded-xl text-center hover:bg-stone-50 dark:hover:bg-stone-700 transition-colors">
                                    View Full Details
                                </a>
                            </div>
                        </div>
                    </div>
                `}catch(h){console.error("Failed to load product:",h),u.remove(),Toast.error("Failed to load product details")}})}async function N(){let s=document.getElementById("testimonials-grid");if(s){Loader.show(s,"skeleton");try{let i=await ProductsApi.getReviews(null,{pageSize:6,orderBy:"-rating"}),l=i?.data?.results||i?.data||i?.results||[];if(s.innerHTML="",!l.length){s.innerHTML='<p class="text-gray-500 text-center py-8">No user reviews available.</p>';return}l=l.slice(0,6),l.forEach(u=>{let h=document.createElement("div");h.className="rounded-2xl bg-white dark:bg-stone-800 shadow p-6 flex flex-col gap-3",h.innerHTML=`
                        <div class="flex items-center gap-3 mb-2">
                            <div class="w-10 h-10 rounded-full bg-primary-100 dark:bg-stone-700 flex items-center justify-center text-lg font-bold text-primary-700 dark:text-amber-400">
                                ${u.user?.first_name?.[0]||u.user?.username?.[0]||"?"}
                            </div>
                            <div>
                                <div class="font-semibold text-gray-900 dark:text-white">${u.user?.first_name||u.user?.username||"Anonymous"}</div>
                                <div class="text-xs text-gray-500 dark:text-stone-400">${u.created_at?new Date(u.created_at).toLocaleDateString():""}</div>
                            </div>
                        </div>
                        <div class="flex gap-1 mb-1">
                            ${'<svg class="w-4 h-4 text-amber-400" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.967a1 1 0 00.95.69h4.178c.969 0 1.371 1.24.588 1.81l-3.385 2.46a1 1 0 00-.364 1.118l1.287 3.966c.3.922-.755 1.688-1.54 1.118l-3.385-2.46a1 1 0 00-1.175 0l-3.385 2.46c-.784.57-1.838-.196-1.54-1.118l1.287-3.966a1 1 0 00-.364-1.118l-3.385-2.46c-.783-.57-.38-1.81.588-1.81h4.178a1 1 0 00.95-.69l1.286-3.967z"/></svg>'.repeat(Math.round(u.rating||5))}
                        </div>
                        <div class="text-gray-800 dark:text-stone-200 text-base mb-2">${Templates.escapeHtml(u.title||"")}</div>
                        <div class="text-gray-600 dark:text-stone-400 text-sm">${Templates.escapeHtml(u.content||"")}</div>
                    `,s.appendChild(h)})}catch(i){console.error("Failed to load testimonials:",i),s.innerHTML='<p class="text-red-500 text-center py-8">Failed to load reviews. Please try again later.</p>'}}}async function y(){let s=document.getElementById("best-sellers");if(!s)return;let i=s.querySelector(".products-grid")||s;Loader.show(i,"skeleton");try{let l=await ProductsApi.getProducts({bestseller:!0,pageSize:5}),u=l.data?.results||l.data||l.results||[];if(u.length===0){i.innerHTML='<p class="text-gray-500 text-center py-8">No best sellers available.</p>';return}i.innerHTML=u.map(h=>{let c=null;return h.discount_percent&&h.discount_percent>0&&(c=`-${h.discount_percent}%`),ProductCard.render(h,{showBadge:!!c,badge:c,priceSize:"small"})}).join(""),ProductCard.bindEvents(i)}catch(l){console.error("Failed to load best sellers:",l),i.innerHTML='<p class="text-red-500 text-center py-8">Failed to load products. Please try again later.</p>'}}async function M(){let s=document.getElementById("hero-slider");if(s)try{let i=await PagesApi.getBanners("home_hero"),l=i.data?.results||i.data||i.results||[];if(l.length===0){s.innerHTML="";return}s.innerHTML=`
                <div class="relative overflow-hidden w-full h-[55vh] sm:h-[70vh] md:h-[80vh]">
                    <div class="hero-slides relative w-full h-full">
                        ${l.map((u,h)=>`
                            <div class="hero-slide ${h===0?"":"hidden"} w-full h-full" data-index="${h}">
                                <a href="${u.link_url||"#"}" class="block relative w-full h-full">
                                    <img 
                                        src="${u.image}" 
                                        alt="${Templates.escapeHtml(u.title||"")}"
                                        class="absolute inset-0 w-full h-full object-cover"
                                        loading="${h===0?"eager":"lazy"}"
                                        decoding="async"
                                    >
                                    ${u.title||u.subtitle?`
                                        <div class="absolute inset-0 bg-gradient-to-r from-black/60 via-black/30 to-transparent flex items-center">
                                            <div class="px-8 md:px-16 max-w-xl">
                                                ${u.title?`<h2 class="text-2xl sm:text-3xl md:text-5xl font-bold text-white mb-4">${Templates.escapeHtml(u.title)}</h2>`:""}
                                                ${u.subtitle?`<p class="text-sm sm:text-lg text-white/90 mb-6">${Templates.escapeHtml(u.subtitle)}</p>`:""}
                                                ${u.link_text||u.button_text?`
                                                    <span class="inline-flex items-center px-6 py-3 bg-white text-gray-900 font-semibold rounded-lg hover:bg-gray-100 transition-colors">
                                                        ${Templates.escapeHtml(u.link_text||u.button_text)}
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
                            ${l.map((u,h)=>`
                                <button class="w-3 h-3 rounded-full transition-colors ${h===0?"bg-white dark:bg-stone-200":"bg-white/50 dark:bg-stone-600/60 hover:bg-white/75 dark:hover:bg-stone-500/80"}" data-slide="${h}" aria-label="Go to slide ${h+1}"></button>
                            `).join("")}
                        </div>
                    `:""}
                </div>
            `,l.length>1&&D(l.length)}catch(i){console.warn("Hero banners unavailable:",i?.status||i)}}function D(s){let i=0,l=document.querySelectorAll(".hero-slide"),u=document.querySelectorAll(".hero-dots button"),h=document.querySelector(".hero-prev"),c=document.querySelector(".hero-next");function x(A){l[i].classList.add("hidden"),u[i]?.classList.remove("bg-stone-100"),u[i]?.classList.add("bg-white/50"),i=(A+s)%s,l[i].classList.remove("hidden"),u[i]?.classList.add("bg-stone-100"),u[i]?.classList.remove("bg-white/50")}h?.addEventListener("click",()=>{x(i-1),B()}),c?.addEventListener("click",()=>{x(i+1),B()}),u.forEach((A,R)=>{A.addEventListener("click",()=>{x(R),B()})});function B(){n&&clearInterval(n),n=setInterval(()=>x(i+1),5e3)}try{let A=document.querySelector(".hero-slides"),R=0;A?.addEventListener("touchstart",Y=>{R=Y.touches[0].clientX},{passive:!0}),A?.addEventListener("touchend",Y=>{let Z=Y.changedTouches[0].clientX-R;Math.abs(Z)>50&&(Z<0?x(i+1):x(i-1),B())})}catch{}B()}async function S(){let s=document.getElementById("featured-products");if(!s)return;let i=s.querySelector(".products-grid")||s;Loader.show(i,"skeleton");try{let l=await ProductsApi.getFeatured(8),u=l.data?.results||l.data||l.results||[];if(u.length===0){i.innerHTML='<p class="text-gray-500 text-center py-8">No featured products available.</p>';return}i.innerHTML=u.map(h=>{let c=null;return h.discount_percent&&h.discount_percent>0&&(c=`-${h.discount_percent}%`),ProductCard.render(h,{showBadge:!!c,badge:c,priceSize:"small"})}).join(""),ProductCard.bindEvents(i)}catch(l){console.error("Failed to load featured products:",l),i.innerHTML='<p class="text-red-500 text-center py-8">Failed to load products. Please try again later.</p>'}}async function E(){let s=document.getElementById("categories-showcase");if(s){Loader.show(s,"skeleton");try{try{window.ApiClient?.clearCache("/api/v1/catalog/categories/")}catch{}let i=await window.ApiClient.get("/catalog/categories/",{page_size:6,is_featured:!0},{useCache:!1}),l=i.data?.results||i.data||i.results||[];if(l.length===0){s.innerHTML="";return}let u;try{u=(await Promise.resolve().then(()=>(Js(),Gs))).CategoryCard}catch(h){console.error("Failed to import CategoryCard:",h);return}s.innerHTML="",l.forEach(h=>{let c=u(h);try{let x=c.querySelector("img");console.info("[Home] card image for",h.name,x?x.src:"NO_IMAGE")}catch{}s.appendChild(c)}),s.classList.add("grid","grid-cols-2","sm:grid-cols-2","md:grid-cols-3","lg:grid-cols-6","gap-4","lg:gap-6")}catch(i){console.error("Failed to load categories:",i),s.innerHTML=""}}}async function w(){let s=document.getElementById("new-arrivals");if(!s)return;let i=s.querySelector(".products-grid")||s;Loader.show(i,"skeleton");try{let l=await ProductsApi.getNewArrivals(4),u=l.data?.results||l.data||l.results||[];if(u.length===0){i.innerHTML='<p class="text-gray-500 text-center py-8">No new products available.</p>';return}i.innerHTML=u.map(h=>{let c=null;return h.discount_percent&&h.discount_percent>0&&(c=`-${h.discount_percent}%`),ProductCard.render(h,{showBadge:!!c,badge:c,priceSize:"small"})}).join(""),ProductCard.bindEvents(i)}catch(l){console.error("Failed to load new arrivals:",l),i.innerHTML='<p class="text-red-500 text-center py-8">Failed to load products.</p>'}}async function _(){let s=document.getElementById("promotions-banner")||document.getElementById("promotion-banners");if(s)try{let i=await PagesApi.getPromotions(),l=i?.data?.results??i?.results??i?.data??[];if(Array.isArray(l)||(l&&typeof l=="object"?l=Array.isArray(l.items)?l.items:[l]:l=[]),l.length===0){s.innerHTML="";return}let u=l[0]||{};s.innerHTML=`
                <div class="bg-gradient-to-r from-primary-600 to-primary-700 rounded-2xl overflow-hidden">
                    <div class="px-6 py-8 md:px-12 md:py-12 flex flex-col md:flex-row items-center justify-between gap-6">
                        <div class="text-center md:text-left">
                            <span class="inline-block px-3 py-1 bg-white/20 text-white text-sm font-medium rounded-full mb-3">
                                Limited Time Offer
                            </span>
                            <h3 class="text-2xl md:text-3xl font-bold text-white mb-2">
                                ${Templates.escapeHtml(u.title||u.name||"")}
                            </h3>
                            ${u.description?`
                                <p class="text-white/90 max-w-lg">${Templates.escapeHtml(u.description)}</p>
                            `:""}
                            ${u.discount_value?`
                                <p class="text-3xl font-bold text-white mt-4">
                                    ${u.discount_type==="percentage"?`${u.discount_value}% OFF`:`Save ${Templates.formatPrice(u.discount_value)}`}
                                </p>
                            `:""}
                        </div>
                        <div class="flex flex-col items-center gap-4">
                            ${u.code?`
                                <div class="bg-white/10 backdrop-blur-sm px-6 py-3 rounded-lg border-2 border-dashed border-white/30">
                                    <p class="text-sm text-white/80 mb-1">Use code:</p>
                                    <p class="text-2xl font-mono font-bold text-white tracking-wider">${Templates.escapeHtml(u.code)}</p>
                                </div>
                            `:""}
                            <a href="/products/?promotion=${u.id||""}" class="inline-flex items-center px-6 py-3 bg-stone-100 text-primary-600 font-semibold rounded-lg hover:bg-gray-100 transition-colors">
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
        `;let i=window.BUNORAA_ROUTES||{},l=i.preordersWizard||"/preorders/create/",u=i.preordersLanding||"/preorders/";try{let h=[];if(typeof PreordersApi<"u"&&PreordersApi.getCategories)try{let c=await PreordersApi.getCategories({featured:!0,pageSize:4});h=c?.data?.results||c?.data||c?.results||[]}catch(c){console.warn("Pre-order categories unavailable:",c)}s.innerHTML=`
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
                                        ${h.slice(0,4).map(c=>`
                                            <a href="${u}category/${c.slug}/" class="inline-flex items-center gap-2 px-4 py-2 bg-white/10 dark:bg-stone-800/30 hover:bg-white/20 dark:hover:bg-stone-700 rounded-full text-sm text-stone-900 dark:text-white transition-colors">
                                                ${c.icon?`<span>${c.icon}</span>`:""}
                                                ${Templates.escapeHtml(c.name)}
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
                                <a href="${u}" class="inline-flex items-center gap-2 px-8 py-4 bg-transparent text-stone-900 dark:text-white font-semibold rounded-xl border-2 border-stone-200 dark:border-stone-700 hover:bg-stone-100 dark:hover:bg-stone-800 transition-all">
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
            `}}function g(){let s=document.getElementById("newsletter-form")||document.getElementById("newsletter-form-home");s&&s.addEventListener("submit",async i=>{i.preventDefault();let l=s.querySelector('input[type="email"]'),u=s.querySelector('button[type="submit"]'),h=l?.value?.trim();if(!h){Toast.error("Please enter your email address.");return}let c=u.textContent;u.disabled=!0,u.innerHTML='<svg class="animate-spin h-5 w-5 mx-auto" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>';try{await SupportApi.submitContactForm({email:h,type:"newsletter"}),Toast.success("Thank you for subscribing!"),l.value=""}catch(x){Toast.error(x.message||"Failed to subscribe. Please try again.")}finally{u.disabled=!1,u.textContent=c}})}function a(){n&&(clearInterval(n),n=null),t&&(clearInterval(t),t=null),o&&(clearInterval(o),o=null),document.getElementById("quick-view-modal")?.remove(),document.querySelectorAll(".social-proof-popup").forEach(s=>s.remove())}return{init:m,destroy:a,initRecentlyViewed:I,initFlashSaleCountdown:H}})();window.HomePage=Xs;Ir=Xs});var tr={};te(tr,{default:()=>Ar});var er,Ar,sr=X(()=>{er=(function(){"use strict";let n=1,e="all";async function t(){if(!AuthGuard.protectPage())return;let y=o();y?await I(y):(await m(),K())}function o(){let M=window.location.pathname.match(/\/orders\/([^\/]+)/);return M?M[1]:null}async function m(){let y=document.getElementById("orders-list");if(y){Loader.show(y,"skeleton");try{let M={page:n,limit:10};e!=="all"&&(M.status=e);let D=await OrdersApi.getAll(M),S=D.data||[],E=D.meta||{};v(S,E)}catch(M){console.error("Failed to load orders:",M),y.innerHTML='<p class="text-red-500 text-center py-8">Failed to load orders.</p>'}}}function v(y,M){let D=document.getElementById("orders-list");if(!D)return;if(y.length===0){D.innerHTML=`
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
        `,document.getElementById("orders-pagination")?.addEventListener("click",E=>{let w=E.target.closest("[data-page]");w&&(n=parseInt(w.dataset.page),m(),window.scrollTo({top:0,behavior:"smooth"}))})}function k(y){let D={pending:"bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",processing:"bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",shipped:"bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400",delivered:"bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",cancelled:"bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",refunded:"bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400"}[y.status]||"bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400",S=y.items||[],E=S.slice(0,3),w=S.length-3,_=["pending","processing","shipped","delivered"],L=_.indexOf(y.status),g=y.status==="cancelled"||y.status==="refunded";return`
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
                            <div class="absolute left-0 top-1/2 h-1 bg-primary-500 dark:bg-amber-500 -translate-y-1/2 rounded-full transition-all duration-500" style="width: ${Math.max(0,L/(_.length-1)*100)}%"></div>
                            ${_.map((a,s)=>`
                                <div class="relative z-10 flex flex-col items-center">
                                    <div class="w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium ${s<=L?"bg-primary-500 dark:bg-amber-500 text-white":"bg-stone-200 dark:bg-stone-700 text-stone-500 dark:text-stone-400"}">
                                        ${s<L?'<svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/></svg>':s+1}
                                    </div>
                                    <span class="text-xs text-stone-500 dark:text-stone-400 mt-1 capitalize hidden sm:block">${a}</span>
                                </div>
                            `).join("")}
                        </div>
                    </div>
                `}
                
                <div class="p-6">
                    <div class="flex flex-wrap gap-4">
                        ${E.map(a=>`
                            <div class="flex items-center gap-3">
                                <div class="w-16 h-16 bg-gray-100 dark:bg-stone-700 rounded-lg overflow-hidden flex-shrink-0">
                                    ${a.product?.image?`<img src="${a.product.image}" alt="" class="w-full h-full object-cover" onerror="this.parentElement.innerHTML='<div class=\\'w-full h-full flex items-center justify-center text-gray-400 dark:text-stone-500\\'><svg class=\\'w-6 h-6\\' fill=\\'none\\' stroke=\\'currentColor\\' viewBox=\\'0 0 24 24\\'><path stroke-linecap=\\'round\\' stroke-linejoin=\\'round\\' stroke-width=\\'1.5\\' d=\\'M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z\\'/></svg></div>'">`:'<div class="w-full h-full flex items-center justify-center text-gray-400 dark:text-stone-500"><svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg></div>'}
                                </div>
                                <div>
                                    <p class="text-sm font-medium text-gray-900 dark:text-white">${Templates.escapeHtml(a.product?.name||a.product_name)}</p>
                                    <p class="text-sm text-gray-500 dark:text-stone-400">Qty: ${a.quantity}</p>
                                </div>
                            </div>
                        `).join("")}
                        ${w>0?`
                            <div class="flex items-center justify-center w-16 h-16 bg-gray-100 dark:bg-stone-700 rounded-lg">
                                <span class="text-sm text-gray-500 dark:text-stone-400">+${w}</span>
                            </div>
                        `:""}
                    </div>
                    <div class="mt-4 pt-4 border-t border-gray-100 flex justify-between items-center">
                        <p class="text-sm text-gray-600">
                            ${S.length} ${S.length===1?"item":"items"}
                        </p>
                        <p class="font-semibold text-gray-900">Total: ${Templates.formatPrice(y.total)}</p>
                    </div>
                </div>
            </div>
        `}async function I(y){let M=document.getElementById("order-detail");if(M){Loader.show(M,"skeleton");try{let S=(await OrdersApi.getById(y)).data;if(!S){window.location.href="/orders/";return}H(S)}catch(D){console.error("Failed to load order:",D),M.innerHTML='<p class="text-red-500 text-center py-8">Failed to load order details.</p>'}}}function H(y){let M=document.getElementById("order-detail");if(!M)return;let S={pending:"bg-yellow-100 text-yellow-700",processing:"bg-blue-100 text-blue-700",shipped:"bg-indigo-100 text-indigo-700",delivered:"bg-green-100 text-green-700",cancelled:"bg-red-100 text-red-700",refunded:"bg-gray-100 text-gray-700"}[y.status]||"bg-gray-100 text-gray-700",E=y.items||[];M.innerHTML=`
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
                        <span class="px-4 py-1.5 rounded-full text-sm font-medium ${S}">
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
                                ${y.timeline.map((w,_)=>`
                                    <div class="relative pl-8">
                                        <div class="absolute left-0 w-4 h-4 rounded-full ${_===0?"bg-primary-600":"bg-gray-300"}"></div>
                                        <p class="text-sm font-medium text-gray-900">${Templates.escapeHtml(w.status)}</p>
                                        <p class="text-xs text-gray-500">${Templates.formatDate(w.timestamp,{includeTime:!0})}</p>
                                        ${w.note?`<p class="text-sm text-gray-600 mt-1">${Templates.escapeHtml(w.note)}</p>`:""}
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
                        ${E.map(w=>`
                            <div class="flex gap-4">
                                <div class="w-20 h-20 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                                    ${w.product?.image?`<img src="${w.product.image}" alt="" class="w-full h-full object-cover" onerror="this.style.display='none'">`:""}
                                </div>
                                <div class="flex-1">
                                    <div class="flex justify-between">
                                        <div>
                                            <h3 class="font-medium text-gray-900">${Templates.escapeHtml(w.product?.name||w.product_name)}</h3>
                                            ${w.variant?`<p class="text-sm text-gray-500">${Templates.escapeHtml(w.variant.name||w.variant_name)}</p>`:""}
                                            <p class="text-sm text-gray-500">Qty: ${w.quantity}</p>
                                        </div>
                                        <p class="font-medium text-gray-900">${Templates.formatPrice(w.price*w.quantity)}</p>
                                    </div>
                                    ${w.product?.slug?`
                                        <a href="/products/${w.product.slug}/" class="text-sm text-primary-600 hover:text-primary-700 mt-2 inline-block">
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
        `,U(y)}function U(y){let M=document.getElementById("reorder-btn"),D=document.getElementById("cancel-order-btn"),S=document.getElementById("print-invoice-btn");M?.addEventListener("click",async()=>{try{await OrdersApi.reorder(y.id),Toast.success("Items added to cart!"),document.dispatchEvent(new CustomEvent("cart:updated")),window.location.href="/cart/"}catch(E){Toast.error(E.message||"Failed to reorder.")}}),D?.addEventListener("click",async()=>{if(await Modal.confirm({title:"Cancel Order",message:"Are you sure you want to cancel this order? This action cannot be undone.",confirmText:"Cancel Order",cancelText:"Keep Order"}))try{await OrdersApi.cancel(y.id),Toast.success("Order cancelled."),window.location.reload()}catch(w){Toast.error(w.message||"Failed to cancel order.")}}),S?.addEventListener("click",()=>{window.print()})}function K(){let y=document.querySelectorAll("[data-filter-status]");y.forEach(M=>{M.addEventListener("click",()=>{y.forEach(D=>{D.classList.remove("bg-primary-100","text-primary-700"),D.classList.add("text-gray-600")}),M.classList.add("bg-primary-100","text-primary-700"),M.classList.remove("text-gray-600"),e=M.dataset.filterStatus,n=1,m()})})}function N(){n=1,e="all"}return{init:t,destroy:N}})();window.OrdersPage=er;Ar=er});var rr=gt(()=>{var Br=(function(){"use strict";let n=window.BUNORAA_ROUTES||{},e=n.preordersWizard||"/preorders/create/",t=n.preordersLanding||"/preorders/";async function o(){await Promise.all([m(),k(),I()])}async function m(){let S=document.getElementById("preorder-categories");if(S)try{let E=await PreordersApi.getCategories({featured:!0,pageSize:8}),w=E?.data?.results||E?.data||E?.results||[];if(w.length===0){S.innerHTML=`
                    <div class="col-span-full text-center py-12">
                        <svg class="w-16 h-16 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" 
                                  d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/>
                        </svg>
                        <p class="text-gray-600 dark:text-gray-400 mb-4">No categories available at the moment</p>
                        <p class="text-sm text-gray-500 dark:text-gray-500">Check back soon or contact us for custom requests</p>
                    </div>
                `;return}S.innerHTML=w.map(_=>v(_)).join("")}catch(E){console.error("Failed to load pre-order categories:",E),S.innerHTML=`
                <div class="col-span-full text-center py-12">
                    <svg class="w-16 h-16 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" 
                              d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/>
                    </svg>
                    <p class="text-gray-600 dark:text-gray-400">No categories available at the moment</p>
                </div>
            `}}function v(S){let E=S.image?.url||S.image||S.thumbnail||"",w=E&&E.length>0,_=Templates?.escapeHtml||(g=>g),L=Templates?.formatPrice||(g=>`${window.BUNORAA_CURRENCY?.symbol||"\u09F3"}${g}`);return`
            <a href="${t}category/${S.slug}/" 
               class="group bg-white dark:bg-gray-800 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-200 dark:border-gray-700">
                ${w?`
                    <div class="aspect-video relative overflow-hidden">
                        <img src="${E}" alt="${_(S.name)}" 
                             class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                             loading="lazy">
                        <div class="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                    </div>
                `:`
                    <div class="aspect-video bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center">
                        ${S.icon?`<span class="text-5xl">${S.icon}</span>`:`
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
                            ${_(S.name)}
                        </h3>
                        ${S.icon?`<span class="text-2xl">${S.icon}</span>`:""}
                    </div>
                    
                    ${S.description?`
                        <p class="text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
                            ${_(S.description)}
                        </p>
                    `:""}
                    
                    <div class="flex items-center justify-between text-sm">
                        ${S.base_price?`
                            <span class="text-gray-500 dark:text-gray-500">
                                Starting from <span class="font-semibold text-purple-600">${L(S.base_price)}</span>
                            </span>
                        `:"<span></span>"}
                        ${S.min_production_days&&S.max_production_days?`
                            <span class="text-gray-500 dark:text-gray-500">
                                ${S.min_production_days}-${S.max_production_days} days
                            </span>
                        `:""}
                    </div>
                    
                    <div class="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700 flex items-center justify-between">
                        <div class="flex gap-2 flex-wrap">
                            ${S.requires_design?`
                                <span class="text-xs px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full">
                                    Design Required
                                </span>
                            `:""}
                            ${S.allow_rush_order?`
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
        `}async function k(){let S=document.getElementById("preorder-templates");S&&S.closest("section")?.classList.add("hidden")}async function I(){let S=document.getElementById("preorder-stats");if(!S)return;let E={totalOrders:"500+",happyCustomers:"450+",avgRating:"4.9"};S.innerHTML=`
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
        `}async function H(S){let E=document.getElementById("category-options");if(!(!E||!S))try{let w=await PreordersApi.getCategory(S),_=await PreordersApi.getCategoryOptions(w.id);U(E,_)}catch(w){console.error("Failed to load category options:",w)}}function U(S,E){if(!E||E.length===0){S.innerHTML='<p class="text-gray-500">No customization options available.</p>';return}S.innerHTML=E.map(w=>`
            <div class="border border-gray-200 dark:border-gray-700 rounded-xl p-4">
                <h4 class="font-semibold text-gray-900 dark:text-white mb-2">${Templates.escapeHtml(w.name)}</h4>
                ${w.description?`<p class="text-sm text-gray-600 dark:text-gray-400 mb-3">${Templates.escapeHtml(w.description)}</p>`:""}
                <div class="space-y-2">
                    ${w.choices?.map(_=>`
                        <label class="flex items-center gap-3 p-3 border border-gray-200 dark:border-gray-600 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                            <input type="${w.allow_multiple?"checkbox":"radio"}" name="option_${w.id}" value="${_.id}" class="text-purple-600 focus:ring-purple-500">
                            <span class="flex-1">
                                <span class="font-medium text-gray-900 dark:text-white">${Templates.escapeHtml(_.name)}</span>
                                ${_.price_modifier&&_.price_modifier!=="0.00"?`
                                    <span class="text-sm text-purple-600 dark:text-purple-400 ml-2">+${Templates.formatPrice(_.price_modifier)}</span>
                                `:""}
                            </span>
                        </label>
                    `).join("")||""}
                </div>
            </div>
        `).join("")}async function K(){let S=document.getElementById("my-preorders-list");if(S){Loader.show(S,"skeleton");try{let E=await PreordersApi.getMyPreorders(),w=E?.data?.results||E?.data||E?.results||[];if(w.length===0){S.innerHTML=`
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
                `;return}S.innerHTML=w.map(_=>N(_)).join("")}catch(E){console.error("Failed to load pre-orders:",E),S.innerHTML=`
                <div class="text-center py-12">
                    <p class="text-red-500">Failed to load your orders. Please try again.</p>
                </div>
            `}}}function N(S){let E={pending:"bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",quoted:"bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",accepted:"bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-400",in_progress:"bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400",review:"bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400",approved:"bg-teal-100 text-teal-800 dark:bg-teal-900/30 dark:text-teal-400",completed:"bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",cancelled:"bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",refunded:"bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400"},w={pending:"Pending Review",quoted:"Quote Sent",accepted:"Quote Accepted",in_progress:"In Progress",review:"Under Review",approved:"Approved",completed:"Completed",cancelled:"Cancelled",refunded:"Refunded"},_=E[S.status]||"bg-gray-100 text-gray-800",L=w[S.status]||S.status;return`
            <a href="${t}order/${S.preorder_number}/" class="block bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 hover:shadow-lg transition-shadow">
                <div class="flex items-start justify-between gap-4 mb-4">
                    <div>
                        <p class="text-sm text-gray-500 dark:text-gray-400">${S.preorder_number}</p>
                        <h3 class="text-lg font-semibold text-gray-900 dark:text-white">${Templates.escapeHtml(S.title||S.category?.name||"Custom Order")}</h3>
                    </div>
                    <span class="px-3 py-1 text-xs font-medium rounded-full ${_}">${L}</span>
                </div>
                ${S.description?`
                    <p class="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-2">${Templates.escapeHtml(S.description)}</p>
                `:""}
                <div class="flex items-center justify-between text-sm">
                    <span class="text-gray-500 dark:text-gray-400">
                        ${new Date(S.created_at).toLocaleDateString()}
                    </span>
                    ${S.final_price||S.estimated_price?`
                        <span class="font-semibold text-purple-600 dark:text-purple-400">
                            ${Templates.formatPrice(S.final_price||S.estimated_price)}
                        </span>
                    `:""}
                </div>
            </a>
        `}async function y(S){S&&await Promise.all([M(S),D(S)])}async function M(S){if(document.getElementById("preorder-status"))try{let w=await PreordersApi.getPreorderStatus(S)}catch{}}function D(S){let E=document.getElementById("message-form");E&&E.addEventListener("submit",async w=>{w.preventDefault();let _=E.querySelector('textarea[name="message"]'),L=E.querySelector('button[type="submit"]'),g=_?.value?.trim();if(!g){Toast.error("Please enter a message");return}let a=L.innerHTML;L.disabled=!0,L.innerHTML='<svg class="animate-spin h-5 w-5 mx-auto" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>';try{await PreordersApi.sendMessage(S,g),Toast.success("Message sent successfully"),_.value="",location.reload()}catch(s){Toast.error(s.message||"Failed to send message")}finally{L.disabled=!1,L.innerHTML=a}})}return{initLanding:o,initCategoryDetail:H,initMyPreorders:K,initDetail:y,loadFeaturedCategories:m,renderCategoryCard:v,renderPreorderCard:N}})();window.PreordersPage=Br});var nr={};te(nr,{default:()=>_r});var ar,_r,or=X(()=>{ar=(function(){"use strict";let n=null,e=null,t=null,o=!1,m=!1,v=!1,k=null;async function I(){if(o)return;o=!0;let r=document.getElementById("product-detail");if(!r)return;let d=r.querySelector("h1")||r.dataset.productId;if(m=!!d,d){n={id:r.dataset.productId,slug:r.dataset.productSlug},_(),H();return}let p=l();if(!p){window.location.href="/products/";return}await u(p),H()}function H(){U(),K(),N(),y(),M(),D(),S(),E(),w()}function U(){let r=document.getElementById("main-product-image")||document.getElementById("main-image"),d=r?.parentElement;if(!r||!d)return;let p=document.createElement("div");p.className="zoom-lens absolute w-32 h-32 border-2 border-primary-500 bg-white/30 pointer-events-none opacity-0 transition-opacity duration-200 z-10",p.style.backgroundRepeat="no-repeat";let b=document.createElement("div");b.className="zoom-result fixed right-8 top-1/2 -translate-y-1/2 w-96 h-96 border border-stone-200 dark:border-stone-700 rounded-xl shadow-2xl bg-white dark:bg-stone-800 opacity-0 pointer-events-none transition-opacity duration-200 z-50 hidden lg:block",b.style.backgroundRepeat="no-repeat",d.classList.add("relative"),d.appendChild(p),document.body.appendChild(b),d.addEventListener("mouseenter",()=>{window.innerWidth<1024||(p.classList.remove("opacity-0"),b.classList.remove("opacity-0"),v=!0)}),d.addEventListener("mouseleave",()=>{p.classList.add("opacity-0"),b.classList.add("opacity-0"),v=!1}),d.addEventListener("mousemove",C=>{if(!v||window.innerWidth<1024)return;let $=d.getBoundingClientRect(),W=C.clientX-$.left,ee=C.clientY-$.top,oe=W-p.offsetWidth/2,de=ee-p.offsetHeight/2;p.style.left=`${Math.max(0,Math.min($.width-p.offsetWidth,oe))}px`,p.style.top=`${Math.max(0,Math.min($.height-p.offsetHeight,de))}px`;let me=3,Ae=-W*me+b.offsetWidth/2,f=-ee*me+b.offsetHeight/2;b.style.backgroundImage=`url(${r.src})`,b.style.backgroundSize=`${$.width*me}px ${$.height*me}px`,b.style.backgroundPosition=`${Ae}px ${f}px`})}function K(){let r=document.getElementById("size-guide-btn");r&&r.addEventListener("click",()=>{let d=document.createElement("div");d.id="size-guide-modal",d.className="fixed inset-0 z-50 flex items-center justify-center p-4",d.innerHTML=`
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
            `,document.body.appendChild(d)})}function N(){let r=document.getElementById("stock-alert-btn");r&&r.addEventListener("click",()=>{if(!document.getElementById("product-detail")?.dataset.productId)return;let p=document.createElement("div");p.id="stock-alert-modal",p.className="fixed inset-0 z-50 flex items-center justify-center p-4",p.innerHTML=`
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
            `,document.body.appendChild(p),document.getElementById("stock-alert-form")?.addEventListener("submit",async b=>{b.preventDefault();let C=document.getElementById("stock-alert-email")?.value;if(C)try{k=C,Toast.success("You will be notified when this product is back in stock!"),p.remove()}catch{Toast.error("Failed to subscribe. Please try again.")}})})}function y(){document.querySelectorAll(".share-btn").forEach(r=>{r.addEventListener("click",()=>{let d=r.dataset.platform,p=encodeURIComponent(window.location.href),b=encodeURIComponent(document.title),C=document.querySelector("h1")?.textContent||"",$={facebook:`https://www.facebook.com/sharer/sharer.php?u=${p}`,twitter:`https://twitter.com/intent/tweet?url=${p}&text=${encodeURIComponent(C)}`,pinterest:`https://pinterest.com/pin/create/button/?url=${p}&description=${encodeURIComponent(C)}`,whatsapp:`https://api.whatsapp.com/send?text=${encodeURIComponent(C+" "+window.location.href)}`,copy:null};d==="copy"?navigator.clipboard.writeText(window.location.href).then(()=>{Toast.success("Link copied to clipboard!")}).catch(()=>{Toast.error("Failed to copy link")}):$[d]&&window.open($[d],"_blank","width=600,height=400")})})}function M(){let r=document.getElementById("qa-section");if(!r||!document.getElementById("product-detail")?.dataset.productId)return;let p=[{question:"Is this product machine washable?",answer:"Yes, we recommend washing on a gentle cycle with cold water.",askedBy:"John D.",date:"2 days ago"},{question:"What materials is this made from?",answer:"This product is crafted from 100% organic cotton sourced from sustainable farms.",askedBy:"Sarah M.",date:"1 week ago"}];r.innerHTML=`
            <div class="space-y-6">
                <div class="flex items-center justify-between">
                    <h3 class="text-lg font-semibold text-stone-900 dark:text-white">Questions & Answers</h3>
                    <button id="ask-question-btn" class="text-sm font-medium text-primary-600 dark:text-amber-400 hover:underline">Ask a Question</button>
                </div>
                <div id="qa-list" class="space-y-4">
                    ${p.map(b=>`
                        <div class="bg-stone-50 dark:bg-stone-700/50 rounded-xl p-4">
                            <div class="flex items-start gap-3 mb-2">
                                <span class="text-primary-600 dark:text-amber-400 font-bold">Q:</span>
                                <div>
                                    <p class="text-stone-900 dark:text-white font-medium">${Templates.escapeHtml(b.question)}</p>
                                    <p class="text-xs text-stone-500 dark:text-stone-400 mt-1">${b.askedBy} \u2022 ${b.date}</p>
                                </div>
                            </div>
                            ${b.answer?`
                                <div class="flex items-start gap-3 mt-3 pl-6">
                                    <span class="text-emerald-600 dark:text-emerald-400 font-bold">A:</span>
                                    <p class="text-stone-600 dark:text-stone-300">${Templates.escapeHtml(b.answer)}</p>
                                </div>
                            `:""}
                        </div>
                    `).join("")}
                </div>
            </div>
        `,document.getElementById("ask-question-btn")?.addEventListener("click",()=>{let b=document.createElement("div");b.id="ask-question-modal",b.className="fixed inset-0 z-50 flex items-center justify-center p-4",b.innerHTML=`
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
            `,document.body.appendChild(b),document.getElementById("question-form")?.addEventListener("submit",C=>{C.preventDefault(),Toast.success("Your question has been submitted!"),b.remove()})})}function D(){let r=document.getElementById("delivery-estimate");if(!r)return;let d=new Date,p=3,b=7,C=new Date(d.getTime()+p*24*60*60*1e3),$=new Date(d.getTime()+b*24*60*60*1e3),W=ee=>ee.toLocaleDateString("en-US",{weekday:"short",month:"short",day:"numeric"});r.innerHTML=`
            <div class="flex items-start gap-3 p-4 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl">
                <svg class="w-5 h-5 text-emerald-600 dark:text-emerald-400 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"/>
                </svg>
                <div>
                    <p class="text-sm font-medium text-emerald-700 dark:text-emerald-300">Estimated Delivery</p>
                    <p class="text-emerald-600 dark:text-emerald-400 font-semibold">${W(C)} - ${W($)}</p>
                    <p class="text-xs text-emerald-600 dark:text-emerald-400 mt-1">Free shipping on orders over $50</p>
                </div>
            </div>
        `}function S(){let r=document.getElementById("product-detail")?.dataset.productId,d=document.getElementById("product-detail")?.dataset.productSlug,p=document.querySelector("h1")?.textContent,b=document.getElementById("main-product-image")?.src||document.getElementById("main-image")?.src,C=document.getElementById("product-price")?.textContent;if(!r)return;let $=JSON.parse(localStorage.getItem("recentlyViewed")||"[]"),W=$.findIndex(ee=>ee.id===r);W>-1&&$.splice(W,1),$.unshift({id:r,slug:d,name:p,image:b,price:C,viewedAt:new Date().toISOString()}),localStorage.setItem("recentlyViewed",JSON.stringify($.slice(0,20)))}function E(){if(document.getElementById("mobile-sticky-atc")||document.getElementById("mobile-sticky-atc-js")||window.innerWidth>=1024)return;let d=n;if(!d)return;let p=document.createElement("div");p.id="mobile-sticky-atc-enhanced",p.className="fixed bottom-0 inset-x-0 z-40 lg:hidden bg-white dark:bg-stone-800 border-t border-stone-200 dark:border-stone-700 shadow-2xl p-3 transform translate-y-full transition-transform duration-300",p.innerHTML=`
            <div class="flex items-center gap-3">
                <div class="flex-1 min-w-0">
                    <p class="text-xs text-stone-500 dark:text-stone-400 truncate">${d.name||""}</p>
                    <p class="font-bold text-stone-900 dark:text-white">${d.sale_price?Templates.formatPrice(d.sale_price):Templates.formatPrice(d.price||0)}</p>
                </div>
                <button id="sticky-add-to-cart" class="px-6 py-3 bg-primary-600 dark:bg-amber-600 text-white font-semibold rounded-xl hover:bg-primary-700 dark:hover:bg-amber-700 transition-colors">
                    Add to Cart
                </button>
            </div>
        `,document.body.appendChild(p);let b=document.getElementById("add-to-cart-btn");b&&new IntersectionObserver($=>{$.forEach(W=>{W.isIntersecting?p.classList.add("translate-y-full"):p.classList.remove("translate-y-full")})},{threshold:0}).observe(b),document.getElementById("sticky-add-to-cart")?.addEventListener("click",()=>{document.getElementById("add-to-cart-btn")?.click()})}function w(){document.querySelectorAll("[data-video-url]").forEach(d=>{d.addEventListener("click",()=>{let p=d.dataset.videoUrl;if(!p)return;let b=document.createElement("div");b.id="video-player-modal",b.className="fixed inset-0 z-50 flex items-center justify-center bg-black/90",b.innerHTML=`
                    <button onclick="document.getElementById('video-player-modal').remove()" class="absolute top-4 right-4 w-12 h-12 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-colors">
                        <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
                    </button>
                    <video controls autoplay class="max-w-full max-h-[90vh] rounded-xl">
                        <source src="${p}" type="video/mp4">
                        Your browser does not support video playback.
                    </video>
                `,document.body.appendChild(b)})})}function _(){A(),g(),a(),r();async function r(){let d=document.getElementById("add-to-wishlist-btn");if(!d)return;let p=document.getElementById("product-detail")?.dataset.productId;if(p&&!(typeof WishlistApi>"u"))try{let b=await WishlistApi.getWishlist({pageSize:100});b.success&&b.data?.items&&(b.data.items.some($=>$.product_id===p||$.product===p)?(d.querySelector("svg")?.setAttribute("fill","currentColor"),d.classList.add("text-red-500")):(d.querySelector("svg")?.setAttribute("fill","none"),d.classList.remove("text-red-500")))}catch{}}s(),i(),ue(),L()}function L(){let r=document.querySelectorAll(".tab-btn"),d=document.querySelectorAll(".tab-content");r.forEach(p=>{p.addEventListener("click",()=>{let b=p.dataset.tab;r.forEach(C=>{C.classList.remove("border-primary-500","text-primary-600"),C.classList.add("border-transparent","text-gray-500")}),p.classList.add("border-primary-500","text-primary-600"),p.classList.remove("border-transparent","text-gray-500"),d.forEach(C=>{C.id===`${b}-tab`?C.classList.remove("hidden"):C.classList.add("hidden")})})})}function g(){let r=document.getElementById("add-to-cart-btn");r&&r.addEventListener("click",async()=>{let d=document.getElementById("product-detail")?.dataset.productId,p=parseInt(document.getElementById("quantity")?.value)||1,C=!!document.querySelector('input[name="variant"]'),$=document.querySelector('input[name="variant"]:checked')?.value;if(!d)return;if(C&&!$){Toast.warning("Please select a variant before adding to cart.");return}r.disabled=!0;let W=r.innerHTML;r.innerHTML='<svg class="animate-spin h-5 w-5 mx-auto" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>';try{await CartApi.addItem(d,p,$||null),Toast.success("Added to cart!"),document.dispatchEvent(new CustomEvent("cart:updated"))}catch(ee){Toast.error(ee.message||"Failed to add to cart.")}finally{r.disabled=!1,r.innerHTML=W}})}function a(){let r=document.getElementById("add-to-wishlist-btn");r&&r.addEventListener("click",async()=>{let d=document.getElementById("product-detail")?.dataset.productId;if(d){if(typeof AuthApi<"u"&&!AuthApi.isAuthenticated()){Toast.warning("Please login to add items to your wishlist."),window.location.href="/account/login/?next="+encodeURIComponent(window.location.pathname);return}try{let p=!1;if(typeof WishlistApi<"u"){let b=await WishlistApi.getWishlist({pageSize:100});b.success&&b.data?.items&&(p=b.data.items.some(C=>C.product_id===d||C.product===d))}if(p){let C=(await WishlistApi.getWishlist({pageSize:100})).data.items.find($=>$.product_id===d||$.product===d);C&&(await WishlistApi.removeItem(C.id),Toast.success("Removed from wishlist!"),r.querySelector("svg")?.setAttribute("fill","none"),r.classList.remove("text-red-500"),r.setAttribute("aria-pressed","false"))}else await WishlistApi.addItem(d),Toast.success("Added to wishlist!"),r.querySelector("svg")?.setAttribute("fill","currentColor"),r.classList.add("text-red-500"),r.setAttribute("aria-pressed","true")}catch(p){Toast.error(p.message||"Wishlist action failed.")}}})}function s(){document.querySelectorAll('input[name="variant"]').forEach(d=>{d.addEventListener("change",()=>{e=d.value;let p=d.dataset.price,b=parseInt(d.dataset.stock||"0");if(p){let oe=document.getElementById("product-price");oe&&window.Templates?.formatPrice&&(oe.textContent=window.Templates.formatPrice(parseFloat(p)))}let C=document.getElementById("stock-status"),$=document.getElementById("add-to-cart-btn"),W=document.getElementById("mobile-stock"),ee=document.getElementById("mobile-add-to-cart");C&&(b>10?C.innerHTML='<span class="text-green-600">In Stock</span>':b>0?C.innerHTML=`<span class="text-orange-500">Only ${b} left</span>`:C.innerHTML='<span class="text-red-600">Out of Stock</span>'),$&&($.disabled=b<=0),ee&&(ee.disabled=b<=0),W&&(W.textContent=b>0?b>10?"In stock":`${b} available`:"Out of stock")})})}function i(){document.getElementById("main-image")?.addEventListener("click",()=>{})}function l(){let d=window.location.pathname.match(/\/products\/([^\/]+)/);return d?d[1]:null}async function u(r){let d=document.getElementById("product-detail");if(d){Loader.show(d,"skeleton");try{if(n=(await ProductsApi.getProduct(r)).data,!n){window.location.href="/404/";return}document.title=`${n.name} | Bunoraa`,h(n),be(n),fe(n),await Promise.all([ie(n),re(n),ge(n),we(n)]),ke(),Ce(n)}catch(p){console.error("Failed to load product:",p),d.innerHTML='<p class="text-red-500 text-center py-8">Failed to load product. Please try again.</p>'}}}document.addEventListener("currency:changed",async r=>{try{!m&&n&&n.slug?await u(n.slug):location.reload()}catch{}});function h(r){let d=document.getElementById("product-detail");if(!d)return;let p=r.images||[],b=r.image||p[0]?.image||"",C=r.variants&&r.variants.length>0,$=r.stock_quantity>0||r.in_stock,W=r.sale_price&&r.sale_price<r.price;d.innerHTML=`
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
                <!-- Gallery -->
                <div id="product-gallery" class="product-gallery">
                    <div class="main-image-container relative rounded-xl overflow-hidden bg-gray-100" style="aspect-ratio: ${r?.aspect?.css||"1/1"};">
                        <img 
                            src="${b}" 
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
                        ${$?"":`
                            <span class="absolute top-4 right-4 px-3 py-1 bg-gray-900 text-white text-sm font-medium rounded-full">
                                Out of Stock
                            </span>
                        `}
                    </div>
                    ${p.length>1?`
                        <div class="thumbnails flex gap-2 mt-4 overflow-x-auto pb-2">
                            ${p.map((ee,oe)=>`
                                <button 
                                    class="thumbnail flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 ${oe===0?"border-primary-500":"border-transparent"} hover:border-primary-500 transition-colors"
                                    data-image="${ee.image}"
                                    data-index="${oe}"
                                >
                                    <img src="${ee.image}" alt="" loading="lazy" decoding="async" class="w-full h-full object-cover">
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
                    ${C?x(r.variants):""}

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
                                    ${r.tags.map(ee=>`
                                        <a href="/products/?tag=${ee.slug}" class="px-2 py-0.5 bg-gray-100 text-gray-600 rounded hover:bg-gray-200 transition-colors">
                                            ${Templates.escapeHtml(ee.name)}
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
                                    ${Object.entries(r.specifications).map(([ee,oe])=>`
                                        <tr class="border-b border-gray-100">
                                            <td class="py-3 text-sm font-medium text-gray-500 w-1/3">${Templates.escapeHtml(ee)}</td>
                                            <td class="py-3 text-sm text-gray-900">${Templates.escapeHtml(String(oe))}</td>
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
        `,B(),A(),R(),Y(),Z(),G(),Tabs.init(),c(r)}function c(r){let d=document.getElementById("mobile-sticky-atc-js");if(d){let p=d.querySelector(".font-semibold");p&&(p.innerHTML=r.sale_price?Templates.formatPrice(r.sale_price)+' <span class="text-sm line-through text-gray-400">'+Templates.formatPrice(r.price)+"</span>":Templates.formatPrice(r.price));let b=document.getElementById("mobile-stock-js");b&&(b.textContent=r.stock_quantity>0?r.stock_quantity>10?"In stock":r.stock_quantity+" available":"Out of stock");let C=document.getElementById("mobile-add-to-cart-js");C&&(C.disabled=r.stock_quantity<=0)}else{d=document.createElement("div"),d.id="mobile-sticky-atc-js",d.className="fixed inset-x-4 bottom-4 z-40 lg:hidden",d.innerHTML=`
                <div class="bg-white shadow-lg rounded-xl p-3 flex items-center gap-3">
                    <div class="flex-1">
                        <div class="text-sm text-gray-500">${r.sale_price?"Now":""}</div>
                        <div class="font-semibold text-lg ${r.sale_price?"text-red-600":""}">${r.sale_price?Templates.formatPrice(r.sale_price)+' <span class="text-sm line-through text-gray-400">'+Templates.formatPrice(r.price)+"</span>":Templates.formatPrice(r.price)}</div>
                        <div id="mobile-stock-js" class="text-xs text-gray-500">${r.stock_quantity>0?r.stock_quantity>10?"In stock":r.stock_quantity+" available":"Out of stock"}</div>
                    </div>
                    ${r.stock_quantity>0?'<button id="mobile-add-to-cart-js" class="bg-primary-600 text-white px-4 py-2 rounded-lg font-semibold">Add</button>':'<button class="bg-gray-300 text-gray-500 px-4 py-2 rounded-lg font-semibold cursor-not-allowed" disabled>Out</button>'}
                </div>
            `,document.body.appendChild(d);let p=document.getElementById("mobile-add-to-cart-js");p&&p.addEventListener("click",()=>document.getElementById("add-to-cart-btn")?.click())}}function x(r){let d={};return r.forEach(p=>{d[p.attribute_name]||(d[p.attribute_name]=[]),d[p.attribute_name].push(p)}),Object.entries(d).map(([p,b])=>`
            <div class="mt-6">
                <label class="text-sm font-medium text-gray-700">${Templates.escapeHtml(p)}:</label>
                <div class="flex flex-wrap gap-2 mt-2" role="radiogroup" aria-label="${Templates.escapeHtml(p)}">
                    ${b.map((C,$)=>`
                        <button 
                            class="variant-btn px-4 py-2 border rounded-lg text-sm transition-colors ${$===0?"border-primary-500 bg-primary-50 text-primary-700":"border-gray-300 hover:border-gray-400"}"
                            role="radio"
                            aria-checked="${$===0?"true":"false"}"
                            data-variant-id="${C.id}"
                            data-price="${C.price_converted??C.price??""}"
                            data-stock="${C.stock_quantity||0}"
                            tabindex="0"
                        >
                            ${Templates.escapeHtml(C.value)}
                            ${(C.price_converted??C.price)&&C.price!==n.price?`
                                <span class="text-xs text-gray-500">(${Templates.formatPrice(C.price_converted??C.price)})</span>
                            `:""}
                        </button>
                    `).join("")}
                </div>
            </div>
        `).join("")}function B(){let r=document.querySelectorAll(".thumbnail"),d=document.getElementById("main-product-image"),p=0;r.forEach((b,C)=>{b.setAttribute("tabindex","0"),b.addEventListener("click",()=>{r.forEach($=>$.classList.remove("border-primary-500")),b.classList.add("border-primary-500"),d.src=b.dataset.image||b.dataset.src,p=C}),b.addEventListener("keydown",$=>{if($.key==="Enter"||$.key===" ")$.preventDefault(),b.click();else if($.key==="ArrowRight"){$.preventDefault();let W=r[(C+1)%r.length];W.focus(),W.click()}else if($.key==="ArrowLeft"){$.preventDefault();let W=r[(C-1+r.length)%r.length];W.focus(),W.click()}})}),d?.addEventListener("click",()=>{let b=n.images?.map(ee=>ee.image)||[n.image],C=parseInt(document.querySelector(".thumbnail.border-primary-500")?.dataset.index)||0,W=(n.images||[]).map(ee=>({type:ee.type||(ee.video_url?"video":"image"),src:ee.video_url||ee.model_url||ee.image})).map(ee=>{if(ee.type==="video")return`<div class="w-full h-full max-h-[70vh]"><video controls class="w-full h-full object-contain"><source src="${ee.src}" type="video/mp4">Your browser does not support video.</video></div>`;if(ee.type==="model"){if(!window.customElements||!window["model-viewer"]){let oe=document.createElement("script");oe.type="module",oe.src="https://unpkg.com/@google/model-viewer/dist/model-viewer.min.js",document.head.appendChild(oe)}return`<div class="w-full h-full max-h-[70vh]"><model-viewer src="${ee.src}" camera-controls ar ar-modes="webxr scene-viewer quick-look" class="w-full h-full"></model-viewer></div>`}return`<div class="w-full h-full max-h-[70vh] flex items-center justify-center"><img src="${ee.src}" class="max-w-full max-h-[70vh] object-contain" alt="${Templates.escapeHtml(n.name)}"></div>`}).join("");Modal.open({title:Templates.escapeHtml(n.name),content:`<div class="space-y-2">${W}</div>`,size:"xl"})})}function A(){let r=document.getElementById("product-quantity"),d=document.querySelector(".qty-decrease"),p=document.querySelector(".qty-increase");d?.addEventListener("click",()=>{let C=parseInt(r.value)||1;C>1&&(r.value=C-1)}),p?.addEventListener("click",()=>{let C=parseInt(r.value)||1,$=parseInt(r.max)||99;C<$&&(r.value=C+1)});let b=document.querySelectorAll(".variant-btn");if(b.forEach(C=>{C.addEventListener("click",()=>{if(b.forEach(me=>{me.classList.remove("border-primary-500","bg-primary-50","text-primary-700"),me.classList.add("border-gray-300"),me.setAttribute("aria-checked","false")}),C.classList.add("border-primary-500","bg-primary-50","text-primary-700"),C.classList.remove("border-gray-300"),C.setAttribute("aria-checked","true"),e=C.dataset.variantId,C.dataset.price){let me=document.querySelector(".product-info .mt-4");me&&(me.innerHTML=Price.render({price:parseFloat(C.dataset.price),size:"large"}))}let $=parseInt(C.dataset.stock||"0"),W=document.getElementById("stock-status"),ee=document.getElementById("add-to-cart-btn"),oe=document.getElementById("mobile-stock"),de=document.getElementById("mobile-add-to-cart");W&&($>10?W.innerHTML='<span class="text-green-600 flex items-center"><svg class="w-5 h-5 mr-1" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path></svg>In Stock</span>':$>0?W.innerHTML=`<span class="text-orange-500 flex items-center"><svg class="w-5 h-5 mr-1" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd"></path></svg>Only ${$} left</span>`:W.innerHTML='<span class="text-red-600 flex items-center"><svg class="w-5 h-5 mr-1" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"></path></svg>Out of Stock</span>'),r&&(r.max=Math.max($,1),parseInt(r.value)>parseInt(r.max)&&(r.value=r.max)),oe&&(oe.textContent=$>0?$>10?"In stock":`${$} available`:"Out of stock"),ee&&(ee.disabled=$<=0),de&&(de.disabled=$<=0)})}),b.length>0){let C=b[0];C.setAttribute("aria-checked","true"),e=C.dataset.variantId}}function R(){let r=document.getElementById("add-to-cart-btn"),d=document.getElementById("mobile-add-to-cart");if(!r&&!d)return;let p=async b=>{let C=parseInt(document.getElementById("product-quantity")?.value)||1,$=document.getElementById("stock-status");if(!!document.querySelector(".variant-btn")&&!e){Toast.warning("Please select a variant before adding to cart.");return}b.disabled=!0;let ee=b.innerHTML;b.innerHTML='<svg class="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>';try{let oe=document.querySelector(`.variant-btn[data-variant-id="${e}"]`);if((oe?parseInt(oe.dataset.stock||"0"):n.stock_quantity||0)<=0){Toast.error("This variant is out of stock.");return}await CartApi.addItem(n.id,C,e||null),Toast.success("Added to cart!"),document.dispatchEvent(new CustomEvent("cart:updated"))}catch(oe){Toast.error(oe.message||"Failed to add to cart.")}finally{b.disabled=!1,b.innerHTML=ee}};r?.addEventListener("click",()=>p(r)),d?.addEventListener("click",()=>p(d))}function Y(){let r=document.getElementById("add-to-wishlist-btn");r&&r.addEventListener("click",async()=>{if(!AuthApi.isAuthenticated()){Toast.warning("Please login to add items to your wishlist."),window.location.href="/account/login/?next="+encodeURIComponent(window.location.pathname);return}try{await WishlistApi.addItem(n.id),Toast.success("Added to wishlist!"),r.querySelector("svg").setAttribute("fill","currentColor"),r.classList.add("text-red-500"),r.setAttribute("aria-pressed","true")}catch(d){d.message?.includes("already")?Toast.info("This item is already in your wishlist."):Toast.error(d.message||"Failed to add to wishlist.")}})}function G(){let r=document.querySelectorAll(".share-btn"),d=encodeURIComponent(window.location.href),p=encodeURIComponent(n?.name||document.title);r.forEach(b=>{b.addEventListener("click",()=>{let C=b.dataset.platform,$="";switch(C){case"facebook":$=`https://www.facebook.com/sharer/sharer.php?u=${d}`;break;case"twitter":$=`https://twitter.com/intent/tweet?url=${d}&text=${p}`;break;case"pinterest":let W=encodeURIComponent(n?.image||"");$=`https://pinterest.com/pin/create/button/?url=${d}&media=${W}&description=${p}`;break;case"copy":navigator.clipboard.writeText(window.location.href).then(()=>Toast.success("Link copied to clipboard!")).catch(()=>Toast.error("Failed to copy link."));return}$&&window.open($,"_blank","width=600,height=400")})})}function Z(){let r=document.getElementById("add-to-compare-btn");r&&r.addEventListener("click",async()=>{if(typeof AuthApi<"u"&&!AuthApi.isAuthenticated()){Toast.warning("Please login to compare products."),window.location.href="/account/login/?next="+encodeURIComponent(window.location.pathname);return}let d=n?.id||document.getElementById("product-detail")?.dataset.productId;if(d)try{let p=await ApiClient.post("/compare/",{product_id:d},{requiresAuth:!0});p.success?(Toast.success(p.message||"Added to compare"),r.setAttribute("aria-pressed","true"),r.classList.add("text-primary-600"),r.querySelector("svg")?.setAttribute("fill","currentColor")):Toast.error(p.message||"Failed to add to compare")}catch(p){try{let b="b_compare",C=JSON.parse(localStorage.getItem(b)||"[]");if(!C.includes(d)){C.push(d),localStorage.setItem(b,JSON.stringify(C)),Toast.success("Added to compare (local)"),r.setAttribute("aria-pressed","true"),r.classList.add("text-primary-600");return}Toast.info("Already in compare list")}catch{Toast.error(p.message||"Failed to add to compare")}}})}function ue(){let r=document.getElementById("add-to-compare-btn");r&&r.addEventListener("click",async d=>{d.preventDefault();let p=document.getElementById("product-detail")?.dataset.productId;if(p)try{if(typeof AuthApi<"u"&&!AuthApi.isAuthenticated()){Toast.warning("Please login to compare products."),window.location.href="/account/login/?next="+encodeURIComponent(window.location.pathname);return}let b=await ApiClient.post("/compare/",{product_id:p},{requiresAuth:!0});b.success?(Toast.success(b.message||"Added to compare"),r.setAttribute("aria-pressed","true"),r.classList.add("text-primary-600"),r.querySelector("svg")?.setAttribute("fill","currentColor")):Toast.error(b.message||"Failed to add to compare")}catch(b){try{let C="b_compare",$=JSON.parse(localStorage.getItem(C)||"[]");if(!$.includes(p)){$.push(p),localStorage.setItem(C,JSON.stringify($)),Toast.success("Added to compare (local)"),r.setAttribute("aria-pressed","true"),r.classList.add("text-primary-600");return}Toast.info("Already in compare list")}catch{Toast.error(b.message||"Failed to add to compare")}}})}async function ie(r){let d=document.getElementById("breadcrumbs");if(!d)return;let p=[{label:"Home",url:"/"},{label:"Products",url:"/products/"}];if(r.category)try{((await CategoriesAPI.getBreadcrumbs(r.category.id)).data||[]).forEach($=>{p.push({label:$.name,url:`/categories/${$.slug}/`})})}catch{p.push({label:r.category.name,url:`/categories/${r.category.slug}/`})}p.push({label:r.name}),d.innerHTML=Breadcrumb.render(p)}async function re(r){let d=document.getElementById("related-products");if(d)try{let b=(await ProductsAPI.getRelated(r.id,{limit:4})).data||[];if(b.length===0){d.innerHTML="";return}d.innerHTML=`
                <h2 class="text-2xl font-bold text-gray-900 mb-6">You may also like</h2>
                <div class="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                    ${b.map(C=>ProductCard.render(C)).join("")}
                </div>
            `,ProductCard.bindEvents(d)}catch(p){console.error("Failed to load related products:",p),d.innerHTML=""}}async function ge(r){let d=document.getElementById("reviews-container");if(d){Loader.show(d,"spinner");try{let b=(await ProductsAPI.getReviews(r.id)).data||[];d.innerHTML=`
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
                ${b.length>0?`
                    <div class="space-y-6">
                        ${b.map(C=>`
                            <div class="border-b border-gray-100 pb-6">
                                <div class="flex items-start gap-4">
                                    <div class="flex-shrink-0 w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                                        <span class="text-gray-600 font-medium">${(C.user?.first_name?.[0]||C.user?.email?.[0]||"U").toUpperCase()}</span>
                                    </div>
                                    <div class="flex-1">
                                        <div class="flex items-center gap-2">
                                            <span class="font-medium text-gray-900">${Templates.escapeHtml(C.user?.first_name||"Anonymous")}</span>
                                            ${C.verified_purchase?`
                                                <span class="px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded">Verified Purchase</span>
                                            `:""}
                                        </div>
                                        <div class="flex items-center gap-2 mt-1">
                                            ${Templates.renderStars(C.rating)}
                                            <span class="text-sm text-gray-500">${Templates.formatDate(C.created_at)}</span>
                                        </div>
                                        ${C.title?`<h4 class="font-medium text-gray-900 mt-2">${Templates.escapeHtml(C.title)}</h4>`:""}
                                        <p class="text-gray-600 mt-2">${Templates.escapeHtml(C.comment)}</p>
                                    </div>
                                </div>
                            </div>
                        `).join("")}
                    </div>
                `:`
                    <p class="text-gray-500 text-center py-8">No reviews yet. Be the first to review this product!</p>
                `}
            `,document.getElementById("write-review-btn")?.addEventListener("click",()=>{he(r)})}catch(p){console.error("Failed to load reviews:",p),d.innerHTML='<p class="text-red-500">Failed to load reviews.</p>'}}}function he(r){Modal.open({title:"Write a Review",content:`
                <form id="review-form" class="space-y-4">
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">Rating</label>
                        <div class="flex gap-1" id="rating-stars">
                            ${[1,2,3,4,5].map(b=>`
                                <button type="button" class="rating-star text-gray-300 hover:text-yellow-400" data-rating="${b}">
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
            `,confirmText:"Submit Review",onConfirm:async()=>{let b=parseInt(document.getElementById("review-rating").value),C=document.getElementById("review-title").value.trim(),$=document.getElementById("review-comment").value.trim();if(!b||b<1)return Toast.error("Please select a rating."),!1;if(!$)return Toast.error("Please write a review."),!1;try{return await ProductsAPI.createReview(r.id,{rating:b,title:C,comment:$}),Toast.success("Thank you for your review!"),ge(r),!0}catch(W){return Toast.error(W.message||"Failed to submit review."),!1}}});let d=document.querySelectorAll(".rating-star"),p=document.getElementById("review-rating");d.forEach(b=>{b.addEventListener("click",()=>{let C=parseInt(b.dataset.rating);p.value=C,d.forEach(($,W)=>{W<C?($.classList.remove("text-gray-300"),$.classList.add("text-yellow-400")):($.classList.add("text-gray-300"),$.classList.remove("text-yellow-400"))})})})}function be(r){try{document.title=`${r.name} | Bunoraa`;let d=r.meta_description||r.short_description||"";document.querySelector('meta[name="description"]')?.setAttribute("content",d),document.querySelector('meta[property="og:title"]')?.setAttribute("content",r.meta_title||r.name),document.querySelector('meta[property="og:description"]')?.setAttribute("content",d);let p=r.images?.[0]?.image||r.image;p&&document.querySelector('meta[property="og:image"]')?.setAttribute("content",p),document.querySelector('meta[name="twitter:title"]')?.setAttribute("content",r.meta_title||r.name),document.querySelector('meta[name="twitter:description"]')?.setAttribute("content",d)}catch{}}function fe(r){try{let d=document.querySelector('script[type="application/ld+json"][data-ld="product"]');if(!d)return;let p={"@context":"https://schema.org","@type":"Product",name:r.name,image:(r.images||[]).map(b=>b.image||b),description:r.short_description||r.description||"",sku:r.sku||"",offers:{"@type":"Offer",url:window.location.href,priceCurrency:r.currency||window.BUNORAA_PRODUCT?.currency||"BDT",price:r.current_price||r.price}};d.textContent=JSON.stringify(p)}catch{}}async function we(r){let d=document.getElementById("related-products");if(d)try{let[p,b,C]=await Promise.all([ProductsApi.getRecommendations(r.id,"frequently_bought_together",3),ProductsApi.getRecommendations(r.id,"similar",4),ProductsApi.getRecommendations(r.id,"you_may_also_like",6)]);if(p.success&&p.data?.length){let $=`
                    <section class="mt-8">
                        <h3 class="text-lg font-semibold mb-4">Frequently Bought Together</h3>
                        <div class="grid grid-cols-3 gap-3">${(p.data||[]).map(W=>ProductCard.render(W)).join("")}</div>
                    </section>
                `;d.insertAdjacentHTML("beforeend",$)}if(b.success&&b.data?.length){let $=`
                    <section class="mt-8">
                        <h3 class="text-lg font-semibold mb-4">Similar Products</h3>
                        <div class="grid grid-cols-2 md:grid-cols-4 gap-4">${(b.data||[]).map(W=>ProductCard.render(W)).join("")}</div>
                    </section>
                `;d.insertAdjacentHTML("beforeend",$)}if(C.success&&C.data?.length){let $=`
                    <section class="mt-8">
                        <h3 class="text-lg font-semibold mb-4">You May Also Like</h3>
                        <div class="grid grid-cols-2 md:grid-cols-4 gap-4">${(C.data||[]).map(W=>ProductCard.render(W)).join("")}</div>
                    </section>
                `;d.insertAdjacentHTML("beforeend",$)}ProductCard.bindEvents(d)}catch{}}function ke(){if(!document.getElementById("product-detail")||typeof IntersectionObserver>"u")return;let d=new IntersectionObserver(p=>{p.forEach(b=>{if(!b.isIntersecting)return;let C=b.target;C.id,C.id==="reviews"||C.id,d.unobserve(C)})},{rootMargin:"200px"});document.querySelectorAll("#related-products, #reviews").forEach(p=>{d.observe(p)})}async function Ce(r){try{await ProductsAPI.trackView(r.id)}catch{}}function Le(){n=null,e=null,t=null,o=!1}return{init:I,destroy:Le}})();window.ProductPage=ar;_r=ar});var lr={};te(lr,{default:()=>Sr});var ir,Sr,dr=X(()=>{ir=(function(){"use strict";let n="",e=1,t={},o=null,m=!1;async function v(){if(m)return;m=!0;let g=document.getElementById("search-results")||document.getElementById("products-grid");if(g&&g.querySelector(".product-card, [data-product-id]")){N(),E(),w(),k();return}n=U(),t=K(),e=parseInt(new URLSearchParams(window.location.search).get("page"))||1,await I(),N(),E(),w(),k()}function k(){let g=document.getElementById("view-grid"),a=document.getElementById("view-list");g?.addEventListener("click",()=>{g.classList.add("bg-primary-100","text-primary-700"),g.classList.remove("text-gray-400"),a?.classList.remove("bg-primary-100","text-primary-700"),a?.classList.add("text-gray-400"),Storage?.set("productViewMode","grid"),I()}),a?.addEventListener("click",()=>{a.classList.add("bg-primary-100","text-primary-700"),a.classList.remove("text-gray-400"),g?.classList.remove("bg-primary-100","text-primary-700"),g?.classList.add("text-gray-400"),Storage?.set("productViewMode","list"),I()})}async function I(){let g=document.getElementById("search-results")||document.getElementById("products-grid"),a=document.getElementById("results-count")||document.getElementById("product-count");if(g){o&&o.abort(),o=new AbortController,Loader.show(g,"skeleton");try{let s={page:e,pageSize:12,...t};if(n&&(s.search=n),window.location.pathname==="/categories/"){await H();return}let l=await ProductsApi.getProducts(s),u=Array.isArray(l)?l:l.data||l.results||[],h=l.meta||{};a&&(n?a.textContent=`${h.total||u.length} results for "${Templates.escapeHtml(n)}"`:a.textContent=`${h.total||u.length} products`),M(u,h),await D()}catch(s){if(s.name==="AbortError")return;console.error("Failed to load products:",s),g.innerHTML='<p class="text-red-500 text-center py-8">Failed to load products. Please try again.</p>'}}}async function H(){let g=document.getElementById("search-results")||document.getElementById("products-grid"),a=document.getElementById("results-count")||document.getElementById("product-count"),s=document.getElementById("page-title");if(g)try{let i=await CategoriesApi.getCategories({limit:50}),l=Array.isArray(i)?i:i.data||i.results||[];if(s&&(s.textContent="All Categories"),a&&(a.textContent=`${l.length} categories`),l.length===0){g.innerHTML=`
                    <div class="text-center py-16">
                        <svg class="w-24 h-24 text-gray-300 mx-auto mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"/>
                        </svg>
                        <h2 class="text-2xl font-bold text-gray-900 mb-2">No categories found</h2>
                        <p class="text-gray-600">Check back later for new categories.</p>
                    </div>
                `;return}g.innerHTML=`
                <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                    ${l.map(u=>`
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
            `}catch(i){console.error("Failed to load categories:",i),g.innerHTML='<p class="text-red-500 text-center py-8">Failed to load categories. Please try again.</p>'}}function U(){return new URLSearchParams(window.location.search).get("q")||""}function K(){let g=new URLSearchParams(window.location.search),a={};return g.get("category")&&(a.category=g.get("category")),g.get("min_price")&&(a.minPrice=g.get("min_price")),g.get("max_price")&&(a.maxPrice=g.get("max_price")),g.get("ordering")&&(a.ordering=g.get("ordering")),g.get("in_stock")&&(a.inStock=g.get("in_stock")==="true"),g.get("sale")&&(a.onSale=g.get("sale")==="true"),g.get("featured")&&(a.featured=g.get("featured")==="true"),a}function N(){let g=document.getElementById("search-form"),a=document.getElementById("search-input");a&&(a.value=n),g?.addEventListener("submit",l=>{l.preventDefault();let u=a?.value.trim();u&&(n=u,e=1,_(),y())});let s=document.getElementById("search-suggestions"),i=null;a?.addEventListener("input",l=>{let u=l.target.value.trim();if(clearTimeout(i),u.length<2){s&&(s.innerHTML="",s.classList.add("hidden"));return}i=setTimeout(async()=>{try{let c=(await ProductsApi.search({q:u,limit:5})).data||[];s&&c.length>0&&(s.innerHTML=`
                            <div class="py-2">
                                ${c.map(x=>`
                                    <a href="/products/${x.slug}/" class="flex items-center gap-3 px-4 py-2 hover:bg-gray-50">
                                        ${x.image?`<img src="${x.image}" alt="" class="w-10 h-10 object-cover rounded" onerror="this.style.display='none'">`:'<div class="w-10 h-10 bg-gray-100 rounded flex items-center justify-center"><svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg></div>'}
                                        <div>
                                            <p class="text-sm font-medium text-gray-900">${Templates.escapeHtml(x.name)}</p>
                                            <p class="text-sm text-primary-600">${Templates.formatPrice(x.current_price??x.price_converted??x.price)}</p>
                                        </div>
                                    </a>
                                `).join("")}
                            </div>
                        `,s.classList.remove("hidden"))}catch(h){console.error("Search suggestions failed:",h)}},300)}),a?.addEventListener("blur",()=>{setTimeout(()=>{s&&s.classList.add("hidden")},200)})}async function y(){await I()}function M(g,a){let s=document.getElementById("search-results");if(!s)return;if(g.length===0){s.innerHTML=`
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
            ${a.total_pages>1?`
                <div id="search-pagination" class="mt-8">${Pagination.render({currentPage:a.current_page||e,totalPages:a.total_pages,totalItems:a.total})}</div>
            `:""}
        `,ProductCard.bindEvents(s),document.getElementById("search-pagination")?.addEventListener("click",h=>{let c=h.target.closest("[data-page]");c&&(e=parseInt(c.dataset.page),_(),y(),window.scrollTo({top:0,behavior:"smooth"}))})}async function D(){let g=document.getElementById("filter-categories");if(g)try{let s=(await CategoriesAPI.getAll({has_products:!0,limit:20})).data||[];g.innerHTML=`
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
            `,S()}catch{}}function S(){document.querySelectorAll('input[name="category"]').forEach(a=>{a.addEventListener("change",s=>{s.target.value?t.category=s.target.value:delete t.category,e=1,_(),y()})})}function E(){let g=document.getElementById("apply-price-filter"),a=document.getElementById("filter-in-stock"),s=document.getElementById("clear-filters");g?.addEventListener("click",()=>{let u=document.getElementById("filter-min-price")?.value,h=document.getElementById("filter-max-price")?.value;u?t.min_price=u:delete t.min_price,h?t.max_price=h:delete t.max_price,e=1,_(),y()}),a?.addEventListener("change",u=>{u.target.checked?t.in_stock=!0:delete t.in_stock,e=1,_(),y()}),s?.addEventListener("click",()=>{t={},e=1,document.querySelectorAll('input[name="category"]').forEach(c=>{c.checked=c.value===""});let u=document.getElementById("filter-min-price"),h=document.getElementById("filter-max-price");u&&(u.value=""),h&&(h.value=""),a&&(a.checked=!1),_(),y()});let i=document.getElementById("filter-min-price"),l=document.getElementById("filter-max-price");i&&t.min_price&&(i.value=t.min_price),l&&t.max_price&&(l.value=t.max_price),a&&t.in_stock&&(a.checked=!0)}function w(){let g=document.getElementById("sort-select");g&&(g.value=t.ordering||"",g.addEventListener("change",a=>{a.target.value?t.ordering=a.target.value:delete t.ordering,e=1,_(),y()}))}function _(){let g=new URLSearchParams;n&&g.set("q",n),t.category&&g.set("category",t.category),t.min_price&&g.set("min_price",t.min_price),t.max_price&&g.set("max_price",t.max_price),t.ordering&&g.set("ordering",t.ordering),t.in_stock&&g.set("in_stock","true"),e>1&&g.set("page",e);let a=`${window.location.pathname}?${g.toString()}`;window.history.pushState({},"",a)}function L(){o&&(o.abort(),o=null),n="",e=1,t={},m=!1}return{init:v,destroy:L}})();window.SearchPage=ir;Sr=ir});var ur={};te(ur,{default:()=>Mr});var cr,Mr,mr=X(()=>{cr=(function(){"use strict";let n=1,e="added_desc",t="all";function o(){return window.BUNORAA_CURRENCY?.symbol||"\u09F3"}let m={get CURRENCY_SYMBOL(){return o()},PRIORITY_LEVELS:{low:{label:"Low",color:"gray",icon:"\u25CB"},normal:{label:"Normal",color:"blue",icon:"\u25D0"},high:{label:"High",color:"amber",icon:"\u25CF"},urgent:{label:"Urgent",color:"red",icon:"\u2605"}}};async function v(){AuthGuard.protectPage()&&(await H(),N())}function k(E={}){let w=E.product||E||{},_=[E.product_image,w.product_image,w.primary_image,w.image,Array.isArray(w.images)?w.images[0]:null,w.image_url,w.thumbnail],L=g=>{if(!g)return"";if(typeof g=="string")return g;if(typeof g=="object"){if(typeof g.image=="string"&&g.image)return g.image;if(g.image&&typeof g.image=="object"){if(typeof g.image.url=="string"&&g.image.url)return g.image.url;if(typeof g.image.src=="string"&&g.image.src)return g.image.src}if(typeof g.url=="string"&&g.url)return g.url;if(typeof g.src=="string"&&g.src)return g.src}return""};for(let g of _){let a=L(g);if(a)return a}return""}function I(E={}){let w=E.product||E||{},_=c=>{if(c==null)return null;let x=Number(c);return Number.isFinite(x)?x:null},L=[E.product_price,w.price,E.price,E.current_price,E.price_at_add],g=null;for(let c of L)if(g=_(c),g!==null)break;let a=[E.product_sale_price,w.sale_price,E.sale_price],s=null;for(let c of a)if(s=_(c),s!==null)break;let i=_(E.lowest_price_seen),l=_(E.highest_price_seen),u=_(E.target_price),h=_(E.price_at_add);return{price:g!==null?g:0,salePrice:s!==null?s:null,lowestPrice:i,highestPrice:l,targetPrice:u,priceAtAdd:h}}async function H(){let E=document.getElementById("wishlist-container");if(E){Loader.show(E,"skeleton");try{let w=await WishlistApi.getWishlist({page:n,sort:e}),_=[],L={};Array.isArray(w)?_=w:w&&typeof w=="object"&&(_=w.data||w.results||w.items||[],!Array.isArray(_)&&w.data&&typeof w.data=="object"?(_=w.data.items||w.data.results||[],L=w.data.meta||w.meta||{}):L=w.meta||{}),Array.isArray(_)||(_=_&&typeof _=="object"?[_]:[]);let g=_;t==="on_sale"?g=_.filter(a=>{let s=I(a);return s.salePrice&&s.salePrice<s.price}):t==="in_stock"?g=_.filter(a=>a.is_in_stock!==!1):t==="price_drop"?g=_.filter(a=>{let s=I(a);return s.priceAtAdd&&s.price<s.priceAtAdd}):t==="at_target"&&(g=_.filter(a=>{let s=I(a);return s.targetPrice&&s.price<=s.targetPrice})),U(g,_,L)}catch(w){let _=w&&(w.message||w.detail)||"Failed to load wishlist.";if(w&&w.status===401){AuthGuard.redirectToLogin();return}E.innerHTML=`<p class="text-red-500 text-center py-8">${Templates.escapeHtml(_)}</p>`}}}function U(E,w,_){let L=document.getElementById("wishlist-container");if(!L)return;let g=w.length,a=w.filter(l=>{let u=I(l);return u.salePrice&&u.salePrice<u.price}).length,s=w.filter(l=>{let u=I(l);return u.priceAtAdd&&u.price<u.priceAtAdd}).length,i=w.filter(l=>{let u=I(l);return u.targetPrice&&u.price<=u.targetPrice}).length;if(g===0){L.innerHTML=`
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
                    <div class="bg-white dark:bg-gray-800 rounded-lg p-3 border border-gray-200 dark:border-gray-700 ${a>0?"ring-2 ring-green-500":""}">
                        <div class="text-2xl font-bold text-green-600 dark:text-green-400">${a}</div>
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
                ${E.map(l=>K(l)).join("")}
            </div>
            
            ${E.length===0&&g>0?`
                <div class="text-center py-12">
                    <p class="text-gray-500 dark:text-gray-400">No items match the selected filter.</p>
                    <button class="mt-4 text-primary-600 hover:underline" onclick="document.querySelector('[data-filter=all]').click()">Show all items</button>
                </div>
            `:""}
            
            ${_.total_pages>1?'<div id="wishlist-pagination" class="mt-8"></div>':""}
        `,_&&_.total_pages>1){let l=document.getElementById("wishlist-pagination");if(l&&window.Pagination){let u=new window.Pagination({totalPages:_.total_pages,currentPage:_.current_page||n,className:"justify-center",onChange:h=>{n=h,H(),window.scrollTo({top:0,behavior:"smooth"})}});l.innerHTML="",l.appendChild(u.create())}}y()}function K(E){try{let w=E.product||E||{},_=E.product_name||w.name||"",L=E.product_slug||w.slug||"",g=E.is_in_stock!==void 0?E.is_in_stock:w.is_in_stock!==void 0?w.is_in_stock:w.stock_quantity>0,a=k(E||{}),s=!!E.product_has_variants,i={price:0,salePrice:null,lowestPrice:null,highestPrice:null,targetPrice:null,priceAtAdd:null};try{i=I(E||{})}catch{i={price:0,salePrice:null}}let{price:l,salePrice:u,lowestPrice:h,highestPrice:c,targetPrice:x,priceAtAdd:B}=i,A=u||l,R=B&&A<B,Y=B?Math.round((A-B)/B*100):0,G=x&&A<=x,Z=u&&u<l,ue=E.priority||"normal",ie=m.PRIORITY_LEVELS[ue]||m.PRIORITY_LEVELS.normal,re=fe=>{try{return Templates.escapeHtml(fe||"")}catch{return String(fe||"")}},ge=fe=>{try{return Price.render({price:fe.price,salePrice:fe.salePrice})}catch{return`<span class="font-bold">${m.CURRENCY_SYMBOL}${fe.price||0}</span>`}},he=fe=>{try{return Templates.formatPrice(fe)}catch{return`${m.CURRENCY_SYMBOL}${fe}`}},be=w&&w.aspect&&(w.aspect.css||(w.aspect.width&&w.aspect.height?`${w.aspect.width}/${w.aspect.height}`:null))||"1/1";return`
                <div class="wishlist-item relative bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden group" 
                     data-item-id="${E&&E.id?E.id:""}" 
                     data-product-id="${w&&w.id?w.id:E&&E.product?E.product:""}" 
                     data-product-slug="${re(L)}" 
                     data-product-has-variants="${s}"
                     data-priority="${ue}">
                    
                    <!-- Image Section -->
                    <div class="relative" style="aspect-ratio: ${be};">
                        <!-- Badges -->
                        <div class="absolute top-2 left-2 z-10 flex flex-col gap-1">
                            ${Z?`
                                <div class="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
                                    -${Math.round((1-u/l)*100)}%
                                </div>
                            `:""}
                            ${R?`
                                <div class="bg-blue-500 text-white text-xs font-bold px-2 py-1 rounded flex items-center">
                                    <svg class="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
                                    </svg>
                                    ${Math.abs(Y)}% drop
                                </div>
                            `:""}
                            ${G?`
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
                            <button class="priority-btn w-8 h-8 rounded-full bg-white dark:bg-gray-700 shadow-md flex items-center justify-center text-${ie.color}-500 hover:scale-110 transition-transform" title="Priority: ${ie.label}" data-item-id="${E.id}">
                                <span class="text-sm">${ie.icon}</span>
                            </button>
                        </div>
                        
                        <!-- Remove Button -->
                        <button class="remove-btn absolute top-2 right-2 z-20 w-8 h-8 bg-gray-900/80 text-white rounded-full shadow-lg flex items-center justify-center hover:bg-red-600 transition-colors opacity-0 group-hover:opacity-100" aria-label="Remove from wishlist">
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                            </svg>
                        </button>
                        
                        <!-- Product Image -->
                        <a href="/products/${re(L)}/">
                            ${a?`
                                <img 
                                    src="${a}" 
                                    alt="${re(_)}"
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
                        ${w&&w.category?`
                            <a href="/categories/${re(w.category.slug)}/" class="text-xs text-gray-500 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400">
                                ${re(w.category.name)}
                            </a>
                        `:""}
                        <h3 class="font-medium text-gray-900 dark:text-white mt-1 line-clamp-2">
                            <a href="/products/${re(L)}/" class="hover:text-primary-600 dark:hover:text-primary-400">
                                ${re(_)}
                            </a>
                        </h3>
                        
                        <!-- Price Section -->
                        <div class="mt-2">
                            ${ge({price:l,salePrice:u})}
                        </div>
                        
                        <!-- Price History -->
                        ${h||x?`
                            <div class="mt-2 text-xs space-y-1">
                                ${h?`
                                    <div class="flex items-center justify-between text-gray-500 dark:text-gray-400">
                                        <span>Lowest:</span>
                                        <span class="font-medium text-green-600 dark:text-green-400">${he(h)}</span>
                                    </div>
                                `:""}
                                ${x?`
                                    <div class="flex items-center justify-between text-gray-500 dark:text-gray-400">
                                        <span>Target:</span>
                                        <span class="font-medium text-amber-600 dark:text-amber-400">${he(x)}</span>
                                    </div>
                                `:""}
                            </div>
                        `:""}
                        
                        <!-- Rating -->
                        ${w&&w.average_rating?`
                            <div class="flex items-center gap-1 mt-2">
                                ${Templates.renderStars(w.average_rating)}
                                <span class="text-xs text-gray-500 dark:text-gray-400">(${w.review_count||0})</span>
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
                            <button class="set-target-btn px-3 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-sm" title="Set target price" data-item-id="${E.id}" data-current-price="${A}">
                                <svg class="w-4 h-4" fill="${x?"currentColor":"none"}" stroke="currentColor" viewBox="0 0 24 24">
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
            `}catch(w){return console.error("Failed to render wishlist item:",w),'<div class="p-4 bg-white dark:bg-gray-800 rounded shadow text-gray-500 dark:text-gray-400">Failed to render item</div>'}}function N(){document.getElementById("wishlist-sort")?.addEventListener("change",E=>{e=E.target.value,H()}),document.querySelectorAll(".filter-btn").forEach(E=>{E.addEventListener("click",()=>{t=E.dataset.filter,H()})})}function y(){let E=document.getElementById("clear-wishlist-btn"),w=document.getElementById("add-all-to-cart-btn"),_=document.getElementById("share-wishlist-btn"),L=document.querySelectorAll(".wishlist-item"),g=document.getElementById("wishlist-sort"),a=document.querySelectorAll(".filter-btn");g?.addEventListener("change",s=>{e=s.target.value,H()}),a.forEach(s=>{s.addEventListener("click",()=>{t=s.dataset.filter,H()})}),E?.addEventListener("click",async()=>{if(await Modal.confirm({title:"Clear Wishlist",message:"Are you sure you want to remove all items from your wishlist?",confirmText:"Clear All",cancelText:"Cancel"}))try{await WishlistApi.clear(),Toast.success("Wishlist cleared."),await H()}catch(i){Toast.error(i.message||"Failed to clear wishlist.")}}),w?.addEventListener("click",async()=>{let s=w;s.disabled=!0,s.innerHTML='<svg class="animate-spin w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>Adding...';try{let i=document.querySelectorAll('.wishlist-item:not([data-product-has-variants="true"])'),l=0,u=0;for(let h of i){let c=h.dataset.productId;if(c)try{await CartApi.addItem(c,1),l++}catch{u++}}l>0&&(Toast.success(`Added ${l} items to cart!`),document.dispatchEvent(new CustomEvent("cart:updated"))),u>0&&Toast.warning(`${u} items could not be added (may require variant selection).`)}catch(i){Toast.error(i.message||"Failed to add items to cart.")}finally{s.disabled=!1,s.innerHTML='<svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>Add All to Cart'}}),_?.addEventListener("click",async()=>{try{let s=`${window.location.origin}/wishlist/share/`;navigator.share?await navigator.share({title:"My Wishlist",text:"Check out my wishlist!",url:s}):(await navigator.clipboard.writeText(s),Toast.success("Wishlist link copied to clipboard!"))}catch(s){s.name!=="AbortError"&&Toast.error("Failed to share wishlist.")}}),L.forEach(s=>{let i=s.dataset.itemId,l=s.dataset.productId,u=s.dataset.productSlug;s.querySelector(".remove-btn")?.addEventListener("click",async()=>{try{await WishlistApi.removeItem(i),Toast.success("Removed from wishlist."),s.remove(),document.querySelectorAll(".wishlist-item").length===0&&await H()}catch(h){Toast.error(h.message||"Failed to remove item.")}}),s.querySelector(".priority-btn")?.addEventListener("click",async()=>{let h=["low","normal","high","urgent"],c=s.dataset.priority||"normal",x=h.indexOf(c),B=h[(x+1)%h.length];try{WishlistApi.updateItem&&await WishlistApi.updateItem(i,{priority:B}),s.dataset.priority=B;let A=s.querySelector(".priority-btn"),R=m.PRIORITY_LEVELS[B];A.title=`Priority: ${R.label}`,A.innerHTML=`<span class="text-sm">${R.icon}</span>`,A.className=`priority-btn w-8 h-8 rounded-full bg-white dark:bg-gray-700 shadow-md flex items-center justify-center text-${R.color}-500 hover:scale-110 transition-transform`,Toast.success(`Priority set to ${R.label}`)}catch{Toast.error("Failed to update priority.")}}),s.querySelector(".set-target-btn")?.addEventListener("click",async()=>{let h=parseFloat(s.querySelector(".set-target-btn").dataset.currentPrice)||0,c=`
                    <div class="space-y-4">
                        <p class="text-sm text-gray-600 dark:text-gray-400">Set a target price and we'll notify you when the item drops to or below this price.</p>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Current Price</label>
                            <div class="text-lg font-bold text-gray-900 dark:text-white">${m.CURRENCY_SYMBOL}${h.toLocaleString()}</div>
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Target Price</label>
                            <div class="flex items-center">
                                <span class="text-gray-500 mr-2">${m.CURRENCY_SYMBOL}</span>
                                <input type="number" id="target-price-input" value="${Math.round(h*.9)}" min="1" max="${h}" class="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-primary-500 focus:border-primary-500">
                            </div>
                            <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">Suggested: ${m.CURRENCY_SYMBOL}${Math.round(h*.9).toLocaleString()} (10% off)</p>
                        </div>
                    </div>
                `,x=await Modal.open({title:"Set Target Price",content:c,confirmText:"Set Alert",cancelText:"Cancel",onConfirm:async()=>{let B=parseFloat(document.getElementById("target-price-input").value);if(!B||B<=0)return Toast.error("Please enter a valid target price."),!1;try{return WishlistApi.updateItem&&await WishlistApi.updateItem(i,{target_price:B}),Toast.success(`Price alert set for ${m.CURRENCY_SYMBOL}${B.toLocaleString()}`),await H(),!0}catch{return Toast.error("Failed to set price alert."),!1}}})}),s.querySelector(".add-to-cart-btn")?.addEventListener("click",async h=>{let c=h.target.closest(".add-to-cart-btn");if(c.disabled)return;c.disabled=!0;let x=c.innerHTML;if(c.innerHTML='<svg class="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>',s.dataset.productHasVariants==="true"||s.dataset.productHasVariants==="True"||s.dataset.productHasVariants==="1"){D(s),c.disabled=!1,c.innerHTML=x;return}try{await CartApi.addItem(l,1),Toast.success("Added to cart!"),document.dispatchEvent(new CustomEvent("cart:updated"))}catch(A){if(!!(A&&(A.errors&&A.errors.variant_id||A.message&&typeof A.message=="string"&&A.message.toLowerCase().includes("variant")))&&(Toast.info("This product requires selecting a variant."),u)){window.location.href=`/products/${u}/`;return}Toast.error(A.message||"Failed to add to cart.")}finally{c.disabled=!1,c.innerHTML=x}})})}function M(E){let w={};return E.forEach(_=>{w[_.attribute_name]||(w[_.attribute_name]=[]),w[_.attribute_name].push(_)}),Object.entries(w).map(([_,L])=>`
            <div class="mt-4">
                <label class="text-sm font-medium text-gray-700">${Templates.escapeHtml(_)}:</label>
                <div class="flex flex-wrap gap-2 mt-2" id="wishlist-variant-group-${Templates.slugify(_)}">
                    ${L.map((g,a)=>`
                        <button type="button" class="wishlist-modal-variant-btn px-3 py-2 border rounded-lg text-sm transition-colors ${a===0?"border-primary-500 bg-primary-50 text-primary-700":"border-gray-300 hover:border-gray-400"}" data-variant-id="${g.id}" data-price="${g.price_converted??g.price??""}" data-stock="${g.stock_quantity||0}">
                            ${Templates.escapeHtml(g.value)}
                            ${g.price_converted??g.price?`<span class="text-xs text-gray-500"> (${Templates.formatPrice(g.price_converted??g.price)})</span>`:""}
                        </button>
                    `).join("")}
                </div>
            </div>
        `).join("")}async function D(E){let w=E.product_slug||E.dataset?.productSlug||"",_=E.product||E.dataset?.productId||"";try{let L;if(typeof ProductsApi<"u"&&ProductsApi.getProduct)L=await ProductsApi.getProduct(w||_);else{let u=window.BUNORAA_CURRENCY&&window.BUNORAA_CURRENCY.code||void 0;L=await ApiClient.get(`/catalog/products/${w||_}/`,{currency:u})}if(!L||!L.success||!L.data){let u=L&&L.message?L.message:"Failed to load product variants.";Toast.error(u);return}let g=L.data,a=g.variants||[];if(!a.length){window.location.href=`/products/${g.slug||w||_}/`;return}let s=g.images?.[0]?.image||g.primary_image||g.image||"",i=`
                <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div class="col-span-1">
                        ${s?`<img src="${s}" class="w-full h-48 object-cover rounded" alt="${Templates.escapeHtml(g.name)}">`:'<div class="w-full h-48 bg-gray-100 rounded"></div>'}
                    </div>
                    <div class="col-span-2">
                        <h3 class="text-lg font-semibold">${Templates.escapeHtml(g.name)}</h3>
                        <div id="wishlist-variant-price" class="mt-2 text-lg font-bold">${Templates.formatPrice(a?.[0]?.price_converted??a?.[0]?.price??g.price)}</div>
                        <div id="wishlist-variant-options" class="mt-4">
                            ${M(a)}
                        </div>
                        <div class="mt-4 flex items-center gap-2">
                            <label class="text-sm text-gray-700">Qty</label>
                            <input id="wishlist-variant-qty" type="number" value="1" min="1" class="w-20 px-3 py-2 border rounded" />
                        </div>
                    </div>
                </div>
            `,l=await Modal.open({title:"Select Variant",content:i,confirmText:"Add to Cart",cancelText:"Cancel",size:"md",onConfirm:async()=>{let h=document.querySelector(".wishlist-modal-variant-btn.border-primary-500")||document.querySelector(".wishlist-modal-variant-btn");if(!h)return Toast.error("Please select a variant."),!1;let c=h.dataset.variantId,x=parseInt(document.getElementById("wishlist-variant-qty")?.value)||1;try{return await CartApi.addItem(g.id,x,c),Toast.success("Added to cart!"),document.dispatchEvent(new CustomEvent("cart:updated")),!0}catch(B){return Toast.error(B.message||"Failed to add to cart."),!1}}});setTimeout(()=>{let u=document.querySelectorAll(".wishlist-modal-variant-btn");u.forEach(c=>{c.addEventListener("click",()=>{u.forEach(B=>B.classList.remove("border-primary-500","bg-primary-50","text-primary-700")),c.classList.add("border-primary-500","bg-primary-50","text-primary-700");let x=c.dataset.price;if(x!==void 0){let B=document.getElementById("wishlist-variant-price");B&&(B.textContent=Templates.formatPrice(x))}})});let h=document.querySelector(".wishlist-modal-variant-btn");h&&h.click()},20)}catch{Toast.error("Failed to load variants.")}}function S(){n=1}return{init:v,destroy:S}})();window.WishlistPage=cr;Mr=cr});var qr,ut=X(()=>{qr=pt({"./pages/account.js":()=>Promise.resolve().then(()=>(Ms(),Ss)),"./pages/cart.js":()=>Promise.resolve().then(()=>(Ps(),Hs)),"./pages/category.js":()=>Promise.resolve().then(()=>(Fs(),Ns)),"./pages/checkout.js":()=>Promise.resolve().then(()=>(Rs(),Os)),"./pages/contact.js":()=>Promise.resolve().then(()=>(Us(),Ds)),"./pages/faq.js":()=>Promise.resolve().then(()=>(Qs(),Ys)),"./pages/home.js":()=>Promise.resolve().then(()=>(Zs(),Ks)),"./pages/orders.js":()=>Promise.resolve().then(()=>(sr(),tr)),"./pages/preorders.js":()=>Promise.resolve().then(()=>vr(rr())),"./pages/product.js":()=>Promise.resolve().then(()=>(or(),nr)),"./pages/search.js":()=>Promise.resolve().then(()=>(dr(),lr)),"./pages/wishlist.js":()=>Promise.resolve().then(()=>(mr(),ur))})});var Hr=gt(()=>{Bs();ut();var mt=(function(){"use strict";let n={},e=null,t=null;async function o(L){try{let g=await qr(`./pages/${L}.js`);return g.default||g}catch{return null}}function m(){H(),U(),K(),N(),v(),D(),E(),w();try{let L=performance.getEntriesByType?performance.getEntriesByType("navigation"):[],g=L&&L[0]||null;g&&g.type==="navigate"&&!window.location.hash&&setTimeout(()=>{let a=document.scrollingElement||document.documentElement;if(!a)return;let s=a.scrollTop||window.pageYOffset||0,i=Math.max(0,a.scrollHeight-window.innerHeight);s>Math.max(100,i*.6)&&window.scrollTo({top:0,behavior:"auto"})},60)}catch{}}async function v(){try{if(!AuthApi.isAuthenticated()){let s=localStorage.getItem("wishlist");if(s){let i=JSON.parse(s);WishlistApi.updateBadge(i);let l=i.items||i.data&&i.data.items||[];I(l)}else I([]);return}let g=(await WishlistApi.getWishlist({pageSize:200})).data||{},a=g.items||g.data||[];WishlistApi.updateBadge(g),I(a)}catch{try{let g=localStorage.getItem("wishlist");if(g){let a=JSON.parse(g);WishlistApi.updateBadge(a);let s=a.items||a.data&&a.data.items||[];I(s)}}catch{}}}let k=[];function I(L){try{k=L||[];let g={},a={};(L||[]).forEach(s=>{let i=s.product||s.product_id||s.product&&s.product.id||null,l=s.product_slug||s.product&&s.product.slug||null,u=s.id||s.pk||s.uuid||s.item||null;i&&(g[String(i)]=u||!0),l&&(a[String(l)]=u||!0)}),document.querySelectorAll(".wishlist-btn").forEach(s=>{try{let i=s.querySelector("svg"),l=i?.querySelector(".heart-fill"),u=s.dataset.productId||s.closest("[data-product-id]")?.dataset.productId,h=s.dataset.productSlug||s.closest("[data-product-slug]")?.dataset.productSlug,c=null;u&&g.hasOwnProperty(String(u))?c=g[String(u)]:h&&a.hasOwnProperty(String(h))&&(c=a[String(h)]),c?(s.dataset.wishlistItemId=c,s.classList.add("text-red-500"),s.setAttribute("aria-pressed","true"),i?.classList.add("fill-current"),l&&(l.style.opacity="1")):(s.removeAttribute("data-wishlist-item-id"),s.classList.remove("text-red-500"),s.setAttribute("aria-pressed","false"),i?.classList.remove("fill-current"),l&&(l.style.opacity="0"))}catch{}})}catch{}}(function(){if(typeof MutationObserver>"u")return;let L=null;new MutationObserver(function(a){let s=!1;for(let i of a){if(i.addedNodes&&i.addedNodes.length){for(let l of i.addedNodes)if(l.nodeType===1&&(l.matches?.(".product-card")||l.querySelector?.(".product-card")||l.querySelector?.(".wishlist-btn"))){s=!0;break}}if(s)break}s&&(clearTimeout(L),L=setTimeout(()=>{try{I(k)}catch{}},150))}).observe(document.body,{childList:!0,subtree:!0})})();function H(){let L=window.location.pathname,g=document.body;if(g.dataset.page){e=g.dataset.page;return}if((L.startsWith("/accounts/")||L.startsWith("/account/"))&&!(L.startsWith("/accounts/profile")||L.startsWith("/account/profile"))){e=null;return}L==="/"||L==="/home/"?e="home":L==="/categories/"||L==="/products/"?e="search":L.startsWith("/categories/")&&L!=="/categories/"?e="category":L.startsWith("/products/")&&L!=="/products/"?e="product":L==="/search/"||L.startsWith("/search")?e="search":L.startsWith("/cart")?e="cart":L.startsWith("/checkout")?e="checkout":L==="/account"||L.startsWith("/account/")||L.startsWith("/accounts/profile")?e="account":L.startsWith("/orders")?e="orders":L.startsWith("/wishlist")?e="wishlist":L.startsWith("/contact")&&(e="contact")}function U(){typeof Tabs<"u"&&document.querySelector("[data-tabs]")&&Tabs.init(),typeof Dropdown<"u"&&document.querySelectorAll("[data-dropdown-trigger]").forEach(L=>{let g=L.dataset.dropdownTarget,a=document.getElementById(g);a&&Dropdown.create(L,{content:a.innerHTML})});try{As()}catch{}}async function K(){if(!e)return;try{t&&typeof t.destroy=="function"&&t.destroy()}catch{}let L=await o(e);if(L&&typeof L.init=="function"){t=L;try{await t.init()}catch(g){console.error("failed to init page controller",g)}}}try{"serviceWorker"in navigator&&navigator.serviceWorker.register("/static/js/sw.js").catch(()=>{})}catch{}async function N(){if(document.querySelectorAll("[data-cart-count]").length)try{let a=(await CartApi.getCart()).data?.item_count||0;try{localStorage.setItem("cart",JSON.stringify({item_count:a,savedAt:Date.now()}))}catch{}M(a)}catch{try{let a=localStorage.getItem("cart");if(a){let i=JSON.parse(a)?.item_count||0;M(i);return}}catch(a){console.error("Failed to get cart count fallback:",a)}}}async function y(L){try{return(((await WishlistApi.getWishlist({pageSize:200})).data||{}).items||[]).find(l=>String(l.product)===String(L))?.id||null}catch{return null}}function M(L){document.querySelectorAll("[data-cart-count]").forEach(a=>{a.textContent=L>99?"99+":L,a.classList.toggle("hidden",L===0)})}function D(){document.addEventListener("cart:updated",async()=>{await N()}),document.addEventListener("wishlist:updated",async()=>{await v()}),document.addEventListener("auth:login",()=>{S(!0)}),document.addEventListener("auth:logout",()=>{S(!1)}),document.querySelectorAll(".wishlist-btn").forEach(g=>{try{let a=g.querySelector("svg"),s=a?.querySelector(".heart-fill");g.classList.contains("text-red-500")?(a?.classList.add("fill-current"),s&&(s.style.opacity="1")):s&&(s.style.opacity="0")}catch{}}),document.addEventListener("click",async g=>{let a=g.target.closest("[data-quick-add], [data-add-to-cart], .add-to-cart-btn");if(a){g.preventDefault();let s=a.dataset.productId||a.dataset.quickAdd||a.dataset.addToCart;if(!s)return;a.disabled=!0;let i=a.innerHTML;a.innerHTML='<svg class="animate-spin h-4 w-4 mx-auto" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>';try{await CartApi.addItem(s,1),Toast.success("Added to cart!"),document.dispatchEvent(new CustomEvent("cart:updated"))}catch(l){Toast.error(l.message||"Failed to add to cart.")}finally{a.disabled=!1,a.innerHTML=i}}}),document.addEventListener("click",async g=>{let a=g.target.closest("[data-wishlist-toggle], .wishlist-btn");if(a){if(g.preventDefault(),!AuthApi.isAuthenticated()){Toast.warning("Please login to add items to your wishlist."),window.location.href="/account/login/?next="+encodeURIComponent(window.location.pathname);return}let s=a.dataset.wishlistToggle||a.dataset.productId||a.closest("[data-product-id]")?.dataset.productId;a.disabled=!0;let i=a.dataset.wishlistItemId||"";!i&&a.classList.contains("text-red-500")&&(i=await y(s)||"");let u=a.classList.contains("text-red-500")&&i;try{if(u){let h=await WishlistApi.removeItem(i);a.classList.remove("text-red-500"),a.setAttribute("aria-pressed","false"),a.querySelector("svg")?.classList.remove("fill-current");let c=a.querySelector("svg")?.querySelector(".heart-fill");c&&(c.style.opacity="0"),a.removeAttribute("data-wishlist-item-id"),Toast.success("Removed from wishlist.")}else{let h=await WishlistApi.addItem(s),c=h.data?.id||h.data?.item?.id||await y(s);c&&(a.dataset.wishlistItemId=c),a.classList.add("text-red-500"),a.setAttribute("aria-pressed","true"),a.querySelector("svg")?.classList.add("fill-current");let x=a.querySelector("svg")?.querySelector(".heart-fill");x&&(x.style.opacity="1"),Toast.success(h.message||"Added to wishlist!")}}catch(h){console.error("wishlist:error",h),Toast.error(h.message||"Failed to update wishlist.")}finally{a.disabled=!1}}}),document.addEventListener("click",g=>{let a=g.target.closest("[data-quick-view], .quick-view-btn");if(a){g.preventDefault();let s=a.dataset.quickView||a.dataset.productId,i=a.dataset.productSlug;i?window.location.href=`/products/${i}/`:s&&(typeof Modal<"u"&&Modal.showQuickView?Modal.showQuickView(s):window.location.href=`/products/${s}/`)}}),document.addEventListener("click",async g=>{if(g.target.closest("[data-logout]")){g.preventDefault();try{await AuthApi.logout(),Toast.success("Logged out successfully."),document.dispatchEvent(new CustomEvent("auth:logout")),window.location.href="/"}catch{Toast.error("Failed to logout.")}}});let L=document.getElementById("back-to-top");L&&(window.addEventListener("scroll",Debounce.throttle(()=>{window.scrollY>500?L.classList.remove("opacity-0","pointer-events-none"):L.classList.add("opacity-0","pointer-events-none")},100)),L.addEventListener("click",()=>{window.scrollTo({top:0,behavior:"smooth"})}))}function S(L){document.querySelectorAll("[data-auth-state]").forEach(a=>{let s=a.dataset.authState;s==="logged-in"?a.classList.toggle("hidden",!L):s==="logged-out"&&a.classList.toggle("hidden",L)})}function E(){let L=document.getElementById("mobile-menu-btn"),g=document.getElementById("close-mobile-menu"),a=document.getElementById("mobile-menu"),s=document.getElementById("mobile-menu-overlay");function i(){a?.classList.remove("translate-x-full"),s?.classList.remove("hidden"),document.body.classList.add("overflow-hidden")}function l(){a?.classList.add("translate-x-full"),s?.classList.add("hidden"),document.body.classList.remove("overflow-hidden")}L?.addEventListener("click",i),g?.addEventListener("click",l),s?.addEventListener("click",l)}function w(){let L=document.querySelector("[data-language-selector]"),g=document.getElementById("language-dropdown");L&&g&&(Dropdown.create(L,g),g.querySelectorAll("[data-language]").forEach(a=>{a.addEventListener("click",async()=>{let s=a.dataset.language;try{await LocalizationApi.setLanguage(s),Storage.set("language",s),window.location.reload()}catch{Toast.error("Failed to change language.")}})}))}function _(){t&&typeof t.destroy=="function"&&t.destroy(),e=null,t=null}return{init:m,destroy:_,getCurrentPage:()=>e,updateCartBadge:M}})();document.readyState==="loading"?document.addEventListener("DOMContentLoaded",mt.init):mt.init();window.App=mt});Hr();})();
//# sourceMappingURL=app.bundle.js.map
