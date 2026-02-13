import{r as n,j as t,H}from"./app-Be5uCMNC.js";import{D as B}from"./DashboardLayout-BxHtKg-F.js";import{D as W}from"./DocumentPreview-C_-aWG8s.js";function G(){const[N,l]=n.useState(!1),[v,i]=n.useState(""),[h,S]=n.useState([]),[c,R]=n.useState(""),[k,y]=n.useState(!1),[E,L]=n.useState(""),w=n.useRef(null),[p,d]=n.useState(""),u=n.useRef(null),f=()=>document.querySelector('meta[name="csrf-token"]')?.getAttribute("content")||"",g=async e=>{const s=await e.text();try{return s?JSON.parse(s):{}}catch{return{}}},x=()=>{l(!0),i(""),fetch(route("admin.security.users"),{credentials:"same-origin",headers:{"X-Requested-With":"XMLHttpRequest",Accept:"application/json"}}).then(async e=>{const s=await e.json().catch(()=>({}));if(!e.ok)throw new Error(s?.message||"Failed to load users");S(Array.isArray(s?.users)?s.users:[])}).catch(e=>i(e?.message||"Failed to load users")).finally(()=>l(!1))};n.useEffect(()=>{x()},[]),n.useEffect(()=>{const e=s=>{p&&u.current&&(u.current.contains(s.target)||d(""))};return document.addEventListener("mousedown",e),()=>document.removeEventListener("mousedown",e)},[p]);const $=e=>{e?.id&&(window.location.href=route("admin.user-management.sessions-logs",{user:e.id}))},T=e=>{if(!e?.id)return;const s=!!e?.banned_at,a=s?"Unban":"Ban";window.confirm(`${a} ${e.name}?`)&&(l(!0),i(""),fetch(route(s?"admin.security.users.unban":"admin.security.users.ban",{user:e.id}),{method:"POST",credentials:"same-origin",headers:{"X-Requested-With":"XMLHttpRequest","X-CSRF-TOKEN":f(),Accept:"application/json"}}).then(async r=>{const b=await g(r);if(!r.ok)throw new Error(b?.message||"Action failed");x()}).catch(r=>i(r?.message||"Action failed")).finally(()=>l(!1)))},A=e=>{e?.id&&window.confirm(`Send password reset link to ${e.email}?`)&&(l(!0),i(""),fetch(route("admin.security.users.password-reset",{user:e.id}),{method:"POST",credentials:"same-origin",headers:{"X-Requested-With":"XMLHttpRequest","X-CSRF-TOKEN":f(),Accept:"application/json"}}).then(async s=>{const a=await g(s);if(!s.ok)throw new Error(a?.message||"Failed to send reset link");alert("Reset link sent.")}).catch(s=>i(s?.message||"Failed to send reset link")).finally(()=>l(!1)))},C=e=>{e?.id&&window.confirm(`Delete ${e.name}? This cannot be undone.`)&&(l(!0),i(""),fetch(route("admin.security.users.delete",{user:e.id}),{method:"DELETE",credentials:"same-origin",headers:{"X-Requested-With":"XMLHttpRequest","X-CSRF-TOKEN":f(),Accept:"application/json"}}).then(async s=>{const a=await g(s);if(!s.ok)throw new Error(a?.message||"Failed to delete user");x()}).catch(s=>i(s?.message||"Failed to delete user")).finally(()=>l(!1)))},U=()=>{try{const e=o=>String(o??"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;"),s=(m||[]).map(o=>{const M=o?.banned_at?"Banned":o?.active?"Active":"Inactive",X=o?.last_activity?new Date(o.last_activity).toLocaleString():"-",_=o?.sessions_count??0;return`
                    <tr>
                        <td>${e(o?.name)}</td>
                        <td>${e(o?.email)}</td>
                        <td class="num">${e(_)}</td>
                        <td>${e(X)}</td>
                        <td>${e(M)}</td>
                    </tr>
                `}),a=new Date().toLocaleString(),r="USER ACCOUNTS REPORT",b="FORTCO ERP",D="ADMINISTRATION OFFICE",O="Tel: +255 000 000 000, Email: info@fortco.local",P="This document provides an official summary of user accounts in the system, including identity details, recent session activity and account status.",j=(m||[]).length,q=c.trim()?`Filter: "${e(c.trim())}"`:"Filter: None",z=`${window.location.origin}/favicon.svg`,I=`
            <!doctype html>
            <html>
            <head>
                <meta charset="utf-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <title>${r}</title>
                <style>
                    :root {
                        --ink: #0f172a;
                        --muted: #475569;
                        --line: #cbd5e1;
                        --paper: #ffffff;
                        --canvas: #e5e7eb;
                    }
                    body {
                        font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial;
                        background: var(--canvas);
                        color: var(--ink);
                        margin: 0;
                        padding: 24px;
                    }
                    .page {
                        max-width: 980px;
                        margin: 0 auto;
                        background: var(--paper);
                        border: 1px solid var(--line);
                    }
                    .top {
                        padding: 18px 20px 10px 20px;
                        text-align: center;
                    }
                    .crest {
                        width: 58px;
                        height: 58px;
                        margin: 0 auto 8px auto;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        overflow: hidden;
                    }
                    .crest img { width: 58px; height: 58px; object-fit: contain; }
                    .top .l1 { font-size: 12px; font-weight: 800; letter-spacing: 0.05em; }
                    .top .l2 { font-size: 11px; font-weight: 800; margin-top: 2px; }
                    .top .l3 { font-size: 11px; color: var(--muted); margin-top: 3px; }
                    .title {
                        margin-top: 10px;
                        font-size: 12px;
                        font-weight: 900;
                        letter-spacing: 0.08em;
                    }
                    .titleLine {
                        margin-top: 6px;
                        font-size: 12px;
                        font-weight: 900;
                        letter-spacing: 0.18em;
                    }
                    .subTitle {
                        margin-top: 6px;
                        font-size: 11px;
                        color: var(--muted);
                    }
                    .body {
                        padding: 0 20px 6px 20px;
                    }
                    .section {
                        padding: 14px 0;
                        border-top: 1px dashed #cbd5e1;
                    }
                    .section:first-child { border-top: 1px solid #cbd5e1; }
                    .section h2 {
                        margin: 0 0 6px 0;
                        font-size: 12px;
                        font-weight: 900;
                        letter-spacing: 0.02em;
                    }
                    .section p {
                        margin: 0;
                        font-size: 11px;
                        color: var(--muted);
                        line-height: 1.55;
                    }
                    .metaRow {
                        margin-top: 10px;
                        display: flex;
                        flex-wrap: wrap;
                        gap: 14px;
                        font-size: 11px;
                        color: var(--muted);
                    }
                    .metaRow strong { color: var(--ink); }
                    table { width: 100%; border-collapse: collapse; font-size: 11px; margin-top: 10px; }
                    th, td { border: 1px solid var(--line); padding: 8px 9px; vertical-align: top; }
                    th { background: #f8fafc; text-align: left; font-weight: 900; }
                    td.num, th.num { text-align: right; }
                    .footer {
                        border-top: 1px solid var(--line);
                        padding: 10px 20px;
                        display: flex;
                        justify-content: space-between;
                        gap: 12px;
                        font-size: 11px;
                        color: var(--muted);
                    }
                    @media print {
                        body { background: #fff; padding: 0; }
                        .page { border: none; max-width: none; }
                    }
                </style>
            </head>
            <body>
                <div class="page">
                    <div class="top">
                        <div class="crest"><img src="${z}" alt="Logo" /></div>
                        <div class="l1">${e(b)}</div>
                        <div class="l2">${e(D)}</div>
                        <div class="l3">${e(O)}</div>

                        <div class="title">${e(r)}</div>
                        <div class="titleLine">===== ===== =====</div>
                        <div class="subTitle">Generated: ${e(a)}</div>
                    </div>

                    <div class="body">
                        <div class="section">
                            <h2>1. REPORT SUMMARY</h2>
                            <p>${e(P)}</p>
                            <div class="metaRow">
                                <div><strong>Total users:</strong> ${e(j)}</div>
                                <div><strong>${q}</strong></div>
                            </div>
                        </div>

                        <div class="section">
                            <h2>2. USER ACCOUNTS LIST</h2>
                            <p>This table lists all user accounts included in the current selection.</p>
                            <table>
                                <thead>
                                    <tr>
                                        <th>Name</th>
                                        <th>Email</th>
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
                        <div>Users: <strong>${e(j)}</strong></div>
                    </div>
                </div>
            </body>
            </html>
        `;L(I),y(!0)}catch(e){i(e?.message||"Failed to generate PDF preview.")}},F=()=>{const e=w.current?.contentWindow;e&&(e.focus(),e.print())},m=n.useMemo(()=>{const e=c.trim().toLowerCase();return e?h.filter(s=>{const a=String(s?.name||"").toLowerCase(),r=String(s?.email||"").toLowerCase();return a.includes(e)||r.includes(e)}):h},[h,c]);return t.jsxs(B,{title:"User Management",breadcrumbs:["Admin","User Management","Users"],children:[t.jsx(H,{title:"Users"}),t.jsx(W,{open:k,title:"PDF Preview",onBack:()=>y(!1),onPrint:F,kind:"html",srcDoc:E,iframeRef:w}),t.jsxs("div",{className:"rounded-2xl border border-slate-200 bg-white",children:[t.jsxs("div",{className:"border-b border-slate-200 px-6 py-4",children:[t.jsxs("div",{className:"flex flex-wrap items-center justify-between gap-3",children:[t.jsxs("div",{children:[t.jsx("div",{className:"text-sm font-semibold text-slate-900",children:"Users"}),t.jsx("div",{className:"mt-1 text-[12px] text-slate-500",children:"Search users and see sessions activity summary."})]}),t.jsx("div",{className:"text-[12px] text-slate-500",children:N?"Loading…":""})]}),t.jsxs("div",{className:"mt-4 flex flex-wrap items-center gap-2",children:[t.jsx("input",{value:c,onChange:e=>R(e.target.value),placeholder:"Search by name or email",className:"w-full max-w-md rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-[12px] text-slate-900 placeholder:text-slate-400 focus:border-primary-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary-500/20"}),t.jsx("button",{type:"button",onClick:U,className:"rounded-xl border border-slate-200 bg-white px-4 py-2 text-[12px] font-semibold text-slate-700 hover:bg-slate-50",children:"Export to PDF"}),t.jsx("button",{type:"button",onClick:x,className:"rounded-xl border border-slate-200 bg-white px-4 py-2 text-[12px] font-semibold text-slate-700 hover:bg-slate-50",children:"Refresh"})]})]}),t.jsxs("div",{className:"p-6",children:[v?t.jsx("div",{className:"mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-[12px] text-red-700",children:v}):null,t.jsxs("table",{className:"w-full border border-slate-200 text-left text-[12px]",children:[t.jsx("thead",{className:"bg-slate-50 text-slate-600",children:t.jsxs("tr",{children:[t.jsx("th",{className:"px-4 py-3 font-semibold",children:"Name"}),t.jsx("th",{className:"px-4 py-3 font-semibold",children:"Email"}),t.jsx("th",{className:"px-4 py-3 font-semibold",children:"Sessions"}),t.jsx("th",{className:"px-4 py-3 font-semibold",children:"Last Activity"}),t.jsx("th",{className:"px-4 py-3 font-semibold",children:"Status"}),t.jsx("th",{className:"px-4 py-3 font-semibold text-right",children:"Action"})]})}),t.jsx("tbody",{className:"divide-y divide-slate-200",children:m.length?m.map(e=>t.jsxs("tr",{className:"bg-white hover:bg-slate-50",children:[t.jsx("td",{className:"px-4 py-3 font-semibold text-slate-900",children:e.name}),t.jsx("td",{className:"px-4 py-3 text-slate-700",children:e.email}),t.jsx("td",{className:"px-4 py-3 text-slate-700",children:e.sessions_count??0}),t.jsx("td",{className:"px-4 py-3 text-slate-700",children:e.last_activity?new Date(e.last_activity).toLocaleString():"-"}),t.jsx("td",{className:"px-4 py-3",children:t.jsx("span",{className:"text-slate-700",children:e.banned_at?"Banned":e.active?"Active":"Inactive"})}),t.jsx("td",{className:"relative px-4 py-3 text-right",children:t.jsxs("div",{className:"inline-block",ref:p&&String(p)===String(e.id)?u:null,children:[t.jsx("button",{type:"button",onClick:()=>d(s=>String(s)===String(e.id)?"":String(e.id)),className:"inline-flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-50","aria-label":"Actions",children:t.jsx("span",{className:"text-lg leading-none",children:"⋯"})}),String(p)===String(e.id)?t.jsxs("div",{className:"absolute right-0 z-20 mt-2 w-44 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-lg",children:[t.jsx("button",{type:"button",onClick:()=>{d(""),$(e)},className:"block w-full px-4 py-2 text-left text-[12px] text-slate-700 hover:bg-slate-50",children:"View profile"}),t.jsx("button",{type:"button",onClick:()=>{d(""),T(e)},className:"block w-full px-4 py-2 text-left text-[12px] text-slate-700 hover:bg-slate-50",children:e.banned_at?"Unban":"Ban"}),t.jsx("button",{type:"button",onClick:()=>{d(""),A(e)},className:"block w-full px-4 py-2 text-left text-[12px] text-slate-700 hover:bg-slate-50",children:"Reset password"}),t.jsx("button",{type:"button",onClick:()=>{d(""),C(e)},className:"block w-full px-4 py-2 text-left text-[12px] text-red-700 hover:bg-red-50",children:"Delete"})]}):null]})})]},e.id)):t.jsx("tr",{children:t.jsx("td",{className:"px-4 py-6 text-slate-500",colSpan:6,children:"No users found."})})})]}),t.jsxs("div",{className:"mt-4 rounded-xl border border-slate-200 bg-slate-50 p-4 text-[12px] text-slate-600",children:["Open ",t.jsx("span",{className:"font-semibold text-slate-900",children:"Sessions & Logs"})," to view per-user sessions and request logs."]})]})]})]})}export{G as default};
