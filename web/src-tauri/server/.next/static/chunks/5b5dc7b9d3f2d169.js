(globalThis.TURBOPACK||(globalThis.TURBOPACK=[])).push(["object"==typeof document?document.currentScript:void 0,992457,e=>{"use strict";var t=e.i(574788),r=e.i(766932),i=e.i(278322),o=e.i(7284),n=e.i(419695),a=e.i(596190),l=(0,r.template)("<span>"),s=(0,r.template)("<span>&quot;<!>&quot;: "),d=(0,r.template)("<span>&quot;<!>&quot;"),c=(0,r.template)("<span>null"),p=(0,r.template)("<span>undefined"),u=(0,r.template)("<div>"),f=(0,r.template)("<span>,"),g=(0,r.template)("<span><span>[]"),h=(0,r.template)("<span>..."),m=(0,r.template)("<span><span>[</span><span>]"),b=(0,r.template)("<span>&quot;<!>&quot;: <span> items"),v=(0,r.template)("<span><span>{}"),x=(0,r.template)("<span><span>{</span><span>}"),C=(0,r.template)('<button title="Copy object to clipboard">'),y=(0,r.template)('<span><svg width=16 height=16 viewBox="0 0 16 16"fill=none xmlns=http://www.w3.org/2000/svg><path d="M6 12L10 8L6 4"stroke-width=2 stroke-linecap=round stroke-linejoin=round>');function k(e){return(0,t.createComponent)(w,{isRoot:!0,get value(){return e.value},get copyable(){return e.copyable},depth:0,get defaultExpansionDepth(){return e.defaultExpansionDepth??1},path:"",get collapsePaths(){return e.collapsePaths}})}function w(e){var a,g,h,m;let b=(0,n.useStyles)();return a=l(),(0,r.insert)(a,(g=(0,r.memo)(()=>!!(e.keyName&&"object"!=typeof e.value&&!Array.isArray(e.value))),()=>{var t,o;return g()&&((o=(t=s()).firstChild.nextSibling).nextSibling,(0,r.insert)(t,()=>e.keyName,o),(0,i.effect)(()=>(0,r.className)(t,b().tree.valueKey)),t)}),null),(0,r.insert)(a,()=>{var o,n,a,s,u,f,g;return"string"==typeof e.value?((n=(o=d()).firstChild.nextSibling).nextSibling,(0,r.insert)(o,()=>e.value,n),(0,i.effect)(()=>(0,r.className)(o,b().tree.valueString)),o):"number"==typeof e.value?(a=l(),(0,r.insert)(a,()=>e.value),(0,i.effect)(()=>(0,r.className)(a,b().tree.valueNumber)),a):"boolean"==typeof e.value?(s=l(),(0,r.insert)(s,()=>String(e.value)),(0,i.effect)(()=>(0,r.className)(s,b().tree.valueBoolean)),s):null===e.value?(u=c(),(0,i.effect)(()=>(0,r.className)(u,b().tree.valueNull)),u):void 0===e.value?(f=p(),(0,i.effect)(()=>(0,r.className)(f,b().tree.valueNull)),f):"function"==typeof e.value?(g=l(),(0,r.insert)(g,()=>String(e.value)),(0,i.effect)(()=>(0,r.className)(g,b().tree.valueFunction)),g):Array.isArray(e.value)?(0,t.createComponent)($,{get defaultExpansionDepth(){return e.defaultExpansionDepth},get depth(){return e.depth},get copyable(){return e.copyable},get keyName(){return e.keyName},get value(){return e.value},get collapsePaths(){return e.collapsePaths},get path(){return e.path}}):"object"==typeof e.value?(0,t.createComponent)(S,{get defaultExpansionDepth(){return e.defaultExpansionDepth},get depth(){return e.depth},get copyable(){return e.copyable},get keyName(){return e.keyName},get value(){return e.value},get collapsePaths(){return e.collapsePaths},get path(){return e.path}}):l()},null),(0,r.insert)(a,(h=(0,r.memo)(()=>!!e.copyable),()=>{var n;return h()&&(n=u(),(0,r.insert)(n,(0,t.createComponent)(A,{get value(){return e.value}})),(0,i.effect)(()=>(0,r.className)(n,(0,o.default)(b().tree.actions,"actions"))),n)}),null),(0,r.insert)(a,(m=(0,r.memo)(()=>!!(e.isLastKey||e.isRoot)),()=>m()?"":f()),null),(0,i.effect)(()=>(0,r.className)(a,b().tree.valueContainer(e.isRoot??!1))),a}let $=e=>{var a,d,c,p,u,f,v;let x=(0,n.useStyles)(),[C,y]=(0,t.createSignal)(e.depth<=e.defaultExpansionDepth&&!e.collapsePaths?.includes(e.path));return 0===e.value.length?(d=(a=g()).firstChild,(0,r.insert)(a,(c=(0,r.memo)(()=>!!e.keyName),()=>{var t,n;return c()&&((n=(t=s()).firstChild.nextSibling).nextSibling,(0,r.insert)(t,()=>e.keyName,n),(0,i.effect)(()=>(0,r.className)(t,(0,o.default)(x().tree.valueKey,x().tree.collapsible))),t)}),d),(0,i.effect)(e=>{var t=x().tree.expanderContainer,i=x().tree.valueBraces;return t!==e.e&&(0,r.className)(a,e.e=t),i!==e.t&&(0,r.className)(d,e.t=i),e},{e:void 0,t:void 0}),a):(f=(u=(p=m()).firstChild).nextSibling,(0,r.insert)(p,(0,t.createComponent)(F,{onClick:()=>y(!C()),get expanded(){return C()}}),u),(0,r.insert)(p,(v=(0,r.memo)(()=>!!e.keyName),()=>{var t,n,a,l;return v()&&(l=(a=(n=(t=b()).firstChild.nextSibling).nextSibling.nextSibling).firstChild,t.$$click=e=>{e.stopPropagation(),e.stopImmediatePropagation(),y(!C())},(0,r.insert)(t,()=>e.keyName,n),(0,r.insert)(a,()=>e.value.length,l),(0,i.effect)(e=>{var i=(0,o.default)(x().tree.valueKey,x().tree.collapsible),n=x().tree.info;return i!==e.e&&(0,r.className)(t,e.e=i),n!==e.t&&(0,r.className)(a,e.t=n),e},{e:void 0,t:void 0}),t)}),u),(0,r.insert)(p,(0,t.createComponent)(t.Show,{get when(){return C()},get children(){var k=l();return(0,r.insert)(k,(0,t.createComponent)(t.For,{get each(){return e.value},children:(i,o)=>{let n=o()===e.value.length-1;return(0,t.createComponent)(w,{get copyable(){return e.copyable},value:i,isLastKey:n,get defaultExpansionDepth(){return e.defaultExpansionDepth},get depth(){return e.depth+1},get collapsePaths(){return e.collapsePaths},get path(){return(0,r.memo)(()=>!!e.path)()?`${e.path}[${o()}]`:`[${o()}]`}})}})),(0,i.effect)(()=>(0,r.className)(k,x().tree.expandedLine(!!e.keyName))),k}}),f),(0,r.insert)(p,(0,t.createComponent)(t.Show,{get when(){return!C()},get children(){var $=h();return $.$$click=e=>{e.stopPropagation(),e.stopImmediatePropagation(),y(!C())},(0,i.effect)(()=>(0,r.className)($,(0,o.default)(x().tree.valueKey,x().tree.collapsible))),$}}),f),(0,i.effect)(e=>{var t=x().tree.expanderContainer,i=x().tree.valueBraces,o=x().tree.valueBraces;return t!==e.e&&(0,r.className)(p,e.e=t),i!==e.t&&(0,r.className)(u,e.t=i),o!==e.a&&(0,r.className)(f,e.a=o),e},{e:void 0,t:void 0,a:void 0}),p)},S=e=>{var a,d,c,p,u,f,g,m;let C=(0,n.useStyles)(),[y,k]=(0,t.createSignal)(e.depth<=e.defaultExpansionDepth&&!e.collapsePaths?.includes(e.path)),$=Object.keys(e.value),S=$[$.length-1];return 0===$.length?(d=(a=v()).firstChild,(0,r.insert)(a,(c=(0,r.memo)(()=>!!e.keyName),()=>{var t,n;return c()&&((n=(t=s()).firstChild.nextSibling).nextSibling,(0,r.insert)(t,()=>e.keyName,n),(0,i.effect)(()=>(0,r.className)(t,(0,o.default)(C().tree.valueKey,C().tree.collapsible))),t)}),d),(0,i.effect)(e=>{var t=C().tree.expanderContainer,i=C().tree.valueBraces;return t!==e.e&&(0,r.className)(a,e.e=t),i!==e.t&&(0,r.className)(d,e.t=i),e},{e:void 0,t:void 0}),a):(f=(u=(p=x()).firstChild).nextSibling,(0,r.insert)(p,(g=(0,r.memo)(()=>!!e.keyName),()=>g()&&(0,t.createComponent)(F,{onClick:()=>k(!y()),get expanded(){return y()}})),u),(0,r.insert)(p,(m=(0,r.memo)(()=>!!e.keyName),()=>{var t,n,a,l;return m()&&(l=(a=(n=(t=b()).firstChild.nextSibling).nextSibling.nextSibling).firstChild,t.$$click=e=>{e.stopPropagation(),e.stopImmediatePropagation(),k(!y())},(0,r.insert)(t,()=>e.keyName,n),(0,r.insert)(a,()=>$.length,l),(0,i.effect)(e=>{var i=(0,o.default)(C().tree.valueKey,C().tree.collapsible),n=C().tree.info;return i!==e.e&&(0,r.className)(t,e.e=i),n!==e.t&&(0,r.className)(a,e.t=n),e},{e:void 0,t:void 0}),t)}),u),(0,r.insert)(p,(0,t.createComponent)(t.Show,{get when(){return y()},get children(){var A=l();return(0,r.insert)(A,(0,t.createComponent)(t.For,{each:$,children:r=>(0,t.createComponent)(w,{get value(){return e.value[r]},keyName:r,isLastKey:S===r,get copyable(){return e.copyable},get defaultExpansionDepth(){return e.defaultExpansionDepth},get depth(){return e.depth+1},get collapsePaths(){return e.collapsePaths},get path(){return`${e.path}${e.path?".":""}${r}`}})})),(0,i.effect)(()=>(0,r.className)(A,C().tree.expandedLine(!!e.keyName))),A}}),f),(0,r.insert)(p,(0,t.createComponent)(t.Show,{get when(){return!y()},get children(){var M=h();return M.$$click=e=>{e.stopPropagation(),e.stopImmediatePropagation(),k(!y())},(0,i.effect)(()=>(0,r.className)(M,(0,o.default)(C().tree.valueKey,C().tree.collapsible))),M}}),f),(0,i.effect)(e=>{var t=C().tree.expanderContainer,i=C().tree.valueBraces,o=C().tree.valueBraces;return t!==e.e&&(0,r.className)(p,e.e=t),i!==e.t&&(0,r.className)(u,e.t=i),o!==e.a&&(0,r.className)(f,e.a=o),e},{e:void 0,t:void 0,a:void 0}),p)},A=e=>{var o;let l=(0,n.useStyles)(),[s,d]=(0,t.createSignal)("NoCopy");return o=C(),(0,r.addEventListener)(o,"click","NoCopy"===s()?()=>{navigator.clipboard.writeText(JSON.stringify(e.value,null,2)).then(()=>{d("SuccessCopy"),setTimeout(()=>{d("NoCopy")},1500)},e=>{console.error("Failed to copy: ",e),d("ErrorCopy"),setTimeout(()=>{d("NoCopy")},1500)})}:void 0,!0),(0,r.insert)(o,(0,t.createComponent)(t.Switch,{get children(){return[(0,t.createComponent)(t.Match,{get when(){return"NoCopy"===s()},get children(){return(0,t.createComponent)(a.Copier,{})}}),(0,t.createComponent)(t.Match,{get when(){return"SuccessCopy"===s()},get children(){return(0,t.createComponent)(a.CopiedCopier,{theme:"dark"})}}),(0,t.createComponent)(t.Match,{get when(){return"ErrorCopy"===s()},get children(){return(0,t.createComponent)(a.ErrorCopier,{})}})]}})),(0,i.effect)(e=>{var t=l().tree.actionButton,i=`${"NoCopy"===s()?"Copy object to clipboard":"SuccessCopy"===s()?"Object copied to clipboard":"Error copying object to clipboard"}`;return t!==e.e&&(0,r.className)(o,e.e=t),i!==e.t&&(0,r.setAttribute)(o,"aria-label",e.t=i),e},{e:void 0,t:void 0}),o},F=e=>{var t;let a=(0,n.useStyles)();return t=y(),(0,r.addEventListener)(t,"click",e.onClick,!0),(0,i.effect)(()=>(0,r.className)(t,(0,o.default)(a().tree.expander,n.css`
          transform: rotate(${90*!!e.expanded}deg);
        `,e.expanded&&n.css`
            & svg {
              top: -1px;
            }
          `))),t};(0,r.delegateEvents)(["click"]),e.s(["JsonTree",()=>k])},949936,e=>{"use strict";var t=e.i(766932),r=e.i(574788),i=e.i(278322),o=e.i(7284),n=e.i(419695),a=(0,t.template)("<header>"),l=(0,t.template)("<div><button><span>TANSTACK</span><span>");function s(e){var i;let{children:l,class:s,...d}=e,c=(0,n.useStyles)();return i=a(),(0,t.spread)(i,(0,r.mergeProps)({get class(){return(0,o.default)(c().header.row,"tsqd-header",s)}},d),!1,!0),(0,t.insert)(i,l),i}function d(e){var r,a,s,d;let{children:c,flavor:p,onClick:u}=e,f=(0,n.useStyles)();return d=(s=(a=(r=l()).firstChild).firstChild).nextSibling,(0,t.addEventListener)(a,"click",u,!0),(0,t.insert)(d,c),(0,i.effect)(e=>{var i=f().header.logoAndToggleContainer,n=(0,o.default)(f().header.logo),l=(0,o.default)(f().header.tanstackLogo),c=(0,o.default)(f().header.flavorLogo(p.light,p.dark));return i!==e.e&&(0,t.className)(r,e.e=i),n!==e.t&&(0,t.className)(a,e.t=n),l!==e.a&&(0,t.className)(s,e.a=l),c!==e.o&&(0,t.className)(d,e.o=c),e},{e:void 0,t:void 0,a:void 0,o:void 0}),r}(0,t.delegateEvents)(["click"]),e.s(["Header",()=>s,"HeaderLogo",()=>d])},278322,e=>{"use strict";var t=e.i(574788);e.s(["effect",()=>t.createRenderEffect])},739604,e=>{"use strict";let t={data:""},r=/(?:([\u0080-\uFFFF\w-%@]+) *:? *([^{;]+?);|([^;}{]*?) *{)|(}\s*)/g,i=/\/\*[^]*?\*\/|  +/g,o=/\n+/g,n=(e,t)=>{let r="",i="",o="";for(let a in e){let l=e[a];"@"==a[0]?"i"==a[1]?r=a+" "+l+";":i+="f"==a[1]?n(l,a):a+"{"+n(l,"k"==a[1]?"":t)+"}":"object"==typeof l?i+=n(l,t?t.replace(/([^,])+/g,e=>a.replace(/([^,]*:\S+\([^)]*\))|([^,])+/g,t=>/&/.test(t)?t.replace(/&/g,e):e?e+" "+t:t)):a):null!=l&&(a=/^--/.test(a)?a:a.replace(/[A-Z]/g,"-$&").toLowerCase(),o+=n.p?n.p(a,l):a+":"+l+";")}return r+(t&&o?t+"{"+o+"}":o)+i},a={},l=e=>{if("object"==typeof e){let t="";for(let r in e)t+=r+l(e[r]);return t}return e};function s(e){let s,d,c=this||{},p=e.call?e(c.p):e;return((e,t,s,d,c)=>{var p;let u=l(e),f=a[u]||(a[u]=(e=>{let t=0,r=11;for(;t<e.length;)r=101*r+e.charCodeAt(t++)>>>0;return"go"+r})(u));if(!a[f]){let t=u!==e?e:(e=>{let t,n,a=[{}];for(;t=r.exec(e.replace(i,""));)t[4]?a.shift():t[3]?(n=t[3].replace(o," ").trim(),a.unshift(a[0][n]=a[0][n]||{})):a[0][t[1]]=t[2].replace(o," ").trim();return a[0]})(e);a[f]=n(c?{["@keyframes "+f]:t}:t,s?"":"."+f)}let g=s&&a.g?a.g:null;return s&&(a.g=a[f]),p=a[f],g?t.data=t.data.replace(g,p):-1===t.data.indexOf(p)&&(t.data=d?p+t.data:t.data+p),f})(p.unshift?p.raw?(s=[].slice.call(arguments,1),d=c.p,p.reduce((e,t,r)=>{let i=s[r];if(i&&i.call){let e=i(d),t=e&&e.props&&e.props.className||/^go/.test(e)&&e;i=t?"."+t:e&&"object"==typeof e?e.props?"":n(e,""):!1===e?"":e}return e+t+(null==i?"":i)},"")):p.reduce((e,t)=>Object.assign(e,t&&t.call?t(c.p):t),{}):p,(e=>{if("object"==typeof window){let t=(e?e.querySelector("#_goober"):window._goober)||Object.assign(document.createElement("style"),{innerHTML:" ",id:"_goober"});return t.nonce=window.__nonce__,t.parentNode||(e||document.head).appendChild(t),t.firstChild}return e||t})(c.target),c.g,c.o,c.k)}s.bind({g:1}),s.bind({k:1}),e.s(["css",()=>s])},537261,e=>{"use strict";var t=e.i(574788);let r=(0,t.createContext)(void 0),i=e=>{let[i,o]=(0,t.createSignal)(e.theme);return(0,t.createEffect)(()=>{o(e.theme)}),(0,t.createComponent)(r.Provider,{value:{theme:i,setTheme:o},get children(){return e.children}})};function o(){let e=(0,t.useContext)(r);if(!e)throw Error("useTheme must be used within a ThemeContextProvider");return e}e.s(["ThemeContextProvider",()=>i,"useTheme",()=>o])},419695,e=>{"use strict";var t=e.i(739604),r=e.i(574788),i=e.i(537261);let o={colors:{inherit:"inherit",current:"currentColor",transparent:"transparent",black:"#000000",white:"#ffffff",neutral:{50:"#f9fafb",100:"#f2f4f7",200:"#eaecf0",300:"#d0d5dd",400:"#98a2b3",500:"#667085",600:"#475467",700:"#344054",800:"#1d2939",900:"#101828"},darkGray:{50:"#525c7a",100:"#49536e",200:"#414962",300:"#394056",400:"#313749",500:"#292e3d",600:"#212530",700:"#191c24",800:"#111318",900:"#0b0d10"},gray:{50:"#f9fafb",100:"#f2f4f7",200:"#eaecf0",300:"#d0d5dd",400:"#98a2b3",500:"#667085",600:"#475467",700:"#344054",800:"#1d2939",900:"#101828"},blue:{25:"#F5FAFF",50:"#EFF8FF",100:"#D1E9FF",200:"#B2DDFF",300:"#84CAFF",400:"#53B1FD",500:"#2E90FA",600:"#1570EF",700:"#175CD3",800:"#1849A9",900:"#194185"},green:{25:"#F6FEF9",50:"#ECFDF3",100:"#D1FADF",200:"#A6F4C5",300:"#6CE9A6",400:"#32D583",500:"#12B76A",600:"#039855",700:"#027A48",800:"#05603A",900:"#054F31"},red:{50:"#fef2f2",100:"#fee2e2",200:"#fecaca",300:"#fca5a5",400:"#f87171",500:"#ef4444",600:"#dc2626",700:"#b91c1c",800:"#991b1b",900:"#7f1d1d",950:"#450a0a"},yellow:{25:"#FFFCF5",50:"#FFFAEB",100:"#FEF0C7",200:"#FEDF89",300:"#FEC84B",400:"#FDB022",500:"#F79009",600:"#DC6803",700:"#B54708",800:"#93370D",900:"#7A2E0E"},purple:{25:"#FAFAFF",50:"#F4F3FF",100:"#EBE9FE",200:"#D9D6FE",300:"#BDB4FE",400:"#9B8AFB",500:"#7A5AF8",600:"#6938EF",700:"#5925DC",800:"#4A1FB8",900:"#3E1C96"},teal:{25:"#F6FEFC",50:"#F0FDF9",100:"#CCFBEF",200:"#99F6E0",300:"#5FE9D0",400:"#2ED3B7",500:"#15B79E",600:"#0E9384",700:"#107569",800:"#125D56",900:"#134E48"},pink:{25:"#fdf2f8",50:"#fce7f3",100:"#fbcfe8",200:"#f9a8d4",300:"#f472b6",400:"#ec4899",500:"#db2777",600:"#be185d",700:"#9d174d",800:"#831843",900:"#500724"},cyan:{25:"#ecfeff",50:"#cffafe",100:"#a5f3fc",200:"#67e8f9",300:"#22d3ee",400:"#06b6d4",500:"#0891b2",600:"#0e7490",700:"#155e75",800:"#164e63",900:"#083344"}},font:{size:{xs:"calc(var(--tsrd-font-size) * 0.75)",sm:"calc(var(--tsrd-font-size) * 0.875)",md:"var(--tsrd-font-size)"},lineHeight:{xs:"calc(var(--tsrd-font-size) * 1)"},weight:{medium:"500",semibold:"600",bold:"700"},fontFamily:{sans:"ui-sans-serif, Inter, system-ui, sans-serif, sans-serif",mono:"ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace"}},border:{radius:{xs:"calc(var(--tsrd-font-size) * 0.125)",sm:"calc(var(--tsrd-font-size) * 0.25)",full:"9999px"}},size:{.5:"calc(var(--tsrd-font-size) * 0.125)",1:"calc(var(--tsrd-font-size) * 0.25)",1.5:"calc(var(--tsrd-font-size) * 0.375)",2:"calc(var(--tsrd-font-size) * 0.5)",2.5:"calc(var(--tsrd-font-size) * 0.625)",3:"calc(var(--tsrd-font-size) * 0.75)",4.5:"calc(var(--tsrd-font-size) * 1.125)",6.5:"calc(var(--tsrd-font-size) * 1.625)",12:"calc(var(--tsrd-font-size) * 3)"}},n={primary:{bg:o.colors.gray[900],hover:o.colors.gray[800],active:o.colors.gray[700],text:"#fff",border:o.colors.gray[900]},secondary:{bg:o.colors.gray[100],hover:o.colors.gray[200],active:o.colors.gray[300],text:o.colors.gray[900],border:o.colors.gray[300]},info:{bg:o.colors.blue[500],hover:o.colors.blue[600],active:o.colors.blue[700],text:"#fff",border:o.colors.blue[500]},warning:{bg:o.colors.yellow[500],hover:o.colors.yellow[600],active:o.colors.yellow[700],text:"#fff",border:o.colors.yellow[500]},danger:{bg:o.colors.red[500],hover:o.colors.red[600],active:o.colors.red[700],text:"#fff",border:o.colors.red[500]},success:{bg:o.colors.green[500],hover:o.colors.green[600],active:o.colors.green[700],text:"#fff",border:o.colors.green[500]}},a=t.css,l=function(){let e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:"dark",{colors:t,font:r,size:i,border:l}=o,{fontFamily:s}=r,d=(t,r)=>"light"===e?t:r;return{logo:a`
      cursor: pointer;
      display: flex;
      flex-direction: column;
      background-color: transparent;
      border: none;
      width: ${i[12]};
      height: ${i[12]};
      font-family: ${s.sans};
      gap: ${o.size[.5]};
      padding: 0px;
      &:hover {
        opacity: 0.7;
      }
    `,selectWrapper:a`
      width: 100%;
      max-width: ${320}px;
      display: flex;
      flex-direction: column;
      gap: 0.375rem;
    `,selectContainer:a`
      width: 100%;
    `,selectLabel:a`
      font-size: 0.875rem;
      font-weight: 500;
      color: ${d(t.gray[900],t.gray[100])};
      text-align: left;
    `,selectDescription:a`
      font-size: 0.8rem;
      color: ${d(t.gray[500],t.gray[400])};
      margin: 0;
      line-height: 1.3;
      text-align: left;
    `,select:a`
      appearance: none;
      width: 100%;
      padding: 0.5rem 3rem 0.5rem 0.75rem;
      border-radius: 0.375rem;
      background-color: ${d(t.gray[50],t.darkGray[800])};
      color: ${d(t.gray[900],t.gray[100])};
      border: 1px solid ${d(t.gray[200],t.gray[800])};
      font-size: 0.875rem;
      transition: all 0.15s ease;
      cursor: pointer;

      /* Custom arrow */
      background-image: url("data:image/svg+xml;utf8,<svg fill='%236b7280' height='20' viewBox='0 0 24 24' width='20' xmlns='http://www.w3.org/2000/svg'><path d='M7 10l5 5 5-5z'/></svg>");
      background-repeat: no-repeat;
      background-position: right 0.75rem center;
      background-size: 1.25rem;

      &:hover {
        border-color: ${d(t.gray[300],t.gray[700])};
      }

      &:focus {
        outline: none;
        border-color: ${t.gray[400]};
        box-shadow: 0 0 0 3px ${d(t.gray[200],t.gray[800])};
      }
    `,inputWrapper:a`
      width: 100%;
      max-width: ${320}px;
      display: flex;
      flex-direction: column;
      gap: 0.375rem;
    `,inputContainer:a`
      width: 100%;
    `,inputLabel:a`
      font-size: 0.875rem;
      font-weight: 500;
      color: ${d(t.gray[900],t.gray[100])};
      text-align: left;
    `,inputDescription:a`
      font-size: 0.8rem;
      color: ${d(t.gray[500],t.gray[400])};
      margin: 0;
      line-height: 1.3;
      text-align: left;
    `,input:a`
      appearance: none;
      box-sizing: border-box;
      width: 100%;
      padding: 0.5rem 0.75rem;
      border-radius: 0.375rem;
      background-color: ${d(t.gray[50],t.darkGray[800])};
      color: ${d(t.gray[900],t.gray[100])};
      border: 1px solid ${d(t.gray[200],t.gray[800])};
      font-size: 0.875rem;
      font-family: ${s.mono};
      transition: all 0.15s ease;

      &::placeholder {
        color: ${d(t.gray[400],t.gray[500])};
      }

      &:hover {
        border-color: ${d(t.gray[300],t.gray[700])};
      }

      &:focus {
        outline: none;
        border-color: ${d(t.gray[400],t.gray[600])};
        box-shadow: 0 0 0 3px ${d(t.gray[200],t.gray[800])};
      }
    `,checkboxWrapper:a`
      display: flex;
      align-items: flex-start;
      gap: 0.75rem;
      cursor: pointer;
      user-select: none;
      padding: 0.375rem;
      border-radius: 0.375rem;
      transition: background-color 0.15s ease;

      &:hover {
        background-color: ${d(t.gray[50],t.darkGray[900])};
      }
    `,checkboxContainer:a`
      width: 100%;
    `,checkboxLabelContainer:a`
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
      flex: 1;
    `,checkbox:a`
      appearance: none;
      width: 1.25rem;
      height: 1.25rem;
      border: 2px solid ${d(t.gray[300],t.gray[700])};
      border-radius: 0.25rem;
      background-color: ${d(t.gray[50],t.darkGray[800])};
      display: grid;
      place-items: center;
      transition: all 0.15s ease;
      flex-shrink: 0;
      margin-top: 0.125rem;

      &:hover {
        border-color: ${d(t.gray[400],t.gray[600])};
      }

      &:checked {
        background-color: ${d(t.gray[900],t.gray[100])};
        border-color: ${d(t.gray[900],t.gray[100])};
      }

      &:checked::after {
        content: '';
        width: 0.4rem;
        height: 0.6rem;
        border: solid ${d("#fff",t.gray[900])};
        border-width: 0 2px 2px 0;
        transform: rotate(45deg);
        margin-top: -3px;
      }
    `,checkboxLabel:a`
      color: ${d(t.gray[900],t.gray[100])};
      font-size: 0.875rem;
      font-weight: 500;
      line-height: 1.4;
      text-align: left;
    `,checkboxDescription:a`
      color: ${d(t.gray[500],t.gray[400])};
      font-size: 0.8rem;
      line-height: 1.3;
      text-align: left;
    `,button:{base:a`
        display: inline-flex;
        align-items: center;
        justify-content: center;
        font-family: ${o.font.fontFamily.sans};
        font-size: 0.8rem;
        font-weight: 500;
        border-radius: 0.375rem;
        padding: 0.375rem 0.75rem;
        cursor: pointer;
        transition:
          background 0.15s,
          color 0.15s,
          border 0.15s,
          box-shadow 0.15s;
        outline: none;
        border-width: 1px;
        border-style: solid;
      `,variant(e,r,i){let o=n[e];return i?a`
            background: transparent;
            color: ${d(o.bg,o.bg)};
            border-color: transparent;
            &:hover {
              background: ${d(t.gray[100],t.darkGray[800])};
            }
            &:active {
              background: ${d(t.gray[200],t.darkGray[700])};
            }
          `:r?a`
            background: transparent;
            color: ${d(o.bg,o.bg)};
            border-color: ${d(o.bg,o.bg)};
            &:hover {
              background: ${d(t.gray[50],t.darkGray[800])};
              border-color: ${d(o.hover,o.hover)};
            }
            &:active {
              background: ${d(t.gray[100],t.darkGray[700])};
              border-color: ${d(o.active,o.active)};
            }
          `:a`
          background: ${d(o.bg,o.bg)};
          color: ${d(o.text,o.text)};
          border-color: ${d(o.border,o.border)};
          &:hover {
            background: ${d(o.hover,o.hover)};
            border-color: ${d(o.hover,o.hover)};
          }
          &:active {
            background: ${d(o.active,o.active)};
            border-color: ${d(o.active,o.active)};
          }
        `}},tag:{dot:e=>a`
        width: ${o.size[1.5]};
        height: ${o.size[1.5]};
        border-radius: ${o.border.radius.full};
        background-color: ${d(o.colors[e][500],o.colors[e][500])};
      `,base:a`
        display: flex;
        gap: ${o.size[1.5]};
        box-sizing: border-box;
        height: ${o.size[6.5]};
        background: ${d(t.gray[50],t.darkGray[500])};
        color: ${d(t.gray[700],t.gray[300])};
        border-radius: ${o.border.radius.sm};
        font-size: ${r.size.sm};
        padding: ${o.size[1]};
        padding-left: ${o.size[1.5]};
        align-items: center;
        font-weight: ${r.weight.medium};
        border: ${d("1px solid "+t.gray[300],"1px solid transparent")};
        user-select: none;
        position: relative;
        &:focus-visible {
          outline-offset: 2px;
          outline: 2px solid ${d(t.blue[700],t.blue[800])};
        }
      `,label:a`
        font-size: ${r.size.xs};
      `,count:a`
        font-size: ${r.size.xs};
        padding: 0 5px;
        display: flex;
        align-items: center;
        justify-content: center;
        color: ${d(t.gray[500],t.gray[400])};
        background-color: ${d(t.gray[200],t.darkGray[300])};
        border-radius: 2px;
        font-variant-numeric: tabular-nums;
        height: ${o.size[4.5]};
      `},tree:{info:a`
        color: ${d(t.gray[500],t.gray[500])};
        font-size: ${r.size.xs};
        margin-right: ${i[1]};
      `,actionButton:a`
        background-color: transparent;
        color: ${d(t.gray[500],t.gray[500])};
        border: none;
        display: inline-flex;
        padding: 0px;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        width: ${i[3]};
        height: ${i[3]};
        position: relative;
        z-index: 1;

        &:hover svg {
          color: ${d(t.gray[600],t.gray[400])};
        }

        &:focus-visible {
          border-radius: ${l.radius.xs};
          outline: 2px solid ${d(t.blue[700],t.blue[800])};
          outline-offset: 2px;
        }
      `,expanderContainer:a`
        position: relative;
      `,expander:a`
        position: absolute;
        cursor: pointer;
        left: -16px;
        top: 3px;
        & path {
          stroke: ${d(t.blue[400],t.blue[300])};
        }
        & svg {
          width: ${i[3]};
          height: ${i[3]};
        }

        display: inline-flex;
        align-items: center;
        transition: all 0.1s ease;
      `,expandedLine:e=>a`
        display: block;
        padding-left: 0.75rem;
        margin-left: -0.7rem;
        ${e?`border-left: 1px solid ${d(t.blue[400],t.blue[300])};`:""}
      `,collapsible:a`
        cursor: pointer;
        transition: all 0.2s ease;
        &:hover {
          background-color: ${d(t.gray[100],t.darkGray[700])};
          border-radius: ${o.border.radius.sm};
          padding: 0 ${o.size[1]};
        }
      `,actions:a`
        display: inline-flex;
        margin-left: ${i[2]};
        gap: ${i[2]};
        align-items: center;
        & svg {
          height: 12px;
          width: 12px;
        }
      `,valueCollapsed:a`
        color: ${d(t.gray[500],t.gray[400])};
      `,valueFunction:a`
        color: ${d(t.cyan[500],t.cyan[400])};
      `,valueString:a`
        color: ${d(t.green[500],t.green[400])};
      `,valueNumber:a`
        color: ${d(t.yellow[500],t.yellow[400])};
      `,valueBoolean:a`
        color: ${d(t.pink[500],t.pink[400])};
      `,valueNull:a`
        color: ${d(t.gray[500],t.gray[400])};
        font-style: italic;
      `,valueKey:a`
        color: ${d(t.blue[400],t.blue[300])};
      `,valueBraces:a`
        color: ${t.gray[500]};
      `,valueContainer:e=>a`
        display: block;
        margin-left: ${e?"0":"1rem"};

        &:not(:hover) .actions {
          display: none;
        }

        &:hover .actions {
          display: inline-flex;
        }
      `},header:{row:a`
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: ${o.size[2]} ${o.size[2.5]};
        gap: ${o.size[2.5]};
        border-bottom: ${d(t.gray[300],t.darkGray[500])} 1px solid;
        align-items: center;
      `,logoAndToggleContainer:a`
        display: flex;
        gap: ${o.size[3]};
        align-items: center;
        & > button {
          padding: 0;
          background: transparent;
          border: none;
          display: flex;
          gap: ${i[.5]};
          flex-direction: column;
        }
      `,logo:a`
        cursor: pointer;
        display: flex;
        flex-direction: column;
        background-color: transparent;
        border: none;
        gap: ${o.size[.5]};
        padding: 0px;
        &:hover {
          opacity: 0.7;
        }
        &:focus-visible {
          outline-offset: 4px;
          border-radius: ${l.radius.xs};
          outline: 2px solid ${t.blue[800]};
        }
      `,tanstackLogo:a`
        font-size: ${r.size.md};
        font-weight: ${r.weight.bold};
        line-height: ${r.lineHeight.xs};
        white-space: nowrap;
        color: ${d(t.gray[700],t.gray[300])};
      `,flavorLogo:(e,t)=>a`
        font-weight: ${r.weight.semibold};
        font-size: ${r.size.xs};
        background: linear-gradient(to right, ${d(e,t)});
        background-clip: text;
        -webkit-background-clip: text;
        line-height: 1;
        -webkit-text-fill-color: transparent;
        white-space: nowrap;
      `},section:{main:a`
        margin-bottom: 1.5rem;
        padding: 1rem;
        background-color: ${d(t.gray[50],t.darkGray[800])};
        border: 1px solid ${d(t.gray[200],t.gray[800])};
        border-radius: 0.5rem;
        box-shadow: none;
      `,title:a`
        font-size: 1rem;
        font-weight: 600;
        color: ${d(t.gray[900],t.gray[100])};
        margin: 0 0 0.75rem 0;
        padding-bottom: 0.5rem;
        border-bottom: 1px solid ${d(t.gray[200],t.gray[800])};
        display: flex;
        align-items: center;
        gap: 0.5rem;
        text-align: left;
      `,icon:a`
        height: 18px;
        width: 18px;
        & > svg {
          height: 100%;
          width: 100%;
        }
        color: ${d(t.gray[700],t.gray[400])};
      `,description:a`
        color: ${d(t.gray[500],t.gray[400])};
        font-size: 0.8rem;
        margin: 0 0 1rem 0;
        line-height: 1.4;
        text-align: left;
      `},mainPanel:{panel:e=>a`
        padding: ${e?o.size[3]:0};
        background: ${d(t.gray[50],t.darkGray[700])};
        overflow-y: auto;
        height: 100%;
      `}}};function s(){let{theme:e}=(0,i.useTheme)(),[t,o]=(0,r.createSignal)(l(e()));return(0,r.createEffect)(()=>{o(l(e()))}),t}e.s(["css",()=>a,"useStyles",()=>s],419695)},596190,e=>{"use strict";var t=e.i(766932),r=e.i(278322),i=(0,t.template)('<svg width=24 height=24 viewBox="0 0 24 24"fill=none xmlns=http://www.w3.org/2000/svg><path class=copier d="M8 8V5.2C8 4.0799 8 3.51984 8.21799 3.09202C8.40973 2.71569 8.71569 2.40973 9.09202 2.21799C9.51984 2 10.0799 2 11.2 2H18.8C19.9201 2 20.4802 2 20.908 2.21799C21.2843 2.40973 21.5903 2.71569 21.782 3.09202C22 3.51984 22 4.0799 22 5.2V12.8C22 13.9201 22 14.4802 21.782 14.908C21.5903 15.2843 21.2843 15.5903 20.908 15.782C20.4802 16 19.9201 16 18.8 16H16M5.2 22H12.8C13.9201 22 14.4802 22 14.908 21.782C15.2843 21.5903 15.5903 21.2843 15.782 20.908C16 20.4802 16 19.9201 16 18.8V11.2C16 10.0799 16 9.51984 15.782 9.09202C15.5903 8.71569 15.2843 8.40973 14.908 8.21799C14.4802 8 13.9201 8 12.8 8H5.2C4.0799 8 3.51984 8 3.09202 8.21799C2.71569 8.40973 2.40973 8.71569 2.21799 9.09202C2 9.51984 2 10.0799 2 11.2V18.8C2 19.9201 2 20.4802 2.21799 20.908C2.40973 21.2843 2.71569 21.5903 3.09202 21.782C3.51984 22 4.07989 22 5.2 22Z"stroke-width=2 stroke-linecap=round stroke-linejoin=round stroke=currentColor>'),o=(0,t.template)('<svg xmlns=http://www.w3.org/2000/svg width=24 height=24 viewBox="0 0 24 24"fill=none stroke=currentColor stroke-width=2 stroke-linecap=round stroke-linejoin=round><path d="M8 6h10"></path><path d="M6 12h9"></path><path d="M11 18h7">'),n=(0,t.template)('<svg xmlns=http://www.w3.org/2000/svg width=24 height=24 viewBox="0 0 24 24"fill=none stroke=currentColor stroke-width=2 stroke-linecap=round stroke-linejoin=round class="lucide lucide-file-search2-icon lucide-file-search-2"><path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"></path><path d="M14 2v4a2 2 0 0 0 2 2h4"></path><circle cx=11.5 cy=14.5 r=2.5></circle><path d="M13.3 16.3 15 18">'),a=(0,t.template)('<svg xmlns=http://www.w3.org/2000/svg width=24 height=24 viewBox="0 0 24 24"fill=none stroke=currentColor stroke-width=2 stroke-linecap=round stroke-linejoin=round><path d="M12 20a8 8 0 1 0 0-16 8 8 0 0 0 0 16Z"></path><path d="M12 14a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z"></path><path d="M12 2v2"></path><path d="M12 22v-2"></path><path d="m17 20.66-1-1.73"></path><path d="M11 10.27 7 3.34"></path><path d="m20.66 17-1.73-1"></path><path d="m3.34 7 1.73 1"></path><path d="M14 12h8"></path><path d="M2 12h2"></path><path d="m20.66 7-1.73 1"></path><path d="m3.34 17 1.73-1"></path><path d="m17 3.34-1 1.73"></path><path d="m11 13.73-4 6.93">'),l=(0,t.template)('<svg xmlns=http://www.w3.org/2000/svg width=20 height=20 viewBox="0 0 24 24"fill=none stroke=currentColor stroke-width=2 stroke-linecap=round stroke-linejoin=round><path d="m10 9-3 3 3 3"></path><path d="m14 15 3-3-3-3"></path><path d="M2.992 16.342a2 2 0 0 1 .094 1.167l-1.065 3.29a1 1 0 0 0 1.236 1.168l3.413-.998a2 2 0 0 1 1.099.092 10 10 0 1 0-4.777-4.719">'),s=(0,t.template)('<svg xmlns=http://www.w3.org/2000/svg width=20 height=20 viewBox="0 0 24 24"fill=none stroke=currentColor stroke-width=2 stroke-linecap=round stroke-linejoin=round><path d="M10 8h.01"></path><path d="M12 12h.01"></path><path d="M14 8h.01"></path><path d="M16 12h.01"></path><path d="M18 8h.01"></path><path d="M6 8h.01"></path><path d="M7 16h10"></path><path d="M8 12h.01"></path><rect width=20 height=16 x=2 y=4 rx=2>'),d=(0,t.template)('<svg xmlns=http://www.w3.org/2000/svg width=20 height=20 viewBox="0 0 24 24"fill=none stroke=currentColor stroke-width=2 stroke-linecap=round stroke-linejoin=round><path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0"></path><circle cx=12 cy=10 r=3>'),c=(0,t.template)('<svg xmlns=http://www.w3.org/2000/svg width=20 height=20 viewBox="0 0 24 24"fill=none stroke=currentColor stroke-width=2 stroke-linecap=round stroke-linejoin=round><path d="M9 17H7A5 5 0 0 1 7 7h2"></path><path d="M15 7h2a5 5 0 1 1 0 10h-2"></path><line x1=8 x2=16 y1=12 y2=12>'),p=(0,t.template)('<svg xmlns=http://www.w3.org/2000/svg width=24 height=24 viewBox="0 0 24 24"fill=none stroke=currentColor stroke-width=2 stroke-linecap=round stroke-linejoin=round><path d="M18 6 6 18"></path><path d="m6 6 12 12">'),u=(0,t.template)('<svg width=20 height=20 viewBox="0 0 24 24"fill=none xmlns=http://www.w3.org/2000/svg><path d="M16.5 9.39999L7.5 4.20999M12 17.5L12 3M21 16V7.99999C20.9996 7.64926 20.9071 7.30481 20.7315 7.00116C20.556 6.69751 20.3037 6.44536 20 6.26999L13 2.26999C12.696 2.09446 12.3511 2.00204 12 2.00204C11.6489 2.00204 11.304 2.09446 11 2.26999L4 6.26999C3.69626 6.44536 3.44398 6.69751 3.26846 7.00116C3.09294 7.30481 3.00036 7.64926 3 7.99999V16C3.00036 16.3507 3.09294 16.6952 3.26846 16.9988C3.44398 17.3025 3.69626 17.5546 4 17.73L11 21.73C11.304 21.9055 11.6489 21.998 12 21.998C12.3511 21.998 12.696 21.9055 13 21.73L20 17.73C20.3037 17.5546 20.556 17.3025 20.7315 16.9988C20.9071 16.6952 20.9996 16.3507 21 16Z"stroke=currentColor stroke-width=2 stroke-linecap=round stroke-linejoin=round>'),f=(0,t.template)('<svg width=18 height=18 viewBox="0 0 24 24"fill=none xmlns=http://www.w3.org/2000/svg><path d="M22 11.08V12C21.9988 14.1564 21.3005 16.2547 20.0093 17.9818C18.7182 19.7088 16.9033 20.9725 14.8354 21.5839C12.7674 22.1953 10.5573 22.1219 8.53447 21.3746C6.51168 20.6273 4.78465 19.2461 3.61096 17.4371C2.43727 15.628 1.87979 13.4881 2.02168 11.3363C2.16356 9.18455 2.99721 7.13631 4.39828 5.49706C5.79935 3.85781 7.69279 2.71537 9.79619 2.24013C11.8996 1.76489 14.1003 1.98232 16.07 2.85999M22 4L12 14.01L9 11.01"stroke=currentColor stroke-width=2 stroke-linecap=round stroke-linejoin=round>'),g=(0,t.template)('<svg width=18 height=18 viewBox="0 0 24 24"fill=none xmlns=http://www.w3.org/2000/svg><path d="M15 9L9 15M9 9L15 15M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12Z"stroke=currentColor stroke-width=2 stroke-linecap=round stroke-linejoin=round>'),h=(0,t.template)('<svg width=20 height=20 viewBox="0 0 24 24"fill=none xmlns=http://www.w3.org/2000/svg><path d="M6 9L12 15L18 9"stroke=currentColor stroke-width=2 stroke-linecap=round stroke-linejoin=round>'),m=(0,t.template)('<svg width=18 height=18 viewBox="0 0 24 24"fill=none xmlns=http://www.w3.org/2000/svg><path d="M21 21L15 15M17 10C17 13.866 13.866 17 10 17C6.13401 17 3 13.866 3 10C3 6.13401 6.13401 3 10 3C13.866 3 17 6.13401 17 10Z"stroke=currentColor stroke-width=2 stroke-linecap=round stroke-linejoin=round>'),b=(0,t.template)('<svg width=12 height=12 viewBox="0 0 24 24"fill=none xmlns=http://www.w3.org/2000/svg><path d="M21 13V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H11M15 3H21M21 3V9M21 3L10 14"stroke=currentColor stroke-width=2 stroke-linecap=round stroke-linejoin=round>'),v=(0,t.template)('<svg width=20 height=20 viewBox="0 0 24 24"fill=none xmlns=http://www.w3.org/2000/svg><path d="M12 15C13.6569 15 15 13.6569 15 12C15 10.3431 13.6569 9 12 9C10.3431 9 9 10.3431 9 12C9 13.6569 10.3431 15 12 15Z"stroke=currentColor stroke-width=2 stroke-linecap=round stroke-linejoin=round></path><path d="M19.4 15C19.2669 15.3016 19.2272 15.6362 19.286 15.9606C19.3448 16.285 19.4995 16.5843 19.73 16.82L19.79 16.88C19.976 17.0657 20.1235 17.2863 20.2241 17.5291C20.3248 17.7719 20.3766 18.0322 20.3766 18.295C20.3766 18.5578 20.3248 18.8181 20.2241 19.0609C20.1235 19.3037 19.976 19.5243 19.79 19.71C19.6043 19.896 19.3837 20.0435 19.1409 20.1441C18.8981 20.2448 18.6378 20.2966 18.375 20.2966C18.1122 20.2966 17.8519 20.2448 17.6091 20.1441C17.3663 20.0435 17.1457 19.896 16.96 19.71L16.9 19.65C16.6643 19.4195 16.365 19.2648 16.0406 19.206C15.7162 19.1472 15.3816 19.1869 15.08 19.32C14.7842 19.4468 14.532 19.6572 14.3543 19.9255C14.1766 20.1938 14.0813 20.5082 14.08 20.83V21C14.08 21.5304 13.8693 22.0391 13.4942 22.4142C13.1191 22.7893 12.6104 23 12.08 23C11.5496 23 11.0409 22.7893 10.6658 22.4142C10.2907 22.0391 10.08 21.5304 10.08 21V20.91C10.0723 20.579 9.96512 20.258 9.77251 19.9887C9.5799 19.7194 9.31074 19.5143 9 19.4C8.69838 19.2669 8.36381 19.2272 8.03941 19.286C7.71502 19.3448 7.41568 19.4995 7.18 19.73L7.12 19.79C6.93425 19.976 6.71368 20.1235 6.47088 20.2241C6.22808 20.3248 5.96783 20.3766 5.705 20.3766C5.44217 20.3766 5.18192 20.3248 4.93912 20.2241C4.69632 20.1235 4.47575 19.976 4.29 19.79C4.10405 19.6043 3.95653 19.3837 3.85588 19.1409C3.75523 18.8981 3.70343 18.6378 3.70343 18.375C3.70343 18.1122 3.75523 17.8519 3.85588 17.6091C3.95653 17.3663 4.10405 17.1457 4.29 16.96L4.35 16.9C4.58054 16.6643 4.73519 16.365 4.794 16.0406C4.85282 15.7162 4.81312 15.3816 4.68 15.08C4.55324 14.7842 4.34276 14.532 4.07447 14.3543C3.80618 14.1766 3.49179 14.0813 3.17 14.08H3C2.46957 14.08 1.96086 13.8693 1.58579 13.4942C1.21071 13.1191 1 12.6104 1 12.08C1 11.5496 1.21071 11.0409 1.58579 10.6658C1.96086 10.2907 2.46957 10.08 3 10.08H3.09C3.42099 10.0723 3.742 9.96512 4.0113 9.77251C4.28059 9.5799 4.48572 9.31074 4.6 9C4.73312 8.69838 4.77282 8.36381 4.714 8.03941C4.65519 7.71502 4.50054 7.41568 4.27 7.18L4.21 7.12C4.02405 6.93425 3.87653 6.71368 3.77588 6.47088C3.67523 6.22808 3.62343 5.96783 3.62343 5.705C3.62343 5.44217 3.67523 5.18192 3.77588 4.93912C3.87653 4.69632 4.02405 4.47575 4.21 4.29C4.39575 4.10405 4.61632 3.95653 4.85912 3.85588C5.10192 3.75523 5.36217 3.70343 5.625 3.70343C5.88783 3.70343 6.14808 3.75523 6.39088 3.85588C6.63368 3.95653 6.85425 4.10405 7.04 4.29L7.1 4.35C7.33568 4.58054 7.63502 4.73519 7.95941 4.794C8.28381 4.85282 8.61838 4.81312 8.92 4.68H9C9.29577 4.55324 9.54802 4.34276 9.72569 4.07447C9.90337 3.80618 9.99872 3.49179 10 3.17V3C10 2.46957 10.2107 1.96086 10.5858 1.58579C10.9609 1.21071 11.4696 1 12 1C12.5304 1 13.0391 1.21071 13.4142 1.58579C13.7893 1.96086 14 2.46957 14 3V3.09C14.0013 3.41179 14.0966 3.72618 14.2743 3.99447C14.452 4.26276 14.7042 4.47324 15 4.6C15.3016 4.73312 15.6362 4.77282 15.9606 4.714C16.285 4.65519 16.5843 4.50054 16.82 4.27L16.88 4.21C17.0657 4.02405 17.2863 3.87653 17.5291 3.77588C17.7719 3.67523 18.0322 3.62343 18.295 3.62343C18.5578 3.62343 18.8181 3.67523 19.0609 3.77588C19.3037 3.87653 19.5243 4.02405 19.71 4.21C19.896 4.39575 20.0435 4.61632 20.1441 4.85912C20.2448 5.10192 20.2966 5.36217 20.2966 5.625C20.2966 5.88783 20.2448 6.14808 20.1441 6.39088C20.0435 6.63368 19.896 6.85425 19.71 7.04L19.65 7.1C19.4195 7.33568 19.2648 7.63502 19.206 7.95941C19.1472 8.28381 19.1869 8.61838 19.32 8.92V9C19.4468 9.29577 19.6572 9.54802 19.9255 9.72569C20.1938 9.90337 20.5082 9.99872 20.83 10H21C21.5304 10 22.0391 10.2107 22.4142 10.5858C22.7893 10.9609 23 11.4696 23 12C23 12.5304 22.7893 13.0391 22.4142 13.4142C22.0391 13.7893 21.5304 14 21 14H20.91C20.5882 14.0013 20.2738 14.0966 20.0055 14.2743C19.7372 14.452 19.5268 14.7042 19.4 15Z"stroke=currentColor stroke-width=2 stroke-linecap=round stroke-linejoin=round>'),x=(0,t.template)('<svg width=20 height=20 viewBox="0 0 24 24"fill=none xmlns=http://www.w3.org/2000/svg><path d="M18 6L6 18M6 6L18 18"stroke=currentColor stroke-width=2 stroke-linecap=round stroke-linejoin=round>'),C=(0,t.template)('<svg xmlns=http://www.w3.org/2000/svg width=24 height=24 viewBox="0 0 24 24"fill=none stroke=currentColor stroke-width=2 stroke-linecap=round stroke-linejoin=round><path d="M2 10h6V4"></path><path d="m2 4 6 6"></path><path d="M21 10V7a2 2 0 0 0-2-2h-7"></path><path d="M3 14v2a2 2 0 0 0 2 2h3"></path><rect x=12 y=14 width=10 height=7 rx=1>'),y=(0,t.template)('<svg width=24 height=24 viewBox="0 0 24 24"fill=none xmlns=http://www.w3.org/2000/svg><path d="M7.5 12L10.5 15L16.5 9M7.8 21H16.2C17.8802 21 18.7202 21 19.362 20.673C19.9265 20.3854 20.3854 19.9265 20.673 19.362C21 18.7202 21 17.8802 21 16.2V7.8C21 6.11984 21 5.27976 20.673 4.63803C20.3854 4.07354 19.9265 3.6146 19.362 3.32698C18.7202 3 17.8802 3 16.2 3H7.8C6.11984 3 5.27976 3 4.63803 3.32698C4.07354 3.6146 3.6146 4.07354 3.32698 4.63803C3 5.27976 3 6.11984 3 7.8V16.2C3 17.8802 3 18.7202 3.32698 19.362C3.6146 19.9265 4.07354 20.3854 4.63803 20.673C5.27976 21 6.11984 21 7.8 21Z"stroke-width=2 stroke-linecap=round stroke-linejoin=round>'),k=(0,t.template)('<svg width=24 height=24 viewBox="0 0 24 24"fill=none xmlns=http://www.w3.org/2000/svg><path d="M9 9L15 15M15 9L9 15M7.8 21H16.2C17.8802 21 18.7202 21 19.362 20.673C19.9265 20.3854 20.3854 19.9265 20.673 19.362C21 18.7202 21 17.8802 21 16.2V7.8C21 6.11984 21 5.27976 20.673 4.63803C20.3854 4.07354 19.9265 3.6146 19.362 3.32698C18.7202 3 17.8802 3 16.2 3H7.8C6.11984 3 5.27976 3 4.63803 3.32698C4.07354 3.6146 3.6146 4.07354 3.32698 4.63803C3 5.27976 3 6.11984 3 7.8V16.2C3 17.8802 3 18.7202 3.32698 19.362C3.6146 19.9265 4.07354 20.3854 4.63803 20.673C5.27976 21 6.11984 21 7.8 21Z"stroke=#F04438 stroke-width=2 stroke-linecap=round stroke-linejoin=round>');function w(){return i()}function $(){return o()}function S(){return n()}function A(){return a()}function F(){return l()}function M(){return s()}function N(){return d()}function U(){return l()}function z(){return c()}function L(){return p()}function E(){return u()}function B(){return f()}function G(){return g()}function j(){return h()}function D(){return m()}function T(){return b()}function O(){return v()}function P(){return x()}function I(){return C()}function H(e){var i,o;return o=(i=y()).firstChild,(0,r.effect)(()=>(0,t.setAttribute)(o,"stroke","dark"===e.theme?"#12B76A":"#027A48")),i}function V(){return k()}e.s(["CheckCircleIcon",()=>B,"ChevronDownIcon",()=>j,"CloseIcon",()=>P,"Cogs",()=>A,"CopiedCopier",()=>H,"Copier",()=>w,"ErrorCopier",()=>V,"ExternalLinkIcon",()=>T,"GeoTag",()=>N,"Keyboard",()=>M,"Link",()=>z,"List",()=>$,"PackageIcon",()=>E,"PageSearch",()=>S,"PiP",()=>I,"SearchIcon",()=>D,"SettingsCog",()=>F,"SettingsIcon",()=>O,"SocialBubble",()=>U,"X",()=>L,"XCircleIcon",()=>G])},492859,e=>{"use strict";var t=e.i(766932),r=e.i(278322),i=e.i(7284),o=e.i(419695),n=(0,t.template)("<div>");let a=e=>{var a;let{className:l,children:s,class:d,withPadding:c}=e,p=(0,o.useStyles)();return a=n(),(0,t.insert)(a,s),(0,r.effect)(()=>(0,t.className)(a,(0,i.default)(p().mainPanel.panel(!!c),l,d))),a};e.s(["MainPanel",()=>a])},500983,e=>{"use strict";var t=e.i(766932),r=e.i(278322),i=e.i(574788),o=e.i(419695),n=(0,t.template)("<div><label><input type=checkbox><div>"),a=(0,t.template)("<span>");function l(e){var l,s,d,c,p,u;let f=(0,o.useStyles)(),[g,h]=(0,i.createSignal)(e.checked||!1);return c=(d=(s=(l=n()).firstChild).firstChild).nextSibling,d.$$input=t=>{let r=t.target.checked;h(r),e.onChange?.(r)},(0,t.insert)(c,(p=(0,t.memo)(()=>!!e.label),()=>{var i;return p()&&(i=a(),(0,t.insert)(i,()=>e.label),(0,r.effect)(()=>(0,t.className)(i,f().checkboxLabel)),i)}),null),(0,t.insert)(c,(u=(0,t.memo)(()=>!!e.description),()=>{var i;return u()&&(i=a(),(0,t.insert)(i,()=>e.description),(0,r.effect)(()=>(0,t.className)(i,f().checkboxDescription)),i)}),null),(0,r.effect)(e=>{var r=f().checkboxContainer,i=f().checkboxWrapper,o=f().checkbox,n=f().checkboxLabelContainer;return r!==e.e&&(0,t.className)(l,e.e=r),i!==e.t&&(0,t.className)(s,e.t=i),o!==e.a&&(0,t.className)(d,e.a=o),n!==e.o&&(0,t.className)(c,e.o=n),e},{e:void 0,t:void 0,a:void 0,o:void 0}),(0,r.effect)(()=>d.checked=g()),l}(0,t.delegateEvents)(["input"]),e.s(["Checkbox",()=>l])},634776,e=>{"use strict";var t=e.i(766932),r=e.i(278322),i=e.i(574788),o=e.i(419695),n=(0,t.template)("<div><div><input>"),a=(0,t.template)("<label>"),l=(0,t.template)("<p>");function s(e){var s,d,c,p,u;let f=(0,o.useStyles)(),[g,h]=(0,i.createSignal)(e.value||"");return c=(d=(s=n()).firstChild).firstChild,(0,t.insert)(d,(p=(0,t.memo)(()=>!!e.label),()=>{var i;return p()&&(i=a(),(0,t.insert)(i,()=>e.label),(0,r.effect)(()=>(0,t.className)(i,f().inputLabel)),i)}),c),(0,t.insert)(d,(u=(0,t.memo)(()=>!!e.description),()=>{var i;return u()&&(i=l(),(0,t.insert)(i,()=>e.description),(0,r.effect)(()=>(0,t.className)(i,f().inputDescription)),i)}),c),c.$$input=t=>{let r=t.target.value;h(e=>e!==r?r:e),e.onChange?.(r)},(0,r.effect)(r=>{var i=f().inputContainer,o=f().inputWrapper,n=e.type||"text",a=f().input,l=e.placeholder;return i!==r.e&&(0,t.className)(s,r.e=i),o!==r.t&&(0,t.className)(d,r.t=o),n!==r.a&&(0,t.setAttribute)(c,"type",r.a=n),a!==r.o&&(0,t.className)(c,r.o=a),l!==r.i&&(0,t.setAttribute)(c,"placeholder",r.i=l),r},{e:void 0,t:void 0,a:void 0,o:void 0,i:void 0}),(0,r.effect)(()=>c.value=g()),s}(0,t.delegateEvents)(["input"]),e.s(["Input",()=>s])},548755,e=>{"use strict";var t=e.i(766932),r=e.i(278322),i=e.i(574788),o=e.i(419695),n=(0,t.template)("<div><div><select>"),a=(0,t.template)("<label>"),l=(0,t.template)("<p>"),s=(0,t.template)("<option>");function d(e){var d,c,p,u,f;let g=(0,o.useStyles)(),[h,m]=(0,i.createSignal)(e.value||e.options[0]?.value);return p=(c=(d=n()).firstChild).firstChild,(0,t.insert)(c,(u=(0,t.memo)(()=>!!e.label),()=>{var i;return u()&&(i=a(),(0,t.insert)(i,()=>e.label),(0,r.effect)(()=>(0,t.className)(i,g().selectLabel)),i)}),p),(0,t.insert)(c,(f=(0,t.memo)(()=>!!e.description),()=>{var i;return f()&&(i=l(),(0,t.insert)(i,()=>e.description),(0,r.effect)(()=>(0,t.className)(i,g().selectDescription)),i)}),p),p.$$input=t=>{let r=t.target.value;m(e=>e!==r?r:e),e.onChange?.(r)},(0,t.insert)(p,()=>e.options.map(e=>{var i;return i=s(),(0,t.insert)(i,()=>e.label),(0,r.effect)(()=>i.value=e.value),i})),(0,r.effect)(e=>{var r=g().selectContainer,i=g().selectWrapper,o=g().select;return r!==e.e&&(0,t.className)(d,e.e=r),i!==e.t&&(0,t.className)(c,e.t=i),o!==e.a&&(0,t.className)(p,e.a=o),e},{e:void 0,t:void 0,a:void 0}),(0,r.effect)(()=>p.value=h()),d}(0,t.delegateEvents)(["input"]),e.s(["Select",()=>d])},661981,e=>{"use strict";var t=e.i(766932),r=e.i(574788),i=e.i(7284),o=e.i(419695),n=(0,t.template)("<button>");function a(e){var a;let l=(0,o.useStyles)(),[s,d]=(0,r.splitProps)(e,["variant","outline","ghost","children","className"]),c=s.variant||"primary",p=(0,i.default)(l().button.base,l().button.variant(c,s.outline,s.ghost),s.className);return a=n(),(0,t.spread)(a,(0,r.mergeProps)(d,{class:p}),!1,!0),(0,t.insert)(a,()=>s.children),a}e.s(["Button",()=>a])},632608,e=>{"use strict";var t=e.i(766932),r=e.i(574788),i=e.i(7284),o=e.i(419695),n=(0,t.template)("<section>"),a=(0,t.template)("<h3>"),l=(0,t.template)("<p>"),s=(0,t.template)("<span>");let d=e=>{var a;let{children:l,...s}=e,d=(0,o.useStyles)();return a=n(),(0,t.spread)(a,(0,r.mergeProps)({get class(){return(0,i.default)(d().section.main,s.class)}},s),!1,!0),(0,t.insert)(a,l),a},c=e=>{var n;let{children:l,...s}=e,d=(0,o.useStyles)();return n=a(),(0,t.spread)(n,(0,r.mergeProps)({get class(){return(0,i.default)(d().section.title,s.class)}},s),!1,!0),(0,t.insert)(n,l),n},p=e=>{var n;let{children:a,...s}=e,d=(0,o.useStyles)();return n=l(),(0,t.spread)(n,(0,r.mergeProps)({get class(){return(0,i.default)(d().section.description,s.class)}},s),!1,!0),(0,t.insert)(n,a),n},u=e=>{var n;let{children:a,...l}=e,d=(0,o.useStyles)();return n=s(),(0,t.spread)(n,(0,r.mergeProps)({get class(){return(0,i.default)(d().section.icon,l.class)}},l),!1,!0),(0,t.insert)(n,a),n};e.s(["Section",()=>d,"SectionDescription",()=>p,"SectionIcon",()=>u,"SectionTitle",()=>c])},875349,e=>{"use strict";var t=e.i(500983),r=e.i(634776),i=e.i(548755),o=e.i(766932),n=e.i(278322),a=e.i(574788),l=e.i(419695),s=(0,o.template)('<svg xmlns=http://www.w3.org/2000/svg enable-background="new 0 0 634 633"viewBox="0 0 634 633"><g transform=translate(1)><linearGradient x1=-641.486 x2=-641.486 y1=856.648 y2=855.931 gradientTransform="matrix(633 0 0 -633 406377 542258)"gradientUnits=userSpaceOnUse><stop offset=0 stop-color=#6bdaff></stop><stop offset=0.319 stop-color=#f9ffb5></stop><stop offset=0.706 stop-color=#ffa770></stop><stop offset=1 stop-color=#ff7373></stop></linearGradient><circle cx=316.5 cy=316.5 r=316.5 fill-rule=evenodd clip-rule=evenodd></circle><defs><filter width=454 height=396.9 x=-137.5 y=412 filterUnits=userSpaceOnUse><feColorMatrix values="1 0 0 0 0 0 1 0 0 0 0 0 1 0 0 0 0 0 1 0"></feColorMatrix></filter></defs><mask width=454 height=396.9 x=-137.5 y=412 maskUnits=userSpaceOnUse><g><circle cx=316.5 cy=316.5 r=316.5 fill=#FFF fill-rule=evenodd clip-rule=evenodd></circle></g></mask><ellipse cx=89.5 cy=610.5 fill=#015064 fill-rule=evenodd stroke=#00CFE2 stroke-width=25 clip-rule=evenodd rx=214.5 ry=186></ellipse><defs><filter width=454 height=396.9 x=316.5 y=412 filterUnits=userSpaceOnUse><feColorMatrix values="1 0 0 0 0 0 1 0 0 0 0 0 1 0 0 0 0 0 1 0"></feColorMatrix></filter></defs><mask width=454 height=396.9 x=316.5 y=412 maskUnits=userSpaceOnUse><g><circle cx=316.5 cy=316.5 r=316.5 fill=#FFF fill-rule=evenodd clip-rule=evenodd></circle></g></mask><ellipse cx=543.5 cy=610.5 fill=#015064 fill-rule=evenodd stroke=#00CFE2 stroke-width=25 clip-rule=evenodd rx=214.5 ry=186></ellipse><defs><filter width=454 height=396.9 x=-137.5 y=450 filterUnits=userSpaceOnUse><feColorMatrix values="1 0 0 0 0 0 1 0 0 0 0 0 1 0 0 0 0 0 1 0"></feColorMatrix></filter></defs><mask width=454 height=396.9 x=-137.5 y=450 maskUnits=userSpaceOnUse><g><circle cx=316.5 cy=316.5 r=316.5 fill=#FFF fill-rule=evenodd clip-rule=evenodd></circle></g></mask><ellipse cx=89.5 cy=648.5 fill=#015064 fill-rule=evenodd stroke=#00A8B8 stroke-width=25 clip-rule=evenodd rx=214.5 ry=186></ellipse><defs><filter width=454 height=396.9 x=316.5 y=450 filterUnits=userSpaceOnUse><feColorMatrix values="1 0 0 0 0 0 1 0 0 0 0 0 1 0 0 0 0 0 1 0"></feColorMatrix></filter></defs><mask width=454 height=396.9 x=316.5 y=450 maskUnits=userSpaceOnUse><g><circle cx=316.5 cy=316.5 r=316.5 fill=#FFF fill-rule=evenodd clip-rule=evenodd></circle></g></mask><ellipse cx=543.5 cy=648.5 fill=#015064 fill-rule=evenodd stroke=#00A8B8 stroke-width=25 clip-rule=evenodd rx=214.5 ry=186></ellipse><defs><filter width=454 height=396.9 x=-137.5 y=486 filterUnits=userSpaceOnUse><feColorMatrix values="1 0 0 0 0 0 1 0 0 0 0 0 1 0 0 0 0 0 1 0"></feColorMatrix></filter></defs><mask width=454 height=396.9 x=-137.5 y=486 maskUnits=userSpaceOnUse><g><circle cx=316.5 cy=316.5 r=316.5 fill=#FFF fill-rule=evenodd clip-rule=evenodd></circle></g></mask><ellipse cx=89.5 cy=684.5 fill=#015064 fill-rule=evenodd stroke=#007782 stroke-width=25 clip-rule=evenodd rx=214.5 ry=186></ellipse><defs><filter width=454 height=396.9 x=316.5 y=486 filterUnits=userSpaceOnUse><feColorMatrix values="1 0 0 0 0 0 1 0 0 0 0 0 1 0 0 0 0 0 1 0"></feColorMatrix></filter></defs><mask width=454 height=396.9 x=316.5 y=486 maskUnits=userSpaceOnUse><g><circle cx=316.5 cy=316.5 r=316.5 fill=#FFF fill-rule=evenodd clip-rule=evenodd></circle></g></mask><ellipse cx=543.5 cy=684.5 fill=#015064 fill-rule=evenodd stroke=#007782 stroke-width=25 clip-rule=evenodd rx=214.5 ry=186></ellipse><defs><filter width=176.9 height=129.3 x=272.2 y=308 filterUnits=userSpaceOnUse><feColorMatrix values="1 0 0 0 0 0 1 0 0 0 0 0 1 0 0 0 0 0 1 0"></feColorMatrix></filter></defs><mask width=176.9 height=129.3 x=272.2 y=308 maskUnits=userSpaceOnUse><g><circle cx=316.5 cy=316.5 r=316.5 fill=#FFF fill-rule=evenodd clip-rule=evenodd></circle></g></mask><g><path fill=none stroke=#000 stroke-linecap=round stroke-linejoin=bevel stroke-width=11 d="M436 403.2l-5 28.6m-140-90.3l-10.9 62m52.8-19.4l-4.3 27.1"></path><linearGradient x1=-645.656 x2=-646.499 y1=854.878 y2=854.788 gradientTransform="matrix(-184.159 -32.4722 11.4608 -64.9973 -128419.844 34938.836)"gradientUnits=userSpaceOnUse><stop offset=0 stop-color=#ee2700></stop><stop offset=1 stop-color=#ff008e></stop></linearGradient><path fill-rule=evenodd d="M344.1 363l97.7 17.2c5.8 2.1 8.2 6.2 7.1 12.1-1 5.9-4.7 9.2-11 9.9l-106-18.7-57.5-59.2c-3.2-4.8-2.9-9.1.8-12.8 3.7-3.7 8.3-4.4 13.7-2.1l55.2 53.6z"clip-rule=evenodd></path><path fill=#D8D8D8 fill-rule=evenodd stroke=#FFF stroke-linecap=round stroke-linejoin=bevel stroke-width=7 d="M428.3 384.5l.9-6.5m-33.9 1.5l.9-6.5m-34 .5l.9-6.1m-38.9-16.1l4.2-3.9m-25.2-16.1l4.2-3.9"clip-rule=evenodd></path></g><defs><filter width=280.6 height=317.4 x=73.2 y=113.9 filterUnits=userSpaceOnUse><feColorMatrix values="1 0 0 0 0 0 1 0 0 0 0 0 1 0 0 0 0 0 1 0"></feColorMatrix></filter></defs><mask width=280.6 height=317.4 x=73.2 y=113.9 maskUnits=userSpaceOnUse><g><circle cx=316.5 cy=316.5 r=316.5 fill=#FFF fill-rule=evenodd clip-rule=evenodd></circle></g></mask><g><linearGradient x1=-646.8 x2=-646.8 y1=854.844 y2=853.844 gradientTransform="matrix(-100.1751 48.8587 -97.9753 -200.879 19124.773 203538.61)"gradientUnits=userSpaceOnUse><stop offset=0 stop-color=#a17500></stop><stop offset=1 stop-color=#5d2100></stop></linearGradient><path fill-rule=evenodd d="M192.3 203c8.1 37.3 14 73.6 17.8 109.1 3.8 35.4 2.8 75.2-2.9 119.2l61.2-16.7c-15.6-59-25.2-97.9-28.6-116.6-3.4-18.7-10.8-51.8-22.2-99.6l-25.3 4.6"clip-rule=evenodd></path><linearGradient x1=-635.467 x2=-635.467 y1=852.115 y2=851.115 gradientTransform="matrix(92.6873 4.8575 2.0257 -38.6535 57323.695 36176.047)"gradientUnits=userSpaceOnUse><stop offset=0 stop-color=#2f8a00></stop><stop offset=1 stop-color=#90ff57></stop></linearGradient><path fill-rule=evenodd stroke=#2F8A00 stroke-width=13 d="M195 183.9s-12.6-22.1-36.5-29.9c-15.9-5.2-34.4-1.5-55.5 11.1 15.9 14.3 29.5 22.6 40.7 24.9 16.8 3.6 51.3-6.1 51.3-6.1z"clip-rule=evenodd></path><linearGradient x1=-636.573 x2=-636.573 y1=855.444 y2=854.444 gradientTransform="matrix(109.9945 5.7646 6.3597 -121.3507 64719.133 107659.336)"gradientUnits=userSpaceOnUse><stop offset=0 stop-color=#2f8a00></stop><stop offset=1 stop-color=#90ff57></stop></linearGradient><path fill-rule=evenodd stroke=#2F8A00 stroke-width=13 d="M194.9 184.5s-47.5-8.5-83.2 15.7c-23.8 16.2-34.3 49.3-31.6 99.3 30.3-27.8 52.1-48.5 65.2-61.9 19.8-20 49.6-53.1 49.6-53.1z"clip-rule=evenodd></path><linearGradient x1=-632.145 x2=-632.145 y1=854.174 y2=853.174 gradientTransform="matrix(62.9558 3.2994 3.5021 -66.8246 37035.367 59284.227)"gradientUnits=userSpaceOnUse><stop offset=0 stop-color=#2f8a00></stop><stop offset=1 stop-color=#90ff57></stop></linearGradient><path fill-rule=evenodd stroke=#2F8A00 stroke-width=13 d="M195 183.9c-.8-21.9 6-38 20.6-48.2 14.6-10.2 29.8-15.3 45.5-15.3-6.1 21.4-14.5 35.8-25.2 43.4-10.7 7.5-24.4 14.2-40.9 20.1z"clip-rule=evenodd></path><linearGradient x1=-638.224 x2=-638.224 y1=853.801 y2=852.801 gradientTransform="matrix(152.4666 7.9904 3.0934 -59.0251 94939.86 55646.855)"gradientUnits=userSpaceOnUse><stop offset=0 stop-color=#2f8a00></stop><stop offset=1 stop-color=#90ff57></stop></linearGradient><path fill-rule=evenodd stroke=#2F8A00 stroke-width=13 d="M194.9 184.5c31.9-30 64.1-39.7 96.7-29 32.6 10.7 50.8 30.4 54.6 59.1-35.2-5.5-60.4-9.6-75.8-12.1-15.3-2.6-40.5-8.6-75.5-18z"clip-rule=evenodd></path><linearGradient x1=-637.723 x2=-637.723 y1=855.103 y2=854.103 gradientTransform="matrix(136.467 7.1519 5.2165 -99.5377 82830.875 89859.578)"gradientUnits=userSpaceOnUse><stop offset=0 stop-color=#2f8a00></stop><stop offset=1 stop-color=#90ff57></stop></linearGradient><path fill-rule=evenodd stroke=#2F8A00 stroke-width=13 d="M194.9 184.5c35.8-7.6 65.6-.2 89.2 22 23.6 22.2 37.7 49 42.3 80.3-39.8-9.7-68.3-23.8-85.5-42.4-17.2-18.5-32.5-38.5-46-59.9z"clip-rule=evenodd></path><linearGradient x1=-631.79 x2=-631.79 y1=855.872 y2=854.872 gradientTransform="matrix(60.8683 3.19 8.7771 -167.4773 31110.818 145537.61)"gradientUnits=userSpaceOnUse><stop offset=0 stop-color=#2f8a00></stop><stop offset=1 stop-color=#90ff57></stop></linearGradient><path fill-rule=evenodd stroke=#2F8A00 stroke-width=13 d="M194.9 184.5c-33.6 13.8-53.6 35.7-60.1 65.6-6.5 29.9-3.6 63.1 8.7 99.6 27.4-40.3 43.2-69.6 47.4-88 4.2-18.3 5.5-44.1 4-77.2z"clip-rule=evenodd></path><path fill=none stroke=#2F8A00 stroke-linecap=round stroke-width=8 d="M196.5 182.3c-14.8 21.6-25.1 41.4-30.8 59.4-5.7 18-9.4 33-11.1 45.1"></path><path fill=none stroke=#2F8A00 stroke-linecap=round stroke-width=8 d="M194.8 185.7c-24.4 1.7-43.8 9-58.1 21.8-14.3 12.8-24.7 25.4-31.3 37.8m99.1-68.9c29.7-6.7 52-8.4 67-5 15 3.4 26.9 8.7 35.8 15.9m-110.8-5.9c20.3 9.9 38.2 20.5 53.9 31.9 15.7 11.4 27.4 22.1 35.1 32"></path></g><defs><filter width=532 height=633 x=50.5 y=399 filterUnits=userSpaceOnUse><feColorMatrix values="1 0 0 0 0 0 1 0 0 0 0 0 1 0 0 0 0 0 1 0"></feColorMatrix></filter></defs><mask width=532 height=633 x=50.5 y=399 maskUnits=userSpaceOnUse><g><circle cx=316.5 cy=316.5 r=316.5 fill=#FFF fill-rule=evenodd clip-rule=evenodd></circle></g></mask><linearGradient x1=-641.104 x2=-641.278 y1=856.577 y2=856.183 gradientTransform="matrix(532 0 0 -633 341484.5 542657)"gradientUnits=userSpaceOnUse><stop offset=0 stop-color=#fff400></stop><stop offset=1 stop-color=#3c8700></stop></linearGradient><ellipse cx=316.5 cy=715.5 fill-rule=evenodd clip-rule=evenodd rx=266 ry=316.5></ellipse><defs><filter width=288 height=283 x=391 y=-24 filterUnits=userSpaceOnUse><feColorMatrix values="1 0 0 0 0 0 1 0 0 0 0 0 1 0 0 0 0 0 1 0"></feColorMatrix></filter></defs><mask width=288 height=283 x=391 y=-24 maskUnits=userSpaceOnUse><g><circle cx=316.5 cy=316.5 r=316.5 fill=#FFF fill-rule=evenodd clip-rule=evenodd></circle></g></mask><g><g transform="translate(397 -24)"><linearGradient x1=-1036.672 x2=-1036.672 y1=880.018 y2=879.018 gradientTransform="matrix(227 0 0 -227 235493 199764)"gradientUnits=userSpaceOnUse><stop offset=0 stop-color=#ffdf00></stop><stop offset=1 stop-color=#ff9d00></stop></linearGradient><circle cx=168.5 cy=113.5 r=113.5 fill-rule=evenodd clip-rule=evenodd></circle><linearGradient x1=-1017.329 x2=-1018.602 y1=658.003 y2=657.998 gradientTransform="matrix(30 0 0 -1 30558 771)"gradientUnits=userSpaceOnUse><stop offset=0 stop-color=#ffa400></stop><stop offset=1 stop-color=#ff5e00></stop></linearGradient><path fill=none stroke-linecap=round stroke-linejoin=bevel stroke-width=12 d="M30 113H0"></path><linearGradient x1=-1014.501 x2=-1015.774 y1=839.985 y2=839.935 gradientTransform="matrix(26.5 0 0 -5.5 26925 4696.5)"gradientUnits=userSpaceOnUse><stop offset=0 stop-color=#ffa400></stop><stop offset=1 stop-color=#ff5e00></stop></linearGradient><path fill=none stroke-linecap=round stroke-linejoin=bevel stroke-width=12 d="M33.5 79.5L7 74"></path><linearGradient x1=-1016.59 x2=-1017.862 y1=852.671 y2=852.595 gradientTransform="matrix(29 0 0 -8 29523 6971)"gradientUnits=userSpaceOnUse><stop offset=0 stop-color=#ffa400></stop><stop offset=1 stop-color=#ff5e00></stop></linearGradient><path fill=none stroke-linecap=round stroke-linejoin=bevel stroke-width=12 d="M34 146l-29 8"></path><linearGradient x1=-1011.984 x2=-1013.257 y1=863.523 y2=863.229 gradientTransform="matrix(24 0 0 -13 24339 11407)"gradientUnits=userSpaceOnUse><stop offset=0 stop-color=#ffa400></stop><stop offset=1 stop-color=#ff5e00></stop></linearGradient><path fill=none stroke-linecap=round stroke-linejoin=bevel stroke-width=12 d="M45 177l-24 13"></path><linearGradient x1=-1006.673 x2=-1007.946 y1=869.279 y2=868.376 gradientTransform="matrix(20 0 0 -19 20205 16720)"gradientUnits=userSpaceOnUse><stop offset=0 stop-color=#ffa400></stop><stop offset=1 stop-color=#ff5e00></stop></linearGradient><path fill=none stroke-linecap=round stroke-linejoin=bevel stroke-width=12 d="M67 204l-20 19"></path><linearGradient x1=-992.85 x2=-993.317 y1=871.258 y2=870.258 gradientTransform="matrix(13.8339 0 0 -22.8467 13825.796 20131.938)"gradientUnits=userSpaceOnUse><stop offset=0 stop-color=#ffa400></stop><stop offset=1 stop-color=#ff5e00></stop></linearGradient><path fill=none stroke-linecap=round stroke-linejoin=bevel stroke-width=12 d="M94.4 227l-13.8 22.8"></path><linearGradient x1=-953.835 x2=-953.965 y1=871.9 y2=870.9 gradientTransform="matrix(7.5 0 0 -24.5 7278 21605)"gradientUnits=userSpaceOnUse><stop offset=0 stop-color=#ffa400></stop><stop offset=1 stop-color=#ff5e00></stop></linearGradient><path fill=none stroke-linecap=round stroke-linejoin=bevel stroke-width=12 d="M127.5 243.5L120 268"></path><linearGradient x1=244.504 x2=244.496 y1=871.898 y2=870.898 gradientTransform="matrix(.5 0 0 -24.5 45.5 21614)"gradientUnits=userSpaceOnUse><stop offset=0 stop-color=#ffa400></stop><stop offset=1 stop-color=#ff5e00></stop></linearGradient><path fill=none stroke-linecap=round stroke-linejoin=bevel stroke-width=12 d="M167.5 252.5l.5 24.5">');function d(){var e,t,r,i,d,c,p,u,f,g,h,m,b,v,x,C,y,k,w,$,S,A,F,M,N,U,z,L,E,B,G,j,D,T,O,P,I,H,V,K,Z,q,R,_,J,W,X,Q,Y,ee,et,er,ei,eo,en,ea,el,es,ed,ec,ep,eu,ef,eg,eh,em,eb,ev,ex,eC,ey,ek,ew,e$,eS,eA,eF,eM,eN,eU,ez,eL,eE,eB,eG,ej,eD,eT;let eO=(0,a.createUniqueId)(),eP=(0,l.useStyles)();return d=(i=(r=(t=(e=s()).firstChild.firstChild).nextSibling).nextSibling).firstChild,p=(c=i.nextSibling).firstChild,g=(f=(u=c.nextSibling).nextSibling).firstChild,m=(h=f.nextSibling).firstChild,x=(v=(b=h.nextSibling).nextSibling).firstChild,y=(C=v.nextSibling).firstChild,$=(w=(k=C.nextSibling).nextSibling).firstChild,A=(S=w.nextSibling).firstChild,N=(M=(F=S.nextSibling).nextSibling).firstChild,z=(U=M.nextSibling).firstChild,B=(E=(L=U.nextSibling).nextSibling).firstChild,j=(G=E.nextSibling).firstChild,O=(T=(D=G.nextSibling).nextSibling).firstChild,I=(P=T.nextSibling).firstChild,K=(V=(H=P.nextSibling).firstChild.nextSibling).nextSibling,q=(Z=H.nextSibling).firstChild,_=(R=Z.nextSibling).firstChild,ed=(es=(el=(ea=(en=(eo=(ei=(er=(et=(ee=(Y=(Q=(X=(W=(J=R.nextSibling).firstChild).nextSibling).nextSibling).nextSibling).nextSibling).nextSibling).nextSibling).nextSibling).nextSibling).nextSibling).nextSibling).nextSibling).nextSibling).nextSibling,ep=(ec=J.nextSibling).firstChild,ef=(eu=ec.nextSibling).firstChild,eb=(em=(eh=(eg=eu.nextSibling).nextSibling).nextSibling).firstChild,ex=(ev=em.nextSibling).firstChild,eT=(eD=(ej=(eG=(eB=(eE=(eL=(ez=(eU=(eN=(eM=(eF=(eA=(eS=(e$=(ew=(ek=(ey=(eC=ev.nextSibling).firstChild.firstChild).nextSibling).nextSibling).nextSibling).nextSibling).nextSibling).nextSibling).nextSibling).nextSibling).nextSibling).nextSibling).nextSibling).nextSibling).nextSibling).nextSibling).nextSibling).nextSibling).nextSibling,(0,o.setAttribute)(t,"id",`a-${eO}`),(0,o.setAttribute)(r,"fill",`url(#a-${eO})`),(0,o.setAttribute)(d,"id",`b-${eO}`),(0,o.setAttribute)(c,"id",`c-${eO}`),(0,o.setAttribute)(p,"filter",`url(#b-${eO})`),(0,o.setAttribute)(u,"mask",`url(#c-${eO})`),(0,o.setAttribute)(g,"id",`d-${eO}`),(0,o.setAttribute)(h,"id",`e-${eO}`),(0,o.setAttribute)(m,"filter",`url(#d-${eO})`),(0,o.setAttribute)(b,"mask",`url(#e-${eO})`),(0,o.setAttribute)(x,"id",`f-${eO}`),(0,o.setAttribute)(C,"id",`g-${eO}`),(0,o.setAttribute)(y,"filter",`url(#f-${eO})`),(0,o.setAttribute)(k,"mask",`url(#g-${eO})`),(0,o.setAttribute)($,"id",`h-${eO}`),(0,o.setAttribute)(S,"id",`i-${eO}`),(0,o.setAttribute)(A,"filter",`url(#h-${eO})`),(0,o.setAttribute)(F,"mask",`url(#i-${eO})`),(0,o.setAttribute)(N,"id",`j-${eO}`),(0,o.setAttribute)(U,"id",`k-${eO}`),(0,o.setAttribute)(z,"filter",`url(#j-${eO})`),(0,o.setAttribute)(L,"mask",`url(#k-${eO})`),(0,o.setAttribute)(B,"id",`l-${eO}`),(0,o.setAttribute)(G,"id",`m-${eO}`),(0,o.setAttribute)(j,"filter",`url(#l-${eO})`),(0,o.setAttribute)(D,"mask",`url(#m-${eO})`),(0,o.setAttribute)(O,"id",`n-${eO}`),(0,o.setAttribute)(P,"id",`o-${eO}`),(0,o.setAttribute)(I,"filter",`url(#n-${eO})`),(0,o.setAttribute)(H,"mask",`url(#o-${eO})`),(0,o.setAttribute)(V,"id",`p-${eO}`),(0,o.setAttribute)(K,"fill",`url(#p-${eO})`),(0,o.setAttribute)(q,"id",`q-${eO}`),(0,o.setAttribute)(R,"id",`r-${eO}`),(0,o.setAttribute)(_,"filter",`url(#q-${eO})`),(0,o.setAttribute)(J,"mask",`url(#r-${eO})`),(0,o.setAttribute)(W,"id",`s-${eO}`),(0,o.setAttribute)(X,"fill",`url(#s-${eO})`),(0,o.setAttribute)(Q,"id",`t-${eO}`),(0,o.setAttribute)(Y,"fill",`url(#t-${eO})`),(0,o.setAttribute)(ee,"id",`u-${eO}`),(0,o.setAttribute)(et,"fill",`url(#u-${eO})`),(0,o.setAttribute)(er,"id",`v-${eO}`),(0,o.setAttribute)(ei,"fill",`url(#v-${eO})`),(0,o.setAttribute)(eo,"id",`w-${eO}`),(0,o.setAttribute)(en,"fill",`url(#w-${eO})`),(0,o.setAttribute)(ea,"id",`x-${eO}`),(0,o.setAttribute)(el,"fill",`url(#x-${eO})`),(0,o.setAttribute)(es,"id",`y-${eO}`),(0,o.setAttribute)(ed,"fill",`url(#y-${eO})`),(0,o.setAttribute)(ep,"id",`z-${eO}`),(0,o.setAttribute)(eu,"id",`A-${eO}`),(0,o.setAttribute)(ef,"filter",`url(#z-${eO})`),(0,o.setAttribute)(eg,"id",`B-${eO}`),(0,o.setAttribute)(eh,"fill",`url(#B-${eO})`),(0,o.setAttribute)(eh,"mask",`url(#A-${eO})`),(0,o.setAttribute)(eb,"id",`C-${eO}`),(0,o.setAttribute)(ev,"id",`D-${eO}`),(0,o.setAttribute)(ex,"filter",`url(#C-${eO})`),(0,o.setAttribute)(eC,"mask",`url(#D-${eO})`),(0,o.setAttribute)(ey,"id",`E-${eO}`),(0,o.setAttribute)(ek,"fill",`url(#E-${eO})`),(0,o.setAttribute)(ew,"id",`F-${eO}`),(0,o.setAttribute)(e$,"stroke",`url(#F-${eO})`),(0,o.setAttribute)(eS,"id",`G-${eO}`),(0,o.setAttribute)(eA,"stroke",`url(#G-${eO})`),(0,o.setAttribute)(eF,"id",`H-${eO}`),(0,o.setAttribute)(eM,"stroke",`url(#H-${eO})`),(0,o.setAttribute)(eN,"id",`I-${eO}`),(0,o.setAttribute)(eU,"stroke",`url(#I-${eO})`),(0,o.setAttribute)(ez,"id",`J-${eO}`),(0,o.setAttribute)(eL,"stroke",`url(#J-${eO})`),(0,o.setAttribute)(eE,"id",`K-${eO}`),(0,o.setAttribute)(eB,"stroke",`url(#K-${eO})`),(0,o.setAttribute)(eG,"id",`L-${eO}`),(0,o.setAttribute)(ej,"stroke",`url(#L-${eO})`),(0,o.setAttribute)(eD,"id",`M-${eO}`),(0,o.setAttribute)(eT,"stroke",`url(#M-${eO})`),(0,n.effect)(()=>(0,o.setAttribute)(e,"class",eP().logo)),e}var c=e.i(992457),p=e.i(661981),u=(0,o.template)("<span>"),f=(0,o.template)("<button><span></span><span>");let g=e=>{var t,r,i;let s=(0,l.useStyles)();return i=(r=(t=f()).firstChild).nextSibling,(0,o.insert)(i,()=>e.label),(0,o.insert)(t,(0,a.createComponent)(a.Show,{get when(){return e.count&&e.count>0},get children(){var d=u();return(0,o.insert)(d,()=>e.count),(0,n.effect)(()=>(0,o.className)(d,s().tag.count)),d}}),null),(0,n.effect)(n=>{var a=e.disabled,l=s().tag.base,d=s().tag.dot(e.color),c=s().tag.label;return a!==n.e&&(t.disabled=n.e=a),l!==n.t&&(0,o.className)(t,n.t=l),d!==n.a&&(0,o.className)(r,n.a=d),c!==n.o&&(0,o.className)(i,n.o=c),n},{e:void 0,t:void 0,a:void 0,o:void 0}),t};var h=e.i(492859),m=e.i(632608),b=e.i(949936),v=e.i(537261),x=e.i(596190);e.s([],233399),e.i(233399),e.s(["Button",()=>p.Button,"CheckCircleIcon",()=>x.CheckCircleIcon,"Checkbox",()=>t.Checkbox,"ChevronDownIcon",()=>x.ChevronDownIcon,"CloseIcon",()=>x.CloseIcon,"ExternalLinkIcon",()=>x.ExternalLinkIcon,"Header",()=>b.Header,"HeaderLogo",()=>b.HeaderLogo,"Input",()=>r.Input,"JsonTree",()=>c.JsonTree,"MainPanel",()=>h.MainPanel,"PackageIcon",()=>x.PackageIcon,"SearchIcon",()=>x.SearchIcon,"Section",()=>m.Section,"SectionDescription",()=>m.SectionDescription,"SectionIcon",()=>m.SectionIcon,"SectionTitle",()=>m.SectionTitle,"Select",()=>i.Select,"SettingsIcon",()=>x.SettingsIcon,"Tag",()=>g,"TanStackLogo",()=>d,"ThemeContextProvider",()=>v.ThemeContextProvider,"X",()=>x.X,"XCircleIcon",()=>x.XCircleIcon,"useTheme",()=>v.useTheme],875349)}]);