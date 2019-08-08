# update_phosphosite.sh
# Author: Francois Charih <francoischarih@sce.carleton.ca>
# Date created: 23/10/18

# Description: Updates the PhosphoSite dataset.

# Arguments from CLI
USERNAME=$1
PASSWORD=$2

# GLOBALS
TEMP_DIR="$PWD/database/temp"
COOKIE_PATH="$TEMP_DIR/cookie.txt"
MERGED_FILE="$TEMP_DIR/all_phosphosite_mods_aggregated.tsv"
CORRECTED_FILE="$PWD/database/data/phosphosite/phosphosite_latest.csv"

MODIFICATIONS=('Methylation' 'Phosphorylation' 'Acetylation' 'Sumoylation' 'Ubiquitination')

# Obtain the PhosphoSite cookie via login
curl 'https://www.phosphosite.org/loginSubmitAction.action' \
	-v \
	-H 'authority: www.phosphosite.org' \
	-H 'cache-control: max-age=0' \
	-H 'origin: https://www.phosphosite.org' \
	-H 'upgrade-insecure-requests: 1' \
	-H 'dnt: 1' \
	-H 'content-type: multipart/form-data; boundary=----WebKitFormBoundaryeDifmBqUZKN75Uwm' \
	-H 'user-agent: Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/69.0.3497.100 Safari/537.36' \
	-H 'accept: text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8' \
	-H 'referer: https://www.phosphosite.org/loginAction' \
	-H 'accept-encoding: gzip, deflate, br' \
	-H 'accept-language: en-US,en;q=0.9,fr;q=0.8' \
	--data-binary $'------WebKitFormBoundaryeDifmBqUZKN75Uwm\r\nContent-Disposition: form-data; name="username"\r\n\r\n$USERNAME\r\n------WebKitFormBoundaryeDifmBqUZKN75Uwm\r\nContent-Disposition: form-data; name="password"\r\n\r\n$PASSWORD\r\n------WebKitFormBoundaryeDifmBqUZKN75Uwm\r\nContent-Disposition: form-data; name="__checkbox_saveLogin"\r\n\r\ntrue\r\n------WebKitFormBoundaryeDifmBqUZKN75Uwm--\r\n' \
	--compressed \
	-c $COOKIE_PATH

# Get the SESSION_ID from the cookie
session_id = $(awk '{if(NR==5) print $7}' $COOKIE_PATH)

download_phosphosite() {
	curl "https://www.phosphosite.org/downloads/$1""_site_dataset.gz" \
		-H 'authority: www.phosphosite.org' \
		-H 'upgrade-insecure-requests: 1' \
		-H 'dnt: 1' \
		-H 'user-agent: Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/69.0.3497.100 Safari/537.36' \
		-H 'accept: text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8' \
		-H 'referer: https://www.phosphosite.org/staticDownloads' \
		-H 'accept-encoding: gzip, deflate, br' \
		-H 'accept-language: en-US,en;q=0.9,fr;q=0.8' \
		-H "cookie: JSESSIONID=$2;" \
		--compressed \
		-o "$3/$1.gz"
}

# Submit a GET request to get the file
for mod in "${MODIFICATIONS[@]}"; do

	# Remove old content
	rm -f "$TEMP_DIR/$mod"

	# Download the dataset
	download_phosphosite "$mod" "$session_id" "$TEMP_DIR"

	# Unzip it
	gunzip -d "$TEMP_DIR/$mod.gz"
	output_file="$TEMP_DIR/$mod"

	# Merge the datasets for the different modifications

	# Include the header for the methylation dataset
	if [[ "$mod" == "Methylation" ]]; then
		awk '{if(NR>=4) print $0}' $output_file > $MERGED_FILE
	fi

	# For the other modifications, append the content, but do not
	# include the header line
	if [[ "$mod" != "Methylation" ]]; then
			awk '{if(NR>4) print $0}' $output_file >> $MERGED_FILE
	fi
done

# Correct the phosphosite positionning
python3 "$PWD/database/scripts/correct_phosphosite_positions.py" -i "$MERGED_FILE" -o $CORRECTED_FILE

# Update the table
#docker-compose run db bash -c "export PGPASSWORD='welovekmts'; psql -h methylsight-db -U fcharih -d methylsight -f database/database.sql"
docker-compose run db bash -c "export PGPASSWORD='welovekmts'; psql -h methylsight-db -U fcharih -d methylsight -c \"DELETE FROM phosphosite_modifications;\""
docker-compose run db bash -c "export PGPASSWORD='welovekmts'; psql -h methylsight-db -U fcharih -d methylsight -c \"\copy phosphosite_modifications FROM 'database/data/phosphosite/phosphosite_latest.csv' DELIMITERS ',' CSV\""
