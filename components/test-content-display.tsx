// components/test-content-display.tsx (Placeholder)
import { TestSlug } from '@/lib/data/tests';
// Import other specific content components like CodeTestContent...
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'; // Assuming Shadcn Card
import { Stimuli } from '@/lib/stimuli';

interface TestContentDisplayProps {
  testSlug: TestSlug;
  contentData: Stimuli;
}

export function TestContentDisplay({ testSlug, contentData }: TestContentDisplayProps) {

  console.log("contentData", contentData)

  const renderContent = () => {
    switch (testSlug) {
      case TestSlug.PUSH_NOTIFICATIONS:
        return <p>Error: Invalid notification data structure.</p>;
      case TestSlug.EMAIL_INBOX:
        return <p>Error: Invalid notification data structure.</p>;
      case TestSlug.MEETING_TRANSCRIPTION:
        return <p>Error: Invalid notification data structure.</p>;
      case TestSlug.PRESENTATION_SLIDE:
        return <p>Error: Invalid notification data structure.</p>;
      case TestSlug.PRODUCT_LISTING:
        return <p>Error: Invalid notification data structure.</p>;
      case TestSlug.SEARCH_ENGINE:
        return <p>Error: Invalid notification data structure.</p>;
      default:
        return <p>Error: Unknown test type '{testSlug}'.</p>;
    }
  };

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg font-medium">Observe and interact with the content</CardTitle>
      </CardHeader>
      <CardContent>
        {/* Render the specific test content based on the slug */}
        <div className="mt-4 min-h-[200px] flex items-center justify-center border rounded-md p-4 bg-muted/40">
          {renderContent()}
        </div>
      </CardContent>
    </Card>
  );
}