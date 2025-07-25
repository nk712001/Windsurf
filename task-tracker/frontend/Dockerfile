FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
# Use npm install instead of ci to avoid issues with package-lock.json
RUN npm install
COPY . .
RUN npm run build

# Production stage
FROM nginx:alpine
COPY --from=0 /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
