# Security Specification: Kutana Africa Social Network

## 1. Data Invariants
- Users can only edit and delete their own profiles (`request.auth.uid == userId`).
- Posts can only be created by signed-in users matching `authorId == request.auth.uid`.
- Posts can only be edited or deleted by the post author or an administrator (`mutisya104@gmail.com`).
- Action layer updates on opportunities (e.g. status) can only be performed by the opportunity creator.
- Circle creation is restricted to authenticated users. Only circle owners or admins can modify circle settings.
- Private circles restrict post reads to approved circle members or admins.
- Likes and bookmarks can only be created/deleted by the authenticated user (`userId == request.auth.uid`).
- Opportunity responses can only be viewed by the opportunity owner and the respondent.
- Reports can be submitted by signed-in users, but can only be read and reviewed by administrators.

## 2. Dirty Dozen Threat Payloads
1. **Ghost Admin Escalation**: User attempts to set `isAdmin: true` during profile creation.
2. **Impersonated Post**: User attempts to publish a post with `authorId` pointing to another user.
3. **Malicious ID Injection**: Request sends path variable with 2KB junk characters.
4. **Opportunity Hijack**: Non-owner attempts to mark another creator's project opportunity as closed.
5. **Unauthorized Response Viewing**: Non-owner and non-respondent attempts to read private application details.
6. **Cross-User Bookmark Snooping**: User queries other users' private bookmarks.
7. **Unverified Email Spoof**: Request with spoofed unverified email claiming admin privileges.
8. **Shadow Field Injection**: Attempt to inject arbitrary hidden keys on a post update.
9. **Post Content Flooding**: Content payload with > 1MB unconstrained string.
10. **Report Tampering**: Non-admin attempts to dismiss or modify status of pending moderation reports.
11. **Negative Counters Attack**: Direct client mutation attempting to decrement counters arbitrarily.
12. **Private Circle Exfiltration**: Anonymous or non-member listing posts belonging to private circles.
