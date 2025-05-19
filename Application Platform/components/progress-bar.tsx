'use client'

import { useParams, usePathname, useSearchParams } from 'next/navigation'
import { TestSlugs } from '@/types/test';
import { Progress } from './ui/progress';

// 2) define slugs & total steps
const TEST_SEQUENCE = Object.values(TestSlugs);

const TOTAL_STEPS = 2 + (TEST_SEQUENCE.length * 3) + 2  // consent, pre, 7×3, post, complete

export default function ProgressBar() {
    // 3) get path + turn into segments
    const pathname = usePathname()
    const { testSlug: test } = useParams()
    const [, , , section, , testState] = pathname.split('/')

    console.log("section", section)
    console.log("testState", testState)
    console.log("test", test)

    // 4) compute a step index
    let step = 0
    if (section === 'consent') step = 1
    else if (section === 'pre') step = 2
    else if (section === 'test' && testState === 'intro') {
        step = (TEST_SEQUENCE.indexOf(test as TestSlugs) + 1) * 3 // 3, 6, 9, 12, etc..
        console.log("STEP: ", step)
    }
    else if (section === 'test' && testState === 'content') {
        step = ((TEST_SEQUENCE.indexOf(test as TestSlugs) + 1) * 3) + 1 // 4, 7, 10, 13, etc..
    }
    else if (section === 'test' && testState === 'questions') {
        step = ((TEST_SEQUENCE.indexOf(test as TestSlugs) + 1) * 3) + 2 // 5, 8, 11, 14,etc..
    }
    else if (section === 'post') step = TOTAL_STEPS - 1
    else if (section === 'complete') step = TOTAL_STEPS

    // 5) percent
    const percent = Math.round((step / TOTAL_STEPS) * 100)

    return (
        percent !== 0 && <div className="container mx-auto px-2 md:px-8 mt-2 flex max-w-sm">
            <Progress value={percent}/>
        </div>
    );
}