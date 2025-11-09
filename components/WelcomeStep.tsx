import React from 'react';

interface WelcomeStepProps {
  onStart: () => void;
}

const WelcomeIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-blue-500 mb-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
);

export const WelcomeStep: React.FC<WelcomeStepProps> = ({ onStart }) => {
  return (
    <div className="bg-white p-8 rounded-2xl shadow-lg text-center animate-fade-in-up transition-all duration-500">
        <div className="flex justify-center">
            <WelcomeIcon />
        </div>
        <h1 className="text-3xl font-bold text-slate-800 mb-4">تقييم أعراض فرط الحركة وتشتت الانتباه</h1>
        <p className="text-slate-600 mb-6 max-w-xl mx-auto">
            أهلاً بك. هذه الأداة مصممة لمساعدتك على تقييم سلوكيات طفلك التي قد تكون مرتبطة باضطراب فرط الحركة وتشتت الانتباه. وهي مبنية على منهجية مقياس كونرز للتقييم.
        </p>
        <div className="bg-blue-50 border-r-4 border-blue-400 text-blue-800 p-4 rounded-lg mb-8 text-right">
            <h3 className="font-bold mb-2">إخلاء مسؤولية هام</h3>
            <p>هذه أداة معلوماتية وليست اختبارًا تشخيصيًا. تهدف النتائج إلى مساعدتك على فهم سلوكيات معينة وتسهيل الحوار مع أخصائي مؤهل. لا يمكن إجراء تشخيص رسمي إلا من قبل مقدم رعاية صحية.</p>
        </div>
        <button
            onClick={onStart}
            className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-10 rounded-lg shadow-md transition-transform transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-blue-300"
        >
            ابدأ التقييم
        </button>
    </div>
  );
};
