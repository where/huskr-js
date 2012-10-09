test:
	@./node_modules/.bin/mocha \
		--reporter list

build:
	@./node_modules/.bin/grunt

.PHONY: test build
