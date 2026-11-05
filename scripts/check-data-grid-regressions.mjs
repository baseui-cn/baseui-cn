import assert from "node:assert/strict"
import fs from "node:fs/promises"
import os from "node:os"
import path from "node:path"
import { createRequire } from "node:module"
import { fileURLToPath, pathToFileURL } from "node:url"
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..")
const require = createRequire(await fs.realpath(path.join(root, "packages/cli/node_modules/tsup/package.json")))
const { build } = require("esbuild")
const tableRequire = createRequire(await fs.realpath(path.join(root, "apps/www/node_modules/@tanstack/react-table/package.json")))
const bindings = tableRequire.resolve("@tanstack/table-core/store-reactivity-bindings")
const temp = await fs.mkdtemp(path.join(os.tmpdir(), "grid-fixed-models-"))
const outfile = path.join(temp, "models.mjs")
await build({ stdin: { contents: `
export * from './components/data-grid/data-grid-utils';
export * from './components/data-grid/data-grid-mutations';
export * from './components/data-grid/data-grid-filter-client';
export * from './components/data-grid/data-grid-filter-server';
export * from './components/data-grid/table-features';
export {constructTable} from '@tanstack/react-table';
export {storeReactivityBindings} from ${JSON.stringify(bindings)};
`, resolveDir: path.join(root, "apps/www"), loader: "ts" }, tsconfig: path.join(root, "apps/www/tsconfig.json"), bundle: true, platform: "node", format: "esm", outfile })
const m = await import(pathToFileURL(outfile))
const results = []
const run = async (finding, label, fn) => { const result = await fn(); results.push({ finding, label, pass: true, ...result }); console.log(`PASS ${finding}: ${label}`) }
const table = (rows, columns) => m.constructTable({ features: { coreReactivityFeature: m.storeReactivityBindings(), ...m.dataGridFeatures }, data: rows, columns, getRowId: (r) => r.id, initialState: { pagination: { pageIndex: 0, pageSize: rows.length } } })
await run("F02", "logical colgroup order equals actual visible cells through pin/hide/reorder", () => {
 const t = table([{id:'r',a:1,b:2,c:3}], ['a','b','c'].map((id,i)=>({accessorKey:id,size:(i+1)*100})))
 t.getColumn('c').pin('start'); t.getColumn('a').pin('end')
 assert.deepEqual(m.getDataGridVisibleColumns(t).map(c=>c.id), ['c','b','a'])
 assert.deepEqual(m.getDataGridVisibleColumns(t).map(c=>c.id),t.getRowModel().rows[0].getVisibleCells().map(c=>c.column.id))
 t.getColumn('b').toggleVisibility(false); t.setColumnOrder(['b','a','c'])
 assert.deepEqual(m.getDataGridVisibleColumns(t).map(c=>c.id),['c','a'])
})
await run("F04", "composition and legacy 229 guard; ordinary keys remain available", () => {
 for(const e of [{isComposing:true},{nativeEvent:{isComposing:true}},{keyCode:229},{nativeEvent:{keyCode:229}}]) assert.ok(m.isDataGridComposing(e))
 assert.ok(!m.isDataGridComposing({nativeEvent:{isComposing:false,keyCode:13}}))
})
await run("F07", "100k-row navigation creates no cells, including pinned/disabled/boundary cases", () => {
 const count=100000, t=table(Array.from({length:count},(_,i)=>({id:'r'+i})),Array.from({length:10},(_,i)=>({id:'c'+i,accessorFn:()=>0,meta:{editor:{kind:'text',dialogOnly:i===1}}})))
 const rows=t.getRowModel().rows
 for(const row of rows) row.getVisibleCells=()=>{throw Error('Navigation materialized a cell')}
 const heap=process.memoryUsage().heapUsed,start=performance.now()
 const next=m.findAdjacentDataGridEditor({table:t,rowId:'r0',columnId:'c0',direction:'next',isPending:(_r,c)=>c==='c2'})
 const time=performance.now()-start
 const heapAfterNavigation=process.memoryUsage().heapUsed
 assert.equal(next.row.id,'r0');assert.equal(next.column.id,'c3')
 assert.equal(m.findAdjacentDataGridEditor({table:t,rowId:'r0',columnId:'c0',direction:'previous',isPending:()=>false}),null)
 t.getColumn('c9').pin('start');t.getRow('r99999').pin('top')
 const pinned=m.findAdjacentDataGridEditor({table:t,rowId:'r99999',columnId:'c9',direction:'next',rowsPinnable:true,isPending:()=>false})
 assert.equal(pinned.row.id,'r99999');assert.equal(pinned.column.id,'c0')
 return {rows:count,columns:10,cellObjectsCreated:0,firstNavigationMs:Math.round(time*100)/100,heapDeltaMiB:Math.round((heapAfterNavigation-heap)/1024/1024*100)/100}
})
await run("F12", "preference hydration, Strict Mode replay, refresh, serial writes and failure retry", async () => {
 const calls=[],pending=[]
 const write=m.createDataGridPreferenceWriter(value=>{calls.push(value);return new Promise((resolve,reject)=>pending.push({resolve,reject}))})
 assert.equal(write(0,false),null);assert.equal(write(0,true),null);assert.equal(write(0,true),null)
 const first=write(1,true),second=write(2,true);await Promise.resolve();assert.deepEqual(calls,[1])
 pending[0].resolve();await first;await Promise.resolve();assert.deepEqual(calls,[1,2])
 pending[1].reject(Error('save failed'));await assert.rejects(second,/save failed/)
 const retry=write(2,true);await Promise.resolve();assert.deepEqual(calls,[1,2,2]);pending[2].resolve();await retry
 assert.equal(write(2,false),null);assert.equal(write(3,true),null);assert.equal(write(3,true),null)
})
await run("F12", "rollback retains newer fields/additions/deletions and skips a newer ordering", () => {
 const current=[{id:'b',name:'B edited'},{id:'new',name:'New'},{id:'a',name:'A refreshed'}]
 const restored=m.rollbackDataGridRowOrder(current,['a','b','deleted'],['b','a','deleted'])
 assert.deepEqual(restored.map(r=>r.id),['a','new','b']);assert.equal(restored[0],current[2]);assert.equal(restored[2],current[0])
 const newer=[current[2],current[0],current[1]]
 assert.equal(m.rollbackDataGridRowOrder(newer,['a','b'],['b','a']),newer)
})
await run("F13", "client/transport whitespace equivalence and full timestamp rejection", () => {
 assert.equal(m.matchesDateFilter('2024-02-29','on',' 2024-02-29 '),true)
 assert.equal(m.matchesDateFilter('2024-02-29','between',' 2024-02-28 ',' 2024-03-01 '),true)
 for(const v of ['2024-02-29T99:99garbage','2024-02-29T24:00:00Z','2024-02-29T12:60Z','2024-02-29T12:00:60Z','2024-02-29T12:00+24:00','2024-02-29T12:00Zjunk']) assert.equal(m.matchesDateFilter(v,'on','2024-02-29'),false,v)
 for(const v of ['2024-02-29T23:59:59.123456789Z','2024-02-29T01:02+05:30','2024-02-29T01:02']) assert.equal(m.matchesDateFilter(v,'on','2024-02-29'),true,v)
 const early=m.parseDataGridDate('0001-01-01');assert.equal(m.matchesDateFilter(early,'on','0001-01-01'),true)
 assert.equal(m.formatDataGridDate(early),'0001-01-01');assert.equal(m.formatDataGridDate(undefined),'')
 const q={pagination:{pageIndex:0,pageSize:10},sorting:[],columnFilters:[{id:'date',value:{type:'date',operator:'on',value:' 2024-02-29 '}}]}
 const value=JSON.parse(m.serializeDataGridQuery(q)).columnFilters[0].value
 assert.equal(m.matchesDateFilter('2024-02-29',value.operator,value.value),true)
})
await run("F15", "migration guide covers API/state/persistence/server/CSS and bounded manual install", async () => {
 const guide=await fs.readFile(path.join(root,'docs/data-grid-v9-migration.md'),'utf8')
 for(const expected of ['useReactTable','useTable','DataGridColumnDef','columnSizingInfo','columnResizing','start','end','manualPagination','draft','ES2022','Strict Mode','CSS']) assert.ok(guide.includes(expected),expected)
 const mdx=await fs.readFile(path.join(root,'apps/www/content/docs/components/data-grid.mdx'),'utf8')
 assert.ok(mdx.includes('manualDeps="npm install @tanstack/react-table@^9.2.8 '))
})
const destination=process.env.EVIDENCE_DIR??temp
await fs.mkdir(destination,{recursive:true});await fs.writeFile(path.join(destination,'model-regressions.json'),JSON.stringify({results},null,2))
console.log(`${results.length} regression groups passed; ${destination}`)
