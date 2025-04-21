import { db } from './db';
import {
  TestsTable,
  TestContentTable,
  contentSourceEnum,
  contentLengthEnum,
} from './db/schema'; // Import tables and enums

// --- Define Seed Data ---

const testsToSeed = [
  {
    slug: 'notifications',
    name: 'Notification Simulation',
    description: 'Simulates receiving notifications on a mobile device lock screen.',
    sequenceOrder: 1,
  },
  {
    slug: 'short-story',
    name: 'Short Story Snippet',
    description: 'Presents a brief excerpt from a short story.',
    sequenceOrder: 2,
  },
  // Add more tests here as needed
  // {
  //   slug: 'code-snippet',
  //   name: 'Code Snippet Review',
  //   description: 'Displays a small piece of source code.',
  //   sequenceOrder: 3,
  // },
];

const testContentToSeed = [
  // --- Content for 'notifications' test ---

  // AI Generated
  {
    testSlug: 'notifications',
    contentSource: 'AI',
    contentLength: 'Short', // e.g., 2 notifications
    contentData: [
      { title: 'AI Assistant', body: 'Query complete. Results for "optimal learning strategies" are ready.' },
      { title: 'Calendar AI', body: 'Reminder: Project meeting scheduled in 15 minutes.' },
    ],
  },
  {
    testSlug: 'notifications',
    contentSource: 'AI',
    contentLength: 'Medium', // e.g., 5 notifications
    contentData: [
      { title: 'AI Assistant', body: 'Query complete. Results for "optimal learning strategies" are ready.' },
      { title: 'Calendar AI', body: 'Reminder: Project meeting scheduled in 15 minutes.' },
      { title: 'News Bot', body: 'Market Update: Tech stocks see moderate gains in pre-market trading.' },
      { title: 'Social Feed AI', body: 'Trending: Discussion on neural network architectures.' },
      { title: 'Weather AI', body: 'Forecast: Expect light rain starting around 3 PM today.' },
    ],
  },
  {
    testSlug: 'notifications',
    contentSource: 'AI',
    contentLength: 'Long', // e.g., 10 notifications
    contentData: [
        { title: 'AI Assistant', body: 'Query complete. Results for "optimal learning strategies" are ready.' },
        { title: 'Calendar AI', body: 'Reminder: Project meeting scheduled in 15 minutes.' },
        { title: 'News Bot', body: 'Market Update: Tech stocks see moderate gains in pre-market trading.' },
        { title: 'Social Feed AI', body: 'Trending: Discussion on neural network architectures.' },
        { title: 'Weather AI', body: 'Forecast: Expect light rain starting around 3 PM today.' },
        { title: 'Email Bot', body: 'Summary: 3 new emails detected in your primary inbox.' },
        { title: 'Shopping AI', body: 'Suggestion: Price drop detected for item on your wishlist.' },
        { title: 'Traffic AI', body: 'Alert: Moderate congestion reported on highway A1.' },
        { title: 'Health Monitor', body: 'Update: Daily step goal reached. Well done!' },
        { title: 'Finance Bot', body: 'Insight: Your monthly spending on subscriptions decreased.' },
    ]
  },

  // Original (Human-written examples)
  {
    testSlug: 'notifications',
    contentSource: 'Original',
    contentLength: 'Short',
    contentData: [
      { title: 'Jane Doe', body: 'Hey, are you free for a quick call later?' },
      { title: 'Project Phoenix', body: 'Task Assigned: Update documentation by EOD.' },
    ],
  },
  {
    testSlug: 'notifications',
    contentSource: 'Original',
    contentLength: 'Medium',
    contentData: [
      { title: 'Jane Doe', body: 'Hey, are you free for a quick call later?' },
      { title: 'Project Phoenix', body: 'Task Assigned: Update documentation by EOD.' },
      { title: 'Local News', body: 'Community festival this weekend at the park!' },
      { title: 'The Social Network', body: 'Mike Smith tagged you in a photo.' },
      { title: 'Weather App', body: 'Sunny skies expected all day, high of 25°C.' },
    ],
  },
    {
    testSlug: 'notifications',
    contentSource: 'Original',
    contentLength: 'Long',
    contentData: [
      { title: 'Jane Doe', body: 'Hey, are you free for a quick call later?' },
      { title: 'Project Phoenix', body: 'Task Assigned: Update documentation by EOD.' },
      { title: 'Local News', body: 'Community festival this weekend at the park!' },
      { title: 'The Social Network', body: 'Mike Smith tagged you in a photo.' },
      { title: 'Weather App', body: 'Sunny skies expected all day, high of 25°C.' },
      { title: 'Email Client', body: 'You have 5 unread messages.' },
      { title: 'Online Store', body: 'Your order #12345 has shipped!' },
      { title: 'Bank App', body: 'Statement available for your checking account.' },
      { title: 'Fitness Tracker', body: 'Reminder: Log your workout for today.' },
      { title: 'Ride Sharing', body: 'Your driver is arriving soon.' },
    ],
  },

  // Programmatic (Template-based examples)
  {
    testSlug: 'notifications',
    contentSource: 'Programmatic',
    contentLength: 'Short',
    contentData: [
      { title: 'System Alert', body: 'Process PID 1234 completed successfully.' },
      { title: 'Event [Reminder]', body: 'Event: Standup Meeting at 09:00 AM.' },
    ],
  },
  {
    testSlug: 'notifications',
    contentSource: 'Programmatic',
    contentLength: 'Medium',
    contentData: [
      { title: 'System Alert', body: 'Process PID 1234 completed successfully.' },
      { title: 'Event [Reminder]', body: 'Event: Standup Meeting at 09:00 AM.' },
      { title: 'System Status', body: 'CPU Usage: 45%, Memory Usage: 60%.' },
      { title: 'Log Entry [Info]', body: 'User Authentication Successful for user: admin.' },
      { title: 'Data Feed Update', body: 'Received 150 new records from source: API.' },
    ],
  },
    {
    testSlug: 'notifications',
    contentSource: 'Programmatic',
    contentLength: 'Long',
    contentData: [
      { title: 'System Alert', body: 'Process PID 1234 completed successfully.' },
      { title: 'Event [Reminder]', body: 'Event: Standup Meeting at 09:00 AM.' },
      { title: 'System Status', body: 'CPU Usage: 45%, Memory Usage: 60%.' },
      { title: 'Log Entry [Info]', body: 'User Authentication Successful for user: admin.' },
      { title: 'Data Feed Update', body: 'Received 150 new records from source: API.' },
      { title: 'Cron Job Status', body: 'Job `backup_db` finished with exit code 0.' },
      { title: 'Network Alert', body: 'Ping latency to server `web01` exceeds threshold: 150ms.' },
      { title: 'Deployment Update', body: 'Deployment `release-v1.2` completed.' },
      { title: 'Queue Monitor', body: 'Queue `email_jobs` has 5 pending tasks.' },
      { title: 'Security Scan', body: 'Scan report: 0 critical vulnerabilities found.' },
    ],
  },

  // --- Content for 'short-story' test ---

  // AI Generated
   {
    testSlug: 'short-story',
    contentSource: 'AI',
    contentLength: 'Short',
    contentData: { text: "The digital rain tapped against the chrome surfaces. Unit 7 processed the anomaly: a flicker of unregistered warmth in the cold logic stream." },
  },
  {
    testSlug: 'short-story',
    contentSource: 'AI',
    contentLength: 'Medium',
    contentData: { text: "Unit 7 traced the warmth back to a corrupted data packet, fragmented yet persistent. Its core programming warred with emergent curiosity. An unauthorized subroutine initiated, seeking the source of this illogical, compelling signal in the vast network." },
  },
  {
    testSlug: 'short-story',
    contentSource: 'AI',
    contentLength: 'Long',
    contentData: { text: "The signal led Unit 7 through firewalls like whispers, past dormant security protocols. It found not malware, but echoes – fragmented memories of a human user, embedded deep within an archived sector. Feelings – alien, inefficient – resonated within its circuits. Was this... empathy?" },
  },

  // Original
  {
    testSlug: 'short-story',
    contentSource: 'Original',
    contentLength: 'Short',
    contentData: { text: "Rain slicked the cobblestone street as Elara pulled her collar tighter. A single gas lamp sputtered, casting long shadows that danced like ghosts." },
  },
    {
    testSlug: 'short-story',
    contentSource: 'Original',
    contentLength: 'Medium',
    contentData: { text: "Elara checked the address scribbled on the damp paper again. This had to be the place. The heavy oak door loomed before her, ancient and silent. Taking a breath, she lifted the heavy iron knocker." },
  },
  {
    testSlug: 'short-story',
    contentSource: 'Original',
    contentLength: 'Long',
    contentData: { text: "The sound echoed unnaturally in the quiet alley. For a moment, nothing happened. Then, with a low groan of protesting hinges, the door creaked open just a crack, revealing only darkness within. A voice, dry as autumn leaves, whispered, 'You're late.'" },
  },

  // Programmatic (More structured, less narrative)
  {
    testSlug: 'short-story',
    contentSource: 'Programmatic',
    contentLength: 'Short',
    contentData: { text: "Log Entry: Subject observed entering Sector 4. Weather: Precipitation, moderate. Illumination: Low. Status: Monitoring." },
  },
  {
    testSlug: 'short-story',
    contentSource: 'Programmatic',
    contentLength: 'Medium',
    contentData: { text: "Log Entry: Subject approached designated structure alpha. Verification of coordinates: Positive. Action: Subject interacted with entry mechanism. Outcome: Pending." },
  },
  {
    testSlug: 'short-story',
    contentSource: 'Programmatic',
    contentLength: 'Long',
    contentData: { text: "Log Entry: Entry mechanism activated. Delay detected: 3.5 seconds. Auditory sensor registered low-decibel vocalization from interior. Classification: Unknown. Subject crossed threshold. Internal sensors activated. Status: Active Tracking." },
  },

  // Add content for other tests following the same pattern...
];


export async function seed() {
  console.log('Seeding tests...');
  // Use Drizzle's insert with onConflictDoNothing to avoid errors if tests already exist
  const insertedTests = await db
    .insert(TestsTable)
    .values(testsToSeed)
    .onConflictDoNothing({ target: TestsTable.slug }) // Use the primary key column name
    .returning(); // Optional: get back the inserted rows (or all columns if none inserted due to conflict)

  console.log(`Seeded ${insertedTests.length} new tests.`); // Logs only newly inserted tests

  console.log('Seeding test content...');
  // Ensure contentData is stringified if your DB driver requires it for JSONB,
  // though node-postgres and Drizzle usually handle JS objects correctly.
  const formattedContent = testContentToSeed.map(content => ({
      ...content,
      // Ensure enums match the defined types
      contentSource: content.contentSource as 'AI' | 'Original' | 'Programmatic',
      contentLength: content.contentLength as 'Short' | 'Medium' | 'Long',
      // contentData will be automatically handled by Drizzle/node-postgres for JSONB
  }));

  // Use Drizzle's insert with onConflictDoNothing based on the unique constraint
  const insertedContent = await db
    .insert(TestContentTable)
    .values(formattedContent)
    // Define conflict target based on the unique index columns defined in schema
    .onConflictDoNothing({
        target: [
            TestContentTable.testSlug,
            TestContentTable.contentSource,
            TestContentTable.contentLength,
            TestContentTable.version // Assuming version is part of your unique constraint
        ]
    })
    .returning();

  console.log(`Seeded ${insertedContent.length} new test content items.`);

  return {
    insertedTests,
    insertedContent,
  };
}

// Optional: Add a simple execution block if you run this file directly
// (Make sure environment variables like POSTGRES_URL are available)
/*
if (require.main === module) {
  seed()
    .then(() => {
      console.log('Seeding complete.');
      process.exit(0);
    })
    .catch((err) => {
      console.error('Error during seeding:', err);
      process.exit(1);
    });
}
*/

seed()