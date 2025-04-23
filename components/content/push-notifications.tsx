'use client'
import { NotificationAISummary, NotificationItem, NotificationProgrammaticSummary, PushNotifications } from '@/types/stimuli';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';
import { Table, TableHead, TableBody, TableRow, TableCell } from '../ui/table';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
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

import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent
} from '../ui/chart'
import { BarChart, CartesianGrid, XAxis, YAxis, Bar } from 'recharts'

enum contentSources {
    AI = 'ai',
    Original = 'original',
    Programmatic = 'programmatic'
  }

interface PushNotificationComponentProps {
    source: contentSources;
    contentData: PushNotifications;
}

export function PushNotificationComponent({ source, contentData }: PushNotificationComponentProps) {

    switch (source) {
        case (contentSources.AI):
            return <AIComponent contentData={contentData as NotificationAISummary} />
        case (contentSources.Original):
            return <OriginalComponent contentData={contentData as NotificationItem[]} />
        case (contentSources.Programmatic):
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
  return 'default';
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
              ${item.unread ? 'bg-gray-50' : ''}
              ${item.irrelevant ? 'opacity-50' : ''}
              rounded-lg
            `}
          >
            <Icon className="w-6 h-6 text-muted-foreground" />
            <div className="ml-3 flex-1">
              <div className="flex justify-between items-center">
                <h3 className={`text-sm ${item.unread ? 'font-semibold' : 'font-normal'}`}>
                  {item.title}
                </h3>
                <span className="text-xs text-muted-foreground">
                  {item.timestamp}
                </span>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {item.message}
              </p>
              <Badge variant={priorityVariant(item.priority)} className="mt-2">
                {item.priority}
              </Badge>
            </div>
          </Card>
        );
      })}
    </div>
  );
}

/** 2) ProgrammaticComponent **/
function ProgrammaticComponent({ contentData }: { contentData: NotificationProgrammaticSummary }) {
    const { summary, extractive, meta } = contentData

    // Prepare chart data
    const chartData = Object.entries(meta.categories).map(([category, count]) => ({
      category,
      count
    }))
  
    // Chart config: maps our "count" key to a label & color
    const chartConfig = {
      count: {
        label: 'Count',
        color: 'hsl(var(--chart-1))'
      }
    } satisfies ChartConfig
  
    return (
      <Card className="max-w-md md:max-w-xl mx-auto p-4 space-y-6">
        <CardHeader>
          <CardTitle>Overview</CardTitle>
        </CardHeader>
  
        <CardContent className="space-y-4">
          {/* Summary Text */}
          <p className="text-sm text-gray-700">{summary}</p>
  
          {/* Progress Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <p className="text-xs font-medium mb-1">Relevant</p>
              <Progress
                value={(meta.relevantItems / meta.totalItems) * 100}
                className="h-2"
              />
              <p className="text-xs mt-1">
                {meta.relevantItems}/{meta.totalItems}
              </p>
            </div>
  
            <div>
              <p className="text-xs font-medium mb-1">Unread</p>
              <Progress
                value={(meta.unreadCount / meta.totalItems) * 100}
                className="h-2"
              />
              <p className="text-xs mt-1">{meta.unreadCount}</p>
            </div>
  
            <div>
              <p className="text-xs font-medium mb-1">High Priority</p>
              <Progress
                value={(meta.highPriorityCount / meta.totalItems) * 100}
                className="h-2"
              />
              <p className="text-xs mt-1">{meta.highPriorityCount}</p>
            </div>
          </div>
  
          {/* Category Bar Chart */}
          <div>
            <h4 className="text-sm font-medium mb-2">By Category</h4>
            <ChartContainer config={chartConfig} className="min-h-[180px] w-full">
              <BarChart accessibilityLayer data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis
                  dataKey="category"
                  tickLine={false}
                  axisLine={false}
                  tick={{ fontSize: 10 }}
                />
                <YAxis
                  hide
                  tick={{ fontSize: 10 }}
                />
                <ChartTooltip content={<ChartTooltipContent />} />
                <ChartLegend content={<ChartLegendContent />} />
                <Bar dataKey="count" fill="var(--chart-1)" radius={4} />
              </BarChart>
            </ChartContainer>
          </div>
  
          {/* Top Extractive Sentences */}
          <div>
            <h4 className="text-sm font-medium mb-2">Top Details</h4>
            <ul className="list-disc list-inside space-y-1 text-xs text-gray-700">
              {extractive.map((item, idx) => (
                <li key={idx}>{item.sentence}</li>
              ))}
            </ul>
          </div>
        </CardContent>
      </Card>
    )
}

/** 3) AIComponent **/
function AIComponent({ contentData }: { contentData: NotificationAISummary }) {
  const { overview, categories, keyInsights, actionItems } = contentData;

  return (
    <Card className="max-w-md mx-auto p-4 space-y-4">
      <CardHeader>
        <CardTitle>Overview</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-indigo-600">{overview}</p>

        <div>
          <h4 className="text-sm font-medium mb-1">Highlights</h4>
          <ul className="list-disc list-inside text-xs space-y-1">
            {keyInsights.slice(0, 3).map((insight, i) => (
              <li key={i}>{insight}</li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-medium mb-1">Next Steps</h4>
          <ul className="list-disc list-inside text-xs space-y-1">
            {actionItems.slice(0, 3).map((step, i) => (
              <li key={i}>{step}</li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-medium mb-1">Category Breakdown</h4>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell className="text-xs">Category</TableCell>
                <TableCell className="text-xs">Count</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {categories.slice(0, 3).map((cat, i) => (
                <TableRow key={i}>
                  <TableCell className="text-xs">{cat.category}</TableCell>
                  <TableCell className="text-xs">{cat.count}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}