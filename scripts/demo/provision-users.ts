// Run with bun: credentials come only from the sandbox environment.
// Random passwords are never logged or committed. Optional QA output belongs in /tmp.
import { createClient } from '@supabase/supabase-js';
const url=process.env['SUPABASE_URL']; const key=process.env['SUPABASE_SERVICE_ROLE_KEY'];
if(!url||!key)throw new Error('Cloud administrative connection required');
const client=createClient(url,key,{auth:{persistSession:false}});
const {data,error}=await client.auth.admin.listUsers({perPage:1000});if(error)throw error;
const users=[];
for(let i=0;i<12;i++){
 const email=`makezi-demo-${i}@example.invalid`;
 const existing=data.users.find(u=>u.email===email);
 const password=crypto.randomUUID()+crypto.randomUUID();
 let id=existing?.id;
 if(!id){const result=await client.auth.admin.createUser({email,password,email_confirm:true,user_metadata:{demo:true,display_name:i===0?'مدیر نمونه':`کاربر نمونه ${i}`}});if(result.error)throw result.error;id=result.data.user.id;}
 if(!id)throw new Error('Missing demo identity');
 users.push({id,email,index:i});
 if(i<2&&!existing&&process.env['DEMO_QA_PATH']) await Bun.write(`${process.env['DEMO_QA_PATH']}/${i===0?'admin':'user'}.json`,JSON.stringify({email,password,id}));
}
await Bun.write('scripts/demo/users.json',JSON.stringify(users,null,2));
console.log(`Provisioned ${users.length} clearly fictional demo accounts; no credentials logged.`);
