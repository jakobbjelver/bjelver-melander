import { EmailInbox, MeetingTranscript, PresentationSlide, ProductListing, PushNotifications, SearchEngine } from "@/types/stimuli";
import { contentSources } from "../db/schema";
import { emailInboxAISummarization, emailInboxData, summarizeEmails } from "./emailInbox";
import { meetingAISummary, meetingTranscriptData, summarizeTranscripts } from "./meetingTranscription";
import { presentationAISummary, presentationSlideData, summarizeSlides } from "./presentationSlide";
import { productAISummary, productListingData, summarizeProducts } from "./productListing";
import { notificationAISummary, notificationProgrammaticSummary, pushNotificationsData } from "./pushNotifications";
import { searchEngineData, searchResultsAISummary, summarizeSearchResults } from "./searchEngine";

enum TestSlug {
    PUSH_NOTIFICATIONS = 'push-notifications',
    SEARCH_ENGINE = 'search-engine',
    EMAIL_INBOX = 'email-inbox',
    PRODUCT_LISTING = 'product-listing',
    MEETING_TRANSCRIPTION = 'meeting-transcription',
    PRESENTATION_SLIDE = 'presentation-slide',
}

export type Stimuli = PushNotifications | EmailInbox | MeetingTranscript | ProductListing | PresentationSlide | SearchEngine

export const stimuli: { [key in TestSlug]: { [key in contentSources]: Stimuli } } = {
        [TestSlug.PUSH_NOTIFICATIONS]: {
            [contentSources.AI]: notificationAISummary,
            [contentSources.Original]: pushNotificationsData,
            [contentSources.Programmatic]: notificationProgrammaticSummary,
        },
        [TestSlug.EMAIL_INBOX]: {
            [contentSources.AI]: emailInboxAISummarization,
            [contentSources.Original]: emailInboxData,
            [contentSources.Programmatic]: summarizeEmails(emailInboxData),
        },
        [TestSlug.MEETING_TRANSCRIPTION]: {
            [contentSources.AI]: meetingAISummary,
            [contentSources.Original]: meetingTranscriptData,
            [contentSources.Programmatic]: summarizeTranscripts(meetingTranscriptData),
        },
        [TestSlug.PRODUCT_LISTING]: {
            [contentSources.AI]: productAISummary,
            [contentSources.Original]: productListingData,
            [contentSources.Programmatic]: summarizeProducts(productListingData),
        },
        [TestSlug.PRESENTATION_SLIDE]: {
            [contentSources.AI]: presentationAISummary,
            [contentSources.Original]: presentationSlideData,
            [contentSources.Programmatic]: summarizeSlides(presentationSlideData),
        },
        [TestSlug.SEARCH_ENGINE]: {
            [contentSources.AI]: searchResultsAISummary,
            [contentSources.Original]: searchEngineData,
            [contentSources.Programmatic]: summarizeSearchResults(searchEngineData),
        },
};