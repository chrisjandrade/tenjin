docker pull mongo
docker run -d -p 27017:27017 --name mongo mongo
docker pull docker.elastic.co/elasticsearch/elasticsearch:6.4.1
docker run -d -p 9200:9200 -p 9300:9300 -e "discovery.type=single-node" --name elasticsearch docker.elastic.co/elasticsearch/elasticsearch:6.4.1
