import { TestSlug } from "../data/tests";
import { contentSources } from "../db/schema";
import { emailInboxAISummarization, emailInboxData, summarizeEmails } from "./emailInbox";
import { meetingTranscriptData, summarizeTranscripts } from "./meetingTranscription";
import { presentationSlideData, summarizeSlides } from "./presentationSlide";
import { productListingData, summarizeProducts } from "./productListing";
import { pushNotificationsData, summarizeNotifications } from "./pushNotifications";
import { searchEngineData, summarizeSearchResults } from "./searchEngine";

export const stimuli: { [key in TestSlug]?: { [key in contentSources]: any } } = {
        [TestSlug.PUSH_NOTIFICATIONS]: {
            [contentSources.AI]: {},
            [contentSources.Original]: pushNotificationsData,
            [contentSources.Programmatic]: summarizeNotifications(pushNotificationsData),
        },
        [TestSlug.EMAIL_INBOX]: {
            [contentSources.AI]: emailInboxAISummarization,
            [contentSources.Original]: emailInboxData,
            [contentSources.Programmatic]: summarizeEmails(emailInboxData),
        },
        [TestSlug.MEETING_TRANSCRIPTION]: {
            [contentSources.AI]: {},
            [contentSources.Original]: meetingTranscriptData,
            [contentSources.Programmatic]: summarizeTranscripts(meetingTranscriptData),
        },
        [TestSlug.PRODUCT_LISTING]: {
            [contentSources.AI]: {},
            [contentSources.Original]: productListingData,
            [contentSources.Programmatic]: summarizeProducts(productListingData),
        },
        [TestSlug.PRESENTATION_SLIDE]: {
            [contentSources.AI]: {},
            [contentSources.Original]: presentationSlideData,
            [contentSources.Programmatic]: summarizeSlides(presentationSlideData),
        },
        [TestSlug.SEARCH_ENGINE]: {
            [contentSources.AI]: {},
            [contentSources.Original]: searchEngineData,
            [contentSources.Programmatic]: summarizeSearchResults(searchEngineData),
        },
};