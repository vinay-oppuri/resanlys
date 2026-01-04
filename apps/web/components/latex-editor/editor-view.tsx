"use client";

import React, { useState, useEffect, useRef } from "react";
import Editor from "@monaco-editor/react";
import { Button } from "@workspace/ui/components/button";
import { toast } from "sonner";
import { Loader2, Save, Play } from "lucide-react";

interface EditorViewProps {
  resumeId: string;
  initialSource?: string | null;
  onSave: (source: string) => Promise<void>;
}

export function EditorView({
  resumeId,
  initialSource,
  onSave,
}: EditorViewProps) {
  const [source, setSource] = useState(
    initialSource ?? "% Write your LaTeX here..."
  );
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [isCompiling, setIsCompiling] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const lastUrlRef = useRef<string | null>(null);

  useEffect(() => {
    if (initialSource) {
      setSource(initialSource);
    }
  }, [initialSource]);

  useEffect(() => {
    return () => {
      if (lastUrlRef.current) {
        URL.revokeObjectURL(lastUrlRef.current);
      }
    };
  }, []);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await onSave(source);
      toast.success("Saved");
    } catch {
      toast.error("Save failed");
    } finally {
      setIsSaving(false);
    }
  };

  const handleCompile = async () => {
    setIsCompiling(true);

    try {
      const res = await fetch("/api/compile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ latexSource: source }),
      });

      if (!res.ok) {
        throw new Error("Compilation failed");
      }

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);

      if (lastUrlRef.current) {
        URL.revokeObjectURL(lastUrlRef.current);
      }

      lastUrlRef.current = url;
      setPdfUrl(url);

      if (res.headers.get("X-Compilation-Status") === "fallback") {
        toast.warning("Preview mode", {
          description: "Showing raw LaTeX source",
        });
      } else {
        toast.success("Compiled successfully");
      }
    } catch (err: any) {
      toast.error("Compilation failed", {
        description: err.message,
      });
    } finally {
      setIsCompiling(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-64px)]">
      <div className="flex items-center justify-between p-4 border-b">
        <h2 className="font-semibold">LaTeX Editor</h2>
        <div className="flex gap-2">
          <Button onClick={handleSave} disabled={isSaving}>
            {isSaving ? <Loader2 className="animate-spin mr-2" /> : <Save className="mr-2" />}
            Save
          </Button>
          <Button onClick={handleCompile} disabled={isCompiling}>
            {isCompiling ? <Loader2 className="animate-spin mr-2" /> : <Play className="mr-2" />}
            Compile
          </Button>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        <div className="w-1/2 border-r">
          <Editor
            height="100%"
            language="plaintext" // safest
            theme="vs-dark"
            value={source}
            onChange={(v) => setSource(v ?? "")}
            options={{
              wordWrap: "on",
              minimap: { enabled: false },
              fontSize: 14,
            }}
          />
        </div>

        <div className="w-1/2 bg-muted">
          {pdfUrl ? (
            <iframe src={pdfUrl} className="w-full h-full" />
          ) : (
            <div className="flex h-full items-center justify-center text-muted-foreground">
              Click Compile to preview
            </div>
          )}
        </div>
      </div>
    </div>
  );
}