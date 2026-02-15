import { useState } from 'react';
import { useAcademic } from '../context/AcademicContext';
import { useApp } from '../context/AppContext';
import { useToast } from '../context/ToastContext';
import { CLASS_OPTIONS, STREAM_OPTIONS, LANGUAGE_OPTIONS } from '../data/syllabusData';
import { generateSubjectsFromSyllabus } from '../data/defaultData';
import { Logo } from './Logo';

const SCERT_STEPS = [
  { id: 1, title: 'Select Class' },
  { id: 2, title: 'Select Stream' },
  { id: 3, title: 'Select Medium' },
];

export function Onboarding() {
  const { setProfile } = useAcademic();
  const { setData } = useApp();
  const { addToast } = useToast();
  const [step, setStep] = useState(1);
  const [classKey, setClassKey] = useState('');
  const [streamKey, setStreamKey] = useState('');
  const [language, setLanguage] = useState('');
  const [className, setClassName] = useState('');
  const [streamName, setStreamName] = useState('');
  const [customLanguage, setCustomLanguage] = useState('');

  const isCustom = classKey === 'custom';
  const maxStep = isCustom ? 2 : 3;

  const handleConfirm = () => {
    if (step < maxStep) {
      setStep(step + 1);
      return;
    }
    if (isCustom) {
      if (!className.trim()) return;
      try {
        setData({ subjects: [] });
        setProfile({
          mode: 'custom',
          className: className.trim(),
          streamName: streamName.trim() || undefined,
          language: customLanguage.trim() || undefined,
          createdAt: new Date().toISOString(),
        });
        addToast('Profile created successfully');
      } catch (e) {
        console.error(e);
        addToast('Setup failed. Please try again.', 'error');
      }
      return;
    }
    if (!classKey || !streamKey || !language) return;
    try {
      const subjects = generateSubjectsFromSyllabus(classKey, streamKey, language);
      if (subjects.length === 0) {
        addToast('Syllabus data unavailable. Please try again.', 'error');
        return;
      }
      setData({ subjects });
      setProfile({ mode: 'scert', class: classKey, stream: streamKey, language, createdAt: new Date().toISOString() });
      addToast('Profile created successfully');
      addToast(`${subjects.length} subjects generated from syllabus`);
    } catch (e) {
      console.error(e);
      addToast('Setup failed. Please try again.', 'error');
    }
  };

  const canProceed = isCustom
    ? step === 1
      ? !!classKey
      : step === 2 && className.trim().length > 0
    : (step === 1 && classKey) || (step === 2 && streamKey) || (step === 3 && classKey && streamKey && language);

  return (
    <div className="min-h-screen bg-dark-bg flex flex-col items-center justify-center p-6 animate-fade-in">
      <div className="w-full max-w-md">
        <div className="flex justify-center mb-6">
          <Logo variant="full" />
        </div>
        <h1 className="font-brand text-2xl font-bold text-dark-text text-center mb-2">Set up your profile</h1>
        <p className="text-dark-muted text-center text-sm mb-8">Choose your academic mode</p>

        <div className="flex justify-center gap-2 mb-8">
          {(isCustom ? [{ id: 1 }, { id: 2 }] : SCERT_STEPS).map((s) => (
            <div
              key={s.id}
              className={`w-2 h-2 rounded-full transition-colors ${step >= s.id ? 'bg-dark-accent' : 'bg-dark-border'}`}
              aria-hidden
            />
          ))}
        </div>

        <div className="bg-dark-card border border-dark-border rounded-lg p-6 mb-6">
          {step === 1 && (
            <>
              <h2 className="text-lg font-semibold text-dark-text mb-4">{SCERT_STEPS[0].title}</h2>
              <div className="space-y-2">
                {CLASS_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setClassKey(opt.value)}
                    className={`w-full px-4 py-3 rounded-lg border text-left transition-colors ${
                      classKey === opt.value
                        ? 'border-dark-accent bg-dark-accent/10 text-dark-accent'
                        : 'border-dark-border text-dark-text hover:bg-dark-bg/50'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </>
          )}
          {!isCustom && step === 2 && (
            <>
              <h2 className="text-lg font-semibold text-dark-text mb-4">{SCERT_STEPS[1].title}</h2>
              <div className="space-y-2">
                {STREAM_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setStreamKey(opt.value)}
                    className={`w-full px-4 py-3 rounded-lg border text-left transition-colors ${
                      streamKey === opt.value
                        ? 'border-dark-accent bg-dark-accent/10 text-dark-accent'
                        : 'border-dark-border text-dark-text hover:bg-dark-bg/50'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </>
          )}
          {!isCustom && step === 3 && (
            <>
              <h2 className="text-lg font-semibold text-dark-text mb-4">{SCERT_STEPS[2].title}</h2>
              <div className="space-y-2">
                {LANGUAGE_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setLanguage(opt.value)}
                    className={`w-full px-4 py-3 rounded-lg border text-left transition-colors ${
                      language === opt.value
                        ? 'border-dark-accent bg-dark-accent/10 text-dark-accent'
                        : 'border-dark-border text-dark-text hover:bg-dark-bg/50'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </>
          )}
          {isCustom && step === 2 && (
            <>
              <h2 className="text-lg font-semibold text-dark-text mb-4">Custom details</h2>
              <p className="text-dark-muted text-sm mb-4">You will create subjects manually. No syllabus is loaded.</p>
              <div className="space-y-3">
                <label className="block">
                  <span className="text-sm text-dark-muted block mb-1">Class name</span>
                  <input
                    type="text"
                    value={className}
                    onChange={(e) => setClassName(e.target.value)}
                    placeholder="e.g. Class 11"
                    className="w-full px-4 py-2 bg-dark-bg border border-dark-border rounded-lg text-dark-text placeholder-dark-muted focus:outline-none focus:ring-2 focus:ring-dark-accent"
                  />
                </label>
                <label className="block">
                  <span className="text-sm text-dark-muted block mb-1">Stream name (optional)</span>
                  <input
                    type="text"
                    value={streamName}
                    onChange={(e) => setStreamName(e.target.value)}
                    placeholder="e.g. Science"
                    className="w-full px-4 py-2 bg-dark-bg border border-dark-border rounded-lg text-dark-text placeholder-dark-muted focus:outline-none focus:ring-2 focus:ring-dark-accent"
                  />
                </label>
                <label className="block">
                  <span className="text-sm text-dark-muted block mb-1">Language (optional)</span>
                  <input
                    type="text"
                    value={customLanguage}
                    onChange={(e) => setCustomLanguage(e.target.value)}
                    placeholder="e.g. English"
                    className="w-full px-4 py-2 bg-dark-bg border border-dark-border rounded-lg text-dark-text placeholder-dark-muted focus:outline-none focus:ring-2 focus:ring-dark-accent"
                  />
                </label>
              </div>
            </>
          )}
        </div>

        <div className="flex gap-3">
          {step > 1 && (
            <button
              type="button"
              onClick={() => setStep(step - 1)}
              className="flex-1 px-4 py-3 border border-dark-border rounded-lg text-dark-text hover:bg-dark-card"
            >
              Back
            </button>
          )}
          <button
            type="button"
            onClick={handleConfirm}
            disabled={!canProceed}
            className={`flex-1 px-4 py-3 rounded-lg font-medium transition-opacity ${
              canProceed ? 'bg-dark-accent text-white hover:opacity-90' : 'bg-dark-border text-dark-muted cursor-not-allowed'
            }`}
          >
            {step === maxStep ? 'Finish' : 'Next'}
          </button>
        </div>
      </div>
    </div>
  );
}
