import React from 'react';

export const LoadingStep: React.FC = () => {
    return (
        <div className="bg-white p-8 rounded-2xl shadow-lg text-center flex flex-col items-center justify-center min-h-[400px]">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500 mb-6"></div>
            <h2 className="text-2xl font-bold text-slate-800 mb-2">جاري تحليل النتائج...</h2>
            <p className="text-slate-600">
                يقوم الذكاء الاصطناعي لدينا بتفسير الدرجات بعناية. قد يستغرق هذا بعض الوقت.
            </p>
        </div>
    );
};
