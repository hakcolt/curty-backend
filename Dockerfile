FROM node:19.5-alpine AS build
WORKDIR /app/build
COPY package*.json ./
RUN npm ci
COPY prisma ./prisma
RUN npm run prisma:generate
COPY ./ ./
RUN npm run build

FROM node:19.5-alpine
WORKDIR /app
COPY .env ./
COPY package*.json ./
RUN npm ci --production
COPY --from=build /app/build/dist ./dist
COPY --from=build /app/build/node_modules/.prisma ./node_modules/.prisma
CMD ["npm", "start"]
