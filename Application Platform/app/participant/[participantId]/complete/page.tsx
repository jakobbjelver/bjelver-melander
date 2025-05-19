// app/participant/[participantId]/complete/page.tsx
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import Link from 'next/link';

interface CompletePageProps {
  params: Promise<{
    participantId: string;
  }>;
}

export default async function CompletePage({ params }: CompletePageProps) {
  const { participantId } = await params;

  console.log("PARTICIPANT ID: ", participantId)

  return (
    <div className="max-w-xl mx-auto text-center p-5 flex flex-col gap-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Experiment Complete!</CardTitle>
          <CardDescription>Thank you for your participation.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <p className='text-left'>
            Your responses have been recorded anonymously. Your contribution is greatly appreciated
            and will help advance research in Information Systems.
          </p>
          <p><strong>Important: </strong>If participating with an instructor, please stay on this screen and wait (you can do other things in the meantime). If doing it online by yourself, that's it!</p>
          <p>Participant ID: <code className='p-2 bg-muted rounded-md'>{participantId}</code></p>
          <br></br>
          <p className='text-left'><strong>Thank you for participating!</strong></p>
          <p className='text-left'>Kind regards,</p>
          <p className='italic text-left'>Jakob & Erik</p>
        </CardContent>
      </Card>
      <Link href="/" className="text-sm text-primary hover:underline">
        Return to start page
      </Link>
    </div>
  );
}