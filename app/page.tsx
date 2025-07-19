import AnalysisForm from './components/AnalysisForm';
import DecisionFramework from './components/DecisionFramework';
import ProtectedRoute from './components/ProtectedRoute';
import Header from './components/Header';
import UserHeader from './components/UserHeader';

export default function Home() {
  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="py-8">
          <div className="container mx-auto px-4">
            <UserHeader />
            <div className="text-center mb-8">
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Generate comprehensive risk analysis for agricultural crops in specific countries 
                using AI-powered insights, weather data, and market statistics.
              </p>
            </div>

            {/* Decision Framework Component */}
            <DecisionFramework />
            
            <AnalysisForm />
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}
