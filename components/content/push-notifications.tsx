'use client'
import { NotificationAISummary, NotificationItem, NotificationProgrammaticSummary, PushNotifications } from '@/types/stimuli';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';
import { Badge } from '../ui/badge';
import {
  Bell,
  MessageCircle,
  Calendar,
  Package,
  AlertTriangle,
  User,
  HardDrive,
  Music,
  Battery,
  Globe
} from 'lucide-react';
import { ContentSources } from '@/types/test';

interface PushNotificationComponentProps {
  source: ContentSources;
  contentData: PushNotifications;
}

export function PushNotificationComponent({ source, contentData }: PushNotificationComponentProps) {

  switch (source) {
    case (ContentSources.AI):
      return <AIComponent contentData={contentData as NotificationAISummary} />
    case (ContentSources.Original):
      return <OriginalComponent contentData={contentData as NotificationItem[]} />
    case (ContentSources.Programmatic):
      return <ProgrammaticComponent contentData={contentData as NotificationProgrammaticSummary} />
    default:
      return null
  }
}

/** helpers **/
const getIcon = (category: string) => {
  switch (category) {
    case 'message': return MessageCircle;
    case 'reminder': return Calendar;
    case 'delivery': return Package;
    case 'alert': return AlertTriangle;
    case 'social': return User;
    case 'system': return HardDrive;
    case 'entertainment': return Music;
    case 'news': return Globe;
    case 'health': return Battery;
    default: return Bell;
  }
};

const priorityVariant = (p: 'low' | 'medium' | 'high') => {
  if (p === 'high') return 'destructive';
  if (p === 'medium') return 'warning';
  return 'outline';
};

/** 1) OriginalComponent **/
function OriginalComponent({ contentData }: { contentData: NotificationItem[] }) {
  return (
    <div className="space-y-2 max-w-md mx-auto">
      {contentData.map(item => {
        const Icon = getIcon(item.category);
        return (
          <Card
            key={item.id}
            className={`
              flex items-center p-4
              rounded-lg
            `}
          >
            <Icon className="w-6 h-6 text-muted-foreground" />
            <div className="ml-3 flex-1">
              <div className="flex justify-between items-center">
                <h3 className={`text-sm ${item.unread ? 'font-semibold' : 'font-normal'}`}>
                  {item.title}
                </h3>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {item.message}
              </p>
            </div>
            <div className='flex flex-col items-center justify-evenly'>
            <span className="text-xs text-muted-foreground">
              {item.timestamp}
            </span>
            <Badge variant={priorityVariant(item.priority)} className="h-7 w-7 scale-50 rounded-full" />
            </div>
          </Card>
        );
      })}
    </div>
  );
}

/** 2) ProgrammaticComponent **/
function ProgrammaticComponent({ contentData }: { contentData: NotificationProgrammaticSummary }) {
  const { meta, extractive } = contentData;

  return (
    <div className="space-y-6 max-w-lg mx-auto">
      {/* Overview stats */}
      <Card>
        <CardHeader>
          <CardTitle>Notifications Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
            <div>
              <p className="text-xl font-bold">{meta.totalItems}</p>
              <p className="text-xs text-muted-foreground">Total</p>
            </div>
            <div>
              <p className="text-xl font-bold">{meta.relevantItems}</p>
              <p className="text-xs text-muted-foreground">Relevant</p>
            </div>
            <div>
              <p className="text-xl font-bold">{meta.unreadCount}</p>
              <p className="text-xs text-muted-foreground">Unread</p>
            </div>
            <div>
              <p className="text-xl font-bold">{meta.highPriorityCount}</p>
              <p className="text-xs text-muted-foreground">High Priority</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Top extracts */}
      <Card>
        <CardHeader>
          <CardTitle>Key Highlights</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {extractive.map((e, i) => (
            <div key={i} className="flex items-start space-x-2">
              <Badge variant="secondary">{i + 1}</Badge>
              <p className="text-sm leading-snug">{e.sentence.trim()}</p>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}

/** 3) AIComponent **/
function AIComponent({ contentData }: { contentData: NotificationAISummary }) {
  const { summaryText, keyHighlights, categoryBreakdown } = contentData;

  return (
    <div className="grid md:grid-cols-2 gap-4 max-w-lg mx-auto">
      {/* Executive overview */}
      <Card className='md:col-span-2'>
        <CardHeader>
          <CardTitle>At a Glance</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm">{summaryText}</p>
        </CardContent>
      </Card>

      {/* Upcoming events */}
      <Card>
        <CardHeader>
          <CardTitle>Upcoming</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {keyHighlights.upcomingEvents.map((evt, idx) => (
            <div key={idx} className="flex items-center space-x-2">
              <Calendar className="w-5 h-5 text-primary" />
              <div>
                <p className="text-sm font-medium">{evt.app}</p>
                <p className="text-xs text-muted-foreground">{evt.note}</p>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Alerts & messages */}
      <Card>
        <CardHeader>
          <CardTitle>Urgent</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {keyHighlights.urgentAlerts.map((alert, idx) => (
            <div key={idx} className="flex items-center space-x-2">
              <AlertTriangle className="w-5 h-5 text-destructive" />
              <div>
                <p className="text-sm font-medium">{alert.app}</p>
                <p className="text-xs text-muted-foreground">{alert.note}</p>
              </div>
            </div>
          ))}
          {keyHighlights.pendingMessages.map((msg, idx) => (
            <div key={idx} className="flex items-center space-x-2">
              <MessageCircle className="w-5 h-5 text-foreground" />
              <div>
                <p className="text-sm font-medium">{msg.app}</p>
                <p className="text-xs text-muted-foreground">{msg.note}</p>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}