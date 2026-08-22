---
title: "Authentication Proxies"
description: "Keep Kobo, KOReader, and OPDS working when Cloudflare Access, Authelia, or another login proxy sits in front of BookOrbit."
---


A login proxy in front of BookOrbit protects the web interface, but it also intercepts the requests your devices make. Cloudflare Access, Authelia, Authentik, Traefik forward-auth, and a plain basic-auth block in Nginx or Caddy all behave the same way here: the proxy answers first, and BookOrbit never sees the request.

A Kobo, KOReader, or an OPDS reader cannot complete an interactive browser sign-in. It asks for a feed or a JSON response and receives an HTML login page instead.

This page is only about proxies that add their own login. If your proxy just forwards traffic, see [Installation](/installation#reverse-proxy) and the reverse-proxy section on the [Kobo Sync](/kobo#reverse-proxy-configuration) page instead.

## How The Failure Looks

The most common symptom is no symptom at all.

| Client | What you see |
|--------|--------------|
| OPDS reader | The catalog opens but is completely empty, with no error. The reader followed the redirect and parsed the login page, which contains no books. |
| KOReader | Sync appears to do nothing. Progress never moves in either direction. |
| Kobo | The device syncs books normally but highlights and annotations never appear in BookOrbit. |

Because the login page is a valid HTTP response, most clients treat it as an empty result rather than a failure.

## Paths That Must Skip The Proxy Login

Each of these carries its own BookOrbit credential, so they do not need a second login layer to be safe.

| Path | Used by |
|------|---------|
| `/api/v1/opds` and everything under it | OPDS readers, including covers and downloads |
| `/api/v1/koreader` and everything under it | KOReader sync and the BookOrbit KOReader plugin |
| `/api/v1/kobo/` and everything under it | Kobo book sync, covers, and downloads |
| `/api/v3/` and everything under it | Kobo highlights and annotations |
| `/api/UserStorage/` and everything under it | Kobo device storage metadata |

Two of these catch people out.

:::caution[The OPDS catalog root has no trailing path]
The OPDS root is served at exactly `/api/v1/opds`, with nothing after it. A rule written as `/api/v1/opds/*` will not match it, because that pattern requires a slash and at least one more character. Every subsection works while the catalog itself stays empty, which is a hard symptom to trace. Write the rule so it matches the bare path too.
:::

:::caution[Kobo highlights are not under `/api/v1`]
Kobo firmware sends highlights and annotations to fixed paths at the root of your domain, so `/api/v3/` and `/api/UserStorage/` sit outside the `/api/v1/kobo/` prefix. Miss them and book sync keeps working while highlights silently never move.
:::

Nothing else needs to skip the login. The management screens that share these prefixes, such as `/api/v1/kobo/devices` and `/api/v1/koreader/credentials`, still require a BookOrbit session and reject anonymous requests on their own.

## Cloudflare Access

Cloudflare evaluates Access applications per path, so add one Bypass application for each prefix and leave your existing Google or other identity-provider application in place for the rest of the domain.

In the **Zero Trust** dashboard, go to **Access > Applications > Add an application > Self-hosted** and create these:

| Application name | Path |
|------------------|------|
| BookOrbit OPDS | `api/v1/opds*` |
| BookOrbit KOReader | `api/v1/koreader*` |
| BookOrbit Kobo | `api/v1/kobo/*` |
| BookOrbit Kobo Annotations | `api/v3*` |
| BookOrbit Kobo Storage | `api/UserStorage*` |

For each one, set the domain to your BookOrbit hostname with no subdomain, add the path above, and give it a single policy with the action **Bypass** and an include rule of **Everyone**. The identity-provider settings are ignored by a Bypass policy.

Note the asterisks. `api/v1/opds*` matches the bare catalog root and everything below it, while `api/v1/opds/*` would miss the root.

:::note
If a broader application covering the whole domain keeps winning over a narrower one, re-save the narrow applications, or move the API paths to a dedicated subdomain and scope the Bypass applications to that host instead. Host-level precedence is more reliable than path-level precedence.
:::

## Caddy

Handle the device paths in their own block, before the block that applies the login.

```text
books.example.com {
    @devices path /api/v1/opds* /api/v1/koreader* /api/v1/kobo/* /api/v3/* /api/UserStorage/*

    handle @devices {
        reverse_proxy localhost:3000
    }

    handle {
        forward_auth localhost:9091 {
            uri /api/verify?rd=https://auth.example.com
            copy_headers Remote-User Remote-Groups Remote-Name Remote-Email
        }
        reverse_proxy localhost:3000
    }
}
```

## Nginx

Give the device paths a location without `auth_request`. Keep the forwarded headers described on the [Kobo Sync](/kobo#reverse-proxy-configuration) page in both locations.

```nginx
location ~ ^/(api/v1/opds|api/v1/koreader|api/v1/kobo/|api/v3/|api/UserStorage/) {
    proxy_pass http://127.0.0.1:3000;

    proxy_set_header Host $host;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Host $host;
    proxy_set_header X-Forwarded-Proto $scheme;
    proxy_set_header X-Forwarded-Port $server_port;
}
```

Traefik, Authentik, and other forward-auth setups follow the same shape: match the paths above and route them straight to BookOrbit without the auth middleware.

## Verifying

Test with `curl`, not a browser.

An incognito window is not a clean test. If the browser profile is signed in to your identity provider, the proxy can complete the login in the background and let you through, so the page loads while a real device is still blocked.

```bash
curl -I https://books.example.com/api/v1/opds
```

| Response | Meaning |
|----------|---------|
| `401` with a `www-authenticate: basic` header | Working. The proxy passed the request through and BookOrbit is asking for its own credentials. |
| `302` to your identity provider | Still blocked. Check the path pattern, especially the trailing wildcard. |

Repeat for one path from each row of the table above. `/api/v3/content/checkforchanges` and `/api/UserStorage/Metadata` are the two worth checking explicitly, since a Kobo will otherwise look healthy while highlights are being dropped.

## Security Considerations

These paths no longer sit behind your identity provider, so the BookOrbit credential on each one becomes the only thing protecting it.

- Use a long random password for OPDS and KOReader accounts. Do not reuse a password from anywhere else.
- Treat a Kobo sync URL like a password. The device token in it is the entire credential.
- Consider a country or IP restriction at the edge, which applies before the login check and still covers the bypassed paths.
- Check your proxy's access logs occasionally for unexpected traffic on these paths.

The rest of your domain, including the web interface and every management endpoint, keeps its original protection.
