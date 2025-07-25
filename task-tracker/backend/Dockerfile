FROM node:18-alpine

WORKDIR /app

COPY package*.json ./

# Use npm install instead of ci to avoid issues with package-lock.json
RUN npm install

COPY . .

EXPOSE 5000

CMD ["npm", "start"]
