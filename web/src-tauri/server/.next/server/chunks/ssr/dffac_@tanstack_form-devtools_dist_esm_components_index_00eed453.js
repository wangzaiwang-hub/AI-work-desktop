module.exports=[136630,a=>{"use strict";var b=a.i(515139),c=a.i(435133),d=a.i(577769);class e{#a=!0;#b;#c;#d;#e;#f;#g;#h;#i=0;#j=5;#k=!1;#l=!1;#m=null;#n=()=>{this.debugLog("Connected to event bus"),this.#f=!0,this.#k=!1,this.debugLog("Emitting queued events",this.#e),this.#e.forEach(a=>this.emitEventToBus(a)),this.#e=[],this.stopConnectLoop(),this.#c().removeEventListener("tanstack-connect-success",this.#n)};#o=()=>{if(this.#i<this.#j){this.#i++,this.dispatchCustomEvent("tanstack-connect",{});return}this.#c().removeEventListener("tanstack-connect",this.#o),this.#l=!0,this.debugLog("Max retries reached, giving up on connection"),this.stopConnectLoop()};#p=()=>{this.#k||(this.#k=!0,this.#c().addEventListener("tanstack-connect-success",this.#n),this.#o())};constructor({pluginId:a,debug:b=!1,enabled:c=!0,reconnectEveryMs:d=300}){this.#b=a,this.#a=c,this.#c=this.getGlobalTarget,this.#d=b,this.debugLog(" Initializing event subscription for plugin",this.#b),this.#e=[],this.#f=!1,this.#l=!1,this.#g=null,this.#h=d}startConnectLoop(){null!==this.#g||this.#f||(this.debugLog(`Starting connect loop (every ${this.#h}ms)`),this.#g=setInterval(this.#o,this.#h))}stopConnectLoop(){this.#k=!1,null!==this.#g&&(clearInterval(this.#g),this.#g=null,this.#e=[],this.debugLog("Stopped connect loop"))}debugLog(...a){this.#d&&console.log(`🌴 [tanstack-devtools:${this.#b}-plugin]`,...a)}getGlobalTarget(){if("u">typeof globalThis&&globalThis.__TANSTACK_EVENT_TARGET__)return this.debugLog("Using global event target"),globalThis.__TANSTACK_EVENT_TARGET__;let a="u">typeof EventTarget?new EventTarget:void 0;return void 0===a||void 0===a.addEventListener?(this.debugLog("No event mechanism available, running in non-web environment"),{addEventListener:()=>{},removeEventListener:()=>{},dispatchEvent:()=>!1}):(this.debugLog("Using new EventTarget as fallback"),a)}getPluginId(){return this.#b}dispatchCustomEventShim(a,b){try{let c=new Event(a,{detail:b});this.#c().dispatchEvent(c)}catch(a){this.debugLog("Failed to dispatch shim event")}}dispatchCustomEvent(a,b){try{this.#c().dispatchEvent(new CustomEvent(a,{detail:b}))}catch(c){this.dispatchCustomEventShim(a,b)}}emitEventToBus(a){this.debugLog("Emitting event to client bus",a),this.dispatchCustomEvent("tanstack-dispatch-event",a)}createEventPayload(a,b){return{type:`${this.#b}:${a}`,payload:b,pluginId:this.#b}}emit(a,b){if(!this.#a)return void this.debugLog("Event bus client is disabled, not emitting event",a,b);if(this.#m&&(this.debugLog("Emitting event to internal event target",a,b),this.#m.dispatchEvent(new CustomEvent(`${this.#b}:${a}`,{detail:this.createEventPayload(a,b)}))),this.#l)return void this.debugLog("Previously failed to connect, not emitting to bus");if(!this.#f){this.debugLog("Bus not available, will be pushed as soon as connected"),this.#e.push(this.createEventPayload(a,b)),"u">typeof CustomEvent&&!this.#k&&(this.#p(),this.startConnectLoop());return}return this.emitEventToBus(this.createEventPayload(a,b))}on(a,b,c){let d=c?.withEventTarget??!1,e=`${this.#b}:${a}`;if(d&&(this.#m||(this.#m=new EventTarget),this.#m.addEventListener(e,a=>{b(a.detail)})),!this.#a)return this.debugLog("Event bus client is disabled, not registering event",e),()=>{};let f=a=>{this.debugLog("Received event from bus",a.detail),b(a.detail)};return this.#c().addEventListener(e,f),this.debugLog("Registered event to bus",e),()=>{d&&this.#m?.removeEventListener(e,f),this.#c().removeEventListener(e,f)}}onAll(a){if(!this.#a)return this.debugLog("Event bus client is disabled, not registering event"),()=>{};let b=b=>{a(b.detail)};return this.#c().addEventListener("tanstack-devtools-global",b),()=>this.#c().removeEventListener("tanstack-devtools-global",b)}onAllPluginEvents(a){if(!this.#a)return this.debugLog("Event bus client is disabled, not registering event"),()=>{};let b=b=>{let c=b.detail;this.#b&&c.pluginId!==this.#b||a(c)};return this.#c().addEventListener("tanstack-devtools-global",b),()=>this.#c().removeEventListener("tanstack-devtools-global",b)}}let f=new class extends e{constructor(){super({pluginId:"form-devtools",reconnectEveryMs:1e3})}},g=(0,b.createContext)(void 0),h=a=>{let e=function(){let[a,e]=(0,d.createStore)([]);return(0,b.createEffect)(()=>{let d=f.on("form-api",b=>{let d=b.payload.id,f=a.findIndex(a=>a.id===d);f>-1?e(f,{state:b.payload.state,options:b.payload.options,date:(0,c.default)()}):e(a=>[...a,{id:d,state:b.payload.state,options:b.payload.options,date:(0,c.default)(),history:[]}])});(0,b.onCleanup)(d)}),(0,b.createEffect)(()=>{let d=f.on("form-state",b=>{let d=b.payload.id,f=a.findIndex(a=>a.id===d);f>-1?e(f,{state:b.payload.state,date:(0,c.default)()}):e(a=>[...a,{id:d,state:b.payload.state,options:{},date:(0,c.default)(),history:[]}])});(0,b.onCleanup)(d)}),(0,b.createEffect)(()=>{let c=f.on("form-submission",b=>{let c=b.payload.id,d=a.findIndex(a=>a.id===c);if(d>-1&&a[d]){let{id:c,...f}=b.payload,g=[f,...a[d].history].slice(0,5);e(d,"history",g)}});(0,b.onCleanup)(c)}),(0,b.createEffect)(()=>{let a=f.on("form-unmounted",a=>{e(b=>b.filter(b=>b.id!==a.payload.id))});(0,b.onCleanup)(a)}),{store:a}}();return(0,b.createComponent)(g.Provider,{value:e,get children(){return a.children}})};function i(){let a=(0,b.useContext)(g);if(void 0===a)throw Error("useFormEventClient must be used within a FormEventClientContext");return{store:(0,b.createMemo)(()=>a.store)}}var j=a.i(133780),k=a.i(632213),l=a.i(126757),m=a.i(555775),n=a.i(859996),o=a.i(576234);let p={colors:{black:"#000000",white:"#ffffff",darkGray:{400:"#313749",500:"#292e3d",600:"#212530",700:"#191c24",800:"#111318"},gray:{100:"#f2f4f7",200:"#eaecf0",300:"#d0d5dd",400:"#98a2b3",500:"#667085",600:"#475467",800:"#1d2939",900:"#101828"},blue:{100:"#D1E9FF",300:"#84CAFF",400:"#53B1FD",500:"#2E90FA",600:"#1570EF",700:"#175CD3",900:"#194185"},green:{400:"#32D583"},red:{400:"#f87171"},yellow:{400:"#FDB022"},purple:{400:"#9B8AFB"},pink:{400:"#ec4899"}},alpha:{80:"cc",30:"4d",20:"33"},font:{size:{xs:"calc(var(--tsrd-font-size) * 0.75)",sm:"calc(var(--tsrd-font-size) * 0.875)",md:"var(--tsrd-font-size)",lg:"calc(var(--tsrd-font-size) * 1.125)"},weight:{semibold:"600",bold:"700"},fontFamily:{mono:"ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace"}},border:{radius:{sm:"calc(var(--tsrd-font-size) * 0.25)",md:"calc(var(--tsrd-font-size) * 0.375)",lg:"calc(var(--tsrd-font-size) * 0.5)"}},size:{1:"calc(var(--tsrd-font-size) * 0.25)",2:"calc(var(--tsrd-font-size) * 0.5)",3:"calc(var(--tsrd-font-size) * 0.75)",4:"calc(var(--tsrd-font-size) * 1)"},shadow:{xs:(a="rgb(0 0 0 / 0.1)")=>"0 1px 2px 0 rgb(0 0 0 / 0.05)",sm:(a="rgb(0 0 0 / 0.1)")=>`0 1px 3px 0 ${a}, 0 1px 2px -1px ${a}`,md:(a="rgb(0 0 0 / 0.1)")=>`0 4px 6px -1px ${a}, 0 2px 4px -2px ${a}`,lg:(a="rgb(0 0 0 / 0.1)")=>`0 10px 15px -3px ${a}, 0 4px 6px -4px ${a}`,xl:(a="rgb(0 0 0 / 0.1)")=>`0 20px 25px -5px ${a}, 0 8px 10px -6px ${a}`,"2xl":(a="rgb(0 0 0 / 0.25)")=>`0 25px 50px -12px ${a}`,inner:(a="rgb(0 0 0 / 0.05)")=>`inset 0 2px 4px 0 ${a}`,none:()=>"none"}},q=a=>{let{colors:b,font:c,size:d,alpha:e,border:f}=p,{fontFamily:g,size:h}=c,i=n.css,j=(b,c)=>"light"===a?b:c;return{mainContainer:i`
      display: flex;
      flex: 1;
      min-height: 80%;
      overflow: hidden;
      padding: ${d[2]};
    `,dragHandle:i`
      width: 8px;
      background: ${j(b.gray[300],b.darkGray[600])};
      cursor: col-resize;
      position: relative;
      transition: all 0.2s ease;
      user-select: none;
      pointer-events: all;
      margin: 0 ${d[1]};
      border-radius: 2px;

      &:hover {
        background: ${j(b.blue[600],b.blue[500])};
        margin: 0 ${d[1]};
      }

      &.dragging {
        background: ${j(b.blue[700],b.blue[600])};
        margin: 0 ${d[1]};
      }

      &::after {
        content: '';
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 2px;
        height: 20px;
        background: ${j(b.gray[400],b.darkGray[400])};
        border-radius: 1px;
        pointer-events: none;
      }

      &:hover::after,
      &.dragging::after {
        background: ${j(b.blue[500],b.blue[300])};
      }
    `,leftPanel:i`
      background: ${j(b.gray[100],b.darkGray[800])};
      border-radius: ${f.radius.lg};
      border: 1px solid ${j(b.gray[200],b.darkGray[700])};
      display: flex;
      flex-direction: column;
      overflow: hidden;
      min-height: 0;
      flex-shrink: 0;
    `,rightPanel:i`
      background: ${j(b.gray[100],b.darkGray[800])};
      border-radius: ${f.radius.lg};
      border: 1px solid ${j(b.gray[200],b.darkGray[700])};
      display: flex;
      flex-direction: column;
      overflow: hidden;
      min-height: 0;
      flex: 1;
    `,panelHeader:i`
      font-size: ${h.md};
      font-weight: ${c.weight.bold};
      color: ${j(b.blue[700],b.blue[400])};
      padding: ${d[2]};
      border-bottom: 1px solid ${j(b.gray[200],b.darkGray[700])};
      background: ${j(b.gray[100],b.darkGray[800])};
      flex-shrink: 0;
    `,utilList:i`
      flex: 1;
      overflow-y: auto;
      padding: ${d[1]};
      min-height: 0;
    `,utilGroup:i`
      margin-bottom: ${d[2]};
    `,utilGroupHeader:i`
      font-size: ${h.xs};
      font-weight: ${c.weight.semibold};
      color: ${j(b.gray[600],b.gray[400])};
      text-transform: uppercase;
      letter-spacing: 0.05em;
      margin-bottom: ${d[1]};
      padding: ${d[1]} ${d[2]};
      background: ${j(b.gray[200],b.darkGray[700])};
      border-radius: ${f.radius.md};
    `,utilRow:i`
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: ${d[2]};
      margin-bottom: ${d[1]};
      background: ${j(b.gray[200],b.darkGray[700])};
      border-radius: ${f.radius.md};
      cursor: pointer;
      transition: all 0.2s ease;
      border: 1px solid transparent;

      &:hover {
        background: ${j(b.gray[300],b.darkGray[600])};
        border-color: ${j(b.gray[400],b.darkGray[500])};
      }
    `,utilRowSelected:i`
      background: ${j(b.blue[100],b.blue[900]+e[20])};
      border-color: ${j(b.blue[600],b.blue[500])};
      box-shadow: 0 0 0 1px
        ${j(b.blue[600]+e[30],b.blue[500]+e[30])};
    `,utilKey:i`
      font-family: ${g.mono};
      font-size: ${h.xs};
      color: ${j(b.gray[900],b.gray[100])};
      flex: 1;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    `,utilStatus:i`
      font-size: ${h.xs};
      color: ${j(b.gray[600],b.gray[400])};
      text-transform: uppercase;
      letter-spacing: 0.05em;
      padding: ${d[1]} ${d[1]};
      background: ${j(b.gray[300],b.darkGray[600])};
      border-radius: ${f.radius.sm};
      margin-left: ${d[1]};
    `,stateDetails:i`
      flex: 1;
      overflow-y: auto;
      padding: ${d[2]};
      min-height: 0;
    `,stateHeader:i`
      margin-bottom: ${d[2]};
      padding-bottom: ${d[2]};
      border-bottom: 1px solid ${j(b.gray[200],b.darkGray[700])};
    `,stateTitle:i`
      font-size: ${h.md};
      font-weight: ${c.weight.bold};
      color: ${j(b.blue[700],b.blue[400])};
      margin-bottom: ${d[1]};
    `,stateKey:i`
      font-family: ${g.mono};
      font-size: ${h.xs};
      color: ${j(b.gray[600],b.gray[400])};
      word-break: break-all;
    `,stateContent:i`
      background: ${j(b.gray[100],b.darkGray[700])};
      border-radius: ${f.radius.md};
      padding: ${d[2]};
      border: 1px solid ${j(b.gray[300],b.darkGray[600])};
    `,detailsGrid:i`
      display: grid;
      grid-template-columns: 1fr;
      gap: ${d[2]};
      align-items: start;
    `,detailSection:i`
      background: ${j(b.white,b.darkGray[700])};
      border: 1px solid ${j(b.gray[300],b.darkGray[600])};
      border-radius: ${f.radius.md};
      padding: ${d[2]};
    `,detailSectionHeader:i`
      font-size: ${h.sm};
      font-weight: ${c.weight.bold};
      color: ${j(b.gray[800],b.gray[200])};
      margin-bottom: ${d[1]};
      text-transform: uppercase;
      letter-spacing: 0.04em;
    `,actionsRow:i`
      display: flex;
      flex-wrap: wrap;
      gap: ${d[2]};
    `,actionButton:i`
      display: inline-flex;
      align-items: center;
      gap: ${d[1]};
      padding: ${d[1]} ${d[2]};
      border-radius: ${f.radius.md};
      border: 1px solid ${j(b.gray[300],b.darkGray[500])};
      background: ${j(b.gray[200],b.darkGray[600])};
      color: ${j(b.gray[900],b.gray[100])};
      font-size: ${h.xs};
      cursor: pointer;
      user-select: none;
      transition:
        background 0.15s,
        border-color 0.15s;
      &:hover {
        background: ${j(b.gray[300],b.darkGray[500])};
        border-color: ${j(b.gray[400],b.darkGray[400])};
      }
      &:disabled {
        opacity: 0.5;
        cursor: not-allowed;
        &:hover {
          background: ${j(b.gray[200],b.darkGray[600])};
          border-color: ${j(b.gray[300],b.darkGray[500])};
        }
      }
    `,actionDotBlue:i`
      width: 6px;
      height: 6px;
      border-radius: 9999px;
      background: ${b.blue[400]};
    `,actionDotGreen:i`
      width: 6px;
      height: 6px;
      border-radius: 9999px;
      background: ${b.green[400]};
    `,actionDotRed:i`
      width: 6px;
      height: 6px;
      border-radius: 9999px;
      background: ${b.red[400]};
    `,actionDotYellow:i`
      width: 6px;
      height: 6px;
      border-radius: 9999px;
      background: ${b.yellow[400]};
    `,actionDotOrange:i`
      width: 6px;
      height: 6px;
      border-radius: 9999px;
      background: ${b.pink[400]};
    `,actionDotPurple:i`
      width: 6px;
      height: 6px;
      border-radius: 9999px;
      background: ${b.purple[400]};
    `,infoGrid:i`
      display: grid;
      grid-template-columns: auto 1fr;
      gap: ${d[1]};
      row-gap: ${d[1]};
      align-items: center;
    `,infoLabel:i`
      color: ${j(b.gray[600],b.gray[400])};
      font-size: ${h.xs};
      text-transform: uppercase;
      letter-spacing: 0.05em;
    `,infoValueMono:i`
      font-family: ${g.mono};
      font-size: ${h.xs};
      color: ${j(b.gray[900],b.gray[100])};
      word-break: break-all;
    `,noSelection:i`
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      color: ${j(b.gray[500],b.gray[500])};
      font-style: italic;
      text-align: center;
      padding: ${d[4]};
    `,sectionContainer:i`
      display: flex;
      flex-wrap: wrap;
      gap: ${d[4]};
    `,section:i`
      background: ${j(b.gray[100],b.darkGray[800])};
      border-radius: ${f.radius.lg};
      box-shadow: ${p.shadow.md(j(b.gray[400]+e[80],b.black+e[80]))};
      padding: ${d[4]};
      margin-bottom: ${d[4]};
      border: 1px solid ${j(b.gray[200],b.darkGray[700])};
      min-width: 0;
      max-width: 33%;
      max-height: fit-content;
    `,sectionHeader:i`
      font-size: ${h.lg};
      font-weight: ${c.weight.bold};
      margin-bottom: ${d[2]};
      color: ${j(b.blue[600],b.blue[400])};
      letter-spacing: 0.01em;
      display: flex;
      align-items: center;
      gap: ${d[2]};
    `,sectionEmpty:i`
      color: ${j(b.gray[500],b.gray[500])};
      font-size: ${h.sm};
      font-style: italic;
      margin: ${d[2]} 0;
    `,instanceList:i`
      display: flex;
      flex-direction: column;
      gap: ${d[2]};
      background: ${j(b.gray[200],b.darkGray[700])};
      border: 1px solid ${j(b.gray[300],b.darkGray[600])};
    `,instanceCard:i`
      background: ${j(b.gray[200],b.darkGray[700])};
      border-radius: ${f.radius.md};
      padding: ${d[3]};
      border: 1px solid ${j(b.gray[300],b.darkGray[600])};
      font-size: ${h.sm};
      color: ${j(b.gray[900],b.gray[100])};
      font-family: ${g.mono};
      overflow-x: auto;
      transition:
        box-shadow 0.3s,
        background 0.3s;
    `}};function r(){let{theme:a}=(0,o.useTheme)(),[c,d]=(0,b.createSignal)(q(a()));return(0,b.createEffect)(()=>{d(q(a()))}),c}var s=a.i(239337),t=(0,j.template)("<div>"),u=(0,j.template)("<div><div>");function v(a){var c,d;let e=r(),{store:f}=i();return c=t(),(0,j.insert)(c,(d=(0,j.memo)(()=>f().length>0),()=>{var c;return d()&&(c=t(),(0,j.insert)(c,(0,b.createComponent)(b.For,{get each(){return f()},children:b=>{var c,d;return d=(c=u()).firstChild,c.$$click=()=>a.setSelectedKey(b.id),(0,j.insert)(d,()=>b.id),(0,k.effect)(f=>{var g=(0,s.default)(e().utilRow,a.selectedKey()===b.id&&e().utilRowSelected),h=e().utilKey;return g!==f.e&&(0,j.className)(c,f.e=g),h!==f.t&&(0,j.className)(d,f.t=h),f},{e:void 0,t:void 0}),c}})),(0,k.effect)(()=>(0,j.className)(c,e().utilGroup)),c)})),(0,k.effect)(()=>(0,j.className)(c,e().utilList)),c}(0,j.delegateEvents)(["click"]);var w=a.i(289980),x=(0,j.template)("<div><button><span></span>Flush</button><button><span></span>Reset</button><button><span></span>Submit (-f)");function y(a){var b,c,d,e,g,h,i;let l=r();return d=(c=(b=x()).firstChild).firstChild,g=(e=c.nextSibling).firstChild,i=(h=e.nextSibling).firstChild,c.$$mousedown=()=>{f.emit("request-form-state",{id:a.selectedInstance()?.id})},e.$$mousedown=()=>{f.emit("request-form-reset",{id:a.selectedInstance()?.id})},h.$$mousedown=()=>{f.emit("request-form-force-submit",{id:a.selectedInstance()?.id})},(0,k.effect)(a=>{var f=l().actionsRow,k=l().actionButton,m=l().actionDotGreen,n=l().actionButton,o=l().actionDotRed,p=l().actionButton,q=l().actionDotYellow;return f!==a.e&&(0,j.className)(b,a.e=f),k!==a.t&&(0,j.className)(c,a.t=k),m!==a.a&&(0,j.className)(d,a.a=m),n!==a.o&&(0,j.className)(e,a.o=n),o!==a.i&&(0,j.className)(g,a.i=o),p!==a.n&&(0,j.className)(h,a.n=p),q!==a.s&&(0,j.className)(i,a.s=q),a},{e:void 0,t:void 0,a:void 0,o:void 0,i:void 0,n:void 0,s:void 0}),b}(0,j.delegateEvents)(["mousedown"]);var z=a.i(779121),A=(0,j.template)("<div><div>Form state</div><div><div><div>Key</div><div></div><div>Last Updated</div><div> (<!>)");function B(a){var d,e,f,g,h,i,l,m,n,o;let p=r(),[q,s]=(0,b.createSignal)((0,c.default)().unix());(0,b.onMount)(()=>{let a=setInterval(()=>s((0,c.default)().unix()),1e3);(0,b.onCleanup)(()=>clearInterval(a))});let t=a.selectedInstance,u=(0,b.createMemo)(()=>t()?.date.unix()??(0,c.default)().unix()),v=(0,b.createMemo)(()=>{let a=Math.max(q()-u(),0);return a<60?`${a} second${1!==a?"s":""} ago`:c.default.unix(u()).fromNow()});return t()?((o=(n=(m=(l=(i=(h=(g=(f=(e=(d=A()).firstChild).nextSibling).firstChild).firstChild).nextSibling).nextSibling).nextSibling).firstChild).nextSibling).nextSibling,f.style.setProperty("display","flex"),f.style.setProperty("align-items","center"),f.style.setProperty("gap","16px"),(0,j.insert)(i,()=>t().id),(0,j.insert)(m,()=>new Date(1e3*u()).toLocaleTimeString(),n),(0,j.insert)(m,v,o),(0,k.effect)(a=>{var b=p().stateHeader,c=p().stateTitle,f=p().infoGrid,k=p().infoLabel,n=p().infoValueMono,o=p().infoLabel,q=p().infoValueMono;return b!==a.e&&(0,j.className)(d,a.e=b),c!==a.t&&(0,j.className)(e,a.t=c),f!==a.a&&(0,j.className)(g,a.a=f),k!==a.o&&(0,j.className)(h,a.o=k),n!==a.i&&(0,j.className)(i,a.i=n),o!==a.n&&(0,j.className)(l,a.n=o),q!==a.s&&(0,j.className)(m,a.s=q),a},{e:void 0,t:void 0,a:void 0,o:void 0,i:void 0,n:void 0,s:void 0}),d):null}c.default.extend(z.default);var C=(0,j.template)("<div><div><div>Actions</div></div><div><div>Individual Fields</div><div></div></div><div><div>Form values</div><div></div></div><div><div>Form status</div><div></div></div><div><div>Form options</div><div></div></div><div><div>Submission history</div><div>"),D=(0,j.template)("<div>"),E=(0,j.template)("<div><div>");function F({selectedKey:a}){var c;let d=r(),{store:e}=i(),f=(0,b.createMemo)(()=>e().findIndex(b=>b.id===a())),g=(0,b.createMemo)(()=>f()>-1?e()[f()]:null),h=(0,b.createMemo)(()=>g()?.state),l=(0,b.createMemo)(()=>({canSubmit:h()?.canSubmit,isFormValid:h()?.isFormValid,isFormValidating:h()?.isFormValidating,isSubmitted:h()?.isSubmitted,isSubmitting:h()?.isSubmitting,isSubmitSuccessful:h()?.isSubmitSuccessful,submissionAttempts:h()?.submissionAttempts,errors:h()?.errors,errorMap:h()?.errorMap})),m=(0,b.createMemo)(()=>{let a={},b=h()?.values||{},c=h()?.fieldMeta||{};return Object.keys(b).forEach(d=>{a[d]={value:b[d],meta:c[d]}}),a});return c=D(),(0,j.insert)(c,(0,b.createComponent)(b.Show,{get when(){return g()},get children(){var n,o,p,q,s,t,u,v,x,z,A,F,G,H,I,J,K,L;return[(0,b.createComponent)(B,{selectedInstance:g}),(p=(o=(n=C()).firstChild).firstChild,t=(s=(q=o.nextSibling).firstChild).nextSibling,x=(v=(u=q.nextSibling).firstChild).nextSibling,F=(A=(z=u.nextSibling).firstChild).nextSibling,I=(H=(G=z.nextSibling).firstChild).nextSibling,L=(K=(J=G.nextSibling).firstChild).nextSibling,(0,j.insert)(o,(0,b.createComponent)(y,{selectedInstance:g}),null),t.style.setProperty("display","flex"),t.style.setProperty("gap","8px"),(0,j.insert)(t,(0,b.createComponent)(b.For,{get each(){return Object.entries(m())},children:([a,c])=>{var e,f;return f=(e=E()).firstChild,e.style.setProperty("margin-bottom","16px"),f.style.setProperty("font-weight","bold"),f.style.setProperty("margin-bottom","4px"),(0,j.insert)(f,a),(0,j.insert)(e,(0,b.createComponent)(w.JsonTree,{copyable:!0,value:c}),null),(0,k.effect)(()=>(0,j.className)(e,d().stateContent)),e}})),(0,j.insert)(x,(0,b.createComponent)(w.JsonTree,{copyable:!0,get value(){return e()[f()].state.values}})),(0,j.insert)(F,(0,b.createComponent)(w.JsonTree,{copyable:!0,get value(){return l()}})),(0,j.insert)(I,(0,b.createComponent)(w.JsonTree,{copyable:!0,get value(){return e()[f()]?.options},collapsePaths:["validators"]})),(0,j.insert)(L,(0,b.createComponent)(w.JsonTree,{copyable:!0,get value(){return e()[f()]?.history}})),(0,k.effect)(a=>{var b=d().detailsGrid,c=d().detailSection,e=d().detailSectionHeader,f=d().detailSection,g=d().detailSectionHeader,h=d().detailSection,i=d().detailSectionHeader,k=d().stateContent,l=d().detailSection,m=d().detailSectionHeader,r=d().stateContent,t=d().detailSection,w=d().detailSectionHeader,y=d().stateContent,B=d().detailSection,C=d().detailSectionHeader,D=d().stateContent;return b!==a.e&&(0,j.className)(n,a.e=b),c!==a.t&&(0,j.className)(o,a.t=c),e!==a.a&&(0,j.className)(p,a.a=e),f!==a.o&&(0,j.className)(q,a.o=f),g!==a.i&&(0,j.className)(s,a.i=g),h!==a.n&&(0,j.className)(u,a.n=h),i!==a.s&&(0,j.className)(v,a.s=i),k!==a.h&&(0,j.className)(x,a.h=k),l!==a.r&&(0,j.className)(z,a.r=l),m!==a.d&&(0,j.className)(A,a.d=m),r!==a.l&&(0,j.className)(F,a.l=r),t!==a.u&&(0,j.className)(G,a.u=t),w!==a.c&&(0,j.className)(H,a.c=w),y!==a.w&&(0,j.className)(I,a.w=y),B!==a.m&&(0,j.className)(J,a.m=B),C!==a.f&&(0,j.className)(K,a.f=C),D!==a.y&&(0,j.className)(L,a.y=D),a},{e:void 0,t:void 0,a:void 0,o:void 0,i:void 0,n:void 0,s:void 0,h:void 0,r:void 0,d:void 0,l:void 0,u:void 0,c:void 0,w:void 0,m:void 0,f:void 0,y:void 0}),n)]}})),(0,k.effect)(()=>(0,j.className)(c,d().stateDetails)),c}var G=(0,j.template)("<div>Details"),H=(0,j.template)("<div><div></div><div></div><div>");function I(){let a=r(),[c,d]=(0,b.createSignal)(300),[e,f]=(0,b.createSignal)(!1),[g,h]=(0,b.createSignal)(null),i=0,n=0,o=a=>{a.preventDefault(),a.stopPropagation(),f(!0),document.body.style.cursor="col-resize",document.body.style.userSelect="none",i=a.clientX,n=c()},p=a=>{if(!e())return;a.preventDefault();let b=a.clientX-i;d(Math.max(150,Math.min(800,n+b)))},q=()=>{f(!1),document.body.style.cursor="",document.body.style.userSelect=""};return(0,b.onMount)(()=>{document.addEventListener("mousemove",p),document.addEventListener("mouseup",q)}),(0,b.onCleanup)(()=>{document.removeEventListener("mousemove",p),document.removeEventListener("mouseup",q)}),(0,b.createComponent)(l.MainPanel,{get children(){var s,t,u,w;return[(0,b.createComponent)(m.Header,{get children(){return(0,b.createComponent)(m.HeaderLogo,{flavor:{light:"#eeaf00",dark:"#eeaf00"},onClick:()=>{window.open("https://tanstack.com/form/latest/docs/overview","_blank")},children:"TanStack Form"})}}),(w=(u=(t=(s=H()).firstChild).nextSibling).nextSibling,t.style.setProperty("min-width","150px"),t.style.setProperty("max-width","800px"),(0,j.insert)(t,(0,b.createComponent)(v,{selectedKey:g,setSelectedKey:h})),u.$$mousedown=o,w.style.setProperty("flex","1"),(0,j.insert)(w,(0,b.createComponent)(b.Show,{get when(){return null!=g()},get children(){var x;return[(x=G(),(0,k.effect)(()=>(0,j.className)(x,a().panelHeader)),x),(0,b.createComponent)(F,{selectedKey:g})]}})),(0,k.effect)(b=>{var d=a().mainContainer,f=a().leftPanel,g=`${c()}px`,h=`${a().dragHandle} ${e()?"dragging":""}`,i=a().rightPanel;return d!==b.e&&(0,j.className)(s,b.e=d),f!==b.t&&(0,j.className)(t,b.t=f),g!==b.a&&(null!=(b.a=g)?t.style.setProperty("width",g):t.style.removeProperty("width")),h!==b.o&&(0,j.className)(u,b.o=h),i!==b.i&&(0,j.className)(w,b.i=i),b},{e:void 0,t:void 0,a:void 0,o:void 0,i:void 0}),s)]}})}function J(){return(0,b.createComponent)(h,{get children(){return(0,b.createComponent)(I,{})}})}(0,j.delegateEvents)(["mousedown"]),a.s(["default",()=>J],136630)}];

//# sourceMappingURL=dffac_%40tanstack_form-devtools_dist_esm_components_index_00eed453.js.map