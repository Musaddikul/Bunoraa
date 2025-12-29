(()=>{var Ms=Object.create;var X=Object.defineProperty;var qs=Object.getOwnPropertyDescriptor;var js=Object.getOwnPropertyNames;var Fs=Object.getPrototypeOf,zs=Object.prototype.hasOwnProperty;var Se=r=>e=>{var t=r[e];if(t)return t();throw new Error("Module not found in bundle: "+e)};var M=(r,e)=>()=>(r&&(e=r(r=0)),e);var He=(r,e)=>()=>(e||r((e={exports:{}}).exports,e),e.exports),F=(r,e)=>{for(var t in e)X(r,t,{get:e[t],enumerable:!0})},Os=(r,e,t,a)=>{if(e&&typeof e=="object"||typeof e=="function")for(let u of js(e))!zs.call(r,u)&&u!==t&&X(r,u,{get:()=>e[u],enumerable:!(a=qs(e,u))||a.enumerable});return r};var Rs=(r,e,t)=>(t=r!=null?Ms(Fs(r)):{},Os(e||!r||!r.__esModule?X(t,"default",{value:r,enumerable:!0}):t,r));function _(...r){return r.flat().filter(e=>e&&typeof e=="string").join(" ")}function S(r="div",{id:e="",className:t="",attrs:a={},html:u="",text:h=""}={}){let b=document.createElement(r);return e&&(b.id=e),t&&(b.className=t),h&&(b.textContent=h),u&&(b.innerHTML=u),Object.entries(a).forEach(([w,A])=>{A===!0?b.setAttribute(w,""):A!==!1&&A!==null&&b.setAttribute(w,A)}),b}function Pe(r,e,t,a={}){if(r)return r.addEventListener(e,t,a),()=>r.removeEventListener(e,t,a)}function G(r){let e=r.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'),t=e[0],a=e[e.length-1];return{init(){r.addEventListener("keydown",u=>{u.key==="Tab"&&(u.shiftKey?document.activeElement===t&&(u.preventDefault(),a.focus()):document.activeElement===a&&(u.preventDefault(),t.focus()))})},destroy(){}}}function Ne(){return"id-"+Math.random().toString(36).substr(2,9)+Date.now().toString(36)}function W(r=""){return S("div",{className:_("fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity duration-200",r),attrs:{"data-backdrop":"true"}})}var Y,z=M(()=>{Y={isEnter:r=>r.key==="Enter",isEscape:r=>r.key==="Escape",isArrowUp:r=>r.key==="ArrowUp",isArrowDown:r=>r.key==="ArrowDown",isArrowLeft:r=>r.key==="ArrowLeft",isArrowRight:r=>r.key==="ArrowRight",isSpace:r=>r.key===" ",isTab:r=>r.key==="Tab"}});var H,O=M(()=>{z();H=class r{constructor(e={}){this.id=e.id||Ne(),this.element=null,this.listeners=[],this.isInitialized=!1,this.config=e}create(e="div",{className:t="",attrs:a={},html:u=""}={}){return this.element=S(e,{id:this.id,className:t,attrs:a,html:u}),this.element}mount(e){if(!this.element)return!1;let t=typeof e=="string"?document.querySelector(e):e;return t?(t.appendChild(this.element),this.isInitialized=!0,!0):!1}on(e,t,a={}){if(!this.element)return;let u=Pe(this.element,e,t,a);return this.listeners.push(u),u}delegate(e,t,a){if(!this.element)return;let u=h=>{let b=h.target.closest(e);b&&a.call(b,h)};this.element.addEventListener(t,u),this.listeners.push(()=>this.element.removeEventListener(t,u))}addClass(...e){this.element&&this.element.classList.add(...e)}removeClass(...e){this.element&&this.element.classList.remove(...e)}toggleClass(e,t){this.element&&this.element.classList.toggle(e,t)}hasClass(e){return this.element?.classList.contains(e)??!1}attr(e,t){if(this.element){if(t===void 0)return this.element.getAttribute(e);t===null||t===!1?this.element.removeAttribute(e):t===!0?this.element.setAttribute(e,""):this.element.setAttribute(e,t)}}attrs(e){Object.entries(e).forEach(([t,a])=>{this.attr(t,a)})}text(e){this.element&&(this.element.textContent=e)}html(e){this.element&&(this.element.innerHTML=e)}append(e){this.element&&e&&this.element.appendChild(e instanceof r?e.element:e)}prepend(e){this.element&&e&&this.element.prepend(e instanceof r?e.element:e)}show(){this.element&&(this.element.style.display="",this.element.removeAttribute("hidden"))}hide(){this.element&&(this.element.style.display="none")}toggle(e){this.element&&(e===void 0&&(e=this.element.style.display==="none"),e?this.show():this.hide())}getStyle(e){return this.element?window.getComputedStyle(this.element).getPropertyValue(e):null}setStyle(e,t){this.element&&(this.element.style[e]=t)}setStyles(e){Object.entries(e).forEach(([t,a])=>{this.setStyle(t,a)})}focus(e){if(this.element)try{typeof e>"u"?this.element.focus({preventScroll:!0}):this.element.focus(e)}catch{try{this.element.focus()}catch{}}}blur(){this.element&&this.element.blur()}getPosition(){return this.element?this.element.getBoundingClientRect():null}destroy(){this.listeners.forEach(e=>e?.()),this.listeners=[],this.element?.parentNode&&this.element.parentNode.removeChild(this.element),this.element=null,this.isInitialized=!1}init(){this.element&&!this.isInitialized&&(this.isInitialized=!0)}render(){return this.element}}});var Me={};F(Me,{Alert:()=>J});var J,qe=M(()=>{O();z();J=class extends H{constructor(e={}){super(e),this.title=e.title||"",this.message=e.message||"",this.type=e.type||"default",this.icon=e.icon||null,this.closeable=e.closeable||!1,this.className=e.className||""}create(){let e={default:{bg:"bg-blue-50",border:"border-blue-200",title:"text-blue-900",message:"text-blue-800",icon:"\u24D8"},success:{bg:"bg-green-50",border:"border-green-200",title:"text-green-900",message:"text-green-800",icon:"\u2713"},warning:{bg:"bg-yellow-50",border:"border-yellow-200",title:"text-yellow-900",message:"text-yellow-800",icon:"\u26A0"},error:{bg:"bg-red-50",border:"border-red-200",title:"text-red-900",message:"text-red-800",icon:"\u2715"},info:{bg:"bg-cyan-50",border:"border-cyan-200",title:"text-cyan-900",message:"text-cyan-800",icon:"\u2139"}},t=e[this.type]||e.default,u=super.create("div",{className:_("p-4 rounded-lg border-2",t.bg,t.border,this.className),attrs:{role:"alert"}}),h="";return(this.title||this.icon)&&(h+='<div class="flex items-center gap-3 mb-2">',this.icon,h+=`<span class="text-xl font-bold ${t.title}">${this.icon||t.icon}</span>`,this.title&&(h+=`<h4 class="font-semibold ${t.title}">${this.title}</h4>`),h+="</div>"),this.message&&(h+=`<p class="${t.message}">${this.message}</p>`),this.closeable&&(h+='<button class="absolute top-4 right-4 text-gray-400 hover:text-gray-600" aria-label="Close alert">\xD7</button>'),u.innerHTML=h,this.closeable&&u.querySelector("button")?.addEventListener("click",()=>{this.destroy()}),u}setMessage(e){if(this.message=e,this.element){let t=this.element.querySelector("p");t&&(t.textContent=e)}}}});var je={};F(je,{AlertDialog:()=>K});var K,Fe=M(()=>{O();z();K=class extends H{constructor(e={}){super(e),this.title=e.title||"",this.message=e.message||"",this.confirmText=e.confirmText||"Confirm",this.cancelText=e.cancelText||"Cancel",this.type=e.type||"warning",this.onConfirm=e.onConfirm||null,this.onCancel=e.onCancel||null,this.open=e.open||!1}create(){let e=super.create("div",{className:_("fixed inset-0 z-50 flex items-center justify-center",this.open?"":"hidden"),attrs:{role:"alertdialog","aria-modal":"true","aria-labelledby":`${this.id}-title`,"aria-describedby":`${this.id}-message`}}),t=W();e.appendChild(t);let a=document.createElement("div");a.className="bg-white rounded-lg shadow-lg relative z-50 w-full max-w-md mx-4";let u=document.createElement("div");u.className="px-6 py-4 border-b border-gray-200";let h=document.createElement("h2");h.id=`${this.id}-title`,h.className="text-lg font-semibold text-gray-900",h.textContent=this.title,u.appendChild(h),a.appendChild(u);let b=document.createElement("div");b.id=`${this.id}-message`,b.className="px-6 py-4 text-gray-700",b.textContent=this.message,a.appendChild(b);let w=document.createElement("div");w.className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex gap-3 justify-end rounded-b-lg";let A=document.createElement("button");A.className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100 transition-colors duration-200",A.textContent=this.cancelText,A.addEventListener("click",()=>this.handleCancel()),w.appendChild(A);let I=document.createElement("button"),P=this.type==="danger"?"bg-red-600 text-white hover:bg-red-700":"bg-blue-600 text-white hover:bg-blue-700";return I.className=_("px-4 py-2 rounded-md transition-colors duration-200",P),I.textContent=this.confirmText,I.addEventListener("click",()=>this.handleConfirm()),w.appendChild(I),a.appendChild(w),e.appendChild(a),this.focusTrap=G(a),e}open(){this.element||this.create(),this.open=!0,this.element.classList.remove("hidden"),this.focusTrap.init(),document.body.style.overflow="hidden"}close(){this.open=!1,this.element?.classList.add("hidden"),document.body.style.overflow=""}handleConfirm(){this.onConfirm&&this.onConfirm(),this.close()}handleCancel(){this.onCancel&&this.onCancel(),this.close()}}});var ze={};F(ze,{Avatar:()=>Z});var Z,Oe=M(()=>{O();z();Z=class extends H{constructor(e={}){super(e),this.src=e.src||"",this.alt=e.alt||"",this.initials=e.initials||"",this.size=e.size||"md",this.className=e.className||"",this.fallbackBg=e.fallbackBg||"bg-blue-600"}create(){let e={xs:"w-6 h-6 text-xs",sm:"w-8 h-8 text-sm",md:"w-10 h-10 text-base",lg:"w-12 h-12 text-lg",xl:"w-16 h-16 text-xl"},t="rounded-full overflow-hidden flex items-center justify-center flex-shrink-0 font-semibold";return this.src?super.create("img",{className:_(t,e[this.size],this.className),attrs:{src:this.src,alt:this.alt,role:"img"}}):this.initials?super.create("div",{className:_(t,e[this.size],"text-white",this.fallbackBg,this.className),text:this.initials.toUpperCase()}):super.create("div",{className:_(t,e[this.size],"bg-gray-300",this.className),html:'<svg class="w-full h-full text-gray-500" fill="currentColor" viewBox="0 0 24 24"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>'})}setSrc(e,t=""){this.src=e,this.alt=t,this.element&&this.element.tagName==="IMG"&&(this.element.src=e,this.element.alt=t)}setInitials(e,t=""){if(this.initials=e,t&&(this.fallbackBg=t),this.element&&(this.element.textContent=e.toUpperCase(),t&&this.element.className.includes("bg-"))){let a=this.element.className.match(/bg-\S+/)[0];this.element.classList.remove(a),this.element.classList.add(t)}}}});var Re={};F(Re,{Badge:()=>ee});var ee,De=M(()=>{O();z();ee=class extends H{constructor(e={}){super(e),this.label=e.label||"Badge",this.variant=e.variant||"default",this.size=e.size||"md",this.className=e.className||""}create(){let e="inline-flex items-center rounded font-semibold whitespace-nowrap",t={default:"bg-gray-100 text-gray-800",primary:"bg-blue-100 text-blue-800",success:"bg-green-100 text-green-800",warning:"bg-yellow-100 text-yellow-800",destructive:"bg-red-100 text-red-800",outline:"border border-gray-300 text-gray-700"},a={sm:"px-2 py-1 text-xs",md:"px-3 py-1 text-sm",lg:"px-4 py-2 text-base"},u=super.create("span",{className:_(e,t[this.variant],a[this.size],this.className)});return u.textContent=this.label,u}setLabel(e){this.label=e,this.element&&(this.element.textContent=e)}}});var Ve={};F(Ve,{Button:()=>te});var te,Ue=M(()=>{O();z();te=class extends H{constructor(e={}){super(e),this.label=e.label||"Button",this.variant=e.variant||"default",this.size=e.size||"md",this.disabled=e.disabled||!1,this.onClick=e.onClick||null,this.className=e.className||""}create(){let e="px-4 py-2 font-medium rounded transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-offset-2",t={default:"bg-gray-200 text-gray-900 hover:bg-gray-300",primary:"bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500",secondary:"bg-green-600 text-white hover:bg-green-700 focus:ring-green-500",destructive:"bg-red-600 text-white hover:bg-red-700 focus:ring-red-500",outline:"border-2 border-gray-300 text-gray-900 hover:bg-gray-50",ghost:"text-gray-900 hover:bg-gray-100"},a={sm:"px-2 py-1 text-sm",md:"px-4 py-2 text-base",lg:"px-6 py-3 text-lg"},u=super.create("button",{className:_(e,t[this.variant],a[this.size],this.className),attrs:{disabled:this.disabled}});return u.textContent=this.label,this.onClick&&this.on("click",this.onClick),u}setLabel(e){this.label=e,this.element&&(this.element.textContent=e)}setDisabled(e){this.disabled=e,this.attr("disabled",e?"":null)}setLoading(e){this.setDisabled(e),e?this.html('<span class="flex items-center gap-2"><span class="inline-block w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></span>Loading...</span>'):this.text(this.label)}}});var We={};F(We,{ButtonGroup:()=>se});var se,Ge=M(()=>{O();z();se=class extends H{constructor(e={}){super(e),this.buttons=e.buttons||[],this.orientation=e.orientation||"horizontal",this.size=e.size||"md",this.className=e.className||""}create(){let e=this.orientation==="vertical"?"flex-col":"flex-row",a=super.create("div",{className:_("flex",e,"inline-flex border border-gray-300 rounded-md overflow-hidden",this.className),attrs:{role:"group"}});return this.buttons.forEach((u,h)=>{let b=document.createElement("button");b.textContent=u.label||"Button",b.className=_("px-4 py-2 font-medium text-gray-700 hover:bg-gray-50 transition-colors duration-200",h>0?this.orientation==="vertical"?"border-t border-gray-300":"border-l border-gray-300":"",u.disabled?"opacity-50 cursor-not-allowed":""),b.disabled=u.disabled||!1,u.onClick&&b.addEventListener("click",u.onClick),a.appendChild(b)}),a}addButton(e,t){if(this.element){let a=document.createElement("button");a.textContent=e,a.className=_("px-4 py-2 font-medium text-gray-700 hover:bg-gray-50 transition-colors duration-200 border-l border-gray-300"),t&&a.addEventListener("click",t),this.element.appendChild(a)}}}});var Ye={};F(Ye,{Breadcrumb:()=>ae});var ae,Qe=M(()=>{O();z();ae=class extends H{constructor(e={}){super(e),this.items=e.items||[],this.className=e.className||""}create(){let t=super.create("nav",{className:_("flex items-center gap-2",this.className),attrs:{"aria-label":"Breadcrumb"}});return this.items.forEach((a,u)=>{if(u>0){let h=S("span",{className:"text-gray-400 mx-1",text:"/"});t.appendChild(h)}if(u===this.items.length-1){let h=S("span",{className:"text-gray-700 font-medium",text:a.label,attrs:{"aria-current":"page"}});t.appendChild(h)}else{let h=S("a",{className:"text-blue-600 hover:text-blue-800 hover:underline transition-colors duration-200",text:a.label,attrs:{href:a.href||"#"}});t.appendChild(h)}}),t}addItem(e,t="#"){if(this.element){if(this.element.children.length>0){let u=S("span",{className:"text-gray-400 mx-1",text:"/"});this.element.appendChild(u)}let a=S("a",{className:"text-blue-600 hover:text-blue-800 hover:underline transition-colors duration-200",text:e,attrs:{href:t}});this.element.appendChild(a),this.items.push({label:e,href:t})}}}});var Xe={};F(Xe,{Card:()=>re});var re,Je=M(()=>{O();z();re=class extends H{constructor(e={}){super(e),this.title=e.title||"",this.subtitle=e.subtitle||"",this.content=e.content||"",this.footer=e.footer||"",this.className=e.className||"",this.hoverable=e.hoverable!==!1}create(){let e="bg-white rounded-lg border border-gray-200 overflow-hidden",t=this.hoverable?"hover:shadow-lg transition-shadow duration-300":"",a=super.create("div",{className:_(e,t,this.className)});if(this.title){let u=S("div",{className:"px-6 py-4 border-b border-gray-200 bg-gray-50"}),h=`<h3 class="text-lg font-semibold text-gray-900">${this.title}</h3>`;this.subtitle&&(h+=`<p class="text-sm text-gray-600 mt-1">${this.subtitle}</p>`),u.innerHTML=h,a.appendChild(u)}if(this.content){let u=S("div",{className:"px-6 py-4",html:this.content});a.appendChild(u)}if(this.footer){let u=S("div",{className:"px-6 py-4 border-t border-gray-200 bg-gray-50",html:this.footer});a.appendChild(u)}return a}setContent(e){if(this.content=e,this.element){let t=this.element.querySelector(".px-6.py-4:not(.border-b):not(.border-t)");t&&(t.innerHTML=e)}}addContent(e){if(this.element){let t=this.element.querySelector(".px-6.py-4:not(.border-b):not(.border-t)");t&&t.appendChild(e instanceof H?e.element:e)}}}});var Ke={};F(Ke,{Carousel:()=>ne});var ne,Ze=M(()=>{O();z();ne=class extends H{constructor(e={}){super(e),this.items=e.items||[],this.autoplay=e.autoplay||!0,this.interval=e.interval||5e3,this.className=e.className||"",this.currentIndex=0,this.autoplayTimer=null}create(){let e=super.create("div",{className:_("relative w-full bg-black rounded-lg overflow-hidden",this.className)}),t=S("div",{className:"relative w-full h-96 overflow-hidden"});this.items.forEach((b,w)=>{let A=S("div",{className:_("absolute inset-0 transition-opacity duration-500",w===this.currentIndex?"opacity-100":"opacity-0")}),I=document.createElement("img");if(I.src=b.src,I.alt=b.alt||"",I.className="w-full h-full object-cover",A.appendChild(I),b.title){let P=S("div",{className:"absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4",html:`<p class="text-white font-semibold">${b.title}</p>`});A.appendChild(P)}t.appendChild(A)}),e.appendChild(t);let a=S("button",{className:"absolute left-4 top-1/2 transform -translate-y-1/2 z-10 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75 transition-all",html:"\u276E"});a.addEventListener("click",()=>{this.previous()});let u=S("button",{className:"absolute right-4 top-1/2 transform -translate-y-1/2 z-10 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75 transition-all",html:"\u276F"});u.addEventListener("click",()=>{this.next()}),e.appendChild(a),e.appendChild(u);let h=S("div",{className:"absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2 z-10"});return this.items.forEach((b,w)=>{let A=S("button",{className:_("w-2 h-2 rounded-full transition-all",w===this.currentIndex?"bg-white w-8":"bg-gray-500"),attrs:{"data-index":w}});A.addEventListener("click",()=>{this.goTo(w)}),h.appendChild(A)}),e.appendChild(h),this.slidesElement=t,this.dotsElement=h,this.autoplay&&this.startAutoplay(),e}next(){this.currentIndex=(this.currentIndex+1)%this.items.length,this.updateSlides()}previous(){this.currentIndex=(this.currentIndex-1+this.items.length)%this.items.length,this.updateSlides()}goTo(e){this.currentIndex=e,this.updateSlides(),this.autoplay&&this.resetAutoplay()}updateSlides(){let e=this.slidesElement.querySelectorAll("div"),t=this.dotsElement.querySelectorAll("button");e.forEach((a,u)=>{a.className=_("absolute inset-0 transition-opacity duration-500",u===this.currentIndex?"opacity-100":"opacity-0")}),t.forEach((a,u)=>{a.className=_("w-2 h-2 rounded-full transition-all",u===this.currentIndex?"bg-white w-8":"bg-gray-500")})}startAutoplay(){this.autoplayTimer=setInterval(()=>{this.next()},this.interval)}stopAutoplay(){this.autoplayTimer&&clearInterval(this.autoplayTimer)}resetAutoplay(){this.stopAutoplay(),this.autoplay&&this.startAutoplay()}destroy(){this.stopAutoplay(),super.destroy()}}});var et={};F(et,{Chart:()=>ie});var ie,tt=M(()=>{O();z();ie=class extends H{constructor(e={}){super(e),this.type=e.type||"bar",this.data=e.data||[],this.title=e.title||"",this.height=e.height||"300px",this.className=e.className||""}create(){let e=super.create("div",{className:_("bg-white rounded-lg border border-gray-200 p-4",this.className)});if(this.title){let a=S("h3",{className:"text-lg font-semibold text-gray-900 mb-4",text:this.title});e.appendChild(a)}let t=this.createSVG();return e.appendChild(t),e}createSVG(){let e=Math.max(...this.data.map(b=>b.value)),t=400,a=200,u=40,h=document.createElementNS("http://www.w3.org/2000/svg","svg");if(h.setAttribute("viewBox",`0 0 ${t} ${a}`),h.setAttribute("class","w-full"),this.type==="bar"){let b=(t-u*2)/this.data.length;this.data.forEach((w,A)=>{let I=w.value/e*(a-u*2),P=u+A*b+b*.25,$=a-u-I,o=document.createElementNS("http://www.w3.org/2000/svg","rect");o.setAttribute("x",P),o.setAttribute("y",$),o.setAttribute("width",b*.5),o.setAttribute("height",I),o.setAttribute("fill","#3b82f6"),o.setAttribute("class","hover:fill-blue-700 transition-colors"),h.appendChild(o);let g=document.createElementNS("http://www.w3.org/2000/svg","text");g.setAttribute("x",P+b*.25),g.setAttribute("y",a-10),g.setAttribute("text-anchor","middle"),g.setAttribute("font-size","12"),g.setAttribute("fill","#6b7280"),g.textContent=w.label,h.appendChild(g)})}return h}setData(e){if(this.data=e,this.element&&this.element.parentNode){let t=this.create();this.element.parentNode.replaceChild(t,this.element),this.element=t}}}});var st={};F(st,{Checkbox:()=>oe});var oe,at=M(()=>{O();z();oe=class extends H{constructor(e={}){super(e),this.label=e.label||"",this.checked=e.checked||!1,this.disabled=e.disabled||!1,this.required=e.required||!1,this.name=e.name||"",this.className=e.className||"",this.onChange=e.onChange||null}create(){let t=super.create("div",{className:_("flex items-center gap-2",this.className)}),a="w-5 h-5 border-2 border-gray-300 rounded cursor-pointer transition-colors duration-200 checked:bg-blue-600 checked:border-blue-600 disabled:opacity-50 disabled:cursor-not-allowed",u=document.createElement("input");if(u.type="checkbox",u.className=a,u.checked=this.checked,u.disabled=this.disabled,u.required=this.required,this.name&&(u.name=this.name),t.appendChild(u),this.label){let h=document.createElement("label");h.className="cursor-pointer select-none",h.textContent=this.label,t.appendChild(h),h.addEventListener("click",()=>{u.click()})}return this.onChange&&u.addEventListener("change",this.onChange),this.inputElement=u,t}isChecked(){return this.inputElement?.checked||!1}setChecked(e){this.checked=e,this.inputElement&&(this.inputElement.checked=e)}setDisabled(e){this.disabled=e,this.inputElement&&(this.inputElement.disabled=e)}toggle(){this.setChecked(!this.isChecked())}}});var rt={};F(rt,{Collapsible:()=>le});var le,nt=M(()=>{O();z();le=class extends H{constructor(e={}){super(e),this.title=e.title||"",this.content=e.content||"",this.open=e.open||!1,this.className=e.className||"",this.onChange=e.onChange||null}create(){let e=super.create("div",{className:_("border border-gray-200 rounded-lg overflow-hidden",this.className)}),t=S("button",{className:_("w-full px-4 py-3 flex items-center justify-between","hover:bg-gray-50 transition-colors duration-200 text-left"),attrs:{"aria-expanded":this.open}}),a=S("span",{className:"font-semibold text-gray-900",text:this.title}),u=S("span",{className:_("w-5 h-5 transition-transform duration-300",this.open?"rotate-180":""),html:"\u25BC"});t.appendChild(a),t.appendChild(u),t.addEventListener("click",()=>{this.toggle()}),e.appendChild(t);let h=S("div",{className:_("overflow-hidden transition-all duration-300",this.open?"max-h-96":"max-h-0","border-t border-gray-200")}),b=S("div",{className:"px-4 py-3",html:this.content});return h.appendChild(b),e.appendChild(h),this.triggerElement=t,this.contentElement=h,this.chevron=u,e}toggle(){this.open=!this.open,this.updateUI(),this.onChange&&this.onChange(this.open)}open(){this.open||(this.open=!0,this.updateUI(),this.onChange&&this.onChange(!0))}close(){this.open&&(this.open=!1,this.updateUI(),this.onChange&&this.onChange(!1))}updateUI(){this.triggerElement.setAttribute("aria-expanded",this.open),this.contentElement.className=_("overflow-hidden transition-all duration-300",this.open?"max-h-96":"max-h-0","border-t border-gray-200"),this.chevron.className=_("w-5 h-5 transition-transform duration-300",this.open?"rotate-180":"")}setContent(e){if(this.content=e,this.contentElement){let t=this.contentElement.querySelector("div");t&&(t.innerHTML=e)}}}});var it={};F(it,{Command:()=>ce});var ce,ot=M(()=>{O();z();ce=class extends H{constructor(e={}){super(e),this.commands=e.commands||[],this.placeholder=e.placeholder||"Type a command...",this.className=e.className||"",this.open=!1}create(){let e=super.create("div",{className:_("fixed inset-0 z-50 hidden flex items-start justify-center pt-20",this.open?"flex":"")}),t=S("div",{className:"absolute inset-0 bg-black bg-opacity-50"});e.appendChild(t),t.addEventListener("click",()=>this.close());let a=S("div",{className:"relative w-full max-w-md bg-white rounded-lg shadow-lg z-50"}),u=document.createElement("input");u.type="text",u.placeholder=this.placeholder,u.className="w-full px-4 py-3 border-b border-gray-200 focus:outline-none",u.autofocus=!0,a.appendChild(u);let h=S("div",{className:"max-h-96 overflow-y-auto"}),b=(w="")=>{h.innerHTML="";let A=w?this.commands.filter(P=>P.label.toLowerCase().includes(w.toLowerCase())):this.commands;if(A.length===0){let P=S("div",{className:"px-4 py-3 text-sm text-gray-500",text:"No commands found"});h.appendChild(P);return}let I="";A.forEach(P=>{if(P.category&&P.category!==I){I=P.category;let g=S("div",{className:"px-4 py-2 text-xs font-semibold text-gray-600 bg-gray-50 uppercase",text:I});h.appendChild(g)}let $=S("div",{className:_("px-4 py-2 cursor-pointer hover:bg-blue-50 transition-colors flex items-center justify-between group")}),o=S("span",{text:P.label,className:"text-sm text-gray-900"});if($.appendChild(o),P.shortcut){let g=S("span",{className:"text-xs text-gray-500 group-hover:text-gray-700",text:P.shortcut});$.appendChild(g)}$.addEventListener("click",()=>{P.action&&P.action(),this.close()}),h.appendChild($)})};return u.addEventListener("input",w=>{b(w.target.value)}),a.appendChild(h),e.appendChild(a),u.addEventListener("keydown",w=>{w.key==="Escape"&&this.close()}),b(),this.containerElement=e,e}open(){this.element||this.create(),this.open=!0,this.element.classList.remove("hidden"),this.element.classList.add("flex")}close(){this.open=!1,this.element?.classList.remove("flex"),this.element?.classList.add("hidden")}toggle(){this.open?this.close():this.open()}}});var lt={};F(lt,{Combobox:()=>de});var de,ct=M(()=>{O();z();de=class extends H{constructor(e={}){super(e),this.items=e.items||[],this.value=e.value||"",this.placeholder=e.placeholder||"Search...",this.className=e.className||"",this.onChange=e.onChange||null,this.open=!1}create(){let e=super.create("div",{className:"relative w-full"}),t=document.createElement("input");t.type="text",t.placeholder=this.placeholder,t.value=this.value,t.className=_("w-full px-3 py-2 border border-gray-300 rounded-md","focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent");let a=S("div",{className:_("absolute hidden top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-md shadow-lg z-50","max-h-64 overflow-y-auto")}),u=(h="")=>{a.innerHTML="";let b=this.items.filter(w=>w.label.toLowerCase().includes(h.toLowerCase()));if(b.length===0){let w=S("div",{className:"px-3 py-2 text-gray-500",text:"No results found"});a.appendChild(w);return}b.forEach(w=>{let A=S("div",{className:_("px-3 py-2 cursor-pointer hover:bg-blue-50 transition-colors",w.value===this.value?"bg-blue-100":""),text:w.label,attrs:{"data-value":w.value}});A.addEventListener("click",()=>{this.value=w.value,t.value=w.label,a.classList.add("hidden"),this.onChange&&this.onChange(this.value,w)}),a.appendChild(A)})};return t.addEventListener("input",h=>{u(h.target.value),a.classList.remove("hidden")}),t.addEventListener("focus",()=>{u(t.value),a.classList.remove("hidden")}),t.addEventListener("blur",()=>{setTimeout(()=>{a.classList.add("hidden")},150)}),e.appendChild(t),e.appendChild(a),document.addEventListener("click",h=>{e.contains(h.target)||a.classList.add("hidden")}),this.inputElement=t,this.listElement=a,u(),e}getValue(){return this.value}setValue(e){this.value=e;let t=this.items.find(a=>a.value===e);t&&this.inputElement&&(this.inputElement.value=t.label)}}});var dt={};F(dt,{ContextMenu:()=>ue});var ue,ut=M(()=>{O();z();ue=class extends H{constructor(e={}){super(e),this.items=e.items||[],this.className=e.className||"",this.visible=!1}create(){let e=super.create("div",{className:"relative inline-block w-full"}),t=document.createElement("div");return t.className=_("absolute hidden bg-white border border-gray-200 rounded-lg shadow-lg py-1 z-50 min-w-max",this.className),this.items.forEach(a=>{let u=S("button",{className:_("w-full text-left px-4 py-2 hover:bg-gray-100 transition-colors duration-200 flex items-center gap-2",a.disabled?"opacity-50 cursor-not-allowed":"cursor-pointer"),attrs:{disabled:a.disabled?"":null,"data-action":a.label}});if(a.icon){let b=document.createElement("span");b.innerHTML=a.icon,u.appendChild(b)}let h=document.createElement("span");h.textContent=a.label,u.appendChild(h),u.addEventListener("click",()=>{!a.disabled&&a.onClick&&a.onClick(),this.hide()}),t.appendChild(u)}),e.appendChild(t),e.addEventListener("contextmenu",a=>{a.preventDefault(),this.showAt(a.clientX,a.clientY,t)}),document.addEventListener("click",()=>{this.visible&&this.hide()}),this.menuElement=t,e}showAt(e,t,a){a&&(this.visible=!0,a.classList.remove("hidden"),a.style.position="fixed",a.style.left=e+"px",a.style.top=t+"px")}hide(){this.visible=!1,this.menuElement&&(this.menuElement.classList.add("hidden"),this.menuElement.style.position="absolute")}addItem(e,t,a=null){let u={label:e,onClick:t,icon:a};if(this.items.push(u),this.menuElement){let h=S("button",{className:"w-full text-left px-4 py-2 hover:bg-gray-100 transition-colors duration-200 flex items-center gap-2"});if(a){let b=document.createElement("span");b.innerHTML=a,h.appendChild(b)}h.textContent=e,h.addEventListener("click",()=>{t(),this.hide()}),this.menuElement.appendChild(h)}}}});var mt={};F(mt,{DatePicker:()=>me});var me,pt=M(()=>{O();z();me=class extends H{constructor(e={}){super(e),this.value=e.value||"",this.placeholder=e.placeholder||"Select date...",this.format=e.format||"yyyy-mm-dd",this.className=e.className||"",this.onChange=e.onChange||null,this.open=!1}create(){let e=super.create("div",{className:"relative w-full"}),t=document.createElement("input");t.type="text",t.placeholder=this.placeholder,t.value=this.value,t.className=_("w-full px-3 py-2 border border-gray-300 rounded-md","focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"),t.addEventListener("click",()=>{this.openPicker()}),t.addEventListener("change",u=>{this.value=u.target.value,this.onChange&&this.onChange(this.value)}),e.appendChild(t);let a=document.createElement("input");return a.type="date",a.style.display="none",a.value=this.value,a.addEventListener("change",u=>{let h=new Date(u.target.value);this.value=this.formatDate(h),t.value=this.value,this.onChange&&this.onChange(this.value)}),e.appendChild(a),this.inputElement=t,this.nativeInput=a,e}openPicker(){this.nativeInput.click()}formatDate(e){let t=e.getFullYear(),a=String(e.getMonth()+1).padStart(2,"0"),u=String(e.getDate()).padStart(2,"0");return this.format==="dd/mm/yyyy"?`${u}/${a}/${t}`:`${t}-${a}-${u}`}getValue(){return this.value}setValue(e){this.value=e,this.inputElement&&(this.inputElement.value=e)}}});var gt={};F(gt,{Dialog:()=>pe});var pe,ht=M(()=>{O();z();pe=class extends H{constructor(e={}){super(e),this.title=e.title||"",this.content=e.content||"",this.size=e.size||"md",this.open=e.open||!1,this.onClose=e.onClose||null,this.closeButton=e.closeButton!==!1,this.closeOnBackdrop=e.closeOnBackdrop!==!1,this.closeOnEscape=e.closeOnEscape!==!1}create(){let e=super.create("div",{className:_("fixed inset-0 z-50 flex items-center justify-center",this.open?"":"hidden"),attrs:{role:"dialog","aria-modal":"true","aria-labelledby":`${this.id}-title`,"aria-describedby":`${this.id}-description`}}),t=W("dialog-backdrop");e.appendChild(t),this.closeOnBackdrop&&t.addEventListener("click",()=>this.close());let a={sm:"w-full max-w-sm",md:"w-full max-w-md",lg:"w-full max-w-lg",xl:"w-full max-w-xl"},u=document.createElement("div");if(u.className=_("bg-white rounded-lg shadow-lg relative z-50",a[this.size],"mx-4 max-h-[90vh] overflow-y-auto"),this.title){let h=document.createElement("div");h.className="px-6 py-4 border-b border-gray-200 flex items-center justify-between";let b=document.createElement("h2");if(b.id=`${this.id}-title`,b.className="text-xl font-semibold text-gray-900",b.textContent=this.title,h.appendChild(b),this.closeButton){let w=document.createElement("button");w.className="text-gray-500 hover:text-gray-700 transition-colors duration-200",w.innerHTML="\xD7",w.setAttribute("aria-label","Close"),w.addEventListener("click",()=>this.close()),h.appendChild(w)}u.appendChild(h)}if(this.content){let h=document.createElement("div");h.id=`${this.id}-description`,h.className="px-6 py-4",h.innerHTML=this.content,u.appendChild(h)}return e.appendChild(u),this.on("keydown",h=>{Y.isEscape(h)&&this.closeOnEscape&&this.close()},{once:!1}),this.backdrop=t,this.dialogElement=u,this.focusTrap=G(u),e}open(){this.element||this.create(),this.open=!0,this.element.classList.remove("hidden"),this.focusTrap.init(),document.body.style.overflow="hidden"}close(){this.open=!1,this.element?.classList.add("hidden"),document.body.style.overflow="",this.onClose&&this.onClose()}toggle(){this.open?this.close():this.open()}setContent(e){if(this.content=e,this.dialogElement){let t=this.dialogElement.querySelector(`#${this.id}-description`);t&&(t.innerHTML=e)}}}});var ft={};F(ft,{DropdownMenu:()=>ge});var ge,yt=M(()=>{O();z();ge=class extends H{constructor(e={}){super(e),this.trigger=e.trigger||"Menu",this.items=e.items||[],this.position=e.position||"bottom",this.align=e.align||"left",this.className=e.className||"",this.open=!1}create(){let e=super.create("div",{className:"relative inline-block"}),t=document.createElement("button");t.className="px-4 py-2 bg-gray-100 text-gray-900 rounded hover:bg-gray-200 transition-colors duration-200 flex items-center gap-2",t.innerHTML=`${this.trigger} <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 14l-7 7m0 0l-7-7m7 7V3"></path></svg>`,t.addEventListener("click",()=>this.toggle()),e.appendChild(t);let a=this.position==="top"?"bottom-full mb-2":"top-full mt-2",u=this.align==="right"?"right-0":"left-0",h=document.createElement("div");return h.className=_("absolute hidden bg-white border border-gray-200 rounded-lg shadow-lg py-1 z-50 min-w-max",a,u,this.className),this.items.forEach(b=>{if(b.divider){let I=document.createElement("div");I.className="border-t border-gray-200 my-1",h.appendChild(I);return}let w=S("button",{className:_("w-full text-left px-4 py-2 hover:bg-gray-100 transition-colors duration-200 flex items-center gap-2",b.disabled?"opacity-50 cursor-not-allowed":"cursor-pointer"),attrs:{disabled:b.disabled?"":null}});if(b.icon){let I=document.createElement("span");I.innerHTML=b.icon,I.className="w-4 h-4",w.appendChild(I)}let A=document.createElement("span");A.textContent=b.label,w.appendChild(A),w.addEventListener("click",()=>{!b.disabled&&b.onClick&&b.onClick(),this.close()}),h.appendChild(w)}),e.appendChild(h),document.addEventListener("click",b=>{!e.contains(b.target)&&this.open&&this.close()}),this.triggerBtn=t,this.menuElement=h,e}toggle(){this.open?this.close():this.open()}open(){this.open=!0,this.menuElement.classList.remove("hidden")}close(){this.open=!1,this.menuElement.classList.add("hidden")}addItem(e,t,a=null){let u={label:e,onClick:t,icon:a};if(this.items.push(u),this.menuElement){let h=S("button",{className:"w-full text-left px-4 py-2 hover:bg-gray-100 transition-colors duration-200 flex items-center gap-2"});if(a){let w=document.createElement("span");w.innerHTML=a,w.className="w-4 h-4",h.appendChild(w)}let b=document.createElement("span");b.textContent=e,h.appendChild(b),h.addEventListener("click",()=>{t(),this.close()}),this.menuElement.appendChild(h)}}}});var bt={};F(bt,{Drawer:()=>he});var he,vt=M(()=>{O();z();he=class extends H{constructor(e={}){super(e),this.title=e.title||"",this.content=e.content||"",this.position=e.position||"right",this.open=e.open||!1,this.onClose=e.onClose||null,this.closeButton=e.closeButton!==!1,this.closeOnBackdrop=e.closeOnBackdrop!==!1,this.closeOnEscape=e.closeOnEscape!==!1}create(){let e=super.create("div",{className:_("fixed inset-0 z-50",this.open?"":"hidden")}),t=W();e.appendChild(t),this.closeOnBackdrop&&t.addEventListener("click",()=>this.close());let a=this.position==="left"?"left-0":"right-0",u=document.createElement("div");if(u.className=_("absolute top-0 h-full w-96 bg-white shadow-lg transition-transform duration-300 flex flex-col z-50",a,this.open?"translate-x-0":this.position==="left"?"-translate-x-full":"translate-x-full"),this.title){let b=document.createElement("div");b.className="px-6 py-4 border-b border-gray-200 flex items-center justify-between";let w=document.createElement("h2");if(w.className="text-xl font-semibold text-gray-900",w.textContent=this.title,b.appendChild(w),this.closeButton){let A=document.createElement("button");A.className="text-gray-500 hover:text-gray-700 transition-colors duration-200",A.innerHTML="\xD7",A.addEventListener("click",()=>this.close()),b.appendChild(A)}u.appendChild(b)}let h=document.createElement("div");return h.className="flex-1 overflow-y-auto px-6 py-4",h.innerHTML=this.content,u.appendChild(h),e.appendChild(u),this.on("keydown",b=>{Y.isEscape(b)&&this.closeOnEscape&&this.close()},{once:!1}),this.backdrop=t,this.drawerElement=u,e}open(){this.element||this.create(),this.open=!0,this.element.classList.remove("hidden"),this.drawerElement.classList.remove("-translate-x-full","translate-x-full"),this.drawerElement.classList.add("translate-x-0"),document.body.style.overflow="hidden"}close(){this.open=!1;let e=this.position==="left"?"-translate-x-full":"translate-x-full";this.drawerElement.classList.remove("translate-x-0"),this.drawerElement.classList.add(e),setTimeout(()=>{this.element?.parentNode&&this.element.classList.add("hidden"),document.body.style.overflow=""},300),this.onClose&&this.onClose()}toggle(){this.open?this.close():this.open()}}});var xt={};F(xt,{Empty:()=>fe});var fe,wt=M(()=>{O();z();fe=class extends H{constructor(e={}){super(e),this.icon=e.icon||"\u{1F4E6}",this.title=e.title||"No data",this.message=e.message||"There is no data to display",this.action=e.action||null,this.className=e.className||""}create(){let e=super.create("div",{className:_("flex flex-col items-center justify-center p-8 text-center",this.className)}),t=S("div",{className:"text-6xl mb-4",text:this.icon});e.appendChild(t);let a=S("h3",{className:"text-lg font-semibold text-gray-900 mb-2",text:this.title});e.appendChild(a);let u=S("p",{className:"text-gray-500 mb-4",text:this.message});if(e.appendChild(u),this.action){let h=S("button",{className:"px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors",text:this.action.label});h.addEventListener("click",this.action.onClick),e.appendChild(h)}return e}}});var kt={};F(kt,{Form:()=>ye});var ye,Ct=M(()=>{O();z();ye=class extends H{constructor(e={}){super(e),this.fields=e.fields||[],this.onSubmit=e.onSubmit||null,this.submitText=e.submitText||"Submit",this.className=e.className||""}create(){let e=super.create("form",{className:_("space-y-6",this.className)});e.addEventListener("submit",a=>{a.preventDefault(),this.handleSubmit()}),this.fieldElements={},this.fields.forEach(a=>{let u=S("div",{className:"space-y-2"});if(a.label){let w=S("label",{className:"block text-sm font-medium text-gray-700",text:a.label,attrs:{for:a.name}});u.appendChild(w)}let h=document.createElement(a.type==="textarea"?"textarea":"input");h.id=a.name,h.name=a.name,h.className=_("w-full px-3 py-2 border border-gray-300 rounded-md","focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"),a.type!=="textarea"&&(h.type=a.type||"text"),a.placeholder&&(h.placeholder=a.placeholder),a.required&&(h.required=!0),a.disabled&&(h.disabled=!0),h.value=a.value||"",u.appendChild(h);let b=S("div",{className:"text-sm text-red-600 hidden",attrs:{"data-error":a.name}});u.appendChild(b),e.appendChild(u),this.fieldElements[a.name]=h});let t=S("button",{className:_("w-full px-4 py-2 bg-blue-600 text-white font-medium rounded","hover:bg-blue-700 transition-colors duration-200"),text:this.submitText,attrs:{type:"submit"}});return e.appendChild(t),e}handleSubmit(){let e={};Object.entries(this.fieldElements).forEach(([t,a])=>{e[t]=a.value}),this.onSubmit&&this.onSubmit(e)}getValues(){let e={};return Object.entries(this.fieldElements).forEach(([t,a])=>{e[t]=a.value}),e}setValues(e){Object.entries(e).forEach(([t,a])=>{this.fieldElements[t]&&(this.fieldElements[t].value=a)})}setError(e,t){let a=this.element.querySelector(`[data-error="${e}"]`);a&&(a.textContent=t,a.classList.remove("hidden"))}clearError(e){let t=this.element.querySelector(`[data-error="${e}"]`);t&&(t.textContent="",t.classList.add("hidden"))}reset(){this.element&&this.element.reset()}}});var Et={};F(Et,{HoverCard:()=>be});var be,Lt=M(()=>{O();z();be=class extends H{constructor(e={}){super(e),this.trigger=e.trigger||"Hover me",this.content=e.content||"",this.position=e.position||"bottom",this.delay=e.delay||200,this.className=e.className||"",this.visible=!1,this.timeoutId=null}create(){let e=super.create("div",{className:"relative inline-block"}),t=document.createElement("div");t.className="cursor-pointer px-3 py-2 rounded hover:bg-gray-100 transition-colors duration-200",t.textContent=this.trigger,e.appendChild(t);let a=document.createElement("div");return a.className=_("absolute hidden bg-white border border-gray-200 rounded-lg shadow-lg p-4 z-50","min-w-max max-w-sm",this.getPositionClasses(),this.className),a.innerHTML=this.content,e.appendChild(a),e.addEventListener("mouseenter",()=>this.show(a)),e.addEventListener("mouseleave",()=>this.hide(a)),this.cardElement=a,e}getPositionClasses(){let e={top:"bottom-full left-0 mb-2",bottom:"top-full left-0 mt-2",left:"right-full top-0 mr-2",right:"left-full top-0 ml-2"};return e[this.position]||e.bottom}show(e=this.cardElement){this.visible||!e||(this.timeoutId=setTimeout(()=>{this.visible=!0,e.classList.remove("hidden"),e.classList.add("opacity-100","transition-opacity","duration-200")},this.delay))}hide(e=this.cardElement){!this.visible||!e||(clearTimeout(this.timeoutId),this.visible=!1,e.classList.add("hidden"),e.classList.remove("opacity-100"))}setContent(e){this.content=e,this.cardElement&&(this.cardElement.innerHTML=e)}}});var $t={};F($t,{Input:()=>ve});var ve,_t=M(()=>{O();z();ve=class extends H{constructor(e={}){super(e),this.type=e.type||"text",this.placeholder=e.placeholder||"",this.value=e.value||"",this.name=e.name||"",this.disabled=e.disabled||!1,this.required=e.required||!1,this.className=e.className||"",this.onChange=e.onChange||null}create(){let t=super.create("input",{className:_("w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900 placeholder-gray-500 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed",this.className),attrs:{type:this.type,placeholder:this.placeholder,value:this.value,name:this.name,disabled:this.disabled?"":null,required:this.required?"":null}});return this.onChange&&(this.on("change",this.onChange),this.on("input",this.onChange)),t}getValue(){return this.element?.value||""}setValue(e){this.value=e,this.element&&(this.element.value=e)}setDisabled(e){this.disabled=e,this.attr("disabled",e?"":null)}setPlaceholder(e){this.placeholder=e,this.element&&(this.element.placeholder=e)}focus(){super.focus()}clear(){this.setValue("")}}});var Tt={};F(Tt,{InputGroup:()=>xe});var xe,At=M(()=>{O();z();xe=class extends H{constructor(e={}){super(e),this.prefix=e.prefix||null,this.suffix=e.suffix||null,this.input=e.input||null,this.className=e.className||""}create(){let t=super.create("div",{className:_("flex items-center border border-gray-300 rounded-md overflow-hidden focus-within:ring-2 focus-within:ring-blue-500",this.className)});if(this.prefix){let a=S("div",{className:"px-3 py-2 bg-gray-50 text-gray-700 font-medium text-sm",html:this.prefix});t.appendChild(a)}if(this.input){let a=this.input.element||this.input.create();a.classList.remove("border","focus:ring-2","focus:ring-blue-500"),t.appendChild(a)}if(this.suffix){let a=S("div",{className:"px-3 py-2 bg-gray-50 text-gray-700 font-medium text-sm",html:this.suffix});t.appendChild(a)}return t}}});var Bt={};F(Bt,{InputOTP:()=>we});var we,It=M(()=>{O();z();we=class extends H{constructor(e={}){super(e),this.length=e.length||6,this.value=e.value||"",this.className=e.className||"",this.onChange=e.onChange||null,this.onComplete=e.onComplete||null}create(){let e=super.create("div",{className:_("flex gap-2",this.className)});this.inputs=[];for(let t=0;t<this.length;t++){let a=document.createElement("input");a.type="text",a.maxLength="1",a.inputMode="numeric",a.className=_("w-12 h-12 text-center border-2 border-gray-300 rounded-lg font-semibold text-lg","focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-200","transition-colors duration-200"),this.value&&this.value[t]&&(a.value=this.value[t]),a.addEventListener("input",u=>{let h=u.target.value;if(!/^\d*$/.test(h)){u.target.value="";return}h&&t<this.length-1&&this.inputs[t+1].focus(),this.updateValue()}),a.addEventListener("keydown",u=>{u.key==="Backspace"?!a.value&&t>0&&this.inputs[t-1].focus():u.key==="ArrowLeft"&&t>0?this.inputs[t-1].focus():u.key==="ArrowRight"&&t<this.length-1&&this.inputs[t+1].focus()}),this.inputs.push(a),e.appendChild(a)}return e}updateValue(){this.value=this.inputs.map(e=>e.value).join(""),this.onChange&&this.onChange(this.value),this.value.length===this.length&&this.onComplete&&this.onComplete(this.value)}getValue(){return this.value}setValue(e){this.value=e;for(let t=0;t<this.length;t++)this.inputs[t].value=e[t]||""}clear(){this.inputs.forEach(e=>{e.value=""}),this.value=""}focus(){this.inputs.length>0&&this.inputs[0].focus()}}});var St={};F(St,{Item:()=>ke});var ke,Ht=M(()=>{O();z();ke=class extends H{constructor(e={}){super(e),this.label=e.label||"",this.value=e.value||"",this.icon=e.icon||null,this.className=e.className||"",this.selected=e.selected||!1,this.disabled=e.disabled||!1}create(){let e="flex items-center gap-2 px-3 py-2 rounded cursor-pointer transition-colors duration-200 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed",t=this.selected?"bg-blue-50 text-blue-600":"text-gray-900",a=super.create("div",{className:_(e,t,this.className),attrs:{role:"option","aria-selected":this.selected,disabled:this.disabled?"":null,"data-value":this.value}}),u="";return this.icon&&(u+=`<span class="flex-shrink-0">${this.icon}</span>`),u+=`<span>${this.label}</span>`,a.innerHTML=u,a}setSelected(e){this.selected=e,this.element&&(this.attr("aria-selected",e),this.toggleClass("bg-blue-50 text-blue-600",e))}setDisabled(e){this.disabled=e,this.attr("disabled",e?"":null)}}});var Pt={};F(Pt,{Label:()=>Ce});var Ce,Nt=M(()=>{O();z();Ce=class extends H{constructor(e={}){super(e),this.text=e.text||"",this.htmlFor=e.htmlFor||"",this.required=e.required||!1,this.className=e.className||""}create(){let t=super.create("label",{className:_("block text-sm font-medium text-gray-700 mb-1",this.className),attrs:{for:this.htmlFor}}),a=this.text;return this.required&&(a+=' <span class="text-red-500 ml-1">*</span>'),t.innerHTML=a,t}setText(e){if(this.text=e,this.element){let t=e;this.required&&(t+=' <span class="text-red-500 ml-1">*</span>'),this.element.innerHTML=t}}setRequired(e){if(this.required=e,this.element){let t=this.element.querySelector('[class*="text-red"]');e&&!t?this.element.innerHTML+=' <span class="text-red-500 ml-1">*</span>':!e&&t&&t.remove()}}}});var Mt={};F(Mt,{Kbd:()=>Ee});var Ee,qt=M(()=>{O();z();Ee=class extends H{constructor(e={}){super(e),this.label=e.label||"K",this.className=e.className||""}create(){let t=super.create("kbd",{className:_("px-2 py-1 bg-gray-100 border border-gray-300 rounded text-xs font-semibold text-gray-900 inline-block font-mono",this.className)});return t.textContent=this.label,t}setLabel(e){this.label=e,this.element&&(this.element.textContent=e)}}});var jt={};F(jt,{NativeSelect:()=>Le});var Le,Ft=M(()=>{O();z();Le=class extends H{constructor(e={}){super(e),this.items=e.items||[],this.selected=e.selected||"",this.placeholder=e.placeholder||"Select...",this.disabled=e.disabled||!1,this.required=e.required||!1,this.name=e.name||"",this.className=e.className||"",this.onChange=e.onChange||null}create(){let t=super.create("select",{className:_("w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed bg-white appearance-none cursor-pointer",this.className),attrs:{disabled:this.disabled?"":null,required:this.required?"":null,...this.name&&{name:this.name}}});if(this.placeholder){let a=document.createElement("option");a.value="",a.textContent=this.placeholder,a.disabled=!0,t.appendChild(a)}return this.items.forEach(a=>{let u=document.createElement("option");u.value=a.value,u.textContent=a.label,a.value===this.selected&&(u.selected=!0),t.appendChild(u)}),this.onChange&&this.on("change",this.onChange),t}getValue(){return this.element?.value||""}setValue(e){this.selected=e,this.element&&(this.element.value=e)}setDisabled(e){this.disabled=e,this.attr("disabled",e?"":null)}addItem(e,t){if(this.element){let a=document.createElement("option");a.value=t,a.textContent=e,this.element.appendChild(a)}}removeItem(e){if(this.element){let t=this.element.querySelector(`option[value="${e}"]`);t&&t.remove()}}}});var zt={};F(zt,{Tooltip:()=>$e});var $e,Ot=M(()=>{O();z();$e=class extends H{constructor(e={}){super(e),this.content=e.content||"",this.position=e.position||"top",this.delay=e.delay||200,this.trigger=e.trigger||"hover",this.className=e.className||"",this.visible=!1,this.timeoutId=null}create(){let e=super.create("div",{className:"relative inline-block"}),t=document.createElement("div");t.className=_("absolute hidden bg-gray-900 text-white px-3 py-2 rounded text-sm whitespace-nowrap z-50","opacity-0 transition-opacity duration-200",this.getPositionClasses(),this.className),t.textContent=this.content;let a=document.createElement("div");return a.className=_("absolute w-2 h-2 bg-gray-900 transform rotate-45",this.getArrowClasses()),t.appendChild(a),e.appendChild(t),this.tooltipElement=t,this.trigger==="hover"?(e.addEventListener("mouseenter",()=>this.show()),e.addEventListener("mouseleave",()=>this.hide())):this.trigger==="focus"&&(e.addEventListener("focus",()=>this.show(),!0),e.addEventListener("blur",()=>this.hide(),!0)),e}getPositionClasses(){let e={top:"bottom-full left-1/2 transform -translate-x-1/2 mb-2",bottom:"top-full left-1/2 transform -translate-x-1/2 mt-2",left:"right-full top-1/2 transform -translate-y-1/2 mr-2",right:"left-full top-1/2 transform -translate-y-1/2 ml-2"};return e[this.position]||e.top}getArrowClasses(){let e={top:"top-full left-1/2 transform -translate-x-1/2 -translate-y-1/2",bottom:"bottom-full left-1/2 transform -translate-x-1/2 translate-y-1/2",left:"left-full top-1/2 transform translate-x-1/2 -translate-y-1/2",right:"right-full top-1/2 transform -translate-x-1/2 -translate-y-1/2"};return e[this.position]||e.top}show(){this.visible||(this.timeoutId=setTimeout(()=>{this.visible=!0,this.tooltipElement.classList.remove("hidden"),this.tooltipElement.classList.add("opacity-100")},this.delay))}hide(){this.visible&&(clearTimeout(this.timeoutId),this.visible=!1,this.tooltipElement.classList.remove("opacity-100"),this.tooltipElement.classList.add("hidden"))}setContent(e){this.content=e,this.tooltipElement&&(this.tooltipElement.textContent=e)}}});var Rt={};F(Rt,{Toggle:()=>_e});var _e,Dt=M(()=>{O();z();_e=class extends H{constructor(e={}){super(e),this.label=e.label||"",this.pressed=e.pressed||!1,this.disabled=e.disabled||!1,this.variant=e.variant||"default",this.size=e.size||"md",this.className=e.className||"",this.onChange=e.onChange||null}create(){let e="px-4 py-2 font-medium rounded transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed",t={default:this.pressed?"bg-gray-900 text-white":"bg-gray-100 text-gray-900 hover:bg-gray-200",outline:this.pressed?"border-2 border-gray-900 bg-gray-900 text-white":"border-2 border-gray-300 text-gray-900 hover:bg-gray-50"},a={sm:"px-2 py-1 text-sm",md:"px-4 py-2 text-base",lg:"px-6 py-3 text-lg"},u=super.create("button",{className:_(e,t[this.variant],a[this.size],this.className),attrs:{"aria-pressed":this.pressed,disabled:this.disabled?"":null}});return u.textContent=this.label,this.on("click",()=>{this.toggle()}),u}isPressed(){return this.pressed}setPressed(e){this.pressed=e,this.element&&(this.attr("aria-pressed",e),this.toggleClass("bg-gray-900 text-white",e),this.onChange&&this.onChange(e))}toggle(){this.setPressed(!this.pressed)}setDisabled(e){this.disabled=e,this.attr("disabled",e?"":null)}}});var Vt={};F(Vt,{ToggleGroup:()=>Te});var Te,Ut=M(()=>{O();z();Te=class extends H{constructor(e={}){super(e),this.items=e.items||[],this.selected=e.selected||null,this.multiple=e.multiple||!1,this.orientation=e.orientation||"horizontal",this.className=e.className||"",this.onChange=e.onChange||null}create(){let e=this.orientation==="vertical"?"flex-col":"flex-row",a=super.create("div",{className:_("flex",e,"inline-flex border border-gray-300 rounded-md overflow-hidden",this.className),attrs:{role:"group"}});return this.toggleButtons=[],this.items.forEach((u,h)=>{let b=this.multiple?Array.isArray(this.selected)&&this.selected.includes(u.value):u.value===this.selected,w=_("flex-1 px-4 py-2 font-medium transition-colors duration-200",b?"bg-blue-600 text-white":"bg-white text-gray-700 hover:bg-gray-50",h>0?this.orientation==="vertical"?"border-t border-gray-300":"border-l border-gray-300":""),A=S("button",{className:w,text:u.label,attrs:{"data-value":u.value,"aria-pressed":b,type:"button"}});A.addEventListener("click",()=>{if(this.multiple){Array.isArray(this.selected)||(this.selected=[]);let I=this.selected.indexOf(u.value);I>-1?this.selected.splice(I,1):this.selected.push(u.value)}else this.selected=u.value;this.updateView(),this.onChange&&this.onChange(this.selected)}),a.appendChild(A),this.toggleButtons.push(A)}),a}updateView(){this.toggleButtons.forEach(e=>{let t=e.getAttribute("data-value"),a=this.multiple?Array.isArray(this.selected)&&this.selected.includes(t):t===this.selected;e.setAttribute("aria-pressed",a),e.className=_("flex-1 px-4 py-2 font-medium transition-colors duration-200",a?"bg-blue-600 text-white":"bg-white text-gray-700 hover:bg-gray-50")})}getValue(){return this.selected}setValue(e){this.selected=e,this.updateView()}}});var Wt={};F(Wt,{Toast:()=>Ae});var Ae,Gt=M(()=>{O();z();Ae=class r extends H{constructor(e={}){super(e),this.message=e.message||"",this.type=e.type||"default",typeof e.duration<"u"?this.duration=e.duration:this.duration=typeof window<"u"&&window.innerWidth<640?2500:3e3,this.position=e.position||"top-right",this.className=e.className||"",this.onClose=e.onClose||null}destroy(){if(!this.element)return;let e=this.element;e.classList.add(this.getExitAnimationClass());let t=()=>{e.removeEventListener("animationend",t),super.destroy();let a=r.getContainer(this.position);a&&a.childElementCount===0&&a.parentNode&&(a.parentNode.removeChild(a),r._containers&&delete r._containers[this.position||"top-right"])};e.addEventListener("animationend",t),setTimeout(t,320)}static getContainer(e){let t=e||"top-right";if(this._containers||(this._containers={}),this._containers[t]&&document.body.contains(this._containers[t]))return this._containers[t];let a=S("div",{className:_("fixed z-50 p-2 flex flex-col gap-2 pointer-events-none",this.getPositionClassesForContainer(t))});return document.body.appendChild(a),this._containers[t]=a,a}static getPositionClassesForContainer(e){switch(e){case"top-left":return"top-4 left-4 items-start";case"top-right":return"top-4 right-4 items-end";case"bottom-left":return"bottom-4 left-4 items-start";case"bottom-right":return"bottom-4 right-4 items-end";case"top-center":return"top-4 left-1/2 -translate-x-1/2 items-center transform";default:return"top-4 right-4 items-end"}}create(){let e=r.getContainer(this.position),t=S("div",{className:_("rounded-lg shadow-lg p-2.5 flex items-center gap-2 min-w-0 max-w-[90vw] sm:max-w-sm bg-opacity-95",this.getEnterAnimationClass(),this.getTypeClasses(),this.className)}),a=S("span",{className:"text-base flex-shrink-0",text:this.getIcon()});t.appendChild(a);let u=S("span",{text:this.message,className:"flex-1 text-sm sm:text-base"});t.appendChild(u);let h=S("button",{className:"text-base hover:opacity-70 transition-opacity flex-shrink-0",text:"\xD7"});for(h.addEventListener("click",()=>{this.destroy()}),t.appendChild(h),this.element=t,e.appendChild(this.element);e.children.length>3;)e.removeChild(e.firstElementChild);return this.duration>0&&setTimeout(()=>{this.destroy()},this.duration),this.element}getEnterAnimationClass(){let e=this.position||"top-right";return e==="top-right"||e==="bottom-right"?"animate-slide-in-right transition-all duration-300 pointer-events-auto":e==="top-left"||e==="bottom-left"?"animate-slide-in-left transition-all duration-300 pointer-events-auto":"animate-slide-in-top transition-all duration-300 pointer-events-auto"}getExitAnimationClass(){let e=this.position||"top-right";return e==="top-right"||e==="bottom-right"?"animate-slide-out-right":e==="top-left"||e==="bottom-left"?"animate-slide-out-left":"animate-slide-out-top"}getPositionClasses(){let e={"top-left":"top-4 left-4","top-right":"top-4 right-4","bottom-left":"bottom-4 left-4","bottom-right":"bottom-4 right-4","top-center":"top-4 left-1/2 -translate-x-1/2 transform"};return e[this.position]||e["bottom-right"]}getTypeClasses(){let e={default:"bg-gray-900 text-white",success:"bg-green-600 text-white",error:"bg-red-600 text-white",warning:"bg-yellow-600 text-white",info:"bg-blue-600 text-white"};return e[this.type]||e.default}getIcon(){let e={default:"\u2139",success:"\u2713",error:"\u2715",warning:"\u26A0",info:"\u2139"};return e[this.type]||e.default}static show(e,t={}){let a=new r({message:e,...t}),u=a.create();return a}};if(!document.querySelector("style[data-toast]")){let r=document.createElement("style");r.setAttribute("data-toast","true"),r.textContent=`
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
  `,document.head.appendChild(r)}});function Yt({root:r=document,selector:e="[data-hydrate]",threshold:t=.15}={}){if(typeof IntersectionObserver>"u")return;let a=new IntersectionObserver(async(u,h)=>{for(let b of u){if(!b.isIntersecting)continue;let w=b.target,A=w.dataset.hydrate||"",[I,P="init"]=A.split("#");if(!I){h.unobserve(w);continue}try{let $=null,o=Ds[I];if(typeof o=="function")$=await o();else throw new Error("Module not registered for lazy hydration: "+I);let g=$[P]||$.default||null;if(typeof g=="function")try{g(w)}catch(i){console.error("hydrate init failed",i)}}catch($){console.error("lazy hydrate import failed for",I,$)}finally{h.unobserve(w)}}},{threshold:t});r.querySelectorAll(e).forEach(u=>a.observe(u))}var Ds,Qt=M(()=>{Ds={"components/Alert.js":()=>Promise.resolve().then(()=>(qe(),Me)),"components/AlertDialog.js":()=>Promise.resolve().then(()=>(Fe(),je)),"components/Avatar.js":()=>Promise.resolve().then(()=>(Oe(),ze)),"components/Badge.js":()=>Promise.resolve().then(()=>(De(),Re)),"components/Button.js":()=>Promise.resolve().then(()=>(Ue(),Ve)),"components/ButtonGroup.js":()=>Promise.resolve().then(()=>(Ge(),We)),"components/Breadcrumb.js":()=>Promise.resolve().then(()=>(Qe(),Ye)),"components/Card.js":()=>Promise.resolve().then(()=>(Je(),Xe)),"components/Carousel.js":()=>Promise.resolve().then(()=>(Ze(),Ke)),"components/Chart.js":()=>Promise.resolve().then(()=>(tt(),et)),"components/Checkbox.js":()=>Promise.resolve().then(()=>(at(),st)),"components/Collapsible.js":()=>Promise.resolve().then(()=>(nt(),rt)),"components/Command.js":()=>Promise.resolve().then(()=>(ot(),it)),"components/Combobox.js":()=>Promise.resolve().then(()=>(ct(),lt)),"components/ContextMenu.js":()=>Promise.resolve().then(()=>(ut(),dt)),"components/DatePicker.js":()=>Promise.resolve().then(()=>(pt(),mt)),"components/Dialog.js":()=>Promise.resolve().then(()=>(ht(),gt)),"components/DropdownMenu.js":()=>Promise.resolve().then(()=>(yt(),ft)),"components/Drawer.js":()=>Promise.resolve().then(()=>(vt(),bt)),"components/Empty.js":()=>Promise.resolve().then(()=>(wt(),xt)),"components/Form.js":()=>Promise.resolve().then(()=>(Ct(),kt)),"components/HoverCard.js":()=>Promise.resolve().then(()=>(Lt(),Et)),"components/Input.js":()=>Promise.resolve().then(()=>(_t(),$t)),"components/InputGroup.js":()=>Promise.resolve().then(()=>(At(),Tt)),"components/InputOTP.js":()=>Promise.resolve().then(()=>(It(),Bt)),"components/Item.js":()=>Promise.resolve().then(()=>(Ht(),St)),"components/Label.js":()=>Promise.resolve().then(()=>(Nt(),Pt)),"components/Kbd.js":()=>Promise.resolve().then(()=>(qt(),Mt)),"components/NativeSelect.js":()=>Promise.resolve().then(()=>(Ft(),jt)),"components/Tooltip.js":()=>Promise.resolve().then(()=>(Ot(),zt)),"components/Toggle.js":()=>Promise.resolve().then(()=>(Dt(),Rt)),"components/ToggleGroup.js":()=>Promise.resolve().then(()=>(Ut(),Vt)),"components/Toast.js":()=>Promise.resolve().then(()=>(Gt(),Wt))}});var Jt={};F(Jt,{default:()=>Vs});var Xt,Vs,Kt=M(()=>{Xt=(function(){"use strict";let r=null;async function e(){if(AuthGuard.protectPage()){await t();try{w()}catch{}a(),b(),A(),I()}}async function t(){if(AuthApi.isAuthenticated())try{r=(await AuthApi.getProfile()).data,u()}catch{Toast.error("Failed to load profile.")}}function a(){let i=document.querySelectorAll("[data-profile-tab]"),s=document.querySelectorAll("[data-profile-panel]");if(!i.length||!s.length)return;let l=y=>{s.forEach(f=>{f.classList.toggle("hidden",f.dataset.profilePanel!==y)}),i.forEach(f=>{let p=f.dataset.profileTab===y;f.classList.toggle("bg-amber-600",p),f.classList.toggle("text-white",p),f.classList.toggle("shadow-sm",p),f.classList.toggle("text-stone-700",!p),f.classList.toggle("dark:text-stone-200",!p)}),localStorage.setItem("profileTab",y)},c=localStorage.getItem("profileTab")||"overview";l(c),i.forEach(y=>{y.addEventListener("click",()=>{l(y.dataset.profileTab)})})}function u(){let i=document.getElementById("profile-info");if(!i||!r)return;let s=`${Templates.escapeHtml(r.first_name||"")} ${Templates.escapeHtml(r.last_name||"")}`.trim()||Templates.escapeHtml(r.email||"User"),l=Templates.formatDate(r.created_at||r.date_joined),c=r.avatar?`<img id="avatar-preview" src="${r.avatar}" alt="Profile" class="w-full h-full object-cover">`:`
            <span class="flex h-full w-full items-center justify-center text-3xl font-semibold text-stone-500">
                ${(r.first_name?.[0]||r.email?.[0]||"U").toUpperCase()}
            </span>`;i.innerHTML=`
            <div class="absolute inset-0 bg-gradient-to-r from-amber-50/80 via-amber-100/60 to-transparent dark:from-amber-900/20 dark:via-amber-800/10" aria-hidden="true"></div>
            <div class="relative flex flex-col gap-4 md:flex-row md:items-center md:gap-6">
                <div class="relative">
                    <div class="w-24 h-24 rounded-2xl ring-4 ring-amber-100 dark:ring-amber-900/40 overflow-hidden bg-stone-100 dark:bg-stone-800">
                        ${c}
                    </div>
                </div>
                <div class="flex-1 min-w-0">
                    <p class="text-sm font-semibold text-amber-700 dark:text-amber-300">Profile</p>
                    <h1 class="text-2xl font-bold text-stone-900 dark:text-white leading-tight truncate">${s}</h1>
                    <p class="text-sm text-stone-600 dark:text-stone-300 truncate">${Templates.escapeHtml(r.email)}</p>
                    <p class="text-xs text-stone-500 dark:text-stone-400 mt-1">Member since ${l}</p>
                    <div class="flex flex-wrap gap-2 mt-4">
                        <button type="button" id="change-avatar-btn" class="btn btn-primary btn-sm">Update photo</button>
                        ${r.avatar?'<button type="button" id="remove-avatar-btn" class="btn btn-ghost btn-sm text-red-600 hover:text-red-700 dark:text-red-400">Remove photo</button>':""}
                    </div>
                    <p class="text-xs text-stone-500 dark:text-stone-400 mt-3">JPG, GIF or PNG. Max size 5MB.</p>
                </div>
            </div>
        `,w()}function h(){Tabs.init()}function b(){let i=document.getElementById("profile-form");if(!i||!r)return;let s=document.getElementById("profile-first-name"),l=document.getElementById("profile-last-name"),c=document.getElementById("profile-email"),y=document.getElementById("profile-phone");s&&(s.value=r.first_name||""),l&&(l.value=r.last_name||""),c&&(c.value=r.email||""),y&&(y.value=r.phone||""),i.addEventListener("submit",async f=>{f.preventDefault();let p=new FormData(i),m={first_name:p.get("first_name"),last_name:p.get("last_name"),phone:p.get("phone")},x=i.querySelector('button[type="submit"]');x.disabled=!0,x.textContent="Saving...";try{await AuthApi.updateProfile(m),Toast.success("Profile updated successfully!"),await t()}catch(v){Toast.error(v.message||"Failed to update profile.")}finally{x.disabled=!1,x.textContent="Save Changes"}})}function w(){let i=document.getElementById("avatar-input"),s=document.getElementById("change-avatar-btn"),l=document.getElementById("remove-avatar-btn");i||(i=document.createElement("input"),i.type="file",i.id="avatar-input",i.name="avatar",i.accept="image/*",i.className="hidden",document.body.appendChild(i)),document.querySelectorAll("#change-avatar-btn").forEach(f=>f.addEventListener("click",()=>i.click())),document.querySelectorAll("#remove-avatar-btn").forEach(f=>f.addEventListener("click",()=>{typeof window.removeAvatar=="function"&&window.removeAvatar()})),i.removeEventListener?.("change",window._avatarChangeHandler),window._avatarChangeHandler=async function(f){let p=f.target.files?.[0];if(p){if(!p.type.startsWith("image/")){Toast.error("Please select an image file.");return}if(p.size>5242880){Toast.error("Image must be smaller than 5MB.");return}try{await AuthApi.uploadAvatar(p),Toast.success("Avatar updated!"),await t()}catch(m){Toast.error(m.message||"Failed to update avatar.")}}},i.addEventListener("change",window._avatarChangeHandler)}function A(){let i=document.getElementById("password-form");i&&i.addEventListener("submit",async s=>{s.preventDefault();let l=new FormData(i),c=l.get("current_password"),y=l.get("new_password"),f=l.get("confirm_password");if(y!==f){Toast.error("Passwords do not match.");return}if(y.length<8){Toast.error("Password must be at least 8 characters.");return}let p=i.querySelector('button[type="submit"]');p.disabled=!0,p.textContent="Updating...";try{await AuthApi.changePassword(c,y),Toast.success("Password updated successfully!"),i.reset()}catch(m){Toast.error(m.message||"Failed to update password.")}finally{p.disabled=!1,p.textContent="Update Password"}})}function I(){P(),document.getElementById("add-address-btn")?.addEventListener("click",()=>{o()})}async function P(){let i=document.getElementById("addresses-list");if(i){Loader.show(i,"spinner");try{let l=(await AuthApi.getAddresses()).data||[];if(l.length===0){i.innerHTML=`
                    <div class="text-center py-8">
                        <svg class="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
                        </svg>
                        <p class="text-gray-500">No saved addresses yet.</p>
                    </div>
                `;return}i.innerHTML=`
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    ${l.map(c=>`
                        <div class="p-4 border border-gray-200 rounded-lg relative" data-address-id="${c.id}">
                            ${c.is_default?`
                                <span class="absolute top-2 right-2 px-2 py-0.5 bg-primary-100 text-primary-700 text-xs rounded">Default</span>
                            `:""}
                            <p class="font-medium text-gray-900">${Templates.escapeHtml(c.full_name||`${c.first_name} ${c.last_name}`)}</p>
                            <p class="text-sm text-gray-600 mt-1">${Templates.escapeHtml(c.address_line_1)}</p>
                            ${c.address_line_2?`<p class="text-sm text-gray-600">${Templates.escapeHtml(c.address_line_2)}</p>`:""}
                            <p class="text-sm text-gray-600">${Templates.escapeHtml(c.city)}, ${Templates.escapeHtml(c.state||"")} ${Templates.escapeHtml(c.postal_code)}</p>
                            <p class="text-sm text-gray-600">${Templates.escapeHtml(c.country)}</p>
                            ${c.phone?`<p class="text-sm text-gray-600 mt-1">${Templates.escapeHtml(c.phone)}</p>`:""}
                            
                            <div class="mt-4 flex gap-2">
                                <button class="edit-address-btn text-sm text-primary-600 hover:text-primary-700" data-address-id="${c.id}">Edit</button>
                                ${c.is_default?"":`
                                    <button class="set-default-btn text-sm text-gray-600 hover:text-gray-700" data-address-id="${c.id}">Set as Default</button>
                                `}
                                <button class="delete-address-btn text-sm text-red-600 hover:text-red-700" data-address-id="${c.id}">Delete</button>
                            </div>
                        </div>
                    `).join("")}
                </div>
            `,$()}catch(s){console.error("Failed to load addresses:",s),i.innerHTML='<p class="text-red-500">Failed to load addresses.</p>'}}}function $(){document.querySelectorAll(".edit-address-btn").forEach(i=>{i.addEventListener("click",async()=>{let s=i.dataset.addressId;try{let l=await AuthApi.getAddress(s);o(l.data)}catch{Toast.error("Failed to load address.")}})}),document.querySelectorAll(".set-default-btn").forEach(i=>{i.addEventListener("click",async()=>{let s=i.dataset.addressId;try{await AuthApi.setDefaultAddress(s),Toast.success("Default address updated."),await P()}catch{Toast.error("Failed to update default address.")}})}),document.querySelectorAll(".delete-address-btn").forEach(i=>{i.addEventListener("click",async()=>{let s=i.dataset.addressId;if(await Modal.confirm({title:"Delete Address",message:"Are you sure you want to delete this address?",confirmText:"Delete",cancelText:"Cancel"}))try{await AuthApi.deleteAddress(s),Toast.success("Address deleted."),await P()}catch{Toast.error("Failed to delete address.")}})})}function o(i=null){let s=!!i;Modal.open({title:s?"Edit Address":"Add New Address",content:`
                <form id="address-modal-form" class="space-y-4">
                    <div class="grid grid-cols-2 gap-4">
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">First Name *</label>
                            <input type="text" name="first_name" value="${i?.first_name||""}" required class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500">
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">Last Name *</label>
                            <input type="text" name="last_name" value="${i?.last_name||""}" required class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500">
                        </div>
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                        <input type="tel" name="phone" value="${i?.phone||""}" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500">
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Address Line 1 *</label>
                        <input type="text" name="address_line_1" value="${i?.address_line_1||""}" required class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500">
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Address Line 2</label>
                        <input type="text" name="address_line_2" value="${i?.address_line_2||""}" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500">
                    </div>
                    <div class="grid grid-cols-2 gap-4">
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">City *</label>
                            <input type="text" name="city" value="${i?.city||""}" required class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500">
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">State/Province</label>
                            <input type="text" name="state" value="${i?.state||""}" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500">
                        </div>
                    </div>
                    <div class="grid grid-cols-2 gap-4">
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">Postal Code *</label>
                            <input type="text" name="postal_code" value="${i?.postal_code||""}" required class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500">
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">Country *</label>
                            <select name="country" required class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500">
                                <option value="">Select country</option>
                                <option value="BD" ${i?.country==="BD"?"selected":""}>Bangladesh</option>
                                <option value="US" ${i?.country==="US"?"selected":""}>United States</option>
                                <option value="UK" ${i?.country==="UK"?"selected":""}>United Kingdom</option>
                                <option value="CA" ${i?.country==="CA"?"selected":""}>Canada</option>
                                <option value="AU" ${i?.country==="AU"?"selected":""}>Australia</option>
                            </select>
                        </div>
                    </div>
                    <div>
                        <label class="flex items-center">
                            <input type="checkbox" name="is_default" ${i?.is_default?"checked":""} class="text-primary-600 focus:ring-primary-500 rounded">
                            <span class="ml-2 text-sm text-gray-600">Set as default address</span>
                        </label>
                    </div>
                </form>
            `,confirmText:s?"Save Changes":"Add Address",onConfirm:async()=>{let l=document.getElementById("address-modal-form"),c=new FormData(l),y={first_name:c.get("first_name"),last_name:c.get("last_name"),phone:c.get("phone"),address_line_1:c.get("address_line_1"),address_line_2:c.get("address_line_2"),city:c.get("city"),state:c.get("state"),postal_code:c.get("postal_code"),country:c.get("country"),is_default:c.get("is_default")==="on"};try{return s?(await AuthApi.updateAddress(i.id,y),Toast.success("Address updated!")):(await AuthApi.addAddress(y),Toast.success("Address added!")),await P(),!0}catch(f){return Toast.error(f.message||"Failed to save address."),!1}}})}function g(){r=null}return{init:e,destroy:g}})();window.AccountPage=Xt;Vs=Xt});var es={};F(es,{default:()=>Us});var Zt,Us,ts=M(()=>{Zt=(function(){"use strict";let r=null;function e(){}function t(s){if(s==null||s==="")return 0;if(typeof s=="number"&&Number.isFinite(s))return s;let l=parseFloat(s);return Number.isFinite(l)?l:0}function a(s){let l=t(s);return Templates.formatPrice(l)}async function u(){await h(),o()}async function h(){let s=document.getElementById("cart-container");if(s){Loader.show(s,"skeleton");try{r=(await CartApi.getCart()).data,b(r)}catch(l){console.error("Failed to load cart:",l),s.innerHTML='<p class="text-red-500 text-center py-8">Failed to load cart. Please try again.</p>'}}}function b(s){let l=document.getElementById("cart-container");if(!l)return;let c=s?.items||[],y=s?.summary||{},f=y.subtotal??s?.subtotal??0,p=t(y.discount_amount??s?.discount_amount),m=y.tax_amount??s?.tax_amount??0,x=y.total??s?.total??0,v=s?.coupon?.code||"";if(c.length===0){l.innerHTML=`
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
            `;return}l.innerHTML=`
            <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <!-- Cart Items -->
                <div class="lg:col-span-2">
                    <div class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                        <div class="px-6 py-4 border-b border-gray-100">
                            <h2 class="text-lg font-semibold text-gray-900">Shopping Cart (${c.length} items)</h2>
                        </div>
                        <div id="cart-items" class="divide-y divide-gray-100">
                            ${c.map(k=>w(k)).join("")}
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
                </div>

                <!-- Order Summary -->
                <div class="lg:col-span-1">
                    <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6 sticky top-4">
                        <h3 class="text-lg font-semibold text-gray-900 mb-4">Order Summary</h3>
                        
                        <div class="space-y-3 text-sm">
                            <div class="flex justify-between">
                                <span class="text-gray-600">Subtotal</span>
                                <span class="font-medium text-gray-900">${a(f)}</span>
                            </div>
                            ${p>0?`
                                <div class="flex justify-between text-green-600">
                                    <span>Discount</span>
                                    <span>-${a(p)}</span>
                                </div>
                            `:""}
                            ${t(m)>0?`
                                <div class="flex justify-between">
                                    <span class="text-gray-600">Tax</span>
                                    <span class="font-medium text-gray-900">${a(m)}</span>
                                </div>
                            `:""}
                            <div class="pt-3 border-t border-gray-200">
                                <div class="flex justify-between">
                                    <span class="text-base font-semibold text-gray-900">Total</span>
                                    <span class="text-base font-bold text-gray-900">${a(x)}</span>
                                </div>
                                <p class="text-xs text-gray-500 mt-1">Shipping calculated at checkout</p>
                            </div>
                        </div>

                        <!-- Coupon Form -->
                        <div class="mt-6 pt-6 border-t border-gray-200">
                            ${v?`
                                <div class="flex items-center justify-between px-3 py-2 bg-green-50 rounded-lg">
                                    <div>
                                        <p class="text-sm font-medium text-green-700">Coupon applied</p>
                                        <p class="text-xs text-green-600">${Templates.escapeHtml(v)}</p>
                                    </div>
                                    <button id="remove-coupon-btn" class="text-green-600 hover:text-green-700" aria-label="Remove coupon">
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
                                        class="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-primary-500 focus:border-primary-500"
                                        value="${Templates.escapeHtml(v)}"
                                    >
                                    <button type="submit" class="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-lg transition-colors text-sm">
                                        Apply
                                    </button>
                                </form>
                            `}
                        </div>

                        <!-- Checkout Button -->
                        <a href="${window.BUNORAA_CART&&window.BUNORAA_CART.checkoutUrl?window.BUNORAA_CART.checkoutUrl:"/checkout/"}" class="mt-6 w-full px-6 py-3 bg-primary-600 text-white font-semibold rounded-lg hover:bg-primary-700 transition-colors flex items-center justify-center gap-2">
                            Proceed to Checkout
                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3"/>
                            </svg>
                        </a>

                        <!-- Trust Badges -->
                        <div class="mt-6 pt-6 border-t border-gray-200">
                            <div class="flex items-center justify-center gap-4 text-gray-400">
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
        `,A()}function w(s){let l=s.product||{},c=s.variant,y=l.slug||"#",f=l.name||"Product",p=l.primary_image||l.image||"/static/images/placeholder.png",m=t(s.price_at_add),x=t(s.current_price),v=t(s.line_total)||x*(s.quantity||1),k=m>x;return`
            <div class="cart-item p-6 flex gap-4" data-item-id="${s.id}">
                <div class="flex-shrink-0 w-24 h-24 bg-gray-100 rounded-lg overflow-hidden">
                    <a href="/products/${y}/">
                        <img 
                            src="${p}" 
                            alt="${Templates.escapeHtml(f)}"
                            class="w-full h-full object-cover"
                        >
                    </a>
                </div>
                <div class="flex-1 min-w-0">
                    <div class="flex justify-between">
                        <div>
                            <h3 class="font-medium text-gray-900">
                                <a href="/products/${y}/" class="hover:text-primary-600">
                                    ${Templates.escapeHtml(f)}
                                </a>
                            </h3>
                            ${c?`
                                <p class="text-sm text-gray-500 mt-1">${Templates.escapeHtml(c.name||c.value)}</p>
                            `:""}
                        </div>
                        <button class="remove-item-btn text-gray-400 hover:text-red-500 transition-colors" aria-label="Remove item">
                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                            </svg>
                        </button>
                    </div>
                    <div class="mt-4 flex items-center justify-between">
                        <div class="flex items-center border border-gray-300 rounded-lg">
                            <button 
                                class="qty-decrease px-3 py-1 text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors"
                                aria-label="Decrease quantity"
                            >
                                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4"/>
                                </svg>
                            </button>
                            <input 
                                type="number" 
                                class="item-quantity w-12 text-center border-0 focus:ring-0 text-sm"
                                value="${s.quantity}" 
                                min="1" 
                                max="${l.stock_quantity||99}"
                            >
                            <button 
                                class="qty-increase px-3 py-1 text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors"
                                aria-label="Increase quantity"
                            >
                                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
                                </svg>
                            </button>
                        </div>
                        <div class="text-right">
                            ${k?`
                                <span class="text-sm text-gray-400 line-through">${a(m*s.quantity)}</span>
                            `:""}
                            <span class="font-semibold text-gray-900 block">${a(v)}</span>
                        </div>
                    </div>
                </div>
            </div>
        `}function A(){let s=document.getElementById("cart-items"),l=document.getElementById("clear-cart-btn"),c=document.getElementById("remove-coupon-btn");s?.addEventListener("click",async y=>{let f=y.target.closest(".cart-item");if(!f)return;let p=f.dataset.itemId,m=f.querySelector(".item-quantity");if(y.target.closest(".remove-item-btn"))await P(p);else if(y.target.closest(".qty-decrease")){let x=parseInt(m.value)||1;x>1&&await I(p,x-1)}else if(y.target.closest(".qty-increase")){let x=parseInt(m.value)||1,v=parseInt(m.max)||99;x<v&&await I(p,x+1)}}),s?.addEventListener("change",async y=>{if(y.target.classList.contains("item-quantity")){let p=y.target.closest(".cart-item")?.dataset.itemId,m=parseInt(y.target.value)||1;p&&m>0&&await I(p,m)}}),l?.addEventListener("click",async()=>{await Modal.confirm({title:"Clear Cart",message:"Are you sure you want to remove all items from your cart?",confirmText:"Clear Cart",cancelText:"Cancel"})&&await $()}),c?.addEventListener("click",async()=>{await g()})}async function I(s,l){try{await CartApi.updateItem(s,l),await h(),document.dispatchEvent(new CustomEvent("cart:updated"))}catch(c){Toast.error(c.message||"Failed to update quantity.")}}async function P(s){try{await CartApi.removeItem(s),Toast.success("Item removed from cart."),await h(),document.dispatchEvent(new CustomEvent("cart:updated"))}catch(l){Toast.error(l.message||"Failed to remove item.")}}async function $(){try{await CartApi.clearCart(),Toast.success("Cart cleared."),await h(),document.dispatchEvent(new CustomEvent("cart:updated"))}catch(s){Toast.error(s.message||"Failed to clear cart.")}}function o(){let s=document.getElementById("coupon-form");s?.addEventListener("submit",async l=>{l.preventDefault();let y=document.getElementById("coupon-code")?.value.trim();if(!y){Toast.error("Please enter a coupon code.");return}let f=s.querySelector('button[type="submit"]');f.disabled=!0,f.textContent="Applying...";try{await CartApi.applyCoupon(y),Toast.success("Coupon applied!"),await h()}catch(p){Toast.error(p.message||"Invalid coupon code.")}finally{f.disabled=!1,f.textContent="Apply"}})}async function g(){try{await CartApi.removeCoupon(),Toast.success("Coupon removed."),await h()}catch(s){Toast.error(s.message||"Failed to remove coupon.")}}function i(){r=null}return{init:u,destroy:i}})();window.CartPage=Zt;Us=Zt});var as={};F(as,{default:()=>Ws});var ss,Ws,rs=M(()=>{ss=(function(){"use strict";let r={},e=1,t=null,a=null,u=!1;async function h(){if(u)return;u=!0;let v=b();if(!v)return;let k=document.getElementById("category-header");if(k&&k.querySelector("h1")){f(),p(),m();return}r=w(),e=parseInt(new URLSearchParams(window.location.search).get("page"))||1,await A(v),f(),p(),m()}function b(){let k=window.location.pathname.match(/\/categories\/([^\/]+)/);return k?k[1]:null}function w(){let v=new URLSearchParams(window.location.search),k={};v.get("min_price")&&(k.min_price=v.get("min_price")),v.get("max_price")&&(k.max_price=v.get("max_price")),v.get("ordering")&&(k.ordering=v.get("ordering")),v.get("in_stock")&&(k.in_stock=v.get("in_stock")==="true"),v.get("on_sale")&&(k.on_sale=v.get("on_sale")==="true");let B=v.getAll("attr");return B.length&&(k.attributes=B),k}async function A(v){let k=document.getElementById("category-header"),B=document.getElementById("category-products"),q=document.getElementById("category-filters");k&&Loader.show(k,"skeleton"),B&&Loader.show(B,"skeleton");try{let n=await CategoriesApi.getCategory(v);if(t=n.data||n,!t){window.location.href="/404/";return}I(t),await P(t),await $(t),await l(),await y(t)}catch(n){console.error("Failed to load category:",n),k&&(k.innerHTML='<p class="text-red-500">Failed to load category.</p>')}}function I(v){let k=document.getElementById("category-header");k&&(document.title=`${v.name} | Bunoraa`,k.innerHTML=`
            <div class="relative py-8 md:py-12">
                ${v.image?`
                    <div class="absolute inset-0 overflow-hidden rounded-2xl">
                        <img src="${v.image}" alt="" class="w-full h-full object-cover opacity-20">
                        <div class="absolute inset-0 bg-gradient-to-r from-white via-white/95 to-white/80"></div>
                    </div>
                `:""}
                <div class="relative">
                    <h1 class="text-3xl md:text-4xl font-bold text-gray-900 mb-2">${Templates.escapeHtml(v.name)}</h1>
                    ${v.description?`
                        <p class="text-gray-600 max-w-2xl">${Templates.escapeHtml(v.description)}</p>
                    `:""}
                    ${v.product_count?`
                        <p class="mt-4 text-sm text-gray-500">${v.product_count} products</p>
                    `:""}
                </div>
            </div>
        `)}async function P(v){let k=document.getElementById("breadcrumbs");if(k)try{let q=(await CategoriesApi.getBreadcrumbs(v.id)).data||[],n=[{label:"Home",url:"/"},{label:"Categories",url:"/categories/"},...q.map(d=>({label:d.name,url:`/categories/${d.slug}/`}))];k.innerHTML=Breadcrumb.render(n)}catch(B){console.error("Failed to load breadcrumbs:",B)}}async function $(v){let k=document.getElementById("category-filters");if(k)try{let q=(await ProductsApi.getFilterOptions({category:v.id})).data||{};k.innerHTML=`
                <div class="space-y-6">
                    <!-- Price Range -->
                    <div class="border-b border-gray-200 pb-6">
                        <h3 class="text-sm font-semibold text-gray-900 mb-4">Price Range</h3>
                        <div class="flex items-center gap-2">
                            <input 
                                type="number" 
                                id="filter-min-price" 
                                placeholder="Min"
                                value="${r.min_price||""}"
                                class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-primary-500 focus:border-primary-500"
                            >
                            <span class="text-gray-400">-</span>
                            <input 
                                type="number" 
                                id="filter-max-price" 
                                placeholder="Max"
                                value="${r.max_price||""}"
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
                                    ${r.in_stock?"checked":""}
                                    class="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                                >
                                <span class="ml-2 text-sm text-gray-600">In Stock</span>
                            </label>
                            <label class="flex items-center">
                                <input 
                                    type="checkbox" 
                                    id="filter-on-sale"
                                    ${r.on_sale?"checked":""}
                                    class="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                                >
                                <span class="ml-2 text-sm text-gray-600">On Sale</span>
                            </label>
                        </div>
                    </div>

                    ${q.attributes&&q.attributes.length?`
                        ${q.attributes.map(n=>`
                            <div class="border-b border-gray-200 pb-6">
                                <h3 class="text-sm font-semibold text-gray-900 mb-4">${Templates.escapeHtml(n.name)}</h3>
                                <div class="space-y-2 max-h-48 overflow-y-auto">
                                    ${n.values.map(d=>`
                                        <label class="flex items-center">
                                            <input 
                                                type="checkbox" 
                                                name="attr-${n.slug}"
                                                value="${Templates.escapeHtml(d.value)}"
                                                ${r.attributes?.includes(`${n.slug}:${d.value}`)?"checked":""}
                                                class="filter-attribute w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                                                data-attribute="${n.slug}"
                                            >
                                            <span class="ml-2 text-sm text-gray-600">${Templates.escapeHtml(d.value)}</span>
                                            ${d.count?`<span class="ml-auto text-xs text-gray-400">(${d.count})</span>`:""}
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
            `,o()}catch(B){console.error("Failed to load filters:",B),k.innerHTML=""}}function o(){let v=document.getElementById("apply-price-filter"),k=document.getElementById("filter-in-stock"),B=document.getElementById("filter-on-sale"),q=document.getElementById("clear-filters"),n=document.querySelectorAll(".filter-attribute");v?.addEventListener("click",()=>{let d=document.getElementById("filter-min-price")?.value,E=document.getElementById("filter-max-price")?.value;d?r.min_price=d:delete r.min_price,E?r.max_price=E:delete r.max_price,i()}),k?.addEventListener("change",d=>{d.target.checked?r.in_stock=!0:delete r.in_stock,i()}),B?.addEventListener("change",d=>{d.target.checked?r.on_sale=!0:delete r.on_sale,i()}),n.forEach(d=>{d.addEventListener("change",()=>{g(),i()})}),q?.addEventListener("click",()=>{r={},e=1,i()})}function g(){let v=document.querySelectorAll(".filter-attribute:checked"),k=[];v.forEach(B=>{k.push(`${B.dataset.attribute}:${B.value}`)}),k.length?r.attributes=k:delete r.attributes}function i(){e=1,s(),l()}function s(){let v=new URLSearchParams;r.min_price&&v.set("min_price",r.min_price),r.max_price&&v.set("max_price",r.max_price),r.ordering&&v.set("ordering",r.ordering),r.in_stock&&v.set("in_stock","true"),r.on_sale&&v.set("on_sale","true"),r.attributes&&r.attributes.forEach(B=>v.append("attr",B)),e>1&&v.set("page",e);let k=`${window.location.pathname}${v.toString()?"?"+v.toString():""}`;window.history.pushState({},"",k)}async function l(){let v=document.getElementById("category-products");if(!(!v||!t)){a&&a.abort(),a=new AbortController,Loader.show(v,"skeleton");try{let k={category:t.id,page:e,limit:12,...r};r.attributes&&(delete k.attributes,r.attributes.forEach(d=>{let[E,C]=d.split(":");k[`attr_${E}`]=C}));let B=await ProductsApi.getAll(k),q=B.data||[],n=B.meta||{};c(q,n)}catch(k){if(k.name==="AbortError")return;console.error("Failed to load products:",k),v.innerHTML='<p class="text-red-500 text-center py-8">Failed to load products. Please try again.</p>'}}}function c(v,k){let B=document.getElementById("category-products");if(!B)return;let q=Storage.get("productViewMode")||"grid",n=q==="list"?"space-y-4":"grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6";if(v.length===0){B.innerHTML=`
                <div class="text-center py-12">
                    <svg class="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                    </svg>
                    <h3 class="text-lg font-medium text-gray-900 mb-2">No products found</h3>
                    <p class="text-gray-500 mb-4">Try adjusting your filters or browse other categories.</p>
                    <button id="clear-filters-empty" class="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors">
                        Clear Filters
                    </button>
                </div>
            `,document.getElementById("clear-filters-empty")?.addEventListener("click",()=>{r={},e=1,i()});return}if(B.innerHTML=`
            <div class="${n}">
                ${v.map(d=>ProductCard.render(d,{layout:q})).join("")}
            </div>
            ${k.total_pages>1?`
                <div id="products-pagination" class="mt-8"></div>
            `:""}
        `,ProductCard.bindEvents(B),k.total_pages>1){let d=document.getElementById("products-pagination");d.innerHTML=Pagination.render({currentPage:k.current_page||e,totalPages:k.total_pages,totalItems:k.total}),d.addEventListener("click",E=>{let C=E.target.closest("[data-page]");C&&(e=parseInt(C.dataset.page),s(),l(),window.scrollTo({top:0,behavior:"smooth"}))})}}async function y(v){let k=document.getElementById("subcategories");if(k)try{let q=(await CategoriesApi.getSubcategories(v.id)).data||[];if(q.length===0){k.innerHTML="";return}k.innerHTML=`
                <div class="mb-8">
                    <h2 class="text-lg font-semibold text-gray-900 mb-4">Browse Subcategories</h2>
                    <div class="flex flex-wrap gap-2">
                        ${q.map(n=>`
                            <a href="/categories/${n.slug}/" class="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-full text-sm transition-colors">
                                ${Templates.escapeHtml(n.name)}
                                ${n.product_count?`<span class="text-gray-400 ml-1">(${n.product_count})</span>`:""}
                            </a>
                        `).join("")}
                    </div>
                </div>
            `}catch(B){console.error("Failed to load subcategories:",B),k.innerHTML=""}}function f(){let v=document.getElementById("mobile-filter-btn"),k=document.getElementById("filter-sidebar"),B=document.getElementById("close-filter-btn");v?.addEventListener("click",()=>{k?.classList.remove("hidden"),document.body.classList.add("overflow-hidden")}),B?.addEventListener("click",()=>{k?.classList.add("hidden"),document.body.classList.remove("overflow-hidden")})}function p(){let v=document.getElementById("sort-select");v&&(v.value=r.ordering||"",v.addEventListener("change",k=>{k.target.value?r.ordering=k.target.value:delete r.ordering,i()}))}function m(){let v=document.getElementById("view-grid"),k=document.getElementById("view-list");(Storage.get("productViewMode")||"grid")==="list"&&(v?.classList.remove("bg-gray-200"),k?.classList.add("bg-gray-200")),v?.addEventListener("click",()=>{Storage.set("productViewMode","grid"),v.classList.add("bg-gray-200"),k?.classList.remove("bg-gray-200"),l()}),k?.addEventListener("click",()=>{Storage.set("productViewMode","list"),k.classList.add("bg-gray-200"),v?.classList.remove("bg-gray-200"),l()})}function x(){a&&(a.abort(),a=null),r={},e=1,t=null,u=!1}return{init:h,destroy:x}})();window.CategoryPage=ss;Ws=ss});var is={};F(is,{default:()=>Gs});var ns,Gs,os=M(()=>{ns=(async function(){"use strict";let r=null,e={shipping_address:null,billing_address:null,same_as_shipping:!0,shipping_method:null,payment_method:null,notes:""},t=1;async function a(){if(!AuthApi.isAuthenticated()&&!document.getElementById("guest-checkout")){Toast.info("Please login to continue checkout."),window.location.href="/account/login/?next=/checkout/";return}if(await u(),!r||!r.items||r.items.length===0){Toast.warning("Your cart is empty."),window.location.href="/cart/";return}await b(),A(),x(),p()}async function u(){try{r=(await CartApi.getCart()).data,h()}catch(n){console.error("Failed to load cart:",n),Toast.error("Failed to load cart.")}}function h(){let n=document.getElementById("order-summary");!n||!r||(n.innerHTML=`
            <div class="bg-gray-50 rounded-xl p-6">
                <h3 class="text-lg font-semibold text-gray-900 mb-4">Order Summary</h3>
                
                <!-- Cart Items -->
                <div class="space-y-3 max-h-64 overflow-y-auto mb-4">
                    ${r.items.map(d=>`
                        <div class="flex gap-3">
                            <div class="flex-shrink-0 w-16 h-16 bg-gray-200 rounded-lg overflow-hidden">
                                <img src="${d.product?.image||"/static/images/placeholder.png"}" alt="" class="w-full h-full object-cover">
                            </div>
                            <div class="flex-1 min-w-0">
                                <h4 class="text-sm font-medium text-gray-900 truncate">${Templates.escapeHtml(d.product?.name)}</h4>
                                ${d.variant?`<p class="text-xs text-gray-500">${Templates.escapeHtml(d.variant.name||d.variant.value)}</p>`:""}
                                <div class="flex justify-between mt-1">
                                    <span class="text-xs text-gray-500">Qty: ${d.quantity}</span>
                                    <span class="text-sm font-medium">${Templates.formatPrice(d.price*d.quantity)}</span>
                                </div>
                            </div>
                        </div>
                    `).join("")}
                </div>

                <div class="border-t border-gray-200 pt-4 space-y-2 text-sm">
                    <div class="flex justify-between">
                        <span class="text-gray-600">Subtotal</span>
                        <span class="font-medium">${Templates.formatPrice(r.subtotal||0)}</span>
                    </div>
                    ${r.discount_amount?`
                        <div class="flex justify-between text-green-600">
                            <span>Discount</span>
                            <span>-${Templates.formatPrice(r.discount_amount)}</span>
                        </div>
                    `:""}
                    <div class="flex justify-between" id="shipping-cost-row">
                        <span class="text-gray-600">Shipping</span>
                        <span class="font-medium" id="shipping-cost">Calculated next</span>
                    </div>
                    ${r.tax_amount?`
                        <div class="flex justify-between">
                            <span class="text-gray-600">Tax</span>
                            <span class="font-medium">${Templates.formatPrice(r.tax_amount)}</span>
                        </div>
                    `:""}
                    <div class="flex justify-between pt-2 border-t border-gray-200">
                        <span class="text-base font-semibold text-gray-900">Total</span>
                        <span class="text-base font-bold text-gray-900" id="order-total">${Templates.formatPrice(r.total||0)}</span>
                    </div>
                </div>
            </div>
        `)}async function b(){if(AuthApi.isAuthenticated())try{let d=(await AuthApi.getAddresses()).data||[],E=document.getElementById("saved-addresses");E&&d.length>0&&(E.innerHTML=`
                    <div class="mb-4">
                        <label class="block text-sm font-medium text-gray-700 mb-2">Saved Addresses</label>
                        <div class="space-y-2">
                            ${d.map(C=>`
                                <label class="flex items-start p-3 border border-gray-200 rounded-lg cursor-pointer hover:border-primary-500 transition-colors">
                                    <input type="radio" name="saved_address" value="${C.id}" class="mt-1 text-primary-600 focus:ring-primary-500">
                                    <div class="ml-3">
                                        <p class="font-medium text-gray-900">${Templates.escapeHtml(C.full_name||`${C.first_name} ${C.last_name}`)}</p>
                                        <p class="text-sm text-gray-600">${Templates.escapeHtml(C.address_line_1)}</p>
                                        ${C.address_line_2?`<p class="text-sm text-gray-600">${Templates.escapeHtml(C.address_line_2)}</p>`:""}
                                        <p class="text-sm text-gray-600">${Templates.escapeHtml(C.city)}, ${Templates.escapeHtml(C.state||"")} ${Templates.escapeHtml(C.postal_code)}</p>
                                        <p class="text-sm text-gray-600">${Templates.escapeHtml(C.country)}</p>
                                        ${C.is_default?'<span class="inline-block mt-1 px-2 py-0.5 bg-primary-100 text-primary-700 text-xs rounded">Default</span>':""}
                                    </div>
                                </label>
                            `).join("")}
                            <label class="flex items-center p-3 border border-gray-200 rounded-lg cursor-pointer hover:border-primary-500 transition-colors">
                                <input type="radio" name="saved_address" value="new" class="text-primary-600 focus:ring-primary-500" checked>
                                <span class="ml-3 text-gray-700">Enter a new address</span>
                            </label>
                        </div>
                    </div>
                `,w())}catch(n){console.error("Failed to load addresses:",n)}}function w(){let n=document.querySelectorAll('input[name="saved_address"]'),d=document.getElementById("new-address-form");n.forEach(E=>{E.addEventListener("change",C=>{C.target.value==="new"?d?.classList.remove("hidden"):(d?.classList.add("hidden"),e.shipping_address=C.target.value)})})}function A(){let n=document.querySelectorAll("[data-step]"),d=document.querySelectorAll("[data-step-indicator]"),E=document.querySelectorAll("[data-next-step]"),C=document.querySelectorAll("[data-prev-step]");function L(T){n.forEach(N=>{N.classList.toggle("hidden",parseInt(N.dataset.step)!==T)}),d.forEach(N=>{let j=parseInt(N.dataset.stepIndicator);N.classList.toggle("bg-primary-600",j<=T),N.classList.toggle("text-white",j<=T),N.classList.toggle("bg-gray-200",j>T),N.classList.toggle("text-gray-600",j>T)}),t=T}E.forEach(T=>{T.addEventListener("click",async()=>{await I()&&(t===1&&await i(),L(t+1),window.scrollTo({top:0,behavior:"smooth"}))})}),C.forEach(T=>{T.addEventListener("click",()=>{L(t-1),window.scrollTo({top:0,behavior:"smooth"})})}),L(1)}async function I(){switch(t){case 1:return g();case 2:return f();case 3:return m();default:return!0}}function P(n){n&&(n.querySelectorAll("[data-error-for]").forEach(d=>d.remove()),n.querySelectorAll(".!border-red-500").forEach(d=>d.classList.remove("!border-red-500")))}function $(n,d){if(!n)return;let E=n.getAttribute("name")||n.id||Math.random().toString(36).slice(2,8),C=n.closest("form")?.querySelector(`[data-error-for="${E}"]`);C&&C.remove();let L=document.createElement("p");L.className="text-sm text-red-600 mt-1",L.setAttribute("data-error-for",E),L.textContent=d,n.classList.add("!border-red-500"),n.nextSibling?n.parentNode.insertBefore(L,n.nextSibling):n.parentNode.appendChild(L)}function o(n){if(!n)return;let d=n.querySelector("[data-error-for]");if(!d)return;let E=d.getAttribute("data-error-for"),C=n.querySelector(`[name="${E}"]`)||n.querySelector(`#${E}`)||d.previousElementSibling;if(C&&typeof C.focus=="function")try{C.focus({preventScroll:!0})}catch{C.focus()}}function g(){let n=document.querySelector('input[name="saved_address"]:checked');if(n&&n.value!=="new")return P(document.getElementById("new-address-form")||document.getElementById("information-form")),e.shipping_address=n.value,!0;let d=document.getElementById("shipping-address-form")||document.getElementById("information-form")||document.getElementById("new-address-form");if(!d)return!1;P(d);let E=new FormData(d),C={first_name:E.get("first_name")||E.get("full_name")?.split(" ")?.[0],last_name:E.get("last_name")||(E.get("full_name")?E.get("full_name").split(" ").slice(1).join(" "):""),email:E.get("email"),phone:E.get("phone"),address_line_1:E.get("address_line1")||E.get("address_line_1"),address_line_2:E.get("address_line2")||E.get("address_line_2"),city:E.get("city"),state:E.get("state"),postal_code:E.get("postal_code"),country:E.get("country")},T=["email","first_name","address_line_1","city","postal_code"].filter(N=>!C[N]);if(T.length>0)return T.forEach(N=>{let j=`[name="${N}"]`;N==="address_line_1"&&(j='[name="address_line1"],[name="address_line_1"]');let R=d.querySelector(j);$(R||d,N.replace("_"," ").replace(/\b\w/g,V=>V.toUpperCase())+" is required.")}),o(d),!1;if(C.email&&!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(C.email)){let N=d.querySelector('[name="email"]');return $(N||d,"Please enter a valid email address."),o(d),!1}return e.shipping_address=C,!0}async function i(){let n=document.getElementById("shipping-methods");if(n){Loader.show(n,"spinner");try{let d=e.shipping_address;if(!d){n.innerHTML='<p class="text-gray-500">Please provide a shipping address to view shipping methods.</p>';return}let E=typeof d=="object"?{country:d.country,postal_code:d.postal_code,city:d.city}:{address_id:d},L=(await ShippingApi.getRates(E)).data||[];if(L.length===0){n.innerHTML='<p class="text-gray-500">No shipping methods available for your location.</p>';return}n.innerHTML=`
                <div class="space-y-3">
                    ${L.map((N,j)=>`
                        <label class="flex items-center justify-between p-4 border border-gray-200 rounded-lg cursor-pointer hover:border-primary-500 transition-colors">
                            <div class="flex items-center">
                                <input 
                                    type="radio" 
                                    name="shipping_method" 
                                    value="${N.id}" 
                                    ${j===0?"checked":""}
                                    class="text-primary-600 focus:ring-primary-500"
                                    data-price="${N.price}"
                                >
                                <div class="ml-3">
                                    <p class="font-medium text-gray-900">${Templates.escapeHtml(N.name)}</p>
                                    ${N.description?`<p class="text-sm text-gray-500">${Templates.escapeHtml(N.description)}</p>`:""}
                                    ${N.estimated_days?`<p class="text-sm text-gray-500">Delivery in ${N.estimated_days} days</p>`:""}
                                </div>
                            </div>
                            <span class="font-semibold text-gray-900">${N.price>0?Templates.formatPrice(N.price):"Free"}</span>
                        </label>
                    `).join("")}
                </div>
            `,n.querySelectorAll('input[name="shipping_method"]').forEach((N,j)=>{N.__price=L[j]?L[j].price:0,N.addEventListener("change",()=>{y(parseFloat(N.__price)||0)})}),L.length>0&&(e.shipping_method=L[0].id,y(L[0].price||0))}catch(d){console.error("Failed to load shipping methods:",d),n.innerHTML='<p class="text-red-500">Failed to load shipping methods. Please try again.</p>'}}}async function s(){let n=document.getElementById("payment-methods-container");if(n)try{let d=new URLSearchParams;window.CONFIG&&CONFIG.shippingData&&CONFIG.shippingData.countryCode&&d.set("country",CONFIG.shippingData.countryCode),r&&(r.total||r.total===0)&&d.set("amount",r.total);let C=await(await fetch(`/api/v1/payments/gateways/available/?${d.toString()}`,{credentials:"same-origin"})).json(),L=C&&C.data||[],T=n.querySelectorAll(".payment-option");if(T&&T.length>0){try{let j=Array.from(T).map(D=>D.dataset.gateway).filter(Boolean),R=(L||[]).map(D=>D.code);if(j.length===R.length&&j.every((D,U)=>D===R[U])){x();return}}catch(j){console.warn("Failed to compare existing payment gateways:",j)}if(L.length===0)return}if(!L||L.length===0){n.innerHTML=`
                    <div class="text-center py-8 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl">
                        <svg class="w-16 h-16 mx-auto mb-4 text-gray-300 dark:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"></path></svg>
                        <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">No payment methods are configured</h3>
                        <p class="text-gray-500 dark:text-gray-400 mb-2">We don't have any payment providers configured for your currency or location. Please contact support to enable online payments.</p>
                        <p class="text-sm text-gray-400">You can still place an order if Cash on Delivery or Bank Transfer is available from admin.</p>
                    </div>
                `;return}let N=document.createDocumentFragment();L.forEach((j,R)=>{let V=document.createElement("div");V.className="relative payment-option transform transition-all duration-300 hover:scale-[1.01]",V.dataset.gateway=j.code,V.style.animation="slideIn 0.3s ease-out both",V.style.animationDelay=`${R*80}ms`;let D=document.createElement("input");D.type="radio",D.name="payment_method",D.value=j.code,D.id=`payment-${j.code}`,D.className="peer sr-only",R===0&&(D.checked=!0);let U=document.createElement("label");U.setAttribute("for",D.id),U.className="flex items-center justify-between p-4 border-2 rounded-xl cursor-pointer transition-all duration-300 hover:border-gray-400 border-gray-200",U.innerHTML=`
                    <div class="flex items-center">
                        <div class="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mr-4">
                            ${j.icon_url?`<img src="${j.icon_url}" class="h-6" alt="${j.name}">`:`<span class="font-bold">${j.code.toUpperCase()}</span>`}
                        </div>
                        <div>
                            <p class="font-medium text-gray-900 dark:text-white">${Templates.escapeHtml(j.name)}</p>
                            <p class="text-sm text-gray-500 dark:text-gray-400">${Templates.escapeHtml(j.description||"")}</p>
                            ${j.fee_text?`<p class="text-xs text-amber-600 dark:text-amber-400 mt-1">${Templates.escapeHtml(j.fee_text)}</p>`:""}
                            ${j.instructions?`<p class="text-xs text-gray-500 dark:text-gray-400 mt-2">${j.instructions}</p>`:""}
                        </div>
                    </div>
                `,V.appendChild(D),V.appendChild(U);let Q=document.createElement("div");Q.className="absolute top-4 right-4 opacity-0 peer-checked:opacity-100 transition-opacity duration-300",Q.innerHTML='<svg class="w-6 h-6 text-primary-600" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"></path></svg>',V.appendChild(Q),N.appendChild(V),j.public_key&&j.requires_client&&l(j.public_key).catch(Ns=>console.error("Failed to load Stripe:",Ns))}),n.replaceChildren(N),x()}catch(d){console.error("Failed to load payment gateways:",d)}}function l(n){return new Promise((d,E)=>{if(window.Stripe&&window.STRIPE_PUBLISHABLE_KEY===n){d();return}if(window.STRIPE_PUBLISHABLE_KEY=n,window.Stripe){c(n),d();return}let C=document.createElement("script");C.src="https://js.stripe.com/v3/",C.async=!0,C.onload=()=>{try{c(n),d()}catch(L){E(L)}},C.onerror=L=>E(L),document.head.appendChild(C)})}function c(n){if(typeof Stripe>"u")throw new Error("Stripe script not loaded");try{let d=Stripe(n),C=d.elements().create("card"),L=document.getElementById("card-element");L&&(L.innerHTML="",C.mount("#card-element"),C.on("change",T=>{let N=document.getElementById("card-errors");N&&(N.textContent=T.error?T.error.message:"")}),window.stripeInstance=d,window.stripeCard=C)}catch(d){throw console.error("Error initializing Stripe elements:",d),d}}(function(){document.addEventListener("DOMContentLoaded",()=>{setTimeout(()=>{s()},50)})})();function y(n){let d=document.getElementById("shipping-cost"),E=document.getElementById("order-total");if(d&&(d.textContent=n>0?Templates.formatPrice(n):"Free"),E&&r){let C=(r.total||0)+n;E.textContent=Templates.formatPrice(C)}}function f(){let n=document.querySelector('input[name="shipping_method"]:checked');return n?(e.shipping_method=n.value,!0):(Toast.error("Please select a shipping method."),!1)}function p(){let n=document.getElementById("order-summary-toggle"),d=document.getElementById("order-summary-block");if(!n||!d)return;n.addEventListener("click",()=>{let C=d.classList.toggle("hidden");n.setAttribute("aria-expanded",(!C).toString());let L=n.querySelector("svg");L&&L.classList.toggle("rotate-180",!C)});let E=window.getComputedStyle(d).display==="none"||d.classList.contains("hidden");n.setAttribute("aria-expanded",(!E).toString())}function m(){let n=document.querySelector('input[name="payment_method"]:checked'),d=document.getElementById("payment-form");if(P(d),!n){let C=document.getElementById("payment-methods-container")||d;return $(C,"Please select a payment method."),o(C),!1}let E=n.value;if(E==="stripe"){let C=document.getElementById("cardholder-name");if(!C||!C.value.trim())return $(C||d,"Cardholder name is required."),o(d),!1;if(!window.stripeCard)return $(document.getElementById("card-element")||d,"Card input not ready. Please wait and try again."),!1}if(E==="bkash"){let C=document.getElementById("bkash-number");if(!C||!C.value.trim())return $(C||d,"bKash mobile number is required."),o(d),!1}if(E==="nagad"){let C=document.getElementById("nagad-number");if(!C||!C.value.trim())return $(C||d,"Nagad mobile number is required."),o(d),!1}return e.payment_method=E,!0}function x(){let n=document.getElementById("same-as-shipping"),d=document.getElementById("billing-address-form");n?.addEventListener("change",T=>{e.same_as_shipping=T.target.checked,d?.classList.toggle("hidden",T.target.checked)}),document.querySelectorAll('input[name="payment_method"]').forEach(T=>{let N=j=>{document.querySelectorAll("[data-payment-form]").forEach(D=>{D.classList.add("hidden")});let R=j.target?j.target.value:T.value||null;if(!R)return;let V=document.querySelector(`[data-payment-form="${R}"]`);V||(V=document.getElementById(`${R}-form`)),V?.classList.remove("hidden")};T.addEventListener("change",N),T.checked&&N({target:T})});let C=document.getElementById("place-order-btn"),L=document.getElementById("place-order-form");C&&(!L||!L.action||L.action.includes("javascript"))&&C.addEventListener("click",async T=>{T.preventDefault(),await v()})}async function v(){if(!m())return;let n=document.getElementById("place-order-btn");n.disabled=!0,n.innerHTML='<svg class="animate-spin h-5 w-5 mx-auto" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>';try{let d=document.getElementById("order-notes")?.value;if(e.notes=d||"",!e.same_as_shipping){let L=document.getElementById("billing-address-form");if(L){let T=new FormData(L);e.billing_address={first_name:T.get("billing_first_name"),last_name:T.get("billing_last_name"),address_line_1:T.get("billing_address_line_1"),address_line_2:T.get("billing_address_line_2"),city:T.get("billing_city"),state:T.get("billing_state"),postal_code:T.get("billing_postal_code"),country:T.get("billing_country")}}}let C=(await CheckoutApi.createOrder(e)).data;e.payment_method==="stripe"||e.payment_method==="card"?await k(C):e.payment_method==="paypal"?await B(C):window.location.href=`/orders/${C.id}/confirmation/`}catch(d){console.error("Failed to place order:",d),Toast.error(d.message||"Failed to place order. Please try again."),n.disabled=!1,n.textContent="Place Order"}}async function k(n){try{let d=await CheckoutApi.createPaymentIntent(n.id),{client_secret:E}=d.data,C=d.data.publishable_key||window.STRIPE_PUBLISHABLE_KEY||(window.stripeInstance?window.STRIPE_PUBLISHABLE_KEY:null);if(typeof Stripe>"u"&&!window.stripeInstance)throw new Error("Stripe is not loaded.");let T=await(window.stripeInstance||Stripe(C)).confirmCardPayment(E,{payment_method:{card:window.stripeCard,billing_details:{name:`${e.shipping_address.first_name} ${e.shipping_address.last_name}`}}});if(T.error)throw new Error(T.error.message);window.location.href=`/orders/${n.id}/confirmation/`}catch(d){console.error("Stripe payment failed:",d),Toast.error(d.message||"Payment failed. Please try again.");let E=document.getElementById("place-order-btn");E.disabled=!1,E.textContent="Place Order"}}async function B(n){try{let d=await CheckoutApi.createPayPalOrder(n.id),{approval_url:E}=d.data;window.location.href=E}catch(d){console.error("PayPal payment failed:",d),Toast.error(d.message||"Payment failed. Please try again.");let E=document.getElementById("place-order-btn");E.disabled=!1,E.textContent="Place Order"}}function q(){r=null,e={shipping_address:null,billing_address:null,same_as_shipping:!0,shipping_method:null,payment_method:null,notes:""},t=1}return{init:a,destroy:q}})();window.CheckoutPage=ns;Gs=ns});var cs={};F(cs,{default:()=>Ys});var ls,Ys,ds=M(()=>{ls=(function(){"use strict";async function r(){e(),await a()}function e(){let h=document.getElementById("contact-form");if(!h)return;let b=FormValidator.create(h,{name:{required:!0,minLength:2,maxLength:100},email:{required:!0,email:!0},subject:{required:!0,minLength:5,maxLength:200},message:{required:!0,minLength:20,maxLength:2e3}});h.addEventListener("submit",async w=>{if(w.preventDefault(),!b.validate()){Toast.error("Please fill in all required fields correctly.");return}let A=h.querySelector('button[type="submit"]'),I=A.textContent;A.disabled=!0,A.innerHTML='<svg class="animate-spin h-5 w-5 mx-auto" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>';try{let P=new FormData(h),$={name:P.get("name"),email:P.get("email"),phone:P.get("phone"),subject:P.get("subject"),message:P.get("message")};await SupportApi.submitContactForm($),Toast.success("Thank you for your message! We'll get back to you soon."),h.reset(),b.clearErrors(),t()}catch(P){Toast.error(P.message||"Failed to send message. Please try again.")}finally{A.disabled=!1,A.textContent=I}})}function t(){let h=document.getElementById("contact-form"),b=document.getElementById("contact-success");h&&b&&(h.classList.add("hidden"),b.classList.remove("hidden"),b.innerHTML=`
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
            `,document.getElementById("send-another-btn")?.addEventListener("click",()=>{h.classList.remove("hidden"),b.classList.add("hidden")}))}async function a(){let h=document.getElementById("contact-info");if(h)try{let w=(await PagesApi.getContactInfo()).data;if(!w)return;h.innerHTML=`
                <div class="space-y-6">
                    ${w.address?`
                        <div class="flex gap-4">
                            <div class="flex-shrink-0 w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                                <svg class="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
                                </svg>
                            </div>
                            <div>
                                <h3 class="font-semibold text-gray-900">Address</h3>
                                <p class="text-gray-600">${Templates.escapeHtml(w.address)}</p>
                            </div>
                        </div>
                    `:""}
                    
                    ${w.phone?`
                        <div class="flex gap-4">
                            <div class="flex-shrink-0 w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                                <svg class="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>
                                </svg>
                            </div>
                            <div>
                                <h3 class="font-semibold text-gray-900">Phone</h3>
                                <a href="tel:${w.phone}" class="text-gray-600 hover:text-primary-600">${Templates.escapeHtml(w.phone)}</a>
                            </div>
                        </div>
                    `:""}
                    
                    ${w.email?`
                        <div class="flex gap-4">
                            <div class="flex-shrink-0 w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                                <svg class="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                                </svg>
                            </div>
                            <div>
                                <h3 class="font-semibold text-gray-900">Email</h3>
                                <a href="mailto:${w.email}" class="text-gray-600 hover:text-primary-600">${Templates.escapeHtml(w.email)}</a>
                            </div>
                        </div>
                    `:""}
                    
                    ${w.business_hours?`
                        <div class="flex gap-4">
                            <div class="flex-shrink-0 w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                                <svg class="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                                </svg>
                            </div>
                            <div>
                                <h3 class="font-semibold text-gray-900">Business Hours</h3>
                                <p class="text-gray-600">${Templates.escapeHtml(w.business_hours)}</p>
                            </div>
                        </div>
                    `:""}
                    
                    ${w.social_links&&Object.keys(w.social_links).length>0?`
                        <div class="pt-4 border-t border-gray-200">
                            <h3 class="font-semibold text-gray-900 mb-3">Follow Us</h3>
                            <div class="flex gap-3">
                                ${w.social_links.facebook?`
                                    <a href="${w.social_links.facebook}" target="_blank" class="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center hover:bg-gray-200 transition-colors">
                                        <svg class="w-5 h-5 text-[#1877F2]" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                                    </a>
                                `:""}
                                ${w.social_links.instagram?`
                                    <a href="${w.social_links.instagram}" target="_blank" class="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center hover:bg-gray-200 transition-colors">
                                        <svg class="w-5 h-5 text-[#E4405F]" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
                                    </a>
                                `:""}
                                ${w.social_links.twitter?`
                                    <a href="${w.social_links.twitter}" target="_blank" class="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center hover:bg-gray-200 transition-colors">
                                        <svg class="w-5 h-5 text-[#1DA1F2]" fill="currentColor" viewBox="0 0 24 24"><path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/></svg>
                                    </a>
                                `:""}
                                ${w.social_links.youtube?`
                                    <a href="${w.social_links.youtube}" target="_blank" class="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center hover:bg-gray-200 transition-colors">
                                        <svg class="w-5 h-5 text-[#FF0000]" fill="currentColor" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
                                    </a>
                                `:""}
                            </div>
                        </div>
                    `:""}
                </div>
            `}catch(b){console.error("Failed to load contact info:",b)}}function u(){}return{init:r,destroy:u}})();window.ContactPage=ls;Ys=ls});var ms={};F(ms,{default:()=>Qs});var us,Qs,ps=M(()=>{us=(function(){"use strict";let r=[];async function e(){let o=document.getElementById("faq-list");o&&o.querySelector(".faq-item")?t():await a(),I()}function t(){let o=document.querySelectorAll(".category-tab"),g=document.querySelectorAll(".faq-category");o.forEach(s=>{s.addEventListener("click",l=>{l.preventDefault(),o.forEach(f=>{f.classList.remove("bg-primary-600","text-white"),f.classList.add("bg-gray-100","text-gray-700")}),s.classList.add("bg-primary-600","text-white"),s.classList.remove("bg-gray-100","text-gray-700");let c=s.dataset.category;c==="all"?g.forEach(f=>f.classList.remove("hidden")):g.forEach(f=>{f.classList.toggle("hidden",f.dataset.category!==c)});let y=document.getElementById("faq-search");y&&(y.value=""),document.querySelectorAll(".faq-item").forEach(f=>f.classList.remove("hidden"))})}),document.querySelectorAll(".accordion-toggle").forEach(s=>{s.addEventListener("click",()=>{let l=s.closest("[data-accordion]"),c=l.querySelector(".accordion-content"),y=l.querySelector(".accordion-icon"),f=!c.classList.contains("hidden");document.querySelectorAll("[data-accordion]").forEach(p=>{p!==l&&(p.querySelector(".accordion-content")?.classList.add("hidden"),p.querySelector(".accordion-icon")?.classList.remove("rotate-180"))}),f?(c.classList.add("hidden"),y.classList.remove("rotate-180")):(c.classList.remove("hidden"),y.classList.add("rotate-180"))})})}async function a(){let o=document.getElementById("faq-container");if(o){Loader.show(o,"skeleton");try{let i=(await PagesApi.getFAQs()).data||[];if(i.length===0){o.innerHTML='<p class="text-gray-500 text-center py-8">No FAQs available at the moment.</p>';return}r=u(i),h(r)}catch(g){console.error("Failed to load FAQs:",g),o.innerHTML='<p class="text-red-500 text-center py-8">Failed to load FAQs.</p>'}}}function u(o){let g={};return o.forEach(i=>{let s=i.category||"General";g[s]||(g[s]=[]),g[s].push(i)}),g}function h(o,g=""){let i=document.getElementById("faq-container");if(!i)return;let s=Object.keys(o);if(s.length===0){i.innerHTML=`
                <div class="text-center py-12">
                    <svg class="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                    </svg>
                    <p class="text-gray-500">No FAQs found${g?` for "${Templates.escapeHtml(g)}"`:""}.</p>
                </div>
            `;return}i.innerHTML=`
            <!-- Category Tabs -->
            <div class="mb-8 overflow-x-auto">
                <div class="flex gap-2 pb-2">
                    <button class="faq-category-btn px-4 py-2 bg-primary-100 text-primary-700 rounded-full text-sm font-medium whitespace-nowrap" data-category="all">
                        All
                    </button>
                    ${s.map(l=>`
                        <button class="faq-category-btn px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-full text-sm font-medium whitespace-nowrap transition-colors" data-category="${Templates.escapeHtml(l)}">
                            ${Templates.escapeHtml(l)}
                        </button>
                    `).join("")}
                </div>
            </div>

            <!-- FAQ Accordion -->
            <div id="faq-list" class="space-y-4">
                ${s.map(l=>`
                    <div class="faq-category" data-category="${Templates.escapeHtml(l)}">
                        <h2 class="text-lg font-semibold text-gray-900 mb-4">${Templates.escapeHtml(l)}</h2>
                        <div class="space-y-3">
                            ${o[l].map(c=>b(c,g)).join("")}
                        </div>
                    </div>
                `).join("")}
            </div>
        `,w(),A()}function b(o,g=""){let i=Templates.escapeHtml(o.question),s=o.answer;if(g){let l=new RegExp(`(${g.replace(/[.*+?^${}()|[\]\\]/g,"\\$&")})`,"gi");i=i.replace(l,'<mark class="bg-yellow-200">$1</mark>'),s=s.replace(l,'<mark class="bg-yellow-200">$1</mark>')}return`
            <div class="faq-item border border-gray-200 rounded-lg overflow-hidden">
                <button class="faq-trigger w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50 transition-colors">
                    <span class="font-medium text-gray-900 pr-4">${i}</span>
                    <svg class="faq-icon w-5 h-5 text-gray-500 flex-shrink-0 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
                    </svg>
                </button>
                <div class="faq-content hidden px-6 pb-4">
                    <div class="prose prose-sm max-w-none text-gray-600">
                        ${s}
                    </div>
                </div>
            </div>
        `}function w(){let o=document.querySelectorAll(".faq-category-btn"),g=document.querySelectorAll(".faq-category");o.forEach(i=>{i.addEventListener("click",()=>{o.forEach(l=>{l.classList.remove("bg-primary-100","text-primary-700"),l.classList.add("bg-gray-100","text-gray-600")}),i.classList.add("bg-primary-100","text-primary-700"),i.classList.remove("bg-gray-100","text-gray-600");let s=i.dataset.category;g.forEach(l=>{s==="all"||l.dataset.category===s?l.classList.remove("hidden"):l.classList.add("hidden")})})})}function A(){document.querySelectorAll(".faq-trigger").forEach(g=>{g.addEventListener("click",()=>{let i=g.closest(".faq-item"),s=i.querySelector(".faq-content"),l=i.querySelector(".faq-icon"),c=!s.classList.contains("hidden");document.querySelectorAll(".faq-item").forEach(y=>{y!==i&&(y.querySelector(".faq-content")?.classList.add("hidden"),y.querySelector(".faq-icon")?.classList.remove("rotate-180"))}),s.classList.toggle("hidden"),l.classList.toggle("rotate-180")})})}function I(){let o=document.getElementById("faq-search");if(!o)return;let g=null;o.addEventListener("input",i=>{let s=i.target.value.trim().toLowerCase();clearTimeout(g),g=setTimeout(()=>{if(document.querySelector(".accordion-toggle"))P(s);else if(r&&Object.keys(r).length>0){if(s.length<2){h(r);return}let c={};Object.entries(r).forEach(([y,f])=>{let p=f.filter(m=>m.question.toLowerCase().includes(s)||m.answer.toLowerCase().includes(s));p.length>0&&(c[y]=p)}),h(c,s)}},300)})}function P(o){let g=document.querySelectorAll(".faq-item"),i=document.querySelectorAll(".faq-category"),s=document.getElementById("no-results"),l=0;g.forEach(c=>{let y=c.querySelector(".accordion-toggle span, button span"),f=c.querySelector(".accordion-content"),p=y?y.textContent.toLowerCase():"",m=f?f.textContent.toLowerCase():"";!o||p.includes(o)||m.includes(o)?(c.classList.remove("hidden"),l++):c.classList.add("hidden")}),i.forEach(c=>{let y=c.querySelectorAll(".faq-item:not(.hidden)");c.classList.toggle("hidden",y.length===0)}),s&&s.classList.toggle("hidden",l>0)}function $(){r=[]}return{init:e,destroy:$}})();window.FAQPage=us;Qs=us});var gs={};F(gs,{CategoryCard:()=>Xs});function Xs(r){let e=document.createElement("a");e.href=`/categories/${r.slug}/`,e.className="group block";let t=document.createElement("div");t.className="relative aspect-square rounded-xl overflow-hidden bg-gray-100";let a="";if(typeof r.image_url=="string"&&r.image_url?a=r.image_url:typeof r.image=="string"&&r.image?a=r.image:r.image&&typeof r.image=="object"?a=r.image.url||r.image.src||r.image_url||"":typeof r.banner_image=="string"&&r.banner_image?a=r.banner_image:r.banner_image&&typeof r.banner_image=="object"?a=r.banner_image.url||r.banner_image.src||"":typeof r.hero_image=="string"&&r.hero_image?a=r.hero_image:r.hero_image&&typeof r.hero_image=="object"?a=r.hero_image.url||r.hero_image.src||"":typeof r.thumbnail=="string"&&r.thumbnail?a=r.thumbnail:r.thumbnail&&typeof r.thumbnail=="object"&&(a=r.thumbnail.url||r.thumbnail.src||""),a){let b=document.createElement("img");b.src=a,b.alt=r.name||"",b.className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300",b.loading="lazy",b.decoding="async",b.onerror=w=>{try{b.remove();let A=document.createElement("div");A.className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary-100 to-primary-200",A.innerHTML='<svg class="w-12 h-12 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"/></svg>',t.appendChild(A)}catch{}},t.appendChild(b)}else{let b=document.createElement("div");b.className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary-100 to-primary-200",b.innerHTML='<svg class="w-12 h-12 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"/></svg>',t.appendChild(b)}let u=document.createElement("div");u.className="absolute inset-0 bg-gradient-to-t from-black/30 dark:from-black/60 to-transparent",t.appendChild(u),e.appendChild(t);let h=document.createElement("h3");if(h.className="mt-3 text-sm font-medium text-stone-900 group-hover:text-primary-600 transition-colors text-center dark:text-white",h.textContent=r.name,e.appendChild(h),r.product_count){let b=document.createElement("p");b.className="text-xs text-stone-600 dark:text-white/60 text-center",b.textContent=`${r.product_count} products`,e.appendChild(b)}return e}var hs=M(()=>{});var ys={};F(ys,{default:()=>Js});var fs,Js,bs=M(()=>{fs=(function(){"use strict";let r=null;async function e(){await Promise.all([u(),b(),w(),A(),I(),P(),a(),t()]),$()}async function t(){let g=document.getElementById("testimonials-grid");if(g){Loader.show(g,"skeleton");try{let i=await CategoriesApi.getCategories({pageSize:6,featured:!0}),s=i?.data?.results||i?.data||i?.results||[],l=[];for(let c of s){let y=await ProductsApi.getProducts({category:c.id,featured:!0,pageSize:3}),f=y?.data?.results||y?.data||y?.results||[];for(let p of f){let m=await ProductsApi.getReviews(p.id,{pageSize:2}),x=m?.data?.results||m?.data||m?.results||[];x.forEach(v=>{v._product=p,v._category=c}),l.push(...x)}}if(g.innerHTML="",!l.length){g.innerHTML='<p class="text-gray-500 text-center py-8">No user reviews available.</p>';return}l=l.slice(0,6),l.forEach(c=>{let y=document.createElement("div");y.className="rounded-2xl bg-white dark:bg-stone-800 shadow p-6 flex flex-col gap-3",y.innerHTML=`
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
                        <div class="mt-2 text-xs text-primary-700 dark:text-amber-400 font-semibold">${c._category?Templates.escapeHtml(c._category.name):""}${c._product?" - "+Templates.escapeHtml(c._product.name):""}</div>
                    `,g.appendChild(y)})}catch(i){console.error("Failed to load testimonials:",i),g.innerHTML='<p class="text-red-500 text-center py-8">Failed to load testimonials. Please try again later.</p>'}}}async function a(){let g=document.getElementById("best-sellers");if(!g)return;let i=g.querySelector(".products-grid")||g;Loader.show(i,"skeleton");try{let s=await ProductsApi.getProducts({bestseller:!0,pageSize:5}),l=s.data?.results||s.data||s.results||[];if(l.length===0){i.innerHTML='<p class="text-gray-500 text-center py-8">No best sellers available.</p>';return}i.innerHTML=l.map(c=>{let y=null;return c.discount_percent&&c.discount_percent>0&&(y=`-${c.discount_percent}%`),ProductCard.render(c,{showBadge:!!y,badge:y,priceSize:"small"})}).join("");try{i.querySelectorAll("img").forEach((y,f)=>{f<2&&(y.setAttribute("loading","eager"),y.setAttribute("fetchpriority","high"),y.setAttribute("decoding","async"))})}catch{}ProductCard.bindEvents(i)}catch(s){console.error("Failed to load best sellers:",s),i.innerHTML='<p class="text-red-500 text-center py-8">Failed to load products. Please try again later.</p>'}}async function u(){let g=document.getElementById("hero-slider");if(g)try{let i=await PagesApi.getBanners("home_hero"),s=i.data?.results||i.data||i.results||[];if(s.length===0){g.innerHTML="";return}g.innerHTML=`
                <div class="relative overflow-hidden w-full h-[55vh] sm:h-[70vh] md:h-[80vh]">
                    <div class="hero-slides relative w-full h-full">
                        ${s.map((l,c)=>`
                            <div class="hero-slide ${c===0?"":"hidden"} w-full h-full" data-index="${c}">
                                <a href="${l.link_url||"#"}" class="block relative w-full h-full">
                                    <img 
                                        src="${l.image}" 
                                        alt="${Templates.escapeHtml(l.title||"")}"
                                        class="absolute inset-0 w-full h-full object-cover"
                                        loading="${c===0?"eager":"lazy"}"
                                        decoding="async"
                                    >
                                    ${l.title||l.subtitle?`
                                        <div class="absolute inset-0 bg-gradient-to-r from-black/60 via-black/30 to-transparent flex items-center">
                                            <div class="px-8 md:px-16 max-w-xl">
                                                ${l.title?`<h2 class="text-2xl sm:text-3xl md:text-5xl font-bold text-white mb-4">${Templates.escapeHtml(l.title)}</h2>`:""}
                                                ${l.subtitle?`<p class="text-sm sm:text-lg text-white/90 mb-6">${Templates.escapeHtml(l.subtitle)}</p>`:""}
                                                ${l.link_text||l.button_text?`
                                                    <span class="inline-flex items-center px-6 py-3 bg-white text-gray-900 font-semibold rounded-lg hover:bg-gray-100 transition-colors">
                                                        ${Templates.escapeHtml(l.link_text||l.button_text)}
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
                    ${s.length>1?`
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
                            ${s.map((l,c)=>`
                                <button class="w-3 h-3 rounded-full transition-colors ${c===0?"bg-white dark:bg-stone-200":"bg-white/50 dark:bg-stone-600/60 hover:bg-white/75 dark:hover:bg-stone-500/80"}" data-slide="${c}" aria-label="Go to slide ${c+1}"></button>
                            `).join("")}
                        </div>
                    `:""}
                </div>
            `,s.length>1&&h(s.length)}catch(i){console.warn("Hero banners unavailable:",i?.status||i)}}function h(g){let i=0,s=document.querySelectorAll(".hero-slide"),l=document.querySelectorAll(".hero-dots button"),c=document.querySelector(".hero-prev"),y=document.querySelector(".hero-next");function f(m){s[i].classList.add("hidden"),l[i]?.classList.remove("bg-white"),l[i]?.classList.add("bg-white/50"),i=(m+g)%g,s[i].classList.remove("hidden"),l[i]?.classList.add("bg-white"),l[i]?.classList.remove("bg-white/50")}c?.addEventListener("click",()=>{f(i-1),p()}),y?.addEventListener("click",()=>{f(i+1),p()}),l.forEach((m,x)=>{m.addEventListener("click",()=>{f(x),p()})});function p(){r&&clearInterval(r),r=setInterval(()=>f(i+1),5e3)}try{let m=document.querySelector(".hero-slides"),x=0;m?.addEventListener("touchstart",v=>{x=v.touches[0].clientX},{passive:!0}),m?.addEventListener("touchend",v=>{let B=v.changedTouches[0].clientX-x;Math.abs(B)>50&&(B<0?f(i+1):f(i-1),p())})}catch{}p()}async function b(){let g=document.getElementById("featured-products");if(!g)return;let i=g.querySelector(".products-grid")||g;Loader.show(i,"skeleton");try{let s=await ProductsApi.getFeatured(8),l=s.data?.results||s.data||s.results||[];if(l.length===0){i.innerHTML='<p class="text-gray-500 text-center py-8">No featured products available.</p>';return}i.innerHTML=l.map(c=>{let y=null;return c.discount_percent&&c.discount_percent>0&&(y=`-${c.discount_percent}%`),ProductCard.render(c,{showBadge:!!y,badge:y,priceSize:"small"})}).join("");try{i.querySelectorAll("img").forEach((y,f)=>{f<2&&(y.setAttribute("loading","eager"),y.setAttribute("fetchpriority","high"),y.setAttribute("decoding","async"))})}catch{}ProductCard.bindEvents(i)}catch(s){console.error("Failed to load featured products:",s),i.innerHTML='<p class="text-red-500 text-center py-8">Failed to load products. Please try again later.</p>'}}async function w(){let g=document.getElementById("categories-showcase");if(g){Loader.show(g,"skeleton");try{try{window.ApiClient?.clearCache("/api/v1/categories/")}catch{}let i=await window.ApiClient.get("/categories/",{page_size:6,is_featured:!0},{useCache:!1}),s=i.data?.results||i.data||i.results||[];if(s.length===0){g.innerHTML="";return}let l;try{l=(await Promise.resolve().then(()=>(hs(),gs))).CategoryCard}catch(c){console.error("Failed to import CategoryCard:",c);return}g.innerHTML="",s.forEach(c=>{let y=l(c);try{let f=y.querySelector("img");console.info("[Home] card image for",c.name,f?f.src:"NO_IMAGE")}catch{}g.appendChild(y)}),g.classList.add("grid","grid-cols-2","sm:grid-cols-2","md:grid-cols-3","lg:grid-cols-6","gap-4","lg:gap-6")}catch(i){console.error("Failed to load categories:",i),g.innerHTML=""}}}async function A(){let g=document.getElementById("new-arrivals");if(!g)return;let i=g.querySelector(".products-grid")||g;Loader.show(i,"skeleton");try{let s=await ProductsApi.getNewArrivals(4),l=s.data?.results||s.data||s.results||[];if(l.length===0){i.innerHTML='<p class="text-gray-500 text-center py-8">No new products available.</p>';return}i.innerHTML=l.map(c=>{let y=null;return c.discount_percent&&c.discount_percent>0&&(y=`-${c.discount_percent}%`),ProductCard.render(c,{showBadge:!!y,badge:y,priceSize:"small"})}).join("");try{i.querySelectorAll("img").forEach((y,f)=>{f<2&&(y.setAttribute("loading","eager"),y.setAttribute("fetchpriority","high"),y.setAttribute("decoding","async"))})}catch{}ProductCard.bindEvents(i)}catch(s){console.error("Failed to load new arrivals:",s),i.innerHTML='<p class="text-red-500 text-center py-8">Failed to load products.</p>'}}async function I(){let g=document.getElementById("promotions-banner")||document.getElementById("promotion-banners");if(g)try{let i=await PagesApi.getPromotions(),s=i?.data?.results??i?.results??i?.data??[];if(Array.isArray(s)||(s&&typeof s=="object"?s=Array.isArray(s.items)?s.items:[s]:s=[]),s.length===0){g.innerHTML="";return}let l=s[0]||{};g.innerHTML=`
                <div class="bg-gradient-to-r from-primary-600 to-primary-700 rounded-2xl overflow-hidden">
                    <div class="px-6 py-8 md:px-12 md:py-12 flex flex-col md:flex-row items-center justify-between gap-6">
                        <div class="text-center md:text-left">
                            <span class="inline-block px-3 py-1 bg-white/20 text-white text-sm font-medium rounded-full mb-3">
                                Limited Time Offer
                            </span>
                            <h3 class="text-2xl md:text-3xl font-bold text-white mb-2">
                                ${Templates.escapeHtml(l.title||l.name||"")}
                            </h3>
                            ${l.description?`
                                <p class="text-white/90 max-w-lg">${Templates.escapeHtml(l.description)}</p>
                            `:""}
                            ${l.discount_value?`
                                <p class="text-3xl font-bold text-white mt-4">
                                    ${l.discount_type==="percentage"?`${l.discount_value}% OFF`:`Save ${Templates.formatPrice(l.discount_value)}`}
                                </p>
                            `:""}
                        </div>
                        <div class="flex flex-col items-center gap-4">
                            ${l.code?`
                                <div class="bg-white/10 backdrop-blur-sm px-6 py-3 rounded-lg border-2 border-dashed border-white/30">
                                    <p class="text-sm text-white/80 mb-1">Use code:</p>
                                    <p class="text-2xl font-mono font-bold text-white tracking-wider">${Templates.escapeHtml(l.code)}</p>
                                </div>
                            `:""}
                            <a href="/products/?promotion=${l.id||""}" class="inline-flex items-center px-6 py-3 bg-white text-primary-600 font-semibold rounded-lg hover:bg-gray-100 transition-colors">
                                Shop Now
                                <svg class="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3"/>
                                </svg>
                            </a>
                        </div>
                    </div>
                </div>
            `}catch(i){console.warn("Promotions unavailable:",i?.status||i),g.innerHTML=""}}async function P(){let g=document.getElementById("custom-order-cta");if(!g||g.dataset?.loaded)return;g.dataset.loaded="1",g.innerHTML=`
            <div class="container mx-auto px-4">
                <div class="max-w-full w-full mx-auto rounded-3xl p-6 md:p-10">
                    <div class="animate-pulse">
                        <div class="h-6 w-1/3 bg-gray-200 dark:bg-stone-700 rounded mb-4"></div>
                        <div class="h-10 w-full bg-gray-200 dark:bg-stone-700 rounded mb-4"></div>
                        <div class="h-44 bg-gray-200 dark:bg-stone-800 rounded"></div>
                    </div>
                </div>
            </div>
        `;let i=window.BUNORAA_ROUTES||{},s=i.preordersWizard||"/preorders/create/",l=i.preordersLanding||"/preorders/";try{let c=[];if(typeof PreordersApi<"u"&&PreordersApi.getCategories)try{let y=await PreordersApi.getCategories({featured:!0,pageSize:4});c=y?.data?.results||y?.data||y?.results||[]}catch(y){console.warn("Pre-order categories unavailable:",y)}g.innerHTML=`
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
                            ${c.length>0?`
                                <div class="mb-8">
                                    <p class="text-stone-600 dark:text-white/60 text-sm mb-3">Popular categories:</p>
                                    <div class="flex flex-wrap gap-2">
                                        ${c.slice(0,4).map(y=>`
                                            <a href="${l}category/${y.slug}/" class="inline-flex items-center gap-2 px-4 py-2 bg-white/10 dark:bg-stone-800/30 hover:bg-white/20 dark:hover:bg-stone-700 rounded-full text-sm text-stone-900 dark:text-white transition-colors">
                                                ${y.icon?`<span>${y.icon}</span>`:""}
                                                ${Templates.escapeHtml(y.name)}
                                            </a>
                                        `).join("")}
                                    </div>
                                </div>
                            `:""}
                            <div class="flex flex-wrap gap-4">
                                <a href="${s}" class="cta-unlock inline-flex items-center gap-2 px-8 py-4 bg-amber-600 text-white font-bold rounded-xl shadow-lg hover:shadow-xl hover:text-black dark:hover:text-black transition-colors group dark:bg-amber-600 dark:text-white">
                                    Start Your Custom Order
                                    <svg class="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3"/></svg>
                                </a>
                                <a href="${l}" class="inline-flex items-center gap-2 px-8 py-4 bg-transparent text-stone-900 dark:text-white font-semibold rounded-xl border-2 border-stone-200 dark:border-stone-700 hover:bg-stone-100 dark:hover:bg-stone-800 transition-all">
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
            `}catch(c){console.warn("Custom order CTA failed to load:",c),g.innerHTML=`
                <div class="container mx-auto px-4 text-center text-stone-900 dark:text-white">
                    <h2 class="text-3xl lg:text-4xl font-display font-bold mb-4 text-stone-900 dark:text-white">Create Your Perfect Custom Order</h2>
                    <p class="text-stone-700 dark:text-white/80 mb-8 max-w-2xl mx-auto">Have a unique vision? Our skilled artisans will bring your ideas to life.</p>
                    <a href="${s}" class="cta-unlock inline-flex items-center gap-2 px-8 py-4 bg-amber-600 text-white font-bold rounded-xl shadow-lg hover:shadow-xl hover:text-black dark:hover:text-black transition-colors group dark:bg-amber-600 dark:text-white">
                        Start Your Custom Order
                    </a>
                </div>
            `}}function $(){let g=document.getElementById("newsletter-form");g&&g.addEventListener("submit",async i=>{i.preventDefault();let s=g.querySelector('input[type="email"]'),l=g.querySelector('button[type="submit"]'),c=s?.value?.trim();if(!c){Toast.error("Please enter your email address.");return}let y=l.textContent;l.disabled=!0,l.innerHTML='<svg class="animate-spin h-5 w-5 mx-auto" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>';try{await SupportApi.submitContactForm({email:c,type:"newsletter"}),Toast.success("Thank you for subscribing!"),s.value=""}catch(f){Toast.error(f.message||"Failed to subscribe. Please try again.")}finally{l.disabled=!1,l.textContent=y}})}function o(){r&&(clearInterval(r),r=null)}return{init:e,destroy:o}})();window.HomePage=fs;Js=fs});var xs={};F(xs,{default:()=>Ks});var vs,Ks,ws=M(()=>{vs=(function(){"use strict";async function r(){let b=e();b&&await t(b),u()}function e(){let b=window.location.pathname;if(b.includes("privacy"))return"privacy-policy";if(b.includes("terms"))return"terms-of-service";if(b.includes("refund")||b.includes("return"))return"refund-policy";if(b.includes("shipping"))return"shipping-policy";if(b.includes("cookie"))return"cookie-policy";let w=b.match(/\/legal\/([^\/]+)/);return w?w[1]:null}async function t(b){let w=document.getElementById("legal-content");if(w){Loader.show(w,"skeleton");try{let I=(await PagesApi.getLegalPage(b)).data;if(!I){w.innerHTML='<p class="text-gray-500 text-center py-8">Page not found.</p>';return}document.title=`${I.title} | Bunoraa`,a(I)}catch(A){console.error("Failed to load legal page:",A),w.innerHTML='<p class="text-red-500 text-center py-8">Failed to load content.</p>'}}}function a(b){let w=document.getElementById("legal-content"),A=document.getElementById("legal-title"),I=document.getElementById("table-of-contents");if(A&&(A.innerHTML=`
                <h1 class="text-3xl md:text-4xl font-bold text-gray-900">${Templates.escapeHtml(b.title)}</h1>
                ${b.last_updated?`
                    <p class="mt-2 text-sm text-gray-500">Last updated: ${Templates.formatDate(b.last_updated)}</p>
                `:""}
            `),w&&(w.innerHTML=`
                <div class="prose prose-lg max-w-none">
                    ${b.content}
                </div>
            `,I)){let P=w.querySelectorAll("h2, h3");if(P.length>0){let $='<nav class="space-y-2">';P.forEach((o,g)=>{let i=`section-${g}`;o.id=i;let s=o.tagName==="H2"?"pl-0":"pl-4";$+=`
                            <a href="#${i}" class="block text-sm ${s} text-gray-600 hover:text-primary-600 transition-colors">
                                ${o.textContent}
                            </a>
                        `}),$+="</nav>",I.innerHTML=$}}}function u(){document.querySelectorAll("#table-of-contents a").forEach(I=>{I.addEventListener("click",P=>{P.preventDefault();let $=I.getAttribute("href").slice(1),o=document.getElementById($);if(o){let i=o.getBoundingClientRect().top+window.pageYOffset-100;window.scrollTo({top:i,behavior:"smooth"})}})});let w={rootMargin:"-100px 0px -50% 0px",threshold:0},A=new IntersectionObserver(I=>{I.forEach(P=>{let $=P.target.id,o=document.querySelector(`#table-of-contents a[href="#${$}"]`);P.isIntersecting&&(document.querySelectorAll("#table-of-contents a").forEach(g=>{g.classList.remove("text-primary-600","font-medium"),g.classList.add("text-gray-600")}),o&&(o.classList.add("text-primary-600","font-medium"),o.classList.remove("text-gray-600")))})},w);document.querySelectorAll("#legal-content h2, #legal-content h3").forEach(I=>{I.id&&A.observe(I)})}function h(){}return{init:r,destroy:h}})();window.LegalPage=vs;Ks=vs});var Cs={};F(Cs,{default:()=>Zs});var ks,Zs,Es=M(()=>{ks=(function(){"use strict";let r=1,e="all";async function t(){if(!AuthGuard.protectPage())return;let o=a();o?await w(o):(await u(),P())}function a(){let g=window.location.pathname.match(/\/orders\/([^\/]+)/);return g?g[1]:null}async function u(){let o=document.getElementById("orders-list");if(o){Loader.show(o,"skeleton");try{let g={page:r,limit:10};e!=="all"&&(g.status=e);let i=await OrdersApi.getAll(g),s=i.data||[],l=i.meta||{};h(s,l)}catch(g){console.error("Failed to load orders:",g),o.innerHTML='<p class="text-red-500 text-center py-8">Failed to load orders.</p>'}}}function h(o,g){let i=document.getElementById("orders-list");if(!i)return;if(o.length===0){i.innerHTML=`
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
            `;return}i.innerHTML=`
            <div class="space-y-4">
                ${o.map(l=>b(l)).join("")}
            </div>
            ${g.total_pages>1?`
                <div id="orders-pagination" class="mt-8">${Pagination.render({currentPage:g.current_page||r,totalPages:g.total_pages,totalItems:g.total})}</div>
            `:""}
        `,document.getElementById("orders-pagination")?.addEventListener("click",l=>{let c=l.target.closest("[data-page]");c&&(r=parseInt(c.dataset.page),u(),window.scrollTo({top:0,behavior:"smooth"}))})}function b(o){let i={pending:"bg-yellow-100 text-yellow-700",processing:"bg-blue-100 text-blue-700",shipped:"bg-indigo-100 text-indigo-700",delivered:"bg-green-100 text-green-700",cancelled:"bg-red-100 text-red-700",refunded:"bg-gray-100 text-gray-700"}[o.status]||"bg-gray-100 text-gray-700",s=o.items||[],l=s.slice(0,3),c=s.length-3;return`
            <div class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div class="px-6 py-4 border-b border-gray-100 flex flex-wrap items-center justify-between gap-4">
                    <div>
                        <p class="text-sm text-gray-500">Order #${Templates.escapeHtml(o.order_number||o.id)}</p>
                        <p class="text-sm text-gray-500">Placed on ${Templates.formatDate(o.created_at)}</p>
                    </div>
                    <div class="flex items-center gap-4">
                        <span class="px-3 py-1 rounded-full text-sm font-medium ${i}">
                            ${Templates.escapeHtml(o.status_display||o.status)}
                        </span>
                        <a href="/orders/${o.id}/" class="text-primary-600 hover:text-primary-700 font-medium text-sm">
                            View Details
                        </a>
                    </div>
                </div>
                <div class="p-6">
                    <div class="flex flex-wrap gap-4">
                        ${l.map(y=>`
                            <div class="flex items-center gap-3">
                                <div class="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                                    <img src="${y.product?.image||"/static/images/placeholder.png"}" alt="" class="w-full h-full object-cover">
                                </div>
                                <div>
                                    <p class="text-sm font-medium text-gray-900">${Templates.escapeHtml(y.product?.name||y.product_name)}</p>
                                    <p class="text-sm text-gray-500">Qty: ${y.quantity}</p>
                                </div>
                            </div>
                        `).join("")}
                        ${c>0?`
                            <div class="flex items-center justify-center w-16 h-16 bg-gray-100 rounded-lg">
                                <span class="text-sm text-gray-500">+${c}</span>
                            </div>
                        `:""}
                    </div>
                    <div class="mt-4 pt-4 border-t border-gray-100 flex justify-between items-center">
                        <p class="text-sm text-gray-600">
                            ${s.length} ${s.length===1?"item":"items"}
                        </p>
                        <p class="font-semibold text-gray-900">Total: ${Templates.formatPrice(o.total)}</p>
                    </div>
                </div>
            </div>
        `}async function w(o){let g=document.getElementById("order-detail");if(g){Loader.show(g,"skeleton");try{let s=(await OrdersApi.getById(o)).data;if(!s){window.location.href="/orders/";return}A(s)}catch(i){console.error("Failed to load order:",i),g.innerHTML='<p class="text-red-500 text-center py-8">Failed to load order details.</p>'}}}function A(o){let g=document.getElementById("order-detail");if(!g)return;let s={pending:"bg-yellow-100 text-yellow-700",processing:"bg-blue-100 text-blue-700",shipped:"bg-indigo-100 text-indigo-700",delivered:"bg-green-100 text-green-700",cancelled:"bg-red-100 text-red-700",refunded:"bg-gray-100 text-gray-700"}[o.status]||"bg-gray-100 text-gray-700",l=o.items||[];g.innerHTML=`
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
                            <h1 class="text-xl font-bold text-gray-900">Order #${Templates.escapeHtml(o.order_number||o.id)}</h1>
                            <p class="text-sm text-gray-500">Placed on ${Templates.formatDate(o.created_at)}</p>
                        </div>
                        <span class="px-4 py-1.5 rounded-full text-sm font-medium ${s}">
                            ${Templates.escapeHtml(o.status_display||o.status)}
                        </span>
                    </div>
                </div>

                <!-- Order Timeline -->
                ${o.timeline&&o.timeline.length>0?`
                    <div class="px-6 py-4 border-b border-gray-100">
                        <h2 class="text-sm font-semibold text-gray-900 mb-4">Order Timeline</h2>
                        <div class="relative">
                            <div class="absolute left-2 top-2 bottom-2 w-0.5 bg-gray-200"></div>
                            <div class="space-y-4">
                                ${o.timeline.map((c,y)=>`
                                    <div class="relative pl-8">
                                        <div class="absolute left-0 w-4 h-4 rounded-full ${y===0?"bg-primary-600":"bg-gray-300"}"></div>
                                        <p class="text-sm font-medium text-gray-900">${Templates.escapeHtml(c.status)}</p>
                                        <p class="text-xs text-gray-500">${Templates.formatDate(c.timestamp,{includeTime:!0})}</p>
                                        ${c.note?`<p class="text-sm text-gray-600 mt-1">${Templates.escapeHtml(c.note)}</p>`:""}
                                    </div>
                                `).join("")}
                            </div>
                        </div>
                    </div>
                `:""}

                <!-- Tracking Info -->
                ${o.tracking_number?`
                    <div class="px-6 py-4 border-b border-gray-100 bg-blue-50">
                        <div class="flex items-center justify-between">
                            <div>
                                <p class="text-sm font-medium text-blue-900">Tracking Number</p>
                                <p class="text-lg font-mono text-blue-700">${Templates.escapeHtml(o.tracking_number)}</p>
                            </div>
                            ${o.tracking_url?`
                                <a href="${o.tracking_url}" target="_blank" class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium">
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
                        ${l.map(c=>`
                            <div class="flex gap-4">
                                <div class="w-20 h-20 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                                    <img src="${c.product?.image||"/static/images/placeholder.png"}" alt="" class="w-full h-full object-cover">
                                </div>
                                <div class="flex-1">
                                    <div class="flex justify-between">
                                        <div>
                                            <h3 class="font-medium text-gray-900">${Templates.escapeHtml(c.product?.name||c.product_name)}</h3>
                                            ${c.variant?`<p class="text-sm text-gray-500">${Templates.escapeHtml(c.variant.name||c.variant_name)}</p>`:""}
                                            <p class="text-sm text-gray-500">Qty: ${c.quantity}</p>
                                        </div>
                                        <p class="font-medium text-gray-900">${Templates.formatPrice(c.price*c.quantity)}</p>
                                    </div>
                                    ${c.product?.slug?`
                                        <a href="/products/${c.product.slug}/" class="text-sm text-primary-600 hover:text-primary-700 mt-2 inline-block">
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
                        ${o.shipping_address?`
                            <p class="text-sm text-gray-600">${Templates.escapeHtml(o.shipping_address.full_name||`${o.shipping_address.first_name} ${o.shipping_address.last_name}`)}</p>
                            <p class="text-sm text-gray-600">${Templates.escapeHtml(o.shipping_address.address_line_1)}</p>
                            ${o.shipping_address.address_line_2?`<p class="text-sm text-gray-600">${Templates.escapeHtml(o.shipping_address.address_line_2)}</p>`:""}
                            <p class="text-sm text-gray-600">${Templates.escapeHtml(o.shipping_address.city)}, ${Templates.escapeHtml(o.shipping_address.state||"")} ${Templates.escapeHtml(o.shipping_address.postal_code)}</p>
                            <p class="text-sm text-gray-600">${Templates.escapeHtml(o.shipping_address.country)}</p>
                        `:'<p class="text-sm text-gray-500">Not available</p>'}
                    </div>
                    <div>
                        <h2 class="text-sm font-semibold text-gray-900 mb-2">Billing Address</h2>
                        ${o.billing_address?`
                            <p class="text-sm text-gray-600">${Templates.escapeHtml(o.billing_address.full_name||`${o.billing_address.first_name} ${o.billing_address.last_name}`)}</p>
                            <p class="text-sm text-gray-600">${Templates.escapeHtml(o.billing_address.address_line_1)}</p>
                            ${o.billing_address.address_line_2?`<p class="text-sm text-gray-600">${Templates.escapeHtml(o.billing_address.address_line_2)}</p>`:""}
                            <p class="text-sm text-gray-600">${Templates.escapeHtml(o.billing_address.city)}, ${Templates.escapeHtml(o.billing_address.state||"")} ${Templates.escapeHtml(o.billing_address.postal_code)}</p>
                            <p class="text-sm text-gray-600">${Templates.escapeHtml(o.billing_address.country)}</p>
                        `:'<p class="text-sm text-gray-500">Same as shipping</p>'}
                    </div>
                </div>

                <!-- Order Summary -->
                <div class="px-6 py-4">
                    <h2 class="text-sm font-semibold text-gray-900 mb-4">Order Summary</h2>
                    <div class="space-y-2 text-sm">
                        <div class="flex justify-between">
                            <span class="text-gray-600">Subtotal</span>
                            <span class="font-medium">${Templates.formatPrice(o.subtotal||0)}</span>
                        </div>
                        ${o.discount_amount?`
                            <div class="flex justify-between text-green-600">
                                <span>Discount</span>
                                <span>-${Templates.formatPrice(o.discount_amount)}</span>
                            </div>
                        `:""}
                        <div class="flex justify-between">
                            <span class="text-gray-600">Shipping</span>
                            <span class="font-medium">${o.shipping_cost>0?Templates.formatPrice(o.shipping_cost):"Free"}</span>
                        </div>
                        ${o.tax_amount?`
                            <div class="flex justify-between">
                                <span class="text-gray-600">Tax</span>
                                <span class="font-medium">${Templates.formatPrice(o.tax_amount)}</span>
                            </div>
                        `:""}
                        <div class="flex justify-between pt-2 border-t border-gray-200">
                            <span class="font-semibold text-gray-900">Total</span>
                            <span class="font-bold text-gray-900">${Templates.formatPrice(o.total)}</span>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Actions -->
            <div class="mt-6 flex flex-wrap gap-4">
                ${o.status==="delivered"?`
                    <button id="reorder-btn" class="px-6 py-3 bg-primary-600 text-white font-semibold rounded-lg hover:bg-primary-700 transition-colors" data-order-id="${o.id}">
                        Order Again
                    </button>
                `:""}
                ${["pending","processing"].includes(o.status)?`
                    <button id="cancel-order-btn" class="px-6 py-3 border border-red-300 text-red-600 font-semibold rounded-lg hover:bg-red-50 transition-colors" data-order-id="${o.id}">
                        Cancel Order
                    </button>
                `:""}
                <button id="print-invoice-btn" class="px-6 py-3 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors">
                    Print Invoice
                </button>
            </div>
        `,I(o)}function I(o){let g=document.getElementById("reorder-btn"),i=document.getElementById("cancel-order-btn"),s=document.getElementById("print-invoice-btn");g?.addEventListener("click",async()=>{try{await OrdersApi.reorder(o.id),Toast.success("Items added to cart!"),document.dispatchEvent(new CustomEvent("cart:updated")),window.location.href="/cart/"}catch(l){Toast.error(l.message||"Failed to reorder.")}}),i?.addEventListener("click",async()=>{if(await Modal.confirm({title:"Cancel Order",message:"Are you sure you want to cancel this order? This action cannot be undone.",confirmText:"Cancel Order",cancelText:"Keep Order"}))try{await OrdersApi.cancel(o.id),Toast.success("Order cancelled."),window.location.reload()}catch(c){Toast.error(c.message||"Failed to cancel order.")}}),s?.addEventListener("click",()=>{window.print()})}function P(){let o=document.querySelectorAll("[data-filter-status]");o.forEach(g=>{g.addEventListener("click",()=>{o.forEach(i=>{i.classList.remove("bg-primary-100","text-primary-700"),i.classList.add("text-gray-600")}),g.classList.add("bg-primary-100","text-primary-700"),g.classList.remove("text-gray-600"),e=g.dataset.filterStatus,r=1,u()})})}function $(){r=1,e="all"}return{init:t,destroy:$}})();window.OrdersPage=ks;Zs=ks});var Ls=He(()=>{var ea=(function(){"use strict";let r=window.BUNORAA_ROUTES||{},e=r.preordersWizard||"/preorders/create/",t=r.preordersLanding||"/preorders/";async function a(){await Promise.all([u(),b(),w()])}async function u(){let s=document.getElementById("preorder-categories");if(s)try{let l=await PreordersApi.getCategories({featured:!0,pageSize:8}),c=l?.data?.results||l?.data||l?.results||[];if(c.length===0){s.innerHTML=`
                    <div class="col-span-full text-center py-12">
                        <svg class="w-16 h-16 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" 
                                  d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/>
                        </svg>
                        <p class="text-gray-600 dark:text-gray-400 mb-4">No categories available at the moment</p>
                        <p class="text-sm text-gray-500 dark:text-gray-500">Check back soon or contact us for custom requests</p>
                    </div>
                `;return}s.innerHTML=c.map(y=>h(y)).join("")}catch(l){console.error("Failed to load pre-order categories:",l),s.innerHTML=`
                <div class="col-span-full text-center py-12">
                    <svg class="w-16 h-16 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" 
                              d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/>
                    </svg>
                    <p class="text-gray-600 dark:text-gray-400">No categories available at the moment</p>
                </div>
            `}}function h(s){let l=s.image?.url||s.image||s.thumbnail||"",c=l&&l.length>0,y=Templates?.escapeHtml||(p=>p),f=Templates?.formatPrice||(p=>`\u09F3${p}`);return`
            <a href="${t}category/${s.slug}/" 
               class="group bg-white dark:bg-gray-800 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-200 dark:border-gray-700">
                ${c?`
                    <div class="aspect-video relative overflow-hidden">
                        <img src="${l}" alt="${y(s.name)}" 
                             class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                             loading="lazy">
                        <div class="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                    </div>
                `:`
                    <div class="aspect-video bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center">
                        ${s.icon?`<span class="text-5xl">${s.icon}</span>`:`
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
                            ${y(s.name)}
                        </h3>
                        ${s.icon?`<span class="text-2xl">${s.icon}</span>`:""}
                    </div>
                    
                    ${s.description?`
                        <p class="text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
                            ${y(s.description)}
                        </p>
                    `:""}
                    
                    <div class="flex items-center justify-between text-sm">
                        ${s.base_price?`
                            <span class="text-gray-500 dark:text-gray-500">
                                Starting from <span class="font-semibold text-purple-600">${f(s.base_price)}</span>
                            </span>
                        `:"<span></span>"}
                        ${s.min_production_days&&s.max_production_days?`
                            <span class="text-gray-500 dark:text-gray-500">
                                ${s.min_production_days}-${s.max_production_days} days
                            </span>
                        `:""}
                    </div>
                    
                    <div class="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700 flex items-center justify-between">
                        <div class="flex gap-2 flex-wrap">
                            ${s.requires_design?`
                                <span class="text-xs px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full">
                                    Design Required
                                </span>
                            `:""}
                            ${s.allow_rush_order?`
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
        `}async function b(){let s=document.getElementById("preorder-templates");s&&s.closest("section")?.classList.add("hidden")}async function w(){let s=document.getElementById("preorder-stats");if(!s)return;let l={totalOrders:"500+",happyCustomers:"450+",avgRating:"4.9"};s.innerHTML=`
            <div class="flex items-center gap-8 justify-center flex-wrap">
                <div class="text-center">
                    <p class="text-3xl font-bold text-purple-600 dark:text-purple-400">${l.totalOrders}</p>
                    <p class="text-sm text-gray-600 dark:text-gray-400">Orders Completed</p>
                </div>
                <div class="h-12 w-px bg-gray-200 dark:bg-gray-700 hidden sm:block"></div>
                <div class="text-center">
                    <p class="text-3xl font-bold text-purple-600 dark:text-purple-400">${l.happyCustomers}</p>
                    <p class="text-sm text-gray-600 dark:text-gray-400">Happy Customers</p>
                </div>
                <div class="h-12 w-px bg-gray-200 dark:bg-gray-700 hidden sm:block"></div>
                <div class="text-center">
                    <p class="text-3xl font-bold text-purple-600 dark:text-purple-400">${l.avgRating}</p>
                    <p class="text-sm text-gray-600 dark:text-gray-400">Average Rating</p>
                </div>
            </div>
        `}async function A(s){let l=document.getElementById("category-options");if(!(!l||!s))try{let c=await PreordersApi.getCategory(s),y=await PreordersApi.getCategoryOptions(c.id);I(l,y)}catch(c){console.error("Failed to load category options:",c)}}function I(s,l){if(!l||l.length===0){s.innerHTML='<p class="text-gray-500">No customization options available.</p>';return}s.innerHTML=l.map(c=>`
            <div class="border border-gray-200 dark:border-gray-700 rounded-xl p-4">
                <h4 class="font-semibold text-gray-900 dark:text-white mb-2">${Templates.escapeHtml(c.name)}</h4>
                ${c.description?`<p class="text-sm text-gray-600 dark:text-gray-400 mb-3">${Templates.escapeHtml(c.description)}</p>`:""}
                <div class="space-y-2">
                    ${c.choices?.map(y=>`
                        <label class="flex items-center gap-3 p-3 border border-gray-200 dark:border-gray-600 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                            <input type="${c.allow_multiple?"checkbox":"radio"}" name="option_${c.id}" value="${y.id}" class="text-purple-600 focus:ring-purple-500">
                            <span class="flex-1">
                                <span class="font-medium text-gray-900 dark:text-white">${Templates.escapeHtml(y.name)}</span>
                                ${y.price_modifier&&y.price_modifier!=="0.00"?`
                                    <span class="text-sm text-purple-600 dark:text-purple-400 ml-2">+${Templates.formatPrice(y.price_modifier)}</span>
                                `:""}
                            </span>
                        </label>
                    `).join("")||""}
                </div>
            </div>
        `).join("")}async function P(){let s=document.getElementById("my-preorders-list");if(s){Loader.show(s,"skeleton");try{let l=await PreordersApi.getMyPreorders(),c=l?.data?.results||l?.data||l?.results||[];if(c.length===0){s.innerHTML=`
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
                `;return}s.innerHTML=c.map(y=>$(y)).join("")}catch(l){console.error("Failed to load pre-orders:",l),s.innerHTML=`
                <div class="text-center py-12">
                    <p class="text-red-500">Failed to load your orders. Please try again.</p>
                </div>
            `}}}function $(s){let l={pending:"bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",quoted:"bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",accepted:"bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-400",in_progress:"bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400",review:"bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400",approved:"bg-teal-100 text-teal-800 dark:bg-teal-900/30 dark:text-teal-400",completed:"bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",cancelled:"bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",refunded:"bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400"},c={pending:"Pending Review",quoted:"Quote Sent",accepted:"Quote Accepted",in_progress:"In Progress",review:"Under Review",approved:"Approved",completed:"Completed",cancelled:"Cancelled",refunded:"Refunded"},y=l[s.status]||"bg-gray-100 text-gray-800",f=c[s.status]||s.status;return`
            <a href="${t}order/${s.preorder_number}/" class="block bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 hover:shadow-lg transition-shadow">
                <div class="flex items-start justify-between gap-4 mb-4">
                    <div>
                        <p class="text-sm text-gray-500 dark:text-gray-400">${s.preorder_number}</p>
                        <h3 class="text-lg font-semibold text-gray-900 dark:text-white">${Templates.escapeHtml(s.title||s.category?.name||"Custom Order")}</h3>
                    </div>
                    <span class="px-3 py-1 text-xs font-medium rounded-full ${y}">${f}</span>
                </div>
                ${s.description?`
                    <p class="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-2">${Templates.escapeHtml(s.description)}</p>
                `:""}
                <div class="flex items-center justify-between text-sm">
                    <span class="text-gray-500 dark:text-gray-400">
                        ${new Date(s.created_at).toLocaleDateString()}
                    </span>
                    ${s.final_price||s.estimated_price?`
                        <span class="font-semibold text-purple-600 dark:text-purple-400">
                            ${Templates.formatPrice(s.final_price||s.estimated_price)}
                        </span>
                    `:""}
                </div>
            </a>
        `}async function o(s){s&&await Promise.all([g(s),i(s)])}async function g(s){if(document.getElementById("preorder-status"))try{let c=await PreordersApi.getPreorderStatus(s)}catch{}}function i(s){let l=document.getElementById("message-form");l&&l.addEventListener("submit",async c=>{c.preventDefault();let y=l.querySelector('textarea[name="message"]'),f=l.querySelector('button[type="submit"]'),p=y?.value?.trim();if(!p){Toast.error("Please enter a message");return}let m=f.innerHTML;f.disabled=!0,f.innerHTML='<svg class="animate-spin h-5 w-5 mx-auto" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>';try{await PreordersApi.sendMessage(s,p),Toast.success("Message sent successfully"),y.value="",location.reload()}catch(x){Toast.error(x.message||"Failed to send message")}finally{f.disabled=!1,f.innerHTML=m}})}return{initLanding:a,initCategoryDetail:A,initMyPreorders:P,initDetail:o,loadFeaturedCategories:u,renderCategoryCard:h,renderPreorderCard:$}})();window.PreordersPage=ea});var _s={};F(_s,{default:()=>ta});var $s,ta,Ts=M(()=>{$s=(function(){"use strict";let r=null,e=null,t=null,a=!1,u=!1;async function h(){if(a)return;a=!0;let n=document.getElementById("product-detail");if(!n)return;let d=n.querySelector("h1")||n.dataset.productId;if(u=!!d,d){r={id:n.dataset.productId,slug:n.dataset.productSlug},b();return}let E=o();if(!E){window.location.href="/products/";return}await g(E)}function b(){c(),A(),I(),n();async function n(){let d=document.getElementById("add-to-wishlist-btn");if(!d)return;let E=document.getElementById("product-detail")?.dataset.productId;if(E&&!(typeof WishlistApi>"u"))try{let C=await WishlistApi.getWishlist({pageSize:100});C.success&&C.data?.items&&(C.data.items.some(T=>T.product_id===E||T.product===E)?(d.querySelector("svg")?.setAttribute("fill","currentColor"),d.classList.add("text-red-500")):(d.querySelector("svg")?.setAttribute("fill","none"),d.classList.remove("text-red-500")))}catch{}}P(),$(),w()}function w(){let n=document.querySelectorAll(".tab-btn"),d=document.querySelectorAll(".tab-content");n.forEach(E=>{E.addEventListener("click",()=>{let C=E.dataset.tab;n.forEach(L=>{L.classList.remove("border-primary-500","text-primary-600"),L.classList.add("border-transparent","text-gray-500")}),E.classList.add("border-primary-500","text-primary-600"),E.classList.remove("border-transparent","text-gray-500"),d.forEach(L=>{L.id===`${C}-tab`?L.classList.remove("hidden"):L.classList.add("hidden")})})})}function A(){let n=document.getElementById("add-to-cart-btn");n&&n.addEventListener("click",async()=>{let d=document.getElementById("product-detail")?.dataset.productId,E=parseInt(document.getElementById("quantity")?.value)||1,L=!!document.querySelector('input[name="variant"]'),T=document.querySelector('input[name="variant"]:checked')?.value;if(!d)return;if(L&&!T){Toast.warning("Please select a variant before adding to cart.");return}n.disabled=!0;let N=n.innerHTML;n.innerHTML='<svg class="animate-spin h-5 w-5 mx-auto" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>';try{await CartApi.addItem(d,E,T||null),Toast.success("Added to cart!"),document.dispatchEvent(new CustomEvent("cart:updated"))}catch(j){Toast.error(j.message||"Failed to add to cart.")}finally{n.disabled=!1,n.innerHTML=N}})}function I(){let n=document.getElementById("add-to-wishlist-btn");n&&n.addEventListener("click",async()=>{let d=document.getElementById("product-detail")?.dataset.productId;if(d){if(typeof AuthApi<"u"&&!AuthApi.isAuthenticated()){Toast.warning("Please login to add items to your wishlist."),window.location.href="/account/login/?next="+encodeURIComponent(window.location.pathname);return}try{let E=!1;if(typeof WishlistApi<"u"){let C=await WishlistApi.getWishlist({pageSize:100});C.success&&C.data?.items&&(E=C.data.items.some(L=>L.product_id===d||L.product===d))}if(E){let L=(await WishlistApi.getWishlist({pageSize:100})).data.items.find(T=>T.product_id===d||T.product===d);L&&(await WishlistApi.removeItem(L.id),Toast.success("Removed from wishlist!"),n.querySelector("svg")?.setAttribute("fill","none"),n.classList.remove("text-red-500"))}else await WishlistApi.addItem(d),Toast.success("Added to wishlist!"),n.querySelector("svg")?.setAttribute("fill","currentColor"),n.classList.add("text-red-500")}catch(E){Toast.error(E.message||"Wishlist action failed.")}}})}function P(){document.querySelectorAll('input[name="variant"]').forEach(d=>{d.addEventListener("change",()=>{e=d.value;let E=d.dataset.price;if(E){let C=document.getElementById("product-price");C&&window.Templates?.formatPrice&&(C.textContent=window.Templates.formatPrice(parseFloat(E)))}})})}function $(){document.getElementById("main-image")?.addEventListener("click",()=>{})}function o(){let d=window.location.pathname.match(/\/products\/([^\/]+)/);return d?d[1]:null}async function g(n){let d=document.getElementById("product-detail");if(d){Loader.show(d,"skeleton");try{if(r=(await ProductsApi.getBySlug(n)).data,!r){window.location.href="/404/";return}document.title=`${r.name} | Bunoraa`,i(r),await Promise.all([m(r),x(r),v(r)]),B(r)}catch(E){console.error("Failed to load product:",E),d.innerHTML='<p class="text-red-500 text-center py-8">Failed to load product. Please try again.</p>'}}}document.addEventListener("currency:changed",async n=>{try{!u&&r&&r.slug?await g(r.slug):location.reload()}catch{}});function i(n){let d=document.getElementById("product-detail");if(!d)return;let E=n.images||[],C=n.image||E[0]?.image||"/static/images/placeholder.png",L=n.variants&&n.variants.length>0,T=n.stock_quantity>0||n.in_stock,N=n.sale_price&&n.sale_price<n.price;d.innerHTML=`
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
                <!-- Gallery -->
                <div id="product-gallery" class="product-gallery">
                    <div class="main-image-container relative rounded-xl overflow-hidden bg-gray-100" style="aspect-ratio: ${n?.aspect?.css||"1/1"};">
                        <img 
                            src="${C}" 
                            alt="${Templates.escapeHtml(n.name)}"
                            class="main-image w-full h-full object-cover cursor-zoom-in"
                            id="main-product-image"
                        >
                        ${N?`
                            <span class="absolute top-4 left-4 px-3 py-1 bg-red-500 text-white text-sm font-medium rounded-full">
                                Sale
                            </span>
                        `:""}
                        ${T?"":`
                            <span class="absolute top-4 right-4 px-3 py-1 bg-gray-900 text-white text-sm font-medium rounded-full">
                                Out of Stock
                            </span>
                        `}
                    </div>
                    ${E.length>1?`
                        <div class="thumbnails flex gap-2 mt-4 overflow-x-auto pb-2">
                            ${E.map((j,R)=>`
                                <button 
                                    class="thumbnail flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 ${R===0?"border-primary-500":"border-transparent"} hover:border-primary-500 transition-colors"
                                    data-image="${j.image}"
                                    data-index="${R}"
                                >
                                    <img src="${j.image}" alt="" class="w-full h-full object-cover">
                                </button>
                            `).join("")}
                        </div>
                    `:""}
                </div>

                <!-- Product Info -->
                <div class="product-info">
                    <!-- Brand -->
                    ${n.brand?`
                        <a href="/products/?brand=${n.brand.id}" class="text-sm text-primary-600 hover:text-primary-700 font-medium">
                            ${Templates.escapeHtml(n.brand.name)}
                        </a>
                    `:""}

                    <!-- Title -->
                    <h1 class="text-2xl md:text-3xl font-bold text-gray-900 mt-2">
                        ${Templates.escapeHtml(n.name)}
                    </h1>

                    <!-- Rating -->
                    ${n.average_rating?`
                        <div class="flex items-center gap-2 mt-3">
                            <div class="flex items-center">
                                ${Templates.renderStars(n.average_rating)}
                            </div>
                            <span class="text-sm text-gray-600">
                                ${n.average_rating.toFixed(1)} (${n.review_count||0} reviews)
                            </span>
                            <a href="#reviews" class="text-sm text-primary-600 hover:text-primary-700">
                                Read reviews
                            </a>
                        </div>
                    `:""}

                    <!-- Price -->
                    <div class="mt-4">
                        ${Price.render({price:n.current_price??n.price_converted??n.price,salePrice:n.sale_price_converted??n.sale_price,size:"large"})}
                    </div>

                    <!-- Short Description -->
                    ${n.short_description?`
                        <p class="mt-4 text-gray-600">${Templates.escapeHtml(n.short_description)}</p>
                    `:""}

                    <!-- Variants -->
                    ${L?s(n.variants):""}

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
                                    max="${n.stock_quantity||99}"
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
                            ${n.stock_quantity?`
                                <span class="text-sm text-gray-500">${n.stock_quantity} available</span>
                            `:""}
                        </div>

                        <div class="flex gap-3">
                            <button 
                                id="add-to-cart-btn"
                                class="flex-1 px-6 py-3 bg-primary-600 text-white font-semibold rounded-lg hover:bg-primary-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
                                ${T?"":"disabled"}
                            >
                                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"/>
                                </svg>
                                ${T?"Add to Cart":"Out of Stock"}
                            </button>
                            <button 
                                id="add-to-wishlist-btn"
                                class="px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                                aria-label="Add to wishlist"
                                data-product-id="${n.id}"
                            >
                                <svg class="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/>
                                </svg>
                            </button>
                        </div>
                    </div>

                    <!-- Product Meta -->
                    <div class="mt-6 pt-6 border-t border-gray-200 space-y-3 text-sm">
                        ${n.sku?`
                            <div class="flex">
                                <span class="text-gray-500 w-24">SKU:</span>
                                <span class="text-gray-900">${Templates.escapeHtml(n.sku)}</span>
                            </div>
                        `:""}
                        ${n.category?`
                            <div class="flex">
                                <span class="text-gray-500 w-24">Category:</span>
                                <a href="/categories/${n.category.slug}/" class="text-primary-600 hover:text-primary-700">
                                    ${Templates.escapeHtml(n.category.name)}
                                </a>
                            </div>
                        `:""}
                        ${n.tags&&n.tags.length?`
                            <div class="flex">
                                <span class="text-gray-500 w-24">Tags:</span>
                                <div class="flex flex-wrap gap-1">
                                    ${n.tags.map(j=>`
                                        <a href="/products/?tag=${j.slug}" class="px-2 py-0.5 bg-gray-100 text-gray-600 rounded hover:bg-gray-200 transition-colors">
                                            ${Templates.escapeHtml(j.name)}
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
                        ${n.specifications&&Object.keys(n.specifications).length?`
                            <button data-tab class="px-6 py-4 text-sm font-medium text-gray-600 hover:text-gray-900 border-b-2 border-transparent">
                                Specifications
                            </button>
                        `:""}
                        <button data-tab class="px-6 py-4 text-sm font-medium text-gray-600 hover:text-gray-900 border-b-2 border-transparent">
                            Reviews (${n.review_count||0})
                        </button>
                    </nav>
                </div>
                <div class="py-6">
                    <div data-tab-panel>
                        <div class="prose max-w-none">
                            ${n.description||'<p class="text-gray-500">No description available.</p>'}
                        </div>
                    </div>
                    ${n.specifications&&Object.keys(n.specifications).length?`
                        <div data-tab-panel>
                            <table class="w-full">
                                <tbody>
                                    ${Object.entries(n.specifications).map(([j,R])=>`
                                        <tr class="border-b border-gray-100">
                                            <td class="py-3 text-sm font-medium text-gray-500 w-1/3">${Templates.escapeHtml(j)}</td>
                                            <td class="py-3 text-sm text-gray-900">${Templates.escapeHtml(String(R))}</td>
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
        `,l(),c(),y(),f(),p(),Tabs.init()}function s(n){let d={};return n.forEach(E=>{d[E.attribute_name]||(d[E.attribute_name]=[]),d[E.attribute_name].push(E)}),Object.entries(d).map(([E,C])=>`
            <div class="mt-6">
                <label class="text-sm font-medium text-gray-700">${Templates.escapeHtml(E)}:</label>
                <div class="flex flex-wrap gap-2 mt-2">
                    ${C.map((L,T)=>`
                        <button 
                            class="variant-btn px-4 py-2 border rounded-lg text-sm transition-colors ${T===0?"border-primary-500 bg-primary-50 text-primary-700":"border-gray-300 hover:border-gray-400"}"
                            data-variant-id="${L.id}"
                            data-price="${L.price_converted??L.price??""}"
                            data-stock="${L.stock_quantity||0}"
                        >
                            ${Templates.escapeHtml(L.value)}
                            ${(L.price_converted??L.price)&&L.price!==r.price?`
                                <span class="text-xs text-gray-500">(${Templates.formatPrice(L.price_converted??L.price)})</span>
                            `:""}
                        </button>
                    `).join("")}
                </div>
            </div>
        `).join("")}function l(){let n=document.querySelectorAll(".thumbnail"),d=document.getElementById("main-product-image");n.forEach(E=>{E.addEventListener("click",()=>{n.forEach(C=>C.classList.remove("border-primary-500")),E.classList.add("border-primary-500"),d.src=E.dataset.image})}),d?.addEventListener("click",()=>{let E=r.images?.map(L=>L.image)||[r.image],C=parseInt(document.querySelector(".thumbnail.border-primary-500")?.dataset.index)||0;ProductGallery.openLightbox(E,C)})}function c(){let n=document.getElementById("product-quantity"),d=document.querySelector(".qty-decrease"),E=document.querySelector(".qty-increase");d?.addEventListener("click",()=>{let L=parseInt(n.value)||1;L>1&&(n.value=L-1)}),E?.addEventListener("click",()=>{let L=parseInt(n.value)||1,T=parseInt(n.max)||99;L<T&&(n.value=L+1)});let C=document.querySelectorAll(".variant-btn");C.forEach(L=>{L.addEventListener("click",()=>{if(C.forEach(T=>{T.classList.remove("border-primary-500","bg-primary-50","text-primary-700"),T.classList.add("border-gray-300")}),L.classList.add("border-primary-500","bg-primary-50","text-primary-700"),L.classList.remove("border-gray-300"),e=L.dataset.variantId,L.dataset.price){let T=document.querySelector(".product-info .mt-4");T&&(T.innerHTML=Price.render({price:parseFloat(L.dataset.price),size:"large"}))}})}),C.length>0&&(e=C[0].dataset.variantId)}function y(){let n=document.getElementById("add-to-cart-btn");n&&n.addEventListener("click",async()=>{let d=parseInt(document.getElementById("product-quantity")?.value)||1;n.disabled=!0,n.innerHTML='<svg class="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>';try{await CartApi.addItem(r.id,d,e||null),Toast.success("Added to cart!"),document.dispatchEvent(new CustomEvent("cart:updated"))}catch(E){Toast.error(E.message||"Failed to add to cart.")}finally{n.disabled=!1,n.innerHTML=`
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"/>
                    </svg>
                    Add to Cart
                `}})}function f(){let n=document.getElementById("add-to-wishlist-btn");n&&n.addEventListener("click",async()=>{if(!AuthApi.isAuthenticated()){Toast.warning("Please login to add items to your wishlist."),window.location.href="/account/login/?next="+encodeURIComponent(window.location.pathname);return}try{await WishlistApi.addItem(r.id),Toast.success("Added to wishlist!"),n.querySelector("svg").setAttribute("fill","currentColor"),n.classList.add("text-red-500")}catch(d){d.message?.includes("already")?Toast.info("This item is already in your wishlist."):Toast.error(d.message||"Failed to add to wishlist.")}})}function p(){let n=document.querySelectorAll(".share-btn"),d=encodeURIComponent(window.location.href),E=encodeURIComponent(r?.name||document.title);n.forEach(C=>{C.addEventListener("click",()=>{let L=C.dataset.platform,T="";switch(L){case"facebook":T=`https://www.facebook.com/sharer/sharer.php?u=${d}`;break;case"twitter":T=`https://twitter.com/intent/tweet?url=${d}&text=${E}`;break;case"pinterest":let N=encodeURIComponent(r?.image||"");T=`https://pinterest.com/pin/create/button/?url=${d}&media=${N}&description=${E}`;break;case"copy":navigator.clipboard.writeText(window.location.href).then(()=>Toast.success("Link copied to clipboard!")).catch(()=>Toast.error("Failed to copy link."));return}T&&window.open(T,"_blank","width=600,height=400")})})}async function m(n){let d=document.getElementById("breadcrumbs");if(!d)return;let E=[{label:"Home",url:"/"},{label:"Products",url:"/products/"}];if(n.category)try{((await CategoriesAPI.getBreadcrumbs(n.category.id)).data||[]).forEach(T=>{E.push({label:T.name,url:`/categories/${T.slug}/`})})}catch{E.push({label:n.category.name,url:`/categories/${n.category.slug}/`})}E.push({label:n.name}),d.innerHTML=Breadcrumb.render(E)}async function x(n){let d=document.getElementById("related-products");if(d)try{let C=(await ProductsAPI.getRelated(n.id,{limit:4})).data||[];if(C.length===0){d.innerHTML="";return}d.innerHTML=`
                <h2 class="text-2xl font-bold text-gray-900 mb-6">You may also like</h2>
                <div class="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                    ${C.map(L=>ProductCard.render(L)).join("")}
                </div>
            `,ProductCard.bindEvents(d)}catch(E){console.error("Failed to load related products:",E),d.innerHTML=""}}async function v(n){let d=document.getElementById("reviews-container");if(d){Loader.show(d,"spinner");try{let C=(await ProductsAPI.getReviews(n.id)).data||[];d.innerHTML=`
                <!-- Review Summary -->
                <div class="flex flex-col md:flex-row gap-8 mb-8 pb-8 border-b border-gray-200">
                    <div class="text-center">
                        <div class="text-5xl font-bold text-gray-900">${n.average_rating?.toFixed(1)||"0.0"}</div>
                        <div class="flex justify-center mt-2">
                            ${Templates.renderStars(n.average_rating||0)}
                        </div>
                        <div class="text-sm text-gray-500 mt-1">${n.review_count||0} reviews</div>
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
                ${C.length>0?`
                    <div class="space-y-6">
                        ${C.map(L=>`
                            <div class="border-b border-gray-100 pb-6">
                                <div class="flex items-start gap-4">
                                    <div class="flex-shrink-0 w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                                        <span class="text-gray-600 font-medium">${(L.user?.first_name?.[0]||L.user?.email?.[0]||"U").toUpperCase()}</span>
                                    </div>
                                    <div class="flex-1">
                                        <div class="flex items-center gap-2">
                                            <span class="font-medium text-gray-900">${Templates.escapeHtml(L.user?.first_name||"Anonymous")}</span>
                                            ${L.verified_purchase?`
                                                <span class="px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded">Verified Purchase</span>
                                            `:""}
                                        </div>
                                        <div class="flex items-center gap-2 mt-1">
                                            ${Templates.renderStars(L.rating)}
                                            <span class="text-sm text-gray-500">${Templates.formatDate(L.created_at)}</span>
                                        </div>
                                        ${L.title?`<h4 class="font-medium text-gray-900 mt-2">${Templates.escapeHtml(L.title)}</h4>`:""}
                                        <p class="text-gray-600 mt-2">${Templates.escapeHtml(L.comment)}</p>
                                    </div>
                                </div>
                            </div>
                        `).join("")}
                    </div>
                `:`
                    <p class="text-gray-500 text-center py-8">No reviews yet. Be the first to review this product!</p>
                `}
            `,document.getElementById("write-review-btn")?.addEventListener("click",()=>{k(n)})}catch(E){console.error("Failed to load reviews:",E),d.innerHTML='<p class="text-red-500">Failed to load reviews.</p>'}}}function k(n){Modal.open({title:"Write a Review",content:`
                <form id="review-form" class="space-y-4">
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">Rating</label>
                        <div class="flex gap-1" id="rating-stars">
                            ${[1,2,3,4,5].map(C=>`
                                <button type="button" class="rating-star text-gray-300 hover:text-yellow-400" data-rating="${C}">
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
            `,confirmText:"Submit Review",onConfirm:async()=>{let C=parseInt(document.getElementById("review-rating").value),L=document.getElementById("review-title").value.trim(),T=document.getElementById("review-comment").value.trim();if(!C||C<1)return Toast.error("Please select a rating."),!1;if(!T)return Toast.error("Please write a review."),!1;try{return await ProductsAPI.createReview(n.id,{rating:C,title:L,comment:T}),Toast.success("Thank you for your review!"),v(n),!0}catch(N){return Toast.error(N.message||"Failed to submit review."),!1}}});let d=document.querySelectorAll(".rating-star"),E=document.getElementById("review-rating");d.forEach(C=>{C.addEventListener("click",()=>{let L=parseInt(C.dataset.rating);E.value=L,d.forEach((T,N)=>{N<L?(T.classList.remove("text-gray-300"),T.classList.add("text-yellow-400")):(T.classList.add("text-gray-300"),T.classList.remove("text-yellow-400"))})})})}async function B(n){try{await ProductsAPI.trackView(n.id)}catch{}}function q(){r=null,e=null,t=null,a=!1}return{init:h,destroy:q}})();window.ProductPage=$s;ta=$s});var Bs={};F(Bs,{default:()=>sa});var As,sa,Is=M(()=>{As=(function(){"use strict";let r="",e=1,t={},a=null,u=!1;async function h(){if(u)return;u=!0;let p=document.getElementById("search-results")||document.getElementById("products-grid");if(p&&p.querySelector(".product-card, [data-product-id]")){$(),l(),c(),b();return}r=I(),t=P(),e=parseInt(new URLSearchParams(window.location.search).get("page"))||1,await w(),$(),l(),c(),b()}function b(){let p=document.getElementById("view-grid"),m=document.getElementById("view-list");p?.addEventListener("click",()=>{p.classList.add("bg-primary-100","text-primary-700"),p.classList.remove("text-gray-400"),m?.classList.remove("bg-primary-100","text-primary-700"),m?.classList.add("text-gray-400"),Storage?.set("productViewMode","grid"),w()}),m?.addEventListener("click",()=>{m.classList.add("bg-primary-100","text-primary-700"),m.classList.remove("text-gray-400"),p?.classList.remove("bg-primary-100","text-primary-700"),p?.classList.add("text-gray-400"),Storage?.set("productViewMode","list"),w()})}async function w(){let p=document.getElementById("search-results")||document.getElementById("products-grid"),m=document.getElementById("results-count")||document.getElementById("product-count");if(p){a&&a.abort(),a=new AbortController,Loader.show(p,"skeleton");try{let x={page:e,pageSize:12,...t};if(r&&(x.search=r),window.location.pathname==="/categories/"){await A();return}let k=await ProductsApi.getProducts(x),B=Array.isArray(k)?k:k.data||k.results||[],q=k.meta||{};m&&(r?m.textContent=`${q.total||B.length} results for "${Templates.escapeHtml(r)}"`:m.textContent=`${q.total||B.length} products`),g(B,q),await i()}catch(x){if(x.name==="AbortError")return;console.error("Failed to load products:",x),p.innerHTML='<p class="text-red-500 text-center py-8">Failed to load products. Please try again.</p>'}}}async function A(){let p=document.getElementById("search-results")||document.getElementById("products-grid"),m=document.getElementById("results-count")||document.getElementById("product-count"),x=document.getElementById("page-title");if(p)try{let v=await CategoriesApi.getCategories({limit:50}),k=Array.isArray(v)?v:v.data||v.results||[];if(x&&(x.textContent="All Categories"),m&&(m.textContent=`${k.length} categories`),k.length===0){p.innerHTML=`
                    <div class="text-center py-16">
                        <svg class="w-24 h-24 text-gray-300 mx-auto mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"/>
                        </svg>
                        <h2 class="text-2xl font-bold text-gray-900 mb-2">No categories found</h2>
                        <p class="text-gray-600">Check back later for new categories.</p>
                    </div>
                `;return}p.innerHTML=`
                <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                    ${k.map(B=>`
                        <a href="/categories/${B.slug}/" class="group bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden">
                            <div class="relative overflow-hidden" style="aspect-ratio: ${product?.aspect?.css||"1/1"};">
                                ${B.image?`
                                    <img src="${B.image}" alt="${Templates.escapeHtml(B.name)}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300">
                                `:`
                                    <div class="w-full h-full flex items-center justify-center">
                                        <svg class="w-16 h-16 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"/>
                                        </svg>
                                    </div>
                                `}
                            </div>
                            <div class="p-4 text-center">
                                <h3 class="font-semibold text-gray-900 group-hover:text-primary-600 transition-colors">${Templates.escapeHtml(B.name)}</h3>
                                ${B.product_count?`<p class="text-sm text-gray-500 mt-1">${B.product_count} products</p>`:""}
                            </div>
                        </a>
                    `).join("")}
                </div>
            `}catch(v){console.error("Failed to load categories:",v),p.innerHTML='<p class="text-red-500 text-center py-8">Failed to load categories. Please try again.</p>'}}function I(){return new URLSearchParams(window.location.search).get("q")||""}function P(){let p=new URLSearchParams(window.location.search),m={};return p.get("category")&&(m.category=p.get("category")),p.get("min_price")&&(m.minPrice=p.get("min_price")),p.get("max_price")&&(m.maxPrice=p.get("max_price")),p.get("ordering")&&(m.ordering=p.get("ordering")),p.get("in_stock")&&(m.inStock=p.get("in_stock")==="true"),p.get("sale")&&(m.onSale=p.get("sale")==="true"),p.get("featured")&&(m.featured=p.get("featured")==="true"),m}function $(){let p=document.getElementById("search-form"),m=document.getElementById("search-input");m&&(m.value=r),p?.addEventListener("submit",k=>{k.preventDefault();let B=m?.value.trim();B&&(r=B,e=1,y(),o())});let x=document.getElementById("search-suggestions"),v=null;m?.addEventListener("input",k=>{let B=k.target.value.trim();if(clearTimeout(v),B.length<2){x&&(x.innerHTML="",x.classList.add("hidden"));return}v=setTimeout(async()=>{try{let n=(await ProductsApi.search({q:B,limit:5})).data||[];x&&n.length>0&&(x.innerHTML=`
                            <div class="py-2">
                                ${n.map(d=>`
                                    <a href="/products/${d.slug}/" class="flex items-center gap-3 px-4 py-2 hover:bg-gray-50">
                                        <img src="${d.image||"/static/images/placeholder.png"}" alt="" class="w-10 h-10 object-cover rounded">
                                        <div>
                                            <p class="text-sm font-medium text-gray-900">${Templates.escapeHtml(d.name)}</p>
                                            <p class="text-sm text-primary-600">${Templates.formatPrice(d.current_price??d.price_converted??d.price)}</p>
                                        </div>
                                    </a>
                                `).join("")}
                            </div>
                        `,x.classList.remove("hidden"))}catch(q){console.error("Search suggestions failed:",q)}},300)}),m?.addEventListener("blur",()=>{setTimeout(()=>{x&&x.classList.add("hidden")},200)})}async function o(){await w()}function g(p,m){let x=document.getElementById("search-results");if(!x)return;if(p.length===0){x.innerHTML=`
                <div class="text-center py-16">
                    <svg class="w-24 h-24 text-gray-300 mx-auto mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
                    </svg>
                    <h2 class="text-2xl font-bold text-gray-900 mb-2">No results found</h2>
                    <p class="text-gray-600 mb-4">We couldn't find any products matching "${Templates.escapeHtml(r)}"</p>
                    <p class="text-gray-500 text-sm">Try different keywords or browse our categories</p>
                </div>
            `;return}let v=Storage.get("productViewMode")||"grid",k=v==="list"?"space-y-4":"grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6";x.innerHTML=`
            <div class="${k}">
                ${p.map(q=>ProductCard.render(q,{layout:v})).join("")}
            </div>
            ${m.total_pages>1?`
                <div id="search-pagination" class="mt-8">${Pagination.render({currentPage:m.current_page||e,totalPages:m.total_pages,totalItems:m.total})}</div>
            `:""}
        `,ProductCard.bindEvents(x),document.getElementById("search-pagination")?.addEventListener("click",q=>{let n=q.target.closest("[data-page]");n&&(e=parseInt(n.dataset.page),y(),o(),window.scrollTo({top:0,behavior:"smooth"}))})}async function i(){let p=document.getElementById("filter-categories");if(p)try{let x=(await CategoriesAPI.getAll({has_products:!0,limit:20})).data||[];p.innerHTML=`
                <div class="space-y-2">
                    <label class="flex items-center">
                        <input type="radio" name="category" value="" ${t.category?"":"checked"} class="text-primary-600 focus:ring-primary-500">
                        <span class="ml-2 text-sm text-gray-600">All Categories</span>
                    </label>
                    ${x.map(v=>`
                        <label class="flex items-center">
                            <input type="radio" name="category" value="${v.id}" ${t.category===String(v.id)?"checked":""} class="text-primary-600 focus:ring-primary-500">
                            <span class="ml-2 text-sm text-gray-600">${Templates.escapeHtml(v.name)}</span>
                        </label>
                    `).join("")}
                </div>
            `,s()}catch{}}function s(){document.querySelectorAll('input[name="category"]').forEach(m=>{m.addEventListener("change",x=>{x.target.value?t.category=x.target.value:delete t.category,e=1,y(),o()})})}function l(){let p=document.getElementById("apply-price-filter"),m=document.getElementById("filter-in-stock"),x=document.getElementById("clear-filters");p?.addEventListener("click",()=>{let B=document.getElementById("filter-min-price")?.value,q=document.getElementById("filter-max-price")?.value;B?t.min_price=B:delete t.min_price,q?t.max_price=q:delete t.max_price,e=1,y(),o()}),m?.addEventListener("change",B=>{B.target.checked?t.in_stock=!0:delete t.in_stock,e=1,y(),o()}),x?.addEventListener("click",()=>{t={},e=1,document.querySelectorAll('input[name="category"]').forEach(n=>{n.checked=n.value===""});let B=document.getElementById("filter-min-price"),q=document.getElementById("filter-max-price");B&&(B.value=""),q&&(q.value=""),m&&(m.checked=!1),y(),o()});let v=document.getElementById("filter-min-price"),k=document.getElementById("filter-max-price");v&&t.min_price&&(v.value=t.min_price),k&&t.max_price&&(k.value=t.max_price),m&&t.in_stock&&(m.checked=!0)}function c(){let p=document.getElementById("sort-select");p&&(p.value=t.ordering||"",p.addEventListener("change",m=>{m.target.value?t.ordering=m.target.value:delete t.ordering,e=1,y(),o()}))}function y(){let p=new URLSearchParams;r&&p.set("q",r),t.category&&p.set("category",t.category),t.min_price&&p.set("min_price",t.min_price),t.max_price&&p.set("max_price",t.max_price),t.ordering&&p.set("ordering",t.ordering),t.in_stock&&p.set("in_stock","true"),e>1&&p.set("page",e);let m=`${window.location.pathname}?${p.toString()}`;window.history.pushState({},"",m)}function f(){a&&(a.abort(),a=null),r="",e=1,t={},u=!1}return{init:h,destroy:f}})();window.SearchPage=As;sa=As});var Hs={};F(Hs,{default:()=>aa});var Ss,aa,Ps=M(()=>{Ss=(function(){"use strict";let r=1;async function e(){AuthGuard.protectPage()&&await u()}function t($={}){let o=$.product||$||{},g=[$.product_image,o.product_image,o.primary_image,o.image,Array.isArray(o.images)?o.images[0]:null,o.image_url,o.thumbnail],i=s=>{if(!s)return"";if(typeof s=="string")return s;if(typeof s=="object"){if(typeof s.image=="string"&&s.image)return s.image;if(s.image&&typeof s.image=="object"){if(typeof s.image.url=="string"&&s.image.url)return s.image.url;if(typeof s.image.src=="string"&&s.image.src)return s.image.src}if(typeof s.url=="string"&&s.url)return s.url;if(typeof s.src=="string"&&s.src)return s.src}return""};for(let s of g){let l=i(s);if(l)return l}return""}function a($={}){let o=$.product||$||{},g=y=>{if(y==null)return null;let f=Number(y);return Number.isFinite(f)?f:null},i=[$.product_price,o.price,$.price,$.current_price,$.price_at_add],s=null;for(let y of i)if(s=g(y),s!==null)break;let l=[$.product_sale_price,o.sale_price,$.sale_price],c=null;for(let y of l)if(c=g(y),c!==null)break;return{price:s!==null?s:0,salePrice:c!==null?c:null}}async function u(){let $=document.getElementById("wishlist-container");if($){Loader.show($,"skeleton");try{let o=await WishlistApi.getWishlist({page:r}),g=[],i={};Array.isArray(o)?g=o:o&&typeof o=="object"&&(g=o.data||o.results||o.items||[],!Array.isArray(g)&&o.data&&typeof o.data=="object"?(g=o.data.items||o.data.results||[],i=o.data.meta||o.meta||{}):i=o.meta||{}),Array.isArray(g)||(g=g&&typeof g=="object"?[g]:[]),h(g,i)}catch(o){let g=o&&(o.message||o.detail)||"Failed to load wishlist.";if(o&&o.status===401){AuthGuard.redirectToLogin();return}$.innerHTML=`<p class="text-red-500 text-center py-8">${Templates.escapeHtml(g)}</p>`}}}function h($,o){let g=document.getElementById("wishlist-container");if(g){if($.length===0){g.innerHTML=`
                <div class="text-center py-16">
                    <svg class="w-24 h-24 text-gray-300 mx-auto mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/>
                    </svg>
                    <h2 class="text-2xl font-bold text-gray-900 mb-2">Your wishlist is empty</h2>
                    <p class="text-gray-600 mb-8">Start adding items you love to your wishlist.</p>
                    <a href="/products/" class="inline-flex items-center px-6 py-3 bg-primary-600 text-white font-semibold rounded-lg hover:bg-primary-700 transition-colors">
                        Browse Products
                    </a>
                </div>
            `;return}if(g.innerHTML=`
            <div class="mb-6 flex items-center justify-between">
                <h1 class="text-2xl font-bold text-gray-900">My Wishlist (${$.length} items)</h1>
                <button id="clear-wishlist-btn" class="text-red-600 hover:text-red-700 font-medium text-sm">
                    Clear All
                </button>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                ${$.map(i=>b(i)).join("")}
            </div> 
            ${o.total_pages>1?`
                <div id="wishlist-pagination" class="mt-8"></div>
            `:""}
        `,o&&o.total_pages>1){let i=document.getElementById("wishlist-pagination");if(i&&window.Pagination){let s=new window.Pagination({totalPages:o.total_pages,currentPage:o.current_page||r,className:"justify-center",onChange:l=>{r=l,u(),window.scrollTo({top:0,behavior:"smooth"})}});i.innerHTML="",i.appendChild(s.create())}}w()}}function b($){try{let o=$.product||$||{},g=$.product_name||o.name||"",i=$.product_slug||o.slug||"",s=$.is_in_stock!==void 0?$.is_in_stock:o.is_in_stock!==void 0?o.is_in_stock:o.stock_quantity>0,l=t($||{}),c=!!$.product_has_variants,y={price:0,salePrice:null};try{y=a($||{})}catch{y={price:0,salePrice:null}}let{price:f,salePrice:p}=y,m=k=>{try{return Templates.escapeHtml(k||"")}catch{return String(k||"")}},x=k=>{try{return Price.render({price:k.price,salePrice:k.salePrice})}catch{return`<span class="font-bold">${k.price||""}</span>`}},v=o&&o.aspect&&(o.aspect.css||(o.aspect.width&&o.aspect.height?`${o.aspect.width}/${o.aspect.height}`:null))||"1/1";return`
                <div class="wishlist-item relative bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden" data-item-id="${$&&$.id?$.id:""}" data-product-id="${o&&o.id?o.id:$&&$.product?$.product:""}" data-product-slug="${m(i)}" data-product-has-variants="${c}">
                    <div class="relative" style="aspect-ratio: ${v};">
                        ${$&&$.discount_percentage?`
                            <div class="absolute top-2 left-2 z-10 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
                                -${$.discount_percentage}%
                            </div>
                        `:""}
                        <button class="remove-btn absolute top-2 right-2 z-20 w-10 h-10 bg-gray-900 text-white rounded-full shadow-lg ring-2 ring-white/25 border border-white/30 flex items-center justify-center hover:bg-gray-800 transition-colors" aria-label="Remove from wishlist" style="pointer-events:auto;">
                            <svg class="w-5 h-5" fill="none" stroke="white" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M6 18L18 6M6 6l12 12"/>
                            </svg>
                        </button>
                        <a href="/products/${m(i)}/">
                            ${l?`
                                <img 
                                    src="${l}" 
                                    alt="${m(g)}"
                                    class="w-full h-full object-cover"
                                    loading="lazy"
                                >
                            `:`
                                <div class="w-full h-full bg-gray-200 flex items-center justify-center text-gray-400 text-xs uppercase tracking-wide">No Image</div>
                            `}
                        </a>
                    </div>
                    <div class="p-4">
                        ${o&&o.category?`
                            <a href="/categories/${m(o.category.slug)}/" class="text-xs text-gray-500 hover:text-primary-600">
                                ${m(o.category.name)}
                            </a>
                        `:""}
                        <h3 class="font-medium text-gray-900 mt-1 line-clamp-2">
                            <a href="/products/${m(i)}/" class="hover:text-primary-600">
                                ${m(g)}
                            </a>
                        </h3>
                        <div class="mt-2">
                            ${x({price:f,salePrice:p})}
                        </div>
                        ${o&&o.average_rating?`
                            <div class="flex items-center gap-1 mt-2">
                                ${Templates.renderStars(o.average_rating)}
                                <span class="text-xs text-gray-500">(${o.review_count||0})</span>
                            </div>
                        `:""}
                        <button 
                            class="add-to-cart-btn mt-4 w-full px-4 py-2 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors text-sm"
                            ${s?"":"disabled"}
                        >
                            ${c?"Select variant":s?"Add to Cart":"Out of Stock"}
                        </button>
                    </div>
                    ${$&&$.added_at?`
                        <div class="px-4 pb-4">
                            <p class="text-xs text-gray-400">Added ${Templates.formatDate($.added_at)}</p>
                        </div>
                    `:""}
                </div>
            `}catch{return'<div class="p-4 bg-white rounded shadow text-gray-500">Failed to render item</div>'}}function w(){let $=document.getElementById("clear-wishlist-btn"),o=document.querySelectorAll(".wishlist-item"),g=document.getElementById("wishlist-pagination");$?.addEventListener("click",async()=>{if(await Modal.confirm({title:"Clear Wishlist",message:"Are you sure you want to remove all items from your wishlist?",confirmText:"Clear All",cancelText:"Cancel"}))try{await WishlistApi.clear(),Toast.success("Wishlist cleared."),await u()}catch(s){Toast.error(s.message||"Failed to clear wishlist.")}}),o.forEach(i=>{let s=i.dataset.itemId,l=i.dataset.productId;i.querySelector(".remove-btn")?.addEventListener("click",async()=>{try{await WishlistApi.removeItem(s),Toast.success("Removed from wishlist."),i.remove(),document.querySelectorAll(".wishlist-item").length===0&&await u()}catch(c){Toast.error(c.message||"Failed to remove item.")}}),i.querySelector(".add-to-cart-btn")?.addEventListener("click",async c=>{let y=c.target;if(y.disabled)return;y.disabled=!0,y.textContent="Adding...";let f=i.dataset.productSlug||"";if(i.dataset.productHasVariants==="true"||i.dataset.productHasVariants==="True"||i.dataset.productHasVariants==="1"){I(i);return}try{await CartApi.addItem(l,1),Toast.success("Added to cart!"),document.dispatchEvent(new CustomEvent("cart:updated"))}catch(m){if(!!(m&&(m.errors&&m.errors.variant_id||m.message&&typeof m.message=="string"&&m.message.toLowerCase().includes("variant")))){Toast.info("This product requires selecting a variant. Redirecting to the product page...");let v=f;if(!v){let k=i.querySelector("a")?.getAttribute("href");if(k){let B=k.match(/\/products\/(.*)\/?$/);B&&(v=B[1])}}if(v){window.location.href=`/products/${v}/`;return}}Toast.error(m.message||"Failed to add to cart.")}finally{y.disabled=!1,y.textContent="Add to Cart"}})})}function A($){let o={};return $.forEach(g=>{o[g.attribute_name]||(o[g.attribute_name]=[]),o[g.attribute_name].push(g)}),Object.entries(o).map(([g,i])=>`
            <div class="mt-4">
                <label class="text-sm font-medium text-gray-700">${Templates.escapeHtml(g)}:</label>
                <div class="flex flex-wrap gap-2 mt-2" id="wishlist-variant-group-${Templates.slugify(g)}">
                    ${i.map((s,l)=>`
                        <button type="button" class="wishlist-modal-variant-btn px-3 py-2 border rounded-lg text-sm transition-colors ${l===0?"border-primary-500 bg-primary-50 text-primary-700":"border-gray-300 hover:border-gray-400"}" data-variant-id="${s.id}" data-price="${s.price_converted??s.price??""}" data-stock="${s.stock_quantity||0}">
                            ${Templates.escapeHtml(s.value)}
                            ${s.price_converted??s.price?`<span class="text-xs text-gray-500"> (${Templates.formatPrice(s.price_converted??s.price)})</span>`:""}
                        </button>
                    `).join("")}
                </div>
            </div>
        `).join("")}async function I($){let o=$.product_slug||$.dataset?.productSlug||"",g=$.product||$.dataset?.productId||"";try{let i;if(typeof ProductsApi<"u"&&ProductsApi.getProduct)i=await ProductsApi.getProduct(o||g);else{let p=window.BUNORAA_CURRENCY&&window.BUNORAA_CURRENCY.code||void 0;i=await ApiClient.get(`/products/${o||g}/`,{currency:p})}if(!i||!i.success||!i.data){let p=i&&i.message?i.message:"Failed to load product variants.";Toast.error(p);return}let s=i.data,l=s.variants||[];if(!l.length){window.location.href=`/products/${s.slug||o||g}/`;return}let c=s.images?.[0]?.image||s.primary_image||s.image||"",y=`
                <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div class="col-span-1">
                        ${c?`<img src="${c}" class="w-full h-48 object-cover rounded" alt="${Templates.escapeHtml(s.name)}">`:'<div class="w-full h-48 bg-gray-100 rounded"></div>'}
                    </div>
                    <div class="col-span-2">
                        <h3 class="text-lg font-semibold">${Templates.escapeHtml(s.name)}</h3>
                        <div id="wishlist-variant-price" class="mt-2 text-lg font-bold">${Templates.formatPrice(l?.[0]?.price_converted??l?.[0]?.price??s.price)}</div>
                        <div id="wishlist-variant-options" class="mt-4">
                            ${A(l)}
                        </div>
                        <div class="mt-4 flex items-center gap-2">
                            <label class="text-sm text-gray-700">Qty</label>
                            <input id="wishlist-variant-qty" type="number" value="1" min="1" class="w-20 px-3 py-2 border rounded" />
                        </div>
                    </div>
                </div>
            `,f=await Modal.open({title:"Select Variant",content:y,confirmText:"Add to Cart",cancelText:"Cancel",size:"md",onConfirm:async()=>{let m=document.querySelector(".wishlist-modal-variant-btn.border-primary-500")||document.querySelector(".wishlist-modal-variant-btn");if(!m)return Toast.error("Please select a variant."),!1;let x=m.dataset.variantId,v=parseInt(document.getElementById("wishlist-variant-qty")?.value)||1;try{return await CartApi.addItem(s.id,v,x),Toast.success("Added to cart!"),document.dispatchEvent(new CustomEvent("cart:updated")),!0}catch(k){return Toast.error(k.message||"Failed to add to cart."),!1}}});setTimeout(()=>{let p=document.querySelectorAll(".wishlist-modal-variant-btn");p.forEach(x=>{x.addEventListener("click",()=>{p.forEach(k=>k.classList.remove("border-primary-500","bg-primary-50","text-primary-700")),x.classList.add("border-primary-500","bg-primary-50","text-primary-700");let v=x.dataset.price;if(v!==void 0){let k=document.getElementById("wishlist-variant-price");k&&(k.textContent=Templates.formatPrice(v))}})});let m=document.querySelector(".wishlist-modal-variant-btn");m&&m.click()},20)}catch{Toast.error("Failed to load variants.")}}function P(){r=1}return{init:e,destroy:P}})();window.WishlistPage=Ss;aa=Ss});var ra,Be=M(()=>{ra=Se({"./pages/account.js":()=>Promise.resolve().then(()=>(Kt(),Jt)),"./pages/cart.js":()=>Promise.resolve().then(()=>(ts(),es)),"./pages/category.js":()=>Promise.resolve().then(()=>(rs(),as)),"./pages/checkout.js":()=>Promise.resolve().then(()=>(os(),is)),"./pages/contact.js":()=>Promise.resolve().then(()=>(ds(),cs)),"./pages/faq.js":()=>Promise.resolve().then(()=>(ps(),ms)),"./pages/home.js":()=>Promise.resolve().then(()=>(bs(),ys)),"./pages/legal.js":()=>Promise.resolve().then(()=>(ws(),xs)),"./pages/orders.js":()=>Promise.resolve().then(()=>(Es(),Cs)),"./pages/preorders.js":()=>Promise.resolve().then(()=>Rs(Ls())),"./pages/product.js":()=>Promise.resolve().then(()=>(Ts(),_s)),"./pages/search.js":()=>Promise.resolve().then(()=>(Is(),Bs)),"./pages/wishlist.js":()=>Promise.resolve().then(()=>(Ps(),Hs))})});var na=He(()=>{Qt();Be();var Ie=(function(){"use strict";let r={},e=null,t=null;async function a(f){try{let p=await ra(`./pages/${f}.js`);return p.default||p}catch{return null}}function u(){A(),I(),P(),$(),h(),i(),l(),c();try{let f=performance.getEntriesByType?performance.getEntriesByType("navigation"):[],p=f&&f[0]||null;p&&p.type==="navigate"&&!window.location.hash&&setTimeout(()=>{let m=document.scrollingElement||document.documentElement;if(!m)return;let x=m.scrollTop||window.pageYOffset||0,v=Math.max(0,m.scrollHeight-window.innerHeight);x>Math.max(100,v*.6)&&window.scrollTo({top:0,behavior:"auto"})},60)}catch{}}async function h(){try{if(!AuthApi.isAuthenticated()){let x=localStorage.getItem("wishlist");if(x){let v=JSON.parse(x);WishlistApi.updateBadge(v);let k=v.items||v.data&&v.data.items||[];w(k)}else w([]);return}let p=(await WishlistApi.getWishlist({pageSize:200})).data||{},m=p.items||p.data||[];WishlistApi.updateBadge(p),w(m)}catch{try{let p=localStorage.getItem("wishlist");if(p){let m=JSON.parse(p);WishlistApi.updateBadge(m);let x=m.items||m.data&&m.data.items||[];w(x)}}catch{}}}let b=[];function w(f){try{b=f||[];let p={},m={};(f||[]).forEach(x=>{let v=x.product||x.product_id||x.product&&x.product.id||null,k=x.product_slug||x.product&&x.product.slug||null,B=x.id||x.pk||x.uuid||x.item||null;v&&(p[String(v)]=B||!0),k&&(m[String(k)]=B||!0)}),document.querySelectorAll(".wishlist-btn").forEach(x=>{try{let v=x.querySelector("svg"),k=v?.querySelector(".heart-fill"),B=x.dataset.productId||x.closest("[data-product-id]")?.dataset.productId,q=x.dataset.productSlug||x.closest("[data-product-slug]")?.dataset.productSlug,n=null;B&&p.hasOwnProperty(String(B))?n=p[String(B)]:q&&m.hasOwnProperty(String(q))&&(n=m[String(q)]),n?(x.dataset.wishlistItemId=n,x.classList.add("text-red-500"),x.setAttribute("aria-pressed","true"),v?.classList.add("fill-current"),k&&(k.style.opacity="1")):(x.removeAttribute("data-wishlist-item-id"),x.classList.remove("text-red-500"),x.setAttribute("aria-pressed","false"),v?.classList.remove("fill-current"),k&&(k.style.opacity="0"))}catch{}})}catch{}}(function(){if(typeof MutationObserver>"u")return;let f=null;new MutationObserver(function(m){let x=!1;for(let v of m){if(v.addedNodes&&v.addedNodes.length){for(let k of v.addedNodes)if(k.nodeType===1&&(k.matches?.(".product-card")||k.querySelector?.(".product-card")||k.querySelector?.(".wishlist-btn"))){x=!0;break}}if(x)break}x&&(clearTimeout(f),f=setTimeout(()=>{try{w(b)}catch{}},150))}).observe(document.body,{childList:!0,subtree:!0})})();function A(){let f=window.location.pathname,p=document.body;if(p.dataset.page){e=p.dataset.page;return}if((f.startsWith("/accounts/")||f.startsWith("/account/"))&&!(f.startsWith("/accounts/profile")||f.startsWith("/account/profile"))){e=null;return}f==="/"||f==="/home/"?e="home":f==="/categories/"||f==="/products/"?e="search":f.startsWith("/categories/")&&f!=="/categories/"?e="category":f.startsWith("/products/")&&f!=="/products/"?e="product":f==="/search/"||f.startsWith("/search")?e="search":f.startsWith("/cart")?e="cart":f.startsWith("/checkout")?e="checkout":f==="/account"||f.startsWith("/account/")||f.startsWith("/accounts/profile")?e="account":f.startsWith("/orders")?e="orders":f.startsWith("/wishlist")?e="wishlist":f.startsWith("/contact")?e="contact":f.startsWith("/faq")?e="faq":(f.includes("privacy")||f.includes("terms")||f.includes("legal")||f.includes("policy"))&&(e="legal")}function I(){typeof Tabs<"u"&&document.querySelector("[data-tabs]")&&Tabs.init(),typeof Dropdown<"u"&&document.querySelectorAll("[data-dropdown-trigger]").forEach(f=>{let p=f.dataset.dropdownTarget,m=document.getElementById(p);m&&Dropdown.create(f,{content:m.innerHTML})});try{Yt()}catch{}}async function P(){if(!e)return;try{t&&typeof t.destroy=="function"&&t.destroy()}catch{}let f=await a(e);if(f&&typeof f.init=="function"){t=f;try{await t.init()}catch(p){console.error("failed to init page controller",p)}}}try{"serviceWorker"in navigator&&navigator.serviceWorker.register("/static/js/sw.js").catch(()=>{})}catch{}async function $(){if(document.querySelectorAll("[data-cart-count]").length)try{let m=(await CartApi.getCart()).data?.item_count||0;try{localStorage.setItem("cart",JSON.stringify({item_count:m,savedAt:Date.now()}))}catch{}g(m)}catch{try{let m=localStorage.getItem("cart");if(m){let v=JSON.parse(m)?.item_count||0;g(v);return}}catch(m){console.error("Failed to get cart count fallback:",m)}}}async function o(f){try{return(((await WishlistApi.getWishlist({pageSize:200})).data||{}).items||[]).find(k=>String(k.product)===String(f))?.id||null}catch{return null}}function g(f){document.querySelectorAll("[data-cart-count]").forEach(m=>{m.textContent=f>99?"99+":f,m.classList.toggle("hidden",f===0)})}function i(){document.addEventListener("cart:updated",async()=>{await $()}),document.addEventListener("wishlist:updated",async()=>{await h()}),document.addEventListener("auth:login",()=>{s(!0)}),document.addEventListener("auth:logout",()=>{s(!1)}),document.querySelectorAll(".wishlist-btn").forEach(p=>{try{let m=p.querySelector("svg"),x=m?.querySelector(".heart-fill");p.classList.contains("text-red-500")?(m?.classList.add("fill-current"),x&&(x.style.opacity="1")):x&&(x.style.opacity="0")}catch{}}),document.addEventListener("click",async p=>{let m=p.target.closest("[data-quick-add], [data-add-to-cart], .add-to-cart-btn");if(m){p.preventDefault();let x=m.dataset.productId||m.dataset.quickAdd||m.dataset.addToCart;if(!x)return;m.disabled=!0;let v=m.innerHTML;m.innerHTML='<svg class="animate-spin h-4 w-4 mx-auto" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>';try{await CartApi.addItem(x,1),Toast.success("Added to cart!"),document.dispatchEvent(new CustomEvent("cart:updated"))}catch(k){Toast.error(k.message||"Failed to add to cart.")}finally{m.disabled=!1,m.innerHTML=v}}}),document.addEventListener("click",async p=>{let m=p.target.closest("[data-wishlist-toggle], .wishlist-btn");if(m){if(p.preventDefault(),!AuthApi.isAuthenticated()){Toast.warning("Please login to add items to your wishlist."),window.location.href="/account/login/?next="+encodeURIComponent(window.location.pathname);return}let x=m.dataset.wishlistToggle||m.dataset.productId||m.closest("[data-product-id]")?.dataset.productId;m.disabled=!0;let v=m.dataset.wishlistItemId||"";!v&&m.classList.contains("text-red-500")&&(v=await o(x)||"");let B=m.classList.contains("text-red-500")&&v;try{if(B){let q=await WishlistApi.removeItem(v);m.classList.remove("text-red-500"),m.setAttribute("aria-pressed","false"),m.querySelector("svg")?.classList.remove("fill-current");let n=m.querySelector("svg")?.querySelector(".heart-fill");n&&(n.style.opacity="0"),m.removeAttribute("data-wishlist-item-id"),Toast.success("Removed from wishlist.")}else{let q=await WishlistApi.addItem(x),n=q.data?.id||q.data?.item?.id||await o(x);n&&(m.dataset.wishlistItemId=n),m.classList.add("text-red-500"),m.setAttribute("aria-pressed","true"),m.querySelector("svg")?.classList.add("fill-current");let d=m.querySelector("svg")?.querySelector(".heart-fill");d&&(d.style.opacity="1"),Toast.success(q.message||"Added to wishlist!")}}catch(q){console.error("wishlist:error",q),Toast.error(q.message||"Failed to update wishlist.")}finally{m.disabled=!1}}}),document.addEventListener("click",p=>{let m=p.target.closest("[data-quick-view], .quick-view-btn");if(m){p.preventDefault();let x=m.dataset.quickView||m.dataset.productId,v=m.dataset.productSlug;v?window.location.href=`/products/${v}/`:x&&(typeof Modal<"u"&&Modal.showQuickView?Modal.showQuickView(x):window.location.href=`/products/${x}/`)}}),document.addEventListener("click",async p=>{if(p.target.closest("[data-logout]")){p.preventDefault();try{await AuthApi.logout(),Toast.success("Logged out successfully."),document.dispatchEvent(new CustomEvent("auth:logout")),window.location.href="/"}catch{Toast.error("Failed to logout.")}}});let f=document.getElementById("back-to-top");f&&(window.addEventListener("scroll",Debounce.throttle(()=>{window.scrollY>500?f.classList.remove("opacity-0","pointer-events-none"):f.classList.add("opacity-0","pointer-events-none")},100)),f.addEventListener("click",()=>{window.scrollTo({top:0,behavior:"smooth"})}))}function s(f){document.querySelectorAll("[data-auth-state]").forEach(m=>{let x=m.dataset.authState;x==="logged-in"?m.classList.toggle("hidden",!f):x==="logged-out"&&m.classList.toggle("hidden",f)})}function l(){let f=document.getElementById("mobile-menu-btn"),p=document.getElementById("close-mobile-menu"),m=document.getElementById("mobile-menu"),x=document.getElementById("mobile-menu-overlay");function v(){m?.classList.remove("translate-x-full"),x?.classList.remove("hidden"),document.body.classList.add("overflow-hidden")}function k(){m?.classList.add("translate-x-full"),x?.classList.add("hidden"),document.body.classList.remove("overflow-hidden")}f?.addEventListener("click",v),p?.addEventListener("click",k),x?.addEventListener("click",k)}function c(){let f=document.querySelector("[data-language-selector]"),p=document.getElementById("language-dropdown");f&&p&&(Dropdown.create(f,p),p.querySelectorAll("[data-language]").forEach(m=>{m.addEventListener("click",async()=>{let x=m.dataset.language;try{await LocalizationApi.setLanguage(x),Storage.set("language",x),window.location.reload()}catch{Toast.error("Failed to change language.")}})}))}function y(){t&&typeof t.destroy=="function"&&t.destroy(),e=null,t=null}return{init:u,destroy:y,getCurrentPage:()=>e,updateCartBadge:g}})();document.readyState==="loading"?document.addEventListener("DOMContentLoaded",Ie.init):Ie.init();window.App=Ie});na();})();
//# sourceMappingURL=app.bundle.js.map
