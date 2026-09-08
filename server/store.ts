import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import type { Application } from '../src/types.ts';

const file = path.resolve('data/applications.json');
const seed: Application[] = [
  { id:'seed-1', company:'Linear', role:'Software Engineer, Product', status:'Interview', fitScore:88, date:'2026-09-05', location:'Remote' },
  { id:'seed-2', company:'Vercel', role:'Frontend Engineer', status:'Applied', fitScore:82, date:'2026-09-02', location:'Remote' },
  { id:'seed-3', company:'Anthropic', role:'Software Engineer', status:'Saved', fitScore:74, date:'2026-08-29', location:'San Francisco' }
];
export async function listApplications() { try { return JSON.parse(await readFile(file,'utf8')) as Application[]; } catch { return seed; } }
export async function saveApplication(app: Omit<Application,'id'>) { const all=await listApplications(); const saved={...app,id:crypto.randomUUID()}; await mkdir(path.dirname(file),{recursive:true}); await writeFile(file,JSON.stringify([saved,...all],null,2)); return saved; }
