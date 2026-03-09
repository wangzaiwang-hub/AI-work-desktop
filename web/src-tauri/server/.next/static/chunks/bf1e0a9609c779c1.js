(globalThis.TURBOPACK||(globalThis.TURBOPACK=[])).push(["object"==typeof document?document.currentScript:void 0,632608,e=>{"use strict";var t=e.i(766932),r=e.i(574788),n=e.i(7284),o=e.i(419695),i=(0,t.template)("<section>"),a=(0,t.template)("<h3>"),s=(0,t.template)("<p>"),l=(0,t.template)("<span>");let c=e=>{var a;let{children:s,...l}=e,c=(0,o.useStyles)();return a=i(),(0,t.spread)(a,(0,r.mergeProps)({get class(){return(0,n.default)(c().section.main,l.class)}},l),!1,!0),(0,t.insert)(a,s),a},d=e=>{var i;let{children:s,...l}=e,c=(0,o.useStyles)();return i=a(),(0,t.spread)(i,(0,r.mergeProps)({get class(){return(0,n.default)(c().section.title,l.class)}},l),!1,!0),(0,t.insert)(i,s),i},g=e=>{var i;let{children:a,...l}=e,c=(0,o.useStyles)();return i=s(),(0,t.spread)(i,(0,r.mergeProps)({get class(){return(0,n.default)(c().section.description,l.class)}},l),!1,!0),(0,t.insert)(i,a),i},h=e=>{var i;let{children:a,...s}=e,c=(0,o.useStyles)();return i=l(),(0,t.spread)(i,(0,r.mergeProps)({get class(){return(0,n.default)(c().section.icon,s.class)}},s),!1,!0),(0,t.insert)(i,a),i};e.s(["Section",()=>c,"SectionDescription",()=>g,"SectionIcon",()=>h,"SectionTitle",()=>d])},500983,e=>{"use strict";var t=e.i(766932),r=e.i(278322),n=e.i(574788),o=e.i(419695),i=(0,t.template)("<div><label><input type=checkbox><div>"),a=(0,t.template)("<span>");function s(e){var s,l,c,d,g,h;let u=(0,o.useStyles)(),[p,v]=(0,n.createSignal)(e.checked||!1);return d=(c=(l=(s=i()).firstChild).firstChild).nextSibling,c.$$input=t=>{let r=t.target.checked;v(r),e.onChange?.(r)},(0,t.insert)(d,(g=(0,t.memo)(()=>!!e.label),()=>{var n;return g()&&(n=a(),(0,t.insert)(n,()=>e.label),(0,r.effect)(()=>(0,t.className)(n,u().checkboxLabel)),n)}),null),(0,t.insert)(d,(h=(0,t.memo)(()=>!!e.description),()=>{var n;return h()&&(n=a(),(0,t.insert)(n,()=>e.description),(0,r.effect)(()=>(0,t.className)(n,u().checkboxDescription)),n)}),null),(0,r.effect)(e=>{var r=u().checkboxContainer,n=u().checkboxWrapper,o=u().checkbox,i=u().checkboxLabelContainer;return r!==e.e&&(0,t.className)(s,e.e=r),n!==e.t&&(0,t.className)(l,e.t=n),o!==e.a&&(0,t.className)(c,e.a=o),i!==e.o&&(0,t.className)(d,e.o=i),e},{e:void 0,t:void 0,a:void 0,o:void 0}),(0,r.effect)(()=>c.checked=p()),s}(0,t.delegateEvents)(["input"]),e.s(["Checkbox",()=>s])},548755,e=>{"use strict";var t=e.i(766932),r=e.i(278322),n=e.i(574788),o=e.i(419695),i=(0,t.template)("<div><div><select>"),a=(0,t.template)("<label>"),s=(0,t.template)("<p>"),l=(0,t.template)("<option>");function c(e){var c,d,g,h,u;let p=(0,o.useStyles)(),[v,f]=(0,n.createSignal)(e.value||e.options[0]?.value);return g=(d=(c=i()).firstChild).firstChild,(0,t.insert)(d,(h=(0,t.memo)(()=>!!e.label),()=>{var n;return h()&&(n=a(),(0,t.insert)(n,()=>e.label),(0,r.effect)(()=>(0,t.className)(n,p().selectLabel)),n)}),g),(0,t.insert)(d,(u=(0,t.memo)(()=>!!e.description),()=>{var n;return u()&&(n=s(),(0,t.insert)(n,()=>e.description),(0,r.effect)(()=>(0,t.className)(n,p().selectDescription)),n)}),g),g.$$input=t=>{let r=t.target.value;f(e=>e!==r?r:e),e.onChange?.(r)},(0,t.insert)(g,()=>e.options.map(e=>{var n;return n=l(),(0,t.insert)(n,()=>e.label),(0,r.effect)(()=>n.value=e.value),n})),(0,r.effect)(e=>{var r=p().selectContainer,n=p().selectWrapper,o=p().select;return r!==e.e&&(0,t.className)(c,e.e=r),n!==e.t&&(0,t.className)(d,e.t=n),o!==e.a&&(0,t.className)(g,e.a=o),e},{e:void 0,t:void 0,a:void 0}),(0,r.effect)(()=>g.value=v()),c}(0,t.delegateEvents)(["input"]),e.s(["Select",()=>c])},634776,e=>{"use strict";var t=e.i(766932),r=e.i(278322),n=e.i(574788),o=e.i(419695),i=(0,t.template)("<div><div><input>"),a=(0,t.template)("<label>"),s=(0,t.template)("<p>");function l(e){var l,c,d,g,h;let u=(0,o.useStyles)(),[p,v]=(0,n.createSignal)(e.value||"");return d=(c=(l=i()).firstChild).firstChild,(0,t.insert)(c,(g=(0,t.memo)(()=>!!e.label),()=>{var n;return g()&&(n=a(),(0,t.insert)(n,()=>e.label),(0,r.effect)(()=>(0,t.className)(n,u().inputLabel)),n)}),d),(0,t.insert)(c,(h=(0,t.memo)(()=>!!e.description),()=>{var n;return h()&&(n=s(),(0,t.insert)(n,()=>e.description),(0,r.effect)(()=>(0,t.className)(n,u().inputDescription)),n)}),d),d.$$input=t=>{let r=t.target.value;v(e=>e!==r?r:e),e.onChange?.(r)},(0,r.effect)(r=>{var n=u().inputContainer,o=u().inputWrapper,i=e.type||"text",a=u().input,s=e.placeholder;return n!==r.e&&(0,t.className)(l,r.e=n),o!==r.t&&(0,t.className)(c,r.t=o),i!==r.a&&(0,t.setAttribute)(d,"type",r.a=i),a!==r.o&&(0,t.className)(d,r.o=a),s!==r.i&&(0,t.setAttribute)(d,"placeholder",r.i=s),r},{e:void 0,t:void 0,a:void 0,o:void 0,i:void 0}),(0,r.effect)(()=>d.value=p()),l}(0,t.delegateEvents)(["input"]),e.s(["Input",()=>l])},661981,e=>{"use strict";var t=e.i(766932),r=e.i(574788),n=e.i(7284),o=e.i(419695),i=(0,t.template)("<button>");function a(e){var a;let s=(0,o.useStyles)(),[l,c]=(0,r.splitProps)(e,["variant","outline","ghost","children","className"]),d=l.variant||"primary",g=(0,n.default)(s().button.base,s().button.variant(d,l.outline,l.ghost),l.className);return a=i(),(0,t.spread)(a,(0,r.mergeProps)(c,{class:g}),!1,!0),(0,t.insert)(a,()=>l.children),a}e.s(["Button",()=>a])},278322,e=>{"use strict";var t=e.i(574788);e.s(["effect",()=>t.createRenderEffect])},537261,e=>{"use strict";var t=e.i(574788);let r=(0,t.createContext)(void 0),n=e=>{let[n,o]=(0,t.createSignal)(e.theme);return(0,t.createEffect)(()=>{o(e.theme)}),(0,t.createComponent)(r.Provider,{value:{theme:n,setTheme:o},get children(){return e.children}})};function o(){let e=(0,t.useContext)(r);if(!e)throw Error("useTheme must be used within a ThemeContextProvider");return e}e.s(["ThemeContextProvider",()=>n,"useTheme",()=>o])},739604,e=>{"use strict";let t={data:""},r=/(?:([\u0080-\uFFFF\w-%@]+) *:? *([^{;]+?);|([^;}{]*?) *{)|(}\s*)/g,n=/\/\*[^]*?\*\/|  +/g,o=/\n+/g,i=(e,t)=>{let r="",n="",o="";for(let a in e){let s=e[a];"@"==a[0]?"i"==a[1]?r=a+" "+s+";":n+="f"==a[1]?i(s,a):a+"{"+i(s,"k"==a[1]?"":t)+"}":"object"==typeof s?n+=i(s,t?t.replace(/([^,])+/g,e=>a.replace(/([^,]*:\S+\([^)]*\))|([^,])+/g,t=>/&/.test(t)?t.replace(/&/g,e):e?e+" "+t:t)):a):null!=s&&(a=/^--/.test(a)?a:a.replace(/[A-Z]/g,"-$&").toLowerCase(),o+=i.p?i.p(a,s):a+":"+s+";")}return r+(t&&o?t+"{"+o+"}":o)+n},a={},s=e=>{if("object"==typeof e){let t="";for(let r in e)t+=r+s(e[r]);return t}return e};function l(e){let l,c,d=this||{},g=e.call?e(d.p):e;return((e,t,l,c,d)=>{var g;let h=s(e),u=a[h]||(a[h]=(e=>{let t=0,r=11;for(;t<e.length;)r=101*r+e.charCodeAt(t++)>>>0;return"go"+r})(h));if(!a[u]){let t=h!==e?e:(e=>{let t,i,a=[{}];for(;t=r.exec(e.replace(n,""));)t[4]?a.shift():t[3]?(i=t[3].replace(o," ").trim(),a.unshift(a[0][i]=a[0][i]||{})):a[0][t[1]]=t[2].replace(o," ").trim();return a[0]})(e);a[u]=i(d?{["@keyframes "+u]:t}:t,l?"":"."+u)}let p=l&&a.g?a.g:null;return l&&(a.g=a[u]),g=a[u],p?t.data=t.data.replace(p,g):-1===t.data.indexOf(g)&&(t.data=c?g+t.data:t.data+g),u})(g.unshift?g.raw?(l=[].slice.call(arguments,1),c=d.p,g.reduce((e,t,r)=>{let n=l[r];if(n&&n.call){let e=n(c),t=e&&e.props&&e.props.className||/^go/.test(e)&&e;n=t?"."+t:e&&"object"==typeof e?e.props?"":i(e,""):!1===e?"":e}return e+t+(null==n?"":n)},"")):g.reduce((e,t)=>Object.assign(e,t&&t.call?t(d.p):t),{}):g,(e=>{if("object"==typeof window){let t=(e?e.querySelector("#_goober"):window._goober)||Object.assign(document.createElement("style"),{innerHTML:" ",id:"_goober"});return t.nonce=window.__nonce__,t.parentNode||(e||document.head).appendChild(t),t.firstChild}return e||t})(d.target),d.g,d.o,d.k)}l.bind({g:1}),l.bind({k:1}),e.s(["css",()=>l])},419695,e=>{"use strict";var t=e.i(739604),r=e.i(574788),n=e.i(537261);let o={colors:{inherit:"inherit",current:"currentColor",transparent:"transparent",black:"#000000",white:"#ffffff",neutral:{50:"#f9fafb",100:"#f2f4f7",200:"#eaecf0",300:"#d0d5dd",400:"#98a2b3",500:"#667085",600:"#475467",700:"#344054",800:"#1d2939",900:"#101828"},darkGray:{50:"#525c7a",100:"#49536e",200:"#414962",300:"#394056",400:"#313749",500:"#292e3d",600:"#212530",700:"#191c24",800:"#111318",900:"#0b0d10"},gray:{50:"#f9fafb",100:"#f2f4f7",200:"#eaecf0",300:"#d0d5dd",400:"#98a2b3",500:"#667085",600:"#475467",700:"#344054",800:"#1d2939",900:"#101828"},blue:{25:"#F5FAFF",50:"#EFF8FF",100:"#D1E9FF",200:"#B2DDFF",300:"#84CAFF",400:"#53B1FD",500:"#2E90FA",600:"#1570EF",700:"#175CD3",800:"#1849A9",900:"#194185"},green:{25:"#F6FEF9",50:"#ECFDF3",100:"#D1FADF",200:"#A6F4C5",300:"#6CE9A6",400:"#32D583",500:"#12B76A",600:"#039855",700:"#027A48",800:"#05603A",900:"#054F31"},red:{50:"#fef2f2",100:"#fee2e2",200:"#fecaca",300:"#fca5a5",400:"#f87171",500:"#ef4444",600:"#dc2626",700:"#b91c1c",800:"#991b1b",900:"#7f1d1d",950:"#450a0a"},yellow:{25:"#FFFCF5",50:"#FFFAEB",100:"#FEF0C7",200:"#FEDF89",300:"#FEC84B",400:"#FDB022",500:"#F79009",600:"#DC6803",700:"#B54708",800:"#93370D",900:"#7A2E0E"},purple:{25:"#FAFAFF",50:"#F4F3FF",100:"#EBE9FE",200:"#D9D6FE",300:"#BDB4FE",400:"#9B8AFB",500:"#7A5AF8",600:"#6938EF",700:"#5925DC",800:"#4A1FB8",900:"#3E1C96"},teal:{25:"#F6FEFC",50:"#F0FDF9",100:"#CCFBEF",200:"#99F6E0",300:"#5FE9D0",400:"#2ED3B7",500:"#15B79E",600:"#0E9384",700:"#107569",800:"#125D56",900:"#134E48"},pink:{25:"#fdf2f8",50:"#fce7f3",100:"#fbcfe8",200:"#f9a8d4",300:"#f472b6",400:"#ec4899",500:"#db2777",600:"#be185d",700:"#9d174d",800:"#831843",900:"#500724"},cyan:{25:"#ecfeff",50:"#cffafe",100:"#a5f3fc",200:"#67e8f9",300:"#22d3ee",400:"#06b6d4",500:"#0891b2",600:"#0e7490",700:"#155e75",800:"#164e63",900:"#083344"}},font:{size:{xs:"calc(var(--tsrd-font-size) * 0.75)",sm:"calc(var(--tsrd-font-size) * 0.875)",md:"var(--tsrd-font-size)"},lineHeight:{xs:"calc(var(--tsrd-font-size) * 1)"},weight:{medium:"500",semibold:"600",bold:"700"},fontFamily:{sans:"ui-sans-serif, Inter, system-ui, sans-serif, sans-serif",mono:"ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace"}},border:{radius:{xs:"calc(var(--tsrd-font-size) * 0.125)",sm:"calc(var(--tsrd-font-size) * 0.25)",full:"9999px"}},size:{.5:"calc(var(--tsrd-font-size) * 0.125)",1:"calc(var(--tsrd-font-size) * 0.25)",1.5:"calc(var(--tsrd-font-size) * 0.375)",2:"calc(var(--tsrd-font-size) * 0.5)",2.5:"calc(var(--tsrd-font-size) * 0.625)",3:"calc(var(--tsrd-font-size) * 0.75)",4.5:"calc(var(--tsrd-font-size) * 1.125)",6.5:"calc(var(--tsrd-font-size) * 1.625)",12:"calc(var(--tsrd-font-size) * 3)"}},i={primary:{bg:o.colors.gray[900],hover:o.colors.gray[800],active:o.colors.gray[700],text:"#fff",border:o.colors.gray[900]},secondary:{bg:o.colors.gray[100],hover:o.colors.gray[200],active:o.colors.gray[300],text:o.colors.gray[900],border:o.colors.gray[300]},info:{bg:o.colors.blue[500],hover:o.colors.blue[600],active:o.colors.blue[700],text:"#fff",border:o.colors.blue[500]},warning:{bg:o.colors.yellow[500],hover:o.colors.yellow[600],active:o.colors.yellow[700],text:"#fff",border:o.colors.yellow[500]},danger:{bg:o.colors.red[500],hover:o.colors.red[600],active:o.colors.red[700],text:"#fff",border:o.colors.red[500]},success:{bg:o.colors.green[500],hover:o.colors.green[600],active:o.colors.green[700],text:"#fff",border:o.colors.green[500]}},a=t.css,s=function(){let e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:"dark",{colors:t,font:r,size:n,border:s}=o,{fontFamily:l}=r,c=(t,r)=>"light"===e?t:r;return{logo:a`
      cursor: pointer;
      display: flex;
      flex-direction: column;
      background-color: transparent;
      border: none;
      width: ${n[12]};
      height: ${n[12]};
      font-family: ${l.sans};
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
      color: ${c(t.gray[900],t.gray[100])};
      text-align: left;
    `,selectDescription:a`
      font-size: 0.8rem;
      color: ${c(t.gray[500],t.gray[400])};
      margin: 0;
      line-height: 1.3;
      text-align: left;
    `,select:a`
      appearance: none;
      width: 100%;
      padding: 0.5rem 3rem 0.5rem 0.75rem;
      border-radius: 0.375rem;
      background-color: ${c(t.gray[50],t.darkGray[800])};
      color: ${c(t.gray[900],t.gray[100])};
      border: 1px solid ${c(t.gray[200],t.gray[800])};
      font-size: 0.875rem;
      transition: all 0.15s ease;
      cursor: pointer;

      /* Custom arrow */
      background-image: url("data:image/svg+xml;utf8,<svg fill='%236b7280' height='20' viewBox='0 0 24 24' width='20' xmlns='http://www.w3.org/2000/svg'><path d='M7 10l5 5 5-5z'/></svg>");
      background-repeat: no-repeat;
      background-position: right 0.75rem center;
      background-size: 1.25rem;

      &:hover {
        border-color: ${c(t.gray[300],t.gray[700])};
      }

      &:focus {
        outline: none;
        border-color: ${t.gray[400]};
        box-shadow: 0 0 0 3px ${c(t.gray[200],t.gray[800])};
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
      color: ${c(t.gray[900],t.gray[100])};
      text-align: left;
    `,inputDescription:a`
      font-size: 0.8rem;
      color: ${c(t.gray[500],t.gray[400])};
      margin: 0;
      line-height: 1.3;
      text-align: left;
    `,input:a`
      appearance: none;
      box-sizing: border-box;
      width: 100%;
      padding: 0.5rem 0.75rem;
      border-radius: 0.375rem;
      background-color: ${c(t.gray[50],t.darkGray[800])};
      color: ${c(t.gray[900],t.gray[100])};
      border: 1px solid ${c(t.gray[200],t.gray[800])};
      font-size: 0.875rem;
      font-family: ${l.mono};
      transition: all 0.15s ease;

      &::placeholder {
        color: ${c(t.gray[400],t.gray[500])};
      }

      &:hover {
        border-color: ${c(t.gray[300],t.gray[700])};
      }

      &:focus {
        outline: none;
        border-color: ${c(t.gray[400],t.gray[600])};
        box-shadow: 0 0 0 3px ${c(t.gray[200],t.gray[800])};
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
        background-color: ${c(t.gray[50],t.darkGray[900])};
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
      border: 2px solid ${c(t.gray[300],t.gray[700])};
      border-radius: 0.25rem;
      background-color: ${c(t.gray[50],t.darkGray[800])};
      display: grid;
      place-items: center;
      transition: all 0.15s ease;
      flex-shrink: 0;
      margin-top: 0.125rem;

      &:hover {
        border-color: ${c(t.gray[400],t.gray[600])};
      }

      &:checked {
        background-color: ${c(t.gray[900],t.gray[100])};
        border-color: ${c(t.gray[900],t.gray[100])};
      }

      &:checked::after {
        content: '';
        width: 0.4rem;
        height: 0.6rem;
        border: solid ${c("#fff",t.gray[900])};
        border-width: 0 2px 2px 0;
        transform: rotate(45deg);
        margin-top: -3px;
      }
    `,checkboxLabel:a`
      color: ${c(t.gray[900],t.gray[100])};
      font-size: 0.875rem;
      font-weight: 500;
      line-height: 1.4;
      text-align: left;
    `,checkboxDescription:a`
      color: ${c(t.gray[500],t.gray[400])};
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
      `,variant(e,r,n){let o=i[e];return n?a`
            background: transparent;
            color: ${c(o.bg,o.bg)};
            border-color: transparent;
            &:hover {
              background: ${c(t.gray[100],t.darkGray[800])};
            }
            &:active {
              background: ${c(t.gray[200],t.darkGray[700])};
            }
          `:r?a`
            background: transparent;
            color: ${c(o.bg,o.bg)};
            border-color: ${c(o.bg,o.bg)};
            &:hover {
              background: ${c(t.gray[50],t.darkGray[800])};
              border-color: ${c(o.hover,o.hover)};
            }
            &:active {
              background: ${c(t.gray[100],t.darkGray[700])};
              border-color: ${c(o.active,o.active)};
            }
          `:a`
          background: ${c(o.bg,o.bg)};
          color: ${c(o.text,o.text)};
          border-color: ${c(o.border,o.border)};
          &:hover {
            background: ${c(o.hover,o.hover)};
            border-color: ${c(o.hover,o.hover)};
          }
          &:active {
            background: ${c(o.active,o.active)};
            border-color: ${c(o.active,o.active)};
          }
        `}},tag:{dot:e=>a`
        width: ${o.size[1.5]};
        height: ${o.size[1.5]};
        border-radius: ${o.border.radius.full};
        background-color: ${c(o.colors[e][500],o.colors[e][500])};
      `,base:a`
        display: flex;
        gap: ${o.size[1.5]};
        box-sizing: border-box;
        height: ${o.size[6.5]};
        background: ${c(t.gray[50],t.darkGray[500])};
        color: ${c(t.gray[700],t.gray[300])};
        border-radius: ${o.border.radius.sm};
        font-size: ${r.size.sm};
        padding: ${o.size[1]};
        padding-left: ${o.size[1.5]};
        align-items: center;
        font-weight: ${r.weight.medium};
        border: ${c("1px solid "+t.gray[300],"1px solid transparent")};
        user-select: none;
        position: relative;
        &:focus-visible {
          outline-offset: 2px;
          outline: 2px solid ${c(t.blue[700],t.blue[800])};
        }
      `,label:a`
        font-size: ${r.size.xs};
      `,count:a`
        font-size: ${r.size.xs};
        padding: 0 5px;
        display: flex;
        align-items: center;
        justify-content: center;
        color: ${c(t.gray[500],t.gray[400])};
        background-color: ${c(t.gray[200],t.darkGray[300])};
        border-radius: 2px;
        font-variant-numeric: tabular-nums;
        height: ${o.size[4.5]};
      `},tree:{info:a`
        color: ${c(t.gray[500],t.gray[500])};
        font-size: ${r.size.xs};
        margin-right: ${n[1]};
      `,actionButton:a`
        background-color: transparent;
        color: ${c(t.gray[500],t.gray[500])};
        border: none;
        display: inline-flex;
        padding: 0px;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        width: ${n[3]};
        height: ${n[3]};
        position: relative;
        z-index: 1;

        &:hover svg {
          color: ${c(t.gray[600],t.gray[400])};
        }

        &:focus-visible {
          border-radius: ${s.radius.xs};
          outline: 2px solid ${c(t.blue[700],t.blue[800])};
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
          stroke: ${c(t.blue[400],t.blue[300])};
        }
        & svg {
          width: ${n[3]};
          height: ${n[3]};
        }

        display: inline-flex;
        align-items: center;
        transition: all 0.1s ease;
      `,expandedLine:e=>a`
        display: block;
        padding-left: 0.75rem;
        margin-left: -0.7rem;
        ${e?`border-left: 1px solid ${c(t.blue[400],t.blue[300])};`:""}
      `,collapsible:a`
        cursor: pointer;
        transition: all 0.2s ease;
        &:hover {
          background-color: ${c(t.gray[100],t.darkGray[700])};
          border-radius: ${o.border.radius.sm};
          padding: 0 ${o.size[1]};
        }
      `,actions:a`
        display: inline-flex;
        margin-left: ${n[2]};
        gap: ${n[2]};
        align-items: center;
        & svg {
          height: 12px;
          width: 12px;
        }
      `,valueCollapsed:a`
        color: ${c(t.gray[500],t.gray[400])};
      `,valueFunction:a`
        color: ${c(t.cyan[500],t.cyan[400])};
      `,valueString:a`
        color: ${c(t.green[500],t.green[400])};
      `,valueNumber:a`
        color: ${c(t.yellow[500],t.yellow[400])};
      `,valueBoolean:a`
        color: ${c(t.pink[500],t.pink[400])};
      `,valueNull:a`
        color: ${c(t.gray[500],t.gray[400])};
        font-style: italic;
      `,valueKey:a`
        color: ${c(t.blue[400],t.blue[300])};
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
        border-bottom: ${c(t.gray[300],t.darkGray[500])} 1px solid;
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
          gap: ${n[.5]};
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
          border-radius: ${s.radius.xs};
          outline: 2px solid ${t.blue[800]};
        }
      `,tanstackLogo:a`
        font-size: ${r.size.md};
        font-weight: ${r.weight.bold};
        line-height: ${r.lineHeight.xs};
        white-space: nowrap;
        color: ${c(t.gray[700],t.gray[300])};
      `,flavorLogo:(e,t)=>a`
        font-weight: ${r.weight.semibold};
        font-size: ${r.size.xs};
        background: linear-gradient(to right, ${c(e,t)});
        background-clip: text;
        -webkit-background-clip: text;
        line-height: 1;
        -webkit-text-fill-color: transparent;
        white-space: nowrap;
      `},section:{main:a`
        margin-bottom: 1.5rem;
        padding: 1rem;
        background-color: ${c(t.gray[50],t.darkGray[800])};
        border: 1px solid ${c(t.gray[200],t.gray[800])};
        border-radius: 0.5rem;
        box-shadow: none;
      `,title:a`
        font-size: 1rem;
        font-weight: 600;
        color: ${c(t.gray[900],t.gray[100])};
        margin: 0 0 0.75rem 0;
        padding-bottom: 0.5rem;
        border-bottom: 1px solid ${c(t.gray[200],t.gray[800])};
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
        color: ${c(t.gray[700],t.gray[400])};
      `,description:a`
        color: ${c(t.gray[500],t.gray[400])};
        font-size: 0.8rem;
        margin: 0 0 1rem 0;
        line-height: 1.4;
        text-align: left;
      `},mainPanel:{panel:e=>a`
        padding: ${e?o.size[3]:0};
        background: ${c(t.gray[50],t.darkGray[700])};
        overflow-y: auto;
        height: 100%;
      `}}};function l(){let{theme:e}=(0,n.useTheme)(),[t,o]=(0,r.createSignal)(s(e()));return(0,r.createEffect)(()=>{o(s(e()))}),t}e.s(["css",()=>a,"useStyles",()=>l],419695)},492859,e=>{"use strict";var t=e.i(766932),r=e.i(278322),n=e.i(7284),o=e.i(419695),i=(0,t.template)("<div>");let a=e=>{var a;let{className:s,children:l,class:c,withPadding:d}=e,g=(0,o.useStyles)();return a=i(),(0,t.insert)(a,l),(0,r.effect)(()=>(0,t.className)(a,(0,n.default)(g().mainPanel.panel(!!d),s,c))),a};e.s(["MainPanel",()=>a])},596190,e=>{"use strict";var t=e.i(766932),r=e.i(278322),n=(0,t.template)('<svg width=24 height=24 viewBox="0 0 24 24"fill=none xmlns=http://www.w3.org/2000/svg><path class=copier d="M8 8V5.2C8 4.0799 8 3.51984 8.21799 3.09202C8.40973 2.71569 8.71569 2.40973 9.09202 2.21799C9.51984 2 10.0799 2 11.2 2H18.8C19.9201 2 20.4802 2 20.908 2.21799C21.2843 2.40973 21.5903 2.71569 21.782 3.09202C22 3.51984 22 4.0799 22 5.2V12.8C22 13.9201 22 14.4802 21.782 14.908C21.5903 15.2843 21.2843 15.5903 20.908 15.782C20.4802 16 19.9201 16 18.8 16H16M5.2 22H12.8C13.9201 22 14.4802 22 14.908 21.782C15.2843 21.5903 15.5903 21.2843 15.782 20.908C16 20.4802 16 19.9201 16 18.8V11.2C16 10.0799 16 9.51984 15.782 9.09202C15.5903 8.71569 15.2843 8.40973 14.908 8.21799C14.4802 8 13.9201 8 12.8 8H5.2C4.0799 8 3.51984 8 3.09202 8.21799C2.71569 8.40973 2.40973 8.71569 2.21799 9.09202C2 9.51984 2 10.0799 2 11.2V18.8C2 19.9201 2 20.4802 2.21799 20.908C2.40973 21.2843 2.71569 21.5903 3.09202 21.782C3.51984 22 4.07989 22 5.2 22Z"stroke-width=2 stroke-linecap=round stroke-linejoin=round stroke=currentColor>'),o=(0,t.template)('<svg xmlns=http://www.w3.org/2000/svg width=24 height=24 viewBox="0 0 24 24"fill=none stroke=currentColor stroke-width=2 stroke-linecap=round stroke-linejoin=round><path d="M8 6h10"></path><path d="M6 12h9"></path><path d="M11 18h7">'),i=(0,t.template)('<svg xmlns=http://www.w3.org/2000/svg width=24 height=24 viewBox="0 0 24 24"fill=none stroke=currentColor stroke-width=2 stroke-linecap=round stroke-linejoin=round class="lucide lucide-file-search2-icon lucide-file-search-2"><path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"></path><path d="M14 2v4a2 2 0 0 0 2 2h4"></path><circle cx=11.5 cy=14.5 r=2.5></circle><path d="M13.3 16.3 15 18">'),a=(0,t.template)('<svg xmlns=http://www.w3.org/2000/svg width=24 height=24 viewBox="0 0 24 24"fill=none stroke=currentColor stroke-width=2 stroke-linecap=round stroke-linejoin=round><path d="M12 20a8 8 0 1 0 0-16 8 8 0 0 0 0 16Z"></path><path d="M12 14a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z"></path><path d="M12 2v2"></path><path d="M12 22v-2"></path><path d="m17 20.66-1-1.73"></path><path d="M11 10.27 7 3.34"></path><path d="m20.66 17-1.73-1"></path><path d="m3.34 7 1.73 1"></path><path d="M14 12h8"></path><path d="M2 12h2"></path><path d="m20.66 7-1.73 1"></path><path d="m3.34 17 1.73-1"></path><path d="m17 3.34-1 1.73"></path><path d="m11 13.73-4 6.93">'),s=(0,t.template)('<svg xmlns=http://www.w3.org/2000/svg width=20 height=20 viewBox="0 0 24 24"fill=none stroke=currentColor stroke-width=2 stroke-linecap=round stroke-linejoin=round><path d="m10 9-3 3 3 3"></path><path d="m14 15 3-3-3-3"></path><path d="M2.992 16.342a2 2 0 0 1 .094 1.167l-1.065 3.29a1 1 0 0 0 1.236 1.168l3.413-.998a2 2 0 0 1 1.099.092 10 10 0 1 0-4.777-4.719">'),l=(0,t.template)('<svg xmlns=http://www.w3.org/2000/svg width=20 height=20 viewBox="0 0 24 24"fill=none stroke=currentColor stroke-width=2 stroke-linecap=round stroke-linejoin=round><path d="M10 8h.01"></path><path d="M12 12h.01"></path><path d="M14 8h.01"></path><path d="M16 12h.01"></path><path d="M18 8h.01"></path><path d="M6 8h.01"></path><path d="M7 16h10"></path><path d="M8 12h.01"></path><rect width=20 height=16 x=2 y=4 rx=2>'),c=(0,t.template)('<svg xmlns=http://www.w3.org/2000/svg width=20 height=20 viewBox="0 0 24 24"fill=none stroke=currentColor stroke-width=2 stroke-linecap=round stroke-linejoin=round><path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0"></path><circle cx=12 cy=10 r=3>'),d=(0,t.template)('<svg xmlns=http://www.w3.org/2000/svg width=20 height=20 viewBox="0 0 24 24"fill=none stroke=currentColor stroke-width=2 stroke-linecap=round stroke-linejoin=round><path d="M9 17H7A5 5 0 0 1 7 7h2"></path><path d="M15 7h2a5 5 0 1 1 0 10h-2"></path><line x1=8 x2=16 y1=12 y2=12>'),g=(0,t.template)('<svg xmlns=http://www.w3.org/2000/svg width=24 height=24 viewBox="0 0 24 24"fill=none stroke=currentColor stroke-width=2 stroke-linecap=round stroke-linejoin=round><path d="M18 6 6 18"></path><path d="m6 6 12 12">'),h=(0,t.template)('<svg width=20 height=20 viewBox="0 0 24 24"fill=none xmlns=http://www.w3.org/2000/svg><path d="M16.5 9.39999L7.5 4.20999M12 17.5L12 3M21 16V7.99999C20.9996 7.64926 20.9071 7.30481 20.7315 7.00116C20.556 6.69751 20.3037 6.44536 20 6.26999L13 2.26999C12.696 2.09446 12.3511 2.00204 12 2.00204C11.6489 2.00204 11.304 2.09446 11 2.26999L4 6.26999C3.69626 6.44536 3.44398 6.69751 3.26846 7.00116C3.09294 7.30481 3.00036 7.64926 3 7.99999V16C3.00036 16.3507 3.09294 16.6952 3.26846 16.9988C3.44398 17.3025 3.69626 17.5546 4 17.73L11 21.73C11.304 21.9055 11.6489 21.998 12 21.998C12.3511 21.998 12.696 21.9055 13 21.73L20 17.73C20.3037 17.5546 20.556 17.3025 20.7315 16.9988C20.9071 16.6952 20.9996 16.3507 21 16Z"stroke=currentColor stroke-width=2 stroke-linecap=round stroke-linejoin=round>'),u=(0,t.template)('<svg width=18 height=18 viewBox="0 0 24 24"fill=none xmlns=http://www.w3.org/2000/svg><path d="M22 11.08V12C21.9988 14.1564 21.3005 16.2547 20.0093 17.9818C18.7182 19.7088 16.9033 20.9725 14.8354 21.5839C12.7674 22.1953 10.5573 22.1219 8.53447 21.3746C6.51168 20.6273 4.78465 19.2461 3.61096 17.4371C2.43727 15.628 1.87979 13.4881 2.02168 11.3363C2.16356 9.18455 2.99721 7.13631 4.39828 5.49706C5.79935 3.85781 7.69279 2.71537 9.79619 2.24013C11.8996 1.76489 14.1003 1.98232 16.07 2.85999M22 4L12 14.01L9 11.01"stroke=currentColor stroke-width=2 stroke-linecap=round stroke-linejoin=round>'),p=(0,t.template)('<svg width=18 height=18 viewBox="0 0 24 24"fill=none xmlns=http://www.w3.org/2000/svg><path d="M15 9L9 15M9 9L15 15M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12Z"stroke=currentColor stroke-width=2 stroke-linecap=round stroke-linejoin=round>'),v=(0,t.template)('<svg width=20 height=20 viewBox="0 0 24 24"fill=none xmlns=http://www.w3.org/2000/svg><path d="M6 9L12 15L18 9"stroke=currentColor stroke-width=2 stroke-linecap=round stroke-linejoin=round>'),f=(0,t.template)('<svg width=18 height=18 viewBox="0 0 24 24"fill=none xmlns=http://www.w3.org/2000/svg><path d="M21 21L15 15M17 10C17 13.866 13.866 17 10 17C6.13401 17 3 13.866 3 10C3 6.13401 6.13401 3 10 3C13.866 3 17 6.13401 17 10Z"stroke=currentColor stroke-width=2 stroke-linecap=round stroke-linejoin=round>'),b=(0,t.template)('<svg width=12 height=12 viewBox="0 0 24 24"fill=none xmlns=http://www.w3.org/2000/svg><path d="M21 13V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H11M15 3H21M21 3V9M21 3L10 14"stroke=currentColor stroke-width=2 stroke-linecap=round stroke-linejoin=round>'),C=(0,t.template)('<svg width=20 height=20 viewBox="0 0 24 24"fill=none xmlns=http://www.w3.org/2000/svg><path d="M12 15C13.6569 15 15 13.6569 15 12C15 10.3431 13.6569 9 12 9C10.3431 9 9 10.3431 9 12C9 13.6569 10.3431 15 12 15Z"stroke=currentColor stroke-width=2 stroke-linecap=round stroke-linejoin=round></path><path d="M19.4 15C19.2669 15.3016 19.2272 15.6362 19.286 15.9606C19.3448 16.285 19.4995 16.5843 19.73 16.82L19.79 16.88C19.976 17.0657 20.1235 17.2863 20.2241 17.5291C20.3248 17.7719 20.3766 18.0322 20.3766 18.295C20.3766 18.5578 20.3248 18.8181 20.2241 19.0609C20.1235 19.3037 19.976 19.5243 19.79 19.71C19.6043 19.896 19.3837 20.0435 19.1409 20.1441C18.8981 20.2448 18.6378 20.2966 18.375 20.2966C18.1122 20.2966 17.8519 20.2448 17.6091 20.1441C17.3663 20.0435 17.1457 19.896 16.96 19.71L16.9 19.65C16.6643 19.4195 16.365 19.2648 16.0406 19.206C15.7162 19.1472 15.3816 19.1869 15.08 19.32C14.7842 19.4468 14.532 19.6572 14.3543 19.9255C14.1766 20.1938 14.0813 20.5082 14.08 20.83V21C14.08 21.5304 13.8693 22.0391 13.4942 22.4142C13.1191 22.7893 12.6104 23 12.08 23C11.5496 23 11.0409 22.7893 10.6658 22.4142C10.2907 22.0391 10.08 21.5304 10.08 21V20.91C10.0723 20.579 9.96512 20.258 9.77251 19.9887C9.5799 19.7194 9.31074 19.5143 9 19.4C8.69838 19.2669 8.36381 19.2272 8.03941 19.286C7.71502 19.3448 7.41568 19.4995 7.18 19.73L7.12 19.79C6.93425 19.976 6.71368 20.1235 6.47088 20.2241C6.22808 20.3248 5.96783 20.3766 5.705 20.3766C5.44217 20.3766 5.18192 20.3248 4.93912 20.2241C4.69632 20.1235 4.47575 19.976 4.29 19.79C4.10405 19.6043 3.95653 19.3837 3.85588 19.1409C3.75523 18.8981 3.70343 18.6378 3.70343 18.375C3.70343 18.1122 3.75523 17.8519 3.85588 17.6091C3.95653 17.3663 4.10405 17.1457 4.29 16.96L4.35 16.9C4.58054 16.6643 4.73519 16.365 4.794 16.0406C4.85282 15.7162 4.81312 15.3816 4.68 15.08C4.55324 14.7842 4.34276 14.532 4.07447 14.3543C3.80618 14.1766 3.49179 14.0813 3.17 14.08H3C2.46957 14.08 1.96086 13.8693 1.58579 13.4942C1.21071 13.1191 1 12.6104 1 12.08C1 11.5496 1.21071 11.0409 1.58579 10.6658C1.96086 10.2907 2.46957 10.08 3 10.08H3.09C3.42099 10.0723 3.742 9.96512 4.0113 9.77251C4.28059 9.5799 4.48572 9.31074 4.6 9C4.73312 8.69838 4.77282 8.36381 4.714 8.03941C4.65519 7.71502 4.50054 7.41568 4.27 7.18L4.21 7.12C4.02405 6.93425 3.87653 6.71368 3.77588 6.47088C3.67523 6.22808 3.62343 5.96783 3.62343 5.705C3.62343 5.44217 3.67523 5.18192 3.77588 4.93912C3.87653 4.69632 4.02405 4.47575 4.21 4.29C4.39575 4.10405 4.61632 3.95653 4.85912 3.85588C5.10192 3.75523 5.36217 3.70343 5.625 3.70343C5.88783 3.70343 6.14808 3.75523 6.39088 3.85588C6.63368 3.95653 6.85425 4.10405 7.04 4.29L7.1 4.35C7.33568 4.58054 7.63502 4.73519 7.95941 4.794C8.28381 4.85282 8.61838 4.81312 8.92 4.68H9C9.29577 4.55324 9.54802 4.34276 9.72569 4.07447C9.90337 3.80618 9.99872 3.49179 10 3.17V3C10 2.46957 10.2107 1.96086 10.5858 1.58579C10.9609 1.21071 11.4696 1 12 1C12.5304 1 13.0391 1.21071 13.4142 1.58579C13.7893 1.96086 14 2.46957 14 3V3.09C14.0013 3.41179 14.0966 3.72618 14.2743 3.99447C14.452 4.26276 14.7042 4.47324 15 4.6C15.3016 4.73312 15.6362 4.77282 15.9606 4.714C16.285 4.65519 16.5843 4.50054 16.82 4.27L16.88 4.21C17.0657 4.02405 17.2863 3.87653 17.5291 3.77588C17.7719 3.67523 18.0322 3.62343 18.295 3.62343C18.5578 3.62343 18.8181 3.67523 19.0609 3.77588C19.3037 3.87653 19.5243 4.02405 19.71 4.21C19.896 4.39575 20.0435 4.61632 20.1441 4.85912C20.2448 5.10192 20.2966 5.36217 20.2966 5.625C20.2966 5.88783 20.2448 6.14808 20.1441 6.39088C20.0435 6.63368 19.896 6.85425 19.71 7.04L19.65 7.1C19.4195 7.33568 19.2648 7.63502 19.206 7.95941C19.1472 8.28381 19.1869 8.61838 19.32 8.92V9C19.4468 9.29577 19.6572 9.54802 19.9255 9.72569C20.1938 9.90337 20.5082 9.99872 20.83 10H21C21.5304 10 22.0391 10.2107 22.4142 10.5858C22.7893 10.9609 23 11.4696 23 12C23 12.5304 22.7893 13.0391 22.4142 13.4142C22.0391 13.7893 21.5304 14 21 14H20.91C20.5882 14.0013 20.2738 14.0966 20.0055 14.2743C19.7372 14.452 19.5268 14.7042 19.4 15Z"stroke=currentColor stroke-width=2 stroke-linecap=round stroke-linejoin=round>'),m=(0,t.template)('<svg width=20 height=20 viewBox="0 0 24 24"fill=none xmlns=http://www.w3.org/2000/svg><path d="M18 6L6 18M6 6L18 18"stroke=currentColor stroke-width=2 stroke-linecap=round stroke-linejoin=round>'),w=(0,t.template)('<svg xmlns=http://www.w3.org/2000/svg width=24 height=24 viewBox="0 0 24 24"fill=none stroke=currentColor stroke-width=2 stroke-linecap=round stroke-linejoin=round><path d="M2 10h6V4"></path><path d="m2 4 6 6"></path><path d="M21 10V7a2 2 0 0 0-2-2h-7"></path><path d="M3 14v2a2 2 0 0 0 2 2h3"></path><rect x=12 y=14 width=10 height=7 rx=1>'),y=(0,t.template)('<svg width=24 height=24 viewBox="0 0 24 24"fill=none xmlns=http://www.w3.org/2000/svg><path d="M7.5 12L10.5 15L16.5 9M7.8 21H16.2C17.8802 21 18.7202 21 19.362 20.673C19.9265 20.3854 20.3854 19.9265 20.673 19.362C21 18.7202 21 17.8802 21 16.2V7.8C21 6.11984 21 5.27976 20.673 4.63803C20.3854 4.07354 19.9265 3.6146 19.362 3.32698C18.7202 3 17.8802 3 16.2 3H7.8C6.11984 3 5.27976 3 4.63803 3.32698C4.07354 3.6146 3.6146 4.07354 3.32698 4.63803C3 5.27976 3 6.11984 3 7.8V16.2C3 17.8802 3 18.7202 3.32698 19.362C3.6146 19.9265 4.07354 20.3854 4.63803 20.673C5.27976 21 6.11984 21 7.8 21Z"stroke-width=2 stroke-linecap=round stroke-linejoin=round>'),k=(0,t.template)('<svg width=24 height=24 viewBox="0 0 24 24"fill=none xmlns=http://www.w3.org/2000/svg><path d="M9 9L15 15M15 9L9 15M7.8 21H16.2C17.8802 21 18.7202 21 19.362 20.673C19.9265 20.3854 20.3854 19.9265 20.673 19.362C21 18.7202 21 17.8802 21 16.2V7.8C21 6.11984 21 5.27976 20.673 4.63803C20.3854 4.07354 19.9265 3.6146 19.362 3.32698C18.7202 3 17.8802 3 16.2 3H7.8C6.11984 3 5.27976 3 4.63803 3.32698C4.07354 3.6146 3.6146 4.07354 3.32698 4.63803C3 5.27976 3 6.11984 3 7.8V16.2C3 17.8802 3 18.7202 3.32698 19.362C3.6146 19.9265 4.07354 20.3854 4.63803 20.673C5.27976 21 6.11984 21 7.8 21Z"stroke=#F04438 stroke-width=2 stroke-linecap=round stroke-linejoin=round>');function x(){return n()}function $(){return o()}function E(){return i()}function L(){return a()}function F(){return s()}function M(){return l()}function z(){return c()}function T(){return s()}function B(){return d()}function I(){return g()}function A(){return h()}function S(){return u()}function j(){return p()}function N(){return v()}function D(){return f()}function P(){return b()}function V(){return C()}function H(){return m()}function G(){return w()}function _(e){var n,o;return o=(n=y()).firstChild,(0,r.effect)(()=>(0,t.setAttribute)(o,"stroke","dark"===e.theme?"#12B76A":"#027A48")),n}function Z(){return k()}e.s(["CheckCircleIcon",()=>S,"ChevronDownIcon",()=>N,"CloseIcon",()=>H,"Cogs",()=>L,"CopiedCopier",()=>_,"Copier",()=>x,"ErrorCopier",()=>Z,"ExternalLinkIcon",()=>P,"GeoTag",()=>z,"Keyboard",()=>M,"Link",()=>B,"List",()=>$,"PackageIcon",()=>A,"PageSearch",()=>E,"PiP",()=>G,"SearchIcon",()=>D,"SettingsCog",()=>F,"SettingsIcon",()=>V,"SocialBubble",()=>T,"X",()=>I,"XCircleIcon",()=>j])},201704,e=>{"use strict";class t{#e=!0;#t;#r;#n;#o;#i;#a;#s;#l=0;#c=5;#d=!1;#g=!1;#h=null;#u=()=>{this.debugLog("Connected to event bus"),this.#i=!0,this.#d=!1,this.debugLog("Emitting queued events",this.#o),this.#o.forEach(e=>this.emitEventToBus(e)),this.#o=[],this.stopConnectLoop(),this.#r().removeEventListener("tanstack-connect-success",this.#u)};#p=()=>{if(this.#l<this.#c){this.#l++,this.dispatchCustomEvent("tanstack-connect",{});return}this.#r().removeEventListener("tanstack-connect",this.#p),this.#g=!0,this.debugLog("Max retries reached, giving up on connection"),this.stopConnectLoop()};#v=()=>{this.#d||(this.#d=!0,this.#r().addEventListener("tanstack-connect-success",this.#u),this.#p())};constructor({pluginId:e,debug:t=!1,enabled:r=!0,reconnectEveryMs:n=300}){this.#t=e,this.#e=r,this.#r=this.getGlobalTarget,this.#n=t,this.debugLog(" Initializing event subscription for plugin",this.#t),this.#o=[],this.#i=!1,this.#g=!1,this.#a=null,this.#s=n}startConnectLoop(){null!==this.#a||this.#i||(this.debugLog(`Starting connect loop (every ${this.#s}ms)`),this.#a=setInterval(this.#p,this.#s))}stopConnectLoop(){this.#d=!1,null!==this.#a&&(clearInterval(this.#a),this.#a=null,this.#o=[],this.debugLog("Stopped connect loop"))}debugLog(){for(var e=arguments.length,t=Array(e),r=0;r<e;r++)t[r]=arguments[r];this.#n&&console.log(`🌴 [tanstack-devtools:${this.#t}-plugin]`,...t)}getGlobalTarget(){if("u">typeof globalThis&&globalThis.__TANSTACK_EVENT_TARGET__)return this.debugLog("Using global event target"),globalThis.__TANSTACK_EVENT_TARGET__;if("u">typeof window&&void 0!==window.addEventListener)return this.debugLog("Using window as event target"),window;let e="u">typeof EventTarget?new EventTarget:void 0;return void 0===e||void 0===e.addEventListener?(this.debugLog("No event mechanism available, running in non-web environment"),{addEventListener:()=>{},removeEventListener:()=>{},dispatchEvent:()=>!1}):(this.debugLog("Using new EventTarget as fallback"),e)}getPluginId(){return this.#t}dispatchCustomEventShim(e,t){try{let r=new Event(e,{detail:t});this.#r().dispatchEvent(r)}catch(e){this.debugLog("Failed to dispatch shim event")}}dispatchCustomEvent(e,t){try{this.#r().dispatchEvent(new CustomEvent(e,{detail:t}))}catch(r){this.dispatchCustomEventShim(e,t)}}emitEventToBus(e){this.debugLog("Emitting event to client bus",e),this.dispatchCustomEvent("tanstack-dispatch-event",e)}createEventPayload(e,t){return{type:`${this.#t}:${e}`,payload:t,pluginId:this.#t}}emit(e,t){if(!this.#e)return void this.debugLog("Event bus client is disabled, not emitting event",e,t);if(this.#h&&(this.debugLog("Emitting event to internal event target",e,t),this.#h.dispatchEvent(new CustomEvent(`${this.#t}:${e}`,{detail:this.createEventPayload(e,t)}))),this.#g)return void this.debugLog("Previously failed to connect, not emitting to bus");if(!this.#i){this.debugLog("Bus not available, will be pushed as soon as connected"),this.#o.push(this.createEventPayload(e,t)),"u">typeof CustomEvent&&!this.#d&&(this.#v(),this.startConnectLoop());return}return this.emitEventToBus(this.createEventPayload(e,t))}on(e,t,r){let n=r?.withEventTarget??!1,o=`${this.#t}:${e}`;if(n&&(this.#h||(this.#h=new EventTarget),this.#h.addEventListener(o,e=>{t(e.detail)})),!this.#e)return this.debugLog("Event bus client is disabled, not registering event",o),()=>{};let i=e=>{this.debugLog("Received event from bus",e.detail),t(e.detail)};return this.#r().addEventListener(o,i),this.debugLog("Registered event to bus",o),()=>{n&&this.#h?.removeEventListener(o,i),this.#r().removeEventListener(o,i)}}onAll(e){if(!this.#e)return this.debugLog("Event bus client is disabled, not registering event"),()=>{};let t=t=>{e(t.detail)};return this.#r().addEventListener("tanstack-devtools-global",t),()=>this.#r().removeEventListener("tanstack-devtools-global",t)}onAllPluginEvents(e){if(!this.#e)return this.debugLog("Event bus client is disabled, not registering event"),()=>{};let t=t=>{let r=t.detail;this.#t&&r.pluginId!==this.#t||e(r)};return this.#r().addEventListener("tanstack-devtools-global",t),()=>this.#r().removeEventListener("tanstack-devtools-global",t)}}e.s(["EventClient",()=>t])}]);