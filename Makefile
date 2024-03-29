serve:
	hugo serve -D -F --gc -p 1313 $(hugoargs)

serve-prod:
	hugo serve -F --gc -p 1313 $(hugoargs)

build:
	rm -rf public && hugo --environment production --ignoreCache

new-makers-daily:
	hugo new --kind newsletter content/makers-daily/$(name)
