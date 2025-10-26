# Build stage
FROM node:18-slim AS build
WORKDIR /app

COPY package.json ./
COPY vite.config.js ./
COPY postcss.config.js ./
COPY tailwind.config.js ./
COPY index.html ./
COPY src ./src

ARG VITE_API_URL=http://backend:8080/api
ENV VITE_API_URL=${VITE_API_URL}

RUN npm install --ignore-scripts
RUN npm run build

# Runtime stage
FROM nginx:1.25-alpine
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
