"use client";

import { useState, useEffect } from "react";

interface CategoryVoteButtonProps {
  categoryId: string;
  upvotes: number;
  downvotes: number;
  size?: "sm" | "md" | "lg";
}

export default function CategoryVoteButton({
  categoryId,
  upvotes: initialUpvotes,
  downvotes: initialDownvotes,
  size = "md",
}: CategoryVoteButtonProps) {
  const [upvotes, setUpvotes] = useState(initialUpvotes);
  const [downvotes, setDownvotes] = useState(initialDownvotes);
  const [userVote, setUserVote] = useState<"up" | "down" | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Get or create voter ID from localStorage
  const getVoterId = () => {
    if (typeof window === "undefined") return null;
    
    let voterId = localStorage.getItem("floor-voter-id");
    if (!voterId) {
      voterId = `voter-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
      localStorage.setItem("floor-voter-id", voterId);
    }
    return voterId;
  };

  // Fetch user's existing vote
  useEffect(() => {
    const voterId = getVoterId();
    if (!voterId) return;

    fetch(`/api/vote?categoryId=${categoryId}&voterId=${voterId}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.voteType) {
          setUserVote(data.voteType);
        }
      })
      .catch(console.error);
  }, [categoryId]);

  const handleVote = async (voteType: "up" | "down") => {
    const voterId = getVoterId();
    if (!voterId || isLoading) return;

    setIsLoading(true);

    try {
      const response = await fetch("/api/vote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          categoryId,
          voterId,
          voteType,
        }),
      });

      const data = await response.json();

      if (data.action === "created") {
        if (voteType === "up") {
          setUpvotes((prev) => prev + 1);
        } else {
          setDownvotes((prev) => prev + 1);
        }
        setUserVote(voteType);
      } else if (data.action === "removed") {
        if (userVote === "up") {
          setUpvotes((prev) => Math.max(0, prev - 1));
        } else {
          setDownvotes((prev) => Math.max(0, prev - 1));
        }
        setUserVote(null);
      } else if (data.action === "changed") {
        if (voteType === "up") {
          setUpvotes((prev) => prev + 1);
          setDownvotes((prev) => Math.max(0, prev - 1));
        } else {
          setDownvotes((prev) => prev + 1);
          setUpvotes((prev) => Math.max(0, prev - 1));
        }
        setUserVote(voteType);
      }
    } catch (error) {
      console.error("Vote error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const sizeClasses = {
    sm: "text-xs px-2 py-1",
    md: "text-sm px-3 py-1.5",
    lg: "text-base px-4 py-2",
  };

  const iconSize = {
    sm: "w-3 h-3",
    md: "w-4 h-4",
    lg: "w-5 h-5",
  };

  const score = upvotes - downvotes;

  return (
    <div className="flex items-center gap-1">
      <button
        className={`flex items-center gap-1 rounded-l-md transition-colors ${sizeClasses[size]} ${
          userVote === "up"
            ? "bg-green-600 text-white"
            : "bg-gray-700 text-gray-300 hover:bg-gray-600"
        } ${isLoading ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
        onClick={() => handleVote("up")}
        disabled={isLoading}
        title="Upvote"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2}
          stroke="currentColor"
          className={iconSize[size]}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M4.5 15.75l7.5-7.5 7.5 7.5"
          />
        </svg>
        <span>{upvotes}</span>
      </button>
      
      <div className={`${sizeClasses[size]} bg-gray-800 text-white font-semibold`}>
        {score >= 0 ? `+${score}` : score}
      </div>
      
      <button
        className={`flex items-center gap-1 rounded-r-md transition-colors ${sizeClasses[size]} ${
          userVote === "down"
            ? "bg-red-600 text-white"
            : "bg-gray-700 text-gray-300 hover:bg-gray-600"
        } ${isLoading ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
        onClick={() => handleVote("down")}
        disabled={isLoading}
        title="Downvote"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2}
          stroke="currentColor"
          className={iconSize[size]}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M19.5 8.25l-7.5 7.5-7.5-7.5"
          />
        </svg>
        <span>{downvotes}</span>
      </button>
    </div>
  );
}
