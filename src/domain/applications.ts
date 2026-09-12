import type { Application, Status } from '../types';

export type StatusFilter = Status | 'All';

export function filterApplications(applications: Application[], query: string, status: StatusFilter) {
  const needle=query.trim().toLocaleLowerCase();
  return applications.filter(application=>{
    const matchesStatus=status==='All'||application.status===status;
    const haystack=`${application.company} ${application.role} ${application.location}`.toLocaleLowerCase();
    return matchesStatus&&(!needle||haystack.includes(needle));
  });
}

export function isStale(application: Application, now = new Date(), staleAfterDays = 7) {
  if(application.status==='Offer'||application.status==='Rejected')return false;
  const activity=new Date(`${application.date}T00:00:00Z`).getTime();
  const today=Date.UTC(now.getUTCFullYear(),now.getUTCMonth(),now.getUTCDate());
  return Number.isFinite(activity)&&today-activity>=staleAfterDays*86_400_000;
}

export function summarizeFunnel(applications: Application[]) {
  const count=(status:Status)=>applications.filter(application=>application.status===status).length;
  const saved=count('Saved'),applied=count('Applied'),interview=count('Interview'),offer=count('Offer'),rejected=count('Rejected');
  const reachedApplied=applied+interview+offer+rejected;
  const reachedInterview=interview+offer;
  return {saved,applied,interview,offer,rejected,reachedApplied,reachedInterview,interviewConversion:reachedApplied===0?null:Math.round(reachedInterview/reachedApplied*100)};
}
