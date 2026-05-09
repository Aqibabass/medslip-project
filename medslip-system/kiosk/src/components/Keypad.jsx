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
      setTokenInput((prev) => (prev + key).toUpperCase().slice(0, 10));
    }
  };

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text) {
        let processedText = text.trim().toUpperCase();
        if (processedText.startsWith('MS-ATM-')) {
          processedText = processedText.substring(7);
        }
        setTokenInput(processedText.slice(0, 10));
      }
    } catch (err) {
      console.error('Failed to read clipboard:', err);
    }
  };

  return (
    <div className="flex flex-col items-center w-full max-w-md mx-auto px-2 sm:px-4">
      {/* Display Area - Kiosk style */}
      <div className="w-full kiosk-glass rounded-2xl p-4 sm:p-5 lg:p-6 mb-4 sm:mb-6 text-center min-h-[80px] sm:min-h-[100px] relative">
        <p className="text-gray-400 text-xs sm:text-sm lg:text-base mb-2">Enter your token number</p>
        <p className={`text-2xl sm:text-3xl lg:text-4xl kiosk:text-5xl font-mono tracking-wider font-bold ${
          tokenInput ? 'text-white' : 'text-gray-600'
        }`}>
          {tokenInput || 'MS-ATM-XXXX'}
        </p>
        
        {/* Paste button */}
        <button
          onClick={handlePaste}
          title="Paste from clipboard"
          className="absolute top-3 right-3 bg-gray-700/50 hover:bg-gray-600/70 text-white px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all active:scale-95 border border-gray-600/30"
        >
          <span className="flex items-center gap-1.5">
            <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
            </svg>
            <span className="hidden sm:inline">Paste</span>
          </span>
        </button>
      </div>

      {/* Keypad Grid - Responsive: larger on bigger screens */}
      <div className="grid grid-cols-3 gap-2 sm:gap-3 lg:gap-4 w-full">
        {keys.map((key) => (
          <button
            key={key}
            onClick={() => handleKey(key)}
            className={`kiosk-key text-xl sm:text-2xl lg:text-3xl kiosk:text-4xl ${
              key === 'Clear' || key === '⌫'
                ? 'bg-red-600/80 hover:bg-red-500 text-white border border-red-500/30 active:bg-red-400'
                : 'bg-gray-700/50 hover:bg-gray-600/70 text-white border border-gray-600/30 hover:border-gray-500/50 active:bg-gray-500/70'
            } shadow-lg active:scale-95 hover:shadow-xl flex items-center justify-center`}
          >
            {key === '⌫' ? (
              <svg className="w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2M3 12l6.414 6.414a2 2 0 001.414.586H19a2 2 0 002-2V7a2 2 0 00-2-2h-8.172a2 2 0 00-1.414.586L3 12z" />
              </svg>
            ) : key}
          </button>
        ))}
      </div>

      {/* Submit Button - Full width, larger on big screens */}
      <button
        onClick={() => handleKey('Submit')}
        disabled={!tokenInput.trim()}
        className="w-full mt-4 sm:mt-6 bg-gradient-to-r from-emerald-600 to-green-500 hover:from-emerald-500 hover:to-green-400 disabled:from-gray-600 disabled:to-gray-600 disabled:opacity-40 disabled:cursor-not-allowed text-white py-4 sm:py-5 lg:py-6 kiosk:py-8 rounded-2xl text-xl sm:text-2xl lg:text-3xl kiosk:text-4xl font-bold transition-all active:scale-[0.98] shadow-lg shadow-emerald-600/20 hover:shadow-xl hover:shadow-emerald-500/30 disabled:shadow-none min-h-[56px] sm:min-h-[64px] lg:min-h-[80px]"
      >
        <span className="flex items-center justify-center gap-3">
          <svg className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
          </svg>
          SUBMIT TOKEN
        </span>
      </button>
    </div>
  );
};

export default Keypad;