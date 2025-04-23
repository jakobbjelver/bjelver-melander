'use client'
import { contentSources } from "@/lib/db/schema";
import {
  MeetingTranscript,
  TranscriptAISummary,
  TranscriptItem,
  TranscriptProgrammaticSummary,
} from '@/types/stimuli';

import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '../ui/table';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import { Bar, BarChart, CartesianGrid, XAxis } from 'recharts';
import { Calendar, CheckCircle, ClipboardList, Flag, Key, Lightbulb, Users } from 'lucide-react';
import { cn } from "@/lib/utils";
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "../ui/chart";
import { Separator } from "../ui/separator";

interface MeetingTranscriptComponentProps {
  source: contentSources;
  contentData: MeetingTranscript;
}

export function MeetingTranscriptComponent({
  source,
  contentData,
}: MeetingTranscriptComponentProps) {
  switch (source) {
    case contentSources.AI:
      return <AIComponent contentData={contentData as TranscriptAISummary} />;
    case contentSources.Original:
      return <OriginalComponent contentData={contentData as TranscriptItem[]} />;
    case contentSources.Programmatic:
      return (
        <ProgrammaticComponent
          contentData={contentData as TranscriptProgrammaticSummary}
        />
      );
    default:
      return null;
  }
}


function OriginalComponent({ contentData }: { contentData: TranscriptItem[] }) {
  return (
    <div className="space-y-6">
      {/* Mobile: cards */}
      <div className="lg:hidden space-y-4">
        {contentData.map(item => (
          <div
            key={item.id}
            className={cn(
              "p-4 border rounded-lg shadow-sm",
              item.irrelevant && "opacity-50 bg-gray-50"
            )}
          >
            <div className="flex justify-between items-center">
              <span className="text-xs font-mono text-gray-500">{item.time}</span>
              <Badge variant={item.irrelevant ? 'secondary' : 'default'}>
                {item.irrelevant ? 'Note' : 'Spoke'}
              </Badge>
            </div>
            <p className="mt-2 text-sm font-semibold">{item.speaker}</p>
            <p className="mt-1 text-sm leading-relaxed">{item.content}</p>
          </div>
        ))}
      </div>

      {/* Desktop: table */}
      <div className="hidden lg:block">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Time</TableHead>
              <TableHead>Speaker</TableHead>
              <TableHead>Content</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {contentData.map(item => (
              <TableRow key={item.id} className={item.irrelevant ? 'opacity-50' : ''}>
                <TableCell className="font-mono text-xs">{item.time}</TableCell>
                <TableCell className="whitespace-nowrap">{item.speaker}</TableCell>
                <TableCell>{item.content}</TableCell>
                <TableCell>
                  <Badge variant={item.irrelevant ? 'secondary' : 'outline'}>
                    {item.irrelevant ? 'Off‑topic' : 'Relevant'}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

function AIComponent({ contentData }: { contentData: TranscriptAISummary }) {
  const { topic, goals, decisions, priorities, actionItems, targetRelease, nextMeeting } = contentData;

  const cards = [
    {
      key: 'overview',
      icon: <Calendar className="w-5 h-5 text-indigo-500" />,
      title: topic,
      rows: [
        { label: 'Release Date', value: targetRelease },
        { label: 'Next Meeting', value: nextMeeting },
      ],
    },
    {
      key: 'goals',
      icon: <Flag className="w-5 h-5 text-emerald-500" />,
      title: 'Goals',
      list: goals.map(g => "– " + g),
    },
    {
      key: 'decisions',
      icon: <Lightbulb className="w-5 h-5 text-yellow-500" />,
      title: 'Decisions',
      list: decisions.map(d => "+ " + d),
    },
    {
      key: 'priorities',
      icon: <CheckCircle className="w-5 h-5 text-red-500" />,
      title: 'Priorities',
      // wrap each priority in a badge
      list: priorities.map((p, i) => (
        <span
          key={i}
          className="inline-block px-2 py-1 text-xs font-medium bg-red-100 text-red-800 rounded-full"
        >
          {p}
        </span>
      )),
    },
    {
      key: 'actions',
      icon: <ClipboardList className="w-5 h-5 text-pink-500" />,
      className: cn('md:col-span-2'),
      title: 'Action Items',
      table: actionItems,
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {cards.map(c => (
        <Card key={c.key} className={cn("hover:shadow-lg", c.className)}>
          <CardHeader className="flex items-center pb-2 border-b">
            {c.icon}
            <CardTitle className="text-sm font-medium">{c.title}</CardTitle>
          </CardHeader>
          <CardContent className="mt-3">
            {c.rows &&
              c.rows.map(r => (
                <div key={r.label} className="flex justify-between py-1">
                  <span className="text-gray-600">{r.label}</span>
                  <span className="font-semibold">{r.value}</span>
                </div>
              ))}

            {c.list && (
              <div className="mt-2 space-y-1">
                {c.list.map((item, i) => (
                  <div key={i} className="inline-flex gap-2">
                    {typeof item === 'string' && <p className="font-bold">{item[0]}</p>}
                    {typeof item === 'string' ? item.substring(1) : item}
                  </div>
                ))}
              </div>
            )}

            {c.table && (
              <Table className="w-full mt-2 text-sm">
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-left pb-1">Owner</TableHead>
                    <TableHead className="text-left pb-1">Task</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {c.table.map(({ owner, task }) => (
                    <TableRow key={owner}>
                      <TableCell className="py-1">{owner}</TableCell>
                      <TableCell>{task}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function ProgrammaticComponent({ contentData }: { contentData: TranscriptProgrammaticSummary }) {
  const { summary, extractive, meta } = contentData;
  const { totalItems, relevantItems, speakerCounts, earliestTime, latestTime } = meta;

  const barData = Object.entries(speakerCounts).map(([speaker, count], index) => ({
    count: count,
    speaker: speaker,
    fill: `var(--color-${index + 1})`
  }));

  const chartConfig = {
    1: {
      label: "Speaker",
      color: "hsl(var(--chart-1))",
    },
    2: {
      label: "Speaker",
      color: "hsl(var(--chart-2))",
    },
    3: {
      label: "Speaker",
      color: "hsl(var(--chart-3))",
    },
  } satisfies ChartConfig

  return (
    <div className="space-y-6">
      {/* 1. Narrative + top extracts */}
      <Card>
        <CardHeader className="flex items-center pb-2 border-b">
          <Flag className="w-5 h-5 text-blue-500" />
          <CardTitle className="text-sm">Overview</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <p className="text-sm leading-relaxed my-2">{summary}</p>
          <span className="font-semibold inline-flex gap-2 text-sm">
            <Key className="text-amber-500 h-5 w-5" />
            Key highlights
          </span>
          <div className="space-y-2">
            {extractive.map((e, i) => (
              <div className="flex md:flex-row flex-col items-center justify-center gap-3">
                <p>#{i + 1}</p>
                <div key={i} className="p-3 bg-gray-50 rounded">
                  <p className="italic text-xs">“{e.sentence}”</p>
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>{e.speaker}</span>
                    <span>{e.time}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* 2. Relevance & timeframe */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader className="flex items-center pb-2">
            <CheckCircle className="w-5 h-5 text-green-500" />
            <CardTitle className="text-sm">Relevance</CardTitle>
          </CardHeader>
          <CardContent>
            <Separator />
            <div className="flex justify-between my-2 text-sm">
              <span>Relevant</span>
              <span>{relevantItems}/{totalItems}</span>
            </div>
            <Progress value={(relevantItems / totalItems) * 100} className="h-2" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex items-center pb-2">
            <Calendar className="w-5 h-5 text-yellow-500" />
            <CardTitle className="text-sm">Time Range</CardTitle>
          </CardHeader>
          <CardContent>
            <Separator />
            <div className="text-sm my-2 flex justify-between">
              <span>Start</span>
              <span>{earliestTime}</span>
            </div>
            <div className="text-sm flex justify-between mb-4">
              <span>End</span>
              <span>{latestTime}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 3. Speaker breakdown */}
      <Card>
        <CardHeader className="flex items-center pb-2 border-b">
          <Users className="w-5 h-5 text-pink-500" />
          <CardTitle className="text-sm">Speakers</CardTitle>
        </CardHeader>
        <CardContent className="pt-2 grid md:grid-cols-2 grid-cols-none grid-rows-2 md:grid-rows-none gap-10">
          <ChartContainer config={chartConfig} className="max-w-[200px] md:max-w-none min-h-[200px] md:min-h-none">
            <BarChart accessibilityLayer data={barData}>
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="speaker"
                tickLine={false}
                tickMargin={10}
                axisLine={false}
                tickFormatter={(value) => value.split(" ")[0]}
              />
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent hideLabel />}
              />
              <Bar dataKey="count" fill="var(--color-speaker)" radius={8} />
            </BarChart>
          </ChartContainer>
          <div className="mt-3 space-y-1 text-sm">
            {Object.entries(speakerCounts).map(([spk, cnt]) => (
              <div key={spk} className="flex justify-between">
                <span>{spk.split("(")[0]}</span>
                <Badge variant="outline">{cnt}</Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}