(globalThis.TURBOPACK||(globalThis.TURBOPACK=[])).push(["object"==typeof document?document.currentScript:void 0,585458,(e,t,r)=>{e.e,t.exports=function(){"use strict";var e="millisecond",t="second",r="minute",n="hour",a="week",o="month",i="quarter",s="year",l="date",d="Invalid Date",c=/^(\d{4})[-/]?(\d{1,2})?[-/]?(\d{0,2})[Tt\s]*(\d{1,2})?:?(\d{1,2})?:?(\d{1,2})?[.:]?(\d+)?$/,u=/\[([^\]]+)]|Y{1,4}|M{1,4}|D{1,2}|d{1,4}|H{1,2}|h{1,2}|a|A|m{1,2}|s{1,2}|Z{1,2}|SSS/g,g=function(e,t,r){var n=String(e);return!n||n.length>=t?e:""+Array(t+1-n.length).join(r)+e},p="en",h={};h[p]={name:"en",weekdays:"Sunday_Monday_Tuesday_Wednesday_Thursday_Friday_Saturday".split("_"),months:"January_February_March_April_May_June_July_August_September_October_November_December".split("_"),ordinal:function(e){var t=["th","st","nd","rd"],r=e%100;return"["+e+(t[(r-20)%10]||t[r]||t[0])+"]"}};var f="$isDayjsObject",m=function(e){return e instanceof C||!(!e||!e[f])},v=function e(t,r,n){var a;if(!t)return p;if("string"==typeof t){var o=t.toLowerCase();h[o]&&(a=o),r&&(h[o]=r,a=o);var i=t.split("-");if(!a&&i.length>1)return e(i[0])}else{var s=t.name;h[s]=t,a=s}return!n&&a&&(p=a),a||!n&&p},y=function(e,t){if(m(e))return e.clone();var r="object"==typeof t?t:{};return r.date=e,r.args=arguments,new C(r)},b={s:g,z:function(e){var t=-e.utcOffset(),r=Math.abs(t);return(t<=0?"+":"-")+g(Math.floor(r/60),2,"0")+":"+g(r%60,2,"0")},m:function e(t,r){if(t.date()<r.date())return-e(r,t);var n=12*(r.year()-t.year())+(r.month()-t.month()),a=t.clone().add(n,o),i=r-a<0,s=t.clone().add(n+(i?-1:1),o);return+(-(n+(r-a)/(i?a-s:s-a))||0)},a:function(e){return e<0?Math.ceil(e)||0:Math.floor(e)},p:function(d){return({M:o,y:s,w:a,d:"day",D:l,h:n,m:r,s:t,ms:e,Q:i})[d]||String(d||"").toLowerCase().replace(/s$/,"")},u:function(e){return void 0===e}};b.l=v,b.i=m,b.w=function(e,t){return y(e,{locale:t.$L,utc:t.$u,x:t.$x,$offset:t.$offset})};var C=function(){function g(e){this.$L=v(e.locale,null,!0),this.parse(e),this.$x=this.$x||e.x||{},this[f]=!0}var p=g.prototype;return p.parse=function(e){this.$d=function(e){var t=e.date,r=e.utc;if(null===t)return new Date(NaN);if(b.u(t))return new Date;if(t instanceof Date)return new Date(t);if("string"==typeof t&&!/Z$/i.test(t)){var n=t.match(c);if(n){var a=n[2]-1||0,o=(n[7]||"0").substring(0,3);return r?new Date(Date.UTC(n[1],a,n[3]||1,n[4]||0,n[5]||0,n[6]||0,o)):new Date(n[1],a,n[3]||1,n[4]||0,n[5]||0,n[6]||0,o)}}return new Date(t)}(e),this.init()},p.init=function(){var e=this.$d;this.$y=e.getFullYear(),this.$M=e.getMonth(),this.$D=e.getDate(),this.$W=e.getDay(),this.$H=e.getHours(),this.$m=e.getMinutes(),this.$s=e.getSeconds(),this.$ms=e.getMilliseconds()},p.$utils=function(){return b},p.isValid=function(){return this.$d.toString()!==d},p.isSame=function(e,t){var r=y(e);return this.startOf(t)<=r&&r<=this.endOf(t)},p.isAfter=function(e,t){return y(e)<this.startOf(t)},p.isBefore=function(e,t){return this.endOf(t)<y(e)},p.$g=function(e,t,r){return b.u(e)?this[t]:this.set(r,e)},p.unix=function(){return Math.floor(this.valueOf()/1e3)},p.valueOf=function(){return this.$d.getTime()},p.startOf=function(e,i){var d=this,c=!!b.u(i)||i,u=b.p(e),g=function(e,t){var r=b.w(d.$u?Date.UTC(d.$y,t,e):new Date(d.$y,t,e),d);return c?r:r.endOf("day")},p=function(e,t){return b.w(d.toDate()[e].apply(d.toDate("s"),(c?[0,0,0,0]:[23,59,59,999]).slice(t)),d)},h=this.$W,f=this.$M,m=this.$D,v="set"+(this.$u?"UTC":"");switch(u){case s:return c?g(1,0):g(31,11);case o:return c?g(1,f):g(0,f+1);case a:var y=this.$locale().weekStart||0,C=(h<y?h+7:h)-y;return g(c?m-C:m+(6-C),f);case"day":case l:return p(v+"Hours",0);case n:return p(v+"Minutes",1);case r:return p(v+"Seconds",2);case t:return p(v+"Milliseconds",3);default:return this.clone()}},p.endOf=function(e){return this.startOf(e,!1)},p.$set=function(a,i){var d,c=b.p(a),u="set"+(this.$u?"UTC":""),g=((d={}).day=u+"Date",d[l]=u+"Date",d[o]=u+"Month",d[s]=u+"FullYear",d[n]=u+"Hours",d[r]=u+"Minutes",d[t]=u+"Seconds",d[e]=u+"Milliseconds",d)[c],p="day"===c?this.$D+(i-this.$W):i;if(c===o||c===s){var h=this.clone().set(l,1);h.$d[g](p),h.init(),this.$d=h.set(l,Math.min(this.$D,h.daysInMonth())).$d}else g&&this.$d[g](p);return this.init(),this},p.set=function(e,t){return this.clone().$set(e,t)},p.get=function(e){return this[b.p(e)]()},p.add=function(e,i){var l,d=this;e=Number(e);var c=b.p(i),u=function(t){var r=y(d);return b.w(r.date(r.date()+Math.round(t*e)),d)};if(c===o)return this.set(o,this.$M+e);if(c===s)return this.set(s,this.$y+e);if("day"===c)return u(1);if(c===a)return u(7);var g=((l={})[r]=6e4,l[n]=36e5,l[t]=1e3,l)[c]||1,p=this.$d.getTime()+e*g;return b.w(p,this)},p.subtract=function(e,t){return this.add(-1*e,t)},p.format=function(e){var t=this,r=this.$locale();if(!this.isValid())return r.invalidDate||d;var n=e||"YYYY-MM-DDTHH:mm:ssZ",a=b.z(this),o=this.$H,i=this.$m,s=this.$M,l=r.weekdays,c=r.months,g=r.meridiem,p=function(e,r,a,o){return e&&(e[r]||e(t,n))||a[r].slice(0,o)},h=function(e){return b.s(o%12||12,e,"0")},f=g||function(e,t,r){var n=e<12?"AM":"PM";return r?n.toLowerCase():n};return n.replace(u,function(e,n){return n||function(e){switch(e){case"YY":return String(t.$y).slice(-2);case"YYYY":return b.s(t.$y,4,"0");case"M":return s+1;case"MM":return b.s(s+1,2,"0");case"MMM":return p(r.monthsShort,s,c,3);case"MMMM":return p(c,s);case"D":return t.$D;case"DD":return b.s(t.$D,2,"0");case"d":return String(t.$W);case"dd":return p(r.weekdaysMin,t.$W,l,2);case"ddd":return p(r.weekdaysShort,t.$W,l,3);case"dddd":return l[t.$W];case"H":return String(o);case"HH":return b.s(o,2,"0");case"h":return h(1);case"hh":return h(2);case"a":return f(o,i,!0);case"A":return f(o,i,!1);case"m":return String(i);case"mm":return b.s(i,2,"0");case"s":return String(t.$s);case"ss":return b.s(t.$s,2,"0");case"SSS":return b.s(t.$ms,3,"0");case"Z":return a}return null}(e)||a.replace(":","")})},p.utcOffset=function(){return-(15*Math.round(this.$d.getTimezoneOffset()/15))},p.diff=function(e,l,d){var c,u=this,g=b.p(l),p=y(e),h=(p.utcOffset()-this.utcOffset())*6e4,f=this-p,m=function(){return b.m(u,p)};switch(g){case s:c=m()/12;break;case o:c=m();break;case i:c=m()/3;break;case a:c=(f-h)/6048e5;break;case"day":c=(f-h)/864e5;break;case n:c=f/36e5;break;case r:c=f/6e4;break;case t:c=f/1e3;break;default:c=f}return d?c:b.a(c)},p.daysInMonth=function(){return this.endOf(o).$D},p.$locale=function(){return h[this.$L]},p.locale=function(e,t){if(!e)return this.$L;var r=this.clone(),n=v(e,t,!0);return n&&(r.$L=n),r},p.clone=function(){return b.w(this.$d,this)},p.toDate=function(){return new Date(this.valueOf())},p.toJSON=function(){return this.isValid()?this.toISOString():null},p.toISOString=function(){return this.$d.toISOString()},p.toString=function(){return this.$d.toUTCString()},g}(),x=C.prototype;return y.prototype=x,[["$ms",e],["$s",t],["$m",r],["$H",n],["$W","day"],["$M",o],["$y",s],["$D",l]].forEach(function(e){x[e[1]]=function(t){return this.$g(t,e[0],e[1])}}),y.extend=function(e,t){return e.$i||(e(t,C,y),e.$i=!0),y},y.locale=v,y.isDayjs=m,y.unix=function(e){return y(1e3*e)},y.en=h[p],y.Ls=h,y.p={},y}()},612437,(e,t,r)=>{e.e,t.exports=function(e,t,r){e=e||{};var n=t.prototype,a={future:"in %s",past:"%s ago",s:"a few seconds",m:"a minute",mm:"%d minutes",h:"an hour",hh:"%d hours",d:"a day",dd:"%d days",M:"a month",MM:"%d months",y:"a year",yy:"%d years"};function o(e,t,r,a){return n.fromToBase(e,t,r,a)}r.en.relativeTime=a,n.fromToBase=function(t,n,o,i,s){for(var l,d,c,u=o.$locale().relativeTime||a,g=e.thresholds||[{l:"s",r:44,d:"second"},{l:"m",r:89},{l:"mm",r:44,d:"minute"},{l:"h",r:89},{l:"hh",r:21,d:"hour"},{l:"d",r:35},{l:"dd",r:25,d:"day"},{l:"M",r:45},{l:"MM",r:10,d:"month"},{l:"y",r:17},{l:"yy",d:"year"}],p=g.length,h=0;h<p;h+=1){var f=g[h];f.d&&(l=i?r(t).diff(o,f.d,!0):o.diff(t,f.d,!0));var m=(e.rounding||Math.round)(Math.abs(l));if(c=l>0,m<=f.r||!f.r){m<=1&&h>0&&(f=g[h-1]);var v=u[f.l];s&&(m=s(""+m)),d="string"==typeof v?v.replace("%d",m):v(m,n,f.l,c);break}}if(n)return d;var y=c?u.future:u.past;return"function"==typeof y?y(d):y.replace("%s",d)},n.to=function(e,t){return o(e,t,this,!0)},n.from=function(e,t){return o(e,t,this)};var i=function(e){return e.$u?r.utc():r()};n.toNow=function(e){return this.to(i(this),e)},n.fromNow=function(e){return this.from(i(this),e)}}},949936,e=>{"use strict";var t=e.i(766932),r=e.i(574788),n=e.i(278322),a=e.i(7284),o=e.i(419695),i=(0,t.template)("<header>"),s=(0,t.template)("<div><button><span>TANSTACK</span><span>");function l(e){var n;let{children:s,class:l,...d}=e,c=(0,o.useStyles)();return n=i(),(0,t.spread)(n,(0,r.mergeProps)({get class(){return(0,a.default)(c().header.row,"tsqd-header",l)}},d),!1,!0),(0,t.insert)(n,s),n}function d(e){var r,i,l,d;let{children:c,flavor:u,onClick:g}=e,p=(0,o.useStyles)();return d=(l=(i=(r=s()).firstChild).firstChild).nextSibling,(0,t.addEventListener)(i,"click",g,!0),(0,t.insert)(d,c),(0,n.effect)(e=>{var n=p().header.logoAndToggleContainer,o=(0,a.default)(p().header.logo),s=(0,a.default)(p().header.tanstackLogo),c=(0,a.default)(p().header.flavorLogo(u.light,u.dark));return n!==e.e&&(0,t.className)(r,e.e=n),o!==e.t&&(0,t.className)(i,e.t=o),s!==e.a&&(0,t.className)(l,e.a=s),c!==e.o&&(0,t.className)(d,e.o=c),e},{e:void 0,t:void 0,a:void 0,o:void 0}),r}(0,t.delegateEvents)(["click"]),e.s(["Header",()=>l,"HeaderLogo",()=>d])},992457,e=>{"use strict";var t=e.i(574788),r=e.i(766932),n=e.i(278322),a=e.i(7284),o=e.i(419695),i=e.i(596190),s=(0,r.template)("<span>"),l=(0,r.template)("<span>&quot;<!>&quot;: "),d=(0,r.template)("<span>&quot;<!>&quot;"),c=(0,r.template)("<span>null"),u=(0,r.template)("<span>undefined"),g=(0,r.template)("<div>"),p=(0,r.template)("<span>,"),h=(0,r.template)("<span><span>[]"),f=(0,r.template)("<span>..."),m=(0,r.template)("<span><span>[</span><span>]"),v=(0,r.template)("<span>&quot;<!>&quot;: <span> items"),y=(0,r.template)("<span><span>{}"),b=(0,r.template)("<span><span>{</span><span>}"),C=(0,r.template)('<button title="Copy object to clipboard">'),x=(0,r.template)('<span><svg width=16 height=16 viewBox="0 0 16 16"fill=none xmlns=http://www.w3.org/2000/svg><path d="M6 12L10 8L6 4"stroke-width=2 stroke-linecap=round stroke-linejoin=round>');function $(e){return(0,t.createComponent)(w,{isRoot:!0,get value(){return e.value},get copyable(){return e.copyable},depth:0,get defaultExpansionDepth(){return e.defaultExpansionDepth??1},path:"",get collapsePaths(){return e.collapsePaths}})}function w(e){var i,h,f,m;let v=(0,o.useStyles)();return i=s(),(0,r.insert)(i,(h=(0,r.memo)(()=>!!(e.keyName&&"object"!=typeof e.value&&!Array.isArray(e.value))),()=>{var t,a;return h()&&((a=(t=l()).firstChild.nextSibling).nextSibling,(0,r.insert)(t,()=>e.keyName,a),(0,n.effect)(()=>(0,r.className)(t,v().tree.valueKey)),t)}),null),(0,r.insert)(i,()=>{var a,o,i,l,g,p,h;return"string"==typeof e.value?((o=(a=d()).firstChild.nextSibling).nextSibling,(0,r.insert)(a,()=>e.value,o),(0,n.effect)(()=>(0,r.className)(a,v().tree.valueString)),a):"number"==typeof e.value?(i=s(),(0,r.insert)(i,()=>e.value),(0,n.effect)(()=>(0,r.className)(i,v().tree.valueNumber)),i):"boolean"==typeof e.value?(l=s(),(0,r.insert)(l,()=>String(e.value)),(0,n.effect)(()=>(0,r.className)(l,v().tree.valueBoolean)),l):null===e.value?(g=c(),(0,n.effect)(()=>(0,r.className)(g,v().tree.valueNull)),g):void 0===e.value?(p=u(),(0,n.effect)(()=>(0,r.className)(p,v().tree.valueNull)),p):"function"==typeof e.value?(h=s(),(0,r.insert)(h,()=>String(e.value)),(0,n.effect)(()=>(0,r.className)(h,v().tree.valueFunction)),h):Array.isArray(e.value)?(0,t.createComponent)(k,{get defaultExpansionDepth(){return e.defaultExpansionDepth},get depth(){return e.depth},get copyable(){return e.copyable},get keyName(){return e.keyName},get value(){return e.value},get collapsePaths(){return e.collapsePaths},get path(){return e.path}}):"object"==typeof e.value?(0,t.createComponent)(S,{get defaultExpansionDepth(){return e.defaultExpansionDepth},get depth(){return e.depth},get copyable(){return e.copyable},get keyName(){return e.keyName},get value(){return e.value},get collapsePaths(){return e.collapsePaths},get path(){return e.path}}):s()},null),(0,r.insert)(i,(f=(0,r.memo)(()=>!!e.copyable),()=>{var o;return f()&&(o=g(),(0,r.insert)(o,(0,t.createComponent)(E,{get value(){return e.value}})),(0,n.effect)(()=>(0,r.className)(o,(0,a.default)(v().tree.actions,"actions"))),o)}),null),(0,r.insert)(i,(m=(0,r.memo)(()=>!!(e.isLastKey||e.isRoot)),()=>m()?"":p()),null),(0,n.effect)(()=>(0,r.className)(i,v().tree.valueContainer(e.isRoot??!1))),i}let k=e=>{var i,d,c,u,g,p,y;let b=(0,o.useStyles)(),[C,x]=(0,t.createSignal)(e.depth<=e.defaultExpansionDepth&&!e.collapsePaths?.includes(e.path));return 0===e.value.length?(d=(i=h()).firstChild,(0,r.insert)(i,(c=(0,r.memo)(()=>!!e.keyName),()=>{var t,o;return c()&&((o=(t=l()).firstChild.nextSibling).nextSibling,(0,r.insert)(t,()=>e.keyName,o),(0,n.effect)(()=>(0,r.className)(t,(0,a.default)(b().tree.valueKey,b().tree.collapsible))),t)}),d),(0,n.effect)(e=>{var t=b().tree.expanderContainer,n=b().tree.valueBraces;return t!==e.e&&(0,r.className)(i,e.e=t),n!==e.t&&(0,r.className)(d,e.t=n),e},{e:void 0,t:void 0}),i):(p=(g=(u=m()).firstChild).nextSibling,(0,r.insert)(u,(0,t.createComponent)(M,{onClick:()=>x(!C()),get expanded(){return C()}}),g),(0,r.insert)(u,(y=(0,r.memo)(()=>!!e.keyName),()=>{var t,o,i,s;return y()&&(s=(i=(o=(t=v()).firstChild.nextSibling).nextSibling.nextSibling).firstChild,t.$$click=e=>{e.stopPropagation(),e.stopImmediatePropagation(),x(!C())},(0,r.insert)(t,()=>e.keyName,o),(0,r.insert)(i,()=>e.value.length,s),(0,n.effect)(e=>{var n=(0,a.default)(b().tree.valueKey,b().tree.collapsible),o=b().tree.info;return n!==e.e&&(0,r.className)(t,e.e=n),o!==e.t&&(0,r.className)(i,e.t=o),e},{e:void 0,t:void 0}),t)}),g),(0,r.insert)(u,(0,t.createComponent)(t.Show,{get when(){return C()},get children(){var $=s();return(0,r.insert)($,(0,t.createComponent)(t.For,{get each(){return e.value},children:(n,a)=>{let o=a()===e.value.length-1;return(0,t.createComponent)(w,{get copyable(){return e.copyable},value:n,isLastKey:o,get defaultExpansionDepth(){return e.defaultExpansionDepth},get depth(){return e.depth+1},get collapsePaths(){return e.collapsePaths},get path(){return(0,r.memo)(()=>!!e.path)()?`${e.path}[${a()}]`:`[${a()}]`}})}})),(0,n.effect)(()=>(0,r.className)($,b().tree.expandedLine(!!e.keyName))),$}}),p),(0,r.insert)(u,(0,t.createComponent)(t.Show,{get when(){return!C()},get children(){var k=f();return k.$$click=e=>{e.stopPropagation(),e.stopImmediatePropagation(),x(!C())},(0,n.effect)(()=>(0,r.className)(k,(0,a.default)(b().tree.valueKey,b().tree.collapsible))),k}}),p),(0,n.effect)(e=>{var t=b().tree.expanderContainer,n=b().tree.valueBraces,a=b().tree.valueBraces;return t!==e.e&&(0,r.className)(u,e.e=t),n!==e.t&&(0,r.className)(g,e.t=n),a!==e.a&&(0,r.className)(p,e.a=a),e},{e:void 0,t:void 0,a:void 0}),u)},S=e=>{var i,d,c,u,g,p,h,m;let C=(0,o.useStyles)(),[x,$]=(0,t.createSignal)(e.depth<=e.defaultExpansionDepth&&!e.collapsePaths?.includes(e.path)),k=Object.keys(e.value),S=k[k.length-1];return 0===k.length?(d=(i=y()).firstChild,(0,r.insert)(i,(c=(0,r.memo)(()=>!!e.keyName),()=>{var t,o;return c()&&((o=(t=l()).firstChild.nextSibling).nextSibling,(0,r.insert)(t,()=>e.keyName,o),(0,n.effect)(()=>(0,r.className)(t,(0,a.default)(C().tree.valueKey,C().tree.collapsible))),t)}),d),(0,n.effect)(e=>{var t=C().tree.expanderContainer,n=C().tree.valueBraces;return t!==e.e&&(0,r.className)(i,e.e=t),n!==e.t&&(0,r.className)(d,e.t=n),e},{e:void 0,t:void 0}),i):(p=(g=(u=b()).firstChild).nextSibling,(0,r.insert)(u,(h=(0,r.memo)(()=>!!e.keyName),()=>h()&&(0,t.createComponent)(M,{onClick:()=>$(!x()),get expanded(){return x()}})),g),(0,r.insert)(u,(m=(0,r.memo)(()=>!!e.keyName),()=>{var t,o,i,s;return m()&&(s=(i=(o=(t=v()).firstChild.nextSibling).nextSibling.nextSibling).firstChild,t.$$click=e=>{e.stopPropagation(),e.stopImmediatePropagation(),$(!x())},(0,r.insert)(t,()=>e.keyName,o),(0,r.insert)(i,()=>k.length,s),(0,n.effect)(e=>{var n=(0,a.default)(C().tree.valueKey,C().tree.collapsible),o=C().tree.info;return n!==e.e&&(0,r.className)(t,e.e=n),o!==e.t&&(0,r.className)(i,e.t=o),e},{e:void 0,t:void 0}),t)}),g),(0,r.insert)(u,(0,t.createComponent)(t.Show,{get when(){return x()},get children(){var E=s();return(0,r.insert)(E,(0,t.createComponent)(t.For,{each:k,children:r=>(0,t.createComponent)(w,{get value(){return e.value[r]},keyName:r,isLastKey:S===r,get copyable(){return e.copyable},get defaultExpansionDepth(){return e.defaultExpansionDepth},get depth(){return e.depth+1},get collapsePaths(){return e.collapsePaths},get path(){return`${e.path}${e.path?".":""}${r}`}})})),(0,n.effect)(()=>(0,r.className)(E,C().tree.expandedLine(!!e.keyName))),E}}),p),(0,r.insert)(u,(0,t.createComponent)(t.Show,{get when(){return!x()},get children(){var N=f();return N.$$click=e=>{e.stopPropagation(),e.stopImmediatePropagation(),$(!x())},(0,n.effect)(()=>(0,r.className)(N,(0,a.default)(C().tree.valueKey,C().tree.collapsible))),N}}),p),(0,n.effect)(e=>{var t=C().tree.expanderContainer,n=C().tree.valueBraces,a=C().tree.valueBraces;return t!==e.e&&(0,r.className)(u,e.e=t),n!==e.t&&(0,r.className)(g,e.t=n),a!==e.a&&(0,r.className)(p,e.a=a),e},{e:void 0,t:void 0,a:void 0}),u)},E=e=>{var a;let s=(0,o.useStyles)(),[l,d]=(0,t.createSignal)("NoCopy");return a=C(),(0,r.addEventListener)(a,"click","NoCopy"===l()?()=>{navigator.clipboard.writeText(JSON.stringify(e.value,null,2)).then(()=>{d("SuccessCopy"),setTimeout(()=>{d("NoCopy")},1500)},e=>{console.error("Failed to copy: ",e),d("ErrorCopy"),setTimeout(()=>{d("NoCopy")},1500)})}:void 0,!0),(0,r.insert)(a,(0,t.createComponent)(t.Switch,{get children(){return[(0,t.createComponent)(t.Match,{get when(){return"NoCopy"===l()},get children(){return(0,t.createComponent)(i.Copier,{})}}),(0,t.createComponent)(t.Match,{get when(){return"SuccessCopy"===l()},get children(){return(0,t.createComponent)(i.CopiedCopier,{theme:"dark"})}}),(0,t.createComponent)(t.Match,{get when(){return"ErrorCopy"===l()},get children(){return(0,t.createComponent)(i.ErrorCopier,{})}})]}})),(0,n.effect)(e=>{var t=s().tree.actionButton,n=`${"NoCopy"===l()?"Copy object to clipboard":"SuccessCopy"===l()?"Object copied to clipboard":"Error copying object to clipboard"}`;return t!==e.e&&(0,r.className)(a,e.e=t),n!==e.t&&(0,r.setAttribute)(a,"aria-label",e.t=n),e},{e:void 0,t:void 0}),a},M=e=>{var t;let i=(0,o.useStyles)();return t=x(),(0,r.addEventListener)(t,"click",e.onClick,!0),(0,n.effect)(()=>(0,r.className)(t,(0,a.default)(i().tree.expander,o.css`
          transform: rotate(${90*!!e.expanded}deg);
        `,e.expanded&&o.css`
            & svg {
              top: -1px;
            }
          `))),t};(0,r.delegateEvents)(["click"]),e.s(["JsonTree",()=>$])},278322,e=>{"use strict";var t=e.i(574788);e.s(["effect",()=>t.createRenderEffect])},739604,e=>{"use strict";let t={data:""},r=/(?:([\u0080-\uFFFF\w-%@]+) *:? *([^{;]+?);|([^;}{]*?) *{)|(}\s*)/g,n=/\/\*[^]*?\*\/|  +/g,a=/\n+/g,o=(e,t)=>{let r="",n="",a="";for(let i in e){let s=e[i];"@"==i[0]?"i"==i[1]?r=i+" "+s+";":n+="f"==i[1]?o(s,i):i+"{"+o(s,"k"==i[1]?"":t)+"}":"object"==typeof s?n+=o(s,t?t.replace(/([^,])+/g,e=>i.replace(/([^,]*:\S+\([^)]*\))|([^,])+/g,t=>/&/.test(t)?t.replace(/&/g,e):e?e+" "+t:t)):i):null!=s&&(i=/^--/.test(i)?i:i.replace(/[A-Z]/g,"-$&").toLowerCase(),a+=o.p?o.p(i,s):i+":"+s+";")}return r+(t&&a?t+"{"+a+"}":a)+n},i={},s=e=>{if("object"==typeof e){let t="";for(let r in e)t+=r+s(e[r]);return t}return e};function l(e){let l,d,c=this||{},u=e.call?e(c.p):e;return((e,t,l,d,c)=>{var u;let g=s(e),p=i[g]||(i[g]=(e=>{let t=0,r=11;for(;t<e.length;)r=101*r+e.charCodeAt(t++)>>>0;return"go"+r})(g));if(!i[p]){let t=g!==e?e:(e=>{let t,o,i=[{}];for(;t=r.exec(e.replace(n,""));)t[4]?i.shift():t[3]?(o=t[3].replace(a," ").trim(),i.unshift(i[0][o]=i[0][o]||{})):i[0][t[1]]=t[2].replace(a," ").trim();return i[0]})(e);i[p]=o(c?{["@keyframes "+p]:t}:t,l?"":"."+p)}let h=l&&i.g?i.g:null;return l&&(i.g=i[p]),u=i[p],h?t.data=t.data.replace(h,u):-1===t.data.indexOf(u)&&(t.data=d?u+t.data:t.data+u),p})(u.unshift?u.raw?(l=[].slice.call(arguments,1),d=c.p,u.reduce((e,t,r)=>{let n=l[r];if(n&&n.call){let e=n(d),t=e&&e.props&&e.props.className||/^go/.test(e)&&e;n=t?"."+t:e&&"object"==typeof e?e.props?"":o(e,""):!1===e?"":e}return e+t+(null==n?"":n)},"")):u.reduce((e,t)=>Object.assign(e,t&&t.call?t(c.p):t),{}):u,(e=>{if("object"==typeof window){let t=(e?e.querySelector("#_goober"):window._goober)||Object.assign(document.createElement("style"),{innerHTML:" ",id:"_goober"});return t.nonce=window.__nonce__,t.parentNode||(e||document.head).appendChild(t),t.firstChild}return e||t})(c.target),c.g,c.o,c.k)}l.bind({g:1}),l.bind({k:1}),e.s(["css",()=>l])},537261,e=>{"use strict";var t=e.i(574788);let r=(0,t.createContext)(void 0),n=e=>{let[n,a]=(0,t.createSignal)(e.theme);return(0,t.createEffect)(()=>{a(e.theme)}),(0,t.createComponent)(r.Provider,{value:{theme:n,setTheme:a},get children(){return e.children}})};function a(){let e=(0,t.useContext)(r);if(!e)throw Error("useTheme must be used within a ThemeContextProvider");return e}e.s(["ThemeContextProvider",()=>n,"useTheme",()=>a])},419695,e=>{"use strict";var t=e.i(739604),r=e.i(574788),n=e.i(537261);let a={colors:{inherit:"inherit",current:"currentColor",transparent:"transparent",black:"#000000",white:"#ffffff",neutral:{50:"#f9fafb",100:"#f2f4f7",200:"#eaecf0",300:"#d0d5dd",400:"#98a2b3",500:"#667085",600:"#475467",700:"#344054",800:"#1d2939",900:"#101828"},darkGray:{50:"#525c7a",100:"#49536e",200:"#414962",300:"#394056",400:"#313749",500:"#292e3d",600:"#212530",700:"#191c24",800:"#111318",900:"#0b0d10"},gray:{50:"#f9fafb",100:"#f2f4f7",200:"#eaecf0",300:"#d0d5dd",400:"#98a2b3",500:"#667085",600:"#475467",700:"#344054",800:"#1d2939",900:"#101828"},blue:{25:"#F5FAFF",50:"#EFF8FF",100:"#D1E9FF",200:"#B2DDFF",300:"#84CAFF",400:"#53B1FD",500:"#2E90FA",600:"#1570EF",700:"#175CD3",800:"#1849A9",900:"#194185"},green:{25:"#F6FEF9",50:"#ECFDF3",100:"#D1FADF",200:"#A6F4C5",300:"#6CE9A6",400:"#32D583",500:"#12B76A",600:"#039855",700:"#027A48",800:"#05603A",900:"#054F31"},red:{50:"#fef2f2",100:"#fee2e2",200:"#fecaca",300:"#fca5a5",400:"#f87171",500:"#ef4444",600:"#dc2626",700:"#b91c1c",800:"#991b1b",900:"#7f1d1d",950:"#450a0a"},yellow:{25:"#FFFCF5",50:"#FFFAEB",100:"#FEF0C7",200:"#FEDF89",300:"#FEC84B",400:"#FDB022",500:"#F79009",600:"#DC6803",700:"#B54708",800:"#93370D",900:"#7A2E0E"},purple:{25:"#FAFAFF",50:"#F4F3FF",100:"#EBE9FE",200:"#D9D6FE",300:"#BDB4FE",400:"#9B8AFB",500:"#7A5AF8",600:"#6938EF",700:"#5925DC",800:"#4A1FB8",900:"#3E1C96"},teal:{25:"#F6FEFC",50:"#F0FDF9",100:"#CCFBEF",200:"#99F6E0",300:"#5FE9D0",400:"#2ED3B7",500:"#15B79E",600:"#0E9384",700:"#107569",800:"#125D56",900:"#134E48"},pink:{25:"#fdf2f8",50:"#fce7f3",100:"#fbcfe8",200:"#f9a8d4",300:"#f472b6",400:"#ec4899",500:"#db2777",600:"#be185d",700:"#9d174d",800:"#831843",900:"#500724"},cyan:{25:"#ecfeff",50:"#cffafe",100:"#a5f3fc",200:"#67e8f9",300:"#22d3ee",400:"#06b6d4",500:"#0891b2",600:"#0e7490",700:"#155e75",800:"#164e63",900:"#083344"}},font:{size:{xs:"calc(var(--tsrd-font-size) * 0.75)",sm:"calc(var(--tsrd-font-size) * 0.875)",md:"var(--tsrd-font-size)"},lineHeight:{xs:"calc(var(--tsrd-font-size) * 1)"},weight:{medium:"500",semibold:"600",bold:"700"},fontFamily:{sans:"ui-sans-serif, Inter, system-ui, sans-serif, sans-serif",mono:"ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace"}},border:{radius:{xs:"calc(var(--tsrd-font-size) * 0.125)",sm:"calc(var(--tsrd-font-size) * 0.25)",full:"9999px"}},size:{.5:"calc(var(--tsrd-font-size) * 0.125)",1:"calc(var(--tsrd-font-size) * 0.25)",1.5:"calc(var(--tsrd-font-size) * 0.375)",2:"calc(var(--tsrd-font-size) * 0.5)",2.5:"calc(var(--tsrd-font-size) * 0.625)",3:"calc(var(--tsrd-font-size) * 0.75)",4.5:"calc(var(--tsrd-font-size) * 1.125)",6.5:"calc(var(--tsrd-font-size) * 1.625)",12:"calc(var(--tsrd-font-size) * 3)"}},o={primary:{bg:a.colors.gray[900],hover:a.colors.gray[800],active:a.colors.gray[700],text:"#fff",border:a.colors.gray[900]},secondary:{bg:a.colors.gray[100],hover:a.colors.gray[200],active:a.colors.gray[300],text:a.colors.gray[900],border:a.colors.gray[300]},info:{bg:a.colors.blue[500],hover:a.colors.blue[600],active:a.colors.blue[700],text:"#fff",border:a.colors.blue[500]},warning:{bg:a.colors.yellow[500],hover:a.colors.yellow[600],active:a.colors.yellow[700],text:"#fff",border:a.colors.yellow[500]},danger:{bg:a.colors.red[500],hover:a.colors.red[600],active:a.colors.red[700],text:"#fff",border:a.colors.red[500]},success:{bg:a.colors.green[500],hover:a.colors.green[600],active:a.colors.green[700],text:"#fff",border:a.colors.green[500]}},i=t.css,s=function(){let e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:"dark",{colors:t,font:r,size:n,border:s}=a,{fontFamily:l}=r,d=(t,r)=>"light"===e?t:r;return{logo:i`
      cursor: pointer;
      display: flex;
      flex-direction: column;
      background-color: transparent;
      border: none;
      width: ${n[12]};
      height: ${n[12]};
      font-family: ${l.sans};
      gap: ${a.size[.5]};
      padding: 0px;
      &:hover {
        opacity: 0.7;
      }
    `,selectWrapper:i`
      width: 100%;
      max-width: ${320}px;
      display: flex;
      flex-direction: column;
      gap: 0.375rem;
    `,selectContainer:i`
      width: 100%;
    `,selectLabel:i`
      font-size: 0.875rem;
      font-weight: 500;
      color: ${d(t.gray[900],t.gray[100])};
      text-align: left;
    `,selectDescription:i`
      font-size: 0.8rem;
      color: ${d(t.gray[500],t.gray[400])};
      margin: 0;
      line-height: 1.3;
      text-align: left;
    `,select:i`
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
    `,inputWrapper:i`
      width: 100%;
      max-width: ${320}px;
      display: flex;
      flex-direction: column;
      gap: 0.375rem;
    `,inputContainer:i`
      width: 100%;
    `,inputLabel:i`
      font-size: 0.875rem;
      font-weight: 500;
      color: ${d(t.gray[900],t.gray[100])};
      text-align: left;
    `,inputDescription:i`
      font-size: 0.8rem;
      color: ${d(t.gray[500],t.gray[400])};
      margin: 0;
      line-height: 1.3;
      text-align: left;
    `,input:i`
      appearance: none;
      box-sizing: border-box;
      width: 100%;
      padding: 0.5rem 0.75rem;
      border-radius: 0.375rem;
      background-color: ${d(t.gray[50],t.darkGray[800])};
      color: ${d(t.gray[900],t.gray[100])};
      border: 1px solid ${d(t.gray[200],t.gray[800])};
      font-size: 0.875rem;
      font-family: ${l.mono};
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
    `,checkboxWrapper:i`
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
    `,checkboxContainer:i`
      width: 100%;
    `,checkboxLabelContainer:i`
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
      flex: 1;
    `,checkbox:i`
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
    `,checkboxLabel:i`
      color: ${d(t.gray[900],t.gray[100])};
      font-size: 0.875rem;
      font-weight: 500;
      line-height: 1.4;
      text-align: left;
    `,checkboxDescription:i`
      color: ${d(t.gray[500],t.gray[400])};
      font-size: 0.8rem;
      line-height: 1.3;
      text-align: left;
    `,button:{base:i`
        display: inline-flex;
        align-items: center;
        justify-content: center;
        font-family: ${a.font.fontFamily.sans};
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
      `,variant(e,r,n){let a=o[e];return n?i`
            background: transparent;
            color: ${d(a.bg,a.bg)};
            border-color: transparent;
            &:hover {
              background: ${d(t.gray[100],t.darkGray[800])};
            }
            &:active {
              background: ${d(t.gray[200],t.darkGray[700])};
            }
          `:r?i`
            background: transparent;
            color: ${d(a.bg,a.bg)};
            border-color: ${d(a.bg,a.bg)};
            &:hover {
              background: ${d(t.gray[50],t.darkGray[800])};
              border-color: ${d(a.hover,a.hover)};
            }
            &:active {
              background: ${d(t.gray[100],t.darkGray[700])};
              border-color: ${d(a.active,a.active)};
            }
          `:i`
          background: ${d(a.bg,a.bg)};
          color: ${d(a.text,a.text)};
          border-color: ${d(a.border,a.border)};
          &:hover {
            background: ${d(a.hover,a.hover)};
            border-color: ${d(a.hover,a.hover)};
          }
          &:active {
            background: ${d(a.active,a.active)};
            border-color: ${d(a.active,a.active)};
          }
        `}},tag:{dot:e=>i`
        width: ${a.size[1.5]};
        height: ${a.size[1.5]};
        border-radius: ${a.border.radius.full};
        background-color: ${d(a.colors[e][500],a.colors[e][500])};
      `,base:i`
        display: flex;
        gap: ${a.size[1.5]};
        box-sizing: border-box;
        height: ${a.size[6.5]};
        background: ${d(t.gray[50],t.darkGray[500])};
        color: ${d(t.gray[700],t.gray[300])};
        border-radius: ${a.border.radius.sm};
        font-size: ${r.size.sm};
        padding: ${a.size[1]};
        padding-left: ${a.size[1.5]};
        align-items: center;
        font-weight: ${r.weight.medium};
        border: ${d("1px solid "+t.gray[300],"1px solid transparent")};
        user-select: none;
        position: relative;
        &:focus-visible {
          outline-offset: 2px;
          outline: 2px solid ${d(t.blue[700],t.blue[800])};
        }
      `,label:i`
        font-size: ${r.size.xs};
      `,count:i`
        font-size: ${r.size.xs};
        padding: 0 5px;
        display: flex;
        align-items: center;
        justify-content: center;
        color: ${d(t.gray[500],t.gray[400])};
        background-color: ${d(t.gray[200],t.darkGray[300])};
        border-radius: 2px;
        font-variant-numeric: tabular-nums;
        height: ${a.size[4.5]};
      `},tree:{info:i`
        color: ${d(t.gray[500],t.gray[500])};
        font-size: ${r.size.xs};
        margin-right: ${n[1]};
      `,actionButton:i`
        background-color: transparent;
        color: ${d(t.gray[500],t.gray[500])};
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
          color: ${d(t.gray[600],t.gray[400])};
        }

        &:focus-visible {
          border-radius: ${s.radius.xs};
          outline: 2px solid ${d(t.blue[700],t.blue[800])};
          outline-offset: 2px;
        }
      `,expanderContainer:i`
        position: relative;
      `,expander:i`
        position: absolute;
        cursor: pointer;
        left: -16px;
        top: 3px;
        & path {
          stroke: ${d(t.blue[400],t.blue[300])};
        }
        & svg {
          width: ${n[3]};
          height: ${n[3]};
        }

        display: inline-flex;
        align-items: center;
        transition: all 0.1s ease;
      `,expandedLine:e=>i`
        display: block;
        padding-left: 0.75rem;
        margin-left: -0.7rem;
        ${e?`border-left: 1px solid ${d(t.blue[400],t.blue[300])};`:""}
      `,collapsible:i`
        cursor: pointer;
        transition: all 0.2s ease;
        &:hover {
          background-color: ${d(t.gray[100],t.darkGray[700])};
          border-radius: ${a.border.radius.sm};
          padding: 0 ${a.size[1]};
        }
      `,actions:i`
        display: inline-flex;
        margin-left: ${n[2]};
        gap: ${n[2]};
        align-items: center;
        & svg {
          height: 12px;
          width: 12px;
        }
      `,valueCollapsed:i`
        color: ${d(t.gray[500],t.gray[400])};
      `,valueFunction:i`
        color: ${d(t.cyan[500],t.cyan[400])};
      `,valueString:i`
        color: ${d(t.green[500],t.green[400])};
      `,valueNumber:i`
        color: ${d(t.yellow[500],t.yellow[400])};
      `,valueBoolean:i`
        color: ${d(t.pink[500],t.pink[400])};
      `,valueNull:i`
        color: ${d(t.gray[500],t.gray[400])};
        font-style: italic;
      `,valueKey:i`
        color: ${d(t.blue[400],t.blue[300])};
      `,valueBraces:i`
        color: ${t.gray[500]};
      `,valueContainer:e=>i`
        display: block;
        margin-left: ${e?"0":"1rem"};

        &:not(:hover) .actions {
          display: none;
        }

        &:hover .actions {
          display: inline-flex;
        }
      `},header:{row:i`
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: ${a.size[2]} ${a.size[2.5]};
        gap: ${a.size[2.5]};
        border-bottom: ${d(t.gray[300],t.darkGray[500])} 1px solid;
        align-items: center;
      `,logoAndToggleContainer:i`
        display: flex;
        gap: ${a.size[3]};
        align-items: center;
        & > button {
          padding: 0;
          background: transparent;
          border: none;
          display: flex;
          gap: ${n[.5]};
          flex-direction: column;
        }
      `,logo:i`
        cursor: pointer;
        display: flex;
        flex-direction: column;
        background-color: transparent;
        border: none;
        gap: ${a.size[.5]};
        padding: 0px;
        &:hover {
          opacity: 0.7;
        }
        &:focus-visible {
          outline-offset: 4px;
          border-radius: ${s.radius.xs};
          outline: 2px solid ${t.blue[800]};
        }
      `,tanstackLogo:i`
        font-size: ${r.size.md};
        font-weight: ${r.weight.bold};
        line-height: ${r.lineHeight.xs};
        white-space: nowrap;
        color: ${d(t.gray[700],t.gray[300])};
      `,flavorLogo:(e,t)=>i`
        font-weight: ${r.weight.semibold};
        font-size: ${r.size.xs};
        background: linear-gradient(to right, ${d(e,t)});
        background-clip: text;
        -webkit-background-clip: text;
        line-height: 1;
        -webkit-text-fill-color: transparent;
        white-space: nowrap;
      `},section:{main:i`
        margin-bottom: 1.5rem;
        padding: 1rem;
        background-color: ${d(t.gray[50],t.darkGray[800])};
        border: 1px solid ${d(t.gray[200],t.gray[800])};
        border-radius: 0.5rem;
        box-shadow: none;
      `,title:i`
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
      `,icon:i`
        height: 18px;
        width: 18px;
        & > svg {
          height: 100%;
          width: 100%;
        }
        color: ${d(t.gray[700],t.gray[400])};
      `,description:i`
        color: ${d(t.gray[500],t.gray[400])};
        font-size: 0.8rem;
        margin: 0 0 1rem 0;
        line-height: 1.4;
        text-align: left;
      `},mainPanel:{panel:e=>i`
        padding: ${e?a.size[3]:0};
        background: ${d(t.gray[50],t.darkGray[700])};
        overflow-y: auto;
        height: 100%;
      `}}};function l(){let{theme:e}=(0,n.useTheme)(),[t,a]=(0,r.createSignal)(s(e()));return(0,r.createEffect)(()=>{a(s(e()))}),t}e.s(["css",()=>i,"useStyles",()=>l],419695)},492859,e=>{"use strict";var t=e.i(766932),r=e.i(278322),n=e.i(7284),a=e.i(419695),o=(0,t.template)("<div>");let i=e=>{var i;let{className:s,children:l,class:d,withPadding:c}=e,u=(0,a.useStyles)();return i=o(),(0,t.insert)(i,l),(0,r.effect)(()=>(0,t.className)(i,(0,n.default)(u().mainPanel.panel(!!c),s,d))),i};e.s(["MainPanel",()=>i])},596190,e=>{"use strict";var t=e.i(766932),r=e.i(278322),n=(0,t.template)('<svg width=24 height=24 viewBox="0 0 24 24"fill=none xmlns=http://www.w3.org/2000/svg><path class=copier d="M8 8V5.2C8 4.0799 8 3.51984 8.21799 3.09202C8.40973 2.71569 8.71569 2.40973 9.09202 2.21799C9.51984 2 10.0799 2 11.2 2H18.8C19.9201 2 20.4802 2 20.908 2.21799C21.2843 2.40973 21.5903 2.71569 21.782 3.09202C22 3.51984 22 4.0799 22 5.2V12.8C22 13.9201 22 14.4802 21.782 14.908C21.5903 15.2843 21.2843 15.5903 20.908 15.782C20.4802 16 19.9201 16 18.8 16H16M5.2 22H12.8C13.9201 22 14.4802 22 14.908 21.782C15.2843 21.5903 15.5903 21.2843 15.782 20.908C16 20.4802 16 19.9201 16 18.8V11.2C16 10.0799 16 9.51984 15.782 9.09202C15.5903 8.71569 15.2843 8.40973 14.908 8.21799C14.4802 8 13.9201 8 12.8 8H5.2C4.0799 8 3.51984 8 3.09202 8.21799C2.71569 8.40973 2.40973 8.71569 2.21799 9.09202C2 9.51984 2 10.0799 2 11.2V18.8C2 19.9201 2 20.4802 2.21799 20.908C2.40973 21.2843 2.71569 21.5903 3.09202 21.782C3.51984 22 4.07989 22 5.2 22Z"stroke-width=2 stroke-linecap=round stroke-linejoin=round stroke=currentColor>'),a=(0,t.template)('<svg xmlns=http://www.w3.org/2000/svg width=24 height=24 viewBox="0 0 24 24"fill=none stroke=currentColor stroke-width=2 stroke-linecap=round stroke-linejoin=round><path d="M8 6h10"></path><path d="M6 12h9"></path><path d="M11 18h7">'),o=(0,t.template)('<svg xmlns=http://www.w3.org/2000/svg width=24 height=24 viewBox="0 0 24 24"fill=none stroke=currentColor stroke-width=2 stroke-linecap=round stroke-linejoin=round class="lucide lucide-file-search2-icon lucide-file-search-2"><path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"></path><path d="M14 2v4a2 2 0 0 0 2 2h4"></path><circle cx=11.5 cy=14.5 r=2.5></circle><path d="M13.3 16.3 15 18">'),i=(0,t.template)('<svg xmlns=http://www.w3.org/2000/svg width=24 height=24 viewBox="0 0 24 24"fill=none stroke=currentColor stroke-width=2 stroke-linecap=round stroke-linejoin=round><path d="M12 20a8 8 0 1 0 0-16 8 8 0 0 0 0 16Z"></path><path d="M12 14a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z"></path><path d="M12 2v2"></path><path d="M12 22v-2"></path><path d="m17 20.66-1-1.73"></path><path d="M11 10.27 7 3.34"></path><path d="m20.66 17-1.73-1"></path><path d="m3.34 7 1.73 1"></path><path d="M14 12h8"></path><path d="M2 12h2"></path><path d="m20.66 7-1.73 1"></path><path d="m3.34 17 1.73-1"></path><path d="m17 3.34-1 1.73"></path><path d="m11 13.73-4 6.93">'),s=(0,t.template)('<svg xmlns=http://www.w3.org/2000/svg width=20 height=20 viewBox="0 0 24 24"fill=none stroke=currentColor stroke-width=2 stroke-linecap=round stroke-linejoin=round><path d="m10 9-3 3 3 3"></path><path d="m14 15 3-3-3-3"></path><path d="M2.992 16.342a2 2 0 0 1 .094 1.167l-1.065 3.29a1 1 0 0 0 1.236 1.168l3.413-.998a2 2 0 0 1 1.099.092 10 10 0 1 0-4.777-4.719">'),l=(0,t.template)('<svg xmlns=http://www.w3.org/2000/svg width=20 height=20 viewBox="0 0 24 24"fill=none stroke=currentColor stroke-width=2 stroke-linecap=round stroke-linejoin=round><path d="M10 8h.01"></path><path d="M12 12h.01"></path><path d="M14 8h.01"></path><path d="M16 12h.01"></path><path d="M18 8h.01"></path><path d="M6 8h.01"></path><path d="M7 16h10"></path><path d="M8 12h.01"></path><rect width=20 height=16 x=2 y=4 rx=2>'),d=(0,t.template)('<svg xmlns=http://www.w3.org/2000/svg width=20 height=20 viewBox="0 0 24 24"fill=none stroke=currentColor stroke-width=2 stroke-linecap=round stroke-linejoin=round><path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0"></path><circle cx=12 cy=10 r=3>'),c=(0,t.template)('<svg xmlns=http://www.w3.org/2000/svg width=20 height=20 viewBox="0 0 24 24"fill=none stroke=currentColor stroke-width=2 stroke-linecap=round stroke-linejoin=round><path d="M9 17H7A5 5 0 0 1 7 7h2"></path><path d="M15 7h2a5 5 0 1 1 0 10h-2"></path><line x1=8 x2=16 y1=12 y2=12>'),u=(0,t.template)('<svg xmlns=http://www.w3.org/2000/svg width=24 height=24 viewBox="0 0 24 24"fill=none stroke=currentColor stroke-width=2 stroke-linecap=round stroke-linejoin=round><path d="M18 6 6 18"></path><path d="m6 6 12 12">'),g=(0,t.template)('<svg width=20 height=20 viewBox="0 0 24 24"fill=none xmlns=http://www.w3.org/2000/svg><path d="M16.5 9.39999L7.5 4.20999M12 17.5L12 3M21 16V7.99999C20.9996 7.64926 20.9071 7.30481 20.7315 7.00116C20.556 6.69751 20.3037 6.44536 20 6.26999L13 2.26999C12.696 2.09446 12.3511 2.00204 12 2.00204C11.6489 2.00204 11.304 2.09446 11 2.26999L4 6.26999C3.69626 6.44536 3.44398 6.69751 3.26846 7.00116C3.09294 7.30481 3.00036 7.64926 3 7.99999V16C3.00036 16.3507 3.09294 16.6952 3.26846 16.9988C3.44398 17.3025 3.69626 17.5546 4 17.73L11 21.73C11.304 21.9055 11.6489 21.998 12 21.998C12.3511 21.998 12.696 21.9055 13 21.73L20 17.73C20.3037 17.5546 20.556 17.3025 20.7315 16.9988C20.9071 16.6952 20.9996 16.3507 21 16Z"stroke=currentColor stroke-width=2 stroke-linecap=round stroke-linejoin=round>'),p=(0,t.template)('<svg width=18 height=18 viewBox="0 0 24 24"fill=none xmlns=http://www.w3.org/2000/svg><path d="M22 11.08V12C21.9988 14.1564 21.3005 16.2547 20.0093 17.9818C18.7182 19.7088 16.9033 20.9725 14.8354 21.5839C12.7674 22.1953 10.5573 22.1219 8.53447 21.3746C6.51168 20.6273 4.78465 19.2461 3.61096 17.4371C2.43727 15.628 1.87979 13.4881 2.02168 11.3363C2.16356 9.18455 2.99721 7.13631 4.39828 5.49706C5.79935 3.85781 7.69279 2.71537 9.79619 2.24013C11.8996 1.76489 14.1003 1.98232 16.07 2.85999M22 4L12 14.01L9 11.01"stroke=currentColor stroke-width=2 stroke-linecap=round stroke-linejoin=round>'),h=(0,t.template)('<svg width=18 height=18 viewBox="0 0 24 24"fill=none xmlns=http://www.w3.org/2000/svg><path d="M15 9L9 15M9 9L15 15M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12Z"stroke=currentColor stroke-width=2 stroke-linecap=round stroke-linejoin=round>'),f=(0,t.template)('<svg width=20 height=20 viewBox="0 0 24 24"fill=none xmlns=http://www.w3.org/2000/svg><path d="M6 9L12 15L18 9"stroke=currentColor stroke-width=2 stroke-linecap=round stroke-linejoin=round>'),m=(0,t.template)('<svg width=18 height=18 viewBox="0 0 24 24"fill=none xmlns=http://www.w3.org/2000/svg><path d="M21 21L15 15M17 10C17 13.866 13.866 17 10 17C6.13401 17 3 13.866 3 10C3 6.13401 6.13401 3 10 3C13.866 3 17 6.13401 17 10Z"stroke=currentColor stroke-width=2 stroke-linecap=round stroke-linejoin=round>'),v=(0,t.template)('<svg width=12 height=12 viewBox="0 0 24 24"fill=none xmlns=http://www.w3.org/2000/svg><path d="M21 13V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H11M15 3H21M21 3V9M21 3L10 14"stroke=currentColor stroke-width=2 stroke-linecap=round stroke-linejoin=round>'),y=(0,t.template)('<svg width=20 height=20 viewBox="0 0 24 24"fill=none xmlns=http://www.w3.org/2000/svg><path d="M12 15C13.6569 15 15 13.6569 15 12C15 10.3431 13.6569 9 12 9C10.3431 9 9 10.3431 9 12C9 13.6569 10.3431 15 12 15Z"stroke=currentColor stroke-width=2 stroke-linecap=round stroke-linejoin=round></path><path d="M19.4 15C19.2669 15.3016 19.2272 15.6362 19.286 15.9606C19.3448 16.285 19.4995 16.5843 19.73 16.82L19.79 16.88C19.976 17.0657 20.1235 17.2863 20.2241 17.5291C20.3248 17.7719 20.3766 18.0322 20.3766 18.295C20.3766 18.5578 20.3248 18.8181 20.2241 19.0609C20.1235 19.3037 19.976 19.5243 19.79 19.71C19.6043 19.896 19.3837 20.0435 19.1409 20.1441C18.8981 20.2448 18.6378 20.2966 18.375 20.2966C18.1122 20.2966 17.8519 20.2448 17.6091 20.1441C17.3663 20.0435 17.1457 19.896 16.96 19.71L16.9 19.65C16.6643 19.4195 16.365 19.2648 16.0406 19.206C15.7162 19.1472 15.3816 19.1869 15.08 19.32C14.7842 19.4468 14.532 19.6572 14.3543 19.9255C14.1766 20.1938 14.0813 20.5082 14.08 20.83V21C14.08 21.5304 13.8693 22.0391 13.4942 22.4142C13.1191 22.7893 12.6104 23 12.08 23C11.5496 23 11.0409 22.7893 10.6658 22.4142C10.2907 22.0391 10.08 21.5304 10.08 21V20.91C10.0723 20.579 9.96512 20.258 9.77251 19.9887C9.5799 19.7194 9.31074 19.5143 9 19.4C8.69838 19.2669 8.36381 19.2272 8.03941 19.286C7.71502 19.3448 7.41568 19.4995 7.18 19.73L7.12 19.79C6.93425 19.976 6.71368 20.1235 6.47088 20.2241C6.22808 20.3248 5.96783 20.3766 5.705 20.3766C5.44217 20.3766 5.18192 20.3248 4.93912 20.2241C4.69632 20.1235 4.47575 19.976 4.29 19.79C4.10405 19.6043 3.95653 19.3837 3.85588 19.1409C3.75523 18.8981 3.70343 18.6378 3.70343 18.375C3.70343 18.1122 3.75523 17.8519 3.85588 17.6091C3.95653 17.3663 4.10405 17.1457 4.29 16.96L4.35 16.9C4.58054 16.6643 4.73519 16.365 4.794 16.0406C4.85282 15.7162 4.81312 15.3816 4.68 15.08C4.55324 14.7842 4.34276 14.532 4.07447 14.3543C3.80618 14.1766 3.49179 14.0813 3.17 14.08H3C2.46957 14.08 1.96086 13.8693 1.58579 13.4942C1.21071 13.1191 1 12.6104 1 12.08C1 11.5496 1.21071 11.0409 1.58579 10.6658C1.96086 10.2907 2.46957 10.08 3 10.08H3.09C3.42099 10.0723 3.742 9.96512 4.0113 9.77251C4.28059 9.5799 4.48572 9.31074 4.6 9C4.73312 8.69838 4.77282 8.36381 4.714 8.03941C4.65519 7.71502 4.50054 7.41568 4.27 7.18L4.21 7.12C4.02405 6.93425 3.87653 6.71368 3.77588 6.47088C3.67523 6.22808 3.62343 5.96783 3.62343 5.705C3.62343 5.44217 3.67523 5.18192 3.77588 4.93912C3.87653 4.69632 4.02405 4.47575 4.21 4.29C4.39575 4.10405 4.61632 3.95653 4.85912 3.85588C5.10192 3.75523 5.36217 3.70343 5.625 3.70343C5.88783 3.70343 6.14808 3.75523 6.39088 3.85588C6.63368 3.95653 6.85425 4.10405 7.04 4.29L7.1 4.35C7.33568 4.58054 7.63502 4.73519 7.95941 4.794C8.28381 4.85282 8.61838 4.81312 8.92 4.68H9C9.29577 4.55324 9.54802 4.34276 9.72569 4.07447C9.90337 3.80618 9.99872 3.49179 10 3.17V3C10 2.46957 10.2107 1.96086 10.5858 1.58579C10.9609 1.21071 11.4696 1 12 1C12.5304 1 13.0391 1.21071 13.4142 1.58579C13.7893 1.96086 14 2.46957 14 3V3.09C14.0013 3.41179 14.0966 3.72618 14.2743 3.99447C14.452 4.26276 14.7042 4.47324 15 4.6C15.3016 4.73312 15.6362 4.77282 15.9606 4.714C16.285 4.65519 16.5843 4.50054 16.82 4.27L16.88 4.21C17.0657 4.02405 17.2863 3.87653 17.5291 3.77588C17.7719 3.67523 18.0322 3.62343 18.295 3.62343C18.5578 3.62343 18.8181 3.67523 19.0609 3.77588C19.3037 3.87653 19.5243 4.02405 19.71 4.21C19.896 4.39575 20.0435 4.61632 20.1441 4.85912C20.2448 5.10192 20.2966 5.36217 20.2966 5.625C20.2966 5.88783 20.2448 6.14808 20.1441 6.39088C20.0435 6.63368 19.896 6.85425 19.71 7.04L19.65 7.1C19.4195 7.33568 19.2648 7.63502 19.206 7.95941C19.1472 8.28381 19.1869 8.61838 19.32 8.92V9C19.4468 9.29577 19.6572 9.54802 19.9255 9.72569C20.1938 9.90337 20.5082 9.99872 20.83 10H21C21.5304 10 22.0391 10.2107 22.4142 10.5858C22.7893 10.9609 23 11.4696 23 12C23 12.5304 22.7893 13.0391 22.4142 13.4142C22.0391 13.7893 21.5304 14 21 14H20.91C20.5882 14.0013 20.2738 14.0966 20.0055 14.2743C19.7372 14.452 19.5268 14.7042 19.4 15Z"stroke=currentColor stroke-width=2 stroke-linecap=round stroke-linejoin=round>'),b=(0,t.template)('<svg width=20 height=20 viewBox="0 0 24 24"fill=none xmlns=http://www.w3.org/2000/svg><path d="M18 6L6 18M6 6L18 18"stroke=currentColor stroke-width=2 stroke-linecap=round stroke-linejoin=round>'),C=(0,t.template)('<svg xmlns=http://www.w3.org/2000/svg width=24 height=24 viewBox="0 0 24 24"fill=none stroke=currentColor stroke-width=2 stroke-linecap=round stroke-linejoin=round><path d="M2 10h6V4"></path><path d="m2 4 6 6"></path><path d="M21 10V7a2 2 0 0 0-2-2h-7"></path><path d="M3 14v2a2 2 0 0 0 2 2h3"></path><rect x=12 y=14 width=10 height=7 rx=1>'),x=(0,t.template)('<svg width=24 height=24 viewBox="0 0 24 24"fill=none xmlns=http://www.w3.org/2000/svg><path d="M7.5 12L10.5 15L16.5 9M7.8 21H16.2C17.8802 21 18.7202 21 19.362 20.673C19.9265 20.3854 20.3854 19.9265 20.673 19.362C21 18.7202 21 17.8802 21 16.2V7.8C21 6.11984 21 5.27976 20.673 4.63803C20.3854 4.07354 19.9265 3.6146 19.362 3.32698C18.7202 3 17.8802 3 16.2 3H7.8C6.11984 3 5.27976 3 4.63803 3.32698C4.07354 3.6146 3.6146 4.07354 3.32698 4.63803C3 5.27976 3 6.11984 3 7.8V16.2C3 17.8802 3 18.7202 3.32698 19.362C3.6146 19.9265 4.07354 20.3854 4.63803 20.673C5.27976 21 6.11984 21 7.8 21Z"stroke-width=2 stroke-linecap=round stroke-linejoin=round>'),$=(0,t.template)('<svg width=24 height=24 viewBox="0 0 24 24"fill=none xmlns=http://www.w3.org/2000/svg><path d="M9 9L15 15M15 9L9 15M7.8 21H16.2C17.8802 21 18.7202 21 19.362 20.673C19.9265 20.3854 20.3854 19.9265 20.673 19.362C21 18.7202 21 17.8802 21 16.2V7.8C21 6.11984 21 5.27976 20.673 4.63803C20.3854 4.07354 19.9265 3.6146 19.362 3.32698C18.7202 3 17.8802 3 16.2 3H7.8C6.11984 3 5.27976 3 4.63803 3.32698C4.07354 3.6146 3.6146 4.07354 3.32698 4.63803C3 5.27976 3 6.11984 3 7.8V16.2C3 17.8802 3 18.7202 3.32698 19.362C3.6146 19.9265 4.07354 20.3854 4.63803 20.673C5.27976 21 6.11984 21 7.8 21Z"stroke=#F04438 stroke-width=2 stroke-linecap=round stroke-linejoin=round>');function w(){return n()}function k(){return a()}function S(){return o()}function E(){return i()}function M(){return s()}function N(){return l()}function L(){return d()}function F(){return s()}function D(){return c()}function z(){return u()}function T(){return g()}function B(){return p()}function P(){return h()}function I(){return f()}function G(){return m()}function A(){return v()}function H(){return y()}function j(){return b()}function _(){return C()}function O(e){var n,a;return a=(n=x()).firstChild,(0,r.effect)(()=>(0,t.setAttribute)(a,"stroke","dark"===e.theme?"#12B76A":"#027A48")),n}function V(){return $()}e.s(["CheckCircleIcon",()=>B,"ChevronDownIcon",()=>I,"CloseIcon",()=>j,"Cogs",()=>E,"CopiedCopier",()=>O,"Copier",()=>w,"ErrorCopier",()=>V,"ExternalLinkIcon",()=>A,"GeoTag",()=>L,"Keyboard",()=>N,"Link",()=>D,"List",()=>k,"PackageIcon",()=>T,"PageSearch",()=>S,"PiP",()=>_,"SearchIcon",()=>G,"SettingsCog",()=>M,"SettingsIcon",()=>H,"SocialBubble",()=>F,"X",()=>z,"XCircleIcon",()=>P])},201704,e=>{"use strict";class t{#e=!0;#t;#r;#n;#a;#o;#i;#s;#l=0;#d=5;#c=!1;#u=!1;#g=null;#p=()=>{this.debugLog("Connected to event bus"),this.#o=!0,this.#c=!1,this.debugLog("Emitting queued events",this.#a),this.#a.forEach(e=>this.emitEventToBus(e)),this.#a=[],this.stopConnectLoop(),this.#r().removeEventListener("tanstack-connect-success",this.#p)};#h=()=>{if(this.#l<this.#d){this.#l++,this.dispatchCustomEvent("tanstack-connect",{});return}this.#r().removeEventListener("tanstack-connect",this.#h),this.#u=!0,this.debugLog("Max retries reached, giving up on connection"),this.stopConnectLoop()};#f=()=>{this.#c||(this.#c=!0,this.#r().addEventListener("tanstack-connect-success",this.#p),this.#h())};constructor({pluginId:e,debug:t=!1,enabled:r=!0,reconnectEveryMs:n=300}){this.#t=e,this.#e=r,this.#r=this.getGlobalTarget,this.#n=t,this.debugLog(" Initializing event subscription for plugin",this.#t),this.#a=[],this.#o=!1,this.#u=!1,this.#i=null,this.#s=n}startConnectLoop(){null!==this.#i||this.#o||(this.debugLog(`Starting connect loop (every ${this.#s}ms)`),this.#i=setInterval(this.#h,this.#s))}stopConnectLoop(){this.#c=!1,null!==this.#i&&(clearInterval(this.#i),this.#i=null,this.#a=[],this.debugLog("Stopped connect loop"))}debugLog(){for(var e=arguments.length,t=Array(e),r=0;r<e;r++)t[r]=arguments[r];this.#n&&console.log(`🌴 [tanstack-devtools:${this.#t}-plugin]`,...t)}getGlobalTarget(){if("u">typeof globalThis&&globalThis.__TANSTACK_EVENT_TARGET__)return this.debugLog("Using global event target"),globalThis.__TANSTACK_EVENT_TARGET__;if("u">typeof window&&void 0!==window.addEventListener)return this.debugLog("Using window as event target"),window;let e="u">typeof EventTarget?new EventTarget:void 0;return void 0===e||void 0===e.addEventListener?(this.debugLog("No event mechanism available, running in non-web environment"),{addEventListener:()=>{},removeEventListener:()=>{},dispatchEvent:()=>!1}):(this.debugLog("Using new EventTarget as fallback"),e)}getPluginId(){return this.#t}dispatchCustomEventShim(e,t){try{let r=new Event(e,{detail:t});this.#r().dispatchEvent(r)}catch(e){this.debugLog("Failed to dispatch shim event")}}dispatchCustomEvent(e,t){try{this.#r().dispatchEvent(new CustomEvent(e,{detail:t}))}catch(r){this.dispatchCustomEventShim(e,t)}}emitEventToBus(e){this.debugLog("Emitting event to client bus",e),this.dispatchCustomEvent("tanstack-dispatch-event",e)}createEventPayload(e,t){return{type:`${this.#t}:${e}`,payload:t,pluginId:this.#t}}emit(e,t){if(!this.#e)return void this.debugLog("Event bus client is disabled, not emitting event",e,t);if(this.#g&&(this.debugLog("Emitting event to internal event target",e,t),this.#g.dispatchEvent(new CustomEvent(`${this.#t}:${e}`,{detail:this.createEventPayload(e,t)}))),this.#u)return void this.debugLog("Previously failed to connect, not emitting to bus");if(!this.#o){this.debugLog("Bus not available, will be pushed as soon as connected"),this.#a.push(this.createEventPayload(e,t)),"u">typeof CustomEvent&&!this.#c&&(this.#f(),this.startConnectLoop());return}return this.emitEventToBus(this.createEventPayload(e,t))}on(e,t,r){let n=r?.withEventTarget??!1,a=`${this.#t}:${e}`;if(n&&(this.#g||(this.#g=new EventTarget),this.#g.addEventListener(a,e=>{t(e.detail)})),!this.#e)return this.debugLog("Event bus client is disabled, not registering event",a),()=>{};let o=e=>{this.debugLog("Received event from bus",e.detail),t(e.detail)};return this.#r().addEventListener(a,o),this.debugLog("Registered event to bus",a),()=>{n&&this.#g?.removeEventListener(a,o),this.#r().removeEventListener(a,o)}}onAll(e){if(!this.#e)return this.debugLog("Event bus client is disabled, not registering event"),()=>{};let t=t=>{e(t.detail)};return this.#r().addEventListener("tanstack-devtools-global",t),()=>this.#r().removeEventListener("tanstack-devtools-global",t)}onAllPluginEvents(e){if(!this.#e)return this.debugLog("Event bus client is disabled, not registering event"),()=>{};let t=t=>{let r=t.detail;this.#t&&r.pluginId!==this.#t||e(r)};return this.#r().addEventListener("tanstack-devtools-global",t),()=>this.#r().removeEventListener("tanstack-devtools-global",t)}}e.s(["EventClient",()=>t])},919439,e=>{"use strict";var t=e.i(574788),r=e.i(585458),n=e.i(542372),a=e.i(201704);class o extends a.EventClient{constructor(){super({pluginId:"form-devtools",reconnectEveryMs:1e3})}}let i=new o,s=(0,t.createContext)(void 0),l=e=>{let a=function(){let[e,a]=(0,n.createStore)([]);return(0,t.createEffect)(()=>{let n=i.on("form-api",t=>{let n=t.payload.id,o=e.findIndex(e=>e.id===n);o>-1?a(o,{state:t.payload.state,options:t.payload.options,date:(0,r.default)()}):a(e=>[...e,{id:n,state:t.payload.state,options:t.payload.options,date:(0,r.default)(),history:[]}])});(0,t.onCleanup)(n)}),(0,t.createEffect)(()=>{let n=i.on("form-state",t=>{let n=t.payload.id,o=e.findIndex(e=>e.id===n);o>-1?a(o,{state:t.payload.state,date:(0,r.default)()}):a(e=>[...e,{id:n,state:t.payload.state,options:{},date:(0,r.default)(),history:[]}])});(0,t.onCleanup)(n)}),(0,t.createEffect)(()=>{let r=i.on("form-submission",t=>{let r=t.payload.id,n=e.findIndex(e=>e.id===r);if(n>-1&&e[n]){let{id:r,...o}=t.payload,i=[o,...e[n].history].slice(0,5);a(n,"history",i)}});(0,t.onCleanup)(r)}),(0,t.createEffect)(()=>{let e=i.on("form-unmounted",e=>{a(t=>t.filter(t=>t.id!==e.payload.id))});(0,t.onCleanup)(e)}),{store:e}}();return(0,t.createComponent)(s.Provider,{value:a,get children(){return e.children}})};function d(){let e=(0,t.useContext)(s);if(void 0===e)throw Error("useFormEventClient must be used within a FormEventClientContext");return{store:(0,t.createMemo)(()=>e.store)}}var c=e.i(766932),u=e.i(278322),g=e.i(492859),p=e.i(949936),h=e.i(739604),f=e.i(537261);let m={colors:{black:"#000000",white:"#ffffff",darkGray:{400:"#313749",500:"#292e3d",600:"#212530",700:"#191c24",800:"#111318"},gray:{100:"#f2f4f7",200:"#eaecf0",300:"#d0d5dd",400:"#98a2b3",500:"#667085",600:"#475467",800:"#1d2939",900:"#101828"},blue:{100:"#D1E9FF",300:"#84CAFF",400:"#53B1FD",500:"#2E90FA",600:"#1570EF",700:"#175CD3",900:"#194185"},green:{400:"#32D583"},red:{400:"#f87171"},yellow:{400:"#FDB022"},purple:{400:"#9B8AFB"},pink:{400:"#ec4899"}},alpha:{80:"cc",30:"4d",20:"33"},font:{size:{xs:"calc(var(--tsrd-font-size) * 0.75)",sm:"calc(var(--tsrd-font-size) * 0.875)",md:"var(--tsrd-font-size)",lg:"calc(var(--tsrd-font-size) * 1.125)"},weight:{semibold:"600",bold:"700"},fontFamily:{mono:"ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace"}},border:{radius:{sm:"calc(var(--tsrd-font-size) * 0.25)",md:"calc(var(--tsrd-font-size) * 0.375)",lg:"calc(var(--tsrd-font-size) * 0.5)"}},size:{1:"calc(var(--tsrd-font-size) * 0.25)",2:"calc(var(--tsrd-font-size) * 0.5)",3:"calc(var(--tsrd-font-size) * 0.75)",4:"calc(var(--tsrd-font-size) * 1)"},shadow:{xs:function(){return arguments.length>0&&void 0!==arguments[0]&&arguments[0],"0 1px 2px 0 rgb(0 0 0 / 0.05)"},sm:function(){let e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:"rgb(0 0 0 / 0.1)";return`0 1px 3px 0 ${e}, 0 1px 2px -1px ${e}`},md:function(){let e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:"rgb(0 0 0 / 0.1)";return`0 4px 6px -1px ${e}, 0 2px 4px -2px ${e}`},lg:function(){let e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:"rgb(0 0 0 / 0.1)";return`0 10px 15px -3px ${e}, 0 4px 6px -4px ${e}`},xl:function(){let e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:"rgb(0 0 0 / 0.1)";return`0 20px 25px -5px ${e}, 0 8px 10px -6px ${e}`},"2xl":function(){let e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:"rgb(0 0 0 / 0.25)";return`0 25px 50px -12px ${e}`},inner:function(){let e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:"rgb(0 0 0 / 0.05)";return`inset 0 2px 4px 0 ${e}`},none:()=>"none"}},v=e=>{let{colors:t,font:r,size:n,alpha:a,border:o}=m,{fontFamily:i,size:s}=r,l=h.css,d=(t,r)=>"light"===e?t:r;return{mainContainer:l`
      display: flex;
      flex: 1;
      min-height: 80%;
      overflow: hidden;
      padding: ${n[2]};
    `,dragHandle:l`
      width: 8px;
      background: ${d(t.gray[300],t.darkGray[600])};
      cursor: col-resize;
      position: relative;
      transition: all 0.2s ease;
      user-select: none;
      pointer-events: all;
      margin: 0 ${n[1]};
      border-radius: 2px;

      &:hover {
        background: ${d(t.blue[600],t.blue[500])};
        margin: 0 ${n[1]};
      }

      &.dragging {
        background: ${d(t.blue[700],t.blue[600])};
        margin: 0 ${n[1]};
      }

      &::after {
        content: '';
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 2px;
        height: 20px;
        background: ${d(t.gray[400],t.darkGray[400])};
        border-radius: 1px;
        pointer-events: none;
      }

      &:hover::after,
      &.dragging::after {
        background: ${d(t.blue[500],t.blue[300])};
      }
    `,leftPanel:l`
      background: ${d(t.gray[100],t.darkGray[800])};
      border-radius: ${o.radius.lg};
      border: 1px solid ${d(t.gray[200],t.darkGray[700])};
      display: flex;
      flex-direction: column;
      overflow: hidden;
      min-height: 0;
      flex-shrink: 0;
    `,rightPanel:l`
      background: ${d(t.gray[100],t.darkGray[800])};
      border-radius: ${o.radius.lg};
      border: 1px solid ${d(t.gray[200],t.darkGray[700])};
      display: flex;
      flex-direction: column;
      overflow: hidden;
      min-height: 0;
      flex: 1;
    `,panelHeader:l`
      font-size: ${s.md};
      font-weight: ${r.weight.bold};
      color: ${d(t.blue[700],t.blue[400])};
      padding: ${n[2]};
      border-bottom: 1px solid ${d(t.gray[200],t.darkGray[700])};
      background: ${d(t.gray[100],t.darkGray[800])};
      flex-shrink: 0;
    `,utilList:l`
      flex: 1;
      overflow-y: auto;
      padding: ${n[1]};
      min-height: 0;
    `,utilGroup:l`
      margin-bottom: ${n[2]};
    `,utilGroupHeader:l`
      font-size: ${s.xs};
      font-weight: ${r.weight.semibold};
      color: ${d(t.gray[600],t.gray[400])};
      text-transform: uppercase;
      letter-spacing: 0.05em;
      margin-bottom: ${n[1]};
      padding: ${n[1]} ${n[2]};
      background: ${d(t.gray[200],t.darkGray[700])};
      border-radius: ${o.radius.md};
    `,utilRow:l`
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: ${n[2]};
      margin-bottom: ${n[1]};
      background: ${d(t.gray[200],t.darkGray[700])};
      border-radius: ${o.radius.md};
      cursor: pointer;
      transition: all 0.2s ease;
      border: 1px solid transparent;

      &:hover {
        background: ${d(t.gray[300],t.darkGray[600])};
        border-color: ${d(t.gray[400],t.darkGray[500])};
      }
    `,utilRowSelected:l`
      background: ${d(t.blue[100],t.blue[900]+a[20])};
      border-color: ${d(t.blue[600],t.blue[500])};
      box-shadow: 0 0 0 1px
        ${d(t.blue[600]+a[30],t.blue[500]+a[30])};
    `,utilKey:l`
      font-family: ${i.mono};
      font-size: ${s.xs};
      color: ${d(t.gray[900],t.gray[100])};
      flex: 1;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    `,utilStatus:l`
      font-size: ${s.xs};
      color: ${d(t.gray[600],t.gray[400])};
      text-transform: uppercase;
      letter-spacing: 0.05em;
      padding: ${n[1]} ${n[1]};
      background: ${d(t.gray[300],t.darkGray[600])};
      border-radius: ${o.radius.sm};
      margin-left: ${n[1]};
    `,stateDetails:l`
      flex: 1;
      overflow-y: auto;
      padding: ${n[2]};
      min-height: 0;
    `,stateHeader:l`
      margin-bottom: ${n[2]};
      padding-bottom: ${n[2]};
      border-bottom: 1px solid ${d(t.gray[200],t.darkGray[700])};
    `,stateTitle:l`
      font-size: ${s.md};
      font-weight: ${r.weight.bold};
      color: ${d(t.blue[700],t.blue[400])};
      margin-bottom: ${n[1]};
    `,stateKey:l`
      font-family: ${i.mono};
      font-size: ${s.xs};
      color: ${d(t.gray[600],t.gray[400])};
      word-break: break-all;
    `,stateContent:l`
      background: ${d(t.gray[100],t.darkGray[700])};
      border-radius: ${o.radius.md};
      padding: ${n[2]};
      border: 1px solid ${d(t.gray[300],t.darkGray[600])};
    `,detailsGrid:l`
      display: grid;
      grid-template-columns: 1fr;
      gap: ${n[2]};
      align-items: start;
    `,detailSection:l`
      background: ${d(t.white,t.darkGray[700])};
      border: 1px solid ${d(t.gray[300],t.darkGray[600])};
      border-radius: ${o.radius.md};
      padding: ${n[2]};
    `,detailSectionHeader:l`
      font-size: ${s.sm};
      font-weight: ${r.weight.bold};
      color: ${d(t.gray[800],t.gray[200])};
      margin-bottom: ${n[1]};
      text-transform: uppercase;
      letter-spacing: 0.04em;
    `,actionsRow:l`
      display: flex;
      flex-wrap: wrap;
      gap: ${n[2]};
    `,actionButton:l`
      display: inline-flex;
      align-items: center;
      gap: ${n[1]};
      padding: ${n[1]} ${n[2]};
      border-radius: ${o.radius.md};
      border: 1px solid ${d(t.gray[300],t.darkGray[500])};
      background: ${d(t.gray[200],t.darkGray[600])};
      color: ${d(t.gray[900],t.gray[100])};
      font-size: ${s.xs};
      cursor: pointer;
      user-select: none;
      transition:
        background 0.15s,
        border-color 0.15s;
      &:hover {
        background: ${d(t.gray[300],t.darkGray[500])};
        border-color: ${d(t.gray[400],t.darkGray[400])};
      }
      &:disabled {
        opacity: 0.5;
        cursor: not-allowed;
        &:hover {
          background: ${d(t.gray[200],t.darkGray[600])};
          border-color: ${d(t.gray[300],t.darkGray[500])};
        }
      }
    `,actionDotBlue:l`
      width: 6px;
      height: 6px;
      border-radius: 9999px;
      background: ${t.blue[400]};
    `,actionDotGreen:l`
      width: 6px;
      height: 6px;
      border-radius: 9999px;
      background: ${t.green[400]};
    `,actionDotRed:l`
      width: 6px;
      height: 6px;
      border-radius: 9999px;
      background: ${t.red[400]};
    `,actionDotYellow:l`
      width: 6px;
      height: 6px;
      border-radius: 9999px;
      background: ${t.yellow[400]};
    `,actionDotOrange:l`
      width: 6px;
      height: 6px;
      border-radius: 9999px;
      background: ${t.pink[400]};
    `,actionDotPurple:l`
      width: 6px;
      height: 6px;
      border-radius: 9999px;
      background: ${t.purple[400]};
    `,infoGrid:l`
      display: grid;
      grid-template-columns: auto 1fr;
      gap: ${n[1]};
      row-gap: ${n[1]};
      align-items: center;
    `,infoLabel:l`
      color: ${d(t.gray[600],t.gray[400])};
      font-size: ${s.xs};
      text-transform: uppercase;
      letter-spacing: 0.05em;
    `,infoValueMono:l`
      font-family: ${i.mono};
      font-size: ${s.xs};
      color: ${d(t.gray[900],t.gray[100])};
      word-break: break-all;
    `,noSelection:l`
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      color: ${d(t.gray[500],t.gray[500])};
      font-style: italic;
      text-align: center;
      padding: ${n[4]};
    `,sectionContainer:l`
      display: flex;
      flex-wrap: wrap;
      gap: ${n[4]};
    `,section:l`
      background: ${d(t.gray[100],t.darkGray[800])};
      border-radius: ${o.radius.lg};
      box-shadow: ${m.shadow.md(d(t.gray[400]+a[80],t.black+a[80]))};
      padding: ${n[4]};
      margin-bottom: ${n[4]};
      border: 1px solid ${d(t.gray[200],t.darkGray[700])};
      min-width: 0;
      max-width: 33%;
      max-height: fit-content;
    `,sectionHeader:l`
      font-size: ${s.lg};
      font-weight: ${r.weight.bold};
      margin-bottom: ${n[2]};
      color: ${d(t.blue[600],t.blue[400])};
      letter-spacing: 0.01em;
      display: flex;
      align-items: center;
      gap: ${n[2]};
    `,sectionEmpty:l`
      color: ${d(t.gray[500],t.gray[500])};
      font-size: ${s.sm};
      font-style: italic;
      margin: ${n[2]} 0;
    `,instanceList:l`
      display: flex;
      flex-direction: column;
      gap: ${n[2]};
      background: ${d(t.gray[200],t.darkGray[700])};
      border: 1px solid ${d(t.gray[300],t.darkGray[600])};
    `,instanceCard:l`
      background: ${d(t.gray[200],t.darkGray[700])};
      border-radius: ${o.radius.md};
      padding: ${n[3]};
      border: 1px solid ${d(t.gray[300],t.darkGray[600])};
      font-size: ${s.sm};
      color: ${d(t.gray[900],t.gray[100])};
      font-family: ${i.mono};
      overflow-x: auto;
      transition:
        box-shadow 0.3s,
        background 0.3s;
    `}};function y(){let{theme:e}=(0,f.useTheme)(),[r,n]=(0,t.createSignal)(v(e()));return(0,t.createEffect)(()=>{n(v(e()))}),r}var b=e.i(7284),C=(0,c.template)("<div>"),x=(0,c.template)("<div><div>");function $(e){var r,n;let a=y(),{store:o}=d();return r=C(),(0,c.insert)(r,(n=(0,c.memo)(()=>o().length>0),()=>{var r;return n()&&(r=C(),(0,c.insert)(r,(0,t.createComponent)(t.For,{get each(){return o()},children:t=>{var r,n;return n=(r=x()).firstChild,r.$$click=()=>e.setSelectedKey(t.id),(0,c.insert)(n,()=>t.id),(0,u.effect)(o=>{var i=(0,b.default)(a().utilRow,e.selectedKey()===t.id&&a().utilRowSelected),s=a().utilKey;return i!==o.e&&(0,c.className)(r,o.e=i),s!==o.t&&(0,c.className)(n,o.t=s),o},{e:void 0,t:void 0}),r}})),(0,u.effect)(()=>(0,c.className)(r,a().utilGroup)),r)})),(0,u.effect)(()=>(0,c.className)(r,a().utilList)),r}(0,c.delegateEvents)(["click"]);var w=e.i(992457),k=(0,c.template)("<div><button><span></span>Flush</button><button><span></span>Reset</button><button><span></span>Submit (-f)");function S(e){var t,r,n,a,o,s,l;let d=y();return n=(r=(t=k()).firstChild).firstChild,o=(a=r.nextSibling).firstChild,l=(s=a.nextSibling).firstChild,r.$$mousedown=()=>{i.emit("request-form-state",{id:e.selectedInstance()?.id})},a.$$mousedown=()=>{i.emit("request-form-reset",{id:e.selectedInstance()?.id})},s.$$mousedown=()=>{i.emit("request-form-force-submit",{id:e.selectedInstance()?.id})},(0,u.effect)(e=>{var i=d().actionsRow,u=d().actionButton,g=d().actionDotGreen,p=d().actionButton,h=d().actionDotRed,f=d().actionButton,m=d().actionDotYellow;return i!==e.e&&(0,c.className)(t,e.e=i),u!==e.t&&(0,c.className)(r,e.t=u),g!==e.a&&(0,c.className)(n,e.a=g),p!==e.o&&(0,c.className)(a,e.o=p),h!==e.i&&(0,c.className)(o,e.i=h),f!==e.n&&(0,c.className)(s,e.n=f),m!==e.s&&(0,c.className)(l,e.s=m),e},{e:void 0,t:void 0,a:void 0,o:void 0,i:void 0,n:void 0,s:void 0}),t}(0,c.delegateEvents)(["mousedown"]);var E=e.i(612437),M=(0,c.template)("<div><div>Form state</div><div><div><div>Key</div><div></div><div>Last Updated</div><div> (<!>)");function N(e){var n,a,o,i,s,l,d,g,p,h;let f=y(),[m,v]=(0,t.createSignal)((0,r.default)().unix());(0,t.onMount)(()=>{let e=setInterval(()=>v((0,r.default)().unix()),1e3);(0,t.onCleanup)(()=>clearInterval(e))});let b=e.selectedInstance,C=(0,t.createMemo)(()=>b()?.date.unix()??(0,r.default)().unix()),x=(0,t.createMemo)(()=>{let e=Math.max(m()-C(),0);return e<60?`${e} second${1!==e?"s":""} ago`:r.default.unix(C()).fromNow()});return b()?((h=(p=(g=(d=(l=(s=(i=(o=(a=(n=M()).firstChild).nextSibling).firstChild).firstChild).nextSibling).nextSibling).nextSibling).firstChild).nextSibling).nextSibling,o.style.setProperty("display","flex"),o.style.setProperty("align-items","center"),o.style.setProperty("gap","16px"),(0,c.insert)(l,()=>b().id),(0,c.insert)(g,()=>new Date(1e3*C()).toLocaleTimeString(),p),(0,c.insert)(g,x,h),(0,u.effect)(e=>{var t=f().stateHeader,r=f().stateTitle,o=f().infoGrid,u=f().infoLabel,p=f().infoValueMono,h=f().infoLabel,m=f().infoValueMono;return t!==e.e&&(0,c.className)(n,e.e=t),r!==e.t&&(0,c.className)(a,e.t=r),o!==e.a&&(0,c.className)(i,e.a=o),u!==e.o&&(0,c.className)(s,e.o=u),p!==e.i&&(0,c.className)(l,e.i=p),h!==e.n&&(0,c.className)(d,e.n=h),m!==e.s&&(0,c.className)(g,e.s=m),e},{e:void 0,t:void 0,a:void 0,o:void 0,i:void 0,n:void 0,s:void 0}),n):null}r.default.extend(E.default);var L=(0,c.template)("<div><div><div>Actions</div></div><div><div>Individual Fields</div><div></div></div><div><div>Form values</div><div></div></div><div><div>Form status</div><div></div></div><div><div>Form options</div><div></div></div><div><div>Submission history</div><div>"),F=(0,c.template)("<div>"),D=(0,c.template)("<div><div>");function z(e){var r;let{selectedKey:n}=e,a=y(),{store:o}=d(),i=(0,t.createMemo)(()=>o().findIndex(e=>e.id===n())),s=(0,t.createMemo)(()=>i()>-1?o()[i()]:null),l=(0,t.createMemo)(()=>s()?.state),g=(0,t.createMemo)(()=>({canSubmit:l()?.canSubmit,isFormValid:l()?.isFormValid,isFormValidating:l()?.isFormValidating,isSubmitted:l()?.isSubmitted,isSubmitting:l()?.isSubmitting,isSubmitSuccessful:l()?.isSubmitSuccessful,submissionAttempts:l()?.submissionAttempts,errors:l()?.errors,errorMap:l()?.errorMap})),p=(0,t.createMemo)(()=>{let e={},t=l()?.values||{},r=l()?.fieldMeta||{};return Object.keys(t).forEach(n=>{e[n]={value:t[n],meta:r[n]}}),e});return r=F(),(0,c.insert)(r,(0,t.createComponent)(t.Show,{get when(){return s()},get children(){var h,f,m,v,b,C,x,$,k,E,M,z,T,B,P,I,G,A;return[(0,t.createComponent)(N,{selectedInstance:s}),(m=(f=(h=L()).firstChild).firstChild,C=(b=(v=f.nextSibling).firstChild).nextSibling,k=($=(x=v.nextSibling).firstChild).nextSibling,z=(M=(E=x.nextSibling).firstChild).nextSibling,P=(B=(T=E.nextSibling).firstChild).nextSibling,A=(G=(I=T.nextSibling).firstChild).nextSibling,(0,c.insert)(f,(0,t.createComponent)(S,{selectedInstance:s}),null),C.style.setProperty("display","flex"),C.style.setProperty("gap","8px"),(0,c.insert)(C,(0,t.createComponent)(t.For,{get each(){return Object.entries(p())},children:e=>{var r,n;let[o,i]=e;return n=(r=D()).firstChild,r.style.setProperty("margin-bottom","16px"),n.style.setProperty("font-weight","bold"),n.style.setProperty("margin-bottom","4px"),(0,c.insert)(n,o),(0,c.insert)(r,(0,t.createComponent)(w.JsonTree,{copyable:!0,value:i}),null),(0,u.effect)(()=>(0,c.className)(r,a().stateContent)),r}})),(0,c.insert)(k,(0,t.createComponent)(w.JsonTree,{copyable:!0,get value(){return o()[i()].state.values}})),(0,c.insert)(z,(0,t.createComponent)(w.JsonTree,{copyable:!0,get value(){return g()}})),(0,c.insert)(P,(0,t.createComponent)(w.JsonTree,{copyable:!0,get value(){return o()[i()]?.options},collapsePaths:["validators"]})),(0,c.insert)(A,(0,t.createComponent)(w.JsonTree,{copyable:!0,get value(){return o()[i()]?.history}})),(0,u.effect)(e=>{var t=a().detailsGrid,r=a().detailSection,n=a().detailSectionHeader,o=a().detailSection,i=a().detailSectionHeader,s=a().detailSection,l=a().detailSectionHeader,d=a().stateContent,u=a().detailSection,g=a().detailSectionHeader,p=a().stateContent,y=a().detailSection,C=a().detailSectionHeader,w=a().stateContent,S=a().detailSection,N=a().detailSectionHeader,L=a().stateContent;return t!==e.e&&(0,c.className)(h,e.e=t),r!==e.t&&(0,c.className)(f,e.t=r),n!==e.a&&(0,c.className)(m,e.a=n),o!==e.o&&(0,c.className)(v,e.o=o),i!==e.i&&(0,c.className)(b,e.i=i),s!==e.n&&(0,c.className)(x,e.n=s),l!==e.s&&(0,c.className)($,e.s=l),d!==e.h&&(0,c.className)(k,e.h=d),u!==e.r&&(0,c.className)(E,e.r=u),g!==e.d&&(0,c.className)(M,e.d=g),p!==e.l&&(0,c.className)(z,e.l=p),y!==e.u&&(0,c.className)(T,e.u=y),C!==e.c&&(0,c.className)(B,e.c=C),w!==e.w&&(0,c.className)(P,e.w=w),S!==e.m&&(0,c.className)(I,e.m=S),N!==e.f&&(0,c.className)(G,e.f=N),L!==e.y&&(0,c.className)(A,e.y=L),e},{e:void 0,t:void 0,a:void 0,o:void 0,i:void 0,n:void 0,s:void 0,h:void 0,r:void 0,d:void 0,l:void 0,u:void 0,c:void 0,w:void 0,m:void 0,f:void 0,y:void 0}),h)]}})),(0,u.effect)(()=>(0,c.className)(r,a().stateDetails)),r}var T=(0,c.template)("<div>Details"),B=(0,c.template)("<div><div></div><div></div><div>");function P(){let e=y(),[r,n]=(0,t.createSignal)(300),[a,o]=(0,t.createSignal)(!1),[i,s]=(0,t.createSignal)(null),l=0,d=0,h=e=>{e.preventDefault(),e.stopPropagation(),o(!0),document.body.style.cursor="col-resize",document.body.style.userSelect="none",l=e.clientX,d=r()},f=e=>{if(!a())return;e.preventDefault();let t=e.clientX-l;n(Math.max(150,Math.min(800,d+t)))},m=()=>{o(!1),document.body.style.cursor="",document.body.style.userSelect=""};return(0,t.onMount)(()=>{document.addEventListener("mousemove",f),document.addEventListener("mouseup",m)}),(0,t.onCleanup)(()=>{document.removeEventListener("mousemove",f),document.removeEventListener("mouseup",m)}),(0,t.createComponent)(g.MainPanel,{get children(){var v,b,C,x;return[(0,t.createComponent)(p.Header,{get children(){return(0,t.createComponent)(p.HeaderLogo,{flavor:{light:"#eeaf00",dark:"#eeaf00"},onClick:()=>{window.open("https://tanstack.com/form/latest/docs/overview","_blank")},children:"TanStack Form"})}}),(x=(C=(b=(v=B()).firstChild).nextSibling).nextSibling,b.style.setProperty("min-width","150px"),b.style.setProperty("max-width","800px"),(0,c.insert)(b,(0,t.createComponent)($,{selectedKey:i,setSelectedKey:s})),C.$$mousedown=h,x.style.setProperty("flex","1"),(0,c.insert)(x,(0,t.createComponent)(t.Show,{get when(){return null!=i()},get children(){var w;return[(w=T(),(0,u.effect)(()=>(0,c.className)(w,e().panelHeader)),w),(0,t.createComponent)(z,{selectedKey:i})]}})),(0,u.effect)(t=>{var n=e().mainContainer,o=e().leftPanel,i=`${r()}px`,s=`${e().dragHandle} ${a()?"dragging":""}`,l=e().rightPanel;return n!==t.e&&(0,c.className)(v,t.e=n),o!==t.t&&(0,c.className)(b,t.t=o),i!==t.a&&(null!=(t.a=i)?b.style.setProperty("width",i):b.style.removeProperty("width")),s!==t.o&&(0,c.className)(C,t.o=s),l!==t.i&&(0,c.className)(x,t.i=l),t},{e:void 0,t:void 0,a:void 0,o:void 0,i:void 0}),v)]}})}function I(){return(0,t.createComponent)(l,{get children(){return(0,t.createComponent)(P,{})}})}(0,c.delegateEvents)(["mousedown"]),e.s(["default",()=>I],919439)}]);