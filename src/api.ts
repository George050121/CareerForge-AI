import type { Analysis, AnalyzeRequest, Application } from './types';
async function request<T>(url:string, options?:RequestInit):Promise<T>{ const res=await fetch(url,{...options,headers:{'Content-Type':'application/json',...options?.headers}}); if(!res.ok){const body=await res.json().catch(()=>({})); throw new Error(body.error??'Request failed');} return res.json(); }
export const api={
  applications:()=>request<Application[]>('/api/applications'),
  addApplication:(input:Omit<Application,'id'>)=>request<Application>('/api/applications',{method:'POST',body:JSON.stringify(input)}),
  analyze:(input:AnalyzeRequest)=>request<{data:Analysis;mode:'ai'|'demo'}>('/api/analyze',{method:'POST',body:JSON.stringify(input)})
};
