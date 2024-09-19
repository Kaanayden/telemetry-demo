
FROM node:22
WORKDIR /usr/src/app
COPY package.json yarn.lock ./

# Install dependencies using Yarn
RUN yarn install

COPY . .

# Expose the app's port (using environment variable)
EXPOSE 3000

# Start the application
CMD ["yarn", "start"]