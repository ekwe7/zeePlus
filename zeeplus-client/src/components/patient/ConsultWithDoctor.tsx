import { useState } from "react";
import { PageHeader } from "@/components/common/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

export function ConsultWithDoctor() {
  const [messages, setMessages] = useState<
    { from: "me" | "doc"; text: string }[]
  >([{ from: "doc", text: "Hello, how can I help you today?" }]);
  const [input, setInput] = useState("");

  const send = () => {
    if (!input.trim()) return;
    setMessages((m) => [...m, { from: "me", text: input }]);
    setInput("");
    setTimeout(() => {
      setMessages((m) => [
        ...m,
        {
          from: "doc",
          text: "Thanks — I'll review and get back to you shortly.",
        },
      ]);
    }, 600);
    toast.success("Message sent");
  };

  return (
    <div>
      <PageHeader
        title="Consult Doctor"
        subtitle="Chat live with your assigned doctor."
      />
      <Card className="max-w-3xl">
        <CardContent className="flex h-[480px] flex-col p-0">
          <div className="flex-1 space-y-3 overflow-y-auto p-5">
            {messages.map((m, i) => (
              <div
                key={i}
                className={`flex ${m.from === "me" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[75%] rounded-2xl px-4 py-2 text-sm ${m.from === "me" ? "bg-primary text-primary-foreground" : "bg-muted"}`}
                >
                  {m.text}
                </div>
              </div>
            ))}
          </div>
          <div className="border-t border-border p-3 flex gap-2">
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type a message…"
              className="min-h-[44px]"
            />
            <Button onClick={send}>Send</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
