#docker build -t prepay-front-dev .
#docker stop prepay-front-dev; docker rm prepay-front-dev; docker run -d --name prepay-front-dev -p 35175:80 prepay-front-dev 
# 39091
FROM node:24-alpine AS build-stage

WORKDIR /app

COPY ./ /app

RUN yarn install 

RUN yarn run build 

COPY . .

# Make sure we got brotli
RUN apk update
RUN apk add --upgrade brotli

#FROM nginx:stable-alpine as production-stage
FROM alpine
RUN apk add brotli nginx nginx-mod-http-brotli

#배포파일 복사
COPY --from=build-stage /app/dist /usr/share/nginx/html 

RUN mkdir -p /usr/share/nginx/html/static/images

#정적 이미지 파일 넣을 때 샘플
#COPY --from=build-stage /app/src/assets/images/logo.png /usr/share/nginx/html/static/images/logo.png
#COPY --from=build-stage /app/src/assets/images/right-img.png /usr/share/nginx/html/static/images/right-img.png

#nginx 설정 파일 복사
COPY ./nginx_origin.conf /etc/nginx/http.d/default.conf  

#내부 커스텀 헤더에 날짜값 변경
RUN sed -i "s/{1}/$(date +%s)/gi" /etc/nginx/http.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]