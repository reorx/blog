serve:
	hugo serve -D -p 1313 $(hugoargs)

build:
	rm -rf public && hugo --environment production --ignoreCache
