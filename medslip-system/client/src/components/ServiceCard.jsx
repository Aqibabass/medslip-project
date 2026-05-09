const ServiceCard = ({ service, onSelect, selected }) => {
  const isSelected = selected === service.name;

  return (
    <div
      onClick={() => onSelect(service)}
      className={`relative p-4 sm:p-5 lg:p-6 rounded-2xl border-2 cursor-pointer transition-all duration-200 active:scale-[0.98] select-none ${
        isSelected
          ? 'border-emerald-500 bg-gradient-to-br from-green-50 to-emerald-50 shadow-lg shadow-green-200/50'
          : 'border-gray-100 bg-white hover:border-gray-200 hover:shadow-md shadow-sm'
      }`}
    >
      {/* Icon */}
      <div className="text-3xl sm:text-4xl mb-2 sm:mb-3">{service.icon || '🏥'}</div>
      
      {/* Title */}
      <h3 className={`text-base sm:text-lg font-bold mb-1 ${
        isSelected ? 'text-emerald-700' : 'text-gray-800'
      }`}>
        {service.name}
      </h3>
      
      {/* Description */}
      <p className="text-xs sm:text-sm text-gray-500 mb-3 line-clamp-2">{service.desc}</p>
      
      {/* Footer */}
      <div className="flex items-center justify-between">
        {service.requiresPayment ? (
          <span className="text-sm font-bold text-orange-600 bg-orange-50 px-2.5 py-1 rounded-lg">
            ₹{service.amount}
          </span>
        ) : (
          <span className="text-sm font-semibold text-green-600 bg-green-50 px-2.5 py-1 rounded-lg">
            Free
          </span>
        )}
        {isSelected && (
          <span className="bg-emerald-500 text-white text-xs px-3 py-1 rounded-full font-medium shadow-sm">
            Selected ✓
          </span>
        )}
      </div>

      {/* Selected indicator */}
      {isSelected && (
        <div className="absolute top-3 right-3 w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center shadow-sm">
          <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
          </svg>
        </div>
      )}
    </div>
  );
};

export default ServiceCard;