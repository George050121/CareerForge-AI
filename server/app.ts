import cors from 'cors';
import express, { type NextFunction, type Request, type Response } from 'express';
import { ZodError } from 'zod';
import { analyzeInput, analyzeWithAI } from './analyzer.ts';
import { applicationIdSchema, createApplicationSchema, updateApplicationSchema } from './contracts.ts';
import { applications, type ApplicationRepository } from './store.ts';

type RequestWithId = Request & { requestId?: string };
class ApiError extends Error { constructor(public status: number, public code: string, message: string) { super(message); } }
const asyncRoute = (handler: (req: RequestWithId, res: Response) => Promise<unknown>) => (req: RequestWithId,res:Response,next:NextFunction) => { Promise.resolve(handler(req,res)).catch(next); };

export function createApp(repository: ApplicationRepository = applications) {
  const app=express();
  const rate=new Map<string,{count:number;reset:number}>();
  app.disable('x-powered-by');
  app.use((req:RequestWithId,res,next)=>{ req.requestId=(req.header('x-request-id')??crypto.randomUUID()).slice(0,128); res.setHeader('X-Request-Id',req.requestId); res.setHeader('X-Content-Type-Options','nosniff'); res.setHeader('Referrer-Policy','no-referrer'); res.setHeader('Permissions-Policy','camera=(), microphone=(), geolocation=()'); res.setHeader('Content-Security-Policy',"default-src 'self'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src https://fonts.gstatic.com; connect-src 'self'; img-src 'self' data:"); const start=performance.now(); res.on('finish',()=>console.log(JSON.stringify({level:'info',event:'http_request',requestId:req.requestId,method:req.method,path:req.path,status:res.statusCode,durationMs:Math.round(performance.now()-start)}))); next(); });
  app.use('/api',(req:RequestWithId,res,next)=>{const key=req.ip??'unknown',now=Date.now(),current=rate.get(key); const entry=!current||current.reset<now?{count:1,reset:now+60_000}:{...current,count:current.count+1}; rate.set(key,entry); res.setHeader('RateLimit-Limit','120');res.setHeader('RateLimit-Remaining',String(Math.max(0,120-entry.count)));if(entry.count>120)return next(new ApiError(429,'RATE_LIMITED','Too many requests. Try again shortly.'));next();});
  app.use(cors({origin:true,methods:['GET','POST','PATCH','DELETE']})); app.use(express.json({limit:'1mb'}));
  app.get('/api/health',(_req,res)=>res.json({ok:true,service:'careerforge-api',version:'1.2.0',aiConfigured:Boolean(process.env.OPENAI_API_KEY),timestamp:new Date().toISOString()}));
  app.get('/api/applications',asyncRoute(async(_req,res)=>res.json(await repository.list())));
  app.post('/api/applications',asyncRoute(async(req,res)=>res.status(201).json(await repository.create(createApplicationSchema.parse(req.body)))));
  app.patch('/api/applications/:id',asyncRoute(async(req,res)=>{const id=applicationIdSchema.parse(req.params.id);const {status}=updateApplicationSchema.parse(req.body);const updated=await repository.updateStatus(id,status);if(!updated)throw new ApiError(404,'APPLICATION_NOT_FOUND','Application not found.');return res.json(updated);}));
  app.delete('/api/applications/:id',asyncRoute(async(req,res)=>{const id=applicationIdSchema.parse(req.params.id);if(!await repository.remove(id))throw new ApiError(404,'APPLICATION_NOT_FOUND','Application not found.');return res.status(204).send();}));
  app.post('/api/analyze',asyncRoute(async(req,res)=>res.json(await analyzeWithAI(analyzeInput.parse(req.body)))));
  app.use('/api',(_req,_res,next)=>next(new ApiError(404,'ROUTE_NOT_FOUND','API route not found.')));
  app.use((error:unknown,req:RequestWithId,res:Response,_next:NextFunction)=>{void _next;const validation=error instanceof ZodError;const status=validation?400:error instanceof ApiError?error.status:502;const code=validation?'VALIDATION_ERROR':error instanceof ApiError?error.code:'INTERNAL_ERROR';const message=validation?'Request validation failed.':error instanceof ApiError?error.message:'The service could not complete the request.';console.error(JSON.stringify({level:'error',event:'request_failed',requestId:req.requestId,code,message:error instanceof Error?error.message:'unknown'}));res.status(status).json({error:{code,message,requestId:req.requestId,details:validation?error.issues.map(issue=>({path:issue.path.join('.'),message:issue.message})):undefined}});});
  return app;
}
