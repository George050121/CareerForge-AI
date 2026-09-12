import { describe, expect, it } from 'vitest';
import { filterApplications, isStale, summarizeFunnel } from '../src/domain/applications.ts';
import type { Application } from '../src/types.ts';

const applications:Application[]=[
  {id:'1',company:'Linear',role:'Product Engineer',status:'Interview',fitScore:88,date:'2026-09-01',location:'Remote'},
  {id:'2',company:'Vercel',role:'Frontend Engineer',status:'Applied',fitScore:82,date:'2026-09-10',location:'New York'},
  {id:'3',company:'Acme',role:'Platform Engineer',status:'Rejected',fitScore:70,date:'2026-08-01',location:'Chicago'},
  {id:'4',company:'Orbit',role:'Backend Engineer',status:'Offer',fitScore:91,date:'2026-09-11',location:'Remote'}
];

describe('application insights',()=>{
  it('filters across company, role, and location without case sensitivity',()=>{expect(filterApplications(applications,'PRODUCT','All').map(x=>x.id)).toEqual(['1']);expect(filterApplications(applications,'remote','All')).toHaveLength(2);expect(filterApplications(applications,'','Applied').map(x=>x.id)).toEqual(['2']);});
  it('marks only active records stale at the inclusive threshold',()=>{const now=new Date('2026-09-12T18:00:00Z');expect(isStale(applications[0],now)).toBe(true);expect(isStale({...applications[1],date:'2026-09-05'},now)).toBe(true);expect(isStale(applications[2],now)).toBe(false);});
  it('calculates an explainable funnel conversion',()=>expect(summarizeFunnel(applications)).toEqual({saved:0,applied:1,interview:1,offer:1,rejected:1,reachedApplied:4,reachedInterview:2,interviewConversion:50}));
  it('returns no conversion when the denominator is empty',()=>expect(summarizeFunnel([{...applications[0],status:'Saved'}]).interviewConversion).toBeNull());
});
