  #!/bin/bash
echo $(pwd)
HOST=localhost
PORT=22
H_USER=luc
ARTIFACTS_DIR="/home/$H_USER/artifacts"
APP_NAME=servicebot

echo "Deploying on server $HOST:$PORT"
mkdir -p ~/.ssh
cp ./bin/id_rsa ~/.ssh
ssh-keyscan -p $PORT -H $HOST >> ~/.ssh/known_hosts &&
scp -P $PORT ./bin/tools/deploy.sh $H_USER@$HOST:/home/$H_USER/ &&
scp -P $PORT ./dist/$APP_NAME.tar.gz $H_USER@$HOST:$ARTIFACTS_DIR &&
ssh -t -p $PORT $H_USER@$HOST "/home/$H_USER/deploy.sh $APP_NAME 3000" &&
echo "Deployed!!"
