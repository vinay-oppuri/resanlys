"use client";

import { useState, useEffect } from "react";
import { useTRPC } from "@workspace/trpc/client";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Button } from "@workspace/ui/components/button";
import { Input } from "@workspace/ui/components/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@workspace/ui/components/card";
import { Badge } from "@workspace/ui/components/badge";
import { Loader2, Search, MapPin, Briefcase, ExternalLink, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export const JobsSearchView = () => {
    const trpc = useTRPC();
    const [query, setQuery] = useState("");
    const [location, setLocation] = useState("");
    const [isSearching, setIsSearching] = useState(false);

    // Fetch latest job to get AI suggestions
    const { data: latestJob } = useQuery(trpc.jobs.getLatestJob.queryOptions());
    const searchQueries: string[] = (latestJob?.searchQueries as string[]) || [];

    // Mutation to trigger search (Inngest)
    const searchMutation = useMutation(trpc.jobSearch.search.mutationOptions({
        onSuccess: (data: any) => {
            if (data.status === "processing") {
                setIsSearching(true);
            } else if (data.status === "cached") {
                setIsSearching(false);
            }
        },
        onError: (err: any) => {
            console.error("Search failed", err);
            setIsSearching(false);
        }
    }));

    // Polling query
    const resultsQuery = useQuery({
        ...trpc.jobSearch.getResults.queryOptions({ query, location }),
        enabled: isSearching, // Only poll if we expect results
        refetchInterval: 2000, // Poll every 2s
    });

    // Stop polling if we got results
    if (isSearching && resultsQuery.data?.status === "complete") {
        setIsSearching(false);
    }

    // Determine results to show
    const jobs = searchMutation.data?.status === "cached"
        ? searchMutation.data.data
        : resultsQuery.data?.status === "complete"
            ? resultsQuery.data.data
            : [];

    const handleSearch = () => {
        if (!query || !location) return;
        searchMutation.mutate({ query, location });
    };

    const handleSuggestionClick = (suggestion: string) => {
        setQuery(suggestion);
        // Optional: auto-search if location is present, otherwise just focus location?
        // Let's just set query for now.
    };

    return (
        <div className="space-y-6 max-w-5xl mx-auto w-full">
            <div className="flex flex-col space-y-2">
                <h1 className="text-3xl font-bold tracking-tight">Job Search</h1>
                <p className="text-muted-foreground">
                    Find relevant jobs from Adzuna and other sources.
                </p>
            </div>

            <Card className="border-border/50 shadow-sm bg-muted/20">
                <CardHeader>
                    <CardTitle>Search Parameters</CardTitle>
                    <CardDescription>Enter keywords and location to start searching.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    {searchQueries.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-2">
                            <span className="text-xs font-semibold text-muted-foreground flex items-center gap-1">
                                <Sparkles className="w-3 h-3 text-yellow-500" />
                                AI Suggestions:
                            </span>
                            {searchQueries.map((q, i) => (
                                <Badge
                                    key={i}
                                    variant="secondary"
                                    className="cursor-pointer hover:bg-secondary/80 transition-colors"
                                    onClick={() => handleSuggestionClick(q)}
                                >
                                    {q}
                                </Badge>
                            ))}
                        </div>
                    )}

                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="flex-1 space-y-2">
                            <label className="text-sm font-medium">Keywords</label>
                            <div className="relative">
                                <Briefcase className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input
                                    className="pl-9"
                                    placeholder="e.g. Frontend Developer, React"
                                    value={query}
                                    onChange={(e) => setQuery(e.target.value)}
                                />
                            </div>
                        </div>
                        <div className="flex-1 space-y-2">
                            <label className="text-sm font-medium">Location</label>
                            <div className="relative">
                                <MapPin className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input
                                    className="pl-9"
                                    placeholder="e.g. New York, Remote, London"
                                    value={location}
                                    onChange={(e) => setLocation(e.target.value)}
                                />
                            </div>
                        </div>
                    </div>
                    <Button
                        onClick={handleSearch}
                        disabled={searchMutation.isPending || isSearching || !query || !location}
                        className="w-full md:w-auto"
                    >
                        {searchMutation.isPending || isSearching ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                {isSearching ? "Processing..." : "Starting Search..."}
                            </>
                        ) : (
                            <>
                                <Search className="mr-2 h-4 w-4" />
                                Search Jobs
                            </>
                        )}
                    </Button>
                </CardContent>
            </Card>

            <div className="space-y-4">
                {isSearching && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex flex-col items-center justify-center p-12 space-y-4 rounded-xl border border-dashed text-muted-foreground bg-muted/10"
                    >
                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                        <p>Searching external job boards (Adzuna)... usually takes a few seconds.</p>
                    </motion.div>
                )}

                <AnimatePresence>
                    {!isSearching && jobs.length > 0 && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="text-left w-full"
                        >
                            <p className="text-muted-foreground mb-4">Found {jobs.length} jobs</p>
                            <div className="grid gap-4 md:grid-cols-2">
                                {jobs.map((job: any) => (
                                    <JobCard key={job.id} job={job} />
                                ))}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {!isSearching && jobs.length === 0 && searchMutation.isSuccess && searchMutation.data?.status !== "processing" && (
                    <div className="text-center p-12 text-muted-foreground">
                        No jobs found. Try adjusting your search criteria.
                    </div>
                )}
            </div>
        </div>
    );
};

const JobCard = ({ job }: { job: any }) => {
    return (
        <Card className="flex flex-col h-full hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
                <div className="flex justify-between items-start gap-2">
                    <CardTitle className="text-lg line-clamp-1" title={job.title}>{job.title}</CardTitle>
                    <Badge variant="outline" className="shrink-0 capitalize">{job.source}</Badge>
                </div>
                <CardDescription className="line-clamp-1">{job.company} • {job.location}</CardDescription>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col gap-4">
                <p className="text-sm text-muted-foreground line-clamp-3">
                    {job.description?.replace(/<[^>]*>?/gm, "") || "No description available."}
                </p>
                <div className="mt-auto pt-2 flex items-center justify-between text-xs text-muted-foreground">
                    <span>{job.salary || "Salary not listed"}</span>
                    <Button variant="ghost" size="sm" className="h-8 group" asChild>
                        <a href={job.url} target="_blank" rel="noopener noreferrer">
                            Apply <ExternalLink className="ml-2 h-3 w-3 group-hover:scale-110 transition-transform" />
                        </a>
                    </Button>
                </div>
            </CardContent>
        </Card>
    )
}
