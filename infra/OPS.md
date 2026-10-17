# Ops: style.wootdev.com

Same shape as `saga-ed/prototypes` (dev AWS account `396…`, `us-west-2`, no
Amplify-side build: CI builds `dist/`, zips it, uploads it).

- Profiles for local work: `saga-infra-dev` (creates resources), `saga-deploy-dev` (updates only).
- Stacks: `product-style-github-oidc-dev` (deploy role, SagaProdMax boundary),
  `product-style-amplify-dev` (app, `main` branch, auto-subdomain role); in the
  prod account, `product-style-github-publish-role` (package publishing, below).
- SSM: `/product-style/github-oidc/deploy-role-arn`, `/product-style/amplify/app-id`,
  `/product-style/amplify/default-domain`, `/product-style/amplify/autosubdomain-role-arn`
  (dev); `/product-style/github-oidc/publish-role-arn` (prod).

## One-time setup

```bash
sam deploy --config-file infra/github-oidc/samconfig.yaml --config-env dev --profile saga-infra-dev
ROLE_ARN=$(aws ssm get-parameter --name /product-style/github-oidc/deploy-role-arn --query Parameter.Value --output text --profile saga-dev)
gh variable set AWS_DEPLOY_ROLE_ARN --body "$ROLE_ARN" --repo saga-ed/product-style
# GitHub environment "dev" must exist (workflows reference it)
sam deploy --config-file infra/amplify/samconfig.yaml --config-env dev --profile saga-infra-dev
APP_ID=$(aws ssm get-parameter --name /product-style/amplify/app-id --query Parameter.Value --output text --profile saga-dev)
ROLE=$(aws ssm get-parameter --name /product-style/amplify/autosubdomain-role-arn --query Parameter.Value --output text --profile saga-dev)
aws amplify create-domain-association --app-id "$APP_ID" --domain-name style.wootdev.com \
  --sub-domain-settings prefix=,branchName=main --enable-auto-sub-domain \
  --auto-sub-domain-creation-patterns 'pr-*' --auto-sub-domain-iam-role "$ROLE" --profile saga-infra-dev
```

The domain association is created by CLI, not CloudFormation, because CFN
times out waiting for ACM validation. Expect `PENDING_VERIFICATION` for
minutes; `aws amplify get-domain-association` shows progress.

## Package publishing (`@saga-ed/product-style`, prod account)

The CSS and generated `tokens.json` / `tokens.ts` are published to the prod
account's `saga_js` CodeArtifact registry (`publish-package.yml`, manual
dispatch from `main` only). The Amplify deploy role above is dev-only and has
no CodeArtifact write, so publishing uses a second role in the **prod**
account (`531…`), stack `product-style-github-publish-role`, template
`infra/github-oidc/publish-role-template.yaml`, role `ProductStylePublishRole`
(trust pinned to `refs/heads/main`, both subject forms). One-time setup:

```bash
sam deploy --config-file infra/github-oidc/samconfig.yaml --config-env publish --profile saga-infra-prod
ROLE_ARN=$(aws ssm get-parameter --name /product-style/github-oidc/publish-role-arn --query Parameter.Value --output text --profile saga-prod)
gh variable set AWS_PUBLISH_ROLE_ARN --body "$ROLE_ARN" --repo saga-ed/product-style
```

`AWS_PUBLISH_ROLE_ARN` is a repo-level variable (not in the `dev` environment;
the publish job declares no environment). The workflow's setup action writes
the CodeArtifact token to `~/.npmrc` on the runner; the tracked `.npmrc` holds
only the `@saga-ed` registry line. Release steps are in the README.

## Gotchas met on first setup

- **Immutable OIDC subject.** New GitHub repos get `use_immutable_subject: true`
  (`gh api repos/saga-ed/product-style/actions/oidc/customization/sub`), so the
  token's `sub` is `repo:saga-ed@<org-id>/product-style@<repo-id>:…`. The
  trust policy accepts both forms.
- **Domain association needs Route 53 write on the caller.** `saga-infra-dev`
  cannot `route53:ChangeResourceRecordSets` on the wootdev.com zone, so run
  `create-domain-association` with `saga-admin-dev`. The association sits in
  `PENDING_DEPLOYMENT` until the first successful deploy of `main`.

## Day to day

- Push to `main` → `deploy-main.yml` → live in about two minutes.
- Non-draft PR → `pr-preview.yml` → `pr-N.style.wootdev.com` plus a PR comment.
- PR closed → `pr-cleanup.yml` deletes the branch and DNS record. The domain
  association then reports `UPDATE_FAILED` until the next PR opens; expected,
  do not widen the IAM grant to "fix" it (see prototypes/infra/OPS.md).
