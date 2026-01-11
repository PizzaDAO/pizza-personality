import React, { useState, useRef } from 'react';
import { questions, pizzaResults, pizzaColors } from '../data/quizData';
import { EmythType, PizzaType } from '../types/quiz';
import { ArrowRight, RotateCcw, Share } from 'lucide-react';
import PieChart from './PieChart';
import MintButton from './MintButton';

const QuizGame: React.FC = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [scores, setScores] = useState({
    entrepreneur: 0,
    manager: 0,
    technician: 0
  });
  const [showResult, setShowResult] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const resultsRef = useRef<HTMLDivElement>(null);

  const handleAnswer = (answerIndex: number) => {
    const answer = questions[currentQuestion].answers[answerIndex];
    const newScores = { ...scores };

    Object.entries(answer.scores).forEach(([type, score]) => {
      newScores[type as EmythType] += score;
    });

    setScores(newScores);
    setIsTransitioning(true);

    setTimeout(() => {
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
      } else {
        setShowResult(true);
      }
      setIsTransitioning(false);
    }, 300);
  };

  const calculatePercentages = () => {
    const total = scores.entrepreneur + scores.manager + scores.technician;
    if (total === 0) {
      return { entrepreneur: 33, manager: 34, technician: 33 };
    }

    const rawPercentages = {
      entrepreneur: (scores.entrepreneur / total) * 100,
      manager: (scores.manager / total) * 100,
      technician: (scores.technician / total) * 100
    };

    // Round to integers that sum to 100
    const rounded = {
      entrepreneur: Math.round(rawPercentages.entrepreneur),
      manager: Math.round(rawPercentages.manager),
      technician: Math.round(rawPercentages.technician)
    };

    // Adjust for rounding errors
    const sum = rounded.entrepreneur + rounded.manager + rounded.technician;
    if (sum !== 100) {
      const diff = 100 - sum;
      const maxKey = Object.entries(rounded).reduce((a, b) =>
        b[1] > a[1] ? b : a
      )[0] as EmythType;
      rounded[maxKey] += diff;
    }

    return rounded;
  };

  const getPizzaType = (): PizzaType => {
    const percentages = calculatePercentages();
    const { entrepreneur: e, manager: m, technician: t } = percentages;

    // Sort to find primary and secondary
    const sorted = [
      { type: 'entrepreneur', value: e },
      { type: 'manager', value: m },
      { type: 'technician', value: t }
    ].sort((a, b) => b.value - a.value);

    const primary = sorted[0];
    const secondary = sorted[1];
    const tertiary = sorted[2];

    // Check for balanced (all within 15 points of each other)
    const maxDiff = primary.value - tertiary.value;
    if (maxDiff <= 15) {
      return 'supreme';
    }

    // Check for pure type (primary is 50%+ AND 20+ points ahead of secondary)
    if (primary.value >= 50 && (primary.value - secondary.value) >= 20) {
      if (primary.type === 'entrepreneur') return 'hawaiian';
      if (primary.type === 'manager') return 'cheese';
      if (primary.type === 'technician') return 'margherita';
    }

    // Check for blend (primary and secondary within 15 points, both significantly higher than third)
    const primarySecondaryDiff = primary.value - secondary.value;
    if (primarySecondaryDiff <= 15) {
      const types = [primary.type, secondary.type].sort().join('+');

      if (types === 'entrepreneur+manager') return 'pepperoni';
      if (types === 'entrepreneur+technician') return 'bbqChicken';
      if (types === 'manager+technician') return 'quattroFormaggi';
    }

    // Default to primary type's pizza if no blend detected
    if (primary.type === 'entrepreneur') return 'hawaiian';
    if (primary.type === 'manager') return 'cheese';
    return 'margherita';
  };

  const resetQuiz = () => {
    setCurrentQuestion(0);
    setScores({
      entrepreneur: 0,
      manager: 0,
      technician: 0
    });
    setShowResult(false);
  };

  const shareToX = () => {
    const result = pizzaResults[getPizzaType()];
    const percentages = calculatePercentages();
    const text = `I'm ${result.pizzaName}! ${result.emythType}

${percentages.entrepreneur}% Dreamer
${percentages.technician}% Artisan
${percentages.manager}% Organizer

What pizza are you? Find out at pizzadao.xyz`;
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank', 'width=550,height=420');
  };

  const progress = (currentQuestion / questions.length) * 100;
  const percentages = calculatePercentages();

  if (showResult) {
    const pizzaType = getPizzaType();
    const result = pizzaResults[pizzaType];

    return (
      <div className="min-h-screen bg-[#FF393A] flex flex-col items-center justify-start p-4 overflow-y-auto">
        {/* Logo Header */}
        <div className="w-full flex justify-center mb-6 pt-4">
          <a href="https://pizzadao.xyz" target="_blank" rel="noopener noreferrer">
            <img
              src="/PizzaDAO-Logo-White (4).png"
              alt="PizzaDAO"
              className="h-8 sm:h-10 hover:opacity-80 transition-opacity duration-300"
            />
          </a>
        </div>

        <div ref={resultsRef} className={`max-w-2xl w-full bg-white rounded-3xl shadow-2xl overflow-hidden transform transition-all duration-500 ${!isTransitioning ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}`}>
          {/* Header with pizza image */}
          <div className="flex" style={{ backgroundColor: result.color }}>
            <div className="w-1/2">
              <img
                src={result.image}
                alt={result.pizzaName}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="w-1/2 p-6 flex flex-col justify-center text-center">
              <h1 className="text-2xl font-bold text-white mb-1">You are...</h1>
              <h2 className="text-3xl font-bold text-white">{result.pizzaName}!</h2>
              <p className="text-lg text-white opacity-90 mt-1">{result.emythType}</p>
            </div>
          </div>

          <div className="p-8">
            {/* Tagline */}
            <p className="text-lg text-gray-700 mb-6 font-medium italic text-center">
              "{result.tagline}"
            </p>

            {/* Pie Chart */}
            <div className="mb-8">
              <PieChart percentages={percentages} />
            </div>

            {/* Personality Description */}
            <div className="bg-gray-100 rounded-2xl p-6 mb-6 border-2 border-gray-300">
              <p className="text-gray-700 leading-relaxed">{result.personality}</p>
            </div>

            {/* Superpower & Kryptonite */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
              <div className="bg-gray-100 rounded-2xl p-5 border-2 border-green-500">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-2xl">💪</span>
                  <h4 className="font-bold text-gray-800">Your Superpower</h4>
                </div>
                <p className="text-gray-600 text-sm leading-relaxed">{result.superpower}</p>
              </div>
              <div className="bg-gray-100 rounded-2xl p-5 border-2 border-red-500">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-2xl">⚡</span>
                  <h4 className="font-bold text-gray-800">Your Kryptonite</h4>
                </div>
                <p className="text-gray-600 text-sm leading-relaxed">{result.kryptonite}</p>
              </div>
            </div>

            {/* Balance Tip */}
            <div className="bg-gray-100 rounded-2xl p-5 mb-6 border-2 border-amber-500">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-2xl">💡</span>
                <h4 className="font-bold text-gray-800">Pro Tip</h4>
              </div>
              <p className="text-gray-600 text-sm leading-relaxed">{result.balanceTip}</p>
            </div>

            {/* Traits */}
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Your Key Traits</h3>
              <div className="flex flex-wrap gap-2">
                {result.traits.map((trait, index) => (
                  <span
                    key={index}
                    className="text-white px-4 py-2 rounded-full text-sm font-medium"
                    style={{ backgroundColor: result.color }}
                  >
                    {trait}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons - Outside screenshot area */}
        <div className="max-w-2xl w-full mt-6">
          <div className="flex flex-col gap-4">
            <MintButton
              pizzaType={pizzaType}
              percentages={percentages}
              result={result}
              resultsRef={resultsRef}
            />
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={shareToX}
                className="flex-1 bg-black hover:bg-gray-800 text-white font-bold py-4 px-8 rounded-2xl transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2"
              >
                <Share size={20} />
                Share on X
              </button>
              <button
                onClick={resetQuiz}
                className="flex-1 bg-white hover:bg-gray-100 text-black font-bold py-4 px-8 rounded-2xl transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2"
              >
                <RotateCcw size={20} />
                Take Again
              </button>
            </div>
          </div>
        </div>

        {/* Footer spacing */}
        <div className="h-8"></div>

        {/* GitHub + Google Sheets links — bottom right */}
        <div className="fixed bottom-4 right-4 flex items-center gap-3">
          <a
            href="https://docs.google.com/spreadsheets/d/11AGr4RN8RN-wZ9OyDsgXgM9RYpSxkOtH-mkWbJVHD-g/edit?gid=0#gid=0"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img
              src="https://cdn.simpleicons.org/googlesheets/000000"
              alt="Google Sheets"
              className="w-8 h-8 filter invert"
            />
          </a>
          <a
            href="https://github.com/PizzaDAO/emyth-pizza-quiz"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img
              src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg"
              alt="GitHub"
              className="w-8 h-8 filter invert"
            />
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FF393A] flex flex-col items-center justify-center p-4 relative">
      {/* Logo Header */}
      <div className="w-full flex justify-center mb-2 pt-4">
        <a href="https://pizzadao.xyz" target="_blank" rel="noopener noreferrer">
          <img
            src="/PizzaDAO-Logo-White (4).png"
            alt="PizzaDAO"
            className="h-8 sm:h-10 hover:opacity-80 transition-opacity duration-300"
          />
        </a>
      </div>

      <div className="bg-[#FF393A] p-6">
        <div className="flex items-center justify-center">
          <h1 className="text-3xl font-bold text-white text-center">What Pizza Are You?</h1>
        </div>
      </div>

      <div className="max-w-2xl w-full">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-white font-medium">Question {currentQuestion + 1} of {questions.length}</span>
            <span className="text-white font-medium">{Math.round(progress)}%</span>
          </div>
          <div className="w-full bg-white bg-opacity-30 rounded-full h-2">
            <div
              className="bg-white h-2 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>

        {/* Question Card */}
        <div className={`bg-white rounded-3xl shadow-2xl overflow-hidden transform transition-all duration-300 ${!isTransitioning ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}`}>

          <div className="p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-8 leading-relaxed">
              {questions[currentQuestion].question}
            </h2>

            <div className="space-y-4">
              {questions[currentQuestion].answers.map((answer, index) => (
                <button
                  key={index}
                  onClick={() => handleAnswer(index)}
                  className="w-full p-6 text-left bg-gray-50 hover:bg-red-50 border-2 border-transparent hover:border-red-200 rounded-2xl transition-all duration-300 transform hover:scale-105 group"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-gray-800 font-medium text-lg">{answer.text}</span>
                    <ArrowRight className="text-[#FF393A] opacity-0 group-hover:opacity-100 transition-opacity duration-300" size={20} />
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* GitHub + Google Sheets links — bottom right */}
      <div className="fixed bottom-4 right-4 flex items-center gap-3">
        <a
          href="https://docs.google.com/spreadsheets/d/11AGr4RN8RN-wZ9OyDsgXgM9RYpSxkOtH-mkWbJVHD-g/edit?gid=0#gid=0"
          target="_blank"
          rel="noopener noreferrer"
        >
          <img
            src="https://cdn.simpleicons.org/googlesheets/000000"
            alt="Google Sheets"
            className="w-8 h-8 filter invert"
          />
        </a>
        <a
          href="https://github.com/PizzaDAO/emyth-pizza-quiz"
          target="_blank"
          rel="noopener noreferrer"
        >
          <img
            src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg"
            alt="GitHub"
            className="w-8 h-8 filter invert"
          />
        </a>
      </div>
    </div>
  );
};

export default QuizGame;
