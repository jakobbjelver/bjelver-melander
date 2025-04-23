// components/test-content-display.tsx (Placeholder)
// Import other specific content components like CodeTestContent...
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'; // Assuming Shadcn Card
import { Stimuli } from '@/lib/stimuli';
import { PushNotificationComponent } from './content/push-notifications';
import { EmailInboxComponent } from './content/email-inbox';
import { MeetingTranscriptComponent } from './content/meeting-transcript';
import { PresentationSlideComponent } from './content/presentation-slide';
import { ProductListingComponent } from './content/product-listing';
import { SearchEngineComponent } from './content/search-engine';
import { SearchEngine, ProductListing, PresentationSlide, MeetingTranscript, EmailInbox, PushNotifications, Practice } from '@/types/stimuli';
import { ContentSources, TestSlugs } from '@/types/test';
import { PracticeComponent } from './content/practice';

const contentLabel: { [key in TestSlugs]?: string } = {
    [TestSlugs.PUSH_NOTIFICATIONS]: 'Push notifications',
    [TestSlugs.EMAIL_INBOX]: 'Email Inbox',
    [TestSlugs.MEETING_TRANSCRIPTION]: 'Meeting Transcription',
    [TestSlugs.PRODUCT_LISTING]: 'Product Listing',
    [TestSlugs.SEARCH_ENGINE]: 'Search Engine',
    [TestSlugs.PRESENTATION_SLIDE]: 'Slide Presentation',
    [TestSlugs.PRACTICE]: 'Colorful Boxes',
};

interface TestContentDisplayProps {
  testSlug: TestSlugs;
  source: ContentSources
  contentData: Stimuli;
}

export function TestContentDisplay({ testSlug, source, contentData }: TestContentDisplayProps) {

  const renderContent = () => {
    switch (testSlug) {
      case TestSlugs.PUSH_NOTIFICATIONS:
        return <PushNotificationComponent source={source} contentData={contentData as PushNotifications}/>;
      case TestSlugs.EMAIL_INBOX:
        return <EmailInboxComponent source={source} contentData={contentData as EmailInbox}/>;
      case TestSlugs.MEETING_TRANSCRIPTION:
        return <MeetingTranscriptComponent source={source} contentData={contentData as MeetingTranscript}/>;
      case TestSlugs.PRESENTATION_SLIDE:
        return <PresentationSlideComponent source={source} contentData={contentData as PresentationSlide}/>;
      case TestSlugs.PRODUCT_LISTING:
        return <ProductListingComponent source={source} contentData={contentData as ProductListing}/>;
      case TestSlugs.SEARCH_ENGINE:
        return <SearchEngineComponent source={source} contentData={contentData as SearchEngine}/>;
        case TestSlugs.PRACTICE:
          return <PracticeComponent contentData={contentData as Practice}/>;
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