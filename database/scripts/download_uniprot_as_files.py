"""
download_uniprot_as_files.py
Author: Francois Charih <francois.charih@gmail.com>
Date created: 23/10/18

Description: Splits the text database into a set of files, each of which
corresponds to a particular protein.
"""
import argparse
import subprocess as sp
import re
import os
import json
from parse_uniprot_entry_file import *

def parse_arguments():
    parser = argparse.ArgumentParser()
    parser.add_argument('-i', '--database_file', type=str, required=True, help="Path to the uniprot database file.")
    parser.add_argument('-d', '--download', type=bool, required=False, default=False, help="Whether the file should be updated.")
    parser.add_argument('-o', '--output_folder', type=str, required=True, help='Path to the directory where the files should be saved.')
    return parser.parse_args()

def parse_entry(entry):
    return { 'uniprot_id': get_uniprot_id(entry),
            'sequence': get_protein_sequence(entry),
            'length': get_protein_length(entry),
            'known_ptms': get_ptms(entry),
            'regions': get_regions(entry),
            'function': get_function(entry) }


def main():
    if args.download:
        sp.run('wget -O {}.gz ftp://ftp.uniprot.org/pub/databases/uniprot/current_release/knowledgebase/complete/uniprot_sprot.dat.gz && gzip -d {}.gz'.format(args.database_file, args.database_file),
               shell=True)

    # Open the UniprotKB file
    print('Opening the database file {}...'.format(args.database_file))
    database_content = open(args.database_file).read()
    entries = database_content.split('//\n')

    # Only keep human entries
    human_entries = list(filter(lambda entry_string: 'NCBI_TaxID=9606' in entry_string, entries))

    # Create the files
    print('Deleting old files.')
    sp.run('rm {}/*'.format(args.output_folder), shell=True)
    print('Creating separate files in {}...'.format(args.output_folder))
    for entry in human_entries:

        # Parse the entry
        entry_dict = parse_entry(entry)

        # Save as a json file
        output_path = os.path.join(args.output_folder, '{}.json'.format(json_format['uniprot_id']))
        open(output_path, 'w').write(json.dumps(entry_dict))

if __name__ == '__main__':
    main()
