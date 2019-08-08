"""
correct_phosphosite_positions.py
Author: Francois Charih <francois.charih@gmail.com>
Date created: 22/10/18

Description: This script corrects the phosphosite positions such that they map
to the Uniprot sequence position which ALWAYS includes the initiator methionine.
"""
import pandas as pd
import requests
from multiprocessing import Pool
from os import cpu_count
import argparse

parser = argparse.ArgumentParser(description='Parser for the phosphosite conversion script.')
parser.add_argument('-i', '--input_file', type=str, required=True, help='Path to the original phosphosite dataset.')
parser.add_argument('-o', '--output_file', type=str, required=True, help='Where the converted dataset should be saved.')
parser.add_argument('-s', '--sequences', type=str, required=False, help='Path to file with sequences of all proteins in db.')
args = parser.parse_args()

# USEFUL FUNCTIONS
def extract_window(sequence, position, window_width):
    padded_sequence = 50*'_' + sequence + 50*'_'
    return padded_sequence[position + 50 - 1 - window_width: position + 50 + window_width]

def download_sequence(uniprot_id):
    print('Downloading sequence for {}...'.format(uniprot_id))
    response = requests.get('https://www.uniprot.org/uniprot/{}.fasta'.format(uniprot_id)).text # in FASTA format

    # Handle empty response or "not found" response
    if 'found' in response:
        return None

    sequence = ''.join(response.split('\n')[1:])

    if sequence == '':
        return None

    return {'uniprot_id': uniprot_id,
            'sequence': sequence}


# Open the PhosphoSite database (normal format expected)
print('Opening database...')
db = pd.read_csv(args.input_file, sep='\t')\
    .rename(columns={ 'ACC_ID' : 'uniprot_id', 'SITE_+/-7_AA': 'phosphosite_window' })

# Only keep human
db = db[db['ORGANISM'].apply(lambda x: x.lower() == 'human')]

# Extract the PhopshoSite position
db['position'] = db['MOD_RSD'].apply(lambda rsd: int(rsd.split('-')[0][1:]))

def get_type(mod_string):
    if 'm' in mod_string:
        return 'methylation'
    elif 'p' in mod_string:
        return 'phosphorylation'
    elif 'ac' in mod_string:
        return 'acetylation'
    elif 'sm' in mod_string:
        return 'sumoylation'
    elif 'ub' in mod_string:
        return 'ubiquitination'
    else:
        raise Exception('Does not have a ptm type...')

db['type'] = db['MOD_RSD'].apply(lambda rsd: get_type(rsd.split('-')[1]))

# Capitalize the amino acids to ensure compatibility with Uniprot sequence
db['phosphosite_window'] = db['phosphosite_window'].apply(lambda window: window.upper())

if not args.sequences:
    # Download the sequences
    n_cores = cpu_count()
    pool = Pool(n_cores)

    print('Downloading the sequences.')
    sequences = pool.map(download_sequence, db['uniprot_id'].unique())
    sequences = pd.DataFrame(list(filter(lambda sequence: sequence is not None, sequences)))
else:
    sequences = pd.read_csv(args.sequences)

# Merge the db and the sequences
# NOTE: we only keep sites for which Uniprot ID can be mapped... sites that cannot
# map to a protein are doubtful... Uniprot normally redirects to the correct URL
# for equivalent accession ids/isoforms
merged = db.merge(sequences, on='uniprot_id', how='right') 

# Drop duplicates
merged = merged.drop_duplicates(['uniprot_id', 'position'])

print('Extracting windows from sequences...')
# Retrieve instances of case 1: window expected for perfect match between the windows without any compensation for initial methionine
merged['uniprot_window'] = merged.apply(lambda site: extract_window(site['sequence'], site['position'], 7), axis=1)

# Case 2: window expected if there is no methionine 
merged['uniprot_shifted_window'] = merged.apply(lambda site: extract_window(site['sequence'], site['position'] + 1, 7).replace('_M', '__'), axis=1)

print('Handling two possible cases...')
case1 = merged[merged['phosphosite_window'] == merged['uniprot_window']]
case1['uniprot_position'] = case1['position']

case2 = merged[merged['phosphosite_window'] == merged['uniprot_shifted_window']]
case2['uniprot_position'] = case2['position'] + 1 # correct for the shift

# Build the final dataframe
output = pd.concat([case1, case2], axis=0)[['uniprot_id', 'sequence', 'position', 'uniprot_position', 'type', 'phosphosite_window', 'uniprot_window', 'uniprot_shifted_window']]

# Convert to SQL format
formatted_output = output[['uniprot_id', 'position', 'uniprot_position', 'type', 'phosphosite_window']].rename(columns={'position':'phosphosite_position', 'type':'modification', 'phosphosite_window': 'phosphosite_window'})

formatted_output.to_csv(args.output_file, index=False, header=False)
