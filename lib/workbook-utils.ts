// Utility functions for workbook data transformation and validation

export interface WorkbookQuestion {
  id: string;
  text: string;
  type: 'text' | 'scale' | 'multiple_choice' | 'yes_no' | 'reflection';
  required?: boolean;
  placeholder?: string;
  scale?: {
    min: number;
    max: number;
    labels: string[];
  };
  options?: string[];
  maxWords?: number;
  minChars?: number;
  clinicalNote?: string;
  followUp?: string;
}

export interface WorkbookSection {
  id: string;
  type: string;
  title: string;
  instructions?: string;
  therapeuticPurpose?: string;
  questions: WorkbookQuestion[];
}

export interface WorkbookData {
  id: string;
  title: string;
  therapeuticFramework: string;
  estimatedTime: string;
  questions: WorkbookSection[];
}

// Transform the raw course data into the format expected by WorkbookContainer
export function transformWorkbookData(rawWorkbook: any): WorkbookData {
  // Handle the nested structure from enhanced-course-content.ts
  const transformedSections: WorkbookSection[] = [];
  
  if (rawWorkbook.questions && Array.isArray(rawWorkbook.questions)) {
    rawWorkbook.questions.forEach((section: any) => {
      // Each section in the raw data has nested questions
      const transformedQuestions: WorkbookQuestion[] = [];
      
      if (section.questions && Array.isArray(section.questions)) {
        section.questions.forEach((question: any) => {
          // Transform question types
          let questionType = question.type;
          
          // Convert 'textarea' to 'text' or 'reflection' based on context
          if (questionType === 'textarea') {
            questionType = question.maxWords && question.maxWords > 200 ? 'reflection' : 'text';
          }
          
          // Ensure type is valid
          const validTypes = ['text', 'scale', 'multiple_choice', 'yes_no', 'reflection'];
          if (!validTypes.includes(questionType)) {
            questionType = 'text'; // Default fallback
          }
          
          transformedQuestions.push({
            id: question.id,
            text: question.text || question.question || '',
            type: questionType,
            required: question.required !== false, // Default to required
            placeholder: question.placeholder,
            scale: question.scale,
            options: question.options,
            maxWords: question.maxWords,
            minChars: question.minChars,
            clinicalNote: question.clinicalNote,
            followUp: question.followUp
          });
        });
      }
      
      transformedSections.push({
        id: section.id,
        type: section.type || 'general',
        title: section.title || 'Section',
        instructions: section.instructions,
        therapeuticPurpose: section.therapeuticPurpose,
        questions: transformedQuestions
      });
    });
  }
  
  return {
    id: rawWorkbook.id,
    title: rawWorkbook.title,
    therapeuticFramework: rawWorkbook.therapeuticFramework,
    estimatedTime: rawWorkbook.estimatedTime,
    questions: transformedSections
  };
}

// Calculate total questions across all sections
export function getTotalQuestions(workbook: WorkbookData): number {
  return workbook.questions.reduce((total, section) => total + section.questions.length, 0);
}

// Get all question IDs for a workbook
export function getQuestionIds(workbook: WorkbookData): string[] {
  const ids: string[] = [];
  workbook.questions.forEach(section => {
    section.questions.forEach(question => {
      ids.push(question.id);
    });
  });
  return ids;
}

// Validate that all required questions have responses
export function validateResponses(
  workbook: WorkbookData, 
  responses: Record<string, any>
): { isValid: boolean; missingRequired: string[] } {
  const missingRequired: string[] = [];
  
  workbook.questions.forEach(section => {
    section.questions.forEach(question => {
      if (question.required && (!responses[question.id] || responses[question.id] === '')) {
        missingRequired.push(question.id);
      }
    });
  });
  
  return {
    isValid: missingRequired.length === 0,
    missingRequired
  };
}

// Check if a response contains concerning content (for safety flagging)
export function checkForConcerningContent(questionId: string, value: any): boolean {
  // EPDS questions with high scores
  if (questionId.includes('epds') && typeof value === 'number' && value >= 3) {
    return true;
  }
  
  // Check for keywords in text responses
  if (typeof value === 'string') {
    const concerningKeywords = [
      'harm', 'hurt', 'suicide', 'die', 'death', 'worthless', 
      'hopeless', 'can\'t go on', 'end it all'
    ];
    const lowerValue = value.toLowerCase();
    return concerningKeywords.some(keyword => lowerValue.includes(keyword));
  }
  
  return false;
}

// Format response for display
export function formatResponseValue(question: WorkbookQuestion, value: any): string {
  if (!value) return 'No response';
  
  switch (question.type) {
    case 'scale':
      if (question.scale?.labels) {
        const index = value - question.scale.min;
        return question.scale.labels[index] || `${value}`;
      }
      return `${value}`;
      
    case 'yes_no':
      return value === 'yes' ? 'Yes' : 'No';
      
    case 'multiple_choice':
      return value;
      
    case 'text':
    case 'reflection':
      return value;
      
    default:
      return String(value);
  }
}