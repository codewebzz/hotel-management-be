# Stage 1: Build
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

RUN npm run build

# Stage 2: Production
FROM node:20-alpine

WORKDIR /app

COPY package*.json ./

ENV DB_HOST=localhost
ENV DB_PORT=5432
ENV DB_USERNAME=hms-admin
ENV DB_PASSWORD=hms@dmin@123
ENV DB_NAME=hotel_management
ENV NODE_ENV=development
ENV PORT=4000
ENV JWT_SECRET=yertywetrewytrewyrtewytrywetr
ENV JWT_EXPIRES_IN=24h

RUN npm install --omit=dev
RUN npm run seed

COPY --from=builder /app/dist ./dist

EXPOSE 3000

CMD ["node", "dist/index.js"]