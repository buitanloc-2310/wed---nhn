export type ApiResult<T=any>={ok:boolean;data?:T;error?:string;code?:string;status?:number};
export async function api<T=any>(path:string, options:RequestInit={}):Promise<ApiResult<T>>{
  const headers = new Headers(options.headers||{});
  if(!(options.body instanceof FormData)) headers.set('content-type','application/json');
  try{
    const r=await fetch(`/api${path}`,{...options,headers,credentials:'include'});
    const data=await r.json().catch(()=>({ok:false,error:'Phản hồi máy chủ không hợp lệ'}));
    if(!r.ok) return {ok:false,error:data.error||`HTTP ${r.status}`,code:data.code||`HTTP_${r.status}`,status:r.status,data:data.data};
    return {...data,status:r.status};
  }catch(e:any){
    return {ok:false,error:'Không thể kết nối máy chủ. Một số phần công khai vẫn có thể hoạt động bằng dữ liệu dự phòng.',code:'NETWORK_UNAVAILABLE',status:0};
  }
}
export const wordCount=(s:string)=>s.trim().split(/\s+/).filter(Boolean).length;
