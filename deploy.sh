# 0 · setup
#!/bin/bash
set -u
ENV=$1
SHA=$2
USER=sunacchii007
IMAGE=$USER/taskboard

if [ "$ENV" = "production" ]; then PORT=3000; else PORT=3001; fi
NAME=tb-$ENV
RECORD=.deployed-$ENV

PREV=$(cat "$RECORD" 2>/dev/null)

echo "Deploying $IMAGE:$SHA to $ENV (previous: ${PREV:-none})"

# 1 · pull
docker pull "$IMAGE:$SHA"

# 2 · replace
docker stop "$NAME" 2>/dev/null
docker rm "$NAME" 2>/dev/null
if ! docker run -d --name "$NAME" -p "$PORT:3000" -e APP_VERSION="$SHA" "$IMAGE:$SHA"; then
  echo "❌ container failed to start"
  exit 1
fi
# 3 · smoke test
OK=0
for i in 1 2 3 4 5 6 7 8 9 10; do
  if curl -sf "localhost:$PORT/health" | grep -q "$SHA"; then
  
    OK=1
    break
  fi
  sleep 1
done

# 4 · decide
if [ "$OK" = "1" ]; then
  echo "$SHA" > "$RECORD"
  echo "✅ $ENV is healthy on $SHA"
else
  echo "❌ smoke test failed on $ENV — rolling back"
  docker stop "$NAME" 2>/dev/null
  docker rm "$NAME" 2>/dev/null
  if [ -n "$PREV" ]; then
    docker run -d --name "$NAME" -p "$PORT:3000" \
      -e APP_VERSION="$PREV" "$IMAGE:$PREV"
    echo "🔙 rolled back $ENV to $PREV"
  fi
  exit 1
fi
