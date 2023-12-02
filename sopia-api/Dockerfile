FROM node:18.17.1-alpine3.18 as builder

# App directory
WORKDIR /app

# App dependencies
COPY package*.json ./
RUN npm i

# Copy app source code
COPY . .

# Env setup
COPY .env.example .env

#Expose port and begin application
EXPOSE 9001

# Start the app
CMD [ "npm", "run", "start:dev"]