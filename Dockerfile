# Use a lightweight Node.js image
FROM node:18-slim

# Set the working directory
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy all the application files
COPY . .

# Default port
EXPOSE 3000

# Default command for the container
CMD ["npm", "start"]