// components/story-test-content.tsx (Placeholder)
interface StoryTestContentProps {
    text: string;
}

export function StoryTestContent({ text }: StoryTestContentProps) {
    return (
        <div className="w-full max-w-md mx-auto">
            <p className="text-base leading-relaxed">{text}</p>
        </div>
    );
}