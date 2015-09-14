PROJECT=calendar
NODE_BIN=./node_modules/.bin
SRC = index.js	\
	lib/calendar.js	\
	lib/days.js
CSS = lib/calendar.css

all: check compile

check: lint

compile: build/build.js build/build.css

build:
	mkdir -p $@

build/build.css: $(CSS) | build
	cat $^ > $@

build/build.js: node_modules $(SRC) | build
	browserify --require ./index.js:$(PROJECT) --outfile $@

.DELETE_ON_ERROR: build/build.js

node_modules: package.json
	npm install

lint:
	jshint $(SRC)

clean:
	rm -fr build node_modules

.PHONY: clean lint check all compile
