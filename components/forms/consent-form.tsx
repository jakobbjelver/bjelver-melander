// components/consent-form.tsx

'use client';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { createParticipant } from '@/lib/actions/participantActions'; // Placeholder Action
import { useRouter } from 'next/navigation';
import { isMobile } from 'react-device-detect';
import { toast } from 'sonner';

export function ConsentForm() {
  const [consentGiven, setConsentGiven] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async () => {
    if (!consentGiven) {
      toast.error("You must provide consent to continue.")
      return;
    }
    setIsLoading(true);
    try {
      const result = await createParticipant({ isMobile });
      if (result.error) {
        toast.error(result.error)
      } else if (result.participantId) {
        // Redirect on success
        router.push(`/participant/${result.participantId}/pre`);
      } else {
        toast.error('Could not start the experiment. Please try again.')
        console.error("Could not start the experiment: ", result.error)
      }
    } catch (err) {
      console.error(err);
      toast.error('An unexpected error occurred. Please try again.')
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4 p-4 border rounded-md">
      <div className="flex items-center space-x-2">
        <Checkbox
          id="consent"
          checked={consentGiven}
          onCheckedChange={(checked) => setConsentGiven(checked === true)}
          aria-label="Consent Checkbox"
        />
        <Label htmlFor="consent" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
          I have read the information and consent to participate.
        </Label>
      </div>
      <Button onClick={handleSubmit} disabled={isLoading || !consentGiven}>
        {isLoading ? 'Starting...' : 'Begin Experiment'}
      </Button>
    </div>
  );
}