import Keypad from '../components/Keypad';

const ATM = ({ tokenInput, setTokenInput, onValidate }) => (
  <div className="flex flex-col items-center justify-center w-full">
    <div className="text-center mb-6 sm:mb-8 lg:mb-10">
      <div className="kiosk-glass rounded-xl sm:rounded-2xl p-4 sm:p-6 lg:p-8 mb-4 sm:mb-6 inline-block">
        <p className="text-2xl sm:text-3xl lg:text-4xl kiosk:text-5xl font-bold text-emerald-400 tracking-wider font-mono">
          TOKEN ENTRY
        </p>
      </div>
      <p className="text-gray-400 text-sm sm:text-base lg:text-lg">
        Enter or scan your token number below
      </p>
    </div>
    <Keypad tokenInput={tokenInput} setTokenInput={setTokenInput} onSubmit={onValidate} />
  </div>
);

export default ATM;