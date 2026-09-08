import { describe, expect, it } from 'vitest';
import { analyzeInput, localAnalysis } from '../server/analyzer.ts';

const resume='Software engineer with five years of TypeScript React Node PostgreSQL AWS experience. Built scalable APIs, testing systems, and led cross-functional product delivery with measurable impact.';
const job='Seeking a software engineer with TypeScript React Node PostgreSQL AWS skills, API design, testing, product ownership, communication, Kubernetes, and distributed systems experience.';

describe('job analyzer',()=>{
  it('rejects insufficient evidence',()=>expect(analyzeInput.safeParse({resume:'short',jobDescription:'short'}).success).toBe(false));
  it('returns a bounded, deterministic analysis',()=>{const result=localAnalysis(resume,job,'Acme','Senior Engineer');expect(result.fitScore).toBeGreaterThanOrEqual(35);expect(result.fitScore).toBeLessThanOrEqual(92);expect(result.strengths.length).toBeGreaterThanOrEqual(3);expect(result.coverLetter).toContain('Acme');});
  it('identifies job terms absent from the resume',()=>{const result=localAnalysis(resume,job);expect(result.missingKeywords).toContain('kubernetes');expect(result.missingKeywords).toContain('distributed');});
});
