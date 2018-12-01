FROM musixise/tengine
VOLUME ["/var/log/nginx"]
VOLUME ["/var/cache/nginx"]
ADD ./ /etc/nginx/html/
