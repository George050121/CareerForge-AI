import type { Analysis, AnalyzeRequest, Application, Status } from './types';
async function request<T>(url:string, options?:RequestInit):Promise<T>{ const res=await fetch(url,{...options,headers:{'Content-Type':'application/json',...options?.headers}}); if(!res.ok){const body=await res.json().catch(()=>({})); throw new Error(body.error?.message??body.error??`Request failed (${res.status})`);} if(res.status===204)return undefined as T; return res.json(); }
export const api={
  applications:()=>request<Application[]>('/api/applications'),
  addApplication:(input:Omit<Application,'id'>)=>request<Application>('/api/applications',{method:'POST',body:JSON.stringify(input)}),
  updateApplication:(id:string,status:Status)=>request<Application>(`/api/applications/${encodeURIComponent(id)}`,{method:'PATCH',body:JSON.stringify({status})}),
  removeApplication:(id:string)=>request<void>(`/api/applications/${encodeURIComponent(id)}`,{method:'DELETE'}),
  analyze:(input:AnalyzeRequest)=>request<{data:Analysis;mode:'ai'|'demo'}>('/api/analyze',{method:'POST',body:JSON.stringify(input)})
};
