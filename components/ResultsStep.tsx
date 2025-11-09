import React from 'react';

interface ResultsStepProps {
  results: string | null;
  error: string | null;
  onRestart: () => void;
}

// A simple markdown-to-jsx parser
const MarkdownRenderer: React.FC<{ content: string }> = ({ content }) => {
    const lines = content.split('\n');
    const elements = lines.map((line, index) => {
        // Handle bolded headings
        if (line.startsWith('**') && line.endsWith('**')) {
            return <h3 key={index} className="text-xl font-bold text-slate-700 mt-6 mb-2">{line.slice(2, -2)}</h3>;
        }
        // Handle list items
        if (line.trim().startsWith('* ')) {
            return <li key={index} className="mb-2 mr-4 list-disc text-slate-600">{line.trim().slice(2)}</li>;
        }
        // Handle markdown headings
        if (line.startsWith('### ')) {
            return <h3 key={index} className="text-xl font-semibold text-slate-700 mt-4 mb-2">{line.slice(4)}</h3>;
        }
        if (line.startsWith('## ')) {
             return <h2 key={index} className="text-2xl font-bold text-slate-800 mt-6 mb-3">{line.slice(3)}</h2>;
        }
         if (line.startsWith('# ')) {
             return <h1 key={index} className="text-3xl font-bold text-slate-800 mt-6 mb-4">{line.slice(2)}</h1>;
        }
        if (line.trim() === '') {
            return null; // Don't render empty paragraphs
        }
        return <p key={index} className="text-slate-600 mb-4">{line}</p>;
    });

    // Wrap list items in a <ul>
    const groupedElements: (React.ReactElement | null)[] = [];
    let listItems: React.ReactElement[] = [];

    elements.forEach((el, index) => {
        if (el && el.type === 'li') {
            listItems.push(el);
        } else {
            if (listItems.length > 0) {
                groupedElements.push(<ul key={`ul-${index}`} className="list-outside">{listItems}</ul>);
                listItems = [];
            }
            groupedElements.push(el);
        }
    });

    if (listItems.length > 0) {
        groupedElements.push(<ul key="ul-last" className="list-outside">{listItems}</ul>);
    }

    return <>{groupedElements}</>;
};


export const ResultsStep: React.FC<ResultsStepProps> = ({ results, error, onRestart }) => {
  return (
    <div className="bg-white p-8 rounded-2xl shadow-lg animate-fade-in-up">
        <h1 className="text-3xl font-bold text-slate-800 mb-6 border-b pb-4">نتائج التقييم</h1>
        {error && (
            <div className="bg-red-100 border-r-4 border-red-500 text-red-700 p-4 rounded-lg mb-6" role="alert">
                <p className="font-bold">حدث خطأ</p>
                <p>{error}</p>
            </div>
        )}
        {results && (
            <div className="prose max-w-none text-right">
                <MarkdownRenderer content={results} />
            </div>
        )}
        <div className="mt-8 pt-6 border-t flex justify-center">
            <button
                onClick={onRestart}
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-10 rounded-lg shadow-md transition-transform transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-blue-300"
            >
                بدء تقييم جديد
            </button>
        </div>
    </div>
  );
};
