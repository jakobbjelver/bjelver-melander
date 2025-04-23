// components/test-content-display.tsx (Placeholder)
import { TestSlug } from '@/lib/data/tests';
// Import other specific content components like CodeTestContent...
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'; // Assuming Shadcn Card
import { Stimuli } from '@/lib/stimuli';
import { PushNotificationComponent } from './content/push-notifications';
import { contentSources } from '@/lib/db/schema';
import { EmailInboxComponent } from './content/email-inbox';
import { MeetingTranscriptComponent } from './content/meeting-transcript';
import { PresentationSlideComponent } from './content/presentation-slide';
import { ProductListingComponent } from './content/product-listing';
import { SearchEngineComponent } from './content/search-engine';
import { SearchEngine, ProductListing, PresentationSlide, MeetingTranscript, EmailInbox, PushNotifications } from '@/types/stimuli';

const contentLabel: { [key in TestSlug]?: string } = {
    [TestSlug.PUSH_NOTIFICATIONS]: 'Push notifications',
    [TestSlug.EMAIL_INBOX]: 'Email Inbox',
    [TestSlug.MEETING_TRANSCRIPTION]: 'Meeting Transcription',
    [TestSlug.PRODUCT_LISTING]: 'Product Listing',
    [TestSlug.SEARCH_ENGINE]: 'Search Engine',
    [TestSlug.PRESENTATION_SLIDE]: 'Slide Presentation',
};

interface TestContentDisplayProps {
  testSlug: TestSlug;
  source: contentSources
  contentData: Stimuli;
}

export function TestContentDisplay({ testSlug, source, contentData }: TestContentDisplayProps) {

  const renderContent = () => {
    switch (testSlug) {
      case TestSlug.PUSH_NOTIFICATIONS:
        return <PushNotificationComponent source={source} contentData={contentData as PushNotifications}/>;
      case TestSlug.EMAIL_INBOX:
        return <EmailInboxComponent source={source} contentData={contentData as EmailInbox}/>;
      case TestSlug.MEETING_TRANSCRIPTION:
        return <MeetingTranscriptComponent source={source} contentData={contentData as MeetingTranscript}/>;
      case TestSlug.PRESENTATION_SLIDE:
        return <PresentationSlideComponent source={source} contentData={contentData as PresentationSlide}/>;
      case TestSlug.PRODUCT_LISTING:
        return <ProductListingComponent source={source} contentData={contentData as ProductListing}/>;
      case TestSlug.SEARCH_ENGINE:
        return <SearchEngineComponent source={source} contentData={contentData as SearchEngine}/>;
      default:
        return <p>Error: Unknown test type '{testSlug}'.</p>;
    }
  };

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg font-medium">{contentLabel[testSlug]}</CardTitle>
      </CardHeader>
      <CardContent className='md:p-4 p-2'>
        <div className="mt-4 min-h-[200px] flex items-center justify-center border rounded-md p-4 bg-muted/40">
          {renderContent()}
        </div>
      </CardContent>
    </Card>
  );
}