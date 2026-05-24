"use client";

/**
 * New Campaign Page
 *
 * Form to create a new campaign with goal, account, post picker, keywords, DM message, and active state.
 */

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import KeywordInput from "@/components/keyword-input";
import PostPicker from "@/components/post-picker";
import { getCampaignTemplate } from "@/lib/templates/campaign-templates";

export default function NewCampaignPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const selectedTemplate = getCampaignTemplate(searchParams.get("template"));
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [name, setName] = useState(selectedTemplate?.title ?? "");
  const [goal, setGoal] = useState(selectedTemplate?.goal ?? "");
  const [accountUsername, setAccountUsername] = useState<string | null>(null);
  const [postId, setPostId] = useState<string | null>(null);
  const [postUrl, setPostUrl] = useState<string | undefined>();
  const [keywords, setKeywords] = useState<string[]>(
    selectedTemplate?.keywords ?? []
  );
  const [dmMessage, setDmMessage] = useState(selectedTemplate?.dmMessage ?? "");
  const [wholeWordMatch, setWholeWordMatch] = useState(true);
  const [isActive, setIsActive] = useState(true);

  useEffect(() => {
    fetch("/api/dashboard/stats")
      .then((res) => res.json())
      .then((payload) => {
        if (payload.success) {
          setAccountUsername(payload.data.instagramAccount?.username ?? null);
        }
      })
      .catch(() => setAccountUsername(null));
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name || !goal || !postId || keywords.length === 0 || !dmMessage) {
      setError("Please fill in all required fields");
      return;
    }

    setSaving(true);
    setError(null);

    try {
      const res = await fetch("/api/automations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          goal,
          postId,
          postUrl: postUrl ?? null,
          keywords,
          dmMessage,
          wholeWordMatch,
          isActive,
        }),
      });

      const data = await res.json();
      if (data.success) {
        router.push("/campaigns");
      } else {
        setError(data.error ?? "Failed to create campaign");
      }
    } catch {
      setError("Failed to create campaign");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="max-w-2xl mx-auto animate-fade-in">
      <form onSubmit={handleSubmit} className="space-y-8">
        {error && (
          <div className="p-4 rounded-xl bg-error/10 border border-error/20 text-error text-sm">
            {error}
          </div>
        )}

        {selectedTemplate && (
          <div className="border border-cyan-200/20 bg-cyan-300/10 p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-cyan-100">
              Template loaded
            </p>
            <p className="mt-2 text-sm font-semibold text-white">
              {selectedTemplate.title}
            </p>
            <p className="mt-1 text-xs leading-5 text-zinc-300">
              Pick the Instagram post or reel, adjust the copy, and launch when
              the connection is ready.
            </p>
          </div>
        )}

        {/* Name */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-foreground">
            Campaign Name <span className="text-error">*</span>
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Product launch link drop"
            className="w-full px-4 py-3 rounded-xl bg-surface border border-border text-sm text-foreground placeholder:text-zinc-500 focus:border-accent/40 focus:outline-none transition-colors"
            maxLength={100}
          />
        </div>

        {/* Goal */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-foreground">
            Campaign Goal <span className="text-error">*</span>
          </label>
          <select
            value={goal}
            onChange={(e) => setGoal(e.target.value)}
            className="w-full px-4 py-3 rounded-xl bg-surface border border-border text-sm text-foreground focus:border-accent/40 focus:outline-none transition-colors"
          >
            <option value="">Select a goal</option>
            <option value="Lead magnet delivery">Lead magnet delivery</option>
            <option value="Product link request">Product link request</option>
            <option value="Price or availability reply">Price or availability reply</option>
            <option value="Launch waitlist">Launch waitlist</option>
            <option value="Agency client campaign">Agency client campaign</option>
          </select>
        </div>

        {/* Instagram Account */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-foreground">
            Instagram Account <span className="text-error">*</span>
          </label>
          <div className="rounded-xl border border-border bg-surface px-4 py-3 text-sm text-foreground">
            {accountUsername ? `@${accountUsername}` : "Connect Instagram before launching a campaign"}
          </div>
        </div>

        {/* Post Picker */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-foreground">
            Campaign Post Or Reel <span className="text-error">*</span>
          </label>
          <p className="text-xs text-muted mb-3">
            Choose which Instagram post or reel should trigger the campaign.
          </p>
          <div className="glass rounded-xl p-4">
            <PostPicker
              selectedPostId={postId}
              onSelect={(id, url) => {
                setPostId(id);
                setPostUrl(url);
              }}
            />
          </div>
        </div>

        {/* Keywords */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-foreground">
            Comment Keywords <span className="text-error">*</span>
          </label>
          <p className="text-xs text-muted mb-1">
            When someone comments any of these keywords, the campaign sends the private reply.
          </p>
          <KeywordInput keywords={keywords} onChange={setKeywords} />
        </div>

        {/* DM Message */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-foreground">
            Private Reply Message <span className="text-error">*</span>
          </label>
          <textarea
            value={dmMessage}
            onChange={(e) => setDmMessage(e.target.value)}
            placeholder="Hey {username}! Here's the link you asked for: https://..."
            rows={4}
            className="w-full px-4 py-3 rounded-xl bg-surface border border-border text-sm text-foreground placeholder:text-zinc-500 focus:border-accent/40 focus:outline-none transition-colors resize-none"
            maxLength={1000}
          />
          <p className="text-xs text-muted">
            Use <code className="px-1 py-0.5 rounded bg-surface-hover text-accent font-mono text-[11px]">{"{username}"}</code> to
            personalize with the commenter&apos;s name
          </p>
        </div>

        {/* Options */}
        <div className="space-y-4">
          <label className="flex items-center gap-3 cursor-pointer group">
            <button
              type="button"
              onClick={() => setWholeWordMatch(!wholeWordMatch)}
              className={`
                relative w-11 h-6 rounded-full transition-colors
                ${wholeWordMatch ? "bg-accent" : "bg-zinc-700"}
              `}
            >
              <span
                className={`
                  absolute top-1 w-4 h-4 rounded-full bg-white transition-transform shadow-sm
                  ${wholeWordMatch ? "left-6" : "left-1"}
                `}
              />
            </button>
            <div>
              <span className="text-sm font-medium text-foreground">Whole word match</span>
              <p className="text-xs text-muted">
                {wholeWordMatch
                  ? '"linking" won\'t trigger "LINK"'
                  : '"linking" WILL trigger "LINK"'}
              </p>
            </div>
          </label>
          <label className="flex items-center gap-3 cursor-pointer group">
            <button
              type="button"
              onClick={() => setIsActive(!isActive)}
              className={`
                relative w-11 h-6 rounded-full transition-colors
                ${isActive ? "bg-accent" : "bg-zinc-700"}
              `}
            >
              <span
                className={`
                  absolute top-1 w-4 h-4 rounded-full bg-white transition-transform shadow-sm
                  ${isActive ? "left-6" : "left-1"}
                `}
              />
            </button>
            <div>
              <span className="text-sm font-medium text-foreground">Launch active</span>
              <p className="text-xs text-muted">
                {isActive ? "Campaign starts listening after creation" : "Campaign is saved paused"}
              </p>
            </div>
          </label>
        </div>

        {/* Submit */}
        <div className="flex items-center gap-4 pt-4 border-t border-border">
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-500 to-violet-500 text-sm font-semibold text-white shadow-lg shadow-indigo-500/20 hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:pointer-events-none"
          >
            {saving ? (
              <>
                <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Creating...
              </>
            ) : (
              "Create Campaign"
            )}
          </button>
          <button
            type="button"
            onClick={() => router.back()}
            className="px-6 py-3 rounded-xl text-sm font-medium text-muted hover:text-foreground hover:bg-surface-hover border border-border transition-colors"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
