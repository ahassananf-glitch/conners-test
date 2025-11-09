import React, { useState, useEffect } from 'react';
import { RATING_OPTIONS } from '../constants';
import type { Question, Answers, Section } from '../types';

interface QuestionnaireStepProps {
  section: Section;
  questions: Question[];
  onSubmit: (answers: Answers) => void;
  progress: number;
  isLastSection: boolean;
}

const ProgressBar: React.FC<{ progress: number }> = ({ progress }) => {
    return (
        <div className="w-full bg-slate-200 rounded-full h-2.5 mb-6">
            <div className="bg-blue-600 h-2.5 rounded-full transition-all duration-500" style={{ width: `${progress}%` }}></div>
        </div>
    );
};

const SingleQuestion: React.FC<{ question: Question; value: number | undefined; onChange: (value: number) => void }> = ({ question, value, onChange }) => {
    return (
        <div className="py-6 border-b border-slate-200 last:border-b-0">
            <p className="text-lg text-slate-700 mb-4">{question.text}</p>
            <div className="flex flex-wrap gap-x-6 gap-y-3">
                {RATING_OPTIONS.map(option => (
                    <label key={option.value} className="flex items-center space-x-2 cursor-pointer text-slate-600">
                        <input
                            type="radio"
                            name={question.id}
                            value={option.value}
                            checked={value === option.value}
                            onChange={() => onChange(option.value)}
                            className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-slate-300 ml-2"
                        />
                        <span>{option.label}</span>
                    </label>
                ))}
            </div>
        </div>
    );
};


export const QuestionnaireStep: React.FC<QuestionnaireStepProps> = ({ section, questions, onSubmit, progress, isLastSection }) => {
  const [localAnswers, setLocalAnswers] = useState<Answers>({});
  const [allAnswered, setAllAnswered] = useState(false);

  useEffect(() => {
    const answeredCount = Object.keys(localAnswers).length;
    setAllAnswered(answeredCount === questions.length);
  }, [localAnswers, questions.length]);

  const handleAnswerChange = (questionId: string, value: number) => {
    setLocalAnswers(prev => ({ ...prev, [questionId]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (allAnswered) {
      onSubmit(localAnswers);
    }
  };

  return (
    <div className="bg-white p-8 rounded-2xl shadow-lg animate-fade-in-up">
        <ProgressBar progress={progress} />
        <h2 className="text-2xl font-bold text-slate-800 mb-2">{section.title}</h2>
        <p className="text-slate-500 mb-8">{section.description}</p>
        <form onSubmit={handleSubmit}>
            <div className="space-y-4">
                {questions.map(q => (
                    <SingleQuestion 
                        key={q.id} 
                        question={q} 
                        value={localAnswers[q.id]}
                        onChange={(value) => handleAnswerChange(q.id, value)}
                    />
                ))}
            </div>
            <div className="mt-8 flex justify-end">
                <button
                    type="submit"
                    disabled={!allAnswered}
                    className="bg-blue-600 text-white font-bold py-3 px-8 rounded-lg shadow-md transition-all transform hover:scale-105 disabled:bg-slate-400 disabled:cursor-not-allowed disabled:scale-100 focus:outline-none focus:ring-4 focus:ring-blue-300"
                >
                    {isLastSection ? 'إنهاء وعرض النتائج' : 'القسم التالي'}
                </button>
            </div>
        </form>
    </div>
  );
};