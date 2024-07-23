FROM node:alpine AS builder
WORKDIR /app

COPY ui /app/

RUN yarn install \
  && yarn run output

FROM node:alpine as runner

WORKDIR /home/perplexica

ENV NODE_ENV production

COPY ui /home/perplexica/

RUN addgroup --system --gid 1001 nodejs \
  && adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public

RUN mkdir .next
RUN chown nextjs:nodejs .next

# Automatically leverage output traces to reduce image size
# https://nextjs.org/docs/advanced-features/output-file-tracing
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV NEXT_PUBLIC_WS_URL= \
NEXT_PUBLIC_API_URL=

CMD HOSTNAME="0.0.0.0" node server.js
