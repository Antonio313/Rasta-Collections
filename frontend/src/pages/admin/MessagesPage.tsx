import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MessagesTable } from "@/components/admin/MessagesTable";
import { useMessages } from "@/hooks/useMessages";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";

export function MessagesPage() {
  useDocumentTitle("Messages");
  const { data, isLoading } = useMessages();
  const messages = data?.data ?? [];
  const unreadCount = messages.filter((m) => !m.read).length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Messages</h1>
        <p className="text-muted-foreground">
          {messages.length} message{messages.length !== 1 ? "s" : ""}
          {unreadCount > 0 && ` (${unreadCount} unread)`}
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Contact Form Inbox</CardTitle>
        </CardHeader>
        <CardContent>
          <MessagesTable messages={messages} isLoading={isLoading} />
        </CardContent>
      </Card>
    </div>
  );
}
