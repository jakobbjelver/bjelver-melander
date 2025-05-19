'use client';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { useRouter } from 'next/navigation';
import { Question } from '@/lib/data/questionnaire';
import { toast } from 'sonner';

interface QuestionnaireFormProps {
  questions: Question[];
  participantId: string;
  questionnaireType: 'pre' | 'post';
  action: (formData: FormData) => Promise<{ error?: string; nextPath?: string }>; // Server action signature
}

export function QuestionnaireForm({ questions, participantId, questionnaireType, action }: QuestionnaireFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

   const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);

    const formData = new FormData(event.currentTarget);
    formData.append('participantId', participantId);
    formData.append('questionnaireType', questionnaireType);

    try {
      const result = await action(formData); // Call the server action

      if (result.error) {
        toast.error(result.error)
        setIsLoading(false);
      } else if (result.nextPath) {
        // Navigate on success
        router.push(result.nextPath);
      } else {
        // Handle case where action succeeds but provides no path (shouldn't happen here)
         toast.error('Unexpected response from server.')
         setIsLoading(false);
      }
    } catch (err) {
      console.error(err);
      toast.error('An unexpected error occurred saving responses.')
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 grid">
      {questions.map((q, index) => (
        <div key={q.id} className="p-4 border rounded-md">
          <Label className="font-semibold text-base mb-4 block">{index + 1}. {q.text}</Label>
          {q.type === 'likert7' && (
            <RadioGroup name={q.id} required className="flex md:flex-wrap flex-col md:flex-row justify-between gap-2">
              {[1, 2, 3, 4, 5, 6, 7].map((value) => (
                <div key={value} className="flex flex-col items-center space-y-1">
                   <RadioGroupItem value={String(value)} id={`${q.id}-${value}`} />
                   <Label htmlFor={`${q.id}-${value}`} className="text-xs text-muted-foreground">
                    {!q.options && (value === 1 ? 'Strongly Disagree' : value === 7 ? 'Strongly Agree' : value)}
                    {q.options && (q.options[value - 1] || value)}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          )}
          </div>
        ))}
    
        <Button type="submit" disabled={isLoading} size={'lg'} className='max-w-md md:max-w-sm w-full justify-self-center'>
          {isLoading ? 'Submitting...' : 'Submit Answers'}
        </Button>
      </form>
    );
  }
  