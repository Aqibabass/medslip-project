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

  return (
    <div className="flex justify-center p-4 bg-white shadow-sm">
      <div className="flex space-x-2 sm:space-x-4">
        {steps.map((step, index) => {
          const stepNumber = index + 1;
          const isCompleted = currentStep > index;
          const isActive = currentStep === index;
          
          return (
            <div key={step.path} className="flex items-center">
              <div className="flex items-center space-x-1 sm:space-x-2">
                <div
                  className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-xs sm:text-sm font-bold transition-colors ${
                    isCompleted
                      ? 'bg-medical-green text-white'
                      : isActive
                      ? 'bg-medical-green text-white ring-2 ring-green-200'
                      : 'bg-gray-200 text-gray-500'
                  }`}
                >
                  {isCompleted ? '✓' : stepNumber}
                </div>
                <span
                  className={`text-xs sm:text-sm font-medium ${
                    isCompleted || isActive ? 'text-medical-green' : 'text-gray-400'
                  }`}
                >
                  {step.label}
                </span>
              </div>
              {index < steps.length - 1 && (
                <div
                  className={`hidden sm:block w-8 h-0.5 mx-2 ${
                    isCompleted ? 'bg-medical-green' : 'bg-gray-200'
                  }`}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ProgressStepper;