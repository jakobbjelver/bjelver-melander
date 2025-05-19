'use client'
import { ChartContent, PresentationSlide, SlideAISummary, SlideItem, SlideProgrammaticSummary } from '@/types/stimuli';

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from '../ui/carousel'
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
  CardDescription,
} from '../ui/card'
import { Badge } from '../ui/badge'
import { Progress } from '../ui/progress'
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from '../ui/table'
import {
  ChevronLeft,
  ChevronRight,
  Circle,
  MapPin,
  Cpu,
  User,
  Zap,
  BarChart2
} from 'lucide-react'
import { ChartConfig, ChartContainer, ChartLegend, ChartLegendContent, ChartTooltip, ChartTooltipContent } from '../ui/chart';
import { Pie, PieChart } from 'recharts';
import { ContentSources } from '@/types/test';

interface PresentationSlideComponentProps {
  source: ContentSources;
  contentData: PresentationSlide;
}

export function PresentationSlideComponent({ source, contentData }: PresentationSlideComponentProps) {

  switch (source) {
    case (ContentSources.AI):
      return <AIComponent contentData={contentData as SlideAISummary} />
    case (ContentSources.Original):
      return <OriginalComponent contentData={contentData as SlideItem[]} />
    case (ContentSources.Programmatic):
      return <ProgrammaticComponent contentData={contentData as SlideProgrammaticSummary} />
    default:
      return null
  }
}

export function OriginalComponent({
  contentData,
}: {
  contentData: SlideItem[]
}) {
  return (
    <Carousel className="max-w-xl w-full">
      <CarouselContent>
        {contentData.map((slide) => (
          <CarouselItem key={slide.id}>
            <Card
              className={`flex flex-col h-full`}
            >
              <CardHeader className="flex items-center justify-between">
                <CardTitle className="text-2xl">
                  {slide.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="flex-1 overflow-auto space-y-4">
                {slide.type === 'title slide' && (
                  <div className="prose text-center whitespace-pre-line">
                    {slide.content as string}
                  </div>
                )}

                {slide.type === 'bullet points' && (
                  <ul className="space-y-2">
                    {(slide.content as string[]).map((pt, i) => (
                      <li key={i} className="flex items-start">
                        <Circle
                          className="mt-1 flex-shrink-0"
                          size={8}
                        />
                        <span className="ml-2 md:text-base text-sm">{pt}</span>
                      </li>
                    ))}
                  </ul>
                )}

                {slide.type === 'chart' &&
                  slide.chartType === 'pie chart' && (
                    <div className="space-y-3">
                      {(slide.content as ChartContent).labels.map(
                        (lbl, i) => {
                          const val = (
                            slide.content as ChartContent
                          ).values[i]
                          return (
                            <div key={i} className="space-y-1">
                              <div className="flex justify-between">
                                <span>{lbl}</span>
                                <span className="font-bold">
                                  {val}
                                  {(slide.content as ChartContent).unit}
                                </span>
                              </div>
                              <Progress
                                value={val}
                                max={100}
                                className="h-2"
                              />
                            </div>
                          )
                        }
                      )}
                    </div>
                  )}

                {slide.type === 'chart' &&
                  slide.chartType === 'line chart' && (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Quarter</TableHead>
                          <TableHead>{(slide.content as ChartContent).unit}</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {(slide.content as ChartContent).labels.map(
                          (q, i) => (
                            <TableRow key={i}>
                              <TableCell>{q}</TableCell>
                              <TableCell>
                                {
                                  (slide.content as ChartContent).values[i]
                                }
                              </TableCell>
                            </TableRow>
                          )
                        )}
                      </TableBody>
                    </Table>
                  )}

                {slide.type === 'timeline' && (
                  <ul className="space-y-2">
                    {(slide.content as string[]).map((evt, i) => (
                      <li key={i} className="flex items-start">
                        <Badge variant="secondary">{i + 1}</Badge>
                        <span className="ml-3 md:text-base text-sm">{evt}</span>
                      </li>
                    ))}
                  </ul>
                )}

                {slide.type === 'profiles' && (
                  <div className="grid md:grid-cols-2 grid-cols-1 gap-4">
                    {(slide.content as string[]).map((profile, i) => (
                      <div
                        key={i}
                        className="flex items-center space-x-2"
                      >
                        <User size={24} />
                        <span className='md:text-base text-sm'>{profile}</span>
                      </div>
                    ))}
                  </div>
                )}

                {slide.type === 'map' && (
                  <div className="space-y-2">
                    <div className="h-32 bg-gray-100 flex items-center justify-center rounded">
                      <MapPin size={32} className="text-gray-400" />
                      <span className="ml-2 text-gray-500">
                        Map
                      </span>
                    </div>
                    <p>{slide.content as string}</p>
                  </div>
                )}

                {slide.type === 'diagram' && (
                  <div className="space-y-2">
                    <div className="h-32 bg-gray-100 flex items-center justify-center rounded">
                      <Cpu size={32} className="text-gray-400" />
                      <span className="ml-2 text-gray-500">
                        Diagram
                      </span>
                    </div>
                    <p>{slide.content as string}</p>
                  </div>
                )}
              </CardContent>
              <CardFooter>
                <small className="text-muted-foreground">{slide.notes}</small>
              </CardFooter>
            </Card>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious className='md:scale-150 scale-110 absolute -left-2 md:-left-14' />
      <CarouselNext className='md:scale-150 scale-110 absolute -right-2 md:-right-14' />
    </Carousel>
  )
}

export function AIComponent({
  contentData,
}: {
  contentData: SlideAISummary
}) {
  const {
    period,
    company,
    performance,
    revenueByDivision,
    strategicInitiatives,
    forecast,
  } = contentData

  const chartData = [
    {
      division: 'cloudServices',
      revenue: revenueByDivision.cloudServices,
      fill: 'var(--color-cloudServices)',
    },
    {
      division: 'enterpriseSolutions',
      revenue: revenueByDivision.enterpriseSolutions,
      fill: 'var(--color-enterpriseSolutions)',
    },
    {
      division: 'consumerProducts',
      revenue: revenueByDivision.consumerProducts,
      fill: 'var(--color-consumerProducts)',
    },
    {
      division: 'professionalServices',
      revenue: revenueByDivision.professionalServices,
      fill: 'var(--color-professionalServices)',
    },
  ]

  const chartConfig = {
    cloudServices: { label: 'Cloud Services', color: 'hsl(var(--chart-1))' },
    enterpriseSolutions: {
      label: 'Enterprise Solutions',
      color: 'hsl(var(--chart-2))',
    },
    consumerProducts: {
      label: 'Consumer Products',
      color: 'hsl(var(--chart-3))',
    },
    professionalServices: {
      label: 'Professional Services',
      color: 'hsl(var(--chart-4))',
    },
  } satisfies ChartConfig

  return (
    <Carousel className="w-full max-w-xl">
      <CarouselContent>
        {/* Slide 1: Header & Performance */}
        <CarouselItem>
          <Card className="flex flex-col h-full p-6">
            <CardHeader>
              <CardTitle className='text-lg'>
                {company} — {period}
              </CardTitle>
              <CardDescription>Q2 2023 Financial Performance</CardDescription>
            </CardHeader>
            <CardContent className="flex-1 space-y-4">
              <div className="grid md:grid-cols-2 grid-cols-1 gap-4">
                <Badge variant="info" className="px-4 py-2 text-[0.9rem]">
                  Revenue: {performance.totalRevenue}{' '}
                  {performance.currencyUnit}
                </Badge>
                <Badge variant="secondary" className="px-4 py-2 text-[0.9rem]">
                  YoY Growth: {performance.yoyGrowthPercent}%
                </Badge>
                <Badge variant="outline" className="px-4 py-2 text-[0.9rem]">
                  Margin: {performance.operatingMarginPercent}%
                </Badge>
                <Badge variant="outline" className="px-4 py-2 text-[0.9rem]">
                  New Customers: {performance.newEnterpriseCustomers}
                </Badge>
                <Badge variant="outline" className="px-4 py-2 text-[0.9rem]">
                  Cloud Growth: {performance.cloudDivisionGrowthPercent}%
                </Badge>
                <Badge variant="outline" className="px-4 py-2 text-[0.9rem]">
                  AI Platform: {performance.aiPlatformLaunchMonth}
                </Badge>
              </div>
            </CardContent>
          </Card>
        </CarouselItem>

        {/* Slide 2: Revenue Breakdown */}
        <CarouselItem>
          <Card className="flex flex-col h-full">
            <CardHeader className="pb-0">
              <CardTitle className='text-lg'>Revenue Breakdown</CardTitle>
              <CardDescription>By Division ({revenueByDivision.unit})</CardDescription>
            </CardHeader>
            <CardContent className="flex-1">
              <ChartContainer
                config={chartConfig}
                className="mx-auto aspect-square max-h-[300px]"
              >
                <PieChart>
                  <ChartTooltip
                    cursor={false}
                    content={<ChartTooltipContent nameKey="division" />}
                  />
                  <Pie data={chartData} dataKey="revenue" />
                  <ChartLegend
                    content={<ChartLegendContent nameKey="division" />}
                    className="-translate-y-2 flex-wrap gap-2 [&>*]:basis-1/4 [&>*]:justify-center"
                  />
                </PieChart>
              </ChartContainer>
            </CardContent>
          </Card>
        </CarouselItem>

        {/* Slide 3: Initiatives & Forecast */}
        <CarouselItem>
          <Card className="flex flex-col h-full p-6 bg-gradient-to-tr from-blue-50 to-white">
            <CardHeader>
              <CardTitle className='text-lg'>Initiatives & Forecast</CardTitle>
            </CardHeader>
            <CardContent className="flex-1 space-y-4">
              <section>
                <h3 className="font-semibold">Strategic Initiatives</h3>
                <ul className="list-disc list-inside space-y-1">
                  {strategicInitiatives.map((itm, idx) => (
                    <li className='md:text-base text-sm' key={idx}>{itm}</li>
                  ))}
                </ul>
              </section>
              <section className="pt-4 border-t border-gray-200">
                <h3 className="font-semibold">
                  Q3–Q4 Forecast ({forecast.currencyUnit})
                </h3>
                <div className="flex gap-4 mt-2">
                  <Badge variant="info">Q3: {forecast.Q3}</Badge>
                  <Badge variant="secondary">Q4: {forecast.Q4}</Badge>
                </div>
                <p className="text-sm text-gray-600 mt-2">
                  Drivers: {forecast.keyDrivers.join(', ')}
                </p>
              </section>
            </CardContent>
          </Card>
        </CarouselItem>
      </CarouselContent>
      <CarouselPrevious className='md:scale-150 scale-110 absolute -left-2 md:-left-14' />
      <CarouselNext className='md:scale-150 scale-110 absolute -right-2 md:-right-14' />
    </Carousel>
  )
}



export function ProgrammaticComponent({
  contentData,
}: {
  contentData: SlideProgrammaticSummary
}) {
  const { summary, extractive, meta } = contentData

  return (
    <Carousel className="w-full max-w-xl">
      <CarouselContent>
        {/* Slide A: Overall summary */}
        <CarouselItem>
          <Card className="h-full p-6">
            <CardHeader>
              <CardTitle className='text-lg'>Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <p>{summary}</p>
            </CardContent>
          </Card>
        </CarouselItem>

        {/* Slide B: Top sentences */}
        <CarouselItem>
          <Card className="h-full p-6">
            <CardHeader>
              <CardTitle className='text-lg'>Highlights</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {extractive.map((ex, i) => (
                <div key={i} className="flex items-start md:gap-2">
                  <Badge variant="outline" className="mr-2 md:text-lg rounded-full">
                    #{i + 1}
                  </Badge>
                  <span className='block'>
                    <p className='font-semibold'>{ex.title}</p>
                    <span className='md:text-base text-sm'>{ex.sentence}</span>
                  </span>
                </div>
              ))}
            </CardContent>
          </Card>
        </CarouselItem>

        {/* Slide C: Meta stats */}
        <CarouselItem>
          <Card className="h-full p-6 bg-gradient-to-tr from-blue-50 to-white">
            <CardHeader className="flex items-center space-x-2">
              <BarChart2 />
              <CardTitle  className='text-lg'>Stats</CardTitle>
            </CardHeader>
            <CardContent className="grid md:grid-cols-2 grid-cols-1 gap-4">
              <Badge className='text-base border h-10 justify-between' variant={'outline'}>
                Total Slides
                <Badge className='rounded-full' variant={'secondary'}> {meta.totalSlides}</Badge>
              </Badge>
              <Badge className='text-base border h-10 justify-between' variant={'outline'}>
                Relevant
                <Badge className='rounded-full' variant={'secondary'}> {meta.totalSlides}</Badge>
              </Badge>
              <Badge className='text-base border h-10 justify-between' variant={'outline'}>
                Charts
                <Badge className='rounded-full' variant={'secondary'}> {meta.chartSlides}</Badge>
              </Badge>
              <Badge className='text-base border h-10 justify-between' variant={'outline'}>
              Avg. Bullets
                <Badge className='rounded-full' variant={'secondary'}> {meta.averageBulletPoints.toFixed(1)}</Badge>
              </Badge>
            </CardContent>
          </Card>
        </CarouselItem>
      </CarouselContent>
      <CarouselPrevious className='md:scale-150 scale-110 absolute -left-2 md:-left-14' />
      <CarouselNext className='md:scale-150 scale-110 absolute -right-2 md:-right-14' />
    </Carousel>
  )
}