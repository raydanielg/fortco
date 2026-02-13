import{r as n,j as t,H as U}from"./app-Be5uCMNC.js";import{D as X}from"./DashboardLayout-BxHtKg-F.js";import{D as B}from"./DocumentPreview-C_-aWG8s.js";function K(){const[S,d]=n.useState(!1),[y,l]=n.useState(""),[h,E]=n.useState([]),[c,R]=n.useState(""),[k,v]=n.useState(!1),[L,$]=n.useState(""),w=n.useRef(null),[p,m]=n.useState(""),f=n.useRef(null),j=()=>document.querySelector('meta[name="csrf-token"]')?.getAttribute("content")||"",g=async e=>{const s=await e.text();try{return s?JSON.parse(s):{}}catch{return{}}},b=()=>{d(!0),l(""),fetch(route("admin.security.employees"),{credentials:"same-origin",headers:{"X-Requested-With":"XMLHttpRequest",Accept:"application/json"}}).then(async e=>{const s=await g(e);if(!e.ok)throw new Error(s?.message||"Failed to load employees");E(Array.isArray(s?.employees)?s.employees:[])}).catch(e=>l(e?.message||"Failed to load employees")).finally(()=>d(!1))};n.useEffect(()=>{b()},[]),n.useEffect(()=>{const e=s=>{p&&f.current&&(f.current.contains(s.target)||m(""))};return document.addEventListener("mousedown",e),()=>document.removeEventListener("mousedown",e)},[p]);const P=e=>{const s=e?.user?.id||e?.user_id;s&&(window.location.href=route("admin.user-management.sessions-logs",{user:s}))},A=e=>{const s=e?.user?.id||e?.user_id;if(!s)return;const o=!!e?.user?.banned_at,a=o?"Unban":"Ban";window.confirm(`${a} ${e.full_name}?`)&&(d(!0),l(""),fetch(route(o?"admin.security.users.unban":"admin.security.users.ban",{user:s}),{method:"POST",credentials:"same-origin",headers:{"X-Requested-With":"XMLHttpRequest","X-CSRF-TOKEN":j(),Accept:"application/json"}}).then(async r=>{const x=await g(r);if(!r.ok)throw new Error(x?.message||"Action failed");b()}).catch(r=>l(r?.message||"Action failed")).finally(()=>d(!1)))},C=e=>{const s=e?.user?.id||e?.user_id,o=e?.user?.email;!s||!o||window.confirm(`Send password reset link to ${o}?`)&&(d(!0),l(""),fetch(route("admin.security.users.password-reset",{user:s}),{method:"POST",credentials:"same-origin",headers:{"X-Requested-With":"XMLHttpRequest","X-CSRF-TOKEN":j(),Accept:"application/json"}}).then(async a=>{const r=await g(a);if(!a.ok)throw new Error(r?.message||"Failed to send reset link");alert("Reset link sent.")}).catch(a=>l(a?.message||"Failed to send reset link")).finally(()=>d(!1)))},F=()=>{try{const e=i=>String(i??"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;"),s=(u||[]).map(i=>{const q=i?.user?.banned_at?"Banned":i?.active?"Active":"Inactive",I=i?.last_activity?new Date(i.last_activity).toLocaleString():"-",H=i?.sessions_count??0;return`
                    <tr>
                        <td>${e(i?.full_name)}</td>
                        <td>${e(i?.user?.email||"")}</td>
                        <td>${e(i?.designation||"")}</td>
                        <td>${e(i?.phone||"")}</td>
                        <td class="num">${e(H)}</td>
                        <td>${e(I)}</td>
                        <td>${e(q)}</td>
                    </tr>
                `}),o=new Date().toLocaleString(),a="EMPLOYEE ACCOUNTS REPORT",r="FORTCO ERP",x="ADMINISTRATION OFFICE",_="Tel: +255 000 000 000, Email: info@fortco.local",D="This document provides an official summary of employees registered in the system, including contact details, recent session activity and account status.",N=(u||[]).length,O=c.trim()?`Filter: "${e(c.trim())}"`:"Filter: None",z=`${window.location.origin}/favicon.svg`,M=`
                <!doctype html>
                <html>
                <head>
                    <meta charset="utf-8" />
                    <meta name="viewport" content="width=device-width, initial-scale=1" />
                    <title>${a}</title>
                    <style>
                        :root { --ink:#0f172a; --muted:#475569; --line:#cbd5e1; --paper:#ffffff; --canvas:#e5e7eb; }
                        body { font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial; background: var(--canvas); color: var(--ink); margin: 0; padding: 24px; }
                        .page { max-width: 980px; margin: 0 auto; background: var(--paper); border: 1px solid var(--line); }
                        .top { padding: 18px 20px 10px 20px; text-align: center; }
                        .crest { width: 58px; height: 58px; margin: 0 auto 8px auto; display:flex; align-items:center; justify-content:center; overflow:hidden; }
                        .crest img { width: 58px; height: 58px; object-fit: contain; }
                        .top .l1 { font-size: 12px; font-weight: 800; letter-spacing: 0.05em; }
                        .top .l2 { font-size: 11px; font-weight: 800; margin-top: 2px; }
                        .top .l3 { font-size: 11px; color: var(--muted); margin-top: 3px; }
                        .title { margin-top: 10px; font-size: 12px; font-weight: 900; letter-spacing: 0.08em; }
                        .titleLine { margin-top: 6px; font-size: 12px; font-weight: 900; letter-spacing: 0.18em; }
                        .subTitle { margin-top: 6px; font-size: 11px; color: var(--muted); }
                        .body { padding: 0 20px 6px 20px; }
                        .section { padding: 14px 0; border-top: 1px dashed #cbd5e1; }
                        .section:first-child { border-top: 1px solid #cbd5e1; }
                        .section h2 { margin: 0 0 6px 0; font-size: 12px; font-weight: 900; letter-spacing: 0.02em; }
                        .section p { margin: 0; font-size: 11px; color: var(--muted); line-height: 1.55; }
                        .metaRow { margin-top: 10px; display:flex; flex-wrap: wrap; gap: 14px; font-size: 11px; color: var(--muted); }
                        .metaRow strong { color: var(--ink); }
                        table { width: 100%; border-collapse: collapse; font-size: 11px; margin-top: 10px; }
                        th, td { border: 1px solid var(--line); padding: 8px 9px; vertical-align: top; }
                        th { background: #f8fafc; text-align: left; font-weight: 900; }
                        td.num, th.num { text-align: right; }
                        .footer { border-top: 1px solid var(--line); padding: 10px 20px; display:flex; justify-content: space-between; gap: 12px; font-size: 11px; color: var(--muted); }
                        @media print { body { background:#fff; padding:0; } .page { border:none; max-width:none; } }
                    </style>
                </head>
                <body>
                    <div class="page">
                        <div class="top">
                            <div class="crest"><img src="${z}" alt="Logo" /></div>
                            <div class="l1">${e(r)}</div>
                            <div class="l2">${e(x)}</div>
                            <div class="l3">${e(_)}</div>

                            <div class="title">${e(a)}</div>
                            <div class="titleLine">===== ===== =====</div>
                            <div class="subTitle">Generated: ${e(o)}</div>
                        </div>

                        <div class="body">
                            <div class="section">
                                <h2>1. REPORT SUMMARY</h2>
                                <p>${e(D)}</p>
                                <div class="metaRow">
                                    <div><strong>Total employees:</strong> ${e(N)}</div>
                                    <div><strong>${O}</strong></div>
                                </div>
                            </div>

                            <div class="section">
                                <h2>2. EMPLOYEE LIST</h2>
                                <p>This table lists all employees included in the current selection.</p>
                                <table>
                                    <thead>
                                        <tr>
                                            <th>Full Name</th>
                                            <th>Email</th>
                                            <th>Designation</th>
                                            <th>Phone</th>
                                            <th class="num">Sessions</th>
                                            <th>Last Activity</th>
                                            <th>Status</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        ${s.join("")}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        <div class="footer">
                            <div>Year ${e(new Date().getFullYear())}</div>
                            <div>Employees: <strong>${e(N)}</strong></div>
                        </div>
                    </div>
                </body>
                </html>
            `;$(M),v(!0)}catch(e){l(e?.message||"Failed to generate PDF preview.")}},T=()=>{const e=w.current?.contentWindow;e&&(e.focus(),e.print())},u=n.useMemo(()=>{const e=c.trim().toLowerCase();return e?h.filter(s=>{const o=String(s?.full_name||"").toLowerCase(),a=String(s?.user?.email||"").toLowerCase(),r=String(s?.phone||"").toLowerCase(),x=String(s?.designation||"").toLowerCase();return o.includes(e)||a.includes(e)||r.includes(e)||x.includes(e)}):h},[h,c]);return t.jsxs(X,{title:"User Management",breadcrumbs:["Admin","User Management","Employees"],children:[t.jsx(U,{title:"Employees"}),t.jsx(B,{open:k,title:"PDF Preview",onBack:()=>v(!1),onPrint:T,kind:"html",srcDoc:L,iframeRef:w}),t.jsxs("div",{className:"rounded-2xl border border-slate-200 bg-white",children:[t.jsxs("div",{className:"border-b border-slate-200 px-6 py-4",children:[t.jsxs("div",{className:"flex flex-wrap items-center justify-between gap-3",children:[t.jsxs("div",{children:[t.jsx("div",{className:"text-sm font-semibold text-slate-900",children:"Employees"}),t.jsx("div",{className:"mt-1 text-[12px] text-slate-500",children:"Employees registered in the system (linked to user accounts)."})]}),t.jsx("div",{className:"text-[12px] text-slate-500",children:S?"Loading…":""})]}),t.jsxs("div",{className:"mt-4 flex flex-wrap items-center gap-2",children:[t.jsx("input",{value:c,onChange:e=>R(e.target.value),placeholder:"Search by name, email, phone or designation",className:"w-full max-w-md rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-[12px] text-slate-900 placeholder:text-slate-400 focus:border-primary-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary-500/20"}),t.jsx("button",{type:"button",onClick:F,className:"rounded-xl border border-slate-200 bg-white px-4 py-2 text-[12px] font-semibold text-slate-700 hover:bg-slate-50",children:"Export to PDF"}),t.jsx("button",{type:"button",onClick:b,className:"rounded-xl border border-slate-200 bg-white px-4 py-2 text-[12px] font-semibold text-slate-700 hover:bg-slate-50",children:"Refresh"})]})]}),t.jsxs("div",{className:"p-6",children:[y?t.jsx("div",{className:"mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-[12px] text-red-700",children:y}):null,t.jsxs("table",{className:"w-full border border-slate-200 text-left text-[12px]",children:[t.jsx("thead",{className:"bg-slate-50 text-slate-600",children:t.jsxs("tr",{children:[t.jsx("th",{className:"px-4 py-3 font-semibold",children:"Full Name"}),t.jsx("th",{className:"px-4 py-3 font-semibold",children:"Email"}),t.jsx("th",{className:"px-4 py-3 font-semibold",children:"Designation"}),t.jsx("th",{className:"px-4 py-3 font-semibold",children:"Phone"}),t.jsx("th",{className:"px-4 py-3 font-semibold",children:"Sessions"}),t.jsx("th",{className:"px-4 py-3 font-semibold",children:"Last Activity"}),t.jsx("th",{className:"px-4 py-3 font-semibold",children:"Status"}),t.jsx("th",{className:"px-4 py-3 font-semibold text-right",children:"Action"})]})}),t.jsx("tbody",{className:"divide-y divide-slate-200",children:u.length?u.map(e=>t.jsxs("tr",{className:"bg-white hover:bg-slate-50",children:[t.jsx("td",{className:"px-4 py-3 font-semibold text-slate-900",children:e.full_name}),t.jsx("td",{className:"px-4 py-3 text-slate-700",children:e.user?.email||"-"}),t.jsx("td",{className:"px-4 py-3 text-slate-700",children:e.designation||"-"}),t.jsx("td",{className:"px-4 py-3 text-slate-700",children:e.phone||"-"}),t.jsx("td",{className:"px-4 py-3 text-slate-700",children:e.sessions_count??0}),t.jsx("td",{className:"px-4 py-3 text-slate-700",children:e.last_activity?new Date(e.last_activity).toLocaleString():"-"}),t.jsx("td",{className:"px-4 py-3",children:t.jsx("span",{className:"text-slate-700",children:e.user?.banned_at?"Banned":e.active?"Active":"Inactive"})}),t.jsx("td",{className:"relative px-4 py-3 text-right",children:t.jsxs("div",{className:"inline-block",ref:p&&String(p)===String(e.id)?f:null,children:[t.jsx("button",{type:"button",onClick:()=>m(s=>String(s)===String(e.id)?"":String(e.id)),className:"inline-flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-50","aria-label":"Actions",children:t.jsx("span",{className:"text-lg leading-none",children:"⋯"})}),String(p)===String(e.id)?t.jsxs("div",{className:"absolute right-0 z-20 mt-2 w-44 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-lg",children:[t.jsx("button",{type:"button",onClick:()=>{m(""),P(e)},className:"block w-full px-4 py-2 text-left text-[12px] text-slate-700 hover:bg-slate-50",children:"View profile"}),t.jsx("button",{type:"button",onClick:()=>{m(""),A(e)},className:"block w-full px-4 py-2 text-left text-[12px] text-slate-700 hover:bg-slate-50",children:e.user?.banned_at?"Unban":"Ban"}),t.jsx("button",{type:"button",onClick:()=>{m(""),C(e)},className:"block w-full px-4 py-2 text-left text-[12px] text-slate-700 hover:bg-slate-50",children:"Reset password"})]}):null]})})]},e.id)):t.jsx("tr",{children:t.jsx("td",{className:"px-4 py-6 text-slate-500",colSpan:8,children:"No employees found."})})})]})]})]})]})}export{K as default};
