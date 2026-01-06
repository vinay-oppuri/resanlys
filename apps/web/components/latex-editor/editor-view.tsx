"use client";

import { useState, useEffect, useRef } from "react";
import Editor from "@monaco-editor/react";
import { Button } from "@workspace/ui/components/button";
import { toast } from "sonner";
import { Loader2, Save, Play } from "lucide-react";
import { useTRPC } from "@workspace/trpc/client";
import { useQuery } from "@tanstack/react-query";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@workspace/ui/components/resizable";
import { useTheme } from "next-themes";

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

  const sourceRef = useRef(source); // Ref to hold latest source for unmount
  useEffect(() => {
    sourceRef.current = source;
  }, [source]);

  // Theme logic
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // pdfUrl is now derived from query data or local state if needed (but we prefer query data)
  const [isCompilingLocal, setIsCompilingLocal] = useState(false); // Validating request state
  const [isSaving, setIsSaving] = useState(false);


  const trpc = useTRPC();

  // Poll for compiled PDF status
  const { data: compiledData } = useQuery({
    ...trpc.resume.getCompiledPDF.queryOptions({ resumeId }),
    refetchInterval: (query) => {
      const status = query.state.data?.status;
      return (status === "queued" || status === "compiling") ? 1000 : false;
    }
  });

  useEffect(() => {
    if (initialSource) {
      setSource(initialSource);
    }
  }, [initialSource]);

  // Auto-save on unmount
  useEffect(() => {
    return () => {
      // NOTE: This fires on navigation away. 
      // We cannot await this, but we can fire the promise.
      const currentSource = sourceRef.current;
      if (currentSource && currentSource !== initialSource) {
        onSave(currentSource).catch(console.error);
        toast.success("Auto-saving...");
      }
    };
  }, []); // Only on unmount

  const handleSave = async (silent = false) => {
    setIsSaving(true);
    try {
      await onSave(source);
      if (!silent) toast.success("Saved");
    } catch {
      if (!silent) toast.error("Save failed");
    } finally {
      setIsSaving(false);
    }
  };

  const handleCompile = async (): Promise<boolean> => {
    setIsCompilingLocal(true);

    try {
      // 1. Trigger compilation
      const res = await fetch("/api/compile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ latexSource: source, resumeId }), // Pass resumeId to ensure update
      });

      if (!res.ok) {
        throw new Error("Compilation failed to start");
      }

      toast.info("Compilation started...");
      return true;

    } catch (err: any) {
      toast.error("Compilation failed", {
        description: err.message,
      });
      return false;
    } finally {
      setIsCompilingLocal(false);
    }
  };

  const isCompiling = isCompilingLocal || compiledData?.status === "compiling" || compiledData?.status === "queued";
  const pdfContent = compiledData?.pdfContent;
  const pdfDataUrl = pdfContent ? `data:application/pdf;base64,${pdfContent}` : null;


  return (
    <div className="flex flex-col h-[calc(100vh-64px)]">
      <div className="flex items-center justify-between p-4 border-b bg-background">
        <h2 className="font-semibold text-foreground">LaTeX Editor</h2>
        <div className="flex gap-2">
          <Button onClick={() => handleSave()} disabled={isSaving} variant="outline" size="sm">
            {isSaving ? <Loader2 className="animate-spin mr-2 h-4 w-4" /> : <Save className="mr-2 h-4 w-4" />}
            Save
          </Button>
          <Button onClick={handleCompile} disabled={isCompiling} size="sm">
            {isCompiling ? <Loader2 className="animate-spin mr-2 h-4 w-4" /> : <Play className="mr-2 h-4 w-4" />}
            {isCompiling ? "Compiling..." : "Compile"}
          </Button>

        </div>
      </div>

      <div className="flex-1 overflow-hidden">
        <ResizablePanelGroup>
          <ResizablePanel defaultSize={50} minSize={20}>
            {mounted && (
              <Editor
                height="100%"
                language="latex" // Correct language ID for syntax highlighting if 'latex' is registered, else 'plaintext'
                theme={resolvedTheme === "dark" ? "vs-dark" : "light"}
                value={source}
                onChange={(v) => setSource(v ?? "")}
                options={{
                  wordWrap: "on",
                  minimap: { enabled: false },
                  fontSize: 14,
                  automaticLayout: true,
                  padding: { top: 16 }
                }}
              />
            )}
          </ResizablePanel>

          <ResizableHandle withHandle />

          <ResizablePanel defaultSize={50} minSize={20} className="bg-muted/30">
            {pdfDataUrl ? (
              <iframe
                src={pdfDataUrl}
                className="w-full h-full border-none"
                title="PDF Preview"
              />
            ) : (
              <div className="flex flex-col h-full items-center justify-center text-muted-foreground gap-4">
                {isCompiling ? (
                  <>
                    <Loader2 className="w-10 h-10 animate-spin opacity-50" />
                    <span className="text-sm font-medium">Compiling PDF...</span>
                  </>
                ) : (
                  <div className="text-center p-6">
                    <Play className="w-12 h-12 mx-auto mb-4 opacity-20" />
                    <p className="text-sm">Click <strong>Compile</strong> to generate preview</p>
                  </div>
                )}
              </div>
            )}
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    </div>
  );
}