import { ProductAISummary, ProductItem, ProductListing, ProductProgrammaticSummary } from '@/types/stimuli';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import { Table, TableHeader, TableBody, TableRow, TableCell } from '../ui/table';
import { Star, ChartBar, StarHalf, Currency, Coins, List, Warehouse, Truck } from 'lucide-react';
import { Separator } from '../ui/separator';
import { ContentSources } from '@/types/test';

interface ProductListingComponentProps {
  source: ContentSources;
  contentData: ProductListing;
}

export function ProductListingComponent({ source, contentData }: ProductListingComponentProps) {

  switch (source) {
    case (ContentSources.AI):
      return <AIComponent contentData={contentData as ProductAISummary} />
    case (ContentSources.Original):
      return <OriginalComponent contentData={contentData as ProductItem[]} />
    case (ContentSources.Programmatic):
      return <ProgrammaticComponent contentData={contentData as ProductProgrammaticSummary} />
    default:
      return null
  }
}

// --- AI-style executive summaries (max 3 cards) ---
function AIComponent({ contentData }: { contentData: ProductAISummary }) {
  const { itemCount, averageRating, priceRange, discountRange, batteryLifeHours, shippingOptions, keyFeatures } = contentData;

  return (
    <div className="grid gap-6 grid-cols-1 md:grid-cols-3">
      {/* 1. Overview */}
      <Card className="">
        <CardHeader>
          <CardTitle  className='font-semibold text-lg'>{itemCount} Products</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col items-center space-x-2">
            <span className="font-medium inline-flex items-center gap-1 w-full justify-start">
              <Star className="w-5 h-5" />
              Avgerage Rating
            </span>
            <span className='text-3xl font-light text-center w-full leading-relaxed'>{averageRating.toFixed(2)}</span>
          </div>
          <Separator/>
          <div className="flex flex-col items-center space-x-2">
            <span className="font-medium inline-flex items-center gap-1 w-full justify-start">
              <Coins className="w-5 h-5" />
              Price Range
            </span>
            <span className='text-xl font-light text-center w-full leading-loose'>${priceRange.min.toFixed(2)} – ${priceRange.max.toFixed(2)} {priceRange.currency}</span>
          </div>
        </CardContent>
      </Card>

      {/* 2. Deals & Battery */}
      <Card className="">
        <CardHeader>
          <CardTitle className='font-semibold text-lg'>Key Specs</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className='grid gap-2'>
            <span className="font-medium">Discount Range</span>{' '}
            <Badge className='text-base font-semibold w-fit place-self-center'>{discountRange.min}{discountRange.unit} – {discountRange.max}{discountRange.unit}</Badge>
          </div>
          <Separator/>
          <div className='grid gap-2'>
            <span className="font-medium">Battery Life</span>{' '}
            <Progress value={((batteryLifeHours.max - batteryLifeHours.min) / batteryLifeHours.max) * 100} />
            <div className="text-sm text-muted-foreground">
              {batteryLifeHours.min}h – {batteryLifeHours.max}h
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 3. Shipping & Features */}
      <Card className="">
        <CardHeader>
          <CardTitle  className='font-semibold text-lg'>Shipping & Features</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex space-x-2">
            <Badge variant="info">{shippingOptions.free}× Free Ship</Badge>
            <Badge variant="outline">{shippingOptions.paid}× Paid Ship</Badge>
          </div>
          <div className="text-sm text-muted-foreground">Est. {shippingOptions.typicalEstimate}</div>
          <div className="flex flex-wrap gap-2">
            {keyFeatures.slice(0, 5).map((feat, i) => (
              <Badge key={i} variant="secondary">{feat}</Badge>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// --- Original full listings ---
function OriginalComponent({ contentData }: { contentData: ProductItem[] }) {
  return (
    <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
      {contentData.map(item => (
        <Card key={item.id} className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle className="text-lg">{item.productName}</CardTitle>
              <Badge variant="outline">{item.brand}</Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-baseline space-x-2">
              <span className="text-xl font-semibold">{item.price}</span>
              <span className="text-sm text-muted-foreground line-through">{item.originalPrice}</span>
              {item.discount && <Badge variant="destructive">{item.discount}</Badge>}
            </div>
            <div className="flex items-center space-x-1">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`h-4 w-4 ${i < Math.round(item.rating) ? 'text-yellow-500' : 'text-gray-200'}`}
                />
              ))}
              <span className="text-sm text-muted-foreground">({item.reviewCount})</span>
            </div>
            <div className="flex flex-wrap gap-2">
              <Badge variant={item.inStock ? 'outline' : 'destructive'}>
                {item.inStock ? 'In Stock' : 'Out of Stock'}
              </Badge>
              <Badge variant={item.freeShipping ? 'info' : 'warning'}>
                {item.freeShipping ? 'Free Shipping' : 'Shipping Fee'}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground">{item.deliveryEstimate}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

// --- Programmatic-style highlights (max 3 cards) ---
function ProgrammaticComponent({ contentData }: { contentData: ProductProgrammaticSummary }) {
  const { summary, extractive, meta } = contentData;

  return (
    <div className="grid md:grid-cols-2 grid-cols-1 gap-4">
      {/* 1. Abstracted summary */}
      <Card className="md:col-span-2">
        <CardHeader>
          <CardTitle>Quick Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-base">{summary}</p>
        </CardContent>
      </Card>

      {/* 2. Top snippets */}
      <Card className="">
        <CardHeader>
          <CardTitle>Top Highlights</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {extractive.map((ex, i) => (
            <div key={i} className="flex items-start space-x-2">
              <div className="flex-shrink-0">
                <Badge variant="secondary">#{i+1}</Badge>
              </div>
              <p className="text-sm italic">“{ex.sentence}”</p>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* 3. Meta Stats */}
      <Card className="">
        <CardHeader>
          <CardTitle>Key Metrics</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="flex flex-col items-center space-x-2">
            <span className="md:text-base font-medium inline-flex items-center gap-1 w-full justify-start">
              <List size={16} />
              Total Items
            </span>
            <span className='text-3xl font-light text-center w-full leading-loose'>{meta.totalItems}</span>
          </div>
          <div className="flex flex-col items-center space-x-2">
            <span className="md:text-base font-medium inline-flex items-center gap-1 w-full justify-start">
              <Warehouse size={16} />
              In Stock
            </span>
            <span className='text-3xl font-light text-center w-full leading-loose'>{meta.inStockCount}</span>
          </div>
          <div className="flex flex-col items-center space-x-2">
            <span className="md:text-base font-medium inline-flex items-center gap-1 w-full justify-start">
              <Truck size={16} />
              Free Shipping
            </span>
            <span className='text-3xl font-light text-center w-full leading-loose'>{meta.freeShippingCount}</span>
          </div>
          <div className="flex flex-col items-center space-x-2">
            <span className="md:text-base whitespace-nowrap font-medium inline-flex items-center gap-1 w-full justify-start">
              <Star size={16}/>
              Average Rating
            </span>
            <span className='text-3xl font-light text-center w-full leading-loose'>{meta.averageRating.toFixed(2)}</span>
          </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}