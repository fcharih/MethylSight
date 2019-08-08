import sys
import xml.etree.ElementTree as etree
import multiprocessing
import json
import subprocess as sp
import os
from xmljson import yahoo
import pandas as pd

UNIPROT_DB_URL = 'ftp://ftp.uniprot.org/pub/databases/uniprot/current_release/knowledgebase/complete/uniprot_sprot.xml.gz'
UNIPROT_NS = '{' + 'http://uniprot.org/uniprot' + '}'


df = pd.read_csv('data/methylsight/methylsight_latest.csv')

def get(key, entry):
    if isinstance(entry[key], list):
        return entry[key] 
    else:
        return [entry[key]]

def modification_as_obj(mod, entry):
    name = mod['description']
    position = int(mod['location']['position']['position'])
    modification = None
    if 'methyl' in name.lower():
        modification = 'methylation'
    elif 'phosph' in name.lower():
        modification = 'phosphorylation'
    elif 'ubiqu' in name.lower():
        modification = 'ubiquitination'
    elif 'acetyl' in name.lower():
        modification = 'acetylation'
    else:
        modification = 'other'

    return {
        'residue': entry['sequence']['content'][position - 1],
        'position': position,
        'modification': modification
    }

def end_is_defined(region):
    return 'position' in region['location'] or ('position' in region['location']['end'] and 'position' in region['location']['begin'])

def retrieve_ms_score(accession_id):
    sub = df[df['uniprot_id'] == accession_id]
    return sub[['uniprot_id', 'position', 'score']].to_dict(orient='record')

def region_as_obj(region):
    begin = None
    end = None
    try:
        if 'position' in region['location']:
            begin = region['location']['position']['position']
            end = region['location']['position']['position']
        else:
            begin = region['location']['begin']['position']
            end = region['location']['end']['position']
    except:
        print(region)
    return {
        'begin': begin,
        'end': end,
        'description': region['description'] if 'description' in region else None,
    }

def simplify_json(json_entry):
    accession_id = get('accession', json_entry)[0]
    name = get('fullName', json_entry['protein']['recommendedName'])[0]
    if isinstance(name, dict):
        name = name['content']
    sequence = json_entry['sequence']['content'].replace(" ", "")
    ptms = list(filter(lambda feature: feature['type'] == 'modified residue', get('feature', json_entry)))
    ptms = list(map(lambda mod: modification_as_obj(mod, json_entry), ptms))
    regions = list(filter(lambda feature: feature['type'] == 'region of interest', get('feature', json_entry)))
    regions = list(filter(lambda region: end_is_defined(region), regions))
    regions = list(map(lambda mod: region_as_obj(mod), regions))
    methylsight_scores = retrieve_ms_score(accession_id)

    try:
        description = list(filter(lambda x: x["type"] == "function", json_entry["comment"]))
        if len(description) > 0:
            description = description[0]
            description = description["text"]["content"]
        else:
            description = description["text"]
    except:
        description = None

    simplified = {
        'accessionId': accession_id,
        'name': name,
        'description': description,
        'sequence': sequence,
        'ptms': ptms,
        'regions': regions,
        'methylsightScores': methylsight_scores
    }

    print(simplified)
    return simplified


def download_uniprot():
    sp.run(f'wget -O data/uniprot_sprot.xml.gz {UNIPROT_DB_URL}', shell=True)
    sp.run('cd data && gunzip uniprot_sprot.xml.gz', shell=True)

def parse_xml_entry(xml):
    parsed = yahoo.data(etree.fromstring(xml))
    string = json.dumps(parsed).replace(UNIPROT_NS, '')
    return json.loads(string)['entry']

def save_file(entry_loc):
    parsed = parse_xml_entry(entry_loc[1])

    accession_ids = parsed['accession']

    if isinstance(accession_ids, str):
        accession_id = accession_ids
    elif isinstance(accession_ids, list):
        accession_id = accession_ids[0]
    else:
        raise "No accession!"

    open(f'{entry_loc[0]}/{accession_id}.json', 'w').write(json.dumps(simplify_json(parsed), indent=4))


if __name__ == '__main__':

    VERBOSE = True
    LOCATION = 'data/uniprot/simple'

    if VERBOSE: print('Downloading and unzipping Uniprot...')
    download_uniprot()
    
    if VERBOSE: print('Loading file...')
    file = open('data/uniprot_sprot.xml', 'r').read()

    if VERBOSE: print('Processing file...')
    # Split entries
    file = file.split('<entry')[1:-1]
    file = list(map(lambda x: ('<entry' + x), file))
    # Only keep human entries
    file = list(filter(lambda x: "<name type=\"scientific\">Homo sapiens</name>" in x, file))
    # Map to tuples with export location
    file = list(map(lambda x: (LOCATION, x), file))

    if VERBOSE: print('Saving Uniprot entries as json files...')
    multiprocessing.Pool(12).map(save_file, file)

    # Remove uniprot file
    os.remove('data/uniprot_sprot.xml')

