FROM node:20.11-bookworm-slim
COPY graphserver.js .
COPY package.json .
COPY UScities.json .
RUN npm install && \
    apt-get update && \
    apt-get upgrade -y && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*
EXPOSE 4000
CMD ["node", "graphserver.js"]
