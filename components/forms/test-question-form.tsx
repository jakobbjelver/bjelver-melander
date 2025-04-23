// components/test-question-form.tsx
'use client';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea'; // Example for text input
import { Input } from '@/components/ui/input';     // Example for number input
import { Question } from '@/lib/data/questionnaire';
import { TestResponseAction } from '@/lib/actions/responseActions';
import { useRouter } from 'next/navigation';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from 'sonner';
import { TestSlugs } from '@/types/test';

interface TestQuestionFormProps {
  questions: Question[];
  participantId: string;
  testSlug: TestSlugs;
  action: TestResponseAction; // Server action to save responses
}

export function TestQuestionForm({
  questions,
  participantId,
  testSlug,
  action,
}: TestQuestionFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);

    const formData = new FormData(event.currentTarget);
    formData.append('participantId', participantId);
    formData.append('testSlug', testSlug);

    try {
      const result = await action(formData); // Call the server action

      if (result.error) {
        toast.error(result.error)
      } else if (result.nextPath) {
        // Navigate on success
        router.push(result.nextPath);
      } else {
        toast.error('Unexpected response from server.')
      }
    } catch (err) {
      console.error(err);
      toast.error('An unexpected error occurred saving responses.')
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 grid">
      {questions.map((q, index) => (
        <div key={q.id} className="p-4 border rounded-md">
          <Label className="font-semibold text-base mb-4 block">{index + 1}. {q.text}</Label>
          {/* Render input based on question type */}
          {q.type === 'likert7' && (
            <RadioGroup name={q.id} required className="flex flex-wrap justify-between gap-2">
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
          {q.type === 'text' && ( // Example: Free text response
            <Textarea name={q.id} placeholder="Your answer..." required />
          )}
          {q.type === 'number' && ( // Example: Number input
            <Input type="number" name={q.id} placeholder="Enter a number" required />
          )}
          {q.type === 'multipleChoice' && q.options && (
            q.multipleCorrectAnswers ? (
              // Checkboxes for multiple correct answers
              <div className="flex flex-col gap-2">
                {q.options.map((option, optionIndex) => (
                  <div key={optionIndex} className="flex items-center space-x-2">
                    <Checkbox id={`${q.id}-${optionIndex}`} name={q.id} value={option} />
                    <Label htmlFor={`${q.id}-${optionIndex}`}>{option}</Label>
                  </div>
                ))}
              </div>
            ) : (
              // Radio buttons for single correct answer
              <RadioGroup name={q.id} required className="flex flex-col gap-2">
                {q.options.map((option, optionIndex) => (
                  <div key={optionIndex} className="flex items-center space-x-2">
                    <RadioGroupItem value={option} id={`${q.id}-${optionIndex}`} />
                    <Label htmlFor={`${q.id}-${optionIndex}`}>{option}</Label>
                  </div>
                ))}
              </RadioGroup>
            )
          )}
          {/* Add other question types as needed */}
        </div>
      ))}

      <Button type="submit" disabled={isLoading} size={'lg'} className='w-full max-w-md md:max-w-sm justify-self-center'>
        {isLoading ? 'Submitting...' : 'Submit & Continue'}
      </Button>
    </form>
  );
}