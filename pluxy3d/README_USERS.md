Users Admin page expects NEXT_PUBLIC_API_URL to be set to the backend base URL.

Example in .env.local:

NEXT_PUBLIC_API_URL=http://localhost:5299/api

## Test de deployment - Frontend configurado correctamente para deployments independientes

### Production environment (security)

Do not commit production backend URLs or other secrets to the repository. Create a GitHub Actions repository secret called `NEXT_PUBLIC_API_URL` with the production backend base URL and reference it from your workflow when building the frontend. Example snippet for a workflow step:

```yaml
env:
	NEXT_PUBLIC_API_URL: ${{ secrets.NEXT_PUBLIC_API_URL }}
```

This prevents leaking sensitive endpoints in the git history and keeps the build reproducible.
