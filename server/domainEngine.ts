import {
  SubjectDomain,
  DifficultyLevel,
  TeachingLanguage,
  TeachingStyle,
  LessonSegment,
  LearningGraph,
  ConceptNode,
  InteractiveQuestion
} from '../src/types.js';

export interface DomainMeta {
  domain: SubjectDomain;
  normalizedTopic: string;
  keyConcepts: string[];
  suggestedVisualType: 'code' | 'formula' | 'diagram' | 'interactive_simulation' | 'concept_map';
  commonMisconceptions: Array<{
    diagnosticTarget: string;
    mistakeTrigger: string[];
    title: string;
    diagnosis: string;
    analogy: string;
  }>;
}

export class DomainEngine {
  /**
   * Classify any raw topic string into a SubjectDomain and extract semantic metadata
   */
  static classifyTopic(rawTopic: string, rawSubject?: string): DomainMeta {
    const text = (rawTopic + ' ' + (rawSubject || '')).toLowerCase();

    // 1. Computer Science / Programming
    if (
      text.includes('stack') ||
      text.includes('queue') ||
      text.includes('binary tree') ||
      text.includes('binary search') ||
      text.includes('linked list') ||
      text.includes('graph') ||
      text.includes('dsa') ||
      text.includes('algorithm') ||
      text.includes('c++') ||
      text.includes('python') ||
      text.includes('javascript') ||
      text.includes('react') ||
      text.includes('hook') ||
      text.includes('sql') ||
      text.includes('join') ||
      text.includes('database') ||
      text.includes('programming') ||
      text.includes('coding') ||
      text.includes('recursion') ||
      text.includes('dynamic programming') ||
      text.includes('array') ||
      text.includes('pointer')
    ) {
      if (text.includes('stack')) {
        return {
          domain: 'computer_science',
          normalizedTopic: 'Stack Data Structure (LIFO)',
          keyConcepts: [
            'LIFO Principle & Stack Intuition',
            'Push and Pop Operations',
            'Peek and Top Pointer',
            'Stack Overflow & Underflow Edge Cases',
            'Real-World Applications (Undo, Call Stack, Syntax Parsing)'
          ],
          suggestedVisualType: 'code',
          commonMisconceptions: [
            {
              diagnosticTarget: 'Push and Pop Operations',
              mistakeTrigger: ['peek removes', 'pop keeps', 'fifo', 'queue'],
              title: 'Confusing Pop() with Peek() or FIFO behavior',
              diagnosis: 'You may have thought peek() removes the element or that stacks operate first-in-first-out. In reality, pop() removes the top element while peek() only inspects it!',
              analogy: 'Think of a stack of dinner plates in a cafeteria: You can only take the top plate off (pop), or look at the design on the top plate (peek) without removing it!'
            },
            {
              diagnosticTarget: 'Stack Overflow & Underflow Edge Cases',
              mistakeTrigger: ['underflow when full', 'overflow when empty'],
              title: 'Inverting Stack Overflow and Underflow conditions',
              diagnosis: 'Stack Overflow occurs when pushing onto an already full stack; Underflow occurs when attempting to pop from an empty stack.',
              analogy: 'Overflow is trying to pour water into an already full glass; Underflow is trying to drink from an empty glass!'
            }
          ]
        };
      }

      if (text.includes('binary search')) {
        return {
          domain: 'computer_science',
          normalizedTopic: 'Binary Search Algorithm (O(log N))',
          keyConcepts: [
            'Divide and Conquer Search Space',
            'Sorted Array Prerequisite',
            'Midpoint Calculation (low + (high-low)/2)',
            'Boundary Update Logic (low = mid + 1 vs high = mid - 1)',
            'Logarithmic Time Complexity O(log N)'
          ],
          suggestedVisualType: 'code',
          commonMisconceptions: [
            {
              diagnosticTarget: 'Sorted Array Prerequisite',
              mistakeTrigger: ['unsorted', 'any array', 'random order'],
              title: 'Applying Binary Search to Unsorted Data',
              diagnosis: 'Binary Search strictly relies on the array being sorted so it can discard half the remaining elements with each comparison.',
              analogy: 'Imagine looking for a name in a telephone directory: If the book is alphabetically sorted, you can open to the middle and decide left or right. If the pages are shuffled randomly, you are forced to check every single page (linear search)!'
            }
          ]
        };
      }

      if (text.includes('react') || text.includes('hook')) {
        return {
          domain: 'computer_science',
          normalizedTopic: 'React Hooks (useState & useEffect)',
          keyConcepts: [
            'Component State and Re-rendering Cycle',
            'useState Hook Syntax & Setter Function',
            'useEffect for Side Effects and Cleanup',
            'Dependency Array Mechanics',
            'Rules of Hooks (Top-Level Execution)'
          ],
          suggestedVisualType: 'code',
          commonMisconceptions: [
            {
              diagnosticTarget: 'Dependency Array Mechanics',
              mistakeTrigger: ['runs once without array', 'infinite loop', 'direct mutation'],
              title: 'Direct State Mutation vs Setter Function or Missing Dependencies',
              diagnosis: 'Mutating state directly does not trigger re-renders, and omitting dependencies in useEffect causes stale closures or infinite re-render loops.',
              analogy: 'Direct mutation is like changing the speedometer needle with your finger—the car did not actually change speed! You must use the accelerator pedal (the state setter) so the engine (React) knows to update.'
            }
          ]
        };
      }

      if (text.includes('sql') || text.includes('join')) {
        return {
          domain: 'computer_science',
          normalizedTopic: 'SQL Joins (INNER, LEFT, RIGHT, FULL)',
          keyConcepts: [
            'Relational Schema & Foreign Keys',
            'INNER JOIN (Intersection of Matching Keys)',
            'LEFT JOIN (All Left Rows with NULL Fallbacks)',
            'RIGHT and FULL OUTER JOINs',
            'Filtering vs ON Condition Execution'
          ],
          suggestedVisualType: 'code',
          commonMisconceptions: [
            {
              diagnosticTarget: 'LEFT JOIN (All Left Rows with NULL Fallbacks)',
              mistakeTrigger: ['drops non matching', 'inner join same', 'ignores left'],
              title: 'Confusing INNER JOIN with LEFT JOIN NULL Retention',
              diagnosis: 'An INNER JOIN discards rows with no matching key, whereas a LEFT JOIN retains every row from the left table, filling missing right-table columns with NULL.',
              analogy: 'Think of a roll call of all students (Left table): A LEFT JOIN ensures every student is listed, even if they have not yet enrolled in any club (showing NULL for club name)!'
            }
          ]
        };
      }

      // Generic CS
      return {
        domain: 'computer_science',
        normalizedTopic: rawTopic,
        keyConcepts: [
          'Core Concept & Intuition',
          'Data Structures & Algorithm Mechanics',
          'Code Implementation & Syntax',
          'Execution Tracing & Edge Cases',
          'Time and Space Complexity Analysis'
        ],
        suggestedVisualType: 'code',
        commonMisconceptions: [
          {
            diagnosticTarget: 'Data Structures & Algorithm Mechanics',
            mistakeTrigger: ['linear vs log', 'pointer null', 'off by one'],
            title: 'Algorithmic Boundary or Pointer Traversal Error',
            diagnosis: 'Boundary conditions and base cases must be verified to prevent infinite loops or segmentation faults.',
            analogy: 'Like setting the guardrail on a bridge—if your loop condition is off by one, you either miss the last stop or drive off the edge!'
          }
        ]
      };
    }

    // 2. Biology & Life Sciences
    if (
      text.includes('photosynthesis') ||
      text.includes('cell') ||
      text.includes('dna') ||
      text.includes('rna') ||
      text.includes('mitochondria') ||
      text.includes('respiration') ||
      text.includes('genetics') ||
      text.includes('enzyme') ||
      text.includes('biology') ||
      text.includes('plant') ||
      text.includes('chloroplast')
    ) {
      if (text.includes('photosynthesis')) {
        return {
          domain: 'biology',
          normalizedTopic: 'Photosynthesis in Plants (Light Reactions & Calvin Cycle)',
          keyConcepts: [
            'Chloroplast Structure (Thylakoids & Stroma)',
            'Light-Dependent Reactions (Photolysis of H2O & ATP/NADPH synthesis)',
            'Calvin Cycle / Dark Reactions (CO2 fixation into Glucose)',
            'Chlorophyll Pigment Absorption Spectrum',
            'Environmental Limiting Factors (Light, CO2, Temperature)'
          ],
          suggestedVisualType: 'diagram',
          commonMisconceptions: [
            {
              diagnosticTarget: 'Light-Dependent Reactions',
              mistakeTrigger: ['oxygen from co2', 'co2 split for o2'],
              title: 'Assuming Released Oxygen Comes From CO2 instead of H2O',
              diagnosis: 'The oxygen released during photosynthesis comes from the photolysis (splitting) of WATER (H2O) molecules in thylakoid membranes, NOT from carbon dioxide (CO2)!',
              analogy: 'Water is like the battery pack supplying protons and electrons—when the plant unplugs water to extract hydrogen electrons, oxygen is left behind and released as a byproduct!'
            },
            {
              diagnosticTarget: 'Calvin Cycle / Dark Reactions',
              mistakeTrigger: ['only happens in dark', 'at night only'],
              title: 'Believing Dark Reactions Only Happen At Night',
              diagnosis: '"Dark reactions" (light-independent) do not require darkness; they simply do not require direct photons, but they depend on the ATP and NADPH produced during daylight.',
              analogy: 'Think of baking bread: Sunlight is the power plant providing electricity (ATP). Baking the dough (Calvin cycle) happens inside the oven using that power—it does not need to be midnight to bake!'
            }
          ]
        };
      }

      return {
        domain: 'biology',
        normalizedTopic: rawTopic,
        keyConcepts: [
          'Biological Structure & Cellular Anatomy',
          'Biochemical Mechanism & Step-by-Step Pathway',
          'Energy Transformation (ATP/Enzymatic catalysis)',
          'Regulation & Physiological Equilibrium',
          'Evolutionary Importance & Systemic Role'
        ],
        suggestedVisualType: 'diagram',
        commonMisconceptions: [
          {
            diagnosticTarget: 'Biochemical Mechanism & Step-by-Step Pathway',
            mistakeTrigger: ['respiration only in animals', 'plants do not breathe'],
            title: 'Thinking Plant Cells Do Not Perform Cellular Respiration',
            diagnosis: 'Plants perform both photosynthesis (to create sugars) and cellular respiration (in mitochondria to generate usable ATP).',
            analogy: 'A farm grows corn (photosynthesis), but the farmers still have to cook and eat that corn to get energy (cellular respiration)!'
          }
        ]
      };
    }

    // 3. Mathematics
    if (
      text.includes('calculus') ||
      text.includes('derivative') ||
      text.includes('integral') ||
      text.includes('matrix') ||
      text.includes('matrices') ||
      text.includes('linear algebra') ||
      text.includes('probability') ||
      text.includes('trigonometry') ||
      text.includes('quadratic') ||
      text.includes('limit') ||
      text.includes('math') ||
      text.includes('algebra') ||
      text.includes('geometry')
    ) {
      return {
        domain: 'mathematics',
        normalizedTopic: rawTopic,
        keyConcepts: [
          'Geometric Intuition & Definition of Terms',
          'Formal Mathematical Formulation & Derivation',
          'Key Rules & Algebraic Identities',
          'Step-by-Step Worked Problems',
          'Geometric Significance & Practical Applications'
        ],
        suggestedVisualType: 'formula',
        commonMisconceptions: [
          {
            diagnosticTarget: 'Formal Mathematical Formulation & Derivation',
            mistakeTrigger: ['forget c', 'distribute square', 'divide by zero'],
            title: 'Algebraic Distribution or Indefinite Constant Oversight',
            diagnosis: 'Common mathematical pitfalls include $(a+b)^2 \\neq a^2+b^2$ or neglecting the constant of integration $+C$ in indefinite calculus integrals.',
            analogy: 'Missing $+C$ is like giving someone directions to a building but forgetting to mention what city it is in—the family of parallel curves needs that anchor!'
          }
        ]
      };
    }

    // 4. Physics
    if (
      text.includes('physic') ||
      text.includes('newton') ||
      text.includes('force') ||
      text.includes('motion') ||
      text.includes('inertia') ||
      text.includes('momentum') ||
      text.includes('friction') ||
      text.includes('thermodynamics') ||
      text.includes('circuit') ||
      text.includes('electromagnet') ||
      text.includes('optics') ||
      text.includes('gravity') ||
      text.includes('velocity') ||
      text.includes('acceleration')
    ) {
      return {
        domain: 'physics',
        normalizedTopic: rawTopic,
        keyConcepts: [
          'Physical Phenomenon & Intuition',
          'Fundamental Physical Laws & Equations',
          'Vector Analysis & Free Body Diagrams',
          'Conservation Laws (Energy / Momentum)',
          'Real-World Dynamic Applications'
        ],
        suggestedVisualType: 'interactive_simulation',
        commonMisconceptions: [
          {
            diagnosticTarget: 'Fundamental Physical Laws & Equations',
            mistakeTrigger: ['force needed for constant speed', 'action reaction cancel'],
            title: 'Confusing Velocity with Acceleration or Action-Reaction Cancellation',
            diagnosis: 'Force is only required to change velocity (accelerate), not to sustain steady velocity in frictionless space. Action and reaction forces never cancel because they act on two separate bodies.',
            analogy: 'Think of an ice hockey puck gliding on ultra-smooth ice: Once flicked, it cruises on its own without needing a continuous push!'
          }
        ]
      };
    }

    // 5. Chemistry
    if (
      text.includes('chem') ||
      text.includes('bonding') ||
      text.includes('atom') ||
      text.includes('periodic') ||
      text.includes('acid') ||
      text.includes('base') ||
      text.includes('equilibrium') ||
      text.includes('mole') ||
      text.includes('organic')
    ) {
      return {
        domain: 'chemistry',
        normalizedTopic: rawTopic,
        keyConcepts: [
          'Atomic & Molecular Architecture',
          'Valence Electrons & Chemical Bonding Principles',
          'Reaction Mechanisms & Energy Profiles',
          'Equilibrium & Le Chatelier\'s Principle',
          'Stoichiometry & Quantitative Applications'
        ],
        suggestedVisualType: 'diagram',
        commonMisconceptions: [
          {
            diagnosticTarget: 'Valence Electrons & Chemical Bonding Principles',
            mistakeTrigger: ['ionic vs covalent', 'bond breaking releases energy'],
            title: 'Believing Bond Breaking Releases Energy',
            diagnosis: 'Breaking chemical bonds ALWAYS requires an input of energy (endothermic); energy is released when new, more stable bonds are formed (exothermic).',
            analogy: 'Think of pulling two strong magnets apart: You must exert effort and add energy to pull them apart!'
          }
        ]
      };
    }

    // Default General / Humanities / Business
    return {
      domain: 'general',
      normalizedTopic: rawTopic,
      keyConcepts: [
        'Foundational Principles & Key Terminology',
        'Structural Framework & Core Mechanics',
        'Case Study & Real-World Application',
        'Critical Analysis & Problem Solving',
        'Synthesis & Strategic Takeaways'
      ],
      suggestedVisualType: 'concept_map',
      commonMisconceptions: [
        {
          diagnosticTarget: 'Structural Framework & Core Mechanics',
          mistakeTrigger: ['correlation implies causation', 'confusion of terms'],
          title: 'Correlation vs Causation or Terminology Overlap',
          diagnosis: 'Distinguishing core causal drivers from correlated surface symptoms.',
          analogy: 'Roosters crowing at sunrise does not cause the sun to rise!'
        }
      ]
    };
  }

  /**
   * Topic Relevance Validator: Ensures generated lesson content does not drift into unrelated subjects
   */
  static validateTopicRelevance(
    targetTopic: string,
    domain: SubjectDomain,
    candidateText: string
  ): { isRelevant: boolean; score: number; reason: string } {
    const cleanTarget = targetTopic.toLowerCase();
    const cleanCand = candidateText.toLowerCase();

    // Check if target topic keywords exist in candidate
    const stopWords = new Set([
      'teach', 'me', 'how', 'what', 'is', 'explain', 'about', 'basics', 'from',
      'with', 'intro', 'the', 'and', 'for', 'you', 'can', 'please', 'give',
      'lesson', 'plan', 'notes', 'in', 'on', 'to', 'of', 'a', 'an'
    ]);

    const targetKeywords = cleanTarget
      .replace(/[^a-z0-9\s]/g, ' ')
      .split(/\s+/)
      .filter((w) => w.length > 2 && !stopWords.has(w));

    let keywordHits = 0;
    for (const kw of targetKeywords) {
      if (cleanCand.includes(kw)) keywordHits++;
    }

    const keywordRatio = targetKeywords.length > 0 ? keywordHits / targetKeywords.length : 1.0;

    // Check for severe topic leakage (e.g., candidate is talking about Newton's laws while teaching Stack)
    const isTopicCS = domain === 'computer_science';
    const hasPhysicsLeak = cleanCand.includes("newton's law") || cleanCand.includes('inertia of rest') || cleanCand.includes('frictionless space');
    const isTopicPhysics = domain === 'physics';
    const hasCSLeak = cleanCand.includes('std::stack') || cleanCand.includes('push() and pop()') || cleanCand.includes('lifo data structure');

    if (isTopicCS && hasPhysicsLeak && !cleanTarget.includes('physics')) {
      return {
        isRelevant: false,
        score: 0.1,
        reason: 'Topic Leakage: Computer Science topic contains unintended Classical Physics references'
      };
    }

    if (isTopicPhysics && hasCSLeak && !cleanTarget.includes('stack') && !cleanTarget.includes('code')) {
      return {
        isRelevant: false,
        score: 0.1,
        reason: 'Topic Leakage: Physics topic contains unintended Computer Science references'
      };
    }

    const score = Math.min(1.0, Number((keywordRatio * 0.7 + (keywordHits > 0 ? 0.3 : 0.0)).toFixed(2)));
    const isRelevant = score >= 0.25 || targetKeywords.length === 0 || keywordHits >= 1;

    return {
      isRelevant,
      score,
      reason: isRelevant
        ? `Validated relevance for topic "${targetTopic}" (score: ${score})`
        : `Topic relevance score (${score}) below threshold 0.25 for keywords [${targetKeywords.slice(0, 3).join(', ')}]`
    };
  }

  /**
   * Build domain-specific LearningGraph
   */
  static buildLearningGraph(topic: string, meta: DomainMeta): LearningGraph {
    const nodes: ConceptNode[] = meta.keyConcepts.map((cName, idx) => ({
      id: `c_${idx + 1}`,
      name: cName,
      category: idx === 0 ? 'Foundational' : idx === meta.keyConcepts.length - 1 ? 'Application' : 'Core Mechanism',
      description: `Mastery of ${cName} within the context of ${topic}`,
      prerequisites: idx > 0 ? [`c_${idx}`] : [],
      masteryScore: idx === 0 ? 0.75 : idx === 1 ? 0.45 : 0.15,
      status: idx === 0 ? 'mastered' : idx === 1 ? 'in_progress' : 'unlocked'
    }));

    const edges = nodes.slice(1).map((node, i) => ({
      from: nodes[i].id,
      to: node.id,
      relationship: 'prerequisite' as const
    }));

    return {
      topic,
      domain: meta.domain === 'computer_science' ? 'Computer Science & DSA' : meta.domain === 'biology' ? 'Biological Sciences' : meta.domain === 'mathematics' ? 'Mathematics & Analysis' : meta.domain === 'physics' ? 'Physics & Mechanics' : 'General Education',
      nodes,
      edges
    };
  }

  /**
   * Build comprehensive domain-specific LessonSegments for any topic
   */
  static buildDomainSegments(
    topic: string,
    meta: DomainMeta,
    durationMinutes: number,
    language: TeachingLanguage,
    difficulty: DifficultyLevel,
    style: TeachingStyle,
    citation?: any
  ): LessonSegment[] {
    const isHindi = language === 'hi';
    const isHinglish = language === 'hinglish';
    const domain = meta.domain;

    if (domain === 'computer_science') {
      const isStack = topic.toLowerCase().includes('stack');
      const isBinarySearch = topic.toLowerCase().includes('binary search');
      const isReact = topic.toLowerCase().includes('react') || topic.toLowerCase().includes('hook');
      const isSQL = topic.toLowerCase().includes('sql') || topic.toLowerCase().includes('join');

      if (isStack) {
        return [
          {
            id: 'seg_stack_1',
            segmentIndex: 0,
            conceptId: 'c_1',
            conceptName: 'LIFO Principle & Stack Intuition',
            durationSecs: durationMinutes === 5 ? 60 : 180,
            purpose: 'Establish mental model of Last-In, First-Out (LIFO) data access.',
            teachingStrategy: 'first_principles',
            visualType: 'code',
            scriptText: isHindi
              ? "नमस्ते! आज हम कंप्यूटर साइंस का एक अत्यंत महत्वपूर्ण डेटा स्ट्रक्चर समझेंगे: स्टैक (Stack)। स्टैक LIFO यानी 'लास्ट इन, फर्स्ट आउट' के सिद्धांत पर काम करता है। जो तत्व सबसे अंत में अंदर जाता है, वह सबसे पहले बाहर आता है!"
              : isHinglish
              ? "Hello! Aaj hum Computer Science ka sabse fundamental data structure seekhenge: Stack! Stack LIFO principle par kaam karta hai — yaani Last-In, First-Out. Jo item sabse last mein add hota hai, wohi sabse pehle remove hota hai!"
              : "Welcome! Today we are mastering the Stack data structure. A Stack operates strictly on the LIFO principle: Last-In, First-Out. The most recently added element is always the first one to be removed.",
            visualContent: {
              type: 'code',
              title: 'Stack Data Structure: LIFO Principle & Array Representation',
              caption: 'All insertions (Push) and deletions (Pop) happen exclusively at the TOP of the stack.',
              codeSnippet: {
                language: 'cpp',
                code: `// Stack Implementation in C++ (LIFO)
#include <iostream>
#include <vector>
using namespace std;

class Stack {
private:
    vector<int> elements;
public:
    void push(int value) {
        elements.push_back(value);
        cout << "Pushed: " << value << " (Top is now " << value << ")\\n";
    }
    
    int pop() {
        if (isEmpty()) {
            cout << "Stack Underflow!\\n";
            return -1;
        }
        int topVal = elements.back();
        elements.pop_back();
        return topVal; // Removed from top
    }

    bool isEmpty() { return elements.empty(); }
};`,
                output: 'Pushed: 10\nPushed: 20\nPushed: 30\nPopped: 30 (LIFO Order!)',
                highlightLines: [8, 9, 13, 14]
              },
              bulletPoints: [
                'LIFO (Last-In, First-Out): Top element is always accessed first.',
                'O(1) Time Complexity: Both Push and Pop take instantaneous constant time.',
                'Top Pointer: Single index tracking the boundary of the stack.'
              ],
              keyTakeaway: 'You cannot access or remove elements from the bottom or middle of a pure stack without first popping the elements above them.',
              sourceCitation: citation || {
                documentTitle: 'Data Structures & Algorithms in C++',
                chapter: 'Chapter 3: Stacks & Queues',
                page: 45,
                snippet: 'A stack is a linear data structure that follows the LIFO order of operations.'
              }
            },
            question: {
              id: 'q_stack_1',
              type: 'mcq',
              prompt: isHinglish
                ? "Agar aap ek empty Stack mein sequence mein 10, 20, aur 30 push karte hain, aur phir ek baar pop() call karte hain, toh kaun sa number pop hoga?"
                : "If you push numbers 10, 20, and 30 in sequence into an empty Stack, and then call pop(), which value is returned?",
              options: [
                '30 (The last item pushed, following LIFO)',
                '10 (The first item pushed, following FIFO)',
                '20 (The median item)',
                'Error: Cannot pop with 3 elements'
              ],
              correctAnswer: '30 (The last item pushed, following LIFO)',
              explanation: 'Because Stacks operate on LIFO (Last-In, First-Out), the most recent element pushed (30) sits at the top and is popped first.',
              hint: 'Remember: Last-In, First-Out (LIFO) means the most recent item pushed is the first to leave!',
              diagnosticTarget: 'Push and Pop Operations',
              difficulty: 'beginner'
            }
          },
          {
            id: 'seg_stack_2',
            segmentIndex: 1,
            conceptId: 'c_2',
            conceptName: 'Push, Pop, Peek & Edge Cases',
            durationSecs: durationMinutes === 5 ? 120 : 300,
            purpose: 'Distinguish pop() from peek() and handle Stack Overflow vs Underflow.',
            teachingStrategy: 'code_walkthrough',
            visualType: 'code',
            scriptText: isHindi
              ? "अब समझते हैं peek() और pop() का अंतर। pop() टॉप एलिमेंट को बाहर निकाल देता है, जबकि peek() केवल टॉप एलिमेंट को देखता है बिना उसे हटाए! इसके अलावा अगर स्टैक खाली है और आप pop करते हैं, तो उसे Stack Underflow कहते हैं।"
              : isHinglish
              ? "Ab dekhte hain peek() aur pop() ke beech ka crucial difference! pop() element ko stack se remove kar deta hai, jabki peek() sirf top value ko inspect karta hai bina delete kiye! Agar stack empty ho aur aap pop karo, toh use Stack Underflow bolte hain."
              : "Now let us examine the critical distinction between pop() and peek(), as well as edge cases. Calling pop() deletes the top element; calling peek() merely inspects the top value without modifying the stack. Attempting to pop from an empty stack causes a Stack Underflow error.",
            visualContent: {
              type: 'code',
              title: 'Stack Operations: Pop() vs Peek() & Boundary Conditions',
              caption: 'Underflow occurs when popping an empty stack; Overflow occurs when pushing into a fixed-size full stack.',
              codeSnippet: {
                language: 'cpp',
                code: `int peek() {
    if (topIndex == -1) {
        throw runtime_error("Stack Underflow: Stack is empty");
    }
    return arr[topIndex]; // Inspects TOP without modifying topIndex!
}

int pop() {
    if (topIndex == -1) {
        throw runtime_error("Stack Underflow: Stack is empty");
    }
    int value = arr[topIndex];
    topIndex--; // Decrements topIndex to permanently remove element!
    return value;
}`,
                output: '// peek() -> returns value, size stays same\n// pop()  -> returns value, size decrements by 1',
                highlightLines: [5, 12, 13]
              },
              bulletPoints: [
                'peek() / top(): Read-only operation. Does NOT change stack size.',
                'pop(): Destructive operation. Decrements top pointer and reduces size by 1.',
                'Stack Underflow: Attempting to pop or peek an empty stack (topIndex == -1).',
                'Stack Overflow: Exceeding allocated buffer capacity in fixed-size array stacks.'
              ],
              keyTakeaway: 'Always guard your stack operations with isEmpty() checks before calling pop() or peek().',
              sourceCitation: citation
            },
            question: {
              id: 'q_stack_2',
              type: 'mcq',
              prompt: isHinglish
                ? "Agar aap ek Stack par peek() call karte hain, toh stack ke number of elements par kya asar padega?"
                : "What happens to the number of elements in a stack when you execute a peek() operation?",
              options: [
                'The size remains exactly unchanged (peek only reads the top value)',
                'The size decreases by 1 as the top element is removed',
                'The stack is completely cleared',
                'The top element is moved to the bottom'
              ],
              correctAnswer: 'The size remains exactly unchanged (peek only reads the top value)',
              explanation: 'peek() (or top()) is a non-destructive read-only operation that inspects the top value without decrementing the stack pointer.',
              hint: 'Think: Peek means "to look at without touching"!',
              diagnosticTarget: 'Peek and Top Pointer',
              difficulty: 'beginner'
            }
          },
          {
            id: 'seg_stack_3',
            segmentIndex: 2,
            conceptId: 'c_3',
            conceptName: 'Real-World Applications: Browser History & Call Stack',
            durationSecs: durationMinutes === 5 ? 120 : 360,
            purpose: 'Connect Stack mechanics to Browser Back/Forward buttons, Undo history, and Function Call Stacks.',
            teachingStrategy: 'real_world_case',
            visualType: 'concept_map',
            scriptText: isHindi
              ? "स्टैक केवल एक सिद्धांत नहीं है, यह आधुनिक सॉफ्टवेयर का दिल है! आपके ब्राउज़र का 'Back' बटन स्टैक का उपयोग करता है। जब भी आप एक नया पेज खोलते हैं, वह स्टैक पर पुश हो जाता है। जब आप Back दबाते हैं, तो वह पेज पॉप हो जाता है।"
              : isHinglish
              ? "Stack real-world software ka heart hai! Aapke web browser ka 'Back' button, code editor ka 'Undo (Ctrl+Z)', aur CPU ka Function Call Stack sabhi Stack data structure par chalte hain! Jab function execute hota hai, frame stack par push hota hai aur return hone par pop hota hai."
              : "Stacks are foundational to modern operating systems and web browsers. Your browser Back button, text editor Undo (Ctrl+Z), balanced parentheses validators, and the CPU Function Execution Call Stack all rely on Stacks.",
            visualContent: {
              type: 'concept_map',
              title: 'Real-World Stack Architecture Applications',
              caption: 'State management and chronological reversal in real software systems.',
              bulletPoints: [
                'Browser History: Visiting URL pushes to History Stack; Back button pops.',
                'Undo Engine: Every text edit pushes an action object; Undo pops and reverses.',
                'Function Call Stack: Tracks active subroutines, local variables, and return addresses.',
                'Syntax Parsing: Matching opening and closing brackets { [ ( ) ] } in compilers.'
              ],
              keyTakeaway: 'Whenever an application needs to reverse chronological actions or manage nested contexts, a Stack is the optimal data structure.',
              sourceCitation: citation
            },
            question: {
              id: 'q_stack_3',
              type: 'mcq',
              prompt: isHinglish
                ? "Compilers aur Code Editors brackets jaise '{ [ ( ) ] }' ko validate karne ke liye Stack ka use kyun karte hain?"
                : "Why do compilers and code linters use a Stack to validate balanced parentheses in code?",
              options: [
                'Opening brackets are pushed to the stack, and each closing bracket matches and pops the most recent opening bracket',
                'Because stacks sort brackets alphabetically in O(N log N)',
                'Because stacks can only hold character types',
                'Stacks randomly check brackets from left to right'
              ],
              correctAnswer: 'Opening brackets are pushed to the stack, and each closing bracket matches and pops the most recent opening bracket',
              explanation: 'Because parentheses must be closed in the reverse order of being opened (most deeply nested first), the LIFO property of a Stack perfectly matches closing brackets with the latest opening bracket.',
              hint: 'Think about nested brackets: The inner-most (most recent) bracket must be closed first!',
              diagnosticTarget: 'Real-World Applications',
              difficulty: 'intermediate'
            }
          }
        ];
      }

      if (isBinarySearch) {
        return [
          {
            id: 'seg_bs_1',
            segmentIndex: 0,
            conceptId: 'c_1',
            conceptName: 'Divide & Conquer & Sorted Array Prerequisite',
            durationSecs: durationMinutes === 5 ? 60 : 180,
            purpose: 'Explain how Binary Search cuts search space in half at each step in O(log N) time.',
            teachingStrategy: 'first_principles',
            visualType: 'code',
            scriptText: isHindi
              ? "आज हम बाइनरी सर्च (Binary Search) सीखेंगे। यदि आपके पास एक सॉर्टेड (क्रमबद्ध) ऐरे है, तो आप हर तुलना में आधे ऐरे को छोड़ सकते हैं! इससे 10 लाख तत्वों में भी केवल 20 चरणों में उत्तर मिल जाता है।"
              : isHinglish
              ? "Aaj hum seekhenge Binary Search! Binary search ka sabse bada prerequisite yeh hai ki array MUST BE SORTED. Har step par hum middle element check karte hain aur search space ko exact aadha (50%) discard kar dete hain!"
              : "Today we are mastering Binary Search. The foundational prerequisite is that the input array MUST be sorted. By checking the midpoint and discarding half the search space at each step, Binary Search achieves blazing O(log N) time complexity.",
            visualContent: {
              type: 'code',
              title: 'Binary Search Algorithm: Halving Search Space in O(log N)',
              caption: 'Prerequisite: Array must be monotonically sorted.',
              codeSnippet: {
                language: 'cpp',
                code: `int binarySearch(const vector<int>& arr, int target) {
    int low = 0, high = arr.size() - 1;
    
    while (low <= high) {
        int mid = low + (high - low) / 2; // Prevents integer overflow!
        
        if (arr[mid] == target) {
            return mid; // Found at index mid
        } else if (arr[mid] < target) {
            low = mid + 1;  // Target is in the right half
        } else {
            high = mid - 1; // Target is in the left half
        }
    }
    return -1; // Target not found
}`,
                output: 'Searching in [2, 5, 8, 12, 16, 23, 38, 56, 72, 91]\nTarget 23 -> mid=16 (too small) -> search right -> mid=23 (Found in 2 steps!)',
                highlightLines: [5, 8, 10, 12]
              },
              bulletPoints: [
                'Sorted Prerequisite: Fails completely if elements are unsorted.',
                'Midpoint: Use low + (high-low)/2 to avoid integer overflow.',
                'O(log N) Complexity: Searching 1,000,000 items takes at most 20 comparisons!'
              ],
              keyTakeaway: 'Binary Search turns an impossible linear scan into lightning-fast logarithmic lookup.',
              sourceCitation: citation
            },
            question: {
              id: 'q_bs_1',
              type: 'mcq',
              prompt: isHinglish
                ? "Agar ek array unsorted hai [42, 10, 88, 3, 19], toh kya hum direct Binary Search apply kar sakte hain?"
                : "Can you execute Binary Search directly on an unsorted array like [42, 10, 88, 3, 19]?",
                options: [
                  'No, Binary Search strictly requires the array to be sorted first',
                  'Yes, Binary Search works on any arbitrary list',
                  'Yes, but it runs in O(N^2) instead of O(log N)',
                  'Only if the target is an even number'
                ],
                correctAnswer: 'No, Binary Search strictly requires the array to be sorted first',
                explanation: 'Binary Search makes the decision to discard the left or right half based on whether target is greater or less than mid. If elements are unsorted, this assumption fails and target can be missed.',
                hint: 'Remember the phone book analogy: You cannot jump to the middle if names are not alphabetical!',
                diagnosticTarget: 'Sorted Array Prerequisite',
                difficulty: 'beginner'
            }
          }
        ];
      }
    }

    if (domain === 'biology') {
      return [
        {
          id: 'seg_bio_1',
          segmentIndex: 0,
          conceptId: 'c_1',
          conceptName: 'Chloroplasts & Light Reactions',
          durationSecs: durationMinutes === 5 ? 60 : 180,
          purpose: 'Explain how thylakoid membranes capture solar energy and split H2O into oxygen, protons, and electrons.',
          teachingStrategy: 'first_principles',
          visualType: 'diagram',
          scriptText: isHindi
            ? "नमस्ते! आज हम पौधों में प्रकाश संश्लेषण (Photosynthesis) समझेंगे। क्लोरोप्लास्ट की थाइलाकोइड झिल्ली में सूर्य का प्रकाश पानी के अणुओं (H2O) को तोड़ता है, जिससे ऑक्सीजन गैस मुक्त होती है और ऊर्जा अणु (ATP और NADPH) बनते हैं!"
            : isHinglish
            ? "Hello! Aaj hum Biology ka fundamental process Photosynthesis samjhenge! Chloroplast ke thylakoid membrane mein sunlight paani (H2O) ko split karti hai — jisse Oxygen gas release hoti hai aur plant energy currency ATP aur NADPH banata hai!"
            : "Welcome! Today we are exploring Photosynthesis. In the thylakoid membranes of chloroplasts, solar photons energize chlorophyll to split water (photolysis), releasing oxygen and synthesizing ATP and NADPH.",
          visualContent: {
            type: 'diagram',
            title: 'Photosynthesis: Light-Dependent Reactions & Photolysis of Water',
            caption: '6 CO2 + 6 H2O + Light Energy -> C6H12O6 (Glucose) + 6 O2',
            bulletPoints: [
              'Photolysis of Water: 2 H2O -> 4 H+ + 4 e- + O2 (Oxygen is released from H2O, not CO2!)',
              'Thylakoid Membrane: Houses Photosystems II and I and the electron transport chain.',
              'Energy Output: High-energy ATP and NADPH drive the subsequent Calvin Cycle.'
            ],
            keyTakeaway: 'The oxygen we breathe is generated as a byproduct of water splitting during light reactions in plant thylakoids.',
            sourceCitation: citation || {
              documentTitle: 'NCERT Biology Class 11',
              chapter: 'Chapter 13: Photosynthesis in Higher Plants',
              page: 206,
              snippet: 'Water splitting complex is associated with PS II on inner thylakoid membrane.'
            }
          },
          question: {
            id: 'q_bio_1',
            type: 'mcq',
            prompt: isHinglish
              ? "Photosynthesis ke dauran jo Oxygen (O2) release hoti hai, woh kis molecule ke split hone se aati hai?"
              : "During photosynthesis, from which reactant molecule does the released oxygen gas (O2) originate?",
            options: [
              'Water (H2O) via photolysis in thylakoids',
              'Carbon Dioxide (CO2) from the air',
              'Glucose (C6H12O6) breakdown',
              'Chlorophyll degradation'
            ],
            correctAnswer: 'Water (H2O) via photolysis in thylakoids',
            explanation: 'Isotope tracking experiments prove that the oxygen released comes entirely from the splitting (photolysis) of water molecules (H2O), not from carbon dioxide.',
            hint: 'Remember: Water is split by light at Photosystem II to extract electrons and release O2!',
            diagnosticTarget: 'Light-Dependent Reactions',
            difficulty: 'beginner'
          }
        },
        {
          id: 'seg_bio_2',
          segmentIndex: 1,
          conceptId: 'c_2',
          conceptName: 'The Calvin Cycle (Carbon Fixation & Glucose Synthesis)',
          durationSecs: durationMinutes === 5 ? 120 : 300,
          purpose: 'Explain how RuBisCO fixes CO2 in the stroma using ATP and NADPH into sugars.',
          teachingStrategy: 'visual_derivation',
          visualType: 'diagram',
          scriptText: isHindi
            ? "अब आते हैं केल्विन चक्र (Calvin Cycle) पर। यह क्लोरोप्लास्ट के स्ट्रोमा में होता है। एंजाइम RuBisCO हवा से CO2 को पकड़कर ग्लूकोज बनाने में मदद करता है।"
            : isHinglish
            ? "Ab aate hain Calvin Cycle par! Yeh chloroplast ke Stroma fluid mein hota hai. RuBisCO enzyme CO2 gas ko fix karta hai aur light reaction se mile ATP/NADPH ka use karke glucose sugar synthesize karta hai."
            : "Now we examine the Calvin Cycle in the chloroplast stroma. The enzyme RuBisCO fixes atmospheric CO2 onto RuBP, utilizing ATP and NADPH to synthesize glucose.",
          visualContent: {
            type: 'diagram',
            title: 'The Calvin Cycle (Light-Independent Reactions in Stroma)',
            caption: 'Phase 1: Carbon Fixation | Phase 2: Reduction | Phase 3: Regeneration of RuBP',
            bulletPoints: [
              'RuBisCO Enzyme: The most abundant protein on Earth, catalyzes CO2 fixation.',
              'Location: Occurs in the fluid stroma surrounding thylakoids.',
              'Sugar Output: For every 6 turns of the cycle, 1 molecule of Glucose (C6H12O6) is formed.'
            ],
            keyTakeaway: 'The Calvin Cycle does not need direct photons, but it requires the chemical energy generated during light exposure.',
            sourceCitation: citation
          },
          question: {
            id: 'q_bio_2',
            type: 'mcq',
            prompt: isHinglish
              ? "Calvin Cycle chloroplast ke kis part mein perform hota hai?"
              : "In which specific compartment of the chloroplast does the Calvin cycle take place?",
            options: [
              'Stroma (the fluid matrix surrounding thylakoids)',
              'Thylakoid lumen (inside the thylakoid discs)',
              'Outer mitochondrial membrane',
              'Cell wall matrix'
            ],
            correctAnswer: 'Stroma (the fluid matrix surrounding thylakoids)',
            explanation: 'While light reactions happen on thylakoid membranes, the Calvin cycle enzymes (like RuBisCO) reside in the fluid stroma.',
            hint: 'Think: Thylakoid membranes for light; fluid stroma for sugar synthesis!',
            diagnosticTarget: 'Calvin Cycle / Dark Reactions',
            difficulty: 'intermediate'
          }
        }
      ];
    }

    if (domain === 'mathematics') {
      return [
        {
          id: 'seg_math_1',
          segmentIndex: 0,
          conceptId: 'c_1',
          conceptName: 'Geometric Rate of Change & Tangent Slope',
          durationSecs: durationMinutes === 5 ? 60 : 180,
          purpose: 'Derive derivative as the limit of secant slopes approaching instantaneous rate of change.',
          teachingStrategy: 'visual_derivation',
          visualType: 'formula',
          scriptText: isHindi
            ? "नमस्ते! कैलकुलस में अवकलन (Derivative) का अर्थ है किसी भी बिंदु पर तात्कालिक परिवर्तन की दर, यानी स्पर्शरेखा की प्रवणता (Slope of Tangent)!"
            : isHinglish
            ? "Hello! Calculus mein Derivative ka simple geometrical meaning hota hai: kisi bhi curve par exact ek point par Tangent line ka Slope! Yaani instantaneous rate of change."
            : "Welcome! The derivative represents the instantaneous rate of change—geometrically, the exact slope of the tangent line to a function at any given point.",
          visualContent: {
            type: 'formula',
            title: 'Definition of Derivative from First Principles',
            caption: "f'(x) is the limit of the difference quotient as h approaches zero.",
            mathEquations: [
              "f'(x) = \\lim_{h \\to 0} \\frac{f(x+h) - f(x)}{h}",
              "\\frac{d}{dx}[x^n] = n x^{n-1}",
              "\\frac{d}{dx}[\\sin(x)] = \\cos(x)",
              "\\frac{d}{dx}[e^x] = e^x"
            ],
            bulletPoints: [
              'Secant to Tangent: As interval h shrinks to 0, secant line becomes the tangent line.',
              'Instantaneous Velocity: If position is s(t), then velocity is v(t) = ds/dt.',
              'Power Rule: Bring the exponent down to multiply, and decrease exponent by 1.'
            ],
            keyTakeaway: 'Derivatives tell you how rapidly a dependent variable responds to tiny nudges in the input variable.',
            sourceCitation: citation
          },
          question: {
            id: 'q_math_1',
            type: 'mcq',
            prompt: isHinglish
              ? "Agar function f(x) = x^3 hai, toh Power Rule ke hisab se iska derivative f'(x) kya hoga?"
              : "Given the function f(x) = x^3, what is its first derivative f'(x) using the Power Rule?",
            options: [
              '3x^2 (Multiply by power 3, reduce exponent to 2)',
              'x^2 (Just reduce exponent)',
              '3x^3 (Multiply by 3 without changing exponent)',
              '1/3 x^4 (Integration)'
            ],
            correctAnswer: '3x^2 (Multiply by power 3, reduce exponent to 2)',
            explanation: 'By the Power Rule d/dx[x^n] = n*x^(n-1): For n=3, d/dx[x^3] = 3*x^(3-1) = 3x^2.',
            hint: 'Power Rule: Bring the 3 in front, and subtract 1 from the power!',
            diagnosticTarget: 'Formal Mathematical Formulation & Derivation',
            difficulty: 'beginner'
          }
        }
      ];
    }

    // Default Physics fallback (Newton's Laws)
    return [
      {
        id: 'seg_phys_1',
        segmentIndex: 0,
        conceptId: 'c_1',
        conceptName: "Newton's First Law: Inertia of Motion",
        durationSecs: durationMinutes === 5 ? 60 : 180,
        purpose: 'Establish physical intuition: Inertia is the natural resistance of mass to changes in velocity.',
        teachingStrategy: 'first_principles',
        visualType: 'interactive_simulation',
        scriptText: isHindi
          ? "नमस्ते! भौतिकी का पहला नियम कहता है: जब तक कोई बाहरी असंतुलित बल न लगे, वस्तु अपनी विराम या समान गति की अवस्था बनाए रखती है।"
          : isHinglish
          ? "Hello! Newton's First Law of Motion (Law of Inertia) kehta hai: Har object apni current state of motion mein rehna chahta hai jab tak koi external unbalanced force use change na kare!"
          : "Welcome! Newton's First Law of Motion establishes that every object persists in its state of rest or uniform straight-line velocity unless acted upon by a net external force.",
        visualContent: {
          type: 'interactive_simulation',
          title: 'The Law of Inertia: Mass & Resistance to Motion',
          caption: 'Mass is the quantitative measure of an object\'s inertia.',
          bulletPoints: [
            'Inertia of Rest: An object stays stationary without unbalanced force.',
            'Inertia of Motion: Moving objects in deep space continue indefinitely at constant velocity.',
            'F_net = 0 implies acceleration a = 0.'
          ],
          keyTakeaway: 'Force causes acceleration (change in velocity), NOT velocity itself!',
          sourceCitation: citation
        },
        question: {
          id: 'q_phys_1',
          type: 'mcq',
          prompt: isHinglish
            ? "Agar ek spacecraft deep space mein bina engine ke constant 10,000 km/h se travel kar raha hai, toh use is speed par chalne ke liye kitne net force ki zaroorat hai?"
            : "If a spacecraft is cruising through frictionless deep space at constant velocity, what net force is required to maintain this speed?",
          options: [
            'Zero Net Force (0 Newtons)',
            'Continuous forward thrust force',
            'Force proportional to its mass times velocity',
            'Force equal to its gravitational weight'
          ],
          correctAnswer: 'Zero Net Force (0 Newtons)',
          explanation: 'Because velocity is constant, acceleration is zero (a=0). By Newton\'s 1st Law, net force F_net = m*a = 0 N.',
          hint: 'Remember: Force is only needed to change speed or direction, not maintain constant speed in space!',
          diagnosticTarget: 'Fundamental Physical Laws & Equations',
          difficulty: 'beginner'
        }
      }
    ];
  }
}
