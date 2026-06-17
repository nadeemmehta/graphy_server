FROM node:20.11-bookworm-slim
COPY package.json .
RUN npm install
COPY graphserver.js .
COPY UScities.json .
COPY utils/ utils/
COPY schema/ schema/
COPY resolvers/ resolvers/
COPY middleware/ middleware/
EXPOSE  4000
CMD node graphserver.js
