
#docker build -t nest-api .
#docker run -d --name nest-api --network nest-network --env-file .env -p 3000:3000 nest-api

FROM node:22.9.0-alpine AS build-stage

WORKDIR /app

COPY package.json yarn.lock ./
RUN yarn install --production

COPY . .
RUN yarn build

## Production Stage
FROM node:22.9.0-alpine

WORKDIR /app

ENV NODE_ENV=production
ENV TZ=Asia/Seoul

# PM2 설치 (글로벌)
RUN yarn global add pm2

COPY --from=build-stage /app/dist ./dist
COPY --from=build-stage /app/node_modules ./node_modules
COPY --from=build-stage /app/package.json ./package.json
COPY ecosystem.config.js ./ecosystem.config.js

RUN mkdir -p logs

EXPOSE 3000

# ⭐ PM2 Runtime 사용 (중요)
CMD ["pm2-runtime", "ecosystem.config.js"]