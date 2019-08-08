"""
parse_uniprot_entry_file.py
Author: Francois Charih <francois.charih@gmail.com>
Date created: 23/10/18

Description: Generates a JSON from the Uniprot Entry.
Parsing is based on information available at:
https://web.expasy.org/docs/userman.html which explains
how the UniprotKB database text file is organized.
"""
import argparse
import re

MODIFICATIONS_OF_INTEREST = ['methylation',
                             'ubiquitination',
                             'phosphorylation',
                             'acetylation']


def get_uniprot_id(entry):
    acc_line = entry.lstrip('\n').split('\n')[1]
    uniprot_id = acc_line.split(';')[0].split()[1]
    return uniprot_id

def get_protein_sequence(entry):
    """Gets the sequence from the entry. This method
    assumes that the sequence is ALWAYS at the end of
    the entry.
    """
    sequence_section = re.split('SQ [ ]+', entry)[1]
    newline_split_sequence = sequence_section.split('\n')[1:]
    return ''.join(newline_split_sequence).replace(' ', '')

def get_protein_length(entry):
    sequence_section = re.split('SQ [ ]+', entry)[1]
    sequence_header = sequence_section.split('\n')[0]
    return int(sequence_header.split()[1])

def get_function(entry):
    # Get comment lines
    cc_lines = [line for line in entry.split('\n') if line[:2] == 'CC']
    function = []
    should_collect = False # flag
    for i, line in enumerate(cc_lines):
        if '-!- FUNCTION:' in line:
            should_collect = True
        if (should_collect and '-!-' in line and len(function) > 0) or line[:2] != 'CC':
            break
        if should_collect:
            function.append(line)

    if len(function) == 0:
        return ''

    # Sort of hacky, but it works.
    first_line = ' '.join(function[0].split()[3:]) # otherwise, I lose the first letter?
    remaining_lines = ' '.join([line.lstrip('\t')for line in function][1:])
    return first_line + remaining_lines

def get_ptms(entry):
    valid_modifications = []

    # Get lines with MOD_RES
    mod_res_lines = list(filter(lambda line: 'MOD_RES' in line, entry.split('\n')))
    for mod_res_line in mod_res_lines:
        # create a tuple of form (position, name)
        modification_tuple = mod_res_line.split()[3:] 

        # turn into object
        modification = {
            'position': int(modification_tuple[0])
        }

        # identify the modification (TODO: should be its own function)
        if 'methyl' in modification_tuple[1]:
            modification['type'] = 'methylation'

        if 'phospho' in modification_tuple[1]:
            modification['type'] = 'phosphorylation'

        if 'acetyl' in modification_tuple[1]:
            modification['type'] = 'acetylation'

        if 'ubiq' in modification_tuple[1]:
            modification['type'] = 'ubiquitination'

        # only keep the modification if it is of interest to us
        if 'type' in modification and modification['type'] in MODIFICATIONS_OF_INTEREST:
            valid_modifications.append(modification)

    return valid_modifications

def get_regions(entry):
    regions = []

    # Get lines with MOD_RES
    lines = list(filter(lambda line: re.match('FT[ ]+(REGION|ACT_SITE|DOMAIN)', line), \
                        entry.split('\n')))

    for line in lines:
        # create a tuple of form (type, start, end, name)
        region_tuple = line.split()[1:4] + [' '.join(line.split()[4:])]

        # if the bounds are not known, skip
        if not str.isdigit(region_tuple[1]) or not str.isdigit(region_tuple[2]):
            continue

        # turn into object
        region = {
            'type': region_tuple[0],
            'start': int(region_tuple[1]),
            'end': int(region_tuple[2]),
            'name': region_tuple[3]
        }

        regions.append(region)

    return regions

def parse_uniprot_text_entry(entry):
    return { 'uniprot_id': get_uniprot_id(entry),
            'sequence': get_protein_sequence(entry),
            'length': get_protein_length(entry),
            'known_ptms': get_ptms(entry),
            'regions': get_regions(entry),
            'function': get_function(entry) }

if __name__ == '__main__':
    parser = argparse.ArgumentParser()
    parser.add_argument('-i', '--input', type=str, required=True)
    args = parser.parse_args()

    entry_text = open(args.input).read()
    # Retrieve the sequence
    print(get_uniprot_id(entry_text))
    print(get_protein_length(entry_text))
    print(get_protein_sequence(entry_text))
    print(get_ptms(entry_text))
    print(get_function(entry_text))
    print(get_regions(entry_text))
