#!/usr/bin/env bash

echo Add SSH key
eval "$(ssh-agent -s)" #start the ssh agent
echo "$DEPLOY_KEY" > deploy_key.pem
chmod 600 deploy_key.pem # this key should have push access
ssh-add deploy_key.pem

echo Push deployment
git remote add deploy $REPO_URI 2>&1
git push deploy master 2>&1
