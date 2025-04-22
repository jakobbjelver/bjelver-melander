import { TestSlug } from "../data/tests";
import { contentSources } from "../db/schema";
import { EmailInbox, emailInboxAISummarization, emailInboxData, summarizeEmails } from "./emailInbox";
import { meetingAISummary, MeetingTranscript, meetingTranscriptData, summarizeTranscripts } from "./meetingTranscription";
import { presentationAISummary, PresentationSlide, presentationSlideData, summarizeSlides } from "./presentationSlide";
import { productAISummary, ProductListing, productListingData, summarizeProducts } from "./productListing";
import { notificationAISummary, PushNotifications, pushNotificationsData, summarizeNotifications } from "./pushNotifications";
import { searchEngineData, SearchResults, searchResultsAISummary, summarizeSearchResults } from "./searchEngine";

export type Stimuli = PushNotifications | EmailInbox | MeetingTranscript | ProductListing | PresentationSlide | SearchResults

export const stimuli: { [key in TestSlug]: { [key in contentSources]: Stimuli } } = {
        [TestSlug.PUSH_NOTIFICATIONS]: {
            [contentSources.AI]: notificationAISummary,
            [contentSources.Original]: pushNotificationsData,
            [contentSources.Programmatic]: summarizeNotifications(pushNotificationsData),
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