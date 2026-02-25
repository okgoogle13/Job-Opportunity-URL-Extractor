import { GoogleGenAI, Type } from "@google/genai";
import type { JobDetails, GroundingSource } from '../types';

const jobDetailsSchema = {
    type: Type.OBJECT,
    properties: {
        dueDate: { type: Type.STRING, description: "Closing date for applications." },
        companyName: { type: Type.STRING, description: "Name of the hiring organization." },
        roleTitle: { type: Type.STRING, description: "Official position title." },
        hiringManager: { type: Type.STRING, description: "Name of the contact person." },
        managerContact: { type: Type.STRING, description: "Email or phone for the contact person." },
        essentialCriteria: {
            type: Type.ARRAY,
            description: "Mandatory requirements, including Australian compliance like WWCC, NDIS, or AASW membership.",
            items: { type: Type.STRING }
        },
        desirableCriteria: {
            type: Type.ARRAY,
            description: "Preferred skills or experience.",
            items: { type: Type.STRING }
        },
        sectorInsights: {
            type: Type.STRING,
            description: "A summary of how this role maps to the Australian Public Service (APS) or Community Services frameworks."
        }
    },
    required: ["dueDate", "companyName", "roleTitle", "hiringManager", "managerContact", "essentialCriteria", "desirableCriteria"]
};

const SYSTEM_INSTRUCTION = `
You are a senior recruitment specialist expert in the Australian workplace, specifically:
- Australian Public Service (APS) and State Government (VPS, NSWPS, etc.) Capability Frameworks.
- Community Services and Social Work (AASW standards, Trauma-Informed Care, NDIS Quality and Safeguards).
- Extract and categorize selection criteria with precision. 
- Look for compliance requirements like Working with Children Checks (WWCC), NDIS Worker Screening, and specific professional registrations.
`;

export const extractJobDetails = async (url: string, isDeep: boolean = false): Promise<JobDetails> => {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    const modelName = isDeep ? "gemini-3-pro-preview" : "gemini-3-flash-preview";
    const config: any = {
        responseMimeType: "application/json",
        responseSchema: jobDetailsSchema,
        tools: [{ googleSearch: {} }],
    };

    if (isDeep) {
        // Thinking budget is mandatory for Pro model in thinking mode
        config.thinkingConfig = { thinkingBudget: 32768 };
    }

    const prompt = `
    Analyze the job listing at ${url}. 
    Use Google Search to find additional context if the URL is a landing page or partial description.
    
    If this is for a Government or Community Services role, identify the "Key Selection Criteria" (KSC) and map them against the relevant Australian Capability Framework. 
    Ensure requirements like AHPRA, AASW, or NDIS compliance are captured in Essential Criteria.
    `;

    try {
        const response = await ai.models.generateContent({
            model: modelName,
            contents: prompt,
            config: {
                ...config,
                systemInstruction: SYSTEM_INSTRUCTION
            },
        });

        const jsonText = response.text?.trim();
        if (!jsonText) throw new Error("AI returned empty results.");
        
        const parsedJson = JSON.parse(jsonText);
        
        // Extract Grounding Sources
        const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
        const sources: GroundingSource[] = groundingChunks
            .filter((chunk: any) => chunk.web)
            .map((chunk: any) => ({
                title: chunk.web.title || "Web Source",
                uri: chunk.web.uri
            }));

        return {
            ...parsedJson,
            sources,
            essentialCriteria: Array.isArray(parsedJson.essentialCriteria) ? parsedJson.essentialCriteria : [],
            desirableCriteria: Array.isArray(parsedJson.desirableCriteria) ? parsedJson.desirableCriteria : [],
        } as JobDetails;

    } catch (error) {
        console.error("Gemini Extraction Error:", error);
        throw new Error("Failed to analyze role. Ensure the URL is valid or the role is publicly listed.");
    }
};