# Deploy to Production

Deploy the current changes to production:

1. Commit any uncommitted changes (ask for commit message if needed)
2. Push to origin
3. SSH to brianneradt.com and run:
   ```bash
   cd ~/www/repos/roman.brianneradt.com
   git remote update
   git checkout main
   git reset --hard origin/main
   cd ~/www/http-server
   git remote update
   git checkout main
   git reset --hard origin/main
   docker compose stop roman
   docker compose build roman
   docker compose up -d roman
   ```
4. Tail the logs briefly to confirm startup succeeded
