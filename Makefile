.PHONY: build

build:
	docker image build . -t sui-theme-build
	docker container run \
	 -it \
	 --rm \
	 --name sui-theme-build-container \
	 --mount type=bind,src="`pwd`/semantic.css",target=/indico-sui-theme/semantic.css \
	 --mount type=bind,src="`pwd`/semantic.js",target=/indico-sui-theme/semantic.js \
	 --mount type=bind,src="`pwd`/semantic.min.css",target=/indico-sui-theme/semantic.min.css \
	 --mount type=bind,src="`pwd`/semantic.min.js",target=/indico-sui-theme/semantic.min.js \
	 sui-theme-build
	docker image rm -f sui-theme-build
