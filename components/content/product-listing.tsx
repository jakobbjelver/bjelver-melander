import { contentSources } from '@/lib/db/schema';
import { ProductAISummary, ProductItem, ProductListing, ProductProgrammaticSummary } from '@/types/stimuli';
import { Mail, MailOpen, Paperclip, Tag } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';

interface ProductListingComponentProps {
    source: contentSources;
    contentData: ProductListing;
}

export function ProductListingComponent({ source, contentData }: ProductListingComponentProps) {

    switch (source) {
        case (contentSources.AI):
            return <AIComponent contentData={contentData as ProductAISummary} />
        case (contentSources.Original):
            return <OriginalComponent contentData={contentData as ProductItem[]} />
        case (contentSources.Programmatic):
            return <ProgrammaticComponent contentData={contentData as ProductProgrammaticSummary} />
        default:
            return null
    }
}

// ---- AIComponent ----

function AIComponent({ contentData }: { contentData: ProductAISummary }) {
  return null
}

// ---- OriginalComponent ----

function OriginalComponent({ contentData }: { contentData: ProductItem[] }) {
  return null
}

// ---- ProgrammaticComponent ----

function ProgrammaticComponent({ contentData }: { contentData: ProductProgrammaticSummary }) {
  return null
}