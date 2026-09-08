import 'dotenv/config';
import cors from 'cors';
import express from 'express';
import path from 'node:path';
import { analyzeInput, analyzeWithAI } from './analyzer.ts';
import { listApplications, saveApplication } from './store.ts';

const app=express(); app.use(cors()); app.use(express.json({limit:'1mb'}));
app.get('/api/health',(_req,res)=>res.json({ok:true,aiConfigured:Boolean(process.env.OPENAI_API_KEY)}));
app.get('/api/applications',async(_req,res)=>res.json(await listApplications()));
app.post('/api/applications',async(req,res)=>{ try { res.status(201).json(await saveApplication(req.body)); } catch { res.status(400).json({error:'Invalid application'}); } });
app.post('/api/analyze',async(req,res)=>{ const parsed=analyzeInput.safeParse(req.body); if(!parsed.success) return res.status(400).json({error:'Resume and job description must each contain at least 80 characters.'}); try { res.json(await analyzeWithAI(parsed.data)); } catch(e) { console.error(e); res.status(502).json({error:'Analysis failed. Check the server configuration and try again.'}); } });
const client=path.resolve('dist/client'); app.use(express.static(client)); app.use((req,res,next)=>req.method==='GET'?res.sendFile(path.join(client,'index.html')):next());
const port=Number(process.env.PORT??8787); app.listen(port,()=>console.log(`CareerForge running at http://localhost:${port}`));
