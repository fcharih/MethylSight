"""
update_all.py
Author: Francois Charih <francoischarih@sce.carleton.ca>
Date created: 23/10/18

Description: Updates all the tables in the database.
"""
import argparse
import subprocess as sp
import yaml

# ARGUMENT PARSER
def parse_arguments():
    parser = argparse.ArgumentParser(description='')
    parser.add_argument('--config_file',
                        '-c',
                        type=str,
                        required=True,
                        help="Path to the config file.")
    parser.add_argument('--verbosity',
                        '-v',
                        help='Verbose mode; everything gets logged to the console.',
                        action='store_true')
    args = parser.parse_args()
    return args

def main():
    args = parse_arguments()

    config = yaml.load(open(args.config_file).read())
    sp.run(['bash', './database/scripts/update_phosphosite.sh',
            config['phosphosite_user'], config['phosphosite_password']])

    sp.run(['bash', './database/scripts/update_methylsight.sh'])

if __name__ == '__main__':
    main()
