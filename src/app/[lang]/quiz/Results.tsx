'use client';

import { asText, Content } from '@prismicio/client';
import { FragranceType, Vote, Winner } from './types';
import { FadeIn } from '@/components/FadeIn';
import { PrismicNextImage } from '@prismicio/next';
import { HiStar } from 'react-icons/hi2';
import { PrismicText } from '@prismicio/react';
import { useTranslations } from '@/hooks/useTranslations';
import { formatPrice } from '@/utils/formatters';
import { ButtonLink } from '@/components/ButtonLink';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';

gsap.registerPlugin(useGSAP);

type ResultsProps = {
  votes: Vote;
  fragrances: Content.FragranceDocument[];
  onRetakeQuiz: () => void;
};

export const Results = ({ fragrances, onRetakeQuiz, votes }: ResultsProps) => {
  const translations = useTranslations();

  useGSAP(() => {
    gsap.set('.bottle-image', {
      filter: 'brightness(0) blur(10px)',
      // opacity: 1,
    });
    const tl = gsap.timeline();

    tl.to(
      '.result-item',
      { opacity: 1, y: 0, duration: 1, stagger: 0.5, ease: 'power2.inOut' },
      '-=0.4'
    ).to(
      '.bottle-image',
      {
        duration: 1.7,
        filter: 'brightness(1) blur(0px)',
        ease: 'sine.in',
      },
      '-=0.8'
    );
  }, []);

  const handleRetakeQuiz = () => {
    gsap.to('.results-container', {
      opacity: 0,
      y: -20,
      duration: 0.5,
      ease: 'power2.in',
      onComplete: () => {
        onRetakeQuiz();
      },
    });
  };

  const determineWinners = (votes: Vote, fragrances: Content.FragranceDocument[]): Winner[] => {
    const maxVotes = Math.max(votes.Terra, votes.Ignis, votes.Aqua);

    const winningTypes: FragranceType[] = [];

    if (votes.Terra === maxVotes) winningTypes.push('Terra');
    if (votes.Aqua === maxVotes) winningTypes.push('Aqua');
    if (votes.Ignis === maxVotes) winningTypes.push('Ignis');

    return winningTypes.slice(0, 2).map(fragranceType => {
      const fragrance = fragrances.find(f =>
        asText(f.data.title)?.toLowerCase().includes(fragranceType.toLowerCase())
      );

      return {
        fragranceType,
        title: asText(fragrance?.data.title) || fragranceType,
        uid: fragrance?.uid,
      };
    });
  };

  const winners = determineWinners(votes, fragrances);

  return (
    <FadeIn
      className="results-container mx-auto translate-y-5 py-10 text-center opacity-0"
      vars={{ duration: 0.8 }}
    >
      <div className="mb-10">
        <p className="mb-3 tracking-widest uppercase">
          {translations.quiz_results_eyebrow || 'Results'}
        </p>
        <h2 className="font-display mb-6 text-5xl md:text-6xl">
          {translations.quiz_results_title || 'Your Personalized Recommendation'}
        </h2>
        <p className="mb-12 text-lg text-gray-300">
          {translations.quiz_results_body ||
            'A unique selection of fragrances that are most suited to you and your personal taste'}
        </p>
      </div>

      <div className="flex flex-wrap justify-center gap-10">
        {winners.map((winner, index) => {
          const fragrance = fragrances.find(f => asText(f.data.title) === winner.title);

          if (!fragrance) return null;

          const formattedPrice = formatPrice(fragrance.data.price);

          return (
            <div
              key={index}
              className="result-item group max-w-md translate-y-5 overflow-hidden text-left opacity-0"
            >
              <div className="mt-40 mb-6 grid bg-neutral-200/10 transition-colors duration-700 group-hover:bg-neutral-200/20">
                <PrismicNextImage
                  field={fragrance.data.bottle_image}
                  className="bottle-image mx-auto -mt-40 w-full max-w-96 -rotate-12 opacity-100 blur-md transition-all duration-700 group-hover:scale-110 group-hover:rotate-0 group-hover:brightness-125"
                  priority
                  imgixParams={{
                    width: 450,
                    height: 450,
                    dpr: 2,
                  }}
                />

                <div className="mt-6 p-6">
                  <div className="mb-2 flex items-center">
                    <span className="inline-flex items-center gap-1 text-white">
                      <HiStar />

                      <span>4.8</span>
                    </span>
                    <span className="ml-3 text-gray-400">(120 Reviews)</span>
                  </div>

                  <h3 className="font-display mb-2 text-3xl">
                    <PrismicText field={fragrance.data.title} /> Eau De Parfum
                  </h3>
                  <p className="mb-8 text-lg font-semibold">{formattedPrice}</p>

                  <div className="mb-6">
                    <ButtonLink document={fragrance} className="w-full">
                      View Details
                    </ButtonLink>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <button
        onClick={handleRetakeQuiz}
        className="mt-12 inline-block cursor-pointer border border-white px-12 py-4 font-extrabold tracking-wider text-white uppercase"
      >
        {translations.quiz_results_retake_button || 'Retake Quiz'}
      </button>
    </FadeIn>
  );
};
