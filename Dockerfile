FROM node:10

COPY . /indico-sui-theme
WORKDIR /indico-sui-theme

ENTRYPOINT ["/bin/bash"]
CMD ["build.sh"]
