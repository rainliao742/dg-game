# 第一階段產生dist資料夾
FROM node:16-alpine as builder

# Localtime
ENV TZ=Asia/Taipei
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone

# ssh
# RUN apk update
# RUN apk add openssh-server
# RUN echo 'root:Docker!' | chpasswd

# COPY sshd_config /etc/ssh/
# RUN mkdir -p /tmp
# COPY ssh_setup.sh /tmp
# RUN chmod +x /tmp/ssh_setup.sh \
#    && (sleep 1;/tmp/ssh_setup.sh 2>&1 > /dev/null)

# RUN mkdir -p /opt/startup
# COPY startup.sh /opt/startup/
# RUN chmod 755 /opt/startup/startup.sh

# 指定預設/工作資料夾
WORKDIR /usr/app

# 只copy package.json檔案
COPY ./package*.json ./

# 安裝dependencies
RUN npm install

# copy其餘目錄及檔案
COPY ./ ./

COPY src src

# 指定建立build output資料夾，--prod為Production Mode
# RUN npm run build --output-path=./dist/signup -- --prod 預設是production 不用特別指定
RUN npm run build --output-path=./dist/signup

# pull nginx image
FROM nginx
COPY default.conf /etc/nginx/conf.d/default.conf
## Remove default nginx website
RUN rm -rf /usr/share/nginx/html/*
# 從第一階段的檔案copy
COPY --from=builder /usr/app/dist/signup /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
