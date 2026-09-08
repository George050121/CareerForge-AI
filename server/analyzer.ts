import { z } from 'zod';

export const analyzeInput = z.object({
  resume: z.string().min(80).max(30000),
  jobDescription: z.string().min(80).max(30000),
  company: z.string().max(100).optional().default('the company'),
  role: z.string().max(120).optional().default('this role')
});

export const analysisSchema = z.object({
  fitScore: z.number().int().min(0).max(100), verdict: z.string(),
  strengths: z.array(z.string()).min(3).max(6), gaps: z.array(z.string()).min(2).max(5),
  missingKeywords: z.array(z.string()).max(12), resumeRewrite: z.array(z.string()).min(2).max(5),
  coverLetter: z.string(), interviewQuestions: z.array(z.object({ question: z.string(), strategy: z.string() })).min(3).max(6)
});

const STOP = new Set('the a an and or to of in for with on at by from is are be as that this will you your our we they it experience years role work team using have has required preferred strong skills'.split(' '));

function terms(text: string) { return [...new Set(text.toLowerCase().match(/[a-z][a-z+#.-]{2,}/g) ?? [])].filter(x => !STOP.has(x)); }

export function localAnalysis(resume: string, job: string, company = 'the company', role = 'this role') {
  const resumeTerms = new Set(terms(resume));
  const jobTerms = terms(job);
  const matched = jobTerms.filter(x => resumeTerms.has(x));
  const missing = jobTerms.filter(x => !resumeTerms.has(x)).slice(0, 10);
  const score = Math.max(35, Math.min(92, Math.round(45 + (matched.length / Math.max(jobTerms.length, 1)) * 70)));
  const highlights = matched.slice(0, 5).map(x => `Your background demonstrates relevant ${x} experience.`);
  while (highlights.length < 3) highlights.push('Your resume shows transferable delivery and collaboration experience.');
  return {
    fitScore: score,
    verdict: score >= 75 ? 'Strong match — tailor and apply' : score >= 55 ? 'Promising match — close the narrative gaps' : 'Stretch role — lead with transferable evidence',
    strengths: highlights,
    gaps: missing.slice(0, 3).map(x => `The posting emphasizes ${x}, but the resume does not state it explicitly.`),
    missingKeywords: missing,
    resumeRewrite: [
      `Add a quantified achievement that connects your work to ${matched[0] ?? 'business impact'}.`,
      `Move ${matched[1] ?? 'the most relevant project'} into the top third of the resume.`,
      `Use the job's language naturally, especially: ${missing.slice(0, 3).join(', ') || 'delivery, ownership, impact'}.`
    ],
    coverLetter: `Dear ${company} hiring team,\n\nI’m excited to apply for the ${role} position. My experience delivering software, collaborating across functions, and turning ambiguous requirements into measurable outcomes aligns well with this opportunity. I would bring a practical engineering mindset, strong ownership, and a record of learning quickly.\n\nWhat draws me to ${company} is the chance to contribute where product judgment and technical execution meet. I’d welcome the opportunity to discuss how my background can help your team.\n\nBest regards,`,
    interviewQuestions: [
      { question: 'Tell me about a technically difficult project you owned.', strategy: 'Use STAR; quantify the constraint, your decision, and the outcome.' },
      { question: `Why ${company} and why this role?`, strategy: 'Connect one company priority, one role requirement, and one career theme.' },
      { question: 'Describe a disagreement with a teammate.', strategy: 'Show curiosity, evidence-based tradeoffs, and a concrete resolution.' }
    ]
  };
}

export async function analyzeWithAI(input: z.infer<typeof analyzeInput>) {
  if (!process.env.OPENAI_API_KEY) return { data: localAnalysis(input.resume, input.jobDescription, input.company, input.role), mode: 'demo' as const };
  const schema = { type: 'object', additionalProperties: false, required: ['fitScore','verdict','strengths','gaps','missingKeywords','resumeRewrite','coverLetter','interviewQuestions'], properties: {
    fitScore: { type:'integer', minimum:0, maximum:100 }, verdict:{type:'string'}, strengths:{type:'array',items:{type:'string'}}, gaps:{type:'array',items:{type:'string'}}, missingKeywords:{type:'array',items:{type:'string'}}, resumeRewrite:{type:'array',items:{type:'string'}}, coverLetter:{type:'string'}, interviewQuestions:{type:'array',items:{type:'object',additionalProperties:false,required:['question','strategy'],properties:{question:{type:'string'},strategy:{type:'string'}}}}
  }};
  const response = await fetch('https://api.openai.com/v1/responses', { method:'POST', headers:{'Content-Type':'application/json',Authorization:`Bearer ${process.env.OPENAI_API_KEY}`}, body:JSON.stringify({
    model: process.env.OPENAI_MODEL ?? 'gpt-5.4-mini',
    instructions: 'You are an exacting career coach and senior technical recruiter. Compare evidence only; never invent candidate experience. Give specific, concise, actionable advice.',
    input: `COMPANY: ${input.company}\nROLE: ${input.role}\n\nRESUME:\n${input.resume}\n\nJOB DESCRIPTION:\n${input.jobDescription}`,
    text:{format:{type:'json_schema',name:'job_fit_analysis',strict:true,schema}}
  })});
  if (!response.ok) throw new Error(`AI provider returned ${response.status}`);
  const raw = await response.json() as { output_text?: string };
  return { data: analysisSchema.parse(JSON.parse(raw.output_text ?? '{}')), mode: 'ai' as const };
}
