import Keypad from '../components/Keypad';

const ATM = ({ tokenInput, setTokenInput, onValidate }) => (
  <div className="flex flex-col items-center justify-center w-full px-4">
    <div className="text-center mb-8">
      <div className="bg-green-900/30 border border-medical-green/30 rounded-xl p-6 mb-4 inline-block">
        <p className="text-4xl font-bold text-medical-green tracking-wider font-mono">
          TOKEN ENTRY
        </p>
      </div>
      <p className="text-gray-400 text-lg">Enter or scan your token number below</p>
    </div>
    <Keypad tokenInput={tokenInput} setTokenInput={setTokenInput} onSubmit={onValidate} />
  </div>
);

export default ATM;