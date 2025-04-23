import { contentSources } from '@/lib/db/schema';
import { SearchAISummary, SearchEngine, SearchProgrammaticSummary, SearchResultItem } from '@/types/stimuli';

interface SearchEngineComponentProps {
    source: contentSources;
    contentData: SearchEngine;
}

export function SearchEngineComponent({ source, contentData }: SearchEngineComponentProps) {

    switch (source) {
        case (contentSources.AI):
            return <AIComponent contentData={contentData as SearchAISummary} />
        case (contentSources.Original):
            return <OriginalComponent contentData={contentData as SearchResultItem[]} />
        case (contentSources.Programmatic):
            return <ProgrammaticComponent contentData={contentData as SearchProgrammaticSummary} />
        default:
            return null
    }
}

function OriginalComponent({ contentData }: { contentData: SearchResultItem[] }) {
  return null
}

function AIComponent({ contentData }: { contentData: SearchAISummary }) {
  return null
}

function ProgrammaticComponent({
  contentData,
}: {
  contentData: SearchProgrammaticSummary
}) {
  return null
}