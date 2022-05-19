serve:
	hugo serve -D -p 1313

build:
	rm -rf public && hugo --environment production --ignoreCache
