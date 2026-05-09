import { useLocation } from 'react-router-dom';

const steps = [
  { path: '/', label: 'Details' },
  { path: '/service', label: 'Service' },
  { path: '/confirm', label: 'Confirm' },
  { path: '/token', label: 'Token' },
];

const ProgressStepper = () => {
  const location = useLocation();
  const currentPath = location.pathname;
  
  const currentStep = steps.findIndex(s => s.path === currentPath);

  // Don't show stepper on unknown paths
  if (currentStep === -1) return null;

  return (
    <div className="bg-white/80 backdrop-blur-sm border-b border-gray-100 sticky top-0 z-40">
      <div className="w-full max-w-screen-xl mx-auto px-3 sm:px-6 lg:px-8 py-2 sm:py-3">
        <div className="flex justify-center">
          <div className="flex items-center space-x-1 sm:space-x-2 lg:space-x-4">
            {steps.map((step, index) => {
              const stepNumber = index + 1;
              const isCompleted = currentStep > index;
              const isActive = currentStep === index;
              const isClickable = index <= currentStep + 1 && index > 0;
              
              return (
                <div key={step.path} className="flex items-center">
                  <div className="flex items-center space-x-1 sm:space-x-2">
                    {/* Step Circle */}
                    <div
                      className={`w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 rounded-full flex items-center justify-center text-[10px] sm:text-xs lg:text-sm font-bold transition-all duration-300 ${
                        isCompleted
                          ? 'bg-emerald-500 text-white shadow-sm shadow-emerald-200'
                          : isActive
                          ? 'bg-emerald-500 text-white ring-2 ring-emerald-200 shadow-sm shadow-emerald-200'
                          : 'bg-gray-100 text-gray-400 border border-gray-200'
                      }`}
                    >
                      {isCompleted ? (
                        <svg className="w-3 h-3 sm:w-3.5 sm:h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                        </svg>
                      ) : stepNumber}
                    </div>
                    
                    {/* Step Label - hidden on smallest screens */}
                    <span
                      className={`hidden xs:inline text-[10px] sm:text-xs lg:text-sm font-medium transition-colors ${
                        isCompleted || isActive ? 'text-emerald-600' : 'text-gray-400'
                      }`}
                    >
                      {step.label}
                    </span>
                  </div>
                  
                  {/* Connector Line */}
                  {index < steps.length - 1 && (
                    <div className="hidden xs:block sm:w-6 lg:w-10 h-0.5 mx-1 sm:mx-2 rounded-full">
                      <div className={`h-full rounded-full transition-all duration-500 ${
                        isCompleted ? 'bg-emerald-400' : 'bg-gray-200'
                      }`} style={{ width: isActive ? '50%' : '100%' }} />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProgressStepper;