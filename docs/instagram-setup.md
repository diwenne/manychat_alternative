# Instagram and Meta setup

This is the part that takes real time. The code works out of the box; getting Meta to send you comment events is where people lose an afternoon. This guide is written from the exact wrong turns you can take, so read it in order.

## What you need first

- A Facebook account. Meta developer registration is built on it. There is no Instagram-only path.
- An Instagram Business or Creator account. A personal account cannot be connected. Switch it in the Instagram app under Settings, Account type, if needed.
- Your OpenReply instance deployed and reachable over HTTPS. Meta will not send webhooks to localhost. For local development, use a tunnel like ngrok and point everything at the tunnel URL.

## 1. Create the Meta app

Go to [developers.facebook.com/apps](https://developers.facebook.com/apps) and create an app.

- App type: Business.
- Contact email: one you actually check.

When it asks you to add a use case, pick "All" in the filter, then choose **Manage messaging and content on Instagram**. Do not pick "Create and manage ads with Marketing API", and do not pick "Authenticate with Facebook Login". OpenReply uses Instagram Login, and picking the Facebook Login variant makes the OAuth flow fail later with a mismatched client error.

If you accidentally added the Marketing API use case, remove it. It has its own heavy review requirements and can block publishing.

## 2. Collect the three secrets

There are two app secrets and two app IDs, which is confusing. Here is what maps to what.

| Environment variable | Where it lives |
| --- | --- |
| `INSTAGRAM_APP_ID` | Instagram, API setup with Instagram login. A number like `2036...` |
| `INSTAGRAM_APP_SECRET` | Same page, click Show |
| `FACEBOOK_APP_SECRET` | App settings, Basic, App secret, click Show |

The Instagram app ID is not the same number as the Facebook App ID shown on the Basic settings page. Use the one under the Instagram product.

OpenReply verifies webhook signatures against both `FACEBOOK_APP_SECRET` and `INSTAGRAM_APP_SECRET`, so you do not have to guess which one Meta signs with. Set both.

## 3. Register the OAuth redirect

In the Instagram product, open **Set up Instagram business login**, then **Business login settings**. In the OAuth redirect URIs field, add exactly:

```
https://YOUR-DOMAIN/api/instagram/callback
```

No trailing slash. If this is missing or wrong, connecting an account fails with a redirect_uri mismatch.

You do not need the "Embed URL" that Meta shows here. OpenReply builds its own login URL. Users connect by opening your app, going to Settings, and clicking Connect Instagram.

## 4. Configure the webhook

Still in the Instagram product, find the **Configure webhooks** step.

- Callback URL: `https://YOUR-DOMAIN/api/webhook`
- Verify token: the value of `WEBHOOK_VERIFY_TOKEN` from your `.env`
- Click Verify and save. It should succeed immediately, because the app answers Meta's verification challenge.
- Subscribe to the `comments` field.

To test delivery without a real comment, click Test next to `comments`, then click **Send to My Server**. This is a two-step control. Clicking Test only previews the sample payload. The second button is what actually sends it to your endpoint.

## 5. The account ID trap

This one is silent and costs the most time, so it is worth understanding even though OpenReply already handles it.

When you connect an account, Meta's `/me` endpoint returns two IDs. The `id` field is an app-scoped ID. The `user_id` field is the Instagram professional account ID. Webhooks put `user_id` in `entry.id`, and the messaging API keys off `user_id` too. If you store `id` instead, comment webhooks arrive but never match a campaign, and nothing sends.

OpenReply stores `user_id`, so a fresh connection works. If you upgraded from an older build and an existing account has the wrong ID stored, disconnect and reconnect it once.

## 6. Publish the app

Real comment webhooks are only delivered when the app is in Live state. In Development mode, only the console Test button delivers events. This is the single reason "I set everything up and nothing happens" happens.

Go to the **Publish** item in the left sidebar. Set the privacy policy, terms of service, and data deletion URLs first, or it will not let you publish. OpenReply ships these pages:

```
https://YOUR-DOMAIN/privacy
https://YOUR-DOMAIN/data-deletion
https://YOUR-DOMAIN/terms
```

Then publish. Depending on your access level, Meta may let you go live for your own tester accounts immediately, or it may require App Review first (see below).

## 7. Test end to end

1. Add the Instagram account you want to use as a tester under App roles, Roles, and accept the invite from the Instagram side. Your own account counts once you accept.
2. Connect it in the app: Settings, Connect Instagram.
3. Create a campaign on one of your posts with a keyword like `TEST`.
4. From a different Instagram account, comment `TEST` on that post. It must be a different account, because OpenReply ignores your own comments on purpose.
5. Watch for the DM. If nothing arrives, check the DM Logs page and `/api/health`.

If you self-host and want to inspect the pipeline, the Postgres tables tell you where a comment stopped: `WebhookEvent` for delivery, `DmLog` for send status and errors, `OperationalEvent` for worker crashes.

## Using it just for yourself

If you only want to automate your own accounts, or a small number of accounts you add as testers, you are done after step 7. Development plus tester roles is enough. You do not need App Review or a registered business.

## Letting other people use your instance

This is the only case that needs App Review. For a stranger to connect their Instagram to your hosted instance, Meta has to grant Advanced Access on the messaging and comments permissions, and that requires:

- A screencast of the full flow working, recorded on real accounts in one take.
- A written justification for each permission. Drafts are in [META_APP_REVIEW.md](../META_APP_REVIEW.md).
- Business verification, which asks for a document proving a legal business entity (registration, incorporation, tax document, or a business bank statement).

Meta scrutinizes apps that send automated DMs and often rejects the first submission, so budget for a resubmit. If you do not have a registered business, note that most self-hosters skip all of this by running their own instance for their own account, which never needs review.
