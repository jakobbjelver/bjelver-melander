// app/page.tsx
import { WelcomeContent } from '@/components/welcome'; // Placeholder component
import { ConsentForm } from '@/components/forms/consent-form';     // Placeholder component

export default function ConsentPage() {
  return (
    <div className="max-w-2xl mx-auto space-y-6 p-5">
      {/* Static content about the experiment */}
      <WelcomeContent />

      {/* Client component to handle consent and trigger participant creation */}
      <ConsentForm />
    </div>
  );
}
