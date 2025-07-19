'use client';

import { useState, useEffect } from 'react';

interface FrameworkItem {
  title: string;
  description: string;
  icon: string;
  color: string;
  bgColor: string;
}

const DecisionFramework = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const frameworkItems: FrameworkItem[] = [
    {
      title: 'FACTS',
      description: 'Statistical data from global databases',
      icon: '📊',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50 border-blue-200'
    },
    {
      title: 'INSIGHTS',
      description: 'AI-generated analysis & patterns',
      icon: '🧠',
      color: 'text-purple-600',
      bgColor: 'bg-purple-50 border-purple-200'
    },
    {
      title: 'JUDGEMENT',
      description: 'Human intuition & experience',
      icon: '👁️',
      color: 'text-green-600',
      bgColor: 'bg-green-50 border-green-200'
    }
  ];

  return (
    <div className="w-full max-w-6xl mx-auto mb-12">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-4">
          The Decision Framework
        </h2>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
          Our platform combines multiple intelligence sources to deliver comprehensive agricultural risk analysis
        </p>
      </div>

      <div className={`transition-all duration-1000 ease-out ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
        {/* Main Equation Display */}
        <div className="flex flex-col lg:flex-row items-center justify-center gap-4 lg:gap-8 mb-12">
          {/* FACTS */}
          <div className={`${frameworkItems[0].bgColor} border-2 rounded-xl p-6 w-full lg:w-48 text-center transform transition-all duration-500 hover:scale-105 hover:shadow-lg`}>
            <div className="text-4xl mb-3">{frameworkItems[0].icon}</div>
            <h3 className={`text-xl font-bold ${frameworkItems[0].color} mb-2`}>
              {frameworkItems[0].title}
            </h3>
            <p className="text-sm text-gray-600">
              {frameworkItems[0].description}
            </p>
          </div>

          {/* Plus Sign */}
          <div className="text-4xl font-bold text-gray-400 animate-pulse">
            +
          </div>

          {/* INSIGHTS */}
          <div className={`${frameworkItems[1].bgColor} border-2 rounded-xl p-6 w-full lg:w-48 text-center transform transition-all duration-500 hover:scale-105 hover:shadow-lg`}>
            <div className="text-4xl mb-3">{frameworkItems[1].icon}</div>
            <h3 className={`text-xl font-bold ${frameworkItems[1].color} mb-2`}>
              {frameworkItems[1].title}
            </h3>
            <p className="text-sm text-gray-600">
              {frameworkItems[1].description}
            </p>
          </div>

          {/* Plus Sign */}
          <div className="text-4xl font-bold text-gray-400 animate-pulse">
            +
          </div>

          {/* JUDGEMENT */}
          <div className={`${frameworkItems[2].bgColor} border-2 rounded-xl p-6 w-full lg:w-48 text-center transform transition-all duration-500 hover:scale-105 hover:shadow-lg`}>
            <div className="text-4xl mb-3">{frameworkItems[2].icon}</div>
            <h3 className={`text-xl font-bold ${frameworkItems[2].color} mb-2`}>
              {frameworkItems[2].title}
            </h3>
            <p className="text-sm text-gray-600">
              {frameworkItems[2].description}
            </p>
          </div>

          {/* Equals Sign */}
          <div className="text-4xl font-bold text-gray-400 animate-pulse">
            =
          </div>

          {/* DECISIONS */}
          <div className="bg-gradient-to-r from-orange-50 to-red-50 border-2 border-orange-200 rounded-xl p-6 w-full lg:w-48 text-center transform transition-all duration-500 hover:scale-105 hover:shadow-lg">
            <div className="text-4xl mb-3">🎯</div>
            <h3 className="text-xl font-bold text-orange-600 mb-2">
              DECISIONS
            </h3>
            <p className="text-sm text-gray-600">
              Informed agricultural choices
            </p>
          </div>
        </div>

        {/* Visual Flow Diagram */}
        <div className="hidden lg:block">
          <div className="relative">
            {/* Flow Lines */}
            <div className="absolute top-1/2 left-0 w-full h-1 bg-gradient-to-r from-blue-200 via-purple-200 to-green-200 transform -translate-y-1/2 z-0"></div>
            
            {/* Flow Indicators */}
            <div className="flex justify-between items-center relative z-10">
              <div className="w-48 h-48 bg-blue-100 rounded-full flex items-center justify-center border-4 border-blue-300">
                <div className="text-center">
                  <div className="text-3xl mb-2">📊</div>
                  <div className="text-sm font-semibold text-blue-700">Data Collection</div>
                </div>
              </div>
              
              <div className="w-48 h-48 bg-purple-100 rounded-full flex items-center justify-center border-4 border-purple-300">
                <div className="text-center">
                  <div className="text-3xl mb-2">🤖</div>
                  <div className="text-sm font-semibold text-purple-700">AI Analysis</div>
                </div>
              </div>
              
              <div className="w-48 h-48 bg-green-100 rounded-full flex items-center justify-center border-4 border-green-300">
                <div className="text-center">
                  <div className="text-3xl mb-2">👤</div>
                  <div className="text-sm font-semibold text-green-700">Human Review</div>
                </div>
              </div>
              
              <div className="w-48 h-48 bg-gradient-to-r from-orange-100 to-red-100 rounded-full flex items-center justify-center border-4 border-orange-300">
                <div className="text-center">
                  <div className="text-3xl mb-2">✅</div>
                  <div className="text-sm font-semibold text-orange-700">Final Decision</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile-friendly stacked version */}
        <div className="lg:hidden space-y-4">
          <div className="flex items-center justify-center space-x-4">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center border-2 border-blue-300">
              <div className="text-xl">📊</div>
            </div>
            <div className="text-2xl text-gray-400">→</div>
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center border-2 border-purple-300">
              <div className="text-xl">🤖</div>
            </div>
            <div className="text-2xl text-gray-400">→</div>
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center border-2 border-green-300">
              <div className="text-xl">👤</div>
            </div>
            <div className="text-2xl text-gray-400">→</div>
            <div className="w-16 h-16 bg-gradient-to-r from-orange-100 to-red-100 rounded-full flex items-center justify-center border-2 border-orange-300">
              <div className="text-xl">✅</div>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center mt-12">
          <div className="bg-white border-2 border-gray-200 rounded-xl p-6 shadow-sm">
            <h3 className="text-xl font-semibold text-gray-800 mb-3">
              Ready to Make Better Decisions?
            </h3>
            <p className="text-gray-600 mb-4">
              Start your comprehensive agricultural risk analysis below
            </p>
            <div className="w-16 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full mx-auto animate-bounce"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DecisionFramework; 