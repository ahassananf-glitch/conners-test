import type { Scores } from '../types';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  throw new Error("API_KEY environment variable is not set");
}

const OPENROUTER_API_URL = 'https://openrouter.ai/api/v1/chat/completions';
const MODEL_NAME = 'deepseek/deepseek-chat-v3.1:free';

export async function interpretConnersResults(scores: Scores): Promise<string> {
  const prompt = `
    أنت خبير في علم نفس الطفل متخصص في تقييم اضطراب فرط الحركة وتشتت الانتباه. قم بتحليل درجات مقياس كونرز للوالدين التالية وقدم تفسيرًا شاملاً وسهل الفهم لأحد الوالدين. يجب أن تكون الاستجابة باللغة العربية.

    **الدرجات:**
    - تشتت الانتباه: ${scores.inattention}
    - فرط الحركة: ${scores.hyperactivity}
    - مشاكل التعلم: ${scores.learning}
    - مشاكل الوظائف التنفيذية: ${scores.executive}
    - العدوانية/السلوك المعارض: ${scores.aggression}
    - مشاكل العلاقات مع الأقران: ${scores.peer}

    **التعليمات:**
    1.  **مقدمة:** ابدأ بعبارة افتتاحية لطيفة وداعمة.
    2.  **ملخص عام:** قدم ملخصًا موجزًا وعامًا لما تشير إليه الدرجات.
    3.  **تحليل مفصل للمقاييس الفرعية:** لكل مقياس فرعي، اشرح ما تشير إليه الدرجة بلغة بسيطة.
        - صف السلوكيات النمطية المرتبطة بالدرجات المرتفعة في ذلك المجال.
        - استخدم النقاط للتوضيح.
    4.  **استراتيجيات محتملة:** بناءً على ملف الدرجات، اقترح 2-3 استراتيجيات عامة وعملية أو مجالات تركيز للوالدين. يجب أن تكون هذه اقتراحات داعمة وليست علاجات سريرية. على سبيل المثال، بالنسبة لتشتت الانتباه، اقترح تقسيم المهام إلى خطوات أصغر.
    5.  **الخطوات التالية:** أوصِ باستشارة متخصصة. أكد على أن هذه النتائج ليست تشخيصًا.
    6.  **إخلاء مسؤولية حاسم:** اختتم بإخلاء مسؤولية واضح وبارز ينص على أن هذه الأداة هي لأغراض إعلامية فقط ولا تحل محل التقييم الرسمي من قبل أخصائي رعاية صحية مؤهل (مثل طبيب أطفال، أو أخصائي نفسي للأطفال، أو طبيب نفسي).

    قم بتنظيم استجابتك باستخدام الماركداون لتنسيق واضح (عناوين، نص غامق، نقاط).
    `;

  try {
    const response = await fetch(OPENROUTER_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`,
        'HTTP-Referer': `${window.location.origin}`,
        'X-Title': 'ADHD Symptom Assessment (Parent)',
      },
      body: JSON.stringify({
        model: MODEL_NAME,
        messages: [
          { role: 'user', content: prompt }
        ],
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Error from OpenRouter API:", errorData);
      throw new Error(`API request failed with status ${response.status}`);
    }

    const data = await response.json();
    if (!data.choices || data.choices.length === 0 || !data.choices[0].message?.content) {
      console.error("Invalid response structure from OpenRouter API:", data);
      throw new Error("Invalid response from AI model.");
    }
    
    return data.choices[0].message.content;
  } catch (error) {
    console.error("Error calling OpenRouter API:", error);
    throw new Error("فشل في الحصول على تفسير من نموذج الذكاء الاصطناعي.");
  }
}