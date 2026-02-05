(()=>{var gr=Object.create;var Se=Object.defineProperty;var hr=Object.getOwnPropertyDescriptor;var fr=Object.getOwnPropertyNames;var xr=Object.getPrototypeOf,yr=Object.prototype.hasOwnProperty;var pt=n=>e=>{var s=n[e];if(s)return s();throw new Error("Module not found in bundle: "+e)};var se=(n,e)=>()=>(n&&(e=n(n=0)),e);var gt=(n,e)=>()=>(e||n((e={exports:{}}).exports,e),e.exports),ne=(n,e)=>{for(var s in e)Se(n,s,{get:e[s],enumerable:!0})},br=(n,e,s,i)=>{if(e&&typeof e=="object"||typeof e=="function")for(let p of fr(e))!yr.call(n,p)&&p!==s&&Se(n,p,{get:()=>e[p],enumerable:!(i=hr(e,p))||i.enumerable});return n};var vr=(n,e,s)=>(s=n!=null?gr(xr(n)):{},br(e||!n||!n.__esModule?Se(s,"default",{value:n,enumerable:!0}):s,n));function N(...n){return n.flat().filter(e=>e&&typeof e=="string").join(" ")}function V(n="div",{id:e="",className:s="",attrs:i={},html:p="",text:b=""}={}){let w=document.createElement(n);return e&&(w.id=e),s&&(w.className=s),b&&(w.textContent=b),p&&(w.innerHTML=p),Object.entries(i).forEach(([A,H])=>{H===!0?w.setAttribute(A,""):H!==!1&&H!==null&&w.setAttribute(A,H)}),w}function ht(n,e,s,i={}){if(n)return n.addEventListener(e,s,i),()=>n.removeEventListener(e,s,i)}function Ae(n){let e=n.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'),s=e[0],i=e[e.length-1];return{init(){n.addEventListener("keydown",p=>{p.key==="Tab"&&(p.shiftKey?document.activeElement===s&&(p.preventDefault(),i.focus()):document.activeElement===i&&(p.preventDefault(),s.focus()))})},destroy(){}}}function ft(){return"id-"+Math.random().toString(36).substr(2,9)+Date.now().toString(36)}function Te(n=""){return V("div",{className:N("fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity duration-200",n),attrs:{"data-backdrop":"true"}})}var Be,le=se(()=>{Be={isEnter:n=>n.key==="Enter",isEscape:n=>n.key==="Escape",isArrowUp:n=>n.key==="ArrowUp",isArrowDown:n=>n.key==="ArrowDown",isArrowLeft:n=>n.key==="ArrowLeft",isArrowRight:n=>n.key==="ArrowRight",isSpace:n=>n.key===" ",isTab:n=>n.key==="Tab"}});var U,de=se(()=>{le();U=class n{constructor(e={}){this.id=e.id||ft(),this.element=null,this.listeners=[],this.isInitialized=!1,this.config=e}create(e="div",{className:s="",attrs:i={},html:p=""}={}){return this.element=V(e,{id:this.id,className:s,attrs:i,html:p}),this.element}mount(e){if(!this.element)return!1;let s=typeof e=="string"?document.querySelector(e):e;return s?(s.appendChild(this.element),this.isInitialized=!0,!0):!1}on(e,s,i={}){if(!this.element)return;let p=ht(this.element,e,s,i);return this.listeners.push(p),p}delegate(e,s,i){if(!this.element)return;let p=b=>{let w=b.target.closest(e);w&&i.call(w,b)};this.element.addEventListener(s,p),this.listeners.push(()=>this.element.removeEventListener(s,p))}addClass(...e){this.element&&this.element.classList.add(...e)}removeClass(...e){this.element&&this.element.classList.remove(...e)}toggleClass(e,s){this.element&&this.element.classList.toggle(e,s)}hasClass(e){return this.element?.classList.contains(e)??!1}attr(e,s){if(this.element){if(s===void 0)return this.element.getAttribute(e);s===null||s===!1?this.element.removeAttribute(e):s===!0?this.element.setAttribute(e,""):this.element.setAttribute(e,s)}}attrs(e){Object.entries(e).forEach(([s,i])=>{this.attr(s,i)})}text(e){this.element&&(this.element.textContent=e)}html(e){this.element&&(this.element.innerHTML=e)}append(e){this.element&&e&&this.element.appendChild(e instanceof n?e.element:e)}prepend(e){this.element&&e&&this.element.prepend(e instanceof n?e.element:e)}show(){this.element&&(this.element.style.display="",this.element.removeAttribute("hidden"))}hide(){this.element&&(this.element.style.display="none")}toggle(e){this.element&&(e===void 0&&(e=this.element.style.display==="none"),e?this.show():this.hide())}getStyle(e){return this.element?window.getComputedStyle(this.element).getPropertyValue(e):null}setStyle(e,s){this.element&&(this.element.style[e]=s)}setStyles(e){Object.entries(e).forEach(([s,i])=>{this.setStyle(s,i)})}focus(e){if(this.element)try{typeof e>"u"?this.element.focus({preventScroll:!0}):this.element.focus(e)}catch{try{this.element.focus()}catch{}}}blur(){this.element&&this.element.blur()}getPosition(){return this.element?this.element.getBoundingClientRect():null}destroy(){this.listeners.forEach(e=>e?.()),this.listeners=[],this.element?.parentNode&&this.element.parentNode.removeChild(this.element),this.element=null,this.isInitialized=!1}init(){this.element&&!this.isInitialized&&(this.isInitialized=!0)}render(){return this.element}}});var xt={};ne(xt,{Alert:()=>_e});var _e,yt=se(()=>{de();le();_e=class extends U{constructor(e={}){super(e),this.title=e.title||"",this.message=e.message||"",this.type=e.type||"default",this.icon=e.icon||null,this.closeable=e.closeable||!1,this.className=e.className||""}create(){let e={default:{bg:"bg-blue-50",border:"border-blue-200",title:"text-blue-900",message:"text-blue-800",icon:"\u24D8"},success:{bg:"bg-green-50",border:"border-green-200",title:"text-green-900",message:"text-green-800",icon:"\u2713"},warning:{bg:"bg-yellow-50",border:"border-yellow-200",title:"text-yellow-900",message:"text-yellow-800",icon:"\u26A0"},error:{bg:"bg-red-50",border:"border-red-200",title:"text-red-900",message:"text-red-800",icon:"\u2715"},info:{bg:"bg-cyan-50",border:"border-cyan-200",title:"text-cyan-900",message:"text-cyan-800",icon:"\u2139"}},s=e[this.type]||e.default,p=super.create("div",{className:N("p-4 rounded-lg border-2",s.bg,s.border,this.className),attrs:{role:"alert"}}),b="";return(this.title||this.icon)&&(b+='<div class="flex items-center gap-3 mb-2">',this.icon,b+=`<span class="text-xl font-bold ${s.title}">${this.icon||s.icon}</span>`,this.title&&(b+=`<h4 class="font-semibold ${s.title}">${this.title}</h4>`),b+="</div>"),this.message&&(b+=`<p class="${s.message}">${this.message}</p>`),this.closeable&&(b+='<button class="absolute top-4 right-4 text-gray-400 hover:text-gray-600" aria-label="Close alert">\xD7</button>'),p.innerHTML=b,this.closeable&&p.querySelector("button")?.addEventListener("click",()=>{this.destroy()}),p}setMessage(e){if(this.message=e,this.element){let s=this.element.querySelector("p");s&&(s.textContent=e)}}}});var bt={};ne(bt,{AlertDialog:()=>Me});var Me,vt=se(()=>{de();le();Me=class extends U{constructor(e={}){super(e),this.title=e.title||"",this.message=e.message||"",this.confirmText=e.confirmText||"Confirm",this.cancelText=e.cancelText||"Cancel",this.type=e.type||"warning",this.onConfirm=e.onConfirm||null,this.onCancel=e.onCancel||null,this.open=e.open||!1}create(){let e=super.create("div",{className:N("fixed inset-0 z-50 flex items-center justify-center",this.open?"":"hidden"),attrs:{role:"alertdialog","aria-modal":"true","aria-labelledby":`${this.id}-title`,"aria-describedby":`${this.id}-message`}}),s=Te();e.appendChild(s);let i=document.createElement("div");i.className="bg-white rounded-lg shadow-lg relative z-50 w-full max-w-md mx-4";let p=document.createElement("div");p.className="px-6 py-4 border-b border-gray-200";let b=document.createElement("h2");b.id=`${this.id}-title`,b.className="text-lg font-semibold text-gray-900",b.textContent=this.title,p.appendChild(b),i.appendChild(p);let w=document.createElement("div");w.id=`${this.id}-message`,w.className="px-6 py-4 text-gray-700",w.textContent=this.message,i.appendChild(w);let A=document.createElement("div");A.className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex gap-3 justify-end rounded-b-lg";let H=document.createElement("button");H.className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100 transition-colors duration-200",H.textContent=this.cancelText,H.addEventListener("click",()=>this.handleCancel()),A.appendChild(H);let Q=document.createElement("button"),ae=this.type==="danger"?"bg-red-600 text-white hover:bg-red-700":"bg-blue-600 text-white hover:bg-blue-700";return Q.className=N("px-4 py-2 rounded-md transition-colors duration-200",ae),Q.textContent=this.confirmText,Q.addEventListener("click",()=>this.handleConfirm()),A.appendChild(Q),i.appendChild(A),e.appendChild(i),this.focusTrap=Ae(i),e}open(){this.element||this.create(),this.open=!0,this.element.classList.remove("hidden"),this.focusTrap.init(),document.body.style.overflow="hidden"}close(){this.open=!1,this.element?.classList.add("hidden"),document.body.style.overflow=""}handleConfirm(){this.onConfirm&&this.onConfirm(),this.close()}handleCancel(){this.onCancel&&this.onCancel(),this.close()}}});var wt={};ne(wt,{Avatar:()=>qe});var qe,kt=se(()=>{de();le();qe=class extends U{constructor(e={}){super(e),this.src=e.src||"",this.alt=e.alt||"",this.initials=e.initials||"",this.size=e.size||"md",this.className=e.className||"",this.fallbackBg=e.fallbackBg||"bg-blue-600"}create(){let e={xs:"w-6 h-6 text-xs",sm:"w-8 h-8 text-sm",md:"w-10 h-10 text-base",lg:"w-12 h-12 text-lg",xl:"w-16 h-16 text-xl"},s="rounded-full overflow-hidden flex items-center justify-center flex-shrink-0 font-semibold";return this.src?super.create("img",{className:N(s,e[this.size],this.className),attrs:{src:this.src,alt:this.alt,role:"img"}}):this.initials?super.create("div",{className:N(s,e[this.size],"text-white",this.fallbackBg,this.className),text:this.initials.toUpperCase()}):super.create("div",{className:N(s,e[this.size],"bg-gray-300",this.className),html:'<svg class="w-full h-full text-gray-500" fill="currentColor" viewBox="0 0 24 24"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>'})}setSrc(e,s=""){this.src=e,this.alt=s,this.element&&this.element.tagName==="IMG"&&(this.element.src=e,this.element.alt=s)}setInitials(e,s=""){if(this.initials=e,s&&(this.fallbackBg=s),this.element&&(this.element.textContent=e.toUpperCase(),s&&this.element.className.includes("bg-"))){let i=this.element.className.match(/bg-\S+/)[0];this.element.classList.remove(i),this.element.classList.add(s)}}}});var Et={};ne(Et,{Badge:()=>Pe});var Pe,Ct=se(()=>{de();le();Pe=class extends U{constructor(e={}){super(e),this.label=e.label||"Badge",this.variant=e.variant||"default",this.size=e.size||"md",this.className=e.className||""}create(){let e="inline-flex items-center rounded font-semibold whitespace-nowrap",s={default:"bg-gray-100 text-gray-800",primary:"bg-blue-100 text-blue-800",success:"bg-green-100 text-green-800",warning:"bg-yellow-100 text-yellow-800",destructive:"bg-red-100 text-red-800",outline:"border border-gray-300 text-gray-700"},i={sm:"px-2 py-1 text-xs",md:"px-3 py-1 text-sm",lg:"px-4 py-2 text-base"},p=super.create("span",{className:N(e,s[this.variant],i[this.size],this.className)});return p.textContent=this.label,p}setLabel(e){this.label=e,this.element&&(this.element.textContent=e)}}});var Lt={};ne(Lt,{Button:()=>He});var He,$t=se(()=>{de();le();He=class extends U{constructor(e={}){super(e),this.label=e.label||"Button",this.variant=e.variant||"default",this.size=e.size||"md",this.disabled=e.disabled||!1,this.onClick=e.onClick||null,this.className=e.className||""}create(){let e="px-4 py-2 font-medium rounded transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-offset-2",s={default:"bg-gray-200 text-gray-900 hover:bg-gray-300",primary:"bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500",secondary:"bg-green-600 text-white hover:bg-green-700 focus:ring-green-500",destructive:"bg-red-600 text-white hover:bg-red-700 focus:ring-red-500",outline:"border-2 border-gray-300 text-gray-900 hover:bg-gray-50",ghost:"text-gray-900 hover:bg-gray-100"},i={sm:"px-2 py-1 text-sm",md:"px-4 py-2 text-base",lg:"px-6 py-3 text-lg"},p=super.create("button",{className:N(e,s[this.variant],i[this.size],this.className),attrs:{disabled:this.disabled}});return p.textContent=this.label,this.onClick&&this.on("click",this.onClick),p}setLabel(e){this.label=e,this.element&&(this.element.textContent=e)}setDisabled(e){this.disabled=e,this.attr("disabled",e?"":null)}setLoading(e){this.setDisabled(e),e?this.html('<span class="flex items-center gap-2"><span class="inline-block w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></span>Loading...</span>'):this.text(this.label)}}});var Tt={};ne(Tt,{ButtonGroup:()=>je});var je,It=se(()=>{de();le();je=class extends U{constructor(e={}){super(e),this.buttons=e.buttons||[],this.orientation=e.orientation||"horizontal",this.size=e.size||"md",this.className=e.className||""}create(){let e=this.orientation==="vertical"?"flex-col":"flex-row",i=super.create("div",{className:N("flex",e,"inline-flex border border-gray-300 rounded-md overflow-hidden",this.className),attrs:{role:"group"}});return this.buttons.forEach((p,b)=>{let w=document.createElement("button");w.textContent=p.label||"Button",w.className=N("px-4 py-2 font-medium text-gray-700 hover:bg-gray-50 transition-colors duration-200",b>0?this.orientation==="vertical"?"border-t border-gray-300":"border-l border-gray-300":"",p.disabled?"opacity-50 cursor-not-allowed":""),w.disabled=p.disabled||!1,p.onClick&&w.addEventListener("click",p.onClick),i.appendChild(w)}),i}addButton(e,s){if(this.element){let i=document.createElement("button");i.textContent=e,i.className=N("px-4 py-2 font-medium text-gray-700 hover:bg-gray-50 transition-colors duration-200 border-l border-gray-300"),s&&i.addEventListener("click",s),this.element.appendChild(i)}}}});var At={};ne(At,{Breadcrumb:()=>Ne});var Ne,Bt=se(()=>{de();le();Ne=class extends U{constructor(e={}){super(e),this.items=e.items||[],this.className=e.className||""}create(){let s=super.create("nav",{className:N("flex items-center gap-2",this.className),attrs:{"aria-label":"Breadcrumb"}});return this.items.forEach((i,p)=>{if(p>0){let b=V("span",{className:"text-gray-400 mx-1",text:"/"});s.appendChild(b)}if(p===this.items.length-1){let b=V("span",{className:"text-gray-700 font-medium",text:i.label,attrs:{"aria-current":"page"}});s.appendChild(b)}else{let b=V("a",{className:"text-blue-600 hover:text-blue-800 hover:underline transition-colors duration-200",text:i.label,attrs:{href:i.href||"#"}});s.appendChild(b)}}),s}addItem(e,s="#"){if(this.element){if(this.element.children.length>0){let p=V("span",{className:"text-gray-400 mx-1",text:"/"});this.element.appendChild(p)}let i=V("a",{className:"text-blue-600 hover:text-blue-800 hover:underline transition-colors duration-200",text:e,attrs:{href:s}});this.element.appendChild(i),this.items.push({label:e,href:s})}}}});var St={};ne(St,{Card:()=>Fe});var Fe,_t=se(()=>{de();le();Fe=class extends U{constructor(e={}){super(e),this.title=e.title||"",this.subtitle=e.subtitle||"",this.content=e.content||"",this.footer=e.footer||"",this.className=e.className||"",this.hoverable=e.hoverable!==!1}create(){let e="bg-white rounded-lg border border-gray-200 overflow-hidden",s=this.hoverable?"hover:shadow-lg transition-shadow duration-300":"",i=super.create("div",{className:N(e,s,this.className)});if(this.title){let p=V("div",{className:"px-6 py-4 border-b border-gray-200 bg-gray-50"}),b=`<h3 class="text-lg font-semibold text-gray-900">${this.title}</h3>`;this.subtitle&&(b+=`<p class="text-sm text-gray-600 mt-1">${this.subtitle}</p>`),p.innerHTML=b,i.appendChild(p)}if(this.content){let p=V("div",{className:"px-6 py-4",html:this.content});i.appendChild(p)}if(this.footer){let p=V("div",{className:"px-6 py-4 border-t border-gray-200 bg-gray-50",html:this.footer});i.appendChild(p)}return i}setContent(e){if(this.content=e,this.element){let s=this.element.querySelector(".px-6.py-4:not(.border-b):not(.border-t)");s&&(s.innerHTML=e)}}addContent(e){if(this.element){let s=this.element.querySelector(".px-6.py-4:not(.border-b):not(.border-t)");s&&s.appendChild(e instanceof U?e.element:e)}}}});var Mt={};ne(Mt,{Carousel:()=>ze});var ze,qt=se(()=>{de();le();ze=class extends U{constructor(e={}){super(e),this.items=e.items||[],this.autoplay=e.autoplay||!0,this.interval=e.interval||5e3,this.className=e.className||"",this.currentIndex=0,this.autoplayTimer=null}create(){let e=super.create("div",{className:N("relative w-full bg-black rounded-lg overflow-hidden",this.className)}),s=V("div",{className:"relative w-full h-96 overflow-hidden"});this.items.forEach((w,A)=>{let H=V("div",{className:N("absolute inset-0 transition-opacity duration-500",A===this.currentIndex?"opacity-100":"opacity-0")}),Q=document.createElement("img");if(Q.src=w.src,Q.alt=w.alt||"",Q.className="w-full h-full object-cover",H.appendChild(Q),w.title){let ae=V("div",{className:"absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4",html:`<p class="text-white font-semibold">${w.title}</p>`});H.appendChild(ae)}s.appendChild(H)}),e.appendChild(s);let i=V("button",{className:"absolute left-4 top-1/2 transform -translate-y-1/2 z-10 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75 transition-all",html:"\u276E"});i.addEventListener("click",()=>{this.previous()});let p=V("button",{className:"absolute right-4 top-1/2 transform -translate-y-1/2 z-10 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75 transition-all",html:"\u276F"});p.addEventListener("click",()=>{this.next()}),e.appendChild(i),e.appendChild(p);let b=V("div",{className:"absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2 z-10"});return this.items.forEach((w,A)=>{let H=V("button",{className:N("w-2 h-2 rounded-full transition-all",A===this.currentIndex?"bg-white w-8":"bg-gray-500"),attrs:{"data-index":A}});H.addEventListener("click",()=>{this.goTo(A)}),b.appendChild(H)}),e.appendChild(b),this.slidesElement=s,this.dotsElement=b,this.autoplay&&this.startAutoplay(),e}next(){this.currentIndex=(this.currentIndex+1)%this.items.length,this.updateSlides()}previous(){this.currentIndex=(this.currentIndex-1+this.items.length)%this.items.length,this.updateSlides()}goTo(e){this.currentIndex=e,this.updateSlides(),this.autoplay&&this.resetAutoplay()}updateSlides(){let e=this.slidesElement.querySelectorAll("div"),s=this.dotsElement.querySelectorAll("button");e.forEach((i,p)=>{i.className=N("absolute inset-0 transition-opacity duration-500",p===this.currentIndex?"opacity-100":"opacity-0")}),s.forEach((i,p)=>{i.className=N("w-2 h-2 rounded-full transition-all",p===this.currentIndex?"bg-white w-8":"bg-gray-500")})}startAutoplay(){this.autoplayTimer=setInterval(()=>{this.next()},this.interval)}stopAutoplay(){this.autoplayTimer&&clearInterval(this.autoplayTimer)}resetAutoplay(){this.stopAutoplay(),this.autoplay&&this.startAutoplay()}destroy(){this.stopAutoplay(),super.destroy()}}});var Pt={};ne(Pt,{Chart:()=>Re});var Re,Ht=se(()=>{de();le();Re=class extends U{constructor(e={}){super(e),this.type=e.type||"bar",this.data=e.data||[],this.title=e.title||"",this.height=e.height||"300px",this.className=e.className||""}create(){let e=super.create("div",{className:N("bg-white rounded-lg border border-gray-200 p-4",this.className)});if(this.title){let i=V("h3",{className:"text-lg font-semibold text-gray-900 mb-4",text:this.title});e.appendChild(i)}let s=this.createSVG();return e.appendChild(s),e}createSVG(){let e=Math.max(...this.data.map(w=>w.value)),s=400,i=200,p=40,b=document.createElementNS("http://www.w3.org/2000/svg","svg");if(b.setAttribute("viewBox",`0 0 ${s} ${i}`),b.setAttribute("class","w-full"),this.type==="bar"){let w=(s-p*2)/this.data.length;this.data.forEach((A,H)=>{let Q=A.value/e*(i-p*2),ae=p+H*w+w*.25,O=i-p-Q,E=document.createElementNS("http://www.w3.org/2000/svg","rect");E.setAttribute("x",ae),E.setAttribute("y",O),E.setAttribute("width",w*.5),E.setAttribute("height",Q),E.setAttribute("fill","#3b82f6"),E.setAttribute("class","hover:fill-blue-700 transition-colors"),b.appendChild(E);let _=document.createElementNS("http://www.w3.org/2000/svg","text");_.setAttribute("x",ae+w*.25),_.setAttribute("y",i-10),_.setAttribute("text-anchor","middle"),_.setAttribute("font-size","12"),_.setAttribute("fill","#6b7280"),_.textContent=A.label,b.appendChild(_)})}return b}setData(e){if(this.data=e,this.element&&this.element.parentNode){let s=this.create();this.element.parentNode.replaceChild(s,this.element),this.element=s}}}});var jt={};ne(jt,{Checkbox:()=>Oe});var Oe,Nt=se(()=>{de();le();Oe=class extends U{constructor(e={}){super(e),this.label=e.label||"",this.checked=e.checked||!1,this.disabled=e.disabled||!1,this.required=e.required||!1,this.name=e.name||"",this.className=e.className||"",this.onChange=e.onChange||null}create(){let s=super.create("div",{className:N("flex items-center gap-2",this.className)}),i="w-5 h-5 border-2 border-gray-300 rounded cursor-pointer transition-colors duration-200 checked:bg-blue-600 checked:border-blue-600 disabled:opacity-50 disabled:cursor-not-allowed",p=document.createElement("input");if(p.type="checkbox",p.className=i,p.checked=this.checked,p.disabled=this.disabled,p.required=this.required,this.name&&(p.name=this.name),s.appendChild(p),this.label){let b=document.createElement("label");b.className="cursor-pointer select-none",b.textContent=this.label,s.appendChild(b),b.addEventListener("click",()=>{p.click()})}return this.onChange&&p.addEventListener("change",this.onChange),this.inputElement=p,s}isChecked(){return this.inputElement?.checked||!1}setChecked(e){this.checked=e,this.inputElement&&(this.inputElement.checked=e)}setDisabled(e){this.disabled=e,this.inputElement&&(this.inputElement.disabled=e)}toggle(){this.setChecked(!this.isChecked())}}});var Ft={};ne(Ft,{Collapsible:()=>De});var De,zt=se(()=>{de();le();De=class extends U{constructor(e={}){super(e),this.title=e.title||"",this.content=e.content||"",this.open=e.open||!1,this.className=e.className||"",this.onChange=e.onChange||null}create(){let e=super.create("div",{className:N("border border-gray-200 rounded-lg overflow-hidden",this.className)}),s=V("button",{className:N("w-full px-4 py-3 flex items-center justify-between","hover:bg-gray-50 transition-colors duration-200 text-left"),attrs:{"aria-expanded":this.open}}),i=V("span",{className:"font-semibold text-gray-900",text:this.title}),p=V("span",{className:N("w-5 h-5 transition-transform duration-300",this.open?"rotate-180":""),html:"\u25BC"});s.appendChild(i),s.appendChild(p),s.addEventListener("click",()=>{this.toggle()}),e.appendChild(s);let b=V("div",{className:N("overflow-hidden transition-all duration-300",this.open?"max-h-96":"max-h-0","border-t border-gray-200")}),w=V("div",{className:"px-4 py-3",html:this.content});return b.appendChild(w),e.appendChild(b),this.triggerElement=s,this.contentElement=b,this.chevron=p,e}toggle(){this.open=!this.open,this.updateUI(),this.onChange&&this.onChange(this.open)}open(){this.open||(this.open=!0,this.updateUI(),this.onChange&&this.onChange(!0))}close(){this.open&&(this.open=!1,this.updateUI(),this.onChange&&this.onChange(!1))}updateUI(){this.triggerElement.setAttribute("aria-expanded",this.open),this.contentElement.className=N("overflow-hidden transition-all duration-300",this.open?"max-h-96":"max-h-0","border-t border-gray-200"),this.chevron.className=N("w-5 h-5 transition-transform duration-300",this.open?"rotate-180":"")}setContent(e){if(this.content=e,this.contentElement){let s=this.contentElement.querySelector("div");s&&(s.innerHTML=e)}}}});var Rt={};ne(Rt,{Command:()=>Ve});var Ve,Ot=se(()=>{de();le();Ve=class extends U{constructor(e={}){super(e),this.commands=e.commands||[],this.placeholder=e.placeholder||"Type a command...",this.className=e.className||"",this.open=!1}create(){let e=super.create("div",{className:N("fixed inset-0 z-50 hidden flex items-start justify-center pt-20",this.open?"flex":"")}),s=V("div",{className:"absolute inset-0 bg-black bg-opacity-50"});e.appendChild(s),s.addEventListener("click",()=>this.close());let i=V("div",{className:"relative w-full max-w-md bg-white rounded-lg shadow-lg z-50"}),p=document.createElement("input");p.type="text",p.placeholder=this.placeholder,p.className="w-full px-4 py-3 border-b border-gray-200 focus:outline-none",p.autofocus=!0,i.appendChild(p);let b=V("div",{className:"max-h-96 overflow-y-auto"}),w=(A="")=>{b.innerHTML="";let H=A?this.commands.filter(ae=>ae.label.toLowerCase().includes(A.toLowerCase())):this.commands;if(H.length===0){let ae=V("div",{className:"px-4 py-3 text-sm text-gray-500",text:"No commands found"});b.appendChild(ae);return}let Q="";H.forEach(ae=>{if(ae.category&&ae.category!==Q){Q=ae.category;let _=V("div",{className:"px-4 py-2 text-xs font-semibold text-gray-600 bg-gray-50 uppercase",text:Q});b.appendChild(_)}let O=V("div",{className:N("px-4 py-2 cursor-pointer hover:bg-blue-50 transition-colors flex items-center justify-between group")}),E=V("span",{text:ae.label,className:"text-sm text-gray-900"});if(O.appendChild(E),ae.shortcut){let _=V("span",{className:"text-xs text-gray-500 group-hover:text-gray-700",text:ae.shortcut});O.appendChild(_)}O.addEventListener("click",()=>{ae.action&&ae.action(),this.close()}),b.appendChild(O)})};return p.addEventListener("input",A=>{w(A.target.value)}),i.appendChild(b),e.appendChild(i),p.addEventListener("keydown",A=>{A.key==="Escape"&&this.close()}),w(),this.containerElement=e,e}open(){this.element||this.create(),this.open=!0,this.element.classList.remove("hidden"),this.element.classList.add("flex")}close(){this.open=!1,this.element?.classList.remove("flex"),this.element?.classList.add("hidden")}toggle(){this.open?this.close():this.open()}}});var Dt={};ne(Dt,{Combobox:()=>Ue});var Ue,Vt=se(()=>{de();le();Ue=class extends U{constructor(e={}){super(e),this.items=e.items||[],this.value=e.value||"",this.placeholder=e.placeholder||"Search...",this.className=e.className||"",this.onChange=e.onChange||null,this.open=!1}create(){let e=super.create("div",{className:"relative w-full"}),s=document.createElement("input");s.type="text",s.placeholder=this.placeholder,s.value=this.value,s.className=N("w-full px-3 py-2 border border-gray-300 rounded-md","focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent");let i=V("div",{className:N("absolute hidden top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-md shadow-lg z-50","max-h-64 overflow-y-auto")}),p=(b="")=>{i.innerHTML="";let w=this.items.filter(A=>A.label.toLowerCase().includes(b.toLowerCase()));if(w.length===0){let A=V("div",{className:"px-3 py-2 text-gray-500",text:"No results found"});i.appendChild(A);return}w.forEach(A=>{let H=V("div",{className:N("px-3 py-2 cursor-pointer hover:bg-blue-50 transition-colors",A.value===this.value?"bg-blue-100":""),text:A.label,attrs:{"data-value":A.value}});H.addEventListener("click",()=>{this.value=A.value,s.value=A.label,i.classList.add("hidden"),this.onChange&&this.onChange(this.value,A)}),i.appendChild(H)})};return s.addEventListener("input",b=>{p(b.target.value),i.classList.remove("hidden")}),s.addEventListener("focus",()=>{p(s.value),i.classList.remove("hidden")}),s.addEventListener("blur",()=>{setTimeout(()=>{i.classList.add("hidden")},150)}),e.appendChild(s),e.appendChild(i),document.addEventListener("click",b=>{e.contains(b.target)||i.classList.add("hidden")}),this.inputElement=s,this.listElement=i,p(),e}getValue(){return this.value}setValue(e){this.value=e;let s=this.items.find(i=>i.value===e);s&&this.inputElement&&(this.inputElement.value=s.label)}}});var Ut={};ne(Ut,{ContextMenu:()=>We});var We,Wt=se(()=>{de();le();We=class extends U{constructor(e={}){super(e),this.items=e.items||[],this.className=e.className||"",this.visible=!1}create(){let e=super.create("div",{className:"relative inline-block w-full"}),s=document.createElement("div");return s.className=N("absolute hidden bg-white border border-gray-200 rounded-lg shadow-lg py-1 z-50 min-w-max",this.className),this.items.forEach(i=>{let p=V("button",{className:N("w-full text-left px-4 py-2 hover:bg-gray-100 transition-colors duration-200 flex items-center gap-2",i.disabled?"opacity-50 cursor-not-allowed":"cursor-pointer"),attrs:{disabled:i.disabled?"":null,"data-action":i.label}});if(i.icon){let w=document.createElement("span");w.innerHTML=i.icon,p.appendChild(w)}let b=document.createElement("span");b.textContent=i.label,p.appendChild(b),p.addEventListener("click",()=>{!i.disabled&&i.onClick&&i.onClick(),this.hide()}),s.appendChild(p)}),e.appendChild(s),e.addEventListener("contextmenu",i=>{i.preventDefault(),this.showAt(i.clientX,i.clientY,s)}),document.addEventListener("click",()=>{this.visible&&this.hide()}),this.menuElement=s,e}showAt(e,s,i){i&&(this.visible=!0,i.classList.remove("hidden"),i.style.position="fixed",i.style.left=e+"px",i.style.top=s+"px")}hide(){this.visible=!1,this.menuElement&&(this.menuElement.classList.add("hidden"),this.menuElement.style.position="absolute")}addItem(e,s,i=null){let p={label:e,onClick:s,icon:i};if(this.items.push(p),this.menuElement){let b=V("button",{className:"w-full text-left px-4 py-2 hover:bg-gray-100 transition-colors duration-200 flex items-center gap-2"});if(i){let w=document.createElement("span");w.innerHTML=i,b.appendChild(w)}b.textContent=e,b.addEventListener("click",()=>{s(),this.hide()}),this.menuElement.appendChild(b)}}}});var Yt={};ne(Yt,{DatePicker:()=>Ye});var Ye,Qt=se(()=>{de();le();Ye=class extends U{constructor(e={}){super(e),this.value=e.value||"",this.placeholder=e.placeholder||"Select date...",this.format=e.format||"yyyy-mm-dd",this.className=e.className||"",this.onChange=e.onChange||null,this.open=!1}create(){let e=super.create("div",{className:"relative w-full"}),s=document.createElement("input");s.type="text",s.placeholder=this.placeholder,s.value=this.value,s.className=N("w-full px-3 py-2 border border-gray-300 rounded-md","focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"),s.addEventListener("click",()=>{this.openPicker()}),s.addEventListener("change",p=>{this.value=p.target.value,this.onChange&&this.onChange(this.value)}),e.appendChild(s);let i=document.createElement("input");return i.type="date",i.style.display="none",i.value=this.value,i.addEventListener("change",p=>{let b=new Date(p.target.value);this.value=this.formatDate(b),s.value=this.value,this.onChange&&this.onChange(this.value)}),e.appendChild(i),this.inputElement=s,this.nativeInput=i,e}openPicker(){this.nativeInput.click()}formatDate(e){let s=e.getFullYear(),i=String(e.getMonth()+1).padStart(2,"0"),p=String(e.getDate()).padStart(2,"0");return this.format==="dd/mm/yyyy"?`${p}/${i}/${s}`:`${s}-${i}-${p}`}getValue(){return this.value}setValue(e){this.value=e,this.inputElement&&(this.inputElement.value=e)}}});var Gt={};ne(Gt,{Dialog:()=>Qe});var Qe,Jt=se(()=>{de();le();Qe=class extends U{constructor(e={}){super(e),this.title=e.title||"",this.content=e.content||"",this.size=e.size||"md",this.open=e.open||!1,this.onClose=e.onClose||null,this.closeButton=e.closeButton!==!1,this.closeOnBackdrop=e.closeOnBackdrop!==!1,this.closeOnEscape=e.closeOnEscape!==!1}create(){let e=super.create("div",{className:N("fixed inset-0 z-50 flex items-center justify-center",this.open?"":"hidden"),attrs:{role:"dialog","aria-modal":"true","aria-labelledby":`${this.id}-title`,"aria-describedby":`${this.id}-description`}}),s=Te("dialog-backdrop");e.appendChild(s),this.closeOnBackdrop&&s.addEventListener("click",()=>this.close());let i={sm:"w-full max-w-sm",md:"w-full max-w-md",lg:"w-full max-w-lg",xl:"w-full max-w-xl"},p=document.createElement("div");if(p.className=N("bg-white rounded-lg shadow-lg relative z-50",i[this.size],"mx-4 max-h-[90vh] overflow-y-auto"),this.title){let b=document.createElement("div");b.className="px-6 py-4 border-b border-gray-200 flex items-center justify-between";let w=document.createElement("h2");if(w.id=`${this.id}-title`,w.className="text-xl font-semibold text-gray-900",w.textContent=this.title,b.appendChild(w),this.closeButton){let A=document.createElement("button");A.className="text-gray-500 hover:text-gray-700 transition-colors duration-200",A.innerHTML="\xD7",A.setAttribute("aria-label","Close"),A.addEventListener("click",()=>this.close()),b.appendChild(A)}p.appendChild(b)}if(this.content){let b=document.createElement("div");b.id=`${this.id}-description`,b.className="px-6 py-4",b.innerHTML=this.content,p.appendChild(b)}return e.appendChild(p),this.on("keydown",b=>{Be.isEscape(b)&&this.closeOnEscape&&this.close()},{once:!1}),this.backdrop=s,this.dialogElement=p,this.focusTrap=Ae(p),e}open(){this.element||this.create(),this.open=!0,this.element.classList.remove("hidden"),this.focusTrap.init(),document.body.style.overflow="hidden"}close(){this.open=!1,this.element?.classList.add("hidden"),document.body.style.overflow="",this.onClose&&this.onClose()}toggle(){this.open?this.close():this.open()}setContent(e){if(this.content=e,this.dialogElement){let s=this.dialogElement.querySelector(`#${this.id}-description`);s&&(s.innerHTML=e)}}}});var Xt={};ne(Xt,{DropdownMenu:()=>Ge});var Ge,Kt=se(()=>{de();le();Ge=class extends U{constructor(e={}){super(e),this.trigger=e.trigger||"Menu",this.items=e.items||[],this.position=e.position||"bottom",this.align=e.align||"left",this.className=e.className||"",this.open=!1}create(){let e=super.create("div",{className:"relative inline-block"}),s=document.createElement("button");s.className="px-4 py-2 bg-gray-100 text-gray-900 rounded hover:bg-gray-200 transition-colors duration-200 flex items-center gap-2",s.innerHTML=`${this.trigger} <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 14l-7 7m0 0l-7-7m7 7V3"></path></svg>`,s.addEventListener("click",()=>this.toggle()),e.appendChild(s);let i=this.position==="top"?"bottom-full mb-2":"top-full mt-2",p=this.align==="right"?"right-0":"left-0",b=document.createElement("div");return b.className=N("absolute hidden bg-white border border-gray-200 rounded-lg shadow-lg py-1 z-50 min-w-max",i,p,this.className),this.items.forEach(w=>{if(w.divider){let Q=document.createElement("div");Q.className="border-t border-gray-200 my-1",b.appendChild(Q);return}let A=V("button",{className:N("w-full text-left px-4 py-2 hover:bg-gray-100 transition-colors duration-200 flex items-center gap-2",w.disabled?"opacity-50 cursor-not-allowed":"cursor-pointer"),attrs:{disabled:w.disabled?"":null}});if(w.icon){let Q=document.createElement("span");Q.innerHTML=w.icon,Q.className="w-4 h-4",A.appendChild(Q)}let H=document.createElement("span");H.textContent=w.label,A.appendChild(H),A.addEventListener("click",()=>{!w.disabled&&w.onClick&&w.onClick(),this.close()}),b.appendChild(A)}),e.appendChild(b),document.addEventListener("click",w=>{!e.contains(w.target)&&this.open&&this.close()}),this.triggerBtn=s,this.menuElement=b,e}toggle(){this.open?this.close():this.open()}open(){this.open=!0,this.menuElement.classList.remove("hidden")}close(){this.open=!1,this.menuElement.classList.add("hidden")}addItem(e,s,i=null){let p={label:e,onClick:s,icon:i};if(this.items.push(p),this.menuElement){let b=V("button",{className:"w-full text-left px-4 py-2 hover:bg-gray-100 transition-colors duration-200 flex items-center gap-2"});if(i){let A=document.createElement("span");A.innerHTML=i,A.className="w-4 h-4",b.appendChild(A)}let w=document.createElement("span");w.textContent=e,b.appendChild(w),b.addEventListener("click",()=>{s(),this.close()}),this.menuElement.appendChild(b)}}}});var Zt={};ne(Zt,{Drawer:()=>Je});var Je,es=se(()=>{de();le();Je=class extends U{constructor(e={}){super(e),this.title=e.title||"",this.content=e.content||"",this.position=e.position||"right",this.open=e.open||!1,this.onClose=e.onClose||null,this.closeButton=e.closeButton!==!1,this.closeOnBackdrop=e.closeOnBackdrop!==!1,this.closeOnEscape=e.closeOnEscape!==!1}create(){let e=super.create("div",{className:N("fixed inset-0 z-50",this.open?"":"hidden")}),s=Te();e.appendChild(s),this.closeOnBackdrop&&s.addEventListener("click",()=>this.close());let i=this.position==="left"?"left-0":"right-0",p=document.createElement("div");if(p.className=N("absolute top-0 h-full w-96 bg-white shadow-lg transition-transform duration-300 flex flex-col z-50",i,this.open?"translate-x-0":this.position==="left"?"-translate-x-full":"translate-x-full"),this.title){let w=document.createElement("div");w.className="px-6 py-4 border-b border-gray-200 flex items-center justify-between";let A=document.createElement("h2");if(A.className="text-xl font-semibold text-gray-900",A.textContent=this.title,w.appendChild(A),this.closeButton){let H=document.createElement("button");H.className="text-gray-500 hover:text-gray-700 transition-colors duration-200",H.innerHTML="\xD7",H.addEventListener("click",()=>this.close()),w.appendChild(H)}p.appendChild(w)}let b=document.createElement("div");return b.className="flex-1 overflow-y-auto px-6 py-4",b.innerHTML=this.content,p.appendChild(b),e.appendChild(p),this.on("keydown",w=>{Be.isEscape(w)&&this.closeOnEscape&&this.close()},{once:!1}),this.backdrop=s,this.drawerElement=p,e}open(){this.element||this.create(),this.open=!0,this.element.classList.remove("hidden"),this.drawerElement.classList.remove("-translate-x-full","translate-x-full"),this.drawerElement.classList.add("translate-x-0"),document.body.style.overflow="hidden"}close(){this.open=!1;let e=this.position==="left"?"-translate-x-full":"translate-x-full";this.drawerElement.classList.remove("translate-x-0"),this.drawerElement.classList.add(e),setTimeout(()=>{this.element?.parentNode&&this.element.classList.add("hidden"),document.body.style.overflow=""},300),this.onClose&&this.onClose()}toggle(){this.open?this.close():this.open()}}});var ts={};ne(ts,{Empty:()=>Xe});var Xe,ss=se(()=>{de();le();Xe=class extends U{constructor(e={}){super(e),this.icon=e.icon||"\u{1F4E6}",this.title=e.title||"No data",this.message=e.message||"There is no data to display",this.action=e.action||null,this.className=e.className||""}create(){let e=super.create("div",{className:N("flex flex-col items-center justify-center p-8 text-center",this.className)}),s=V("div",{className:"text-6xl mb-4",text:this.icon});e.appendChild(s);let i=V("h3",{className:"text-lg font-semibold text-gray-900 mb-2",text:this.title});e.appendChild(i);let p=V("p",{className:"text-gray-500 mb-4",text:this.message});if(e.appendChild(p),this.action){let b=V("button",{className:"px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors",text:this.action.label});b.addEventListener("click",this.action.onClick),e.appendChild(b)}return e}}});var rs={};ne(rs,{Form:()=>Ke});var Ke,as=se(()=>{de();le();Ke=class extends U{constructor(e={}){super(e),this.fields=e.fields||[],this.onSubmit=e.onSubmit||null,this.submitText=e.submitText||"Submit",this.className=e.className||""}create(){let e=super.create("form",{className:N("space-y-6",this.className)});e.addEventListener("submit",i=>{i.preventDefault(),this.handleSubmit()}),this.fieldElements={},this.fields.forEach(i=>{let p=V("div",{className:"space-y-2"});if(i.label){let A=V("label",{className:"block text-sm font-medium text-gray-700",text:i.label,attrs:{for:i.name}});p.appendChild(A)}let b=document.createElement(i.type==="textarea"?"textarea":"input");b.id=i.name,b.name=i.name,b.className=N("w-full px-3 py-2 border border-gray-300 rounded-md","focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"),i.type!=="textarea"&&(b.type=i.type||"text"),i.placeholder&&(b.placeholder=i.placeholder),i.required&&(b.required=!0),i.disabled&&(b.disabled=!0),b.value=i.value||"",p.appendChild(b);let w=V("div",{className:"text-sm text-red-600 hidden",attrs:{"data-error":i.name}});p.appendChild(w),e.appendChild(p),this.fieldElements[i.name]=b});let s=V("button",{className:N("w-full px-4 py-2 bg-blue-600 text-white font-medium rounded","hover:bg-blue-700 transition-colors duration-200"),text:this.submitText,attrs:{type:"submit"}});return e.appendChild(s),e}handleSubmit(){let e={};Object.entries(this.fieldElements).forEach(([s,i])=>{e[s]=i.value}),this.onSubmit&&this.onSubmit(e)}getValues(){let e={};return Object.entries(this.fieldElements).forEach(([s,i])=>{e[s]=i.value}),e}setValues(e){Object.entries(e).forEach(([s,i])=>{this.fieldElements[s]&&(this.fieldElements[s].value=i)})}setError(e,s){let i=this.element.querySelector(`[data-error="${e}"]`);i&&(i.textContent=s,i.classList.remove("hidden"))}clearError(e){let s=this.element.querySelector(`[data-error="${e}"]`);s&&(s.textContent="",s.classList.add("hidden"))}reset(){this.element&&this.element.reset()}}});var ns={};ne(ns,{HoverCard:()=>Ze});var Ze,os=se(()=>{de();le();Ze=class extends U{constructor(e={}){super(e),this.trigger=e.trigger||"Hover me",this.content=e.content||"",this.position=e.position||"bottom",this.delay=e.delay||200,this.className=e.className||"",this.visible=!1,this.timeoutId=null}create(){let e=super.create("div",{className:"relative inline-block"}),s=document.createElement("div");s.className="cursor-pointer px-3 py-2 rounded hover:bg-gray-100 transition-colors duration-200",s.textContent=this.trigger,e.appendChild(s);let i=document.createElement("div");return i.className=N("absolute hidden bg-white border border-gray-200 rounded-lg shadow-lg p-4 z-50","min-w-max max-w-sm",this.getPositionClasses(),this.className),i.innerHTML=this.content,e.appendChild(i),e.addEventListener("mouseenter",()=>this.show(i)),e.addEventListener("mouseleave",()=>this.hide(i)),this.cardElement=i,e}getPositionClasses(){let e={top:"bottom-full left-0 mb-2",bottom:"top-full left-0 mt-2",left:"right-full top-0 mr-2",right:"left-full top-0 ml-2"};return e[this.position]||e.bottom}show(e=this.cardElement){this.visible||!e||(this.timeoutId=setTimeout(()=>{this.visible=!0,e.classList.remove("hidden"),e.classList.add("opacity-100","transition-opacity","duration-200")},this.delay))}hide(e=this.cardElement){!this.visible||!e||(clearTimeout(this.timeoutId),this.visible=!1,e.classList.add("hidden"),e.classList.remove("opacity-100"))}setContent(e){this.content=e,this.cardElement&&(this.cardElement.innerHTML=e)}}});var is={};ne(is,{Input:()=>et});var et,ls=se(()=>{de();le();et=class extends U{constructor(e={}){super(e),this.type=e.type||"text",this.placeholder=e.placeholder||"",this.value=e.value||"",this.name=e.name||"",this.disabled=e.disabled||!1,this.required=e.required||!1,this.className=e.className||"",this.onChange=e.onChange||null}create(){let s=super.create("input",{className:N("w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900 placeholder-gray-500 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed",this.className),attrs:{type:this.type,placeholder:this.placeholder,value:this.value,name:this.name,disabled:this.disabled?"":null,required:this.required?"":null}});return this.onChange&&(this.on("change",this.onChange),this.on("input",this.onChange)),s}getValue(){return this.element?.value||""}setValue(e){this.value=e,this.element&&(this.element.value=e)}setDisabled(e){this.disabled=e,this.attr("disabled",e?"":null)}setPlaceholder(e){this.placeholder=e,this.element&&(this.element.placeholder=e)}focus(){super.focus()}clear(){this.setValue("")}}});var ds={};ne(ds,{InputGroup:()=>tt});var tt,cs=se(()=>{de();le();tt=class extends U{constructor(e={}){super(e),this.prefix=e.prefix||null,this.suffix=e.suffix||null,this.input=e.input||null,this.className=e.className||""}create(){let s=super.create("div",{className:N("flex items-center border border-gray-300 rounded-md overflow-hidden focus-within:ring-2 focus-within:ring-blue-500",this.className)});if(this.prefix){let i=V("div",{className:"px-3 py-2 bg-gray-50 text-gray-700 font-medium text-sm",html:this.prefix});s.appendChild(i)}if(this.input){let i=this.input.element||this.input.create();i.classList.remove("border","focus:ring-2","focus:ring-blue-500"),s.appendChild(i)}if(this.suffix){let i=V("div",{className:"px-3 py-2 bg-gray-50 text-gray-700 font-medium text-sm",html:this.suffix});s.appendChild(i)}return s}}});var us={};ne(us,{InputOTP:()=>st});var st,ms=se(()=>{de();le();st=class extends U{constructor(e={}){super(e),this.length=e.length||6,this.value=e.value||"",this.className=e.className||"",this.onChange=e.onChange||null,this.onComplete=e.onComplete||null}create(){let e=super.create("div",{className:N("flex gap-2",this.className)});this.inputs=[];for(let s=0;s<this.length;s++){let i=document.createElement("input");i.type="text",i.maxLength="1",i.inputMode="numeric",i.className=N("w-12 h-12 text-center border-2 border-gray-300 rounded-lg font-semibold text-lg","focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-200","transition-colors duration-200"),this.value&&this.value[s]&&(i.value=this.value[s]),i.addEventListener("input",p=>{let b=p.target.value;if(!/^\d*$/.test(b)){p.target.value="";return}b&&s<this.length-1&&this.inputs[s+1].focus(),this.updateValue()}),i.addEventListener("keydown",p=>{p.key==="Backspace"?!i.value&&s>0&&this.inputs[s-1].focus():p.key==="ArrowLeft"&&s>0?this.inputs[s-1].focus():p.key==="ArrowRight"&&s<this.length-1&&this.inputs[s+1].focus()}),this.inputs.push(i),e.appendChild(i)}return e}updateValue(){this.value=this.inputs.map(e=>e.value).join(""),this.onChange&&this.onChange(this.value),this.value.length===this.length&&this.onComplete&&this.onComplete(this.value)}getValue(){return this.value}setValue(e){this.value=e;for(let s=0;s<this.length;s++)this.inputs[s].value=e[s]||""}clear(){this.inputs.forEach(e=>{e.value=""}),this.value=""}focus(){this.inputs.length>0&&this.inputs[0].focus()}}});var ps={};ne(ps,{Item:()=>rt});var rt,gs=se(()=>{de();le();rt=class extends U{constructor(e={}){super(e),this.label=e.label||"",this.value=e.value||"",this.icon=e.icon||null,this.className=e.className||"",this.selected=e.selected||!1,this.disabled=e.disabled||!1}create(){let e="flex items-center gap-2 px-3 py-2 rounded cursor-pointer transition-colors duration-200 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed",s=this.selected?"bg-blue-50 text-blue-600":"text-gray-900",i=super.create("div",{className:N(e,s,this.className),attrs:{role:"option","aria-selected":this.selected,disabled:this.disabled?"":null,"data-value":this.value}}),p="";return this.icon&&(p+=`<span class="flex-shrink-0">${this.icon}</span>`),p+=`<span>${this.label}</span>`,i.innerHTML=p,i}setSelected(e){this.selected=e,this.element&&(this.attr("aria-selected",e),this.toggleClass("bg-blue-50 text-blue-600",e))}setDisabled(e){this.disabled=e,this.attr("disabled",e?"":null)}}});var hs={};ne(hs,{Label:()=>at});var at,fs=se(()=>{de();le();at=class extends U{constructor(e={}){super(e),this.text=e.text||"",this.htmlFor=e.htmlFor||"",this.required=e.required||!1,this.className=e.className||""}create(){let s=super.create("label",{className:N("block text-sm font-medium text-gray-700 mb-1",this.className),attrs:{for:this.htmlFor}}),i=this.text;return this.required&&(i+=' <span class="text-red-500 ml-1">*</span>'),s.innerHTML=i,s}setText(e){if(this.text=e,this.element){let s=e;this.required&&(s+=' <span class="text-red-500 ml-1">*</span>'),this.element.innerHTML=s}}setRequired(e){if(this.required=e,this.element){let s=this.element.querySelector('[class*="text-red"]');e&&!s?this.element.innerHTML+=' <span class="text-red-500 ml-1">*</span>':!e&&s&&s.remove()}}}});var xs={};ne(xs,{Kbd:()=>nt});var nt,ys=se(()=>{de();le();nt=class extends U{constructor(e={}){super(e),this.label=e.label||"K",this.className=e.className||""}create(){let s=super.create("kbd",{className:N("px-2 py-1 bg-gray-100 border border-gray-300 rounded text-xs font-semibold text-gray-900 inline-block font-mono",this.className)});return s.textContent=this.label,s}setLabel(e){this.label=e,this.element&&(this.element.textContent=e)}}});var bs={};ne(bs,{NativeSelect:()=>ot});var ot,vs=se(()=>{de();le();ot=class extends U{constructor(e={}){super(e),this.items=e.items||[],this.selected=e.selected||"",this.placeholder=e.placeholder||"Select...",this.disabled=e.disabled||!1,this.required=e.required||!1,this.name=e.name||"",this.className=e.className||"",this.onChange=e.onChange||null}create(){let s=super.create("select",{className:N("w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed bg-white appearance-none cursor-pointer",this.className),attrs:{disabled:this.disabled?"":null,required:this.required?"":null,...this.name&&{name:this.name}}});if(this.placeholder){let i=document.createElement("option");i.value="",i.textContent=this.placeholder,i.disabled=!0,s.appendChild(i)}return this.items.forEach(i=>{let p=document.createElement("option");p.value=i.value,p.textContent=i.label,i.value===this.selected&&(p.selected=!0),s.appendChild(p)}),this.onChange&&this.on("change",this.onChange),s}getValue(){return this.element?.value||""}setValue(e){this.selected=e,this.element&&(this.element.value=e)}setDisabled(e){this.disabled=e,this.attr("disabled",e?"":null)}addItem(e,s){if(this.element){let i=document.createElement("option");i.value=s,i.textContent=e,this.element.appendChild(i)}}removeItem(e){if(this.element){let s=this.element.querySelector(`option[value="${e}"]`);s&&s.remove()}}}});var ws={};ne(ws,{Tooltip:()=>it});var it,ks=se(()=>{de();le();it=class extends U{constructor(e={}){super(e),this.content=e.content||"",this.position=e.position||"top",this.delay=e.delay||200,this.trigger=e.trigger||"hover",this.className=e.className||"",this.visible=!1,this.timeoutId=null}create(){let e=super.create("div",{className:"relative inline-block"}),s=document.createElement("div");s.className=N("absolute hidden bg-gray-900 text-white px-3 py-2 rounded text-sm whitespace-nowrap z-50","opacity-0 transition-opacity duration-200",this.getPositionClasses(),this.className),s.textContent=this.content;let i=document.createElement("div");return i.className=N("absolute w-2 h-2 bg-gray-900 transform rotate-45",this.getArrowClasses()),s.appendChild(i),e.appendChild(s),this.tooltipElement=s,this.trigger==="hover"?(e.addEventListener("mouseenter",()=>this.show()),e.addEventListener("mouseleave",()=>this.hide())):this.trigger==="focus"&&(e.addEventListener("focus",()=>this.show(),!0),e.addEventListener("blur",()=>this.hide(),!0)),e}getPositionClasses(){let e={top:"bottom-full left-1/2 transform -translate-x-1/2 mb-2",bottom:"top-full left-1/2 transform -translate-x-1/2 mt-2",left:"right-full top-1/2 transform -translate-y-1/2 mr-2",right:"left-full top-1/2 transform -translate-y-1/2 ml-2"};return e[this.position]||e.top}getArrowClasses(){let e={top:"top-full left-1/2 transform -translate-x-1/2 -translate-y-1/2",bottom:"bottom-full left-1/2 transform -translate-x-1/2 translate-y-1/2",left:"left-full top-1/2 transform translate-x-1/2 -translate-y-1/2",right:"right-full top-1/2 transform -translate-x-1/2 -translate-y-1/2"};return e[this.position]||e.top}show(){this.visible||(this.timeoutId=setTimeout(()=>{this.visible=!0,this.tooltipElement.classList.remove("hidden"),this.tooltipElement.classList.add("opacity-100")},this.delay))}hide(){this.visible&&(clearTimeout(this.timeoutId),this.visible=!1,this.tooltipElement.classList.remove("opacity-100"),this.tooltipElement.classList.add("hidden"))}setContent(e){this.content=e,this.tooltipElement&&(this.tooltipElement.textContent=e)}}});var Es={};ne(Es,{Toggle:()=>lt});var lt,Cs=se(()=>{de();le();lt=class extends U{constructor(e={}){super(e),this.label=e.label||"",this.pressed=e.pressed||!1,this.disabled=e.disabled||!1,this.variant=e.variant||"default",this.size=e.size||"md",this.className=e.className||"",this.onChange=e.onChange||null}create(){let e="px-4 py-2 font-medium rounded transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed",s={default:this.pressed?"bg-gray-900 text-white":"bg-gray-100 text-gray-900 hover:bg-gray-200",outline:this.pressed?"border-2 border-gray-900 bg-gray-900 text-white":"border-2 border-gray-300 text-gray-900 hover:bg-gray-50"},i={sm:"px-2 py-1 text-sm",md:"px-4 py-2 text-base",lg:"px-6 py-3 text-lg"},p=super.create("button",{className:N(e,s[this.variant],i[this.size],this.className),attrs:{"aria-pressed":this.pressed,disabled:this.disabled?"":null}});return p.textContent=this.label,this.on("click",()=>{this.toggle()}),p}isPressed(){return this.pressed}setPressed(e){this.pressed=e,this.element&&(this.attr("aria-pressed",e),this.toggleClass("bg-gray-900 text-white",e),this.onChange&&this.onChange(e))}toggle(){this.setPressed(!this.pressed)}setDisabled(e){this.disabled=e,this.attr("disabled",e?"":null)}}});var Ls={};ne(Ls,{ToggleGroup:()=>dt});var dt,$s=se(()=>{de();le();dt=class extends U{constructor(e={}){super(e),this.items=e.items||[],this.selected=e.selected||null,this.multiple=e.multiple||!1,this.orientation=e.orientation||"horizontal",this.className=e.className||"",this.onChange=e.onChange||null}create(){let e=this.orientation==="vertical"?"flex-col":"flex-row",i=super.create("div",{className:N("flex",e,"inline-flex border border-gray-300 rounded-md overflow-hidden",this.className),attrs:{role:"group"}});return this.toggleButtons=[],this.items.forEach((p,b)=>{let w=this.multiple?Array.isArray(this.selected)&&this.selected.includes(p.value):p.value===this.selected,A=N("flex-1 px-4 py-2 font-medium transition-colors duration-200",w?"bg-blue-600 text-white":"bg-white text-gray-700 hover:bg-gray-50",b>0?this.orientation==="vertical"?"border-t border-gray-300":"border-l border-gray-300":""),H=V("button",{className:A,text:p.label,attrs:{"data-value":p.value,"aria-pressed":w,type:"button"}});H.addEventListener("click",()=>{if(this.multiple){Array.isArray(this.selected)||(this.selected=[]);let Q=this.selected.indexOf(p.value);Q>-1?this.selected.splice(Q,1):this.selected.push(p.value)}else this.selected=p.value;this.updateView(),this.onChange&&this.onChange(this.selected)}),i.appendChild(H),this.toggleButtons.push(H)}),i}updateView(){this.toggleButtons.forEach(e=>{let s=e.getAttribute("data-value"),i=this.multiple?Array.isArray(this.selected)&&this.selected.includes(s):s===this.selected;e.setAttribute("aria-pressed",i),e.className=N("flex-1 px-4 py-2 font-medium transition-colors duration-200",i?"bg-blue-600 text-white":"bg-white text-gray-700 hover:bg-gray-50")})}getValue(){return this.selected}setValue(e){this.selected=e,this.updateView()}}});var Ts={};ne(Ts,{Toast:()=>ct});var ct,Is=se(()=>{de();le();ct=class n extends U{constructor(e={}){super(e),this.message=e.message||"",this.type=e.type||"default",typeof e.duration<"u"?this.duration=e.duration:this.duration=typeof window<"u"&&window.innerWidth<640?2500:3e3,this.position=e.position||"top-right",this.className=e.className||"",this.onClose=e.onClose||null}destroy(){if(!this.element)return;let e=this.element;e.classList.add(this.getExitAnimationClass());let s=()=>{e.removeEventListener("animationend",s),super.destroy();let i=n.getContainer(this.position);i&&i.childElementCount===0&&i.parentNode&&(i.parentNode.removeChild(i),n._containers&&delete n._containers[this.position||"top-right"])};e.addEventListener("animationend",s),setTimeout(s,320)}static getContainer(e){let s=e||"top-right";if(this._containers||(this._containers={}),this._containers[s]&&document.body.contains(this._containers[s]))return this._containers[s];let i=V("div",{className:N("fixed z-50 p-2 flex flex-col gap-2 pointer-events-none",this.getPositionClassesForContainer(s))});return document.body.appendChild(i),this._containers[s]=i,i}static getPositionClassesForContainer(e){switch(e){case"top-left":return"top-4 left-4 items-start";case"top-right":return"top-4 right-4 items-end";case"bottom-left":return"bottom-4 left-4 items-start";case"bottom-right":return"bottom-4 right-4 items-end";case"top-center":return"top-4 left-1/2 -translate-x-1/2 items-center transform";default:return"top-4 right-4 items-end"}}create(){let e=n.getContainer(this.position),s=V("div",{className:N("rounded-lg shadow-lg p-2.5 flex items-center gap-2 min-w-0 max-w-[90vw] sm:max-w-sm bg-opacity-95",this.getEnterAnimationClass(),this.getTypeClasses(),this.className)}),i=V("span",{className:"text-base flex-shrink-0",text:this.getIcon()});s.appendChild(i);let p=V("span",{text:this.message,className:"flex-1 text-sm sm:text-base"});s.appendChild(p),s.setAttribute("role",this.type==="error"?"alert":"status"),s.setAttribute("aria-live",this.type==="error"?"assertive":"polite");let b=V("button",{className:"text-base hover:opacity-70 transition-opacity flex-shrink-0",text:"\xD7"});for(b.setAttribute("aria-label","Dismiss notification"),b.addEventListener("click",()=>{this.destroy()}),s.appendChild(b),this.element=s,e.appendChild(this.element);e.children.length>3;)e.removeChild(e.firstElementChild);return this.duration>0&&setTimeout(()=>{this.destroy()},this.duration),this.element}getEnterAnimationClass(){let e=this.position||"top-right";return e==="top-right"||e==="bottom-right"?"animate-slide-in-right transition-all duration-300 pointer-events-auto":e==="top-left"||e==="bottom-left"?"animate-slide-in-left transition-all duration-300 pointer-events-auto":"animate-slide-in-top transition-all duration-300 pointer-events-auto"}getExitAnimationClass(){let e=this.position||"top-right";return e==="top-right"||e==="bottom-right"?"animate-slide-out-right":e==="top-left"||e==="bottom-left"?"animate-slide-out-left":"animate-slide-out-top"}getPositionClasses(){let e={"top-left":"top-4 left-4","top-right":"top-4 right-4","bottom-left":"bottom-4 left-4","bottom-right":"bottom-4 right-4","top-center":"top-4 left-1/2 -translate-x-1/2 transform"};return e[this.position]||e["bottom-right"]}getTypeClasses(){let e={default:"bg-gray-900 text-white",success:"bg-green-600 text-white",error:"bg-red-600 text-white",warning:"bg-yellow-600 text-white",info:"bg-blue-600 text-white"};return e[this.type]||e.default}getIcon(){let e={default:"\u2139",success:"\u2713",error:"\u2715",warning:"\u26A0",info:"\u2139"};return e[this.type]||e.default}static show(e,s={}){let i=new n({message:e,...s}),p=i.create();return i}static success(e,s={}){return this.show(e,{...s,type:"success"})}static error(e,s={}){return this.show(e,{...s,type:"error",position:s.position||"top-right"})}static info(e,s={}){return this.show(e,{...s,type:"info"})}static warning(e,s={}){return this.show(e,{...s,type:"warning"})}};if(!document.querySelector("style[data-toast]")){let n=document.createElement("style");n.setAttribute("data-toast","true"),n.textContent=`
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
  `,document.head.appendChild(n)}});function As({root:n=document,selector:e="[data-hydrate]",threshold:s=.15}={}){if(typeof IntersectionObserver>"u")return;let i=new IntersectionObserver(async(p,b)=>{for(let w of p){if(!w.isIntersecting)continue;let A=w.target,H=A.dataset.hydrate||"",[Q,ae="init"]=H.split("#");if(!Q){b.unobserve(A);continue}try{let O=null,E=wr[Q];if(typeof E=="function")O=await E();else throw new Error("Module not registered for lazy hydration: "+Q);let _=O[ae]||O.default||null;if(typeof _=="function")try{_(A)}catch(Y){console.error("hydrate init failed",Y)}}catch(O){console.error("lazy hydrate import failed for",Q,O)}finally{b.unobserve(A)}}},{threshold:s});n.querySelectorAll(e).forEach(p=>i.observe(p))}var wr,Bs=se(()=>{wr={"components/Alert.js":()=>Promise.resolve().then(()=>(yt(),xt)),"components/AlertDialog.js":()=>Promise.resolve().then(()=>(vt(),bt)),"components/Avatar.js":()=>Promise.resolve().then(()=>(kt(),wt)),"components/Badge.js":()=>Promise.resolve().then(()=>(Ct(),Et)),"components/Button.js":()=>Promise.resolve().then(()=>($t(),Lt)),"components/ButtonGroup.js":()=>Promise.resolve().then(()=>(It(),Tt)),"components/Breadcrumb.js":()=>Promise.resolve().then(()=>(Bt(),At)),"components/Card.js":()=>Promise.resolve().then(()=>(_t(),St)),"components/Carousel.js":()=>Promise.resolve().then(()=>(qt(),Mt)),"components/Chart.js":()=>Promise.resolve().then(()=>(Ht(),Pt)),"components/Checkbox.js":()=>Promise.resolve().then(()=>(Nt(),jt)),"components/Collapsible.js":()=>Promise.resolve().then(()=>(zt(),Ft)),"components/Command.js":()=>Promise.resolve().then(()=>(Ot(),Rt)),"components/Combobox.js":()=>Promise.resolve().then(()=>(Vt(),Dt)),"components/ContextMenu.js":()=>Promise.resolve().then(()=>(Wt(),Ut)),"components/DatePicker.js":()=>Promise.resolve().then(()=>(Qt(),Yt)),"components/Dialog.js":()=>Promise.resolve().then(()=>(Jt(),Gt)),"components/DropdownMenu.js":()=>Promise.resolve().then(()=>(Kt(),Xt)),"components/Drawer.js":()=>Promise.resolve().then(()=>(es(),Zt)),"components/Empty.js":()=>Promise.resolve().then(()=>(ss(),ts)),"components/Form.js":()=>Promise.resolve().then(()=>(as(),rs)),"components/HoverCard.js":()=>Promise.resolve().then(()=>(os(),ns)),"components/Input.js":()=>Promise.resolve().then(()=>(ls(),is)),"components/InputGroup.js":()=>Promise.resolve().then(()=>(cs(),ds)),"components/InputOTP.js":()=>Promise.resolve().then(()=>(ms(),us)),"components/Item.js":()=>Promise.resolve().then(()=>(gs(),ps)),"components/Label.js":()=>Promise.resolve().then(()=>(fs(),hs)),"components/Kbd.js":()=>Promise.resolve().then(()=>(ys(),xs)),"components/NativeSelect.js":()=>Promise.resolve().then(()=>(vs(),bs)),"components/Tooltip.js":()=>Promise.resolve().then(()=>(ks(),ws)),"components/Toggle.js":()=>Promise.resolve().then(()=>(Cs(),Es)),"components/ToggleGroup.js":()=>Promise.resolve().then(()=>($s(),Ls)),"components/Toast.js":()=>Promise.resolve().then(()=>(Is(),Ts))}});var _s={};ne(_s,{default:()=>kr});var Ss,kr,Ms=se(()=>{Ss=(function(){"use strict";let n=null;async function e(){if(AuthGuard.protectPage()){await Q();try{Y()}catch{}ae(),_(),S(),L(),s()}}function s(){i(),p(),b(),w(),A(),H()}function i(){let a=document.getElementById("loyalty-points");if(!a)return;let r=n?.loyalty_points||Math.floor(Math.random()*500)+100,l=r>=500?"Gold":r>=200?"Silver":"Bronze",d={Bronze:"from-amber-600 to-amber-700",Silver:"from-gray-400 to-gray-500",Gold:"from-yellow-400 to-yellow-500"},c=l==="Gold"?null:l==="Silver"?"Gold":"Silver",f=l==="Gold"?0:l==="Silver"?500:200,x=c?Math.min(100,r/f*100):100;a.innerHTML=`
            <div class="bg-gradient-to-br ${d[l]} rounded-2xl p-6 text-white relative overflow-hidden">
                <div class="absolute top-0 right-0 w-32 h-32 opacity-10">
                    <svg viewBox="0 0 24 24" fill="currentColor" class="w-full h-full">
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                    </svg>
                </div>
                <div class="relative">
                    <div class="flex items-center justify-between mb-4">
                        <div>
                            <p class="text-white/80 text-sm font-medium">${l} Member</p>
                            <p class="text-3xl font-bold">${r.toLocaleString()} pts</p>
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
                                <span>${f-r} points to ${c}</span>
                                <span>${Math.round(x)}%</span>
                            </div>
                            <div class="w-full bg-white/30 rounded-full h-2">
                                <div class="bg-white h-2 rounded-full transition-all duration-500" style="width: ${x}%"></div>
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
        `}function p(){let a=document.getElementById("quick-stats");if(!a)return;let r={totalOrders:n?.total_orders||Math.floor(Math.random()*20)+5,totalSpent:n?.total_spent||Math.floor(Math.random()*1e3)+200,wishlistItems:n?.wishlist_count||Math.floor(Math.random()*10)+2,savedAddresses:n?.address_count||Math.floor(Math.random()*3)+1};a.innerHTML=`
            <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div class="bg-white dark:bg-stone-800 rounded-xl p-4 border border-gray-100 dark:border-stone-700">
                    <div class="flex items-center gap-3">
                        <div class="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                            <svg class="w-5 h-5 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/></svg>
                        </div>
                        <div>
                            <p class="text-2xl font-bold text-stone-900 dark:text-white">${r.totalOrders}</p>
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
                            <p class="text-2xl font-bold text-stone-900 dark:text-white">${Templates.formatPrice(r.totalSpent)}</p>
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
                            <p class="text-2xl font-bold text-stone-900 dark:text-white">${r.wishlistItems}</p>
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
                            <p class="text-2xl font-bold text-stone-900 dark:text-white">${r.savedAddresses}</p>
                            <p class="text-xs text-stone-500 dark:text-stone-400">Saved Addresses</p>
                        </div>
                    </div>
                </div>
            </div>
        `}async function b(){let a=document.getElementById("recent-activity");if(a)try{let l=(await OrdersApi.getAll({limit:3})).data||[];if(l.length===0){a.innerHTML=`
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
                        ${l.map(d=>{let f={pending:"text-yellow-600 dark:text-yellow-400",processing:"text-blue-600 dark:text-blue-400",shipped:"text-indigo-600 dark:text-indigo-400",delivered:"text-green-600 dark:text-green-400",cancelled:"text-red-600 dark:text-red-400"}[d.status]||"text-stone-600 dark:text-stone-400",x=d.items?.[0];return`
                                <a href="/orders/${d.id}/" class="flex items-center gap-4 p-4 hover:bg-stone-50 dark:hover:bg-stone-700/50 transition-colors">
                                    <div class="w-12 h-12 bg-stone-100 dark:bg-stone-700 rounded-lg overflow-hidden flex-shrink-0">
                                        ${x?.product?.image?`<img src="${x.product.image}" alt="" class="w-full h-full object-cover">`:`<div class="w-full h-full flex items-center justify-center text-stone-400">
                                                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/></svg>
                                            </div>`}
                                    </div>
                                    <div class="flex-1 min-w-0">
                                        <p class="font-medium text-stone-900 dark:text-white truncate">Order #${Templates.escapeHtml(d.order_number||d.id)}</p>
                                        <p class="text-sm ${f}">${Templates.escapeHtml(d.status_display||d.status)}</p>
                                    </div>
                                    <div class="text-right">
                                        <p class="font-semibold text-stone-900 dark:text-white">${Templates.formatPrice(d.total)}</p>
                                        <p class="text-xs text-stone-500 dark:text-stone-400">${Templates.formatDate(d.created_at)}</p>
                                    </div>
                                </a>
                            `}).join("")}
                    </div>
                </div>
            `}catch{a.innerHTML=""}}function w(){let a=document.getElementById("notification-preferences");if(!a)return;let r=JSON.parse(localStorage.getItem("notificationPreferences")||"{}"),d={...{orderUpdates:!0,promotions:!0,newArrivals:!1,priceDrops:!0,newsletter:!1},...r};a.innerHTML=`
            <div class="space-y-4">
                <div class="flex items-center justify-between">
                    <div>
                        <p class="font-medium text-stone-900 dark:text-white">Order Updates</p>
                        <p class="text-sm text-stone-500 dark:text-stone-400">Get notified about your order status</p>
                    </div>
                    <label class="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" class="sr-only peer" data-pref="orderUpdates" ${d.orderUpdates?"checked":""}>
                        <div class="w-11 h-6 bg-stone-200 dark:bg-stone-600 peer-focus:ring-2 peer-focus:ring-primary-300 dark:peer-focus:ring-amber-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600 dark:peer-checked:bg-amber-500"></div>
                    </label>
                </div>
                <div class="flex items-center justify-between">
                    <div>
                        <p class="font-medium text-stone-900 dark:text-white">Promotions & Sales</p>
                        <p class="text-sm text-stone-500 dark:text-stone-400">Be the first to know about deals</p>
                    </div>
                    <label class="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" class="sr-only peer" data-pref="promotions" ${d.promotions?"checked":""}>
                        <div class="w-11 h-6 bg-stone-200 dark:bg-stone-600 peer-focus:ring-2 peer-focus:ring-primary-300 dark:peer-focus:ring-amber-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600 dark:peer-checked:bg-amber-500"></div>
                    </label>
                </div>
                <div class="flex items-center justify-between">
                    <div>
                        <p class="font-medium text-stone-900 dark:text-white">Price Drops</p>
                        <p class="text-sm text-stone-500 dark:text-stone-400">Alert when wishlist items go on sale</p>
                    </div>
                    <label class="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" class="sr-only peer" data-pref="priceDrops" ${d.priceDrops?"checked":""}>
                        <div class="w-11 h-6 bg-stone-200 dark:bg-stone-600 peer-focus:ring-2 peer-focus:ring-primary-300 dark:peer-focus:ring-amber-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600 dark:peer-checked:bg-amber-500"></div>
                    </label>
                </div>
                <div class="flex items-center justify-between">
                    <div>
                        <p class="font-medium text-stone-900 dark:text-white">New Arrivals</p>
                        <p class="text-sm text-stone-500 dark:text-stone-400">Updates on new products</p>
                    </div>
                    <label class="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" class="sr-only peer" data-pref="newArrivals" ${d.newArrivals?"checked":""}>
                        <div class="w-11 h-6 bg-stone-200 dark:bg-stone-600 peer-focus:ring-2 peer-focus:ring-primary-300 dark:peer-focus:ring-amber-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600 dark:peer-checked:bg-amber-500"></div>
                    </label>
                </div>
            </div>
        `,a.querySelectorAll("input[data-pref]").forEach(c=>{c.addEventListener("change",()=>{let f=c.dataset.pref,x=JSON.parse(localStorage.getItem("notificationPreferences")||"{}");x[f]=c.checked,localStorage.setItem("notificationPreferences",JSON.stringify(x)),Toast.success("Preference saved")})})}function A(){let a=document.getElementById("quick-reorder");if(!a)return;let r=JSON.parse(localStorage.getItem("recentlyOrdered")||"[]");if(r.length===0){a.classList.add("hidden");return}a.innerHTML=`
            <div class="bg-white dark:bg-stone-800 rounded-xl border border-gray-100 dark:border-stone-700 p-4">
                <h3 class="font-semibold text-stone-900 dark:text-white mb-4">Quick Reorder</h3>
                <div class="flex gap-3 overflow-x-auto pb-2">
                    ${r.slice(0,5).map(l=>`
                        <button class="quick-reorder-btn flex-shrink-0 flex flex-col items-center gap-2 p-3 bg-stone-50 dark:bg-stone-700 rounded-xl hover:bg-stone-100 dark:hover:bg-stone-600 transition-colors" data-product-id="${l.id}">
                            <div class="w-16 h-16 rounded-lg bg-stone-200 dark:bg-stone-600 overflow-hidden">
                                <img src="${l.image||"/static/images/placeholder.jpg"}" alt="${Templates.escapeHtml(l.name)}" class="w-full h-full object-cover">
                            </div>
                            <span class="text-xs font-medium text-stone-700 dark:text-stone-300 text-center line-clamp-2 w-20">${Templates.escapeHtml(l.name)}</span>
                        </button>
                    `).join("")}
                </div>
            </div>
        `,a.querySelectorAll(".quick-reorder-btn").forEach(l=>{l.addEventListener("click",async()=>{let d=l.dataset.productId;l.disabled=!0;try{await CartApi.addItem(d,1),Toast.success("Added to cart!"),document.dispatchEvent(new CustomEvent("cart:updated"))}catch{Toast.error("Failed to add to cart")}finally{l.disabled=!1}})})}function H(){let a=document.getElementById("security-check");if(!a)return;let r=0,l=[],d=n?.email_verified!==!1;d&&(r+=25),l.push({label:"Email verified",completed:d});let c=!!n?.phone;c&&(r+=25),l.push({label:"Phone number added",completed:c});let f=n?.two_factor_enabled||!1;f&&(r+=25),l.push({label:"Two-factor authentication",completed:f});let x=!0;x&&(r+=25),l.push({label:"Strong password",completed:x});let P=r>=75?"text-green-600 dark:text-green-400":r>=50?"text-yellow-600 dark:text-yellow-400":"text-red-600 dark:text-red-400",G=r>=75?"bg-green-500":r>=50?"bg-yellow-500":"bg-red-500";a.innerHTML=`
            <div class="bg-white dark:bg-stone-800 rounded-xl border border-gray-100 dark:border-stone-700 p-4">
                <div class="flex items-center justify-between mb-4">
                    <h3 class="font-semibold text-stone-900 dark:text-white">Account Security</h3>
                    <span class="${P} font-bold">${r}%</span>
                </div>
                <div class="w-full bg-stone-200 dark:bg-stone-600 rounded-full h-2 mb-4">
                    <div class="${G} h-2 rounded-full transition-all duration-500" style="width: ${r}%"></div>
                </div>
                <div class="space-y-2">
                    ${l.map(te=>`
                        <div class="flex items-center gap-2 text-sm">
                            ${te.completed?'<svg class="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/></svg>':'<svg class="w-4 h-4 text-stone-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" stroke-width="2"/></svg>'}
                            <span class="${te.completed?"text-stone-700 dark:text-stone-300":"text-stone-500 dark:text-stone-400"}">${te.label}</span>
                        </div>
                    `).join("")}
                </div>
            </div>
        `}async function Q(){if(AuthApi.isAuthenticated())try{n=(await AuthApi.getProfile()).data,O()}catch{Toast.error("Failed to load profile.")}}function ae(){let a=document.querySelectorAll("[data-profile-tab]"),r=document.querySelectorAll("[data-profile-panel]");if(!a.length||!r.length)return;let l=c=>{r.forEach(f=>{f.classList.toggle("hidden",f.dataset.profilePanel!==c)}),a.forEach(f=>{let x=f.dataset.profileTab===c;f.classList.toggle("bg-amber-600",x),f.classList.toggle("text-white",x),f.classList.toggle("shadow-sm",x),f.classList.toggle("text-stone-700",!x),f.classList.toggle("dark:text-stone-200",!x)}),localStorage.setItem("profileTab",c)},d=localStorage.getItem("profileTab")||"overview";l(d),a.forEach(c=>{c.addEventListener("click",()=>{l(c.dataset.profileTab)})})}function O(){let a=document.getElementById("profile-info");if(!a||!n)return;let r=`${Templates.escapeHtml(n.first_name||"")} ${Templates.escapeHtml(n.last_name||"")}`.trim()||Templates.escapeHtml(n.email||"User"),l=Templates.formatDate(n.created_at||n.date_joined),d=n.avatar?`<img id="avatar-preview" src="${n.avatar}" alt="Profile" class="w-full h-full object-cover">`:`
            <span class="flex h-full w-full items-center justify-center text-3xl font-semibold text-stone-500">
                ${(n.first_name?.[0]||n.email?.[0]||"U").toUpperCase()}
            </span>`;a.innerHTML=`
            <div class="absolute inset-0 bg-gradient-to-r from-amber-50/80 via-amber-100/60 to-transparent dark:from-amber-900/20 dark:via-amber-800/10" aria-hidden="true"></div>
            <div class="relative flex flex-col gap-4 md:flex-row md:items-center md:gap-6">
                <div class="relative">
                    <div class="w-24 h-24 rounded-2xl ring-4 ring-amber-100 dark:ring-amber-900/40 overflow-hidden bg-stone-100 dark:bg-stone-800">
                        ${d}
                    </div>
                </div>
                <div class="flex-1 min-w-0">
                    <p class="text-sm font-semibold text-amber-700 dark:text-amber-300">Profile</p>
                    <h1 class="text-2xl font-bold text-stone-900 dark:text-white leading-tight truncate">${r}</h1>
                    <p class="text-sm text-stone-600 dark:text-stone-300 truncate">${Templates.escapeHtml(n.email)}</p>
                    <p class="text-xs text-stone-500 dark:text-stone-400 mt-1">Member since ${l}</p>
                    <div class="flex flex-wrap gap-2 mt-4">
                        <button type="button" id="change-avatar-btn" class="btn btn-primary btn-sm">Update photo</button>
                        ${n.avatar?'<button type="button" id="remove-avatar-btn" class="btn btn-ghost btn-sm text-red-600 hover:text-red-700 dark:text-red-400">Remove photo</button>':""}
                    </div>
                    <p class="text-xs text-stone-500 dark:text-stone-400 mt-3">JPG, GIF or PNG. Max size 5MB.</p>
                </div>
            </div>
        `,Y()}function E(){Tabs.init()}function _(){let a=document.getElementById("profile-form");if(!a||!n)return;let r=document.getElementById("profile-first-name"),l=document.getElementById("profile-last-name"),d=document.getElementById("profile-email"),c=document.getElementById("profile-phone");r&&(r.value=n.first_name||""),l&&(l.value=n.last_name||""),d&&(d.value=n.email||""),c&&(c.value=n.phone||""),a.addEventListener("submit",async f=>{f.preventDefault();let x=new FormData(a),P={first_name:x.get("first_name"),last_name:x.get("last_name"),phone:x.get("phone")},G=a.querySelector('button[type="submit"]');G.disabled=!0,G.textContent="Saving...";try{await AuthApi.updateProfile(P),Toast.success("Profile updated successfully!"),await Q()}catch(te){Toast.error(te.message||"Failed to update profile.")}finally{G.disabled=!1,G.textContent="Save Changes"}})}function Y(){let a=document.getElementById("avatar-input"),r=document.getElementById("change-avatar-btn"),l=document.getElementById("remove-avatar-btn");a||(a=document.createElement("input"),a.type="file",a.id="avatar-input",a.name="avatar",a.accept="image/*",a.className="hidden",document.body.appendChild(a)),document.querySelectorAll("#change-avatar-btn").forEach(f=>f.addEventListener("click",()=>a.click())),document.querySelectorAll("#remove-avatar-btn").forEach(f=>f.addEventListener("click",()=>{typeof window.removeAvatar=="function"&&window.removeAvatar()})),a.removeEventListener?.("change",window._avatarChangeHandler),window._avatarChangeHandler=async function(f){let x=f.target.files?.[0];if(x){if(!x.type.startsWith("image/")){Toast.error("Please select an image file.");return}if(x.size>5242880){Toast.error("Image must be smaller than 5MB.");return}try{await AuthApi.uploadAvatar(x),Toast.success("Avatar updated!"),await Q()}catch(P){Toast.error(P.message||"Failed to update avatar.")}}},a.addEventListener("change",window._avatarChangeHandler)}function S(){let a=document.getElementById("password-form");a&&a.addEventListener("submit",async r=>{r.preventDefault();let l=new FormData(a),d=l.get("current_password"),c=l.get("new_password"),f=l.get("confirm_password");if(c!==f){Toast.error("Passwords do not match.");return}if(c.length<8){Toast.error("Password must be at least 8 characters.");return}let x=a.querySelector('button[type="submit"]');x.disabled=!0,x.textContent="Updating...";try{await AuthApi.changePassword(d,c),Toast.success("Password updated successfully!"),a.reset()}catch(P){Toast.error(P.message||"Failed to update password.")}finally{x.disabled=!1,x.textContent="Update Password"}})}function L(){k(),document.getElementById("add-address-btn")?.addEventListener("click",()=>{I()})}async function k(){let a=document.getElementById("addresses-list");if(a){Loader.show(a,"spinner");try{let l=(await AuthApi.getAddresses()).data||[];if(l.length===0){a.innerHTML=`
                    <div class="text-center py-8">
                        <svg class="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
                        </svg>
                        <p class="text-gray-500">No saved addresses yet.</p>
                    </div>
                `;return}a.innerHTML=`
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    ${l.map(d=>`
                        <div class="p-4 border border-gray-200 rounded-lg relative" data-address-id="${d.id}">
                            ${d.is_default?`
                                <span class="absolute top-2 right-2 px-2 py-0.5 bg-primary-100 text-primary-700 text-xs rounded">Default</span>
                            `:""}
                            <p class="font-medium text-gray-900">${Templates.escapeHtml(d.full_name||`${d.first_name} ${d.last_name}`)}</p>
                            <p class="text-sm text-gray-600 mt-1">${Templates.escapeHtml(d.address_line_1)}</p>
                            ${d.address_line_2?`<p class="text-sm text-gray-600">${Templates.escapeHtml(d.address_line_2)}</p>`:""}
                            <p class="text-sm text-gray-600">${Templates.escapeHtml(d.city)}, ${Templates.escapeHtml(d.state||"")} ${Templates.escapeHtml(d.postal_code)}</p>
                            <p class="text-sm text-gray-600">${Templates.escapeHtml(d.country)}</p>
                            ${d.phone?`<p class="text-sm text-gray-600 mt-1">${Templates.escapeHtml(d.phone)}</p>`:""}
                            
                            <div class="mt-4 flex gap-2">
                                <button class="edit-address-btn text-sm text-primary-600 hover:text-primary-700" data-address-id="${d.id}">Edit</button>
                                ${d.is_default?"":`
                                    <button class="set-default-btn text-sm text-gray-600 hover:text-gray-700" data-address-id="${d.id}">Set as Default</button>
                                `}
                                <button class="delete-address-btn text-sm text-red-600 hover:text-red-700" data-address-id="${d.id}">Delete</button>
                            </div>
                        </div>
                    `).join("")}
                </div>
            `,B()}catch(r){console.error("Failed to load addresses:",r),a.innerHTML='<p class="text-red-500">Failed to load addresses.</p>'}}}function B(){document.querySelectorAll(".edit-address-btn").forEach(a=>{a.addEventListener("click",async()=>{let r=a.dataset.addressId;try{let l=await AuthApi.getAddress(r);I(l.data)}catch{Toast.error("Failed to load address.")}})}),document.querySelectorAll(".set-default-btn").forEach(a=>{a.addEventListener("click",async()=>{let r=a.dataset.addressId;try{await AuthApi.setDefaultAddress(r),Toast.success("Default address updated."),await k()}catch{Toast.error("Failed to update default address.")}})}),document.querySelectorAll(".delete-address-btn").forEach(a=>{a.addEventListener("click",async()=>{let r=a.dataset.addressId;if(await Modal.confirm({title:"Delete Address",message:"Are you sure you want to delete this address?",confirmText:"Delete",cancelText:"Cancel"}))try{await AuthApi.deleteAddress(r),Toast.success("Address deleted."),await k()}catch{Toast.error("Failed to delete address.")}})})}function I(a=null){let r=!!a;Modal.open({title:r?"Edit Address":"Add New Address",content:`
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
            `,confirmText:r?"Save Changes":"Add Address",onConfirm:async()=>{let l=document.getElementById("address-modal-form"),d=new FormData(l),c={first_name:d.get("first_name"),last_name:d.get("last_name"),phone:d.get("phone"),address_line_1:d.get("address_line_1"),address_line_2:d.get("address_line_2"),city:d.get("city"),state:d.get("state"),postal_code:d.get("postal_code"),country:d.get("country"),is_default:d.get("is_default")==="on"};try{return r?(await AuthApi.updateAddress(a.id,c),Toast.success("Address updated!")):(await AuthApi.addAddress(c),Toast.success("Address added!")),await k(),!0}catch(f){return Toast.error(f.message||"Failed to save address."),!1}}})}function h(){n=null}return{init:e,destroy:h}})();window.AccountPage=Ss;kr=Ss});var Ps={};ne(Ps,{default:()=>Er});var qs,Er,Hs=se(()=>{qs=(function(){"use strict";let n=null,e=[],s=null,i=6e4,p="data-bound";function b(){}function w(g){if(g==null||g==="")return 0;if(typeof g=="number"&&Number.isFinite(g))return g;let T=parseFloat(g);return Number.isFinite(T)?T:0}function A(g){let T=w(g);return Templates.formatPrice(T)}function H(g){return g!=null&&g!==""}function Q(){let g=window.BUNORAA_CART?.taxRate;return w(H(g)?g:0)}function ae(){let g=window.BUNORAA_CART?.freeShippingThreshold,z=(window.BUNORAA_SHIPPING||{}).free_shipping_threshold??window.BUNORAA_CURRENCY?.free_shipping_threshold??0;return w(H(g)?g:z)}let O='<a href="/account/addresses/" class="text-xs font-medium text-amber-600 dark:text-amber-400 underline underline-offset-2 hover:text-amber-700 dark:hover:text-amber-300">Add shipping address to see shipping cost.</a>',E=null,_=null,Y={key:null,quote:null};function S(){return(document.getElementById("delivery-division")?.value||"dhaka").toLowerCase()}function L(g){return g?g.charAt(0).toUpperCase()+g.slice(1):"Dhaka"}function k(){return window.AuthApi?.isAuthenticated&&AuthApi.isAuthenticated()}function B(g){return g?Array.isArray(g)?g:Array.isArray(g.data)?g.data:Array.isArray(g.data?.results)?g.data.results:Array.isArray(g.results)?g.results:[]:[]}async function I(){return k()?E||(_||(_=(async()=>{try{let g=await AuthApi.getAddresses(),T=B(g);if(!T.length)return null;let z=T.filter(q=>{let j=String(q.address_type||"").toLowerCase();return j==="shipping"||j==="both"});return z.find(q=>q.is_default)||z[0]||T.find(q=>q.is_default)||T[0]||null}catch{return null}})()),E=await _,E):null}function h(g){let T=Q();return T>0?g*T/100:0}function a(g){let T=document.getElementById("shipping-location");if(!T)return;if(g&&(g.city||g.state||g.country)){T.textContent=g.city||g.state||g.country;return}let z=document.getElementById("delivery-division");T.textContent=z?L(S()):"Address"}function r(g,T,z,q){return{country:g?.country||"BD",state:g?.state||g?.city||"",postal_code:g?.postal_code||"",subtotal:T,weight:0,item_count:z,product_ids:q}}async function l(g,T,z){if(!z)return null;let q=g?.items||[],j=q.reduce((re,ce)=>re+Number(ce.quantity||1),0),W=q.map(re=>re.product?.id||re.product_id).filter(Boolean),ee=r(z,T,j,W),K=[z.id||"",ee.country,ee.state,ee.postal_code,T,j,W.join(",")].join("|");if(Y.key===K)return Y.quote;try{let re;if(window.ShippingApi?.calculateShipping)re=await ShippingApi.calculateShipping(ee);else{let ke=window.BUNORAA_CURRENCY?.code;re=await fetch("/api/v1/shipping/calculate/",{method:"POST",headers:{"Content-Type":"application/json","X-CSRFToken":window.CSRF_TOKEN||document.querySelector("[name=csrfmiddlewaretoken]")?.value||"",...ke?{"X-User-Currency":ke}:{}},body:JSON.stringify(ee)}).then(Ce=>Ce.json())}let ce=re?.data?.methods||re?.data?.data?.methods||re?.methods||[];if(!Array.isArray(ce)||ce.length===0)return null;let oe=ce.reduce((ke,Ce)=>{let Le=w(ke.rate);return w(Ce.rate)<Le?Ce:ke},ce[0]),ue=w(oe.rate),fe={cost:ue,isFree:oe.is_free||ue<=0,display:oe.rate_display||A(ue)};return Y={key:K,quote:fe},fe}catch{return null}}async function d(g,T,z){let q=document.getElementById("shipping"),j=document.getElementById("tax"),W=document.getElementById("total"),ee=Math.max(0,g-T),K=h(ee);j&&(j.textContent=A(K));let re=await I();if(!re){q&&(q.innerHTML=O),W&&(W.textContent=A(ee+K)),a(null);return}q&&(q.textContent="Calculating...");let ce=await l(z||n,g,re);if(!ce){q&&(q.innerHTML=O),W&&(W.textContent=A(ee+K)),a(re);return}q&&(q.textContent=ce.isFree?"Free":ce.display),W&&(W.textContent=A(ee+K+ce.cost)),a(re)}async function c(){await t(),te(),ge(),me()}function f(g,T,z){g&&(g.dataset.originalText||(g.dataset.originalText=g.textContent),g.disabled=T,g.textContent=T?z:g.dataset.originalText)}function x(g,T){let z=["request failed.","request failed","invalid response format","invalid request format"],q=K=>{if(!K)return!0;let re=String(K).trim().toLowerCase();return z.includes(re)},j=K=>{if(!K)return null;if(typeof K=="string")return K;if(Array.isArray(K))return K[0];if(typeof K=="object"){let re=Object.values(K),oe=(re.flat?re.flat():re.reduce((ue,fe)=>ue.concat(fe),[]))[0]??re[0];if(typeof oe=="string")return oe;if(oe&&typeof oe=="object")return j(oe)}return null},W=[];return g?.message&&W.push(g.message),g?.data?.message&&W.push(g.data.message),g?.data?.detail&&W.push(g.data.detail),g?.data&&typeof g.data=="string"&&W.push(g.data),g?.errors&&W.push(j(g.errors)),g?.data&&typeof g.data=="object"&&W.push(j(g.data)),W.find(K=>K&&!q(K))||T}function P(g){let T=document.getElementById("applied-coupon"),z=document.getElementById("coupon-name"),q=document.getElementById("coupon-form"),j=document.getElementById("coupon-code"),W=document.getElementById("apply-coupon-btn"),ee=j?.closest("div.flex"),K=document.getElementById("coupon-message");if(g){T&&T.classList.remove("hidden"),z&&(z.textContent=g),q&&q.classList.add("hidden"),!q&&ee&&ee.classList.add("hidden"),W&&W.classList.add("hidden"),j&&(j.value=g),K&&K.classList.add("hidden");return}T&&T.classList.add("hidden"),q&&q.classList.remove("hidden"),!q&&ee&&ee.classList.remove("hidden"),W&&W.classList.remove("hidden"),j&&(j.value="")}function G(g){let T=document.getElementById("validation-messages"),z=document.getElementById("validation-issues"),q=document.getElementById("validation-warnings"),j=document.getElementById("issues-list"),W=document.getElementById("warnings-list");if(!T||!z||!q||!j||!W)return;let ee=Array.isArray(g?.issues)?g.issues:[],K=Array.isArray(g?.warnings)?g.warnings:[];if(j.innerHTML=ee.map(re=>`<li class="flex items-start gap-2"><span class="mt-1 w-1.5 h-1.5 rounded-full bg-red-500 flex-shrink-0"></span><span>${Templates.escapeHtml(re?.message||"Issue found")}</span></li>`).join(""),W.innerHTML=K.map(re=>`<li class="flex items-start gap-2"><span class="mt-1 w-1.5 h-1.5 rounded-full bg-amber-500 flex-shrink-0"></span><span>${Templates.escapeHtml(re?.message||"Warning")}</span></li>`).join(""),!ee.length&&!K.length){T.classList.add("hidden"),z.classList.add("hidden"),q.classList.add("hidden");return}T.classList.remove("hidden"),z.classList.toggle("hidden",ee.length===0),q.classList.toggle("hidden",K.length===0),T.scrollIntoView({behavior:"smooth",block:"start"})}function te(){let g=document.getElementById("validate-cart-btn"),T=document.getElementById("lock-prices-btn"),z=document.getElementById("share-cart-btn");g&&g.getAttribute(p)!=="true"&&(g.setAttribute(p,"true"),g.addEventListener("click",async()=>{f(g,!0,"Validating...");try{let q=await CartApi.validateCart();G(q.data),(q.data?.issues||[]).length>0?Toast.warning("We found a few issues in your cart."):Toast.success("Cart looks good!")}catch(q){Toast.error(x(q,"Unable to validate cart right now."))}finally{f(g,!1)}})),T&&T.getAttribute(p)!=="true"&&(T.setAttribute(p,"true"),T.addEventListener("click",async()=>{f(T,!0,"Locking...");try{let j=(await CartApi.lockPrices()).data?.locked_count??0;Toast.success(`Locked prices for ${j} item${j===1?"":"s"}.`),await t()}catch(q){Toast.error(x(q,"Failed to lock prices."))}finally{f(T,!1)}})),z&&z.getAttribute(p)!=="true"&&(z.setAttribute(p,"true"),z.addEventListener("click",async()=>{f(z,!0,"Creating...");try{let j=(await CartApi.shareCart({permission:"view",expires_days:7})).data?.share_url;if(!j)throw new Error("Share link unavailable.");navigator.share?(await navigator.share({title:"Shared Cart",url:j}),Toast.success("Share link ready.")):navigator.clipboard?.writeText?(await navigator.clipboard.writeText(j),Toast.success("Share link copied to clipboard.")):window.prompt("Copy this link to share your cart:",j)}catch(q){Toast.error(x(q,"Failed to create share link."))}finally{f(z,!1)}}))}function me(){ye(),be(),ve(),R(),F()}function ye(){e=JSON.parse(localStorage.getItem("savedForLater")||"[]"),xe()}function xe(){let g=document.getElementById("saved-for-later");if(g){if(e.length===0){g.innerHTML="",g.classList.add("hidden");return}g.classList.remove("hidden"),g.innerHTML=`
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
                            <p class="text-sm font-semibold text-primary-600 dark:text-amber-400">${A(T.price)}</p>
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
        `,g.querySelectorAll(".move-to-cart-btn").forEach(T=>{T.addEventListener("click",async()=>{let q=T.closest(".saved-item")?.dataset.productId;if(q)try{await CartApi.addItem(q,1),e=e.filter(j=>j.id!==q),localStorage.setItem("savedForLater",JSON.stringify(e)),Toast.success("Item moved to cart"),await t(),xe()}catch{Toast.error("Failed to move item to cart")}})}),g.querySelectorAll(".remove-saved-btn").forEach(T=>{T.addEventListener("click",()=>{let q=T.closest(".saved-item")?.dataset.productId;q&&(e=e.filter(j=>j.id!==q),localStorage.setItem("savedForLater",JSON.stringify(e)),xe(),Toast.info("Item removed"))})}),document.getElementById("clear-saved-btn")?.addEventListener("click",()=>{e=[],localStorage.removeItem("savedForLater"),xe(),Toast.info("Saved items cleared")})}}function be(){let g=JSON.parse(localStorage.getItem("abandonedCart")||"null");g&&g.items?.length>0&&(!n||n.items?.length===0)&&we(g),Ee(),window.addEventListener("beforeunload",()=>{n&&n.items?.length>0&&localStorage.setItem("abandonedCart",JSON.stringify({items:n.items,savedAt:new Date().toISOString()}))})}function Ee(){let g=()=>{s&&clearTimeout(s),s=setTimeout(()=>{n&&n.items?.length>0&&pe()},i)};["click","scroll","keypress","mousemove"].forEach(T=>{document.addEventListener(T,g,{passive:!0,once:!1})}),g()}function we(g){let T=document.createElement("div");T.id="abandoned-cart-modal",T.className="fixed inset-0 z-50 flex items-center justify-center p-4",T.innerHTML=`
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
                    <p class="text-stone-600 dark:text-stone-400">You left ${g.items.length} item(s) in your cart.</p>
                </div>
                <div class="max-h-48 overflow-y-auto mb-6 space-y-2">
                    ${g.items.slice(0,3).map(z=>`
                        <div class="flex items-center gap-3 p-2 bg-stone-50 dark:bg-stone-700/50 rounded-lg">
                            <img src="${z.product_image||z.product?.image||"/static/images/placeholder.jpg"}" alt="" class="w-12 h-12 rounded object-cover">
                            <div class="flex-1 min-w-0">
                                <p class="text-sm font-medium text-stone-900 dark:text-white truncate">${Templates.escapeHtml(z.product_name||z.product?.name||"Product")}</p>
                                <p class="text-xs text-stone-500 dark:text-stone-400">Qty: ${z.quantity}</p>
                            </div>
                        </div>
                    `).join("")}
                    ${g.items.length>3?`<p class="text-center text-sm text-stone-500 dark:text-stone-400">+${g.items.length-3} more items</p>`:""}
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
        `,document.body.appendChild(T)}function pe(){sessionStorage.getItem("cartReminderShown")||(Toast.info("Don't forget! You have items in your cart",{duration:8e3,action:{text:"Checkout",onClick:()=>window.location.href="/checkout/"}}),sessionStorage.setItem("cartReminderShown","true"))}function ve(){y()}function y(){let g=document.getElementById("free-shipping-progress");if(!g||!n)return;let T=w(window.BUNORAA_CART?.freeShippingThreshold??50),z=w(n.summary?.subtotal||n.subtotal||0),q=Math.max(0,T-z),j=Math.min(100,z/T*100);if(g.dataset.freeShippingProgress==="bar"){let W=document.getElementById("free-shipping-status"),ee=document.getElementById("free-shipping-message");g.style.width=`${j}%`,z>=T?(W&&(W.textContent="Unlocked"),ee&&(ee.textContent="You've unlocked free delivery")):(W&&(W.textContent=`${A(q)} away`),ee&&(ee.textContent=`Free delivery on orders over ${A(T)}`));return}z>=T?g.innerHTML=`
                <div class="flex items-center gap-2 p-3 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl">
                    <svg class="w-5 h-5 text-emerald-600 dark:text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>
                    <span class="text-sm font-medium text-emerald-700 dark:text-emerald-300">You've unlocked FREE shipping!</span>
                </div>
            `:g.innerHTML=`
                <div class="p-3 bg-amber-50 dark:bg-amber-900/20 rounded-xl">
                    <div class="flex items-center justify-between text-sm mb-2">
                        <span class="text-amber-700 dark:text-amber-300">Add ${A(q)} for FREE shipping</span>
                        <span class="text-amber-600 dark:text-amber-400 font-medium">${Math.round(j)}%</span>
                    </div>
                    <div class="w-full bg-amber-200 dark:bg-amber-800 rounded-full h-2">
                        <div class="bg-amber-500 h-2 rounded-full transition-all duration-500" style="width: ${j}%"></div>
                    </div>
                </div>
            `}function C(){let g=document.getElementById("cart-delivery-estimate");if(!g)return;let T=new Date,z=3,q=7,j=new Date(T.getTime()+z*24*60*60*1e3),W=new Date(T.getTime()+q*24*60*60*1e3),ee=K=>K.toLocaleDateString("en-US",{weekday:"short",month:"short",day:"numeric"});g.innerHTML=`
            <div class="flex items-center gap-2 text-sm text-stone-600 dark:text-stone-400">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"/></svg>
                <span>Estimated delivery: <strong class="text-stone-900 dark:text-white">${ee(j)} - ${ee(W)}</strong></span>
            </div>
        `}function M(){let g=document.getElementById("delivery-division");if(!g)return;let T=()=>{let z=n?.summary||{},q=w(z.subtotal??n?.subtotal??0),j=w(z.discount_amount??n?.discount_amount??0);d(q,j,n)};g.addEventListener("change",T),T()}async function R(){let g=document.getElementById("cart-recommendations");if(!(!g||!n||!n.items?.length))try{let T=n.items.map(j=>j.product?.id||j.product_id).filter(Boolean);if(!T.length)return;let z=await ProductsApi.getRelated(T[0],{limit:4}),q=z?.data||z?.results||[];if(!q.length)return;g.innerHTML=`
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
                                    <p class="text-sm font-semibold text-primary-600 dark:text-amber-400 mt-1">${A(j.current_price||j.price)}</p>
                                    <button class="quick-add-btn w-full mt-2 py-2 text-xs font-medium text-primary-600 dark:text-amber-400 border border-primary-600 dark:border-amber-400 rounded-lg hover:bg-primary-50 dark:hover:bg-amber-900/20 transition-colors" data-product-id="${j.id}">
                                        + Add to Cart
                                    </button>
                                </div>
                            </div>
                        `).join("")}
                    </div>
                </div>
            `,g.querySelectorAll(".quick-add-btn").forEach(j=>{j.addEventListener("click",async()=>{let W=j.dataset.productId;j.disabled=!0,j.textContent="Adding...";try{await CartApi.addItem(W,1),Toast.success("Added to cart"),await t()}catch{Toast.error("Failed to add item")}finally{j.disabled=!1,j.textContent="+ Add to Cart"}})})}catch(T){console.warn("Failed to load recommendations:",T)}}function F(){let g=document.getElementById("cart-note"),T=document.getElementById("gift-order");if(g){let z=localStorage.getItem("cartNote")||"";g.value=z,g.addEventListener("input",D(()=>{localStorage.setItem("cartNote",g.value)},500))}if(T){let z=localStorage.getItem("isGiftOrder")==="true";T.checked=z,T.addEventListener("change",()=>{localStorage.setItem("isGiftOrder",T.checked)})}}function D(g,T){let z;return function(...j){clearTimeout(z),z=setTimeout(()=>g(...j),T)}}function X(){let g=document.getElementById("express-checkout");g&&(g.innerHTML=`
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
        `,g.querySelectorAll(".express-pay-btn").forEach(T=>{T.addEventListener("click",()=>{Toast.info("Express checkout coming soon!")})}))}async function t(){let g=document.getElementById("cart-container");if(g){g.dataset.cartRender!=="server"&&Loader.show(g,"skeleton");try{n=(await CartApi.getCart()).data,g.dataset.cartRender==="server"?o(n):u(n)}catch(T){console.error("Failed to load cart:",T),g.innerHTML='<p class="text-red-500 text-center py-8">Failed to load cart. Please try again.</p>'}}}function o(g){let T=document.getElementById("cart-container");if(!T)return;let z=g?.items||[],q=g?.summary||{};if(!z.length){T.innerHTML=`
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
            `;return}let j=q.subtotal??g?.subtotal??0,W=w(q.discount_amount??g?.discount_amount),ee=document.getElementById("subtotal"),K=document.getElementById("discount-row"),re=document.getElementById("discount"),ce=document.getElementById("savings-row"),oe=document.getElementById("savings");if(ee&&(ee.textContent=A(j)),K&&re&&(W>0?(K.classList.remove("hidden"),re.textContent=`-${A(W)}`):K.classList.add("hidden")),ce&&oe){let ue=w(q.total_savings);ue>0?(ce.classList.remove("hidden"),oe.textContent=A(ue)):ce.classList.add("hidden")}d(j,W,g),P(g?.coupon_code||g?.coupon?.code||q?.coupon_code||""),z.forEach(ue=>{let fe=T.querySelector(`.cart-item[data-item-id="${ue.id}"]`);if(!fe)return;let ke=fe.querySelector(".qty-input");ke&&ue.quantity&&(ke.value=ue.quantity);let Ce=fe.querySelector(".item-total");Ce&&(Ce.textContent=A(ue.total||ue.line_total||0));let Le=fe.querySelector(".item-unit-price");Le&&(Le.textContent=A(ue.unit_price||ue.current_price||ue.price_at_add||0));let Ie=fe.querySelector("img");Ie&&ue.product_image&&(Ie.src=ue.product_image)}),v(),y()}function u(g){let T=document.getElementById("cart-container");if(!T)return;let z=g?.items||[],q=g?.summary||{},j=q.subtotal??g?.subtotal??0,W=w(q.discount_amount??g?.discount_amount),ee=Math.max(0,j-W),K=h(ee),re=ee+K,ce=Q(),oe=g?.coupon?.code||g?.coupon_code||"";if(z.length===0){T.innerHTML=`
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
                            <h2 class="text-lg font-semibold text-gray-900">Shopping Cart (${z.length} items)</h2>
                        </div>
                        <div id="cart-items" class="divide-y divide-gray-100">
                            ${z.map(ue=>m(ue)).join("")}
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
                                <span class="font-medium text-gray-900 dark:text-white">${A(j)}</span>
                            </div>
                            ${W>0?`
                                <div class="flex justify-between text-green-600 dark:text-green-400">
                                    <span>Discount</span>
                                    <span>-${A(W)}</span>
                                </div>
                            `:""}
                            <div class="flex justify-between">
                                <span class="text-gray-600 dark:text-stone-400">Shipping</span>
                                <span id="shipping" class="font-medium text-gray-900 dark:text-white">Calculating...</span>
                            </div>
                            <div class="flex justify-between">
                                <span class="text-gray-600 dark:text-stone-400">VAT (${ce}%)</span>
                                <span id="tax" class="font-medium text-gray-900 dark:text-white">${A(K)}</span>
                            </div>
                            <div class="pt-3 border-t border-gray-200 dark:border-stone-600">
                                <div class="flex justify-between">
                                    <span class="text-base font-semibold text-gray-900 dark:text-white">Total</span>
                                    <span id="total" class="text-base font-bold text-gray-900 dark:text-white">${A(re)}</span>
                                </div>
                                <p class="text-xs text-gray-500 dark:text-stone-400 mt-1">Shipping calculated from your saved address</p>
                            </div>
                        </div>
                        
                        <!-- Coupon Form -->
                        <div class="mt-6 pt-6 border-t border-gray-200 dark:border-stone-600">
                            ${oe?`
                                <div class="flex items-center justify-between px-3 py-2 bg-green-50 dark:bg-green-900/20 rounded-lg">
                                    <p class="text-sm font-medium text-green-700 dark:text-green-400">
                                        Coupon Applied: <span class="font-semibold">${Templates.escapeHtml(oe)}</span>
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
                                        value="${Templates.escapeHtml(oe)}"
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
        `,v(),me(),d(j,W,g)}function m(g){let T=g.product||{},z=g.variant,q=T.slug||g.product_slug||"#",j=T.name||g.product_name||"Product",W=g.product_image||T.primary_image||T.image,ee=T.id||g.product_id||"",K=w(g.price_at_add),re=w(g.current_price||g.unit_price),ce=w(g.total||g.line_total)||re*(g.quantity||1),oe=K>re&&re>0;return`
            <div class="cart-item p-6 flex gap-4" data-item-id="${g.id}" data-product-id="${ee}">
                <div class="flex-shrink-0 w-24 h-24 bg-gray-100 dark:bg-stone-700 rounded-lg overflow-hidden">
                    <a href="/products/${q}/">
                        ${W?`
                        <img 
                            src="${W}" 
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
                            ${z||g.variant_name?`
                                <p class="text-sm text-gray-500 dark:text-stone-400 mt-1">${Templates.escapeHtml(z?.name||z?.value||g.variant_name)}</p>
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
                                value="${g.quantity}" 
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
                            ${oe?`
                                <span class="text-sm text-gray-400 dark:text-stone-500 line-through">${A(K*g.quantity)}</span>
                            `:""}
                            <span class="font-semibold text-gray-900 dark:text-white block">${A(ce)}</span>
                        </div>
                    </div>
                </div>
            </div>
        `}function v(){let g=document.getElementById("cart-items"),T=document.getElementById("clear-cart-btn"),z=document.getElementById("remove-coupon-btn");g&&g.getAttribute(p)!=="true"&&(g.setAttribute(p,"true"),g.addEventListener("click",async q=>{let j=q.target.closest(".cart-item");if(!j)return;let W=j.dataset.itemId,ee=j.dataset.productId,K=j.querySelector(".item-quantity")||j.querySelector(".qty-input");if(q.target.closest(".remove-item-btn"))await J(W);else if(q.target.closest(".save-for-later-btn"))await Z(W,ee,j);else if(q.target.closest(".qty-decrease")){let re=parseInt(K?.value,10)||1;re>1&&await $(W,re-1)}else if(q.target.closest(".qty-increase")){let re=parseInt(K?.value,10)||1,ce=parseInt(K?.max,10)||99;re<ce&&await $(W,re+1)}}),g.addEventListener("change",async q=>{if(q.target.classList.contains("item-quantity")||q.target.classList.contains("qty-input")){let W=q.target.closest(".cart-item")?.dataset.itemId,ee=parseInt(q.target.value,10)||1;W&&ee>0&&await $(W,ee)}})),T&&T.getAttribute(p)!=="true"&&(T.setAttribute(p,"true"),T.addEventListener("click",async()=>{await Modal.confirm({title:"Clear Cart",message:"Are you sure you want to remove all items from your cart?",confirmText:"Clear Cart",cancelText:"Cancel"})&&await ie()})),z&&z.getAttribute(p)!=="true"&&(z.setAttribute(p,"true"),z.addEventListener("click",async()=>{await he()}))}async function $(g,T){try{await CartApi.updateItem(g,T),await t(),document.dispatchEvent(new CustomEvent("cart:updated"))}catch(z){Toast.error(z.message||"Failed to update quantity.")}}async function J(g){try{await CartApi.removeItem(g),Toast.success("Item removed from cart."),await t(),document.dispatchEvent(new CustomEvent("cart:updated"))}catch(T){Toast.error(T.message||"Failed to remove item.")}}async function Z(g,T,z){try{let q=n?.items?.find(K=>String(K.id)===String(g));if(!q)return;let j=q.product||{},W={id:T||j.id||q.product_id,name:j.name||q.product_name||"Product",image:q.product_image||j.primary_image||j.image||"",price:q.current_price||q.unit_price||j.price||0};e.findIndex(K=>K.id===T)===-1&&(e.push(W),localStorage.setItem("savedForLater",JSON.stringify(e))),await CartApi.removeItem(g),Toast.success("Item saved for later"),await t(),document.dispatchEvent(new CustomEvent("cart:updated"))}catch(q){Toast.error(q.message||"Failed to save item.")}}async function ie(){try{await CartApi.clearCart(),Toast.success("Cart cleared."),await t(),document.dispatchEvent(new CustomEvent("cart:updated"))}catch(g){Toast.error(g.message||"Failed to clear cart.")}}function ge(){let g=document.getElementById("coupon-form");g?.addEventListener("submit",async z=>{z.preventDefault();let j=document.getElementById("coupon-code")?.value.trim();if(!j){Toast.error("Please enter a coupon code.");return}let W=g.querySelector('button[type="submit"]');W.disabled=!0,W.textContent="Applying...";try{let ee=w(n?.summary?.subtotal??n?.subtotal??0),K=await CartApi.applyCoupon(j,{subtotal:ee}),re=K?.data?.cart?.coupon?.code||K?.data?.cart?.coupon_code||j;P(re),Toast.success("Coupon applied!"),await t()}catch(ee){Toast.error(x(ee,"Invalid coupon code."))}finally{W.disabled=!1,W.textContent="Apply"}});let T=document.getElementById("apply-coupon-btn");T?.addEventListener("click",async()=>{let q=document.getElementById("coupon-code")?.value.trim();if(!q){Toast.error("Please enter a coupon code.");return}T.disabled=!0;let j=T.textContent;T.textContent="Applying...";try{let W=w(n?.summary?.subtotal??n?.subtotal??0),ee=await CartApi.applyCoupon(q,{subtotal:W}),K=ee?.data?.cart?.coupon?.code||ee?.data?.cart?.coupon_code||q;P(K),Toast.success("Coupon applied!"),await t()}catch(W){Toast.error(x(W,"Invalid coupon code."))}finally{T.disabled=!1,T.textContent=j||"Apply"}})}async function he(){try{await CartApi.removeCoupon(),P(""),Toast.success("Coupon removed."),await t()}catch(g){Toast.error(x(g,"Failed to remove coupon."))}}function $e(){n=null}return{init:c,destroy:$e}})();window.CartPage=qs;Er=qs});var Ns={};ne(Ns,{default:()=>Cr});var js,Cr,Fs=se(()=>{js=(function(){"use strict";let n={},e=1,s=null,i=null,p=!1,b=!1,w=!0,A=[],H=[],Q=4;async function ae(){if(p)return;p=!0;let t=G();if(!t)return;let o=document.getElementById("category-header");if(o&&o.querySelector("h1")){R(),F(),D(),O();return}n=te(),e=parseInt(new URLSearchParams(window.location.search).get("page"))||1,await me(t),R(),F(),D(),O()}function O(){E(),S(),a(),l(),c(),x()}function E(){let t=document.getElementById("load-more-trigger");if(!t)return;new IntersectionObserver(u=>{u.forEach(m=>{m.isIntersecting&&!b&&w&&_()})},{rootMargin:"200px 0px",threshold:.01}).observe(t)}async function _(){if(b||!w||!s)return;b=!0,e++;let t=document.getElementById("loading-more-indicator");t&&t.classList.remove("hidden");try{let o={category:s.id,page:e,limit:12,...n},u=await ProductsApi.getAll(o),m=u.data||[],v=u.meta||{};m.length===0?w=!1:(A=[...A,...m],Y(m),w=e<(v.total_pages||1)),ve()}catch(o){console.error("Failed to load more products:",o)}finally{b=!1,t&&t.classList.add("hidden")}}function Y(t){let o=document.getElementById("products-grid");if(!o)return;let u=Storage.get("productViewMode")||"grid";t.forEach(m=>{let v=ProductCard.render(m,{layout:u,showCompare:!0,showQuickView:!0}),$=document.createElement("div");$.innerHTML=v;let J=$.firstElementChild;J.classList.add("animate-fadeInUp"),o.appendChild(J)}),ProductCard.bindEvents(o)}function S(){H=JSON.parse(localStorage.getItem("compareProducts")||"[]"),k(),document.addEventListener("click",t=>{let o=t.target.closest("[data-compare]");if(!o)return;t.preventDefault();let u=parseInt(o.dataset.compare);L(u)})}function L(t){let o=H.findIndex(u=>u.id===t);if(o>-1)H.splice(o,1),Toast.info("Removed from compare");else{if(H.length>=Q){Toast.warning(`You can compare up to ${Q} products`);return}let u=A.find(m=>m.id===t);u&&(H.push({id:u.id,name:u.name,image:u.primary_image||u.image,price:u.price,sale_price:u.sale_price}),Toast.success("Added to compare"))}localStorage.setItem("compareProducts",JSON.stringify(H)),k(),B()}function k(){let t=document.getElementById("compare-bar");if(H.length===0){t?.remove();return}t||(t=document.createElement("div"),t.id="compare-bar",t.className="fixed bottom-0 left-0 right-0 bg-white dark:bg-stone-800 border-t border-stone-200 dark:border-stone-700 shadow-2xl z-40 transform transition-transform duration-300",document.body.appendChild(t)),t.innerHTML=`
            <div class="container mx-auto px-4 py-4">
                <div class="flex items-center justify-between gap-4">
                    <div class="flex items-center gap-3 overflow-x-auto">
                        <span class="text-sm font-medium text-stone-600 dark:text-stone-400 whitespace-nowrap">Compare (${H.length}/${Q}):</span>
                        ${H.map(o=>`
                            <div class="relative flex-shrink-0 group">
                                <img src="${o.image||"/static/images/placeholder.jpg"}" alt="${Templates.escapeHtml(o.name)}" class="w-14 h-14 object-cover rounded-lg border border-stone-200 dark:border-stone-600">
                                <button data-remove-compare="${o.id}" class="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
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
        `,t.querySelectorAll("[data-remove-compare]").forEach(o=>{o.addEventListener("click",()=>{let u=parseInt(o.dataset.removeCompare);L(u)})}),document.getElementById("compare-now-btn")?.addEventListener("click",h),document.getElementById("clear-compare-btn")?.addEventListener("click",I)}function B(){document.querySelectorAll("[data-compare]").forEach(t=>{let o=parseInt(t.dataset.compare);H.some(m=>m.id===o)?(t.classList.add("bg-primary-100","text-primary-600"),t.classList.remove("bg-stone-100","text-stone-600")):(t.classList.remove("bg-primary-100","text-primary-600"),t.classList.add("bg-stone-100","text-stone-600"))})}function I(){H=[],localStorage.removeItem("compareProducts"),k(),B(),Toast.info("Compare list cleared")}async function h(){if(H.length<2)return;let t=document.createElement("div");t.id="compare-modal",t.className="fixed inset-0 z-50 overflow-auto",t.innerHTML=`
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
                                    ${H.map(o=>`
                                        <th class="p-3 text-center">
                                            <div class="flex flex-col items-center">
                                                <img src="${o.image||"/static/images/placeholder.jpg"}" alt="${Templates.escapeHtml(o.name)}" class="w-24 h-24 object-cover rounded-xl mb-2">
                                                <span class="text-sm font-semibold text-stone-900 dark:text-white">${Templates.escapeHtml(o.name)}</span>
                                            </div>
                                        </th>
                                    `).join("")}
                                </tr>
                            </thead>
                            <tbody>
                                <tr class="border-t border-stone-100 dark:border-stone-700">
                                    <td class="p-3 text-sm font-medium text-stone-600 dark:text-stone-400">Price</td>
                                    ${H.map(o=>`
                                        <td class="p-3 text-center">
                                            ${o.sale_price?`
                                                <span class="text-lg font-bold text-primary-600 dark:text-amber-400">${Templates.formatPrice(o.sale_price)}</span>
                                                <span class="text-sm text-stone-400 line-through ml-1">${Templates.formatPrice(o.price)}</span>
                                            `:`
                                                <span class="text-lg font-bold text-stone-900 dark:text-white">${Templates.formatPrice(o.price)}</span>
                                            `}
                                        </td>
                                    `).join("")}
                                </tr>
                                <tr class="border-t border-stone-100 dark:border-stone-700">
                                    <td class="p-3 text-sm font-medium text-stone-600 dark:text-stone-400">Actions</td>
                                    ${H.map(o=>`
                                        <td class="p-3 text-center">
                                            <button onclick="CartApi.addItem(${o.id}, 1).then(() => Toast.success('Added to cart'))" class="px-4 py-2 bg-primary-600 dark:bg-amber-600 text-white text-sm font-medium rounded-lg hover:bg-primary-700 dark:hover:bg-amber-700 transition-colors">
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
        `,document.body.appendChild(t)}function a(){document.addEventListener("click",async t=>{let o=t.target.closest("[data-quick-view]");if(!o)return;let u=o.dataset.quickView;u&&(t.preventDefault(),await r(u))})}async function r(t){let o=document.createElement("div");o.id="quick-view-modal",o.className="fixed inset-0 z-50 flex items-center justify-center p-4",o.innerHTML=`
            <div class="absolute inset-0 bg-black/50 backdrop-blur-sm" onclick="document.getElementById('quick-view-modal').remove()"></div>
            <div class="relative bg-white dark:bg-stone-800 rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-auto">
                <div class="p-8 flex items-center justify-center min-h-[400px]">
                    <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 dark:border-amber-400"></div>
                </div>
            </div>
        `,document.body.appendChild(o);try{let u=await ProductsApi.getProduct(t),m=u.data||u,v=o.querySelector(".relative");v.innerHTML=`
                <button class="absolute top-4 right-4 z-10 w-10 h-10 bg-stone-100 dark:bg-stone-700 rounded-full flex items-center justify-center hover:bg-stone-200 dark:hover:bg-stone-600 transition-colors" onclick="document.getElementById('quick-view-modal').remove()">
                    <svg class="w-5 h-5 text-stone-600 dark:text-stone-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
                </button>
                <div class="grid md:grid-cols-2 gap-8 p-8">
                    <div>
                        <div class="aspect-square rounded-xl overflow-hidden bg-stone-100 dark:bg-stone-700 mb-4">
                            <img src="${m.primary_image||m.image||"/static/images/placeholder.jpg"}" alt="${Templates.escapeHtml(m.name)}" class="w-full h-full object-cover" id="quick-view-main-image">
                        </div>
                        ${m.images&&m.images.length>1?`
                            <div class="flex gap-2 overflow-x-auto pb-2">
                                ${m.images.slice(0,5).map((ge,he)=>`
                                    <button class="w-16 h-16 flex-shrink-0 rounded-lg overflow-hidden border-2 ${he===0?"border-primary-600 dark:border-amber-400":"border-transparent"} hover:border-primary-400 transition-colors" onclick="document.getElementById('quick-view-main-image').src='${ge.image||ge}'">
                                        <img src="${ge.thumbnail||ge.image||ge}" alt="" class="w-full h-full object-cover">
                                    </button>
                                `).join("")}
                            </div>
                        `:""}
                    </div>
                    <div class="flex flex-col">
                        <h2 class="text-2xl font-bold text-stone-900 dark:text-white mb-2">${Templates.escapeHtml(m.name)}</h2>
                        <div class="flex items-center gap-2 mb-4">
                            <div class="flex text-amber-400">
                                ${'<svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.967a1 1 0 00.95.69h4.178c.969 0 1.371 1.24.588 1.81l-3.385 2.46a1 1 0 00-.364 1.118l1.287 3.966c.3.922-.755 1.688-1.54 1.118l-3.385-2.46a1 1 0 00-1.175 0l-3.385 2.46c-.784.57-1.838-.196-1.54-1.118l1.287-3.966a1 1 0 00-.364-1.118l-3.385-2.46c-.783-.57-.38-1.81.588-1.81h4.178a1 1 0 00.95-.69l1.286-3.967z"/></svg>'.repeat(Math.round(m.rating||4))}
                            </div>
                            <span class="text-sm text-stone-500 dark:text-stone-400">(${m.review_count||0} reviews)</span>
                            ${m.stock_quantity<=5&&m.stock_quantity>0?`
                                <span class="text-sm text-orange-600 dark:text-orange-400 font-medium">Only ${m.stock_quantity} left!</span>
                            `:""}
                        </div>
                        <div class="mb-6">
                            ${m.sale_price||m.discounted_price?`
                                <span class="text-3xl font-bold text-primary-600 dark:text-amber-400">${Templates.formatPrice(m.sale_price||m.discounted_price)}</span>
                                <span class="text-lg text-stone-400 line-through ml-2">${Templates.formatPrice(m.price)}</span>
                                <span class="ml-2 px-2 py-1 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 text-sm font-medium rounded">Save ${Math.round((1-(m.sale_price||m.discounted_price)/m.price)*100)}%</span>
                            `:`
                                <span class="text-3xl font-bold text-stone-900 dark:text-white">${Templates.formatPrice(m.price)}</span>
                            `}
                        </div>
                        <p class="text-stone-600 dark:text-stone-400 mb-6 line-clamp-3">${Templates.escapeHtml(m.short_description||m.description||"")}</p>
                        
                        <!-- Quantity Selector -->
                        <div class="flex items-center gap-4 mb-6">
                            <span class="text-sm font-medium text-stone-700 dark:text-stone-300">Quantity:</span>
                            <div class="flex items-center border border-stone-300 dark:border-stone-600 rounded-lg">
                                <button id="qv-qty-minus" class="w-10 h-10 flex items-center justify-center text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-700 transition-colors">\u2212</button>
                                <input type="number" id="qv-qty-input" value="1" min="1" max="${m.stock_quantity||99}" class="w-16 h-10 text-center border-x border-stone-300 dark:border-stone-600 bg-transparent text-stone-900 dark:text-white">
                                <button id="qv-qty-plus" class="w-10 h-10 flex items-center justify-center text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-700 transition-colors">+</button>
                            </div>
                        </div>

                        <div class="mt-auto space-y-3">
                            <button id="qv-add-to-cart" class="w-full py-3 px-6 bg-primary-600 dark:bg-amber-600 hover:bg-primary-700 dark:hover:bg-amber-700 text-white font-semibold rounded-xl transition-colors flex items-center justify-center gap-2">
                                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"/></svg>
                                Add to Cart
                            </button>
                            <div class="grid grid-cols-2 gap-3">
                                <button onclick="WishlistApi.add(${m.id}).then(() => Toast.success('Added to wishlist'))" class="py-3 px-6 border-2 border-stone-200 dark:border-stone-600 text-stone-700 dark:text-stone-300 font-semibold rounded-xl hover:bg-stone-50 dark:hover:bg-stone-700 transition-colors flex items-center justify-center gap-2">
                                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/></svg>
                                    Wishlist
                                </button>
                                <a href="/products/${m.slug||m.id}/" class="py-3 px-6 border-2 border-stone-200 dark:border-stone-600 text-stone-700 dark:text-stone-300 font-semibold rounded-xl text-center hover:bg-stone-50 dark:hover:bg-stone-700 transition-colors">
                                    Full Details
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            `;let $=document.getElementById("qv-qty-input"),J=document.getElementById("qv-qty-minus"),Z=document.getElementById("qv-qty-plus"),ie=document.getElementById("qv-add-to-cart");J?.addEventListener("click",()=>{let ge=parseInt($.value)||1;ge>1&&($.value=ge-1)}),Z?.addEventListener("click",()=>{let ge=parseInt($.value)||1,he=parseInt($.max)||99;ge<he&&($.value=ge+1)}),ie?.addEventListener("click",async()=>{let ge=parseInt($.value)||1;ie.disabled=!0,ie.innerHTML='<svg class="animate-spin h-5 w-5 mx-auto" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>';try{await CartApi.addItem(m.id,ge),Toast.success("Added to cart"),o.remove()}catch{Toast.error("Failed to add to cart")}finally{ie.disabled=!1,ie.innerHTML='<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"/></svg> Add to Cart'}})}catch(u){console.error("Failed to load product:",u),o.remove(),Toast.error("Failed to load product details")}}function l(){if(!document.getElementById("price-range-slider"))return;let o=document.getElementById("filter-min-price"),u=document.getElementById("filter-max-price");!o||!u||[o,u].forEach(m=>{m.addEventListener("input",()=>{d()})})}function d(){let t=document.getElementById("price-range-display"),o=document.getElementById("filter-min-price")?.value||0,u=document.getElementById("filter-max-price")?.value||"\u221E";t&&(t.textContent=`$${o} - $${u}`)}function c(){f()}function f(){let t=document.getElementById("active-filters");if(!t)return;let o=[];if(n.min_price&&o.push({key:"min_price",label:`Min: $${n.min_price}`}),n.max_price&&o.push({key:"max_price",label:`Max: $${n.max_price}`}),n.in_stock&&o.push({key:"in_stock",label:"In Stock"}),n.on_sale&&o.push({key:"on_sale",label:"On Sale"}),n.ordering){let u={price:"Price: Low to High","-price":"Price: High to Low","-created_at":"Newest First",name:"A-Z","-popularity":"Most Popular"};o.push({key:"ordering",label:u[n.ordering]||n.ordering})}if(o.length===0){t.innerHTML="";return}t.innerHTML=`
            <div class="flex flex-wrap items-center gap-2 mb-4">
                <span class="text-sm text-stone-500 dark:text-stone-400">Active filters:</span>
                ${o.map(u=>`
                    <button data-remove-filter="${u.key}" class="inline-flex items-center gap-1 px-3 py-1 bg-primary-100 dark:bg-amber-900/30 text-primary-700 dark:text-amber-400 rounded-full text-sm hover:bg-primary-200 dark:hover:bg-amber-900/50 transition-colors">
                        ${u.label}
                        <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
                    </button>
                `).join("")}
                <button id="clear-all-active-filters" class="text-sm text-stone-500 dark:text-stone-400 hover:text-stone-700 dark:hover:text-stone-300 underline">Clear all</button>
            </div>
        `,t.querySelectorAll("[data-remove-filter]").forEach(u=>{u.addEventListener("click",()=>{let m=u.dataset.removeFilter;delete n[m],pe()})}),document.getElementById("clear-all-active-filters")?.addEventListener("click",()=>{n={},pe()})}function x(){P()}function P(t=null){let o=document.getElementById("product-count");o&&t!==null&&(o.textContent=`${t} products`)}function G(){let o=window.location.pathname.match(/\/categories\/([^\/]+)/);return o?o[1]:null}function te(){let t=new URLSearchParams(window.location.search),o={};t.get("min_price")&&(o.min_price=t.get("min_price")),t.get("max_price")&&(o.max_price=t.get("max_price")),t.get("ordering")&&(o.ordering=t.get("ordering")),t.get("in_stock")&&(o.in_stock=t.get("in_stock")==="true"),t.get("on_sale")&&(o.on_sale=t.get("on_sale")==="true");let u=t.getAll("attr");return u.length&&(o.attributes=u),o}async function me(t){let o=document.getElementById("category-header"),u=document.getElementById("category-products"),m=document.getElementById("category-filters");o&&Loader.show(o,"skeleton"),u&&Loader.show(u,"skeleton");try{let v=await CategoriesApi.getCategory(t);if(s=v.data||v,!s){window.location.href="/404/";return}ye(s),await xe(s),await be(s),await y(),await M(s)}catch(v){console.error("Failed to load category:",v),o&&(o.innerHTML='<p class="text-red-500">Failed to load category.</p>')}}function ye(t){let o=document.getElementById("category-header");o&&(document.title=`${t.name} | Bunoraa`,o.innerHTML=`
            <div class="relative py-8 md:py-12">
                ${t.image?`
                    <div class="absolute inset-0 overflow-hidden rounded-2xl">
                        <img src="${t.image}" alt="" class="w-full h-full object-cover opacity-20">
                        <div class="absolute inset-0 bg-gradient-to-r from-white via-white/95 to-white/80"></div>
                    </div>
                `:""}
                <div class="relative">
                    <h1 class="text-3xl md:text-4xl font-bold text-gray-900 mb-2">${Templates.escapeHtml(t.name)}</h1>
                    ${t.description?`
                        <p class="text-gray-600 max-w-2xl">${Templates.escapeHtml(t.description)}</p>
                    `:""}
                    ${t.product_count?`
                        <p class="mt-4 text-sm text-gray-500">${t.product_count} products</p>
                    `:""}
                </div>
            </div>
        `)}async function xe(t){let o=document.getElementById("breadcrumbs");if(o)try{let m=(await CategoriesApi.getBreadcrumbs(t.id)).data||[],v=[{label:"Home",url:"/"},{label:"Categories",url:"/categories/"},...m.map($=>({label:$.name,url:`/categories/${$.slug}/`}))];o.innerHTML=Breadcrumb.render(v)}catch(u){console.error("Failed to load breadcrumbs:",u)}}async function be(t){let o=document.getElementById("category-filters");if(o)try{let m=(await ProductsApi.getFilterOptions({category:t.id})).data||{};o.innerHTML=`
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

                    ${m.attributes&&m.attributes.length?`
                        ${m.attributes.map(v=>`
                            <div class="border-b border-gray-200 pb-6">
                                <h3 class="text-sm font-semibold text-gray-900 mb-4">${Templates.escapeHtml(v.name)}</h3>
                                <div class="space-y-2 max-h-48 overflow-y-auto">
                                    ${v.values.map($=>`
                                        <label class="flex items-center">
                                            <input 
                                                type="checkbox" 
                                                name="attr-${v.slug}"
                                                value="${Templates.escapeHtml($.value)}"
                                                ${n.attributes?.includes(`${v.slug}:${$.value}`)?"checked":""}
                                                class="filter-attribute w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                                                data-attribute="${v.slug}"
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
            `,Ee()}catch(u){console.error("Failed to load filters:",u),o.innerHTML=""}}function Ee(){let t=document.getElementById("apply-price-filter"),o=document.getElementById("filter-in-stock"),u=document.getElementById("filter-on-sale"),m=document.getElementById("clear-filters"),v=document.querySelectorAll(".filter-attribute");t?.addEventListener("click",()=>{let $=document.getElementById("filter-min-price")?.value,J=document.getElementById("filter-max-price")?.value;$?n.min_price=$:delete n.min_price,J?n.max_price=J:delete n.max_price,pe()}),o?.addEventListener("change",$=>{$.target.checked?n.in_stock=!0:delete n.in_stock,pe()}),u?.addEventListener("change",$=>{$.target.checked?n.on_sale=!0:delete n.on_sale,pe()}),v.forEach($=>{$.addEventListener("change",()=>{we(),pe()})}),m?.addEventListener("click",()=>{n={},e=1,pe()})}function we(){let t=document.querySelectorAll(".filter-attribute:checked"),o=[];t.forEach(u=>{o.push(`${u.dataset.attribute}:${u.value}`)}),o.length?n.attributes=o:delete n.attributes}function pe(){e=1,ve(),y()}function ve(){let t=new URLSearchParams;n.min_price&&t.set("min_price",n.min_price),n.max_price&&t.set("max_price",n.max_price),n.ordering&&t.set("ordering",n.ordering),n.in_stock&&t.set("in_stock","true"),n.on_sale&&t.set("on_sale","true"),n.attributes&&n.attributes.forEach(u=>t.append("attr",u)),e>1&&t.set("page",e);let o=`${window.location.pathname}${t.toString()?"?"+t.toString():""}`;window.history.pushState({},"",o)}async function y(){let t=document.getElementById("category-products");if(!(!t||!s)){i&&i.abort(),i=new AbortController,Loader.show(t,"skeleton");try{let o={category:s.id,page:e,limit:12,...n};n.attributes&&(delete o.attributes,n.attributes.forEach($=>{let[J,Z]=$.split(":");o[`attr_${J}`]=Z}));let u=await ProductsApi.getAll(o),m=u.data||[],v=u.meta||{};A=m,w=e<(v.total_pages||1),C(m,v),f(),P(v.total||m.length)}catch(o){if(o.name==="AbortError")return;console.error("Failed to load products:",o),t.innerHTML='<p class="text-red-500 text-center py-8">Failed to load products. Please try again.</p>'}}}function C(t,o){let u=document.getElementById("category-products");if(!u)return;let m=Storage.get("productViewMode")||"grid",v=m==="list"?"space-y-4":"grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6";if(t.length===0){u.innerHTML=`
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
            `,document.getElementById("clear-filters-empty")?.addEventListener("click",()=>{n={},e=1,pe()});return}if(u.innerHTML=`
            <div id="active-filters" class="mb-4"></div>
            <div id="products-grid" class="${v}">
                ${t.map($=>ProductCard.render($,{layout:m,showCompare:!0,showQuickView:!0})).join("")}
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
            
            ${o.total_pages>1?`
                <div id="products-pagination" class="mt-8"></div>
            `:""}
        `,ProductCard.bindEvents(u),f(),B(),E(),o.total_pages>1){let $=document.getElementById("products-pagination");$.innerHTML=Pagination.render({currentPage:o.current_page||e,totalPages:o.total_pages,totalItems:o.total}),$.addEventListener("click",J=>{let Z=J.target.closest("[data-page]");Z&&(e=parseInt(Z.dataset.page),w=!0,ve(),y(),window.scrollTo({top:0,behavior:"smooth"}))})}}async function M(t){let o=document.getElementById("subcategories");if(o)try{let m=(await CategoriesApi.getSubcategories(t.id)).data||[];if(m.length===0){o.innerHTML="";return}o.innerHTML=`
                <div class="mb-8">
                    <h2 class="text-lg font-semibold text-gray-900 mb-4">Browse Subcategories</h2>
                    <div class="flex flex-wrap gap-2">
                        ${m.map(v=>`
                            <a href="/categories/${v.slug}/" class="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-full text-sm transition-colors">
                                ${Templates.escapeHtml(v.name)}
                                ${v.product_count?`<span class="text-gray-400 ml-1">(${v.product_count})</span>`:""}
                            </a>
                        `).join("")}
                    </div>
                </div>
            `}catch(u){console.error("Failed to load subcategories:",u),o.innerHTML=""}}function R(){let t=document.getElementById("mobile-filter-btn"),o=document.getElementById("filter-sidebar"),u=document.getElementById("close-filter-btn");t?.addEventListener("click",()=>{o?.classList.remove("hidden"),document.body.classList.add("overflow-hidden")}),u?.addEventListener("click",()=>{o?.classList.add("hidden"),document.body.classList.remove("overflow-hidden")})}function F(){let t=document.getElementById("sort-select");t&&(t.value=n.ordering||"",t.addEventListener("change",o=>{o.target.value?n.ordering=o.target.value:delete n.ordering,pe()}))}function D(){let t=document.getElementById("view-grid"),o=document.getElementById("view-list");(Storage.get("productViewMode")||"grid")==="list"&&(t?.classList.remove("bg-gray-200"),o?.classList.add("bg-gray-200")),t?.addEventListener("click",()=>{Storage.set("productViewMode","grid"),t.classList.add("bg-gray-200"),o?.classList.remove("bg-gray-200"),y()}),o?.addEventListener("click",()=>{Storage.set("productViewMode","list"),o.classList.add("bg-gray-200"),t?.classList.remove("bg-gray-200"),y()})}function X(){i&&(i.abort(),i=null),n={},e=1,s=null,p=!1,b=!1,w=!0,A=[],document.getElementById("compare-bar")?.remove(),document.getElementById("quick-view-modal")?.remove(),document.getElementById("compare-modal")?.remove()}return{init:ae,destroy:X,toggleCompare:L,clearCompare:I}})();window.CategoryPage=js;Cr=js});var Rs={};ne(Rs,{default:()=>Lr});var zs,Lr,Os=se(()=>{zs=(async function(){"use strict";let n=null,e={shipping_address:null,billing_address:null,same_as_shipping:!0,shipping_method:null,payment_method:null,notes:""},s=1,i=!1,p=null,b=(y,C=0)=>{if(y==null||y==="")return C;let M=Number(y);return Number.isFinite(M)?M:C};function w(){let y=document.querySelector('input[name="payment_method"]:checked');if(y)return{type:y.dataset.feeType||"none",amount:b(y.dataset.feeAmount,0),percent:b(y.dataset.feePercent,0),name:y.dataset.feeName||""};let C=document.getElementById("order-summary");if(C){let M=b(C.dataset.paymentFee,0);return{type:M>0?"flat":"none",amount:M,percent:0,name:C.dataset.paymentFeeLabel||""}}return{type:"none",amount:0,percent:0,name:""}}function A(y,C){return C?C.type==="flat"?b(C.amount,0):C.type==="percent"?Math.max(0,y*(b(C.percent,0)/100)):0:0}function H(y=null){let C=document.getElementById("payment-fee-row"),M=document.getElementById("payment-fee-amount"),R=document.getElementById("payment-fee-label");if(!C||!M)return;let F=document.getElementById("order-total"),D=y!==null?y:b(F?.dataset?.price??F?.textContent,0),X=w(),t=A(D,X);if(!t||t<=0){C.classList.add("hidden");return}C.classList.remove("hidden"),M.textContent=Templates.formatPrice(t),R&&(R.textContent=X?.name?`Extra payment fee (${X.name})`:"Extra payment fee");let o=document.getElementById("order-summary");o&&(o.dataset.paymentFee=t,o.dataset.paymentFeeLabel=X?.name||"")}async function Q(){if(!AuthApi.isAuthenticated()&&!document.getElementById("guest-checkout")){Toast.info("Please login to continue checkout."),window.location.href="/account/login/?next=/checkout/";return}if(await ae(),!i){if(!n||!n.items||n.items.length===0){Toast.warning("Your cart is empty.");return}await L(),B(),xe(),me(),be()}}async function ae(){try{let y=await CartApi.getCart();if(!y||y.success===!1)throw{message:y?.message||"Failed to load cart",data:y?.data};n=y.data,S(),i=!1,p=null}catch(y){console.error("Failed to load cart:",y),i=!0,p=y,Toast.error(O(y,"Failed to load cart."))}}function O(y,C){let M=["request failed.","request failed","invalid response format","invalid request format"],R=t=>{if(!t)return!0;let o=String(t).trim().toLowerCase();return M.includes(o)},F=t=>{if(!t)return null;if(typeof t=="string")return t;if(Array.isArray(t))return t[0];if(typeof t=="object"){let o=Object.values(t),m=(o.flat?o.flat():o.reduce((v,$)=>v.concat($),[]))[0]??o[0];if(typeof m=="string")return m;if(m&&typeof m=="object")return F(m)}return null},D=[];return y?.message&&D.push(y.message),y?.data?.message&&D.push(y.data.message),y?.data?.detail&&D.push(y.data.detail),y?.data&&typeof y.data=="string"&&D.push(y.data),y?.errors&&D.push(F(y.errors)),y?.data&&typeof y.data=="object"&&D.push(F(y.data)),D.find(t=>t&&!R(t))||C}function E(y){if(!y)return{};let C=y.querySelector('button[type="submit"]'),M=y.querySelector("#btn-text")||y.querySelector("#button-text"),R=y.querySelector("#btn-spinner")||y.querySelector("#spinner"),F=y.querySelector("#arrow-icon"),D=M?M.textContent:C?C.textContent:"";return{button:C,textEl:M,spinnerEl:R,arrowEl:F,defaultText:D}}function _(y,C,M="Processing..."){y&&(y.button&&(y.button.disabled=C),y.textEl&&(y.textEl.textContent=C?M:y.defaultText),y.spinnerEl&&y.spinnerEl.classList.toggle("hidden",!C),y.arrowEl&&y.arrowEl.classList.toggle("hidden",C))}async function Y(y,C={}){if(!y||y.dataset.submitting==="true")return;if(i){Toast.error(O(p,"Failed to load cart."));return}let M=C.validate;if(typeof M=="function"&&!await M())return;let R=E(y);_(R,!0,C.loadingText||"Processing..."),y.dataset.submitting="true";try{let F=await fetch(y.action||window.location.href,{method:(y.method||"POST").toUpperCase(),body:new FormData(y),headers:{"X-Requested-With":"XMLHttpRequest"},credentials:"same-origin"}),D=null;try{D=await F.json()}catch{D=null}if(!F.ok||D&&D.success===!1)throw{message:D?.message||F.statusText||"Request failed.",data:D};let X=D?.redirect_url||C.redirectUrl;if(X){window.location.href=X;return}typeof C.onSuccess=="function"&&C.onSuccess(D)}catch(F){Toast.error(O(F,C.errorMessage||"Request failed.")),typeof C.onError=="function"&&C.onError(F)}finally{y.dataset.submitting="false",_(R,!1,C.loadingText||"Processing...")}}function S(){let y=document.getElementById("order-summary");if(!y||!n)return;let C=Array.isArray(n.items)?n.items:[],M=Number(n.item_count??C.length??0),R=`${M} item${M===1?"":"s"}`;document.querySelectorAll("[data-order-items-count]").forEach(oe=>{oe.textContent=R});let F=oe=>{let ue=Number(oe);return Number.isFinite(ue)?ue:0},D=()=>{let oe=document.getElementById("tax-rate-data")||document.querySelector("[data-tax-rate]");if(!oe)return 0;let ue=oe.dataset?.taxRate??oe.textContent??"",fe=parseFloat(ue);return Number.isFinite(fe)?fe:0},X=oe=>Templates.escapeHtml(String(oe??"")),t=()=>C.length?C.map((oe,ue)=>{let fe=oe.product?.name||oe.product_name||oe.name||"Item",ke=oe.product?.image||oe.product_image||oe.image||null,Ce=oe.variant?.name||oe.variant?.value||oe.variant_name||"",Le=F(oe.quantity||0),Ie=F(oe.price??oe.unit_price??oe.unitPrice??oe.price_at_add??0),pr=F(oe.total??Ie*Le);return`
                    <div class="flex items-start space-x-4 py-3 ${ue!==C.length-1?"border-b border-gray-100 dark:border-gray-700":""}">
                        <div class="relative flex-shrink-0">
                            ${ke?`
                                <img src="${ke}" alt="${X(fe)}" class="w-16 h-16 object-cover rounded-lg" loading="lazy" decoding="async" onerror="this.style.display='none'">
                            `:`
                                <div class="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center text-gray-400">
                                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                                    </svg>
                                </div>
                            `}
                            <span class="absolute -top-2 -right-2 w-5 h-5 bg-gray-600 text-white text-xs rounded-full flex items-center justify-center font-medium">
                                ${Le}
                            </span>
                        </div>
                        <div class="flex-1 min-w-0">
                            <p class="text-sm font-medium text-gray-900 dark:text-white truncate">${X(fe)}</p>
                            ${Ce?`<p class="text-xs text-gray-500 dark:text-gray-400">${X(Ce)}</p>`:""}
                        </div>
                        <p class="text-sm font-medium text-gray-900 dark:text-white">${Templates.formatPrice(pr)}</p>
                    </div>
                `}).join(""):'<p class="text-gray-500 dark:text-gray-400 text-center py-4">Your cart is empty</p>',o=F(n.subtotal),u=F(n.discount_amount),m=n.total!==void 0&&n.total!==null?F(n.total):Math.max(0,o-u),$=(y.querySelector("#shipping-cost")||document.getElementById("shipping-cost"))?.dataset?.price,J=$!==void 0&&$!==""?F($):null,Z=n.shipping_cost!==void 0&&n.shipping_cost!==null?F(n.shipping_cost):J,ie=D(),he=(y.querySelector("#tax-amount")||document.getElementById("tax-amount"))?.dataset?.price,$e=he!==void 0&&he!==""?F(he):null,g=n.tax_amount!==void 0&&n.tax_amount!==null?F(n.tax_amount):$e!==null?$e:ie>0?m*ie/100:0,T=Z!==null&&!Number.isNaN(Z),z=m+(T?Z:0)+(g||0),q=w(),j=A(z,q);y&&(y.dataset.paymentFee=j,q?.name&&(y.dataset.paymentFeeLabel=q.name));let W=`
            <div class="space-y-4 max-h-80 overflow-y-auto scrollbar-thin pr-2">
                ${t()}
            </div>
        `,ee=`
            <div id="payment-fee-row" class="flex justify-between text-sm text-gray-600 dark:text-gray-400 ${j>0?"":"hidden"}">
                <span id="payment-fee-label">Extra payment fee${q?.name?` (${X(q.name)})`:""}</span>
                <span id="payment-fee-amount">${Templates.formatPrice(j)}</span>
            </div>
        `,K=`
            <div class="space-y-3 border-t border-gray-200 dark:border-gray-700 mt-4 pt-4">
                <div class="flex justify-between text-sm text-gray-600 dark:text-gray-400">
                    <span>Subtotal</span>
                    <span id="subtotal" data-price="${o}">${Templates.formatPrice(o)}</span>
                </div>
                <div id="discount-row" class="flex justify-between text-sm text-green-600 ${u>0?"":"hidden"}">
                    <span>Discount</span>
                    <span id="discount-amount" data-price="${u}">-${Templates.formatPrice(u)}</span>
                    <span id="discount" class="hidden" data-price="${u}">-${Templates.formatPrice(u)}</span>
                </div>
                <div class="flex justify-between text-sm text-gray-600 dark:text-gray-400">
                    <span>Shipping</span>
                    <span id="shipping-cost" data-price="${T?Z:""}" class="font-medium text-gray-900 dark:text-white">
                        ${T?Z>0?Templates.formatPrice(Z):"Free":"Calculated next"}
                    </span>
                </div>
                ${ee}
                <div class="flex justify-between text-sm text-gray-600 dark:text-gray-400 ${ie>0||g>0?"":"hidden"}">
                    <span>Tax${ie>0?` (${ie}%)`:""}</span>
                    <span id="tax-amount" data-price="${g}">${Templates.formatPrice(g)}</span>
                </div>
                <div class="flex justify-between text-lg font-bold text-gray-900 dark:text-white border-t border-gray-200 dark:border-gray-700 pt-3">
                    <span>Total</span>
                    <span id="order-total" data-price="${z}">${Templates.formatPrice(z)}</span>
                </div>
            </div>
        `,re=y.querySelector("[data-order-items]"),ce=y.querySelector("[data-order-totals]");if(re||ce){re&&(re.innerHTML=W),ce&&(ce.innerHTML=K),H(z);return}y.innerHTML=W+K,H(z)}async function L(){if(AuthApi.isAuthenticated())try{let C=(await AuthApi.getAddresses()).data||[],M=document.getElementById("saved-addresses"),R=M&&(M.dataset.jsRender==="true"||M.children.length===0);M&&C.length>0&&(R&&(M.innerHTML=`
                    <div class="mb-4">
                        <label class="block text-sm font-medium text-gray-700 mb-2">Saved Addresses</label>
                        <div class="space-y-2">
                            ${C.map(F=>`
                                <label class="flex items-start p-3 border border-gray-200 rounded-lg cursor-pointer hover:border-primary-500 transition-colors">
                                    <input type="radio" name="saved_address" value="${F.id}" class="mt-1 text-primary-600 focus:ring-primary-500">
                                    <div class="ml-3">
                                        <p class="font-medium text-gray-900">${Templates.escapeHtml(F.full_name||`${F.first_name} ${F.last_name}`)}</p>
                                        <p class="text-sm text-gray-600">${Templates.escapeHtml(F.address_line_1)}</p>
                                        ${F.address_line_2?`<p class="text-sm text-gray-600">${Templates.escapeHtml(F.address_line_2)}</p>`:""}
                                        <p class="text-sm text-gray-600">${Templates.escapeHtml(F.city)}, ${Templates.escapeHtml(F.state||"")} ${Templates.escapeHtml(F.postal_code)}</p>
                                        <p class="text-sm text-gray-600">${Templates.escapeHtml(F.country)}</p>
                                        ${F.is_default?'<span class="inline-block mt-1 px-2 py-0.5 bg-primary-100 text-primary-700 text-xs rounded">Default</span>':""}
                                    </div>
                                </label>
                            `).join("")}
                            <label class="flex items-center p-3 border border-gray-200 rounded-lg cursor-pointer hover:border-primary-500 transition-colors">
                                <input type="radio" name="saved_address" value="new" class="text-primary-600 focus:ring-primary-500" checked>
                                <span class="ml-3 text-gray-700">Enter a new address</span>
                            </label>
                        </div>
                    </div>
                `),k())}catch(y){console.error("Failed to load addresses:",y)}}function k(){let y=document.querySelectorAll('input[name="saved_address"]'),C=document.getElementById("new-address-form");y.forEach(M=>{M.addEventListener("change",R=>{R.target.value==="new"?C?.classList.remove("hidden"):(C?.classList.add("hidden"),e.shipping_address=R.target.value)})})}function B(){let y=document.querySelectorAll("[data-step]"),C=document.querySelectorAll("[data-step-indicator]"),M=document.querySelectorAll("[data-next-step]"),R=document.querySelectorAll("[data-prev-step]");function F(D){y.forEach(X=>{X.classList.toggle("hidden",parseInt(X.dataset.step)!==D)}),C.forEach(X=>{let t=parseInt(X.dataset.stepIndicator);X.classList.toggle("bg-primary-600",t<=D),X.classList.toggle("text-white",t<=D),X.classList.toggle("bg-gray-200",t>D),X.classList.toggle("text-gray-600",t>D)}),s=D}M.forEach(D=>{D.addEventListener("click",async()=>{await I()&&(s===1&&await d(),F(s+1),window.scrollTo({top:0,behavior:"smooth"}))})}),R.forEach(D=>{D.addEventListener("click",()=>{F(s-1),window.scrollTo({top:0,behavior:"smooth"})})}),F(1)}async function I(){switch(s){case 1:return l();case 2:return te();case 3:return ye();default:return!0}}function h(y){y&&(y.querySelectorAll("[data-error-for]").forEach(C=>C.remove()),y.querySelectorAll('[class*="!border-red-500"]').forEach(C=>C.classList.remove("!border-red-500")))}function a(y,C){if(!y)return;let M=y.getAttribute("name")||y.id||Math.random().toString(36).slice(2,8),R=y.closest("form")?.querySelector(`[data-error-for="${M}"]`);R&&R.remove();let F=document.createElement("p");F.className="text-sm text-red-600 mt-1",F.setAttribute("data-error-for",M),F.textContent=C,y.classList.add("!border-red-500"),y.nextSibling?y.parentNode.insertBefore(F,y.nextSibling):y.parentNode.appendChild(F)}function r(y){if(!y)return;let C=y.querySelector("[data-error-for]");if(!C)return;let M=C.getAttribute("data-error-for"),R=y.querySelector(`[name="${M}"]`)||y.querySelector(`#${M}`)||C.previousElementSibling;if(R&&typeof R.focus=="function")try{R.focus({preventScroll:!0})}catch{R.focus()}}function l(){let y=document.querySelector('input[name="saved_address"]:checked');if(y&&y.value!=="new")return h(document.getElementById("new-address-form")||document.getElementById("information-form")),e.shipping_address=y.value,!0;let C=document.getElementById("shipping-address-form")||document.getElementById("information-form")||document.getElementById("new-address-form");if(!C)return!1;h(C);let M=new FormData(C),R={first_name:M.get("first_name")||M.get("full_name")?.split(" ")?.[0],last_name:M.get("last_name")||(M.get("full_name")?M.get("full_name").split(" ").slice(1).join(" "):""),email:M.get("email"),phone:M.get("phone"),address_line_1:M.get("address_line1")||M.get("address_line_1"),address_line_2:M.get("address_line2")||M.get("address_line_2"),city:M.get("city"),state:M.get("state"),postal_code:M.get("postal_code"),country:M.get("country")},D=["email","first_name","address_line_1","city","postal_code"].filter(X=>!R[X]);if(D.length>0)return D.forEach(X=>{let t=`[name="${X}"]`;X==="address_line_1"&&(t='[name="address_line1"],[name="address_line_1"]');let o=C.querySelector(t);a(o||C,X.replace("_"," ").replace(/\b\w/g,u=>u.toUpperCase())+" is required.")}),r(C),!1;if(R.email&&!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(R.email)){let X=C.querySelector('[name="email"]');return a(X||C,"Please enter a valid email address."),r(C),!1}return e.shipping_address=R,!0}async function d(){let y=document.getElementById("shipping-methods");if(y){Loader.show(y,"spinner");try{let C=e.shipping_address;if(!C){y.innerHTML='<p class="text-gray-500">Please provide a shipping address to view shipping methods.</p>';return}let M=typeof C=="object"?{country:C.country,postal_code:C.postal_code,city:C.city}:{address_id:C},F=(await ShippingApi.getRates(M)).data||[];if(F.length===0){y.innerHTML='<p class="text-gray-500">No shipping methods available for your location.</p>';return}y.innerHTML=`
                <div class="space-y-3">
                    ${F.map((X,t)=>`
                        <label class="flex items-center justify-between p-4 border border-gray-200 rounded-lg cursor-pointer hover:border-primary-500 transition-colors">
                            <div class="flex items-center">
                                <input 
                                    type="radio" 
                                    name="shipping_method" 
                                    value="${X.id}" 
                                    ${t===0?"checked":""}
                                    class="text-primary-600 focus:ring-primary-500"
                                    data-price="${X.price}"
                                >
                                <div class="ml-3">
                                    <p class="font-medium text-gray-900">${Templates.escapeHtml(X.name)}</p>
                                    ${X.description?`<p class="text-sm text-gray-500">${Templates.escapeHtml(X.description)}</p>`:""}
                                    ${X.estimated_days?`<p class="text-sm text-gray-500">Delivery in ${X.estimated_days} days</p>`:""}
                                </div>
                            </div>
                            <span class="font-semibold text-gray-900">${X.price>0?Templates.formatPrice(X.price):"Free"}</span>
                        </label>
                    `).join("")}
                </div>
            `,y.querySelectorAll('input[name="shipping_method"]').forEach((X,t)=>{X.__price=F[t]?F[t].price:0,X.addEventListener("change",()=>{G(parseFloat(X.__price)||0)})}),F.length>0&&(e.shipping_method=F[0].id,G(F[0].price||0))}catch(C){console.error("Failed to load shipping methods:",C),y.innerHTML='<p class="text-red-500">Failed to load shipping methods. Please try again.</p>'}}}function c(y){let C=document.getElementById("submit-button"),M=document.getElementById("button-text");!C||!M||(C.disabled=!y,M.textContent=y?"Continue to Review":"No payment methods available")}async function f(){let y=document.getElementById("payment-methods-container");if(y)try{let C=new URLSearchParams;window.CONFIG&&CONFIG.shippingData&&CONFIG.shippingData.countryCode&&C.set("country",CONFIG.shippingData.countryCode),n&&(n.total||n.total===0)&&C.set("amount",n.total);let R=await(await fetch(`/api/v1/payments/gateways/available/?${C.toString()}`,{credentials:"same-origin"})).json(),F=R&&R.data||[],D=y.querySelectorAll(".payment-option");if(D&&D.length>0){try{let t=Array.from(D).map(m=>m.dataset.gateway).filter(Boolean),o=(F||[]).map(m=>m.code);if(t.length===o.length&&t.every((m,v)=>m===o[v])){xe(),c(t.length>0);return}}catch(t){console.warn("Failed to compare existing payment gateways:",t)}if(F.length===0){c(D.length>0);return}}if(!F||F.length===0){y.innerHTML=`
                    <div class="text-center py-8 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl">
                        <svg class="w-16 h-16 mx-auto mb-4 text-gray-300 dark:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"></path></svg>
                        <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">No payment methods are configured</h3>
                        <p class="text-gray-500 dark:text-gray-400 mb-2">We don't have any payment providers configured for your currency or location. Please contact support to enable online payments.</p>
                        <p class="text-sm text-gray-400">You can still place an order if Cash on Delivery or Bank Transfer is available from admin.</p>
                  </div>
              `,c(!1);return}let X=document.createDocumentFragment();F.forEach((t,o)=>{let u=document.createElement("div");u.className="relative payment-option transform transition-all duration-300 hover:scale-[1.01]",u.dataset.gateway=t.code,u.style.animation="slideIn 0.3s ease-out both",u.style.animationDelay=`${o*80}ms`;let m=document.createElement("input");m.type="radio",m.name="payment_method",m.value=t.code,m.id=`payment-${t.code}`,m.className="peer sr-only",m.dataset.feeType=t.fee_type||"none",m.dataset.feeAmount=t.fee_amount_converted??t.fee_amount??0,m.dataset.feePercent=t.fee_amount??0,m.dataset.feeName=t.name||"",o===0&&(m.checked=!0);let v=document.createElement("label");v.setAttribute("for",m.id),v.className="flex items-center justify-between p-4 border-2 rounded-xl cursor-pointer transition-all duration-300 hover:border-gray-400 border-gray-200",v.innerHTML=`
                    <div class="flex items-center">
                        <div class="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mr-4">
                            ${t.icon_url?`<img src="${t.icon_url}" class="h-6" alt="${t.name}">`:`<span class="font-bold">${t.code.toUpperCase()}</span>`}
                        </div>
                        <div>
                            <p class="font-medium text-gray-900 dark:text-white">${Templates.escapeHtml(t.name)}</p>
                            <p class="text-sm text-gray-500 dark:text-gray-400">${Templates.escapeHtml(t.description||"")}</p>
                            ${t.fee_text?`<p class="text-xs text-amber-600 dark:text-amber-400 mt-1">${Templates.escapeHtml(t.fee_text)}</p>`:""}
                            ${t.instructions?`<p class="text-xs text-gray-500 dark:text-gray-400 mt-2">${t.instructions}</p>`:""}
                        </div>
                    </div>
                `,u.appendChild(m),u.appendChild(v);let $=document.createElement("div");$.className="absolute top-4 right-4 opacity-0 peer-checked:opacity-100 transition-opacity duration-300",$.innerHTML='<svg class="w-6 h-6 text-primary-600" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"></path></svg>',u.appendChild($),X.appendChild(u),t.public_key&&t.requires_client&&x(t.public_key).catch(J=>console.error("Failed to load Stripe:",J))}),y.replaceChildren(X),xe(),c(F.length>0),H()}catch(C){console.error("Failed to load payment gateways:",C)}}function x(y){return new Promise((C,M)=>{if(window.Stripe&&window.STRIPE_PUBLISHABLE_KEY===y){C();return}if(window.STRIPE_PUBLISHABLE_KEY=y,window.Stripe){P(y),C();return}let R=document.createElement("script");R.src="https://js.stripe.com/v3/",R.async=!0,R.onload=()=>{try{P(y),C()}catch(F){M(F)}},R.onerror=F=>M(F),document.head.appendChild(R)})}function P(y){if(typeof Stripe>"u")throw new Error("Stripe script not loaded");try{let C=Stripe(y),R=C.elements().create("card"),F=document.getElementById("card-element");F&&(F.innerHTML="",R.mount("#card-element"),R.on("change",D=>{let X=document.getElementById("card-errors");X&&(X.textContent=D.error?D.error.message:"")}),window.stripeInstance=C,window.stripeCard=R)}catch(C){throw console.error("Error initializing Stripe elements:",C),C}}(function(){document.addEventListener("DOMContentLoaded",()=>{setTimeout(()=>{f()},50)})})();function G(y){let C=document.getElementById("shipping-cost"),M=document.getElementById("order-total");if(C&&(C.textContent=y>0?Templates.formatPrice(y):"Free"),M&&n){let R=(n.total||0)+y;M.textContent=Templates.formatPrice(R)}}function te(){let y=document.querySelector('input[name="shipping_method"]:checked');return y?(e.shipping_method=y.value,!0):(Toast.error("Please select a shipping method."),!1)}function me(){let y=document.getElementById("order-summary-toggle"),C=document.getElementById("order-summary-block");if(!y||!C)return;y.addEventListener("click",()=>{let R=C.classList.toggle("hidden");y.setAttribute("aria-expanded",(!R).toString());let F=y.querySelector("svg");F&&F.classList.toggle("rotate-180",!R)});let M=window.getComputedStyle(C).display==="none"||C.classList.contains("hidden");y.setAttribute("aria-expanded",(!M).toString())}function ye(){let y=document.querySelector('input[name="payment_method"]:checked'),C=document.getElementById("payment-form");if(h(C),!y){let R=document.getElementById("payment-methods-container")||C;return a(R,"Please select a payment method."),r(R),!1}let M=y.value;if(M==="stripe"){let R=document.getElementById("cardholder-name");if(!R||!R.value.trim())return a(R||C,"Cardholder name is required."),r(C),!1;if(!window.stripeCard)return a(document.getElementById("card-element")||C,"Card input not ready. Please wait and try again."),!1}if(M==="bkash"){let R=document.getElementById("bkash-number");if(!R||!R.value.trim())return a(R||C,"bKash mobile number is required."),r(C),!1}if(M==="nagad"){let R=document.getElementById("nagad-number");if(!R||!R.value.trim())return a(R||C,"Nagad mobile number is required."),r(C),!1}return e.payment_method=M,!0}function xe(){let y=document.getElementById("same-as-shipping"),C=document.getElementById("billing-address-form");y?.addEventListener("change",D=>{e.same_as_shipping=D.target.checked,C?.classList.toggle("hidden",D.target.checked)}),document.querySelectorAll('input[name="payment_method"]').forEach(D=>{let X=t=>{document.querySelectorAll("[data-payment-form]").forEach(m=>{m.classList.add("hidden")});let o=t.target?t.target.value:D.value||null;if(!o)return;let u=document.querySelector(`[data-payment-form="${o}"]`);u||(u=document.getElementById(`${o}-form`)),u?.classList.remove("hidden"),H()};D.addEventListener("change",X),D.checked&&X({target:D})});let R=document.getElementById("place-order-btn"),F=document.getElementById("place-order-form");R&&(!F||!F.action||F.action.includes("javascript"))&&R.addEventListener("click",async D=>{D.preventDefault(),await Ee()})}function be(){let y=document.getElementById("information-form");y&&y.dataset.ajaxBound!=="true"&&(y.dataset.ajaxBound="true",y.addEventListener("submit",M=>{M.preventDefault(),M.stopImmediatePropagation(),Y(y,{validate:l,redirectUrl:"/checkout/shipping/",loadingText:"Processing..."})},!0));let C=document.getElementById("shipping-form");C&&C.dataset.ajaxBound!=="true"&&(C.dataset.ajaxBound="true",C.addEventListener("submit",M=>{if(M.preventDefault(),M.stopImmediatePropagation(),(document.getElementById("shipping-type")?.value||"delivery")==="pickup"){if(!document.querySelector('input[name="pickup_location"]:checked')){Toast.error("Please select a pickup location.");return}}else if(!(document.querySelector('input[name="shipping_rate_id"]:checked')||document.querySelector('input[name="shipping_method"]:checked'))){Toast.error("Please select a shipping method.");return}Y(C,{redirectUrl:"/checkout/payment/",loadingText:"Processing..."})},!0))}async function Ee(){if(!ye())return;let y=document.getElementById("place-order-btn");y.disabled=!0,y.innerHTML='<svg class="animate-spin h-5 w-5 mx-auto" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>';try{let C=document.getElementById("order-notes")?.value;if(e.notes=C||"",!e.same_as_shipping){let F=document.getElementById("billing-address-form");if(F){let D=new FormData(F);e.billing_address={first_name:D.get("billing_first_name"),last_name:D.get("billing_last_name"),address_line_1:D.get("billing_address_line_1"),address_line_2:D.get("billing_address_line_2"),city:D.get("billing_city"),state:D.get("billing_state"),postal_code:D.get("billing_postal_code"),country:D.get("billing_country")}}}let R=(await CheckoutApi.createOrder(e)).data;e.payment_method==="stripe"||e.payment_method==="card"?await we(R):e.payment_method==="paypal"?await pe(R):window.location.href=`/orders/${R.id}/confirmation/`}catch(C){console.error("Failed to place order:",C),Toast.error(C.message||"Failed to place order. Please try again."),y.disabled=!1,y.textContent="Place Order"}}async function we(y){try{let C=await CheckoutApi.createPaymentIntent(y.id),{client_secret:M}=C.data,R=C.data.publishable_key||window.STRIPE_PUBLISHABLE_KEY||(window.stripeInstance?window.STRIPE_PUBLISHABLE_KEY:null);if(typeof Stripe>"u"&&!window.stripeInstance)throw new Error("Stripe is not loaded.");let D=await(window.stripeInstance||Stripe(R)).confirmCardPayment(M,{payment_method:{card:window.stripeCard,billing_details:{name:`${e.shipping_address.first_name} ${e.shipping_address.last_name}`}}});if(D.error)throw new Error(D.error.message);window.location.href=`/orders/${y.id}/confirmation/`}catch(C){console.error("Stripe payment failed:",C),Toast.error(C.message||"Payment failed. Please try again.");let M=document.getElementById("place-order-btn");M.disabled=!1,M.textContent="Place Order"}}async function pe(y){try{let C=await CheckoutApi.createPayPalOrder(y.id),{approval_url:M}=C.data;window.location.href=M}catch(C){console.error("PayPal payment failed:",C),Toast.error(C.message||"Payment failed. Please try again.");let M=document.getElementById("place-order-btn");M.disabled=!1,M.textContent="Place Order"}}function ve(){n=null,e={shipping_address:null,billing_address:null,same_as_shipping:!0,shipping_method:null,payment_method:null,notes:""},s=1}return{init:Q,destroy:ve}})();window.CheckoutPage=zs;Lr=zs});var Vs={};ne(Vs,{default:()=>$r});var Ds,$r,Us=se(()=>{Ds=(function(){"use strict";async function n(){A(),await Q(),e()}function e(){s(),i(),p(),b(),w()}function s(){let O=document.getElementById("contact-map");if(!O)return;let E=O.dataset.lat||"0",_=O.dataset.lng||"0",Y=O.dataset.address||"Our Location";O.innerHTML=`
            <div class="relative w-full h-64 md:h-80 rounded-2xl overflow-hidden bg-stone-100 dark:bg-stone-800 group">
                <iframe 
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3022.9663095343008!2d${_}!3d${E}!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zM!5e0!3m2!1sen!2sus!4v1234567890"
                    class="w-full h-full border-0"
                    allowfullscreen=""
                    loading="lazy"
                    referrerpolicy="no-referrer-when-downgrade"
                ></iframe>
                <a 
                    href="https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(Y)}"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="absolute bottom-4 right-4 px-4 py-2 bg-white dark:bg-stone-800 rounded-xl shadow-lg flex items-center gap-2 text-sm font-medium text-stone-700 dark:text-stone-200 hover:bg-stone-50 dark:hover:bg-stone-700 transition-colors"
                >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/></svg>
                    Open in Google Maps
                </a>
            </div>
        `}function i(){let O=document.getElementById("live-chat-cta");O&&(O.innerHTML=`
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
        `,document.getElementById("open-live-chat")?.addEventListener("click",()=>{document.dispatchEvent(new CustomEvent("chat:open"))}))}function p(){let O=document.getElementById("quick-contact");if(!O)return;let E=[{icon:"phone",label:"Call Us",action:"tel:",color:"emerald"},{icon:"whatsapp",label:"WhatsApp",action:"https://wa.me/",color:"green"},{icon:"email",label:"Email",action:"mailto:",color:"blue"}];O.innerHTML=`
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
        `}function b(){let O=document.getElementById("faq-preview");if(!O)return;let E=[{q:"How long does shipping take?",a:"Standard shipping takes 5-7 business days. Express options are available at checkout."},{q:"What is your return policy?",a:"We offer a 30-day hassle-free return policy on all unused items in original packaging."},{q:"Do you ship internationally?",a:"Yes! We ship to over 100 countries worldwide."}];O.innerHTML=`
            <div class="bg-white dark:bg-stone-800 rounded-2xl border border-stone-200 dark:border-stone-700 overflow-hidden">
                <div class="px-6 py-4 border-b border-stone-200 dark:border-stone-700 flex items-center justify-between">
                    <h3 class="font-semibold text-stone-900 dark:text-white">Frequently Asked Questions</h3>
                    <a href="/faq/" class="text-sm text-primary-600 dark:text-amber-400 hover:underline">View All</a>
                </div>
                <div class="divide-y divide-stone-200 dark:divide-stone-700">
                    ${E.map((_,Y)=>`
                        <div class="faq-item" data-index="${Y}">
                            <button class="faq-trigger w-full px-6 py-4 flex items-center justify-between text-left hover:bg-stone-50 dark:hover:bg-stone-700/50 transition-colors">
                                <span class="font-medium text-stone-900 dark:text-white pr-4">${Templates.escapeHtml(_.q)}</span>
                                <svg class="faq-icon w-5 h-5 text-stone-400 transform transition-transform flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/></svg>
                            </button>
                            <div class="faq-answer hidden px-6 pb-4 text-stone-600 dark:text-stone-400">
                                ${Templates.escapeHtml(_.a)}
                            </div>
                        </div>
                    `).join("")}
                </div>
            </div>
        `,O.querySelectorAll(".faq-trigger").forEach(_=>{_.addEventListener("click",()=>{let Y=_.closest(".faq-item"),S=Y.querySelector(".faq-answer"),L=Y.querySelector(".faq-icon"),k=!S.classList.contains("hidden");O.querySelectorAll(".faq-item").forEach(B=>{B!==Y&&(B.querySelector(".faq-answer").classList.add("hidden"),B.querySelector(".faq-icon").classList.remove("rotate-180"))}),S.classList.toggle("hidden"),L.classList.toggle("rotate-180")})})}function w(){let O=document.getElementById("office-status");if(!O)return;let E={start:9,end:18,timezone:"America/New_York",days:[1,2,3,4,5]};function _(){let Y=new Date,S=Y.getDay(),L=Y.getHours(),B=E.days.includes(S)&&L>=E.start&&L<E.end;O.innerHTML=`
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
                            ${B?"Our team is available to help you.":`Office hours: Mon-Fri ${E.start}AM - ${E.end>12?E.end-12+"PM":E.end+"AM"}`}
                        </p>
                    </div>
                </div>
            `}_(),setInterval(_,6e4)}function A(){let O=document.getElementById("contact-form");if(!O)return;let E=FormValidator.create(O,{name:{required:!0,minLength:2,maxLength:100},email:{required:!0,email:!0},subject:{required:!0,minLength:5,maxLength:200},message:{required:!0,minLength:20,maxLength:2e3}});O.addEventListener("submit",async _=>{if(_.preventDefault(),!E.validate()){Toast.error("Please fill in all required fields correctly.");return}let Y=O.querySelector('button[type="submit"]'),S=Y.textContent;Y.disabled=!0,Y.innerHTML='<svg class="animate-spin h-5 w-5 mx-auto" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>';try{let L=new FormData(O),k={name:L.get("name"),email:L.get("email"),phone:L.get("phone"),subject:L.get("subject"),message:L.get("message")};await SupportApi.submitContactForm(k),Toast.success("Thank you for your message! We'll get back to you soon."),O.reset(),E.clearErrors(),H()}catch(L){Toast.error(L.message||"Failed to send message. Please try again.")}finally{Y.disabled=!1,Y.textContent=S}})}function H(){let O=document.getElementById("contact-form"),E=document.getElementById("contact-success");O&&E&&(O.classList.add("hidden"),E.classList.remove("hidden"),E.innerHTML=`
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
            `,document.getElementById("send-another-btn")?.addEventListener("click",()=>{O.classList.remove("hidden"),E.classList.add("hidden")}))}async function Q(){let O=document.getElementById("contact-info");if(O)try{let _=(await PagesApi.getContactInfo()).data;if(!_)return;O.innerHTML=`
                <div class="space-y-6">
                    ${_.address?`
                        <div class="flex gap-4">
                            <div class="flex-shrink-0 w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                                <svg class="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
                                </svg>
                            </div>
                            <div>
                                <h3 class="font-semibold text-gray-900">Address</h3>
                                <p class="text-gray-600">${Templates.escapeHtml(_.address)}</p>
                            </div>
                        </div>
                    `:""}
                    
                    ${_.phone?`
                        <div class="flex gap-4">
                            <div class="flex-shrink-0 w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                                <svg class="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>
                                </svg>
                            </div>
                            <div>
                                <h3 class="font-semibold text-gray-900">Phone</h3>
                                <a href="tel:${_.phone}" class="text-gray-600 hover:text-primary-600">${Templates.escapeHtml(_.phone)}</a>
                            </div>
                        </div>
                    `:""}
                    
                    ${_.email?`
                        <div class="flex gap-4">
                            <div class="flex-shrink-0 w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                                <svg class="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                                </svg>
                            </div>
                            <div>
                                <h3 class="font-semibold text-gray-900">Email</h3>
                                <a href="mailto:${_.email}" class="text-gray-600 hover:text-primary-600">${Templates.escapeHtml(_.email)}</a>
                            </div>
                        </div>
                    `:""}
                    
                    ${_.business_hours?`
                        <div class="flex gap-4">
                            <div class="flex-shrink-0 w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                                <svg class="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                                </svg>
                            </div>
                            <div>
                                <h3 class="font-semibold text-gray-900">Business Hours</h3>
                                <p class="text-gray-600">${Templates.escapeHtml(_.business_hours)}</p>
                            </div>
                        </div>
                    `:""}
                    
                    ${_.social_links&&Object.keys(_.social_links).length>0?`
                        <div class="pt-4 border-t border-gray-200">
                            <h3 class="font-semibold text-gray-900 mb-3">Follow Us</h3>
                            <div class="flex gap-3">
                                ${_.social_links.facebook?`
                                    <a href="${_.social_links.facebook}" target="_blank" class="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center hover:bg-gray-200 transition-colors">
                                        <svg class="w-5 h-5 text-[#1877F2]" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                                    </a>
                                `:""}
                                ${_.social_links.instagram?`
                                    <a href="${_.social_links.instagram}" target="_blank" class="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center hover:bg-gray-200 transition-colors">
                                        <svg class="w-5 h-5 text-[#E4405F]" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
                                    </a>
                                `:""}
                                ${_.social_links.twitter?`
                                    <a href="${_.social_links.twitter}" target="_blank" class="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center hover:bg-gray-200 transition-colors">
                                        <svg class="w-5 h-5 text-[#1DA1F2]" fill="currentColor" viewBox="0 0 24 24"><path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/></svg>
                                    </a>
                                `:""}
                                ${_.social_links.youtube?`
                                    <a href="${_.social_links.youtube}" target="_blank" class="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center hover:bg-gray-200 transition-colors">
                                        <svg class="w-5 h-5 text-[#FF0000]" fill="currentColor" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
                                    </a>
                                `:""}
                            </div>
                        </div>
                    `:""}
                </div>
            `}catch(E){console.error("Failed to load contact info:",E)}}function ae(){}return{init:n,destroy:ae}})();window.ContactPage=Ds;$r=Ds});var Ys={};ne(Ys,{default:()=>Tr});var Ws,Tr,Qs=se(()=>{Ws=(function(){"use strict";let n=[],e=[];async function s(){let a=document.getElementById("faq-list");a&&a.querySelector(".faq-item")?O():await E(),B(),i()}function i(){p(),b(),w(),A(),H(),Q(),ae()}function p(){if(!document.querySelector(".faq-search-container")||!("webkitSpeechRecognition"in window||"SpeechRecognition"in window))return;let r=window.SpeechRecognition||window.webkitSpeechRecognition,l=new r;l.continuous=!1,l.lang="en-US";let d=document.createElement("button");d.id="faq-voice-search",d.type="button",d.className="absolute right-12 top-1/2 -translate-y-1/2 p-2 text-stone-400 hover:text-primary-600 dark:hover:text-amber-400 transition-colors",d.innerHTML=`
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"/></svg>
        `;let c=document.getElementById("faq-search");c&&c.parentElement&&(c.parentElement.style.position="relative",c.parentElement.appendChild(d));let f=!1;d.addEventListener("click",()=>{f?l.stop():(l.start(),d.classList.add("text-red-500","animate-pulse")),f=!f}),l.onresult=x=>{let P=x.results[0][0].transcript;c&&(c.value=P,c.dispatchEvent(new Event("input"))),d.classList.remove("text-red-500","animate-pulse"),f=!1},l.onerror=()=>{d.classList.remove("text-red-500","animate-pulse"),f=!1}}function b(){document.querySelectorAll(".faq-content, .accordion-content, .faq-answer").forEach(a=>{if(a.querySelector(".faq-rating"))return;let l=(a.closest(".faq-item")||a.closest("[data-accordion]"))?.dataset.id||Math.random().toString(36).substr(2,9),d=`
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
            `;a.insertAdjacentHTML("beforeend",d)}),document.addEventListener("click",a=>{let r=a.target.closest(".faq-rate-btn");if(!r)return;let l=r.dataset.helpful==="yes",d=r.dataset.question,c=r.closest(".faq-rating"),f=JSON.parse(localStorage.getItem("faqRatings")||"{}");f[d]=l,localStorage.setItem("faqRatings",JSON.stringify(f)),c.innerHTML=`
                <div class="flex items-center gap-2 text-sm ${l?"text-emerald-600 dark:text-emerald-400":"text-stone-500 dark:text-stone-400"}">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                    <span>Thanks for your feedback!</span>
                </div>
            `,typeof analytics<"u"&&analytics.track("faq_rated",{questionId:d,helpful:l})})}function w(){let a=document.getElementById("faq-contact-promo");a&&(a.innerHTML=`
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
        `,document.getElementById("open-chat-faq")?.addEventListener("click",()=>{document.dispatchEvent(new CustomEvent("chat:open"))}))}function A(){let a=document.getElementById("popular-questions");if(!a)return;let r=JSON.parse(localStorage.getItem("faqRatings")||"{}"),l=Object.entries(r).filter(([c,f])=>f).slice(0,5).map(([c])=>c),d=[];document.querySelectorAll(".faq-item, [data-accordion]").forEach(c=>{let f=c.dataset.id;if(l.includes(f)||d.length<3){let x=c.querySelector("button span, .accordion-toggle span")?.textContent?.trim();x&&d.push({id:f,question:x,element:c})}}),d.length!==0&&(a.innerHTML=`
            <div class="bg-primary-50 dark:bg-amber-900/20 rounded-2xl p-6">
                <h3 class="font-semibold text-stone-900 dark:text-white mb-4 flex items-center gap-2">
                    <svg class="w-5 h-5 text-primary-600 dark:text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"/></svg>
                    Most Helpful Questions
                </h3>
                <ul class="space-y-2">
                    ${d.slice(0,5).map(c=>`
                        <li>
                            <button class="popular-q-link text-left text-primary-600 dark:text-amber-400 hover:underline text-sm" data-target="${c.id}">
                                ${Templates.escapeHtml(c.question)}
                            </button>
                        </li>
                    `).join("")}
                </ul>
            </div>
        `,a.querySelectorAll(".popular-q-link").forEach(c=>{c.addEventListener("click",()=>{let f=c.dataset.target,x=document.querySelector(`[data-id="${f}"], .faq-item`);if(x){x.scrollIntoView({behavior:"smooth",block:"center"});let P=x.querySelector(".faq-trigger, .accordion-toggle");P&&P.click()}})}))}function H(){document.querySelectorAll(".faq-content, .accordion-content, .faq-answer").forEach(a=>{if(a.querySelector(".faq-share"))return;let l=(a.closest(".faq-item")||a.closest("[data-accordion]"))?.querySelector("button span, .accordion-toggle span")?.textContent?.trim();if(!l)return;let d=`
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
            `;a.insertAdjacentHTML("beforeend",d)}),document.addEventListener("click",a=>{let r=a.target.closest('.faq-share-btn[data-platform="copy"]');r&&navigator.clipboard.writeText(window.location.href).then(()=>{let l=r.innerHTML;r.innerHTML='<svg class="w-4 h-4 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>',setTimeout(()=>{r.innerHTML=l},2e3)})})}function Q(){let a=document.querySelectorAll(".faq-item, [data-accordion]"),r=-1;document.addEventListener("keydown",l=>{if(document.querySelector("#faq-container, #faq-list")){if(l.key==="ArrowDown"||l.key==="ArrowUp"){l.preventDefault(),l.key==="ArrowDown"?r=Math.min(r+1,a.length-1):r=Math.max(r-1,0);let d=a[r];if(d){d.scrollIntoView({behavior:"smooth",block:"center"});let c=d.querySelector(".faq-trigger, .accordion-toggle, button");c&&c.focus()}}if(l.key==="Enter"&&r>=0){let c=a[r]?.querySelector(".faq-trigger, .accordion-toggle");c&&c.click()}l.key==="/"&&document.activeElement?.tagName!=="INPUT"&&(l.preventDefault(),document.getElementById("faq-search")?.focus())}})}function ae(){let a=new IntersectionObserver(r=>{r.forEach(l=>{if(l.isIntersecting){let d=l.target,c=d.querySelector("button span, .accordion-toggle span")?.textContent?.trim(),f=JSON.parse(localStorage.getItem("faqViews")||"{}"),x=d.dataset.id||c?.substring(0,30);x&&(f[x]=(f[x]||0)+1,localStorage.setItem("faqViews",JSON.stringify(f)))}})},{threshold:.5});document.querySelectorAll(".faq-item, [data-accordion]").forEach(r=>{a.observe(r)}),document.addEventListener("click",r=>{let l=r.target.closest(".faq-trigger, .accordion-toggle");if(l){let d=l.closest(".faq-item, [data-accordion]"),c=l.querySelector("span")?.textContent?.trim();typeof analytics<"u"&&analytics.track("faq_opened",{question:c?.substring(0,100)})}})}function O(){let a=document.querySelectorAll(".category-tab"),r=document.querySelectorAll(".faq-category");a.forEach(d=>{d.addEventListener("click",c=>{c.preventDefault(),a.forEach(P=>{P.classList.remove("bg-primary-600","dark:bg-amber-600","text-white"),P.classList.add("bg-stone-100","dark:bg-stone-800","text-stone-700","dark:text-stone-300")}),d.classList.add("bg-primary-600","dark:bg-amber-600","text-white"),d.classList.remove("bg-stone-100","dark:bg-stone-800","text-stone-700","dark:text-stone-300");let f=d.dataset.category;f==="all"?r.forEach(P=>P.classList.remove("hidden")):r.forEach(P=>{P.classList.toggle("hidden",P.dataset.category!==f)});let x=document.getElementById("faq-search");x&&(x.value=""),document.querySelectorAll(".faq-item").forEach(P=>P.classList.remove("hidden"))})}),document.querySelectorAll(".accordion-toggle").forEach(d=>{d.addEventListener("click",()=>{let c=d.closest("[data-accordion]"),f=c.querySelector(".accordion-content"),x=c.querySelector(".accordion-icon"),P=!f.classList.contains("hidden");document.querySelectorAll("[data-accordion]").forEach(G=>{G!==c&&(G.querySelector(".accordion-content")?.classList.add("hidden"),G.querySelector(".accordion-icon")?.classList.remove("rotate-180"))}),P?(f.classList.add("hidden"),x.classList.remove("rotate-180")):(f.classList.remove("hidden"),x.classList.add("rotate-180"))})})}async function E(){let a=document.getElementById("faq-container");if(a){Loader.show(a,"skeleton");try{let l=(await PagesApi.getFAQs()).data||[];if(e=l,l.length===0){a.innerHTML=`
                    <div class="text-center py-12">
                        <svg class="w-16 h-16 text-stone-300 dark:text-stone-600 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                        </svg>
                        <p class="text-stone-500 dark:text-stone-400">No FAQs available at the moment.</p>
                    </div>
                `;return}n=_(l),Y(n)}catch(r){console.error("Failed to load FAQs:",r),a.innerHTML=`
                <div class="text-center py-12">
                    <svg class="w-16 h-16 text-red-300 dark:text-red-600 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                    </svg>
                    <p class="text-red-500 dark:text-red-400">Failed to load FAQs. Please try again later.</p>
                </div>
            `}}}function _(a){let r={};return a.forEach(l=>{let d=l.category||"General";r[d]||(r[d]=[]),r[d].push(l)}),r}function Y(a,r=""){let l=document.getElementById("faq-container");if(!l)return;let d=Object.keys(a);if(d.length===0){l.innerHTML=`
                <div class="text-center py-12">
                    <svg class="w-16 h-16 text-stone-300 dark:text-stone-600 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                    </svg>
                    <p class="text-stone-500 dark:text-stone-400">No FAQs found${r?` for "${Templates.escapeHtml(r)}"`:""}.</p>
                </div>
            `;return}l.innerHTML=`
            <!-- Category Tabs -->
            <div class="mb-8 overflow-x-auto scrollbar-hide">
                <div class="flex gap-2 pb-2">
                    <button class="faq-category-btn px-4 py-2 bg-primary-600 dark:bg-amber-600 text-white rounded-full text-sm font-medium whitespace-nowrap transition-colors" data-category="all">
                        All
                    </button>
                    ${d.map(c=>`
                        <button class="faq-category-btn px-4 py-2 bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 text-stone-600 dark:text-stone-300 rounded-full text-sm font-medium whitespace-nowrap transition-colors" data-category="${Templates.escapeHtml(c)}">
                            ${Templates.escapeHtml(c)}
                        </button>
                    `).join("")}
                </div>
            </div>

            <!-- FAQ Accordion -->
            <div id="faq-list" class="space-y-6">
                ${d.map(c=>`
                    <div class="faq-category" data-category="${Templates.escapeHtml(c)}">
                        <h2 class="text-lg font-semibold text-stone-900 dark:text-white mb-4">${Templates.escapeHtml(c)}</h2>
                        <div class="space-y-3">
                            ${a[c].map(f=>S(f,r)).join("")}
                        </div>
                    </div>
                `).join("")}
            </div>
        `,L(),k(),b(),H()}function S(a,r=""){let l=Templates.escapeHtml(a.question),d=a.answer;if(r){let c=new RegExp(`(${r.replace(/[.*+?^${}()|[\]\\]/g,"\\$&")})`,"gi");l=l.replace(c,'<mark class="bg-yellow-200 dark:bg-yellow-800">$1</mark>'),d=d.replace(c,'<mark class="bg-yellow-200 dark:bg-yellow-800">$1</mark>')}return`
            <div class="faq-item border border-stone-200 dark:border-stone-700 rounded-xl overflow-hidden bg-white dark:bg-stone-800" data-id="${a.id||""}">
                <button class="faq-trigger w-full px-6 py-4 text-left flex items-center justify-between hover:bg-stone-50 dark:hover:bg-stone-700/50 transition-colors">
                    <span class="font-medium text-stone-900 dark:text-white pr-4">${l}</span>
                    <svg class="faq-icon w-5 h-5 text-stone-500 dark:text-stone-400 flex-shrink-0 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
                    </svg>
                </button>
                <div class="faq-content hidden px-6 pb-4">
                    <div class="prose prose-sm dark:prose-invert max-w-none text-stone-600 dark:text-stone-300">
                        ${d}
                    </div>
                </div>
            </div>
        `}function L(){let a=document.querySelectorAll(".faq-category-btn"),r=document.querySelectorAll(".faq-category");a.forEach(l=>{l.addEventListener("click",()=>{a.forEach(c=>{c.classList.remove("bg-primary-600","dark:bg-amber-600","text-white"),c.classList.add("bg-stone-100","dark:bg-stone-800","text-stone-600","dark:text-stone-300")}),l.classList.add("bg-primary-600","dark:bg-amber-600","text-white"),l.classList.remove("bg-stone-100","dark:bg-stone-800","text-stone-600","dark:text-stone-300");let d=l.dataset.category;r.forEach(c=>{d==="all"||c.dataset.category===d?c.classList.remove("hidden"):c.classList.add("hidden")})})})}function k(){document.querySelectorAll(".faq-trigger").forEach(r=>{r.addEventListener("click",()=>{let l=r.closest(".faq-item"),d=l.querySelector(".faq-content"),c=l.querySelector(".faq-icon"),f=!d.classList.contains("hidden");document.querySelectorAll(".faq-item").forEach(x=>{x!==l&&(x.querySelector(".faq-content")?.classList.add("hidden"),x.querySelector(".faq-icon")?.classList.remove("rotate-180"))}),d.classList.toggle("hidden"),c.classList.toggle("rotate-180")})})}function B(){let a=document.getElementById("faq-search");if(!a)return;let r=null;a.addEventListener("input",d=>{let c=d.target.value.trim().toLowerCase();clearTimeout(r),r=setTimeout(()=>{if(document.querySelector(".accordion-toggle"))I(c);else if(n&&Object.keys(n).length>0){if(c.length<2){Y(n);return}let x={};Object.entries(n).forEach(([P,G])=>{let te=G.filter(me=>me.question.toLowerCase().includes(c)||me.answer.toLowerCase().includes(c));te.length>0&&(x[P]=te)}),Y(x,c)}},300)});let l=document.createElement("span");l.className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-stone-400 dark:text-stone-500 hidden md:block",l.textContent="Press / to search",a.parentElement&&(a.parentElement.style.position="relative",a.parentElement.appendChild(l),a.addEventListener("focus",()=>l.classList.add("hidden")),a.addEventListener("blur",()=>l.classList.remove("hidden")))}function I(a){let r=document.querySelectorAll(".faq-item"),l=document.querySelectorAll(".faq-category"),d=document.getElementById("no-results"),c=0;r.forEach(f=>{let x=f.querySelector(".accordion-toggle span, button span"),P=f.querySelector(".accordion-content"),G=x?x.textContent.toLowerCase():"",te=P?P.textContent.toLowerCase():"";!a||G.includes(a)||te.includes(a)?(f.classList.remove("hidden"),c++):f.classList.add("hidden")}),l.forEach(f=>{let x=f.querySelectorAll(".faq-item:not(.hidden)");f.classList.toggle("hidden",x.length===0)}),d&&d.classList.toggle("hidden",c>0)}function h(){n=[],e=[]}return{init:s,destroy:h}})();window.FAQPage=Ws;Tr=Ws});var Gs={};ne(Gs,{CategoryCard:()=>Ir});function Ir(n){let e=document.createElement("a");e.href=`/categories/${n.slug}/`,e.className="group block";let s=document.createElement("div");s.className="relative aspect-square rounded-xl overflow-hidden bg-gray-100";let i="";if(typeof n.image_url=="string"&&n.image_url?i=n.image_url:typeof n.image=="string"&&n.image?i=n.image:n.image&&typeof n.image=="object"?i=n.image.url||n.image.src||n.image_url||"":typeof n.banner_image=="string"&&n.banner_image?i=n.banner_image:n.banner_image&&typeof n.banner_image=="object"?i=n.banner_image.url||n.banner_image.src||"":typeof n.hero_image=="string"&&n.hero_image?i=n.hero_image:n.hero_image&&typeof n.hero_image=="object"?i=n.hero_image.url||n.hero_image.src||"":typeof n.thumbnail=="string"&&n.thumbnail?i=n.thumbnail:n.thumbnail&&typeof n.thumbnail=="object"&&(i=n.thumbnail.url||n.thumbnail.src||""),i){let w=document.createElement("img");w.src=i,w.alt=n.name||"",w.className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300",w.loading="lazy",w.decoding="async",w.onerror=A=>{try{w.remove();let H=document.createElement("div");H.className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary-100 to-primary-200",H.innerHTML='<svg class="w-12 h-12 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"/></svg>',s.appendChild(H)}catch{}},s.appendChild(w)}else{let w=document.createElement("div");w.className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary-100 to-primary-200",w.innerHTML='<svg class="w-12 h-12 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"/></svg>',s.appendChild(w)}let p=document.createElement("div");p.className="absolute inset-0 bg-gradient-to-t from-black/30 dark:from-black/60 to-transparent",s.appendChild(p),e.appendChild(s);let b=document.createElement("h3");if(b.className="mt-3 text-sm font-medium text-stone-900 group-hover:text-primary-600 transition-colors text-center dark:text-white",b.textContent=n.name,e.appendChild(b),n.product_count){let w=document.createElement("p");w.className="text-xs text-stone-600 dark:text-white/60 text-center",w.textContent=`${n.product_count} products`,e.appendChild(w)}return e}var Js=se(()=>{});var Ks={};ne(Ks,{default:()=>Ar});var Xs,Ar,Zs=se(()=>{Xs=(function(){"use strict";let n=null,e=0,s=null,i=null;async function p(){window.scrollTo(0,0),await Promise.all([_(),S(),k()]),h(),Q(),ae(),Promise.all([L(),E(),O()]).catch(r=>console.error("Failed to load secondary sections:",r)),setTimeout(()=>{b(),w(),A(),H()},2e3);try{B(),I()}catch(r){console.warn("Failed to load promotions/CTA:",r)}}function b(){let r=document.getElementById("live-visitors");if(!r)return;async function l(){try{let d=await window.ApiClient.get("/analytics/active-visitors/",{}),c=d.data||d;if(e=c.active_visitors||c.count||0,e===0){r.innerHTML="";return}r.innerHTML=`
                    <div class="flex items-center gap-2 px-3 py-1.5 bg-emerald-100 dark:bg-emerald-900/30 rounded-full">
                        <span class="relative flex h-2 w-2">
                            <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                            <span class="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                        </span>
                        <span class="text-xs font-medium text-emerald-700 dark:text-emerald-300">${e} browsing now</span>
                    </div>
                `}catch(d){console.warn("Failed to fetch active visitors:",d),r.innerHTML=""}}l(),setInterval(l,8e3)}function w(){let r=[],l=0,d=0,c=10;async function f(){try{let P=await window.ApiClient.get("/analytics/recent-purchases/",{});if(r=P.data||P.purchases||[],r.length===0)return;setTimeout(()=>{x(),s=setInterval(()=>{d<c?x():clearInterval(s)},3e4)},1e4)}catch(P){console.warn("Failed to fetch recent purchases:",P)}}function x(){if(r.length===0||d>=c)return;let P=r[l];if(!P)return;let G=document.createElement("div");G.className="social-proof-popup fixed bottom-4 left-4 z-50 max-w-xs bg-white dark:bg-stone-800 rounded-xl shadow-2xl border border-stone-200 dark:border-stone-700 p-4 transform translate-y-full opacity-0 transition-all duration-500";let te=`
                <div class="flex items-start gap-3">
                    <div class="w-10 h-10 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center flex-shrink-0">
                        <svg class="w-5 h-5 text-emerald-600 dark:text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>
                    </div>
                    <div>
                        <p class="text-sm font-medium text-stone-900 dark:text-white">${P.message}</p>
                        <p class="text-xs text-stone-400 dark:text-stone-500 mt-1">${P.time_ago}</p>
                    </div>
                </div>
            `;G.innerHTML=`
                ${te}
                <button class="absolute top-2 right-2 text-stone-400 hover:text-stone-600 dark:hover:text-stone-300" onclick="this.parentElement.remove()">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
                </button>
            `,document.body.appendChild(G),d++,requestAnimationFrame(()=>{G.classList.remove("translate-y-full","opacity-0")}),setTimeout(()=>{G.classList.add("translate-y-full","opacity-0"),setTimeout(()=>G.remove(),500)},5e3),l=(l+1)%r.length,d>=c&&s&&clearInterval(s)}f()}function A(){let r=document.getElementById("recently-viewed-section"),l=document.getElementById("recently-viewed"),d=document.getElementById("clear-recently-viewed");if(!r||!l)return;let c=JSON.parse(localStorage.getItem("recentlyViewed")||"[]");if(c.length===0){r.classList.add("hidden");return}r.classList.remove("hidden"),l.innerHTML=c.slice(0,5).map(f=>{let x=null;return f.discount_percent&&f.discount_percent>0&&(x=`-${f.discount_percent}%`),ProductCard.render(f,{showBadge:!!x,badge:x,priceSize:"small"})}).join(""),ProductCard.bindEvents(l),d?.addEventListener("click",()=>{localStorage.removeItem("recentlyViewed"),r.classList.add("hidden"),Toast.success("Recently viewed items cleared")})}function H(){let r=document.getElementById("flash-sale-section"),l=document.getElementById("flash-sale-countdown");if(!r||!l)return;if(!localStorage.getItem("flashSaleEnd")){let x=new Date().getTime()+144e5;localStorage.setItem("flashSaleEnd",x.toString())}let c=parseInt(localStorage.getItem("flashSaleEnd"));function f(){let x=new Date().getTime(),P=c-x;if(P<=0){r.classList.add("hidden"),clearInterval(i),localStorage.removeItem("flashSaleEnd");return}r.classList.remove("hidden");let G=Math.floor(P%(1e3*60*60*24)/(1e3*60*60)),te=Math.floor(P%(1e3*60*60)/(1e3*60)),me=Math.floor(P%(1e3*60)/1e3);l.innerHTML=`
                <div class="flex items-center gap-2 text-white">
                    <span class="text-sm font-medium">Ends in:</span>
                    <div class="flex items-center gap-1">
                        <span class="bg-white/20 px-2 py-1 rounded font-mono font-bold">${G.toString().padStart(2,"0")}</span>
                        <span class="font-bold">:</span>
                        <span class="bg-white/20 px-2 py-1 rounded font-mono font-bold">${te.toString().padStart(2,"0")}</span>
                        <span class="font-bold">:</span>
                        <span class="bg-white/20 px-2 py-1 rounded font-mono font-bold">${me.toString().padStart(2,"0")}</span>
                    </div>
                </div>
            `}f(),i=setInterval(f,1e3)}function Q(){let r=document.querySelectorAll("[data-animate]");if(!r.length)return;let l=new IntersectionObserver(d=>{d.forEach(c=>{if(c.isIntersecting){let f=c.target.dataset.animate||"fadeInUp";c.target.classList.add("animate-"+f),c.target.classList.remove("opacity-0"),l.unobserve(c.target)}})},{threshold:.1,rootMargin:"0px 0px -50px 0px"});r.forEach(d=>{d.classList.add("opacity-0"),l.observe(d)})}function ae(){document.addEventListener("click",async r=>{let l=r.target.closest("[data-quick-view]");if(!l)return;let d=l.dataset.quickView;if(!d)return;r.preventDefault();let c=document.createElement("div");c.id="quick-view-modal",c.className="fixed inset-0 z-50 flex items-center justify-center p-4",c.innerHTML=`
                <div class="absolute inset-0 bg-black/50 backdrop-blur-sm" onclick="document.getElementById('quick-view-modal').remove()"></div>
                <div class="relative bg-white dark:bg-stone-800 rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-auto">
                    <button class="absolute top-4 right-4 z-10 w-10 h-10 bg-stone-100 dark:bg-stone-700 rounded-full flex items-center justify-center hover:bg-stone-200 dark:hover:bg-stone-600 transition-colors" onclick="document.getElementById('quick-view-modal').remove()">
                        <svg class="w-5 h-5 text-stone-600 dark:text-stone-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
                    </button>
                    <div class="p-8 flex items-center justify-center min-h-[400px]">
                        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
                    </div>
                </div>
            `,document.body.appendChild(c);try{let f=await ProductsApi.getProduct(d),x=f.data||f,P=c.querySelector(".relative");P.innerHTML=`
                    <button class="absolute top-4 right-4 z-10 w-10 h-10 bg-stone-100 dark:bg-stone-700 rounded-full flex items-center justify-center hover:bg-stone-200 dark:hover:bg-stone-600 transition-colors" onclick="document.getElementById('quick-view-modal').remove()">
                        <svg class="w-5 h-5 text-stone-600 dark:text-stone-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
                    </button>
                    <div class="grid md:grid-cols-2 gap-8 p-8">
                        <div class="aspect-square rounded-xl overflow-hidden bg-stone-100 dark:bg-stone-700">
                            <img src="${x.primary_image||x.image||"/static/images/placeholder.jpg"}" alt="${Templates.escapeHtml(x.name)}" class="w-full h-full object-cover">
                        </div>
                        <div class="flex flex-col">
                            <h2 class="text-2xl font-bold text-stone-900 dark:text-white mb-2">${Templates.escapeHtml(x.name)}</h2>
                            <div class="flex items-center gap-2 mb-4">
                                <div class="flex text-amber-400">
                                    ${'<svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.967a1 1 0 00.95.69h4.178c.969 0 1.371 1.24.588 1.81l-3.385 2.46a1 1 0 00-.364 1.118l1.287 3.966c.3.922-.755 1.688-1.54 1.118l-3.385-2.46a1 1 0 00-1.175 0l-3.385 2.46c-.784.57-1.838-.196-1.54-1.118l1.287-3.966a1 1 0 00-.364-1.118l-3.385-2.46c-.783-.57-.38-1.81.588-1.81h4.178a1 1 0 00.95-.69l1.286-3.967z"/></svg>'.repeat(Math.round(x.rating||4))}
                                </div>
                                <span class="text-sm text-stone-500 dark:text-stone-400">(${x.review_count||0} reviews)</span>
                            </div>
                            <div class="mb-6">
                                ${x.sale_price||x.discounted_price?`
                                    <span class="text-3xl font-bold text-primary-600 dark:text-amber-400">${Templates.formatPrice(x.sale_price||x.discounted_price)}</span>
                                    <span class="text-lg text-stone-400 line-through ml-2">${Templates.formatPrice(x.price)}</span>
                                `:`
                                    <span class="text-3xl font-bold text-stone-900 dark:text-white">${Templates.formatPrice(x.price)}</span>
                                `}
                            </div>
                            <p class="text-stone-600 dark:text-stone-400 mb-6 line-clamp-3">${Templates.escapeHtml(x.short_description||x.description||"")}</p>
                            <div class="mt-auto space-y-3">
                                <button class="w-full py-3 px-6 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-xl transition-colors" onclick="CartApi.addItem(${x.id}, 1).then(() => { Toast.success('Added to cart'); document.getElementById('quick-view-modal').remove(); })">
                                    Add to Cart
                                </button>
                                <a href="/products/${x.slug||x.id}/" class="block w-full py-3 px-6 border-2 border-stone-200 dark:border-stone-600 text-stone-700 dark:text-stone-300 font-semibold rounded-xl text-center hover:bg-stone-50 dark:hover:bg-stone-700 transition-colors">
                                    View Full Details
                                </a>
                            </div>
                        </div>
                    </div>
                `}catch(f){console.error("Failed to load product:",f),c.remove(),Toast.error("Failed to load product details")}})}async function O(){let r=document.getElementById("testimonials-grid");if(r){Loader.show(r,"skeleton");try{let l=await ProductsApi.getReviews(null,{pageSize:6,orderBy:"-rating"}),d=l?.data?.results||l?.data||l?.results||[];if(r.innerHTML="",!d.length){r.innerHTML='<p class="text-gray-500 text-center py-8">No user reviews available.</p>';return}d=d.slice(0,6),d.forEach(c=>{let f=document.createElement("div");f.className="rounded-2xl bg-white dark:bg-stone-800 shadow p-6 flex flex-col gap-3",f.innerHTML=`
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
                    `,r.appendChild(f)})}catch(l){console.error("Failed to load testimonials:",l),r.innerHTML='<p class="text-red-500 text-center py-8">Failed to load reviews. Please try again later.</p>'}}}async function E(){let r=document.getElementById("best-sellers");if(!r)return;let l=r.querySelector(".products-grid")||r;Loader.show(l,"skeleton");try{let d=await ProductsApi.getProducts({bestseller:!0,pageSize:5}),c=d.data?.results||d.data||d.results||[];if(c.length===0){l.innerHTML='<p class="text-gray-500 text-center py-8">No best sellers available.</p>';return}l.innerHTML=c.map(f=>{let x=null;return f.discount_percent&&f.discount_percent>0&&(x=`-${f.discount_percent}%`),ProductCard.render(f,{showBadge:!!x,badge:x,priceSize:"small"})}).join(""),ProductCard.bindEvents(l)}catch(d){console.error("Failed to load best sellers:",d),l.innerHTML='<p class="text-red-500 text-center py-8">Failed to load products. Please try again later.</p>'}}async function _(){let r=document.getElementById("hero-slider");if(r)try{let l=await PagesApi.getBanners("home_hero"),d=l.data?.results||l.data||l.results||[];if(d.length===0){r.innerHTML="";return}r.innerHTML=`
                <div class="relative overflow-hidden w-full h-[55vh] sm:h-[70vh] md:h-[80vh]">
                    <div class="hero-slides relative w-full h-full">
                        ${d.map((c,f)=>`
                            <div class="hero-slide ${f===0?"":"hidden"} w-full h-full" data-index="${f}">
                                <a href="${c.link_url||"#"}" class="block relative w-full h-full">
                                    <img 
                                        src="${c.image}" 
                                        alt="${Templates.escapeHtml(c.title||"")}"
                                        class="absolute inset-0 w-full h-full object-cover"
                                        loading="${f===0?"eager":"lazy"}"
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
                    ${d.length>1?`
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
                            ${d.map((c,f)=>`
                                <button class="w-3 h-3 rounded-full transition-colors ${f===0?"bg-white dark:bg-stone-200":"bg-white/50 dark:bg-stone-600/60 hover:bg-white/75 dark:hover:bg-stone-500/80"}" data-slide="${f}" aria-label="Go to slide ${f+1}"></button>
                            `).join("")}
                        </div>
                    `:""}
                </div>
            `,d.length>1&&Y(d.length)}catch(l){console.warn("Hero banners unavailable:",l?.status||l)}}function Y(r){let l=0,d=document.querySelectorAll(".hero-slide"),c=document.querySelectorAll(".hero-dots button"),f=document.querySelector(".hero-prev"),x=document.querySelector(".hero-next");function P(te){d[l].classList.add("hidden"),c[l]?.classList.remove("bg-stone-100"),c[l]?.classList.add("bg-white/50"),l=(te+r)%r,d[l].classList.remove("hidden"),c[l]?.classList.add("bg-stone-100"),c[l]?.classList.remove("bg-white/50")}f?.addEventListener("click",()=>{P(l-1),G()}),x?.addEventListener("click",()=>{P(l+1),G()}),c.forEach((te,me)=>{te.addEventListener("click",()=>{P(me),G()})});function G(){n&&clearInterval(n),n=setInterval(()=>P(l+1),5e3)}try{let te=document.querySelector(".hero-slides"),me=0;te?.addEventListener("touchstart",ye=>{me=ye.touches[0].clientX},{passive:!0}),te?.addEventListener("touchend",ye=>{let be=ye.changedTouches[0].clientX-me;Math.abs(be)>50&&(be<0?P(l+1):P(l-1),G())})}catch{}G()}async function S(){let r=document.getElementById("featured-products");if(!r)return;let l=r.querySelector(".products-grid")||r;Loader.show(l,"skeleton");try{let d=await ProductsApi.getFeatured(8),c=d.data?.results||d.data||d.results||[];if(c.length===0){l.innerHTML='<p class="text-gray-500 text-center py-8">No featured products available.</p>';return}l.innerHTML=c.map(f=>{let x=null;return f.discount_percent&&f.discount_percent>0&&(x=`-${f.discount_percent}%`),ProductCard.render(f,{showBadge:!!x,badge:x,priceSize:"small"})}).join(""),ProductCard.bindEvents(l)}catch(d){console.error("Failed to load featured products:",d),l.innerHTML='<p class="text-red-500 text-center py-8">Failed to load products. Please try again later.</p>'}}async function L(){let r=document.getElementById("categories-showcase");if(r){Loader.show(r,"skeleton");try{try{window.ApiClient?.clearCache("/api/v1/catalog/categories/")}catch{}let l=await window.ApiClient.get("/catalog/categories/",{page_size:6,is_featured:!0},{useCache:!1}),d=l.data?.results||l.data||l.results||[];if(d.length===0){r.innerHTML="";return}let c;try{c=(await Promise.resolve().then(()=>(Js(),Gs))).CategoryCard}catch(f){console.error("Failed to import CategoryCard:",f);return}r.innerHTML="",d.forEach(f=>{let x=c(f);try{let P=x.querySelector("img");console.info("[Home] card image for",f.name,P?P.src:"NO_IMAGE")}catch{}r.appendChild(x)}),r.classList.add("grid","grid-cols-2","sm:grid-cols-2","md:grid-cols-3","lg:grid-cols-6","gap-4","lg:gap-6")}catch(l){console.error("Failed to load categories:",l),r.innerHTML=""}}}async function k(){let r=document.getElementById("new-arrivals");if(!r)return;let l=r.querySelector(".products-grid")||r;Loader.show(l,"skeleton");try{let d=await ProductsApi.getNewArrivals(4),c=d.data?.results||d.data||d.results||[];if(c.length===0){l.innerHTML='<p class="text-gray-500 text-center py-8">No new products available.</p>';return}l.innerHTML=c.map(f=>{let x=null;return f.discount_percent&&f.discount_percent>0&&(x=`-${f.discount_percent}%`),ProductCard.render(f,{showBadge:!!x,badge:x,priceSize:"small"})}).join(""),ProductCard.bindEvents(l)}catch(d){console.error("Failed to load new arrivals:",d),l.innerHTML='<p class="text-red-500 text-center py-8">Failed to load products.</p>'}}async function B(){let r=document.getElementById("promotions-banner")||document.getElementById("promotion-banners");if(r)try{let l=await PagesApi.getPromotions(),d=l?.data?.results??l?.results??l?.data??[];if(Array.isArray(d)||(d&&typeof d=="object"?d=Array.isArray(d.items)?d.items:[d]:d=[]),d.length===0){r.innerHTML="";return}let c=d[0]||{};r.innerHTML=`
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
            `}catch(l){console.warn("Promotions unavailable:",l?.status||l),r.innerHTML=""}}async function I(){let r=document.getElementById("custom-order-cta");if(!r||r.dataset?.loaded)return;r.dataset.loaded="1",r.innerHTML=`
            <div class="container mx-auto px-4">
                <div class="max-w-full w-full mx-auto rounded-3xl p-6 md:p-10">
                    <div class="animate-pulse">
                        <div class="h-6 w-1/3 bg-gray-200 dark:bg-stone-700 rounded mb-4"></div>
                        <div class="h-10 w-full bg-gray-200 dark:bg-stone-700 rounded mb-4"></div>
                        <div class="h-44 bg-gray-200 dark:bg-stone-800 rounded"></div>
                    </div>
                </div>
            </div>
        `;let l=window.BUNORAA_ROUTES||{},d=l.preordersWizard||"/preorders/create/",c=l.preordersLanding||"/preorders/";try{let f=[];if(typeof PreordersApi<"u"&&PreordersApi.getCategories)try{let x=await PreordersApi.getCategories({featured:!0,pageSize:4});f=x?.data?.results||x?.data||x?.results||[]}catch(x){console.warn("Pre-order categories unavailable:",x)}r.innerHTML=`
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
                            ${f.length>0?`
                                <div class="mb-8">
                                    <p class="text-stone-600 dark:text-white/60 text-sm mb-3">Popular categories:</p>
                                    <div class="flex flex-wrap gap-2">
                                        ${f.slice(0,4).map(x=>`
                                            <a href="${c}category/${x.slug}/" class="inline-flex items-center gap-2 px-4 py-2 bg-white/10 dark:bg-stone-800/30 hover:bg-white/20 dark:hover:bg-stone-700 rounded-full text-sm text-stone-900 dark:text-white transition-colors">
                                                ${x.icon?`<span>${x.icon}</span>`:""}
                                                ${Templates.escapeHtml(x.name)}
                                            </a>
                                        `).join("")}
                                    </div>
                                </div>
                            `:""}
                            <div class="flex flex-wrap gap-4">
                                <a href="${d}" class="cta-unlock inline-flex items-center gap-2 px-8 py-4 bg-amber-600 text-white font-bold rounded-xl shadow-lg hover:shadow-xl hover:text-black dark:hover:text-black transition-colors group dark:bg-amber-600 dark:text-white">
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
            `}catch(f){console.warn("Custom order CTA failed to load:",f),r.innerHTML=`
                <div class="container mx-auto px-4 text-center text-stone-900 dark:text-white">
                    <h2 class="text-3xl lg:text-4xl font-display font-bold mb-4 text-stone-900 dark:text-white">Create Your Perfect Custom Order</h2>
                    <p class="text-stone-700 dark:text-white/80 mb-8 max-w-2xl mx-auto">Have a unique vision? Our skilled artisans will bring your ideas to life.</p>
                    <a href="${d}" class="cta-unlock inline-flex items-center gap-2 px-8 py-4 bg-amber-600 text-white font-bold rounded-xl shadow-lg hover:shadow-xl hover:text-black dark:hover:text-black transition-colors group dark:bg-amber-600 dark:text-white">
                        Start Your Custom Order
                    </a>
                </div>
            `}}function h(){let r=document.getElementById("newsletter-form")||document.getElementById("newsletter-form-home");r&&r.addEventListener("submit",async l=>{l.preventDefault();let d=r.querySelector('input[type="email"]'),c=r.querySelector('button[type="submit"]'),f=d?.value?.trim();if(!f){Toast.error("Please enter your email address.");return}let x=c.textContent;c.disabled=!0,c.innerHTML='<svg class="animate-spin h-5 w-5 mx-auto" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>';try{await SupportApi.submitContactForm({email:f,type:"newsletter"}),Toast.success("Thank you for subscribing!"),d.value=""}catch(P){Toast.error(P.message||"Failed to subscribe. Please try again.")}finally{c.disabled=!1,c.textContent=x}})}function a(){n&&(clearInterval(n),n=null),s&&(clearInterval(s),s=null),i&&(clearInterval(i),i=null),document.getElementById("quick-view-modal")?.remove(),document.querySelectorAll(".social-proof-popup").forEach(r=>r.remove())}return{init:p,destroy:a,initRecentlyViewed:A,initFlashSaleCountdown:H}})();window.HomePage=Xs;Ar=Xs});var tr={};ne(tr,{default:()=>Br});var er,Br,sr=se(()=>{er=(function(){"use strict";let n=1,e="all";async function s(){if(!AuthGuard.protectPage())return;let E=i();E?await A(E):(await p(),ae())}function i(){let _=window.location.pathname.match(/\/orders\/([^\/]+)/);return _?_[1]:null}async function p(){let E=document.getElementById("orders-list");if(E){Loader.show(E,"skeleton");try{let _={page:n,limit:10};e!=="all"&&(_.status=e);let Y=await OrdersApi.getAll(_),S=Y.data||[],L=Y.meta||{};b(S,L)}catch(_){console.error("Failed to load orders:",_),E.innerHTML='<p class="text-red-500 text-center py-8">Failed to load orders.</p>'}}}function b(E,_){let Y=document.getElementById("orders-list");if(!Y)return;if(E.length===0){Y.innerHTML=`
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
            `;return}Y.innerHTML=`
            <div class="space-y-4">
                ${E.map(L=>w(L)).join("")}
            </div>
            ${_.total_pages>1?`
                <div id="orders-pagination" class="mt-8">${Pagination.render({currentPage:_.current_page||n,totalPages:_.total_pages,totalItems:_.total})}</div>
            `:""}
        `,document.getElementById("orders-pagination")?.addEventListener("click",L=>{let k=L.target.closest("[data-page]");k&&(n=parseInt(k.dataset.page),p(),window.scrollTo({top:0,behavior:"smooth"}))})}function w(E){let Y={pending:"bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",processing:"bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",shipped:"bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400",delivered:"bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",cancelled:"bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",refunded:"bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400"}[E.status]||"bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400",S=E.items||[],L=S.slice(0,3),k=S.length-3,B=["pending","processing","shipped","delivered"],I=B.indexOf(E.status),h=E.status==="cancelled"||E.status==="refunded";return`
            <div class="bg-white dark:bg-stone-800 rounded-xl shadow-sm border border-gray-100 dark:border-stone-700 overflow-hidden">
                <div class="px-6 py-4 border-b border-gray-100 dark:border-stone-700 flex flex-wrap items-center justify-between gap-4">
                    <div>
                        <p class="text-sm text-gray-500 dark:text-stone-400">Order #${Templates.escapeHtml(E.order_number||E.id)}</p>
                        <p class="text-sm text-gray-500 dark:text-stone-400">Placed on ${Templates.formatDate(E.created_at)}</p>
                    </div>
                    <div class="flex items-center gap-4">
                        <span class="px-3 py-1 rounded-full text-sm font-medium ${Y}">
                            ${Templates.escapeHtml(E.status_display||E.status)}
                        </span>
                        <a href="/orders/${E.id}/" class="text-primary-600 dark:text-amber-400 hover:text-primary-700 dark:hover:text-amber-300 font-medium text-sm">
                            View Details
                        </a>
                    </div>
                </div>
                
                <!-- Visual Progress Bar -->
                ${h?"":`
                    <div class="px-6 py-3 bg-stone-50 dark:bg-stone-900/50 border-b border-gray-100 dark:border-stone-700">
                        <div class="flex items-center justify-between relative">
                            <div class="absolute left-0 right-0 top-1/2 h-1 bg-stone-200 dark:bg-stone-700 -translate-y-1/2 rounded-full"></div>
                            <div class="absolute left-0 top-1/2 h-1 bg-primary-500 dark:bg-amber-500 -translate-y-1/2 rounded-full transition-all duration-500" style="width: ${Math.max(0,I/(B.length-1)*100)}%"></div>
                            ${B.map((a,r)=>`
                                <div class="relative z-10 flex flex-col items-center">
                                    <div class="w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium ${r<=I?"bg-primary-500 dark:bg-amber-500 text-white":"bg-stone-200 dark:bg-stone-700 text-stone-500 dark:text-stone-400"}">
                                        ${r<I?'<svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/></svg>':r+1}
                                    </div>
                                    <span class="text-xs text-stone-500 dark:text-stone-400 mt-1 capitalize hidden sm:block">${a}</span>
                                </div>
                            `).join("")}
                        </div>
                    </div>
                `}
                
                <div class="p-6">
                    <div class="flex flex-wrap gap-4">
                        ${L.map(a=>`
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
                        ${k>0?`
                            <div class="flex items-center justify-center w-16 h-16 bg-gray-100 dark:bg-stone-700 rounded-lg">
                                <span class="text-sm text-gray-500 dark:text-stone-400">+${k}</span>
                            </div>
                        `:""}
                    </div>
                    <div class="mt-4 pt-4 border-t border-gray-100 flex justify-between items-center">
                        <p class="text-sm text-gray-600">
                            ${S.length} ${S.length===1?"item":"items"}
                        </p>
                        <p class="font-semibold text-gray-900">Total: ${Templates.formatPrice(E.total)}</p>
                    </div>
                </div>
            </div>
        `}async function A(E){let _=document.getElementById("order-detail");if(_){Loader.show(_,"skeleton");try{let S=(await OrdersApi.getById(E)).data;if(!S){window.location.href="/orders/";return}H(S)}catch(Y){console.error("Failed to load order:",Y),_.innerHTML='<p class="text-red-500 text-center py-8">Failed to load order details.</p>'}}}function H(E){let _=document.getElementById("order-detail");if(!_)return;let S={pending:"bg-yellow-100 text-yellow-700",processing:"bg-blue-100 text-blue-700",shipped:"bg-indigo-100 text-indigo-700",delivered:"bg-green-100 text-green-700",cancelled:"bg-red-100 text-red-700",refunded:"bg-gray-100 text-gray-700"}[E.status]||"bg-gray-100 text-gray-700",L=E.items||[];_.innerHTML=`
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
                            <h1 class="text-xl font-bold text-gray-900">Order #${Templates.escapeHtml(E.order_number||E.id)}</h1>
                            <p class="text-sm text-gray-500">Placed on ${Templates.formatDate(E.created_at)}</p>
                        </div>
                        <span class="px-4 py-1.5 rounded-full text-sm font-medium ${S}">
                            ${Templates.escapeHtml(E.status_display||E.status)}
                        </span>
                    </div>
                </div>

                <!-- Order Timeline -->
                ${E.timeline&&E.timeline.length>0?`
                    <div class="px-6 py-4 border-b border-gray-100">
                        <h2 class="text-sm font-semibold text-gray-900 mb-4">Order Timeline</h2>
                        <div class="relative">
                            <div class="absolute left-2 top-2 bottom-2 w-0.5 bg-gray-200"></div>
                            <div class="space-y-4">
                                ${E.timeline.map((k,B)=>`
                                    <div class="relative pl-8">
                                        <div class="absolute left-0 w-4 h-4 rounded-full ${B===0?"bg-primary-600":"bg-gray-300"}"></div>
                                        <p class="text-sm font-medium text-gray-900">${Templates.escapeHtml(k.status)}</p>
                                        <p class="text-xs text-gray-500">${Templates.formatDate(k.timestamp,{includeTime:!0})}</p>
                                        ${k.note?`<p class="text-sm text-gray-600 mt-1">${Templates.escapeHtml(k.note)}</p>`:""}
                                    </div>
                                `).join("")}
                            </div>
                        </div>
                    </div>
                `:""}

                <!-- Tracking Info -->
                ${E.tracking_number?`
                    <div class="px-6 py-4 border-b border-gray-100 bg-blue-50">
                        <div class="flex items-center justify-between">
                            <div>
                                <p class="text-sm font-medium text-blue-900">Tracking Number</p>
                                <p class="text-lg font-mono text-blue-700">${Templates.escapeHtml(E.tracking_number)}</p>
                            </div>
                            ${E.tracking_url?`
                                <a href="${E.tracking_url}" target="_blank" class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium">
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
                        ${L.map(k=>`
                            <div class="flex gap-4">
                                <div class="w-20 h-20 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                                    ${k.product?.image?`<img src="${k.product.image}" alt="" class="w-full h-full object-cover" onerror="this.style.display='none'">`:""}
                                </div>
                                <div class="flex-1">
                                    <div class="flex justify-between">
                                        <div>
                                            <h3 class="font-medium text-gray-900">${Templates.escapeHtml(k.product?.name||k.product_name)}</h3>
                                            ${k.variant?`<p class="text-sm text-gray-500">${Templates.escapeHtml(k.variant.name||k.variant_name)}</p>`:""}
                                            <p class="text-sm text-gray-500">Qty: ${k.quantity}</p>
                                        </div>
                                        <p class="font-medium text-gray-900">${Templates.formatPrice(k.price*k.quantity)}</p>
                                    </div>
                                    ${k.product?.slug?`
                                        <a href="/products/${k.product.slug}/" class="text-sm text-primary-600 hover:text-primary-700 mt-2 inline-block">
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
                        ${E.shipping_address?`
                            <p class="text-sm text-gray-600">${Templates.escapeHtml(E.shipping_address.full_name||`${E.shipping_address.first_name} ${E.shipping_address.last_name}`)}</p>
                            <p class="text-sm text-gray-600">${Templates.escapeHtml(E.shipping_address.address_line_1)}</p>
                            ${E.shipping_address.address_line_2?`<p class="text-sm text-gray-600">${Templates.escapeHtml(E.shipping_address.address_line_2)}</p>`:""}
                            <p class="text-sm text-gray-600">${Templates.escapeHtml(E.shipping_address.city)}, ${Templates.escapeHtml(E.shipping_address.state||"")} ${Templates.escapeHtml(E.shipping_address.postal_code)}</p>
                            <p class="text-sm text-gray-600">${Templates.escapeHtml(E.shipping_address.country)}</p>
                        `:'<p class="text-sm text-gray-500">Not available</p>'}
                    </div>
                    <div>
                        <h2 class="text-sm font-semibold text-gray-900 mb-2">Billing Address</h2>
                        ${E.billing_address?`
                            <p class="text-sm text-gray-600">${Templates.escapeHtml(E.billing_address.full_name||`${E.billing_address.first_name} ${E.billing_address.last_name}`)}</p>
                            <p class="text-sm text-gray-600">${Templates.escapeHtml(E.billing_address.address_line_1)}</p>
                            ${E.billing_address.address_line_2?`<p class="text-sm text-gray-600">${Templates.escapeHtml(E.billing_address.address_line_2)}</p>`:""}
                            <p class="text-sm text-gray-600">${Templates.escapeHtml(E.billing_address.city)}, ${Templates.escapeHtml(E.billing_address.state||"")} ${Templates.escapeHtml(E.billing_address.postal_code)}</p>
                            <p class="text-sm text-gray-600">${Templates.escapeHtml(E.billing_address.country)}</p>
                        `:'<p class="text-sm text-gray-500">Same as shipping</p>'}
                    </div>
                </div>

                <!-- Order Summary -->
                <div class="px-6 py-4">
                    <h2 class="text-sm font-semibold text-gray-900 mb-4">Order Summary</h2>
                    <div class="space-y-2 text-sm">
                        <div class="flex justify-between">
                            <span class="text-gray-600">Subtotal</span>
                            <span class="font-medium">${Templates.formatPrice(E.subtotal||0)}</span>
                        </div>
                        ${E.discount_amount?`
                            <div class="flex justify-between text-green-600">
                                <span>Discount</span>
                                <span>-${Templates.formatPrice(E.discount_amount)}</span>
                            </div>
                        `:""}
                        <div class="flex justify-between">
                            <span class="text-gray-600">Shipping</span>
                            <span class="font-medium">${E.shipping_cost>0?Templates.formatPrice(E.shipping_cost):"Free"}</span>
                        </div>
                        ${E.tax_amount?`
                            <div class="flex justify-between">
                                <span class="text-gray-600">Tax</span>
                                <span class="font-medium">${Templates.formatPrice(E.tax_amount)}</span>
                            </div>
                        `:""}
                        <div class="flex justify-between pt-2 border-t border-gray-200">
                            <span class="font-semibold text-gray-900">Total</span>
                            <span class="font-bold text-gray-900">${Templates.formatPrice(E.total)}</span>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Actions -->
            <div class="mt-6 flex flex-wrap gap-4">
                ${E.status==="delivered"?`
                    <button id="reorder-btn" class="px-6 py-3 bg-primary-600 text-white font-semibold rounded-lg hover:bg-primary-700 transition-colors" data-order-id="${E.id}">
                        Order Again
                    </button>
                `:""}
                ${["pending","processing"].includes(E.status)?`
                    <button id="cancel-order-btn" class="px-6 py-3 border border-red-300 text-red-600 font-semibold rounded-lg hover:bg-red-50 transition-colors" data-order-id="${E.id}">
                        Cancel Order
                    </button>
                `:""}
                <button id="print-invoice-btn" class="px-6 py-3 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors">
                    Print Invoice
                </button>
            </div>
        `,Q(E)}function Q(E){let _=document.getElementById("reorder-btn"),Y=document.getElementById("cancel-order-btn"),S=document.getElementById("print-invoice-btn");_?.addEventListener("click",async()=>{try{await OrdersApi.reorder(E.id),Toast.success("Items added to cart!"),document.dispatchEvent(new CustomEvent("cart:updated")),window.location.href="/cart/"}catch(L){Toast.error(L.message||"Failed to reorder.")}}),Y?.addEventListener("click",async()=>{if(await Modal.confirm({title:"Cancel Order",message:"Are you sure you want to cancel this order? This action cannot be undone.",confirmText:"Cancel Order",cancelText:"Keep Order"}))try{await OrdersApi.cancel(E.id),Toast.success("Order cancelled."),window.location.reload()}catch(k){Toast.error(k.message||"Failed to cancel order.")}}),S?.addEventListener("click",()=>{window.print()})}function ae(){let E=document.querySelectorAll("[data-filter-status]");E.forEach(_=>{_.addEventListener("click",()=>{E.forEach(Y=>{Y.classList.remove("bg-primary-100","text-primary-700"),Y.classList.add("text-gray-600")}),_.classList.add("bg-primary-100","text-primary-700"),_.classList.remove("text-gray-600"),e=_.dataset.filterStatus,n=1,p()})})}function O(){n=1,e="all"}return{init:s,destroy:O}})();window.OrdersPage=er;Br=er});var rr=gt(()=>{var Sr=(function(){"use strict";let n=window.BUNORAA_ROUTES||{},e=n.preordersWizard||"/preorders/create/",s=n.preordersLanding||"/preorders/";async function i(){await Promise.all([p(),w(),A()])}async function p(){let S=document.getElementById("preorder-categories");if(S)try{let L=await PreordersApi.getCategories({featured:!0,pageSize:8}),k=L?.data?.results||L?.data||L?.results||[];if(k.length===0){S.innerHTML=`
                    <div class="col-span-full text-center py-12">
                        <svg class="w-16 h-16 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" 
                                  d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/>
                        </svg>
                        <p class="text-gray-600 dark:text-gray-400 mb-4">No categories available at the moment</p>
                        <p class="text-sm text-gray-500 dark:text-gray-500">Check back soon or contact us for custom requests</p>
                    </div>
                `;return}S.innerHTML=k.map(B=>b(B)).join("")}catch(L){console.error("Failed to load pre-order categories:",L),S.innerHTML=`
                <div class="col-span-full text-center py-12">
                    <svg class="w-16 h-16 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" 
                              d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/>
                    </svg>
                    <p class="text-gray-600 dark:text-gray-400">No categories available at the moment</p>
                </div>
            `}}function b(S){let L=S.image?.url||S.image||S.thumbnail||"",k=L&&L.length>0,B=Templates?.escapeHtml||(h=>h),I=Templates?.formatPrice||(h=>`${window.BUNORAA_CURRENCY?.symbol||"\u09F3"}${h}`);return`
            <a href="${s}category/${S.slug}/" 
               class="group bg-white dark:bg-gray-800 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-200 dark:border-gray-700">
                ${k?`
                    <div class="aspect-video relative overflow-hidden">
                        <img src="${L}" alt="${B(S.name)}" 
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
                            ${B(S.name)}
                        </h3>
                        ${S.icon?`<span class="text-2xl">${S.icon}</span>`:""}
                    </div>
                    
                    ${S.description?`
                        <p class="text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
                            ${B(S.description)}
                        </p>
                    `:""}
                    
                    <div class="flex items-center justify-between text-sm">
                        ${S.base_price?`
                            <span class="text-gray-500 dark:text-gray-500">
                                Starting from <span class="font-semibold text-purple-600">${I(S.base_price)}</span>
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
        `}async function w(){let S=document.getElementById("preorder-templates");S&&S.closest("section")?.classList.add("hidden")}async function A(){let S=document.getElementById("preorder-stats");if(!S)return;let L={totalOrders:"500+",happyCustomers:"450+",avgRating:"4.9"};S.innerHTML=`
            <div class="flex items-center gap-8 justify-center flex-wrap">
                <div class="text-center">
                    <p class="text-3xl font-bold text-purple-600 dark:text-purple-400">${L.totalOrders}</p>
                    <p class="text-sm text-gray-600 dark:text-gray-400">Orders Completed</p>
                </div>
                <div class="h-12 w-px bg-gray-200 dark:bg-gray-700 hidden sm:block"></div>
                <div class="text-center">
                    <p class="text-3xl font-bold text-purple-600 dark:text-purple-400">${L.happyCustomers}</p>
                    <p class="text-sm text-gray-600 dark:text-gray-400">Happy Customers</p>
                </div>
                <div class="h-12 w-px bg-gray-200 dark:bg-gray-700 hidden sm:block"></div>
                <div class="text-center">
                    <p class="text-3xl font-bold text-purple-600 dark:text-purple-400">${L.avgRating}</p>
                    <p class="text-sm text-gray-600 dark:text-gray-400">Average Rating</p>
                </div>
            </div>
        `}async function H(S){let L=document.getElementById("category-options");if(!(!L||!S))try{let k=await PreordersApi.getCategory(S),B=await PreordersApi.getCategoryOptions(k.id);Q(L,B)}catch(k){console.error("Failed to load category options:",k)}}function Q(S,L){if(!L||L.length===0){S.innerHTML='<p class="text-gray-500">No customization options available.</p>';return}S.innerHTML=L.map(k=>`
            <div class="border border-gray-200 dark:border-gray-700 rounded-xl p-4">
                <h4 class="font-semibold text-gray-900 dark:text-white mb-2">${Templates.escapeHtml(k.name)}</h4>
                ${k.description?`<p class="text-sm text-gray-600 dark:text-gray-400 mb-3">${Templates.escapeHtml(k.description)}</p>`:""}
                <div class="space-y-2">
                    ${k.choices?.map(B=>`
                        <label class="flex items-center gap-3 p-3 border border-gray-200 dark:border-gray-600 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                            <input type="${k.allow_multiple?"checkbox":"radio"}" name="option_${k.id}" value="${B.id}" class="text-purple-600 focus:ring-purple-500">
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
        `).join("")}async function ae(){let S=document.getElementById("my-preorders-list");if(S){Loader.show(S,"skeleton");try{let L=await PreordersApi.getMyPreorders(),k=L?.data?.results||L?.data||L?.results||[];if(k.length===0){S.innerHTML=`
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
                `;return}S.innerHTML=k.map(B=>O(B)).join("")}catch(L){console.error("Failed to load pre-orders:",L),S.innerHTML=`
                <div class="text-center py-12">
                    <p class="text-red-500">Failed to load your orders. Please try again.</p>
                </div>
            `}}}function O(S){let L={pending:"bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",quoted:"bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",accepted:"bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-400",in_progress:"bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400",review:"bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400",approved:"bg-teal-100 text-teal-800 dark:bg-teal-900/30 dark:text-teal-400",completed:"bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",cancelled:"bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",refunded:"bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400"},k={pending:"Pending Review",quoted:"Quote Sent",accepted:"Quote Accepted",in_progress:"In Progress",review:"Under Review",approved:"Approved",completed:"Completed",cancelled:"Cancelled",refunded:"Refunded"},B=L[S.status]||"bg-gray-100 text-gray-800",I=k[S.status]||S.status;return`
            <a href="${s}order/${S.preorder_number}/" class="block bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 hover:shadow-lg transition-shadow">
                <div class="flex items-start justify-between gap-4 mb-4">
                    <div>
                        <p class="text-sm text-gray-500 dark:text-gray-400">${S.preorder_number}</p>
                        <h3 class="text-lg font-semibold text-gray-900 dark:text-white">${Templates.escapeHtml(S.title||S.category?.name||"Custom Order")}</h3>
                    </div>
                    <span class="px-3 py-1 text-xs font-medium rounded-full ${B}">${I}</span>
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
        `}async function E(S){S&&await Promise.all([_(S),Y(S)])}async function _(S){if(document.getElementById("preorder-status"))try{let k=await PreordersApi.getPreorderStatus(S)}catch{}}function Y(S){let L=document.getElementById("message-form");L&&L.addEventListener("submit",async k=>{k.preventDefault();let B=L.querySelector('textarea[name="message"]'),I=L.querySelector('button[type="submit"]'),h=B?.value?.trim();if(!h){Toast.error("Please enter a message");return}let a=I.innerHTML;I.disabled=!0,I.innerHTML='<svg class="animate-spin h-5 w-5 mx-auto" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>';try{await PreordersApi.sendMessage(S,h),Toast.success("Message sent successfully"),B.value="",location.reload()}catch(r){Toast.error(r.message||"Failed to send message")}finally{I.disabled=!1,I.innerHTML=a}})}return{initLanding:i,initCategoryDetail:H,initMyPreorders:ae,initDetail:E,loadFeaturedCategories:p,renderCategoryCard:b,renderPreorderCard:O}})();window.PreordersPage=Sr});var nr={};ne(nr,{default:()=>_r});var ar,_r,or=se(()=>{ar=(function(){"use strict";let n=null,e=null,s=null,i=!1,p=!1,b=!1,w=null;async function A(){if(i)return;i=!0;let t=document.getElementById("product-detail");if(!t)return;let o=t.querySelector("h1")||t.dataset.productId;if(p=!!o,o){n={id:t.dataset.productId,slug:t.dataset.productSlug},B(),H();return}let u=d();if(!u){window.location.href="/products/";return}await c(u),H()}function H(){Q(),ae(),O(),E(),_(),Y(),S(),L(),k()}function Q(){let t=document.getElementById("main-product-image")||document.getElementById("main-image"),o=t?.parentElement;if(!t||!o)return;let u=document.createElement("div");u.className="zoom-lens absolute w-32 h-32 border-2 border-primary-500 bg-white/30 pointer-events-none opacity-0 transition-opacity duration-200 z-10",u.style.backgroundRepeat="no-repeat";let m=document.createElement("div");m.className="zoom-result fixed right-8 top-1/2 -translate-y-1/2 w-96 h-96 border border-stone-200 dark:border-stone-700 rounded-xl shadow-2xl bg-white dark:bg-stone-800 opacity-0 pointer-events-none transition-opacity duration-200 z-50 hidden lg:block",m.style.backgroundRepeat="no-repeat",o.classList.add("relative"),o.appendChild(u),document.body.appendChild(m),o.addEventListener("mouseenter",()=>{window.innerWidth<1024||(u.classList.remove("opacity-0"),m.classList.remove("opacity-0"),b=!0)}),o.addEventListener("mouseleave",()=>{u.classList.add("opacity-0"),m.classList.add("opacity-0"),b=!1}),o.addEventListener("mousemove",v=>{if(!b||window.innerWidth<1024)return;let $=o.getBoundingClientRect(),J=v.clientX-$.left,Z=v.clientY-$.top,ie=J-u.offsetWidth/2,ge=Z-u.offsetHeight/2;u.style.left=`${Math.max(0,Math.min($.width-u.offsetWidth,ie))}px`,u.style.top=`${Math.max(0,Math.min($.height-u.offsetHeight,ge))}px`;let he=3,$e=-J*he+m.offsetWidth/2,g=-Z*he+m.offsetHeight/2;m.style.backgroundImage=`url(${t.src})`,m.style.backgroundSize=`${$.width*he}px ${$.height*he}px`,m.style.backgroundPosition=`${$e}px ${g}px`})}function ae(){let t=document.getElementById("size-guide-btn");t&&t.addEventListener("click",()=>{let o=document.createElement("div");o.id="size-guide-modal",o.className="fixed inset-0 z-50 flex items-center justify-center p-4",o.innerHTML=`
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
            `,document.body.appendChild(o)})}function O(){let t=document.getElementById("stock-alert-btn");t&&t.addEventListener("click",()=>{if(!document.getElementById("product-detail")?.dataset.productId)return;let u=document.createElement("div");u.id="stock-alert-modal",u.className="fixed inset-0 z-50 flex items-center justify-center p-4",u.innerHTML=`
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
            `,document.body.appendChild(u),document.getElementById("stock-alert-form")?.addEventListener("submit",async m=>{m.preventDefault();let v=document.getElementById("stock-alert-email")?.value;if(v)try{w=v,Toast.success("You will be notified when this product is back in stock!"),u.remove()}catch{Toast.error("Failed to subscribe. Please try again.")}})})}function E(){document.querySelectorAll(".share-btn").forEach(t=>{t.addEventListener("click",()=>{let o=t.dataset.platform,u=encodeURIComponent(window.location.href),m=encodeURIComponent(document.title),v=document.querySelector("h1")?.textContent||"",$={facebook:`https://www.facebook.com/sharer/sharer.php?u=${u}`,twitter:`https://twitter.com/intent/tweet?url=${u}&text=${encodeURIComponent(v)}`,pinterest:`https://pinterest.com/pin/create/button/?url=${u}&description=${encodeURIComponent(v)}`,whatsapp:`https://api.whatsapp.com/send?text=${encodeURIComponent(v+" "+window.location.href)}`,copy:null};o==="copy"?navigator.clipboard.writeText(window.location.href).then(()=>{Toast.success("Link copied to clipboard!")}).catch(()=>{Toast.error("Failed to copy link")}):$[o]&&window.open($[o],"_blank","width=600,height=400")})})}function _(){let t=document.getElementById("qa-section");if(!t||!document.getElementById("product-detail")?.dataset.productId)return;let u=[{question:"Is this product machine washable?",answer:"Yes, we recommend washing on a gentle cycle with cold water.",askedBy:"John D.",date:"2 days ago"},{question:"What materials is this made from?",answer:"This product is crafted from 100% organic cotton sourced from sustainable farms.",askedBy:"Sarah M.",date:"1 week ago"}];t.innerHTML=`
            <div class="space-y-6">
                <div class="flex items-center justify-between">
                    <h3 class="text-lg font-semibold text-stone-900 dark:text-white">Questions & Answers</h3>
                    <button id="ask-question-btn" class="text-sm font-medium text-primary-600 dark:text-amber-400 hover:underline">Ask a Question</button>
                </div>
                <div id="qa-list" class="space-y-4">
                    ${u.map(m=>`
                        <div class="bg-stone-50 dark:bg-stone-700/50 rounded-xl p-4">
                            <div class="flex items-start gap-3 mb-2">
                                <span class="text-primary-600 dark:text-amber-400 font-bold">Q:</span>
                                <div>
                                    <p class="text-stone-900 dark:text-white font-medium">${Templates.escapeHtml(m.question)}</p>
                                    <p class="text-xs text-stone-500 dark:text-stone-400 mt-1">${m.askedBy} \u2022 ${m.date}</p>
                                </div>
                            </div>
                            ${m.answer?`
                                <div class="flex items-start gap-3 mt-3 pl-6">
                                    <span class="text-emerald-600 dark:text-emerald-400 font-bold">A:</span>
                                    <p class="text-stone-600 dark:text-stone-300">${Templates.escapeHtml(m.answer)}</p>
                                </div>
                            `:""}
                        </div>
                    `).join("")}
                </div>
            </div>
        `,document.getElementById("ask-question-btn")?.addEventListener("click",()=>{let m=document.createElement("div");m.id="ask-question-modal",m.className="fixed inset-0 z-50 flex items-center justify-center p-4",m.innerHTML=`
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
            `,document.body.appendChild(m),document.getElementById("question-form")?.addEventListener("submit",v=>{v.preventDefault(),Toast.success("Your question has been submitted!"),m.remove()})})}function Y(){let t=document.getElementById("delivery-estimate");if(!t)return;let o=new Date,u=3,m=7,v=new Date(o.getTime()+u*24*60*60*1e3),$=new Date(o.getTime()+m*24*60*60*1e3),J=Z=>Z.toLocaleDateString("en-US",{weekday:"short",month:"short",day:"numeric"});t.innerHTML=`
            <div class="flex items-start gap-3 p-4 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl">
                <svg class="w-5 h-5 text-emerald-600 dark:text-emerald-400 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"/>
                </svg>
                <div>
                    <p class="text-sm font-medium text-emerald-700 dark:text-emerald-300">Estimated Delivery</p>
                    <p class="text-emerald-600 dark:text-emerald-400 font-semibold">${J(v)} - ${J($)}</p>
                    <p class="text-xs text-emerald-600 dark:text-emerald-400 mt-1">Free shipping on orders over $50</p>
                </div>
            </div>
        `}function S(){let t=document.getElementById("product-detail")?.dataset.productId,o=document.getElementById("product-detail")?.dataset.productSlug,u=document.querySelector("h1")?.textContent,m=document.getElementById("main-product-image")?.src||document.getElementById("main-image")?.src,v=document.getElementById("product-price")?.textContent;if(!t)return;let $=JSON.parse(localStorage.getItem("recentlyViewed")||"[]"),J=$.findIndex(Z=>Z.id===t);J>-1&&$.splice(J,1),$.unshift({id:t,slug:o,name:u,image:m,price:v,viewedAt:new Date().toISOString()}),localStorage.setItem("recentlyViewed",JSON.stringify($.slice(0,20)))}function L(){if(document.getElementById("mobile-sticky-atc")||document.getElementById("mobile-sticky-atc-js")||window.innerWidth>=1024)return;let o=n;if(!o)return;let u=document.createElement("div");u.id="mobile-sticky-atc-enhanced",u.className="fixed bottom-0 inset-x-0 z-40 lg:hidden bg-white dark:bg-stone-800 border-t border-stone-200 dark:border-stone-700 shadow-2xl p-3 transform translate-y-full transition-transform duration-300",u.innerHTML=`
            <div class="flex items-center gap-3">
                <div class="flex-1 min-w-0">
                    <p class="text-xs text-stone-500 dark:text-stone-400 truncate">${o.name||""}</p>
                    <p class="font-bold text-stone-900 dark:text-white">${o.sale_price?Templates.formatPrice(o.sale_price):Templates.formatPrice(o.price||0)}</p>
                </div>
                <button id="sticky-add-to-cart" class="px-6 py-3 bg-primary-600 dark:bg-amber-600 text-white font-semibold rounded-xl hover:bg-primary-700 dark:hover:bg-amber-700 transition-colors">
                    Add to Cart
                </button>
            </div>
        `,document.body.appendChild(u);let m=document.getElementById("add-to-cart-btn");m&&new IntersectionObserver($=>{$.forEach(J=>{J.isIntersecting?u.classList.add("translate-y-full"):u.classList.remove("translate-y-full")})},{threshold:0}).observe(m),document.getElementById("sticky-add-to-cart")?.addEventListener("click",()=>{document.getElementById("add-to-cart-btn")?.click()})}function k(){document.querySelectorAll("[data-video-url]").forEach(o=>{o.addEventListener("click",()=>{let u=o.dataset.videoUrl;if(!u)return;let m=document.createElement("div");m.id="video-player-modal",m.className="fixed inset-0 z-50 flex items-center justify-center bg-black/90",m.innerHTML=`
                    <button onclick="document.getElementById('video-player-modal').remove()" class="absolute top-4 right-4 w-12 h-12 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-colors">
                        <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
                    </button>
                    <video controls autoplay class="max-w-full max-h-[90vh] rounded-xl">
                        <source src="${u}" type="video/mp4">
                        Your browser does not support video playback.
                    </video>
                `,document.body.appendChild(m)})})}function B(){te(),h(),a(),t();async function t(){let o=document.getElementById("add-to-wishlist-btn");if(!o)return;let u=document.getElementById("product-detail")?.dataset.productId;if(u&&!(typeof WishlistApi>"u"))try{let m=await WishlistApi.getWishlist({pageSize:100});m.success&&m.data?.items&&(m.data.items.some($=>$.product_id===u||$.product===u)?(o.querySelector("svg")?.setAttribute("fill","currentColor"),o.classList.add("text-red-500")):(o.querySelector("svg")?.setAttribute("fill","none"),o.classList.remove("text-red-500")))}catch{}}r(),l(),Ee(),I()}function I(){let t=document.querySelectorAll(".tab-btn"),o=document.querySelectorAll(".tab-content");t.forEach(u=>{u.addEventListener("click",()=>{let m=u.dataset.tab;t.forEach(v=>{v.classList.remove("border-primary-500","text-primary-600"),v.classList.add("border-transparent","text-gray-500")}),u.classList.add("border-primary-500","text-primary-600"),u.classList.remove("border-transparent","text-gray-500"),o.forEach(v=>{v.id===`${m}-tab`?v.classList.remove("hidden"):v.classList.add("hidden")})})})}function h(){let t=document.getElementById("add-to-cart-btn");t&&t.addEventListener("click",async()=>{let o=document.getElementById("product-detail")?.dataset.productId,u=parseInt(document.getElementById("quantity")?.value)||1,v=!!document.querySelector('input[name="variant"]'),$=document.querySelector('input[name="variant"]:checked')?.value;if(!o)return;if(v&&!$){Toast.warning("Please select a variant before adding to cart.");return}t.disabled=!0;let J=t.innerHTML;t.innerHTML='<svg class="animate-spin h-5 w-5 mx-auto" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>';try{await CartApi.addItem(o,u,$||null),Toast.success("Added to cart!"),document.dispatchEvent(new CustomEvent("cart:updated"))}catch(Z){Toast.error(Z.message||"Failed to add to cart.")}finally{t.disabled=!1,t.innerHTML=J}})}function a(){let t=document.getElementById("add-to-wishlist-btn");t&&t.addEventListener("click",async()=>{let o=document.getElementById("product-detail")?.dataset.productId;if(o){if(typeof AuthApi<"u"&&!AuthApi.isAuthenticated()){Toast.warning("Please login to add items to your wishlist."),window.location.href="/account/login/?next="+encodeURIComponent(window.location.pathname);return}try{let u=!1;if(typeof WishlistApi<"u"){let m=await WishlistApi.getWishlist({pageSize:100});m.success&&m.data?.items&&(u=m.data.items.some(v=>v.product_id===o||v.product===o))}if(u){let v=(await WishlistApi.getWishlist({pageSize:100})).data.items.find($=>$.product_id===o||$.product===o);v&&(await WishlistApi.removeItem(v.id),Toast.success("Removed from wishlist!"),t.querySelector("svg")?.setAttribute("fill","none"),t.classList.remove("text-red-500"),t.setAttribute("aria-pressed","false"))}else await WishlistApi.addItem(o),Toast.success("Added to wishlist!"),t.querySelector("svg")?.setAttribute("fill","currentColor"),t.classList.add("text-red-500"),t.setAttribute("aria-pressed","true")}catch(u){Toast.error(u.message||"Wishlist action failed.")}}})}function r(){document.querySelectorAll('input[name="variant"]').forEach(o=>{o.addEventListener("change",()=>{e=o.value;let u=o.dataset.price,m=parseInt(o.dataset.stock||"0");if(u){let ie=document.getElementById("product-price");ie&&window.Templates?.formatPrice&&(ie.textContent=window.Templates.formatPrice(parseFloat(u)))}let v=document.getElementById("stock-status"),$=document.getElementById("add-to-cart-btn"),J=document.getElementById("mobile-stock"),Z=document.getElementById("mobile-add-to-cart");v&&(m>10?v.innerHTML='<span class="text-green-600">In Stock</span>':m>0?v.innerHTML=`<span class="text-orange-500">Only ${m} left</span>`:v.innerHTML='<span class="text-red-600">Out of Stock</span>'),$&&($.disabled=m<=0),Z&&(Z.disabled=m<=0),J&&(J.textContent=m>0?m>10?"In stock":`${m} available`:"Out of stock")})})}function l(){document.getElementById("main-image")?.addEventListener("click",()=>{})}function d(){let o=window.location.pathname.match(/\/products\/([^\/]+)/);return o?o[1]:null}async function c(t){let o=document.getElementById("product-detail");if(o){Loader.show(o,"skeleton");try{if(n=(await ProductsApi.getProduct(t)).data,!n){window.location.href="/404/";return}document.title=`${n.name} | Bunoraa`,f(n),C(n),M(n),await Promise.all([we(n),pe(n),ve(n),R(n)]),F(),D(n)}catch(u){console.error("Failed to load product:",u),o.innerHTML='<p class="text-red-500 text-center py-8">Failed to load product. Please try again.</p>'}}}document.addEventListener("currency:changed",async t=>{try{!p&&n&&n.slug?await c(n.slug):location.reload()}catch{}});function f(t){let o=document.getElementById("product-detail");if(!o)return;let u=t.images||[],m=t.image||u[0]?.image||"",v=t.variants&&t.variants.length>0,$=t.stock_quantity>0||t.in_stock,J=t.sale_price&&t.sale_price<t.price;o.innerHTML=`
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
                <!-- Gallery -->
                <div id="product-gallery" class="product-gallery">
                    <div class="main-image-container relative rounded-xl overflow-hidden bg-gray-100" style="aspect-ratio: ${t?.aspect?.css||"1/1"};">
                        <img 
                            src="${m}" 
                            alt="${Templates.escapeHtml(t.name)}"
                            loading="lazy"
                            decoding="async"
                            class="main-image w-full h-full object-cover cursor-zoom-in"
                            id="main-product-image"
                        >
                        ${J?`
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
                    ${u.length>1?`
                        <div class="thumbnails flex gap-2 mt-4 overflow-x-auto pb-2">
                            ${u.map((Z,ie)=>`
                                <button 
                                    class="thumbnail flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 ${ie===0?"border-primary-500":"border-transparent"} hover:border-primary-500 transition-colors"
                                    data-image="${Z.image}"
                                    data-index="${ie}"
                                >
                                    <img src="${Z.image}" alt="" loading="lazy" decoding="async" class="w-full h-full object-cover">
                                </button>
                            `).join("")}
                        </div>
                    `:""}
                </div>

                <!-- Product Info -->
                <div class="product-info">
                    <!-- Brand -->
                    ${t.brand?`
                        <a href="/products/?brand=${t.brand.id}" class="text-sm text-primary-600 hover:text-primary-700 font-medium">
                            ${Templates.escapeHtml(t.brand.name)}
                        </a>
                    `:""}

                    <!-- Title -->
                    <h1 class="text-2xl md:text-3xl font-bold text-gray-900 mt-2">
                        ${Templates.escapeHtml(t.name)}
                    </h1>

                    <!-- Rating -->
                    ${t.average_rating?`
                        <div class="flex items-center gap-2 mt-3">
                            <div class="flex items-center">
                                ${Templates.renderStars(t.average_rating)}
                            </div>
                            <span class="text-sm text-gray-600">
                                ${t.average_rating.toFixed(1)} (${t.review_count||0} reviews)
                            </span>
                            <a href="#reviews" class="text-sm text-primary-600 hover:text-primary-700">
                                Read reviews
                            </a>
                        </div>
                    `:""}

                    <!-- Price -->
                    <div class="mt-4">
                        ${Price.render({price:t.current_price??t.price_converted??t.price,salePrice:t.sale_price_converted??t.sale_price,size:"large"})}
                    </div>

                    <!-- Short Description -->
                    ${t.short_description?`
                        <p class="mt-4 text-gray-600">${Templates.escapeHtml(t.short_description)}</p>
                    `:""}

                    <!-- Variants -->
                    ${v?P(t.variants):""}

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
                                    max="${t.stock_quantity||99}"
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
                            ${t.stock_quantity?`
                                <div id="stock-status" class="text-sm text-gray-500">${t.stock_quantity>10?"In stock":t.stock_quantity+" available"}</div>
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
                                data-product-id="${t.id}"
                            >
                                <svg class="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/>
                                </svg>
                            </button>
                        </div>
                    </div>

                    <!-- Product Meta -->
                    <div class="mt-6 pt-6 border-t border-gray-200 space-y-3 text-sm">
                        ${t.sku?`
                            <div class="flex">
                                <span class="text-gray-500 w-24">SKU:</span>
                                <span class="text-gray-900">${Templates.escapeHtml(t.sku)}</span>
                            </div>
                        `:""}
                        ${t.category?`
                            <div class="flex">
                                <span class="text-gray-500 w-24">Category:</span>
                                <a href="/categories/${t.category.slug}/" class="text-primary-600 hover:text-primary-700">
                                    ${Templates.escapeHtml(t.category.name)}
                                </a>
                            </div>
                        `:""}
                        ${t.tags&&t.tags.length?`
                            <div class="flex">
                                <span class="text-gray-500 w-24">Tags:</span>
                                <div class="flex flex-wrap gap-1">
                                    ${t.tags.map(Z=>`
                                        <a href="/products/?tag=${Z.slug}" class="px-2 py-0.5 bg-gray-100 text-gray-600 rounded hover:bg-gray-200 transition-colors">
                                            ${Templates.escapeHtml(Z.name)}
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
                        ${t.specifications&&Object.keys(t.specifications).length?`
                            <button data-tab class="px-6 py-4 text-sm font-medium text-gray-600 hover:text-gray-900 border-b-2 border-transparent">
                                Specifications
                            </button>
                        `:""}
                        <button data-tab class="px-6 py-4 text-sm font-medium text-gray-600 hover:text-gray-900 border-b-2 border-transparent">
                            Reviews (${t.review_count||0})
                        </button>
                    </nav>
                </div>
                <div class="py-6">
                    <div data-tab-panel>
                        <div class="prose max-w-none">
                            ${t.description||'<p class="text-gray-500">No description available.</p>'}
                        </div>
                    </div>
                    ${t.specifications&&Object.keys(t.specifications).length?`
                        <div data-tab-panel>
                            <table class="w-full">
                                <tbody>
                                    ${Object.entries(t.specifications).map(([Z,ie])=>`
                                        <tr class="border-b border-gray-100">
                                            <td class="py-3 text-sm font-medium text-gray-500 w-1/3">${Templates.escapeHtml(Z)}</td>
                                            <td class="py-3 text-sm text-gray-900">${Templates.escapeHtml(String(ie))}</td>
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
        `,G(),te(),me(),ye(),be(),xe(),Tabs.init(),x(t)}function x(t){let o=document.getElementById("mobile-sticky-atc-js");if(o){let u=o.querySelector(".font-semibold");u&&(u.innerHTML=t.sale_price?Templates.formatPrice(t.sale_price)+' <span class="text-sm line-through text-gray-400">'+Templates.formatPrice(t.price)+"</span>":Templates.formatPrice(t.price));let m=document.getElementById("mobile-stock-js");m&&(m.textContent=t.stock_quantity>0?t.stock_quantity>10?"In stock":t.stock_quantity+" available":"Out of stock");let v=document.getElementById("mobile-add-to-cart-js");v&&(v.disabled=t.stock_quantity<=0)}else{o=document.createElement("div"),o.id="mobile-sticky-atc-js",o.className="fixed inset-x-4 bottom-4 z-40 lg:hidden",o.innerHTML=`
                <div class="bg-white shadow-lg rounded-xl p-3 flex items-center gap-3">
                    <div class="flex-1">
                        <div class="text-sm text-gray-500">${t.sale_price?"Now":""}</div>
                        <div class="font-semibold text-lg ${t.sale_price?"text-red-600":""}">${t.sale_price?Templates.formatPrice(t.sale_price)+' <span class="text-sm line-through text-gray-400">'+Templates.formatPrice(t.price)+"</span>":Templates.formatPrice(t.price)}</div>
                        <div id="mobile-stock-js" class="text-xs text-gray-500">${t.stock_quantity>0?t.stock_quantity>10?"In stock":t.stock_quantity+" available":"Out of stock"}</div>
                    </div>
                    ${t.stock_quantity>0?'<button id="mobile-add-to-cart-js" class="bg-primary-600 text-white px-4 py-2 rounded-lg font-semibold">Add</button>':'<button class="bg-gray-300 text-gray-500 px-4 py-2 rounded-lg font-semibold cursor-not-allowed" disabled>Out</button>'}
                </div>
            `,document.body.appendChild(o);let u=document.getElementById("mobile-add-to-cart-js");u&&u.addEventListener("click",()=>document.getElementById("add-to-cart-btn")?.click())}}function P(t){let o={};return t.forEach(u=>{o[u.attribute_name]||(o[u.attribute_name]=[]),o[u.attribute_name].push(u)}),Object.entries(o).map(([u,m])=>`
            <div class="mt-6">
                <label class="text-sm font-medium text-gray-700">${Templates.escapeHtml(u)}:</label>
                <div class="flex flex-wrap gap-2 mt-2" role="radiogroup" aria-label="${Templates.escapeHtml(u)}">
                    ${m.map((v,$)=>`
                        <button 
                            class="variant-btn px-4 py-2 border rounded-lg text-sm transition-colors ${$===0?"border-primary-500 bg-primary-50 text-primary-700":"border-gray-300 hover:border-gray-400"}"
                            role="radio"
                            aria-checked="${$===0?"true":"false"}"
                            data-variant-id="${v.id}"
                            data-price="${v.price_converted??v.price??""}"
                            data-stock="${v.stock_quantity||0}"
                            tabindex="0"
                        >
                            ${Templates.escapeHtml(v.value)}
                            ${(v.price_converted??v.price)&&v.price!==n.price?`
                                <span class="text-xs text-gray-500">(${Templates.formatPrice(v.price_converted??v.price)})</span>
                            `:""}
                        </button>
                    `).join("")}
                </div>
            </div>
        `).join("")}function G(){let t=document.querySelectorAll(".thumbnail"),o=document.getElementById("main-product-image"),u=0;t.forEach((m,v)=>{m.setAttribute("tabindex","0"),m.addEventListener("click",()=>{t.forEach($=>$.classList.remove("border-primary-500")),m.classList.add("border-primary-500"),o.src=m.dataset.image||m.dataset.src,u=v}),m.addEventListener("keydown",$=>{if($.key==="Enter"||$.key===" ")$.preventDefault(),m.click();else if($.key==="ArrowRight"){$.preventDefault();let J=t[(v+1)%t.length];J.focus(),J.click()}else if($.key==="ArrowLeft"){$.preventDefault();let J=t[(v-1+t.length)%t.length];J.focus(),J.click()}})}),o?.addEventListener("click",()=>{let m=n.images?.map(Z=>Z.image)||[n.image],v=parseInt(document.querySelector(".thumbnail.border-primary-500")?.dataset.index)||0,J=(n.images||[]).map(Z=>({type:Z.type||(Z.video_url?"video":"image"),src:Z.video_url||Z.model_url||Z.image})).map(Z=>{if(Z.type==="video")return`<div class="w-full h-full max-h-[70vh]"><video controls class="w-full h-full object-contain"><source src="${Z.src}" type="video/mp4">Your browser does not support video.</video></div>`;if(Z.type==="model"){if(!window.customElements||!window["model-viewer"]){let ie=document.createElement("script");ie.type="module",ie.src="https://unpkg.com/@google/model-viewer/dist/model-viewer.min.js",document.head.appendChild(ie)}return`<div class="w-full h-full max-h-[70vh]"><model-viewer src="${Z.src}" camera-controls ar ar-modes="webxr scene-viewer quick-look" class="w-full h-full"></model-viewer></div>`}return`<div class="w-full h-full max-h-[70vh] flex items-center justify-center"><img src="${Z.src}" class="max-w-full max-h-[70vh] object-contain" alt="${Templates.escapeHtml(n.name)}"></div>`}).join("");Modal.open({title:Templates.escapeHtml(n.name),content:`<div class="space-y-2">${J}</div>`,size:"xl"})})}function te(){let t=document.getElementById("product-quantity"),o=document.querySelector(".qty-decrease"),u=document.querySelector(".qty-increase");o?.addEventListener("click",()=>{let v=parseInt(t.value)||1;v>1&&(t.value=v-1)}),u?.addEventListener("click",()=>{let v=parseInt(t.value)||1,$=parseInt(t.max)||99;v<$&&(t.value=v+1)});let m=document.querySelectorAll(".variant-btn");if(m.forEach(v=>{v.addEventListener("click",()=>{if(m.forEach(he=>{he.classList.remove("border-primary-500","bg-primary-50","text-primary-700"),he.classList.add("border-gray-300"),he.setAttribute("aria-checked","false")}),v.classList.add("border-primary-500","bg-primary-50","text-primary-700"),v.classList.remove("border-gray-300"),v.setAttribute("aria-checked","true"),e=v.dataset.variantId,v.dataset.price){let he=document.querySelector(".product-info .mt-4");he&&(he.innerHTML=Price.render({price:parseFloat(v.dataset.price),size:"large"}))}let $=parseInt(v.dataset.stock||"0"),J=document.getElementById("stock-status"),Z=document.getElementById("add-to-cart-btn"),ie=document.getElementById("mobile-stock"),ge=document.getElementById("mobile-add-to-cart");J&&($>10?J.innerHTML='<span class="text-green-600 flex items-center"><svg class="w-5 h-5 mr-1" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path></svg>In Stock</span>':$>0?J.innerHTML=`<span class="text-orange-500 flex items-center"><svg class="w-5 h-5 mr-1" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd"></path></svg>Only ${$} left</span>`:J.innerHTML='<span class="text-red-600 flex items-center"><svg class="w-5 h-5 mr-1" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"></path></svg>Out of Stock</span>'),t&&(t.max=Math.max($,1),parseInt(t.value)>parseInt(t.max)&&(t.value=t.max)),ie&&(ie.textContent=$>0?$>10?"In stock":`${$} available`:"Out of stock"),Z&&(Z.disabled=$<=0),ge&&(ge.disabled=$<=0)})}),m.length>0){let v=m[0];v.setAttribute("aria-checked","true"),e=v.dataset.variantId}}function me(){let t=document.getElementById("add-to-cart-btn"),o=document.getElementById("mobile-add-to-cart");if(!t&&!o)return;let u=async m=>{let v=parseInt(document.getElementById("product-quantity")?.value)||1,$=document.getElementById("stock-status");if(!!document.querySelector(".variant-btn")&&!e){Toast.warning("Please select a variant before adding to cart.");return}m.disabled=!0;let Z=m.innerHTML;m.innerHTML='<svg class="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>';try{let ie=document.querySelector(`.variant-btn[data-variant-id="${e}"]`);if((ie?parseInt(ie.dataset.stock||"0"):n.stock_quantity||0)<=0){Toast.error("This variant is out of stock.");return}await CartApi.addItem(n.id,v,e||null),Toast.success("Added to cart!"),document.dispatchEvent(new CustomEvent("cart:updated"))}catch(ie){Toast.error(ie.message||"Failed to add to cart.")}finally{m.disabled=!1,m.innerHTML=Z}};t?.addEventListener("click",()=>u(t)),o?.addEventListener("click",()=>u(o))}function ye(){let t=document.getElementById("add-to-wishlist-btn");t&&t.addEventListener("click",async()=>{if(!AuthApi.isAuthenticated()){Toast.warning("Please login to add items to your wishlist."),window.location.href="/account/login/?next="+encodeURIComponent(window.location.pathname);return}try{await WishlistApi.addItem(n.id),Toast.success("Added to wishlist!"),t.querySelector("svg").setAttribute("fill","currentColor"),t.classList.add("text-red-500"),t.setAttribute("aria-pressed","true")}catch(o){o.message?.includes("already")?Toast.info("This item is already in your wishlist."):Toast.error(o.message||"Failed to add to wishlist.")}})}function xe(){let t=document.querySelectorAll(".share-btn"),o=encodeURIComponent(window.location.href),u=encodeURIComponent(n?.name||document.title);t.forEach(m=>{m.addEventListener("click",()=>{let v=m.dataset.platform,$="";switch(v){case"facebook":$=`https://www.facebook.com/sharer/sharer.php?u=${o}`;break;case"twitter":$=`https://twitter.com/intent/tweet?url=${o}&text=${u}`;break;case"pinterest":let J=encodeURIComponent(n?.image||"");$=`https://pinterest.com/pin/create/button/?url=${o}&media=${J}&description=${u}`;break;case"copy":navigator.clipboard.writeText(window.location.href).then(()=>Toast.success("Link copied to clipboard!")).catch(()=>Toast.error("Failed to copy link."));return}$&&window.open($,"_blank","width=600,height=400")})})}function be(){let t=document.getElementById("add-to-compare-btn");t&&t.addEventListener("click",async()=>{if(typeof AuthApi<"u"&&!AuthApi.isAuthenticated()){Toast.warning("Please login to compare products."),window.location.href="/account/login/?next="+encodeURIComponent(window.location.pathname);return}let o=n?.id||document.getElementById("product-detail")?.dataset.productId;if(o)try{let u=await ApiClient.post("/compare/",{product_id:o},{requiresAuth:!0});u.success?(Toast.success(u.message||"Added to compare"),t.setAttribute("aria-pressed","true"),t.classList.add("text-primary-600"),t.querySelector("svg")?.setAttribute("fill","currentColor")):Toast.error(u.message||"Failed to add to compare")}catch(u){try{let m="b_compare",v=JSON.parse(localStorage.getItem(m)||"[]");if(!v.includes(o)){v.push(o),localStorage.setItem(m,JSON.stringify(v)),Toast.success("Added to compare (local)"),t.setAttribute("aria-pressed","true"),t.classList.add("text-primary-600");return}Toast.info("Already in compare list")}catch{Toast.error(u.message||"Failed to add to compare")}}})}function Ee(){let t=document.getElementById("add-to-compare-btn");t&&t.addEventListener("click",async o=>{o.preventDefault();let u=document.getElementById("product-detail")?.dataset.productId;if(u)try{if(typeof AuthApi<"u"&&!AuthApi.isAuthenticated()){Toast.warning("Please login to compare products."),window.location.href="/account/login/?next="+encodeURIComponent(window.location.pathname);return}let m=await ApiClient.post("/compare/",{product_id:u},{requiresAuth:!0});m.success?(Toast.success(m.message||"Added to compare"),t.setAttribute("aria-pressed","true"),t.classList.add("text-primary-600"),t.querySelector("svg")?.setAttribute("fill","currentColor")):Toast.error(m.message||"Failed to add to compare")}catch(m){try{let v="b_compare",$=JSON.parse(localStorage.getItem(v)||"[]");if(!$.includes(u)){$.push(u),localStorage.setItem(v,JSON.stringify($)),Toast.success("Added to compare (local)"),t.setAttribute("aria-pressed","true"),t.classList.add("text-primary-600");return}Toast.info("Already in compare list")}catch{Toast.error(m.message||"Failed to add to compare")}}})}async function we(t){let o=document.getElementById("breadcrumbs");if(!o)return;let u=[{label:"Home",url:"/"},{label:"Products",url:"/products/"}];if(t.category)try{((await CategoriesAPI.getBreadcrumbs(t.category.id)).data||[]).forEach($=>{u.push({label:$.name,url:`/categories/${$.slug}/`})})}catch{u.push({label:t.category.name,url:`/categories/${t.category.slug}/`})}u.push({label:t.name}),o.innerHTML=Breadcrumb.render(u)}async function pe(t){let o=document.getElementById("related-products");if(o)try{let m=(await ProductsAPI.getRelated(t.id,{limit:4})).data||[];if(m.length===0){o.innerHTML="";return}o.innerHTML=`
                <h2 class="text-2xl font-bold text-gray-900 mb-6">You may also like</h2>
                <div class="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                    ${m.map(v=>ProductCard.render(v)).join("")}
                </div>
            `,ProductCard.bindEvents(o)}catch(u){console.error("Failed to load related products:",u),o.innerHTML=""}}async function ve(t){let o=document.getElementById("reviews-container");if(o){Loader.show(o,"spinner");try{let m=(await ProductsAPI.getReviews(t.id)).data||[];o.innerHTML=`
                <!-- Review Summary -->
                <div class="flex flex-col md:flex-row gap-8 mb-8 pb-8 border-b border-gray-200">
                    <div class="text-center">
                        <div class="text-5xl font-bold text-gray-900">${t.average_rating?.toFixed(1)||"0.0"}</div>
                        <div class="flex justify-center mt-2">
                            ${Templates.renderStars(t.average_rating||0)}
                        </div>
                        <div class="text-sm text-gray-500 mt-1">${t.review_count||0} reviews</div>
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
                ${m.length>0?`
                    <div class="space-y-6">
                        ${m.map(v=>`
                            <div class="border-b border-gray-100 pb-6">
                                <div class="flex items-start gap-4">
                                    <div class="flex-shrink-0 w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                                        <span class="text-gray-600 font-medium">${(v.user?.first_name?.[0]||v.user?.email?.[0]||"U").toUpperCase()}</span>
                                    </div>
                                    <div class="flex-1">
                                        <div class="flex items-center gap-2">
                                            <span class="font-medium text-gray-900">${Templates.escapeHtml(v.user?.first_name||"Anonymous")}</span>
                                            ${v.verified_purchase?`
                                                <span class="px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded">Verified Purchase</span>
                                            `:""}
                                        </div>
                                        <div class="flex items-center gap-2 mt-1">
                                            ${Templates.renderStars(v.rating)}
                                            <span class="text-sm text-gray-500">${Templates.formatDate(v.created_at)}</span>
                                        </div>
                                        ${v.title?`<h4 class="font-medium text-gray-900 mt-2">${Templates.escapeHtml(v.title)}</h4>`:""}
                                        <p class="text-gray-600 mt-2">${Templates.escapeHtml(v.comment)}</p>
                                    </div>
                                </div>
                            </div>
                        `).join("")}
                    </div>
                `:`
                    <p class="text-gray-500 text-center py-8">No reviews yet. Be the first to review this product!</p>
                `}
            `,document.getElementById("write-review-btn")?.addEventListener("click",()=>{y(t)})}catch(u){console.error("Failed to load reviews:",u),o.innerHTML='<p class="text-red-500">Failed to load reviews.</p>'}}}function y(t){Modal.open({title:"Write a Review",content:`
                <form id="review-form" class="space-y-4">
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">Rating</label>
                        <div class="flex gap-1" id="rating-stars">
                            ${[1,2,3,4,5].map(m=>`
                                <button type="button" class="rating-star text-gray-300 hover:text-yellow-400" data-rating="${m}">
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
            `,confirmText:"Submit Review",onConfirm:async()=>{let m=parseInt(document.getElementById("review-rating").value),v=document.getElementById("review-title").value.trim(),$=document.getElementById("review-comment").value.trim();if(!m||m<1)return Toast.error("Please select a rating."),!1;if(!$)return Toast.error("Please write a review."),!1;try{return await ProductsAPI.createReview(t.id,{rating:m,title:v,comment:$}),Toast.success("Thank you for your review!"),ve(t),!0}catch(J){return Toast.error(J.message||"Failed to submit review."),!1}}});let o=document.querySelectorAll(".rating-star"),u=document.getElementById("review-rating");o.forEach(m=>{m.addEventListener("click",()=>{let v=parseInt(m.dataset.rating);u.value=v,o.forEach(($,J)=>{J<v?($.classList.remove("text-gray-300"),$.classList.add("text-yellow-400")):($.classList.add("text-gray-300"),$.classList.remove("text-yellow-400"))})})})}function C(t){try{document.title=`${t.name} | Bunoraa`;let o=t.meta_description||t.short_description||"";document.querySelector('meta[name="description"]')?.setAttribute("content",o),document.querySelector('meta[property="og:title"]')?.setAttribute("content",t.meta_title||t.name),document.querySelector('meta[property="og:description"]')?.setAttribute("content",o);let u=t.images?.[0]?.image||t.image;u&&document.querySelector('meta[property="og:image"]')?.setAttribute("content",u),document.querySelector('meta[name="twitter:title"]')?.setAttribute("content",t.meta_title||t.name),document.querySelector('meta[name="twitter:description"]')?.setAttribute("content",o)}catch{}}function M(t){try{let o=document.querySelector('script[type="application/ld+json"][data-ld="product"]');if(!o)return;let u={"@context":"https://schema.org","@type":"Product",name:t.name,image:(t.images||[]).map(m=>m.image||m),description:t.short_description||t.description||"",sku:t.sku||"",offers:{"@type":"Offer",url:window.location.href,priceCurrency:t.currency||window.BUNORAA_PRODUCT?.currency||"BDT",price:t.current_price||t.price}};o.textContent=JSON.stringify(u)}catch{}}async function R(t){let o=document.getElementById("related-products");if(o)try{let[u,m,v]=await Promise.all([ProductsApi.getRecommendations(t.id,"frequently_bought_together",3),ProductsApi.getRecommendations(t.id,"similar",4),ProductsApi.getRecommendations(t.id,"you_may_also_like",6)]);if(u.success&&u.data?.length){let $=`
                    <section class="mt-8">
                        <h3 class="text-lg font-semibold mb-4">Frequently Bought Together</h3>
                        <div class="grid grid-cols-3 gap-3">${(u.data||[]).map(J=>ProductCard.render(J)).join("")}</div>
                    </section>
                `;o.insertAdjacentHTML("beforeend",$)}if(m.success&&m.data?.length){let $=`
                    <section class="mt-8">
                        <h3 class="text-lg font-semibold mb-4">Similar Products</h3>
                        <div class="grid grid-cols-2 md:grid-cols-4 gap-4">${(m.data||[]).map(J=>ProductCard.render(J)).join("")}</div>
                    </section>
                `;o.insertAdjacentHTML("beforeend",$)}if(v.success&&v.data?.length){let $=`
                    <section class="mt-8">
                        <h3 class="text-lg font-semibold mb-4">You May Also Like</h3>
                        <div class="grid grid-cols-2 md:grid-cols-4 gap-4">${(v.data||[]).map(J=>ProductCard.render(J)).join("")}</div>
                    </section>
                `;o.insertAdjacentHTML("beforeend",$)}ProductCard.bindEvents(o)}catch{}}function F(){if(!document.getElementById("product-detail")||typeof IntersectionObserver>"u")return;let o=new IntersectionObserver(u=>{u.forEach(m=>{if(!m.isIntersecting)return;let v=m.target;v.id,v.id==="reviews"||v.id,o.unobserve(v)})},{rootMargin:"200px"});document.querySelectorAll("#related-products, #reviews").forEach(u=>{o.observe(u)})}async function D(t){try{await ProductsAPI.trackView(t.id)}catch{}}function X(){n=null,e=null,s=null,i=!1}return{init:A,destroy:X}})();window.ProductPage=ar;_r=ar});var lr={};ne(lr,{default:()=>Mr});var ir,Mr,dr=se(()=>{ir=(function(){"use strict";let n="",e=1,s={},i=null,p=!1;async function b(){if(p)return;p=!0;let h=document.getElementById("search-results")||document.getElementById("products-grid");if(h&&h.querySelector(".product-card, [data-product-id]")){O(),L(),k(),w();return}n=Q(),s=ae(),e=parseInt(new URLSearchParams(window.location.search).get("page"))||1,await A(),O(),L(),k(),w()}function w(){let h=document.getElementById("view-grid"),a=document.getElementById("view-list");h?.addEventListener("click",()=>{h.classList.add("bg-primary-100","text-primary-700"),h.classList.remove("text-gray-400"),a?.classList.remove("bg-primary-100","text-primary-700"),a?.classList.add("text-gray-400"),Storage?.set("productViewMode","grid"),A()}),a?.addEventListener("click",()=>{a.classList.add("bg-primary-100","text-primary-700"),a.classList.remove("text-gray-400"),h?.classList.remove("bg-primary-100","text-primary-700"),h?.classList.add("text-gray-400"),Storage?.set("productViewMode","list"),A()})}async function A(){let h=document.getElementById("search-results")||document.getElementById("products-grid"),a=document.getElementById("results-count")||document.getElementById("product-count");if(h){i&&i.abort(),i=new AbortController,Loader.show(h,"skeleton");try{let r={page:e,pageSize:12,...s};if(n&&(r.search=n),window.location.pathname==="/categories/"){await H();return}let d=await ProductsApi.getProducts(r),c=Array.isArray(d)?d:d.data||d.results||[],f=d.meta||{};a&&(n?a.textContent=`${f.total||c.length} results for "${Templates.escapeHtml(n)}"`:a.textContent=`${f.total||c.length} products`),_(c,f),await Y()}catch(r){if(r.name==="AbortError")return;console.error("Failed to load products:",r),h.innerHTML='<p class="text-red-500 text-center py-8">Failed to load products. Please try again.</p>'}}}async function H(){let h=document.getElementById("search-results")||document.getElementById("products-grid"),a=document.getElementById("results-count")||document.getElementById("product-count"),r=document.getElementById("page-title");if(h)try{let l=await CategoriesApi.getCategories({limit:50}),d=Array.isArray(l)?l:l.data||l.results||[];if(r&&(r.textContent="All Categories"),a&&(a.textContent=`${d.length} categories`),d.length===0){h.innerHTML=`
                    <div class="text-center py-16">
                        <svg class="w-24 h-24 text-gray-300 mx-auto mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"/>
                        </svg>
                        <h2 class="text-2xl font-bold text-gray-900 mb-2">No categories found</h2>
                        <p class="text-gray-600">Check back later for new categories.</p>
                    </div>
                `;return}h.innerHTML=`
                <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                    ${d.map(c=>`
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
            `}catch(l){console.error("Failed to load categories:",l),h.innerHTML='<p class="text-red-500 text-center py-8">Failed to load categories. Please try again.</p>'}}function Q(){return new URLSearchParams(window.location.search).get("q")||""}function ae(){let h=new URLSearchParams(window.location.search),a={};return h.get("category")&&(a.category=h.get("category")),h.get("min_price")&&(a.minPrice=h.get("min_price")),h.get("max_price")&&(a.maxPrice=h.get("max_price")),h.get("ordering")&&(a.ordering=h.get("ordering")),h.get("in_stock")&&(a.inStock=h.get("in_stock")==="true"),h.get("sale")&&(a.onSale=h.get("sale")==="true"),h.get("featured")&&(a.featured=h.get("featured")==="true"),a}function O(){let h=document.getElementById("search-form"),a=document.getElementById("search-input");a&&(a.value=n),h?.addEventListener("submit",d=>{d.preventDefault();let c=a?.value.trim();c&&(n=c,e=1,B(),E())});let r=document.getElementById("search-suggestions"),l=null;a?.addEventListener("input",d=>{let c=d.target.value.trim();if(clearTimeout(l),c.length<2){r&&(r.innerHTML="",r.classList.add("hidden"));return}l=setTimeout(async()=>{try{let x=(await ProductsApi.search({q:c,limit:5})).data||[];r&&x.length>0&&(r.innerHTML=`
                            <div class="py-2">
                                ${x.map(P=>`
                                    <a href="/products/${P.slug}/" class="flex items-center gap-3 px-4 py-2 hover:bg-gray-50">
                                        ${P.image?`<img src="${P.image}" alt="" class="w-10 h-10 object-cover rounded" onerror="this.style.display='none'">`:'<div class="w-10 h-10 bg-gray-100 rounded flex items-center justify-center"><svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg></div>'}
                                        <div>
                                            <p class="text-sm font-medium text-gray-900">${Templates.escapeHtml(P.name)}</p>
                                            <p class="text-sm text-primary-600">${Templates.formatPrice(P.current_price??P.price_converted??P.price)}</p>
                                        </div>
                                    </a>
                                `).join("")}
                            </div>
                        `,r.classList.remove("hidden"))}catch(f){console.error("Search suggestions failed:",f)}},300)}),a?.addEventListener("blur",()=>{setTimeout(()=>{r&&r.classList.add("hidden")},200)})}async function E(){await A()}function _(h,a){let r=document.getElementById("search-results");if(!r)return;if(h.length===0){r.innerHTML=`
                <div class="text-center py-16">
                    <svg class="w-24 h-24 text-gray-300 mx-auto mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
                    </svg>
                    <h2 class="text-2xl font-bold text-gray-900 mb-2">No results found</h2>
                    <p class="text-gray-600 mb-4">We couldn't find any products matching "${Templates.escapeHtml(n)}"</p>
                    <p class="text-gray-500 text-sm">Try different keywords or browse our categories</p>
                </div>
            `;return}let l=Storage.get("productViewMode")||"grid",d=l==="list"?"space-y-4":"grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6";r.innerHTML=`
            <div class="${d}">
                ${h.map(f=>ProductCard.render(f,{layout:l})).join("")}
            </div>
            ${a.total_pages>1?`
                <div id="search-pagination" class="mt-8">${Pagination.render({currentPage:a.current_page||e,totalPages:a.total_pages,totalItems:a.total})}</div>
            `:""}
        `,ProductCard.bindEvents(r),document.getElementById("search-pagination")?.addEventListener("click",f=>{let x=f.target.closest("[data-page]");x&&(e=parseInt(x.dataset.page),B(),E(),window.scrollTo({top:0,behavior:"smooth"}))})}async function Y(){let h=document.getElementById("filter-categories");if(h)try{let r=(await CategoriesAPI.getAll({has_products:!0,limit:20})).data||[];h.innerHTML=`
                <div class="space-y-2">
                    <label class="flex items-center">
                        <input type="radio" name="category" value="" ${s.category?"":"checked"} class="text-primary-600 focus:ring-primary-500">
                        <span class="ml-2 text-sm text-gray-600">All Categories</span>
                    </label>
                    ${r.map(l=>`
                        <label class="flex items-center">
                            <input type="radio" name="category" value="${l.id}" ${s.category===String(l.id)?"checked":""} class="text-primary-600 focus:ring-primary-500">
                            <span class="ml-2 text-sm text-gray-600">${Templates.escapeHtml(l.name)}</span>
                        </label>
                    `).join("")}
                </div>
            `,S()}catch{}}function S(){document.querySelectorAll('input[name="category"]').forEach(a=>{a.addEventListener("change",r=>{r.target.value?s.category=r.target.value:delete s.category,e=1,B(),E()})})}function L(){let h=document.getElementById("apply-price-filter"),a=document.getElementById("filter-in-stock"),r=document.getElementById("clear-filters");h?.addEventListener("click",()=>{let c=document.getElementById("filter-min-price")?.value,f=document.getElementById("filter-max-price")?.value;c?s.min_price=c:delete s.min_price,f?s.max_price=f:delete s.max_price,e=1,B(),E()}),a?.addEventListener("change",c=>{c.target.checked?s.in_stock=!0:delete s.in_stock,e=1,B(),E()}),r?.addEventListener("click",()=>{s={},e=1,document.querySelectorAll('input[name="category"]').forEach(x=>{x.checked=x.value===""});let c=document.getElementById("filter-min-price"),f=document.getElementById("filter-max-price");c&&(c.value=""),f&&(f.value=""),a&&(a.checked=!1),B(),E()});let l=document.getElementById("filter-min-price"),d=document.getElementById("filter-max-price");l&&s.min_price&&(l.value=s.min_price),d&&s.max_price&&(d.value=s.max_price),a&&s.in_stock&&(a.checked=!0)}function k(){let h=document.getElementById("sort-select");h&&(h.value=s.ordering||"",h.addEventListener("change",a=>{a.target.value?s.ordering=a.target.value:delete s.ordering,e=1,B(),E()}))}function B(){let h=new URLSearchParams;n&&h.set("q",n),s.category&&h.set("category",s.category),s.min_price&&h.set("min_price",s.min_price),s.max_price&&h.set("max_price",s.max_price),s.ordering&&h.set("ordering",s.ordering),s.in_stock&&h.set("in_stock","true"),e>1&&h.set("page",e);let a=`${window.location.pathname}?${h.toString()}`;window.history.pushState({},"",a)}function I(){i&&(i.abort(),i=null),n="",e=1,s={},p=!1}return{init:b,destroy:I}})();window.SearchPage=ir;Mr=ir});var ur={};ne(ur,{default:()=>qr});var cr,qr,mr=se(()=>{cr=(function(){"use strict";let n=1,e="added_desc",s="all";function i(){return window.BUNORAA_CURRENCY?.symbol||"\u09F3"}let p={get CURRENCY_SYMBOL(){return i()},PRIORITY_LEVELS:{low:{label:"Low",color:"gray",icon:"\u25CB"},normal:{label:"Normal",color:"blue",icon:"\u25D0"},high:{label:"High",color:"amber",icon:"\u25CF"},urgent:{label:"Urgent",color:"red",icon:"\u2605"}}};async function b(){AuthGuard.protectPage()&&(await H(),O())}function w(L={}){let k=L.product||L||{},B=[L.product_image,k.product_image,k.primary_image,k.image,Array.isArray(k.images)?k.images[0]:null,k.image_url,k.thumbnail],I=h=>{if(!h)return"";if(typeof h=="string")return h;if(typeof h=="object"){if(typeof h.image=="string"&&h.image)return h.image;if(h.image&&typeof h.image=="object"){if(typeof h.image.url=="string"&&h.image.url)return h.image.url;if(typeof h.image.src=="string"&&h.image.src)return h.image.src}if(typeof h.url=="string"&&h.url)return h.url;if(typeof h.src=="string"&&h.src)return h.src}return""};for(let h of B){let a=I(h);if(a)return a}return""}function A(L={}){let k=L.product||L||{},B=x=>{if(x==null)return null;let P=Number(x);return Number.isFinite(P)?P:null},I=[L.product_price,k.price,L.price,L.current_price,L.price_at_add],h=null;for(let x of I)if(h=B(x),h!==null)break;let a=[L.product_sale_price,k.sale_price,L.sale_price],r=null;for(let x of a)if(r=B(x),r!==null)break;let l=B(L.lowest_price_seen),d=B(L.highest_price_seen),c=B(L.target_price),f=B(L.price_at_add);return{price:h!==null?h:0,salePrice:r!==null?r:null,lowestPrice:l,highestPrice:d,targetPrice:c,priceAtAdd:f}}async function H(){let L=document.getElementById("wishlist-container");if(L){Loader.show(L,"skeleton");try{let k=await WishlistApi.getWishlist({page:n,sort:e}),B=[],I={};Array.isArray(k)?B=k:k&&typeof k=="object"&&(B=k.data||k.results||k.items||[],!Array.isArray(B)&&k.data&&typeof k.data=="object"?(B=k.data.items||k.data.results||[],I=k.data.meta||k.meta||{}):I=k.meta||{}),Array.isArray(B)||(B=B&&typeof B=="object"?[B]:[]);let h=B;s==="on_sale"?h=B.filter(a=>{let r=A(a);return r.salePrice&&r.salePrice<r.price}):s==="in_stock"?h=B.filter(a=>a.is_in_stock!==!1):s==="price_drop"?h=B.filter(a=>{let r=A(a);return r.priceAtAdd&&r.price<r.priceAtAdd}):s==="at_target"&&(h=B.filter(a=>{let r=A(a);return r.targetPrice&&r.price<=r.targetPrice})),Q(h,B,I)}catch(k){let B=k&&(k.message||k.detail)||"Failed to load wishlist.";if(k&&k.status===401){AuthGuard.redirectToLogin();return}L.innerHTML=`<p class="text-red-500 text-center py-8">${Templates.escapeHtml(B)}</p>`}}}function Q(L,k,B){let I=document.getElementById("wishlist-container");if(!I)return;let h=k.length,a=k.filter(d=>{let c=A(d);return c.salePrice&&c.salePrice<c.price}).length,r=k.filter(d=>{let c=A(d);return c.priceAtAdd&&c.price<c.priceAtAdd}).length,l=k.filter(d=>{let c=A(d);return c.targetPrice&&c.price<=c.targetPrice}).length;if(h===0){I.innerHTML=`
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
            `;return}if(I.innerHTML=`
            <!-- Header with Stats -->
            <div class="mb-6">
                <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">My Wishlist</h1>
                        <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">${h} items saved</p>
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
                        <div class="text-2xl font-bold text-gray-900 dark:text-white">${h}</div>
                        <div class="text-xs text-gray-500 dark:text-gray-400">Total Items</div>
                    </div>
                    <div class="bg-white dark:bg-gray-800 rounded-lg p-3 border border-gray-200 dark:border-gray-700 ${a>0?"ring-2 ring-green-500":""}">
                        <div class="text-2xl font-bold text-green-600 dark:text-green-400">${a}</div>
                        <div class="text-xs text-gray-500 dark:text-gray-400">On Sale</div>
                    </div>
                    <div class="bg-white dark:bg-gray-800 rounded-lg p-3 border border-gray-200 dark:border-gray-700 ${r>0?"ring-2 ring-blue-500":""}">
                        <div class="text-2xl font-bold text-blue-600 dark:text-blue-400">${r}</div>
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
                    <button class="filter-btn px-3 py-1.5 text-sm rounded-lg transition-colors ${s==="all"?"bg-primary-600 text-white":"bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300"}" data-filter="all">All</button>
                    <button class="filter-btn px-3 py-1.5 text-sm rounded-lg transition-colors ${s==="on_sale"?"bg-primary-600 text-white":"bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300"}" data-filter="on_sale">On Sale</button>
                    <button class="filter-btn px-3 py-1.5 text-sm rounded-lg transition-colors ${s==="in_stock"?"bg-primary-600 text-white":"bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300"}" data-filter="in_stock">In Stock</button>
                    <button class="filter-btn px-3 py-1.5 text-sm rounded-lg transition-colors ${s==="price_drop"?"bg-primary-600 text-white":"bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300"}" data-filter="price_drop">Price Drop</button>
                    <button class="filter-btn px-3 py-1.5 text-sm rounded-lg transition-colors ${s==="at_target"?"bg-primary-600 text-white":"bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300"}" data-filter="at_target">At Target</button>
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
                ${L.map(d=>ae(d)).join("")}
            </div>
            
            ${L.length===0&&h>0?`
                <div class="text-center py-12">
                    <p class="text-gray-500 dark:text-gray-400">No items match the selected filter.</p>
                    <button class="mt-4 text-primary-600 hover:underline" onclick="document.querySelector('[data-filter=all]').click()">Show all items</button>
                </div>
            `:""}
            
            ${B.total_pages>1?'<div id="wishlist-pagination" class="mt-8"></div>':""}
        `,B&&B.total_pages>1){let d=document.getElementById("wishlist-pagination");if(d&&window.Pagination){let c=new window.Pagination({totalPages:B.total_pages,currentPage:B.current_page||n,className:"justify-center",onChange:f=>{n=f,H(),window.scrollTo({top:0,behavior:"smooth"})}});d.innerHTML="",d.appendChild(c.create())}}E()}function ae(L){try{let k=L.product||L||{},B=L.product_name||k.name||"",I=L.product_slug||k.slug||"",h=L.is_in_stock!==void 0?L.is_in_stock:k.is_in_stock!==void 0?k.is_in_stock:k.stock_quantity>0,a=w(L||{}),r=!!L.product_has_variants,l={price:0,salePrice:null,lowestPrice:null,highestPrice:null,targetPrice:null,priceAtAdd:null};try{l=A(L||{})}catch{l={price:0,salePrice:null}}let{price:d,salePrice:c,lowestPrice:f,highestPrice:x,targetPrice:P,priceAtAdd:G}=l,te=c||d,me=G&&te<G,ye=G?Math.round((te-G)/G*100):0,xe=P&&te<=P,be=c&&c<d,Ee=L.priority||"normal",we=p.PRIORITY_LEVELS[Ee]||p.PRIORITY_LEVELS.normal,pe=M=>{try{return Templates.escapeHtml(M||"")}catch{return String(M||"")}},ve=M=>{try{return Price.render({price:M.price,salePrice:M.salePrice})}catch{return`<span class="font-bold">${p.CURRENCY_SYMBOL}${M.price||0}</span>`}},y=M=>{try{return Templates.formatPrice(M)}catch{return`${p.CURRENCY_SYMBOL}${M}`}},C=k&&k.aspect&&(k.aspect.css||(k.aspect.width&&k.aspect.height?`${k.aspect.width}/${k.aspect.height}`:null))||"1/1";return`
                <div class="wishlist-item relative bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden group" 
                     data-item-id="${L&&L.id?L.id:""}" 
                     data-product-id="${k&&k.id?k.id:L&&L.product?L.product:""}" 
                     data-product-slug="${pe(I)}" 
                     data-product-has-variants="${r}"
                     data-priority="${Ee}">
                    
                    <!-- Image Section -->
                    <div class="relative" style="aspect-ratio: ${C};">
                        <!-- Badges -->
                        <div class="absolute top-2 left-2 z-10 flex flex-col gap-1">
                            ${be?`
                                <div class="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
                                    -${Math.round((1-c/d)*100)}%
                                </div>
                            `:""}
                            ${me?`
                                <div class="bg-blue-500 text-white text-xs font-bold px-2 py-1 rounded flex items-center">
                                    <svg class="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
                                    </svg>
                                    ${Math.abs(ye)}% drop
                                </div>
                            `:""}
                            ${xe?`
                                <div class="bg-amber-500 text-white text-xs font-bold px-2 py-1 rounded flex items-center">
                                    <svg class="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                                    </svg>
                                    Target!
                                </div>
                            `:""}
                            ${h?"":`
                                <div class="bg-gray-800 text-white text-xs font-bold px-2 py-1 rounded">
                                    Out of Stock
                                </div>
                            `}
                        </div>
                        
                        <!-- Priority Indicator -->
                        <div class="absolute top-2 right-12 z-10">
                            <button class="priority-btn w-8 h-8 rounded-full bg-white dark:bg-gray-700 shadow-md flex items-center justify-center text-${we.color}-500 hover:scale-110 transition-transform" title="Priority: ${we.label}" data-item-id="${L.id}">
                                <span class="text-sm">${we.icon}</span>
                            </button>
                        </div>
                        
                        <!-- Remove Button -->
                        <button class="remove-btn absolute top-2 right-2 z-20 w-8 h-8 bg-gray-900/80 text-white rounded-full shadow-lg flex items-center justify-center hover:bg-red-600 transition-colors opacity-0 group-hover:opacity-100" aria-label="Remove from wishlist">
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                            </svg>
                        </button>
                        
                        <!-- Product Image -->
                        <a href="/products/${pe(I)}/">
                            ${a?`
                                <img 
                                    src="${a}" 
                                    alt="${pe(B)}"
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
                        ${k&&k.category?`
                            <a href="/categories/${pe(k.category.slug)}/" class="text-xs text-gray-500 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400">
                                ${pe(k.category.name)}
                            </a>
                        `:""}
                        <h3 class="font-medium text-gray-900 dark:text-white mt-1 line-clamp-2">
                            <a href="/products/${pe(I)}/" class="hover:text-primary-600 dark:hover:text-primary-400">
                                ${pe(B)}
                            </a>
                        </h3>
                        
                        <!-- Price Section -->
                        <div class="mt-2">
                            ${ve({price:d,salePrice:c})}
                        </div>
                        
                        <!-- Price History -->
                        ${f||P?`
                            <div class="mt-2 text-xs space-y-1">
                                ${f?`
                                    <div class="flex items-center justify-between text-gray-500 dark:text-gray-400">
                                        <span>Lowest:</span>
                                        <span class="font-medium text-green-600 dark:text-green-400">${y(f)}</span>
                                    </div>
                                `:""}
                                ${P?`
                                    <div class="flex items-center justify-between text-gray-500 dark:text-gray-400">
                                        <span>Target:</span>
                                        <span class="font-medium text-amber-600 dark:text-amber-400">${y(P)}</span>
                                    </div>
                                `:""}
                            </div>
                        `:""}
                        
                        <!-- Rating -->
                        ${k&&k.average_rating?`
                            <div class="flex items-center gap-1 mt-2">
                                ${Templates.renderStars(k.average_rating)}
                                <span class="text-xs text-gray-500 dark:text-gray-400">(${k.review_count||0})</span>
                            </div>
                        `:""}
                        
                        <!-- Actions -->
                        <div class="mt-4 flex gap-2">
                            <button 
                                class="add-to-cart-btn flex-1 px-3 py-2 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors text-sm flex items-center justify-center"
                                ${h?"":"disabled"}
                            >
                                <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path>
                                </svg>
                                ${r?"Options":h?"Add":"Sold Out"}
                            </button>
                            <button class="set-target-btn px-3 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-sm" title="Set target price" data-item-id="${L.id}" data-current-price="${te}">
                                <svg class="w-4 h-4" fill="${P?"currentColor":"none"}" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path>
                                </svg>
                            </button>
                        </div>
                    </div>
                    
                    <!-- Added Date -->
                    ${L&&L.added_at?`
                        <div class="px-4 pb-3 border-t border-gray-100 dark:border-gray-700 pt-3">
                            <p class="text-xs text-gray-400 dark:text-gray-500">Added ${Templates.formatDate(L.added_at)}</p>
                        </div>
                    `:""}
                </div>
            `}catch(k){return console.error("Failed to render wishlist item:",k),'<div class="p-4 bg-white dark:bg-gray-800 rounded shadow text-gray-500 dark:text-gray-400">Failed to render item</div>'}}function O(){document.getElementById("wishlist-sort")?.addEventListener("change",L=>{e=L.target.value,H()}),document.querySelectorAll(".filter-btn").forEach(L=>{L.addEventListener("click",()=>{s=L.dataset.filter,H()})})}function E(){let L=document.getElementById("clear-wishlist-btn"),k=document.getElementById("add-all-to-cart-btn"),B=document.getElementById("share-wishlist-btn"),I=document.querySelectorAll(".wishlist-item"),h=document.getElementById("wishlist-sort"),a=document.querySelectorAll(".filter-btn");h?.addEventListener("change",r=>{e=r.target.value,H()}),a.forEach(r=>{r.addEventListener("click",()=>{s=r.dataset.filter,H()})}),L?.addEventListener("click",async()=>{if(await Modal.confirm({title:"Clear Wishlist",message:"Are you sure you want to remove all items from your wishlist?",confirmText:"Clear All",cancelText:"Cancel"}))try{await WishlistApi.clear(),Toast.success("Wishlist cleared."),await H()}catch(l){Toast.error(l.message||"Failed to clear wishlist.")}}),k?.addEventListener("click",async()=>{let r=k;r.disabled=!0,r.innerHTML='<svg class="animate-spin w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>Adding...';try{let l=document.querySelectorAll('.wishlist-item:not([data-product-has-variants="true"])'),d=0,c=0;for(let f of l){let x=f.dataset.productId;if(x)try{await CartApi.addItem(x,1),d++}catch{c++}}d>0&&(Toast.success(`Added ${d} items to cart!`),document.dispatchEvent(new CustomEvent("cart:updated"))),c>0&&Toast.warning(`${c} items could not be added (may require variant selection).`)}catch(l){Toast.error(l.message||"Failed to add items to cart.")}finally{r.disabled=!1,r.innerHTML='<svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>Add All to Cart'}}),B?.addEventListener("click",async()=>{try{let r=`${window.location.origin}/wishlist/share/`;navigator.share?await navigator.share({title:"My Wishlist",text:"Check out my wishlist!",url:r}):(await navigator.clipboard.writeText(r),Toast.success("Wishlist link copied to clipboard!"))}catch(r){r.name!=="AbortError"&&Toast.error("Failed to share wishlist.")}}),I.forEach(r=>{let l=r.dataset.itemId,d=r.dataset.productId,c=r.dataset.productSlug;r.querySelector(".remove-btn")?.addEventListener("click",async()=>{try{await WishlistApi.removeItem(l),Toast.success("Removed from wishlist."),r.remove(),document.querySelectorAll(".wishlist-item").length===0&&await H()}catch(f){Toast.error(f.message||"Failed to remove item.")}}),r.querySelector(".priority-btn")?.addEventListener("click",async()=>{let f=["low","normal","high","urgent"],x=r.dataset.priority||"normal",P=f.indexOf(x),G=f[(P+1)%f.length];try{WishlistApi.updateItem&&await WishlistApi.updateItem(l,{priority:G}),r.dataset.priority=G;let te=r.querySelector(".priority-btn"),me=p.PRIORITY_LEVELS[G];te.title=`Priority: ${me.label}`,te.innerHTML=`<span class="text-sm">${me.icon}</span>`,te.className=`priority-btn w-8 h-8 rounded-full bg-white dark:bg-gray-700 shadow-md flex items-center justify-center text-${me.color}-500 hover:scale-110 transition-transform`,Toast.success(`Priority set to ${me.label}`)}catch{Toast.error("Failed to update priority.")}}),r.querySelector(".set-target-btn")?.addEventListener("click",async()=>{let f=parseFloat(r.querySelector(".set-target-btn").dataset.currentPrice)||0,x=`
                    <div class="space-y-4">
                        <p class="text-sm text-gray-600 dark:text-gray-400">Set a target price and we'll notify you when the item drops to or below this price.</p>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Current Price</label>
                            <div class="text-lg font-bold text-gray-900 dark:text-white">${p.CURRENCY_SYMBOL}${f.toLocaleString()}</div>
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Target Price</label>
                            <div class="flex items-center">
                                <span class="text-gray-500 mr-2">${p.CURRENCY_SYMBOL}</span>
                                <input type="number" id="target-price-input" value="${Math.round(f*.9)}" min="1" max="${f}" class="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-primary-500 focus:border-primary-500">
                            </div>
                            <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">Suggested: ${p.CURRENCY_SYMBOL}${Math.round(f*.9).toLocaleString()} (10% off)</p>
                        </div>
                    </div>
                `,P=await Modal.open({title:"Set Target Price",content:x,confirmText:"Set Alert",cancelText:"Cancel",onConfirm:async()=>{let G=parseFloat(document.getElementById("target-price-input").value);if(!G||G<=0)return Toast.error("Please enter a valid target price."),!1;try{return WishlistApi.updateItem&&await WishlistApi.updateItem(l,{target_price:G}),Toast.success(`Price alert set for ${p.CURRENCY_SYMBOL}${G.toLocaleString()}`),await H(),!0}catch{return Toast.error("Failed to set price alert."),!1}}})}),r.querySelector(".add-to-cart-btn")?.addEventListener("click",async f=>{let x=f.target.closest(".add-to-cart-btn");if(x.disabled)return;x.disabled=!0;let P=x.innerHTML;if(x.innerHTML='<svg class="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>',r.dataset.productHasVariants==="true"||r.dataset.productHasVariants==="True"||r.dataset.productHasVariants==="1"){Y(r),x.disabled=!1,x.innerHTML=P;return}try{await CartApi.addItem(d,1),Toast.success("Added to cart!"),document.dispatchEvent(new CustomEvent("cart:updated"))}catch(te){if(!!(te&&(te.errors&&te.errors.variant_id||te.message&&typeof te.message=="string"&&te.message.toLowerCase().includes("variant")))&&(Toast.info("This product requires selecting a variant."),c)){window.location.href=`/products/${c}/`;return}Toast.error(te.message||"Failed to add to cart.")}finally{x.disabled=!1,x.innerHTML=P}})})}function _(L){let k={};return L.forEach(B=>{k[B.attribute_name]||(k[B.attribute_name]=[]),k[B.attribute_name].push(B)}),Object.entries(k).map(([B,I])=>`
            <div class="mt-4">
                <label class="text-sm font-medium text-gray-700">${Templates.escapeHtml(B)}:</label>
                <div class="flex flex-wrap gap-2 mt-2" id="wishlist-variant-group-${Templates.slugify(B)}">
                    ${I.map((h,a)=>`
                        <button type="button" class="wishlist-modal-variant-btn px-3 py-2 border rounded-lg text-sm transition-colors ${a===0?"border-primary-500 bg-primary-50 text-primary-700":"border-gray-300 hover:border-gray-400"}" data-variant-id="${h.id}" data-price="${h.price_converted??h.price??""}" data-stock="${h.stock_quantity||0}">
                            ${Templates.escapeHtml(h.value)}
                            ${h.price_converted??h.price?`<span class="text-xs text-gray-500"> (${Templates.formatPrice(h.price_converted??h.price)})</span>`:""}
                        </button>
                    `).join("")}
                </div>
            </div>
        `).join("")}async function Y(L){let k=L.product_slug||L.dataset?.productSlug||"",B=L.product||L.dataset?.productId||"";try{let I;if(typeof ProductsApi<"u"&&ProductsApi.getProduct)I=await ProductsApi.getProduct(k||B);else{let c=window.BUNORAA_CURRENCY&&window.BUNORAA_CURRENCY.code||void 0;I=await ApiClient.get(`/catalog/products/${k||B}/`,{currency:c})}if(!I||!I.success||!I.data){let c=I&&I.message?I.message:"Failed to load product variants.";Toast.error(c);return}let h=I.data,a=h.variants||[];if(!a.length){window.location.href=`/products/${h.slug||k||B}/`;return}let r=h.images?.[0]?.image||h.primary_image||h.image||"",l=`
                <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div class="col-span-1">
                        ${r?`<img src="${r}" class="w-full h-48 object-cover rounded" alt="${Templates.escapeHtml(h.name)}">`:'<div class="w-full h-48 bg-gray-100 rounded"></div>'}
                    </div>
                    <div class="col-span-2">
                        <h3 class="text-lg font-semibold">${Templates.escapeHtml(h.name)}</h3>
                        <div id="wishlist-variant-price" class="mt-2 text-lg font-bold">${Templates.formatPrice(a?.[0]?.price_converted??a?.[0]?.price??h.price)}</div>
                        <div id="wishlist-variant-options" class="mt-4">
                            ${_(a)}
                        </div>
                        <div class="mt-4 flex items-center gap-2">
                            <label class="text-sm text-gray-700">Qty</label>
                            <input id="wishlist-variant-qty" type="number" value="1" min="1" class="w-20 px-3 py-2 border rounded" />
                        </div>
                    </div>
                </div>
            `,d=await Modal.open({title:"Select Variant",content:l,confirmText:"Add to Cart",cancelText:"Cancel",size:"md",onConfirm:async()=>{let f=document.querySelector(".wishlist-modal-variant-btn.border-primary-500")||document.querySelector(".wishlist-modal-variant-btn");if(!f)return Toast.error("Please select a variant."),!1;let x=f.dataset.variantId,P=parseInt(document.getElementById("wishlist-variant-qty")?.value)||1;try{return await CartApi.addItem(h.id,P,x),Toast.success("Added to cart!"),document.dispatchEvent(new CustomEvent("cart:updated")),!0}catch(G){return Toast.error(G.message||"Failed to add to cart."),!1}}});setTimeout(()=>{let c=document.querySelectorAll(".wishlist-modal-variant-btn");c.forEach(x=>{x.addEventListener("click",()=>{c.forEach(G=>G.classList.remove("border-primary-500","bg-primary-50","text-primary-700")),x.classList.add("border-primary-500","bg-primary-50","text-primary-700");let P=x.dataset.price;if(P!==void 0){let G=document.getElementById("wishlist-variant-price");G&&(G.textContent=Templates.formatPrice(P))}})});let f=document.querySelector(".wishlist-modal-variant-btn");f&&f.click()},20)}catch{Toast.error("Failed to load variants.")}}function S(){n=1}return{init:b,destroy:S}})();window.WishlistPage=cr;qr=cr});var Pr,ut=se(()=>{Pr=pt({"./pages/account.js":()=>Promise.resolve().then(()=>(Ms(),_s)),"./pages/cart.js":()=>Promise.resolve().then(()=>(Hs(),Ps)),"./pages/category.js":()=>Promise.resolve().then(()=>(Fs(),Ns)),"./pages/checkout.js":()=>Promise.resolve().then(()=>(Os(),Rs)),"./pages/contact.js":()=>Promise.resolve().then(()=>(Us(),Vs)),"./pages/faq.js":()=>Promise.resolve().then(()=>(Qs(),Ys)),"./pages/home.js":()=>Promise.resolve().then(()=>(Zs(),Ks)),"./pages/orders.js":()=>Promise.resolve().then(()=>(sr(),tr)),"./pages/preorders.js":()=>Promise.resolve().then(()=>vr(rr())),"./pages/product.js":()=>Promise.resolve().then(()=>(or(),nr)),"./pages/search.js":()=>Promise.resolve().then(()=>(dr(),lr)),"./pages/wishlist.js":()=>Promise.resolve().then(()=>(mr(),ur))})});var Hr=gt(()=>{Bs();ut();var mt=(function(){"use strict";let n={},e=null,s=null;async function i(I){try{let h=await Pr(`./pages/${I}.js`);return h.default||h}catch(h){return console.warn(`Page controller for ${I} not found:`,h),null}}function p(){H(),Q(),ae(),O(),b(),Y(),L(),k();try{let I=performance.getEntriesByType?performance.getEntriesByType("navigation"):[],h=I&&I[0]||null;h&&h.type==="navigate"&&!window.location.hash&&setTimeout(()=>{let a=document.scrollingElement||document.documentElement;if(!a)return;let r=a.scrollTop||window.pageYOffset||0,l=Math.max(0,a.scrollHeight-window.innerHeight);r>Math.max(100,l*.6)&&window.scrollTo({top:0,behavior:"auto"})},60)}catch{}}async function b(){try{if(!AuthApi.isAuthenticated()){let r=localStorage.getItem("wishlist");if(r){let l=JSON.parse(r);WishlistApi.updateBadge(l);let d=l.items||l.data&&l.data.items||[];A(d)}else A([]);return}let h=(await WishlistApi.getWishlist({pageSize:200})).data||{},a=h.items||h.data||[];WishlistApi.updateBadge(h),A(a)}catch{try{let h=localStorage.getItem("wishlist");if(h){let a=JSON.parse(h);WishlistApi.updateBadge(a);let r=a.items||a.data&&a.data.items||[];A(r)}}catch{}}}let w=[];function A(I){try{w=I||[];let h={},a={};(I||[]).forEach(r=>{let l=r.product||r.product_id||r.product&&r.product.id||null,d=r.product_slug||r.product&&r.product.slug||null,c=r.id||r.pk||r.uuid||r.item||null;l&&(h[String(l)]=c||!0),d&&(a[String(d)]=c||!0)}),document.querySelectorAll(".wishlist-btn").forEach(r=>{try{let l=r.querySelector("svg"),d=l?.querySelector(".heart-fill"),c=r.dataset.productId||r.closest("[data-product-id]")?.dataset.productId,f=r.dataset.productSlug||r.closest("[data-product-slug]")?.dataset.productSlug,x=null;c&&h.hasOwnProperty(String(c))?x=h[String(c)]:f&&a.hasOwnProperty(String(f))&&(x=a[String(f)]),x?(r.dataset.wishlistItemId=x,r.classList.add("text-red-500"),r.setAttribute("aria-pressed","true"),l?.classList.add("fill-current"),d&&(d.style.opacity="1")):(r.removeAttribute("data-wishlist-item-id"),r.classList.remove("text-red-500"),r.setAttribute("aria-pressed","false"),l?.classList.remove("fill-current"),d&&(d.style.opacity="0"))}catch{}})}catch{}}(function(){if(typeof MutationObserver>"u")return;let I=null;new MutationObserver(function(a){let r=!1;for(let l of a){if(l.addedNodes&&l.addedNodes.length){for(let d of l.addedNodes)if(d.nodeType===1&&(d.matches?.(".product-card")||d.querySelector?.(".product-card")||d.querySelector?.(".wishlist-btn"))){r=!0;break}}if(r)break}r&&(clearTimeout(I),I=setTimeout(()=>{try{A(w)}catch{}},150))}).observe(document.body,{childList:!0,subtree:!0})})();function H(){let I=window.location.pathname,h=document.body;if(h.dataset.page){e=h.dataset.page;return}if((I.startsWith("/accounts/")||I.startsWith("/account/"))&&!(I.startsWith("/accounts/profile")||I.startsWith("/account/profile"))){e=null;return}I==="/"||I==="/home/"?e="home":I==="/categories/"||I==="/products/"?e="search":I.startsWith("/categories/")&&I!=="/categories/"?e="category":I.startsWith("/products/")&&I!=="/products/"?e="product":I==="/search/"||I.startsWith("/search")?e="search":I.startsWith("/cart")?e="cart":I.startsWith("/checkout")?e="checkout":I==="/account"||I.startsWith("/account/")||I.startsWith("/accounts/profile")?e="account":I.startsWith("/orders")?e="orders":I.startsWith("/wishlist")?e="wishlist":I.startsWith("/contact")&&(e="contact")}function Q(){typeof Tabs<"u"&&document.querySelector("[data-tabs]")&&Tabs.init(),typeof Dropdown<"u"&&document.querySelectorAll("[data-dropdown-trigger]").forEach(I=>{let h=I.dataset.dropdownTarget,a=document.getElementById(h);a&&Dropdown.create(I,{content:a.innerHTML})});try{As()}catch{}}async function ae(){if(!e)return;try{s&&typeof s.destroy=="function"&&s.destroy()}catch{}let I=await i(e);if(I&&typeof I.init=="function"){s=I;try{await s.init()}catch(h){console.error("failed to init page controller",h)}}}try{"serviceWorker"in navigator&&navigator.serviceWorker.register("/static/js/sw.js").catch(()=>{})}catch{}async function O(){if(document.querySelectorAll("[data-cart-count]").length)try{let a=(await CartApi.getCart()).data?.item_count||0;try{localStorage.setItem("cart",JSON.stringify({item_count:a,savedAt:Date.now()}))}catch{}_(a)}catch{try{let a=localStorage.getItem("cart");if(a){let l=JSON.parse(a)?.item_count||0;_(l);return}}catch(a){console.error("Failed to get cart count fallback:",a)}}}async function E(I){try{return(((await WishlistApi.getWishlist({pageSize:200})).data||{}).items||[]).find(d=>String(d.product)===String(I))?.id||null}catch{return null}}function _(I){document.querySelectorAll("[data-cart-count]").forEach(a=>{a.textContent=I>99?"99+":I,a.classList.toggle("hidden",I===0)})}function Y(){document.addEventListener("cart:updated",async()=>{await O()}),document.addEventListener("wishlist:updated",async()=>{await b()}),document.addEventListener("auth:login",()=>{S(!0)}),document.addEventListener("auth:logout",()=>{S(!1)}),document.querySelectorAll(".wishlist-btn").forEach(h=>{try{let a=h.querySelector("svg"),r=a?.querySelector(".heart-fill");h.classList.contains("text-red-500")?(a?.classList.add("fill-current"),r&&(r.style.opacity="1")):r&&(r.style.opacity="0")}catch{}}),document.addEventListener("click",async h=>{let a=h.target.closest("[data-quick-add], [data-add-to-cart], .add-to-cart-btn");if(a){h.preventDefault();let r=a.dataset.productId||a.dataset.quickAdd||a.dataset.addToCart;if(!r)return;a.disabled=!0;let l=a.innerHTML;a.innerHTML='<svg class="animate-spin h-4 w-4 mx-auto" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>';try{await CartApi.addItem(r,1),Toast.success("Added to cart!"),document.dispatchEvent(new CustomEvent("cart:updated"))}catch(d){Toast.error(d.message||"Failed to add to cart.")}finally{a.disabled=!1,a.innerHTML=l}}}),document.addEventListener("click",async h=>{let a=h.target.closest("[data-wishlist-toggle], .wishlist-btn");if(a){if(h.preventDefault(),!AuthApi.isAuthenticated()){Toast.warning("Please login to add items to your wishlist."),window.location.href="/account/login/?next="+encodeURIComponent(window.location.pathname);return}let r=a.dataset.wishlistToggle||a.dataset.productId||a.closest("[data-product-id]")?.dataset.productId;a.disabled=!0;let l=a.dataset.wishlistItemId||"";!l&&a.classList.contains("text-red-500")&&(l=await E(r)||"");let c=a.classList.contains("text-red-500")&&l;try{if(c){let f=await WishlistApi.removeItem(l);a.classList.remove("text-red-500"),a.setAttribute("aria-pressed","false"),a.querySelector("svg")?.classList.remove("fill-current");let x=a.querySelector("svg")?.querySelector(".heart-fill");x&&(x.style.opacity="0"),a.removeAttribute("data-wishlist-item-id"),Toast.success("Removed from wishlist.")}else{let f=await WishlistApi.addItem(r),x=f.data?.id||f.data?.item?.id||await E(r);x&&(a.dataset.wishlistItemId=x),a.classList.add("text-red-500"),a.setAttribute("aria-pressed","true"),a.querySelector("svg")?.classList.add("fill-current");let P=a.querySelector("svg")?.querySelector(".heart-fill");P&&(P.style.opacity="1"),Toast.success(f.message||"Added to wishlist!")}}catch(f){console.error("wishlist:error",f),Toast.error(f.message||"Failed to update wishlist.")}finally{a.disabled=!1}}}),document.addEventListener("click",h=>{let a=h.target.closest("[data-quick-view], .quick-view-btn");if(a){h.preventDefault();let r=a.dataset.quickView||a.dataset.productId,l=a.dataset.productSlug;l?window.location.href=`/products/${l}/`:r&&(typeof Modal<"u"&&Modal.showQuickView?Modal.showQuickView(r):window.location.href=`/products/${r}/`)}}),document.addEventListener("click",async h=>{if(h.target.closest("[data-logout]")){h.preventDefault();try{await AuthApi.logout(),Toast.success("Logged out successfully."),document.dispatchEvent(new CustomEvent("auth:logout")),window.location.href="/"}catch{Toast.error("Failed to logout.")}}});let I=document.getElementById("back-to-top");I&&(window.addEventListener("scroll",Debounce.throttle(()=>{window.scrollY>500?I.classList.remove("opacity-0","pointer-events-none"):I.classList.add("opacity-0","pointer-events-none")},100)),I.addEventListener("click",()=>{window.scrollTo({top:0,behavior:"smooth"})}))}function S(I){document.querySelectorAll("[data-auth-state]").forEach(a=>{let r=a.dataset.authState;r==="logged-in"?a.classList.toggle("hidden",!I):r==="logged-out"&&a.classList.toggle("hidden",I)})}function L(){let I=document.getElementById("mobile-menu-btn"),h=document.getElementById("close-mobile-menu"),a=document.getElementById("mobile-menu"),r=document.getElementById("mobile-menu-overlay");function l(){a?.classList.remove("translate-x-full"),r?.classList.remove("hidden"),document.body.classList.add("overflow-hidden")}function d(){a?.classList.add("translate-x-full"),r?.classList.add("hidden"),document.body.classList.remove("overflow-hidden")}I?.addEventListener("click",l),h?.addEventListener("click",d),r?.addEventListener("click",d)}function k(){let I=document.querySelector("[data-language-selector]"),h=document.getElementById("language-dropdown");I&&h&&(Dropdown.create(I,h),h.querySelectorAll("[data-language]").forEach(a=>{a.addEventListener("click",async()=>{let r=a.dataset.language;try{await LocalizationApi.setLanguage(r),Storage.set("language",r),window.location.reload()}catch{Toast.error("Failed to change language.")}})}))}function B(){s&&typeof s.destroy=="function"&&s.destroy(),e=null,s=null}return{init:p,destroy:B,getCurrentPage:()=>e,updateCartBadge:_}})();document.readyState==="loading"?document.addEventListener("DOMContentLoaded",mt.init):mt.init();window.App=mt});Hr();})();
//# sourceMappingURL=app.bundle.js.map
