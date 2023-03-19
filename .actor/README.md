## This is MRE of Dataset.pushData (from Crawlee) strange behaviour 
### Install deps 
```sh
npm i
```
### Run fake server 
```sh
npm run fake-server 
```

### Run crawler
```sh
npm run start
```


#### It requires multiple runs of crawler to reproduce this behaviour. 
#### This crawler is expected to collect data in three steps and save collected entries to seprate files (20 files expected).
#### I was getting from 15 to 20 files from run to run. 
