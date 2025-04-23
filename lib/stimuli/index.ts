import { EmailInbox, MeetingTranscript, Practice, PresentationSlide, ProductListing, PushNotifications, SearchEngine } from "@/types/stimuli";
import { emailInboxAISummarization, emailInboxData, summarizeEmails } from "./emailInbox";
import { meetingAISummary, meetingTranscriptData, summarizeTranscripts } from "./meetingTranscription";
import { presentationAISummary, presentationSlideData, summarizeSlides } from "./presentationSlide";
import { productAISummary, productListingData, summarizeProducts } from "./productListing";
import { notificationAISummary, notificationProgrammaticSummary, pushNotificationsData } from "./pushNotifications";
import { searchEngineData, searchResultsAISummary, summarizeSearchResults } from "./searchEngine";
import { ContentSources, TestSlugs } from "@/types/test";
import { practiceData } from "./practice";

export type Stimuli = PushNotifications | EmailInbox | MeetingTranscript | ProductListing | PresentationSlide | SearchEngine | Practice

export const stimuli: { [key in TestSlugs]: { [key in ContentSources]: Stimuli } } = {
    [TestSlugs.PRACTICE]: {
        [ContentSources.AI]: practiceData,
        [ContentSources.Original]: practiceData,
        [ContentSources.Programmatic]: practiceData,
    },
    [TestSlugs.PUSH_NOTIFICATIONS]: {
        [ContentSources.AI]: notificationAISummary,
        [ContentSources.Original]: pushNotificationsData,
        [ContentSources.Programmatic]: notificationProgrammaticSummary,
    },
    [TestSlugs.EMAIL_INBOX]: {
        [ContentSources.AI]: emailInboxAISummarization,
        [ContentSources.Original]: emailInboxData,
        [ContentSources.Programmatic]: summarizeEmails(emailInboxData),
    },
    [TestSlugs.MEETING_TRANSCRIPTION]: {
        [ContentSources.AI]: meetingAISummary,
        [ContentSources.Original]: meetingTranscriptData,
        [ContentSources.Programmatic]: summarizeTranscripts(meetingTranscriptData),
    },
    [TestSlugs.PRODUCT_LISTING]: {
        [ContentSources.AI]: productAISummary,
        [ContentSources.Original]: productListingData,
        [ContentSources.Programmatic]: summarizeProducts(productListingData),
    },
    [TestSlugs.PRESENTATION_SLIDE]: {
        [ContentSources.AI]: presentationAISummary,
        [ContentSources.Original]: presentationSlideData,
        [ContentSources.Programmatic]: summarizeSlides(presentationSlideData),
    },
    [TestSlugs.SEARCH_ENGINE]: {
        [ContentSources.AI]: searchResultsAISummary,
        [ContentSources.Original]: searchEngineData,
        [ContentSources.Programmatic]: summarizeSearchResults(searchEngineData),
    },
};