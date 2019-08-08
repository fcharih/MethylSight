rm -rf temp/*
python parse_input.py $1 temp/temp.fasta
cd software/ProtDCal_v3.5
java -jar ProtDCal.jar -i ../../temp -o ../../temp -f fasta -x kme28_features.idl > /dev/null
cd ../../
python scripts/02_convert_to_arff.py ./temp/kme28_features/kme28_features_Prot.txt ./temp/features.arff
java -Xmx1000m -cp ./software/weka-3-8-1/weka.jar weka.classifiers.misc.InputMappedClassifier -no-cv -M -L ./model_Sept23_COMBO.model -t ./temp/features.arff -p 1 -distribution > ./temp/predictions.txt
if [ "$2" = "csv" ]; then
python scripts/03_parse_predictions.py ./temp/predictions.txt ./temp/results.csv --csv
fi
if [ "$2" = "json" ]; then
python scripts/03_parse_predictions.py ./temp/predictions.txt ./temp/results.csv
fi

