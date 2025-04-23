import { EmailInbox, MeetingTranscript, Practice, PresentationSlide, ProductListing, PushNotifications, SearchEngine } from "@/types/stimuli";
import { emailAISummaryLonger, emailAISummaryShorter, emailInboxAISummarization, emailInboxDataLonger, emailInboxDataShorter, summarizeEmails } from "./emailInbox";
import { meetingAISummaryLonger, meetingAISummaryShorter, meetingTranscriptData, meetingTranscriptDataLonger, meetingTranscriptDataShorter, summarizeTranscripts } from "./meetingTranscription";
import { presentationAISummary, presentationAISummaryLonger, presentationAISummaryShorter, presentationSlideData, presentationSlideDataLonger, presentationSlideDataShorter, summarizeSlides } from "./presentationSlide";
import { productAISummaryLonger, productAISummaryShorter, productListingData, productListingDataLonger, productListingDataShorter, summarizeProducts } from "./productListing";
import { notificationAISummaryLonger, notificationAISummaryShorter, pushNotificationsData, pushNotificationsDataLonger, pushNotificationsDataShorter, summarizeNotifications } from "./pushNotifications";
import { searchEngineData, searchEngineDataLonger, searchEngineDataShorter, searchResultsAISummaryLonger, searchResultsAISummaryShorter, summarizeSearchResults } from "./searchEngine";
import { ContentLengths, ContentSources, TestSlugs } from "@/types/test";
import { practiceData } from "./practice";

export type Stimuli = PushNotifications | EmailInbox | MeetingTranscript | ProductListing | PresentationSlide | SearchEngine | Practice

export const stimuli: {
    [key in TestSlugs]: {
        [key in ContentSources]: {
            [key in ContentLengths]: Stimuli
        }
    }
} = {
    [TestSlugs.PRACTICE]: {
        [ContentSources.AI]: {
            [ContentLengths.Longer]: practiceData,
            [ContentLengths.Shorter]: practiceData, // Assuming same data for both lengths for practice
        },
        [ContentSources.Original]: {
            [ContentLengths.Longer]: practiceData, // Assuming same data for both lengths for practice
            [ContentLengths.Shorter]: practiceData, // Assuming same data for both lengths for practice
        },
        [ContentSources.Programmatic]: {
            [ContentLengths.Longer]: practiceData, // Assuming same data for both lengths for practice
            [ContentLengths.Shorter]: practiceData, // Assuming same data for both lengths for practice
        },
    },
    [TestSlugs.PUSH_NOTIFICATIONS]: {
        [ContentSources.AI]: {
            [ContentLengths.Longer]: notificationAISummaryLonger,
            [ContentLengths.Shorter]: notificationAISummaryShorter, // Assuming same data for both lengths for practice
        },
        [ContentSources.Original]: {
            [ContentLengths.Longer]: pushNotificationsDataLonger, // Assuming same data for both lengths for practice
            [ContentLengths.Shorter]: pushNotificationsDataShorter, // Assuming same data for both lengths for practice
        },
        [ContentSources.Programmatic]: {
            [ContentLengths.Longer]: summarizeNotifications(pushNotificationsDataLonger), // Assuming same data for both lengths for practice
            [ContentLengths.Shorter]: summarizeNotifications(pushNotificationsDataShorter), // Assuming same data for both lengths for practice
        },
    },
    [TestSlugs.EMAIL_INBOX]: {
        [ContentSources.AI]: {
            [ContentLengths.Longer]: emailAISummaryLonger,
            [ContentLengths.Shorter]: emailAISummaryShorter, // Assuming same data for both lengths for practice
        },
        [ContentSources.Original]: {
            [ContentLengths.Longer]: emailInboxDataLonger, // Assuming same data for both lengths for practice
            [ContentLengths.Shorter]: emailInboxDataShorter, // Assuming same data for both lengths for practice
        },
        [ContentSources.Programmatic]: {
            [ContentLengths.Longer]: summarizeEmails(emailInboxDataLonger), // Assuming same data for both lengths for practice
            [ContentLengths.Shorter]: summarizeEmails(emailInboxDataShorter), // Assuming same data for both lengths for practice
        },
    },
    [TestSlugs.MEETING_TRANSCRIPTION]: {
        [ContentSources.AI]: {
            [ContentLengths.Longer]: meetingAISummaryLonger,
            [ContentLengths.Shorter]: meetingAISummaryShorter, // Assuming same data for both lengths for practice
        },
        [ContentSources.Original]: {
            [ContentLengths.Longer]: meetingTranscriptDataLonger, // Assuming same data for both lengths for practice
            [ContentLengths.Shorter]: meetingTranscriptDataShorter, // Assuming same data for both lengths for practice
        },
        [ContentSources.Programmatic]: {
            [ContentLengths.Longer]: summarizeTranscripts(meetingTranscriptDataLonger), // Assuming same data for both lengths for practice
            [ContentLengths.Shorter]: summarizeTranscripts(meetingTranscriptDataShorter), // Assuming same data for both lengths for practice
        },
    },
    [TestSlugs.PRODUCT_LISTING]: {
        [ContentSources.AI]: {
            [ContentLengths.Longer]: productAISummaryLonger,
            [ContentLengths.Shorter]: productAISummaryShorter, // Assuming same data for both lengths for practice
        },
        [ContentSources.Original]: {
            [ContentLengths.Longer]: productListingDataLonger, // Assuming same data for both lengths for practice
            [ContentLengths.Shorter]: productListingDataShorter, // Assuming same data for both lengths for practice
        },
        [ContentSources.Programmatic]: {
            [ContentLengths.Longer]: summarizeProducts(productListingDataLonger), // Assuming same data for both lengths for practice
            [ContentLengths.Shorter]: summarizeProducts(productListingDataShorter), // Assuming same data for both lengths for practice
        },
    },
    [TestSlugs.PRESENTATION_SLIDE]: {
        [ContentSources.AI]: {
            [ContentLengths.Longer]: presentationAISummaryLonger,
            [ContentLengths.Shorter]: presentationAISummaryShorter, // Assuming same data for both lengths for practice
        },
        [ContentSources.Original]: {
            [ContentLengths.Longer]: presentationSlideDataLonger, // Assuming same data for both lengths for practice
            [ContentLengths.Shorter]: presentationSlideDataShorter, // Assuming same data for both lengths for practice
        },
        [ContentSources.Programmatic]: {
            [ContentLengths.Longer]: summarizeSlides(presentationSlideDataLonger), // Assuming same data for both lengths for practice
            [ContentLengths.Shorter]: summarizeSlides(presentationSlideDataShorter), // Assuming same data for both lengths for practice
        },
    },
    [TestSlugs.SEARCH_ENGINE]: {
        [ContentSources.AI]: {
            [ContentLengths.Longer]: searchResultsAISummaryLonger,
            [ContentLengths.Shorter]: searchResultsAISummaryShorter, // Assuming same data for both lengths for practice
        },
        [ContentSources.Original]: {
            [ContentLengths.Longer]: searchEngineDataLonger, // Assuming same data for both lengths for practice
            [ContentLengths.Shorter]: searchEngineDataShorter, // Assuming same data for both lengths for practice
        },
        [ContentSources.Programmatic]: {
            [ContentLengths.Longer]: summarizeSearchResults(searchEngineDataLonger), // Assuming same data for both lengths for practice
            [ContentLengths.Shorter]: summarizeSearchResults(searchEngineDataShorter), // Assuming same data for both lengths for practice
        },
    },
};