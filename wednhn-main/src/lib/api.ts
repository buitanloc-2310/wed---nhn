export type ApiResult<T=any>={ok:boolean;data?:T;error?:string};
export async function api<T=any>(path:string, options:RequestInit={}):Promise<ApiResult<T>>{
  const headers = new Headers(options.headers||{});
  if(!(options.body instanceof FormData)) headers.set('content-type','application/json');
  const r=await fetch(`/api${path}`,{...options,headers,credentials:'include'});
  const data=await r.json().catch(()=>({ok:false,error:'Phản hồi máy chủ không hợp lệ'}));
  if(!r.ok) return {ok:false,error:data.error||`HTTP ${r.status}`};
  return data;
}
export const wordCount=(s:string)=>s.trim().split(/\s+/).filter(Boolean).length;
