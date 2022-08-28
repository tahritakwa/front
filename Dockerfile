
# Serve app with nginx server

# Use official nginx image as the base image
FROM nginx:stable-alpine

# Copy the build output to replace the default nginx contents.
WORKDIR /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf
COPY gendist/ .

# Expose port 80
EXPOSE 80

