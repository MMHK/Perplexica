FROM node:slim as builder

WORKDIR /home/perplexica

COPY src /home/perplexica/src
COPY tsconfig.json /home/perplexica/
COPY sample.config.toml /home/perplexica/config.toml.template
COPY drizzle.config.ts /home/perplexica/
COPY package.json /home/perplexica/
COPY yarn.lock /home/perplexica/

RUN sed -i "s|SEARXNG = \".*\"|SEARXNG = \"${SEARXNG_API_ENDPOINT}\"|g" /home/perplexica/config.toml.template

RUN mkdir /home/perplexica/data

RUN yarn global add @vercel/ncc \
    && yarn install \
    && yarn package \
    && yarn db:push

FROM node:slim as runner

WORKDIR /home/perplexica

ENV NODE_ENV production

RUN apt-get update \
  && apt-get install -y gettext-base \
  && rm -rf /var/lib/apt/lists/* \
  && addgroup --system --gid 1001 nodejs \
  && adduser --system --uid 1001 nextjs


COPY --from=builder /home/perplexica/dist /home/perplexica/dist
COPY --from=builder /home/perplexica/data /home/perplexica/data
COPY --from=builder /home/perplexica/config.toml.template /home/perplexica/config.toml.template

RUN chown nextjs:nodejs /home/perplexica

USER nextjs

EXPOSE 3001

ENV SEARXNG_API_ENDPOINT=

CMD envsubst < config.toml.template > config.toml && node ./dist/index.js
