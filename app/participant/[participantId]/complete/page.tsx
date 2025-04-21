// app/participant/[participantId]/complete/page.tsx
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import Link from 'next/link';

// Optional: Fetch debriefing info if stored dynamically
// import { getDebriefInfo } from '@/lib/debrief';

interface CompletePageProps {
    params: Promise<{
      participantId: string;
    }>;
  }

  export default async function CompletePage({ params }: CompletePageProps) {
    // const debrief = await getDebriefInfo(); // Optional
  const { participantId } = await params;

  return (
    <div className="max-w-xl mx-auto text-center">
        <Card>
            <CardHeader>
                <CardTitle className="text-2xl font-bold">Experiment Complete!</CardTitle>
                <CardDescription>Thank you for your participation.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <p className='text-left'>
                   Your responses have been recorded anonymously. Your contribution is greatly appreciated
                   and will help advance research in AI and Decision Making Systems.
                </p>
                {/* Optional: Add debriefing information here */}
                {/*
                <div className="text-left p-4 border rounded bg-muted/50">
                    <h3 className="font-semibold mb-2">About This Study (Debrief)</h3>
                    <p className="text-sm text-muted-foreground">
                        This study aimed to investigate [...]. You were shown content that was either [...], [...], or [...].
                        We measured [...] to understand [...]. If you have further questions, please contact the researcher at [email address].
                        {debrief?.info}
                    </p>
                </div>
                */}
                <Link href="/" className="text-sm text-primary hover:underline">
                    Return to start page
                </Link>
            </CardContent>
        </Card>
    </div>
  );
}