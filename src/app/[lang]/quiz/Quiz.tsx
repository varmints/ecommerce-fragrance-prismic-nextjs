'use client';

import { asImageSrc, Content } from '@prismicio/client';
import { StartScreen } from './StartScreen';
import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { Question } from './Question';
import { FragranceType, Vote, Votes } from './types';
import { Results } from './Results';

type QuizProps = {
  quizData: Content.QuizDocument;
  fragrances: Content.FragranceDocument[];
};

type QuizStatus = 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED';

export const Quiz = ({ quizData, fragrances }: QuizProps) => {
  const startScreenRef = useRef<HTMLDivElement>(null);

  const [quizStatus, setQuizStatus] = useState<QuizStatus>('NOT_STARTED');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [votes, setVotes] = useState<Votes>([]);

  const currentQuestion = quizData.data.questions[currentQuestionIndex];

  // Scroll to top on view change (mobile fix).
  useEffect(() => {
    const timer = setTimeout(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 100);

    return () => clearTimeout(timer);
  }, [quizStatus, currentQuestionIndex]);

  const start = () => {
    if (!startScreenRef.current) return;

    gsap.to(startScreenRef.current, {
      opacity: 0,
      y: -20,
      duration: 0.5,
      ease: 'power2.in',
      onComplete: () => {
        setQuizStatus('IN_PROGRESS');
      },
    });
  };

  const addVote = (fragranceType: FragranceType) => {
    const newVote: Vote = {
      Terra: fragranceType === 'Terra' ? 1 : 0,
      Ignis: fragranceType === 'Ignis' ? 1 : 0,
      Aqua: fragranceType === 'Aqua' ? 1 : 0,
    };

    setVotes(prev => {
      const newVotes = [...prev];
      newVotes[currentQuestionIndex] = newVote;
      return newVotes;
    });

    // Check if complete
    if (currentQuestionIndex >= quizData.data.questions.length - 1) {
      setQuizStatus('COMPLETED');
    } else {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };

  const back = () => {
    if (currentQuestionIndex > 0) {
      setVotes(prev => {
        const newVotes = [...prev];
        newVotes.pop();
        return newVotes;
      });
      setCurrentQuestionIndex(prev => prev - 1);
    } else {
      setQuizStatus('NOT_STARTED');
    }
  };

  // Preload all images
  useEffect(() => {
    quizData.data.questions.forEach(question => {
      if (question.image_aqua?.url) {
        const img = new Image();

        img.src = asImageSrc(question.image_aqua, {
          fit: 'max',
          w: 640,
        });
      }

      if (question.image_terra?.url) {
        const img = new Image();

        img.src = asImageSrc(question.image_terra, {
          fit: 'max',
          w: 640,
        });
      }
      if (question.image_ignis?.url) {
        const img = new Image();

        img.src = asImageSrc(question.image_ignis, {
          fit: 'max',
          w: 640,
        });
      }
    });
  });

  const reset = () => {
    setVotes([]);
    setCurrentQuestionIndex(0);
    setQuizStatus('NOT_STARTED');
  };

  const totalVotes: Vote = votes.reduce(
    (acc, vote) => ({
      Terra: acc.Terra + vote.Terra,
      Ignis: acc.Ignis + vote.Ignis,
      Aqua: acc.Aqua + vote.Aqua,
    }),
    { Terra: 0, Ignis: 0, Aqua: 0 }
  );

  return (
    <div className="min-h-screen">
      {quizStatus === 'NOT_STARTED' && (
        <div ref={startScreenRef}>
          <StartScreen quizData={quizData} onStart={start} />
        </div>
      )}

      {quizStatus === 'IN_PROGRESS' && (
        <Question
          question={currentQuestion}
          questionNumber={currentQuestionIndex + 1}
          totalQuestions={quizData.data.questions.length}
          onAnswerSelected={addVote}
          onBack={back}
        />
      )}

      {quizStatus === 'COMPLETED' && (
        <Results fragrances={fragrances} onRetakeQuiz={reset} votes={totalVotes} />
      )}
    </div>
  );
};
