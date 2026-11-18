#!/bin/bash
SHA=$1
./deploy.sh staging "$SHA" || exit 1          # staging must pass first
read -p "Staging is healthy. Deploy $SHA to PRODUCTION? (yes/no) " ANSWER
# TODO: if ANSWER is "yes", run ./deploy.sh production "$SHA"; otherwise print "not approved" and stop
if [ "$ANSWER" = "yes" ] ; then
  ./deploy.sh production "$SHA"
else 
  echo "not approved";
fi
