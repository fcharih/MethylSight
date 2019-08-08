FROM node:10

# Move the content into the webapp directory
# in the container
COPY . /webapp
WORKDIR webapp
RUN yarn install
RUN npm install -g nodemon

EXPOSE 8080

CMD ["npm", "run", "dev"]
