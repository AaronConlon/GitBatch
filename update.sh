git pull
cd ./apps/v-next
rush build
pm2 restart 0
echo "v-next updated and restarted"
