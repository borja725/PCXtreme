FROM php:8.2-fpm

RUN apt-get update \
    && apt-get install -y git unzip libicu-dev libpq-dev libzip-dev libpng-dev libjpeg-dev libfreetype6-dev libonig-dev \
    && docker-php-ext-install intl pdo pdo_pgsql opcache zip gd

RUN curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer

WORKDIR /app
COPY . .

ENV COMPOSER_ALLOW_SUPERUSER=1

RUN composer install -vvv

RUN mkdir -p var/cache var/log && chown -R www-data:www-data var

RUN apt-get install -y curl \
    && curl -1sLf 'https://caddyserver.com/api/download?os=linux&arch=amd64' -o /usr/bin/caddy \
    && chmod +x /usr/bin/caddy

COPY Caddyfile /etc/caddy/Caddyfile

EXPOSE 8080

CMD ["caddy", "run", "--config", "/etc/caddy/Caddyfile", "--adapter", "caddyfile"]
