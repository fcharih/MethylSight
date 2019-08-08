REMOTE=cubiccloud

# Build the client
cd client
npm run build
cd ..

# Build the database
if [ "$1" = "--db" ]; then
	cd database
	python3 setup_database.py
	cd ..
fi

# Push
ssh $REMOTE "rm -rf methylsight && mkdir methylsight"
rsync -r --progress  --exclude=node_modules --exclude=client * cubiccloud:methylsight/
ssh $REMOTE "cd methylsight && docker-compose down"
ssh $REMOTE "cd methylsight && docker-compose build"
ssh $REMOTE "cd methylsight && docker-compose up -d"
