import { mkdtemp, rm } from 'node:fs/promises';
import type { Server } from 'node:http';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { createApp } from '../server/app.ts';
import { createApplicationRepository } from '../server/store.ts';

let server:Server,directory:string,base:string;
beforeAll(async()=>{directory=await mkdtemp(path.join(tmpdir(),'careerforge-api-'));const app=createApp(createApplicationRepository(path.join(directory,'applications.json')));await new Promise<void>(resolve=>{server=app.listen(0,'127.0.0.1',()=>resolve());});const address=server.address();if(!address||typeof address==='string')throw new Error('Test server did not bind');base=`http://127.0.0.1:${address.port}`;});
afterAll(async()=>{await new Promise<void>((resolve,reject)=>server.close(error=>error?reject(error):resolve()));await rm(directory,{recursive:true,force:true});});

describe('application API',()=>{
  it('correlates health responses and applies security headers',async()=>{const response=await fetch(`${base}/api/health`,{headers:{'x-request-id':'integration-test'}});expect(response.status).toBe(200);expect(response.headers.get('x-request-id')).toBe('integration-test');expect(response.headers.get('x-content-type-options')).toBe('nosniff');expect((await response.json()).version).toBe('1.2.0');});
  it('returns a structured validation error',async()=>{const response=await fetch(`${base}/api/applications`,{method:'POST',headers:{'content-type':'application/json'},body:'{}'});const body=await response.json();expect(response.status).toBe(400);expect(body.error.code).toBe('VALIDATION_ERROR');expect(body.error.requestId).toBeTruthy();});
  it('supports the create, transition, and delete lifecycle',async()=>{const payload={company:'Acme',role:'SDE',status:'Saved',fitScore:84,date:'2026-09-12',location:'Remote'};const createdResponse=await fetch(`${base}/api/applications`,{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify(payload)});const created=await createdResponse.json();expect(createdResponse.status).toBe(201);const updated=await fetch(`${base}/api/applications/${created.id}`,{method:'PATCH',headers:{'content-type':'application/json'},body:JSON.stringify({status:'Interview'})});expect((await updated.json()).status).toBe('Interview');expect((await fetch(`${base}/api/applications/${created.id}`,{method:'DELETE'})).status).toBe(204);});
});
