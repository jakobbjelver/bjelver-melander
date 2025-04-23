import { contentSources } from '@/lib/db/schema';
import { EmailAISummary, EmailInbox, EmailItem, EmailProgrammaticSummary } from '@/types/stimuli';

// Add or merge these imports at the top of your file
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from '../ui/card'
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from '../ui/table'
import { Badge } from '../ui/badge'
import { Progress } from '../ui/progress'
import {
  MailIcon,
  FileTextIcon,
  ClockIcon,
  PaperclipIcon,
  InfoIcon,
  ListIcon,
  Paperclip,
  CalendarIcon,
  RefreshCcwIcon,
  InboxIcon,
} from 'lucide-react'
import { format } from 'date-fns'

interface EmailInboxComponentProps {
  source: contentSources;
  contentData: EmailInbox;
}

export function EmailInboxComponent({ source, contentData }: EmailInboxComponentProps) {

  switch (source) {
    case (contentSources.AI):
      return <EmailInboxAIComponent contentData={contentData as EmailAISummary} />
    case (contentSources.Original):
      return <EmailInboxOriginalComponent contentData={contentData as EmailItem[]} />
    case (contentSources.Programmatic):
      return <EmailInboxProgrammaticComponent contentData={contentData as EmailProgrammaticSummary} />
    default:
      return null
  }
}

function EmailInboxOriginalComponent({ contentData }: { contentData: EmailItem[] }) {
  const items = contentData

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Sender</TableHead>
            <TableHead>Subject & Preview</TableHead>
            <TableHead className="text-right">Date</TableHead>
            <TableHead className="text-center">Priority</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.map((item) => (
            <TableRow key={item.id} className={!item.read ? 'font-medium' : ''}>
              <TableCell>{item.sender}</TableCell>
              <TableCell>
                <div className="flex items-center space-x-2">
                  <div>
                    <p className="max-w-xs">{item.subject}</p>
                    <p className="text-sm text-muted-foreground max-w-xs">{item.preview}</p>
                  </div>
                  {item.hasAttachment && (
                    <Paperclip className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                  )}
                </div>
              </TableCell>
              <TableCell className="text-right whitespace-nowrap">
                <span className="hidden sm:inline">{item.date}, </span>
                {item.timestamp}
              </TableCell>
              <TableCell className="text-center">
                <Badge
                  className='w-6 h-6 scale-50 rounded-full'
                  variant={
                    item.priority === 'high'
                      ? 'destructive'
                      : item.priority === 'medium'
                        ? 'warning'
                        : 'info'
                  }
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

function EmailInboxAIComponent({ contentData }: { contentData: EmailAISummary }) {
  const {
    overview,
    pendingRequests,
    upcomingCommitments,
    statusUpdates,
    irrelevantCount,
  } = contentData

  // pull out pending requests and status updates (limit to 3 each if you like)
  const topRequests = pendingRequests.items.slice(0, 3)
  const topStatuses = statusUpdates.slice(0, 3)

  return (
    <div className="grid grid-flow-row gap-4">
      {/* Overview Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <InfoIcon className="w-5 h-5 text-indigo-600" />
            <span>Inbox Overview</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-700">{overview}</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <InboxIcon className="w-5 h-5 text-indigo-600" />
            <span>Pending Requests <Badge className='rounded-full text-lg w-8 h-8 scale-75'>{pendingRequests.count}</Badge></span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="list-disc pl-5 space-y-1 text-sm text-gray-700">
            {topRequests.map((req, i) => (
              <li key={i}>
                <strong>{req.subject}</strong> from {req.sender}
                {req.deadline && <> — due {req.deadline}</>}
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      {/* Upcoming Commitments */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <CalendarIcon className="w-5 h-5 text-indigo-600" />
            <span>Upcoming Commitments</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="flex space-x-2 text-sm">
          {upcomingCommitments.trainingSession && (
            <Badge variant="outline">Training Session</Badge>
          )}
          {upcomingCommitments.tripConfirmation && (
            <Badge variant="outline">Trip Confirmation</Badge>
          )}
          {!upcomingCommitments.trainingSession &&
            !upcomingCommitments.tripConfirmation && (
              <span className="text-gray-500">None</span>
            )}
        </CardContent>
      </Card>

      {/* Status Updates & Irrelevant Count */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <RefreshCcwIcon className="w-5 h-5 text-indigo-600" />
            <span>Status Updates</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="list-decimal pl-5 space-y-1 text-sm text-gray-700">
            {topStatuses.map((u, i) => (
              <li key={i}>{u}</li>
            ))}
          </ul>
          <p className="mt-2 text-xs text-gray-500">
            Irrelevant messages: {irrelevantCount}
          </p>
        </CardContent>
      </Card>
    </div >
  )
}

function EmailInboxProgrammaticComponent({
  contentData,
}: {
  contentData: EmailProgrammaticSummary
}) {
  const { summary, extractive, meta } = contentData
  const { unreadCount, highPriorityCount, attachmentCount, folderCounts, totalItems, relevantItems } = meta

  return (
    <div className="space-y-4">
      {/* Extractive Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <InfoIcon className="w-5 h-5 text-green-600" />
            <span>Top Highlights</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="list-decimal pl-5 space-y-1 text-sm text-gray-700">
            {extractive.sort((a, b) => a.score - b.score).map((e, i) => (
              <li key={i}>{e.sentence}</li>
            ))}
          </ul>
        </CardContent>
      </Card>

      {/* Stats */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <ListIcon className="w-5 h-5 text-green-600" />
            <span>Quick Stats</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex space-x-3">
            <Badge variant={'outline'}>Unread <Badge className='rounded-full scale-[0.6] h-8 w-8 text-lg leading-none'>{unreadCount}</Badge></Badge>
            <Badge variant={'outline'}>High priority <Badge variant={'destructive'} className='animate-pulse rounded-full scale-[0.6] h-8 w-8 text-lg leading-none'>{highPriorityCount}</Badge></Badge>
            <Badge variant={'outline'}>Attachments <Badge className='rounded-full scale-[0.6] h-8 w-8 text-lg leading-none'>{attachmentCount}</Badge></Badge>
          </div>
          <div className="space-y-1">
            {Object.entries(folderCounts).map(([folder, count]) => (
              <div key={folder} className="flex items-center space-x-2">
                <span className="w-20 text-xs text-gray-600">{folder}</span>
                <Progress
                  value={Math.round((count / totalItems) * 100)}
                  className="h-2 flex-1"
                />
                <span className="w-6 text-right text-xs">{count}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Full Extractive Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <InfoIcon className="w-5 h-5 text-green-600" />
            <span>Overview</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-700">{summary}</p>
        </CardContent>
      </Card>
    </div>
  )
}
