server:
	hugo server -D -p 1313

build:
	rm -rf public && hugo --environment production --ignoreCache
