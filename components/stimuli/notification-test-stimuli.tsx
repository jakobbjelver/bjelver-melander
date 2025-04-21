// components/notification-test-content.tsx (Placeholder)
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

interface Notification {
    title: string;
    body: string;
}

interface NotificationTestContentProps {
    notifications: Notification[];
}

export function NotificationTestContent({ notifications }: NotificationTestContentProps) {
    return (
        <div className="w-full max-w-sm mx-auto space-y-2">
            {notifications.map((notif, index) => (
                <Card key={index} className="bg-background/80 backdrop-blur-sm shadow-sm">
                    <CardHeader className="p-3">
                        <CardTitle className="text-sm font-semibold">{notif.title}</CardTitle>
                        <CardDescription className="text-xs">{notif.body}</CardDescription>
                    </CardHeader>
                </Card>
            ))}
        </div>
    );
}