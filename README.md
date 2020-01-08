# MethylSight

<div align="center"><img src="https://github.com/flexplicateur/MethylSight/blob/master/client/src/static/animated_logo.gif" /></div>

PerfectSense is a software that performs data fusion on sensor data in order to obtain
accurate estimates from equipment with uncertainty.

MethylSight is an support vector machine (SVM)-based lysine methylation prediction predictor. Our predictor
was trained using physicochemical features extracted with <a href="https://protdcal.zmb.uni-due.de/" target="_blank">ProtDCal</a>,
bypassing the need for computationally expensive sequence alignment.

MethylSight extracts lysine-centered windows of 71 residues and computes 28 features, before classfying
them with a trained SVM model.

A pre-print of the paper associated with the description of the software
is available <a href="https://www.biorxiv.org/content/10.1101/274688v1" target="_blank">here</a>.

## Principal maintainers

- *Francois Charih* - francoischarih@sce.carleton.ca - Carleton University
- *Kyle K. Biggar* - kyle_biggar@carleton.ca - Carleton University
- *James R. Green* - jrgreen@sce.carleton.ca - Carleton University

## Repository contents

This repository comprises three things:

* The web server implementation (in `src/`)
* The React.js-based web client (in `client/`)
* The standalone predictor (in `predictor/MethylSightV1`)

## Running MethylSight

To run MethylSight, you will need to install Docker on your platform.

Then, you will need to create a container and download some software, i.e. weka and ProtDCal which will
be installed for you if you run the commands below.

```
$ git clone https://github.com/flexplicateur/MethylSight.git && cd MethylSight
$ wget http://cu-bic.ca/flexplicateur/software.tar.gz \
  && tar -zxvf software.tar.gz -C predictor/MethylSightV1 \
  && rm software.tar.gz
$ docker-compose build
$ docker-compose up -d
```

MethylSight will then be listening on port 5000 and waiting for requests. You can then
submit requests to the port 5000 using `curl`

```
$ curl -X POST -H "Content-Type: application/json" \
    -d '{ "tag": ">protein_name", "sequence": "MYPRTEINHASAKHERE"  }' \
    http://localhost:5000
```

## License

This project is licensed under the MIT License - see the LICENSE.md file for details
