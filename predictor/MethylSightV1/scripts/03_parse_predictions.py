import sys
import re
import json

if __name__ == '__main__':

    # Arguments
    INPUT_FILE = sys.argv[1]
    OUTPUT_FILE = sys.argv[2]

    predictions = {'predictions' : []}
    with open(INPUT_FILE) as file:
        for line in file.readlines():
            split_line = line.split()
            if len(split_line) > 0 and str.isdigit(split_line[0]):
                position = split_line[4].split('|')[1].rstrip(')\n')
                score = float(split_line[2])
                predictions['predictions'].append({ 'position': position, 'score': score, 'residue': 'K' })
            """
          if '*' in line:
            split_line = re.split('[ ]+', line)
            position = split_line[5].split('|')[1].rstrip(')\n')
            score = split_line[4].split(',')[0].lstrip('*')
            predictions['predictions'].append({ 'position': position, 'score': score, 'residue': 'K' })
            """


    if len(sys.argv) == 4 and sys.argv[3] == '--csv':
        lines = []
        for pred in predictions['predictions']:
            lines.append('{},{}'.format(pred["position"], pred["score"]))
        print('position,score\n' + '\n'.join(lines))
    else:
        print(json.dumps(predictions))
