# Build stage
FROM node:18-slim AS build
WORKDIR /app
COPY package.json ./
COPY scripts ./scripts
COPY src ./src
COPY index.html ./
COPY config.js ./
RUN npm install --ignore-scripts
ARG FITTRACK_API_URL=http://backend:8080/api
ENV FITTRACK_API_URL=${FITTRACK_API_URL}
RUN npm run build

# Runtime stage
FROM nginx:1.25-alpine
ARG FITTRACK_API_URL=http://backend:8080/api
ENV FITTRACK_API_URL=${FITTRACK_API_URL}
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
