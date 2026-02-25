# Job Listing Extractor - Technical Guidelines

## 1. Project Overview
The **Job Listing Extractor** is a professional intelligence tool for Australian job seekers in the Public and Community sectors. It utilizes Gemini 3 models to perform deep reasoning on selection criteria and selection compliance.

## 2. AI Strategy & Models
The application employs a dual-model strategy based on task complexity:

### A. Standard Extraction (Flash Mode)
- **Model**: `gemini-3-flash-preview`
- **Feature**: **Google Search Grounding**.
- **Behavior**: Uses search to supplement URL data (e.g., if a LinkedIn page is restricted). 
- **Tooling**: `tools: [{ googleSearch: {} }]`

### B. Deep Sector Analysis (Thinking Mode)
- **Model**: `gemini-3-pro-preview`
- **Feature**: **Advanced Reasoning**.
- **Configuration**: `thinkingConfig: { thinkingBudget: 32768 }`.
- **Logic**: Maps role requirements to Australian Capability Frameworks (APS, VPS) and Social Work standards (AASW).

## 3. Workplace Precision (Australian Context)
Extraction prompts are tailored for:
- **KSC (Key Selection Criteria)**: Identifying and separating implicit vs. explicit requirements.
- **Compliance**: Automatic detection of mandatory Australian certifications (WWCC, AHPRA, NDIS Screening).
- **Ethics**: Identifying values-based criteria common in Social Work (e.g., Trauma-Informed practice).

## 4. Grounding & Transparency
In compliance with GenAI guidelines:
- **Citations**: All URLs found via Search Grounding are extracted from `groundingMetadata` and displayed as verified sources.
- **Provenance**: Users can see exactly where the information originated if search was utilized.

## 5. UI Architecture
- **Step 1 (Source)**: URL input with platform verification.
- **Step 1.5 (Intelligence Toggle)**: Choice between speed (Flash) or reasoning (Pro Thinking).
- **Step 2 (Deconstruction)**: AI-driven extraction with grounding results.
- **Step 3 (Vault)**: LocalStorage persistence for career historical tracking.