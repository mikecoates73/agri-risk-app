import AnalysisForm from './components/AnalysisForm';
import ProtectedRoute from './components/ProtectedRoute';
import UserHeader from './components/UserHeader';

export default function Home() {
  return (
    <ProtectedRoute>
      <main className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          <UserHeader />
          
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Agricultural SWOT Analysis
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Generate comprehensive SWOT (Strengths, Weaknesses, Opportunities, Threats) 
              analysis for agricultural crops in specific countries using AI-powered insights.
            </p>
          </div>
          
          <AnalysisForm />
        </div>
      </main>
    </ProtectedRoute>
  );
}
