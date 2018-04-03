#!/bin/bash
ARTIFACTS_DIR="/home/$USER/artifacts"
APP_NAME=$1 &&
DEPLOY_DIR=$APP_DIR/$APP_NAME &&
rm -rf $DEPLOY_DIR &&
mkdir -p $DEPLOY_DIR &&
tar xf $ARTIFACTS_DIR/$APP_NAME.tar.gz -C $DEPLOY_DIR &&
cd $DEPLOY_DIR &&
echo "$APP_NAME will be deploying at $DEPLOY_DIR"
npm install &&

pm2 describe $APP_NAME > /dev/null
RUNNING=$?

if [ "${RUNNING}" -ne 0 ]; then
  echo "Start new process of $APP_NAME at $DEPLOY_DIR" &&
  PORT=$2 pm2 start -f $DEPLOY_DIR/bin/start.js --env=production --node-args="--max-old-space-size=4096" --name=$APP_NAME &&
else
  echo "$APP_NAME started already, restarting..." &&
  pm2 restart $APP_NAME &&
fi;

echo "Done!!!"
