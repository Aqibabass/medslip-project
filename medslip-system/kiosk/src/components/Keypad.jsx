const Keypad = ({ tokenInput, setTokenInput, onSubmit }) => {
  const keys = [
    '1', '2', '3',
    '4', '5', '6',
    '7', '8', '9',
    'A', '0', 'B',
    'C', 'D', 'E',
    'F', 'Clear', '⌫',
  ];

  const handleKey = (key) => {
    if (key === 'Clear') {
      setTokenInput('');
    } else if (key === '⌫') {
      setTokenInput((prev) => prev.slice(0, -1));
    } else if (key === 'Submit') {
      if (tokenInput.trim()) {
        onSubmit();
      }
    } else {
      setTokenInput((prev) => prev + key);
    }
  };

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text) {
        let processedText = text.trim();
        if (processedText.toUpperCase().startsWith('MS-ATM-')) {
          processedText = processedText.substring(7);
        }
        setTokenInput(processedText);
      }
    } catch (err) {
      console.error('Failed to read clipboard:', err);
    }
  };

  return (
    <div className="flex flex-col items-center w-full max-w-lg mx-auto">
      {/* Display Area */}
      <div className="w-full bg-gray-800 rounded-xl p-6 mb-6 text-center min-h-[80px] relative">
        <p className="text-gray-400 text-sm mb-2">Enter your token number</p>
        <p className={`text-3xl font-mono tracking-wider ${
          tokenInput ? 'text-white' : 'text-gray-600'
        }`}>
          {tokenInput || 'MS-ATM-XXXX'}
        </p>
        <button
          onClick={handlePaste}
          title="Paste from clipboard"
          className="absolute top-3 right-3 bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-all active:scale-95"
        >
          Paste
        </button>
      </div>

      {/* Keypad Grid */}
      <div className="grid grid-cols-3 gap-3 w-full">
        {keys.map((key) => (
          <button
            key={key}
            onClick={() => handleKey(key)}
            className={`h-16 rounded-xl text-2xl font-bold transition-all active:scale-95 ${
              key === 'Clear' || key === '⌫'
                ? 'bg-red-600 hover:bg-red-700 text-white'
                : 'bg-gray-700 hover:bg-gray-600 text-white'
            }`}
          >
            {key}
          </button>
        ))}
      </div>

      {/* Submit Button (full width below grid) */}
      <button
        onClick={() => handleKey('Submit')}
        disabled={!tokenInput.trim()}
        className="w-full mt-4 bg-medical-green hover:bg-green-600 disabled:bg-gray-600 disabled:opacity-50 text-white py-4 rounded-xl text-2xl font-bold transition-all"
      >
        Submit Token
      </button>
    </div>
  );
};

export default Keypad;