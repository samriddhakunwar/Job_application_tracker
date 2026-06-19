import { createApplicationSchema } from '../src/validators/application.validator';

describe('createApplicationSchema', () => {
  const validInput = {
    companyName: 'Google',
    jobTitle: 'Frontend Intern',
    jobType: 'Internship',
    status: 'Applied',
    appliedDate: '2026-05-10',
  };

  it('accepts a valid application', () => {
    const result = createApplicationSchema.safeParse(validInput);
    expect(result.success).toBe(true);
  });

  it('rejects a company name shorter than 2 characters', () => {
    const result = createApplicationSchema.safeParse({ ...validInput, companyName: 'G' });
    expect(result.success).toBe(false);
  });

  it('rejects a missing job title', () => {
    const result = createApplicationSchema.safeParse({ ...validInput, jobTitle: '' });
    expect(result.success).toBe(false);
  });

  it('rejects an invalid job type', () => {
    const result = createApplicationSchema.safeParse({ ...validInput, jobType: 'Freelance' });
    expect(result.success).toBe(false);
  });

  it('defaults status to Applied when not provided', () => {
    const { status, ...withoutStatus } = validInput;
    const result = createApplicationSchema.parse(withoutStatus);
    expect(result.status).toBe('Applied');
  });
});
