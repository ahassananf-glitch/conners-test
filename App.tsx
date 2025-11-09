import React, { useState, useMemo } from 'react';
import { WelcomeStep } from './components/WelcomeStep';
import { QuestionnaireStep } from './components/QuestionnaireStep';
import { ResultsStep } from './components/ResultsStep';
import { LoadingStep } from './components/LoadingStep';
import { interpretConnersResults } from './services/geminiService';
import { QUESTIONS, SECTIONS } from './constants';
import type { Answers, Scores, SectionKey } from './types';

type AppStep = 'welcome' | 'questionnaire' | 'loading' | 'results';

const App: React.FC = () => {
  const [step, setStep] = useState<AppStep>('welcome');
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
  const [answers, setAnswers] = useState<Answers>({});
  const [results, setResults] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleStart = () => {
    setStep('questionnaire');
  };

  const handleRestart = () => {
    setAnswers({});
    setResults(null);
    setError(null);
    setCurrentSectionIndex(0);
    setStep('welcome');
  };

  const calculateScores = (currentAnswers: Answers): Scores => {
      const scores: Scores = {
        inattention: 0,
        hyperactivity: 0,
        learning: 0,
        executive: 0,
        aggression: 0,
        peer: 0,
      };

      QUESTIONS.forEach(q => {
          const answerValue = currentAnswers[q.id];
          if (typeof answerValue === 'number') {
              scores[q.subscale] += answerValue;
          }
      });
      return scores;
  };

  const handleSectionComplete = async (sectionAnswers: Answers) => {
    const updatedAnswers = { ...answers, ...sectionAnswers };
    setAnswers(updatedAnswers);

    if (currentSectionIndex < SECTIONS.length - 1) {
      setCurrentSectionIndex(currentSectionIndex + 1);
    } else {
      setStep('loading');
      try {
        const scores = calculateScores(updatedAnswers);
        const interpretation = await interpretConnersResults(scores);
        setResults(interpretation);
        setStep('results');
      } catch (e) {
        console.error(e);
        setError('حدث خطأ أثناء تحليل النتائج. يرجى المحاولة مرة أخرى.');
        setStep('results'); // Show error on results page
      }
    }
  };

  const currentSectionKey = SECTIONS[currentSectionIndex].key;
  const questionsForCurrentSection = useMemo(() => 
    QUESTIONS.filter(q => q.section === currentSectionKey), 
    [currentSectionKey]
  );
  
  const progress = ((currentSectionIndex + 1) / SECTIONS.length) * 100;

  const renderStep = () => {
    const isLastSection = currentSectionIndex === SECTIONS.length - 1;

    switch (step) {
      case 'welcome':
        return <WelcomeStep onStart={handleStart} />;
      case 'questionnaire':
        return (
          <QuestionnaireStep
            key={currentSectionIndex}
            section={SECTIONS[currentSectionIndex]}
            questions={questionsForCurrentSection}
            onSubmit={handleSectionComplete}
            progress={progress}
            isLastSection={isLastSection}
          />
        );
       case 'loading':
        return <LoadingStep />;
      case 'results':
        return <ResultsStep results={results} error={error} onRestart={handleRestart} />;
      default:
        return <WelcomeStep onStart={handleStart} />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800 flex items-center justify-center p-4">
      <div className="w-full max-w-3xl mx-auto">
        {renderStep()}
      </div>
    </div>
  );
};

export default App;
