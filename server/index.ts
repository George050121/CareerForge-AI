import 'dotenv/config';
import express from 'express';
import path from 'node:path';
import { createApp } from './app.ts';

const app=createApp();
const client=path.resolve('dist/client'); app.use(express.static(client)); app.use((req,res,next)=>req.method==='GET'?res.sendFile(path.join(client,'index.html')):next());
const port=Number(process.env.PORT??8787); app.listen(port,()=>console.log(`CareerForge running at http://localhost:${port}`));
