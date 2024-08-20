import{b as $,g as S,r as d,s as U,_ as m,d as E,e as P,j as t,f as w,h as B,ac as V,y as N,z,X as M,B as j,Q as b,W as k,ap as q,$ as A}from"./index-CNTiDywt.js";function F(e){return $("MuiImageList",e)}S("MuiImageList",["root","masonry","quilted","standard","woven"]);const D=d.createContext({}),O=["children","className","cols","component","rowHeight","gap","style","variant"],W=e=>{const{classes:s,variant:r}=e;return B({root:["root",r]},F,s)},G=U("ul",{name:"MuiImageList",slot:"Root",overridesResolver:(e,s)=>{const{ownerState:r}=e;return[s.root,s[r.variant]]}})(({ownerState:e})=>m({display:"grid",overflowY:"auto",listStyle:"none",padding:0,WebkitOverflowScrolling:"touch"},e.variant==="masonry"&&{display:"block"})),T=d.forwardRef(function(s,r){const i=E({props:s,name:"MuiImageList"}),{children:p,className:f,cols:g=2,component:a="ul",rowHeight:o="auto",gap:c=4,style:x,variant:l="standard"}=i,n=P(i,O),u=d.useMemo(()=>({rowHeight:o,gap:c,variant:l}),[o,c,l]);d.useEffect(()=>{},[]);const y=l==="masonry"?m({columnCount:g,columnGap:c},x):m({gridTemplateColumns:`repeat(${g}, 1fr)`,gap:c},x),I=m({},i,{component:a,gap:c,rowHeight:o,variant:l}),h=W(I);return t.jsx(G,m({as:a,className:w(h.root,h[l],f),ref:r,style:y,ownerState:I},n,{children:t.jsx(D.Provider,{value:u,children:p})}))});function Q(e){return $("MuiImageListItem",e)}const R=S("MuiImageListItem",["root","img","standard","woven","masonry","quilted"]),X=["children","className","cols","component","rows","style"],Y=e=>{const{classes:s,variant:r}=e;return B({root:["root",r],img:["img"]},Q,s)},J=U("li",{name:"MuiImageListItem",slot:"Root",overridesResolver:(e,s)=>{const{ownerState:r}=e;return[{[`& .${R.img}`]:s.img},s.root,s[r.variant]]}})(({ownerState:e})=>m({display:"block",position:"relative"},e.variant==="standard"&&{display:"flex",flexDirection:"column"},e.variant==="woven"&&{height:"100%",alignSelf:"center","&:nth-of-type(even)":{height:"70%"}},{[`& .${R.img}`]:m({objectFit:"cover",width:"100%",height:"100%",display:"block"},e.variant==="standard"&&{height:"auto",flexGrow:1})})),K=d.forwardRef(function(s,r){const i=E({props:s,name:"MuiImageListItem"}),{children:p,className:f,cols:g=1,component:a="li",rows:o=1,style:c}=i,x=P(i,X),{rowHeight:l="auto",gap:n,variant:u}=d.useContext(D);let y="auto";u==="woven"?y=void 0:l!=="auto"&&(y=l*o+n*(o-1));const I=m({},i,{cols:g,component:a,gap:n,rowHeight:l,rows:o,variant:u}),h=Y(I);return t.jsx(J,m({as:a,className:w(h.root,h[u],f),ref:r,style:m({height:y,gridColumnEnd:u!=="masonry"?`span ${g}`:void 0,gridRowEnd:u!=="masonry"?`span ${o}`:void 0,marginBottom:u==="masonry"?n:void 0,breakInside:u==="masonry"?"avoid":void 0},c),ownerState:I},x,{children:d.Children.map(p,v=>d.isValidElement(v)?v.type==="img"||V(v,["Image"])?d.cloneElement(v,{className:w(h.img,v.props.className)}):v:null)}))});var C={},Z=z;Object.defineProperty(C,"__esModule",{value:!0});var H=C.default=void 0,ee=Z(N()),te=t;H=C.default=(0,ee.default)((0,te.jsx)("path",{d:"M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6zM19 4h-3.5l-1-1h-5l-1 1H5v2h14z"}),"Delete");var _={},se=z;Object.defineProperty(_,"__esModule",{value:!0});var L=_.default=void 0,oe=se(N()),ae=t;L=_.default=(0,oe.default)((0,ae.jsx)("path",{d:"M19 7v2.99s-1.99.01-2 0V7h-3s.01-1.99 0-2h3V2h2v3h3v2zm-3 4V8h-3V5H5c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2v-8zM5 19l3-4 2 3 3-4 4 5z"}),"AddPhotoAlternate");function ne({updateImage:e,setupdateImage:s,collection:r}){const[i,p]=d.useState(!1),f=a=>{const o=[...e];o.splice(a,1),s&&s(o)},g=async a=>{const o=Array.from(a.target.files);if(o.length>0){p(!0);try{const c=o.map(n=>q(r+"/",n)),l=(await Promise.all(c)).filter(n=>n.success).map(n=>n.data);s(n=>[...n,...l])}catch{A.error("Error uploading Images")}finally{p(!1)}}};return(e==null?void 0:e.length)===0?t.jsxs(t.Fragment,{children:[i&&t.jsx(M,{}),t.jsx(j,{children:t.jsxs(b,{variant:"contained",color:"indigo",component:"label",startIcon:t.jsx(L,{}),sx:{marginBottom:2},children:["Upload Image",t.jsx("input",{type:"file",hidden:!0,accept:"image/*",multiple:!0,onChange:g})]})})]}):t.jsxs(t.Fragment,{children:[i&&t.jsx(M,{}),t.jsxs(j,{children:[t.jsxs(b,{variant:"contained",color:"indigo",component:"label",startIcon:t.jsx(L,{}),sx:{marginBottom:2},children:["Upload Image",t.jsx("input",{type:"file",hidden:!0,accept:"image/*",multiple:!0,onChange:g})]}),t.jsx(T,{sx:{width:"100%",height:200},cols:2,rowHeight:164,children:e.map((a,o)=>t.jsx(K,{children:t.jsxs(j,{position:"absolute",children:[t.jsx("img",{srcSet:`${a}?w=164&h=164&fit=crop&auto=format&dpr=2 2x`,src:`${a}?w=164&h=164&fit=crop&auto=format`,loading:"lazy",alt:"uploaded",style:{width:"96%",height:"90%",objectFit:"cover"}},a),t.jsx(k,{sx:{position:"absolute",top:8,right:8},onClick:()=>f(o),children:t.jsx(H,{sx:{color:"red"}})})]})},a))})]})]})}export{ne as S};
