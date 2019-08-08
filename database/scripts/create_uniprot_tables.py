"""
create_uniprot_tables.py
Author: Francois Charih <francoischarih@sce.carleton.ca>
Date created: 24/10/18

Description: This script downloads the UniprotKB database, parses the content
of the file and creates three different tables which can then be added to an
SQL database.
"""
import argparse
import json
import gzip
import subprocess as sp
import multiprocessing as mp
import pandas as pd
from helpers import parse_uniprot_text_entry

def parse_arguments():
    parser = argparse.ArgumentParser(description='Creates tables for UniprotKB'
                                     'data using the latest version of the'
                                     'database.')
    parser.add_argument('--config_file', '-c', type=str, required=True,
                        help="Path to the config file.")
    parser.add_argument('--output_dir', '-o', type=str, required=True,
                        help="Where the csv files should be saved.")
    parser.add_argument('--n_cpus', '-n', type=int, required=False,
                        default=1, help="Number of cores to use for parsing.")
    parser.add_argument('--verbose', '-v', action='store_true',
                        help="Log to the console.")
    args = parser.parse_args()
    return args


def download_file(url, output):
    download_cmd = 'curl -o {} {}'
    sp.run(download_cmd.format(output, url, output), shell=True)

def main():
    args = parse_arguments()

    # Parse the configs
    config = json.load(open(args.config_file))

    # Download the uniprot database and decompress
    if args.verbose: print('Downloading the UniprotKB database...')
    url = config['uniprot_url']
    output = args.output_dir + '/uniprot.dat.gz'
    download_file(url, output)

    # Parse the different entries in the database
    if args.verbose: print('Parsing the UniprotKB database...')
    file_contents = gzip.open(output).read().decode('utf-8')
    database_entries = file_contents.split('//\n')[:-1] # last is null
    print(len(database_entries))
    database_entries = list(filter(lambda x: 'NCBI_TaxID=9606' not in x, database_entries))
    entries_as_dicts = mp.Pool(args.n_cpus).map(parse_uniprot_text_entry, database_entries)

    # Go through every entry and process those
    if args.verbose: print('Filling the tables with the Uniprot data...')
    uniprot_entries = []
    uniprot_regions = []
    uniprot_ptms = []
    for entry in entries_as_dicts:
        for region in entry['regions']:
            uniprot_regions.append({
                'uniprot_id': entry['uniprot_id'],
                **region
            })

        for ptm in entry['known_ptms']:
                    uniprot_ptms.append({
                        'uniprot_id': entry['uniprot_id'],
                        **ptm
                    })
        uniprot_entries.append(entry)

    # Convert to Pandas databases
    entries_table = pd.DataFrame(uniprot_entries)
    regions_table = pd.DataFrame(uniprot_regions)
    ptms_table = pd.DataFrame(uniprot_ptms)

    # Save them to files
    entries_table[['uniprot_id', 'function', 'length', 'sequence']]\
    .to_csv(args.output_dir + '/uniprot_entries.csv', index=False, header=False)
    regions_table[['uniprot_id', 'type', 'name', 'start', 'end']]\
    .to_csv(args.output_dir + '/uniprot_regions.csv', index=False, header=False)
    ptms_table[['uniprot_id', 'position', 'type']]\
    .to_csv(args.output_dir + '/uniprot_ptms.csv', index=False, header=False)

if __name__ == '__main__':
    main()
