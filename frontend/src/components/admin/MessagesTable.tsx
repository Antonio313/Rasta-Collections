import { useState } from "react";
import { Trash2, Mail, MailOpen } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { ConfirmDialog } from "./ConfirmDialog";
import { useMarkMessageRead, useDeleteMessage } from "@/hooks/useMessages";
import { toast } from "sonner";
import type { ContactMessage } from "@rasta/shared";

interface MessagesTableProps {
  messages: ContactMessage[];
  isLoading: boolean;
}

export function MessagesTable({ messages, isLoading }: MessagesTableProps) {
  const [viewMessage, setViewMessage] = useState<ContactMessage | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const markRead = useMarkMessageRead();
  const deleteMessage = useDeleteMessage();

  const handleView = async (message: ContactMessage) => {
    setViewMessage(message);
    if (!message.read) {
      try {
        await markRead.mutateAsync(message.id);
      } catch {
        // Silently fail
      }
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await deleteMessage.mutateAsync(deleteId);
      toast.success("Message deleted");
      setDeleteId(null);
    } catch {
      toast.error("Failed to delete message");
    }
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (isLoading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-14 w-full" />
        ))}
      </div>
    );
  }

  if (messages.length === 0) {
    return (
      <div className="py-12 text-center text-muted-foreground">
        No messages yet.
      </div>
    );
  }

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-10"></TableHead>
              <TableHead>Name</TableHead>
              <TableHead className="hidden md:table-cell">Email</TableHead>
              <TableHead className="hidden sm:table-cell">Date</TableHead>
              <TableHead className="w-24 text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {messages.map((message) => (
              <TableRow
                key={message.id}
                className={`cursor-pointer ${!message.read ? "bg-blue-50/50" : ""}`}
                onClick={() => handleView(message)}
              >
                <TableCell>
                  {message.read ? (
                    <MailOpen className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <Mail className="h-4 w-4 text-blue-600" />
                  )}
                </TableCell>
                <TableCell>
                  <span className={!message.read ? "font-semibold" : ""}>
                    {message.name}
                  </span>
                </TableCell>
                <TableCell className="hidden md:table-cell text-muted-foreground">
                  {message.email}
                </TableCell>
                <TableCell className="hidden sm:table-cell text-muted-foreground">
                  {formatDate(message.createdAt)}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-1">
                    {!message.read && (
                      <Badge variant="secondary" className="text-xs">
                        New
                      </Badge>
                    )}
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={(e) => {
                        e.stopPropagation();
                        setDeleteId(message.id);
                      }}
                    >
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* View message dialog */}
      <Dialog
        open={viewMessage !== null}
        onOpenChange={() => setViewMessage(null)}
      >
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Message from {viewMessage?.name}</DialogTitle>
          </DialogHeader>
          {viewMessage && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <span className="font-medium text-muted-foreground">Email:</span>{" "}
                  <a
                    href={`mailto:${viewMessage.email}`}
                    className="text-blue-600 hover:underline"
                  >
                    {viewMessage.email}
                  </a>
                </div>
                <div>
                  <span className="font-medium text-muted-foreground">Date:</span>{" "}
                  {formatDate(viewMessage.createdAt)}
                </div>
              </div>
              <div className="rounded-md bg-gray-50 p-4 text-sm whitespace-pre-wrap">
                {viewMessage.message}
              </div>
              <div className="flex justify-end">
                <Button asChild variant="outline" size="sm">
                  <a href={`mailto:${viewMessage.email}`}>Reply via Email</a>
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={deleteId !== null}
        onOpenChange={() => setDeleteId(null)}
        title="Delete Message"
        description="Are you sure you want to delete this message? This action cannot be undone."
        onConfirm={handleDelete}
        loading={deleteMessage.isPending}
      />
    </>
  );
}
