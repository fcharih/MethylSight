import sys

##### PARAMETERS #####
WINDOW_SIZE = 70
######################

def extract_windows(amino_acid, sequence, window_size, padding_res='A'):
  """Extracts all windows centered around the amino_acid passed as a parameter.
  """
  windows = []
  for index, residue in enumerate(sequence):
    if residue is amino_acid:
      windows.append({ 'position': index + 1, 'window': generate_window(index, sequence, window_size, padding_res) })
  return windows


def generate_window(index, sequence, window_size, padding_res):
  """Generates a window given the index (not position) of an amino acid.
  """
  # Compute sequence length
  seq_length = len(sequence)

  # Initialize the required padding
  left_padding = 0
  right_padding = 0

  # Compute the amount of padding necessary
  if index + window_size >= seq_length:
    right_padding = index + window_size - seq_length + 1
  if index - window_size < 0:
    left_padding = abs(index - window_size)

  # Compute the number of available residues
  available_left = window_size if index - window_size >= 0 else index
  available_right = window_size + 1 if index + window_size + 1 < seq_length else seq_length - index

  return padding_res * left_padding + sequence[index - available_left: index + available_right] +  padding_res * right_padding

if __name__ == '__main__':

  # Arguments
  PROTEIN_NAME = sys.argv[1]
  SEQUENCE = sys.argv[2]
  JOB_ROOT = sys.argv[3]

  windows = extract_windows('K', SEQUENCE, 35)
  file = open(JOB_ROOT + '/test.fasta', 'w')
  for window in windows:
    file.write('>{}|{}\n{}\n'.format(PROTEIN_NAME, window['position'], window['window']))
