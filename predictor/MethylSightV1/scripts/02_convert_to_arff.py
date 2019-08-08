import sys

arff = """@relation features

"""

fasta_names = """@attribute FASTA_NAME {}
"""

attributes = """@attribute IP_ES_25_N1 numeric
@attribute Z3_IB_4_N1 numeric
@attribute Z1_IB_10_N1 numeric
@attribute Z1_IB_5_N1 numeric
@attribute Z3_IB_8_N1 numeric
@attribute ECI_IB_4_N1 numeric
@attribute ECI_IB_5_N1 numeric
@attribute Gs(U)_IB_12_N1 numeric
@attribute Gs(U)_IB_68_N1 numeric
@attribute Gs(U)_IB_58_N1 numeric
@attribute Gs(U)_IB_60_N1 numeric
@attribute Z1_NO_sideL35_M numeric
@attribute HP_NO_sideL35_CV numeric
@attribute Z1_NO_sideR35_CV numeric
@attribute Pb_NO_sideR35_S numeric
@attribute IP_NO_sideL35_SI71 numeric
@attribute Z1_NO_PRT_CV numeric
@attribute Z2_NO_AHR_CV numeric
@attribute Gs(U)_NO_ALR_SI71 numeric
@attribute Z3_NO_UCR_S numeric
@attribute Z3_NO_UCR_N1 numeric
@attribute ECI_NO_UCR_CV numeric
@attribute Pa_NO_BSR_SI71 numeric
@attribute ISA_NO_NPR_S numeric
@attribute Z3_NO_NPR_V numeric
@attribute IP_NO_PLR_S numeric
@attribute Pb_NO_PCR_V numeric
@attribute ECI_NO_PCR_CV numeric
@attribute class {P,N}

@data
"""

INPUT_FILE = sys.argv[1]
OUTPUT_FILE = sys.argv[2]

names = []
input_file = open(INPUT_FILE)
for i, line in enumerate(input_file.readlines()[1:]):
      site = line.split('\t')[0]
      names.append(site)
      features = line.replace(',', '').split('\t')[1:]
      features = [str(round(float(feature), 2)) for feature in features]
      #attributes += ','.join(line.replace(',', '').split('\t')[1:])[:-1] + ',?\n'
      attributes += '\'{}\''.format(site) + ','+ ','.join(features) + ',?\n'

output_file = open(OUTPUT_FILE, 'w')
fasta_names = '@attribute FASTA_NAME {{{}}}\n'.format(str(','.join(names)))
output_file.write(arff+fasta_names+attributes)
