from flask import Flask, request
import subprocess as sp
import json
import os
app = Flask(__name__)

@app.route('/', methods=['POST'])
def hello_world():
    try:
        os.rmdir("temp")
    except:
        pass
    content = request.get_json()
    print(content)
    input_fasta = ">{}\n{}".format(content["tag"], content["sequence"])
    open("temp.fasta", "w").write(input_fasta)
    out = sp.Popen("bash run_methylsight.sh temp.fasta json", shell=True, stdout=sp.PIPE)
    return out.communicate()[0]

if __name__ == '__main__':
    app.run(debug=True,host='0.0.0.0')
