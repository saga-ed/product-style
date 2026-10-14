# Ops: style.wootdev.com

Same shape as `saga-ed/prototypes` (dev AWS account `396…`, `us-west-2`, no
Amplify-side build: CI builds `dist/`, zips it, uploads it).

- Profiles for local work: `saga-infra-dev` (creates resources), `saga-deploy-dev` (updates only).
- Stacks: `product-style-github-oidc-dev` (deploy role, SagaProdMax boundary),
  `product-style-amplify-dev` (app, `main` branch, auto-subdomain role).
- SSM: `/product-style/github-oidc/deploy-role-arn`, `/product-style/amplify/app-id`,
  `/product-style/amplify/default-domain`, `/product-style/amplify/autosubdomain-role-arn`.

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

## Day to day

- Push to `main` → `deploy-main.yml` → live in about two minutes.
- Non-draft PR → `pr-preview.yml` → `pr-N.style.wootdev.com` plus a PR comment.
- PR closed → `pr-cleanup.yml` deletes the branch and DNS record. The domain
  association then reports `UPDATE_FAILED` until the next PR opens; expected,
  do not widen the IAM grant to "fix" it (see prototypes/infra/OPS.md).
