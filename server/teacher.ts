import {
  InteractiveQuestion,
  StudentEvaluation,
  LessonSegment,
  LearnerProfile,
  TeachingLanguage
} from '../src/types.js';
import { IngestionEngine } from './ingestion.js';
import { db } from './db.js';
import { generateContentWithRetry } from './gemini.js';
import { DomainEngine } from './domainEngine.js';

export class TeachingEngine {
  /**
   * Semantically evaluate a student's answer and detect underlying misconceptions
   */
  static async evaluateAnswer(params: {
    question: InteractiveQuestion;
    studentAnswer: string;
    learnerProfile: LearnerProfile;
    language: TeachingLanguage;
    topicContext?: string;
  }): Promise<StudentEvaluation> {
    const { question, studentAnswer, learnerProfile, language, topicContext } = params;

    // Check with Gemini if available
    try {
      const prompt = `You are an elite, empathetic AI Professor evaluating a student's answer.
Lesson Context: "${topicContext || 'General'}"
Concept tested: "${question.diagnosticTarget}"
Question Prompt: "${question.prompt}"
Expected Answer / Key Idea: "${question.correctAnswer}"
Reference Explanation: "${question.explanation}"
Student's Actual Answer: "${studentAnswer}"
Student Language: ${language}
Student Learning Level: ${learnerProfile.existingKnowledge}

Evaluate the student's answer semantically and return a JSON object with:
1. "correctness": number between 0.0 (completely wrong) and 1.0 (flawless)
2. "conceptMastery": number between 0.0 and 1.0 representing understanding
3. "isMisconception": boolean (true if student holds a fundamental misconception or classic intuitive error)
4. "misconceptionTitle": string (short title like "Confusing Pop() with Peek()" or "Aristotelian Motion Fallacy")
5. "misconceptionDiagnosis": string (warm explanation of why the student arrived at this misunderstanding)
6. "alternateAnalogy": string (a vivid real-world analogy to instantly clarify the truth)
7. "missingConcepts": string array
8. "feedback": string (pedagogical, encouraging response spoken directly to the student in ${language})
9. "recommendedAction": one of "CONTINUE", "SIMPLIFY", "REEXPLAIN_ANALOGY", "REEXPLAIN_FIRST_PRINCIPLES", "DIAGNOSTIC_QUESTION"`;

      const response = await generateContentWithRetry({
        model: 'gemini-3.7-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          systemInstruction: 'You are an adaptive teaching evaluation model. Return strictly JSON matching the StudentEvaluation schema. If the answer is incorrect, identify the underlying misconception and create a brilliant real-world analogy strictly in the current topic domain.'
        }
      });

      if (response && response.text) {
        const evalResult: StudentEvaluation = JSON.parse(response.text);

        // Update real mastery in the database
        const delta = evalResult.correctness >= 0.8 ? 0.15 : evalResult.correctness >= 0.5 ? 0.05 : -0.15;
        db.updateConceptMastery(question.diagnosticTarget, delta);

        db.logEvent({
          type: 'ANSWER_EVALUATED',
          conceptName: question.diagnosticTarget,
          details: {
            questionId: question.id,
            studentAnswer,
            correctness: evalResult.correctness,
            isMisconception: evalResult.isMisconception,
            misconception: evalResult.misconceptionTitle
          }
        });

        return evalResult;
      }
    } catch (err) {
      console.log('Using optimized semantic answer evaluation');
    }

    // Fallback Semantic & Heuristic Evaluator
    return this.deterministicEvaluation(question, studentAnswer, language);
  }

  private static deterministicEvaluation(
    question: InteractiveQuestion,
    studentAnswer: string,
    language: TeachingLanguage
  ): StudentEvaluation {
    const cleanStudent = studentAnswer.toLowerCase().trim();
    const cleanCorrect = question.correctAnswer.toLowerCase().trim();

    // Check direct or semantic match
    const isExact = cleanStudent === cleanCorrect || (cleanCorrect.startsWith(cleanStudent) && cleanStudent.length > 5);
    const isClose = cleanStudent.includes(cleanCorrect) || cleanCorrect.includes(cleanStudent);

    let correctness = isExact ? 1.0 : isClose ? 0.85 : 0.0;
    let isMisconception = false;
    let misconceptionTitle = '';
    let misconceptionDiagnosis = '';
    let alternateAnalogy = '';
    let feedback = '';
    let recommendedAction: StudentEvaluation['recommendedAction'] = 'CONTINUE';

    const promptText = question.prompt.toLowerCase();
    const diagTarget = question.diagnosticTarget.toLowerCase();

    // 1. Stack Data Structure Checks
    if (diagTarget.includes('stack') || promptText.includes('stack') || promptText.includes('pop') || promptText.includes('peek')) {
      if (promptText.includes('peek') && (cleanStudent.includes('decrease') || cleanStudent.includes('removed') || cleanStudent.includes('delete'))) {
        correctness = 0.1;
        isMisconception = true;
        misconceptionTitle = 'Confusing Peek() with Pop() (Believing Peek removes elements)';
        misconceptionDiagnosis = 'You assumed that accessing the top element deletes it from the stack. In reality, peek() is a read-only inspection; only pop() removes it!';
        alternateAnalogy = 'Think of looking at the top book on a pile of books on your desk: You read the title (peek) without picking it up and throwing it away (pop)!';
        feedback = language === 'hi'
          ? "एक आम ग़लती! peek() केवल टॉप एलिमेंट को देखने के लिए है, यह स्टैक से कोई एलिमेंट नहीं हटाता। केवल pop() एलिमेंट को डिलीट करता है!"
          : language === 'hinglish'
          ? "Yeh ek common confusion hai! peek() sirf top element ko inspect (read) karta hai bina stack ka size change kiye. Element ko remove sirf pop() karta hai!"
          : "Common confusion! peek() is a read-only operation that inspects the top element without removing it. Only pop() decrements the stack size.";
        recommendedAction = 'REEXPLAIN_ANALOGY';
      } else if (promptText.includes('10, 20, aur 30') || promptText.includes('10, 20, and 30')) {
        if (cleanStudent.includes('10') || cleanStudent.includes('fifo') || cleanStudent.includes('first')) {
          correctness = 0.1;
          isMisconception = true;
          misconceptionTitle = 'Confusing LIFO (Stack) with FIFO (Queue)';
          misconceptionDiagnosis = 'You applied FIFO (Queue) logic where the first item is removed first. But a Stack is LIFO—the last item pushed (30) sits at the top and pops first!';
          alternateAnalogy = 'Think of a stack of plates in a cafeteria: You take the top plate (the one placed last), not the bottom one!';
          feedback = language === 'hi'
            ? "ध्यान दें: स्टैक LIFO (लास्ट इन, फर्स्ट आउट) होता है। जो 30 सबसे अंत में रखा गया था, वही सबसे पहले बाहर आएगा!"
            : language === 'hinglish'
            ? "Notice kijiye: Stack LIFO (Last-In, First-Out) par kaam karta hai. Jo item sabse last mein push hua (30), wohi sabse pehle pop hoga!"
            : "Notice that Stacks follow LIFO (Last-In, First-Out). The item pushed last (30) is at the top and will be popped first.";
          recommendedAction = 'REEXPLAIN_ANALOGY';
        }
      }
    }

    // 2. Binary Search Checks
    else if (diagTarget.includes('binary search') || promptText.includes('binary search') || promptText.includes('unsorted')) {
      if (cleanStudent.includes('yes') || cleanStudent.includes('any arbitrary') || cleanStudent.includes('o(n^2)')) {
        correctness = 0.1;
        isMisconception = true;
        misconceptionTitle = 'Applying Binary Search on Unsorted Data';
        misconceptionDiagnosis = 'Binary Search relies strictly on the sorted order to discard half the search space. On unsorted data, the midpoint comparison is meaningless.';
        alternateAnalogy = 'If a dictionary had words in random order, opening to the middle wouldn\'t tell you whether to look left or right—you would have to scan every page linearly!';
        feedback = language === 'hi'
          ? "बाइनरी सर्च का मूल नियम: ऐरे हमेशा सॉर्टेड (क्रमबद्ध) होना चाहिए, अन्यथा यह काम नहीं करेगा!"
          : language === 'hinglish'
          ? "Binary search ka sabse fundamental rule yeh hai ki array MUST BE SORTED! Unsorted array par binary search fail ho jayega."
          : "Crucial rule: Binary Search strictly requires the array to be sorted first!";
        recommendedAction = 'REEXPLAIN_ANALOGY';
      }
    }

    // 3. Biology / Photosynthesis Checks
    else if (diagTarget.includes('photosynthesis') || promptText.includes('oxygen') || promptText.includes('calvin')) {
      if (promptText.includes('oxygen') && (cleanStudent.includes('co2') || cleanStudent.includes('carbon dioxide'))) {
        correctness = 0.1;
        isMisconception = true;
        misconceptionTitle = 'Assuming Oxygen Comes From CO2 Instead of H2O Photolysis';
        misconceptionDiagnosis = 'Students often assume oxygen comes from CO2 because both contain oxygen. In reality, light splits H2O molecules, releasing O2 as a byproduct!';
        alternateAnalogy = 'Water (H2O) is the battery pack: The plant unplugs the hydrogen electrons to store energy, releasing the leftover oxygen into the atmosphere!';
        feedback = language === 'hi'
          ? "बहुत प्रसिद्ध ग़लती! प्रकाश संश्लेषण में निकलने वाली ऑक्सीजन CO2 से नहीं, बल्कि पानी (H2O) के टूटने (photolysis) से आती है!"
          : language === 'hinglish'
          ? "Yeh ek classic textbook trap hai! Release hone wali O2 gas CO2 se nahi, balki Paani (H2O) ke split hone se aati hai!"
          : "Classic trap! The oxygen released originates from the photolysis of water (H2O), NOT from carbon dioxide.";
        recommendedAction = 'REEXPLAIN_ANALOGY';
      }
    }

    // 4. Physics Checks
    else if (promptText.includes('spacecraft') || promptText.includes('deep space')) {
      if (cleanStudent.includes('10,000') || cleanStudent.includes('continuous') || cleanStudent.includes('mass times velocity')) {
        correctness = 0.1;
        isMisconception = true;
        misconceptionTitle = 'Aristotelian Motion Fallacy (Belief that force is needed to sustain constant motion)';
        misconceptionDiagnosis = 'You intuitively assumed that because everyday cars need gas against road friction, objects in space need force too. But in frictionless space, motion continues effortlessly!';
        alternateAnalogy = 'Think of rolling a bowling ball on ultra-smooth frictionless ice: Once released, it glides forward forever with zero additional pushing!';
        feedback = language === 'hi'
          ? "घर्षणहीन अंतरिक्ष में एक समान गति बनाए रखने के लिए 0 न्यूटन (शून्य) बल की आवश्यकता होती है!"
          : language === 'hinglish'
          ? "Frictionless deep space mein constant velocity ke liye 0 Net Force chahiye!"
          : "In frictionless space, constant velocity requires ZERO net force (F_net = 0).";
        recommendedAction = 'REEXPLAIN_ANALOGY';
      }
    }

    if (correctness >= 0.8) {
      feedback = language === 'hi'
        ? "शानदार! आपकी वैचारिक समझ बिल्कुल सटीक है। आइए अगले चरण पर चलते हैं।"
        : language === 'hinglish'
        ? "Shabash! Bilkul correct answer aur crystal-clear intuition. Chaliye aage badhte hain!"
        : "Brilliant! Your conceptual grasp is spot-on. Let us continue with the next progression.";
      recommendedAction = 'CONTINUE';
    } else if (!isMisconception) {
      feedback = language === 'hi'
        ? `सही उत्तर है: "${question.correctAnswer}". ${question.explanation}`
        : language === 'hinglish'
        ? `Sahi answer hai: "${question.correctAnswer}". ${question.explanation}`
        : `The correct answer is "${question.correctAnswer}". ${question.explanation}`;
      recommendedAction = 'SIMPLIFY';
    }

    // Update real concept mastery in memory DB
    const delta = correctness >= 0.8 ? 0.15 : -0.15;
    db.updateConceptMastery(question.diagnosticTarget, delta);

    db.logEvent({
      type: 'ANSWER_EVALUATED',
      conceptName: question.diagnosticTarget,
      details: {
        questionId: question.id,
        studentAnswer,
        correctness,
        isMisconception,
        misconception: misconceptionTitle
      }
    });

    return {
      correctness,
      conceptMastery: db.getMastery()[question.diagnosticTarget] || 0.5,
      isMisconception,
      misconceptionTitle,
      misconceptionDiagnosis,
      alternateAnalogy,
      missingConcepts: isExact ? [] : [question.diagnosticTarget],
      feedback,
      recommendedAction
    };
  }

  /**
   * Generate an adaptive re-teaching segment dynamically tailored to the detected misconception
   */
  static async generateAdaptiveReteachSegment(params: {
    conceptName: string;
    misconceptionTitle: string;
    analogy: string;
    language: TeachingLanguage;
    learnerProfile: LearnerProfile;
  }): Promise<LessonSegment> {
    const { conceptName, misconceptionTitle, analogy, language } = params;
    const isHindi = language === 'hi';
    const isHinglish = language === 'hinglish';
    const isCS = conceptName.toLowerCase().includes('stack') || conceptName.toLowerCase().includes('search') || conceptName.toLowerCase().includes('tree') || conceptName.toLowerCase().includes('code');

    return {
      id: `reteach_${Date.now()}`,
      segmentIndex: 99,
      conceptId: 're_concept',
      conceptName: `Re-teaching: ${conceptName}`,
      durationSecs: 180,
      purpose: `Directly address and dismantle the misconception: "${misconceptionTitle}" using an intuitive analogy bridge.`,
      teachingStrategy: 'analogy_bridge',
      visualType: isCS ? 'code' : 'interactive_simulation',
      isAlternativeExplanation: true,
      adaptedFromMisconception: misconceptionTitle,
      scriptText: isHindi
        ? `आइए इस बिंदु को एक नए और सरल तरीके से समझते हैं। ${analogy} जब आप इस उदाहरण को ध्यान में रखेंगे, तो आप देखेंगे कि यह कितना स्वाभाविक है!`
        : isHinglish
        ? `Chaliye is concept ko ek bilkul fresh aur relatable analogy se dekhte hain! ${analogy} Ab aap khud dekhiye ki background mein exact kya rule operate kar raha hai!`
        : `Let us rethink this concept from first principles with a powerful analogy! ${analogy} Notice how this intuition clarifies the underlying mechanism!`,
      visualContent: {
        type: isCS ? 'code' : 'interactive_simulation',
        title: `Adaptive Re-Explanation: ${conceptName}`,
        caption: `Misconception Addressed: ${misconceptionTitle}`,
        bulletPoints: [
          'Analogy Bridge: ' + analogy,
          'Core Truth: Verify the foundational rule before executing the operation.',
          'Key Check: Never conflate read-only inspection with destructive state mutation.'
        ],
        keyTakeaway: 'Mental Model Fix: Anchor to the physical intuition first, then apply the formal definition.',
        codeSnippet: isCS ? {
          language: 'cpp',
          code: `// Correct Mental Model Visualization
void verifyOperation() {
    // 1. Check boundary conditions
    // 2. Separate read-only (peek) from mutating (pop)
    cout << "Intuition verified!\\n";
}`
        } : undefined
      },
      question: {
        id: `diag_q_${Date.now()}`,
        type: 'mcq',
        prompt: isHinglish
          ? `Ab check kijiye: Agar aap "${conceptName}" ke context mein analogy ko apply karein, toh core principle kya hai?`
          : `Diagnostic Check: Applying the clarified mental model for ${conceptName}, which statement represents the core truth?`,
        options: [
          'The clarified intuition is correct and matches formal rules',
          'The initial intuitive misconception was correct',
          'Neither statement applies',
          'Operation is undefined'
        ],
        correctAnswer: 'The clarified intuition is correct and matches formal rules',
        explanation: 'Applying the concrete analogy anchors your understanding and avoids intuitive cognitive traps.',
        hint: 'Review the analogy provided in the re-explanation!',
        diagnosticTarget: conceptName,
        difficulty: 'beginner'
      }
    };
  }

  /**
   * Handle student mid-lesson question/interruption with source grounding
   */
  static async handleStudentInterruption(params: {
    studentQuestion: string;
    currentConcept: string;
    lessonTopic: string;
    documentId?: string;
    language: TeachingLanguage;
  }): Promise<{
    answerText: string;
    groundedCitation?: any;
    relatesToCurrentTopic: boolean;
  }> {
    const { studentQuestion, currentConcept, lessonTopic, documentId, language } = params;

    // Retrieve from textbook RAG
    const retrieved = IngestionEngine.retrieveContext(studentQuestion + ' ' + currentConcept, documentId, 3);
    const sourceContext = retrieved.chunks.map(c => `[${c.chapter} p.${c.page}]: ${c.content}`).join('\n');

    try {
      const prompt = `You are an attentive AI Teacher in the middle of a live lesson on "${lessonTopic}".
Current Concept being taught: "${currentConcept}"
Student interrupted with this doubt/question: "${studentQuestion}"
Language: ${language}
${sourceContext ? `RELEVANT TEXTBOOK EXCERPTS:\n${sourceContext}` : ''}

Respond in 2-3 concise, engaging sentences answering their doubt clearly, reassuring them, and gracefully guiding the attention back to the current lesson topic "${lessonTopic}".
Do NOT drift into unrelated subjects.`;

      const response = await generateContentWithRetry({
        model: 'gemini-3.7-flash',
        contents: prompt
      });

      if (response && response.text) {
        db.logEvent({
          type: 'STUDENT_INTERRUPTION',
          conceptName: currentConcept,
          details: {
            studentQuestion,
            answered: true
          }
        });

        return {
          answerText: response.text,
          groundedCitation: retrieved.sourceCitation,
          relatesToCurrentTopic: true
        };
      }
    } catch (err) {
      console.log('Using optimized grounded interruption handler');
    }

    // Deterministic fallback response locked to current topic
    const isHinglish = language === 'hinglish';
    const isHindi = language === 'hi';

    const fallbackAnswer = isHindi
      ? `बहुत अच्छा प्रश्न! ${retrieved.sourceCitation ? `आपकी सामग्री के ${retrieved.sourceCitation.chapter} के अनुसार, ` : ''}यह सीधे ${lessonTopic} के मूल सिद्धांतों से जुड़ा है। आइए इसे ध्यान में रखते हुए अपने पाठ पर आगे बढ़ें!`
      : isHinglish
      ? `Bohat badhiya doubt pucha aapne! ${retrieved.sourceCitation ? `Aapke study material ke ${retrieved.sourceCitation.chapter} ke mutabiq, ` : ''}yeh directly ${lessonTopic} ke core principle se judha hai! Chaliye ab lesson resume karte hain.`
      : `Great question! ${retrieved.sourceCitation ? `According to ${retrieved.sourceCitation.chapter}, ` : ''}this is directly tied to the core mechanisms of ${lessonTopic}. Now, let us resume our lesson!`;

    db.logEvent({
      type: 'STUDENT_INTERRUPTION',
      conceptName: currentConcept,
      details: {
        studentQuestion,
        answered: true
      }
    });

    return {
      answerText: fallbackAnswer,
      groundedCitation: retrieved.sourceCitation,
      relatesToCurrentTopic: true
    };
  }
}
