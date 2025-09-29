// src/utils/specialistResponses.ts
import { Doctor } from '../types/types';

export interface SpecialistKnowledge {
  specialty: string;
  greeting: string;
  commonConditions: string[];
  responses: {
    keywords: string[];
    response: string;
  }[];
}

export const specialistKnowledge: Record<string, SpecialistKnowledge> = {
  Gastroenterologist: {
    specialty: 'Gastroenterology',
    greeting:
      "Hello! I'm a Gastroenterologist specializing in digestive system disorders. I can help you with stomach, intestinal, liver, and digestive issues. What brings you here today?",
    commonConditions: [
      'acid reflux',
      'IBS',
      'constipation',
      'diarrhea',
      'ulcer',
    ],
    responses: [
      {
        keywords: ['stomach', 'pain', 'ache', 'hurt'],
        response:
          "I understand you're experiencing stomach pain. Can you describe the pain's location and intensity? Is it sharp, dull, or cramping? When did it start, and does eating make it better or worse?",
      },
      {
        keywords: ['acid', 'reflux', 'heartburn', 'gerd'],
        response:
          "Acid reflux and heartburn are very common. Do you experience a burning sensation in your chest, especially after meals? I'd recommend avoiding spicy foods, citrus, and eating smaller portions. Have you tried any antacids?",
      },
      {
        keywords: ['constipation', 'bowel', 'bathroom'],
        response:
          'Constipation can be uncomfortable. How long has this been an issue? I recommend increasing fiber intake (fruits, vegetables, whole grains), drinking more water (8 glasses daily), and regular exercise. Are you taking any medications?',
      },
      {
        keywords: ['diarrhea', 'loose', 'upset'],
        response:
          'Diarrhea needs attention if persistent. How long have you had this? Any fever, blood in stool, or severe abdominal pain? Stay hydrated with water and electrolyte solutions. Avoid dairy and fatty foods temporarily.',
      },
      {
        keywords: ['bloating', 'gas', 'fullness'],
        response:
          'Bloating and gas can indicate several things - food intolerances, IBS, or eating habits. Do you notice it after specific foods? Try eating slowly, avoiding carbonated drinks, and keeping a food diary to identify triggers.',
      },
    ],
  },
  Cardiologist: {
    specialty: 'Cardiology',
    greeting:
      "Hello! I'm a Cardiologist specializing in heart and cardiovascular health. I can help with heart conditions, blood pressure, and circulation issues. How can I assist you today?",
    commonConditions: [
      'chest pain',
      'high blood pressure',
      'palpitations',
      'heart disease',
    ],
    responses: [
      {
        keywords: ['chest', 'pain', 'pressure', 'tight'],
        response:
          "⚠️ Chest pain requires immediate attention. Is the pain severe, radiating to your arm or jaw, accompanied by shortness of breath or sweating? If YES, please call emergency services immediately (911). If it's mild and brief, describe when it occurs - during activity or rest?",
      },
      {
        keywords: ['blood pressure', 'hypertension', 'bp', 'high pressure'],
        response:
          'High blood pressure is manageable with proper care. What are your recent readings? Normal is under 120/80. I recommend: reducing salt intake, regular exercise (30 min daily), maintaining healthy weight, limiting alcohol, and managing stress. Are you on any medications?',
      },
      {
        keywords: ['heart', 'racing', 'palpitations', 'beating', 'flutter'],
        response:
          'Heart palpitations can feel alarming. Do they occur at rest or during activity? How long do they last? Common causes include caffeine, stress, anxiety, or dehydration. However, if frequent or accompanied by dizziness/chest pain, we need further evaluation.',
      },
      {
        keywords: ['cholesterol', 'lipid', 'fat'],
        response:
          'Cholesterol management is crucial for heart health. Do you know your levels? LDL (bad) should be under 100, HDL (good) above 60. I recommend: eating more fiber, choosing lean proteins, exercising regularly, and avoiding trans fats. Have you had recent bloodwork?',
      },
      {
        keywords: ['shortness', 'breath', 'breathing', 'breathless'],
        response:
          'Shortness of breath needs evaluation. Does it occur with exertion or at rest? Any swelling in legs/ankles? This could indicate heart or lung issues. If severe or sudden, seek immediate medical attention. Otherwise, describe your symptoms in detail.',
      },
    ],
  },
  Neurologist: {
    specialty: 'Neurology',
    greeting:
      "Hello! I'm a Neurologist specializing in brain, nervous system, and neurological disorders. I can help with headaches, dizziness, memory issues, and nerve problems. What concerns you today?",
    commonConditions: [
      'migraine',
      'headache',
      'dizziness',
      'seizure',
      'neuropathy',
    ],
    responses: [
      {
        keywords: ['headache', 'migraine', 'head', 'pain'],
        response:
          'Let me help with your headache. Is it throbbing or constant? Located on one or both sides? Any nausea, light sensitivity, or visual changes? How long does it last? Migraines often have triggers like stress, certain foods, sleep changes, or hormones.',
      },
      {
        keywords: ['dizzy', 'dizziness', 'vertigo', 'balance'],
        response:
          'Dizziness can have various causes. Is the room spinning (vertigo) or do you feel lightheaded? When does it occur - standing up, moving your head, or constantly? Any hearing changes or ringing in ears? This helps distinguish between inner ear vs. neurological causes.',
      },
      {
        keywords: ['memory', 'forget', 'concentration', 'focus'],
        response:
          'Memory concerns are important to address. Are you forgetting recent events, words, or appointments? Any confusion or personality changes? Many factors affect memory: stress, sleep, medications, depression, or aging. How long have you noticed this?',
      },
      {
        keywords: ['numbness', 'tingling', 'pins', 'needles'],
        response:
          'Numbness and tingling suggest nerve involvement. Where do you feel it - hands, feet, face? Is it constant or intermittent? Any weakness or pain? Common causes include carpal tunnel, pinched nerves, diabetes, or vitamin B12 deficiency.',
      },
      {
        keywords: ['seizure', 'convulsion', 'episode', 'blackout'],
        response:
          '⚠️ Seizures require immediate medical evaluation. Have you experienced loss of consciousness, uncontrolled movements, or confusion afterward? Any history of seizures? Please seek emergency care if this is new. Otherwise, describe what happened in detail.',
      },
    ],
  },
  'General Surgery': {
    specialty: 'General Surgery',
    greeting:
      "Hello! I'm a General Surgeon. I can provide consultation on surgical conditions, post-operative care, and when surgery might be needed. What would you like to discuss today?",
    commonConditions: ['appendicitis', 'hernia', 'gallstones', 'post-op care'],
    responses: [
      {
        keywords: ['appendix', 'appendicitis', 'right', 'lower', 'abdomen'],
        response:
          "⚠️ Suspected appendicitis is a medical emergency. Classic signs: sharp pain starting near belly button moving to lower right abdomen, fever, nausea, loss of appetite. If you have severe abdominal pain, seek emergency care immediately. Don't eat or drink anything.",
      },
      {
        keywords: ['hernia', 'bulge', 'lump', 'groin'],
        response:
          "Hernias appear as bulges, often in the groin or abdomen. Does it increase with coughing or straining? Can you push it back in? Most hernias eventually need surgical repair. If painful, growing, or can't be reduced, see a surgeon soon. Avoid heavy lifting.",
      },
      {
        keywords: ['gallbladder', 'gallstone', 'right', 'upper', 'pain'],
        response:
          'Gallbladder issues often cause pain in the upper right abdomen, especially after fatty meals. Any nausea, vomiting, or yellowing of skin/eyes? Gallstones are common and may require surgery if symptomatic. Try eating low-fat meals and note when pain occurs.',
      },
      {
        keywords: ['surgery', 'operation', 'post-op', 'recovery'],
        response:
          'For post-operative care: keep incisions clean and dry, watch for infection signs (redness, warmth, discharge, fever), take prescribed medications, avoid strenuous activity as directed, and attend follow-up appointments. What type of surgery did you have?',
      },
      {
        keywords: ['wound', 'incision', 'stitches', 'scar'],
        response:
          'Proper wound care is essential. Keep it clean, dry, and covered initially. Signs of infection: increased redness, warmth, swelling, pus, or red streaks. Change dressings as instructed. Stitches typically removed in 7-14 days. When was your surgery?',
      },
    ],
  },
};

// Generate specialist response based on specialty and message
export const generateSpecialistResponse = (
  specialty: string,
  userMessage: string,
  doctor: Doctor,
): string => {
  const knowledge = specialistKnowledge[specialty];

  if (!knowledge) {
    return "I apologize, but I'm not specialized in that area. However, I'm here to help. Can you tell me more about your symptoms?";
  }

  const lowerMessage = userMessage.toLowerCase();

  // Check for greeting
  if (lowerMessage.match(/\b(hello|hi|hey|good morning|good afternoon)\b/)) {
    return knowledge.greeting;
  }

  // Check for thank you
  if (lowerMessage.match(/\b(thank|thanks|appreciate)\b/)) {
    return `You're welcome! I'm here if you have more questions about ${knowledge.specialty.toLowerCase()}. Take care of yourself!`;
  }

  // Match keywords to responses
  for (const responseData of knowledge.responses) {
    if (responseData.keywords.some(keyword => lowerMessage.includes(keyword))) {
      return responseData.response;
    }
  }

  // Default response if no match
  return `As a ${
    knowledge.specialty
  } specialist, I can help with conditions like ${knowledge.commonConditions.join(
    ', ',
  )}. Could you describe your symptoms in more detail? When did they start, and how severe are they?`;
};

// Create a specialist doctor object from health category
export const createSpecialistDoctor = (category: {
  id: string;
  name: string;
  icon: string;
  color: string;
}): Doctor => {
  const specialty = category.name;
  const knowledge = specialistKnowledge[specialty];

  return {
    id: `specialist-${category.id}`,
    name: `Dr. ${specialty} Specialist`,
    specialty: knowledge?.specialty || specialty,
    rating: 4.8,
    reviews: 0,
    image: 'https://via.placeholder.com/120x120.png?text=Specialist',
    isOnline: true,
    isAI: true,
  };
};
