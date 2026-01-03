FROM node:20.18.0-alpine

WORKDIR /app

# Copy package files first (for Docker caching)
COPY package.json package-lock.json* ./

RUN npm install

# Copy the rest of the application
COPY . .

# Generate Prisma client before build if needed
RUN npx prisma generate

# If using TypeScript or build step, run it
RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
