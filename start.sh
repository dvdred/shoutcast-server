
read -p "Build? [N/y] " isbuild
[[ "x$isbuild" == "xy" ]] && sudo docker build -t shoutserver .

sudo docker run --rm -p 8000:8000 -p 8001:8001 shoutserver &
