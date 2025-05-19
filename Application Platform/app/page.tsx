// app/page.tsx
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function WelcomePage() {
  return (
    <div className='mx-auto space-y-6 flex flex-col max-w-md p-5'>
      <p className='text-2xl font-bold'>Welcome</p>
      <p>This is a simulator for an experiment made for a master's thesis about the use of AI in information systems.</p>
      <p>Estimated duration: <strong>15-20 minutes</strong></p>
      <p>Continue if you wish to participate.</p>
      <Button asChild className='max-w-sm w-full md:max-w-sm mx-auto' size={'lg'}>
        <Link href={'/consent'}>Continue</Link>
      </Button>
    </div>

  );
}
