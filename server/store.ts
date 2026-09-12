import { mkdir, readFile, rename, writeFile } from 'node:fs/promises';
import path from 'node:path';
import type { Application } from '../src/types.ts';
import { applicationSchema, createApplicationSchema } from './contracts.ts';

const seed: Application[] = [
  { id:'seed-1', company:'Linear', role:'Software Engineer, Product', status:'Interview', fitScore:88, date:'2026-09-05', location:'Remote' },
  { id:'seed-2', company:'Vercel', role:'Frontend Engineer', status:'Applied', fitScore:82, date:'2026-09-02', location:'Remote' },
  { id:'seed-3', company:'Anthropic', role:'Software Engineer', status:'Saved', fitScore:74, date:'2026-08-29', location:'San Francisco' }
];

export function createApplicationRepository(file = path.resolve(process.env.APPLICATION_DATA_FILE ?? 'data/applications.json')) {
  let writeQueue = Promise.resolve();
  async function list(): Promise<Application[]> {
    try { return applicationSchema.array().parse(JSON.parse(await readFile(file, 'utf8'))); }
    catch (error) { if ((error as NodeJS.ErrnoException).code === 'ENOENT') return structuredClone(seed); throw error; }
  }
  async function persist(applications: Application[]) {
    await mkdir(path.dirname(file), { recursive: true });
    const temporary = `${file}.${crypto.randomUUID()}.tmp`;
    await writeFile(temporary, JSON.stringify(applications, null, 2), { encoding: 'utf8', mode: 0o600 });
    await rename(temporary, file);
  }
  function serialize<T>(operation: () => Promise<T>) {
    const result = writeQueue.then(operation, operation);
    writeQueue = result.then(() => undefined, () => undefined);
    return result;
  }
  return {
    list,
    create(input: Omit<Application, 'id'>) { return serialize(async () => { const clean=createApplicationSchema.parse(input); const saved={...clean,id:crypto.randomUUID()}; await persist([saved,...await list()]); return saved; }); },
    updateStatus(id: string, status: Application['status']) { return serialize(async () => { const all=await list(); const index=all.findIndex(item=>item.id===id); if(index<0) return null; all[index]={...all[index],status}; await persist(all); return all[index]; }); },
    remove(id: string) { return serialize(async () => { const all=await list(); const next=all.filter(item=>item.id!==id); if(next.length===all.length) return false; await persist(next); return true; }); }
  };
}

export type ApplicationRepository = ReturnType<typeof createApplicationRepository>;
export const applications = createApplicationRepository();
