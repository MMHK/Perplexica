FROM node:slim

WORKDIR /home/perplexica

RUN apt-get update \
    && apt-get install -y gettext-base \
    && rm -rf /var/lib/apt/lists/*

COPY src /home/perplexica/src
COPY tsconfig.json /home/perplexica/
COPY sample.config.toml /home/perplexica/config.toml.template
COPY drizzle.config.ts /home/perplexica/
COPY package.json /home/perplexica/
COPY yarn.lock /home/perplexica/

RUN sed -i "s|SEARXNG = \".*\"|SEARXNG = \"${SEARXNG_API_URL}\"|g" /home/perplexica/config.toml.template

RUN mkdir /home/perplexica/data

RUN yarn install
RUN yarn build

ENV SEARXNG_API_URL=

CMD envsubst < config.toml.template > config.toml && yarn start
