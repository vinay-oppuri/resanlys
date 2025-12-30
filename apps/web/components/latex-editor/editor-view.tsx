
"use client";

import React, { useState, useEffect } from "react";
import Editor from "@monaco-editor/react";
import { Button } from "@workspace/ui/components/button";
import { toast } from "sonner";
import { Loader2, Save, Play } from "lucide-react";

interface EditorViewProps {
    resumeId: string;
    initialSource?: string | null;
    onSave: (source: string) => Promise<void>;
}

export function EditorView({ resumeId, initialSource, onSave }: EditorViewProps) {
    const [source, setSource] = useState(initialSource || "% Write your LaTeX here...");
    const [pdfUrl, setPdfUrl] = useState<string | null>(null);
    const [isCompiling, setIsCompiling] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    // Auto-compile initial source if provided
    useEffect(() => {
        if (initialSource) {
            handleCompile();
        }
    }, []);

    const handleEditorChange = (value: string | undefined) => {
        setSource(value || "");
    };

    const handleSave = async () => {
        setIsSaving(true);
        try {
            await onSave(source);
            toast.success("Saved successfully");
        } catch (error) {
            toast.error("Failed to save");
            console.error(error);
        } finally {
            setIsSaving(false);
        }
    };

    const handleCompile = async () => {
        setIsCompiling(true);
        try {
            const response = await fetch("/api/compile", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ latexSource: source }),
            });

            if (!response.ok) {
                throw new Error("Compilation failed");
            }

            const blob = await response.blob();
            const url = URL.createObjectURL(blob);
            setPdfUrl(url);
            toast.success("Compiled successfully");
        } catch (error) {
            toast.error("Compilation failed");
            console.error(error);
        } finally {
            setIsCompiling(false);
        }
    };

    return (
        <div className="flex flex-col h-[calc(100vh-64px)] w-full">
            {/* Toolbar */}
            <div className="flex items-center justify-between p-4 border-b border-border bg-background">
                <h2 className="text-lg font-semibold">LaTeX Editor</h2>
                <div className="flex gap-2">
                    <Button variant="outline" onClick={handleSave} disabled={isSaving}>
                        {isSaving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Save className="w-4 h-4 mr-2" />}
                        Save
                    </Button>
                    <Button onClick={handleCompile} disabled={isCompiling}>
                        {isCompiling ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Play className="w-4 h-4 mr-2" />}
                        Compile
                    </Button>
                </div>
            </div>

            {/* Split View */}
            <div className="flex flex-1 overflow-hidden">
                {/* Editor Pane */}
                <div className="w-1/2 border-r border-border">
                    <Editor
                        height="100%"
                        defaultLanguage="latex" // Monaco doesn't have built-in latex highlighting by default, but it's okay for now or we can use "params"
                        language="bg" // using plain text or finding a latex plugin if possible. Actually 'latex' might not be supported out of box.
                        // Let's try 'latex' anyway, mapped to 'plaintext' if missing.
                        // A better options is 'ini' or 'shell' for basic highlighting if latex is missing.
                        // However, let's stick to 'latex' and see.
                        value={source}
                        onChange={handleEditorChange}
                        theme="vs-dark"
                        options={{
                            minimap: { enabled: false },
                            wordWrap: "on",
                        }}
                    />
                </div>

                {/* Preview Pane */}
                <div className="w-1/2 bg-gray-100 flex items-center justify-center">
                    {pdfUrl ? (
                        <iframe
                            src={pdfUrl}
                            className="w-full h-full"
                            title="PDF Preview"
                        />
                    ) : (
                        <div className="text-muted-foreground">
                            Click "Compile" to see preview
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
