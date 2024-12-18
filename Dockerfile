# Use a lightweight Node.js image
FROM node:16-alpine

# Set working directory
WORKDIR /app

# Copy package.json and yarn.lock
COPY package.json yarn.lock ./

# Install dependencies
RUN yarn install

# Copy the entire project
COPY . .

# Expose port 5173 for Vite's development server
EXPOSE 5173

# Start the Vite development server
CMD ["yarn", "dev", "--host", "0.0.0.0", "--port", "5173"]
