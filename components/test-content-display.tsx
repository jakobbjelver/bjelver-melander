// components/test-content-display.tsx (Placeholder)
import { TestSlug } from '@/lib/data/tests';
import { NotificationTestContent } from './stimuli/notification-test-stimuli'; // Placeholder
import { StoryTestContent } from './stimuli/story-test-stimuli'; // Placeholder
// Import other specific content components like CodeTestContent...
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'; // Assuming Shadcn Card

interface TestContentDisplayProps {
  testSlug: TestSlug;
  contentData: any;
}

export function TestContentDisplay({ testSlug, contentData }: TestContentDisplayProps) {

  console.log("contentData", contentData)

  const renderContent = () => {
    switch (testSlug) {
      case TestSlug.NOTIFICATIONS:
        // Ensure contentData has the expected structure
        if (Array.isArray(contentData)) {
            return <NotificationTestContent notifications={contentData} />;
        }
        return <p>Error: Invalid notification data structure.</p>;
      case TestSlug.SHORT_STORY:
         // Ensure contentData has the expected structure
        if (contentData && typeof contentData.text === 'string') {
            return <StoryTestContent text={contentData.text} />;
        }
         return <p>Error: Invalid story data structure.</p>;
      // Add cases for other test slugs (e.g., 'code-snippet')
      // case 'code-snippet':
      //   return <CodeTestContent code={contentData.code} language={contentData.language} />;
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