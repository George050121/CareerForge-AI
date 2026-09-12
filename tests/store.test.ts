import { mkdtemp, readFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';
import { createApplicationRepository } from '../server/store.ts';

const directories: string[]=[];
afterEach(async()=>Promise.all(directories.splice(0).map(directory=>rm(directory,{recursive:true,force:true}))));
async function repository(){const directory=await mkdtemp(path.join(tmpdir(),'careerforge-'));directories.push(directory);return {repo:createApplicationRepository(path.join(directory,'applications.json')),directory};}
const input={company:'Acme',role:'Senior Engineer',status:'Saved' as const,fitScore:81,date:'2026-09-11',location:'Remote'};

describe('application repository',()=>{
  it('creates validated applications and persists valid JSON',async()=>{const {repo,directory}=await repository();const created=await repo.create(input);expect(created.id).toBeTruthy();expect((await repo.list())[0]).toEqual(created);expect(JSON.parse(await readFile(path.join(directory,'applications.json'),'utf8'))).toHaveLength(4);});
  it('updates status and removes records',async()=>{const {repo}=await repository();const created=await repo.create(input);expect((await repo.updateStatus(created.id,'Interview'))?.status).toBe('Interview');expect(await repo.remove(created.id)).toBe(true);expect(await repo.remove('missing')).toBe(false);});
  it('rejects untrusted application data',async()=>{const {repo}=await repository();await expect(repo.create({...input,fitScore:1000})).rejects.toThrow();});
});
