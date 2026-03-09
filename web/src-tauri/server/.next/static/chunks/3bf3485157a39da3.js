(globalThis.TURBOPACK||(globalThis.TURBOPACK=[])).push(["object"==typeof document?document.currentScript:void 0,432299,e=>{"use strict";var t=e.i(820831),r=e.i(766932),a=e.i(574788),n=e.i(278322);let o=!r.isServer&&!!a.DEV;a.equalFn;let i=(e,t)=>e===t||e.length===t.length&&e.every((e,r)=>e===t[r]),l=e=>"function"!=typeof e||e.length?e:e(),s=e=>Array.isArray(e)?e:e?[e]:[];function c(e){for(var t=arguments.length,r=Array(t>1?t-1:0),a=1;a<t;a++)r[a-1]=arguments[a];return"function"==typeof e?e(...r):e}let d=o?e=>(0,a.getOwner)()?(0,a.onCleanup)(e):e:a.onCleanup;function g(e,t,r,a){return e.addEventListener(t,r,a),d(e.removeEventListener.bind(e,t,r,a))}function p(e,t,n,o){if(r.isServer)return;let i=()=>{s(l(e)).forEach(e=>{e&&s(l(t)).forEach(t=>g(e,t,n,o))})};"function"==typeof e?(0,a.createEffect)(i):(0,a.createRenderEffect)(i)}function u(e){let t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:(0,a.getOwner)(),r=0,n,o;return()=>(r++,(0,a.onCleanup)(()=>{r--,queueMicrotask(()=>{!r&&o&&(o(),o=n=void 0)})}),o||(0,a.createRoot)(t=>n=e(o=t),t),n)}function m(e,t){for(let r=e.length-1;r>=0;r--){let a=t.slice(0,r+1);if(!i(e[r],a))return!1}return!0}let f=u(()=>{if(r.isServer)return()=>null;let[e,t]=(0,a.createSignal)(null);return g(window,"keydown",e=>{t(e),setTimeout(()=>t(null))}),e}),h=u(()=>{if(r.isServer){let e=()=>[];return e[0]=e,e[1]={event:()=>null},e[Symbol.iterator]=function*(){yield e[0],yield e[1]},e}let[e,t]=(0,a.createSignal)([]),n=()=>t([]),o=f();return g(window,"keydown",r=>{if(r.repeat||"string"!=typeof r.key)return;let a=r.key.toUpperCase(),n=e();if(n.includes(a))return;let o=[...n,a];0===n.length&&"ALT"!==a&&"CONTROL"!==a&&"META"!==a&&"SHIFT"!==a&&(r.shiftKey&&o.unshift("SHIFT"),r.altKey&&o.unshift("ALT"),r.ctrlKey&&o.unshift("CONTROL"),r.metaKey&&o.unshift("META")),t(o)}),g(window,"keyup",e=>{if("string"!=typeof e.key)return;let r=e.key.toUpperCase();t(e=>e.filter(e=>e!==r))}),g(window,"blur",n),g(window,"contextmenu",e=>{e.defaultPrevented||n()}),e[0]=e,e[1]={event:o},e[Symbol.iterator]=function*(){yield e[0],yield e[1]},e}),v=u(()=>{if(r.isServer)return()=>[];let e=h();return(0,a.createMemo)(t=>0===e().length?[]:[...t,e()],[])});var y=e.i(537261),b=e.i(492859),k=e.i(632608),C=e.i(500983),w=e.i(548755),x=e.i(634776),S=e.i(661981),M=e.i(596190),A=e.i(201704);class E extends A.EventClient{constructor(){super({pluginId:"tanstack-devtools-core"})}}let N=new E;var B=e.i(7284),P=e.i(739604),z=e.i(542372);let T={width:null,height:null};function F(e){if(r.isServer||!e)return{...T};let{width:t,height:a}=e.getBoundingClientRect();return{width:t,height:a}}let I={get url(){return`file://${e.P("node_modules/.pnpm/@tanstack+devtools@0.10.3_csstype@3.2.3_solid-js@1.9.11/node_modules/@tanstack/devtools/dist/devtools/RZMDLR3T.js")}`}};var D=(0,a.createContext)(void 0),H=e=>{let t=(e=>{let[t,r]=(0,a.createSignal)(!1),[n,o]=(0,a.createSignal)(!1),i=(0,a.createMemo)(()=>t()||n()),l=null;return(0,a.onCleanup)(()=>{l&&clearTimeout(l)}),{expanded:i,setForceExpand:o,hoverUtils:{enter:()=>{l&&(clearTimeout(l),l=null),r(!0)},leave:()=>{l=setTimeout(()=>{r(!1)},e.animationMs)}},animationMs:e.animationMs}})({animationMs:e.animationMs});return(0,a.createComponent)(D.Provider,{value:t,get children(){return e.children}})};function U(){let e=(0,a.useContext)(D);if(void 0===e)throw Error("useDrawContext must be used within a DrawClientProvider");return e}var Q=()=>{let e=(0,a.useContext)(t.DevtoolsContext);if(void 0===e)throw Error("useDevtoolsShellContext must be used within a ShellContextProvider");return e};function L(){let{settings:e,setSettings:t}=Y();return{theme:(0,a.createMemo)(()=>e().theme),setTheme:e=>t({theme:e})}}var q=()=>{let{store:e,setStore:r}=Q(),{setForceExpand:n}=U(),o=(0,a.createMemo)(()=>e.plugins),i=(0,a.createMemo)(()=>e.state.activePlugins);return(0,a.createEffect)(()=>{0===i().length?n(!0):n(!1)}),{plugins:o,toggleActivePlugins:a=>{r(r=>{let n=r.state.activePlugins.includes(a),o=e.plugins?.find(e=>e.id===a);o?.destroy&&n&&o.destroy(a);let i=n?r.state.activePlugins.filter(e=>e!==a):[...r.state.activePlugins,a];return i.length>t.MAX_ACTIVE_PLUGINS?r:{...r,state:{...r.state,activePlugins:i}}})},activePlugins:i}},O=()=>{let{store:e,setStore:t}=Q();return{state:(0,a.createMemo)(()=>e.state),setState:e=>{t(t=>({...t,state:{...t.state,...e}}))}}},Y=()=>{let{store:e,setStore:t}=Q();return{setSettings:e=>{t(t=>({...t,settings:{...t.settings,...e}}))},settings:(0,a.createMemo)(()=>e.settings)}},R=()=>{let{state:e,setState:t}=O();return{height:(0,a.createMemo)(()=>e().height),setHeight:e=>{t({height:e})}}},j=function(e){let t=!(arguments.length>1)||void 0===arguments[1]||arguments[1];for(let r of(t?e.setAttribute("tabIndex","-1"):e.removeAttribute("tabIndex"),e.children))j(r,t)},V=e=>(!e.includes("CtrlOrMeta")?[e]:[e.map(e=>"CtrlOrMeta"===e?"Control":e),e.map(e=>"CtrlOrMeta"===e?"Meta":e)]).flatMap(e=>{let r=e.filter(e=>t.keyboardModifiers.includes(e)),a=e.filter(e=>!t.keyboardModifiers.includes(e));return 0===r.length?[a]:(0,t.getAllPermutations)(r).map(e=>[...e,...a])}),G={colors:{inherit:"inherit",current:"currentColor",transparent:"transparent",black:"#000000",white:"#ffffff",neutral:{50:"#f9fafb",100:"#f2f4f7",200:"#eaecf0",300:"#d0d5dd",400:"#98a2b3",500:"#667085",600:"#475467",700:"#344054",800:"#1d2939",900:"#101828"},darkGray:{50:"#525c7a",100:"#49536e",200:"#414962",300:"#394056",400:"#313749",500:"#292e3d",600:"#212530",700:"#191c24",800:"#111318",900:"#0b0d10"},gray:{50:"#f9fafb",100:"#f2f4f7",200:"#eaecf0",300:"#d0d5dd",400:"#98a2b3",500:"#667085",600:"#475467",700:"#344054",800:"#1d2939",900:"#101828"},blue:{25:"#F5FAFF",50:"#EFF8FF",100:"#D1E9FF",200:"#B2DDFF",300:"#84CAFF",400:"#53B1FD",500:"#2E90FA",600:"#1570EF",700:"#175CD3",800:"#1849A9",900:"#194185"},green:{25:"#F6FEF9",50:"#ECFDF3",100:"#D1FADF",200:"#A6F4C5",300:"#6CE9A6",400:"#32D583",500:"#12B76A",600:"#039855",700:"#027A48",800:"#05603A",900:"#054F31"},red:{50:"#fef2f2",100:"#fee2e2",200:"#fecaca",300:"#fca5a5",400:"#f87171",500:"#ef4444",600:"#dc2626",700:"#b91c1c",800:"#991b1b",900:"#7f1d1d",950:"#450a0a"},yellow:{25:"#FFFCF5",50:"#FFFAEB",100:"#FEF0C7",200:"#FEDF89",300:"#FEC84B",400:"#FDB022",500:"#F79009",600:"#DC6803",700:"#B54708",800:"#93370D",900:"#7A2E0E"},purple:{25:"#FAFAFF",50:"#F4F3FF",100:"#EBE9FE",200:"#D9D6FE",300:"#BDB4FE",400:"#9B8AFB",500:"#7A5AF8",600:"#6938EF",700:"#5925DC",800:"#4A1FB8",900:"#3E1C96"},teal:{25:"#F6FEFC",50:"#F0FDF9",100:"#CCFBEF",200:"#99F6E0",300:"#5FE9D0",400:"#2ED3B7",500:"#15B79E",600:"#0E9384",700:"#107569",800:"#125D56",900:"#134E48"},pink:{25:"#fdf2f8",50:"#fce7f3",100:"#fbcfe8",200:"#f9a8d4",300:"#f472b6",400:"#ec4899",500:"#db2777",600:"#be185d",700:"#9d174d",800:"#831843",900:"#500724"},cyan:{25:"#ecfeff",50:"#cffafe",100:"#a5f3fc",200:"#67e8f9",300:"#22d3ee",400:"#06b6d4",500:"#0891b2",600:"#0e7490",700:"#155e75",800:"#164e63",900:"#083344"}},alpha:{100:"ff",90:"e5",80:"cc",70:"b3",60:"99",50:"80",40:"66",30:"4d",20:"33",10:"1a",0:"00"},font:{size:{"2xs":"calc(var(--tsrd-font-size) * 0.625)",xs:"calc(var(--tsrd-font-size) * 0.75)",sm:"calc(var(--tsrd-font-size) * 0.875)",md:"var(--tsrd-font-size)",lg:"calc(var(--tsrd-font-size) * 1.125)",xl:"calc(var(--tsrd-font-size) * 1.25)","2xl":"calc(var(--tsrd-font-size) * 1.5)","3xl":"calc(var(--tsrd-font-size) * 1.875)","4xl":"calc(var(--tsrd-font-size) * 2.25)","5xl":"calc(var(--tsrd-font-size) * 3)","6xl":"calc(var(--tsrd-font-size) * 3.75)","7xl":"calc(var(--tsrd-font-size) * 4.5)","8xl":"calc(var(--tsrd-font-size) * 6)","9xl":"calc(var(--tsrd-font-size) * 8)"},lineHeight:{"3xs":"calc(var(--tsrd-font-size) * 0.75)","2xs":"calc(var(--tsrd-font-size) * 0.875)",xs:"calc(var(--tsrd-font-size) * 1)",sm:"calc(var(--tsrd-font-size) * 1.25)",md:"calc(var(--tsrd-font-size) * 1.5)",lg:"calc(var(--tsrd-font-size) * 1.75)",xl:"calc(var(--tsrd-font-size) * 2)","2xl":"calc(var(--tsrd-font-size) * 2.25)","3xl":"calc(var(--tsrd-font-size) * 2.5)","4xl":"calc(var(--tsrd-font-size) * 2.75)","5xl":"calc(var(--tsrd-font-size) * 3)","6xl":"calc(var(--tsrd-font-size) * 3.25)","7xl":"calc(var(--tsrd-font-size) * 3.5)","8xl":"calc(var(--tsrd-font-size) * 3.75)","9xl":"calc(var(--tsrd-font-size) * 4)"},weight:{thin:"100",extralight:"200",light:"300",normal:"400",medium:"500",semibold:"600",bold:"700",extrabold:"800",black:"900"},fontFamily:{sans:"ui-sans-serif, Inter, system-ui, sans-serif, sans-serif",mono:"ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace"}},breakpoints:{xs:"320px",sm:"640px",md:"768px",lg:"1024px",xl:"1280px","2xl":"1536px"},border:{radius:{none:"0px",xs:"calc(var(--tsrd-font-size) * 0.125)",sm:"calc(var(--tsrd-font-size) * 0.25)",md:"calc(var(--tsrd-font-size) * 0.375)",lg:"calc(var(--tsrd-font-size) * 0.5)",xl:"calc(var(--tsrd-font-size) * 0.75)","2xl":"calc(var(--tsrd-font-size) * 1)","3xl":"calc(var(--tsrd-font-size) * 1.5)",full:"9999px"}},size:{0:"0px",.25:"calc(var(--tsrd-font-size) * 0.0625)",.5:"calc(var(--tsrd-font-size) * 0.125)",1:"calc(var(--tsrd-font-size) * 0.25)",1.5:"calc(var(--tsrd-font-size) * 0.375)",2:"calc(var(--tsrd-font-size) * 0.5)",2.5:"calc(var(--tsrd-font-size) * 0.625)",3:"calc(var(--tsrd-font-size) * 0.75)",3.5:"calc(var(--tsrd-font-size) * 0.875)",4:"calc(var(--tsrd-font-size) * 1)",4.5:"calc(var(--tsrd-font-size) * 1.125)",5:"calc(var(--tsrd-font-size) * 1.25)",5.5:"calc(var(--tsrd-font-size) * 1.375)",6:"calc(var(--tsrd-font-size) * 1.5)",6.5:"calc(var(--tsrd-font-size) * 1.625)",7:"calc(var(--tsrd-font-size) * 1.75)",8:"calc(var(--tsrd-font-size) * 2)",9:"calc(var(--tsrd-font-size) * 2.25)",10:"calc(var(--tsrd-font-size) * 2.5)",11:"calc(var(--tsrd-font-size) * 2.75)",12:"calc(var(--tsrd-font-size) * 3)",14:"calc(var(--tsrd-font-size) * 3.5)",16:"calc(var(--tsrd-font-size) * 4)",20:"calc(var(--tsrd-font-size) * 5)",24:"calc(var(--tsrd-font-size) * 6)",28:"calc(var(--tsrd-font-size) * 7)",32:"calc(var(--tsrd-font-size) * 8)",36:"calc(var(--tsrd-font-size) * 9)",40:"calc(var(--tsrd-font-size) * 10)",44:"calc(var(--tsrd-font-size) * 11)",48:"calc(var(--tsrd-font-size) * 12)",52:"calc(var(--tsrd-font-size) * 13)",56:"calc(var(--tsrd-font-size) * 14)",60:"calc(var(--tsrd-font-size) * 15)",64:"calc(var(--tsrd-font-size) * 16)",72:"calc(var(--tsrd-font-size) * 18)",80:"calc(var(--tsrd-font-size) * 20)",96:"calc(var(--tsrd-font-size) * 24)"},shadow:{xs:function(){return arguments.length>0&&void 0!==arguments[0]&&arguments[0],"0 1px 2px 0 rgb(0 0 0 / 0.05)"},sm:function(){let e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:"rgb(0 0 0 / 0.1)";return`0 1px 3px 0 ${e}, 0 1px 2px -1px ${e}`},md:function(){let e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:"rgb(0 0 0 / 0.1)";return`0 4px 6px -1px ${e}, 0 2px 4px -2px ${e}`},lg:function(){let e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:"rgb(0 0 0 / 0.1)";return`0 10px 15px -3px ${e}, 0 4px 6px -4px ${e}`},xl:function(){let e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:"rgb(0 0 0 / 0.1)";return`0 20px 25px -5px ${e}, 0 8px 10px -6px ${e}`},"2xl":function(){let e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:"rgb(0 0 0 / 0.25)";return`0 25px 50px -12px ${e}`},inner:function(){let e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:"rgb(0 0 0 / 0.05)";return`inset 0 2px 4px 0 ${e}`},none:()=>"none"},zIndices:{hide:-1,auto:"auto",base:0,docked:10,dropdown:1e3,sticky:1100,banner:1200,overlay:1300,modal:1400,popover:1500,skipLink:1600,toast:1700,tooltip:1800}},W=e=>`${(e/1e3).toFixed(2)}s`,K=e=>{let{colors:t,font:r,size:a,border:n}=G,{fontFamily:o,size:i}=r,l=P.css,s=(t,r)=>"light"===e?t:r;return{seoTabContainer:l`
      padding: 0;
      margin: 0 auto;
      background: ${s(t.white,t.darkGray[700])};
      border-radius: 8px;
      box-shadow: none;
      overflow-y: auto;
      height: 100%;
      display: flex;
      flex-direction: column;
      gap: 0;
      width: 100%;
      overflow-y: auto;
    `,seoTabTitle:l`
      font-size: 1.25rem;
      font-weight: 600;
      color: ${s(t.gray[900],t.gray[100])};
      margin: 0;
      padding: 1rem 1.5rem 0.5rem 1.5rem;
      text-align: left;
      border-bottom: 1px solid ${s(t.gray[200],t.gray[800])};
    `,seoTabSection:l`
      padding: 1.5rem;
      background: ${s(t.gray[50],t.darkGray[800])};
      border: 1px solid ${s(t.gray[200],t.gray[800])};
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
      margin-bottom: 2rem;
      border-radius: 0.75rem;
    `,seoPreviewSection:l`
      display: flex;
      flex-direction: row;
      gap: 16px;
      margin-bottom: 0;
      justify-content: flex-start;
      align-items: flex-start;
      overflow-x: auto;
      flex-wrap: wrap;
      padding-bottom: 0.5rem;
    `,seoPreviewCard:l`
      border: 1px solid ${s(t.gray[200],t.gray[800])};
      border-radius: 8px;
      padding: 12px 10px;
      background: ${s(t.white,t.darkGray[900])};
      margin-bottom: 0;
      box-shadow: 0 1px 3px ${s("rgba(0,0,0,0.05)","rgba(0,0,0,0.1)")};
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      min-width: 200px;
      max-width: 240px;
      font-size: 0.95rem;
      gap: 4px;
    `,seoPreviewHeader:l`
      font-size: 0.875rem;
      font-weight: 600;
      margin-bottom: 0;
      color: ${s(t.gray[700],t.gray[300])};
    `,seoPreviewImage:l`
      max-width: 100%;
      border-radius: 6px;
      margin-bottom: 6px;
      box-shadow: 0 1px 2px ${s("rgba(0,0,0,0.03)","rgba(0,0,0,0.06)")};
      height: 160px;
      object-fit: cover;
    `,seoPreviewTitle:l`
      font-size: 0.9rem;
      font-weight: 600;
      margin-bottom: 4px;
      color: ${s(t.gray[900],t.gray[100])};
    `,seoPreviewDesc:l`
      color: ${s(t.gray[600],t.gray[400])};
      margin-bottom: 4px;
      font-size: 0.8rem;
    `,seoPreviewUrl:l`
      color: ${s(t.gray[500],t.gray[500])};
      font-size: 0.75rem;
      margin-bottom: 0;
      word-break: break-all;
    `,seoMissingTagsSection:l`
      margin-top: 4px;
      font-size: 0.875rem;
      color: ${s(t.red[500],t.red[400])};
    `,seoMissingTagsList:l`
      margin: 4px 0 0 0;
      padding: 0;
      list-style: none;
      display: flex;
      flex-wrap: wrap;
      gap: 4px;
      max-width: 240px;
    `,seoMissingTag:l`
      background: ${s(t.red[100],t.red[500]+"22")};
      color: ${s(t.red[700],t.red[500])};
      border-radius: 3px;
      padding: 2px 6px;
      font-size: 0.75rem;
      font-weight: 500;
    `,seoAllTagsFound:l`
      color: ${s(t.green[700],t.green[500])};
      font-weight: 500;
      margin-left: 0;
      padding: 0 10px 8px 10px;
      font-size: 0.875rem;
    `,devtoolsPanelContainer:(e,r)=>l`
      direction: ltr;
      position: fixed;
      overflow-y: hidden;
      overflow-x: hidden;
      ${e}: 0;
      right: 0;
      z-index: 99999;
      width: 100%;
      ${r?"":"max-height: 90%;"}
      border-top: 1px solid ${s(t.gray[200],t.gray[800])};
      transform-origin: top;
    `,devtoolsPanelContainerVisibility:e=>l`
        visibility: ${e?"visible":"hidden"};
        height: ${e?"auto":"0"};
      `,devtoolsPanelContainerResizing:e=>e()?l`
          transition: none;
        `:l`
        transition: all 0.4s ease;
      `,devtoolsPanelContainerAnimation:(e,t,r)=>e?l`
          pointer-events: auto;
          transform: translateY(0);
        `:l`
        pointer-events: none;
        transform: translateY(${"top"===r?-t:t}px);
      `,devtoolsPanel:l`
      display: flex;
      font-size: ${i.sm};
      font-family: ${o.sans};
      background-color: ${s(t.white,t.darkGray[700])};
      color: ${s(t.gray[900],t.gray[300])};
      width: w-screen;
      flex-direction: row;
      overflow-x: hidden;
      overflow-y: hidden;
      height: 100%;
    `,dragHandle:e=>l`
      position: absolute;
      left: 0;
      ${"bottom"===e?"top":"bottom"}: 0;
      width: 100%;
      height: 4px;
      cursor: row-resize;
      user-select: none;
      z-index: 100000;
      &:hover {
        background-color: ${s(t.gray[400],t.gray[500])};
      }
    `,mainCloseBtn:l`
      background: transparent;
      position: fixed;
      z-index: 99999;
      display: inline-flex;
      width: fit-content;
      cursor: pointer;
      appearance: none;
      border: 0;
      align-items: center;
      padding: 0;
      font-size: ${r.size.xs};
      cursor: pointer;
      transition: all 0.25s ease-out;
      & > img {
        width: 56px;
        height: 56px;
        transition: all 0.3s ease;
        outline-offset: 2px;
        border-radius: ${n.radius.full};
        outline: 2px solid transparent;
      }
      &:hide-until-hover {
        opacity: 0;
        pointer-events: none;
        visibility: hidden;
      }
      &:hide-until-hover:hover {
        opacity: 1;
        pointer-events: auto;
        visibility: visible;
      }
      & > img:focus-visible,
      img:hover {
        outline: 2px solid ${s(t.black,t.black)};
      }
    `,mainCloseBtnPosition:e=>l`
        ${"top-left"===e?`top: ${a[2]}; left: ${a[2]};`:""}
        ${"top-right"===e?`top: ${a[2]}; right: ${a[2]};`:""}
        ${"middle-left"===e?`top: 50%; left: ${a[2]}; transform: translateY(-50%);`:""}
        ${"middle-right"===e?`top: 50%; right: ${a[2]}; transform: translateY(-50%);`:""}
        ${"bottom-left"===e?`bottom: ${a[2]}; left: ${a[2]};`:""}
        ${"bottom-right"===e?`bottom: ${a[2]}; right: ${a[2]};`:""}
      `,mainCloseBtnAnimation:(e,t)=>e?l`
        opacity: 0;
        pointer-events: none;
        visibility: hidden;
      `:t?l`
              opacity: 0;

              &:hover {
                opacity: 1;
                pointer-events: auto;
                visibility: visible;
              }
            `:l`
              opacity: 1;
              pointer-events: auto;
              visibility: visible;
            `,tabContainer:l`
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: flex-start;
      height: 100%;
      background-color: ${s(t.gray[50],t.darkGray[900])};
      border-right: 1px solid ${s(t.gray[200],t.gray[800])};
      box-shadow: none;
      position: relative;
      width: ${a[10]};
    `,tab:l`
      display: flex;
      align-items: center;
      justify-content: center;
      width: 100%;
      height: ${a[10]};
      cursor: pointer;
      font-size: ${i.sm};
      font-family: ${o.sans};
      color: ${s(t.gray[600],t.gray[400])};
      background-color: transparent;
      border: none;
      transition: all 0.15s ease;
      border-left: 2px solid transparent;
      &:hover:not(.close):not(.active):not(.detach) {
        background-color: ${s(t.gray[100],t.gray[800])};
        color: ${s(t.gray[900],t.gray[100])};
        border-left: 2px solid ${s(t.gray[900],t.gray[100])};
      }
      &.active {
        background-color: ${s(t.gray[100],t.gray[800])};
        color: ${s(t.gray[900],t.gray[100])};
        border-left: 2px solid ${s(t.gray[900],t.gray[100])};
      }
      &.detach {
        &:hover {
          background-color: ${s(t.gray[100],t.gray[800])};
        }
        &:hover {
          color: ${s(t.green[700],t.green[500])};
        }
      }
      &.close {
        margin-top: auto;
        &:hover {
          background-color: ${s(t.gray[100],t.gray[800])};
        }
        &:hover {
          color: ${s(t.red[700],t.red[500])};
        }
      }
      &.disabled {
        cursor: not-allowed;
        opacity: 0.2;
        pointer-events: none;
      }
      &.disabled:hover {
        background-color: transparent;
        color: ${t.gray[300]};
      }
    `,tabContent:l`
      transition: all 0.2s ease-in-out;
      width: 100%;
      height: 100%;
    `,pluginsTabPanel:l`
      display: flex;
      flex-direction: row;
      width: 100%;
      height: 100%;
      overflow: hidden;
    `,pluginsTabDraw:e=>l`
      width: ${e?a[48]:0};
      height: 100%;
      background-color: ${s(t.white,t.darkGray[900])};
      box-shadow: none;
      ${e?`border-right: 1px solid ${s(t.gray[200],t.gray[800])};`:""}
    `,pluginsTabDrawExpanded:l`
      width: ${a[48]};
      border-right: 1px solid ${s(t.gray[200],t.gray[800])};
    `,pluginsTabDrawTransition:e=>l`
        transition: width ${W(e)} ease;
      `,pluginsTabSidebar:e=>l`
      width: ${a[48]};
      overflow-y: auto;
      transform: ${e?"translateX(0)":"translateX(-100%)"};
      display: flex;
      flex-direction: column;
    `,pluginsTabSidebarTransition:e=>l`
        transition: transform ${W(e)} ease;
      `,pluginsList:l`
      flex: 1;
      overflow-y: auto;
    `,pluginName:l`
      font-size: ${i.xs};
      font-family: ${o.sans};
      color: ${s(t.gray[600],t.gray[400])};
      padding: ${a[2]};
      cursor: pointer;
      text-align: center;
      transition: all 0.15s ease;
      border-left: 2px solid transparent;

      &:hover {
        background-color: ${s(t.gray[100],t.gray[800])};
        color: ${s(t.gray[900],t.gray[100])};
        padding: ${a[2]};
      }
      &.active {
        background-color: ${s(t.gray[100],t.gray[800])};
        color: ${s(t.gray[900],t.gray[100])};
        border-left: 2px solid ${s(t.gray[900],t.gray[100])};
      }
      &.active:hover {
        background-color: ${s(t.gray[200],t.gray[700])};
      }
    `,pluginsTabContent:l`
      width: 100%;
      height: 100%;
      overflow-y: auto;

      &:not(:last-child) {
        border-right: 5px solid ${s(t.purple[200],t.purple[800])};
      }
    `,settingsGroup:l`
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
    `,conditionalSetting:l`
      margin-left: 1.5rem;
      padding-left: 1rem;
      border-left: 2px solid ${s(t.gray[300],t.gray[600])};
      background-color: ${s(t.gray[50],t.darkGray[900])};
      padding: 0.75rem;
      border-radius: 0.375rem;
      margin-top: 0.5rem;
    `,settingRow:l`
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1rem;

      @media (max-width: 768px) {
        grid-template-columns: 1fr;
      }
    `,settingsModifiers:l`
      display: flex;
      gap: 0.5rem;
    `,settingsStack:l`
      display: flex;
      flex-direction: column;
      gap: 1rem;
    `,noPluginsFallback:l`
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: 400px;
      padding: 2rem;
      background: ${s(t.gray[50],t.darkGray[700])};
      width: 100%;
      height: 100%;
    `,noPluginsFallbackContent:l`
      max-width: 600px;
      text-align: center;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 1rem;
    `,noPluginsFallbackIcon:l`
      width: 64px;
      height: 64px;
      color: ${s(t.gray[400],t.gray[600])};
      margin-bottom: 0.5rem;

      svg {
        width: 100%;
        height: 100%;
      }
    `,noPluginsFallbackTitle:l`
      font-size: 1.5rem;
      font-weight: 600;
      color: ${s(t.gray[900],t.gray[100])};
      margin: 0;
    `,noPluginsFallbackDescription:l`
      font-size: 0.95rem;
      color: ${s(t.gray[600],t.gray[400])};
      line-height: 1.5;
      margin: 0;
    `,noPluginsSuggestions:l`
      width: 100%;
      margin-top: 1.5rem;
      padding: 1.5rem;
      background: ${s(t.white,t.darkGray[800])};
      border: 1px solid ${s(t.gray[200],t.gray[700])};
      border-radius: 0.5rem;
    `,noPluginsSuggestionsTitle:l`
      font-size: 1.125rem;
      font-weight: 600;
      color: ${s(t.gray[900],t.gray[100])};
      margin: 0 0 0.5rem 0;
    `,noPluginsSuggestionsDesc:l`
      font-size: 0.875rem;
      color: ${s(t.gray[600],t.gray[400])};
      margin: 0 0 1rem 0;
    `,noPluginsSuggestionsList:l`
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
    `,noPluginsSuggestionCard:l`
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 1rem;
      background: ${s(t.gray[50],t.darkGray[900])};
      border: 1px solid ${s(t.gray[200],t.gray[700])};
      border-radius: 0.375rem;
      transition: all 0.15s ease;

      &:hover {
        border-color: ${s(t.gray[300],t.gray[600])};
        background: ${s(t.gray[100],t.darkGray[800])};
      }
    `,noPluginsSuggestionInfo:l`
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      gap: 0.25rem;
      flex: 1;
    `,noPluginsSuggestionPackage:l`
      font-size: 0.95rem;
      font-weight: 600;
      color: ${s(t.gray[900],t.gray[100])};
      margin: 0;
      font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
    `,noPluginsSuggestionSource:l`
      font-size: 0.8rem;
      color: ${s(t.gray[500],t.gray[500])};
      margin: 0;
    `,noPluginsSuggestionStatus:l`
      display: flex;
      align-items: center;
      gap: 0.5rem;
      color: ${s(t.green[600],t.green[400])};

      svg {
        width: 18px;
        height: 18px;
      }
    `,noPluginsSuggestionStatusText:l`
      font-size: 0.875rem;
      font-weight: 500;
    `,noPluginsSuggestionStatusTextError:l`
      font-size: 0.875rem;
      font-weight: 500;
      color: ${s(t.red[600],t.red[400])};
    `,noPluginsEmptyState:l`
      margin-top: 1.5rem;
      padding: 1.5rem;
      background: ${s(t.white,t.darkGray[800])};
      border: 1px solid ${s(t.gray[200],t.gray[700])};
      border-radius: 0.5rem;
    `,noPluginsEmptyStateText:l`
      font-size: 0.875rem;
      color: ${s(t.gray[600],t.gray[400])};
      margin: 0;
      line-height: 1.5;
    `,noPluginsFallbackLinks:l`
      display: flex;
      align-items: center;
      gap: 0.75rem;
      margin-top: 1.5rem;
    `,noPluginsFallbackLink:l`
      font-size: 0.875rem;
      color: ${s(t.gray[700],t.gray[300])};
      text-decoration: none;
      transition: color 0.15s ease;

      &:hover {
        color: ${s(t.gray[900],t.gray[100])};
        text-decoration: underline;
      }
    `,noPluginsFallbackLinkSeparator:l`
      color: ${s(t.gray[400],t.gray[600])};
    `,pluginMarketplace:l`
      width: 100%;
      overflow-y: auto;
      padding: 2rem;
      background: ${s("linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)","linear-gradient(135deg, #1a1d23 0%, #13161a 100%)")};
      animation: fadeIn 0.3s ease;

      @keyframes fadeIn {
        from {
          opacity: 0;
          transform: translateY(10px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }
    `,pluginMarketplaceHeader:l`
      margin-bottom: 2rem;
      padding-bottom: 1rem;
      border-bottom: 2px solid ${s(t.gray[200],t.gray[700])};
    `,pluginMarketplaceTitleRow:l`
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 2rem;
      margin-bottom: 0.5rem;
    `,pluginMarketplaceTitle:l`
      font-size: 1.5rem;
      font-weight: 700;
      color: ${s(t.gray[900],t.gray[100])};
      margin: 0;
      letter-spacing: -0.02em;
    `,pluginMarketplaceDescription:l`
      font-size: 0.95rem;
      color: ${s(t.gray[600],t.gray[400])};
      margin: 0 0 1rem 0;
      line-height: 1.5;
    `,pluginMarketplaceSearchWrapper:l`
      position: relative;
      display: flex;
      align-items: center;
      max-width: 400px;
      flex-shrink: 0;

      svg {
        position: absolute;
        left: 1rem;
        color: ${s(t.gray[400],t.gray[500])};
        pointer-events: none;
      }
    `,pluginMarketplaceSearch:l`
      width: 100%;
      padding: 0.75rem 1rem 0.75rem 2.75rem;
      background: ${s(t.gray[50],t.darkGray[900])};
      border: 2px solid ${s(t.gray[200],t.gray[700])};
      border-radius: 0.5rem;
      color: ${s(t.gray[900],t.gray[100])};
      font-size: 0.875rem;
      font-family: ${o.sans};
      transition: all 0.2s ease;

      &::placeholder {
        color: ${s(t.gray[400],t.gray[500])};
      }

      &:focus {
        outline: none;
        border-color: ${s(t.blue[500],t.blue[400])};
        background: ${s(t.white,t.darkGray[800])};
        box-shadow: 0 0 0 3px
          ${s("rgba(59, 130, 246, 0.1)","rgba(96, 165, 250, 0.1)")};
      }
    `,pluginMarketplaceFilters:l`
      margin-top: 1.5rem;
      padding-top: 1rem;
    `,pluginMarketplaceTagsContainer:l`
      display: flex;
      flex-wrap: wrap;
      gap: 0.5rem;
      margin-top: 1.5rem;
      padding: 1rem;
      background: ${s(t.gray[50],t.darkGray[800])};
      border: 1px solid ${s(t.gray[200],t.gray[700])};
      border-radius: 0.5rem;
    `,pluginMarketplaceTagButton:l`
      padding: 0.5rem 1rem;
      font-size: 0.875rem;
      font-weight: 500;
      background: ${s(t.white,t.darkGray[700])};
      border: 2px solid ${s(t.gray[300],t.gray[600])};
      border-radius: 0.375rem;
      color: ${s(t.gray[700],t.gray[300])};
      cursor: pointer;
      transition: all 0.15s ease;

      &:hover {
        background: ${s(t.gray[100],t.darkGray[600])};
        border-color: ${s(t.gray[400],t.gray[500])};
        color: ${s(t.gray[900],t.gray[100])};
      }
    `,pluginMarketplaceTagButtonActive:l`
      background: ${s("linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)","linear-gradient(135deg, #60a5fa 0%, #3b82f6 100%)")} !important;
      border-color: ${s("#2563eb","#3b82f6")} !important;
      color: white !important;

      &:hover {
        background: ${s("linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)","linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)")} !important;
        border-color: ${s("#1d4ed8","#2563eb")} !important;
      }
    `,pluginMarketplaceSettingsButton:l`
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 0.75rem;
      background: ${s(t.gray[100],t.darkGray[800])};
      border: 2px solid ${s(t.gray[200],t.gray[700])};
      border-radius: 0.5rem;
      color: ${s(t.gray[700],t.gray[300])};
      cursor: pointer;
      transition: all 0.2s ease;
      margin-left: 0.5rem;

      &:hover {
        background: ${s(t.gray[200],t.darkGray[700])};
        border-color: ${s(t.gray[300],t.gray[600])};
        color: ${s(t.gray[900],t.gray[100])};
      }

      &:active {
        transform: scale(0.95);
      }
    `,pluginMarketplaceSettingsPanel:l`
      position: fixed;
      top: 0;
      right: 0;
      bottom: 0;
      width: 350px;
      background: ${s(t.white,t.darkGray[800])};
      border-left: 1px solid ${s(t.gray[200],t.gray[700])};
      box-shadow: -4px 0 12px ${s("rgba(0, 0, 0, 0.1)","rgba(0, 0, 0, 0.4)")};
      z-index: 1000;
      display: flex;
      flex-direction: column;
      animation: slideInRight 0.3s ease;

      @keyframes slideInRight {
        from {
          transform: translateX(100%);
        }
        to {
          transform: translateX(0);
        }
      }
    `,pluginMarketplaceSettingsPanelHeader:l`
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 1.5rem;
      border-bottom: 1px solid ${s(t.gray[200],t.gray[700])};
    `,pluginMarketplaceSettingsPanelTitle:l`
      font-size: 1.125rem;
      font-weight: 600;
      color: ${s(t.gray[900],t.gray[100])};
      margin: 0;
    `,pluginMarketplaceSettingsPanelClose:l`
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 0.5rem;
      background: transparent;
      border: none;
      color: ${s(t.gray[600],t.gray[400])};
      cursor: pointer;
      border-radius: 0.375rem;
      transition: all 0.15s ease;

      &:hover {
        background: ${s(t.gray[100],t.darkGray[700])};
        color: ${s(t.gray[900],t.gray[100])};
      }
    `,pluginMarketplaceSettingsPanelContent:l`
      flex: 1;
      padding: 1.5rem;
      overflow-y: auto;
    `,pluginMarketplaceGrid:l`
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 1.25rem;
      animation: slideUp 0.4s ease;

      @keyframes slideUp {
        from {
          opacity: 0;
          transform: translateY(20px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }
    `,pluginMarketplaceCard:l`
      background: ${s(t.white,t.darkGray[800])};
      border: 2px solid ${s(t.gray[200],t.gray[700])};
      border-radius: 0.75rem;
      padding: 1.5rem;
      display: flex;
      flex-direction: column;
      gap: 1rem;
      transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
      position: relative;
      overflow: hidden;

      &::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        height: 3px;
        background: ${s("linear-gradient(90deg, #3b82f6 0%, #8b5cf6 100%)","linear-gradient(90deg, #60a5fa 0%, #a78bfa 100%)")};
        transform: scaleX(0);
        transform-origin: left;
        transition: transform 0.25s ease;
      }

      &:hover {
        border-color: ${s(t.gray[400],t.gray[500])};
        box-shadow: 0 8px 24px ${s("rgba(0,0,0,0.1)","rgba(0,0,0,0.4)")};
        transform: translateY(-4px);

        &::before {
          transform: scaleX(1);
        }
      }
    `,pluginMarketplaceCardIcon:l`
      width: 40px;
      height: 40px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: ${s("linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)","linear-gradient(135deg, #60a5fa 0%, #a78bfa 100%)")};
      border-radius: 0.5rem;
      color: white;
      transition: transform 0.25s ease;

      svg {
        width: 20px;
        height: 20px;
      }

      &.custom-logo {
      }
    `,pluginMarketplaceCardHeader:l`
      flex: 1;
    `,pluginMarketplaceCardTitle:l`
      font-size: 0.95rem;
      font-weight: 600;
      color: ${s(t.gray[900],t.gray[100])};
      margin: 0 0 0.5rem 0;
      line-height: 1.4;
    `,pluginMarketplaceCardDescription:l`
      font-size: 0.8rem;
      color: ${s(t.gray[500],t.gray[500])};
      margin: 0;
      padding: 0;
      background: transparent;
      border-radius: 0.375rem;
      display: block;
      font-weight: 500;
    `,pluginMarketplaceCardPackageBadge:l`
      margin-top: 4px;
      margin-bottom: 8px;
      font-size: 0.6875rem;
      font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
      opacity: 0.6;
      padding: 4px 8px;
      padding-left: 0;
      background-color: var(--bg-tertiary);
      border-radius: 4px;
      word-break: break-all;
      display: inline-block;
    `,pluginMarketplaceCardDescriptionText:l`
      line-height: 1.5;
      margin-top: 0;
    `,pluginMarketplaceCardVersionInfo:l`
      margin-top: 8px;
      font-size: 0.6875rem;
      font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
    `,pluginMarketplaceCardVersionSatisfied:l`
      color: ${s(t.green[600],t.green[400])};
    `,pluginMarketplaceCardVersionUnsatisfied:l`
      color: ${s(t.red[600],t.red[400])};
    `,pluginMarketplaceCardDocsLink:l`
      display: inline-flex;
      align-items: center;
      gap: 0.25rem;
      font-size: 0.75rem;
      color: ${s(t.blue[600],t.blue[400])};
      text-decoration: none;
      margin-top: 0.5rem;
      transition: color 0.15s ease;

      &:hover {
        color: ${s(t.blue[700],t.blue[300])};
        text-decoration: underline;
      }

      svg {
        width: 12px;
        height: 12px;
      }
    `,pluginMarketplaceCardTags:l`
      display: flex;
      flex-wrap: wrap;
      gap: 0.375rem;
      margin-top: 0.75rem;
    `,pluginMarketplaceCardTag:l`
      font-size: 0.6875rem;
      font-weight: 500;
      padding: 0.25rem 0.5rem;
      background: ${s(t.gray[100],t.darkGray[700])};
      border: 1px solid ${s(t.gray[300],t.gray[600])};
      border-radius: 0.25rem;
      color: ${s(t.gray[700],t.gray[300])};
    `,pluginMarketplaceCardImage:l`
      width: 28px;
      height: 28px;
      object-fit: contain;
    `,pluginMarketplaceNewBanner:l`
      position: absolute;
      top: 12px;
      right: -35px;
      background-color: ${s(t.green[500],t.green[500])};
      color: white;
      padding: 4px 40px;
      font-size: 0.6875rem;
      font-weight: bold;
      text-transform: uppercase;
      transform: rotate(45deg);
      box-shadow: 0 2px 8px rgba(16, 185, 129, 0.5);
      z-index: 10;
      letter-spacing: 0.5px;
    `,pluginMarketplaceCardFeatured:l`
      border-color: ${s(t.blue[500],t.blue[400])};
      border-width: 2px;
    `,pluginMarketplaceCardActive:l`
      border-color: ${s(t.green[500],t.green[600])};
      border-width: 2px;

      &:hover {
        border-color: ${s(t.green[500],t.green[600])};
        box-shadow: none;
        transform: none;

        &::before {
          transform: scaleX(0);
        }
      }
    `,pluginMarketplaceCardStatus:l`
      display: flex;
      align-items: center;
      gap: 0.5rem;
      color: ${s(t.green[600],t.green[400])};
      animation: statusFadeIn 0.3s ease;

      @keyframes statusFadeIn {
        from {
          opacity: 0;
        }
        to {
          opacity: 1;
        }
      }

      svg {
        width: 18px;
        height: 18px;
        animation: iconPop 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55);
      }

      @keyframes iconPop {
        0% {
          transform: scale(0);
        }
        50% {
          transform: scale(1.2);
        }
        100% {
          transform: scale(1);
        }
      }
    `,pluginMarketplaceCardSpinner:l`
      width: 18px;
      height: 18px;
      border: 2px solid ${s(t.gray[200],t.gray[700])};
      border-top-color: ${s(t.blue[600],t.blue[400])};
      border-radius: 50%;
      animation: spin 0.8s linear infinite;

      @keyframes spin {
        to {
          transform: rotate(360deg);
        }
      }
    `,pluginMarketplaceCardStatusText:l`
      font-size: 0.875rem;
      font-weight: 600;
    `,pluginMarketplaceCardStatusTextError:l`
      font-size: 0.875rem;
      font-weight: 600;
      color: ${s(t.red[600],t.red[400])};
    `,pluginMarketplaceEmpty:l`
      padding: 3rem 2rem;
      text-align: center;
      background: ${s(t.white,t.darkGray[800])};
      border: 2px dashed ${s(t.gray[300],t.gray[700])};
      border-radius: 0.75rem;
      animation: fadeIn 0.3s ease;
    `,pluginMarketplaceEmptyText:l`
      font-size: 0.95rem;
      color: ${s(t.gray[600],t.gray[400])};
      margin: 0;
      line-height: 1.6;
    `,pluginMarketplaceSection:l`
      margin-bottom: 2.5rem;

      &:last-child {
        margin-bottom: 0;
      }
    `,pluginMarketplaceSectionHeader:l`
      margin-bottom: 1rem;
      padding: 1rem 1.25rem;
      display: flex;
      align-items: center;
      gap: 0.75rem;
      cursor: pointer;
      user-select: none;
      background: ${s(t.gray[50],t.darkGray[800])};
      border: 1px solid ${s(t.gray[200],t.gray[700])};
      border-radius: 0.5rem;
      transition: all 0.15s ease;

      &:hover {
        background: ${s(t.gray[100],t.darkGray[700])};
        border-color: ${s(t.gray[300],t.gray[600])};
      }
    `,pluginMarketplaceSectionHeaderLeft:l`
      display: flex;
      align-items: center;
      gap: 0.5rem;
    `,pluginMarketplaceSectionChevron:l`
      width: 24px;
      height: 24px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: ${s(t.gray[700],t.gray[300])};
      transition: transform 0.2s ease;
    `,pluginMarketplaceSectionChevronCollapsed:l`
      transform: rotate(-90deg);
    `,pluginMarketplaceSectionTitle:l`
      font-size: 1.25rem;
      font-weight: 700;
      color: ${s(t.gray[900],t.gray[50])};
      margin: 0;
      display: flex;
      align-items: center;
      gap: 0.5rem;
    `,pluginMarketplaceSectionBadge:l`
      font-size: 0.75rem;
      font-weight: 600;
      padding: 0.25rem 0.5rem;
      background: ${s("linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)","linear-gradient(135deg, #60a5fa 0%, #3b82f6 100%)")};
      color: white;
      border-radius: 0.25rem;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    `,pluginMarketplaceFeatureBanner:l`
      margin-top: 1rem;
      padding: 1.25rem 1.5rem;
      background: ${s("linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)","linear-gradient(135deg, #1e3a8a 0%, #1e40af 100%)")};
      border-radius: 0.75rem;
      border: 1px solid ${s(t.blue[400],t.blue[800])};
      box-shadow:
        0 4px 6px -1px rgba(0, 0, 0, 0.1),
        0 2px 4px -1px rgba(0, 0, 0, 0.06);
    `,pluginMarketplaceFeatureBannerContent:l`
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
    `,pluginMarketplaceFeatureBannerTitle:l`
      font-size: 1.125rem;
      font-weight: 700;
      color: white;
      margin: 0;
      display: flex;
      align-items: center;
      gap: 0.5rem;
    `,pluginMarketplaceFeatureBannerIcon:l`
      width: 24px;
      height: 24px;
      display: inline-flex;
    `,pluginMarketplaceFeatureBannerText:l`
      font-size: 0.95rem;
      color: ${s("rgba(255, 255, 255, 0.95)","rgba(255, 255, 255, 0.9)")};
      line-height: 1.5;
      margin: 0;
    `,pluginMarketplaceFeatureBannerButton:l`
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.625rem 1.25rem;
      background: white;
      color: ${t.blue[600]};
      font-weight: 600;
      font-size: 0.95rem;
      border-radius: 0.5rem;
      border: none;
      cursor: pointer;
      transition: all 0.2s ease;
      text-decoration: none;
      align-self: flex-start;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

      &:hover {
        background: ${s(t.gray[50],t.gray[100])};
        transform: translateY(-1px);
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
      }

      &:active {
        transform: translateY(0);
      }
    `,pluginMarketplaceFeatureBannerButtonIcon:l`
      width: 18px;
      height: 18px;
    `,pluginMarketplaceCardDisabled:l`
      opacity: 0.6;
      filter: grayscale(0.3);
      cursor: not-allowed;

      &:hover {
        transform: none;
        box-shadow: none;
      }
    `,pluginMarketplaceCardBadge:l`
      position: absolute;
      top: 1rem;
      right: 1rem;
      padding: 0.25rem 0.5rem;
      font-size: 0.65rem;
      font-weight: 600;
      text-transform: uppercase;
      border-radius: 0.25rem;
      letter-spacing: 0.05em;
    `,pluginMarketplaceCardBadgeInstall:l`
      background: ${s(t.green[100],t.green[900])};
      color: ${s(t.green[700],t.green[300])};
    `,pluginMarketplaceCardBadgeAdd:l`
      background: ${s(t.blue[100],t.blue[900])};
      color: ${s(t.blue[700],t.blue[300])};
    `,pluginMarketplaceCardBadgeRequires:l`
      background: ${s(t.gray[100],t.gray[800])};
      color: ${s(t.gray[600],t.gray[400])};
    `,pluginMarketplaceButtonInstalled:l`
      opacity: 0.5;
    `,pluginNameAddMore:l`
      font-size: ${i.xs};
      font-family: ${o.sans};
      color: ${s(t.gray[600],t.gray[400])};
      padding: ${a[3]} ${a[2]};
      cursor: pointer;
      text-align: center;
      transition: all 0.15s ease;
      border-left: 2px solid transparent;
      background: ${s("linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)","linear-gradient(135deg, #1f2937 0%, #111827 100%)")};
      font-weight: 600;
      position: relative;
      margin-top: auto;

      h3 {
        margin: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 0.25rem;

        &::before {
          content: '✨';
          font-size: 0.875rem;
          animation: sparkle 2s ease-in-out infinite;
        }
      }

      @keyframes sparkle {
        0%,
        100% {
          opacity: 1;
          transform: scale(1) rotate(0deg);
        }
        50% {
          opacity: 0.6;
          transform: scale(1.1) rotate(10deg);
        }
      }

      &:hover {
        background: ${s("linear-gradient(135deg, #e9ecef 0%, #dee2e6 100%)","linear-gradient(135deg, #374151 0%, #1f2937 100%)")};
        color: ${s(t.gray[900],t.gray[100])};
        border-left-color: ${s(t.blue[500],t.blue[400])};

        h3::before {
          animation: sparkle 0.5s ease-in-out infinite;
        }
      }

      &.active {
        background: ${s("linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)","linear-gradient(135deg, #60a5fa 0%, #3b82f6 100%)")};
        color: ${s(t.white,t.white)};
        border-left: 2px solid ${s(t.blue[600],t.blue[300])};
        box-shadow: 0 4px 12px
          ${s("rgba(59, 130, 246, 0.3)","rgba(96, 165, 250, 0.3)")};

        h3::before {
          filter: brightness(0) invert(1);
        }
      }

      &.active:hover {
        background: ${s("linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)","linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)")};
      }
    `}};function J(){let{theme:e}=L(),[t,r]=(0,a.createSignal)(K(e()));return(0,a.createEffect)(()=>{r(K(e()))}),t}var Z=(0,r.template)("<div>"),X=(0,r.template)('<button type=button aria-label="Open TanStack Devtools">'),$=(0,r.template)('<img alt="TanStack Devtools">'),_=e=>{let{settings:t}=Y(),[o,i]=(0,a.createSignal)(),l=J(),s=(0,a.createMemo)(()=>(0,B.default)(l().mainCloseBtn,l().mainCloseBtnPosition(t().position),l().mainCloseBtnAnimation(e.isOpen(),t().hideUntilHover)));return(0,a.createEffect)(()=>{let e=t().customTrigger,r=o();e&&r&&e(r,{theme:t().theme})}),(0,a.createComponent)(a.Show,{get when(){return!t().triggerHidden},get children(){var c=X();return c.$$click=()=>e.setIsOpen(!e.isOpen()),(0,r.insert)(c,(0,a.createComponent)(a.Show,{get when(){return t().customTrigger},get fallback(){var d;return d=$(),(0,r.setAttribute)(d,"src","data:image/png;base64,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"),d},get children(){var g=Z();return(0,r.use)(i,g),g}})),(0,n.effect)(()=>(0,r.className)(c,s())),c}})};(0,r.delegateEvents)(["click"]);var ee=(0,r.template)("<div>"),et=e=>{var o;let i=J(),{height:l}=R(),{settings:s}=Y(),c=(0,t.usePiPWindow)();return o=ee(),(0,r.setAttribute)(o,"id",t.TANSTACK_DEVTOOLS),(0,r.insert)(o,(0,a.createComponent)(H,{animationMs:400,get children(){return e.children}})),(0,n.effect)(t=>{var a=c().pipWindow?"100vh":l()+"px",n=c().pipWindow?"100vh":l()+"px",d=(0,B.default)(i().devtoolsPanelContainer(s().panelLocation,!!c().pipWindow),i().devtoolsPanelContainerAnimation(e.isOpen(),l(),s().panelLocation),i().devtoolsPanelContainerVisibility(e.isOpen()),i().devtoolsPanelContainerResizing(e.isResizing));return a!==t.e&&(null!=(t.e=a)?o.style.setProperty("height",a):o.style.removeProperty("height")),n!==t.t&&(null!=(t.t=n)?o.style.setProperty("--tsd-main-panel-height",n):o.style.removeProperty("--tsd-main-panel-height")),d!==t.a&&(0,r.className)(o,t.a=d),t},{e:void 0,t:void 0,a:void 0}),o},er=(0,r.template)("<div>"),ea=e=>{var t,a,o;let i=J(),{settings:l}=Y();return t=er(),"function"==typeof(a=e.ref)?(0,r.use)(a,t):e.ref=t,(0,r.insert)(t,(o=(0,r.memo)(()=>!!e.handleDragStart),()=>{var t;return o()?(t=er(),(0,r.addEventListener)(t,"mousedown",e.handleDragStart,!0),(0,n.effect)(()=>(0,r.className)(t,i().dragHandle(l().panelLocation))),t):null}),null),(0,r.insert)(t,()=>e.children,null),(0,n.effect)(()=>(0,r.className)(t,i().devtoolsPanel)),t};(0,r.delegateEvents)(["mousedown"]);var en=(0,r.template)("<div><h4></h4><div></div>Final shortcut is: "),eo={Shift:"Shift",Alt:"Alt",Meta:"Meta",Control:"Control",CtrlOrMeta:"Ctrl Or Meta"},ei=e=>{var o,i,l,s;let c=J();return s=(l=(i=(o=en()).firstChild).nextSibling).nextSibling,i.style.setProperty("margin","0"),(0,r.insert)(i,()=>e.description),(0,r.insert)(l,(0,a.createComponent)(a.Show,{keyed:!0,get when(){return e.hotkey},get children(){return e.modifiers.map(t=>(0,a.createComponent)(S.Button,{variant:"success",onclick:()=>(t=>{if(e.hotkey.includes(t))e.onHotkeyChange(e.hotkey.filter(e=>e!==t));else{let r=e.hotkey.filter(t=>e.modifiers.includes(t)),a=e.hotkey.filter(t=>!e.modifiers.includes(t));e.onHotkeyChange([...r,t,...a])}})(t),get outline(){return!e.hotkey.includes(t)},get children(){return eo[t]||t}}))}})),(0,r.insert)(o,(0,a.createComponent)(x.Input,{description:"Use '+' to combine keys (e.g., 'a+b' or 'd'). This will be used with the enabled modifiers from above",placeholder:"a",get value(){return e.hotkey.filter(t=>!e.modifiers.includes(t)).join("+")},onChange:r=>{let a=e.hotkey.filter(t=>e.modifiers.includes(t)),n=r.split("+").flatMap(e=>(e=>{if(1===e.length)return[(0,t.uppercaseFirstLetter)(e)];let r=[];for(let a of e){let e=(0,t.uppercaseFirstLetter)(a);r.includes(e)||r.push(e)}return r})(e)).filter(Boolean);e.onHotkeyChange([...a,...n])}}),s),(0,r.insert)(o,()=>e.hotkey.join(" + "),null),(0,n.effect)(e=>{var t=c().settingsGroup,a=c().settingsModifiers;return t!==e.e&&(0,r.className)(o,e.e=t),a!==e.t&&(0,r.className)(l,e.t=a),e},{e:void 0,t:void 0}),o},el=(0,r.template)("<div>"),es=(0,r.template)("<div><div>"),ec=()=>{let{setSettings:e,settings:t}=Y(),o=J(),i=["CtrlOrMeta","Alt","Shift"];return(0,a.createComponent)(b.MainPanel,{withPadding:!0,get children(){return[(0,a.createComponent)(k.Section,{get children(){var l;return[(0,a.createComponent)(k.SectionTitle,{get children(){return[(0,a.createComponent)(k.SectionIcon,{get children(){return(0,a.createComponent)(M.SettingsCog,{})}}),"General"]}}),(0,a.createComponent)(k.SectionDescription,{children:"Configure general behavior of the devtools panel."}),(l=el(),(0,r.insert)(l,(0,a.createComponent)(C.Checkbox,{label:"Default open",description:"Automatically open the devtools panel when the page loads",onChange:()=>e({defaultOpen:!t().defaultOpen}),get checked(){return t().defaultOpen}}),null),(0,r.insert)(l,(0,a.createComponent)(C.Checkbox,{label:"Hide trigger until hovered",description:"Keep the devtools trigger button hidden until you hover over its area",onChange:()=>e({hideUntilHover:!t().hideUntilHover}),get checked(){return t().hideUntilHover}}),null),(0,r.insert)(l,(0,a.createComponent)(C.Checkbox,{label:"Completely hide trigger",description:"Completely removes the trigger from the DOM (you can still open it with the hotkey)",onChange:()=>e({triggerHidden:!t().triggerHidden}),get checked(){return t().triggerHidden}}),null),(0,r.insert)(l,(0,a.createComponent)(w.Select,{label:"Theme",description:"Choose the theme for the devtools panel",get value(){return t().theme},options:[{label:"Dark",value:"dark"},{label:"Light",value:"light"}],onChange:t=>e({theme:t})}),null),(0,n.effect)(()=>(0,r.className)(l,o().settingsGroup)),l)]}}),(0,a.createComponent)(k.Section,{get children(){var s;return[(0,a.createComponent)(k.SectionTitle,{get children(){return[(0,a.createComponent)(k.SectionIcon,{get children(){return(0,a.createComponent)(M.Link,{})}}),"URL Configuration"]}}),(0,a.createComponent)(k.SectionDescription,{children:"Control when devtools are available based on URL parameters."}),(s=el(),(0,r.insert)(s,(0,a.createComponent)(C.Checkbox,{label:"Require URL Flag",description:"Only show devtools when a specific URL parameter is present",get checked(){return t().requireUrlFlag},onChange:t=>e({requireUrlFlag:t})}),null),(0,r.insert)(s,(0,a.createComponent)(a.Show,{get when(){return t().requireUrlFlag},get children(){var c=el();return(0,r.insert)(c,(0,a.createComponent)(x.Input,{label:"URL flag",description:"Enter the URL parameter name (e.g., 'debug' for ?debug=true)",placeholder:"debug",get value(){return t().urlFlag},onChange:t=>e({urlFlag:t})})),(0,n.effect)(()=>(0,r.className)(c,o().conditionalSetting)),c}}),null),(0,n.effect)(()=>(0,r.className)(s,o().settingsGroup)),s)]}}),(0,a.createComponent)(k.Section,{get children(){var d;return[(0,a.createComponent)(k.SectionTitle,{get children(){return[(0,a.createComponent)(k.SectionIcon,{get children(){return(0,a.createComponent)(M.Keyboard,{})}}),"Keyboard"]}}),(0,a.createComponent)(k.SectionDescription,{children:"Customize keyboard shortcuts for quick access."}),(d=el(),(0,r.insert)(d,(0,a.createComponent)(ei,{title:"Open/Close Devtools",description:"Hotkey to open/close devtools",get hotkey(){return t().openHotkey},modifiers:i,onHotkeyChange:t=>e({openHotkey:t})}),null),(0,r.insert)(d,(0,a.createComponent)(ei,{title:"Source Inspector",description:"Hotkey to open source inspector",get hotkey(){return t().inspectHotkey},modifiers:i,onHotkeyChange:t=>e({inspectHotkey:t})}),null),(0,n.effect)(()=>(0,r.className)(d,o().settingsStack)),d)]}}),(0,a.createComponent)(k.Section,{get children(){var g,p;return[(0,a.createComponent)(k.SectionTitle,{get children(){return[(0,a.createComponent)(k.SectionIcon,{get children(){return(0,a.createComponent)(M.GeoTag,{})}}),"Position"]}}),(0,a.createComponent)(k.SectionDescription,{children:"Adjust the position of the trigger button and devtools panel."}),(p=(g=es()).firstChild,(0,r.insert)(p,(0,a.createComponent)(w.Select,{label:"Trigger Position",options:[{label:"Bottom Right",value:"bottom-right"},{label:"Bottom Left",value:"bottom-left"},{label:"Top Right",value:"top-right"},{label:"Top Left",value:"top-left"},{label:"Middle Right",value:"middle-right"},{label:"Middle Left",value:"middle-left"}],get value(){return t().position},onChange:t=>e({position:t})}),null),(0,r.insert)(p,(0,a.createComponent)(w.Select,{label:"Panel Position",get value(){return t().panelLocation},options:[{label:"Top",value:"top"},{label:"Bottom",value:"bottom"}],onChange:t=>e({panelLocation:t})}),null),(0,n.effect)(e=>{var t=o().settingsGroup,a=o().settingRow;return t!==e.e&&(0,r.className)(g,e.e=t),a!==e.t&&(0,r.className)(p,e.t=a),e},{e:void 0,t:void 0}),g)]}})]}})},ed=(0,r.template)("<div>New"),eg=(0,r.template)("<img>"),ep=(0,r.template)(`<span>\u2713 v<!> \u2022 Min v`),eu=(0,r.template)("<p>"),em=(0,r.template)('<a target=_blank rel="noopener noreferrer">Documentation '),ef=(0,r.template)("<div>"),eh=(0,r.template)("<div><span></span><div></div><div><h3></h3><p></p><p>"),ev=(0,r.template)(`<span>\u26A0\uFE0F v<!> \u2022 Requires v<!>+`),ey=(0,r.template)("<span>"),eb=(0,r.template)("<span>Installing..."),ek=(0,r.template)("<span>Installed!"),eC=e=>{var t,o,i,l,s,c,d;let g=J(),{card:p}=e;return d=(c=(s=(l=(i=(o=(t=eh()).firstChild).nextSibling).nextSibling).firstChild).nextSibling).nextSibling,t.style.setProperty("position","relative"),(0,r.insert)(t,(0,a.createComponent)(a.Show,{get when(){return p.metadata?.isNew},get children(){var u=ed();return(0,n.effect)(()=>(0,r.className)(u,g().pluginMarketplaceNewBanner)),u}}),o),(0,r.insert)(o,()=>(e=>{switch(e.actionType){case"install":case"install-devtools":return"Available";case"add-to-devtools":return"Installed";case"already-installed":return"Active";case"version-mismatch":return"Incompatible";case"requires-package":return"Unavailable";case"wrong-framework":return"Other Framework";default:return""}})(p)),(0,r.insert)(i,(0,a.createComponent)(a.Show,{get when(){return p.metadata?.logoUrl},get fallback(){return(0,a.createComponent)(M.PackageIcon,{})},get children(){var m=eg();return(0,n.effect)(e=>{var t=p.metadata?.logoUrl,a=p.metadata?.title||p.devtoolsPackage,n=g().pluginMarketplaceCardImage;return t!==e.e&&(0,r.setAttribute)(m,"src",e.e=t),a!==e.t&&(0,r.setAttribute)(m,"alt",e.t=a),n!==e.a&&(0,r.className)(m,e.a=n),e},{e:void 0,t:void 0,a:void 0}),m}})),(0,r.insert)(s,()=>p.metadata?.title||p.devtoolsPackage),(0,r.insert)(c,()=>p.devtoolsPackage),(0,r.insert)(d,()=>"requires-package"===p.actionType?`Requires ${p.requiredPackageName}`:"wrong-framework"===p.actionType?"For different framework projects":"already-installed"===p.actionType?"Active in your devtools":"version-mismatch"===p.actionType?p.versionInfo?.reason||"Version incompatible":p.metadata?.description||`For ${p.requiredPackageName}`),(0,r.insert)(l,(0,a.createComponent)(a.Show,{get when(){return p.versionInfo},get children(){var f=eu();return(0,r.insert)(f,(0,a.createComponent)(a.Show,{get when(){return p.versionInfo?.satisfied},get fallback(){var h,v,y;return(y=(v=(h=ev()).firstChild.nextSibling).nextSibling.nextSibling).nextSibling,(0,r.insert)(h,()=>p.versionInfo?.current,v),(0,r.insert)(h,()=>p.versionInfo?.required,y),(0,n.effect)(()=>(0,r.className)(h,g().pluginMarketplaceCardVersionUnsatisfied)),h},get children(){var b=ep(),k=b.firstChild.nextSibling;return k.nextSibling,(0,r.insert)(b,()=>p.versionInfo?.current,k),(0,r.insert)(b,()=>p.versionInfo?.required,null),(0,n.effect)(()=>(0,r.className)(b,g().pluginMarketplaceCardVersionSatisfied)),b}})),(0,n.effect)(()=>(0,r.className)(f,g().pluginMarketplaceCardVersionInfo)),f}}),null),(0,r.insert)(l,(0,a.createComponent)(a.Show,{get when(){return p.metadata?.docsUrl},get children(){var C=em();return C.firstChild,(0,r.insert)(C,(0,a.createComponent)(M.ExternalLinkIcon,{}),null),(0,n.effect)(e=>{var t=p.metadata?.docsUrl,a=g().pluginMarketplaceCardDocsLink;return t!==e.e&&(0,r.setAttribute)(C,"href",e.e=t),a!==e.t&&(0,r.className)(C,e.t=a),e},{e:void 0,t:void 0}),C}}),null),(0,r.insert)(l,(0,a.createComponent)(a.Show,{get when(){return p.metadata?.tags&&p.metadata.tags.length>0},get children(){var w=ef();return(0,r.insert)(w,(0,a.createComponent)(a.For,{get each(){return p.metadata?.tags},children:e=>{var t;return t=ey(),(0,r.insert)(t,e),(0,n.effect)(()=>(0,r.className)(t,g().pluginMarketplaceCardTag)),t}})),(0,n.effect)(()=>(0,r.className)(w,g().pluginMarketplaceCardTags)),w}}),null),(0,r.insert)(t,(0,a.createComponent)(a.Show,{get when(){return"idle"===p.status},get fallback(){var x;return x=ef(),(0,r.insert)(x,(0,a.createComponent)(a.Show,{get when(){return"installing"===p.status},get children(){var A,E;return[(A=ef(),(0,n.effect)(()=>(0,r.className)(A,g().pluginMarketplaceCardSpinner)),A),(E=eb(),(0,n.effect)(()=>(0,r.className)(E,g().pluginMarketplaceCardStatusText)),E)]}}),null),(0,r.insert)(x,(0,a.createComponent)(a.Show,{get when(){return"success"===p.status},get children(){var N;return[(0,a.createComponent)(M.CheckCircleIcon,{}),(N=ek(),(0,n.effect)(()=>(0,r.className)(N,g().pluginMarketplaceCardStatusText)),N)]}}),null),(0,r.insert)(x,(0,a.createComponent)(a.Show,{get when(){return"error"===p.status},get children(){var B;return[(0,a.createComponent)(M.XCircleIcon,{}),(B=ey(),(0,r.insert)(B,()=>p.error||"Failed to install"),(0,n.effect)(()=>(0,r.className)(B,g().pluginMarketplaceCardStatusTextError)),B)]}}),null),(0,n.effect)(()=>(0,r.className)(x,g().pluginMarketplaceCardStatus)),x},get children(){return(0,a.createComponent)(S.Button,{get variant(){return"requires-package"===p.actionType||"wrong-framework"===p.actionType||"version-mismatch"===p.actionType?"danger":"bump-version"===p.actionType?"warning":"already-installed"===p.actionType?"secondary":"primary"},onClick:()=>e.onAction(p),get disabled(){return"idle"!==p.status||"requires-package"===p.actionType||"wrong-framework"===p.actionType||"already-installed"===p.actionType||"version-mismatch"===p.actionType},get class(){return(0,r.memo)(()=>"already-installed"===p.actionType)()?g().pluginMarketplaceButtonInstalled:""},get children(){if("installing"===p.status)return"Installing...";if("success"===p.status)return"Installed!";if("error"===p.status)return"Error";switch(p.actionType){case"install":default:return"Install";case"install-devtools":return"Install Devtools";case"add-to-devtools":return"Add to Devtools";case"requires-package":return`Requires ${p.requiredPackageName}`;case"wrong-framework":return"Different Framework";case"already-installed":return"Already Installed";case"bump-version":return"Bump Version";case"version-mismatch":return"Version Mismatch"}}})}}),null),(0,n.effect)(e=>{var a=g().pluginMarketplaceCard,n={[g().pluginMarketplaceCardDisabled]:!p.isCurrentFramework&&"already-installed"!==p.actionType,[g().pluginMarketplaceCardFeatured]:!!p.metadata?.featured&&"already-installed"!==p.actionType,[g().pluginMarketplaceCardActive]:"already-installed"===p.actionType},u=((e,t)=>{let r=t(),a=r.pluginMarketplaceCardBadge;switch(e.actionType){case"install":case"install-devtools":return`${a} ${r.pluginMarketplaceCardBadgeInstall}`;case"add-to-devtools":case"already-installed":return`${a} ${r.pluginMarketplaceCardBadgeAdd}`;case"bump-version":case"version-mismatch":case"requires-package":case"wrong-framework":return`${a} ${r.pluginMarketplaceCardBadgeRequires}`;default:return a}})(p,g),m=g().pluginMarketplaceCardIcon,f=!!p.metadata?.logoUrl,h=g().pluginMarketplaceCardHeader,v=g().pluginMarketplaceCardTitle,y=g().pluginMarketplaceCardPackageBadge,b=g().pluginMarketplaceCardDescriptionText;return a!==e.e&&(0,r.className)(t,e.e=a),e.t=(0,r.classList)(t,n,e.t),u!==e.a&&(0,r.className)(o,e.a=u),m!==e.o&&(0,r.className)(i,e.o=m),f!==e.i&&i.classList.toggle("custom-logo",e.i=f),h!==e.n&&(0,r.className)(l,e.n=h),v!==e.s&&(0,r.className)(s,e.s=v),y!==e.h&&(0,r.className)(c,e.h=y),b!==e.r&&(0,r.className)(d,e.r=b),e},{e:void 0,t:void 0,a:void 0,o:void 0,i:void 0,n:void 0,s:void 0,h:void 0,r:void 0}),t},ew=(0,r.template)('<svg xmlns=http://www.w3.org/2000/svg viewBox="0 0 24 24"fill=currentColor><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z">'),ex=(0,r.template)('<svg xmlns=http://www.w3.org/2000/svg viewBox="0 0 24 24"fill=none stroke=currentColor stroke-width=2 stroke-linecap=round stroke-linejoin=round><rect x=2 y=4 width=20 height=16 rx=2></rect><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7">'),eS=(0,r.template)("<div><div><h4><span></span>Want to be featured here?</h4><p>If you've built a plugin for TanStack Devtools and would like to showcase it in the featured section, we'd love to hear from you! Reach out to us to discuss partnership opportunities.</p><a href=\"mailto:partners+devtools@tanstack.com?subject=Featured%20Plugin%20Partnership%20Inquiry\"><span></span>Contact Us"),eM=(0,r.template)("<div>"),eA=(0,r.template)("<div><div><div><div></div><h3>"),eE=()=>ew(),eN=()=>ex(),eB=e=>{var t,o,i,l,s;let c=J();return s=(l=(i=(o=(t=eA()).firstChild).firstChild).firstChild).nextSibling,(0,r.addEventListener)(o,"click",e.onToggleCollapse,!0),(0,r.insert)(l,(0,a.createComponent)(M.ChevronDownIcon,{})),(0,r.insert)(s,()=>e.section.displayName),(0,r.insert)(t,(0,a.createComponent)(a.Show,{get when(){return!e.isCollapsed()},get children(){var d;return[(0,a.createComponent)(a.Show,{get when(){return"featured"===e.section.id},get children(){var g=eS(),p=g.firstChild,u=p.firstChild,m=u.firstChild,f=u.nextSibling,h=f.nextSibling,v=h.firstChild;return(0,r.insert)(m,(0,a.createComponent)(eE,{})),(0,r.insert)(v,(0,a.createComponent)(eN,{})),(0,n.effect)(e=>{var t=c().pluginMarketplaceFeatureBanner,a=c().pluginMarketplaceFeatureBannerContent,n=c().pluginMarketplaceFeatureBannerTitle,o=c().pluginMarketplaceFeatureBannerIcon,i=c().pluginMarketplaceFeatureBannerText,l=c().pluginMarketplaceFeatureBannerButton,s=c().pluginMarketplaceFeatureBannerButtonIcon;return t!==e.e&&(0,r.className)(g,e.e=t),a!==e.t&&(0,r.className)(p,e.t=a),n!==e.a&&(0,r.className)(u,e.a=n),o!==e.o&&(0,r.className)(m,e.o=o),i!==e.i&&(0,r.className)(f,e.i=i),l!==e.n&&(0,r.className)(h,e.n=l),s!==e.s&&(0,r.className)(v,e.s=s),e},{e:void 0,t:void 0,a:void 0,o:void 0,i:void 0,n:void 0,s:void 0}),g}}),(d=eM(),(0,r.insert)(d,(0,a.createComponent)(a.For,{get each(){return e.section.cards},children:t=>(0,a.createComponent)(eC,{card:t,get onAction(){return e.onCardAction}})})),(0,n.effect)(()=>(0,r.className)(d,c().pluginMarketplaceGrid)),d)]}}),null),(0,n.effect)(a=>{var n=c().pluginMarketplaceSection,d=c().pluginMarketplaceSectionHeader,g=c().pluginMarketplaceSectionHeaderLeft,p=c().pluginMarketplaceSectionChevron,u={[c().pluginMarketplaceSectionChevronCollapsed]:e.isCollapsed()},m=c().pluginMarketplaceSectionTitle;return n!==a.e&&(0,r.className)(t,a.e=n),d!==a.t&&(0,r.className)(o,a.t=d),g!==a.a&&(0,r.className)(i,a.a=g),p!==a.o&&(0,r.className)(l,a.o=p),a.i=(0,r.classList)(l,u,a.i),m!==a.n&&(0,r.className)(s,a.n=m),a},{e:void 0,t:void 0,a:void 0,o:void 0,i:void 0,n:void 0}),t};(0,r.delegateEvents)(["click"]);var eP=(0,r.template)("<div><div><h3>Marketplace Settings</h3><button></button></div><div>"),ez=e=>{let t=J();return(0,a.createComponent)(a.Show,{get when(){return e.isOpen()},get children(){var o=eP(),i=o.firstChild,l=i.firstChild,s=l.nextSibling,c=i.nextSibling;return(0,r.addEventListener)(s,"click",e.onClose,!0),(0,r.insert)(s,(0,a.createComponent)(M.CloseIcon,{})),(0,r.insert)(c,(0,a.createComponent)(C.Checkbox,{label:"Show active plugins",description:"Display installed plugins in a separate section",get checked(){return e.showActivePlugins()},onChange:t=>e.setShowActivePlugins(t)})),(0,n.effect)(e=>{var a=t().pluginMarketplaceSettingsPanel,n=t().pluginMarketplaceSettingsPanelHeader,d=t().pluginMarketplaceSettingsPanelTitle,g=t().pluginMarketplaceSettingsPanelClose,p=t().pluginMarketplaceSettingsPanelContent;return a!==e.e&&(0,r.className)(o,e.e=a),n!==e.t&&(0,r.className)(i,e.t=n),d!==e.a&&(0,r.className)(l,e.a=d),g!==e.o&&(0,r.className)(s,e.o=g),p!==e.i&&(0,r.className)(c,e.i=p),e},{e:void 0,t:void 0,a:void 0,o:void 0,i:void 0}),o}})};(0,r.delegateEvents)(["click"]);var eT=(0,r.template)("<div>"),eF=(0,r.template)("<button>"),eI=e=>{let t=J();return(0,a.createComponent)(a.Show,{get when(){return e.tags().length>0},get children(){var o=eT();return(0,r.insert)(o,(0,a.createComponent)(a.For,{get each(){return e.tags()},children:a=>{var o;return(o=eF()).$$click=()=>e.onToggleTag(a),(0,r.insert)(o,a),(0,n.effect)(n=>{var i=t().pluginMarketplaceTagButton,l={[t().pluginMarketplaceTagButtonActive]:e.selectedTags().has(a)};return i!==n.e&&(0,r.className)(o,n.e=i),n.t=(0,r.classList)(o,l,n.t),n},{e:void 0,t:void 0}),o}})),(0,n.effect)(()=>(0,r.className)(o,t().pluginMarketplaceTagsContainer)),o}})};(0,r.delegateEvents)(["click"]);var eD=(0,r.template)('<div><div><h2>Plugin Marketplace</h2><div><div><input type=text placeholder="Search plugins..."></div><button></button></div></div><p>Discover and install devtools for TanStack Query, Router, Form, and Pacer'),eH=e=>{var t,o,i,l,s,c,d,g;let p=J();return c=(s=(l=(i=(o=(t=eD()).firstChild).firstChild).nextSibling).firstChild).firstChild,d=s.nextSibling,g=o.nextSibling,l.style.setProperty("display","flex"),l.style.setProperty("align-items","center"),(0,r.insert)(s,(0,a.createComponent)(M.SearchIcon,{}),c),c.$$input=t=>e.onSearchInput(t.currentTarget.value),(0,r.addEventListener)(d,"click",e.onSettingsClick,!0),(0,r.insert)(d,(0,a.createComponent)(M.SettingsIcon,{})),(0,r.insert)(t,(0,a.createComponent)(eI,{get tags(){return e.tags},get selectedTags(){return e.selectedTags},get onToggleTag(){return e.onToggleTag}}),null),(0,n.effect)(e=>{var a=p().pluginMarketplaceHeader,n=p().pluginMarketplaceTitleRow,l=p().pluginMarketplaceTitle,u=p().pluginMarketplaceSearchWrapper,m=p().pluginMarketplaceSearch,f=p().pluginMarketplaceSettingsButton,h=p().pluginMarketplaceDescription;return a!==e.e&&(0,r.className)(t,e.e=a),n!==e.t&&(0,r.className)(o,e.t=n),l!==e.a&&(0,r.className)(i,e.a=l),u!==e.o&&(0,r.className)(s,e.o=u),m!==e.i&&(0,r.className)(c,e.i=m),f!==e.n&&(0,r.className)(d,e.n=f),h!==e.s&&(0,r.className)(g,e.s=h),e},{e:void 0,t:void 0,a:void 0,o:void 0,i:void 0,n:void 0,s:void 0}),(0,n.effect)(()=>c.value=e.searchInput()),t};(0,r.delegateEvents)(["input","click"]);var eU=["react","solid","vue","svelte","angular"],eQ={"@tanstack/react-query-devtools":{packageName:"@tanstack/react-query-devtools",title:"TanStack Query Devtools",description:"Powerful devtools for TanStack Query - inspect queries, mutations, and cache",requires:{packageName:"@tanstack/react-query",minVersion:"5.0.0"},pluginId:"tanstack-query",docsUrl:"https://tanstack.com/query/latest/docs/devtools",author:"TanStack",framework:"react",featured:!0,tags:["TanStack","data-fetching","caching","state-management"]},"@tanstack/solid-query-devtools":{packageName:"@tanstack/solid-query-devtools",title:"TanStack Query Devtools",description:"Powerful devtools for TanStack Query - inspect queries, mutations, and cache",requires:{packageName:"@tanstack/solid-query",minVersion:"5.0.0"},pluginId:"tanstack-query",docsUrl:"https://tanstack.com/query/latest/docs/devtools",author:"TanStack",framework:"solid",tags:["TanStack","data-fetching","caching","state-management"]},"@tanstack/react-router-devtools":{packageName:"@tanstack/react-router-devtools",title:"TanStack Router Devtools",description:"Inspect routes, navigation, and router state in real-time",requires:{packageName:"@tanstack/react-router",minVersion:"1.0.0"},pluginId:"tanstack-router",docsUrl:"https://tanstack.com/router/latest/docs/devtools",author:"TanStack",framework:"react",featured:!0,tags:["TanStack","routing","navigation"]},"@tanstack/solid-router-devtools":{packageName:"@tanstack/solid-router-devtools",title:"TanStack Router Devtools",description:"Inspect routes, navigation, and router state in real-time",requires:{packageName:"@tanstack/solid-router",minVersion:"1.0.0"},pluginId:"tanstack-router",docsUrl:"https://tanstack.com/router/latest/docs/devtools",author:"TanStack",framework:"solid",tags:["TanStack","routing","navigation"]},"@tanstack/react-form-devtools":{packageName:"@tanstack/react-form-devtools",title:"TanStack Form Devtools",description:"Debug form state, validation, and field values",requires:{packageName:"@tanstack/react-form",minVersion:"1.23.0"},pluginImport:{importName:"FormDevtoolsPlugin",type:"function"},pluginId:"tanstack-form",docsUrl:"https://tanstack.com/form/latest/docs/devtools",author:"TanStack",framework:"react",isNew:!0,tags:["TanStack","forms","validation"]},"@tanstack/solid-form-devtools":{packageName:"@tanstack/solid-form-devtools",title:"TanStack Form Devtools",description:"Debug form state, validation, and field values",requires:{packageName:"@tanstack/solid-form",minVersion:"1.23.0"},pluginImport:{importName:"FormDevtoolsPlugin",type:"function"},pluginId:"tanstack-form",docsUrl:"https://tanstack.com/form/latest/docs/devtools",author:"TanStack",isNew:!0,framework:"solid",tags:["TanStack","forms","validation"]},"@tanstack/react-pacer-devtools":{packageName:"@tanstack/react-pacer-devtools",title:"Pacer Devtools",description:"Monitor and debug your Pacer animations and transitions",requires:{packageName:"@tanstack/react-pacer",minVersion:"0.16.4"},author:"TanStack",framework:"react",isNew:!0,tags:["TanStack"]},"@tanstack/solid-pacer-devtools":{packageName:"@tanstack/solid-pacer-devtools",title:"Pacer Devtools",description:"Monitor and debug your Pacer animations and transitions",requires:{packageName:"@tanstack/solid-pacer",minVersion:"0.14.4"},author:"TanStack",framework:"solid",isNew:!0,tags:["TanStack"]},"@dimano/ts-devtools-plugin-prefetch-heatmap":{packageName:"@dimano/ts-devtools-plugin-prefetch-heatmap",title:"Prefetch Heatmap",description:"Visualize TanStack Router prefetch intent, hits, and waste with a color overlay and a live metrics panel.",requires:{packageName:"@tanstack/react-router",minVersion:"1.0.0"},pluginImport:{importName:"registerPrefetchHeatmapPlugin",type:"function"},pluginId:"prefetch-heatmap",logoUrl:"https://raw.githubusercontent.com/dimitrianoudi/tanstack-prefetch-heatmap/main/assets/prefetch-heatmap-card.png",docsUrl:"https://github.com/dimitrianoudi/tanstack-prefetch-heatmap#prefetch-heatmap-devtools-plugin",repoUrl:"https://github.com/dimitrianoudi/tanstack-prefetch-heatmap",author:"Dimitris Anoudis (@dimitrianoudi)",framework:"react",isNew:!0,tags:["Router","Prefetch","Analytics","Overlay","TanStack"]}};function eL(e){if(!e)return null;let t=e.replace(/^[v^~]/,"").split("-")[0]?.split("+")[0];if(!t)return null;let r=t.split(".");if(r.length<2)return null;let a=parseInt(r[0]??"0",10),n=parseInt(r[1]??"0",10),o=parseInt(r[2]??"0",10);return isNaN(a)||isNaN(n)||isNaN(o)?null:{major:a,minor:n,patch:o,raw:e}}function eq(e,t){return e.major!==t.major?e.major-t.major:e.minor!==t.minor?e.minor-t.minor:e.patch-t.patch}var eO=(e,t)=>{let r={...e.dependencies,...e.devDependencies},a={react:["react","react-dom"],vue:["vue","@vue/core"],solid:["solid-js"],svelte:["svelte"],angular:["@angular/core"]};for(let e of t){let t=a[e];if(t&&t.some(e=>r[e]))return e}return"unknown"},eY=(e,t,r,a)=>{let n={...e.dependencies,...e.devDependencies},o=[];return Object.values(eQ).forEach(e=>{let i,l,s=e.packageName,c=e.framework===t||"other"===e.framework,d=e.requires?.packageName,g=!!d&&!!n[d],p=!!n[s];if(g&&e.requires){let t=d?n[d]:void 0;if(t){let r=function(e,t,r){let a,n,o,i;return t||r?t&&(a=eL(e),n=eL(t),!(!a||!n||eq(a,n)>=0))?{satisfied:!1,reason:`Requires v${t} or higher (current: v${e})`}:r&&(o=eL(e),i=eL(r),!(!o||!i||0>=eq(o,i)))?{satisfied:!1,reason:`Requires v${r} or lower (current: v${e})`}:{satisfied:!0}:{satisfied:!0}}(t,e.requires.minVersion,e.requires.maxVersion);i={current:t,required:e.requires.minVersion,satisfied:r.satisfied,reason:r.reason}}}let u=((e,t,r,a,n)=>{if(n)return Array.from(e).some(e=>{let t=e.toLowerCase(),r=n.toLowerCase();return t.startsWith(r)||t.includes(r)});if(e.has(t))return!0;let o=r.toLowerCase().split(/[-_/@]/).filter(e=>e.length>0),i=a.toLowerCase();return Array.from(e).some(e=>{let t=e.toLowerCase();if(t.includes(r.toLowerCase()))return!0;let a=o.filter(e=>t.includes(e));return!!(a.length>=2||t.includes(i)&&a.length>=1)})})(r,s,e.packageName,e.framework,e.pluginId);l=c?e.requires&&!g?"requires-package":i&&!i.satisfied?"bump-version":p&&u?"already-installed":p&&!u?"add-to-devtools":!p&&e.requires&&g?"install-devtools":"install":"wrong-framework";let m=a.find(e=>e.devtoolsPackage===s);o.push({requiredPackageName:d||"",devtoolsPackage:s,framework:e.framework,hasPackage:g,hasDevtools:p,isRegistered:u,actionType:l,status:m?.status||"idle",error:m?.error,isCurrentFramework:c,metadata:e,versionInfo:i})}),o},eR=e=>{let t=[];t.push({id:"featured",displayName:"⭐ Featured",cards:e.filter(e=>e.metadata?.featured&&"already-installed"!==e.actionType&&e.isCurrentFramework)});let r=e.filter(e=>"already-installed"===e.actionType&&e.isRegistered);r.length>0&&t.push({id:"active",displayName:"✓ Active Plugins",cards:r});let a=e.filter(e=>e.isCurrentFramework&&"already-installed"!==e.actionType&&!e.metadata?.featured);return a.length>0&&t.push({id:"available",displayName:"Available Plugins",cards:a}),t},ej=(0,r.template)("<div><p>"),eV=(0,r.template)("<div>"),eG=()=>{var e;let t,o=J(),{plugins:i}=q(),[l,s]=(0,a.createSignal)([]),[c,d]=(0,a.createSignal)(null),[g,p]=(0,a.createSignal)(""),[u,m]=(0,a.createSignal)(""),[f,h]=(0,a.createSignal)(new Set),[v,y]=(0,a.createSignal)(!0),[b,k]=(0,a.createSignal)(new Set),[C,w]=(0,a.createSignal)(!1),x=()=>{let e=u(),t=v(),r=b(),a=c();if(!a)return[];let n=eO(a,eU),o=eR(eY(a,n,new Set(i()?.map(e=>e.id||"")||[]),l().flatMap(e=>e.cards)));return(t||(o=o.filter(e=>"active"!==e.id)),r.size>0&&(o=o.map(e=>({...e,cards:e.cards.filter(e=>!!e.metadata?.tags&&e.metadata.tags.some(e=>r.has(e)))})).filter(e=>e.cards.length>0)),e)?o.map(t=>({...t,cards:t.cards.filter(t=>((e,t)=>{if(!t)return!0;let r=t.toLowerCase();return e.devtoolsPackage.toLowerCase().includes(r)||e.requiredPackageName.toLowerCase().includes(r)||e.framework.toLowerCase().includes(r)})(t,e))})).filter(e=>e.cards.length>0):o};(0,a.onMount)(()=>{let e=N.on("package-json-read",e=>{d(e.payload.packageJson),S(e.payload.packageJson)}),t=N.on("package-json-updated",e=>{d(e.payload.packageJson),S(e.payload.packageJson)}),r=N.on("devtools-installed",e=>{s(t=>t.map(t=>({...t,cards:t.cards.map(t=>t.devtoolsPackage===e.payload.packageName?{...t,status:e.payload.success?"success":"error",error:e.payload.error}:t)})))}),n=N.on("plugin-added",e=>{if(s(t=>t.map(t=>({...t,cards:t.cards.map(t=>t.devtoolsPackage===e.payload.packageName?{...t,status:e.payload.success?"success":"error",error:e.payload.error}:t)}))),e.payload.success){let e=c();e&&S(e)}});(0,a.onCleanup)(()=>{e(),t(),r(),n()}),N.emit("mounted",void 0)});let S=e=>{if(!e)return;let t=eO(e,eU);s(eR(eY(e,t,new Set(i()?.map(e=>e.id||"")||[]),l().flatMap(e=>e.cards))))},M=e=>{if("requires-package"!==e.actionType&&"wrong-framework"!==e.actionType&&"already-installed"!==e.actionType&&"version-mismatch"!==e.actionType){if(s(t=>t.map(t=>({...t,cards:t.cards.map(t=>t.devtoolsPackage===e.devtoolsPackage?{...t,status:"installing"}:t)}))),"bump-version"===e.actionType)return void N.emit("bump-package-version",{packageName:e.requiredPackageName,devtoolsPackage:e.devtoolsPackage,pluginName:e.metadata?.title||e.devtoolsPackage,minVersion:e.metadata?.requires?.minVersion,pluginImport:e.metadata?.pluginImport});if("add-to-devtools"===e.actionType)return void N.emit("add-plugin-to-devtools",{packageName:e.devtoolsPackage,pluginName:e.metadata?.title??e.devtoolsPackage,pluginImport:e.metadata?.pluginImport});N.emit("install-devtools",{packageName:e.devtoolsPackage,pluginName:e.metadata?.title??e.devtoolsPackage,pluginImport:e.metadata?.pluginImport})}};return e=eV(),(0,r.insert)(e,(0,a.createComponent)(ez,{isOpen:C,onClose:()=>w(!1),showActivePlugins:v,setShowActivePlugins:y}),null),(0,r.insert)(e,(0,a.createComponent)(eH,{searchInput:g,onSearchInput:e=>{p(e),t&&clearTimeout(t),t=setTimeout(()=>{m(e)},300)},onSettingsClick:()=>w(!C()),tags:()=>{let e=new Set;return l().forEach(t=>{("featured"===t.id||"available"===t.id)&&t.cards.forEach(t=>{t.metadata?.tags&&t.metadata.tags.forEach(t=>e.add(t))})}),Array.from(e).sort()},selectedTags:b,onToggleTag:e=>{k(t=>{let r=new Set(t);return r.has(e)?r.delete(e):r.add(e),r})}}),null),(0,r.insert)(e,(0,a.createComponent)(a.Show,{get when(){return x().length>0},get children(){return(0,a.createComponent)(a.For,{get each(){return x()},children:e=>(0,a.createComponent)(eB,{section:e,isCollapsed:()=>f().has(e.id),onToggleCollapse:()=>{var t;return t=e.id,void h(e=>{let r=new Set(e);return r.has(t)?r.delete(t):r.add(t),r})},onCardAction:M})})}}),null),(0,r.insert)(e,(0,a.createComponent)(a.Show,{get when(){return 0===x().length},get children(){var A,E=ej(),B=E.firstChild;return(0,r.insert)(B,(A=(0,r.memo)(()=>!!u()),()=>A()?`No plugins found matching "${u()}"`:"No additional plugins available. You have all compatible devtools installed and registered!")),(0,n.effect)(e=>{var t=o().pluginMarketplaceEmpty,a=o().pluginMarketplaceEmptyText;return t!==e.e&&(0,r.className)(E,e.e=t),a!==e.t&&(0,r.className)(B,e.t=a),e},{e:void 0,t:void 0}),E}}),null),(0,n.effect)(()=>(0,r.className)(e,o().pluginMarketplace)),e},eW=(0,r.template)("<div><div><div><div></div><div><h3>Add More"),eK=(0,r.template)("<div><h3>"),eJ=(0,r.template)("<div>"),eZ=()=>{let{plugins:e,activePlugins:o,toggleActivePlugins:i}=q(),{expanded:l,hoverUtils:s,animationMs:c,setForceExpand:d}=U(),[g,p]=(0,a.createSignal)(new Map),[u,m]=(0,a.createSignal)(!1),f=J(),{theme:h}=L(),v=(0,a.createMemo)(()=>e()?.length&&e().length>0);(0,a.createEffect)(()=>{d(u())}),(0,a.createEffect)(()=>{let t=e()?.filter(e=>o().includes(e.id));t?.forEach(e=>{let t=g().get(e.id);t&&e.render(t,h())})});let y=()=>m(!u());return(0,a.createComponent)(a.Show,{get when(){return v()},get fallback(){return(0,a.createComponent)(eG,{})},get children(){var b=eW(),k=b.firstChild,C=k.firstChild,w=C.firstChild,x=w.nextSibling;return k.addEventListener("mouseleave",()=>{u()||s.leave()}),k.addEventListener("mouseenter",()=>s.enter()),(0,r.insert)(w,(0,a.createComponent)(a.For,{get each(){return e()},children:e=>{var l,s,c;let d;(0,a.createEffect)(()=>{d&&("string"==typeof e.name?d.textContent=e.name:e.name(d,h()))});let g=(0,a.createMemo)(()=>o().includes(e.id));return s=(l=eK()).firstChild,l.$$click=()=>{var t;return t=e.id,void(u()&&m(!1),i(t))},"function"==typeof(c=d)?(0,r.use)(c,s):d=s,(0,n.effect)(a=>{var n=(0,B.default)(f().pluginName,{active:g()}),o=`${t.PLUGIN_TITLE_CONTAINER_ID}-${e.id}`;return n!==a.e&&(0,r.className)(l,a.e=n),o!==a.t&&(0,r.setAttribute)(s,"id",a.t=o),a},{e:void 0,t:void 0}),l}})),x.$$click=y,(0,r.insert)(b,(0,a.createComponent)(a.Show,{get when(){return u()},get fallback(){return(0,a.createComponent)(a.For,{get each(){return o()},children:e=>{var a;return a=eJ(),(0,r.use)(t=>{p(r=>{let a=new Map(r);return a.set(e,t),a})},a),(0,r.setAttribute)(a,"id",`${t.PLUGIN_CONTAINER_ID}-${e}`),(0,n.effect)(()=>(0,r.className)(a,f().pluginsTabContent)),a}})},get children(){return(0,a.createComponent)(eG,{})}}),null),(0,n.effect)(e=>{var t=f().pluginsTabPanel,a=(0,B.default)(f().pluginsTabDraw(l()),{[f().pluginsTabDraw(l())]:l()},f().pluginsTabDrawTransition(c)),n=(0,B.default)(f().pluginsTabSidebar(l()),f().pluginsTabSidebarTransition(c)),o=f().pluginsList,i=(0,B.default)(f().pluginNameAddMore,{active:u()});return t!==e.e&&(0,r.className)(b,e.e=t),a!==e.t&&(0,r.className)(k,e.t=a),n!==e.a&&(0,r.className)(C,e.a=n),o!==e.o&&(0,r.className)(w,e.o=o),i!==e.i&&(0,r.className)(x,e.i=i),e},{e:void 0,t:void 0,a:void 0,o:void 0,i:void 0}),b}})};(0,r.delegateEvents)(["click"]);var eX=(0,r.template)("<div><div> Preview</div><div></div><div></div><div>"),e$=(0,r.template)("<img alt=Preview>"),e_=(0,r.template)("<div>No Image"),e0=(0,r.template)("<div>"),e1=(0,r.template)("<div><strong>Missing tags for <!>:</strong><ul>"),e5=(0,r.template)("<li>"),e2=[{network:"Facebook",tags:[{key:"og:title",prop:"title"},{key:"og:description",prop:"description"},{key:"og:image",prop:"image"},{key:"og:url",prop:"url"}],color:"#4267B2"},{network:"X/Twitter",tags:[{key:"twitter:title",prop:"title"},{key:"twitter:description",prop:"description"},{key:"twitter:image",prop:"image"},{key:"twitter:url",prop:"url"}],color:"#1DA1F2"},{network:"LinkedIn",tags:[{key:"og:title",prop:"title"},{key:"og:description",prop:"description"},{key:"og:image",prop:"image"},{key:"og:url",prop:"url"}],color:"#0077B5"},{network:"Discord",tags:[{key:"og:title",prop:"title"},{key:"og:description",prop:"description"},{key:"og:image",prop:"image"},{key:"og:url",prop:"url"}],color:"#5865F2"},{network:"Slack",tags:[{key:"og:title",prop:"title"},{key:"og:description",prop:"description"},{key:"og:image",prop:"image"},{key:"og:url",prop:"url"}],color:"#4A154B"},{network:"Mastodon",tags:[{key:"og:title",prop:"title"},{key:"og:description",prop:"description"},{key:"og:image",prop:"image"},{key:"og:url",prop:"url"}],color:"#6364FF"},{network:"Bluesky",tags:[{key:"og:title",prop:"title"},{key:"og:description",prop:"description"},{key:"og:image",prop:"image"},{key:"og:url",prop:"url"}],color:"#1185FE"}];function e4(e){var t,a,o,i,l,s,c;let d=J();return o=(a=(t=eX()).firstChild).firstChild,s=(l=(i=a.nextSibling).nextSibling).nextSibling,(0,r.insert)(a,()=>e.network,o),(0,r.insert)(t,(c=(0,r.memo)(()=>!!e.meta.image),()=>{var t,a;return c()?(t=e$(),(0,n.effect)(a=>{var n=e.meta.image,o=d().seoPreviewImage;return n!==a.e&&(0,r.setAttribute)(t,"src",a.e=n),o!==a.t&&(0,r.className)(t,a.t=o),a},{e:void 0,t:void 0}),t):((a=e_()).style.setProperty("background","#222"),a.style.setProperty("color","#888"),a.style.setProperty("display","flex"),a.style.setProperty("align-items","center"),a.style.setProperty("justify-content","center"),a.style.setProperty("min-height","80px"),a.style.setProperty("width","100%"),(0,n.effect)(()=>(0,r.className)(a,d().seoPreviewImage)),a)}),i),(0,r.insert)(i,()=>e.meta.title||"No Title"),(0,r.insert)(l,()=>e.meta.description||"No Description"),(0,r.insert)(s,()=>e.meta.url||window.location.href),(0,n.effect)(n=>{var o=d().seoPreviewCard,c=e.color,g=d().seoPreviewHeader,p=e.color,u=d().seoPreviewTitle,m=d().seoPreviewDesc,f=d().seoPreviewUrl;return o!==n.e&&(0,r.className)(t,n.e=o),c!==n.t&&(null!=(n.t=c)?t.style.setProperty("border-color",c):t.style.removeProperty("border-color")),g!==n.a&&(0,r.className)(a,n.a=g),p!==n.o&&(null!=(n.o=p)?a.style.setProperty("color",p):a.style.removeProperty("color")),u!==n.i&&(0,r.className)(i,n.i=u),m!==n.n&&(0,r.className)(l,n.n=m),f!==n.s&&(0,r.className)(s,n.s=f),n},{e:void 0,t:void 0,a:void 0,o:void 0,i:void 0,n:void 0,s:void 0}),t}var e3=()=>{let[e,t]=(0,a.createSignal)(i()),o=J();function i(){let e=Array.from(document.head.querySelectorAll("meta")),t=[];for(let r of e2){let a={},n=[];for(let t of r.tags){let r=e.find(e=>!t.key.includes("twitter:")&&e.getAttribute("property")===t.key||e.getAttribute("name")===t.key);r&&r.getAttribute("content")?a[t.prop]=r.getAttribute("content")||void 0:n.push(t.key)}t.push({network:r.network,found:a,missing:n})}return t}return!function(e){let t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{},{attributes:r=!0,childList:n=!0,subtree:o=!0,observeTitle:i=!0}=t;(0,a.onMount)(()=>{let t,l=new MutationObserver(t=>{for(let r of t)"childList"===r.type?(r.addedNodes.forEach(t=>e({kind:"added",node:t},r)),r.removedNodes.forEach(t=>e({kind:"removed",node:t},r))):"attributes"===r.type?e({kind:"attr",target:r.target,name:r.attributeName,oldValue:r.oldValue??null},r):r.target.parentNode&&"title"===r.target.parentNode.tagName.toLowerCase()&&e({kind:"title",title:document.title},r)});if(l.observe(document.head,{childList:n,attributes:r,subtree:o,attributeOldValue:r,characterData:!0,characterDataOldValue:!1}),i){let r=document.head.querySelector("title")||document.head.appendChild(document.createElement("title"));(t=new MutationObserver(()=>{e({kind:"title",title:document.title})})).observe(r,{childList:!0,characterData:!0,subtree:!0})}(0,a.onCleanup)(()=>{l.disconnect(),t?.disconnect()})})}(()=>{t(i())}),(0,a.createComponent)(b.MainPanel,{withPadding:!0,get children(){return(0,a.createComponent)(k.Section,{get children(){var l;return[(0,a.createComponent)(k.SectionTitle,{get children(){return[(0,a.createComponent)(k.SectionIcon,{get children(){return(0,a.createComponent)(M.SocialBubble,{})}}),"Social previews"]}}),(0,a.createComponent)(k.SectionDescription,{children:"See how your current page will look when shared on popular social networks. The tool checks for essential meta tags and highlights any that are missing."}),(l=e0(),(0,r.insert)(l,(0,a.createComponent)(a.For,{get each(){return e()},children:(e,t)=>{var i,l;let s=e2[t()];return i=e0(),(0,r.insert)(i,(0,a.createComponent)(e4,{get meta(){return e.found},get color(){return s.color},get network(){return s.network}}),null),(0,r.insert)(i,(l=(0,r.memo)(()=>e.missing.length>0),()=>{var t,i,c,d;return l()?((c=(i=(t=e1()).firstChild).firstChild.nextSibling).nextSibling,d=i.nextSibling,(0,r.insert)(i,()=>s?.network,c),(0,r.insert)(d,(0,a.createComponent)(a.For,{get each(){return e.missing},children:e=>{var t;return t=e5(),(0,r.insert)(t,e),(0,n.effect)(()=>(0,r.className)(t,o().seoMissingTag)),t}})),(0,n.effect)(e=>{var a=o().seoMissingTagsSection,n=o().seoMissingTagsList;return a!==e.e&&(0,r.className)(t,e.e=a),n!==e.t&&(0,r.className)(d,e.t=n),e},{e:void 0,t:void 0}),t):null}),null),i}})),(0,n.effect)(()=>(0,r.className)(l,o().seoPreviewSection)),l)]}})}})},e6=[{name:"Plugins",id:"plugins",component:()=>(0,a.createComponent)(eZ,{}),icon:()=>(0,a.createComponent)(M.List,{})},{name:"SEO",id:"seo",component:()=>(0,a.createComponent)(e3,{}),icon:()=>(0,a.createComponent)(M.PageSearch,{})},{name:"Settings",id:"settings",component:()=>(0,a.createComponent)(ec,{}),icon:()=>(0,a.createComponent)(M.Cogs,{})}],e7=(0,r.template)("<div>"),e8=(0,r.template)("<button type=button>"),e9=(0,r.template)("<div><button type=button></button><button type=button>"),te=e=>{var o,i;let l=J(),{state:s,setState:c}=O(),d=(0,t.usePiPWindow)(),g=()=>{d().requestPipWindow(`width=${window.innerWidth},height=${s().height},top=${window.screen.height},left=${window.screenLeft}}`)},{hoverUtils:p}=U();return o=e7(),(0,r.insert)(o,(0,a.createComponent)(a.For,{each:e6,children:e=>{var t;return(t=e8()).addEventListener("mouseleave",()=>{"plugins"===e.id&&p.leave()}),t.addEventListener("mouseenter",()=>{"plugins"===e.id&&p.enter()}),t.$$click=()=>c({activeTab:e.id}),(0,r.insert)(t,()=>e.icon()),(0,n.effect)(()=>(0,r.className)(t,(0,B.default)(l().tab,{active:s().activeTab===e.id}))),t}}),null),(0,r.insert)(o,(i=(0,r.memo)(()=>null!==d().pipWindow),()=>{var t,o,s;return i()?null:(s=(o=(t=e9()).firstChild).nextSibling,t.style.setProperty("margin-top","auto"),o.$$click=g,(0,r.insert)(o,(0,a.createComponent)(M.PiP,{})),s.$$click=()=>e.toggleOpen(),(0,r.insert)(s,(0,a.createComponent)(M.X,{})),(0,n.effect)(e=>{var t=(0,B.default)(l().tab,"detach"),a=(0,B.default)(l().tab,"close");return t!==e.e&&(0,r.className)(o,e.e=t),a!==e.t&&(0,r.className)(s,e.t=a),e},{e:void 0,t:void 0}),t)}),null),(0,n.effect)(()=>(0,r.className)(o,l().tabContainer)),o};(0,r.delegateEvents)(["click"]);var tt=(0,r.template)("<div>"),tr=()=>{var e;let{state:t}=O(),o=J(),i=(0,a.createMemo)(()=>e6.find(e=>e.id===t().activeTab)?.component||null);return e=tt(),(0,r.insert)(e,()=>i()?.()),(0,n.effect)(()=>(0,r.className)(e,o().tabContent)),e},ta=(0,r.template)("<div>"),tn=()=>{var e,t;let{settings:o}=Y(),i=()=>({element:null,bounding:{width:0,height:0,left:0,top:0},dataSource:""}),[l,s]=(0,z.createStore)(i()),d=()=>{s(i())},[g,u]=(0,a.createSignal)(null),m=function(e){if(r.isServer)return T;let t="function"==typeof e,[n,o]=function(e){let t={...e},r={...e},n={},o=e=>{let r=n[e];if(!r){if(!(0,a.getListener)())return t[e];n[e]=r=(0,a.createSignal)(t[e],{internal:!0}),delete t[e]}return r[0]()};for(let t in e)Object.defineProperty(r,t,{get:()=>o(t),enumerable:!0});let i=(e,r)=>{let a=n[e];if(a)return a[1](r);e in t&&(t[e]=c(r,t[e]))};return[r,(e,t)=>{if(null!==e&&("object"==typeof e||"function"==typeof e)){let t=(0,a.untrack)(()=>Object.entries(c(e,r)));(0,a.batch)(()=>{for(let[e,r]of t)i(e,()=>r)})}else i(e,t);return r}]}(a.sharedConfig.context||t?T:F(e)),i=new ResizeObserver(e=>{let[t]=e;return o(F(t.target))});return(0,a.onCleanup)(()=>i.disconnect()),t?(0,a.createEffect)(()=>{let t=e();t&&(o(F(t)),i.observe(t),(0,a.onCleanup)(()=>i.unobserve(t)))}):(i.observe(e),(0,a.onCleanup)(()=>i.unobserve(e))),n}(()=>g()),[f,v]=(0,z.createStore)({x:0,y:0});p(document,"mousemove",e=>{v({x:e.clientX,y:e.clientY})});let y=h(),b=(0,a.createMemo)(()=>{var e;let t,r;return e=y(),t=V(o().inspectHotkey),r=e.map(e=>e.toUpperCase()),t.some(e=>e.every(e=>r.includes(String(e).toUpperCase()))&&r.every(t=>e.map(e=>String(e).toUpperCase()).includes(t)))});(0,a.createEffect)(()=>{if(!b())return void d();let e=document.elementFromPoint(f.x,f.y);if(!(e instanceof HTMLElement))return void d();if(e===l.element)return;let t=e.getAttribute("data-tsd-source");if(!t)return void d();let r=e.getBoundingClientRect();s({element:e,bounding:{width:r.width,height:r.height,left:r.left,top:r.top},dataSource:t})}),p(document,"click",e=>{if(!l.element)return;window.getSelection()?.removeAllRanges(),e.preventDefault(),e.stopPropagation();let t=new URL(I?.env?.BASE_URL??"/",location.origin);fetch(new URL(`__tsd/open-source?source=${encodeURIComponent(l.dataSource)}`,t)).catch(()=>{})});let k=(0,a.createMemo)(()=>l.element?{display:"block",width:`${l.bounding.width}px`,height:`${l.bounding.height}px`,left:`${l.bounding.left}px`,top:`${l.bounding.top}px`,"background-color":"oklch(55.4% 0.046 257.417 /0.25)",transition:"all 0.05s linear",position:"fixed","z-index":9999}:{display:"none"}),C=(0,a.createMemo)(()=>{if(l.element&&g()){let e=window.innerWidth,t=m.height||26,r=m.width||0,a=l.bounding.left,n=l.bounding.top-t-4;return n<0&&(n=l.bounding.top+l.bounding.height+4),a+r>e&&(a=e-r-4),a<0&&(a=4),{position:"fixed",left:`${a}px`,top:`${n}px`,"background-color":"oklch(55.4% 0.046 257.417 /0.80)",color:"white",padding:"2px 4px",fontSize:"12px","border-radius":"2px","z-index":1e4,visibility:"visible",transition:"all 0.05s linear"}}return{display:"none"}});return[(e=ta(),(0,r.use)(u,e),(0,r.insert)(e,()=>l.dataSource),(0,n.effect)(t=>(0,r.style)(e,{...C(),"pointer-events":"none"},t)),e),(t=ta(),(0,n.effect)(e=>(0,r.style)(t,{...k(),"pointer-events":"none"},e)),t)]},to=(0,r.template)("<div>");function ti(){let e,{settings:n}=Y(),{setHeight:o}=R(),{persistOpen:l,setPersistOpen:s}=(()=>{let{state:e,setState:t}=O();return{persistOpen:(0,a.createMemo)(()=>e().persistOpen),setPersistOpen:e=>{t({persistOpen:e})}}})(),[c,d]=(0,a.createSignal)(),[g,p]=(0,a.createSignal)(n().defaultOpen||l()),u=(0,t.usePiPWindow)(),[h,b]=(0,a.createSignal)(!1),k=()=>{if(u().pipWindow)return;let e=!g();p(e),s(e),N.emit("trigger-toggled",{isOpen:e})};(0,a.createEffect)(()=>{let e=N.on("trigger-toggled",e=>{if(u().pipWindow)return;let t=e.payload.isOpen;t!==g()&&(p(t),s(t))});(0,a.onCleanup)(e)}),(0,a.createEffect)(()=>{if(g()){let t=c()?.parentElement?.style.paddingBottom,r=()=>{e&&c()?.parentElement&&d(e=>(e?.parentElement,e))};if(r(),"u">typeof window)return(u().pipWindow??window).addEventListener("resize",r),()=>{(u().pipWindow??window).removeEventListener("resize",r),c()?.parentElement&&"string"==typeof t&&d(e=>e)}}else c()?.parentElement&&d(e=>(e?.parentElement&&e.parentElement.removeAttribute("style"),e))}),(0,a.createEffect)(()=>{window.addEventListener("keydown",e=>{"Escape"===e.key&&g()&&k()})}),(0,a.createEffect)(()=>{let e=document.getElementById(t.TANSTACK_DEVTOOLS);e&&j(e,!g())}),(0,a.createEffect)(()=>{if(c()){let e=c(),t=getComputedStyle(e).fontSize;e?.style.setProperty("--tsrd-font-size",t)}}),(0,a.createEffect)(()=>{for(let e of V(n().openHotkey))!function(e,t){let n=arguments.length>2&&void 0!==arguments[2]?arguments[2]:{};if(r.isServer||!e.length)return;e=e.map(e=>e.toUpperCase());let{preventDefault:o=!0}=n,l=f(),s=v(),c=!1;(0,a.createEffect)((0,a.on)(s,n.requireReset?r=>{if(!r.length)return c=!1;if(c)return;let a=l();r.length<e.length?m(r,e.slice(0,r.length))?o&&a&&a.preventDefault():c=!0:(c=!0,m(r,e)&&(o&&a&&a.preventDefault(),t(a)))}:r=>{let a=r.at(-1);if(!a)return;let n=l();if(o&&a.length<e.length){i(a,e.slice(0,e.length-1))&&n&&n.preventDefault();return}if(i(a,e)){let a=r.at(-2);(!a||i(a,e.slice(0,e.length-1)))&&(o&&n&&n.preventDefault(),t(n))}}))}(e,()=>{k()})});let{theme:C}=L();return(0,a.createComponent)(y.ThemeContextProvider,{get theme(){return C()},get children(){return(0,a.createComponent)(r.Portal,{get mount(){return(u().pipWindow??window).document.body},get children(){var w=to();return(0,r.use)(d,w),(0,r.setAttribute)(w,"data-testid",t.TANSTACK_DEVTOOLS),(0,r.insert)(w,(0,a.createComponent)(a.Show,{get when(){return!!(0,r.memo)(()=>null!==u().pipWindow)()||!(0,r.memo)(()=>!!n().requireUrlFlag)()||window.location.search.includes(n().urlFlag)},get children(){return[(0,a.createComponent)(_,{isOpen:g,setIsOpen:k}),(0,a.createComponent)(et,{isResizing:h,isOpen:g,get children(){return(0,a.createComponent)(ea,{ref:t=>e=t,handleDragStart:t=>((e,t)=>{if(0!==t.button||!e)return;b(!0);let r={originalHeight:e.getBoundingClientRect().height,pageY:t.pageY},a=e=>{let t=r.pageY-e.pageY,a="bottom"===n().panelLocation?r.originalHeight+t:r.originalHeight-t;o(a),a<70?p(!1):p(!0)},i=()=>{b(!1),document.removeEventListener("mousemove",a),document.removeEventListener("mouseUp",i)};document.addEventListener("mousemove",a),document.addEventListener("mouseup",i)})(e,t),get children(){return[(0,a.createComponent)(te,{toggleOpen:k}),(0,a.createComponent)(tr,{})]}})}})]}}),null),(0,r.insert)(w,(0,a.createComponent)(tn,{}),null),w}})}})}e.s(["default",()=>ti],432299)}]);