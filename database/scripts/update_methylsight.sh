# update_methylsight.sh
# Author: Francois Charih <francoischarih@sce.carleton.ca>
# Date created: 23/10/18
#
# Description: Just adds the MethylSight csv file content to the Postgres database.

password_cmd="export PGPASSWORD=welovekmts;"
base_cmd="$password_cmd psql -h methylsight-db -U fcharih -d methylsight -c"
deletion_query="DELETE FROM methylsight_predictions;"
insertion_query="\copy methylsight_predictions FROM 'database/data/methylsight/methylsight_latest.csv' DELIMITERS ',' CSV;"


deletion_cmd="$base_cmd \"$deletion_query\""
insertion_cmd="$base_cmd \"$insertion_query\""

docker-compose run db bash -c "$deletion_cmd"
docker-compose run db bash -c "$insertion_cmd"

