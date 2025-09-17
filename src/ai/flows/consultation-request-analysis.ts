// src/ai/flows/consultation-request-analysis.ts
'use server';

/**
 * @fileOverview Analyzes the initial consultation request message to suggest appropriate support staff.
 *
 * - analyzeConsultationRequest - A function that handles the analysis of the consultation request.
 * - AnalyzeConsultationRequestInput - The input type for the analyzeConsultationRequest function.
 * - AnalyzeConsultationRequestOutput - The return type for the analyzeConsultationRequest function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnalyzeConsultationRequestInputSchema = z.object({
  initialMessage: z
    .string()
    .describe('The initial message from the client starting the consultation.'),
});
export type AnalyzeConsultationRequestInput = z.infer<
  typeof AnalyzeConsultationRequestInputSchema
>;

const AnalyzeConsultationRequestOutputSchema = z.object({
  suggestedSupportStaff: z
    .string()
    .describe(
      'The suggested support staff or team based on the content of the initial message.'
    ),
  keywords: z
    .string()
    .describe('Keywords extracted from the initial message.'),
});
export type AnalyzeConsultationRequestOutput = z.infer<
  typeof AnalyzeConsultationRequestOutputSchema
>;

export async function analyzeConsultationRequest(
  input: AnalyzeConsultationRequestInput
): Promise<AnalyzeConsultationRequestOutput> {
  return analyzeConsultationRequestFlow(input);
}

const prompt = ai.definePrompt({
  name: 'analyzeConsultationRequestPrompt',
  input: {schema: AnalyzeConsultationRequestInputSchema},
  output: {schema: AnalyzeConsultationRequestOutputSchema},
  prompt: `You are an expert support staff assignment system.

You will analyze the initial message from the client and suggest the most appropriate support staff or team to handle the request.

You will also extract keywords from the message that can be used to further refine the support staff assignment.

Initial Message: {{{initialMessage}}}

Respond with a JSON object:
1. suggestedSupportStaff: String
2. keywords: String

Ensure that suggestedSupportStaff and keywords are not empty.
`,
});

const analyzeConsultationRequestFlow = ai.defineFlow(
  {
    name: 'analyzeConsultationRequestFlow',
    inputSchema: AnalyzeConsultationRequestInputSchema,
    outputSchema: AnalyzeConsultationRequestOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
