'use server';

import { analyzeConsultationRequest } from '@/ai/flows/consultation-request-analysis';
import type { AnalyzeConsultationRequestInput, AnalyzeConsultationRequestOutput } from '@/ai/flows/consultation-request-analysis';

export async function initiateConsultationAnalysis(
  input: AnalyzeConsultationRequestInput
): Promise<AnalyzeConsultationRequestOutput> {
  try {
    const result = await analyzeConsultationRequest(input);
    return result;
  } catch (error) {
    console.error('Error in consultation analysis:', error);
    throw new Error('Failed to analyze consultation request.');
  }
}
