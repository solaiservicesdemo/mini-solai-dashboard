import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { X, Send, Sparkles } from "lucide-react";

interface QuickComposeModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface EmailTemplate {
  key: string;
  name: string;
  subject: string;
  body: string;
  variables: string[];
}

const emailTemplates: EmailTemplate[] = [
  {
    key: "intro",
    name: "Introduction",
    subject: "Quick intro, {recipientFirst}",
    body: "Hi {recipientFirst},\n\nI'm {senderFirst} from {business}. We specialize in helping businesses like yours with automation solutions.\n\nWould you be interested in a brief call to discuss how we could help streamline your workflows?\n\nBest regards,\n{senderFirst}",
    variables: ["recipientFirst", "senderFirst", "business"],
  },
  {
    key: "reminder1",
    name: "Payment Reminder",
    subject: "Following up on {topic}",
    body: "Hello {recipientFirst},\n\nJust checking on {topic}. If you have any questions or need clarification on anything, please let me know.\n\nThanks!\n{senderFirst}",
    variables: ["recipientFirst", "senderFirst", "topic"],
  },
  {
    key: "thanks",
    name: "Thank You",
    subject: "Thank you!",
    body: "Thanks {recipientFirst}—really appreciate your time on {topic}. Looking forward to our next steps!\n\nBest,\n{senderFirst}",
    variables: ["recipientFirst", "senderFirst", "topic"],
  },
  {
    key: "followup",
    name: "Follow Up",
    subject: "Following up on our conversation",
    body: "Hi {recipientFirst},\n\nI wanted to follow up on our conversation about {topic}. Do you have any updates or questions I can help with?\n\nLet me know if you'd like to schedule a quick call.\n\nBest regards,\n{senderFirst}",
    variables: ["recipientFirst", "senderFirst", "topic"],
  },
];

export function QuickComposeModal({
  open,
  onOpenChange,
}: QuickComposeModalProps) {
  const [selectedTemplate, setSelectedTemplate] =
    useState<EmailTemplate | null>(null);
  const [to, setTo] = useState("");
  const [variables, setVariables] = useState<Record<string, string>>({});
  const [useAIPolish, setUseAIPolish] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleTemplateSelect = (templateKey: string) => {
    const template = emailTemplates.find((t) => t.key === templateKey);
    if (template) {
      setSelectedTemplate(template);
      // Initialize variables with default values
      const newVariables: Record<string, string> = {};
      template.variables.forEach((variable) => {
        newVariables[variable] = variables[variable] || "";
      });
      setVariables(newVariables);
    }
  };

  const handleVariableChange = (variable: string, value: string) => {
    setVariables((prev) => ({
      ...prev,
      [variable]: value,
    }));
  };

  const replaceVariables = (text: string): string => {
    let result = text;
    Object.entries(variables).forEach(([variable, value]) => {
      result = result.replace(new RegExp(`{${variable}}`, "g"), value);
    });
    return result;
  };

  const handleSend = async () => {
    if (!selectedTemplate || !to) return;

    setIsLoading(true);

    const emailData = {
      templateKey: selectedTemplate.key,
      to,
      vars: variables,
      useAIPolish,
    };

    try {
      // This would typically call your n8n webhook
      const response = await fetch("/api/send-template", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(emailData),
      });

      if (response.ok) {
        // Reset form and close modal
        setSelectedTemplate(null);
        setTo("");
        setVariables({});
        setUseAIPolish(false);
        onOpenChange(false);
      }
    } catch (error) {
      console.error("Failed to send email:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setSelectedTemplate(null);
    setTo("");
    setVariables({});
    setUseAIPolish(false);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto mx-4 sm:mx-0 w-[calc(100vw-2rem)] sm:w-full">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            Quick Compose
            <Button
              variant="ghost"
              size="sm"
              className="ml-auto"
              onClick={handleClose}
            >
              <X className="h-4 w-4" />
            </Button>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Template Selection */}
          <div className="space-y-2">
            <Label htmlFor="template">Template</Label>
            <Select onValueChange={handleTemplateSelect}>
              <SelectTrigger>
                <SelectValue placeholder="Choose a template..." />
              </SelectTrigger>
              <SelectContent>
                {emailTemplates.map((template) => (
                  <SelectItem key={template.key} value={template.key}>
                    {template.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Recipient */}
          <div className="space-y-2">
            <Label htmlFor="to">To</Label>
            <Input
              id="to"
              type="email"
              placeholder="recipient@example.com"
              value={to}
              onChange={(e) => setTo(e.target.value)}
            />
          </div>

          {/* Variables */}
          {selectedTemplate && selectedTemplate.variables.length > 0 && (
            <div className="space-y-3">
              <Label>Template Variables</Label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {selectedTemplate.variables.map((variable) => (
                  <div key={variable} className="space-y-1">
                    <Label htmlFor={variable} className="text-sm font-medium">
                      {variable}
                    </Label>
                    <Input
                      id={variable}
                      placeholder={`Enter ${variable}...`}
                      value={variables[variable] || ""}
                      onChange={(e) =>
                        handleVariableChange(variable, e.target.value)
                      }
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Preview */}
          {selectedTemplate && (
            <div className="space-y-3">
              <Label>Preview</Label>
              <div className="border rounded-lg p-4 bg-slate-50 dark:bg-slate-800 space-y-3">
                <div>
                  <Label className="text-xs text-slate-600 dark:text-slate-400">
                    Subject:
                  </Label>
                  <div className="font-medium">
                    {replaceVariables(selectedTemplate.subject)}
                  </div>
                </div>
                <div>
                  <Label className="text-xs text-slate-600 dark:text-slate-400">
                    Body:
                  </Label>
                  <div className="whitespace-pre-wrap text-sm">
                    {replaceVariables(selectedTemplate.body)}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* AI Polish Option */}
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="ai-polish"
              checked={useAIPolish}
              onChange={(e) => setUseAIPolish(e.target.checked)}
              className="rounded border-gray-300"
            />
            <Label htmlFor="ai-polish" className="flex items-center text-sm">
              <Sparkles className="mr-1 h-4 w-4" />
              Polish with AI (optional)
            </Label>
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-3">
            <Button variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button
              onClick={handleSend}
              disabled={!selectedTemplate || !to || isLoading}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {isLoading ? (
                <>Sending...</>
              ) : (
                <>
                  <Send className="mr-2 h-4 w-4" />
                  Send Email
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
