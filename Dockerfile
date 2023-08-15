# Use an official Node.js runtime as the base image
FROM node:18.15.0

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code to the container
COPY . .

# Expose the port your app is running on
EXPOSE 5000

# Specify environment variables (change these as needed)
ENV PORT=5000
ENV MONGODB=mongodb+srv://admin:admin123@cluster0.szouswn.mongodb.net/test
ENV JWT_KEY=rishitasejgeoihgb

# Build and run the app
CMD ["npm", "start"]


# Install additional dependencies required for testing (if needed)
RUN npm install --only=development

# Run tests
RUN npm test