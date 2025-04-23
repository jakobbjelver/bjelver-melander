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
import { Input } from '../ui/input';

export function ConsentForm() {
  const [consentGiven, setConsentGiven] = useState(false);
  const [isControlled, setControlled] = useState(false);
  const [controlledCode, setControlledCode] = useState('');
  const [isPilot, setPilot] = useState(false);
  const [pilotCode, setPilotCode] = useState('');
  const [age, setAge] = useState<number | null>(null);

  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async () => {
    if (!consentGiven) {
      toast.error("You must provide consent to continue.")
      return;
    }

    if (!age) {
      toast.error("You must enter your age to continue.")
      return;
    }

    setIsLoading(true);
    try {
      const result = await createParticipant(age, controlledCode, pilotCode, { isMobile });
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
    <div className="space-y-8 p-8 border rounded-md flex flex-col items-center">
      <div className="flex flex-col items-start gap-6">
        <div className='flex items-center gap-2'>
          <Checkbox
            id="consent"
            checked={consentGiven}
            onCheckedChange={(checked) => setConsentGiven(checked === true)}
          />
          <Label htmlFor="consent" className="md:text-base text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
            I consent to the stated agreement above.
          </Label>
        </div>
        <div className='space-y-5'>
          <div className='flex items-center gap-2'>
            <Checkbox
              id="controlled"
              checked={isControlled}
              onCheckedChange={(checked) => setControlled(checked === true)}
            />
            <Label htmlFor="controlled" className="whitespace-pre-wrap md:text-base text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              I am in company of an experiment instructor.
              {`\n`}
              <span className='md:text-sm text-xs font-normal italic mt-2'>Only check this box if you are told to do so.</span>
            </Label>
          </div>
          {isControlled && <div>
            <Input id="controlled_code"
              placeholder='Code'
              value={controlledCode}
              onChange={(e) => setControlledCode(e.target.value)} />
            <Label htmlFor="controlled_code" className="text-sm font-normal leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              Enter assigned instructor code
            </Label>
          </div>}
        </div>
        <div className='space-y-5'>
          <div className='flex items-center gap-2'>
            <Checkbox
              id="pilot"
              checked={isPilot}
              onCheckedChange={(checked) => setPilot(checked === true)}
            />
            <Label htmlFor="pilot" className="whitespace-pre-wrap md:text-base text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              I am a pilot participant.
              {`\n`}
              <span className='md:text-sm text-xs font-normal italic mt-2'>Only check this box if you are told to do so.</span>
            </Label>
          </div>
          {isPilot && <div>
            <Input id="pilot_code"
              placeholder='Code'
              value={pilotCode}
              onChange={(e) => setPilotCode(e.target.value)} />
            <Label htmlFor="pilot_code" className="text-sm font-normal leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              Enter assigned pilot code
            </Label>
          </div>}
        </div>
        <div className='space-y-2 w-full'>
          <Label htmlFor="age" className="md:text-base text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
            Enter your age
          </Label>
          <Input id="age"
            placeholder='Age'
            className='w-full'
            value={age || ''}
            type='number'
            onChange={(e) => setAge(Number(e.target.value))} />
        </div>
      </div>
      <Button onClick={handleSubmit} disabled={isLoading || !consentGiven || !age} className='max-w-sm w-full md:max-w-sm' size={'lg'}>
        {isLoading ? 'Starting...' : 'Begin'}
      </Button>
    </div>
  );
}