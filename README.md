# OpenNext.js Cloudflare Template

This template provides the barebones configuration for deploying OpenNext.js applications on Cloudflare.

## Setup Instructions

### KV Namespace Setup

```bash
# Create a KV namespace
npx wrangler@latest kv namespace create <YOUR_NAMESPACE_NAME>
```

### Configuration Requirements

- Add your KV namespace in wrangler.jsonc
- Add your D1 namespace (must be created on the Cloudflare dashboard)
- Set your worker name in wrangler.jsonc:
  ```json
  {
    "name": "nbl-cf-template"
  }
  ```

## Accessing Bindings

```javascript
import { getCloudflareContext } from "@opennextjs/cloudflare";

export async function GET(request) {
  let responseText = "Hello World";

  const myKv = getCloudflareContext().env.MY_KV_NAMESPACE;
  await myKv.put("foo", "bar");
  const foo = await myKv.get("foo");

  return new Response(foo);
}
```

## Using getCloudflareContext in SSG Routes

```javascript
// Must be used in async mode for SSG routes
const context = await getCloudflareContext({ async: true });
```

## Managing Secrets and D1 Database

### Secrets Management

```bash
# Delete a secret
npx wrangler secret delete <KEY>
```

### D1 Database Migrations

```bash
# Generate migrations (must be done before applying)
npx drizzle-kit generate

# Apply migrations to remote D1 database
npx wrangler d1 migrations apply NEXT_TAG_CACHE_D1 --remote
```

## ⚠️ Important Warning

During Static Site Generation (SSG), use caution as:

- Secrets stored in .dev.vars files will be used
- Local development values from bindings (like values saved in a local KV) will be used for static page generation
