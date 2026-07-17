/**
 * Webhook — Unit Tests
 *
 * Tests signature verification and comment event parsing.
 */

import { describe, it, expect, vi, beforeEach } from "vitest";
import { verifyWebhookSignature, parseCommentEvents } from "../lib/meta/webhook";
import { createHmac } from "crypto";

// Mock the environment variable
beforeEach(() => {
  vi.stubEnv("FACEBOOK_APP_SECRET", "test_app_secret_12345");
});

describe("verifyWebhookSignature", () => {
  function createSignature(payload: string, secret: string): string {
    return (
      "sha256=" + createHmac("sha256", secret).update(payload).digest("hex")
    );
  }

  it("should return true for valid signature", () => {
    const payload = '{"test": "data"}';
    const signature = createSignature(payload, "test_app_secret_12345");
    expect(verifyWebhookSignature(payload, signature)).toBe(true);
  });

  it("should return false for invalid signature", () => {
    const payload = '{"test": "data"}';
    const signature = "sha256=invalid_signature_here";
    expect(verifyWebhookSignature(payload, signature)).toBe(false);
  });

  it("should return false for null signature", () => {
    expect(verifyWebhookSignature('{"test": "data"}', null)).toBe(false);
  });

  it("should return false for empty signature", () => {
    expect(verifyWebhookSignature('{"test": "data"}', "")).toBe(false);
  });

  it("should return false when payload is tampered", () => {
    const originalPayload = '{"test": "data"}';
    const signature = createSignature(originalPayload, "test_app_secret_12345");
    const tamperedPayload = '{"test": "tampered"}';
    expect(verifyWebhookSignature(tamperedPayload, signature)).toBe(false);
  });

  it("should return false when signed with wrong secret", () => {
    const payload = '{"test": "data"}';
    const signature = createSignature(payload, "wrong_secret");
    expect(verifyWebhookSignature(payload, signature)).toBe(false);
  });
});

describe("parseCommentEvents", () => {
  it("should parse a valid comment event", () => {
    const payload = {
      object: "instagram",
      entry: [
        {
          id: "page_123",
          time: 1234567890,
          changes: [
            {
              field: "comments",
              value: {
                id: "comment_456",
                text: "I want the LINK!",
                from: {
                  id: "user_789",
                  username: "testuser",
                },
                media: {
                  id: "media_101",
                },
              },
            },
          ],
        },
      ],
    };

    const events = parseCommentEvents(payload);
    expect(events).toHaveLength(1);
    expect(events[0]).toEqual({
      instagramAccountId: "page_123",
      commentId: "comment_456",
      commentText: "I want the LINK!",
      commenterId: "user_789",
      commenterName: "testuser",
      mediaId: "media_101",
    });
  });

  it("should ignore non-instagram objects", () => {
    const payload = {
      object: "page",
      entry: [
        {
          id: "page_123",
          time: 1234567890,
          changes: [
            {
              field: "comments",
              value: {
                id: "comment_456",
                text: "hello",
                from: { id: "user_789", username: "test" },
                media: { id: "media_101" },
              },
            },
          ],
        },
      ],
    };

    const events = parseCommentEvents(payload);
    expect(events).toHaveLength(0);
  });

  it("should ignore non-comment fields", () => {
    const payload = {
      object: "instagram",
      entry: [
        {
          id: "page_123",
          time: 1234567890,
          changes: [
            {
              field: "messages",
              value: {
                id: "msg_456",
                text: "hello",
                from: { id: "user_789", username: "test" },
                media: { id: "media_101" },
              },
            },
          ],
        },
      ],
    };

    const events = parseCommentEvents(payload);
    expect(events).toHaveLength(0);
  });

  it("should handle multiple comment events in one payload", () => {
    const payload = {
      object: "instagram",
      entry: [
        {
          id: "page_123",
          time: 1234567890,
          changes: [
            {
              field: "comments",
              value: {
                id: "comment_1",
                text: "LINK",
                from: { id: "user_1", username: "user1" },
                media: { id: "media_1" },
              },
            },
            {
              field: "comments",
              value: {
                id: "comment_2",
                text: "PRICE",
                from: { id: "user_2", username: "user2" },
                media: { id: "media_1" },
              },
            },
          ],
        },
      ],
    };

    const events = parseCommentEvents(payload);
    expect(events).toHaveLength(2);
  });

  it("should parse events with empty text so matching can decide later", () => {
    const payload = {
      object: "instagram",
      entry: [
        {
          id: "page_123",
          time: 1234567890,
          changes: [
            {
              field: "comments",
              value: {
                id: "comment_1",
                text: "", // empty text
                from: { id: "user_1", username: "user1" },
                media: { id: "media_1" },
              },
            },
          ],
        },
      ],
    };

    const events = parseCommentEvents(payload);
    expect(events).toHaveLength(1);
    expect(events[0].commentText).toBe("");
  });

  it("should ignore comments from the connected account itself", () => {
    const payload = {
      object: "instagram",
      entry: [
        {
          id: "page_123",
          time: 1234567890,
          changes: [
            {
              field: "comments",
              value: {
                id: "comment_1",
                text: "LINK",
                from: { id: "page_123", username: "ourbrand" },
                media: { id: "media_1" },
              },
            },
          ],
        },
      ],
    };

    expect(parseCommentEvents(payload)).toHaveLength(0);
  });

  it("should still parse other users' comments alongside a self-comment", () => {
    const payload = {
      object: "instagram",
      entry: [
        {
          id: "page_123",
          time: 1234567890,
          changes: [
            {
              field: "comments",
              value: {
                id: "comment_1",
                text: "LINK",
                from: { id: "page_123", username: "ourbrand" },
                media: { id: "media_1" },
              },
            },
            {
              field: "comments",
              value: {
                id: "comment_2",
                text: "LINK",
                from: { id: "user_2", username: "user2" },
                media: { id: "media_1" },
              },
            },
          ],
        },
      ],
    };

    const events = parseCommentEvents(payload);
    expect(events).toHaveLength(1);
    expect(events[0].commenterId).toBe("user_2");
  });

  it("should handle entries without changes", () => {
    const payload = {
      object: "instagram",
      entry: [
        {
          id: "page_123",
          time: 1234567890,
          // no changes field
        },
      ],
    };

    const events = parseCommentEvents(payload);
    expect(events).toHaveLength(0);
  });
});
