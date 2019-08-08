import sys

# Open the file
fasta = open(sys.argv[1]).read()
sequence = None
if fasta.startswith('>'):
    sequence = ''.join(fasta.split('\n')[1:]) # remove first line
else:
    sequence = ''.join(fasta.split('\n'))

# Extract windows
def extract_windows(amino_acid, sequence, window_size, padding_res='A'):
  """Extracts all windows centered around the amino_acid passed as a parameter.
  """
  windows = []
  for index, residue in enumerate(sequence):
    if residue is amino_acid:
      windows.append({ 'position': index + 1, 'window': extract_window(sequence, index+1, window_size, padding='A') })
  return windows


def extract_window(sequence, position, width, padding=''):
    padded_protein = 500*padding + sequence + 500*padding
    window = padded_protein[500 + position - 1 - width: 500 + position + width]
    return window.lstrip().rstrip()

windows = extract_windows('K', sequence, 35)
temp_file = open(sys.argv[2], 'w')
for window in windows:
    temp_file.write('>{}|{}\n{}\n'.format('protein', window['position'], window['window']))


