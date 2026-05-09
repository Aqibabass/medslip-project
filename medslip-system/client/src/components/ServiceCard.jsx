const ServiceCard = ({ service, onSelect, selected }) => {
  const isSelected = selected === service.name;

  return (
    <div
      onClick={() => onSelect(service)}
      className={`relative p-6 rounded-xl border-2 cursor-pointer transition-all duration-200 ${
        isSelected
          ? 'border-medical-green bg-green-50 shadow-md'
          : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm'
      }`}
    >
      <div className="text-4xl mb-3">{service.icon || '🏥'}</div>
      <h3 className={`text-lg font-bold mb-1 ${isSelected ? 'text-medical-green' : 'text-gray-800'}`}>
        {service.name}
      </h3>
      <p className="text-sm text-gray-600 mb-2">{service.desc}</p>
      <div className="flex items-center justify-between">
        {service.requiresPayment ? (
          <span className="text-sm font-semibold text-orange-600">₹{service.amount}</span>
        ) : (
          <span className="text-sm font-semibold text-green-600">Free</span>
        )}
        {isSelected && (
          <span className="bg-medical-green text-white text-xs px-2 py-1 rounded-full">
            Selected
          </span>
        )}
      </div>
    </div>
  );
};

export default ServiceCard;