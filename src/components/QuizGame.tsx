import React, { useState } from 'react';
import { questions, emythResults } from '../data/quizData';
import { EmythType } from '../types/quiz';
import { ArrowRight, RotateCcw, Share } from 'lucide-react';
import PieChart from './PieChart';

const QuizGame: React.FC = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [scores, setScores] = useState({
    entrepreneur: 0,
    manager: 0,
    technician: 0
  });
  const [showResult, setShowResult] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);

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
      // Add/subtract from the largest value
      const maxKey = Object.entries(rounded).reduce((a, b) =>
        b[1] > a[1] ? b : a
      )[0] as EmythType;
      rounded[maxKey] += diff;
    }

    return rounded;
  };

  const getPrimaryType = (): EmythType => {
    const maxScore = Math.max(scores.entrepreneur, scores.manager, scores.technician);
    if (scores.entrepreneur === maxScore) return 'entrepreneur';
    if (scores.manager === maxScore) return 'manager';
    return 'technician';
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
    const result = emythResults[getPrimaryType()];
    const percentages = calculatePercentages();
    const text = `My E-Myth Pizza Personality: ${result.name}! ${result.pizzaName}

${percentages.entrepreneur}% Entrepreneur
${percentages.manager}% Manager
${percentages.technician}% Technician

What's your business archetype? Find out at pizzadao.xyz`;
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank', 'width=550,height=420');
  };

  const getPizzaImage = (emythType: EmythType): string => {
    const pizzaImages = {
      entrepreneur: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&h=400&fit=crop',
      manager: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=400&h=400&fit=crop',
      technician: 'https://images.unsplash.com/photo-1604068549290-dea0e4a305ca?w=400&h=400&fit=crop'
    };
    return pizzaImages[emythType];
  };

  const progress = ((currentQuestion + 1) / questions.length) * 100;
  const percentages = calculatePercentages();

  if (showResult) {
    const primaryType = getPrimaryType();
    const result = emythResults[primaryType];

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

        <div className={`max-w-2xl w-full bg-white rounded-3xl shadow-2xl overflow-hidden transform transition-all duration-500 ${!isTransitioning ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}`}>
          {/* Header with pizza image */}
          <div className="p-8 text-center" style={{ backgroundColor: result.color }}>
            <div className="mb-4">
              <img
                src={getPizzaImage(primaryType)}
                alt={result.pizzaName}
                className="w-32 h-32 mx-auto rounded-full object-cover shadow-lg border-4 border-white"
              />
            </div>
            <h1 className="text-2xl font-bold text-white mb-1">You are...</h1>
            <h2 className="text-3xl font-bold text-white">{result.name}!</h2>
            <p className="text-lg text-white opacity-90 mt-1">{result.pizzaName}</p>
          </div>

          <div className="p-8">
            {/* Tagline */}
            <p className="text-lg text-gray-700 mb-6 font-medium italic text-center">
              "{result.tagline}"
            </p>

            {/* Pie Chart */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 text-center">Your E-Myth Profile</h3>
              <PieChart percentages={percentages} />
            </div>

            {/* Personality Description */}
            <div className="bg-gray-50 rounded-2xl p-6 mb-6">
              <p className="text-gray-700 leading-relaxed">{result.personality}</p>
            </div>

            {/* Superpower & Kryptonite */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
              <div className="bg-green-50 rounded-xl p-4">
                <h4 className="font-semibold text-green-800 mb-2">Your Superpower</h4>
                <p className="text-green-700 text-sm">{result.superpower}</p>
              </div>
              <div className="bg-red-50 rounded-xl p-4">
                <h4 className="font-semibold text-red-800 mb-2">Your Kryptonite</h4>
                <p className="text-red-700 text-sm">{result.kryptonite}</p>
              </div>
            </div>

            {/* Balance Tip */}
            <div className="bg-blue-50 rounded-xl p-4 mb-6">
              <h4 className="font-semibold text-blue-800 mb-2">Balance Tip</h4>
              <p className="text-blue-700 text-sm">{result.balanceTip}</p>
            </div>

            {/* Traits */}
            <div className="mb-8">
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

            {/* Action Buttons */}
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
                className="flex-1 bg-[#FF393A] hover:bg-red-600 text-white font-bold py-4 px-8 rounded-2xl transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2"
              >
                <RotateCcw size={20} />
                Take Again
              </button>
            </div>
          </div>
        </div>

        {/* Footer spacing */}
        <div className="h-8"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FF393A] flex flex-col items-center justify-center p-4">
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
        <div className="flex items-center justify-center mb-4">
          <h1 className="text-3xl font-bold text-white text-center">What's Your E-Myth Pizza Type?</h1>
        </div>
        <p className="text-white text-center opacity-90 text-sm">
          Discover if you're an Entrepreneur, Manager, or Technician
        </p>
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
    </div>
  );
};

export default QuizGame;
