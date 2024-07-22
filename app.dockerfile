FROM node:alpine

ENV NEXT_PUBLIC_WS_URL= \
NEXT_PUBLIC_API_URL=

WORKDIR /home/perplexica

COPY ui /home/perplexica/

RUN yarn install
RUN yarn build

CMD ["yarn", "start"]
