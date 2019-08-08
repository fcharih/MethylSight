# update_all.sh
# Author: Francois Charih <francoischarih@sce.carleton.ca>
# Date created: 23/10/18
#
# Description: Updates all database tables.



bash database/scripts/update_methylsight.sh
bash database/scripts/update_phosphosite.sh fcharih config/config.yaml
