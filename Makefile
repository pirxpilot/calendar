PROJECT=calendar
NODE_BIN=./node_modules/.bin
SRC = index.js	\
	lib/calendar.js	\
	lib/days.js

all: check build

check: lint test

build: build/build.js build/build.css

build/build.js: $(SRC) node_modules
	mkdir -p build
	$(NODE_BIN)/browserify \
		--transform stringify \
		--require ./index.js:$(PROJECT) \
		--outfile $@

build/build.css: lib/calendar.css
	cp $< $@

lint: | node_modules
	$(NODE_BIN)/jshint $(SRC)

test: | node_modules
	$(NODE_BIN)/mocha --reporter spec

node_modules: package.json
	npm install

clean:
	rm -fr build node_modules

.PHONY: clean lint test check all build
