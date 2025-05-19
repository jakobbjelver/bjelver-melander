import { SearchAISummary, SearchEngine, SearchProgrammaticSummary, SearchResultItem } from '@/types/stimuli';

import { Card, CardHeader, CardTitle, CardContent } from '../ui/card'
import { Badge } from '../ui/badge'
import { Video, ExternalLink, Calendar, Book, SearchIcon } from 'lucide-react'
import { Separator } from '../ui/separator';
import { ContentSources } from '@/types/test';
import { searchEngineQuery } from '@/lib/stimuli/searchEngine';
import { Input } from '../ui/input';
import { JSX } from 'react';

interface SearchEngineComponentProps {
  source: ContentSources;
  contentData: SearchEngine;
}

export function SearchEngineComponent({ source, contentData }: SearchEngineComponentProps) {
  // 1) define your query state

  let component: JSX.Element | null = null;

  switch (source) {
    case ContentSources.AI:
      component = <AIComponent contentData={contentData as SearchAISummary} />;
      break;                                  // ← add this
    case ContentSources.Original:
      component = <OriginalComponent contentData={contentData as SearchResultItem[]} />;
      break;                                  // ← and this
    case ContentSources.Programmatic:
      component = <ProgrammaticComponent contentData={contentData as SearchProgrammaticSummary} />;
      break;                                  // ← and this
    default:
      component = null;
  }

  return (
    <div className='grid gap-4'>
      <span className='flex flex-row items-center relative'>
      <SearchIcon size={20} className='absolute left-5'/>
      <Input value={searchEngineQuery} readOnly className='bg-background h-16 !text-lg rounded-3xl pl-12' />
      </span>
      {component}
    </div>
  );
}

const titleCase = (s: string) =>
  s.replace(/\b\w/g, (c) => c.toUpperCase());

function OriginalComponent({ contentData }: { contentData: SearchResultItem[] }) {
  return (
    <div className="space-y-4">
      {contentData.map((item) => (
        <Card key={item.id} className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <a
                href={`https://${item.url}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-lg font-semibold text-blue-600 hover:underline flex items-center gap-1"
              >
                {item.title} <ExternalLink size={16} />
              </a>
              {item.hasVideo && <Video size={18} className="text-green-600" />}
            </div>
            <div className="flex flex-wrap items-center gap-2 text-sm text-gray-500">
              <span className="inline-flex items-center gap-1">
                <Calendar size={14} /> {item.datePublished}
              </span>
              <Badge variant="outline">{titleCase(item.type)}</Badge>
              {typeof item.citations === 'number' && (
                <span className="inline-flex items-center gap-1">
                  <Book size={14} /> {item.citations} citations
                </span>
              )}
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-700">{item.snippet}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
function AIComponent({ contentData }: { contentData: SearchAISummary }) {
  const {
    topic,
    overview,
    keyThemes,
    formatCounts,
    sources,
    latestUpdate,
    citationStats: { totalItems, average, range },
    multimediaIncluded,
  } = contentData

  return (
    <div className="grid grid-cols-1 gap-4">
      {/* Overview Card */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">{topic}</CardTitle>
          <div className="flex items-center justify-between text-sm text-gray-600">
            <span>Updated {latestUpdate}</span>
            {multimediaIncluded && <Video size={16} className="text-blue-600" />}
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-sm">{overview}</p>
          <p className='mt-5 mb-2 font-bold text-sm'>Key Themes</p>
          <div className="flex flex-row gap-2 flex-wrap">
            {keyThemes.map((t, i) => (
              <Badge key={i} className='text-[0.8rem]' variant={'outline'}>{t}</Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Metrics & Sources */}
      <Card className="">
        <CardHeader>
          <CardTitle className="text-lg">Metrics &amp; Sources</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-xs">
          <div className='grid grid-cols-8 md:gap-2 max-w-lg mx-auto mb-4'>
            <span className="font-medium col-span-2 grid md:grid-flow-col grid-cols-1 md:text-base">Total items <p className='md:text-lg text-base font-light w-full text-right'>{totalItems}</p></span>
            <Separator orientation='vertical' className='col-span-1 place-self-center' />
            <span className="font-medium col-span-2 grid md:grid-flow-col grid-cols-1 md:text-base">Avg cites <p className='md:text-lg text-base font-light w-full text-right'>{average}</p></span>
            <Separator orientation='vertical' className='col-span-1 place-self-center' />
            <span className="font-medium  col-span-2 grid md:grid-flow-col grid-cols-1 md:text-base">Range  <p className='md:text-lg text-base font-light w-full text-right'>{range[0]}–{range[1]}</p></span>
          </div>
          <div>
            <div className="flex flex-wrap gap-2 mt-1 items-center">
              <span className="font-medium">Formats</span>
              <span className='ml-1 w-2 h-5'>
                <Separator orientation='vertical' />
              </span>
              {Object.entries(formatCounts).map(([fmt, cnt]) => (
                <Badge key={fmt} variant="outline" className='h-6'>
                  {titleCase(fmt)} <Badge className='rounded-full scale-[0.45] font-semibold w-8 h-8 text-[1.4rem]'>{cnt}</Badge>
                </Badge>
              ))}
            </div>
          </div>
          <div>
            <div className="flex flex-wrap gap-2 mt-1 items-center">
              <span className="font-medium">Sources</span>
              <span className='ml-1 w-2 h-5'>
                <Separator orientation='vertical' />
              </span>
              {sources.map((s) => (
                <Badge key={s}>{s}</Badge>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function ProgrammaticComponent({
  contentData,
}: {
  contentData: SearchProgrammaticSummary
}) {
  const {
    summary,
    extractive,
    meta: { totalItems, hasVideoCount, averageCitations, typeCounts, topSources },
  } = contentData

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* Snapshot */}
      <Card className="md:col-span-2">
        <CardHeader>
          <CardTitle className="text-lg">Snapshot</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm">{summary}</p>
        </CardContent>
      </Card>

      {/* Extractive Highlights */}
      <Card className="">
        <CardHeader>
          <CardTitle className="text-lg">Highlights</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {extractive.map((ext, i) => (
            <span key={i} className='flex flew-row gap-2 items-center'>
              <Badge>{i + 1}</Badge>
              <p className="text-sm italic line-clamp-2">
                “{ext.sentence}”
              </p>
            </span>
          ))}
        </CardContent>
      </Card>

      {/* Statistics */}
      <Card className="">
        <CardHeader>
          <CardTitle className="text-lg">Statistics</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6 text-sm">
          <div className='grid grid-cols-8 md:gap-2 max-w-lg mx-auto mb-6'>
            <span className="font-medium col-span-2 grid grid-cols-1">Total items <p className='md:text-xl text-base font-light w-full text-right'>{totalItems}</p></span>
            <Separator orientation='vertical' className='col-span-1 place-self-center' />
            <span className="font-medium col-span-2 grid grid-cols-1">Avg cites <p className='md:text-xl text-base font-light w-full text-right'>{averageCitations}</p></span>
            <Separator orientation='vertical' className='col-span-1 place-self-center' />
            <span className="font-medium  col-span-2 grid grid-cols-1">Videos  <p className='md:text-xl text-base font-light w-full text-right'>{hasVideoCount}</p></span>
          </div>
          <div>
            <div className="flex flex-wrap gap-2 mt-1 items-center">
              <span className="font-medium">Formats</span>
              <span className='ml-1 w-2 h-5'>
                <Separator orientation='vertical' />
              </span>
              {Object.entries(typeCounts).map(([fmt, cnt]) => (
                <Badge key={fmt} variant="outline" className='h-6'>
                  {titleCase(fmt)} <Badge className='rounded-full scale-[0.45] font-semibold w-8 h-8 text-[1.4rem]'>{cnt}</Badge>
                </Badge>
              ))}
            </div>
          </div>
          <div>
            <div className="flex flex-wrap gap-2 mt-1 items-center">
              <span className="font-medium">Sources</span>
              <span className='ml-1 w-2 h-5'>
                <Separator orientation='vertical' />
              </span>
              {topSources.map((s) => (
                <Badge key={s}>{s}</Badge>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}