// app/page.tsx
import { WelcomeContent } from '@/components/welcome'; // Placeholder component
import { ConsentForm } from '@/components/forms/consent-form';     // Placeholder component

export default function WelcomePage() {
  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold text-center">Experiment Simulator</h1>
      {/* Static content about the experiment */}
      <WelcomeContent />

      {/* Client component to handle consent and trigger participant creation */}
      <ConsentForm />
    </div>
  );
}
